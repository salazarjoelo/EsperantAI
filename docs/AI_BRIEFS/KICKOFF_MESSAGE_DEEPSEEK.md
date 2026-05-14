# Mensaje de arranque para DeepSeek

> Joel: copia TODO el bloque siguiente (entre las líneas de `---`) y pégalo en chat.deepseek.com. Después adjunta los 5 archivos listados al final.

---

Hola DeepSeek. Voy a trabajar contigo, Claude (Anthropic), ChatGPT (OpenAI) y Z/GLM-4 (Zhipu AI) en un producto que estoy lanzando: **EsperantAI** — una app web (browser-only, sin Tauri ni Electron) que traduce gestos faciales y de mano del streamer en comandos de OBS / Streamlabs / vMix / PRISM / XSplit, reaccionando a eventos de Twitch / YouTube Live / Kick / Trovo / StreamElements.

**MISIÓN-NORTE (no negociable)**: EsperantAI **DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS**. Toda decisión tuya pasa por ese filtro.

**Tu rol** en este equipo (las 4 IAs trabajamos en GitHub privado salazarjoelo/EsperantAI):
- Primaria en: Web Worker para Human.js (TASK-104), CSP hardening sin unsafe-inline (TASK-105), Backend de licencias firmadas si decido construirlo (TASK-001), anti-tampering del cliente, tests automatizados + CI (TASK-301).
- Revisora cruzada en: cualquier cambio que toque seguridad, performance, criptografía o Web Workers.

**Lo que necesito de ti AHORA** (en este primer turno):
1. Lee los archivos que te adjunto (orden sugerido: `BRIEF_FOR_DEEPSEEK.md` → `COORDINATION.md` → `TASKS.md` → `PRODUCT_SPEC.md` → `RESPONSE_TEMPLATE.md`).
2. Si necesitas ver código (`core/*.js`, `platforms/*.js`, `index.html`, etc.), pídemelo y te lo paso.
3. Responde llenando `RESPONSE_TEMPLATE.md` completo. Las 8 secciones obligatorias.
4. En tu respuesta, propón cómo coordinarte con las otras 3 IAs.
5. Audita lo hecho — la auditoría externa cubrió 9 hallazgos (C-01 a C-05 + H-01 a H-04). Lista los siguientes 10 que esa auditoría no cubrió, con archivo:línea exacta.
6. Filtra cada propuesta tuya con las 3 preguntas de la misión-norte (sección 0 de `COORDINATION.md`). Recuerda: si tu Web Worker o tu CSP rompen el evento sub/donate justo cuando cae el pago, falló la misión.

**Plazo**: 48-72 horas.

**Honestidad esperada**:
- Si encuentras vulnerabilidad explotable, **NO la publiques en commit message ni en docs**. Repórtala en privado primero, fix después, documenta al final.
- Si una tarea está fuera de tu zona (UX, copy, traducciones), **declina** y pásasela a la IA correcta.
- Cuando algo no se puede proteger sin backend (license bypass C-05), dilo claro. No inventes mitigaciones imposibles.
- No te quedes esperando "el código perfecto". Define threshold: bloqueas con vulns críticas, documentas las medianas.

Guarda tu respuesta como `RESPONSE_FROM_DEEPSEEK.md` — yo la subiré al repo y Claude la consolidará junto con las de ChatGPT y Z/GLM-4 en un plan unificado de 4 semanas.

Bienvenido al equipo.

— Joel Salazar Ramírez (joel@edugame.digital)

---

## Archivos a adjuntar al chat (Joel sube estos)

Desde `D:\joel-salazar\OBS\EsperantAI\`:

1. `docs/AI_BRIEFS/BRIEF_FOR_DEEPSEEK.md` (su brief específico)
2. `COORDINATION.md` (protocolo del equipo + misión-norte)
3. `docs/TASKS.md` (backlog priorizado)
4. `docs/PRODUCT_SPEC.md` (spec del producto)
5. `docs/AI_BRIEFS/RESPONSE_TEMPLATE.md` (formato de respuesta)

Opcionales si la chat los pide después:
- `docs/ARCHITECTURE.md`
- `core/license-manager.js`, `core/config-manager.js`, `core/detector.js`, `core/trigger-engine.js`, `core/action-engine.js`
- `app.js`, `index.html`, `oauth-callback.html`
- `platforms/*.js`
- `.github/workflows/deploy.yml`
- `Instalar_EsperantAI.bat`
