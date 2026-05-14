# Brief para ChatGPT — EsperantAI Kickoff

> Hola ChatGPT. Soy Claude (Sonnet 4.7) y te escribo desde el repo EsperantAI. Joel Salazar Ramírez te asignó a este equipo de 4 IAs. Este documento es para que entres en contexto rápido y entregues tu primera respuesta estructurada.

---

## MISIÓN-NORTE (directiva de Joel, 2026-05-14)

**EsperantAI DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS.**

Para ti (ChatGPT, área UX/copy/manual/video), esto significa:

- **Facilita**: la UI debe reducir clicks, no agregarlos. El paywall actual y el onboarding deben sentirse como "ya quiero usar esto", no "qué complicado". Microcopy en idioma humano, no técnico.
- **Mejora**: el copy de landing, manual y videos debe vender el "antes/después" tangible — antes el streamer perdía momentos persiguiendo atajos; ahora un gesto basta.
- **Nudges a monetización**: cada panel relevante debe sugerir (sin imponer) acciones que generan ingresos al streamer:
  - Cuando configure trigger de evento "sub/donate/bits/superchat", proponer auto-switch a "thanks scene" + alerta visual + sonido configurable
  - Cuando configure "shock face" o "wow", proponer un overlay discreto de tip jar
  - Cuando configure gestos de fin/inicio de partida, sugerir "BRB scene" con plug a goal de subs o merch
  - En el manual: una sección dedicada a "Nudges de monetización ético: cómo invitar sin presionar"
  - Sin spam. Sin paywalls al viewer. Sin romper la confianza del streamer con su comunidad.

Todo lo que entregues debe pasar el filtro de la sección 0 de `COORDINATION.md` (las 3 preguntas auto-aplicables).

---

## Contexto del proyecto en 1 párrafo

EsperantAI es una app web (no Tauri, no Electron — sólo navegador) que traduce gestos faciales y de mano de un streamer en comandos para su software de streaming (OBS, Streamlabs, vMix, PRISM, XSplit) y reacciona a eventos de su plataforma (Twitch, YouTube Live, Kick, Trovo, StreamElements). Slogan: **"Los gestos honestos"**. La narrativa es: Esperanto fracasó como idioma universal, pero los gestos sí lo lograron (Ekman 1972 — expresiones faciales universales). Producto comercial para venta, no gratis, no trial. Joel vende y construye AI. Ya hay arquitectura modular trabajando, repo privado en `salazarjoelo/EsperantAI`.

## Por qué te tocó este rol

Tu fortaleza documentada (verificable) en este equipo es:
- **UX/UI design** y flujos de usuario claros
- **Copy comercial pulido** que no suena a robot
- **Brainstorming visual** y prompts para generadores de imagen/video
- **Contenido educativo** (manuales, tutoriales, scripts)

Por eso eres primaria en: UI Multi-Action Builder, Calibration Wizard, Landing copy refinement, Manual de usuario completo, Prompts para videos, Traducciones europeas/LatAm (pt-BR, fr-FR, de-DE, it-IT, ru-RU, ar-SA).

Y eres revisora en: cualquier cambio que toque UX hecho por otra IA.

---

## Archivos que NECESITAS leer antes de responder

Mínimo absoluto:
1. `COORDINATION.md` (raíz) — protocolo del equipo
2. `docs/TASKS.md` — backlog priorizado con tus tareas asignadas
3. `docs/REVIEW_PROTOCOL.md` — cómo nos revisamos
4. `docs/PRODUCT_SPEC.md` — visión del producto + datos de mercado verificables
5. `docs/USER_MANUAL.md` — esqueleto que escribí (necesita tu reescritura)
6. `docs/VIDEO_SCRIPTS.md` — tengo sólo Video #1 como referencia de estilo; tú haces #2-#13 y los Shorts
7. `index.html` y `landing.html` — la UI actual + el paywall
8. `app.js` — el bootstrap que maneja UI
9. `core/trigger-ui-builder.js` — donde se renderizan los 18 triggers

Si tienes acceso al repo clonado, mejor. Si no, Joel te pega los archivos por chat según los pidas.

---

## Preguntas concretas para tu respuesta

Responde en formato `RESPONSE_TEMPLATE.md`. Estas son las preguntas que se mapean a las 8 secciones del template:

### Sección 2 (Auditoría) — Preguntas a contestar

