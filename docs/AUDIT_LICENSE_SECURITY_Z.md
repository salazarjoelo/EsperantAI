# Security audit — License flow (Z, 2026-05-14)

## Resumen ejecutivo

- **12 findings**: 2 CRITICAL · 4 HIGH · 4 MEDIUM · 2 LOW
- El license flow tiene defensas criptográficas sólidas (Ed25519 JWT, HMAC webhook, timing-safe compare) pero **falla en la capa de aplicación**: el cliente confía en localStorage sin verificación criptográfica en la ruta sincrónica, las features se desbloquean desde DevTools, y el backend tiene un hardcode que otorga tier `pro` a todos los usuarios.
- **El bypass más simple** requiere 1 línea en DevTools: `LicenseManager.TIER_FEATURES.free = { ...LicenseManager.TIER_FEATURES.pro_plus }`. Sin necesidad de tocar localStorage ni red.
- **El bypass más peligroso** (Z-SEC-01) permite uso ilimitado offline editando localStorage y bloqueando el dominio del backend — funcional para 30 días sin licencia real.
- El backend está bien estructurado (rate limiting, CORS restrictivo, HMAC webhook), pero tiene 2 defectos de diseño que impiden la revocación real.

## Findings

---

### Z-SEC-01 — `isValid()` no verifica firma JWT: bypass vía localStorage + offline

- **Severity:** CRITICAL
- **Archivo + línea:** `core/license-manager.js:233-235`
- **Descripción:** `isValid()` es la función sincrónica que controla el lockout en `app.js:19`. Solo verifica que `this.state.jwt` sea truthy y `jwtExpires` sea futuro. No invoca `_verifyJWT()`, por lo que acepta cualquier string como JWT válido. Combinado con el grace period de 30 días en `_refresh()`, un atacante puede usar la app sin licencia real bloqueando el dominio del backend.
- **PoC:**
  1. Añadir a `/etc/hosts`: `0.0.0.0 license.edugame.digital`
  2. Abrir DevTools → Application → Local Storage
  3. Establecer `esperantai-license-v2`:
     ```json
     {
       "licenseKey": "FAKE-0000-0000-0000-0000",
       "jwt": "any.string.works",
       "jwtExpires": 9999999999,
       "tier": "pro_plus",
       "instanceId": null,
       "activatedAt": 1716000000000,
       "lastValidatedAt": 1747200000000
     }
     ```
  4. Recargar la página → `isValid()` devuelve `true` → `validate()` → `_verifyJWT()` falla → `_refresh()` → `!navigator.onLine` o fetch falla → `sinceValidated < 30 días` → devuelve `true`
  5. App arranca con tier `pro_plus`. Todos los features desbloqueados.
- **Impacto:** Uso completo sin licencia por 30 días renovables (re-seteando `lastValidatedAt`).
- **Fix recomendado:**
  1. `isValid()` debe llamar `_verifyJWT()` si el JWT existe. Cachear el resultado por 1 hora para evitar overhead.
  2. Agregar HMAC a todo el state de localStorage (firmar el JSON con una key derivada del JWT verificado).
  3. Reducir `OFFLINE_GRACE_MS` a 7 días (o 3 días para launch comercial).

---

### Z-SEC-02 — `TIER_FEATURES` es mutable globalmente: unlock instantáneo desde consola

- **Severity:** CRITICAL
- **Archivo + línea:** `core/license-manager.js:46-82` + `core/license-manager.js:261-269`
- **Descripción:** `LicenseManager.TIER_FEATURES` se expone como propiedad estática en `window`. Cualquier script (o línea en DevTools) puede mutar el objeto y desbloquear features para el tier `free`. `hasFeature()` lee de `TIER_FEATURES[tier]` en cada llamada, por lo que el cambio es inmediato sin recarga.
- **PoC:**
  ```js
  // En DevTools, una línea:
  Object.assign(LicenseManager.TIER_FEATURES.free, LicenseManager.TIER_FEATURES.pro_plus);
  // Ahora hasFeature('calibration') → true, hasFeature('handGestures') → true, etc.
  ```
