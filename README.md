# Tani Keuangan — Keuangan Pertanian Rumahan

Web app untuk mencatat dan menganalisa keuangan pertanian rumahan.
Versi saat ini: **v0.1.096** (dropdown modal unit diperbaiki; di atas lembar Jurnal Excel dan CSV jurnal; di atas cadangan foto ke ZIP; di atas kejadian dan ukuran di jurnal siklus; di atas Fase 6E Tahap 4: foto jurnal lokal, galeri linimasa, penampil layar penuh; di atas Tahap 3 selesai: nama tahap, Agenda, pengingat jurnal; di atas Tahap pertumbuhan di jurnal siklus; di atas Fase 6E Tahap 2: Linimasa siklus, saringan, hari/minggu ke-N, cetak polos, riwayat kegiatan otomatis); sebelumnya **v0.1.088** (Fase 6E Tahap 1: Jurnal siklus, catatan teks per siklus dengan Catat jurnal lewat FAB, Ubah/Hapus, Evaluasi di siklus selesai, lembar Excel Jurnal; di atas Fase 6E Tahap 0: rancangan Jurnal Siklus, docs/JURNAL.md dan wireframe, tanpa perubahan kode; di atas Roadmap Fase 6E Jurnal Siklus, tanpa perubahan kode; di atas Layout desktop Tahap 0-G sebagian: cetak dan audit kompatibilitas; di atas Layout desktop Tahap 0-F: variasi tema dan kontras; di atas Layout desktop Tahap 0-C: kartu Siklus berjalan dengan progres, tren hero lebih besar; di atas Layout desktop dashboard: rail ikon kiri, header breadcrumb + pill, grid Beranda; di atas Laporan satu halaman tanpa tab; di atas pengaman navbar bawah agar tidak melebar di Chrome Android; di atas rute web: tiap halaman punya alamat #nama yang bisa dibuka langsung, dimuat ulang, dan dibagikan, plus pintasan PWA (docs/RUTE.md); di atas konsistensi modal: Panduan dan foto nota memakai mesin Modal (tombol Back menutupnya), fokus awal modal selalu masuk, teks toast diseragamkan; di atas cetak laporan satu dokumen untuk ketiga tab (Ringkasan, Grafik, Rincian) sekaligus; di atas cetak laporan polos: kop, tabel Rincian satu halaman, grafik hitam-putih; di atas kurva tren Laporan dan Beranda lebih halus; di atas efek kaca lebih ringan untuk HP: navbar dan FAB tidak lagi hilang saat digulir; di atas header dinamis: judul halaman di header; di atas Liquid Glass lebih bening + latar geometri; di atas efek kaca Liquid Glass bergaya iOS; di atas Agenda lintas siklus di tab Siklus; di atas Duplikat FAB di Unit/Komoditas dan Arus kas dihapus; di atas Detail siklus dipadatkan, tanpa tombol ganda dengan FAB; di atas Selesaikan siklus jadi modal, aturan surface edit; di atas penamaan diseragamkan; di atas gaya baris daftar disatukan; di atas riwayat Harga pasar jadi daftar + modal detail; di atas satu mesin modal bersama, tombol kembali HP terhubung ke riwayat, hapus seragam dengan Urungkan (docs/MODAL.md); di atas detail siklus: Jadwal kegiatan dan Panen jadi daftar ringkas dengan modal detail dan aksi, tambah jadwal lewat tombol + (docs/JADWAL.md, docs/SIKLUS.md); di atas Rencana keuangan: grafik arus kas dan perkiraan kas cukup berapa bulan, saringan dan lipat lunas di Utang/piutang, lipat siklus selesai di Anggaran, Simpan & tambah lagi, tren harga pasar (docs/RENCANA.md); di atas Aset dan Utang/piutang jadi daftar ringkas; ketuk untuk detail dengan tombol aksi (docs/RENCANA.md); di atas Anggaran jadi daftar ringkas; ketuk siklus untuk detail dengan tombol Ubah dan Hapus anggaran (docs/RENCANA.md); di atas Rencana keuangan: kartu ringkasan, sub-tab satu baris yang bisa digeser, ubah dan Urungkan untuk aset dan utang manual (docs/RENCANA.md); di atas semua isian Rencana keuangan (aset, utang/piutang, harga pasar, anggaran, saldo awal kas) dipindah dari halaman ke modal yang dibuka lewat tombol + (docs/FAB.md, docs/RENCANA.md); di atas ekspor Excel (.xlsx) multi-lembar tanpa pustaka luar (docs/EKSPOR.md); di atas kalkulator kelayakan usaha: NPV, IRR, balik modal, PI (docs/KELAYAKAN.md); di atas katalog harga pasar manual dan pembanding dengan harga jualmu (docs/HARGA.md); di atas jadwal kegiatan per siklus (pupuk, semprot, dsb.) dengan pengingat di Beranda (docs/JADWAL.md); di atas penyempurnaan Catat panen vs Catat hasil: peringatan hasil ganda, tombol Catat sebagai panen, dan pengingat panen belum dijual (docs/SIKLUS.md); di atas tombol Bayar dan cicilan untuk utang/piutang dari transaksi: jumlah bebas, tanggal bayar, lunas otomatis, riwayat pembayaran bisa dihapus dengan Urungkan (docs/UTANG.md); di atas pilihan pembayaran Tunai/Belum dibayar/Sebagian di Catat modal, hasil, dan panen yang membentuk utang/piutang dan menghitung kas dari uang yang bergerak (docs/UTANG.md); di atas setiap kartu di "Perlu perhatian" bisa diketuk menuju halaman terkait; di atas tombol Siklus baru dihapus dari halaman Siklus, cukup lewat FAB; di atas tombol Siklus baru dihapus dari modal detail unit dan komoditas; di atas tombol + di halaman Unit membuka pilihan melayang Tambah unit / Tambah komoditas; di atas form tambah/ubah unit dan komoditas tampil di modal lewat tombol +; di atas optimasi halaman Siklus (saringan, ringkasan, tautan unit/komoditas) dan Lainnya (lebih ringkas, tanpa FAB); di atas menu baru Unit: halaman khusus unit dan komoditas dengan tab daftar dan tombol tambah; di atas detail unit dan komoditas tampil dalam modal dengan tombol aksi: ubah, arsipkan/pulihkan, hapus, siklus baru; di atas CRUD siklus, unit, dan komoditas dioptimalkan: ubah, arsip, Urungkan, validasi; di atas Fase 7 bagian 1: daftar Transaksi bertahap dan perbaikan aksesibilitas; di atas foto nota/bukti transaksi, disimpan lokal di IndexedDB; di atas tindak lanjut catatan audit: Tersembunyi di semua halaman, saldo awal kas, HPP dan harga rata-rata lebih tepat, input rupiah aman; di atas audit dan perbaikan anomali; di atas panduan cepat 4 layar saat pertama dibuka, panduan pengguna, dan pemulihan sw.js; di atas tab Laporan bergaya map + tombol ikon; di atas geser untuk hapus transaksi; di atas Laporan dengan sub-tab; di atas template komoditas; di atas simulasi harga/biaya di Laporan; di atas pengingat perkiraan panen; di atas duplikat transaksi dan perbandingan 3 bulan di Laporan; di atas judul halaman aktif; di atas kartu hero di Beranda; di atas penyempurnaan UX: FAB sembunyi saat gulir, filter Transaksi ringkas + pencarian, bagian terlipat; di atas sinkron cloud Supabase opsional; di atas data contoh otomatis; di atas chart di Beranda; di atas FAB kontekstual per halaman; di atas Fase 6 bagian 1: cadangan otomatis dan dasar PWA; di atas Fase 5: rencana keuangan — anggaran, arus kas, aset, utang/piutang; di atas grafik tren garis halus di dashboard; di atas Fase 4: dashboard, cetak/PDF, Excel; di atas Fase 3: tab Laporan — laba-rugi, R/C, HPP, BEP, harga minimum; di atas perbaikan tampil di HP — versi satu berkas `tani-keuangan.html` dan penyimpanan cadangan; di atas form kustom, Fase 2, Fase 1, dan efek kaca).

## Struktur Folder

```
tani-keuangan/
├── README.md            Panduan ini
├── CHANGELOG.md         Riwayat perubahan
├── VERSION              Nomor versi
├── roadmap.md           Peta jalan pengembangan
├── index.html           Versi satu berkas (hasil build), aman dibuka dari HP
├── index.dev.html       Templat pengembangan (memuat css/ dan js/)
├── tani-keuangan.html   Versi satu berkas (CSS + JS tertanam), untuk dibuka langsung di HP
├── bangun-mandiri.py    Skrip pembuat tani-keuangan.html
├── manifest.webmanifest Manifest PWA
├── sw.js                Service worker (luring, hanya via http/https)
├── icon-192.png, icon-512.png   Ikon aplikasi
├── css/style.css        Gaya dasar (mobile-first)
├── js/app.js            Aplikasi: transaksi, kategori, filter, ringkasan, CSV
├── js/beranda.js        Beranda: perlu perhatian, grafik, banding bulan lalu, kas
├── js/geser.js          Geser untuk hapus transaksi + Urungkan
├── js/nota.js           Foto nota/bukti transaksi (IndexedDB, lokal)
├── js/foto.js           Foto jurnal siklus (memakai penyimpanan Nota, penampil layar penuh)
├── js/panduan.js        Panduan cepat 4 layar (tampil sekali saat pertama dibuka)
├── js/analisa.js        Laporan, dashboard, cetak, Excel
├── js/contoh.js         Data contoh realistis (isi otomatis saat pertama dibuka)
├── js/fab.js            Tombol + (FAB) yang menyesuaikan halaman aktif
├── js/cadangan.js       Cadangan otomatis dan pemulihan
├── js/sinkron.js        Sinkron cloud Supabase (opsional)
├── js/pwa.js            Pendaftaran service worker, tombol pasang
├── js/rencana.js        Anggaran, arus kas, aset, utang/piutang
├── js/siklus.js         Unit, komoditas, siklus, panen
├── js/jadwal.js         Jadwal kegiatan per siklus dan pengingatnya
├── js/harga.js          Katalog harga pasar (manual) dan pembanding harga
├── js/kelayakan.js      Kalkulator kelayakan usaha (NPV, IRR, balik modal)
├── js/xlsx.js           Ekspor Excel (.xlsx) multi-lembar
├── js/form.js           Dropdown dan pemilih tanggal kustom
├── js/setelan.js        Halaman Setelan (tema, preferensi, data)
├── data/
│   └── seed-kategori.json   Kategori bawaan
└── docs/
    ├── SPEC.md          Spesifikasi & lingkup MVP, rumus analisa
    ├── DESKTOP.md       Layout desktop (rail kiri, grid Beranda)
    ├── PANDUAN.md       Panduan pengguna
    ├── SETELAN.md       Daftar setelan dan perilakunya
    ├── TRANSAKSI.md     Alur pencatatan, filter, kategori, format CSV
    ├── LAPORAN.md       Rumus dan cara baca laporan
    ├── RENCANA.md       Rencana keuangan (Fase 5)
    ├── CONTOH.md        Isi dan aturan data contoh
    ├── NOTA.md          Foto nota/bukti transaksi (lokal)
    ├── FAB.md           Perilaku FAB per halaman
    ├── SINKRON.md       Sinkron cloud Supabase (SQL, cara kerja, batasan)
    ├── CADANGAN.md      Cadangan otomatis dan PWA (Fase 6)
    ├── SIKLUS.md        Unit, komoditas, siklus, panen
    ├── JADWAL.md        Jadwal kegiatan per siklus (pupuk, semprot, dsb.)
    ├── HARGA.md         Katalog harga pasar dan pembanding harga
    ├── KELAYAKAN.md     Kalkulator kelayakan usaha (NPV, IRR)
    ├── EKSPOR.md        Ekspor Excel (.xlsx)
    ├── STYLE.md         Panduan gaya (token warna, font, komponen)
    ├── WIREFRAME.md     Wireframe layar utama
    └── DATA-SCHEMA.md   Skema data & kunci penyimpanan
```

## Menjalankan

Di HP: buka `index.html` atau `tani-keuangan.html` (keduanya satu berkas, tanpa folder). Untuk mengembangkan: ubah `css/` dan `js/` lalu jalankan `python3 bangun-mandiri.py`; `index.dev.html` hanya untuk pengembangan. Setelah mengubah file di `css/` atau `js/`, jalankan `python3 bangun-mandiri.py` untuk memperbarui versi satu berkas. Tekan tombol + untuk mencatat modal atau hasil; data tersimpan di browser (localStorage). Bila dibuka lewat pengelola berkas (`content://`) localStorage diblokir: data hanya bertahan selama tab terbuka, jadi ekspor berkala atau buka lewat `file://` di Chrome. Saat pertama dibuka, aplikasi terisi data contoh; hapus lewat banner di Beranda atau Setelan → Data.

## Aturan Versi

Format `v0.1.NNN` — angka belakang naik setiap ada perubahan/perbaikan.
Setiap rilis: **full zip** (paket lengkap) + **update zip** (hanya file berubah) dan entri di `CHANGELOG.md`.
