/* Tani Keuangan — Linimasa siklus, Jurnal Tahap 2 (v0.1.089, docs/JURNAL.md §7)
   Satu halaman kronologis per siklus (tab `jurnal`, rute #jurnal-<id>): catatan jurnal + peristiwa turunan
   (mulai, selesai, transaksi, panen). Peristiwa turunan hanya dibaca dari data yang ada, tidak disalin; ketuk membuka aslinya. */
const Linimasa = {
  sid: null, f: 'semua', urut: 'baru', n: 100,
  FILTER: [['semua', 'Semua'], ['catatan', 'Catatan'], ['uang', 'Uang'], ['panen', 'Panen'], ['kegiatan', 'Kegiatan']],
  BATAS: 100,

  siap(s) { if (this.sid !== s.id) { this.sid = s.id; this.f = 'semua'; this.urut = 'baru'; this.n = this.BATAS; } },
  grup(k) { return k === 'mulai' || k === 'selesai' ? 'semua' : k; },

  /* semua peristiwa siklus; rank: mulai 0, entri 1, selesai 2 (urutan dalam hari yang sama) */
  peristiwa(s) {
    const E = [], sat = (Siklus.kom(s.komoditasId) || {}).satuan || '';
    E.push({ k: 'mulai', tgl: s.mulai, rank: 0, dibuat: '' });
    if (s.status === 'selesai' && s.selesai) E.push({ k: 'selesai', tgl: s.selesai, rank: 2, dibuat: '' });
    Jurnal.of(s.id).forEach((j) => E.push({ k: j.jenis === 'kegiatan' ? 'kegiatan' : 'catatan', tgl: j.tanggal, rank: 1, dibuat: String(j.dibuat || ''), j: j }));
    App.aktif().filter((t) => t.siklusId === s.id).forEach((t) => E.push({ k: 'uang', tgl: t.tanggal, rank: 1, dibuat: String(t.dibuat || ''), t: t }));
    Siklus.panenOf(s.id).forEach((p) => E.push({ k: 'panen', tgl: p.tanggal, rank: 1, dibuat: String(p.dibuat || ''), p: p, sat: sat }));
    const mul = this.urut === 'lama' ? 1 : -1;
    return E.sort((a, b) => mul * (a.tgl.localeCompare(b.tgl) || a.rank - b.rank || a.dibuat.localeCompare(b.dibuat)));
  },
  tampil(E) { return this.f === 'semua' ? E : E.filter((e) => e.k === this.f); },
  minggu(s, tgl) { const h = Jurnal.hariKe(s, tgl); return h < 1 ? 0 : Math.ceil(h / 7); },
  rentang(s, m) { // tanggal awal–akhir minggu ke-m
    const p = s.mulai.split('-').map(Number), a = new Date(p[0], p[1] - 1, p[2] + (m - 1) * 7), b = new Date(p[0], p[1] - 1, p[2] + m * 7 - 1);
    const f = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return Setelan.tgl(f(a)) + ' – ' + Setelan.tgl(f(b));
  },

  /* teks satu peristiwa: { ikon, judul, ket, nilai, kelas, ket2 } */
  isi(s, e) {
    if (e.k === 'mulai') return { ikon: '🌱', judul: 'Siklus dimulai', ket: '', turunan: true };
    if (e.k === 'selesai') return { ikon: '🏁', judul: 'Siklus selesai', ket: '', turunan: true };
    if (e.k === 'uang') {
      const t = e.t, m = t.jenis === 'masuk';
      return { ikon: m ? '↑' : '↓', judul: App.namaKat(t.kategoriId), ket: t.catatan || '', nilai: (m ? '+' : '−') + rp(t.jumlah).replace('Rp ', 'Rp '), kelas: m ? 'up' : 'down', turunan: true, edit: t.id, label: m ? 'Hasil' : 'Modal' };
    }
    if (e.k === 'panen') {
      const p = e.p;
      return { ikon: '🧺', judul: 'Panen ' + fmtN(p.kuantitasKotor - p.susut) + ' ' + e.sat + ' bersih', ket: (p.susut ? 'susut ' + fmtN(p.susut) : '') + (p.pembeli ? (p.susut ? ' · ' : '') + p.pembeli : ''), turunan: true, panen: p.id, label: 'Panen' };
    }
    const j = e.j;
    const ket = j.judul && j.isi ? String(j.isi).replace(/\s+/g, ' ').slice(0, 90) + (String(j.isi).length > 90 ? '…' : '') : '';
    return { ikon: j.jenis === 'kegiatan' ? '✓' : j.jenis === 'tahap' ? '❖' : j.evaluasi ? '★' : '✎', judul: Jurnal.judul(j), ket: ket, jurnal: j.id, label: j.jenis === 'kegiatan' ? 'Kegiatan' : j.jenis === 'tahap' ? 'Tahap' : j.evaluasi ? 'Evaluasi' : 'Catatan' };
  },
  baris(s, e) {
    const x = this.isi(s, e), h = Jurnal.hariKe(s, e.tgl);
    const att = x.edit ? ' data-edit="' + x.edit + '"' : x.panen ? ' data-do="panen-detail" data-id="' + x.panen + '" aria-haspopup="dialog"' : x.jurnal ? ' data-do="jurnal-detail" data-id="' + x.jurnal + '" aria-haspopup="dialog"' : '';
    const tag = x.label ? '<span class="lm-tag">' + x.label + '</span>' : '';
    const meta = Setelan.tgl(e.tgl) + (h >= 1 ? ' · hari ' + h : ' · sebelum mulai');
    const inner = '<span class="lm-ik" aria-hidden="true">' + x.ikon + '</span><div class="tx-l"><div class="note">' + meta + (tag ? ' · ' : '') + tag + '</div><div class="tx-n">' + esc(x.judul) + '</div>' + (x.ket ? '<div class="note">' + esc(x.ket) + '</div>' : '') + '</div>' +
      (x.nilai ? '<div class="tx-a ' + x.kelas + '">' + x.nilai + '</div>' : '');
    return att ? '<div class="tx lm-baris' + (x.turunan ? ' lm-turun' : '') + '"' + att + ' role="button" tabindex="0">' + inner + '</div>'
      : '<div class="tx lm-baris lm-turun lm-diam">' + inner + '</div>';
  },
  daftar(s, L) {
    let h = '', last = null;
    L.slice(0, this.n).forEach((e) => {
      const m = this.minggu(s, e.tgl);
      if (m !== last) { last = m; h += '<h3 class="lm-minggu">' + (m === 0 ? 'Sebelum mulai' : 'Minggu ke-' + m + ' <span class="note">· ' + this.rentang(s, m) + '</span>') + '</h3>'; }
      h += this.baris(s, e);
    });
    return h;
  },

  v() {
    const s = Siklus.cari(Siklus.sid);
    if (!s) return Siklus.vList();
    this.siap(s);
    const E = this.peristiwa(s), L = this.tampil(E), jalan = s.status === 'berjalan';
    const hit = (k) => E.filter((e) => e.k === k).length;
    const chip = this.FILTER.map((c) => '<button type="button" class="btn' + (this.f === c[0] ? ' gold' : '') + '" data-do="lm-f" data-f="' + c[0] + '" aria-pressed="' + (this.f === c[0]) + '">' + c[1] + '</button>').join('');
    const r = Siklus.ringkas(s.id), u = r.hasil - r.modal;
    const kiri = '<div class="dt-kiri"><section><div class="sc-head"><h2 style="margin:0">Ringkasan</h2><span class="badge' + (jalan ? ' live' : '') + '">' + (jalan ? 'berjalan' : 'selesai') + '</span></div>' +
      '<p class="note" style="margin:8px 0 0">Mulai ' + Setelan.tgl(s.mulai) + (jalan ? ' · hari ' + Siklus.hari(s) : ' · selesai ' + Setelan.tgl(s.selesai) + ' (' + Siklus.hari(s) + ' hari)') + '</p>' +
      '<div class="row"><span class="mu">Catatan</span><span>' + hit('catatan') + '</span></div><div class="row"><span class="mu">Kegiatan</span><span>' + hit('kegiatan') + '</span></div>' +
      '<div class="row"><span class="mu">Transaksi</span><span>' + hit('uang') + '</span></div><div class="row"><span class="mu">Panen</span><span>' + hit('panen') + '</span></div>' +
      '<div class="row"><span class="mu">' + (u < 0 ? 'Rugi' : 'Untung') + '</span><span class="' + (u < 0 ? 'down' : 'up') + '">' + rp(u) + '</span></div>' +
      '<button type="button" class="btn" data-go="siklus-detail" style="width:100%;margin-top:12px;min-height:44px">Kembali ke detail siklus</button></section></div>';
    const kanan = '<div class="dt-kanan"><section><div class="sc-head"><h2 style="margin:0">Linimasa</h2>' +
      '<div class="lap-aksi no-print" style="margin:0"><button type="button" class="ikon-btn" data-an="cetak" aria-label="Cetak linimasa atau simpan PDF">' + Analisa.IKON.cetak + '<span>Cetak</span></button></div></div>' +
      '<div class="seg sm lm-filter no-print" role="group" aria-label="Saring linimasa">' + chip + '</div>' +
      '<div class="seg sm lm-urut no-print" style="margin-top:8px"><button type="button" class="btn" data-do="lm-urut" aria-label="Urutan: ' + (this.urut === 'baru' ? 'terbaru dulu' : 'terlama dulu') + '. Ketuk untuk membalik">' + (this.urut === 'baru' ? '↓ Terbaru' : '↑ Terlama') + '</button></div>' +
      (L.length ? this.daftar(s, L) + (L.length > this.n ? '<button type="button" class="btn" data-do="lm-lagi" style="width:100%;margin-top:12px;min-height:44px">Tampilkan lebih banyak (sisa ' + (L.length - this.n) + ')</button>' : '')
        : '<p class="note">Belum ada ' + (this.f === 'semua' ? 'peristiwa' : this.FILTER.find((c) => c[0] === this.f)[1].toLowerCase()) + '.</p>') +
      '<p class="note">Baris berikon redup berasal dari transaksi, panen, atau siklus; ketuk untuk membuka aslinya.' + (jalan ? ' Ketuk tombol + untuk mencatat jurnal.' : '') + '</p></section></div>';
    return kanan + kiri; // di HP linimasa dulu; di desktop kolom diatur CSS
  },

  /* dokumen cetak polos linimasa (urutan lama → baru, semua peristiwa) */
  cetakDoc() {
    const s = Siklus.cari(Siklus.sid), urut = this.urut; this.urut = 'lama';
    const E = this.peristiwa(s); this.urut = urut;
    const k = Siklus.kom(s.komoditasId) || {};
    let baris = '';
    E.forEach((e) => {
      const x = this.isi(s, e), h = Jurnal.hariKe(s, e.tgl);
      baris += '<tr><td>' + Setelan.tgl(e.tgl) + '</td><td>' + (h >= 1 ? h : '—') + '</td><td>' + (x.label || (e.k === 'mulai' ? 'Mulai' : 'Selesai')) + '</td><td>' + esc(x.judul) + (e.j && e.j.isi ? '<br>' + esc(e.j.isi).replace(/\n/g, '<br>') : x.ket ? '<br>' + esc(x.ket) : '') + '</td><td class="n">' + (x.nilai || '') + '</td></tr>';
    });
    return '<div class="ct-kop"><h1>Jurnal Siklus</h1><p class="ct-sub">' + esc(Siklus.nama(s.id)) + '</p><table class="ct-meta"><tr><th>Komoditas</th><td>' + esc(k.nama || '—') + '</td><th>Dicetak</th><td>' + Setelan.tgl(isoHari()) + '</td></tr>' +
      '<tr><th>Mulai</th><td>' + Setelan.tgl(s.mulai) + '</td><th>Aplikasi</th><td>Tani Keuangan v' + VERSI + '</td></tr></table></div>' +
      '<div class="ct-bag"><table class="ct-tab"><tr><th>Tanggal</th><th>Hari</th><th>Jenis</th><th>Keterangan</th><th class="n">Nilai</th></tr>' + baris + '</table></div>';
  },

  aksi(a, el) {
    const ulang = () => { const y = window.scrollY; App.go('jurnal', true); window.scrollTo(0, y); };
    if (a === 'lm-f') { this.f = el.dataset.f; this.n = this.BATAS; ulang(); const b = document.querySelector('.lm-filter [data-f="' + this.f + '"]'); if (b) b.focus(); return true; }
    if (a === 'lm-urut') { this.urut = this.urut === 'baru' ? 'lama' : 'baru'; this.n = this.BATAS; ulang(); const b = document.querySelector('[data-do="lm-urut"]'); if (b) b.focus(); return true; }
    if (a === 'lm-lagi') { this.n += this.BATAS; ulang(); return true; }
    if (a === 'jurnal-linimasa') { App.go('jurnal'); return true; }
    return false;
  }
};
