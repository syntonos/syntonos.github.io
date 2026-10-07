/**
 * Custom scrollbar: a dotted line with a small flat 2D paper plane as the draggable thumb.
 *
 * - Only used with a mouse or trackpad. Touch devices keep their normal scrolling.
 * - Drag the plane, or click anywhere on the dotted line to jump there.
 * - Styles are in "9. CURSOR + SCROLLBAR" in style.css.
 */
export function initScrollbar() {
  // Use it whenever any mouse/trackpad is available (laptops with touch screens included).
  // Phones and tablets with only touch keep their normal scrolling.
  const hasMouse = matchMedia('(any-pointer: fine)').matches || matchMedia('(any-hover: hover)').matches;
  if (!hasMouse) return;
  document.documentElement.classList.add('custom-scroll'); // hides the native scrollbar

  const bar = document.createElement('div');
  bar.id = 'scrollbar';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = `
    <svg class="sb-track" width="6" height="100%">
      <line x1="3" y1="0" x2="3" y2="100%" />
    </svg>
    <div class="sb-thumb">
      <svg viewBox="0 0 20 32" width="20" height="32">
        <polygon points="10,31 2,4 10,12.5" fill="#ffffff" />
        <polygon points="10,31 10,12.5 18,4" fill="#c4c4cb" />
      </svg>
    </div>`;
  document.body.appendChild(bar);
  const thumb = bar.querySelector('.sb-thumb');

  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const travel = () => Math.max(1, bar.clientHeight - thumb.offsetHeight); // how far the plane can move

  /** Put the plane where the page currently is. */
  function update() {
    const max = maxScroll();
    bar.classList.toggle('off', max < 8); // nothing to scroll: hide it
    // on the main page the bar stays hidden until you are past the cover (same moment the top bar appears)
    const onCover = document.body.classList.contains('is-home') && scrollY < innerHeight * 0.8;
    bar.classList.toggle('away', onCover);
    const progress = max > 0 ? scrollY / max : 0;
    thumb.style.transform = `translateY(${progress * travel()}px)`;
  }

  // ---- drag the plane ----
  let dragging = false;
  let grabOffset = 0; // where on the plane you grabbed it
  thumb.addEventListener('pointerdown', (e) => {
    dragging = true;
    grabOffset = e.clientY - thumb.getBoundingClientRect().top;
    thumb.setPointerCapture(e.pointerId);
    bar.classList.add('drag');
    e.preventDefault();
  });
  thumb.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const top = bar.getBoundingClientRect().top;
    const progress = Math.min(1, Math.max(0, (e.clientY - grabOffset - top) / travel()));
    window.scrollTo({ top: progress * maxScroll(), behavior: 'instant' });
  });
  const stopDrag = () => {
    dragging = false;
    bar.classList.remove('drag');
  };
  thumb.addEventListener('pointerup', stopDrag);
  thumb.addEventListener('pointercancel', stopDrag);

  // ---- click on the dotted line to jump ----
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.sb-thumb')) return;
    const top = bar.getBoundingClientRect().top;
    const progress = Math.min(1, Math.max(0, (e.clientY - top - thumb.offsetHeight / 2) / travel()));
    window.scrollTo({ top: progress * maxScroll(), behavior: 'smooth' });
  });

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  addEventListener('hashchange', () => requestAnimationFrame(update)); // page switched
  new ResizeObserver(update).observe(document.documentElement); // page height changes (new page, images loading)
  update();
}
