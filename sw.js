/* Tani Keuangan — service worker (luring). Naikkan V setiap versi agar cache lama diganti. */
var V = 'tani-keuangan-v0_1_061';
var BERKAS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(V).then(function (c) {
      return Promise.all(BERKAS.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin !== location.origin) return; /* font dan Supabase tidak ditangani */
  if (r.mode === 'navigate') { /* jaringan dulu, cadangan dari cache */
    e.respondWith(
      fetch(r).then(function (res) {
        if (res && res.ok) { var s = res.clone(); caches.open(V).then(function (c) { c.put('index.html', s); }); }
        return res;
      }).catch(function () {
        return caches.match('index.html').then(function (m) { return m || caches.match('./'); });
      })
    );
    return;
  }
  e.respondWith( /* cache dulu, diperbarui di latar belakang */
    caches.match(r).then(function (m) {
      var net = fetch(r).then(function (res) {
        if (res && res.ok) { var s = res.clone(); caches.open(V).then(function (c) { c.put(r, s); }); }
        return res;
      }).catch(function () { return m; });
      return m || net;
    })
  );
});
