(function () {
  'use strict';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  var IC = {
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    clock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    dl: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
    open: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    fwd: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    back: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
    closeX: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    up: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    sun: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>'
  };

  function isFilled(v) {
    if (typeof v !== 'string') return false;
    var t = v.trim();
    if (t === '') return false;
    if (t.charAt(0) === '[' && t.charAt(t.length - 1) === ']') return false;
    return true;
  }

  function writeText(el, v) {
    if (!el) return;
    var filled = isFilled(v);
    el.classList.toggle('empty', !filled);
    el.textContent = filled ? v : (typeof v === 'string' && v.trim() !== '' ? v : '[Belum tersedia - lengkapi berdasarkan pengalaman Anda]');
  }

  function statusBadge(v) {
    return isFilled(v)
      ? '<span class="ready">' + IC.check + ' Sudah diisi</span>'
      : '<span class="wait">' + IC.clock + ' Belum tersedia</span>';
  }

  function fileName(p) {
    var parts = String(p).split('/');
    return parts[parts.length - 1];
  }

  function buildModal() {
    if ($('.modal')) return;
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('hidden', '');
    var panel = '<div class="modal__backdrop" data-close></div>' +
      '<div class="modal__panel" role="dialog" aria-modal="true">' +
      '<div class="modal__head"><b data-mtitle></b><button class="modal__close" data-close aria-label="Tutup">' + IC.closeX + '</button></div>' +
      '<div class="modal__body" data-mbody></div></div>';
    modal.innerHTML = panel;
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function closeModal() {
    var m = $('.modal');
    if (m) m.setAttribute('hidden', '');
  }

  function openMedia(src, label) {
    if (!src) return;
    buildModal();
    var body = $('[data-mbody]');
    $('[data-mtitle]').textContent = label || fileName(src) || 'Pratinjau';
    var ext = String(src).split('.').pop().toLowerCase();
    var view = '';
    var isImg = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].indexOf(ext) >= 0;
    if (ext === 'pdf') {
      view = '<iframe src="' + src + '" title="' + label + '"></iframe>' +
        '<p style="margin-top:10px;font-size:.85rem;color:var(--muted)">Jika pratinjau tidak tampil di peramban, gunakan tombol unduh.</p>';
    } else if (isImg) {
      view = '<img src="' + src + '" alt="' + label + '" style="max-height:74vh;width:100%;height:auto;object-fit:contain;margin:auto;display:block;border-radius:10px">';
    } else {
      view = '<div class="alert"><div style="flex:1"><b>Pratinjau tidak tersedia untuk format ini</b><p style="margin-top:4px">Silakan unduh file untuk melihatnya.</p></div></div>';
    }
    body.innerHTML = '<div class="modal__meta"><a class="btn btn--navy btn--sm" href="' + src + '" download>' + IC.dl + ' Unduh File</a></div>' +
      '<div style="margin-top:12px">' + view + '</div>';
    $('.modal').removeAttribute('hidden');
  }

  function bindOpenMedia(root) {
    (root || document).addEventListener('click', function (e) {
      var t = e.target.closest('[data-open-media]');
      if (!t) return;
      e.preventDefault();
      openMedia(t.getAttribute('data-open-media'), t.getAttribute('data-media-label') || '');
    });
  }

  function initHeader() {
    var toggle = $('[data-nav-toggle]');
    var nav = $('[data-nav]');
    if (!toggle || !nav) return;
    toggle.innerHTML = IC.menu;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.innerHTML = open ? IC.closeX : IC.menu;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.innerHTML = IC.menu;
      }
    });
  }

  function initTheme() {
    var btn = $('[data-theme-toggle]');
    var stored = null;
    try { stored = localStorage.getItem('ppg-theme'); } catch (e) {}
    var pref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var apply = function (t) {
      document.documentElement.setAttribute('data-theme', t);
      if (btn) btn.innerHTML = t === 'dark' ? IC.sun : IC.moon;
    };
    apply(stored || pref);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('ppg-theme', next); } catch (e) {}
      apply(next);
    });
  }

  function initScrollFx() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    var top = document.createElement('button');
    top.className = 'back-top';
    top.setAttribute('aria-label', 'Kembali ke atas');
    top.innerHTML = IC.up;
    document.body.appendChild(top);
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var styles = window.getComputedStyle(document.documentElement);
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        var p = max > 0 ? (window.pageYOffset || document.body.scrollTop) / max : 0;
        bar.style.width = Math.round(p * 100) + '%';
        if (document.body.scrollTop > 400 || (h.scrollTop || 0) > 400) {
          top.classList.add('show');
        } else {
          top.classList.remove('show');
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var revealIO = null;
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { revealIO.observe(el); });
  }

  function observeReveal(root) {
    var els = $$('.reveal', root);
    els.forEach(function (el) {
      if (!el.classList.contains('is-visible')) {
        if (revealIO) { revealIO.observe(el); } else { el.classList.add('is-visible'); }
      }
    });
  }

  function run() {
    bindOpenMedia(document);
    initHeader();
    initTheme();
    initScrollFx();
    initReveal();
  }

  window.UI = {
    $: $, $$: $$, IC: IC,
    isFilled: isFilled,
    writeText: writeText,
    statusBadge: statusBadge,
    fileName: fileName,
    openMedia: openMedia,
    observeReveal: observeReveal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();