/**
 * EsperantAI License Backend
 * ==========================
 * Express server que:
 *   1. Recibe license keys del cliente (UUID emitido por LemonSqueezy)
 *   2. Valida contra LemonSqueezy API (server-side, con LEMONSQUEEZY_API_KEY)
 *   3. Emite JWT firmado con Ed25519 conteniendo { tier, instances, expires }
 *   4. (opcional) Recibe webhook de LemonSqueezy en /webhook con HMAC-SHA256
 *
 * Cliente verifica el JWT con crypto.subtle.verify usando la clave pública
 * embebida en core/license-manager.js — sin red, sin posibilidad de tampering
 * (modificar el JS NO funciona porque la firma se rompería).
 *
 * Despliegue: /opt/esperantai-license/ en VPS Hostinger 187.77.23.49.
 * Apache reverse proxy: license.edugame.digital → http://127.0.0.1:3201
 */

import express from 'express';
import { readFileSync } from 'node:fs';
import { importPKCS8, SignJWT, jwtVerify, importSPKI } from 'jose';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const PORT = process.env.PORT || 3201;
const HOST = process.env.HOST || '127.0.0.1';

// ─── Env / config ─────────────────────────────────────────────────────────
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const PRIV_KEY_PATH = process.env.PRIV_KEY_PATH || '/etc/esperantai/priv.pem';
const JWT_TTL_DAYS = Number(process.env.JWT_TTL_DAYS || 30);
const JWT_ISSUER = 'license.edugame.digital';
const JWT_AUDIENCE = 'esperantai-client';

if (!LEMONSQUEEZY_API_KEY) {
    console.error('[FATAL] LEMONSQUEEZY_API_KEY no definida en env');
    process.exit(1);
}

const privKeyPem = readFileSync(PRIV_KEY_PATH, 'utf-8');
const privateKey = await importPKCS8(privKeyPem, 'EdDSA');
console.log(`[+] Ed25519 private key cargada desde ${PRIV_KEY_PATH}`);

// ─── Rate limiter ─────────────────────────────────────────────────────────
// Anti-brute-force: máx 10 intentos /verify por IP / 5 min
const verifyLimiter = new RateLimiterMemory({
    points: 10,
    duration: 300,
    blockDuration: 600,
});

// ─── In-memory revocation set ─────────────────────────────────────────────
// TODO: persistir a SQLite cuando crezca. Por ahora process memory es OK.
const revokedKeys = new Set();

// ─── Express app ──────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '10kb' }));

// CORS — solo permitir origen del cliente EsperantAI
const ALLOWED_ORIGINS = [
    'https://salazarjoelo.github.io',     // GitHub Pages (publicación oficial)
    'https://edugame.digital',             // Landing principal
    'https://esperantai.edugame.digital',  // Si Joel agrega subdominio app
    'http://localhost:8000',               // Dev local
    'http://127.0.0.1:8000',
];
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

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'esperantai-license', version: '1.0.0' });
});

// ─── /verify — endpoint principal ─────────────────────────────────────────
/**
 * POST /verify
 * Body: { license_key: string, instance_name?: string }
 * Response: { ok: true, token: <JWT>, tier, expires }
 *        or { ok: false, error: <code> }
 */
