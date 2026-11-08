/* Buku Kebun — status tombol pilihan untuk pembaca layar (v0.1.105, docs/AUDIT.md)
   Kelompok tombol yang hanya berisi tombol/tautan dan salah satunya berkelas "on" (chip 6 bulan, Semua, Berjalan, Periode bulanan, dsb.)
   diberi aria-pressed true/false agar pilihan aktif tidak hanya terlihat dari warna. Dijalankan lagi tiap tampilan berubah. */
const Aks = {
  sinkron(akar) {
    const grup = new Set();
    (akar || document).querySelectorAll('button.on, a.btn.on').forEach((e) => { if (e.parentElement) grup.add(e.parentElement); });
    grup.forEach((p) => {
      const anak = [...p.children]; if (anak.length < 2 || !anak.every((x) => x.tagName === 'BUTTON' || x.tagName === 'A')) return;
      anak.forEach((x) => { if (x.hasAttribute('aria-current') || x.hasAttribute('aria-selected') || x.hasAttribute('aria-expanded')) return; x.setAttribute('aria-pressed', x.classList.contains('on') ? 'true' : 'false'); });
    });
  },
  pasang() {
    let t = 0; const jalan = () => { t = 0; this.sinkron(document); };
    new MutationObserver(() => { if (!t) t = requestAnimationFrame(jalan); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    jalan();
  }
};
Aks.pasang();
