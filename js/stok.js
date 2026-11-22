/* Buku Kebun — Stok saprodi (v0.1.191, docs/STOK.md)
   Sisa pupuk, benih, pestisida, dan barang lain. Dua koleksi:
   - `saprodi`: barang { id, nama, jenis, satuan, min (batas peringatan, 0 = tanpa), dibuat, diubah, terhapus }
   - `mutasiStok`: tiap perubahan stok { id, saprodiId, tanggal, tipe: 'masuk' | 'pakai' | 'koreksi', qty, siklusId, transaksiId, catatan, dibuat, diubah, terhapus }
   Sisa = masuk + koreksi (bertanda) − pakai. Mutasi terpisah dari barang agar gabungan multi-tab dan sinkron aman per catatan.
   Tambah stok yang berharga membuat transaksi Modal (kategori sesuai jenis) dan ikut mesin Utang; pemakaian tidak mengubah biaya
   (biaya sudah dihitung saat beli). Tampil sebagai sub-tab Stok di Rencana keuangan; isian lewat modal Rencana (Rencana.FORM). */
const Stok = {
  JENIS: [['pupuk', 'Pupuk / nutrisi', 'kg'], ['benih', 'Benih / bibit', 'kg'], ['pestisida', 'Pestisida / obat', 'liter'], ['lain', 'Lainnya', 'unit']],
  KAT: { pupuk: 'pupuk', benih: 'benih', pestisida: 'pestisida', lain: 'lain-keluar' },
  pre: { s: '' }, s: null,

  /* ---------- data ---------- */
  jenisNama(j) { const x = this.JENIS.find((a) => a[0] === j); return x ? x[1] : 'Lainnya'; },
  barang(semua) { return (App.data.saprodi || []).filter((x) => semua || !x.terhapus).slice().sort((a, b) => a.nama.localeCompare(b.nama, 'id')); },
  cari(id) { return (App.data.saprodi || []).find((x) => x.id === id && !x.terhapus) || null; },
  mut(id) { return (App.data.mutasiStok || []).filter((m) => m.saprodiId === id && !m.terhapus); },
  efek(m) { return m.tipe === 'pakai' ? -m.qty : m.qty; },
  peta() { const o = {}; (App.data.mutasiStok || []).forEach((m) => { if (!m.terhapus) o[m.saprodiId] = (o[m.saprodiId] || 0) + this.efek(m); }); return o; },
  sisa(x, M) { return Math.round(((M || this.peta())[x.id] || 0) * 1000) / 1000; },
  qTeks(n) { return String(Math.round(n * 1000) / 1000).replace('.', ','); },
  /* "2", "2,5", "2.5" -> angka (maks. 3 desimal); selain itu 0 */
  qNum(s) { const t = String(s == null ? '' : s).trim(); return /^\d+([.,]\d{1,3})?$/.test(t) ? Math.round(parseFloat(t.replace(',', '.')) * 1000) / 1000 : 0; },
  status(x, M) { const s = this.sisa(x, M); return s <= 0 ? 'habis' : (x.min > 0 && s <= x.min ? 'menipis' : 'ok'); },
  /* barang yang punya batas peringatan dan sisanya sudah di bawah atau sama dengan batas (untuk Beranda) */
  menipis() { const M = this.peta(); return this.barang().filter((x) => x.min > 0 && this.sisa(x, M) <= x.min).map((x) => ({ id: x.id, nama: x.nama, satuan: x.satuan, sisa: this.sisa(x, M) })); },
  butuh() { if (!this.barang().length) { App.toast('Tambah barang dulu'); Rencana.dlgBuka('saprodi'); return false; } return true; },

  /* ---------- tampilan: sub-tab Stok di Rencana ---------- */
  v() {
    const B = this.barang();
    if (!B.length) return '<section><p class="note">Belum ada barang. Ketuk tombol + lalu pilih Tambah barang (pupuk, benih, pestisida). Catat stok masuk saat membeli dan pemakaian saat dipakai, supaya sisa selalu terlihat dan ada peringatan saat menipis.</p></section>';
    const M = this.peta(), rank = (x) => ({ habis: 0, menipis: 1, ok: 2 }[this.status(x, M)]), bln = bulanIni(), P = {};
    (App.data.mutasiStok || []).forEach((m) => { if (!m.terhapus && m.tipe === 'pakai' && m.tanggal.slice(0, 7) === bln) P[m.saprodiId] = (P[m.saprodiId] || 0) + m.qty; });
    const L = B.slice().sort((a, b) => rank(a) - rank(b) || a.nama.localeCompare(b.nama, 'id')), n = B.filter((x) => this.status(x, M) !== 'ok').length;
    const baris = (x) => { const st = this.status(x, M);
      return '<button type="button" class="ang-baris" data-rc="stok-detail" data-id="' + x.id + '" aria-label="Detail stok ' + esc(x.nama) + '"><div class="bar-top"><strong>' + esc(x.nama) + '</strong><span class="mu">' + this.qTeks(this.sisa(x, M)) + ' ' + esc(x.satuan) + '</span></div>' +
        '<div class="note">' + esc(this.jenisNama(x.jenis)) + (P[x.id] ? ' · dipakai bulan ini ' + this.qTeks(P[x.id]) + ' ' + esc(x.satuan) : '') + (x.min > 0 ? ' · batas ' + this.qTeks(x.min) : '') +
        (st === 'habis' ? '<span class="lencana">Habis</span>' : st === 'menipis' ? '<span class="lencana">Menipis</span>' : '') + '</div></button>'; };
    return '<section><div class="sum"><div><span class="note">Barang</span><strong>' + B.length + '</strong></div><div><span class="note">Habis atau menipis</span><strong class="' + (n ? 'down' : '') + '">' + n + '</strong></div></div></section>' +
      '<section><h2>Stok saprodi</h2><p class="note">Ketuk barang untuk melihat riwayat, memakai, menambah stok, atau mengoreksi sisa. Yang habis atau menipis tampil paling atas.</p>' + L.map(baris).join('') + '</section>';
  },

  /* ---------- membuka modal ---------- */
  pakai(id, sid) { if (!this.butuh()) return false; this.pre = { s: sid || '' }; return Rencana.dlgBuka('stokPakai', id || undefined); },
  masuk(id, sid) { if (!this.butuh()) return false; this.pre = { s: sid || '' }; return Rencana.dlgBuka('stokMasuk', id || undefined); },
  opsiBarang(id) { const M = this.peta(), B = this.barang(), sel = B.find((x) => x.id === id) || B[0];
    return '<select id="rm_brg">' + B.map((x) => '<option value="' + x.id + '"' + (x.id === sel.id ? ' selected' : '') + '>' + esc(x.nama) + ' (sisa ' + this.qTeks(this.sisa(x, M)) + ' ' + esc(x.satuan) + ')</option>').join('') + '</select>'; },
  opsiSiklus(sid) { return '<select id="rm_sik"><option value="">Tanpa siklus</option>' + Siklus.opsi(Siklus.daftar().filter((s) => s.status === 'berjalan' || s.id === sid), sid, (x) => Siklus.nama(x.id)) + '</select>'; },
  tgl(v) { return !/^\d{4}-\d{2}-\d{2}$/.test(v) ? 'Isi tanggal.' : v > isoHari() ? 'Tanggal tidak boleh di masa depan.' : ''; },
  tambahMut(x, tipe, qty, tgl, f) {
    const m = Object.assign({ id: uid('m'), saprodiId: x.id, tanggal: tgl, tipe: tipe, qty: qty, siklusId: null, transaksiId: null, catatan: '', dibuat: nowIso(), diubah: nowIso(), terhapus: false }, f || {});
    (App.data.mutasiStok = App.data.mutasiStok || []).push(m); x.diubah = nowIso(); return m;
  },
  /* hapus satu mutasi (dan transaksi belinya); kembalikan false bila ditolak */
  hapusMut(x, m) {
    if (this.sisa(x) - this.efek(m) < 0) { App.toast('Tidak bisa dihapus: sisa stok akan negatif'); return false; }
    const tx = m.transaksiId && App.data.transaksi.find((t) => t.id === m.transaksiId && !t.terhapus);
    if (tx && Utang.tahan(tx)) return false;
    m.terhapus = true; m.diubah = nowIso(); if (tx) { tx.terhapus = true; tx.diubah = nowIso(); Utang.ikut(tx, true); }
    App.simpan(); Rencana.segarDlg('stokDetail', x.id);
    App.toast(tx ? 'Stok masuk dan transaksi belinya dihapus' : 'Catatan stok dihapus', { label: 'Urungkan', fn: () => {
      m.terhapus = false; m.diubah = nowIso(); if (tx) { tx.terhapus = false; tx.diubah = nowIso(); Utang.ikut(tx, false); }
      App.simpan(); Rencana.segarDlg('stokDetail', x.id); } });
    return true;
  },
  riwayat(x) {
    const L = this.mut(x.id).sort((a, b) => b.tanggal.localeCompare(a.tanggal) || String(b.dibuat || '').localeCompare(String(a.dibuat || ''))), sat = ' ' + esc(x.satuan);
    if (!L.length) return '<p class="note">Belum ada riwayat.</p>';
    return '<div class="byr" role="list" aria-label="Riwayat stok">' + L.slice(0, 8).map((m) => {
      const tx = m.transaksiId && App.data.transaksi.find((t) => t.id === m.transaksiId && !t.terhapus), sk = m.siklusId && Siklus.cari(m.siklusId) ? ' · ' + esc(Siklus.nama(m.siklusId).split(' · ')[0]) : '';
      const ket = m.tipe === 'pakai' ? '−' + this.qTeks(m.qty) + sat + sk : m.tipe === 'masuk' ? '+' + this.qTeks(m.qty) + sat + (tx ? ' · beli ' + rp(tx.jumlah) : ' · stok') : (m.qty > 0 ? '+' : '−') + this.qTeks(Math.abs(m.qty)) + sat + ' · koreksi';
      return '<div class="byr-baris" role="listitem"><span class="mu">' + Setelan.tgl(m.tanggal) + '</span><span>' + ket + '</span><button type="button" class="btn byr-x" data-rm="mx" data-mid="' + m.id + '" aria-label="Hapus catatan ' + Setelan.tgl(m.tanggal) + ' ' + esc(ket) + '">Hapus</button></div>';
    }).join('') + '</div>' + (L.length > 8 ? '<p class="note">Menampilkan 8 terbaru dari ' + L.length + ' catatan.</p>' : '');
  }
};

