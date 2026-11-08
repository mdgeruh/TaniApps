# Changelog

## v0.1.110 — 2026-11-08
Butir kecil: hero (selisih periode setara, notasi ringkas, penjelasan R/C, uji tangkapan layar) dan angka sejajar. Rincian di `docs/HERO.md`.

### Diubah
- **Selisih di hero kini terhadap periode setara** (tanggal 1 sampai tanggal yang sama bulan lalu, bukan bulan penuh), jadi angkanya adil sejak hari-hari awal bulan. Rentang pembanding ada di `title` baris selisih.
- **Notasi ringkas** untuk nilai sangat besar: "Rp 12,3 M" (miliar) dan "Rp 1,2 T" (triliun) pada angka utama, Modal, dan Hasil; nilai penuh di `title` dan dihapus saat mode Tersembunyi.
- **Penjelasan R/C:** ketuk "R/C ratio ⓘ" untuk rumus, acuan (< 1,00 rugi, 1,00–1,29 tipis, ≥ 1,30 sehat), dan status angka saat ini.
- **Angka sejajar:** `font-variant-numeric: tabular-nums` global.
- `js/app.js` (`rpRingkas`, `heroIsi`, handler klik, versi), `index.dev.html`, `css/style.css`, `sw.js` (`buku-kebun-v0_1_110`), `index.html`, `buku-kebun.html` (hasil build), `docs/HERO.md`, `README.md`, `roadmap.md`, `VERSION`.

### Ditambahkan
- `tools/uji-hero.py`: uji otomatis dan tangkapan layar kartu hero (4 skenario × lebar 320/360/390/1440; 41 pemeriksaan).

### Roadmap
- **PWA di hosting HTTPS dan di HP** dicentang: dikonfirmasi pengguna (dipasang dari Vercel dan jalan di HP).
- Saran hero: periode setara, notasi miliaran, penjelasan R/C, dan uji tangkapan layar dicentang; **chip periode dan anggaran di hero dibatalkan** (hero cukup angka utama); sparkline interaktif dan cache agregat tetap terbuka.

### Catatan
- Diuji di Chromium headless: 41 pemeriksaan hero; semua halaman tanpa galat JavaScript dan tanpa overflow di 390 dan 1440 px. Belum diuji di pembaca layar.

## v0.1.109 — 2026-11-08
Pilihan nyala/mati dua tombol diganti saklar. Aturan di `docs/STYLE.md` (bagian Saklar).

### Diubah
- Setelan → Tampilan → **Efek kaca**: tombol Mati/Nyala menjadi saklar (tulisan Mati/Nyala di sebelahnya).
- Setelan → Preferensi → **Angka untung saat dibuka**: tombol Tampil/Tersembunyi menjadi saklar (nyala = angka rupiah disamarkan; tulisan Tampil/Tersembunyi di sebelahnya). Teks bantuan disesuaikan ("Nyalakan agar…").
- Saklar memakai gaya `.sw` yang sama dengan Sinkron otomatis (`role="switch"`, `aria-checked`, `aria-label`, area ketuk ±40 px); bisa dengan Spasi atau Enter, dan fokus keyboard tetap di saklar setelah halaman digambar ulang. Nilai pengaturan tidak berubah (`kaca` dan `sembunyi` tetap true/false), jadi pilihan yang sudah tersimpan tetap berlaku.
- `js/setelan.js` (`saklar()`, penanganan klik), `js/app.js` (versi), `sw.js` (`buku-kebun-v0_1_109`), `index.html`, `buku-kebun.html` (hasil build), `docs/STYLE.md`, `docs/SETELAN.md`, `README.md`, `roadmap.md`, `VERSION`.

### Tidak diubah (sengaja)
- Pilihan dua tombol yang bukan nyala/mati dibiarkan sebagai tombol pilihan: Skema (Hijau Padi / Emas Klasik), Format tanggal, Rentang tren (6 / 12 bulan), Masuk / Buat akun, Unit / Komoditas, dan Modal / Hasil di formulir catat. Pilihan tiga opsi atau lebih (Mode, Ukuran tampilan, Ingatkan catatan jurnal) juga tetap. Kotak centang persetujuan sinkron tetap kotak centang.
- Sinkron otomatis sudah berupa saklar sejak v0.1.108.

### Catatan
- Diuji di Chromium 390 px: kedua saklar muncul, tombol lama hilang, klik/Spasi/Enter bekerja, efek kaca dan penyamaran angka berlaku, pilihan tersimpan setelah muat ulang, lebar halaman tidak melebar, tanpa galat JavaScript. Dipindai seluruh halaman dan modal Rencana: tidak ada pasangan nyala/mati dua tombol lain. Belum diuji di HP sungguhan.

## v0.1.108 — 2026-11-08
Sinkron otomatis memakai saklar (toggle) biasa, bukan dua tombol Aktif/Mati.

### Diubah
- Setelan → Akun dan sinkron → **Sinkron otomatis**: dua tombol "Aktif" dan "Mati" diganti satu saklar (`role="switch"`, `aria-checked`) dengan tulisan Aktif/Mati di sebelahnya. Aktif = jalur hijau dengan kenop di kanan; mati = jalur berbingkai dengan kenop di kiri, jelas terlihat di tema terang, gelap, dan efek kaca (sebelumnya status tombol hampir tidak terbaca pada efek kaca).
- Mengetuk saklar langsung berlaku tanpa menggambar ulang halaman, sehingga fokus keyboard tetap di saklar; Spasi dan Enter juga bisa. Area ketuk ±40 px. Menyalakan saklar langsung menjadwalkan sinkron; pilihan tersimpan setelah muat ulang.
- `js/sinkron.js`, `css/style.css` (kelas `.sw`, bisa dipakai pilihan hidup/mati lain), `js/app.js` (versi), `sw.js`, `index.html`, `buku-kebun.html` (hasil build), `docs/AKUN.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Pilihan hidup/mati lain di Setelan (misalnya Efek kaca Mati/Nyala dan Angka untung Tampil/Tersembunyi) masih berupa dua tombol; saklar `.sw` siap dipakai bila ingin diseragamkan.
- Diuji di Chromium (HP): ketuk, Spasi, Enter, penyimpanan, muat ulang, dan tangkapan layar tema terang, gelap, serta gelap + kaca; tanpa galat JavaScript.

## v0.1.107 — 2026-11-08
Fase 6F Tahap 1: Layar Akun (Masuk dan Buat akun) dengan mode lokal sebagai bawaan. Rancangan: docs/AKUN.md.

### Ditambahkan
- **Layar Akun** (modal): Masuk, Buat akun (kata sandi minimal 8 karakter, indikator kekuatan, kotak persetujuan), dan Cek email bila server meminta konfirmasi. Tombol tampil/sembunyi kata sandi, `autocomplete` yang benar, Enter mengirim, jebakan Tab, Esc dan Kembali menutup.
- **Label status di header** (tombol): Mode lokal, Menyinkronkan…, Tersinkron HH:MM, Belum sinkron, Gagal sinkron, Menunggu internet. Ketuk untuk membuka Layar Akun atau Setelan.
- **Pesan galat berbahasa Indonesia** (`Sinkron.galatId`) untuk sandi salah, email belum dikonfirmasi, sudah terdaftar, batas kecepatan, server bermasalah, dan tanpa jaringan; validasi email dan kata sandi di klien.
- `docs/AKUN.md` (rancangan, keadaan, pesan, keamanan); Fase 6F di roadmap (Tahap 1–6).

### Diubah
- Kartu Setelan "Sinkron cloud (opsional)" menjadi **Akun dan sinkron**: tanpa akun menampilkan Mode lokal dengan tombol Masuk dan Buat akun; alamat proyek dan kunci pindah ke bagian **Lanjutan (untuk pengelola)** dengan tombol Pakai bawaan aplikasi.
- Keluar kini tombol tersendiri ("Keluar: kembali ke mode lokal; data di perangkat tetap ada").
- `js/sinkron.js`, `js/app.js` (versi), `css/style.css`, `sw.js`, `index.html`, `buku-kebun.html` (hasil build), `docs/SINKRON.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji dengan server Supabase tiruan di Chromium (HP): validasi, galat server, masuk, status, keluar, penutupan modal, jebakan Tab, tema terang dan gelap + kaca. Belum diuji pada proyek Supabase sungguhan.
- Kotak centang persetujuan memakai gaya sendiri karena gaya input global menyembunyikan tanda centang bawaan.
- Tahap 2 (kode 6 angka dan lupa kata sandi) butuh templat email Supabase yang memuat kode.

## v0.1.106 — 2026-11-08
**Konfigurasi Supabase bawaan.** Rincian di `docs/SINKRON.md`.

### Diubah
- Setelan → Sinkron cloud kini sudah terisi alamat proyek `https://yvjhovpyopglwlilntdt.supabase.co` dan kunci publishable; pengguna cukup mengisi email dan kata sandi, Daftar (sekali), lalu Masuk. Konfigurasi yang tersimpan pengguna tetap menang atas bawaan; nilai tersimpan yang kosong kembali ke bawaan. Catatan di layar menyesuaikan.

### Catatan
- Kunci publishable memang publik; perlindungan data ada pada login dan RLS (SQL di `docs/SINKRON.md`). Kunci `service_role`/secret tidak boleh dipakai di kode.
- Tidak mengubah skema data. Diubah: `js/sinkron.js`, `js/app.js` (versi), `sw.js` (cache `buku-kebun-v0_1_106`), `index.html`, `buku-kebun.html`, `VERSION`, `README.md`, `roadmap.md`, `docs/SINKRON.md`.
- Diuji di Chromium dengan Supabase tiruan: isian terisi, Masuk memanggil `POST /auth/v1/token?grant_type=password` ke proyek bawaan dengan header `apikey` kunci publishable, galat login tampil, konfigurasi pengguna tidak ditimpa. **Belum diuji ke proyek Supabase sungguhan** (tanpa akses internet di lingkungan ini): keberadaan tabel `tani_data`, kebijakan RLS, dan pengaturan Email perlu dipastikan di dasbor Supabase.

## v0.1.105 — 2026-11-08
**Fase 7 / Jurnal Tahap 7 (sebagian): performa 1.000+ entri diukur dan aksesibilitas diaudit.** Rincian dan angka di `docs/AUDIT.md`.

### Diperbaiki
- Tombol pilihan (chip rentang 6/12 bulan, saringan Semua/Siklus, tab Berjalan/Selesai/Agenda/Jurnal, Periode bulanan/tahunan, sub-tab Rencana, dll.) kini diberi `aria-pressed` agar pilihan aktif terbaca pembaca layar, tidak hanya terlihat dari warna. Modul baru `js/aksesibel.js` menyinkronkannya otomatis tiap tampilan berubah; tombol aksi tidak disentuh.

### Diukur (tanpa perubahan kode)
- 1.500 jurnal + 5.000 transaksi: semua layar di bawah 130 ms; 5.000 jurnal + 20.000 transaksi: di bawah 300 ms, tanpa galat. Linimasa dan Umpan sudah bertahap dan pencarian sudah ditunda, jadi tidak ada optimasi yang diperlukan.
- Audit aksesibilitas otomatis (14 tampilan + modal, terang/gelap) dan uji keyboard (Enter/Spasi, Escape, focus trap, pengumuman toast, tautan lewati): tidak ada temuan selain tombol pilihan di atas.

### Catatan
- Tidak mengubah skema data. Berkas baru `js/aksesibel.js`; diubah `index.dev.html`, `index.html`, `buku-kebun.html`, `sw.js` (cache `buku-kebun-v0_1_105`), `js/app.js` (versi), `VERSION`, `README.md`, `roadmap.md`, `docs/AUDIT.md`.
- Belum diuji: pembaca layar sungguhan, HP berspesifikasi rendah, pembesaran teks 200%, mode kontras tinggi, dan data nyata 1–2 siklus. Data 5,5 MB mendekati batas `localStorage`.

## v0.1.104 — 2026-11-08
**Fase 6E Tahap 7 (sebagian): umpan Jurnal lintas siklus.** Rincian di `docs/JURNAL.md`.

### Ditambahkan
- Chip **Jurnal** di tab Siklus (`js/umpan.js`): semua entri jurnal lintas siklus dengan pencarian kata kunci, saringan jenis, 100 entri bertahap, dan modal detail yang sama dengan linimasa. Rute `#siklus-jurnal`.

### Diubah
- Empat chip tab Siklus tersusun 2 × 2 di HP dan satu baris di layar lebar. Tidak ada perubahan skema data.

## v0.1.103 — 2026-11-08
**Fase 6E Tahap 6 selesai: laporan perjalanan siklus dan pengalaman lintas siklus.** Rincian di `docs/JURNAL.md`.

### Ditambahkan
- **Laporan perjalanan siklus** (`js/perjalanan.js`): tombol Cetak perjalanan / Dengan foto di Ringkasan detail siklus. Dokumen cetak polos berisi ringkasan uang dan modal per kategori, tahap, catatan, kejadian, ukuran, panen, kegiatan, dan evaluasi; foto kecil opsional.
- **Pengalaman lintas siklus** (`js/pengalaman.js`) di modal detail komoditas: panen pertama rata-rata hari ke-N, selisih terhadap umur panen, lama rata-rata tiap tahap, dan tombol Pakai N hari sebagai umur panen (Urungkan tersedia).

### Catatan
- Tidak mengubah skema data. `js/analisa.js` melewati dokumen cetak lain selama laporan perjalanan aktif.

## v0.1.102 — 2026-11-07
**Impor data dengan pratinjau dan toast.** Rincian di `docs/IMPOR.md`.

### Diubah
- **Impor JSON** (Setelan → Data) tidak lagi langsung mengganti data saat berkas dipilih. Pratinjau menampilkan nama dan ukuran berkas, tanggal catatan terbaru, jumlah per koleksi (Sekarang vs Berkas), bagian tidak valid, dan peringatan bila berkas lebih sedikit atau kosong; data baru diganti setelah **Impor dan ganti data**. Berhasil: toast "Impor berhasil: …" dengan **Urungkan**.
- **Impor CSV** (Lainnya): pratinjau berisi baris terbaca, akan diimpor, dilewati, rentang tanggal, total modal dan hasil, kategori baru, baris tanpa kategori, 5 contoh baris, dan **peringatan baris yang sama persis dengan transaksi yang ada** (mencegah impor ganda). Berhasil: toast dengan Urungkan. Baris kosong tidak lagi dihitung sebagai baris dilewati.
- **Pulihkan foto dari ZIP**: pratinjau jumlah foto baru, sudah ada, dan tidak valid sebelum dipulihkan; tanpa foto baru hanya toast.
- Kesalahan impor (JSON tidak valid, format tidak dikenali, kolom CSV hilang) kini juga tampil sebagai toast; berkas JSON dibatasi 20 MB dan CSV 5 MB; kotak berkas dikosongkan agar berkas yang sama bisa dipilih ulang.

### Catatan
- Tidak mengubah skema data. Modul baru `js/impor.js`; `js/app.js` (`pasangData`, `analisaCsv`, `terapkanCsv`, `batalkanCsv`), `js/setelan.js`, `js/cadanganfoto.js` (hitung tanpa menyimpan), `index.dev.html`, `index.html`, `buku-kebun.html`, `sw.js` (cache `buku-kebun-v0_1_102`), `VERSION`, dan dokumen terkait.

## v0.1.101 — 2026-11-07
**Keamanan data multi-tab** (Fase 6D). Rincian di `docs/MULTITAB.md`.

### Masalah
Tab yang terakhir menyimpan menimpa perubahan tab lain tanpa peringatan (PWA terpasang + tab Chrome terbuka bersamaan di HP bisa menghapus catatan secara diam-diam).

### Diperbaiki
- **Gabung 3 arah per entri saat menyimpan:** bila `localStorage` sudah diubah tab lain sejak data dimuat, hasilnya digabung (dasar, tab ini, isi sekarang) alih-alih ditimpa. Bentrok pada entri yang sama: `diubah` terbaru menang. Hapus lunak tersebar; hapus keras (mis. hapus data contoh) tidak dihidupkan kembali oleh tab basi.
- **Pembaruan langsung:** `storage` event (serta `visibilitychange` dan `pageshow` untuk tab yang ditangguhkan) menggabung data tab lain ke memori dan menyegarkan tampilan. Saat modal terbuka atau kursor di kolom isian, tampilan ditunda agar isian tidak hilang.
- **Penggantian sengaja tidak digabung:** impor JSON, pulihkan cadangan, hapus semua data, dan ambil dari cloud memakai `simpan(true)`.
- **Toast bersamaan bertumpuk** (sebelumnya saling menimpa di posisi yang sama).

### Catatan
- Diuji di Chromium dengan beberapa tab satu konteks (16 pemeriksaan, tiga kali berturut-turut stabil): penerimaan lewat storage event, tab basi menyimpan (a1 + b2 + b1 utuh), bentrok entri sama, B lebih baru menang, hapus lunak tersebar, hapus data contoh tidak hidup lagi, formulir terisi tidak rusak, hapus semua (timpa), simpan biasa 2.500 transaksi 12 ms tanpa gabung, gabung 2.500 transaksi ±20–70 ms, tanpa galat JavaScript. Uji Catat cepat (26 pemeriksaan) tetap lolos.
- **Batas:** `localStorage` tidak atomik; dua tab yang menyimpan dalam beberapa milidetik yang sama masih bisa saling menimpa (Chrome menyebarkan isi antar-proses secara asinkron). **Belum diuji** pada PWA terpasang di HP bersama tab Chrome.
- Berkas: `js/app.js`, `js/sinkron.js` (ambil dari cloud = timpa), `sw.js` (cache `buku-kebun-v0_1_101`), `docs/MULTITAB.md` (baru), `README.md`, `roadmap.md`, `VERSION`, `index.html`, `buku-kebun.html` (hasil build).

## v0.1.100 — 2026-11-07
**Catat cepat Jurnal** (Fase 6E Tahap 7, sebagian). Rincian di `docs/JURNAL.md` bagian "Catatan cepat".

### Ditambahkan
- **Chip Catat cepat** di bagian Jurnal pada detail siklus berjalan dan di Linimasa: satu ketukan membuat catatan kegiatan hari ini (jurnal `kegiatan`, `cepat:true`). Chip mengikuti komoditas: Sayur daun/Cabai (Siram, Pupuk, Semprot, Penyiangan, Pindah tanam), Tomat, Lele, Ayam petelur, dan daftar Umum. Tombol **+ Catatan lain** membuka formulir lengkap.
- Toast **Dicatat: nama** dengan **Urungkan** dan **Tambah detail** (membuka Ubah catatan untuk isi atau foto).
- **Setelah menandai jadwal selesai**, toast menawarkan **Tambah catatan** (membuka Ubah catatan untuk entri kegiatan yang baru dibuat) di samping Urungkan.
- Modul baru `js/cepat.js`; ketukan ganda pada chip yang sama dalam 2,5 detik diabaikan; Urungkan memakai hapus lunak agar sinkron konsisten.

### Diperbaiki
- **Toast menyempit setengah layar** (tombol dan teks bertumpuk) karena `left: 50%` pada elemen fixed membatasi lebar; kini `width: max-content` dengan batas lebar layar. Berlaku untuk semua toast.
- `App.toast` kini menerima satu tombol (seperti sebelumnya) atau daftar tombol; toast dengan dua tombol tampil 6,5 detik.

### Catatan
- Diuji di Chromium (HP 390/320/360 px dan desktop 1440 px): 26 pemeriksaan lolos — chip per komoditas, entri hari ini, Urungkan, Tambah detail, + Catatan lain, ketukan ganda, linimasa, tawaran setelah jadwal selesai (Urungkan tetap menghapus entrinya), siklus mulai di masa depan dan siklus selesai tanpa chip, validasi impor, tanpa luapan mendatar, toast muat di 320 px, tanpa galat JavaScript.
- **Belum diuji di HP sungguhan.** Chip tidak bisa diubah pengguna; di layar ≤360 px chip tersusun tiga baris.
- Berkas: `js/cepat.js` (baru), `js/app.js` (toast, versi), `js/jadwal.js`, `js/jurnal.js`, `js/linimasa.js`, `js/siklus.js`, `index.dev.html`, `css/style.css`, `sw.js` (cache `buku-kebun-v0_1_100`), `docs/JURNAL.md`, `docs/DATA-SCHEMA.md`, `README.md`, `roadmap.md`, `VERSION`, `index.html`, `buku-kebun.html` (hasil build).

## v0.1.099 — 2026-11-07
Perbaikan kartu hero di Beranda (rincian di `docs/HERO.md`) dan daftar saran optimasi di roadmap.

### Diperbaiki
- **Angka terpecah di layar sempit.** Di 320–360 px, nilai Modal/Hasil terpecah ke dua atau tiga baris ("Rp" di satu baris, angka di baris lain, bahkan terputus di tengah angka) dan tingginya tidak sama antar kolom; angka utama juga pecah setelah "Rp" untuk nilai miliaran. Kini angka tidak pernah putus: angka utama dikecilkan hingga muat; ringkasan dikecilkan (17→14 px) dan, bila tetap tidak muat, disusun ke bawah. Dihitung ulang saat ukuran berubah, font selesai dimuat, atau mode Tersembunyi diganti.
- **Margin yang menyesatkan.** "margin -9876443%" (tanpa pemisah ribuan, tanda hubung) diganti "< −999%"; modal tanpa hasil menampilkan "belum ada hasil" (sebelumnya "margin —"); tanda minus memakai "−".
- **Selisih bulan lalu.** Disembunyikan selama bulan ini belum punya transaksi (sebelumnya "▼ Rp … dibanding bulan lalu" pada hari pertama bulan, padahal membandingkan dengan bulan penuh).
- **Label sparkline di desktop** kini tepat di bawah titik datanya (label tengah sebelumnya di 50%, titik datanya di 60%).

### Diubah
- **Aksesibilitas:** kartu berlabel, ringkasan `role="group"`, tombol mata memakai `aria-pressed` dan judul yang berganti, teks pembaca layar "naik/turun" pada selisih, `aria-label` sparkline kini menjelaskan arah tren.
- **Performa:** hero hanya dihitung bila kartu terlihat (tab Beranda) dan deret 6 bulan dihitung sekali. Dengan 6.000 transaksi, `ringkas()` di halaman selain Beranda turun dari 3,0 ke 1,1 ms; di Beranda tetap.
- Angka hero dan ringkasan memakai angka lurus lebar tetap (`tabular-nums`) agar tidak bergeser.
- `js/app.js` (`heroIsi`, `fitHero`, `ringkas`), `index.dev.html`, `css/style.css`, `sw.js` (cache `buku-kebun-v0_1_099`), `index.html`, `buku-kebun.html` (hasil build), `docs/HERO.md` (baru), `README.md`, `roadmap.md` (8 saran optimasi hero), `VERSION`.

### Catatan
- Diuji di Chromium headless: lebar 320, 360, 390, 768, 1440 dengan data contoh, untung miliaran, rugi miliaran, dan nol (angka satu baris, ringkasan tidak putus), perubahan ukuran 1440→390, mode Tersembunyi, margin dan selisih, label sparkline, atribut aksesibilitas, 5 lebar × 8 kombinasi tema/kaca tanpa overflow, tanpa galat JavaScript. Belum diuji di HP sungguhan atau pembaca layar.
- Kartu hero di layar sangat sempit (320 px) kini lebih tinggi bila ringkasan disusun ke bawah (±60 px); itu pilihan agar angka tetap utuh.

## v0.1.098 — 2026-11-07
Label versi hanya tampil di kartu **Tentang** pada Setelan.

