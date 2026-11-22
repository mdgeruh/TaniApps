/* Buku Kebun — Buku pembeli (v0.1.193, docs/PEMBELI.md)
   Daftar pembeli atau tengkulak yang DIHITUNG dari data yang sudah ada: nama `pembeli` pada panen dan `pihak` pada piutang.
   Tanpa koleksi atau kolom baru, jadi impor, cadangan, ekspor JSON, dan sinkron tidak berubah.
   Nama dicocokkan tanpa membedakan huruf besar kecil dan spasi ganda ("Pak Joko" = "pak  joko").
   Menampilkan: penjualan, jumlah panen, rata-rata harga per komoditas, harga terakhir, piutang, dan riwayat jual.
   Ganti nama (atau gabungkan dengan nama lain) memperbarui semua panen, catatan transaksi panen, dan piutang pembeli itu.
   Tampil sebagai sub-tab Pembeli di Rencana keuangan; detail lewat modal Rencana (Rencana.FORM). */
const Pembeli = {
  per: 'semua', batas: 20,
  PER: [['semua', 'Semua'], ['tahun', 'Tahun ini'], ['bulan', 'Bulan ini']],

  /* ---------- nama ---------- */
  rapi(n) { return String(n == null ? '' : n).trim().replace(/\s+/g, ' '); },
  kunci(n) { return this.rapi(n).toLowerCase(); },
  /* nama baku untuk disimpan di panen: bila sudah ada pembeli dengan nama sama (beda huruf besar kecil), pakai ejaan yang sudah ada */
  baku(n, kecuali) {
    const r = this.rapi(n), k = this.kunci(r); if (!k) return '';
    const ada = this.panenSemua().filter((p) => p.id !== kecuali && this.kunci(p.pembeli) === k).sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0]; // ejaan panen terbaru, sama seperti di daftar
    return ada ? this.rapi(ada.pembeli) : r;
  },
  dalam(tgl) { const h = isoHari(); return this.per === 'semua' || (this.per === 'tahun' ? tgl.slice(0, 4) === h.slice(0, 4) : tgl.slice(0, 7) === h.slice(0, 7)); },

  /* ---------- data ---------- */
  panenSemua() { return (App.data.panen || []).filter((p) => !p.terhapus && this.kunci(p.pembeli) && Siklus.cari(p.siklusId)); },
  bersih(p) { return (p.kuantitasKotor || 0) - (p.susut || 0); },
  nilai(p) { return p.hargaPerSatuan ? Math.round(this.bersih(p) * p.hargaPerSatuan) : 0; },
  kom(p) { const s = Siklus.cari(p.siklusId), k = s && Siklus.kom(s.komoditasId); return k ? { id: k.id, nama: k.nama, sat: k.satuan } : { id: '?', nama: '?', sat: '' }; },
  piutangSemua() { return (App.data.utang || []).filter((u) => !u.terhapus && u.jenis === 'piutang' && this.kunci(u.pihak) && Utang.sisa(u) > 0); },
  /* semua pembeli: { key, nama, panen: [semua panen], piutang: [piutang belum lunas], sisa } */
  daftar() {
    const M = {}, ambil = (nama) => { const k = this.kunci(nama); return M[k] || (M[k] = { key: k, nama: this.rapi(nama), panen: [], piutang: [], sisa: 0, tglNama: '' }); };
    this.panenSemua().sort((a, b) => a.tanggal.localeCompare(b.tanggal)).forEach((p) => { const x = ambil(p.pembeli); x.panen.push(p); if (p.tanggal > x.tglNama) { x.tglNama = p.tanggal; x.nama = this.rapi(p.pembeli); } });
    this.piutangSemua().forEach((u) => { const x = ambil(u.pihak); x.piutang.push(u); x.sisa += Utang.sisa(u); });
    return Object.keys(M).map((k) => M[k]);
  },
  cari(key) { return this.daftar().find((x) => x.key === key) || null; },
  /* rekap satu daftar panen: total, jumlah, dan per komoditas { nama, sat, qty (bersih), nilai, qtyHarga, terakhir: {tgl, harga}, rata } */
  rekap(P) {
    const K = {}; let tot = 0;
    P.slice().sort((a, b) => a.tanggal.localeCompare(b.tanggal)).forEach((p) => {
      const k = this.kom(p), x = K[k.id] || (K[k.id] = { nama: k.nama, sat: k.sat, qty: 0, nilai: 0, qtyHarga: 0, terakhir: null });
      x.qty += this.bersih(p); const n = this.nilai(p); tot += n;
      if (p.hargaPerSatuan) { x.nilai += n; x.qtyHarga += this.bersih(p); x.terakhir = { tgl: p.tanggal, harga: p.hargaPerSatuan }; }
    });
    const L = Object.keys(K).map((i) => Object.assign(K[i], { rata: K[i].qtyHarga > 0 ? Math.round(K[i].nilai / K[i].qtyHarga) : 0 })).sort((a, b) => b.nilai - a.nilai || a.nama.localeCompare(b.nama, 'id'));
    return { n: P.length, total: tot, kom: L };
  },
  qTeks(n) { return fmtN(Math.round(n * 100) / 100); },
  barisKom(x) { return esc(x.nama) + ' ' + this.qTeks(x.qty) + ' ' + esc(x.sat) + (x.rata ? ' · rata-rata ' + rp(x.rata) + '/' + esc(x.sat) : ' · tanpa harga'); },

  /* ---------- tampilan: sub-tab Pembeli di Rencana ---------- */
  v() {
    const D = this.daftar();
    if (!D.length) return '<section><p class="note">Belum ada pembeli. Isi kolom Pembeli saat mencatat panen (Siklus → Catat panen) dan pembeli otomatis tampil di sini, lengkap dengan total penjualan, rata-rata harga, dan piutangnya.</p></section>';
    const chips = '<div class="seg sm" style="justify-content:flex-start;margin:0 0 6px">' + this.PER.map((x) => '<button type="button" class="btn' + (this.per === x[0] ? ' on' : '') + '" data-rc="pbl" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    const R = D.map((x) => Object.assign({ r: this.rekap(x.panen.filter((p) => this.dalam(p.tanggal))) }, x)).filter((x) => x.r.n || x.sisa > 0);
    R.sort((a, b) => b.r.total - a.r.total || b.sisa - a.sisa || a.nama.localeCompare(b.nama, 'id'));
    const jml = R.filter((x) => x.r.n).length, jual = R.reduce((a, x) => a + x.r.total, 0), piu = D.reduce((a, x) => a + x.sisa, 0);
    const ring = '<div class="sum"><div><span class="note">Pembeli</span><strong>' + jml + '</strong></div><div><span class="note">Penjualan</span><strong class="up">' + rp(jual) + '</strong></div><div><span class="note">Piutang</span><strong class="' + (piu > 0 ? 'down' : '') + '">' + rp(piu) + '</strong></div></div>';
    const baris = (x) => '<button type="button" class="ang-baris" data-rc="pbl-detail" data-id="' + esc(x.key) + '" aria-label="Detail pembeli ' + esc(x.nama) + '"><div class="bar-top"><strong>' + esc(x.nama) + '</strong><span class="mu">' + (x.r.n ? rp(x.r.total) : '—') + '</span></div>' +
      '<div class="note">' + (x.r.n ? x.r.n + ' panen' + (x.r.kom.length ? ' · ' + this.barisKom(x.r.kom[0]) + (x.r.kom.length > 1 ? ' · +' + (x.r.kom.length - 1) + ' komoditas' : '') : '') : 'Tidak ada panen pada periode ini') + (x.sisa > 0 ? '<span class="lencana">Piutang ' + rp(x.sisa) + '</span>' : '') + '</div></button>';
    return '<section>' + chips + ring + '<p class="note" style="margin:8px 0 0">Piutang selalu seluruh waktu; penjualan mengikuti periode.</p></section>' +
      '<section><h2>Daftar pembeli</h2><p class="note">Ketuk pembeli untuk melihat riwayat jual, rata-rata harga, dan piutangnya, atau untuk mengganti nama dan menggabungkan ejaan yang berbeda.</p>' + (R.length ? R.slice(0, this.batas).map(baris).join('') +
        (R.length > this.batas ? '<button type="button" class="btn" data-rc="pbl-lagi" style="width:100%;margin-top:8px">Tampilkan lebih banyak (' + (R.length - this.batas) + ')</button>' : '') : '<p class="note">Belum ada pembeli pada periode ini.</p>') + '</section>';
  },
  aksi(a, b) {
    if (a === 'pbl') { this.per = b.dataset.v; this.batas = 20; } else if (a === 'pbl-lagi') this.batas += 20; else return false;
    App.go('rencana', true); return true;
  },
  /* untuk saran nama di form panen (datalist) */
  saran() { return this.daftar().filter((x) => x.panen.length).map((x) => x.nama).sort((a, b) => a.localeCompare(b, 'id')); },
  datalist() { return '<datalist id="dl_pembeli">' + this.saran().map((n) => '<option value="' + esc(n) + '"></option>').join('') + '</datalist>'; },

  /* ---------- ganti nama / gabung ---------- */
  ganti(key, baru) {
    const nama = this.rapi(baru), D = App.data, n = { panen: 0, piutang: 0 };
    D.panen.forEach((p) => {
      if (p.terhapus || this.kunci(p.pembeli) !== key) return;
      const lama = this.rapi(p.pembeli), t = p.transaksiId && D.transaksi.find((x) => x.id === p.transaksiId);
      p.pembeli = nama; p.diubah = nowIso(); n.panen++;
      if (t && typeof t.catatan === 'string' && t.catatan.endsWith(' ke ' + lama)) { t.catatan = t.catatan.slice(0, -lama.length) + nama; t.diubah = nowIso(); }
    });
    D.utang.forEach((u) => { if (!u.terhapus && u.jenis === 'piutang' && this.kunci(u.pihak) === key) { u.pihak = nama; u.diubah = nowIso(); n.piutang++; } });
    return n;
  }
};

