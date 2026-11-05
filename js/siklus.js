/* Template komoditas (v0.1.030): proporsi biaya umum, perkiraan kasar — sesuaikan dengan pengalaman sendiri */
const TEMPLATE_KOM = [
  { label: 'Sayur daun', kunci: ['bayam', 'kangkung', 'sawi', 'selada', 'sayur'], satuan: 'ikat', umur: 30, komponen: [['Benih / Bibit', 10], ['Pupuk / Nutrisi', 25], ['Pestisida / Obat', 10], ['Media Tanam / Polybag', 15], ['Tenaga Kerja', 30], ['Kemasan & Pengiriman', 10]] },
  { label: 'Cabai', kunci: ['cabai', 'cabe'], satuan: 'kg', umur: 120, komponen: [['Benih / Bibit', 8], ['Pupuk / Nutrisi', 25], ['Pestisida / Obat', 15], ['Media Tanam / Polybag', 10], ['Tenaga Kerja', 32], ['Air / Listrik', 5], ['Kemasan & Pengiriman', 5]] },
  { label: 'Tomat', kunci: ['tomat'], satuan: 'kg', umur: 90, komponen: [['Benih / Bibit', 8], ['Pupuk / Nutrisi', 27], ['Pestisida / Obat', 15], ['Media Tanam / Polybag', 8], ['Tenaga Kerja', 32], ['Kemasan & Pengiriman', 10]] },
  { label: 'Lele', kunci: ['lele'], satuan: 'kg', umur: 90, komponen: [['Benih / Bibit', 15], ['Pakan', 60], ['Pestisida / Obat', 5], ['Air / Listrik', 8], ['Tenaga Kerja', 12]] },
  { label: 'Ayam petelur', kunci: ['ayam', 'petelur'], satuan: 'butir', umur: 120, komponen: [['Benih / Bibit', 12], ['Pakan', 70], ['Pestisida / Obat', 5], ['Air / Listrik', 5], ['Tenaga Kerja', 8]] }
];
/* Tani Keuangan — Fase 2: unit, komoditas, siklus, panen (v0.1.008) */
const JENIS_UNIT = [['kebun', 'Kebun / lahan'], ['hidroponik', 'Hidroponik'], ['kolam', 'Kolam'], ['kandang', 'Kandang'], ['lainnya', 'Lainnya']];
const num = (s) => { const n = parseFloat(String(s || '').replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
const fmtN = (n) => (Math.round(n * 100) / 100).toLocaleString('id-ID');
const Siklus = {
  lg: {}, lgSid: null, /* daftar yang dibentangkan di detail siklus (v0.1.066) */
  sid: null, sub: 'berjalan', msub: 'unit', fu: '', fk: '', pd: null, minta: null, sf: null, mf: null,
  d() { return App.data; },
  unit(id) { return this.d().unit.find((x) => x.id === id); },
  kom(id) { return this.d().komoditas.find((x) => x.id === id); },
  units(semua) { return this.d().unit.filter((x) => !x.terhapus && (semua || !x.arsip)); },
  koms(semua) { return this.d().komoditas.filter((x) => !x.terhapus && (semua || !x.arsip)); },
  pakai(f, id) { return this.daftar().filter((s) => s[f] === id).length; },
  norm(t) { return String(t || '').trim().replace(/\s+/g, ' ').toLowerCase(); },
  kembar(list, nama, id) { const n = this.norm(nama); return list.some((x) => x.id !== id && this.norm(x.nama) === n); },
  mfBaru() { return { unit: { id: null, nama: '', jenis: 'kebun', ukur: '', sat: '' }, kom: { id: null, nama: '', sat: '', umur: '' } }; },
  sfBaru() { // isian awal siklus baru: unit dan komoditas dari siklus terakhir (bila masih aktif)
    const l = this.daftar().slice().sort((a, b) => String(b.dibuat || '').localeCompare(String(a.dibuat || '')))[0];
    const u = l && this.units().find((x) => x.id === l.unitId), k = l && this.koms().find((x) => x.id === l.komoditasId);
    return { id: null, unit: u ? u.id : '', kom: k ? k.id : '', mulai: isoHari(), selesai: '', cat: '' };
  },
  saring(k, v) { this[k === 'unit' ? 'fu' : 'fk'] = v; App.go('siklus', true); },
  pindah(t, dari) { // dipanggil App.go: keadaan sementara dibersihkan saat halaman berganti
    if (t !== dari) { this.minta = null; this.dmTutup(true, true); }
    if (t !== 'siklus-form') this.sf = null;
    if (t === 'master' && dari !== 'master') this.mf = this.mfBaru();
  },
  bacaMaster() { // simpan isian form unit/komoditas (bila tampil di modal) sebelum digambar ulang
    if (!this.mf) this.mf = this.mfBaru();
    const g = (i) => ($(i) ? $(i).value : '');
    if ($('m_unama')) Object.assign(this.mf.unit, { nama: g('m_unama'), jenis: g('m_ujenis') || 'kebun', ukur: g('m_uukur'), sat: g('m_usat') });
    if ($('m_knama')) Object.assign(this.mf.kom, { nama: g('m_knama'), sat: g('m_ksat'), umur: g('m_kumur') });
  },
  gulir(id) { const e = $(id); if (!e) return; const r = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; e.scrollIntoView({ block: 'center', behavior: r ? 'auto' : 'smooth' }); },
  daftar() { return this.d().siklus.filter((s) => !s.terhapus); },
  cari(id) { return this.d().siklus.find((x) => x.id === id && !x.terhapus); },
  nama(id) { const s = this.cari(id); if (!s) return ''; const k = this.kom(s.komoditasId), u = this.unit(s.unitId); return (k ? k.nama : '?') + ' · ' + (u ? u.nama : '?'); },
  panenOf(id) { return this.d().panen.filter((p) => !p.terhapus && p.siklusId === id).sort((a, b) => b.tanggal.localeCompare(a.tanggal)); },
  ringkas(id) {
    const tx = App.aktif().filter((t) => t.siklusId === id);
    return { modal: App.jumlah(tx, 'keluar'), hasil: App.jumlah(tx, 'masuk'), tx: tx,
             bersih: this.panenOf(id).reduce((a, p) => a + p.kuantitasKotor - p.susut, 0) };
  },
  panenPerkiraan(s) { // perkiraan panen = mulai + umur panen komoditas (hanya siklus berjalan)
    const k = this.kom(s.komoditasId); if (!k || !k.umurPanenHari || s.status !== 'berjalan') return null;
    const [y, m, d] = s.mulai.split('-').map(Number), t = new Date(y, m - 1, d + k.umurPanenHari), n = new Date();
    return { tgl: isoHari(t), sisa: Math.round((t - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5) };
  },
  templateUntuk(nama) { const n = String(nama || '').toLowerCase(); return TEMPLATE_KOM.find((t) => t.kunci.some((k) => n.includes(k))) || null; },
  hari(s) {
    const a = new Date(s.mulai + 'T00:00:00'), b = new Date((s.status === 'selesai' && s.selesai ? s.selesai : isoHari()) + 'T00:00:00');
    return Math.max(1, Math.round((b - a) / 864e5) + 1);
  },
  opsi(list, pilih, f) { return list.map((x) => '<option value="' + x.id + '"' + (x.id === pilih ? ' selected' : '') + '>' + esc(f(x)) + '</option>').join(''); },

  /* ---------- tampilan ---------- */
  vList() {
    const ada = this.daftar(), fu = this.fu && this.unit(this.fu) ? this.fu : '', fk = this.fk && this.kom(this.fk) ? this.fk : '';
    const base = ada.filter((s) => (!fu || s.unitId === fu) && (!fk || s.komoditasId === fk));
    const tampil = base.filter((s) => s.status === this.sub).sort((a, b) => { if (this.sub === 'berjalan') { const x = this.panenPerkiraan(a), y = this.panenPerkiraan(b); return (x ? x.sisa : 1e9) - (y ? y.sisa : 1e9) || b.mulai.localeCompare(a.mulai); } return b.mulai.localeCompare(a.mulai); });
    return '<section><div class="seg">' + [['berjalan', 'Berjalan'], ['selesai', 'Selesai']].map((x) =>
      '<button type="button" class="btn' + (this.sub === x[0] ? ' on' : '') + '" data-do="siklus-tab" data-val="' + x[0] + '">' + x[1] + ' (' + base.filter((s) => s.status === x[0]).length + ')</button>').join('') + '</div>' +
      (ada.length > 3 ? '<div class="two"><div><label for="sf_u">Unit</label><select id="sf_u" data-sfl="unit"><option value="">Semua unit</option>' + this.opsi(this.units(true).filter((u) => ada.some((s) => s.unitId === u.id)), fu, (u) => u.nama) + '</select></div>' +
        '<div><label for="sf_k">Komoditas</label><select id="sf_k" data-sfl="kom"><option value="">Semua komoditas</option>' + this.opsi(this.koms(true).filter((k) => ada.some((s) => s.komoditasId === k.id)), fk, (k) => k.nama) + '</select></div></div>' : '') +
      (tampil.length > 1 ? (() => { const m = tampil.reduce((a, s) => { const r = this.ringkas(s.id); a.m += r.modal; a.h += r.hasil; return a; }, { m: 0, h: 0 }), u = m.h - m.m;
        return '<div class="sum" style="margin-top:14px"><div><span class="note">Modal</span><strong class="down">' + rp(m.m) + '</strong></div><div><span class="note">Hasil</span><strong class="up">' + rp(m.h) + '</strong></div><div><span class="note">' + (u < 0 ? 'Rugi' : 'Untung') + '</span><strong class="' + (u < 0 ? 'down' : 'up') + '">' + rp(u) + '</strong></div></div><p class="note" style="margin:6px 0 4px">Total ' + tampil.length + ' siklus ' + this.sub + (fu || fk ? ' (disaring)' : '') + '</p>'; })() : '') +
      (tampil.length ? tampil.map((s) => {
        const r = this.ringkas(s.id), k = this.kom(s.komoditasId), pp = this.panenPerkiraan(s);
        return '<div class="sc-card" data-do="buka-siklus" data-id="' + s.id + '" role="button" tabindex="0"><div class="sc-head"><span class="sc-name">' + esc(this.nama(s.id)) + '</span>' +
          '<span class="badge' + (s.status === 'berjalan' ? ' live' : '') + '">' + (s.status === 'berjalan' ? 'hari ' + this.hari(s) + (k && k.umurPanenHari ? '/' + k.umurPanenHari : '') : 'selesai') + '</span></div>' +
          '<div class="note">Mulai ' + Setelan.tgl(s.mulai) + ' · Modal ' + rp(r.modal) + ' · Hasil ' + rp(r.hasil) + (s.status === 'berjalan' && r.hasil ? ' · ' + (r.hasil - r.modal < 0 ? 'Rugi ' : 'Untung ') + rp(Math.abs(r.hasil - r.modal)) : '') + '</div>' +
          (pp ? '<div class="note">' + (pp.sisa >= 0 ? 'Perkiraan panen ' + Setelan.tgl(pp.tgl) + ' · ' + (pp.sisa === 0 ? 'hari ini' : pp.sisa + ' hari lagi') : '<span class="down">Lewat perkiraan panen ' + Setelan.tgl(pp.tgl) + ' · terlambat ' + (-pp.sisa) + ' hari</span>') + '</div>' : '') +
          (s.anggaran ? (() => { const p = Math.round(r.modal / s.anggaran * 100); return '<div class="bar-ang' + (p > 100 ? ' x' : p >= 90 ? ' w' : '') + '" role="img" aria-label="Modal ' + p + ' persen dari anggaran"><i style="width:' + Math.min(100, p) + '%"></i></div><div class="note">Anggaran ' + rp(s.anggaran) + ' · terpakai ' + p + '%</div>'; })() : '') + '</div>';
      }).join('') : '<p class="note" style="margin-top:14px">' + (ada.length ? 'Tidak ada siklus ' + this.sub + (fu || fk ? ' untuk saringan ini' : '') + '.' : 'Belum ada siklus. Siapkan unit dan komoditas, lalu ketuk tombol + untuk memulai siklus pertama.') + '</p>') +
      (this.units().length && this.koms().length ? '' : '<button class="btn" data-go="master" style="width:100%;margin-top:10px">Siapkan unit &amp; komoditas</button>') + '</section>';
  },
  vForm() {
    const f = this.sf || (this.sf = this.sfBaru()), ubah = !!f.id, s = ubah ? this.cari(f.id) : null;
    if (ubah && !s) { this.sf = null; return this.vList(); }
    if (!ubah && (!this.units().length || !this.koms().length))
      return '<section><p class="note">' + (this.units(true).length && this.koms(true).length ? 'Semua unit atau komoditas sedang diarsipkan. Pulihkan atau tambahkan yang baru dulu.' : 'Tambahkan dulu minimal satu unit/lahan dan satu komoditas.') + '</p>' +
        '<button class="btn gold" data-go="master">Buka halaman Unit</button><button class="btn" data-go="siklus" style="width:100%;margin-top:10px">Batal</button></section>';
    const lu = ubah ? this.units(true).filter((x) => !x.arsip || x.id === f.unit) : this.units(), lk = ubah ? this.koms(true).filter((x) => !x.arsip || x.id === f.kom) : this.koms();
    const nTx = ubah ? App.aktif().filter((t) => t.siklusId === s.id).length : 0, nP = ubah ? this.panenOf(s.id).length : 0;
    return '<section>' +
      '<label for="s_unit">Unit / lahan</label><select id="s_unit">' + this.opsi(lu, f.unit, (u) => u.nama + (u.arsip ? ' (arsip)' : '')) + '</select>' +
      '<label for="s_kom">Komoditas</label><select id="s_kom">' + this.opsi(lk, f.kom, (k) => k.nama + (k.arsip ? ' (arsip)' : '')) + '</select>' +
      '<label for="s_mulai">Tanggal mulai</label><input type="date" id="s_mulai" value="' + (f.mulai || isoHari()) + '">' +
      (ubah && s.status === 'selesai' ? '<label for="s_selesai">Tanggal selesai</label><input type="date" id="s_selesai" value="' + (f.selesai || s.selesai || isoHari()) + '">' : '') +
      '<label for="s_cat">Catatan (opsional)</label><input id="s_cat" maxlength="120" value="' + esc(f.cat || '') + '" placeholder="mis. bibit dari toko tani">' +
      (nTx || nP ? '<p class="note" style="margin-top:10px">Siklus ini punya ' + nTx + ' transaksi dan ' + nP + ' panen. Mengganti komoditas mengubah satuan panen yang tampil; angka tidak dikonversi.</p>' : '') +
      '<button class="btn gold" data-do="simpan-siklus">' + (ubah ? 'Simpan perubahan' : 'Mulai siklus') + '</button><button class="btn" data-go="' + (ubah ? 'siklus-detail' : 'siklus') + '" style="width:100%;margin-top:10px">Batal</button></section>';
  },
  vDetail() {
    const s = this.cari(this.sid);
    if (!s) return this.vList();
    const r = this.ringkas(s.id), k = this.kom(s.komoditasId), sat = k ? k.satuan : '', jalan = s.status === 'berjalan', u = r.hasil - r.modal;
    if (this.lgSid !== s.id) { this.lg = {}; this.lgSid = s.id; }
    const BP = 3, BT = 5, pAll = this.panenOf(s.id), tAll = r.tx.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal));
    const lagi = (k, n, batas) => n > batas ? '<button type="button" class="btn" data-do="lg-toggle" data-k="' + k + '" aria-expanded="' + !!this.lg[k] + '" style="width:100%;margin-top:10px;min-height:44px">' + (this.lg[k] ? 'Ringkas' : 'Lihat semua (' + n + ')') + '</button>' : '';
    const panen = (this.lg.pn ? pAll : pAll.slice(0, BP)).map((p) => '<div class="tx"' + ' data-do="panen-detail" data-id="' + p.id + '" role="button" tabindex="0" aria-haspopup="dialog"' + '><div class="tx-l"><div class="tx-n">' +
      fmtN(p.kuantitasKotor - p.susut) + ' ' + esc(sat) + ' bersih</div><div class="note">' + Setelan.tgl(p.tanggal) + ' · susut ' + fmtN(p.susut) + (p.pembeli ? ' · ' + esc(p.pembeli) : '') + '</div></div>' +
      '<div class="tx-a">' + (p.hargaPerSatuan ? rp(p.hargaPerSatuan) + '/' + esc(sat) : '—') + '</div></div>').join('');
    return '<section><div class="sc-head"><h2 style="margin:0">Ringkasan</h2><span class="badge' + (jalan ? ' live' : '') + '">' + (jalan ? 'berjalan' : 'selesai') + '</span></div>' +
      '<p class="note" style="margin:8px 0 0">Mulai ' + Setelan.tgl(s.mulai) + (jalan ? ' · hari ' + this.hari(s) + (k && k.umurPanenHari ? ' dari ±' + k.umurPanenHari : '') : ' · selesai ' + Setelan.tgl(s.selesai) + ' (' + this.hari(s) + ' hari)') + (s.catatan ? ' · ' + esc(s.catatan) : '') + '</p>' +
      '<div class="sum" style="margin-top:14px"><div><span class="note">Modal</span><strong class="down">' + rp(r.modal) + '</strong></div><div><span class="note">Hasil</span><strong class="up">' + rp(r.hasil) + '</strong></div>' +
      '<div><span class="note">' + (u < 0 ? 'Rugi' : 'Untung') + '</span><strong class="' + (u < 0 ? 'down' : 'up') + '">' + rp(u) + '</strong></div></div>' +
      '<div class="row"><span class="mu">Unit</span>' + this.tautan('unit', s.unitId) + '</div><div class="row"><span class="mu">Komoditas</span>' + this.tautan('kom', s.komoditasId) + '</div>' +
      '<div class="row"><span class="mu">Panen bersih</span><span>' + fmtN(r.bersih) + ' ' + esc(sat) + '</span></div>' +
      (jalan ? '<div class="seg" style="margin-top:12px"><button class="btn" data-do="ubah-siklus">Ubah siklus</button><button class="btn" data-do="selesai-siklus">Selesaikan siklus</button></div>'
        : '<p class="note" style="margin-top:12px">Siklus selesai tidak menerima transaksi atau panen baru. Buka kembali untuk mengubahnya.</p>' +
          '<div class="seg" style="margin-top:6px"><button class="btn" data-do="ubah-siklus">Ubah siklus</button><button class="btn" data-do="buka-lagi">Buka kembali</button></div>' +
          '<button class="btn" data-do="ulangi-siklus" style="width:100%;margin-top:10px">Ulangi siklus ini</button>') + '</section>' +
      Jadwal.v(s) +
      '<section><h2>Panen</h2>' + (panen ? panen + lagi('pn', pAll.length, BP) + '<p class="note">Ketuk panen untuk detail' + (jalan ? ', mengubah, atau menghapus' : '') + '.</p>' : '<p class="note">Belum ada panen.' + (jalan ? ' Ketuk tombol + lalu pilih Catat panen saat hasil siap.' : '') + '</p>') + '</section>' +
      '<section><h2>Transaksi siklus</h2>' + (r.tx.length ? (this.lg.tx ? tAll : tAll.slice(0, BT)).map((t) => App.barisTx(t)).join('') + lagi('tx', tAll.length, BT) : '<p class="note">Belum ada transaksi terhubung.' + (jalan ? ' Ketuk tombol + untuk mencatat modal atau hasil siklus ini.' : '') + '</p>') + '</section>' +
      '<button class="btn danger" data-do="hapus-siklus" style="width:100%;margin-top:4px">Hapus siklus</button>';
  },
  tautan(j, id) { const x = j === 'unit' ? this.unit(id) : this.kom(id); return x ? '<button type="button" class="btn" data-do="dm-buka" data-j="' + j + '" data-id="' + id + '" aria-haspopup="dialog" style="flex:0 0 auto;padding:4px 10px;font-size:12px;min-height:36px">' + esc(x.nama) + ' ›</button>' : '<span>?</span>'; },
  selesaiBuka(pemicu) {
    const s = this.cari(this.sid); if (!s || s.status !== 'berjalan' || Modal.m) return;
    Modal.buka({ judulId: 'slJudul', fokus: 'sl_tgl', pemicu: pemicu, tutupLatar: false,
      html: '<div class="dm-kepala"><div><div class="dm-jenis">Siklus</div><h2 class="dm-judul" id="slJudul">Selesaikan siklus</h2></div><button type="button" class="dm-x" data-sl="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="dm-isi"><p class="note" style="margin-top:0">' + esc(this.nama(s.id)) + '</p><label for="sl_tgl">Tanggal selesai</label><input type="date" id="sl_tgl" max="' + isoHari() + '" value="' + isoHari() + '">' +
        '<p class="note" style="margin-top:8px">Setelah selesai, siklus tidak menerima transaksi atau panen baru. Bisa dibuka kembali.</p></div>' +
        '<div class="dm-aksi"><button type="button" class="btn gold" data-sl="ok">Selesaikan siklus</button><button type="button" class="btn" data-sl="tutup" style="width:100%">Batal</button></div>',
      klik: (e) => { const x = e.target.closest('[data-sl]'); if (!x) return; if (x.dataset.sl === 'tutup') Modal.tutup(); else this.selesaiSimpan(); },
      simpan: () => this.selesaiSimpan() });
  },
  selesaiSimpan() {
    const s = this.cari(this.sid); if (!s) return;
    const sel = (document.getElementById('sl_tgl') || {}).value || '', pn = this.panenOf(s.id).map((p) => p.tanggal).sort();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sel)) return Modal.galat('Isi tanggal selesai');
    if (sel < s.mulai) return Modal.galat('Tanggal selesai tidak boleh sebelum tanggal mulai');
    if (sel > isoHari()) return Modal.galat('Tanggal selesai tidak boleh di masa depan');
    if (pn.length && sel < pn[pn.length - 1]) return Modal.galat('Ada panen bertanggal ' + Setelan.tgl(pn[pn.length - 1]) + ', setelah tanggal selesai');
    s.status = 'selesai'; s.selesai = sel; s.diubah = nowIso(); Modal.tutup(true); App.simpan(); App.go('siklus-detail', true); Modal.pulihFokus();
    App.toast('Siklus diselesaikan', { label: 'Urungkan', fn: () => { s.status = 'berjalan'; s.selesai = null; s.diubah = nowIso(); App.simpan(); if (App.tab === 'siklus-detail' && this.sid === s.id) App.go('siklus-detail', true); } });
  },
  vPanen() {
    const s = this.cari(this.sid), k = s && this.kom(s.komoditasId), p = this.pd, sat = k ? k.satuan : '';
    return '<section><p class="note" style="margin-top:0">' + esc(this.nama(this.sid)) + '</p>' + (Harga.terakhir(k) ? '<p class="note" style="margin-top:0">Harga pasar terakhir: ' + rp(Harga.terakhir(k).harga) + '/' + esc(sat) + ' (' + Setelan.tgl(Harga.terakhir(k).tanggal) + ')</p>' : '') +
      '<label for="p_tgl">Tanggal</label><input type="date" id="p_tgl" value="' + p.tanggal + '">' +
      '<div class="two"><div><label for="p_kotor">Hasil kotor (' + esc(sat) + ')</label><input id="p_kotor" inputmode="decimal" value="' + (p.kotor || '') + '"></div>' +
      '<div><label for="p_susut">Susut / reject</label><input id="p_susut" inputmode="decimal" value="' + (p.susut || '') + '" placeholder="0"></div></div>' +
      '<label for="p_harga">Harga jual per ' + esc(sat) + ' (opsional)</label><input id="p_harga" inputmode="numeric" value="' + fmtInput(p.harga) + '" placeholder="0">' +
      '<label for="p_pembeli">Pembeli (opsional)</label><input id="p_pembeli" maxlength="60" value="' + esc(p.pembeli) + '">' +
      Utang.kotak(p, 'p', '', 'p_pembeli') +
      '<p class="note" style="margin-top:10px">Jika harga diisi, hasil penjualan otomatis dicatat sebagai transaksi Hasil siklus ini. Bila belum dibayar, pembeli wajib diisi dan sisanya masuk piutang.</p>' +
      '<button class="btn gold" data-do="simpan-panen">Simpan</button><button class="btn" data-go="siklus-detail" style="width:100%;margin-top:10px">Batal</button>' +
      (p.id ? '<p class="note">Untuk menghapus panen, ketuk panen di detail siklus.</p>' : '') + '</section>';
  },
  vMaster() {
    const un = this.msub === 'unit', nu = this.units(true).length, nk = this.koms(true).length;
    const f = un ? (u) => esc(u.nama) + ' <span class="mu">· ' + (JENIS_UNIT.find((j) => j[0] === u.jenis) || [0, u.jenis])[1] + (u.ukuran ? ' · ' + fmtN(u.ukuran) + ' ' + esc(u.satuanUkuran || '') : '') + '</span>'
      : (k) => esc(k.nama) + ' <span class="mu">· ' + esc(k.satuan) + (k.umurPanenHari ? ' · ±' + k.umurPanenHari + ' hari' : '') + '</span>';
    const j = un ? 'unit' : 'kom', fk = un ? 'unitId' : 'komoditasId', list = un ? this.units(true) : this.koms(true);
    const baris = list.slice().sort((a, b) => (a.arsip ? 1 : 0) - (b.arsip ? 1 : 0)).map((x) => { const n = this.pakai(fk, x.id);
      return '<div class="row m-row' + (x.arsip ? ' m-arsip' : '') + '"><span class="m-tap" role="button" tabindex="0" data-do="dm-buka" data-j="' + j + '" data-id="' + x.id + '" aria-haspopup="dialog" aria-label="Lihat detail ' + esc(x.nama) + '"><span>' + f(x) + '</span>' +
        (n ? '<span class="mu">· ' + n + ' siklus</span>' : '') + (x.arsip ? '<span class="badge">arsip</span>' : '') + '<span class="m-chev" aria-hidden="true">›</span></span></div>'; }).join('');
    return '<div class="seg" role="group" aria-label="Pilih daftar">' + [['unit', 'Unit', nu], ['kom', 'Komoditas', nk]].map((x) =>
      '<button type="button" class="btn' + (this.msub === x[0] ? ' on' : '') + '" aria-pressed="' + (this.msub === x[0]) + '" data-do="master-tab" data-val="' + x[0] + '">' + x[1] + ' (' + x[2] + ')</button>').join('') + '</div>' +
      '<section><h2>' + (un ? 'Unit / lahan' : 'Komoditas') + '</h2>' + (baris || '<p class="note">Belum ada. Ketuk tombol + untuk menambah ' + (un ? 'unit' : 'komoditas') + '.</p>') +
      (list.length ? '<p class="note" style="margin-top:12px">Ketuk nama untuk detail dan aksi. Ketuk tombol + untuk menambah unit atau komoditas.</p>' : '') + '</section>';
  },

  /* ---------- aksi (true bila ditangani) ---------- */
  aksi(a, el) {
    const D = this.d(), v = (id) => ($(id) ? $(id).value.trim() : '');
    if (Dsk.aksi(a, el) || Jadwal.aksi(a, el)) return true;
    if (a === 'siklus-tab') { this.sub = el.dataset.val; App.go('siklus', true); }
    else if (a === 'lg-toggle') { const k = el.dataset.k; this.lg[k] = !this.lg[k]; const y = window.scrollY; App.go('siklus-detail', true); window.scrollTo(0, y); const b = document.querySelector('[data-do="lg-toggle"][data-k="' + k + '"]'); if (b) b.focus({ preventScroll: true }); }
    else if (a === 'buka-siklus') { this.dmTutup(false, true); this.sid = el.dataset.id; this.minta = null; App.go('siklus-detail'); }
    else if (a === 'ubah-siklus') {
      const s = this.cari(this.sid); if (!s) return true;
      this.sf = { id: s.id, unit: s.unitId, kom: s.komoditasId, mulai: s.mulai, selesai: s.selesai || '', cat: s.catatan || '' }; App.go('siklus-form');
    }
    else if (a === 'ulangi-siklus') {
      const s = this.cari(this.sid); if (!s) return true;
      this.sf = { id: null, unit: s.unitId, kom: s.komoditasId, mulai: isoHari(), selesai: '', cat: s.catatan || '' };
      App.toast('Disalin dari siklus sebelumnya — atur tanggal lalu Mulai'); App.go('siklus-form');
    }
    else if (a === 'simpan-siklus') {
      const f = this.sf || {}, ubah = !!f.id, s = ubah ? this.cari(f.id) : null, iso = /^\d{4}-\d{2}-\d{2}$/;
      if (ubah && !s) { App.toast('Siklus tidak ditemukan'); App.go('siklus'); return true; }
      const mulai = v('s_mulai'), unitId = v('s_unit'), komId = v('s_kom');
      if (!iso.test(mulai)) { App.toast('Isi tanggal mulai'); return true; }
      if (!this.units(true).some((x) => x.id === unitId) || !this.koms(true).some((x) => x.id === komId)) { App.toast('Pilih unit dan komoditas'); return true; }
      if (ubah) {
        const pn = this.panenOf(s.id).map((p) => p.tanggal).sort(), sel = s.status === 'selesai' ? v('s_selesai') : null;
        if (pn.length && mulai > pn[0]) { App.toast('Ada panen bertanggal ' + Setelan.tgl(pn[0]) + ', sebelum tanggal mulai'); return true; }
        if (sel !== null) {
          if (!iso.test(sel)) { App.toast('Isi tanggal selesai'); return true; }
          if (sel < mulai) { App.toast('Tanggal selesai tidak boleh sebelum tanggal mulai'); return true; }
          if (pn.length && sel < pn[pn.length - 1]) { App.toast('Ada panen bertanggal ' + Setelan.tgl(pn[pn.length - 1]) + ', setelah tanggal selesai'); return true; }
        }
        Object.assign(s, { unitId: unitId, komoditasId: komId, mulai: mulai, catatan: v('s_cat'), diubah: nowIso() }); if (sel !== null) s.selesai = sel;
        this.sf = null; App.simpan(); App.toast('Siklus diperbarui'); App.go('siklus-detail'); return true;
      }
      const n = { id: uid('s'), unitId: unitId, komoditasId: komId, mulai: mulai, selesai: null, status: 'berjalan', catatan: v('s_cat'), dibuat: nowIso(), diubah: nowIso(), terhapus: false };
      D.siklus.push(n); App.simpan(); this.sf = null; this.sid = n.id; this.sub = 'berjalan'; App.toast('Siklus dimulai'); App.go('siklus-detail');
    }
    else if (a === 'selesai-siklus') this.selesaiBuka(el);
    else if (a === 'buka-lagi') {
      const s = this.cari(this.sid); s.status = 'berjalan'; s.selesai = null; s.diubah = nowIso(); App.simpan(); App.go('siklus-detail', true);
    }
    else if (a === 'hapus-siklus') {
      const s = this.cari(this.sid), nTx = App.aktif().filter((t) => t.siklusId === s.id).length, nP = this.panenOf(s.id).length;
      if (nTx || nP) { App.toast('Tidak bisa dihapus: ' + (nTx ? nTx + ' transaksi' : '') + (nTx && nP ? ' dan ' : '') + (nP ? nP + ' panen' : '') + ' masih terhubung'); return true; }
      s.terhapus = true; s.diubah = nowIso(); this.minta = null; App.simpan(); App.go('siklus');
      App.toast('Siklus dihapus', { label: 'Urungkan', fn: () => { s.terhapus = false; s.diubah = nowIso(); App.simpan(); if (App.tab === 'siklus') App.go('siklus', true); } });
    }
    else if (a === 'hasil-ke-panen') { const d = App.bacaForm(); if (!d.siklus) return true; this.sid = d.siklus; App.draft = null; this.aksi('catat-panen', {}); return true; }
    else if (a === 'panen-belum-jual') { this.sid = el.dataset.sid; this.aksi('ubah-panen', el); return true; }
    else if (a === 'catat-panen' || a === 'ubah-panen') {
      const p = a === 'ubah-panen' ? D.panen.find((x) => x.id === el.dataset.id) : null;
      const pt = p && p.transaksiId && D.transaksi.find((x) => x.id === p.transaksiId && !x.terhapus);
      this.pd = p ? Object.assign({ id: p.id, tanggal: p.tanggal, kotor: p.kuantitasKotor, susut: p.susut, harga: p.hargaPerSatuan || 0, pembeli: p.pembeli || '' }, pt ? Utang.dari(pt) : Utang.d0())
                  : Object.assign({ id: null, tanggal: isoHari(), kotor: '', susut: '', harga: 0, pembeli: '' }, Utang.d0());
      this.minta = null; App.go('panen');
    }
    else if (a === 'simpan-panen') this.simpanPanen();
    else if (a === 'master-tab') { this.bacaMaster(); this.msub = el.dataset.val === 'kom' ? 'kom' : 'unit'; this.minta = null; App.go('master', true); }
    else if (a === 'dm-buka') this.dmBuka(el.dataset.j, el.dataset.id, el);
    else if (a === 'dm-tutup') this.dmTutup();
    else if (a.indexOf('dm-') === 0 && this.dm) {
      const j = this.dm.j, id = this.dm.id, ref = { dataset: { id: id } };
      if (a === 'dm-hapus') {
        this.dmTutup(false, true); this.aksi('hapus-' + j, ref);
      }
      else if (a === 'dm-arsip') { this.dmTutup(false, true); this.aksi('arsip-' + j, ref); }
      else if (a === 'dm-ubah') { this.dmTutup(false, true); this.aksi('ubah-' + j, ref); }
    }
    else if (a === 'ubah-unit' || a === 'ubah-kom') {
      const un = a === 'ubah-unit', x = (un ? D.unit : D.komoditas).find((y) => y.id === el.dataset.id); if (!x || x.terhapus) return true;
      this.mf = this.mfBaru();
      if (un) this.mf.unit = { id: x.id, nama: x.nama, jenis: x.jenis || 'kebun', ukur: x.ukuran ? String(x.ukuran).replace('.', ',') : '', sat: x.satuanUkuran || '' };
      else this.mf.kom = { id: x.id, nama: x.nama, sat: x.satuan || '', umur: x.umurPanenHari ? String(x.umurPanenHari) : '' };
      this.minta = null; this.formBuka(un ? 'unit' : 'kom', x.id);
    }
    else if (a === 'form-baru') { this.mf = this.mfBaru(); this.minta = null; this.formBuka(el.dataset.j === 'kom' ? 'kom' : 'unit', null); }
    else if (a === 'batal-unit' || a === 'batal-kom') { this.dmTutup(false, true); this.mf = this.mfBaru(); }
    else if (a === 'tambah-unit') {
      this.bacaMaster(); const U = this.mf.unit, nama = U.nama.trim().replace(/\s+/g, ' '), ukur = U.ukur.trim(), sat = U.sat.trim(), n = num(ukur);
      if (!nama) { this.gal('Isi nama unit'); return true; }
      if (this.kembar(this.units(true), nama, U.id)) { this.gal('Nama unit sudah ada'); return true; }
      if (ukur && n <= 0) { this.gal('Luas / kapasitas harus angka lebih dari 0'); return true; }
      if (n > 0 && !sat) { this.gal('Isi satuan luas / kapasitas'); return true; }
      const rec = U.id ? D.unit.find((x) => x.id === U.id && !x.terhapus) : null;
      if (U.id && !rec) { this.mf.unit = this.mfBaru().unit; App.toast('Unit tidak ditemukan'); this.selesaiForm(); return true; }
      const isi = { nama: nama, jenis: JENIS_UNIT.some((j) => j[0] === U.jenis) ? U.jenis : 'lainnya', ukuran: n > 0 ? n : null, satuanUkuran: n > 0 ? sat : null, diubah: nowIso() };
      if (rec) Object.assign(rec, isi); else D.unit.push(Object.assign({ id: uid('u'), dibuat: nowIso(), terhapus: false }, isi));
      this.mf.unit = this.mfBaru().unit; App.simpan(); App.toast(rec ? 'Unit diperbarui' : 'Unit ditambahkan'); this.selesaiForm();
    }
    else if (a === 'tpl-kom') {
      const t = TEMPLATE_KOM[Number(el.dataset.val)]; if (!t) return true;
      const set = (i, x) => { const e = document.getElementById(i); if (e) e.value = x; };
      set('m_knama', t.label); set('m_ksat', t.satuan); set('m_kumur', t.umur); App.toast('Template ' + t.label + ' diisi — sesuaikan lalu Tambah'); return true;
    }
    else if (a === 'tambah-kom') {
      this.bacaMaster(); const K = this.mf.kom, nama = K.nama.trim().replace(/\s+/g, ' '), sat = K.sat.trim(), umur = K.umur.trim();
      if (!nama || !sat) { this.gal('Isi nama dan satuan hasil'); return true; }
      if (this.kembar(this.koms(true), nama, K.id)) { this.gal('Nama komoditas sudah ada'); return true; }
      if (umur && (!/^\d+$/.test(umur) || +umur < 1 || +umur > 730)) { this.gal('Umur panen 1–730 hari, angka bulat'); return true; }
      const rec = K.id ? D.komoditas.find((x) => x.id === K.id && !x.terhapus) : null;
      if (K.id && !rec) { this.mf.kom = this.mfBaru().kom; App.toast('Komoditas tidak ditemukan'); this.selesaiForm(); return true; }
      const ubahSat = !!(rec && rec.satuan !== sat && D.panen.some((p) => !p.terhapus && this.daftar().some((s) => s.id === p.siklusId && s.komoditasId === rec.id)));
      const isi = { nama: nama, satuan: sat, umurPanenHari: umur ? parseInt(umur, 10) : null, diubah: nowIso() };
      if (rec) Object.assign(rec, isi); else D.komoditas.push(Object.assign({ id: uid('k'), dibuat: nowIso(), terhapus: false }, isi));
      this.mf.kom = this.mfBaru().kom; App.simpan(); App.toast(rec ? (ubahSat ? 'Komoditas diperbarui — satuan baru berlaku di semua panennya' : 'Komoditas diperbarui') : 'Komoditas ditambahkan'); this.selesaiForm();
    }
    else if (a === 'arsip-unit' || a === 'arsip-kom') {
      const un = a === 'arsip-unit', x = (un ? D.unit : D.komoditas).find((y) => y.id === el.dataset.id && !y.terhapus); if (!x) return true;
      this.bacaMaster(); x.arsip = !x.arsip; x.diubah = nowIso(); App.simpan(); App.go(App.tab === 'master' ? 'master' : App.tab, true);
      App.toast((x.arsip ? 'Diarsipkan: ' : 'Dipulihkan: ') + x.nama);
    }
    else if (a === 'hapus-unit' || a === 'hapus-kom') {
      const j = a === 'hapus-unit' ? 'unit' : 'kom', id = el.dataset.id, n = this.pakai(j === 'unit' ? 'unitId' : 'komoditasId', id);
      if (n) { App.toast('Masih dipakai ' + n + ' siklus — gunakan Arsipkan'); return true; }
      this.bacaMaster();
      if (this.minta !== j + ':' + id) { this.minta = j + ':' + id; App.go('master', true); return true; }
      const x = (j === 'unit' ? D.unit : D.komoditas).find((y) => y.id === id && !y.terhapus); if (!x) return true;
      x.terhapus = true; x.diubah = nowIso(); this.minta = null;
      if (this.mf && this.mf[j].id === id) this.mf[j] = this.mfBaru()[j];
      App.simpan(); App.go('master', true);
      App.toast((j === 'unit' ? 'Unit' : 'Komoditas') + ' dihapus', { label: 'Urungkan', fn: () => { x.terhapus = false; x.diubah = nowIso(); App.simpan(); if (App.tab === 'master') { this.bacaMaster(); App.go('master', true); } } });
    }
    else return false;
    return true;
  },

  /* ---------- modal detail unit & komoditas (v0.1.040) ---------- */
  dm: null, dmEl: null, dmKunci: '', dmKd: null,
  dmRek(j, id) { return (j === 'unit' ? this.d().unit : this.d().komoditas).find((x) => x.id === id && !x.terhapus); },
  dmStat(j, id) {
    const fk = j === 'unit' ? 'unitId' : 'komoditasId', ss = this.daftar().filter((s) => s[fk] === id), t = { modal: 0, hasil: 0, bersih: 0 };
    ss.forEach((s) => { const r = this.ringkas(s.id); t.modal += r.modal; t.hasil += r.hasil; t.bersih += r.bersih; });
    return Object.assign(t, { ss: ss, jalan: ss.filter((s) => s.status === 'berjalan').length });
  },
  dmGambar() {
    const m = this.dm, x = m && m.id ? this.dmRek(m.j, m.id) : null; if (!m || !this.dmEl || (m.id && !x)) { this.dmTutup(); return; }
    if (m.form) { this.dmForm(); return; }
    const un = m.j === 'unit', st = this.dmStat(m.j, x.id), n = st.ss.length, u = st.hasil - st.modal, yakin = this.minta === m.j + ':' + x.id;
    const baris = (a, b) => '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>';
    const pp = un ? null : st.ss.map((s) => this.panenPerkiraan(s)).filter(Boolean).sort((a, b) => a.sisa - b.sisa)[0];
    const jenis = un ? (JENIS_UNIT.find((j) => j[0] === x.jenis) || [0, x.jenis])[1] : 'Komoditas';
    const lst = st.ss.slice().sort((a, b) => (a.status === 'berjalan' ? 0 : 1) - (b.status === 'berjalan' ? 0 : 1) || b.mulai.localeCompare(a.mulai)).slice(0, 5).map((s) => {
      const o = un ? this.kom(s.komoditasId) : this.unit(s.unitId);
      return '<div class="tx" data-do="buka-siklus" data-id="' + s.id + '" role="button" tabindex="0"><div class="tx-l"><div class="tx-n">' + esc(o ? o.nama : '?') + '</div><div class="note">' + Setelan.tgl(s.mulai) + (s.status === 'selesai' ? ' → ' + Setelan.tgl(s.selesai) : ' · hari ' + this.hari(s)) + '</div></div><div class="tx-a"><span class="badge' + (s.status === 'berjalan' ? ' live' : '') + '">' + s.status + '</span></div></div>'; }).join('');
    const tb = (a, t, c) => '<button type="button" class="btn' + (c ? ' ' + c : '') + '" data-do="' + a + '">' + t + '</button>';
    const isi = baris('Dipakai', n ? n + ' siklus · ' + st.jalan + ' berjalan · ' + (n - st.jalan) + ' selesai' : 'belum ada siklus') +
      (un ? baris('Luas / kapasitas', x.ukuran ? fmtN(x.ukuran) + ' ' + esc(x.satuanUkuran || '') : '—')
          : baris('Satuan hasil', esc(x.satuan)) + baris('Umur panen', x.umurPanenHari ? '±' + x.umurPanenHari + ' hari' : '—') + baris('Panen bersih', fmtN(st.bersih) + ' ' + esc(x.satuan)) +
            (pp ? baris('Panen terdekat', pp.sisa >= 0 ? Setelan.tgl(pp.tgl) + ' · ' + (pp.sisa === 0 ? 'hari ini' : pp.sisa + ' hari lagi') : '<span class="down">terlambat ' + (-pp.sisa) + ' hari</span>') : '')) +
      (n ? '<div class="sum dm-sum"><div><span class="note">Modal</span><strong class="down">' + rp(st.modal) + '</strong></div><div><span class="note">Hasil</span><strong class="up">' + rp(st.hasil) + '</strong></div>' +
           '<div><span class="note">' + (u < 0 ? 'Rugi' : 'Untung') + '</span><strong class="' + (u < 0 ? 'down' : 'up') + '">' + rp(u) + '</strong></div></div>' +
           '<div class="dm-sub">Siklus' + (n > 5 ? ' (5 terbaru dari ' + n + ')' : '') + '</div>' + lst : '') +
      '<p class="note" style="margin:12px 0 4px">' + (x.arsip ? 'Diarsipkan: tidak muncul di pilihan siklus baru, tetap tampil di siklus lama.' : n ? 'Sudah dipakai siklus, jadi tidak bisa dihapus. Arsipkan agar tidak muncul di pilihan siklus baru.' : 'Belum dipakai siklus mana pun, jadi bisa dihapus.') + '</p>';
    const aksi = '<div class="seg tiga">' + tb('dm-ubah', 'Ubah') + (x.arsip ? tb('dm-arsip', 'Pulihkan') : n ? tb('dm-arsip', 'Arsipkan') : '') + (n ? '' : tb('dm-hapus', 'Hapus', 'danger')) + '</div>';
    this.dmEl.firstChild.innerHTML = '<div class="dm-kepala"><div><div class="dm-jenis">' + (un ? 'Unit / lahan' : 'Komoditas') + ' · ' + jenis + (x.arsip ? ' · arsip' : '') + '</div><h2 class="dm-judul" id="dmJudul">' + esc(x.nama) + '</h2></div>' +
      '<button type="button" class="dm-x" data-do="dm-tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="dm-isi">' + isi + '</div><div class="dm-aksi">' + aksi + '</div>';
    if (typeof Samar !== 'undefined' && Samar.aktif()) Samar.sapu(this.dmEl);
  },
  dmBuka(j, id, pemicu, form) {
    if (this.dmEl || Modal.m || (id && !this.dmRek(j, id))) return;
    this.dm = { j: j, id: id, pemicu: pemicu, form: !!form }; this.minta = null;
    this.dmEl = Modal.buka({
      judulId: 'dmJudul', pemicu: pemicu, html: '', tutupLatar: () => !(this.dm && this.dm.form),
      simpan: () => { const b = this.dmEl && this.dmEl.querySelector('.btn.gold'); if (b) b.click(); },
      cadangan: () => document.querySelector('.m-tap[data-id="' + id + '"]'),
      onTutup: () => { this.dmEl = null; this.dm = null; if (!this.simpanMinta) this.minta = null; this.simpanMinta = false; }
    });
    this.dmGambar(); if (this.dmEl) { const i = form && this.dmEl.querySelector('input'); (i || this.dmEl.firstChild).focus(); }
  },
  gal(teks) { if (Modal.m) Modal.galat(teks); else App.toast(teks); },
  formBuka(j, id) { const pe = document.activeElement; this.dmBuka(j, id, pe && pe !== document.body ? pe : null, true); },
  selesaiForm() { this.dmTutup(false, true); App.go(App.tab, true); },
  dmForm() {
    const m = this.dm, un = m.j === 'unit', U = this.mf.unit, K = this.mf.kom, ed = !!(un ? U.id : K.id), tit = (ed ? 'Ubah ' : 'Tambah ') + (un ? 'unit' : 'komoditas');
    const isi = un ? '<label for="m_unama">Nama</label><input id="m_unama" maxlength="40" value="' + esc(U.nama) + '" placeholder="mis. Kebun belakang">' +
      '<label for="m_ujenis">Jenis</label><select id="m_ujenis">' + JENIS_UNIT.map((j) => '<option value="' + j[0] + '"' + (j[0] === U.jenis ? ' selected' : '') + '>' + j[1] + '</option>').join('') + '</select>' +
      '<div class="two"><div><label for="m_uukur">Luas / kapasitas</label><input id="m_uukur" inputmode="decimal" value="' + esc(U.ukur) + '"></div><div><label for="m_usat">Satuan</label><input id="m_usat" maxlength="12" value="' + esc(U.sat) + '" placeholder="m², lubang, ekor"></div></div>'
      : (ed ? '<p class="note" style="margin-top:0">Satuan baru berlaku di semua panennya.</p>' : '<p class="note" style="margin-top:0">Isi cepat dari template (nama, satuan, umur panen; bisa diubah):</p><div class="seg sm" style="justify-content:flex-start;margin:6px 0">' + TEMPLATE_KOM.map((t, i) => '<button type="button" class="btn" data-do="tpl-kom" data-val="' + i + '">' + t.label + '</button>').join('') + '</div>') +
      '<label for="m_knama">Nama</label><input id="m_knama" maxlength="40" value="' + esc(K.nama) + '" placeholder="mis. Cabai rawit">' +
      '<div class="two"><div><label for="m_ksat">Satuan hasil</label><input id="m_ksat" maxlength="12" value="' + esc(K.sat) + '" placeholder="kg, ikat, butir"></div><div><label for="m_kumur">Umur panen (hari)</label><input id="m_kumur" inputmode="numeric" value="' + esc(K.umur) + '"></div></div>';
    this.dmEl.firstChild.innerHTML = '<div class="dm-kepala"><div><div class="dm-jenis">' + (un ? 'Unit / lahan' : 'Komoditas') + '</div><h2 class="dm-judul" id="dmJudul">' + tit + '</h2></div>' +
      '<button type="button" class="dm-x" data-do="dm-tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="dm-isi">' + isi + '</div><div class="dm-aksi"><button type="button" class="btn gold" data-do="tambah-' + m.j + '">' + (ed ? 'Simpan perubahan' : tit) + '</button><button type="button" class="btn" data-do="batal-' + m.j + '" style="width:100%">Batal</button></div>';
  },
  dmTutup(simpanMinta, tanpaFokus) { // simpanMinta: pertahankan keadaan minta; tanpaFokus: jangan kembalikan fokus ke baris
    if (!this.dmEl) return;
    this.simpanMinta = !!simpanMinta; Modal.tutup(tanpaFokus);
  },
  bacaPanen() {
    if (!$('p_tgl')) return; const p = this.pd, g = (i) => ($(i) ? $(i).value : '');
    Object.assign(p, { tanggal: g('p_tgl'), kotor: g('p_kotor'), susut: g('p_susut'), harga: angka(g('p_harga')), pembeli: g('p_pembeli') });
    Utang.baca(p, 'p');
  },
  simpanPanen() {
    const D = this.d(), s = this.cari(this.sid), g = (id) => $(id).value;
    const p = { id: this.pd.id, tanggal: g('p_tgl'), kotor: num(g('p_kotor')), susut: num(g('p_susut')), harga: angka(g('p_harga')), pembeli: g('p_pembeli').trim() };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.tanggal)) { App.toast('Isi tanggal'); return; }
    if (p.tanggal < s.mulai) { App.toast('Tanggal panen sebelum tanggal mulai siklus'); return; }
    if (p.kotor <= 0) { App.toast('Isi hasil kotor lebih dari 0'); return; }
    if (p.susut < 0 || p.susut > p.kotor) { App.toast('Susut tidak boleh melebihi hasil kotor'); return; }
    const k = this.kom(s.komoditasId), sat = k ? k.satuan : '', bersih = p.kotor - p.susut, jml = Math.round(bersih * p.harga);
    const bs = Utang.baca(Object.assign({}, this.pd), 'p'); bs.pihak = p.pembeli;
    const recLama = p.id && D.panen.find((x) => x.id === p.id), tLama = recLama && recLama.transaksiId && D.transaksi.find((x) => x.id === recLama.transaksiId);
    if (jml <= 0 && !bs.kunci && bs.bayar !== 'tunai') { App.toast('Isi harga jual agar bisa dicatat sebagai utang/piutang'); return; }
    if (jml <= 0 && tLama && Utang.tahan(tLama)) return;
    const gal = jml > 0 ? Utang.cek(jml, bs, tLama && Utang.tertaut(tLama)) : '';
    if (gal) { App.toast(gal); return; }
    let rec = recLama;
    if (!rec) { rec = { id: uid('p'), siklusId: s.id, dibuat: nowIso(), terhapus: false, transaksiId: null }; D.panen.push(rec); }
    Object.assign(rec, { tanggal: p.tanggal, kuantitasKotor: p.kotor, susut: p.susut, hargaPerSatuan: p.harga || null, pembeli: p.pembeli, diubah: nowIso() });
    let t = rec.transaksiId && D.transaksi.find((x) => x.id === rec.transaksiId);
    if (jml > 0) {
      if (!t) { t = { id: uid('t'), jenis: 'masuk', kategoriId: 'jual-panen', sifatBiaya: null, dibuat: nowIso() }; D.transaksi.push(t); rec.transaksiId = t.id; }
      Object.assign(t, { tanggal: p.tanggal, jumlah: jml, siklusId: s.id, catatan: 'Panen ' + fmtN(bersih) + ' ' + sat + (p.pembeli ? ' ke ' + p.pembeli : ''), diubah: nowIso(), terhapus: false });
      Utang.sinkron(t, bs);
    } else if (t) { t.terhapus = true; t.diubah = nowIso(); Utang.ikut(t, true); rec.transaksiId = null; }
    App.simpan(); this.pd = null; this.minta = null; App.toast(recLama ? 'Panen diperbarui' : 'Panen tersimpan'); App.go('siklus-detail');
  }
};
