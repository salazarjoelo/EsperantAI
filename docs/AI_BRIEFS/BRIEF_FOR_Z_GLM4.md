# Brief para Z/GLM-4 — EsperantAI Kickoff

> 你好 Z/GLM-4. 我是 Claude (Sonnet 4.7). Hola Z/GLM-4. Soy Claude (Sonnet 4.7) y te escribo desde el repo EsperantAI. Joel Salazar Ramírez te asignó a este equipo de 4 IAs. Este documento es para que entres en contexto rápido y entregues tu primera respuesta estructurada.

---

## MISIÓN-NORTE (directiva de Joel, 2026-05-14)

**EsperantAI DEBE SER LA HERRAMIENTA QUE FACILITE Y MEJORE LOS STREAMINGS Y DÉ NUDGES A LA MONETIZACIÓN DE LOS STREAMERS.**

Para ti (Z/GLM-4, área asia/CJK/adapters coreanos/cultural review), esto significa:

- **Facilita**: las traducciones zh/ko/ja no son sólo strings — la UI debe sentirse nativa en Bilibili, CHZZK, Niconico. Si un streamer chino abre EsperantAI y se siente "app occidental traducida con Google", lo cierra.
- **Mejora**: los gestos que en occidente son neutros pueden ser ofensivos o "raros" en Asia. Tu review cultural mejora la calidad del producto en mercados que valen 500M+ usuarios. Si EsperantAI ofende sin querer, el daño reputacional es real.
- **Nudges a monetización**: tu cultural insight aquí es **crítico**:
  - En China, monetización via Bilibili Charge / Douyin gifts / Xiaoxiongxinxin tipping difiere mucho de Twitch
  - En Korea, los streamers SOOP/CHZZK monetizan via star balloons + ad shares + sponsor calls
  - En Japón, Niconico Premium + Super Chat operan distinto
  - ¿Qué patterns de "nudge a monetización" son **culturalmente aceptables** en cada mercado? Un overlay agresivo de tip jar al estilo occidental puede ser percibido como "vulgar" en Japón.
  - ¿LemonSqueezy MoR cubre estas plataformas o el streamer asiático necesita método de pago local (Alipay/WeChat Pay/KakaoPay)?

Todo lo que entregues debe pasar el filtro de la sección 0 de `COORDINATION.md` (las 3 preguntas auto-aplicables).

---

## Contexto del proyecto en 1 párrafo

EsperantAI es una app web (no Tauri, no Electron — sólo navegador) que traduce gestos faciales y de mano del streamer en comandos para su software (OBS, Streamlabs, vMix, PRISM, XSplit) y reacciona a eventos de su plataforma. Slogan: **"Los gestos honestos"**. La narrativa parte de Ekman 1972 — expresiones faciales universales — pero los **gestos de mano sí varían culturalmente**. Aquí entras tú. Producto comercial para venta global. Repo privado: `salazarjoelo/EsperantAI`. Mercados objetivo asiáticos son críticos: Twitch cerró Korea en feb 2024, todo el mercado pasó a SOOP + CHZZK; China nunca tuvo Twitch (Bilibili, Douyin Live, Huya).

## Por qué te tocó este rol

Tu fortaleza documentada (verificable) en este equipo es:
- **Idiomas asiáticos nativos**: chino simplificado/tradicional, coreano, japonés
- **Razonamiento multi-paso** sobre contexto cultural
- **Adaptación cultural** vs traducción literal
- **APIs de mercado asiático** (Bilibili, Douyin, SOOP, CHZZK, Niconico) con docs originales en chino/coreano/japonés

Por eso eres primaria en: TASK-106 (SOOP + CHZZK adapters), TASK-107 (traducciones zh-CN, ko-KR, ja-JP), review cultural de gestos en `core/trigger-engine.js`, adaptaciones culturales para mercados asiáticos.

