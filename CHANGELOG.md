# Changelog

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
