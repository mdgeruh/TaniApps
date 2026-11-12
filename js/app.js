/* Buku Kebun — Fase 1: pencatatan transaksi + efek kaca (v0.1.039) */
const VERSI = '0.1.121';
const KUNCI = 'tani.v1';
const IKON = {
  master: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><path d="M16.5 13v7M13 16.5h7"/>',
  beranda: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  transaksi: '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  siklus: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
  laporan: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V7M16 16v-8"/>',
  setelan: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  lainnya: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'
};
const ikon = (k, c) => '<svg class="' + c + '" viewBox="0 0 24 24" aria-hidden="true">' + IKON[k] + '</svg>';
const TAB = [['beranda','Beranda'],['transaksi','Transaksi'],['siklus','Siklus'],['master','Unit'],['laporan','Laporan'],['lainnya','Lainnya']];
const NANTI = {
  laporan: ['Laporan', 'Laporan hadir di Fase 3.']
};
const SEED = {
  keluar: [
    { id: 'benih', nama: 'Benih / Bibit', sifatBiaya: 'variabel' },
    { id: 'pupuk', nama: 'Pupuk / Nutrisi', sifatBiaya: 'variabel' },
    { id: 'pestisida', nama: 'Pestisida / Obat', sifatBiaya: 'variabel' },
    { id: 'pakan', nama: 'Pakan', sifatBiaya: 'variabel' },
    { id: 'media', nama: 'Media Tanam / Polybag', sifatBiaya: 'variabel' },
    { id: 'upah', nama: 'Tenaga Kerja', sifatBiaya: 'variabel' },
    { id: 'air-listrik', nama: 'Air / Listrik', sifatBiaya: 'tetap' },
    { id: 'alat', nama: 'Alat & Perlengkapan', sifatBiaya: 'tetap' },
    { id: 'sewa', nama: 'Sewa Lahan', sifatBiaya: 'tetap' },
    { id: 'kemasan', nama: 'Kemasan & Pengiriman', sifatBiaya: 'variabel' },
    { id: 'lain-keluar', nama: 'Lainnya', sifatBiaya: 'variabel' }
  ],
  masuk: [
    { id: 'jual-panen', nama: 'Penjualan Hasil Panen' },
    { id: 'jual-bibit', nama: 'Penjualan Bibit / Olahan' },
    { id: 'subsidi', nama: 'Bantuan / Subsidi' },
    { id: 'lain-masuk', nama: 'Lainnya' }
  ]
};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => (n < 10 ? '0' : '') + n;
const isoHari = (d) => { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
const bulanIni = () => isoHari().slice(0, 7);
const bulanLalu = () => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1); return isoHari(d).slice(0, 7); };
const fmtRC = (v) => v.toFixed(2).replace('.', ',');
const rp = (n) => (n < 0 ? '−' : '') + 'Rp ' + Math.abs(n).toLocaleString('id-ID');
/* Rupiah bulat. Menerima "1.250.000", "1250000", "12,5" (dibulatkan), "Rp 3.000"; selain itu 0 (tidak dikenali). */
const angka = (s) => {
  const t = String(s == null ? '' : s).trim().replace(/^rp\.?\s*/i, '').replace(/\s/g, '');
  if (!t) return 0;
  let n = NaN;
  if (/^\d+$/.test(t)) n = +t;
  else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) n = parseFloat(t.replace(/\./g, '').replace(',', '.'));
  else if (/^\d+,\d+$/.test(t)) n = parseFloat(t.replace(',', '.'));
  else if (/^\d+\.\d{1,2}$/.test(t)) n = parseFloat(t);
  return isFinite(n) ? Math.round(n) : 0;
};
const angkaKetik = (s) => parseInt(String(s || '').replace(/\D/g, ''), 10) || 0;
const fmtInput = (n) => (n ? n.toLocaleString('id-ID') : '');
const uid = (p) => p + '_' + Math.random().toString(36).slice(2, 8);
const nowIso = () => new Date().toISOString();

const Store = {
  kosong() {
    return { versi: 1, utang: [], unit: [], komoditas: [], siklus: [], transaksi: [], panen: [], aset: [], kategori: [], jurnal: [],
             pengaturan: { mataUang: 'IDR', bulanMulai: 1 } };
  },
  /* ---------- keamanan multi-tab (v0.1.101, docs/MULTITAB.md) ----------
     Tab/PWA lain di perangkat yang sama menulis ke localStorage yang sama. `_dasar` = teks JSON terakhir yang dimuat atau ditulis tab ini.
     Bila isi localStorage berbeda dari `_dasar` saat menyimpan, tab lain telah mengubah data: gabung 3 arah per entri (dasar, tab ini, isi sekarang)
     alih-alih menimpa. Entri yang hanya diubah satu pihak diambil dari pihak itu; bila keduanya mengubah, `diubah` terbaru menang (seri: tab ini). */
  _dasar: null,
  sama(a, b) { return JSON.stringify(a) === JSON.stringify(b); },
  stempel(x) { return (x && (x.diubah || x.dibuat)) || ''; },
  gabungDaftar(D, L, J, n) {
    const peta = (a) => { const m = {}; (a || []).forEach((x) => { if (x && x.id !== undefined) m[x.id] = x; }); return m; };
    const md = peta(D), ml = peta(L), mj = peta(J), ids = [], lihat = {};
    (J || []).concat(L || []).forEach((x) => { if (x && x.id !== undefined && !lihat[x.id]) { lihat[x.id] = 1; ids.push(x.id); } });
    const out = [];
    ids.forEach((id) => {
      const d = md[id], l = ml[id], j = mj[id];
      if (l && j) {
        if (this.sama(l, j)) out.push(l);
        else if (d && this.sama(l, d)) { out.push(j); n.dariLuar++; }
        else if (d && this.sama(j, d)) out.push(l);
        else { if (this.stempel(j) > this.stempel(l)) { out.push(j); n.dariLuar++; } else out.push(l); n.konflik++; }
      } else if (l) { if (d && this.sama(l, d)) n.dariLuar++; else out.push(l); }   // hilang di isi sekarang: dihapus tab lain bila tab ini tidak mengubahnya
      else if (j) { if (d && this.sama(j, d)) { /* dihapus tab ini */ } else { out.push(j); n.dariLuar++; } }
    });
    return out;
  },
  gabung3(dasar, lokal, jauh) {
    const n = { dariLuar: 0, konflik: 0 }, o = {}, skalar = (d, l, j) => (this.sama(l, d) ? j : l);
    new Set(Object.keys(dasar).concat(Object.keys(lokal), Object.keys(jauh))).forEach((k) => {
      if (this.KOLEKSI.includes(k)) o[k] = this.gabungDaftar(dasar[k], lokal[k], jauh[k], n);
      else if (k === 'pengaturan') {
        const d = dasar[k] || {}, l = lokal[k] || {}, j = jauh[k] || {}, p = {};
        new Set(Object.keys(d).concat(Object.keys(l), Object.keys(j))).forEach((q) => { const v = skalar(d[q], l[q], j[q]); if (v !== undefined) p[q] = v; });
        o[k] = p;
      } else { const v = skalar(dasar[k], lokal[k], jauh[k]); if (v !== undefined) o[k] = v; }
    });
    return { data: o, n };
  },
  muat() {
    try {
      const m = Penyimpanan.get(KUNCI); this._dasar = m || null;
      return m ? this.dari(JSON.parse(m)).data : this.kosong();
    } catch (e) { console.error('Gagal memuat data', e); return this.kosong(); }
  },
  KOLEKSI: ['utang', 'unit', 'komoditas', 'siklus', 'transaksi', 'panen', 'aset', 'kategori', 'jurnal'],
  /* Entri yang akan membuat tampilan gagal dibuang; koleksi yang bukan daftar dianggap kosong. */
  sah(k, x) {
    const n = Number.isFinite, s = (v) => typeof v === 'string' && v !== '';
    if (!x || typeof x !== 'object' || Array.isArray(x) || !s(x.id)) return false;
    if (k === 'transaksi') return /^\d{4}-\d{2}-\d{2}/.test(x.tanggal || '') && n(x.jumlah) && (x.jenis === 'masuk' || x.jenis === 'keluar');
    if (k === 'siklus') return s(x.mulai);
    if (k === 'unit' || k === 'komoditas') return s(x.nama);
    if (k === 'panen') return s(x.tanggal) && n(x.kuantitasKotor) && n(x.susut);
    if (k === 'aset') return n(x.hargaBeli) && n(x.umurBulan) && x.umurBulan > 0;
    if (k === 'utang') return n(x.jumlah);
    if (k === 'jurnal') return s(x.siklusId) && s(x.tanggal) && ['catatan', 'tahap', 'kejadian', 'ukuran', 'kegiatan'].includes(x.jenis) && (x.jenis !== 'catatan' || s(x.judul) || s(x.isi) || (Array.isArray(x.foto) && x.foto.length > 0));
    return true;
  },
  dari(o) {
    const d = this.kosong(); let dibuang = 0;
    if (!o || typeof o !== 'object' || Array.isArray(o)) return { data: d, dibuang: 0 };
    Object.keys(o).forEach((k) => { if (!this.KOLEKSI.includes(k)) d[k] = o[k]; });
    this.KOLEKSI.forEach((k) => {
      if (o[k] === undefined) return;
      if (!Array.isArray(o[k])) { dibuang++; return; }
      d[k] = o[k].filter((x) => { const ok = this.sah(k, x); if (!ok) dibuang++; return ok; });
    });
    if (!d.pengaturan || typeof d.pengaturan !== 'object' || Array.isArray(d.pengaturan)) d.pengaturan = this.kosong().pengaturan;
    return { data: d, dibuang };
  },
  /* timpa = true untuk penggantian sengaja (impor, pulihkan, hapus semua, ambil dari cloud): tanpa gabung. Mengembalikan { data, digabung, n }. */
  simpan(d, timpa) {
    const r = { data: d, digabung: false, n: null };
    try {
      if (!timpa && !Penyimpanan.terbatas) {
        const kini = Penyimpanan.get(KUNCI);
        if (kini && kini !== this._dasar) {
          const g = this.gabung3(JSON.parse(this._dasar === null ? '{}' : this._dasar), d, JSON.parse(kini));
          r.data = this.dari(g.data).data; r.digabung = true; r.n = g.n;
        }
      }
      const teks = JSON.stringify(r.data); Penyimpanan.set(KUNCI, teks); this._dasar = teks;
    } catch (e) { console.error('Gagal menyimpan data', e); }
    return r;
  }
};

