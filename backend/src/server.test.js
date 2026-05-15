/**
 * Tests para el backend de licencias EsperantAI.
 * 12 casos con node --test nativo (Node 20+).
 * Sin supertest, sin mocks de jose, sin requests HTTP reales.
 *
 * Ejecutar: cd backend && npm test
 */
import { describe, it, before, after } from 'node:test';
import { strictEqual, ok } from 'node:assert';
import { generateKeyPair, exportSPKI, jwtVerify, importSPKI } from 'jose';
import Database from 'better-sqlite3';
import { createApp } from './server.js';

// ─── Setup: generar par de claves real para firmar/verificar ─────────────
let privateKey;
let publicKey;
let app;
let baseURL;
let listeningServer;
// Servers extra creados dentro de tests; los cerramos en after() para que
// node --test termine el proceso limpio en CI.
const extraServers = [];

/**
 * Crea un SQLite in-memory con el schema de revocations para evitar
 * que createApp intente crear /var/lib/esperantai/revocations.db en CI
 * (donde el path no existe y mkdirSync falla).
 */
function createInMemoryRevocationsDb() {
    const db = new Database(':memory:');
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

before(async () => {
    const kp = await generateKeyPair('EdDSA', { crv: 'Ed25519' });
    privateKey = kp.privateKey;
    publicKey = kp.publicKey;

    // Factory para rate limiter fresco en cada test base
    const rateLimiterFactory = () => ({
        consume: async () => {}, // Sin rate limit en tests
    });

    app = createApp({
        signKey: privateKey,
        lemonSqueezyApiKey: 'test-api-key-DS301',
        webhookSecret: 'test-webhook-secret',
        rateLimiterFactory,
        lemonSqueezyFetch: createMockFetch(),
        db: createInMemoryRevocationsDb(),
    });

    // Arrancar en puerto aleatorio
    await new Promise((resolve) => {
        listeningServer = app.listen(0, () => {
            baseURL = `http://127.0.0.1:${listeningServer.address().port}`;
            resolve();
        });
    });
});

after(async () => {
    // Cerrar el server global + cualquier server extra para que node --test
    // termine el proceso. Sin esto, el event loop sigue vivo y CI cuelga.
    const closeServer = (s) => new Promise(resolve => s.close(resolve));
    await closeServer(listeningServer);
    await Promise.all(extraServers.map(closeServer));
});

// ─── Mock de LemonSqueezy ────────────────────────────────────────────────
function createMockFetch(capture = null) {
    return async (url, options) => {
        if (capture) {
            capture.url = url;
            capture.authHeader = options.headers?.Authorization;
        }
        const body = new URLSearchParams(options.body);
        const key = body.get('license_key');

        if (key === 'VALID-KEY') {
            return {
                ok: true,
                json: async () => ({
                    valid: true,
                    license_key: { id: 1, status: 'active', activation_limit: 1, activation_usage: 0 },
                    meta: { variant_id: 'pro' },
                    instance: { id: 'inst-1' },
                }),
            };
        }
        if (key === 'EXPIRED-KEY') {
            return { ok: true, json: async () => ({ valid: false, error: 'license_key_expired' }) };
        }
        if (key === 'DISABLED-KEY') {
            return { ok: true, json: async () => ({ valid: false, error: 'license_key_disabled' }) };
        }
        if (key === 'NOT-FOUND-KEY') {
            return { ok: true, json: async () => ({ valid: false, error: 'license_key_not_found' }) };
        }
        return { ok: true, json: async () => ({ valid: false, error: 'invalid' }) };
    };
}

// ─── Tests ────────────────────────────────────────────────────────────────

describe('/verify endpoint', () => {
    it('1. key válida → 200 + JWT', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY', instance_name: 'test-instance' }),
        });
        strictEqual(res.status, 200);
        const data = await res.json();
        strictEqual(data.ok, true);
        ok(typeof data.token === 'string');
        ok(typeof data.tier === 'string');
        ok(typeof data.expires === 'number');
    });

    it('2. key inválida → 403', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'INVALID-KEY', instance_name: 'test' }),
        });
        strictEqual(res.status, 403);
        const data = await res.json();
        strictEqual(data.ok, false);
    });

    it('3. sin license_key → 400', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });
        strictEqual(res.status, 400);
        const data = await res.json();
        strictEqual(data.ok, false);
        strictEqual(data.error, 'missing_license_key');
    });

    it('4. dispara fetch al endpoint correcto con auth header inyectado', async () => {
        const capture = {};
        const testApp = createApp({
            signKey: privateKey,
            lemonSqueezyApiKey: 'CUSTOM-API-KEY-FOR-TEST-4',
            lemonSqueezyFetch: createMockFetch(capture),
            rateLimiterFactory: () => ({ consume: async () => {} }),
            db: createInMemoryRevocationsDb(),
        });
        const server = await new Promise((resolve) => {
            const s = testApp.listen(0, () => resolve(s));
        });
        const url = `http://127.0.0.1:${server.address().port}`;
        await fetch(`${url}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        });
        strictEqual(capture.url, 'https://api.lemonsqueezy.com/v1/licenses/validate');
        strictEqual(capture.authHeader, 'Bearer CUSTOM-API-KEY-FOR-TEST-4');
        server.close();
    });

    it('5. JWT contiene tier + sub + exp verificables con clave pública', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        });
        const { token } = await res.json();
        const pubSPKI = await exportSPKI(publicKey);
        const importedPub = await importSPKI(pubSPKI, 'EdDSA');
        const { payload } = await jwtVerify(token, importedPub, {
            issuer: 'license.edugame.digital',
            audience: 'esperantai-client',
        });
        strictEqual(payload.tier, 'pro');
        strictEqual(payload.sub, 'VALID-KEY');
        ok(typeof payload.exp === 'number');
    });

    it('6. JWT exp está entre now+29d y now+31d (TTL default 30d)', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        });
        const { expires } = await res.json();
        const now = Math.floor(Date.now() / 1000);
        const min = now + 29 * 86400;
        const max = now + 31 * 86400;
        ok(expires >= min, `expires (${expires}) debe ser >= now+29d (${min})`);
        ok(expires <= max, `expires (${expires}) debe ser <= now+31d (${max})`);
    });

    it('7. key expirada → 403 con error "expired"', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'EXPIRED-KEY' }),
        });
        strictEqual(res.status, 403);
        const data = await res.json();
        strictEqual(data.error, 'expired');
    });

    it('8. key disabled → 403 con error "revoked"', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'DISABLED-KEY' }),
        });
        strictEqual(res.status, 403);
        const data = await res.json();
        strictEqual(data.error, 'revoked');
    });

    it('9. key not found → 403 con error "invalid"', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'NOT-FOUND-KEY' }),
        });
        strictEqual(res.status, 403);
        const data = await res.json();
        strictEqual(data.error, 'invalid');
    });
});

describe('rate limiting', () => {
    it('10. rate limit → al menos 1×429 tras 11 requests', async () => {
        const { RateLimiterMemory } = await import('rate-limiter-flexible');
        const rlFactory = () => new RateLimiterMemory({ points: 10, duration: 300, blockDuration: 600 });
        const testApp = createApp({
            signKey: privateKey,
            lemonSqueezyApiKey: 'test-key',
            rateLimiterFactory: rlFactory,
            lemonSqueezyFetch: createMockFetch(),
            db: createInMemoryRevocationsDb(),
        });
        const server = await new Promise((resolve) => {
            const s = testApp.listen(0, () => resolve(s));
        });
        const url = `http://127.0.0.1:${server.address().port}`;
        const req = () => fetch(`${url}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        });
        const results = await Promise.all(Array.from({ length: 11 }, req));
        const has429 = results.some(r => r.status === 429);
        strictEqual(has429, true, 'Se esperaba al menos un 429 tras 11 requests');
        server.close();
    });
});

describe('health + deactivate + webhook', () => {
    it('11. GET /health → 200 OK', async () => {
        const res = await fetch(`${baseURL}/health`);
        strictEqual(res.status, 200);
        const data = await res.json();
        strictEqual(data.status, 'ok');
        strictEqual(data.service, 'esperantai-license');
    });

    it('12. POST /webhook con HMAC inválido → 401', async () => {
        // Webhook usa express.raw(), test directo con body string
        const body = JSON.stringify({ meta: { event_name: 'license_key_disabled' }, data: { attributes: { key: 'KEY-X' } } });
        const res = await fetch(`${baseURL}/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-signature': 'invalid-signature-deadbeef',
                'x-event-name': 'license_key_disabled',
            },
            body,
        });
        strictEqual(res.status, 401);
    });
});

