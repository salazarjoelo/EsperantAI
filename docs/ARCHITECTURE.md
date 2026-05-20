# EsperantAI — Architecture

> Arquitectura modular de adaptadores para soportar múltiples streaming software y plataformas de streaming desde una sola web app browser-only.

---

## Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser)                           │
│  Chrome / Edge / Firefox · Windows 11 (93%) / Mac / Linux   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              ESPERANTAI WEB APP (GitHub Pages)              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              UI Layer (HTML/CSS)                     │   │
│  │  • Configuración · Métricas · Status                 │   │
│  │  • i18n auto-detect locale del SO (12 idiomas)       │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │        Core Detection Layer (Human.js 3.3.6)         │   │
│  │  • Face rotation (yaw/pitch/roll)                    │   │
│  │  • Hand gestures (8 gestos)                          │   │
│  │  • Gaze tracking · Emotions · Blink                  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │           Trigger Engine                             │   │
│  │  Gesture → Action mapping (configurable)             │   │
│  │  • 18+ triggers · cooldown · debounce                │   │
│  │  • Combo triggers (gesture + event)                  │   │
│  └────────┬────────────────────────┬────────────────────┘   │
│           │                        │                        │
│  ┌────────▼────────┐      ┌────────▼────────┐               │
│  │ Adapter Bus     │      │ Platform Bus    │               │
│  │ (Streaming SW)  │      │ (Stream Events) │               │
│  └────┬────────────┘      └────┬────────────┘               │
└───────┼────────────────────────┼────────────────────────────┘
        │                        │
   ┌────┴────┬────┬────┬────┐    ├────┬────┬────┬────────┐
   ▼         ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼        ▼
  OBS    Streamlabs vMix PRISM XSplit Twitch YT Kick Trovo StreamElements
  ws5    ws:59650   :8088 ws5  XJS    EventSub REST OAuth WS Bridge
```

---

## Estructura de carpetas

```
EsperantAI/                        ← (renombre futuro de Mira_Mira)
├── index.html                     ← UI principal con i18n
├── app.js                         ← Bootstrap + UI bindings
│
├── core/
│   ├── detector.js                ← Wrapper de Human.js
│   ├── trigger-engine.js          ← Sistema de triggers + cooldown
│   ├── action-engine.js           ← Motor de ejecución de acciones
│   ├── trigger-ui-builder.js      ← Panel visual de triggers
│   ├── license-manager.js         ← LemonSqueezy License API
│   ├── config-manager.js          ← localStorage + import/export
│   └── i18n.js                    ← Sistema de traducciones
│
├── adapters/                      ← Streaming software (qué controlar)
│   ├── adapter-base.js            ← Interface común
│   ├── adapter-obs.js             ← OBS WebSocket v5
│   ├── adapter-streamlabs.js      ← Streamlabs Desktop API
│   ├── adapter-vmix.js            ← vMix HTTP Web Controller
│   ├── adapter-prism.js           ← PRISM (reusa OBS via plugin)
│   └── adapter-xsplit.js          ← XSplit XJS Remote
│
├── platforms/                     ← Plataformas de streaming (eventos)
│   ├── platform-base.js           ← Interface común
│   ├── platform-twitch.js         ← Twitch EventSub WebSocket
│   ├── platform-youtube.js        ← YouTube Live REST polling
│   ├── platform-kick.js           ← Kick OAuth 2.1 + REST polling
│   ├── platform-trovo.js          ← Trovo Chat WebSocket
│   └── platform-streamelements.js ← StreamElements unified bridge
│
├── locales/                       ← Traducciones JSON
│   ├── en-US.json                 ← English (base)
│   ├── es-ES.json                 ← Spanish (España)
│   ├── es-MX.json                 ← Spanish (México/LatAm)
│   ├── pt-BR.json                 ← Portuguese Brazil
│   ├── fr-FR.json                 ← French
│   ├── de-DE.json                 ← German
│   ├── ja-JP.json                 ← Japanese (priority for VTubers)
│   ├── ru-RU.json                 ← Russian
│   ├── zh-CN.json                 ← Chinese Simplified
│   ├── it-IT.json                 ← Italian
│   ├── pl-PL.json                 ← Polish
│   ├── ar-SA.json                 ← Arabic (RTL)
│   └── ko-KR.json                 ← Korean (SOOP/CHZZK market)
│
├── libs/                          ← Vendor libraries
│   ├── human.js                   ← Human.js 3.3.6 IIFE
│   └── obs-ws.min.js              ← obs-websocket-js 5.0.8 IIFE
│
├── assets/
│   ├── branding/                  ← Logos EsperantAI
│   ├── icons/                     ← Iconos UI
│   └── sounds/                    ← Confirmaciones audio (opcional)
│
├── docs/
│   ├── PRODUCT_SPEC.md            ← Especificación con datos verificables
│   ├── ARCHITECTURE.md            ← Este archivo
│   ├── COMERCIALIZACION.md        ← Plan de monetización futura
│   └── MARKET_RESEARCH.md         ← Investigación de mercado citada
│
└── .claude/                       ← Hooks anti-fabricación
    ├── CLAUDE.md
    ├── settings.json
    └── hooks/check_fabrication.py
