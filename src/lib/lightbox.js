/**
 * Lightbox: click a picture in a write-up, or the picture showing in a project's carousel, to see it large.
 * Arrow keys, the side buttons or a swipe move through the pictures of the same write-up / carousel; Esc, the
 * X, or a click outside the picture closes it. (On the home page a click still moves to the next image.)
 * A picture with a transparent background stays transparent: nothing is painted behind it.
 * Styles: ".lb" in style.css.
 */
const X = '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>';
const LEFT = '<svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg>';
const RIGHT = '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>';

let box;
let img;
let caption;
let group = [];
let at = 0;
let lastFocus = null;

function build() {
  box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Picture');
  box.innerHTML = `
    <button type="button" class="lb-x" aria-label="Close">${X}</button>
    <button type="button" class="lb-btn lb-prev" aria-label="Previous picture">${LEFT}</button>
    <figure><img alt="" draggable="false" /><figcaption></figcaption></figure>
    <button type="button" class="lb-btn lb-next" aria-label="Next picture">${RIGHT}</button>`;
  document.body.appendChild(box);
  img = box.querySelector('img');
  caption = box.querySelector('figcaption');

  box.querySelector('.lb-x').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(at - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(at + 1));
  // a click on the empty backdrop closes it (a click on the picture itself does not)
  box.addEventListener('click', (e) => {
    if (e.target === box || e.target.tagName === 'FIGURE') close();
  });
  // swipe sideways
  let startX = null;
  box.addEventListener('pointerdown', (e) => (startX = e.clientX));
  box.addEventListener('pointerup', (e) => {
    if (startX !== null && group.length > 1 && Math.abs(e.clientX - startX) > 50)
      show(at + (e.clientX < startX ? 1 : -1));
    startX = null;
  });
}

function show(i) {
  at = (i + group.length) % group.length; // wraps around
  const item = group[at];
  img.src = item.src;
  img.alt = item.alt;
  caption.textContent = item.cap;
  box.classList.toggle('single', group.length < 2);
}

function open(items, index) {
  if (!box) build();
  group = items;
  lastFocus = document.activeElement;
  show(index);
  box.classList.add('on');
  document.documentElement.classList.add('lb-open'); // stops the page behind from scrolling
  box.querySelector('.lb-x').focus({ preventScroll: true });
}

function close() {
  if (!box?.classList.contains('on')) return;
  box.classList.remove('on');
  document.documentElement.classList.remove('lb-open');
  lastFocus?.focus?.({ preventScroll: true });
}

export function initLightbox() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest?.('#page .md img, #page .car-stage .slide.on[data-kind="image"]');
    if (!target) return;
    const stage = target.closest('.car-stage');
    if (stage?.dataset.swiped === '1') return; // that was a swipe on the carousel, not a click
    e.preventDefault();
    const list = stage
      ? [...stage.querySelectorAll('.slide[data-kind="image"]')]
      : [...document.querySelectorAll('#page .md img')];
    open(
      list.map((el) => ({ src: el.getAttribute('src'), alt: el.alt, cap: el.dataset.cap || el.alt || '' })),
      list.indexOf(target),
    );
  });
  document.addEventListener('keydown', (e) => {
    if (!box?.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft' && group.length > 1) show(at - 1);
    if (e.key === 'ArrowRight' && group.length > 1) show(at + 1);
  });
}
