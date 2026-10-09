/**
 * Home page: the "Selected work" section.
 * Shows every project with `featured: true`, alternating image/text sides.
 */
import { $, $$ } from './dom.js';
import { projects } from '../data/projects.js';
import { stackHTML } from './media.js';
import { projectBody, plainSummary } from './markdown.js';
import { homeLinks, linkHTML } from './links.js';

/**
 * @param {Function} onLayout called when images finish loading, so the plane's
 *                            path can be recalculated for the new page height.
 */
export function renderFeatured(onLayout) {
  const work = $('#work');

  projects
    .filter((p) => p.featured)
    .forEach((p, n) => {
      const teaser = p.summary || plainSummary(projectBody(p));
      const links = homeLinks(p); // extra links shown under the text (see `home` / `linksOnHome` in projects.js)
      const article = document.createElement('article');
      article.className = 'proj' + (n % 2 ? ' rev' : ''); // .rev flips the sides
      article.innerHTML = `
        <div class="stack">${stackHTML(p)}</div>
        <div class="txt">
          <h3>${p.title}</h3>
          <p>${teaser}</p>
          <a class="ul" href="#/${p.category}/${p.slug}">View project</a>
          ${links.length ? `<div class="hl">${links.map(linkHTML).join('')}</div>` : ''}
        </div>`;
      work.appendChild(article);
    });

  $$('.stack').forEach(setupStack);
  $$('.stack img').forEach((img) => img.addEventListener('load', onLayout));
}

/** How long each image stays on screen before the next fades in (milliseconds). */
const ROTATE_EVERY = 4500;

/**
 * One image is shown at a time. With 2+ images they rotate automatically, pause while the mouse is over
 * them, and a click / tap moves to the next one. (Not used when the visitor prefers reduced motion.)
 */
function setupStack(stack) {
  const cards = $$('.card', stack);
  if (cards.length < 2) return stack.classList.add('single');

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;
  let hovered = false;
  // data-p is each card's position: 0 = the visible one, 1 = next up, ...
  const step = () => cards.forEach((c) => (c.dataset.p = (+c.dataset.p + 1) % cards.length));
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (reduceMotion || hovered) return;
    timer = setInterval(() => {
      if (!document.hidden) step(); // do not rotate in a background tab
    }, ROTATE_EVERY);
  };

  // only a real mouse pauses it (touch screens fire hover events on tap)
  stack.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    hovered = true;
    stop();
  });
  stack.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    hovered = false;
    start();
  });
  stack.addEventListener('click', () => {
    step();
    start(); // restart the countdown after a manual change
  });
  setTimeout(start, Math.random() * 1500); // stagger, so several stacks do not change at the same moment
}
