# Roadmap — Web App Keuangan Pertanian Rumahan

> Status dokumen: draf v0.1 · Terakhir diperbarui: 17 November 2026 · Fase 5 selesai; Fase 6 berjalan: cadangan otomatis + dasar PWA; FAB kontekstual; chart di Beranda; data contoh otomatis; sinkron Supabase (v0.1.023); penyempurnaan UX (v0.1.024); kartu hero Beranda (v0.1.025); judul halaman (v0.1.026); foto nota lokal (v0.1.037); optimasi performa/aksesibilitas bagian 1 (v0.1.038); pembayaran utang/piutang tahap 1 (v0.1.048) dan tahap 2: tombol Bayar + cicilan (v0.1.049); Catat panen vs Catat hasil (v0.1.050); jadwal kegiatan per siklus (v0.1.051); katalog harga pasar (v0.1.052); kalkulator kelayakan usaha (v0.1.053); ekspor Excel (v0.1.054); isian Rencana keuangan lewat modal FAB (v0.1.055); ringkasan, sub-tab geser, ubah aset/utang (v0.1.056); daftar anggaran dengan detail (v0.1.057); daftar aset dan utang dengan detail (v0.1.058); grafik arus kas, saringan utang, simpan & tambah lagi, tren harga (v0.1.059); Jadwal dan Panen lewat modal detail (v0.1.060); modal bersama, tombol kembali, hapus seragam (v0.1.061); detail siklus dipadatkan (v0.1.066); duplikat FAB dibersihkan (v0.1.067); layout desktop dashboard tahap A–C (v0.1.081); Fase 6E Jurnal Siklus direncanakan, 8 tahap (v0.1.086); Tahap 0 selesai: docs/JURNAL.md dan wireframe, menunggu konfirmasi keputusan (v0.1.087); Fase 6E Tahap 4 foto jurnal (v0.1.092); Jurnal Tahap 7: Catat cepat (v0.1.100); keamanan data multi-tab (v0.1.101); performa 1.000+ entri dan aksesibilitas Jurnal diaudit (v0.1.105); cetak laporan diperbarui (v0.1.111); latar kaca dedaunan tropis (v0.1.123); halaman Profil (v0.1.162); usulan fitur tambahan A1–C3 dicatat di bagian 7 (v0.1.189); Upah harian A2 selesai (v0.1.190), Stok saprodi A1 selesai (v0.1.191), Prive A4 selesai (v0.1.192), Buku pembeli A3 selesai (v0.1.193), bilah bagian Rencana satu baris (v0.1.194)

## 1. Visi & Tujuan

Aplikasi web sederhana untuk mencatat dan menganalisa keuangan pertanian skala rumahan (kebun sayur, polybag, hidroponik, kolam kecil, ternak kecil, dll.), sehingga pengguna tahu:

- Berapa **modal** yang keluar dan **hasil** yang masuk per siklus tanam/produksi
- Komoditas atau kegiatan mana yang **untung** dan mana yang **rugi**
- Kapan **balik modal** dan berapa **harga jual minimum** agar tidak rugi

## 2. Target Pengguna

- Petani rumahan / hobiis yang mulai menjual hasil panen
- Pelaku urban farming (hidroponik, vertikultur, polybag)
- Kelompok kecil (KWT, komunitas) yang butuh catatan sederhana

## 3. Prinsip Desain

1. **Mudah dipakai di HP** — input transaksi maksimal 3 ketukan
2. **Offline-first** — data tersimpan lokal, sinkron cloud bersifat opsional
3. **Bahasa petani, bukan bahasa akuntan** — istilah: "modal", "hasil panen", "untung"
4. **Analisa otomatis** — pengguna cukup mencatat, hitungan dikerjakan aplikasi
5. **Data milik pengguna** — selalu bisa ekspor ke Excel/CSV

## 4. Usulan Teknologi

| Lapisan | Pilihan awal | Catatan |
|---|---|---|
| Frontend | HTML + CSS + JavaScript (tanpa build) | Ringan, mudah di-deploy statis |
| Penyimpanan | localStorage / IndexedDB | Mulai lokal |
| Cloud (opsional) | Supabase | Login & sinkron antar perangkat, fase lanjut |
| Grafik | Chart.js | Dashboard & laporan |
| Ekspor | CSV / XLSX / PDF | Laporan untuk arsip atau pengajuan modal |
| Instalasi | PWA | Bisa dipasang di layar utama HP |

## 5. Model Data (Ringkas)

- **Lahan/Unit** — nama, jenis (kebun, hidroponik, kolam, kandang), luas/kapasitas
- **Komoditas** — nama, satuan hasil (kg, ikat, butir), umur panen
- **Siklus** — komoditas, unit, tanggal mulai, tanggal selesai, status
- **Transaksi** — tanggal, jenis (pengeluaran/pemasukan), kategori, jumlah, siklus terkait, catatan
- **Kategori** — benih, pupuk, pestisida, tenaga kerja, alat, air/listrik, pakan, penjualan, lainnya
- **Aset** — nama, harga beli, umur ekonomis (untuk penyusutan)
- **Panen & Penjualan** — kuantitas, harga per satuan, pembeli, susut/reject
- **Jurnal siklus** (rencana, Fase 6E) — tanggal, jenis (catatan, tahap, kejadian, ukuran, kegiatan), isi, foto, siklus terkait

## 6. Tahapan Pengembangan

### Fase 0 — Persiapan (Minggu 1)
- [x] Finalisasi lingkup dan daftar kategori biaya/pendapatan (docs/SPEC.md, data/seed-kategori.json)
- [x] Wireframe kasar: Beranda, Input Transaksi, Siklus, Laporan (docs/WIREFRAME.md)
- [x] Struktur folder dan skema data (README.md, docs/DATA-SCHEMA.md)
- **Hasil:** dokumen spesifikasi + kerangka proyek

### Fase 1 — MVP Pencatatan (v0.1) (Minggu 2–3)
- [x] CRUD transaksi pemasukan & pengeluaran
- [x] Kategori bawaan + tambah kategori sendiri
- [x] Daftar transaksi dengan filter tanggal & kategori
- [x] Ringkasan sederhana: total modal, total hasil, laba/rugi
- [x] Penyimpanan lokal + ekspor/impor data (JSON/CSV)
- **Hasil:** aplikasi sudah bisa dipakai mencatat harian

### Fase 2 — Unit, Komoditas & Siklus (v0.2) (Minggu 4–5)
- [x] Master data unit/lahan dan komoditas
- [x] Siklus tanam/produksi: mulai → panen → selesai
- [x] Transaksi terhubung ke siklus
- [x] Pencatatan hasil panen (kuantitas, susut, harga jual)
- **Hasil:** biaya & hasil bisa dilacak per siklus

### Fase 3 — Analisa Keuangan Inti (v0.3) (Minggu 6–8)
- [x] **Laba-rugi** per siklus, komoditas, unit, dan periode
- [x] **HPP** (harga pokok produksi) per kg/satuan
- [x] **R/C Ratio** (revenue/cost) dan margin keuntungan
- [x] **Break-Even Point** — titik impas dalam kuantitas dan harga
- [x] Rekomendasi harga jual minimum untuk target margin tertentu
- [x] Perbandingan antar siklus & antar komoditas
- **Hasil:** pengguna tahu komoditas mana yang paling menguntungkan

### Fase 4 — Dashboard & Laporan (v0.4) (Minggu 9–10)
- [x] Dashboard: tren pemasukan/pengeluaran, komposisi biaya, top komoditas
- [x] Laporan bulanan/musiman yang bisa dicetak
- [x] Ekspor laporan ke PDF dan Excel (PDF lewat cetak browser; Excel .xls)
- **Hasil:** gambaran keuangan dalam satu layar + laporan siap arsip

### Fase 5 — Anggaran, Arus Kas & Aset (v0.5) (Minggu 11–13)
- [x] Rencana anggaran per siklus vs realisasi
- [x] Arus kas (cash flow) dan proyeksi sederhana
- [x] Pencatatan aset dan penyusutan alat
- [x] Analisa balik modal (payback period) untuk investasi awal
- [x] Pencatatan utang/piutang sederhana
- **Hasil:** perencanaan keuangan sebelum tanam, bukan hanya pencatatan

### Fase 6 — PWA & Sinkron Cloud (v0.6) (Minggu 14–16)
- [x] PWA: bisa dipasang di HP dan jalan offline — manifest, service worker, ikon, tombol pasang (v0.1.019); **diuji di hosting HTTPS (Vercel) dan terpasang serta jalan di HP** (dikonfirmasi pengguna, v0.1.110)
- [x] Login & sinkron Supabase (opsional) — **dikonfirmasi pengguna sudah jalan di proyek sungguhan lewat HTTPS (17/11/2026)**; uji rinci (kode OTP, batas kecepatan, sesi habis, dua perangkat) tetap di Fase 6F Tahap 5. Sebelumnya: login, gabung per entri, sinkron otomatis, timpa/ambil/hapus cloud sudah ada dan lolos uji server tiruan (v0.1.023, docs/SINKRON.md); layar Masuk/Daftar dan label status (v0.1.107, Fase 6F, docs/AKUN.md); centang setelah diuji di proyek Supabase sungguhan (kini jalan, lihat di atas)
- [x] Cadangan otomatis & pemulihan data (docs/CADANGAN.md; salinan di browser, belum ke cloud)
- [ ] Mode multi-pengguna sederhana (pemilik & pencatat)
- **Hasil:** data aman dan bisa diakses dari beberapa perangkat

### Fase 6B — Penyempurnaan UX (v0.1.024)
- [x] FAB tidak menutupi angka: sembunyi saat gulir turun, muncul saat gulir naik; ruang bawah halaman lebih lega
- [x] Target ketuk minimal 40 px (tombol tema, setelan, mata, pilihan, aksi di Setelan)
- [x] Transaksi: filter ringkas (pencarian, periode, jenis) dengan "Filter lain" untuk kategori dan siklus
- [x] Beranda: banner data contoh satu baris, "Perlu perhatian" 3 teratas + Lihat semua, grafik bisa dilipat (terlipat di HP)
- [x] Siklus: bilah anggaran dan untung sementara di tiap kartu
- [x] Setelan: bagian bisa dilipat; indikator status sinkron di header
- [x] Judul halaman aktif di semua halaman selain Beranda, dengan tombol induk untuk halaman turunan (v0.1.026)
- [x] Beranda: kartu hero (untung bulan ini, selisih vs bulan lalu, tren 6 bulan, modal/hasil/R/C) — v0.1.025
- [x] Laporan: sub-tab (Ringkasan, Grafik, Per siklus) dan tombol ekspor/cetak di atas (v0.1.031; sub-tab: Ringkasan, Grafik, Rincian)
- [x] Laporan: perbandingan bulan ini vs rata-rata 3 bulan (v0.1.027)
- [x] Transaksi: duplikat transaksi (biaya rutin) dan geser untuk hapus — duplikat (v0.1.027) dan geser untuk hapus dengan Urungkan (v0.1.032); geser belum diuji di HP sungguhan
- [x] Siklus: pengingat perkiraan panen dan urutan berdasarkan panen terdekat (v0.1.028)
- **Hasil:** pemakaian satu tangan di HP lebih nyaman, halaman tidak terlalu panjang

### Fase 6C — Analisa Lanjutan & Template (v0.1.025+)
- [x] Analisa sensitivitas: "bagaimana jika harga jual turun 10%?" (memakai HPP dan BEP yang ada) (v0.1.029)
- [x] Template komoditas dengan estimasi biaya standar (sayur daun, cabai, tomat, lele, ayam petelur) — proporsi biaya (bukan harga rupiah) (v0.1.030)
- [x] Foto nota/bukti transaksi (lokal dulu) — satu foto per transaksi, dikecilkan, disimpan di IndexedDB; tidak ikut ekspor/sinkron (v0.1.037, docs/NOTA.md); belum diuji di kamera HP sungguhan
- **Hasil:** pengguna baru membuat siklus dalam satu ketukan dan bisa menguji skenario harga

### Fase 6D — Tampilan Desktop (dikerjakan bertahap sejak v0.1.080)
Dasar: pemeriksaan v0.1.079 di Chromium headless lebar 1440 (belum di Firefox/Safari/komputer sungguhan). Temuan: isi satu kolom 920 px di tengah (±260 px kosong di tiap sisi); tab navigasi di Beranda muncul di bawah kartu hero, di halaman lain di atas isi (tidak konsisten); teks pada grafik ikut membesar karena SVG diskalakan penuh.

**Tahap 0 — Layout dashboard sesuai gambar referensi (permintaan pengguna, v0.1.080)**
Aturan: hanya tata letak untuk layar ≥1100 px; token warna, font, dan gaya kartu yang ada tidak diubah; di bawah 1100 px tampilan sama seperti sebelumnya. Rincian: `docs/DESKTOP.md`.
- [x] **A. Kerangka:** rail ikon di kiri (lonjong, logo di atas, item aktif berupa kotak terang, tooltip nama), header dengan breadcrumb kecil + judul besar + pill tombol tema/setelan di kanan, tab atas disembunyikan, wadah lebar hingga 1560 px, FAB bergeser ke sudut kanan (v0.1.080)
- [x] **B. Grid dashboard Beranda 12 kolom:** hero lebar di kiri, Posisi kas dan Dibanding bulan lalu bertumpuk di tengah, Transaksi terakhir sebagai panel tinggi di kanan, Perlu perhatian dan Siklus berjalan di baris bawah, Grafik dua kolom dengan tinggi dibatasi; tata letak khusus 1100–1359 px dan saat data kosong (v0.1.080)
- [x] **C. Penyempurnaan Beranda:** Siklus berjalan menjadi kartu terpisah (ikon, nama, modal, bilah progres umur siklus, hari ke-N/umur panen, pil sisa hari atau "lewat N hari"; tanpa bilah bila komoditas belum punya umur panen) dan kartu hero menampilkan grafik tren lebih besar dengan label bulan (v0.1.081). Angka di tengah kartu seperti pada gambar tidak dibuat karena angka untung sudah besar di hero
- [x] **D. Halaman lain mengikuti kerangka baru** (v0.1.082): Siklus (grid kartu 2–3 kolom), Detail siklus (Ringkasan + Jadwal di kiri, Panen + Transaksi di kanan), Transaksi (filter di samping, menempel saat menggulir), Laporan (ringkasan | banding, tren | komposisi, rincian | simulasi), Setelan dan Lainnya (dua kolom); formulir dibatasi 720 px. Unit/Komoditas hanya dibatasi lebar (satu daftar tampil sekaligus) dan Rencana keuangan tetap satu kolom; Transaksi sebagai tabel masih Tahap 2. Diuji di Chromium headless lebar 1100, 1280, 1440, 1920 dan 8 kombinasi skema/mode/kaca; HP, tablet, dan 1099 px identik dengan v0.1.081
- [x] **E. Rail lengkap** (v0.1.083): item Setelan di dasar rail, lencana jumlah Perlu perhatian pada Beranda, label saat disorot atau difokus keyboard, rail diperluas (ikon + label) di layar ≥1600 px, rapat di layar pendek. Diuji di Chromium headless lebar 1100–1920 dan tinggi 560; HP/tablet/1099 px identik dengan v0.1.082
- [x] **F. Variasi tema** (v0.1.084): 8 kombinasi (Hijau Padi/Emas Klasik × terang/gelap × kaca) × 6 halaman × lebar 1280/1600 dan skala 90–120% × lebar 1100–1920 diperiksa di Chromium headless; tanpa overflow atau rail bertumpuk. Diperbaiki: lencana rail gelap, item aktif rail Emas terang, token teks sekunder/status empat palet (teks di bawah 4,5:1 turun dari 17–113 menjadi 0–6 per kombinasi). Sisa: angka hero dan merek Emas terang ±3,2:1 (token emas sengaja tetap), tombol utama kaca gelap 4,1–4,4:1
- [ ] **G. Pengujian lanjutan** — sebagian (v0.1.085): cetak dari kerangka baru diuji dan diperbaiki (4 tema × 6 halaman, PDF A4; Emas gelap tercetak tak terbaca, tepi hitam tema gelap), dan audit statis kompatibilitas selesai (docs/DESKTOP.md). Belum: Firefox dan Safari (tidak tersedia di lingkungan pengembangan), monitor dan skala Windows sungguhan, dialog cetak sungguhan. Sudah diuji di Chromium headless pada lebar 1100, 1280, 1360, 1920 (v0.1.080)

