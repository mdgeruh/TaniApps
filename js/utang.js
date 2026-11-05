/* Tani Keuangan — pembayaran Tunai / Belum dibayar / Sebagian, tombol Bayar + cicilan, dan perhitungan kas (v0.1.049, docs/UTANG.md)
   Transaksi selalu menyimpan nilai penuh (untung, HPP, laporan memakai nilai ini).
   Bagian yang belum dibayar menjadi catatan utang/piutang tertaut (utang.transaksiId); pembayarannya di utang.bayar.
   Kas = bagian tunai transaksi + pembayaran utang/piutang, bukan jumlah semua transaksi. */
const Utang = {
  MODE: [['tunai', 'Tunai (lunas)'], ['belum', 'Belum dibayar'], ['sebagian', 'Sebagian dibayar']],
  d0() { return { bayar: 'tunai', muka: 0, pihak: '', tempo: '', kunci: false }; },
  semua(t) { return App.data.utang.filter((u) => u.transaksiId === t.id); },
  tertaut(t) { return App.data.utang.find((u) => u.transaksiId === t.id && !u.terhapus) || null; },
  dibayar(u) { return (u.bayar || []).reduce((a, p) => a + p.jumlah, 0); },
  sisa(u) { return u.transaksiId ? Math.max(0, u.jumlah - this.dibayar(u)) : (u.lunas ? 0 : u.jumlah); },
  ada(u) { return !!(u.bayar && u.bayar.length); },
  /* isi draft form dari utang tertaut (mode, uang muka, pihak, tempo, terkunci bila sudah ada pembayaran) */
  dari(t) {
    const u = this.tertaut(t); if (!u) return this.d0();
    const muka = Math.max(0, t.jumlah - u.jumlah);
    return { bayar: muka > 0 ? 'sebagian' : 'belum', muka, pihak: u.pihak || '', tempo: u.jatuhTempo || '', kunci: this.ada(u) };
  },
  /* periksa isian pembayaran; kembalikan pesan galat atau '' */
  cek(jumlah, s, u) {
    if (s.kunci) return u && jumlah < u.jumlah ? 'Jumlah tidak boleh lebih kecil dari utang yang tercatat (' + rp(u.jumlah) + ')' : '';
    if (s.bayar === 'tunai') return '';
    if (!String(s.pihak || '').trim()) return 'Isi nama pihak (pemasok atau pembeli)';
    if (s.bayar === 'sebagian' && !(s.muka > 0 && s.muka < jumlah)) return 'Uang muka harus lebih dari 0 dan kurang dari jumlah';
    return '';
  },
  /* samakan catatan utang dengan transaksi t setelah disimpan */
  sinkron(t, s) {
    const D = App.data, u = this.tertaut(t), jenis = t.jenis === 'keluar' ? 'utang' : 'piutang';
    if (s.kunci && u) { u.jenis = jenis; u.diubah = nowIso(); return; }
    const sisa = s.bayar === 'tunai' ? 0 : s.bayar === 'belum' ? t.jumlah : t.jumlah - s.muka;
    if (sisa > 0) {
      const f = { jenis, pihak: String(s.pihak).trim(), jumlah: sisa, jatuhTempo: s.tempo || '', lunas: false, diubah: nowIso() };
      const lama = u || this.semua(t).find((x) => x.terhapus && !this.ada(x)); // pulihkan catatan lama agar tidak kembar
      if (lama) Object.assign(lama, f, { terhapus: false });
      else D.utang.push(Object.assign({ id: uid('u'), transaksiId: t.id, bayar: [], dibuat: nowIso(), terhapus: false }, f));
    } else if (u) { u.terhapus = true; u.diubah = nowIso(); }
  },
  /* hapus/pulihkan utang tertaut bersama transaksinya */
  ikut(t, hapus) { this.semua(t).forEach((u) => { u.terhapus = hapus; u.diubah = nowIso(); }); },
  /* utang tertaut yang sudah ada pembayarannya menahan penghapusan transaksi */
  tahan(t) {
    const u = this.tertaut(t);
    if (u && this.ada(u)) { App.toast('Sudah ada pembayaran. Buka lagi dulu di Rencana → Utang/piutang'); return true; }
    return false;
  },
  /* ---------- pembayaran / cicilan (tahap 2, v0.1.049) ----------
     Pembayaran = { id, tanggal, jumlah } di utang.bayar. Hanya menggerakkan kas, bukan transaksi Modal/Hasil baru.
     Lunas otomatis saat sisa nol; hapus pembayaran membuka lagi. */
  tx(u) { return App.data.transaksi.find((x) => x.id === u.transaksiId) || null; },
  segar(u) { u.lunas = this.sisa(u) <= 0; u.diubah = nowIso(); },
  /* tanggal bayar paling akhir yang boleh (hari ini, atau tanggal transaksi bila di masa depan) */
  tglMaks(u) { const t = this.tx(u), h = isoHari(); return t && t.tanggal > h ? t.tanggal : h; },
  /* periksa isian pembayaran; kembalikan pesan galat atau '' */
  cekBayar(u, jumlah, tgl) {
    const t = this.tx(u), sisa = this.sisa(u);
    if (!(jumlah > 0)) return 'Isi jumlah pembayaran lebih dari 0';
    if (jumlah > sisa) return 'Jumlah melebihi sisa (' + rp(sisa) + ')';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl || '')) return 'Isi tanggal bayar';
    if (t && tgl < t.tanggal) return 'Tanggal bayar sebelum tanggal transaksi (' + Setelan.tgl(t.tanggal) + ')';
    if (tgl > this.tglMaks(u)) return 'Tanggal bayar tidak boleh di masa depan';
    return '';
  },
  catatBayar(u, jumlah, tgl) {
    (u.bayar = u.bayar || []).push({ id: uid('b'), tanggal: tgl, jumlah: jumlah });
    u.bayar.sort((a, b) => String(a.tanggal).localeCompare(b.tanggal));
    this.segar(u);
  },
  /* hapus satu pembayaran; kembalikan catatannya agar bisa dipulihkan lewat Urungkan */
  hapusBayar(u, bid) {
    const i = (u.bayar || []).findIndex((p) => p.id === bid); if (i < 0) return null;
    const rec = u.bayar.splice(i, 1)[0]; this.segar(u); return rec;
  },
  pulihBayar(u, rec) {
    (u.bayar = u.bayar || []).push(rec); u.bayar.sort((a, b) => String(a.tanggal).localeCompare(b.tanggal)); this.segar(u);
  },

  /* ---------- jendela Bayar ---------- */
  dlg: null,
  dlgBuka(u) {
    const t = this.tx(u); if (Modal.m || !t || this.sisa(u) <= 0) return;
    const sisa = this.sisa(u), byr = this.dibayar(u), keluar = u.jenis === 'utang';
    const row = (a, b) => '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>';
    this.dlg = { id: u.id };
    Modal.buka({
      judulId: 'ubJudul', fokus: 'ub_jumlah', tutupLatar: false,
      html: '<div class="dm-kepala"><div><div class="dm-jenis">' + (keluar ? 'Bayar utang' : 'Terima pembayaran piutang') + '</div><h2 class="dm-judul" id="ubJudul">' + esc(u.pihak) + '</h2></div>' +
        '<button type="button" class="dm-x" data-ub="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="dm-isi">' + row('Jumlah ' + u.jenis, rp(u.jumlah)) + (byr ? row('Sudah dibayar', rp(byr)) : '') + row('Sisa', '<strong>' + rp(sisa) + '</strong>') +
        '<label for="ub_jumlah">' + (keluar ? 'Dibayar sekarang (Rp)' : 'Diterima sekarang (Rp)') + '</label><input id="ub_jumlah" data-rp inputmode="numeric" autocomplete="off" placeholder="0" value="' + fmtInput(sisa) + '">' +
        '<div class="seg sm" style="justify-content:flex-start;margin-top:8px"><button type="button" class="btn" data-ub="semua">Semua sisa</button></div>' +
        '<label for="ub_tgl">Tanggal ' + (keluar ? 'bayar' : 'terima') + '</label><input type="date" id="ub_tgl" min="' + esc(t.tanggal) + '" max="' + esc(this.tglMaks(u)) + '" value="' + esc(this.tglMaks(u)) + '">' +
        '<p class="note" style="margin-top:8px">Bisa dicicil: isi sebagian saja, sisanya tetap tercatat. Pembayaran hanya menggerakkan kas, tidak mengubah untung atau HPP.</p></div>' +
        '<div class="dm-aksi"><button type="button" class="btn gold" data-ub="simpan">Simpan pembayaran</button><button type="button" class="btn" data-ub="tutup" style="width:100%">Batal</button></div>',
      klik: (e) => {
        const b = e.target.closest('[data-ub]'); if (!b) return; const a = b.dataset.ub;
        if (a === 'tutup') Modal.tutup();
        else if (a === 'semua') { const i = document.getElementById('ub_jumlah'); i.value = fmtInput(this.sisa(u)); i.focus(); }
        else if (a === 'simpan') this.dlgSimpan(u);
      },
      simpan: () => this.dlgSimpan(u),
      onTutup: () => { this.dlg = null; }
    });
  },
  dlgTutup(tanpaFokus) { Modal.tutup(tanpaFokus); },
  dlgSimpan(u) {
    const g = (i) => document.getElementById(i).value, j = angka(g('ub_jumlah')), tgl = g('ub_tgl'), gal = this.cekBayar(u, j, tgl);
    if (gal) { Modal.galat(gal); return; }
    this.catatBayar(u, j, tgl);
    const sisa = this.sisa(u);
    Modal.tutup(true); App.simpan(); App.go('rencana', true); Modal.pulihFokus();
    App.toast(sisa <= 0 ? 'Lunas. Pembayaran tersimpan' : 'Pembayaran tersimpan, sisa ' + rp(sisa));
  },

  /* ---------- kas: uang yang benar-benar bergerak ---------- */
  peristiwa() {
    const out = [];
    App.aktif().forEach((t) => {
      const u = this.tertaut(t), tunai = t.jumlah - (u ? Math.min(u.jumlah, t.jumlah) : 0);
      out.push({ tgl: t.tanggal, n: (t.jenis === 'masuk' ? 1 : -1) * tunai });
      if (u) (u.bayar || []).forEach((p) => out.push({ tgl: p.tanggal, n: (u.jenis === 'piutang' ? 1 : -1) * p.jumlah }));
    });
    return out;
  },
  saldoAwal() { return Number(App.data.pengaturan.saldoAwal) || 0; },
  saldo() { return this.saldoAwal() + this.peristiwa().reduce((a, e) => a + e.n, 0); },
  saldoSd(k) { return this.saldoAwal() + this.peristiwa().filter((e) => e.tgl.slice(0, 7) <= k).reduce((a, e) => a + e.n, 0); },
  net(k) { return this.peristiwa().filter((e) => e.tgl.slice(0, 7) === k).reduce((a, e) => a + e.n, 0); },

  /* ---------- tampilan: kotak pembayaran di form ---------- */
  /* pre: awalan id ('f' atau 'p'); pihakId: id isian pihak yang sudah ada di form (panen: p_pembeli) atau '' bila perlu isian pihak sendiri */
  kotak(s, pre, lbPihak, pihakId) {
    if (s.kunci) return '<p class="note" style="margin-top:12px">Utang/piutang transaksi ini sudah ada pembayarannya. Ubah lewat Rencana → Utang/piutang (Buka lagi) bila perlu.</p>';
    const o = this.MODE.map((m) => '<option value="' + m[0] + '"' + (s.bayar === m[0] ? ' selected' : '') + '>' + m[1] + '</option>').join('');
    let h = '<label for="' + pre + '_bayar">Pembayaran</label><select id="' + pre + '_bayar">' + o + '</select>';
    if (s.bayar === 'tunai') return h;
    if (s.bayar === 'sebagian') h += '<label for="' + pre + '_muka">Dibayar di muka (Rp)</label><input id="' + pre + '_muka" data-rp inputmode="numeric" autocomplete="off" placeholder="0" value="' + fmtInput(s.muka) + '">';
    if (!pihakId) h += '<label for="' + pre + '_pihak">' + lbPihak + '</label><input id="' + pre + '_pihak" maxlength="60" value="' + esc(s.pihak) + '">';
    h += '<label for="' + pre + '_tempo">Jatuh tempo (opsional)</label><input type="date" id="' + pre + '_tempo" value="' + esc(s.tempo) + '">';
    return h + '<p class="note" style="margin-top:8px">Nilai penuh tetap dihitung di untung dan HPP. Kas hanya berubah sebesar yang dibayar. Sisanya masuk Rencana → Utang/piutang.</p>';
  },
  /* baca isian kotak dari form ke objek s (nilai lama dipertahankan bila elemen tidak ada) */
  baca(s, pre) {
    const g = (i) => document.getElementById(pre + '_' + i);
    if (g('bayar')) s.bayar = g('bayar').value;
    if (g('muka')) s.muka = angka(g('muka').value); else if (s.bayar !== 'sebagian') s.muka = 0;
    if (g('pihak')) s.pihak = g('pihak').value;
    if (g('tempo')) s.tempo = g('tempo').value;
    return s;
  }
};
