# EsperantAI — Manuale utente

> **Gesti onesti.** Controlla il tuo software di streaming con il viso e le mani. Niente Stream Deck. Niente hardware extra.

**Versione**: 3.0 · **Lingua**: Italiano (traduzioni disponibili in altre 12 lingue)

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
9. [Combo evento + gesto (Avanzato)](#combo-evento--gesto-avanzato)
10. [Sensibilità e zona morta](#sensibilità-e-zona-morta)
11. [Scorciatoie da tastiera](#scorciatoie-da-tastiera)
12. [Cronologia trigger](#cronologia-trigger)
13. [Cambia lingua](#cambia-lingua)
14. [Gestisci la tua licenza](#gestisci-la-tua-licenza)
15. [Risoluzione dei problemi](#risoluzione-dei-problemi)
16. [Privacy](#privacy)
17. [Supporto](#supporto)

---

## Cos'è EsperantAI?

EsperantAI è un'**app web** che usa l'intelligenza artificiale per rilevare in tempo reale i gesti del tuo viso e delle tue mani, e li traduce in comandi per il tuo software di streaming. Funziona con:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta)

E riceve eventi da piattaforme come:

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements** (ponte multi-piattaforma)

### Perché «gesti onesti»?

Le espressioni facciali di base e la rotazione della testa sono **universali in tutte le culture umane** (Paul Ekman, 1972). Non mentono, non variano per geografia. EsperantAI chiama questi gesti «🌐 Universali» e li distingue dai gesti «⚠️ Culturali» (segni con le mani), il cui significato può variare a seconda del Paese.

Sei tu a decidere quali gesti usare in base al tuo pubblico.

---

## Requisiti minimi

### Hardware

- **Qualsiasi webcam USB** (consigliata: 1080p o superiore)
- **CPU**: qualsiasi processore a 4+ core degli ultimi 5 anni
- **RAM**: 8 GB minimi. 16 GB consigliati se fai streaming contemporaneamente.
- **GPU**: qualsiasi con supporto WebGL (funzionano anche le GPU integrate moderne)

### Software

- **OS**: Windows 10/11, macOS 12+ o Linux con kernel recente
- **Browser**: Chrome 90+, Edge 90+ o Firefox 100+
- **Software di streaming** (almeno uno): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Necessario per **attivare la licenza** e ogni **7 giorni** per la rivalidazione
- Funziona **fino a 7 giorni offline** (periodo di grazia)

---

## Acquisto e attivazione

1. Visita **https://edugame.digital**
2. Clicca **«Buy License»**
3. Completa il pagamento tramite LemonSqueezy (carta, PayPal, ecc.)
4. Riceverai un'email con:
   - La tua **chiave di licenza** (formato: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Il link per usare EsperantAI
5. Apri EsperantAI nel browser
6. Apparirà la schermata di attivazione. Incolla la tua chiave di licenza
7. Clicca **«Activate License»**
8. Fatto! 🎉

### Quanti dispositivi?

Una licenza può essere attivata su **fino a 3 dispositivi**. Per spostare la licenza su un altro dispositivo:

1. Sul vecchio dispositivo: pannello **Advanced** → **License** → **Deactivate on this device**
2. Sul nuovo dispositivo: attiva normalmente

---

## Primo utilizzo

### Passo 1: Consenti l'accesso alla fotocamera

Quando apri EsperantAI per la prima volta, il browser ti chiederà il permesso di usare la fotocamera. **Accettalo**.

> Importante: EsperantAI non invia mai il tuo video a nessun server. L'elaborazione avviene al 100% in locale sul tuo computer.

### Passo 2: Seleziona la fotocamera

Se hai più di una fotocamera, scegli quale usare dal menu a tendina.

### Passo 3: Verifica il rilevamento

Vedrai il tuo viso nel pannello di sinistra. Quando EsperantAI rileva il tuo viso, gli indicatori Yaw / Pitch / Roll inizieranno a mostrare dei valori.

### Passo 4: Procedura guidata di calibrazione (Pro+)

Se hai una licenza Pro o Pro+, la **Procedura guidata di calibrazione** si avvia automaticamente al primo utilizzo. Misura il tuo range naturale di movimento e imposta la sensibilità ottimale. Puoi riavviarla in qualsiasi momento con il pulsante **Recalibrate**.

---

## Connetti il tuo software di streaming

### OBS Studio

1. In OBS: **Tools → WebSocket Server Settings**
2. Abilita WebSocket. Annota la password se ne hai impostata una.
3. In EsperantAI: pannello **Connection**
4. Software di streaming: **OBS Studio**
5. WebSocket URL: `ws://127.0.0.1:4455` (predefinito)
6. Password: quella impostata in OBS
7. Clicca **Connect**

### Streamlabs Desktop

1. In Streamlabs: **Settings → Remote Control**
2. Abilita Remote Control
3. Annota l'API Token
4. In EsperantAI: software di streaming: **Streamlabs Desktop**
5. API Token: incollalo
6. Porta: `59650` (predefinita)
7. Clicca **Connect**

### vMix

1. In vMix: **Settings → Web Controller**
2. Abilita Web Controller. Porta predefinita: 8088.
3. In EsperantAI: software di streaming: **vMix**
4. Host: `127.0.0.1`
5. Porta: `8088`
6. Clicca **Connect**

### PRISM Live Studio

1. PRISM Live Studio v4.0.5+ richiede l'installazione manuale del plugin obs-websocket
2. Scarica `obs-websocket` dal [forum di OBS](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/)
3. Copialo nella cartella plugin di PRISM
4. Riavvia PRISM
5. Abilita WebSocket in **Tools → WebSocket Server Settings**
6. In EsperantAI: software di streaming: **PRISM Live Studio** (funziona come OBS)

### XSplit Broadcaster (beta)

1. Installa l'estensione «Remote xjs» in XSplit (Settings → Extensions)
2. Abilita Remote nelle preferenze
3. In EsperantAI: software di streaming: **XSplit**
4. Remote xjs Proxy URL: `ws://127.0.0.1:5555/xjs` (predefinito)
5. Clicca **Connect**

> XSplit è in **beta**. Le funzionalità avanzate potrebbero essere limitate.

---

## Configura gesti e scene

Una volta connesso, le scene effettive del tuo software appariranno automaticamente nei menu a tendina del pannello **Triggers**.

### Mappatura base

1. Per ogni gesto (es. «Look Left»), scegli una scena dal menu a tendina
2. Quando fai quel gesto e lo mantieni stabile per ~150 ms, EsperantAI cambierà la scena nel tuo software di streaming
3. Il cambio è automatico e quasi istantaneo

### Multi-azione (Pro+)

Con una licenza Pro o Pro+, un singolo gesto può attivare **più azioni** contemporaneamente:
- Cambiare scena + riprodurre un suono + mostrare un overlay + inviare un messaggio in chat

### Abilita / disabilita categorie

Ogni categoria ha la sua casella di spunta «Enable»:

- 🧠 **Rotazione della testa** (universale — abilitata per impostazione predefinita)
- 📏 **Distanza del viso** (avvicinarsi/allontanarsi)
- 👁️ **Sguardo** (muovere solo gli occhi)
- 😀 **Emozioni** (sorriso, sorpresa, rabbia, neutro)
- 👁️‍🗨️ **Doppio battito di ciglia**
- ✋ **Gesti con le mani** (culturali — disabilitati per impostazione predefinita)

Disabilita le categorie che non ti servono per risparmiare CPU.

---

## Categorie di gesti

### 🌐 Universali (stesso significato in ogni cultura)

| Gesto | Asse | Come attivarlo |
|---|---|---|
| Centro | — | Guardare dritto, viso stabile |
| Guarda a sinistra | yaw negativo | Girare la testa a sinistra |
| Guarda a destra | yaw positivo | Girare la testa a destra |
| Guarda in su | pitch negativo | Alzare il viso |
| Guarda in giù | pitch positivo | Abbassare il viso |
| Inclina a sinistra | roll negativo | Inclinare la testa verso la spalla sinistra |
| Inclina a destra | roll positivo | Inclinare la testa verso la spalla destra |
| Avvicinati | distanza | Avvicinare il viso alla fotocamera |
| Allontanati | distanza | Allontanare il viso dalla fotocamera |
| Direzione dello sguardo | sguardo | Muovere solo gli occhi (testa centrata) |
| Sorriso | emozione=happy | Sorridere chiaramente |
| Sorpresa | emozione=surprise | Mostrare sorpresa |
| Rabbia | emozione=angry | Mostrare rabbia |
| Neutro | emozione=neutral | Viso rilassato |
| Doppio battito di ciglia | battito | Chiudere entrambi gli occhi due volte velocemente (< 700 ms) |

### ⚠️ Culturali (il significato varia per Paese)

| Gesto | Significato occidentale | Attenzione in altre culture |
|---|---|---|
| 👍 Pollice su | Approvazione | Medio Oriente / Asia occidentale: può essere offensivo |
| ✌️ Pace | Pace / vittoria | UK / Irlanda / Australia (palmo verso l'interno): insulto |
| 🤘 Corna del rock | Rock / metal | **Italia (palmo verso il basso): «cornuto» — GRAVE INSULTO. In Italia, le corna con il palmo rivolto verso il basso indicano il tradimento coniugale e sono considerate un'offesa gravissima. Usalo SOLO con il palmo rivolto verso l'alto ( gesto rock) e mai davanti a un pubblico italiano se non sei sicuro del contesto.** |
| 👌 OK | OK / perfetto | Brasile / Turchia / Germania: può essere offensivo |
| ✊ Pugno chiuso | Dipende dal contesto politico | — |
| 🖐️ Palmo aperto | «Stop» o saluto | Grecia (mountza verso qualcuno): insulto forte |
| ☝️ Indicare | Indicare qualcosa | Asia: indicare con il dito è maleducato |

EsperantAI contrassegna ogni gesto con il relativo badge nell'interfaccia. Scegli quali usare in base al tuo pubblico globale.

### 🙏 Gassho (合掌)

Un gesto speciale: premi entrambi i palmi delle mani davanti al petto (come in preghiera o inchino di saluto). Comune nelle culture dell'Asia orientale come segno di rispetto o gratitudine. Rilevato con alta affidabilità tramite 6 punti di controllo.

---

## Connetti le piattaforme di streaming

Perché EsperantAI riceva eventi (donazioni, abbonamenti, raid), connetti le piattaforme su cui fai streaming.

### Twitch

1. Crea un Client ID su https://dev.twitch.tv/console
2. Registra la redirect URI: `https://edugame.digital/oauth-callback.html` (o il tuo URL locale)
3. In EsperantAI: pannello **Platform Events** → **Twitch EventSub**
4. Incolla il tuo Client ID
5. Clicca **Connect**
6. Si aprirà una finestra di autorizzazione Twitch. Accetta i permessi.
7. La finestra si chiuderà e vedrai «Twitch Connected»

### YouTube Live

1. Crea le credenziali su https://console.cloud.google.com
2. Abilita YouTube Data API v3
3. Crea un OAuth Client ID (tipo: Web Application)
4. Registra la stessa redirect URI usata per Twitch
5. In EsperantAI: pannello **Platform Events** → **YouTube Live**
6. Incolla il tuo Client ID e clicca **Connect**

### Kick

1. Crea un'app su https://kick.com/settings/developer
2. Registra la redirect URI
3. In EsperantAI: pannello **Platform Events** → **Kick**
4. Incolla il tuo Client ID e clicca **Connect**
5. Kick usa OAuth 2.1 con PKCE (più sicuro)

### StreamElements (ponte multi-piattaforma)

Se hai già un account StreamElements, puoi unificare Twitch + YouTube + Facebook con un solo token:

1. Vai su https://streamelements.com/dashboard/account/channels
2. Copia il tuo JWT Token
3. In EsperantAI: pannello **Platform Events** → **StreamElements**
4. Incolla il JWT e clicca **Connect**

---

## Combo evento + gesto (Avanzato)

Questa è la magia di EsperantAI: combinare **eventi della piattaforma** con **i tuoi gesti** come conferma.

### Esempio: ringraziare le donazioni con un pollice su

1. Pannello **Event Triggers** → riga «💰 Donation»
2. ✅ Abilita
3. Scena: `Thank_You_Scene`
4. Gesto richiesto: `👍 Thumbs up`

**Flusso dal vivo**:
- Arriva una donazione → EsperantAI mostra «Waiting for gesture...»
- Hai 5 secondi per fare 👍
- Se lo fai → passa a `Thank_You_Scene` + esegue le altre azioni configurate
- Se non lo fai → viene automaticamente ignorato

### Senza gesto richiesto (trigger automatico)

Se lasci «Required gesture» su `— none —`, l'evento attiva l'azione immediatamente.

Utile per:
- Cambiare automaticamente scena di celebrazione quando arriva un raid
- Mostrare automaticamente un overlay quando qualcuno si abbona

---

## Sensibilità e zona morta

### Sensibilità

Le soglie controllano quanto ampio deve essere un gesto per attivarsi:

- **Yaw**: quanto girare la testa di lato (predefinito: 0,15 rad ≈ 8,6°)
- **Pitch su/giù**: inclinazione verticale
- **Roll**: inclinazione laterale

Aumenta i valori per gesti più marcati. Riducili per maggiore sensibilità.

### Zona morta (anti-affaticamento)

Se sei quasi centrato (yaw < 0,05, pitch < 0,05, roll < 0,08), **NIENTE si attiva**. Questo ti permette di muoverti naturalmente senza che i micro-movimenti attivino i trigger.

| Gesto | Asse | Come attivarlo |
|---|---|---|

### Frame stabili

`Stable frames` = quanti frame consecutivi il gesto deve essere mantenuto prima dell'attivazione. Predefinito: 5 frame (~150 ms a 30 fps).

Aumenta se i trigger si attivano troppo facilmente. Riduci per una risposta più rapida.

### Cooldown

`Cooldown (ms)` = tempo minimo tra i cambi di scena. Predefinito: 500 ms.

Impedisce che il selettore sia «nervoso» se oscilli rapidamente.

---

## Scorciatoie da tastiera

| Tasto | Azione |
|---|---|
| `Spazio` | Metti in pausa / Riprendi il rilevamento |
| `C` | Vai manualmente alla scena CENTER |
| `R` | Ricarica l'elenco scene dal software |
| `Esc` | Disconnetti |

---

## Cronologia trigger

Il pannello **Advanced → Trigger History** mostra le ultime 50 azioni attivate:

- ✓ verde = riuscita
- ✗ rosso = fallita
- · grigio = in attesa

Utile per controllare cosa ha attivato i trigger senza aprire DevTools.

**Esporta CSV**: scarica la cronologia per analisi offline.

**Cancella**: elimina la cronologia (non influenza altro).

---

## Cambia lingua

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

Tutte le 13 lingue sono completamente tradotte (342 chiavi ciascuna).

---

## Gestisci la tua licenza

Pannello **Advanced → License**:

- **Visualizza stato**: Valida / Non valida
- **Visualizza email del cliente associata**
- **Visualizza ultima validazione online**
- **Deactivate on this device**: usa prima di cambiare PC o per liberare uno slot (dei 3 disponibili)

### Rimborsi

Se EsperantAI non soddisfa le tue aspettative, hai **14 giorni** dall'acquisto per richiedere un rimborso completo. Scrivi a soporte@edugame.digital indicando la tua chiave di licenza.

---

## Risoluzione dei problemi

### «Activation required» persiste dopo aver incollato la chiave di licenza

- Verifica di aver copiato la chiave completa (5 gruppi di 4 caratteri separati da trattini)
- Controlla la connessione internet (l'attivazione richiede la validazione online la prima volta)
- Se hai già attivato su 3 dispositivi, disattivane uno prima
- Contatta soporte@edugame.digital se il problema persiste

### «Searching for face...» persiste anche se il viso è visibile

- Migliora l'illuminazione: il viso deve essere ben illuminato
- Avvicinati alla fotocamera (40-80 cm è l'ottimale)
- Chiudi le altre schede che usano la GPU (Chrome potrebbe limitare la GPU se ne hai troppe aperte)
- Se il Memory Saver di Chrome è attivo, disabilitalo per questa scheda

### Le scene non compaiono nei menu a tendina

- Verifica di essere connesso al software di streaming (badge verde «Connected»)
- Premi `R` per ricaricare l'elenco delle scene
- Se ancora vuoto, disconnetti e riconnettiti

### I cambi di scena si attivano senza fare gesti

- Aumenta la soglia yaw / pitch / roll nel pannello **Sensitivity**
- Aumenta `Stable frames` da 5 a 8-10
- Assicurati che la zona morta sia configurata (yaw 0,05, pitch 0,05, roll 0,08)
- Verifica che nessun altro sia nell'inquadratura (più visi possono causare instabilità)

### Ritardo nel rilevamento

- Chiudi le app pesanti (giochi, montaggio video)
- Verifica di usare la GPU dedicata se ne hai una (non quella integrata)
- Riduci la risoluzione della fotocamera se è 4K (1080p è ottimale per il rilevamento)

### OBS non reagisce anche se EsperantAI dice «Scene changed»

- Verifica che il nome della scena nel menu a tendina corrisponda ESATTAMENTE a quello in OBS (maiuscole/minuscole)
- Verifica che la scena non sia in un'altra Scene Collection
- Controlla il pannello **Trigger History** — se mostra ✗ rosso, c'è un errore specifico

### Errore «OBS unreachable — Connect manually»

- Verifica che OBS sia aperto
- Verifica che WebSocket sia abilitato in OBS
- Se hai impostato una password in OBS, deve corrispondere esattamente
- Alcuni antivirus bloccano la porta 4455 — aggiungi un'eccezione

---

## Privacy

### Cosa EsperantAI NON fa

- ❌ NON invia il tuo video a nessun server
- ❌ NON salva il tuo video o catture
- ❌ NON raccoglie informazioni biometriche da remoto
- ❌ NON condivide dati con inserzionisti o terze parti

### Cosa ELABORA

- ✅ Rilevamento facciale locale nel tuo browser (Human.js + WebGL)
- ✅ Connessioni locali al tuo OBS / Streamlabs / vMix (loopback 127.0.0.1)
- ✅ Validazione periodica della chiave di licenza (ogni 7 giorni)
- ✅ Se connetti Twitch/YouTube/Kick: token OAuth in sessionStorage (eliminati alla chiusura del browser)

Dettagli completi in `docs/PRIVACY.html`.

---

## Supporto

- 📧 Email: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Documentazione tecnica: https://github.com/salazarjoelo/EsperantAI

Tempi di risposta:
- Domande generali: 24-72 ore
- Bug tecnici: 1-3 giorni lavorativi
- Richieste di rimborso: 1-2 giorni lavorativi

---

*Ultimo aggiornamento: 2026-05-14. Versione: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
