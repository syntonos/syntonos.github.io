/**
 * Helpers for showing a project's pictures.
 *
 * A project's pictures are listed in its file in content/projects/<category>/<project>.md:
 *   images   the home page (the Selected work pictures)
 *   cover    the tile on the category page (falls back to `images`)
 *   gallery  the carousel on the project page (pictures, plus videos)
 * Each item can be a plain picture name or { src, alt, caption }. By the time they get here the names have
 * already been turned into real paths (see src/data/projects.js).
 */
import { asset } from './dom.js';
import { imageManifest } from 'virtual:content';

const esc = (s) => String(s ?? '').replace(/"/g, '&quot;');

/** Turns ['a.jpg', { src, alt, caption }] into [{ src, alt, caption }] (alt defaults to the project title). */
const norm = (list, title) =>
  []
    .concat(list ?? [])
    .map((im) => (typeof im === 'string' ? { src: im, alt: title } : { alt: title, ...im }));

/** Home-page pictures (the rotating images in Selected work). */
export const imagesOf = (p) => norm(p.images, p.title).filter((im) => im.src);

/**
 * Category-page tile pictures. `cover` (one picture or a list) wins, so a project can use a different
 * picture here than on the home page. Without `cover`, the home-page `images` are used.
 */
export const coverOf = (p) => (p.cover ? norm(p.cover, p.title).filter((im) => im.src) : imagesOf(p));

/** Project-page carousel items (`gallery`): pictures and/or { video }. */
export const galleryOf = (p) => norm(p.gallery, p.title);

/**
 * An <img> tag for a picture. If the build made smaller copies of it (480 / 960 / 1600 px wide WebP), they are
 * offered through `srcset`, so each screen downloads only what it needs. `sizes` says how wide the picture is
 * shown (used to choose between the copies). The real width/height stop the page jumping while it loads.
 */
export function imgTag(src, alt = '', { sizes = '100vw', cls = '', extra = '' } = {}) {
  const info = imageManifest[src];
  const attrs = [`src="${asset(src)}"`, `alt="${esc(alt)}"`];
  if (info?.w && info?.h) attrs.push(`width="${info.w}" height="${info.h}"`);
  if (info?.variants?.length) {
    const set = [...info.variants.map((v) => `${asset(v.src)} ${v.w}w`), `${asset(src)} ${info.w}w`].join(
      ', ',
    );
    attrs.push(`srcset="${set}" sizes="${sizes}"`);
  }
  if (cls) attrs.push(`class="${cls}"`);
  if (extra) attrs.push(extra);
  return `<img ${attrs.join(' ')}>`;
}

/** CSS background for a tile: its cover picture if there is one, else the project's gradient. */
export function tileBg(p, angle) {
  const first = coverOf(p)[0];
  return first
    ? `background:url(${asset(first.src)}) center/cover`
    : `background:linear-gradient(${angle}deg,${p.colors[0]},${p.colors[1]})`;
}

/**
 * The stacked cards on the home page.
 * - With pictures: one card per picture, each keeping its own proportions (nothing cropped).
 * - Without pictures: three gradient placeholders.
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
    .map(
      (im, j) =>
        `<div class="card" data-p="${j}">${imgTag(im.src, im.alt, { sizes: '(max-width: 760px) 88vw, 460px' })}</div>`,
    )
    .join('');
}

/**
 * Category pages / "Next up": tiles with 2+ pictures fade through them while hovered
 * (or keyboard-focused), then return to the first picture.
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
