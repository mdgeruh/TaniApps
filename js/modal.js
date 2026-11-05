/* Tani Keuangan — mesin modal bersama (v0.1.061, docs/MODAL.md)
   Satu mesin untuk semua jendela: Rencana (formulir dan detail), Siklus (unit/komoditas), Bayar utang.
   Menangani: role dialog, kunci gulir, Esc, jebakan Tab, Enter menyimpan, klik latar, format Rupiah, penyamaran angka (Samar),
   pesan galat di dalam modal, pengembalian fokus, dan satu entri riwayat browser (tombol kembali menutup modal). */
const Modal = {
  m: null, hist: false, tunda: null, abaikan: false, dariPop: false, akhir: null,
  /* o: { html, judulId, fokus (id), pemicu, tutupLatar (true | false | fungsi), klik(e), ubah(e), simpan(), antes(el), onTutup(), cadangan() } */
  buka(o) {
    if (this.m) return null;
    const pemicu = o.pemicu || document.activeElement, el = document.createElement('div');
    el.className = 'dm-lapis'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); if (o.judulId) el.setAttribute('aria-labelledby', o.judulId);
    el.innerHTML = '<div class="dm-kartu" tabindex="-1">' + (o.html || '') + '</div>';
    if (o.antes) o.antes(el);
    document.body.appendChild(el); if (typeof Form !== 'undefined') Form.upgrade(el);
    const m = this.m = { el: el, o: o, pemicu: pemicu, sel: this.selektor(pemicu), kunci: document.body.style.overflow };
    document.body.style.overflow = 'hidden';
    el.addEventListener('click', (e) => {
      if (e.target === el) { const t = o.tutupLatar; if (t === undefined || t === true || (typeof t === 'function' && t())) this.tutup(); return; }
      if (o.klik) o.klik(e);
    });
    el.addEventListener('input', (e) => {
      if (e.target.dataset.rp === undefined) return;
      if (e.data && /[^\d.\s]/.test(e.data)) App.toast(e.data === ',' ? 'Rupiah bulat, tanpa desimal' : 'Hanya angka');
      e.target.value = fmtInput(angkaKetik(e.target.value));
    });
    el.addEventListener('change', (e) => { if (o.ubah) o.ubah(e); });
    m.kd = (e) => {
      if (this.m !== m) return;
      if (e.key === 'Escape') { e.preventDefault(); this.tutup(); }
      else if (e.key === 'Enter' && o.simpan && e.target.tagName === 'INPUT') { e.preventDefault(); o.simpan(); }
      else if (e.key === 'Tab') {
        const q = [...el.querySelectorAll('button,input,select,textarea,[tabindex]:not([tabindex="-1"])')]; if (!q.length) return;
        const a = q[0], z = q[q.length - 1];
        if (e.shiftKey && (document.activeElement === a || document.activeElement === el.firstChild)) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener('keydown', m.kd);
    if (typeof Samar !== 'undefined' && Samar.aktif()) Samar.sapu(el);
    this.dorong();
    const i = o.fokus && el.querySelector('#' + o.fokus); if (i) { i.focus(); if (i.select && i.value) i.select(); } else el.firstChild.focus();
    return el;
  },
  /* tanpaFokus: jangan kembalikan fokus (pemanggil memanggil pulihFokus setelah menggambar ulang halaman) */
  tutup(tanpaFokus) {
    const m = this.m; if (!m) return;
    this.m = null; m.el.remove(); document.body.style.overflow = m.kunci; document.removeEventListener('keydown', m.kd);
    this.akhir = { pemicu: m.pemicu, sel: m.sel, cad: m.o.cadangan };
    if (m.o.onTutup) m.o.onTutup();
    if (!this.dariPop) this.balikRiwayat();
    if (!tanpaFokus) this.pulihFokus();
  },
  /* pesan galat di dalam modal (modal tetap terbuka) */
  galat(teks) {
    if (!this.m) { App.toast(teks); return; }
    const c = this.m.el.querySelector('.dm-isi') || this.m.el.firstChild; let p = c.querySelector('#mdMsg');
    if (!p) { p = document.createElement('p'); p.id = 'mdMsg'; p.className = 'note down'; p.setAttribute('role', 'alert'); c.appendChild(p); }
    p.textContent = teks;
  },
  selektor(e) {
    if (!e || !e.getAttribute) return '';
    if (e.id) return '#' + e.id;
    const a = e.dataset && (e.dataset.rc ? ['rc', e.dataset.rc] : e.dataset.do ? ['do', e.dataset.do] : null);
    return a && e.dataset.id ? '[data-' + a[0] + '="' + a[1] + '"][data-id="' + e.dataset.id + '"]' : '';
  },
  /* fokus ke pemicu; bila sudah tergambar ulang, cari lagi lewat selektornya; terakhir ke tombol + atau isi halaman */
  pulihFokus() {
    const a = this.akhir; if (!a || this.m) return;
    let e = a.pemicu && document.body.contains(a.pemicu) ? a.pemicu : null;
    if (!e && a.sel) e = document.querySelector(a.sel);
    if (!e && a.cad) e = a.cad();
    if (!e && a.pemicu && a.pemicu.className && /fab/.test(a.pemicu.className)) e = document.getElementById('fab');
    if (!e) { e = document.getElementById('app'); if (e && !e.hasAttribute('tabindex')) e.setAttribute('tabindex', '-1'); }
    if (e && e.focus) e.focus({ preventScroll: true });
    this.akhir = null;
  },
  /* ---- riwayat: modal terbuka = satu entri; bila modal baru dibuka seketika setelah yang lama ditutup, entrinya dipakai ulang ---- */
  dorong() {
    if (this.tunda) { clearTimeout(this.tunda); this.tunda = null; return; }
    try { history.pushState({ r: App.ri || 0, modal: 1 }, ''); this.hist = true; } catch (e) { this.hist = false; }
  },
  balikRiwayat() {
    if (!this.hist) return;
    this.tunda = setTimeout(() => { this.tunda = null; this.hist = false; this.abaikan = true; try { history.back(); } catch (e) { this.abaikan = false; } }, 0);
  },
  /* dipanggil App saat popstate; true bila sudah ditangani di sini */
  popstate() {
    if (this.abaikan) { this.abaikan = false; return true; }
    if (this.m) { this.hist = false; this.dariPop = true; try { this.tutup(); } finally { this.dariPop = false; } return true; }
    return false;
  }
};
