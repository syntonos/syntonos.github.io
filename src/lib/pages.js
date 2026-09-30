import { site } from '../data/site.js';
import { categories, projects, scoreLabels } from '../data/projects.js';
import { awards, resume } from '../data/pages.js';
import { asset } from './dom.js';

const inCat = (k) => projects.filter((p) => p.category === k);
const find = (cat, slug) => projects.find((p) => p.category === cat && p.slug === slug);
const rows = (a) => a.map((r) => `<div class="row"><span>${r[0]}</span><i>${r[1]}</i></div>`).join('');
const back = (h, t) => `<a class="back" href="${h}">← ${t}</a>`;
const ext = 'target="_blank" rel="noopener"';

// Background for a project: first image if provided, else its gradient.
export const tileBg = (p, angle) => {
  const im = p.images && p.images[0];
  return im ? `background:url(${asset(im)}) center/cover` : `background:linear-gradient(${angle}deg,${p.colors[0]},${p.colors[1]})`;
};
export const cardBg = (p, j) => {
  const im = p.images && p.images[j];
  return im ? `background:url(${asset(im)}) center/cover` : `background:linear-gradient(${140 + j * 30}deg,${p.colors[j % 2]},${p.colors[(j + 1) % 2]})`;
};
const tile = (p) =>
  `<a class="tile" href="#/${p.category}/${p.slug}" style="${tileBg(p, 120 + inCat(p.category).indexOf(p) * 25)}"><b>${p.title}</b><small>${categories[p.category].title}, ${p.year}</small></a>`;

function catPage(k) {
  const c = categories[k], items = inCat(k);
  let h = `<h1 class="pt">${c.title}</h1><p class="lead">${c.blurb}</p>`;
  // blocks of 4 tiles: 2x2 + (1x2,1x1,1x1) / (2x1,1x1,1x1) / mirrored, cycling
  for (let b = 0; b * 4 < items.length; b++) {
    h += `<div class="blk v${b % 3}">${items.slice(b * 4, b * 4 + 4).map(tile).join('')}</div>`;
  }
  return h;
}

function projPage(k, slug) {
  const p = find(k, slug);
  if (!p) return notFound();
  const next = projects.filter((q) => q !== p).sort(() => Math.random() - 0.5).slice(0, 3);
  const scores = p.scores
    ? `<div class="sc">${scoreLabels.map(([key, label, desc]) => `<div class="box" tabindex="0" onclick="this.classList.toggle('open')"><div class="l">${label}</div><div class="n">${p.scores[key]}<span>/10</span></div><div class="d">${desc}</div></div>`).join('')}</div>`
    : '';
  const skills = p.skills && p.skills.length ? `<p class="sk">${p.skills.join(' · ')}</p>` : '';
  const links = p.wiki || p.github
    ? `<div class="lk">${p.wiki ? `<a class="ul" href="${p.wiki}" ${ext}>Wiki page</a>` : '<span></span>'}${p.github ? `<a class="ul" href="${p.github}" ${ext}>GitHub repo</a>` : '<span></span>'}</div>`
    : '';
  const link = p.link ? `<p style="margin-top:40px"><a class="ul" href="${p.link.url}" ${ext}>${p.link.label}</a></p>` : '';
  return `${back('#/' + k, categories[k].title)}<h1 class="pt">${p.title}</h1><p class="meta">${categories[k].title}, ${p.year}</p>
${scores}<p class="body">${p.description}</p>${skills}${links}${link}
<h2 class="h3" style="margin-top:84px">Next up</h2><div class="sug">${next.map(tile).join('')}</div>`;
}

const notFound = () => `<h1 class="pt">Not found</h1>${back('#/', 'Home')}`;

function awardsPage() {
  return `<h1 class="pt">Awards</h1>${awards.map((a) => `<div class="aw"><span>${a.name}</span><span>${a.issuer}</span><span>${a.year}</span></div>`).join('')}`;
}

function resumePage() {
  const r = resume;
  const dl = r.pdf ? `href="${asset(r.pdf)}" download` : 'href="#/resume"';
  return `<h1 class="pt">Resume</h1><p class="lead">${r.intro}</p>
<a class="rz dl" ${dl} style="max-width:460px;margin:0 auto 26px" aria-label="Download PDF"><span>Download PDF</span><svg viewBox="0 0 24 24"><path d="M12 4v13"/><path d="M6 12l6 6 6-6"/></svg></a>
<p class="body" style="margin:0 0 40px">Contact me through <a class="ul" href="mailto:${site.email}">email</a>, <a class="ul" href="${site.links.Instagram}" ${ext}>instagram</a>, or <a class="ul" href="${site.links.LinkedIn}" ${ext}>linkedin</a>.</p>
<p class="h3">Experience</p>${rows(r.experience)}<p class="h3">Education</p>${rows(r.education)}<p class="h3">Skills</p><p class="body">${r.skills}</p>
<div class="two" style="margin-top:28px"><div><h2 class="h3">Activities</h2>${rows(r.activities)}</div><div><h2 class="h3">Side quests</h2>${rows(r.sideQuests)}</div></div>`;
}

// route parts, e.g. ['hardware','bench-power-supply']
export function renderPage(p) {
  if (categories[p[0]]) return p[1] ? projPage(p[0], p[1]) : catPage(p[0]);
  if (p[0] === 'awards') return awardsPage();
  if (p[0] === 'resume') return resumePage();
  return notFound();
}
