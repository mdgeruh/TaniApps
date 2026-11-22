/* Buku Kebun — Upah harian / HOK (v0.1.190, docs/UPAH.md)
   Daftar pekerja (koleksi `pekerja`) dan catatan upah. Satu catatan upah = satu transaksi Modal kategori Tenaga Kerja ('upah') dengan
   kolom tambahan { pekerjaId, pekerjaNama, hari, tarifHarian, catatanUpah }. Karena itu upah otomatis ikut siklus, HPP, laporan, kas,
   ekspor, cadangan, dan sinkron tanpa jalur baru. Belum dibayar / sebagian memakai mesin Utang (pihak = nama pekerja).
   Tampil sebagai sub-tab Upah di Rencana keuangan; isian lewat modal Rencana (Rencana.FORM). */
const Upah = {
  per: 'bulan', batas: 20, pre: { p: '', s: '' }, s: null,
  PER: [['bulan', 'Bulan ini'], ['lalu', 'Bulan lalu'], ['semua', 'Semua']],

  /* ---------- data ---------- */
  daftarP(semua) { return (App.data.pekerja || []).filter((p) => semua || !p.terhapus).slice().sort((a, b) => a.nama.localeCompare(b.nama, 'id')); },
  cariP(id) { return (App.data.pekerja || []).find((p) => p.id === id) || null; },
  aktifP(id) { const p = this.cariP(id); return p && !p.terhapus ? p : null; },
  cariTx(id) { return App.data.transaksi.find((t) => t.id === id && !t.terhapus && t.pekerjaId) || null; },
  nama(t) { const p = this.cariP(t.pekerjaId); return p ? p.nama : (t.pekerjaNama || 'Pekerja'); },
  entri() { return App.aktif().filter((t) => t.pekerjaId); },
  hariTeks(h) { return String(Math.round(h * 100) / 100).replace('.', ','); },
  /* "1", "0,5", "1.5" -> angka; selain itu 0 */
  hariNum(s) { const t = String(s == null ? '' : s).trim(); return /^\d+([.,]\d{1,2})?$/.test(t) ? Math.round(parseFloat(t.replace(',', '.')) * 100) / 100 : 0; },
  catatan(nama, hari, note) { return 'Upah ' + nama + ' · ' + this.hariTeks(hari) + ' hari' + (note ? ' · ' + note : ''); },
  petaUtang() { const m = {}; App.data.utang.forEach((u) => { if (!u.terhapus && u.transaksiId) m[u.transaksiId] = u; }); return m; },
  sisa(t, U) { const u = U[t.id]; return u ? Utang.sisa(u) : 0; },
  dalam(t, per) { per = per || this.per; return per === 'semua' || t.tanggal.slice(0, 7) === (per === 'lalu' ? bulanLalu() : bulanIni()); },
  hitung(E, U) { return E.reduce((a, t) => { a.hari += t.hari || 0; a.jumlah += t.jumlah; a.sisa += this.sisa(t, U); return a; }, { hari: 0, jumlah: 0, sisa: 0 }); },
  /* nama pekerja berubah: samakan catatan transaksi dan nama pihak utangnya */
  segarkan(p) {
    const U = this.petaUtang();
    App.data.transaksi.filter((t) => t.pekerjaId === p.id).forEach((t) => {
      t.pekerjaNama = p.nama; t.catatan = this.catatan(p.nama, t.hari || 0, t.catatanUpah || ''); t.diubah = nowIso();
      if (U[t.id]) { U[t.id].pihak = p.nama; U[t.id].diubah = nowIso(); }
    });
  },

  /* ---------- tampilan: sub-tab Upah di Rencana ---------- */
  rowTx(t, U) {
    const sisa = this.sisa(t, U), sk = t.siklusId && Siklus.cari(t.siklusId) ? ' · ' + esc(Siklus.nama(t.siklusId).split(' · ')[0]) : '';
    return '<button type="button" class="ang-baris" data-rc="upah-detail" data-id="' + t.id + '" aria-label="Detail upah ' + esc(this.nama(t)) + ' ' + esc(Setelan.tgl(t.tanggal)) + '">' +
      '<div class="bar-top"><strong>' + esc(this.nama(t)) + '</strong><span class="mu">' + rp(t.jumlah) + '</span></div>' +
      '<div class="note">' + Setelan.tgl(t.tanggal) + ' · ' + this.hariTeks(t.hari || 0) + ' hari × ' + rp(t.tarifHarian || 0) + sk + (sisa > 0 ? '<span class="lencana">Belum dibayar ' + rp(sisa) + '</span>' : '') + '</div></button>';
  },
  v() {
    const P = this.daftarP(), E = this.entri(), U = this.petaUtang();
    if (!P.length && !E.length) return '<section><p class="note">Belum ada pekerja. Ketuk tombol + lalu pilih Tambah pekerja. Upah yang dicatat di sini otomatis menjadi modal Tenaga Kerja di siklusnya, jadi ikut HPP dan laporan. Yang belum dibayar masuk ke Utang/piutang.</p></section>';
    const chips = '<div class="seg sm" style="justify-content:flex-start;margin:0 0 6px">' + this.PER.map((x) => '<button type="button" class="btn' + (this.per === x[0] ? ' on' : '') + '" data-rc="up" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    const Ep = E.filter((t) => this.dalam(t)), tot = this.hitung(Ep, U), belum = this.hitung(E, U).sisa;
    const ring = '<div class="sum"><div><span class="note">Upah</span><strong>' + rp(tot.jumlah) + '</strong></div><div><span class="note">Hari kerja</span><strong>' + this.hariTeks(tot.hari) + '</strong></div>' +
      '<div><span class="note">Belum dibayar</span><strong class="' + (belum > 0 ? 'down' : '') + '">' + rp(belum) + '</strong></div></div>';
    const pk = P.length ? P.map((p) => {
      const mine = E.filter((t) => t.pekerjaId === p.id), a = this.hitung(mine.filter((t) => this.dalam(t)), U), b = this.hitung(mine, U).sisa;
      return '<button type="button" class="ang-baris" data-rc="pkj-detail" data-id="' + p.id + '" aria-label="Detail pekerja ' + esc(p.nama) + '"><div class="bar-top"><strong>' + esc(p.nama) + '</strong><span class="mu">' + rp(p.tarif) + '/hari</span></div>' +
        '<div class="note">' + (a.hari ? this.hariTeks(a.hari) + ' hari · ' + rp(a.jumlah) : 'Belum ada upah pada periode ini') + (b > 0 ? '<span class="lencana">Belum dibayar ' + rp(b) + '</span>' : '') + '</div></button>';
    }).join('') : '<p class="note">Belum ada pekerja aktif.</p>';
    const tunggak = E.filter((t) => this.sisa(t, U) > 0).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    const riw = Ep.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal) || String(b.dibuat || '').localeCompare(String(a.dibuat || '')));
    return '<section>' + chips + ring + '</section>' +
      '<section><h2>Pekerja</h2><p class="note">Ketuk pekerja untuk melihat rekap, mencatat upah, atau mengubah tarifnya.</p>' + pk + '</section>' +
      (tunggak.length ? '<section><h2>Upah belum dibayar</h2><p class="note">Ketuk untuk membayar. Pembayaran hanya menggerakkan kas, tidak mengubah biaya siklus.</p>' + tunggak.map((t) => this.rowTx(t, U)).join('') + '</section>' : '') +
      '<section><h2>Riwayat upah</h2>' + (riw.length ? riw.slice(0, this.batas).map((t) => this.rowTx(t, U)).join('') +
        (riw.length > this.batas ? '<button type="button" class="btn" data-rc="upah-lagi" style="width:100%;margin-top:8px">Tampilkan lebih banyak (' + (riw.length - this.batas) + ')</button>' : '') : '<p class="note">Belum ada upah pada periode ini.</p>') + '</section>';
  },
  aksi(a, b) {
    if (a === 'up') { this.per = b.dataset.v; this.batas = 20; } else if (a === 'upah-lagi') this.batas += 20; else return false;
    App.go('rencana', true); return true;
  },

  /* ---------- membuka modal ---------- */
  /* pid / sid: pekerja dan siklus yang dipilih lebih dulu (opsional) */
  catat(pid, sid) {
    if (!this.daftarP().length) { App.toast('Tambah pekerja dulu'); return Rencana.dlgBuka('pekerja'); }
    this.pre = { p: pid || '', s: sid || '' };
    return this.buka();
  },
  buka(id) {
    if (!Rencana.dlgBuka('upah', id)) return false;
    const el = Modal.m && Modal.m.el; if (el) { el.addEventListener('input', () => this.total(el)); this.total(el); }
    return true;
  },
  total(el) {
    const t = el.querySelector('#rm_total'), h = el.querySelector('#rm_hari'), r = el.querySelector('#rm_tarif'); if (!t || !h || !r) return;
    t.textContent = rp(Math.round(this.hariNum(h.value) * angka(r.value)));
  },
  /* rekap satu pekerja */
  stat(pid) {
    const U = this.petaUtang(), mine = this.entri().filter((t) => t.pekerjaId === pid);
    return { bulan: this.hitung(mine.filter((t) => this.dalam(t, 'bulan')), U), lalu: this.hitung(mine.filter((t) => this.dalam(t, 'lalu')), U), semua: this.hitung(mine, U) };
  },
  hapusTx(t) {
    if (Utang.tahan(t)) return;
    t.terhapus = true; t.diubah = nowIso(); Utang.ikut(t, true); Rencana.dlgTutup(true); App.simpan(); App.go('rencana', true); Modal.pulihFokus();
    App.toast('Upah dihapus', { label: 'Urungkan', fn: () => { t.terhapus = false; t.diubah = nowIso(); Utang.ikut(t, false); App.simpan(); App.go(App.tab, true); } });
  }
};

