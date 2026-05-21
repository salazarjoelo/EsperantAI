/**
 * EsperantAI License Backend
 * ==========================
 * Express server que:
 *   1. Recibe license keys del cliente (UUID emitido por LemonSqueezy)
 *   2. Valida contra LemonSqueezy API (server-side, con LEMONSQUEEZY_API_KEY)
 *   3. Emite JWT firmado con Ed25519 conteniendo { tier, instances, expires }
 *   4. (opcional) Recibe webhook de LemonSqueezy en /webhook con HMAC-SHA256
 *
 * Z-SEC-04: los JWT ahora incluyen claim jti (JWT ID único via randomUUID).
 *           Se agregó endpoint POST /verify-jwt que verifica firma + jti +
 *           revocación. Map LRU en memoria (10k) + persistencia a disco JSON.
 *
 * Z-SEC-05: revokedKeys migrado de Set (memoria volátil) a SQLite con
 *           WAL journal. Las revocaciones del webhook sobreviven restart.
 *
 * Cliente verifica el JWT con crypto.subtle.verify usando la clave pública
 * embebida en core/license-manager.js — sin red, sin posibilidad de tampering
 * (modificar el JS NO funciona porque la firma se rompería).
 *
 * Despliegue: /opt/esperantai-license/ en VPS Hostinger 187.77.23.49.
 * Apache reverse proxy: license.edugame.digital → http://127.0.0.1:3201
 *
 * Refactor DS-301 (DeepSeek): exporta createApp(deps?) para permitir tests
 * con inyección de dependencias sin tocar variables de entorno ni red real.
 */

import express from 'express';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { importPKCS8, SignJWT, exportSPKI, importSPKI, jwtVerify } from 'jose';
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import Database from 'better-sqlite3';

// ─── Constantes ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3201;
const HOST = process.env.HOST || '127.0.0.1';
const JWT_TTL_DAYS = Number(process.env.JWT_TTL_DAYS || 30);
const JWT_ISSUER = 'license.edugame.digital';
const JWT_AUDIENCE = 'esperantai-client';
const DB_PATH = process.env.DB_PATH || '/var/lib/esperantai/revocations.db';
const JTI_STORE_PATH = process.env.JTI_STORE_PATH || '/var/lib/esperantai/active-jtis.json';
const JTI_STORE_MAX = 10000;
const JTI_PERSIST_INTERVAL_MS = 60000; // persistir cada 60s

// ─── Helpers ──────────────────────────────────────────────────────────────
function inferTierFromMeta(meta) {
    const variantId = meta?.variant_id ?? meta?.custom_data?.variant_id;
    const VARIANT_MAP = {
        [process.env.LEMONSQUEEZY_VARIANT_PRO]: 'pro',
        [process.env.LEMONSQUEEZY_VARIANT_PRO_PLUS]: 'pro_plus',
    };
    delete VARIANT_MAP[undefined];
    return VARIANT_MAP[variantId] || null;
}

function mapLicenseError(error) {
    const raw = String(error || 'invalid');
    const normalized = raw.toLowerCase();
    const exact = {
        license_key_not_found: 'invalid',
        license_key_expired: 'expired',
        license_key_disabled: 'revoked',
        too_many_activations: 'limit_reached',
    }[raw];
    if (exact) return exact;
    if (normalized.includes('activation limit')) return 'limit_reached';
    if (normalized.includes('expired')) return 'expired';
    if (normalized.includes('disabled') || normalized.includes('revoked')) return 'revoked';
    if (normalized.includes('not found')) return 'invalid';
    return 'invalid';
}

function safeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    try {
        return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
    } catch {
        return false;
    }
}