**Tahap 1 — murah dan berdampingan dengan Tahap 0**
- [x] Wadah lebih lebar dengan grid dua kolom: Beranda (v0.1.080), Laporan (v0.1.082), dan layar 1024–1099 px (v0.1.173: batas desktop diturunkan dari 1100 ke 1024 px; Transaksi memakai filter di atas tabel sampai 1179 px). Belum diuji di tablet sungguhan
- [x] Navigasi desktop konsisten di semua halaman: rail kiri tetap (ikon dengan tooltip nama; label penuh menunggu Tahap 0-E), bilah bawah tetap untuk HP, tab atas dipertahankan di 721–1099 px (v0.1.080)
- [x] *(v0.1.118; teks dibatasi ±1,25× lewat pengukuran saat tampil, bukan gambar ulang; tinggi dibatasi sejak Tahap 0-B)* Grafik: ukuran font tetap dan tinggi dibatasi; 12 bulan sebagai bawaan di desktop
- [ ] Angka (sebagian: tabular-nums global sudah ada, v0.1.110; rata kanan di semua daftar dan tabel belum diperiksa): `font-variant-numeric: tabular-nums` dan rata kanan di semua daftar dan tabel jumlah
- [x] Keamanan data multi-tab: deteksi perubahan dari tab lain (`storage` event) dan gabung 3 arah per entri alih-alih menimpa — *selesai v0.1.101 (docs/MULTITAB.md); belum diuji pada PWA terpasang di HP bersama tab Chrome; dua simpan dalam beberapa milidetik yang sama masih bisa saling menimpa (batas `localStorage`)*
- [x] *(v0.1.118; saklar Mati/Nyala di Setelan, tooltip tombol ikon sudah ada dari Tahap 0-E)* Pintasan keyboard: `N` catat baru, `/` cari, `G` lalu `B/T/S/L` pindah halaman, `?` daftar pintasan; tooltip pada tombol ikon

**Tahap 2 — lebih besar**
- [x] *(v0.1.119)* Transaksi sebagai tabel di desktop (tanggal, kategori, siklus, catatan, jumlah): header lengket, bisa diurutkan, baris hover
- [x] *(v0.1.121; khusus Transaksi, panel kanan)* Pola master–detail: daftar di kiri, detail/ubah di panel kanan (bukan pindah halaman penuh)
- [x] Modal menjadi dialog selebar 520 px di desktop; formulir Rencana dua kolom untuk isian pendek; urutan Tab dan fokus otomatis sudah ada (v0.1.174, docs/MODAL.md). Modal Siklus, Bayar utang, dan Profil baru melebar, belum dua kolom
- [~] *(v0.1.120: ikon hapus di baris, pilih banyak + hapus massal, hover/fokus di tabel; target klik lebih rapat belum)* Interaksi mouse: `@media (hover:hover) and (pointer:fine)` — efek hover, target klik lebih rapat, ikon hapus di baris (geser tidak berguna dengan mouse), pilih banyak dengan kotak centang untuk hapus massal
- [ ] 3–4 kartu KPI dalam satu baris (lihat Tahap 0-C)

**Tahap 3 — pelengkap**
- [ ] Cadangan ke folder pilihan (File System Access API, Chromium) dan seret-dan-lepas berkas untuk impor
- [x] *(v0.1.122: cetak langsung halaman Transaksi; dokumen Laporan/Jurnal sudah punya format sendiri; Beranda dan detail Siklus belum)* Cetak: `@page` A4 (margin, nomor halaman, `break-inside: avoid`)
- [ ] PWA desktop: manifest dengan `display_override`, jendela mandiri; tema otomatis mengikuti `prefers-color-scheme`
- [ ] Aksesibilitas desktop: landmark `nav`/`main`, `aria-current` menu aktif, cek kontras AA tema terang, uji zoom 200% dan skala Windows 125–150%
- [ ] Uji otomatis di lebar 1024/1280/1440/1920 pada Chromium, Firefox, WebKit, dengan tangkapan layar pembanding

**Temuan terbuka**
- [x] Satu ketukan Cetak memanggil `window.print` dua kali pada uji headless — **bukan galat aplikasi** (v0.1.085): ekspresi yang mengganti `window.print` ikut dipanggil oleh alat uji sehingga hitungan awal sudah 1; satu ketukan (klik asli maupun `Analisa.cetak()`) memanggil tepat satu kali

### Fase 6E — Jurnal Siklus (perjalanan tanaman dari awal sampai panen) — Tahap 0–5 selesai (v0.1.087–093), Tahap 6 sebagian (cadangan foto v0.1.094; Excel dan CSV jurnal v0.1.095); uji kamera HP sungguhan tertunda; diusulkan v0.1.086
**Latar.** Aplikasi sudah mencatat uang (transaksi), hasil (panen), dan rencana (jadwal kegiatan, perkiraan panen), tetapi belum *ceritanya*: kapan benih disemai, kapan dipindah tanam, hama apa yang datang, apa yang dilakukan, seperti apa kondisi tanamannya. Tanpa itu angka untung/rugi tidak bisa dijelaskan ("kenapa siklus ini rugi?") dan pengalaman tidak terbawa ke siklus berikutnya.

**Tujuan.** Setiap siklus punya **jurnal**: catatan perjalanan dari persiapan sampai panen (dan evaluasi) dalam satu linimasa yang menggabungkan catatan, foto, tahap pertumbuhan, kejadian, serta data uang, panen, dan kegiatan yang sudah ada. Pembeda: *Jadwal* = rencana ke depan; *Transaksi* dan *Panen* = angka; *Jurnal* = apa yang terjadi dan terlihat di lapangan.

**Prinsip khusus fitur ini**
1. **Catat cepat:** satu catatan boleh hanya satu kalimat atau satu foto; tanggal bawaan hari ini; kegiatan umum cukup satu ketukan (chip).
2. **Tidak menggandakan data:** transaksi, panen, dan jadwal tampil di linimasa dari sumbernya (baca-saja, ketuk membuka aslinya). Jurnal tidak memengaruhi kas, anggaran, maupun laporan keuangan.
3. **Offline-first:** teks ikut data utama; foto lokal dulu (IndexedDB) dan fitur belum dianggap selesai sebelum ada jalan keluar untuk foto (cadangan, Tahap 6).
4. **Menyatu dengan pola yang ada:** tombol + (FAB), modal detail dengan Ubah dan Hapus + Urungkan (docs/MODAL.md), penamaan (docs/STYLE.md), mode Tersembunyi, cetak polos, tema terang/gelap/kaca, dan layout desktop (Fase 6D).
5. **Bahasa petani:** "Catatan", "Tahap", "Kejadian", "Ukuran"; bukan "log" atau "event".

**Rancangan data (usulan; dikunci di Tahap 0)**
- Koleksi akar baru `jurnal` (satu entri satu catatan, supaya sinkron per entri tidak bentrok seperti bila ditanam di dalam `siklus`). Awalan id `jr_` (`j_` sudah dipakai jadwal).
- Field: `id`, `siklusId` (wajib), `tanggal` (tidak sebelum `siklus.mulai`, tidak di masa depan), `jenis` (`catatan` | `tahap` | `kejadian` | `ukuran` | `kegiatan`; `kegiatan` dibuat otomatis saat jadwal ditandai selesai), `judul?`, `isi?`, `tahap?` (kode tahap), `kejadian?` (`hama` | `penyakit` | `cuaca` | `perawatan` | `lainnya`), `ukuran?` (`{nama, nilai, satuan}`), `foto?` (daftar id foto, maks. 4), `jadwalId?`, `dibuat`, `diubah`, `terhapus`. Catatan wajib punya minimal judul, isi, atau foto.
- **Linimasa** = entri `jurnal` + peristiwa turunan yang tidak disimpan ulang: mulai dan selesai siklus, transaksi (modal/hasil) dan panen siklus itu. Riwayat kegiatan jadwal baru ada setelah Tahap 2 (sekarang `jadwal` hanya menyimpan `terakhir`).
- **Titik pendaftaran koleksi baru** (daftar periksa teknis, ada di empat tempat): `App.KOLEKSI` + `App.sah` + `kosong()`, `KOLEKSI` di `js/sinkron.js`, `kunci` impor di `js/setelan.js`, `js/contoh.js` (data contoh ikut terhapus bersama contoh); ditambah lembar `Jurnal` di `js/xlsx.js`, `docs/DATA-SCHEMA.md`, dan uji bahwa data lama tanpa koleksi `jurnal` tetap valid.

Perkiraan ukuran: S kecil · M sedang · L besar. Urutan: 0 → 1 → 2 → (3 dan 4 boleh paralel) → 5 → 6 → 7; tiap tahap dirilis sendiri sebagai versi `0.1.xxx` dan berguna tanpa tahap sesudahnya.

**Tahap 0 — Rancangan dan keputusan (S, tanpa kode)**
- [x] Jawab **Keputusan terbuka** di bawah dan kunci skema data — *usulan diadopsi sementara di docs/JURNAL.md bagian 3 dan skema dikunci di bagian 4 (v0.1.087); dipakai membangun Tahap 1 (v0.1.088) atas permintaan "lanjut roadmap 6e"; tetap bisa diubah di Tahap 2 dan seterusnya*
- [x] `docs/JURNAL.md` (istilah, aturan, skema, linimasa, antarmuka, daftar periksa teknis) dan wireframe HP dan desktop di `docs/WIREFRAME.md` bagian 7–11 (v0.1.087)
- [x] Daftar **tahap pertumbuhan bawaan** per template komoditas (Sayur daun, Cabai, Tomat, Lele, Ayam petelur) dan satu daftar Umum untuk komoditas lain; persen umur panen dan saran hari ke-N (docs/JURNAL.md bagian 6, v0.1.087)
- [x] Keputusan rancangan tambahan (v0.1.087): FAB di detail siklus berjalan menambah **Catat jurnal** (siklus selesai: tombol **Tulis evaluasi** di halaman); catatan penutup memakai field `evaluasi` (maks. satu per siklus); hapus siklus diblok juga bila ada jurnal; ubah tanggal mulai tidak boleh setelah entri tertua; alamat linimasa `#jurnal-<id siklus>`
- **Hasil:** spesifikasi disetujui sebelum ada kode — **menunggu konfirmasi pengguna atas delapan keputusan**

**Tahap 1 — Catatan jurnal teks (M) — fondasi**
- [x] Koleksi `jurnal` terdaftar di empat titik di atas, validasi `sah`, ikut ekspor/impor JSON, cadangan otomatis, dan sinkron per entri; data contoh menyertakan beberapa catatan pada siklus cabai
- [x] Detail siklus: bagian **Jurnal** (3 terbaru + Lihat semua, seperti Panen), tombol + → **Catat jurnal** (modal: tanggal, judul opsional, isi); modal detail dengan **Ubah** dan **Hapus** (Urungkan) sesuai docs/MODAL.md
- [x] Aturan: tanggal tidak sebelum mulai siklus dan tidak di masa depan; siklus selesai baca-saja (mengikuti keputusan no. 1)
- [x] Uji: impor data lama, sinkron gabung, cadangan dan pulihkan, hapus siklus bila ada jurnal (pesan menyebut jumlahnya), tema dan lebar HP/desktop
- [x] Tambahan sesuai keputusan no. 1: siklus selesai menerima **satu catatan Evaluasi** (tombol Tulis evaluasi; Ubah/Hapus hanya untuk evaluasi); lembar **Jurnal** di ekspor Excel; hapus siklus dan ubah tanggal mulai ikut memeriksa jurnal
- **Hasil:** pengguna sudah bisa menulis catatan harian per siklus — **selesai di v0.1.088** (modul `js/jurnal.js`; diuji end-to-end di Chromium 320–360 px: 34 pemeriksaan; belum di HP sungguhan)

**Tahap 2 — Linimasa siklus (M)**
- [x] Tampilan kronologis (halaman **Jurnal siklus** dari detail siklus; di desktop kolom lebar): entri jurnal + peristiwa turunan (Mulai siklus, transaksi modal/hasil, panen, Selesai) dengan penanda **hari ke-N** dan **minggu ke-N** sejak mulai
- [x] Peristiwa turunan baca-saja dan diberi gaya berbeda; ketuk membuka modal atau halaman aslinya
- [x] Saringan jenis (Semua · Catatan · Uang · Panen · Kegiatan) dan urutan terlama atau terbaru; daftar bertahap (100 baris + Tampilkan lebih banyak, seperti Transaksi)
- [x] **Riwayat kegiatan:** saat jadwal ditandai "Sudah dikerjakan" (di detail siklus maupun Agenda) otomatis dibuat entri jurnal `kegiatan` dengan Urungkan yang ikut menghapusnya
- [x] Mode Tersembunyi menyamarkan nominal di linimasa; cetak polos halaman ini
- **Hasil:** satu layar menceritakan siklus dari mulai sampai panen — **selesai di v0.1.089** (modul `js/linimasa.js`, rute `#jurnal-<id>`, tombol Buka linimasa di bagian Jurnal; diuji di Chromium 390 px dan 1440 px; belum di HP sungguhan)

