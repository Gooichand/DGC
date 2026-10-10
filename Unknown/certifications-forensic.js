/* ==========================================================================
   CERTIFICATIONS — Forensic 3D Showcase engine
   Builds a cinematic dark glassmorphism certification display with 3D cards
   and a premium "View All" modal carousel. Reuses the CERTIFICATES data and
   openCertModal() from interactive-certifications.js.
   ========================================================================== */
(function () {
  'use strict';

  var FEATURED_COUNT = 5;

  function getCerts() {
    if (typeof CERTIFICATES !== 'undefined' && Array.isArray(CERTIFICATES)) return CERTIFICATES;
    return [];
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function prefReduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function isCoarseTouch() {
    return !!(window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) ||
      window.innerWidth <= 860;
  }

  function openModal(src) {
    if (typeof window.openCertModal === 'function') { window.openCertModal(src); return; }
    if (typeof openCertModal === 'function') { openCertModal(src); return; }
  }

  var CHECK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  /* ============================================================== BUILD */
  function build() {
    var root = document.getElementById('forensicCerts');
    if (!root || root.dataset.fcReady === 'true') return;
    root.dataset.fcReady = 'true';

    var certs = getCerts();
    if (!certs.length) return;

    var featured = certs.slice(0, FEATURED_COUNT);
    var coarse = isCoarseTouch();
    var reduce = prefReduced();

    /* ---------- Heading ---------- */
    var header = document.createElement('div');
    header.className = 'forensic-certs__header';
    header.innerHTML =
      '<div class="forensic-certs__eyebrow">MY CERTIFICATIONS</div>' +
      '<h2 class="forensic-certs__title"><span>CERTIFICATIONS</span></h2>' +
      '<p class="forensic-certs__desc">Explore my certified skills and professional achievements in cybersecurity, ' +
      'digital forensics, and technology. Each certification represents my commitment to continuous learning ' +
      'and expertise in cutting-edge security technologies.</p>';
    root.appendChild(header);

    /* ---------- 3D stage ---------- */
    var stage = document.createElement('div');
    stage.className = 'forensic-certs__stage';

    /* ---------- Preview lightbox (mounted on body) ---------- */
    var preview = buildPreview(certs);
    document.body.appendChild(preview.el);

    var positions = ['far-left', 'left', 'center', 'right', 'far-right'];
    featured.forEach(function (cert, i) {
      stage.appendChild(buildFeaturedCard(cert, positions[i] || 'center', i, coarse, reduce, preview));
    });

    root.appendChild(stage);

    /* ---------- View All button ---------- */
    var actions = document.createElement('div');
    actions.className = 'forensic-certs__actions';

    var viewAllBtn = document.createElement('button');
    viewAllBtn.className = 'fc-view-all';
    viewAllBtn.id = 'fcViewAll';
    viewAllBtn.type = 'button';
    viewAllBtn.setAttribute('aria-haspopup', 'dialog');
    viewAllBtn.setAttribute('aria-controls', 'fcCarouselModal');
    viewAllBtn.innerHTML =
      '<span class="fc-view-all__icon"><i class="fas fa-layer-group"></i></span>' +
      '<span class="fc-view-all__text">View All Certifications</span>' +
      '<span class="fc-view-all__arrow"><i class="fas fa-arrow-right"></i></span>';

    actions.appendChild(viewAllBtn);
    root.appendChild(actions);

    /* ---------- Carousel modal (all certs) — mounted on body ---------- */
    var carousel = buildCarousel(certs, preview);
    document.body.appendChild(carousel.el);

    viewAllBtn.addEventListener('click', function () { carousel.open(); });

    /* ---------- Stage focus dimming ---------- */
    stage.addEventListener('pointerover', function (e) {
      if (e.target.closest('.fc-card')) stage.classList.add('has-focus');
    });
    stage.addEventListener('pointerleave', function () {
      stage.classList.remove('has-focus');
    });
  }

  /* ====================================================== FEATURED CARD */
  function buildFeaturedCard(cert, pos, index, coarse, reduce, preview) {
    var card = document.createElement('article');
    card.className = 'fc-card';
    card.setAttribute('data-pos', pos);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    var body = document.createElement('div');
    body.className = 'fc-card__body';

    var content = document.createElement('div');
    content.className = 'fc-card__content';

    /* HUD bar — status only, no index number */
    var hudBar = document.createElement('div');
    hudBar.className = 'fc-card__hud';
    hudBar.setAttribute('aria-hidden', 'true');
    hudBar.innerHTML = '<span class="fc-card__hud-line"></span><span class="fc-card__hud-dot"></span>';
    content.appendChild(hudBar);

    /* Certificate sheet */
    var sheet = document.createElement('div');
    sheet.className = 'fc-card__sheet';
    var img = document.createElement('img');
    img.src = cert.src;
    img.alt = cert.title;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (cert.width) img.width = cert.width;
    if (cert.height) img.height = cert.height;
    sheet.appendChild(img);
    content.appendChild(sheet);

    /* Info */
    var info = document.createElement('div');
    info.className = 'fc-card__info';
    info.innerHTML =
      '<h3 class="fc-card__title">' + escapeHtml(cert.title) + '</h3>' +
      '<p class="fc-card__provider">' + escapeHtml(cert.org || '') + '</p>' +
      '<div class="fc-card__foot">' +
        '<span class="fc-card__year">' + escapeHtml(cert.year || '') + '</span>' +
        '<span class="fc-card__verified">' + CHECK_ICON + 'Verified</span>' +
      '</div>';
    content.appendChild(info);

    body.appendChild(content);
    card.appendChild(body);

    /* Glowing platform + contact shadow */
    var shadow = document.createElement('div');
    shadow.className = 'fc-card__shadow';
    shadow.setAttribute('aria-hidden', 'true');
    card.appendChild(shadow);

    var platform = document.createElement('div');
    platform.className = 'fc-card__platform';
    platform.setAttribute('aria-hidden', 'true');
    platform.innerHTML =
      '<span class="fc-card__ring fc-card__ring--1"></span>' +
      '<span class="fc-card__ring fc-card__ring--2"></span>' +
      '<span class="fc-card__ring fc-card__ring--3"></span>';
    card.appendChild(platform);

    /* Interactions */
    card.addEventListener('click', function () { preview.open(index); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        preview.open(index);
      }
    });

    /* Cursor-reactive micro tilt — desktop, non-reduced-motion only.
       Applied on the body (not the card) so the CSS hover transform on the
       card itself stays the single source of truth for every position. */
    if (!coarse && !reduce) {
      card.addEventListener('pointermove', function (e) {
        var rect = body.getBoundingClientRect();
        if (!rect.width) return;
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        body.style.transform =
          'rotateY(' + (x * 5).toFixed(2) + 'deg) rotateX(' + (-y * 3).toFixed(2) + 'deg)';
      });
      card.addEventListener('pointerleave', function () {
        body.style.transform = '';
      });
    }

    return card;
  }

  /* ========================================================== CAROUSEL */
  function buildCarousel(certs, preview) {
    var modal = document.createElement('div');
    modal.className = 'fc-modal';
    modal.id = 'fcCarouselModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'All certifications');

    var box = document.createElement('div');
    box.className = 'fc-modal__box';

    /* Header */
    var head = document.createElement('div');
    head.className = 'fc-modal__head';
    head.innerHTML =
      '<div class="fc-modal__heading">' +
        '<span class="fc-modal__kicker">EVIDENCE VAULT</span>' +
        '<h3 class="fc-modal__title">All <span>Certifications</span></h3>' +
      '</div>' +
      '<span class="fc-modal__count">' + certs.length + ' CREDENTIALS</span>';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'fc-modal__close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close certifications');
    closeBtn.innerHTML = '<i class="fas fa-xmark"></i>';
    head.appendChild(closeBtn);
    box.appendChild(head);

    /* Viewport + track */
    var viewport = document.createElement('div');
    viewport.className = 'fc-modal__viewport';

    var track = document.createElement('div');
    track.className = 'fc-modal__track';
    track.setAttribute('tabindex', '0');
    track.setAttribute('role', 'list');

    certs.forEach(function (cert, i) {
      track.appendChild(buildCarouselCard(cert, i, close, preview));
    });
    viewport.appendChild(track);

    var prev = document.createElement('button');
    prev.className = 'fcm-arrow fcm-arrow--prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous certifications');
    prev.innerHTML = '<i class="fas fa-chevron-left"></i>';

    var next = document.createElement('button');
    next.className = 'fcm-arrow fcm-arrow--next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next certifications');
    next.innerHTML = '<i class="fas fa-chevron-right"></i>';

    viewport.appendChild(prev);
    viewport.appendChild(next);
    box.appendChild(viewport);

    /* Progress */
    var progress = document.createElement('div');
    progress.className = 'fc-modal__progress';
    var bar = document.createElement('div');
    bar.className = 'fc-modal__progress-bar';
    progress.appendChild(bar);
    box.appendChild(progress);

    /* Hint */
    var hint = document.createElement('div');
    hint.className = 'fc-modal__hint';
    hint.innerHTML = 'Scroll or use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> &middot; Click a card to open';
    box.appendChild(hint);

    modal.appendChild(box);

    /* -------------------------------------------------- carousel logic */
    function step() {
      if (!track.children.length) return 1;
      var first = track.children[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return first + gap;
    }

    function updateArrows() {
      var maxScroll = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll - 2;

      if (maxScroll <= 2) {
        bar.style.width = '100%';
        bar.style.transform = 'translateX(0)';
        return;
      }

      var ratio = Math.min(1, track.clientWidth / Math.max(1, track.scrollWidth));
      var thumb = Math.max(14, ratio * 100);
      var pos = track.scrollLeft / maxScroll;
      bar.style.width = thumb + '%';
      /* translateX % resolves against the thumb's own width */
      bar.style.transform = 'translateX(' + (pos * (100 - thumb) / thumb * 100).toFixed(2) + '%)';
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -step() * 2, behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: step() * 2, behavior: 'smooth' });
    });

    var rafPending = false;
    track.addEventListener('scroll', function () {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () { rafPending = false; updateArrows(); });
    }, { passive: true });

    window.addEventListener('resize', function () { if (modal.classList.contains('is-open')) updateArrows(); });

    /* ------------------------------------------------ open / close */
    var lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      lockScroll(true);
      track.scrollLeft = 0;
      updateArrows();
      requestAnimationFrame(function () { closeBtn.focus(); });
    }

    function close(skipFocus) {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      lockScroll(false);
      if (!skipFocus && lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    var prevBodyPad = '';
    function lockScroll(on) {
      if (on) {
        var sw = window.innerWidth - document.documentElement.clientWidth;
        prevBodyPad = document.body.style.paddingRight;
        if (sw > 0) document.body.style.paddingRight = sw + 'px';
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = prevBodyPad;
      }
    }

    closeBtn.addEventListener('click', close);
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) close(); });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });

    /* Focus trap */
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = box.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    return { el: modal, open: open, close: close };
  }

  function buildCarouselCard(cert, index, onActivate, preview) {
    var card = document.createElement('div');
    card.className = 'fcm-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');

    var sheet = document.createElement('div');
    sheet.className = 'fcm-card__sheet';
    var img = document.createElement('img');
    img.src = cert.src;
    img.alt = cert.title;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (cert.width) img.width = cert.width;
    if (cert.height) img.height = cert.height;
    sheet.appendChild(img);
    card.appendChild(sheet);

    var body = document.createElement('div');
    body.className = 'fcm-card__body';
    body.innerHTML =
      '<h4 class="fcm-card__title">' + escapeHtml(cert.title) + '</h4>' +
      '<div class="fcm-card__meta">' +
        '<span class="fcm-card__org">' + escapeHtml(cert.org || '') + '</span>' +
        '<span class="fcm-card__year">' + escapeHtml(cert.year || '') + '</span>' +
      '</div>';
    card.appendChild(body);

    function activate() {
      if (typeof onActivate === 'function') onActivate(true);
      if (preview) preview.open(index); else openModal(cert.src);
    }

    card.addEventListener('click', activate);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });

    return card;
  }

  /* =========================================================== PREVIEW */
  function buildPreview(certs) {
    var modal = document.createElement('div');
    modal.className = 'fc-preview';
    modal.id = 'fcPreview';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Certificate preview');

    var box = document.createElement('div');
    box.className = 'fc-preview__box';

    var frame = document.createElement('div');
    frame.className = 'fc-preview__frame';

    var stage = document.createElement('div');
    stage.className = 'fc-preview__stage';

    var img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    stage.appendChild(img);

    var loader = document.createElement('div');
    loader.className = 'fc-preview__loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML =
      '<span class="fc-preview__loader-ring"></span>' +
      '<span class="fc-preview__loader-text">DECODING EVIDENCE</span>';
    stage.appendChild(loader);

    var mode = document.createElement('div');
    mode.className = 'fc-preview__mode';
    mode.setAttribute('aria-hidden', 'true');
    mode.textContent = '1:1 INSPECT — CLICK TO FIT';
    stage.appendChild(mode);

    ['tl', 'tr', 'bl', 'br'].forEach(function (c) {
      var b = document.createElement('span');
      b.className = 'fc-preview__bracket fc-preview__bracket--' + c;
      b.setAttribute('aria-hidden', 'true');
      stage.appendChild(b);
    });

    frame.appendChild(stage);
    box.appendChild(frame);

    var meta = document.createElement('div');
    meta.className = 'fc-preview__meta';
    meta.innerHTML =
      '<div class="fc-preview__text">' +
        '<h3 class="fc-preview__title"></h3>' +
        '<span class="fc-preview__org"></span>' +
      '</div>' +
      '<div class="fc-preview__tags">' +
        '<span class="fc-preview__tag fc-preview__tag--year"></span>' +
        '<span class="fc-preview__tag fc-preview__tag--muted fc-preview__tag--index"></span>' +
      '</div>';
    box.appendChild(meta);

    var prev = document.createElement('button');
    prev.className = 'fc-preview__side fc-preview__side--prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous certificate');
    prev.innerHTML = '<i class="fas fa-chevron-left"></i>';

    var next = document.createElement('button');
    next.className = 'fc-preview__side fc-preview__side--next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next certificate');
    next.innerHTML = '<i class="fas fa-chevron-right"></i>';

    box.appendChild(prev);
    box.appendChild(next);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'fc-preview__close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close preview');
    closeBtn.innerHTML = '<i class="fas fa-xmark"></i>';
    box.appendChild(closeBtn);

    var hint = document.createElement('div');
    hint.className = 'fc-preview__hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = '<kbd>&larr;</kbd> <kbd>&rarr;</kbd> browse &middot; <b>CLICK IMAGE</b> to zoom &middot; <kbd>ESC</kbd> close';
    box.appendChild(hint);

    modal.appendChild(box);

    var titleEl = meta.querySelector('.fc-preview__title');
    var orgEl = meta.querySelector('.fc-preview__org');
    var yearEl = meta.querySelector('.fc-preview__tag--year');
    var indexEl = meta.querySelector('.fc-preview__tag--index');

    var current = 0;
    var lastFocused = null;
    var prevBodyOverflow = '';
    var zoomed = false;
    var loadToken = 0;

    function markLoaded() {
      img.classList.add('is-loaded');
      stage.classList.add('is-loaded');
      stage.classList.remove('is-error');
    }

    function markError() {
      img.classList.add('is-loaded');
      stage.classList.add('is-loaded', 'is-error');
      loader.querySelector('.fc-preview__loader-text').textContent = 'EVIDENCE FILE UNAVAILABLE';
      loader.querySelector('.fc-preview__loader-ring').style.display = 'none';
    }

    function setZoom(on) {
      zoomed = !!on;
      stage.classList.toggle('is-zoomed', zoomed);
      if (zoomed) stage.scrollTop = 0;
    }

    function show(i) {
      current = ((i % certs.length) + certs.length) % certs.length;
      var cert = certs[current];
      var token = ++loadToken;

      titleEl.textContent = cert.title || '';
      orgEl.textContent = cert.org || '';
      yearEl.textContent = cert.year || '';
      indexEl.textContent = String(current + 1).padStart(2, '0') + ' / ' + certs.length;

      setZoom(false);

      img.classList.remove('is-loaded');
      stage.classList.remove('is-loaded', 'is-error');
      loader.querySelector('.fc-preview__loader-ring').style.display = '';
      loader.querySelector('.fc-preview__loader-text').textContent = 'DECODING EVIDENCE';

      img.alt = cert.title || 'Certificate';
      if (cert.width) img.width = cert.width;
      if (cert.height) img.height = cert.height;
      img.src = cert.src;

      /* Cached images can finish before the load event is dispatched */
      if (img.complete && img.naturalWidth > 0) {
        if (token === loadToken) markLoaded();
      } else {
        img.loading = 'eager';
      }

      prev.disabled = false;
      next.disabled = false;
    }

    img.addEventListener('load', function () {
      if (img.naturalWidth > 0) markLoaded(); else markError();
    });
    img.addEventListener('error', markError);

    /* Click the certificate to inspect it at 1:1 */
    var downPt = null;
    img.addEventListener('pointerdown', function (e) {
      downPt = { x: e.clientX, y: e.clientY };
    });
    img.addEventListener('click', function (e) {
      e.stopPropagation();
      /* Ignore the click that ends a drag/scroll gesture */
      if (downPt && (Math.abs(e.clientX - downPt.x) > 6 || Math.abs(e.clientY - downPt.y) > 6)) {
        downPt = null;
        return;
      }
      downPt = null;
      if (!img.naturalWidth) return;
      setZoom(!zoomed);
    });
    /* Clicking the empty frame area leaves the current zoom level alone */
    stage.addEventListener('click', function (e) {
      if (e.target === stage && zoomed) return;
    });

    function open(i) {
      lastFocused = document.activeElement;
      show(typeof i === 'number' ? i : 0);
      modal.classList.add('is-open');
      prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { closeBtn.focus(); });
    }

    function close() {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      document.body.style.overflow = prevBodyOverflow;
      setZoom(false);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    prev.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });
    closeBtn.addEventListener('click', close);
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) close(); });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    });

    /* Focus trap */
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = box.querySelectorAll('button:not([disabled]), [tabindex="0"]');
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    return { el: modal, open: open, close: close };
  }

  /* ============================================================== INIT */
  function start() {
    if (getCerts().length) { build(); return; }
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (getCerts().length) {
        clearInterval(timer);
        build();
      } else if (tries >= 40) {
        clearInterval(timer);
        build();
      }
    }, 75);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