// ─── Z-SEC-04: LRU store para JTIs emitidos ──────────────────────────────
function createJtiStore(maxSize = JTI_STORE_MAX) {
    const map = new Map();

    function add(jti, entry) {
        if (map.size >= maxSize) {
            const firstKey = map.keys().next().value;
            map.delete(firstKey);
        }
        map.set(jti, { ...entry, _ts: Date.now() });
    }

    function has(jti) {
        if (!map.has(jti)) return false;
        const entry = map.get(jti);
        map.delete(jti);
        map.set(jti, entry);
        return true;
    }

    function get(jti) {
        if (!map.has(jti)) return null;
        const entry = map.get(jti);
        map.delete(jti);
        map.set(jti, entry);
        return entry;
    }

    function toJSON() {
        const obj = {};
        for (const [k, v] of map) {
            obj[k] = { licenseKey: v.licenseKey, issuedAt: v.issuedAt, expiresAt: v.expiresAt };
        }
        return obj;
    }

    function loadFromJSON(json) {
        map.clear();
        for (const [k, v] of Object.entries(json || {})) {
            map.set(k, { ...v, _ts: v.issuedAt * 1000 });
        }
    }

    function size() { return map.size; }

    return { add, has, get, toJSON, loadFromJSON, size, _map: map };
}

// ─── Z-SEC-04: Persistencia de jtiStore a disco ──────────────────────────
function loadJtiStoreFromDisk(path) {
    const store = createJtiStore();
    try {
        if (existsSync(path)) {
            const raw = readFileSync(path, 'utf-8');
            store.loadFromJSON(JSON.parse(raw));
        }
    } catch (e) {
        console.warn('[jti] No se pudo cargar jti store desde disco:', e.message);
    }
    return store;
}

function saveJtiStoreToDisk(store, path) {
    try {
        const dir = path.substring(0, path.lastIndexOf('/'));
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(path, JSON.stringify(store.toJSON()), 'utf-8');
    } catch (e) {
        console.warn('[jti] No se pudo persistir jti store:', e.message);
    }
}

// ─── Z-SEC-05: SQLite helper ─────────────────────────────────────────────
function createRevocationsDb(dbPath) {
    const dir = dbPath.substring(0, dbPath.lastIndexOf('/'));
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.exec(`
        CREATE TABLE IF NOT EXISTS revoked_keys (
            license_key TEXT PRIMARY KEY,
            reason TEXT,
            revoked_at INTEGER NOT NULL DEFAULT (unixepoch()),
            source TEXT DEFAULT 'webhook'
        );
        CREATE INDEX IF NOT EXISTS idx_revoked_at ON revoked_keys(revoked_at);
    `);
    return db;
}

function addRevocation(db, licenseKey, reason = null, source = 'webhook') {
    const stmt = db.prepare(
        'INSERT OR IGNORE INTO revoked_keys (license_key, reason, source) VALUES (?, ?, ?)'
    );
    return stmt.run(licenseKey, reason, source);
}

function isRevoked(db, licenseKey) {
    const stmt = db.prepare('SELECT 1 FROM revoked_keys WHERE license_key = ?');
    return !!stmt.get(licenseKey);
}

function getRevocations(db, limit = 100) {
    const stmt = db.prepare(
        'SELECT license_key, reason, revoked_at, source FROM revoked_keys ORDER BY revoked_at DESC LIMIT ?'
    );
    return stmt.all(limit);
}

function removeRevocation(db, licenseKey) {
    const stmt = db.prepare('DELETE FROM revoked_keys WHERE license_key = ?');
    return stmt.run(licenseKey);
}

// ─── Factory exportada para tests ─────────────────────────────────────────
/**
 * Crea y configura la app Express SIN arrancar el listener.
 * @param {Object} [deps] - Dependencias inyectables para tests.
 * @param {Function} [deps.lemonSqueezyFetch] - Mock de fetch para LemonSqueezy.
 * @param {string}   [deps.lemonSqueezyApiKey] - API key.
 * @param {string}   [deps.webhookSecret] - Secret para validar HMAC.
 * @param {Object}   [deps.signKey] - Private key (KeyLike) ya importada.
 * @param {Object}   [deps.verifyKey] - Public key (KeyLike) para verificar JWT en /verify-jwt.
 *                                       Si no se pasa, se intenta derivar de signKey.
 * @param {Function} [deps.rateLimiterFactory] - Factory que retorna rate limiter.
 * @param {Function} [deps.logger] - Logger.
 * @param {Object}   [deps.db] - Instancia de Database (SQLite) inyectable.
 * @param {Object}   [deps.jtiStore] - Store de JTIs inyectable (para tests).
 * @param {string}   [deps.jtiStorePath] - Ruta para persistencia.
 * @returns {import('express').Express}
 */