/* Mode Tersembunyi: samarkan semua nominal rupiah di halaman (v0.1.036). Teks asli disimpan dan dikembalikan saat dibuka. */
const Samar = {
  asli: new WeakMap(), ada: new Set(), mo: null, cetakan: false,
  RE: /[−-]?Rp[\s\u00a0]?\d[\d.,]*(?:[\s\u00a0]?(?:juta|jt|miliar|rb))?/g,
  aktif() { return !this.cetakan && !!Setelan.get('sembunyi') && !App.buka; },
  samarkan(n) {
    const v = n.nodeValue; this.RE.lastIndex = 0;
    if (!this.RE.test(v)) return; this.RE.lastIndex = 0;
    this.asli.set(n, v); this.ada.add(n); n.nodeValue = v.replace(this.RE, 'Rp ••••••');
  },
  sapu(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), L = []; let n;
    while ((n = w.nextNode())) { if (n.nodeValue.indexOf('Rp') >= 0) L.push(n); }
    L.forEach((x) => this.samarkan(x));
  },
  pulihkan() { this.ada.forEach((n) => { if (n.isConnected && this.asli.has(n)) n.nodeValue = this.asli.get(n); }); this.ada.clear(); },
  terapkan() { if (this.aktif()) { this.sapu($('app')); const m = document.querySelector('.dm-lapis'); if (m) this.sapu(m); } else this.pulihkan(); },
  cetak(ya) { this.cetakan = ya; this.terapkan(); },
  pasang(root) {
    this.mo = new MutationObserver((ms) => {
      if (!this.aktif()) return;
      ms.forEach((m) => {
        if (m.type === 'characterData') this.samarkan(m.target);
        m.addedNodes.forEach((a) => { if (a.nodeType === 3) this.samarkan(a); else if (a.nodeType === 1) this.sapu(a); });
      });
    });
    this.mo.observe(root, { childList: true, subtree: true, characterData: true });
  }
};