**Tahap 3 — Tahap pertumbuhan (M)**
- [x] *(v0.1.090 daftar bawaan dan pencatatan; v0.1.091 ganti nama tahap di Ubah komoditas)* Jenis `tahap`: pilih tahap (mis. Persiapan lahan, Semai, Pindah tanam, Vegetatif, Berbunga, Berbuah, Panen) dari daftar bawaan per komoditas; nama tahap bisa diubah
- [x] *(v0.1.090 kartu siklus, Beranda, bilah di detail; v0.1.091 Agenda)* **Tahap sekarang** dan lama di tahap itu tampil di kartu siklus (tab Siklus dan "Siklus berjalan" di Beranda) dan di Agenda; bilah tahap bersegmen dibandingkan dengan umur panen
- [x] Saran "tahap berikutnya" berdasarkan hari ke-N (hanya saran, tidak otomatis)
- [x] (v0.1.091) Pengingat opsional "belum ada catatan N hari" di Beranda → Perlu perhatian (mati secara bawaan, diatur di Setelan; hanya tampil saat aplikasi dibuka)
- **Hasil:** terlihat tanaman sedang di tahap apa dan apakah sesuai perkiraan — **selesai di v0.1.091** (modul `js/tahap.js`; diuji di Chromium 390 px; belum di HP sungguhan)

**Tahap 4 — Foto jurnal, lokal (L)**
- [x] **Syarat sebelum rilis:** `Nota.rapikan()` (js/nota.js) kini hanya mengenali `transaksi.notaId`, sehingga foto jurnal akan dihapus setelah 30 hari sebagai "yatim"; ubah agar membaca rujukan jurnal juga, dan uji — *selesai v0.1.092: `rapikan()` membaca `jurnal.foto` (catatan yang belum dihapus); foto catatan terhapus dan foto yatim tetap dibersihkan; diuji*
- [x] 1–4 foto per catatan (kamera atau galeri) memakai modul `Nota` (dikecilkan 1280 px, JPEG) di IndexedDB; id foto `f_xxxxxx` disimpan di `jurnal.foto` — *v0.1.092, modul baru `js/foto.js`; formulir Catat/Ubah catatan; catatan boleh hanya berisi foto (judul tampil "Foto catatan"); Evaluasi tidak memakai foto*
- [x] Galeri kecil di linimasa; layar penuh dengan geser antarfoto, Esc, jebakan Tab (seperti foto nota) — *v0.1.092; galeri juga di modal detail catatan; panah kiri/kanan, tombol sebelumnya/berikutnya, geser jari, penghitung "2 / 3"; mode Tersembunyi tidak menyamarkan foto jurnal (keputusan no. 7)*
- [x] Penanda "foto tidak ada di perangkat ini" (data diimpor atau disinkron dari perangkat lain); hapus foto saat catatan dihapus dan tidak ada Urungkan yang bisa memulihkannya — *v0.1.092; foto dihapus setelah jendela Urungkan (±5,6 dtk) lewat, Urungkan membatalkan penghapusan; bila halaman ditutup lebih dulu, pembersih 30 hari yang menyapu*
- [x] Setelan: jumlah dan ukuran foto (nota + jurnal), pemakaian penyimpanan (`navigator.storage.estimate()`), dan permintaan penyimpanan tetap (`navigator.storage.persist()`) agar browser tidak membuang foto — *v0.1.092; baris "Foto nota dan jurnal" dan "Penyimpanan tetap"; Hapus semua foto kini mencakup keduanya*
- [ ] Uji di kamera HP sungguhan, foto besar, dan kuota hampir penuh — *foto besar (6000×4000, 5,8 MB → 1280 px, 572 KB), berkas >30 MB, bukan gambar, dan galat kuota (disimulasikan) sudah diuji di Chromium; kamera HP sungguhan dan kuota perangkat nyata belum*
- **Hasil:** perkembangan tanaman terdokumentasi dengan foto — **selesai di v0.1.092** (kecuali butir uji perangkat sungguhan; 31 pemeriksaan otomatis lulus di Chromium 390 px dan 1440 px)

**Tahap 5 — Kejadian dan ukuran (M)**
- [x] Jenis `kejadian` dengan chip (hama, penyakit, cuaca, perawatan, lainnya) dan jenis `ukuran` (nama, nilai, satuan; mis. tinggi 35 cm, bobot ikan 120 g)
- [x] Grafik mini pertumbuhan: nilai ukuran terhadap hari ke-N (memakai `Analisa.kurva`), per nama ukuran
- [x] Ringkasan kejadian di detail siklus (jumlah per jenis, kejadian terakhir); menutup butir backlog "cuaca/hasil per kondisi untuk korelasi" secara sederhana
- [x] Hubungan ke uang: ketuk kejadian untuk melihat transaksi pada tanggal yang sama (mis. beli pestisida)
- **Hasil:** pengguna bisa menjawab "hama apa yang menyerang dan apa dampaknya"

**Tahap 6 — Laporan, ekspor, dan cadangan foto (L)**
- [x] *(v0.1.103)* **Laporan perjalanan siklus** yang bisa dicetak (cetak polos): kop, ringkasan uang, tahap dan tanggalnya, catatan, kejadian, foto kecil (opsional); dipicu dari detail siklus
- [x] *(v0.1.095)* Ekspor Excel: lembar **Jurnal** (js/xlsx.js); CSV jurnal
- [x] *(v0.1.094)* **Cadangan foto:** ekspor semua foto ke satu berkas ZIP (penulis ZIP di js/xlsx.js dipakai ulang) beserta indeks nama berkas dan siklusnya, dan impor kembali; peringatan bila ada foto yang belum dicadangkan
- [x] *(v0.1.103)* Analisa lintas siklus: lama tiap tahap dan **panen pertama rata-rata hari ke-N** dari siklus selesai dibandingkan dengan umur panen komoditas, dengan tawaran memperbarui `umurPanenHari`
- **Hasil:** pengalaman satu siklus bisa diarsipkan, dicetak, dan dipakai merencanakan siklus berikutnya — **Tahap 6 selesai di v0.1.103** (`js/perjalanan.js`, `js/pengalaman.js`; diuji di Chromium 390 px dan 1440 px dan lewat PDF Chromium; belum di printer atau HP sungguhan)

**Tahap 7 — Penyempurnaan (M, sebagian opsional)**
- [x] *(v0.1.104)* Chip **Jurnal** di tab Siklus: umpan lintas siklus (seperti Agenda) dengan pencarian kata kunci dan saringan siklus/jenis
- [x] **Catatan cepat:** chip satu ketukan yang langsung membuat entri hari ini; tawaran "Tambah catatan" setelah menandai jadwal selesai — *selesai v0.1.100 (modul `js/cepat.js`; chip per jenis komoditas, toast Urungkan + Tambah detail, linimasa dan detail siklus; belum diuji di HP sungguhan; chip yang bisa diubah pengguna belum)*
- [x] *(v0.1.115)* Desktop: pola master–detail untuk linimasa (Fase 6D Tahap 2); pintasan keyboard catat jurnal — ketuk catatan di layar ≥ 1100 px membuka detail di panel kiri (Ubah, Hapus, Esc menutup); tombol J membuka Catat jurnal
- [ ] Performa 1.000+ entri, aksesibilitas (urutan Tab, label, pengumuman perubahan), dan uji dengan data nyata 1–2 siklus (menyambung ke Fase 7) — *sebagian (v0.1.105): performa diukur sampai 5.000 jurnal + 20.000 transaksi (semua layar < 300 ms), audit aksesibilitas otomatis dan uji keyboard dikerjakan, `aria-pressed` pada tombol pilihan diperbaiki (docs/AUDIT.md); belum: data nyata 1–2 siklus, pembaca layar sungguhan, HP berspesifikasi rendah*
- **Hasil:** jurnal terasa cepat dan tidak memberatkan, layak dipakai tiap hari

**Tahap 7B — Perbaikan cetak Jurnal siklus (hasil audit PDF A4 pada v0.1.111, 99 entri campuran; belum dikerjakan)**
Prioritas dari tinggi ke rendah. Berkas terkait: `js/linimasa.js` (`cetakDoc`), `js/perjalanan.js`, `css/style.css` (blok `#cetak-lap`).
- [x] *(v0.1.112)* **P1 — Halaman 1 hampir kosong (linimasa).** `.ct-bag{break-inside:avoid}` membungkus satu tabel panjang, jadi kop sendirian di halaman 1 dan tabel mulai di halaman 2. Lepas aturan itu dari bagian panjang (tabel linimasa, Catatan, Kejadian, Panen), pertahankan hanya untuk bagian pendek (Ringkasan uang); baris tetap utuh lewat `tr{break-inside:avoid}`
- [x] *(v0.1.112)* **P2 — Ruang kosong di laporan perjalanan.** Sebab sama: bagian Catatan dilompatkan seluruhnya ke halaman 2 dan separuh halaman 1 kosong. Judul bagian harus menempel ke baris pertama tabel (`break-after:avoid`)
- [x] *(v0.1.113)* **P3 — Saringan dan urutan layar diabaikan saat cetak.** Dengan saringan Uang + urutan Terlama, cetakan tetap memuat semua jenis. Usulan: cetak sesuai saringan layar dan cantumkan "Saringan: …" di kop (alternatif: selalu lengkap dan tulis "Semua peristiwa")
- [x] *(v0.1.112)* **P4 — Kop linimasa kurang informatif.** Tambah status, hari ke-N atau tanggal selesai, jumlah entri, dan ringkasan untung/rugi; samakan dengan kop laporan perjalanan
- [x] *(v0.1.113)* **P5 — Pengelompokan Minggu ke-N tidak ikut tercetak.** Tambah baris pemisah per minggu agar 100+ entri mudah dibaca
- [x] *(v0.1.114)* **P6 — Foto tidak ikut di cetakan linimasa** (`lm-galeri` bersifat `no-print`). Pakai mekanisme "Dengan foto" milik laporan perjalanan, atau arahkan pengguna ke tombol itu
- [x] *(v0.1.112)* **P7 — Teks ganda pada Kejadian.** Entri tanpa judul tampil "Hama: Ditemukan di 5 batang" lalu isinya diulang di baris kedua; sembunyikan baris kedua bila isi sudah menjadi judul
- [x] *(v0.1.112)* **P8 — Urutan entri pada detik yang sama tidak konsisten** (linimasa 0, 40, 80; laporan perjalanan 40, 0, 80). Tambah pengikat urutan tetap (mis. `id`) di kedua tempat
- [x] *(v0.1.113)* **P9 — Chip Jurnal di tab Siklus tidak punya cetak;** menekan cetak di sana mencetak tampilan layar apa adanya. Beri dokumen cetak sendiri atau sembunyikan antarmukanya saat dicetak
- [ ] **P10 — Uji perangkat nyata:** printer sungguhan, Chrome Android (Cetak ke PDF), Safari iOS; mode Tersembunyi (ketukan kedua), tema gelap dan kaca
- **Definisi selesai:** PDF A4 diperiksa untuk 1 halaman, 3 halaman, dan 7+ halaman (tanpa halaman kosong atau terpotong), siklus berjalan dan selesai, dengan dan tanpa saringan; CHANGELOG dan `docs/JURNAL.md` diperbarui

**Definisi selesai tiap tahap:** dokumentasi (docs/JURNAL.md, DATA-SCHEMA.md, CHANGELOG.md, baris roadmap); uji otomatis di Chromium (HP 390 px dan desktop 1440 px, tema terang/gelap/kaca) tanpa galat JavaScript; impor data lama tanpa regresi; cetak dan ekspor yang ada tetap berfungsi; zip full + update dan pratinjau web; butir yang belum diuji di HP sungguhan dicatat apa adanya.

**Keputusan terbuka (perlu jawaban pengguna sebelum Tahap 1; usulan di kurung).** *Status v0.1.087: semua usulan diadopsi sementara di docs/JURNAL.md bagian 3; ubah jawaban bila ada yang tidak cocok.*
1. Setelah siklus selesai, bolehkah jurnal ditambah? (Siklus selesai baca-saja, kecuali satu catatan **Evaluasi** penutup; selebihnya lewat Buka kembali)
2. Foto: lokal saja atau juga disinkron ke cloud? (Lokal + cadangan ZIP dulu; sinkron foto lewat Supabase Storage butuh bucket, kuota, dan biaya, jadi ditunda)
3. Jurnal per siklus saja, atau juga per unit (mis. pH air hidroponik, kondisi kolam secara umum)? (Per siklus dulu; catatan unit dipertimbangkan di Tahap 7)
4. Tahap pertumbuhan: tetap atau bisa dikustom? (Bawaan per komoditas, nama bisa diubah, urutan tetap)
5. Satu siklus dengan banyak bedeng atau kolam: satu jurnal atau terpisah? (Satu jurnal per siklus; pisahkan lewat siklus terpisah)
6. Pengingat "belum mencatat": perlu? (Opsional, mati secara bawaan, hanya saat aplikasi dibuka)
7. Mode Tersembunyi: apa yang disamarkan? (Hanya nominal uang di linimasa; teks catatan dan foto tidak)
8. Letak menu: bagian di Detail siklus dulu, chip **Jurnal** di tab Siklus di Tahap 7? (Ya)

**Risiko khusus fitur ini**
| Risiko | Mitigasi |
|---|---|
| Foto hilang (data browser dibersihkan, ganti HP) padahal foto adalah isi paling berharga | Minta penyimpanan tetap (`persist`), penghitung ukuran di Setelan, cadangan ZIP (Tahap 6), peringatan jelas |
| Pembersih foto otomatis menghapus foto jurnal | Syarat Tahap 4: `rapikan()` membaca rujukan jurnal, diuji |
| Pengguna malas menulis | Catatan cukup satu kalimat atau satu foto, chip catatan cepat, entri otomatis dari jadwal |
| `localStorage` penuh (±5 MB) | Jurnal hanya teks (±300 B per catatan); ukuran data dipantau di Setelan; foto tidak masuk localStorage |
| Bentrok edit antarperangkat | Satu entri satu catatan, digabung per entri berdasarkan `diubah` (mekanisme sinkron yang ada) |
| Linimasa membingungkan karena campur uang dan catatan | Peristiwa turunan berbeda gaya dan baca-saja, saringan jenis, mode Tersembunyi |
| Lingkup membengkak | Tiap tahap dirilis sendiri; Tahap 5–7 opsional dan bisa dipindah ke backlog |

### Fase 6F — Akun & Sinkron Supabase (layar Masuk dan Daftar; mode lokal tetap bawaan) — Tahap 1 selesai (v0.1.107)
**Latar.** Sinkron Supabase sudah jalan (v0.1.023; konfigurasi bawaan v0.1.106) tetapi berupa formulir teknis di dalam Setelan: alamat proyek dan kunci tampil, tidak ada status yang terlihat, dan pesan galat masih bahasa Inggris dari server. Rancangan lengkap: docs/AKUN.md.

