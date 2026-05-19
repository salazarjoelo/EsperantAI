# Plan de Rediseño EsperantAI — Audit + Competitive + Trends
**Fecha:** 2026-05-19
**Audiencia objetivo:** streamers profesionales (Twitch/YouTube/Kick) — early adopters exigentes
**Stack actual:** HTML/CSS/JS vanilla, CSP estricto `style-src 'self'`, 15 idiomas pre-rendered

---

## TL;DR — Las 5 cosas que más matan profesionalismo HOY

| # | Problema actual | Por qué importa | Esfuerzo fix |
|---|---|---|---|
| 1 | **`.trust-logos` con TEXTO** ("OBS Studio", "Streamlabs") en lugar de logos SVG reales | Cualquier streamer reconoce los logos OBS/Streamlabs/vMix al instante. Texto plano grita "amateur landing" | BAJO — bajar 9 logos SVG oficiales y reemplazar `<span>` por `<img>` |
| 2 | **0 screenshots reales del producto controlando OBS** | El target es escéptico. Solo creen viendo OBS-con-overlay-de-gesto en captura real. Hero card actual es UI mock genérica | MEDIO — capturar 3-5 screenshots + 1-2 GIFs de 5s del producto en acción |
| 3 | **0 social proof real** (testimonios + métricas de creators) | Camo dice "10M users", Animaze "1M creators", Streamer.bot muestra Discord count vivo (12,124). EsperantAI dice 0. | ALTO — bloqueado hasta tener 3-5 streamers beta con permiso. NO fabricar |
| 4 | **System fonts** (no custom typography) | Linear/Vercel/Cursor/Raycast usan Inter/Geist. System default = "lo hice en una tarde" | BAJO — agregar Inter self-hosted (2 archivos woff2, CSP-compatible) |
| 5 | **Iconos genéricos `+`** en cards de "How it works" | Los 3 pasos son el momento de máxima atención post-hero. Iconos `+` son indiferenciables, no comunican el flow | MEDIO — diseñar 3 SVGs específicos: webcam, calibración, stream |

**Estos 5 fixes solos sacan la landing del territorio "amateur" sin tocar arquitectura.**

---

## Análisis competitivo — Lo que enfrentamos visualmente

### Datos verificados (research agente)

**Categoría HARDWARE (más caros, más legitimados visualmente):**
| Producto | Precio | Hero design |
|---|---|---|
| Elgato Stream Deck MK.2 | $149.99 | Foto producto, LCD iluminado, fondo neutro |
| Elgato Stream Deck Mini | $59.99 | Same pattern |
| Loupedeck Live | ~$269 [no verificado en sitio oficial] | Editorial, foto producto en mano, paleta minimalista |
| Razer Stream Controller X | $149.99 | Negro mate, RGB Chroma, estética gamer agresiva |
| TourBox NEO | $135.20 (Amazon) | Ergonómico, mano operando dispositivo |

**Categoría SOFTWARE (anchor problemático en pricing):**
| Producto | Precio | Threat |
|---|---|---|
| Touch Portal | $13.99 one-time | Competidor directo. Macro multi-action via tablet |
| VTube Studio | $14.99 one-time | YA TIENE webcam-based hand & gesture tracking. **El más peligroso técnicamente.** |
| Animaze | $19.99-99.99/año | Hero con avatares 3D animados, paleta vibrante |
| Streamer.bot | OSS gratis | "Supercharge your live stream" + Discord count vivo 12,124 |
| Mix It Up | OSS gratis | "The Only Streaming Bot You'll Ever Need. Period." |

### Insights estratégicos

1. **NADIE comunica "hands-free" como diferenciador** — gap claro. EsperantAI ES el único producto donde el streamer NO TOCA NADA. Hardware Stream Deck/Loupedeck requiere mano. Software competitor Touch Portal requiere tablet/móvil. VTube Studio mapea gesto a avatar, no a comando OBS.

2. **Pricing anchor problemático**: VTube Studio + Touch Portal = $13-15 one-time. Si EsperantAI cobra $49/$89, debe **justificar la diferencia con beneficios verificables** — no solo "es mejor".

3. **Pricing anchor OPORTUNIDAD**: vs hardware Stream Deck = $149.99. Si presentamos "$49 vs $149 + tienes que comprar hardware extra + se desactualiza" → favorece a EsperantAI fuerte.

