/**
 * Subpage templates: category pages, project pages, awards and resume.
 * `renderPage(routeParts)` returns the HTML string for the current route.
 */
import { site } from '../data/site.js';
import { categories, projects, scoreLabels } from '../data/projects.js';
import { awards, resume } from '../data/pages.js';
import { asset } from './dom.js';
import { coverOf, galleryOf, tileBg } from './media.js';
import { carouselHTML } from './carousel.js';
import { projectBody, renderMarkdown } from './markdown.js';
import { projectLinks, linkHTML } from './links.js';

// ---------- small helpers ----------
const EXTERNAL = 'target="_blank" rel="noopener"';
const inCategory = (key) => projects.filter((p) => p.category === key);
const backLink = (href, text) => `<a class="back" href="${href}">← ${text}</a>`;
const notFound = () => `<h1 class="pt">Not found</h1>${backLink('#/', 'Home')}`;
/** [['Role', '2024'], ...] -> divider rows */
const rows = (list) => list.map(([a, b]) => `<div class="row"><span>${a}</span><i>${b}</i></div>`).join('');

/** [{ name, description }, ...] -> name with a short description below */
const items = (list) =>
  list.map(({ name, description }) => `<div class="item"><b>${name}</b><p>${description}</p></div>`).join('');

/** One project tile (used on category pages and in "Next up"). */
function tile(p, style = '') {
  const angle = 120 + inCategory(p.category).indexOf(p) * 25; // varies the gradient per tile
  const imgs = coverOf(p); // the project's `cover` if it has one, otherwise its home-page images
  // every image is stacked in the tile; setupTileCycling() (media.js) fades through them on hover
  const pics = imgs
    .map(
      (im, j) =>
        `<img class="${j ? '' : 'on'}" src="${asset(im.src)}" alt="${String(im.alt).replace(/"/g, '&quot;')}">`,
    )
    .join('');
  const ti = imgs.length
    ? `<div class="ti has-img">${pics}</div>`
    : `<div class="ti" style="${tileBg(p, angle)}"></div>`;
  return `<a class="tile" href="#/${p.category}/${p.slug}" style="${style}">
    ${ti}
    <b>${p.title}</b><small>${categories[p.category].title}, ${p.year}</small></a>`;
}

/**
 * `scores` can be a list of { label, value, note } (custom per project), or the short
 * form { fun, usability, subjective, objective } which uses the default labels.
 */
function scoreItems(p) {
  if (Array.isArray(p.scores)) return p.scores;
  return scoreLabels.map(([key, label, note]) => ({
    label,
    value: p.scores[key],
    note: p.scoreNotes?.[key] || note,
  }));
}

// ---------- category page (#/hardware) ----------
/** "2x1" -> { w: 2, h: 1 } (columns x rows). Width 1-4, height 1-3. Returns null if the project has no `size`. */
function tileSize(p) {
  const m = /^\s*(\d)\s*[x×]\s*(\d)\s*$/i.exec(p.size || '');
  return m ? { w: Math.min(4, Math.max(1, +m[1])), h: Math.min(3, Math.max(1, +m[2])) } : null;
}

function categoryPage(key) {
  const { title, blurb } = categories[key];
  const items = inCategory(key);
  let html = `<h1 class="pt">${title}</h1><p class="lead">${blurb}</p>`;
  // If any project in this category has a `size`, tiles use exactly the sizes you chose (projects
  // without one are 1x1) and the grid packs them together. Otherwise the automatic layout below is used.
  if (items.some((p) => p.size)) {
    const tiles = items.map((p) => {
      const { w, h } = tileSize(p) || { w: 1, h: 1 };
      return tile(p, `--w:${w};--h:${h};--wm:${Math.min(w, 2)}`); // --wm = width on phones (2 columns)
    });
    return html + `<div class="mod">${tiles.join('')}</div>`;
  }
  // Tiles are laid out in blocks of 4. The CSS classes v0/v1/v2 pick the arrangement
  // (2x2 + tall + 2 small / wide + 2 small + 2x2 / ...) and repeat every 3 blocks.
  for (let b = 0; b * 4 < items.length; b++) {
    html += `<div class="blk v${b % 3}">${items
      .slice(b * 4, b * 4 + 4)
      .map(tile)
      .join('')}</div>`;
  }
  return html;
}