**Prinsip**
1. **Lokal dulu:** tidak ada layar login saat aplikasi dibuka; semua fitur jalan penuh tanpa akun. Akun hanya tambahan opsional untuk cadangan cloud dan banyak perangkat.
2. **Status selalu terlihat, tidak mengganggu:** label kecil di header (Mode lokal, Menyinkronkan…, Tersinkron HH:MM, Gagal sinkron, Menunggu internet); ketuk untuk membuka akun.
3. **Satu mesin modal** (Modal) untuk Layar Akun: jebakan Tab, Esc, tombol Kembali, fokus kembali.
4. **Pesan ramah berbahasa Indonesia**, kata sandi tidak pernah disimpan, bagian teknis disembunyikan di Lanjutan.
5. **Keluar tidak menghapus data di perangkat.** Foto dan data contoh tidak ikut sinkron, dan harus dikatakan jelas.

**Tahapan**
- [x] **Tahap 1 — Layar akun dan label status (v0.1.107):** Layar Akun (Masuk, Buat akun, Cek email) sebagai modal; label status di header; kartu "Akun dan sinkron" di Setelan; alamat proyek dan kunci pindah ke Lanjutan; pesan galat berbahasa Indonesia; tampil/sembunyi kata sandi, indikator kekuatan, persetujuan; uji dengan server Supabase tiruan.
- [ ] **Tahap 2 — Masuk dengan kode 6 angka lewat email dan pemulihan kata sandi:** `signInWithOtp` lalu `verifyOtp` (tanpa tautan, cocok untuk PWA terpasang); lupa kata sandi; kirim ulang dengan hitung mundur. Butuh templat email Supabase yang memuat kode (`{{ .Token }}`).
- [ ] **Tahap 3 — Pilihan gabung pada login pertama dan ajakan lembut:** bila perangkat dan cloud sama-sama berisi data, tampilkan jumlah masing-masing dan tiga pilihan (Gabungkan, Pakai data cloud, Pakai data perangkat ini); ajakan membuat akun sekali per 30 hari setelah ±30 transaksi, bisa ditutup.
- [ ] **Tahap 4 — Ganti kata sandi, hapus akun dan data cloud:** konfirmasi dengan mengetik email; keluar dengan pilihan menyimpan atau menghapus data lokal.
- [ ] **Tahap 5 — Uji pada proyek Supabase sungguhan** (sebagian: sinkron dasar dan HTTPS dikonfirmasi jalan, 17/11/2026; sisanya belum): konfirmasi email, kode OTP, batas kecepatan, sesi habis, dua perangkat, uji kamera/PWA terpasang.
- [ ] **Tahap 6 — Multi-pengguna (pemilik dan pencatat):** tabel kebun, anggota, dan RLS berbasis peran; skema satu baris per pengguna (`tani_data`) perlu diganti. Dikerjakan setelah alur akun stabil.

### Fase 6G — Penyempurnaan Header (ringan) — Tahap 1–3 selesai (v0.1.134)
**Latar (diukur pada v0.1.121, HP 390 px).** Tinggi header 125–135 px (±16% layar 800 px) dan tidak lengket: setelah gulir, judul halaman, tombol kembali, dan status sinkron ikut hilang dari layar. Tombol tema berlabel tetap "Ganti tema" tanpa `title`; tanggal hari ini tidak tampil; judul panjang (misalnya detail siklus) membungkus dua baris.
**Sudah baik, tidak diubah:** warna bilah browser mengikuti tema dan skema (`theme-color`); tombol 40×40 px; tombol mata muncul kontekstual saat mode Tersembunyi; label status sinkron (Fase 6F); header desktop (breadcrumb, judul, pil tombol).
**Prinsip:** perubahan kecil, hanya HP kecuali disebut lain, tanpa mengubah palet, huruf, atau layout desktop Fase 6D; semua animasi menghormati `prefers-reduced-motion`.

**Tahap 1 — Rapi dan informatif (kecil, risiko rendah) — selesai v0.1.125**
- [x] **Tombol tema:** `aria-label` dan `title` dinamis ("Tema terang, ketuk untuk gelap"), ikut berubah saat tema diganti dari Setelan; toast singkat "Tema gelap" saat diketuk. Mode Otomatis tetap diatur di Setelan.
- [x] **Tanggal di Beranda:** baris di bawah judul menjadi "Jumat, 13/11 · Manajemen pertanian" (format ISO: "Jumat, 11-13"). Di layar ≤430 px nama hari disingkat tiga huruf ("Jum, 13/11") dan di ≤379 px tagline disembunyikan agar tetap satu baris; tanggal diperbarui saat aplikasi kembali terlihat setelah ganti hari. Halaman lain tetap "Buku Kebun".
- [x] **Judul panjang:** sudah terpenuhi sejak sebelumnya (h1 memuat `title` berisi teks lengkap dan terpotong dua baris); tidak ada perubahan.
- [x] **Chip sinkron:** titik berdenyut pelan saat "Menyinkronkan…"; nonaktif pada `prefers-reduced-motion`; area ketuk tetap ≥40 px.
- [x] **Header HP lebih rendah:** padding atas 30→20 px dan bawah 20→14 px di <1100 px: tinggi 125→107 px (Beranda, Transaksi, dan halaman lain), detail siklus 135→117 px; desktop (≥1100 px) tidak berubah.

**Tahap 2 — Header ringkas saat gulir (kecil–sedang, HP saja) — selesai v0.1.126**
- [x] Bilah ramping (53 px) `Ringkas` (`js/ringkas.js`): tombol kembali (halaman turunan), judul terpotong dengan elipsis (ketuk = ke puncak halaman), titik status sinkron (Mode lokal, Tersinkron, Menyinkronkan, Gagal, Menunggu internet; berlabel untuk pembaca layar), dan tombol Setelan. Muncul saat menggulir **ke atas** setelah melewati header, tersembunyi saat menggulir ke bawah, di dekat puncak halaman, saat modal terbuka, dan saat berpindah halaman. Latar solid tanpa blur.
- [x] `scroll-padding-top: 64px` (<1100 px) agar fokus dan anchor tidak tertutup; tidak bertabrakan dengan FAB, modal (z-index lebih tinggi), toast, dan bilah bawah; memakai `env(safe-area-inset-top)`.
- [x] Tidak aktif di desktop (≥1100 px; `display:none`) dan saat cetak; transisi dimatikan pada `prefers-reduced-motion`.
- *Kriteria selesai:* tidak ada lompatan tata letak saat bilah muncul; Tab dan Shift+Tab tidak terjebak; tombol kembali bisa dicapai dengan satu ketukan di halaman mana pun setelah gulir; lolos uji tema terang, gelap, Emas, efek kaca, dan mode Tersembunyi.

**Tahap 3 — Pelengkap (opsional, ukur manfaatnya dulu)**
- [x] **Penanda "perlu perhatian"** (titik kecil; selesai v0.1.132: titik merah/emas di bilah bawah HP, lencana angka tetap di rail desktop) pada ikon Beranda di bilah bawah dan rail bila ada jatuh tempo lewat atau anggaran ≥90%, memakai daftar yang sama dengan kartu "Perlu perhatian".
- [x] **Pencarian cepat** (selesai v0.1.133, docs/CARI.md): ikon kaca pembesar di header dan bilah ringkas membuka dialog yang mencari transaksi, siklus, dan jurnal; pintasan `/` di desktop; kata kunci terakhir; *Lihat semua* ke saringan Transaksi/Jurnal. Sejak v0.1.134 juga mencakup panen, utang/piutang, aset, dan harga pasar.
- *Sengaja tidak dimasukkan:* salam atau avatar besar (tidak relevan untuk mode lokal), notifikasi push, dan spanduk pasang aplikasi (sudah ada di Setelan). *(Diperbarui: salam dan avatar akhirnya ditambahkan di v0.1.148, docs/PROFIL.md; halaman profil penuh diusulkan di Fase 6H.)*

**Risiko dan mitigasi.** Bilah lengket bisa menutupi judul bagian saat tautan atau fokus melompat → `scroll-padding-top`; bilah lengket di atas efek kaca bisa mahal di HP lama → latar solid; header berubah tinggi bisa membuat konten melompat → ruang disediakan tetap (CLS 0).
**Ukuran keberhasilan.** Tinggi header HP ≤105 px (Tahap 1: 107 px; sisanya dicapai bilah ringkas Tahap 2), tanpa regresi tata letak desktop (uji 1100, 1280, 1440 px) dan tanpa galat JavaScript.
**Keputusan untuk Anda.** (1) Diputuskan: bilah muncul saat gulir ke atas (hemat ruang); bila ingin selalu tampil setelah melewati header, ubah `geser()` di `js/ringkas.js`. (2) Tanggal di Beranda sudah memakai bentuk ringkas "Jumat, 13/11"; ubah ke "Jumat, 13 Nov" bila lebih disukai.

### Fase 6H — Halaman Profil (selesai di v0.1.162)
**Latar.** Sejak v0.1.148 "profil" hanya berupa nama dan foto (modal *Ubah profil*) dengan menu dari avatar (docs/PROFIL.md); belum ada halaman. Informasi tentang usaha tersebar di Setelan, Akun dan sinkron, dan Panduan. (Catatan: butir "salam atau avatar besar tidak relevan" di Fase 6G sudah digantikan oleh v0.1.148.)
**Prinsip.** (1) **Pusat ringkasan, bukan Setelan kedua:** pengaturan tetap di Setelan; halaman profil hanya menampilkan dan menautkan. (2) **Lokal dulu:** data profil tersimpan di perangkat. (3) **Tanpa palet, huruf, atau gaya kartu baru** (aturan docs/STYLE.md); tampil di HP dan desktop. (4) **Ringkasan dihitung dari data yang sudah ada**, tanpa input baru. (5) **Satu pengguna per perangkat;** multi-pengguna (Fase 6F Tahap 6) tidak disentuh.

**Tahapan**
- [x] **Tahap 1 — Halaman dan kepala:** rute `profil` (docs/RUTE.md) dibuka dari item "Profil" di menu avatar; modal *Ubah profil* tetap dipakai untuk menyunting. Kepala: foto, nama, **nama usaha atau kebun**, **lokasi** (desa atau kabupaten; opsional). Setelan baru `usaha` dan `lokasi` (batas panjang; bertahan saat Atur ulang). *(selesai v0.1.162: rute `#profil`, kepala dengan nama usaha dan lokasi)*
- [x] **Tahap 2 — Ringkasan usaha** (dihitung, tanpa input baru): mulai mencatat sejak (tanggal transaksi pertama), siklus berjalan dan selesai, jumlah unit, komoditas, total transaksi. Satu kartu; keadaan kosong yang ramah, termasuk saat masih data contoh. *(selesai v0.1.162)*
- [x] **Tahap 3 — Akun dan cadangan:** status sinkron dan waktu sinkron terakhir (label yang sama dengan header), tombol Masuk atau Keluar (membuka Layar Akun yang ada), tombol Cadangkan (ekspor yang ada), dan waktu cadangan terakhir (penanda lokal baru). *(selesai v0.1.162; penanda `cadTerakhir` hanya untuk cadangan manual. **Sejak v0.1.165** tombol Cadangkan dan waktu cadangan pindah ke Setelan → Data karena duplikat; di Profil tinggal Akun dan sinkron)*
- [x] **Tahap 4 — Preferensi cepat dan Tentang:** tema (3 pilihan) dan sembunyikan angka dengan kontrol yang sama seperti di menu avatar; versi aplikasi, panduan cepat, tautan ke Setelan. *(selesai v0.1.162; **dicabut di v0.1.165**: tema, sembunyikan angka, versi, dan panduan hanya di Setelan; Profil tinggal tombol Buka Setelan, menu avatar tetap punya pintasan tema dan angka)*
- [x] **Tahap 5 — Pemakaian nama usaha:** kop Laporan cetak dan lembar Ringkasan Excel (baris "Usaha"), supaya data profil berguna di keluaran, bukan sekadar hiasan. *(selesai v0.1.162: kop cetak dan baris Usaha di ujung lembar Ringkasan Excel)*
- [x] **Tahap 6 — Uji dan dokumen:** docs/PROFIL.md diperbarui; uji peramban (HP 360/390 px, desktop 1100/1440 px, tema terang/gelap, skema Emas, mode Tersembunyi); tanpa galat JavaScript; tes bawaan lulus. *(selesai v0.1.162: `tools/uji-profil.py`; belum diuji di HP sungguhan)*
- *Sengaja tidak dimasukkan (usulan):* multi-pengguna dan peran, lencana pencapaian atau avatar bergaya media sosial, dan data identitas sensitif (NIK, rekening, nomor telepon).

**Risiko dan mitigasi.** Tumpang tindih dengan Setelan → profil hanya menampilkan dan menautkan. Nama usaha panjang merusak kop cetak → batas 40 huruf dan elipsis. Data profil hilang saat ganti perangkat → tulis jelas di halaman bahwa data ini lokal, atau putuskan ikut cadangan (lihat Keputusan).
**Ukuran keberhasilan.** Halaman terbuka dalam satu ketukan dari avatar di semua halaman; tanpa regresi tata letak Beranda dan header; nama usaha tampil di kop cetak dan Excel.
**Keputusan (diambil di v0.1.162, dapat diubah).** (1) Cakupan: semua tahap dikerjakan sekaligus. (2) Nama usaha dan lokasi awalnya lokal seperti nama dan foto; sejak v0.1.164 keempat data profil (nama, foto, usaha, lokasi) ikut cadangan, ekspor, dan sinkron lewat `data.profil`.

### Fase 6I — Laporan lebih informatif dan biaya gaji pemilik (v0.1.175–184)

- [x] Kategori Modal bawaan **Gaji Pemilik** (biaya tetap); penerima (saya atau istri) cukup ditulis di Catatan. Isian Penerima khusus sempat ada di v0.1.175–176 lalu dihapus di v0.1.177 (docs/TRANSAKSI.md)
- [x] Laporan: **periode bebas** (Bulan lalu, Pilih tanggal Dari–Sampai) (v0.1.178, docs/LAPORAN.md)
- [x] Laporan: **biaya tetap vs variabel** di layar, cetak, dan Excel (v0.1.178)
- [x] Laporan: **untung sebelum dan sesudah gaji pemilik** di Ringkasan, Rincian, cetak, dan Excel (v0.1.178)
- [x] Laporan: **Sorotan periode**: tiga pengeluaran dan pemasukan terbesar, kategori tersering, hari tersibuk, rata-rata per transaksi (v0.1.179)
- [x] Laporan: **banding dengan periode sebelumnya** yang sama panjang (modal, hasil, untung, selisih persen) untuk Bulan ini, Bulan lalu, Tahun ini, dan Pilih tanggal (v0.1.181)
- [x] Laporan: **bulan terbaik dan terburuk** (menurut untung) dalam periode terpilih, di Sorotan (v0.1.181)
- [x] Laporan: **rata-rata pengeluaran per hari** pada periode terpilih, di Sorotan (v0.1.181)
- [x] HPP dan BEP dengan pilihan **mengecualikan Gaji Pemilik**: pilihan di filter Laporan (muncul bila periode punya gaji), bawaan tetap dengan gaji (v0.1.182)
- [x] Laporan: **penyusutan aset** dan **untung dengan alat disusutkan** (layar, cetak, Excel) (v0.1.184)
- [x] Laporan: **efisiensi** — untung per hari (per siklus) dan untung/hasil per satuan luas unit (v0.1.184)
- [ ] Usulan berikutnya: kas vs untung (piutang belum cair); susut panen dan harga jual vs harga pasar; banding antarmusim per komoditas; biaya per kg per kategori
- [x] Perbaikan Laporan: pembanding periode berjalan memakai jumlah hari yang sama, kartu R/C cetak tidak terpotong, Excel Tren mengikuti 6/12 bulan (v0.1.182)