const App = {
  data: null, tab: 'beranda', buka: false, balik: 'beranda', hapusMinta: null,
  filter: { periode: 'bulan', jenis: 'semua', kat: 'semua', siklus: 'semua', dari: '', sampai: '', cari: '', lain: false },
  draft: null, lastKat: {}, batasTx: 100, sortTx: { k: 'tanggal', a: -1 }, selTx: new Set(), selTerakhir: null, tampilTx: [], panel: false, panelSnap: '', lastEdit: null,

  /* ---------- data ---------- */
  aktif() { return this._ak || (this._ak = this.data.transaksi.filter((t) => !t.terhapus)); },
  kategori(jenis) {
    return SEED[jenis].concat(this.data.kategori.filter((k) => k.jenis === jenis && !k.terhapus));
  },
  semuaKat() { return this.kategori('keluar').concat(this.kategori('masuk')); },
  namaKat(id) { const k = this.semuaKat().find((x) => x.id === id); return k ? k.nama : id; },
  simpan(timpa) {
    this._ak = null; const r = Store.simpan(this.data, timpa === true);
    if (r.digabung) { this.data = r.data; this.toast('Perubahan dari jendela lain digabung' + (r.n.konflik ? ' (' + r.n.konflik + ' bentrok, yang terbaru dipakai)' : '')); }
    Cadangan.otomatis(); Sinkron.tandai();
  },
  /* Perubahan data oleh tab/PWA lain (v0.1.101): gabung ke data di memori, lalu segarkan tampilan bila tidak sedang mengisi sesuatu */
  dariLuar() {
    if (Penyimpanan.terbatas) return;
    const kini = Penyimpanan.get(KUNCI); if (!kini || kini === Store._dasar) return;
    let g; try { g = Store.gabung3(JSON.parse(Store._dasar === null ? '{}' : Store._dasar), this.data, JSON.parse(kini)); } catch (e) { return; }
    this.data = Store.dari(g.data).data; Store._dasar = kini; this._ak = null;
    const el = document.activeElement, sibuk = (typeof Modal !== 'undefined' && Modal.m) || (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && $('app').contains(el));
    if (!sibuk) this.go(this.tab, true);
    this.toast('Data diperbarui dari jendela lain' + (sibuk ? '; tampilan menyusul setelah Anda selesai' : ''));
  },
  jumlah(list, jenis) { return list.filter((t) => t.jenis === jenis).reduce((a, t) => a + t.jumlah, 0); },
  saring() {
    const f = this.filter, bi = bulanIni(), bl = bulanLalu();
    return this.aktif().filter((t) => {
      if (f.periode === 'bulan' && t.tanggal.slice(0, 7) !== bi) return false;
      if (f.periode === 'lalu' && t.tanggal.slice(0, 7) !== bl) return false;
      if (f.periode === 'rentang') {
        if (f.dari && t.tanggal < f.dari) return false;
        if (f.sampai && t.tanggal > f.sampai) return false;
      }
      if (f.jenis !== 'semua' && t.jenis !== f.jenis) return false;
      if (f.kat !== 'semua' && t.kategoriId !== f.kat) return false;
      if (f.siklus !== 'semua' && (t.siklusId || 'none') !== f.siklus) return false;
      if (f.cari) {
        const q = f.cari.toLowerCase(), s = t.siklusId && Siklus.cari(t.siklusId) ? Siklus.nama(t.siklusId) : '';
        if (((t.catatan || '') + ' ' + this.namaKat(t.kategoriId) + ' ' + s).toLowerCase().indexOf(q) < 0) return false;
      }
      return true;
    }).sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.dibuat.localeCompare(a.dibuat));
  },

  /* ---------- init ---------- */
  init() {
    this.data = Store.muat();
    const pertama = Contoh.otomatis();
    if (Penyimpanan.terbatas) { const w = $('peringatan'); w.hidden = false; w.textContent = 'Penyimpanan browser tidak tersedia (halaman dibuka lewat pengelola berkas). Data hanya bertahan selama tab ini tidak ditutup — ekspor CSV/JSON secara berkala, atau buka lewat Chrome dengan alamat file:// agar tersimpan permanen.'; }
    $('tabs').innerHTML = TAB.map((t) => '<button class="main-tab-btn" data-go="' + t[0] + '">' + ikon(t[0], 'tab-icon') + t[1] + '</button>').join('');
    $('bnav').innerHTML = TAB.map((t) => '<button class="bnav-btn" data-go="' + t[0] + '" title="' + t[1] + '">' + ikon(t[0], 'bnav-icon') + '<span>' + t[1] + '</span></button>').join('') +
      '<button class="bnav-btn rail-set" data-go="setelan" title="Setelan">' + ikon('setelan', 'bnav-icon') + '<span>Setelan</span></button>';
    Setelan.init({
      versi: VERSI,
      ambil: () => this.data,
      pasang: (o) => this.pasangData(o),
      hapus: () => { Cadangan.catat('Sebelum hapus', true); this.data = Store.kosong(); this.simpan(true); this.go(this.tab, true); },
      ubah: () => { this.ringkas(); if (this.tab === 'setelan' || this.tab === 'transaksi' || this.tab === 'beranda') this.go(this.tab, true); }
    });
    Cadangan.init({
      ambil: () => this.data,
      pulih: (o) => { this.data = Store.dari(o).data; this.simpan(true); this.go(this.tab, true); },
      segar: () => { if (this.tab === 'setelan') this.go('setelan', true); }
    });
    Sinkron.init({
      ambil: () => this.data,
      terapkan: (o, segarkan, timpa) => {
        this.data = Store.dari(o).data; this._ak = null; const r = Store.simpan(this.data, timpa === true); if (r.digabung) this.data = r.data; Cadangan.otomatis();
        if (segarkan) this.go(this.tab, true); else this.ringkas();
      },
      segar: () => { if (this.tab === 'setelan') this.go('setelan', true); }
    });
    Pwa.init({ segar: () => { if (this.tab === 'setelan') this.go('setelan', true); } });
    Setelan.bind($('app'));
    document.addEventListener('click', (e) => this.klik(e));
    window.addEventListener('storage', (e) => { if (e.key === KUNCI) this.dariLuar(); }); /* tab lain menyimpan */
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.dariLuar(); }); /* tab dibuka kembali setelah ditangguhkan */
    window.addEventListener('pageshow', () => this.dariLuar());
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if ((e.key === 'Enter' || e.key === ' ') && t && t.matches && t.matches('[role="button"][tabindex]')) { e.preventDefault(); t.click(); }
    });
    $('app').addEventListener('change', (e) => this.ubahField(e));
    $('app').addEventListener('paste', (e) => {
      const t = e.target; if (!(t.id === 'f_jumlah' || t.id === 'p_harga' || (t.dataset && t.dataset.rp !== undefined))) return;
      const teks = (e.clipboardData || window.clipboardData).getData('text'); e.preventDefault();
      const n = angka(teks);
      if (!n && /\S/.test(teks) && !/^\s*(rp\.?\s*)?0+\s*$/i.test(teks)) { this.toast('Angka tidak dikenali'); return; }
      t.value = fmtInput(n); t.dispatchEvent(new Event('input', { bubbles: true })); if (t.dataset.rp !== undefined) t.dispatchEvent(new Event('change', { bubbles: true }));
    });
    $('eye2').addEventListener('click', () => { this.buka = !this.buka; this.ringkas(); });
    window.addEventListener('beforeprint', () => { Samar.cetak(true); if (typeof Analisa !== 'undefined') Analisa.cetakPasang(); });
    window.addEventListener('afterprint', () => { if (typeof Analisa !== 'undefined') Analisa.cetakLepas(); Samar.cetak(false); });
    Samar.pasang($('app'));
    $('app').addEventListener('input', (e) => {
      if (e.target.id === 'f_jumlah' || e.target.id === 'p_harga' || e.target.dataset.rp !== undefined) {
        if (e.data && /[^\d.\s]/.test(e.data)) this.toast(e.data === ',' ? 'Rupiah bulat, tanpa desimal' : 'Hanya angka');
        e.target.value = fmtInput(angkaKetik(e.target.value));
      }
      if (e.target.id === 'f_cari') {
        this.filter.cari = e.target.value.trim(); this.batasTx = 100; clearTimeout(this._tc);
        this._tc = setTimeout(() => { const el = $('txHasil'); if (el) el.innerHTML = this.hasilTx(); }, 150);
      }
    });
    $('theme').addEventListener('click', () => Setelan.ubah('mode', Setelan.efektif() === 'light' ? 'dark' : 'light'));
    $('gear').addEventListener('click', () => this.go('setelan'));
    Fab.init();
    Panduan.init();
    $('eye').addEventListener('click', () => { this.buka = !this.buka; this.ringkas(); });
    Rute.awal(); Rute.pasang();
    if (pertama) Panduan.otomatis();
    if (window.ResizeObserver && $('heroCard')) { let lebar = 0; new ResizeObserver((es) => { const w = Math.round(es[0].contentRect.width); if (w !== lebar) { lebar = w; this.fitHero(); } }).observe($('heroCard')); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.fitHero());
    setTimeout(() => Nota.rapikan(), 4000);
  },

  klik(e) {
    if (Analisa.klik(e) || Rencana.klik(e)) return;
    const g = e.target.closest('[data-go]');
    if (g) { this.go(g.dataset.go); return; }
    if (e.target.closest('[data-tpx]')) { if (this.lanjutBuang()) { const id = this.lastEdit; this.tutupPanel(true); const b = id && document.querySelector('.tt-buka[data-edit="' + id + '"]'); if (b) b.focus(); } return; }
    const tp = e.target.closest('[data-tp]');
    if (tp) { this.pilihTx(tp.dataset.tp, tp.checked, e.shiftKey); return; }
    if (e.target.closest('[data-tpa]')) { this.pilihSemua(e.target.closest('[data-tpa]').checked); return; }
    const tc = e.target.closest('td.tt-c'); if (tc && tc.querySelector('[data-tp]')) { tc.querySelector('[data-tp]').click(); return; }
    const tr = e.target.closest('[data-tr]'); if (tr) { this.hapusTx([tr.dataset.tr]); return; }
    if (e.target.closest('[data-tph]')) { this.hapusTx([...this.selTx]); return; }
    if (e.target.closest('[data-tpb]')) { this.selTx.clear(); this.selTerakhir = null; this.segarTx(); return; }
    const ts = e.target.closest('[data-ts]');
    if (ts) { this.urutTx(ts.dataset.ts); return; }
    const ed = e.target.closest('[data-edit]');
    if (ed) { this.ubahTx(ed.dataset.edit); return; }
    if (e.target.closest('[data-bu]')) { Rencana.sub = 'utang'; this.go('rencana'); return; }
    const rcb = e.target.closest('#rcTanya'); if (rcb) { const w = $('rcInfo'); w.hidden = !w.hidden; rcb.setAttribute('aria-expanded', String(!w.hidden)); this.fitHero(); return; }
    if (e.target.closest('[data-bp]')) { Beranda.semua = !Beranda.semua; this.go('beranda', true); return; }
    const fl = e.target.closest('[data-fl]');
    if (fl) { this.filter.lain = !this.filter.lain; this.go('transaksi', true); return; }
    const fj = e.target.closest('[data-fj]');
    if (fj) { this.filter.jenis = fj.dataset.fj; this.go('transaksi', true); return; }
    const d = e.target.closest('[data-do]');
    if (d) this.aksi(d.dataset.do, d);
  },
  ubahField(e) {
    if (e.target.dataset.sfl) { Siklus.saring(e.target.dataset.sfl, e.target.value); return; }
    if (e.target.id === 'f_siklus' || e.target.id === 'f_kat') { this.bacaForm(); const i = $('f_info'); if (i) i.innerHTML = this.infoHasil(); return; }
    if (e.target.id === 'f_bayar') { this.bacaForm(); this.go('catat', true); return; }
    if (e.target.id === 'p_bayar') { Siklus.bacaPanen(); this.go('panen', true); return; }
    const f = e.target.dataset.f;
    if (f) {
      this.filter[f] = e.target.value; this.batasTx = 100;
      if (f === 'periode' && e.target.value !== 'rentang') { this.filter.dari = ''; this.filter.sampai = ''; }
      this.go('transaksi', true);
    } else if (e.target.id === 'f_nota') { Nota.pilih(e.target);
    } else if (e.target.id === 'csvFile' && e.target.files[0]) {
      const f = e.target.files[0], r = new FileReader();
      if (f.size > Impor.MAKSCSV) { this.toast('Berkas terlalu besar (maks. 5 MB)'); e.target.value = ''; return; }
      r.onload = () => { $('csvBox').value = r.result; this.imporCsv({ nama: f.name, ukuran: f.size }); };
      r.onerror = () => this.toast('Berkas tidak bisa dibaca');
      r.readAsText(f); e.target.value = '';
    }
  },

  /* ---------- ringkasan ---------- */
  /* Lencana jumlah "Perlu perhatian" pada item Beranda (terlihat di rail desktop) */
  lencana() {
    const b = document.querySelector('#bnav [data-go="beranda"]'); if (!b) return;
    let n = 0; try { n = Beranda.jumlah(); } catch (e) { n = 0; }
    let el = b.querySelector('.rail-badge');
    if (!n) { if (el) el.remove(); b.title = 'Beranda'; b.removeAttribute('aria-label'); return; }
    if (!el) { el = document.createElement('b'); el.className = 'rail-badge'; el.setAttribute('aria-hidden', 'true'); b.appendChild(el); }
    el.textContent = n > 9 ? '9+' : String(n);
    b.title = 'Beranda · ' + n + ' perlu perhatian'; b.setAttribute('aria-label', 'Beranda, ' + n + ' perlu perhatian');
  },
  /* Kartu hero Beranda (v0.1.099): hanya dihitung bila kartu terlihat; deret 6 bulan dihitung sekali */
  /* Notasi ringkas untuk angka sangat besar (v0.1.110): Rp 12,3 M (miliar), Rp 1,2 T (triliun) */
  rpRingkas(n) {
    const a = Math.abs(n); if (a < 1e9) return rp(n);
    const [v, s] = a >= 1e12 ? [a / 1e12, ' T'] : [a / 1e9, ' M'];
    return (n < 0 ? '−' : '') + 'Rp ' + (v >= 100 ? Math.round(v) : v.toFixed(1)).toString().replace('.', ',').replace(/,0$/, '') + s;
  },
  heroIsi() {
    const bi = bulanIni(), h = new Date();
    const semua = this.aktif(), bln = semua.filter((t) => t.tanggal.slice(0, 7) === bi);
    const modal = this.jumlah(bln, 'keluar'), hasil = this.jumlah(bln, 'masuk'), untung = hasil - modal;
    const set = (id, v) => { const el = $(id); if (!el) return; el.dataset.val = this.rpRingkas(v); if (this.rpRingkas(v) !== rp(v)) el.dataset.full = rp(v); else delete el.dataset.full; };
    set('heroNum', untung); set('stModal', modal); set('stHasil', hasil);
    $('heroNum').className = 'hero-number' + (untung < 0 ? ' rugi' : '');
    $('heroLbl').textContent = untung < 0 ? 'Rugi bulan ini' : 'Untung bulan ini';
    /* margin: tidak bermakna bila belum ada hasil atau nilainya ekstrem */
    let mg = '';
    if (bln.length && modal > 0) {
      if (hasil <= 0) mg = ' · belum ada hasil';
      else { const m = Math.round(untung / hasil * 100); mg = ' · margin ' + (m < -999 ? '< −999' : m > 999 ? '> 999' : String(m).replace('-', '−')) + '%'; }
    }
    $('heroSub').textContent = bln.length ? bln.length + ' transaksi bulan ini' + mg : 'Belum ada transaksi bulan ini';
    const rc = modal > 0 ? hasil / modal : null;
    $('stRC').textContent = rc !== null ? rc.toFixed(2).replace('.', ',') : '—';
    const info = $('rcInfo');
    if (info) info.textContent = 'R/C = hasil ÷ modal: tiap Rp 1 modal kembali berapa rupiah. Acuan: di bawah 1,00 rugi; 1,00–1,29 tipis; 1,30 ke atas sehat.' +
      (rc === null ? '' : ' Saat ini ' + rc.toFixed(2).replace('.', ',') + ': ' + (rc >= 1.3 ? 'sehat.' : rc >= 1 ? 'tipis (balik modal, untung kecil).' : 'rugi.'));
    /* selisih terhadap periode setara: tanggal 1 sampai tanggal yang sama bulan lalu (dipotong ke akhir bulan), bukan bulan penuh */
    const dl = $('heroDelta');
    if (dl) {
      let html = '', tip = '';
      if (bln.length) {
        const x = new Date(h.getFullYear(), h.getMonth() - 1, 1);
        x.setDate(Math.min(h.getDate(), new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate()));
        const a1 = isoHari(new Date(h.getFullYear(), h.getMonth() - 1, 1)), a2 = isoHari(x);
        const lama = semua.filter((t) => { const d = t.tanggal.slice(0, 10); return d >= a1 && d <= a2; });
        if (lama.length) {
          const d = untung - (this.jumlah(lama, 'masuk') - this.jumlah(lama, 'keluar'));
          tip = 'Dibanding ' + a1 + ' sampai ' + a2;
          html = d === 0 ? 'Sama dengan periode sama bulan lalu' : '<span class="' + (d > 0 ? 'up' : 'down') + '"><span aria-hidden="true">' + (d > 0 ? '▲ ' : '▼ ') + '</span><span class="sr-only">' + (d > 0 ? 'naik ' : 'turun ') + '</span><span data-mask data-val="' + rp(Math.abs(d)) + '">' + rp(Math.abs(d)) + '</span></span> dibanding periode sama bulan lalu';
        }
      }
      dl.innerHTML = html; if (tip && html) dl.title = tip; else dl.removeAttribute('title');
    }
    const sp = $('heroSpark');
    if (sp && typeof Analisa !== 'undefined') {
      const nb = Analisa.bulanN(6), T = nb.map((x) => x.h - x.m), ada = T.some((x) => x), LB = $('heroSparkLbl');
      sp.toggleAttribute('hidden', !ada);
      if (LB) LB.hidden = !ada;
      if (ada) {
        const mx = Math.max(1, ...T.map(Math.abs)), W = 300, H = 40, mg2 = 5, N = T.length;
        const P = T.map((u, i) => [i * W / (N - 1), H / 2 - u / mx * (H / 2 - mg2)]);
        sp.innerHTML = '<line x1="0" y1="' + H / 2 + '" x2="' + W + '" y2="' + H / 2 + '" class="hs-nol" vector-effect="non-scaling-stroke"/>' +
          '<path d="' + Analisa.kurva(P) + '" class="hs-garis" vector-effect="non-scaling-stroke"/>';
        const lalu = T[N - 2], kini = T[N - 1];
        sp.setAttribute('aria-label', 'Tren untung bersih ' + N + ' bulan terakhir, ' + nb[0].n + ' sampai ' + nb[N - 1].n + '; bulan ini ' + (kini === lalu ? 'sama dengan bulan lalu' : kini > lalu ? 'lebih tinggi dari bulan lalu' : 'lebih rendah dari bulan lalu'));
        /* label bulan tepat di bawah titik datanya (awal, tengah, akhir) */
        const mid = Math.floor(N / 2);
        if (LB) LB.innerHTML = '<span class="a">' + nb[0].n + '</span><span class="m" style="left:' + (mid * 100 / (N - 1)).toFixed(1) + '%">' + nb[mid].n + '</span><span class="z">' + nb[N - 1].n + '</span>';
      }
    }
  },
  /* Muat angka hero ke ruang yang ada: kecilkan angka utama; bila ringkasan Modal/Hasil/R/C tak muat, susun ke bawah */
  fitHero() {
    const hc = $('heroCard'); if (!hc || hc.hidden || !hc.offsetWidth) return;
    const n = $('heroNum'), st = hc.querySelector('.stats'); if (!n || !st) return;
    n.style.fontSize = '';
    const dasar = parseFloat(getComputedStyle(n).fontSize);
    if (n.scrollWidth > n.clientWidth + 1) n.style.fontSize = Math.max(22, Math.floor(dasar * n.clientWidth / n.scrollWidth * 0.98)) + 'px';
    st.classList.remove('tumpuk'); st.style.removeProperty('--sv');
    const muat = (q) => [...st.querySelectorAll(q)].every((e) => e.scrollWidth <= e.clientWidth + 1);
    if (!muat('.stat-lbl')) { st.classList.add('tumpuk'); return; }
    let sv = 17; // kecilkan huruf angka (maks. sampai 14 px) sebelum menyusun ke bawah
    while (!muat('.stat-val') && sv > 14) { sv--; st.style.setProperty('--sv', sv + 'px'); }
    if (!muat('.stat-val')) { st.style.removeProperty('--sv'); st.classList.add('tumpuk'); }
  },
  ringkas() {
    if (this.tab === 'beranda') this.heroIsi();
    const sembunyi = Setelan.get('sembunyi') && !this.buka;
    document.querySelectorAll('[data-mask]').forEach((el) => { el.textContent = sembunyi ? 'Rp ••••••' : el.dataset.val; });
    document.querySelectorAll('[data-full]').forEach((el) => { if (sembunyi) el.removeAttribute('title'); else el.title = el.dataset.full; });
    $('eye').textContent = sembunyi ? '○' : '◉'; $('eye').setAttribute('aria-pressed', String(!sembunyi)); $('eye').title = sembunyi ? 'Tampilkan angka' : 'Sembunyikan angka';
    const e2 = $('eye2'); if (e2) { e2.hidden = !(Setelan.get('sembunyi') && this.tab !== 'beranda'); e2.textContent = sembunyi ? '○' : '◉'; e2.setAttribute('aria-pressed', String(!sembunyi)); }
    Samar.terapkan();
    this.lencana();
    this.fitHero();
  },

  /* ---------- navigasi ---------- */
  /* ---- riwayat browser (v0.1.065): tiap pindah halaman = satu entri; tombol kembali HP menutup modal lalu kembali ke halaman sebelumnya ---- */
  LEAF: ['catat', 'panen', 'siklus-form', 'setelan'],
  riwayatAwal(t) {
    this.rw = [{ t: t, sid: Siklus.sid }]; this.ri = 0;
    try { history.replaceState({ r: 0 }, ''); } catch (e) { /* riwayat tidak tersedia */ }
    window.addEventListener('popstate', (e) => this.pop(e));
  },
  /* true bila perpindahan diserahkan ke history.back() (kembali dari halaman isian ke halaman sebelumnya) */
  nav(t) {
    if (t === this.tab && t !== 'siklus-detail' && t !== 'jurnal') return false;
    const prev = this.rw[this.ri - 1];
    if (this.LEAF.includes(this.tab) && prev && prev.t === t && (prev.sid || null) === (Siklus.sid || null)) { try { history.back(); return true; } catch (e) { /* lanjut dorong */ } }
    this.rw = this.rw.slice(0, this.ri + 1); this.rw.push({ t: t, sid: Siklus.sid }); this.ri++;
    try { history.pushState({ r: this.ri }, ''); } catch (e) { /* abaikan */ }
    return false;
  },
  siapForm(t) { return t === 'setelan' || (t === 'catat' && !!this.draft) || (t === 'panen' && !!Siklus.pd); },
  pop(e) {
    if (Modal.popstate()) return;
    const s = e.state; if (!s || s.r == null || s.modal || !this.rw[s.r]) return;
    this.ri = s.r; const ent = this.rw[s.r];
    if (this.LEAF.includes(ent.t) && !this.siapForm(ent.t) && s.r > 0) { try { history.back(); } catch (er) { /* abaikan */ } return; }
    this._pop = true;
    try { if (ent.sid) Siklus.sid = ent.sid; this.go(ent.t); } finally { this._pop = false; }
  },
  go(t, tetap) {
    if (this.panel) { /* panel transaksi terbuka */
      if (t === 'catat') { this.renderPanel(); return; }
      if (t === 'transaksi' && this.tab === 'transaksi') {
        if (tetap) { this.segarTx(); return; }
        const id = this.lastEdit; this.tutupPanel(); this.segarTx();
        if (id) { const b = document.querySelector('.tt-buka[data-edit="' + id + '"]'); if (b) b.focus(); } return;
      }
      this.tutupPanel(true);
    }
    if (!tetap && !this._pop && this.rw && this.nav(t)) return;
    this._ak = null;
    if (typeof Siklus !== 'undefined') Siklus.pindah(t, this.tab);
    if (t !== 'catat' && t !== 'setelan' && this.tab !== t) this.hapusMinta = null;
    if ((t === 'catat' || t === 'setelan') && this.tab !== 'catat' && this.tab !== 'setelan') this.balik = this.tab;
    this.tab = t;
    document.body.dataset.hal = t; /* v0.1.080: dipakai CSS layout desktop */
    let h;
    if (t === 'setelan') h = Setelan.render();
    else if (t === 'beranda') h = this.vBeranda();
    else if (t === 'transaksi') h = this.vTransaksi();
    else if (t === 'catat') h = this.vCatat();
    else if (t === 'lainnya') h = this.vLainnya();
    else if (t === 'siklus') h = Siklus.vList();
    else if (t === 'siklus-form') h = Siklus.vForm();
    else if (t === 'siklus-detail') h = Siklus.vDetail();
    else if (t === 'jurnal') h = Linimasa.v();
    else if (t === 'panen') h = Siklus.vPanen();
    else if (t === 'master') h = Siklus.vMaster();
    else if (t === 'laporan') h = Analisa.vLaporan();
    else if (t === 'rencana') h = Rencana.v();
    else h = '<section><h2>' + NANTI[t][0] + '</h2><p class="note">' + NANTI[t][1] + '</p></section>';
    $('app').innerHTML = h;
    Form.upgrade($('app'));
    if (t === 'catat') Nota.isiBox(); else if (t === 'setelan') Nota.isiInfo();
    if (typeof Foto !== 'undefined') Foto.muat($('app'));
    const induk = { 'siklus-form': 'siklus', 'siklus-detail': 'siklus', jurnal: 'siklus', panen: 'siklus', rencana: 'lainnya' }[t] || t;
    document.querySelectorAll('.main-tab-btn,.bnav-btn').forEach((b) => { const on = b.dataset.go === induk; b.classList.toggle('active', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    $('gear').classList.toggle('active', t === 'setelan');
    if (t === 'setelan') $('gear').setAttribute('aria-current', 'page'); else $('gear').removeAttribute('aria-current');
    const hc = $('heroCard'); if (hc) hc.hidden = t !== 'beranda';
    this.judulHal(t);
    Fab.atur();
    this.ringkas();
    if (!tetap) window.scrollTo(0, 0);
    if (!this.rw) this.riwayatAwal(t);
    Rute.sinkron();
  },

  /* ---------- header dinamis: judul halaman aktif (v0.1.033; pindah ke header di v0.1.071) ---------- */
  /* Pengumuman halaman untuk pembaca layar (wilayah aria-live), hanya saat halaman berganti. */
  umumkan(teks) {
    const el = $('srHal'); if (!el || this._umum === teks) return; this._umum = teks;
    el.textContent = ''; setTimeout(() => { el.textContent = teks; }, 60);
  },
  judulHal(t) {
    const sid = typeof Siklus !== 'undefined' ? Siklus.cari(Siklus.sid) : null;
    const J = {
      transaksi: ['Transaksi'], siklus: ['Siklus'], laporan: ['Laporan'], lainnya: ['Lainnya'], setelan: ['Setelan'],
      'siklus-form': Siklus.sf && Siklus.sf.id ? ['Ubah siklus', 'siklus-detail', 'Detail siklus'] : ['Siklus baru', 'siklus', 'Siklus'],
      'siklus-detail': [sid ? Siklus.nama(sid.id) : 'Detail siklus', 'siklus', 'Siklus'],
      jurnal: ['Jurnal · ' + (sid ? Siklus.nama(sid.id) : 'siklus'), 'siklus-detail', 'Detail siklus'],
      panen: [Siklus.pd && Siklus.pd.id ? 'Ubah panen' : 'Catat panen', 'siklus-detail', 'Detail siklus'],
      master: ['Unit & komoditas'],
      rencana: ['Rencana keuangan', 'lainnya', 'Lainnya'],
      catat: [this.draft && this.draft.id ? 'Ubah transaksi' : this.draft && this.draft.jenis === 'masuk' ? 'Catat hasil' : 'Catat modal']
    }[t];
    const h1 = $('hdrJudul'), bk = $('hdrBack'), tag = $('hdrTag');
    if (!J) {
      h1.innerHTML = 'Buku <em>Kebun</em>'; h1.removeAttribute('title'); tag.textContent = 'Manajemen pertanian';
      bk.hidden = true; bk.removeAttribute('data-go');
      document.title = 'Buku Kebun'; this.umumkan('Beranda'); return;
    }
    h1.textContent = J[0]; h1.title = J[0]; tag.textContent = 'Buku Kebun';
    bk.hidden = !J[1];
    if (J[1]) { bk.dataset.go = J[1]; bk.setAttribute('aria-label', 'Kembali ke ' + J[2]); bk.title = 'Kembali ke ' + J[2]; }
    else { bk.removeAttribute('data-go'); bk.removeAttribute('title'); }
    document.title = J[0] + ' · Buku Kebun';
    this.umumkan(J[0]);
  },

  /* ---------- tampilan: transaksi ---------- */
  barisTx(t) {
    const m = t.jenis === 'masuk';
    return '<div class="tx" data-edit="' + t.id + '" role="button" tabindex="0">' +
      '<div class="tx-l"><div class="tx-n">' + esc(this.namaKat(t.kategoriId)) + (t.notaId ? Nota.ikon : '') + '</div>' +
      '<div class="note">' + Setelan.tgl(t.tanggal) + (t.siklusId && this.tab !== 'siklus-detail' && Siklus.cari(t.siklusId) ? ' · ' + esc(Siklus.nama(t.siklusId).split(' · ')[0]) : '') + (t.catatan ? ' · ' + esc(t.catatan) : '') + (() => { const u = Utang.tertaut(t), s = u && Utang.sisa(u); return s ? ' · <span class="' + (u.jenis === 'utang' ? 'down' : 'up') + '">' + u.jenis + ' ' + rp(s) + '</span>' : ''; })() + '</div></div>' +
      '<div class="tx-a ' + (m ? 'up' : 'down') + '">' + (m ? '+' : '−') + rp(t.jumlah).replace('Rp ', 'Rp\u00a0') + '</div></div>';
  },
  /* tabel transaksi di desktop (≥1100 px, halaman Transaksi); HP tetap daftar baris (v0.1.121) */
  tabelTx() { return this.tab === 'transaksi' && window.matchMedia && matchMedia('(min-width:1100px)').matches; },
  daftarTx(list) {
    if (!this.tabelTx()) return list.slice(0, this.batasTx).map((t) => this.barisTx(t)).join('');
    const s = this.sortTx, nilai = {
      tanggal: (t) => t.tanggal, kategori: (t) => this.namaKat(t.kategoriId).toLowerCase(), siklus: (t) => (t.siklusId && Siklus.cari(t.siklusId) ? Siklus.nama(t.siklusId) : '').toLowerCase(),
      catatan: (t) => (t.catatan || '').toLowerCase(), jumlah: (t) => (t.jenis === 'masuk' ? 1 : -1) * t.jumlah }[s.k] || ((t) => t.tanggal);
    const U = list.slice().sort((a, b) => { const x = nilai(a), y = nilai(b), c = typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'id'); return c * s.a || b.tanggal.localeCompare(a.tanggal) || String(b.dibuat).localeCompare(String(a.dibuat)); });
    const ada = new Set(list.map((t) => t.id)); [...this.selTx].forEach((id) => { if (!ada.has(id)) this.selTx.delete(id); });
    const tampil = U.slice(0, this.batasTx); this.tampilTx = tampil.map((t) => t.id);
    const nPilih = tampil.filter((t) => this.selTx.has(t.id)).length, bersih = this.data.transaksi.filter((t) => this.selTx.has(t.id) && !t.terhapus).reduce((a, t) => a + (t.jenis === 'masuk' ? t.jumlah : -t.jumlah), 0);
    const kol = [['tanggal', 'Tanggal', ''], ['kategori', 'Kategori', ''], ['siklus', 'Siklus', ''], ['catatan', 'Catatan', ''], ['jumlah', 'Jumlah', ' tt-a']];
    const th = kol.map((k) => '<th scope="col" class="' + k[0] + k[2] + '" aria-sort="' + (s.k === k[0] ? (s.a > 0 ? 'ascending' : 'descending') : 'none') + '"><button type="button" class="tt-th" data-ts="' + k[0] + '">' + k[1] + '<span aria-hidden="true">' + (s.k === k[0] ? (s.a > 0 ? ' ▲' : ' ▼') : '') + '</span></button></th>').join('');
    const tr = U.slice(0, this.batasTx).map((t) => {
      const ket = esc(this.namaKat(t.kategoriId)) + ' ' + Setelan.tgl(t.tanggal), pilih = this.selTx.has(t.id);
      const m = t.jenis === 'masuk', u = Utang.tertaut(t), sisa = u && Utang.sisa(u), sk = t.siklusId && Siklus.cari(t.siklusId) ? Siklus.nama(t.siklusId).split(' · ')[0] : '';
      return '<tr data-edit="' + t.id + '"' + (pilih || (this.panel && this.draft && this.draft.id === t.id) ? ' class="' + (pilih ? 'tt-sel ' : '') + (this.panel && this.draft && this.draft.id === t.id ? 'tt-aktif' : '') + '"' : '') + '><td class="tt-c"><input type="checkbox" data-tp="' + t.id + '" aria-label="Pilih transaksi ' + ket + '"' + (pilih ? ' checked' : '') + '></td><td><button type="button" class="tt-buka" data-edit="' + t.id + '" aria-label="Ubah transaksi ' + esc(this.namaKat(t.kategoriId)) + ' ' + Setelan.tgl(t.tanggal) + '">' + Setelan.tgl(t.tanggal) + '</button></td>' +
        '<td>' + esc(this.namaKat(t.kategoriId)) + (t.notaId ? Nota.ikon : '') + '</td><td title="' + esc(sk) + '">' + esc(sk) + '</td>' +
        '<td title="' + esc(t.catatan || '') + '">' + esc(t.catatan || '') + (sisa ? ' <span class="' + (u.jenis === 'utang' ? 'down' : 'up') + '">' + u.jenis + ' ' + rp(sisa) + '</span>' : '') + '</td>' +
        '<td class="tt-a ' + (m ? 'up' : 'down') + '">' + (m ? '+' : '−') + rp(t.jumlah).replace('Rp ', 'Rp\u00a0') + '</td>' +
        '<td class="tt-x"><button type="button" class="tt-hapus" data-tr="' + t.id + '" aria-label="Hapus transaksi ' + ket + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3"/></svg></button></td></tr>';
    }).join('');
    const bulk = this.selTx.size ? '<div class="tt-bulk" role="status"><span>' + this.selTx.size + ' dipilih · bersih <b class="' + (bersih >= 0 ? 'up' : 'down') + '">' + (bersih < 0 ? '−' : '') + rp(Math.abs(bersih)) + '</b></span><span class="tt-bulk-a"><button type="button" class="btn danger" data-tph>Hapus yang dipilih</button><button type="button" class="btn" data-tpb>Batal pilih</button></span></div>' : '';
    setTimeout(() => this.pilihUi(), 0);
    return bulk + '<table class="tt" aria-label="Daftar transaksi, ' + list.length + ' catatan"><thead><tr><th scope="col" class="pilih tt-c"><input type="checkbox" data-tpa aria-label="Pilih semua transaksi yang tampil"' + (nPilih && nPilih === tampil.length ? ' checked' : '') + (nPilih && nPilih < tampil.length ? ' data-ind="1"' : '') + '></th>' + th + '<th scope="col" class="aksi"><span class="sr-only">Aksi</span></th></tr></thead><tbody>' + tr + '</tbody></table>'; // tombol "Tampilkan lebih banyak" ditambahkan oleh hasilTx
  },
  /* pilih banyak (v0.1.121) */
  pilihUi() { const a = document.querySelector('[data-tpa][data-ind]'); if (a) a.indeterminate = true; },
  segarTx(fokus) { const el = $('txHasil'); if (el) el.innerHTML = this.hasilTx(); if (fokus) { const b = document.querySelector(fokus); if (b) b.focus(); } },
  pilihTx(id, on, rentang) {
    const ids = this.tampilTx, i = ids.indexOf(id), j = this.selTerakhir ? ids.indexOf(this.selTerakhir) : -1;
    (rentang && j >= 0 && i >= 0 ? ids.slice(Math.min(i, j), Math.max(i, j) + 1) : [id]).forEach((x) => { if (on) this.selTx.add(x); else this.selTx.delete(x); });
    this.selTerakhir = id; this.segarTx('[data-tp="' + id + '"]');
  },
  pilihSemua(on) { this.tampilTx.forEach((x) => { if (on) this.selTx.add(x); else this.selTx.delete(x); }); this.segarTx('[data-tpa]'); },
  hapusTx(ids) {
    const T = ids.map((id) => this.data.transaksi.find((x) => x.id === id)).filter((t) => t && !t.terhapus), ok = [], lewat = [];
    T.forEach((t) => { const u = Utang.tertaut(t); (u && Utang.ada(u) ? lewat : ok).push(t); });
    if (!ok.length) { this.toast(lewat.length ? 'Tidak ada yang dihapus: sudah ada pembayaran utang/piutang' : 'Tidak ada yang dipilih'); return; }
    ok.forEach((t) => { t.terhapus = true; t.diubah = nowIso(); Utang.ikut(t, true); this.selTx.delete(t.id); });
    this.simpan(); this.go(this.tab, true);
    this.toast(ok.length + ' transaksi dihapus' + (lewat.length ? ', ' + lewat.length + ' dilewati (sudah ada pembayaran)' : ''), { label: 'Urungkan', fn: () => { ok.forEach((t) => { t.terhapus = false; t.diubah = nowIso(); Utang.ikut(t, false); }); this.simpan(); this.go(this.tab, true); } });
  },
  urutTx(k) {
    const s = this.sortTx; if (s.k === k) s.a = -s.a; else { s.k = k; s.a = (k === 'tanggal' || k === 'jumlah') ? -1 : 1; }
    const el = $('txHasil'); if (el) el.innerHTML = this.hasilTx();
    const b = document.querySelector('[data-ts="' + k + '"]'); if (b) b.focus();
  },
  grafikLipat(bln) {
    const g = Beranda.grafik(bln);
    return g ? '<details class="lipat luar" data-lipat="grafik" data-bx="grafik"' + (Lipat.buka('grafik', window.innerWidth > 720) ? ' open' : '') + '><summary><h2>Grafik</h2></summary><div class="dash-grid">' + g + '</div></details>' : '';
  },
  vBeranda() {
    const bi = bulanIni();
    const bln = this.aktif().filter((t) => t.tanggal.slice(0, 7) === bi);
    const terakhir = this.aktif().slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.dibuat.localeCompare(a.dibuat)).slice(0, 5);
    const daftar = terakhir.length
      ? terakhir.map((t) => this.barisTx(t)).join('') + '<button class="btn" data-go="transaksi" style="width:100%;margin-top:12px">Lihat semua transaksi</button>'
      : '<p class="note">Belum ada transaksi. Ketuk tombol + untuk mencatat modal atau hasil pertama.</p>' +
        '<button class="btn" data-do="contoh" style="width:100%;margin-top:12px">Isi data contoh</button>';
    const sb = Siklus.daftar().filter((s) => s.status === 'berjalan');
    const jalan = sb.length ? '<section data-bx="siklus"><h2>Siklus berjalan</h2><div class="sk-grid">' + sb.map((s) => {
      const k = Siklus.kom(s.komoditasId), h = Siklus.hari(s), u = k && k.umurPanenHari ? k.umurPanenHari : 0;
      const pct = u ? Math.min(100, Math.round(h / u * 100)) : null, sisa = u ? u - h : null;
      /* v0.1.081: ikon, meta, bilah, dan kaki hanya tampil sebagai kartu di desktop (CSS); di HP tetap baris seperti sebelumnya */
      return '<div class="tx sk-kartu" data-do="buka-siklus" data-id="' + s.id + '" role="button" tabindex="0"><div class="sk-ik" aria-hidden="true">' + ikon('siklus', 'sk-svg') + '</div>' +
        '<div class="tx-l"><div class="tx-n">' + esc(Siklus.nama(s.id)) + '</div><div class="note">Hari ' + h + (u ? '/' + u : '') + ' · modal' + (Tahap.ringkas(s) ? ' · ' + esc(Tahap.ringkas(s)) : '') + '</div></div><div class="tx-a">' + rp(Siklus.ringkas(s.id).modal) + '</div>' +
        (u ? '<div class="sk-meta"><span>Umur siklus</span><b>' + pct + '%</b></div><div class="sk-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' : '') +
        '<div class="sk-foot"><span>Hari ' + h + (u ? ' / ' + u : '') + '</span>' + (u ? '<span class="sk-pil' + (sisa < 0 ? ' lewat' : '') + '">' + (sisa < 0 ? 'lewat ' + (-sisa) + ' hari' : sisa === 0 ? 'panen hari ini' : sisa + ' hari lagi') + '</span>' : '') + '</div></div>';
    }).join('') + '</div></section>' : '';
    return Contoh.banner() + Beranda.atas() + jalan + this.grafikLipat(bln) + '<section data-bx="tx"><h2>Transaksi terakhir</h2>' + daftar + '</section>';
  },
  vTransaksi() {
    const f = this.filter;
    const opsiKat = '<option value="semua">Semua kategori</option>' +
      [['keluar', 'Modal'], ['masuk', 'Hasil']].map((j) =>
        '<optgroup label="' + j[1] + '">' + this.kategori(j[0]).map((k) =>
          '<option value="' + k.id + '"' + (f.kat === k.id ? ' selected' : '') + '>' + esc(k.nama) + '</option>').join('') + '</optgroup>').join('');
    const per = [['bulan', 'Bulan ini'], ['lalu', 'Bulan lalu'], ['semua', 'Semua'], ['rentang', 'Pilih tanggal']];
    const nLain = (f.kat !== 'semua' ? 1 : 0) + (f.siklus !== 'semua' ? 1 : 0), bukaLain = f.lain || nLain > 0;
    return '<section>' +
      '<input type="search" id="f_cari" class="cari" placeholder="Cari catatan, kategori, siklus" aria-label="Cari transaksi" value="' + esc(f.cari) + '">' +
      '<label for="f_periode">Periode</label><select id="f_periode" data-f="periode">' +
      per.map((p) => '<option value="' + p[0] + '"' + (f.periode === p[0] ? ' selected' : '') + '>' + p[1] + '</option>').join('') + '</select>' +
      (f.periode === 'rentang'
        ? '<div class="two"><div><label for="f_dari">Dari</label><input type="date" id="f_dari" data-f="dari" value="' + f.dari + '"></div>' +
          '<div><label for="f_sampai">Sampai</label><input type="date" id="f_sampai" data-f="sampai" value="' + f.sampai + '"></div></div>' : '') +
      '<label>Jenis</label><div class="seg">' +
      [['semua', 'Semua'], ['keluar', 'Modal'], ['masuk', 'Hasil']].map((j) =>
        '<button type="button" class="btn' + (f.jenis === j[0] ? ' on' : '') + '" data-fj="' + j[0] + '">' + j[1] + '</button>').join('') + '</div>' +
      '<div class="fl-bar"><button type="button" class="btn' + (nLain ? ' on' : '') + '" data-fl="1" aria-expanded="' + bukaLain + '">' + (bukaLain ? 'Sembunyikan filter lain' : 'Filter lain' + (nLain ? ' (' + nLain + ' aktif)' : '')) + '</button></div>' +
      (bukaLain ? '<label for="f_kat">Kategori</label><select id="f_kat" data-f="kat">' + opsiKat + '</select>' +
      '<label for="f_sik">Siklus</label><select id="f_sik" data-f="siklus"><option value="semua">Semua siklus</option><option value="none"' + (f.siklus === 'none' ? ' selected' : '') + '>Tanpa siklus</option>' +
      Siklus.opsi(Siklus.daftar(), f.siklus, (x) => Siklus.nama(x.id) + (x.status === 'selesai' ? ' (selesai)' : '')) + '</select>' : '') + '</section>' +
      '<section id="txHasil">' + this.hasilTx() + '</section>';
  },
  hasilTx() {
    const list = this.saring(), modal = this.jumlah(list, 'keluar'), hasil = this.jumlah(list, 'masuk');
    const ff = this.filter, terbalik = ff.periode === 'rentang' && ff.dari && ff.sampai && ff.dari > ff.sampai;
    return '<div class="sum"><div><span class="note">Modal</span><strong class="down">' + rp(modal) + '</strong></div>' +
      '<div><span class="note">Hasil</span><strong class="up">' + rp(hasil) + '</strong></div>' +
      '<div><span class="note">' + (hasil - modal < 0 ? 'Rugi' : 'Untung') + '</span><strong class="' + (hasil - modal < 0 ? 'down' : 'up') + '">' + rp(hasil - modal) + '</strong></div></div>' +
      (terbalik ? '<p class="note down" role="alert" style="margin-top:14px">Tanggal "Dari" setelah "Sampai", jadi tidak ada hasil.</p><button type="button" class="btn" data-do="tukar-tgl" style="width:100%;margin-top:8px">Tukar tanggal</button>' :
       list.length ? this.daftarTx(list) +
         (list.length > this.batasTx ? '<button type="button" class="btn" data-do="tx-lagi" style="width:100%;margin-top:12px;min-height:44px">Tampilkan lebih banyak (sisa ' + (list.length - this.batasTx).toLocaleString('id-ID') + ')</button>' : '') :
         '<p class="note" style="margin-top:14px">Tidak ada transaksi pada filter ini.</p>');
  },

  /* ---------- tampilan: catat / ubah ---------- */
  baru(sid) {
    if (!this.lanjutBuang()) return;
    const jenis = (this.draft && !this.draft.id && this.draft.jenis) || 'keluar';
    this.draft = { id: null, jenis, jumlah: 0, kat: this.lastKat[jenis] || this.kategori(jenis)[0].id, tanggal: isoHari(), catatan: '', siklus: sid || '', nota: null, notaLama: null, ...Utang.d0() };
    this.hapusMinta = null; this.lastEdit = null;
    this.bukaForm();
  },
  ubahTx(id) {
    if (!this.lanjutBuang()) return;
    const t = this.data.transaksi.find((x) => x.id === id);
    if (!t) return;
    this.draft = { id: t.id, jenis: t.jenis, jumlah: t.jumlah, kat: t.kategoriId, tanggal: t.tanggal, catatan: t.catatan || '', siklus: t.siklusId || '', nota: t.notaId || null, notaLama: t.notaId || null, ...Utang.dari(t) };
    this.hapusMinta = null; this.lastEdit = id;
    this.bukaForm();
  },
  /* master–detail di desktop (v0.1.121): form catat/ubah di panel kanan pada halaman Transaksi; selain itu halaman penuh seperti biasa */
  bukaForm() { if (this.tabelTx()) { this.panel = true; this.balik = 'transaksi'; this.renderPanel(true); } else this.go('catat'); },
  snapPanel() { return [...document.querySelectorAll('#txPanelIsi input,#txPanelIsi select,#txPanelIsi textarea')].map((e) => (e.type === 'checkbox' ? e.checked : e.value)).join('\u0001'); },
  kotor() { return this.panel && this.snapPanel() !== this.panelSnap; },
  lanjutBuang() { return !this.kotor() || confirm('Perubahan belum disimpan. Buang perubahan?'); },
  renderPanel(fokus) {
    const d = this.draft, p = $('txPanel'); if (!d || !p) return;
    $('txPanelJudul').textContent = d.id ? 'Ubah transaksi' : (d.jenis === 'masuk' ? 'Catat hasil' : 'Catat modal');
    const isi = $('txPanelIsi'); isi.innerHTML = this.vCatat(); Form.upgrade(isi); Nota.isiBox(); if (typeof Foto !== 'undefined') Foto.muat(isi);
    p.hidden = false; document.body.dataset.panel = 'tx'; this.panelSnap = this.snapPanel();
    document.querySelectorAll('tr.tt-aktif').forEach((r) => r.classList.remove('tt-aktif'));
    if (d.id) { const r = document.querySelector('tr[data-edit="' + d.id + '"]'); if (r) r.classList.add('tt-aktif'); }
    if (fokus) { const j = $('f_jumlah'); if (j) j.focus(); }
  },
  tutupPanel(buang) {
    if (!this.panel) return;
    if (buang && this.draft) { Nota.buang(this.draft); this.draft = null; }
    this.panel = false; const p = $('txPanel'); if (p) { p.hidden = true; $('txPanelIsi').innerHTML = ''; } delete document.body.dataset.panel;
    document.querySelectorAll('tr.tt-aktif').forEach((r) => r.classList.remove('tt-aktif'));
  },
  bacaForm() {
    const d = this.draft;
    if (!$('f_jumlah')) return d;
    d.jumlah = angka($('f_jumlah').value); d.kat = $('f_kat').value;
    d.tanggal = $('f_tanggal').value; d.catatan = $('f_catatan').value; d.siklus = $('f_siklus').value;
    Utang.baca(d, 'f');
    return d;
  },
  /* v0.1.050: catatan di form Catat hasil agar penjualan panen tidak terhitung dua kali dan tetap masuk HPP/BEP */
  infoHasil() {
    const d = this.draft; if (!d || d.jenis !== 'masuk' || !d.siklus || !Siklus.cari(d.siklus)) return '';
    const tx = (p) => p.transaksiId && this.data.transaksi.find((t) => t.id === p.transaksiId && !t.terhapus);
    const jual = Siklus.panenOf(d.siklus).filter(tx), nilai = jual.reduce((a, p) => a + tx(p).jumlah, 0);
    const catatan = (h) => '<p class="note" style="margin-top:10px">' + h + '</p>';
    let h = '';
    if (!d.id && jual.length) h += catatan('Siklus ini sudah punya ' + jual.length + ' panen berharga (total ' + rp(nilai) + ') yang otomatis tercatat sebagai Hasil. Jangan catat penjualannya lagi di sini agar penghasilan tidak terhitung dua kali.');
    if (!d.id && d.kat === 'jual-panen') h += catatan('Hasil yang dicatat di sini tidak punya jumlah barang, jadi tidak masuk HPP, BEP, dan harga jual minimum.') +
      '<button type="button" class="btn" data-do="hasil-ke-panen" style="width:100%;margin-top:8px">Catat sebagai panen</button>';
    return h;
  },
  vCatat() {
    const d = this.draft || (this.baru(), this.draft);
    const edit = !!d.id;
    return '<section>' +
      '<div class="seg"><button type="button" class="btn' + (d.jenis === 'keluar' ? ' on' : '') + '" data-do="jenis-keluar">Modal (keluar)</button>' +
      '<button type="button" class="btn' + (d.jenis === 'masuk' ? ' on' : '') + '" data-do="jenis-masuk">Hasil (masuk)</button></div>' +
      '<label for="f_jumlah">Jumlah (Rp)</label><input id="f_jumlah" inputmode="numeric" autocomplete="off" placeholder="0" value="' + fmtInput(d.jumlah) + '">' +
      '<label for="f_kat">Kategori</label><select id="f_kat">' + this.kategori(d.jenis).map((k) =>
        '<option value="' + k.id + '"' + (d.kat === k.id ? ' selected' : '') + '>' + esc(k.nama) + '</option>').join('') + '</select>' +
      '<label for="f_siklus">Siklus (opsional)</label><select id="f_siklus"><option value="">Tanpa siklus</option>' +
      Siklus.opsi(Siklus.daftar().filter((s) => s.status === 'berjalan' || s.id === d.siklus), d.siklus, (x) => Siklus.nama(x.id)) + '</select>' +
      '<label for="f_tanggal">Tanggal</label><input type="date" id="f_tanggal" value="' + d.tanggal + '">' +
      '<div id="f_info" aria-live="polite">' + this.infoHasil() + '</div>' +
      Utang.kotak(d, 'f', d.jenis === 'keluar' ? 'Pemasok / pihak' : 'Pembeli / pihak', '') +
      '<label for="f_catatan">Catatan (opsional)</label><input id="f_catatan" maxlength="120" value="' + esc(d.catatan) + '" placeholder="mis. NPK 5 kg">' +
      Nota.kotak() +
      '<button class="btn gold" data-do="simpan">Simpan</button>' +
      (edit ? '' : '<button class="btn" data-do="simpan-baru" style="width:100%;margin-top:10px">Simpan &amp; catat lagi</button>') +
      (edit ? '<button class="btn" data-do="dup-tx" style="width:100%;margin-top:10px">Duplikat sebagai transaksi baru</button>' : '') +
      '<button class="btn" data-do="batal" style="width:100%;margin-top:10px">Batal</button>' +
      (edit ? '<button class="btn danger" data-do="hapus-tx" style="width:100%;margin-top:10px">' + 'Hapus transaksi' + '</button>' : '') +
      '</section>';
  },

  /* ---------- tampilan: lainnya ---------- */
  vLainnya() {
    const kustom = this.data.kategori.filter((k) => !k.terhapus);
    return '<section><h2>Rencana keuangan</h2><p class="note">Anggaran per siklus, arus kas dan proyeksi, aset dan penyusutan, balik modal, utang/piutang.</p><button class="btn" data-go="rencana" style="width:100%;margin-top:12px">Buka rencana keuangan</button></section>' +
      '<section><h2>Kategori sendiri</h2><p class="note">Kategori bawaan tidak bisa dihapus. Tambahkan yang khusus usaha Anda.</p>' +
      (kustom.length ? kustom.map((k) => '<div class="row"><span>' + esc(k.nama) + ' <span class="mu">· ' + (k.jenis === 'keluar' ? 'modal' : 'hasil') + '</span></span>' +
        '<button class="btn" data-do="hapus-kat" data-id="' + k.id + '" style="flex:0 0 auto;padding:4px 10px;font-size:12px">Hapus</button></div>').join('') : '') +
      '<label for="k_nama">Nama kategori</label><input id="k_nama" maxlength="40" placeholder="mis. Bambu penyangga">' +
      '<label for="k_jenis">Jenis</label><select id="k_jenis"><option value="keluar">Modal (keluar)</option><option value="masuk">Hasil (masuk)</option></select>' +
      '<button class="btn gold" data-do="tambah-kat">Tambah kategori</button></section>' +
      '<section><h2>Ekspor Excel</h2><p class="note">Satu berkas .xlsx berisi lembar Siklus, Transaksi, Panen, Utang dan piutang, Aset, Harga pasar, Jadwal, dan Jurnal (catatan, tahap, kejadian, ukuran). Untung dan R/C memakai rumus Excel. Cadangan yang bisa dipulihkan tetap JSON di Setelan.</p>' +
      '<button class="btn" data-do="ekspor-xlsx" style="width:100%;margin-top:12px">Ekspor Excel (.xlsx)</button><button class="btn" data-do="ekspor-csv-jurnal" style="width:100%;margin-top:8px">Ekspor CSV jurnal</button><div class="note" id="xlsMsg" role="status" aria-live="polite" style="margin-top:8px"></div></section>' +
      '<section><h2>Ekspor &amp; impor CSV</h2><p class="note">Kolom: tanggal, jenis (keluar/masuk), kategori, siklus, jumlah, catatan. Cadangan penuh (JSON) ada di Setelan. Sebelum diimpor, pratinjau ditampilkan dulu.</p>' +
      '<div class="seg tiga" style="margin-top:12px"><button class="btn" data-do="ekspor-csv">Ekspor CSV</button><button class="btn" data-do="impor-csv">Impor teks</button>' +
      '<button class="btn" data-do="berkas-csv">Pilih berkas</button></div>' +
      '<input type="file" id="csvFile" accept=".csv,text/csv" hidden>' +
      '<textarea id="csvBox" class="settings-text" rows="6" aria-label="Data CSV" placeholder="Hasil ekspor muncul di sini; tempel CSV untuk impor"></textarea>' +
      '<div class="note" id="csvMsg" role="status" aria-live="polite" style="margin-top:8px"></div></section>' +
      '';
  },

  /* ---------- aksi ---------- */
  toast(t, aksi) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = t; el.setAttribute('role', 'status');
    const ada = document.querySelectorAll('.toast').length; if (ada) el.style.marginBottom = ada * 52 + 'px'; /* toast bersamaan bertumpuk, tidak saling menimpa (v0.1.101) */
    const L = aksi ? (Array.isArray(aksi) ? aksi : [aksi]) : []; /* satu tombol atau beberapa (v0.1.100) */
    L.forEach((a) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'toast-btn'; b.textContent = a.label; b.onclick = () => { el.remove(); a.fn(); }; el.appendChild(b); });
    document.body.appendChild(el); setTimeout(() => el.remove(), L.length > 1 ? 6500 : L.length ? 5000 : 1800);
  },
  aksi(a, el) {
    if (a === 'tukar-tgl') { const f = this.filter, x = f.dari; f.dari = f.sampai; f.sampai = x; this.go('transaksi', true); return; }
    if (Nota.aksi(a)) return;
    if (a === 'tx-lagi') { this.batasTx += 100; const el = $('txHasil'); if (el) el.innerHTML = this.hasilTx(); return; }
    if (Siklus.aksi(a, el)) return;
    if (a === 'jenis-keluar' || a === 'jenis-masuk') {
      const d = this.bacaForm(); d.jenis = a.slice(6); d.kat = this.lastKat[d.jenis] || this.kategori(d.jenis)[0].id;
      this.go('catat', true);
    } else if (a === 'batal') { Nota.buang(this.draft); this.draft = null; this.go(this.balik || 'beranda'); }
    else if (a === 'simpan' || a === 'simpan-baru') this.simpanTx(a === 'simpan-baru');
    else if (a === 'dup-tx') {
      const d = this.bacaForm(); Nota.buang(d); this.draft = Object.assign({}, d, { id: null, tanggal: isoHari(), nota: null, notaLama: null, kunci: false }); this.hapusMinta = null;
      this.toast('Disalin sebagai transaksi baru — ubah bila perlu, lalu Simpan'); this.go('catat', true);
    } else if (a === 'hapus-tx') {
      const t = this.data.transaksi.find((x) => x.id === this.draft.id);
      if (!t || Utang.tahan(t)) return;
      t.terhapus = true; t.diubah = nowIso(); Utang.ikut(t, true); this.simpan();
      this.hapusMinta = null; this.draft = null; this.go(this.balik || 'beranda');
      this.toast('Transaksi dihapus', { label: 'Urungkan', fn: () => { t.terhapus = false; t.diubah = nowIso(); Utang.ikut(t, false); this.simpan(); this.go(this.tab, true); } });
    }
    else if (a === 'tambah-kat') this.tambahKat();
    else if (a === 'hapus-kat') {
      const k = this.data.kategori.find((x) => x.id === el.dataset.id);
      if (k) { k.terhapus = true; this.simpan(); this.go('lainnya', true); }
    }
    else if (a === 'ekspor-xlsx') { try { const n = Xlsx.unduh(); $('xlsMsg').textContent = 'Berkas Excel dibuat: ' + n + ' lembar berisi data.'; } catch (err) { $('xlsMsg').textContent = 'Ekspor Excel gagal. Coba ekspor CSV atau cadangan JSON.'; } }
    else if (a === 'ekspor-csv') this.eksporCsv();
    else if (a === 'ekspor-csv-jurnal') { const n = Kejadian.eksporCsvJurnal(); $('xlsMsg').textContent = n ? n + ' catatan jurnal diekspor ke CSV.' : 'Belum ada catatan jurnal untuk diekspor.'; }
    else if (a === 'impor-csv') this.imporCsv();
    else if (a === 'berkas-csv') $('csvFile').click();
    else if (a === 'contoh') this.contoh();
    else if (a === 'hapus-contoh') Contoh.hapus(el);
  },
  simpanTx(lagi) {
    const d = this.bacaForm();
    if (d.jumlah <= 0) { this.toast('Isi jumlah lebih dari 0'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.tanggal)) { this.toast('Isi tanggal'); return; }
    const tLama = d.id && this.data.transaksi.find((x) => x.id === d.id), gal = Utang.cek(d.jumlah, d, tLama && Utang.tertaut(tLama));
    if (gal) { this.toast(gal); return; }
    const kat = this.semuaKat().find((k) => k.id === d.kat);
    const sifat = d.jenis === 'keluar' ? (kat && kat.sifatBiaya) || 'variabel' : null;
    let tx;
    if (d.id) {
      const t = tx = this.data.transaksi.find((x) => x.id === d.id);
      Object.assign(t, { tanggal: d.tanggal, jenis: d.jenis, kategoriId: d.kat, jumlah: d.jumlah, sifatBiaya: sifat, catatan: d.catatan, siklusId: d.siklus || null, notaId: d.nota || null, diubah: nowIso() });
    } else {
      this.data.transaksi.push(tx = { id: uid('t'), tanggal: d.tanggal, jenis: d.jenis, kategoriId: d.kat, jumlah: d.jumlah, siklusId: d.siklus || null,
        sifatBiaya: sifat, catatan: d.catatan, notaId: d.nota || null, dibuat: nowIso(), diubah: nowIso(), terhapus: false });
    }
    Utang.sinkron(tx, d);
    this.lastKat[d.jenis] = d.kat;
    if (d.notaLama && d.notaLama !== d.nota) Nota.hapus(d.notaLama);
    this.simpan();
    if (lagi) {
      this.draft = { id: null, jenis: d.jenis, jumlah: 0, kat: d.kat, tanggal: d.tanggal, catatan: '', siklus: d.siklus, nota: null, notaLama: null, ...Utang.d0() };
      this.toast('Transaksi tersimpan'); this.go('catat', true);
      const j = $('f_jumlah'); if (j) j.focus();
    } else { this.draft = null; this.toast(d.id ? 'Transaksi diperbarui' : 'Transaksi tersimpan'); this.go(['transaksi', 'siklus-detail', 'jurnal'].includes(this.balik) ? this.balik : 'beranda'); }
  },
  tambahKat() {
    const nama = $('k_nama').value.trim(), jenis = $('k_jenis').value;
    if (!nama) { this.toast('Isi nama kategori'); return; }
    if (this.kategori(jenis).some((k) => k.nama.toLowerCase() === nama.toLowerCase())) { this.toast('Kategori sudah ada'); return; }
    this.data.kategori.push({ id: uid('c'), nama, jenis, sifatBiaya: jenis === 'keluar' ? 'variabel' : null, bawaan: false, terhapus: false });
    this.simpan(); this.toast('Kategori ditambahkan'); this.go('lainnya', true);
  },

  /* ---------- CSV ---------- */
  eksporCsv() {
    const q = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
    const baris = ['tanggal,jenis,kategori,siklus,jumlah,catatan'].concat(
      this.aktif().slice().sort((a, b) => a.tanggal.localeCompare(b.tanggal)).map((t) =>
        [t.tanggal, t.jenis, q(this.namaKat(t.kategoriId)), q(t.siklusId || ''), t.jumlah, q(t.catatan)].join(',')));
    const csv = baris.join('\n');
    $('csvBox').value = csv;
    try {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' }));
      a.download = 'buku-kebun-transaksi-' + isoHari() + '.csv';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) {}
    $('csvMsg').textContent = this.aktif().length + ' transaksi diekspor. Jika unduhan tidak mulai, salin teks di kotak.';
  },
  urai(teks) {
    const rows = []; let r = [], f = '', q = false;
    teks = teks.replace(/^\ufeff/, '');
    for (let i = 0; i < teks.length; i++) {
      const c = teks[i];
      if (q) { if (c === '"') { if (teks[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ',') { r.push(f); f = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && teks[i + 1] === '\n') i++; r.push(f); f = ''; if (r.some((x) => x.trim())) rows.push(r); r = []; }
      else f += c;
    }
    r.push(f); if (r.some((x) => x.trim())) rows.push(r);
    return rows;
  },
  /* mengganti seluruh data dengan isi berkas (impor JSON, Urungkan impor); data lama dicadangkan otomatis */
  pasangData(o) { const r = Store.dari(o); Cadangan.catat('Sebelum impor', true); this.data = r.data; this.simpan(true); this.go(this.tab, true); return r; },
  /* impor CSV (v0.1.102): analisa dulu tanpa mengubah data, tampilkan pratinjau (Impor.csv), baru terapkan */
  analisaCsv(teks) {
    const rows = this.urai(teks || '');
    if (rows.length < 2) return { galat: 'CSV kosong atau tanpa baris data.' };
    const h = rows[0].map((x) => x.trim().toLowerCase()), ix = (n) => h.indexOf(n);
    if (ix('tanggal') < 0 || ix('jenis') < 0 || ix('jumlah') < 0) return { galat: 'Kolom tanggal, jenis, dan jumlah wajib ada.' };
    const data = rows.slice(1).filter((r) => r.some((c) => String(c).trim()));
    const a = { baris: [], lewat: 0, total: data.length, masuk: 0, keluar: 0, dari: '', sampai: '', kategoriBaru: [], tanpaKategori: 0, kembar: 0 }, baru = {};
    const ada = new Set(this.aktif().map((t) => [t.tanggal, t.jenis, t.jumlah, t.catatan || ''].join('|')));
    data.forEach((r) => {
      const tgl = (r[ix('tanggal')] || '').trim(), jenis = (r[ix('jenis')] || '').trim().toLowerCase(), jml = angka(r[ix('jumlah')]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl) || (jenis !== 'keluar' && jenis !== 'masuk') || jml <= 0) { a.lewat++; return; }
      const nama = ix('kategori') >= 0 ? (r[ix('kategori')] || '').trim() : '', catatan = ix('catatan') >= 0 ? (r[ix('catatan')] || '').trim() : '';
      a.baris.push({ tgl: tgl, jenis: jenis, jml: jml, nama: nama, catatan: catatan }); a[jenis === 'masuk' ? 'masuk' : 'keluar'] += jml;
      if (!a.dari || tgl < a.dari) a.dari = tgl; if (!a.sampai || tgl > a.sampai) a.sampai = tgl;
      if (!nama) a.tanpaKategori++; else if (!this.kategori(jenis).some((x) => x.nama.toLowerCase() === nama.toLowerCase())) baru[jenis + '|' + nama.toLowerCase()] = nama;
      if (ada.has([tgl, jenis, jml, catatan].join('|'))) a.kembar++;
    });
    a.kategoriBaru = Object.keys(baru).map((k) => baru[k]);
    return a;
  },
  terapkanCsv(a) {
    const ids = [], kat = [];
    a.baris.forEach((r) => {
      let k = this.kategori(r.jenis).find((x) => x.nama.toLowerCase() === r.nama.toLowerCase());
      if (!k && r.nama) { k = { id: uid('c'), nama: r.nama, jenis: r.jenis, sifatBiaya: r.jenis === 'keluar' ? 'variabel' : null, bawaan: false, terhapus: false }; this.data.kategori.push(k); kat.push(k.id); }
      if (!k) k = this.kategori(r.jenis).slice(-1)[0];
      const t = { id: uid('t'), tanggal: r.tgl, jenis: r.jenis, kategoriId: k.id, jumlah: r.jml, siklusId: null,
        sifatBiaya: r.jenis === 'keluar' ? k.sifatBiaya || 'variabel' : null, catatan: r.catatan, dibuat: nowIso(), diubah: nowIso(), terhapus: false };
      this.data.transaksi.push(t); ids.push(t.id);
    });
    this.simpan(); this.ringkas();
    return { ids: ids, kat: kat };
  },
  batalkanCsv(h) { // Urungkan: hapus lunak transaksi dan kategori yang baru dibuat oleh impor itu
    const n = nowIso();
    this.data.transaksi.forEach((t) => { if (h.ids.includes(t.id)) { t.terhapus = true; t.diubah = n; } });
    this.data.kategori.forEach((k) => { if (h.kat.includes(k.id)) { k.terhapus = true; k.diubah = n; } });
    this.simpan(); this.ringkas(); this.go(this.tab, true);
  },
  imporCsv(info) {
    const a = this.analisaCsv($('csvBox').value || ''), pesan = (t) => { const e = $('csvMsg'); if (e) e.textContent = t; };
    if (a.galat) { pesan(a.galat); this.toast(a.galat); return; }
    Impor.csv(a, info, pesan);
  },
  contoh() { Contoh.isi(); }
};

document.addEventListener('DOMContentLoaded', () => App.init());