export function createApp(deps = {}) {
    const {
        lemonSqueezyFetch,
        lemonSqueezyApiKey = process.env.LEMONSQUEEZY_API_KEY,
        webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
        signKey,
        verifyKey: depsVerifyKey,
        rateLimiterFactory,
        logger = console,
        db: injectedDb,
        jtiStore: injectedJtiStore,
        jtiStorePath = JTI_STORE_PATH,
        // H-03 (2026-05-15): /admin/revoked requires ADMIN_TOKEN.
        // Si la env var no está definida, el endpoint queda DISABLED (503).
        adminToken = process.env.ADMIN_TOKEN,
    } = deps;

    const app = express();

    // express.json() debe aplicarse SOLO a rutas non-webhook.
    app.use((req, res, next) => {
        if (req.path === '/webhook') return next();
        express.json({ limit: '10kb' })(req, res, next);
    });

    // CORS
    const DEFAULT_PROD_ORIGINS = [
        'https://salazarjoelo.github.io',
        'https://edugame.digital',
        'https://esperantai.edugame.digital',
    ];
    const ALLOWED_ORIGINS = deps.allowedOrigins
        ?? (process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
            : DEFAULT_PROD_ORIGINS);
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (ALLOWED_ORIGINS.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Vary', 'Origin');
        }
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Max-Age', '86400');
        if (req.method === 'OPTIONS') return res.sendStatus(204);
        next();
    });

    // Rate limiter
    const verifyLimiter = rateLimiterFactory
        ? rateLimiterFactory()
        : new RateLimiterMemory({ points: 10, duration: 300, blockDuration: 600 });

    // ─── Z-SEC-05: SQLite revocations ─────────────────────────────────────
    const db = injectedDb || createRevocationsDb(DB_PATH);

    // ─── Z-SEC-04: jtiStore (LRU en memoria + persistencia) ──────────────
    const jtiStore = injectedJtiStore || loadJtiStoreFromDisk(jtiStorePath);
    let jtiPersistTimer = null;
    if (!injectedJtiStore && !injectedDb) {
        jtiPersistTimer = setInterval(() => {
            saveJtiStoreToDisk(jtiStore, jtiStorePath);
        }, JTI_PERSIST_INTERVAL_MS);
    }

    // ─── Verify key para /verify-jwt ──────────────────────────────────────
    // jose.exportSPKI() necesita una public key. Si el caller pasó verifyKey
    // (recomendado), la usamos. Si no, intentamos derivar de signKey.
    // En producción, el bootstrap pasa ambas (signKey + verifyKey).
    let finalVerifyKey = depsVerifyKey || null;
    if (!finalVerifyKey && signKey && signKey.type === 'public') {
        finalVerifyKey = signKey;
    }

    // ─── Health check ─────────────────────────────────────────────────────
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', service: 'esperantai-license', version: '1.0.0' });
    });

    // ─── GET /admin/revoked — listar revocaciones (H-03 protected) ────────
    // Requiere ADMIN_TOKEN en Authorization: Bearer ... (timing-safe compare).
    // Si ADMIN_TOKEN no está configurado → 503 (endpoint deshabilitado).
    app.get('/admin/revoked', (req, res) => {
        if (!adminToken) {
            return res.status(503).json({ ok: false, error: 'admin_disabled' });
        }
        const authHeader = req.headers.authorization || '';
        const m = authHeader.match(/^Bearer\s+(.+)$/);
        if (!m) return res.status(401).json({ ok: false, error: 'unauthorized' });
        const provided = m[1];
        // timing-safe compare (constant-time)
        if (provided.length !== adminToken.length) {
            return res.status(401).json({ ok: false, error: 'unauthorized' });
        }
        let equal = 0;
        for (let i = 0; i < provided.length; i++) {
            equal |= provided.charCodeAt(i) ^ adminToken.charCodeAt(i);
        }
        if (equal !== 0) return res.status(401).json({ ok: false, error: 'unauthorized' });

        const limit = parseInt(req.query.limit || '100', 10);
        const revocations = getRevocations(db, Math.min(limit, 1000));
        res.json({ ok: true, count: revocations.length, revocations });
    });

    // ─── /verify — endpoint principal ─────────────────────────────────────
    app.post('/verify', async (req, res) => {
        try {
            await verifyLimiter.consume(req.ip);
        } catch {
            return res.status(429).json({ ok: false, error: 'rate_limited' });
        }

        const { license_key, instance_name, instance_id } = req.body || {};

        if (!license_key || typeof license_key !== 'string') {
            return res.status(400).json({ ok: false, error: 'missing_license_key' });
        }

        if (isRevoked(db, license_key)) {
            return res.status(403).json({ ok: false, error: 'revoked' });
        }

        const fetchFn = lemonSqueezyFetch || fetch;
        let lemonResponse;
        const isActivation = typeof instance_name === 'string' && instance_name.trim().length > 0;
        const endpoint = isActivation ? 'activate' : 'validate';
        const body = new URLSearchParams({ license_key });
        if (isActivation) {
            body.set('instance_name', instance_name.trim());
        } else if (typeof instance_id === 'string' && instance_id.trim().length > 0) {
            body.set('instance_id', instance_id.trim());
        }
        try {
            const lsRes = await fetchFn(`https://api.lemonsqueezy.com/v1/licenses/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${lemonSqueezyApiKey}`,
                },
                body: body.toString(),
            });
            lemonResponse = await lsRes.json();
        } catch (e) {
            logger.error('[verify] LemonSqueezy fetch failed:', e.message);
            return res.status(502).json({ ok: false, error: 'upstream_error' });
        }

        const lemonOk = isActivation ? lemonResponse.activated : lemonResponse.valid;
        if (!lemonOk) {
            return res.status(403).json({ ok: false, error: mapLicenseError(lemonResponse.error) });
        }

        const license = lemonResponse.license_key || {};
        const status = String(license.status || '').toLowerCase();
        if (status === 'disabled' || status === 'expired') {
            return res.status(403).json({ ok: false, error: status === 'expired' ? 'expired' : 'revoked' });
        }

        const meta = lemonResponse.meta || {};
        const tier = inferTierFromMeta(meta);
        if (!tier) {
            logger.warn(`[verify] LemonSqueezy variant no autorizado: ${meta.variant_id || 'missing'}`);
            return res.status(403).json({ ok: false, error: 'product_mismatch' });
        }

        const now = Math.floor(Date.now() / 1000);
        const exp = now + JWT_TTL_DAYS * 24 * 60 * 60;

        // Z-SEC-04: jti único por JWT
        const jti = randomUUID();

        const token = await new SignJWT({
            tier,
            ls_id: license.id,
            ls_status: license.status,
            ls_instance: lemonResponse.instance?.id || null,
            instances_limit: license.activation_limit || 1,
            instances_used: license.activation_usage || 0,
            jti,
        })
            .setProtectedHeader({ alg: 'EdDSA' })
            .setJti(jti)
            .setIssuer(JWT_ISSUER)
            .setAudience(JWT_AUDIENCE)
            .setSubject(license_key)
            .setIssuedAt(now)
            .setExpirationTime(exp)
            .sign(signKey);

        jtiStore.add(jti, { licenseKey: license_key, issuedAt: now, expiresAt: exp });

        return res.json({ ok: true, token, tier, expires: exp });
    });

    // ─── POST /verify-jwt — verificar JWT activo (Z-SEC-04) ──────────────
    app.post('/verify-jwt', express.json({ limit: '1kb' }), async (req, res) => {
        const { token } = req.body || {};
        if (!token || typeof token !== 'string') {
            return res.json({ valid: false, reason: 'missing_token' });
        }

        try {
            if (!finalVerifyKey) {
                return res.json({ valid: false, reason: 'no_verify_key' });
            }

            const { payload } = await jwtVerify(token, finalVerifyKey, {
                issuer: JWT_ISSUER,
                audience: JWT_AUDIENCE,
            });

            const jti = payload.jti;
            if (!jti || !jtiStore.has(jti)) {
                return res.json({ valid: false, reason: 'unknown_jti' });
            }

            const entry = jtiStore.get(jti);

            if (entry && isRevoked(db, entry.licenseKey)) {
                return res.json({ valid: false, reason: 'revoked' });
            }

            const now = Math.floor(Date.now() / 1000);
            if (entry && entry.expiresAt < now) {
                return res.json({ valid: false, reason: 'expired' });
            }

            return res.json({ valid: true });
        } catch (e) {
            return res.json({ valid: false, reason: 'invalid_signature' });
        }
    });

    // ─── /deactivate (H-04 protected) ─────────────────────────────────────
    // Requiere Authorization: Bearer <JWT> emitido por este servidor.
    // El JWT.sub (license_key) DEBE coincidir con body.license_key —
    // así un cliente no puede desactivar instancias de OTRA licencia
    // aunque conozca su license_key (mitigación de DoS contra usuarios).
    app.post('/deactivate', async (req, res) => {
        const { license_key, instance_id } = req.body || {};
        if (!license_key || !instance_id) {
            return res.status(400).json({ ok: false, error: 'missing_params' });
        }

        // Verificar JWT
        if (!finalVerifyKey) {
            return res.status(503).json({ ok: false, error: 'jwt_disabled' });
        }
        const authHeader = req.headers.authorization || '';
        const m = authHeader.match(/^Bearer\s+(.+)$/);
        if (!m) return res.status(401).json({ ok: false, error: 'unauthorized' });
        let payload;
        try {
            const result = await jwtVerify(m[1], finalVerifyKey, {
                issuer: JWT_ISSUER,
                audience: JWT_AUDIENCE,
            });
            payload = result.payload;
        } catch {
            return res.status(401).json({ ok: false, error: 'invalid_token' });
        }
        // El JWT debe pertenecer a la licencia que se intenta desactivar
        if (payload.sub !== license_key) {
            return res.status(403).json({ ok: false, error: 'license_mismatch' });
        }
        // Si la licencia fue revocada, no permitir más deactivates con ese JWT
        if (isRevoked(db, license_key)) {
            return res.status(403).json({ ok: false, error: 'revoked' });
        }

        const fetchFn = lemonSqueezyFetch || fetch;
        try {
            const lsRes = await fetchFn('https://api.lemonsqueezy.com/v1/licenses/deactivate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${lemonSqueezyApiKey}`,
                },
                body: new URLSearchParams({ license_key, instance_id }).toString(),
            });
            const data = await lsRes.json();
            return res.json({ ok: !!data.deactivated, error: data.error });
        } catch (e) {
            logger.error('[deactivate] LemonSqueezy fetch failed:', e.message);
            return res.status(502).json({ ok: false, error: 'upstream_error' });
        }
    });

    // ─── /webhook ─────────────────────────────────────────────────────────
    app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
        if (!webhookSecret) return res.sendStatus(503);
        const signature = req.headers['x-signature'];
        if (!signature) return res.sendStatus(401);
        const expected = createHmac('sha256', webhookSecret).update(req.body).digest('hex');
        if (!safeEqual(signature, expected)) return res.sendStatus(401);

        let event;
        try {
            event = JSON.parse(req.body.toString('utf-8'));
        } catch {
            return res.sendStatus(400);
        }
        const eventName = req.headers['x-event-name'] || event.meta?.event_name;
        const attrs = event.data?.attributes || {};
        const key = attrs.key;
        const status = String(attrs.status || '').toLowerCase();
        if (
            eventName === 'license_key_disabled'
            || eventName === 'license_key_revoked'
            || (eventName === 'license_key_updated' && (status === 'disabled' || status === 'expired'))
        ) {
            if (key) {
                addRevocation(db, key, `revoked_via_${eventName}:${status || 'unknown'}`);
                logger.log(`[webhook] License revoked: ${key.slice(0, 8)}...`);
            }
        } else if (eventName === 'license_key_updated' && key && (status === 'active' || status === 'inactive')) {
            removeRevocation(db, key);
            logger.log(`[webhook] License unrevoked: ${key.slice(0, 8)}...`);
        }
        return res.sendStatus(200);
    });

    // ─── Cleanup helper (para tests) ──────────────────────────────────────
    app._cleanup = () => {
        if (jtiPersistTimer) {
            clearInterval(jtiPersistTimer);
            jtiPersistTimer = null;
        }
    };

    // M-01 (2026-05-15): exponer jtiStore al bootstrap para que los handlers
    // de SIGTERM/SIGINT puedan persistirlo a disco antes de exit.
    // Antes vivía SOLO dentro del closure de createApp — fuera era ReferenceError.
    app._jtiStore = jtiStore;
    app._jtiStorePath = jtiStorePath;

    // SEC-FIX (2026-05-19): JSON error handler (último middleware).
    // Antes: errores como SyntaxError del body-parser caían al default Express
    // y respondían stack trace HTML (exponía paths del filesystem + estructura).
    // Ahora: cualquier error responde JSON {error, status} limpio.
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        const isBodyParseError = err.type === 'entity.parse.failed' || err instanceof SyntaxError;
        const status = isBodyParseError ? 400 : (err.status || err.statusCode || 500);
        const code = isBodyParseError ? 'invalid_json'
                   : (status >= 500 ? 'internal_error' : 'bad_request');
        const message = isBodyParseError ? 'Request body is not valid JSON.'
                      : (status >= 500 ? 'Internal server error.' : (err.message || 'Bad request.'));
        if (status >= 500) {
            console.error(`[error-handler] ${req.method} ${req.path}:`, err.message);
        }
        res.status(status).json({ error: code, message });
    });

    return app;
}

