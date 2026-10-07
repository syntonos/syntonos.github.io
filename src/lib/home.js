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

/** Cycle the cards on hover (desktop) or tap (mobile). One image = nothing to cycle. */
function setupStack(stack) {
  const cards = $$('.card', stack);
  if (cards.length < 2) return stack.classList.add('single');

  let timer;
  // data-p is each card's position in the stack: 0 = front, 1 = next, ...
  const step = () => cards.forEach((c) => (c.dataset.p = (+c.dataset.p + 1) % cards.length));
  stack.addEventListener('mouseenter', () => {
    step();
    timer = setInterval(step, 1300);
  });
  stack.addEventListener('mouseleave', () => clearInterval(timer));
  stack.addEventListener('click', step);
}
