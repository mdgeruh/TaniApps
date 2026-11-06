/* Tani Keuangan — sinkron cloud Supabase, opsional (v0.1.023) */
var Sinkron = (function () {
  var KUNCI = 'tani.sinkron', TABEL = 'tani_data', JEDA = 20000, WAKTU = 15000;
  var KOLEKSI = ['unit', 'komoditas', 'siklus', 'transaksi', 'panen', 'aset', 'utang', 'kategori', 'jurnal'];
  var h = { ambil: function () { return {}; }, terapkan: function () {}, segar: function () {} };
  var c = { url: '', key: '', sesi: null, auto: true, terakhir: 0 };
  var f = { email: '', pw: '' };
  var sibuk = false, tunda = null, yakin = null, status = '', galat = false;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]; }); }
  function muat() {
    try { var o = JSON.parse(Penyimpanan.get(KUNCI) || '{}') || {}; c = Object.assign(c, o); } catch (e) {}
    f.email = (c.sesi && c.sesi.email) || f.email;
  }
  function simpanC() { try { Penyimpanan.set(KUNCI, JSON.stringify(c)); } catch (e) {} }
  function rapi(u) {
    var m = String(u || '').trim().match(/^(https?:\/\/[^\/\s?#]+)/i);
    if (!m) return '';
    var o = m[1].replace(/\/+$/, '');
    if (/^https:\/\//i.test(o) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o)) return o;
    return '';
  }
  function lencana() {
    var e = document.getElementById('skDot'); if (!e) return;
    if (!c.sesi) { e.textContent = ''; return; }
    var d = new Date(c.terakhir);
    e.textContent = ' · ☁ ' + (sibuk ? 'menyinkronkan…' : galat ? 'gagal sinkron' : c.terakhir ? 'tersinkron ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : 'belum sinkron');
  }
  function kabar(t) { status = t || ''; var e = document.getElementById('skMsg'); if (e) e.textContent = status; lencana(); }

  /* ---------- jaringan ---------- */
  function req(metode, jalur, badan, tambahan) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var t = ctl ? setTimeout(function () { ctl.abort(); }, WAKTU) : null;
    var hd = Object.assign({ apikey: c.key, 'Content-Type': 'application/json', Authorization: 'Bearer ' + ((c.sesi && c.sesi.at) || c.key) }, tambahan || {});
    return fetch(c.url + jalur, { method: metode, headers: hd, body: badan ? JSON.stringify(badan) : undefined, signal: ctl ? ctl.signal : undefined }).then(function (r) {
      clearTimeout(t);
      return r.text().then(function (tx) {
        var j = null; try { j = tx ? JSON.parse(tx) : null; } catch (e) {}
        if (!r.ok) {
          var er = new Error((j && (j.msg || j.error_description || j.message || j.error)) || ('Galat ' + r.status));
          er.status = r.status; throw er;
        }
        return j;
      });
    }, function (err) {
      clearTimeout(t);
      var er = new Error(err && err.name === 'AbortError' ? 'Waktu habis. Periksa koneksi internet.' : 'Tidak bisa terhubung. Periksa internet dan alamat proyek.');
      er.status = 0; throw er;
    });
  }
  function jadiSesi(j) {
    return {
      at: j.access_token, rt: j.refresh_token,
      exp: j.expires_at ? j.expires_at * 1000 : Date.now() + (j.expires_in || 3600) * 1000,
      uid: (j.user && j.user.id) || (c.sesi && c.sesi.uid),
      email: (j.user && j.user.email) || (c.sesi && c.sesi.email) || f.email
    };
  }
  function masuk(daftar) {
    ambilIsian();
    c.url = rapi(c.url);
    if (!c.url) return Promise.reject(new Error('Alamat proyek tidak valid. Contoh: https://abcd1234.supabase.co'));
    if (!c.key || !f.email || !f.pw) return Promise.reject(new Error('Isi kunci anon, email, dan kata sandi.'));
    if (daftar && f.pw.length < 6) return Promise.reject(new Error('Kata sandi minimal 6 karakter.'));
    return req('POST', daftar ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password', { email: f.email, password: f.pw }).then(function (j) {
      f.pw = '';
      if (j && j.access_token) { c.sesi = jadiSesi(j); simpanC(); return 'ok'; }
      simpanC(); return 'konfirmasi';
    });
  }
  function token() {
    var s = c.sesi;
    if (!s) return Promise.reject(new Error('Belum masuk.'));
    if (s.exp - Date.now() > 60000) return Promise.resolve();
    return req('POST', '/auth/v1/token?grant_type=refresh_token', { refresh_token: s.rt }).then(function (j) {
      c.sesi = jadiSesi(j); simpanC();
    }, function (e) {
      if (e.status === 400 || e.status === 401 || e.status === 403) { c.sesi = null; simpanC(); e.message = 'Sesi berakhir, masuk lagi.'; }
      throw e;
    });
  }
  function tarik() {
    return req('GET', '/rest/v1/' + TABEL + '?select=data,updated_at&user_id=eq.' + encodeURIComponent(c.sesi.uid)).then(function (a) { return a && a.length ? a[0] : null; });
  }
  function dorong(d) {
    return req('POST', '/rest/v1/' + TABEL + '?on_conflict=user_id', { user_id: c.sesi.uid, data: d, updated_at: new Date().toISOString() }, { Prefer: 'resolution=merge-duplicates,return=minimal' });
  }
  function hapusCloud() {
    return req('DELETE', '/rest/v1/' + TABEL + '?user_id=eq.' + encodeURIComponent(c.sesi.uid), null, { Prefer: 'return=minimal' });
  }

  /* ---------- data ---------- */
  function stempel(x) { return x.diubah || x.dibuat || ''; }
  function tanpaContoh(d) {
    var o = JSON.parse(JSON.stringify(d)), cs = {};
    (o.siklus || []).forEach(function (x) { if (x.contoh) cs[x.id] = 1; });
    KOLEKSI.forEach(function (k) { if (o[k]) o[k] = o[k].filter(function (x) { return !x.contoh; }); });
    (o.transaksi || []).forEach(function (t) { if (t.siklusId && cs[t.siklusId]) t.siklusId = null; });
    return o;
  }
  function adaIsi(d) { return KOLEKSI.some(function (k) { return (d[k] || []).some(function (x) { return !x.contoh; }); }); }
  /* Gabung per entri (id): yang `diubah`-nya lebih baru menang; hapus bersifat lunak (terhapus:true) sehingga ikut tersebar. */
  function gabung(l, j) {
    var o = Object.assign({}, j, l), n = { dariJauh: 0, dariLokal: 0 };
    o.pengaturan = Object.assign({}, j.pengaturan || {}, l.pengaturan || {});
    KOLEKSI.forEach(function (k) {
      var peta = {}, urut = [], punyaL = {};
      (j[k] || []).forEach(function (x) { peta[x.id] = x; urut.push(x.id); });
      (l[k] || []).forEach(function (x) {
        punyaL[x.id] = 1;
        var y = peta[x.id];
        if (!y) { peta[x.id] = x; urut.push(x.id); if (!x.contoh) n.dariLokal++; }
        else if (stempel(x) > stempel(y)) { peta[x.id] = x; n.dariLokal++; }
        else if (stempel(x) < stempel(y)) n.dariJauh++;
      });
      (j[k] || []).forEach(function (y) { if (!punyaL[y.id]) n.dariJauh++; });
      o[k] = urut.map(function (id) { return peta[id]; });
    });
    return { data: o, n: n };
  }

  /* ---------- sinkron ---------- */
  function selesai(pesan) { c.terakhir = Date.now(); galat = false; simpanC(); return pesan; }
  function jalan(mode, senyap) {
    if (sibuk) return Promise.resolve('');
    if (!c.sesi) return Promise.reject(new Error('Belum masuk.'));
    sibuk = true; kabar('Menyinkronkan…');
    var lokal = h.ambil(), hasil;
    hasil = token().then(function () {
      if (mode === 'timpa') {
        return dorong(tanpaContoh(lokal)).then(function () { return selesai('Cloud sudah diganti dengan data di perangkat ini.'); });
      }
      return tarik().then(function (r) {
        var jauh = r && r.data;
        if (mode === 'ambil') {
          if (!jauh) throw new Error('Belum ada data di cloud.');
          Cadangan.catat('Sebelum sinkron', true);
          h.terapkan(jauh, true);
          return selesai('Data di perangkat ini diganti dengan data cloud.');
        }
        var adaJauh = !!jauh && KOLEKSI.some(function (k) { return (jauh[k] || []).length; });
        if (!adaJauh) {
          if (!adaIsi(lokal)) return selesai('Belum ada data untuk dikirim.');
          return dorong(tanpaContoh(lokal)).then(function () { return selesai('Data dikirim ke cloud.'); });
        }
        var bersihL = adaIsi(lokal) ? lokal : tanpaContoh(lokal);
        var g = gabung(bersihL, jauh);
        if (g.n.dariJauh > 0 || bersihL !== lokal) {
          Cadangan.catat('Sebelum sinkron', true);
          h.terapkan(g.data, !senyap);
        }
        var teks = g.n.dariJauh + ' diterima, ' + g.n.dariLokal + ' dikirim.';
        if (g.n.dariLokal > 0) return dorong(tanpaContoh(g.data)).then(function () { return selesai(teks); });
        return selesai(g.n.dariJauh ? teks : 'Sudah sama dengan cloud.');
      });
    });
    return hasil.then(function (p) { sibuk = false; kabar(p); if (!senyap) h.segar(); kabar(p); return p; },
      function (e) { sibuk = false; galat = true; kabar(e.message); if (!senyap || !c.sesi) h.segar(); kabar(e.message); throw e; });
  }
  function tandai() {
    if (!c.sesi || !c.auto) return;
    clearTimeout(tunda);
    tunda = setTimeout(function () { jalan('gabung', true).catch(function () {}); }, JEDA);
  }

  /* ---------- tampilan ---------- */
  function waktu() {
    if (!c.terakhir) return 'belum pernah';
    var d = new Date(c.terakhir);
    return Setelan.tgl(d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function isian(id, label, tipe, nilai, ket) {
    return '<label class="sk-f"><span>' + label + '</span><input id="' + id + '" type="' + tipe + '" value="' + esc(nilai) + '" autocomplete="off" autocapitalize="off" spellcheck="false"' + (ket ? ' placeholder="' + esc(ket) + '"' : '') + '></label>';
  }
  function html() {
    var kepala = '<div class="sec-head"><h2>Sinkron cloud (opsional)</h2><div class="note">Cadangan dan sinkron antar perangkat lewat proyek Supabase milik Anda sendiri. Tanpa ini, aplikasi tetap berjalan penuh secara lokal. Panduan: docs/SINKRON.md.</div></div>';
    var isi;
    if (c.sesi) {
      isi = '<div class="settings-row"><div class="settings-desc"><strong>' + esc(c.sesi.email || 'Akun cloud') + '</strong><span>Terakhir sinkron: ' + waktu() + '</span></div>' +
        '<button type="button" class="btn" data-sk="gabung">Sinkronkan sekarang</button></div>' +
        '<div class="settings-row"><div class="settings-desc"><strong>Sinkron otomatis</strong><span>Menggabungkan perubahan beberapa detik setelah Anda mencatat, saat aplikasi dibuka, dan saat internet kembali.</span></div>' +
        '<div class="seg sm"><button type="button" class="btn' + (c.auto ? ' on' : '') + '" data-sk="auto-on">Aktif</button><button type="button" class="btn' + (!c.auto ? ' on' : '') + '" data-sk="auto-off">Mati</button></div></div>' +
        '<div class="settings-row"><div class="settings-desc"><strong>Tindakan lanjutan</strong><span>Timpa cloud: data cloud diganti isi perangkat ini. Ambil dari cloud: isi perangkat ini diganti data cloud (salinan cadangan dibuat dulu). Hapus data cloud tidak menghapus data di perangkat.</span></div>' +
        '<div class="seg sm"><button type="button" class="btn danger" data-sk="timpa">Timpa cloud</button><button type="button" class="btn danger" data-sk="ambil">Ambil dari cloud</button><button type="button" class="btn danger" data-sk="hapus-cloud">Hapus data cloud</button><button type="button" class="btn" data-sk="keluar">Keluar</button></div></div>';
    } else {
      isi = '<div class="note" style="margin-top:6px">Buat proyek gratis di supabase.com, jalankan SQL dari docs/SINKRON.md, lalu isi alamat proyek dan kunci anon (Project Settings → API). Kata sandi tidak disimpan di perangkat.</div>' +
        isian('sk_url', 'Alamat proyek', 'url', c.url, 'https://xxxx.supabase.co') +
        isian('sk_key', 'Kunci anon (publik)', 'text', c.key, 'eyJ… atau sb_publishable_…') +
        isian('sk_email', 'Email', 'email', f.email) +
        isian('sk_pw', 'Kata sandi', 'password', f.pw) +
        '<div class="seg sm" style="margin-top:12px"><button type="button" class="btn" data-sk="masuk">Masuk</button><button type="button" class="btn" data-sk="daftar">Daftar akun baru</button></div>';
    }
    return kepala + isi + '<div class="note" id="skMsg" role="status" aria-live="polite" style="margin-top:8px">' + esc(status) + '</div>';
  }
  function ambilIsian() {
    var u = document.getElementById('sk_url'), k = document.getElementById('sk_key'), e = document.getElementById('sk_email'), p = document.getElementById('sk_pw');
    if (u) c.url = u.value.trim();
    if (k) c.key = k.value.trim();
    if (e) f.email = e.value.trim();
    if (p) f.pw = p.value;
  }
  function konfirmasi(tombol, kunci, jalankan) {
    if (yakin && yakin.kunci === kunci) { clearTimeout(yakin.t); yakin = null; jalankan(); return; }
    if (yakin) { clearTimeout(yakin.t); yakin.tombol.textContent = yakin.asal; yakin = null; }
    var asal = tombol.textContent;
    tombol.textContent = 'Ketuk lagi untuk melanjutkan';
    yakin = { kunci: kunci, tombol: tombol, asal: asal, t: setTimeout(function () { yakin = null; tombol.textContent = asal; }, 4000) };
  }
  function gagal(e) { kabar(e && e.message ? e.message : 'Gagal.'); }
  function klik(e) {
    var b = e.target.closest('[data-sk]');
    if (!b) return;
    var x = b.dataset.sk;
    if (x === 'masuk' || x === 'daftar') {
      kabar(x === 'daftar' ? 'Membuat akun…' : 'Masuk…');
      masuk(x === 'daftar').then(function (r) {
        if (r === 'konfirmasi') { kabar('Akun dibuat. Cek email untuk konfirmasi, lalu ketuk Masuk.'); return; }
        h.segar();
        return jalan('gabung').catch(gagal);
      }).catch(gagal);
    }
    else if (x === 'gabung') jalan('gabung').catch(gagal);
    else if (x === 'auto-on' || x === 'auto-off') { c.auto = x === 'auto-on'; simpanC(); h.segar(); }
    else if (x === 'keluar') { c.sesi = null; c.terakhir = 0; galat = false; simpanC(); kabar('Sudah keluar. Data di perangkat ini tetap ada.'); h.segar(); kabar('Sudah keluar. Data di perangkat ini tetap ada.'); }
    else if (x === 'timpa') konfirmasi(b, x, function () { jalan('timpa').catch(gagal); });
    else if (x === 'ambil') konfirmasi(b, x, function () { jalan('ambil').catch(gagal); });
    else if (x === 'hapus-cloud') konfirmasi(b, x, function () {
      kabar('Menghapus data cloud…');
      token().then(hapusCloud).then(function () { kabar('Data cloud dihapus. Data di perangkat ini tidak berubah.'); }).catch(gagal);
    });
  }
  function masukan(e) { if (e.target.closest && e.target.closest('.sk-f')) ambilIsian(); }
  function init(hooks) {
    Object.assign(h, hooks || {});
    muat(); lencana();
    document.addEventListener('click', klik);
    document.addEventListener('input', masukan);
    window.addEventListener('online', function () { if (c.sesi && c.auto) jalan('gabung', true).catch(function () {}); });
    if (c.sesi && c.auto) setTimeout(function () { jalan('gabung', true).catch(function () {}); }, 2000);
  }
  return { init: init, html: html, tandai: tandai, aktif: function () { return !!c.sesi; }, gabung: gabung };
})();
