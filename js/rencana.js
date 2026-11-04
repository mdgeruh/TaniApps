/* Tani Keuangan — Fase 5: anggaran, arus kas, aset, utang/piutang (v0.1.015) */
const Rencana = {
  sub: 'anggaran',
  SUB: [['anggaran', 'Anggaran'], ['kas', 'Arus kas'], ['aset', 'Aset'], ['utang', 'Utang/piutang']],
  d() { return App.data; },
  bulanKe(n) { const x = new Date(); x.setDate(1); x.setMonth(x.getMonth() + n); return isoHari(x).slice(0, 7); },
  net(k) { const tx = App.aktif().filter((t) => t.tanggal.slice(0, 7) === k); return App.jumlah(tx, 'masuk') - App.jumlah(tx, 'keluar'); },
  saldoAwal() { return Number(App.data.pengaturan.saldoAwal) || 0; },
  BLN: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
  namaBln(k) { return this.BLN[+k.slice(5, 7) - 1] + ' ' + k.slice(0, 4); },
  saldoSd(k) { return this.saldoAwal() + App.aktif().filter((t) => t.tanggal.slice(0, 7) <= k).reduce((a, t) => a + (t.jenis === 'masuk' ? t.jumlah : -t.jumlah), 0); },
  rata3() { const a = [-3, -2, -1].map((n) => this.bulanKe(n)).filter((k) => App.aktif().some((t) => t.tanggal.slice(0, 7) === k)); return a.length ? a.reduce((s, k) => s + this.net(k), 0) / a.length : 0; },
  mulai(a) { const [y, m] = a.tanggalBeli.split('-').map(Number), n = new Date(); return Math.max(0, Math.min(a.umurBulan, (n.getFullYear() - y) * 12 + n.getMonth() + 1 - m)); },
  baris(a, b) { return '<div class="row"><span class="mu">' + a + '</span><span>' + b + '</span></div>'; },
  v() {
    const chips = '<div class="seg sm" style="justify-content:flex-start;margin:6px 0">' + this.SUB.map((x) => '<button type="button" class="btn' + (this.sub === x[0] ? ' on' : '') + '" data-rcs="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    return '<section>' + chips + '</section>' + this['v_' + this.sub]() +
      '<button class="btn" data-go="lainnya" style="width:100%;margin-top:12px">Kembali</button>';
  },
  v_anggaran() {
    const L = Siklus.daftar();
    if (!L.length) return '<section><p class="note">Belum ada siklus. Buat siklus dulu di tab Siklus.</p></section>';
    return '<section><p class="note">Isi anggaran modal per siklus (Rp). Realisasi diambil dari transaksi Modal siklus itu.</p>' + L.map((s) => {
      const r = Siklus.ringkas(s.id).modal, ang = s.anggaran || 0, p = ang ? Math.round(r / ang * 100) : 0;
      return '<div style="margin-top:14px"><div class="bar-top"><strong>' + esc(Siklus.nama(s.id)) + '</strong><span class="mu">' + (ang ? p + '%' : 'tanpa anggaran') + '</span></div>' +
        '<input class="settings-input" style="width:100%;text-align:left;margin:6px 0" inputmode="numeric" data-rp data-ang="' + s.id + '" placeholder="Anggaran modal (Rp)" aria-label="Anggaran modal ' + esc(Siklus.nama(s.id)) + '" value="' + fmtInput(ang) + '">' +
        '<div class="bar"><i style="width:' + Math.min(100, p) + '%' + (p > 100 ? ';background:var(--loss)' : '') + '"></i></div>' +
        this.baris('Realisasi / anggaran', rp(r) + ' / ' + rp(ang)) + (ang ? this.baris(r > ang ? 'Melebihi' : 'Sisa', '<span class="' + (r > ang ? 'down' : 'up') + '">' + rp(Math.abs(ang - r)) + '</span>') : '') + (() => { const k = Siklus.kom(s.komoditasId), t = ang && k ? Siklus.templateUntuk(k.nama) : null; return t ? '<details class="lg-detail"><summary>Saran alokasi anggaran (' + t.label + ')</summary>' + t.komponen.map((c) => this.baris(esc(c[0]) + ' · ' + c[1] + '%', rp(Math.round(ang * c[1] / 100)))).join('') + '<p class="note">Proporsi umum, perkiraan kasar. Sesuaikan dengan pengalaman dan harga setempat.</p></details>' : ''; })() + '</div>';
    }).join('') + '</section>';
  },
  v_kas() {
    const r = this.rata3(), B = [-5, -4, -3, -2, -1, 0].map((n) => this.bulanKe(n));
    let sal = this.saldoSd(B[5]);
    const P = [1, 2, 3].map((n) => { sal += r; return [this.bulanKe(n), r, sal]; });
    const tr = (k, n, sd, pr) => '<tr' + (pr ? ' style="opacity:.7"' : '') + '><td>' + this.namaBln(k) + (pr ? ' *' : '') + '</td><td class="' + (n >= 0 ? 'up' : 'down') + '">' + rp(Math.round(n)) + '</td><td>' + rp(Math.round(sd)) + '</td></tr>';
    return '<section><h2>Saldo awal kas</h2><p class="note">Uang yang sudah ada sebelum transaksi pertama dicatat (modal awal usaha). Dihitung di saldo kas, tidak dihitung sebagai hasil atau untung.</p><input class="settings-input" style="width:100%;text-align:left;margin-top:8px" inputmode="numeric" data-rp data-awal="1" placeholder="0" aria-label="Saldo awal kas (Rp)" value="' + fmtInput(this.saldoAwal()) + '"></section>' +
      '<section><h2>Arus kas</h2><div class="gulir"><table class="lg-tab"><tr><th>Bulan</th><th>Bersih</th><th>Saldo</th></tr>' + B.map((k) => tr(k, this.net(k), this.saldoSd(k))).join('') + P.map((x) => tr(x[0], x[1], x[2], 1)).join('') +
      '</table></div><p class="note">* Proyeksi sederhana: rata-rata arus bersih 3 bulan terakhir yang ada transaksinya (' + rp(Math.round(r)) + ' per bulan), bukan jaminan.</p></section>';
  },
  v_aset() {
    const A = this.d().aset.filter((a) => !a.terhapus), inv = A.reduce((s, a) => s + a.hargaBeli, 0), r = this.rata3();
    const form = '<section><h2>Tambah aset</h2><input id="as_nama" class="settings-input" style="width:100%;text-align:left" placeholder="Nama (mis. pompa air)">' +
      '<input id="as_harga" data-rp class="settings-input" style="width:100%;text-align:left;margin-top:8px" inputmode="numeric" placeholder="Harga beli (Rp)">' +
      '<input id="as_umur" type="number" class="settings-input" style="width:100%;text-align:left;margin-top:8px" inputmode="numeric" placeholder="Umur ekonomis (bulan)">' +
      '<input id="as_tgl" type="date" class="settings-input" style="width:100%;text-align:left;margin-top:8px" value="' + isoHari() + '">' +
      '<button class="btn" data-rc="aset-simpan" style="width:100%;margin-top:10px">Simpan aset</button><div class="note" id="rcMsg" role="status"></div></section>';
    const daftar = A.length ? '<section><h2>Daftar aset</h2>' + A.map((a) => { const b = this.mulai(a), sus = a.hargaBeli / a.umurBulan;
      return '<div style="margin-top:12px"><strong>' + esc(a.nama) + '</strong>' + this.baris('Harga beli', rp(a.hargaBeli)) + this.baris('Penyusutan / bulan', rp(Math.round(sus))) +
        this.baris('Nilai buku', rp(Math.round(a.hargaBeli - sus * b)) + ' (' + b + '/' + a.umurBulan + ' bln)') + '<button class="btn danger" data-rc="aset-hapus" data-id="' + a.id + '" style="margin-top:6px">Hapus</button></div>'; }).join('') +
      '<div style="margin-top:14px">' + this.baris('Total investasi', rp(inv)) + this.baris('Balik modal (payback)', r > 0 ? '± ' + Math.ceil(inv / r) + ' bulan' : 'belum bisa dihitung (untung rata-rata belum positif)') + '</div></section>' : '';
    return form + daftar;
  },
  v_utang() {
    const U = this.d().utang.filter((u) => !u.terhapus), tot = (j) => U.filter((u) => u.jenis === j && !u.lunas).reduce((s, u) => s + u.jumlah, 0);
    const form = '<section><h2>Catat utang / piutang</h2><select id="ut_jenis" class="settings-input" style="width:100%;text-align:left"><option value="utang">Utang (saya berutang)</option><option value="piutang">Piutang (orang berutang ke saya)</option></select>' +
      '<input id="ut_pihak" class="settings-input" style="width:100%;text-align:left;margin-top:8px" placeholder="Nama pihak">' +
      '<input id="ut_jumlah" data-rp class="settings-input" style="width:100%;text-align:left;margin-top:8px" inputmode="numeric" placeholder="Jumlah (Rp)">' +
      '<input id="ut_tempo" type="date" class="settings-input" style="width:100%;text-align:left;margin-top:8px">' +
      '<button class="btn" data-rc="utang-simpan" style="width:100%;margin-top:10px">Simpan</button><div class="note" id="rcMsg" role="status"></div></section>';
    const L = U.length ? '<section><h2>Daftar</h2>' + this.baris('Total utang belum lunas', '<strong class="down">' + rp(tot('utang')) + '</strong>') + this.baris('Total piutang belum lunas', '<strong class="up">' + rp(tot('piutang')) + '</strong>') +
      U.sort((a, b) => (a.lunas - b.lunas) || String(a.jatuhTempo || '9').localeCompare(b.jatuhTempo || '9')).map((u) => {
        const telat = !u.lunas && u.jatuhTempo && u.jatuhTempo < isoHari();
        return '<div style="margin-top:12px;opacity:' + (u.lunas ? '.55' : '1') + '"><strong>' + esc(u.pihak) + '</strong> · ' + u.jenis + this.baris('Jumlah', rp(u.jumlah)) +
          this.baris('Jatuh tempo', (u.jatuhTempo ? Setelan.tgl(u.jatuhTempo) : '—') + (telat ? ' <span class="down">(lewat)</span>' : '')) +
          '<div class="seg" style="margin-top:6px"><button class="btn" data-rc="utang-lunas" data-id="' + u.id + '">' + (u.lunas ? 'Buka lagi' : 'Tandai lunas') + '</button><button class="btn danger" data-rc="utang-hapus" data-id="' + u.id + '">Hapus</button></div></div>'; }).join('') + '</section>' : '';
    return form + L;
  },
  pesan(t) { const m = document.getElementById('rcMsg'); if (m) m.textContent = t; },
  klik(e) {
    const s = e.target.closest('[data-rcs]'); if (s) { this.sub = s.dataset.rcs; App.go('rencana', true); return true; }
    const b = e.target.closest('[data-rc]'); if (!b) return false;
    const a = b.dataset.rc, id = b.dataset.id, v = (i) => (document.getElementById(i) || {}).value || '';
    const sel = (arr) => arr.find((x) => x.id === id);
    if (a === 'aset-simpan') {
      const h = angka(v('as_harga')), u = angka(v('as_umur')), n = v('as_nama').trim();
      if (!n || !h || !u) { this.pesan('Isi nama, harga, dan umur (bulan).'); return true; }
      this.d().aset.push({ id: uid('a'), nama: n, hargaBeli: h, umurBulan: u, tanggalBeli: v('as_tgl') || isoHari(), dibuat: nowIso(), diubah: nowIso(), terhapus: false });
    } else if (a === 'aset-hapus') { const x = sel(this.d().aset); if (x) x.terhapus = true; }
    else if (a === 'utang-simpan') {
      const j = angka(v('ut_jumlah')), n = v('ut_pihak').trim();
      if (!n || !j) { this.pesan('Isi nama pihak dan jumlah.'); return true; }
      this.d().utang.push({ id: uid('u'), jenis: v('ut_jenis') || 'utang', pihak: n, jumlah: j, jatuhTempo: v('ut_tempo') || '', lunas: false, dibuat: nowIso(), diubah: nowIso(), terhapus: false });
    } else if (a === 'utang-lunas') { const x = sel(this.d().utang); if (x) x.lunas = !x.lunas; }
    else if (a === 'utang-hapus') { const x = sel(this.d().utang); if (x) x.terhapus = true; }
    else return false;
    App.simpan(); App.go('rencana', true); return true;
  },
  ubah(e) {
    const aw = e.target.closest && e.target.closest('[data-awal]');
    if (aw) { App.data.pengaturan.saldoAwal = angka(aw.value); delete App.data.pengaturan.saldoAwalContoh; App.simpan(); App.go('rencana', true); return; }
    const i = e.target.closest && e.target.closest('[data-ang]'); if (!i) return;
    const s = Siklus.cari(i.dataset.ang); if (!s) return;
    s.anggaran = angka(i.value); s.diubah = nowIso(); App.simpan(); App.go('rencana', true);
  }
};
document.addEventListener('change', (e) => Rencana.ubah(e));
