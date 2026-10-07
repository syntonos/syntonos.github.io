/**
 * Image carousel for project pages (the `gallery` field in src/data/projects.js).
 *
 * - Smart sizing: the picture box takes the shape of the current image, so nothing is cropped
 *   (very tall images are capped at 70% of the screen height and shown whole).
 * - Previous / next buttons, dots, swipe or drag, and the left / right arrow keys.
 * - Optional `caption` for each image, shown underneath.
 * Styles: ".car" in style.css.
 */
import { asset } from './dom.js';

// The dots run in a gradient from blue (first image) to lavender (last image). Change the two colors here.
const DOT_FROM = [126, 167, 242]; // blue
const DOT_TO = [201, 179, 255]; // lavender
function dotColor(i, count) {
  const t = count > 1 ? i / (count - 1) : 0;
  const [r, g, b] = DOT_FROM.map((from, k) => Math.round(from + (DOT_TO[k] - from) * t));
  return `rgb(${r}, ${g}, ${b})`;
}

const esc = (s) => String(s ?? '').replace(/"/g, '&quot;');
const arrow = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;

/** The carousel markup for a list of { src, alt, caption } images. */
export function carouselHTML(items) {
  const many = items.length > 1;
  const slides = items
    .map(
      (im, i) =>
        `<img class="${i ? '' : 'on'}" src="${asset(im.src)}" alt="${esc(im.alt)}" data-cap="${esc(im.caption)}" draggable="false" />`,
    )
    .join('');
  const controls = many
    ? `<div class="car-ui">
        <button type="button" class="car-btn car-prev" aria-label="Previous image">${arrow('M15 5 8 12l7 7')}</button>
        <span class="car-dots">${items.map((_, i) => `<button type="button" class="car-dot${i ? '' : ' on'}" style="--c:${dotColor(i, items.length)}" aria-label="Show image ${i + 1}"></button>`).join('')}</span>
        <button type="button" class="car-btn car-next" aria-label="Next image">${arrow('M9 5l7 7-7 7')}</button>
      </div>`
    : '';
  return `<div class="car" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Project images">
    <div class="car-stage">${slides}</div>
    <p class="car-cap">${esc(items[0].caption)}</p>
    ${controls}
  </div>`;
}

/** Makes every carousel inside `root` work. Call after the page HTML is in place. */
export function setupCarousels(root = document) {
  root.querySelectorAll('.car').forEach(setup);
}

function setup(car) {
  const stage = car.querySelector('.car-stage');
  const imgs = [...stage.querySelectorAll('img')];
  const dots = [...car.querySelectorAll('.car-dot')];
  const caption = car.querySelector('.car-cap');
  let current = 0;

  /** Smart sizing: make the box as tall as the current image needs (within 70% of the screen). */
  function fit() {
    const img = imgs[current];
    const ratio = img.naturalWidth ? img.naturalHeight / img.naturalWidth : 0.75;
    const height = Math.min(stage.clientWidth * ratio, innerHeight * 0.7);
    if (Math.abs(height - stage.clientHeight) > 1) stage.style.height = `${Math.round(height)}px`;
  }

  function show(n) {
    imgs[current].classList.remove('on');
    dots[current]?.classList.remove('on');
    current = (n + imgs.length) % imgs.length; // wraps around at both ends
    imgs[current].classList.add('on');
    dots[current]?.classList.add('on');
    caption.textContent = imgs[current].dataset.cap || '';
    fit();
  }

  imgs.forEach((img) => img.addEventListener('load', () => img === imgs[current] && fit()));
  new ResizeObserver(fit).observe(stage); // re-fit when the column changes width
  fit();
  if (imgs.length < 2) return;

  car.querySelector('.car-prev').addEventListener('click', () => show(current - 1));
  car.querySelector('.car-next').addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  car.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // swipe (touch) or drag (mouse) sideways
  let startX = null;
  stage.addEventListener('pointerdown', (e) => (startX = e.clientX));
  stage.addEventListener('pointerup', (e) => {
    if (startX !== null && Math.abs(e.clientX - startX) > 40) show(current + (e.clientX < startX ? 1 : -1));
    startX = null;
  });
  stage.addEventListener('pointercancel', () => (startX = null));
}
