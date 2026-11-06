/* Tani Keuangan — Beranda yang lebih berguna (v0.1.018): perlu perhatian, kas, banding bulan lalu */
const Beranda = {
  m(n) { return '<span data-mask data-val="' + rp(n) + '">' + rp(n) + '</span>'; },
  per(k) { const tx = App.aktif().filter((t) => t.tanggal.slice(0, 7) === k); const m = App.jumlah(tx, 'keluar'), h = App.jumlah(tx, 'masuk'); return { m, h, u: h - m, n: tx.length }; },
  delta(a, b, baikNaik) {
    if (!b && !a) return '<span class="mu">—</span>';
    const d = a - b; if (!d) return '<span class="mu">sama</span>';
    const baik = (d > 0) === baikNaik;
    return '<span class="' + (baik ? 'up' : 'down') + '">' + (d > 0 ? '▲ ' : '▼ ') + Beranda.m(Math.abs(d)) + '</span>';
  },
  daftar() {
    const out = [], hari = isoHari(), d7 = isoHari(new Date(Date.now() + 7 * 864e5));
    const ke = (t, a) => ({ t, a }); // t = teks, a = atribut tujuan ketukan
    App.data.utang.filter((u) => !u.terhapus && !u.lunas && u.jatuhTempo && u.jatuhTempo <= d7).forEach((u) =>
      out.push(ke((u.jatuhTempo < hari ? '⚠ ' : '⏰ ') + (u.jenis === 'utang' ? 'Utang ke ' : 'Piutang dari ') + esc(u.pihak) + ' ' + rp(Utang.sisa(u)) + (u.jatuhTempo < hari ? ' sudah lewat jatuh tempo' : ' jatuh tempo ' + Setelan.tgl(u.jatuhTempo)), 'data-bu="1" aria-label="Buka Rencana, Utang/piutang"')));
    Siklus.daftar().filter((s) => s.status === 'berjalan' && s.anggaran).forEach((s) => {
      const r = Siklus.ringkas(s.id).modal, p = Math.round(r / s.anggaran * 100);
      if (p >= 90) out.push(ke((p > 100 ? '⚠ ' : '⏰ ') + esc(Siklus.nama(s.id)) + ': modal ' + p + '% dari anggaran', 'data-do="buka-siklus" data-id="' + s.id + '" aria-label="Buka siklus ' + esc(Siklus.nama(s.id)) + '"'));
    });
    const pn = []; Siklus.daftar().forEach((s) => { const pp = Siklus.panenPerkiraan(s); if (!pp || pp.sisa > 7) return;
      pn.push([pp.sisa, ke(pp.sisa < 0 ? '⚠ ' + esc(Siklus.nama(s.id)) + ': lewat perkiraan panen ' + (-pp.sisa) + ' hari' : '⏰ ' + esc(Siklus.nama(s.id)) + ': perkiraan panen ' + (pp.sisa === 0 ? 'hari ini' : pp.sisa + ' hari lagi'), 'data-do="buka-siklus" data-id="' + s.id + '" aria-label="Buka siklus ' + esc(Siklus.nama(s.id)) + '"')]); });
    Siklus.daftar().forEach((s) => { const k = Siklus.kom(s.komoditasId);
      Siklus.panenOf(s.id).filter((p) => !p.transaksiId && !p.hargaPerSatuan && p.tanggal <= hari).forEach((p) =>
        out.push(ke('⏰ ' + esc(Siklus.nama(s.id)) + ': panen ' + Setelan.tgl(p.tanggal) + ' (' + fmtN(p.kuantitasKotor - p.susut) + (k ? ' ' + esc(k.satuan) : '') + ') belum dijual', 'data-do="panen-belum-jual" data-id="' + p.id + '" data-sid="' + s.id + '" aria-label="Isi harga jual panen ' + esc(Siklus.nama(s.id)) + '"'))); });
    Jadwal.mendekat().forEach((x) => out.push(ke((x.n < 0 ? '⚠ ' : '⏰ ') + esc(Siklus.nama(x.s.id)) + ': ' + esc(x.j.nama) + ' ' + Jadwal.teks(x.j), 'data-do="buka-siklus" data-id="' + x.s.id + '" aria-label="Buka siklus ' + esc(Siklus.nama(x.s.id)) + '"')));
    const ij = Number(Setelan.get('ingatJurnal')) || 0;
    if (ij) Siklus.daftar().filter((s) => s.status === 'berjalan').forEach((s) => { const L = Jurnal.of(s.id), n = Jurnal.hariKe(s, hari) - Jurnal.hariKe(s, L.length ? L[0].tanggal : s.mulai);
      if (n >= ij) out.push(ke('✎ ' + esc(Siklus.nama(s.id)) + ': belum ada catatan jurnal ' + n + ' hari', 'data-do="buka-siklus" data-id="' + s.id + '" aria-label="Buka siklus ' + esc(Siklus.nama(s.id)) + '"')); });
    out.unshift(...pn.sort((x, y) => x[0] - y[0]).map((x) => x[1])); // pengingat panen paling atas
    return out;
  },
  jumlah() { return this.daftar().length; },
  perhatian() {
    const out = this.daftar();
    const tampil = this.semua ? out : out.slice(0, 3);
    return out.length ? '<section data-bx="perhatian"><h2>Perlu perhatian</h2>' + tampil.map((x) => '<div class="row row-tuju" role="button" tabindex="0" ' + x.a + '><span>' + x.t + '</span><span class="mu" aria-hidden="true">›</span></div>').join('') +
      (out.length > 3 ? '<button type="button" class="btn" data-bp="1" style="width:100%;margin-top:10px">' + (this.semua ? 'Ringkas' : 'Lihat semua (' + out.length + ')') + '</button>' : '') + '</section>' : '';
  },
  atas() {
    const ini = bulanIni(), lalu = bulanLalu(), a = this.per(ini), b = this.per(lalu);
    const saldo = Utang.saldo();
    const U = App.data.utang.filter((u) => !u.terhapus && !u.lunas), tot = (j) => U.filter((u) => u.jenis === j).reduce((s, u) => s + Utang.sisa(u), 0);
    const row = (x, y) => '<div class="row"><span class="mu">' + x + '</span><span>' + y + '</span></div>';
    if (!App.aktif().length) return '';
    return this.perhatian() +
      '<section data-bx="banding"><h2>Dibanding bulan lalu</h2>' + row('Untung', this.delta(a.u, b.u, true)) + row('Modal', this.delta(a.m, b.m, false)) + row('Hasil', this.delta(a.h, b.h, true)) +
      (b.n ? '' : '<p class="note">Belum ada transaksi bulan lalu sebagai pembanding.</p>') + '</section>' +
      '<section data-bx="kas"><h2>Posisi kas</h2>' + row('Saldo kas (semua waktu)', '<strong class="' + (saldo >= 0 ? 'up' : 'down') + '">' + this.m(saldo) + '</strong>') +
      (U.length ? row('Utang belum lunas', '<span class="down">' + this.m(tot('utang')) + '</span>') + row('Piutang belum lunas', '<span class="up">' + this.m(tot('piutang')) + '</span>') : '') + '</section>';
  },
  /* ---------- grafik di Beranda (v0.1.021) ---------- */
  untungBulanan() {
    const T = Analisa.bulanN(6).map((r) => ({ n: r.n, u: r.h - r.m }));
    if (!T.some((r) => r.u)) return '';
    const mx = Math.max(1, ...T.map((r) => Math.abs(r.u))), Z = 72, S = 52, w = 50;
    const bars = T.map((r, i) => {
      const h = Math.max(r.u ? 2 : 0, Math.abs(r.u) / mx * S), x = i * w + 14, up = r.u >= 0, y = up ? Z - h : Z;
      return '<rect x="' + x + '" y="' + y + '" width="22" height="' + h + '" rx="3" fill="var(' + (up ? '--fill' : '--loss') + ')"><title>' + r.n + ': ' + rp(r.u) + '</title></rect>' +
        '<text x="' + (x + 11) + '" y="' + (up ? y - 3 : y + h + 10) + '" text-anchor="middle" font-size="8" fill="var(--paper-faint)">' + (r.u ? (up ? '' : '−') + Analisa.ringkasAngka(r.u) : '') + '</text>' +
        '<text x="' + (x + 11) + '" y="146" text-anchor="middle" font-size="10" fill="var(--paper-faint)">' + r.n + '</text>';
    }).join('');
    return '<section class="dash"><h2>Untung bersih per bulan</h2><svg viewBox="0 0 300 150" width="100%" role="img" aria-label="Untung bersih per bulan, 6 bulan terakhir"><line x1="0" x2="300" y1="' + Z + '" y2="' + Z + '" stroke="var(--line-soft)"/>' + bars + '</svg>' +
      '<p class="note"><span style="color:var(--fill)">■</span> Untung &nbsp; <span style="color:var(--loss)">■</span> Rugi · 6 bulan terakhir</p></section>';
  },
  donut(bln) {
    const biaya = bln.filter((t) => t.jenis === 'keluar'), tot = App.jumlah(biaya, 'keluar');
    if (!tot) return '';
    const per = {}; biaya.forEach((t) => { per[t.kategoriId] = (per[t.kategoriId] || 0) + t.jumlah; });
    const ks = Object.keys(per).sort((a, b) => per[b] - per[a]);
    const seg = ks.slice(0, 5).map((k) => ({ n: App.namaKat(k), v: per[k] })), sisa = ks.slice(5).reduce((s, k) => s + per[k], 0);
    if (sisa) seg.push({ n: 'Lainnya', v: sisa });
    const W = ['var(--fill)', 'var(--gold)', 'var(--loss)', 'var(--paper-dim)', 'var(--paper-faint)', 'var(--line)'], C = 2 * Math.PI * 40;
    let off = 0;
    const arcs = seg.map((s, i) => {
      const len = s.v / tot * C, el = '<circle cx="60" cy="60" r="40" fill="none" stroke="' + W[i] + '" stroke-width="18" stroke-dasharray="' + len.toFixed(2) + ' ' + (C - len).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 60 60)"><title>' + esc(s.n) + ': ' + Math.round(s.v / tot * 100) + '%</title></circle>';
      off += len; return el;
    }).join('');
    const legenda = seg.map((s, i) => '<div class="bar-top" style="margin:7px 0"><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:' + W[i] + ';margin-right:6px"></i>' + esc(s.n) + '</span><span class="mu">' + Math.round(s.v / tot * 100) + '%</span></div>').join('');
    return '<section class="dash"><h2>Komposisi modal bulan ini</h2><div style="display:flex;align-items:center;gap:14px"><svg viewBox="0 0 120 120" width="130" height="130" role="img" aria-label="Komposisi modal bulan ini">' + arcs +
      '<text x="60" y="57" text-anchor="middle" font-size="9" fill="var(--paper-faint)">Modal</text><text x="60" y="69" text-anchor="middle" font-size="9" fill="var(--paper-faint)">bulan ini</text></svg>' +
      '<div style="flex:1;min-width:0">' + legenda + '</div></div><p class="note">Total modal bulan ini: ' + this.m(tot) + '</p></section>';
  },
  perKomoditas() {
    const k = { d: Analisa.dim, p: Analisa.per }; let L;
    Analisa.dim = 'komoditas'; Analisa.per = 'semua';
    try { L = Analisa.hitung().filter((r) => r.nama !== 'Tanpa siklus'); } finally { Analisa.dim = k.d; Analisa.per = k.p; }
    L = L.sort((a, b) => b.untung - a.untung).slice(0, 5);
    if (!L.length) return '';
    const mx = Math.max(1, ...L.map((r) => Math.abs(r.untung)));
    return '<section class="dash"><h2>Untung per komoditas</h2>' + L.map((r) => {
      const p = Math.max(r.untung ? 3 : 0, Math.round(Math.abs(r.untung) / mx * 100));
      return '<div class="bar-row"><div class="bar-top"><span>' + esc(r.nama) + (r.rc ? ' <span class="mu">· R/C ' + r.rc.toFixed(2).replace('.', ',') + '</span>' : '') + '</span><strong class="' + (r.untung >= 0 ? 'up' : 'down') + '">' + this.m(r.untung) + '</strong></div>' +
        '<div class="bar"><i style="width:' + p + '%;background:var(' + (r.untung >= 0 ? '--fill' : '--loss') + ')"></i></div></div>';
    }).join('') + '<p class="note">Semua waktu, hanya siklus yang tercatat.</p></section>';
  },
  anggaran() {
    const L = Siklus.daftar().filter((s) => s.status === 'berjalan' && s.anggaran);
    if (!L.length) return '';
    return '<section class="dash"><h2>Modal vs anggaran (siklus berjalan)</h2>' + L.map((s) => {
      const r = Siklus.ringkas(s.id).modal, p = Math.round(r / s.anggaran * 100);
      return '<div class="bar-row"><div class="bar-top"><span>' + esc(Siklus.nama(s.id)) + '</span><span class="' + (p > 100 ? 'down' : 'mu') + '" style="white-space:nowrap;margin-left:10px">' + p + '% · ' + this.m(r) + '</span></div>' +
        '<div class="bar"><i style="width:' + Math.min(p, 100) + '%;background:var(' + (p > 100 ? '--loss' : p >= 90 ? '--gold' : '--fill') + ')"></i></div></div>';
    }).join('') + '</section>';
  },
  grafik(bln) {
    if (!App.aktif().length) return '';
    return Analisa.vGrafik() + this.untungBulanan() + this.donut(bln) + this.perKomoditas() + this.anggaran();
  }
};
