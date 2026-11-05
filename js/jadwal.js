/* Tani Keuangan — jadwal kegiatan per siklus: pupuk, semprot, dsb., sekali atau berulang (v0.1.051, docs/JADWAL.md)
   Disimpan di siklus.jadwal = [{ id, nama, tanggal, ulang, selesai, terakhir }]; ulang = tiap N hari (0 = sekali). */
const Jadwal = {
  tambahHari(iso, n) { const [y, m, d] = iso.split('-').map(Number); return isoHari(new Date(y, m - 1, d + n)); },
  selisih(iso) { const [y, m, d] = iso.split('-').map(Number), n = new Date(); return Math.round((new Date(y, m - 1, d) - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5); },
  daftar(s) { return (s.jadwal || []).slice().sort((a, b) => (!!a.selesai - !!b.selesai) || String(a.tanggal).localeCompare(b.tanggal)); },
  /* teks status: lewat / hari ini / sekian hari lagi */
  teks(j) { const n = this.selisih(j.tanggal); return n < 0 ? 'lewat ' + (-n) + ' hari' : n === 0 ? 'hari ini' : n + ' hari lagi'; },
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
    if (!/^jadwal-/.test(a)) return false;
    const s = Siklus.cari(Siklus.sid); if (!s) return true;
    const simpan = () => { s.diubah = nowIso(); App.simpan(); App.go('siklus-detail', true); };
    const j = (s.jadwal || []).find((x) => x.id === el.dataset.id); if (!j) return true;
    if (a === 'jadwal-selesai') {
      const lama = JSON.stringify(j), hari = isoHari();
      j.terakhir = hari;
      if (j.ulang > 0) j.tanggal = this.tambahHari(hari, j.ulang); else j.selesai = true;
      simpan();
      App.toast(j.selesai ? 'Kegiatan selesai' : 'Dijadwalkan lagi ' + Setelan.tgl(j.tanggal), { label: 'Urungkan', fn: () => { Object.assign(j, JSON.parse(lama)); s.diubah = nowIso(); App.simpan(); App.go('siklus-detail', true); } });
    } else if (a === 'jadwal-hapus') {
      const i = s.jadwal.indexOf(j); s.jadwal.splice(i, 1); simpan();
      App.toast('Kegiatan dihapus', { label: 'Urungkan', fn: () => { s.jadwal.splice(i, 0, j); s.diubah = nowIso(); App.simpan(); App.go('siklus-detail', true); } });
    }
    return true;
  }
};
