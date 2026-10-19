(function () {
  'use strict';

  var U;

  var I = {
    eye: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    dl: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
    fwd: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    back: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
    file: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    clock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  function q(s, r) { return (r || document).querySelector(s); }
  function qa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function block(v) {
    return U.isFilled(v) ? '<div>' + nl(v) + '</div>'
      : '<div class="empty">' + nl(v || '[Belum tersedia]') + '</div>';
  }
  function field(label, v) {
    return '<div class="field"><span class="field__label">' + label + '</span>' + block(v) + '</div>';
  }
  function cell(v) {
    return '<td' + (U.isFilled(v) ? '' : ' style="color:var(--muted);font-style:italic"') + '>' + nl(v) + '</td>';
  }
  function chip(kategori) {
    return '<span class="chip" style="background:var(--accent-100);border:1px solid color-mix(in srgb,var(--accent) 50%,transparent);color:var(--accent-600)">' + esc(kategori) + '</span>';
  }
  function findMK(slug) {
    for (var i = 0; i < PPG.mataKuliah.length; i++) {
      if (PPG.mataKuliah[i].slug === slug) return PPG.mataKuliah[i];
    }
    return null;
  }
  function semesterMK(n) {
    return PPG.mataKuliah.filter(function (mk) { return (mk.semester || 1) === n; });
  }
  function semChip(n) {
    return '<span class="chip" style="background:var(--soft);border:1px solid var(--line);color:var(--muted)">Semester ' + n + '</span>';
  }

  function upayaCards(box) {
    box.innerHTML = PPG.visi.upaya.map(function (u, i) {
      var n = (i + 1) < 10 ? '0' + (i + 1) : '' + (i + 1);
      var extra = '';
      if (U.isFilled(u.tindakan)) extra += field('Tindakan', u.tindakan);
      if (U.isFilled(u.target)) extra += field('Target', u.target);
      if (U.isFilled(u.indikator)) extra += field('Indikator', u.indikator);
      return '<article class="card reveal"><div class="card__num">' + n + '</div>' +
        '<h3>' + block(u.tujuan).replace(/^<div[^>]*>|<\/div>$/g, '') + '</h3>' +
        extra +
        '</article>';
    }).join('');
  }

  function tigaHal(box) {
    box.innerHTML = PPG.refleksiProgram.tigaHal.map(function (t, i) {
      var n = '0' + (i + 1);
      return '<article class="card reveal"><div class="card__num">' + n + '</div>' + block(t) + '</article>';
    }).join('');
  }

  function indikatorTable(box) {
    var rows = PPG.karyaInovasi.indikator.map(function (r) {
      return '<tr>' + cell(r.indikator) + cell(r.target) + cell(r.bukti) + '</tr>';
    }).join('');
    box.innerHTML = '<div class="table-wrap"><table><caption class="sr-only">Indikator keberhasilan karya inovasi</caption>' +
      '<thead><tr><th scope="col">Indikator</th><th scope="col">Target</th><th scope="col">Bukti</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  function mkCard(mk) {
    return '<article class="card mk-card reveal">' +
      '<div class="mk-card__top">' + chip(mk.kategori) + semChip(mk.semester || 1) + U.statusBadge(mk.pengalaman) + '</div>' +
      '<h3>' + esc(mk.nama) + '</h3>' +
      '<p>' + esc(mk.deskripsi) + '</p>' +
      '<div class="mk-card__footer"><a class="mk-card__link" href="#mk/' + esc(mk.slug) + '">Lihat Refleksi ' + I.fwd + '</a></div>' +
      '</article>';
  }

  function fourC(mk) {
    var items = [
      ['C', 'Connection', 'Hubungan pengalaman belajar dengan pengalaman, pengetahuan, praktik, dan peran sebagai calon guru.', mk.connection],
      ['C', 'Challenge', 'Tantangan, kesenjangan, atau hal yang berbeda dari praktik sebelumnya.', mk.challenge],
      ['C', 'Concept', 'Konsep utama yang dipelajari, makna, dan relevansinya.', mk.concept],
      ['C', 'Change', 'Perubahan pola pikir, sikap, atau praktik yang akan dilakukan.', mk.change]
    ];
    return '<div class="four-c">' + items.map(function (it) {
      return '<div class="c-card"><span class="c-card__letter">' + it[0] + '</span>' +
        '<h3>' + it[1] + '</h3><p class="c-card__q">' + it[2] + '</p>' + block(it[3]) + '</div>';
    }).join('') + '</div>';
  }

  function artefakBlock(a) {
    if (!a) return '';
    var files = a.files && a.files.length ? a.files : (a.file ? [a] : []);
    var list = files.map(function (x) {
      var action = U.isFilled(x.file)
        ? '<button class="btn btn--navy btn--sm" type="button" data-open-media="' + esc(x.file) + '" data-media-label="' + esc(x.nama || 'Artefak') + '">' + I.eye + ' Lihat Artefak</button>'
        : '<span class="wait">' + I.clock + ' Artefak akan ditambahkan setelah dokumen tersedia.</span>';
      return '<div class="artefak-file">' +
        (x.nama ? '<span class="artefak-file__name">' + esc(x.nama) + '</span>' : '') +
        '<div>' + action + '</div></div>';
    }).join('');
    if (!list) list = '<span class="wait">' + I.clock + ' Artefak akan ditambahkan setelah dokumen tersedia.</span>';
    var nameField = a.nama && !a.files ? field('Artefak', a.nama) : '';
    return '<div class="section-block">' + nameField + field('Alasan pemilihan', a.alasan) +
      field('Bagian yang mendukung refleksi', a.bagian) +
      '<div class="artefak-list">' + list + '</div></div>';
  }

  function mkDetail(mk) {
    var list = semesterMK(mk.semester || 1);
    var idx = list.indexOf(mk);
    var prev = list[(idx - 1 + list.length) % list.length];
    var next = list[(idx + 1) % list.length];
    return '<div class="detail-head">' +
      '<div><a class="btn btn--outline btn--sm" href="#list">' + I.back + ' Kembali ke daftar</a></div>' +
      '<div class="mk-card__tags">' + chip(mk.kategori) + semChip(mk.semester || 1) + U.statusBadge(mk.pengalaman) + '</div>' +
      '<h2>' + esc(mk.nama) + '</h2><p class="lead">' + esc(mk.deskripsi) + '</p></div>' +
      '<div class="stack">' +
      '<section class="card section-block reveal"><h3>Pengalaman Belajar yang Dipilih</h3>' + block(mk.pengalaman) + '</section>' +
      '<section class="card section-block reveal"><h3>Mengapa Pengalaman Ini Bermakna?</h3>' + block(mk.mengapa) + '</section>' +
      '<section class="section-block reveal"><div class="section-head" style="margin-bottom:0"><span class="eyebrow">Model Refleksi 4C</span>' +
      '<h3>Connection &middot; Challenge &middot; Concept &middot; Change</h3></div>' + fourC(mk) + '</section>' +
      '<section class="card section-block reveal"><h3>Artefak Pembelajaran</h3>' + artefakBlock(mk.artefak) + '</section>' +
      '</div>' +
      '<div class="detail-nav">' +
      '<a class="btn btn--outline" href="#mk/' + esc(prev.slug) + '">' + I.back + ' ' + esc(prev.nama) + '</a>' +
      '<a class="btn btn--outline" href="#mk/' + esc(next.slug) + '">' + esc(next.nama) + ' ' + I.fwd + '</a></div>';
  }

  function initRefleksi() {
    var listBox = q('[data-mk-list]');
    var detailBox = q('[data-mk-detail]');
    var listView = q('[data-mk-view="list"]');
    var detailView = q('[data-mk-view="detail"]');
    var tabsBox = q('[data-mk-tabs]');
    var aktif = 1;
    function renderList() {
      listBox.innerHTML = semesterMK(aktif).map(mkCard).join('');
      U.observeReveal(listBox);
    }
    renderList();
    if (tabsBox) {
      tabsBox.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('[data-semester]') : null;
        if (!btn) return;
        var next = parseInt(btn.getAttribute('data-semester'), 10);
        if (next === aktif) return;
        aktif = next;
        Array.prototype.forEach.call(tabsBox.querySelectorAll('[data-semester]'), function (b) {
          var on = parseInt(b.getAttribute('data-semester'), 10) === aktif;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        renderList();
      });
    }
    function route() {
      var m = /^#mk\/(.+)$/.exec(location.hash);
      if (m && findMK(m[1])) {
        detailBox.innerHTML = mkDetail(findMK(m[1]));
        listView.hidden = true;
        detailView.hidden = false;
        var top = detailView.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: top > 0 ? top : 0, behavior: 'smooth' });
      } else {
        listView.hidden = false;
        detailView.hidden = true;
      }
      U.observeReveal(document);
    }
    window.addEventListener('hashchange', route);
    route();
  }

  function galItem(it) {
    var has = U.isFilled(it.file);
    var ext = has ? String(it.file).split('.').pop().toLowerCase() : '';
    var isImg = has && ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].indexOf(ext) >= 0;
    var media = isImg
      ? '<img src="' + esc(it.file) + '" alt="' + esc(it.nama) + '" loading="lazy">'
      : '<div class="gal-ph">' + I.file + '<span>' + (has ? 'Dokumen siap dibuka' : 'Artefak akan ditambahkan setelah dokumen tersedia.') + '</span></div>';
    var actions = has
      ? '<button class="btn btn--navy btn--sm" type="button" data-open-media="' + esc(it.file) + '" data-media-label="' + esc(it.nama) + '">' + I.eye + ' Lihat</button>' +
        '<a class="btn btn--outline btn--sm" href="' + esc(it.file) + '" download>' + I.dl + ' Unduh</a>'
      : '<span class="wait">' + I.clock + ' Belum tersedia</span>';
    return '<article class="card gal-item reveal">' +
      '<div class="gal-image"' + (has ? ' data-open-media="' + esc(it.file) + '" data-media-label="' + esc(it.nama) + '"' : '') + '>' + media + '</div>' +
      '<h3>' + esc(it.nama) + '</h3><p>' + esc(it.deskripsi) + '</p>' +
      field('Hubungan dengan refleksi', it.hubungan) +
      '<div class="gal-item__actions">' + actions + '</div></article>';
  }

  function galleryAll(box) {
    box.innerHTML = PPG.artefak.kategori.map(function (kat) {
      return '<div class="section-block reveal" style="gap:18px">' +
        '<div class="section-head" style="margin-bottom:0"><span class="eyebrow">Kategori</span><h2>' + esc(kat.nama) + '</h2><p class="lead">' + esc(kat.deskripsi) + '</p></div>' +
        '<div class="gallery">' + kat.items.map(galItem).join('') + '</div></div>';
    }).join('<div style="height:38px"></div>');
  }

  function dokItem(it) {
    var files = it.files && it.files.length ? it.files : (it.file ? [it.file] : []);
    var has = files.length > 0;
    var grid = has
      ? '<div class="dok-grid">' + files.map(function (f, i) {
        var ext = String(f).split('.').pop().toLowerCase();
        var isImg = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].indexOf(ext) >= 0;
        return '<div class="gal-thumb" data-open-media="' + esc(f) + '" data-media-label="' + esc(it.nama + ' (' + (i + 1) + ')') + '">' +
          (isImg ? '<img src="' + esc(f) + '" alt="' + esc(it.nama + ' ' + (i + 1)) + '" loading="lazy">' : '<div class="gal-ph">' + I.file + '<span>Dokumen siap dibuka</span></div>') +
          '</div>';
      }).join('') + '</div>'
      : '<div class="gal-image"><div class="gal-ph">' + I.file + '<span>Belum tersedia</span></div></div>';
    return '<div class="dok-item">' +
      '<div class="dok-item__head"><h3>' + esc(it.nama) + '</h3>' +
      '<p class="lead">' + esc(it.deskripsi) + '</p>' + field('Hubungan dengan refleksi', it.hubungan) +
      (has ? '<span class="gal-count">' + files.length + ' foto</span>' : '') + '</div>' +
      grid + '</div>';
  }

  function dokGallery(box) {
    box.innerHTML = PPG.dokumentasi.map(function (kat) {
      return '<div class="section-block dok-cat reveal" style="gap:16px">' +
        '<div class="section-head" style="margin-bottom:0"><span class="eyebrow">Kategori</span><h2>' + esc(kat.nama) + '</h2><p class="lead">' + esc(kat.deskripsi) + '</p></div>' +
        '<div class="dok-items">' + kat.items.map(dokItem).join('') + '</div></div>';
    }).join('<div style="height:48px"></div>');
  }

  function videoList(box) {
    var items = PPG.video || [];
    box.innerHTML = items.length ? items.map(function (v, i) {
      return '<div class="video-card" data-idx="' + i + '">' +
        '<h3>' + esc(v.judul) + '</h3>' +
        '<video controls preload="metadata" src="' + esc(v.file) + '"></video>' +
        '</div>';
    }).join('') : '<p class="wait">Video belum tersedia.</p>';
  }

  function initDokTabs() {
    var nav = q('[data-dok-tabs]');
    if (!nav) return;
    function show(name) {
      qa('[data-dok-tab]').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-dok-tab') === name);
      });
      qa('[data-dok-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-dok-panel') !== name;
      });
    }
    nav.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-dok-tab]') : null;
      if (b) show(b.getAttribute('data-dok-tab'));
    });
    show('foto');
  }

  function initVideo() {
    qa('.video-wrap').forEach(function (wrap) {
      var fr = wrap.querySelector('iframe');
      if (!fr || fr.hasAttribute('src')) return;
      function start() { fr.setAttribute('src', fr.getAttribute('data-src')); }
      if (typeof IntersectionObserver !== 'function') { start(); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); start(); } });
      }, { threshold: 0.4 });
      io.observe(wrap);
    });
  }

  function run() {
    U = window.UI;
    if (!U || typeof PPG === 'undefined') return;
    if (q('[data-mk-list]')) initRefleksi();
    qa('[data-upaya]').forEach(upayaCards);
    qa('[data-tigahal]').forEach(tigaHal);
    qa('[data-indikator]').forEach(indikatorTable);
    qa('[data-gallery]').forEach(galleryAll);
    qa('[data-dokumentasi]').forEach(dokGallery);
    qa('[data-dok-videos]').forEach(videoList);
    initDokTabs();
    initVideo();
    U.observeReveal(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();