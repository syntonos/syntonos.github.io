/**
 * Slide carousel for project pages (the `gallery` setting in a project file).
 *
 * A gallery item can be:
 *   - a picture:                    'photo.jpg'   or   { src: 'photo.jpg', caption: 'Front view' }
 *   - a YouTube / Vimeo video:      { video: 'https://www.youtube.com/watch?v=...', caption: '...' }
 *   - a short looping clip (mp4):   { video: 'demo.mp4', caption: '...' }   (plays muted, on a loop)
 *
 * - Smart sizing: the box takes the shape of the current slide, so nothing is cropped
 *   (very tall slides are capped at 70% of the screen height and shown whole).
 * - Previous / next buttons, dots, swipe or drag, and the left / right arrow keys.
 * - Only the slide in view plays, and a video that is moved away from stops.
 * Styles: ".car" in style.css.
 */
import { asset } from './dom.js';
import { imgTag } from './media.js';

const esc = (s) => String(s ?? '').replace(/"/g, '&quot;');
const arrow = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;

// The dots run in a gradient from blue (first slide) to lavender (last slide). Change the two colors here.
const DOT_FROM = [126, 167, 242]; // blue
const DOT_TO = [201, 179, 255]; // lavender
function dotColor(i, count) {
  const t = count > 1 ? i / (count - 1) : 0;
  const [r, g, b] = DOT_FROM.map((from, k) => Math.round(from + (DOT_TO[k] - from) * t));
  return `rgb(${r}, ${g}, ${b})`;
}

/** A YouTube or Vimeo link -> the address to put in an embedded player (or null for anything else). */
function embedUrl(url) {
  const yt = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i.exec(url);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  const vi = /vimeo\.com\/(?:video\/)?(\d+)/i.exec(url);
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
  return null;
}

/** The markup of one slide. */
function slideHTML(item, i) {
  const cls = `slide${i ? '' : ' on'}`;
  const data = `data-cap="${esc(item.caption)}"`;
  if (item.video) {
    const embed = embedUrl(item.video);
    if (embed) {
      // the player is only loaded while its slide is showing (see setup)
      return `<iframe class="${cls}" data-kind="embed" data-src="${esc(embed)}" ${i ? '' : `src="${esc(embed)}"`} ${data}
        title="${esc(item.alt || item.caption || 'Video')}" allowfullscreen loading="lazy"
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    }
    return `<video class="${cls}" data-kind="video" src="${asset(item.video)}" ${data} muted loop playsinline preload="metadata"
      aria-label="${esc(item.alt || item.caption || 'Video')}"></video>`;
  }
  return imgTag(item.src, item.alt, {
    cls,
    sizes: '(max-width: 760px) 100vw, 560px',
    extra: `data-kind="image" ${data} draggable="false"`,
  });
}

/** The carousel markup for a list of gallery items. */
export function carouselHTML(items) {
  const many = items.length > 1;
  const controls = many
    ? `<div class="car-ui">
        <button type="button" class="car-btn car-prev" aria-label="Previous slide">${arrow('M15 5 8 12l7 7')}</button>
        <span class="car-dots">${items.map((_, i) => `<button type="button" class="car-dot${i ? '' : ' on'}" style="--c:${dotColor(i, items.length)}" aria-label="Show slide ${i + 1}"></button>`).join('')}</span>
        <button type="button" class="car-btn car-next" aria-label="Next slide">${arrow('M9 5l7 7-7 7')}</button>
      </div>`
    : '';
  return `<div class="car" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Project pictures">
    <div class="car-stage">${items.map(slideHTML).join('')}</div>
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
  const slides = [...stage.querySelectorAll('.slide')];
  const dots = [...car.querySelectorAll('.car-dot')];
  const caption = car.querySelector('.car-cap');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;

  /** height / width of a slide (a player is 16:9) */
  function ratioOf(slide) {
    const kind = slide.dataset.kind;
    if (kind === 'embed') return 9 / 16;
    if (kind === 'video') return slide.videoWidth ? slide.videoHeight / slide.videoWidth : 9 / 16;
    return slide.naturalWidth ? slide.naturalHeight / slide.naturalWidth : 0.75;
  }

  /** Smart sizing: make the box as tall as the current slide needs (within 70% of the screen). */
  function fit() {
    const height = Math.min(stage.clientWidth * ratioOf(slides[current]), innerHeight * 0.7);
    if (Math.abs(height - stage.clientHeight) > 1) stage.style.height = `${Math.round(height)}px`;
  }

  /** Start what plays on a slide that comes into view. */
  function activate(slide) {
    if (slide.dataset.kind === 'embed' && !slide.getAttribute('src'))
      slide.setAttribute('src', slide.dataset.src);
    if (slide.dataset.kind === 'video') {
      if (reduceMotion) slide.controls = true;
      else slide.play().catch(() => {});
    }
  }

  /** Stop what plays on a slide that leaves. */
  function deactivate(slide) {
    if (slide.dataset.kind === 'embed') slide.removeAttribute('src'); // unloads the player, which stops it
    if (slide.dataset.kind === 'video') slide.pause();
  }

  function show(n) {
    slides[current].classList.remove('on');
    dots[current]?.classList.remove('on');
    deactivate(slides[current]);
    current = (n + slides.length) % slides.length; // wraps around at both ends
    slides[current].classList.add('on');
    dots[current]?.classList.add('on');
    activate(slides[current]);
    caption.textContent = slides[current].dataset.cap || '';
    fit();
  }

  slides.forEach((s) => {
    s.addEventListener('load', () => s === slides[current] && fit()); // pictures
    s.addEventListener('loadedmetadata', () => s === slides[current] && fit()); // clips
  });
  new ResizeObserver(fit).observe(stage); // re-fit when the column changes width
  fit();
  activate(slides[0]);
  if (slides.length < 2) return;

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
