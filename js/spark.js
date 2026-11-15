/* Buku Kebun — sparkline hero interaktif (v0.1.138, docs/HERO.md): titik bulan ini, ketuk/geser/arahkan untuk melihat bulan dan nilainya.
   Titik dan petunjuk berupa elemen HTML di atas kartu hero (bukan di dalam SVG yang diregangkan preserveAspectRatio="none"). */
const Spark = {
  d: null, i: -1, aktif: false, tunda: null, W: 300, H: 40, MG: 5,
  sp() { return document.getElementById('heroSpark'); },
  hc() { return document.getElementById('heroCard'); },
  init() {
    const sp = this.sp(); if (!sp) return;
    sp.style.touchAction = 'pan-y';
    const dari = (e) => { if (!this.d) return; this.i = this.idx(e.clientX); this.tampil(true); };
    sp.addEventListener('pointerdown', (e) => { this.ptr = true; if (!this.d) return; clearTimeout(this.tunda); try { sp.setPointerCapture(e.pointerId); } catch (x) { /* abaikan */ } dari(e); });
    sp.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons) { clearTimeout(this.tunda); dari(e); } });
    sp.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') this.lepas(3500); });
    sp.addEventListener('pointercancel', () => this.lepas(0));
    sp.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') this.lepas(0); });
    sp.addEventListener('focus', () => { sp.classList.toggle('kb', !this.ptr); this.ptr = false; if (this.d) this.tampil(true); }); // cincin fokus hanya untuk keyboard, bukan ketukan/klik
    sp.addEventListener('blur', () => { sp.classList.remove('kb'); this.ptr = false; this.lepas(0); });
    sp.addEventListener('keydown', (e) => {
      if (!this.d) return; const N = this.d.N, k = e.key; let i = this.i;
      if (k === 'ArrowLeft' || k === 'ArrowDown') i--; else if (k === 'ArrowRight' || k === 'ArrowUp') i++; else if (k === 'Home') i = 0; else if (k === 'End') i = N - 1; else if (k === 'Escape') { this.lepas(0); return; } else return;
      e.preventDefault(); this.i = Math.max(0, Math.min(N - 1, i)); this.tampil(true);
    });
    if (window.ResizeObserver) new ResizeObserver(() => this.gambar()).observe(sp);
    window.addEventListener('resize', () => this.gambar());
  },
  /* dipanggil App setiap hero digambar ulang; ada=false bila tidak ada data */
  pasang(nb, T, mx) {
    const sp = this.sp(); if (!sp) return;
    if (!nb || !nb.length) { this.d = null; this.buang(); sp.removeAttribute('tabindex'); sp.setAttribute('role', 'img'); ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'].forEach((a) => sp.removeAttribute(a)); return; }
    const N = nb.length, ganti = !this.d || this.d.N !== N; this.d = { nb: nb, T: T, mx: mx, N: N };
    if (ganti || this.i < 0 || this.i >= N) this.i = N - 1;
    if (!this.aktif) this.i = N - 1;
    sp.setAttribute('tabindex', '0'); sp.setAttribute('role', 'slider'); sp.setAttribute('aria-orientation', 'horizontal'); sp.setAttribute('aria-valuemin', '0'); sp.setAttribute('aria-valuemax', String(N - 1));
    sp.setAttribute('aria-roledescription', 'penggeser bulan'); this.gambar();
  },
  zoom() { const z = parseFloat(document.documentElement.style.getPropertyValue('--zoom')); return z > 0 ? z : 1; },
  idx(x) { const r = this.sp().getBoundingClientRect(), N = this.d.N; return Math.max(0, Math.min(N - 1, Math.round((x - r.left) / (r.width || 1) * (N - 1)))); },
  nilai(i) { const v = this.d.T[i]; return typeof Samar !== 'undefined' && Samar.aktif() ? 'Rp ••••••' : rp(v); },
  els() {
    const hc = this.hc(); if (!hc) return null;
    let t = hc.querySelector('.hs-titik');
    if (!t) { t = document.createElement('span'); t.className = 'hs-titik'; t.setAttribute('aria-hidden', 'true'); hc.appendChild(t); }
    return { t: t, hc: hc };
  },
  buang() { const hc = this.hc(); if (hc) hc.querySelectorAll('.hs-titik,.hs-tip').forEach((e) => e.remove()); },
  tampil(ya) { this.aktif = !!ya; this.gambar(); },
  lepas(ms) { clearTimeout(this.tunda); const f = () => { this.aktif = false; if (this.d) this.i = this.d.N - 1; this.gambar(); }; if (ms) this.tunda = setTimeout(f, ms); else f(); },
  gambar() {
    const sp = this.sp(), E = this.d && this.els(); if (!sp || !E || sp.hasAttribute('hidden')) { if (!this.d || (sp && sp.hasAttribute('hidden'))) this.buang(); return; }
    const d = this.d, i = this.i, r = sp.getBoundingClientRect(), h = E.hc.getBoundingClientRect(); if (!r.width) return;
    const z = this.zoom(); // Setelan Ukuran tampilan memakai body{zoom}: rect dalam piksel layar, sedangkan left/top elemen ikut diskalakan; garis tepi kartu menggeser titik asal
    const x = (r.left - h.left + i / (d.N - 1) * r.width) / z - E.hc.clientLeft, y = (r.top - h.top + (this.H / 2 - d.T[i] / d.mx * (this.H / 2 - this.MG)) / this.H * r.height) / z - E.hc.clientTop;
    E.t.style.left = x + 'px'; E.t.style.top = y + 'px'; E.t.classList.toggle('on', this.aktif);
    sp.setAttribute('aria-valuenow', String(i)); sp.setAttribute('aria-valuetext', d.nb[i].n + ': ' + this.nilai(i) + (i === d.N - 1 ? ' (bulan ini)' : ''));
    if (typeof App !== 'undefined') App.heroLihat(this.aktif && i < d.N - 1 ? i : null); // angka utama hero mengikuti bulan yang disentuh
  }
};