- **Impacto:** Todos los features de Pro+ desbloqueados instantáneamente. No requiere localStorage, red, ni reinicio.
- **Fix recomendado:**
  1. Congelar el objeto: `Object.freeze(TIER_FEATURES)` y `Object.freeze(TIER_FEATURES.free/pro/pro_plus)`.
  2. Hacer `TIER_FEATURES` un getter que devuelva una copia profunda congelada.
  3. En `hasFeature()`, validar que `TIER_FEATURES` no fue modificado (checksum o comparación contra copia interna congelada).

---

### Z-SEC-03 — `inferTierFromMeta()` siempre devuelve `'pro'`: todos los JWT tienen tier pro

- **Severity:** HIGH
- **Archivo + línea:** `backend/src/server.js:155-161`
- **Descripción:** La función que determina el tier a incluir en el JWT tiene un TODO y siempre devuelve `'pro'`. Si Joel vende variantes Pro y Pro+ (con precios distintos), todos los usuarios reciben el tier Pro en su JWT, incluyendo los que pagaron por Pro+. Inversamente, si en el futuro se implementa un tier Free con limits, todos obtienen Pro.
- **PoC:**
  1. Comprar licencia Pro (no Pro+)
  2. Activar en EsperantAI
  3. El JWT emitido contiene `"tier": "pro"` — correcto
  4. Pero si se compra Pro+, el JWT también contiene `"tier": "pro"` — **incorrecto**, el usuario paga Pro+ pero recibe Pro
- **Impacto:** Pro+ users no obtienen features exclusivos (combo triggers, StreamElements). Revenue loss si Pro+ cuesta más.
- **Fix recomendado:**
  ```js
  function inferTierFromMeta(meta) {
      const variantId = meta?.variant_id ?? meta?.custom_data?.variant_id;
      const VARIANT_MAP = {
          [process.env.VARIANT_PRO]: 'pro',
          [process.env.VARIANT_PRO_PLUS]: 'pro_plus',
      };
      return VARIANT_MAP[variantId] || 'pro'; // fallback a pro si no hay mapping
  }
  ```

---

### Z-SEC-04 — Sin protección contra replay (no `jti`): JWT robado usable en cualquier dispositivo

- **Severity:** HIGH
- **Archivo + línea:** `backend/src/server.js:109-125` (emisión) + `core/license-manager.js:105-135` (verificación)
- **Descripción:** Los JWT emitidos no incluyen claim `jti` (JWT ID único). No hay validación de `iat` más allá de `exp`. Un atacante que roba el localStorage de una máquina (XSS, malware, acceso físico) puede copiar el JWT a otra máquina y usarlo por hasta 30 días. El backend no lleva registro de qué JWT están activos.
- **PoC:**
  1. En máquina A (usuario legítimo), copiar `localStorage['esperantai-license-v2']`
  2. En máquina B (atacante), pegar el mismo valor
  3. Ambas máquinas usan la misma licencia simultáneamente
  4. LemonSqueezy controla `activation_limit`, pero el JWT sigue siendo criptográficamente válido por 30 días sin re-verificación
- **Impacto:** Una licencia puede usarse en N dispositivos simultáneamente si el atacante bloquea el backend o desconecta internet.
- **Fix recomendado:**
  1. Agregar `jti: crypto.randomUUID()` al JWT en el backend.
  2. Mantener un Set de JITs activos en el backend (o Redis).
  3. En `_verifyJWT()`, agregar validación `iat`: rechazar JWT con `iat` anterior a los últimos 60 días.
  4. Alternativa: reducir `JWT_TTL_DAYS` de 30 a 7.

---

### Z-SEC-05 — Lista de revocación en memoria: server restart pierde todas las revocaciones

- **Severity:** HIGH
- **Archivo + línea:** `backend/src/server.js:49`
- **Descripción:** `const revokedKeys = new Set()` es un Set en memoria de proceso. Cuando el servidor reinicia (deploy, crash, VPS reboot), todas las revocaciones se pierden. Un usuario con licencia revocada por LemonSqueezy webhook puede reactivar su licencia simplemente esperando un restart del VPS.
- **PoC:**
  1. LemonSqueezy revoca una key → webhook agrega a `revokedKeys`
  2. VPS se reinicia (por deploy o crash)
  3. `revokedKeys` está vacío → la key revocada pasa `/verify` exitosamente
  4. Nuevo JWT emitido para una licencia revocada