### Diubah
- Header tidak lagi menampilkan nomor versi (HP dan desktop): baris di bawah judul kini hanya berisi tagline **Manajemen pertanian** (ditambah status sinkron bila sedang masuk akun). Elemen `#versi` dan pengisinya di `js/app.js` dihapus.
- Nomor versi tetap bisa dilihat di **Setelan → Tentang → Versi**.
- `index.dev.html`, `js/app.js`, `sw.js` (nama cache `buku-kebun-v0_1_098`), `index.html`, `buku-kebun.html` (hasil build), `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Kop laporan cetak dan Laporan Jurnal tetap mencantumkan "Aplikasi Buku Kebun v…" agar cetakan bisa ditelusuri ke versinya; beri tahu bila ingin dihapus juga.
- Diuji di Chromium (HP 390 px dan desktop 1440 px) pada 7 halaman: tidak ada nomor versi di header atau kartu hero, kartu Tentang menampilkan versi, tanpa galat JavaScript.

## v0.1.097 — 2026-11-07
Ganti nama aplikasi: **Tani Keuangan** menjadi **Buku Kebun**, tagline **Manajemen pertanian**.

### Alasan
Cakupan aplikasi sudah melampaui keuangan (jurnal siklus, foto, jadwal, harga pasar, kelayakan), sehingga nama baru mewakili "buku kebun" secara utuh.

### Diubah
- Nama dan tagline: judul tab, judul di header (**Buku Kebun**), tagline **Manajemen pertanian**, judul halaman (`Transaksi · Buku Kebun`), panduan cepat, baris Versi dan keterangan skema warna di Setelan, kop laporan cetak, dan tulisan kaki halaman cetak.
- PWA: `manifest.webmanifest` (`name`, `short_name`, `description`) dan nama cache service worker (`buku-kebun-v0_1_097`; cache lama dihapus otomatis saat aktivasi).
- Nama berkas unduhan: `buku-kebun-YYYY-MM-DD.json`, `.xlsx`, `buku-kebun-transaksi-…csv`, `buku-kebun-jurnal-…csv`, `buku-kebun-foto-….zip`, `laporan-buku-kebun-….xls`; indeks cadangan foto memakai `aplikasi: "buku-kebun"`.
- Berkas satu halaman kini `buku-kebun.html` (selain `index.html`); folder paket `buku-kebun/`; skrip `bangun-mandiri.py` menyesuaikan. Berkas `tani-keuangan.html` yang lama boleh dihapus.
- README, roadmap, dan semua dokumen di `docs/` memakai nama baru (entri CHANGELOG sebelumnya dibiarkan sebagai sejarah).

### Tidak diubah (disengaja)
- Kunci penyimpanan internal (`tani.v1`, `tani.setelan`, `tani.cadangan`, `tani.contoh`, `tani.panduan`) dan basis data foto IndexedDB `tani-nota`, agar data pengguna yang sudah ada tetap terbaca. Berkas ekspor lama (JSON, ZIP foto, CSV) tetap bisa diimpor.
- Ikon aplikasi dan palet warna.

### Catatan
- Pengguna yang sudah memasang PWA mungkin masih melihat nama lama di layar utama sampai aplikasi dipasang ulang (nama ikon disimpan oleh sistem saat pemasangan).
- Alamat hosting dan nama folder di server tidak berubah dengan sendirinya; sesuaikan bila ingin.
- Diuji di Chromium (HP dan desktop): semua halaman memuat judul benar, unduhan memakai nama baru, data lama terbaca setelah muat ulang, tanpa galat JavaScript.

## v0.1.096 — 2026-11-07
Perbaikan: dropdown di modal **Tambah unit** (dan **Ubah unit**) masih dropdown bawaan browser.

### Penyebab
- Modal unit/komoditas dibuka dengan isi kosong lalu formulirnya digambar sesudahnya (`dmForm`), sehingga pengubah dropdown dan tanggal kustom (`Form.upgrade`), yang hanya dijalankan saat modal dibuat, tidak mengenai kolom **Jenis**.

### Diubah
- `js/siklus.js`: `dmForm` kini memanggil `Form.upgrade` setelah menggambar, sehingga kolom Jenis memakai dropdown kustom seperti modal lain. Modal komoditas tidak memiliki dropdown, jadi tidak terpengaruh.
- `js/app.js` (versi), `sw.js` (`tani-keuangan-v0_1_096`), `index.html`, `tani-keuangan.html`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium 390 px: pada Tambah unit dan Ubah unit, dropdown asli tersembunyi dan tombol kustom muncul serta bisa dibuka; Tambah komoditas tanpa dropdown. Sekaligus diperiksa 15 modal Rencana (aset, utang, harga, anggaran, saldo awal, jadwal, jurnal, evaluasi, tahap, kejadian, ukuran): tidak ada dropdown atau pemilih tanggal bawaan yang tampil. Modal detail (tanpa isian) dan modal Selesaikan siklus tidak memiliki dropdown. Belum diuji di HP sungguhan.

## v0.1.095 — 2026-11-07
Fase 6E, Tahap 6 (sebagian): **lembar Jurnal di Excel diperbarui dan CSV jurnal**. Dokumen: `docs/EKSPOR.md`.

### Diubah
- **Lembar Jurnal di Excel**: lembar ini sudah ada sejak v0.1.088, tetapi kolom Jenis hanya membedakan Catatan dan Evaluasi sehingga tahap, kejadian, dan ukuran tampil sebagai "Catatan" dan nilai ukuran tidak terbawa. Kini kolomnya: Siklus, Tanggal, Hari ke, **Jenis** (Catatan, Kegiatan, Tahap, Kejadian, Ukuran, Evaluasi), **Rincian** (nama tahap atau jenis kejadian), Judul, Isi, **Nilai ukuran** (angka, bisa dijumlah atau dibuat grafik di Excel), **Satuan**, dan Foto (jumlah).
- Urutan lembar: per siklus (A–Z), tanggal naik di dalam siklus.

### Ditambahkan
- **Ekspor CSV jurnal** (Lainnya → Ekspor Excel → tombol di bawahnya): `tani-jurnal-<tanggal>.csv` dengan kolom `siklus, tanggal (ISO), hari_ke, jenis, rincian, judul, isi, nilai, satuan, foto`; BOM UTF-8 agar Excel membaca huruf dengan benar; tanda kutip, koma, dan baris baru di dalam isi diamankan. Pesan hasil: "N catatan jurnal diekspor ke CSV" atau "Belum ada catatan jurnal untuk diekspor".
- Satu sumber baris (`Kejadian.barisJurnal`) dipakai Excel dan CSV agar isinya selalu sama.

### Perubahan lain
- `js/kejadian.js`, `js/xlsx.js`, `js/app.js` (tombol, teks penjelasan, versi), `sw.js` (`tani-keuangan-v0_1_095`), `index.html`, `tani-keuangan.html`, `docs/EKSPOR.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Belum dikerjakan di Tahap 6: laporan perjalanan siklus yang bisa dicetak dan analisa lintas siklus.
- Foto tidak ikut CSV maupun Excel (hanya jumlahnya); gunakan Cadangkan foto (ZIP).
- Diuji di Chromium: 8 entri (termasuk tahap, kejadian dengan baris baru dan koma, ukuran 24,5 cm) menghasilkan CSV yang terbaca pembaca CSV standar dengan 8 baris, dan lembar Jurnal berisi 8 baris dengan nilai 24.5 di sel angka; berkas xlsx lolos uji CRC; tanpa galat JavaScript. Dibuka langsung di aplikasi Excel atau Google Sheets belum diuji.

## v0.1.094 — 2026-11-07
Fase 6E, **Tahap 6 (sebagian): cadangan foto ke ZIP** — jalan keluar untuk foto yang hanya ada di browser ini. Dokumen: `docs/CADANGAN.md`, `docs/JURNAL.md`.

### Ditambahkan
- **`js/cadanganfoto.js`** (objek `CadFoto`). Setelan → **Foto nota dan jurnal** kini punya tombol **Cadangkan foto (ZIP)** dan **Pulihkan dari ZIP**.
- **ZIP** berisi `indeks.json` (id, nama berkas, tipe, ukuran, dan asal tiap foto: jurnal atau nota beserta tanggal dan siklusnya) dan `foto/<id>.jpg|png|webp`. Dibuat dengan penulis ZIP di `js/xlsx.js` (tanpa kompresi, karena JPEG sudah terkompresi); diperiksa dapat dibuka oleh pembaca ZIP standar (Python `zipfile`, CRC valid).
- **Pulihkan**: foto yang id-nya sudah ada dilewati (aman diulang), yang belum ada ditambahkan; hasilnya dilaporkan ("3 foto dipulihkan, 2 sudah ada, 1 dilewati"). Berkas ditolak dengan pesan jelas bila bukan ZIP, ZIP terkompresi (bukan hasil aplikasi ini), tidak ada `indeks.json`, versi tidak dikenal, atau terpotong. Nama berkas dan id divalidasi (hanya pola `foto/<id>.<jpg|png|webp>`), foto lebih dari 30 MB dilewati.
- **Peringatan cadangan**: info foto di Setelan menyebut cadangan terakhir dan berapa foto yang lebih baru ("Foto belum pernah dicadangkan." atau "…; 2 foto belum dicadangkan."). Waktu cadangan disimpan di penyimpanan perangkat, bukan di data.
- Batas ukuran 250 MB per ZIP (pesan jelas bila lebih); foto lama tetap bisa dihapus lewat "Hapus semua foto".

### Diubah
- `js/foto.js` (info status), `js/setelan.js` (tombol dan teks penjelasan: foto tidak ikut ekspor data dan harus dicadangkan sendiri), `index.dev.html`, `js/app.js` (versi), `sw.js` (`tani-keuangan-v0_1_094`), `index.html`, `tani-keuangan.html`, `docs/CADANGAN.md`, `docs/JURNAL.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Belum dikerjakan di Tahap 6: laporan perjalanan siklus yang bisa dicetak, lembar Jurnal di Excel dan CSV jurnal, dan analisa lintas siklus.
- ZIP tidak terenkripsi dan memuat foto asli yang sudah dikecilkan; simpan di tempat yang aman. Pulihkan hanya menambah foto; keterkaitan foto ke catatan tetap lewat data utama (ekspor/cadangan data), jadi pulihkan data utama dan foto bersamaan bila berganti perangkat.
- Diuji di Chromium: tiga foto (dua jurnal, satu nota) dicadangkan, ZIP valid, dikosongkan lalu dipulihkan (3 baru), diulang (3 sudah ada, 0 baru), dan tiga jenis berkas salah ditolak dengan pesan yang benar, tanpa galat JavaScript. Pemilih berkas dan unduhan di HP sungguhan belum diuji.

## v0.1.093 — 2026-11-06
Fase 6E, **Tahap 5 — kejadian dan ukuran**. Dokumen: `docs/JURNAL.md`, `docs/DATA-SCHEMA.md`.

### Ditambahkan
- **`js/kejadian.js`** (objek `Kejadian`): dua jenis entri jurnal baru pada koleksi `jurnal` yang sudah ada (tanpa perubahan skema; field sudah dikunci di Tahap 0).
  - **Kejadian**: jenis Hama, Penyakit, Cuaca, Perawatan, atau Lainnya + catatan opsional; judul tampil "Hama: Kutu daun…".
  - **Ukuran**: nama (mis. Tinggi, dengan saran nama yang sudah dipakai), nilai (boleh koma desimal, 0 atau lebih), satuan opsional (cm, g, kg…); judul tampil "Tinggi 35 cm".
- Bagian **Kejadian dan ukuran** di detail siklus: tombol Catat kejadian dan Catat ukuran (siklus berjalan), ringkasan jumlah per jenis kejadian beserta kejadian terakhir, dan **grafik mini pertumbuhan** per nama ukuran (nilai terhadap hari ke-N, memakai `Analisa.kurva`; maksimal tiga nama; satu titik menampilkan nilai terakhir dan ajakan mencatat lagi).
- **Hubungan ke uang**: detail catatan kejadian menampilkan transaksi siklus itu pada tanggal yang sama (mis. beli pestisida di hari kejadian hama), atau keterangan bila tidak ada.
- Ubah dan Hapus (dengan Urungkan) lewat modal detail seperti jenis lain; kejadian dan ukuran tampil di Jurnal dan linimasa dengan ikon dan label sendiri (⚠ Kejadian, ↕ Ukuran).

### Diubah
- `js/jurnal.js` (judul, rute Ubah, detail), `js/linimasa.js`, `js/siklus.js`, `js/app.js` (versi), `sw.js` (`tani-keuangan-v0_1_093`), `index.dev.html`, `css` tidak berubah, `index.html`, `tani-keuangan.html`, `docs/JURNAL.md`, `docs/DATA-SCHEMA.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Validasi: nama ukuran wajib (maks. 30 karakter), nilai harus angka 0 atau lebih (pesan galat tampil di dalam modal), satuan maks. 10 karakter, catatan kejadian maks. 2.000 karakter. Siklus selesai tetap baca-saja kecuali evaluasi.
- Belum ada: foto langsung pada kejadian (foto jurnal dipakai di catatan), ekspor kejadian/ukuran ke Excel (Tahap 6), dan perbandingan ukuran antar siklus.
- Diuji di Chromium 390 px: simpan, ubah, validasi, grafik dengan tiga titik, detail dengan transaksi pada tanggal yang sama, linimasa, tanpa galat JavaScript. Belum diuji di HP sungguhan, tema gelap/kaca, atau desktop.

## v0.1.092 — 2026-11-06
Fase 6E, Tahap 4 — foto jurnal (lokal).

### Ditambahkan
- **`js/foto.js`** (objek `Foto`): 1–4 foto per catatan jurnal, memakai penyimpanan IndexedDB modul Nota. Foto dikecilkan ke 1280 px (JPEG, mutu 0,72); berkas asli maks. 30 MB; berkas bukan gambar dan galat kuota memberi pesan jelas. Id foto berawalan `f_`, disimpan di `jurnal.foto`.
- Formulir **Catat/Ubah catatan**: bagian **Foto (opsional, maksimal 4)** dengan gambar kecil, tombol × untuk melepas, dan pilih beberapa foto sekaligus. Catatan boleh hanya berisi foto (judul tampil **Foto catatan**; pesan galat kosong kini "Isi judul, catatan, atau foto"). Batal/Esc membuang foto baru; foto lama yang dilepas dihapus saat Simpan.
- **Galeri kecil** di linimasa (di bawah baris catatan) dan di modal detail catatan; jumlah foto di baris bagian Jurnal pada detail siklus.
- **Penampil layar penuh**: panah kiri/kanan, tombol ‹ ›, geser jari, penghitung "2 / 3", Esc atau Tutup, jebakan Tab, latar gelap (juga di mode kaca).
- **Penanda foto tidak ada di perangkat ini** (data diimpor atau disinkron dari perangkat lain) pada gambar kecil dan di penampil.
- **Hapus catatan berfoto**: foto dihapus setelah jendela Urungkan lewat; Urungkan membatalkan penghapusan foto.
- **Setelan**: baris **Foto nota dan jurnal** (jumlah dan ukuran per jenis, pemakaian dan kuota browser) dan baris **Penyimpanan tetap** (`navigator.storage.persist()`).
- Ekspor Excel: kolom **Foto** (jumlah) di lembar Jurnal.
- Dokumen: `docs/JURNAL.md` (Status Tahap 4), `docs/DATA-SCHEMA.md` (Foto jurnal), `docs/NOTA.md` (dipakai bersama).

### Diubah
- **`Nota.rapikan()`** (syarat Tahap 4): kini membaca rujukan `jurnal.foto` dari catatan yang belum dihapus, sehingga foto jurnal tidak dibersihkan sebagai yatim setelah 30 hari. `Nota` mengekspor `kecilkan`, `simpan`, `ambil`, `semua`, `galat`, `mb`; `Nota.isiInfo` diteruskan ke `Foto.isiInfo`.
- `Rencana.dlgBuka`: formulir boleh punya kait `tutup()` yang dipanggil saat modal ditutup.
- **Hapus semua foto** di Setelan kini menghapus foto nota dan foto jurnal.
- `Jurnal.judul`: catatan hanya berfoto berjudul "Foto catatan".

### Diperbaiki
- `sw.js`: nama cache masih `tani-keuangan-v0_1_089` padahal aplikasi 0.1.091. Sekarang `tani-keuangan-v0_1_092`.
- Penampil foto (nota dan jurnal) di **mode kaca**: latar gelapnya tertimpa gaya kaca sehingga halaman terlihat di belakang foto. Latar kini tetap gelap.

### Catatan
- Diuji di Chromium (Playwright; HP 390 px dan desktop 1440 px, terang, gelap, kaca): 31 pemeriksaan otomatis lulus (pilih dan lepas foto, batas 4, berkas bukan gambar, berkas 31 MB, foto 6000×4000 → 1280 px, simpan, galeri, penampil dan geser, ubah/Batal/Simpan, hapus dengan dan tanpa Urungkan, `rapikan`, penanda hilang, Setelan, galat kuota yang disimulasikan, Evaluasi tanpa foto, ekspor) ditambah 7 pemeriksaan regresi (catatan tanpa foto, foto nota transaksi, form Tahap dan Evaluasi, Hapus semua foto, semua halaman tanpa overflow/NaN/galat). Ekspor Excel diperiksa memuat kolom Foto.
- **Belum diuji**: kamera HP sungguhan (Android/iOS), format HEIC, dan kuota perangkat nyata. Foto belum ikut cadangan ZIP (Tahap 6).

## v0.1.091 — 2026-11-06
Roadmap Fase 6E, **Tahap 3 selesai**: tiga sisa Tahap pertumbuhan. Dokumen: `docs/JURNAL.md`, `docs/DATA-SCHEMA.md`, `docs/SETELAN.md` (bila ada).

### Ditambahkan
- **Nama tahap bisa diubah**: di formulir **Ubah komoditas** ada lipatan "Nama tahap pertumbuhan" berisi satu isian per tahap (placeholder = nama bawaan). Isian yang diisi menggantikan nama bawaan di formulir tahap, detail siklus, linimasa, kartu siklus, dan Agenda; mengosongkan isian mengembalikan nama bawaan. Disimpan di `komoditas.tahap` (peta kode → nama, maks. 30 karakter); urutan dan kode tetap.
- **Tahap di Agenda**: tiap baris kegiatan atau perkiraan panen menyebut tahap siklusnya ("· Tahap Vegetatif").
- **Pengingat "belum ada catatan"**: pengaturan baru di Setelan (**Ingatkan catatan jurnal**: Mati, 3, 7, atau 14 hari; bawaan **Mati**). Bila hidup, Beranda → Perlu perhatian menampilkan siklus berjalan yang tanggal jurnal terakhirnya (atau tanggal mulai bila belum ada jurnal) sudah lewat batas itu; ketuk membuka siklus. Hanya tampil saat aplikasi dibuka.

### Diubah
- `js/tahap.js` (`paketKom`, `formNama`, `bacaNama`), `js/siklus.js` (form dan simpan komoditas), `js/jadwal.js`, `js/beranda.js`, `js/setelan.js`, `js/app.js` (versi), `sw.js`, `index.html`, `tani-keuangan.html`, `docs/JURNAL.md`, `docs/DATA-SCHEMA.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Pengaturan baru `ingatJurnal` hanya tersimpan di perangkat ini (seperti pengaturan tampilan), tidak ikut ekspor data.
- Pengingat ditaruh paling akhir; pada data contoh ada 8 butir perhatian sehingga baru terlihat setelah "Lihat semua", karena Beranda hanya menampilkan 3 teratas.
- Diuji di Chromium 390 px: ganti dua nama tahap cabai, nama baru dipakai di daftar tahap, mengosongkan isian mengembalikan bawaan; Agenda menyebut tahap; pengingat muncul saat hidup dan hilang saat dimatikan; Setelan menampilkan pengaturan; tanpa galat JavaScript. Belum diuji di HP sungguhan, tema gelap/kaca, atau desktop.

## v0.1.090 — 2026-11-06
Roadmap Fase 6E, **Tahap 3: Tahap pertumbuhan** (sebagian). Dokumen: `docs/JURNAL.md` (bagian 6 dan 7), `docs/DATA-SCHEMA.md`.

### Ditambahkan
- **Tahap pertumbuhan** (`js/tahap.js`): daftar tahap bawaan per templat komoditas (Sayur daun, Cabai, Tomat, Lele, Ayam petelur; komoditas lain memakai daftar Umum) dengan saran hari ke-N dari persen umur panen, sesuai `docs/JURNAL.md` bagian 6.
- Bagian **Tahap** di detail siklus: tahap sekarang dan lama di tahap itu, **bilah tahap bersegmen** dengan penanda hari ini terhadap umur panen, dan tombol **Catat tahap** (modal: tanggal, tahap, catatan opsional; Ubah dan Hapus dengan Urungkan lewat detail jurnal).
- **Saran tahap** (hanya saran, tidak otomatis): bila menurut hari ke-N tahap berikutnya sudah seharusnya mulai, tampil "seharusnya sudah mulai"; selain itu "Berikutnya: …". Pilihan bawaan di formulir mengikuti saran.
- Tahap sekarang tampil di **kartu siklus** (tab Siklus) dan di **Siklus berjalan** di Beranda.
- Entri tahap tampil di **linimasa** dengan ikon dan label Tahap, dan di bagian Jurnal sebagai "Tahap: <nama>".

### Diubah
- `js/jurnal.js` (judul entri tahap, Ubah membuka formulir tahap), `js/linimasa.js`, `js/siklus.js`, `js/app.js` (versi, Beranda), `index.dev.html`, `css/style.css`, `sw.js`, `index.html`, `tani-keuangan.html`, `docs/JURNAL.md`, `docs/DATA-SCHEMA.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- **Belum dikerjakan di Tahap 3:** layar untuk mengganti nama tahap (kode sudah membaca `komoditas.tahap` bila ada, tetapi belum ada tempat mengisinya); tahap di Agenda; pengingat "belum ada catatan N hari" dan pengaturannya di Setelan.
- Tidak ada perubahan skema: entri memakai koleksi `jurnal` dengan `jenis: "tahap"` dan field `tahap` (kode) yang sudah tercantum; data lama tetap valid.
- Diuji di Chromium 390 px: bagian dan bilah tampil, formulir menawarkan 7 tahap cabai, simpan, ubah, dan tampil di detail siklus, kartu siklus, Beranda, dan linimasa, tanpa galat JavaScript. Belum diuji di HP sungguhan, tema gelap/kaca, maupun desktop; uji impor/sinkron dengan entri tahap belum dijalankan.

## v0.1.089 — 2026-11-06
Roadmap Fase 6E, **Tahap 2: Linimasa siklus**. Dokumen: `docs/JURNAL.md` (bagian 7), `docs/RUTE.md`, `docs/DATA-SCHEMA.md`.

### Ditambahkan
- **Linimasa** (`js/linimasa.js`): halaman Jurnal siklus (`#jurnal-<id>`) dari tombol **Buka linimasa** di bagian Jurnal. Menyatukan catatan jurnal dengan peristiwa Mulai/Selesai siklus, transaksi, dan panen; hari ke-N, pengelompokan Minggu ke-N, saringan (Semua/Catatan/Uang/Panen/Kegiatan), urutan Terbaru/Terlama, 100 baris + Tampilkan lebih banyak.
- Peristiwa turunan baca-saja dan redup; ketuk membuka formulir transaksi, modal panen, atau modal catatan.
- **Riwayat kegiatan otomatis**: menandai jadwal "Sudah dikerjakan" (detail siklus dan Agenda) membuat entri jurnal `kegiatan`; Urungkan menghapusnya.
- Cetak polos linimasa, FAB Catat jurnal di halaman ini, panel ringkasan di desktop, rute `#jurnal-<id>`.

### Catatan
- Tidak ada perubahan skema; entri `kegiatan` memakai koleksi `jurnal` yang sudah ada.

## v0.1.088 — 2026-11-05
Roadmap Fase 6E, **Tahap 1: catatan jurnal teks per siklus**. Dokumen: `docs/JURNAL.md` (bagian 7), `docs/SIKLUS.md`, `docs/DATA-SCHEMA.md`.

### Ditambahkan
- **Jurnal siklus**: koleksi baru `jurnal` (id `jr_…`) dan modul `js/jurnal.js`. Detail siklus punya bagian **Jurnal** (3 catatan terbaru + Lihat semua, tanggal dengan hari ke-N). Di siklus berjalan, tombol + menawarkan **Catat jurnal** (tanggal, judul opsional, isi); ketuk catatan untuk detail dengan **Ubah** dan **Hapus** (Urungkan).
- **Evaluasi**: siklus selesai bersifat baca-saja kecuali satu catatan **Evaluasi** (tombol Tulis evaluasi; bisa diubah atau dihapus).
- **Aturan**: tanggal tidak sebelum mulai siklus dan tidak di masa depan; judul maks. 80 dan isi maks. 2.000 karakter; hapus siklus diblok bila ada jurnal (pesan menyebut jumlah); tanggal mulai siklus tidak boleh setelah catatan tertua. Jurnal tidak memengaruhi kas, anggaran, laporan, atau HPP.
- Koleksi terdaftar di penyimpanan, validasi, ekspor/impor JSON, cadangan, sinkron per entri, dan data contoh (5 catatan pada siklus cabai; ikut terhapus bersama contoh). Ekspor Excel punya lembar **Jurnal**.
- Isian `textarea` bergaya sama dengan input; di dalamnya Enter membuat baris baru.

