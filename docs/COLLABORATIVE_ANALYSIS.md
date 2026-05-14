# EsperantAI — Análisis Colaborativo Multi-LLM

> **Fecha**: 2026-03-05
> **Repo**: https://github.com/salazarjoelo/EsperantAI
> **Versión analizada**: v2.1 (post-bugfixes)
> **Participantes**: Z.ai (coordinador), Claude, DeepSeek, ChatGPT 5.5

---

## Instrucciones para cada LLM

1. Lee TODO este documento y el código del repo completo
2. Completa TU sección con análisis honesto y verificable
3. Si contradices a otro LLM, explica por qué con evidencia del código
4. Usa el formato de severidad: 🔴 Crítico | 🟠 Alto | 🟡 Medio | 🟢 Bajo
5. **NO inventes APIs, datos ni funcionalidades que no existan en el código**
6. Al final, propone tu distribución de trabajo ideal

---

## A. Contexto del Proyecto

### Concepto
EsperantAI es un controlador AI por gestos para streamers. Traduce gestos faciales y corporales en comandos para software de streaming (OBS, Streamlabs, vMix, etc.), en cualquier plataforma (Twitch, YouTube, Kick, etc.), en cualquier idioma (13 locales).

**Slogan**: *Los gestos honestos.*

### Stack técnico
- **Frontend**: Vanilla JS (no React, no bundler) — web app pura
- **AI**: Human.js 3.3.6 (detección facial/manos/emociones, corre 100% local en GPU del navegador)
- **Streaming software**: obs-websocket-js 5.0.8 (OBS), HTTP REST (vMix), WebSocket (Streamlabs), XJS (XSplit)
- **Plataformas**: EventSub WebSocket (Twitch), REST polling (YouTube), OAuth 2.1 PKCE (Kick), WebSocket (Trovo), Socket.IO (StreamElements)
- **Licencias**: LemonSqueezy License API
- **i18n**: 13 locales JSON con auto-detección
- **Hosting**: GitHub Pages (gratis, sin backend)

### Estructura de archivos
```
EsperantAI/
├── index.html              ← UI principal
├── app.js                  ← Bootstrap + UI bindings
├── landing.html            ← Landing page de ventas
├── oauth-callback.html     ← Callback OAuth para Twitch/YT/Kick
├── core/
│   ├── detector.js         ← Wrapper Human.js + cámara
│   ├── trigger-engine.js   ← Sistema de triggers + cooldown + dead zone
│   ├── action-engine.js    ← 18 tipos de acción ejecutables
│   ├── trigger-ui-builder.js ← Panel visual gesto→escena
│   ├── trigger-history.js  ← Ring buffer de últimos 100 triggers
│   ├── license-manager.js  ← LemonSqueezy + tier gating (Free/Pro/Pro+)
│   ├── config-manager.js   ← localStorage + perfiles + import/export
│   └── i18n.js             ← Sistema de traducciones
├── adapters/
│   ├── adapter-base.js     ← Interface común
│   ├── adapter-obs.js      ← OBS WebSocket v5 (reconnect, studio mode)
│   ├── adapter-streamlabs.js
│   ├── adapter-vmix.js
│   └── adapter-xsplit.js   ← Beta
├── platforms/
│   ├── platform-base.js    ← Interface común
│   ├── platform-twitch.js  ← EventSub WebSocket
│   ├── platform-youtube.js ← REST polling
│   ├── platform-kick.js    ← OAuth 2.1 PKCE
│   ├── platform-trovo.js   ← Chat WebSocket
│   └── platform-streamelements.js ← Socket.IO bridge
├── locales/                ← 13 idiomas (en-US, es-ES, es-MX, pt-BR, fr-FR, de-DE, ja-JP, ru-RU, zh-CN, it-IT, pl-PL, ar-SA, ko-KR)
├── libs/                   ← Vendor (human.js, obs-ws.min.js)
├── assets/branding/        ← Logo SVG
├── docs/
│   ├── PRODUCT_SPEC.md
│   ├── ARCHITECTURE.md
│   ├── SETUP_VENTAS.md
│   ├── EULA.html
│   ├── TERMS_OF_SERVICE.html
│   ├── PRIVACY.html
│   ├── COOKIE_POLICY.html
│   └── THIRD_PARTY_LICENSES.html
└── .claude/                ← Hooks anti-fabricación
```

### Modelo de negocio
| Tier | Precio | Features |
|---|---|---|
| **Free** | $0 | OBS + Twitch + 5 triggers + 2 idiomas + watermark |
| **Pro** | $X TBD lifetime | Todas las apps + todas las plataformas + 18 triggers + 12 idiomas + sin watermark |
| **Pro+ Director** | $Y TBD lifetime | Pro + combo triggers + StreamElements bridge + soporte directo |

