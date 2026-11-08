/* Buku Kebun — Tahap pertumbuhan (Fase 6E Tahap 3, v0.1.090): daftar bawaan per komoditas, tahap sekarang, saran, bilah (docs/JURNAL.md bagian 6) */
const Tahap = {
  /* [kode, nama, persen umur panen saat tahap dimulai] */
  TABEL: {
    'Sayur daun': { umur: 30, t: [['persiapan', 'Persiapan lahan', 0], ['semai', 'Semai', 7], ['pindah', 'Pindah tanam', 30], ['vegetatif', 'Pertumbuhan daun', 45], ['siap', 'Siap panen', 80], ['panen', 'Panen', 100]] },
    'Cabai': { umur: 120, t: [['persiapan', 'Persiapan lahan', 0], ['semai', 'Semai', 4], ['pindah', 'Pindah tanam', 25], ['vegetatif', 'Vegetatif', 38], ['berbunga', 'Berbunga', 55], ['berbuah', 'Berbuah', 70], ['panen', 'Panen', 85]] },
    'Tomat': { umur: 90, t: [['persiapan', 'Persiapan lahan', 0], ['semai', 'Semai', 4], ['pindah', 'Pindah tanam', 22], ['vegetatif', 'Vegetatif', 33], ['berbunga', 'Berbunga', 50], ['berbuah', 'Berbuah', 62], ['panen', 'Panen', 80]] },
    'Lele': { umur: 90, t: [['persiapan', 'Persiapan kolam', 0], ['tebar', 'Tebar benih', 3], ['dederan', 'Pendederan', 10], ['pembesaran', 'Pembesaran', 40], ['siap', 'Siap panen', 90], ['panen', 'Panen', 100]] },
    'Ayam petelur': { umur: 120, t: [['persiapan', 'Persiapan kandang', 0], ['doc', 'DOC masuk', 4], ['starter', 'Starter', 8], ['grower', 'Grower', 35], ['praproduksi', 'Pra-produksi', 75], ['produksi', 'Produksi telur', 90]] },
    'Umum': { umur: 0, t: [['persiapan', 'Persiapan', 0], ['tanam', 'Tanam / tebar', 5], ['tumbuh', 'Pertumbuhan', 30], ['siap', 'Siap panen', 80], ['panen', 'Panen', 100]] }
  },
  /* daftar tahap untuk satu siklus: templat komoditas (atau Umum), nama dari komoditas.tahap bila diubah */
  paket(s) { return this.paketKom(Siklus.kom(s.komoditasId)); },
  paketKom(k) {
    const tp = k && Siklus.templateUntuk(k.nama), m = (tp && this.TABEL[tp.label]) || this.TABEL.Umum;
    const umur = (k && k.umurPanenHari) || m.umur || 0, ganti = (k && k.tahap) || {};
    return { nama: tp && this.TABEL[tp.label] ? tp.label : 'Umum', umur: umur, daftar: m.t.map((x) => ({ kode: x[0], asli: x[1], nama: ganti[x[0]] || x[1], pct: x[2], hari: umur ? Math.max(1, Math.round(x[2] * umur / 100)) : null })) };
  },
  /* lipatan "Nama tahap" di formulir ubah komoditas; kosongkan isian untuk memakai nama bawaan */
  formNama(kid) {
    const k = Siklus.kom(kid); if (!k) return '';
    const p = this.paketKom(k), ganti = k.tahap || {};
    return '<details class="lap-det" style="margin-top:12px"><summary style="font-size:16px">Nama tahap pertumbuhan</summary><p class="note" style="margin-top:0">Daftar ' + esc(p.nama) + '. Ganti nama sesuai kebiasaan Anda; kosongkan untuk memakai nama bawaan. Urutan dan kode tetap.</p>' +
      p.daftar.map((t) => '<label for="th_' + t.kode + '">' + esc(t.asli) + '</label><input id="th_' + t.kode + '" data-th="' + t.kode + '" data-def="' + esc(t.asli) + '" maxlength="30" autocomplete="off" value="' + esc(ganti[t.kode] || '') + '" placeholder="' + esc(t.asli) + '">').join('') + '</details>';
  },
  /* baca isian nama tahap dari formulir; mengembalikan peta kode → nama (hanya yang berbeda dari bawaan) atau null bila formulir tidak memuatnya */
  bacaNama() {
    const L = document.querySelectorAll('input[data-th]'); if (!L.length) return null;
    const m = {}; L.forEach((e) => { const v = e.value.trim().replace(/\s+/g, ' ').slice(0, 30); if (v && v !== e.dataset.def) m[e.dataset.th] = v; }); return m;
  },
  nama(j) { const s = Siklus.cari(j.siklusId), t = s && this.paket(s).daftar.find((x) => x.kode === j.tahap); return t ? t.nama : (j.tahap || 'Tahap'); },
  /* tahap terakhir yang dicatat (menurut tanggal) */
  sekarang(s) {
    const j = Jurnal.of(s.id).find((x) => x.jenis === 'tahap'); if (!j) return null;
    const hr = Jurnal.hariKe(s, isoHari()) - Jurnal.hariKe(s, j.tanggal);
    return { kode: j.tahap, nama: this.nama(j), tanggal: j.tanggal, hari: Math.max(0, hr) };
  },
  /* saran saja, tidak otomatis: tahap yang menurut hari ke-N seharusnya sudah mulai, atau tahap berikutnya */
  saran(s) {
    const p = this.paket(s), cur = this.sekarang(s), ci = cur ? p.daftar.findIndex((x) => x.kode === cur.kode) : -1;
    const hari = Jurnal.hariKe(s, isoHari()); let ti = -1;
    if (p.umur) p.daftar.forEach((x, i) => { if (x.hari <= hari) ti = i; });
    if (ti > ci) return Object.assign({ mendesak: true }, p.daftar[ti]);
    return ci + 1 < p.daftar.length ? Object.assign({ mendesak: false }, p.daftar[ci + 1]) : null;
  },
  ringkas(s) { const c = s.status === 'berjalan' && this.sekarang(s); return c ? 'Tahap ' + c.nama : ''; },
  bilah(s) {
    const p = this.paket(s), cur = this.sekarang(s), ci = cur ? p.daftar.findIndex((x) => x.kode === cur.kode) : -1, hari = Jurnal.hariKe(s, isoHari());
    const seg = p.daftar.map((x, i) => '<i class="' + (i < ci ? 'sl' : i === ci ? 'sn' : '') + '" style="flex:' + Math.max(2, (i + 1 < p.daftar.length ? p.daftar[i + 1].pct : 100) - x.pct) + '" title="' + esc(x.nama) + '"></i>').join('');
    const pos = p.umur ? '<b style="left:' + Math.min(100, Math.round(hari / p.umur * 100)) + '%" title="Hari ini (hari ' + hari + ')"></b>' : '';
    return '<div class="th-bar" role="img" aria-label="' + (cur ? 'Tahap ' + esc(cur.nama) + ', ' + (ci + 1) + ' dari ' + p.daftar.length : 'Belum ada tahap dicatat') + '">' + seg + pos + '</div>';
  },
  /* bagian "Tahap" di detail siklus */
  v(s) {
    const jalan = s.status === 'berjalan', c = this.sekarang(s), sg = jalan && this.saran(s);
    if (!jalan && !c) return '';
    return '<section><div class="sc-head"><h2 style="margin:0">Tahap</h2>' + (jalan ? '<button type="button" class="btn" data-do="tahap-catat" style="padding:7px 12px;font-size:12px;min-height:40px">Catat tahap</button>' : '') + '</div>' +
      (c ? '<div class="tx-n" style="margin-top:10px">' + esc(c.nama) + '</div><div class="note">sejak ' + Setelan.tgl(c.tanggal) + ' · ' + (c.hari ? c.hari + ' hari' : 'hari ini') + '</div>' : '<p class="note">Belum ada tahap dicatat. Ketuk Catat tahap saat tanaman berpindah tahap (semai, pindah tanam, berbunga, dan seterusnya).</p>') +
      this.bilah(s) +
      (sg ? '<p class="note">' + (sg.mendesak ? 'Saran: menurut umur siklus, tahap <b>' + esc(sg.nama) + '</b> seharusnya sudah mulai (sekitar hari ' + sg.hari + ').' : 'Berikutnya: <b>' + esc(sg.nama) + '</b>' + (sg.hari ? ' (sekitar hari ' + sg.hari + ')' : '') + '.') + ' Hanya saran; tahap dicatat oleh Anda.</p>' : '') + '</section>';
  },
  aksi(a) { if (a === 'tahap-catat') { Rencana.dlgBuka('tahap'); return true; } return false; },
  simpan(v, id) {
    const s = Siklus.cari(Siklus.sid); if (!s) return 'Siklus tidak ditemukan.';
    const j = id ? Jurnal.cari(id) : null; if (id && !j) return 'Catatan tidak ditemukan.';
    if (!Jurnal.boleh(s, j)) return 'Siklus sudah selesai. Buka kembali untuk mengubah tahap.';
    const g = Jurnal.cek(s, v('rm_jt')); if (g) return g;
    const kode = v('rm_tk'), isi = v('rm_ji').trim();
    if (!this.paket(s).daftar.some((x) => x.kode === kode)) return 'Pilih tahap.';
    if (isi.length > 2000) return 'Catatan paling banyak 2.000 karakter.';
    const n = nowIso();
    if (j) Object.assign(j, { tanggal: v('rm_jt'), tahap: kode, isi: isi, diubah: n });
    else Jurnal.semua().push({ id: uid('jr'), siklusId: s.id, tanggal: v('rm_jt'), jenis: 'tahap', tahap: kode, judul: '', isi: isi, dibuat: n, diubah: n, terhapus: false });
    s.diubah = n; return { toast: j ? 'Tahap diperbarui' : 'Tahap tersimpan' };
  }
};
Object.assign(Rencana.FORM, {
  tahap: { jenis: 'Jurnal siklus', judul: 'Catat tahap', judulUbah: 'Ubah tahap', simpan: 'Simpan tahap', tab: 'siklus-detail', fokus: 'rm_tk',
    isi() {
      const s = Siklus.cari(Siklus.sid), sg = Tahap.saran(s);
      const opt = Tahap.paket(s).daftar.map((t) => '<option value="' + t.kode + '"' + (sg && sg.kode === t.kode ? ' selected' : '') + '>' + esc(t.nama) + (t.hari ? ' (±hari ' + t.hari + ')' : '') + '</option>').join('');
      return Rencana.lab('rm_jt', 'Tanggal', '<input type="date" id="rm_jt" value="' + isoHari() + '">') + Rencana.lab('rm_tk', 'Tahap', '<select id="rm_tk">' + opt + '</select>') +
        Rencana.lab('rm_ji', 'Catatan (opsional)', '<textarea id="rm_ji" rows="3" maxlength="2000" placeholder="mis. Bibit dipindah ke bedeng 2"></textarea>');
    },
    isiEd(id, el) { const j = Jurnal.cari(id); if (!j) return; el.querySelector('#rm_jt').value = j.tanggal; el.querySelector('#rm_tk').value = j.tahap || ''; el.querySelector('#rm_ji').value = j.isi || ''; },
    ok(v, id) { return Tahap.simpan(v, id); } }
});
