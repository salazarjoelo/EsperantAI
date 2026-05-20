# EsperantAI — Benutzerhandbuch

> **Ehrliche Gesten.** Steuern Sie Ihre Streaming-Software mit Gesicht und Händen, ohne zusätzliche Spezialhardware.

**Version**: 3.0 · **Sprache**: Deutsch (Übersetzungen in 14 weiteren Sprachen verfügbar)

**Technische Validierung**: geprüft gegen die zum **20. Mai 2026** verfügbare offizielle Dokumentation für OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit, Twitch, YouTube Live, Kick, Trovo und StreamElements. Details: [`docs/MANUAL_PLATFORM_AUDIT_2026-05.md`](MANUAL_PLATFORM_AUDIT_2026-05.md).

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

EsperantAI ist eine **Webanwendung**, die mit künstlicher Intelligenz Ihre Gesichtsgesten und Handgesten in Echtzeit erkennt und in Befehle für Ihre Streaming-Software übersetzt. Das Videobild Ihrer Kamera wird lokal in Ihrem Browser verarbeitet.

![Lokaler Ablauf von EsperantAI](assets/manual/01-esperantai-flow.svg)

EsperantAI funktioniert mit diesen Streaming-Programmen:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (Beta)

Außerdem kann EsperantAI Plattform-Events empfangen und mit Ihren Gesten kombinieren:

- **Twitch**: direkte Unterstützung über EventSub WebSocket.
- **YouTube Live**: direkte Unterstützung über YouTube Data API v3; erfordert einen aktiven Livestream und verfügbare API-Quota.
- **Kick**: Beta/eingeschränkte Unterstützung im Browser. Für vollständige Kick-Events ist ein offizieller Backend/Webhook oder eine Bridge erforderlich.
- **StreamElements**: plattformübergreifende Bridge mit Token/JWT Ihres Kontos.
- **Trovo**: ein technischer Adapter existiert im Code, aber das öffentliche Verbindungspanel ist in der aktuellen Oberfläche noch nicht freigeschaltet.

### Warum „ehrliche Gesten“?

Grundlegende Gesichtsausdrücke und Kopfdrehungen sind **in allen menschlichen Kulturen universell** (Paul Ekman, 1972). Sie lügen nicht und ändern ihre Bedeutung nicht je nach Geografie. EsperantAI nennt diese Gesten „🌐 Universell“ und unterscheidet sie von „⚠️ Kulturell“ markierten Gesten (Handzeichen), deren Bedeutung je nach Land variieren kann.

Sie entscheiden, welche Gesten zu Ihrem Publikum passen.

---

## Mindestanforderungen

### Hardware

- **Beliebige USB-Webcam** (empfohlen: 1080p oder höher)
- **CPU**: beliebiger Prozessor mit 4+ Kernen aus den letzten 5 Jahren
- **RAM**: mindestens 8 GB. 16 GB empfohlen, wenn Sie gleichzeitig streamen.
- **GPU**: jede GPU mit WebGL-Unterstützung; auch moderne integrierte GPUs funktionieren.

### Software

- **Betriebssystem**: Windows 10/11, macOS 12+ oder Linux mit aktuellem Kernel
- **Browser**: Chrome 90+, Edge 90+ oder Firefox 100+
- **Streaming-Software** (mindestens eine): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Erforderlich zur **Aktivierung Ihrer Lizenz** und danach alle **7 Tage** zur erneuten Validierung
- Funktioniert **bis zu 7 Tage offline** (Karenzzeit)

---

## Kauf und Aktivierung

