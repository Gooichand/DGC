/* Self-check for the Certifications 3D fan.
 *
 * Regression guard: the five featured cards are laid out with vw-based widths,
 * but the section has fixed horizontal padding that vw knows nothing about.
 * If 5 * cardWidth + 4 * gap + sectionPadding ever exceeds the viewport, the
 * outer cards get silently clipped by `.forensic-certs { overflow: hidden }`
 * and the 3D fan loses its two ends. That bug shipped once; this catches it.
 *
 * Run from the console at any window size:   __fcFitCheck()
 * Expected: { ok: true, overflowPx <= 0 } on every desktop width (>= 861px).
 */
window.__fcFitCheck = function () {
  var section = document.querySelector('.forensic-certs');
  var stage = section && section.querySelector('.forensic-certs__stage');
  if (!stage) return { ok: null, reason: 'certifications section not built yet' };

  var scs = getComputedStyle(section);
  var padding = parseFloat(scs.paddingLeft) + parseFloat(scs.paddingRight);
  var available = stage.getBoundingClientRect().width;

  var visible = [].filter.call(stage.children, function (el) {
    return el.classList.contains('fc-card') && getComputedStyle(el).display !== 'none';
  });
  var stageStyle = getComputedStyle(stage);
  var isRow = stageStyle.flexDirection.indexOf('row') === 0;
  var gap = parseFloat(isRow ? stageStyle.columnGap : stageStyle.rowGap) || 0;
  var cardWidth = visible.length
    ? parseFloat(getComputedStyle(visible[0]).width)
    : 0;

  /* Row: every card plus every gap must fit the content box.
     Column: only the card width has to fit (the axis is vertical). */
  var need = isRow
    ? visible.length * cardWidth + Math.max(0, visible.length - 1) * gap
    : Math.max.apply(null, visible.map(function (el) {
        return parseFloat(getComputedStyle(el).width);
      }).concat([0]));
  var overflowPx = Math.round(need - available);

  return {
    ok: overflowPx <= 0,
    overflowPx: overflowPx,
    viewportW: window.innerWidth,
    layout: isRow ? 'row' : 'column',
    availableW: Math.round(available),
    needW: Math.round(need),
    sectionPadding: padding,
    gap: +gap.toFixed(2),
    cardWidth: +cardWidth.toFixed(2),
    visibleCards: visible.length,
    /* per-position projected width — all five must differ from the layout width,
       otherwise perspective/transform is not being applied to that card */
    projected: visible.map(function (el) {
      return el.getAttribute('data-pos') + ':' +
        Math.round(el.getBoundingClientRect().width) + '/' + Math.round(cardWidth);
    })
  };
};
