# EsperantAI — Product Specification

> **Los gestos honestos** — El primer controlador AI por gestos para streamers.

---

## Concepto narrativo

| Concepto | Significado |
|---|---|
| **Esperanto** | Intento de lenguaje universal (1887, L.L. Zamenhof). Fracasó como idioma hablado, pero su ideal vive. |
| **Gestos** | El lenguaje universal real. Pre-lingüístico, biológico, millones de años de evolución. Un pulgar arriba significa lo mismo en Tokio que en Buenos Aires. |
| **AI** | La inteligencia moderna que traduce esos gestos a comandos de streaming. |

**Slogan**: *Los gestos honestos.*

**Tagline en inglés**: *Honest gestures. Universal streaming.*

**Tagline expandido**: "Esperanto failed as a spoken language. Gestures didn't. EsperantAI is the AI that finally speaks the only language humans have always shared."

---

## Propuesta de valor única

EsperantAI traduce **gestos faciales y corporales** en **comandos** para cualquier software de streaming, en cualquier plataforma, en cualquier idioma.

- **Cero hardware extra** (compite con Stream Deck XL $249)
- **Cero instalación nativa** (web app, funciona en cualquier OS con navegador)
- **Multi-plataforma** (Twitch + YouTube Live + Kick + más)
- **Multi-software** (OBS + Streamlabs + vMix + PRISM + XSplit)
- **Multi-idioma** (12+ idiomas, auto-detección del SO)

---

## Datos de mercado verificables que sustentan el producto

Todos los datos abajo tienen fuente verificable. Si no hay fuente, no se incluye.

### Plataformas objetivo

