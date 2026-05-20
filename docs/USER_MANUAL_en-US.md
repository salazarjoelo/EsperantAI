# EsperantAI — User Manual

> **Honest gestures.** Control your streaming software with your face and hands, with no extra dedicated hardware.

**Version**: 3.0 · **Language**: English (translations available in 14 more languages)

**Technical validation**: reviewed against official documentation available as of **May 20, 2026** for OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit, Twitch, YouTube Live, Kick, Trovo, and StreamElements. Details: [`docs/MANUAL_PLATFORM_AUDIT_2026-05.md`](MANUAL_PLATFORM_AUDIT_2026-05.md).

---

## Table of Contents

1. [What is EsperantAI?](#what-is-esperantai)
2. [Minimum Requirements](#minimum-requirements)
3. [Purchase & Activation](#purchase--activation)
4. [First Use](#first-use)
5. [Connect Your Streaming Software](#connect-your-streaming-software)
6. [Configure Gestures & Scenes](#configure-gestures--scenes)
7. [Gesture Categories](#gesture-categories)
8. [Connect Streaming Platforms](#connect-streaming-platforms)
9. [Event + Gesture Combos (Advanced)](#event--gesture-combos-advanced)
10. [Sensitivity & Dead Zone](#sensitivity--dead-zone)
11. [Keyboard Shortcuts](#keyboard-shortcuts)
12. [Trigger History](#trigger-history)
13. [Change Language](#change-language)
14. [Manage Your License](#manage-your-license)
15. [Troubleshooting](#troubleshooting)
16. [Privacy](#privacy)
17. [Support](#support)

---

## What is EsperantAI?

EsperantAI is a **web app** that uses artificial intelligence to detect your facial and hand gestures in real time, and translates them into commands for your streaming software. Your camera video is processed locally in your browser.

![EsperantAI local flow](assets/manual/01-esperantai-flow.svg)

It works with these streaming programs:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta/advanced)

It can also receive platform events and combine them with your gestures:

- **Twitch**: direct EventSub WebSocket support.
- **YouTube Live**: direct YouTube Data API v3 support; requires an active live broadcast and available quota.
- **Kick**: supported through the local **Streamer.bot bridge**. Streamer.bot receives Kick through its official integration and EsperantAI listens to those events through local WebSocket.
- **StreamElements**: multi-platform bridge using your account token/JWT.
- **Trovo**: native support through Trovo OAuth + chat WebSocket.

### Why "honest gestures"?

Basic facial expressions and head rotation are **universal across all human cultures** (Paul Ekman, 1972). They don't lie, they don't vary by geography. EsperantAI calls these "🌐 Universal" gestures and distinguishes them from "⚠️ Cultural" gestures (hand signs), whose meaning can vary by country.

You decide which gestures to use based on your audience.

---

## Minimum Requirements

### Hardware

- **Any USB webcam** (recommended: 1080p or higher)
- **CPU**: any 4+ core processor from the last 5 years
- **RAM**: 8 GB minimum. 16 GB recommended if streaming simultaneously.
- **GPU**: any with WebGL support (even modern integrated GPUs work)

### Software

- **OS**: Windows 10/11, macOS 12+, or Linux with recent kernel
- **Browser**: Chrome 90+, Edge 90+, or Firefox 100+
- **Streaming software** (at least one): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Required to **activate your license** and every **7 days** for revalidation
- Works **up to 7 days offline** (grace period)

---

## Purchase & Activation

1. Visit **https://edugame.digital**
2. Click **"Buy License"**
3. Complete payment via LemonSqueezy (card, PayPal, etc.)
4. You'll receive an email with:
   - Your **license key** (format: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Link to use EsperantAI
5. Open EsperantAI in your browser
6. The activation screen will appear. Paste your license key
7. Click **"Activate License"**
8. Done! 🎉

### How many devices?

One license can be activated on **up to 3 devices**. To move your license to another device:

1. On the old device: **Advanced** panel → **License** → **Deactivate on this device**
2. On the new device: activate normally

---

## First Use

### Step 1: Allow camera access

When you open EsperantAI for the first time, your browser will ask for camera permission. **Accept it**.

> Important: EsperantAI never sends your video to any server. Processing is 100% local on your computer.

### Step 2: Select camera

If you have more than one camera, choose which one to use from the camera dropdown.

### Step 3: Verify detection

You'll see your face in the left panel. When EsperantAI detects your face, the Yaw / Pitch / Roll indicators will start showing values.

### Step 4: Calibration Wizard (Pro+)

If you have a Pro or Pro+ license, the **Calibration Wizard** launches automatically on first use. It measures your natural range of motion and sets optimal sensitivity. You can re-run it anytime from the **Recalibrate** button.

---

## Connect Your Streaming Software

![Streaming software connection matrix](assets/manual/02-software-setup.svg)

All connections in this section are local: EsperantAI communicates with the streaming program running on your same computer through `127.0.0.1`.

### OBS Studio

1. In OBS: **Tools → WebSocket Server Settings**
2. Enable the WebSocket server. OBS Studio 28+ already includes obs-websocket.
3. In EsperantAI: **Connection** panel
4. Streaming software: **OBS Studio**
5. WebSocket URL: `ws://127.0.0.1:4455` (default)
6. Password: the one you configured in OBS, if you enabled a password
7. Click **Connect**

### Streamlabs Desktop

1. In Streamlabs: **Settings → Remote Control**
2. Enable Remote Control
3. Copy the **API Token** from the Remote Control screen
4. In EsperantAI: Streaming software: **Streamlabs Desktop**
5. API Token: paste it
6. Port: `59650` (default)
7. Click **Connect**

### vMix

1. In vMix: **Settings → Web Controller**
2. Enable Web Controller. Default port: 8088.
3. In EsperantAI: Streaming software: **vMix**
4. Host: `127.0.0.1`
5. Port: `8088`
6. Click **Connect**

> Note: the current EsperantAI adapter uses vMix's local HTTP API. If you protected Web Controller with network rules or credentials that are not compatible with the browser, the connection may fail.

### PRISM Live Studio

1. Use **PRISM Live Studio v4.0.5+**.
2. Manually install the `obs-websocket` plugin compatible with OBS/PRISM.
3. Copy it to PRISM's plugins folder by following PRISM's official guide for OBS plugins.
4. Restart PRISM
5. Enable WebSocket in **Tools → WebSocket Server Settings**
6. In EsperantAI: Streaming software: **PRISM Live Studio** (works the same as OBS)

> Important difference: OBS 28+ already includes obs-websocket. PRISM requires the plugin to be installed manually.

### XSplit Broadcaster (beta/advanced)

1. Install or enable a local bridge compatible with **XSplit XJS / Remote xjs**.
2. Verify that the bridge exposes a local WebSocket URL.
3. In EsperantAI: Streaming software: **XSplit**
4. Remote xjs Proxy URL: `ws://127.0.0.1:5555/xjs` (default)
5. Click **Connect**

> XSplit is a **beta/advanced** connection. Compatibility depends on the local XJS bridge installed; advanced features may be limited.

---

## Configure Gestures & Scenes

Once connected, your software's actual scenes will appear automatically in the **Triggers** panel dropdowns.

### Basic mapping

1. For each gesture (e.g., "Look Left"), choose a scene from the dropdown
2. When you make that gesture and hold it stable for ~150ms, EsperantAI will switch to that scene in your streaming software
3. The change is automatic and near-instant

### Multi-action (Pro+)

With a Pro or Pro+ license, one gesture can trigger **multiple actions** simultaneously:
- Switch scene + play sound + show overlay + send chat message

### Enable / disable categories

Each category has its own "Enable" checkbox:

- 🧠 **Head rotation** (universal — enabled by default)
- 📏 **Face distance** (move closer/farther)
- 👁️ **Gaze** (move only your eyes)
- 😀 **Emotions** (smile, surprise, anger, neutral)
- 👁️‍🗨️ **Double blink**
- ✋ **Hand gestures** (cultural — disabled by default)

Disable categories you don't need to save CPU.

---

## Gesture Categories

### 🌐 Universal (same meaning in any culture)

| Gesture | Axis | How to activate |
|---|---|---|
| Center | — | Looking straight ahead, face stable |
| Look Left | negative yaw | Turn head to your left |
| Look Right | positive yaw | Turn head to your right |
| Look Up | negative pitch | Raise your face |
| Look Down | positive pitch | Lower your face |
| Tilt Left | negative roll | Tilt head toward left shoulder |
| Tilt Right | positive roll | Tilt head toward right shoulder |
| Move Closer | distance | Move face closer to camera |
| Move Away | distance | Move face away from camera |
| Gaze | gaze | Move only your eyes (head centered) |
| Smiling | emotion=happy | Smile clearly |
| Surprised | emotion=surprise | Look surprised |
| Angry | emotion=angry | Look angry |
| Neutral | emotion=neutral | Relaxed face |
| Double blink | blink | Close both eyes twice quickly (< 700ms) |

### ⚠️ Cultural (meaning varies by country)

| Gesture | Western meaning | Caution in other cultures |
|---|---|---|
| 👍 Thumbs up | Approval | Middle East / West Asia: can be offensive |
| ✌️ Peace | Peace / victory | UK / Ireland / Australia (palm inward): insult |
| 🤘 Rock horns | Rock metal | Italy (palm down): "cornuto" (insult) |
| 👌 OK | OK / perfect | Brazil / Turkey / Germany: can be offensive |
| ✊ Closed fist | Varies by political context | — |
| 🖐️ Open palm | "Stop" or greeting | Greece (mountza toward someone): strong insult |
| ☝️ Pointing | Indicate | Asia: pointing with finger is rude |

EsperantAI marks each gesture with its corresponding badge in the UI. Choose which ones to use based on your global audience.

### 🙏 Gassho (合掌)

A special gesture: press both palms together in front of your chest (like a prayer or greeting bow). Common in East Asian cultures as a sign of respect or gratitude. Detected with high reliability using 6 landmark checks.

---

## Connect Streaming Platforms

For EsperantAI to receive events (donations, subscriptions, raids, follows, or Super Chats), connect the platforms where you stream.

![Platform event status](assets/manual/03-platform-events.svg)

### Twitch

1. Create a Client ID at https://dev.twitch.tv/console
2. Register the redirect URI: `https://edugame.digital/oauth-callback.html` (or your local URL)
3. In EsperantAI: **Platform Events** panel → **Twitch EventSub**
4. Paste your Client ID
5. Click **Connect**
6. A Twitch authorization window will open. Accept the permissions.
7. The window will close and you'll see "Twitch Connected"

EsperantAI uses EventSub WebSocket. Do not paste any Client Secret in the browser.

### YouTube Live

1. Create credentials at https://console.cloud.google.com
2. Enable YouTube Data API v3
3. Create OAuth Client ID (type: Web Application)
4. Register the same redirect URI as Twitch
5. In EsperantAI: **Platform Events** panel → **YouTube Live**
6. Paste your Client ID and click **Connect**

YouTube requirements: you must have an active live broadcast with chat available, and your Google Cloud project must have enough quota to query the chat.

### Kick via Streamer.bot

EsperantAI supports Kick through the **Streamer.bot bridge**. This is the recommended sales-ready route because it does not expose Kick secrets in the browser and does not rely on reverse engineering.

1. Install Streamer.bot 1.0.0 or newer.
2. In Streamer.bot, connect your Kick account.
3. In Streamer.bot: **Servers/Clients -> WebSocket Server** and enable the server.
4. Use `127.0.0.1`, port `8080`, and endpoint `/`, unless you changed those values.
5. In EsperantAI: **Platform Events** panel -> **Kick via Streamer.bot**.
6. Click **Connect**.

Events available through this bridge: follows, subscriptions, resubscriptions, gift subscriptions, and redemptions supported by Streamer.bot. Native official Kick backend/webhooks remain an advanced roadmap item.

### StreamElements (multi-platform bridge)

If you already have a StreamElements account, you can use it as a bridge for alerts from several platforms:

1. Go to https://streamelements.com/dashboard/account/channels
2. Copy your JWT Token
3. In EsperantAI: **Platform Events** panel → **StreamElements**
4. Paste the JWT and click **Connect**

Keep that token private. Treat it like your StreamElements account password.

### Trovo

EsperantAI supports Trovo natively through OAuth and Trovo's official chat WebSocket.

1. Create an app in the Trovo developer portal.
2. Register the EsperantAI redirect URI: `oauth-callback.html` on the same domain where you open the app.
3. In EsperantAI: **Platform Events** panel -> **Trovo**.
4. Paste your Client ID and click **Connect**.
5. Authorize the requested permissions.

Available events: subscriptions, resubscriptions, gift subscriptions, follows, raids, spells/gifts, and magic chat.

---

## Event + Gesture Combos (Advanced)

This is EsperantAI's magic: combining **platform events** with **your gestures** as confirmation.

![Event plus gesture flow](assets/manual/04-event-gesture-combo.svg)

### Example: thank donations with a thumbs up

1. **Event Triggers** panel → "💰 Donation" row
2. ✅ Enable
3. Scene: `Thank_You_Scene`
4. Required gesture: `👍 Thumbs up`

**Live flow**:
- A donation arrives → EsperantAI shows "Waiting for gesture..."
- You have 5 seconds to do 👍
- If you do it → switches to `Thank_You_Scene` + runs any other configured actions
- If you don't → it's automatically dismissed

### No required gesture (auto-trigger)

If you leave "Required gesture" as `— none —`, the event triggers the action immediately.

Useful for:
- Auto-switching to celebration scene when raids arrive
- Auto-showing overlay when someone subscribes

---

## Sensitivity & Dead Zone

### Sensitivity

Thresholds control how large a gesture must be to trigger:

- **Yaw**: how much to turn your head sideways (default: 0.15 rad ≈ 8.6°)
- **Pitch up/down**: vertical tilt
- **Roll**: lateral tilt

Raise values for more exaggerated gestures. Lower for more sensitivity.

### Dead zone (anti-fatigue)

If you're almost centered (yaw < 0.05, pitch < 0.05, roll < 0.08), **NOTHING triggers**. This lets you move naturally without micro-movements activating triggers.

### Stable frames

`Stable frames` = how many consecutive frames the gesture must be held before triggering. Default: 5 frames (~150ms at 30fps).

Raise if triggers are firing too easily. Lower for faster response.

### Cooldown

`Cooldown (ms)` = minimum time between scene changes. Default: 500ms.

Prevents the switcher from being "jittery" if you oscillate quickly.

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Pause / Resume detection |
| `C` | Jump manually to CENTER scene |
| `R` | Reload scene list from software |
| `Esc` | Disconnect |

---

## Trigger History

**Advanced → Trigger History** panel shows the last 50 triggered actions:

- ✓ green = successful
- ✗ red = failed
- · gray = pending

Useful for auditing what triggered without opening DevTools.

**Export CSV**: download history for offline analysis.

**Clear**: erase history (doesn't affect anything else).

---

## Change Language

EsperantAI automatically detects your operating system's language. To change it manually:

- Top right corner: language dropdown
- Select your preferred language
- The UI updates immediately

Available languages:
- 🇺🇸 English
- 🇪🇸 Español (España)
- 🇲🇽 Español (México)
- 🇧🇷 Português (Brasil)
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇯🇵 日本語
- 🇷🇺 Русский
- 🇨🇳 中文
- 🇮🇹 Italiano
- 🇵🇱 Polski
- 🇸🇦 العربية (RTL)
- 🇰🇷 한국어
- 🇮🇳 हिन्दी
- 🇮🇩 Bahasa Indonesia

All 15 languages are translated in the current interface files.

---

## Manage Your License

**Advanced → License** panel:

- **View status**: Valid / Invalid
- **View associated customer email**
- **View last online validation**
- **Deactivate on this device**: use before changing PCs or to free a slot (of the 3 available)

## Troubleshooting

### "Activation required" persists after pasting my license key

- Verify you copied the complete key (5 groups of 4 characters separated by dashes)
- Check your internet connection (activation requires online validation the first time)
- If you already activated on 3 devices, deactivate one first
- Contact soporte@edugame.digital if it persists

### "Searching for face..." persists even though my face is visible

- Improve lighting: your face should be well lit
- Move closer to the camera (40-80 cm is optimal)
- Close other tabs using GPU (Chrome may limit GPU if too many are open)
- If Chrome's Memory Saver is active, disable it for this tab

### Scenes don't appear in dropdowns

- Verify you're connected to the streaming software (green badge "Connected")
- Press `R` to reload the scene list
- If still empty, disconnect and reconnect
- In vMix, confirm that Web Controller is enabled and reachable from `http://127.0.0.1:8088/api/`
- In PRISM, confirm that the obs-websocket plugin is installed and enabled
- In XSplit, confirm that the local XJS bridge is running

### Scene changes trigger without me making gestures

- Raise the yaw / pitch / roll threshold in the **Sensitivity** panel
- Raise `Stable frames` from 5 to 8-10
- Make sure the dead zone is configured (yaw 0.05, pitch 0.05, roll 0.08)
- Check that no one else is in frame (multi-face can cause instability)

### Detection lag

- Close heavy apps (games, video editing)
- Verify you're using the dedicated GPU if you have one (not integrated)
- Reduce camera resolution if it's 4K (1080p is optimal for detection)

### OBS doesn't react even though EsperantAI says "Scene changed"

- Verify the scene name in the dropdown matches EXACTLY the one in OBS (case-sensitive)
- Verify the scene isn't in another Scene Collection
- Check the **Trigger History** panel — if it shows ✗ red, there's a specific error

### Error "OBS unreachable — Connect manually"

- Verify OBS is open
- Verify WebSocket is enabled in OBS
- If you set a password in OBS, it must match exactly
- Some antivirus software blocks port 4455 — add an exception

### Twitch or YouTube won't connect

- Verify that the redirect URI in the platform console exactly matches the URL of `oauth-callback.html`
- Allow pop-ups for the domain where you are using EsperantAI
- In Twitch, use only the Client ID; do not paste a Client Secret
- In YouTube, confirm that YouTube Data API v3 is enabled and that there is an active live broadcast

### Kick does not connect through Streamer.bot

Confirm that Streamer.bot 1.0.0+ is open, Kick is connected inside Streamer.bot, and **WebSocket Server** is enabled. Use `127.0.0.1:8080/` unless you changed the configuration. If Streamer.bot requires a password, enter the same password in EsperantAI.

---

## Privacy

### What EsperantAI does NOT do

- ❌ Does NOT send your video to any server
- ❌ Does NOT store your video or captures
- ❌ Does NOT collect biometric information remotely
- ❌ Does NOT share data with advertisers or third parties

### What it DOES process

- ✅ Local facial detection in your browser (Human.js + WebGL)
- ✅ Local connections to OBS / Streamlabs / vMix / PRISM / XSplit (loopback `127.0.0.1`)
- ✅ Periodic license key validation (every 7 days)
- ✅ If you connect Twitch/YouTube/Kick/StreamElements: platform tokens in local or session browser storage

Full details in `docs/PRIVACY.html`.

---

## Support

- 📧 Email: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Technical docs: https://github.com/salazarjoelo/EsperantAI

Response times:
- General questions: 24-72 hours
- Technical bugs: 1-3 business days

---

*Last updated: 2026-05-20. Version: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