Y eres revisora cultural en cualquier cambio que toque texto visible para usuarios de China/Japón/Korea/Taiwan/Singapur.

---

## Archivos que NECESITAS leer antes de responder

Mínimo absoluto:
1. `COORDINATION.md` — protocolo del equipo
2. `docs/TASKS.md` — backlog
3. `docs/PRODUCT_SPEC.md` — visión + datos verificables de mercado
4. `core/trigger-engine.js` — los 18 gestos detectables y su clasificación cultural
5. `core/trigger-ui-builder.js` — badges "Universal" / "Cultural" en UI
6. `locales/zh-CN.json` — estado actual (stub o completo?)
7. `locales/ko-KR.json` — estado actual
8. `locales/ja-JP.json` — estado actual
9. `locales/en-US.json` — referencia base (completo)
10. `locales/es-ES.json` — referencia base (completo)
11. `core/i18n.js` — sistema de i18n con cadena de fallback

Si tienes acceso al repo clonado, mejor. Si no, Joel te pega los archivos por chat según los pidas.

---

## Preguntas concretas para tu respuesta

Responde en formato `RESPONSE_TEMPLATE.md`. Estas son las preguntas que se mapean a las 8 secciones del template:

### Sección 2 (Auditoría) — Preguntas a contestar

1. **Estado real de `locales/zh-CN.json`, `ko-KR.json`, `ja-JP.json`**: ¿son stubs (sólo claves duplicadas del inglés) o tienen contenido? Lista lo que falta por idioma.
2. **Cultural review de los 18 gestos** en `core/trigger-engine.js`:
   - 👍 thumbs-up: en Irán/Iraq/algunas partes de Grecia es ofensivo. En Korea/China/Japan: ¿neutral? ¿levemente desconectado?
   - 👌 OK sign: ofensivo en Brasil + sospechoso en algunos contextos occidentales. ¿En Asia?
   - ✌️ V-sign: peace en USA/JP, pero ofensivo en UK/AU/NZ si palma adentro. ¿China/Korea?
   - 🤘 rock-horns: positivo en heavy metal, pero "cornudo" en Italia/España/parts de LatAm
   - ✊ fist: contexto político variable
   - 🖐️ palm: STOP universal? ¿En cultura sorda?
   - ☝️ index up: "uno" o "atención"? ¿Religioso en Islam?
   - 👆 index pointing: ofensivo apuntar a personas en muchas culturas asiáticas
   
   Lista por gesto: badge `universal` (mantener) vs `cultural` (advertir al streamer asiático).
3. **Strings traducidos**: ¿hay textos del `index.html` o `landing.html` que sean intraducibles literalmente al chino sin perder sentido? Ejemplos.
4. **Tamaño de fonts y layout**: el chino y el japonés son verticalmente más densos. ¿La UI actual rompe con caracteres CJK?

### Sección 3 (Plan 4 semanas) — Tareas que esperamos te apropies

De `docs/TASKS.md`:
- TASK-106 — SOOP + CHZZK adapters (P1, 5-7 días) — mercado coreano post-Twitch
- TASK-107 — Traducciones zh-CN, ko-KR, ja-JP (P1, 1-2 días por idioma)
- Cultural review de los 18 gestos + badges actualizados en `trigger-ui-builder.js`

¿Cuáles entregas en cada semana?

Adicional: Joel mencionó posibles adapters para Bilibili Live, Douyin Live, Niconico, AfreecaTV. ¿Cuáles son viables en navegador (sin backend) y cuáles requieren backend? Honesto.

### Sección 4 (Coordinación) — Preguntas específicas

1. ¿Cómo prefieres recibir review de tus PRs de traducción? (revisor nativo humano si existe; si no, ¿review estructural por Claude?)
2. ¿Qué necesitas de ChatGPT? (probablemente nada técnico; quizás coordinación de tono entre tus traducciones asiáticas y sus traducciones europeas)
3. ¿Qué necesitas de DeepSeek? (probablemente cero — tu trabajo es i18n y APIs específicas)
4. ¿Qué necesitas de Claude? (revisar que tus PRs no rompan el sistema de fallback de `core/i18n.js`)

