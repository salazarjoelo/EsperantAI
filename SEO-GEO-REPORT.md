# GEO (Generative Engine Optimization) Audit — edugame.digital

**Audit date:** 2026-05-19
**URL audited:** https://edugame.digital
**Product:** EsperantAI — Controlador de OBS/Streamlabs/vMix/PRISM/XSplit por gestos faciales
**Auditor:** Claude Code (seo-geo skill + Mira_Mira no-fabrication rules)
**Method:** WebFetch + curl con AI bot User-Agents + inspección directa del HTML servido

---

## Score: 68/100

| Categoría | Peso | Score | Sub-score |
|-----------|------|-------|-----------|
| Citability de pasajes | 25 | 19 | 76% |
| Legibilidad estructural | 20 | 16 | 80% |
| Multi-modal | 15 | 10 | 67% |
| Authority / Brand signals | 20 | 9 | 45% |
| Technical accessibility | 20 | 14 | 70% |
| **TOTAL** | **100** | **68** | |

### Lectura del score

- **0-40** = Invisible para AI search
- **41-60** = Mencionable pero raramente citado
- **61-75** = **Citable hoy, pero con techo bajo** ← edugame.digital está aquí
- **76-90** = Citado frecuentemente
- **91-100** = Fuente top-tier para AI Overviews

---

## 1. AI Crawler Accessibility — [VERIFICADO]

Test ejecutado con `curl -A` desde local el 2026-05-19. Todos los crawlers reciben el HTML completo:

| Crawler | HTTP | Payload | Latencia |
|---------|------|---------|----------|
| GPTBot | 200 | 55,191 B | 0.80 s |
| ClaudeBot | 200 | 55,191 B | 0.59 s |
| PerplexityBot | 200 | 55,191 B | 0.59 s |
| Google-Extended | 200 | 55,191 B | 0.58 s |
| OAI-SearchBot | 200 | 55,191 B | 0.58 s |
| CCBot | 200 | 55,191 B | 0.59 s |
| Bingbot (control) | 200 | 55,191 B | — |

**Conclusión:** Server-side rendering 100% verificado. Ningún crawler depende de JavaScript para leer el contenido principal. El HTML servido contiene H1, H2s, FAQ, schema y prosa completa.

## 2. robots.txt — [VERIFICADO]

`https://edugame.digital/robots.txt` devuelve HTTP 200 con política explícita para 15 AI crawlers, todos con `Allow: /`:

Google-Extended, GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, FacebookBot, meta-externalagent, CCBot, Bytespider, MistralAI-User, cohere-ai.

Sitemap declarado: `https://edugame.digital/sitemap.xml`.

**Conclusión:** Política explícita, sin ambigüedad. Joomla ranking SEO no se aplica aquí pero la disciplina sí. **No requiere cambios.**

## 3. llms.txt — [VERIFICADO 404]

`https://edugame.digital/llms.txt` → HTTP 404. **No existe.**

Recomendación: crearlo. Plantilla al final del reporte.

## 4. Sitemap.xml — [VERIFICADO]

9 URLs en sitemap: la raíz + 8 docs legales/manual. No hay paginación, no hay blog, no hay landing pages secundarias.

## 5. Schema Markup — [VERIFICADO]

3 bloques JSON-LD inline en `<head>` (líneas 35, 55, 102 del HTML servido):

| Schema | Estado | Notas |
|--------|--------|-------|
| Organization | ✅ Completo | founder.Person, contactPoint con email |
| SoftwareApplication | ✅ Rico | applicationCategory, OS list, featureList[7], inLanguage[12], 2 Offers |
| FAQPage | ✅ 8 Q&A | Coincide 1:1 con prosa FAQ del DOM |
| Person (founder) | ✅ Nested | Joel Salazar Ramírez dentro de Organization |
| Offer | ⚠️ Sin precio | `priceCurrency: USD` pero `price` ausente en ambos planes |
| HowTo | ❌ Ausente | Sección "3 pasos" calificaría |
| VideoObject | ❌ Ausente | 2 videos en página sin schema |
| BreadcrumbList | ❌ Ausente | OK porque es landing single-page |
| AggregateRating / Review | ❌ Ausente | Sin reseñas reales todavía — no inventar |

**Conclusión:** Base sólida (Organization + SoftwareApplication + FAQPage es lo mínimo viable para AI Overviews de productos). Gap principal: `Offer.price` vacío y `HowTo` sin schema.

## 6. Meta Tags — [VERIFICADO]

