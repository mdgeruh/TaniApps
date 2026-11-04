# Tani Keuangan — Keuangan Pertanian Rumahan

Web app untuk mencatat dan menganalisa keuangan pertanian rumahan.
Versi saat ini: **v0.1.036** (tindak lanjut catatan audit: Tersembunyi di semua halaman, saldo awal kas, HPP dan harga rata-rata lebih tepat, input rupiah aman; di atas audit dan perbaikan anomali; di atas panduan cepat 4 layar saat pertama dibuka, panduan pengguna, dan pemulihan sw.js; di atas tab Laporan bergaya map + tombol ikon; di atas geser untuk hapus transaksi; di atas Laporan dengan sub-tab; di atas template komoditas; di atas simulasi harga/biaya di Laporan; di atas pengingat perkiraan panen; di atas duplikat transaksi dan perbandingan 3 bulan di Laporan; di atas judul halaman aktif; di atas kartu hero di Beranda; di atas penyempurnaan UX: FAB sembunyi saat gulir, filter Transaksi ringkas + pencarian, bagian terlipat; di atas sinkron cloud Supabase opsional; di atas data contoh otomatis; di atas chart di Beranda; di atas FAB kontekstual per halaman; di atas Fase 6 bagian 1: cadangan otomatis dan dasar PWA; di atas Fase 5: rencana keuangan — anggaran, arus kas, aset, utang/piutang; di atas grafik tren garis halus di dashboard; di atas Fase 4: dashboard, cetak/PDF, Excel; di atas Fase 3: tab Laporan — laba-rugi, R/C, HPP, BEP, harga minimum; di atas perbaikan tampil di HP — versi satu berkas `tani-keuangan.html` dan penyimpanan cadangan; di atas form kustom, Fase 2, Fase 1, dan efek kaca).

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
├── js/panduan.js        Panduan cepat 4 layar (tampil sekali saat pertama dibuka)
├── js/analisa.js        Laporan, dashboard, cetak, Excel
├── js/contoh.js         Data contoh realistis (isi otomatis saat pertama dibuka)
├── js/fab.js            Tombol + (FAB) yang menyesuaikan halaman aktif
├── js/cadangan.js       Cadangan otomatis dan pemulihan
├── js/sinkron.js        Sinkron cloud Supabase (opsional)
├── js/pwa.js            Pendaftaran service worker, tombol pasang
├── js/rencana.js        Anggaran, arus kas, aset, utang/piutang
├── js/siklus.js         Unit, komoditas, siklus, panen
├── js/form.js           Dropdown dan pemilih tanggal kustom
├── js/setelan.js        Halaman Setelan (tema, preferensi, data)
├── data/
│   └── seed-kategori.json   Kategori bawaan
└── docs/
    ├── SPEC.md          Spesifikasi & lingkup MVP, rumus analisa
    ├── PANDUAN.md       Panduan pengguna
    ├── SETELAN.md       Daftar setelan dan perilakunya
    ├── TRANSAKSI.md     Alur pencatatan, filter, kategori, format CSV
    ├── LAPORAN.md       Rumus dan cara baca laporan
    ├── RENCANA.md       Rencana keuangan (Fase 5)
    ├── CONTOH.md        Isi dan aturan data contoh
    ├── FAB.md           Perilaku FAB per halaman
    ├── SINKRON.md       Sinkron cloud Supabase (SQL, cara kerja, batasan)
    ├── CADANGAN.md      Cadangan otomatis dan PWA (Fase 6)
    ├── SIKLUS.md        Unit, komoditas, siklus, panen
    ├── STYLE.md         Panduan gaya (token warna, font, komponen)
    ├── WIREFRAME.md     Wireframe layar utama
    └── DATA-SCHEMA.md   Skema data & kunci penyimpanan
```

## Menjalankan

Di HP: buka `index.html` atau `tani-keuangan.html` (keduanya satu berkas, tanpa folder). Untuk mengembangkan: ubah `css/` dan `js/` lalu jalankan `python3 bangun-mandiri.py`; `index.dev.html` hanya untuk pengembangan. Setelah mengubah file di `css/` atau `js/`, jalankan `python3 bangun-mandiri.py` untuk memperbarui versi satu berkas. Tekan tombol + untuk mencatat modal atau hasil; data tersimpan di browser (localStorage). Bila dibuka lewat pengelola berkas (`content://`) localStorage diblokir: data hanya bertahan selama tab terbuka, jadi ekspor berkala atau buka lewat `file://` di Chrome. Saat pertama dibuka, aplikasi terisi data contoh; hapus lewat banner di Beranda atau Setelan → Data.

## Aturan Versi

Format `v0.1.NNN` — angka belakang naik setiap ada perubahan/perbaikan.
Setiap rilis: **full zip** (paket lengkap) + **update zip** (hanya file berubah) dan entri di `CHANGELOG.md`.
