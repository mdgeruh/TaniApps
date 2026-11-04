/* Tani Keuangan — cadangan otomatis di browser (v0.1.019) */
var Cadangan = (function () {
  var KUNCI = 'tani.cadangan', MAKS = 7, JEDA = 5 * 60 * 1000;
  var h = { ambil: function () { return {}; }, pulih: function () {}, segar: function () {} };
  var yakin = null, tunda = null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hariIni() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function baca() { try { var a = JSON.parse(Penyimpanan.get(KUNCI) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function tulis(a) {
    while (a.length) {
      try { Penyimpanan.set(KUNCI, JSON.stringify(a)); return true; } catch (e) { a.pop(); }
    }
    try { Penyimpanan.del(KUNCI); } catch (e) {}
    return false;
  }
  function aktif(l) { return (l || []).filter(function (x) { return !x.terhapus; }).length; }
  function hitung(d) { return { tx: aktif(d.transaksi), sik: aktif(d.siklus) }; }
  function milik(l) { return (l || []).filter(function (x) { return !x.terhapus && !x.contoh; }).length; }
  function kosong(d) {
    return !milik(d.transaksi) && !milik(d.siklus) && !milik(d.unit) && !milik(d.aset) && !milik(d.utang) && !milik(d.komoditas);
  }

  function catat(label, paksa) {
    var d = h.ambil();
    if (!d || kosong(d)) return false;
    var a = baca(), now = Date.now(), t0 = a[0];
    if (!paksa && t0 && t0.label === 'Otomatis' && t0.hari === hariIni()) {
      if (now - t0.ms < JEDA) {
        if (!tunda) tunda = setTimeout(function () { tunda = null; catat('Otomatis'); }, JEDA - (now - t0.ms) + 500);
        return false;
      }
      a.shift();
    }
    a.unshift({ ms: now, hari: hariIni(), label: label || 'Otomatis', data: JSON.parse(JSON.stringify(d)) });
    a = a.slice(0, MAKS);
    return tulis(a);
  }

  function waktu(c) {
    var d = new Date(c.ms);
    return Setelan.tgl(c.hari) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function html() {
    var a = baca();
    var daftar = a.length ? a.map(function (c, i) {
      var k = hitung(c.data || {});
      return '<div class="settings-row"><div class="settings-desc"><strong>' + c.label + '</strong><span>' + waktu(c) + ' · ' + k.tx + ' transaksi, ' + k.sik + ' siklus</span></div>' +
        '<button type="button" class="btn" data-cad="pulih" data-i="' + i + '">Pulihkan</button></div>';
    }).join('') : '<div class="note">Belum ada cadangan. Salinan pertama dibuat otomatis setelah ada data.</div>';
    return '<div class="sec-head"><h2>Cadangan otomatis</h2><div class="note">Maksimal ' + MAKS + ' salinan di browser ini: satu per hari, ditambah salinan sebelum impor, hapus, atau pemulihan. Ikut hilang bila data browser dibersihkan, jadi tetap ekspor berkala.</div></div>' +
      daftar +
      '<div class="seg sm" style="margin-top:8px"><button type="button" class="btn" data-cad="sekarang">Cadangkan sekarang</button>' +
      (a.length ? '<button type="button" class="btn danger" data-cad="hapus">Hapus semua cadangan</button>' : '') + '</div>';
  }

  function konfirmasi(tombol, kunci, teks, jalan) {
    if (yakin && yakin.kunci === kunci) { clearTimeout(yakin.t); yakin = null; jalan(); return; }
    if (yakin) { clearTimeout(yakin.t); yakin = null; }
    var asal = tombol.textContent;
    tombol.textContent = teks;
    yakin = { kunci: kunci, t: setTimeout(function () { yakin = null; tombol.textContent = asal; }, 4000) };
  }
  function klik(e) {
    var b = e.target.closest('[data-cad]');
    if (!b) return;
    var x = b.dataset.cad;
    if (x === 'sekarang') { catat('Manual', true); h.segar(); }
    else if (x === 'hapus') konfirmasi(b, 'hapus', 'Ketuk lagi untuk menghapus', function () { Penyimpanan.del(KUNCI); h.segar(); });
    else if (x === 'pulih') {
      var i = +b.dataset.i;
      konfirmasi(b, 'pulih' + i, 'Ketuk lagi untuk memulihkan', function () {
        var c = baca()[i];
        if (!c || !c.data) return;
        var salin = JSON.parse(JSON.stringify(c.data));
        catat('Sebelum pemulihan', true);
        h.pulih(salin);
      });
    }
  }
  function init(hooks) {
    Object.assign(h, hooks || {});
    document.addEventListener('click', klik);
    catat('Otomatis');
  }
  return { init: init, html: html, catat: catat, otomatis: function () { return catat('Otomatis'); } };
})();