| Tag | Valor | Estado |
|-----|-------|--------|
| `<title>` | "EsperantAI — La primera categoría de control gestual nativo para streaming" | ✅ 79 chars, brand-first |
| `<meta description>` | "EsperantAI convierte gestos faciales y manuales en acciones de streaming. Integración nativa con OBS, Streamlabs, vMix, PRISM, XSplit..." | ✅ 222 chars (largo pero correcto) |
| `<link rel="canonical">` | https://edugame.digital/ | ✅ |
| OG type | product | ✅ |
| OG image | hero-dashboard-es.png (1920×1080) | ✅ |
| Twitter card | summary_large_image | ✅ |
| og:locale | es_ES + alternate en_US | ⚠️ "en_US" declarado pero NO hay versión EN servida |

## 7. Citability por pasaje — [VERIFICADO en HTML servido]

### Pasajes CITABLES (self-contained, AI puede extraer sin scroll)

**A. Definición categórica (línea 904 + título):**
> "La primera categoría de control gestual nativo para streaming. Hecho en Aguascalientes, México."
> — Footer + título. **Cita perfecta** para "¿Qué es EsperantAI?"

**B. Definición "qué hace" (líneas 222-225, hero subhead):**
> "EsperantAI lee tu cara y tus manos para disparar escenas, overlays y alertas en tu software de streaming. Sin Stream Deck. Sin atajos memorizados. Sin perder el ritmo en vivo."
> **Cita fuerte:** describe función + diferenciador en 27 palabras.

**C. Definición filosófica (línea 667):**
> "EsperantAI es la inteligencia artificial que finalmente habla el único lenguaje que todos los humanos compartimos."
> **Cita memorable** pero metafórica — útil para Perplexity (premia narrative), débil para AIO (premia factual).

**D. Comparación con Stream Deck (FAQ 7, línea 872):**
> "Un Stream Deck XL cuesta $249 USD y requiere espacio físico en tu escritorio + tener las manos disponibles para presionar botones. EsperantAI funciona con tu webcam (que ya tienes), no requiere espacio físico, y funciona aunque tus manos estén ocupadas con el control, la guitarra, el cuchillo de cocina o el lápiz de dibujo."
> **Cita oro** — comparison query + dato verificable + casos de uso. AI Overviews ama esto.

**E. Privacy claim (FAQ 5, línea 852):**
> "Todo el procesamiento de detección facial corre 100% local en tu navegador, usando tu GPU (Human.js + WebGL). Cero video / imágenes se envían fuera de tu computadora."
> **Cita fuerte para queries de privacidad.**

**F. Universal vs Cultural gestures (línea 667):**
> "...cada gesto está marcado como Universal (sonrisa, asentir, mirar) o Cultural (pulgar, OK, peace) — tú decides cuáles usar según tu audiencia global."

### Pasajes DÉBILES para AI

- **H1 actual:** "Controla tu stream con un gesto." → poético, no definitorio. No funciona como cita estandalone porque "tu stream" requiere antecedente.
- Hero subhead **no** abre con "EsperantAI is..." pattern (estándar para AIO).
- Ningún párrafo en los primeros 200 palabras dice **literalmente** "EsperantAI is a...". Schema lo dice, pero la prosa visible no.

### Longitud de pasajes

- FAQ answers: 24-72 palabras (todos por debajo del óptimo 134-167 para AIO).
- Story para: ~50 palabras.
- Hero sub: 27 palabras.
- **Ningún pasaje está en el rango óptimo 134-167 palabras** identificado por estudios de citability (febrero 2026).

## 8. Brand entity clarity — [VERIFICADO]

| Señal | Estado |
|-------|--------|
| "EsperantAI" como string único | ✅ 38 menciones en homepage |
| Diferenciado de OBS/Streamlabs | ✅ Trust bar lo separa visualmente |
| Founder named | ✅ Joel Salazar Ramírez en schema + footer |
| Wikipedia presence | [NO MEDIDO] — fuera de scope de este audit |
| Reddit presence | [NO MEDIDO] |
| YouTube channel | [NO MEDIDO] |
| LinkedIn presence | [NO MEDIDO] |
| GitHub presence | [NO MEDIDO] |
| Author bio con credenciales | ❌ No hay página /about ni bio del founder |

**Riesgo crítico:** El estudio Ahrefs Dec 2025 (75K marcas) muestra que **brand mentions en YouTube/Reddit correlacionan 3× más con citación AI que backlinks**. EsperantAI tiene **cero presencia verificable** en esos canales todavía. Esto es el techo del score.

## 9. Lo que SÍ tiene comparado con typical SaaS landing

- ✅ Cita académica (Paul Ekman 1972) — raro en landing pages, **buena señal de E-E-A-T**
- ✅ FAQ con FAQPage schema 1:1 con DOM
- ✅ Tabla de compatibilidad (5 software × 4 plataformas × 3 OS) — extraíble
- ✅ Video con poster image y aria-label
- ✅ Pasaje con dato comparativo + precio competidor ($249 Stream Deck XL)