4. **Idiomas**: VTube Studio cubre 15+ idiomas, Stream Deck/Razer solo EN. **EsperantAI ya está al nivel de VTube Studio (15 locales pre-rendered) — esto es realmente competitivo.**

5. **Social proof cuantificado**: nadie en hardware streamer muestra user count agregado. **Oportunidad abierta** cuando tengamos los primeros 100/500/1000 users.

---

## Tendencias de design 2026 — Lo que estamos al lado vs detrás

### Lo que YA HACEMOS BIEN
- ✅ Dark mode (alineado con Linear/Vercel/Raycast/Cursor)
- ✅ Paleta cyan + violeta + accent (alineada con creator/dev tools premium)
- ✅ Bento grid en Features (existe y se ve decente)
- ✅ Hero copy bold + sub explicativo
- ✅ Gradient text en palabras clave (H1 "gesture" tachada)
- ✅ Pricing con anchor strike (Stream Deck XL $249 tachado)

### Lo que NOS FALTA (prioridad alta)
- ❌ Custom typography (Inter/Geist self-hosted)
- ❌ Video loops MP4/WebM del producto real funcionando
- ❌ Microinteracciones hover lift en cards
- ❌ Gradientes aurora sutiles en background
- ❌ Pricing comparison detallada vs Stream Deck/Streamlabs ($49 una vez vs $19/mo × N meses)
- ❌ Social proof con creators reales
- ❌ Logos SVG reales de OBS/Streamlabs/vMix/etc. (texto plano es vergonzoso)
- ❌ Screenshots reales del producto en OBS

### Lo que NO HACER (verificado contra referentes)
- ❌ 3D/WebGL pesado en hero — contradice mensaje "local-first low-overhead"
- ❌ Glassmorphism global — patrón quemado de 2021-2022
- ❌ Lottie animations — peso JSON + no graceful fallback
- ❌ Stock illustrations o emojis grandes — Linear/Cursor lo evitan
- ❌ Inventar testimonios o números de usuarios

---

## Plan de implementación — 3 sprints

### SPRINT 1 (esta semana) — Impacto inmediato, esfuerzo bajo

**Objetivo: salir del territorio "amateur" en 1 sprint.**

