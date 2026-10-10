/* Interactive Certifications - Carousel with prev/next controls */

const CERTIFICATES = [
  { src: 'images/Ibm.webp', width: 1600, height: 576, title: 'IBM Cybersecurity Certification', org: 'IBM', year: '2025' },
  { src: 'images/CYBERPRIVILEGE.webp', width: 1600, height: 1131, title: 'Cyber Privilege Certification', org: 'Cyber Privilege', year: '2025' },
  { src: 'images/cc.webp', width: 1280, height: 896, title: 'Certified in Cybersecurity (CC)', org: 'ISC2', year: '2025' },
  { src: 'images/cc-compl.webp', width: 1280, height: 908, title: 'CC Compliance Certification', org: 'Compliance Training', year: '2025' },
  { src: 'images/TCS%20iON%20Career%20Edge%20-%20Young%20Professional_page-0001.webp', width: 1600, height: 1131, title: 'TCS iON Career Edge - Young Professional', org: 'TCS iON', year: '2025' },
  { src: 'images/Cybersecurity%20Essentials%20(LFC108)_page-0001.webp', width: 1600, height: 1239, title: 'Cybersecurity Essentials (LFC108)', org: 'Linux Foundation', year: '2025' },
  { src: "images/Strategy%20Storm's%20Case%20Competition%202026.webp", width: 1600, height: 1130, title: "Strategy Storm's Case Competition 2026", org: 'Competition', year: '2026' },
  { src: 'images/Introduction%20to%20System%20Security.webp', width: 1600, height: 1131, title: 'Introduction to System Security', org: 'Security Training', year: '2025' },
  { src: 'images/Protection%20from%20Browser%20Attacks.webp', width: 1600, height: 1131, title: 'Protection from Browser Attacks', org: 'Security Training', year: '2025' },
  { src: 'images/Elite%20Coders%20Winter%20of%20Code%20(ECWoC)_page-0001.webp', width: 1600, height: 1132, title: 'Elite Coders Winter of Code (ECWoC)', org: 'ECWoC', year: '2026' },
  { src: 'images/csam_combat_certificate_page-0001.webp', width: 1600, height: 1236, title: 'CSAM Combat Certificate', org: 'CSAM', year: '2025' },
  { src: 'images/img%2013.webp', width: 1600, height: 1131, title: 'Professional Certificate', org: 'Professional Training', year: '2026' },
  { src: 'images/img%2014.webp', width: 1600, height: 1107, title: 'Advanced Certification', org: 'Advanced Training', year: '2026' },
  { src: 'images/img12.webp', width: 1600, height: 1130, title: 'ShadowFox Cybersecurity Internship', org: 'ShadowFox', year: '2024' },
  { src: 'images/img11.webp', width: 1600, height: 1093, title: 'Hack Storm Challenge', org: 'Build with Vision', year: '2024' },
  { src: 'images/img10.webp', width: 1395, height: 1078, title: 'Postman API Fundamentals', org: 'Postman', year: '2025' },
  { src: 'images/img9.webp', width: 1600, height: 1131, title: 'Data Science with Python', org: 'Professional Course', year: '2024' },
  { src: 'images/img8.webp', width: 1600, height: 1132, title: 'DSA with Java Bootcamp', org: 'Coding Bootcamp', year: '2024' },
  { src: 'images/img7.webp', width: 1214, height: 498, title: 'Web Application Hacking', org: 'Security Training', year: '2024' },
  { src: 'images/img6.webp', width: 800, height: 642, title: 'Critical Infrastructure Protection', org: 'Security Institute', year: '2024' },
  { src: 'images/img5.webp', width: 800, height: 565, title: 'Cybersecurity Analysis Simulation', org: 'Job Simulation', year: '2024' },
  { src: 'images/img4.webp', width: 800, height: 563, title: 'Conference Certificate', org: 'Professional Conference', year: '2024' },
  { src: 'images/img3.webp', width: 800, height: 618, title: 'Outstanding Delegate', org: 'Conference Award', year: '2024' },
  { src: 'images/img2.webp', width: 800, height: 642, title: 'Conference Certificate', org: 'Academic Conference', year: '2024' },
  { src: 'images/img1.webp', width: 861, height: 668, title: 'Internship Completion Certificate', org: 'Professional Internship', year: '2024' }
];

function makeResponsiveSrcset(asset) {
    const widths = [320, 640].filter((width) => width < asset.width);
    const base = asset.src.replace(/\.[^.]+$/, '');
    return widths.map((width) => `${base}-${width}.webp ${width}w`).join(', ');
}

