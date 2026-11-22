# Buku Kebun — Manajemen Pertanian

Web app untuk mencatat dan menganalisa usaha tani rumahan: keuangan, jurnal siklus dengan foto, jadwal kegiatan, harga pasar, dan kelayakan usaha. Dulu bernama Tani Keuangan.

**Versi saat ini: v0.1.199.** Riwayat lengkap ada di [CHANGELOG.md](CHANGELOG.md), rencana pengembangan di [roadmap.md](roadmap.md).

## Fitur

| Bidang | Isi |
|---|---|
| Beranda | Sapaan dan profil, kartu hero dengan tren, Perlu perhatian, kas, banding bulan lalu |
| Transaksi | Catat modal dan hasil lewat tombol + (FAB), kategori, filter, foto nota, geser untuk hapus, pembayaran tunai, belum dibayar, atau sebagian |
| Siklus | Unit, komoditas, siklus tanam, panen, tahap pertumbuhan, jurnal dengan foto, kejadian, linimasa, dan laporan perjalanan |
| Jadwal | Kegiatan per siklus (pupuk, semprot, dan sebagainya) sekali atau berulang, dengan pengingat |
| Laporan | Laba-rugi, R/C, HPP, titik impas (BEP), harga jual minimum, penyusutan aset, untung per hari dan per luas, cetak, dan ekspor Excel |
| Rencana | Anggaran, arus kas, aset, utang dan piutang, upah harian (pekerja, hari kerja, upah belum dibayar), stok saprodi (sisa, peringatan menipis), buku pembeli (penjualan, rata-rata harga, piutang per pembeli) |
| Harga dan kelayakan | Katalog harga pasar (input manual) dan kalkulator NPV, IRR, balik modal |
| Profil | Nama, foto, nama usaha, lokasi, ringkasan usaha, dan Akun dan sinkron |
| Setelan | Tampilan (mode, skema warna, efek kaca, ukuran), preferensi, ekspor dan impor, cadangan, Tentang |
| Lainnya | Pencarian cepat, pintasan keyboard, layout desktop, rute `#halaman`, PWA, dan sinkron cloud Supabase (opsional) |

Data disimpan di browser (`localStorage`, foto di IndexedDB) sehingga bisa dipakai luring. Cadangan yang bisa dipulihkan berupa JSON; Excel (.xlsx) untuk analisis. Foto nota dan jurnal tidak ikut JSON, jadi cadangkan terpisah ke ZIP lewat Setelan.

## Menjalankan

- **Di HP:** buka `index.html` atau `buku-kebun.html`. Keduanya satu berkas (CSS dan JS tertanam), tanpa folder.
- **Luring dan pasang sebagai aplikasi (PWA):** sajikan lewat http atau https; service worker (`sw.js`) tidak berjalan dari `file://` atau `content://`.
- **Mengembangkan:** ubah berkas di `css/` dan `js/`, lalu jalankan `python3 bangun-mandiri.py` untuk menulis ulang `index.html` dan `buku-kebun.html`. `index.dev.html` memuat `css/` dan `js/` secara terpisah dan hanya untuk pengembangan.

## Struktur Folder

```
buku-kebun/
├── README.md, CHANGELOG.md, roadmap.md, VERSION
├── index.html, buku-kebun.html   Versi satu berkas (hasil build, isi sama)
├── index.dev.html                Templat pengembangan
├── bangun-mandiri.py             Pembuat versi satu berkas
├── manifest.webmanifest, sw.js   PWA dan service worker
├── icon-192.png, icon-512.png    Ikon aplikasi
├── css/style.css                 Gaya (mobile-first, efek kaca, desktop)
├── js/                           Kode aplikasi (lihat tabel)
├── data/seed-kategori.json       Kategori bawaan
├── docs/                         Dokumentasi per fitur (lihat tabel)
└── tools/                        Skrip uji dan audit
```

### `js/`