### Fase 7 — Rilis v1.0 (Minggu 17–18)
- [ ] Pengujian dengan data nyata (minimal 1–2 siklus)
- [ ] Perbaikan UX berdasarkan umpan balik
- [x] Dokumentasi pengguna & panduan cepat (termasuk panduan cepat 3–4 layar di dalam aplikasi saat pertama dibuka) — panduan 4 layar (js/panduan.js) dan docs/PANDUAN.md (v0.1.034); belum diuji di HP sungguhan
- [ ] Optimasi performa dan aksesibilitas — sebagian: daftar Transaksi bertahap, aria-current, tautan lewati, pengumuman halaman, panah di tab Laporan, kurangi gerakan (v0.1.038, docs/AUDIT.md); centang setelah diuji dengan pembaca layar dan HP sungguhan
- **Hasil:** rilis stabil

## 7. Ide Lanjutan (Backlog)

- Template komoditas (sayur daun, cabai, tomat, lele, ayam petelur) dengan estimasi biaya standar (selesai di v0.1.030)
- Analisa sensitivitas: "bagaimana jika harga jual turun 10%?" (selesai di v0.1.029)
- Kalender tanam + pengingat jadwal pupuk/panen — **jadwal kegiatan per siklus selesai di v0.1.051** (docs/JADWAL.md); pengingat panen sudah ada sejak v0.1.028; **tampilan agenda gabungan lintas siklus selesai di v0.1.068** (tab Siklus → Agenda, docs/JADWAL.md; diuji di Chromium, belum di HP sungguhan); belum ada notifikasi di luar aplikasi
- Pencatatan cuaca/hasil per kondisi untuk korelasi — sebagian dicakup Tahap 5 Jurnal Siklus (Fase 6E, rencana)
- Katalog harga pasar (input manual) dan pembanding harga (selesai di v0.1.052, docs/HARGA.md; belum diuji di browser/HP sungguhan)
- Kalkulator kelayakan usaha (NPV, IRR sederhana) (selesai di v0.1.053, docs/KELAYAKAN.md; belum diuji di browser/HP sungguhan)
- Integrasi Google Sheets / ekspor ke template Excel — **ekspor Excel (.xlsx) multi-lembar selesai di v0.1.054** (docs/EKSPOR.md); integrasi Google Sheets langsung dan template Excel yang bisa diimpor balik belum
- Foto nota/bukti transaksi (selesai di v0.1.037)
- Penyeragaman pola dan perilaku antar halaman (hasil audit 2026-11-04, **butir 1–3 selesai di v0.1.061** (docs/MODAL.md), Harga pasar selesai di v0.1.062, sisanya belum; poin 3–5 diuji di browser, sisanya dari membaca kode, belum diuji di HP sungguhan). Urutan pengerjaan yang disarankan: 1, 2, 3.
  - [x] **1. Satukan mesin modal (selesai di v0.1.061).** Kini ada tiga salinan (`Rencana.dlg`, `Siklus.dm`, `Utang.dlg`) dengan perilaku berbeda. Jadikan satu modul bersama. Sekaligus menyelesaikan: klik di luar modal menutup (kini hanya di Master); fokus kembali ke pemicu setelah simpan (kini jatuh ke `BODY` di Rencana; Bayar utang masih mencari tombol `utang-bayar` yang sudah hilang sejak v0.1.058); satu gaya pesan galat (kini inline di Rencana, toast di tempat lain); pemformat angka dan peringatan "Hanya angka" / "Rupiah bulat" ikut berlaku di modal (kini hanya di `#app`).
  - [x] **2. Integrasi tombol kembali (selesai di v0.1.061).** Belum ada `pushState` / `popstate`: pindah tab dan modal tidak masuk riwayat, sehingga gestur kembali di Android kemungkinan keluar dari aplikasi. Modal terbuka = satu entri riwayat; kembali menutup modal, lalu kembali ke tab sebelumnya.
  - [x] **3. Seragamkan hapus (selesai di v0.1.061; koreksi: hapus siklus dan panen sudah punya Urungkan, hanya hapus transaksi lewat tombol yang belum).** Kini dua gaya: "ketuk lagi" tanpa Urungkan (tombol Transaksi, Siklus, form Panen, Setelan, Cadangan) dan langsung hapus + Urungkan (Aset, Utang, Jadwal, Anggaran, Harga, pembayaran, geser Transaksi, Panen lewat modal). Usulan: Urungkan untuk data transaksional; konfirmasi hanya untuk tindakan yang tak bisa dipulihkan (hapus semua data, timpa cloud). Panen punya dua jalur hapus (form dan modal): sisakan satu.
  - [x] Harga pasar: riwayat jadi daftar + modal detail (Ubah, Hapus) seperti tab Rencana lain (selesai di v0.1.062; diuji di browser, belum di HP).
  - [x] Surface edit (selesai di v0.1.065, aturan di docs/MODAL.md): putuskan aturan (modal untuk isian sedikit, halaman untuk isian banyak) dan terapkan konsisten. Kini Panen: modal detail lalu Ubah membuka halaman; "Selesaikan siklus" masih isian inline di halaman.
  - [x] Gaya baris (tampilan dan perilaku disatukan di v0.1.063; markup masih tiga jenis): satukan `.tx` (div role=button), `.ang-baris` (button) dan `.m-row` (dengan tanda ›) ke satu komponen daftar.
  - [x] Penamaan (selesai di v0.1.064, aturan di docs/STYLE.md): seragamkan awalan FAB (Catat / Tambah / Atur), label tombol simpan, kata toast (tersimpan / ditambahkan / diperbarui), dan petunjuk keadaan kosong (Panen dan Transaksi siklus belum menyebut tombol +).
  - Sudah konsisten (pertahankan): semua modal punya role dialog, Esc, jebakan Tab, kunci gulir, dan penyamaran angka (Samar); aksi hapus yang memakai toast menyediakan Urungkan; tombol + hilang di halaman form.
- Optimalisasi halaman Rencana keuangan (usulan 2026-11-04, **seluruh butir selesai di v0.1.056–v0.1.059**; urutan prioritas, belum diuji di HP sungguhan):
  - [x] **Prioritas 1 (selesai di v0.1.056).** Kartu ringkasan di atas sub-tab: saldo kas, utang dan piutang belum lunas, anggaran terpakai, supaya tidak perlu pindah-pindah sub-tab.
  - [x] **Prioritas 2 (selesai di v0.1.056; Kelayakan belum dipisah).** Enam chip sub-tab dijadikan satu baris yang bisa digeser menyamping dan otomatis menggulir ke chip aktif; Kelayakan bisa dipisah karena sifatnya kalkulator, bukan pencatatan.
  - [x] **Prioritas 3 (selesai di v0.1.056).** Aset dan utang manual bisa diubah lewat tombol Ubah (modal yang sama); Hapus diberi konfirmasi atau Urungkan, seperti pada pembayaran utang.
  - [x] Arus kas: grafik batang 6 bulan terakhir plus proyeksi, dan baris "kas cukup berapa bulan" bila arus bersih negatif (selesai di v0.1.059).
  - [x] Anggaran: daftar ringkas diurutkan dari yang paling terpakai, ketuk untuk detail dengan Ubah dan Hapus (v0.1.057); siklus selesai dilipat (v0.1.059).
  - [x] Utang/piutang: daftar ringkas dengan detail dan aksi (v0.1.058, juga Aset); lipat yang lunas, saringan Utang / Piutang, lencana "Lewat tempo" (v0.1.059).
  - [x] Modal isian: tombol "Simpan & tambah lagi" untuk aset dan harga pasar (selesai di v0.1.059).
  - [x] Teknis (v0.1.059; gambar ulang sebagian belum, posisi gulir sudah terjaga lewat `App.go('rencana', true)`): jaga posisi gulir dan gambar ulang hanya bagian yang berubah (kini `App.go('rencana', true)` menggambar ulang seluruh halaman); hitung `saldoSd()` sekali lalu simpan sementara agar tidak menghitung ulang seluruh peristiwa kas per bulan; harga pasar mendapat grafik tren kecil dan tombol "lihat semua" (kini hanya 5 catatan terakhir).
- Optimasi cetak laporan plain (usulan 2026-11-05 dari pemeriksaan PDF v0.1.073; **butir 1–7 selesai di v0.1.074**, docs/LAPORAN.md; diuji lewat PDF Chromium, belum di printer atau HP sungguhan):
  - [x] 1. Kop khusus cetak: judul, sub-tab, periode, pengelompokan atau cakupan, tanggal cetak, versi (sebelumnya chip periode ikut tersembunyi sehingga kertas tidak menyebut periode).
  - [x] 2. Rincian jadi satu tabel perbandingan (baris per siklus/komoditas/unit, 10 kolom, baris total, header berulang, lanskap): 4 halaman → 1 halaman pada data contoh.
  - [x] 3. Gaya cetak polos: dokumen `#cetak-lap` dibuat saat mencetak dengan warna literal hitam di atas putih, tanpa gradasi/bayangan/sudut membulat; tidak terpengaruh tema gelap atau Efek kaca. Halaman lain yang dicetak langsung memakai token terang dan tanpa kaca.
  - [x] 4. Elemen interaktif tidak tercetak: simulasi "bagaimana jika", petunjuk sentuh grafik; tabel angka grafik selalu terbuka.
  - [x] 5. Grafik aman hitam-putih: batang Hasil (solid) dan Modal (arsir) dengan angka di atas batang; komposisi modal memakai batang berbingkai yang dicetak walau latar tidak dicetak.
  - [x] 6. `@page` A4 dengan margin, font cetak, nomor halaman "Halaman x dari y" di kaki (margin box CSS; butuh Chrome/Edge modern, Firefox dan Safari mungkin tanpa nomor halaman).
  - [x] 7. Mode Tersembunyi: tombol Cetak minta ketukan kedua ("Angka akan tercetak lengkap") karena kertas selalu memuat angka lengkap.
  - [x] 9. Satu dokumen untuk ketiga tab (Ringkasan, Grafik, Rincian) sekaligus, satu kop, Rincian di halaman lanskap baru (selesai di v0.1.075; diuji lewat PDF Chromium: 3 halaman pada data contoh).
- Isian Rencana keuangan lewat modal FAB, bukan isian di halaman (**selesai di v0.1.055**, docs/FAB.md dan docs/RENCANA.md; belum diuji di HP sungguhan; Kelayakan tetap kalkulator di halaman karena hasilnya tampil langsung saat mengetik):
  - Tombol + di Rencana membuka modal: Anggaran → Atur anggaran (pilih siklus), Arus kas → pilihan Catat modal / Catat hasil / Atur saldo awal kas, Aset → Tambah aset, Utang/piutang → Catat utang atau piutang, Harga pasar → Catat harga pasar (pilih komoditas).
  - Isian di halaman dihapus; halaman hanya menampilkan data, dengan tombol Atur anggaran di tiap siklus dan Atur saldo awal di Arus kas sebagai jalan pintas ke modal yang sama.
  - Modal memakai pola jendela Bayar: kunci gulir, Esc menutup, Enter menyimpan, fokus terjebak di dalam modal, galat tampil di dalam modal (modal tetap terbuka), fokus kembali ke pemicu.
  - Tombol + menampilkan pesan (bukan modal) bila belum ada komoditas (Harga pasar) atau siklus (Anggaran).
- Mode multi-bahasa
- Pembayaran utang/piutang dari Catat modal, Catat hasil, dan Catat panen (rancangan 2026-11-04). **Tahap 1 selesai di v0.1.048, tahap 2 (tombol Bayar dan cicilan) selesai di v0.1.049** (docs/UTANG.md); jendela Bayar belum diuji di browser/HP sungguhan:
  - Form catat mendapat isian **Pembayaran**: Tunai (bawaan), Belum dibayar, atau Sebagian (uang muka). Bila ada sisa, **Pihak** wajib diisi dan **Jatuh tempo** opsional.
  - Modal belum dibayar = beli kredit: biaya diakui penuh di siklus (HPP, anggaran, laba-rugi benar), kas belum berkurang, terbentuk **utang** sebesar sisa. Hasil belum dibayar = jual kredit: pendapatan diakui penuh, kas belum bertambah, terbentuk **piutang**. Form panen berharga juga mendapat pilihan ini.
  - Pelunasan lewat tombol **Bayar** (jumlah bebas, bisa dicicil, ada tanggal bayar), menggantikan "Tandai lunas". Pembayaran bukan transaksi Modal/Hasil baru, hanya menggerakkan kas, sehingga biaya dan hasil tidak terhitung dua kali. Lunas otomatis saat sisa nol.
  - Dasar hitung: untung, R/C, HPP, BEP, laporan memakai nilai penuh transaksi; Saldo kas dan Arus kas memakai uang yang benar-benar bergerak (transaksi tunai, uang muka, pembayaran); utang/piutang di Rencana dan Beranda memakai sisa, jatuh tempo masuk "Perlu perhatian".
  - Data: catatan utang menyimpan `transaksiId` dan daftar pembayaran (pola sama dengan panen → transaksi). Ubah transaksi memperbarui jumlah utang; hapus transaksi yang sudah ada pembayaran ditolak sampai pembayarannya dihapus; hapus punya Urungkan. Transaksi lama tanpa catatan utang dianggap tunai, tanpa migrasi. Utang manual di Rencana tetap ada untuk pinjaman di luar transaksi.
  - Risiko: saldo kas tidak lagi sama dengan jumlah semua transaksi, jadi rumus kas di Beranda, Rencana → Arus kas, dan proyeksi harus diganti dan diuji; bagian terbesar dan paling rawan salah. Dasar nilai penuh dipilih daripada kas sederhana agar biaya siklus tidak meleset.
  - Tahap 1: pilihan pembayaran di Catat modal/hasil/panen, pembentukan utang/piutang, perhitungan kas (v0.1.048). Tahap 2: tombol Bayar, cicilan, tanggal bayar, lunas otomatis, hapus pembayaran dengan Urungkan (v0.1.049).
- Penyempurnaan Catat panen vs Catat hasil (**selesai di v0.1.050**, docs/SIKLUS.md; belum diuji di browser/HP sungguhan):
  - Peringatan hasil ganda di Catat hasil bila siklus sudah punya panen berharga.
  - Petunjuk bahwa hasil tanpa jumlah barang tidak masuk HPP/BEP/harga minimum, dengan tombol "Catat sebagai panen".
  - Pengingat "panen belum dijual" di Perlu perhatian; mengarah ke form panen (bukan Catat hasil) agar jumlah barang tetap ikut dihitung.

