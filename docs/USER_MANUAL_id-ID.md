# EsperantAI — Panduan Pengguna

> **Gestur jujur.** Kontrol software streaming Anda dengan wajah dan tangan. Tanpa Stream Deck. Tanpa perangkat tambahan.

**Versi**: 3.0 · **Bahasa**: Bahasa Indonesia (terjemahan tersedia dalam 12 bahasa lainnya)

---

## Daftar Isi

1. [Apa itu EsperantAI?](#apa-itu-esperantai)
2. [Persyaratan Minimum](#persyaratan-minimum)
3. [Pembelian & Aktivasi](#pembelian--aktivasi)
4. [Penggunaan Pertama](#penggunaan-pertama)
5. [Hubungkan Software Streaming Anda](#hubungkan-software-streaming-anda)
6. [Konfigurasi Gestur & Scene](#konfigurasi-gestur--scene)
7. [Kategori Gestur](#kategori-gestur)
8. [Hubungkan Platform Streaming](#hubungkan-platform-streaming)
9. [Kombinasi Event + Gestur (Lanjutan)](#kombinasi-event--gestur-lanjutan)
10. [Sensitivitas & Dead Zone](#sensitivitas--dead-zone)
11. [Pintasan Keyboard](#pintasan-keyboard)
12. [Riwayat Trigger](#riwayat-trigger)
13. [Ganti Bahasa](#ganti-bahasa)
14. [Kelola Lisensi Anda](#kelola-lisensi-anda)
15. [Pemecahan Masalah](#pemecahan-masalah)
16. [Privasi](#privasi)
17. [Dukungan](#dukungan)

---

## Apa itu EsperantAI?

EsperantAI adalah **aplikasi web** yang menggunakan kecerdasan buatan untuk mendeteksi gestur wajah dan tangan Anda secara real-time, dan menerjemahkannya menjadi perintah untuk software streaming Anda. Bekerja dengan:

- **OBS Studio** 28+
- **Streamlabs Desktop**
- **vMix**
- **PRISM Live Studio**
- **XSplit Broadcaster** (beta)

Dan menerima event dari platform seperti:

- **Twitch**
- **YouTube Live**
- **Kick**
- **Trovo**
- **StreamElements** (bridge multi-platform)

### Mengapa "gestur jujur"?

Ekspresi wajah dasar dan rotasi kepala **bersifat universal di semua budaya manusia** (Paul Ekman, 1972). Mereka tidak berbohong, tidak bervariasi berdasarkan geografi. EsperantAI menyebutnya gestur "🌐 Universal" dan membedakannya dari gestur "⚠️ Kultural" (isyarat tangan), yang maknanya dapat bervariasi berdasarkan negara.

Anda memutuskan gestur mana yang akan digunakan berdasarkan audiens Anda.

---

## Persyaratan Minimum

### Hardware

- **Webcam USB apa pun** (disarankan: 1080p atau lebih tinggi)
- **CPU**: prosesor 4+ core dari 5 tahun terakhir
- **RAM**: 8 GB minimum. 16 GB disarankan jika streaming secara bersamaan.
- **GPU**: apa pun dengan dukungan WebGL (bahkan GPU terintegrasi modern bekerja)

### Software

- **OS**: Windows 10/11, macOS 12+, atau Linux dengan kernel terbaru
- **Browser**: Chrome 90+, Edge 90+, atau Firefox 100+
- **Software streaming** (setidaknya satu): OBS Studio 28+, Streamlabs Desktop, vMix, PRISM, XSplit

### Internet

- Diperlukan untuk **mengaktivasi lisensi** dan setiap **7 hari** untuk validasi ulang
- Bekerja **hingga 7 hari offline** (masa tenggang)

---

## Pembelian & Aktivasi

1. Kunjungi **https://edugame.digital**
2. Klik **"Beli Lisensi"**
3. Selesaikan pembayaran melalui LemonSqueezy (kartu, PayPal, dll.)
4. Anda akan menerima email berisi:
   - **Kunci lisensi** Anda (format: `XXXX-XXXX-XXXX-XXXX-XXXX`)
   - Tautan untuk menggunakan EsperantAI
5. Buka EsperantAI di browser Anda
6. Layar aktivasi akan muncul. Tempel kunci lisensi Anda
7. Klik **"Aktivasi Lisensi"**
8. Selesai! 🎉

### Berapa banyak perangkat?

Satu lisensi dapat diaktivasi di **hingga 3 perangkat**. Untuk memindahkan lisensi ke perangkat lain:

1. Di perangkat lama: panel **Lanjutan** → **Lisensi** → **Nonaktifkan di perangkat ini**
2. Di perangkat baru: aktivasi secara normal

---

## Penggunaan Pertama

### Langkah 1: Izinkan akses kamera

Saat Anda membuka EsperantAI untuk pertama kali, browser akan meminta izin kamera. **Terima**.

> Penting: EsperantAI tidak pernah mengirim video Anda ke server mana pun. Pemrosesan 100% lokal di komputer Anda.

### Langkah 2: Pilih kamera

Jika Anda memiliki lebih dari satu kamera, pilih mana yang akan digunakan dari dropdown kamera.

### Langkah 3: Verifikasi deteksi

Anda akan melihat wajah Anda di panel kiri. Saat EsperantAI mendeteksi wajah Anda, indikator Yaw / Pitch / Roll akan mulai menampilkan nilai.

### Langkah 4: Wizard Kalibrasi (Pro+)

Jika Anda memiliki lisensi Pro atau Pro+, **Wizard Kalibrasi** diluncurkan secara otomatis saat pertama kali digunakan. Wizard mengukur rentang gerakan alami Anda dan mengatur sensitivitas optimal. Anda dapat menjalankannya kembali kapan saja dari tombol **Kalibrasi Ulang**.

---

## Hubungkan Software Streaming Anda

### OBS Studio

1. Di OBS: **Tools → WebSocket Server Settings**
2. Aktifkan WebSocket. Catat password jika Anda mengaturnya.
3. Di EsperantAI: panel **Koneksi**
4. Software streaming: **OBS Studio**
5. WebSocket URL: `ws://127.0.0.1:4455` (default)
6. Password: yang Anda atur di OBS
7. Klik **Hubungkan**

### Streamlabs Desktop

1. Di Streamlabs: **Settings → Remote Control**
2. Aktifkan Remote Control
3. Catat API Token
4. Di EsperantAI: Software streaming: **Streamlabs Desktop**
5. API Token: tempel
6. Port: `59650` (default)
7. Klik **Hubungkan**

### vMix

1. Di vMix: **Settings → Web Controller**
2. Aktifkan Web Controller. Port default: 8088.
3. Di EsperantAI: Software streaming: **vMix**
4. Host: `127.0.0.1`
5. Port: `8088`
6. Klik **Hubungkan**

### PRISM Live Studio

1. PRISM Live Studio v4.0.5+ memerlukan instalasi manual plugin obs-websocket
2. Unduh `obs-websocket` dari [forum OBS](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/)
3. Salin ke folder plugin PRISM
4. Mulai ulang PRISM
5. Aktifkan WebSocket di **Tools → WebSocket Server Settings**
6. Di EsperantAI: Software streaming: **PRISM Live Studio** (bekerja sama seperti OBS)

### XSplit Broadcaster (beta)

1. Instal ekstensi "Remote xjs" di XSplit (Settings → Extensions)
2. Aktifkan Remote di preferensi
3. Di EsperantAI: Software streaming: **XSplit**
4. Remote xjs Proxy URL: `ws://127.0.0.1:5555/xjs` (default)
5. Klik **Hubungkan**

> XSplit dalam **beta**. Fitur lanjutan mungkin terbatas.

---

## Konfigurasi Gestur & Scene

Setelah terhubung, scene aktual dari software Anda akan muncul secara otomatis di dropdown panel **Trigger**.

### Pemetaan dasar

1. Untuk setiap gestur (mis., "Lihat Kiri"), pilih scene dari dropdown
2. Saat Anda membuat gestur tersebut dan menahannya stabil selama ~150ms, EsperantAI akan beralih ke scene tersebut di software streaming Anda
3. Perubahan bersifat otomatis dan hampir instan

### Multi-aksi (Pro+)

Dengan lisensi Pro atau Pro+, satu gestur dapat memicu **beberapa aksi** secara bersamaan:
- Ganti scene + putar suara + tampilkan overlay + kirim pesan chat

### Aktifkan / nonaktifkan kategori

Setiap kategori memiliki checkbox "Aktifkan" sendiri:

- 🧠 **Rotasi kepala** (universal — diaktifkan secara default)
- 📏 **Jarak wajah** (mendekat/menjauh)
- 👁️ **Pandangan** (gerakkan hanya mata)
- 😀 **Emosi** (tersenyum, terkejut, marah, netral)
- 👁️‍🗨️ **Kedipan ganda**
- ✋ **Gestur tangan** (kultural — dinonaktifkan secara default)

Nonaktifkan kategori yang tidak Anda butuhkan untuk menghemat CPU.

---

## Kategori Gestur

### 🌐 Universal (makna sama di semua budaya)

| Gestur | Sumbu | Cara mengaktifkan |
|---|---|---|
| Tengah | — | Melihat ke depan, wajah stabil |
| Lihat Kiri | yaw negatif | Putar kepala ke kiri Anda |
| Lihat Kanan | yaw positif | Putar kepala ke kanan Anda |
| Lihat Atas | pitch negatif | Angkat wajah |
| Lihat Bawah | pitch positif | Turunkan wajah |
| Miring Kiri | roll negatif | Miringkan kepala ke bahu kiri |
| Miring Kanan | roll positif | Miringkan kepala ke bahu kanan |
| Mendekat | jarak | Mendekat ke kamera |
| Menjauh | jarak | Menjauh dari kamera |
| Pandangan | pandangan | Gerakkan hanya mata (kepala di tengah) |
| Tersenyum | emosi=senang | Tersenyum dengan jelas |
| Terkejut | emosi=terkejut | Tunjukkan keterkejutan |
| Marah | emosi=marah | Tunjukkan kemarahan |
| Netral | emosi=netral | Wajah rileks |
| Kedipan ganda | kedipan | Tutup kedua mata dua kali dengan cepat (< 700ms) |

### ⚠️ Kultural (makna bervariasi berdasarkan negara)

| Gestur | Makna Barat | Perhatian di budaya lain |
|---|---|---|
| 👍 Jempol ke atas | Persetujuan | Timur Tengah / Asia Barat: bisa menyinggung |
| ✌️ Damai | Damai / kemenangan | Inggris / Irlandia / Australia (telapak menghadap dalam): hinaan |
| 🤘 Tanda rock | Rock / metal | Italia (telapak menghadap bawah): "cornuto" (hinaan) |
| 👌 OK | OK / sempurna | Brasil / Turki / Jerman: bisa menyinggung |
| ✊ Kepalan tertutup | Bervariasi berdasarkan konteks politik | — |
| 🖐️ Telapak terbuka | "Berhenti" atau sapaan | Yunani (mountza ke arah seseorang): hinaan keras |
| ☝️ Menunjuk | Menunjukkan | Asia: menunjuk dengan jari dianggap tidak sopan |

EsperantAI menandai setiap gestur dengan lencana yang sesuai di UI. Pilih mana yang akan digunakan berdasarkan audiens global Anda.

### 🙏 Gassho (合掌)

Gestur khusus: tekan kedua telapak tangan bersama di depan dada (seperti doa atau bow sapaan). Umum di budaya Asia Timur sebagai tanda hormat atau rasa terima kasih. Terdeteksi dengan keandalan tinggi menggunakan 6 pemeriksaan landmark.

---

## Hubungkan Platform Streaming

Agar EsperantAI menerima event (donasi, subs, raid), hubungkan platform tempat Anda streaming.

### Twitch

1. Buat Client ID di https://dev.twitch.tv/console
2. Daftarkan redirect URI: `https://edugame.digital/oauth-callback.html` (atau URL lokal Anda)
3. Di EsperantAI: panel **Event Platform** → **Twitch EventSub**
4. Tempel Client ID Anda
5. Klik **Hubungkan**
6. Jendela otorisasi Twitch akan terbuka. Terima izinnya.
7. Jendela akan tertutup dan Anda akan melihat "Twitch Terhubung"

### YouTube Live

1. Buat kredensial di https://console.cloud.google.com
2. Aktifkan YouTube Data API v3
3. Buat OAuth Client ID (tipe: Aplikasi Web)
4. Daftarkan redirect URI yang sama dengan Twitch
5. Di EsperantAI: panel **Event Platform** → **YouTube Live**
6. Tempel Client ID Anda dan klik **Hubungkan**

### Kick

1. Buat aplikasi di https://kick.com/settings/developer
2. Daftarkan redirect URI
3. Di EsperantAI: panel **Event Platform** → **Kick**
4. Tempel Client ID Anda dan klik **Hubungkan**
5. Kick menggunakan OAuth 2.1 dengan PKCE (lebih aman)

### StreamElements (bridge multi-platform)

Jika Anda sudah memiliki akun StreamElements, Anda dapat menyatukan Twitch + YouTube + Facebook dengan satu token:

1. Buka https://streamelements.com/dashboard/account/channels
2. Salin JWT Token Anda
3. Di EsperantAI: panel **Event Platform** → **StreamElements**
4. Tempel JWT dan klik **Hubungkan**

---

## Kombinasi Event + Gestur (Lanjutan)

Ini adalah keajaiban EsperantAI: menggabungkan **event platform** dengan **gestur Anda** sebagai konfirmasi.

### Contoh: berterima kasih untuk donasi dengan jempol ke atas

1. Panel **Trigger Event** → baris "💰 Donasi"
2. ✅ Aktifkan
3. Scene: `Scene_Terima_Kasih`
4. Gestur yang diperlukan: `👍 Jempol ke atas`

**Alur langsung**:
- Donasi masuk → EsperantAI menampilkan "Menunggu gestur..."
- Anda memiliki 5 detik untuk melakukan 👍
- Jika Anda melakukannya → beralih ke `Scene_Terima_Kasih` + menjalankan aksi lain yang dikonfigurasi
- Jika tidak → otomatis diabaikan

### Tanpa gestur yang diperlukan (trigger otomatis)

Jika Anda membiarkan "Gestur yang diperlukan" sebagai `— tidak ada —`, event langsung memicu aksi.

Berguna untuk:
- Otomatis beralih ke scene perayaan saat raid masuk
- Otomatis menampilkan overlay saat seseorang berlangganan

---

## Sensitivitas & Dead Zone

### Sensitivitas

Threshold mengontrol seberapa besar gestur harus dilakukan untuk memicu:

- **Yaw**: seberapa jauh memutar kepala ke samping (default: 0.15 rad ≈ 8.6°)
- **Pitch atas/bawah**: kemiringan vertikal
- **Roll**: kemiringan lateral

Naikkan nilai untuk gestur yang lebih mencolok. Turunkan untuk sensitivitas lebih tinggi.

### Dead zone (anti-kelelahan)

Jika Anda hampir di tengah (yaw < 0.05, pitch < 0.05, roll < 0.08), **TIDAK ADA yang terpicu**. Ini memungkinkan Anda bergerak secara alami tanpa mikro-pergerakan mengaktifkan trigger.

### Frame stabil

`Frame stabil` = berapa banyak frame berturut-turut gestur harus ditahan sebelum dipicu. Default: 5 frame (~150ms pada 30fps).

Naikkan jika trigger terlalu mudah aktif. Turunkan untuk respons lebih cepat.

### Cooldown

`Cooldown (ms)` = waktu minimum antara perubahan scene. Default: 500ms.

Mencegah switcher menjadi "goyah" jika Anda berosilasi dengan cepat.

---

## Pintasan Keyboard

| Tombol | Aksi |
|---|---|
| `Spasi` | Jeda / Lanjutkan deteksi |
| `C` | Langsung lompat ke scene TENGAH |
| `R` | Muat ulang daftar scene dari software |
| `Esc` | Putuskan koneksi |

---

## Riwayat Trigger

Panel **Lanjutan → Riwayat Trigger** menampilkan 50 aksi terakhir yang dipicu:

- ✓ hijau = berhasil
- ✗ merah = gagal
- · abu-abu = tertunda

Berguna untuk mengaudit apa yang terpicu tanpa membuka DevTools.

**Ekspor CSV**: unduh riwayat untuk analisis offline.

**Bersihkan**: hapus riwayat (tidak memengaruhi hal lain).

---

## Ganti Bahasa

EsperantAI secara otomatis mendeteksi bahasa sistem operasi Anda. Untuk mengubahnya secara manual:

- Sudut kanan atas: dropdown bahasa
- Pilih bahasa yang Anda inginkan
- UI akan segera diperbarui

Bahasa yang tersedia:
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
- 🇮🇳 हिंदी
- 🇮🇩 Bahasa Indonesia

Semua 15 bahasa diterjemahkan secara lengkap.

---

## Kelola Lisensi Anda

Panel **Lanjutan → Lisensi**:

- **Lihat status**: Valid / Tidak Valid
- **Lihat email pelanggan terkait**
- **Lihat validasi online terakhir**
- **Nonaktifkan di perangkat ini**: gunakan sebelum mengganti PC atau untuk membebaskan slot (dari 3 yang tersedia)

### Pengembalian Dana

Jika EsperantAI tidak memenuhi ekspektasi Anda, Anda memiliki **14 hari** sejak pembelian untuk meminta pengembalian dana penuh. Email ke soporte@edugame.digital dengan kunci lisensi Anda.

---

## Pemecahan Masalah

### "Aktivasi diperlukan" tetap muncul setelah menempelkan kunci lisensi

- Verifikasi bahwa Anda menyalin kunci lengkap (5 kelompok 4 karakter dipisahkan tanda hubung)
- Periksa koneksi internet Anda (aktivasi memerlukan validasi online saat pertama kali)
- Jika Anda sudah mengaktivasi di 3 perangkat, nonaktifkan satu terlebih dahulu
- Hubungi soporte@edugame.digital jika masalah berlanjut

### "Mencari wajah..." tetap muncul meskipun wajah saya terlihat

- Perbaiki pencahayaan: wajah Anda harus terlilangi dengan baik
- Mendekat ke kamera (40-80 cm optimal)
- Tutup tab lain yang menggunakan GPU (Chrome dapat membatasi GPU jika terlalu banyak tab terbuka)
- Jika Memory Saver Chrome aktif, nonaktifkan untuk tab ini

### Scene tidak muncul di dropdown

- Verifikasi bahwa Anda terhubung ke software streaming (lencana hijau "Terhubung")
- Tekan `R` untuk memuat ulang daftar scene
- Jika masih kosong, putuskan koneksi dan hubungkan kembali

### Perubahan scene terpicu tanpa saya membuat gestur

- Naikkan threshold yaw / pitch / roll di panel **Sensitivitas**
- Naikkan `Frame stabil` dari 5 ke 8-10
- Pastikan dead zone dikonfigurasi (yaw 0.05, pitch 0.05, roll 0.08)
- Periksa bahwa tidak ada orang lain dalam frame (multi-wajah dapat menyebabkan ketidakstabilan)

### Keterlambatan deteksi

- Tutup aplikasi berat (game, editing video)
- Verifikasi bahwa Anda menggunakan GPU dedicated jika memilikinya (bukan terintegrasi)
- Kurangi resolusi kamera jika 4K (1080p optimal untuk deteksi)

### OBS tidak bereaksi meskipun EsperantAI mengatakan "Scene berubah"

- Verifikasi bahwa nama scene di dropdown sama PERSIS dengan yang ada di OBS (case-sensitive)
- Verifikasi bahwa scene tidak ada di Koleksi Scene lain
- Periksa panel **Riwayat Trigger** — jika menunjukkan ✗ merah, ada kesalahan spesifik

### Error "OBS tidak terjangkau — Hubungkan secara manual"

- Verifikasi bahwa OBS terbuka
- Verifikasi bahwa WebSocket diaktifkan di OBS
- Jika Anda mengatur password di OBS, harus cocok persis
- Beberapa antivirus memblokir port 4455 — tambahkan pengecualian

---

## Privasi

### Apa yang TIDAK dilakukan EsperantAI

- ❌ TIDAK mengirim video Anda ke server mana pun
- ❌ TIDAK menyimpan video atau tangkapan Anda
- ❌ TIDAK mengumpulkan informasi biometrik secara remote
- ❌ TIDAK berbagi data dengan pengiklan atau pihak ketiga

### Apa yang DIPROSES

- ✅ Deteksi wajah lokal di browser Anda (Human.js + WebGL)
- ✅ Koneksi lokal ke OBS / Streamlabs / vMix Anda (loopback 127.0.0.1)
- ✅ Validasi kunci lisensi berkala (setiap 7 hari)
- ✅ Jika Anda menghubungkan Twitch/YouTube/Kick: token OAuth di sessionStorage (dihapus saat browser ditutup)

Detail lengkap di `docs/PRIVACY.html`.

---

## Dukungan

- 📧 Email: **soporte@edugame.digital**
- 🌐 Web: https://edugame.digital
- 📚 Dokumentasi teknis: https://github.com/salazarjoelo/EsperantAI

Waktu respons:
- Pertanyaan umum: 24-72 jam
- Bug teknis: 1-3 hari kerja
- Permintaan pengembalian dana: 1-2 hari kerja

---

*Terakhir diperbarui: 2026-05-14. Versi: 3.0.*
*© 2026 EdugameDigital — Joel Salazar Ramírez. EsperantAI™.*