| Plataforma | Métrica | Valor | Fuente |
|---|---|---|---|
| Twitch | Unique channels Q4 2025 | 8.38M | [Streamlabs x Stream Hatchet Q4 2025](https://streamlabs.com/content-hub/post/streamlabs-and-stream-hatchet-q4-2025-live-streaming-report) |
| Twitch | Active monthly streamers 2026 | 7.06M | [DemandSage 2026](https://www.demandsage.com/twitch-users/) |
| YouTube Live | Total broadcast channels | 4.1M | [StreamsCharts YouTube](https://streamscharts.com/overview?platform=youtube) |
| Kick | MAU early 2026 | 10M | [Kick vs Twitch 2026](https://stream-rise.com/articles/kick-vs-twitch-2026) |
| Kick | Gaming market share | 11% (vs Twitch 54%) | (misma fuente) |
| VTubers livestreaming | Active worldwide | <6,000 | [Statista 2024](https://www.statista.com/statistics/1609835/vtuber-streamers-by-region/) |

### Idiomas objetivo (TwitchTracker May 2026)

Datos exactos de [TwitchTracker Languages](https://twitchtracker.com/languages), promedio últimos 7 días:

| # | Idioma | Canales concurrent | Viewers concurrent |
|---|---|---|---|
| 1 | English | 49,830 | 1,009,694 |
| 2 | Spanish | 6,735 | 119,100 |
| 3 | Russian | 6,575 | 246,736 |
| 4 | French | 4,358 | 139,126 |
| 5 | Portuguese | 4,121 | 105,874 |
| 6 | German | 4,074 | 200,796 |
| 7 | Japanese | 3,652 | 120,758 |
| 8 | Chinese | 1,161 | 53,171 |
| 9 | Italian | 982 | 30,425 |
| 10 | Polish | 622 | 24,634 |
| 11 | Arabic | 507 | 7,046 |
| 12 | Korean | 101 | 2,423 |

### Países objetivo (Twitch users, 2026)

Datos de [WorldPopulationReview Twitch Users 2026](https://worldpopulationreview.com/country-rankings/twitch-users-by-country) y [DemandSage 2026](https://www.demandsage.com/twitch-users/):

| País | Users | Idioma primario |
|---|---|---|
| 🇺🇸 USA | 93M (37.2M MAU) | English |
| 🇧🇷 Brasil | 16.9M | Portuguese |
| 🇩🇪 Alemania | 16.8M | German |
| 🇬🇧 UK | 13.4M | English |
| 🇫🇷 Francia | 11.3M | French |
| 🇷🇺 Rusia | 10.5M | Russian |
| 🇪🇸 España | 10.5M | Spanish |
| 🇦🇷 Argentina | 10M | Spanish |
| 🇲🇽 México | 9.2M | Spanish |
| 🇮🇹 Italia | 8.3M | Italian |

### Comparable de precio: Stream Deck

| Métrica | Valor | Fuente |
|---|---|---|
| Stream Deck market 2024 | $383.7M | [Growth Market Reports](https://growthmarketreports.com/report/stream-deck-market) |
| Stream Deck market 2024 (estimación alternativa) | $430M | [Dataintelo](https://dataintelo.com/report/stream-deck-market) |
| Stream Deck XL price | $249 | Elgato official |
| Stream Deck Mini price | $79 | Elgato official |

---

## Plataformas integradas (matriz técnica verificada)

| Plataforma | API/Protocolo | Browser-only viable | Fuente API |
|---|---|---|---|
| Twitch | EventSub WebSocket | ✅ Sí | [dev.twitch.tv/docs/eventsub](https://dev.twitch.tv/docs/eventsub/) |
| YouTube Live | REST polling + gRPC | ✅ Sí | [developers.google.com/youtube/v3/live](https://developers.google.com/youtube/v3/live/docs) |
| Kick | OAuth 2.1 PKCE + Webhooks | ⚠️ Webhooks requieren backend; REST polling sí browser | [github.com/KickEngineering/KickDevDocs](https://github.com/KickEngineering/KickDevDocs) |
| Trovo | WebSocket Chat | ✅ Sí | [developer.trovo.live](https://developer.trovo.live/docs/Chat%20Service.html) |
| TikTok Live | Reverse-engineered | ❌ Requiere backend pagado | [TikTok-Live-Connector](https://github.com/zerodytrash/TikTok-Live-Connector) |
| Rumble | REST limitado | ⚠️ Sin eventos en tiempo real ricos | [rumble.com/account/livestream-api](https://rumblefaq.groovehq.com/help/how-to-use-rumble-s-live-stream-api) |
| Facebook Gaming | Graph API | ⚠️ Requiere app review Meta | — |
| **StreamElements bridge** | Socket.IO | ✅ Sí — unifica Twitch+YT+FB+Kick | [streamelements.com](https://streamelements.com/) |

---

## Apps de broadcasting integradas (matriz técnica verificada)

| App | API/Protocolo | Adapter strategy | Fuente |
|---|---|---|---|
| **OBS Studio** | obs-websocket v5 | Direct WebSocket :4455 | [github.com/obsproject/obs-websocket](https://github.com/obsproject/obs-websocket) |
| **Streamlabs Desktop** | Local API | WebSocket :59650 con token | [github.com/streamlabs/streamlabs-desktop-api-docs](https://github.com/streamlabs/streamlabs-desktop-api-docs) |
| **PRISM Live Studio** | obs-websocket plugin (basado en OBS) | Mismo adapter que OBS | [guide.prismlive.com](https://guide.prismlive.com/desktop/guides/features/obs-plugins/using-obs-plugins) |
| **vMix** | HTTP Web Controller API | HTTP REST :8088 | [vmix.com/help25/WebController.html](https://www.vmix.com/help25/WebController.html) |
| **XSplit Broadcaster** | XJS Framework (Remote xjs proxy) | WebSocket proxy via XJS | [github.com/xjsframework/xjs](https://github.com/xjsframework/xjs) |
| **Ecamm Live** | HTTP API local | HTTP REST :65194 | (Mac-only, postponer) |
| ~~Wirecast~~ | Excluido por decisión de producto | — | — |

---

## Roadmap de versiones

### v1.0 — MVP universal (semanas 1-3)
- Refactor a arquitectura multi-adapter
- OBS Studio adapter (existente, refactorizado)
- Twitch EventSub WebSocket (cliente directo, sin backend)
- Sistema i18n con 2 idiomas: English + Spanish
- Sliders + 18 triggers configurables (face/hand/gaze/emotion/blink)
- Branding EsperantAI

### v1.5 — Multi-plataforma streaming (semanas 4-5)
- Streamlabs Desktop adapter
- vMix adapter
- PRISM Live Studio (reusa OBS adapter)

### v2.0 — Multi-plataforma de eventos (semanas 6-7)
- YouTube Live REST polling
- StreamElements bridge (unifica Twitch+YT+Kick+FB)
- Triggers combinados: evento plataforma + gesto streamer = acción

### v2.5 — Hand gestures completos (semana 8)
- Habilitar Human.js hand detection
- 8 gestos: 👍 ✌️ 🤘 👌 ✊ 🖐️ ☝️ 👆
- Combos cabeza+mano

### v3.0 — Idiomas masivos (semana 9)
- Traducción a 12 idiomas via DeepL API
- Auto-detección locale del SO

### v3.5 — Kick + XSplit (semana 10)
- Kick OAuth 2.1 PKCE + REST polling
- XSplit XJS adapter

### v4.0 — TikTok + Facebook (futuro)
- Backend de soporte (Cloudflare Workers gratis)
- TikTok Live via signature server
- Facebook Gaming Graph API

---

## Modelo de negocio (sin promesas, solo opciones)

### Tiers propuestos (precios sujetos a validación de mercado)

| Tier | Precio | Features |
|---|---|---|
| **Free** | $0 | OBS + Twitch + 5 triggers + 2 idiomas + marca de agua sutil |
| **Pro** | $X (TBD) lifetime | Todas las apps + todas las plataformas + 18 triggers + 12 idiomas + sin marca |
| **Pro+ Director** | $Y (TBD) lifetime | Pro + hand gestures + combo triggers + StreamElements bridge + soporte directo |

**Nota honesta**: Los precios X e Y deben validarse con mercado real. Mi recomendación previa de $19/$59 fue basada en comparación con Stream Deck XL ($249) pero NO con datos reales de conversión en este nicho. Joel decide precio final tras lanzamiento gratis + validación de demanda.

### Distribución

- **GitHub Pages gratis** para hosting de la app web
- **LemonSqueezy** para Pro tiers (Merchant of Record — maneja IVA mundial)
- **License keys nativos LemonSqueezy** (sin costo extra de Cryptlex/Keygen)

---

## Filosofía del producto

1. **Web-first**: Sin instaladores, sin Tauri, sin Electron. Una URL = funciona.
2. **Universal**: Cualquier streaming software con API + cualquier plataforma + cualquier idioma.
3. **Honesto**: Los gestos no mienten. El producto tampoco.
4. **Accesible**: Compite contra hardware caro y soluciones técnicas complicadas.
5. **Privacy**: Todo corre en el navegador. Cero servidor de IA. Cero cámaras enviadas a la nube.

---

## Equipo

- **Joel Salazar Ramírez** — Founder & Sales (EdugameDigital)
- **AtenAI + AI Assistants** — Development
- **Vladimir Mandic** — Creador de Human.js (sin afiliación, MIT License)

---

*Última actualización: May 2026 — versión 1.0 spec inicial post-investigación de mercado verificable.*
