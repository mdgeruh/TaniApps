/* Buku Kebun — profil di header Beranda (v0.1.148): sapaan, lonceng Perlu perhatian, avatar dengan dropdown (profil, tema, setelan, akun; v0.1.170: Tema dipertahankan, angka dan panduan tidak).
   Nama dan foto disimpan di Setelan (perangkat ini saja, tidak ikut ekspor data). */
const Profil = {
  pop: null, back: null, buka: false, mode: 'av', pemicu: null, foto: undefined,
  $(id) { return document.getElementById(id); },
  esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x])); },
  nama() { return String(Setelan.get('nama') || '').trim(); },
  awal() { const n = this.nama(); return n ? Array.from(n)[0].toUpperCase() : ''; },
  salam() { const j = new Date().getHours(); return j >= 4 && j < 11 ? 'Selamat pagi' : j < 15 ? 'Selamat siang' : j < 18 ? 'Selamat sore' : 'Selamat malam'; },
  /* isi h1 Beranda: "Selamat pagi, Alex" */
  sapaan() { const n = this.nama(); return n ? '<span class="sp-s">' + this.salam() + ',</span><span class="sp-n">' + this.esc(n) + '</span>' : this.salam(); },
  ikon: {
    ikon: (d) => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>',
    lonceng: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4"/>',
    terang: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    gelap: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    otomatis: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
    mata: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
    setelan: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    akun: '<path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5z"/>',
    panduan: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2 1-1.2 1.8M12 17v.2"/>',
    ubah: '<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>'
  },
  svg(k) { return this.ikon.ikon(this.ikon[k]); },
  /* gambar avatar: foto bila ada, kalau tidak huruf awal nama, kalau tidak ikon orang */
  avatar(kls) {
    const f = Setelan.get('foto'), a = this.awal();
    return '<span class="' + kls + '" aria-hidden="true">' + (f ? '<img src="' + this.esc(f) + '" alt="">' : a ? '<b>' + this.esc(a) + '</b>' : this.ikon.ikon('<circle cx="12" cy="8.5" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>')) + '</span>';
  },
  status() { try { const s = document.querySelector('#skDot .sk-chip'); return s ? s.textContent.trim() : 'Mode lokal'; } catch (e) { return 'Mode lokal'; } },
  sub() { const e = typeof Sinkron !== 'undefined' && Sinkron.email ? Sinkron.email() : '', u = this.usaha(); return u ? this.esc(u) : e ? this.esc(e) : 'Mode lokal · di perangkat ini'; },

  init() {
    const w = document.querySelector('.masthead-right'); if (!w || this.$('pfAvatar')) return;
    const bel = document.createElement('button'); bel.type = 'button'; bel.id = 'pfBel'; bel.className = 'theme-toggle pf-bel';
    bel.innerHTML = this.svg('lonceng') + '<b class="pf-badge" id="pfBadge" hidden></b>';
    const av = document.createElement('button'); av.type = 'button'; av.id = 'pfAvatar'; av.className = 'pf-btn';
    av.setAttribute('aria-haspopup', 'menu'); av.setAttribute('aria-expanded', 'false'); av.setAttribute('aria-controls', 'pfPop');
    const kiri = document.querySelector('.mh-kiri');
    if (kiri && !this.$('pfMerek')) { const m = document.createElement('button'); m.type = 'button'; m.id = 'pfMerek'; m.className = 'pf-merek'; m.dataset.go = 'beranda'; m.setAttribute('aria-label', 'Buku Kebun, ke Beranda');
      m.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-8M12 13c0-4 3-7 8-7 0 5-3 7-8 7zM12 15c0-3-2-5-6-5 0 4 2 5 6 5z"/></svg><span class="pf-mn"><b>Buku <em>Kebun</em></b><small>Manajemen pertanian</small></span>'; kiri.insertBefore(m, kiri.firstChild); }
    w.appendChild(bel); w.appendChild(av);
    bel.setAttribute('aria-haspopup', 'menu'); bel.setAttribute('aria-expanded', 'false'); bel.setAttribute('aria-controls', 'pfPop');
    bel.addEventListener('click', () => (this.buka && this.mode === 'bel' ? this.tutup(true) : this.tunjuk('bel')));
    av.addEventListener('click', () => (this.buka && this.mode === 'av' ? this.tutup(true) : this.tunjuk('av')));
    document.addEventListener('click', (e) => this.klikHal(e));
    document.addEventListener('keydown', (e) => { if (this.buka && e.key === 'Escape' && !(typeof Modal !== 'undefined' && Modal.m)) { e.preventDefault(); this.tutup(true); } });
    window.addEventListener('resize', () => { if (this.buka) this.letak(); });
    window.addEventListener('scroll', () => { if (this.buka) this.letak(); }, { passive: true });
    if (window.MutationObserver) {
      new MutationObserver(() => { if (this.buka) this.isi(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      const sk = this.$('skDot'); if (sk) new MutationObserver(() => { if (this.buka) this.isi(); }).observe(sk, { childList: true, subtree: true, characterData: true });
    }
    this.segar();
  },
  /* perbarui avatar dan lencana lonceng; dipanggil setiap Beranda digambar */
  segar() {
    const av = this.$('pfAvatar'); if (!av) return;
    av.innerHTML = this.avatar('pf-ava'); const n = this.nama();
    av.setAttribute('aria-label', 'Profil' + (n ? ' ' + n : '') + ', buka menu'); av.title = 'Profil';
    const b = this.$('pfBadge'), bel = this.$('pfBel'); let j = 0, lewat = false;
    try { const L = Beranda.daftar(); j = L.length; lewat = L.some((x) => x.t.charAt(0) === '⚠'); } catch (e) { j = 0; }
    if (b) { b.hidden = !j; b.textContent = j > 9 ? '9+' : String(j); b.classList.toggle('lewat', lewat); }
    if (bel) { const t = j ? j + ' perlu perhatian' : 'Tidak ada yang perlu perhatian'; bel.setAttribute('aria-label', t); bel.title = t; }
    if (this.buka) this.isi();
  },
  semua() {
    if (App.tab !== 'beranda') { App.go('beranda'); setTimeout(() => this.semua(), 120); return; }
    const el = document.querySelector('[data-bx="perhatian"]'); if (!el) return;
    el.scrollIntoView({ behavior: window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    el.classList.add('pf-sorot'); setTimeout(() => el.classList.remove('pf-sorot'), 1400);
  },

  /* ---------- dropdown ---------- */
  /* dropdown lonceng: daftar Perlu perhatian, tiap butir bisa diketuk menuju halaman terkait */
  isiBel() {
    const L = (() => { try { return Beranda.daftar(); } catch (e) { return []; } })(), maks = 5;
    this.pop.innerHTML = '<div class="pf-bkepala"><strong>Perlu perhatian</strong><span>' + (L.length ? L.length + ' butir' : '') + '</span></div>' +
      (L.length ? L.slice(0, maks).map((x, i) => '<button type="button" class="pf-it pf-bit" role="menuitem" data-pf="tuju" data-i="' + i + '"><span class="pf-t">' + Beranda.ik(x.t) + '</span><span class="pf-pen" aria-hidden="true">›</span></button>').join('') +
        '<div class="pf-pisah" role="separator"></div><button type="button" class="pf-it" role="menuitem" data-pf="semua"><span class="pf-t">' + (L.length > maks ? 'Lihat semua (' + L.length + ')' : 'Lihat di Beranda') + '</span></button>'
        : '<p class="pf-kosong">Semua beres. Tidak ada yang perlu perhatian.</p>');
  },
  isi() {
    if (this.mode === 'bel') { this.isiBel(); return; }
    const m = Setelan.get('mode'), e = Setelan.efektif();
    const pil = (v, t, k) => '<button type="button" class="pf-pil" role="menuitemradio" aria-checked="' + (m === v) + '" data-pf="mode" data-v="' + v + '">' + this.svg(k) + '<span>' + t + '</span></button>';
    const item = (a, k, t, s, role, cek) => '<button type="button" class="pf-it" role="' + (role || 'menuitem') + '"' + (cek !== undefined ? ' aria-checked="' + cek + '"' : '') + ' data-pf="' + a + '">' + this.svg(k) + '<span class="pf-t">' + t + '</span>' + (s ? '<span class="pf-s">' + s + '</span>' : '') + '</button>';
    const lok = typeof Sinkron !== 'undefined' && Sinkron.aktif && Sinkron.aktif();
    this.pop.innerHTML =
      '<button type="button" class="pf-kepala" role="menuitem" data-pf="profil" aria-label="Buka halaman profil">' + this.avatar('pf-ava pf-besar') +
        '<span class="pf-nm"><strong>' + (this.nama() ? this.esc(this.nama()) : 'Tambahkan nama') + '</strong><span>' + this.sub() + '</span></span><span class="pf-pen" aria-hidden="true">' + this.svg('ubah') + '</span></button>' +
      '<div class="pf-grup" role="group" aria-label="Tema"><div class="pf-lbl">Tema' + (m === 'auto' ? ' · ' + (e === 'dark' ? 'gelap' : 'terang') : '') + '</div><div class="pf-seg">' + pil('light', 'Terang', 'terang') + pil('dark', 'Gelap', 'gelap') + pil('auto', 'Otomatis', 'otomatis') + '</div></div>' +
      '<div class="pf-pisah" role="separator"></div>' +
      item('setelan', 'setelan', 'Setelan', '') +
      item('akun', 'akun', lok ? 'Akun & sinkron' : 'Masuk untuk sinkron', lok ? this.esc(this.status()) : 'Opsional');
  },
  tunjuk(mode) {
    if (this.buka) this.tutup(false);
    this.mode = mode || 'av';
    if (!this.pop) {
      this.back = document.createElement('div'); this.back.className = 'pf-back'; this.back.hidden = true; this.back.addEventListener('click', () => this.tutup(true));
      this.pop = document.createElement('div'); this.pop.id = 'pfPop'; this.pop.className = 'pf-pop'; this.pop.setAttribute('role', 'menu'); this.pop.hidden = true;
      this.pop.addEventListener('click', (e) => this.klik(e)); this.pop.addEventListener('keydown', (e) => this.kunci(e));
      document.body.appendChild(this.back); document.body.appendChild(this.pop);
    }
    this.pemicu = this.$(this.mode === 'bel' ? 'pfBel' : 'pfAvatar'); this.pop.setAttribute('aria-label', this.mode === 'bel' ? 'Perlu perhatian' : 'Profil'); this.pop.classList.toggle('pf-lebar', this.mode === 'bel'); this.isi(); this.back.hidden = false; this.pop.hidden = false; this.buka = true;
    this.pemicu.setAttribute('aria-expanded', 'true'); this.letak();
    const f = this.pop.querySelector('.pf-kepala,.pf-it'); if (f) f.focus({ preventScroll: true });
  },
  tutup(fokus) {
    if (!this.buka) return; this.buka = false; this.pop.hidden = true; this.back.hidden = true;
    ['pfBel', 'pfAvatar'].forEach((i) => { const e = this.$(i); if (e) e.setAttribute('aria-expanded', 'false'); });
    if (fokus && this.pemicu) this.pemicu.focus({ preventScroll: true });
  },
  letak() {
    const r = this.pemicu.getBoundingClientRect(), vw = document.documentElement.clientWidth, L = Math.min(this.mode === 'bel' ? 360 : 320, vw - 16);
    this.pop.style.width = L + 'px'; this.pop.style.top = Math.round(r.bottom + 8) + 'px';
    this.pop.style.left = Math.round(Math.max(8, Math.min(vw - L - 8, r.right - L))) + 'px';
    this.pop.style.maxHeight = 'calc(100vh - ' + Math.round(r.bottom + 16) + 'px)';
  },
  kunci(e) {
    if (e.key === 'Tab') { this.tutup(false); return; }
    if (!/^(ArrowDown|ArrowUp|Home|End)$/.test(e.key)) return;
    const L = Array.from(this.pop.querySelectorAll('button')), i = L.indexOf(document.activeElement); e.preventDefault();
    L[e.key === 'Home' ? 0 : e.key === 'End' ? L.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + L.length) % L.length].focus();
  },
  klik(e) {
    const b = e.target.closest('[data-pf]'); if (!b) return; const a = b.dataset.pf;
    if (a === 'mode') { Setelan.ubah('mode', b.dataset.v); const t = Setelan.efektif(); App.toast('Tema ' + (b.dataset.v === 'auto' ? 'otomatis (' + (t === 'dark' ? 'gelap' : 'terang') + ')' : t === 'dark' ? 'gelap' : 'terang')); this.isi(); const n = this.pop.querySelector('[aria-checked="true"].pf-pil'); if (n) n.focus({ preventScroll: true }); return; }
    if (a === 'tuju') {
      const x = Beranda.daftar()[Number(b.dataset.i)]; this.tutup(false); if (!x) return;
      const k = document.createElement('button'); (x.a.match(/data-[a-z]+="[^"]*"/g) || []).forEach((s) => { const m = /data-([a-z]+)="([^"]*)"/.exec(s); k.dataset[m[1]] = m[2].replace(/&amp;/g, '&').replace(/&quot;/g, '"'); });
      k.style.display = 'none'; const w = this.$('app') || document.body; w.appendChild(k); k.click(); k.remove(); return;
    }
    this.tutup(false);
    if (a === 'semua') this.semua();
    else if (a === 'profil') App.go('profil');
    else if (a === 'ubah') this.ubah();
    else if (a === 'setelan') App.go('setelan');
    else if (a === 'akun') { const k = document.createElement('button'); k.dataset.sk = 'akun'; document.body.appendChild(k); k.click(); k.remove(); }
  },

  /* ---------- ubah profil (modal): nama dan foto ---------- */
  ubah() {
    if (Modal.m) return; this.foto = undefined;
    const n = this.nama();
    Modal.buka({ judulId: 'pfJudul', fokus: 'pf_nama', tutupLatar: true, pemicu: this.$('pfAvatar'), simpan: () => this.simpan(),
      html: '<div class="dm-kepala"><div><div class="dm-jenis">Profil</div><h2 class="dm-judul" id="pfJudul">Ubah profil</h2></div><button type="button" class="dm-x" data-pfm="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="dm-isi"><div class="pf-foto" id="pfFotoBox">' + this.avatar('pf-ava pf-raksasa') + '<div class="pf-foto-aksi"><label class="btn" for="pf_file" tabindex="0" role="button" id="pfPilih">Pilih foto</label><input type="file" id="pf_file" accept="image/*" hidden><button type="button" class="btn" data-pfm="hapusfoto"' + (Setelan.get('foto') ? '' : ' hidden') + ' id="pfHapusFoto">Hapus foto</button></div></div>' +
        '<label class="sk-f"><span>Nama panggilan</span><input id="pf_nama" type="text" maxlength="30" autocomplete="nickname" value="' + this.esc(n) + '" placeholder="Misalnya Pak Tani"></label>' +
        '<label class="sk-f"><span>Nama usaha atau kebun (opsional)</span><input id="pf_usaha" type="text" maxlength="40" autocomplete="organization" value="' + this.esc(this.usaha()) + '" placeholder="Misalnya Kebun Sayur Tani Makmur"></label>' +
        '<label class="sk-f"><span>Lokasi: desa atau kabupaten (opsional)</span><input id="pf_lokasi" type="text" maxlength="40" autocomplete="off" value="' + this.esc(this.lokasi()) + '" placeholder="Misalnya Desa Sukamaju"></label>' +
        '<p class="note" style="margin-top:10px">Nama, foto, nama usaha, dan lokasi ikut cadangan, ekspor, dan sinkron cloud (bila Anda masuk), supaya pulih saat ganti perangkat.</p></div>' +
        '<div class="dm-aksi"><button type="button" class="btn gold" data-pfm="simpan">Simpan</button><button type="button" class="btn" data-pfm="tutup" style="width:100%">Batal</button></div>',
      klik: (e) => {
        const b = e.target.closest('[data-pfm]'); if (!b) { if (e.target.closest('#pfPilih')) return; return; }
        const x = b.dataset.pfm;
        if (x === 'tutup') Modal.tutup(); else if (x === 'simpan') this.simpan();
        else if (x === 'hapusfoto') { this.foto = ''; this.pratinjau(); }
      },
      ubah: (e) => { if (e.target.id === 'pf_file' && e.target.files && e.target.files[0]) this.baca(e.target.files[0]); } });
    const l = this.$('pfPilih'); if (l) l.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.$('pf_file').click(); } });
  },
  pratinjau() {
    const f = this.foto === undefined ? Setelan.get('foto') : this.foto, a = this.$('pfFotoBox'); if (!a) return;
    const ava = a.querySelector('.pf-ava'), tmp = document.createElement('div'); const asli = Setelan.get('foto');
    tmp.innerHTML = f ? '<span class="pf-ava pf-raksasa"><img src="' + this.esc(f) + '" alt=""></span>' : (this.awal() ? '<span class="pf-ava pf-raksasa"><b>' + this.esc(this.awal()) + '</b></span>' : this.avatar('pf-ava pf-raksasa').replace(/<img[^>]*>/, ''));
    if (ava) ava.replaceWith(tmp.firstChild);
    const h = this.$('pfHapusFoto'); if (h) h.hidden = !f; void asli;
  },
  /* perkecil foto ke 160×160 (potong tengah) agar ringan disimpan di Setelan */
  baca(file) {
    if (!/^image\//.test(file.type)) { Modal.galat('Pilih berkas gambar.'); return; }
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      try {
        const S = 160, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d'), m = Math.min(img.width, img.height);
        g.fillStyle = '#fff'; g.fillRect(0, 0, S, S); g.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        this.foto = c.toDataURL('image/jpeg', 0.82); this.pratinjau();
      } catch (e) { Modal.galat('Foto tidak bisa dibaca.'); }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); Modal.galat('Foto tidak bisa dibaca.'); };
    img.src = url;
  },
  simpan() {
    const n = (this.$('pf_nama').value || '').replace(/\s+/g, ' ').trim().slice(0, 30), foto = this.foto;
    if (foto !== undefined && foto !== Setelan.get('foto')) Setelan.ubah('foto', foto);
    Setelan.ubah('nama', n);
    Setelan.ubah('usaha', (this.$('pf_usaha').value || '').replace(/\s+/g, ' ').trim().slice(0, 40));
    Setelan.ubah('lokasi', (this.$('pf_lokasi').value || '').replace(/\s+/g, ' ').trim().slice(0, 40));
    Modal.tutup(); App.toast('Profil disimpan'); this.segar();
    if (App.tab === 'beranda') App.judulHal('beranda'); else if (App.tab === 'profil') App.go('profil', true);
  },

  /* ---------- halaman Profil (v0.1.162, Fase 6H; v0.1.165 tanpa duplikat Setelan): kepala, ringkasan usaha, akun dan sinkron, tautan ke Setelan ---------- */
  /* v0.1.164: profil ikut data (cadangan, ekspor, impor, sinkron). Setelan tetap salinan kerja; `data.profil` adalah cerminannya. */
  salin() { try { const p = { nama: this.nama(), foto: String(Setelan.get('foto') || ''), usaha: this.usaha(), lokasi: this.lokasi() }; if (p.nama || p.foto || p.usaha || p.lokasi || App.data.profil) App.data.profil = p; } catch (e) { /* abaikan */ } },
  /* data → Setelan setelah impor, pulih cadangan, atau tarik dari cloud; bidang yang tidak ada di data dibiarkan */
  terap() {
    const p = App.data && App.data.profil; if (!p || typeof p !== 'object' || Array.isArray(p)) return;
    const b = { nama: 30, usaha: 40, lokasi: 40 };
    Object.keys(b).forEach((k) => { if (typeof p[k] === 'string') { const v = p[k].replace(/\s+/g, ' ').trim().slice(0, b[k]); if (v !== String(Setelan.get(k) || '')) Setelan.ubah(k, v); } });
    if (typeof p.foto === 'string' && (p.foto === '' || (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(p.foto) && p.foto.length < 80000)) && p.foto !== String(Setelan.get('foto') || '')) Setelan.ubah('foto', p.foto);
    if (typeof Profil !== 'undefined') this.segar();
  },
  usaha() { return String(Setelan.get('usaha') || '').trim(); },
  lokasi() { return String(Setelan.get('lokasi') || '').trim(); },
  /* ringkasan dihitung dari data yang ada, tanpa input baru */
  hitung() {
    const D = App.data, ada = (a) => (a || []).filter((x) => !x.terhapus), tx = ada(D.transaksi), sk = ada(D.siklus);
    return { tx: tx.length, mulai: tx.map((t) => t.tanggal).filter(Boolean).sort()[0] || '', jalan: sk.filter((x) => x.status === 'berjalan').length, selesai: sk.filter((x) => x.status === 'selesai').length,
      unit: ada(D.unit).filter((x) => !x.arsip).length, kom: ada(D.komoditas).filter((x) => !x.arsip).length, contoh: tx.length > 0 && tx.every((t) => t.contoh) };
  },
  jam(ms) { if (!ms) return 'belum pernah'; const d = new Date(ms), p = (n) => String(n).padStart(2, '0'); return Setelan.tgl(d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); },
  halaman() {
    const H = this.hitung(), n = this.nama(), u = this.usaha(), l = this.lokasi();
    const baris = (t, s, nilai) => '<div class="settings-row baris"><div class="settings-desc"><strong>' + t + '</strong>' + (s ? '<span>' + s + '</span>' : '') + '</div>' + nilai + '</div>';
    const nil = (v) => '<strong class="nilai">' + v + '</strong>';
    const btn = (a, t) => '<button type="button" class="btn" style="flex:0 0 auto" data-pfh="' + a + '">' + t + '</button>';
    return '<section class="pfh-kepala" aria-labelledby="pfhNama">' + this.avatar('pf-ava pf-raksasa') + '<div class="pfh-nm"><h2 id="pfhNama">' + (n ? this.esc(n) : 'Tambahkan nama') + '</h2>' +
        (u ? '<p class="pfh-u">' + this.esc(u) + '</p>' : '') + (l ? '<p class="pfh-l">' + this.esc(l) + '</p>' : '') + (u || l ? '' : '<p class="note">Nama usaha dan lokasi belum diisi.</p>') + '</div>' + btn('ubah', 'Ubah profil') + '</section>' +
      '<section><h2>Ringkasan usaha</h2>' + (H.tx || H.jalan || H.selesai ?
        baris('Mulai mencatat sejak', '', nil(H.mulai ? Setelan.tgl(H.mulai) : '—')) + baris('Siklus', 'Berjalan dan selesai', nil(H.jalan + ' berjalan · ' + H.selesai + ' selesai')) + baris('Unit dan komoditas', '', nil(H.unit + ' unit · ' + H.kom + ' komoditas')) + baris('Transaksi', '', nil(H.tx)) +
        (H.contoh ? '<p class="note">Angka di atas masih berasal dari data contoh.</p>' : '') :
        '<p class="note">Belum ada catatan. Ketuk tombol + untuk mencatat modal atau hasil pertama Anda.</p>') + '</section>' +
      (typeof Sinkron !== 'undefined' ? '<section id="pfhAkun" tabindex="-1">' + Sinkron.html() + '</section>' : '') +
      '<section><h2>Pengaturan</h2><div class="settings-row baris"><div class="settings-desc"><span>Tema, sembunyikan angka, cadangan, impor, versi, dan Panduan cepat ada di Setelan.</span></div>' + btn('setelan', 'Buka Setelan') + '</div></section>';
  },
  klikHal(e) {
    const b = e.target.closest('[data-pfh]'); if (!b || App.tab !== 'profil') return; const a = b.dataset.pfh;
    if (a === 'ubah') this.ubah();
    else if (a === 'akun') { const k = document.createElement('button'); k.dataset.sk = 'akun'; document.body.appendChild(k); k.click(); k.remove(); }
    else if (a === 'setelan') App.go('setelan');
  }
};
