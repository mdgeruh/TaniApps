/* Buku Kebun — Linimasa siklus, Jurnal Tahap 2 (v0.1.089, docs/JURNAL.md §7)
   Satu halaman kronologis per siklus (tab `jurnal`, rute #jurnal-<id>): catatan jurnal + peristiwa turunan
   (mulai, selesai, transaksi, panen). Peristiwa turunan hanya dibaca dari data yang ada, tidak disalin; ketuk membuka aslinya. */
const Linimasa = {
  pilih: null, sid: null, f: 'semua', urut: 'baru', n: 100,
  FILTER: [['semua', 'Semua'], ['catatan', 'Catatan'], ['uang', 'Uang'], ['panen', 'Panen'], ['kegiatan', 'Kegiatan']],
  BATAS: 100,

  siap(s) { if (this.sid !== s.id) { this.sid = s.id; this.pilih = null; this.f = 'semua'; this.urut = 'baru'; this.n = this.BATAS; } },
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
    return E.sort((a, b) => mul * (a.tgl.localeCompare(b.tgl) || a.rank - b.rank || a.dibuat.localeCompare(b.dibuat) || this.kunci(a).localeCompare(this.kunci(b))));
  },
  lebar() { return window.matchMedia && window.matchMedia('(min-width:1100px)').matches; },
  /* panel detail di kiri (desktop): catatan jurnal terpilih menggantikan Ringkasan, tanpa modal */
  panel(s, j) {
    const h = Jurnal.hariKe(s, j.tanggal), boleh = Jurnal.boleh(s, j);
    return '<div class="dt-kiri"><section aria-label="Detail catatan"><div class="sc-head"><h2 style="margin:0;overflow-wrap:anywhere">' + esc(Jurnal.judul(j)) + '</h2><button type="button" class="dm-x" data-do="lm-tutup" aria-label="Tutup detail (Esc)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<p class="note" style="margin:8px 0 12px">' + Setelan.tgl(j.tanggal) + ' · hari ' + h + ' · minggu ' + Math.max(1, Math.ceil(h / 7)) + (j.evaluasi ? ' · evaluasi' : '') + '</p>' + Kejadian.detail(j) +
      (j.isi ? '<div style="white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.65">' + esc(j.isi) + '</div>' : (j.foto && j.foto.length ? '' : '<p class="note">Tidak ada isi.</p>')) +
      Foto.galeri(j, 'data-do="foto-lihat"', 'lm-galeri') +
      (boleh ? '<div class="seg" style="margin-top:14px"><button type="button" class="btn gold" data-do="lm-ubah" data-id="' + j.id + '" style="margin-top:0">Ubah</button><button type="button" class="btn danger" data-do="lm-hapus" data-id="' + j.id + '">Hapus</button></div>' : '') + '</section></div>';
  },
  fotoAda(s) { return typeof Foto !== 'undefined' && Foto.ada() && Jurnal.of(s.id).some((j) => (j.foto || []).length); },
  kunci(e) { return String((e.j || e.t || e.p || {}).id || ''); },
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
    return { ikon: j.jenis === 'kegiatan' ? '✓' : j.jenis === 'tahap' ? '❖' : j.jenis === 'kejadian' ? '⚠' : j.jenis === 'ukuran' ? '↕' : j.evaluasi ? '★' : '✎', judul: Jurnal.judul(j), ket: ket, jurnal: j.id, label: j.jenis === 'kegiatan' ? 'Kegiatan' : j.jenis === 'tahap' ? 'Tahap' : j.jenis === 'kejadian' ? 'Kejadian' : j.jenis === 'ukuran' ? 'Ukuran' : j.evaluasi ? 'Evaluasi' : 'Catatan' };
  },
  baris(s, e) {
    const x = this.isi(s, e), h = Jurnal.hariKe(s, e.tgl);
    const att = x.edit ? ' data-edit="' + x.edit + '"' : x.panen ? ' data-do="panen-detail" data-id="' + x.panen + '" aria-haspopup="dialog"' : x.jurnal ? ' data-do="jurnal-detail" data-id="' + x.jurnal + '" aria-haspopup="dialog"' : '';
    const tag = x.label ? '<span class="lm-tag">' + x.label + '</span>' : '';
    const meta = Setelan.tgl(e.tgl) + (h >= 1 ? ' · hari ' + h : ' · sebelum mulai');
    const inner = '<span class="lm-ik" aria-hidden="true">' + x.ikon + '</span><div class="tx-l"><div class="note">' + meta + (tag ? ' · ' : '') + tag + '</div><div class="tx-n">' + esc(x.judul) + '</div>' + (x.ket ? '<div class="note">' + esc(x.ket) + '</div>' : '') + '</div>' +
      (x.nilai ? '<div class="tx-a ' + x.kelas + '">' + x.nilai + '</div>' : '');
    const gal = x.jurnal ? Foto.galeri(e.j, 'data-do="foto-lihat"', 'lm-galeri no-print') : '';
    return (att ? '<div class="tx lm-baris' + (x.turunan ? ' lm-turun' : '') + (x.jurnal && x.jurnal === this.pilih ? ' lm-sel' : '') + '"' + (x.jurnal && x.jurnal === this.pilih ? ' aria-current="true"' : '') + att + ' role="button" tabindex="0">' + inner + '</div>'
      : '<div class="tx lm-baris lm-turun lm-diam">' + inner + '</div>') + gal;
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
    const jp = this.pilih && Jurnal.cari(this.pilih), ringkas = '<div class="dt-kiri"><section><div class="sc-head"><h2 style="margin:0">Ringkasan</h2><span class="badge' + (jalan ? ' live' : '') + '">' + (jalan ? 'berjalan' : 'selesai') + '</span></div>' +
      '<p class="note" style="margin:8px 0 0">Mulai ' + Setelan.tgl(s.mulai) + (jalan ? ' · hari ' + Siklus.hari(s) : ' · selesai ' + Setelan.tgl(s.selesai) + ' (' + Siklus.hari(s) + ' hari)') + '</p>' +
      '<div class="row"><span class="mu">Catatan</span><span>' + hit('catatan') + '</span></div><div class="row"><span class="mu">Kegiatan</span><span>' + hit('kegiatan') + '</span></div>' +
      '<div class="row"><span class="mu">Transaksi</span><span>' + hit('uang') + '</span></div><div class="row"><span class="mu">Panen</span><span>' + hit('panen') + '</span></div>' +
      '<div class="row"><span class="mu">' + (u < 0 ? 'Rugi' : 'Untung') + '</span><span class="' + (u < 0 ? 'down' : 'up') + '">' + rp(u) + '</span></div>' +
      '<button type="button" class="btn" data-go="siklus-detail" style="width:100%;margin-top:12px;min-height:44px">Kembali ke detail siklus</button></section></div>';
    const kiri = jp && jp.siklusId === s.id && this.lebar() ? this.panel(s, jp) : ringkas;
    const kanan = '<div class="dt-kanan"><section><div class="sc-head"><h2 style="margin:0">Linimasa</h2>' +
      '<div class="lap-aksi no-print" style="margin:0">' + (this.fotoAda(s) ? '<button type="button" class="ikon-btn" data-do="perjalanan-cetak" data-mode="linimasa" data-foto="1" aria-label="Cetak linimasa dengan foto atau simpan PDF">' + Analisa.IKON.cetak + '<span>Dengan foto</span></button>' : '') + '<button type="button" class="ikon-btn" data-an="cetak" aria-label="Cetak linimasa atau simpan PDF">' + Analisa.IKON.cetak + '<span>Cetak</span></button></div></div>' +
      Cepat.chips(s) + '<div class="seg sm lm-filter no-print" role="group" aria-label="Saring linimasa">' + chip + '</div>' +
      '<div class="seg sm lm-urut no-print" style="margin-top:8px"><button type="button" class="btn" data-do="lm-urut" aria-label="Urutan: ' + (this.urut === 'baru' ? 'terbaru dulu' : 'terlama dulu') + '. Ketuk untuk membalik">' + (this.urut === 'baru' ? '↓ Terbaru' : '↑ Terlama') + '</button></div>' +
      (L.length ? this.daftar(s, L) + (L.length > this.n ? '<button type="button" class="btn" data-do="lm-lagi" style="width:100%;margin-top:12px;min-height:44px">Tampilkan lebih banyak (sisa ' + (L.length - this.n) + ')</button>' : '')
        : '<p class="note">Belum ada ' + (this.f === 'semua' ? 'peristiwa' : this.FILTER.find((c) => c[0] === this.f)[1].toLowerCase()) + '.</p>') +
      '<p class="note">Baris berikon redup berasal dari transaksi, panen, atau siklus; ketuk untuk membuka aslinya.' + (jalan ? ' Ketuk tombol + untuk mencatat jurnal<span class="hanya-lebar"> atau tekan J</span>.' : '') + '</p></section></div>';
    return kanan + kiri; // di HP linimasa dulu; di desktop kolom diatur CSS
  },

  /* isi tambahan di bawah judul pada cetakan; tanpa mengulang teks yang sudah menjadi judul */
  rinci(j, judul) {
    const isi = String(j.isi || '').trim(); if (!isi) return '';
    let t = isi;
    const L = isi.split('\n'), sisa = L.slice(1).join('\n').trim();
    if (j.jenis === 'kejadian') t = L[0].length <= 50 ? sisa : isi; // judul kejadian = jenis + baris pertama isi (maks. 50 huruf)
    else if (!j.judul && (j.jenis === 'catatan' || j.jenis === 'kegiatan')) t = sisa;
    return t ? '<br>' + esc(t).replace(/\n/g, '<br>') : '';
  },
  /* dokumen cetak polos linimasa: mengikuti saringan dan urutan di layar, dikelompokkan per minggu (v0.1.113) */
  cetakDoc(dgn) {
    const s = Siklus.cari(Siklus.sid), semua = this.peristiwa(s), E = this.tampil(semua), k = Siklus.kom(s.komoditasId) || {}, r = Siklus.ringkas(s.id), u = r.hasil - r.modal;
    const fl = this.FILTER.find((c) => c[0] === this.f)[1], urut = this.urut === 'baru' ? 'terbaru dulu' : 'terlama dulu';
    let baris = '', last = null;
    E.forEach((e) => {
      const x = this.isi(s, e), h = Jurnal.hariKe(s, e.tgl), m = this.minggu(s, e.tgl);
      if (m !== last) { last = m; baris += '<tr class="ct-grup"><td colspan="5">' + (m === 0 ? 'Sebelum mulai' : 'Minggu ke-' + m + ' · ' + this.rentang(s, m)) + '</td></tr>'; }
      baris += '<tr><td>' + Setelan.tgl(e.tgl) + '</td><td>' + (h >= 1 ? h : '—') + '</td><td>' + (x.label || (e.k === 'mulai' ? 'Mulai' : 'Selesai')) + '</td><td>' + esc(x.judul) + (e.j ? this.rinci(e.j, x.judul) : x.ket ? '<br>' + esc(x.ket) : '') + '</td><td class="n">' + (x.nilai || '') + '</td></tr>';
      const f = e.j && dgn ? Perjalanan.foto(e.j, true) : ''; if (f) baris += '<tr><td colspan="5">' + f + '</td></tr>';
    });
    return '<div class="ct-kop"><h1>Jurnal Siklus</h1><p class="ct-sub">' + esc(Siklus.nama(s.id)) + '</p><table class="ct-meta"><tr><th>Komoditas</th><td>' + esc(k.nama || '—') + '</td><th>Dicetak</th><td>' + Setelan.tgl(isoHari()) + '</td></tr>' +
      '<tr><th>Mulai</th><td>' + Setelan.tgl(s.mulai) + (s.status === 'selesai' && s.selesai ? ' – ' + Setelan.tgl(s.selesai) : '') + '</td><th>Status</th><td>' + (s.status === 'berjalan' ? 'Berjalan, hari ke-' + Siklus.hari(s) : 'Selesai, ' + Siklus.hari(s) + ' hari') + '</td></tr>' +
      '<tr><th>Peristiwa</th><td>' + E.length + (E.length !== semua.length ? ' dari ' + semua.length : '') + '</td><th>' + (u < 0 ? 'Rugi' : 'Untung') + '</th><td>' + rp(u) + '</td></tr>' +
      '<tr><th>Saringan</th><td>' + fl + ' · ' + urut + '</td><th>Aplikasi</th><td>Buku Kebun v' + VERSI + '</td></tr></table></div>' +
      '<div class="ct-bag ct-lanjut"><table class="ct-tab"><thead><tr><th>Tanggal</th><th>Hari</th><th>Jenis</th><th>Keterangan</th><th class="n">Nilai</th></tr></thead><tbody>' + (baris || '<tr><td colspan="5">Tidak ada peristiwa untuk saringan ini.</td></tr>') + '</tbody></table></div>';
  },

  pilihJ(id) { this.pilih = id; const y = window.scrollY; App.go('jurnal', true); window.scrollTo(0, y); const b = document.querySelector('[data-do="lm-tutup"]'); if (b) b.focus(); },
  tutupPanel() { const id = this.pilih; this.pilih = null; const y = window.scrollY; App.go('jurnal', true); window.scrollTo(0, y); const r = id && document.querySelector('.lm-baris[data-id="' + id + '"]'); if (r) r.focus(); },
  /* pintasan keyboard (desktop): J catat jurnal, Esc tutup panel detail */
  pasang() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || Modal.m || !this.lebar()) return;
      const t = e.target, ketik = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (e.key === 'Escape' && App.tab === 'jurnal' && this.pilih && !ketik) { this.tutupPanel(); return; }
      if ((e.key === 'j' || e.key === 'J') && !ketik && (App.tab === 'jurnal' || App.tab === 'siklus-detail')) {
        const s = Siklus.cari(Siklus.sid); if (s && s.status === 'berjalan') { e.preventDefault(); Rencana.dlgBuka('jurnal'); }
      }
    });
  },
  aksi(a, el) {
    const ulang = () => { const y = window.scrollY; App.go('jurnal', true); window.scrollTo(0, y); };
    if (a === 'lm-f') { this.f = el.dataset.f; this.n = this.BATAS; ulang(); const b = document.querySelector('.lm-filter [data-f="' + this.f + '"]'); if (b) b.focus(); return true; }
    if (a === 'lm-urut') { this.urut = this.urut === 'baru' ? 'lama' : 'baru'; this.n = this.BATAS; ulang(); const b = document.querySelector('[data-do="lm-urut"]'); if (b) b.focus(); return true; }
    if (a === 'lm-lagi') { this.n += this.BATAS; ulang(); return true; }
    if (a === 'jurnal-linimasa') { App.go('jurnal'); return true; }
    if (a === 'lm-tutup') { this.tutupPanel(); return true; }
    if (a === 'lm-ubah' || a === 'lm-hapus') {
      const j = Jurnal.cari(el.dataset.id); if (!j) return true;
      if (a === 'lm-hapus') { this.pilih = null; Rencana.FORM.jurnalDetail.aksi('hapus', j.id, el); return true; }
      Rencana.dlgBuka(j.evaluasi ? 'jurnalEval' : j.jenis === 'tahap' || j.jenis === 'kejadian' || j.jenis === 'ukuran' ? j.jenis : 'jurnal', j.id); return true;
    }
    return false;
  }
};
Linimasa.pasang();
