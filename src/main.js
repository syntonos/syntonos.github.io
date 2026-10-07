/**
 * Entry point: fills the page from src/data/*, wires up scrolling effects,
 * the dropdown menu and the hash router.
 *
 *   src/data/site.js      name, links, nav        src/lib/home.js    "Selected work"
 *   src/data/projects.js  projects                src/lib/pages.js   subpage templates
 *   src/data/pages.js     awards, resume          src/lib/plane.js   3D paper plane + path
 *   src/style.css         all styling             src/lib/sky.js     cover haze canvas
 */
import './style.css';
import { $, $$ } from './lib/dom.js';
import { site, nav } from './data/site.js';
import { mountIcons } from './lib/icons.js';
import { makeClouds } from './lib/sky.js';
import { renderFeatured } from './lib/home.js';
import { renderPage } from './lib/pages.js';
import { setupTileCycling } from './lib/media.js';
import { setupCarousels } from './lib/carousel.js';
import { setupContactForm } from './lib/contact.js';
import { createPlane } from './lib/plane.js';
import { initScrollbar } from './lib/scrollbar.js';

const state = { isHome: true };

/** Keep the last two words of every paragraph together, so no line ends with a single stranded word. */
function fixWidows(root) {
  root.querySelectorAll('p').forEach((p) => {
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    let last = null;
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) last = walker.currentNode;
    if (last) last.nodeValue = last.nodeValue.replace(/\s+(\S+\s*)$/, '\u00a0$1');
  });
}

/* ---- fill the page from src/data/site.js ---- */
const linkHTML = (n) =>
  `<a href="${n.href}"${n.external ? ' target="_blank" rel="noopener"' : ''}>${n.label}</a>`;
$('#hero h1').innerHTML = site.nameLines.join('<br class="mb"> ');
$('#hero .sub').textContent = site.subtitle;
$('.nm').textContent = site.name;
const em = $('.em');
em.href = 'mailto:' + site.email;
em.textContent = site.email;
$('#about').textContent = site.about;
$('#foot').textContent = site.footer;
$('#menu').insertAdjacentHTML(
  'afterbegin',
  nav
    .filter((n) => n.menu)
    .map(linkHTML)
    .join(''),
);
$('#endlinks').innerHTML = nav
  .filter((n) => n.footer)
  .map((n) => `<li>${linkHTML(n)}</li>`)
  .join('');
mountIcons();
renderFeatured(() => rebuild()); // rebuild = recalc the plane's path once images load
fixWidows(document);
initScrollbar(); // dotted line + paper plane scrollbar (mouse/trackpad only)
setTimeout(makeClouds, 60);

/* ---- plane + scroll effects ---- */
// If the plane ever fails to start, the rest of the site must still work (menu, pages, scrollbar...)
let plane = { build() {}, update() {} };
try {
  plane = createPlane(state);
} catch (err) {
  console.error('Paper plane failed to start:', err);
}
function tick() {
  const y = scrollY,
    vh = innerHeight;
  $('#top').classList.toggle('on', !state.isHome || y > vh * 0.8);
  if (!state.isHome) return;
  $('#cA').style.transform = `translate3d(0,${y * 0.16}px,0)`;
  $('#cB').style.transform = `translate3d(0,${y * 0.4}px,0) scale(-1.35,1.35)`;
  plane.update();
}
const rebuild = () => {
  plane.build();
  tick();
};
let f;
addEventListener(
  'scroll',
  () => {
    cancelAnimationFrame(f);
    f = requestAnimationFrame(tick);
  },
  { passive: true },
);
addEventListener('resize', rebuild);
addEventListener('load', rebuild);
document.fonts && document.fonts.ready.then(rebuild);

/* ---- menu ---- */
const burger = $('#burger'),
  menu = $('#menu');
function toggleMenu(open) {
  const v = open ?? !menu.classList.contains('on');
  menu.classList.toggle('on', v);
  burger.classList.toggle('x', v);
  burger.setAttribute('aria-expanded', v);
  document.body.style.overflow = v ? 'hidden' : '';
}
burger.onclick = () => toggleMenu();
$$('#menu a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
addEventListener('keydown', (e) => e.key === 'Escape' && toggleMenu(false));
$('.dn').onclick = (e) => {
  e.preventDefault();
  $('#wh').scrollIntoView({ behavior: 'smooth', block: 'center' });
};
$('.nm').onclick = () => {
  if (state.isHome) scrollTo(0, 0);
};

/* ---- hash router: #/  #/hardware  #/hardware/some-slug  #/awards  #/resume ---- */
function route() {
  const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  state.isHome = !p[0];
  document.body.classList.toggle('is-home', state.isHome); // heavy grain is for the main page only
  $('#home').style.display = state.isHome ? '' : 'none';
  const pg = $('#page');
  pg.style.display = state.isHome ? 'none' : '';
  if (!state.isHome) {
    pg.innerHTML = renderPage(p);
    setupTileCycling(pg);
    setupCarousels(pg);
    setupContactForm(pg);
    fixWidows(pg);
    scrollTo(0, 0);
    document.title = ($('.pt', pg)?.textContent || '') + ' | ' + site.name;
  } else document.title = site.name;
  toggleMenu(false);
  state.isHome ? rebuild() : tick();
}
addEventListener('hashchange', route);
route();