| Task | Por qué | Esfuerzo |
|---|---|---|
| **Reemplazar `.trust-logos` texto por SVG reales** | OBS Studio, Streamlabs, vMix, PRISM, XSplit, Twitch, YouTube, Kick, Trovo. SVG oficiales públicamente disponibles | 1h |
| **Inter font self-hosted** | woff2 (2 archivos: regular + bold) en `/fonts/`, agregar `@font-face` a hot-sale.css | 30min |
| **Microinteracciones hover en cards** | translateY(-2px) + box-shadow glow + border-color shift en `.bento-item`, `.plan`, `.step-card`, etc. transition 220ms cubic-bezier | 1h |
| **Reemplazar iconos `+` de "How it works"** | 3 SVGs específicos: cámara webcam, slider de calibración, broadcast stream | 2h diseño |
| **Gradiente aurora sutil de fondo** | 3 radial-gradients en body via `background-image` (cyan top-left, violeta bottom-right, base #0d1117) | 30min |
| **Hero copy ajuste** | Probar "El input que entiende tu cara" o "Stream sin tocar nada" como variantes A/B futuras. Sub con CTAs claros: "Para Windows" + "Demo en YouTube" | 30min copy |

**Total sprint 1: ~6 horas. Output: landing pasa de "amateur" a "competitivo".**

---

### SPRINT 2 (próximas 2 semanas) — Conversión y diferenciación

**Objetivo: justificar pricing $49/$89 vs $14 de Touch Portal/VTube Studio.**

| Task | Por qué | Esfuerzo |
|---|---|---|
| **Pricing comparison table** | Filas: Stream Deck XL ($249 + hardware), Streamlabs Ultra ($19/mo × 24 = $456), VTube Studio ($14.99 pero solo avatar), Touch Portal ($13.99 + tablet). Columnas: precio, hands-free, OBS native, sin internet, multi-idioma | 3h |
| **Video loop hero MP4 < 500KB** | 5-8s loop: streamer levanta cejas → OBS cambia escena. WebM + MP4 fallback. autoplay muted loop playsinline | 2h captura + edit |
| **3 video loops en cards Features** | Cada uno 4-6s mostrando: gesto facial, gesto manual, calibración. Lazy-load fuera de viewport | 4h captura + edit |
| **Screenshots reales del producto + OBS** | 5-6 screenshots: OBS con overlay EsperantAI, calibración wizard, dashboard de gestos, escena cambiada por gesto, alert por gesto | 2h |
| **Stat row hero refresh** | "13 gestures" → "13 gestos · 5 software · 4 plataformas · 0 cloud". Animar números al entrar viewport (intersection observer) | 1h |

**Total sprint 2: ~12 horas. Output: pricing justificado, producto demostrado.**

---

### SPRINT 3 (mes 2, cuando haya beta users) — Social proof

**Bloqueado hasta tener 3-5 streamers beta con permiso de uso.**

| Task | Por qué | Esfuerzo |
|---|---|---|
| **Sección "Used by streamers" con 3-5 testimonios** | Foto + nombre + canal + métrica (followers/horas streaming) + quote específica. NO fabricar | 2h por testimonio (incluyendo coordinación) |
| **Trust row de creators verificados** | Logos de canales Twitch/YouTube reales que usan, con permiso | 1h por creator |
| **Discord live count** | Embed widget o llamada periódica a Discord API mostrando "X members online ahora" — patrón Streamer.bot | 2h dev |
| **Brand DNA específica de creators target** | Foto/avatar de "streamer arquetipo" usando el producto. NO stock photo — modelado o real | 1 día creative |

**Total sprint 3: ~16 horas. Output: credibilidad y prueba social que cierra dudas.**

---

## Quick wins HOY (próxima hora)

Si vas a meter manos AHORA antes que LemonSqueezy revise:

1. **Reemplazar `<span class="trust-logo">OBS Studio</span>` por `<img src="/assets/brands/obs.svg">`** — 9 archivos SVG. Yo los puedo bajar y normalizar a 32px height white. 1 hora.

2. **Capturar 1 screenshot REAL** de EsperantAI corriendo con OBS encima, gesto detectado activando alert. Solo 1 screenshot. Reemplaza la hero-dashboard-es.png abstracta. 30 min tuyos.

3. **Inter font** self-hosted. Migra typography de system a Inter. 30 min.

4. **Logos en card "Fits your setup"** (Features bento) — ya están como texto, mismo fix que #1.

Eso son 2.5 horas combinadas y la landing pasa de "amateur visible" a "competitiva". **LemonSqueezy aprobaría con tranquilidad esa versión.**

---

## Bloqueadores externos (no tocar antes)

- **Pricing checkout activado**: bloqueado por aprobación LemonSqueezy. Los CTAs ya tienen mailto fallback para waitlist mientras tanto (commit 44c67e1).
- **Hot Sale banner activo**: bloqueado por LemonSqueezy + decisión tuya sobre fechas finales. Código listo, solo subir `/hot-sale.json` cuando quieras.
- **Social proof**: bloqueado por beta users reales. Si quieres acelerar, lanzar beta privada con 10-20 streamers conocidos antes de hacer publish full.

---

## Referencias verificadas

**Competidores con URLs (research agent 1):**
- elgato.com/us/en/p/stream-deck-mk2-black ($149.99)
- loupedeck.com (precio actual no visible en HTML)
- razer.com/streaming-accessories/razer-stream-controller-x ($149.99)
- tourboxtech.com ($99-$282)
- animaze.us/pricing-individual (Free/$19.99/$99.99 año)
- denchisoft.com (VTube Studio, $14.99 lifetime)
- touch-portal.com ($13.99 lifetime)
- streamer.bot (OSS, Discord 12,124 online)

**Referentes de diseño 2026 (research agent 2):**
- linear.app — bento + dark + Inter
- raycast.com — bento + glassmorphism quirúrgico
- cursor.com — producto real en hero, spring animations
- vercel.com — Geist font + gradients sutiles
- bitwig.com — full-width video hero
- riverside.com — testimonios creators reales con métricas
- descript.com — anchor pricing claro
- framer.com — Holo Shader (high-end opcional)

**No fabricamos:** ningún testimonial, ninguna métrica de usuarios, ningún precio sin source verificable. Cuando no hay dato, lo decimos.