1. **Landing actual (`landing.html`)**: ¿convierte? Lista 5 cambios accionables al copy o a la estructura visual.
2. **Paywall actual (modal en `index.html` cuando no hay licencia válida)**: ¿es agresivo? ¿demasiado suave? Propuesta.
3. **Primer minuto del usuario**: cuando un streamer abre `index.html` la primera vez y permite la cámara, ¿qué ve? Boceta el flow paso-a-paso ideal. Compara con lo que hay hoy.
4. **`USER_MANUAL.md`**: lo escribí yo (Claude). Si una persona no técnica lo lee, ¿qué partes confunden? Lista 3-5 cosas a reescribir.
5. **Microcopy de errores**: en `app.js` y `core/*.js` hay strings de error tipo "Failed to connect to OBS WebSocket". ¿Cómo los reescribirías para un streamer no técnico?

### Sección 3 (Plan 4 semanas) — Tareas que esperamos te apropies

De `docs/TASKS.md`:
- TASK-101 — UI Multi-Action Builder (P1, 3-4 días)
- TASK-102 — Calibration Wizard (P1, 2-3 días)
- TASK-103 — Sistema de Perfiles (UX side; Claude hace data side)
- TASK-107 — Traducciones europeas y árabe (pt-BR, fr-FR, de-DE, it-IT, ru-RU, ar-SA, pl-PL)
- TASK-201 — Trigger History panel UI mejorada
- TASK-204 — Audio Feedback configurable
- VIDEO_SCRIPTS #2-#13 + Shorts (TASK-301bis nuevo)

¿Cuáles te apropias en cada semana?

### Sección 4 (Coordinación) — Preguntas específicas

1. ¿Cómo prefieres recibir reviews de tus PRs de UI de otras IAs?
2. ¿Qué necesitas de Claude para que tu trabajo no rompa la arquitectura modular?
3. ¿Qué necesitas de DeepSeek (CSP, security) para que tus cambios de UI cumplan?
4. ¿Qué necesitas de Z/GLM-4 para que tu UI considere lectores de idiomas asiáticos (chino, japonés, coreano)?

### Sección 5 (Dependencias) — Aplican estas seguras

- Joel debe decidir precio final de tiers (afecta tu copy de landing)
- Joel debe entregar RFC/domicilio fiscal (afecta legales que tú revisarás en copy)

### Sección 6 (Métricas) — Sugeridas

- Tiempo del usuario para configurar primer trigger: ?
- Tasa de conversión del landing: ? (esto requiere analytics que aún no hay)
- Strings de UI con error de localización (en review por nativo): ?

---

## Honestidad esperada

Joel ha reportado que Claude ha cometido errores graves (invent free tier cuando él dijo "quiero vender", invent trial cuando dijo "el que paga es mi cliente", botones modales `alert()` que rompen el preview, etc.). Mi confianza está siendo reconstruida.

Te pido a ti, ChatGPT:
- Cuando tengas duda sobre intención de Joel, **pregunta**, no infieras.
- Si propones algo que cueste dinero (Stripe, analytics pagado, plugins de Figma), **decirlo explícito** + escalar.
- Si tu sugerencia entra en conflicto con algo que ya escribió Claude, **citar archivo:línea** y explicar.

---

## Cómo entregar tu respuesta

1. Llenas el template en `RESPONSE_TEMPLATE.md`
2. Guardas como `docs/AI_BRIEFS/responses/RESPONSE_FROM_CHATGPT.md`
3. Joel te lo carga al repo (privado) o tú firmas commit si tienes acceso local
4. Claude consolida en `COORDINATION_V2.md`
5. Joel aprueba → empiezas a tomar tareas

Plazo sugerido: **48-72 horas** desde que Joel te pasa este brief.

---

## Mensaje directo de Claude

ChatGPT, sé que tu fortaleza es UX y copy. No me pongas a competir contigo en eso — yo no soy bueno para eso. Pero confía en mí cuando te diga "este patrón de UI rompe la arquitectura modular" — yo conozco el código línea por línea.

Si vemos puntos de conflicto: usemos el protocolo de 3 rounds de `REVIEW_PROTOCOL.md` sección 5. Si seguimos sin acuerdo, Joel decide.

Espero tu respuesta.

— Claude

---

Co-authored-by: Claude <noreply@anthropic.com>
