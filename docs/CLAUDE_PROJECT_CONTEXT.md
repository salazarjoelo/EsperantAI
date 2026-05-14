# EsperantAI — Contexto para Claude

## Proyecto
EsperantAI — Controlador AI por gestos para streamers. Web app vanilla JS, sin bundler, sin React.

## Repo
https://github.com/salazarjoelo/EsperantAI

## Arquitectura
- **Window globals** (no ES modules): cada módulo se monta en `window.NombreClase`
- **Adapters**: `adapter-base.js` define la interfaz, cada adapter (OBS, Streamlabs, vMix, XSplit) la implementa
- **Platforms**: `platform-base.js` define la interfaz, cada platform (Twitch, YouTube, Kick, Trovo, StreamElements) la implementa
- **Core**: detector.js (Human.js wrapper), trigger-engine.js, action-engine.js, trigger-ui-builder.js, trigger-history.js, license-manager.js, config-manager.js, i18n.js

## Convenciones de código
- Todo texto visible va por i18n (`data-i18n="key.path"` en HTML, `window.i18n.t('key')` en JS)
- `locales/en-US.json` es la fuente de verdad para traducciones
- `_escape()` obligatorio en todo HTML dinámico (ya existe en trigger-ui-builder.js)
- `config.set()` es debounced (300ms). Para writes inmediatos usar `config.flush()`
- Licencias: `TIER_FEATURES` en license-manager.js define qué puede cada tier (free/pro/pro_plus)
- Los métodos de adapter siempre retornan `Promise<boolean>` o `Promise<Array>`
- Los métodos de platform emiten eventos normalizados (sub, donation, raid, etc.)

## Features implementadas (v2.1)
- Dead Zone / Hystéresis en trigger-engine (hysteresisFactor=0.6, deadZoneYaw/Pitch/Roll, returnToCenterMs)
- Tier-based Feature Gating (Free/Pro/Pro+) con `hasFeature()`, `getTier()`, `getFeatureLimit()`
- Trigger History (ring buffer 100 entries, panel UI, export CSV)
- Multi-Action UI (botón ⚙️ por trigger, modal para agregar/eliminar acciones)
- Perfiles/Presets (switch, save, create, delete)
- OBS Source Transform + Crop (SetSceneItemTransform, SetSceneItemCrop)
- Bug fixes: XSS culturalNote, pendingEvents cap, config debounce, license race condition lock

## Features pendientes
- Calibration Wizard (onboarding guiado para auto-calibrar thresholds)
- Audio Feedback configurable por categoría
- Actualizar 12 locales con nuevas i18n keys
- Gestos secuenciales / Multi-step triggers
- SOOP + CHZZK platforms (mercado coreano)
- Web Worker para Human.js
- Manual de usuario
- Prompts para videos explicativos

## Antifabricación
- No inventar APIs que no existen en el código
- Verificar con el código real antes de proponer cambios
- Si no estás seguro de si algo existe, búscalo primero
- Las fuentes de datos de mercado están en PRODUCT_SPEC.md con URLs verificables

## Modelo de negocio
| Tier | Precio | Features |
|---|---|---|
| Free | $0 | OBS + Twitch + 5 triggers + 2 idiomas + watermark |
| Pro | TBD lifetime | Todas las apps + plataformas + 18 triggers + 12 idiomas |
| Pro+ Director | TBD lifetime | Pro + combo triggers + StreamElements + soporte directo |

## Owner
**Joel Salazar Ramírez** — Founder & Sales (EdugameDigital)