- **Impacto:** Licencias revocadas se reactivan tras restart del backend.
- **Fix recomendado:**
  1. Persistir `revokedKeys` en SQLite (ya previsto en el TODO del código).
  2. Agregar health check que valide `revokedKeys` contra LemonSqueezy API periódicamente.
  3. Mínimo: escribir `revokedKeys` a archivo JSON en disco y cargarlo al inicio.

---

### Z-SEC-06 — `startBackgroundRevalidation()` no existe: app crashea para usuarios con licencia

- **Severity:** HIGH
- **Archivo + línea:** `app.js:25` (llamada) — método no definido en `core/license-manager.js`
- **Status:** ✅ **FIXED en PR separado** `fix/license-manager-missing-method-z-sec-06`. Detalles abajo.
- **Descripción original:** En `app.js` línea 25 se llama `lic.startBackgroundRevalidation()`, pero este método no estaba definido en la clase `LicenseManager`. Esto lanzaba `TypeError: lic.startBackgroundRevalidation is not a function` dentro del IIFE async, que era capturado por el `.catch()` final. **La app no cargaba para usuarios con licencia válida**. Adicionalmente, la revalidación periódica nunca se programaba, lo que significa que una licencia revocada nunca se detectaba durante la sesión.
- **Fix aplicado:** Método agregado en `core/license-manager.js` con `setInterval` cada 7 días. Falla silenciosa en background; grace period offline maneja desconexión. También se agregó `stopBackgroundRevalidation()` complementario.

---

### Z-SEC-07 — Grace period de 30 días amplía licencia indefinidamente si se bloquea el backend

- **Severity:** MEDIUM
- **Archivo + línea:** `core/license-manager.js:35` + `core/license-manager.js:190-195`
- **Descripción:** `OFFLINE_GRACE_MS = 30 * 24 * 60 * 60 * 1000` (30 días). Si un usuario legítimo pierde acceso a internet, la app funciona 30 días sin revalidación. Esto es by design para UX, pero un atacante puede explotarlo bloqueando `license.edugame.digital` en el firewall/hosts. Después de 30 días, solo necesita conectar momentáneamente para refrescar, y luego bloquear de nuevo. Esto permite usar una licencia revocada o expirada con solo 1 conexión cada 30 días.
- **PoC:**
  1. Bloquear `license.edugame.digital` en `/etc/hosts`
  2. Usar la app normalmente por 30 días
  3. Al día 29, desbloquear temporalmente → `validate()` refresca → nuevo JWT
  4. Volver a bloquear → otros 30 días
- **Impacto:** Licencias revocadas/expiradas se usan indefinidamente con mínima conexión.
- **Fix recomendado:**
  1. Reducir a 7 días para launch comercial.
  2. Acumular "días online" vs "días offline" y requerir conexión al menos 1 vez cada 7 días online.
  3. Mostrar advertencia visible "Licencia sin verificar hace X días" que no se puede cerrar.

---

### Z-SEC-08 — Fingerprint de dispositivo trivialmente spoofable: no previene sharing de licencia

- **Severity:** MEDIUM
- **Archivo + línea:** `core/license-manager.js:210-222`
- **Descripción:** El fingerprint usa `navigator.userAgent + language + platform + screen + timezoneOffset`. Estos valores son legibles y reproducibles. Un atacante puede configurar otro navegador con el mismo UA, idioma, resolución y zona horaria para generar el mismo fingerprint y usar la misma licencia en múltiples máquinas.
- **PoC:**
  1. En máquina A, leer el fingerprint desde DevTools
  2. En máquina B, usar un user-agent switcher y ajustar resolución/zona horaria
  3. El fingerprint será idéntico
  4. `activate()` con la misma key genera el mismo `instance_name`
- **Impacto:** La protección anti-multi-dispositivo es cosmética. No previene sharing.
- **Fix recomendado:**
  1. Agregar `canvas fingerprint` (renderizado de texto a canvas offscreen) — más difícil de spoofear.
  2. Agregar `AudioContext fingerprint` como factor adicional.
  3. Generar un UUID aleatorio y almacenarlo en IndexedDB (no localStorage, que es más visible). Este UUID se envía al backend como parte del `instance_name`.
  4. Nota: Ningún fingerprint client-side es irrompible. El objetivo es hacer el bypass más costoso que la licencia.

---