1. Besuchen Sie **https://edugame.digital**
2. Klicken Sie auf **„Lizenz kaufen“**
3. Schließen Sie die Zahlung über LemonSqueezy ab (Karte, PayPal usw.)
4. Sie erhalten eine E-Mail mit:
   - Ihrem **Lizenzschlüssel** (Format: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - dem Link zur Nutzung von EsperantAI
5. Öffnen Sie EsperantAI in Ihrem Browser
6. Der Aktivierungsbildschirm erscheint. Fügen Sie Ihren Lizenzschlüssel ein
7. Klicken Sie auf **„Lizenz aktivieren“**
8. Fertig! 🎉

### Wie viele Geräte?

Eine Lizenz kann auf **bis zu 3 Geräten** aktiviert werden. So übertragen Sie Ihre Lizenz auf ein anderes Gerät:

1. Auf dem alten Gerät: Panel **Erweitert** → **Lizenz** → **Auf diesem Gerät deaktivieren**
2. Auf dem neuen Gerät: normal aktivieren

---

## Erste Schritte

### Schritt 1: Kamerazugriff erlauben

Wenn Sie EsperantAI zum ersten Mal öffnen, fragt Ihr Browser nach der Erlaubnis, auf die Kamera zuzugreifen. **Erlauben Sie den Zugriff**.

> Wichtig: EsperantAI sendet Ihr Videobild niemals an einen Server. Die Verarbeitung erfolgt zu 100 % lokal auf Ihrem Gerät.

### Schritt 2: Kamera auswählen

Wenn Sie mehr als eine Kamera haben, wählen Sie im Kamera-Dropdown die gewünschte Kamera aus.

### Schritt 3: Erkennung prüfen

Sie sehen Ihr Gesicht im linken Panel. Sobald EsperantAI Ihr Gesicht erkennt, zeigen die Yaw-/Pitch-/Roll-Anzeigen Werte an.

### Schritt 4: Kalibrierungsassistent (Pro+)

Wenn Sie eine Pro- oder Pro+-Lizenz haben, startet der **Kalibrierungsassistent** beim ersten Gebrauch automatisch. Er misst Ihren natürlichen Bewegungsbereich und stellt die passende Empfindlichkeit ein. Sie können ihn jederzeit über **Neu kalibrieren** erneut ausführen.

---

## Streaming-Software verbinden

![Verbindungsmatrix für Streaming-Software](assets/manual/02-software-setup.svg)

Alle Verbindungen in diesem Abschnitt sind lokal: EsperantAI kommuniziert mit dem Streaming-Programm auf demselben Computer über `127.0.0.1`.

### OBS Studio

1. In OBS: **Tools → WebSocket Server Settings**
2. Aktivieren Sie den WebSocket-Server. OBS Studio 28+ enthält obs-websocket bereits.
3. In EsperantAI: Panel **Verbindung**
4. Streaming-Software: **OBS Studio**
5. WebSocket-URL: `ws://127.0.0.1:4455` (Standard)
6. Passwort: das Passwort aus OBS, falls Sie dort eines aktiviert haben
7. Klicken Sie auf **Verbinden**

### Streamlabs Desktop

1. In Streamlabs Desktop: **Settings → Remote Control**
2. Aktivieren Sie die lokale Fernsteuerung
3. Kopieren Sie den **API Token** aus dem Remote-Control-Bildschirm
4. In EsperantAI: Streaming-Software: **Streamlabs Desktop**
5. API Token: einfügen
6. Port: `59650` (Standard)
7. Klicken Sie auf **Verbinden**

### vMix

1. In vMix: **Settings → Web Controller**
2. Aktivieren Sie den Web Controller. Standard-Port: `8088`.
3. In EsperantAI: Streaming-Software: **vMix**
4. Host: `127.0.0.1`
5. Port: `8088`
6. Klicken Sie auf **Verbinden**

> Hinweis: Der aktuelle EsperantAI-Adapter nutzt die lokale HTTP-API von vMix. Wenn Sie den Web Controller durch Netzwerkregeln oder Browser-inkompatible Zugangsdaten schützen, kann die Verbindung fehlschlagen.

### PRISM Live Studio

1. Verwenden Sie **PRISM Live Studio v4.0.5+**.
2. Installieren Sie manuell das mit OBS/PRISM kompatible Plugin `obs-websocket`.
3. Kopieren Sie es gemäß der offiziellen PRISM-Anleitung für OBS-Plugins in den Plugin-Ordner von PRISM.
4. Starten Sie PRISM neu
5. Aktivieren Sie WebSocket unter **Tools → WebSocket Server Settings**
6. In EsperantAI: Streaming-Software: **PRISM Live Studio** (funktioniert wie OBS)

> Wichtiger Unterschied: OBS 28+ enthält obs-websocket bereits. PRISM benötigt das manuell installierte Plugin.

### XSplit Broadcaster (Beta)

1. Installieren oder aktivieren Sie eine kompatible lokale Bridge für **XSplit XJS / Remote xjs**.
2. Prüfen Sie, dass die Bridge eine lokale WebSocket-URL bereitstellt.
3. In EsperantAI: Streaming-Software: **XSplit**
4. Remote-xjs-Proxy-URL: `ws://127.0.0.1:5555/xjs` (Standard)
5. Klicken Sie auf **Verbinden**

> XSplit ist **Beta/Advanced**. Die Kompatibilität hängt von der installierten lokalen XJS-Remote-Bridge ab; erweiterte Funktionen können eingeschränkt sein.

---

## Gesten und Szenen konfigurieren

Nach dem Verbinden erscheinen die echten Szenen Ihrer Streaming-Software automatisch in den Dropdown-Menüs des Panels **Trigger**.

### Grundlegende Zuordnung

1. Wählen Sie für jede Geste (z. B. „Nach links schauen“) eine Szene aus dem Dropdown-Menü
2. Wenn Sie die Geste ausführen und etwa 150 ms stabil halten, wechselt EsperantAI in Ihrer Streaming-Software zu dieser Szene
3. Der Wechsel erfolgt automatisch und nahezu sofort

### Mehrfachaktion (Pro+)

Mit einer Pro- oder Pro+-Lizenz kann eine Geste **mehrere Aktionen** gleichzeitig auslösen:
- Szene wechseln + Ton abspielen + Overlay anzeigen + Chat-Nachricht senden

### Kategorien aktivieren / deaktivieren

Jede Kategorie hat ein eigenes Kontrollkästchen **Aktivieren**:

- 🧠 **Kopfdrehung** (universell — standardmäßig aktiviert)
- 📏 **Gesichtsdistanz** (näher an die Kamera oder weiter weg)
- 👁️ **Blickrichtung** (nur die Augen bewegen)
- 😀 **Emotionen** (Lächeln, Überraschung, Wut, neutral)
- 👁️‍🗨️ **Doppelblinzeln**
- ✋ **Handgesten** (kulturell — standardmäßig deaktiviert)

Deaktivieren Sie Kategorien, die Sie nicht benötigen, um CPU zu sparen.

---

## Gestenkategorien

### 🌐 Universell (gleiche Bedeutung in jeder Kultur)

| Geste | Achse | Wie aktivieren |
|---|---|---|
| Mitte | — | Geradeaus schauen, Gesicht stabil |
| Nach links schauen | negativer Yaw | Drehen Sie den Kopf nach links |
| Nach rechts schauen | positiver Yaw | Drehen Sie den Kopf nach rechts |
| Nach oben schauen | negativer Pitch | Heben Sie das Gesicht an |
| Nach unten schauen | positiver Pitch | Senken Sie das Gesicht |
| Nach links neigen | negativer Roll | Neigen Sie den Kopf zur linken Schulter |
| Nach rechts neigen | positiver Roll | Neigen Sie den Kopf zur rechten Schulter |
| Näherkommen | Distanz | Gehen Sie näher an die Kamera |
| Entfernen | Distanz | Gehen Sie weiter weg von der Kamera |
| Blickrichtung | Blick | Bewegen Sie nur die Augen (Kopf zentriert) |
| Lächeln | Emotion=glücklich | Lächeln Sie deutlich |
| Überrascht | Emotion=Überraschung | Zeigen Sie Überraschung |
| Wütend | Emotion=Wut | Zeigen Sie Wut |
| Neutral | Emotion=neutral | Entspanntes Gesicht |
| Doppelblinzeln | Blinzeln | Schließen Sie beide Augen zweimal schnell (< 700 ms) |

### ⚠️ Kulturell (Bedeutung variiert je nach Land)

| Geste | Westliche Bedeutung | Vorsicht in anderen Kulturen |
|---|---|---|
| 👍 Daumen hoch | Zustimmung | Naher Osten / Westasien: kann beleidigend sein |
| ✌️ Friedenszeichen | Frieden / Sieg | Vereinigtes Königreich / Irland / Australien (Handfläche nach innen): Beleidigung |
| 🤘 Rock-Hörner | Rock / Metal | Italien (Handfläche nach unten): „cornuto“ (Beleidigung) |
| 👌 OK | OK / perfekt | Brasilien / Türkei / Deutschland: kann beleidigend sein |
| ✊ Geschlossene Faust | Variiert je nach politischem Kontext | — |
| 🖐️ Offene Handfläche | „Stopp“ oder Begrüßung | Griechenland (Mountza gegen jemanden): schwere Beleidigung |
| ☝️ Zeigen | Hinweisen | In Asien gilt das Zeigen mit dem Finger als unhöflich |

EsperantAI kennzeichnet jede Geste in der Oberfläche mit dem passenden Badge. Wählen Sie die Gesten danach aus, welches internationale Publikum Sie erreichen.

### 🙏 Gassho (合掌)

Eine besondere Geste: Legen Sie beide Handflächen vor der Brust zusammen (wie bei einem Gebet oder einer respektvollen Verbeugung). In ostasiatischen Kulturen ist sie als Zeichen von Respekt oder Dankbarkeit verbreitet. EsperantAI erkennt sie mit hoher Zuverlässigkeit anhand von 6 Landmark-Prüfungen.

---

## Streaming-Plattformen verbinden

Damit EsperantAI Events empfangen kann (Spenden, Abos, Raids, Follows oder Super Chats), verbinden Sie die Plattformen, auf denen Sie streamen.

![Event-Status nach Plattform](assets/manual/03-platform-events.svg)

### Twitch

1. Erstellen Sie eine Client ID unter https://dev.twitch.tv/console
2. Registrieren Sie die Redirect-URI: `https://edugame.digital/oauth-callback.html` (oder Ihre lokale URL)
3. In EsperantAI: Panel **Plattform-Events** → **Twitch EventSub**
4. Fügen Sie Ihre Client ID ein
5. Klicken Sie auf **Verbinden**
6. Ein Twitch-Autorisierungsfenster öffnet sich. Akzeptieren Sie die Berechtigungen.
7. Das Fenster schließt sich und Sie sehen „Twitch verbunden“

EsperantAI verwendet EventSub WebSocket. Fügen Sie niemals ein Client Secret im Browser ein.

### YouTube Live

1. Erstellen Sie Zugangsdaten unter https://console.cloud.google.com
2. Aktivieren Sie die YouTube Data API v3
3. Erstellen Sie eine OAuth Client ID (Typ: Webanwendung)
4. Registrieren Sie dieselbe Redirect-URI wie bei Twitch
5. In EsperantAI: Panel **Plattform-Events** → **YouTube Live**
6. Fügen Sie Ihre Client ID ein und klicken Sie auf **Verbinden**

YouTube-Anforderungen: Sie müssen einen aktiven Livestream mit verfügbarem Chat haben, und Ihr Google-Cloud-Projekt muss über ausreichende Quota für Chat-Abfragen verfügen.

### Kick

1. Erstellen Sie eine Anwendung im Entwicklerportal von Kick.
2. Registrieren Sie die Redirect-URI
3. In EsperantAI: Panel **Plattform-Events** → **Kick**
4. Fügen Sie Ihre Client ID ein und klicken Sie auf **Verbinden**
5. Kick verwendet OAuth 2.1 mit PKCE.

Aktueller Status: **Beta/eingeschränkt**. Die offizielle Kick-Dokumentation nutzt Webhooks für vollständige Events. Im Browser kann EsperantAI nur einen eingeschränkten Teil der Aktivität erkennen; für Abos, Geschenke, Raids oder zuverlässige Kick-Events verwenden Sie eine Bridge wie StreamElements oder ein eigenes Backend/Webhook.

### StreamElements (plattformübergreifende Bridge)

Wenn Sie bereits ein StreamElements-Konto haben, können Sie StreamElements als Bridge für Alerts mehrerer Plattformen verwenden:

1. Gehen Sie zu https://streamelements.com/dashboard/account/channels
2. Kopieren Sie Ihren JWT Token
3. In EsperantAI: Panel **Plattform-Events** → **StreamElements**
4. Fügen Sie das JWT ein und klicken Sie auf **Verbinden**

Halten Sie diesen Token privat. Behandeln Sie ihn wie das Passwort Ihres StreamElements-Kontos.

### Trovo

EsperantAI enthält im Code einen technischen Trovo-Adapter, der auf OAuth und dem WebSocket-Chatdienst von Trovo basiert. In der aktuellen öffentlichen Oberfläche gibt es jedoch noch kein Trovo-Verbindungspanel; deshalb wird Trovo nicht als normaler Benutzerfluss dokumentiert. Wenn Sie Trovo jetzt benötigen, verwenden Sie eine kompatible Bridge oder warten Sie, bis das Trovo-Panel freigeschaltet wird.

---

## Event + Geste Kombinationen (Fortgeschritten)

Das ist die Stärke von EsperantAI: **Plattform-Events** mit **Ihren Gesten** als Bestätigung kombinieren.

![Ablauf von Event plus Geste](assets/manual/04-event-gesture-combo.svg)

### Beispiel: Spenden mit Daumen hoch danken

1. Panel **Event-Trigger** → Zeile „💰 Spende“
2. ✅ Aktivieren
3. Szene: `Szene_Danke`
4. Erforderliche Geste: `👍 Daumen hoch`

**Live-Ablauf**:
- Eine Spende geht ein → EsperantAI zeigt „Warte auf Geste...“
- Sie haben 5 Sekunden Zeit für 👍
- Wenn Sie die Geste ausführen → Wechsel zu `Szene_Danke` + Ausführung aller weiteren konfigurierten Aktionen
- Wenn nicht → der Event wird automatisch verworfen

### Ohne erforderliche Geste (automatischer Trigger)

Wenn Sie **Erforderliche Geste** auf `— keine —` lassen, löst der Event die Aktion sofort aus.

Nützlich für:
- Automatisch zur Feierszene wechseln, wenn Raids eintreffen
- Automatisch ein Overlay anzeigen, wenn jemand ein Abo abschließt

---

## Empfindlichkeit und Totzone

### Empfindlichkeit

Schwellenwerte steuern, wie groß eine Geste sein muss, damit sie auslöst:

- **Yaw**: wie weit Sie den Kopf seitlich drehen müssen (Standard: 0,15 rad ≈ 8,6°)
- **Pitch nach oben/unten**: vertikale Neigung
- **Roll**: seitliche Neigung

Erhöhen Sie die Werte für deutlichere Gesten. Verringern Sie sie für höhere Empfindlichkeit.

### Totzone (gegen Ermüdung)

Wenn Sie fast zentriert sind (Yaw < 0,05, Pitch < 0,05, Roll < 0,08), wird **NICHTS ausgelöst**. So können Sie sich natürlich bewegen, ohne dass Mikrobewegungen Trigger aktivieren.

### Stabile Frames

`Stabile Frames` = wie viele aufeinanderfolgende Frames Sie die Geste halten müssen, bevor sie auslöst. Standard: 5 Frames (~150 ms bei 30 fps).

Erhöhen Sie den Wert, wenn Trigger zu leicht auslösen. Verringern Sie ihn für eine schnellere Reaktion.

### Cooldown

`Cooldown (ms)` = Mindestzeit zwischen Szenenwechseln. Standard: 500 ms.

Verhindert, dass der Szenenwechsel instabil wird, wenn Sie schnell hin und her wechseln.

---

## Tastaturkürzel

| Taste | Aktion |
|---|---|
| `Leertaste` | Erkennung pausieren / fortsetzen |
| `C` | Manuell zur MITTE-Szene wechseln |
| `R` | Szenenliste aus der Software neu laden |
| `Esc` | Verbindung trennen |

---

## Trigger-Verlauf

Das Panel **Erweitert → Trigger-Verlauf** zeigt die letzten 50 ausgelösten Aktionen:

- ✓ grün = erfolgreich
- ✗ rot = fehlgeschlagen
- · grau = ausstehend

Nützlich, um nachzuvollziehen, was ausgelöst wurde, ohne DevTools zu öffnen.

**CSV exportieren**: lädt den Verlauf für Offline-Analysen herunter.

**Leeren**: löscht den Verlauf (wirkt sich auf nichts anderes aus).

---

## Sprache ändern

EsperantAI erkennt automatisch die Sprache Ihres Betriebssystems. So ändern Sie sie manuell:

- Oben rechts: Sprach-Dropdown
- Wählen Sie Ihre bevorzugte Sprache
- Die Oberfläche aktualisiert sich sofort

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
- 🇮🇳 हिन्दी
- 🇮🇩 Bahasa Indonesia

Alle 15 Sprachen sind in den aktuellen Oberflächendateien übersetzt.

---

## Lizenz verwalten

Panel **Erweitert → Lizenz**:

- **Status anzeigen**: Gültig / Ungültig
- **Zugehörige Kunden-E-Mail anzeigen**
- **Letzte Online-Validierung anzeigen**
- **Auf diesem Gerät deaktivieren**: nutzen Sie dies vor einem PC-Wechsel oder um einen Platz freizugeben (von 3 verfügbaren Geräten)

## Fehlerbehebung

### „Aktivierung erforderlich“ bleibt bestehen, nachdem ich meinen Lizenzschlüssel eingefügt habe

- Prüfen Sie, ob Sie den vollständigen Schlüssel kopiert haben (5 Gruppen mit je 4 Zeichen, getrennt durch Bindestriche)
- Prüfen Sie Ihre Internetverbindung (die erste Aktivierung erfordert Online-Validierung)
- Wenn Sie bereits auf 3 Geräten aktiviert haben, deaktivieren Sie zuerst eines
- Kontaktieren Sie soporte@edugame.digital, falls das Problem weiterhin besteht

### „Suche Gesicht...“ bleibt bestehen, obwohl mein Gesicht sichtbar ist

- Verbessern Sie die Beleuchtung: Ihr Gesicht sollte gut ausgeleuchtet sein
- Gehen Sie näher an die Kamera (40-80 cm sind optimal)
- Schließen Sie andere Tabs, die die GPU nutzen (Chrome kann die GPU begrenzen, wenn zu viele Tabs geöffnet sind)
- Wenn der Chrome Memory Saver aktiv ist, deaktivieren Sie ihn für diesen Tab

### Szenen erscheinen nicht in den Dropdown-Menüs

- Prüfen Sie, ob Sie mit der Streaming-Software verbunden sind (grünes Badge „Verbunden“)
- Drücken Sie `R`, um die Szenenliste neu zu laden
- Wenn sie weiterhin leer ist, trennen Sie die Verbindung und verbinden Sie erneut
- In vMix: bestätigen Sie, dass der Web Controller aktiviert und unter `http://127.0.0.1:8088/api/` erreichbar ist
- In PRISM: bestätigen Sie, dass das Plugin obs-websocket installiert und aktiviert ist
- In XSplit: bestätigen Sie, dass die lokale XJS-Bridge läuft

### Szenenwechsel werden ausgelöst, ohne dass ich Gesten mache

- Erhöhen Sie den Yaw-/Pitch-/Roll-Schwellenwert im Panel **Empfindlichkeit**
- Erhöhen Sie `Stabile Frames` von 5 auf 8-10
- Stellen Sie sicher, dass die Totzone konfiguriert ist (Yaw 0,05, Pitch 0,05, Roll 0,08)
- Prüfen Sie, dass keine weitere Person im Bild ist (mehrere Gesichter können Instabilität verursachen)

### Verzögerung bei der Erkennung

- Schließen Sie ressourcenintensive Anwendungen (Spiele, Videoschnitt)
- Prüfen Sie, ob Sie eine dedizierte GPU verwenden, falls vorhanden (nicht die integrierte)
- Reduzieren Sie die Kameraauflösung, falls sie 4K beträgt (1080p ist für die Erkennung optimal)

### OBS reagiert nicht, obwohl EsperantAI „Szene geändert“ anzeigt

- Prüfen Sie, ob der Szenenname im Dropdown exakt mit dem Namen in OBS übereinstimmt (Groß-/Kleinschreibung beachten)
- Prüfen Sie, ob die Szene nicht in einer anderen Szenensammlung liegt
- Prüfen Sie das Panel **Trigger-Verlauf** — wenn ✗ rot angezeigt wird, gibt es einen konkreten Fehler

### Fehler „OBS nicht erreichbar — Manuell verbinden“

- Prüfen Sie, ob OBS geöffnet ist
- Prüfen Sie, ob WebSocket in OBS aktiviert ist
- Wenn Sie in OBS ein Passwort eingerichtet haben, muss es exakt übereinstimmen
- Einige Antivirenprogramme blockieren Port 4455 — fügen Sie eine Ausnahme hinzu

### Twitch oder YouTube verbinden nicht

- Prüfen Sie, ob die Redirect-URI in der Plattformkonsole exakt mit der URL von `oauth-callback.html` übereinstimmt
- Erlauben Sie Pop-ups für die Domain, auf der Sie EsperantAI verwenden
- Bei Twitch: verwenden Sie nur die Client ID; fügen Sie kein Client Secret ein
- Bei YouTube: bestätigen Sie, dass die YouTube Data API v3 aktiviert ist und ein aktiver Livestream läuft

### Kick zeigt nicht alle Events

Kick ist im Browser im Modus **Beta/eingeschränkt**. Vollständige Kick-Events werden offiziell über Webhooks empfangen; verwenden Sie StreamElements oder ein eigenes Backend, wenn Sie zuverlässige Abos, Geschenke oder Raids benötigen.

---

## Datenschutz

### Was EsperantAI NICHT tut

- ❌ sendet Ihr Videobild NICHT an einen Server
- ❌ speichert Ihr Video oder Einzelbilder NICHT
- ❌ sammelt biometrische Informationen NICHT remote
- ❌ teilt Daten NICHT mit Werbetreibenden oder Dritten

### Was EsperantAI verarbeitet

- ✅ lokale Gesichtserkennung in Ihrem Browser (Human.js + WebGL)
- ✅ lokale Verbindungen zu OBS / Streamlabs / vMix / PRISM / XSplit (Loopback `127.0.0.1`)
- ✅ regelmäßige Validierung des Lizenzschlüssels (alle 7 Tage)
- ✅ wenn Sie Twitch/YouTube/Kick/StreamElements verbinden: Plattform-Token im lokalen Speicher oder Sitzungsspeicher des Browsers

Vollständige Details stehen in `docs/PRIVACY.html`.

---

## Support

- 📧 E-Mail: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Technische Dokumentation: https://github.com/salazarjoelo/EsperantAI

Reaktionszeiten:
- Allgemeine Fragen: 24-72 Stunden
- Technische Fehler: 1-3 Werktage

---

*Letzte Aktualisierung: 2026-05-20. Version: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
