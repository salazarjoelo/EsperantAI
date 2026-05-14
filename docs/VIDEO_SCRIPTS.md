# Prompts para Videos Explicativos — EsperantAI

> Banco de prompts listos para usar con generadores de video AI (Runway Gen-3, Sora, Veo 3, Pika 2.0, Luma Dream Machine, Kling) o producción humana tradicional.

**IA primaria responsable**: ChatGPT (UX/copy)
**IA revisora técnica**: Claude (verificar que cada paso descrito en el script coincida con el comportamiento real de la app)
**Aprobación final**: Joel Salazar (marca + tono)

**Tono general**: honesto, sin hype, técnico-amigable. EsperantAI compite contra Stream Deck XL ($249) — el video debe demostrar que un gesto reemplaza un botón físico, no inventar capacidades.

**No hacer en ningún video**:
- ❌ Mostrar la app cambiando escenas en plataformas que aún no implementamos (TikTok Live, Facebook Gaming v1)
- ❌ Decir "100% privado" sin matizar (Human.js corre local, pero OAuth pasa por servidores de cada plataforma)
- ❌ Mostrar precios concretos hasta que Joel los fije
- ❌ Inventar testimonios de streamers que no existen

---

## Índice

1. [Video #1 — Hero del landing (60s)](#video-1)
2. [Video #2 — Quick Start (3-4 min)](#video-2)
3. [Video #3 — OBS Connection (90s)](#video-3)
4. [Video #4 — Conectar Twitch (2 min)](#video-4)
5. [Video #5 — Conectar YouTube Live (2 min)](#video-5)
6. [Video #6 — Conectar Kick (2 min)](#video-6)
7. [Video #7 — Configurar gesto → escena (90s)](#video-7)
8. [Video #8 — Multi-Action Builder (3 min)](#video-8)
9. [Video #9 — Combo Triggers (2 min)](#video-9)
10. [Video #10 — Calibration Wizard (90s)](#video-10)
11. [Video #11 — Universal vs Cultural Gestures (2 min)](#video-11)
12. [Video #12 — Privacy & Security (90s)](#video-12)
13. [Video #13 — Streamlabs / vMix / PRISM / XSplit (45s c/u)](#video-13)
14. [Shorts / Reels / TikTok (15-30s)](#shorts)
15. [Variantes por idioma](#idiomas)
16. [Guía de assets de marca](#assets)

---

<a id="video-1"></a>

## Video #1 — Hero del landing (60s)

**Objetivo**: Convertir visitas en compradores en 60 segundos.
**Audiencia**: Streamer que llega a `landing.html` por primera vez.
**Plataformas**: web (autoplay muted), YouTube, X/Twitter.

### Mensaje núcleo

> Un gesto. Cualquier software. Cualquier plataforma. Cualquier idioma. EsperantAI traduce los gestos honestos en comandos de streaming.

### Storyboard (6 escenas × 10s)

| t | Visual | Audio / Voz en off |
|---|---|---|
| 0-10s | Plano cerrado de streamer mirando cámara. Su mano se acerca al teclado pero **no toca nada**. Caption: "¿Cuántos atajos memorizas?" | Música ambient ligera. Sin voz aún. |
| 10-20s | Mismo streamer hace 👍. Cut a OBS cambiando de "Just Chatting" a "Gameplay". Caption: "Uno." | Voz: "Un gesto basta." |
| 20-30s | Logos en mosaico animado: OBS, Streamlabs, vMix, PRISM, XSplit. | Voz: "Funciona con tu software de streaming." |
| 30-40s | Logos en mosaico: Twitch, YouTube Live, Kick, Trovo, StreamElements. | Voz: "Reacciona a tu plataforma." |
| 40-50s | Banderas / texto en pantalla: 🇺🇸 🇲🇽 🇧🇷 🇫🇷 🇩🇪 🇯🇵 🇷🇺 🇨🇳 🇰🇷 🇮🇹 🇵🇱 🇸🇦. | Voz: "Habla tu idioma. Doce, de hecho." |
| 50-60s | Logo EsperantAI sobre fondo limpio. Slogan: "Los gestos honestos". CTA: "Pruébalo ahora". | Voz: "EsperantAI. Los gestos honestos." |

### Prompt para generador de video (Runway/Sora/Veo)

```
Cinematic 60-second product hero for "EsperantAI", a browser-based AI gesture controller
for live streamers. Shot 1: medium close-up of a streamer at their desk, neon RGB lighting,
warm skin tones, hand approaching keyboard then pulling back. Shot 2: same streamer giving
a thumbs-up; cut to OBS Studio interface showing scene change from "Just Chatting" to
"Gameplay" in a single frame. Shot 3: animated mosaic of streaming software logos (OBS,
Streamlabs, vMix, PRISM, XSplit) on dark gradient. Shot 4: mosaic of platform logos
(Twitch, YouTube, Kick, Trovo). Shot 5: flags of 12 countries dissolving into each other.
Shot 6: clean "EsperantAI" wordmark on black with tagline "Los gestos honestos" /
"Honest gestures". Aspect 16:9, 4K, 24fps, color grade teal-orange but balanced, no lens
flare overkill.
```

### Voz en off — Versión Español (ES-ES, MX equivalente)

```
[0-10s] (silencio, sólo música)
[10-15s] Un gesto basta.
[15-30s] Funciona con tu software: OBS, Streamlabs, vMix, PRISM, XSplit.
[30-45s] Reacciona a tu plataforma: Twitch, YouTube Live, Kick.
[45-55s] Habla tu idioma. Doce, de hecho.
[55-60s] EsperantAI. Los gestos honestos.
```

### Voz en off — English (US/UK)

```
[0-10s] (silence, music only)
[10-15s] One gesture is enough.
[15-30s] Works with your software: OBS, Streamlabs, vMix, PRISM, XSplit.
[30-45s] Reacts to your platform: Twitch, YouTube Live, Kick.
[45-55s] Speaks your language. Twelve, actually.
[55-60s] EsperantAI. Honest gestures.
```

### Música

- BPM: 95-105
- Mood: confident, not "epic". Avoid trap drops. Reference: Apple iPad ads pre-2020.
- Royalty-free: Epidemic Sound "Confident Minimal" o equivalente.

### CTA

Botón visible los últimos 5s sobre el logo: **"Probar EsperantAI"** → link a `index.html`.

---

> **Nota**: este documento tiene sólo el Video #1 completo como referencia de estilo. Los videos #2-#13 y los Shorts/Reels los desarrollará ChatGPT (UX/copy) como tarea TASK-301bis del backlog. Claude revisa que cada paso descrito coincida con el comportamiento real de la app.