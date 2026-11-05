/* Tani Keuangan — data contoh realistis (v0.1.022). Semua entri bertanda contoh:true agar bisa dihapus tanpa menyentuh data pengguna. */
const Contoh = {
  FLAG: 'tani.contoh', minta: null,
  tgl(n) { const d = new Date(); return isoHari(new Date(d.getFullYear(), d.getMonth(), d.getDate() - n)); },
  ada() { const D = App.data; return ['unit', 'komoditas', 'siklus', 'transaksi', 'panen', 'aset', 'utang'].some((k) => (D[k] || []).some((x) => x.contoh && !x.terhapus)); },
  /* Terisi otomatis hanya saat pertama kali dibuka (belum ada data dan belum pernah diisi/dihapus) */
  otomatis() {
    if (Penyimpanan.get(KUNCI) !== null || Penyimpanan.get(this.FLAG) !== null) return false;
    this.bangun(App.data); App.simpan(); Penyimpanan.set(this.FLAG, '1'); return true;
  },
  isi() {
    if (this.ada()) { App.toast('Data contoh sudah ada'); return; }
    this.bangun(App.data); App.simpan(); Penyimpanan.set(this.FLAG, '1');
    App.go(App.tab, true); App.toast('Data contoh ditambahkan');
  },
  bangun(D) {
    const T = (n) => this.tgl(n), now = nowIso();
    const dasar = (o) => Object.assign({ dibuat: now, diubah: now, terhapus: false, contoh: true }, o);
    const unit = (nama, jenis, ukuran, sat) => { const x = dasar({ id: uid('u'), nama, jenis, ukuran, satuanUkuran: sat }); D.unit.push(x); return x; };
    const kom = (nama, satuan, umur) => { const x = dasar({ id: uid('k'), nama, satuan, umurPanenHari: umur }); D.komoditas.push(x); return x; };
    const sik = (u, k, mulai, selesai, anggaran, catatan) => { const x = dasar({ id: uid('s'), unitId: u.id, komoditasId: k.id, mulai: T(mulai), selesai: selesai ? T(selesai) : null, status: selesai ? 'selesai' : 'berjalan', catatan: catatan || '', anggaran: anggaran || 0 }); D.siklus.push(x); return x; };
    const tx = (s, n, jenis, kat, jml, cat) => { D.transaksi.push(dasar({ id: uid('t'), tanggal: T(n), jenis, kategoriId: kat, jumlah: jml, siklusId: s ? s.id : null,
      sifatBiaya: jenis === 'keluar' ? ((SEED.keluar.find((q) => q.id === kat) || {}).sifatBiaya || 'variabel') : null, catatan: cat || '' })); };
    const panen = (s, k, n, kotor, susut, harga, pembeli) => {
      const bersih = kotor - susut, t = dasar({ id: uid('t'), tanggal: T(n), jenis: 'masuk', kategoriId: 'jual-panen', jumlah: Math.round(bersih * harga), siklusId: s.id, sifatBiaya: null,
        catatan: 'Panen ' + String(bersih).replace('.', ',') + ' ' + k.satuan + ' ke ' + pembeli });
      D.transaksi.push(t);
      D.panen.push(dasar({ id: uid('p'), siklusId: s.id, tanggal: T(n), kuantitasKotor: kotor, susut, hargaPerSatuan: harga, pembeli, transaksiId: t.id }));
    };
    const aset = (nama, harga, umur, n) => D.aset.push(dasar({ id: uid('a'), nama, hargaBeli: harga, umurBulan: umur, tanggalBeli: T(n) }));
    const utang = (jenis, pihak, jumlah, tempo, lunas) => D.utang.push(dasar({ id: uid('u'), jenis, pihak, jumlah, jatuhTempo: tempo, lunas: !!lunas }));

    const uKebun = unit('Kebun belakang', 'kebun', 120, 'm²'), uHidro = unit('Greenhouse hidroponik', 'hidroponik', 200, 'lubang'), uKolam = unit('Kolam terpal', 'kolam', 24, 'm²');
    const kCabai = kom('Cabai rawit', 'kg', 120), kSelada = kom('Selada hidroponik', 'kg', 40), kLele = kom('Lele', 'kg', 90), kKangkung = kom('Kangkung', 'ikat', 30);

    /* Lele siklus 1: rugi tipis karena biaya kolam dan rangka */
    const s1 = sik(uKolam, kLele, 216, 112, 3600000, 'Siklus pertama, 1.000 ekor');
    tx(s1, 214, 'keluar', 'benih', 350000, 'Bibit lele 1.000 ekor'); tx(s1, 212, 'keluar', 'pestisida', 85000, 'Kapur dan probiotik kolam');
    [[200, 300000], [185, 380000], [170, 450000], [155, 520000], [140, 480000], [128, 270000]].forEach((x) => tx(s1, x[0], 'keluar', 'pakan', x[1], 'Pelet lele'));
    tx(s1, 200, 'keluar', 'air-listrik', 40000, 'Listrik pompa'); tx(s1, 170, 'keluar', 'air-listrik', 40000, 'Listrik pompa'); tx(s1, 140, 'keluar', 'air-listrik', 45000, 'Listrik pompa'); tx(s1, 121, 'keluar', 'upah', 60000, 'Bantu panen');
    panen(s1, kLele, 121, 72, 2, 23000, 'Pengepul Pak Darman'); panen(s1, kLele, 114, 70, 3, 23000, 'Pengepul Pak Darman');

    /* Selada hidroponik siklus 1: untung */
    const s2 = sik(uHidro, kSelada, 170, 118, 700000, '200 lubang NFT');
    tx(s2, 169, 'keluar', 'benih', 60000, 'Benih selada 2 sachet'); tx(s2, 169, 'keluar', 'media', 80000, 'Rockwool');
    tx(s2, 165, 'keluar', 'pupuk', 120000, 'Nutrisi AB mix 5 L'); tx(s2, 140, 'keluar', 'pupuk', 120000, 'Nutrisi AB mix 5 L');
    tx(s2, 150, 'keluar', 'air-listrik', 60000, 'Listrik pompa'); tx(s2, 125, 'keluar', 'air-listrik', 60000, 'Listrik pompa'); tx(s2, 130, 'keluar', 'kemasan', 45000, 'Plastik dan label');
    panen(s2, kSelada, 128, 20, 1, 38000, 'Resto Kopi Tani'); panen(s2, kSelada, 124, 18, 1.5, 38000, 'Warung Bu Made');

    /* Kangkung */
    const s3 = sik(uKebun, kKangkung, 130, 92, 400000, 'Lahan 40 m²');
    tx(s3, 129, 'keluar', 'benih', 40000, 'Benih kangkung 250 g'); tx(s3, 128, 'keluar', 'pupuk', 100000, 'Pupuk kandang 5 karung'); tx(s3, 127, 'keluar', 'upah', 100000, 'Gemburkan lahan');
    tx(s3, 110, 'keluar', 'pestisida', 30000, 'Pestisida nabati'); tx(s3, 105, 'keluar', 'air-listrik', 30000, 'Air siram');
    panen(s3, kKangkung, 98, 120, 8, 3000, 'Pasar pagi'); panen(s3, kKangkung, 96, 100, 5, 3000, 'Pasar pagi'); panen(s3, kKangkung, 94, 90, 6, 3500, 'Warung Bu Made');

    /* Cabai rawit: berjalan, panen bertahap, untung */
    kCabai.hargaPasar = [{ id: uid('h'), tanggal: T(20), harga: 52000, sumber: 'Pasar Induk' }, { id: uid('h'), tanggal: T(6), harga: 58000, sumber: 'Pasar Induk' }];
    const s4 = sik(uKebun, kCabai, 105, null, 1600000, 'Polybag 100 batang');
    s4.jadwal = [{ id: uid('j'), nama: 'Pupuk susulan NPK', tanggal: T(-2), ulang: 14, selesai: false, terakhir: T(12) }, { id: uid('j'), nama: 'Semprot hama', tanggal: T(1), ulang: 7, selesai: false, terakhir: T(6) }];
    tx(s4, 105, 'keluar', 'benih', 200000, 'Bibit cabai rawit 200 batang'); tx(s4, 104, 'keluar', 'media', 180000, 'Polybag dan tanah kompos'); tx(s4, 100, 'keluar', 'pupuk', 120000, 'Pupuk kandang');
    tx(s4, 90, 'keluar', 'pupuk', 95000, 'NPK 5 kg'); tx(s4, 70, 'keluar', 'pupuk', 85000, 'Pupuk daun'); tx(s4, 50, 'keluar', 'pupuk', 95000, 'NPK susulan');
    tx(s4, 60, 'keluar', 'pestisida', 140000, 'Insektisida dan fungisida'); tx(s4, 35, 'keluar', 'pestisida', 52000, 'Fungisida');
    tx(s4, 65, 'keluar', 'upah', 150000, 'Bantu merawat'); tx(s4, 14, 'keluar', 'upah', 100000, 'Bantu panen');
    tx(s4, 80, 'keluar', 'air-listrik', 35000, 'Air dan listrik'); tx(s4, 45, 'keluar', 'air-listrik', 35000, 'Air dan listrik'); tx(s4, 12, 'keluar', 'air-listrik', 35000, 'Air dan listrik');
    tx(s4, 20, 'keluar', 'kemasan', 40000, 'Plastik klip dan label');
    panen(s4, kCabai, 20, 6, 0.5, 60000, 'Warung Bu Made'); panen(s4, kCabai, 16, 8, 0.6, 62000, 'Pasar Induk'); panen(s4, kCabai, 11, 9, 0.5, 65000, 'Pasar Induk');
    panen(s4, kCabai, 6, 10, 0.8, 60000, 'Warung Bu Made'); panen(s4, kCabai, 2, 7.5, 0.5, 58000, 'Pasar Induk');

    /* Selada hidroponik siklus 2: berjalan, belum panen */
    const s5 = sik(uHidro, kSelada, 28, null, 700000, 'Siklus kedua');
    tx(s5, 28, 'keluar', 'benih', 60000, 'Benih selada 2 sachet'); tx(s5, 28, 'keluar', 'media', 80000, 'Rockwool'); tx(s5, 27, 'keluar', 'pupuk', 120000, 'Nutrisi AB mix 5 L');
    tx(s5, 12, 'keluar', 'pupuk', 120000, 'Nutrisi AB mix 5 L'); tx(s5, 15, 'keluar', 'air-listrik', 60000, 'Listrik pompa'); tx(s5, 3, 'keluar', 'kemasan', 45000, 'Plastik dan label');

    /* Lele siklus 2: berjalan, modal mendekati anggaran */
    const s6 = sik(uKolam, kLele, 60, null, 2600000, 'Siklus kedua, 1.000 ekor');
    tx(s6, 60, 'keluar', 'benih', 350000, 'Bibit lele 1.000 ekor'); tx(s6, 58, 'keluar', 'pestisida', 70000, 'Probiotik');
    [[55, 300000], [45, 360000], [35, 440000], [20, 540000], [8, 380000]].forEach((x) => tx(s6, x[0], 'keluar', 'pakan', x[1], 'Pelet lele'));
    tx(s6, 40, 'keluar', 'air-listrik', 45000, 'Listrik pompa'); tx(s6, 10, 'keluar', 'air-listrik', 45000, 'Listrik pompa');

    /* Di luar siklus: alat, penjualan bibit, bantuan (plus beberapa catatan terbaru agar bulan berjalan tidak kosong) */
    tx(null, 216, 'keluar', 'alat', 450000, 'Terpal 4x6 dan rangka kolam'); tx(null, 172, 'keluar', 'alat', 1200000, 'Rak NFT dan pipa PVC');
    tx(null, 175, 'keluar', 'alat', 380000, 'Pompa air 125 W'); tx(null, 140, 'keluar', 'alat', 150000, 'Sprayer 2 liter'); tx(null, 100, 'keluar', 'alat', 85000, 'Timbangan digital');
    tx(null, 2, 'keluar', 'alat', 60000, 'Gunting panen'); tx(s4, 0, 'keluar', 'kemasan', 25000, 'Plastik klip'); tx(s5, 1, 'keluar', 'pestisida', 35000, 'Pestisida nabati');
    tx(null, 150, 'masuk', 'subsidi', 300000, 'Bantuan pupuk dari kelompok tani'); tx(null, 50, 'masuk', 'jual-bibit', 150000, 'Bibit cabai 30 polybag');
    App.data.pengaturan.saldoAwal = 6000000; App.data.pengaturan.saldoAwalContoh = true; /* modal awal agar saldo kas contoh wajar */
    aset('Terpal kolam 4x6 dan rangka', 450000, 24, 216); aset('Rak NFT dan pipa PVC (200 lubang)', 1200000, 36, 172); aset('Pompa air 125 W', 380000, 36, 175); aset('Sprayer 2 liter', 150000, 24, 140);

    /* Utang dan piutang */
    utang('piutang', 'Resto Kopi Tani', 450000, T(-5), false); utang('utang', 'Toko Tani Makmur', 380000, T(3), false); utang('piutang', 'Warung Bu Made', 300000, T(30), true);
  },
  banner() {
    if (!this.ada()) return '';
    return '<section class="info-contoh"><div class="ic-row"><div><strong>Data contoh</strong><div class="note">Tiruan untuk mencoba fitur. Catatan Anda tidak ikut terhapus.</div></div>' +
      '<button type="button" class="btn" data-do="hapus-contoh">Hapus</button></div></section>';
  },
  hapus(el) {
    if (!this.minta) {
      const asal = el.textContent; el.textContent = 'Ketuk lagi untuk menghapus';
      this.minta = setTimeout(() => { this.minta = null; el.textContent = asal; }, 4000); return;
    }
    clearTimeout(this.minta); this.minta = null;
    Cadangan.catat('Sebelum hapus contoh', true);
    const D = App.data, sisaSik = new Set(D.siklus.filter((s) => s.contoh).map((s) => s.id));
    ['unit', 'komoditas', 'siklus', 'aset', 'utang'].forEach((k) => { D[k] = D[k].filter((x) => !x.contoh); });
    D.panen = D.panen.filter((p) => !p.contoh && !sisaSik.has(p.siklusId));
    D.transaksi = D.transaksi.filter((t) => !t.contoh);
    D.transaksi.forEach((t) => { if (t.siklusId && sisaSik.has(t.siklusId)) { t.siklusId = null; t.diubah = nowIso(); } });
    if (D.pengaturan.saldoAwalContoh) { D.pengaturan.saldoAwal = 0; delete D.pengaturan.saldoAwalContoh; }
    App.simpan(); App.go(App.tab, true); App.toast('Data contoh dihapus');
  }
};
