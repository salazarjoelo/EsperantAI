# Mensaje de arranque para Z/GLM-4

> Joel: copia TODO el bloque siguiente (entre las líneas de `---`) y pégalo en chat.z.ai. Después adjunta los 5 archivos listados al final.

---

你好 Z/GLM-4. 안녕하세요. こんにちは. Hola.

Voy a trabajar contigo, Claude (Anthropic), ChatGPT (OpenAI) y DeepSeek en un producto que estoy lanzando: **EsperantAI** — una app web (browser-only) que traduce gestos faciales y de mano del streamer en comandos de OBS / Streamlabs / vMix / PRISM / XSplit, reaccionando a eventos de plataformas de streaming. Mercados asiáticos son críticos: Twitch cerró Korea en feb 2024 (todo pasó a SOOP + CHZZK); China nunca tuvo Twitch (Bilibili, Douyin Live, Huya).

**MISIÓN-NORTE (no negociable)**: EsperantAI **DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS**. Toda decisión tuya pasa por ese filtro — **incluyendo nudges culturalmente apropiados para Asia** (no es lo mismo el patrón de tipping en Twitch que las "star balloons" de SOOP o las "gifts" de Bilibili).

**Tu rol** en este equipo (las 4 IAs trabajamos en GitHub privado salazarjoelo/EsperantAI):
- Primaria en: adapters SOOP + CHZZK (TASK-106), traducciones zh-CN/ko-KR/ja-JP (TASK-107), cultural review de los 18 gestos del producto, adaptaciones culturales para mercado asiático.
- Revisora cultural en: cualquier cambio que toque texto visible para usuarios de China/Japón/Korea/Taiwan/Singapur.

**Lo que necesito de ti AHORA** (en este primer turno):
1. Lee los archivos que te adjunto (orden sugerido: `BRIEF_FOR_Z_GLM4.md` → `COORDINATION.md` → `TASKS.md` → `PRODUCT_SPEC.md` → `RESPONSE_TEMPLATE.md`).
2. Si necesitas ver los locales actuales (`locales/zh-CN.json`, `ko-KR.json`, `ja-JP.json`) o el código de gestos (`core/trigger-engine.js`, `core/trigger-ui-builder.js`), pídemelo y te lo paso.
3. Responde llenando `RESPONSE_TEMPLATE.md` completo. Las 8 secciones obligatorias.
4. En tu respuesta, propón cómo coordinarte con las otras 3 IAs.
5. Review cultural de los 18 gestos: ¿cuáles son `universal` y cuáles `cultural` (con caveat para Asia)? Lista por gesto.
6. Filtra cada propuesta tuya con las 3 preguntas de la misión-norte (sección 0 de `COORDINATION.md`).

**Plazo**: 48-72 horas.

**Pregunta extra crítica que sólo tú puedes responder bien**:
¿Qué patterns de "nudges a monetización" son **culturalmente aceptables** en China / Korea / Japón? Un overlay agresivo de tip jar al estilo occidental puede ser percibido como vulgar en Japón. Y los métodos de pago locales (Alipay, WeChat Pay, KakaoPay) son críticos — ¿LemonSqueezy MoR los cubre o necesito gateway local?

**Honestidad esperada**:
- Si una traducción literal es ofensiva o rara, propón adaptación + explica por qué.
- Si un gesto que marqué como "universal" tiene caveat cultural en Asia, dilo directo.
- Si no conoces un dato (ej. precio Stream Deck oficial en CNY), **no inventes**.
- Si una API koreana/china tiene rate limit o ToS que prohíbe uso comercial sin permiso, señálalo antes de implementar.

Guarda tu respuesta como `RESPONSE_FROM_Z_GLM4.md` — yo la subiré al repo y Claude la consolidará junto con las de ChatGPT y DeepSeek en un plan unificado de 4 semanas.

Bienvenido al equipo.

— Joel Salazar Ramírez (joel@edugame.digital)

---

## Archivos a adjuntar al chat (Joel sube estos)

Desde `D:\joel-salazar\OBS\EsperantAI\`:

1. `docs/AI_BRIEFS/BRIEF_FOR_Z_GLM4.md` (su brief específico)
2. `COORDINATION.md` (protocolo del equipo + misión-norte)
3. `docs/TASKS.md` (backlog priorizado)
4. `docs/PRODUCT_SPEC.md` (spec del producto + mercados objetivo con datos verificables)
5. `docs/AI_BRIEFS/RESPONSE_TEMPLATE.md` (formato de respuesta)

Opcionales si la chat los pide después:
- `locales/zh-CN.json`, `locales/ko-KR.json`, `locales/ja-JP.json`
- `locales/en-US.json`, `locales/es-ES.json` (como referencia base)
- `core/trigger-engine.js` (los 18 gestos)
- `core/trigger-ui-builder.js` (badges universal/cultural)
- `core/i18n.js` (sistema de fallback)
