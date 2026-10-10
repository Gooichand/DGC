(() => {
  'use strict';

  function initSkillAtlas() {
    const atlas = document.querySelector('.skill-atlas');
    if (!atlas || atlas.dataset.ready === 'true') return;
    atlas.dataset.ready = 'true';

    const cards = Array.from(atlas.querySelectorAll('.skill-atlas-card'));
    const filters = Array.from(atlas.querySelectorAll('.skill-atlas-filter'));
    const search = atlas.querySelector('#skillAtlasSearch');
    const status = atlas.querySelector('#skillAtlasStatus');
    const empty = atlas.querySelector('.skill-atlas-empty');
    const total = cards.length;
    let activeDomain = 'all';
    let atlasOpen = false;
    const atlasToggle = atlas.querySelector('.skill-atlas-toggle');
    const atlasContent = atlas.querySelector('#skillAtlasContent');
    const atlasToggleLabel = atlas.querySelector('.skill-atlas-toggle-label');
    const atlasToggleIcon = atlasToggle?.querySelector('i');

    const setAtlasOpen = (open, moveFocus = false) => {
      atlasOpen = Boolean(open);
      atlas.classList.toggle('is-open', atlasOpen);
      atlasToggle?.setAttribute('aria-expanded', atlasOpen ? 'true' : 'false');
      if (atlasToggleLabel) atlasToggleLabel.textContent = atlasOpen ? 'Close atlas' : 'Open atlas';
      atlasToggleIcon?.classList.toggle('fa-chevron-up', atlasOpen);
      atlasToggleIcon?.classList.toggle('fa-chevron-down', !atlasOpen);
      if (atlasContent) atlasContent.hidden = !atlasOpen;
      if (!atlasOpen) {
        atlas.querySelectorAll('.skill-atlas-card.is-expanded').forEach((card) => card.classList.remove('is-expanded'));
        atlas.querySelectorAll('.skill-atlas-expand[aria-expanded="true"]').forEach((button) => {
          button.setAttribute('aria-expanded', 'false');
          button.textContent = 'Open details';
        });
      }
      if (moveFocus) atlasToggle?.focus();
    };

    atlasToggle?.addEventListener('click', () => setAtlasOpen(!atlasOpen));
    atlasToggle?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && atlasOpen) {
        event.preventDefault();
        setAtlasOpen(false, true);
      }
    });
    setAtlasOpen(false);

    const normalize = (value) => String(value || '').toLowerCase().trim();

    const update = () => {
      const query = normalize(search?.value);
      let visible = 0;

      cards.forEach((card) => {
        const matchesDomain = activeDomain === 'all' || card.dataset.domain === activeDomain;
        const matchesQuery = !query || normalize(card.dataset.search).includes(query);
        const shouldShow = matchesDomain && matchesQuery;
        card.hidden = !shouldShow;
        if (shouldShow) visible += 1;
      });

      if (empty) empty.hidden = visible !== 0;
      if (status) {
        status.textContent = query || activeDomain !== 'all'
          ? `${visible} of ${total} skill categories shown`
          : `${total} skill categories shown`;
      }
    };

    filters.forEach((filter) => {
      filter.addEventListener('click', () => {
        activeDomain = filter.dataset.filter || 'all';
        filters.forEach((candidate) => {
          const isActive = candidate === filter;
          candidate.classList.toggle('is-active', isActive);
          candidate.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        update();
      });
    });

    search?.addEventListener('input', update);

    cards.forEach((card) => {
      const expand = card.querySelector('.skill-atlas-expand');
      if (!expand) return;
      card.classList.remove('is-expanded');
      expand.setAttribute('aria-expanded', 'false');
      expand.textContent = 'Open details';
      expand.addEventListener('click', () => {
        const expanded = card.classList.toggle('is-expanded');
        expand.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        expand.textContent = expanded ? 'Collapse details' : 'Open details';
      });
      expand.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && card.classList.contains('is-expanded')) {
          card.classList.remove('is-expanded');
          expand.setAttribute('aria-expanded', 'false');
          expand.textContent = 'Open details';
          expand.focus();
        }
      });
    });

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillAtlas, { once: true });
  } else {
    initSkillAtlas();
  }
})();