function initCertCarousel() {
    const track = document.getElementById('certCarouselTrack');
    if (!track || track.dataset.certificationsReady === 'true') return;
    track.dataset.certificationsReady = 'true';

    CERTIFICATES.forEach((cert, index) => {
        const item = document.createElement('div');
        item.className = 'cert-carousel-item';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', 'Open certificate: ' + cert.title);
        item.innerHTML = `
            <img src="${cert.src}" srcset="${makeResponsiveSrcset(cert)}" sizes="(max-width: 900px) 46vw, 280px" alt="${cert.title}" width="${cert.width}" height="${cert.height}" loading="${index < 4 ? 'eager' : 'lazy'}" fetchpriority="${index < 4 ? 'high' : 'low'}" decoding="async">
            <div class="cert-overlay"></div>
            <div class="cert-content">
                <div class="cert-title">${cert.title}</div>
                <div class="cert-org">${cert.org} | ${cert.year}</div>
            </div>`;
        item.addEventListener('click', () => openCertModal(cert.src));
        item.addEventListener('pointerenter', () => item.classList.add('is-inspected'));
        item.addEventListener('pointerleave', () => item.classList.remove('is-inspected'));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCertModal(cert.src);
            }
        });
        track.appendChild(item);
    });

    const prev = document.getElementById('certPrev');
    const next = document.getElementById('certNext');
    let index = 0;

    function perView() {
        if (window.innerWidth <= 900) return 2;
        if (window.innerWidth <= 1400) return 3;
        return 4;
    }

    function maxIndex() {
        return Math.max(0, CERTIFICATES.length - perView());
    }

    function update() {
        const gap = 16;
        const n = perView();
        const slideW = (track.clientWidth - gap * (n - 1)) / n;
        track.style.transform = `translateX(${-index * (slideW + gap)}px)`;
        prev.disabled = index <= 0;
        next.disabled = index >= maxIndex();
    }

    prev.addEventListener('click', () => { if (index > 0) { index--; update(); } });
    next.addEventListener('click', () => { if (index < maxIndex()) { index++; update(); } });
    window.addEventListener('resize', () => { index = Math.min(index, maxIndex()); update(); });
    update();

    const viewAllBtn = document.getElementById('viewAllCerts');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', showAllCertificatesModal);
    }
}

function openCertModal(imageSrc) {
    const imageMeta = CERTIFICATES.find((cert) => cert.src === imageSrc) || { src: imageSrc, width: 1600, height: 1200 };
    const modal = document.createElement('div');
    modal.id = 'certAccordionModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);backdrop-filter:blur(20px);z-index:10000;display:flex;align-items:center;justify-content:center;';
    modal.innerHTML = `
        <div style="position:relative;max-width:90%;max-height:90%;">
            <img src="${imageSrc}" srcset="${makeResponsiveSrcset(imageMeta)}" sizes="(max-width: 900px) 88vw, 900px" width="${imageMeta.width}" height="${imageMeta.height}" loading="eager" fetchpriority="high" decoding="async" style="max-width:100%;max-height:80vh;border-radius:15px;box-shadow:0 0 50px rgba(0,255,65,0.5);">
            <button id="closeCertModal" style="position:absolute;top:-20px;right:-20px;background:var(--forensic-red);border:none;color:white;font-size:1.5rem;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-times"></i>
            </button>
        </div>`;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    document.getElementById('closeCertModal').addEventListener('click', () => { modal.remove(); document.body.style.overflow = ''; });
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
}