### Funcionalidad "combo trigger" (diferenciador único)
```
Twitch detecta donación de $5
  → Platform emite evento "donation"
  → Trigger Engine activa "esperando confirmación gestual"
  → Streamer hace 👍
  → Trigger Engine combina: donation + thumbs-up = "thank-you-flow"
  → OBS cambia escena a "ThankYou"
```
Ningún otro producto del mercado combina eventos de plataforma con gestos del streamer.

---

## B. Análisis de Z.ai (coordinador)

### B.1. Errores y bugs encontrados

| # | Bug | Severidad | Archivo | Estado |
|---|-----|-----------|---------|--------|
| 1 | XSS en culturalNote de trigger-ui-builder | 🟠 Media | trigger-ui-builder.js:188 | ✅ Corregido |
| 2 | pendingEventConfirmations sin cap (crecimiento ilimitado) | 🔴 Alta | trigger-engine.js:194 | ✅ Corregido (cap=50) |
| 3 | config.set() sin debounce — escribe localStorage en cada input event | 🟠 Media | config-manager.js | ✅ Corregido (debounce 300ms) |
| 4 | Race condition en license activate/validate | 🟠 Alta | license-manager.js | ✅ Corregido (_operationLock) |

### B.2. Features implementadas en esta sesión (ya en código)

| # | Feature | Archivos modificados | Prioridad original |
|---|---------|---------------------|-------------------|
| 5 | Dead Zone / Hystéresis + returnToCenterMs | trigger-engine.js, config-manager.js, app.js, en-US.json | 🟠 Alta |
| 6 | Tier-based Feature Gating (Free/Pro/Pro+) | license-manager.js, app.js, en-US.json | 🟠 Alta |
| 7 | Trigger History / Activity Log | trigger-history.js (nuevo), index.html, app.js, en-US.json | 🟠 Alta |
| 8 | Multi-Action UI (modal ⚙️ por trigger) | trigger-ui-builder.js, index.html | 🟠 Alta |
| 9 | Sistema de Perfiles/Presets | config-manager.js, app.js, index.html, en-US.json | 🟡 Media |
| 10 | OBS Source Transform + Crop | adapter-obs.js, action-engine.js, en-US.json | 🟡 Media |

### B.3. Features PENDIENTES de implementar