```

---

## Interface común de Adapters (Streaming Software)

Cada adapter implementa la misma interface:

```javascript
class AdapterBase {
  async connect(config) { /* establece conexión */ }
  async disconnect() { /* cierra conexión */ }
  async isConnected() { /* devuelve estado */ }
  async getScenes() { /* devuelve array de escenas */ }
  async switchScene(name) { /* cambia escena programa */ }
  async setPreviewScene(name) { /* studio mode preview */ }
  async triggerTransition() { /* transición preview→programa */ }
  on(event, handler) { /* eventos: sceneChanged, disconnected, etc. */ }
}
```

Cualquier adapter (OBS, Streamlabs, vMix, etc.) puede usarse de forma intercambiable. El core no sabe qué software está controlando.

---

## Interface común de Platforms (Stream Events)

Cada platform implementa:

```javascript
class PlatformBase {
  async connect(authConfig) { /* OAuth o token */ }
  async disconnect() { /* cierra suscripción */ }
  subscribe(eventType, handler) { /* sub, follow, donation, raid... */ }
  unsubscribeAll() { /* limpiar */ }
}
```

Eventos normalizados (todos los platforms emiten estos):
- `sub` — nueva suscripción
- `resub` — renovación
- `gift_sub` — regalo de sub
- `follow` — nuevo follower
- `donation` — donación con monto+moneda
- `raid` — raid recibido
- `cheer_bits` — bits Twitch / equivalent
- `channel_points` — Twitch points redemption
- `super_chat` — YouTube Super Chat
- `gift` — TikTok gifts / equivalent
- `member_milestone` — milestone subs

---

## Flujo de combo trigger (la magia del producto)

```
Twitch detecta donación de $5 (StreamElements bridge)
    ↓
Platform-StreamElements emite evento "donation" con {amount: 5, user: "joel"}
    ↓
Trigger Engine recibe evento → activa "esperando confirmación gestual"
    ↓
Streamer hace 👍 (detectado por Human.js hand)
    ↓
Trigger Engine combina: donation + thumbs-up = "thank-you-flow"
    ↓
Adapter-OBS recibe: switchScene("ThankYou") + opcionalmente trigger overlay
    ↓
OBS cambia escena. El streamer continúa.
```

Esto es lo que ningún producto del mercado hace actualmente — combinar **eventos de plataforma** con **gestos del streamer** como confirmación.

---

## Sistema i18n

### Detección automática

```javascript
// Al cargar la app
const locale = navigator.language || 'en-US';
// Ejemplos: "es-MX", "pt-BR", "ja-JP", "ar-SA"

// Fallback chain
i18n.setLocale(locale)              // primero intenta exacta
  || i18n.setLocale(locale.split('-')[0])  // luego idioma base ("es", "pt")
  || i18n.setLocale('en-US');               // último fallback