| Kelompok | Berkas |
|---|---|
| Inti | `app.js` (transaksi, kategori, filter, CSV), `rute.js`, `modal.js`, `form.js`, `fab.js`, `geser.js`, `desktop.js`, `ringkas.js`, `aksesibel.js` |
| Beranda dan profil | `beranda.js`, `spark.js`, `profil.js`, `cari.js` |
| Siklus dan jurnal | `siklus.js`, `dlgsiklus.js`, `jurnal.js`, `cepat.js`, `tahap.js`, `kejadian.js`, `linimasa.js`, `perjalanan.js`, `pengalaman.js`, `umpan.js`, `foto.js`, `jadwal.js` |
| Keuangan | `rencana.js`, `utang.js`, `upah.js`, `stok.js`, `pembeli.js`, `analisa.js`, `harga.js`, `kelayakan.js`, `nota.js` |
| Data | `setelan.js`, `impor.js`, `xlsx.js`, `cadangan.js`, `cadanganfoto.js`, `sinkron.js`, `contoh.js` |
| Lain | `panduan.js`, `pwa.js` |

### `docs/`

| Topik | Berkas |
|---|---|
| Rancangan | `SPEC.md`, `WIREFRAME.md`, `DATA-SCHEMA.md`, `STYLE.md`, `RUTE.md`, `MODAL.md` |
| Pengguna | `PANDUAN.md`, `SETELAN.md`, `PROFIL.md`, `CARI.md`, `HERO.md`, `FAB.md`, `DESKTOP.md` |
| Pencatatan | `TRANSAKSI.md`, `UTANG.md`, `UPAH.md`, `STOK.md`, `PEMBELI.md`, `PRIVE.md`, `NOTA.md`, `CONTOH.md`, `SIKLUS.md`, `JURNAL.md`, `JADWAL.md` |
| Analisa | `LAPORAN.md`, `RENCANA.md`, `HARGA.md`, `KELAYAKAN.md`, `EKSPOR.md` |
| Data | `CADANGAN.md`, `IMPOR.md`, `SINKRON.md`, `AKUN.md`, `MULTITAB.md` |
| Audit | `AUDIT.md`, `AUDIT-CSS.md` |

### `tools/`

Skrip Python untuk pemeriksaan manual; semuanya dijalankan dari folder proyek.

| Skrip | Fungsi |
|---|---|
| `uji-profil.py` | Uji halaman Profil dan menu avatar (HP 390 px dan desktop 1440 px) |
| `uji-hero.py` | Uji kartu hero Beranda |
| `uji-prive.py` | Uji Prive (kas turun, untung/HPP/siklus tetap, Laporan, CSV, Excel, ubah kategori) di HP dan desktop |
| `uji-stok.py` | Uji fitur Stok saprodi (barang, beli, pakai, koreksi, peringatan Beranda, Excel) di HP dan desktop |
| `uji-pembeli.py` | Uji Buku pembeli (pengelompokan nama, rata-rata harga, piutang, ganti nama dan gabung, Excel) di HP dan desktop |
| `uji-upah.py` | Uji fitur Upah harian (pekerja, catat, bayar, ubah, hapus, Excel) di HP 390 px dan desktop 1440 px |
| `uji-agregat.py` | Uji hitungan agregat bulanan |
| `audit-css.py` | Audit statis CSS (tanpa dependensi) |
| `tangkapan.py` | Tangkapan layar pembanding sebelum dan sesudah perubahan CSS |

Skrip uji peramban membutuhkan `pip install playwright && playwright install chromium`.

## Aturan Versi

Format `v0.1.NNN`; angka belakang naik setiap ada perubahan atau perbaikan. Setiap rilis menyertakan:

1. entri di `CHANGELOG.md` dan pembaruan `docs/` yang terkait;
2. **full zip** (paket lengkap) dan **update zip** (hanya berkas yang berubah), dinamai `buku-kebun-v0_1_NNN-full.zip` dan `-update.zip`;
3. nomor versi yang sama di `VERSION`, `VERSI` pada `js/app.js`, dan `sw.js` (agar cache luring diperbarui), lalu build ulang dengan `python3 bangun-mandiri.py`.
