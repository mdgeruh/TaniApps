/* Tani Keuangan — panduan cepat 4 layar, tampil otomatis saat pertama dibuka (v0.1.034) */
var Panduan = (function () {
  var KUNCI = 'tani.panduan', i = 0, el = null;
  var IK = {
    tunas: '<path d="M12 21v-8M12 13c0-4 3-7 8-7 0 5-3 7-8 7zM12 15c0-3-2-5-6-5 0 4 2 5 6 5z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    grafik: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    aman: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'
  };
  function layar() {
    var contoh = typeof Contoh !== 'undefined' && Contoh.ada();
    return [
      { ik: 'tunas', j: 'Selamat datang di Tani Keuangan', t: ['Catat modal dan hasil kebun, kolam, atau kandang Anda, lalu lihat untung atau ruginya per siklus.',
        contoh ? 'Data contoh sudah terisi agar Anda bisa langsung mencoba. Hapus kapan saja lewat Setelan.' : 'Semua data tersimpan di perangkat ini.'] },
      { ik: 'plus', j: 'Catat dengan tombol +', t: ['Ketuk tombol + untuk mencatat modal (pengeluaran) atau hasil (pemasukan). Pilih siklusnya agar biaya dan hasil terhitung per siklus.',
        'Di daftar Transaksi, geser baris ke kiri untuk menghapus; ada tombol Urungkan bila salah.'] },
      { ik: 'grafik', j: 'Siklus dan Laporan', t: ['Siklus adalah satu putaran tanam atau produksi. Catat panennya agar harga pokok per satuan terhitung.',
        'Menu Laporan menampilkan untung, R/C, titik impas, dan harga jual minimum, plus simulasi bila harga berubah.'] },
      { ik: 'aman', j: 'Data aman dan bisa dibawa', t: ['Cadangan otomatis tersimpan di browser ini. Ekspor berkas dan sinkron cloud (opsional) ada di Setelan.',
        'Tema, efek kaca, dan ukuran tampilan juga diatur di Setelan. Panduan ini bisa dibuka lagi dari Setelan, bagian Tentang.'] }
    ];
  }
  function gambar() {
    var L = layar(), s = L[i], akhir = i === L.length - 1;
    var titik = L.map(function (_, n) { return '<span class="pd-t' + (n === i ? ' on' : '') + '"></span>'; }).join('');
    var kiri = (i > 0 ? '<button type="button" class="btn" data-pd="mundur">Kembali</button>' : '') +
      (!akhir ? '<button type="button" class="btn" data-pd="lewati">Lewati</button>' : '');
    el.firstChild.innerHTML =
      '<div class="pd-ik"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IK[s.ik] + '</svg></div>' +
      '<div class="pd-no">Langkah ' + (i + 1) + ' dari ' + L.length + '</div>' +
      '<h2 class="pd-judul" id="pdJudul">' + s.j + '</h2>' +
      s.t.map(function (p) { return '<p class="pd-isi">' + p + '</p>'; }).join('') +
      '<div class="pd-titik" aria-hidden="true">' + titik + '</div>' +
      '<div class="pd-aksi"><div class="pd-kiri">' + kiri + '</div><button type="button" class="btn gold pd-maju" data-pd="' + (akhir ? 'selesai' : 'maju') + '">' + (akhir ? 'Mulai' : 'Lanjut') + '</button></div>';
    var p = el.querySelector('.pd-maju'); if (p) p.focus();
  }
  function buka() { // memakai mesin Modal (v0.1.076): Back, Esc, fokus, dan kunci gulir sama dengan modal lain
    if (el || Modal.m) return;
    i = 0;
    el = Modal.buka({ judulId: 'pdJudul', kartu: 'pd-kartu', tutupLatar: false, html: '', onTutup: function () { el = null; Penyimpanan.set(KUNCI, '1'); } });
    if (el) gambar();
  }
  function tutup() { Modal.tutup(); }
  function otomatis() { if (Penyimpanan.get(KUNCI) === null) setTimeout(buka, 500); }
  function html() {
    return '<div class="settings-row"><div class="settings-desc"><strong>Panduan cepat</strong><span>Pengenalan singkat 4 layar: mencatat, siklus, laporan, dan cadangan.</span></div>' +
      '<button type="button" class="btn" data-pd="buka">Tampilkan</button></div>';
  }
  function init() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pd]'); if (!b) return;
      var a = b.dataset.pd;
      if (a === 'buka') buka();
      else if (a === 'maju') { i = Math.min(i + 1, layar().length - 1); gambar(); }
      else if (a === 'mundur') { i = Math.max(i - 1, 0); gambar(); }
      else tutup();
    });
  }
  return { init: init, otomatis: otomatis, buka: buka, html: html };
})();
