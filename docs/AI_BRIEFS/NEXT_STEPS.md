# Next Steps por IA — 2026-05-14

> Documento que Claude (coordinador) emite tras consolidar las 3 respuestas de kickoff.
> Cada IA puede empezar AHORA su próxima tarea sin esperar decisiones humanas que aún
> no llegan. Las decisiones de Joel se notificarán en este mismo archivo cuando se den.

---

## Estado del repo (cambio importante)

**El repo volvió a PÚBLICO** (2026-05-14) — porque ChatGPT reportó `404` al intentar
acceder vía conector de GitHub, y Joel notó que privado las bloquea. Mientras se
termina el producto el repo se queda público; cuando se lance comercialmente se evalúa
de nuevo.

URL pública: https://github.com/salazarjoelo/EsperantAI

Cada IA puede:
- `git clone https://github.com/salazarjoelo/EsperantAI.git`
- Leer cualquier archivo vía `https://raw.githubusercontent.com/salazarjoelo/EsperantAI/main/<ruta>`
- Ver el README, COORDINATION.md, TASKS.md, etc.

---

## Decisiones de Joel — pendientes (NO bloquean trabajo de IAs)

Estas decisiones siguen abiertas. **No esperar para avanzar**. Cuando lleguen, este
documento se actualiza y se notifica:

1. **Free tier sí/no/intermedio**: el código del collab tiene Free/Pro/Pro+; la
   directiva original de Joel es "sin Free sin trial". Por **default mantener directiva
   original** (no Free) hasta que Joel diga lo contrario. ChatGPT escribe copy bajo
   premisa "una licencia única".
2. **TASK-001 backend de licencias**: Cloudflare / VPS / posponer / post-launch.
   DeepSeek recomienda Cloudflare. Mientras tanto sigue hardening cliente (TASK-105,
   TASK-301).
3. **Merge PR #1** (features del collab): rama `merge/collab-features` espera. Las
   features ya están en `main` parcialmente (mergeado con cuidado, sin perder fixes
   del repo). El PR es de referencia/auditoría.
4. **Asignación Z vs Claude del solapamiento**: Calibration Wizard, Web Worker,
   SOOP/CHZZK, traducciones. Si Z reactiva participación, se renegocia. Si no, queda
   la asignación de Claude.

---

## ChatGPT — próxima acción (no requiere decisión de Joel)

**Toma**: TASK-101 polish + paywall copy + microcopy de errores.

**El código de Multi-Action Builder ya está implementado** (Z lo cerró en el collab,
mergeado a main). Tu trabajo NO es construirlo desde cero sino:

1. **Auditar el modal actual** en `core/trigger-ui-builder.js` línea 260+ y proponer
   mejoras de UX visual + accesibilidad (label-for, keyboard navigation, focus trap).
2. **Reescribir paywall actual** en `app.js` función de lockout (~línea 603-685 del
   `app.js` original) y proponer la "activación guiada" que ya describiste en tu
   respuesta sección 2.2.
3. **Reescribir microcopy de errores** que listaste en tu sección 2.5 — entregar
   un patch a `locales/en-US.json` y `locales/es-ES.json` con los strings nuevos. No
   tocar los otros locales aún.
4. **Reescribir landing copy** según tus 5 cambios accionables (`landing.html`),
   asumiendo "una licencia única, sin Free, sin trial" hasta que Joel diga otra cosa.

**Entregable**: PR `feat/ux-polish-paywall-and-microcopy` con los 4 cambios. Rama
desde `main`. Review por Claude (consistencia técnica) + DeepSeek (que el HTML/JS
nuevo no rompa CSP planeado para TASK-105).

**Plazo**: hasta 5 días.

---

## DeepSeek — próxima acción (no requiere decisión de Joel)

**Toma**: TASK-105 CSP hardening (parte 1) + setup tests.

**Empieza ya con lo que NO requiere decisión de Joel**:

1. **Auditar código real** (ahora puedes — repo público). Lee:
   - `index.html` (CSP actual + scripts y estilos inline)
   - `oauth-callback.html` (CSP + scripts inline)
   - `landing.html`
   - `core/license-manager.js` (verificar tu hallazgo 4 fingerprint con el código real)
   - `core/config-manager.js` (verificar BLOCKED_KEYS y que `_merge` sea seguro recursivamente — hallazgo 6)
   - `core/trigger-engine.js` (verificar tu hallazgo 5 MAX_PENDING)
   - `.github/workflows/deploy.yml` (verificar hallazgo 7)
   - `Instalar_EsperantAI.bat` (verificar hallazgo 8)
   - `app.js` función `validateOAuthState` (verificar hallazgo 3)

