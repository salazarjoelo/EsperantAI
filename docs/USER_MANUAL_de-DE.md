# EsperantAI — Benutzerhandbuch

> **Ehrliche Gesten.** Steuern Sie Ihre Streaming-Software mit Gesicht und Händen. Kein Stream Deck. Keine zusätzliche Hardware.

**Version**: 3.0 · **Sprache**: Deutsch (Übersetzungen in 12 weiteren Sprachen verfügbar)

---

## Inhaltsverzeichnis

1. [Was ist EsperantAI?](#was-ist-esperantai)
2. [Mindestanforderungen](#mindestanforderungen)
3. [Kauf und Aktivierung](#kauf-und-aktivierung)
4. [Erste Schritte](#erste-schritte)
5. [Streaming-Software verbinden](#streaming-software-verbinden)
6. [Gesten und Szenen konfigurieren](#gesten-und-szenen-konfigurieren)
7. [Gestenkategorien](#gestenkategorien)
8. [Streaming-Plattformen verbinden](#streaming-plattformen-verbinden)
9. [Event + Geste Kombinationen (Fortgeschritten)](#event--geste-kombinationen-fortgeschritten)
10. [Empfindlichkeit und Totzone](#empfindlichkeit-und-totzone)
11. [Tastaturkürzel](#tastaturkürzel)
12. [Trigger-Verlauf](#trigger-verlauf)
13. [Sprache ändern](#sprache-ändern)
14. [Lizenz verwalten](#lizenz-verwalten)
15. [Fehlerbehebung](#fehlerbehebung)
16. [Datenschutz](#datenschutz)
17. [Support](#support)

---

## Was ist EsperantAI?

EsperantAI ist eine **Webanwendung**, die künstliche Intelligenz einsetzt, um Ihre Gesichtsausdrücke und Handgesten in Echtzeit zu erkennen und in Befehle für Ihre Streaming-Software umzusetzt. Kompatibel mit:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (Beta)

Und empfängt Events von Plattformen wie:

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements** (plattformübergreifende Brücke)

### Warum „ehrliche Gesten"?

Grundlegende Gesichtsausdrücke und Kopfdrehungen sind **in allen menschlichen Kulturen universell** (Paul Ekman, 1972). Sie lügen nicht, sie variieren nicht je nach geografischer Herkunft. EsperantAI nennt diese „🌐 Universelle" Gesten und unterscheidet sie von „⚠️ Kulturellen" Gesten (Handzeichen), deren Bedeutung je nach Land variieren kann.

Sie entscheiden, welche Gesten Sie basierend auf Ihrem Publikum verwenden möchten.

---

## Mindestanforderungen

### Hardware

- **Beliebige USB-Webcam** (Empfehlung: 1080p oder höher)
- **CPU**: jeder Prozessor mit 4+ Kernen aus den letzten 5 Jahren
- **RAM**: 8 GB Minimum. 16 GB empfohlen, wenn Sie gleichzeitig streamen.
- **GPU**: jede mit WebGL-Unterstützung (selbst moderne integrierte GPUs funktionieren)

### Software

- **Betriebssystem**: Windows 10/11, macOS 12+ oder Linux mit aktuellem Kernel
- **Browser**: Chrome 90+, Edge 90+ oder Firefox 100+
- **Streaming-Software** (mindestens eine): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Erforderlich zur **Aktivierung Ihrer Lizenz** und alle **7 Tage** zur Revalidierung
- Funktioniert **bis zu 7 Tage offline** (Karenzzeit)

---

## Kauf und Aktivierung

1. Besuchen Sie **https://edugame.digital**
2. Klicken Sie auf **„Buy License"**
3. Schließen Sie die Zahlung über LemonSqueezy ab (Karte, PayPal usw.)
4. Sie erhalten eine E-Mail mit:
   - Ihrem **Lizenzschlüssel** (Format: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Einem Link zur Nutzung von EsperantAI
5. Öffnen Sie EsperantAI in Ihrem Browser
6. Der Aktivierungsbildschirm erscheint. Fügen Sie Ihren Lizenzschlüssel ein
7. Klicken Sie auf **„Activate License"**
8. Fertig! 🎉

### Wie viele Geräte?

Eine Lizenz kann auf **bis zu 3 Geräten** aktiviert werden. So übertragen Sie Ihre Lizenz auf ein anderes Gerät:

1. Auf dem alten Gerät: Panel **Advanced** → **License** → **Deactivate on this device**
2. Auf dem neuen Gerät: normal aktivieren

---

## Erste Schritte

### Schritt 1: Kamerazugriff erlauben

Wenn Sie EsperantAI zum ersten Mal öffnen, fragt Ihr Browser um die Erlaubnis zur Kameranutzung. **Erlauben Sie den Zugriff**.

> Wichtig: EsperantAI sendet Ihr Videobild niemals an einen Server. Die Verarbeitung erfolgt zu 100 % lokal auf Ihrem Computer.

### Schritt 2: Kamera auswählen

Wenn Sie mehr als eine Kamera haben, wählen Sie im Dropdown-Menü die gewünschte Kamera aus.

### Schritt 3: Erkennung überprüfen

Sie sehen Ihr Gesicht im linken Panel. Sobald EsperantAI Ihr Gesicht erkennt, beginnen die Yaw-/Pitch-/Roll-Anzeigen, Werte anzuzeigen.

### Schritt 4: Kalibrierungsassistent (Pro+)

Wenn Sie über eine Pro- oder Pro+-Lizenz verfügen, startet der **Kalibrierungsassistent** automatisch bei der ersten Verwendung. Er misst Ihren natürlichen Bewegungsradius und legt die optimale Empfindlichkeit fest. Sie können ihn jederzeit über die Schaltfläche **Recalibrate** erneut starten.

---

## Streaming-Software verbinden

### OBS Studio

1. In OBS: **Tools → WebSocket Server Settings**
2. Aktivieren Sie WebSocket. Notieren Sie sich das Passwort, falls Sie eines vergeben haben.
3. In EsperantAI: Panel **Connection**
4. Streaming-Software: **OBS Studio**
5. WebSocket-URL: `ws://127.0.0.1:4455` (Standard)
6. Passwort: das in OBS vergebene Passwort
7. Klicken Sie auf **Connect**

### Streamlabs Desktop

1. In Streamlabs: **Settings → Remote Control**
2. Aktivieren Sie Remote Control
3. Notieren Sie sich den API Token
4. In EsperantAI: Streaming-Software: **Streamlabs Desktop**
5. API Token: einfügen
6. Port: `59650` (Standard)
7. Klicken Sie auf **Connect**

### vMix

1. In vMix: **Settings → Web Controller**
2. Aktivieren Sie den Web Controller. Standard-Port: 8088.
3. In EsperantAI: Streaming-Software: **vMix**
4. Host: `127.0.0.1`
5. Port: `8088`
6. Klicken Sie auf **Connect**

### PRISM Live Studio

1. PRISM Live Studio v4.0.5+ erfordert die manuelle Installation des obs-websocket-Plugins
2. Laden Sie `obs-websocket` aus dem [OBS-Forum](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/) herunter
3. Kopieren Sie es in den Plugin-Ordner von PRISM
4. Starten Sie PRISM neu
5. Aktivieren Sie WebSocket unter **Tools → WebSocket Server Settings**
6. In EsperantAI: Streaming-Software: **PRISM Live Studio** (funktioniert wie OBS)

### XSplit Broadcaster (Beta)

1. Installieren Sie die Erweiterung „Remote xjs" in XSplit (Settings → Extensions)
2. Aktivieren Sie Remote in den Einstellungen
3. In EsperantAI: Streaming-Software: **XSplit**
4. Remote-xjs-Proxy-URL: `ws://127.0.0.1:5555/xjs` (Standard)
5. Klicken Sie auf **Connect**

> XSplit befindet sich in der **Beta-Phase**. Erweiterte Funktionen können eingeschränkt sein.

---

## Gesten und Szenen konfigurieren

Sobald die Verbindung hergestellt ist, werden die tatsächlichen Szenen Ihrer Software automatisch in den Dropdown-Menüs des Panels **Triggers** angezeigt.

### Grundlegende Zuordnung

1. Wählen Sie für jede Geste (z. B. „Look Left") eine Szene aus dem Dropdown-Menü
2. Wenn Sie die Geste ausführen und etwa 150 ms stabil halten, wechselt EsperantAI zu dieser Szene in Ihrer Streaming-Software
3. Der Wechsel erfolgt automatisch und nahezu augenblicklich

### Mehrfachaktion (Pro+)

Mit einer Pro- oder Pro+-Lizenz kann eine einzige Geste **mehrere Aktionen** gleichzeitig auslösen:
- Szene wechseln + Ton abspielen + Overlay einblenden + Chat-Nachricht senden

### Kategorien aktivieren / deaktivieren

Jede Kategorie hat ein eigenes Kontrollkästchen „Enable":

- 🧠 **Kopfdrehung** (universell — standardmäßig aktiviert)
- 📏 **Gesichtsdistanz** (näher/weiter bewegen)
- 👁️ **Blickrichtung** (nur die Augen bewegen)
- 😀 **Emotionen** (Lächeln, Überraschung, Wut, neutral)
- 👁️‍🗨️ **Doppelblinzeln**
- ✋ **Handgesten** (kulturell — standardmäßig deaktiviert)

Deaktivieren Sie Kategorien, die Sie nicht benötigen, um CPU-Ressourcen zu sparen.

---

## Gestenkategorien

### 🌐 Universell (gleiche Bedeutung in jeder Kultur)

| Geste | Achse | Wie aktivieren |
|---|---|---|
| Mitte | — | Geradeaus schauen, Gesicht stabil |
| Nach links schauen | negativer Yaw | Kopf nach links drehen |
| Nach rechts schauen | positiver Yaw | Kopf nach rechts drehen |
| Nach oben schauen | negativer Pitch | Gesicht heben |
| Nach unten schauen | positiver Pitch | Gesicht senken |
| Nach links neigen | negativer Roll | Kopf zur linken Schulter neigen |
| Nach rechts neigen | positiver Roll | Kopf zur rechten Schulter neigen |
| Näherkommen | Distanz | Gesicht näher an die Kamera bewegen |
| Entfernen | Distanz | Gesicht von der Kamera weg bewegen |
| Blickrichtung | Blick | Nur die Augen bewegen (Kopf zentriert) |
| Lächeln | Emotion=glücklich | Deutlich lächeln |
| Überrascht | Emotion=überrascht | Überrascht schauen |
| Wütend | Emotion=wütend | Wütend schauen |
| Neutral | Emotion=neutral | Entspanntes Gesicht |
| Doppelblinzeln | Blinzeln | Beide Augen zweimal schnell schließen (< 700 ms) |

### ⚠️ Kulturell (Bedeutung variiert je nach Land)

| Geste | Westliche Bedeutung | Vorsicht in anderen Kulturen |
|---|---|---|
| 👍 Daumen hoch | Zustimmung | Naher Osten / Westasien: kann beleidigend sein |
| ✌️ Friedenszeichen | Frieden / Sieg | UK / Irland / Australien (Handfläche nach innen): Beleidigung |
| 🤘 Metalhörner | Rock/Metal | Italien (Handfläche nach unten): „Cornuto" (Beleidigung) |
| 👌 OK | OK / perfekt | Brasilien / Türkei / Deutschland: kann beleidigend sein |
| ✊ Geschlossene Faust | Variiert je nach politischem Kontext | — |
| 🖐️ Offene Handfläche | „Stopp" oder Begrüßung | Griechenland (Mountza auf jemanden gerichtet): schwere Beleidigung |
| ☝️ Zeigen | Hinweisen | Asien: Mit dem Finger zu deuten ist unhöflich |

EsperantAI markiert jede Geste in der Benutzeroberfläche mit dem entsprechenden Badge. Wählen Sie basierend auf Ihrem weltweiten Publikum, welche Sie verwenden möchten.

### 🙏 Gassho (合掌)

Eine besondere Geste: pressen Sie beide Handflächen vor Ihrer Brust zusammen (wie bei einem Gebet oder einer Verbeugung). In ostasiatischen Kulturen verbreitet als Zeichen des Respekts oder der Dankbarkeit. Wird mit hoher Zuverlässigkeit anhand von 6 Landmark-Prüfungen erkannt.

---

## Streaming-Plattformen verbinden

Damit EsperantAI Events empfangen kann (Spenden, Abos, Raids), verbinden Sie die Plattformen, auf denen Sie streamen.

### Twitch

1. Erstellen Sie eine Client ID auf https://dev.twitch.tv/console
2. Registrieren Sie die Redirect-URI: `https://edugame.digital/oauth-callback.html` (oder Ihre lokale URL)
3. In EsperantAI: Panel **Platform Events** → **Twitch EventSub**
4. Fügen Sie Ihre Client ID ein
5. Klicken Sie auf **Connect**
6. Ein Twitch-Autorisierungsfenster wird geöffnet. Akzeptieren Sie die Berechtigungen.
7. Das Fenster schließt sich und Sie sehen „Twitch Connected"

### YouTube Live

1. Erstellen Sie Anmeldeinformationen auf https://console.cloud.google.com
2. Aktivieren Sie die YouTube Data API v3
3. Erstellen Sie eine OAuth Client ID (Typ: Web Application)
4. Registrieren Sie dieselbe Redirect-URI wie bei Twitch
5. In EsperantAI: Panel **Platform Events** → **YouTube Live**
6. Fügen Sie Ihre Client ID ein und klicken Sie auf **Connect**

### Kick

1. Erstellen Sie eine App auf https://kick.com/settings/developer
2. Registrieren Sie die Redirect-URI
3. In EsperantAI: Panel **Platform Events** → **Kick**
4. Fügen Sie Ihre Client ID ein und klicken Sie auf **Connect**
5. Kick verwendet OAuth 2.1 mit PKCE (sicherer)

### StreamElements (plattformübergreifende Brücke)

Wenn Sie bereits ein StreamElements-Konto haben, können Sie Twitch + YouTube + Facebook mit einem einzigen Token vereinen:

1. Gehen Sie zu https://streamelements.com/dashboard/account/channels
2. Kopieren Sie Ihr JWT Token
3. In EsperantAI: Panel **Platform Events** → **StreamElements**
4. Fügen Sie das JWT ein und klicken Sie auf **Connect**

---

## Event + Geste Kombinationen (Fortgeschritten)

Das ist die Magie von EsperantAI: **Plattform-Events** mit **Ihren Gesten** als Bestätigung kombinieren.

### Beispiel: Spenden mit Daumen hoch danken

1. Panel **Event Triggers** → Zeile „💰 Donation"
2. ✅ Aktivieren
3. Szene: `Thank_You_Scene`
4. Erforderliche Geste: `👍 Thumbs up`

**Ablauf live**:
- Eine Spende geht ein → EsperantAI zeigt „Waiting for gesture..."
- Sie haben 5 Sekunden Zeit, 👍 zu zeigen
- Wenn Sie es tun → Wechsel zu `Thank_You_Scene` + Ausführung aller weiteren konfigurierten Aktionen
- Wenn nicht → wird automatisch verworfen

### Ohne erforderliche Geste (automatischer Trigger)

Wenn Sie „Required gesture" auf `— none —` belassen, löst das Event die Aktion sofort aus.

Nützlich für:
- Automatischen Wechsel zur Feierszene bei eintreffenden Raids
- Automatisches Einblenden eines Overlays, wenn jemand ein Abo abschließt

---

## Empfindlichkeit und Totzone

### Empfindlichkeit

Schwellenwerte steuern, wie ausgeprägt eine Geste sein muss, um auszulösen:

- **Yaw**: wie weit der Kopf zur Seite gedreht wird (Standard: 0,15 rad ≈ 8,6°)
- **Pitch auf/ab**: vertikale Neigung
- **Roll**: seitliche Neigung

Erhöhen Sie die Werte für ausdrucksstärkere Gesten. Verringern Sie sie für höhere Empfindlichkeit.

### Totzone (Anti-Ermüdung)

Wenn Sie fast zentriert sind (Yaw < 0,05, Pitch < 0,05, Roll < 0,08), wird **NICHTS ausgelöst**. So können Sie sich natürlich bewegen, ohne dass Mikrobewegungen Trigger aktivieren.

### Stabile Frames

`Stable frames` = wie viele aufeinanderfolgende Frames die Geste gehalten werden muss, bevor sie auslöst. Standard: 5 Frames (~150 ms bei 30 fps).

Erhöhen, wenn Trigger zu leicht auslösen. Verringern für schnellere Reaktion.

### Abklingzeit

`Cooldown (ms)` = Mindestzeit zwischen Szenenwechseln. Standard: 500 ms.

Verhindert, dass der Szenenwechsler „zappelt", wenn Sie schnell hin- und herwechseln.

---

## Tastaturkürzel

| Taste | Aktion |
|---|---|
| `Leertaste` | Erkennung pausieren / fortsetzen |
| `C` | Manuell zur CENTER-Szene wechseln |
| `R` | Szenenliste aus der Software neu laden |
| `Esc` | Verbindung trennen |

---

## Trigger-Verlauf

Das Panel **Advanced → Trigger History** zeigt die letzten 50 ausgelösten Aktionen:

- ✓ grün = erfolgreich
- ✗ rot = fehlgeschlagen
- · grau = ausstehend

Nützlich, um nachzuvollziehen, was ausgelöst wurde, ohne die DevTools zu öffnen.

**Export CSV**: Verlauf für Offline-Analyse herunterladen.

**Clear**: Verlauf löschen (hat keine Auswirkungen auf andere Einstellungen).

---

## Sprache ändern

EsperantAI erkennt automatisch die Sprache Ihres Betriebssystems. So ändern Sie sie manuell:

- Obere rechte Ecke: Sprach-Dropdown
- Wählen Sie Ihre bevorzugte Sprache
- Die Benutzeroberfläche wird sofort aktualisiert

Verfügbare Sprachen:
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

Alle 13 Sprachen sind vollständig übersetzt (342 Schlüssel je Sprache).

---

## Lizenz verwalten

Panel **Advanced → License**:

- **Status anzeigen**: Gültig / Ungültig
- **Zugehörige Kunden-E-Mail anzeigen**
- **Letzte Online-Validierung anzeigen**
- **Deactivate on this device**: verwenden Sie dies vor einem PC-Wechsel oder um einen Platz freizugeben (von den 3 verfügbaren)

### Erstattung

Wenn EsperantAI nicht Ihren Erwartungen entspricht, haben Sie **14 Tage** ab dem Kauf Anspruch auf volle Rückerstattung. Senden Sie eine E-Mail an soporte@edugame.digital mit Ihrem Lizenzschlüssel.

---

## Fehlerbehebung

### „Activation required" bleibt bestehen, nachdem ich meinen Lizenzschlüssel eingefügt habe

- Überprüfen Sie, ob Sie den vollständigen Schlüssel kopiert haben (5 Gruppen zu je 4 Zeichen, getrennt durch Bindestriche)
- Überprüfen Sie Ihre Internetverbindung (die Aktivierung erfordert beim ersten Mal eine Online-Validierung)
- Wenn Sie bereits auf 3 Geräten aktiviert haben, deaktivieren Sie zuerst eines
- Kontaktieren Sie soporte@edugame.digital, falls das Problem weiterhin besteht

### „Searching for face..." bleibt bestehen, obwohl mein Gesicht sichtbar ist

- Verbessern Sie die Beleuchtung: Ihr Gesicht sollte gut ausgeleuchtet sein
- Nähern Sie sich der Kamera (40–80 cm sind optimal)
- Schließen Sie andere Tabs, die die GPU nutzen (Chrome kann die GPU begrenzen, wenn zu viele Tabs geöffnet sind)
- Wenn Chromes Memory Saver aktiv ist, deaktivieren Sie ihn für diesen Tab

### Szenen erscheinen nicht in den Dropdown-Menüs

- Überprüfen Sie, ob die Verbindung zur Streaming-Software besteht (grünes Badge „Connected")
- Drücken Sie `R`, um die Szenenliste neu zu laden
- Wenn weiterhin leer, Verbindung trennen und erneut herstellen

### Szenenwechsel werden ausgelöst, ohne dass ich Gesten mache

- Erhöhen Sie den Yaw-/Pitch-/Roll-Schwellenwert im Panel **Sensitivity**
- Erhöhen Sie `Stable frames` von 5 auf 8–10
- Stellen Sie sicher, dass die Totzone konfiguriert ist (Yaw 0,05, Pitch 0,05, Roll 0,08)
- Prüfen Sie, ob keine andere Person im Bild ist (mehrere Gesichter können Instabilität verursachen)

### Erkennungsverzögerung

- Schließen Sie ressourcenintensive Anwendungen (Spiele, Videoschnitt)
- Überprüfen Sie, ob Sie die dedizierte GPU verwenden, falls vorhanden (nicht die integrierte)
- Reduzieren Sie die Kameraauflösung, falls sie 4K beträgt (1080p ist optimal für die Erkennung)

### OBS reagiert nicht, obwohl EsperantAI „Scene changed" anzeigt

- Überprüfen Sie, ob der Szenenname im Dropdown exakt mit dem in OBS übereinstimmt (Groß-/Kleinschreibung beachten)
- Stellen Sie sicher, dass die Szene nicht in einer anderen Szenensammlung liegt
- Prüfen Sie das Panel **Trigger History** — wenn ✗ rot angezeigt wird, liegt ein spezifischer Fehler vor

### Fehler „OBS unreachable — Connect manually"

- Überprüfen Sie, ob OBS geöffnet ist
- Überprüfen Sie, ob WebSocket in OBS aktiviert ist
- Falls Sie in OBS ein Passwort vergeben haben, muss es exakt übereinstimmen
- Manche Antivirenprogramme blockieren Port 4455 — fügen Sie eine Ausnahme hinzu

---

## Datenschutz

### Was EsperantAI NICHT tut

- ❌ Sendet Ihr Videobild NICHT an einen Server
- ❌ Speichert Ihr Video oder Aufnahmen NICHT
- ❌ Erhebt KEINE biometrischen Informationen remote
- ❌ Teilt KEINE Daten mit Werbetreibenden oder Dritten

### Was ES verarbeitet

- ✅ Lokale Gesichtserkennung in Ihrem Browser (Human.js + WebGL)
- ✅ Lokale Verbindungen zu OBS / Streamlabs / vMix (Loopback 127.0.0.1)
- ✅ Periodische Lizenzschlüssel-Validierung (alle 7 Tage)
- ✅ Wenn Sie Twitch/YouTube/Kick verbinden: OAuth-Token im sessionStorage (werden beim Schließen des Browsers gelöscht)

Vollständige Details in `docs/PRIVACY.html`.

---

## Support

- 📧 E-Mail: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Technische Dokumentation: https://github.com/salazarjoelo/EsperantAI

Reaktionszeiten:
- Allgemeine Fragen: 24–72 Stunden
- Technische Fehler: 1–3 Werktage
- Erstattungsanfragen: 1–2 Werktage

---

*Letzte Aktualisierung: 2026-05-14. Version: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