// ─── H-03: /admin/revoked auth ────────────────────────────────────────────
describe('/admin/revoked auth (H-03)', () => {
    async function startAppWithToken(token) {
        const testApp = createApp({
            signKey: privateKey,
            adminToken: token,
            lemonSqueezyApiKey: 'test-key',
            rateLimiterFactory: () => ({ consume: async () => {} }),
            lemonSqueezyFetch: createMockFetch(),
            db: createInMemoryRevocationsDb(),
        });
        const server = await new Promise((resolve) => {
            const s = testApp.listen(0, () => resolve(s));
        });
        extraServers.push(server);
        return { server, url: `http://127.0.0.1:${server.address().port}` };
    }

    it('13. sin ADMIN_TOKEN configurado → 503 admin_disabled', async () => {
        const testApp = createApp({
            signKey: privateKey,
            lemonSqueezyApiKey: 'test-key',
            rateLimiterFactory: () => ({ consume: async () => {} }),
            lemonSqueezyFetch: createMockFetch(),
            db: createInMemoryRevocationsDb(),
            // adminToken omitido a propósito
        });
        const server = await new Promise((resolve) => {
            const s = testApp.listen(0, () => resolve(s));
        });
        extraServers.push(server);
        const url = `http://127.0.0.1:${server.address().port}`;
        const res = await fetch(`${url}/admin/revoked`);
        strictEqual(res.status, 503);
        const data = await res.json();
        strictEqual(data.error, 'admin_disabled');
    });

    it('14. sin Authorization header → 401', async () => {
        const { url } = await startAppWithToken('secret-admin-token-13');
        const res = await fetch(`${url}/admin/revoked`);
        strictEqual(res.status, 401);
    });

    it('15. token incorrecto → 401', async () => {
        const { url } = await startAppWithToken('secret-admin-token-13');
        const res = await fetch(`${url}/admin/revoked`, {
            headers: { 'Authorization': 'Bearer WRONG-TOKEN' },
        });
        strictEqual(res.status, 401);
    });

    it('16. token correcto → 200 con lista de revocations', async () => {
        const { url } = await startAppWithToken('secret-admin-token-13');
        const res = await fetch(`${url}/admin/revoked`, {
            headers: { 'Authorization': 'Bearer secret-admin-token-13' },
        });
        strictEqual(res.status, 200);
        const data = await res.json();
        strictEqual(data.ok, true);
        ok(Array.isArray(data.revocations));
    });
});

