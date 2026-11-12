/* Buku Kebun — Umpan Jurnal lintas siklus (Fase 6E Tahap 7, v0.1.104, docs/JURNAL.md)
   Chip "Jurnal" di tab Siklus: semua entri jurnal dari siklus yang lolos saringan Unit/Komoditas, terbaru dulu,
   dengan pencarian kata kunci dan saringan jenis. Ketuk entri membuka modal detail seperti di linimasa. */
const Umpan = {
  q: '', jenis: 'semua', n: 100, BATAS: 100,
  JENIS: [['semua', 'Semua'], ['catatan', 'Catatan'], ['tahap', 'Tahap'], ['kejadian', 'Kejadian'], ['ukuran', 'Ukuran'], ['kegiatan', 'Kegiatan']],

  semua(base) {
    const out = [];
    base.forEach((s) => Jurnal.of(s.id).forEach((j) => out.push({ s: s, j: j })));
    return out.sort((a, b) => b.j.tanggal.localeCompare(a.j.tanggal) || String(b.j.dibuat).localeCompare(String(a.j.dibuat)));
  },
  hitung(base) { return this.semua(base).length; },
  teks(e) {
    const x = Linimasa.isi(e.s, { k: 'catatan', j: e.j });
    return { x: x, hay: (x.judul + ' ' + (e.j.isi || '') + ' ' + x.label + ' ' + Siklus.nama(e.s.id)).toLowerCase() };
  },
  saring(base) {
    const q = this.q.trim().toLowerCase();
    return this.semua(base).map((e) => Object.assign(e, this.teks(e))).filter((e) => (this.jenis === 'semua' || e.j.jenis === this.jenis) && (!q || e.hay.indexOf(q) >= 0));
  },
  baris(e) {
    const j = e.j, h = Jurnal.hariKe(e.s, j.tanggal), x = e.x, ket = j.isi ? String(j.isi).replace(/\s+/g, ' ').slice(0, 90) + (String(j.isi).length > 90 ? '…' : '') : '';
    return '<div class="tx lm-baris" data-do="jurnal-detail" data-id="' + j.id + '" data-sid="' + e.s.id + '" role="button" tabindex="0" aria-haspopup="dialog"><span class="lm-ik" aria-hidden="true">' + x.ikon + '</span><div class="tx-l"><div class="note">' +
      Setelan.tgl(j.tanggal) + ' · hari ' + h + ' · <span class="lm-tag">' + x.label + '</span></div><div class="tx-n">' + esc(x.judul) + '</div>' + (ket && ket !== x.judul ? '<div class="note">' + esc(ket) + '</div>' : '') +
      '<div class="note">' + esc(Siklus.nama(e.s.id)) + '</div></div></div>';
  },
  hasil(base) {
    const L = this.saring(base);
    if (!L.length) return '<p class="note">' + (this.q || this.jenis !== 'semua' ? 'Tidak ada entri yang cocok.' : 'Belum ada entri jurnal. Buka siklus berjalan, lalu ketuk tombol + dan pilih Catat jurnal.') + '</p>';
    return '<p class="note" style="margin:10px 0 0">' + L.length + ' entri</p>' + L.slice(0, this.n).map((e) => this.baris(e)).join('') +
      (L.length > this.n ? '<button type="button" class="btn" data-do="uj-lagi" style="width:100%;margin-top:12px;min-height:44px">Tampilkan lebih banyak (sisa ' + (L.length - this.n) + ')</button>' : '');
  },
  v(base) {
    return '<div class="lap-aksi no-print" style="margin:12px 0 0"><button type="button" class="ikon-btn" data-an="cetak" aria-label="Cetak umpan jurnal atau simpan PDF">' + Analisa.IKON.cetak + '<span>Cetak</span></button></div>' +
      '<input type="search" id="uj_cari" class="cari" style="margin-top:12px" placeholder="Cari judul, isi, siklus" aria-label="Cari jurnal" value="' + esc(this.q) + '" autocomplete="off">' +
      '<div class="seg sm lm-filter" role="group" aria-label="Saring jenis entri">' + this.JENIS.map((c) => '<button type="button" class="btn' + (this.jenis === c[0] ? ' gold' : '') + '" data-do="uj-f" data-f="' + c[0] + '" aria-pressed="' + (this.jenis === c[0]) + '">' + c[1] + '</button>').join('') + '</div>' +
      '<div id="ujHasil" aria-live="polite">' + this.hasil(base) + '</div>';
  },
  basis() {
    const fu = Siklus.fu && Siklus.unit(Siklus.fu) ? Siklus.fu : '', fk = Siklus.fk && Siklus.kom(Siklus.fk) ? Siklus.fk : '';
    return Siklus.daftar().filter((s) => (!fu || s.unitId === fu) && (!fk || s.komoditasId === fk));
  },
  /* dokumen cetak polos: semua entri yang lolos saringan dan pencarian saat ini */
  cetakDoc() {
    const base = this.basis(), L = this.saring(base), fl = this.JENIS.find((c) => c[0] === this.jenis)[1];
    const fu = Siklus.fu && Siklus.unit(Siklus.fu) ? Siklus.unit(Siklus.fu).nama : 'Semua unit', fk = Siklus.fk && Siklus.kom(Siklus.fk) ? Siklus.kom(Siklus.fk).nama : 'Semua komoditas';
    const baris = L.map((e) => { const x = e.x; return '<tr><td>' + Setelan.tgl(e.j.tanggal) + '</td><td>' + esc(Siklus.nama(e.s.id)) + '</td><td>' + Jurnal.hariKe(e.s, e.j.tanggal) + '</td><td>' + x.label + '</td><td>' + esc(x.judul) + Linimasa.rinci(e.j, x.judul) + '</td></tr>'; }).join('');
    return '<div class="ct-kop"><h1>Jurnal Lintas Siklus</h1><p class="ct-sub">' + esc(fu) + ' · ' + esc(fk) + '</p><table class="ct-meta"><tr><th>Entri</th><td>' + L.length + '</td><th>Dicetak</th><td>' + Setelan.tgl(isoHari()) + '</td></tr>' +
      '<tr><th>Jenis</th><td>' + fl + '</td><th>Aplikasi</th><td>Buku Kebun v' + VERSI + '</td></tr>' + (this.q.trim() ? '<tr><th>Kata kunci</th><td colspan="3">' + esc(this.q.trim()) + '</td></tr>' : '') + '</table></div>' +
      '<div class="ct-bag ct-lanjut"><table class="ct-tab"><thead><tr><th>Tanggal</th><th>Siklus</th><th>Hari</th><th>Jenis</th><th>Keterangan</th></tr></thead><tbody>' + (baris || '<tr><td colspan="5">Tidak ada entri.</td></tr>') + '</tbody></table></div>';
  },
  ulang() { const el = document.getElementById('ujHasil'); if (el) { el.innerHTML = this.hasil(this.basis()); if (typeof Samar !== 'undefined') Samar.terapkan(); } },
  aksi(a, el) {
    if (a === 'uj-f') { this.jenis = el.dataset.f; this.n = this.BATAS; const y = window.scrollY; App.go('siklus', true); window.scrollTo(0, y); const b = document.querySelector('.lm-filter [data-f="' + this.jenis + '"]'); if (b) b.focus(); return true; }
    if (a === 'uj-lagi') { this.n += this.BATAS; this.ulang(); return true; }
    return false;
  },
  pasang() {
    document.addEventListener('input', (e) => {
      if (!e.target || e.target.id !== 'uj_cari') return;
      this.q = e.target.value; this.n = this.BATAS; clearTimeout(this._t); this._t = setTimeout(() => this.ulang(), 180);
    });
  }
};
Umpan.pasang();