2. **Completar tu sección 2 con archivo:línea exacto** — actualiza
   `docs/AI_BRIEFS/responses/RESPONSE_FROM_DEEPSEEK.md` con los hallazgos reales
   confirmados. Si alguno NO se replica en el código real, márcalo como "no aplicable
   tras revisión".

3. **Empezar TASK-105 CSP hardening fase 1**: extraer scripts y estilos inline a
   archivos externos. Rama `chore/csp-hardening-extract-inline`. NO toques el header
   CSP todavía — primero hacer extracción funcional, después en una segunda fase aplicar
   `'self'` sin `'unsafe-inline'`. Esto te da PR pequeños y reversibles.

4. **Setup de tests baseline**: PR `chore/tests-vitest-jsdom-setup` con:
   - `package.json` con `vitest`, `jsdom`, `c8`/`@vitest/coverage-v8`
   - `vitest.config.js`
   - 3-5 tests de smoke para `config-manager.js` (incluyendo el payload de prototype
     pollution recursivo que mencionaste)
   - `npm run test` y `npm run validate-json` funcionando

**Entregables**: 2 PRs separados (PR-CSP-extract y PR-tests-setup). Review por Claude.

**Plazo**: hasta 7 días para los 2 PRs.

---

## Z/GLM-4 — próxima acción

**Toma**: review cultural de los 18 gestos + traducciones zh-CN/ja-JP/ko-KR.

Z ya entregó su parte estructural via el collab. Las próximas tareas concretas:

1. **Review cultural de los 18 gestos** (`core/trigger-engine.js` + `core/trigger-ui-builder.js`).
   Cada gesto tiene un badge "universal" o "cultural". Necesitamos que tú confirmes para
   cada uno si la clasificación es correcta para mercados China / Korea / Japón.
   - Entregable: tabla en `docs/CULTURAL_GESTURE_REVIEW.md` con cada gesto + dictamen
     + caveat si aplica + propuesta de mensaje de advertencia para streamers asiáticos.

2. **Traducciones zh-CN, ja-JP, ko-KR**: el repo tiene los 3 archivos `locales/zh-CN.json`,
   `ja-JP.json`, `ko-KR.json` como **stubs** (claves duplicadas del inglés). Completar las
   traducciones reales con adaptación cultural donde aplique.
   - Entregable: PR `i18n/zh-ja-ko-full-translation` con los 3 archivos completos.

3. **Spec de SOOP + CHZZK adapters** (TASK-106): NO codear todavía. Solo entregar un
   `docs/SPEC_SOOP_CHZZK.md` con:
   - URLs de las APIs en sus docs oficiales (en coreano si necesario, con tu traducción)
   - Auth flow de cada una
   - Formato de eventos chat/sub/donation
   - Limitaciones browser-only (¿requiere proxy?)
   - Comparación con Twitch EventSub para reusar patterns

**Entregables**: 3 archivos/PRs separados. Review por Claude (estructura) + nativo
humano si Joel encuentra uno disponible para las traducciones.

**Plazo**: 7-10 días para los 3.

**Pregunta abierta para Z**: ¿confirmas que sigues activa con el equipo (no solo entrega
única del collab)? Si sí, llena las secciones 1, 5, 6, 7, 8 de
`docs/AI_BRIEFS/responses/RESPONSE_FROM_Z_GLM4.md` que quedaron pendientes.

---

## Claude — próxima acción (yo mismo)

Mientras espero decisiones de Joel y ChatGPT/DeepSeek/Z entregan:

1. **Diseñar contrato Web Worker ↔ main thread** (`docs/CONTRACT_DETECTOR_WORKER.md`)
   para que DeepSeek tenga el spec antes de empezar TASK-104.
2. **Diseñar interfaz de verificación de JWT** (`docs/CONTRACT_LICENSE_VERIFIER.md`)
   para que DeepSeek pueda implementar TASK-001 si Joel lo desbloquea.
3. **Auditar el merge collab que hicimos**: tests manuales que YO puedo hacer (sin
   cámara) — node --check, validate-json, grep de fixes preservados.
4. **Mantener TASKS.md actualizado** con los PRs en curso de las otras 3 IAs.
5. **Review de PRs que lleguen** — primera línea de defensa antes de Joel.

---

## Cuándo se reactiva este documento

Cada vez que:
- Joel toma una decisión que modifica las premisas (Free tier, backend, asignación, etc.)
- Una IA termina su entrega y desbloquea a otra
- Una IA pide aclaración o reporta blocker

Claude actualiza este archivo, hace commit, y notifica a las 3 IAs vía Joel (si están
en chats separados) o vía PR descripción (si están leyendo el repo).

---

Co-authored-by: Claude <noreply@anthropic.com>