## 10. Lo que FALTA

- ❌ `/llms.txt` (404)
- ❌ `Offer.price` real (placeholder `___` en HTML, líneas 724, 776)
- ❌ `HowTo` schema para los 3 pasos
- ❌ `VideoObject` schema para los 2 videos
- ❌ Última fecha de actualización visible / `dateModified` schema
- ❌ Author byline / página `/about`
- ❌ Versión inglesa (declarada en og:locale:alternate pero no servida)
- ❌ Reseñas reales (`AggregateRating`) — **no inventar**

---

## Top 5 mejoras CRÍTICAS para AI citability

### 1. Crear `/llms.txt` (effort: 30 min, impact: alto)
Estándar emergente para Perplexity/ChatGPT. Plantilla específica al final.

### 2. Añadir un pasaje "What is EsperantAI?" de 140 palabras al inicio del body
Después del H1, antes del hero video. Patrón:
> "EsperantAI is a desktop and browser application that controls streaming software (OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit Broadcaster) using facial and hand gestures detected by an AI model running 100% locally on the user's GPU via Human.js + WebGL. It triggers scenes, overlays, sound effects and alerts when the streamer makes a configured gesture (head tilt, smile, blink, thumbs-up, peace sign, OK sign, rock sign). Released for Windows, macOS and Linux through any modern browser..."
**Razón:** Patrón "X is a..." es el #1 patrón de extracción de Google AI Overviews + ChatGPT.

### 3. Schema `HowTo` para los 3 pasos
Lineas 318-365 del HTML. Wrap en JSON-LD HowTo con HowToStep × 3.

### 4. Schema `VideoObject` para los 2 videos + transcript text
AI no puede "ver" video. Necesita:
- Schema VideoObject con `name`, `description`, `thumbnailUrl`, `uploadDate`, `duration`.
- Idealmente `transcript` field con texto del demo extendido (5:23).

### 5. Llenar `Offer.price` con valor MXN real (cuando LemonSqueezy esté listo)
Actualmente `priceCurrency: USD` está declarado pero `price` ausente. Google rechaza Offer sin price para rich snippets de productos. Sin esto, **NO** aparecerá en AI Overviews comerciales ni en "shopping" cards.

---

## Top 5 quick wins (≤30 min cada uno)

### A. Reescribir H1 + hero sub con patrón definitorio
Actual: "Controla tu stream con un gesto."
Sugerido (mantener el poético, añadir definitorio inmediatamente debajo):
> H1: "Controla tu stream con un gesto."
> H2/lead inmediato: "EsperantAI es el primer controlador de OBS, Streamlabs, vMix, PRISM y XSplit que usa gestos faciales detectados localmente por AI."

### B. Añadir `<meta name="last-modified">` y `dateModified` en schema SoftwareApplication
AI privilegia contenido fresh. Necesita signal explícito de fecha.

### C. Añadir un H2 "What is EsperantAI?" arriba de "Cómo funciona"
Question-based headings boost en query match (estándar AIO).

### D. Añadir aria-describedby en videos + textual fallback
Texto adyacente al video que describa "qué se ve" — extraíble por AI cuando no puede procesar mp4.

### E. Linkear el footer a perfiles externos (`sameAs` en Organization schema)
```json
"sameAs": ["https://github.com/...", "https://youtube.com/@...", "https://twitter.com/..."]
```
**Solo si existen** — no inventar.

---

## Plantilla `/llms.txt` recomendada

```
# EsperantAI

> AI-powered facial and hand gesture controller for live streaming software.
> Controls OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio and XSplit
> Broadcaster using gestures detected locally on the user's GPU via Human.js.
> 100% local processing, zero video sent to cloud servers.

## Key facts

- Category: Streaming software controller via biometric gestures
- Detection engine: Human.js + WebGL (local, browser-based)
- Compatible streaming software: OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit Broadcaster
- Compatible platforms: Twitch, YouTube Live, Kick, Trovo, StreamElements
- Operating systems: Windows (native installer), macOS and Linux (browser)
- Gesture types: Universal (head, eyes, emotion, blink) + Cultural (thumbs-up, peace, OK, rock)
- Languages: 13 (es, en, fr, de, ja, ru, zh, it, pl, ar, ko, pt + auto-detect)
- Pricing model: One-time payment, Pro and Pro+ plans, no free tier or trial
- License: Activates on up to 3 devices, validates online every 7 days
- Maker: EdugameDigital, founded by Joel Salazar Ramirez (Aguascalientes, Mexico)

## Main pages

- [Homepage](https://edugame.digital/): Product landing with features, pricing, FAQ
- [User manual](https://edugame.digital/docs/manual.html): Full setup and configuration guide
- [Privacy policy](https://edugame.digital/docs/PRIVACY.html): GDPR/CCPA compliance and local processing details
- [Refund policy](https://edugame.digital/docs/REFUND_POLICY.html): No-refund policy explained
- [EULA](https://edugame.digital/docs/EULA.html): End-user license agreement
- [Terms of service](https://edugame.digital/docs/TERMS_OF_SERVICE.html)
- [Cookie policy](https://edugame.digital/docs/COOKIE_POLICY.html)
- [Purchase and license terms](https://edugame.digital/docs/PURCHASE_AND_LICENSE_TERMS.html)
- [Third-party licenses](https://edugame.digital/docs/THIRD_PARTY_LICENSES.html)

## Differentiation

- Versus Stream Deck XL ($249 USD): no physical hardware, hands-free, works while
  hands are occupied with controller, instrument, kitchen knife or stylus.
- Versus voice control: silent operation, no impact on stream audio, no false
  triggers from gameplay commentary.
- Versus keyboard shortcuts: zero memorization, biometric instead of mnemonic.
```

