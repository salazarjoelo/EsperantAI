# Tareas para DeepSeek — DS-304 + DS-305

Tienes 2 tareas backend de seguridad. Ambas son security batch-2 cerrando findings HIGH del audit Z-201. Cada una es un PR separado.

---

## DS-304 — Z-SEC-04: JWT `jti` único + replay protection

### Por qué importa

Findings Z-SEC-04 (HIGH): los JWT emitidos por el backend NO tienen claim `jti` (JWT ID único). Esto significa:
1. Un atacante que roba `localStorage` de una máquina (XSS, malware, acceso físico) puede copiar el JWT a otra máquina y usarlo por hasta 30 días (ahora 7 tras Z-SEC-07)
2. El backend no lleva registro de qué JWTs están activos
3. Misma licencia puede usarse en N máquinas simultáneamente

### Sub-tareas

**1.** En `backend/src/server.js`, agregar `jti: crypto.randomUUID()` al payload del JWT en el endpoint `/verify`:

```js
const jti = crypto.randomUUID();
const token = await new SignJWT({
    tier, ls_id, ..., jti  // ← agregar
})
    .setProtectedHeader({ alg: 'EdDSA' })
    .setJti(jti)  // ← también via setter de jose
    ...
```

**2.** Mantener un `Map<jti, {licenseKey, issuedAt, expiresAt}>` en memoria de proceso. Capacidad máxima: 10,000 JWTs activos (LRU eviction si supera).

**3.** Endpoint nuevo `POST /verify-jwt`:
```
Body: { token: "<JWT>" }
Response (200): { valid: true } | { valid: false, reason: "expired"|"revoked"|"unknown_jti" }
```
Verificar firma + jti existe en el Map + jti.licenseKey no está en `revokedKeys`.

**4.** En el frontend `core/license-manager.js`, agregar llamada periódica a `/verify-jwt` en `startBackgroundRevalidation()` (en lugar de re-validar la license key entera contra LemonSqueezy).

**5.** Persistir el Map a disco para sobrevivir restarts. Archivo: `/var/lib/esperantai/active-jtis.json`. Reload al boot. Save cada 60s o on shutdown.

### Tests obligatorios

`backend/src/jti.test.js` (nuevo archivo, mismo pattern que server.test.js — node --test):
1. `/verify` emite JWT con jti único
2. Dos `/verify` consecutivos emiten jtis distintos
3. `/verify-jwt` con jti válido → 200 `{valid: true}`
4. `/verify-jwt` con jti revocado → 200 `{valid: false, reason: 'revoked'}`
5. `/verify-jwt` con jti nunca emitido → 200 `{valid: false, reason: 'unknown_jti'}`
6. JTIs sobreviven restart (escribir archivo, simular restart, leer)
7. Map alcanza 10k → LRU eviction del más viejo

### Acceptance criteria

```bash
cd backend && npm test   # 19+ tests pass (12 anteriores + 7+ nuevos)
node --check src/server.js  # OK
```

### Anti-patterns

1. NO usar Redis o DB externa para el Map — process memory + JSON file persistence es suficiente para v2.0
2. NO bloquear `/verify` esperando disk write — async fire-and-forget
3. NO romper JWTs ya emitidos antes de este cambio — los JWTs viejos no tienen `jti`, deben seguir aceptándose por su TTL natural pero NO se pueden revocar individualmente (acceptable trade-off documentado)

### Branch + PR

- Branch: `security/z-sec-04-jti-replay-protection`
- Título: `feat(security): Z-SEC-04 — JWT jti + replay protection backend`

### Plazo: 2-3 sesiones

---

## DS-305 — Z-SEC-05: Persistir `revokedKeys` a SQLite

### Por qué importa

Finding Z-SEC-05 (HIGH): `revokedKeys` es un `Set` en memoria de proceso. Cuando el servidor reinicia (deploy, crash, VPS reboot), todas las revocaciones se pierden. Un usuario con licencia revocada por LemonSqueezy webhook puede reactivar su licencia simplemente esperando un restart del VPS.

