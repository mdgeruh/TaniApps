/* Tani Keuangan — FAB mengikuti halaman aktif (v0.1.020) */
const Fab = {
  c: null, terbuka: false,
  catat(jenis, sid) { App.draft = { id: null, jenis }; App.baru(sid); },
  fokus(id) { const e = document.getElementById(id); if (e) { e.scrollIntoView({ block: 'center', behavior: 'smooth' }); e.focus({ preventScroll: true }); } },
  /* null = FAB disembunyikan; { nama, aksi } = satu ketukan; { nama, pilih: [[label, fungsi]] } = pilihan melayang */
  cfg() {
    const t = App.tab, tx = (sid) => [['Catat modal', () => Fab.catat('keluar', sid)], ['Catat hasil', () => Fab.catat('masuk', sid)]];
    if (t === 'beranda' || t === 'transaksi' || t === 'lainnya') return { nama: 'Catat transaksi', pilih: tx() };
    if (t === 'siklus') return { nama: 'Siklus baru', aksi: () => App.go('siklus-form') };
    if (t === 'siklus-detail') {
      const s = Siklus.cari(Siklus.sid);
      return s && s.status === 'berjalan' ? { nama: 'Catat untuk siklus ini', pilih: tx(s.id).concat([['Catat panen', () => Siklus.aksi('catat-panen', {})]]) } : null;
    }
    if (t === 'rencana') {
      if (Rencana.sub === 'kas') return { nama: 'Catat transaksi', pilih: tx() };
      if (Rencana.sub === 'aset') return { nama: 'Tambah aset', aksi: () => Fab.fokus('as_nama') };
      if (Rencana.sub === 'utang') return { nama: 'Catat utang atau piutang', aksi: () => Fab.fokus('ut_pihak') };
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
