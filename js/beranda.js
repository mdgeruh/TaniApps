/* Buku Kebun — Beranda yang ringkas: perlu perhatian, kas, banding bulan lalu (grafik dan analisa ada di Laporan sejak v0.1.172) */
const Beranda = {
  m(n) { return '<span data-mask data-val="' + rp(n) + '">' + rp(n) + '</span>'; },
  per(k) { const a = Analisa.agg()[k] || { m: 0, h: 0, n: 0 }; return { m: a.m, h: a.h, u: a.h - a.m, n: a.n }; }, /* dari agregat bulanan bersama (Analisa.agg) */
  delta(a, b, baikNaik) {
    if (!b && !a) return '<span class="mu">—</span>';
    const d = a - b; if (!d) return '<span class="mu">sama</span>';
    const baik = (d > 0) === baikNaik;
    const pr = b ? ' <span class="mu">(' + (d > 0 ? '+' : '−') + Math.min(999, Math.round(Math.abs(d) / Math.abs(b) * 100)) + '%)</span>' : ''; // persen terhadap pembanding; tanpa bila pembanding 0
    return '<span class="' + (baik ? 'up' : 'down') + '">' + '<span aria-hidden="true">' + (d > 0 ? '▲ ' : '▼ ') + '</span>' + (d > 0 ? 'naik ' : 'turun ') + Beranda.m(Math.abs(d)) + '</span>' + pr;
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
    if (typeof Stok !== 'undefined') Stok.menipis().forEach((x) => out.push(ke((x.sisa <= 0 ? '⚠ ' : '⏰ ') + 'Stok ' + esc(x.nama) + (x.sisa <= 0 ? ' habis' : ' tinggal ' + Stok.qTeks(x.sisa) + ' ' + esc(x.satuan)), 'data-bstok="1" aria-label="Buka Rencana, Stok"')));
    const ij = Number(Setelan.get('ingatJurnal')) || 0;
    if (ij) Siklus.daftar().filter((s) => s.status === 'berjalan').forEach((s) => { const L = Jurnal.of(s.id), n = Jurnal.hariKe(s, hari) - Jurnal.hariKe(s, L.length ? L[0].tanggal : s.mulai);
      if (n >= ij) out.push(ke('✎ ' + esc(Siklus.nama(s.id)) + ': belum ada catatan jurnal ' + n + ' hari', 'data-do="buka-siklus" data-id="' + s.id + '" aria-label="Buka siklus ' + esc(Siklus.nama(s.id)) + '"')); });
    out.unshift(...pn.sort((x, y) => x[0] - y[0]).map((x) => x[1])); // pengingat panen paling atas
    return out.sort((x, y) => (x.t.charAt(0) === '⚠' ? 0 : 1) - (y.t.charAt(0) === '⚠' ? 0 : 1)); // yang sudah lewat (⚠) paling atas; urutan lain tetap (sort stabil)
  },
  jumlah() { return this.daftar().length; },
  /* Ikon SVG seragam pengganti emoji (v0.1.129); teks bantu pembaca layar menggantikan arti emoji */
  ik(t) {
    const M = { '⚠': ['lewat', 'Terlambat: ', '<path d="M12 4l9 16H3zM12 10v4M12 17v.5"/>'], '⏰': ['dekat', 'Segera: ', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'], '✎': ['jurnal', 'Jurnal: ', '<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>'] }[t.charAt(0)];
    return M ? '<svg class="pi ' + M[0] + '" viewBox="0 0 24 24" aria-hidden="true">' + M[2] + '</svg><span class="sr-only">' + M[1] + '</span>' + t.slice(2) : t;
  },
  perhatian() {
    const out = this.daftar();
    const tampil = this.semua ? out : out.slice(0, 3);
    const lw = out.some((x) => x.t.charAt(0) === '⚠');
    const ban = out.length ? '<button type="button" class="pt-ban' + (lw ? ' lewat' : '') + '" data-bb="1" aria-expanded="' + !!this.buka + '"><span class="pt-ik" aria-hidden="true">!</span><span class="pt-tx"><strong>Perlu perhatian</strong><span>' + out[0].t.slice(2) + '</span></span><span class="pt-n">' + out.length + ' item</span><span class="pt-ch" aria-hidden="true">›</span></button>' : '';
    return out.length ? '<section data-bx="perhatian" class="pt-sec' + (this.buka ? ' terbuka' : '') + '">' + ban + '<h2>Perlu perhatian</h2>' + tampil.map((x) => '<div class="row row-tuju" role="button" tabindex="0" ' + x.a + '><span>' + this.ik(x.t) + '</span><span class="mu" aria-hidden="true">›</span></div>').join('') +
      (out.length > 3 ? '<button type="button" class="btn" data-bp="1" style="width:100%;margin-top:10px">' + (this.semua ? 'Ringkas' : 'Lihat semua (' + out.length + ')') + '</button>' : '') + '</section>' : '';
  },
  atas() { return App.aktif().length ? this.perhatian() : ''; },
  /* v0.1.199: subbagian Ringkasan uang bisa dilipat di HP/tablet (keadaan diingat lewat Lipat); desktop selalu terbuka */
  lp(k, judul, isi, def) {
    if (!isi) return '';
    const desk = !!(window.matchMedia && matchMedia('(min-width:1024px)').matches);
    return '<details class="lipat bd-lipat' + (desk ? ' tetap' : '') + '" data-lipat="br-' + k + '" data-def="' + (def ? 1 : 0) + '"' + (desk || Lipat.buka('br-' + k, def) ? ' open' : '') + '><summary' + (desk ? ' tabindex="-1"' : '') + '><h3>' + judul + '</h3></summary>' + isi + '</details>';
  },
  /* Dibanding periode setara (sama dengan hero) dan Posisi kas; diletakkan sesudah Siklus berjalan (v0.1.127) */
  uang() {
    const P = App.periodeSetara(), a = P.kini, b = P.lalu;
    const saldo = Utang.saldo();
    const U = App.data.utang.filter((u) => !u.terhapus && !u.lunas), tot = (j) => U.filter((u) => u.jenis === j).reduce((s, u) => s + Utang.sisa(u), 0);
    const row = (x, y) => '<div class="row"><span class="mu">' + x + '</span><span>' + y + '</span></div>';
    if (!App.aktif().length) return '';
    /* v0.1.154: usaha tani musiman (modal di awal, hasil saat panen), jadi untung bulanan bisa menyesatkan: tampilkan juga untung siklus berjalan sampai hari ini */
    const SB = Siklus.daftar().filter((s) => s.status === 'berjalan').map((s) => Siklus.ringkas(s.id)), sm = SB.reduce((x, r) => x + r.modal, 0), sh = SB.reduce((x, r) => x + r.hasil, 0);
    const kb = Utang.bulan(bulanIni()), KB = (kb.masuk || kb.keluar) ? row('Kas masuk bulan ini', '<span class="up">' + this.m(kb.masuk) + '</span>') + row('Kas keluar bulan ini', '<span class="down">' + this.m(kb.keluar) + '</span>') + (kb.masuk - kb.keluar !== a.u ? '<p class="note">Kas hanya menghitung uang yang benar-benar bergerak, jadi bisa berbeda dari untung (utang dan piutang belum dihitung).</p>' : '') : '';
    const sik = (sm || sh) ? row('Modal', this.m(sm)) + row('Hasil', this.m(sh)) + row('Untung', '<strong class="' + (sh - sm < 0 ? 'down' : 'up') + '">' + (sh - sm < 0 ? '−' : '') + this.m(Math.abs(sh - sm)) + '</strong>') + '<p class="note">Dari ' + SB.length + ' siklus berjalan; belum tentu sudah panen, jadi bisa masih rugi.</p>' : '';
    const dib = row('Untung', this.delta(a.u, b.u, true)) + row('Modal', this.delta(a.m, b.m, false)) + row('Hasil', this.delta(a.h, b.h, true)) +
      (b.n ? '<p class="note">Periode setara: tanggal 1–' + P.a2.slice(8) + ' di kedua bulan.</p>' : '<p class="note">Belum ada transaksi di periode sama bulan lalu sebagai pembanding.</p>');
    const pos = KB + row('Saldo kas', '<strong class="' + (saldo >= 0 ? 'up' : 'down') + '">' + this.m(saldo) + '</strong>') +
      (U.length ? row('Utang belum lunas', '<span class="down">' + this.m(tot('utang')) + '</span>') + row('Piutang belum lunas', '<span class="up">' + this.m(tot('piutang')) + '</span>') : '');
    return '<section data-bx="uang"><h2>Ringkasan uang</h2>' + this.lp('sik', 'Siklus berjalan · sampai hari ini', sik, true) + this.lp('dib', 'Dibanding bulan lalu', dib, false) + this.lp('pos', 'Posisi kas · semua waktu', pos, true) + '</section>';
  }
};
