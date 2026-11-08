/* Buku Kebun — jadwal kegiatan per siklus: pupuk, semprot, dsb., sekali atau berulang (v0.1.051, docs/JADWAL.md)
   Disimpan di siklus.jadwal = [{ id, nama, tanggal, ulang, selesai, terakhir }]; ulang = tiap N hari (0 = sekali). */
const Jadwal = {
  tambahHari(iso, n) { const [y, m, d] = iso.split('-').map(Number); return isoHari(new Date(y, m - 1, d + n)); },
  selisih(iso) { const [y, m, d] = iso.split('-').map(Number), n = new Date(); return Math.round((new Date(y, m - 1, d) - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5); },
  daftar(s) { return (s.jadwal || []).slice().sort((a, b) => (!!a.selesai - !!b.selesai) || String(a.tanggal).localeCompare(b.tanggal)); },
  /* teks status: lewat / hari ini / sekian hari lagi */
  teksN(n) { return n < 0 ? 'lewat ' + (-n) + ' hari' : n === 0 ? 'hari ini' : n + ' hari lagi'; },
  teks(j) { return this.teksN(this.selisih(j.tanggal)); },
  /* Agenda lintas siklus (v0.1.068): kegiatan belum selesai + perkiraan panen dari siklus berjalan, urut dari yang terdekat */
  itemAgenda(daftar) {
    const out = [];
    daftar.filter((s) => s.status === 'berjalan').forEach((s) => {
      (s.jadwal || []).filter((j) => !j.selesai).forEach((j) => out.push({ tipe: 'kegiatan', s: s, j: j, tgl: j.tanggal, n: this.selisih(j.tanggal) }));
      const pp = Siklus.panenPerkiraan(s); if (pp) out.push({ tipe: 'panen', s: s, tgl: pp.tgl, n: pp.sisa });
    });
    return out.sort((a, b) => a.n - b.n || (a.tipe === b.tipe ? 0 : a.tipe === 'kegiatan' ? -1 : 1) || Siklus.nama(a.s.id).localeCompare(Siklus.nama(b.s.id)));
  },
  GRUP: [['Terlambat', (n) => n < 0], ['Hari ini', (n) => n === 0], ['7 hari ke depan', (n) => n >= 1 && n <= 7], ['8–30 hari ke depan', (n) => n >= 8 && n <= 30], ['Lebih dari 30 hari', (n) => n > 30]],
  agenda(daftar) {
    const L = this.itemAgenda(daftar);
    if (!L.length) return '<p class="note" style="margin-top:14px">Belum ada kegiatan terjadwal atau perkiraan panen. Buka siklus berjalan, lalu ketuk tombol + dan pilih Tambah jadwal kegiatan. Perkiraan panen muncul bila komoditas punya umur panen.</p>';
    return '<p class="note" style="margin-top:12px">Kegiatan dan perkiraan panen dari semua siklus berjalan. Ketuk baris untuk membuka siklusnya; ✓ menandai kegiatan sudah dikerjakan.</p>' +
      this.GRUP.map((g) => {
        const isi = L.filter((x) => g[1](x.n)); if (!isi.length) return '';
        return '<h2 class="ag-grup' + (g[0] === 'Terlambat' ? ' down' : '') + '">' + g[0] + ' (' + isi.length + ')</h2>' + isi.map((x) => {
          const status = '<span class="' + (x.n < 0 ? 'down' : '') + '">' + this.teksN(x.n) + '</span>';
          const judul = x.tipe === 'panen' ? 'Perkiraan panen' : esc(x.j.nama);
          const ket = esc(Siklus.nama(x.s.id)) + (Tahap.ringkas(x.s) ? ' · ' + esc(Tahap.ringkas(x.s)) : '') + ' · ' + Setelan.tgl(x.tgl) + ' · ' + status + (x.tipe === 'kegiatan' && x.j.ulang > 0 ? ' · tiap ' + x.j.ulang + ' hari' : '');
          return '<div class="ag-row"><button type="button" class="ag-main" data-do="buka-siklus" data-id="' + x.s.id + '" aria-label="' + (x.tipe === 'panen' ? 'Perkiraan panen ' : 'Kegiatan ' + esc(x.j.nama) + ', ') + esc(Siklus.nama(x.s.id)) + ', ' + this.teksN(x.n) + '. Buka siklus"><strong>' + (x.tipe === 'panen' ? '🌾 ' : '') + judul + '</strong><span class="note">' + ket + '</span></button>' +
            (x.tipe === 'kegiatan' ? '<button type="button" class="btn ag-ok" data-do="agenda-selesai" data-sid="' + x.s.id + '" data-id="' + x.j.id + '" aria-label="Tandai sudah dikerjakan: ' + esc(x.j.nama) + ', ' + esc(Siklus.nama(x.s.id)) + '">✓</button>' : '') + '</div>';
        }).join('');
      }).join('');
  },
  /* kegiatan yang perlu diingatkan di Beranda: siklus berjalan, belum selesai, jatuh tempo dalam 3 hari atau sudah lewat */
  mendekat() {
    const out = [];
    Siklus.daftar().filter((s) => s.status === 'berjalan').forEach((s) => (s.jadwal || []).filter((j) => !j.selesai && this.selisih(j.tanggal) <= 3).forEach((j) => out.push({ s: s, j: j, n: this.selisih(j.tanggal) })));
    return out.sort((a, b) => a.n - b.n);
  },
  v(s) {
    const jalan = s.status === 'berjalan', L = this.daftar(s);
    if (!jalan && !L.length) return '';
    const baris = (j) => { const n = this.selisih(j.tanggal), telat = !j.selesai && n < 0;
      return '<button type="button" class="ang-baris" style="opacity:' + (j.selesai ? '.55' : '1') + '" data-do="jadwal-detail" data-id="' + j.id + '" aria-haspopup="dialog" aria-label="Detail kegiatan ' + esc(j.nama) + '"><div class="bar-top"><strong>' + esc(j.nama) + '</strong><span class="' + (telat ? 'down' : 'mu') + '">' + (j.selesai ? 'selesai' : this.teks(j)) + '</span></div>' +
        '<div class="note">' + (j.selesai ? 'Selesai ' + Setelan.tgl(j.terakhir || j.tanggal) : Setelan.tgl(j.tanggal)) + (j.ulang > 0 ? ' · tiap ' + j.ulang + ' hari' : ' · sekali') + (j.terakhir && !j.selesai ? ' · terakhir ' + Setelan.tgl(j.terakhir) : '') + '</div></button>'; };
    const aktif = L.filter((j) => !j.selesai), beres = L.filter((j) => j.selesai);
    return '<section><h2>Jadwal kegiatan</h2>' + (aktif.length ? aktif.map(baris).join('') : '<p class="note">' + (L.length ? 'Tidak ada kegiatan yang menunggu.' : 'Belum ada jadwal.' + (jalan ? ' Ketuk tombol + untuk menambah pengingat pupuk, semprot, atau kegiatan lain.' : '')) + '</p>') +
      (beres.length ? '<details class="lg-detail"><summary>Sudah selesai (' + beres.length + ')</summary>' + beres.map(baris).join('') + '</details>' : '') + (L.length ? '<p class="note">Ketuk kegiatan untuk detail' + (jalan ? ', mengubah, atau menghapus' : '') + '.</p>' : '') + '</section>';
  },
  aksi(a, el) {
    if (a === 'agenda-selesai') { // dari Agenda: tetap di daftar siklus, tanpa membuka detail
      const lama = Siklus.sid; Siklus.sid = el.dataset.sid; this.dariAgenda = true;
      try { this.aksi('jadwal-selesai', el); } finally { this.dariAgenda = false; Siklus.sid = lama; }
      return true;
    }
    if (!/^jadwal-/.test(a)) return false;
    const s = Siklus.cari(Siklus.sid); if (!s) return true;
    const rute = this.dariAgenda ? 'siklus' : 'siklus-detail';
    const simpan = () => { s.diubah = nowIso(); App.simpan(); App.go(rute, true); };
    const j = (s.jadwal || []).find((x) => x.id === el.dataset.id); if (!j) return true;
    if (a === 'jadwal-selesai') {
      const lama = JSON.stringify(j), hari = isoHari();
      j.terakhir = hari;
      if (j.ulang > 0) j.tanggal = this.tambahHari(hari, j.ulang); else j.selesai = true;
      /* riwayat kegiatan (v0.1.089): satu entri jurnal jenis 'kegiatan' per penandaan; Urungkan ikut menghapusnya */
      const n = nowIso(), rk = { id: uid('jr'), siklusId: s.id, tanggal: hari < s.mulai ? s.mulai : hari, jenis: 'kegiatan', judul: j.nama, isi: '', dibuat: n, diubah: n, terhapus: false };
      Jurnal.semua().push(rk);
      simpan();
      App.toast(j.selesai ? 'Kegiatan selesai' : 'Dijadwalkan lagi ' + Setelan.tgl(j.tanggal), [{ label: 'Urungkan', fn: () => { Object.assign(j, JSON.parse(lama)); const i = Jurnal.semua().indexOf(rk); if (i >= 0) Jurnal.semua().splice(i, 1); s.diubah = nowIso(); App.simpan(); App.go(rute, true); } },
        { label: 'Tambah catatan', fn: () => { Siklus.sid = s.id; Rencana.dlgBuka('jurnal', rk.id); } }]); /* v0.1.100 */
    } else if (a === 'jadwal-hapus') {
      const i = s.jadwal.indexOf(j); s.jadwal.splice(i, 1); simpan();
      App.toast('Kegiatan dihapus', { label: 'Urungkan', fn: () => { s.jadwal.splice(i, 0, j); s.diubah = nowIso(); App.simpan(); App.go(rute, true); } });
    }
    return true;
  }
};
