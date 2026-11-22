/* Buku Kebun — bilah ringkas saat gulir (HP/tablet, <1024 px; Fase 6G Tahap 2, v0.1.126).
   Muncul saat menggulir ke atas setelah melewati header, tersembunyi saat menggulir ke bawah dan di dekat puncak halaman. */
const Ringkas = {
  y: 0, tunggu: false, el: null,
  aktif() { return !!(window.matchMedia && window.matchMedia('(max-width:1023px)').matches); },
  kurang() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches); },
  init() {
    this.el = document.getElementById('hdrRingkas'); if (!this.el) return;
    this.y = window.scrollY;
    window.addEventListener('scroll', () => {
      if (this.tunggu) return; this.tunggu = true;
      requestAnimationFrame(() => { this.tunggu = false; this.geser(); });
    }, { passive: true });
    document.getElementById('hrJudul').addEventListener('click', () => { window.scrollTo({ top: 0, behavior: this.kurang() ? 'auto' : 'smooth' }); });
    const g = document.getElementById('gear'), hg = document.getElementById('hrGear'); if (g && hg) hg.innerHTML = g.innerHTML;
    const sk = document.getElementById('skDot'); if (sk && window.MutationObserver) new MutationObserver(() => this.segar()).observe(sk, { childList: true, subtree: true, characterData: true, attributes: true });
    window.addEventListener('resize', () => { if (!this.aktif()) this.sembunyi(); });
    this.segar();
  },
  geser() {
    if (!this.el) return;
    if (!this.aktif() || (typeof Modal !== 'undefined' && Modal.m)) { this.sembunyi(); this.y = window.scrollY; return; }
    const y = window.scrollY, dy = y - this.y, hd = document.querySelector('header.masthead'), batas = (hd ? hd.offsetHeight : 100) + 24;
    if (y <= batas) this.sembunyi(); else if (dy < -8) this.tunjuk(); else if (dy > 8) this.sembunyi();
    this.y = y;
  },
  tunjuk() { if (this.el) this.el.classList.add('on'); },
  sembunyi() { if (this.el) this.el.classList.remove('on'); },
  /* salin judul, tombol kembali, dan status sinkron dari header utama */
  segar() {
    if (!this.el) return;
    const j = document.getElementById('hdrJudul'), bk = document.getElementById('hdrBack'), hb = document.getElementById('hrBack'), hj = document.getElementById('hrJudul'), hs = document.getElementById('hrSk'), chip = document.querySelector('#skDot .sk-chip');
    if (j && hj) hj.textContent = document.body.dataset.hal === 'beranda' ? 'Buku Kebun' : (j.textContent || '').trim() || 'Buku Kebun';
    if (bk && hb) {
      hb.hidden = bk.hidden;
      if (bk.dataset.go) hb.dataset.go = bk.dataset.go; else hb.removeAttribute('data-go');
      hb.setAttribute('aria-label', bk.getAttribute('aria-label') || 'Kembali'); hb.title = bk.title || '';
    }
    if (hs) {
      const k = chip ? (chip.className.match(/sk-(lokal|ok|sibuk|gagal|offline|baru)/) || [])[1] : 'lokal', t = chip ? (chip.title || chip.textContent.trim()) : 'Mode lokal';
      hs.className = 'hr-sk sk-' + (k || 'lokal'); hs.setAttribute('aria-label', t); hs.title = t;
      if (chip && chip.querySelector('svg')) hs.innerHTML = chip.querySelector('svg').outerHTML; /* ikon awan yang sama */
    }
  }
};
