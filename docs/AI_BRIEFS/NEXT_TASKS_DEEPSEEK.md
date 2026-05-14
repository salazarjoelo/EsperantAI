# Próximas tareas para DeepSeek — 2026-05-14 post-sesión-1

> Mensaje listo para que Joel pegue en chat.deepseek.com. Contiene las 3 tareas concretas que DeepSeek debe tomar a continuación.

---

DeepSeek, tus PRs #2 (Vitest + CI + validators) y #3 (CSP hardening fase 1) ya están mergeados. Trabajo limpio.

Estado del repo al cierre de sesión 1:
- 13 PRs cerrados en main
- 8 features mayores entregadas
- TASK-001 (backend licencias firmadas) implementado SIGUIENDO tu recomendación de Cloudflare Workers — al final Joel eligió VPS Hostinger propio (igual de válido). Backend Node.js Express + JWT Ed25519 está en `backend/` del repo, deployado al VPS. Tu input fue clave.
- Branch protection activa: `required_linear_history` + status checks `test` + `syntax-check`

Tus próximas 3 tareas (en orden de impacto):

## TAREA 1 (P1, primaria) — TASK-104 Web Worker para Human.js

Spec técnico completo en el repo: `docs/SPEC_DETECTOR_WORKER.md` (244 líneas, ya en main). Claude lo escribió pensando en cómo te lo entregaría yo (Joel) — léelo y dime si el contrato te sirve o si quieres ajustar antes de empezar.

Resumen del contrato:
- 6 verbos `postMessage`: INIT, FRAME (transferable ImageBitmap), PAUSE, RESUME, TERMINATE, INIT_DONE/INIT_ERROR/RESULT/MODEL_LOAD_PROGRESS/ERROR/BACKEND_LOSS
- OffscreenCanvas transferido al INIT (no por frame)
- Backpressure: si `pendingFrames > 2`, main descarta FRAME
- Auto-detect WebGPU > WebGL > CPU
- Fallback obligatorio a main thread si OffscreenCanvas no soportado (Firefox <110, Safari ≤16.4)
- Gassho NO se mueve al worker (queda en main thread, es liviano)

Métricas de éxito:
- ≥25 FPS detección + ≥55 FPS UI simultáneo en i5 2020 + GPU integrada
- Latencia frame→result P95 < 80ms
- Memory growth < 5 MB/h
- Fallback funciona en Firefox 109

Archivos:
- `core/detector-worker.js` (NUEVO)
- `core/detector.js` (modificar: cliente del worker + fallback main-thread)
- Tests Vitest con mocks de Worker (`tests/detector-worker.test.js`)

NO tocar: `trigger-engine.js`, `action-engine.js`, `app.js`. La API pública del detector NO cambia.

Plazo: 4-7 días.

## TAREA 2 (P1, secundaria) — TASK-105 fase 2 CSP completo

Tu PR #3 (fase 1) extrajo `<script>` y `<style>` blocks de `index.html`, `landing.html`, `oauth-callback.html`. Quedaron 8 warnings en el audit:
- 1 en `index.html`: `style-src 'self' 'unsafe-inline'` por 13 atributos `style=` inline en HTML
- 7 en `docs/*.html` legales (EULA, PRIVACY, TERMS, COOKIES, REFUND, PURCHASE, THIRD_PARTY) con `<style>` inline

Fase 2 elimina los 8:
- Refactorizar los 13 `style="..."` atributos en `index.html` a clases CSS en `css/index.css`
- Para los 6 docs legales: extraer cada `<style>` a `css/legal-doc.css` (mismo shared para todos, formato standalone) o a archivos `.css` individuales

Objetivo: CSP de los 3 archivos principales con `default-src 'self'; script-src 'self'; style-src 'self'` (cero unsafe-inline cero unsafe-eval).

Entregable: PR `chore/csp-hardening-fase-2-no-style-attrs`.

Plazo: 2-3 días.

## TAREA 3 (P2, terciaria) — Tests del backend de licencias (Node native test runner)

`backend/src/server.js` tiene 4 endpoints (`/verify`, `/deactivate`, `/webhook`, `/health`). Sin tests por ahora. Joel ya está usando el deploy en el VPS, hay riesgo de regresión si alguien (yo, tú, ChatGPT) modifica el backend.

Cobertura prioritaria:
- `/verify` con license_key válida → emite JWT correcto (alg=EdDSA, iss correcto, aud correcto, exp futuro)
- `/verify` con license_key inválida → status 403, error mapeado
- `/verify` con rate limit excedido → 429
- `/verify` con LemonSqueezy API down → 502
- `/webhook` con HMAC signature inválida → 401
- `/webhook` con HMAC válida + license_key_disabled → key se agrega a revoked set
- `/health` → 200 OK

Usar `node --test` (Node 20+ tiene runner integrado), no Vitest aquí — el backend es server-side, mismo runtime que Node.

Archivo: `backend/src/server.test.js`.

Mocks: stub `fetch` con `mock` global o `undici` mock para LemonSqueezy API.

Plazo: 2-3 días.

## Bonus opcional

Auditoría de seguridad del backend después de que esté serving real traffic:
- Headers de respuesta (CSP, HSTS, X-Frame-Options, etc.)
- Verificar que no leak información en errores (`/verify` con request malformado no debe revelar internals)
- Test de carga: 1000 req/s contra `/verify` y ver si rate limiter actua correctamente

## Hallazgo postmortem de Z

Z hizo review cruzada de PR #7 y encontró 1 bloqueante + 10 mejoras. Ya están todos cerrados en PR #13. Este es el estándar de review que deberías aplicar a los PRs de Claude, ChatGPT y Z. Para tus propios PRs: pide a Claude que haga lo equivalente.

## Notas operativas

- Repo público: `git clone https://github.com/salazarjoelo/EsperantAI.git`
- Branch protection activa: status checks required (`test`, `syntax-check`)
- Backend deployado en VPS Hostinger 187.77.23.49 (`/opt/esperantai-license/`)
- Pendiente solo: secrets de LemonSqueezy en `.env` + `systemctl enable` (Joel lo hace)
- Modelo: tú diseñas + escribes código, me pasas el texto, Claude lo commitea
- Si tu chat tiene límite de tamaño, divide en mensajes consecutivos

— Joel
