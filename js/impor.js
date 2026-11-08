/* Buku Kebun — Pratinjau impor data (v0.1.102, docs/IMPOR.md)
   Impor JSON (cadangan), CSV (transaksi), dan ZIP foto tidak lagi langsung berjalan: isi berkas dianalisis dulu (tanpa mengubah data),
   ditampilkan di modal (Modal, docs/MODAL.md), baru dijalankan setelah "Impor". Berhasil: toast ringkasan (+ Urungkan untuk JSON dan CSV). */
const Impor = {
  MAKSJSON: 20 * 1048576, MAKSCSV: 5 * 1048576,
  KOL: [['transaksi', 'Transaksi'], ['siklus', 'Siklus'], ['panen', 'Panen'], ['jurnal', 'Jurnal'], ['unit', 'Unit'], ['komoditas', 'Komoditas'], ['aset', 'Aset'], ['utang', 'Utang/piutang'], ['kategori', 'Kategori']],
  kb(n) { return n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; },
  baris(a, b) { return '<div class="row"><span class="mu">' + a + '</span><span style="text-align:right">' + b + '</span></div>'; },
  berkas(i) { return i && i.nama ? this.baris('Berkas', esc(i.nama) + (i.ukuran ? ' · ' + this.kb(i.ukuran) : '')) : this.baris('Sumber', 'teks yang ditempel'); },
  galat(teks, lapor) { if (lapor) lapor(teks); App.toast(teks); },
  /* jendela pratinjau; o = { kicker, judul, isi (html), ok: { teks, fn } | null, fokus } */
  tampil(o) {
    if (Modal.m) { App.toast('Tutup jendela yang terbuka dulu'); return false; }
    return !!Modal.buka({ judulId: 'imJudul', tutupLatar: false, fokus: o.fokus || (o.ok ? 'imOk' : 'imBatal'),
      html: '<div class="dm-kepala"><div><div class="dm-jenis">' + o.kicker + '</div><h2 class="dm-judul" id="imJudul">' + o.judul + '</h2></div>' +
        '<button type="button" class="dm-x" data-im="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="dm-isi">' + o.isi + '</div><div class="dm-aksi">' + (o.ok ? '<button type="button" class="btn gold" id="imOk" data-im="ok">' + o.ok.teks + '</button>' : '') +
        '<button type="button" class="btn" id="imBatal" data-im="tutup" style="width:100%">' + (o.ok ? 'Batal' : 'Tutup') + '</button></div>',
      klik: (e) => { const x = e.target.closest('[data-im]'); if (!x) return; if (x.dataset.im === 'tutup') Modal.tutup(); else if (o.ok) { Modal.tutup(true); o.ok.fn(); } } });
  },
  /* ---------- JSON: mengganti seluruh data ---------- */
  json(teks, info, lapor) {
    info = info || {};
    let o; try { o = JSON.parse(teks); } catch (e) { return this.galat('JSON tidak valid.', lapor); }
    const kunci = this.KOL.map((x) => x[0]);
    if (!o || typeof o !== 'object' || Array.isArray(o) || !kunci.some((k) => k in o)) return this.galat('Format tidak dikenali: ini bukan berkas ekspor Buku Kebun. Data tidak diubah.', lapor);
    const r = Store.dari(o), D = App.data, n = (d, k) => (d[k] || []).filter((x) => !x.terhapus).length;
    let tf = 0, tk = 0;
    const kini = [], file = [];
    const grid = this.KOL.map((x) => { const a = n(D, x[0]), b = n(r.data, x[0]); tk += a; tf += b; kini.push(a); file.push(b);
      return '<span>' + x[1] + '</span><span style="text-align:right">' + fmtN(a) + '</span><span style="text-align:right" class="' + (b < a ? 'down' : '') + '">' + fmtN(b) + '</span>'; }).join('');
    const terbaru = (d) => (d.transaksi || []).filter((t) => !t.terhapus).map((t) => t.tanggal).concat((d.jurnal || []).filter((j) => !j.terhapus).map((j) => j.tanggal)).sort().pop();
    const t1 = terbaru(D), t2 = terbaru(r.data);
    const isi = '<p class="note" style="margin:0 0 10px"><strong>Impor mengganti seluruh data</strong> di browser ini dengan isi berkas. Salinan data sekarang disimpan otomatis di Cadangan otomatis dan bisa diurungkan setelah impor.</p>' +
      this.berkas(info) + this.baris('Catatan terbaru', 'sekarang ' + (t1 ? Setelan.tgl(t1) : '—') + ' · berkas ' + (t2 ? Setelan.tgl(t2) : '—')) +
      '<div style="display:grid;grid-template-columns:1fr auto auto;gap:6px 18px;margin-top:12px;font-size:13px"><span class="note">Isi</span><span class="note" style="text-align:right">Sekarang</span><span class="note" style="text-align:right">Berkas</span>' + grid + '</div>' +
      (tf < tk ? '<p class="note down" style="margin-top:12px">Berkas ini memuat lebih sedikit data daripada yang ada sekarang.</p>' : '') +
      (!tf ? '<p class="note down" style="margin-top:12px">Berkas ini tidak berisi data. Mengimpor akan mengosongkan data sekarang.</p>' : '') +
      (r.dibuang ? '<p class="note" style="margin-top:12px">' + r.dibuang + ' bagian tidak valid akan dilewati.</p>' : '');
    return this.tampil({ kicker: 'Impor cadangan JSON', judul: 'Pratinjau impor', isi: isi, fokus: 'imBatal', ok: { teks: 'Impor dan ganti data', fn: () => {
      const lama = App.data, h = App.pasangData(o);
      const ring = [['transaksi', 'transaksi'], ['siklus', 'siklus'], ['panen', 'panen'], ['jurnal', 'catatan jurnal']].map((x) => [n(h.data, x[0]), x[1]]).filter((x) => x[0]).map((x) => fmtN(x[0]) + ' ' + x[1]).join(', ');
      const pesan = 'Impor berhasil' + (ring ? ': ' + ring : '') + (h.dibuang ? ' (' + h.dibuang + ' bagian dilewati)' : '');
      if (lapor) lapor(pesan + '. Salinan data sebelumnya ada di Cadangan otomatis.');
      App.toast(pesan, { label: 'Urungkan', fn: () => { App.pasangData(lama); if (lapor) lapor('Impor diurungkan.'); App.toast('Impor diurungkan'); } });
    } } });
  },
  /* ---------- CSV: menambah transaksi ---------- */
  csv(a, info, lapor) {
    const sampel = a.baris.slice(0, 5).map((r) => '<div class="tx" style="cursor:default"><div class="tx-l"><div class="tx-n">' + esc(r.nama || '(tanpa kategori)') + '</div><div class="note">' + Setelan.tgl(r.tgl) + (r.catatan ? ' · ' + esc(r.catatan.slice(0, 40)) : '') + '</div></div><div class="tx-a ' + (r.jenis === 'masuk' ? 'up' : 'down') + '">' + (r.jenis === 'masuk' ? '+' : '−') + rp(r.jml) + '</div></div>').join('');
    const isi = this.berkas(info) + this.baris('Baris terbaca', fmtN(a.total)) + this.baris('Akan diimpor', '<strong>' + fmtN(a.baris.length) + ' transaksi</strong>') +
      (a.lewat ? this.baris('Dilewati', '<span class="down">' + fmtN(a.lewat) + ' baris</span>') : '') +
      (a.baris.length ? this.baris('Rentang tanggal', Setelan.tgl(a.dari) + ' – ' + Setelan.tgl(a.sampai)) + this.baris('Modal (keluar)', '<span class="down">' + rp(a.keluar) + '</span>') + this.baris('Hasil (masuk)', '<span class="up">' + rp(a.masuk) + '</span>') : '') +
      (a.kategoriBaru.length ? this.baris('Kategori baru', esc(a.kategoriBaru.join(', '))) : '') +
      (a.tanpaKategori ? this.baris('Tanpa kategori', fmtN(a.tanpaKategori) + ' baris (masuk ke kategori terakhir)') : '') +
      (a.kembar ? '<p class="note down" style="margin-top:12px">' + fmtN(a.kembar) + ' baris sama persis dengan transaksi yang sudah ada. Impor sekali lagi akan menggandakannya.</p>' : '') +
      (a.lewat ? '<p class="note" style="margin-top:12px">Baris dilewati bila tanggal bukan YYYY-MM-DD, jenis bukan masuk/keluar, atau jumlah tidak lebih dari 0.</p>' : '') +
      (sampel ? '<div class="dm-sub" style="font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--paper-faint);margin:16px 0 2px">Contoh baris</div>' + sampel : '') +
      '<p class="note" style="margin-top:12px">Transaksi ditambahkan tanpa siklus; data yang ada tidak diganti.</p>';
    if (!a.baris.length) return this.tampil({ kicker: 'Impor CSV', judul: 'Tidak ada yang bisa diimpor', isi: isi, ok: null });
    return this.tampil({ kicker: 'Impor CSV', judul: 'Pratinjau impor', isi: isi, fokus: 'imOk', ok: { teks: 'Impor ' + fmtN(a.baris.length) + ' transaksi', fn: () => {
      const h = App.terapkanCsv(a), pesan = fmtN(h.ids.length) + ' transaksi diimpor' + (a.lewat ? ', ' + a.lewat + ' baris dilewati' : '');
      if (lapor) lapor(pesan + '.');
      App.toast('Impor berhasil: ' + pesan, { label: 'Urungkan', fn: () => { App.batalkanCsv(h); if (lapor) lapor('Impor diurungkan.'); App.toast('Impor diurungkan'); } });
    } } });
  },
  /* ---------- ZIP foto: menambah foto ---------- */
  foto(k, info, jalankan) {
    const isi = this.berkas(info) + this.baris('Foto di berkas', fmtN(k.baru + k.ada + k.lewat)) + this.baris('Akan dipulihkan', '<strong>' + fmtN(k.baru) + ' foto</strong>') +
      (k.ada ? this.baris('Sudah ada (dilewati)', fmtN(k.ada)) : '') + (k.lewat ? this.baris('Tidak valid (dilewati)', '<span class="down">' + fmtN(k.lewat) + '</span>') : '') +
      '<p class="note" style="margin-top:12px">Foto yang sudah ada di perangkat ini tidak diganti.</p>';
    return this.tampil({ kicker: 'Pulihkan foto dari ZIP', judul: 'Pratinjau pemulihan', isi: isi, fokus: 'imOk', ok: { teks: 'Pulihkan ' + fmtN(k.baru) + ' foto', fn: jalankan } });
  }
};