### Z-SEC-09 — CORS permite localhost en producción: bypass local

- **Severity:** MEDIUM
- **Archivo + línea:** `backend/src/server.js:63-64`
- **Descripción:** `ALLOWED_ORIGINS` incluye `http://localhost:8000` y `http://127.0.0.1:8000`. En producción, si el backend solo sirve al cliente en GitHub Pages, estos orígenes no deberían estar permitidos. Un atacante en la misma red puede levantar un servidor local en `localhost:8000`, hacer que la víctima lo visite, y usar el backend de licencias a través de CORS.
- **PoC:**
  1. Atacante crea `http://localhost:8000/fake-app.html`
  2. Víctima visita la URL (phishing o redirección)
  3. El JS del atacante hace `fetch('https://license.edugame.digital/verify', ...)` — CORS permite el origen
  4. El atacante puede probar keys en nombre de la víctima
- **Impacto:** Permite usar el backend de licencias desde localhost, potencialmente para brute-force o abuso.
- **Fix recomendado:**
  1. Usar variable de entorno `ALLOWED_ORIGINS` que cambie entre dev y prod.
  2. En producción, solo permitir `https://salazarjoelo.github.io` y `https://edugame.digital`.
  3. Eliminar `localhost` del array de producción.

---

### Z-SEC-10 — Falta `frame-ancestors 'none'` en CSP de oauth-callback: riesgo de clickjacking

- **Severity:** MEDIUM
- **Archivo + línea:** `oauth-callback.html:7`
- **Descripción:** La CSP incluye `default-src 'self'; script-src 'self'` pero no tiene `frame-ancestors 'none'`. Un atacante puede cargar `oauth-callback.html` en un iframe invisible sobre una página maliciosa, engañando al usuario para que interactúe con el callback OAuth sin su conocimiento.
- **PoC:**
  1. Atacante crea página con `<iframe src="https://salazarjoelo.github.io/EsperantAI/oauth-callback.html" style="opacity:0; position:absolute; top:0; left:0; width:100%; height:100%">`
  2. Superpone elementos visuales que engañan al usuario
  3. El callback podría procesar tokens OAuth en contexto del atacante