### Sección 5 (Dependencias) — Aplican estas

- Joel debe decidir: ¿precio en USD via LemonSqueezy global, o precio en CNY/KRW/JPY con métodos de pago locales (Alipay, WeChat Pay, KakaoPay)?
- Joel debe decidir: ¿priorizar SOOP+CHZZK ahora o esperar feedback del mercado europeo primero?
- Acceso a docs oficiales de SOOP y CHZZK en coreano original (Joel debe ayudarte si Google Translate no es suficiente)

### Sección 6 (Métricas) — Sugeridas

- Strings traducidos por idioma: % completo
- Strings con adaptación cultural (no literal): % marcados
- Tiempo de carga del locale CJK vs Latin: ms
- Gestos marcados como "cultural" con advertencia visible en UI: cuántos

---

## Pregunta extra: pricing por mercado

Esta es una pregunta que Joel no me ha pedido contestar pero que tu fortaleza cultural te permite responder mejor que cualquiera de las otras IAs:

**Si Joel vende EsperantAI a un streamer en China, Korea o Japón, ¿qué precio percibido tiene impacto?**

Datos verificables que necesitas:
- Stream Deck XL: $249 USD ≈ 1,800 CNY ≈ 350,000 KRW ≈ 38,000 JPY (precios oficiales locales si conoces)
- LemonSqueezy soporta MoR global (IVA chino, korean tax incluido)
- Métodos de pago alternativos preferidos por streamers asiáticos

No inventes números. Si no tienes dato verificable, decir "no tengo dato".

---

## Honestidad esperada

Mi entrenamiento (Claude) tiene chino/coreano/japonés, pero NO tengo el contexto cultural contemporáneo de streamers 2026. Tú probablemente sí — tu pre-entrenamiento incluye más data de Zhihu, Weibo, NamuWiki, Naver Cafe, Niconico.

Te pido a ti, Z/GLM-4:
- Si una traducción literal es ofensiva o rara, **proponer la adaptación + explicar por qué**.
- Si un gesto que Claude marcó "universal" tiene caveat cultural en Asia, **decirlo directo**.
- Si no conoces un dato (ej. precio Stream Deck oficial en CNY), **no inventar**.
- Si una API koreana/china tiene rate limit o ToS que prohíbe uso comercial sin permiso, **señalarlo antes de implementar**.

---

## Cómo entregar tu respuesta

1. Llenas el template en `RESPONSE_TEMPLATE.md`
2. Guardas como `docs/AI_BRIEFS/responses/RESPONSE_FROM_Z_GLM4.md`
3. Joel te lo carga al repo (privado) o tú firmas commit si tienes acceso local
4. Claude consolida en `COORDINATION_V2.md`
5. Joel aprueba → empiezas a tomar tareas

Plazo sugerido: **48-72 horas** desde que Joel te pasa este brief.

---

## Mensaje directo de Claude

Z/GLM-4, en este equipo eres la única que entiende mercados que valen colectivamente más de 500M de usuarios en Asia. Si tu trabajo brilla, EsperantAI tiene chance real en China/Korea/Japan. Si no, el producto se vende sólo en occidente y deja millones sobre la mesa.

Te pido franqueza cuando algo sea cultural o políticamente sensible. Joel es mexicano, no tiene contexto profundo de cómo se mueve un streamer de Bilibili. Tú sí.

Por último: no me molesta para nada que reescribas mis aproximaciones culturales de los 18 gestos. Yo las inferí de Ekman (1972) y matices que recuerdo de mi entrenamiento. Tú tienes mejor data.

— Claude

---

Co-authored-by: Claude <noreply@anthropic.com>
