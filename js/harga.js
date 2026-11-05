/* Tani Keuangan — katalog harga pasar (input manual) dan pembanding harga (v0.1.052, docs/HARGA.md)
   Disimpan di komoditas.hargaPasar = [{ id, tanggal, harga, sumber }]; harga per satuan komoditas. */
const Harga = {
  pilih: '',
  daftar(k) { return (k.hargaPasar || []).slice().sort((a, b) => String(b.tanggal).localeCompare(a.tanggal)); },
  terakhir(k) { return k ? this.daftar(k)[0] || null : null; },
  /* perubahan harga terakhir terhadap sebelumnya: { pct } atau null */
  ubah(k) { const L = this.daftar(k); return L.length > 1 && L[1].harga ? { pct: Math.round((L[0].harga - L[1].harga) / L[1].harga * 100) } : null; },
  /* harga jual rata-rata sendiri (tertimbang jumlah panen bersih) untuk panen berharga 90 hari terakhir */
  sendiri(kid) {
    const batas = Jadwal.tambahHari(isoHari(), -90); let q = 0, nilai = 0;
    App.data.panen.filter((p) => !p.terhapus && p.hargaPerSatuan > 0 && p.tanggal >= batas).forEach((p) => {
      const s = Siklus.cari(p.siklusId); if (!s || s.komoditasId !== kid) return;
      const b = Math.max(0, p.kuantitasKotor - p.susut); q += b; nilai += b * p.hargaPerSatuan;
    });
    return q ? nilai / q : null;
  },
  pembanding(k) {
    const t = this.terakhir(k), h = this.sendiri(k.id); if (!t || !h) return '';
    const pct = Math.round((h - t.harga) / t.harga * 100);
    return this.baris('Harga jualmu (90 hari)', rp(Math.round(h)) + '/' + esc(k.satuan)) +
      this.baris('Dibanding pasar', pct === 0 ? 'sama' : '<span class="' + (pct > 0 ? 'up' : 'down') + '">' + Math.abs(pct) + '% ' + (pct > 0 ? 'di atas' : 'di bawah') + ' pasar</span>');
  },
  /* garis tren harga (maks. 12 catatan terakhir, urut waktu) */
  tren(L) {
    if (L.length < 2) return '';
    const P = L.slice(0, 12).reverse(), hs = P.map((p) => p.harga), mn = Math.min(...hs), mx = Math.max(...hs), n = P.length - 1;
    return '<svg class="kas-spark" viewBox="0 0 300 40" preserveAspectRatio="none" role="img" aria-label="Tren harga pasar ' + P.length + ' catatan terakhir"><polyline points="' + P.map((p, i) => (2 + i / n * 296).toFixed(1) + ',' + (37 - (p.harga - mn) / ((mx - mn) || 1) * 34).toFixed(1)).join(' ') + '"/></svg>';
  },
  baris(a, b) { return '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>'; },
  v() {
    const K = Siklus.koms();
    if (!K.length) return '<section><p class="note">Belum ada komoditas. Tambahkan dulu di menu Unit.</p></section>';
    const k = K.find((x) => x.id === this.pilih) || K[0]; this.pilih = k.id;
    const L = this.daftar(k), t = L[0], u = this.ubah(k);
    const opsi = K.map((x) => '<option value="' + x.id + '"' + (x.id === k.id ? ' selected' : '') + '>' + esc(x.nama) + '</option>').join('');
    const row = (p) => '<button type="button" class="ang-baris" data-rc="harga-detail" data-id="' + k.id + '|' + p.id + '" aria-label="Detail harga ' + Setelan.tgl(p.tanggal) + ' ' + rp(p.harga) + '"><div class="bar-top"><strong>' + rp(p.harga) + '/' + esc(k.satuan) + '</strong><span class="mu">' + Setelan.tgl(p.tanggal) + (p.sumber ? ' · ' + esc(p.sumber) : '') + '</span></div></button>';
    const hist = L.slice(0, 5).map(row).join(''), sisa = L.slice(5).map(row).join('');
    return '<section><p class="note">Catat harga pasar sendiri (manual) lewat tombol + untuk membandingkan dengan harga jualmu.</p>' +
      '<label for="hp_kom">Komoditas</label><select id="hp_kom" data-hk>' + opsi + '</select>' +
      (t ? '<div style="margin-top:12px">' + this.baris('Harga pasar terakhir', '<strong>' + rp(t.harga) + '/' + esc(k.satuan) + '</strong>') + this.baris('Dicatat', Setelan.tgl(t.tanggal) + (t.sumber ? ' · ' + esc(t.sumber) : '')) +
        (u ? this.baris('Dari catatan sebelumnya', u.pct === 0 ? 'tetap' : '<span class="' + (u.pct > 0 ? 'up' : 'down') + '">' + (u.pct > 0 ? '▲ ' : '▼ ') + Math.abs(u.pct) + '%</span>') : '') + this.pembanding(k) + '</div>' : '<p class="note" style="margin-top:12px">Belum ada harga pasar untuk ' + esc(k.nama) + '. Ketuk tombol + untuk mencatat.</p>') + '</section>' +
      (L.length ? '<section><h2>Riwayat</h2>' + this.tren(L) + '<div>' + hist + '</div>' + (sisa ? '<details class="lg-detail"><summary>Lihat semua (' + L.length + ')</summary><div>' + sisa + '</div></details>' : '') + '</section>' : '');
  },
  cek(h, tgl) {
    if (!(h > 0)) return 'Isi harga pasar lebih dari 0.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return 'Isi tanggal.';
    if (tgl > isoHari()) return 'Tanggal tidak boleh di masa depan.';
    return '';
  },
  /* simpan satu harga pasar; kembalikan pesan galat atau '' (dipanggil dari modal FAB, v0.1.055) */
  simpan(k, h, tgl, sumber) {
    const e = this.cek(h, tgl); if (e) return e;
    (k.hargaPasar = k.hargaPasar || []).push({ id: uid('h'), tanggal: tgl, harga: h, sumber: sumber });
    k.diubah = nowIso(); return '';
  },
  /* id gabungan "idKomoditas|idHarga" (v0.1.062) */
  cari(gid) {
    const [kid, hid] = String(gid).split('|'), k = Siklus.kom(kid), p = k && (k.hargaPasar || []).find((x) => x.id === hid);
    return p ? { k: k, p: p } : null;
  },
  edit(gid, h, tgl, sumber) {
    const r = this.cari(gid); if (!r) return 'Catatan harga tidak ditemukan.';
    const e = this.cek(h, tgl); if (e) return e;
    Object.assign(r.p, { harga: h, tanggal: tgl, sumber: sumber }); r.k.diubah = nowIso(); return '';
  },
  hapus(gid) {
    const r = this.cari(gid); if (!r) return;
    const i = r.k.hargaPasar.indexOf(r.p), rec = r.k.hargaPasar.splice(i, 1)[0], k = r.k; k.diubah = nowIso();
    Rencana.dlgTutup(true); App.simpan(); App.go('rencana', true); Modal.pulihFokus();
    App.toast('Harga pasar dihapus', { label: 'Urungkan', fn: () => { k.hargaPasar.push(rec); k.diubah = nowIso(); App.simpan(); App.go('rencana', true); } });
  }
};
