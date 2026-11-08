/* Buku Kebun — form kustom: dropdown dan pemilih tanggal (v0.1.009).
   Elemen asli (select, input date) tetap ada tapi disembunyikan, jadi nilai dan event change tetap bekerja. */
var Form = (function () {
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  var CHEV = '<svg class="cx-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var CAL = '<svg class="cx-ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>';
  var CK = '<svg class="cx-ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
  var pop = null, back = null, ret = null, y0 = 0;

  function e(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function iso(y, m, d) { return y + '-' + p2(m + 1) + '-' + p2(d); }
  function hariIni() { var d = new Date(); return iso(d.getFullYear(), d.getMonth(), d.getDate()); }

  function onKey(ev) {
    if (!pop) return;
    if (ev.key === 'Escape') { ev.stopPropagation(); var r = ret; tutup(); if (r) r.focus(); return; }
    if (ev.key === 'Tab') { tutup(); return; }
    var items = Array.prototype.slice.call(pop.querySelectorAll('.cx-opt')), i = items.indexOf(document.activeElement);
    if (!items.length) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      i = ev.key === 'ArrowDown' ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1);
      items[i].focus();
    } else if ((ev.key === 'Enter' || ev.key === ' ') && i >= 0) { ev.preventDefault(); items[i].click(); }
  }
  function onScroll(ev) { if (pop && !pop.classList.contains('sheet') && !pop.contains(ev.target) && Math.abs(window.scrollY - y0) > 4) tutup(); }
  function tutup() {
    if (pop) pop.remove();
    if (back) back.remove();
    if (ret) ret.setAttribute('aria-expanded', 'false');
    pop = back = null;
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', tutup);
    window.removeEventListener('scroll', onScroll, true);
  }
  function buka(btn, isi, kelas) {
    tutup(); ret = btn; y0 = window.scrollY;
    var sheet = window.innerWidth <= 720;
    back = e('div', 'cx-back' + (sheet ? ' dim' : ''));
    back.addEventListener('click', tutup);
    pop = e('div', 'cx-pop' + (sheet ? ' sheet' : '') + (kelas ? ' ' + kelas : ''));
    isi(pop);
    document.documentElement.appendChild(back); document.documentElement.appendChild(pop);
    btn.setAttribute('aria-expanded', 'true');
    if (!sheet) {
      var r = btn.getBoundingClientRect();
      if (!kelas) pop.style.minWidth = r.width + 'px';
      var w = pop.offsetWidth, ht = pop.offsetHeight, left = Math.min(r.left, window.innerWidth - w - 8), top = r.bottom + 6;
      if (top + ht > window.innerHeight - 8) top = r.top > ht + 14 ? r.top - ht - 6 : Math.max(8, window.innerHeight - 8 - ht);
      pop.style.left = Math.max(8, left) + 'px'; pop.style.top = top + 'px';
    }
    var f = pop.querySelector('.sel') || pop.querySelector('.cx-opt') || pop.querySelector('.cx-day');
    if (f) { f.focus(); if (f.scrollIntoView) f.scrollIntoView({ block: 'nearest' }); }
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', tutup);
    window.addEventListener('scroll', onScroll, true);
  }
  function bungkus(el, btn) {
    var w = e('div', 'cx');
    el.parentNode.insertBefore(w, el); w.appendChild(btn); w.appendChild(el);
    el.classList.add('cx-native'); el.tabIndex = -1; el.setAttribute('aria-hidden', 'true'); el.dataset.cx = '1';
    var lab = el.id && document.querySelector('label[for="' + el.id + '"]');
    if (lab) { if (!lab.id) lab.id = el.id + '_lbl'; btn.setAttribute('aria-labelledby', lab.id); lab.addEventListener('click', function () { btn.focus(); }); }
  }
  function ubahNilai(el) { el.dispatchEvent(new Event('change', { bubbles: true })); }

  function pilih(sel) {
    var btn = e('button', 'cx-btn'); btn.type = 'button'; btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    function isi() { var o = sel.options[sel.selectedIndex]; btn.innerHTML = '<span class="cx-val">' + h(o ? o.text : '') + '</span>' + CHEV; }
    isi(); bungkus(sel, btn);
    btn.addEventListener('click', function () {
      buka(btn, function (p) {
        p.setAttribute('role', 'listbox');
        function tambah(o) {
          var pilihan = o.index === sel.selectedIndex;
          var it = e('div', 'cx-opt' + (pilihan ? ' sel' : ''), '<span>' + h(o.text) + '</span>' + (pilihan ? CK : ''));
          it.setAttribute('role', 'option'); it.setAttribute('aria-selected', pilihan); it.tabIndex = -1;
          it.addEventListener('click', function () { sel.selectedIndex = o.index; isi(); tutup(); ubahNilai(sel); });
          p.appendChild(it);
        }
        Array.prototype.forEach.call(sel.children, function (ch) {
          if (ch.tagName === 'OPTGROUP') { p.appendChild(e('div', 'cx-grp', h(ch.label))); Array.prototype.forEach.call(ch.children, tambah); }
          else tambah(ch);
        });
      });
    });
  }

  function tanggal(inp) {
    var btn = e('button', 'cx-btn'); btn.type = 'button'; btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false');
    function isi() { btn.innerHTML = '<span class="cx-val' + (inp.value ? '' : ' ph') + '">' + (inp.value ? h(Setelan.tgl(inp.value)) : 'Pilih tanggal') + '</span>' + CAL; }
    isi(); bungkus(inp, btn);
    function pilihTgl(v) { inp.value = v; isi(); tutup(); ubahNilai(inp); }
    btn.addEventListener('click', function () {
      buka(btn, function (p) {
        p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Pilih tanggal');
        var dasar = /^\d{4}-\d{2}-\d{2}$/.test(inp.value) ? inp.value : hariIni();
        var y = +dasar.slice(0, 4), m = +dasar.slice(5, 7) - 1;
        function gambar() {
          p.innerHTML = '';
          var hd = e('div', 'cx-cal-h');
          [['«', -12, 'Tahun sebelumnya'], ['‹', -1, 'Bulan sebelumnya']].forEach(function (x) { hd.appendChild(nav(x)); });
          hd.appendChild(e('span', 'cx-cal-t', BULAN[m] + ' ' + y));
          [['›', 1, 'Bulan berikutnya'], ['»', 12, 'Tahun berikutnya']].forEach(function (x) { hd.appendChild(nav(x)); });
          p.appendChild(hd);
          var g = e('div', 'cx-grid');
          HARI.forEach(function (n) { g.appendChild(e('span', 'cx-wd', n)); });
          var awal = (new Date(y, m, 1).getDay() + 6) % 7, hari = new Date(y, m + 1, 0).getDate(), ni = hariIni();
          for (var i = 0; i < awal; i++) g.appendChild(e('span'));
          for (var d = 1; d <= hari; d++) {
            var v = iso(y, m, d), b = e('button', 'cx-day' + (v === inp.value ? ' sel' : '') + (v === ni ? ' today' : ''), d);
            b.type = 'button'; b.dataset.v = v; b.setAttribute('aria-label', d + ' ' + BULAN[m] + ' ' + y);
            if (v === inp.value) b.setAttribute('aria-pressed', 'true');
            b.addEventListener('click', function () { pilihTgl(this.dataset.v); });
            g.appendChild(b);
          }
          p.appendChild(g);
          var ft = e('div', 'cx-foot');
          var bi = e('button', 'btn', 'Hari ini'); bi.type = 'button'; bi.addEventListener('click', function () { pilihTgl(hariIni()); }); ft.appendChild(bi);
          if (inp.dataset.f) { var bh = e('button', 'btn', 'Hapus'); bh.type = 'button'; bh.addEventListener('click', function () { pilihTgl(''); }); ft.appendChild(bh); }
          p.appendChild(ft);
          var f = p.querySelector('.cx-day.sel') || p.querySelector('.cx-day.today') || p.querySelector('.cx-day');
          if (f && p.dataset.siap) f.focus();
          p.dataset.siap = '1';
        }
        function nav(x) {
          var b = e('button', 'cx-nav', x[0]); b.type = 'button'; b.setAttribute('aria-label', x[2]);
          b.addEventListener('click', function () { var t = y * 12 + m + x[1]; y = Math.floor(t / 12); m = t % 12; gambar(); });
          return b;
        }
        gambar();
      }, 'cal');
    });
  }

  function upgrade(root) {
    tutup();
    Array.prototype.forEach.call(root.querySelectorAll('select:not([data-cx])'), pilih);
    Array.prototype.forEach.call(root.querySelectorAll('input[type=date]:not([data-cx])'), tanggal);
  }
  return { upgrade: upgrade, tutup: tutup };
})();