// ─── H-04: /deactivate requires JWT ───────────────────────────────────────
describe('/deactivate auth (H-04)', () => {
    async function startAppWithVerifyKey() {
        const testApp = createApp({
            signKey: privateKey,
            verifyKey: publicKey,
            lemonSqueezyApiKey: 'test-key',
            rateLimiterFactory: () => ({ consume: async () => {} }),
            lemonSqueezyFetch: createMockFetch(),
            db: createInMemoryRevocationsDb(),
        });
        const server = await new Promise((resolve) => {
            const s = testApp.listen(0, () => resolve(s));
        });
        extraServers.push(server);
        return { server, url: `http://127.0.0.1:${server.address().port}` };
    }

    it('17. sin JWT → 401 unauthorized', async () => {
        const { url } = await startAppWithVerifyKey();
        const res = await fetch(`${url}/deactivate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY', instance_id: 'inst-1' }),
        });
        strictEqual(res.status, 401);
    });

    it('18. JWT inválido → 401 invalid_token', async () => {
        const { url } = await startAppWithVerifyKey();
        const res = await fetch(`${url}/deactivate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer not.a.real.jwt',
            },
            body: JSON.stringify({ license_key: 'VALID-KEY', instance_id: 'inst-1' }),
        });
        strictEqual(res.status, 401);
        const data = await res.json();
        strictEqual(data.error, 'invalid_token');
    });

    it('19. JWT válido pero sub ≠ license_key → 403 license_mismatch', async () => {
        const { url } = await startAppWithVerifyKey();
        // Obtener JWT para VALID-KEY
        const verifyRes = await fetch(`${url}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        });
        const { token } = await verifyRes.json();
        ok(typeof token === 'string', 'verify debe haber devuelto JWT');
        // Intentar desactivar OTRA licencia con este JWT
        const res = await fetch(`${url}/deactivate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ license_key: 'OTHER-KEY', instance_id: 'inst-1' }),
        });
        strictEqual(res.status, 403);
        const data = await res.json();
        strictEqual(data.error, 'license_mismatch');
    });

    it('20. sin verifyKey configurado → 503 jwt_disabled', async () => {
        // App sin verifyKey
        const testApp = createApp({
            signKey: privateKey,
            // verifyKey omitido
            lemonSqueezyApiKey: 'test-key',
            rateLimiterFactory: () => ({ consume: async () => {} }),
            lemonSqueezyFetch: createMockFetch(),
            db: createInMemoryRevocationsDb(),
        });
        const server = await new Promise((resolve) => {
            const s = testApp.listen(0, () => resolve(s));
        });
        extraServers.push(server);
        const url = `http://127.0.0.1:${server.address().port}`;
        const res = await fetch(`${url}/deactivate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer anything',
            },
            body: JSON.stringify({ license_key: 'VALID-KEY', instance_id: 'inst-1' }),
        });
        strictEqual(res.status, 503);
    });
});