- **Impacto:** Clickjacking en el flujo OAuth. Potencial robo de tokens de plataforma.
- **Fix recomendado:**
  Agregar a la CSP: `frame-ancestors 'none'` o `X-Frame-Options: DENY` header.
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; connect-src 'self' https://id.twitch.tv https://accounts.google.com https://id.kick.com; style-src 'self'; frame-ancestors 'none';">
  ```

---

### Z-SEC-11 — Endpoint `/deactivate` sin autenticación: cualquiera puede desactivar una instancia

- **Severity:** LOW
- **Archivo + línea:** `backend/src/server.js:133-148`
- **Descripción:** El endpoint `/deactivate` no requiere autenticación más allá de conocer `license_key` y `instance_id`. Un atacante que averigüe ambos valores (por ejemplo, leyendo localStorage de la víctima) puede desactivar la instancia de la víctima, causando un DoS.
- **PoC:**
  1. Acceder físicamente al equipo de la víctima o mediante XSS
  2. Leer `localStorage['esperantai-license-v2']` → obtener `licenseKey` y `instanceId`
  3. Llamar `POST /deactivate` con esos valores
  4. La instancia de la víctima se desactiva
- **Impacto:** DoS a usuarios legítimos. No roba la licencia, pero la desactiva en ese dispositivo.
- **Fix recomendado:**
  1. Requerir JWT válido en el header de `/deactivate`.
  2. Verificar que el `instance_id` pertenece al JWT presentado.
  3. Rate-limit `/deactivate` igual que `/verify`.

---

### Z-SEC-12 — License key almacenada en localStorage sin cifrar: accesible a cualquier script del mismo origen

- **Severity:** LOW
- **Archivo + línea:** `core/license-manager.js:63-67`
- **Descripción:** La license key se almacena en texto plano en `localStorage`. Cualquier script JS cargado en el mismo origen (XSS, script de terceros comprometido, extensión maliciosa) puede leerla. Si el usuario reutiliza la misma key en otros servicios, el impacto se amplifica.
- **PoC:**
  1. Si existe un XSS en cualquier parte de la app (por ejemplo, en el import de config)
  2. El script malicioso ejecuta: `JSON.parse(localStorage.getItem('esperantai-license-v2')).licenseKey`
  3. La key se exfiltra al servidor del atacante
- **Impacto:** Robo de license key. La key puede usarse en otra máquina.
- **Fix recomendado:**
  1. Cifrar la license key con una key derivada del device fingerprint antes de almacenarla.
  2. No almacenar la key si no es necesaria para revalidación (usar solo JWT).
  3. Alternativa: usar `sessionStorage` en lugar de `localStorage` (se pierde al cerrar browser, pero reduce la ventana de robo).

---

## Lo que NO encontré (revisado y descartado)

1. **Falsificación de JWT Ed25519** — `_verifyJWT()` usa `crypto.subtle.verify('Ed25519', ...)` con clave pública importada correctamente. Sin la clave privada (que vive solo en el VPS), no es posible falsificar firmas. ✅
2. **Timing attack en comparación de firma** — `crypto.subtle.verify` es constante-tiempo por especificación WebCrypto. ✅
3. **XSS en el input de license key** — `showLicenseLockout()` usa `input.value` y `textContent` para mostrar errores. No hay `innerHTML` con input del usuario. ✅
4. **OAuth state CSRF** — `validateOAuthState()` genera nonce aleatorio, almacena en `sessionStorage`, valida one-time, y elimina después de usar. ✅
5. **CSP con `unsafe-inline` o `eval`** — `oauth-callback.html` tiene `script-src 'self'` sin `unsafe-inline`. El main app CSP no fue revisado (fuera de scope), pero el callback está correcto. ✅
6. **HMAC del webhook** — `safeEqual()` usa `timingSafeEqual` de Node.js crypto. Implementación correcta. ✅
7. **Brute-force de license keys** — Las keys LemonSqueezy son UUIDs (122 bits de entropía). Con rate limit de 10/5min/IP, el brute-force es inviable incluso con botnet. ✅
8. **MITM del backend** — El backend se accede vía HTTPS (Apache reverse proxy). El cliente usa `fetch(https://license.edugame.digital/verify)`. Si HTTPS está bien configurado, MITM no es posible. ✅ (verificar configuración Apache fuera de scope)
9. **Race condition en `_operationLock`** — JavaScript es single-threaded en el browser. El lock boolean previene doble llamada correctamente. ✅
10. **Inyección en LemonSqueezy API call** — Los parámetros se pasan como `URLSearchParams`, no como string interpolation. No hay SQL injection ni header injection. ✅

## Recomendaciones generales

1. **Defensa en profundidad para tier gating**: Congelar `TIER_FEATURES` + agregar HMAC al state de localStorage. Ambos fixes son under-1-hour cada uno y eliminan los 2 vectores CRITICAL.

2. **Reducir TTL de JWT**: 30 días es excesivo para un producto comercial. Recomendado: 7 días con refresh automático cuando hay conexión. Esto reduce la ventana de replay (Z-SEC-04) y el impacto del grace period (Z-SEC-07).

3. **Persistir revocaciones**: Migrar `revokedKeys` a SQLite antes del launch. Es la diferencia entre revocación real y revocación cosmética.

4. **Implementar `startBackgroundRevalidation()`**: Es un bug de funcionalidad, no solo de seguridad. La app no carga para usuarios de pago. — **Ya hecho en PR separado `fix/license-manager-missing-method-z-sec-06`.**

5. **Mapear variantes de LemonSqueezy a tiers**: `inferTierFromMeta()` es el enlace entre el sistema de pagos y el sistema de features. Sin él, el tier Pro+ no existe en la práctica.

6. **Variables de entorno para CORS**: Separar `ALLOWED_ORIGINS` entre dev y prod. Nunca permitir `localhost` en producción.

7. **Checksum de integridad del cliente**: Considerar agregar un hash del bundle JS que el backend pueda verificar. Si un atacante modifica `license-manager.js`, el hash no coincide y el backend rechaza la conexión.

---

*Auditoría realizada por Z (GLM-4) el 2026-05-14. Código revisado: `core/license-manager.js` (475 líneas), `backend/src/server.js` (249 líneas), `oauth-callback.html` (21 líneas), `app.js` (~620 líneas). Total: ~1365 líneas auditadas manualmente.*