```

### Formato de los JSON

```json
{
  "_meta": {
    "language": "Español (España)",
    "code": "es-ES",
    "rtl": false,
    "completion": 100
  },
  "app": {
    "title": "EsperantAI",
    "tagline": "Los gestos honestos"
  },
  "ui": {
    "connect": "Conectar",
    "disconnect": "Desconectar",
    "scene_center": "Centro",
    "scene_left": "Izquierda"
  },
  "errors": {
    "camera_denied": "Acceso a cámara denegado",
    "obs_unreachable": "No se puede conectar a OBS"
  }
}
```

### Pipeline de traducción (futuro)

1. `en-US.json` es el archivo base (escrito por humano)
2. Script `scripts/translate.js` lee `en-US.json` y traduce a otros idiomas via DeepL API
3. Output a `locales/{locale}.json`
4. Humano nativo revisa antes de release
5. Idiomas con `_meta.completion < 100` muestran banner "translation in progress"

---

## Distribución y hosting

### Plan v1.0 (Free tier)
- **GitHub Pages**: `https://salazarjoelo.github.io/esperantai/` (gratis)
- **Dominio público actual**: `https://edugame.digital`
- **Cloudflare CDN**: gratis para assets estáticos
- **GitHub Actions**: build + deploy automático en push

### Plan v2.0 (Pro tiers)
- **LemonSqueezy** para checkout + license keys
- **License validation**: la app verifica online cada N días contra LS API
- **Sin backend propio**: LemonSqueezy actúa como backend

---

## Seguridad y privacidad

### Lo que EsperantAI NO hace
- ❌ NO envía video a la nube. Todo Human.js corre local en GPU del navegador.
- ❌ NO almacena video grabado.
- ❌ NO comparte datos de uso sin consentimiento explícito (opt-in analytics).
- ❌ NO incluye trackers de terceros.

### Lo que SÍ hace
- ✅ Conexiones locales a OBS/Streamlabs/vMix (loopback 127.0.0.1)
- ✅ OAuth con Twitch/YouTube/Kick — tokens guardados en localStorage encriptado
- ✅ License check (cuando hay tier Pro) — solo envía license key, no datos personales

### CSP propuesto
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  connect-src 'self' wss://eventsub.wss.twitch.tv https://api.twitch.tv https://www.googleapis.com https://api.kick.com https://api.streamelements.com ws://127.0.0.1:* http://127.0.0.1:*;
  img-src 'self' data:;
  media-src 'self';
  worker-src 'self' blob:;
```

---

## Estados del desarrollo

| Componente | Estado actual | Notas |
|---|---|---|
| Core detection (Human.js) | ✅ Funcional | Detector con RAF loop |
| Adapter OBS | ✅ Implementado | Con reconnect automático |
| Adapter Streamlabs | ✅ Implementado | WebSocket local con token |
| Adapter vMix | ✅ Implementado | HTTP REST polling |
| Adapter PRISM | ✅ Implementado | Reusa adapter OBS |
| Adapter XSplit | ⚙️ Beta | XJS Remote proxy |
| Trigger engine | ✅ Implementado | 18+ triggers con cooldown |
| Action engine | ✅ Implementado | 16 tipos de acción |
| Trigger UI Builder | ✅ Implementado | Panel con universal/cultural badges |
| i18n system | ✅ Implementado | 13 locales con auto-detect |
| License manager | ✅ Implementado | LemonSqueezy License API |
| Config manager | ✅ Implementado | localStorage + import/export |
| Platform Twitch | ✅ Implementado | EventSub WebSocket directo |
| Platform YouTube | ✅ Implementado | REST polling |
| Platform Kick | ✅ Implementado | OAuth 2.1 PKCE + REST polling |
| Platform Trovo | ✅ Implementado | Chat WebSocket |
| Platform StreamElements | ✅ Implementado | Socket.IO bridge |
| Hand gestures | ✅ Implementado | 7 gestos con cultural notes |
| Combo triggers | ✅ Implementado | Evento + gesto = acción |
| CSP headers | ✅ Implementado | Content-Security-Policy en HTML |

---

## Decisiones técnicas tomadas

1. **Web app, no nativa**: descartado Tauri/Electron porque limita distribución y complica updates. Browser-only con GitHub Pages cubre 100% del mercado.

2. **Wirecast fuera**: decisión de producto (Joel, may 2026). Mercado pequeño + API limitada.

3. **TikTok Live postponed**: requiere backend con signature server. No browser-only. v4.0+.

4. **Privacy-first**: Human.js corre 100% local. Esto es diferenciador vs competidores que envían a la nube.

5. **i18n manual + DeepL**: traducciones revisadas por humanos nativos antes de release. No auto-translate ciego.

6. **Adapter-based architecture**: cada streaming software es plug-and-play. Agregar nuevos = ~200 líneas JS.
