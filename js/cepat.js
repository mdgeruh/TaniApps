/* Buku Kebun — Catatan cepat Jurnal: chip satu ketukan yang langsung membuat catatan kegiatan hari ini (v0.1.100, docs/JURNAL.md bagian 6)
   Entri = jurnal jenis 'kegiatan' dengan cepat:true (judul = nama kegiatan, tanggal = hari ini). Tidak memengaruhi uang atau laporan.
   Chip mengikuti jenis komoditas siklus. Toast memberi Urungkan dan Tambah detail (membuka formulir Ubah catatan untuk isi atau foto). */
const Cepat = {
  TABEL: {
    Umum: ['Siram', 'Pupuk', 'Semprot', 'Penyiangan', 'Pindah tanam'],
    'Sayur daun': ['Siram', 'Pupuk', 'Semprot', 'Penyiangan', 'Pindah tanam'],
    Cabai: ['Siram', 'Pupuk', 'Semprot', 'Penyiangan', 'Pindah tanam'],
    Tomat: ['Siram', 'Pupuk', 'Semprot', 'Pasang ajir', 'Pangkas tunas'],
    Lele: ['Beri pakan', 'Ganti air', 'Cek kualitas air', 'Sortir', 'Probiotik'],
    'Ayam petelur': ['Beri pakan', 'Ganti air minum', 'Bersihkan kandang', 'Vaksin', 'Vitamin']
  },
  _t: { k: '', n: 0 },
  daftar(s) { const k = Siklus.kom(s.komoditasId), tp = k && Siklus.templateUntuk(k.nama); return (tp && this.TABEL[tp.label]) || this.TABEL.Umum; },
  /* hanya siklus berjalan yang sudah mulai (tanggal catatan tidak boleh sebelum mulai atau di masa depan) */
  boleh(s) { return !!s && s.status === 'berjalan' && s.mulai <= isoHari(); },
  chips(s) {
    if (!this.boleh(s)) return '';
    return '<div class="jr-cepat no-print"><div class="note" style="margin:6px 0 2px">Catat cepat hari ini, satu ketukan</div>' +
      '<div class="seg sm rc-chips" role="group" aria-label="Catat cepat kegiatan" style="justify-content:flex-start;margin:0 0 6px">' +
      this.daftar(s).map((n) => '<button type="button" class="btn" data-do="jurnal-cepat" data-sid="' + s.id + '" data-k="' + esc(n) + '">' + esc(n) + '</button>').join('') +
      '<button type="button" class="btn" data-do="jurnal-baru" data-sid="' + s.id + '">+ Catatan lain</button></div></div>';
  },
  aksi(a, el) {
    if (a !== 'jurnal-cepat' && a !== 'jurnal-baru') return false;
    const s = Siklus.cari(el.dataset.sid); if (!s) return true;
    Siklus.sid = s.id;
    if (a === 'jurnal-baru') { Rencana.dlgBuka('jurnal'); return true; }
    this.buat(s, el.dataset.k); return true;
  },
  buat(s, nama) {
    if (!this.boleh(s) || !nama) return;
    const kini = Date.now(); if (this._t.k === s.id + '|' + nama && kini - this._t.n < 2500) return; // cegah ketukan ganda
    this._t = { k: s.id + '|' + nama, n: kini };
    const n = nowIso(), x = { id: uid('jr'), siklusId: s.id, tanggal: isoHari(), jenis: 'kegiatan', judul: nama, isi: '', cepat: true, dibuat: n, diubah: n, terhapus: false };
    Jurnal.semua().push(x); s.diubah = n; App.simpan(); App.go(App.tab, true);
    App.toast('Dicatat: ' + nama, [
      { label: 'Urungkan', fn: () => { x.terhapus = true; x.diubah = nowIso(); s.diubah = nowIso(); App.simpan(); App.go(App.tab, true); } },
      { label: 'Tambah detail', fn: () => { Siklus.sid = s.id; Rencana.dlgBuka('jurnal', x.id); } }
    ]);
  }
};
