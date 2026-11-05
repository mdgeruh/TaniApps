/* Tani Keuangan — Fase 5: anggaran, arus kas, aset, utang/piutang (v0.1.015; tombol Bayar dan cicilan v0.1.049; semua isian lewat modal FAB v0.1.055) */
const Rencana = {
  sub: 'anggaran',
  SUB: [['anggaran', 'Anggaran'], ['kas', 'Arus kas'], ['aset', 'Aset'], ['utang', 'Utang/piutang'], ['harga', 'Harga pasar'], ['kelayakan', 'Kelayakan']],
  d() { return App.data; },
  bulanKe(n) { const x = new Date(); x.setDate(1); x.setMonth(x.getMonth() + n); return isoHari(x).slice(0, 7); },
  net(k) { return Utang.net(k); },
  saldoAwal() { return Number(App.data.pengaturan.saldoAwal) || 0; },
  BLN: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
  namaBln(k) { return this.BLN[+k.slice(5, 7) - 1] + ' ' + k.slice(0, 4); },
  saldoSd(k) { return Utang.saldoSd(k); },
  rata3() { const a = [-3, -2, -1].map((n) => this.bulanKe(n)).filter((k) => App.aktif().some((t) => t.tanggal.slice(0, 7) === k)); return a.length ? a.reduce((s, k) => s + this.net(k), 0) / a.length : 0; },
  mulai(a) { const [y, m] = a.tanggalBeli.split('-').map(Number), n = new Date(); return Math.max(0, Math.min(a.umurBulan, (n.getFullYear() - y) * 12 + n.getMonth() + 1 - m)); },
  baris(a, b) { return '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>'; },
  ringkas() {
    const U = this.d().utang.filter((u) => !u.terhapus && !u.lunas), tot = (j) => U.filter((u) => u.jenis === j).reduce((s, u) => s + Utang.sisa(u), 0);
    const S = Siklus.daftar().filter((s) => s.anggaran > 0), ang = S.reduce((a, s) => a + s.anggaran, 0), real = S.reduce((a, s) => a + Siklus.ringkas(s.id).modal, 0), sal = Utang.saldo();
    return '<section><div class="sum"><div><span class="note">Saldo kas</span><strong class="' + (sal < 0 ? 'down' : 'up') + '">' + rp(sal) + '</strong></div><div><span class="note">Utang</span><strong class="down">' + rp(tot('utang')) + '</strong></div><div><span class="note">Piutang</span><strong class="up">' + rp(tot('piutang')) + '</strong></div></div>' +
      (ang ? '<p class="note" style="margin:8px 0 0">Anggaran terpakai ' + Math.round(real / ang * 100) + '% (' + rp(real) + ' dari ' + rp(ang) + ')</p>' : '') + '</section>';
  },
  gulirChip() { requestAnimationFrame(() => { const c = document.querySelector('.rc-chips'), a = c && c.querySelector('.on'); if (a) c.scrollLeft = a.offsetLeft - (c.clientWidth - a.offsetWidth) / 2; }); },
  v() { Utang._memo = Utang.peristiwa(); try { return this.v0(); } finally { Utang._memo = null; } },
  v0() {
    this.gulirChip();
    const chips = '<div class="seg sm rc-chips" style="justify-content:flex-start;margin:6px 0">' + this.SUB.map((x) => '<button type="button" class="btn' + (this.sub === x[0] ? ' on' : '') + '" data-rcs="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    return this.ringkas() + '<section>' + chips + '</section>' + this['v_' + this.sub]() +
      '<button class="btn" data-go="lainnya" style="width:100%;margin-top:12px">Kembali</button>';
  },
  v_anggaran() {
    const L = Siklus.daftar();
    if (!L.length) return '<section><p class="note">Belum ada siklus. Buat dulu di menu Siklus.</p></section>';
    const X = L.map((s) => { const r = Siklus.ringkas(s.id).modal, ang = s.anggaran || 0; return { s: s, r: r, ang: ang, p: ang ? Math.round(r / ang * 100) : -1 }; }).sort((x, y) => y.p - x.p);
    const baris = (x) => '<button type="button" class="ang-baris" data-rc="ang-detail" data-id="' + x.s.id + '" aria-label="Detail anggaran ' + esc(Siklus.nama(x.s.id)) + '"><div class="bar-top"><strong>' + esc(Siklus.nama(x.s.id)) + '</strong><span class="mu">' + (x.ang ? x.p + '%' : 'tanpa anggaran') + '</span></div>' +
      (x.ang ? '<div class="bar-ang' + (x.p > 100 ? ' x' : x.p >= 90 ? ' w' : '') + '"><i style="width:' + Math.min(100, x.p) + '%"></i></div><div class="note">' + rp(x.r) + ' / ' + rp(x.ang) + '</div>' : '<div class="note">Modal terpakai ' + rp(x.r) + '</div>') + '</button>';
    const jalan = X.filter((x) => x.s.status === 'berjalan'), lain = X.filter((x) => x.s.status !== 'berjalan');
    return '<section><p class="note">Ketuk siklus untuk melihat detail, mengubah, atau menghapus anggarannya. Tombol + mengatur anggaran siklus mana pun.</p>' + (jalan.length ? jalan.map(baris).join('') : '<p class="note">Tidak ada siklus berjalan.</p>') +
      (lain.length ? '<details class="lg-detail"><summary>Siklus selesai (' + lain.length + ')</summary>' + lain.map(baris).join('') + '</details>' : '') + '</section>';
  },
  v_harga() { return Harga.v(); },
  v_kelayakan() { return Kelayakan.v(); },
  grafikKas(B, P, r) {
    const V = B.map((k) => [k, this.net(k), 0]).concat(P.map((x) => [x[0], x[1], 1])), mx = Math.max(1, ...V.map((x) => Math.abs(x[1]))), w = 300 / V.length, sal = Utang.saldo();
    const bar = V.map((x, i) => { const h = Math.max(1, Math.abs(x[1]) / mx * 38), up = x[1] >= 0;
      return '<rect class="' + (up ? 'kas-up' : 'kas-down') + '" x="' + (i * w + 4).toFixed(1) + '" y="' + (up ? 44 - h : 44).toFixed(1) + '" width="' + (w - 8).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2"' + (x[2] ? ' opacity=".4"' : '') + '/>' +
        '<text class="kas-lbl" x="' + (i * w + w / 2).toFixed(1) + '" y="97" text-anchor="middle">' + this.BLN[+x[0].slice(5, 7) - 1] + '</text>'; }).join('');
    const info = r < 0 ? (sal > 0 ? this.baris('Kas cukup', '± ' + Math.floor(sal / -r) + ' bulan (bila arus bersih tetap ' + rp(Math.round(r)) + ' per bulan)') : this.baris('Kas', '<span class="down">sudah habis atau negatif</span>')) : '';
    return '<svg class="kas-grafik" viewBox="0 0 300 100" role="img" aria-label="Arus bersih per bulan, 6 bulan terakhir dan 3 bulan proyeksi"><line class="kas-zero" x1="0" y1="44" x2="300" y2="44"/>' + bar + '</svg><p class="note" style="margin:0 0 8px">Batang pudar = proyeksi.</p>' + info;
  },
  v_kas() {
    const r = this.rata3(), B = [-5, -4, -3, -2, -1, 0].map((n) => this.bulanKe(n));
    let sal = this.saldoSd(B[5]);
    const P = [1, 2, 3].map((n) => { sal += r; return [this.bulanKe(n), r, sal]; });
    const tr = (k, n, sd, pr) => '<tr' + (pr ? ' style="opacity:.7"' : '') + '><td>' + this.namaBln(k) + (pr ? ' *' : '') + '</td><td class="' + (n >= 0 ? 'up' : 'down') + '">' + rp(Math.round(n)) + '</td><td>' + rp(Math.round(sd)) + '</td></tr>';
    return '<section><h2>Saldo awal kas</h2><p class="note">Uang yang sudah ada sebelum transaksi pertama dicatat (modal awal usaha). Dihitung di saldo kas, tidak dihitung sebagai hasil atau untung.</p><div class="row" style="margin-top:8px"><span class="mu">Saldo awal</span><strong>' + rp(this.saldoAwal()) + '</strong></div><p class="note" style="margin-top:8px">Ketuk tombol + lalu pilih Atur saldo awal kas untuk mengubahnya.</p></section>' +
      '<section><h2>Arus kas</h2>' + this.grafikKas(B, P, r) + '<div class="gulir"><table class="lg-tab"><tr><th>Bulan</th><th>Bersih</th><th>Saldo</th></tr>' + B.map((k) => tr(k, this.net(k), this.saldoSd(k))).join('') + P.map((x) => tr(x[0], x[1], x[2], 1)).join('') +
      '</table></div><p class="note">* Proyeksi sederhana: rata-rata arus bersih 3 bulan terakhir yang ada transaksinya (' + rp(Math.round(r)) + ' per bulan), bukan jaminan.</p></section>';
  },
  v_aset() {
    const A = this.d().aset.filter((a) => !a.terhapus), inv = A.reduce((s, a) => s + a.hargaBeli, 0), r = this.rata3();
    if (!A.length) return '<section><p class="note">Belum ada aset. Ketuk tombol + untuk menambah aset (mesin, pompa, alat) agar penyusutan dan balik modal terhitung.</p></section>';
    return '<section><p class="note">Ketuk aset untuk melihat detail, mengubah, atau menghapus.</p>' + A.map((a) => { const b = this.mulai(a), nb = Math.round(a.hargaBeli - a.hargaBeli / a.umurBulan * b);
      return '<button type="button" class="ang-baris" data-rc="aset-detail" data-id="' + a.id + '" aria-label="Detail aset ' + esc(a.nama) + '"><div class="bar-top"><strong>' + esc(a.nama) + '</strong><span class="mu">' + rp(nb) + '</span></div>' +
        '<div class="bar-ang"><i style="width:' + Math.round(b / a.umurBulan * 100) + '%"></i></div><div class="note">Nilai buku · beli ' + rp(a.hargaBeli) + ' · ' + b + '/' + a.umurBulan + ' bln</div></button>'; }).join('') +
      '<div style="margin-top:14px">' + this.baris('Total investasi', rp(inv)) + this.baris('Balik modal (payback)', r > 0 ? '± ' + Math.ceil(inv / r) + ' bulan' : 'belum bisa dihitung (untung rata-rata belum positif)') + '</div></section>';
  },
  uf: 'semua',
  v_utang() {
    const U = this.d().utang.filter((u) => !u.terhapus);
    if (!U.length) return '<section><p class="note">Belum ada catatan. Ketuk tombol + untuk mencatat utang atau piutang. Yang berasal dari transaksi muncul otomatis di sini.</p></section>';
    const F = U.filter((u) => this.uf === 'semua' || u.jenis === this.uf), urut = (a, b) => String(a.jatuhTempo || '9').localeCompare(b.jatuhTempo || '9');
    const buka = F.filter((u) => !u.lunas).sort(urut), tutup = F.filter((u) => u.lunas).sort(urut);
    const baris = (u) => { const telat = !u.lunas && u.jatuhTempo && u.jatuhTempo < isoHari();
      return '<button type="button" class="ang-baris" style="opacity:' + (u.lunas ? '.55' : '1') + '" data-rc="utang-detail" data-id="' + u.id + '" aria-label="Detail ' + u.jenis + ' ' + esc(u.pihak) + '"><div class="bar-top"><strong>' + esc(u.pihak) + '</strong><span class="mu">' + u.jenis + (u.lunas ? ' · <span class="up">lunas</span>' : '') + '</span></div>' +
        '<div class="note">' + (u.lunas ? 'Jumlah ' + rp(u.jumlah) : 'Sisa ' + rp(Utang.sisa(u))) + (u.jatuhTempo ? ' · tempo ' + Setelan.tgl(u.jatuhTempo) : '') + (telat ? '<span class="lencana">Lewat tempo</span>' : '') + '</div></button>'; };
    const chips = '<div class="seg sm" style="justify-content:flex-start;margin:0 0 6px">' + [['semua', 'Semua'], ['utang', 'Utang'], ['piutang', 'Piutang']].map((x) => '<button type="button" class="btn' + (this.uf === x[0] ? ' on' : '') + '" data-rc="uf" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    return '<section>' + chips + '<p class="note">Ketuk catatan untuk melihat detail, membayar, mengubah, atau menghapus.</p>' + (buka.length ? buka.map(baris).join('') : '<p class="note">Tidak ada yang belum lunas.</p>') +
      (tutup.length ? '<details class="lg-detail"><summary>Sudah lunas (' + tutup.length + ')</summary>' + tutup.map(baris).join('') + '</details>' : '') + '</section>';
  },
  /* ---------- modal isian dari FAB (v0.1.055) ----------
     Semua isian Rencana keuangan (aset, utang/piutang, harga pasar, anggaran, saldo awal) dibuka dari tombol +, bukan di halaman. */
  dlg: null,
  lab(i, t, x) { return '<label for="' + i + '">' + t + '</label>' + x; },
  FORM: {
    aset: { jenis: 'Aset', judul: 'Tambah aset', simpan: 'Simpan aset', lagi: true, judulUbah: 'Ubah aset', fokus: 'rm_nama',
      isiEd(id, el) { const x = Rencana.d().aset.find((a) => a.id === id); if (!x) return; const s = (i, w) => { el.querySelector('#' + i).value = w; }; s('rm_nama', x.nama); s('rm_harga', fmtInput(x.hargaBeli)); s('rm_umur', x.umurBulan); s('rm_tgl', x.tanggalBeli); },
      isi() { return Rencana.lab('rm_nama', 'Nama', '<input id="rm_nama" maxlength="40" autocomplete="off" placeholder="mis. pompa air">') +
        Rencana.lab('rm_harga', 'Harga beli (Rp)', '<input id="rm_harga" data-rp inputmode="numeric" autocomplete="off" placeholder="0">') +
        Rencana.lab('rm_umur', 'Umur ekonomis (bulan)', '<input id="rm_umur" type="number" min="1" inputmode="numeric" placeholder="mis. 36">') +
        Rencana.lab('rm_tgl', 'Tanggal beli', '<input id="rm_tgl" type="date" value="' + isoHari() + '">'); },
      ok(v, id) {
        const h = angka(v('rm_harga')), u = angka(v('rm_umur')), n = v('rm_nama').trim();
        if (!n || !h || !u) return 'Isi nama, harga, dan umur (bulan).';
        const x0 = id && Rencana.d().aset.find((a) => a.id === id);
        if (x0) { Object.assign(x0, { nama: n, hargaBeli: h, umurBulan: u, tanggalBeli: v('rm_tgl') || x0.tanggalBeli, diubah: nowIso() }); return { toast: 'Aset diperbarui' }; }
        Rencana.d().aset.push({ id: uid('a'), nama: n, hargaBeli: h, umurBulan: u, tanggalBeli: v('rm_tgl') || isoHari(), dibuat: nowIso(), diubah: nowIso(), terhapus: false });
        return { toast: 'Aset ditambahkan' };
      } },
    utang: { jenis: 'Utang / piutang', judul: 'Catat utang atau piutang', simpan: 'Simpan', judulUbah: 'Ubah utang atau piutang', fokus: 'rm_pihak',
      isiEd(id, el) { const x = Rencana.d().utang.find((u) => u.id === id); if (!x || x.transaksiId) return; const s = (i, w) => { el.querySelector('#' + i).value = w; }; s('rm_jenis', x.jenis); s('rm_pihak', x.pihak); s('rm_jumlah', fmtInput(x.jumlah)); s('rm_tempo', x.jatuhTempo || ''); },
      isi() { return Rencana.lab('rm_jenis', 'Jenis', '<select id="rm_jenis"><option value="utang">Utang (saya berutang)</option><option value="piutang">Piutang (orang berutang ke saya)</option></select>') +
        Rencana.lab('rm_pihak', 'Nama pihak', '<input id="rm_pihak" maxlength="40" autocomplete="off" placeholder="mis. Toko tani">') +
        Rencana.lab('rm_jumlah', 'Jumlah (Rp)', '<input id="rm_jumlah" data-rp inputmode="numeric" autocomplete="off" placeholder="0">') +
        Rencana.lab('rm_tempo', 'Jatuh tempo (opsional)', '<input id="rm_tempo" type="date">'); },
      ok(v, id) {
        const j = angka(v('rm_jumlah')), n = v('rm_pihak').trim();
        if (!n || !j) return 'Isi nama pihak dan jumlah.';
        const x0 = id && Rencana.d().utang.find((u) => u.id === id && !u.transaksiId);
        if (x0) { Object.assign(x0, { jenis: v('rm_jenis') || x0.jenis, pihak: n, jumlah: j, jatuhTempo: v('rm_tempo') || '', diubah: nowIso() }); x0.lunas = false; return { toast: 'Catatan diperbarui' }; }
        Rencana.d().utang.push({ id: uid('u'), jenis: v('rm_jenis') || 'utang', pihak: n, jumlah: j, jatuhTempo: v('rm_tempo') || '', lunas: false, dibuat: nowIso(), diubah: nowIso(), terhapus: false });
        return { toast: 'Catatan tersimpan' };
      } },
    harga: { jenis: 'Harga pasar', judul: 'Catat harga pasar', simpan: 'Simpan harga', lagi: true, fokus: 'rm_harga',
      isi(arg) {
        const K = Siklus.koms(), k = K.find((x) => x.id === arg) || K.find((x) => x.id === Harga.pilih) || K[0];
        return Rencana.lab('rm_kom', 'Komoditas', '<select id="rm_kom">' + K.map((x) => '<option value="' + x.id + '" data-sat="' + esc(x.satuan) + '"' + (x.id === k.id ? ' selected' : '') + '>' + esc(x.nama) + '</option>').join('') + '</select>') +
          Rencana.lab('rm_tgl', 'Tanggal', '<input type="date" id="rm_tgl" max="' + isoHari() + '" value="' + isoHari() + '">') +
          '<label for="rm_harga">Harga per <span id="rm_sat">' + esc(k.satuan) + '</span> (Rp)</label><input id="rm_harga" data-rp inputmode="numeric" autocomplete="off" placeholder="0">' +
          Rencana.lab('rm_sumber', 'Sumber (opsional)', '<input id="rm_sumber" maxlength="40" placeholder="mis. Pasar Induk, pengepul">'); },
      ubah(e, el) { if (e.target.id === 'rm_kom') { const o = e.target.selectedOptions[0], t = el.querySelector('#rm_sat'); if (o && t) t.textContent = o.dataset.sat; } },
      ok(v) {
        const k = Siklus.kom(v('rm_kom')); if (!k) return 'Pilih komoditas.';
        const e = Harga.simpan(k, angka(v('rm_harga')), v('rm_tgl'), v('rm_sumber').trim()); if (e) return e;
        Harga.pilih = k.id; return { toast: 'Harga pasar tersimpan' };
      } },
    hargaDetail: { jenis: 'Harga pasar', judul: 'Detail harga', judulFn(id) { const x = Harga.cari(id); return x ? esc(x.k.nama) : 'Detail harga'; },
      isi(id) { const x = Harga.cari(id), u = Harga.ubah(x.k);
        return Rencana.baris('Harga', '<strong>' + rp(x.p.harga) + '/' + esc(x.k.satuan) + '</strong>') + Rencana.baris('Tanggal', Setelan.tgl(x.p.tanggal)) + Rencana.baris('Sumber', x.p.sumber ? esc(x.p.sumber) : '—') +
          (Harga.terakhir(x.k) && Harga.terakhir(x.k).id === x.p.id && u ? Rencana.baris('Dari catatan sebelumnya', u.pct === 0 ? 'tetap' : '<span class="' + (u.pct > 0 ? 'up' : 'down') + '">' + (u.pct > 0 ? '▲ ' : '▼ ') + Math.abs(u.pct) + '%</span>') : ''); },
      tombol() { return Rencana.bt('ubah', 'Ubah harga', 'gold') + Rencana.bt('hapus', 'Hapus harga', 'danger') + Rencana.bt('tutup', 'Tutup', ''); },
      aksi(a, id) { if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka('hargaUbah', id); } else if (a === 'hapus') Harga.hapus(id); } },
    hargaUbah: { jenis: 'Harga pasar', judul: 'Ubah harga pasar', judulUbah: 'Ubah harga pasar', simpan: 'Simpan perubahan', fokus: 'rm_harga',
      isi(id) { const x = Harga.cari(id);
        return '<p class="note">' + esc(x.k.nama) + ' · harga per ' + esc(x.k.satuan) + '</p>' + Rencana.lab('rm_tgl', 'Tanggal', '<input type="date" id="rm_tgl" max="' + isoHari() + '" value="' + x.p.tanggal + '">') +
          '<label for="rm_harga">Harga per ' + esc(x.k.satuan) + ' (Rp)</label><input id="rm_harga" data-rp inputmode="numeric" autocomplete="off" placeholder="0">' + Rencana.lab('rm_sumber', 'Sumber (opsional)', '<input id="rm_sumber" maxlength="40">'); },
      isiEd(id, el) { const x = Harga.cari(id); if (!x) return; el.querySelector('#rm_harga').value = fmtInput(x.p.harga); el.querySelector('#rm_sumber').value = x.p.sumber || ''; },
      ok(v, id) { const e = Harga.edit(id, angka(v('rm_harga')), v('rm_tgl'), v('rm_sumber').trim()); if (e) return e; const x = Harga.cari(id); if (x) Harga.pilih = x.k.id; return { toast: 'Harga pasar diperbarui' }; } },
    angDetail: { jenis: 'Anggaran', judul: 'Detail anggaran', judulFn(id) { const s = Siklus.cari(id); return s ? esc(Siklus.nama(s.id)) : 'Detail anggaran'; },
      isi(id) {
        const s = Siklus.cari(id), r = Siklus.ringkas(id).modal, ang = s.anggaran || 0, p = ang ? Math.round(r / ang * 100) : 0, k = Siklus.kom(s.komoditasId), tp = ang && k ? Siklus.templateUntuk(k.nama) : null;
        return (ang ? '<div class="bar-ang' + (p > 100 ? ' x' : p >= 90 ? ' w' : '') + '" role="img" aria-label="Terpakai ' + p + ' persen"><i style="width:' + Math.min(100, p) + '%"></i></div>' : '') +
          Rencana.baris('Anggaran', ang ? rp(ang) : 'belum diatur') + Rencana.baris('Realisasi modal', rp(r)) + (ang ? Rencana.baris('Terpakai', p + '%') + Rencana.baris(r > ang ? 'Melebihi' : 'Sisa', '<span class="' + (r > ang ? 'down' : 'up') + '">' + rp(Math.abs(ang - r)) + '</span>') : '') +
          (tp ? '<details class="lg-detail"><summary>Saran alokasi anggaran (' + tp.label + ')</summary>' + tp.komponen.map((c) => Rencana.baris(esc(c[0]) + ' · ' + c[1] + '%', rp(Math.round(ang * c[1] / 100)))).join('') + '<p class="note">Proporsi umum, perkiraan kasar. Sesuaikan dengan pengalaman dan harga setempat.</p></details>' : '');
      },
      tombol(id) { const s = Siklus.cari(id); return '<button type="button" class="btn gold" data-rm="ubah">' + (s && s.anggaran ? 'Ubah anggaran' : 'Atur anggaran') + '</button>' + (s && s.anggaran ? '<button type="button" class="btn danger" data-rm="hapus" style="width:100%;margin-bottom:10px">Hapus anggaran</button>' : '') + '<button type="button" class="btn" data-rm="tutup" style="width:100%">Tutup</button>'; },
      aksi(a, id) {
        const s = Siklus.cari(id); if (!s) return;
        if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka('anggaran', id); return; }
        if (a !== 'hapus') return;
        const lama = s.anggaran; s.anggaran = 0; s.diubah = nowIso(); Rencana.dlgTutup(true); App.simpan(); App.go('rencana', true);
        App.toast('Anggaran dihapus', { label: 'Urungkan', fn: () => { s.anggaran = lama; s.diubah = nowIso(); App.simpan(); App.go('rencana', true); } });
      } },
    asetDetail: { jenis: 'Aset', judul: 'Detail aset', judulFn(id) { const x = Rencana.cari('aset', id); return x ? esc(x.nama) : 'Detail aset'; },
      isi(id) {
        const a = Rencana.cari('aset', id), b = Rencana.mulai(a), sus = a.hargaBeli / a.umurBulan;
        return '<div class="bar-ang" role="img" aria-label="Umur terpakai ' + Math.round(b / a.umurBulan * 100) + ' persen"><i style="width:' + Math.round(b / a.umurBulan * 100) + '%"></i></div>' + Rencana.baris('Harga beli', rp(a.hargaBeli)) + Rencana.baris('Tanggal beli', Setelan.tgl(a.tanggalBeli)) +
          Rencana.baris('Umur ekonomis', a.umurBulan + ' bulan') + Rencana.baris('Penyusutan / bulan', rp(Math.round(sus))) + Rencana.baris('Nilai buku', rp(Math.round(a.hargaBeli - sus * b)) + ' (' + b + '/' + a.umurBulan + ' bln)');
      },
      tombol() { return Rencana.bt('ubah', 'Ubah aset', 'gold') + Rencana.bt('hapus', 'Hapus aset', 'danger') + Rencana.bt('tutup', 'Tutup', ''); },
      aksi(a, id) {
        if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka('aset', id); }
        else if (a === 'hapus') Rencana.hapusUndo('aset', id, 'Aset dihapus');
      } },
    utangDetail: { jenis: 'Utang / piutang', judul: 'Detail', judulFn(id) { const x = Rencana.cari('utang', id); return x ? esc(x.pihak) : 'Detail'; },
      isi(id) {
        const x = Rencana.cari('utang', id), tx = x.transaksiId && Rencana.d().transaksi.find((y) => y.id === x.transaksiId), byr = Utang.dibayar(x), sisa = Utang.sisa(x), pct = x.jumlah ? Math.min(100, Math.round(byr / x.jumlah * 100)) : 0;
        const telat = !x.lunas && x.jatuhTempo && x.jatuhTempo < isoHari();
        const riw = byr ? '<div class="byr" role="list" aria-label="Riwayat pembayaran">' + x.bayar.map((p) => '<div class="byr-baris" role="listitem"><span class="mu">' + Setelan.tgl(p.tanggal) + '</span><span>' + rp(p.jumlah) + '</span><button type="button" class="btn byr-x" data-rm="byrx" data-bid="' + p.id + '" aria-label="Hapus pembayaran ' + Setelan.tgl(p.tanggal) + ' ' + rp(p.jumlah) + '">Hapus</button></div>').join('') + '</div>' : '';
        return Rencana.baris('Jenis', x.jenis + (x.lunas ? ' · <span class="up">lunas</span>' : '')) + Rencana.baris('Jumlah', rp(x.jumlah)) + (tx ? Rencana.baris('Dari transaksi', esc(App.namaKat(tx.kategoriId)) + ' · ' + Setelan.tgl(tx.tanggal)) : '') +
          (x.transaksiId && byr ? '<div class="bar-ang" role="img" aria-label="Terbayar ' + pct + ' persen"><i style="width:' + pct + '%"></i></div>' + Rencana.baris('Sudah dibayar', rp(byr) + ' (' + pct + '%)') + (sisa > 0 ? Rencana.baris('Sisa', '<strong>' + rp(sisa) + '</strong>') : '') + riw : '') +
          Rencana.baris('Jatuh tempo', (x.jatuhTempo ? Setelan.tgl(x.jatuhTempo) : '—') + (telat ? ' <span class="down">(lewat)</span>' : ''));
      },
      tombol(id) {
        const x = Rencana.cari('utang', id), tx = x.transaksiId && Rencana.d().transaksi.find((y) => y.id === x.transaksiId), keluar = x.jenis === 'utang';
        return (x.transaksiId ? (tx && Utang.sisa(x) > 0 ? Rencana.bt('bayar', keluar ? 'Bayar' : 'Terima bayar', 'gold') : '') + (tx ? Rencana.bt('tx', 'Lihat transaksi', '') : '')
          : Rencana.bt('lunas', x.lunas ? 'Buka lagi' : 'Tandai lunas', 'gold') + Rencana.bt('ubah', 'Ubah', '') + Rencana.bt('hapus', 'Hapus', 'danger')) + Rencana.bt('tutup', 'Tutup', '');
      },
      aksi(a, id, b) {
        const x = Rencana.cari('utang', id); if (!x) return;
        if (a === 'bayar') { Rencana.dlgTutup(true); Utang.dlgBuka(x); }
        else if (a === 'tx') { Rencana.dlgTutup(true); App.ubahTx(x.transaksiId); }
        else if (a === 'ubah') { Rencana.dlgTutup(true); Rencana.dlgBuka('utang', id); }
        else if (a === 'hapus') Rencana.hapusUndo('utang', id, 'Catatan dihapus');
        else if (a === 'lunas') { x.lunas = !x.lunas; x.diubah = nowIso(); App.simpan(); Rencana.segarDlg('utangDetail', id); App.toast(x.lunas ? 'Ditandai lunas' : 'Dibuka lagi'); }
        else if (a === 'byrx') {
          const rec = Utang.hapusBayar(x, b.dataset.bid); if (!rec) return;
          App.simpan(); Rencana.segarDlg('utangDetail', id);
          App.toast('Pembayaran dihapus', { label: 'Urungkan', fn: () => { Utang.pulihBayar(x, rec); App.simpan(); Rencana.segarDlg('utangDetail', id); } });
        }
      } },
    anggaran: { jenis: 'Anggaran', judul: 'Atur anggaran modal', simpan: 'Simpan anggaran', fokus: 'rm_ang',
      isi(arg) {
        const L = Siklus.daftar(), s = L.find((x) => x.id === arg) || L[0];
        return Rencana.lab('rm_sik', 'Siklus', '<select id="rm_sik">' + L.map((x) => '<option value="' + x.id + '"' + (x.id === s.id ? ' selected' : '') + '>' + esc(Siklus.nama(x.id)) + '</option>').join('') + '</select>') +
          Rencana.lab('rm_ang', 'Anggaran modal (Rp)', '<input id="rm_ang" data-rp inputmode="numeric" autocomplete="off" placeholder="0" value="' + fmtInput(s.anggaran || 0) + '">') +
          '<p class="note">Kosongkan atau isi 0 untuk menghapus anggaran siklus ini.</p>'; },
      ubah(e, el) { if (e.target.id === 'rm_sik') { const s = Siklus.cari(e.target.value), i = el.querySelector('#rm_ang'); if (s && i) i.value = fmtInput(s.anggaran || 0); } },
      ok(v) {
        const s = Siklus.cari(v('rm_sik')); if (!s) return 'Pilih siklus.';
        s.anggaran = angka(v('rm_ang')); s.diubah = nowIso(); return { toast: 'Anggaran tersimpan' };
      } },
    awal: { jenis: 'Arus kas', judul: 'Atur saldo awal kas', simpan: 'Simpan saldo awal', fokus: 'rm_awal',
      isi() { return '<p class="note" style="margin-top:0">Uang yang sudah ada sebelum transaksi pertama dicatat (modal awal usaha). Dihitung di saldo kas, tidak dihitung sebagai hasil atau untung.</p>' +
        Rencana.lab('rm_awal', 'Saldo awal kas (Rp)', '<input id="rm_awal" data-rp inputmode="numeric" autocomplete="off" placeholder="0" value="' + fmtInput(Rencana.saldoAwal()) + '">'); },
      ok(v) { App.data.pengaturan.saldoAwal = angka(v('rm_awal')); delete App.data.pengaturan.saldoAwalContoh; return { toast: 'Saldo awal tersimpan' }; } }
  },
  cari(k, id) { return this.d()[k].find((x) => x.id === id && !x.terhapus) || null; },
  bt(m, t, cls) { return '<button type="button" class="btn ' + cls + '" data-rm="' + m + '" style="width:100%;margin:0 0 10px">' + t + '</button>'; },
  /* gambar ulang halaman; bila modal jenis j sedang terbuka, buka lagi agar isinya segar */
  segarDlg(j, id) { const buka = this.dlg && this.dlg.j === j; if (buka) this.dlgTutup(true); App.go('rencana', true); if (buka) this.dlgBuka(j, id); },
  hapusUndo(k, id, pesan) {
    const x = this.cari(k, id); if (!x || x.transaksiId) return;
    x.terhapus = true; x.diubah = nowIso(); this.dlgTutup(true); App.simpan(); App.go('rencana', true); Modal.pulihFokus();
    App.toast(pesan, { label: 'Urungkan', fn: () => { x.terhapus = false; x.diubah = nowIso(); App.simpan(); App.go('rencana', true); } });
  },
  /* true bila modal terbuka; false bila belum bisa (belum ada komoditas atau siklus) dan sudah diberi tahu lewat toast */
  dlgBuka(j, arg) {
    const f = this.FORM[j]; if (!f || this.dlg || Modal.m) return false;
    if (f.ada && !f.ada(arg)) return false;
    if (j === 'harga' && !Siklus.koms().length) { App.toast('Belum ada komoditas — tambahkan dulu di menu Unit'); return false; }
    if (j === 'angDetail' && !Siklus.cari(arg)) return false;
    if ((j === 'hargaDetail' || j === 'hargaUbah') && !Harga.cari(arg)) return false;
    if ((j === 'asetDetail' && !this.cari('aset', arg)) || (j === 'utangDetail' && !this.cari('utang', arg))) return false;
    if (j === 'anggaran' && !Siklus.daftar().length) { App.toast('Belum ada siklus — buat dulu di menu Siklus'); return false; }
    const ed = !!(arg && f.judulUbah), jd = f.judulFn ? f.judulFn(arg) : ed ? f.judulUbah : f.judul;
    this.dlg = { j: j, arg: arg };
    const el = Modal.buka({
      judulId: 'rmJudul', fokus: f.fokus, tutupLatar: !!f.tombol,
      html: '<div class="dm-kepala"><div><div class="dm-jenis">' + f.jenis + '</div><h2 class="dm-judul" id="rmJudul">' + jd + '</h2></div>' +
        '<button type="button" class="dm-x" data-rm="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="dm-isi">' + f.isi(arg) + '</div>' +
        '<div class="dm-aksi">' + (f.tombol ? f.tombol(arg) : '<button type="button" class="btn gold" data-rm="simpan">' + (ed ? 'Simpan perubahan' : f.simpan) + '</button>' +
          (f.lagi && !ed ? '<button type="button" class="btn" data-rm="lagi" style="width:100%;margin-bottom:10px">Simpan &amp; tambah lagi</button>' : '') + '<button type="button" class="btn" data-rm="tutup" style="width:100%">Batal</button>') + '</div>',
      antes: (el) => { if (ed && f.isiEd) f.isiEd(arg, el); },
      klik: (e) => { const x = e.target.closest('[data-rm]'); if (!x) return; const m = x.dataset.rm; if (m === 'tutup') Modal.tutup(); else if (m === 'simpan') this.dlgSimpan(); else if (m === 'lagi') this.dlgSimpan(true); else if (f.aksi) f.aksi(m, arg, x); },
      ubah: (e) => { if (f.ubah) f.ubah(e, Modal.m.el); },
      simpan: f.tombol ? null : () => this.dlgSimpan(),
      onTutup: () => { this.dlg = null; }
    });
    if (!el) { this.dlg = null; return false; }
    return true;
  },
  dlgTutup(tanpaFokus) { Modal.tutup(tanpaFokus); },
  dlgSimpan(lagi) {
    if (!this.dlg) return;
    const v = (i) => (document.getElementById(i) || {}).value || '', f = this.FORM[this.dlg.j], r = f.ok(v, this.dlg.arg);
    if (typeof r === 'string') { Modal.galat(r); return; }
    const j = this.dlg.j, arg = j === 'harga' ? Harga.pilih : this.dlg.arg;
    Modal.tutup(true); App.simpan(); App.go(f.tab || 'rencana', true);
    if (lagi) this.dlgBuka(j, arg); else Modal.pulihFokus();
    App.toast(r.toast);
  },
  klik(e) {
    const s = e.target.closest('[data-rcs]'); if (s) { this.sub = s.dataset.rcs; App.go('rencana', true); return true; }
    const b = e.target.closest('[data-rc]'); if (!b) return false;
    const a = b.dataset.rc, id = b.dataset.id, v = (i) => (document.getElementById(i) || {}).value || '';
    const det = { 'ang-detail': 'angDetail', 'aset-detail': 'asetDetail', 'utang-detail': 'utangDetail', 'harga-detail': 'hargaDetail' };
    if (det[a]) { this.dlgBuka(det[a], id); return true; }
    if (a === 'uf') { this.uf = b.dataset.v; App.go('rencana', true); return true; }
    if (a === 'kl-unit' || a === 'kl-isi') return Kelayakan.aksi(a, b);
    return false;
  },
  ubah(e) {
    const hk = e.target.closest && e.target.closest('[data-hk]'); if (hk) { Harga.pilih = hk.value; App.go('rencana', true); return; }
  }
};
document.addEventListener('change', (e) => Rencana.ubah(e));
