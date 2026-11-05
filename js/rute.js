/* Tani Keuangan — rute web: tiap halaman punya alamat #nama yang bisa dibuka langsung, dimuat ulang, dan dibagikan (v0.1.077, docs/RUTE.md)
   Hanya "#nama" dengan huruf, angka, dan tanda hubung (tanpa "#/jalur"), supaya cocok dengan penampil artefak dan hosting statis.
   Halaman tetap dikelola App.go; modul ini hanya menerjemahkan keadaan aplikasi ke hash dan sebaliknya. */
const Rute = {
  nid(id) { return String(id).replace(/_/g, '-'); },
  aman(id) { return /^[A-Za-z0-9_-]+$/.test(String(id)); },
  cari(arr, n) { return arr.find((x) => !x.terhapus && this.aman(x.id) && this.nid(x.id) === n) || null; },

  /* keadaan aplikasi saat ini → nama rute (tanpa tanda #) */
  hash() {
    const t = App.tab;
    if (t === 'laporan') return 'laporan';
    if (t === 'rencana') return 'rencana-' + Rencana.sub;
    if (t === 'master') return Siklus.msub === 'kom' ? 'komoditas' : 'unit';
    if (t === 'siklus') return Siklus.sub && Siklus.sub !== 'berjalan' ? 'siklus-' + Siklus.sub : 'siklus';
    if (t === 'siklus-detail' || t === 'siklus-form' || t === 'panen') {
      const id = t === 'siklus-form' && Siklus.sf && !Siklus.sf.id ? '' : Siklus.sid;
      if (t === 'siklus-form' && !id) return 'siklus-baru';
      if (!id || !this.aman(id)) return 'siklus';
      return (t === 'panen' && Siklus.pd && !Siklus.pd.id ? 'panen-' : 'siklus-') + this.nid(id);
    }
    if (t === 'catat') {
      const d = App.draft; if (!d) return 'transaksi';
      return d.id && this.aman(d.id) ? 'transaksi-' + this.nid(d.id) : 'catat-' + (d.jenis === 'masuk' ? 'hasil' : 'modal');
    }
    return t || 'beranda';
  },

  /* nama rute → membuka halaman; true bila dikenali */
  buka(h) {
    h = String(h || '').replace(/^#/, '');
    if (!h) return false;
    const D = App.data, tetap = ['beranda', 'transaksi', 'lainnya', 'setelan', 'laporan'];
    if (tetap.includes(h)) { App.go(h); return true; }
    let m;
    if ((m = /^laporan-(grafik|rincian)$/.exec(h))) { App.go('laporan'); return true; } // alamat lama (sub-tab) → satu halaman
    if ((m = /^rencana-(\w+)$/.exec(h)) && Rencana.SUB.some((x) => x[0] === m[1])) { Rencana.sub = m[1]; App.go('rencana'); return true; }
    if (h === 'unit' || h === 'komoditas') { Siklus.msub = h === 'unit' ? 'unit' : 'kom'; App.go('master'); return true; }
    if (h === 'siklus') { Siklus.sub = 'berjalan'; App.go('siklus'); return true; }
    if (h === 'siklus-selesai' || h === 'siklus-agenda') { Siklus.sub = h.slice(7); App.go('siklus'); return true; }
    if (h === 'siklus-baru') { Siklus.sf = Siklus.sfBaru(); App.go('siklus-form'); return true; }
    if (h === 'catat-modal' || h === 'catat-hasil') { App.draft = { jenis: h === 'catat-hasil' ? 'masuk' : 'keluar' }; App.baru(); return true; }
    if ((m = /^siklus-(.+)$/.exec(h))) { const s = this.cari(D.siklus, m[1]); if (s) { Siklus.sid = s.id; App.go('siklus-detail'); return true; } }
    if ((m = /^panen-(.+)$/.exec(h))) {
      const s = this.cari(D.siklus, m[1]);
      if (s) { Siklus.sid = s.id; if (s.status === 'berjalan') Siklus.aksi('catat-panen', { dataset: {} }); else App.go('siklus-detail'); return true; }
    }
    if ((m = /^transaksi-(.+)$/.exec(h))) { const t = this.cari(D.transaksi, m[1]); if (t) { App.ubahTx(t.id); return true; } }
    return false;
  },

  /* dipanggil App.go setelah halaman tergambar: samakan alamat di bilah alamat tanpa menambah riwayat */
  sinkron() {
    const h = '#' + this.hash();
    if (location.hash === h) return;
    try { history.replaceState(history.state, '', h); } catch (e) { /* alamat tidak bisa diubah (mis. dibuka dalam bingkai) */ }
  },

  /* halaman pertama: ikuti alamat bila dikenali, kalau tidak Beranda */
  awal() {
    let ok = false;
    try { ok = this.buka(location.hash); } catch (e) { ok = false; }
    if (!ok) App.go('beranda');
  },

  /* alamat diubah dari luar (tempel tautan, ubah manual) tanpa lewat riwayat aplikasi */
  pasang() {
    window.addEventListener('hashchange', () => {
      if (Modal.m || location.hash === '#' + this.hash()) return;
      if (!this.buka(location.hash)) this.sinkron();
    });
  }
};