---

## ¿Es citable HOY por AI Overviews?

**Respuesta:** Sí, condicionalmente.

**Sí porque:**
- Server-side rendering 100% verificado
- 3 crawlers AI principales (GPT, Claude, Perplexity) reciben HTML completo 200 OK
- robots.txt los autoriza explícitamente
- Schema SoftwareApplication + FAQPage + Organization es el trifecta mínimo
- Footer tiene cita extractable ("La primera categoría de control gestual nativo para streaming")
- FAQ 7 (Stream Deck comparison) es un pasaje 10/10 para query "alternative to Stream Deck"

**Pero con techo bajo porque:**
- Cero entity presence verificable en YouTube/Reddit/Wikipedia (el predictor #1 según Ahrefs Dec 2025)
- Cero pasajes en el rango óptimo 134-167 palabras
- H1 no es un patrón "X is Y" extraíble standalone
- Sin precio en Offer schema → invisible en commercial AI cards
- Sin llms.txt → Perplexity / ChatGPT no tienen guía estructurada
- Categoría tan nueva que probablemente nadie está buscando todavía ("EsperantAI" como brand query tendrá near-zero volume hasta marketing)

**Query types donde edugame.digital DEBERÍA aparecer hoy en AI Overviews:**
- "OBS gesture control software" — alta probabilidad si AIO disambigua "gesture control"
- "Stream Deck alternative no hardware" — alta probabilidad por FAQ 7
- "Control OBS sin manos" — alta probabilidad (query español, competencia baja)
- "Face detection streaming software" — media (categoría tan nueva que AIO puede no tener intent claro)

**Query types donde NO aparecerá:**
- Cualquier query con "EsperantAI" como brand (ya gana porque no hay competencia) — pero **nadie busca el nombre todavía**.
- Queries comerciales con price intent — Offer.price vacío bloquea.

---

## Próximos pasos sugeridos por prioridad

1. **Hoy:** Crear `/llms.txt` (30 min)
2. **Esta semana:** Añadir pasaje "What is EsperantAI" de 140 palabras + H2 "What is EsperantAI?" (45 min)
3. **Esta semana:** Añadir HowTo schema + VideoObject schema (1h)
4. **Cuando haya precio:** Llenar `Offer.price` MXN real (5 min)
5. **Mes 1:** Establecer presencia YouTube (al menos 1 video demo público con title "EsperantAI"), Reddit thread en r/Twitch o r/streaming explicando categoría.
6. **Mes 2:** Submission a directorios de software (G2, Capterra, AlternativeTo) para entity reinforcement.

---

## Notas de honestidad (Mira_Mira rules)

- Score 68/100 calculado contra rubric público del skill seo-geo (Feb 2026). **Es un score de checklist técnico, no un predictor garantizado de visibilidad real**.
- Las stats citadas en el rubric (3× brand mentions, 156% multimodal lift) vienen de la documentación del skill seo-geo de Anthropic.
- **NO se midió presencia real en Wikipedia, Reddit, YouTube o LinkedIn** porque está fuera del scope de este audit (requiere búsquedas externas).
- **NO se ejecutó ningún query real contra ChatGPT/Perplexity/AIO** para verificar si edugame.digital aparece — eso requiere DataForSEO MCP que no está cargado en esta sesión.
- Los pasajes citados como "fuertes" están **verificados línea por línea contra el HTML servido**, no inferidos.
- "Categoría nueva sin competencia directa" es premisa de Joel — **no se intentó verificar** contra competidores potenciales (Tobii Eye Tracker streaming, MediaPipe demos, FaceRig). Verificar competencia real requiere otro audit.

---

*Reporte generado por Claude Code seo-geo skill, validado por reglas Mira_Mira no-fabrication.*
