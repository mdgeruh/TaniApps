/* Tani Keuangan — Fase 3–4: laporan, dashboard, cetak laba-rugi, R/C, HPP, BEP, harga jual minimum (v0.1.014) */
const Analisa = {
  dim: 'siklus', per: 'semua',
  PER: [['bulan', 'Bulan ini'], ['tahun', 'Tahun ini'], ['semua', 'Semua']],
  DIM: [['siklus', 'Siklus'], ['komoditas', 'Komoditas'], ['unit', 'Unit']],
  masuk(tgl) {
    if (this.per === 'bulan') return tgl.slice(0, 7) === bulanIni();
    if (this.per === 'tahun') return tgl.slice(0, 4) === bulanIni().slice(0, 4);
    return true;
  },
  kunci(sid) {
    const s = Siklus.cari(sid);
    if (!s) return ['-', 'Tanpa siklus', ''];
    if (this.dim === 'siklus') return [s.id, Siklus.nama(s.id), s.mulai];
    if (this.dim === 'komoditas') { const k = Siklus.kom(s.komoditasId); return [s.komoditasId, k ? k.nama : '?', k ? k.satuan : '']; }
    const u = Siklus.unit(s.unitId); return [s.unitId, u ? u.nama : '?', ''];
  },
  hitung() {
    const g = {}, ambil = (sid) => {
      const [id, nama] = this.kunci(sid);
      return g[id] || (g[id] = { nama, modal: 0, hasil: 0, nonPanen: 0, alat: 0, tetap: 0, vari: 0, qty: 0, sat: new Set() });
    };
    App.aktif().filter((t) => this.masuk(t.tanggal)).forEach((t) => {
      const r = ambil(t.siklusId);
      if (t.jenis === 'masuk') { r.hasil += t.jumlah; if (t.kategoriId === 'jual-bibit' || t.kategoriId === 'subsidi') r.nonPanen += t.jumlah; }
      else { r.modal += t.jumlah; if (t.kategoriId === 'alat') r.alat += t.jumlah; if (t.sifatBiaya === 'tetap') r.tetap += t.jumlah; else r.vari += t.jumlah; }
    });
    Siklus.d().panen.filter((p) => !p.terhapus && this.masuk(p.tanggal)).forEach((p) => {
      const s = Siklus.cari(p.siklusId); if (!s) return;
      const r = ambil(p.siklusId); r.qty += Math.max(0, p.kuantitasKotor - p.susut);
      const k = Siklus.kom(s.komoditasId); if (k && k.satuan) r.sat.add(k.satuan);
    });
    const mg = Math.min(90, Math.max(1, Number(Setelan.get('margin')) || 30)) / 100;
    return Object.values(g).map((r) => {
      r.untung = r.hasil - r.modal;
      r.rc = r.modal ? r.hasil / r.modal : null;
      r.margin = r.hasil ? r.untung / r.hasil : null;
      r.satuan = r.sat.size === 1 ? [...r.sat][0] : 'satuan';
      r.hpp = r.qty ? (r.modal - r.alat) / r.qty : null; // pembelian alat tidak masuk HPP
      r.harga = r.qty && r.hasil - r.nonPanen > 0 ? (r.hasil - r.nonPanen) / r.qty : null; // penjualan bibit dan bantuan tidak ikut
      r.hmin = r.hpp ? r.hpp / (1 - mg) : null;
      const v = r.qty ? r.vari / r.qty : 0;
      r.bep = (r.harga && r.harga > v && r.qty) ? r.tetap / (r.harga - v) : null; // titik impas (satuan)
      r.mg = mg; return r;
    }).sort((a, b) => b.untung - a.untung);
  },
  chip(arr, cur, att) { return '<div class="seg sm" style="justify-content:flex-start;margin:6px 0">' + arr.map((x) => '<button type="button" class="btn' + (cur === x[0] ? ' on' : '') + '" data-' + att + '="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>'; },
  kartu(r, i) {
    const f = (n) => n === null ? '—' : rp(Math.round(n)), u = r.untung >= 0;
    const baris = (a, b) => '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>';
    return '<details class="lap-kartu"><summary><span class="lk-n">' + (i === 0 && r.untung > 0 ? '★ ' : '') + esc(r.nama) + '</span><span class="lk-v"><b class="' + (u ? 'up' : 'down') + '">' + (u ? '+' : '') + rp(r.untung) + '</b><span class="mu">R/C ' + (r.rc === null ? '—' : fmtRC(r.rc)) + '</span></span></summary><div class="lk-isi">' +
      baris('Modal / Hasil', rp(r.modal) + ' / ' + rp(r.hasil)) +
      baris('R/C ratio', r.rc === null ? '—' : fmtRC(r.rc) + (r.rc >= 1 ? ' (untung)' : ' (rugi)')) +
      baris('Margin', r.margin === null ? '—' : Math.round(r.margin * 100) + '%') +
      baris('Panen bersih', r.qty ? r.qty.toLocaleString('id-ID') + ' ' + esc(r.satuan) : 'belum ada') +
      baris('HPP per ' + esc(r.satuan), f(r.hpp)) +
      baris('Harga jual rata-rata', f(r.harga)) +
      baris('Harga min. (margin ' + Math.round(r.mg * 100) + '%)', f(r.hmin)) +
      baris('Titik impas (BEP)', r.bep === null ? (r.tetap ? 'butuh panen berharga' : 'tak ada biaya tetap') : Math.ceil(r.bep).toLocaleString('id-ID') + ' ' + esc(r.satuan) + ' · ' + rp(Math.round(r.bep * r.harga))) +
      '</div></details>';
  },
  vBanding() {
    const ke = (n) => { const x = new Date(); x.setDate(1); x.setMonth(x.getMonth() + n); return isoHari(x).slice(0, 7); };
    const per = (k) => { const tx = App.aktif().filter((t) => t.tanggal.slice(0, 7) === k), m = App.jumlah(tx, 'keluar'), h = App.jumlah(tx, 'masuk'); return { m, h, u: h - m, n: tx.length }; };
    const lalu = [-3, -2, -1].map((n) => per(ke(n))).filter((r) => r.n), ini = per(ke(0));
    if (!lalu.length) return '<section><h2>Bulan ini vs rata-rata 3 bulan</h2><p class="note">Belum ada transaksi di 3 bulan sebelumnya sebagai pembanding.</p></section>';
    const avg = (f) => lalu.reduce((s, r) => s + r[f], 0) / lalu.length;
    const baris = (nama, f, baikNaik) => { const a = avg(f), c = ini[f], d = c - a, pct = a ? Math.round(d / Math.abs(a) * 100) : null, baik = (d >= 0) === baikNaik;
      return '<div class="row"><span class="mu">' + nama + '</span><span>' + rp(c) + ' <span class="mu">vs ' + rp(Math.round(a)) + '</span> <span class="' + (d === 0 ? 'mu' : baik ? 'up' : 'down') + '">' + (d === 0 ? 'sama' : (d > 0 ? '▲' : '▼') + (pct === null ? '' : ' ' + Math.abs(pct) + '%')) + '</span></span></div>'; };
    return '<section><h2>Bulan ini vs rata-rata 3 bulan</h2>' + baris('Untung', 'u', true) + baris('Modal', 'm', false) + baris('Hasil', 'h', true) +
      '<p class="note">Rata-rata dari ' + lalu.length + ' bulan sebelumnya yang ada transaksinya. Hijau = membaik (modal turun dianggap baik).</p></section>';
  },
  simH: -10, simB: 0,
  vSimulasi() {
    const L = this.hitung().filter((r) => r.modal || r.hasil), fh = 1 + this.simH / 100, fb = 1 + this.simB / 100;
    if (!L.length) return '';
    const sim = (r) => { const h = r.hasil * fh, m = r.modal * fb; return { h, m, u: h - m, rc: m ? h / m : null }; };
    const T = L.reduce((a, r) => { const x = sim(r); return { u0: a.u0 + r.untung, u: a.u + x.u, h: a.h + x.h, m: a.m + x.m }; }, { u0: 0, u: 0, h: 0, m: 0 });
    const cls = (v) => (v >= 0 ? 'up' : 'down'), fmt = (v) => (v > 0 ? '+' : '') + this.simH;
    return '<section class="lap-sim"><details class="lap-det" id="lapSim"' + (this.simBuka ? ' open' : '') + '><summary>Simulasi: bagaimana jika…</summary><p class="note">Harga jual berubah</p>' +
      this.chip([[-20, '−20%'], [-10, '−10%'], [0, '0'], [10, '+10%'], [20, '+20%']], this.simH, 'sh') + '<p class="note">Biaya (modal) berubah</p>' +
      this.chip([[-10, '−10%'], [0, '0'], [10, '+10%'], [20, '+20%']], this.simB, 'sb') +
      '<div class="row"><span class="mu">Untung sekarang</span><span class="' + cls(T.u0) + '">' + rp(T.u0) + '</span></div>' +
      '<div class="row"><span class="mu">Untung simulasi</span><strong class="' + cls(T.u) + '">' + rp(Math.round(T.u)) + '</strong></div>' +
      '<div class="row"><span class="mu">R/C simulasi</span><span>' + (T.m ? fmtRC(T.h / T.m) : '—') + '</span></div>' +
      L.slice(0, 6).map((r) => { const x = sim(r), batas = r.hasil ? Math.round((1 - r.modal / r.hasil) * 100) : null;
        return '<div style="margin-top:10px"><strong>' + esc(r.nama) + '</strong><div class="row"><span class="mu">Untung</span><span>' + rp(r.untung) + ' → <span class="' + cls(x.u) + '">' + rp(Math.round(x.u)) + '</span></span></div>' +
          '<div class="row"><span class="mu">Harga boleh turun maks.</span><span>' + (batas === null ? '—' : batas > 0 ? batas + '% sebelum rugi' : '<span class="down">sudah rugi</span>') + '</span></div></div>'; }).join('') +
      '<p class="note">Hitungan sederhana: hasil dan modal dikali persen perubahan (volume dianggap tetap). Mengikuti periode dan pengelompokan di atas.</p></details></section>';
  },
  IKON: {
    cetak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v6H7z"/></svg>',
    xls: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10"/><path d="M8 11l4 4 4-4"/><path d="M5 19h14"/></svg>'
  },
  simBuka: false,
  /* Laporan satu halaman (v0.1.079): filter → ringkasan → tren → banding → komposisi → rincian → simulasi */
  vLaporan() {
    clearTimeout(this._cf); this._cf = null;
    const L = this.hitung(), T = L.reduce((a, r) => ({ m: a.m + r.modal, h: a.h + r.hasil }), { m: 0, h: 0 }), un = T.h - T.m;
    const lab = (arr, k) => (arr.find((x) => x[0] === k) || ['', ''])[1];
    const aksi = '<div class="lap-aksi no-print"><button type="button" class="ikon-btn" data-an="cetak" aria-label="Cetak semua bagian laporan atau simpan PDF">' + this.IKON.cetak + '<span>Cetak</span></button>' +
      '<button type="button" class="ikon-btn" data-an="xls" aria-label="Ekspor ke Excel">' + this.IKON.xls + '<span>Excel</span></button></div>';
    const filter = '<section class="lap-filter no-print"><div class="lap-fl">Periode</div>' + this.chip(this.PER, this.per, 'lp') + '<div class="lap-fl">Kelompokkan per</div>' + this.chip(this.DIM, this.dim, 'ld') + '</section>';
    const kpi = '<section><div class="lap-untung"><span class="mu">Untung / rugi · ' + (this.per === 'semua' ? 'semua waktu' : lab(this.PER, this.per).toLowerCase()) + '</span><strong class="' + (un >= 0 ? 'up' : 'down') + '">' + rp(un) + '</strong></div>' +
      '<div class="lap-kpi"><div><span class="mu">Modal</span><b>' + rp(T.m) + '</b></div><div><span class="mu">Hasil</span><b>' + rp(T.h) + '</b></div><div><span class="mu">R/C ratio</span><b>' + (T.m ? fmtRC(T.h / T.m) : '—') + '</b></div></div></section>';
    const rinci = '<section class="lap-rinci"><h2>Rincian per ' + lab(this.DIM, this.dim).toLowerCase() + '</h2><p class="note">Urut dari untung terbesar; ketuk satu baris untuk detail. HPP = modal (di luar pembelian alat) ÷ panen bersih; harga rata-rata tidak menghitung penjualan bibit dan bantuan; BEP dihitung dari biaya tetap, harga rata-rata, dan biaya variabel per satuan.</p>' +
      (L.length ? L.map((r, i) => this.kartu(r, i)).join('') : '<p class="note">Belum ada transaksi pada periode ini. Catat modal/hasil atau isi data contoh di Beranda.</p>') + '</section>';
    return aksi + filter + kpi + this.vGrafik() + this.vBanding() + '<section class="dash"><h2>Komposisi modal</h2>' + this.komposisi() + '</section>' + rinci + this.vSimulasi();
  },
  /* ---------- Fase 4: dashboard, cetak, Excel ---------- */
  tren() {
    const d = new Date(), out = [];
    for (let i = 5; i >= 0; i--) {
      const x = new Date(d.getFullYear(), d.getMonth() - i, 1), k = isoHari(x).slice(0, 7);
      const tx = App.aktif().filter((t) => t.tanggal.slice(0, 7) === k);
      out.push({ n: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][x.getMonth()], m: App.jumlah(tx, 'keluar'), h: App.jumlah(tx, 'masuk') });
    }
    return out;
  },
  svgTren() {
    const T = this.tren(), mx = Math.max(1, ...T.map((r) => Math.max(r.m, r.h))), H = 110, w = 50;
    const bar = (v, x, c) => '<rect x="' + x + '" y="' + (H - v / mx * H + 8) + '" width="18" height="' + Math.max(v ? 2 : 0, v / mx * H) + '" rx="3" fill="var(' + c + ')"/>';
    return '<svg viewBox="0 0 320 146" width="100%" role="img" aria-label="Tren modal dan hasil 6 bulan">' + T.map((r, i) => bar(r.m, i * w + 6, '--loss') + bar(r.h, i * w + 26, '--fill') +
      '<text x="' + (i * w + 25) + '" y="140" text-anchor="middle" font-size="10" fill="var(--paper-faint)">' + r.n + '</text>').join('') + '</svg>' +
      '<p class="note"><span style="color:var(--loss)">■</span> Modal &nbsp; <span style="color:var(--fill)">■</span> Hasil · 6 bulan terakhir</p>';
  },
  komposisi() {
    const per = {}; let tot = 0;
    App.aktif().filter((t) => t.jenis === 'keluar' && this.masuk(t.tanggal)).forEach((t) => { per[t.kategoriId] = (per[t.kategoriId] || 0) + t.jumlah; tot += t.jumlah; });
    if (!tot) return '<p class="note">Belum ada modal pada periode ini.</p>';
    return Object.keys(per).sort((a, b) => per[b] - per[a]).slice(0, 6).map((k) => { const p = Math.round(per[k] / tot * 100);
      return '<div class="bar-row"><div class="bar-top"><span>' + esc(App.namaKat(k)) + '</span><span class="mu">' + p + '% · ' + rp(per[k]) + '</span></div><div class="bar"><i style="width:' + p + '%"></i></div></div>'; }).join('');
  },
  topKom() {
    const keep = this.dim; this.dim = 'komoditas'; const L = this.hitung().filter((r) => r.nama !== 'Tanpa siklus').slice(0, 3); this.dim = keep;
    if (!L.length) return '<p class="note">Belum ada komoditas bersiklus pada periode ini.</p>';
    return L.map((r, i) => '<div class="row"><span>' + (i + 1) + '. ' + esc(r.nama) + '</span><strong class="' + (r.untung >= 0 ? 'up' : 'down') + '">' + rp(r.untung) + '</strong></div>').join('');
  },
  vDashboard() {
    return this.vGrafik() + '<section class="dash"><h2>Tren 6 bulan (batang)</h2>' + this.svgTren() + '</section>' +
      '<section class="dash"><h2>Komposisi modal</h2>' + this.komposisi() + '</section>' +
      '<section class="dash"><h2>Komoditas teratas</h2>' + this.topKom() + '</section>';
  },
  /* ---------- Cetak polos (v0.1.074): dokumen khusus cetak, terlepas dari tema, efek kaca, dan tampilan layar ---------- */
  cetak() { this.cetakPasang(); window.print(); },
  cetakAman(btn) { // mode Tersembunyi: kertas selalu memuat angka lengkap, jadi minta ketukan kedua
    const lb = btn.querySelector('span');
    if (Samar.aktif() && !this._cf) {
      if (lb) lb.textContent = 'Ketuk lagi';
      App.toast('Angka akan tercetak lengkap — ketuk Cetak sekali lagi');
      this._cf = setTimeout(() => { this._cf = null; if (lb && lb.isConnected) lb.textContent = 'Cetak'; }, 4000); return;
    }
    clearTimeout(this._cf); this._cf = null; if (lb) lb.textContent = 'Cetak'; this.cetak();
  },
  BLN: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  namaPer() { const n = new Date(); return this.per === 'bulan' ? 'Bulan ini (' + this.BLN[n.getMonth()] + ' ' + n.getFullYear() + ')' : this.per === 'tahun' ? 'Tahun ini (' + n.getFullYear() + ')' : 'Semua periode'; },
  cetakKop(judul, baris2) {
    return '<div class="ct-kop"><h1>Laporan Usaha Tani</h1><p class="ct-sub">' + judul + '</p><table class="ct-meta"><tr><th>Periode</th><td>' + this.namaPer() + '</td><th>Dicetak</th><td>' + Setelan.tgl(isoHari()) + '</td></tr>' +
      '<tr><th>' + baris2[0] + '</th><td>' + baris2[1] + '</td><th>Aplikasi</th><td>Tani Keuangan v' + VERSI + '</td></tr></table></div>';
  },
  cetakRingkasan(k) { // k === false: tanpa kop (dipakai cetakSemua)
    const L = this.hitung(), T = L.reduce((a, r) => ({ m: a.m + r.modal, h: a.h + r.hasil }), { m: 0, h: 0 }), un = T.h - T.m;
    const kv = (k, v) => '<tr><th>' + k + '</th><td class="n">' + v + '</td></tr>';
    return (k === false ? '' : this.cetakKop('Ringkasan', ['Cakupan', 'Seluruh transaksi'])) +
      '<div class="ct-bag"><h2>Untung / rugi</h2><table class="ct-tab ct-kv">' + kv('Untung / rugi', '<b>' + rp(un) + '</b>') + kv('R/C ratio', T.m ? fmtRC(T.h / T.m) : '—') + kv('Modal', rp(T.m)) + kv('Hasil', rp(T.h)) + '</table></div>' + this.cetakBanding();
  },
  cetakBanding() {
    const ke = (n) => { const x = new Date(); x.setDate(1); x.setMonth(x.getMonth() + n); return isoHari(x).slice(0, 7); };
    const per = (k) => { const tx = App.aktif().filter((t) => t.tanggal.slice(0, 7) === k), m = App.jumlah(tx, 'keluar'), h = App.jumlah(tx, 'masuk'); return { m, h, u: h - m, n: tx.length }; };
    const lalu = [-3, -2, -1].map((n) => per(ke(n))).filter((r) => r.n), ini = per(ke(0));
    if (!lalu.length) return '<div class="ct-bag"><h2>Bulan ini vs rata-rata 3 bulan</h2><p class="ct-cat">Belum ada transaksi di 3 bulan sebelumnya sebagai pembanding.</p></div>';
    const avg = (f) => lalu.reduce((a, r) => a + r[f], 0) / lalu.length;
    const baris = (nama, f, baikNaik) => { const a = avg(f), c = ini[f], d = c - a, pct = a ? Math.round(d / Math.abs(a) * 100) : null, baik = (d >= 0) === baikNaik;
      const t = d === 0 ? 'sama' : (pct === null ? '—' : (d > 0 ? '+' : '−') + Math.abs(pct) + '%') + (baik ? ' (membaik)' : ' (memburuk)');
      return '<tr><td>' + nama + '</td><td class="n">' + rp(c) + '</td><td class="n">' + rp(Math.round(a)) + '</td><td class="n">' + t + '</td></tr>'; };
    return '<div class="ct-bag"><h2>Bulan ini vs rata-rata 3 bulan</h2><table class="ct-tab"><thead><tr><th>Ukuran</th><th class="n">Bulan ini</th><th class="n">Rata-rata ' + lalu.length + ' bulan</th><th class="n">Selisih</th></tr></thead><tbody>' +
      baris('Untung', 'u', true) + baris('Modal', 'm', false) + baris('Hasil', 'h', true) + '</tbody></table><p class="ct-cat">Rata-rata dari ' + lalu.length + ' bulan sebelumnya yang ada transaksinya. Membaik = untung atau hasil naik, atau modal turun.</p></div>';
  },
  cetakGrafik(k) {
    const T = this.bulanN(this.rentang), N = T.length, W = 700, X0 = 44, X1 = 694, Y0 = 16, Y1 = 170;
    const mx = Math.max(1, ...T.map((r) => Math.max(r.m, r.h))), yy = (v) => Y1 - v / mx * (Y1 - Y0), gw = (X1 - X0) / N, bw = Math.min(22, gw * 0.36), lintas = T[0].thn !== T[N - 1].thn;
    const grid = [0, 1, 2, 3].map((i) => { const v = mx * i / 3, y = yy(v).toFixed(1);
      return '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + y + '" y2="' + y + '" stroke="#bbb" stroke-width=".6"/><text x="' + (X0 - 5) + '" y="' + (Number(y) + 3) + '" text-anchor="end" font-size="8.5" fill="#333">' + this.ringkasAngka(v) + '</text>'; }).join('');
    const bar = (v, x, isi) => { const h = v / mx * (Y1 - Y0);
      return '<rect x="' + x.toFixed(1) + '" y="' + (Y1 - Math.max(v ? 1.5 : 0, h)).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(v ? 1.5 : 0, h).toFixed(1) + '" fill="' + isi + '" stroke="#000" stroke-width=".8"/>' +
        (v ? '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (Y1 - h - 3).toFixed(1) + '" text-anchor="middle" font-size="7.5" fill="#000">' + this.ringkasAngka(v) + '</text>' : ''); };
    const batang = T.map((r, i) => { const cx = X0 + gw * (i + 0.5);
      return bar(r.h, cx - bw - 1, '#444') + bar(r.m, cx + 1, 'url(#ct-h)') + '<text x="' + cx.toFixed(1) + '" y="184" text-anchor="middle" font-size="9" fill="#000">' + r.n + (N > 6 || lintas ? ' ' + String(r.thn).slice(2) : '') + '</text>'; }).join('');
    const tot = T.reduce((a, r) => ({ h: a.h + r.h, m: a.m + r.m }), { h: 0, m: 0 });
    const svg = '<svg viewBox="0 0 ' + W + ' 192" width="100%" role="img" aria-label="Grafik batang hasil dan modal per bulan"><defs><pattern id="ct-h" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#fff"/><line x1="0" y1="0" x2="0" y2="4" stroke="#000" stroke-width="1.4"/></pattern></defs>' + grid + batang + '</svg>';
    const leg = '<p class="ct-cat"><svg width="12" height="9" aria-hidden="true"><rect x=".5" y=".5" width="11" height="8" fill="#444" stroke="#000"/></svg> Hasil &nbsp;&nbsp; <svg width="12" height="9" aria-hidden="true"><rect x=".5" y=".5" width="11" height="8" fill="url(#ct-h)" stroke="#000"/></svg> Modal · tren ' + N + ' bulan terakhir (tidak dipengaruhi pilihan periode)</p>';
    const tab = '<table class="ct-tab"><thead><tr><th>Bulan</th><th class="n">Hasil</th><th class="n">Modal</th><th class="n">Untung</th></tr></thead><tbody>' +
      T.map((r) => '<tr><td>' + r.n + ' ' + r.thn + '</td><td class="n">' + rp(r.h) + '</td><td class="n">' + rp(r.m) + '</td><td class="n">' + rp(r.h - r.m) + '</td></tr>').join('') +
      '<tr class="ct-tot"><td>Total</td><td class="n">' + rp(tot.h) + '</td><td class="n">' + rp(tot.m) + '</td><td class="n">' + rp(tot.h - tot.m) + '</td></tr></tbody></table>';
    return (k === false ? '' : this.cetakKop('Grafik', ['Tren', N + ' bulan terakhir'])) + '<div class="ct-bag"><h2>Tren hasil dan modal</h2>' + svg + leg + tab + '</div>' + this.cetakKomposisi() + this.cetakTop();
  },
  cetakKomposisi() {
    const per = {}; let tot = 0;
    App.aktif().filter((t) => t.jenis === 'keluar' && this.masuk(t.tanggal)).forEach((t) => { per[t.kategoriId] = (per[t.kategoriId] || 0) + t.jumlah; tot += t.jumlah; });
    if (!tot) return '<div class="ct-bag"><h2>Komposisi modal</h2><p class="ct-cat">Belum ada modal pada periode ini.</p></div>';
    const ks = Object.keys(per).sort((a, b) => per[b] - per[a]), sisa = ks.slice(6).reduce((a, k) => a + per[k], 0);
    const baris = (nama, v) => { const p = Math.round(v / tot * 100); return '<tr><td>' + esc(nama) + '</td><td class="n">' + p + '%</td><td class="n">' + rp(v) + '</td><td class="ct-bc"><span class="ct-bar"><i style="width:' + p + '%"></i></span></td></tr>'; };
    return '<div class="ct-bag"><h2>Komposisi modal</h2><p class="ct-cat">Periode: ' + this.namaPer() + '</p><table class="ct-tab"><thead><tr><th>Kategori</th><th class="n">Porsi</th><th class="n">Jumlah</th><th></th></tr></thead><tbody>' +
      ks.slice(0, 6).map((k) => baris(App.namaKat(k), per[k])).join('') + (sisa ? baris('Lainnya', sisa) : '') + '<tr class="ct-tot"><td>Total modal</td><td class="n">100%</td><td class="n">' + rp(tot) + '</td><td></td></tr></tbody></table></div>';
  },
  cetakTop() {
    const keep = this.dim; this.dim = 'komoditas'; const L = this.hitung().filter((r) => r.nama !== 'Tanpa siklus').slice(0, 3); this.dim = keep;
    if (!L.length) return '<div class="ct-bag"><h2>Komoditas teratas</h2><p class="ct-cat">Belum ada komoditas bersiklus pada periode ini.</p></div>';
    return '<div class="ct-bag"><h2>Komoditas teratas</h2><p class="ct-cat">Periode: ' + this.namaPer() + '</p><table class="ct-tab"><thead><tr><th>No.</th><th>Komoditas</th><th class="n">Untung</th></tr></thead><tbody>' +
      L.map((r, i) => '<tr><td>' + (i + 1) + '</td><td>' + esc(r.nama) + '</td><td class="n">' + rp(r.untung) + '</td></tr>').join('') + '</tbody></table></div>';
  },
  cetakRincian(k) {
    const L = this.hitung(), dim = (this.DIM.find((x) => x[0] === this.dim) || [0, ''])[1], kop = k === false ? '' : this.cetakKop('Rincian per ' + dim.toLowerCase(), ['Dikelompokkan per', dim]);
    if (!L.length) return kop + '<p class="ct-cat">Belum ada transaksi pada periode ini.</p>';
    const T = L.reduce((a, r) => ({ m: a.m + r.modal, h: a.h + r.hasil }), { m: 0, h: 0 }), n = (v) => '<td class="n">' + v + '</td>';
    const fs = (v, r) => v === null ? '—' : rp(Math.round(v)) + '/' + esc(r.satuan);
    const mg = Math.round(L[0].mg * 100);
    return kop + '<table class="ct-tab ct-rinci"><thead><tr><th>' + dim + '</th><th class="n">Modal</th><th class="n">Hasil</th><th class="n">Untung</th><th class="n">R/C</th><th class="n">Panen bersih</th><th class="n">HPP</th><th class="n">Harga rata-rata</th><th class="n">Harga min. (margin ' + mg + '%)</th><th class="n">BEP</th></tr></thead><tbody>' +
      L.map((r, i) => '<tr><td>' + (i === 0 && r.untung > 0 ? '★ ' : '') + esc(r.nama) + '</td>' + n(rp(r.modal)) + n(rp(r.hasil)) + n('<b>' + (r.untung > 0 ? '+' : '') + rp(r.untung) + '</b>') + n(r.rc === null ? '—' : fmtRC(r.rc)) +
        n(r.qty ? r.qty.toLocaleString('id-ID') + ' ' + esc(r.satuan) : '—') + n(fs(r.hpp, r)) + n(fs(r.harga, r)) + n(fs(r.hmin, r)) + n(r.bep === null ? '—' : Math.ceil(r.bep).toLocaleString('id-ID') + ' ' + esc(r.satuan)) + '</tr>').join('') +
      '<tr class="ct-tot"><td>Total</td>' + n(rp(T.m)) + n(rp(T.h)) + n('<b>' + rp(T.h - T.m) + '</b>') + n(T.m ? fmtRC(T.h / T.m) : '—') + '<td></td><td></td><td></td><td></td><td></td></tr></tbody></table>' +
      '<p class="ct-cat">★ = untung terbesar. HPP = modal (di luar pembelian alat) ÷ panen bersih. Harga rata-rata tidak menghitung penjualan bibit dan bantuan. Harga min. = HPP ÷ (1 − margin). BEP = titik impas dari biaya tetap dan biaya variabel per satuan. — = belum ada data (mis. belum ada panen berharga atau tidak ada biaya tetap).</p>';
  },
  cetakSemua() { // v0.1.075: satu dokumen untuk ketiga tab (Ringkasan, Grafik, Rincian), satu kop
    const dim = (this.DIM.find((x) => x[0] === this.dim) || [0, ''])[1].toLowerCase();
    const bab = (n, t, isi, cls) => '<div class="ct-bab-wrap' + (cls ? ' ' + cls : '') + '"><h2 class="ct-bab">' + n + '. ' + t + '</h2>' + isi + '</div>';
    return this.cetakKop('Ringkasan, grafik, dan rincian', ['Isi', 'Ringkasan · Grafik · Rincian per ' + dim]) +
      bab(1, 'Ringkasan', this.cetakRingkasan(false)) + bab(2, 'Grafik', this.cetakGrafik(false)) + bab(3, 'Rincian per ' + dim, this.cetakRincian(false), 'ct-rincian-bag');
  },
  cetakPasang() { // dipanggil sebelum mencetak: hanya halaman Laporan yang punya dokumen cetak sendiri
    this.cetakLepas(); if (App.tab !== 'laporan') return;
    const d = document.createElement('div'); d.id = 'cetak-lap'; d.className = 'ct-semua'; d.innerHTML = this.cetakSemua();
    document.body.appendChild(d); document.documentElement.classList.add('cetak-lap');
  },
  cetakLepas() { const d = document.getElementById('cetak-lap'); if (d) d.remove(); document.documentElement.classList.remove('cetak-lap'); },
  eksporXls() {
    const L = this.hitung(), n = (v) => v === null ? '' : Math.round(v * 100) / 100;
    const h = '<table border="1"><tr><th>Nama</th><th>Modal</th><th>Hasil</th><th>Untung</th><th>R/C</th><th>Panen bersih</th><th>HPP</th><th>Harga rata-rata</th><th>Harga min</th><th>BEP (satuan)</th></tr>' +
      L.map((r) => '<tr><td>' + esc(r.nama) + '</td>' + [r.modal, r.hasil, r.untung, r.rc, r.qty, r.hpp, r.harga, r.hmin, r.bep].map((v) => '<td>' + n(v) + '</td>').join('') + '</tr>').join('') + '</table>';
    const blob = new Blob(['\ufeff<html><head><meta charset="utf-8"></head><body>' + h + '</body></html>'], { type: 'application/vnd.ms-excel' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'laporan-tani-' + this.per + '-' + this.dim + '.xls';
    document.body.appendChild(a); a.click(); a.remove();
  },
  /* ---------- grafik garis halus + tooltip (v0.1.014) ---------- */
  rentang: 6, _pts: [],
  bulanN(n) {
    const d = new Date(), B = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'], out = [];
    for (let i = n - 1; i >= 0; i--) {
      const x = new Date(d.getFullYear(), d.getMonth() - i, 1), k = isoHari(x).slice(0, 7);
      const tx = App.aktif().filter((t) => t.tanggal.slice(0, 7) === k);
      out.push({ n: B[x.getMonth()], thn: x.getFullYear(), m: App.jumlah(tx, 'keluar'), h: App.jumlah(tx, 'masuk') });
    }
    return out;
  },
  ringkasAngka(n) { n = Math.abs(n); return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.', ',') + ' jt' : n >= 1e3 ? Math.round(n / 1e3) + ' rb' : String(Math.round(n)); },
  /* Kurva kubik monoton (Fritsch–Butland, ujung pchip): mulus (kemiringan kontinu di tiap titik), melewati semua titik data,
     tidak pernah melampaui nilai titik tetangganya (tanpa lonjakan di atas nol atau di luar sumbu), tanpa tekukan di puncak/lembah. */
  kurva(P) {
    const n = P.length, f = (v) => (Math.round(v * 100) / 100), M = 'M' + f(P[0][0]) + ' ' + f(P[0][1]);
    if (n < 2) return M;
    const h = [], m = [];
    for (let i = 0; i < n - 1; i++) { h[i] = (P[i + 1][0] - P[i][0]) || 1e-6; m[i] = (P[i + 1][1] - P[i][1]) / h[i]; }
    const t = new Array(n);
    if (n === 2) { t[0] = t[1] = m[0]; }
    else {
      for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : 3 * (h[i - 1] + h[i]) / ((2 * h[i] + h[i - 1]) / m[i - 1] + (h[i] + 2 * h[i - 1]) / m[i]);
      const ujung = (h0, h1, m0, m1) => {
        let d = ((2 * h0 + h1) * m0 - h0 * m1) / (h0 + h1);
        if (d * m0 <= 0) d = 0; else if (m0 * m1 <= 0 && Math.abs(d) > 3 * Math.abs(m0)) d = 3 * m0;
        return d;
      };
      t[0] = ujung(h[0], h[1], m[0], m[1]);
      t[n - 1] = ujung(h[n - 2], h[n - 3], m[n - 2], m[n - 3]);
    }
    let d = M;
    for (let i = 0; i < n - 1; i++) {
      const a = P[i], b = P[i + 1], k = h[i] / 3;
      d += ' C' + f(a[0] + k) + ' ' + f(a[1] + t[i] * k) + ' ' + f(b[0] - k) + ' ' + f(b[1] - t[i + 1] * k) + ' ' + f(b[0]) + ' ' + f(b[1]);
    }
    return d;
  },
  vGrafik() {
    const T = this.bulanN(this.rentang), W = 320, X0 = 38, X1 = 308, Y0 = 12, Y1 = 150;
    const mx = Math.max(1, ...T.map((r) => Math.max(r.m, r.h))), tinggi = (v) => Y1 - v / mx * (Y1 - Y0);
    const px = (i) => X0 + (T.length === 1 ? 0 : i * (X1 - X0) / (T.length - 1));
    const H = T.map((r, i) => [px(i), tinggi(r.h)]), M = T.map((r, i) => [px(i), tinggi(r.m)]);
    this._pts = T.map((r, i) => ({ x: px(i), yh: H[i][1], ym: M[i][1], n: r.n + ' ' + r.thn, h: r.h, m: r.m }));
    const grid = [0, 1, 2, 3].map((i) => { const v = mx * i / 3, y = tinggi(v);
      return '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + y + '" y2="' + y + '" stroke="var(--line-soft)"/><text x="' + (X0 - 5) + '" y="' + (y + 3) + '" text-anchor="end" font-size="9" fill="var(--paper-faint)">' + this.ringkasAngka(v) + '</text>'; }).join('');
    const langkah = Math.ceil(T.length / 6);
    const sumbu = T.map((r, i) => i % langkah === 0 ? '<text x="' + px(i) + '" y="168" text-anchor="middle" font-size="9" fill="var(--paper-faint)">' + r.n + '</text>' : '').join('');
    const kH = this.kurva(H), area = kH + ' L' + X1 + ' ' + Y1 + ' L' + X0 + ' ' + Y1 + ' Z';
    const tot = T.reduce((a, r) => ({ h: a.h + r.h, m: a.m + r.m }), { h: 0, m: 0 }), un = tot.h - tot.m;
    const tabel = '<div class="gulir"><table class="lg-tab"><tr><th>Bulan</th><th>Hasil</th><th>Modal</th><th>Untung</th></tr>' + T.map((r) => '<tr><td>' + r.n + ' ' + r.thn + '</td><td>' + rp(r.h) + '</td><td>' + rp(r.m) + '</td><td class="' + (r.h >= r.m ? 'up' : 'down') + '">' + rp(r.h - r.m) + '</td></tr>').join('') + '</table></div>';
    return '<section class="dash"><h2>Tren hasil / modal</h2>' + this.chip([[6, '6 bulan'], [12, '12 bulan']], this.rentang, 'lr') +
      '<div class="lg-stat"><div><div class="note">UNTUNG BERSIH</div><strong class="' + (un >= 0 ? 'up' : 'down') + '">' + rp(un) + '</strong></div><div><div class="note">TOTAL HASIL</div><strong>' + rp(tot.h) + '</strong></div><div><div class="note">TOTAL MODAL</div><strong>' + rp(tot.m) + '</strong></div></div>' +
      '<div class="lg-wrap"><svg class="lg-svg" viewBox="0 0 ' + W + ' 176" width="100%" role="img" aria-label="Tren hasil dan modal"><defs><linearGradient id="lgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--fill)" stop-opacity=".45"/><stop offset="1" stop-color="var(--fill)" stop-opacity="0"/></linearGradient></defs>' +
      grid + '<path d="' + area + '" fill="url(#lgA)"/><path d="' + kH + '" fill="none" stroke="var(--fill)" stroke-width="2.2" stroke-linecap="round"/><path d="' + this.kurva(M) + '" fill="none" stroke="var(--loss)" stroke-width="2.2" stroke-linecap="round"/>' + sumbu +
      '<line class="lg-x" y1="' + Y0 + '" y2="' + Y1 + '" stroke="var(--paper-faint)" stroke-dasharray="2 3" visibility="hidden"/><circle class="lg-dh" r="3.6" fill="var(--fill)" stroke="var(--ink)" visibility="hidden"/><circle class="lg-dm" r="3.6" fill="var(--loss)" stroke="var(--ink)" visibility="hidden"/></svg><div class="lg-tip" hidden></div></div>' +
      '<p class="note lg-leg"><span style="color:var(--fill)">●</span> Hasil &nbsp; <span style="color:var(--loss)">●</span> Modal · sentuh grafik untuk melihat angka</p>' +
      '<details class="lg-detail"><summary>Tabel angka grafik</summary>' + tabel + '</details></section>';
  },
  sentuh(e) {
    const svg = e.target.closest && e.target.closest('.lg-svg'); if (!svg || !this._pts.length) return;
    const r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * 320;
    let k = 0; this._pts.forEach((p, i) => { if (Math.abs(p.x - vx) < Math.abs(this._pts[k].x - vx)) k = i; });
    const p = this._pts[k], q = (c) => svg.querySelector(c), tip = svg.parentNode.querySelector('.lg-tip');
    const x = q('.lg-x'); x.setAttribute('x1', p.x); x.setAttribute('x2', p.x); x.setAttribute('visibility', 'visible');
    [['.lg-dh', p.yh], ['.lg-dm', p.ym]].forEach((a) => { const c = q(a[0]); c.setAttribute('cx', p.x); c.setAttribute('cy', a[1]); c.setAttribute('visibility', 'visible'); });
    tip.hidden = false;
    tip.innerHTML = '<b>' + p.n + '</b><br><span style="color:var(--fill)">Hasil: ' + rp(p.h) + '</span><br><span style="color:var(--loss)">Modal: ' + rp(p.m) + '</span>';
    const pct = p.x / 320 * 100; tip.style.left = Math.min(Math.max(pct, 24), 76) + '%';
  },
  klik(e) {
    const an = e.target.closest('[data-an]'); if (an) { if (an.dataset.an === 'cetak') this.cetakAman(an); else this.eksporXls(); return true; }
    const lr = e.target.closest('[data-lr]'); if (lr) { this.rentang = Number(lr.dataset.lr); App.go(App.tab === 'beranda' ? 'beranda' : 'laporan', true); return true; }
    const sh = e.target.closest('[data-sh]'), sbb = e.target.closest('[data-sb]');
    if (sh || sbb) { if (sh) this.simH = Number(sh.dataset.sh); else this.simB = Number(sbb.dataset.sb); App.go('laporan', true); return true; }
    const p = e.target.closest('[data-lp]'), d = e.target.closest('[data-ld]');
    if (p) this.per = p.dataset.lp; else if (d) this.dim = d.dataset.ld; else return false;
    App.go('laporan', true); return true;
  }
};

document.addEventListener('pointerdown', (e) => Analisa.sentuh(e));
document.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons || e.pressure) Analisa.sentuh(e); });

document.addEventListener('toggle', (e) => { if (e.target && e.target.id === 'lapSim') Analisa.simBuka = e.target.open; }, true);
