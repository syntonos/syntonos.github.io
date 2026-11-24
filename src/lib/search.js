/**
 * Search: the magnifier in the top bar (or the / key) opens a full-screen search over every project:
 * titles, categories, skills and tags, summaries and the full write-ups. Type, then use the arrow keys and
 * Enter, or click a result. Esc closes it. Styles: "#search" in style.css.
 */
import { categories, projects } from '../data/projects.js';
import { plainSummary } from './markdown.js';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const X = '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>';

let panel;
let input;
let list;
let hint;
let index; // searchable text of every project, built the first time search opens
let results = [];
let selected = 0;
let onOpen = () => {};

function buildIndex() {
  index = projects.map((p) => {
    const tags = [...(p.tags || []), ...(p.skills || [])].join(' ');
    return {
      p,
      title: p.title.toLowerCase(),
      category: (categories[p.category]?.title || '').toLowerCase(),
      tags: tags.toLowerCase(),
      summary: (p.summary || '').toLowerCase(),
      body: plainSummary(p.body || '', 100000).toLowerCase(),
    };
  });
}

/** Every word you typed has to appear somewhere; matches in the title count most, then skills, then the rest. */
function search(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const count = (text, w) =>
    (text.match(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  return index
    .map((e) => {
      let score = 0;
      for (const w of words) {
        const s =
          6 * count(e.title, w) +
          4 * count(e.tags, w) +
          3 * count(e.category, w) +
          2 * count(e.summary, w) +
          Math.min(count(e.body, w), 5);
        if (!s) return null; // a word that matches nothing rules the project out
        score += s;
      }
      return { e, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.e.p);
}

function render() {
  const query = input.value.trim();
  results = search(query);
  selected = 0;
  hint.textContent = !query
    ? ''
    : results.length
      ? ''
      : 'Nothing found.';
  list.innerHTML = results
    .map((p, i) => {
      const meta = [categories[p.category]?.title, p.year].filter(Boolean).join(', ');
      const skills = (p.skills || []).slice(0, 4).join(' · ');
      const text = p.summary || plainSummary(p.body || '', 140);
      return `<li class="${i === 0 ? 'sel' : ''}"><a href="#/${p.category}/${p.slug}">
        <b>${esc(p.title)}</b><small>${esc([meta, skills].filter(Boolean).join('  ·  '))}</small><span>${esc(text)}</span></a></li>`;
    })
    .join('');
}

function move(by) {
  if (!results.length) return;
  selected = (selected + by + results.length) % results.length;
  [...list.children].forEach((li, i) => li.classList.toggle('sel', i === selected));
  list.children[selected].scrollIntoView({ block: 'nearest' });
}

export function openSearch() {
  if (!panel) return;
  if (!index) buildIndex();
  onOpen(); // closes the menu if it was open
  panel.classList.add('on');
  document.documentElement.classList.add('search-open');
  input.focus({ preventScroll: true });
  input.select();
  render();
}

export function closeSearch() {
  if (!panel?.classList.contains('on')) return;
  panel.classList.remove('on');
  document.documentElement.classList.remove('search-open');
  input.blur();
}

export const searchIsOpen = () => Boolean(panel?.classList.contains('on'));

/** @param {{ onOpen?: Function }} opts onOpen runs when search opens (main.js uses it to close the menu) */
export function initSearch(opts = {}) {
  onOpen = opts.onOpen || onOpen;
  panel = document.createElement('div');
  panel.id = 'search';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Search projects');
  panel.innerHTML = `
    <button type="button" class="s-x" aria-label="Close search">${X}</button>
    <div class="s-in">
      <input type="search" placeholder="Search" aria-label="Search projects" autocomplete="off" spellcheck="false" />
      <p class="s-hint"></p>
      <ul class="s-res"></ul>
    </div>`;
  document.body.appendChild(panel);
  input = panel.querySelector('input');
  list = panel.querySelector('.s-res');
  hint = panel.querySelector('.s-hint');

  input.addEventListener('input', render);
  panel.querySelector('.s-x').addEventListener('click', closeSearch);
  list.addEventListener('click', (e) => e.target.closest('a') && closeSearch());
  panel.addEventListener('click', (e) => e.target === panel && closeSearch());

  document.addEventListener('keydown', (e) => {
    const typing =
      /^(input|textarea|select)$/i.test(document.activeElement?.tagName) ||
      document.activeElement?.isContentEditable;
    if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      openSearch();
    }
    if (!searchIsOpen()) return;
    if (e.key === 'Escape') closeSearch();
    if (e.key === 'ArrowDown') (e.preventDefault(), move(1));
    if (e.key === 'ArrowUp') (e.preventDefault(), move(-1));
    if (e.key === 'Enter' && results[selected]) {
      location.hash = `#/${results[selected].category}/${results[selected].slug}`;
      closeSearch();
    }
  });
  addEventListener('hashchange', closeSearch);
}
