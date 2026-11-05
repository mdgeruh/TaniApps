# Roadmap — Web App Keuangan Pertanian Rumahan

> Status dokumen: draf v0.1 · Terakhir diperbarui: 4 November 2026 · Fase 5 selesai; Fase 6 berjalan: cadangan otomatis + dasar PWA; FAB kontekstual; chart di Beranda; data contoh otomatis; sinkron Supabase (v0.1.023); penyempurnaan UX (v0.1.024); kartu hero Beranda (v0.1.025); judul halaman (v0.1.026); foto nota lokal (v0.1.037); optimasi performa/aksesibilitas bagian 1 (v0.1.038); pembayaran utang/piutang tahap 1 (v0.1.048) dan tahap 2: tombol Bayar + cicilan (v0.1.049); Catat panen vs Catat hasil (v0.1.050); jadwal kegiatan per siklus (v0.1.051); katalog harga pasar (v0.1.052); kalkulator kelayakan usaha (v0.1.053); ekspor Excel (v0.1.054); isian Rencana keuangan lewat modal FAB (v0.1.055); ringkasan, sub-tab geser, ubah aset/utang (v0.1.056); daftar anggaran dengan detail (v0.1.057); daftar aset dan utang dengan detail (v0.1.058); grafik arus kas, saringan utang, simpan & tambah lagi, tren harga (v0.1.059); Jadwal dan Panen lewat modal detail (v0.1.060); modal bersama, tombol kembali, hapus seragam (v0.1.061); detail siklus dipadatkan (v0.1.066); duplikat FAB dibersihkan (v0.1.067)

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
- [x] Foto nota/bukti transaksi (lokal dulu) — satu foto per transaksi, dikecilkan, disimpan di IndexedDB; tidak ikut ekspor/sinkron (v0.1.037, docs/NOTA.md); belum diuji di kamera HP sungguhan
- **Hasil:** pengguna baru membuat siklus dalam satu ketukan dan bisa menguji skenario harga

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
- Pencatatan cuaca/hasil per kondisi untuk korelasi
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
  - [ ] 8. Opsional: blok "Dibuat oleh / Mengetahui" untuk laporan ke pengurus atau kelompok tani (belum dikerjakan; perlu keputusan apakah bawaan atau pilihan di Setelan).
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
