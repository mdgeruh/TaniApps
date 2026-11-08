/* Buku Kebun — penyimpanan aman: localStorage; bila diblokir (mis. dibuka lewat content://), pakai memori + window.name */
var Penyimpanan = (function () {
  var ls = null, mem = {}, PREFIX = 'TKDATA:';
  try { ls = window.localStorage; ls.setItem('__tk', '1'); ls.removeItem('__tk'); } catch (e) { ls = null; }
  if (!ls) {
    try { var w = JSON.parse((window.name || '').indexOf(PREFIX) === 0 ? window.name.slice(PREFIX.length) : '{}'); if (w && typeof w === 'object') mem = w; } catch (e) {}
  }
  function tulis() { try { window.name = PREFIX + JSON.stringify(mem); } catch (e) {} }
  return {
    terbatas: !ls,
    get: function (k) { if (ls) return ls.getItem(k); return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
    set: function (k, v) { if (ls) { ls.setItem(k, v); } else { mem[k] = String(v); tulis(); } },
    del: function (k) { if (ls) { ls.removeItem(k); } else { delete mem[k]; tulis(); } }
  };
})();

/* Buku Kebun — status buka/tutup bagian yang bisa dilipat (v0.1.024) */
var Lipat = { s: {}, buka: function (k, d) { return k in Lipat.s ? Lipat.s[k] : d; } };
document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.dataset && d.dataset.lipat) Lipat.s[d.dataset.lipat] = d.open; }, true);

