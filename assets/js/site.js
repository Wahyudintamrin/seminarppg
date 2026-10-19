(function () {
  'use strict';

  var NAV = [
    { id: 'beranda', href: 'index.html', label: 'Beranda' },
    { id: 'tentang', href: 'tentang.html', label: 'Profil' },
    { id: 'identifikasi', href: 'identifikasi-diri.html', label: 'Identifikasi Diri' },
    { id: 'refleksi', href: 'refleksi-mata-kuliah.html', label: 'Refleksi MK' },
    { id: 'program', href: 'refleksi-program-ppg.html', label: 'Refleksi PPG' },
    { id: 'karya', href: 'karya-inovasi.html', label: 'Karya Inovasi' },
    { id: 'artefak', href: 'artefak-dokumentasi.html', label: 'Artefak' },
    { id: 'dokumentasi', href: 'dokumentasi.html', label: 'Dokumentasi' },
    { id: 'penutup', href: 'refleksi-penutup.html', label: 'Penutup' }
  ];

  var LOGO =
    '<img src="assets/img/profil.JPG" alt="Foto profil Wahyudin">';

  function buildHeader(active) {
    var items = NAV.map(function (n) {
      var cur = n.id === active ? ' aria-current="page"' : '';
      return '<li><a href="' + n.href + '"' + cur + '>' + n.label + '</a></li>';
    }).join('');
    var el = document.createElement('header');
    el.className = 'site-header';
    el.innerHTML =
      '<div class="container header__inner">' +
      '<a class="brand" href="index.html" aria-label="e-Portfolio Wahyudin">' +
      '<span class="brand__mark">' + LOGO + '</span>' +
      '<span class="brand__text"><b>e-Portfolio</b><small>Wahyudin</small></span></a>' +
      '<nav class="nav" data-nav aria-label="Navigasi utama"><ul class="nav__list">' + items + '</ul></nav>' +
      '<div class="header__tools">' +
      '<button class="icon-btn" data-theme-toggle type="button" aria-label="Ubah mode terang/gelap"></button>' +
      '<button class="icon-btn nav-toggle" data-nav-toggle type="button" aria-label="Buka menu" aria-expanded="false"></button>' +
      '</div></div>';
    document.body.insertBefore(el, document.body.firstChild);
    var fix = document.createElement('div');
    fix.className = 'header-fix';
    fix.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(fix, el.nextSibling);
  }

  function buildFooter() {
    var links = NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + '</a></li>'; }).join('');
    var el = document.createElement('footer');
    el.className = 'site-footer';
    el.innerHTML =
      '<div class="container footer__grid">' +
      '<div class="footer"><a class="brand" href="index.html"><span class="brand__mark">' + LOGO + '</span>' +
      '<span class="brand__text" style="color:#fff"><b>e-Portfolio</b><small>Wahyudin</small></span></a>' +
      '<p style="margin-top:14px;font-size:.92rem;color:rgba(255,255,255,.7);max-width:44ch">Portofolio digital perjalanan reflektif calon guru PPG Calon Guru Universitas Negeri Makassar, Program Studi Teknik Otomotif.</p></div>' +
      '<div class="footer"><h4>Navigasi</h4><ul>' + links + '</ul></div>' +
      '<div class="footer"><h4>Informasi</h4><ul>' +
      '<li>PPG Calon Guru &middot; Teknik Otomotif</li>' +
      '<li>Universitas Negeri Makassar</li>' +
      '<li>PPL Mandiri &middot; SMKN 3 Makassar</li>' +
      '<li>Bidang: Teknik Kendaraan Ringan</li>' +
      '</ul></div>' +
      '<div class="footer"><h4>Kontak</h4><ul class="footer-contact">' +
      '<li><span class="footer-contact__addr">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
      'Dusun Balocci, Benteng Gajah,<br>Tompobulu, Maros</span></li>' +
      '<li><a href="https://www.wahyudintamrin.com" target="_blank" rel="noopener">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
      'www.wahyudintamrin.com</a></li>' +
      '<li><a href="mailto:wahyudintamrin@gmail.com">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>' +
      'wahyudintamrin@gmail.com</a></li>' +
      '<li><a href="https://wa.me/6285299557045" target="_blank" rel="noopener">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.7-4.9a8 8 0 1 1 3.2 3.2L3 21z"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>' +
      '+62 852 9955 7045</a></li>' +
      '</ul></div></div>' +
      '<div class="container footer__bottom"><span>&copy; <span data-year></span> Wahyudin &mdash; Portofolio Digital Seminar PPG.</span>' +
      '<span>Disusun untuk memenuhi luaran mata kuliah Seminar Pendidikan Profesi Guru.</span></div>';
    document.body.appendChild(el);
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  }

  function resolve(path, obj) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function fill() {
    if (typeof PPG === 'undefined' || !window.UI) return;
    Array.prototype.slice.call(document.querySelectorAll('[data-write]')).forEach(function (el) {
      var v = resolve(el.getAttribute('data-write'), PPG);
      window.UI.writeText(el, v);
    });
  }

  function run() {
    buildHeader(document.body.getAttribute('data-page') || '');
    buildFooter();
    fill();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();