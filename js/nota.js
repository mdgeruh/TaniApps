/* Tani Keuangan — Foto nota/bukti transaksi, lokal (v0.1.037).
   Foto disimpan di IndexedDB browser ini (basis data "tani-nota"), bukan di localStorage, supaya kuota data utama aman.
   Transaksi hanya menyimpan rujukan `notaId`. Foto tidak ikut ekspor JSON, cadangan otomatis, maupun sinkron cloud. */
var Nota = (function () {
  var NAMA = 'tani-nota', TOKO = 'nota', db = null;
  var MAKS_SISI = 1280, MUTU = 0.72, MAKS_BERKAS = 30 * 1024 * 1024, HARI30 = 30 * 864e5;
  var ada = !!window.indexedDB;

  /* ---------- penyimpanan ---------- */
  function buka() {
    if (!ada) return Promise.reject(new Error('tanpa-idb'));
    if (db) return Promise.resolve(db);
    return new Promise(function (ok, gagal) {
      var r;
      try { r = indexedDB.open(NAMA, 1); } catch (e) { gagal(e); return; }
      r.onupgradeneeded = function () { r.result.createObjectStore(TOKO, { keyPath: 'id' }); };
      r.onsuccess = function () { db = r.result; db.onclose = function () { db = null; }; ok(db); };
      r.onerror = function () { gagal(r.error || new Error('gagal-simpan')); };
    });
  }
  function jalan(mode, fn) {
    return buka().then(function (d) {
      return new Promise(function (ok, gagal) {
        var t = d.transaction(TOKO, mode), q = fn(t.objectStore(TOKO));
        t.oncomplete = function () { ok(q ? q.result : undefined); };
        t.onerror = t.onabort = function () { gagal(t.error || new Error('gagal-simpan')); };
      });
    });
  }
  function simpan(rec) { return jalan('readwrite', function (s) { return s.put(rec); }); }
  function ambil(id) { return jalan('readonly', function (s) { return s.get(id); }); }
  function hapus(id) { return jalan('readwrite', function (s) { return s.delete(id); }).catch(function () {}); }
  function semua() { return jalan('readonly', function (s) { return s.getAll(); }); }
  function kosongkan() { return jalan('readwrite', function (s) { return s.clear(); }); }

  /* ---------- kecilkan foto ---------- */
  function viaImg(f) {
    return new Promise(function (ok, gagal) {
      var u = URL.createObjectURL(f), i = new Image();
      i.onload = function () { URL.revokeObjectURL(u); ok(i); };
      i.onerror = function () { URL.revokeObjectURL(u); gagal(new Error('gagal-baca')); };
      i.src = u;
    });
  }
  function muatGambar(f) {
    if (window.createImageBitmap) return createImageBitmap(f).catch(function () { return viaImg(f); });
    return viaImg(f);
  }
  function kecilkan(f) {
    if (!/^image\//.test(f.type || '')) return Promise.reject(new Error('bukan-gambar'));
    if (f.size > MAKS_BERKAS) return Promise.reject(new Error('terlalu-besar'));
    return muatGambar(f).then(function (g) {
      var w = g.naturalWidth || g.width, h = g.naturalHeight || g.height;
      if (!w || !h) throw new Error('gagal-baca');
      var s = Math.min(1, MAKS_SISI / Math.max(w, h)), c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w * s)); c.height = Math.max(1, Math.round(h * s));
      var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(g, 0, 0, c.width, c.height);
      if (g.close) g.close();
      return new Promise(function (ok, gagal) { c.toBlob(function (b) { b ? ok(b) : gagal(new Error('gagal-baca')); }, 'image/jpeg', MUTU); });
    });
  }
  function galat(e) {
    var m = e && e.message, n = e && e.name;
    if (m === 'tanpa-idb') return 'Penyimpanan foto tidak tersedia di browser ini';
    if (m === 'bukan-gambar') return 'Pilih berkas gambar';
    if (m === 'terlalu-besar') return 'Foto terlalu besar (maksimal 30 MB)';
    if (m === 'gagal-baca') return 'Foto tidak bisa dibaca (format tidak didukung)';
    if (n === 'QuotaExceededError') return 'Penyimpanan browser penuh';
    return 'Foto gagal disimpan';
  }
  function mb(b) { return b >= 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }

  /* ---------- form catat ---------- */
  function kotak() {
    return '<label for="f_nota">Foto nota (opsional)</label>' +
      '<div class="nota-box" id="notaBox" aria-live="polite"></div>' +
      '<input type="file" id="f_nota" accept="image/*" hidden>';
  }
  function btnPilih(teks) { return '<button type="button" class="btn nota-btn" data-do="nota-pilih">' + teks + '</button>'; }
  function isiBox() {
    var box = $('notaBox'), d = App.draft;
    if (!box || !d) return;
    if (!ada) { box.innerHTML = '<p class="note">Foto nota tidak tersedia di browser ini.</p>'; return; }
    var id = d.nota;
    if (!id) { box.innerHTML = btnPilih('Ambil / pilih foto'); return; }
    box.innerHTML = '<p class="note" role="status">Memuat foto…</p>';
    ambil(id).then(function (r) {
      if ($('notaBox') !== box || App.draft !== d || d.nota !== id) return;
      if (!r) {
        box.innerHTML = '<p class="note">Foto nota transaksi ini tidak ada di browser ini (foto tidak ikut sinkron atau ekspor).</p>' +
          btnPilih('Pilih foto') + '<button type="button" class="btn nota-btn" data-do="nota-hapus">Lepas rujukan</button>';
        return;
      }
      var u = URL.createObjectURL(r.blob);
      box.innerHTML = '<button type="button" class="nota-thumb' + (Samar.aktif() ? ' samar' : '') + '" data-do="nota-lihat" aria-label="Lihat foto nota"><img alt="Foto nota" src="' + u + '"></button>' +
        '<div class="nota-aksi"><button type="button" class="btn nota-btn" data-do="nota-pilih">Ganti foto</button>' +
        '<button type="button" class="btn nota-btn danger" data-do="nota-hapus">Hapus foto</button></div>' +
        '<p class="note">' + mb(r.ukuran || r.blob.size) + ' · disimpan di browser ini</p>';
      var im = box.querySelector('img'); im.onload = im.onerror = function () { URL.revokeObjectURL(u); };
    }).catch(function () {
      if ($('notaBox') === box) box.innerHTML = '<p class="note">Foto nota tidak bisa dimuat.</p>' + btnPilih('Pilih foto');
    });
  }
  function pilih(inp) {
    var f = inp.files && inp.files[0], d = App.draft;
    inp.value = '';
    if (!f || !d) return;
    var box = $('notaBox'); if (box) box.innerHTML = '<p class="note" role="status">Memproses foto…</p>';
    kecilkan(f).then(function (b) {
      var id = uid('n');
      return simpan({ id: id, blob: b, tipe: b.type, ukuran: b.size, ms: Date.now() }).then(function () { return id; });
    }).then(function (id) {
      if (d.nota && d.nota !== d.notaLama) hapus(d.nota);
      d.nota = id;
      App.toast('Foto ditambahkan'); isiBox();
    }).catch(function (e) { App.toast(galat(e)); isiBox(); });
  }
  function lepas() {
    var d = App.draft; if (!d) return;
    if (d.nota && d.nota !== d.notaLama) hapus(d.nota);
    d.nota = null; isiBox();
  }
  /* Draft dibuang (Batal, Duplikat): hapus foto yang baru dipilih tetapi belum disimpan. */
  function buang(d) { if (d && d.nota && d.nota !== d.notaLama) hapus(d.nota); }

  var ikon = '<span class="nota-ikon" role="img" aria-label="Ada foto nota"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></span>';

  /* ---------- tampilan penuh ---------- */
  function lihat(id) {
    if (Samar.aktif()) { App.toast('Ketuk tombol mata dulu untuk melihat foto'); return; }
    ambil(id).then(function (r) {
      if (!r) return;
      if (Modal.m) return;
      var u = URL.createObjectURL(r.blob);
      var el = Modal.buka({ judulId: 'nlJudul', fokus: 'nlTutup', lapis: 'nota-lihat', kartu: 'nota-kartu', tutupLatar: true,
        html: '<h2 id="nlJudul" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Foto nota</h2><img alt="Foto nota" src="' + u + '"><button type="button" class="btn" id="nlTutup">Tutup</button>',
        klik: function (e) { if (e.target.closest('#nlTutup')) Modal.tutup(); },
        onTutup: function () { URL.revokeObjectURL(u); } });
      if (!el) URL.revokeObjectURL(u);
    }).catch(function () { App.toast('Foto tidak bisa dibuka'); });
  }

  /* ---------- aksi, Setelan, perawatan ---------- */
  function aksi(a) {
    if (a === 'nota-pilih') { var i = $('f_nota'); if (i) i.click(); }
    else if (a === 'nota-hapus') lepas();
    else if (a === 'nota-lihat') { if (App.draft && App.draft.nota) lihat(App.draft.nota); }
    else return false;
    return true;
  }
  function ringkas() {
    if (!ada) return Promise.resolve({ n: 0, ukuran: 0 });
    return semua().then(function (L) { return { n: L.length, ukuran: L.reduce(function (a, r) { return a + (r.ukuran || (r.blob && r.blob.size) || 0); }, 0) }; });
  }
  function isiInfo() {
    if (typeof Foto !== 'undefined') return Foto.isiInfo();
    var e = document.getElementById('notaInfo'); if (!e) return;
    ringkas().then(function (r) { var x = document.getElementById('notaInfo'); if (x) x.textContent = r.n ? r.n + ' foto · ' + mb(r.ukuran) + '.' : 'Belum ada foto.'; })
      .catch(function () { var x = document.getElementById('notaInfo'); if (x) x.textContent = 'Tidak bisa dibaca.'; });
  }
  /* Foto yang tidak lagi dirujuk transaksi (atau transaksinya sudah dihapus) dibersihkan setelah 30 hari. */
  function rapikan() {
    if (!ada || !App.data) return;
    var pakai = {}, kini = Date.now();
    App.data.transaksi.forEach(function (t) {
      if (!t.notaId) return;
      if (t.terhapus && kini - Date.parse(t.diubah || 0) > HARI30) return;
      pakai[t.notaId] = 1;
    });
    (App.data.jurnal || []).forEach(function (j) { if (j.terhapus || !j.foto) return; j.foto.forEach(function (id) { pakai[id] = 1; }); }); // foto jurnal (v0.1.092)
    semua().then(function (L) { L.forEach(function (r) { if (!pakai[r.id] && kini - (r.ms || 0) > HARI30) hapus(r.id); }); }).catch(function () {});
  }

  return { ikon: ikon, tersedia: function () { return ada; }, kotak: kotak, isiBox: isiBox, isiInfo: isiInfo, pilih: pilih, aksi: aksi, buang: buang,
           lihat: lihat, kosongkan: kosongkan, rapikan: rapikan, hapus: hapus, ringkas: ringkas,
           kecilkan: kecilkan, simpan: simpan, ambil: ambil, semua: semua, galat: galat, mb: mb };
})();
