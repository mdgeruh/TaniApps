/* Buku Kebun — kalkulator kelayakan usaha: NPV, IRR, balik modal, PI (v0.1.053, docs/KELAYAKAN.md)
   Model sederhana: investasi awal, arus kas bersih tetap per periode, nilai sisa di akhir. Tidak memakai data transaksi kecuali tombol isi cepat. */
const Kelayakan = {
  s: null,
  BAWAAN: { invest: '', net: '', n: '12', sisa: '', d: '12', unit: 'bulan' },
  muat() { if (!this.s) this.s = Object.assign({}, this.BAWAAN, App.data.pengaturan.kelayakan || {}); return this.s; },
  /* hitung dari angka mentah; kembalikan { galat } atau hasil */
  hitung(x) {
    const inv = Number(x.invest) || 0, net = Number(x.net) || 0, n = Number(x.n) || 0, sisa = Number(x.sisa) || 0, d = Number(x.d);
    if (!(inv > 0)) return { galat: 'Isi investasi awal lebih dari 0.' };
    if (!Number.isInteger(n) || n < 1 || n > 120) return { galat: 'Jumlah periode 1 sampai 120.' };
    if (!(d >= 0 && d <= 100)) return { galat: 'Diskonto per tahun 0 sampai 100%.' };
    const bln = x.unit !== 'tahun', r = bln ? Math.pow(1 + d / 100, 1 / 12) - 1 : d / 100;
    const cf = [-inv]; for (let t = 1; t <= n; t++) cf.push(net + (t === n ? sisa : 0));
    const npv = (rate) => cf.reduce((a, c, t) => a + c / Math.pow(1 + rate, t), 0);
    let irr = null, lo = -0.99, hi = 10;
    if (npv(lo) * npv(hi) < 0) { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (npv(lo) * npv(m) <= 0) hi = m; else lo = m; } irr = (lo + hi) / 2; }
    let kum = -inv, balik = null;
    for (let t = 1; t <= n && balik === null; t++) { const baru = kum + cf[t]; if (baru >= 0 && cf[t] > 0) balik = t - 1 + (-kum) / cf[t]; kum = baru; }
    const total = cf.slice(1).reduce((a, c) => a + c, 0), v = npv(r);
    return { npv: v, irr: irr, irrTahun: irr === null ? null : (bln ? Math.pow(1 + irr, 12) - 1 : irr), balik: balik, pi: (v + inv) / inv, total: total, r: r, n: n, bln: bln, inv: inv, layak: v > 0 };
  },
  hasil(x) {
    const h = this.hitung(x); if (h.galat) return '<p class="note">' + esc(h.galat) + '</p>';
    const u = h.bln ? 'bulan' : 'tahun', baris = (a, b) => '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>', pct = (n) => (Math.round(n * 1000) / 10).toLocaleString('id-ID') + '%';
    return '<div class="row"><strong class="' + (h.layak ? 'up' : 'down') + '">' + (h.layak ? 'Layak' : 'Belum layak') + '</strong><span class="mu">' + (h.layak ? 'NPV positif' : 'NPV nol atau negatif') + '</span></div>' +
      baris('NPV (nilai sekarang bersih)', '<span class="' + (h.layak ? 'up' : 'down') + '">' + rp(Math.round(h.npv)) + '</span>') +
      baris('IRR per tahun', h.irrTahun === null ? 'tidak dapat dihitung' : pct(h.irrTahun)) +
      baris('Balik modal', h.balik === null ? 'tidak dalam ' + h.n + ' ' + u : (Math.round(h.balik * 10) / 10).toLocaleString('id-ID') + ' ' + u) +
      baris('Indeks profitabilitas (PI)', (Math.round(h.pi * 100) / 100).toLocaleString('id-ID')) +
      baris('Total arus kas masuk', rp(Math.round(h.total))) +
      '<p class="note">Layak bila NPV positif, yaitu IRR di atas diskonto. Diskonto ' + pct(h.r) + ' per ' + u + '. Model sederhana: arus kas dianggap tetap tiap periode.</p>';
  },
  v() {
    const s = this.muat(), f = (k) => s[k] === '' ? '' : fmtInput(Number(s[k]) || 0), unit = s.unit === 'tahun' ? 'tahun' : 'bulan';
    const inp = (id, lab, k, ph) => '<label for="kl_' + id + '">' + lab + '</label><input id="kl_' + id + '" data-kl="' + k + '" data-rp inputmode="numeric" autocomplete="off" placeholder="' + ph + '" value="' + f(k) + '">';
    return '<section><p class="note">Hitung apakah sebuah usaha atau investasi (mis. kolam, greenhouse, alat) layak dijalankan. Angka di sini tidak mengubah catatan keuanganmu.</p>' +
      '<div class="seg sm" style="justify-content:flex-start;margin:6px 0">' + [['bulan', 'Periode bulanan'], ['tahun', 'Periode tahunan']].map((x) => '<button type="button" class="btn' + (unit === x[0] ? ' on' : '') + '" data-rc="kl-unit" data-id="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>' +
      inp('invest', 'Investasi awal (Rp)', 'invest', '0') + inp('net', 'Arus kas bersih per ' + unit + ' (Rp)', 'net', '0') + inp('n', 'Jumlah ' + unit, 'n', '12') + inp('sisa', 'Nilai sisa di akhir (Rp, opsional)', 'sisa', '0') + '<label for="kl_d">Diskonto per tahun (%)</label><input id="kl_d" data-kl="d" inputmode="decimal" autocomplete="off" placeholder="12" value="' + esc(s.d) + '">' +
      '<div class="seg" style="margin-top:8px"><button type="button" class="btn" data-rc="kl-isi">Isi arus kas dari rata-rata 3 bulan</button></div></section>' +
      '<section><h2>Hasil</h2><div id="kl_hasil" aria-live="polite">' + this.hasil(s) + '</div></section>';
  },
  simpan() { App.data.pengaturan.kelayakan = Object.assign({}, this.s); App.simpan(); },
  /* dipanggil dari Rencana.klik */
  aksi(a, b) {
    const s = this.muat();
    if (a === 'kl-unit') { s.unit = b.dataset.id === 'tahun' ? 'tahun' : 'bulan'; }
    else if (a === 'kl-isi') { s.net = String(Math.round(Rencana.rata3())); s.unit = 'bulan'; if (!Number(s.net)) App.toast('Belum ada arus kas 3 bulan terakhir — isi manual'); }
    this.simpan(); App.go('rencana', true); return true;
  },
  masuk(e) {
    const i = e.target.closest && e.target.closest('[data-kl]'); if (!i) return;
    const s = this.muat(), k = i.dataset.kl;
    s[k] = k === 'd' ? i.value.replace(/[^\d.,]/g, '').replace(',', '.') : (i.value.trim() === '' ? '' : String(angka(i.value)));
    const h = document.getElementById('kl_hasil'); if (h) h.innerHTML = this.hasil(s);
    clearTimeout(this.t); this.t = setTimeout(() => this.simpan(), 600);
  }
};
document.addEventListener('input', (e) => Kelayakan.masuk(e));
