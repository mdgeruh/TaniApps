/* Buku Kebun — Pengalaman lintas siklus (Fase 6E Tahap 6, v0.1.103, docs/JURNAL.md bagian 7)
   Dari siklus SELESAI satu komoditas: panen pertama rata-rata hari ke-N dan lama rata-rata tiap tahap,
   dibandingkan dengan umur panen komoditas. Hanya saran; umur panen diubah bila pengguna mengetuk tombolnya. */
const Pengalaman = {
  /* panen pertama (hari ke-N) dan lama tiap tahap untuk satu siklus selesai */
  satu(s) {
    const P = Siklus.panenOf(s.id).slice().sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    if (!P.length) return null;
    const hp = Jurnal.hariKe(s, P[0].tanggal), T = Jurnal.of(s.id).filter((j) => j.jenis === 'tahap').slice().sort((a, b) => a.tanggal.localeCompare(b.tanggal) || String(a.dibuat).localeCompare(String(b.dibuat)));
    const akhir = Jurnal.hariKe(s, s.selesai || P[0].tanggal), lama = {};
    T.forEach((j, i) => { const sd = T[i + 1] ? Jurnal.hariKe(s, T[i + 1].tanggal) : Math.max(hp, 0) || akhir; lama[j.tahap] = (lama[j.tahap] || 0) + Math.max(0, sd - Jurnal.hariKe(s, j.tanggal)); });
    return { hp: hp, lama: lama };
  },
  untuk(k) {
    const R = Siklus.daftar().filter((s) => s.komoditasId === k.id && s.status === 'selesai').map((s) => this.satu(s)).filter((r) => r && r.hp >= 1);
    if (!R.length) return null;
    const rata = (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length), tahap = {};
    R.forEach((r) => Object.keys(r.lama).forEach((kd) => (tahap[kd] = tahap[kd] || []).push(r.lama[kd])));
    const daftar = Tahap.paketKom(k).daftar.filter((t) => tahap[t.kode]).map((t) => ({ nama: t.nama, hari: rata(tahap[t.kode]), n: tahap[t.kode].length }));
    return { n: R.length, hp: rata(R.map((r) => r.hp)), min: Math.min.apply(null, R.map((r) => r.hp)), maks: Math.max.apply(null, R.map((r) => r.hp)), tahap: daftar };
  },
  /* blok di modal detail komoditas */
  v(k) {
    const p = this.untuk(k); if (!p) return '';
    const u = k.umurPanenHari, d = u ? p.hp - u : null, baris = (a, b) => '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>';
    return '<div class="dm-sub">Pengalaman ' + p.n + ' siklus selesai</div>' +
      baris('Panen pertama rata-rata', 'hari ke-' + p.hp + (p.n > 1 ? ' <span class="note">(' + p.min + '–' + p.maks + ')</span>' : '')) +
      (u ? baris('Umur panen sekarang', '±' + u + ' hari' + (d ? ' · <span class="' + (d > 0 ? 'down' : 'up') + '">' + (d > 0 ? 'lebih lambat ' : 'lebih cepat ') + Math.abs(d) + ' hari</span>' : ' · sama')) : '') +
      p.tahap.map((t) => baris(esc(t.nama), 'rata-rata ' + t.hari + ' hari' + (p.n > 1 ? ' <span class="note">(' + t.n + ' siklus)</span>' : ''))).join('') +
      (u !== p.hp ? '<button type="button" class="btn" data-do="pengalaman-pakai" data-id="' + k.id + '" style="width:100%;margin-top:10px;min-height:44px">Pakai ' + p.hp + ' hari sebagai umur panen</button><p class="note" style="margin:6px 0 0">Hanya saran. Umur panen dipakai untuk perkiraan panen dan saran tahap.</p>' : '');
  },
  aksi(a, el) {
    if (a !== 'pengalaman-pakai') return false;
    const k = Siklus.kom(el.dataset.id), p = k && this.untuk(k); if (!k || !p) return true;
    const lama = k.umurPanenHari || null; k.umurPanenHari = p.hp; k.diubah = nowIso(); App.simpan();
    if (Siklus.dmEl) Siklus.dmGambar(); if (App.tab === 'master') App.go('master', true);
    App.toast('Umur panen ' + k.nama + ' menjadi ' + p.hp + ' hari', { label: 'Urungkan', fn: () => { k.umurPanenHari = lama; k.diubah = nowIso(); App.simpan(); if (Siklus.dmEl) Siklus.dmGambar(); if (App.tab === 'master') App.go('master', true); } });
    return true;
  }
};