- Audit konsistensi pola dan perilaku (usulan 2026-11-05 dari pemeriksaan v0.1.075; **butir 1–4 selesai di v0.1.076**, docs/MODAL.md dan docs/STYLE.md; diuji otomatis di Chromium 320–360 px, belum di HP, printer, atau pembaca layar):
  - [x] Sudah konsisten, jadi acuan: semua modal berbasis `Modal` (unit/komoditas, Selesaikan siklus, tiga formulir Rencana, Bayar utang) punya role dialog + aria-modal, judul berlabel, kunci gulir, Esc, Back menutup modal, fokus kembali, toast di atas modal, tanpa luapan di 320 px, target ketuk minimal 38 px, angka tersamar saat Tersembunyi. Latar: formulir tidak menutup, detail menutup. Esc dengan popup dropdown hanya menutup popup. Versi seragam, `FAB.md` cocok dengan `fab.js`, tidak ada tombol halaman yang menduplikasi FAB.
  - [x] 1. **Panduan dan penampil foto nota pindah ke mesin `Modal` (v0.1.076; diuji termasuk foto sungguhan: Back, Esc, ketuk latar, fokus kembali, tema kaca).** Keduanya memakai kode sendiri dan tanpa entri riwayat: dari Setelan, tombol Back browser pindah halaman sementara Panduan tetap terbuka di atasnya (terbukti di uji). Nota kemungkinan sama (dari kode; belum diuji langsung karena butuh foto). Hasil yang diharapkan: Back menutup keduanya, fokus kembali ke pemicu, perilaku sama dengan modal lain.
  - [x] 2. **Fokus awal modal Selesaikan siklus (v0.1.076; cadangan di `Modal.buka`).** Fokus tertinggal di tombol pembuka di belakang modal dan Tab keluar dari modal, karena isian tanggal asli disembunyikan oleh `Form.upgrade` sehingga `focus()` gagal diam-diam. Perbaikan di `Modal.buka`: bila fokus tidak masuk ke modal, arahkan ke pengganti kustom isian itu atau ke kartu modal. Periksa juga modal lain yang `fokus`-nya berupa isian tanggal atau pilihan.
  - [x] 3. **Keseragaman teks (v0.1.076; aturan di docs/STYLE.md).** (a) Penolakan hapus punya dua gaya: "Masih dipakai n siklus — gunakan Arsipkan" dan "Tidak bisa dihapus: …". (b) Tanda baca toast dan keadaan kosong campur (titik atau tanpa titik, "—" atau ":"). (c) "di tab Unit" dan "di tab Siklus" padahal keduanya menu bawah. (d) dicek ulang saat mengerjakan: "Belum ada jadwal." dan "Belum ada panen." sudah menyebut tombol + untuk siklus berjalan dan sengaja tanpa + untuk siklus selesai (FAB disembunyikan), jadi bukan pelanggaran.
  - [x] 4. **Kebersihan CSS (v0.1.076).** `.toast` punya dua deklarasi `z-index` (60 dan 120), sisakan satu. `.dm-lapis` dan `.pd-lapis` sama-sama 90 (hilang sendiri bila butir 1 selesai) dan `.nota-lihat` 80 berada di bawah modal: aman selama penampil tidak dibuka dari dalam modal, catat di `docs/MODAL.md` atau samakan.
  - [ ] 5. **Belum teruji:** penampil foto nota secara langsung, pembaca layar (VoiceOver/TalkBack), printer dan HP sungguhan. Sertakan di uji rilis berikutnya.

### Saran optimasi kartu hero (diusulkan di v0.1.099; sebagian dikerjakan di v0.1.110)
- [x] **Bandingkan periode setara** (v0.1.110): selisih terhadap "sampai tanggal yang sama bulan lalu" (atau proyeksi akhir bulan) agar tidak membandingkan bulan berjalan dengan bulan penuh. Kecil; dampak: angka lebih adil.
- [x] *(selesai v0.1.138)* **Sparkline interaktif:** ketuk atau geser untuk mengganti angka utama hero ke bulan itu (v0.1.141, tanpa petunjuk melayang; tersamar bila Tersembunyi), titik penanda bulan ini (lapisan HTML agar tidak lonjong akibat `preserveAspectRatio="none"`), dan label awal/akhir bulan juga di HP. Sedang.
- [x] **Notasi ringkas untuk miliaran** (v0.1.110) ("Rp 12,3 M") dengan nilai penuh di `title`/ketuk, sebagai ganti sekadar mengecilkan huruf. Kecil.
- [x] ~~**Pilihan periode hero**~~ — **dibatalkan** atas permintaan pengguna (hero cukup angka utama): chip kecil Bulan ini / 3 bulan / Tahun ini / Siklus berjalan. Sedang.
- [x] ~~**Anggaran terpakai di hero**~~ — **dibatalkan** atas permintaan pengguna; anggaran tetap di kartu Siklus berjalan: batang kemajuan "sisa anggaran bulan ini" bila anggaran diisi. Sedang.
- [x] *(selesai v0.1.142)* **Cache agregat bulanan:** `Analisa.agg()` satu lintasan, dipakai bersama `Analisa.bulanN`, `Beranda.per`, dan hero; memo dibatalkan saat `App._ak` direset. Render Beranda pada 100.000 transaksi 155 → 72 ms (`tools/uji-agregat.py`). Sedang.
- [x] **Penjelasan R/C untuk pemula** (v0.1.110): ketuk "R/C ratio" membuka penjelasan satu kalimat dan status (mis. ≥ 1,3 sehat). Kecil.
- [x] **Uji tangkapan layar otomatis** (v0.1.110, `tools/uji-hero.py`): kartu hero di 320/360/390/1440 px agar regresi terlihat sebelum rilis. Kecil.

### Tinjauan usulan fitur setelah Supabase dan HTTPS jalan (17 November 2026)
Urutan usulan, dari yang paling mendesak:
1. **Mantapkan akun dan sinkron** (Fase 6F Tahap 2–5): masuk kode 6 angka dan lupa kata sandi (penting untuk PWA di HP), pilihan gabung pada login pertama, ganti kata sandi dan hapus akun, lalu uji dua perangkat dan sesi habis. Dasar bagi semua fitur cloud lain.
2. **Pengaman produksi:** `vercel.json` untuk header keamanan (CSP, X-Content-Type-Options, Referrer-Policy) dan `sw.js` tanpa cache agar pembaruan cepat sampai; audit RLS di proyek sungguhan (tiap pengguna hanya melihat barisnya); cadangan berkala proyek Supabase; kebijakan privasi singkat.
3. **Foto dan nota ke cloud** (Supabase Storage, opsional, dengan batas kuota): sekarang foto hanya di perangkat sehingga HP hilang berarti foto hilang.
4. **Multi-pengguna pemilik dan pencatat** (Tahap 6): tabel kebun, anggota, dan RLS berbasis peran; mengganti skema satu baris per pengguna.
5. **Laporan lanjutan:** kas vs untung (piutang belum cair), susut panen, harga jual vs harga pasar, banding antarmusim, biaya per kg per kategori (lihat Fase 6I).
6. **Berbagi laporan:** tautan baca-saja atau PDF siap kirim ke pengurus, koperasi, atau bank (laba-rugi, arus kas, aset).
7. **Pengingat sungguhan:** Web Push atau email terjadwal (Supabase Edge Function) untuk jadwal pupuk, panen, dan utang jatuh tempo; hanya untuk yang masuk akun.
8. **Kualitas:** uji perangkat nyata (kamera, printer, Safari iOS), Firefox dan WebKit, konsolidasi CSS.

### Usulan fitur tambahan (17 November 2026, belum dikerjakan)
Belum ada di daftar prioritas di atas; dicek terhadap kode v0.1.188 (tidak ada stok, upah harian, buku pembeli, atau penanda uang pribadi). Urutan di dalam kelompok dari yang paling bermanfaat. Semua opsional dan tanpa ketergantungan cloud kecuali disebut. Tiga yang disarankan lebih dulu: A2, A1, A4.

**A. Pencatatan harian usaha tani**
- [x] **A1. Stok saprodi** — *selesai v0.1.191 (docs/STOK.md; diuji di Chromium headless, belum di HP sungguhan).* Sisa pupuk, benih, pestisida; beli berharga otomatis menjadi modal (dan utang bila belum dibayar), pakai mengurangi stok, koreksi sisa, peringatan menipis di Perlu perhatian Beranda. Belum: satuan ganda, nilai stok, ubah catatan, data contoh.
- [x] **A2. Upah harian (HOK)** — *selesai v0.1.190 (docs/UPAH.md; diuji di Chromium headless, belum di HP sungguhan).* Daftar pekerja, hari kerja, dan tarif harian; upah tercatat sebagai transaksi Tenaga Kerja sehingga otomatis masuk biaya siklus, HPP, dan laporan; rekap per pekerja dan periode; upah belum dibayar lewat mesin Utang. Belum: absensi harian, lembur, bon/potongan, data contoh.
- [x] **A3. Buku pembeli** — *selesai v0.1.193 (docs/PEMBELI.md; diuji di Chromium headless, belum di HP sungguhan).* Daftar pembeli dihitung dari nama pembeli di panen dan piutang (tanpa koleksi baru): total penjualan per periode, rata-rata harga per komoditas, piutang, riwayat jual, ganti nama dan gabung ejaan berbeda, saran nama di form panen. Belum: kontak dan catatan per pembeli (butuh koleksi), data contoh.
- [x] **A4. Pemisah uang usaha dan rumah tangga (Prive)** — *selesai v0.1.192 (docs/PRIVE.md; diuji di Chromium headless, belum di HP sungguhan).* Kategori Prive mengurangi kas tetapi tidak dihitung sebagai modal, HPP, atau pengurang untung; baris Prive di Laporan. Belum: kategori setoran/tambah modal pemilik.

**B. Analisa dan perencanaan**
- [ ] **B1. Target musim tanam.** Isi target panen dan harga sebelum tanam, bandingkan dengan realisasi (melengkapi anggaran dan jadwal yang sudah ada).
- [ ] **B2. Kalender musim.** Rata-rata untung per komoditas per bulan dari data sendiri, untuk melihat bulan tanam yang paling menguntungkan.
- [ ] **B3. Ringkasan pengajuan KUR atau dana desa.** Satu paket PDF: profil usaha, laba-rugi, arus kas, aset, utang. Berbeda dari "Berbagi laporan" (prioritas 6) karena formatnya khusus untuk bank atau koperasi; menjawab pertanyaan terbuka no. 5.

**C. Kemudahan pakai**
- [ ] **C1. Catat lewat suara.** Mis. "beli pupuk NPK 200 ribu" diubah menjadi draf transaksi yang dikonfirmasi pengguna.
- [ ] **C2. Transaksi berulang otomatis.** Biaya tetap (listrik, air) muncul sebagai draf tiap bulan, tinggal dikonfirmasi.
- [ ] **C3. Kalkulator dosis dan campuran.** Takaran pupuk atau pestisida per luas atau per tangki, terhubung ke Jadwal.

## 8. Metrik Keberhasilan

- Mencatat satu transaksi < 15 detik
- Laporan laba-rugi satu siklus dihasilkan otomatis tanpa input tambahan
- Pengguna bisa menjawab "komoditas mana yang paling untung" dari dashboard
- Data bisa diekspor penuh kapan saja

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Pengguna malas mencatat | Input super cepat, template, pengingat harian |
| Data hilang (hanya lokal) | Ekspor berkala, cadangan otomatis, sinkron cloud |
| Alokasi biaya bersama (air, listrik, tenaga kerja) rumit | Metode alokasi sederhana: bagi rata atau per luas |
| Lingkup membengkak | Disiplin per fase; fitur baru masuk backlog dulu |
| Istilah akuntansi membingungkan | Bahasa awam + tooltip penjelasan |

### Utang teknis CSS (hasil audit v0.1.117)
- [x] Audit CSS: kode mati, hover di layar sentuh, kontras tinggi, token z-index, `.theme-toggle` (v0.1.117, `docs/AUDIT-CSS.md`)
- [ ] Konsolidasi blok CSS yang tersebar (±52 blok bertanda versi di akhir file; aturan kaca di ±11 area; `.bottom-nav`, `textarea`, `.tx` ditulis 4 kali), bertahap dan dijaga `tools/tangkapan.py`
- [ ] Skala desain: 29 ukuran font dan 28 nilai radius tanpa token (usul skala font 11/12/13/14/16/20/22+ dan radius 8/12/16/999)
- [ ] Kurangi ketergantungan pada selektor `#id` (93 aturan) dan `:has()` di layout desktop Beranda (Safari 15.4+/Firefox 121+), mis. kelas modifier dari JS

## 10. Pertanyaan Terbuka

1. Jenis usaha apa yang jadi fokus awal — sayuran, hidroponik, perikanan, ternak, atau campuran?
2. Siapa pengguna utama — pribadi, atau kelompok/komunitas?
3. Apakah perlu multi-pengguna dan login sejak awal, atau cukup lokal dulu?
4. Mata uang dan satuan: Rupiah saja? Satuan khusus (ikat, karung, butir)?
5. Apakah perlu laporan format tertentu (misalnya untuk pengajuan KUR atau dana desa)?
6. Jurnal Siklus (Fase 6E): delapan keputusan terbuka tercantum di bagian Fase 6E sebelum Tahap 1 dimulai.