function showAllCertificatesModal() {
    const certs = CERTIFICATES;

    const styleId = 'all-certs-modal-styles';
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style');
      s.id = styleId;
      s.textContent = `
        #allCertificatesModal {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(0,0,0,0.88);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: ncm-fade 0.4s ease;
        }
        @keyframes ncm-fade { from { opacity:0; backdrop-filter:blur(0px) } to { opacity:1; backdrop-filter:blur(30px) } }
        #allCertificatesModal .ncm-box {
          width: 100%; max-width: 1200px;
          max-height: 90vh;
          background: linear-gradient(160deg, rgba(8,18,8,0.96) 0%, rgba(5,12,5,0.98) 100%);
          border-radius: 24px;
          display: flex; flex-direction: column;
          box-shadow: 0 0 80px rgba(0,255,65,0.08), 0 0 160px rgba(0,255,65,0.04);
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(0,255,65,0.12);
        }
        #allCertificatesModal .ncm-box::before {
          content: ''; position: absolute; inset: -1px;
          border-radius: 24px;
          background: conic-gradient(from var(--ncm-angle,0deg), transparent 60%, rgba(0,255,65,0.15) 75%, rgba(0,200,255,0.1) 85%, transparent 95%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1.5px;
          pointer-events: none;
          animation: ncm-border 6s linear infinite;
          z-index: 0;
        }
        @property --ncm-angle { syntax: '<angle>'; inherits: true; initial-value: 0deg; }
        @keyframes ncm-border { 0% { --ncm-angle:0deg } 100% { --ncm-angle:360deg } }
        #allCertificatesModal .ncm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 2rem;
          border-bottom: 1px solid rgba(0,255,65,0.06);
          flex-shrink: 0;
          position: relative; z-index: 1;
        }
        #allCertificatesModal .ncm-header-left {
          display: flex; align-items: center; gap: 1.2rem;
        }
        #allCertificatesModal .ncm-title {
          color: #e0ffe0;
          font-family: 'AkayaKanadaka', serif;
          font-size: 1.3rem;
          margin: 0;
          letter-spacing: 0.5px;
        }
        #allCertificatesModal .ncm-title span {
          color: #00ff41;
        }
        #allCertificatesModal .ncm-count {
          font-size: 0.75rem;
          color: rgba(0,255,65,0.4);
          font-family: monospace;
          background: rgba(0,255,65,0.06);
          padding: 0.2rem 0.7rem;
          border-radius: 20px;
          border: 1px solid rgba(0,255,65,0.08);
        }
        #allCertificatesModal .ncm-close {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          width: 34px; height: 34px; border-radius: 10px;
          cursor: pointer; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s ease;
        }
        #allCertificatesModal .ncm-close:hover {
          background: rgba(255,59,59,0.2);
          border-color: rgba(255,59,59,0.4);
          color: #ff5a5a;
          transform: rotate(90deg);
        }
        #allCertificatesModal .ncm-filter-bar {
          display: flex; gap: 0.3rem; padding: 0.8rem 2rem;
          border-bottom: 1px solid rgba(0,255,65,0.04);
          flex-shrink: 0;
          overflow-x: auto;
          position: relative; z-index: 1;
          scrollbar-width: none;
        }
        #allCertificatesModal .ncm-filter-bar::-webkit-scrollbar { display: none; }
        #allCertificatesModal .ncm-filter-pill {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.3);
          padding: 0.35rem 1rem;
          border-radius: 8px;
          font-size: 0.78rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          font-family: monospace;
          letter-spacing: 0.3px;
          position: relative;
        }
        #allCertificatesModal .ncm-filter-pill::after {
          content: ''; position: absolute; bottom: 0; left: 50%;
          width: 0; height: 2px;
          background: #00ff41;
          border-radius: 2px;
          transform: translateX(-50%);
          transition: width 0.25s ease;
          box-shadow: 0 0 8px rgba(0,255,65,0.4);
        }
        #allCertificatesModal .ncm-filter-pill:hover {
          color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.03);
        }
        #allCertificatesModal .ncm-filter-pill.active {
          color: #00ff41;
          background: rgba(0,255,65,0.06);
        }
        #allCertificatesModal .ncm-filter-pill.active::after {
          width: 60%;
        }
        #allCertificatesModal .ncm-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 2rem;
          position: relative; z-index: 1;
        }
        #allCertificatesModal .ncm-body::-webkit-scrollbar { width: 4px; }
        #allCertificatesModal .ncm-body::-webkit-scrollbar-track { background: transparent; }
        #allCertificatesModal .ncm-body::-webkit-scrollbar-thumb { background: rgba(0,255,65,0.15); border-radius: 4px; }
        #allCertificatesModal .ncm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 1rem;
        }
        #allCertificatesModal .ncm-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          opacity: 0;
          transform: translateY(24px) scale(0.96);
          animation: ncm-card-in 0.6s ease forwards;
        }
        @keyframes ncm-card-in {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        #allCertificatesModal .ncm-card::after {
          content: ''; position: absolute; inset: 0;
          border-radius: 14px;
          background: linear-gradient(135deg, transparent 40%, rgba(0,255,65,0.03) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        #allCertificatesModal .ncm-card:hover {
          transform: translateY(-8px) scale(1.025);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,65,0.25);
          border-color: rgba(0,255,65,0.25);
        }
        #allCertificatesModal .ncm-card:hover::after { opacity: 1; }
        #allCertificatesModal .ncm-card-img {
          width: 100%; aspect-ratio: 1.5/1;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1), filter 0.4s ease;
        }
        #allCertificatesModal .ncm-card:hover .ncm-card-img {
          transform: scale(1.08);
          filter: brightness(1.08) contrast(1.05);
        }
        #allCertificatesModal .ncm-card-body {
          padding: 0.75rem 0.9rem 0.9rem;
        }
        #allCertificatesModal .ncm-card-title {
          color: rgba(255,255,255,0.88);
          font-size: 0.82rem;
          font-weight: 500;
          margin: 0 0 0.3rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        #allCertificatesModal .ncm-card-org {
          color: rgba(0,200,255,0.5);
          font-size: 0.7rem;
          font-family: monospace;
          margin: 0;
          letter-spacing: 0.3px;
        }
        #allCertificatesModal .ncm-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 1rem;
          color: rgba(255,255,255,0.12);
          font-family: monospace;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          #allCertificatesModal { padding: 0.8rem; }
          #allCertificatesModal .ncm-box { border-radius: 16px; max-height: 95vh; }
          #allCertificatesModal .ncm-header { padding: 0.9rem 1.2rem; }
          #allCertificatesModal .ncm-title { font-size: 1rem; }
          #allCertificatesModal .ncm-filter-bar { padding: 0.6rem 1.2rem; gap: 0.2rem; }
          #allCertificatesModal .ncm-body { padding: 1rem 1.2rem; }
          #allCertificatesModal .ncm-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.7rem; }
        }
      `;
      document.head.appendChild(s);
    }

    // Collect unique orgs for filter
    const orgSet = new Set();
    certs.forEach(c => { if (c.org) orgSet.add(c.org); });
    const orgs = [...orgSet].sort();

    // Build modal HTML
    const modal = document.createElement('div');
    modal.id = 'allCertificatesModal';

    const filterPills = orgs.map(o =>
      `<button class="ncm-filter-pill" data-org="${o}">${o}</button>`
    ).join('');

    const cardsHtml = certs.map((c, i) => `
      <div class="ncm-card" data-org="${c.org}" data-year="${c.year}" style="animation-delay:${(i % 12) * 0.04}s">
        <img class="ncm-card-img" src="${c.src}" srcset="${makeResponsiveSrcset(c)}" sizes="(max-width: 768px) 90vw, 280px" alt="${c.title}" width="${c.width}" height="${c.height}" loading="lazy" decoding="async">
        <div class="ncm-card-body">
          <p class="ncm-card-title">${c.title}</p>
          <p class="ncm-card-org">${c.org}</p>
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="ncm-box">
        <div class="ncm-header">
          <div class="ncm-header-left">
            <h2 class="ncm-title"><span>CERTIFICATIONS</span> &mdash; Portfolio</h2>
            <span class="ncm-count">${certs.length} total</span>
          </div>
          <button class="ncm-close" id="closeAllCertModal" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="ncm-filter-bar">
          <button class="ncm-filter-pill active" data-org="all">All</button>
          ${filterPills}
        </div>
        <div class="ncm-body" id="ncmBody">
          <div class="ncm-grid">${cardsHtml}</div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animate border angle
    let angle = 0;
    const borderInterval = setInterval(() => {
      const box = modal.querySelector('.ncm-box');
      if (box) box.style.setProperty('--ncm-angle', `${angle}deg`);
      angle = (angle + 1) % 360;
    }, 16);
    modal._borderInterval = borderInterval;

    // Filter logic
    const allCards = modal.querySelectorAll('.ncm-card');
    modal.querySelectorAll('.ncm-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        modal.querySelectorAll('.ncm-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const org = pill.dataset.org;
        let anyVisible = false;
        allCards.forEach(card => {
          const match = org === 'all' || card.dataset.org === org;
          card.style.display = match ? '' : 'none';
          if (match) anyVisible = true;
        });
        const grid = modal.querySelector('.ncm-grid');
        const existing = modal.querySelector('.ncm-empty');
        if (!anyVisible) {
          if (!existing) {
            const empty = document.createElement('div');
            empty.className = 'ncm-empty';
            empty.textContent = 'No certificates match this filter';
            grid.parentNode.appendChild(empty);
          }
        } else if (existing) {
          existing.remove();
        }
      });
    });

    // Card click → open full view
    let flatIdx = 0;
    modal.querySelectorAll('.ncm-card').forEach(card => {
      const idx = flatIdx++;
      card.addEventListener('click', () => openCertModal(certs[idx].src));
    });

    // Close handlers
    const close = () => {
      clearInterval(modal._borderInterval);
      modal.remove();
      document.body.style.overflow = '';
    };
    document.getElementById('closeAllCertModal').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
}

// This controller is loaded by the portfolio's idle-time loader, after DOMContentLoaded may have fired.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertCarousel, { once: true });
} else {
  initCertCarousel();
}
