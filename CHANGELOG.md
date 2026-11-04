# Changelog

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
