/* Buku Kebun — Jurnal siklus, Tahap 1: catatan teks per siklus (v0.1.088, docs/JURNAL.md)
   Koleksi akar `jurnal` (id jr_xxxxx). Satu entri satu catatan: { id, siklusId, tanggal, jenis, judul, isi, evaluasi?, dibuat, diubah, terhapus }.
   Siklus berjalan: tambah, ubah, hapus bebas. Siklus selesai: baca-saja, kecuali satu catatan Evaluasi. Tidak memengaruhi uang, panen, atau laporan. */
const Jurnal = {
  semua() { const D = Siklus.d(); return D.jurnal || (D.jurnal = []); },
  cari(id) { return this.semua().find((j) => j.id === id && !j.terhapus) || null; },
  of(sid) { return this.semua().filter((j) => !j.terhapus && j.siklusId === sid).sort((a, b) => b.tanggal.localeCompare(a.tanggal) || String(b.dibuat).localeCompare(String(a.dibuat))); },
  evaluasiOf(sid) { return this.of(sid).find((j) => j.evaluasi) || null; },
  /* hari ke-N sejak mulai (tanggal mulai = hari ke-1, sama dengan Siklus.hari) */
  hariKe(s, tgl) { const p = (x) => { const a = x.split('-').map(Number); return new Date(a[0], a[1] - 1, a[2]); }; return Math.round((p(tgl) - p(s.mulai)) / 864e5) + 1; },
  boleh(s, j) { return s.status === 'berjalan' || !!(j && j.evaluasi); },
  judul(j) { if (j.jenis === 'tahap') return 'Tahap: ' + Tahap.nama(j); if (j.jenis === 'kejadian' || j.jenis === 'ukuran') return Kejadian.judul(j); return j.judul || (j.evaluasi ? 'Evaluasi siklus' : String(j.isi || '').split('\n')[0].slice(0, 60)) || ((j.foto || []).length ? 'Foto catatan' : ''); },
  cek(s, tgl) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return 'Isi tanggal.';
    if (tgl < s.mulai) return 'Tanggal tidak boleh sebelum mulai siklus (' + Setelan.tgl(s.mulai) + ').';
    if (tgl > isoHari()) return 'Tanggal tidak boleh di masa depan.';
    return '';
  },
  /* bagian "Jurnal" di detail siklus; lagi(n, batas) dan semuaOn datang dari Siklus.vDetail */
  v(s, lagi, semuaOn) {
    const jalan = s.status === 'berjalan', L = this.of(s.id), BJ = 3, ev = this.evaluasiOf(s.id);
    const baris = (j) => {
      const ket = j.judul && j.isi ? String(j.isi).replace(/\s+/g, ' ').slice(0, 80) + (String(j.isi).length > 80 ? '…' : '') : '';
      return '<div class="tx" data-do="jurnal-detail" data-id="' + j.id + '" role="button" tabindex="0" aria-haspopup="dialog"><div class="tx-l"><div class="note">' + Setelan.tgl(j.tanggal) + ' · hari ' + this.hariKe(s, j.tanggal) +
        (j.evaluasi ? ' · <span class="badge">evaluasi</span>' : '') + (j.foto && j.foto.length ? ' · ' + j.foto.length + ' foto' : '') + '</div><div class="tx-n">' + esc(this.judul(j)) + '</div>' + (ket ? '<div class="note">' + esc(ket) + '</div>' : '') + '</div></div>';
    };
    return '<section><div class="sc-head"><h2 style="margin:0">Jurnal</h2><button type="button" class="btn" data-do="jurnal-linimasa" style="padding:7px 12px;font-size:12px;min-height:40px">Buka linimasa</button></div>' + Cepat.chips(s) + (L.length ? (semuaOn ? L : L.slice(0, BJ)).map(baris).join('') + lagi(L.length, BJ) +
        '<p class="note">Ketuk catatan untuk detail' + (jalan ? ', mengubah, atau menghapus' : '') + '.</p>'
      : '<p class="note">Belum ada catatan.' + (jalan ? ' Ketuk tombol + lalu pilih Catat jurnal untuk mencatat perkembangan tanaman, hama, atau perawatan.' : '') + '</p>') +
      (!jalan && !ev ? '<button type="button" class="btn" data-do="jurnal-eval" style="width:100%;margin-top:10px;min-height:44px">Tulis evaluasi</button>' : '') +
      (!jalan ? '<p class="note">Siklus selesai hanya menerima satu evaluasi; catatan lain bisa dibaca saja. Buka kembali untuk menambah catatan.</p>' : '') + '</section>';
  },
  aksi(a, el) {
    if (a === 'jurnal-detail') { if (el.dataset.sid) Siklus.sid = el.dataset.sid; Rencana.dlgBuka('jurnalDetail', el.dataset.id); return true; }
    if (a === 'jurnal-eval') { Rencana.dlgBuka('jurnalEval'); return true; }
    if (a === 'foto-lihat') { const j = this.cari(el.dataset.id); if (j) Foto.lihat(j.foto, +el.dataset.i); return true; }
    return false;
  },
  /* simpan catatan baru atau perubahan; mengembalikan teks galat (string) atau { toast } */
  simpan(v, id, eval_) {
    const s = Siklus.cari(Siklus.sid); if (!s) return 'Siklus tidak ditemukan.';
    const j = id ? this.cari(id) : null; if (id && !j) return 'Catatan tidak ditemukan.';
    if (!this.boleh(s, j || { evaluasi: eval_ })) return 'Siklus sudah selesai. Buka kembali untuk mengubah catatan.';
    if (eval_ && !j && this.evaluasiOf(s.id)) return 'Evaluasi sudah ada. Ubah evaluasi yang ada.';
    const g = this.cek(s, v('rm_jt')); if (g) return g;
    const judul = eval_ ? '' : v('rm_jj').trim(), isi = v('rm_ji').trim(), foto = eval_ ? [] : Foto.ids();
    if (eval_ ? !isi : (!judul && !isi && !foto.length)) return eval_ ? 'Isi evaluasi.' : 'Isi judul, catatan, atau foto.';
    if (isi.length > 2000) return 'Isi paling banyak 2.000 karakter.';
    const t = v('rm_jt'), n = nowIso();
    if (j) { Object.assign(j, { tanggal: t, judul: judul, isi: isi, diubah: n }); if (!eval_) j.foto = foto.length ? foto : undefined; }
    else this.semua().push({ id: uid('jr'), siklusId: s.id, tanggal: t, jenis: 'catatan', judul: judul, isi: isi, foto: foto.length ? foto : undefined, evaluasi: eval_ ? true : undefined, dibuat: n, diubah: n, terhapus: false });
    s.diubah = n; if (!eval_) Foto.disimpan();
    return { toast: eval_ ? (j ? 'Evaluasi diperbarui' : 'Evaluasi disimpan') : (j ? 'Catatan diperbarui' : 'Catatan ditambahkan') };
  }
};
Object.assign(Rencana.FORM, {
  jurnal: { jenis: 'Jurnal siklus', judul: 'Catat jurnal', judulUbah: 'Ubah catatan', simpan: 'Simpan catatan', tab: 'siklus-detail', fokus: 'rm_jj',
    tutup() { Foto.buang(); },
    ubah(e) { if (e.target.id === 'f_jfoto') Foto.pilih(e.target); },
    aksi(m, id, x) { if (m === 'foto-pilih') { const i = document.getElementById('f_jfoto'); if (i) i.click(); } else if (m === 'foto-lepas') Foto.lepas(x.dataset.id); },
    isi(id) { const aw = id && Jurnal.cari(id); Foto.mulai(aw ? aw.foto : []); setTimeout(() => Foto.isiBox(), 0); return Rencana.lab('rm_jt', 'Tanggal', '<input type="date" id="rm_jt" value="' + isoHari() + '">') +
      Rencana.lab('rm_jj', 'Judul (opsional)', '<input id="rm_jj" maxlength="80" autocomplete="off" placeholder="mis. Daun menguning">') +
      Rencana.lab('rm_ji', 'Isi', '<textarea id="rm_ji" rows="5" maxlength="2000" placeholder="Apa yang terlihat atau dikerjakan hari ini"></textarea>') + Foto.kotak(); },
    isiEd(id, el) { const j = Jurnal.cari(id); if (!j) return; el.querySelector('#rm_jt').value = j.tanggal; el.querySelector('#rm_jj').value = j.judul || ''; el.querySelector('#rm_ji').value = j.isi || ''; },
    ok(v, id) { return Jurnal.simpan(v, id, false); } },
  jurnalEval: { jenis: 'Jurnal siklus', judul: 'Tulis evaluasi', judulUbah: 'Ubah evaluasi', simpan: 'Simpan evaluasi', tab: 'siklus-detail', fokus: 'rm_ji',
    ada(id) { const s = Siklus.cari(Siklus.sid); return !!s && (id ? !!Jurnal.cari(id) : !Jurnal.evaluasiOf(s.id)); },
    isi() { return '<p class="note" style="margin-top:0">Catatan penutup siklus: apa yang berhasil, apa yang bermasalah, dan apa yang akan diubah di siklus berikutnya.</p>' +
      Rencana.lab('rm_jt', 'Tanggal', '<input type="date" id="rm_jt" value="' + isoHari() + '">') +
      Rencana.lab('rm_ji', 'Evaluasi', '<textarea id="rm_ji" rows="6" maxlength="2000" placeholder="mis. Hasil bagus, tetapi hama datang terlambat dikendalikan"></textarea>'); },
    isiEd(id, el) { const j = Jurnal.cari(id); if (!j) return; el.querySelector('#rm_jt').value = j.tanggal; el.querySelector('#rm_ji').value = j.isi || ''; },
    ok(v, id) { return Jurnal.simpan(v, id, true); } },
  jurnalDetail: { jenis: 'Jurnal siklus', judul: 'Detail catatan', ada(id) { return !!Jurnal.cari(id) && !!Siklus.cari(Siklus.sid); }, judulFn(id) { const j = Jurnal.cari(id); return j ? esc(Jurnal.judul(j)) : 'Detail catatan'; },
    isi(id) {
      const j = Jurnal.cari(id), s = Siklus.cari(Siklus.sid), h = Jurnal.hariKe(s, j.tanggal);
      return '<p class="note" style="margin:0 0 12px">' + Setelan.tgl(j.tanggal) + ' · hari ' + h + ' · minggu ' + Math.ceil(h / 7) + (j.evaluasi ? ' · evaluasi' : '') + '</p>' +
        Kejadian.detail(j) + (j.isi ? '<div style="white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.65">' + esc(j.isi) + '</div>' : (j.foto && j.foto.length ? '' : '<p class="note">Tidak ada isi.</p>')) +
        Foto.galeri(j, 'data-rm="foto-lihat"', 'dm-foto') + (j.foto && j.foto.length ? (setTimeout(() => Foto.muat(Modal.m && Modal.m.el), 0), '') : '');
    },
    tombol(id) { const s = Siklus.cari(Siklus.sid), j = Jurnal.cari(id); return (s && Jurnal.boleh(s, j) ? Rencana.bt('ubah', 'Ubah', 'gold') + Rencana.bt('hapus', 'Hapus', 'danger') : '') + Rencana.bt('tutup', 'Tutup', ''); },
    aksi(a, id, x) {
      const j = Jurnal.cari(id), s = Siklus.cari(Siklus.sid); if (!j || !s) return;
      if (a === 'foto-lihat') { Rencana.dlgTutup(true); Foto.lihat(j.foto, +x.dataset.i); return; }
      if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka(j.evaluasi ? 'jurnalEval' : j.jenis === 'tahap' || j.jenis === 'kejadian' || j.jenis === 'ukuran' ? j.jenis : 'jurnal', id); return; }
      if (a !== 'hapus' || !Jurnal.boleh(s, j)) return;
      j.terhapus = true; j.diubah = nowIso(); s.diubah = nowIso(); const batalFoto = Foto.hapusNanti(j);
      const hal = App.tab === 'jurnal' || App.tab === 'siklus' ? App.tab : 'siklus-detail';
      Rencana.dlgTutup(true); App.simpan(); App.go(hal, true); Modal.pulihFokus();
      App.toast(j.evaluasi ? 'Evaluasi dihapus' : 'Catatan dihapus', { label: 'Urungkan', fn: () => { batalFoto(); j.terhapus = false; j.diubah = nowIso(); s.diubah = nowIso(); App.simpan(); if (App.tab === hal) App.go(hal, true); } });
    } }
});
