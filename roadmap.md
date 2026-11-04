# Roadmap — Web App Keuangan Pertanian Rumahan

> Status dokumen: draf v0.1 · Terakhir diperbarui: 4 November 2026 · Fase 5 selesai; Fase 6 berjalan: cadangan otomatis + dasar PWA; FAB kontekstual; chart di Beranda; data contoh otomatis; sinkron Supabase (v0.1.023); penyempurnaan UX (v0.1.024); kartu hero Beranda (v0.1.025); judul halaman (v0.1.026)

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
- [ ] PWA: bisa dipasang di HP dan jalan offline — sebagian: manifest, service worker, ikon, tombol pasang sudah ada (v0.1.019); centang setelah diuji di hosting HTTPS dan di HP
- [ ] Login & sinkron Supabase (opsional) — sebagian: login, gabung per entri, sinkron otomatis, timpa/ambil/hapus cloud sudah ada dan lolos uji server tiruan (v0.1.023, docs/SINKRON.md); centang setelah diuji di proyek Supabase sungguhan
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
- [ ] Foto nota/bukti transaksi (lokal dulu)
- **Hasil:** pengguna baru membuat siklus dalam satu ketukan dan bisa menguji skenario harga

### Fase 7 — Rilis v1.0 (Minggu 17–18)
- [ ] Pengujian dengan data nyata (minimal 1–2 siklus)
- [ ] Perbaikan UX berdasarkan umpan balik
- [x] Dokumentasi pengguna & panduan cepat (termasuk panduan cepat 3–4 layar di dalam aplikasi saat pertama dibuka) — panduan 4 layar (js/panduan.js) dan docs/PANDUAN.md (v0.1.034); belum diuji di HP sungguhan
- [ ] Optimasi performa dan aksesibilitas
- **Hasil:** rilis stabil

## 7. Ide Lanjutan (Backlog)

- Template komoditas (sayur daun, cabai, tomat, lele, ayam petelur) dengan estimasi biaya standar
- Analisa sensitivitas: "bagaimana jika harga jual turun 10%?"
- Kalender tanam + pengingat jadwal pupuk/panen
- Pencatatan cuaca/hasil per kondisi untuk korelasi
- Katalog harga pasar (input manual) dan pembanding harga
- Kalkulator kelayakan usaha (NPV, IRR sederhana)
- Integrasi Google Sheets / ekspor ke template Excel
- Foto nota/bukti transaksi
- Mode multi-bahasa

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

## 10. Pertanyaan Terbuka

1. Jenis usaha apa yang jadi fokus awal — sayuran, hidroponik, perikanan, ternak, atau campuran?
2. Siapa pengguna utama — pribadi, atau kelompok/komunitas?
3. Apakah perlu multi-pengguna dan login sejak awal, atau cukup lokal dulu?
4. Mata uang dan satuan: Rupiah saja? Satuan khusus (ikat, karung, butir)?
5. Apakah perlu laporan format tertentu (misalnya untuk pengajuan KUR atau dana desa)?

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
