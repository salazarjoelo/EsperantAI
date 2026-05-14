# Próximas tareas para ChatGPT — 2026-05-14 post-sesión-1

> Mensaje listo para que Joel pegue en chat.openai.com. Contiene las 2 tareas concretas que ChatGPT debe tomar a continuación.

---

ChatGPT, tu PR #4 (UX polish: paywall + Multi-Action modal + microcopy + landing) ya está mergeado en main. Buena entrega.

Estado del repo al cierre de sesión 1 (2026-05-14):
- 13 PRs cerrados en main
- 8 features mayores entregadas (Multi-Action UI, Profiles, Tier Gating, CSP fase 1, tests + CI, backend de licencias JWT, gassho gesture, UX polish)
- Branch protection activa: required_linear_history + status checks `test` + `syntax-check`

Tus próximas 2 tareas (en orden):

## TAREA 1 (P1, primaria) — TASK-102 Calibration Wizard

Brief técnico completo en el repo: `docs/BRIEF_CALIBRATION_WIZARD_CHATGPT.md` (272 líneas, ya en main).

Resumen:
- Wizard de 6 pantallas (bienvenida + 4 pasos + confirmación)
- Auto-launch en primer arranque + botón "Recalibrar" en Advanced
- Captura baseline yaw/pitch/roll + rango izq/der/incline + hand check
- Algoritmo: threshold = 60% del rango máximo del usuario (safety factor)
- Persiste en `config.thresholds.*` via `config.set + flush()`
- Tier gating: `license.hasFeature('calibration')` ya existe
- Microcopy ES propuesto, refinas a tu juicio

Archivos a tocar:
- `core/calibration-wizard.js` (NUEVO, la clase `CalibrationWizard`)
- `index.html` (modal overlay)
- `app.js` (detectar first-launch, lanzar wizard)
- `locales/en-US.json` + `es-ES.json` (microcopy)
- `core/detector.js` (agregar EventEmitter `.on/.off` si no existe — verifica primero)

NO tocar: `core/trigger-engine.js` (lee thresholds del config automáticamente).

Entregable: bundle copy-paste-able igual que tu PR #4 (script aplicador + diff + PR description). Yo (Joel) te lo paso a Claude y Claude abre PR #14.

Plazo: 3-5 días.

## TAREA 2 (P1, secundaria — empieza cuando termines la 1) — TASK-107 traducciones EU/LatAm

Locales asignados a ti (vs Z que cubre CJK):
- `pt-BR` (Portuguese Brazil)
- `fr-FR` (Français France)
- `de-DE` (Deutsch Deutschland)
- `it-IT` (Italiano Italia)
- `ru-RU` (Русский Россия)
- `pl-PL` (Polski Polska)
- `ar-SA` (العربية السعودية)

Estado actual: los 7 son stubs con ~80 keys (mismas keys del en-US viejo). Falta traducir las 270 keys completas de en-US actual (post PR #4 UX polish y PR #8 backend licencias):
- `actions.*` (18) — tipos de acción para el Multi-Action modal
- `actions.params.*` (22) — labels de campos dinámicos
- `history.*` (7) — trigger history panel
- `license.*` (12 + 6 guided steps) — incluyendo el flujo de activación guiada que tú escribiste
- `profiles.*` (8) — sistema de perfiles
- `sensitivity.dead_zone_*` (3) — calibration outcome
- `errors.*` (~10) — OAuth + action errors
- `ui.*` (3) — close, yes, no

Adaptación cultural mínima requerida:
- Microcopy de errores debe ser accionable en cada idioma (no robotic)
- Términos técnicos: traduce donde tenga sentido (`scene` → `escena` en es, `Szene` en de), respeta donde sea jerga (`OAuth`, `WebSocket`, `OBS`)
- Para `ar-SA`: respeta dirección RTL (los textos UI ya manejan `_meta.rtl: true`)

Entregable: 7 archivos JSON completos, mismo formato que `zh-CN.json` o `ja-JP.json` actuales.

Plazo: 1-2 días por idioma. Total ~10 días.

## Bonus opcional (no urgente)

VIDEO_SCRIPTS.md del repo tiene solo Video #1 como referencia de estilo. Puedes completar #2-#13 cuando termines lo anterior y antes de v1.5.

## Notas operativas

- Repo público, sin login para leer: `git clone https://github.com/salazarjoelo/EsperantAI.git`
- Branch protection activa: no force push, status checks required
- Modelo de coordinación: tú diseñas + escribes código, me pasas el texto, Claude lo commitea en branch + abre PR + Joel aprueba merge
- Si tu chat tiene límite de tamaño para entregas grandes (Calibration Wizard puede ser >2K líneas con microcopy), divide en mensajes consecutivos
- Decisiones de Joel pendientes para v1.5: pricing tier definitivo, mercados asiáticos (Korea), backend post-MVP

— Joel
