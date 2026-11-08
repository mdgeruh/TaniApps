/* Buku Kebun — sinkron cloud Supabase, opsional (v0.1.023; konfigurasi bawaan v0.1.106; Layar Akun v0.1.107) */
var Sinkron = (function () {
  var KUNCI = 'tani.sinkron', TABEL = 'tani_data', JEDA = 20000, WAKTU = 15000;
  var KOLEKSI = ['unit', 'komoditas', 'siklus', 'transaksi', 'panen', 'aset', 'utang', 'kategori', 'jurnal'];
  var h = { ambil: function () { return {}; }, terapkan: function () {}, segar: function () {} };
  /* Konfigurasi bawaan proyek Supabase. Kunci publishable memang publik (aman di sisi klien); data dilindungi login dan RLS, lihat docs/SINKRON.md. Jangan pernah mengisi kunci service_role/secret di sini. */
  var BAWAAN = { url: 'https://yvjhovpyopglwlilntdt.supabase.co', key: 'sb_publishable_Sy7bKh5ctNM6G-p6tyxK-Q_Xv9Mr_NQ' };
  var c = { url: BAWAAN.url, key: BAWAAN.key, sesi: null, auto: true, terakhir: 0 };
  var f = { email: '', pw: '' };
  var sibuk = false, tunda = null, yakin = null, status = '', galat = false;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]; }); }
  function muat() {
    try { var o = JSON.parse(Penyimpanan.get(KUNCI) || '{}') || {}; c = Object.assign(c, o); } catch (e) {}
    if (!c.url) c.url = BAWAAN.url; if (!c.key) c.key = BAWAAN.key;
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
  /* label status di header: Mode lokal / Menyinkronkan / Tersinkron HH:MM / Gagal sinkron / Menunggu internet */
  function keadaan() {
    if (!c.sesi) return { k: 'lokal', t: 'Mode lokal' };
    if (sibuk) return { k: 'sibuk', t: 'Menyinkronkan…' };
    if (galat) return { k: 'gagal', t: 'Gagal sinkron' };
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return { k: 'offline', t: 'Menunggu internet' };
    var d = new Date(c.terakhir);
    return { k: c.terakhir ? 'ok' : 'baru', t: c.terakhir ? 'Tersinkron ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : 'Belum sinkron' };
  }
  function lencana() {
    var e = document.getElementById('skDot'); if (!e) return;
    var s = keadaan();
    e.innerHTML = '<button type="button" class="sk-chip sk-' + s.k + '" data-sk="akun" aria-label="Akun dan sinkron: ' + s.t + '">' + s.t + '</button>';
  }
  function kabar(t) { status = t || ''; var e = document.getElementById('skMsg'); if (e) e.textContent = status; lencana(); }

  /* ---------- pesan galat berbahasa Indonesia ---------- */
  function galatId(e) {
    var m = String((e && e.message) || ''), s = e && e.status;
    if (/invalid login|invalid credentials/i.test(m)) return 'Email atau kata sandi salah. Coba lagi.';
    if (/not confirmed/i.test(m)) return 'Email belum dikonfirmasi. Buka email dari kami, ketuk tautannya, lalu masuk lagi.';
    if (/already (registered|exists)|already been registered/i.test(m)) return 'Email ini sudah terdaftar. Silakan masuk.';
    if (/signups? (not allowed|are disabled|disabled)|signup is disabled/i.test(m)) return 'Pendaftaran akun baru sedang ditutup.';
    if (/password.*(at least|should|weak|short)|weak password/i.test(m)) return 'Kata sandi terlalu lemah. Pakai minimal 8 karakter.';
    if (/valid email|invalid.*email|email.*invalid|unable to validate email/i.test(m)) return 'Email belum benar. Contoh: nama@email.com';
    if (s === 429 || /rate limit|too many|for security purposes/i.test(m)) return 'Terlalu sering mencoba. Tunggu semenit lalu coba lagi.';
    if (s >= 500) return 'Server cloud sedang bermasalah. Coba lagi sebentar lagi.';
    return m || 'Gagal. Coba lagi.';
  }

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
    if (!c.url) return Promise.reject(new Error('Alamat proyek tidak valid. Buka Lanjutan di Setelan. Contoh: https://abcd1234.supabase.co'));
    if (!c.key) return Promise.reject(new Error('Kunci proyek belum diisi. Buka Lanjutan di Setelan.'));
    if (!f.email) return Promise.reject(new Error('Isi email Anda.'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return Promise.reject(new Error('Email belum benar. Contoh: nama@email.com'));
    if (!f.pw) return Promise.reject(new Error('Isi kata sandi.'));
    if (daftar && f.pw.length < 8) return Promise.reject(new Error('Kata sandi minimal 8 karakter.'));
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
          h.terapkan(jauh, true, true); /* penggantian sengaja: tanpa gabung multi-tab */
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
    var s = keadaan();
    var kepala = '<div class="sec-head"><h2>Akun dan sinkron</h2><div class="note">Opsional. Tanpa akun, semua fitur tetap jalan di perangkat ini (mode lokal). Foto tidak ikut sinkron. Panduan: docs/AKUN.md.</div></div>';
    var isi;
    if (c.sesi) {
      isi = '<div class="settings-row"><div class="settings-desc"><strong>' + esc(c.sesi.email || 'Akun cloud') + '</strong><span><span class="sk-chip sk-' + s.k + '">' + s.t + '</span> Terakhir sinkron: ' + waktu() + '</span></div>' +
        '<button type="button" class="btn" data-sk="gabung">Sinkronkan sekarang</button></div>' +
        '<div class="settings-row"><div class="settings-desc"><strong>Sinkron otomatis</strong><span>Menggabungkan perubahan beberapa detik setelah Anda mencatat, saat aplikasi dibuka, dan saat internet kembali.</span></div>' +
        '<div class="sw-wrap"><span class="sw-t" id="skAutoT">' + (c.auto ? 'Aktif' : 'Mati') + '</span><button type="button" class="sw" id="skAuto" role="switch" aria-checked="' + (c.auto ? 'true' : 'false') + '" aria-label="Sinkron otomatis" data-sk="auto-sakelar"><span class="sw-kenop"></span></button></div></div>' +
        '<div class="settings-row"><div class="settings-desc"><strong>Keluar</strong><span>Kembali ke mode lokal. Data di perangkat ini tetap ada.</span></div><button type="button" class="btn" data-sk="keluar">Keluar</button></div>' +
        '<div class="settings-row"><div class="settings-desc"><strong>Tindakan lanjutan</strong><span>Timpa cloud: data cloud diganti isi perangkat ini. Ambil dari cloud: isi perangkat ini diganti data cloud (salinan cadangan dibuat dulu). Hapus data cloud tidak menghapus data di perangkat.</span></div>' +
        '<div class="seg sm"><button type="button" class="btn danger" data-sk="timpa">Timpa cloud</button><button type="button" class="btn danger" data-sk="ambil">Ambil dari cloud</button><button type="button" class="btn danger" data-sk="hapus-cloud">Hapus data cloud</button></div></div>';
    } else {
      isi = '<div class="settings-row"><div class="settings-desc"><strong><span class="sk-chip sk-lokal">Mode lokal</span></strong><span>Data hanya tersimpan di perangkat ini. Buat akun untuk cadangan di cloud dan memakai beberapa perangkat.</span></div>' +
        '<div class="seg sm"><button type="button" class="btn" data-sk="akun-masuk">Masuk</button><button type="button" class="btn" data-sk="akun-daftar">Buat akun</button></div></div>';
    }
    var lanjut = '<details class="sk-lanjut"><summary>Lanjutan (untuk pengelola)</summary>' +
      '<div class="note" style="margin-top:6px">' + (c.url === BAWAAN.url && c.key === BAWAAN.key ? 'Memakai proyek Supabase bawaan aplikasi.' : 'Memakai proyek Supabase sendiri. Buat proyek di supabase.com dan jalankan SQL dari docs/SINKRON.md.') + ' Jangan pernah mengisi kunci service_role atau secret di sini.</div>' +
      isian('sk_url', 'Alamat proyek', 'url', c.url, 'https://xxxx.supabase.co') +
      isian('sk_key', 'Kunci anon (publik)', 'text', c.key, 'eyJ… atau sb_publishable_…') +
      '<div class="seg sm" style="margin-top:10px"><button type="button" class="btn" data-sk="bawaan">Pakai bawaan aplikasi</button></div></details>';
    return kepala + isi + lanjut + '<div class="note" id="skMsg" role="status" aria-live="polite" style="margin-top:8px">' + esc(status) + '</div>';
  }

  /* ---------- Layar Akun (modal): Masuk, Buat akun, Cek email ---------- */
  var akun = { mode: 'masuk', kirim: false };
  function kekuatan(p) {
    var n = (p.length >= 8 ? 1 : 0) + (p.length >= 12 ? 1 : 0) + (/[a-z]/.test(p) && /[A-Z]/.test(p) ? 1 : 0) + (/\d/.test(p) ? 1 : 0) + (/[^A-Za-z0-9]/.test(p) ? 1 : 0);
    return !p ? { n: 0, t: '' } : p.length < 8 ? { n: 1, t: 'Terlalu pendek' } : n <= 2 ? { n: 2, t: 'Sedang' } : { n: 3, t: 'Kuat' };
  }
  function isianAkun(id, label, tipe, nilai, ket, ac) {
    return '<label class="sk-f"><span>' + label + '</span><input id="' + id + '" type="' + tipe + '" value="' + esc(nilai) + '" autocomplete="' + ac + '" autocapitalize="off" spellcheck="false"' + (tipe === 'email' ? ' inputmode="email"' : '') + (ket ? ' placeholder="' + esc(ket) + '"' : '') + '></label>';
  }
  function sandiKotak(id, label, ac) {
    return '<div class="sk-sandi"><label class="sk-f"><span>' + label + '</span><input id="' + id + '" type="password" value="" autocomplete="' + ac + '" autocapitalize="off" spellcheck="false" placeholder="Kata sandi"></label>' +
      '<button type="button" class="btn sk-mata" data-sk="mata" aria-label="Tampilkan kata sandi" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></div>';
  }
  function akunHtml(mode) {
    var d = mode === 'daftar', judul = mode === 'cek' ? 'Cek email Anda' : d ? 'Buat akun' : 'Masuk', isi;
    if (mode === 'cek') {
      isi = '<p class="note">Akun dibuat. Kami mengirim email konfirmasi ke <strong>' + esc(f.email) + '</strong>. Buka email itu, ketuk tautannya, lalu kembali ke sini dan masuk.</p>';
    } else {
      isi = isianAkun('sk_email', 'Email', 'email', f.email, 'nama@email.com', 'email') +
        sandiKotak('sk_pw', d ? 'Kata sandi (minimal 8 karakter)' : 'Kata sandi', d ? 'new-password' : 'current-password') +
        (d ? '<div class="sk-kuat" aria-hidden="true"><i id="skBar"></i></div><div class="note" id="skKuat" aria-live="polite"></div>' +
          '<label class="sk-setuju"><input type="checkbox" id="sk_setuju"><span>Saya paham catatan saya disimpan di server cloud proyek ini dan hanya bisa dibaca oleh akun saya.</span></label>' : '') +
        '<p class="note" style="margin-top:10px">' + (d ? 'Foto dan data contoh tidak ikut tersimpan di cloud.' : 'Belum punya akun? Buat akun di bawah.') + '</p>';
    }
    var aksi = mode === 'cek'
      ? '<button type="button" class="btn gold" data-sk="akun-ganti" data-m="masuk">Masuk</button><button type="button" class="btn" data-sk="akun-tutup" style="width:100%">Tutup</button>'
      : '<button type="button" class="btn gold" data-sk="akun-kirim" id="skKirim">' + (d ? 'Buat akun' : 'Masuk') + '</button>' +
        '<button type="button" class="btn" data-sk="akun-ganti" data-m="' + (d ? 'masuk' : 'daftar') + '" style="width:100%;margin-bottom:10px">' + (d ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Buat akun') + '</button>' +
        '<button type="button" class="btn" data-sk="akun-tutup" style="width:100%">Batal</button>';
    return '<div class="dm-kepala"><div><div class="dm-jenis">Akun cloud (opsional)</div><h2 class="dm-judul" id="akJudul">' + judul + '</h2></div>' +
      '<button type="button" class="dm-x" data-sk="akun-tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="dm-isi">' + isi + '</div><div class="dm-aksi">' + aksi + '</div>';
  }
  function akunGambar(mode) {
    if (!Modal.m) return;
    akun.mode = mode; Modal.m.el.firstChild.innerHTML = akunHtml(mode);
    if (typeof Form !== 'undefined') Form.upgrade(Modal.m.el);
    var i = Modal.m.el.querySelector('#sk_email') || Modal.m.el.querySelector('[data-sk=akun-ganti]'); if (i) i.focus();
  }
  function akunBuka(mode) {
    if (c.sesi || Modal.m) return false;
    akun = { mode: mode || 'masuk', kirim: false };
    return !!Modal.buka({ judulId: 'akJudul', fokus: 'sk_email', tutupLatar: true, lapis: 'akun', html: akunHtml(akun.mode),
      klik: akunKlik, simpan: akunKirim, onTutup: function () { f.pw = ''; akun.kirim = false; } });
  }
  function akunKirim() {
    if (akun.kirim || !Modal.m || akun.mode === 'cek') return;
    var d = akun.mode === 'daftar'; ambilIsian();
    var cb = document.getElementById('sk_setuju');
    if (d && cb && !cb.checked) { Modal.galat('Centang persetujuan untuk melanjutkan.'); return; }
    akun.kirim = true; var bt = document.getElementById('skKirim'); if (bt) bt.textContent = 'Memproses…';
    masuk(d).then(function (r) {
      akun.kirim = false;
      if (r === 'konfirmasi') { akunGambar('cek'); return; }
      Modal.tutup(true); App.toast('Berhasil masuk'); h.segar(); lencana();
      var fk = document.querySelector('#skDot button') || document.getElementById('app'); if (fk) { if (!fk.hasAttribute('tabindex') && fk.id === 'app') fk.setAttribute('tabindex', '-1'); fk.focus({ preventScroll: true }); }
      return jalan('gabung').catch(function (e) { App.toast(galatId(e)); });
    }).catch(function (e) {
      akun.kirim = false; var b2 = document.getElementById('skKirim'); if (b2) b2.textContent = d ? 'Buat akun' : 'Masuk';
      Modal.galat(galatId(e));
    });
  }
  function akunKlik(e) {
    var b = e.target.closest('[data-sk]'); if (!b) return; var x = b.dataset.sk;
    if (x === 'akun-tutup') Modal.tutup();
    else if (x === 'akun-kirim') akunKirim();
    else if (x === 'akun-ganti') akunGambar(b.dataset.m);
    else if (x === 'mata') {
      var i = document.getElementById('sk_pw'); if (!i) return; var buka = i.type === 'password';
      i.type = buka ? 'text' : 'password'; b.setAttribute('aria-pressed', buka ? 'true' : 'false'); b.setAttribute('aria-label', buka ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'); i.focus();
    }
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
  function gagal(e) { kabar(galatId(e)); }
  function klik(e) {
    var b = e.target.closest('[data-sk]');
    if (!b || b.closest('[role=dialog]')) return;
    var x = b.dataset.sk;
    if (x === 'akun') {
      if (c.sesi) { Lipat.s['st-sink'] = true; App.go('setelan'); setTimeout(function () { var s = document.querySelector('[data-lipat="st-sink"]'); if (s) { s.open = true; s.scrollIntoView({ block: 'start' }); } }, 60); }
      else akunBuka('masuk');
    }
    else if (x === 'akun-masuk') akunBuka('masuk');
    else if (x === 'akun-daftar') akunBuka('daftar');
    else if (x === 'bawaan') { c.url = BAWAAN.url; c.key = BAWAAN.key; simpanC(); h.segar(); kabar('Memakai proyek bawaan aplikasi.'); }
    else if (x === 'gabung') jalan('gabung').catch(gagal);
    else if (x === 'auto-sakelar') {
      c.auto = !c.auto; simpanC(); b.setAttribute('aria-checked', c.auto ? 'true' : 'false');
      var tt = document.getElementById('skAutoT'); if (tt) tt.textContent = c.auto ? 'Aktif' : 'Mati';
      if (c.auto) tandai(); kabar(c.auto ? 'Sinkron otomatis aktif.' : 'Sinkron otomatis mati. Ketuk Sinkronkan sekarang bila perlu.');
    }
    else if (x === 'auto-on' || x === 'auto-off') { c.auto = x === 'auto-on'; simpanC(); h.segar(); }
    else if (x === 'keluar') { c.sesi = null; c.terakhir = 0; galat = false; simpanC(); kabar('Sudah keluar. Data di perangkat ini tetap ada.'); h.segar(); kabar('Sudah keluar. Data di perangkat ini tetap ada.'); }
    else if (x === 'timpa') konfirmasi(b, x, function () { jalan('timpa').catch(gagal); });
    else if (x === 'ambil') konfirmasi(b, x, function () { jalan('ambil').catch(gagal); });
    else if (x === 'hapus-cloud') konfirmasi(b, x, function () {
      kabar('Menghapus data cloud…');
      token().then(hapusCloud).then(function () { kabar('Data cloud dihapus. Data di perangkat ini tidak berubah.'); }).catch(gagal);
    });
  }
  function masukan(e) {
    if (!e.target.closest) return;
    if (e.target.closest('.sk-f')) ambilIsian();
    if (e.target.id === 'sk_pw' && document.getElementById('skBar')) {
      var k = kekuatan(e.target.value), bar = document.getElementById('skBar');
      bar.style.width = Math.round(k.n / 3 * 100) + '%'; bar.className = 'sk-k' + k.n; document.getElementById('skKuat').textContent = k.t ? 'Kekuatan: ' + k.t : '';
    }
  }
  function init(hooks) {
    Object.assign(h, hooks || {});
    muat(); lencana();
    document.addEventListener('click', klik);
    document.addEventListener('input', masukan);
    window.addEventListener('online', function () { lencana(); if (c.sesi && c.auto) jalan('gabung', true).catch(function () {}); });
    window.addEventListener('offline', lencana);
    if (c.sesi && c.auto) setTimeout(function () { jalan('gabung', true).catch(function () {}); }, 2000);
  }
  return { init: init, html: html, tandai: tandai, aktif: function () { return !!c.sesi; }, gabung: gabung, buka: akunBuka, galatId: galatId };
})();