// ─── Bootstrap ────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
    const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
    if (!LEMONSQUEEZY_API_KEY) {
        console.error('[FATAL] LEMONSQUEEZY_API_KEY no definida en env');
        process.exit(1);
    }

    const PRIV_KEY_PATH = process.env.PRIV_KEY_PATH || '/etc/esperantai/priv.pem';
    const PUB_KEY_PATH = process.env.PUB_KEY_PATH || '/etc/esperantai/pub.pem';
    const privKeyPem = readFileSync(PRIV_KEY_PATH, 'utf-8');
    const privateKey = await importPKCS8(privKeyPem, 'EdDSA');
    console.log(`[+] Ed25519 private key cargada desde ${PRIV_KEY_PATH}`);

    // Cargar public key para /verify-jwt
    let verifyKey = null;
    try {
        const pubKeyPem = readFileSync(PUB_KEY_PATH, 'utf-8');
        verifyKey = await importSPKI(pubKeyPem, 'EdDSA');
        console.log(`[+] Ed25519 public key cargada desde ${PUB_KEY_PATH}`);
    } catch (e) {
        console.warn('[!] No se pudo cargar public key. /verify-jwt no funcionará.');
    }

    const app = createApp({ signKey: privateKey, verifyKey });
    app.listen(PORT, HOST, () => {
        console.log(`[+] EsperantAI license backend listening on http://${HOST}:${PORT}`);
        console.log(`[+] JWT TTL: ${JWT_TTL_DAYS} days`);
        console.log(`[+] DB: ${DB_PATH}`);
        console.log(`[+] jtiStore: ${JTI_STORE_PATH}`);
    });

    // M-01 (2026-05-15): jtiStore vive dentro del closure de createApp —
    // accederlo vía app._jtiStore evita ReferenceError en estos handlers.
    const shutdown = (signal) => {
        try {
            saveJtiStoreToDisk(app._jtiStore, app._jtiStorePath);
            console.log(`[${signal}] jti store persistido en ${app._jtiStorePath}`);
        } catch (e) {
            console.error(`[${signal}] Error persistiendo jti store:`, e.message);
        }
        process.exit(0);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
