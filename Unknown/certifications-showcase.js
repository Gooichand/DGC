/* ==========================================================================
   CERTIFICATIONS — Premium Glass 3D Gallery engine
   Builds a realistic glassmorphism display case holding three genuine
   certificates in a gallery composition with cinematic lighting and
   interactive focus states.
   Reads global CERTIFICATES + a metadata map (category/description) derived
   only from the real issuers. Reuses the site's openCertModal for the
   "View Certificate" action.
   ========================================================================== */
(function () {
  'use strict';

  var ROOT_ID = 'certBookShowcase';

  /* Category + description metadata keyed by image source.
     Titles/orgs/years already exist in CERTIFICATES. Nothing is invented
     here — we only categorize/label the real certificates. */
  var CERT_META = {
    'images/Ibm.webp': {
      cat: 'Foundational',
      desc: 'Cloud security architecture and platform safeguards from IBM.'
    },
    'images/CYBERPRIVILEGE.webp': {
      cat: 'Access & Privilege',
      desc: 'Privileged access management fundamentals from Cyber Privilege.'
    },
    'images/cc.webp': {
      cat: 'Certification',
      desc: 'ISC2 Certified in Cybersecurity — core security principles.'
    },
    'images/cc-compl.webp': {
      cat: 'Compliance',
      desc: 'ISC2 CC compliance and governance essentials.'
    },
    'images/TCS%20iON%20Career%20Edge%20-%20Young%20Professional_page-0001.webp': {
      cat: 'Professional Skills',
      desc: 'TCS iON young-professional career skills program.'
    },
    'images/Cybersecurity%20Essentials%20(LFC108)_page-0001.webp': {
      cat: 'Security Essentials',
      desc: 'Linux Foundation introductory cybersecurity essentials track.'
    },
    "images/Strategy%20Storm's%20Case%20Competition%202026.webp": {
      cat: 'Competition',
      desc: 'Strategy Storm case-competition challenge, 2026.'
    },
    'images/Introduction%20to%20System%20Security.webp': {
      cat: 'Security Training',
      desc: 'System security fundamentals and protection concepts.'
    },
    'images/Protection%20from%20Browser%20Attacks.webp': {
      cat: 'Web Security',
      desc: 'Defensive techniques against browser-based attacks.'
    },
    'images/Elite%20Coders%20Winter%20of%20Code%20(ECWoC)_page-0001.webp': {
      cat: 'Open Source',
      desc: 'ECWoC open-source winter contribution program.'
    },
    'images/csam_combat_certificate_page-0001.webp': {
      cat: 'Training',
      desc: 'CSAM hands-on combat/training curriculum completion.'
    },
    'images/img%2013.webp': { cat: 'Professional', desc: 'Professional training completion certificate.' },
    'images/img%2014.webp': { cat: 'Advanced', desc: 'Advanced specialized training credential.' },
    'images/img12.webp': { cat: 'Internship', desc: 'ShadowFox cybersecurity internship completion.' },
    'images/img11.webp': { cat: 'Challenge', desc: 'Hack Storm challenge by Build with Vision.' },
    'images/img10.webp': { cat: 'APIs', desc: 'Postman API fundamentals course completion.' },
    'images/img9.webp': { cat: 'Data Science', desc: 'Data science with Python course completion.' },
    'images/img8.webp': { cat: 'Algorithms', desc: 'DSA with Java bootcamp completion.' },
    'images/img7.webp': { cat: 'Web Security', desc: 'Web application hacking training program.' },
    'images/img6.webp': { cat: 'Critical Infra', desc: 'Critical infrastructure protection fundamentals.' },
    'images/img5.webp': { cat: 'Simulation', desc: 'Cybersecurity analyst job simulation.' },
    'images/img4.webp': { cat: 'Conference', desc: 'Professional conference participation certificate.' },
    'images/img3.webp': { cat: 'Award', desc: 'Outstanding Delegate conference award.' },
    'images/img2.webp': { cat: 'Conference', desc: 'Academic conference participation certificate.' },
    'images/img1.webp': { cat: 'Internship', desc: 'Professional internship completion certificate.' }
  };

  var SHOW = 6; // fill the six compartments in the wall-shelf asset

  function getCerts() {
    if (typeof CERTIFICATES !== 'undefined' && Array.isArray(CERTIFICATES)) return CERTIFICATES;
    return [];
  }

  function getMeta(src) {
    return CERT_META[src] || { cat: 'Certification', desc: 'Professional certification achievement.' };
  }

  /* ---------------------------------------------------------------- helpers */
  function join() { return Array.prototype.join.call(arguments, ''); }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function prefReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isCoarseTouch() {
    return window.matchMedia && (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      window.innerWidth <= 700);
  }

  /* ------------------------------------------------------------- open modal */
  function openModal(src) {
    if (typeof window.openCertModal === 'function') { window.openCertModal(src); return; }
    if (typeof openCertModal === 'function') { openCertModal(src); return; }
    fallbackModal(src);
  }

  function getCert(src) {
    var certs = getCerts();
    for (var i = 0; i < certs.length; i++) if (certs[i].src === src) return certs[i];
    return null;
  }

  function fallbackModal(src) {
    var cert = getCert(src) || { src: src, title: 'Certificate', org: '', year: '' };
    var meta = getMeta(src);
    var modal = document.createElement('div');
    modal.className = 'certs-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    var img = document.createElement('img');
    img.className = 'certs-modal__img';
    img.src = src;
    img.alt = cert.title;
    if (cert.width) img.width = cert.width;
    if (cert.height) img.height = cert.height;
    img.loading = 'eager';
    img.decoding = 'async';

    var caption = document.createElement('div');
    caption.className = 'certs-modal__caption';
    caption.innerHTML = join(
      '<strong>', escapeHtml(cert.title), '</strong>',
      '<small>', escapeHtml(meta.cat), ' &middot; ', escapeHtml(cert.org),
      cert.year ? ' &middot; ' + escapeHtml(cert.year) : '', '<br>', escapeHtml(meta.desc), '</small>'
    );

    var close = document.createElement('button');
    close.className = 'certs-modal__close';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '<i class="fas fa-times"></i>';

    var box = document.createElement('div');
    box.className = 'certs-modal__box';
    box.appendChild(img);
    box.appendChild(caption);
    box.appendChild(close);

    modal.appendChild(box);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    var prv = document.activeElement;
    close.focus();

    function closeModal() {
      modal.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', keyH);
      if (prv && prv.focus) prv.focus();
    }
    function keyH(e) { if (e.key === 'Escape') closeModal(); }
    close.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', keyH);
  }

  /* --------------------------------------------------------------- build */
  function build() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.dataset.certsReady === 'true') return;
    root.dataset.certsReady = 'true';

    var certs = getCerts();
    if (!certs.length) return;
    var data = certs.slice(0, SHOW);
    var used = data.length;
    if (used < 1) return;

    var coarse = isCoarseTouch();
    var reduce = prefReduced();

    /* --- Build the case and meta bar first, then inject into mount --- */
    var mount = root.querySelector('[data-case-mount]') || document.getElementById('certsCaseMount');

    var caseEl = document.createElement('div');
    caseEl.className = 'certs-case';
    if (!reduce) {
      caseEl.appendChild(refract('certs-case__refract certs-case__refract--a'));
      caseEl.appendChild(refract('certs-case__refract certs-case__refract--b'));
    }

    var inner = document.createElement('div');
    inner.className = 'certs-case__inner';

    var stage = document.createElement('div');
    stage.className = 'certs-stage';

    if (!reduce) {
      var floor = document.createElement('div');
      floor.className = 'certs-stage__floor';
      stage.appendChild(floor);
    }

    var platform = document.createElement('div');
    platform.className = 'certs-platform';
    stage.appendChild(platform);

    var row = document.createElement('div');
    row.className = 'certs-stage__row';

    var cards = [];
    var positions = ['left', 'center', 'right', 'left', 'center', 'right'];

    for (var i = 0; i < used; i++) {
      var cert = data[i];
      var meta = getMeta(cert.src);
      var pos = positions[i] || 'center';

      /* beam light above this certificate */
      var beam = document.createElement('div');
      beam.className = 'certs-beam';
      if (i === 0) beam.setAttribute('data-tilt', 'l');
      if (i === 2) beam.setAttribute('data-tilt', 'r');
      stage.appendChild(beam);

      var pool = document.createElement('div');
      pool.className = 'certs-pool';
      pool.style.left = (16 + i * 34) + '%';
      stage.appendChild(pool);

      /* certificate card */
      var card = document.createElement('div');
      card.className = 'certs-card certificate-card';
      card.setAttribute('data-pos', pos);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', certificateA11y(cert));
      card.style.setProperty('--m', (i === 1 ? 0.6 : 0) + 'rem');

      var shadow = document.createElement('div');
      shadow.className = 'certs-card__shadow';

      var frame = document.createElement('div');
      frame.className = 'certs-card__frame';

      var art = document.createElement('div');
      art.className = 'certs-card__art';

      var img = document.createElement('img');
      img.src = cert.src;
      img.alt = cert.title;
      img.loading = i === 1 ? 'eager' : 'lazy';
      img.decoding = 'async';
      if (cert.width) img.width = cert.width;
      if (cert.height) img.height = cert.height;

      var glare = document.createElement('div');
      glare.className = 'certs-card__glare';

      art.appendChild(img);
      art.appendChild(glare);

      /* info panel */
      var info = document.createElement('div');
      info.className = 'certs-card__info';
      info.innerHTML = join(
        '<p class="certs-card__info-title">', escapeHtml(cert.title), '</p>',
        '<p class="certs-card__info-meta">', escapeHtml(meta.cat),
        ' &middot; ', escapeHtml(cert.org),
        cert.year ? ' &middot; ' + escapeHtml(cert.year) : '', '</p>',
        '<button class="certs-card__info-btn" data-action="view"><i class="fas fa-eye"></i> View Certificate</button>'
      );

      frame.appendChild(shadow);
      frame.appendChild(art);
      frame.appendChild(info);
      card.appendChild(frame);

      wireCard(card, info, i, cert);

      row.appendChild(card);
      cards.push(card);
    }

    /* motes (dust) — sparingly */
    if (!reduce) {
      for (var m = 0; m < 5; m++) {
        var mote = document.createElement('span');
        mote.className = 'certs-mote';
        mote.style.left = (6 + Math.random() * 88) + '%';
        mote.style.top = (10 + Math.random() * 70) + '%';
        mote.style.setProperty('--dur', (9 + Math.random() * 9) + 's');
        mote.style.setProperty('--delay', (Math.random() * 6) + 's');
        stage.appendChild(mote);
      }
    }

    stage.appendChild(row);
    inner.appendChild(stage);
    caseEl.appendChild(inner);

    /* meta bar with micro-labels + status + pagination */
    var metaBar = document.createElement('div');
    metaBar.className = 'certs-case__meta';
    metaBar.innerHTML = join(
      '<span class="certs-tag">VERIFIED CREDENTIALS</span>',
      '<span class="certs-tag certs-tag--accent"><i class="fas fa-shield-halved"></i> 06 CERTIFICATES</span>',
      '<span class="certs-status"><span class="certs-status__dot"></span>CERTIFICATION ARCHIVE // ACTIVE</span>'
    );

    var pagination = document.createElement('div');
    pagination.className = 'certs-pagination';
    var dots = [];
    for (var d = 0; d < used; d++) {
      (function (idx) {
        var dot = document.createElement('button');
        dot.className = 'certs-pagination__dot';
        dot.setAttribute('aria-label', 'Show certificate ' + (idx + 1));
        dot.addEventListener('click', function () { markActive(idx); });
        pagination.appendChild(dot);
        dots.push(dot);
      })(d);
    }
    metaBar.appendChild(pagination);
    caseEl.appendChild(metaBar);

    /* navigation arrows */
    var navCtrls = addNav(caseEl, cards);

    if (mount) mount.appendChild(caseEl);
    else root.appendChild(caseEl);

    /* --- interaction controller --- */
    var activeIndex = 1; // center hero by default

    function markActive(index) {
      activeIndex = index;
      cards.forEach(function (c, idx) { c.classList.toggle('is-active', idx === index); });
      dots.forEach(function (dot, idx) { dot.classList.toggle('is-active', idx === index); });
      navCtrls.setDisabled(activeIndex, cards.length);
    }

    function openIndex(index) { openModal(data[index].src); }

    markActive(activeIndex);

    /* --- navigation buttons --- */
    function addNav(scope, cardList) {
      var prev = document.createElement('button');
      prev.className = 'certs-nav certs-nav--prev';
      prev.setAttribute('aria-label', 'Previous certificate');
      prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
      var next = document.createElement('button');
      next.className = 'certs-nav certs-nav--next';
      next.setAttribute('aria-label', 'Next certificate');
      next.innerHTML = '<i class="fas fa-chevron-right"></i>';

      function setDisabled(a, n) {
        prev.disabled = a <= 0;
        next.disabled = a >= n - 1;
      }

      prev.addEventListener('click', function () {
        if (activeIndex > 0) markActive(activeIndex - 1);
      });
      next.addEventListener('click', function () {
        if (activeIndex < cardList.length - 1) markActive(activeIndex + 1);
      });

      scope.appendChild(prev);
      scope.appendChild(next);
      setDisabled(activeIndex, cardList.length);
      return { setDisabled: setDisabled };
    }

    /* --- card wiring --- */
    function wireCard(card, info, index, cert) {
      card.addEventListener('pointerenter', function () {
        card.classList.add('is-active');
        stage.classList.add('has-focus');
      });
      card.addEventListener('pointerleave', function () {
        if (coarse) return;
        card.classList.remove('is-active');
        if (!stage.querySelector('.certs-card:hover')) stage.classList.remove('has-focus');
      });
      card.addEventListener('focus', function () {
        markActive(index);
        stage.classList.add('has-focus');
      });
      card.addEventListener('blur', function () {
        if (!coarse) { card.classList.remove('is-active'); stage.classList.remove('has-focus'); }
      });
      card.addEventListener('click', function (e) {
        if (e.target.closest('[data-action="view"]')) return;
        if (coarse) { markActive(index); }
        else { openIndex(index); }
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIndex(index); }
        if (e.key === 'ArrowLeft') { if (index > 0) markActive(index - 1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { if (index < cards.length - 1) markActive(index + 1); e.preventDefault(); }
        if (e.key === 'Escape') { markActive(1); card.blur(); }
      });
      info.querySelector('[data-action="view"]').addEventListener('click', function (e) {
        e.stopPropagation();
        openIndex(index);
      });
    }

    /* "View All" button reuse */
    var viewAllBtn = document.getElementById('viewAllCerts');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', function () {
        if (typeof window.showAllCertificatesModal === 'function') {
          window.showAllCertificatesModal();
        }
      });
    }

    root.dataset.certsBuilt = 'true';
  }

  function certificateA11y(cert) {
    var parts = [cert.title];
    if (cert.org) parts.push('issued by ' + cert.org);
    if (cert.year) parts.push(cert.year);
    return 'View certificate: ' + parts.join(', ');
  }

  function refract(cls) {
    var el = document.createElement('div');
    el.className = cls;
    return el;
  }

  /* ------------------------------------------------------------------ init */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

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
})();