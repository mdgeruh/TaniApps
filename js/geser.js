/* Tani Keuangan — geser ke kiri untuk hapus transaksi, dengan Urungkan (v0.1.032) */
const Geser = {
  r: null, x0: 0, y0: 0, dx: 0, arah: '', baru: 0,
  tutup() { document.querySelectorAll('.tx.geser').forEach((e) => { e.classList.remove('geser'); e.style.transform = ''; }); },
  hapus(id) {
    const t = App.data.transaksi.find((x) => x.id === id); if (!t || t.terhapus) return;
    t.terhapus = true; t.diubah = nowIso(); App.simpan(); App.go(App.tab, true);
    App.toast('Transaksi dihapus', { label: 'Urungkan', fn: () => { t.terhapus = false; t.diubah = nowIso(); App.simpan(); App.go(App.tab, true); } });
  },
  mulai(e) {
    const r = e.target.closest && e.target.closest('.tx[data-edit]');
    if (!r || e.target.closest('.tx-hapus')) { if (!(e.target.closest && e.target.closest('.tx-hapus'))) this.tutup(); this.r = null; return; }
    if (!r.classList.contains('geser')) this.tutup();
    if (!r.querySelector('.tx-hapus')) { const b = document.createElement('button'); b.type = 'button'; b.className = 'tx-hapus'; b.dataset.hapus = r.dataset.edit; b.textContent = 'Hapus'; r.appendChild(b); }
    const p = e.touches[0]; this.r = r; this.x0 = p.clientX; this.y0 = p.clientY; this.dx = 0; this.arah = ''; this.awal = r.classList.contains('geser') ? -96 : 0;
  },
  gerak(e) {
    if (!this.r) return; const p = e.touches[0], dx = p.clientX - this.x0, dy = p.clientY - this.y0;
    if (!this.arah && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) this.arah = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    if (this.arah !== 'h') return;
    this.dx = dx; this.r.classList.add('menggeser'); this.r.style.transition = 'none';
    this.r.style.transform = 'translateX(' + Math.min(0, Math.max(-96, this.awal + dx)) + 'px)';
  },
  selesai() {
    const r = this.r; if (!r) return; this.r = null;
    r.style.transition = ''; r.classList.remove('menggeser');
    if (this.arah === 'h') { this.baru = Date.now(); const buka = this.awal + this.dx < -48; r.classList.toggle('geser', buka); r.style.transform = ''; }
  }
};
document.addEventListener('touchstart', (e) => Geser.mulai(e), { passive: true });
document.addEventListener('touchmove', (e) => Geser.gerak(e), { passive: true });
document.addEventListener('touchend', () => Geser.selesai());
document.addEventListener('touchcancel', () => Geser.selesai());
document.addEventListener('click', (e) => {
  const h = e.target.closest && e.target.closest('.tx-hapus'); if (h) { e.stopPropagation(); Geser.hapus(h.dataset.hapus); return; }
  const r = e.target.closest && e.target.closest('.tx.geser');
  if (Date.now() - Geser.baru < 350 || r) { e.stopPropagation(); e.preventDefault(); if (r) Geser.tutup(); }
}, true);