app.post('/verify', async (req, res) => {
    // Rate limit por IP
    try {
        await verifyLimiter.consume(req.ip);
    } catch {
        return res.status(429).json({ ok: false, error: 'rate_limited' });
    }

    const { license_key, instance_name } = req.body || {};

    if (!license_key || typeof license_key !== 'string') {
        return res.status(400).json({ ok: false, error: 'missing_license_key' });
    }

    if (revokedKeys.has(license_key)) {
        return res.status(403).json({ ok: false, error: 'revoked' });
    }

    // Validar contra LemonSqueezy API
    let lemonResponse;
    try {
        const lsRes = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
            },
            body: new URLSearchParams({
                license_key,
                ...(instance_name ? { instance_name } : {}),
            }).toString(),
        });
        lemonResponse = await lsRes.json();
    } catch (e) {
        console.error('[verify] LemonSqueezy fetch failed:', e.message);
        return res.status(502).json({ ok: false, error: 'upstream_error' });
    }

    if (!lemonResponse.valid) {
        const errorCode = lemonResponse.error || 'invalid';
        // Mapeo a errores accionables
        const mapped = {
            'license_key_not_found': 'invalid',
            'license_key_expired': 'expired',
            'license_key_disabled': 'revoked',
            'too_many_activations': 'limit_reached',
        }[errorCode] || 'invalid';
        return res.status(403).json({ ok: false, error: mapped });
    }

    // Emitir JWT firmado
    const license = lemonResponse.license_key || {};
    const meta = lemonResponse.meta || {};
    const tier = inferTierFromMeta(meta);

    const now = Math.floor(Date.now() / 1000);
    const exp = now + JWT_TTL_DAYS * 24 * 60 * 60;

    const token = await new SignJWT({
        tier,
        ls_id: license.id,
        ls_status: license.status,
        ls_instance: lemonResponse.instance?.id || null,
        instances_limit: license.activation_limit || 1,
        instances_used: license.activation_usage || 0,
    })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setIssuer(JWT_ISSUER)
        .setAudience(JWT_AUDIENCE)
        .setSubject(license_key)
        .setIssuedAt(now)
        .setExpirationTime(exp)
        .sign(privateKey);

    return res.json({
        ok: true,
        token,
        tier,
        expires: exp,
    });
});

// ─── /deactivate — liberar una instancia ──────────────────────────────────
app.post('/deactivate', async (req, res) => {
    const { license_key, instance_id } = req.body || {};
    if (!license_key || !instance_id) {
        return res.status(400).json({ ok: false, error: 'missing_params' });
    }
    try {
        const lsRes = await fetch('https://api.lemonsqueezy.com/v1/licenses/deactivate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
            },
            body: new URLSearchParams({ license_key, instance_id }).toString(),
        });
        const data = await lsRes.json();
        return res.json({ ok: !!data.deactivated, error: data.error });
    } catch (e) {
        return res.status(502).json({ ok: false, error: 'upstream_error' });
    }
});

// ─── /webhook — LemonSqueezy events (signed HMAC-SHA256) ──────────────────
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    if (!LEMONSQUEEZY_WEBHOOK_SECRET) return res.sendStatus(503);
    const signature = req.headers['x-signature'];
    if (!signature) return res.sendStatus(401);

    const expected = createHmac('sha256', LEMONSQUEEZY_WEBHOOK_SECRET).update(req.body).digest('hex');
    if (!safeEqual(signature, expected)) return res.sendStatus(401);

    const event = JSON.parse(req.body.toString('utf-8'));
    const eventName = req.headers['x-event-name'] || event.meta?.event_name;

    // Eventos manejados:
    if (eventName === 'license_key_disabled' || eventName === 'license_key_revoked') {
        const key = event.data?.attributes?.key;
        if (key) {
            revokedKeys.add(key);
            console.log(`[webhook] License revoked: ${key.slice(0, 8)}...`);
        }
    }

    return res.sendStatus(200);
});

// ─── helpers ──────────────────────────────────────────────────────────────
function inferTierFromMeta(meta) {
    // LemonSqueezy puede pasar variant_id en meta. Joel debe mapear su producto.
    // Por ahora: si Joel solo tiene 1 variant (pro), todos son 'pro'.
    // En el futuro: leer meta.variant_id y mapear a 'pro' / 'pro_plus'.
    return 'pro';
}

function safeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    try {
        return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
    } catch {
        return false;
    }
}

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, HOST, () => {
    console.log(`[+] EsperantAI license backend listening on http://${HOST}:${PORT}`);
    console.log(`[+] JWT TTL: ${JWT_TTL_DAYS} days`);
    console.log(`[+] Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
