# EsperantAI — Manuale utente

> **Gesti onesti.** Controlla il tuo software di streaming con il viso e le mani, senza hardware dedicato aggiuntivo.

**Versione**: 3.0 · **Lingua**: Italiano (traduzioni disponibili in altre 14 lingue)

**Controllo tecnico**: allineato alla documentazione ufficiale disponibile al **20 maggio 2026** per OBS Studio, Streamlabs Desktop, vMix, PRISM Live Studio, XSplit, Twitch, YouTube Live, Kick, Trovo e StreamElements. Dettaglio: [`docs/MANUAL_PLATFORM_AUDIT_2026-05.md`](MANUAL_PLATFORM_AUDIT_2026-05.md).

---

## Indice

1. [Cos'è EsperantAI?](#cosè-esperantai)
2. [Requisiti minimi](#requisiti-minimi)
3. [Acquisto e attivazione](#acquisto-e-attivazione)
4. [Primo utilizzo](#primo-utilizzo)
5. [Connetti il tuo software di streaming](#connetti-il-tuo-software-di-streaming)
6. [Configura gesti e scene](#configura-gesti-e-scene)
7. [Categorie di gesti](#categorie-di-gesti)
8. [Connetti le piattaforme di streaming](#connetti-le-piattaforme-di-streaming)
9. [Combinazioni evento + gesto (Avanzato)](#combinazioni-evento--gesto-avanzato)
10. [Sensibilità e zona morta](#sensibilità-e-zona-morta)
11. [Scorciatoie da tastiera](#scorciatoie-da-tastiera)
12. [Cronologia dei trigger](#cronologia-dei-trigger)
13. [Cambiare lingua](#cambiare-lingua)
14. [Gestire la licenza](#gestire-la-licenza)
15. [Risoluzione dei problemi](#risoluzione-dei-problemi)
16. [Privacy](#privacy)
17. [Supporto](#supporto)

---

## Cos'è EsperantAI?

EsperantAI è un'**applicazione web** che usa l'intelligenza artificiale per rilevare in tempo reale i gesti del tuo viso e delle tue mani, e li traduce in comandi per il tuo software di streaming. Il video della fotocamera viene elaborato localmente nel browser.

![Flusso locale di EsperantAI](assets/manual/01-esperantai-flow.svg)

Funziona con questi programmi di trasmissione:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta/avanzato)

Può anche ricevere eventi dalle piattaforme e combinarli con i tuoi gesti:

- **Twitch**: supporto diretto tramite EventSub WebSocket.
- **YouTube Live**: supporto diretto tramite YouTube Data API v3; richiede una diretta attiva e quota disponibile.
- **Kick**: supported through the local **Streamer.bot bridge**. Streamer.bot receives Kick through its official integration and EsperantAI listens to those events through local WebSocket.
- **StreamElements**: ponte multipiattaforma con token/JWT del tuo account.
- **Trovo**: native support through Trovo OAuth + chat WebSocket.

### Perché «gesti onesti»?

Le espressioni facciali di base e la rotazione della testa sono **universali in tutte le culture umane** (Paul Ekman, 1972). Non mentono e non cambiano in base alla geografia. EsperantAI chiama questi gesti «🌐 Universali» e li distingue dai gesti «⚠️ Culturali» (segni con le mani), il cui significato può variare da Paese a Paese.

Sei tu a decidere quali gesti usare in base al tuo pubblico.

---

## Requisiti minimi

### Hardware

- **Qualsiasi webcam USB** (consigliata: 1080p o superiore)
- **CPU**: qualsiasi processore a 4+ core degli ultimi 5 anni
- **RAM**: minimo 8 GB. Consigliati 16 GB se fai streaming nello stesso momento.
- **GPU**: qualsiasi GPU con supporto WebGL, incluse le GPU integrate moderne

### Software

- **Sistema operativo**: Windows 10/11, macOS 12+ o Linux con kernel recente
- **Browser**: Chrome 90+, Edge 90+ o Firefox 100+
- **Software di streaming** (almeno uno): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Necessario per **attivare la licenza** e ogni **7 giorni** per la rivalidazione
- Funziona **fino a 7 giorni offline** (periodo di grazia)

---

## Acquisto e attivazione

1. Visita **https://edugame.digital**
2. Fai clic su **«Acquista licenza»**
3. Completa il pagamento tramite LemonSqueezy (carta, PayPal, ecc.)
4. Riceverai un'email con:
   - La tua **chiave di licenza** (formato: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Il link per usare EsperantAI
5. Apri EsperantAI nel browser
6. Apparirà la schermata di attivazione. Incolla la chiave di licenza
7. Fai clic su **«Attiva licenza»**
8. Fatto! 🎉

### Quanti dispositivi?

Una licenza può essere attivata su **massimo 3 dispositivi**. Per spostare la licenza su un altro dispositivo:

1. Sul dispositivo precedente: pannello **Avanzate** → **Licenza** → **Disattiva su questo dispositivo**
2. Sul nuovo dispositivo: attiva normalmente

---

## Primo utilizzo

### Passo 1: Consenti l'accesso alla fotocamera

Quando apri EsperantAI per la prima volta, il browser ti chiederà il permesso di accedere alla fotocamera. **Accetta**.

> Importante: EsperantAI non invia mai il tuo video a nessun server. L'elaborazione è al 100% locale sul tuo dispositivo.

### Passo 2: Seleziona la fotocamera

Se hai più di una fotocamera, scegli quale usare dal menu a tendina delle fotocamere.

### Passo 3: Verifica il rilevamento

Vedrai il tuo viso nel pannello a sinistra. Quando EsperantAI rileva il volto, gli indicatori Yaw / Pitch / Roll inizieranno a mostrare valori.

### Passo 4: Assistente di calibrazione (Pro+)

Se hai una licenza Pro o Pro+, l'**Assistente di calibrazione** si avvia automaticamente al primo utilizzo. Misura il tuo intervallo naturale di movimento e imposta la sensibilità ottimale. Puoi eseguirlo di nuovo in qualsiasi momento dal pulsante **Ricalibra**.

---

## Connetti il tuo software di streaming

![Matrice di connessione del software di streaming](assets/manual/02-software-setup.svg)

Tutte le connessioni di questa sezione sono locali: EsperantAI comunica con il programma di trasmissione in esecuzione sullo stesso computer tramite `127.0.0.1`.

### OBS Studio

1. In OBS: **Strumenti → Impostazioni del server WebSocket**
2. Abilita il server WebSocket. OBS Studio 28+ include già obs-websocket.
3. In EsperantAI: pannello **Connessione**
4. Software di streaming: **OBS Studio**
5. URL WebSocket: `ws://127.0.0.1:4455` (predefinito)
6. Password: quella configurata in OBS, se hai attivato una password
7. Fai clic su **Connetti**

### Streamlabs Desktop

1. In Streamlabs Desktop: **Settings → Remote Control**
2. Abilita il controllo remoto locale
3. Copia l'**API Token** dalla schermata Remote Control
4. In EsperantAI: software di streaming **Streamlabs Desktop**
5. Token API: incollalo
6. Porta: `59650` (predefinita)
7. Fai clic su **Connetti**

### vMix

1. In vMix: **Settings → Web Controller**
2. Abilita Web Controller. Porta predefinita: `8088`.
3. In EsperantAI: software di streaming **vMix**
4. Host: `127.0.0.1`
5. Porta: `8088`
6. Fai clic su **Connetti**

> Nota: l'adattatore attuale di EsperantAI usa l'API HTTP locale di vMix. Se hai protetto Web Controller con regole di rete o credenziali non compatibili con il browser, la connessione può fallire.

### PRISM Live Studio

1. Usa **PRISM Live Studio v4.0.5+**.
2. Installa manualmente il plugin `obs-websocket` compatibile con OBS/PRISM.
3. Copialo nella cartella dei plugin di PRISM seguendo la guida ufficiale di PRISM per i plugin OBS.
4. Riavvia PRISM
5. Abilita WebSocket in **Strumenti → Impostazioni del server WebSocket**
6. In EsperantAI: software di streaming **PRISM Live Studio** (funziona come OBS)

> Differenza importante: OBS 28+ include già obs-websocket. PRISM richiede l'installazione manuale del plugin.

### XSplit Broadcaster (beta/avanzato)

1. Installa o abilita un ponte locale compatibile con **XSplit XJS / Remote xjs**.
2. Verifica che il ponte esponga un URL WebSocket locale.
3. In EsperantAI: software di streaming **XSplit**
4. URL del proxy Remote xjs: `ws://127.0.0.1:5555/xjs` (predefinito)
5. Fai clic su **Connetti**

> XSplit è in modalità **beta/avanzata**. La compatibilità dipende dal ponte XJS locale installato; le funzionalità avanzate possono essere limitate.

---

## Configura gesti e scene

Una volta connesso, le scene reali del tuo software appariranno automaticamente nei menu a tendina del pannello **Trigger**.

### Mappatura di base

1. Per ogni gesto (per esempio «Guarda a sinistra»), scegli una scena dal menu a tendina
2. Quando esegui quel gesto e lo mantieni stabile per ~150 ms, EsperantAI passa a quella scena nel tuo software di streaming
3. Il cambio è automatico e quasi istantaneo

### Multi-azione (Pro+)

Con una licenza Pro o Pro+, un gesto può attivare **più azioni** contemporaneamente:
- Cambiare scena + riprodurre un suono + mostrare un overlay + inviare un messaggio in chat

### Abilitare / disabilitare categorie

Ogni categoria ha la propria casella «Abilita»:

- 🧠 **Rotazione della testa** (universale — abilitata per impostazione predefinita)
- 📏 **Distanza del viso** (avvicinarsi o allontanarsi)
- 👁️ **Sguardo** (muovere solo gli occhi)
- 😀 **Emozioni** (sorriso, sorpresa, rabbia, neutro)
- 👁️‍🗨️ **Doppio battito di ciglia**
- ✋ **Gesti con le mani** (culturali — disabilitati per impostazione predefinita)

Disabilita le categorie che non ti servono per risparmiare CPU.

---

## Categorie di gesti

### 🌐 Universali (stesso significato in qualsiasi cultura)

| Gesto | Asse | Come attivarlo |
|---|---|---|
| Centro | — | Guarda in avanti, viso stabile |
| Guarda a sinistra | yaw negativo | Gira la testa verso sinistra |
| Guarda a destra | yaw positivo | Gira la testa verso destra |
| Guarda in alto | pitch negativo | Alza il viso |
| Guarda in basso | pitch positivo | Abbassa il viso |
| Inclina a sinistra | roll negativo | Inclina la testa verso la spalla sinistra |
| Inclina a destra | roll positivo | Inclina la testa verso la spalla destra |
| Avvicinarsi | distanza | Avvicinati alla fotocamera |
| Allontanarsi | distanza | Allontanati dalla fotocamera |
| Sguardo | sguardo | Muovi solo gli occhi (testa centrata) |
| Sorriso | emozione=felice | Sorridi chiaramente |
| Sorpreso | emozione=sorpresa | Mostra sorpresa |
| Arrabbiato | emozione=rabbia | Mostra rabbia |
| Neutro | emozione=neutro | Viso rilassato |
| Doppio battito di ciglia | battito | Chiudi entrambi gli occhi due volte rapidamente (< 700 ms) |

### ⚠️ Culturali (il significato varia in base al Paese)

| Gesto | Significato occidentale | Attenzione in altre culture |
|---|---|---|
| 👍 Pollice in su | Approvazione | Medio Oriente / Asia occidentale: può essere offensivo |
| ✌️ Pace | Pace / vittoria | Regno Unito / Irlanda / Australia (palmo verso l'interno): insulto |
| 🤘 Corna rock | Rock / metal | Italia (palmo verso il basso): «cornuto» (insulto) |
| 👌 OK | OK / perfetto | Brasile / Turchia / Germania: può essere offensivo |
| ✊ Pugno chiuso | Varia in base al contesto politico | — |
| 🖐️ Palmo aperto | «Stop» o saluto | Grecia (mountza verso qualcuno): insulto forte |
| ☝️ Indicare | Indicare | Asia: indicare con il dito è maleducato |

EsperantAI contrassegna ogni gesto con il badge corrispondente nell'interfaccia. Scegli quali usare in base al tuo pubblico globale.

### 🙏 Gassho (合掌)

Un gesto speciale: unisci entrambi i palmi davanti al petto (come in una preghiera o in un inchino di saluto). È comune nelle culture dell'Asia orientale come segno di rispetto o gratitudine. Viene rilevato con alta affidabilità tramite 6 controlli sui punti di riferimento.

---

## Connetti le piattaforme di streaming

Per far sì che EsperantAI riceva eventi (donazioni, abbonamenti, raid, follow o Super Chat), connetti le piattaforme su cui fai streaming.

![Stato degli eventi per piattaforma](assets/manual/03-platform-events.svg)

### Twitch

1. Crea un Client ID su https://dev.twitch.tv/console
2. Registra l'URI di reindirizzamento: `https://edugame.digital/oauth-callback.html` (o il tuo URL locale)
3. In EsperantAI: pannello **Eventi piattaforma** → **Twitch EventSub**
4. Incolla il tuo Client ID
5. Fai clic su **Connetti**
6. Si aprirà una finestra di autorizzazione di Twitch. Accetta i permessi.
7. La finestra si chiuderà e vedrai «Twitch connesso»

EsperantAI usa EventSub WebSocket. Non incollare nessun Client Secret nel browser.

### YouTube Live

1. Crea le credenziali su https://console.cloud.google.com
2. Abilita YouTube Data API v3
3. Crea un OAuth Client ID (tipo: Applicazione web)
4. Registra lo stesso URI di reindirizzamento usato per Twitch
5. In EsperantAI: pannello **Eventi piattaforma** → **YouTube Live**
6. Incolla il tuo Client ID e fai clic su **Connetti**

Requisiti di YouTube: devi avere una diretta attiva con chat disponibile, e il tuo progetto Google Cloud deve avere quota sufficiente per consultare la chat.

### Kick via Streamer.bot

EsperantAI supports Kick through the **Streamer.bot bridge**. This is the recommended sales-ready route because it does not expose Kick secrets in the browser and does not rely on reverse engineering.

1. Install Streamer.bot 1.0.0 or newer.
2. In Streamer.bot, connect your Kick account.
3. In Streamer.bot: **Servers/Clients -> WebSocket Server** and enable the server.
4. Use `127.0.0.1`, port `8080`, and endpoint `/`, unless you changed those values.
5. In EsperantAI: **Platform Events** panel -> **Kick via Streamer.bot**.
6. Click **Connect**.

Events available through this bridge: follows, subscriptions, resubscriptions, gift subscriptions, and redemptions supported by Streamer.bot. Native official Kick backend/webhooks remain an advanced roadmap item.

### StreamElements (ponte multipiattaforma)

Se hai già un account StreamElements, puoi usarlo come ponte per avvisi da più piattaforme:

1. Vai su https://streamelements.com/dashboard/account/channels
2. Copia il tuo JWT Token
3. In EsperantAI: pannello **Eventi piattaforma** → **StreamElements**
4. Incolla il JWT e fai clic su **Connetti**

Mantieni privato questo token. Trattalo come una password del tuo account StreamElements.

### Trovo

EsperantAI supports Trovo natively through OAuth and Trovo's official chat WebSocket.

1. Create an app in the Trovo developer portal.
2. Register the EsperantAI redirect URI: `oauth-callback.html` on the same domain where you open the app.
3. In EsperantAI: **Platform Events** panel -> **Trovo**.
4. Paste your Client ID and click **Connect**.
5. Authorize the requested permissions.

Available events: subscriptions, resubscriptions, gift subscriptions, follows, raids, spells/gifts, and magic chat.

---

## Combinazioni evento + gesto (Avanzato)

Questa è la magia di EsperantAI: combinare **eventi della piattaforma** con **i tuoi gesti** come conferma.

![Flusso evento più gesto](assets/manual/04-event-gesture-combo.svg)

### Esempio: ringraziare le donazioni con un pollice in su

1. Pannello **Trigger evento** → riga «💰 Donazione»
2. ✅ Abilita
3. Scena: `Scena_Grazie`
4. Gesto richiesto: `👍 Pollice in su`

**Flusso dal vivo**:
- Arriva una donazione → EsperantAI mostra «In attesa del gesto...»
- Hai 5 secondi per fare 👍
- Se lo fai → passa a `Scena_Grazie` + esegue qualsiasi altra azione configurata
- Se non lo fai → viene scartato automaticamente

### Senza gesto richiesto (attivazione automatica)

Se lasci «Gesto richiesto» su `— nessuno —`, l'evento attiva subito l'azione.

Utile per:
- Passare automaticamente alla scena di celebrazione quando arrivano raid
- Mostrare automaticamente un overlay quando qualcuno si abbona

---

## Sensibilità e zona morta

### Sensibilità

Le soglie controllano quanto deve essere ampio un gesto perché venga attivato:

- **Yaw**: quanto devi girare la testa lateralmente (predefinito: 0,15 rad ≈ 8,6°)
- **Pitch su/giù**: inclinazione verticale
- **Roll**: inclinazione laterale

Aumenta i valori per gesti più marcati. Riducili per una maggiore sensibilità.

### Zona morta (anti-affaticamento)

Se sei quasi centrato (yaw < 0,05, pitch < 0,05, roll < 0,08), **NON si attiva nulla**. Questo ti permette di muoverti in modo naturale senza che i micromovimenti attivino i trigger.

### Fotogrammi stabili

`Fotogrammi stabili` = quanti fotogrammi consecutivi devi mantenere il gesto prima che venga attivato. Valore predefinito: 5 fotogrammi (~150 ms a 30 fps).

Aumenta il valore se i trigger si attivano troppo facilmente. Riducilo per una risposta più rapida.

### Raffreddamento

`Raffreddamento (ms)` = tempo minimo tra i cambi di scena. Valore predefinito: 500 ms.

Evita che il commutatore diventi «instabile» se oscilli rapidamente.

---

## Scorciatoie da tastiera

| Tasto | Azione |
|---|---|
| `Spazio` | Pausa / Riprendi rilevamento |
| `C` | Vai manualmente alla scena CENTRO |
| `R` | Ricarica l'elenco delle scene dal software |
| `Esc` | Disconnetti |

---

## Cronologia dei trigger

Il pannello **Avanzate → Cronologia dei trigger** mostra le ultime 50 azioni attivate:

- ✓ verde = riuscita
- ✗ rosso = fallita
- · grigio = in attesa

Utile per controllare cosa è stato attivato senza aprire DevTools.

**Esporta CSV**: scarica la cronologia per analisi offline.

**Cancella**: elimina la cronologia (non influisce su altro).

---

## Cambiare lingua

EsperantAI rileva automaticamente la lingua del tuo sistema operativo. Per cambiarla manualmente:

- Angolo in alto a destra: menu a tendina della lingua
- Seleziona la lingua preferita
- L'interfaccia si aggiorna immediatamente

Lingue disponibili:
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

I 15 idiomi sono tradotti nei file di interfaccia attuali.

---

## Gestire la licenza

Pannello **Avanzate → Licenza**:

- **Verifica stato**: Valida / Non valida
- **Visualizza l'email del cliente associato**
- **Visualizza l'ultima validazione online**
- **Disattiva su questo dispositivo**: usalo prima di cambiare PC o per liberare uno slot (dei 3 disponibili)

## Risoluzione dei problemi

### «Attivazione richiesta» persiste dopo aver incollato la chiave di licenza

- Verifica di aver copiato la chiave completa (5 gruppi da 4 caratteri separati da trattini)
- Controlla la connessione a Internet (la prima attivazione richiede validazione online)
- Se hai già attivato la licenza su 3 dispositivi, disattivane prima uno
- Contatta soporte@edugame.digital se il problema persiste

### «Ricerca del volto...» persiste anche se il viso è visibile

- Migliora l'illuminazione: il volto deve essere ben illuminato
- Avvicinati alla fotocamera (40-80 cm è ottimale)
- Chiudi altre schede che usano la GPU (Chrome può limitarla se ci sono troppe schede aperte)
- Se il Risparmio memoria di Chrome è attivo, disattivalo per questa scheda

### Le scene non compaiono nei menu a tendina

- Verifica di essere connesso al software di streaming (badge verde «Connesso»)
- Premi `R` per ricaricare l'elenco delle scene
- Se resta vuoto, disconnetti e riconnetti
- In vMix, conferma che Web Controller sia abilitato e accessibile da `http://127.0.0.1:8088/api/`
- In PRISM, conferma che il plugin obs-websocket sia installato e abilitato
- In XSplit, conferma che il ponte XJS locale sia in esecuzione

### I cambi di scena si attivano senza che io faccia gesti

- Aumenta la soglia di yaw / pitch / roll nel pannello **Sensibilità**
- Aumenta i `Fotogrammi stabili` da 5 a 8-10
- Assicurati che la zona morta sia configurata (yaw 0,05, pitch 0,05, roll 0,08)
- Controlla che non ci sia qualcun altro nell'inquadratura (più volti possono causare instabilità)

### Ritardo nel rilevamento

- Chiudi applicazioni pesanti (giochi, editing video)
- Verifica di usare la GPU dedicata, se ne hai una, e non quella integrata
- Riduci la risoluzione della fotocamera se è 4K (1080p è ottimale per il rilevamento)

### OBS non reagisce anche se EsperantAI indica «Scena cambiata»

- Verifica che il nome della scena nel menu a tendina corrisponda ESATTAMENTE a quello in OBS (maiuscole/minuscole incluse)
- Verifica che la scena non si trovi in un'altra Raccolta scene
- Controlla il pannello **Cronologia dei trigger** — se mostra ✗ rosso, c'è un errore specifico

### Errore «OBS non raggiungibile — Connetti manualmente»

- Verifica che OBS sia aperto
- Verifica che WebSocket sia abilitato in OBS
- Se hai configurato una password in OBS, deve corrispondere esattamente
- Alcuni antivirus bloccano la porta 4455 — aggiungi un'eccezione

### Twitch o YouTube non si connettono

- Verifica che l'URI di reindirizzamento nella console della piattaforma corrisponda esattamente all'URL di `oauth-callback.html`
- Consenti le finestre popup per il dominio in cui usi EsperantAI
- In Twitch, usa solo il Client ID; non incollare il Client Secret
- In YouTube, conferma che YouTube Data API v3 sia abilitata e che ci sia una diretta attiva

### Kick does not connect through Streamer.bot

Confirm that Streamer.bot 1.0.0+ is open, Kick is connected inside Streamer.bot, and **WebSocket Server** is enabled. Use `127.0.0.1:8080/` unless you changed the configuration. If Streamer.bot requires a password, enter the same password in EsperantAI.

---

## Privacy

### Cosa EsperantAI NON fa

- ❌ NON invia il tuo video a nessun server
- ❌ NON salva il tuo video né catture
- ❌ NON raccoglie informazioni biometriche da remoto
- ❌ NON condivide dati con inserzionisti o terze parti

### Cosa ELABORA

- ✅ Rilevamento facciale locale nel browser (Human.js + WebGL)
- ✅ Connessioni locali a OBS / Streamlabs / vMix / PRISM / XSplit (loopback `127.0.0.1`)
- ✅ Validazione periodica della chiave di licenza (ogni 7 giorni)
- ✅ Se connetti Twitch/YouTube/Kick/StreamElements: token della piattaforma nello storage locale o di sessione del browser

Dettagli completi in `docs/PRIVACY.html`.

---

## Supporto

- 📧 Email: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Documentazione tecnica: https://github.com/salazarjoelo/EsperantAI

Tempi di risposta:
- Domande generali: 24-72 ore
- Errori tecnici: 1-3 giorni lavorativi

---

*Ultimo aggiornamento: 2026-05-20. Versione: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
