(() => {
  'use strict';

  function initExperienceCoverflow() {
    const root = document.querySelector('.experience-coverflow-section');
    if (!root || root.dataset.ready === 'true') return;
    root.dataset.ready = 'true';

    const cards = Array.from(root.querySelectorAll('.experience-cover'));
    const filters = Array.from(root.querySelectorAll('.experience-coverflow-filter'));
    const viewport = root.querySelector('.experience-coverflow-viewport');
    const previous = root.querySelector('[data-coverflow-action="previous"]');
    const next = root.querySelector('[data-coverflow-action="next"]');
    const dots = root.querySelector('.experience-coverflow-dots');
    const status = root.querySelector('.experience-coverflow-status');
    const detail = {
      role: root.querySelector('[data-detail="role"]'),
      organization: root.querySelector('[data-detail="organization"]'),
      date: root.querySelector('[data-detail="date"]'),
      category: root.querySelector('[data-detail="category"]'),
      summary: root.querySelector('[data-detail="summary"]'),
      evidence: root.querySelector('[data-detail="evidence"]'),
      icon: root.querySelector('[data-detail="icon"]'),
    };

    let activeFilter = 'all';
    let visibleCards = cards.slice();
    let activeIndex = 0;
    let touchStartX = null;

    const setText = (element, value) => {
      if (element) element.textContent = value || '';
    };

    const setEvidence = (value) => {
      if (!detail.evidence) return;
      detail.evidence.replaceChildren();
      String(value || '').split('|').map((item) => item.trim()).filter(Boolean).forEach((item) => {
        const tag = document.createElement('span');
        tag.textContent = item;
        detail.evidence.appendChild(tag);
      });
    };

    const getOffsetStyle = (distance) => {
      const spread = Math.min(360, Math.max(180, (viewport?.clientWidth || 1000) * 0.25));
      const positions = {
        '-2': { x: `${-spread * 1.55}px`, z: '-120px', rot: '8deg', scale: '0.72', opacity: '0' },
        '-1': { x: `${-spread * 0.82}px`, z: '-32px', rot: '5deg', scale: '0.88', opacity: '0.72' },
        '0': { x: '0px', z: '42px', rot: '0deg', scale: '1', opacity: '1' },
        '1': { x: `${spread * 0.82}px`, z: '-32px', rot: '-5deg', scale: '0.88', opacity: '0.72' },
        '2': { x: `${spread * 1.55}px`, z: '-120px', rot: '-8deg', scale: '0.72', opacity: '0' },
      };
      return positions[String(Math.max(-2, Math.min(2, distance)))] || positions['2'];
    };

    const renderDots = () => {
      if (!dots) return;
      dots.replaceChildren();
      visibleCards.forEach((card, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.className = `experience-coverflow-dot${index === activeIndex ? ' is-active' : ''}`;
        dot.setAttribute('aria-label', `Show experience ${index + 1}: ${card.dataset.role || ''}`);
        dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
        dot.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false');
        dot.addEventListener('click', () => select(index));
        dots.appendChild(dot);
      });
    };

    const updateDetail = () => {
      const card = visibleCards[activeIndex];
      if (!card) return;
      setText(detail.role, card.dataset.role);
      setText(detail.organization, card.dataset.organization);
      setText(detail.date, card.dataset.date);
      setText(detail.category, card.dataset.category);
      setText(detail.summary, card.dataset.summary);
      setEvidence(card.dataset.evidence);
      if (detail.icon) {
        detail.icon.className = card.dataset.icon || 'fas fa-briefcase';
        detail.icon.style.color = getComputedStyle(card).getPropertyValue('--exp-accent').trim();
      }
      if (status) status.textContent = `${activeIndex + 1} / ${visibleCards.length} selected`;
    };

    function select(index, moveFocus = false) {
      if (!visibleCards.length) return;
      activeIndex = (index + visibleCards.length) % visibleCards.length;
      const activeCard = visibleCards[activeIndex];
      cards.forEach((card) => {
        card.classList.remove('is-active');
        card.setAttribute('aria-current', 'false');
        card.tabIndex = -1;
        card.hidden = !visibleCards.includes(card);
      });
      visibleCards.forEach((card, indexInView) => {
        const distance = indexInView - activeIndex;
        const absoluteDistance = Math.abs(distance);
        const style = getOffsetStyle(distance);
        const isActive = indexInView === activeIndex;
        const isVisible = absoluteDistance <= 1;
        card.style.setProperty('--exp-x', style.x);
        card.style.setProperty('--exp-z', style.z);
        card.style.setProperty('--exp-rot', style.rot);
        card.style.setProperty('--exp-scale', style.scale);
        card.style.setProperty('--exp-opacity', style.opacity);
        card.style.zIndex = String(10 - absoluteDistance);
        card.classList.toggle('is-active', isActive);
        card.classList.toggle('is-near', !isActive && isVisible);
        card.setAttribute('aria-current', isActive ? 'true' : 'false');
        card.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
        card.tabIndex = isActive ? 0 : -1;
        card.hidden = !isVisible;
      });
      updateDetail();
      renderDots();
      if (moveFocus) activeCard?.focus();
    }

    const applyFilter = (filter) => {
      activeFilter = filter || 'all';
      filters.forEach((button) => {
        const isActive = button.dataset.filter === activeFilter;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      visibleCards = cards.filter((card) => activeFilter === 'all' || card.dataset.categoryKey === activeFilter);
      activeIndex = 0;
      root.classList.toggle('has-results', visibleCards.length > 0);
      select(0);
    };

    filters.forEach((filter) => filter.addEventListener('click', () => applyFilter(filter.dataset.filter)));
    previous?.addEventListener('click', () => select(activeIndex - 1));
    next?.addEventListener('click', () => select(activeIndex + 1));

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const index = visibleCards.indexOf(card);
        if (index >= 0) select(index, true);
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); select(activeIndex - 1, true); }
        if (event.key === 'ArrowRight') { event.preventDefault(); select(activeIndex + 1, true); }
        if (event.key === 'Home') { event.preventDefault(); select(0, true); }
        if (event.key === 'End') { event.preventDefault(); select(visibleCards.length - 1, true); }
      });
    });

    viewport?.addEventListener('pointerdown', (event) => { touchStartX = event.clientX; });
    viewport?.addEventListener('pointerup', (event) => {
      if (touchStartX === null) return;
      const delta = event.clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) > 42) select(activeIndex + (delta < 0 ? 1 : -1));
    });
    viewport?.addEventListener('pointercancel', () => { touchStartX = null; });

    root.querySelectorAll('.experience-coverflow-action').forEach((action) => {
      action.addEventListener('click', (event) => event.stopPropagation());
    });

    applyFilter('all');
    const initialIndex = Number.parseInt(root.dataset.initialIndex || '0', 10);
    if (Number.isInteger(initialIndex) && initialIndex >= 0 && initialIndex < visibleCards.length) select(initialIndex);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExperienceCoverflow, { once: true });
  } else {
    initExperienceCoverflow();
  }
})();