### Catatan
- Data lama tanpa koleksi `jurnal` tetap valid. Delapan keputusan terbuka diadopsi menurut usulan (docs/JURNAL.md bagian 3) dan bisa diubah di tahap berikutnya.
- Belum ada: linimasa (Tahap 2), tahap pertumbuhan (3), foto (4), kejadian/ukuran (5), cadangan foto (6), laporan perjalanan siklus (7).
- `js/jurnal.js` (baru), `js/app.js`, `js/siklus.js`, `js/sinkron.js`, `js/setelan.js`, `js/contoh.js`, `js/xlsx.js`, `js/fab.js`, `css/style.css`, `index.dev.html`, `index.html`, `tani-keuangan.html`, `sw.js` (cache `tani-keuangan-v0_1_088`), `VERSION`, dan dokumen terkait.

## v0.1.087 — 2026-11-05
Fase 6E **Tahap 0**: rancangan Jurnal Siklus (tanpa kode; aplikasi hanya naik versi). Spesifikasi menunggu konfirmasi pengguna sebelum Tahap 1.

### Ditambahkan
- **`docs/JURNAL.md`**: tujuan dan pembeda dari Transaksi/Panen/Jadwal, istilah (hari ke-N, minggu ke-N, Evaluasi), tabel delapan keputusan yang diadopsi sementara, **skema koleksi `jurnal`** (field, validasi, contoh JSON), aturan perilaku (siklus selesai baca-saja kecuali satu Evaluasi, hapus siklus diblok bila ada jurnal, tanggal, Urungkan, sinkron, Tersembunyi, cetak), **tahap pertumbuhan bawaan** untuk Sayur daun, Cabai, Tomat, Lele, Ayam petelur, dan Umum (kode, nama, persen umur panen, saran hari ke-N), rancangan linimasa, antarmuka, dan daftar periksa teknis Tahap 1.
- **`docs/WIREFRAME.md` bagian 7–11**: bagian Jurnal di Detail siklus, modal Catat jurnal dan detail catatan, linimasa HP, linimasa desktop (≥ 1100 px), dan tahap di kartu siklus.
- `docs/DATA-SCHEMA.md`: bagian `jurnal (rencana)`.

### Keputusan rancangan baru (di luar delapan keputusan roadmap)
- FAB di detail siklus berjalan menambah **Catat jurnal**; di siklus selesai hanya tombol **Tulis evaluasi** di halaman (FAB tetap tersembunyi).
- Catatan penutup memakai field `evaluasi` (boolean, maksimal satu per siklus); hapus siklus juga diblok bila ada jurnal; tanggal mulai tidak boleh setelah entri jurnal tertua; alamat linimasa `#jurnal-<id siklus>`.

### Diubah
- `roadmap.md`: Tahap 0 ditandai (dua butir selesai, butir keputusan menunggu konfirmasi), status keputusan, baris status, dan Changelog Dokumen.

### Catatan
- Tidak ada perubahan perilaku aplikasi dan skema data; berkas kode hanya `js/app.js` dan `sw.js` (versi dan nama cache).
- Persen dan saran hari tahap pertumbuhan adalah usulan awal yang perlu dicek petani; dapat diubah sebelum Tahap 3.

## v0.1.086 — 2026-11-05
Roadmap: **Fase 6E — Jurnal Siklus** (mencatat perjalanan tanaman dari awal sampai panen). Perubahan dokumen saja; kode aplikasi hanya naik versi.

### Ditambahkan di `roadmap.md`
- Bagian **Fase 6E** (sebelum Fase 7): latar, tujuan, prinsip khusus, rancangan data (koleksi `jurnal`, jenis catatan/tahap/kejadian/ukuran/kegiatan, linimasa gabungan dengan data uang, panen, dan jadwal yang sudah ada), dan **delapan tahap** dengan ukuran dan hasil: 0 rancangan, 1 catatan teks, 2 linimasa, 3 tahap pertumbuhan, 4 foto jurnal, 5 kejadian dan ukuran, 6 laporan/ekspor/cadangan foto, 7 penyempurnaan.
- Definisi selesai tiap tahap, **delapan keputusan terbuka** (dengan usulan), dan tabel risiko.
- Model Data (Ringkas), Backlog (cuaca/kondisi), Pertanyaan Terbuka no. 6, baris status, dan Changelog Dokumen diperbarui.

### Catatan
- Temuan dari membaca kode yang dimasukkan ke rencana: koleksi baru harus didaftarkan di empat tempat (`App.KOLEKSI`/`sah`, `js/sinkron.js`, `js/setelan.js` impor, `js/contoh.js`); `Nota.rapikan()` hanya mengenali `transaksi.notaId` sehingga foto jurnal akan dihapus setelah 30 hari bila tidak diperbaiki lebih dulu (syarat Tahap 4); riwayat kegiatan jadwal belum tersimpan (hanya `terakhir`) sehingga perlu entri otomatis di Tahap 2.
- Belum ada kode fitur Jurnal; tahap dan keputusan perlu persetujuan sebelum Tahap 1.
- Berkas: `roadmap.md`, `CHANGELOG.md`, `README.md`, `VERSION`, `js/app.js` (versi), `sw.js`, `index.html`, `tani-keuangan.html` (hasil build).

## v0.1.085 — 2026-11-05
Layout desktop, Tahap 0-G (sebagian): cetak dari kerangka baru dan audit kompatibilitas (rincian di `docs/DESKTOP.md`). Perubahan hanya pada aturan cetak.

### Diperbaiki
- **Cetak pada Emas Klasik gelap:** teks tercetak terang di atas kertas putih (tidak terbaca) karena token cetak kalah spesifik dari token Emas gelap; kini token cetak berlaku untuk kedua skema.
- **Tema gelap saat dicetak:** tepi halaman kertas tercetak hitam; `color-scheme` kini dipaksa terang saat mencetak.
- **Aksen tema gelap saat dicetak** (`--act-tx`, `--fill-hi`, `--gold-dim`, `--on-fill`, `--act-bg`) dan tombol aktif Emas gelap kini memakai warna gelap di atas kertas putih (sebelumnya teks pil "14 hari lagi" terang).

### Hasil pemeriksaan
- Cetak (Chromium headless, PDF A4, lebar jendela 1440 px): 4 kombinasi tema × 6 halaman (25 pemeriksaan) lolos: tidak ada elemen layar, teks terang di atas putih, atau kata melewati margin.
- Catatan "satu ketukan Cetak memanggil `window.print` dua kali" (sejak v0.1.078) ternyata artefak skrip uji, bukan galat aplikasi; satu ketukan memanggil satu kali.
- Audit statis fitur CSS/JS untuk Safari dan Firefox (daftar di `docs/DESKTOP.md`); butuh Safari 16.2+ dan Firefox 113+ untuk tampilan penuh.

### Diubah
- `css/style.css` (tiga aturan cetak), `js/app.js` (versi), `sw.js`, `docs/DESKTOP.md`, `README.md`, `roadmap.md`, `VERSION`, `index.html`, `tani-keuangan.html` (hasil build).

### Catatan
- **Belum diuji:** Firefox dan Safari (tidak tersedia di lingkungan pengembangan), monitor dan skala Windows sungguhan, serta dialog cetak sungguhan. Tahap 0-G tetap terbuka untuk bagian itu.

## v0.1.084 — 2026-11-05
Layout desktop, Tahap 0-F: variasi tema dan kontras (rincian di `docs/DESKTOP.md`). Perubahan warna berlaku di semua ukuran layar; tata letak tidak berubah.

### Diperbaiki
- **Lencana "Perlu perhatian" di mode gelap:** teks putih di atas merah muda terang hanya 2,95:1 (Emas gelap 3,84:1); kini latar `#B5402B` (±5,6:1).
- **Item aktif rail pada Emas Klasik terang:** ikon dan label berwarna emas ±3,6:1; kini `#6E5218` (±6,2:1).
- **Teks sekunder dan status (token)** disetel agar mayoritas teks mencapai 4,5:1: Hijau terang `--paper-faint`, `--gain`, `--loss`; Hijau gelap `--paper-faint`, `--loss`; Emas terang `--paper-dim`, `--paper-faint`, `--gain`, `--loss`; Emas gelap `--paper-dim`, `--paper-faint`, `--loss`. Teks tombol aktif (`.btn.on`) di Emas disesuaikan. `--gold` tidak diubah.

### Hasil pemeriksaan
- 8 kombinasi (2 skema × terang/gelap × kaca) × 6 halaman × lebar 1280 dan 1600: teks di bawah 4,5:1 turun dari 17–113 per kombinasi menjadi 0–6.
- Skala 90/100/110/120% pada lebar 1100, 1280, 1600, 1920 dan tinggi 560: tanpa overflow horizontal, item rail bertumpuk atau keluar rail, isi menimpa rail, atau lencana keluar rail (22 skenario).

### Diubah
- `css/style.css` (token empat palet, aturan lencana gelap, dua aturan Emas), `js/app.js` (versi), `sw.js`, `docs/STYLE.md` (tabel token, catatan Emas), `docs/DESKTOP.md` (bagian Variasi tema), `README.md`, `roadmap.md`, `VERSION`, `index.html`, `tani-keuangan.html` (hasil build).

### Catatan
- Sisa di bawah 4,5:1: angka hero dan merek Emas terang ±3,2:1 (teks besar; token emas sengaja tidak diubah demi kesamaan dengan Jurnal Trading); tombol utama kaca pada tema gelap 4,1–4,4:1; simbol dekoratif kecil.
- Pengukuran memakai rata-rata latar di belakang tiap teks; tidak menggantikan uji pada layar sungguhan. Firefox, Safari, monitor dan skala Windows sungguhan, serta cetak dari kerangka baru masih di Tahap 0-G.

## v0.1.083 — 2026-11-05
Layout desktop, Tahap 0-E: rail lengkap (rincian di `docs/DESKTOP.md`). Hanya terlihat di layar ≥ 1100 px; HP, tablet, dan 1099 px ke bawah tidak berubah.

### Ditambahkan
- **Item Setelan di dasar rail** (ikon roda gigi); tombol Setelan di header tetap ada.
- **Lencana jumlah "Perlu perhatian"** pada item Beranda (angka, "9+" bila lebih dari 9); hilang saat tidak ada peringatan. Tombol Beranda mendapat `title` dan `aria-label` yang menyebut jumlahnya.
- **Label saat disorot atau difokus keyboard** di rail ramping (nama muncul di kanan rail).
- **Rail diperluas di layar ≥ 1600 px**: ikon + label selalu terlihat (lebar 216 px), isi bergeser menyesuaikan.
- **Layar pendek** (tinggi ≤ 640 px): rail dirapatkan agar item tidak bertumpuk.

