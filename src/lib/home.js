import { $, $$ } from './dom.js';
import { projects } from '../data/projects.js';
import { cardBg } from './pages.js';

// "Selected work": every project with `featured: true`, alternating sides.
export function renderFeatured() {
  const work = $('#work');
  projects.filter((p) => p.featured).forEach((p, n) => {
    const d = document.createElement('article');
    d.className = 'proj' + (n % 2 ? ' rev' : '');
    d.innerHTML = `<div class="stack">${[0, 1, 2].map((j) => `<div class="card" data-p="${j}" style="${cardBg(p, j)}">${p.images && p.images[j] ? '' : 'Image ' + (j + 1)}</div>`).join('')}</div>
<div class="txt"><h3>${p.title}</h3><p>${p.summary || p.description}</p><a class="ul" href="#/${p.category}/${p.slug}">View project</a></div>`;
    work.appendChild(d);
  });
  // stacked images cycle on hover (and on tap)
  $$('.stack').forEach((st) => {
    const cs = $$('.card', st);
    let t;
    const step = () => cs.forEach((c) => (c.dataset.p = (+c.dataset.p + 1) % 3));
    st.addEventListener('mouseenter', () => { step(); t = setInterval(step, 1300); });
    st.addEventListener('mouseleave', () => clearInterval(t));
    st.addEventListener('click', step);
  });
}
