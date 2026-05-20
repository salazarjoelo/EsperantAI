# EsperantAI — Instrukcja użytkownika

> **Szczere gesty.** Steruj swoim oprogramowaniem do streamingu za pomocą twarzy i rąk. Bez Stream Decka. Bez dodatkowego sprzętu.

**Wersja**: 3.0 · **Język**: Polski (tłumaczenia dostępne w 12 kolejnych językach)

---

## Spis treści

1. [Czym jest EsperantAI?](#czym-jest-esperantai)
2. [Wymagania minimalne](#wymagania-minimalne)
3. [Zakup i aktywacja](#zakup-i-aktywacja)
4. [Pierwsze uruchomienie](#pierwsze-uruchomienie)
5. [Połącz swoje oprogramowanie do streamingu](#połącz-swoje-oprogramowanie-do-streamingu)
6. [Konfiguracja gestów i scen](#konfiguracja-gestów-i-scen)
7. [Kategorie gestów](#kategorie-gestów)
8. [Połącz platformy streamingowe](#połącz-platformy-streamingowe)
9. [Kombo: zdarzenie + gest (Zaawansowane)](#kombo-zdarzenie--gest-zaawansowane)
10. [Czułość i martwa strefa](#czułość-i-martwa-strefa)
11. [Skróty klawiszowe](#skróty-klawiszowe)
12. [Historia wyzwalaczy](#historia-wyzwalaczy)
13. [Zmiana języka](#zmiana-języka)
14. [Zarządzanie licencją](#zarządzanie-licencją)
15. [Rozwiązywanie problemów](#rozwiązywanie-problemów)
16. [Prywatność](#prywatność)
17. [Pomoc techniczna](#pomoc-techniczna)

---

## Czym jest EsperantAI?

EsperantAI to **aplikacja webowa**, która wykorzystuje sztuczną inteligencję do wykrywania w czasie rzeczywistym gestów twarzy i rąk oraz przekształcania ich w komendy dla twojego oprogramowania do streamingu. Działa z:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta)

I odbiera zdarzenia z platform takich jak:

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements** (most wieloplatformowy)

### Dlaczego „szczere gesty"?

Podstawowe wyrażenia twarzy i rotacja głowy są **uniwersalne we wszystkich kulturach ludzkich** (Paul Ekman, 1972). Nie kłamią, nie różnią się w zależności od kręgu geograficznego. EsperantAI nazywa te gesty „🌐 Uniwersalne" i odróżnia je od gestów „⚠️ Kulturowych" (znaki wykonywane rękami), których znaczenie może się różnić w zależności od kraju.

To ty decydujesz, których gestów używać, dostosowując się do swojej widowni.

---

## Wymagania minimalne

### Sprzęt

- **Dowolna kamera USB** (zalecana: 1080p lub wyższa)
- **CPU**: dowolny 4-rdzeniowy procesor z ostatnich 5 lat
- **RAM**: minimum 8 GB. Zalecane 16 GB przy jednoczesnym streamowaniu.
- **GPU**: dowolny z obsługą WebGL (działają nawet nowoczesne układy zintegrowane)

### Oprogramowanie

- **OS**: Windows 10/11, macOS 12+ lub Linux z aktualnym jądrem
- **Przeglądarka**: Chrome 90+, Edge 90+ lub Firefox 100+
- **Oprogramowanie do streamingu** (przynajmniej jedno): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Wymagany do **aktywacji licencji** i co **7 dni** do ponownej walidacji
- Działa **do 7 dni offline** (okres karencji)

---

## Zakup i aktywacja

1. Wejdź na **https://edugame.digital**
2. Kliknij **„Buy License"**
3. Opłać zamówienie przez LemonSqueezy (karta, PayPal itp.)
4. Otrzymasz e-mail z:
   - Twoim **kluczem licencyjnym** (format: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Linkiem do korzystania z EsperantAI
5. Otwórz EsperantAI w przeglądarce
6. Pojawi się ekran aktywacji. Wklej swój klucz licencyjny
7. Kliknij **„Activate License"**
8. Gotowe! 🎉

### Ile urządzeń?

Jedna licencja może być aktywowana na **maksymalnie 3 urządzeniach**. Aby przenieść licencję na inne urządzenie:

1. Na starym urządzeniu: panel **Advanced** → **License** → **Deactivate on this device**
2. Na nowym urządzeniu: aktywuj normalnie

---

## Pierwsze uruchomienie

### Krok 1: Zezwól na dostęp do kamery

Gdy otworzysz EsperantAI po raz pierwszy, przeglądarka poprosi o zgodę na używanie kamery. **Zezwól**.

> Ważne: EsperantAI nigdy nie wysyła twojego obrazu wideo na żaden serwer. Przetwarzanie odbywa się w 100% lokalnie na twoim komputerze.

### Krok 2: Wybierz kamerę

Jeśli masz więcej niż jedną kamerę, wybierz, której użyć, z listy rozwijanej.

### Krok 3: Sprawdź wykrywanie

Zobaczysz swoją twarz na lewym panelu. Gdy EsperantAI wykryje twoją twarz, wskaźniki Yaw / Pitch / Roll zaczną pokazywać wartości.

### Krok 4: Kreator kalibracji (Pro+)

Jeśli masz licencję Pro lub Pro+, **Kreator kalibracji** uruchamia się automatycznie przy pierwszym użyciu. Mierzy twój naturalny zakres ruchu i ustawia optymalną czułość. Możesz uruchomić go ponownie w dowolnym momencie za pomocą przycisku **Recalibrate**.

---

## Połącz swoje oprogramowanie do streamingu

### OBS Studio

1. W OBS: **Tools → WebSocket Server Settings**
2. Włącz WebSocket. Zapisz hasło, jeśli je ustawiłeś.
3. W EsperantAI: panel **Connection**
4. Oprogramowanie do streamingu: **OBS Studio**
5. WebSocket URL: `ws://127.0.0.1:4455` (domyślne)
6. Hasło: to, które ustawiłeś w OBS
7. Kliknij **Connect**

### Streamlabs Desktop

1. W Streamlabs: **Settings → Remote Control**
2. Włącz Remote Control
3. Zapisz API Token
4. W EsperantAI: oprogramowanie do streamingu: **Streamlabs Desktop**
5. API Token: wklej go
6. Port: `59650` (domyślny)
7. Kliknij **Connect**

### vMix

1. W vMix: **Settings → Web Controller**
2. Włącz Web Controller. Domyślny port: 8088.
3. W EsperantAI: oprogramowanie do streamingu: **vMix**
4. Host: `127.0.0.1`
5. Port: `8088`
6. Kliknij **Connect**

### PRISM Live Studio

1. PRISM Live Studio v4.0.5+ wymaga ręcznej instalacji wtyczki obs-websocket
2. Pobierz `obs-websocket` z [forum OBS](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/)
3. Skopiuj ją do folderu wtyczek PRISM
4. Uruchom ponownie PRISM
5. Włącz WebSocket w **Tools → WebSocket Server Settings**
6. W EsperantAI: oprogramowanie do streamingu: **PRISM Live Studio** (działa tak samo jak OBS)

### XSplit Broadcaster (beta)

1. Zainstaluj rozszerzenie „Remote xjs" w XSplit (Settings → Extensions)
2. Włącz Remote w preferencjach
3. W EsperantAI: oprogramowanie do streamingu: **XSplit**
4. Remote xjs Proxy URL: `ws://127.0.0.1:5555/xjs` (domyślne)
5. Kliknij **Connect**

> XSplit jest w fazie **beta**. Zaawansowane funkcje mogą być ograniczone.

---

## Konfiguracja gestów i scen

Po połączeniu sceny twojego oprogramowania pojawią się automatycznie na listach rozwijanych w panelu **Triggers**.

### Podstawowe mapowanie

1. Dla każdego gestu (np. „Look Left") wybierz scenę z listy rozwijanej
2. Gdy wykonasz ten gest i utrzymasz go stabilnie przez ~150 ms, EsperantAI przełączy scenę w twoim oprogramowaniu do streamingu
3. Zmiana jest automatyczna i niemal natychmiastowa

### Wiele akcji (Pro+)

Z licencją Pro lub Pro+ jeden gest może uruchomić **wiele akcji** jednocześnie:
- Przełączyć scenę + odtworzyć dźwięk + wyświetlić nakładkę + wysłać wiadomość na czacie

### Włącz / wyłącz kategorie

Każda kategoria ma własne pole wyboru „Enable":

- 🧠 **Rotacja głowy** (uniwersalna — włączona domyślnie)
- 📏 **Odległość twarzy** (zbliżenie/oddalenie)
- 👁️ **Kierunek wzroku** (ruch samymi oczami)
- 😀 **Emocje** (uśmiech, zdziwienie, złość, neutralna)
- 👁️‍🗨️ **Podwójne mrugnięcie**
- ✋ **Gesty rąk** (kulturowe — wyłączone domyślnie)

Wyłącz kategorie, których nie potrzebujesz, aby oszczędzić CPU.

---

## Kategorie gestów

### 🌐 Uniwersalne (to samo znaczenie w każdej kulturze)

| Gest | Oś | Jak aktywować |
|---|---|---|
| Centrum | — | Patrzeć prosto, twarz stabilna |
| Spojrzenie w lewo | ujemny yaw | Obrócić głowę w lewo |
| Spojrzenie w prawo | dodatni yaw | Obrócić głowę w prawo |
| Spojrzenie w górę | ujemny pitch | Podnieść twarz |
| Spojrzenie w dół | dodatni pitch | Opuścić twarz |
| Przechył w lewo | ujemny roll | Przechylić głowę w stronę lewego ramienia |
| Przechył w prawo | dodatni roll | Przechylić głowę w stronę prawego ramienia |
| Zbliżenie | odległość | Zbliżyć twarz do kamery |
| Oddalenie | odległość | Oddalić twarz od kamery |
| Kierunek wzroku | wzrok | Poruszać tylko oczami (głowa wycentrowana) |
| Uśmiech | emocja=happy | Wyraźnie się uśmiechnąć |
| Zdziwienie | emocja=surprise | Wyrazić zdziwienie |
| Złość | emocja=angry | Wyrazić złość |
| Neutralna | emocja=neutral | Zrelaksowana twarz |
| Podwójne mrugnięcie | mrugnięcie | Szybko zamknąć obie oczy dwukrotnie (< 700 ms) |

### ⚠️ Kulturowe (znaczenie zależy od kraju)

| Gest | Znaczenie na Zachodzie | Uwaga w innych kulturach |
|---|---|---|
| 👍 Kciuk w górę | Zgoda, aprobata | Bliski Wschód / Azja Zachodnia: może być obraźliwy |
| ✌️ Znak pokoju | Pokój / zwycięstwo | UK / Irlandia / Australia (dłoń do wewnątrz): obelga |
| 🤘 Znak rocka | Rock, metal | Włochy (dłoń w dół): „cornuto" (obelga) |
| 👌 OK | OK / idealnie | Brazylia / Turcja / Niemcy: może być obraźliwy. **Uwaga: w Polsce gest OK (👌) budzi kontrowersje i może być odebrany negatywnie — zaleca się ostrożność przy używaniu tego gestu przed polską widownią.** |
| ✊ Zaciśnięta pięść | Zależy od kontekstu politycznego | — |
| 🖐️ Otwarta dłoń | „Stop" lub powitanie | Grecja (mountza w czyjąś stronę): silna obelga |
| ☝️ Wskazywanie | Wskazać coś | Azja: wskazywanie palcem jest niegrzeczne |

EsperantAI oznacza każdy gest odpowiednim symbolem w interfejsie. Wybieraj, których używać, kierując się swoją globalną widownią.

### 🙏 Gassho (合掌)

Specjalny gest: dłonie złączone razem przed klatką piersiową (jak do modlitwy lub ukłonu powitalnego). Pospolity w kulturach Azji Wschodniej jako znak szacunku lub wdzięczności. Wykrywany z wysoką niezawodnością przy użyciu 6 punktów kontrolnych.

---

## Połącz platformy streamingowe

Aby EsperantAI odbierał zdarzenia (dotacje, subskrypcje, rajdy), połącz platformy, na których streamujesz.

### Twitch

1. Utwórz Client ID na https://dev.twitch.tv/console
2. Zarejestruj redirect URI: `https://edugame.digital/oauth-callback.html` (lub swój lokalny URL)
3. W EsperantAI: panel **Platform Events** → **Twitch EventSub**
4. Wklej swój Client ID
5. Kliknij **Connect**
6. Otworzy się okno autoryzacji Twitch. Zaakceptuj uprawnienia.
7. Okno się zamknie i zobaczysz „Twitch Connected"

### YouTube Live

1. Utwórz poświadczenia na https://console.cloud.google.com
2. Włącz YouTube Data API v3
3. Utwórz OAuth Client ID (typ: Web Application)
4. Zarejestruj ten sam redirect URI co dla Twitcha
5. W EsperantAI: panel **Platform Events** → **YouTube Live**
6. Wklej swój Client ID i kliknij **Connect**

### Kick

1. Utwórz aplikację na https://kick.com/settings/developer
2. Zarejestruj redirect URI
3. W EsperantAI: panel **Platform Events** → **Kick**
4. Wklej swój Client ID i kliknij **Connect**
5. Kick używa OAuth 2.1 z PKCE (bezpieczniejsze)

### StreamElements (most wieloplatformowy)

Jeśli masz już konto StreamElements, możesz połączyć Twitch + YouTube + Facebook za pomocą jednego tokena:

1. Przejdź na https://streamelements.com/dashboard/account/channels
2. Skopiuj swój JWT Token
3. W EsperantAI: panel **Platform Events** → **StreamElements**
4. Wklej JWT i kliknij **Connect**

---

## Kombo: zdarzenie + gest (Zaawansowane)

To jest magia EsperantAI: łączenie **zdarzeń platformy** z **twoimi gestami** jako potwierdzeniem.

### Przykład: podziękowanie za dotację gestem kciuka w górę

1. Panel **Event Triggers** → wiersz „💰 Donation"
2. ✅ Włącz
3. Scena: `Thank_You_Scene`
4. Wymagany gest: `👍 Thumbs up`

**Przebieg na żywo**:
- Nadchodzi dotacja → EsperantAI wyświetla „Waiting for gesture..."
- Masz 5 sekund na wykonanie 👍
- Jeśli wykonasz → przełącza na `Thank_You_Scene` + uruchamia inne skonfigurowane akcje
- Jeśli nie → zdarzenie jest automatycznie odrzucane

### Bez wymaganego gestu (automatyczny wyzwalacz)

Jeśli zostawisz „Required gesture" jako `— none —`, zdarzenie uruchomi akcję natychmiast.

Przydatne do:
- Automatycznego przełączania na scenę celebracji, gdy nadchodzi rajd
- Automatycznego wyświetlania nakładki, gdy ktoś zasubskrybuje

---

## Czułość i martwa strefa

### Czułość

Progi kontrolują, jak wyraźny musi być gest, aby uruchomić wyzwalacz:

- **Yaw**: jak mocno obrócić głowę w bok (domyślnie: 0,15 rad ≈ 8,6°)
- **Pitch w górę/w dół**: pionowe pochylenie
- **Roll**: boczne pochylenie

Zwiększ wartości dla bardziej wyrazistych gestów. Zmniejsz dla większej czułości.

### Martwa strefa (ochrona przed zmęczeniem)

Jeśli jesteś niemal wycentrowany (yaw < 0,05, pitch < 0,05, roll < 0,08), **NIC się nie uruchamia**. Dzięki temu możesz poruszać się naturalnie, nie aktywując wyzwalaczy mikroruchami.

### Stabilne klatki

`Stable frames` = ile kolejnych klatek gest musi być utrzymywany przed uruchomieniem. Domyślnie: 5 klatek (~150 ms przy 30 fps).

Zwiększ, jeśli wyzwalacze aktywują się zbyt łatwo. Zmniejsz dla szybszej reakcji.

### Odnowienie

`Cooldown (ms)` = minimalny czas między zmianami scen. Domyślnie: 500 ms.

Zapobiega „nerwowemu" przełączaniu, gdy szybko oscylujesz między gestami.

---

## Skróty klawiszowe

| Klawisz | Akcja |
|---|---|
| `Spacja` | Wstrzymaj / Wznów wykrywanie |
| `C` | Ręczne przejście do sceny CENTER |
| `R` | Przeładuj listę scen z oprogramowania |
| `Esc` | Rozłącz |

---

## Historia wyzwalaczy

Panel **Advanced → Trigger History** pokazuje ostatnie 50 uruchomionych akcji:

- ✓ zielony = udana
- ✗ czerwony = nieudana
- · szary = oczekująca

Przydatne do sprawdzania, co uruchomiło wyzwalacze, bez otwierania DevTools.

**Eksport CSV**: pobierz historię do analizy offline.

**Wyczyść**: usuń historię (nie wpływa na nic innego).

---

## Zmiana języka

EsperantAI automatycznie wykrywa język twojego systemu operacyjnego. Aby zmienić go ręcznie:

- W prawym górnym rogu: lista rozwijana języków
- Wybierz preferowany język
- Interfejs zaktualizuje się natychmiast

Dostępne języki:
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

Wszystkie 13 języków jest w pełni przetłumaczonych (po 342 klucze).

---

## Zarządzanie licencją

Panel **Advanced → License**:

- **Wyświetl status**: Ważna / Nieważna
- **Wyświetl powiązany e-mail klienta**
- **Wyświetl ostatnią walidację online**
- **Deactivate on this device**: użyj przed zmianą komputera lub aby zwolnić miejsce (z 3 dostępnych)

### Zwroty środków

Jeśli EsperantAI nie spełnia twoich oczekiwań, masz **14 dni** od zakupu na żądanie pełnego zwrotu. Napisz na soporte@edugame.digital, podając swój klucz licencyjny.

---

## Rozwiązywanie problemów

### „Activation required" nie znika po wklejeniu klucza licencyjnego

- Sprawdź, czy skopiowałeś kompletny klucz (5 grup po 4 znaki oddzielone myślnikami)
- Sprawdź połączenie z internetem (aktywacja wymaga weryfikacji online przy pierwszym uruchomieniu)
- Jeśli aktywowałeś już na 3 urządzeniach, najpierw dezaktywuj jedno z nich
- Skontaktuj się z soporte@edugame.digital, jeśli problem utrzymuje się

### „Searching for face..." nie znika, mimo że twarz jest widoczna

- Popraw oświetlenie: twoja twarz powinna być dobrze oświetlona
- Zbliż się do kamery (optymalnie 40–80 cm)
- Zamknij inne karty używające GPU (Chrome może ograniczać GPU, gdy jest ich zbyt wiele)
- Jeśli w Chrome aktywny jest Memory Saver, wyłącz go dla tej karty

### Sceny nie pojawiają się na listach rozwijanych

- Sprawdź, czy jesteś połączony z oprogramowaniem do streamingu (zielony znacznik „Connected")
- Naciśnij `R`, aby przeładować listę scen
- Jeśli nadal pusto, rozłącz i połącz ponownie

### Zmiany scen uruchamiają się bez wykonywania gestów

- Zwiększ próg yaw / pitch / roll w panelu **Sensitivity**
- Zwiększ `Stable frames` z 5 do 8–10
- Upewnij się, że martwa strefa jest skonfigurowana (yaw 0,05, pitch 0,05, roll 0,08)
- Sprawdź, czy w kadrze nie ma innej osoby (wiele twarzy może powodować niestabilność)

### Opóźnienie wykrywania

- Zamknij obciążające aplikacje (gry, montaż wideo)
- Sprawdź, czy używasz dedykowanego GPU, jeśli go posiadasz (nie zintegrowanego)
- Zmniejsz rozdzielczość kamery, jeśli jest 4K (1080p jest optymalne do wykrywania)

### OBS nie reaguje, mimo że EsperantAI pokazuje „Scene changed"

- Sprawdź, czy nazwa sceny na liście rozwijanej DOKŁADNIE odpowiada tej w OBS (wielkość liter ma znaczenie)
- Sprawdź, czy scena nie znajduje się w innej Scene Collection
- Sprawdź panel **Trigger History** — jeśli wyświetla ✗ czerwony, oznacza to konkretny błąd

### Błąd „OBS unreachable — Connect manually"

- Sprawdź, czy OBS jest otwarty
- Sprawdź, czy WebSocket jest włączony w OBS
- Jeśli ustawiłeś hasło w OBS, musi ono dokładnie pasować
- Niektóre programy antywirusowe blokują port 4455 — dodaj wyjątek

---

## Prywatność

### Czego EsperantAI NIE robi

- ❌ NIE wysyła twojego wideo na żaden serwer
- ❌ NIE zapisuje twojego wideo ani zrzutów
- ❌ NIE zbiera danych biometrycznych zdalnie
- ❌ NIE udostępnia danych reklamodawcom ani stronom trzecim

### Co PRZETWARZA

- ✅ Lokalne wykrywanie twarzy w twojej przeglądarce (Human.js + WebGL)
- ✅ Lokalne połączenia z twoim OBS / Streamlabs / vMix (loopback 127.0.0.1)
- ✅ Okresowa walidacja klucza licencyjnego (co 7 dni)
- ✅ Jeśli połączysz Twitch/YouTube/Kick: tokeny OAuth w sessionStorage (usuwane po zamknięciu przeglądarki)

Szczegóły w `docs/PRIVACY.html`.

---

## Pomoc techniczna

- 📧 E-mail: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Dokumentacja techniczna: https://github.com/salazarjoelo/EsperantAI

Czas odpowiedzi:
- Pytania ogólne: 24–72 godziny
- Błędy techniczne: 1–3 dni robocze
- Żądania zwrotu: 1–2 dni robocze

---

*Ostatnia aktualizacja: 2026-05-14. Wersja: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