/* Buku Kebun — halaman setelan (dipakai aplikasi dan pratinjau) */
var Setelan = (function () {
  var KUNCI = 'tani.setelan';
  var BAWAAN = { mode: 'light', skema: 'hijau', ukuran: 100, kaca: false, tanggal: 'dmy', sembunyi: false, margin: 30, ingatJurnal: 0 };
  var s = Object.assign({}, BAWAAN);
  var h = { versi: '', ambil: function () { return {}; }, pasang: function () {}, hapus: function () {}, ubah: function () {} };
  var konfirmasi = null, konfirmasi2 = null;

  function muat() {
    var o = {};
    try { o = JSON.parse(Penyimpanan.get(KUNCI) || '{}') || {}; } catch (e) {}
    s = Object.assign({}, BAWAAN, o);
  }
  function simpan() { try { Penyimpanan.set(KUNCI, JSON.stringify(s)); } catch (e) {} }
  function efektif() {
    if (s.mode === 'auto') return (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    return s.mode;
  }
  function terapkan() {
    var el = document.documentElement, t = efektif();
    el.dataset.theme = t;
    el.dataset.scheme = s.skema;
    if (s.kaca) el.dataset.glass = '1'; else el.removeAttribute('data-glass');
    el.style.setProperty('--zoom', s.ukuran / 100);
    var b = document.getElementById('theme');
    if (b) b.textContent = t === 'light' ? '☀' : '☾';
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', getComputedStyle(el).getPropertyValue('--ink').trim());
  }
  function ubah(k, v) { s[k] = v; simpan(); terapkan(); h.ubah(k); }
  function tgl(iso) {
    if (!iso) return '';
    return s.tanggal === 'iso' ? iso : iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4);
  }
  function seg(k, opts) {
    return '<div class="seg sm" role="group">' + opts.map(function (o) {
      return '<button type="button" class="btn' + (String(s[k]) === String(o[0]) ? ' on' : '') + '" data-set="' + k + '" data-val="' + o[0] + '">' + (o[2] || '') + o[1] + '</button>';
    }).join('') + '</div>';
  }
  /* saklar nyala/mati (v0.1.109): untuk pilihan hidup-mati; pilihan di antara beberapa opsi tetap memakai seg() */
  function saklar(k, label, aktif, teks, lebar) {
    return '<div class="sw-wrap"><span class="sw-t"' + (lebar ? ' style="min-width:' + lebar + 'px"' : '') + '>' + (aktif ? teks[1] : teks[0]) + '</span><button type="button" class="sw" role="switch" aria-checked="' + (aktif ? 'true' : 'false') + '" aria-label="' + label + '" data-saklar="' + k + '"><span class="sw-kenop"></span></button></div>';
  }
  function row(a, b, c) {
    return '<div class="settings-row"><div class="settings-desc"><strong>' + a + '</strong><span>' + b + '</span></div>' + c + '</div>';
  }
  function head(t, n) { return '<div class="sec-head"><h2>' + t + '</h2><div class="note">' + n + '</div></div>'; }
  function render() {
    var tampil = head('Tampilan', 'Mode, skema warna, dan ukuran. Tersimpan di browser ini, tidak ikut ekspor data.') +
      row('Mode', 'Otomatis mengikuti pengaturan perangkat.', seg('mode', [['light', 'Terang'], ['dark', 'Gelap'], ['auto', 'Otomatis']])) +
      row('Skema warna', 'Hijau Padi adalah palet bawaan Buku Kebun; Emas Klasik sama dengan Jurnal Trading.',
        seg('skema', [['hijau', 'Hijau Padi', '<i class="dot" style="background:#81AE64"></i>'], ['emas', 'Emas Klasik', '<i class="dot" style="background:#C9A24B"></i>']])) +
      row('Efek kaca', 'Liquid Glass bergaya iOS: kartu, kontrol kapsul, dan navigasi bawah melayang dari kaca bening di atas latar bentuk geometri. Bisa dipakai dengan skema dan mode apa saja; otomatis padat bila browser tidak mendukung blur atau perangkat memilih Kurangi Transparansi.', saklar('kaca', 'Efek kaca', !!s.kaca, ['Mati', 'Nyala'])) +
      row('Ukuran tampilan', 'Perkecil atau perbesar seluruh aplikasi.', seg('ukuran', [[90, '90%'], [100, '100%'], [110, '110%'], [120, '120%']])) +
      row('Kembali ke bawaan', 'Terang, Hijau Padi, tanpa efek kaca, 100%, format tanggal dan target margin bawaan.', '<button type="button" class="btn" data-act="reset">Atur ulang</button>');
    var pref = head('Preferensi', 'Berlaku di seluruh aplikasi.') +
      row('Format tanggal', 'Tabel transaksi dan daftar siklus.', seg('tanggal', [['dmy', '03/11/2026'], ['iso', '2026-11-03']])) +
      row('Angka untung saat dibuka', 'Nyalakan agar semua nominal rupiah di aplikasi disamarkan. Tombol mata menampilkannya sementara; saat mencetak, angka tetap tampil.', saklar('sembunyi', 'Sembunyikan angka untung saat dibuka', !!s.sembunyi, ['Tampil', 'Tersembunyi'], 80)) +
      row('Target margin', 'Dipakai menghitung harga jual minimum per siklus (1 sampai 90 persen).', '<input type="number" id="margin" class="settings-input" min="1" max="90" step="1" inputmode="numeric" value="' + s.margin + '" aria-label="Target margin persen">') +
      row('Ingatkan catatan jurnal', 'Beranda mengingatkan bila siklus berjalan belum dicatat selama sekian hari. Hanya tampil saat aplikasi dibuka; bawaan mati.', seg('ingatJurnal', [[0, 'Mati'], [3, '3 hari'], [7, '7 hari'], [14, '14 hari']]));
    var data = head('Data', 'Cadangan dan pemulihan. Data tersimpan di browser ini.') +
      '<div class="settings-row"><div class="settings-desc"><strong>Ekspor dan impor</strong><span>Ekspor mengisi kotak di bawah dengan JSON. Untuk impor, tempel JSON ke kotak atau pilih berkas; pratinjau tampil dulu sebelum data diganti.</span></div>' +
      '<div class="seg sm"><button type="button" class="btn" data-act="ekspor">Ekspor</button><button type="button" class="btn" data-act="impor">Impor</button><button type="button" class="btn" data-act="berkas">Pilih berkas</button></div></div>' +
      '<input type="file" id="fileImp" accept=".json,application/json" hidden>' +
      '<textarea id="dataBox" class="settings-text" rows="5" aria-label="Data JSON" placeholder="Hasil ekspor muncul di sini"></textarea>' +
      '<div class="note" id="dataMsg" role="status" aria-live="polite" style="margin-top:8px"></div>' +
      row('Data contoh', 'Isi data tiruan (±7 bulan: tiga unit, empat komoditas, enam siklus) untuk mencoba aplikasi. Bisa dihapus tanpa mengganggu catatan Anda.', '<button type="button" class="btn" data-do="' + (typeof Contoh !== 'undefined' && Contoh.ada() ? 'hapus-contoh' : 'contoh') + '">' + (typeof Contoh !== 'undefined' && Contoh.ada() ? 'Hapus data contoh' : 'Isi data contoh') + '</button>') +
      (typeof Nota !== 'undefined' && Nota.tersedia() ? row('Foto nota dan jurnal', 'Foto bukti transaksi dan foto catatan jurnal hanya disimpan di browser ini; tidak ikut ekspor data, cadangan otomatis, maupun sinkron cloud, jadi cadangkan sendiri ke ZIP. Foto yang tidak lagi dipakai dibersihkan otomatis setelah 30 hari. <span id="notaInfo"></span>', '<div class="seg sm" style="flex-wrap:wrap"><button type="button" class="btn" data-act="foto-zip">Cadangkan foto (ZIP)</button><button type="button" class="btn" data-act="foto-pulih">Pulihkan dari ZIP</button><button type="button" class="btn danger" data-act="nota-hapus">Hapus semua foto</button></div>') +
        (navigator.storage && navigator.storage.persist ? row('Penyimpanan tetap', 'Minta browser agar tidak membuang foto saat ruang penyimpanan menipis. Browser menentukan sendiri apakah permintaan dikabulkan.', '<button type="button" class="btn" data-act="foto-tetap">Minta penyimpanan tetap</button>') : '') : '') +
      row('Hapus semua data', 'Menghapus transaksi dan siklus di browser ini. Salinan cadangan otomatis dan data cloud tidak ikut terhapus. Bila sinkron cloud aktif, data akan kembali dari cloud: hapus juga data cloud di bagian Sinkron cloud.', '<button type="button" class="btn danger" data-act="hapus">Hapus semua data</button>');
    var tentang = head('Tentang', '') +
      row('Versi', 'Buku Kebun, manajemen pertanian.', '<strong>v' + h.versi + '</strong>') +
      (typeof Panduan !== 'undefined' ? Panduan.html() : '') +
      (typeof Pwa !== 'undefined' ? Pwa.html() : '');
    var cad = typeof Cadangan !== 'undefined' ? '<section>' + Cadangan.html() + '</section>' : '';
    var sink = typeof Sinkron !== 'undefined' ? '<section>' + Sinkron.html() + '</section>' : '';
    function lipat(k, s, def) {
      var m = s.match(/^<section>([\s\S]*?)<div class="sec-head"><h2>([\s\S]*?)<\/h2>(<div class="note"[^>]*>[\s\S]*?<\/div>)<\/div>([\s\S]*)<\/section>$/);
      if (!m) return s;
      return '<section><details class="lipat" data-lipat="st-' + k + '"' + (Lipat.buka('st-' + k, def) ? ' open' : '') + '><summary><h2>' + m[2] + '</h2></summary>' + m[3].replace('class="note"', 'class="note lipat-n"') + m[1] + m[4] + '</details></section>';
    }
    return lipat('tampil', '<section>' + tampil + '</section>', true) + lipat('pref', '<section>' + pref + '</section>', true) + lipat('data', '<section>' + data + '</section>', false) +
      (cad ? lipat('cad', cad, false) : '') + (sink ? lipat('sink', sink, false) : '') + lipat('tentang', '<section>' + tentang + '</section>', false);
  }
  function pesan(t) { var e = document.getElementById('dataMsg'); if (e) e.textContent = t; }
  function ekspor() {
    var j = JSON.stringify(h.ambil(), null, 2), box = document.getElementById('dataBox');
    if (box) box.value = j;
    try {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([j], { type: 'application/json' }));
      a.download = 'buku-kebun-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) {}
    pesan('Data ditampilkan di kotak. Jika unduhan tidak mulai, salin teksnya.');
  }
  function impor(info) { var box = document.getElementById('dataBox'); Impor.json(box ? box.value : '', info, pesan); } // pratinjau dulu, baru impor (js/impor.js)
  function bind(root) {
    root.addEventListener('click', function (e) {
      var w = e.target.closest('[data-saklar]');
      if (w) { var kw = w.dataset.saklar; ubah(kw, !s[kw]); var nw = document.querySelector('[data-saklar="' + kw + '"]'); if (nw) nw.focus(); return; } /* fokus tetap di saklar setelah halaman digambar ulang */
      var b = e.target.closest('[data-set]');
      if (b) {
        var k = b.dataset.set, v = b.dataset.val;
        if (v === 'true') v = true; else if (v === 'false') v = false; else if (k === 'ukuran') v = +v;
        ubah(k, v); return;
      }
      var a = e.target.closest('[data-act]');
      if (!a) return;
      var x = a.dataset.act;
      if (x === 'reset') { s = Object.assign({}, BAWAAN); simpan(); terapkan(); h.ubah('reset'); }
      else if (x === 'ekspor') ekspor();
      else if (x === 'impor') impor();
      else if (x === 'berkas') document.getElementById('fileImp').click();
      else if (x === 'foto-zip') CadFoto.aksiEkspor();
      else if (x === 'foto-pulih') CadFoto.pilih();
      else if (x === 'foto-tetap') { Foto.minta().then(function (t) { App.toast(t); Foto.isiInfo(); }); }
      else if (x === 'nota-hapus') {
        if (konfirmasi2) { clearTimeout(konfirmasi2); konfirmasi2 = null; Nota.kosongkan().then(function () { pesan('Semua foto nota dan jurnal dihapus.'); Nota.isiInfo(); a.textContent = 'Hapus semua foto'; }).catch(function () { pesan('Foto tidak bisa dihapus.'); }); }
        else {
          a.textContent = 'Ketuk lagi untuk menghapus';
          konfirmasi2 = setTimeout(function () { konfirmasi2 = null; a.textContent = 'Hapus semua foto'; }, 4000);
        }
      }
      else if (x === 'hapus') {
        if (konfirmasi) { clearTimeout(konfirmasi); konfirmasi = null; h.hapus(); pesan('Semua data dihapus.'); }
        else {
          a.textContent = 'Ketuk lagi untuk menghapus';
          konfirmasi = setTimeout(function () { konfirmasi = null; a.textContent = 'Hapus semua data'; }, 4000);
        }
      }
    });
    root.addEventListener('change', function (e) {
      if (e.target.id === 'margin') {
        var n = Math.round(+e.target.value);
        ubah('margin', n >= 1 && n <= 90 ? n : s.margin);
      } else if (e.target.id === 'fileImp' && e.target.files[0]) {
        var f = e.target.files[0], r = new FileReader();
        if (f.size > Impor.MAKSJSON) { pesan('Berkas terlalu besar (maksimal 20 MB).'); App.toast('Berkas terlalu besar (maks. 20 MB)'); e.target.value = ''; return; }
        r.onload = function () { document.getElementById('dataBox').value = r.result; impor({ nama: f.name, ukuran: f.size }); };
        r.onerror = function () { App.toast('Berkas tidak bisa dibaca'); };
        r.readAsText(f); e.target.value = '';
      }
    });
  }
  function init(hooks) {
    Object.assign(h, hooks || {});
    muat(); terapkan();
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var f = function () { if (s.mode === 'auto') { terapkan(); h.ubah('mode'); } };
      if (mq.addEventListener) mq.addEventListener('change', f);
    }
  }
  return { init: init, render: render, bind: bind, ubah: ubah, tgl: tgl, get: function (k) { return s[k]; }, efektif: efektif };
})();
