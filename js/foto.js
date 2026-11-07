/* Tani Keuangan — Foto jurnal siklus, lokal (v0.1.092, Fase 6E Tahap 4, docs/JURNAL.md)
   Memakai penyimpanan IndexedDB milik modul Nota (basis data "tani-nota"): foto dikecilkan (1280 px, JPEG) lalu disimpan sebagai blob.
   Catatan jurnal hanya menyimpan rujukan id foto di `jurnal.foto` (maks. 4, id berawalan f_). Foto tidak ikut ekspor JSON, cadangan otomatis,
   maupun sinkron cloud; di perangkat yang tidak punya fotonya, tampil penanda "tidak ada di perangkat ini". */
const Foto = {
  MAKS: 4, d: null,
  ada() { return typeof Nota !== 'undefined' && Nota.tersedia(); },

  /* ---------- draf formulir catatan ---------- */
  mulai(awal) { this.d = { awal: (awal || []).slice(), ids: (awal || []).slice(), baru: [], simpan: false, sibuk: 0 }; },
  ids() { return this.d ? this.d.ids.slice() : []; },
  /* catatan sudah tersimpan: foto lama yang dilepas dari catatan dihapus dari penyimpanan */
  disimpan() { const d = this.d; if (!d) return; d.simpan = true; d.awal.forEach((id) => { if (!d.ids.includes(id)) Nota.hapus(id); }); },
  /* modal ditutup: bila catatan tidak disimpan, foto yang baru dipilih dibuang */
  buang() { const d = this.d; this.d = null; if (!d || d.simpan) return; d.baru.forEach((id) => Nota.hapus(id)); },
  kotak() {
    return '<label for="f_jfoto">Foto (opsional, maksimal ' + this.MAKS + ')</label><div class="fj-box" id="fjBox" aria-live="polite"></div>' +
      '<input type="file" id="f_jfoto" accept="image/*" multiple hidden>';
  },
  isiBox() {
    const box = document.getElementById('fjBox'), d = this.d; if (!box || !d) return;
    if (!this.ada()) { box.innerHTML = '<p class="note">Foto tidak tersedia di browser ini.</p>'; return; }
    const t = d.ids.map((id, i) => '<div class="fj-t"><div class="fj-tb"><img alt="Foto ' + (i + 1) + '" data-foto="' + id + '"></div>' +
      '<button type="button" class="fj-x" data-rm="foto-lepas" data-id="' + id + '" aria-label="Hapus foto ' + (i + 1) + '">×</button></div>').join('');
    box.innerHTML = t + (d.ids.length < this.MAKS ? '<button type="button" class="btn nota-btn fj-tambah" data-rm="foto-pilih">' + (d.ids.length ? 'Tambah foto' : 'Ambil / pilih foto') + '</button>' : '') +
      '<p class="note">' + d.ids.length + ' dari ' + this.MAKS + ' foto · disimpan di browser ini</p>' + (d.sibuk ? '<p class="note" role="status">Memproses foto…</p>' : '');
    this.muat(box);
  },
  pilih(inp) {
    const d = this.d, fs = Array.prototype.slice.call(inp.files || []); inp.value = '';
    if (!d || !fs.length) return;
    const sisa = this.MAKS - d.ids.length;
    if (sisa <= 0) { App.toast('Maksimal ' + this.MAKS + ' foto'); return; }
    if (fs.length > sisa) App.toast('Hanya ' + sisa + ' foto lagi yang muat (maksimal ' + this.MAKS + ')');
    d.sibuk += 1; this.isiBox();
    fs.slice(0, sisa).reduce((p, f) => p.then(() => Nota.kecilkan(f)
      .then((b) => { const id = uid('f'); return Nota.simpan({ id: id, blob: b, tipe: b.type, ukuran: b.size, ms: Date.now() }).then(() => id); })
      .then((id) => { if (this.d !== d) { Nota.hapus(id); return; } d.ids.push(id); d.baru.push(id); this.isiBox(); })
      .catch((e) => { App.toast(Nota.galat(e)); })), Promise.resolve())
      .then(() => { if (this.d === d) { d.sibuk -= 1; this.isiBox(); } });
  },
  lepas(id) {
    const d = this.d; if (!d) return;
    d.ids = d.ids.filter((x) => x !== id);
    if (d.baru.includes(id)) { d.baru = d.baru.filter((x) => x !== id); Nota.hapus(id); }
    this.isiBox(); const t = document.querySelector('.fj-tambah'); if (t) t.focus();
  },

  /* ---------- gambar kecil (galeri, detail, formulir) ---------- */
  muat(root) {
    if (!root || !this.ada()) return;
    root.querySelectorAll('img[data-foto]:not([data-ok])').forEach((im) => {
      im.dataset.ok = '1';
      Nota.ambil(im.dataset.foto).then((r) => {
        if (!im.isConnected) return;
        if (!r) { this.hilang(im); return; }
        const u = URL.createObjectURL(r.blob); im.onload = im.onerror = () => URL.revokeObjectURL(u); im.src = u;
      }).catch(() => { if (im.isConnected) this.hilang(im); });
    });
  },
  hilang(im) {
    const p = im.parentNode; if (!p) return;
    p.classList.add('fj-hilang'); p.setAttribute('title', 'Foto tidak ada di perangkat ini (foto tidak ikut ekspor, cadangan, atau sinkron)');
    p.querySelectorAll('img').forEach((x) => x.remove());
    p.insertAdjacentHTML('afterbegin', '<span class="fj-ik" aria-hidden="true">🖼</span><span class="fj-tk">Tidak ada di perangkat ini</span>');
  },
  /* deretan gambar kecil yang membuka penampil; attr = atribut aksi tiap tombol */
  galeri(j, attr, kelas) {
    const L = j.foto || []; if (!L.length) return '';
    return '<div class="' + kelas + '" role="group" aria-label="Foto catatan: ' + esc(Jurnal.judul(j)) + '">' + L.map((id, i) =>
      '<button type="button" class="fj-th" ' + attr + ' data-id="' + j.id + '" data-i="' + i + '" aria-label="Lihat foto ' + (i + 1) + ' dari ' + L.length + '"><img alt="" data-foto="' + id + '"></button>').join('') + '</div>';
  },
  /* catatan dihapus: foto ikut dihapus setelah jendela Urungkan lewat; mengembalikan fungsi pembatal */
  hapusNanti(j) {
    const ids = (j.foto || []).slice(); if (!ids.length || !this.ada()) return () => {};
    const t = setTimeout(() => { if (j.terhapus) ids.forEach((id) => Nota.hapus(id)); }, 5600);
    return () => clearTimeout(t);
  },

  /* ---------- penampil layar penuh ---------- */
  lihat(ids, i) {
    if (!this.ada() || Modal.m || !ids || !ids.length) return false;
    const n = ids.length; let k = Math.min(Math.max(i || 0, 0), n - 1), tok = 0, url = null;
    const tampil = () => {
      const t = ++tok;
      Nota.ambil(ids[k]).then((r) => {
        const im = document.getElementById('flImg'), hl = document.getElementById('flHilang'); if (t !== tok || !im) return;
        document.getElementById('flNo').textContent = (k + 1) + ' / ' + n;
        if (url) { URL.revokeObjectURL(url); url = null; }
        if (!r) { im.hidden = true; hl.hidden = false; return; }
        url = URL.createObjectURL(r.blob); im.src = url; im.alt = 'Foto ' + (k + 1) + ' dari ' + n; im.hidden = false; hl.hidden = true;
      }).catch(() => { const hl = document.getElementById('flHilang'); if (t === tok && hl) { document.getElementById('flImg').hidden = true; hl.hidden = false; } });
    };
    const ganti = (d) => { if (n < 2) return; k = (k + d + n) % n; tampil(); };
    let el = null;
    const kd = (e) => { if (!Modal.m || Modal.m.el !== el) return; if (e.key === 'ArrowRight') { e.preventDefault(); ganti(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); ganti(-1); } };
    el = Modal.buka({ judulId: 'flJudul', fokus: 'flTutup', lapis: 'nota-lihat foto-lihat', kartu: 'nota-kartu', tutupLatar: true,
      html: '<h2 id="flJudul" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Foto catatan jurnal</h2>' +
        '<div class="fl-stage" id="flStage"><img id="flImg" alt="Foto catatan"><p class="fl-hilang" id="flHilang" hidden>Foto ini tidak ada di perangkat ini. Foto tidak ikut ekspor, cadangan, atau sinkron.</p></div>' +
        '<div class="fl-bar">' + (n > 1 ? '<button type="button" class="btn" data-fv="prev" aria-label="Foto sebelumnya">‹</button>' : '') + '<span class="fl-no" id="flNo" role="status" aria-live="polite"></span>' +
        (n > 1 ? '<button type="button" class="btn" data-fv="next" aria-label="Foto berikutnya">›</button>' : '') + '</div>' +
        '<button type="button" class="btn" id="flTutup" data-fv="tutup">Tutup</button>',
      klik: (e) => { const b = e.target.closest('[data-fv]'); if (!b) return; const a = b.dataset.fv; if (a === 'tutup') Modal.tutup(); else if (a === 'prev') ganti(-1); else if (a === 'next') ganti(1); },
      onTutup: () => { if (url) URL.revokeObjectURL(url); document.removeEventListener('keydown', kd); } });
    if (!el) return false;
    document.addEventListener('keydown', kd);
    const st = el.querySelector('#flStage'); let x0 = null, y0 = null;
    st.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    st.addEventListener('touchend', (e) => {
      if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) ganti(dx < 0 ? 1 : -1);
    });
    tampil(); return true;
  },

  /* ---------- Setelan: pemakaian dan penyimpanan tetap ---------- */
  ringkas() {
    return Nota.semua().then((L) => {
      const r = { nota: { n: 0, b: 0 }, jurnal: { n: 0, b: 0 } };
      L.forEach((x) => { const t = /^f_/.test(x.id) ? r.jurnal : r.nota; t.n++; t.b += x.ukuran || (x.blob && x.blob.size) || 0; });
      return r;
    });
  },
  async isiInfo() {
    const set = (t) => { const x = document.getElementById('notaInfo'); if (x) x.textContent = t; };
    if (!document.getElementById('notaInfo')) return;
    try {
      const r = await this.ringkas(), f = (o, nm) => nm + ': ' + (o.n ? o.n + ' foto · ' + Nota.mb(o.b) : 'belum ada');
      let t = f(r.nota, 'Nota') + '. ' + f(r.jurnal, 'Jurnal') + '.' + CadFoto.teks(await Nota.semua()); set(t);
      if (navigator.storage && navigator.storage.estimate) {
        const es = await navigator.storage.estimate();
        if (es && es.quota) t += ' Browser memakai ' + Nota.mb(es.usage || 0) + ' dari ±' + Nota.mb(es.quota) + ' (' + (((es.usage || 0) / es.quota) * 100).toFixed(1).replace('.', ',') + '%).';
        if (navigator.storage.persisted) t += ' Penyimpanan tetap: ' + ((await navigator.storage.persisted()) ? 'aktif' : 'belum') + '.';
        set(t);
      }
    } catch (e) { set('Tidak bisa dibaca.'); }
  },
  minta() {
    if (!navigator.storage || !navigator.storage.persist) return Promise.resolve('Browser ini tidak mendukung penyimpanan tetap');
    return navigator.storage.persisted().then((p) => p ? 'Penyimpanan tetap sudah aktif' :
      navigator.storage.persist().then((ok) => ok ? 'Penyimpanan tetap diaktifkan' : 'Browser belum mengizinkan penyimpanan tetap (biasanya setelah aplikasi dipasang atau sering dipakai)'))
      .catch(() => 'Permintaan penyimpanan tetap gagal');
  }
};
