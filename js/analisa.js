/* Buku Kebun — Fase 3–4: laporan, dashboard, cetak laba-rugi, R/C, HPP, BEP, harga jual minimum (v0.1.014) */
const Analisa = {
  dim: 'siklus', per: 'semua', dari: '', sampai: '', tanpaGaji: false, /* v0.1.182: HPP dan BEP tanpa gaji pemilik */ /* v0.1.178: periode 'lalu' dan 'kustom' (Dari–Sampai) */
  PER: [['bulan', 'Bulan ini'], ['lalu', 'Bulan lalu'], ['tahun', 'Tahun ini'], ['semua', 'Semua'], ['kustom', 'Pilih tanggal']],
  DIM: [['siklus', 'Siklus'], ['komoditas', 'Komoditas'], ['unit', 'Unit']],
  masuk(tgl) {
    if (this.per === 'bulan') return tgl.slice(0, 7) === bulanIni();
    if (this.per === 'lalu') return tgl.slice(0, 7) === bulanLalu();
    if (this.per === 'kustom') { const [a, b] = this.rentangTgl(); return (!a || tgl >= a) && (!b || tgl <= b); }
    if (this.per === 'tahun') return tgl.slice(0, 4) === bulanIni().slice(0, 4);
    return true;
  },
  /* Dari/Sampai boleh terbalik: dipakai urutan yang benar; kosong = tanpa batas di sisi itu */
  rentangTgl() { const a = this.dari, b = this.sampai; return a && b && a > b ? [b, a] : [a, b]; },
  teksRentang() { const [a, b] = this.rentangTgl(); return a && b ? this.tglP(a) + ' – ' + this.tglP(b) : a ? 'sejak ' + this.tglP(a) : b ? 'sampai ' + this.tglP(b) : 'semua tanggal'; },
  kunci(sid) {
    const s = Siklus.cari(sid);
    if (!s) return ['-', 'Tanpa siklus', ''];
    if (this.dim === 'siklus') return [s.id, Siklus.nama(s.id), s.mulai, s.status];
    if (this.dim === 'komoditas') { const k = Siklus.kom(s.komoditasId); return [s.komoditasId, k ? k.nama : '?', k ? k.satuan : '']; }
    const u = Siklus.unit(s.unitId); return [s.unitId, u ? u.nama : '?', ''];
  },
  hitung() {
    const g = {}, ambil = (sid) => {
      const [id, nama, mulai, status] = this.kunci(sid), sk = this.dim === 'siklus' && id !== '-';
      return g[id] || (g[id] = { sid: sk ? id : '', uid: this.dim === 'unit' && id !== '-' ? id : '', nama, mulai: sk ? mulai : '', status: sk ? status : '', modal: 0, hasil: 0, nonPanen: 0, alat: 0, gaji: 0, gTetap: 0, gVari: 0, tetap: 0, vari: 0, qty: 0, sat: new Set() });
    };
    App.aktif().filter((t) => this.masuk(t.tanggal)).forEach((t) => {
      const r = ambil(t.siklusId);
      if (t.jenis === 'masuk') { r.hasil += t.jumlah; if (t.kategoriId === 'jual-bibit' || t.kategoriId === 'subsidi') r.nonPanen += t.jumlah; }
      else { r.modal += t.jumlah; if (t.kategoriId === 'alat') r.alat += t.jumlah; if (t.kategoriId === 'gaji') { r.gaji += t.jumlah; if (t.sifatBiaya === 'tetap') r.gTetap += t.jumlah; else r.gVari += t.jumlah; } if (t.sifatBiaya === 'tetap') r.tetap += t.jumlah; else r.vari += t.jumlah; }
    });
    Siklus.d().panen.filter((p) => !p.terhapus && this.masuk(p.tanggal)).forEach((p) => {
      const s = Siklus.cari(p.siklusId); if (!s) return;
      const r = ambil(p.siklusId); r.qty += Math.max(0, p.kuantitasKotor - p.susut);
      const k = Siklus.kom(s.komoditasId); if (k && k.satuan) r.sat.add(k.satuan);
    });
    const mg = Math.min(90, Math.max(1, Number(Setelan.get('margin')) || 30)) / 100, [pa, pb] = this.batasPeriode(), hariIni = isoHari();
    const out = Object.values(g).map((r) => {
      r.untung = r.hasil - r.modal;
      r.rc = r.modal ? r.hasil / r.modal : null;
      r.margin = r.hasil ? r.untung / r.hasil : null;
      r.satuan = r.sat.size === 1 ? [...r.sat][0] : 'satuan';
      const xg = this.tanpaGaji ? r.gaji : 0; // v0.1.182: opsi tanpa gaji pemilik hanya memengaruhi HPP, harga min., dan BEP; untung dan R/C tetap sesudah gaji
      r.tetapB = r.tetap - (this.tanpaGaji ? r.gTetap : 0);
      r.hpp = r.qty ? (r.modal - r.alat - xg) / r.qty : null; // pembelian alat tidak masuk HPP
      r.harga = r.qty && r.hasil - r.nonPanen > 0 ? (r.hasil - r.nonPanen) / r.qty : null; // penjualan bibit dan bantuan tidak ikut
      r.hmin = r.hpp ? r.hpp / (1 - mg) : null;
      const v = r.qty ? (r.vari - (this.tanpaGaji ? r.gVari : 0)) / r.qty : 0;
      r.bep = (r.harga && r.harga > v && r.qty) ? r.tetapB / (r.harga - v) : null; // titik impas (satuan)
      /* v0.1.184: efisiensi. Untung per hari (hanya per siklus: hari siklus yang beririsan dengan periode) dan per satuan luas unit (siklus dan unit) */
      let u = null; r.hari = null; r.perHari = null; r.luas = null; r.satLuas = ''; r.perLuas = null; r.hasilLuas = null;
      if (r.sid) { const s = Siklus.cari(r.sid); if (s) { const h = this.hariTumpang(s.mulai, s.selesai || hariIni, pa, pb); if (h > 0) { r.hari = h; r.perHari = r.untung / h; } u = Siklus.unit(s.unitId); } }
      else if (r.uid) u = Siklus.unit(r.uid);
      if (u && Number(u.ukuran) > 0) { r.luas = Number(u.ukuran); r.satLuas = u.satuanUkuran || ''; r.perLuas = r.untung / r.luas; r.hasilLuas = r.hasil / r.luas; }
      r.mg = mg; return r;
    }).sort((a, b) => b.untung - a.untung);
    /* v0.1.159: siklus bernama sama (mis. dua musim Selada di unit yang sama) dibedakan dengan tanggal mulai */
    if (this.dim === 'siklus') { const n = {}; out.forEach((r) => { n[r.nama] = (n[r.nama] || 0) + 1; }); out.forEach((r) => { if (n[r.nama] > 1 && r.mulai) { r.dasar = r.nama; r.nama += ' · mulai ' + this.tglP(r.mulai); } }); }
    return out;
  },
  /* v0.1.182: pilihan hanya muncul bila periode punya transaksi Gaji Pemilik */
  pilihGaji(g) {
    if (!g) return '';
    return '<div class="lap-fl">HPP dan BEP</div>' + this.chip([[false, 'Dengan gaji pemilik'], [true, 'Tanpa gaji pemilik']], this.tanpaGaji, 'lg') +
      '<p class="note" style="margin:0">Hanya memengaruhi HPP, harga min., dan titik impas. Untung dan R/C tetap sesudah gaji.</p>';
  },
  /* v0.1.184: batas periode aktif (kosong = tanpa batas bawah), batas atas dipotong sampai hari ini */
  batasPeriode() {
    const h = isoHari(), rr = this.rentangAktif(); let a = '', b = '';
    if (rr) { a = rr[0]; b = rr[1]; } else if (this.per === 'kustom') { [a, b] = this.rentangTgl(); }
    if (!b || b > h) b = h; return [a || '', b];
  },
  hariTumpang(a1, b1, a2, b2) { const a = a2 && a2 > a1 ? a2 : a1, b = b1 < b2 ? b1 : b2; return a <= b ? this.selisihHari(a, b) + 1 : 0; },
  /* Penyusutan aset (Rencana → Aset) per hari sepanjang umur ekonomis, dijumlah untuk hari yang beririsan dengan periode (sampai hari ini).
     Pembelian alat yang sudah dicatat sebagai Modal (kategori Alat) dibandingkan agar untung "alat disusutkan" tidak menghitung dua kali. */
  susut() {
    const [pa, pb] = this.batasPeriode(), daftar = [];
    (Rencana.d().aset || []).filter((a) => !a.terhapus && a.hargaBeli > 0 && a.umurBulan > 0 && /^\d{4}-\d{2}-\d{2}$/.test(a.tanggalBeli || '')).forEach((a) => {
      const [y, m, d] = a.tanggalBeli.split('-').map(Number), akhir = new Date(Date.UTC(y, m - 1 + a.umurBulan, d)).toISOString().slice(0, 10), hidup = this.selisihHari(a.tanggalBeli, akhir);
      const h = hidup > 0 ? this.hariTumpang(a.tanggalBeli, this.geser(akhir, -1), pa, pb) : 0, jml = h > 0 ? a.hargaBeli / hidup * h : 0;
      if (jml > 0) daftar.push({ nama: a.nama, jumlah: jml });
    });
    daftar.sort((x, y) => y.jumlah - x.jumlah);
    const tot = daftar.reduce((s, x) => s + x.jumlah, 0), alat = App.aktif().filter((t) => t.jenis === 'keluar' && t.kategoriId === 'alat' && this.masuk(t.tanggal)).reduce((s, t) => s + t.jumlah, 0);
    return { tot: Math.round(tot), alat, daftar, jml: daftar.length };
  },
  vSusut(un) {
    const o = this.susut(); if (!o.tot) return '';
    const baris = (a, b) => '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>', u2 = un + o.alat - o.tot;
    return '<section data-bx="susut"><h2>Penyusutan aset</h2>' + baris('Penyusutan aset periode ini', rp(o.tot)) + baris('Pembelian alat di Modal', rp(o.alat)) +
      '<div class="row"><span class="mu">Untung dengan alat disusutkan</span><strong class="' + (u2 >= 0 ? 'up' : 'down') + '">' + rp(u2) + '</strong></div>' +
      '<p class="note" style="margin:6px 0 0">' + o.daftar.slice(0, 3).map((x) => esc(x.nama) + ' ' + rp(Math.round(x.jumlah))).join(' · ') + (o.jml > 3 ? ' · +' + (o.jml - 3) + ' lainnya' : '') + '</p>' +
      '<p class="note">Untung dengan alat disusutkan = untung + pembelian alat di Modal − penyusutan aset (Rencana → Aset, per hari sepanjang umur ekonomis sampai hari ini). Daftarkan alat besar di Aset agar tidak terlewat; alat kecil yang tak didaftarkan tetap ikut tertambah kembali.</p></section>';
  },
  cetakSusut(un) {
    const o = this.susut(); if (!o.tot) return '';
    return '<div class="ct-bag"><h2>Penyusutan aset</h2><table class="ct-tab"><thead><tr><th>Ukuran</th><th class="n">Jumlah</th></tr></thead><tbody><tr><td>Untung / rugi (alat dicatat sebagai modal)</td><td class="n">' + rp(un) + '</td></tr><tr><td>Pembelian alat di Modal (ditambahkan kembali)</td><td class="n">' + rp(o.alat) + '</td></tr><tr><td>Penyusutan aset periode ini</td><td class="n">' + rp(o.tot) + '</td></tr><tr class="ct-tot"><td>Untung dengan alat disusutkan</td><td class="n">' + rp(un + o.alat - o.tot) + '</td></tr></tbody></table><p class="ct-cat">Penyusutan per hari sepanjang umur ekonomis aset (Rencana → Aset) sampai hari ini. ' + o.daftar.slice(0, 3).map((x) => esc(x.nama) + ' ' + rp(Math.round(x.jumlah))).join(', ') + (o.jml > 3 ? ', +' + (o.jml - 3) + ' lainnya' : '') + '.</p></div>';
  },
  isianTgl() {
    if (this.per !== 'kustom') return '';
    return '<div class="two" style="margin:4px 0 8px"><div><label for="lt_dari">Dari</label><input type="date" id="lt_dari" data-lt="dari" value="' + this.dari + '"></div>' +
      '<div><label for="lt_sampai">Sampai</label><input type="date" id="lt_sampai" data-lt="sampai" value="' + this.sampai + '"></div></div>' +
      (this.dari && this.sampai && this.dari > this.sampai ? '<p class="note">Tanggal Dari setelah Sampai; laporan memakai urutan yang benar.</p>' : '');
  },
  atur(k, v) { this[k] = /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ''; App.go('laporan', true); },
  tglP(t) { const [y, m, d] = String(t).split('-').map(Number); return d + ' ' + this.BLN[m - 1].slice(0, 3) + ' ' + y; },
  chip(arr, cur, att) { return '<div class="seg sm" style="justify-content:flex-start;margin:6px 0">' + arr.map((x) => '<button type="button" class="btn' + (cur === x[0] ? ' on' : '') + '" data-' + att + '="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>'; },
  kartu(r, i) {
    const f = (n) => n === null ? '—' : rp(Math.round(n)), u = r.untung >= 0;
    const baris = (a, b) => '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>';
    return '<details class="lap-kartu"><summary><span class="lk-n">' + (i === 0 && r.untung > 0 ? '★ ' : '') + esc(r.dasar || r.nama) + (r.dasar || r.status === 'berjalan' ? '<small class="lk-m">' + [r.dasar ? 'Mulai ' + this.tglP(r.mulai) : '', r.status === 'berjalan' ? 'Berjalan' + (r.hasil ? '' : ' · belum ada hasil') : ''].filter(Boolean).join(' · ') + '</small>' : '') + '</span><span class="lk-v"><b class="' + (u ? 'up' : 'down') + '">' + (u ? '+' : '') + rp(r.untung) + '</b><span class="mu">R/C ' + (r.rc === null ? '—' : fmtRC(r.rc)) + '</span></span></summary><div class="lk-isi">' +
      baris('Modal / Hasil', rp(r.modal) + ' / ' + rp(r.hasil)) +
      (r.gaji ? baris('Gaji pemilik', rp(r.gaji)) + baris('Untung sebelum gaji', rp(r.untung + r.gaji)) : '') +
      baris('R/C ratio', r.rc === null ? '—' : fmtRC(r.rc) + (r.rc >= 1 ? ' (untung)' : ' (rugi)')) +
      baris('Margin', r.margin === null ? '—' : (r.margin < 0 ? '−' : '') + Math.abs(Math.round(r.margin * 100)) + '%') +
      (r.perHari !== null ? baris('Untung per hari', rp(Math.round(r.perHari)) + ' · ' + r.hari + ' hari') : '') +
      (r.perLuas !== null ? baris('Untung per ' + esc(r.satLuas || 'satuan luas'), rp(Math.round(r.perLuas)) + ' · ' + r.luas.toLocaleString('id-ID') + ' ' + esc(r.satLuas)) + baris('Hasil per ' + esc(r.satLuas || 'satuan luas'), rp(Math.round(r.hasilLuas))) : '') +
      baris('Panen bersih', r.qty ? r.qty.toLocaleString('id-ID') + ' ' + esc(r.satuan) : 'belum ada') +
      baris('HPP per ' + esc(r.satuan) + (this.tanpaGaji && r.gaji ? ' (tanpa gaji)' : ''), f(r.hpp)) +
      baris('Harga jual rata-rata', f(r.harga)) +
      baris('Harga min. (margin ' + Math.round(r.mg * 100) + '%)', f(r.hmin)) +
      baris('Titik impas (BEP)', r.bep === null ? (r.tetapB ? 'butuh panen berharga' : 'tak ada biaya tetap') : Math.ceil(r.bep).toLocaleString('id-ID') + ' ' + esc(r.satuan) + ' · ' + rp(Math.round(r.bep * r.harga))) +
      '</div></details>';
  },
  vBanding() {
    const ke = (n) => { const x = new Date(); x.setDate(1); x.setMonth(x.getMonth() + n); return isoHari(x).slice(0, 7); };
    const per = (k) => Beranda.per(k);
    const lalu = [-3, -2, -1].map((n) => per(ke(n))).filter((r) => r.n), ini = per(ke(0));
    if (!lalu.length) return '<section data-bx="banding"><h2>Bulan ini vs rata-rata 3 bulan</h2><p class="note">Belum ada transaksi di 3 bulan sebelumnya sebagai pembanding.</p></section>';
    const avg = (f) => lalu.reduce((s, r) => s + r[f], 0) / lalu.length;
    const baris = (nama, f, baikNaik) => { const a = avg(f), c = ini[f], d = c - a, pct = a ? Math.round(d / Math.abs(a) * 100) : null, baik = (d >= 0) === baikNaik;
      return '<div class="row"><span class="mu">' + nama + '</span><span>' + rp(c) + ' <span class="mu">vs ' + rp(Math.round(a)) + '</span> <span class="' + (d === 0 ? 'mu' : baik ? 'up' : 'down') + '">' + (d === 0 ? 'sama' : (d > 0 ? '▲' : '▼') + (pct === null ? '' : ' ' + Math.abs(pct) + '%')) + '</span></span></div>'; };
    return '<section data-bx="banding"><h2>Bulan ini vs rata-rata 3 bulan</h2>' + baris('Untung', 'u', true) + baris('Modal', 'm', false) + baris('Hasil', 'h', true) +
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
  /* Dipindah dari Beranda (v0.1.172) */
  vUntungBulan() {
    const T = this.bulanN(6).map((r) => ({ n: r.n, u: r.h - r.m }));
    if (!T.some((r) => r.u)) return '';
    const mx = Math.max(1, ...T.map((r) => Math.abs(r.u))), Z = 72, S = 52, w = 50;
    const bars = T.map((r, i) => {
      const h = Math.max(r.u ? 2 : 0, Math.abs(r.u) / mx * S), x = i * w + 14, up = r.u >= 0, y = up ? Z - h : Z;
      return '<rect x="' + x + '" y="' + y + '" width="22" height="' + h + '" rx="3" fill="var(' + (up ? '--fill' : '--loss') + ')"><title>' + r.n + ': ' + rp(r.u) + '</title></rect>' +
        '<text x="' + (x + 11) + '" y="' + (up ? y - 3 : y + h + 10) + '" text-anchor="middle" font-size="8" fill="var(--paper-faint)">' + (r.u ? (up ? '' : '−') + this.ringkasAngka(r.u) : '') + '</text>' +
        '<text x="' + (x + 11) + '" y="146" text-anchor="middle" font-size="10" fill="var(--paper-faint)">' + r.n + '</text>';
    }).join('');
    return '<section class="dash" data-bx="untung"><h2>Untung bersih per bulan</h2><svg viewBox="0 0 300 150" width="100%" role="img" aria-label="Untung bersih per bulan, 6 bulan terakhir"><line x1="0" x2="300" y1="' + Z + '" y2="' + Z + '" stroke="var(--line-soft)"/>' + bars + '</svg>' +
      '<p class="note"><span style="color:var(--fill)">■</span> Untung &nbsp; <span style="color:var(--loss)">■</span> Rugi · 6 bulan terakhir</p></section>';
  },
  vAnggaran() {
    const L = Siklus.daftar().filter((s) => s.status === 'berjalan' && s.anggaran);
    if (!L.length) return '';
    return '<section class="dash" data-bx="anggaran"><h2>Modal vs anggaran (siklus berjalan)</h2>' + L.map((s) => {
      const r = Siklus.ringkas(s.id).modal, p = Math.round(r / s.anggaran * 100);
      return '<div class="bar-row"><div class="bar-top"><span>' + esc(Siklus.nama(s.id)) + '</span><span class="' + (p > 100 ? 'down' : 'mu') + '" style="white-space:nowrap;margin-left:10px">' + p + '% · ' + Beranda.m(r) + '</span></div>' +
        '<div class="bar"><i style="width:' + Math.min(p, 100) + '%;background:var(' + (p > 100 ? '--loss' : p >= 90 ? '--gold' : '--fill') + ')"></i></div></div>';
    }).join('') + '</section>';
  },
  /* Laporan satu halaman (v0.1.079; v0.1.172 + untung per bulan, sumber hasil, anggaran): filter → ringkasan → tren → untung per bulan → banding → komposisi → anggaran → rincian → simulasi */
  vLaporan() {
    clearTimeout(this._cf); this._cf = null;
    const L = this.hitung(), T = L.reduce((a, r) => ({ m: a.m + r.modal, h: a.h + r.hasil, g: a.g + r.gaji }), { m: 0, h: 0, g: 0 }), un = T.h - T.m, nTx = App.aktif().filter((t) => this.masuk(t.tanggal)).length, P = App.semuaTx().filter((t) => t.kategoriId === 'prive' && this.masuk(t.tanggal)).reduce((a, t) => a + t.jumlah, 0); // Prive: di luar untung usaha (v0.1.192)
    const lab = (arr, k) => (arr.find((x) => x[0] === k) || ['', ''])[1];
    const aksi = '<div class="lap-aksi no-print"><button type="button" class="ikon-btn" data-an="cetak" aria-label="Cetak semua bagian laporan atau simpan PDF">' + this.IKON.cetak + '<span>Cetak</span></button>' +
      '<button type="button" class="ikon-btn" data-an="xls" aria-label="Ekspor ke Excel">' + this.IKON.xls + '<span>Excel</span></button></div>';
    const filter = '<section class="lap-filter no-print"><div class="lap-fl">Periode</div>' + this.chip(this.PER, this.per, 'lp') + this.isianTgl() + '<div class="lap-fl">Kelompokkan per</div>' + this.chip(this.DIM, this.dim, 'ld') + this.pilihGaji(T.g) + '</section>';
    const kpi = '<section data-bx="kpi"><div class="lap-untung"><span class="mu">Untung / rugi · ' + (this.per === 'semua' ? 'semua waktu' : this.per === 'kustom' ? this.teksRentang() : lab(this.PER, this.per).toLowerCase()) + '</span><strong class="' + (un >= 0 ? 'up' : 'down') + '">' + rp(un) + '</strong></div>' +
      '<div class="lap-kpi"><div><span class="mu">Modal</span><b>' + rp(T.m) + '</b></div><div><span class="mu">Hasil</span><b>' + rp(T.h) + '</b></div><div><span class="mu">R/C ratio</span><b>' + (T.m ? fmtRC(T.h / T.m) : '—') + '</b></div></div>' +
      (T.g ? '<div class="lap-kpi"><div><span class="mu">Untung sebelum gaji</span><b class="' + (un + T.g >= 0 ? 'up' : 'down') + '">' + rp(un + T.g) + '</b></div><div><span class="mu">Gaji pemilik</span><b>' + rp(T.g) + '</b></div><div><span class="mu">Gaji ÷ hasil</span><b>' + (T.h ? Math.round(T.g / T.h * 100) + '%' : '—') + '</b></div></div>' : '') +
      (P ? '<div class="lap-kpi"><div><span class="mu">Prive (diambil pemilik)</span><b>' + rp(P) + '</b></div><div><span class="mu">Untung dikurangi prive</span><b class="' + (un - P >= 0 ? 'up' : 'down') + '">' + rp(un - P) + '</b></div><div><span class="mu">Prive ÷ untung</span><b>' + (un > 0 ? Math.round(P / un * 100) + '%' : '—') + '</b></div></div>' : '') +
      '<div class="lap-kpi"><div><span class="mu">Margin</span><b>' + (T.h ? (Math.round(un / T.h * 100) + '%').replace('-', '−') : '—') + '</b></div><div><span class="mu">Transaksi</span><b>' + nTx + '</b></div><div><span class="mu">' + lab(this.DIM, this.dim) + '</span><b>' + L.filter((r) => r.nama !== 'Tanpa siklus').length + '</b></div></div></section>';
    const rinci = '<section class="lap-rinci"><h2>Rincian per ' + lab(this.DIM, this.dim).toLowerCase() + '</h2><p class="note">Urut dari untung terbesar; ketuk satu baris untuk detail. HPP = modal (di luar pembelian alat) ÷ panen bersih; harga rata-rata tidak menghitung penjualan bibit dan bantuan; BEP dihitung dari biaya tetap, harga rata-rata, dan biaya variabel per satuan. Untung per hari memakai hari siklus yang masuk periode; per luas memakai ukuran unit (siklus yang berbagi unit sama-sama memakai luas penuh).' + (this.tanpaGaji && T.g ? ' <b>HPP dan BEP dihitung tanpa gaji pemilik.</b>' : '') + '</p>' +
      (L.length ? L.map((r, i) => this.kartu(r, i)).join('') : '<p class="note">Belum ada transaksi pada periode ini. Catat modal/hasil atau isi data contoh di Beranda.</p>') + '</section>';
    const lom = '<div class="seg sm lompat no-print" role="group" aria-label="Lompat ke bagian laporan">' + [['Ringkasan', 'kpi'], ['Grafik', 'tren'], ['Biaya', 'komp'], ['Sorotan', 'sorotan'], ['Siklus', 'rinci'], ['Simulasi', 'sim']].map((x) => '<button type="button" class="btn" data-an="lompat" data-ke="' + x[1] + '">' + x[0] + '</button>').join('') + '</div>';
    return this.lipat(aksi + filter + lom + kpi + this.vSusut(un) + this.vGrafik() + this.vUntungBulan() + this.vBanding() + this.vSebelum() + '<section class="dash" data-bx="komp"><h2>Komposisi modal</h2>' + this.komposisi('keluar') + '<h3 class="lap-sub">Sumber hasil</h3>' + this.komposisi('masuk') + '</section>' + this.vBiaya() + this.vSorotan() + this.vAnggaran() + rinci + this.vSimulasi());
  },
  /* ---------- Fase 4: dashboard, cetak, Excel ---------- */
  /* v0.1.178: biaya tetap vs variabel pada periode terpilih (sifatBiaya transaksi; selain 'tetap' dihitung variabel, sama dengan hitung()) */
  biayaSifat() {
    const o = { tetap: { tot: 0, kat: {} }, vari: { tot: 0, kat: {} } };
    App.aktif().filter((t) => t.jenis === 'keluar' && this.masuk(t.tanggal)).forEach((t) => { const g = t.sifatBiaya === 'tetap' ? o.tetap : o.vari; g.tot += t.jumlah; g.kat[t.kategoriId] = (g.kat[t.kategoriId] || 0) + t.jumlah; });
    o.tot = o.tetap.tot + o.vari.tot; return o;
  },
  vBiaya() {
    const o = this.biayaSifat(); if (!o.tot) return '';
    const bagian = (nama, g, ket) => { const p = Math.round(g.tot / o.tot * 100), ks = Object.keys(g.kat).sort((a, b) => g.kat[b] - g.kat[a]);
      return '<div class="bar-row"><div class="bar-top"><span><b>' + nama + '</b></span><span class="mu">' + p + '% · ' + rp(g.tot) + '</span></div><div class="bar"><i style="width:' + p + '%"></i></div>' +
        (ks.length ? '<p class="note" style="margin:4px 0 10px">' + ks.slice(0, 3).map((k) => esc(App.namaKat(k)) + ' ' + rp(g.kat[k])).join(' · ') + (ks.length > 3 ? ' · +' + (ks.length - 3) + ' lainnya' : '') + '</p>' : '<p class="note" style="margin:4px 0 10px">' + ket + '</p>') + '</div>'; };
    return '<section class="dash" data-bx="biaya"><h2>Biaya tetap vs variabel</h2>' + bagian('Biaya tetap', o.tetap, 'Tidak ada pada periode ini.') + bagian('Biaya variabel', o.vari, 'Tidak ada pada periode ini.') +
      '<p class="note">Biaya tetap tidak ikut naik-turun dengan jumlah panen (mis. listrik, sewa, alat, gaji pemilik); biaya variabel mengikuti produksi. Mengikuti Periode di atas.</p></section>';
  },
  /* v0.1.181: rentang tanggal periode aktif dan periode sebelumnya yang sama panjang */
  geser(iso, n) { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); },
  selisihHari(a, b) { const u = (t) => { const [y, m, d] = t.split('-').map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((u(b) - u(a)) / 864e5); },
  rentangAktif() {
    const n = new Date(), y = n.getFullYear(), m = n.getMonth();
    if (this.per === 'bulan') return [isoHari(new Date(y, m, 1)), isoHari(new Date(y, m + 1, 0))];
    if (this.per === 'lalu') return [isoHari(new Date(y, m - 1, 1)), isoHari(new Date(y, m, 0))];
    if (this.per === 'tahun') return [y + '-01-01', y + '-12-31'];
    if (this.per === 'kustom') { const [a, b] = this.rentangTgl(); return a && b ? [a, b] : null; }
    return null;
  },
  sebelumnya() {
    const r = this.rentangAktif(); if (!r) return null;
    const [a, b] = r, d = new Date(a + 'T00:00:00');
    if (this.per === 'bulan' || this.per === 'lalu') return { a: isoHari(new Date(d.getFullYear(), d.getMonth() - 1, 1)), b: isoHari(new Date(d.getFullYear(), d.getMonth(), 0)), nama: this.BLN[new Date(d.getFullYear(), d.getMonth() - 1, 1).getMonth()] + ' ' + new Date(d.getFullYear(), d.getMonth() - 1, 1).getFullYear() };
    if (this.per === 'tahun') { const y = d.getFullYear() - 1; return { a: y + '-01-01', b: y + '-12-31', nama: 'Tahun ' + y }; }
    const pb = this.geser(a, -1), pa = this.geser(pb, -(this.selisihHari(a, b)));
    return { a: pa, b: pb, nama: this.tglP(pa) + ' – ' + this.tglP(pb) };
  },
  totalRentang(a, b) {
    const o = { m: 0, h: 0, n: 0 };
    App.aktif().forEach((t) => { if (t.tanggal < a || t.tanggal > b) return; o.n++; if (t.jenis === 'keluar') o.m += t.jumlah; else if (t.jenis === 'masuk') o.h += t.jumlah; });
    o.u = o.h - o.m; return o;
  },
  banding() { // null bila periode tak punya pembanding (Semua, atau Pilih tanggal yang belum lengkap)
    const r = this.rentangAktif(), pr = this.sebelumnya(); if (!r || !pr) return null;
    const hariIni = isoHari(), berjalan = r[0] <= hariIni && r[1] > hariIni, hari = this.selisihHari(r[0], hariIni) + 1, panjang = this.selisihHari(r[0], r[1]) + 1;
    /* v0.1.182: periode yang masih berjalan dibanding N hari pertama periode sebelumnya (N = hari yang sudah berlalu), bukan seluruh periode sebelumnya;
       tanpa ini modal "turun 49%" dan terlihat membaik padahal periodenya baru separuh. */
    let b1 = r[1], a0 = pr.a, b0 = pr.b, nama = pr.nama;
    if (berjalan) { b1 = hariIni; b0 = this.geser(pr.a, hari - 1); if (b0 > pr.b) b0 = pr.b; nama = this.tglP(a0) + ' – ' + this.tglP(b0); }
    return { ini: this.totalRentang(r[0], b1), lalu: this.totalRentang(a0, b0), nama, berjalan, hari, panjang };
  },
  barisBanding(nama, c, a, baikNaik, cetak) {
    const d = c - a, pct = a ? Math.round(d / Math.abs(a) * 100) : null, baik = (d >= 0) === baikNaik;
    if (cetak) { const t = d === 0 ? 'sama' : (pct === null ? '—' : (d > 0 ? '+' : '−') + Math.abs(pct) + '%') + (baik ? ' (membaik)' : ' (memburuk)'); return '<tr><td>' + nama + '</td><td class="n">' + rp(c) + '</td><td class="n">' + rp(a) + '</td><td class="n">' + t + '</td></tr>'; }
    return '<div class="row"><span class="mu">' + nama + '</span><span>' + rp(c) + ' <span class="mu">vs ' + rp(a) + '</span> <span class="' + (d === 0 ? 'mu' : baik ? 'up' : 'down') + '">' + (d === 0 ? 'sama' : (d > 0 ? '▲' : '▼') + (pct === null ? '' : ' ' + Math.abs(pct) + '%')) + '</span></span></div>';
  },
  catBanding(b) { return b.berjalan ? 'Periode ini baru berjalan ' + b.hari + ' dari ' + b.panjang + ' hari, jadi dibanding ' + b.hari + ' hari pertama periode sebelumnya (jumlah hari sama). ' : ''; },
  vSebelum() {
    const b = this.banding(); if (!b) return '';
    if (!b.lalu.n) return '<section data-bx="sebelum"><h2>Vs periode sebelumnya</h2><p class="note">Belum ada transaksi pada ' + esc(b.nama) + ' sebagai pembanding.</p></section>';
    return '<section data-bx="sebelum"><h2>Vs periode sebelumnya</h2><p class="note" style="margin-top:0">' + esc(b.nama) + '</p>' + this.barisBanding('Untung', b.ini.u, b.lalu.u, true) + this.barisBanding('Modal', b.ini.m, b.lalu.m, false) + this.barisBanding('Hasil', b.ini.h, b.lalu.h, true) +
      '<p class="note">' + this.catBanding(b) + (b.berjalan ? '' : 'Pembanding: periode sama panjang tepat sebelumnya. ') + 'Hijau = membaik (modal turun dianggap baik).</p></section>';
  },
  cetakSebelum() {
    const b = this.banding(); if (!b) return '';
    if (!b.lalu.n) return '<div class="ct-bag"><h2>Vs periode sebelumnya</h2><p class="ct-cat">Belum ada transaksi pada ' + esc(b.nama) + ' sebagai pembanding.</p></div>';
    return '<div class="ct-bag"><h2>Vs periode sebelumnya</h2><table class="ct-tab"><thead><tr><th>Ukuran</th><th class="n">Periode ini</th><th class="n">' + esc(b.nama) + '</th><th class="n">Selisih</th></tr></thead><tbody>' +
      this.barisBanding('Untung', b.ini.u, b.lalu.u, true, true) + this.barisBanding('Modal', b.ini.m, b.lalu.m, false, true) + this.barisBanding('Hasil', b.ini.h, b.lalu.h, true, true) + '</tbody></table><p class="ct-cat">' + this.catBanding(b) + (b.berjalan ? '' : 'Pembanding: periode sama panjang tepat sebelumnya. ') + 'Membaik = untung atau hasil naik, atau modal turun.</p></div>';
  },
  /* v0.1.179: sorotan periode: transaksi terbesar, kategori tersering, hari tersibuk, rata-rata per transaksi */
  sorotan() {
    const tx = App.aktif().filter((t) => this.masuk(t.tanggal)), m = tx.filter((t) => t.jenis === 'keluar'), h = tx.filter((t) => t.jenis === 'masuk');
    const top = (a) => a.slice().sort((x, y) => y.jumlah - x.jumlah || (y.tanggal > x.tanggal ? 1 : y.tanggal < x.tanggal ? -1 : 0)).slice(0, 3);
    const sering = (a) => { const c = {}; a.forEach((t) => { const q = c[t.kategoriId] || (c[t.kategoriId] = { id: t.kategoriId, n: 0, jml: 0 }); q.n++; q.jml += t.jumlah; });
      return Object.values(c).sort((x, y) => y.n - x.n || y.jml - x.jml)[0] || null; };
    const hr = {}; tx.forEach((t) => { hr[t.tanggal] = (hr[t.tanggal] || 0) + 1; });
    const hari = Object.keys(hr).sort((a, b) => hr[b] - hr[a] || (a < b ? 1 : -1))[0];
    const sum = (a) => a.reduce((x, t) => x + t.jumlah, 0);
    const bl = {}; tx.forEach((t) => { const k = t.tanggal.slice(0, 7); bl[k] = (bl[k] || 0) + (t.jenis === 'masuk' ? t.jumlah : t.jenis === 'keluar' ? -t.jumlah : 0); });
    const kb = Object.keys(bl).sort((x, y) => bl[y] - bl[x] || (x < y ? 1 : -1)), bulan = kb.length >= 2 ? { baik: { k: kb[0], u: bl[kb[0]] }, buruk: { k: kb[kb.length - 1], u: bl[kb[kb.length - 1]] } } : null;
    /* rata-rata modal per hari: hari berlalu dalam periode (maksimal sampai hari ini); Semua/rentang terbuka mulai dari transaksi tertua */
    const hariIni = isoHari(), r = this.rentangAktif(), [da, db] = this.per === 'kustom' ? this.rentangTgl() : ['', ''], awal = tx.map((t) => t.tanggal).sort()[0];
    let a = r ? r[0] : (da || awal), b = r ? r[1] : (db || hariIni); if (b > hariIni) b = hariIni;
    const hariN = a && b && a <= b ? this.selisihHari(a, b) + 1 : 0;
    return { n: tx.length, nm: m.length, nh: h.length, bulan, hariN, perHari: hariN && m.length ? Math.round(sum(m) / hariN) : null, tm: top(m), th: top(h), sm: sering(m), sh: sering(h), hari: hari ? { tgl: hari, n: hr[hari] } : null,
      ratM: m.length ? Math.round(sum(m) / m.length) : null, ratH: h.length ? Math.round(sum(h) / h.length) : null };
  },
  namaBulan(k) { const [y, m] = k.split('-').map(Number); return this.BLN[m - 1] + ' ' + y; },
  vSorotan() {
    const o = this.sorotan(); if (!o.n) return '';
    const baris = (a, b) => '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>';
    const daftar = (a) => a.map((t) => App.barisTx(t)).join('');
    const sr = (x) => x ? esc(App.namaKat(x.id)) + ' · ' + x.n + ' transaksi' : '—';
    return '<section class="dash" data-bx="sorotan"><h2>Sorotan periode</h2>' +
      (o.tm.length ? '<h3 class="lap-sub">Pengeluaran terbesar</h3>' + daftar(o.tm) : '') + (o.th.length ? '<h3 class="lap-sub">Pemasukan terbesar</h3>' + daftar(o.th) : '') +
      '<h3 class="lap-sub">Tersering</h3>' + baris('Kategori modal', sr(o.sm)) + baris('Kategori hasil', sr(o.sh)) +
      baris('Hari tersibuk', o.hari ? this.tglP(o.hari.tgl) + ' · ' + o.hari.n + ' transaksi' : '—') +
      baris('Rata-rata modal / hari', o.perHari === null ? '—' : rp(o.perHari) + ' · ' + o.hariN + ' hari') +
      (o.bulan ? baris('Bulan terbaik', this.namaBulan(o.bulan.baik.k) + ' · ' + rp(o.bulan.baik.u)) + baris('Bulan terburuk', this.namaBulan(o.bulan.buruk.k) + ' · ' + rp(o.bulan.buruk.u)) : '') +
      baris('Rata-rata modal / transaksi', o.ratM === null ? '—' : rp(o.ratM)) + baris('Rata-rata hasil / transaksi', o.ratH === null ? '—' : rp(o.ratH)) +
      baris('Jumlah transaksi', o.nm + ' modal · ' + o.nh + ' hasil') +
      '<p class="note">Ketuk transaksi untuk melihat atau mengubahnya. Mengikuti Periode di atas.</p></section>';
  },
  cetakSorotan() {
    const o = this.sorotan(); if (!o.n) return '';
    const tab = (jud, a) => a.length ? '<table class="ct-tab ct-fix"><colgroup><col style="width:40%"><col style="width:22%"><col style="width:20%"><col style="width:18%"></colgroup><thead><tr><th>' + jud + '</th><th>Kategori</th><th class="n">Tanggal</th><th class="n">Jumlah</th></tr></thead><tbody>' +
      a.map((t, i) => '<tr><td>' + (i + 1) + '. ' + esc(t.catatan || '—') + '</td><td>' + esc(App.namaKat(t.kategoriId)) + '</td><td class="n">' + Setelan.tgl(t.tanggal) + '</td><td class="n">' + rp(t.jumlah) + '</td></tr>').join('') + '</tbody></table>' : '';
    const sr = (x) => x ? esc(App.namaKat(x.id)) + ' (' + x.n + ' transaksi)' : '—';
    return '<div class="ct-bag"><h2>Sorotan periode</h2><p class="ct-cat">Periode: ' + this.namaPer() + '</p>' + tab('Pengeluaran terbesar', o.tm) + tab('Pemasukan terbesar', o.th) +
      '<table class="ct-tab ct-fix"><colgroup><col style="width:40%"><col style="width:60%"></colgroup><thead><tr><th>Tersering</th><th class="n">Keterangan</th></tr></thead><tbody><tr><td>Kategori modal</td><td class="n">' + sr(o.sm) + '</td></tr><tr><td>Kategori hasil</td><td class="n">' + sr(o.sh) + '</td></tr>' +
      '<tr><td>Hari tersibuk</td><td class="n">' + (o.hari ? this.tglP(o.hari.tgl) + ' (' + o.hari.n + ' transaksi)' : '—') + '</td></tr>' +
      '<tr><td>Rata-rata modal per hari</td><td class="n">' + (o.perHari === null ? '—' : rp(o.perHari) + ' (' + o.hariN + ' hari)') + '</td></tr>' + (o.bulan ? '<tr><td>Bulan terbaik</td><td class="n">' + this.namaBulan(o.bulan.baik.k) + ' (' + rp(o.bulan.baik.u) + ')</td></tr><tr><td>Bulan terburuk</td><td class="n">' + this.namaBulan(o.bulan.buruk.k) + ' (' + rp(o.bulan.buruk.u) + ')</td></tr>' : '') + '<tr><td>Rata-rata modal per transaksi</td><td class="n">' + (o.ratM === null ? '—' : rp(o.ratM)) + '</td></tr><tr><td>Rata-rata hasil per transaksi</td><td class="n">' + (o.ratH === null ? '—' : rp(o.ratH)) + '</td></tr></tbody></table></div>';
  },
  cetakBiaya() {
    const o = this.biayaSifat(); if (!o.tot) return '';
    const baris = (nama, g) => '<tr><td>' + nama + '</td><td class="n">' + Math.round(g.tot / o.tot * 100) + '%</td><td class="n">' + rp(g.tot) + '</td><td>' + Object.keys(g.kat).sort((a, b) => g.kat[b] - g.kat[a]).slice(0, 3).map((k) => esc(App.namaKat(k))).join(', ') + '</td></tr>';
    return '<div class="ct-bag"><h2>Biaya tetap vs variabel</h2><p class="ct-cat">Periode: ' + this.namaPer() + '</p><table class="ct-tab"><thead><tr><th>Jenis</th><th class="n">Porsi</th><th class="n">Jumlah</th><th>Terbesar</th></tr></thead><tbody>' +
      baris('Biaya tetap', o.tetap) + baris('Biaya variabel', o.vari) + '<tr class="ct-tot"><td>Total modal</td><td class="n">100%</td><td class="n">' + rp(o.tot) + '</td><td></td></tr></tbody></table></div>';
  },
  komposisi(j) {
    j = j || 'keluar';
    const per = {}; let tot = 0;
    App.aktif().filter((t) => t.jenis === j && this.masuk(t.tanggal)).forEach((t) => { per[t.kategoriId] = (per[t.kategoriId] || 0) + t.jumlah; tot += t.jumlah; });
    if (!tot) return '<p class="note">Belum ada ' + (j === 'keluar' ? 'modal' : 'hasil') + ' pada periode ini.</p>';
    return Object.keys(per).sort((a, b) => per[b] - per[a]).slice(0, 6).map((k) => { const p = Math.round(per[k] / tot * 100);
      return '<div class="bar-row"><div class="bar-top"><span>' + esc(App.namaKat(k)) + '</span><span class="mu">' + p + '% · ' + rp(per[k]) + '</span></div><div class="bar"><i style="width:' + p + '%"></i></div></div>'; }).join('');
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
  namaPer() { const n = new Date(), l = new Date(n.getFullYear(), n.getMonth() - 1, 1); return this.per === 'bulan' ? 'Bulan ini (' + this.BLN[n.getMonth()] + ' ' + n.getFullYear() + ')' : this.per === 'lalu' ? 'Bulan lalu (' + this.BLN[l.getMonth()] + ' ' + l.getFullYear() + ')' : this.per === 'tahun' ? 'Tahun ini (' + n.getFullYear() + ')' : this.per === 'kustom' ? this.teksRentang() : 'Semua periode'; },
  usahaKop() { const u = Profil.usaha(), l = Profil.lokasi(); return u ? Profil.esc(u) + (l ? ' · ' + Profil.esc(l) : '') : ''; }, // v0.1.162: nama usaha di kop cetak dan Excel
  cetakKop(judul, baris2) {
    return '<div class="ct-kop"><h1>Laporan Usaha Tani</h1><p class="ct-sub">' + judul + '</p><table class="ct-meta"><tr><th>Periode</th><td>' + this.namaPer() + '</td><th>Dicetak</th><td>' + Setelan.tgl(isoHari()) + '</td></tr>' +
      '<tr><th>' + baris2[0] + '</th><td>' + baris2[1] + '</td><th>Aplikasi</th><td>Buku Kebun v' + VERSI + '</td></tr>' +
      (this.usahaKop() ? '<tr><th>Usaha</th><td colspan="3">' + this.usahaKop() + '</td></tr>' : '') + '</table></div>';
  },
  cetakRingkasan(k) { // k === false: tanpa kop (dipakai cetakSemua). v0.1.111: deret kartu angka (KPI) menggantikan tabel dua kolom
    const L = this.hitung(), T = L.reduce((a, r) => ({ m: a.m + r.modal, h: a.h + r.hasil, g: a.g + r.gaji }), { m: 0, h: 0, g: 0 }), un = T.h - T.m;
    const ntx = App.aktif().filter((t) => this.masuk(t.tanggal)).length, rc = T.m ? T.h / T.m : null, mg = T.h ? (un < 0 ? '−' : '') + Math.abs(Math.round(un / T.h * 100)) + '%' : '—';
    const kpi = (lb, v, sub) => '<td><span class="ct-kl">' + lb + '</span><span class="ct-kv2">' + v + '</span><span class="ct-ks">' + sub + '</span></td>';
    return (k === false ? '' : this.cetakKop('Ringkasan', ['Cakupan', 'Transaksi pada periode di atas'])) +
      '<div class="ct-bag"><h2>Untung / rugi</h2><table class="ct-kpi"><tr>' +
      kpi(un < 0 ? 'Rugi' : 'Untung', rp(un), T.h || T.m ? (un < 0 ? 'Modal melebihi hasil' : 'Hasil melebihi modal') : 'Belum ada transaksi') +
      kpi('Hasil', rp(T.h), 'Pemasukan') + kpi('Modal', rp(T.m), 'Pengeluaran') +
      kpi('R/C ratio', rc === null ? '—' : fmtRC(rc), rc === null ? 'Belum ada modal' : (rc >= 1 ? 'Hasil menutup modal' : 'Hasil belum menutup modal')) +
      '</tr></table><p class="ct-cat">Margin ' + mg + ' · ' + ntx.toLocaleString('id-ID') + ' transaksi pada periode ini. R/C ratio = hasil ÷ modal; di atas 1 berarti untung.</p></div>' + (T.g ? '<div class="ct-bag"><h2>Gaji pemilik</h2><table class="ct-tab"><thead><tr><th>Ukuran</th><th class="n">Jumlah</th></tr></thead><tbody><tr><td>Untung sebelum gaji pemilik</td><td class="n">' + rp(un + T.g) + '</td></tr><tr><td>Gaji pemilik</td><td class="n">' + rp(T.g) + '</td></tr><tr class="ct-tot"><td>Untung sesudah gaji pemilik</td><td class="n">' + rp(un) + '</td></tr></tbody></table><p class="ct-cat">Gaji pemilik ' + (T.h ? Math.round(T.g / T.h * 100) + '% dari hasil. ' : '') + 'Sudah termasuk dalam modal di atas.</p></div>' : '') + this.cetakSusut(un) + this.cetakBanding() + this.cetakSebelum();
  },
  cetakBanding() {
    const ke = (n) => { const x = new Date(); x.setDate(1); x.setMonth(x.getMonth() + n); return isoHari(x).slice(0, 7); };
    const per = (k) => Beranda.per(k);
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
    /* v0.1.111: kanvas 540 satuan (sebelumnya 700) sehingga angka dan label tercetak ±8 pt, bukan ±5 pt; angka di atas batang hanya untuk ≤ 8 bulan (selebihnya ada di tabel) */
    const T = this.bulanN(this.rentang), N = T.length, W = 540, X0 = 42, X1 = 534, Y0 = 18, Y1 = 170;
    const mx = Math.max(1, ...T.map((r) => Math.max(r.m, r.h))), yy = (v) => Y1 - v / mx * (Y1 - Y0), gw = (X1 - X0) / N, bw = Math.min(24, gw * 0.36), lintas = T[0].thn !== T[N - 1].thn, angka = N <= 8;
    const grid = [0, 1, 2, 3].map((i) => { const v = mx * i / 3, y = yy(v).toFixed(1);
      return '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + y + '" y2="' + y + '" stroke="#bbb" stroke-width=".6"/><text x="' + (X0 - 5) + '" y="' + (Number(y) + 3) + '" text-anchor="end" font-size="9" fill="#333">' + this.ringkasAngka(v) + '</text>'; }).join('');
    const bar = (v, x, isi) => { const h = v / mx * (Y1 - Y0), t = Math.max(v ? 1.5 : 0, h);
      return '<rect x="' + x.toFixed(1) + '" y="' + (Y1 - t).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + t.toFixed(1) + '" fill="' + isi + '" stroke="#000" stroke-width=".8"/>' +
        (v && angka ? '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (Y1 - t - 3).toFixed(1) + '" text-anchor="middle" font-size="8" fill="#000">' + this.ringkasAngka(v) + '</text>' : ''); };
    const batang = T.map((r, i) => { const cx = X0 + gw * (i + 0.5);
      return bar(r.h, cx - bw - 1, '#444') + bar(r.m, cx + 1, 'url(#ct-h)') + '<text x="' + cx.toFixed(1) + '" y="186" text-anchor="middle" font-size="9.5" fill="#000">' + r.n + (N > 6 || lintas ? ' ' + String(r.thn).slice(2) : '') + '</text>'; }).join('');
    const tot = T.reduce((a, r) => ({ h: a.h + r.h, m: a.m + r.m }), { h: 0, m: 0 });
    const svg = '<svg viewBox="0 0 ' + W + ' 194" width="100%" role="img" aria-label="Grafik batang hasil dan modal per bulan"><defs><pattern id="ct-h" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#fff"/><line x1="0" y1="0" x2="0" y2="4" stroke="#000" stroke-width="1.4"/></pattern></defs>' + grid + batang + '</svg>';
    const leg = '<p class="ct-cat"><svg width="12" height="9" aria-hidden="true"><rect x=".5" y=".5" width="11" height="8" fill="#444" stroke="#000"/></svg> Hasil &nbsp;&nbsp; <svg width="12" height="9" aria-hidden="true"><rect x=".5" y=".5" width="11" height="8" fill="url(#ct-h)" stroke="#000"/></svg> Modal · tren ' + N + ' bulan terakhir (tidak dipengaruhi pilihan periode)' + (angka ? '' : ' · angka per bulan ada di tabel') + '</p>';
    const tab = '<table class="ct-tab"><thead><tr><th>Bulan</th><th class="n">Hasil</th><th class="n">Modal</th><th class="n">Untung / rugi</th></tr></thead><tbody>' +
      T.map((r) => '<tr><td>' + r.n + ' ' + r.thn + '</td><td class="n">' + rp(r.h) + '</td><td class="n">' + rp(r.m) + '</td><td class="n">' + rp(r.h - r.m) + '</td></tr>').join('') +
      '<tr class="ct-tot"><td>Total</td><td class="n">' + rp(tot.h) + '</td><td class="n">' + rp(tot.m) + '</td><td class="n">' + rp(tot.h - tot.m) + '</td></tr></tbody></table>';
    return (k === false ? '' : this.cetakKop('Grafik', ['Tren', N + ' bulan terakhir'])) + '<div class="ct-bag"><h2>Tren hasil dan modal</h2>' + svg + leg + '</div><div class="ct-bag">' + tab + '</div>' + this.cetakKomposisi() + this.cetakBiaya() + this.cetakSorotan() + this.cetakTop();
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
    return '<div class="ct-bag"><h2>Komoditas teratas</h2><p class="ct-cat">Periode: ' + this.namaPer() + '</p><table class="ct-tab ct-fix"><colgroup><col style="width:8%"><col style="width:62%"><col style="width:30%"></colgroup><thead><tr><th class="n">No.</th><th>Komoditas</th><th class="n">Untung</th></tr></thead><tbody>' +
      L.map((r, i) => '<tr><td class="n">' + (i + 1) + '</td><td>' + esc(r.nama) + '</td><td class="n">' + rp(r.untung) + '</td></tr>').join('') + '</tbody></table></div>';
  },
  cetakRincian(k) { // v0.1.111: dua tabel yang muat di kertas potret (laba-rugi; produksi dan harga). Sebelumnya satu tabel 10 kolom di halaman lanskap bernama yang terpotong di kanan.
    const L = this.hitung(), dim = (this.DIM.find((x) => x[0] === this.dim) || [0, ''])[1], kop = k === false ? '' : this.cetakKop('Rincian per ' + dim.toLowerCase(), ['Dikelompokkan per', dim]);
    if (!L.length) return kop + '<p class="ct-cat">Belum ada transaksi pada periode ini.</p>';
    const T = L.reduce((a, r) => ({ m: a.m + r.modal, h: a.h + r.hasil }), { m: 0, h: 0 }), n = (v) => '<td class="n">' + v + '</td>';
    const fs = (v, r) => v === null ? '—' : rp(Math.round(v)) + '/' + esc(r.satuan), mg = Math.round(L[0].mg * 100), pct = (v) => v === null ? '—' : (v < 0 ? '−' : '') + Math.abs(Math.round(v * 100)) + '%';
    const nama = (r, i) => '<td>' + (i === 0 && r.untung > 0 ? '★ ' : '') + esc(r.nama) + '</td>';
    const t1 = '<table class="ct-tab ct-rinci"><thead><tr><th>' + dim + '</th><th class="n">Modal</th><th class="n">Hasil</th><th class="n">Untung / rugi</th><th class="n">R/C</th><th class="n">Margin</th></tr></thead><tbody>' +
      L.map((r, i) => '<tr>' + nama(r, i) + n(rp(r.modal)) + n(rp(r.hasil)) + n('<b>' + (r.untung > 0 ? '+' : '') + rp(r.untung) + '</b>') + n(r.rc === null ? '—' : fmtRC(r.rc)) + n(pct(r.margin)) + '</tr>').join('') +
      '<tr class="ct-tot"><td>Total</td>' + n(rp(T.m)) + n(rp(T.h)) + n('<b>' + rp(T.h - T.m) + '</b>') + n(T.m ? fmtRC(T.h / T.m) : '—') + n(T.h ? pct((T.h - T.m) / T.h) : '—') + '</tr></tbody></table>';
    const t2 = '<table class="ct-tab ct-rinci"><thead><tr><th>' + dim + '</th><th class="n">Panen bersih</th><th class="n">HPP</th><th class="n">Harga rata-rata</th><th class="n">Harga min. (margin ' + mg + '%)</th><th class="n">Titik impas (BEP)</th></tr></thead><tbody>' +
      L.map((r, i) => '<tr>' + nama(r, i) + n(r.qty ? r.qty.toLocaleString('id-ID') + ' ' + esc(r.satuan) : '—') + n(fs(r.hpp, r)) + n(fs(r.harga, r)) + n(fs(r.hmin, r)) + n(r.bep === null ? '—' : Math.ceil(r.bep).toLocaleString('id-ID') + ' ' + esc(r.satuan)) + '</tr>').join('') + '</tbody></table>';
    const bungkus = (judul, tb) => '<div class="' + (L.length <= 14 ? 'ct-bag' : 'ct-lepas') + '"><h3 class="ct-sub2">' + judul + ' per ' + dim.toLowerCase() + '</h3>' + tb + '</div>'; /* tabel pendek tidak dipecah antarhalaman; tabel panjang mengalir dengan judul kolom berulang */
    const E = L.filter((r) => r.perHari !== null || r.perLuas !== null), uk = (r) => r.luas === null ? '—' : r.luas.toLocaleString('id-ID') + ' ' + esc(r.satLuas), per = (v) => v === null ? '—' : rp(Math.round(v));
    const t3 = E.length ? '<div class="' + (E.length <= 14 ? 'ct-bag' : 'ct-lepas') + '"><h3 class="ct-sub2">Efisiensi per ' + dim.toLowerCase() + '</h3><table class="ct-tab ct-rinci"><thead><tr><th>' + dim + '</th><th class="n">Hari</th><th class="n">Untung / hari</th><th class="n">Ukuran unit</th><th class="n">Untung / ukuran</th><th class="n">Hasil / ukuran</th></tr></thead><tbody>' +
      E.map((r, i) => '<tr>' + nama(r, i) + n(r.hari === null ? '—' : r.hari) + n(per(r.perHari)) + n(uk(r)) + n(per(r.perLuas)) + n(per(r.hasilLuas)) + '</tr>').join('') + '</tbody></table><p class="ct-cat">Untung per hari = untung ÷ hari siklus yang masuk periode (hanya per siklus). Per ukuran = dibagi luas atau ukuran unit.</p></div>' : '';
    return kop + bungkus('Laba-rugi', t1) + bungkus('Produksi dan harga', t2) + t3 +
      '<p class="ct-cat">★ = untung terbesar. Margin = untung ÷ hasil. HPP = modal (di luar pembelian alat) ÷ panen bersih. Harga rata-rata tidak menghitung penjualan bibit dan bantuan. Harga min. = HPP ÷ (1 − margin). BEP = titik impas dari biaya tetap dan biaya variabel per satuan. — = belum ada data (mis. belum ada panen berharga atau tidak ada biaya tetap).' + (this.tanpaGaji && L.some((r) => r.gaji) ? ' HPP, harga min., dan BEP dihitung tanpa gaji pemilik; untung dan R/C tetap sesudah gaji.' : '') + '</p>';
  },
  cetakSemua() { // v0.1.075: satu dokumen untuk ketiga tab (Ringkasan, Grafik, Rincian), satu kop
    const dim = (this.DIM.find((x) => x[0] === this.dim) || [0, ''])[1].toLowerCase();
    const bab = (n, t, isi, cls) => '<div class="ct-bab-wrap' + (cls ? ' ' + cls : '') + '"><h2 class="ct-bab">' + n + '. ' + t + '</h2>' + isi + '</div>';
    return this.cetakKop('Ringkasan, grafik, dan rincian', ['Isi', 'Ringkasan · Grafik · Rincian per ' + dim]) +
      bab(1, 'Ringkasan', this.cetakRingkasan(false)) + bab(2, 'Grafik', this.cetakGrafik(false)) + bab(3, 'Rincian per ' + dim, this.cetakRincian(false), 'ct-rincian-bag');
  },
  cetakPasang() { // dipanggil sebelum mencetak: hanya halaman Laporan yang punya dokumen cetak sendiri
    if (Perjalanan.aktif) return; // dokumen perjalanan siklus sudah dipasang sendiri
    this.cetakLepas(); const umpan = App.tab === 'siklus' && Siklus.sub === 'jurnal'; if (App.tab !== 'laporan' && App.tab !== 'jurnal' && !umpan) return; if (App.tab === 'jurnal' && !Siklus.cari(Siklus.sid)) return; /* tab Jurnal tanpa siklus terpilih: cetak halaman apa adanya */
    const d = document.createElement('div'); d.id = 'cetak-lap'; d.className = 'ct-semua'; d.innerHTML = umpan ? Umpan.cetakDoc() : App.tab === 'jurnal' ? Linimasa.cetakDoc() : this.cetakSemua();
    document.body.appendChild(d); document.documentElement.classList.add('cetak-lap');
  },
  cetakLepas() { if (typeof Perjalanan !== 'undefined' && Perjalanan.aktif) { Perjalanan.lepas(); return; } const d = document.getElementById('cetak-lap'); if (d) d.remove(); document.documentElement.classList.remove('cetak-lap'); },
  eksporXls() { // v0.1.153: .xlsx asli (sebelumnya tabel HTML bernama .xls yang ditolak Google Sheets/Drive dan Excel baru)
    const L = this.hitung(), dim = (this.DIM.find((x) => x[0] === this.dim) || [0, 'Nama'])[1], b = (v) => (v === null || v === undefined || !isFinite(v)) ? null : v, uang = 2, desi = 4, pers = 5;
    const lembar = [{ nama: 'Laporan', kolom: [{ h: dim, w: 28 }, { h: 'Modal', w: 14, g: uang }, { h: 'Hasil', w: 14, g: uang }, { h: 'Untung', w: 14, g: uang }, { h: 'R/C', w: 8, g: desi }, { h: 'Margin', w: 9, g: pers }, { h: 'Panen bersih', w: 13, g: desi }, { h: 'Satuan', w: 9 }, { h: 'HPP', w: 12, g: uang }, { h: 'Harga rata-rata', w: 15, g: uang }, { h: 'Harga min', w: 12, g: uang }, { h: 'BEP (satuan)', w: 13, g: desi }].concat(this.dim === 'siklus' ? [{ h: 'Status', w: 11 }] : []).concat(this.dim !== 'komoditas' ? [{ h: 'Hari', w: 8 }, { h: 'Untung / hari', w: 14, g: uang }, { h: 'Ukuran unit', w: 12, g: desi }, { h: 'Satuan ukuran', w: 13 }, { h: 'Untung / ukuran', w: 15, g: uang }, { h: 'Hasil / ukuran', w: 14, g: uang }] : []),
      baris: L.map((r) => [r.nama, b(r.modal), b(r.hasil), b(r.untung), b(r.rc), b(r.margin), b(r.qty), r.satuan || '', b(r.hpp), b(r.harga), b(r.hmin), b(r.bep)].concat(this.dim === 'siklus' ? [r.status === 'berjalan' ? 'Berjalan' : r.status === 'selesai' ? 'Selesai' : ''] : []).concat(this.dim !== 'komoditas' ? [b(r.hari), b(r.perHari), b(r.luas), r.satLuas || '', b(r.perLuas), b(r.hasilLuas)] : [])) }];
    /* v0.1.157: lembar Ringkasan (periode, total, untung, R/C, margin) di depan, dan Tren 6 bulan di belakang */
    const mT = L.reduce((x, q) => x + (q.modal || 0), 0), hT = L.reduce((x, q) => x + (q.hasil || 0), 0), unT = hT - mT, gT = L.reduce((x, q) => x + (q.gaji || 0), 0), bs = this.biayaSifat(), sus = this.susut(), so = this.sorotan(), bd = this.banding();
    const ring = { nama: 'Ringkasan', kolom: [{ h: 'Keterangan', w: 26 }, { h: 'Nilai', w: 28, g: uang }],
      baris: [['Periode', this.namaPer()], ['Dikelompokkan per', dim], ['Dibuat', { t: 'tgl', v: isoHari() }], ['Modal', { n: mT, s: uang }], ['Hasil', { n: hT, s: uang }],
        ['Untung / rugi', { f: 'B6-B5', v: unT, s: uang }], ['R/C ratio', mT > 0 ? { f: 'B6/B5', v: hT / mT, s: desi } : null], ['Margin', hT > 0 ? { f: 'B7/B6', v: unT / hT, s: pers } : null]].concat(gT ? [['Gaji pemilik', { n: gT, s: uang }], ['Untung sebelum gaji pemilik', { f: 'B7+B10', v: unT + gT, s: uang }]] : []).concat(sus.tot ? [['Pembelian alat di Modal', { n: sus.alat, s: uang }], ['Penyusutan aset', { n: sus.tot, s: uang }], ['Untung dengan alat disusutkan', { n: unT + sus.alat - sus.tot, s: uang }]] : []).concat(gT ? [['HPP dan BEP', this.tanpaGaji ? 'Tanpa gaji pemilik' : 'Dengan gaji pemilik']] : []).concat(bd && bd.lalu.n ? [['Periode sebelumnya' + (bd.berjalan ? ' (' + bd.hari + ' hari pertama)' : ''), bd.nama], ['Modal periode sebelumnya', { n: bd.lalu.m, s: uang }], ['Hasil periode sebelumnya', { n: bd.lalu.h, s: uang }], ['Untung periode sebelumnya', { n: bd.lalu.u, s: uang }]] : []).concat(so.tm.length || so.th.length ? [['Pengeluaran terbesar', { n: so.tm.length ? so.tm[0].jumlah : 0, s: uang }], ['Pemasukan terbesar', { n: so.th.length ? so.th[0].jumlah : 0, s: uang }]] : []).concat(bs.tot ? [['Biaya tetap', { n: bs.tetap.tot, s: uang }], ['Biaya variabel', { n: bs.vari.tot, s: uang }]] : []).concat(Profil.usaha() ? [['Usaha', Profil.usaha() + (Profil.lokasi() ? ', ' + Profil.lokasi() : '')]] : []) };
    const TR = this.bulanN(this.rentang), tren = { nama: 'Tren ' + TR.length + ' bulan', kolom: [{ h: 'Bulan', w: 12 }, { h: 'Modal', w: 14, g: uang }, { h: 'Hasil', w: 14, g: uang }, { h: 'Untung', w: 14, g: uang }],
      baris: TR.map((q, i) => [q.n + ' ' + q.thn, q.m, q.h, { f: 'C' + (i + 2) + '-B' + (i + 2), v: q.h - q.m }]) };
    lembar.unshift(ring); lembar.push(tren);
    Xlsx.simpan(lembar, 'laporan-buku-kebun-' + this.per + '-' + this.dim + '.xlsx');
  },
  /* ---------- grafik garis halus + tooltip (v0.1.014) ---------- */
  rentang: (window.matchMedia && matchMedia('(min-width:1024px)').matches) ? 12 : 6, _pts: [], /* 12 bulan bawaan di desktop (v0.1.118) */
  /* Agregat bulanan (v0.1.142): satu kali lintas seluruh transaksi aktif, dipakai bersama hero, Beranda, dan Laporan.
     Memo terikat pada larik App.aktif(); larik itu dibuat ulang (App._ak = null) setiap data berubah (App.simpan) dan setiap pindah halaman,
     sehingga memo ikut batal. Bulan berganti (tengah malam) juga membatalkan agar label bulan tidak basi. */
  _agg: null,
  agg() {
    const L = App.aktif(), d = new Date(), kb = d.getFullYear() * 12 + d.getMonth(), M = this._agg;
    if (M && M.L === L && M.kb === kb) return M.per;
    const per = Object.create(null);
    for (let i = 0; i < L.length; i++) {
      const t = L[i], k = t.tanggal.slice(0, 7), a = per[k] || (per[k] = { m: 0, h: 0, n: 0 });
      a.n++; if (t.jenis === 'keluar') a.m += t.jumlah; else if (t.jenis === 'masuk') a.h += t.jumlah;
    }
    this._agg = { L: L, kb: kb, per: per };
    return per;
  },
  bulanN(n) {
    const d = new Date(), B = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'], out = [], per = this.agg();
    for (let i = n - 1; i >= 0; i--) {
      const x = new Date(d.getFullYear(), d.getMonth() - i, 1), a = per[isoHari(x).slice(0, 7)];
      out.push({ n: B[x.getMonth()], thn: x.getFullYear(), m: a ? a.m : 0, h: a ? a.h : 0 });
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
    return '<section class="dash" data-bx="tren"><h2>Tren hasil / modal</h2>' + this.chip([[6, '6 bulan'], [12, '12 bulan']], this.rentang, 'lr') +
      '<div class="lg-stat"><div><div class="note">UNTUNG BERSIH · ' + T.length + ' BLN</div><strong class="' + (un >= 0 ? 'up' : 'down') + '">' + rp(un) + '</strong></div><div><div class="note">HASIL · ' + T.length + ' BLN</div><strong>' + rp(tot.h) + '</strong></div><div><div class="note">MODAL · ' + T.length + ' BLN</div><strong>' + rp(tot.m) + '</strong></div></div>' +
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
  /* v0.1.195: bagian Laporan bisa dilipat di HP/tablet (ketuk judul); keadaan diingat selama aplikasi terbuka, desktop tidak terpengaruh */
  tutup: {},
  lipat(h) {
    return h.replace(/(<section[^>]*data-bx="(\w+)"[^>]*)>(<h2)>/g, (m, buka, k, h2) => k === 'kpi' ? m : buka + (this.tutup[k] ? ' data-tutup="1"' : '') + '>' + h2 + ' class="lap-h" role="button" tabindex="0" aria-expanded="' + !this.tutup[k] + '">');
  },
  ganti(h2) {
    const sec = h2.closest('[data-bx]'); if (!sec) return false;
    const k = sec.dataset.bx, tutup = !sec.hasAttribute('data-tutup');
    if (tutup) sec.setAttribute('data-tutup', '1'); else sec.removeAttribute('data-tutup');
    this.tutup[k] = tutup; h2.setAttribute('aria-expanded', String(!tutup)); return true;
  },
  /* v0.1.195: bilah lompat di Laporan; gulir ke bagian yang dipilih (tanpa animasi bila pengguna mengurangi gerakan) */
  lompat(k) {
    const el = k === 'rinci' ? document.querySelector('.lap-rinci') : k === 'sim' ? document.querySelector('.lap-sim') : document.querySelector('[data-bx="' + k + '"]');
    if (!el) { App.toast('Bagian ini belum tampil di periode ini'); return; }
    if (el.dataset && el.dataset.bx && this.tutup[el.dataset.bx]) { const h = el.querySelector('h2.lap-h'); if (h) this.ganti(h); }
    const kurang = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: kurang ? 'auto' : 'smooth', block: 'start' });
  },
  klik(e) {
    const lh = e.target.closest('h2.lap-h'); if (lh && lh.closest('#app') && window.matchMedia('(max-width:1023px)').matches) return this.ganti(lh);
    const an = e.target.closest('[data-an]'); if (an) { if (an.dataset.an === 'lompat') this.lompat(an.dataset.ke); else if (an.dataset.an === 'cetak') this.cetakAman(an); else this.eksporXls(); return true; }
    const lr = e.target.closest('[data-lr]'); if (lr) { this.rentang = Number(lr.dataset.lr); App.go('laporan', true); return true; }
    const sh = e.target.closest('[data-sh]'), sbb = e.target.closest('[data-sb]');
    if (sh || sbb) { if (sh) this.simH = Number(sh.dataset.sh); else this.simB = Number(sbb.dataset.sb); App.go('laporan', true); return true; }
    const lg = e.target.closest('[data-lg]'); if (lg) { this.tanpaGaji = lg.dataset.lg === 'true'; App.go('laporan', true); return true; }
    const p = e.target.closest('[data-lp]'), d = e.target.closest('[data-ld]');
    if (p) { this.per = p.dataset.lp; if (this.per === 'kustom' && !this.dari && !this.sampai) { this.dari = bulanIni() + '-01'; this.sampai = isoHari(); } } else if (d) this.dim = d.dataset.ld; else return false;
    App.go('laporan', true); return true;
  }
};

document.addEventListener('pointerdown', (e) => Analisa.sentuh(e));
document.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons || e.pressure) Analisa.sentuh(e); });

document.addEventListener('toggle', (e) => { if (e.target && e.target.id === 'lapSim') Analisa.simBuka = e.target.open; }, true);