/* ---------- formulir dan detail (mesin modal Rencana) ---------- */
Rencana.FORM.upah = {
  jenis: 'Upah harian', judul: 'Catat upah', judulUbah: 'Ubah upah', simpan: 'Simpan upah', fokus: 'rm_hari',
  get tab() { return App.tab === 'siklus-detail' ? 'siklus-detail' : 'rencana'; },
  ada(id) { return !id || !!Upah.cariTx(id); },
  isi(id) {
    const t = id && Upah.cariTx(id), L = Upah.daftarP();
    if (t && !L.some((p) => p.id === t.pekerjaId)) L.push(Upah.cariP(t.pekerjaId) || { id: t.pekerjaId, nama: t.pekerjaNama || 'Pekerja', tarif: t.tarifHarian || 0 }); // pekerja yang sudah dihapus tetap tampil saat mengubah catatan lamanya
    const pil = t ? t.pekerjaId : (L.some((p) => p.id === Upah.pre.p) ? Upah.pre.p : L[0].id), p0 = L.find((p) => p.id === pil) || L[0];
    const tarif = t ? (t.tarifHarian || 0) : p0.tarif, sid = t ? (t.siklusId || '') : Upah.pre.s;
    Upah.s = t ? Utang.dari(t) : Utang.d0();
    return Rencana.lab('rm_pkj', 'Pekerja', '<select id="rm_pkj">' + L.map((p) => '<option value="' + p.id + '" data-tarif="' + (p.tarif || 0) + '"' + (p.id === pil ? ' selected' : '') + '>' + esc(p.nama) + '</option>').join('') + '</select>') +
      Rencana.lab('rm_hari', 'Jumlah hari kerja', '<input id="rm_hari" inputmode="decimal" autocomplete="off" maxlength="5" placeholder="1" value="' + (t ? Upah.hariTeks(t.hari || 0) : '1') + '">') +
      Rencana.lab('rm_tarif', 'Upah per hari (Rp)', '<input id="rm_tarif" data-rp inputmode="numeric" autocomplete="off" placeholder="0" value="' + fmtInput(tarif) + '">') +
      '<div class="row"><span class="mu">Total upah</span><strong id="rm_total">Rp 0</strong></div>' +
      '<p class="note" style="margin-top:4px">Boleh 0,5 untuk setengah hari.</p>' +
      Rencana.lab('rm_tgl', 'Tanggal', '<input type="date" id="rm_tgl" max="' + isoHari() + '" value="' + esc(t ? t.tanggal : isoHari()) + '">') +
      Rencana.lab('rm_sik', 'Siklus (opsional)', '<select id="rm_sik"><option value="">Tanpa siklus</option>' + Siklus.opsi(Siklus.daftar().filter((s) => s.status === 'berjalan' || s.id === sid), sid, (x) => Siklus.nama(x.id)) + '</select>') +
      '<div id="rm_byr">' + Utang.kotak(Upah.s, 'rm', '', 'rm_pkj') + '</div>' +
      Rencana.lab('rm_cat', 'Catatan (opsional)', '<input id="rm_cat" maxlength="60" autocomplete="off" placeholder="mis. memupuk bedengan" value="' + esc(t ? t.catatanUpah || '' : '') + '">');
  },
  ubah(e, el) {
    if (e.target.id === 'rm_pkj') { const o = e.target.selectedOptions[0], r = el.querySelector('#rm_tarif'); if (o && r && +o.dataset.tarif) r.value = fmtInput(+o.dataset.tarif); }
    else if (e.target.id === 'rm_bayar') { Utang.baca(Upah.s, 'rm'); const b = el.querySelector('#rm_byr'); b.innerHTML = Utang.kotak(Upah.s, 'rm', '', 'rm_pkj'); if (typeof Form !== 'undefined') Form.upgrade(b); }
    Upah.total(el);
  },
  ok(v, id) {
    const t = id && Upah.cariTx(id), pid = v('rm_pkj');
    const P = Upah.cariP(pid) || (t && t.pekerjaId === pid ? { id: pid, nama: t.pekerjaNama || 'Pekerja' } : null);
    if (!P) return 'Pilih pekerja.';
    const hari = Upah.hariNum(v('rm_hari')), tarif = angka(v('rm_tarif')), tgl = v('rm_tgl'), note = v('rm_cat').trim();
    if (!(hari > 0) || hari > 31) return 'Isi jumlah hari antara 0,01 dan 31 (0,5 = setengah hari).';
    if (!tarif) return 'Isi upah per hari.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return 'Isi tanggal.';
    if (tgl > isoHari()) return 'Tanggal tidak boleh di masa depan.';
    const jumlah = Math.round(hari * tarif), s = Utang.baca(Upah.s, 'rm'); s.pihak = P.nama;
    const gal = Utang.cek(jumlah, s, t && Utang.tertaut(t)); if (gal) return gal;
    const kat = App.semuaKat().find((k) => k.id === 'upah'), sik = v('rm_sik') || null;
    const f = { tanggal: tgl, jenis: 'keluar', kategoriId: 'upah', jumlah: jumlah, sifatBiaya: (kat && kat.sifatBiaya) || 'variabel', catatan: Upah.catatan(P.nama, hari, note), siklusId: sik,
      pekerjaId: P.id, pekerjaNama: P.nama, hari: hari, tarifHarian: tarif, catatanUpah: note, diubah: nowIso() };
    let tx = t;
    if (t) Object.assign(t, f); else App.data.transaksi.push(tx = Object.assign({ id: uid('t'), notaId: null, dibuat: nowIso(), terhapus: false }, f));
    Utang.sinkron(tx, s);
    return { toast: t ? 'Upah diperbarui' : 'Upah tersimpan' };
  }
};
Rencana.FORM.upahDetail = {
  jenis: 'Upah harian', judul: 'Detail upah', ada(id) { return !!Upah.cariTx(id); }, judulFn(id) { const t = Upah.cariTx(id); return t ? esc(Upah.nama(t)) : 'Detail upah'; },
  isi(id) {
    const t = Upah.cariTx(id), u = Utang.tertaut(t), sisa = u ? Utang.sisa(u) : 0, B = (a, b) => Rencana.baris(a, b);
    return B('Tanggal', Setelan.tgl(t.tanggal)) + B('Hari kerja', Upah.hariTeks(t.hari || 0)) + B('Upah per hari', rp(t.tarifHarian || 0)) + B('Total upah', '<strong>' + rp(t.jumlah) + '</strong>') +
      (t.siklusId && Siklus.cari(t.siklusId) ? B('Siklus', esc(Siklus.nama(t.siklusId))) : '') +
      B('Pembayaran', u ? (sisa > 0 ? '<span class="down">belum dibayar ' + rp(sisa) + '</span>' : '<span class="up">lunas</span>') : '<span class="up">tunai (lunas)</span>') +
      (u && sisa > 0 && u.jatuhTempo ? B('Jatuh tempo', Setelan.tgl(u.jatuhTempo)) : '') + (t.catatanUpah ? B('Catatan', esc(t.catatanUpah)) : '');
  },
  tombol(id) {
    const t = Upah.cariTx(id), u = t && Utang.tertaut(t);
    return (u && Utang.sisa(u) > 0 && App.tab === 'rencana' ? Rencana.bt('bayar', 'Bayar upah', 'gold') : '') + Rencana.bt('ubah', 'Ubah upah', u && Utang.sisa(u) > 0 ? '' : 'gold') + Rencana.bt('hapus', 'Hapus upah', 'danger') + Rencana.bt('tutup', 'Tutup', '');
  },
  aksi(a, id) {
    const t = Upah.cariTx(id); if (!t) return;
    if (a === 'bayar') { const u = Utang.tertaut(t); if (u) { Rencana.dlgTutup(true); Utang.dlgBuka(u); } }
    else if (a === 'ubah') { Rencana.dlgTutup(true); Upah.buka(id); }
    else if (a === 'hapus') Upah.hapusTx(t);
  }
};
Rencana.FORM.pekerja = {
  jenis: 'Pekerja', judul: 'Tambah pekerja', judulUbah: 'Ubah pekerja', simpan: 'Simpan pekerja', lagi: true, fokus: 'rm_nama',
  get tab() { return App.tab === 'siklus-detail' ? 'siklus-detail' : 'rencana'; },
  ada(id) { return !id || !!Upah.aktifP(id); },
  isi(id) {
    const p = id && Upah.aktifP(id);
    return Rencana.lab('rm_nama', 'Nama pekerja', '<input id="rm_nama" maxlength="40" autocomplete="off" placeholder="mis. Pak Budi" value="' + esc(p ? p.nama : '') + '">') +
      Rencana.lab('rm_tarif', 'Upah per hari (Rp)', '<input id="rm_tarif" data-rp inputmode="numeric" autocomplete="off" placeholder="0" value="' + fmtInput(p ? p.tarif : 0) + '">') +
      Rencana.lab('rm_cat', 'Catatan (opsional)', '<input id="rm_cat" maxlength="60" autocomplete="off" placeholder="mis. nomor HP, bagian kerja" value="' + esc(p ? p.catatan || '' : '') + '">') +
      '<p class="note">Tarif ini hanya isian awal saat mencatat upah. Mengubahnya tidak mengubah upah yang sudah dicatat.</p>';
  },
  ok(v, id) {
    const nama = v('rm_nama').trim(), tarif = angka(v('rm_tarif')), cat = v('rm_cat').trim(), D = App.data;
    if (!nama) return 'Isi nama pekerja.';
    if (!tarif) return 'Isi upah per hari.';
    D.pekerja = D.pekerja || [];
    if (D.pekerja.some((p) => !p.terhapus && p.id !== id && p.nama.toLowerCase() === nama.toLowerCase())) return 'Nama itu sudah ada.';
    const p = id && Upah.aktifP(id);
    if (p) { const ganti = p.nama !== nama; Object.assign(p, { nama: nama, tarif: tarif, catatan: cat, diubah: nowIso() }); if (ganti) Upah.segarkan(p); return { toast: 'Pekerja diperbarui' }; }
    D.pekerja.push({ id: uid('k'), nama: nama, tarif: tarif, catatan: cat, dibuat: nowIso(), diubah: nowIso(), terhapus: false });
    return { toast: 'Pekerja ditambahkan' };
  }
};
Rencana.FORM.pekerjaDetail = {
  jenis: 'Pekerja', judul: 'Detail pekerja', ada(id) { return !!Upah.aktifP(id); }, judulFn(id) { const p = Upah.cariP(id); return p ? esc(p.nama) : 'Detail pekerja'; },
  isi(id) {
    const p = Upah.cariP(id), st = Upah.stat(id), B = (a, b) => Rencana.baris(a, b), r = (x) => (x.hari ? Upah.hariTeks(x.hari) + ' hari · ' + rp(x.jumlah) : '—');
    return B('Upah per hari', rp(p.tarif)) + B('Bulan ini', r(st.bulan)) + B('Bulan lalu', r(st.lalu)) + B('Seluruhnya', r(st.semua)) +
      B('Belum dibayar', st.semua.sisa > 0 ? '<strong class="down">' + rp(st.semua.sisa) + '</strong>' : '—') + (p.catatan ? B('Catatan', esc(p.catatan)) : '');
  },
  tombol() { return Rencana.bt('catat', 'Catat upah', 'gold') + Rencana.bt('ubah', 'Ubah pekerja', '') + Rencana.bt('hapus', 'Hapus pekerja', 'danger') + Rencana.bt('tutup', 'Tutup', ''); },
  aksi(a, id) {
    const p = Upah.aktifP(id); if (!p) return;
    if (a === 'catat') { Rencana.dlgTutup(true); Upah.catat(id); }
    else if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka('pekerja', id); }
    else if (a === 'hapus') {
      p.terhapus = true; p.diubah = nowIso(); Rencana.dlgTutup(true); App.simpan(); App.go('rencana', true); Modal.pulihFokus();
      App.toast('Pekerja dihapus (catatan upahnya tetap ada)', { label: 'Urungkan', fn: () => { p.terhapus = false; p.diubah = nowIso(); App.simpan(); App.go(App.tab, true); } });
    }
  }
};