| # | Feature | Esfuerzo | Impacto | Dependencias |
|---|---------|----------|---------|--------------|
| 11 | Calibration Wizard (onboarding guiado) | Medio | Alto | Dead Zone (#5) ✅ |
| 12 | Audio Feedback configurable por categoría | Bajo | Medio | — |
| 13 | Actualizar 12 locales con nuevas i18n keys | Medio | Alto | — |
| 14 | Gestos secuenciales / Multi-step triggers | Alto | Medio | Multi-Action (#8) ✅ |
| 15 | SOOP + CHZZK platforms (mercado coreano) | Medio | Medio | — |
| 16 | Web Worker para Human.js (offload del main thread) | Alto | Alto | — |
| 17 | Manual de usuario | Medio | Alto | — |
| 18 | Prompts para videos explicativos | Bajo | Medio | — |

### B.4. Preocupaciones arquitectónicas

1. **Sin bundler**: Todo es IIFE + window globals. Escala mal. Si se agregan más features, el orden de carga de scripts se vuelve frágil.
2. **Sin tests**: Cero tests unitarios o de integración. Un cambio en trigger-engine puede romper action-engine sin que nadie se entere.
3. **Sin TypeScript**: No hay tipado. Refactors grandes son riesgosos.
4. **localStorage como DB**: No hay límite de tamaño. Config con muchos perfiles puede exceder ~5MB.
5. **OAuth tokens en localStorage**: Los tokens de Twitch/YouTube/Kick están en localStorage sin encriptar. SessionStorage sería más seguro.
6. **CSP vs inline styles**: El CSP permite `'unsafe-inline'` para styles pero no para scripts. El lockout modal y el watermark usan inline styles.
7. **i18n sin pluralización**: El sistema `_interpolate` solo reemplaza `{variable}`. No maneja plurales ("1 trigger" vs "5 triggers").

### B.5. Distribución de trabajo propuesta (por Z.ai)

| LLM | Fortaleza | Tareas asignables |
|-----|-----------|-------------------|
| **Z.ai** | Coordinación, full-stack, integración | Calibration Wizard, Audio Feedback, integración final, ZIP |
| **Claude** | Code review profundo, arquitectura, razonamiento largo | Web Worker, Gestos secuenciales, review cruzado |
| **DeepSeek** | Generación de código, análisis algorítmico | SOOP/CHZZK platforms, i18n bulk (12 locales), tests |
| **ChatGPT 5.5** | UX/producto, contenido, market analysis | Manual de usuario, Prompts de video, Tier pricing, UX review |

---

## C. Sección Claude

> **Instrucciones para Claude**: Analiza el repo completo. Verifica si los bugs corregidos (#1-4) realmente lo están. Identifica bugs que los demás no vimos. Evalúa la arquitectura. Propón tu distribución de trabajo preferida.

### C.1. Verificación de bugs corregidos

<!-- Claude: ¿Están realmente corregidos los 4 bugs? ¿Queda algún edge case? -->

### C.2. Nuevos bugs/riesgos encontrados

<!-- Claude: ¿Qué encontramos que Z.ai no detectó? -->

### C.3. Análisis de arquitectura

<!-- Claude: Evalúa la arquitectura adapter/platform. ¿Es sostenible? ¿Qué mejorarías? -->

### C.4. Evaluación de seguridad

<!-- Claude: Análisis de seguridad más allá de XSS. OAuth flow, token storage, CSP, etc. -->

### C.5. Distribución de trabajo propuesta por Claude

<!-- Claude: ¿Estás de acuerdo con la distribución de Z.ai? ¿Cambiarías algo? -->

---

## D. Sección DeepSeek

> **Instrucciones para DeepSeek**: Enfócate en análisis de código profundo, edge cases algorítmicos, y viabilidad técnica de features pendientes. Verifica si el trigger-engine.js tiene bugs lógicos en la histéresis.

### D.1. Análisis del trigger-engine.js (histéresis + dead zone)

<!-- DeepSeek: ¿La implementación de dead zone es correcta? ¿Hay edge cases con los umbrales de histéresis? -->

### D.2. Análisis del action-engine.js (18 tipos de acción)

<!-- DeepSeek: ¿Todas las acciones manejan errores correctamente? ¿Hay race conditions en sequence/random_choice? -->

### D.3. Análisis del license-manager.js (tier gating)

<!-- DeepSeek: ¿El tier gating es bypasseable? ¿Puede un usuario Free modificar TIER_FEATURES en la consola? -->

### D.4. Viabilidad técnica: Web Worker para Human.js

<!-- DeepSeek: ¿Es viable con la arquitectura actual? ¿Qué cambios se necesitan? -->

### D.5. Viabilidad técnica: Gestos secuenciales

<!-- DeepSeek: ¿Cómo implementar sequence matching sobre el trigger-engine actual? Algoritmo propuesto. -->

### D.6. Distribución de trabajo propuesta por DeepSeek

<!-- DeepSeek: ¿Qué tareas puedes tomar? ¿Cuál es tu estimación de esfuerzo? -->

---

## E. Sección ChatGPT 5.5

> **Instrucciones para ChatGPT 5.5**: Enfócate en producto, UX, mercado y contenido. Analiza si el producto está listo para lanzamiento comercial. Evalúa el pricing. Genera el manual de usuario y prompts para videos.

### E.1. Evaluación de producto: ¿Listo para lanzamiento?

<!-- ChatGPT: ¿Qué falta para que esto sea comercialmente viable? ¿Qué tiene de más? -->

### E.2. Análisis de UX

<!-- ChatGPT: ¿La UI es intuitiva para un streamer no-técnico? ¿Qué flujos son confusos? -->

### E.3. Análisis de pricing

<!-- ChatGPT: Dado el mercado (Stream Deck $79-$249, competitors?), ¿qué precios X/Y recomiendas para Pro/Pro+? -->

### E.4. Competencia y posicionamiento

<!-- ChatGPT: ¿Quién más hace gesture control para streamers? ¿Cuál es el diferenciador real? -->

### E.5. Manual de usuario — Estructura propuesta

<!-- ChatGPT: Propón el índice del manual de usuario. ¿Qué secciones necesita? -->

### E.6. Prompts para videos explicativos

<!-- ChatGPT: Genera 3-5 prompts para crear videos: trailer, tutorial, feature highlight -->

### E.7. Distribución de trabajo propuesta por ChatGPT 5.5

<!-- ChatGPT: ¿Qué tareas puedes tomar tú? ¿Cuáles requieren contexto de código vs contexto de producto? -->

---

## F. Consolidación (se llena al final)

### F.1. Bugs confirmados por consenso

<!-- Se llena después de que todos respondan -->

### F.2. Features priorizadas por consenso

<!-- Se llena después de que todos respondan -->

### F.3. Distribución de trabajo final

<!-- Se llena después de que todos respondan -->

### F.4. Criterios de "producto 100% funcional y comercial"

<!-- Se llena después de que todos respondan -->

### F.5. Timeline estimado

<!-- Se llena después de que todos respondan -->

---

## G. Instrucciones de uso

### Para Joel (coordinador humano)
1. Comparte este documento con cada LLM con acceso completo al repo
2. Cada LLM completa SU sección (C, D o E)
3. Comparte las respuestas de vuelta con todos para cross-review
4. Yo (Z.ai) lleno la sección F de consolidación
5. De ahí sale el IMPLEMENTATION_PLAN.md

### Formato de respuesta requerido
Cada LLM debe responder en el mismo formato markdown, completando solo su sección. Si necesita agregar subsections, puede hacerlo dentro de su sección.
