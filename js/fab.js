/* Buku Kebun — FAB mengikuti halaman aktif (v0.1.020; Rencana lewat modal v0.1.055) */
const Fab = {
  c: null, terbuka: false,
  catat(jenis, sid) { App.draft = { id: null, jenis }; App.baru(sid); },
  /* v0.1.155: dari Beranda, pilih siklus berjalan lebih dulu (langsung bila hanya satu) */
  untukSiklus(judul, fn) {
    const L = Siklus.daftar().filter((s) => s.status === 'berjalan');
    if (L.length === 1) { fn(L[0].id); return; }
    if (!L.length) return;
    Modal.buka({ html: '<h2 id=\"fsT\">' + judul + '</h2>' + L.map((s) => '<button type=\"button\" class=\"btn\" data-fs=\"' + s.id + '\" style=\"width:100%;margin-top:8px\">' + esc(Siklus.nama(s.id)) + '</button>').join(''), judulId: 'fsT',
      klik(e) { const b = e.target.closest('[data-fs]'); if (!b) return; const id = b.dataset.fs; Modal.tutup(true); setTimeout(() => fn(id), 250); } }); // tunda: penutupan modal memicu 'kembali' di riwayat browser, yang bisa membatalkan halaman/modal berikutnya
  },
  /* null = FAB disembunyikan; { nama, aksi } = satu ketukan; { nama, pilih: [[label, fungsi]] } = pilihan melayang */
  cfg() {
    const t = App.tab, tx = (sid) => [['Catat modal', () => Fab.catat('keluar', sid)], ['Catat hasil', () => Fab.catat('masuk', sid)]];
    if (t === 'beranda' || t === 'transaksi') return { nama: 'Catat transaksi', pilih: t === 'beranda' && Siklus.daftar().some((s) => s.status === 'berjalan') ? tx().concat([['Catat panen', () => Fab.untukSiklus('Catat panen untuk siklus', (id) => { Siklus.sid = id; Siklus.aksi('catat-panen', {}); })], ['Catat jurnal', () => Fab.untukSiklus('Catat jurnal untuk siklus', (id) => { Siklus.sid = id; Rencana.dlgBuka('jurnal'); })]]) : tx() };
    if (t === 'master') return { nama: 'Tambah unit atau komoditas', pilih: [['Tambah unit', () => Siklus.aksi('form-baru', { dataset: { j: 'unit' } })], ['Tambah komoditas', () => Siklus.aksi('form-baru', { dataset: { j: 'kom' } })]] };
    if (t === 'siklus') return { nama: 'Siklus baru', aksi: () => App.go('siklus-form') };
    if (t === 'siklus-detail') {
      const s = Siklus.cari(Siklus.sid);
      return s && s.status === 'berjalan' ? { nama: 'Catat untuk siklus ini', pilih: tx(s.id).concat([['Catat panen', () => Siklus.aksi('catat-panen', {})], ['Catat jurnal', () => Rencana.dlgBuka('jurnal')], ['Catat upah', () => Upah.catat('', s.id)], ['Pakai stok', () => Stok.pakai('', s.id)], ['Tambah jadwal kegiatan', () => Rencana.dlgBuka('jadwal')]]) } : null;
    }
    if (t === 'jurnal') {
      const s = Siklus.cari(Siklus.sid);
      return s && s.status === 'berjalan' ? { nama: 'Catat jurnal', aksi: () => Rencana.dlgBuka('jurnal') } : null;
    }
    if (t === 'rencana') {
      const R = (j) => () => Rencana.dlgBuka(j);
      if (Rencana.sub === 'kas') return { nama: 'Catat transaksi atau atur saldo awal', pilih: tx().concat([['Atur saldo awal kas', R('awal')]]) };
      if (Rencana.sub === 'anggaran') return { nama: 'Atur anggaran', aksi: R('anggaran') };
      if (Rencana.sub === 'aset') return { nama: 'Tambah aset', aksi: R('aset') };
      if (Rencana.sub === 'upah') return { nama: 'Catat upah atau tambah pekerja', pilih: [['Catat upah', () => Upah.catat()], ['Tambah pekerja', R('pekerja')]] };
      if (Rencana.sub === 'stok') return { nama: 'Pakai stok, tambah stok, atau tambah barang', pilih: [['Pakai stok', () => Stok.pakai()], ['Tambah stok (beli)', () => Stok.masuk()], ['Tambah barang', R('saprodi')]] };
      if (Rencana.sub === 'harga') return { nama: 'Catat harga pasar', aksi: R('harga') };
      if (Rencana.sub === 'utang') return { nama: 'Catat utang atau piutang', aksi: R('utang') };
    }
    return null;
  },
  atur() {
    const f = $('fab'); this.c = this.cfg(); this.tutup(); f.classList.remove('turun');
    f.hidden = !this.c;
    if (this.c) { f.setAttribute('aria-label', this.c.nama); f.title = this.c.nama; f.setAttribute('aria-haspopup', this.c.pilih ? 'true' : 'false'); }
  },
  tutup() {
    this.terbuka = false;
    $('fabDial').hidden = true; $('fabScrim').hidden = true;
    $('fab').classList.remove('open'); $('fab').setAttribute('aria-expanded', 'false');
  },
  bukaDial() {
    $('fabDial').innerHTML = this.c.pilih.map((p, i) => '<button type="button" class="fab-item" data-fi="' + i + '">' + p[0] + '</button>').join('');
    this.terbuka = true;
    $('fabDial').hidden = false; $('fabScrim').hidden = false;
    $('fab').classList.add('open'); $('fab').setAttribute('aria-expanded', 'true');
  },
  init() {
    $('fab').addEventListener('click', () => {
      if (!this.c) return;
      if (this.c.pilih) { if (this.terbuka) this.tutup(); else this.bukaDial(); } else this.c.aksi();
    });
    $('fabDial').addEventListener('click', (e) => {
      const b = e.target.closest('[data-fi]'); if (!b || !this.c) return;
      const f = this.c.pilih[+b.dataset.fi][1]; this.tutup(); f();
    });
    $('fabScrim').addEventListener('click', () => this.tutup());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.terbuka) this.tutup(); });
    let y = window.scrollY;
    window.addEventListener('scroll', () => {
      const n = window.scrollY, f = $('fab');
      if (this.terbuka || n < 120 || n < y - 6) f.classList.remove('turun');
      else if (n > y + 6) f.classList.add('turun');
      y = n;
    }, { passive: true });
  }
};
