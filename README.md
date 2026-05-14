# 👁️ EsperantAI

> **Los gestos honestos.** Controlador AI universal por gestos para streamers.

EsperantAI traduce **gestos faciales y corporales** en **comandos** para cualquier software de streaming, en cualquier plataforma, en cualquier idioma.

[Esperanto](https://en.wikipedia.org/wiki/Esperanto) fue un intento humano de lenguaje universal en 1887. Falló como idioma hablado, pero su ideal vive. **Los gestos sí son universales** — pre-lingüísticos, biológicos, millones de años de evolución. EsperantAI es la AI que finalmente habla el único lenguaje que todos los humanos compartimos.

---

## Lo que hace EsperantAI

- 🧠 **Detecta gestos universales** (rotación de cabeza, emociones, mirada, parpadeo) y culturales (gestos de mano)
- 🎬 **Controla cualquier streaming software**: OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit
- 📡 **Recibe eventos de plataformas**: Twitch, YouTube Live, Kick, Trovo, StreamElements
- 🌍 **Multi-idioma con auto-detección del SO**: 13 locales (en-US, es-ES, es-MX, pt-BR, fr-FR, de-DE, ja-JP, ru-RU, zh-CN, it-IT, pl-PL, ar-SA, ko-KR)
- 🎯 **Multi-acción por gesto**: un mismo gesto puede cambiar escena + reproducir sonido + mostrar overlay + enviar chat simultáneamente
- 🤝 **Combo triggers**: combina eventos de plataforma + gestos del streamer (ej: "donación + 👍 = activar escena celebración")

## Filosofía: gestos universales vs culturales

> "Las expresiones faciales son universales en todas las culturas" — Paul Ekman, 1972

EsperantAI marca visualmente cada gesto:

| 🌐 Universal (Ekman) | ⚠️ Cultural (varía por país) |
|---|---|
| Rotación de cabeza (yaw/pitch/roll) | 👍 Pulgar arriba |
| Sonrisa, sorpresa, enojo, neutral | ✌️ Signo de paz |
| Distancia al rostro | 🤘 Cuernos rock |
| Mirada de los ojos | 👌 OK |
| Parpadeo | ✊ Puño cerrado |

El usuario decide qué gestos usar según su audiencia.

---

## Datos de mercado verificables

Toda decisión de producto se basa en datos con fuente. Ver [PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md) para detalle completo.

### Plataformas objetivo

| Plataforma | Métrica | Fuente |
|---|---|---|
| Twitch | 8.38M unique channels Q4 2025 | [Streamlabs x Stream Hatchet Q4 2025](https://streamlabs.com/content-hub/post/streamlabs-and-stream-hatchet-q4-2025-live-streaming-report) |
| Twitch monthly | 7.06M streamers activos | [DemandSage 2026](https://www.demandsage.com/twitch-users/) |
| YouTube Live | 4.1M broadcast channels | [StreamsCharts](https://streamscharts.com/overview?platform=youtube) |
| Kick | 10M MAU, +131% YoY | [Kick vs Twitch 2026](https://stream-rise.com/articles/kick-vs-twitch-2026) |
| VTubers activos | <6,000 worldwide | [Statista 2024](https://www.statista.com/statistics/1609835/vtuber-streamers-by-region/) |

### Idiomas en Twitch (TwitchTracker May 2026)

| Idioma | Canales concurrent | Viewers concurrent |
|---|---|---|
| English | 49,830 | 1,009,694 |
| Spanish | 6,735 | 119,100 |
| Russian | 6,575 | 246,736 |
| French | 4,358 | 139,126 |
| Portuguese | 4,121 | 105,874 |
| German | 4,074 | 200,796 |
| Japanese | 3,652 | 120,758 |

Datos exactos verificables en [twitchtracker.com/languages](https://twitchtracker.com/languages).

---

## Tecnología

EsperantAI es una **web app** que corre 100% en el navegador. Cero instalación nativa, cero servidor de IA, cero datos enviados a la nube.

### Stack

- **[Human.js 3.3.6](https://github.com/vladmandic/human)** (MIT) — detección facial AI local en GPU del navegador (WebGL)
- **[obs-websocket-js 5.0.8](https://github.com/obs-websocket-community-projects/obs-websocket-js)** (MIT) — control de OBS Studio v28+
- **APIs nativas**: Twitch EventSub WebSocket, YouTube Live REST, Kick OAuth 2.1 PKCE, Trovo WebSocket, StreamElements Socket.IO
- **i18n**: sistema propio con auto-detección de locale del SO via `navigator.language`

### Privacy by design

| EsperantAI NO hace | EsperantAI SÍ hace |
|---|---|
| ❌ Enviar video a la nube | ✅ Detección AI local en GPU |
| ❌ Grabar/almacenar video | ✅ Conexiones locales (loopback) |
| ❌ Trackers de terceros | ✅ OAuth con tokens en localStorage |

---

## Software de streaming soportado

| App | Protocolo | Estado |
|---|---|---|
| **OBS Studio** 28+ | obs-websocket v5 (WS :4455) | ✅ Production |
| **Streamlabs Desktop** | API local (WS :59650) | ✅ Production |
| **vMix** | HTTP Web Controller (:8088) | ✅ Production |
| **PRISM Live Studio** | obs-websocket plugin | ✅ Production |
| **XSplit Broadcaster** | XJS Remote Framework | ⚙️ Beta |

## Plataformas de streaming soportadas

| Plataforma | Auth | Protocolo |
|---|---|---|
| **Twitch** | OAuth Implicit | EventSub WebSocket |
| **YouTube Live** | OAuth Implicit (Google) | REST polling |
| **Kick** | OAuth 2.1 PKCE | REST polling (WebSocket roadmap) |
| **Trovo** | OAuth Implicit | Chat WebSocket |
| **StreamElements** | JWT manual | Socket.IO (unifica Twitch+YT+Kick+FB) |

---

## Instalación

### Windows (recomendado)

1. Descarga la última versión desde [GitHub Releases](https://github.com/salazarjoelo/esperantai/releases)
2. Ejecuta `Instalar_EsperantAI.bat`
3. Listo: encontrarás "EsperantAI" en tu Escritorio y Menú Inicio

### Cualquier OS (sin instalación)

Abre en tu navegador: **https://salazarjoelo.github.io/esperantai/**

### Desarrollo local

```bash
git clone https://github.com/salazarjoelo/esperantai.git
cd esperantai
python -m http.server 8765
# Abre http://127.0.0.1:8765/index.html
```

---

## Quick start

1. Abre EsperantAI en tu navegador
2. Permite acceso a la cámara
3. **Conecta a tu streaming software** (OBS, Streamlabs, vMix, PRISM o XSplit)
4. Las escenas reales aparecerán automáticamente en los dropdowns del panel **Triggers**
5. **Mapea cada gesto a la escena** (o múltiples acciones) que quieres activar
6. **Opcional**: conecta plataformas (Twitch, YouTube, Kick) para combo triggers
7. ¡Listo! Mueve tu cabeza, los ojos, sonríe o haz gestos y EsperantAI ejecuta las acciones

### Atajos de teclado

| Tecla | Acción |
|---|---|
| `Espacio` | Pausa / Reanuda detección |
| `C` | Saltar a escena CENTRO manualmente |
| `R` | Recargar lista de escenas |
| `Esc` | Desconectar |

---

## Documentación

- 📘 [PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md) — Especificación con todas las fuentes
- 🏗️ [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Arquitectura técnica
- 🧪 [Catálogo de acciones](core/action-engine.js) — 16 tipos de acción disponibles

---

## Licencias

- **EsperantAI** © 2026 Joel Salazar Ramírez (EdugameDigital)
- **Human.js** © Vladimir Mandic — MIT
- **obs-websocket-js** © OBS WebSocket Community — MIT

---

## Roadmap

- [x] Multi-software (OBS / Streamlabs / vMix / PRISM / XSplit)
- [x] Multi-plataforma (Twitch / YouTube / Kick / Trovo / StreamElements)
- [x] Multi-idioma 13 locales (auto-detect SO)
- [x] Sistema multi-acción por gesto (16 tipos)
- [x] OAuth flow para Twitch/YouTube/Kick
- [x] Cultural insight (Ekman 1972) en UI
- [ ] Combo triggers UI completa (evento + gesto = acción)
- [ ] Traducción humana revisada de 11 idiomas
- [ ] TikTok Live integration (requiere backend para signature server)
- [ ] Facebook Gaming integration (requiere Meta app review)
- [ ] Pro tier con license server

---

## Contacto

Joel Salazar Ramírez · [EdugameDigital](https://edugame.digital) · joel@edugame.digital
