/* Tani Keuangan — Cadangan foto ke ZIP (Fase 6E Tahap 6, v0.1.094; docs/CADANGAN.md)
   Foto nota dan jurnal hanya di IndexedDB browser ini. ZIP berisi indeks.json + foto/<id>.<jpg|png|webp>, tanpa kompresi (memakai Xlsx.zip). */
const CadFoto = {
  KUNCI: 'tk-foto-cad', MAKS: 250 * 1048576, MAKSFOTO: 30 * 1048576,
  EKS: { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }, TIPE: { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' },
  terakhir() { try { return JSON.parse(Penyimpanan.get(this.KUNCI) || 'null'); } catch (e) { return null; } },
  /* kalimat status untuk Setelan: kapan cadangan terakhir dan berapa foto yang lebih baru */
  teks(L) {
    if (!L.length) return '';
    const t = this.terakhir(); if (!t) return ' Foto belum pernah dicadangkan.';
    const baru = L.filter((x) => (x.ms || 0) > t.ms).length;
    return ' Cadangan foto terakhir ' + Setelan.tgl(isoHari(new Date(t.ms))) + (baru ? '; ' + baru + ' foto belum dicadangkan.' : '; semua foto sudah dicadangkan.');
  },
  /* keterangan tiap foto: dari mana asalnya (jurnal atau transaksi) */
  meta(id) {
    const j = (App.data.jurnal || []).find((x) => !x.terhapus && (x.foto || []).includes(id));
    if (j) return { jenis: 'jurnal', siklusId: j.siklusId, tanggal: j.tanggal, ref: j.id };
    const t = App.data.transaksi.find((x) => x.notaId === id);
    return t ? { jenis: 'nota', siklusId: t.siklusId || null, tanggal: t.tanggal, ref: t.id } : { jenis: 'lepas' };
  },
  async buat() {
    const L = await Nota.semua(); if (!L.length) throw new Error('Belum ada foto untuk dicadangkan.');
    const total = L.reduce((a, r) => a + (r.ukuran || (r.blob && r.blob.size) || 0), 0);
    if (total > this.MAKS) throw new Error('Foto terlalu besar untuk satu ZIP (' + Nota.mb(total) + '). Hapus foto yang tidak perlu dulu.');
    const berkas = [], daftar = [];
    for (const r of L) {
      const eks = this.EKS[r.tipe] || 'jpg', nama = 'foto/' + r.id + '.' + eks;
      berkas.push({ nama: nama, data: new Uint8Array(await r.blob.arrayBuffer()) });
      daftar.push(Object.assign({ id: r.id, berkas: nama, tipe: r.tipe || 'image/jpeg', ukuran: r.ukuran || r.blob.size }, this.meta(r.id)));
    }
    berkas.unshift({ nama: 'indeks.json', data: JSON.stringify({ versi: 1, aplikasi: 'tani-keuangan', dibuat: new Date().toISOString(), foto: daftar }, null, 1) });
    return { zip: Xlsx.zip(berkas), n: L.length, total: total };
  },
  async ekspor() {
    const r = await this.buat(), a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([r.zip], { type: 'application/zip' })); a.download = 'tani-foto-' + isoHari() + '.zip';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    Penyimpanan.set(this.KUNCI, JSON.stringify({ ms: Date.now(), n: r.n }));
    return r;
  },
  /* pembaca ZIP sederhana: hanya berkas tanpa kompresi (hasil ekspor aplikasi ini) */
  baca(buf) {
    const d = new Uint8Array(buf), dv = new DataView(buf), dec = new TextDecoder(), out = []; let p = 0;
    if (d.length < 30 || dv.getUint32(0, true) !== 0x04034b50) throw new Error('Berkas ini bukan ZIP cadangan foto.');
    while (p + 30 <= d.length && dv.getUint32(p, true) === 0x04034b50) {
      const flag = dv.getUint16(p + 6, true), metode = dv.getUint16(p + 8, true), cs = dv.getUint32(p + 18, true), nl = dv.getUint16(p + 26, true), el = dv.getUint16(p + 28, true), mulai = p + 30 + nl + el;
      if (metode !== 0 || (flag & 8)) throw new Error('ZIP ini terkompresi; hanya ZIP hasil Cadangkan foto yang bisa dipulihkan.');
      if (mulai + cs > d.length) throw new Error('Berkas ZIP rusak atau terpotong.');
      out.push({ nama: dec.decode(d.subarray(p + 30, p + 30 + nl)), data: d.subarray(mulai, mulai + cs) }); p = mulai + cs;
    }
    return out;
  },
  async imporBuf(buf) {
    const L = this.baca(buf), ix = L.find((x) => x.nama === 'indeks.json'); if (!ix) throw new Error('indeks.json tidak ditemukan; ini bukan ZIP cadangan foto.');
    let idx; try { idx = JSON.parse(new TextDecoder().decode(ix.data)); } catch (e) { throw new Error('indeks.json tidak terbaca.'); }
    if (!idx || idx.versi !== 1 || !Array.isArray(idx.foto)) throw new Error('Versi cadangan foto tidak dikenal.');
    const peta = {}; L.forEach((x) => { peta[x.nama] = x.data; });
    const r = { baru: 0, ada: 0, lewat: 0 };
    for (const f of idx.foto) {
      const m = f && /^foto\/([A-Za-z0-9_]{3,40})\.(jpg|png|webp)$/.exec(String(f.berkas || '')), data = m && peta[f.berkas];
      if (!m || m[1] !== f.id || !data || !data.length || data.length > this.MAKSFOTO) { r.lewat++; continue; }
      if (await Nota.ambil(f.id)) { r.ada++; continue; }
      const tipe = this.TIPE[m[2]]; await Nota.simpan({ id: f.id, blob: new Blob([data], { type: tipe }), tipe: tipe, ukuran: data.length, ms: Date.now() }); r.baru++;
    }
    return r;
  },
  pilih() {
    const i = document.createElement('input'); i.type = 'file'; i.accept = '.zip,application/zip';
    i.onchange = () => { const f = i.files && i.files[0]; if (f) this.impor(f); };
    i.click();
  },
  async impor(file) {
    try {
      if (file.size > this.MAKS + 5242880) throw new Error('Berkas terlalu besar.');
      const r = await this.imporBuf(await file.arrayBuffer());
      App.toast(r.baru + ' foto dipulihkan' + (r.ada ? ', ' + r.ada + ' sudah ada' : '') + (r.lewat ? ', ' + r.lewat + ' dilewati' : '')); Foto.isiInfo();
      if (App.tab) App.go(App.tab, true);
    } catch (e) { App.toast(e && e.message ? e.message : 'Foto tidak bisa dipulihkan'); }
  },
  async aksiEkspor() {
    try { const r = await this.ekspor(); App.toast(r.n + ' foto dicadangkan (' + Nota.mb(r.total) + ')'); Foto.isiInfo(); }
    catch (e) { App.toast(e && e.message ? e.message : 'Cadangan foto gagal'); }
  }
};
