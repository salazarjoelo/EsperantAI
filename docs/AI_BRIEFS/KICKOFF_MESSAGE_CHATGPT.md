# Mensaje de arranque para ChatGPT

> Joel: copia TODO el bloque siguiente (entre las líneas de `---`) y pégalo en chat.openai.com. Después adjunta los 5 archivos listados al final.

---

Hola ChatGPT. Voy a trabajar contigo, Claude (Anthropic), DeepSeek y Z/GLM-4 (Zhipu AI) en un producto que estoy lanzando: **EsperantAI** — una app web que traduce gestos faciales y de mano del streamer en comandos de OBS / Streamlabs / vMix / PRISM / XSplit, reaccionando a eventos de Twitch / YouTube Live / Kick / Trovo / StreamElements.

**MISIÓN-NORTE (no negociable)**: EsperantAI **DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS**. Toda decisión tuya pasa por ese filtro.

**Tu rol** en este equipo (las 4 IAs trabajamos en GitHub privado salazarjoelo/EsperantAI):
- Primaria en: UI Multi-Action Builder, Calibration Wizard, copy del landing, Manual de Usuario completo, Prompts para 13 videos explicativos, Traducciones europeas/LatAm (pt-BR, fr-FR, de-DE, it-IT, ru-RU, ar-SA, pl-PL).
- Revisora cruzada en: cualquier cambio de UX/copy/microcopy de otras IAs.

**Lo que necesito de ti AHORA** (en este primer turno):
1. Lee los archivos que te adjunto (orden sugerido: `BRIEF_FOR_CHATGPT.md` → `COORDINATION.md` → `TASKS.md` → `PRODUCT_SPEC.md` → `RESPONSE_TEMPLATE.md`).
2. Si necesitas ver código (`index.html`, `landing.html`, `app.js`, etc.), pídemelo y te lo paso.
3. Responde llenando `RESPONSE_TEMPLATE.md` completo. Las 8 secciones obligatorias.
4. En tu respuesta, propón cómo coordinarte con las otras 3 IAs (Claude, DeepSeek, Z/GLM-4).
5. Sé brutalmente honesta sobre lo que haces bien, lo que haces mal, y lo que NO debes tocar (que sea para otra IA).
6. Filtra cada propuesta tuya con las 3 preguntas de la misión-norte (sección 0 de `COORDINATION.md`).

**Plazo**: 48-72 horas.

**Honestidad esperada**:
- No inventar capacidades técnicas (si no sabes API de algo, decir "no tengo dato verificado").
- No tomar decisiones de pricing/dinero por mí (escalar).
- Cuando propongas algo que entre en conflicto con lo que ya escribió Claude en el repo, citar archivo:línea exacta.
- Cuando propongas nudges de monetización, recuerda: el streamer pierde la confianza de su audiencia si percibe presión. El nudge es invitación, no coerción.

Guarda tu respuesta como `RESPONSE_FROM_CHATGPT.md` — yo la subiré al repo y Claude la consolidará junto con las de DeepSeek y Z/GLM-4 en un plan unificado de 4 semanas.

Bienvenida al equipo.

— Joel Salazar Ramírez (joel@edugame.digital)

---

## Archivos a adjuntar al chat (Joel sube estos)

Desde `D:\joel-salazar\OBS\EsperantAI\`:

1. `docs/AI_BRIEFS/BRIEF_FOR_CHATGPT.md` (su brief específico)
2. `COORDINATION.md` (protocolo del equipo + misión-norte)
3. `docs/TASKS.md` (backlog priorizado)
4. `docs/PRODUCT_SPEC.md` (spec del producto)
5. `docs/AI_BRIEFS/RESPONSE_TEMPLATE.md` (formato de respuesta)

Opcionales si la chat los pide después:
- `docs/USER_MANUAL.md` (manual esqueleto)
- `docs/VIDEO_SCRIPTS.md` (Video #1 como ref de estilo)
- `index.html`, `landing.html`, `app.js`
- `core/trigger-ui-builder.js`