/* ---------- formulir dan detail (mesin modal Rencana) ---------- */
const stokTab = { get tab() { return App.tab === 'siklus-detail' ? 'siklus-detail' : 'rencana'; } };
Rencana.FORM.saprodi = Object.defineProperties({
  jenis: 'Stok saprodi', judul: 'Tambah barang', judulUbah: 'Ubah barang', simpan: 'Simpan barang', lagi: true, fokus: 'rm_nama',
  ada(id) { return !id || !!Stok.cari(id); },
  isi(id) {
    const x = id && Stok.cari(id), j = x ? x.jenis : 'pupuk', d = Stok.JENIS.find((a) => a[0] === j);
    return Rencana.lab('rm_nama', 'Nama barang', '<input id="rm_nama" maxlength="40" autocomplete="off" placeholder="mis. NPK 16-16-16" value="' + esc(x ? x.nama : '') + '">') +
      Rencana.lab('rm_jns', 'Jenis', '<select id="rm_jns">' + Stok.JENIS.map((a) => '<option value="' + a[0] + '"' + (a[0] === j ? ' selected' : '') + '>' + a[1] + '</option>').join('') + '</select>') +
      Rencana.lab('rm_sat', 'Satuan', '<input id="rm_sat" maxlength="12" autocomplete="off" placeholder="kg, liter, sak, botol" value="' + esc(x ? x.satuan : d[2]) + '">') +
      Rencana.lab('rm_min', 'Batas peringatan (opsional)', '<input id="rm_min" inputmode="decimal" autocomplete="off" maxlength="9" placeholder="0 = tanpa peringatan" value="' + (x && x.min ? Stok.qTeks(x.min) : '') + '">') +
      (x ? '' : Rencana.lab('rm_awal', 'Stok awal (opsional)', '<input id="rm_awal" inputmode="decimal" autocomplete="off" maxlength="9" placeholder="sisa yang sudah ada sekarang">')) +
      '<p class="note">Beri batas peringatan agar Beranda memberi tahu saat stok tinggal segitu atau kurang.</p>';
  },
  ubah(e, el) {
    if (e.target.id !== 'rm_jns') return;
    const s = el.querySelector('#rm_sat'), baku = Stok.JENIS.map((a) => a[2]); if (s && (!s.value.trim() || baku.includes(s.value.trim()))) s.value = Stok.JENIS.find((a) => a[0] === e.target.value)[2];
  },
  ok(v, id) {
    const nama = v('rm_nama').trim(), sat = v('rm_sat').trim(), mn = v('rm_min').trim() === '' ? 0 : Stok.qNum(v('rm_min')), aw = v('rm_awal').trim() === '' ? 0 : Stok.qNum(v('rm_awal'));
    if (!nama) return 'Isi nama barang.';
    if (!sat) return 'Isi satuan (mis. kg, liter, sak).';
    if (v('rm_min').trim() !== '' && !mn && !/^0([.,]0+)?$/.test(v('rm_min').trim())) return 'Batas peringatan: isi angka (boleh desimal) atau kosongkan.';
    if (v('rm_awal').trim() !== '' && !aw && !/^0([.,]0+)?$/.test(v('rm_awal').trim())) return 'Stok awal: isi angka (boleh desimal) atau kosongkan.';
    const D = App.data; D.saprodi = D.saprodi || [];
    if (D.saprodi.some((b) => !b.terhapus && b.id !== id && b.nama.toLowerCase() === nama.toLowerCase())) return 'Nama barang itu sudah ada.';
    const x = id && Stok.cari(id);
    if (x) { Object.assign(x, { nama: nama, jenis: v('rm_jns'), satuan: sat, min: mn, diubah: nowIso() }); return { toast: 'Barang diperbarui' }; }
    const b = { id: uid('s'), nama: nama, jenis: v('rm_jns') || 'lain', satuan: sat, min: mn, dibuat: nowIso(), diubah: nowIso(), terhapus: false };
    D.saprodi.push(b); if (aw > 0) Stok.tambahMut(b, 'masuk', aw, isoHari(), { catatan: 'Stok awal' });
    return { toast: 'Barang ditambahkan' };
  }
}, Object.getOwnPropertyDescriptors(stokTab));
Rencana.FORM.stokPakai = Object.defineProperties({
  jenis: 'Stok saprodi', judul: 'Pakai stok', simpan: 'Simpan pemakaian', fokus: 'rm_qty',
  ada(id) { return !id || !!Stok.cari(id); },
  isi(id) {
    return Rencana.lab('rm_brg', 'Barang', Stok.opsiBarang(id)) +
      Rencana.lab('rm_qty', 'Jumlah dipakai (sesuai satuan barang)', '<input id="rm_qty" inputmode="decimal" autocomplete="off" maxlength="9" placeholder="mis. 2,5">') +
      Rencana.lab('rm_tgl', 'Tanggal', '<input type="date" id="rm_tgl" max="' + isoHari() + '" value="' + isoHari() + '">') +
      Rencana.lab('rm_sik', 'Dipakai di siklus (opsional)', Stok.opsiSiklus(Stok.pre.s)) +
      Rencana.lab('rm_cat', 'Catatan (opsional)', '<input id="rm_cat" maxlength="60" autocomplete="off" placeholder="mis. pupuk susulan bedengan 2">') +
      '<p class="note">Pemakaian hanya mengurangi stok. Biayanya sudah dihitung saat barang dibeli.</p>';
  },
  ok(v) {
    const x = Stok.cari(v('rm_brg')); if (!x) return 'Pilih barang.';
    const q = Stok.qNum(v('rm_qty')), tgl = v('rm_tgl'), g = Stok.tgl(tgl), sisa = Stok.sisa(x);
    if (!(q > 0)) return 'Isi jumlah lebih dari 0 (boleh desimal, mis. 2,5).';
    if (g) return g;
    if (q > sisa) return 'Stok ' + x.nama + ' hanya ' + Stok.qTeks(sisa) + ' ' + x.satuan + '. Catat dulu stok masuk atau koreksi sisa.';
    Stok.tambahMut(x, 'pakai', q, tgl, { siklusId: v('rm_sik') || null, catatan: v('rm_cat').trim() });
    return { toast: 'Pemakaian dicatat, sisa ' + Stok.qTeks(sisa - q) + ' ' + x.satuan };
  }
}, Object.getOwnPropertyDescriptors(stokTab));
Rencana.FORM.stokMasuk = Object.defineProperties({
  jenis: 'Stok saprodi', judul: 'Tambah stok (beli)', simpan: 'Simpan stok', fokus: 'rm_qty',
  ada(id) { return !id || !!Stok.cari(id); },
  isi(id) {
    Stok.s = Utang.d0();
    return Rencana.lab('rm_brg', 'Barang', Stok.opsiBarang(id)) +
      Rencana.lab('rm_qty', 'Jumlah masuk (sesuai satuan barang)', '<input id="rm_qty" inputmode="decimal" autocomplete="off" maxlength="9" placeholder="mis. 25">') +
      Rencana.lab('rm_harga', 'Harga total (Rp, opsional)', '<input id="rm_harga" data-rp inputmode="numeric" autocomplete="off" placeholder="0 = hanya catat stok">') +
      '<p class="note" style="margin-top:4px">Bila diisi, otomatis tercatat sebagai modal sesuai jenis barang. Kosongkan untuk stok awal atau pemberian.</p>' +
      Rencana.lab('rm_tgl', 'Tanggal', '<input type="date" id="rm_tgl" max="' + isoHari() + '" value="' + isoHari() + '">') +
      Rencana.lab('rm_sik', 'Siklus untuk modal (opsional)', Stok.opsiSiklus(Stok.pre.s)) +
      '<div id="rm_byr">' + Utang.kotak(Stok.s, 'rm', 'Pemasok / pihak', '') + '</div>' +
      Rencana.lab('rm_cat', 'Catatan (opsional)', '<input id="rm_cat" maxlength="60" autocomplete="off" placeholder="mis. toko tani, merek">');
  },
  ubah(e, el) {
    if (e.target.id === 'rm_bayar') { Utang.baca(Stok.s, 'rm'); const b = el.querySelector('#rm_byr'); b.innerHTML = Utang.kotak(Stok.s, 'rm', 'Pemasok / pihak', ''); if (typeof Form !== 'undefined') Form.upgrade(b); }
  },
  ok(v) {
    const x = Stok.cari(v('rm_brg')); if (!x) return 'Pilih barang.';
    const q = Stok.qNum(v('rm_qty')), harga = angka(v('rm_harga')), tgl = v('rm_tgl'), cat = v('rm_cat').trim(), g = Stok.tgl(tgl);
    if (!(q > 0)) return 'Isi jumlah lebih dari 0 (boleh desimal, mis. 25).';
    if (g) return g;
    let tx = null;
    if (harga > 0) {
      const s = Utang.baca(Stok.s, 'rm'), gal = Utang.cek(harga, s, null); if (gal) return gal;
      const kid = Stok.KAT[x.jenis] || 'lain-keluar', kat = App.semuaKat().find((k) => k.id === kid);
      App.data.transaksi.push(tx = { id: uid('t'), tanggal: tgl, jenis: 'keluar', kategoriId: kid, jumlah: harga, siklusId: v('rm_sik') || null, sifatBiaya: (kat && kat.sifatBiaya) || 'variabel',
        catatan: 'Beli ' + x.nama + ' · ' + Stok.qTeks(q) + ' ' + x.satuan + (cat ? ' · ' + cat : ''), notaId: null, saprodiId: x.id, qty: q, dibuat: nowIso(), diubah: nowIso(), terhapus: false });
      Utang.sinkron(tx, s);
    }
    Stok.tambahMut(x, 'masuk', q, tgl, { transaksiId: tx ? tx.id : null, siklusId: tx ? tx.siklusId : null, catatan: cat });
    return { toast: 'Stok ' + x.nama + ' bertambah, sisa ' + Stok.qTeks(Stok.sisa(x)) + ' ' + x.satuan };
  }
}, Object.getOwnPropertyDescriptors(stokTab));
Rencana.FORM.stokKoreksi = Object.defineProperties({
  jenis: 'Stok saprodi', judul: 'Koreksi sisa stok', simpan: 'Simpan koreksi', fokus: 'rm_sisa',
  ada(id) { return !!Stok.cari(id); },
  judulFn(id) { const x = Stok.cari(id); return x ? 'Koreksi ' + esc(x.nama) : 'Koreksi sisa stok'; },
  isi(id) {
    const x = Stok.cari(id);
    return '<p class="note" style="margin-top:0">Isi sisa yang sebenarnya setelah dihitung langsung. Selisihnya dicatat sebagai koreksi dan tidak mengubah biaya.</p>' +
      Rencana.lab('rm_sisa', 'Sisa sebenarnya (' + esc(x.satuan) + ')', '<input id="rm_sisa" inputmode="decimal" autocomplete="off" maxlength="9" value="' + Stok.qTeks(Stok.sisa(x)) + '">');
  },
  ok(v, id) {
    const x = Stok.cari(id); if (!x) return 'Barang tidak ditemukan.';
    const t = v('rm_sisa').trim(), baru = Stok.qNum(t), sisa = Stok.sisa(x);
    if (!t || (!baru && !/^0([.,]0+)?$/.test(t))) return 'Isi sisa sebenarnya (angka, boleh desimal).';
    const d = Math.round((baru - sisa) * 1000) / 1000; if (!d) return 'Sisa sama dengan yang tercatat.';
    Stok.tambahMut(x, 'koreksi', d, isoHari(), { catatan: 'Koreksi' });
    return { toast: 'Sisa ' + x.nama + ' dikoreksi menjadi ' + Stok.qTeks(baru) + ' ' + x.satuan };
  }
}, Object.getOwnPropertyDescriptors(stokTab));
Rencana.FORM.stokDetail = {
  jenis: 'Stok saprodi', judul: 'Detail stok', ada(id) { return !!Stok.cari(id); }, judulFn(id) { const x = Stok.cari(id); return x ? esc(x.nama) : 'Detail stok'; },
  isi(id) {
    const x = Stok.cari(id), B = (a, b) => Rencana.baris(a, b), st = Stok.status(x), s = Stok.sisa(x), bln = bulanIni();
    const pakai = Stok.mut(id).filter((m) => m.tipe === 'pakai' && m.tanggal.slice(0, 7) === bln).reduce((a, m) => a + m.qty, 0);
    return B('Sisa', '<strong class="' + (st === 'ok' ? '' : 'down') + '">' + Stok.qTeks(s) + ' ' + esc(x.satuan) + '</strong>' + (st === 'habis' ? ' <span class="down">(habis)</span>' : st === 'menipis' ? ' <span class="down">(menipis)</span>' : '')) +
      B('Jenis', esc(Stok.jenisNama(x.jenis))) + B('Batas peringatan', x.min > 0 ? Stok.qTeks(x.min) + ' ' + esc(x.satuan) : 'tanpa batas') + B('Dipakai bulan ini', Stok.qTeks(pakai) + ' ' + esc(x.satuan)) + Stok.riwayat(x);
  },
  tombol() { return Rencana.bt('pakai', 'Pakai stok', 'gold') + Rencana.bt('masuk', 'Tambah stok (beli)', '') + Rencana.bt('koreksi', 'Koreksi sisa', '') + Rencana.bt('ubah', 'Ubah barang', '') + Rencana.bt('hapus', 'Hapus barang', 'danger') + Rencana.bt('tutup', 'Tutup', ''); },
  aksi(a, id, b) {
    const x = Stok.cari(id); if (!x) return;
    if (a === 'pakai') { Rencana.dlgTutup(true); Stok.pakai(id); }
    else if (a === 'masuk') { Rencana.dlgTutup(true); Stok.masuk(id); }
    else if (a === 'koreksi') { Rencana.dlgTutup(true); Rencana.dlgBuka('stokKoreksi', id); }
    else if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka('saprodi', id); }
    else if (a === 'mx') { const m = (App.data.mutasiStok || []).find((q) => q.id === b.dataset.mid && !q.terhapus && q.saprodiId === id); if (m) Stok.hapusMut(x, m); }
    else if (a === 'hapus') {
      x.terhapus = true; x.diubah = nowIso(); Rencana.dlgTutup(true); App.simpan(); App.go('rencana', true); Modal.pulihFokus();
      App.toast('Barang dihapus dari daftar stok', { label: 'Urungkan', fn: () => { x.terhapus = false; x.diubah = nowIso(); App.simpan(); App.go(App.tab, true); } });
    }
  }
};
