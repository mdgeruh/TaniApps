/* Buku Kebun — Laporan perjalanan siklus (Fase 6E Tahap 6, v0.1.103, docs/JURNAL.md bagian 7)
   Dokumen cetak polos satu siklus: ringkasan uang, tahap, catatan, kejadian, ukuran, panen, foto kecil (opsional).
   Dibuat dari detail siklus; memakai #cetak-lap seperti laporan lain (Analisa.cetakPasang melewatinya selama aktif). */
const Perjalanan = {
  aktif: false, urls: [], _cf: null,

  fotoJumlah(s) { return Jurnal.of(s.id).reduce((a, j) => a + (j.foto || []).length, 0); },
  /* tombol di bagian Ringkasan detail siklus */
  tombol(s) {
    const n = this.fotoJumlah(s) && typeof Foto !== 'undefined' && Foto.ada();
    return '<div class="seg no-print" style="margin-top:10px"><button type="button" class="btn" data-do="perjalanan-cetak" aria-label="Cetak laporan perjalanan siklus atau simpan PDF">Cetak perjalanan</button>' +
      (n ? '<button type="button" class="btn" data-do="perjalanan-cetak" data-foto="1" aria-label="Cetak laporan perjalanan siklus dengan foto">Dengan foto</button>' : '') + '</div>';
  },

  hari(s, tgl) { const h = Jurnal.hariKe(s, tgl); return h >= 1 ? h : '—'; },
  tab(kepala, baris, kls) {
    return '<table class="ct-tab' + (kls ? ' ' + kls : '') + '"><thead><tr>' + kepala.map((k) => '<th' + (k[1] ? ' class="n"' : '') + '>' + k[0] + '</th>').join('') + '</tr></thead><tbody>' + baris.join('') + '</tbody></table>';
  },
  bag(judul, isi) { return isi ? '<div class="ct-bag"><h2>' + judul + '</h2>' + isi + '</div>' : ''; },
  teks(j) { return esc(Jurnal.judul(j)) + (j.isi && j.judul ? '<br>' + esc(j.isi).replace(/\n/g, '<br>') : j.isi && !j.judul && String(j.isi).split('\n').length > 1 ? '<br>' + esc(String(j.isi).split('\n').slice(1).join('\n')).replace(/\n/g, '<br>') : ''); },
  foto(j, dgn) { return dgn && (j.foto || []).length ? '<div class="ct-foto">' + j.foto.map((id) => '<img alt="" data-foto="' + id + '">').join('') + '</div>' : ''; },

  /* isi dokumen; dgn = sertakan foto kecil */
  dok(s, dgn) {
    const k = Siklus.kom(s.komoditasId) || {}, sat = k.satuan || '', r = Siklus.ringkas(s.id), J = Jurnal.of(s.id).slice().reverse(), u = r.hasil - r.modal;
    const kv = (a, b) => '<tr><th>' + a + '</th><td class="n">' + b + '</td></tr>';
    const hari = Siklus.hari(s);
    /* uang */
    const kat = {}; r.tx.filter((t) => t.jenis === 'keluar').forEach((t) => { const n = App.namaKat(t.kategoriId); kat[n] = (kat[n] || 0) + t.jumlah; });
    const katBaris = Object.keys(kat).sort((a, b) => kat[b] - kat[a]).map((n) => '<tr><td>' + esc(n) + '</td><td class="n">' + rp(kat[n]) + '</td><td class="n">' + (r.modal ? Math.round(kat[n] / r.modal * 100) + '%' : '') + '</td></tr>');
    const uang = '<table class="ct-tab ct-kv">' + kv(u < 0 ? 'Rugi' : 'Untung', '<b>' + rp(u) + '</b>') + kv('Modal', rp(r.modal)) + kv('Hasil', rp(r.hasil)) + kv('R/C ratio', r.modal ? fmtRC(r.hasil / r.modal) : '—') +
      kv('Panen bersih', fmtN(r.bersih) + ' ' + esc(sat)) + (r.bersih > 0 && r.modal ? kv('Modal per ' + esc(sat), rp(Math.round(r.modal / r.bersih))) : '') + '</table>' +
      (katBaris.length ? '<h2 style="margin-top:9pt">Modal per kategori</h2>' + this.tab([['Kategori'], ['Jumlah', 1], ['Bagian', 1]], katBaris) : '');
    /* tahap */
    const T = J.filter((j) => j.jenis === 'tahap'), akhir = s.selesai || isoHari();
    const tahap = T.length ? this.tab([['Tahap'], ['Tanggal'], ['Hari ke', 1], ['Lama (hari)', 1]], T.map((j, i) => {
      const nx = T[i + 1], lama = Jurnal.hariKe(s, nx ? nx.tanggal : akhir) - Jurnal.hariKe(s, j.tanggal);
      return '<tr><td>' + esc(Tahap.nama(j)) + (j.isi ? '<br><span class="ct-cat">' + esc(j.isi) + '</span>' : '') + '</td><td>' + Setelan.tgl(j.tanggal) + '</td><td class="n">' + this.hari(s, j.tanggal) + '</td><td class="n">' + Math.max(0, lama) + (nx || s.status === 'selesai' ? '' : '*') + '</td></tr>' + (this.foto(j, dgn) ? '<tr><td colspan="4">' + this.foto(j, dgn) + '</td></tr>' : '');
    })) + (s.status === 'selesai' ? '' : '<p class="ct-cat">* tahap masih berjalan sampai ' + Setelan.tgl(akhir) + '</p>') : '';
    /* catatan, evaluasi */
    const C = J.filter((j) => j.jenis === 'catatan' && !j.evaluasi), ev = J.find((j) => j.evaluasi);
    const baris = (j, extra) => '<tr><td>' + Setelan.tgl(j.tanggal) + '</td><td class="n">' + this.hari(s, j.tanggal) + '</td><td>' + this.teks(j) + this.foto(j, dgn) + (extra || '') + '</td></tr>';
    const catatan = C.length ? this.tab([['Tanggal'], ['Hari', 1], ['Catatan']], C.map((j) => baris(j))) : '';
    const evaluasi = ev ? '<p style="margin:0 0 3pt;font-size:8.5pt;color:#333">' + Setelan.tgl(ev.tanggal) + ' · hari ' + this.hari(s, ev.tanggal) + '</p><div style="white-space:pre-wrap;overflow-wrap:anywhere">' + esc(ev.isi || '') + '</div>' + this.foto(ev, dgn) : '';
    /* kejadian */
    const K = J.filter((j) => j.jenis === 'kejadian');
    const kejadian = K.length ? this.tab([['Tanggal'], ['Hari', 1], ['Jenis'], ['Keterangan']], K.map((j) => '<tr><td>' + Setelan.tgl(j.tanggal) + '</td><td class="n">' + this.hari(s, j.tanggal) + '</td><td>' + esc(Kejadian.rincian(j)) + '</td><td>' + this.teks(j) + this.foto(j, dgn) + '</td></tr>')) : '';
    /* ukuran: per nama, dari awal ke akhir */
    const Uk = J.filter((j) => j.jenis === 'ukuran' && j.ukuran);
    const per = {}; Uk.forEach((j) => { (per[j.ukuran.nama] = per[j.ukuran.nama] || []).push(j); });
    const ukuran = Object.keys(per).length ? this.tab([['Ukuran'], ['Pengukuran', 1], ['Pertama'], ['Terakhir'], ['Perubahan', 1]], Object.keys(per).map((n) => {
      const L = per[n], a = L[0], b = L[L.length - 1], sa = a.ukuran.satuan ? ' ' + esc(a.ukuran.satuan) : '', d = b.ukuran.nilai - a.ukuran.nilai;
      return '<tr><td>' + esc(n) + '</td><td class="n">' + L.length + '</td><td>' + Kejadian.fmt(a.ukuran.nilai) + sa + '<br><span class="ct-cat">hari ' + this.hari(s, a.tanggal) + '</span></td><td>' + Kejadian.fmt(b.ukuran.nilai) + sa + '<br><span class="ct-cat">hari ' + this.hari(s, b.tanggal) + '</span></td><td class="n">' + (L.length > 1 ? (d > 0 ? '+' : d < 0 ? '−' : '') + Kejadian.fmt(Math.abs(d)) + sa : '—') + '</td></tr>';
    })) : '';
    /* panen */
    const P = Siklus.panenOf(s.id).slice().reverse();
    const panen = P.length ? this.tab([['Tanggal'], ['Hari', 1], ['Kotor', 1], ['Susut', 1], ['Bersih', 1], ['Harga/' + esc(sat), 1], ['Pembeli']], P.map((p) =>
      '<tr><td>' + Setelan.tgl(p.tanggal) + '</td><td class="n">' + this.hari(s, p.tanggal) + '</td><td class="n">' + fmtN(p.kuantitasKotor) + '</td><td class="n">' + fmtN(p.susut) + '</td><td class="n">' + fmtN(p.kuantitasKotor - p.susut) + '</td><td class="n">' + (p.hargaPerSatuan ? rp(p.hargaPerSatuan) : '—') + '</td><td>' + esc(p.pembeli || '') + '</td></tr>')) : '';
    /* kegiatan */
    const G = J.filter((j) => j.jenis === 'kegiatan');
    const keg = G.length ? '<p class="ct-cat" style="font-size:9pt">' + G.length + ' kali: ' + G.map((j) => esc(Jurnal.judul(j)) + ' (' + Setelan.tgl(j.tanggal) + ')').join('; ') + '</p>' : '';
    const kop = '<div class="ct-kop"><h1>Laporan Perjalanan Siklus</h1><p class="ct-sub">' + esc(Siklus.nama(s.id)) + '</p><table class="ct-meta"><tr><th>Status</th><td>' + (s.status === 'berjalan' ? 'Berjalan, hari ke-' + hari : 'Selesai, ' + hari + ' hari') + '</td><th>Dicetak</th><td>' + Setelan.tgl(isoHari()) + '</td></tr>' +
      '<tr><th>Mulai</th><td>' + Setelan.tgl(s.mulai) + (s.status === 'selesai' && s.selesai ? ' – ' + Setelan.tgl(s.selesai) : '') + '</td><th>Aplikasi</th><td>Buku Kebun v' + VERSI + '</td></tr></table></div>';
    return kop + this.bag('Ringkasan uang', uang) + this.bag('Tahap pertumbuhan', tahap) + this.bag('Catatan', catatan) + this.bag('Kejadian', kejadian) + this.bag('Ukuran', ukuran) + this.bag('Panen', panen) + this.bag('Kegiatan dikerjakan', keg) +
      this.bag('Evaluasi', evaluasi) + (s.catatan ? this.bag('Catatan siklus', '<div style="white-space:pre-wrap">' + esc(s.catatan) + '</div>') : '');
  },

  /* muat foto jadi gambar sementara, lalu cetak setelah semua gambar siap */
  async cetak(dgn) {
    const s = Siklus.cari(Siklus.sid); if (!s) return;
    this.lepas();
    const d = document.createElement('div'); d.id = 'cetak-lap'; d.className = 'ct-semua'; d.innerHTML = this.dok(s, dgn);
    document.body.appendChild(d); document.documentElement.classList.add('cetak-lap'); this.aktif = true;
    const L = [...d.querySelectorAll('img[data-foto]')];
    await Promise.all(L.map((im) => Nota.ambil(im.dataset.foto).then((r) => new Promise((ok) => {
      if (!r) { im.remove(); return ok(); }
      const u = URL.createObjectURL(r.blob); this.urls.push(u); im.onload = im.onerror = () => ok(); im.src = u;
    })).catch(() => im.remove())));
    window.print();
  },
  lepas() {
    this.urls.forEach((u) => URL.revokeObjectURL(u)); this.urls = []; this.aktif = false;
    const d = document.getElementById('cetak-lap'); if (d) d.remove(); document.documentElement.classList.remove('cetak-lap');
  },
  aksi(a, el) {
    if (a !== 'perjalanan-cetak') return false;
    const lb = el.textContent;
    if (Samar.aktif() && !this._cf) { // Tersembunyi: kertas memuat angka lengkap, minta ketukan kedua
      el.textContent = 'Ketuk lagi'; App.toast('Angka akan tercetak lengkap — ketuk sekali lagi');
      this._cf = setTimeout(() => { this._cf = null; if (el.isConnected) el.textContent = lb; }, 4000); return true;
    }
    clearTimeout(this._cf); this._cf = null;
    this.cetak(!!el.dataset.foto); return true;
  }
};
