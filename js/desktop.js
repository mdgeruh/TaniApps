/* Buku Kebun — pelengkap desktop (Fase 6D Tahap 1, v0.1.118): pintasan keyboard dan ukuran teks grafik tetap; docs/DESKTOP.md */
const Pintasan = {
  g: false, t: null,
  TUJUAN: { b: 'beranda', t: 'transaksi', s: 'siklus', u: 'master', l: 'laporan', r: 'rencana' },
  DAFTAR: [['N', 'Catat transaksi (atau tombol + di halaman ini)'], ['/', 'Cari transaksi'], ['G lalu B', 'Beranda'], ['G lalu T', 'Transaksi'], ['G lalu S', 'Siklus'], ['G lalu U', 'Unit dan komoditas'],
    ['G lalu L', 'Laporan'], ['G lalu R', 'Rencana keuangan'], [',', 'Setelan'], ['?', 'Daftar pintasan ini'], ['Esc', 'Tutup dialog atau menu']],
  aktif() { return Setelan.get('pintasan') !== false; },
  /* tidak aktif saat mengetik, memakai Ctrl/Alt/Cmd, atau mengisi huruf lewat IME */
  boleh(e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return false;
    const t = e.target; if (!t) return true;
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return false;
    return !(t.closest && t.closest('[role=listbox],[role=menu],[role=combobox]'));
  },
  akhiriG() { this.g = false; clearTimeout(this.t); },
  tekan(e) {
    if (!this.aktif() || !this.boleh(e)) return;
    const k = e.key;
    if (this.g) {
      this.akhiriG(); const tuju = this.TUJUAN[String(k).toLowerCase()];
      if (tuju && !Modal.m) { e.preventDefault(); App.go(tuju); } return;
    }
    if (k === '?') { e.preventDefault(); this.bantuan(); return; }
    if (Modal.m) return;
    const kl = String(k).toLowerCase();
    if (k === '/') { e.preventDefault(); this.cari(); }
    else if (kl === 'n') { e.preventDefault(); this.baru(); }
    else if (kl === 'g') { e.preventDefault(); this.g = true; App.toast('G lalu B Beranda · T Transaksi · S Siklus · U Unit · L Laporan · R Rencana'); this.t = setTimeout(() => { this.g = false; }, 1500); }
    else if (k === ',') { e.preventDefault(); App.go('setelan'); }
  },
  baru() {
    if (Fab.terbuka) { Fab.tutup(); return; }
    if (!Fab.c) { App.toast('Tombol + tidak tersedia di halaman ini'); return; }
    if (Fab.c.pilih) { Fab.bukaDial(); setTimeout(() => { const b = document.querySelector('#fabDial [data-fi]'); if (b) b.focus(); }, 60); } else Fab.c.aksi();
  },
  cari() {
    const id = App.tab === 'jurnal' ? 'uj_cari' : 'f_cari', f = document.getElementById(id);
    if (f) { f.focus(); f.select(); return; }
    App.go('transaksi'); setTimeout(() => { const g = document.getElementById('f_cari'); if (g) g.focus(); }, 120);
  },
  bantuan() {
    if (Modal.m) { if (Modal.m.el.querySelector('#pnJudul')) Modal.tutup(); return; }
    Modal.buka({ judulId: 'pnJudul', tutupLatar: true,
      html: '<div class="dm-kepala"><div><div class="dm-jenis">Papan ketik</div><h2 class="dm-judul" id="pnJudul">Pintasan keyboard</h2></div><button type="button" class="dm-x" data-pn="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="dm-isi"><table class="pn-tab"><tbody>' + this.DAFTAR.map((r) => '<tr><td>' + r[0].split(' ').map((x) => x === 'lalu' ? '<span class="mu"> lalu </span>' : '<kbd>' + x + '</kbd>').join('') + '</td><td>' + r[1] + '</td></tr>').join('') + '</tbody></table>' +
        '<p class="note">Aktif di luar kolom isian dan tidak bentrok dengan Ctrl, Alt, atau Cmd. Bisa dimatikan di Setelan → Preferensi → Pintasan keyboard.</p></div>' +
        '<div class="dm-aksi"><button type="button" class="btn gold" data-pn="tutup">Tutup</button></div>',
      klik: (e) => { if (e.target.closest('[data-pn=tutup]')) Modal.tutup(); } });
  },
  init() { document.addEventListener('keydown', (e) => this.tekan(e)); }
};

/* teks di grafik SVG ikut membesar mengikuti lebar layar; batasi agar tetap terbaca dan tidak raksasa di desktop */
const GrafikFont = {
  MAKS: 1.25,
  jalan() {
    document.querySelectorAll('svg[role=img][viewBox]').forEach((s) => {
      const vb = s.viewBox && s.viewBox.baseVal, w = s.getBoundingClientRect().width; if (!vb || !vb.width || !w) return;
      const skala = w / vb.width, f = skala > this.MAKS ? this.MAKS / skala : 0;
      s.querySelectorAll('text').forEach((t) => {
        if (!t.dataset.f0) t.dataset.f0 = t.getAttribute('font-size') || '10';
        if (f) t.style.fontSize = (parseFloat(t.dataset.f0) * f).toFixed(2) + 'px'; else t.style.removeProperty('font-size');
      });
    });
  },
  tunda() { cancelAnimationFrame(this.r); this.r = requestAnimationFrame(() => this.jalan()); },
  init() {
    const mo = new MutationObserver(() => this.tunda());
    ['app', 'heroCard'].forEach((id) => { const e = document.getElementById(id); if (e) mo.observe(e, { childList: true, subtree: true }); });
    window.addEventListener('resize', () => this.tunda()); this.tunda();
  }
};
/* daftar Transaksi ⇄ tabel saat lebar layar melewati 1100 px */
if (window.matchMedia) matchMedia('(min-width:1100px)').addEventListener('change', (e) => { if (!e.matches && App.panel) App.tutupPanel(true); if (App.tab === 'transaksi') { const el = document.getElementById('txHasil'); if (el) el.innerHTML = App.hasilTx(); } });
/* Esc menutup panel transaksi (setelah dropdown/dialog menanganinya lebih dulu) */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.defaultPrevented || !App.panel || Modal.m || document.querySelector('.toast-pop')) return;
  if (App.lanjutBuang()) { const id = App.lastEdit; App.tutupPanel(true); const b = id && document.querySelector('.tt-buka[data-edit="' + id + '"]'); if (b) b.focus(); }
});
Pintasan.init(); GrafikFont.init();
