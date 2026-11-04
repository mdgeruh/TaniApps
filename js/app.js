/* Tani Keuangan — Fase 1: pencatatan transaksi + efek kaca (v0.1.036) */
const VERSI = '0.1.036';
const KUNCI = 'tani.v1';
const IKON = {
  beranda: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  transaksi: '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  siklus: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
  laporan: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V7M16 16v-8"/>',
  lainnya: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'
};
const ikon = (k, c) => '<svg class="' + c + '" viewBox="0 0 24 24" aria-hidden="true">' + IKON[k] + '</svg>';
const TAB = [['beranda','Beranda'],['transaksi','Transaksi'],['siklus','Siklus'],['laporan','Laporan'],['lainnya','Lainnya']];
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
    return { versi: 1, utang: [], unit: [], komoditas: [], siklus: [], transaksi: [], panen: [], aset: [], kategori: [],
             pengaturan: { mataUang: 'IDR', bulanMulai: 1 } };
  },
  muat() {
    try {
      const m = Penyimpanan.get(KUNCI);
      return m ? this.dari(JSON.parse(m)).data : this.kosong();
    } catch (e) { console.error('Gagal memuat data', e); return this.kosong(); }
  },
  KOLEKSI: ['utang', 'unit', 'komoditas', 'siklus', 'transaksi', 'panen', 'aset', 'kategori'],
  /* Entri yang akan membuat tampilan gagal dibuang; koleksi yang bukan daftar dianggap kosong. */
  sah(k, x) {
    const n = Number.isFinite, s = (v) => typeof v === 'string' && v !== '';
    if (!x || typeof x !== 'object' || Array.isArray(x) || !s(x.id)) return false;
    if (k === 'transaksi') return /^\d{4}-\d{2}-\d{2}/.test(x.tanggal || '') && n(x.jumlah) && (x.jenis === 'masuk' || x.jenis === 'keluar');
    if (k === 'siklus') return s(x.mulai);
    if (k === 'panen') return s(x.tanggal) && n(x.kuantitasKotor) && n(x.susut);
    if (k === 'aset') return n(x.hargaBeli) && n(x.umurBulan) && x.umurBulan > 0;
    if (k === 'utang') return n(x.jumlah);
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
  simpan(d) {
    try { Penyimpanan.set(KUNCI, JSON.stringify(d)); } catch (e) { console.error('Gagal menyimpan data', e); }
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
  terapkan() { if (this.aktif()) this.sapu($('app')); else this.pulihkan(); },
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
  draft: null, lastKat: {},

  /* ---------- data ---------- */
  aktif() { return this._ak || (this._ak = this.data.transaksi.filter((t) => !t.terhapus)); },
  kategori(jenis) {
    return SEED[jenis].concat(this.data.kategori.filter((k) => k.jenis === jenis && !k.terhapus));
  },
  semuaKat() { return this.kategori('keluar').concat(this.kategori('masuk')); },
  namaKat(id) { const k = this.semuaKat().find((x) => x.id === id); return k ? k.nama : id; },
  simpan() { this._ak = null; Store.simpan(this.data); Cadangan.otomatis(); Sinkron.tandai(); },
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
    $('versi').textContent = 'v' + VERSI;
    $('tabs').innerHTML = TAB.map((t) => '<button class="main-tab-btn" data-go="' + t[0] + '">' + ikon(t[0], 'tab-icon') + t[1] + '</button>').join('');
    $('bnav').innerHTML = TAB.map((t) => '<button class="bnav-btn" data-go="' + t[0] + '">' + ikon(t[0], 'bnav-icon') + '<span>' + t[1] + '</span></button>').join('');
    Setelan.init({
      versi: VERSI,
      ambil: () => this.data,
      pasang: (o) => { const r = Store.dari(o); Cadangan.catat('Sebelum impor', true); this.data = r.data; this.simpan(); this.go(this.tab, true); return r; },
      hapus: () => { Cadangan.catat('Sebelum hapus', true); this.data = Store.kosong(); this.simpan(); this.go(this.tab, true); },
      ubah: () => { this.ringkas(); if (this.tab === 'setelan' || this.tab === 'transaksi' || this.tab === 'beranda') this.go(this.tab, true); }
    });
    Cadangan.init({
      ambil: () => this.data,
      pulih: (o) => { this.data = Store.dari(o).data; this.simpan(); this.go(this.tab, true); },
      segar: () => { if (this.tab === 'setelan') this.go('setelan', true); }
    });
    Sinkron.init({
      ambil: () => this.data,
      terapkan: (o, segarkan) => {
        this.data = Store.dari(o).data; this._ak = null; Store.simpan(this.data); Cadangan.otomatis();
        if (segarkan) this.go(this.tab, true); else this.ringkas();
      },
      segar: () => { if (this.tab === 'setelan') this.go('setelan', true); }
    });
    Pwa.init({ segar: () => { if (this.tab === 'setelan') this.go('setelan', true); } });
    Setelan.bind($('app'));
    document.addEventListener('click', (e) => this.klik(e));
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
    window.addEventListener('beforeprint', () => Samar.cetak(true)); window.addEventListener('afterprint', () => Samar.cetak(false));
    Samar.pasang($('app'));
    $('app').addEventListener('input', (e) => {
      if (e.target.id === 'f_jumlah' || e.target.id === 'p_harga' || e.target.dataset.rp !== undefined) {
        if (e.data && /[^\d.\s]/.test(e.data)) this.toast(e.data === ',' ? 'Rupiah bulat, tanpa desimal' : 'Hanya angka');
        e.target.value = fmtInput(angkaKetik(e.target.value));
      }
      if (e.target.id === 'f_cari') {
        this.filter.cari = e.target.value.trim(); clearTimeout(this._tc);
        this._tc = setTimeout(() => { const el = $('txHasil'); if (el) el.innerHTML = this.hasilTx(); }, 150);
      }
    });
    $('theme').addEventListener('click', () => Setelan.ubah('mode', Setelan.efektif() === 'light' ? 'dark' : 'light'));
    $('gear').addEventListener('click', () => this.go('setelan'));
    Fab.init();
    Panduan.init();
    $('eye').addEventListener('click', () => { this.buka = !this.buka; this.ringkas(); });
    this.go('beranda');
    if (pertama) Panduan.otomatis();
  },

  klik(e) {
    if (Analisa.klik(e) || Rencana.klik(e)) return;
    const g = e.target.closest('[data-go]');
    if (g) { this.go(g.dataset.go); return; }
    const ed = e.target.closest('[data-edit]');
    if (ed) { this.ubahTx(ed.dataset.edit); return; }
    if (e.target.closest('[data-bp]')) { Beranda.semua = !Beranda.semua; this.go('beranda', true); return; }
    const fl = e.target.closest('[data-fl]');
    if (fl) { this.filter.lain = !this.filter.lain; this.go('transaksi', true); return; }
    const fj = e.target.closest('[data-fj]');
    if (fj) { this.filter.jenis = fj.dataset.fj; this.go('transaksi', true); return; }
    const d = e.target.closest('[data-do]');
    if (d) this.aksi(d.dataset.do, d);
  },
  ubahField(e) {
    const f = e.target.dataset.f;
    if (f) {
      this.filter[f] = e.target.value;
      if (f === 'periode' && e.target.value !== 'rentang') { this.filter.dari = ''; this.filter.sampai = ''; }
      this.go('transaksi', true);
    } else if (e.target.id === 'csvFile' && e.target.files[0]) {
      const r = new FileReader();
      r.onload = () => { $('csvBox').value = r.result; this.imporCsv(); };
      r.readAsText(e.target.files[0]);
    }
  },

  /* ---------- ringkasan ---------- */
  ringkas() {
    const bi = bulanIni();
    const bln = this.aktif().filter((t) => t.tanggal.slice(0, 7) === bi);
    const modal = this.jumlah(bln, 'keluar'), hasil = this.jumlah(bln, 'masuk'), untung = hasil - modal;
    const set = (id, v) => { const el = $(id); if (el) el.dataset.val = v; };
    set('heroNum', rp(untung)); set('stModal', rp(modal)); set('stHasil', rp(hasil));
    $('heroNum').className = 'hero-number' + (untung < 0 ? ' rugi' : '');
    $('heroLbl').textContent = untung < 0 ? 'Rugi bulan ini' : 'Untung bulan ini';
    $('heroSub').innerHTML = bln.length
      ? bln.length + ' transaksi bulan ini' + (modal > 0 ? ' · margin ' + (hasil ? Math.round(untung / hasil * 100) + '%' : '—') : '')
      : 'Belum ada transaksi bulan ini';
    $('stRC').textContent = modal > 0 ? (hasil / modal).toFixed(2).replace('.', ',') : '—';
    const dl = $('heroDelta');
    if (dl && typeof Beranda !== 'undefined') {
      const lalu = Beranda.per(bulanLalu());
      if (!lalu.n) dl.innerHTML = '';
      else {
        const d = untung - lalu.u;
        dl.innerHTML = d === 0 ? 'Sama dengan bulan lalu' : '<span class="' + (d > 0 ? 'up' : 'down') + '">' + (d > 0 ? '▲ ' : '▼ ') + '<span data-mask data-val="' + rp(Math.abs(d)) + '">' + rp(Math.abs(d)) + '</span></span> dibanding bulan lalu';
      }
    }
    const sp = $('heroSpark');
    if (sp && typeof Analisa !== 'undefined') {
      const T = Analisa.bulanN(6).map((x) => x.h - x.m);
      sp.toggleAttribute('hidden', !T.some((x) => x));
      if (T.some((x) => x)) {
        const mx = Math.max(1, ...T.map(Math.abs)), W = 300, H = 40, mg = 5;
        const P = T.map((u, i) => [i * W / (T.length - 1), H / 2 - u / mx * (H / 2 - mg)]);
        sp.innerHTML = '<line x1="0" y1="' + H / 2 + '" x2="' + W + '" y2="' + H / 2 + '" class="hs-nol" vector-effect="non-scaling-stroke"/>' +
          '<path d="' + P.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + '" class="hs-garis" vector-effect="non-scaling-stroke"/>';
      }
    }
    const sembunyi = Setelan.get('sembunyi') && !this.buka;
    document.querySelectorAll('[data-mask]').forEach((el) => { el.textContent = sembunyi ? 'Rp ••••••' : el.dataset.val; });
    $('eye').textContent = sembunyi ? '○' : '◉';
    const e2 = $('eye2'); if (e2) { e2.hidden = !(Setelan.get('sembunyi') && this.tab !== 'beranda'); e2.textContent = sembunyi ? '○' : '◉'; e2.setAttribute('aria-pressed', String(!sembunyi)); }
    Samar.terapkan();
  },

  /* ---------- navigasi ---------- */
  go(t, tetap) {
    this._ak = null;
    if (t !== 'catat' && t !== 'setelan' && this.tab !== t) this.hapusMinta = null;
    if ((t === 'catat' || t === 'setelan') && this.tab !== 'catat' && this.tab !== 'setelan') this.balik = this.tab;
    this.tab = t;
    let h;
    if (t === 'setelan') h = Setelan.render();
    else if (t === 'beranda') h = this.vBeranda();
    else if (t === 'transaksi') h = this.vTransaksi();
    else if (t === 'catat') h = this.vCatat();
    else if (t === 'lainnya') h = this.vLainnya();
    else if (t === 'siklus') h = Siklus.vList();
    else if (t === 'siklus-form') h = Siklus.vForm();
    else if (t === 'siklus-detail') h = Siklus.vDetail();
    else if (t === 'panen') h = Siklus.vPanen();
    else if (t === 'master') h = Siklus.vMaster();
    else if (t === 'laporan') h = Analisa.vLaporan();
    else if (t === 'rencana') h = Rencana.v();
    else h = '<section><h2>' + NANTI[t][0] + '</h2><p class="note">' + NANTI[t][1] + '</p></section>';
    $('app').innerHTML = h;
    Form.upgrade($('app'));
    const induk = { 'siklus-form': 'siklus', 'siklus-detail': 'siklus', panen: 'siklus', master: 'lainnya', rencana: 'lainnya' }[t] || t;
    document.querySelectorAll('.main-tab-btn,.bnav-btn').forEach((b) => b.classList.toggle('active', b.dataset.go === induk));
    $('gear').classList.toggle('active', t === 'setelan');
    const hc = $('heroCard'); if (hc) hc.hidden = t !== 'beranda';
    this.judulHal(t);
    Fab.atur();
    this.ringkas();
    if (!tetap) window.scrollTo(0, 0);
  },

  /* ---------- judul halaman aktif (v0.1.033) ---------- */
  judulHal(t) {
    const sid = typeof Siklus !== 'undefined' ? Siklus.cari(Siklus.sid) : null;
    const J = {
      transaksi: ['Transaksi'], siklus: ['Siklus'], laporan: ['Laporan'], lainnya: ['Lainnya'], setelan: ['Setelan'],
      'siklus-form': ['Siklus baru', 'siklus', 'Siklus'],
      'siklus-detail': [sid ? Siklus.nama(sid.id) : 'Detail siklus', 'siklus', 'Siklus'],
      panen: [Siklus.pd && Siklus.pd.id ? 'Ubah panen' : 'Catat panen', 'siklus-detail', 'Detail siklus'],
      master: ['Unit & komoditas', 'lainnya', 'Lainnya'],
      rencana: ['Rencana keuangan', 'lainnya', 'Lainnya'],
      catat: [this.draft && this.draft.id ? 'Ubah transaksi' : this.draft && this.draft.jenis === 'masuk' ? 'Catat hasil' : 'Catat modal']
    }[t];
    const box = $('judulHal'), ind = $('judulInduk');
    if (!J) { box.hidden = true; document.title = 'Tani Keuangan'; return; }
    box.hidden = false; $('judulTeks').textContent = J[0];
    ind.hidden = !J[1]; if (J[1]) { ind.dataset.go = J[1]; ind.textContent = '‹ ' + J[2]; }
    document.title = J[0] + ' · Tani Keuangan';
  },

  /* ---------- tampilan: transaksi ---------- */
  barisTx(t) {
    const m = t.jenis === 'masuk';
    return '<div class="tx" data-edit="' + t.id + '" role="button" tabindex="0">' +
      '<div class="tx-l"><div class="tx-n">' + esc(this.namaKat(t.kategoriId)) + '</div>' +
      '<div class="note">' + Setelan.tgl(t.tanggal) + (t.siklusId && this.tab !== 'siklus-detail' && Siklus.cari(t.siklusId) ? ' · ' + esc(Siklus.nama(t.siklusId).split(' · ')[0]) : '') + (t.catatan ? ' · ' + esc(t.catatan) : '') + '</div></div>' +
      '<div class="tx-a ' + (m ? 'up' : 'down') + '">' + (m ? '+' : '−') + rp(t.jumlah).replace('Rp ', 'Rp\u00a0') + '</div></div>';
  },
  grafikLipat(bln) {
    const g = Beranda.grafik(bln);
    return g ? '<details class="lipat luar" data-lipat="grafik"' + (Lipat.buka('grafik', window.innerWidth > 720) ? ' open' : '') + '><summary><h2>Grafik</h2></summary>' + g + '</details>' : '';
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
    const jalan = sb.length ? '<section><h2>Siklus berjalan</h2>' + sb.map((s) => { const k = Siklus.kom(s.komoditasId);
      return '<div class="tx" data-do="buka-siklus" data-id="' + s.id + '" role="button" tabindex="0"><div class="tx-l"><div class="tx-n">' + esc(Siklus.nama(s.id)) + '</div><div class="note">Hari ' + Siklus.hari(s) + (k && k.umurPanenHari ? '/' + k.umurPanenHari : '') + ' · modal</div></div><div class="tx-a">' + rp(Siklus.ringkas(s.id).modal) + '</div></div>'; }).join('') + '</section>' : '';
    return Contoh.banner() + Beranda.atas() + jalan + this.grafikLipat(bln) + '<section><h2>Transaksi terakhir</h2>' + daftar + '</section>';
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
       list.length ? list.map((t) => this.barisTx(t)).join('') : '<p class="note" style="margin-top:14px">Tidak ada transaksi pada filter ini.</p>');
  },

  /* ---------- tampilan: catat / ubah ---------- */
  baru(sid) {
    const jenis = (this.draft && !this.draft.id && this.draft.jenis) || 'keluar';
    this.draft = { id: null, jenis, jumlah: 0, kat: this.lastKat[jenis] || this.kategori(jenis)[0].id, tanggal: isoHari(), catatan: '', siklus: sid || '' };
    this.hapusMinta = null;
    this.go('catat');
  },
  ubahTx(id) {
    const t = this.data.transaksi.find((x) => x.id === id);
    if (!t) return;
    this.draft = { id: t.id, jenis: t.jenis, jumlah: t.jumlah, kat: t.kategoriId, tanggal: t.tanggal, catatan: t.catatan || '', siklus: t.siklusId || '' };
    this.hapusMinta = null;
    this.go('catat');
  },
  bacaForm() {
    const d = this.draft;
    if (!$('f_jumlah')) return d;
    d.jumlah = angka($('f_jumlah').value); d.kat = $('f_kat').value;
    d.tanggal = $('f_tanggal').value; d.catatan = $('f_catatan').value; d.siklus = $('f_siklus').value;
    return d;
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
      '<label for="f_catatan">Catatan (opsional)</label><input id="f_catatan" maxlength="120" value="' + esc(d.catatan) + '" placeholder="mis. NPK 5 kg">' +
      '<button class="btn gold" data-do="simpan">Simpan</button>' +
      (edit ? '' : '<button class="btn" data-do="simpan-baru" style="width:100%;margin-top:10px">Simpan &amp; catat lagi</button>') +
      (edit ? '<button class="btn" data-do="dup-tx" style="width:100%;margin-top:10px">Duplikat sebagai transaksi baru</button>' : '') +
      '<button class="btn" data-do="batal" style="width:100%;margin-top:10px">Batal</button>' +
      (edit ? '<button class="btn danger" data-do="hapus-tx" style="width:100%;margin-top:10px">' + (this.hapusMinta === d.id ? 'Ketuk lagi untuk menghapus' : 'Hapus transaksi') + '</button>' : '') +
      '</section>';
  },

  /* ---------- tampilan: lainnya ---------- */
  vLainnya() {
    const kustom = this.data.kategori.filter((k) => !k.terhapus);
    return '<section><h2>Kategori sendiri</h2><p class="note">Kategori bawaan tidak bisa dihapus. Tambahkan yang khusus usaha Anda.</p>' +
      (kustom.length ? kustom.map((k) => '<div class="row"><span>' + esc(k.nama) + ' <span class="mu">· ' + (k.jenis === 'keluar' ? 'modal' : 'hasil') + '</span></span>' +
        '<button class="btn" data-do="hapus-kat" data-id="' + k.id + '" style="flex:0 0 auto;padding:4px 10px;font-size:12px">Hapus</button></div>').join('') : '') +
      '<label for="k_nama">Nama kategori</label><input id="k_nama" maxlength="40" placeholder="mis. Bambu penyangga">' +
      '<label for="k_jenis">Jenis</label><select id="k_jenis"><option value="keluar">Modal (keluar)</option><option value="masuk">Hasil (masuk)</option></select>' +
      '<button class="btn gold" data-do="tambah-kat">Tambah kategori</button></section>' +
      '<section><h2>Ekspor &amp; impor CSV</h2><p class="note">Kolom: tanggal, jenis (keluar/masuk), kategori, siklus, jumlah, catatan. Cadangan penuh (JSON) ada di Setelan.</p>' +
      '<div class="seg tiga" style="margin-top:12px"><button class="btn" data-do="ekspor-csv">Ekspor CSV</button><button class="btn" data-do="impor-csv">Impor teks</button>' +
      '<button class="btn" data-do="berkas-csv">Pilih berkas</button></div>' +
      '<input type="file" id="csvFile" accept=".csv,text/csv" hidden>' +
      '<textarea id="csvBox" class="settings-text" rows="6" aria-label="Data CSV" placeholder="Hasil ekspor muncul di sini; tempel CSV untuk impor"></textarea>' +
      '<div class="note" id="csvMsg" role="status" aria-live="polite" style="margin-top:8px"></div></section>' +
      '<section><h2>Rencana keuangan</h2><p class="note">Anggaran per siklus, arus kas dan proyeksi, aset dan penyusutan, balik modal, utang/piutang.</p><button class="btn" data-go="rencana" style="width:100%;margin-top:12px">Buka rencana keuangan</button></section>' +
      '<section><h2>Unit &amp; komoditas</h2><p class="note">Kelola lahan/unit dan jenis komoditas untuk siklus tanam.</p><button class="btn" data-go="master" style="width:100%;margin-top:12px">Kelola unit &amp; komoditas</button></section>' +
      '';
  },

  /* ---------- aksi ---------- */
  toast(t, aksi) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = t; el.setAttribute('role', 'status');
    if (aksi) { const b = document.createElement('button'); b.type = 'button'; b.className = 'toast-btn'; b.textContent = aksi.label; b.onclick = () => { el.remove(); aksi.fn(); }; el.appendChild(b); }
    document.body.appendChild(el); setTimeout(() => el.remove(), aksi ? 5000 : 1800);
  },
  aksi(a, el) {
    if (a === 'tukar-tgl') { const f = this.filter, x = f.dari; f.dari = f.sampai; f.sampai = x; this.go('transaksi', true); return; }
    if (Siklus.aksi(a, el)) return;
    if (a === 'jenis-keluar' || a === 'jenis-masuk') {
      const d = this.bacaForm(); d.jenis = a.slice(6); d.kat = this.lastKat[d.jenis] || this.kategori(d.jenis)[0].id;
      this.go('catat', true);
    } else if (a === 'batal') { this.draft = null; this.go(this.balik || 'beranda'); }
    else if (a === 'simpan' || a === 'simpan-baru') this.simpanTx(a === 'simpan-baru');
    else if (a === 'dup-tx') {
      const d = this.bacaForm(); this.draft = Object.assign({}, d, { id: null, tanggal: isoHari() }); this.hapusMinta = null;
      this.toast('Disalin sebagai transaksi baru — ubah bila perlu, lalu Simpan'); this.go('catat', true);
    } else if (a === 'hapus-tx') {
      const d = this.draft;
      if (this.hapusMinta === d.id) {
        const t = this.data.transaksi.find((x) => x.id === d.id);
        if (t) { t.terhapus = true; t.diubah = nowIso(); this.simpan(); }
        this.hapusMinta = null; this.draft = null; this.toast('Transaksi dihapus'); this.go(this.balik || 'beranda');
      } else { this.bacaForm(); this.hapusMinta = d.id; this.go('catat', true); }
    }
    else if (a === 'tambah-kat') this.tambahKat();
    else if (a === 'hapus-kat') {
      const k = this.data.kategori.find((x) => x.id === el.dataset.id);
      if (k) { k.terhapus = true; this.simpan(); this.go('lainnya', true); }
    }
    else if (a === 'ekspor-csv') this.eksporCsv();
    else if (a === 'impor-csv') this.imporCsv();
    else if (a === 'berkas-csv') $('csvFile').click();
    else if (a === 'contoh') this.contoh();
    else if (a === 'hapus-contoh') Contoh.hapus(el);
  },
  simpanTx(lagi) {
    const d = this.bacaForm();
    if (d.jumlah <= 0) { this.toast('Isi jumlah lebih dari 0'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.tanggal)) { this.toast('Isi tanggal'); return; }
    const kat = this.semuaKat().find((k) => k.id === d.kat);
    const sifat = d.jenis === 'keluar' ? (kat && kat.sifatBiaya) || 'variabel' : null;
    if (d.id) {
      const t = this.data.transaksi.find((x) => x.id === d.id);
      Object.assign(t, { tanggal: d.tanggal, jenis: d.jenis, kategoriId: d.kat, jumlah: d.jumlah, sifatBiaya: sifat, catatan: d.catatan, siklusId: d.siklus || null, diubah: nowIso() });
    } else {
      this.data.transaksi.push({ id: uid('t'), tanggal: d.tanggal, jenis: d.jenis, kategoriId: d.kat, jumlah: d.jumlah, siklusId: d.siklus || null,
        sifatBiaya: sifat, catatan: d.catatan, dibuat: nowIso(), diubah: nowIso(), terhapus: false });
    }
    this.lastKat[d.jenis] = d.kat;
    this.simpan();
    if (lagi) {
      this.draft = { id: null, jenis: d.jenis, jumlah: 0, kat: d.kat, tanggal: d.tanggal, catatan: '', siklus: d.siklus };
      this.toast('Tersimpan'); this.go('catat', true);
      const j = $('f_jumlah'); if (j) j.focus();
    } else { this.draft = null; this.toast('Tersimpan'); this.go(['transaksi', 'siklus-detail'].includes(this.balik) ? this.balik : 'beranda'); }
  },
  tambahKat() {
    const nama = $('k_nama').value.trim(), jenis = $('k_jenis').value;
    if (!nama) { this.toast('Isi nama kategori'); return; }
    if (this.kategori(jenis).some((k) => k.nama.toLowerCase() === nama.toLowerCase())) { this.toast('Kategori sudah ada'); return; }
    this.data.kategori.push({ id: uid('c'), nama, jenis, sifatBiaya: jenis === 'keluar' ? 'variabel' : null, bawaan: false, terhapus: false });
    this.simpan(); this.toast('Kategori ditambah'); this.go('lainnya', true);
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
      a.download = 'tani-transaksi-' + isoHari() + '.csv';
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
  imporCsv() {
    const rows = this.urai($('csvBox').value || '');
    if (rows.length < 2) { $('csvMsg').textContent = 'CSV kosong atau tanpa baris data.'; return; }
    const h = rows[0].map((x) => x.trim().toLowerCase()), ix = (n) => h.indexOf(n);
    if (ix('tanggal') < 0 || ix('jenis') < 0 || ix('jumlah') < 0) { $('csvMsg').textContent = 'Kolom tanggal, jenis, dan jumlah wajib ada.'; return; }
    let ok = 0, lewat = 0;
    rows.slice(1).forEach((r) => {
      const tgl = (r[ix('tanggal')] || '').trim(), jenis = (r[ix('jenis')] || '').trim().toLowerCase(), jml = angka(r[ix('jumlah')]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl) || (jenis !== 'keluar' && jenis !== 'masuk') || jml <= 0) { lewat++; return; }
      const nama = ix('kategori') >= 0 ? (r[ix('kategori')] || '').trim() : '';
      let k = this.kategori(jenis).find((x) => x.nama.toLowerCase() === nama.toLowerCase());
      if (!k && nama) { k = { id: uid('c'), nama, jenis, sifatBiaya: jenis === 'keluar' ? 'variabel' : null, bawaan: false, terhapus: false }; this.data.kategori.push(k); }
      if (!k) k = this.kategori(jenis).slice(-1)[0];
      this.data.transaksi.push({ id: uid('t'), tanggal: tgl, jenis, kategoriId: k.id, jumlah: jml, siklusId: null,
        sifatBiaya: jenis === 'keluar' ? k.sifatBiaya || 'variabel' : null, catatan: ix('catatan') >= 0 ? (r[ix('catatan')] || '').trim() : '',
        dibuat: nowIso(), diubah: nowIso(), terhapus: false });
      ok++;
    });
    this.simpan(); this.ringkas();
    $('csvMsg').textContent = ok + ' transaksi diimpor' + (lewat ? ', ' + lewat + ' baris dilewati (format tidak sesuai)' : '') + '.';
  },
  contoh() { Contoh.isi(); }
};

document.addEventListener('DOMContentLoaded', () => App.init());
