/* Buku Kebun — modal detail Jadwal kegiatan dan Panen di detail siklus (v0.1.060)
   Memakai mesin modal Rencana (Rencana.dlgBuka); entri didaftarkan ke Rencana.FORM. Dokumen: docs/JADWAL.md, docs/SIKLUS.md */
const Dsk = {
  aksi(a, el) {
    if (a === 'panen-detail') { Rencana.dlgBuka('panenDetail', el.dataset.id); return true; }
    if (a === 'jadwal-detail') { Rencana.dlgBuka('jadwalDetail', el.dataset.id); return true; }
    return false;
  },
  jd(id) { const s = Siklus.cari(Siklus.sid); return s ? (s.jadwal || []).find((j) => j.id === id) || null : null; },
  pn(id) { return Siklus.d().panen.find((p) => p.id === id && !p.terhapus) || null; }
};
Object.assign(Rencana.FORM, {
  jadwal: { jenis: 'Jadwal kegiatan', judul: 'Tambah kegiatan', judulUbah: 'Ubah kegiatan', simpan: 'Simpan kegiatan', tab: 'siklus-detail', fokus: 'rm_jn',
    isi() { return Rencana.lab('rm_jn', 'Kegiatan', '<input id="rm_jn" maxlength="60" autocomplete="off" placeholder="mis. Pupuk NPK, semprot hama">') +
      Rencana.lab('rm_jt', 'Tanggal', '<input type="date" id="rm_jt" value="' + isoHari() + '">') +
      Rencana.lab('rm_ju', 'Ulangi tiap (hari, kosongkan bila sekali)', '<input id="rm_ju" inputmode="numeric" maxlength="3" placeholder="mis. 14">'); },
    isiEd(id, el) { const j = Dsk.jd(id); if (!j) return; el.querySelector('#rm_jn').value = j.nama; el.querySelector('#rm_jt').value = j.tanggal; el.querySelector('#rm_ju').value = j.ulang > 0 ? j.ulang : ''; },
    ok(v, id) {
      const s = Siklus.cari(Siklus.sid); if (!s) return 'Siklus tidak ditemukan.';
      const nama = v('rm_jn').trim(), tgl = v('rm_jt'), u = v('rm_ju').trim(), ulang = u === '' ? 0 : Number(u);
      if (!nama) return 'Isi nama kegiatan.';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return 'Isi tanggal.';
      if (!Number.isInteger(ulang) || ulang < 0 || ulang > 365) return 'Ulangi tiap 1 sampai 365 hari, atau kosongkan.';
      const j = id && Dsk.jd(id);
      if (j) Object.assign(j, { nama: nama, tanggal: tgl, ulang: ulang }); else (s.jadwal = s.jadwal || []).push({ id: uid('j'), nama: nama, tanggal: tgl, ulang: ulang, selesai: false, terakhir: '' });
      s.diubah = nowIso(); return { toast: j ? 'Kegiatan diperbarui' : 'Kegiatan ditambahkan' };
    } },
  jadwalDetail: { jenis: 'Jadwal kegiatan', judul: 'Detail kegiatan', ada(id) { return !!Dsk.jd(id); }, judulFn(id) { const j = Dsk.jd(id); return j ? esc(j.nama) : 'Detail kegiatan'; },
    isi(id) {
      const j = Dsk.jd(id), telat = !j.selesai && Jadwal.selisih(j.tanggal) < 0;
      return Rencana.baris('Status', j.selesai ? 'selesai' : '<span class="' + (telat ? 'down' : '') + '">' + Jadwal.teks(j) + '</span>') + Rencana.baris(j.selesai ? 'Tanggal terakhir' : 'Tanggal', Setelan.tgl(j.selesai ? (j.terakhir || j.tanggal) : j.tanggal)) +
        Rencana.baris('Pengulangan', j.ulang > 0 ? 'tiap ' + j.ulang + ' hari' : 'sekali') + (j.terakhir && !j.selesai ? Rencana.baris('Terakhir dikerjakan', Setelan.tgl(j.terakhir)) : '');
    },
    tombol(id) {
      const s = Siklus.cari(Siklus.sid), j = Dsk.jd(id), jalan = s && s.status === 'berjalan';
      return (jalan && !j.selesai ? Rencana.bt('selesai', 'Sudah dikerjakan', 'gold') : '') + (jalan ? Rencana.bt('ubah', 'Ubah', '') : '') + Rencana.bt('hapus', 'Hapus', 'danger') + Rencana.bt('tutup', 'Tutup', '');
    },
    aksi(a, id) {
      if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka('jadwal', id); }
      else if (a === 'selesai') { Rencana.dlgTutup(true); Jadwal.aksi('jadwal-selesai', { dataset: { id: id } }); }
      else if (a === 'hapus') { Rencana.dlgTutup(true); Jadwal.aksi('jadwal-hapus', { dataset: { id: id } }); }
    } },
  panenDetail: { jenis: 'Panen', judul: 'Detail panen', ada(id) { return !!Dsk.pn(id); }, judulFn(id) { const p = Dsk.pn(id); return p ? 'Panen ' + Setelan.tgl(p.tanggal) : 'Detail panen'; },
    isi(id) {
      const p = Dsk.pn(id), s = Siklus.cari(Siklus.sid), k = s && Siklus.kom(s.komoditasId), sat = k ? ' ' + esc(k.satuan) : '';
      return Rencana.baris('Hasil kotor', fmtN(p.kuantitasKotor) + sat) + Rencana.baris('Susut / reject', fmtN(p.susut) + sat) + Rencana.baris('Bersih', '<strong>' + fmtN(p.kuantitasKotor - p.susut) + sat + '</strong>') +
        Rencana.baris('Harga jual', p.hargaPerSatuan ? rp(p.hargaPerSatuan) + (k ? '/' + esc(k.satuan) : '') : '—') + Rencana.baris('Pembeli', p.pembeli ? esc(p.pembeli) : '—');
    },
    tombol() { const s = Siklus.cari(Siklus.sid); return (s && s.status === 'berjalan' ? Rencana.bt('ubah', 'Ubah panen', 'gold') + Rencana.bt('hapus', 'Hapus panen', 'danger') : '') + Rencana.bt('tutup', 'Tutup', ''); },
    aksi(a, id) {
      if (a === 'ubah') { Rencana.dlgTutup(true); Siklus.aksi('ubah-panen', { dataset: { id: id } }); return; }
      if (a !== 'hapus') return;
      const D = Siklus.d(), p = Dsk.pn(id), t = p && p.transaksiId && D.transaksi.find((x) => x.id === p.transaksiId), tIkut = !!(t && !t.terhapus);
      if (!p || (tIkut && Utang.tahan(t))) return;
      p.terhapus = true; p.diubah = nowIso(); if (tIkut) { t.terhapus = true; t.diubah = nowIso(); Utang.ikut(t, true); }
      const hal = App.tab === 'jurnal' ? 'jurnal' : 'siklus-detail';
      Rencana.dlgTutup(true); App.simpan(); App.go(hal, true); Modal.pulihFokus();
      App.toast('Panen dihapus', { label: 'Urungkan', fn: () => { p.terhapus = false; p.diubah = nowIso(); if (tIkut) { t.terhapus = false; t.diubah = nowIso(); Utang.ikut(t, false); } App.simpan(); if (App.tab === hal) App.go(hal, true); } });
    } }
});
