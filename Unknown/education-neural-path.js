(() => {
  'use strict';

  const EDUCATION_IMAGE_SIZES = {
    'images/school.webp': [1536, 1021],
    'images/stjopfor-edus.webp': [1307, 946],
    'images/sandipforeduse.webp': [1600, 666]
  };

  const initEducationNeuralPath = () => {
    const section = document.querySelector('.education-neural-section');
    if (!section) return;

    const nodes = Array.from(section.querySelectorAll('.education-neural-node'));
    const activePanel = section.querySelector('.education-neural-active');
    const activeTitle = section.querySelector('#education-neural-active-title');
    const activeSchool = section.querySelector('#education-neural-active-school');
    const activeSpecialization = section.querySelector('#education-neural-active-specialization');
    const activeLocation = section.querySelector('#education-neural-active-location');
    const activeDate = section.querySelector('#education-neural-active-date');
    const activeStatus = section.querySelector('#education-neural-active-status');
    const activeImage = section.querySelector('#education-neural-active-image');
    const activeImageButton = section.querySelector('#education-neural-active-image-button');
    const activeTags = section.querySelector('#education-neural-active-tags');
    const activeSignal = section.querySelector('#education-neural-active-signal');
    const activeNode = section.querySelector('#education-neural-active-node');
    const footerNode = section.querySelector('#education-neural-footer-node');

    if (!nodes.length || !activePanel) return;

    nodes.forEach((node) => node.style.setProperty('--node-color', node.dataset.color || 'var(--forensic-green)'));

    let activeIndex = Math.max(0, nodes.findIndex((node) => node.dataset.active === 'true'));
    if (activeIndex < 0) activeIndex = nodes.length - 1;

    const setActive = (nextIndex, shouldFocus = false) => {
      activeIndex = (nextIndex + nodes.length) % nodes.length;
      const node = nodes[activeIndex];
      const data = node.dataset;

      nodes.forEach((item, index) => {
        const isActive = index === activeIndex;
        item.classList.toggle('is-active', isActive);
        item.dataset.active = isActive ? 'true' : 'false';
        item.setAttribute('aria-pressed', String(isActive));
      });

      activePanel.style.setProperty('--active-color', data.color || 'var(--forensic-amber)');
      activePanel.dataset.activeIndex = String(activeIndex);
      activeTitle.textContent = `${data.short} · ${data.title}`;
      activeSchool.textContent = data.school;
      activeSpecialization.textContent = data.specialization;
      activeLocation.textContent = data.location;
      activeDate.textContent = data.date;
      activeStatus.textContent = data.status;
      activeSignal.textContent = data.status === 'Currently Studying' ? 'ACTIVE' : 'VERIFIED';
      activeImage.removeAttribute('src');
      activeImage.src = data.image;
      /* The browser prefers srcset over src, so the responsive sources must be
         updated too — otherwise the image never actually changes. */
      activeImage.srcset = `${data.image.replace(/\.webp$/, '-320.webp')} 320w, ${data.image.replace(/\.webp$/, '-640.webp')} 640w`;
      activeImage.alt = `${data.school} campus evidence`;
      const [activeWidth, activeHeight] = EDUCATION_IMAGE_SIZES[data.image] || [1600, 900];
      activeImage.width = activeWidth;
      activeImage.height = activeHeight;
      activeImageButton.dataset.image = data.image;
      activeImageButton.dataset.title = data.school;
      activeNode.textContent = data.short;
      if (footerNode) footerNode.textContent = data.short;

      activeTags.replaceChildren();
      (data.tags || '').split('|').filter(Boolean).forEach((tag) => {
        const chip = document.createElement('span');
        chip.className = 'education-neural-active-fact';
        chip.textContent = tag;
        activeTags.appendChild(chip);
      });

      if (shouldFocus) node.focus({ preventScroll: true });
    };

    nodes.forEach((node, index) => {
      node.addEventListener('click', (event) => {
        setActive(index);
        if (event.target.closest('.education-neural-orb')) {
          const data = node.dataset;
          if (typeof window.openEducationModal === 'function') {
            window.openEducationModal(data.image, data.school);
          }
        }
      });
      node.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'touch') setActive(index);
      });
      node.addEventListener('mouseenter', () => setActive(index));
      node.addEventListener('focus', () => setActive(index));
      node.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          setActive(index + 1, true);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          setActive(index - 1, true);
        } else if (event.key === 'Home') {
          event.preventDefault();
          setActive(0, true);
        } else if (event.key === 'End') {
          event.preventDefault();
          setActive(nodes.length - 1, true);
        }
      });
    });

    activeImageButton.addEventListener('click', () => {
      const image = activeImageButton.dataset.image;
      const title = activeImageButton.dataset.title;
      if (typeof window.openEducationModal === 'function') {
        window.openEducationModal(image, title);
      }
    });

    section.querySelectorAll('.education-neural-signal').forEach((signal) => {
      signal.setAttribute('aria-label', `${signal.textContent.trim()} learning signal`);
    });

    setActive(activeIndex);
  };

  window.openEducationModal = (imageSrc, title) => {
    const modal = document.getElementById('educationModal');
    const modalImage = document.getElementById('educationModalImage');
    const modalTitle = document.getElementById('educationModalTitle');
    if (!modal || !modalImage || !modalTitle) return;

    modalImage.src = imageSrc;
    modalImage.alt = `${title} campus evidence`;
    const [modalWidth, modalHeight] = EDUCATION_IMAGE_SIZES[imageSrc] || [1600, 900];
    modalImage.width = modalWidth;
    modalImage.height = modalHeight;
    modalImage.loading = 'eager';
    modalImage.fetchPriority = 'high';
    modalImage.decoding = 'async';
    modalTitle.textContent = title;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEducationNeuralPath, { once: true });
  } else {
    initEducationNeuralPath();
  }
})();
