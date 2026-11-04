/* Tani Keuangan — PWA: pendaftaran service worker dan tombol pasang (v0.1.019) */
var Pwa = (function () {
  var h = { segar: function () {} }, tawaran = null;
  var layak = /^https?:$/.test(location.protocol);
  var mandiri = function () { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; };

  if (layak && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); tawaran = e; h.segar(); });
  window.addEventListener('appinstalled', function () { tawaran = null; h.segar(); });

  function html() {
    var isi, aksi = '';
    if (mandiri()) isi = 'Sudah berjalan sebagai aplikasi.';
    else if (tawaran) { isi = 'Pasang agar terbuka dari layar utama tanpa bilah alamat.'; aksi = '<button type="button" class="btn" data-pwa="pasang">Pasang</button>'; }
    else if (!layak) isi = 'Hanya tersedia bila aplikasi dibuka dari alamat http/https (hosting). Dari berkas lokal atau pengelola berkas, fitur ini tidak aktif.';
    else isi = 'Bila tombol pasang tidak muncul, pakai menu browser: Tambahkan ke layar utama.';
    return '<div class="settings-row"><div class="settings-desc"><strong>Pasang di layar utama</strong><span>' + isi + '</span></div>' + aksi + '</div>';
  }
  function init(hooks) {
    Object.assign(h, hooks || {});
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-pwa="pasang"]') && tawaran) { var t = tawaran; tawaran = null; t.prompt(); h.segar(); }
    });
  }
  return { init: init, html: html };
})();