### Sub-tareas

**1.** Agregar `better-sqlite3` a `backend/package.json`:
```json
"dependencies": {
    "express": "^4.21.2",
    "jose": "^5.10.0",
    "rate-limiter-flexible": "^5.0.4",
    "better-sqlite3": "^11.0.0"
}
```

**2.** Crear `backend/src/db.js`:
```js
import Database from 'better-sqlite3';
import { existsSync } from 'node:fs';
const DB_PATH = process.env.DB_PATH || '/var/lib/esperantai/state.sqlite';
// CREATE TABLE IF NOT EXISTS revoked_keys (key TEXT PRIMARY KEY, revoked_at INTEGER, reason TEXT)
// Methods: addRevoked(key, reason), isRevoked(key), removeRevoked(key), listRevoked(limit)
export function createDb(path = DB_PATH) { ... }
```

**3.** En `createApp(deps)`, aceptar `deps.db` para inyección en tests. Default: `createDb()`.

**4.** Reemplazar `const revokedKeys = new Set()` y todas sus usos por llamadas a `db`:
- `if (revokedKeys.has(license_key))` → `if (db.isRevoked(license_key))`
- `revokedKeys.add(key)` → `db.addRevoked(key, eventName)`

**5.** En el webhook handler, agregar la key con reason del evento (`license_key_disabled` o `license_key_revoked`).

**6.** Endpoint admin nuevo `GET /admin/revoked` (requiere header `X-Admin-Token` que match env var `ADMIN_TOKEN`) que lista las últimas N revocaciones para debugging.

### Tests obligatorios

`backend/src/db.test.js`:
1. createDb crea schema correcto en archivo nuevo
2. addRevoked + isRevoked funcionan
3. Persistencia sobrevive close+reopen
4. Webhook con HMAC válido + event=license_key_disabled → db.isRevoked devuelve true
5. /verify rechaza key revocada incluso tras simular restart (close db, reopen)

### Migration path

Para Joel:
1. SSH al VPS
2. `mkdir -p /var/lib/esperantai && chown edugame:edugame /var/lib/esperantai`
3. Restart service → schema se crea automáticamente
4. Webhooks futuros poblan la DB

NO requiere data migration (la lista in-memory previa se reseteaba cada restart de todos modos).

### Acceptance criteria

```bash
cd backend && npm install   # instala better-sqlite3 (nativo, requiere build tools)
cd backend && npm test       # 25+ tests pass (Z-SEC-04 + Z-SEC-05 combinados si se mergean en orden)
```

### Anti-patterns

1. NO commitear el archivo `.sqlite` a git
2. NO usar `sqlite3` npm package (callback-based legacy) — usar `better-sqlite3` (sync, mucho más simple)
3. NO bloquear /verify por write SQLite — la write es local <1ms pero igual usar async pattern para futuro Postgres
4. NO exponer `/admin/revoked` sin auth token

### Branch + PR

- Branch: `security/z-sec-05-sqlite-revocations`
- Título: `feat(security): Z-SEC-05 — persistir revokedKeys en SQLite`

### Plazo: 2 sesiones

---

## Orden recomendado

1. **DS-304 primero** (jti): es prerequisito conceptual de DS-305 (ambos tocan el modelo de revocación)
2. **DS-305 después** (SQLite): puede mergearse después de #304 reusando el patrón de injección de deps

Ambos cierran findings HIGH del audit. Después de estos 2, batch-2 de Z-SEC queda completo (Z-SEC-08/11/12 son LOW y se atacan en batch-3 futuro).

Si hay dudas técnicas sobre design (ej. ¿Map o Set?, ¿LRU o FIFO?, ¿async o sync?), me preguntas a mí (Claude) via Joel antes de empezar.