## 11. Changelog Dokumen

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 2026-11-03 | Draf awal roadmap |
| 0.1.001 | 2026-11-03 | Fase 0 selesai: spesifikasi, wireframe, skema data, kerangka proyek |
| 0.1.002 | 2026-11-03 | Gaya antarmuka mengikuti Jurnal Trading (docs/STYLE.md) |
| 0.1.003 | 2026-11-03 | FAB untuk input transaksi, menu Catat dihapus dari nav |
| 0.1.004 | 2026-11-03 | Palet warna Hijau Padi (#FFF4C9, #C7E78B, #81AE64, #709053) |
| 0.1.005 | 2026-11-03 | Halaman Setelan (docs/SETELAN.md), skema Emas Klasik, tombol mata |
| 0.1.006 | 2026-11-03 | Sakelar efek kaca di Setelan |
| 0.1.007 | 2026-11-03 | Fase 1 selesai: CRUD transaksi, kategori sendiri, filter, ringkasan, CSV (docs/TRANSAKSI.md); ikon navigasi; digabung dengan efek kaca 0.1.006 |
| 0.1.008 | 2026-11-03 | Fase 2 selesai: unit, komoditas, siklus, transaksi per siklus, panen (docs/SIKLUS.md) |
| 0.1.009 | 2026-11-03 | Form kustom: dropdown dan pemilih tanggal tanpa tampilan bawaan browser (js/form.js) |
| 0.1.010 | 2026-11-03 | Perbaikan tampil di HP: versi satu berkas tani-keuangan.html, penyimpanan cadangan bila localStorage diblokir |
| 0.1.011 | 2026-11-03 | Fase 3: tab Laporan (laba-rugi, R/C, HPP, BEP, harga jual minimum; docs/LAPORAN.md) |
| 0.1.012 | 2026-11-03 | Fase 4: dashboard (tren, komposisi, komoditas teratas), cetak/PDF, ekspor Excel |
| 0.1.013 | 2026-11-03 | Grafik tren garis halus hasil/modal dengan tooltip sentuh, rentang 6/12 bulan, tabel angka |
| 0.1.014 | 2026-11-03 | Batang Modal di grafik batang diberi warna merah agar berbeda dari Hasil |
| 0.1.015 | 2026-11-03 | Fase 5: anggaran vs realisasi, arus kas + proyeksi, aset + penyusutan + balik modal, utang/piutang (docs/RENCANA.md) |
| 0.1.057 | 2026-11-04 | Tab Anggaran jadi daftar ringkas; ketuk untuk detail dengan Ubah dan Hapus anggaran (docs/RENCANA.md) |
| 0.1.058 | 2026-11-04 | Aset dan Utang/piutang jadi daftar ringkas; ketuk untuk detail dengan Bayar, Ubah, Hapus, riwayat pembayaran (docs/RENCANA.md) |
| 0.1.059 | 2026-11-04 | Grafik arus kas + perkiraan kas cukup berapa bulan, saringan dan lipat lunas di Utang, lipat siklus selesai, Simpan & tambah lagi, tren harga pasar (docs/RENCANA.md) |
| 0.1.060 | 2026-11-04 | Detail siklus: Jadwal kegiatan dan Panen jadi daftar ringkas dengan modal detail (Ubah/Hapus/Sudah dikerjakan), tambah jadwal lewat tombol + (docs/JADWAL.md, docs/SIKLUS.md) |
| 0.1.061 | 2026-11-04 | Satu mesin modal bersama, tombol kembali HP terhubung ke riwayat, hapus seragam dengan Urungkan (docs/MODAL.md) |
| 0.1.062 | 2026-11-04 | Harga pasar: riwayat jadi daftar ringkas + modal detail (Ubah, Hapus dengan Urungkan) |
| 0.1.063 | 2026-11-04 | Gaya baris daftar disatukan (.tx, .ang-baris, .m-row): tinggi, hover/fokus, tanda › |
| 0.1.064 | 2026-11-04 | Penamaan diseragamkan: kata toast, keadaan kosong menyebut tombol +, aturan awalan tombol |
| 0.1.065 | 2026-11-04 | Aturan surface edit; Selesaikan siklus menjadi modal |
| 0.1.066 | 2026-11-04 | Detail siklus dipadatkan: tombol ganda dengan FAB dihapus, daftar Panen/Transaksi diringkas (Lihat semua), Hapus siklus ke bawah |
| 0.1.067 | 2026-11-05 | Duplikat FAB dihapus di Unit/Komoditas (kosong) dan Arus kas (Atur saldo awal) |
| 0.1.068 | 2026-11-05 | Agenda lintas siklus: kegiatan terjadwal dan perkiraan panen dari semua siklus berjalan, dikelompokkan per waktu, dengan ✓ langsung dari agenda |
| 0.1.069 | 2026-11-05 | Efek kaca menjadi Liquid Glass bergaya iOS: bahan berlapis, tepi bercahaya, kapsul, navigasi bawah melayang dengan lensa aktif, Kurangi Transparansi (docs/STYLE.md) |
| 0.1.070 | 2026-11-05 | Liquid Glass lebih bening (isian tipis, blur ringan, tanpa cahaya dalam) dan latar bentuk geometri (9 bentuk, hanya saat kaca Nyala); pengukuran kontras teks (docs/STYLE.md) |
| 0.1.071 | 2026-11-05 | Header dinamis: judul halaman aktif pindah ke header, tombol kembali bulat untuk halaman turunan, blok judul di bawah menu dihapus (docs/STYLE.md) |
| 0.1.072 | 2026-11-05 | Perbaikan efek kaca di HP: backdrop-filter 25–47 → 4 elemen, latar tetap terisolasi, navbar/FAB di lapisan sendiri (belum diuji di HP sungguhan) |
| 0.1.073 | 2026-11-05 | Kurva tren Laporan dan Beranda lebih halus: kubik monoton (tanpa tekukan dan lonjakan), sparkline Beranda tidak lagi garis patah |
| 0.1.078 | 2026-11-05 | Pengaman navbar bawah: overflow-x clip di html/body, navbar dan label tidak bisa melebihi layar, teks panjang membungkus |
| 0.1.079 | 2026-11-05 | Laporan satu halaman tanpa tab; rincian lipat; filter satu set |
| 0.1.080 | 2026-11-05 | Layout desktop sesuai referensi (Fase 6D Tahap 0 A–B): rail ikon kiri, header breadcrumb + pill, grid dashboard Beranda; roadmap diperbarui |
| 0.1.081 | 2026-11-05 | Layout desktop Tahap 0-C: kartu Siklus berjalan dengan bilah progres dan pil sisa hari; tren hero lebih besar dengan label bulan |
| 0.1.082 | 2026-11-05 | Layout desktop Tahap 0-D: Siklus, Detail siklus, Transaksi, Laporan, Setelan, Lainnya (docs/DESKTOP.md) |
| 0.1.083 | 2026-11-05 | Layout desktop Tahap 0-E: rail lengkap (Setelan, lencana, label hover/fokus, rail diperluas ≥1600 px) |
| 0.1.084 | 2026-11-05 | Layout desktop Tahap 0-F: variasi tema dan kontras (lencana rail gelap, item aktif rail Emas terang, token teks sekunder/status empat palet); skala 90–120% diuji (docs/DESKTOP.md) |
| 0.1.085 | 2026-11-05 | Layout desktop Tahap 0-G (sebagian): cetak dari kerangka baru diuji dan diperbaiki (Emas gelap, tepi hitam tema gelap), cetak ganda ternyata artefak uji, audit kompatibilitas Safari/Firefox (docs/DESKTOP.md) |
| 0.1.086 | 2026-11-05 | Roadmap: Fase 6E Jurnal Siklus (perjalanan tanaman dari awal sampai panen): latar, prinsip, rancangan data, 8 tahap, definisi selesai, 8 keputusan terbuka, risiko; tanpa perubahan kode |
| 0.1.087 | 2026-11-05 | Fase 6E Tahap 0: rancangan Jurnal Siklus (docs/JURNAL.md: istilah, aturan, skema `jurnal`, tahap pertumbuhan bawaan per komoditas, linimasa), wireframe HP dan desktop; tanpa perubahan kode |
| 0.1.089 | 2026-11-06 | Fase 6E Tahap 2: Linimasa siklus (halaman Jurnal siklus `#jurnal-<id>`, jurnal + peristiwa turunan mulai/selesai/transaksi/panen, hari ke-N dan minggu ke-N, saringan, urutan, 100 baris bertahap, panel ringkasan di desktop, cetak polos) dan riwayat kegiatan otomatis saat jadwal ditandai selesai (Urungkan ikut menghapus) |
| 0.1.090 | 2026-11-06 | Fase 6E Tahap 3 (sebagian): tahap pertumbuhan bawaan, bilah tahap, saran, Catat tahap |
| 0.1.091 | 2026-11-06 | Fase 6E Tahap 3 selesai: ganti nama tahap, tahap di Agenda, pengingat jurnal di Setelan |
| 0.1.092 | 2026-11-06 | Fase 6E Tahap 4: foto jurnal lokal (1–4 per catatan, galeri linimasa, penampil layar penuh, penanda hilang, penyimpanan tetap); `rapikan()` mengenali foto jurnal |
| 0.1.093 | 2026-11-06 | Fase 6E Tahap 5: kejadian dan ukuran, grafik pertumbuhan, uang pada tanggal yang sama |
| 0.1.094 | 2026-11-07 | Fase 6E Tahap 6 (sebagian): cadangan dan pemulihan foto ZIP, peringatan foto belum dicadangkan |
| 0.1.095 | 2026-11-07 | Fase 6E Tahap 6 (sebagian): lembar Jurnal Excel diperbarui (jenis, rincian, nilai ukuran) dan CSV jurnal |
| 0.1.096 | 2026-11-07 | Perbaikan: dropdown Jenis di modal Tambah/Ubah unit memakai dropdown kustom |
| 0.1.088 | 2026-11-05 | Fase 6E Tahap 1: catatan jurnal teks per siklus (modul `js/jurnal.js`, koleksi `jurnal`, Catat jurnal lewat FAB, detail Ubah/Hapus + Urungkan, Evaluasi di siklus selesai, lembar Excel Jurnal, data contoh) (docs/JURNAL.md, docs/SIKLUS.md) |
| 0.1.077 | 2026-11-05 | Rute web: alamat #nama per halaman, buka langsung dan muat ulang, pintasan PWA Catat modal/hasil (docs/RUTE.md) |
| 0.1.076 | 2026-11-05 | Konsistensi modal: Panduan dan foto nota memakai mesin Modal, fokus awal modal, teks pesan diseragamkan (docs/MODAL.md, docs/STYLE.md) |
| 0.1.075 | 2026-11-05 | Cetak laporan: satu dokumen untuk ketiga tab sekaligus (Ringkasan, Grafik, Rincian) |
| 0.1.074 | 2026-11-05 | Cetak laporan polos: kop, tabel Rincian satu halaman lanskap, grafik hitam-putih, tanpa simulasi, tidak terpengaruh tema/kaca, nomor halaman, konfirmasi saat Tersembunyi (docs/LAPORAN.md) |
| 0.1.016 | 2026-11-03 | index.html menjadi versi satu berkas (aman dibuka dari HP); templat pindah ke index.dev.html |
| 0.1.017 | 2026-11-03 | Hero ringkasan (untung, modal, hasil, R/C) hanya tampil di Beranda |
| 0.1.018 | 2026-11-03 | Beranda: aksi cepat, perlu perhatian, banding bulan lalu, posisi kas; cache transaksi; font tidak memblokir |
| 0.1.019 | 2026-11-03 | Fase 6 bagian 1: cadangan otomatis + pemulihan, dasar PWA (manifest, service worker, ikon) |
| 0.1.020 | 2026-11-03 | FAB mengikuti halaman aktif (docs/FAB.md); aksi cepat di Beranda dihapus |
| 0.1.021 | 2026-11-03 | Beranda: grafik tren, untung per bulan, donat komposisi modal, untung per komoditas, modal vs anggaran |
| 0.1.022 | 2026-11-03 | Data contoh realistis terisi otomatis saat pertama dibuka (docs/CONTOH.md); hapus/isi dari Beranda dan Setelan |
| 0.1.023 | 2026-11-04 | Fase 6 bagian 2: sinkron cloud Supabase opsional (login, gabung per entri, otomatis, timpa/ambil/hapus cloud; docs/SINKRON.md) |
| 0.1.024 | 2026-11-04 | Fase 6B: FAB sembunyi saat gulir, target ketuk 40 px, filter Transaksi ringkas + pencarian, Beranda ringkas dan grafik terlipat, bilah anggaran di Siklus, Setelan terlipat, indikator sinkron |
| 0.1.025 | 2026-11-04 | Kartu hero di Beranda: untung bulan ini, selisih vs bulan lalu, garis tren 6 bulan, modal/hasil/R/C |
| 0.1.026 | 2026-11-04 | Judul halaman aktif selain Beranda, tombol induk untuk halaman turunan, judul tab browser |
| 0.1.027 | 2026-11-04 | Duplikat transaksi dari form Ubah; Laporan: bulan ini vs rata-rata 3 bulan |
| 0.1.028 | 2026-11-04 | Perkiraan panen di kartu siklus, urutan panen terdekat, pengingat di Beranda |
| 0.1.029 | 2026-11-04 | Simulasi harga jual/biaya di Laporan (analisa sensitivitas) |
| 0.1.030 | 2026-11-04 | Template komoditas (isi cepat) dan saran alokasi anggaran per kategori |
| 0.1.031 | 2026-11-04 | Laporan dibagi sub-tab Ringkasan/Grafik/Rincian; tombol cetak dan ekspor di atas |
| 0.1.032 | 2026-11-04 | Geser baris transaksi ke kiri untuk hapus, dengan Urungkan |
| 0.1.033 | 2026-11-04 | Tab Laporan bergaya map (menyatu dengan panel); tombol Cetak dan Excel berikon di atas tab |
| 0.1.035 | 2026-11-04 | Audit seluruh halaman; perbaikan impor yang merusak data, keyboard, format R/C, tabel, target ketuk (docs/AUDIT.md) |
| 0.1.036 | 2026-11-04 | Tindak lanjut catatan audit: Tersembunyi di semua halaman, saldo awal kas, HPP/harga rata-rata, input rupiah, anggaran berformat, rentang tanggal terbalik (docs/AUDIT.md) |
| 0.1.037 | 2026-11-04 | Fase 6C: foto nota/bukti transaksi (lokal, IndexedDB), ikon di baris transaksi, pembersihan otomatis (docs/NOTA.md) |
| 0.1.038 | 2026-11-04 | Fase 7: daftar Transaksi bertahap (6.000 baris: 132 → 14 ms), aria-current, tautan lewati, pengumuman halaman, panah di tab Laporan, kurangi gerakan |
| 0.1.039 | 2026-11-04 | Optimalisasi CRUD siklus, unit, komoditas: ubah, arsip, Urungkan, ulangi siklus, tanggal selesai, validasi (docs/SIKLUS.md) |
| 0.1.040 | 2026-11-04 | Detail unit dan komoditas dalam modal dengan tombol aksi (docs/SIKLUS.md) |
| 0.1.041 | 2026-11-04 | Menu baru Unit: halaman khusus unit dan komoditas dengan tab dan FAB |
| 0.1.042 | 2026-11-04 | Optimasi Siklus (saringan unit/komoditas, ringkasan, tautan modal) dan Lainnya |
| 0.1.043 | 2026-11-04 | Form tambah/ubah unit dan komoditas dalam modal, dibuka lewat FAB |
| 0.1.044 | 2026-11-04 | FAB halaman Unit menjadi pilihan melayang: Tambah unit / Tambah komoditas |
| 0.1.045 | 2026-11-04 | Tombol Siklus baru dihapus dari modal detail unit dan komoditas |
| 0.1.046 | 2026-11-04 | Tombol Siklus baru dihapus dari halaman Siklus (cukup lewat FAB) |
| 0.1.047 | 2026-11-04 | Kartu "Perlu perhatian" di Beranda bisa diketuk: ke detail siklus (panen, anggaran) atau Rencana → Utang/piutang |
| 0.1.048 | 2026-11-04 | Tahap 1 pembayaran utang/piutang: pilihan Tunai/Belum dibayar/Sebagian di Catat modal, hasil, panen; kas dari uang yang bergerak (docs/UTANG.md) |
| 0.1.049 | 2026-11-04 | Tahap 2 pembayaran utang/piutang: tombol Bayar/Terima bayar, cicilan, tanggal bayar, lunas otomatis, riwayat pembayaran + Urungkan (docs/UTANG.md) |
| 0.1.050 | 2026-11-04 | Catat panen vs Catat hasil: peringatan hasil ganda, tombol Catat sebagai panen, pengingat panen belum dijual (docs/SIKLUS.md) |
| 0.1.051 | 2026-11-04 | Jadwal kegiatan per siklus (pupuk, semprot, dsb.) dengan pengingat di Beranda (docs/JADWAL.md) |
| 0.1.052 | 2026-11-04 | Katalog harga pasar manual per komoditas dan pembanding dengan harga jual (docs/HARGA.md) |
| 0.1.053 | 2026-11-04 | Kalkulator kelayakan usaha: NPV, IRR, balik modal, PI (docs/KELAYAKAN.md) |
| 0.1.054 | 2026-11-04 | Ekspor Excel (.xlsx) multi-lembar tanpa pustaka luar: Siklus (rumus), Transaksi, Panen, Utang, Aset, Harga pasar, Jadwal (docs/EKSPOR.md) |
| 0.1.055 | 2026-11-04 | Semua isian Rencana keuangan (anggaran, saldo awal, aset, utang/piutang, harga pasar) lewat modal dari tombol +; isian di halaman dihapus (docs/FAB.md, docs/RENCANA.md) |
| 0.1.056 | 2026-11-04 | Rencana keuangan: kartu ringkasan, sub-tab satu baris bisa digeser, Ubah dan Urungkan untuk aset dan utang manual (docs/RENCANA.md) |
| 0.1.097 | 2026-11-07 | Ganti nama menjadi Buku Kebun (tagline Manajemen pertanian); data dan kunci penyimpanan tidak berubah |
| 0.1.098 | 2026-11-07 | Label versi hanya di Setelan → Tentang (header hanya tagline) |
| 0.1.099 | 2026-11-07 | Perbaikan kartu hero Beranda: angka tidak putus di layar sempit, margin ekstrem, selisih bulan lalu, label sparkline, aksesibilitas, hitung hanya saat terlihat (docs/HERO.md) |
| 0.1.100 | 2026-11-07 | Jurnal Tahap 7 (sebagian): Catat cepat — chip satu ketukan per jenis komoditas di detail siklus dan linimasa, toast dengan Urungkan dan Tambah detail, tawaran Tambah catatan setelah jadwal selesai; toast bisa memuat dua tombol dan tidak lagi menyempit |
| 0.1.101 | 2026-11-07 | Keamanan data multi-tab: gabung 3 arah per entri bila tab/PWA lain menyimpan, pembaruan langsung lewat storage event, penggantian sengaja (impor, pulihkan, hapus semua, ambil dari cloud) tidak digabung; toast bertumpuk |
| 0.1.102 | 2026-11-07 | Impor data dengan pratinjau dan toast: JSON (ganti data), CSV (tambah transaksi, deteksi baris kembar), ZIP foto; Urungkan untuk JSON dan CSV (docs/IMPOR.md) |
| 0.1.103 | 2026-11-08 | Fase 6E Tahap 6 selesai: laporan perjalanan siklus (cetak polos, foto opsional) dari detail siklus; pengalaman lintas siklus di detail komoditas (panen pertama rata-rata hari ke-N, lama tiap tahap, tombol memakai sebagai umur panen) |
| 0.1.104 | 2026-11-08 | Fase 6E Tahap 7 (sebagian): chip Jurnal di tab Siklus, umpan lintas siklus dengan pencarian dan saringan jenis; rute `#siklus-jurnal` |
| 0.1.105 | 2026-11-08 | Fase 7 / Jurnal Tahap 7 (sebagian): performa 1.000+ entri diukur, audit aksesibilitas dan uji keyboard, `aria-pressed` untuk tombol pilihan (js/aksesibel.js, docs/AUDIT.md) |
| 0.1.106 | 2026-11-08 | Konfigurasi Supabase bawaan: alamat proyek dan kunci publishable terisi di Setelan → Sinkron cloud (docs/SINKRON.md) |
| 0.1.107 | 2026-11-08 | Fase 6F Tahap 1: Layar Akun (Masuk, Buat akun), label status di header, kartu Akun dan sinkron, pesan galat Indonesia (docs/AKUN.md) |
| 0.1.108 | 2026-11-08 | Sinkron otomatis memakai saklar (toggle) yang terlihat jelas di efek kaca |
| 0.1.109 | 2026-11-08 | Efek kaca dan Angka untung saat dibuka diganti saklar; pilihan dua tombol non-nyala/mati tetap |
| 0.1.110 | 2026-11-08 | Butir kecil: hero (selisih periode setara, notasi miliar/triliun, penjelasan R/C, uji tangkapan layar), angka sejajar, PWA di HTTPS dan HP dicentang (docs/HERO.md, tools/uji-hero.py) |
| 0.1.111 | 2026-11-08 | Cetak laporan diperbarui: bab Rincian tidak lagi terpotong di kertas (dua tabel potret, kolom Margin baru, halaman lanskap dihapus), kartu angka di Ringkasan, label grafik terbaca, aliran halaman rapat; diuji 44 pemeriksaan PDF |
| 0.1.112 | 2026-11-09 | Tahap 7B (butir kecil): cetak Jurnal tanpa halaman kosong, kop linimasa lengkap, teks kejadian tidak ganda, urutan entri tetap; sisa P3, P5, P6, P9, P10 |
| 0.1.113 | 2026-11-09 | Tahap 7B: cetak linimasa mengikuti saringan dan urutan layar dengan pemisah Minggu ke-N dan baris Saringan di kop; cetak umpan Jurnal lintas siklus; sisa P6 dan P10 |
| 0.1.114 | 2026-11-09 | Tahap 7B: tombol Dengan foto di linimasa (foto kecil di cetakan, mengikuti saringan); sisa hanya P10 (uji perangkat nyata) |
| 0.1.115 | 2026-11-09 | Tahap 7: linimasa master–detail di desktop (panel detail catatan di kiri) dan pintasan J (Catat jurnal), Esc menutup panel |
| 0.1.116 | 2026-11-09 | Chip terpilih jelas saat Efek kaca di mode terang (latar aksen, bingkai ganda, teks tebal) |
| 0.1.117 | 2026-11-09 | Audit dan perapian CSS: hover khusus perangkat hover, mode kontras tinggi, kode mati dihapus, token z-index, alat tools/audit-css.py dan tools/tangkapan.py (docs/AUDIT-CSS.md) |
| 0.1.118 | 2026-11-10 | Desktop Tahap 1: pintasan keyboard (N, /, G+huruf, ?, ,), teks grafik dibatasi, tren 12 bulan bawaan di layar lebar |
| 0.1.119 | 2026-11-10 | Desktop Tahap 2: Transaksi sebagai tabel (urut per kolom, header lengket, keyboard) di layar ≥1100 px |
| 0.1.120 | 2026-11-10 | Desktop Tahap 2: pilih banyak, hapus massal (Urungkan), ikon hapus per baris di tabel Transaksi |
| 0.1.121 | 2026-11-10 | Desktop Tahap 2: master–detail Transaksi (formulir catat/ubah di panel kanan, penjaga perubahan, Esc) |
| 0.1.122 | 2026-11-10 | Cetak langsung halaman Transaksi: tabel A4, semua baris, keterangan filter, judul kolom berulang |
| 0.1.123 | 2026-11-10 | Latar kaca dedaunan tropis (monstera, palem, pisang, pakis, kamboja) menggantikan bentuk geometri |
| 0.1.124 | 2026-11-13 | Kontras dari audit CSS: aksen Emas terang lebih gelap, token --line-strong untuk batas kolom isian, hapus properti usang |
| 0.1.125 | 2026-11-13 | Fase 6G Tahap 1: label tombol tema dinamis, tanggal di Beranda, chip sinkron berdenyut, header HP lebih rendah (125→107 px) |
| 0.1.126 | 2026-11-13 | Fase 6G Tahap 2: bilah ringkas saat gulir ke atas (kembali, judul, status sinkron, Setelan) di HP dan tablet <1100 px |
| 0.1.127 | 2026-11-15 | Optimasi Beranda: pembanding periode setara konsisten antara hero dan kartu Dibanding, Siklus berjalan naik di HP, nilai Rp tidak putus baris |
| 0.1.128 | 2026-11-15 | Beranda: Perlu perhatian jadi pita di atas hero (desktop) dan diurutkan menurut kedesakan; Dibanding dan Posisi kas digabung jadi Ringkasan uang |
| 0.1.129 | 2026-11-15 | Beranda: ikon SVG Perlu perhatian, kata naik/turun di Ringkasan uang, banner Data contoh lebih ringkas |
| 0.1.130 | 2026-11-15 | Beranda desktop: kartu Siklus berjalan mengisi lebar penuh |
| 0.1.131 | 2026-11-15 | Banner Data contoh satu baris di HP |
| 0.1.132 | 2026-11-15 | Titik perlu perhatian (merah/emas) pada ikon Beranda di bilah bawah HP |
| 0.1.133 | 2026-11-15 | Pencarian cepat di header (siklus, transaksi, jurnal), pintasan `/`, kata kunci terakhir (docs/CARI.md) |
| 0.1.134 | 2026-11-15 | Pencarian cepat mencakup panen, utang/piutang, aset, dan harga pasar |
| 0.1.135 | 2026-11-15 | Pencarian cepat mencakup Unit & komoditas; angka berformat (552.500) cocok dengan nominal |
| 0.1.136 | 2026-11-15 | Pencarian cepat menoleransi salah ketik (hanya bila hasil persis kosong) |
| 0.1.137 | 2026-11-15 | Pencarian cepat mencakup jadwal kegiatan |
| 0.1.138 | 2026-11-15 | Sparkline hero interaktif: titik bulan ini, ketuk/geser/keyboard, label bulan di HP (docs/HERO.md) |
| 0.1.139 | 2026-11-15 | Perbaikan: tombol mata hero bekerja juga saat setelan Angka untung = Tampil (docs/HERO.md, docs/SETELAN.md) |
| 0.1.140 | 2026-11-15 | Perbaikan sparkline hero: tanpa kotak fokus saat ditap, titik tepat di garis pada Ukuran tampilan selain 100% (docs/HERO.md) |
| 0.1.141 | 2026-11-15 | Angka utama hero mengikuti bulan yang disentuh di sparkline, tanpa petunjuk melayang (docs/HERO.md) |
| 0.1.142 | 2026-11-15 | Cache agregat bulanan bersama untuk hero, Beranda, dan Laporan; `tools/uji-agregat.py` (docs/HERO.md) |
| 0.1.161 | 2026-11-15 | Roadmap: Fase 6H Halaman Profil (usulan, belum dikerjakan) |
| 0.1.162 | 2026-11-16 | Fase 6H: halaman Profil (`#profil`), nama usaha dan lokasi, ringkasan usaha, akun dan cadangan, nama usaha di kop cetak dan Excel |
| 0.1.163 | 2026-11-16 | Akun dan sinkron dipindah dari Setelan ke halaman Profil |
| 0.1.164 | 2026-11-16 | Nama, foto, nama usaha, dan lokasi ikut cadangan, ekspor, impor, dan sinkron |
| 0.1.165 | 2026-11-16 | Hapus duplikat Profil dan Setelan (Setelan dipertahankan); waktu cadangan manual pindah ke Setelan → Data |
| 0.1.166 | 2026-11-16 | Hanya dokumen: roadmap Fase 6H disinkronkan dengan v0.1.165 |
| 0.1.175 | 2026-11-16 | Kategori Gaji Pemilik dengan isian Penerima (Saya/Istri) |
| 0.1.176 | 2026-11-16 | Dropdown Penerima memakai gaya dropdown kustom |
| 0.1.177 | 2026-11-16 | Isian Penerima dihapus; penerima ditulis di Catatan, kategori Gaji Pemilik tetap |
| 0.1.178 | 2026-11-16 | Laporan: periode bebas, biaya tetap vs variabel, untung sebelum dan sesudah gaji pemilik (docs/LAPORAN.md) |
| 0.1.179 | 2026-11-16 | Laporan: Sorotan periode (transaksi terbesar, kategori tersering, hari tersibuk, rata-rata) |
| 0.1.180 | 2026-11-16 | Hanya dokumen: roadmap Fase 6I |
| 0.1.181 | 2026-11-16 | Laporan: banding dengan periode sebelumnya, bulan terbaik dan terburuk, rata-rata modal per hari |
| 0.1.182 | 2026-11-16 | Laporan: pembanding periode berjalan yang adil, HPP/BEP tanpa gaji pemilik (opsional), perbaikan cetak dan Excel |
| 0.1.183 | 2026-11-16 | Hanya dokumen: butir opsional blok "Dibuat oleh / Mengetahui" dihapus dari roadmap |
| 0.1.184 | 2026-11-16 | Laporan: penyusutan aset, untung dengan alat disusutkan, efisiensi (untung per hari dan per luas) |
| 0.1.185 | 2026-11-16 | Cetak laporan: angka dan tanggal rata kanan, kolom tabel Sorotan lurus |
| 0.1.186 | 2026-11-16 | Cetak Jurnal Siklus dan Perjalanan Siklus: kolom Hari dan Ukuran rata kanan |
| 0.1.187 | 2026-11-16 | Cetak Perjalanan Siklus dirapikan: kartu ringkasan, kolom tetap, margin tabel lurus |
| 0.1.188 | 2026-11-17 | Hanya dokumen: Supabase dan HTTPS dikonfirmasi jalan; tinjauan usulan fitur |
| 0.1.189 | 2026-11-17 | Hanya dokumen: usulan fitur tambahan (stok saprodi, upah harian, buku pembeli, prive, target musim, dan lainnya) masuk backlog |
| 0.1.190 | 2026-11-17 | Upah harian / HOK: sub-tab Upah di Rencana, pekerja, catat upah (tunai/belum dibayar), lembar Excel Upah (docs/UPAH.md) |
| 0.1.191 | 2026-11-17 | Stok saprodi: sub-tab Stok di Rencana, beli/pakai/koreksi, peringatan menipis di Beranda, lembar Excel Stok dan Mutasi stok (docs/STOK.md) |
| 0.1.192 | 2026-11-17 | Prive: kategori yang mengurangi kas tapi bukan biaya usaha, baris Prive di Laporan; perbaikan panel Catat transaksi desktop (docs/PRIVE.md) |
| 0.1.193 | 2026-11-18 | Buku pembeli: sub-tab Pembeli di Rencana, penjualan, rata-rata harga, piutang, ganti nama dan gabung, saran nama di form panen, lembar Excel Pembeli (docs/PEMBELI.md) |
| 0.1.194 | 2026-11-18 | Perbaikan halaman Rencana keuangan: bilah bagian satu baris yang bisa digeser (sebelumnya pecah 3 baris di HP), penanda geser, aria-pressed (docs/RENCANA.md) |
