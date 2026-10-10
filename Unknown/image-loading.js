(() => {
  'use strict';

  const bindImage = (image) => {
    if (!(image instanceof HTMLImageElement)) return;
    const source = image.getAttribute('src');
    const sourceSet = image.getAttribute('srcset') || '';
    const imageStateKey = `${source || ''}|${sourceSet}`;
    if (!source || image.dataset.boundImageState === imageStateKey) return;

    image.dataset.boundImageState = imageStateKey;
    image.classList.remove('image-ready', 'image-error');
    image.classList.add('image-pending');
    image.setAttribute('aria-busy', 'true');

    const markReady = () => {
      image.classList.remove('image-pending', 'image-error');
      image.classList.add('image-ready');
      image.setAttribute('aria-busy', 'false');
    };

    const markError = () => {
      image.classList.remove('image-pending', 'image-ready');
      image.classList.add('image-error');
      image.setAttribute('aria-busy', 'false');
    };

    image.addEventListener('load', markReady, { once: true });
    image.addEventListener('error', markError, { once: true });

    const settleLoadedState = () => {
      if (!image.complete) return;
      if (image.naturalWidth > 0) markReady();
      else markError();
    };

    settleLoadedState();
    requestAnimationFrame(settleLoadedState);
  };

  const scan = (root) => {
    if (!root) return;
    if (root instanceof HTMLImageElement) bindImage(root);
    root.querySelectorAll?.('img').forEach(bindImage);
  };

  const init = () => {
    scan(document);
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === 'attributes' && record.target instanceof HTMLImageElement) {
          bindImage(record.target);
          return;
        }
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) scan(node);
        });
      });
    });
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
