(() => {
  'use strict';

  const DOMAIN_CONFIG = {
    programming: {
      title: 'Programming',
      description: 'Build reliable systems with practical programming foundations and problem-solving depth.',
      icon: 'fa-code',
      tags: ['Python', 'JavaScript', 'Java', 'C / C++', 'TypeScript', 'Go', 'Rust'],
      projectTerms: ['python', 'javascript', 'java', 'c++', 'typescript', 'go', 'rust', 'programming'],
      certificateTerms: ['data science', 'dsa', 'python', 'java'],
      proofLabel: 'Code, algorithms, and implementation work connected to the portfolio.'
    },
    security: {
      title: 'Security',
      description: 'Design safer systems through threat modeling, defensive analysis, and security-aware development.',
      icon: 'fa-shield-alt',
      tags: ['Threat Modeling', 'OWASP', 'Incident Response', 'Vulnerability Assessment', 'NIST', 'Zero Trust'],
      projectTerms: ['security', 'phishing', 'browser extension', 'incident', 'threat', 'authentication'],
      certificateTerms: ['cybersecurity', 'security', 'web application hacking', 'browser attacks', 'infrastructure'],
      proofLabel: 'Security projects, practical investigations, and defensive learning evidence.'
    },
    forensics: {
      title: 'Digital Forensics',
      description: 'Uncover, analyze, and preserve digital evidence with precision and repeatable workflows.',
      icon: 'fa-fingerprint',
      tags: ['Autopsy', 'Volatility', 'Wireshark', 'OSINT', 'Windows Forensics', 'Network Forensics'],
      projectTerms: ['forensic', 'evidence', 'prefetch', 'event log', 'lnk', 'recycle bin', 'download history', 'recon'],
      certificateTerms: ['cybersecurity', 'forensic', 'security', 'evidence'],
      proofLabel: 'Forensic tools and evidence-focused projects connected to real source data.'
    },
    web: {
      title: 'Web Engineering',
      description: 'Create responsive, accessible interfaces and practical web experiences that communicate clearly.',
      icon: 'fa-globe',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'React', 'REST APIs', 'Responsive UI'],
      projectTerms: ['web', 'react', 'javascript', 'frontend', 'api', 'browser', 'ui', 'node'],
      certificateTerms: ['web', 'postman', 'api', 'frontend'],
      proofLabel: 'Web projects, interactive interfaces, and deployed product experiences.'
    },
    data: {
      title: 'Data Intelligence',
      description: 'Turn structured and unstructured information into useful analysis, reports, and decisions.',
      icon: 'fa-chart-line',
      tags: ['NumPy', 'OpenCV', 'SQLite', 'Data Analysis', 'Visualization', 'Reporting'],
      projectTerms: ['data', 'analysis', 'numpy', 'opencv', 'sqlite', 'csv', 'metadata', 'correlation'],
      certificateTerms: ['data science', 'analysis', 'statistics'],
      proofLabel: 'Data analysis, image analysis, reporting, and evidence-correlation work.'
    },
    cloud: {
      title: 'Cloud & Tools',
      description: 'Connect code, deployment, collaboration, and infrastructure into dependable project workflows.',
      icon: 'fa-cloud',
      tags: ['Git', 'GitHub', 'Docker', 'Supabase', 'IPFS', 'Linux'],
      projectTerms: ['docker', 'supabase', 'ipfs', 'polygon', 'node', 'deployment', 'cloud', 'github'],
      certificateTerms: ['linux', 'postman', 'professional'],
      proofLabel: 'Repositories, deployment workflows, and project tooling used across the portfolio.'
    }
  };

  const DOMAIN_ORDER = ['programming', 'security', 'forensics', 'web', 'data', 'cloud'];
  const DOMAIN_DESCRIPTIONS = {
    programming: 'Languages, frameworks, and problem-solving foundations used to build reliable systems.',
    security: 'Secure design, defensive analysis, and controlled assessment methods for resilient systems.',
    forensics: 'Evidence acquisition, examination, preservation, and repeatable investigative workflows.',
    web: 'Responsive, accessible interfaces and practical web experiences built for clear communication.',
    data: 'Structured analysis, visual reasoning, and evidence-informed reporting from complex information.',
    cloud: 'Repositories, deployment workflows, infrastructure, and tools that keep projects dependable.'
  };
  const PROJECT_DATA = typeof projectsData !== 'undefined' && Array.isArray(projectsData) ? projectsData : (Array.isArray(window.projectsData) ? window.projectsData : []);

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const normalize = (value) => String(value ?? '').toLowerCase();

  function getProjectText(project) {
    return normalize([
      project.title,
      project.description,
      project.category,
      ...(project.tech || []),
      ...(project.skillsNeeded || [])
    ].join(' '));
  }

  function getDomainProjects(domain) {
    const terms = DOMAIN_CONFIG[domain].projectTerms;
    return PROJECT_DATA
      .map((project) => ({ project, score: terms.reduce((score, term) => score + (getProjectText(project).includes(term) ? 1 : 0), 0) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.project);
  }

  function getCertificateItems() {
    return Array.from(document.querySelectorAll('.cert-carousel-item, .certificate-card, .cert-card'));
  }

  function getDomainCertificateCount(domain) {
    const terms = DOMAIN_CONFIG[domain].certificateTerms;
    const items = getCertificateItems();
    if (!items.length) return 0;
    return items.filter((item) => {
      const text = normalize(item.textContent);
      return terms.some((term) => text.includes(term));
    }).length;
  }

  function getProjectLinks(projects) {
    const links = [];
    projects.forEach((project) => {
      const url = project.live || project.github;
      if (url && !links.some((link) => link.url === url)) {
        links.push({ url, label: project.title });
      }
    });
    return links.slice(0, 3);
  }

  function buildProof(domain) {
    const projects = getDomainProjects(domain);
    const links = getProjectLinks(projects);
    const certificates = getDomainCertificateCount(domain);
    const repositoryCount = projects.filter((project) => project.github).length;
    const projectText = projects.length ? `${projects.length} projects` : 'Portfolio projects';
    const certificateText = certificates ? `${certificates} certificates` : 'certificate evidence';
    const repoText = repositoryCount ? `${repositoryCount} repositories` : 'repository links';

    return {
      projects,
      links,
      certificates,
      repositoryCount,
      label: `${projectText} · ${certificateText} · ${repoText}`
    };
  }

  function renderProjectLinks(proof) {
    if (!proof.links.length) {
      return '<a class="constellation-action primary" href="#projects">EXPLORE WORK <i class="fas fa-arrow-right" aria-hidden="true"></i></a>';
    }

    const primary = proof.links[0];
    const secondary = proof.links.slice(1, 3).map((link) => `
      <a class="constellation-action" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label.length > 18 ? `${link.label.slice(0, 18)}…` : link.label)}</a>
    `).join('');

    return `
      <a class="constellation-action primary" href="${escapeHtml(primary.url)}" target="_blank" rel="noopener noreferrer">EXPLORE WORK <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
      ${secondary}
    `;
  }

  function renderDetail(domain, panel) {
    const config = DOMAIN_CONFIG[domain];
    const proof = buildProof(domain);
    panel.classList.add('is-updating');

    window.setTimeout(() => {
      panel.innerHTML = `
        <div class="constellation-detail-content">
          <div class="constellation-dossier-header"><span class="constellation-kicker">CASE FILE</span><strong>0${DOMAIN_ORDER.indexOf(domain) + 1}</strong><span class="constellation-confidential">SELECTED DOMAIN</span><button class="constellation-preview-close" type="button" aria-label="Close evidence folder preview"><i class="fas fa-times" aria-hidden="true"></i></button></div>
          <div class="constellation-detail-icon" aria-hidden="true"><i class="fas ${config.icon}"></i></div>
          <h3 id="constellation-detail-title">${escapeHtml(config.title)}</h3>
          <p class="constellation-detail-description">${escapeHtml(config.description)}</p>
          <section class="constellation-evidence-summary"><span class="constellation-proof-label">EVIDENCE SUMMARY</span><p>Applied repeatable methods, tools, and documented workflows to real-world projects and investigative work.</p></section>
          <section class="constellation-tags-section"><span class="constellation-proof-label">SKILL TAGS</span>
          <div class="constellation-detail-tags" aria-label="${escapeHtml(config.title)} skills">
            ${config.tags.map((tag) => `<span class="constellation-detail-tag">${escapeHtml(tag)}</span>`).join('')}
          </div></section>
          <div class="constellation-proof">
            <span class="constellation-proof-label">PROOF OF WORK</span>
            <p class="constellation-proof-text">${escapeHtml(proof.label)}</p>
            <div class="constellation-proof-cards">${proof.projects.slice(0, 3).map((project) => `<a href="${escapeHtml(project.live || project.github || '#projects')}" class="constellation-proof-card" ${project.live || project.github ? 'target="_blank" rel="noopener noreferrer"' : ''}><i class="fas fa-file-shield"></i><span>${escapeHtml(project.title || 'Evidence project')}</span></a>`).join('')}<a href="#projects" class="constellation-proof-card"><i class="fas fa-plus"></i><span>+${Math.max(0, proof.projects.length - 3) || 8} More Projects</span></a></div>
          </div>
          <div class="constellation-actions">
            <a class="constellation-action primary" href="#projects">VIEW PROJECTS <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
            <a class="constellation-action" href="#certificates">VIEW CERTIFICATES</a>
            <a class="constellation-action" href="https://github.com/Gooichand" target="_blank" rel="noopener noreferrer">GITHUB</a>
          </div>
        </div>`;
      panel.classList.remove('is-updating');
      panel.setAttribute('aria-label', `${config.title} selected skill details`);
      panel.querySelector('.constellation-preview-close')?.addEventListener('click', closePreview);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120);
  }

  function openPreview(section) {
    section.classList.add('is-folder-preview-open');
    document.body.classList.add('skills-preview-open');
  }

  function closePreview() {
    const section = document.getElementById('technical-skills');
    section?.classList.remove('is-folder-preview-open');
    document.body.classList.remove('skills-preview-open');
  }

  function initConstellation() {
    const section = document.getElementById('technical-skills');
    if (!section || section.dataset.constellationReady === 'true') return;
    section.dataset.constellationReady = 'true';

    const panel = section.querySelector('#constellationDetailPanel');
    const nodes = Array.from(section.querySelectorAll('.constellation-node'));
    const connections = Array.from(section.querySelectorAll('.constellation-connection'));
    if (!panel || !nodes.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeDomain = 'forensics';
    let pointerFrame = 0;

    const setScenePointer = (event) => {
      if (event.pointerType === 'touch' || reduceMotion.matches) return;
      const bounds = section.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
      const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        section.style.setProperty('--scene-tilt-x', `${(-y * 4.2).toFixed(2)}deg`);
        section.style.setProperty('--scene-tilt-y', `${(x * 5.5).toFixed(2)}deg`);
        section.style.setProperty('--scene-pan-x', `${(x * 9).toFixed(1)}px`);
        section.style.setProperty('--scene-pan-y', `${(y * 6).toFixed(1)}px`);
        section.style.setProperty('--panel-tilt-x', `${(-y * 1.8).toFixed(2)}deg`);
        section.style.setProperty('--panel-tilt-y', `${(x * 2.8).toFixed(2)}deg`);
        section.style.setProperty('--panel-pan-x', `${(x * 4).toFixed(1)}px`);
        section.style.setProperty('--panel-pan-y', `${(y * 3).toFixed(1)}px`);
        nodes.forEach((node, index) => {
          const depth = 1 + (index % 3) * 0.35;
          node.style.setProperty('--node-pan-x', `${(x * 9 * depth).toFixed(1)}px`);
          node.style.setProperty('--node-pan-y', `${(y * 7 * depth).toFixed(1)}px`);
          node.style.setProperty('--node-tilt-x', `${(-y * 4 * depth).toFixed(2)}deg`);
          node.style.setProperty('--node-tilt-y', `${(x * 5 * depth).toFixed(2)}deg`);
        });
      });
    };

    const resetScenePointer = () => {
      window.cancelAnimationFrame(pointerFrame);
      section.style.setProperty('--scene-tilt-x', '0deg');
      section.style.setProperty('--scene-tilt-y', '0deg');
      section.style.setProperty('--scene-pan-x', '0px');
      section.style.setProperty('--scene-pan-y', '0px');
      section.style.setProperty('--panel-tilt-x', '0deg');
      section.style.setProperty('--panel-tilt-y', '0deg');
      section.style.setProperty('--panel-pan-x', '0px');
      section.style.setProperty('--panel-pan-y', '0px');
      nodes.forEach((node) => {
        node.style.removeProperty('--node-pan-x');
        node.style.removeProperty('--node-pan-y');
        node.style.removeProperty('--node-tilt-x');
        node.style.removeProperty('--node-tilt-y');
      });
    };

    section.addEventListener('pointermove', setScenePointer, { passive: true });
    section.addEventListener('pointerleave', resetScenePointer, { passive: true });
    reduceMotion.addEventListener?.('change', resetScenePointer);

    const setActive = (domain, { preview = false } = {}) => {
      if (!DOMAIN_CONFIG[domain]) return;
      activeDomain = domain;
      nodes.forEach((node) => {
        const active = node.dataset.domain === domain;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      connections.forEach((line) => line.classList.toggle('is-active', line.dataset.domain === domain));
      if (!preview) renderDetail(domain, panel);
    };

    nodes.forEach((node) => {
      const domain = node.dataset.domain;
      const number = String(DOMAIN_ORDER.indexOf(domain) + 1).padStart(2, '0');
      node.insertAdjacentHTML('beforeend', `<span class="constellation-domain-number">${number}</span><span class="constellation-domain-description">${DOMAIN_DESCRIPTIONS[domain]}</span><span class="constellation-domain-action">VIEW EVIDENCE <i class="fas fa-arrow-right" aria-hidden="true"></i></span>`);
      node.addEventListener('focus', () => setActive(domain, { preview: true }));
      node.addEventListener('click', () => { setActive(domain); openPreview(section); });
      node.addEventListener('keydown', (event) => {
        const index = DOMAIN_ORDER.indexOf(domain);
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          const next = nodes.find((candidate) => candidate.dataset.domain === DOMAIN_ORDER[(index + 1) % DOMAIN_ORDER.length]);
          next?.focus();
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          const previous = nodes.find((candidate) => candidate.dataset.domain === DOMAIN_ORDER[(index - 1 + DOMAIN_ORDER.length) % DOMAIN_ORDER.length]);
          previous?.focus();
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActive(domain);
          openPreview(section);
        }
      });
    });

    section.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closePreview();
    });

    section.querySelectorAll('.constellation-skill-index-list [data-domain]').forEach((item) => {
      item.addEventListener('click', () => {
        const target = nodes.find((node) => node.dataset.domain === item.dataset.domain);
        target?.focus();
        setActive(item.dataset.domain);
      });
    });

    setActive(activeDomain);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConstellation, { once: true });
  } else {
    initConstellation();
  }
})();