/* ---------- formulir dan detail (mesin modal Rencana) ---------- */
Rencana.FORM.pembeliDetail = {
  jenis: 'Buku pembeli', judul: 'Detail pembeli', ada(id) { return !!Pembeli.cari(id); }, judulFn(id) { const x = Pembeli.cari(id); return x ? esc(x.nama) : 'Detail pembeli'; },
  isi(id) {
    const x = Pembeli.cari(id), B = (a, b) => Rencana.baris(a, b), r = Pembeli.rekap(x.panen), tgl = x.panen.map((p) => p.tanggal).sort();
    const kom = r.kom.map((k) => '<div class="note" style="margin:4px 0">' + Pembeli.barisKom(k) + (k.terakhir ? ' · terakhir ' + rp(k.terakhir.harga) + ' (' + Setelan.tgl(k.terakhir.tgl) + ')' : '') + '</div>').join('');
    const piu = x.piutang.slice().sort((a, b) => (a.jatuhTempo || '9999').localeCompare(b.jatuhTempo || '9999')).map((u) =>
      '<button type="button" class="ang-baris" data-rm="pu" data-uid="' + u.id + '" aria-label="Buka piutang ' + rp(Utang.sisa(u)) + '"><div class="bar-top"><strong>' + rp(Utang.sisa(u)) + '</strong><span class="mu">' + (u.jatuhTempo ? 'tempo ' + Setelan.tgl(u.jatuhTempo) : 'tanpa jatuh tempo') + '</span></div></button>').join('');
    const L = x.panen.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal) || String(b.dibuat || '').localeCompare(String(a.dibuat || '')));
    const riw = L.length ? '<div class="byr" role="list" aria-label="Riwayat jual">' + L.slice(0, 8).map((p) => { const k = Pembeli.kom(p);
      return '<div class="byr-baris" role="listitem"><span class="mu">' + Setelan.tgl(p.tanggal) + '</span><span>' + esc(k.nama) + ' ' + Pembeli.qTeks(Pembeli.bersih(p)) + ' ' + esc(k.sat) + (p.hargaPerSatuan ? ' · ' + rp(p.hargaPerSatuan) + '/' + esc(k.sat) : '') + '</span></div>'; }).join('') + '</div>' +
      (L.length > 8 ? '<p class="note">Menampilkan 8 terbaru dari ' + L.length + ' panen. Ubah atau hapus panen lewat detail siklusnya.</p>' : '') : '<p class="note">Belum ada panen untuk pembeli ini (hanya piutang).</p>';
    return B('Total penjualan', '<strong class="up">' + rp(r.total) + '</strong>') + B('Jumlah panen', String(r.n)) + (tgl.length ? B('Pertama dan terakhir', Setelan.tgl(tgl[0]) + (tgl.length > 1 && tgl[tgl.length - 1] !== tgl[0] ? ' – ' + Setelan.tgl(tgl[tgl.length - 1]) : '')) : '') +
      B('Piutang', x.sisa > 0 ? '<strong class="down">' + rp(x.sisa) + '</strong>' : 'tidak ada') + (kom ? '<h3 style="margin:12px 0 4px">Per komoditas</h3>' + kom : '') +
      (piu ? '<h3 style="margin:12px 0 4px">Piutang belum lunas</h3>' + piu : '') + '<h3 style="margin:12px 0 4px">Riwayat jual</h3>' + riw;
  },
  tombol() { return Rencana.bt('ubah', 'Ganti nama atau gabungkan', 'gold') + Rencana.bt('tutup', 'Tutup', ''); },
  aksi(a, id, b) {
    if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka('pembeliUbah', id); }
    else if (a === 'pu') { const uid2 = b.dataset.uid; Rencana.dlgTutup(true); Rencana.dlgBuka('utangDetail', uid2); }
  }
};
Rencana.FORM.pembeliUbah = {
  jenis: 'Buku pembeli', judul: 'Ganti nama pembeli', simpan: 'Simpan nama', fokus: 'rm_nama',
  ada(id) { return !!Pembeli.cari(id); },
  isi(id) {
    const x = Pembeli.cari(id), D = Pembeli.daftar().filter((y) => y.key !== id);
    return '<p class="note" style="margin-top:0">Semua panen, catatan transaksi panen, dan piutang atas nama <b>' + esc(x.nama) + '</b> ikut diganti. Isi dengan nama pembeli lain yang sudah ada untuk menggabungkan keduanya (mis. “Pak Joko” dan “Joko tengkulak”).</p>' +
      Rencana.lab('rm_nama', 'Nama pembeli', '<input id="rm_nama" maxlength="60" autocomplete="off" list="dl_pbl_ubah" value="' + esc(x.nama) + '"><datalist id="dl_pbl_ubah">' + D.map((y) => '<option value="' + esc(y.nama) + '"></option>').join('') + '</datalist>') +
      '<p class="note">Berlaku untuk ' + x.panen.length + ' panen dan ' + x.piutang.length + ' piutang. Untuk mengembalikan, ganti nama sekali lagi.</p>';
  },
  ok(v, id) {
    const x = Pembeli.cari(id); if (!x) return 'Pembeli tidak ditemukan.';
    const nama = Pembeli.rapi(v('rm_nama')), k = Pembeli.kunci(nama);
    if (!nama) return 'Isi nama pembeli.';
    if (nama === x.nama && k === id) return 'Nama belum berubah.';
    const lain = Pembeli.daftar().find((y) => y.key === k && y.key !== id), akhir = lain ? lain.nama : nama; // gabung: ikut ejaan pembeli yang sudah ada
    const n = Pembeli.ganti(id, akhir);
    return { toast: lain ? 'Digabung ke ' + akhir + ' (' + n.panen + ' panen, ' + n.piutang + ' piutang)' : 'Nama diganti (' + n.panen + ' panen, ' + n.piutang + ' piutang)' };
  }
};