// ---------- project page (#/hardware/some-slug) ----------
function projectPage(categoryKey, slug) {
  const p = projects.find((q) => q.category === categoryKey && q.slug === slug);
  if (!p) return notFound();

  // The X/10 boxes (only if the project has `scores`). Each project defines its own
  // labels, values and hover notes (see projects.js).
  const scoreBoxes = p.scores
    ? `<div class="sc">${scoreItems(p)
        .map(
          ({ label, value, note }) => `
        <div class="box" tabindex="0" onclick="this.classList.toggle('open')">
          <div class="l">${label}</div>
          <div class="n">${value}<span>/10</span></div>
          ${note ? `<div class="d">${note}</div>` : ''}
        </div>`,
        )
        .join('')}</div>`
    : '';

  // skills separated by dots, with generous space around each dot (see .sk in style.css)
  const skills = p.skills?.length
    ? `<p class="sk">${p.skills.map((s) => `<span>${s}</span>`).join('<i class="dot" aria-hidden="true">·</i>')}</p>`
    : '';

  // All of the project's links (wiki, GitHub, and any in `links`): as many as you like
  const allLinks = projectLinks(p);
  const links = allLinks.length
    ? `<div class="lk${allLinks.length <= 3 ? ' few' : ''}">${allLinks.map(linkHTML).join('')}</div>`
    : '';

  // "Next up": three random other projects, from any category
  const next = projects
    .filter((q) => q !== p)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Description on the left and an image carousel on the right, if the project has a `gallery`
  const body = `<div class="md">${renderMarkdown(projectBody(p))}</div>`;
  const gallery = galleryOf(p);
  // The description, skills and links form one text column, so skills and links sit right under the
  // description (with a little space) no matter how tall the carousel is.
  const text = `<div class="pj-text">${body}${skills}${links}</div>`;
  const content = gallery.length ? `<div class="pj-split">${text}${carouselHTML(gallery)}</div>` : text;

  return `
    ${backLink('#/' + categoryKey, categories[categoryKey].title)}
    <h1 class="pt">${p.title}</h1>
    <p class="meta">${categories[categoryKey].title}, ${p.year}</p>
    ${scoreBoxes}
    ${content}
    <h2 class="h3" style="margin-top:84px">Next up</h2>
    <div class="sug">${next.map(tile).join('')}</div>`;
}

// ---------- awards (#/awards) ----------
function awardsPage() {
  return `<h1 class="pt">Awards</h1>${awards
    .map(
      (a) =>
        `<div class="aw"><span>${a.name}</span><span>${a.description}</span><span>${a.year}</span></div>`,
    )
    .join('')}`;
}

// ---------- resume (#/resume) ----------
function resumePage() {
  const r = resume;
  // one or two download buttons: `pdfs` in src/data/pages.js (the older single `pdf` field also works)
  const files = r.pdfs?.length ? r.pdfs : [{ label: 'Download PDF', file: r.pdf }];
  const downloads = files
    .map((f) => {
      const attrs = f.file ? `href="${asset(f.file)}" download` : 'href="#/resume"';
      return `<a class="rz dl" ${attrs} aria-label="${f.label}"><span>${f.label}</span><svg viewBox="0 0 24 24"><path d="M12 4v13"/><path d="M6 12l6 6 6-6"/></svg></a>`;
    })
    .join('');
  return `
    <h1 class="pt">Resume</h1>
    <p class="lead">${r.intro}</p>
    <div class="dl-row">${downloads}</div>
    <p class="body" style="margin:0 0 40px">Contact me through
      <a class="ul" href="mailto:${site.email}">email</a>,
      <a class="ul" href="${site.links.Instagram}" ${EXTERNAL}>instagram</a>, or
      <a class="ul" href="${site.links.LinkedIn}" ${EXTERNAL}>linkedin</a>.</p>
    <p class="h3">Experience</p>${rows(r.experience)}
    <p class="h3">Education</p>${rows(r.education)}
    <p class="h3">Skills</p><p class="body">${r.skills}</p>
    <div class="two" style="margin-top:28px">
      <div><h2 class="h3">Activities</h2>${items(r.activities)}</div>
      <div><h2 class="h3">Side quests</h2>${items(r.sideQuests)}</div>
    </div>`;
}

// ---------- contact (#/contact) ----------
function contactPage() {
  // Two columns: left = description + direct links, right = the form fields, and the Send button centered
  // underneath both. The page is sized to fit one screen (it only scrolls if the window is too short).
  return `
    <div class="contact-wrap">
    <h1 class="pt">Contact</h1>
    <div class="cp">
      <div class="cp-info">
        <p class="lead">${site.contact.description}</p>
        <p class="body">Contact me directly through
          <a class="ul" href="mailto:${site.email}">email</a>,
          <a class="ul" href="${site.links.Instagram}" ${EXTERNAL}>instagram</a>, or
          <a class="ul" href="${site.links.LinkedIn}" ${EXTERNAL}>linkedin</a>.</p>
      </div>
      <form class="cf" id="contact-form" novalidate>
      <label>Name
        <input name="name" type="text" autocomplete="name" />
        <em class="err"></em>
      </label>
      <label>Email
        <input name="email" type="email" autocomplete="email" inputmode="email" />
        <em class="err"></em>
      </label>
      <label>Message
        <textarea name="message" rows="4"></textarea>
        <em class="err"></em>
      </label>
      <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
    </form>
      <div class="cp-send">
        <button class="rz" type="submit" form="contact-form"><span>Send</span></button>
        <p class="cf-status" role="status"></p>
      </div>
    </div>
    </div>`;
}

// ---------- router entry ----------
/** @param {string[]} parts route parts, e.g. ['hardware', 'bench-power-supply'] */
export function renderPage(parts) {
  const [first, second] = parts;
  if (categories[first]) return second ? projectPage(first, second) : categoryPage(first);
  if (first === 'awards') return awardsPage();
  if (first === 'resume') return resumePage();
  if (first === 'contact') return contactPage();
  return notFound();
}
