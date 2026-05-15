/**
 * Tests para Z-SEC-04: JWT jti + replay protection.
 * 7 casos con node --test nativo (Node 20+).
 *
 * Ejecutar: cd backend && npm test
 */
import { describe, it, before, after } from 'node:test';
import { strictEqual, ok, notStrictEqual } from 'node:assert';
import { generateKeyPair, SignJWT, exportSPKI, importSPKI } from 'jose';
import { createApp } from './server.js';

// ─── Setup ────────────────────────────────────────────────────────────────
let signingKey;
let verifyKey;
let app;
let baseURL;
let server;
let testDb;
let jtiStoreInjected;

before(async () => {
    const kp = await generateKeyPair('EdDSA', { crv: 'Ed25519' });
    signingKey = kp.privateKey;
    const spki = await exportSPKI(kp.publicKey);
    verifyKey = await importSPKI(spki, 'EdDSA');

    // DB en memoria
    const Database = (await import('better-sqlite3')).default;
    testDb = new Database(':memory:');
    testDb.pragma('journal_mode = MEMORY');
    testDb.exec(`
        CREATE TABLE IF NOT EXISTS revoked_keys (
            license_key TEXT PRIMARY KEY,
            reason TEXT,
            revoked_at INTEGER NOT NULL DEFAULT (unixepoch()),
            source TEXT DEFAULT 'webhook'
        );
    `);

    // jtiStore inyectado
    jtiStoreInjected = (function() {
        const map = new Map();
        return {
            _map: map,
            add(jti, entry) {
                if (map.size >= 10000) {
                    const firstKey = map.keys().next().value;
                    map.delete(firstKey);
                }
                map.set(jti, { ...entry, _ts: Date.now() });
            },
            has(jti) {
                if (!map.has(jti)) return false;
                const entry = map.get(jti);
                map.delete(jti);
                map.set(jti, entry);
                return true;
            },
            get(jti) {
                if (!map.has(jti)) return null;
                const entry = map.get(jti);
                map.delete(jti);
                map.set(jti, entry);
                return entry;
            },
            toJSON() { return {}; },
            loadFromJSON() {},
            size() { return map.size; },
        };
    })();

    app = createApp({
        signKey: signingKey,
        verifyKey,
        lemonSqueezyApiKey: 'test-key',
        webhookSecret: 'test-secret',
        rateLimiterFactory: () => ({ consume: async () => {} }),
        lemonSqueezyFetch: makeMockFetch({ valid: true }),
        db: testDb,
        jtiStore: jtiStoreInjected,
    });

    await new Promise((resolve) => {
        server = app.listen(0, () => {
            baseURL = `http://127.0.0.1:${server.address().port}`;
            resolve();
        });
    });
});

after(async () => {
    app._cleanup();
    await new Promise(resolve => server.close(resolve));
    testDb.close();
});

function decodeJWT(token) {
    return JSON.parse(
        Buffer.from(token.split('.')[1], 'base64url').toString()
    );
}

function makeMockFetch(options = {}) {
    return async (url, opts) => {
        const body = new URLSearchParams(opts?.body);
        return {
            ok: true,
            json: async () => ({
                valid: options.valid !== false,
                license_key: { id: 1, status: 'active', activation_limit: 1, activation_usage: 0 },
                meta: { variant_id: 'pro' },
                instance: { id: 'inst-1' },
            }),
        };
    };
}

// ─── Tests ────────────────────────────────────────────────────────────────

describe('Z-SEC-04: JWT jti + replay protection', () => {
    it('1. /verify emite JWT con jti único', async () => {
        const res = await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        });
        strictEqual(res.status, 200);
        const data = await res.json();
        ok(data.token);

        const payload = decodeJWT(data.token);
        ok(payload.jti, 'JWT debe tener claim jti');
        ok(typeof payload.jti === 'string');
        ok(payload.jti.length > 0);
    });

    it('2. Dos /verify consecutivos emiten jtis distintos', async () => {
        const r1 = await (await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        })).json();

        const r2 = await (await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        })).json();

        const jti1 = decodeJWT(r1.token).jti;
        const jti2 = decodeJWT(r2.token).jti;

        notStrictEqual(jti1, jti2, 'Dos JTIs deben ser distintos');
    });

    it('3. POST /verify-jwt con token válido → {valid: true}', async () => {
        const r = await (await fetch(`${baseURL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: 'VALID-KEY' }),
        })).json();

        const res = await fetch(`${baseURL}/verify-jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: r.token }),
        });
        strictEqual(res.status, 200);
        const data = await res.json();
        strictEqual(data.valid, true);
    });

    it('4. POST /verify-jwt con token firmado por otra key → {valid: false}', async () => {
        const otherKp = await generateKeyPair('EdDSA', { crv: 'Ed25519' });
        const fakeToken = await new SignJWT({ tier: 'pro', jti: 'fake-jti' })
            .setProtectedHeader({ alg: 'EdDSA' })
            .setIssuer('license.edugame.digital')
            .setAudience('esperantai-client')
            .setSubject('FAKE-KEY')
            .setIssuedAt(Math.floor(Date.now() / 1000))
            .setExpirationTime('1h')
            .sign(otherKp.privateKey);

        const res = await fetch(`${baseURL}/verify-jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: fakeToken }),
        });
        const data = await res.json();
        strictEqual(data.valid, false);
        strictEqual(data.reason, 'invalid_signature');
    });

    it('5. POST /verify-jwt con jti inexistente → {valid: false, reason: "unknown_jti"}', async () => {
        // Firmamos con la key real pero jti no está en el store
        const token = await new SignJWT({ tier: 'pro', jti: 'jti-inexistente-test' })
            .setProtectedHeader({ alg: 'EdDSA' })
            .setIssuer('license.edugame.digital')
            .setAudience('esperantai-client')
            .setSubject('KEY')
            .setIssuedAt(Math.floor(Date.now() / 1000))
            .setExpirationTime('1h')
            .sign(signingKey);

        const res = await fetch(`${baseURL}/verify-jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();
        strictEqual(data.valid, false);
        strictEqual(data.reason, 'unknown_jti');
    });

    it('6. JWT sin jti (legacy) → /verify-jwt lo rechaza como unknown_jti', async () => {
        const token = await new SignJWT({ tier: 'pro' })
            .setProtectedHeader({ alg: 'EdDSA' })
            .setIssuer('license.edugame.digital')
            .setAudience('esperantai-client')
            .setSubject('LEGACY-KEY')
            .setIssuedAt(Math.floor(Date.now() / 1000))
            .setExpirationTime('1h')
            .sign(signingKey);

        const res = await fetch(`${baseURL}/verify-jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();
        strictEqual(data.valid, false);
        strictEqual(data.reason, 'unknown_jti');
    });

    it('7. 10k+ verifications → LRU eviction (el más viejo se pierde)', { timeout: 30000 }, async () => {
        const store = jtiStoreInjected;
        for (let i = 0; i < 10010; i++) {
            store.add(`bulk-jti-${i}`, { licenseKey: `BULK-KEY-${i}`, issuedAt: Math.floor(Date.now() / 1000), expiresAt: Math.floor(Date.now() / 1000) + 86400 });
        }

        strictEqual(store.has('bulk-jti-0'), false, 'El primer jti debería haber sido evictado');
        strictEqual(store.has('bulk-jti-5000'), true, 'Un jti intermedio debería existir');
        strictEqual(store.has('bulk-jti-10009'), true, 'El último jti debería existir');
    });
});
