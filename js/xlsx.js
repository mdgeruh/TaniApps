/* Tani Keuangan — ekspor Excel (.xlsx) multi-lembar tanpa pustaka luar (v0.1.054, docs/EKSPOR.md)
   Xlsx.buat(lembar) menghasilkan Uint8Array berkas .xlsx (ZIP tanpa kompresi); Xlsx.unduh() mengekspor seluruh data aplikasi. */
const Xlsx = {
  /* ---------- ZIP (metode simpan, tanpa kompresi) ---------- */
  crcT: null,
  crc(b) {
    if (!this.crcT) { this.crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; this.crcT[n] = c >>> 0; } }
    let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = this.crcT[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0;
  },
  zip(berkas) {
    const enc = new TextEncoder(), bagian = [], pusat = []; let pos = 0;
    const u16 = (n) => [n & 255, (n >>> 8) & 255], u32 = (n) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
    berkas.forEach((f) => {
      const nama = enc.encode(f.nama), d = typeof f.data === 'string' ? enc.encode(f.data) : f.data, c = this.crc(d);
      const kepala = [0x50, 0x4B, 3, 4, 20, 0, 0, 0, 0, 0, 0, 0, 33, 0].concat(u32(c), u32(d.length), u32(d.length), u16(nama.length), [0, 0]);
      bagian.push(Uint8Array.from(kepala), nama, d);
      pusat.push(Uint8Array.from([0x50, 0x4B, 1, 2, 20, 0, 20, 0, 0, 0, 0, 0, 0, 0, 33, 0].concat(u32(c), u32(d.length), u32(d.length), u16(nama.length), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], u32(pos))), nama);
      pos += kepala.length + nama.length + d.length;
    });
    const ukuran = pusat.reduce((a, b) => a + b.length, 0);
    const akhir = Uint8Array.from([0x50, 0x4B, 5, 6, 0, 0, 0, 0].concat(u16(berkas.length), u16(berkas.length), u32(ukuran), u32(pos), [0, 0]));
    const semua = bagian.concat(pusat, [akhir]), out = new Uint8Array(semua.reduce((a, b) => a + b.length, 0)); let o = 0;
    semua.forEach((b) => { out.set(b, o); o += b.length; }); return out;
  },
  /* ---------- XML ---------- */
  x(s) { return String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },
  kol(i) { let s = ''; for (i++; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + (i - 1) % 26) + s; return s; },
  /* nomor seri tanggal Excel dari 'YYYY-MM-DD' */
  seri(iso) { const [y, m, d] = iso.split('-').map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 864e5); },
  /* Gaya sel: 0 biasa, 1 judul kolom, 2 bilangan bulat (ribuan), 3 tanggal, 4 desimal.
     Nilai sel: angka, teks, null (kosong), { t: 'tgl', v: 'YYYY-MM-DD' }, atau { f: 'rumus', v: hasil, s: gaya }. */
  sel(v, r, c, gaya) {
    const ref = this.kol(c) + r;
    if (v === null || v === undefined || v === '') return '';
    if (typeof v === 'object' && v.f !== undefined) return '<c r="' + ref + '" s="' + (v.s || gaya || 0) + '"><f>' + this.x(v.f) + '</f><v>' + v.v + '</v></c>';
    if (typeof v === 'object' && v.t === 'tgl') return /^\d{4}-\d{2}-\d{2}$/.test(v.v || '') ? '<c r="' + ref + '" s="3"><v>' + this.seri(v.v) + '</v></c>' : '';
    if (typeof v === 'number' && isFinite(v)) return '<c r="' + ref + '" s="' + (gaya || 0) + '"><v>' + v + '</v></c>';
    return '<c r="' + ref + '" t="inlineStr"' + (gaya === 1 ? ' s="1"' : '') + '><is><t xml:space="preserve">' + this.x(v) + '</t></is></c>';
  },
  /* lembar: { nama, kolom: [{ h: judul, w: lebar, g: gaya }], baris: [[nilai...]] } */
  lembarXml(L) {
    const n = L.kolom.length, akhir = this.kol(n - 1) + (L.baris.length + 1);
    const cols = '<cols>' + L.kolom.map((k, i) => '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + (k.w || 14) + '" customWidth="1"/>').join('') + '</cols>';
    const kepala = '<row r="1">' + L.kolom.map((k, i) => this.sel(k.h, 1, i, 1)).join('') + '</row>';
    const isi = L.baris.map((b, j) => '<row r="' + (j + 2) + '">' + L.kolom.map((k, i) => this.sel(b[i], j + 2, i, k.g || 0)).join('') + '</row>').join('');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
      cols + '<sheetData>' + kepala + isi + '</sheetData>' + (L.baris.length ? '<autoFilter ref="A1:' + akhir + '"/>' : '') + '</worksheet>';
  },
  STYLES: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy\\-mm\\-dd"/></numFmts>' +
    '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
    '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8E2D0"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>' +
    '<xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="4" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>',
  buat(lembar) {
    const nm = (s, i) => (String(s).replace(/[\[\]:*?\/\\]/g, ' ').trim().slice(0, 31) || 'Lembar' + (i + 1));
    const n = lembar.length, ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const f = [
      { nama: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' + lembar.map((l, i) => '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('') + '</Types>' },
      { nama: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="' + ns + '/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { nama: 'xl/workbook.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="' + ns + '"><sheets>' + lembar.map((l, i) => '<sheet name="' + this.x(nm(l.nama, i)) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>').join('') + '</sheets></workbook>' },
      { nama: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + lembar.map((l, i) => '<Relationship Id="rId' + (i + 1) + '" Type="' + ns + '/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>').join('') + '<Relationship Id="rId' + (n + 1) + '" Type="' + ns + '/styles" Target="styles.xml"/></Relationships>' },
      { nama: 'xl/styles.xml', data: this.STYLES }
    ].concat(lembar.map((l, i) => ({ nama: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: this.lembarXml(l) })));
    return this.zip(f);
  },
  /* ---------- isi ekspor: seluruh data aplikasi ---------- */
  lembar() {
    const D = App.data, tgl = (v) => ({ t: 'tgl', v: v || '' }), uang = 2, desi = 4;
    const tx = App.aktif().slice().sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    const sat = (kid) => { const k = Siklus.kom(kid); return k ? k.satuan : ''; };
    const siklus = Siklus.daftar().map((s, i) => {
      const r = Siklus.ringkas(s.id), alat = r.tx.filter((t) => t.jenis === 'keluar' && t.kategoriId === 'alat').reduce((a, t) => a + t.jumlah, 0),
        non = r.tx.filter((t) => t.jenis === 'masuk' && (t.kategoriId === 'jual-bibit' || t.kategoriId === 'subsidi')).reduce((a, t) => a + t.jumlah, 0), q = r.bersih, rw = i + 2;
      return [Siklus.nama(s.id), s.status === 'selesai' ? 'Selesai' : 'Berjalan', tgl(s.mulai), tgl(s.selesai), r.modal, r.hasil, { f: 'F' + rw + '-E' + rw, v: r.hasil - r.modal, s: uang },
        r.modal ? { f: 'F' + rw + '/E' + rw, v: r.hasil / r.modal, s: desi } : null, q || null, q ? sat(s.komoditasId) : '', q ? Math.round((r.modal - alat) / q) : null, q && r.hasil - non > 0 ? Math.round((r.hasil - non) / q) : null];
    });
    const panen = D.panen.filter((p) => !p.terhapus && Siklus.cari(p.siklusId)).sort((a, b) => a.tanggal.localeCompare(b.tanggal)).map((p) => {
      const s = Siklus.cari(p.siklusId), b = Math.max(0, p.kuantitasKotor - p.susut);
      return [tgl(p.tanggal), Siklus.nama(p.siklusId), p.kuantitasKotor, p.susut || 0, b, sat(s.komoditasId), p.hargaPerSatuan || null, p.hargaPerSatuan ? Math.round(b * p.hargaPerSatuan) : null, p.pembeli || ''];
    });
    const dasar = (u) => { const t = D.transaksi.find((x) => x.id === u.transaksiId); return t ? App.namaKat(t.kategoriId) + ' · ' + t.tanggal : 'Manual'; };
    const utang = D.utang.filter((u) => !u.terhapus).sort((a, b) => (!!a.lunas - !!b.lunas) || String(a.jatuhTempo || '9').localeCompare(b.jatuhTempo || '9')).map((u) =>
      [u.jenis === 'utang' ? 'Utang' : 'Piutang', u.pihak, u.jumlah, Utang.dibayar(u), Utang.sisa(u), tgl(u.jatuhTempo), u.lunas ? 'Lunas' : 'Belum lunas', dasar(u)]);
    const aset = D.aset.filter((a) => !a.terhapus).map((a) => { const per = Math.round(a.hargaBeli / a.umurBulan), m = Rencana.mulai(a); return [a.nama, a.hargaBeli, tgl(a.tanggalBeli), a.umurBulan, per, Math.max(0, a.hargaBeli - per * m)]; });
    const harga = []; Siklus.koms(true).forEach((k) => (k.hargaPasar || []).forEach((h) => harga.push([k.nama, tgl(h.tanggal), h.harga, k.satuan, h.sumber || ''])));
    harga.sort((a, b) => String(b[1].v).localeCompare(a[1].v) || String(a[0]).localeCompare(b[0]));
    const jadwal = []; Siklus.daftar().forEach((s) => (s.jadwal || []).forEach((j) => jadwal.push([Siklus.nama(s.id), j.nama, j.selesai ? 'Selesai' : 'Berjalan', j.selesai ? null : tgl(j.tanggal), j.ulang > 0 ? j.ulang : null, tgl(j.terakhir)])));
    return [
      { nama: 'Siklus', kolom: [{ h: 'Siklus', w: 28 }, { h: 'Status', w: 11 }, { h: 'Mulai', w: 12 }, { h: 'Selesai', w: 12 }, { h: 'Modal', w: 14, g: uang }, { h: 'Hasil', w: 14, g: uang }, { h: 'Untung', w: 14, g: uang }, { h: 'R/C', w: 8, g: desi }, { h: 'Panen bersih', w: 13, g: desi }, { h: 'Satuan', w: 9 }, { h: 'HPP per satuan', w: 15, g: uang }, { h: 'Harga rata-rata', w: 15, g: uang }], baris: siklus },
      { nama: 'Transaksi', kolom: [{ h: 'Tanggal', w: 12 }, { h: 'Jenis', w: 9 }, { h: 'Kategori', w: 22 }, { h: 'Siklus', w: 28 }, { h: 'Jumlah', w: 14, g: uang }, { h: 'Sifat biaya', w: 12 }, { h: 'Catatan', w: 34 }],
        baris: tx.map((t) => [tgl(t.tanggal), t.jenis === 'keluar' ? 'Modal' : 'Hasil', App.namaKat(t.kategoriId), t.siklusId && Siklus.cari(t.siklusId) ? Siklus.nama(t.siklusId) : '', t.jumlah, t.jenis === 'keluar' ? (t.sifatBiaya === 'tetap' ? 'Tetap' : 'Variabel') : '', t.catatan || '']) },
      { nama: 'Panen', kolom: [{ h: 'Tanggal', w: 12 }, { h: 'Siklus', w: 28 }, { h: 'Hasil kotor', w: 12, g: desi }, { h: 'Susut', w: 9, g: desi }, { h: 'Hasil bersih', w: 12, g: desi }, { h: 'Satuan', w: 9 }, { h: 'Harga per satuan', w: 15, g: uang }, { h: 'Nilai jual', w: 14, g: uang }, { h: 'Pembeli', w: 20 }], baris: panen },
      { nama: 'Utang dan piutang', kolom: [{ h: 'Jenis', w: 10 }, { h: 'Pihak', w: 22 }, { h: 'Jumlah', w: 14, g: uang }, { h: 'Dibayar', w: 14, g: uang }, { h: 'Sisa', w: 14, g: uang }, { h: 'Jatuh tempo', w: 13 }, { h: 'Status', w: 12 }, { h: 'Asal', w: 30 }], baris: utang },
      { nama: 'Aset', kolom: [{ h: 'Aset', w: 26 }, { h: 'Harga beli', w: 14, g: uang }, { h: 'Tanggal beli', w: 13 }, { h: 'Umur (bulan)', w: 13, g: uang }, { h: 'Penyusutan per bulan', w: 20, g: uang }, { h: 'Nilai buku', w: 14, g: uang }], baris: aset },
      { nama: 'Harga pasar', kolom: [{ h: 'Komoditas', w: 22 }, { h: 'Tanggal', w: 12 }, { h: 'Harga per satuan', w: 16, g: uang }, { h: 'Satuan', w: 9 }, { h: 'Sumber', w: 24 }], baris: harga },
      { nama: 'Jadwal', kolom: [{ h: 'Siklus', w: 28 }, { h: 'Kegiatan', w: 26 }, { h: 'Status', w: 11 }, { h: 'Jadwal berikutnya', w: 17 }, { h: 'Ulang tiap (hari)', w: 16, g: uang }, { h: 'Terakhir dikerjakan', w: 19 }], baris: jadwal }
    ];
  },
  /* unduh berkas; kembalikan jumlah lembar yang berisi data */
  unduh() {
    const L = this.lembar(), bytes = this.buat(L), blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'tani-keuangan-' + isoHari() + '.xlsx';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return L.filter((l) => l.baris.length).length;
  }
};
