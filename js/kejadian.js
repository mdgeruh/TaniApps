/* Buku Kebun — Kejadian dan ukuran di jurnal siklus (Fase 6E Tahap 5, v0.1.093; docs/JURNAL.md)
   Jenis `kejadian` (field `kejadian`: hama|penyakit|cuaca|perawatan|lainnya) dan `ukuran` (field `ukuran`: {nama, nilai, satuan}). */
const Kejadian = {
  JENIS: [['hama', 'Hama'], ['penyakit', 'Penyakit'], ['cuaca', 'Cuaca'], ['perawatan', 'Perawatan'], ['lainnya', 'Lainnya']],
  nama(k) { const x = this.JENIS.find((a) => a[0] === k); return x ? x[1] : 'Kejadian'; },
  fmt(n) { return Number(n).toLocaleString('id-ID', { maximumFractionDigits: 2 }); },
  teks(j) { return j.jenis === 'ukuran' && j.ukuran ? j.ukuran.nama + ' ' + this.fmt(j.ukuran.nilai) + (j.ukuran.satuan ? ' ' + j.ukuran.satuan : '') : ''; },
  /* judul baris jurnal/linimasa */
  judul(j) {
    if (j.jenis === 'ukuran') return this.teks(j) || 'Ukuran';
    const l = String(j.isi || '').split('\n')[0].slice(0, 50); return this.nama(j.kejadian) + (l ? ': ' + l : '');
  },
  /* label jenis entri jurnal untuk ekspor dan tampilan */
  label(j) { return j.evaluasi ? 'Evaluasi' : { kegiatan: 'Kegiatan', tahap: 'Tahap', kejadian: 'Kejadian', ukuran: 'Ukuran' }[j.jenis] || 'Catatan'; },
  rincian(j) { return j.jenis === 'tahap' ? Tahap.nama(j) : j.jenis === 'kejadian' ? this.nama(j.kejadian) : ''; },
  /* satu baris per entri: [siklus, tanggal ISO, hari ke, jenis, rincian, judul, isi, nilai ukuran, satuan, jumlah foto]; dipakai Excel dan CSV */
  barisJurnal() {
    const out = []; Siklus.daftar().slice().sort((a, b) => Siklus.nama(a.id).localeCompare(Siklus.nama(b.id))).forEach((s) => Jurnal.of(s.id).slice().reverse().forEach((j) =>
      out.push([Siklus.nama(s.id), j.tanggal, Jurnal.hariKe(s, j.tanggal), this.label(j), this.rincian(j), Jurnal.judul(j), j.isi || '', j.jenis === 'ukuran' && j.ukuran ? j.ukuran.nilai : '', j.jenis === 'ukuran' && j.ukuran ? j.ukuran.satuan || '' : '', (j.foto || []).length])));
    return out;
  },
  csvJurnal() {
    const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    return ['siklus,tanggal,hari_ke,jenis,rincian,judul,isi,nilai,satuan,foto'].concat(this.barisJurnal().map((r) => [q(r[0]), r[1], r[2], q(r[3]), q(r[4]), q(r[5]), q(r[6]), r[7], q(r[8]), r[9]].join(','))).join('\n');
  },
  eksporCsvJurnal() {
    const csv = this.csvJurnal(), n = csv.split('\n').length - 1; if (!n) return 0;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' })); a.download = 'buku-kebun-jurnal-' + isoHari() + '.csv';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); return n;
  },
  daftar(s, jenis) { return Jurnal.of(s.id).filter((j) => j.jenis === jenis); },
  /* transaksi siklus pada tanggal yang sama (hubungan ke uang) */
  uangHari(j) { return App.aktif().filter((t) => t.siklusId === j.siklusId && t.tanggal === j.tanggal); },
  detail(j) {
    if (j.jenis === 'ukuran') return '<div class="tx-n" style="margin-bottom:8px">' + esc(this.teks(j)) + '</div>';
    if (j.jenis !== 'kejadian') return '';
    const T = this.uangHari(j);
    return '<div style="margin-bottom:8px"><span class="badge">' + esc(this.nama(j.kejadian)) + '</span></div>' +
      '<div class="note" style="margin:10px 0 4px">Uang pada tanggal yang sama</div>' +
      (T.length ? T.map((t) => '<div class="row"><span>' + esc(App.namaKat(t.kategoriId)) + '</span><span class="' + (t.jenis === 'masuk' ? 'up' : 'down') + '">' + (t.jenis === 'masuk' ? '+' : '−') + rp(t.jumlah) + '</span></div>').join('') : '<p class="note" style="margin:0">Tidak ada transaksi siklus ini pada tanggal tersebut.</p>');
  },
  /* grafik mini: nilai ukuran terhadap hari ke-N, satu garis per nama (maks. 3 nama) */
  grafik(s) {
    const g = {}; this.daftar(s, 'ukuran').forEach((j) => { if (!j.ukuran) return; const k = String(j.ukuran.nama).trim().toLowerCase(); (g[k] = g[k] || { nama: j.ukuran.nama, sat: j.ukuran.satuan, P: [] }).P.push({ h: Jurnal.hariKe(s, j.tanggal), v: j.ukuran.nilai }); });
    return Object.values(g).slice(0, 3).map((x) => {
      x.P.sort((a, b) => a.h - b.h); const akhir = x.P[x.P.length - 1], head = '<div class="row"><span>' + esc(x.nama) + '</span><span class="mu">terakhir ' + this.fmt(akhir.v) + (x.sat ? ' ' + esc(x.sat) : '') + ' · hari ' + akhir.h + '</span></div>';
      if (x.P.length < 2) return head + '<p class="note" style="margin:0">Catat satu ukuran lagi untuk melihat grafik.</p>';
      const W = 320, H = 90, X0 = 8, X1 = 312, h0 = x.P[0].h, h1 = akhir.h || 1, mx = Math.max(...x.P.map((p) => p.v)) || 1;
      const pts = x.P.map((p) => [X0 + (h1 === h0 ? 0 : (p.h - h0) / (h1 - h0) * (X1 - X0)), H - 8 - p.v / mx * (H - 20)]);
      return head + '<svg viewBox="0 0 ' + W + ' ' + (H + 14) + '" width="100%" role="img" aria-label="Grafik ' + esc(x.nama) + ' hari ' + h0 + ' sampai ' + h1 + '"><path d="' + Analisa.kurva(pts) + '" fill="none" stroke="var(--fill)" stroke-width="2.2" stroke-linecap="round"/>' +
        pts.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="var(--fill)"/>').join('') +
        '<text x="' + X0 + '" y="' + (H + 11) + '" font-size="9" fill="var(--paper-faint)">hari ' + h0 + '</text><text x="' + X1 + '" y="' + (H + 11) + '" text-anchor="end" font-size="9" fill="var(--paper-faint)">hari ' + h1 + '</text></svg>';
    }).join('<div style="height:8px"></div>');
  },
  v(s) {
    const jalan = s.status === 'berjalan', K = this.daftar(s, 'kejadian'), U = this.daftar(s, 'ukuran');
    if (!jalan && !K.length && !U.length) return '';
    const hit = this.JENIS.map((a) => [a[1], K.filter((j) => j.kejadian === a[0]).length]).filter((a) => a[1]);
    const tombol = jalan ? '<div class="seg" style="margin:10px 0 4px"><button type="button" class="btn" data-do="kejadian-catat">Catat kejadian</button><button type="button" class="btn" data-do="ukuran-catat">Catat ukuran</button></div>' : '';
    return '<section><h2 style="margin:0 0 4px">Kejadian dan ukuran</h2>' + tombol +
      (K.length ? '<div class="note" style="margin-top:8px">' + hit.map((a) => esc(a[0]) + ' ' + a[1]).join(' · ') + '</div><div class="note">Terakhir: ' + esc(this.judul(K[0])) + ' · ' + Setelan.tgl(K[0].tanggal) + '</div>' : '<p class="note">Belum ada kejadian (hama, penyakit, cuaca, perawatan).</p>') +
      (U.length ? '<div style="margin-top:12px">' + this.grafik(s) + '</div>' : '<p class="note">Belum ada ukuran (mis. tinggi tanaman, bobot ikan).</p>') +
      '<p class="note">Ketuk catatan di Jurnal atau linimasa untuk detail dan mengubah.</p></section>';
  },
  aksi(a) { if (a === 'kejadian-catat') { Rencana.dlgBuka('kejadian'); return true; } if (a === 'ukuran-catat') { Rencana.dlgBuka('ukuran'); return true; } return false; },
  /* simpan bersama; bentuk dibuat oleh `isiEntri` */
  simpan(v, id, jenis) {
    const s = Siklus.cari(Siklus.sid); if (!s) return 'Siklus tidak ditemukan.';
    const j = id ? Jurnal.cari(id) : null; if (id && !j) return 'Catatan tidak ditemukan.';
    if (!Jurnal.boleh(s, j)) return 'Siklus sudah selesai. Buka kembali untuk mengubah.';
    const g = Jurnal.cek(s, v('rm_jt')); if (g) return g;
    const f = { tanggal: v('rm_jt'), jenis: jenis, diubah: nowIso() };
    if (jenis === 'kejadian') {
      const isi = v('rm_ji').trim(); if (!this.JENIS.some((a) => a[0] === v('rm_kj'))) return 'Pilih jenis kejadian.'; if (isi.length > 2000) return 'Catatan paling banyak 2.000 karakter.';
      Object.assign(f, { kejadian: v('rm_kj'), isi: isi, judul: '' });
    } else {
      const nama = v('rm_un').trim().replace(/\s+/g, ' '), sat = v('rm_us').trim(), nilai = Number(String(v('rm_uv')).trim().replace(',', '.'));
      if (!nama) return 'Isi nama ukuran, mis. Tinggi.'; if (nama.length > 30) return 'Nama ukuran paling banyak 30 karakter.';
      if (!isFinite(nilai) || String(v('rm_uv')).trim() === '' || nilai < 0) return 'Isi nilai ukuran berupa angka (0 atau lebih).';
      if (sat.length > 10) return 'Satuan paling banyak 10 karakter.';
      Object.assign(f, { ukuran: { nama: nama, nilai: nilai, satuan: sat }, isi: '', judul: '' });
    }
    if (j) Object.assign(j, f); else Jurnal.semua().push(Object.assign({ id: uid('jr'), siklusId: s.id, dibuat: nowIso(), terhapus: false }, f));
    s.diubah = nowIso(); return { toast: (jenis === 'kejadian' ? 'Kejadian' : 'Ukuran') + (j ? ' diperbarui' : ' tersimpan') };
  },
  namaUkuran(s) { return [...new Set(this.daftar(s, 'ukuran').filter((j) => j.ukuran).map((j) => j.ukuran.nama))]; }
};
Object.assign(Rencana.FORM, {
  kejadian: { jenis: 'Jurnal siklus', judul: 'Catat kejadian', judulUbah: 'Ubah kejadian', simpan: 'Simpan kejadian', tab: 'siklus-detail', fokus: 'rm_ji',
    isi() {
      return Rencana.lab('rm_jt', 'Tanggal', '<input type="date" id="rm_jt" value="' + isoHari() + '">') +
        Rencana.lab('rm_kj', 'Jenis', '<select id="rm_kj">' + Kejadian.JENIS.map((a) => '<option value="' + a[0] + '">' + a[1] + '</option>').join('') + '</select>') +
        Rencana.lab('rm_ji', 'Catatan (opsional)', '<textarea id="rm_ji" rows="3" maxlength="2000" placeholder="mis. Kutu daun di bedeng 2, disemprot"></textarea>');
    },
    isiEd(id, el) { const j = Jurnal.cari(id); if (!j) return; el.querySelector('#rm_jt').value = j.tanggal; el.querySelector('#rm_kj').value = j.kejadian || 'lainnya'; el.querySelector('#rm_ji').value = j.isi || ''; },
    ok(v, id) { return Kejadian.simpan(v, id, 'kejadian'); } },
  ukuran: { jenis: 'Jurnal siklus', judul: 'Catat ukuran', judulUbah: 'Ubah ukuran', simpan: 'Simpan ukuran', tab: 'siklus-detail', fokus: 'rm_un',
    isi() {
      const s = Siklus.cari(Siklus.sid), N = s ? Kejadian.namaUkuran(s) : [];
      return Rencana.lab('rm_jt', 'Tanggal', '<input type="date" id="rm_jt" value="' + isoHari() + '">') +
        Rencana.lab('rm_un', 'Nama ukuran', '<input id="rm_un" maxlength="30" autocomplete="off" list="rm_unl" placeholder="mis. Tinggi tanaman"><datalist id="rm_unl">' + N.map((n) => '<option value="' + esc(n) + '">').join('') + '</datalist>') +
        Rencana.lab('rm_uv', 'Nilai', '<input id="rm_uv" inputmode="decimal" autocomplete="off" placeholder="mis. 35">') +
        Rencana.lab('rm_us', 'Satuan (opsional)', '<input id="rm_us" maxlength="10" autocomplete="off" placeholder="mis. cm, g, kg">');
    },
    isiEd(id, el) { const j = Jurnal.cari(id); if (!j || !j.ukuran) return; el.querySelector('#rm_jt').value = j.tanggal; el.querySelector('#rm_un').value = j.ukuran.nama; el.querySelector('#rm_uv').value = String(j.ukuran.nilai).replace('.', ','); el.querySelector('#rm_us').value = j.ukuran.satuan || ''; },
    ok(v, id) { return Kejadian.simpan(v, id, 'ukuran'); } }
});
