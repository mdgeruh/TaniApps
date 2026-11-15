/* Buku Kebun — pencarian cepat (Fase 6G Tahap 3, v0.1.133; docs/CARI.md).
   Ikon kaca pembesar di header (dan bilah ringkas) membuka dialog; pintasan "/" di desktop.
   Mencari transaksi, siklus, dan entri jurnal sekaligus; setiap kata harus cocok (DAN). Hanya membaca data, tidak mengubahnya. */
const Cari = {
  q: '', MAKS: 5, RIWAYAT: 'tani.cari',
  IKON: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
  /* angka berformat ("552.500", "1,5jt" tidak) disamakan dengan nominal polos: titik/koma pemisah dibuang */
  kata(q) { return String(q || '').toLowerCase().split(/\s+/).filter(Boolean).map((k) => (/^\d+([.,]\d{3})+$/.test(k) ? k.replace(/[.,]/g, '') : k)); },
  /* jarak edit (Levenshtein) dengan batas; > maks mengembalikan maks + 1 */
  jarak(a, b, maks) {
    if (Math.abs(a.length - b.length) > maks) return maks + 1;
    let p = []; for (let j = 0; j <= b.length; j++) p[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const c = [i]; let min = i;
      for (let j = 1; j <= b.length; j++) { c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (c[j] < min) min = c[j]; }
      if (min > maks) return maks + 1; p = c;
    }
    return p[b.length];
  },
  /* this.mirip: dipakai hanya saat pencarian persis kosong; kata ≥4 huruf (bukan angka) boleh salah 1 huruf (≥7 huruf: 2 huruf) */
  cocok(hay, kata) {
    return kata.every((k) => {
      if (hay.indexOf(k) >= 0) return true;
      if (!this.mirip || k.length < 4 || /\d/.test(k)) return false;
      const m = k.length >= 7 ? 2 : 1;
      return hay.split(/[^a-z0-9]+/).some((w) => w.length >= 3 && this.jarak(k, w, m) <= m);
    });
  },
  ket(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s; },
  /* hasil: { tx: [], sk: [], jr: [], n: { tx, sk, jr } } — tiap daftar sudah dibatasi MAKS bila tidak "semua" */
  cariData(q, semua) {
    const kata = this.kata(q), D = App.data, batas = semua ? 1e9 : this.MAKS, out = { tx: [], sk: [], jr: [], pn: [], ut: [], as: [], hg: [], mk: [], jd: [], n: { tx: 0, sk: 0, jr: 0, pn: 0, ut: 0, as: 0, hg: 0, mk: 0, jd: 0 } };
    if (!kata.length) return out;
    const tambah = (k, item) => { out.n[k]++; if (out[k].length < batas) out[k].push(item); };
    (D.siklus || []).filter((s) => !s.terhapus).sort((a, b) => (a.status === b.status ? 0 : a.status === 'berjalan' ? -1 : 1) || String(b.mulai).localeCompare(String(a.mulai))).forEach((s) => {
      const hay = (Siklus.nama(s.id) + ' ' + (s.status === 'berjalan' ? 'berjalan' : 'selesai') + ' ' + s.mulai).toLowerCase();
      if (this.cocok(hay, kata)) tambah('sk', s);
    });
    (D.transaksi || []).filter((t) => !t.terhapus).sort((a, b) => b.tanggal.localeCompare(a.tanggal) || String(b.dibuat).localeCompare(String(a.dibuat))).forEach((t) => {
      const sk = t.siklusId && Siklus.cari(t.siklusId) ? Siklus.nama(t.siklusId) : '';
      const hay = (App.namaKat(t.kategoriId) + ' ' + (t.catatan || '') + ' ' + sk + ' ' + (t.jenis === 'masuk' ? 'hasil masuk' : 'modal keluar biaya') + ' ' + Setelan.tgl(t.tanggal) + ' ' + t.tanggal + ' ' + t.jumlah).toLowerCase();
      if (this.cocok(hay, kata)) tambah('tx', t);
    });
    (D.siklus || []).filter((s) => !s.terhapus).forEach((s) => Jurnal.of(s.id).forEach((j) => {
      const e = Object.assign({ s: s, j: j }, Umpan.teks({ s: s, j: j }));
      if (this.cocok(e.hay, kata)) { out.n.jr++; out.jr.push(e); }
    }));
    (D.siklus || []).filter((s) => !s.terhapus).forEach((s) => (s.jadwal || []).forEach((j) => {
      if (this.cocok(('jadwal kegiatan ' + j.nama + ' ' + Siklus.nama(s.id) + ' ' + (j.selesai ? 'selesai' : 'belum') + ' ' + (j.tanggal || '')).toLowerCase(), kata)) { out.n.jd++; out.jd.push({ s: s, j: j }); }
    }));
    out.jd.sort((a, b) => (a.j.selesai ? 1 : 0) - (b.j.selesai ? 1 : 0) || String(a.j.tanggal || '9').localeCompare(String(b.j.tanggal || '9'))); if (out.jd.length > batas) out.jd.length = batas;
    (D.panen || []).filter((p) => !p.terhapus && Siklus.cari(p.siklusId)).sort((a, b) => b.tanggal.localeCompare(a.tanggal)).forEach((p) => {
      const k = Siklus.kom(Siklus.cari(p.siklusId).komoditasId);
      if (this.cocok(('panen ' + Siklus.nama(p.siklusId) + ' ' + (p.pembeli || '') + ' ' + Setelan.tgl(p.tanggal) + ' ' + p.tanggal + ' ' + (k ? k.satuan : '')).toLowerCase(), kata)) tambah('pn', p);
    });
    (D.utang || []).filter((u) => !u.terhapus).sort((a, b) => (a.lunas ? 1 : 0) - (b.lunas ? 1 : 0) || String(a.jatuhTempo || '9').localeCompare(String(b.jatuhTempo || '9'))).forEach((u) => {
      if (this.cocok((u.jenis + ' ' + (u.jenis === 'utang' ? 'utang bayar' : 'piutang tagih') + ' ' + u.pihak + ' ' + (u.lunas ? 'lunas' : 'belum lunas') + ' ' + (u.jatuhTempo || '') + ' ' + u.jumlah).toLowerCase(), kata)) tambah('ut', u);
    });
    (D.aset || []).filter((a) => !a.terhapus).sort((a, b) => String(b.tanggalBeli).localeCompare(String(a.tanggalBeli))).forEach((a) => {
      if (this.cocok(('aset ' + a.nama + ' ' + a.tanggalBeli + ' ' + a.hargaBeli).toLowerCase(), kata)) tambah('as', a);
    });
    (D.komoditas || []).filter((k) => !k.terhapus).forEach((k) => (k.hargaPasar || []).forEach((h) => {
      if (this.cocok(('harga pasar ' + k.nama + ' ' + (h.sumber || '') + ' ' + h.tanggal + ' ' + h.harga).toLowerCase(), kata)) out.n.hg++, out.hg.push({ k: k, h: h });
    }));
    [['unit', D.unit], ['kom', D.komoditas]].forEach((g) => (g[1] || []).filter((x) => !x.terhapus).forEach((x) => {
      const hay = (g[0] === 'unit' ? 'unit lahan ' + (x.jenis || '') : 'komoditas ' + (x.satuan || '')) + ' ' + x.nama + (x.arsip ? ' arsip' : '');
      if (this.cocok(hay.toLowerCase(), kata)) tambah('mk', { j: g[0], x: x });
    }));
    out.hg.sort((a, b) => b.h.tanggal.localeCompare(a.h.tanggal)); if (out.hg.length > batas) out.hg.length = batas;
    out.jr.sort((a, b) => b.j.tanggal.localeCompare(a.j.tanggal) || String(b.j.dibuat).localeCompare(String(a.j.dibuat)));
    if (out.jr.length > batas) out.jr.length = batas;
    return out;
  },
  /* ---------- tampilan ---------- */
  barisTx(t) {
    const m = t.jenis === 'masuk', sk = t.siklusId && Siklus.cari(t.siklusId) ? ' · ' + esc(Siklus.nama(t.siklusId).split(' · ')[0]) : '';
    return '<button type="button" class="cr-baris" data-cr="tx" data-id="' + t.id + '"><span class="cr-l"><span class="cr-n">' + esc(App.namaKat(t.kategoriId)) + '</span>' +
      '<span class="note">' + esc(Setelan.tgl(t.tanggal)) + sk + (t.catatan ? ' · ' + esc(this.ket(t.catatan, 50)) : '') + '</span></span>' +
      '<span class="cr-a ' + (m ? 'up' : 'down') + '">' + (m ? '+' : '−') + esc(rp(t.jumlah).replace('Rp ', 'Rp\u00a0')) + '</span></button>';
  },
  barisSk(s) {
    const live = s.status === 'berjalan';
    return '<button type="button" class="cr-baris" data-cr="sk" data-id="' + s.id + '"><span class="cr-l"><span class="cr-n">' + esc(Siklus.nama(s.id)) + '</span>' +
      '<span class="note">' + (live ? 'Berjalan · hari ' + Siklus.hari(s) : 'Selesai') + ' · mulai ' + esc(Setelan.tgl(s.mulai)) + '</span></span><span class="m-chev" aria-hidden="true">›</span></button>';
  },
  barisJr(e) {
    const ket = this.ket(e.j.isi, 70), judul = e.x.judul;
    return '<button type="button" class="cr-baris" data-cr="jr" data-id="' + e.j.id + '" data-sid="' + e.s.id + '"><span class="cr-l"><span class="cr-n">' + esc(judul) + '</span>' +
      '<span class="note">' + esc(Setelan.tgl(e.j.tanggal)) + ' · ' + esc(Siklus.nama(e.s.id).split(' · ')[0]) + (ket && ket !== judul ? ' · ' + esc(ket) : '') + '</span></span><span class="m-chev" aria-hidden="true">›</span></button>';
  },
  barisPn(p) {
    const k = Siklus.kom((Siklus.cari(p.siklusId) || {}).komoditasId), bersih = (+p.kuantitasKotor || 0) - (+p.susut || 0);
    return '<button type="button" class="cr-baris" data-cr="pn" data-id="' + p.id + '" data-sid="' + p.siklusId + '"><span class="cr-l"><span class="cr-n">Panen ' + esc(Setelan.tgl(p.tanggal)) + '</span>' +
      '<span class="note">' + esc(Siklus.nama(p.siklusId).split(' · ')[0]) + ' · ' + bersih + ' ' + esc(k ? k.satuan : '') + (p.pembeli ? ' · ' + esc(p.pembeli) : '') + '</span></span><span class="m-chev" aria-hidden="true">›</span></button>';
  },
  barisUt(u) {
    return '<button type="button" class="cr-baris" data-cr="ut" data-id="' + u.id + '"><span class="cr-l"><span class="cr-n">' + esc(u.pihak) + '</span>' +
      '<span class="note">' + (u.jenis === 'utang' ? 'Utang' : 'Piutang') + (u.lunas ? ' · lunas' : u.jatuhTempo ? ' · jatuh tempo ' + esc(Setelan.tgl(u.jatuhTempo)) : '') + '</span></span>' +
      '<span class="cr-a ' + (u.jenis === 'utang' ? 'down' : 'up') + '">' + esc(rp(u.jumlah).replace('Rp ', 'Rp\u00a0')) + '</span></button>';
  },
  barisAs(a) {
    return '<button type="button" class="cr-baris" data-cr="as" data-id="' + a.id + '"><span class="cr-l"><span class="cr-n">' + esc(a.nama) + '</span><span class="note">Dibeli ' + esc(Setelan.tgl(a.tanggalBeli)) + '</span></span>' +
      '<span class="cr-a">' + esc(rp(a.hargaBeli).replace('Rp ', 'Rp\u00a0')) + '</span></button>';
  },
  barisMk(e) {
    const un = e.j === 'unit', x = e.x;
    return '<button type="button" class="cr-baris" data-cr="mk" data-j="' + e.j + '" data-id="' + x.id + '"><span class="cr-l"><span class="cr-n">' + esc(x.nama) + '</span><span class="note">' + (un ? 'Unit' + (x.jenis ? ' · ' + esc(x.jenis) : '') : 'Komoditas' + (x.satuan ? ' · ' + esc(x.satuan) : '')) + (x.arsip ? ' · arsip' : '') + '</span></span><span class="m-chev" aria-hidden="true">›</span></button>';
  },
  barisJd(e) {
    const j = e.j, hari = j.tanggal ? Math.round((new Date(j.tanggal + 'T00:00:00') - new Date(isoHari() + 'T00:00:00')) / 864e5) : null;
    const ket = j.selesai ? 'Selesai' : hari === null ? 'Tanpa tanggal' : hari < 0 ? 'Terlambat ' + (-hari) + ' hari' : hari === 0 ? 'Hari ini' : 'Dalam ' + hari + ' hari';
    return '<button type="button" class="cr-baris" data-cr="jd" data-id="' + j.id + '" data-sid="' + e.s.id + '"><span class="cr-l"><span class="cr-n">' + esc(j.nama) + '</span><span class="note">' + ket + (j.tanggal ? ' · ' + esc(Setelan.tgl(j.tanggal)) : '') + ' · ' + esc(Siklus.nama(e.s.id).split(' · ')[0]) + '</span></span><span class="m-chev" aria-hidden="true">›</span></button>';
  },
  barisHg(e) {
    return '<button type="button" class="cr-baris" data-cr="hg" data-id="' + e.k.id + '|' + e.h.id + '"><span class="cr-l"><span class="cr-n">' + esc(e.k.nama) + '</span><span class="note">' + esc(Setelan.tgl(e.h.tanggal)) + (e.h.sumber ? ' · ' + esc(e.h.sumber) : '') + '</span></span>' +
      '<span class="cr-a">' + esc(rp(e.h.harga).replace('Rp ', 'Rp\u00a0')) + '</span></button>';
  },
  grup(judul, n, baris, lagi) {
    if (!n) return '';
    return '<div class="cr-grup" role="group" aria-label="' + judul + '"><div class="dm-sub">' + judul + ' (' + n + ')</div>' + baris.join('') + (lagi || '') + '</div>';
  },
  isiHasil() {
    const q = this.q.trim();
    if (!q) return '<p class="note cr-info">Ketik nama kategori, catatan transaksi, siklus, isi jurnal, jadwal kegiatan, pembeli panen, pihak utang, aset, harga pasar, unit, atau komoditas. Angka boleh berformat, mis. 552.500. Beberapa kata dicocokkan sekaligus, mis. “cabai pupuk”.</p>' + this.terakhir();
    this.mirip = false; let r = this.cariData(q, false), mirip = false;
    if (!r.n.tx && !r.n.sk && !r.n.jr && !r.n.pn && !r.n.ut && !r.n.as && !r.n.hg && !r.n.mk && !r.n.jd) { this.mirip = true; r = this.cariData(q, false); mirip = true; this.mirip = false; }
    const total = r.n.tx + r.n.sk + r.n.jr + r.n.pn + r.n.ut + r.n.as + r.n.hg + r.n.mk + r.n.jd;
    if (!total) return '<p class="note cr-info" role="status">Tidak ada yang cocok dengan “' + esc(q) + '”.</p>';
    const lagi = (k, teks) => r.n[k] > r[k].length ? '<button type="button" class="cr-lagi" data-cr="lagi-' + k + '">' + teks + ' (' + r.n[k] + ')</button>' : '';
    return '<p class="sr-only" role="status">' + total + ' hasil</p>' + (mirip ? '<p class="note cr-info">Tidak ada yang persis sama; ini hasil yang mirip.</p>' : '') +
      this.grup('Siklus', r.n.sk, r.sk.map((s) => this.barisSk(s)), '') +
      this.grup('Transaksi', r.n.tx, r.tx.map((t) => this.barisTx(t)), lagi('tx', 'Lihat semua di Transaksi')) +
      this.grup('Jurnal', r.n.jr, r.jr.map((e) => this.barisJr(e)), lagi('jr', 'Lihat semua di Jurnal')) +
      this.grup('Jadwal kegiatan', r.n.jd, r.jd.map((e) => this.barisJd(e)), '') +
      this.grup('Panen', r.n.pn, r.pn.map((p) => this.barisPn(p)), '') +
      this.grup('Utang / piutang', r.n.ut, r.ut.map((u) => this.barisUt(u)), '') +
      this.grup('Aset', r.n.as, r.as.map((a) => this.barisAs(a)), '') +
      this.grup('Harga pasar', r.n.hg, r.hg.map((e) => this.barisHg(e)), '') +
      this.grup('Unit & komoditas', r.n.mk, r.mk.map((e) => this.barisMk(e)), '');
  },
  /* pencarian terakhir (hanya kata kunci, disimpan di perangkat ini) */
  muatRiwayat() { try { const a = JSON.parse(localStorage.getItem(this.RIWAYAT) || '[]'); return Array.isArray(a) ? a.filter((x) => typeof x === 'string').slice(0, 5) : []; } catch (e) { return []; } },
  simpanRiwayat(q) {
    q = q.trim(); if (!q) return;
    try { const a = [q].concat(this.muatRiwayat().filter((x) => x.toLowerCase() !== q.toLowerCase())).slice(0, 5); localStorage.setItem(this.RIWAYAT, JSON.stringify(a)); } catch (e) { /* abaikan */ }
  },
  terakhir() {
    const a = this.muatRiwayat(); if (!a.length) return '';
    return '<div class="cr-grup"><div class="dm-sub">Pencarian terakhir</div><div class="cr-chip">' + a.map((x) => '<button type="button" class="btn" data-cr="riwayat" data-q="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div></div>';
  },
  segar() {
    const w = document.getElementById('crHasil'); if (!w) return;
    w.innerHTML = this.isiHasil(); if (typeof Samar !== 'undefined' && Samar.aktif()) Samar.sapu(w);
  },
  /* ---------- buka dan tindakan ---------- */
  buka(pemicu) {
    if (Modal.m) return;
    this.q = '';
    Modal.buka({
      judulId: 'crJudul', fokus: 'crQ', pemicu: pemicu || document.activeElement, kartu: 'cr-kartu', lapis: 'cr-lapis',
      html: '<div class="dm-kepala"><div><div class="dm-jenis">Pencarian cepat</div><h2 class="dm-judul" id="crJudul">Cari</h2></div>' +
        '<button type="button" class="dm-x" data-cr="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="dm-isi"><input type="search" id="crQ" class="cari" placeholder="Transaksi, siklus, jurnal, panen…" aria-label="Cari transaksi, siklus, jurnal, panen, utang, aset, dan harga pasar" aria-controls="crHasil" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search">' +
        '<div id="crHasil">' + this.isiHasil() + '</div></div>',
      antes: (el) => {
        el.addEventListener('input', (e) => { if (e.target.id !== 'crQ') return; this.q = e.target.value; clearTimeout(this._t); this._t = setTimeout(() => this.segar(), 120); });
        el.addEventListener('keydown', (e) => this.tombol(e, el));
      },
      klik: (e) => this.klik(e),
      simpan: () => { const b = document.querySelector('#crHasil .cr-baris'); if (b) b.click(); },
      onTutup: () => { clearTimeout(this._t); }
    });
  },
  /* panah atas/bawah berpindah antara kolom cari dan baris hasil */
  tombol(e, el) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const L = [el.querySelector('#crQ')].concat([...el.querySelectorAll('.cr-baris,.cr-lagi')]), i = L.indexOf(document.activeElement);
    if (i < 0) return; e.preventDefault();
    const n = Math.max(0, Math.min(L.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1))); L[n].focus();
    if (n > 0) L[n].scrollIntoView({ block: 'nearest' });
  },
  klik(e) {
    const b = e.target.closest('[data-cr]'); if (!b) return;
    const a = b.dataset.cr, id = b.dataset.id, q = this.q;
    if (a === 'tutup') { Modal.tutup(); return; }
    if (a === 'riwayat') { const i = document.getElementById('crQ'); i.value = this.q = b.dataset.q; this.segar(); i.focus(); return; }
    this.simpanRiwayat(q);
    /* modal ditutup dulu; tombol kembali browser diselesaikan Modal (setTimeout 0) sebelum pindah halaman */
    Modal.tutup(true);
    setTimeout(() => this.tuju(a, id, b.dataset.sid, q, b.dataset.j), 60);
  },
  tuju(a, id, sid, q, j) {
    if (a === 'sk') { if (!Siklus.cari(id)) return App.toast('Siklus tidak ditemukan'); Siklus.sid = id; Siklus.minta = null; App.go('siklus-detail'); }
    else if (a === 'tx') { if (!App.data.transaksi.find((t) => t.id === id && !t.terhapus)) return App.toast('Transaksi tidak ditemukan'); if (App.tab !== 'transaksi') App.go('transaksi'); App.ubahTx(id); }
    else if (a === 'jr') { if (!Jurnal.cari(id) || !Siklus.cari(sid)) return App.toast('Catatan tidak ditemukan'); Siklus.sid = sid; if (App.tab !== 'siklus-detail') App.go('siklus-detail'); Rencana.dlgBuka('jurnalDetail', id); }
    else if (a === 'mk') { const x = Siklus.dmRek(j, id); if (!x) return App.toast('Data tidak ditemukan'); Siklus.msub = j === 'unit' ? 'unit' : 'kom'; App.go('master', App.tab === 'master'); Siklus.dmBuka(j, id, null); }
    else if (a === 'jd') { Siklus.sid = sid; const s = Siklus.cari(sid); if (!s || !Dsk.jd(id)) return App.toast('Kegiatan tidak ditemukan'); if (App.tab !== 'siklus-detail') App.go('siklus-detail'); Rencana.dlgBuka('jadwalDetail', id); }
    else if (a === 'pn') { if (!Dsk.pn(id) || !Siklus.cari(sid)) return App.toast('Panen tidak ditemukan'); Siklus.sid = sid; if (App.tab !== 'siklus-detail') App.go('siklus-detail'); Rencana.dlgBuka('panenDetail', id); }
    else if (a === 'ut' || a === 'as' || a === 'hg') {
      const k = a === 'ut' ? 'utang' : 'aset';
      if (a !== 'hg' && !Rencana.cari(k, id)) return App.toast('Data tidak ditemukan'); if (a === 'hg' && !Harga.cari(id)) return App.toast('Catatan harga tidak ditemukan');
      Rencana.sub = a === 'ut' ? 'utang' : a === 'as' ? 'aset' : 'harga'; App.go('rencana', App.tab === 'rencana'); Rencana.dlgBuka(a === 'ut' ? 'utangDetail' : a === 'as' ? 'asetDetail' : 'hargaDetail', id);
    }
    else if (a === 'lagi-tx') { App.filter.cari = q.trim(); App.batasTx = 100; App.go('transaksi', App.tab === 'transaksi'); }
    else if (a === 'lagi-jr') { Umpan.q = q.trim(); Umpan.n = Umpan.BATAS; Siklus.sub = 'jurnal'; Siklus.fu = ''; Siklus.fk = ''; App.go('siklus', App.tab === 'siklus'); }
  },
  init() {
    const t = document.getElementById('cariBtn'), h = document.getElementById('hrCari');
    [t, h].forEach((b) => { if (b) { b.innerHTML = this.IKON; b.addEventListener('click', () => this.buka(b)); } });
  }
};