### Diubah
- `js/app.js` (`App.lencana()`, ikon dan tombol Setelan di rail, versi), `js/beranda.js` (`daftar()` dan `jumlah()` dipisah dari `perhatian()`; kartu Perlu perhatian tidak berubah), `css/style.css` (blok Tahap 0-E), `sw.js` (`tani-keuangan-v0_1_083`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/DESKTOP.md`, `README.md`, `roadmap.md`, `VERSION`.

### Diperbaiki
- Saat dikembangkan, lencana sempat tidak terlihat karena terkena aturan label tersembunyi pada `.bnav-btn span`; sekarang memakai elemen `b` dan ukurannya diuji (18×18 px, di dalam rail, tidak tertutup elemen lain).

### Catatan
- Diuji di Chromium headless: lebar 1100, 1280, 1440, 1920 (tujuh item rail tanpa tumpang tindih, Setelan di dasar, isi tidak menimpa rail, klik Setelan mengaktifkan hanya satu item, label hover/fokus, lencana tampil dan hilang), tinggi 560 px, delapan kombinasi skema × mode × kaca di 1440 dan 1920 tanpa overflow, serta teks halaman dan item bilah bawah identik dengan v0.1.082 di 390, 800, dan 1099 px; tanpa galat JavaScript. Belum diuji di Firefox/Safari atau layar sungguhan (Tahap 0-G).
- Belum: variasi tema menyeluruh dan kontras rail (0-F); Rencana keuangan masih satu kolom.

## v0.1.082 — 2026-11-05
Layout desktop, Tahap 0-D: halaman selain Beranda memakai lebar layar (rincian di `docs/DESKTOP.md`). Hanya tata letak untuk layar ≥ 1100 px; HP, tablet, dan lebar di bawah 1100 px tidak berubah.

### Ditambahkan
- **Siklus:** kartu siklus dalam grid otomatis (2 kolom di 1100 px, 3 di ≥ 1280 px); lencana hari tidak lagi terpotong dua baris.
- **Detail siklus:** dua kolom; Ringkasan dan Jadwal kegiatan di kiri, Panen dan Transaksi siklus di kanan; Hapus siklus di bawah.
- **Transaksi:** filter di kolom kiri (menempel saat menggulir), hasil dan daftar di kanan.
- **Laporan:** Ringkasan | Bulan ini vs rata-rata 3 bulan, Tren | Komposisi modal, Rincian | Simulasi berdampingan; tinggi grafik dibatasi 340 px (sebelumnya ±900 px di lebar penuh).
- **Setelan dan Lainnya:** dua kolom. Formulir (Catat, Siklus baru, Catat panen, Unit/Komoditas) dibatasi lebar 720 px.

### Diubah
- `js/siklus.js` (pembungkus `.sc-grid`, `.dt-kiri`, `.dt-kanan`), `js/analisa.js` (penanda `data-bx` pada bagian Laporan), `js/app.js` (versi), `css/style.css` (blok Tahap 0-D, `@media screen and (min-width:1100px)` agar tidak ikut tercetak), `sw.js` (`tani-keuangan-v0_1_082`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/DESKTOP.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium headless: lebar 1100, 1280, 1440, 1920 untuk sembilan halaman (tanpa overflow, bagian meluber, atau tumpang tindih; kolom tiap halaman sesuai rancangan), delapan kombinasi skema × mode × kaca di 1440, dan teks semua halaman identik dengan v0.1.081 di 390, 800, dan 1099 px; tanpa galat JavaScript. Belum diuji di Firefox/Safari, layar dan skala Windows sungguhan, atau cetak dari kerangka baru (Tahap 0-G).
- Belum dikerjakan: Rencana keuangan tetap satu kolom; Transaksi sebagai tabel dan master–detail (Tahap 2); rail lengkap (0-E); variasi tema menyeluruh (0-F).

## v0.1.081 — 2026-11-05
Layout desktop, Tahap 0-C (lanjutan v0.1.080): bagian bawah dan hero Beranda mengikuti gambar referensi. Hanya tampil di layar ≥1100 px; HP dan tablet tidak berubah (teks bagian Siklus berjalan di HP identik dengan v0.1.080).

### Ditambahkan
- **Kartu Siklus berjalan**: ikon, nama, modal, **Umur siklus N%** dengan bilah progres, **Hari N / umur panen**, dan pil **N hari lagi** / **panen hari ini** / **lewat N hari**. Komoditas tanpa umur panen tidak menampilkan bilah dan pil. Tiga kartu per baris pada lebar 1100–1920 px (`.sk-grid`, otomatis menyesuaikan jumlah kolom).
- **Tren hero lebih besar** (90–210 px) mengisi ruang kosong di kartu hero, dengan tiga label bulan di bawahnya (`#heroSparkLbl`).
- Penempatan grid ≥1360 px: Perlu perhatian (4 kolom) di samping Siklus berjalan (8 kolom); bila tidak ada peringatan, Siklus berjalan selebar penuh.

### Diubah
- `js/app.js` (markup kartu di `vBeranda`, label tren di `ringkas`, versi), `index.dev.html` (`#heroSparkLbl`), `css/style.css` (blok Tahap 0-C), `sw.js` (`tani-keuangan-v0_1_081`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/DESKTOP.md`, `roadmap.md` (Tahap 0-C dicentang, baris changelog), `README.md`, `VERSION`.

### Catatan
- Diuji di Chromium headless: lebar 1440, 1360, 1280, 1100 (tiga kartu sebaris, tanpa overflow dan teks meluber), HP 390 (teks identik), siklus melewati umur panen dan komoditas tanpa umur panen, tanpa galat. Belum diuji di Firefox/Safari dan layar sungguhan.
- Angka di tengah kartu hero seperti pada gambar tidak dibuat; angka untung sudah ditampilkan besar di hero.

## v0.1.080 — 2026-11-05
Layout desktop mengikuti gambar referensi dashboard (Fase 6D, Tahap 0 A–B). Hanya tata letak; warna, font, gaya kartu, tema, skema, dan efek kaca tidak diubah. Di bawah 1100 px tampilan sama seperti sebelumnya.

### Ditambahkan
- **Rail ikon di kiri** (≥1100 px): `#bnav` yang sama ditata vertikal, logo tunas di atas (`.rail-logo`), item aktif berupa kotak terang, nama item di `title` (tooltip) dan tetap terbaca pembaca layar. Mode kaca memakai latar kaca yang ada.
- **Header baru**: breadcrumb kecil di atas judul besar, tombol tema/setelan/mata dalam pill di kanan; tab atas disembunyikan di layar ini.
- **Grid dashboard Beranda 12 kolom**: hero lebar di kiri, Posisi kas dan Dibanding bulan lalu bertumpuk di tengah, Transaksi terakhir sebagai panel tinggi di kanan, Perlu perhatian dan Siklus berjalan di baris bawah, Grafik dua kolom (tinggi SVG dibatasi 250 px). Tata letak khusus 1100–1359 px dan saat data kosong.
- `docs/DESKTOP.md`: titik batas, kerangka, peta grid, dan cara kerja.
- Roadmap: Fase 6D diperbarui dengan **Tahap 0 (A–G)** untuk layout referensi; A dan B selesai, C sampai G dijadwalkan; dua butir Tahap 1 ikut dicentang/dicatat.

### Diubah
- `index.dev.html`: elemen `.rail-logo`; `<main>` diberi `role="main"`. `js/app.js`: `body[data-hal]` diisi halaman aktif, `title` pada tombol navigasi, `data-bx` pada bagian Beranda, pembungkus `.dash-grid`. `js/beranda.js`: `data-bx`. `css/style.css`: blok layout desktop di akhir. `index.html` dan `tani-keuangan.html` (hasil build), `README.md`, `roadmap.md`, `docs/STYLE.md`, `docs/FAB.md`, `VERSION`.

### Diperbaiki
- `sw.js`: nama cache masih `tani-keuangan-v0_1_078` padahal versi aplikasi 0.1.079. Sekarang `tani-keuangan-v0_1_080`.

### Catatan
- Diuji di Chromium headless: lebar 1100, 1280, 1360, 1920 (tanpa overflow horizontal, tanpa teks meluber, penempatan grid sesuai), lebar 1099, 1024, dan 390 (tidak berubah), semua halaman di 1440 px (konten tidak menimpa rail), mode gelap + kaca, data kosong, navigasi rail dengan Enter, FAB dan dial, tanpa galat. Belum diuji di Firefox/Safari dan layar sungguhan.
- Halaman selain Beranda memakai kerangka baru tetapi isinya masih satu kolom (maks. 1180 px); grid dua kolom per halaman ada di roadmap Tahap 0-D.

## Dokumen — 2026-11-05 (tanpa rilis kode)
- `roadmap.md`: ditambahkan **Fase 6D — Tampilan Desktop** (usulan, belum dikerjakan; tiga tahap, 16 butir) beserta temuan terbuka tentang Cetak yang memanggil `window.print` dua kali. Tanggal pembaruan dokumen diperbarui. Versi aplikasi tetap v0.1.079.

## v0.1.079 — 2026-11-05
Laporan menjadi satu halaman tanpa tab, lebih ringkas dan berurutan dari ringkasan ke detail.

### Diubah
- Tab Ringkasan/Grafik/Rincian dihapus. Urutan satu halaman: **Filter** (periode dan pengelompokan, satu kali di atas) → **Ringkasan** (untung/rugi besar, modal, hasil, R/C) → **Tren hasil/modal** → **Bulan ini vs rata-rata 3 bulan** → **Komposisi modal** → **Rincian per siklus/komoditas/unit** → **Simulasi**.
- Filter periode dan pengelompokan kini satu set di atas dan berlaku untuk semua bagian (sebelumnya diulang di dua tab dan tidak berlaku di Grafik).
- **Rincian** berupa baris lipat: tiap kelompok satu baris (nama, untung, R/C); ketuk untuk detail (modal/hasil, margin, panen, HPP, harga, BEP). Halaman lebih pendek (±2.400 px dengan data contoh, dengan tujuh kelompok tertutup).
- **Simulasi** berupa lipatan yang tertutup bawaan dan tetap terbuka saat memilih persen.
- Dihapus karena menggandakan isi lain: grafik batang "Tren 6 bulan" (sudah ada grafik garis) dan "Komoditas teratas" (sudah ada di Rincian yang berurut).
- Alamat lama `#laporan-grafik` dan `#laporan-rincian` tetap berfungsi dan membuka Laporan. Navigasi panah antar-tab dan gaya tab/panel dihapus.
- Cetak dan Excel tidak berubah: dokumen cetak tetap memuat tiga bab (ringkasan, grafik, rincian).
- `js/analisa.js`, `js/rute.js`, `js/app.js`, `css/style.css`, `sw.js` (`tani-keuangan-v0_1_079`), `index.html`, `tani-keuangan.html`, `docs/LAPORAN.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar 390 dan 360: tidak ada tab tersisa, ketujuh bagian muncul, baris rincian membuka detail, pindah pengelompokan memperbarui judul rincian, Simulasi tetap terbuka saat memilih persen, ekspor Excel terunduh, tanpa galat. Belum diuji di HP sungguhan.
- Temuan terbuka (sudah ada di v0.1.078, bukan dari perubahan ini): satu ketukan Cetak memanggil `window.print` dua kali pada uji headless; penyebabnya belum ditemukan dan belum dipastikan terjadi di browser sungguhan.

## v0.1.078 — 2026-11-05
Pengaman navbar bawah yang terlihat lebih lebar dari layar saat Beranda digeser sampai dasar di Chrome Android.

### Diperbaiki
- `html` dan `body` memakai `overflow-x: clip` agar elemen yang keluar dari layar (bulatan latar Efek kaca, angka atau teks panjang) tidak melebarkan layout viewport; navbar fixed mengikuti lebar layout viewport itu.
- Navbar bawah: `box-sizing: border-box`, isi dipotong di tepinya, label tombol tidak melampaui tombol. `will-change: transform` dilepas dari navbar (tetap di tombol +) karena lapisan komposit tambahan di navbar fixed sering bermasalah di Chrome Android.
- Teks panjang tanpa spasi (nama, catatan) di baris dan keterangan membungkus, bukan mendorong halaman melebar.

### Catatan
- **Belum terkonfirmasi di perangkat.** Penyebab pastinya belum bisa dimunculkan ulang di emulasi Chrome Android (lebar 360–430, ukuran tampilan 90–120%, Efek kaca hidup dan mati); ini pengaman untuk penyebab paling umum. Bila masih terjadi, kirim tangkapan layar beserta pengaturan Efek kaca dan Ukuran tampilan.
- Tidak mengubah skema data. `css/style.css`, `js/app.js`, `sw.js` (cache `tani-keuangan-v0_1_078`), `index.html`, `tani-keuangan.html`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.077 — 2026-11-05
Rute web. Dokumen: `docs/RUTE.md`.

### Ditambahkan
- **Alamat per halaman** berbentuk `#nama` (mis. `#transaksi`, `#laporan-grafik`, `#rencana-utang`, `#siklus-s-k3j9x2`). Membuka alamat langsung atau memuat ulang kembali ke halaman yang sama, termasuk bagian tab (Laporan, Rencana, Siklus, Unit/Komoditas), detail siklus, dan ubah transaksi.
- **Pintasan cepat**: `#catat-modal` dan `#catat-hasil` membuka form transaksi baru. `manifest.webmanifest` memuat `shortcuts` (Catat modal, Catat hasil, Transaksi, Laporan) untuk aplikasi terpasang.
- Mengubah hash dari luar (tempel tautan di halaman yang sudah terbuka) membuka halamannya.

### Diubah
- Bilah alamat selalu mengikuti halaman aktif; Back dan Forward mengembalikan alamat yang benar. Pindah tab di dalam halaman tidak menambah riwayat. Alamat tidak dikenal atau id yang tidak ada membuka Beranda.

### Catatan
- Tidak mengubah skema data. Alamat hanya memakai huruf, angka, dan tanda hubung (id `s_abc` menjadi `s-abc`) agar cocok dengan penampil artefak dan hosting statis. Isian form dan filter tidak masuk alamat.
- Berkas baru `js/rute.js`; diubah `js/app.js`, `index.dev.html`, `manifest.webmanifest`, `sw.js` (cache `tani-keuangan-v0_1_077`), `index.html`, `tani-keuangan.html`, `docs/RUTE.md`, `docs/MODAL.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.076 — 2026-11-05
Konsistensi pola dan perilaku, dari audit v0.1.075 (roadmap butir 1–4). Dokumen: `docs/MODAL.md`, `docs/STYLE.md`.

### Diperbaiki
- **Panduan cepat dan foto nota memakai mesin Modal**: tombol Back menutupnya (sebelumnya halaman berpindah dan jendelanya tetap terbuka), fokus kembali ke pemicu, jebakan Tab dan kunci gulir sama dengan modal lain. Kode ganda di `panduan.js` dan `nota.js` dihapus. Opsi baru `kartu` dan `lapis` pada `Modal.buka`.
- **Fokus awal modal**: bila isian yang dituju disembunyikan `Form.upgrade` (mis. tanggal di Selesaikan siklus), fokus ke tombol penggantinya; bila tetap gagal, ke kartu modal. Sebelumnya fokus tertinggal di tombol pembuka di belakang modal dan Tab keluar dari modal.
- **Teks diseragamkan**: penolakan hapus selalu diawali "Tidak bisa dihapus:"; toast tanpa titik akhir dengan "—" untuk langkah berikutnya; "tab Unit/Siklus" menjadi "menu Unit/Siklus" (aturan di `docs/STYLE.md`).
- **CSS**: satu deklarasi `z-index` untuk `.toast` (120); aturan `.pd-lapis` yang tidak terpakai dihapus.

### Catatan
- Tidak mengubah skema data. Panduan tetap tampil otomatis sekali dan bisa dibuka dari Setelan.

## v0.1.075 — 2026-11-05
Cetak laporan kini mencetak ketiga tab sekaligus, bukan hanya tab yang sedang terbuka. Dokumen: `docs/LAPORAN.md`.

### Diubah
- Tombol Cetak (atau Ctrl+P) menghasilkan **satu dokumen** berisi 1 Ringkasan, 2 Grafik, 3 Rincian, dengan satu kop (judul, periode, pengelompokan, tanggal cetak, versi), apa pun tab yang sedang dilihat.
- Ringkasan dan Grafik mengalir di halaman potret; Rincian selalu mulai di halaman baru berorientasi lanskap, header tabel berulang bila lebih dari satu halaman. Nomor halaman "x dari y" mencakup seluruh dokumen.
- Pengelompokan Rincian (Komoditas, Unit, dan seterusnya) dan periode mengikuti pilihan di layar.

### Catatan
- Tidak mengubah skema data atau Excel. `js/analisa.js`, `css/style.css`, `js/app.js`, `sw.js` (cache `tani-keuangan-v0_1_075`), `index.html`, `tani-keuangan.html`, `docs/LAPORAN.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.074 — 2026-11-05
Cetak laporan polos. Hasil pemeriksaan PDF v0.1.073: kertas tidak menyebut periode, simulasi dan petunjuk sentuh ikut tercetak, batang komposisi kosong, Rincian 4 halaman, dan tema gelap menghasilkan teks pucat. Tidak ada perubahan data.

### Ditambahkan
- **Dokumen cetak khusus** (`#cetak-lap`, dibuat di `Analisa.cetakPasang` saat tombol Cetak atau Ctrl+P, dibuang setelah cetak): mencetak sub-tab Laporan yang sedang terbuka, terpisah dari tampilan layar. Warna literal hitam di atas putih; tidak terpengaruh tema gelap, Efek kaca, atau Samarkan.
- **Kop**: Laporan Usaha Tani, sub-tab, periode (mis. "Bulan ini (November 2026)"), pengelompokan atau cakupan, tanggal cetak, versi aplikasi.
- **Rincian**: satu tabel perbandingan (modal, hasil, untung, R/C, panen bersih, HPP, harga rata-rata, harga minimum, BEP) dengan baris total, header berulang, dan keterangan rumus; halaman lanskap. Pada data contoh 4 halaman menjadi 1.
- **Grafik**: batang Hasil (solid) dan Modal (arsir) berangka, terbaca di cetak hitam-putih; tabel angka selalu tampil; komposisi modal dengan baris "Lainnya" dan total, batang berbingkai yang tercetak walau latar tidak dicetak.
- **Ringkasan**: tabel untung/rugi dan perbandingan bulan ini vs rata-rata 3 bulan dengan kata "membaik/memburuk" (bukan hanya warna).
- **Kaki halaman** "Halaman x dari y" dan margin A4 lewat `@page`.
- **Mode Tersembunyi**: Cetak meminta ketukan kedua ("Angka akan tercetak lengkap"); kedaluwarsa 4 detik. Kertas tetap memuat angka lengkap (aturan lama), layar kembali disamarkan setelah cetak.

### Diubah
- Simulasi "bagaimana jika", petunjuk "sentuh grafik", dan grafik batang 6 bulan ganda tidak lagi dicetak (grafik batang kini berasal dari tren yang sama dengan tabel).
- Halaman lain yang dicetak langsung (Transaksi, Siklus, dst.) memakai token warna terang dan tanpa Efek kaca walau tema gelap aktif.

### Catatan
- Diuji di Chromium (Playwright, PDF A4 dengan `prefer_css_page_size`): 41 pemeriksaan lolos (tiga sub-tab, kop, tanpa elemen layar, jumlah halaman, lanskap Rincian, periode × pengelompokan, tema gelap + kaca, beforeprint/afterprint, Tersembunyi, data kosong), tanpa galat JavaScript. **Belum diuji** di printer, Firefox, Safari, atau HP sungguhan.
- Nomor halaman memakai margin box CSS (Chrome/Edge modern); peramban lain bisa menampilkan cetak tanpa nomor halaman.
- Butir 8 usulan (blok "Dibuat oleh / Mengetahui") belum dikerjakan; tercatat di roadmap.
- Berkas: `js/analisa.js`, `js/app.js` (kait beforeprint/afterprint, versi), `css/style.css`, `sw.js`, `docs/LAPORAN.md`, `README.md`, `roadmap.md`, `VERSION`, `index.html`, `tani-keuangan.html` (hasil build).

## v0.1.073 — 2026-11-05
Kurva tren dibuat lebih halus di Laporan dan Beranda (JS saja; tidak ada perubahan data).

### Diubah
- **Satu fungsi kurva untuk semua grafik tren** (`Analisa.kurva`): kurva kubik monoton (Fritsch–Butland, ujung pchip). Kurva melewati semua titik data, kemiringannya kontinu di tiap titik, dan tidak pernah melampaui nilai titik tetangganya.
- **Laporan → Grafik (Hasil/Modal):** bezier sebelumnya memotong titik kontrol ke rentang tiap ruas sehingga ada tekukan kecil di puncak dan lembah serta awal kurva yang curam; kini puncak dan lembah membulat dan sambungan antarruas mulus.
- **Beranda (sparkline Untung 6 bulan di kartu utama):** dari garis lurus patah menjadi kurva mulus, tanpa lonjakan melewati garis nol di antara titik.
- Koordinat dibulatkan 2 desimal (sebelumnya campuran) sehingga jalur SVG lebih ringkas.

### Catatan
- Diuji di Chromium: 300 deret acak (2–12 titik) — semua titik terlewati, tidak ada lonjakan di luar nilai tetangga, selisih kemiringan di titik sambung maks. 0,0004; kasus 1 dan 2 titik aman; grafik Laporan dan sparkline Beranda tergambar; tanpa galat JavaScript. Perbandingan sebelum/sesudah dicek secara visual.
- Garis tren harga pasar di Harga (`js/harga.js`) belum diubah (masih garis lurus); bisa disamakan bila diinginkan.
- Berkas: `js/analisa.js`, `js/app.js` (sparkline dan versi), `sw.js`, `README.md`, `roadmap.md`, `VERSION`, `index.html`, `tani-keuangan.html` (hasil build).

## v0.1.072 — 2026-11-05
Perbaikan: navbar bawah dan FAB menghilang (dan area konten sempat kosong) saat halaman digulir di Chrome Android dengan Efek kaca Nyala. Hanya CSS dan versi; tidak ada perubahan data.

### Penyebab
Efek kaca membuat puluhan lapisan `backdrop-filter` sekaligus (tiap kartu, tombol, dan kolom isian: 25 elemen di Beranda, 47 di Setelan), bertumpuk di dalam kartu yang juga memakai blur, ditambah latar gradasi `background-attachment: fixed` (digambar ulang tiap gulir) dan sembilan bentuk latar yang masing-masing diberi `filter`. Di HP, memori GPU habis dan Chrome melepas lapisan: navbar dan FAB (yang `position: fixed`) hilang, tile konten tidak tergambar.

### Diubah
- **Blur hanya untuk permukaan melayang**: navigasi bawah, toast, popup, dan kartu bawah (Panduan, Detail). Kartu isi, tombol, dan kolom isian tidak lagi memakai `backdrop-filter` (di dalam kartu yang sudah kaca, blur kedua nyaris tak terlihat tetapi mahal). Elemen ber-blur di layar: 25–47 menjadi 4.
- **Latar gradasi mode gelap** pindah dari `body` (`background-attachment: fixed`) ke lapisan tetap `.gbg` yang diisolasi (`contain: strict`), tergambar sekali. Penyaring `saturate` per bentuk dibuang.
- **Navbar bawah dan FAB** diberi `will-change: transform` agar tetap berada di lapisan sendiri.
- Isian putih kaca terang dinaikkan sedikit (32/13% → 38/20%) untuk mengganti blur yang hilang pada kartu isi.

### Catatan
- Diuji di Chromium (emulasi HP 390 px, sentuh): navbar tetap terlihat dan menempel di bawah setelah gulir ke dasar; FAB muncul kembali saat gulir naik; tanpa galat JavaScript; tampilan terang dan gelap nyaris sama dengan v0.1.071. Dalam mode terang, bentuk latar sedikit lebih terlihat tembus kartu karena blur dilepas.
- **Belum dapat diuji di GPU/HP sungguhan** (masalah ini hanya muncul di perangkat). Bila navbar atau FAB masih hilang, matikan Setelan → Efek kaca dan laporkan tipe HP dan versi Chrome.
- Berkas: `css/style.css`, `js/app.js` (versi), `sw.js`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`, `index.html`, `tani-keuangan.html` (hasil build).

## v0.1.071 — 2026-11-05
Header dinamis: judul halaman aktif pindah ke header.

### Diubah
- **Judul halaman ada di header.** Beranda menampilkan merek "Tani Keuangan" dan tagline; halaman lain (Transaksi, Siklus, Laporan, Lainnya, Setelan, Unit & komoditas, Catat modal/hasil, Ubah transaksi, dan seterusnya) menampilkan judulnya di tempat merek, dengan baris kecil "Tani Keuangan · versi" di bawahnya (indikator sinkron tetap ada).
- **Tombol kembali bulat "‹"** di kiri judul untuk halaman turunan (Siklus baru/Ubah siklus, detail siklus, Catat/Ubah panen, Rencana keuangan); `aria-label` dan `title` menyebut tujuannya ("Kembali ke Siklus").
- Judul panjang (mis. nama siklus) dibatasi dua baris di header; nama lengkap tetap ada di atribut `title`.
- Judul di header ikut berubah saat jenis transaksi diganti (Catat modal ↔ Catat hasil); `document.title` dan pengumuman pembaca layar tetap mengikuti.
- Tombol dan tampilan mengikuti mode terang, gelap, dan efek kaca; tombol kembali tidak tercetak.

### Dihapus
- Blok judul di bawah menu (`#judulHal`, `#judulTeks`, `#judulInduk`) beserta CSS-nya; halaman kini langsung dimulai di bawah header sehingga lebih hemat tinggi layar.

### Catatan
- Diuji di Chromium lebar HP dan desktop: 19 skenario (judul per halaman, tombol kembali, halaman turunan, satu `h1`, tinggi header stabil, tanpa galat JS) serta uji Liquid Glass (10) tetap lolos. Belum diuji di perangkat sungguhan.
- Header belum menempel (sticky); jika diinginkan bisa menjadi langkah berikutnya, memakai bahan kaca yang sama.
- Berkas: `index.dev.html`, `js/app.js`, `css/style.css`, `sw.js`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`, `index.html`, `tani-keuangan.html` (hasil build).

## v0.1.070 — 2026-11-05
Liquid Glass dibeningkan dan latar diberi bentuk geometri (CSS, satu elemen dekoratif, dan teks Setelan; tidak ada perubahan data).

### Diubah
- **Kaca lebih bening dan tidak tebal:** isian putih turun dari 26–60% menjadi 8–32%, blur dari 24px menjadi 14px (gelap 16px), saturasi 190% menjadi 160%, cahaya dalam dibuang, tepi dan bayangan dibuat tipis. Tombol dan kolom isian memakai blur 8px dan 6px.
- **Kaca berwarna** (FAB, tombol utama, pilihan FAB, kartu hero) ditipiskan agar sejalan.
- **Keterbacaan dijaga:** mode gelap memakai lapisan peredam gelap di bawah kaca; keterangan versi dan tanda panah memakai warna teks sekunder yang lebih kuat. Kontras teks diukur di atas latar (lihat Catatan).

### Ditambahkan
- **Geometri latar** (`.gbg`, 9 bentuk: lingkaran gradasi, cincin, persegi membulat, segitiga, segi enam, garis diagonal, kisi titik, lingkaran kaca, seperempat lingkaran). Hanya tampil saat Efek kaca Nyala; berwarna dari palet skema; lebih redup di mode gelap; tidak tercetak.

### Catatan
- Pengukuran kontras otomatis (rata-rata latar di belakang tiap teks, 3 halaman × 2 mode): teks isi di Setelan mode gelap seluruhnya ≥ 4,5:1; sebagian angka berwarna (hijau/merah) berada di 3,8–4,5:1 pada mode terang dan gelap, dan tanda panah › dekoratif di Beranda mode gelap terendah (±2,0:1) karena melintas di atas kisi titik latar. Belum diuji di perangkat sungguhan.
- Geometri sengaja statis; animasi di belakang `backdrop-filter` memaksa blur dihitung ulang tiap frame dan memberatkan HP.
- Berkas: `css/style.css`, `index.dev.html`, `js/setelan.js`, `js/app.js` (versi), `sw.js`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`, `index.html`, `tani-keuangan.html` (hasil build).

## v0.1.069 — 2026-11-05
Efek kaca diperbarui menjadi Liquid Glass bergaya iOS (hanya CSS dan teks Setelan; tidak ada perubahan data).

### Diubah
- **Bahan kaca berlapis:** sorot spekular di kiri-atas, isian tembus pandang, blur 24px dengan saturasi 190%, tepi bercahaya terarah (terang kiri-atas, redup kanan-bawah), dan bayangan dua lapis. Berlaku untuk kartu, modal, sheet, popover pilihan, toast, dan navigasi.
- **Bentuk iOS:** kartu radius 28px; tombol dan tab berbentuk kapsul; kolom isian kaca cekung; modal dan sheet membulat besar.
- **Navigasi bawah melayang** berbentuk kapsul dengan tab aktif sebagai "lensa" kaca; tab atas di layar lebar juga kapsul kaca. FAB, pilihan FAB, dan toast naik agar tidak menimpa navigasi.
- **Kaca berwarna:** FAB, tombol utama, dan kartu hero ditinting dari warna aksen skema.
- **Gerak pegas** saat tombol ditekan; mati bila perangkat memilih Kurangi Gerakan.
- **Latar** gradasi diperkaya (4 gelombang warna) agar kaca punya sesuatu untuk dibiaskan; versi gelap disetel terpisah.
- Aturan kaca yang tersebar (kartu pop-up, modal, popover) digabung ke satu blok; teks keterangan di Setelan diperbarui.

### Ditambahkan
- Kurangi Transparansi (`prefers-reduced-transparency`) mengembalikan permukaan padat tanpa blur.

### Catatan
- Pembiasan sungguhan (lensing) ala iOS 26 tidak dipakai karena bergantung filter SVG yang hanya didukung sebagian browser; tampilannya ditiru dengan sorot, tepi, dan blur.
- Berkas: `css/style.css`, `js/setelan.js`, `js/app.js` (versi), `sw.js`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`, `index.html`, `tani-keuangan.html` (hasil build).

## v0.1.068 — 2026-11-05
Agenda lintas siklus (lanjutan butir backlog "Kalender tanam + pengingat", docs/JADWAL.md).

### Ditambahkan
- **Siklus → Agenda (n):** chip ketiga di tab Siklus yang menggabungkan kegiatan jadwal yang belum selesai dan perkiraan panen dari semua siklus berjalan, dikelompokkan Terlambat, Hari ini, 7 hari ke depan, 8–30 hari ke depan, dan Lebih dari 30 hari, urut dari yang terdekat.
- **✓ di agenda:** menandai kegiatan sudah dikerjakan tanpa membuka siklus dan tanpa meninggalkan agenda, dengan aturan yang sama seperti di detail siklus (berulang dijadwalkan lagi N hari sejak hari ini, sekali jadi selesai) dan **Urungkan** yang kembali ke agenda.
- Ketuk baris membuka detail siklusnya; saringan Unit dan Komoditas ikut berlaku; keadaan kosong memberi petunjuk.
- Setiap baris dan tombol punya nama aksesibel (kegiatan, siklus, status); target ketuk ≥ 44 px; ✓ bisa dengan keyboard.

### Diubah
- `js/jadwal.js` (`itemAgenda`, `agenda`, `teksN`; `aksi` menangani `agenda-selesai` dan memakai rute asal untuk Urungkan), `js/siklus.js` (`vList`: chip Agenda), `css/style.css` (`.ag-*`, `.seg.tiga` bila belum ada), `js/app.js` (versi), `sw.js` (`tani-keuangan-v0_1_068`), `index.html`, `tani-keuangan.html`, `docs/JADWAL.md`, `docs/SIKLUS.md`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Tidak ada perubahan data: agenda hanya membaca `siklus.jadwal` dan umur panen komoditas, jadi cadangan, impor, dan sinkron tidak terpengaruh.
- Diuji di Chromium (lebar 390 dan 320 px, terang dan gelap, skenario tanggal terkontrol): urutan dan pengelompokan, ✓ untuk kegiatan berulang dan sekali, Urungkan, ketuk baris, saringan, keadaan kosong, keyboard, target ketuk, tanpa gulir mendatar, regresi tab Berjalan dan Selesai, tanpa galat JavaScript. Belum diuji di HP sungguhan; belum ada notifikasi di luar aplikasi.

## v0.1.067 — 2026-11-05
Duplikat dengan FAB di halaman lain dihapus (lanjutan v0.1.066).

### Hasil pemeriksaan
Semua halaman dan sub-tab dipindai (data contoh dan data kosong): Beranda, Transaksi, Siklus (berjalan/selesai), Unit/Komoditas, Lainnya, Rencana (Kas, Anggaran, Aset, Harga, Utang, Kelayakan), dan Laporan. Dua tombol yang menggandakan FAB ditemukan; sisanya sudah bersih.

### Dihapus (duplikat)
- **Unit/Komoditas, keadaan kosong:** tombol **Tambah unit** / **Tambah komoditas** (sama dengan FAB). Kalimat petunjuk yang muncul dua kali ("Ketuk tombol + untuk menambah …") kini hanya satu; petunjuk bawah hanya tampil bila daftar sudah berisi.
- **Rencana → Arus kas:** tombol **Atur saldo awal** (sama dengan **Atur saldo awal kas** di FAB, dan bertentangan dengan `docs/RENCANA.md` bahwa isian hanya lewat tombol +). Diganti petunjuk "Ketuk tombol + lalu pilih Atur saldo awal kas untuk mengubahnya." Handler `awal-atur` yang tidak lagi dipakai ikut dihapus.

### Tidak diubah
- **Lainnya → Tambah kategori:** bukan duplikat; halaman Lainnya tidak punya FAB.
- Tombol di formulir (Simpan, Batal) dan aksi yang tidak ada di FAB (Ubah, Selesaikan, Hapus, Atur saldo awal lewat FAB tetap ada).

### Diubah (berkas)
- `js/siklus.js` (`vMaster`), `js/rencana.js` (tab Kas), `js/app.js` (versi), `sw.js` (`tani-keuangan-v0_1_067`), `index.html`, `tani-keuangan.html`, `docs/FAB.md`, `docs/RENCANA.md`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP: pemindaian ulang semua halaman tidak lagi menemukan duplikat; FAB di Unit/Komoditas (kosong) membuka form Tambah unit; FAB di Kas membuka dan menyimpan saldo awal; tanpa galat. Belum diuji di HP sungguhan.

## v0.1.066 — 2026-11-04
Halaman detail siklus dipadatkan; aksi yang sudah ada di tombol + (FAB) tidak lagi diulang di halaman.

### Dihapus (duplikat)
- Tombol **Catat transaksi** dan **Catat panen** di kartu Ringkasan: isinya sama dengan FAB (Catat modal, Catat hasil, Catat panen) di siklus berjalan. Handler `catat-siklus` yang tidak lagi dipakai ikut dihapus.
- Tombol **Kembali ke daftar** di bawah Ringkasan: sudah ada tombol induk **‹ Siklus** di judul halaman dan tombol kembali browser.

### Diubah (optimasi)
- **Panen** menampilkan 3 terbaru dan **Transaksi siklus** 5 terbaru; tombol **Lihat semua (N)** / **Ringkas** membentangkan atau mengecilkan daftarnya. Tombol memakai `aria-expanded`, fokus tetap di tombol, posisi gulir dipertahankan, dan daftar kembali ringkas saat pindah ke siklus lain.
- **Hapus siklus** dipindah ke bagian paling bawah halaman (tidak lagi di kartu Ringkasan) agar aksi yang merusak tidak berdekatan dengan aksi sehari-hari. Perilakunya sama: siklus yang masih punya transaksi tidak bisa dihapus.
- Tinggi halaman pada data contoh: siklus berjalan 3078 px → 2014 px (sekitar 35% lebih pendek); siklus selesai 2201 px → 1635 px.
- Daftar transaksi tidak lagi diurutkan ulang di atas data aslinya (memakai salinan).
- Siklus berjalan kini punya dua tombol aksi di Ringkasan (**Ubah siklus**, **Selesaikan siklus**); siklus selesai tetap **Ubah siklus**, **Buka kembali**, **Ulangi siklus ini**.

### Diperbaiki
- `sw.js`: nama cache masih `tani-keuangan-v0_1_061` meski changelog v0.1.062–065 mencatat pembaruannya. Sekarang `tani-keuangan-v0_1_066`.

### Diubah (berkas)
- `js/siklus.js` (`vDetail`, handler `lg-toggle`), `js/app.js` (versi), `sw.js`, `index.html`, `tani-keuangan.html`, `docs/SIKLUS.md`, `docs/FAB.md`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP dan desktop: isi FAB siklus berjalan (Catat modal, Catat hasil, Catat panen, Tambah jadwal kegiatan), FAB tersembunyi di siklus selesai, Lihat semua/Ringkas (jumlah baris, label, `aria-expanded`, fokus, posisi gulir), reset saat pindah siklus, tombol ‹ Siklus, Selesaikan siklus dan Urungkan, Hapus siklus yang diblokir, tanpa galat. Belum diuji di HP sungguhan.
- Aturan ini hanya diterapkan pada detail siklus. Halaman lain yang mungkin menggandakan FAB belum diperiksa.

## v0.1.065 — 2026-11-04
Aturan surface edit (butir audit terakhir): modal untuk isian sedikit, halaman untuk isian banyak. Aturan tertulis di `docs/MODAL.md`.

### Aturan
- **Modal** bila isiannya sedikit (sekitar empat kolom atau kurang) dan berdiri sendiri: Anggaran, Aset, Utang/piutang, Harga pasar, Saldo awal, Bayar utang, Unit/Komoditas, jadwal kegiatan, **Selesaikan siklus**.
- **Halaman** bila isiannya banyak, berhubungan dengan bagian lain, atau perlu ruang: Transaksi (jumlah, kategori, siklus, nota, piutang), Panen (kotor, susut, harga, pembeli, piutang), Siklus (unit, komoditas, tanggal, catatan), Setelan.
- Dari modal detail, tombol Ubah membuka surface yang sama dengan jenis datanya (Panen tetap ke halaman, sesuai aturan).

### Diubah
- **Selesaikan siklus** kini berupa modal (tanggal selesai, catatan konsekuensi, galat tampil di dalam modal) menggantikan isian yang membuka di halaman. Validasi tetap: tidak sebelum tanggal mulai, tidak di masa depan, tidak sebelum panen terakhir. Esc menutup tanpa mengubah; Urungkan setelah selesai tetap ada.
- Kode mode inline (`fin`, `vSelesai`, `konfirm-selesai`, `batal-selesai`) dihapus; `js/siklus.js` (`selesaiBuka`, `selesaiSimpan`), `js/app.js` (versi), `sw.js` (`tani-keuangan-v0_1_065`), `index.html`, `tani-keuangan.html`, `docs/MODAL.md`, `docs/SIKLUS.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP: tombol membuka modal, tanggal tidak valid ditolak di dalam modal tanpa mengubah status, Esc menutup, menyimpan menyelesaikan siklus, Urungkan mengembalikan, tanpa galat. Belum diuji di HP sungguhan.
- Dengan ini semua butir audit di roadmap sudah dikerjakan; uji di HP sungguhan dan data nyata tetap belum.

## v0.1.064 — 2026-11-04
Penamaan diseragamkan (butir audit). Aturan tertulis di `docs/STYLE.md` (bagian Penamaan).

### Aturan
- **Awalan tombol +:** *Catat* untuk data kejadian (transaksi, panen, harga pasar, utang/piutang); *Tambah* untuk membuat benda atau master (unit, komoditas, aset, jadwal kegiatan); *Atur* untuk menetapkan nilai (anggaran, saldo awal kas).
- **Tombol simpan:** *Simpan* + objek untuk data baru (mis. Simpan harga), *Simpan perubahan* saat mengubah.
- **Toast:** Catat → "… tersimpan"; Tambah → "… ditambahkan"; ubah → "… diperbarui"; hapus → "… dihapus" (dengan Urungkan). Nama objek selalu disebut.
- **Keadaan kosong:** menyebut tombol + dan tindakannya (mis. "Ketuk tombol + lalu pilih Catat panen").

### Diubah
- Toast transaksi: "Tersimpan" menjadi **Transaksi tersimpan**, dan saat mengubah **Transaksi diperbarui** (sebelumnya sama-sama "Tersimpan").
- Toast: "Kategori ditambah" → **Kategori ditambahkan**; "Aset tersimpan" → **Aset ditambahkan** (selaras dengan tombol Tambah aset); "Harga diperbarui" dan "Harga dihapus" → **Harga pasar diperbarui / dihapus**; Panen yang diubah → **Panen diperbarui** (sebelumnya "Panen tersimpan").
- Keadaan kosong kini menyebut tombol +: Panen dan Transaksi siklus (hanya untuk siklus berjalan, karena siklus selesai tidak bisa ditambah), daftar Unit dan Komoditas, serta Harga pasar.
- Nama tombol + di FAB dan label tombol simpan sudah mengikuti aturan, jadi tidak diubah.
- `js/app.js`, `js/siklus.js`, `js/rencana.js`, `js/harga.js`, `sw.js` (`tani-keuangan-v0_1_064`), `index.html`, `tani-keuangan.html`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP: toast transaksi baru dan diubah, serta dua teks keadaan kosong siklus. Teks lain diperiksa dari kode, belum dijalankan satu per satu. Belum diuji di HP sungguhan.
- Toast Utang/piutang ("Catatan tersimpan / diperbarui") dan "Pembayaran tersimpan" tidak diubah.
- Belum dikerjakan dari audit: aturan modal vs halaman untuk edit.

## v0.1.063 — 2026-11-04
Gaya baris daftar disatukan (butir audit). Dokumen: `docs/STYLE.md` (bagian Baris daftar).

### Diubah
- Tiga jenis baris (`.tx` transaksi/siklus/panen, `.ang-baris` anggaran/aset/utang/harga/jadwal, `.m-row` unit/komoditas) kini memakai aturan tampilan yang sama: tinggi minimal 48 px, jarak dan garis pemisah sama, latar saat disentuh/diarahkan, cincin fokus keyboard yang sama (di dalam baris), dan satu tanda **›** di kanan yang menandakan baris bisa dibuka. Sebelumnya Transaksi hanya mengubah warna nama, Anggaran memakai latar, dan Master punya tanda sendiri.
- Tanda › di baris Transaksi/Siklus/Panen dan Anggaran/Aset/Utang/Harga/Jadwal baru ditambahkan; baris Master tetap memakai tanda › miliknya (tidak digandakan). Tanda disembunyikan saat cetak.
- Geser untuk hapus tidak terpengaruh (diuji ulang).
- `css/style.css`, `js/app.js` (versi), `sw.js` (`tani-keuangan-v0_1_063`), `index.html`, `tani-keuangan.html`, `docs/STYLE.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Yang disatukan adalah **tampilan dan perilaku**, bukan markup: ketiganya masih elemen berbeda (`div role=button`, `button`, `div` berisi `span role=button`) karena strukturnya berbeda (geser hapus, bilah progres, tombol di dalam baris). Menyatukan markup memerlukan penulisan ulang banyak tampilan dan belum dikerjakan.
- Diuji di Chromium lebar HP: tampilan Transaksi, Aset, dan Master, serta geser untuk hapus, tanpa galat. Belum diuji di HP sungguhan.
- Belum dikerjakan dari audit: aturan modal vs halaman untuk edit, penamaan.

## v0.1.062 — 2026-11-04
Harga pasar: riwayat jadi daftar ringkas + modal detail (butir audit berikutnya). Dokumen: `docs/HARGA.md`, `docs/MODAL.md`.

### Diubah
- **Riwayat harga** (tab Rencana → Harga) kini satu baris ringkas per catatan (harga per satuan, tanggal, sumber), sama dengan Anggaran/Aset/Utang. Tombol Hapus inline dihapus.
- Ketuk baris membuka **modal detail** (harga, tanggal, sumber, perubahan dari catatan sebelumnya bila ini yang terbaru) dengan tombol **Ubah harga**, **Hapus harga**, dan Tutup.
- **Ubah harga** (baru): tanggal, harga, dan sumber bisa diperbaiki; komoditas tetap. Validasi sama dengan saat mencatat (harga lebih dari 0, tanggal wajib dan tidak di masa depan); galat tampil di dalam modal.
- Hapus harga langsung terhapus dengan **Urungkan**, mengikuti aturan hapus di `docs/MODAL.md`.
- `js/harga.js` (`cek`, `cari`, `edit`, `hapus`; baris ringkas), `js/rencana.js` (formulir `hargaDetail` dan `hargaUbah`), `js/app.js` (versi), `sw.js` (`tani-keuangan-v0_1_062`), `index.html`, `tani-keuangan.html`, `docs/HARGA.md`, `docs/MODAL.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP: baris tampil, detail terbuka, Ubah mengisi nilai lama dan menyimpan (33.000 → 35.000), Hapus lalu Urungkan mengembalikan, harga 0 ditolak dengan pesan di modal, tanpa galat. Belum diuji di HP sungguhan.
- Belum dikerjakan dari audit: aturan modal vs halaman untuk edit, satu komponen baris, penamaan.

## v0.1.061 — 2026-11-04
Penyeragaman pola dan perilaku antar halaman (butir 1–3 dari audit di roadmap). Dokumen baru: `docs/MODAL.md`.

### Ditambahkan
- **Mesin modal bersama** (`js/modal.js`) menggantikan tiga salinan di Rencana, Siklus (Unit/Komoditas), dan Bayar utang.
- **Tombol kembali terhubung ke riwayat browser:** pindah halaman dan membuka modal masing-masing satu entri. Kembali menutup modal dulu, lalu kembali ke halaman sebelumnya. Batal dan Simpan di halaman isian memakai `history.back()` sehingga riwayat tidak menumpuk.

### Diubah
- Klik di luar menutup **semua modal detail**; modal formulir tidak menutup (agar isian tidak hilang). Sebelumnya hanya detail Unit/Komoditas.
- Fokus kembali ke pemicu setelah menyimpan, juga bila halaman digambar ulang (sebelumnya jatuh ke `BODY`). Referensi ke tombol `utang-bayar` yang sudah hilang diganti.
- Pesan galat validasi tampil **di dalam modal** (Rencana, Bayar utang, formulir Unit/Komoditas); sebelumnya campur antara inline dan toast.
- Peringatan "Hanya angka" / "Rupiah bulat" kini juga muncul di modal.
- **Hapus seragam:** transaksi (tombol), siklus, dan unit/komoditas langsung terhapus dengan Urungkan, tanpa "ketuk lagi". Tombol Hapus panen di formulir panen dihapus; panen dihapus lewat modal detail. "Ketuk lagi" tetap dipakai untuk tindakan yang tidak bisa dipulihkan (hapus semua data, cloud, pulihkan cadangan, data contoh).

### Catatan
- Koreksi audit: hapus siklus dan panen sebenarnya sudah punya Urungkan; yang tidak punya hanya hapus transaksi lewat tombol.
- Belum dikerjakan dari audit: Harga pasar jadi daftar + detail, aturan modal vs halaman untuk edit, satu komponen baris, penamaan.
- Diubah: `js/modal.js` (baru), `js/rencana.js`, `js/utang.js`, `js/siklus.js`, `js/app.js`, `js/dlgsiklus.js`, `index.dev.html`, `sw.js` (`tani-keuangan-v0_1_061`), `index.html`, `tani-keuangan.html`, `docs/MODAL.md`, `README.md`, `roadmap.md`, `VERSION`. Diuji di Chromium headless (riwayat, modal, hapus); belum diuji di HP sungguhan.

## v0.1.060 — 2026-11-04
Pola daftar ringkas + modal detail dipakai juga di detail siklus. Dokumen: `docs/JADWAL.md`, `docs/SIKLUS.md`. Unit dan Komoditas (tab Master) sudah memakai pola ini sejak sebelumnya.

### Diubah
- **Jadwal kegiatan:** satu baris per kegiatan; yang selesai dilipat. Ketuk untuk modal detail: Sudah dikerjakan, **Ubah** (baru), Hapus (Urungkan). Formulir "Tambah kegiatan" di halaman dihapus; tambah lewat tombol + → **Tambah jadwal kegiatan**.
- **Panen:** ketuk baris membuka modal detail (kotor, susut, bersih, harga, pembeli) dengan **Ubah panen** dan **Hapus panen** (Urungkan). Siklus selesai kini bisa melihat detail panen (sebelumnya baris tidak bisa diketuk).

### Catatan
- Logika data tidak berubah: hapus panen tetap ikut menghapus transaksi hasilnya dan ditolak bila piutangnya sudah ada pembayaran; jadwal berulang tetap dijadwalkan ulang saat dikerjakan.
- Berkas baru `js/dlgsiklus.js` memakai mesin modal Rencana. Diubah: `js/jadwal.js`, `js/siklus.js`, `js/rencana.js`, `js/fab.js`, `js/app.js`, `sw.js` (`tani-keuangan-v0_1_060`), `index.dev.html`, `index.html`, `tani-keuangan.html`, dokumen, `roadmap.md`, `VERSION`. Belum diuji di HP sungguhan.

## v0.1.059 — 2026-11-04
Sisa usulan optimalisasi halaman Rencana keuangan (roadmap). Dokumen: `docs/RENCANA.md`.

### Ditambahkan
- **Arus kas:** grafik batang arus bersih 6 bulan terakhir ditambah 3 bulan proyeksi (batang pudar), dan baris **Kas cukup ± N bulan** saat rata-rata arus bersih negatif.
- **Utang/piutang:** saringan Semua / Utang / Piutang; catatan lunas dilipat ("Sudah lunas"); lencana **Lewat tempo**.
- **Anggaran:** siklus selesai dilipat di bawah siklus berjalan.
- **Simpan & tambah lagi** di modal Tambah aset dan Catat harga pasar (modal dibuka lagi; komoditas harga tetap terpilih).
- **Harga pasar:** garis tren (hingga 12 catatan) dan **Lihat semua** menggantikan batas 5 catatan.

### Diubah
- Perhitungan kas dilakukan sekali per penggambaran halaman Rencana (sebelumnya diulang belasan kali per bulan dan per angka). Hasil sama.

### Catatan
- Gambar ulang tetap seluruh halaman Rencana, tetapi memakai `App.go('rencana', true)` yang menjaga posisi tampilan; gambar ulang sebagian belum dikerjakan.
- Diubah: `js/rencana.js`, `js/harga.js`, `css/style.css`, `js/app.js`, `sw.js` (`tani-keuangan-v0_1_059`), `index.html`, `tani-keuangan.html`, `docs/RENCANA.md`, `README.md`, `roadmap.md`, `VERSION`. Belum diuji di HP sungguhan.

## v0.1.058 — 2026-11-04
Aset dan Utang/piutang memakai pola daftar ringkas + modal detail, seperti Anggaran. Dokumen: `docs/RENCANA.md`.

### Diubah
- **Aset:** satu baris per aset (nama, nilai buku, bar umur terpakai). Ketuk untuk detail: harga beli, tanggal, umur, penyusutan, nilai buku, dengan tombol Ubah aset dan Hapus aset (Urungkan). Total investasi dan balik modal tetap di bawah daftar.
- **Utang/piutang:** satu baris per catatan (pihak, jenis, sisa, jatuh tempo, tanda lewat). Ketuk untuk detail. Dari transaksi: Bayar / Terima bayar, Lihat transaksi, dan riwayat pembayaran dengan Hapus per pembayaran (Urungkan). Manual: Tandai lunas / Buka lagi, Ubah, Hapus (Urungkan).
- Total utang dan piutang tidak lagi diulang di tab ini karena sudah ada di kartu ringkasan.

### Catatan
- Perilaku data tidak berubah; hanya tampilan dan jalur tombol. Kode tombol lama di halaman dihapus.
- Diubah: `js/rencana.js`, `js/app.js`, `sw.js` (`tani-keuangan-v0_1_058`), `index.html`, `tani-keuangan.html`, `docs/RENCANA.md`, `README.md`, `roadmap.md`, `VERSION`. Belum diuji di HP sungguhan.

## v0.1.057 — 2026-11-04
Tab Anggaran di Rencana keuangan jadi daftar ringkas dengan detail dalam modal. Dokumen: `docs/RENCANA.md`.

### Diubah
- Tiap siklus tampil satu baris: nama, persen terpakai, bar, dan realisasi / anggaran. Urutan dari yang paling terpakai; siklus tanpa anggaran di bawah.
- Ketuk baris membuka modal **detail**: anggaran, realisasi, sisa atau melebihi, serta saran alokasi. Tombol **Ubah anggaran** (membuka form ubah) dan **Hapus anggaran** (dengan Urungkan). Siklus tanpa anggaran mendapat tombol Atur anggaran.
- Tombol + di tab Anggaran tetap membuka form Atur anggaran untuk siklus mana pun.

### Catatan
- Hapus anggaran hanya mengosongkan anggaran (jadi 0), siklus dan transaksinya tidak tersentuh.
- Diubah: `js/rencana.js`, `css/style.css`, `js/app.js`, `sw.js` (`tani-keuangan-v0_1_057`), `index.html`, `tani-keuangan.html`, `docs/RENCANA.md`, `README.md`, `roadmap.md`, `VERSION`. Belum diuji di HP sungguhan.

## v0.1.056 — 2026-11-04
Tiga prioritas dari usulan optimalisasi halaman Rencana keuangan (roadmap). Dokumen: `docs/RENCANA.md`.

### Ditambahkan
- **Kartu ringkasan** di atas sub-tab: saldo kas, utang dan piutang belum lunas, dan anggaran terpakai (jumlah modal siklus ber-anggaran dibanding total anggaran).
- Sub-tab jadi **satu baris yang bisa digeser** dan otomatis menggulir ke yang aktif.
- Aset dan utang/piutang manual punya tombol **Ubah** (modal yang sama dengan tambah). Hapus kini punya **Urungkan**.

### Catatan
- Utang dari transaksi tetap tidak bisa diubah di sini (ubah lewat transaksinya). Mengubah utang manual membuka kembali status lunas.
- Diubah: `js/rencana.js`, `css/style.css`, `js/app.js`, `sw.js` (`tani-keuangan-v0_1_056`), `index.html`, `tani-keuangan.html`, `docs/RENCANA.md`, `README.md`, `roadmap.md`, `VERSION`. Belum diuji di HP sungguhan.

## v0.1.055 — 2026-11-04
Isian Rencana keuangan dipindah dari halaman ke modal yang dibuka lewat tombol +. Dokumen: `docs/FAB.md`, `docs/RENCANA.md`.

### Diubah
- Rencana → **Aset**, **Utang/piutang**, **Harga pasar**: formulir di halaman dihapus. Tombol + membuka modal (Tambah aset, Catat utang atau piutang, Catat harga pasar). Sebelumnya tombol + hanya menggulir ke isian.
- Rencana → **Anggaran**: kolom isian per siklus diganti tampilan baca. Tombol + membuka modal Atur anggaran (pilih siklus; isian terisi anggaran saat ini). Tiap siklus juga punya tombol **Atur anggaran** ke modal yang sama.
- Rencana → **Arus kas**: saldo awal kas tampil sebagai angka. Tombol + kini berisi Catat modal, Catat hasil, dan **Atur saldo awal kas**; ada pula tombol Atur saldo awal di bagian itu.
- Bila halaman Aset atau Utang/piutang masih kosong, tampil petunjuk singkat untuk mengetuk +.

### Catatan
- Modal memakai pola yang sama dengan jendela Bayar: gulir halaman terkunci, Esc menutup, Enter menyimpan, fokus terjebak di modal dan kembali ke pemicu, galat tampil di dalam modal tanpa menutupnya.
- Tombol + menampilkan pesan, bukan modal, bila belum ada komoditas (Harga pasar) atau belum ada siklus (Anggaran).
- **Kelayakan** tidak diubah: itu kalkulator dengan hasil langsung saat mengetik, bukan pencatatan data.
- Struktur data tidak berubah. `Harga.simpan()` dipisah dari `Harga.aksi()` (kini hanya hapus); `Fab.fokus()` dihapus; `Rencana.pesan()` dihapus.
- Diubah: `js/rencana.js`, `js/harga.js`, `js/fab.js`, `js/app.js` (versi), `sw.js` (cache `tani-keuangan-v0_1_055`), `index.html`, `tani-keuangan.html`, `docs/FAB.md`, `docs/RENCANA.md`, `docs/HARGA.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`.
- Diuji di Chromium headless (layar 390 px): tiap sub-tab tanpa isian di halaman, simpan aset, utang (termasuk galat kosong), harga pasar, anggaran, dan saldo awal lewat Enter berhasil tanpa galat skrip. Belum diuji di HP sungguhan.

## v0.1.054 — 2026-11-04
Ekspor Excel (.xlsx) multi-lembar (backlog roadmap: ekspor ke Excel). Dokumen: `docs/EKSPOR.md`.

### Ditambahkan
- Lainnya → **Ekspor Excel (.xlsx)**: satu berkas dengan lembar Siklus (Untung dan R/C berupa rumus Excel), Transaksi, Panen, Utang dan piutang, Aset, Harga pasar, dan Jadwal. Baris judul dibekukan dan berfilter, tanggal bertipe tanggal, uang berformat ribuan.
- Pembuat .xlsx sendiri (`js/xlsx.js`, ZIP + XML, tanpa pustaka luar), jadi tetap jalan luring.

### Catatan
- Ekspor satu arah untuk analisis; cadangan yang bisa dipulihkan tetap JSON. Ekspor/impor CSV tidak berubah. Foto nota tidak ikut.
- Berkas baru `js/xlsx.js`; diubah `js/app.js` (tombol dan versi), `index.dev.html`, `sw.js` (cache `tani-keuangan-v0_1_054`), `index.html`, `tani-keuangan.html`, `docs/EKSPOR.md`, `docs/SETELAN.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`.
- Berkas hasil diuji dibuka dengan openpyxl (7 lembar, rumus, tanggal, karakter khusus XML, nama lembar, pembekuan baris, filter) dan lolos uji integritas ZIP. Belum diuji di Excel/HP sungguhan; unduhan tidak berjalan di pratinjau web artefak.

## v0.1.053 — 2026-11-04
Kalkulator kelayakan usaha (backlog roadmap: NPV, IRR sederhana). Dokumen: `docs/KELAYAKAN.md`.

### Ditambahkan
- Sub-tab **Kelayakan** di Rencana keuangan: investasi awal, arus kas bersih per periode (bulanan atau tahunan), jumlah periode, nilai sisa, dan diskonto per tahun.
- Hasil langsung saat mengetik: **NPV** (layak / belum layak), **IRR per tahun**, **balik modal**, **PI**, dan total arus kas masuk.
- Tombol isi cepat arus kas dari rata-rata 3 bulan; isian terakhir diingat di `pengaturan.kelayakan`.

### Catatan
- Model sederhana (arus kas tetap per periode); tidak mengubah transaksi, kas, atau laporan. Skema bertambah satu objek opsional di pengaturan.
- Berkas baru `js/kelayakan.js`; diubah `js/rencana.js`, `js/app.js` (versi), `index.dev.html`, `sw.js` (cache `tani-keuangan-v0_1_053`), `index.html`, `tani-keuangan.html`, `docs/KELAYAKAN.md`, `docs/DATA-SCHEMA.md`, `docs/RENCANA.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`.
- Diuji dengan skrip logika terhadap hitungan manual (NPV −5,26 dan IRR 9,7% untuk investasi 1.000 dengan 3×400 pada diskonto 10%, kasus layak, konversi bulanan, balik modal, validasi). Belum diuji di browser dan HP sungguhan.

## v0.1.052 — 2026-11-04
Katalog harga pasar (input manual) dan pembanding harga (backlog roadmap). Dokumen: `docs/HARGA.md`.

### Ditambahkan
- Sub-tab **Harga pasar** di Rencana keuangan: catat harga pasar per komoditas (tanggal, harga, sumber), harga terakhir dengan tren ▲/▼, riwayat 5 catatan, hapus dengan Urungkan.
- **Pembanding**: harga jualmu 90 hari terakhir (tertimbang panen bersih) dibanding harga pasar terakhir.
- Form Catat panen menampilkan harga pasar terakhir sebagai acuan; tombol + di sub-tab mengarah ke isian harga.
- Data contoh: dua harga pasar cabai.

### Catatan
- Skema komoditas bertambah `hargaPasar` (opsional, data lama tetap valid). Tidak memengaruhi rumus keuangan.
- Berkas baru `js/harga.js`; diubah `js/rencana.js`, `js/siklus.js`, `js/fab.js`, `js/contoh.js`, `js/app.js` (versi), `index.dev.html`, `sw.js` (cache `tani-keuangan-v0_1_052`), `index.html`, `tani-keuangan.html`, `docs/HARGA.md`, `docs/DATA-SCHEMA.md`, `docs/RENCANA.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`.
- Roadmap: butir backlog analisa sensitivitas dan template komoditas ditandai selesai (sudah ada sejak v0.1.029 dan v0.1.030).
- Diuji dengan skrip logika (validasi, rata-rata tertimbang, tren, hapus/Urungkan, batas riwayat). Belum diuji di browser dan HP sungguhan.

## v0.1.051 — 2026-11-04
Jadwal kegiatan per siklus (dari backlog roadmap: kalender tanam + pengingat jadwal pupuk/panen). Dokumen: `docs/JADWAL.md`.

### Ditambahkan
- Bagian **Jadwal kegiatan** di detail siklus: tambah kegiatan (nama, tanggal, ulangi tiap N hari atau sekali), **Sudah dikerjakan** (berulang dijadwalkan lagi N hari sejak hari ini), Hapus, keduanya dengan Urungkan.
- Beranda → Perlu perhatian: pengingat kegiatan yang jatuh tempo dalam 3 hari atau sudah lewat.
- Data contoh: dua kegiatan di siklus cabai.

### Catatan
- Skema siklus bertambah `jadwal` (opsional, data lama tetap valid). Tidak memengaruhi rumus keuangan.
- Berkas baru `js/jadwal.js`; diubah `js/siklus.js`, `js/beranda.js`, `js/contoh.js`, `js/app.js` (versi), `index.dev.html`, `sw.js` (cache `tani-keuangan-v0_1_051`), `index.html`, `tani-keuangan.html`, `docs/JADWAL.md`, `docs/DATA-SCHEMA.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`.
- Diuji dengan skrip logika (validasi, ulang, selesai, Urungkan, pengingat, siklus selesai). Belum diuji di browser dan HP sungguhan; pengingat hanya tampil saat aplikasi dibuka.

## v0.1.050 — 2026-11-04
Penyempurnaan Catat panen vs Catat hasil (dari backlog roadmap). Dokumen: `docs/SIKLUS.md`.

### Ditambahkan
- Catat hasil: **peringatan hasil ganda** bila siklus yang dipilih sudah punya panen berharga (yang otomatis tercatat sebagai Hasil).
- Catat hasil berkategori Penjualan Hasil Panen: catatan bahwa hasil tanpa jumlah barang tidak masuk HPP/BEP/harga minimum, dengan tombol **Catat sebagai panen**.
- Beranda → Perlu perhatian: pengingat **panen belum dijual**; ketuk membuka form panen untuk mengisi harga.

### Catatan
- Tidak mengubah skema data maupun rumus. Catatan di form diperbarui langsung saat siklus atau kategori diganti.
- Diuji dengan skrip logika (kondisi tampil catatan, pengingat, panen masa depan tidak diingatkan). Belum diuji di browser dan HP sungguhan.
- Diubah: `js/app.js`, `js/siklus.js`, `js/beranda.js`, `sw.js` (cache `tani-keuangan-v0_1_050`), `index.html`, `tani-keuangan.html`, `docs/SIKLUS.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.049 — 2026-11-04
Tahap 2 pembayaran utang/piutang: tombol Bayar dan cicilan. Dokumen: `docs/UTANG.md`.

### Ditambahkan
- Tombol **Bayar** (utang) / **Terima bayar** (piutang) di Rencana → Utang/piutang untuk utang dari transaksi. Jendela pembayaran: jumlah bebas (bawaan seluruh sisa, tombol *Semua sisa*) dan tanggal bayar, dengan pemilih tanggal yang sama seperti form lain.
- **Cicilan**: pembayaran sebagian diperbolehkan; sisa tetap tercatat. Utang menjadi **lunas otomatis** saat sisa nol.
- Kartu utang menampilkan bilah kemajuan, jumlah dibayar, sisa, dan **riwayat pembayaran**; tiap pembayaran bisa dihapus dengan **Urungkan**.

### Diubah
- **Tandai lunas / Buka lagi** tidak lagi dipakai untuk utang dari transaksi (digantikan Bayar dan Hapus pembayaran); tetap ada untuk utang manual.
- Validasi pembayaran: jumlah > 0 dan tidak melebihi sisa; tanggal tidak sebelum tanggal transaksi dan tidak di masa depan.

### Catatan
- Tidak mengubah skema data: pembayaran memakai `utang.bayar` yang sudah ada sejak v0.1.048; `lunas` pada utang tertaut kini dihitung otomatis. Rumus kas tidak berubah.
- Diuji dengan skrip logika (cicilan, lunas otomatis, hapus/urungkan pembayaran, kas piutang dan utang, validasi, tampilan daftar). Jendela Bayar belum diuji di browser dan HP sungguhan.
- Diubah: `js/utang.js`, `js/rencana.js`, `css/style.css`, `sw.js` (cache `tani-keuangan-v0_1_049`), `index.html`, `tani-keuangan.html`, `docs/UTANG.md`, `docs/DATA-SCHEMA.md`, `docs/RENCANA.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`, `js/app.js` (versi).

## v0.1.048 — 2026-11-04
Tahap 1 pembayaran utang/piutang dari transaksi. Dokumen: `docs/UTANG.md`.

### Ditambahkan
- Isian **Pembayaran** di Catat modal, Catat hasil, dan Catat panen: Tunai, Belum dibayar, Sebagian dibayar (uang muka). Bila ada sisa, pihak wajib diisi dan jatuh tempo opsional.
- Sisa otomatis menjadi **utang** (modal) atau **piutang** (hasil) tertaut ke transaksi, tampil di Rencana → Utang/piutang dan di baris transaksi.
- **Tandai lunas** pada utang tertaut mencatat pembayaran (menggerakkan kas, bukan transaksi baru); Buka lagi membatalkannya. Tombol Hapus diganti Lihat transaksi untuk utang tertaut.

### Diubah
- **Saldo kas** (Beranda), **Arus kas** dan proyeksi (Rencana) kini dihitung dari uang yang benar-benar bergerak. Untung, R/C, HPP, BEP, dan laporan tetap memakai nilai penuh transaksi.
- Total utang/piutang dan pengingat jatuh tempo memakai sisa yang belum dibayar.
- Hapus transaksi, panen, atau geser hapus ikut menghapus utang tertaut dan Urungkan memulihkannya; ditolak bila sudah ada pembayaran.

### Catatan
- Tidak mengubah data lama: transaksi tanpa utang dianggap tunai. Skema utang bertambah `transaksiId` dan `bayar` (opsional). CSV tidak memuat status pembayaran.
- Berkas baru `js/utang.js`; diubah `js/app.js`, `js/siklus.js`, `js/rencana.js`, `js/beranda.js`, `js/geser.js`, `index.dev.html`, `sw.js` (cache `tani-keuangan-v0_1_048`), `index.html`, `tani-keuangan.html`, `docs/DATA-SCHEMA.md`, `docs/UTANG.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.047 — 2026-11-04
### Diubah
- Setiap baris di **Perlu perhatian** (Beranda) kini bisa diketuk dan memakai tanda ›: perkiraan panen dan anggaran membuka detail siklusnya; utang/piutang jatuh tempo membuka Rencana → Utang/piutang. Bisa lewat keyboard (Enter/Spasi).

### Catatan
- Tidak mengubah skema data. `js/beranda.js`, `js/app.js`, `css/style.css`, `sw.js` (cache `tani-keuangan-v0_1_047`), `README.md`, `roadmap.md`, `VERSION`.

## v0.1.046 — 2026-11-04
### Diubah
- Tombol **Siklus baru** dihapus dari halaman Siklus; siklus baru dibuat lewat tombol + (FAB). Teks daftar kosong menunjuk ke tombol +.

### Catatan
- Tidak mengubah skema data. `js/siklus.js`, `js/app.js`, `sw.js` (cache `tani-keuangan-v0_1_046`), `docs/SIKLUS.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.045 — 2026-11-04
### Diubah
- Tombol **Siklus baru** dihapus dari modal detail unit dan komoditas. Siklus baru dibuat dari menu Siklus.

### Catatan
- Tidak mengubah skema data. `js/siklus.js`, `js/app.js`, `sw.js` (cache `tani-keuangan-v0_1_045`), `docs/SIKLUS.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.044 — 2026-11-04
Tombol + di halaman Unit kini berupa pilihan melayang, sama seperti di Beranda.

### Diubah
- Ketuk + membuka dua pilihan: **Tambah unit** dan **Tambah komoditas**; ikon berubah jadi ✕ untuk menutup. Pilihan tidak lagi bergantung tab yang aktif.
- Catatan teks halaman Unit disesuaikan.

### Catatan
- Tidak mengubah skema data. `js/fab.js`, `js/siklus.js`, `sw.js` (cache `tani-keuangan-v0_1_044`), `index.html`, `tani-keuangan.html`, `docs/FAB.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.043 — 2026-11-04
Form unit dan komoditas pindah ke modal, dibuka dengan tombol + (FAB).

### Diubah
- Halaman Unit kini hanya berisi daftar. **Tombol +** membuka modal form Tambah unit atau Tambah komoditas sesuai tab aktif (template komoditas ada di dalam modal).
- **Ubah** (dari modal detail) membuka modal form yang sama dengan data terisi; dari detail siklus tidak lagi pindah ke halaman Unit.
- Modal form: fokus ke isian nama, Enter menyimpan, Esc/✕/Batal menutup, ketuk latar tidak menutup (mencegah isian hilang), pesan galat (toast) tampil di atas modal.
- Daftar kosong menampilkan tombol Tambah di halaman.

### Catatan
- Tidak mengubah skema data. `js/siklus.js`, `js/fab.js`, `js/app.js`, `css/style.css`, `sw.js` (cache `tani-keuangan-v0_1_043`), `index.html`, `tani-keuangan.html`, `docs/SIKLUS.md`, `docs/FAB.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.042 — 2026-11-04
Optimasi halaman Siklus dan Lainnya setelah unit dan komoditas punya menu sendiri.

### Siklus
- **Saringan Unit dan Komoditas** di daftar (muncul bila ada lebih dari 3 siklus); angka pada tab Berjalan/Selesai mengikuti saringan.
- **Ringkasan** total modal, hasil, dan untung/rugi untuk siklus yang tampil (bila lebih dari 1).
- Tombol "Kelola unit & komoditas" dihapus dari daftar; kini hanya muncul sebagai "Siapkan unit & komoditas" bila unit atau komoditas belum ada.
- **Detail siklus**: baris Unit dan Komoditas bisa diketuk untuk membuka modal detail. Arsipkan dari sana tetap di halaman siklus; Ubah membawa ke menu Unit dengan form terisi.
- Membuka siklus dari modal kini menutup modal.

### Lainnya
- Kartu Unit & komoditas dihapus (sudah ada di menu); Rencana keuangan dipindah ke atas.
- Tombol + dihilangkan di halaman ini karena isinya pengaturan (kategori, CSV), bukan pencatatan.

### Catatan
- Tidak mengubah skema data. `js/app.js`, `js/siklus.js`, `js/fab.js`, `sw.js` (cache `tani-keuangan-v0_1_042`), `index.html`, `tani-keuangan.html`, `docs/SIKLUS.md`, `docs/FAB.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.041 — 2026-11-04
Menu dan halaman khusus unit dan komoditas. Dokumen: `docs/SIKLUS.md`.

### Ditambahkan
- **Menu Unit** di navigasi atas dan bawah (antara Siklus dan Laporan), tidak lagi tersembunyi di Lainnya. Halaman bernama Unit & komoditas dan menyala sebagai menu aktif.
- **Dua tab** Unit / lahan (n) dan Komoditas (n): satu daftar per layar, bukan dua daftar bertumpuk. Isian form tiap tab tidak hilang saat berpindah tab.
- **Tombol +** (FAB) di halaman ini: Tambah unit atau Tambah komoditas, sesuai tab aktif; menyorot isian nama.
- Modal detail (v0.1.040) tetap dipakai dari kedua daftar.

### Diubah
- Enam menu bawah kini muat di layar 320 px (huruf menu sedikit lebih kecil di bawah 360 px).
- Lainnya masih punya pintasan, tombolnya kini "Buka halaman Unit". Halaman Unit tidak lagi punya tautan kembali ke Lainnya.

### Catatan
- Tidak mengubah skema data.
- `js/app.js`, `js/siklus.js`, `js/fab.js`, `css/style.css`, `sw.js` (cache `tani-keuangan-v0_1_041`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/SIKLUS.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.040 — 2026-11-04
Detail unit dan komoditas ditampilkan dalam modal dengan tombol aksi. Dokumen: `docs/SIKLUS.md`.

### Ditambahkan
- **Modal detail** untuk unit dan komoditas: ketuk namanya di Lainnya → Kelola unit & komoditas. Isi: jenis, luas/kapasitas (unit) atau satuan hasil, umur panen, panen bersih, dan panen terdekat (komoditas), jumlah siklus (berjalan/selesai), total modal, hasil, untung/rugi dari semua siklusnya, serta 5 siklus terbaru (ketuk untuk membuka detail siklus).
- **Tombol aksi di modal**: Siklus baru (isian unit/komoditas terpilih), Ubah, Arsipkan/Pulihkan, Hapus (dua ketukan, ada Urungkan). Keterangan di modal menjelaskan mengapa Hapus tidak tersedia bila sudah dipakai siklus.
- Aksesibilitas modal: `role="dialog"` + `aria-modal`, fokus masuk ke modal dan kembali ke baris saat ditutup, Tab terkunci di dalam modal, Esc/✕/ketuk latar menutup, gulir latar dikunci, animasi dihormati preferensi kurangi gerakan. Tampil sebagai lembar bawah di HP dan di tengah di layar lebar.

### Diubah
- Baris unit dan komoditas kini bersih: nama, ringkasan, jumlah siklus, penanda arsip, dan panah. Tombol Hapus/Arsipkan per baris pindah ke modal.
- Hapus unit/komoditas yang sudah tidak dipakai siklus manapun kini juga tersedia untuk yang berstatus arsip.
- Mode Tersembunyi ikut menyamarkan nominal di modal.

### Catatan
- Tidak mengubah skema data; data v0.1.039 terbaca apa adanya.
- `js/siklus.js`, `js/app.js` (Samar menyapu modal), `css/style.css`, `sw.js` (cache `tani-keuangan-v0_1_040`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/SIKLUS.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.039 — 2026-11-04
Optimalisasi CRUD siklus, unit, dan komoditas (sebelum melanjutkan Fase 7). Dokumen: `docs/SIKLUS.md`.

### Ditambahkan
- **Ubah unit dan komoditas.** Sebelumnya hanya bisa tambah dan hapus. Ketuk nama di daftar (Lainnya → Kelola unit & komoditas): form terisi, baris ditandai, tombol jadi **Simpan perubahan** dengan **Batal**. Isian form yang sedang diketik tidak hilang saat halaman digambar ulang (hapus/arsip baris lain).
- **Arsipkan.** Unit atau komoditas yang sudah dipakai siklus (termasuk siklus lama yang selesai) tidak bisa dihapus; kini ada **Arsipkan** (dan **Pulihkan**). Yang diarsipkan tidak muncul di pilihan siklus baru, tetapi tetap tampil di siklus lama. Field baru `arsip` pada unit dan komoditas.
- **Ubah siklus**: unit, komoditas, tanggal mulai, tanggal selesai (siklus selesai), catatan. Panen dan transaksi tetap terhubung.
- **Tanggal selesai dipilih sendiri** saat Selesaikan siklus (bawaan hari ini), tidak lagi otomatis hari ini. Ada **Urungkan** setelah menyelesaikan.
- **Ulangi siklus ini** (siklus selesai): form siklus baru terisi unit, komoditas, dan catatan yang sama, tanggal mulai hari ini.
- Siklus baru memakai unit dan komoditas siklus terakhir sebagai isian awal (bila masih aktif).
- **Urungkan** setelah menghapus siklus, unit, komoditas, dan panen (hapus panen ikut memulihkan transaksi hasilnya).
- Tab daftar siklus menampilkan jumlah: Berjalan (n) / Selesai (n). Baris unit dan komoditas menampilkan "N siklus" bila dipakai.

### Diubah
- Hapus unit/komoditas butuh dua ketukan ("Yakin hapus?"), sama seperti hapus lain; sebelumnya satu ketukan langsung hapus.
- Pesan hapus siklus yang masih punya data menyebut jumlahnya ("2 transaksi dan 1 panen masih terhubung").
- Siklus selesai: panen hanya bisa diubah setelah dibuka kembali (aturan lama, kini dijelaskan di halaman).

### Validasi baru
- Nama unit dan komoditas tidak boleh kembar (huruf besar/kecil dan spasi ganda diabaikan).
- Luas/kapasitas harus angka lebih dari 0 dan wajib bersatuan; umur panen bilangan bulat 1–730 hari; satuan hasil wajib.
- Tanggal panen tidak boleh sebelum tanggal mulai siklus. Tanggal mulai tidak boleh setelah panen pertama; tanggal selesai tidak boleh sebelum mulai, setelah hari ini, atau sebelum panen terakhir.
- Impor, pemulihan, dan sinkron membuang unit atau komoditas tanpa nama (lewat `Store.sah`).

### Diperbaiki
- Menghapus siklus, unit, komoditas, dan menyelesaikan siklus kini memperbarui `diubah`, sehingga sinkron cloud (gabung per entri) tidak salah memilih versi lama.
- Mengganti satuan komoditas yang sudah punya panen memunculkan peringatan bahwa satuan baru berlaku di semua panennya.

### Catatan
- Diuji di Chromium (Playwright): 67 pemeriksaan lolos (tambah/ubah/batal/hapus/arsip/Urungkan unit dan komoditas, semua validasi, ubah siklus, selesai dengan tanggal, ulangi siklus, hapus siklus dan panen dengan Urungkan, Enter di baris, tanpa luapan di 320 px, target ketuk 40 px, tema terang/gelap), tanpa galat JavaScript. **Belum diuji** di HP sungguhan dan dengan pembaca layar.
- Tidak mengubah skema lama: data v0.1.038 terbaca apa adanya (field `arsip` opsional).
- `js/siklus.js`, `js/app.js` (hook `Siklus.pindah`, judul Ubah siklus, `Store.sah`), `css/style.css`, `sw.js` (cache `tani-keuangan-v0_1_039`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/SIKLUS.md`, `docs/DATA-SCHEMA.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.038 — 2026-11-04
Fase 7 — optimasi performa dan aksesibilitas (bagian pertama). Hasil ukur dan audit: `docs/AUDIT.md` (bagian "Fase 7").

### Performa
- **Daftar Transaksi bertahap**: 100 baris pertama, tombol "Tampilkan lebih banyak (sisa N)" untuk 100 berikutnya. Dengan 6.000 transaksi dan periode "Semua", render turun dari 132 ms (6.075 baris) menjadi 14 ms (100 baris). Ringkasan Modal/Hasil/Untung, CSV, dan Laporan tetap dihitung dari semua baris. Batas kembali ke 100 saat filter atau pencarian berubah.

### Aksesibilitas
- Menu aktif diberi `aria-current="page"` (menu atas, menu bawah, tombol Setelan); kedua `nav` diberi label.
- Tautan **Lewati ke konten** (Tab pertama, tampil saat fokus); `#app` bisa menerima fokus.
- Pembaca layar diberi tahu nama halaman saat berpindah (wilayah `aria-live`).
- Tab Laporan: navigasi keyboard sesuai pola ARIA (panah kiri/kanan, Home, End; tabindex bergulir).
- Preferensi **kurangi gerakan** sistem meredam semua animasi dan transisi.

### Catatan
- Audit otomatis (nama tombol, label kolom, urutan judul, target ketuk 40 px, kontras 4,5:1; 8 halaman × terang/gelap): tidak ada temuan baru. Peringatan kontras "●" (legenda) tetap negatif palsu yang sudah dicatat.
- Uji di Chromium (Playwright): 15 pemeriksaan Fase 7 + 26 pemeriksaan foto nota lolos, tanpa galat JavaScript. **Belum diuji** dengan pembaca layar sungguhan (TalkBack/VoiceOver) dan di HP berspesifikasi rendah; butir Fase 7 "Optimasi performa dan aksesibilitas" karena itu belum dicentang.
- `js/app.js`, `js/analisa.js`, `css/style.css`, `index.dev.html`, `sw.js` (cache `tani-keuangan-v0_1_038`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/AUDIT.md`, `docs/TRANSAKSI.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.037 — 2026-11-04
Fase 6C — foto nota/bukti transaksi (lokal dulu). Dokumen: `docs/NOTA.md`.

### Ditambahkan
- **Foto nota** di form Catat/Ubah (opsional): ambil dari kamera atau pilih dari galeri, lihat layar penuh, ganti, atau hapus. Satu foto per transaksi.
- Foto dikecilkan sebelum disimpan (sisi terpanjang maks. 1280 px, JPEG 0,72) dan disimpan di **IndexedDB** `tani-nota`, bukan localStorage, sehingga kuota data utama aman. Transaksi hanya menyimpan rujukan `notaId`.
- Ikon kamera kecil di baris transaksi yang punya foto.
- Mode **Tersembunyi** juga berlaku: gambar kecil diburamkan dan tampilan penuh ditahan sampai tombol mata dibuka.
- Setelan → Data → **Foto nota**: jumlah dan ukuran foto, tombol **Hapus semua foto** (dua ketukan).
- Pembersihan otomatis foto yatim (tidak dirujuk transaksi, lebih dari 30 hari).
- Bila rujukan ada tetapi foto tidak ada di browser ini (perangkat lain, data browser dibersihkan): pesan jelas, **Pilih foto** atau **Lepas rujukan**.

### Perilaku yang perlu diketahui
- Foto **tidak** ikut ekspor JSON, cadangan otomatis, maupun sinkron cloud; hanya rujukannya.
- Batal, Duplikat, ganti, dan hapus foto tidak meninggalkan berkas yatim. Duplikat transaksi tidak menyalin foto.
- Hapus transaksi (lunak) tidak langsung menghapus foto, agar Urungkan tetap bisa memulihkan.

### Catatan
- Diuji di Chromium (Playwright): 26 pemeriksaan lolos (kecilkan 3000×2000 ke 1280 px, simpan/ganti/hapus/batal/duplikat, berkas bukan gambar, Tersembunyi, ekspor tanpa isi foto, Setelan, pembersihan, tanpa luapan di 320 px), tanpa galat JavaScript. **Belum diuji** di kamera HP sungguhan, HEIC di Safari/iOS, dan batas kuota IndexedDB perangkat.
- `js/nota.js` (baru), `js/app.js`, `js/setelan.js`, `css/style.css`, `index.dev.html`, `sw.js` (cache `tani-keuangan-v0_1_037`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/NOTA.md` (baru), `docs/DATA-SCHEMA.md`, `docs/TRANSAKSI.md`, `docs/SETELAN.md`, `docs/CADANGAN.md`, `docs/PANDUAN.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.036 — 2026-11-04
Tindak lanjut catatan "untuk keputusan Anda" di `docs/AUDIT.md` (tabel keputusan di bagian akhir berkas itu).

### Diubah
- **Tersembunyi berlaku di semua halaman.** Semua nominal rupiah disamarkan (Transaksi, Siklus, Laporan, Rencana, Perlu perhatian, hasil pencarian, dan bagian yang dirender ulang). Tombol mata kedua muncul di header pada halaman selain Beranda; saat mencetak, angka tampil. Teks di Setelan diperbarui.
- **HPP** kini tidak menghitung pembelian alat, dan **harga jual rata-rata** tidak menghitung penjualan bibit dan bantuan, sehingga tidak menyimpang bila dua hal itu dikaitkan ke siklus. Untung/rugi tetap berbasis kas.
- Anggaran, harga aset, dan jumlah utang/piutang memakai pemisah ribuan seperti form lain.
- Label bulan di Arus kas memakai nama ("Jun 2026"); tombol CSV di Lainnya satu baris ("Impor teks").

### Ditambahkan
- **Saldo awal kas** (Rencana → Arus kas): uang yang sudah ada sebelum transaksi pertama; dihitung di saldo kas Beranda dan Arus kas, bukan sebagai hasil atau untung. Data contoh mengisi Rp 6.000.000 (saldo kas contoh tidak lagi negatif) dan ikut direset saat contoh dihapus, kecuali sudah Anda ubah.
- Rentang tanggal terbalik di Transaksi menampilkan petunjuk dan tombol Tukar tanggal.
- Tempel angka di kolom rupiah: "12,5" menjadi 13, "1.250.000" dibaca benar, teks yang tidak dikenali (mis. "1e3") ditolak dengan pesan.

### Diperbaiki
- Mengetik huruf atau koma di kolom rupiah tidak lagi mengubah angka tanpa petunjuk: tampil pesan "Hanya angka" atau "Rupiah bulat, tanpa desimal". Impor CSV memakai pembaca angka yang sama (baris dengan angka tidak dikenali dilewati).

### Catatan
- Diuji di Chromium (Playwright): 26 pemeriksaan lolos (penyamaran di semua halaman dan sub-tab, cetak, hitungan HPP/harga dengan skenario terkontrol, saldo awal, parser angka, tempel, tombol CSV di 390 dan 320 px), tanpa galat JavaScript. Belum diuji di perangkat sungguhan.
- `js/app.js` (`angka`, `Samar`, tempel, rentang terbalik), `js/analisa.js`, `js/rencana.js`, `js/beranda.js`, `js/contoh.js`, `js/setelan.js`, `css/style.css`, `index.dev.html`, `sw.js` (cache `tani-keuangan-v0_1_036`), `index.html` dan `tani-keuangan.html` (hasil build), `docs/AUDIT.md`, `docs/SETELAN.md`, `docs/LAPORAN.md`, `docs/DATA-SCHEMA.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.035 — 2026-11-04
Audit seluruh halaman pada v0.1.034 (4 konfigurasi: HP terang, HP gelap + kaca, desktop terang, desktop gelap; data contoh, data kosong, dan data tepi) dan perbaikan temuan. Laporan lengkap: `docs/AUDIT.md`.

### Diperbaiki
- **Impor JSON yang strukturnya salah merusak data.** Contoh: `{"transaksi":"x"}` atau `{"unit":5}` menimbulkan galat JavaScript dan, setelah muat ulang, aplikasi tampil kosong karena data rusak tersimpan. Kini data selalu dinormalkan lewat `Store.dari()` (koleksi yang bukan daftar dianggap kosong, entri yang tidak valid dibuang) pada pemuatan, impor, pemulihan cadangan, dan sinkron cloud. Data rusak yang sudah telanjur tersimpan ikut terpulihkan saat dimuat.
- **Impor JSON yang bukan berkas ekspor** (`{}`, `[]`, `[1,2,3]`, `{"versi":1}`) sebelumnya mengosongkan seluruh data dengan pesan "berhasil". Kini ditolak dengan pesan "Format tidak dikenali" dan data tidak berubah. Impor yang berhasil menyebut jumlah bagian tidak valid yang dilewati dan bahwa salinan data sebelumnya ada di Cadangan otomatis.
- Baris berperan tombol (baris siklus, baris transaksi) tidak bisa dibuka dengan keyboard; kini Enter dan Spasi bekerja.
- Format R/C di Laporan memakai titik ("0.77", "0.69") sedangkan Beranda memakai koma ("3,38"); kini seragam koma.
- Tabel "Arus kas" memecah angka rupiah ke dua baris di layar HP dan tabel angka grafik bisa melebar keluar layar pada angka sangat besar; kini angka tidak terpotong dan tabel bisa digulir mendatar bila perlu.
- Teks usang "Segera hadir ... hadir di Fase 5" di halaman Lainnya dihapus (fitur tersebut sudah ada).
- Target ketuk di bawah 40 px sesuai roadmap: tombol mata (35 px), baris "Tabel angka grafik" dan "Saran alokasi anggaran" (18 px), chip "0" di simulasi Laporan (33 px).

### Diubah
- `js/app.js` (`Store.dari`, `Store.sah`, `fmtRC`, penanganan keyboard, versi), `js/analisa.js`, `js/rencana.js`, `js/setelan.js` (validasi impor), `css/style.css`, `sw.js`, `index.html`, `tani-keuangan.html` (hasil build), `README.md`, `roadmap.md`, `docs/AUDIT.md` (baru), `docs/SETELAN.md`, `VERSION`.

### Catatan
- Tidak ditemukan galat JavaScript pada seluruh halaman; perhitungan (modal, hasil, untung, HPP, BEP, simulasi, filter, pencarian) cocok dengan hitungan mandiri; ekspor lalu impor menghasilkan data identik; mode luring dan service worker berfungsi.
- Yang sengaja tidak diubah (keputusan desain): lihat bagian "Catatan untuk keputusan Anda" di `docs/AUDIT.md`.
- Diuji di Chromium (Playwright). Belum diuji di perangkat sungguhan.

## v0.1.034 — 2026-11-04
Fase 7 — panduan cepat di dalam aplikasi, panduan pengguna, dan perbaikan `sw.js`.

### Ditambahkan
- `js/panduan.js`: panduan cepat 4 layar (Selamat datang, Catat dengan tombol +, Siklus dan Laporan, Data aman dan bisa dibawa) berupa lembar dialog dengan penanda langkah, tombol Kembali/Lewati/Lanjut/Mulai, Esc untuk menutup, fokus terkunci di dalam dialog (`role="dialog"`, `aria-modal`), dan mengikuti tema, efek kaca (latar kartu hampir padat agar teks di belakangnya tidak mengganggu), serta preferensi kurangi gerakan.
- Tampil otomatis **sekali** hanya untuk pengguna yang pertama kali membuka aplikasi (saat data contoh terisi otomatis); pengguna lama tidak dipaksa. Status tersimpan di `tani.panduan`.
- Setelan → Tentang → **Panduan cepat** (tombol Tampilkan) untuk membuka lagi.
- `docs/PANDUAN.md`: panduan pengguna (mulai, mencatat, siklus dan panen, laporan, rencana, setelan, cadangan, pemecahan masalah).

### Diperbaiki
- `sw.js` pada paket v0.1.033 kosong (0 byte), sehingga service worker tidak melakukan apa pun. Ditulis ulang sesuai perilaku di `docs/CADANGAN.md`: berkas inti disimpan saat dipasang (`index.html`, manifest, ikon), navigasi memakai jaringan dulu lalu cadangan dari cache, berkas lain dari cache sambil diperbarui, cache versi lama dihapus saat aktif, permintaan lintas asal (font, Supabase) tidak ditangani. Nama cache `V` dinaikkan ke `tani-keuangan-v0_1_034`.

### Diubah
- `js/app.js` (versi, memanggil `Panduan.init()` dan `Panduan.otomatis()`), `js/setelan.js` (baris Panduan cepat), `css/style.css`, `index.dev.html`, `index.html` dan `tani-keuangan.html` (hasil build), `docs/SETELAN.md`, `README.md`, `roadmap.md`, `VERSION`.

## v0.1.033 — 2026-11-04
Tab Laporan bergaya map dan tombol Cetak/Excel dengan ikon.

### Diubah
- Sub-tab Laporan (Ringkasan, Grafik, Rincian) kini berupa tab bergaya map: tiga tab selebar sama di atas panel berbingkai; tab aktif tebal, bergaris aksen di atas, dan menyatu dengan panel, sedangkan tab tidak aktif lebih redup. Isi tiap tab ada di dalam panel; kartu di dalamnya dipisah garis tipis, bukan kartu terpisah.
- Tombol Cetak dan Excel menjadi tombol ikon (printer dan unduh) dengan label, tinggi 40 px, ditaruh rata kanan di atas tab. Memakai `aria-label`.
- Judul ganda "Ringkasan" dan "Rincian" di dalam panel dihapus karena sudah ada di tab.
- Tab memakai `role="tablist"`, `role="tab"`, dan `aria-selected`; panel memakai `role="tabpanel"`.
- `js/analisa.js` (`vLaporan` dipecah dengan `vLaporanIsi`), `css/style.css`, `js/app.js` (versi), `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `README.md`, `roadmap.md`, `docs/LAPORAN.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP pada tema terang, gelap, dan efek kaca: tab berpindah, ekspor Excel terunduh, tombol Cetak memanggil `window.print`, tanpa galat. Tombol, tab, dan bingkai disembunyikan saat dicetak. Belum diuji di perangkat sungguhan.

## v0.1.032 — 2026-11-04
Fase 6B — geser untuk hapus transaksi.

### Ditambahkan
- `js/geser.js`: geser baris transaksi ke kiri (di Transaksi, Beranda, dan detail siklus) untuk memunculkan tombol merah "Hapus". Geser pendek (kurang dari separuh) menutup lagi; ketuk di luar atau ketuk baris yang terbuka juga menutup.
- Hapus lewat geser bersifat hapus lunak dan menampilkan "Transaksi dihapus · Urungkan" selama 5 detik; Urungkan mengembalikan transaksi (ikut tersinkron karena `diubah` diperbarui).
- Notifikasi (`toast`) kini bisa membawa tombol aksi.

### Diubah
- `js/app.js` (`toast`, versi), `css/style.css`, `index.dev.html`, `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `docs/TRANSAKSI.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Gerakan vertikal tetap menggulir halaman; hanya gerakan yang dominan horizontal yang menggeser baris. Setelah menggeser, ketukan dalam 0,35 detik diabaikan agar tidak membuka form ubah.
- Diuji di Chromium dengan kejadian sentuh buatan (bukan layar sentuh sungguhan): geser membuka tombol (1 baris), hapus 75 → 74, Urungkan kembali 75, geser pendek tidak membuka, ketuk tetap membuka form ubah, tanpa galat. **Belum diuji di HP sungguhan**; kepekaan geser perlu dicoba di perangkat.
- Tombol Hapus di form Ubah transaksi (ketuk dua kali) tetap ada.

## v0.1.031 — 2026-11-04
Fase 6B — Laporan dibagi menjadi sub-tab.

### Diubah
- Laporan kini punya tiga sub-tab: **Ringkasan** (untung/rugi, R/C, modal/hasil, perbandingan 3 bulan, simulasi), **Grafik** (tren garis, batang, komposisi modal, komoditas teratas), dan **Rincian** (kartu per siklus/komoditas/unit dengan HPP, BEP, harga minimum).
- Tombol Cetak / simpan PDF dan Ekspor Excel dipindah ke atas, selalu terlihat di semua sub-tab.
- Pilihan periode (Bulan ini/Tahun ini/Semua) dan pengelompokan (Siklus/Komoditas/Unit) tetap berlaku di Ringkasan dan Rincian, dan dipertahankan saat berpindah sub-tab.
- Tinggi halaman Laporan berkurang (Ringkasan ±1.900 px dan Grafik ±1.500 px pada data contoh, dari satu halaman panjang sebelumnya).
- `js/analisa.js`, `js/app.js` (versi), `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `docs/LAPORAN.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Cetak mencetak sub-tab yang sedang terbuka.
- Diuji di Chromium lebar HP: isi tiap sub-tab benar, pilihan pengelompokan bertahan, ekspor Excel tetap jalan, tanpa galat. Belum diuji di perangkat sungguhan.

## v0.1.030 — 2026-11-04
Fase 6C — template komoditas.

### Ditambahkan
- Unit & komoditas: tombol "Isi cepat dari template" (Sayur daun, Cabai, Tomat, Lele, Ayam petelur) yang mengisi nama, satuan hasil, dan umur panen; semuanya masih bisa diubah sebelum Tambah komoditas.
- Rencana → Anggaran: bila anggaran siklus sudah diisi dan komoditasnya cocok dengan template (dikenali dari nama, mis. "Cabai rawit"), muncul lipatan "Saran alokasi anggaran" berisi pembagian per kategori biaya dalam persen dan rupiah.

### Diubah
- `js/siklus.js` (`TEMPLATE_KOM`, `templateUntuk`, aksi `tpl-kom`), `js/rencana.js`, `js/app.js` (versi), `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `docs/SIKLUS.md`, `docs/RENCANA.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Template hanya memuat **proporsi** biaya (perkiraan kasar), bukan harga rupiah, karena harga berbeda tiap daerah dan skala. Angka persen itu tebakan umum, bukan data penelitian; sesuaikan dengan pengalaman sendiri.
- Umur panen ayam petelur dihitung sampai mulai bertelur (±120 hari); lele ±90 hari. Ubah bila praktik Anda berbeda.
- Diuji di Chromium lebar HP: template mengisi form, komoditas bertambah (4 → 5), lipatan saran alokasi muncul, tanpa galat. Belum diuji di perangkat sungguhan.

## v0.1.029 — 2026-11-04
Fase 6C — analisa sensitivitas di Laporan.

### Ditambahkan
- Kartu "Simulasi: bagaimana jika…" di Laporan: pilih perubahan harga jual (−20%, −10%, 0, +10%, +20%) dan perubahan biaya/modal (−10%, 0, +10%, +20%). Tampil untung sekarang vs simulasi, R/C simulasi, dan per kelompok (maksimal 6): untung sebelum → sesudah serta "harga boleh turun maksimal N% sebelum rugi" (= margin).
- Mengikuti periode dan pengelompokan (Siklus/Komoditas/Unit) yang dipilih di Laporan.

### Diubah
- `js/analisa.js` (`vSimulasi`, penanganan chip `data-sh`/`data-sb`), `js/app.js` (versi), `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `docs/LAPORAN.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Hitungan sederhana: hasil dan modal dikali persen perubahan; volume panen dianggap tetap dan biaya tetap/variabel tidak dipisah. Cukup untuk gambaran cepat, bukan ramalan.
- Diuji di Chromium lebar HP dengan data contoh: angka berubah sesuai pilihan (harga −20% lalu biaya +10% menurunkan untung simulasi), tanpa galat. Belum diuji di perangkat sungguhan.

## v0.1.028 — 2026-11-04
Fase 6B — pengingat perkiraan panen.

### Ditambahkan
- Perkiraan panen siklus berjalan = tanggal mulai + umur panen komoditas (±hari). Tampil di kartu siklus: "Perkiraan panen 12/12/2026 · 38 hari lagi", atau merah "Lewat perkiraan panen … terlambat N hari".
- Daftar siklus Berjalan diurutkan dari panen terdekat (yang terlambat paling atas); siklus tanpa umur panen di bagian akhir.
- Beranda → Perlu perhatian: siklus yang panennya 7 hari lagi atau sudah lewat, ditaruh paling atas.

### Diubah
- `js/siklus.js` (`panenPerkiraan`, urutan, baris di kartu), `js/beranda.js`, `js/app.js` (versi), `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `docs/SIKLUS.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP dengan data contoh: perkiraan tampil, urutan benar, pengingat di Beranda muncul paling atas, tanpa galat. Belum diuji di perangkat sungguhan.
- Komoditas tanpa "umur panen" tidak punya perkiraan; isi umur panen di Unit & komoditas.

## v0.1.027 — 2026-11-04
Fase 6B — duplikat transaksi dan perbandingan 3 bulan di Laporan.

### Ditambahkan
- Transaksi: tombol "Duplikat sebagai transaksi baru" di form Ubah transaksi. Isi form (jenis, jumlah, kategori, catatan, siklus) disalin sebagai transaksi baru bertanggal hari ini; ubah bila perlu lalu Simpan. Transaksi asal tidak berubah. Cocok untuk biaya rutin.
- Laporan: kartu "Bulan ini vs rata-rata 3 bulan" (untung, modal, hasil; nilai bulan ini, rata-rata, dan selisih persen). Rata-rata hanya dari bulan sebelumnya yang ada transaksinya; bila tidak ada, tampil keterangan. Hijau berarti membaik (modal turun dianggap baik).

### Diubah
- `js/app.js` (aksi `dup-tx`, versi), `js/analisa.js` (`vBanding`), `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `docs/LAPORAN.md`, `docs/TRANSAKSI.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP: kartu perbandingan tampil, duplikat menyalin isi dan menambah satu transaksi (75 → 76) tanpa galat. Rangkaian uji lama (UX, hero, sinkron) tidak ada di paket ini sehingga tidak dijalankan ulang. Belum diuji di perangkat sungguhan.
- Belum dikerjakan: geser untuk hapus transaksi dan sub-tab Laporan.

## v0.1.026 — 2026-11-04
Judul halaman aktif di semua halaman selain Beranda.

### Ditambahkan
- Judul halaman (`h1`) di bawah menu: Transaksi, Siklus, Laporan, Lainnya, Setelan, serta halaman turunan: Siklus baru, nama siklus (detail), Catat panen/Ubah panen, Unit & komoditas, Rencana keuangan, Catat modal/Catat hasil/Ubah transaksi (judul mengikuti pilihan jenis).
- Tombol induk kecil di atas judul untuk halaman turunan ("‹ Siklus", "‹ Lainnya", "‹ Detail siklus") yang membawa kembali ke halaman sebelumnya.
- Judul tab browser ikut berubah (mis. "Transaksi · Tani Keuangan"); di Beranda tetap "Tani Keuangan".

### Diubah
- Judul `h2` yang sama dengan judul halaman dihapus dari dalam kartu agar tidak ganda (Transaksi, Siklus, Siklus baru, Rencana keuangan, Catat/Ubah panen, Catat/Ubah transaksi). Kartu pertama di detail siklus kini berjudul "Ringkasan".
- `index.dev.html`, `js/app.js` (fungsi `judulHal`), `js/siklus.js`, `js/rencana.js`, `css/style.css`, `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP: 18 skenario judul; uji UX (20), hero (10), dan sinkron (26) tetap lolos. Belum diuji di perangkat sungguhan.
- Judul disembunyikan saat dicetak (tombol induk) dan tidak ditampilkan di Beranda karena Beranda sudah memiliki kartu hero.

## v0.1.025 — 2026-11-04
Kartu hero di Beranda.

### Ditambahkan
- Ringkasan bulan ini kini berupa kartu hero: angka untung/rugi besar, jumlah transaksi dan margin, selisih dibanding bulan lalu (▲/▼ berwarna), garis tren untung bersih 6 bulan, lalu Modal, Hasil, dan R/C ratio di bagian bawah kartu.
- Kartu bergaya mengikuti tema: rona hijau dan garis aksen kiri; bekerja di mode terang, gelap, dan efek kaca. Angka rugi berwarna merah.
- Selisih vs bulan lalu ikut disamarkan oleh tombol mata dan setelan "Tersembunyi"; tidak tampil bila bulan lalu belum ada transaksi. Garis tren tersembunyi bila belum ada data.

### Diubah
- `index.dev.html` (hero dan stat dibungkus `section#heroCard`), `js/app.js` (ringkasan menghitung selisih dan garis tren; kartu hanya tampil di Beranda, versi), `css/style.css`, `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP: tampil hanya di Beranda, garis tren, selisih, penyamaran angka, kondisi rugi dan kosong, tiga tema (10 skenario); uji UX (20) dan sinkron (26) tetap lolos. Belum diuji di perangkat sungguhan.
- Garis tren memakai data enam bulan yang sama dengan grafik "Untung bersih per bulan" di bagian Grafik.

## v0.1.024 — 2026-11-04
Fase 6B — penyempurnaan UX di HP, berdasarkan audit tiap halaman.

### Diubah
- **FAB:** tersembunyi saat gulir turun dan muncul lagi saat gulir naik, sehingga tidak menutupi nominal; ruang bawah halaman di HP diperbesar.
- **Target ketuk:** tombol tema/setelan 40 px, ikon mata dan tombol pilihan minimal 40 px (sebelumnya 19–34 px).
- **Transaksi:** kolom pencarian (catatan, kategori, siklus) yang memfilter langsung tanpa kehilangan fokus; filter Kategori dan Siklus dipindah ke tombol "Filter lain" (otomatis terbuka bila ada filter aktif).
- **Beranda:** banner data contoh jadi satu baris; "Perlu perhatian" menampilkan 3 teratas dengan Lihat semua; bagian Grafik bisa dilipat (terlipat di layar HP, terbuka di layar lebar). Tinggi halaman turun dari ±3.700 px ke ±2.100 px.
- **Siklus:** tiap kartu menampilkan bilah anggaran (kuning mulai 90%, merah lewat 100%) dan untung/rugi sementara untuk siklus berjalan yang sudah ada hasil.
- **Setelan:** enam bagian bisa dilipat (Tampilan dan Preferensi terbuka; Data, Cadangan, Sinkron cloud, Tentang terlipat); status buka dipertahankan selama sesi.
- **Header:** indikator sinkron ("☁ tersinkron 14:02" / menyinkronkan / gagal) bila sudah masuk akun cloud.
- `js/fab.js`, `js/app.js`, `js/beranda.js`, `js/contoh.js`, `js/siklus.js`, `js/setelan.js`, `js/sinkron.js`, `css/style.css`, `index.dev.html`, `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium lebar HP: 20 skenario UX (lipatan, pencarian, filter, FAB, bilah anggaran, Setelan) dan 26 skenario sinkron tetap lolos. Belum diuji di perangkat sungguhan.
- Atribut lipatan memakai `data-lipat` (bukan `data-lp`, yang sudah dipakai chip periode Laporan).
- Belum dikerjakan (dicatat di roadmap Fase 6B/6C): sub-tab Laporan, perbandingan 3 bulan, duplikat/geser hapus transaksi, pengingat panen, analisa sensitivitas, template komoditas, foto nota.

## v0.1.023 — 2026-11-04
Fase 6 (bagian 2) — sinkron cloud Supabase, opsional.

### Ditambahkan
- `js/sinkron.js`: login email dan kata sandi (daftar, masuk, keluar, refresh token otomatis) ke proyek Supabase milik pengguna; sinkron satu baris per pengguna di tabel `tani_data`.
- Gabung per entri berdasarkan `id` dan `diubah` (yang terbaru menang; hapus lunak ikut tersebar). Data contoh tidak dikirim; perangkat yang hanya berisi contoh menerima data cloud tanpa contoh.
- Setelan → Sinkron cloud: formulir login, Sinkronkan sekarang, sinkron otomatis (aktif/mati; ±20 detik setelah perubahan, saat dibuka, saat online), Timpa cloud, Ambil dari cloud, Hapus data cloud (ketuk dua kali), Keluar.
- Salinan `Sebelum sinkron` di cadangan sebelum data cloud diterapkan.
- `docs/SINKRON.md` (SQL tabel + kebijakan RLS, cara kerja, batasan).

### Diubah
- `js/app.js` (versi, `simpan()` memanggil `Sinkron.tandai()`, hook `Sinkron.init`), `js/setelan.js` (bagian Sinkron cloud, teks Hapus semua data), `css/style.css`, `index.dev.html`, `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `README.md`, `roadmap.md`, `docs/DATA-SCHEMA.md`, `VERSION`.

### Catatan
- Diuji di Chromium dengan server Supabase tiruan dan dua perangkat (26 skenario: login, salah sandi, gabung konflik, hapus lunak, otomatis, refresh token, ambil/timpa/hapus cloud). **Belum diuji pada proyek Supabase sungguhan**, jadi item roadmap belum dicentang.
- Konflik pada entri yang sama: yang `diubah`-nya terbaru menang, bergantung pada jam perangkat.
- Multi-pengguna (pemilik dan pencatat) belum dikerjakan.

## v0.1.022 — 2026-11-03
Data contoh realistis terisi otomatis saat aplikasi pertama kali dibuka.

### Ditambahkan
- `js/contoh.js`: data tiruan untuk ±7 bulan, tanggalnya dihitung dari hari ini sehingga grafik selalu tampak "hidup".
  - 3 unit (kebun 120 m², greenhouse hidroponik 200 lubang, kolam terpal 24 m²), 4 komoditas (cabai rawit, selada hidroponik, lele, kangkung).
  - 6 siklus: 4 selesai atau panen berjalan dengan hasil beragam (untung besar, untung tipis), selada siklus kedua yang belum panen, dan lele siklus kedua dengan modal 97% dari anggaran.
  - 75 transaksi (modal per kategori, penjualan panen, penjualan bibit, bantuan kelompok tani), 12 catatan panen dengan susut dan harga, 4 aset, 3 utang/piutang (satu jatuh tempo dekat, satu lewat tempo, satu lunas). Angka panen dan transaksi penjualan selalu konsisten.
- Semua entri bertanda `contoh: true`. Banner "Data contoh" di Beranda dengan tombol Hapus data contoh (ketuk dua kali) hanya menghapus entri bertanda itu; catatan milik pengguna tetap ada, dan transaksi pengguna yang terkait siklus contoh dilepas dari siklusnya.
- Setelan → Data: baris "Data contoh" untuk mengisi atau menghapus data contoh kapan saja.
- `docs/CONTOH.md`.

### Diubah
- Pengisian otomatis hanya terjadi bila belum ada data dan belum pernah mengisi atau menghapus data contoh. Pengguna lama dan yang sudah menghapus data tidak akan melihat data contoh muncul lagi.
- `js/app.js` (isi otomatis saat mulai, banner, aksi hapus-contoh, versi), `js/setelan.js`, `js/cadangan.js` (data yang hanya berisi contoh tidak dicadangkan), `css/style.css`, `index.dev.html`, `index.html`, `tani-keuangan.html` (hasil build), `sw.js`, `README.md`, `roadmap.md`, `VERSION`.
- Tombol "Isi data contoh" di Beranda kosong kini memakai data yang sama.

### Catatan
- Bila aplikasi dibuka lewat pengelola berkas HP (`content://`, penyimpanan terbatas), data contoh terisi lagi setiap membuka ulang karena tidak ada yang tersimpan.
- Nama pihak, harga, dan jumlah hanya ilustrasi, bukan data pasar sebenarnya.
- Diuji di Chromium: pengisian pertama, muat ulang, hapus contoh (dengan transaksi milik sendiri), isi ulang dari Setelan.

## v0.1.021 — 2026-11-03
Chart informatif di Beranda, mengikuti grafik di Laporan.

### Ditambahkan
- `js/beranda.js`, bagian "Grafik di Beranda" (hanya tampil bila sudah ada transaksi):
  - **Tren hasil / modal**: grafik garis halus yang sama dengan Laporan (6 atau 12 bulan, sentuh untuk tooltip, tabel angka). Pilihan rentang tetap di Beranda dan dipakai bersama Laporan.
  - **Untung bersih per bulan**: batang hijau (untung) dan merah (rugi) 6 bulan terakhir, dengan label angka ringkas (rb/jt).
  - **Komposisi modal bulan ini**: diagram donat dengan legenda persen (lima kategori terbesar + Lainnya); menggantikan batang komposisi lama. Total modal ikut disamarkan oleh tombol mata.
  - **Untung per komoditas**: lima komoditas teratas, semua waktu, dengan R/C ratio; batang merah bila rugi.
  - **Modal vs anggaran (siklus berjalan)**: bilah persen realisasi; kuning mulai 90%, merah bila melebihi 100%. Hanya tampil bila ada siklus berjalan dengan anggaran.

### Diubah
- `js/app.js` (Beranda memanggil `Beranda.grafik()`, versi), `js/analisa.js` (tombol 6/12 bulan di Beranda tidak lagi pindah ke Laporan), `sw.js`, `index.dev.html` tidak berubah, `index.html`, `tani-keuangan.html` (hasil build), `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Sumbu dan tooltip grafik tren menampilkan angka apa adanya (sama seperti Laporan); hanya total, legenda, dan nilai komoditas yang mengikuti setelan Tersembunyi.
- Diuji di Chromium (lebar HP) dengan data multi-bulan; belum diuji di perangkat sungguhan.

## v0.1.020 — 2026-11-03
FAB mengikuti halaman aktif; tombol aksi cepat di Beranda dihapus.

### Dihapus
- Tombol "+ Catat modal" dan "+ Catat hasil" di Beranda (sudah tersedia lewat FAB). Beranda yang masih kosong kini hanya menampilkan teks petunjuk dan tombol data contoh.

### Diubah
- `js/fab.js` (baru): FAB menyesuaikan halaman aktif.
  - Beranda, Transaksi, Lainnya, Rencana → Arus kas: ketuk FAB, muncul pilihan "Catat modal" dan "Catat hasil" (form langsung terisi jenisnya).
  - Siklus: "Siklus baru" (satu ketukan).
  - Detail siklus berjalan: pilihan "Catat modal", "Catat hasil" (terhubung ke siklus itu), dan "Catat panen". Siklus selesai: FAB disembunyikan.
  - Rencana → Aset: "Tambah aset" (menggulir dan memfokuskan isian nama). Rencana → Utang/piutang: "Catat utang atau piutang" (memfokuskan isian nama pihak).
  - Disembunyikan di Laporan, Rencana → Anggaran, Setelan, dan semua layar formulir (catat, panen, siklus baru, unit/komoditas).
- Pilihan melayang: latar redup, ikon + berputar jadi ×, tutup dengan ketuk di luar atau tombol Esc. Label FAB (aria-label dan title) ikut berubah per halaman.
- `js/beranda.js` (aksi cepat dan penangan kliknya dihapus), `js/app.js` (memanggil `Fab.init()` dan `Fab.atur()` di tiap pergantian layar), `css/style.css`, `index.dev.html`, `index.html`, `tani-keuangan.html` (hasil build), `sw.js` (versi cache), `docs/FAB.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Diuji di Chromium (Playwright, lebar HP) untuk semua halaman di atas; belum diuji di perangkat sungguhan.
- Ingin FAB tampil juga di Laporan atau Anggaran? Ubah fungsi `cfg()` di `js/fab.js`.

## v0.1.019 — 2026-11-03
Fase 6 (bagian 1) — cadangan otomatis dan dasar PWA.

### Ditambahkan
- `js/cadangan.js`: cadangan otomatis di browser. Maksimal 7 salinan: satu "Otomatis" per hari (diperbarui paling cepat tiap 5 menit) dan salinan "Sebelum impor", "Sebelum hapus", "Sebelum pemulihan", "Manual". Data kosong tidak dicadangkan.
- Setelan → "Cadangan otomatis": daftar salinan (tanggal, jam, jumlah transaksi dan siklus), tombol Pulihkan (ketuk dua kali), Cadangkan sekarang, Hapus semua cadangan.
- `js/pwa.js`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`: manifest, service worker (berkas aplikasi disimpan untuk luring), ikon, dan baris "Pasang di layar utama" di Setelan → Tentang.
- `docs/CADANGAN.md`.

### Diubah
- `js/app.js`: simpan memanggil cadangan otomatis; impor dan hapus semua data membuat salinan lebih dulu; versi.
- `js/setelan.js`: bagian Cadangan otomatis dan baris pasang; teks "Hapus semua data" menyebut cadangan tidak ikut terhapus.
- `index.dev.html` (tautan manifest, ikon, dua skrip baru), `index.html`, `tani-keuangan.html` (hasil build), `docs/DATA-SCHEMA.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Cadangan tersimpan di browser yang sama dengan data: ikut hilang bila data browser dibersihkan. Ekspor JSON berkala tetap perlu.
- PWA dan service worker hanya aktif bila aplikasi dibuka dari alamat http/https (hosting). Dari `file://` atau `content://` (pengelola berkas HP) tidak aktif; aplikasi tetap jalan seperti biasa. Untuk memasang sebagai aplikasi, unggah seluruh isi folder (bukan hanya satu berkas) ke hosting HTTPS.
- Sinkron Supabase, login, dan multi-pengguna belum dikerjakan (sisa Fase 6).
- Diuji di Chromium (Playwright): cadangan, pemulihan, hapus, pendaftaran service worker. Belum diuji di HP dan belum diuji luring penuh.

## v0.1.018 — 2026-11-03
Beranda lebih berguna dan sedikit optimalisasi.

### Ditambahkan
- `js/beranda.js`: tombol aksi cepat "+ Catat modal" dan "+ Catat hasil"; kartu "Perlu perhatian" (utang/piutang jatuh tempo dalam 7 hari atau lewat, siklus berjalan yang modalnya sudah 90% atau lebih dari anggaran); kartu "Dibanding bulan lalu" (untung, modal, hasil dengan panah naik/turun; hijau = membaik, merah = memburuk); kartu "Posisi kas" (saldo kas semua waktu, utang dan piutang belum lunas).
- Angka di kartu baru ikut disembunyikan oleh setelan Tersembunyi dan tombol mata.
- Beranda yang masih kosong hanya menampilkan aksi cepat dan tombol data contoh.

### Diubah (optimalisasi)
- `js/app.js`: daftar transaksi aktif disimpan sementara (cache) dan dibersihkan saat data disimpan atau layar berganti, sehingga hitungan di Beranda dan Laporan tidak menyaring ulang berkali-kali; pengurutan memakai salinan agar cache tidak berubah.
- `index.dev.html`: font Google dimuat tanpa memblokir tampilan (halaman muncul dulu, font menyusul; tetap jalan saat luring).
- `index.html`, `tani-keuangan.html` (hasil build), `VERSION`, `README.md`, `roadmap.md`.

### Catatan
- Kartu Beranda tampil bila sudah ada transaksi; pembanding bulan lalu menampilkan keterangan bila bulan lalu kosong.

## v0.1.017 — 2026-11-03
Hero ringkasan hanya di Beranda.

### Diubah
- `js/app.js`: blok hero (Untung bulan ini) dan statistik (Modal, Hasil, R/C ratio) disembunyikan di semua layar selain Beranda; muncul lagi saat kembali ke Beranda.
- `css/style.css` (aturan `[hidden]`), `VERSION`, `README.md`, `roadmap.md`.

## v0.1.016 — 2026-11-03
Perbaikan: halaman tampil polos (tanpa gaya, versi kosong) bila `index.html` dibuka dari pengelola berkas HP.

### Penyebab
- `index.html` lama memuat `css/` dan `js/` lewat jalur relatif, yang tidak bisa diselesaikan dari `content://`.

### Diubah
- `index.html` kini otomatis berisi versi satu berkas (CSS dan JS tertanam), sama dengan `tani-keuangan.html`; berkas mana pun yang dibuka akan jalan.
- Templat pengembangan dipindah ke `index.dev.html` (memuat `css/` dan `js/`; menampilkan peringatan bila berkas pendamping tidak termuat).
- `bangun-mandiri.py` membaca `index.dev.html` dan menulis `index.html` serta `tani-keuangan.html`.
- `README.md`, `roadmap.md`, `VERSION`, `js/app.js` (versi).

### Catatan
- Setelah mengubah `css/` atau `js/`, jalankan `python3 bangun-mandiri.py`.
- Untuk membuka di HP, cukup satu berkas: `index.html`. Jangan memakai `index.dev.html`.

## v0.1.015 — 2026-11-03
Fase 5 — Anggaran, arus kas, aset, utang/piutang (menu Lainnya → Rencana keuangan).

### Ditambahkan
- `js/rencana.js` dengan empat tab: Anggaran (anggaran modal per siklus vs realisasi, bilah persen, tanda melebihi), Arus kas (6 bulan terakhir, saldo kumulatif, proyeksi 3 bulan dari rata-rata 3 bulan terakhir), Aset (harga beli, umur ekonomis, penyusutan garis lurus per bulan, nilai buku, total investasi, perkiraan balik modal), Utang/piutang (catat, jatuh tempo, tanda lewat, tandai lunas, total belum lunas).
- Data baru: `siklus.anggaran`, daftar `aset`, daftar `utang`.
- `docs/RENCANA.md`.

### Diubah
- `js/app.js` (layar Rencana, tombol di Lainnya, `utang` di data kosong, versi), `index.html`, `docs/DATA-SCHEMA.md`, `README.md`, `roadmap.md`, `VERSION`.

### Catatan
- Proyeksi dan balik modal hanya perkiraan sederhana; balik modal butuh untung rata-rata positif.
- Pembayaran utang/piutang belum otomatis membuat transaksi; hapus bersifat menandai terhapus.
- Aset belum bisa diubah; hapus lalu catat ulang.

## v0.1.014 — 2026-11-03
Perbaikan warna grafik batang.

### Diubah
- `js/analisa.js`: batang Modal dan legenda kini merah (`--loss`), sama dengan grafik garis; sebelumnya hijau tua yang nyaris sama dengan batang Hasil di skema Hijau Padi.
- `js/app.js` (versi), `VERSION`, `README.md`, `roadmap.md`.

## v0.1.013 — 2026-11-03
Grafik tren garis halus di Dashboard (mengikuti contoh grafik Jurnal Trading).

### Ditambahkan
- Kartu "Tren hasil / modal": garis halus Hasil (hijau, dengan area) dan Modal (merah), garis bantu, sumbu y ringkas (rb/jt), label bulan, legenda.
- Sentuh/geser grafik: garis penunjuk putus-putus, titik, dan tooltip berisi hasil dan modal bulan itu.
- Pilihan rentang 6 atau 12 bulan; ringkasan untung bersih, total hasil, total modal untuk rentang itu.
- "Tabel angka grafik" (lipat) berisi hasil, modal, untung per bulan.

### Diubah
- Grafik batang lama diberi judul "Tren 6 bulan (batang)" dan dipertahankan di bawah grafik baru.
- `js/analisa.js`, `css/style.css`, `js/app.js` (versi), `VERSION`, `README.md`, `roadmap.md`, `docs/LAPORAN.md`.

### Catatan
- Grafik per bulan; tampilan harian/mingguan belum ada.

## v0.1.012 — 2026-11-03
Fase 4 — Dashboard dan laporan siap arsip (tab Laporan).

### Ditambahkan
- Dashboard di atas Laporan: grafik batang tren modal dan hasil 6 bulan terakhir (SVG, tanpa pustaka luar), komposisi modal (6 teratas), dan 3 komoditas teratas; komposisi dan komoditas mengikuti periode yang dipilih.
- Tombol "Cetak / simpan PDF" (jendela cetak browser; pilih Simpan sebagai PDF) dengan gaya cetak yang menyembunyikan navigasi dan tombol.
- Tombol "Ekspor Excel": berkas `.xls` dari tabel laporan yang sedang tampil (periode dan pengelompokan terpilih).

### Diubah
- `js/analisa.js`, `css/style.css` (gaya cetak), `js/app.js` (versi), `VERSION`, `README.md`, `roadmap.md`, `docs/LAPORAN.md`.

### Catatan
- Ekspor Excel berupa tabel HTML berekstensi `.xls` (Excel akan menampilkan peringatan format, pilih Ya/Buka). Berkas `.xlsx` asli belum dibuat.
- Unduhan dari halaman yang dibuka lewat `content://` bisa diblokir browser; bila gagal, buka lewat `file://` di Chrome.
- Laporan "bulanan/musiman" memakai pilihan periode Bulan ini, Tahun ini, Semua; pemilih bulan/musim bebas belum ada.

## v0.1.011 — 2026-11-03
Fase 3 — Analisa keuangan inti (tab Laporan).

### Ditambahkan
- `js/analisa.js`: laporan laba-rugi per siklus, komoditas, atau unit; periode Bulan ini, Tahun ini, Semua; diurut dari untung terbesar (★ untuk yang terbaik).
- Per kelompok: modal, hasil, untung/rugi, R/C ratio, margin, panen bersih, HPP per satuan, harga jual rata-rata, harga jual minimum (memakai Target margin di Setelan), dan titik impas (BEP) dalam satuan dan rupiah.
- `docs/LAPORAN.md`: rumus dan cara baca.

### Diubah
- `js/app.js` (tab Laporan, nomor versi), `index.html` (memuat `js/analisa.js`), `css/style.css`, `bangun-mandiri.py` tetap dipakai untuk versi satu berkas, `VERSION`, `README.md`, `roadmap.md`.

### Catatan
- BEP butuh biaya tetap dan panen berharga; bila tidak ada, tampil keterangan.
- Baris tanpa siklus dikelompokkan sebagai "Tanpa siklus".
- Belum ada grafik; dashboard dan laporan cetak ada di Fase 4.

## v0.1.010 — 2026-11-03
Perbaikan agar tampil dan jalan saat dibuka langsung di HP (lewat pengelola berkas / `content://`).

### Masalah
- Dibuka dari pengelola berkas, `index.html` tampil polos: `css/style.css` dan `js/*.js` tidak termuat karena jalur relatif tidak bisa diselesaikan dari `content://`, sehingga nomor versi kosong dan tombol tidak berfungsi.

### Ditambahkan
- `tani-keuangan.html`: versi satu berkas (CSS dan semua JS di dalam HTML) — cukup buka satu berkas ini, tanpa folder.
- `bangun-mandiri.py`: skrip untuk membuat ulang `tani-keuangan.html` dari `index.html`, `css/`, dan `js/`.
- `js/setelan.js`: modul `Penyimpanan` — memakai localStorage; bila diblokir (mis. `content://`), jatuh ke memori dan `window.name` sehingga data tetap bertahan selama tab tidak ditutup.
- Peringatan di atas halaman saat penyimpanan browser tidak tersedia (anjuran ekspor CSV/JSON berkala).

### Diubah
- `js/app.js` dan `js/setelan.js`: semua akses data lewat `Penyimpanan`; nomor versi.
- `index.html` (elemen `#peringatan`), `css/style.css` (gaya `.peringatan`), `VERSION`, `README.md`, `docs/DATA-SCHEMA.md`, `roadmap.md`.

### Catatan
- Untuk simpan permanen, buka lewat Chrome dengan alamat `file:///storage/emulated/0/...` (bukan dari pengelola berkas), atau ekspor data secara berkala.
- Fase 3 (Analisa Keuangan Inti) tetap menjadi langkah berikutnya.

## v0.1.009 — 2026-11-03
Form input kustom, tanpa tampilan bawaan browser.

### Ditambahkan
- `js/form.js`: dropdown kustom (popover di layar lebar, panel dari bawah di HP; pilihan aktif bertanda ✓; grup kategori tetap tampil; keyboard ↑ ↓ Enter Esc) dan pemilih tanggal kustom (kalender Senin–Minggu, navigasi bulan dan tahun, Hari ini, Hapus untuk filter tanggal).
- Berlaku untuk semua form: Catat transaksi, filter Transaksi, siklus baru, catat panen, unit dan kategori.
- `css/style.css`: gaya `.cx-*`, spinner input angka disembunyikan, warna placeholder; ikut skema Hijau Padi dan Emas Klasik, mode terang dan gelap, serta efek kaca.

### Diubah
- `js/app.js`: memanggil `Form.upgrade` setiap layar dirender; nomor versi.
- `index.html`: memuat `js/form.js`.
- `docs/STYLE.md`, `README.md`, `VERSION`, `roadmap.md`.

### Catatan
- Elemen asli tetap ada dan tersembunyi, sehingga nilai form dan event `change` tidak berubah.
- Tanggal tetap disimpan `YYYY-MM-DD`; tampilannya mengikuti setelan Format tanggal.

## v0.1.008 — 2026-11-03
Fase 2 — Unit, komoditas, siklus, panen.

### Ditambahkan
- `js/siklus.js`: master unit/lahan dan komoditas; siklus tanam (mulai, selesaikan, buka kembali, hapus bila kosong); catatan panen (kotor, susut, harga, pembeli).
- Transaksi terhubung ke siklus: pilihan Siklus di form Catat, tombol Catat transaksi dari detail siklus, filter Siklus di tab Transaksi, nama komoditas pada baris transaksi.
- Panen berharga otomatis membuat transaksi Hasil yang tertaut (`panen.transaksiId`) dan ikut berubah saat panen diubah atau dihapus.
- Tab Siklus (daftar, detail) dan bagian "Siklus berjalan" di Beranda.
- Data contoh kini menyertakan unit, komoditas, siklus, dan panen.
- `docs/SIKLUS.md`.

### Diubah
- `js/app.js`: layar baru (siklus, detail, panen, master), pilihan siklus pada transaksi; menu aktif mengikuti layar induk.
- `css/style.css`: kartu siklus. `index.html`: memuat `js/siklus.js`.
- `docs/DATA-SCHEMA.md` (field `transaksiId` pada panen), `docs/STYLE.md`, `README.md`, `VERSION`, `roadmap.md`.

### Catatan
- Siklus belum bisa diubah (unit/komoditas/tanggal); bila keliru, hapus siklus yang masih kosong lalu buat ulang.
- Analisa laba-rugi, HPP, dan R/C per siklus hadir di Fase 3; detail siklus baru menampilkan modal, hasil, untung.

## v0.1.007 — 2026-11-03
Fase 1 — MVP pencatatan, digabung dengan efek kaca (0.1.006) dan ditambah ikon navigasi.

### Ditambahkan
- Catat transaksi lewat FAB: pilih Modal atau Hasil, jumlah (diformat ribuan otomatis), kategori, tanggal (bawaan hari ini), catatan. Tombol Simpan, Simpan & catat lagi (jenis, kategori, tanggal dipertahankan), dan Batal.
- Ubah dan hapus transaksi: ketuk baris transaksi; hapus dua langkah, data hanya ditandai `terhapus` (sesuai SPEC).
- Tab Transaksi: filter periode (bulan ini, bulan lalu, semua, pilih tanggal), jenis, dan kategori; ringkasan modal, hasil, untung/rugi untuk hasil filter.
- Beranda: komposisi modal bulan ini (batang persentase) dan 5 transaksi terakhir; tombol "Isi data contoh" saat data masih kosong.
- Ringkasan hero dan statistik terisi otomatis (untung/rugi bulan ini, modal, hasil, R/C ratio, margin); angka tetap mengikuti setelan Tersembunyi dan tombol mata.
- Lainnya: tambah/hapus kategori sendiri; ekspor dan impor CSV (tanggal, jenis, kategori, siklus, jumlah, catatan; impor melewati baris tidak valid dan membuat kategori baru bila belum ada).
- Ikon SVG pada bottom-nav dan tab atas (Beranda, Transaksi, Siklus, Laporan, Lainnya).
- `docs/TRANSAKSI.md`: alur, filter, kategori, format CSV.

### Diubah
- Navigasi menjadi Beranda, Transaksi, Siklus, Laporan, Lainnya.
- `js/app.js` ditulis ulang (data, tampilan, aksi); `index.html` diberi id pada elemen ringkasan; `css/style.css` menambah gaya baris transaksi, batang komposisi, ringkasan filter, dan ikon (blok efek kaca 0.1.006 dipertahankan).
- Kategori bawaan kini juga tertanam di `js/app.js` agar jalan saat `index.html` dibuka langsung dari berkas.
- `js/setelan.js` dan `docs/SETELAN.md` memakai versi 0.1.006 (dengan setelan Efek kaca) tanpa perubahan.
- `docs/WIREFRAME.md`, `docs/STYLE.md`, `README.md`, `VERSION`, `roadmap.md`.

### Catatan
- Dua paket 0.1.006 yang terpisah (efek kaca dan Fase 1) digabung di sini; nomor 0.1.006 di CHANGELOG tetap milik efek kaca.
- Transaksi belum terhubung ke siklus (`siklusId` kosong) sampai Fase 2.
- Jenis biaya tetap/variabel disimpan per transaksi dari kategori, dipakai untuk BEP di Fase 3.

## v0.1.006 — 2026-11-03
Sakelar efek kaca.

### Ditambahkan
- Setelan → Tampilan → **Efek kaca** (Mati/Nyala), tersimpan di `tani.setelan` (field `kaca`), bawaan Mati.
- `css/style.css`: blok `html[data-glass="1"]` — latar gradasi dari warna palet, kartu kaca buram, bottom-nav kaca, kontrol berbentuk pil, fallback padat bila blur tidak didukung. Berlaku untuk skema Hijau Padi dan Emas Klasik, mode terang maupun gelap.

### Diubah
- `js/setelan.js`: setelan `kaca`, atribut `data-glass` pada `html`, teks "Kembali ke bawaan" ikut mencakup efek kaca.
- `docs/SETELAN.md`, `docs/STYLE.md`, `README.md`, `VERSION`, `roadmap.md`, `js/app.js` (nomor versi).

## v0.1.005 — 2026-11-03
Halaman Setelan seperti Jurnal Trading.

### Ditambahkan
- `js/setelan.js`: halaman Setelan dibuka lewat ikon ⚙ di masthead. Tampilan (mode terang/gelap/otomatis, skema Hijau Padi atau Emas Klasik, ukuran 90–120%), Preferensi (format tanggal, angka untung tersembunyi saat dibuka, target margin), Data (ekspor, impor dari kotak atau berkas, hapus semua data dengan konfirmasi dua langkah), Tentang (versi).
- `docs/SETELAN.md`: daftar setelan, nilai bawaan, dan cara integrasi.
- Tombol mata ◉ di hero untuk menampilkan atau menyembunyikan angka.
- Skema Emas Klasik dan gaya baris setelan di `css/style.css`.

### Diubah
- `js/app.js`: navigasi antar-layar (Beranda, Siklus, Laporan, Lainnya, Catat, Setelan) dengan placeholder per fase; tombol tema memakai setelan Mode.
- `index.html`: ikon ⚙, tombol mata, `main` dirender oleh aplikasi.
- Setelan tersimpan di `tani.setelan` (menggantikan `tani.tema`).
- `docs/STYLE.md`, `README.md`, `VERSION`, `roadmap.md`.

### Catatan
- Setelan target margin dipakai pada harga jual minimum siklus mulai Fase 3; angka tersembunyi berlaku penuh saat ringkasan terisi di Fase 1.

## v0.1.004 — 2026-11-03
Palet warna Hijau Padi.

### Diubah
- `css/style.css`: token warna diganti palet #FFF4C9, #C7E78B, #81AE64, #709053. Tema terang menjadi bawaan; tema gelap diturunkan dari palet yang sama. Tombol, FAB, dan toast memakai --fill (#81AE64) dengan teks gelap; aksen teks memakai #4E6F35 (turunan #709053) agar kontras terbaca.
- `index.html`, `js/app.js`: tema bawaan terang, warna `theme-color` menyesuaikan, nomor versi.
- `docs/STYLE.md`: tabel token untuk tema terang dan gelap, catatan kontras.
- `README.md`, `VERSION`, `roadmap.md`: versi dan catatan.

## v0.1.003 — 2026-11-03
Input transaksi dipindah ke FAB.

### Ditambahkan
- Tombol FAB (+) emas di kanan bawah untuk input transaksi (`index.html`, `css/style.css`, `js/app.js`); di pratinjau FAB membuka layar Catat dan disembunyikan saat di layar itu.
- Tombol "Batal" pada form Catat (pratinjau).

### Diubah
- Menu "Catat" dihapus dari bottom-nav dan tab atas; menu kini Beranda, Siklus, Laporan, Lainnya.
- `docs/STYLE.md`, `README.md`, `VERSION`, `roadmap.md`: versi dan catatan komponen FAB.

## v0.1.002 — 2026-11-03
Gaya antarmuka disamakan dengan Jurnal Trading.

### Diubah
- `css/style.css`: ditulis ulang dengan token ink/paper/gold, kartu radius 14px, tab atas + bottom-nav berikon, mode gelap (bawaan) dan terang.
- `index.html`: masthead bermerek (Fraunces), hero angka emas, baris statistik, tab navigasi, tautan Google Fonts (Fraunces + IBM Plex Mono), `viewport-fit=cover`.
- `js/app.js`: tombol tema gelap/terang (tersimpan di `tani.tema`), render tab navigasi.
- `README.md`, `VERSION`, `roadmap.md`: nomor versi dan catatan.

### Ditambahkan
- `docs/STYLE.md`: panduan gaya (warna, tipografi, komponen).

## v0.1.001 — 2026-11-03
Fase 0 — Persiapan.

### Ditambahkan
- `docs/SPEC.md`: lingkup MVP, daftar fitur per fase, rumus analisa (laba-rugi, HPP, R/C, margin, BEP, payback).
- `docs/WIREFRAME.md`: wireframe teks untuk Beranda, Input Transaksi, Daftar Siklus, Detail Siklus, Laporan.
- `docs/DATA-SCHEMA.md`: skema entitas (unit, komoditas, siklus, transaksi, panen, aset, kategori) dan kunci penyimpanan.
- `data/seed-kategori.json`: kategori pengeluaran & pemasukan bawaan.
- Kerangka proyek: `index.html`, `css/style.css`, `js/app.js` (placeholder, penyimpanan localStorage dasar).
- `roadmap.md`: Fase 0 ditandai selesai.
- `README.md`, `VERSION`.

### Catatan
- Rilis pertama: update zip berisi semua file karena belum ada versi sebelumnya.
