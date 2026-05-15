/**
 * Tests para Z-SEC-05: SQLite revocations.
 * 6 casos con node --test nativo (Node 20+).
 *
 * Ejecutar: cd backend && npm test
 */
import { describe, it, before, after } from 'node:test';
import { strictEqual, ok } from 'node:assert';
import { unlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import Database from 'better-sqlite3';

// ─── Database helpers (copiados de server.js para no romper imports) ─────
function createRevocationsDb(dbPath) {
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

// ─── Tests ────────────────────────────────────────────────────────────────

describe('Z-SEC-05: SQLite revocations', () => {
    let db;

    before(() => {
        db = new Database(':memory:');
        db.pragma('journal_mode = MEMORY');
        db.exec(`
            CREATE TABLE IF NOT EXISTS revoked_keys (
                license_key TEXT PRIMARY KEY,
                reason TEXT,
                revoked_at INTEGER NOT NULL DEFAULT (unixepoch()),
                source TEXT DEFAULT 'webhook'
            );
        `);
    });

    after(() => {
        db.close();
    });

    it('1. Agregar revocación → isRevoked true', () => {
        addRevocation(db, 'REVOKED-KEY-1', 'test reason', 'test');
        strictEqual(isRevoked(db, 'REVOKED-KEY-1'), true);
    });

    it('2. Key no revocada → isRevoked false', () => {
        strictEqual(isRevoked(db, 'NEVER-REVOKED'), false);
    });

    it('3. Doble revocación no duplica (INSERT OR IGNORE)', () => {
        addRevocation(db, 'DUP-KEY', 'first', 'test');
        addRevocation(db, 'DUP-KEY', 'second', 'test');

        const revs = getRevocations(db, 100);
        const matches = revs.filter(r => r.license_key === 'DUP-KEY');
        strictEqual(matches.length, 1, 'No debe haber duplicados');
    });

    it('4. Listar revocations limitadas', () => {
        addRevocation(db, 'LIST-KEY-1', null, 'test');
        addRevocation(db, 'LIST-KEY-2', 'violation', 'webhook');

        const all = getRevocations(db, 100);
        ok(all.length >= 2, 'Debe listar al menos 2 revocaciones');

        const limited = getRevocations(db, 1);
        strictEqual(limited.length, 1, 'Limit 1 debe devolver 1 fila');

        const keys = all.map(r => r.license_key);
        ok(keys.includes('LIST-KEY-1'));
        ok(keys.includes('LIST-KEY-2'));
    });

    it('5. removeRevocation funciona', () => {
        addRevocation(db, 'REMOVE-KEY', 'to be removed', 'test');
        strictEqual(isRevoked(db, 'REMOVE-KEY'), true);

        removeRevocation(db, 'REMOVE-KEY');
        strictEqual(isRevoked(db, 'REMOVE-KEY'), false);
    });

    it('6. Revocaciones sobreviven close/re-open (con archivo temp)', () => {
        const tempPath = join(tmpdir(), `esperantai-revocations-test-${Date.now()}.db`);

        const db1 = createRevocationsDb(tempPath);
        addRevocation(db1, 'PERSIST-KEY', 'survives restart', 'webhook');
        strictEqual(isRevoked(db1, 'PERSIST-KEY'), true);
        db1.close();

        const db2 = createRevocationsDb(tempPath);
        strictEqual(isRevoked(db2, 'PERSIST-KEY'), true, 'Los datos deben sobrevivir close/re-open');

        db2.close();
        if (existsSync(tempPath)) unlinkSync(tempPath);
    });
});
