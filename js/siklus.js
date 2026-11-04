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
  sid: null, sub: 'berjalan', pd: null, minta: null,
  d() { return App.data; },
  unit(id) { return this.d().unit.find((x) => x.id === id); },
  kom(id) { return this.d().komoditas.find((x) => x.id === id); },
  units() { return this.d().unit.filter((x) => !x.terhapus); },
  koms() { return this.d().komoditas.filter((x) => !x.terhapus); },
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
    const ada = this.daftar(), tampil = ada.filter((s) => s.status === this.sub).sort((a, b) => { if (this.sub === 'berjalan') { const x = this.panenPerkiraan(a), y = this.panenPerkiraan(b); return (x ? x.sisa : 1e9) - (y ? y.sisa : 1e9) || b.mulai.localeCompare(a.mulai); } return b.mulai.localeCompare(a.mulai); });
    return '<section><div class="seg">' + [['berjalan', 'Berjalan'], ['selesai', 'Selesai']].map((x) =>
      '<button type="button" class="btn' + (this.sub === x[0] ? ' on' : '') + '" data-do="siklus-tab" data-val="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>' +
      (tampil.length ? tampil.map((s) => {
        const r = this.ringkas(s.id), k = this.kom(s.komoditasId), pp = this.panenPerkiraan(s);
        return '<div class="sc-card" data-do="buka-siklus" data-id="' + s.id + '" role="button" tabindex="0"><div class="sc-head"><span class="sc-name">' + esc(this.nama(s.id)) + '</span>' +
          '<span class="badge' + (s.status === 'berjalan' ? ' live' : '') + '">' + (s.status === 'berjalan' ? 'hari ' + this.hari(s) + (k && k.umurPanenHari ? '/' + k.umurPanenHari : '') : 'selesai') + '</span></div>' +
          '<div class="note">Mulai ' + Setelan.tgl(s.mulai) + ' · Modal ' + rp(r.modal) + ' · Hasil ' + rp(r.hasil) + (s.status === 'berjalan' && r.hasil ? ' · ' + (r.hasil - r.modal < 0 ? 'Rugi ' : 'Untung ') + rp(Math.abs(r.hasil - r.modal)) : '') + '</div>' +
          (pp ? '<div class="note">' + (pp.sisa >= 0 ? 'Perkiraan panen ' + Setelan.tgl(pp.tgl) + ' · ' + (pp.sisa === 0 ? 'hari ini' : pp.sisa + ' hari lagi') : '<span class="down">Lewat perkiraan panen ' + Setelan.tgl(pp.tgl) + ' · terlambat ' + (-pp.sisa) + ' hari</span>') + '</div>' : '') +
          (s.anggaran ? (() => { const p = Math.round(r.modal / s.anggaran * 100); return '<div class="bar-ang' + (p > 100 ? ' x' : p >= 90 ? ' w' : '') + '" role="img" aria-label="Modal ' + p + ' persen dari anggaran"><i style="width:' + Math.min(100, p) + '%"></i></div><div class="note">Anggaran ' + rp(s.anggaran) + ' · terpakai ' + p + '%</div>'; })() : '') + '</div>';
      }).join('') : '<p class="note" style="margin-top:14px">' + (ada.length ? 'Tidak ada siklus ' + this.sub + '.' : 'Belum ada siklus. Siapkan unit dan komoditas, lalu mulai siklus pertama.') + '</p>') +
      '<button class="btn gold" data-do="siklus-baru">Siklus baru</button>' +
      '<button class="btn" data-go="master" style="width:100%;margin-top:10px">Kelola unit &amp; komoditas</button></section>';
  },
  vForm() {
    if (!this.units().length || !this.koms().length)
      return '<section><p class="note">Tambahkan dulu minimal satu unit/lahan dan satu komoditas.</p>' +
        '<button class="btn gold" data-go="master">Kelola unit &amp; komoditas</button><button class="btn" data-go="siklus" style="width:100%;margin-top:10px">Batal</button></section>';
    return '<section>' +
      '<label for="s_unit">Unit / lahan</label><select id="s_unit">' + this.opsi(this.units(), '', (u) => u.nama) + '</select>' +
      '<label for="s_kom">Komoditas</label><select id="s_kom">' + this.opsi(this.koms(), '', (k) => k.nama) + '</select>' +
      '<label for="s_mulai">Tanggal mulai</label><input type="date" id="s_mulai" value="' + isoHari() + '">' +
      '<label for="s_cat">Catatan (opsional)</label><input id="s_cat" maxlength="120" placeholder="mis. bibit dari toko tani">' +
      '<button class="btn gold" data-do="simpan-siklus">Mulai siklus</button><button class="btn" data-go="siklus" style="width:100%;margin-top:10px">Batal</button></section>';
  },
  vDetail() {
    const s = this.cari(this.sid);
    if (!s) return this.vList();
    const r = this.ringkas(s.id), k = this.kom(s.komoditasId), sat = k ? k.satuan : '', jalan = s.status === 'berjalan', u = r.hasil - r.modal;
    const panen = this.panenOf(s.id).map((p) => '<div class="tx"' + (jalan ? ' data-do="ubah-panen" data-id="' + p.id + '" role="button" tabindex="0"' : '') + '><div class="tx-l"><div class="tx-n">' +
      fmtN(p.kuantitasKotor - p.susut) + ' ' + esc(sat) + ' bersih</div><div class="note">' + Setelan.tgl(p.tanggal) + ' · susut ' + fmtN(p.susut) + (p.pembeli ? ' · ' + esc(p.pembeli) : '') + '</div></div>' +
      '<div class="tx-a">' + (p.hargaPerSatuan ? rp(p.hargaPerSatuan) + '/' + esc(sat) : '—') + '</div></div>').join('');
    return '<section><div class="sc-head"><h2 style="margin:0">Ringkasan</h2><span class="badge' + (jalan ? ' live' : '') + '">' + (jalan ? 'berjalan' : 'selesai') + '</span></div>' +
      '<p class="note" style="margin:8px 0 0">Mulai ' + Setelan.tgl(s.mulai) + (jalan ? ' · hari ' + this.hari(s) + (k && k.umurPanenHari ? ' dari ±' + k.umurPanenHari : '') : ' · selesai ' + Setelan.tgl(s.selesai) + ' (' + this.hari(s) + ' hari)') + (s.catatan ? ' · ' + esc(s.catatan) : '') + '</p>' +
      '<div class="sum" style="margin-top:14px"><div><span class="note">Modal</span><strong class="down">' + rp(r.modal) + '</strong></div><div><span class="note">Hasil</span><strong class="up">' + rp(r.hasil) + '</strong></div>' +
      '<div><span class="note">' + (u < 0 ? 'Rugi' : 'Untung') + '</span><strong class="' + (u < 0 ? 'down' : 'up') + '">' + rp(u) + '</strong></div></div>' +
      '<div class="row"><span class="mu">Panen bersih</span><span>' + fmtN(r.bersih) + ' ' + esc(sat) + '</span></div>' +
      (jalan ? '<div class="seg" style="margin-top:12px"><button class="btn" data-do="catat-siklus">Catat transaksi</button><button class="btn" data-do="catat-panen">Catat panen</button></div>' +
        '<button class="btn" data-do="selesai-siklus" style="width:100%;margin-top:10px">Selesaikan siklus</button>'
        : '<p class="note" style="margin-top:12px">Siklus selesai tidak menerima transaksi baru.</p><button class="btn" data-do="buka-lagi" style="width:100%;margin-top:6px">Buka kembali</button>') +
      '<button class="btn danger" data-do="hapus-siklus" style="width:100%;margin-top:10px">' + (this.minta === 'siklus' ? 'Ketuk lagi untuk menghapus' : 'Hapus siklus') + '</button>' +
      '<button class="btn" data-go="siklus" style="width:100%;margin-top:10px">Kembali ke daftar</button></section>' +
      '<section><h2>Panen</h2>' + (panen || '<p class="note">Belum ada panen.</p>') + '</section>' +
      '<section><h2>Transaksi siklus</h2>' + (r.tx.length ? r.tx.sort((a, b) => b.tanggal.localeCompare(a.tanggal)).map((t) => App.barisTx(t)).join('') : '<p class="note">Belum ada transaksi terhubung.</p>') + '</section>';
  },
  vPanen() {
    const s = this.cari(this.sid), k = s && this.kom(s.komoditasId), p = this.pd, sat = k ? k.satuan : '';
    return '<section><p class="note" style="margin-top:0">' + esc(this.nama(this.sid)) + '</p>' +
      '<label for="p_tgl">Tanggal</label><input type="date" id="p_tgl" value="' + p.tanggal + '">' +
      '<div class="two"><div><label for="p_kotor">Hasil kotor (' + esc(sat) + ')</label><input id="p_kotor" inputmode="decimal" value="' + (p.kotor || '') + '"></div>' +
      '<div><label for="p_susut">Susut / reject</label><input id="p_susut" inputmode="decimal" value="' + (p.susut || '') + '" placeholder="0"></div></div>' +
      '<label for="p_harga">Harga jual per ' + esc(sat) + ' (opsional)</label><input id="p_harga" inputmode="numeric" value="' + fmtInput(p.harga) + '" placeholder="0">' +
      '<label for="p_pembeli">Pembeli (opsional)</label><input id="p_pembeli" maxlength="60" value="' + esc(p.pembeli) + '">' +
      '<p class="note" style="margin-top:10px">Jika harga diisi, hasil penjualan otomatis dicatat sebagai transaksi Hasil siklus ini.</p>' +
      '<button class="btn gold" data-do="simpan-panen">Simpan</button><button class="btn" data-go="siklus-detail" style="width:100%;margin-top:10px">Batal</button>' +
      (p.id ? '<button class="btn danger" data-do="hapus-panen" style="width:100%;margin-top:10px">' + (this.minta === 'panen' ? 'Ketuk lagi untuk menghapus' : 'Hapus panen') + '</button>' : '') + '</section>';
  },
  vMaster() {
    const baris = (list, f, aksi) => list.length ? list.map((x) => '<div class="row"><span>' + f(x) + '</span><button class="btn" data-do="' + aksi + '" data-id="' + x.id + '" style="flex:0 0 auto;padding:4px 10px;font-size:12px">Hapus</button></div>').join('') : '<p class="note">Belum ada.</p>';
    return '<section><h2>Unit / lahan</h2>' + baris(this.units(), (u) => esc(u.nama) + ' <span class="mu">· ' + (JENIS_UNIT.find((j) => j[0] === u.jenis) || [0, u.jenis])[1] + (u.ukuran ? ' · ' + fmtN(u.ukuran) + ' ' + esc(u.satuanUkuran || '') : '') + '</span>', 'hapus-unit') +
      '<label for="m_unama">Nama</label><input id="m_unama" maxlength="40" placeholder="mis. Kebun belakang">' +
      '<label for="m_ujenis">Jenis</label><select id="m_ujenis">' + JENIS_UNIT.map((j) => '<option value="' + j[0] + '">' + j[1] + '</option>').join('') + '</select>' +
      '<div class="two"><div><label for="m_uukur">Luas / kapasitas</label><input id="m_uukur" inputmode="decimal"></div><div><label for="m_usat">Satuan</label><input id="m_usat" maxlength="12" placeholder="m², lubang, ekor"></div></div>' +
      '<button class="btn gold" data-do="tambah-unit">Tambah unit</button></section>' +
      '<section><h2>Komoditas</h2>' + baris(this.koms(), (k) => esc(k.nama) + ' <span class="mu">· ' + esc(k.satuan) + (k.umurPanenHari ? ' · ±' + k.umurPanenHari + ' hari' : '') + '</span>', 'hapus-kom') +
      '<p class="note" style="margin-top:12px">Isi cepat dari template (nama, satuan, umur panen; bisa diubah):</p><div class="seg sm" style="justify-content:flex-start;margin:6px 0">' + TEMPLATE_KOM.map((t, i) => '<button type="button" class="btn" data-do="tpl-kom" data-val="' + i + '">' + t.label + '</button>').join('') + '</div>' +
      '<label for="m_knama">Nama</label><input id="m_knama" maxlength="40" placeholder="mis. Cabai rawit">' +
      '<div class="two"><div><label for="m_ksat">Satuan hasil</label><input id="m_ksat" maxlength="12" placeholder="kg, ikat, butir"></div><div><label for="m_kumur">Umur panen (hari)</label><input id="m_kumur" inputmode="numeric"></div></div>' +
      '<button class="btn gold" data-do="tambah-kom">Tambah komoditas</button></section>';
  },

  /* ---------- aksi (true bila ditangani) ---------- */
  aksi(a, el) {
    const D = this.d(), v = (id) => ($(id) ? $(id).value.trim() : '');
    if (a === 'siklus-tab') { this.sub = el.dataset.val; App.go('siklus', true); }
    else if (a === 'buka-siklus') { this.sid = el.dataset.id; this.minta = null; App.go('siklus-detail'); }
    else if (a === 'siklus-baru') App.go('siklus-form');
    else if (a === 'simpan-siklus') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v('s_mulai'))) { App.toast('Isi tanggal mulai'); return true; }
      const s = { id: uid('s'), unitId: v('s_unit'), komoditasId: v('s_kom'), mulai: v('s_mulai'), selesai: null, status: 'berjalan', catatan: v('s_cat'), dibuat: nowIso(), diubah: nowIso(), terhapus: false };
      D.siklus.push(s); App.simpan(); this.sid = s.id; this.sub = 'berjalan'; App.toast('Siklus dimulai'); App.go('siklus-detail');
    }
    else if (a === 'selesai-siklus' || a === 'buka-lagi') {
      const s = this.cari(this.sid); s.status = a === 'buka-lagi' ? 'berjalan' : 'selesai'; s.selesai = a === 'buka-lagi' ? null : isoHari(); s.diubah = nowIso();
      App.simpan(); App.go('siklus-detail', true);
    }
    else if (a === 'hapus-siklus') {
      const s = this.cari(this.sid), pakai = App.aktif().some((t) => t.siklusId === s.id) || this.panenOf(s.id).length;
      if (pakai) { App.toast('Masih ada transaksi atau panen di siklus ini'); return true; }
      if (this.minta !== 'siklus') { this.minta = 'siklus'; App.go('siklus-detail', true); return true; }
      s.terhapus = true; this.minta = null; App.simpan(); App.toast('Siklus dihapus'); App.go('siklus');
    }
    else if (a === 'catat-siklus') App.baru(this.sid);
    else if (a === 'catat-panen' || a === 'ubah-panen') {
      const p = a === 'ubah-panen' ? D.panen.find((x) => x.id === el.dataset.id) : null;
      this.pd = p ? { id: p.id, tanggal: p.tanggal, kotor: p.kuantitasKotor, susut: p.susut, harga: p.hargaPerSatuan || 0, pembeli: p.pembeli || '' }
                  : { id: null, tanggal: isoHari(), kotor: '', susut: '', harga: 0, pembeli: '' };
      this.minta = null; App.go('panen');
    }
    else if (a === 'simpan-panen') this.simpanPanen();
    else if (a === 'hapus-panen') {
      if (this.minta !== 'panen') { this.minta = 'panen'; App.go('panen', true); return true; }
      const p = D.panen.find((x) => x.id === this.pd.id), t = p.transaksiId && D.transaksi.find((x) => x.id === p.transaksiId);
      p.terhapus = true; p.diubah = nowIso(); if (t) { t.terhapus = true; t.diubah = nowIso(); }
      this.minta = null; App.simpan(); App.toast('Panen dihapus'); App.go('siklus-detail');
    }
    else if (a === 'tambah-unit') {
      if (!v('m_unama')) { App.toast('Isi nama unit'); return true; }
      D.unit.push({ id: uid('u'), nama: v('m_unama'), jenis: v('m_ujenis'), ukuran: num(v('m_uukur')) || null, satuanUkuran: v('m_usat') || null, dibuat: nowIso(), diubah: nowIso(), terhapus: false });
      App.simpan(); App.go('master', true);
    }
    else if (a === 'tpl-kom') {
      const t = TEMPLATE_KOM[Number(el.dataset.val)]; if (!t) return true;
      const set = (i, x) => { const e = document.getElementById(i); if (e) e.value = x; };
      set('m_knama', t.label); set('m_ksat', t.satuan); set('m_kumur', t.umur); App.toast('Template ' + t.label + ' diisi — sesuaikan lalu Tambah'); return true;
    }
    else if (a === 'tambah-kom') {
      if (!v('m_knama') || !v('m_ksat')) { App.toast('Isi nama dan satuan hasil'); return true; }
      D.komoditas.push({ id: uid('k'), nama: v('m_knama'), satuan: v('m_ksat'), umurPanenHari: parseInt(v('m_kumur'), 10) || null, dibuat: nowIso(), diubah: nowIso(), terhapus: false });
      App.simpan(); App.go('master', true);
    }
    else if (a === 'hapus-unit' || a === 'hapus-kom') {
      const f = a === 'hapus-unit' ? 'unitId' : 'komoditasId';
      if (this.daftar().some((s) => s[f] === el.dataset.id)) { App.toast('Masih dipakai siklus'); return true; }
      const x = (a === 'hapus-unit' ? D.unit : D.komoditas).find((y) => y.id === el.dataset.id); x.terhapus = true; App.simpan(); App.go('master', true);
    }
    else return false;
    return true;
  },
  simpanPanen() {
    const D = this.d(), s = this.cari(this.sid), g = (id) => $(id).value;
    const p = { id: this.pd.id, tanggal: g('p_tgl'), kotor: num(g('p_kotor')), susut: num(g('p_susut')), harga: angka(g('p_harga')), pembeli: g('p_pembeli').trim() };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.tanggal)) { App.toast('Isi tanggal'); return; }
    if (p.kotor <= 0) { App.toast('Isi hasil kotor lebih dari 0'); return; }
    if (p.susut < 0 || p.susut > p.kotor) { App.toast('Susut tidak boleh melebihi hasil kotor'); return; }
    const k = this.kom(s.komoditasId), sat = k ? k.satuan : '', bersih = p.kotor - p.susut, jml = Math.round(bersih * p.harga);
    let rec = p.id && D.panen.find((x) => x.id === p.id);
    if (!rec) { rec = { id: uid('p'), siklusId: s.id, dibuat: nowIso(), terhapus: false, transaksiId: null }; D.panen.push(rec); }
    Object.assign(rec, { tanggal: p.tanggal, kuantitasKotor: p.kotor, susut: p.susut, hargaPerSatuan: p.harga || null, pembeli: p.pembeli, diubah: nowIso() });
    let t = rec.transaksiId && D.transaksi.find((x) => x.id === rec.transaksiId);
    if (jml > 0) {
      if (!t) { t = { id: uid('t'), jenis: 'masuk', kategoriId: 'jual-panen', sifatBiaya: null, dibuat: nowIso() }; D.transaksi.push(t); rec.transaksiId = t.id; }
      Object.assign(t, { tanggal: p.tanggal, jumlah: jml, siklusId: s.id, catatan: 'Panen ' + fmtN(bersih) + ' ' + sat + (p.pembeli ? ' ke ' + p.pembeli : ''), diubah: nowIso(), terhapus: false });
    } else if (t) { t.terhapus = true; t.diubah = nowIso(); rec.transaksiId = null; }
    App.simpan(); this.pd = null; this.minta = null; App.toast('Panen tersimpan'); App.go('siklus-detail');
  }
};
