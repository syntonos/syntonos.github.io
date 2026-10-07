/**
 * Helpers for showing a project's images.
 * `images` in projects.js can be plain strings or { src, alt } objects.
 */
import { asset } from './dom.js';

const esc = (s) => String(s).replace(/"/g, '&quot;');

/** Turns ['a.jpg', { src, alt, caption }] into [{ src, alt, caption }] (alt defaults to the project title). */
const norm = (list, title) =>
  (list || []).map((im) => (typeof im === 'string' ? { src: im, alt: title } : { alt: title, ...im }));

/** Home-page images (the stacked cards). */
export const imagesOf = (p) => norm(p.images, p.title);

/**
 * Category-page tile images. `cover` (one path, one { src, alt }, or a list) wins, so a project can use a
 * different picture here than on the home page. Without `cover`, the home-page `images` are used.
 */
export const coverOf = (p) => (p.cover ? norm([].concat(p.cover), p.title) : imagesOf(p));

/** Project-page carousel images (`gallery`). */
export const galleryOf = (p) => norm(p.gallery, p.title);

/** CSS background for a tile: its cover image if there is one, else the project's gradient. */
export function tileBg(p, angle) {
  const first = coverOf(p)[0];
  return first
    ? `background:url(${asset(first.src)}) center/cover`
    : `background:linear-gradient(${angle}deg,${p.colors[0]},${p.colors[1]})`;
}

/**
 * The stacked cards on the home page.
 * - With images: one card per image, each keeping its own proportions (nothing cropped).
 * - Without images: three gradient placeholders.
 */
export function stackHTML(p) {
  const imgs = imagesOf(p);
  if (!imgs.length) {
    return [0, 1, 2]
      .map((j) => {
        const grad = `linear-gradient(${140 + j * 30}deg,${p.colors[j % 2]},${p.colors[(j + 1) % 2]})`;
        return `<div class="card ph" data-p="${j}" style="background:${grad}">Image ${j + 1}</div>`;
      })
      .join('');
  }
  return imgs
    .map((im, j) => `<div class="card" data-p="${j}"><img src="${asset(im.src)}" alt="${esc(im.alt)}"></div>`)
    .join('');
}

/**
 * Category pages / "Next up": tiles with 2+ images fade through them while hovered
 * (or keyboard-focused), then return to the first image.
 */
export function setupTileCycling(root = document) {
  root.querySelectorAll('.tile').forEach((tile) => {
    const imgs = [...tile.querySelectorAll('.ti img')];
    if (imgs.length < 2) return;
    let current = 0;
    let timer;
    const show = (n) => {
      imgs[current].classList.remove('on');
      current = n;
      imgs[current].classList.add('on');
    };
    const next = () => show((current + 1) % imgs.length);
    const start = () => {
      next();
      clearInterval(timer);
      timer = setInterval(next, 1000);
    };
    const stop = () => {
      clearInterval(timer);
      show(0);
    };
    tile.addEventListener('mouseenter', start);
    tile.addEventListener('mouseleave', stop);
    tile.addEventListener('focus', start);
    tile.addEventListener('blur', stop);
  });
}
