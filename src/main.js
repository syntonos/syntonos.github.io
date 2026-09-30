import './style.css';
import { $, $$ } from './lib/dom.js';
import { site, nav } from './data/site.js';
import { mountIcons } from './lib/icons.js';
import { makeClouds } from './lib/sky.js';
import { renderFeatured } from './lib/home.js';
import { renderPage } from './lib/pages.js';
import { createPlane } from './lib/plane.js';

const state = { isHome: true };

/* ---- fill the page from src/data/site.js ---- */
const linkHTML = (n) => `<a href="${n.href}"${n.external ? ' target="_blank" rel="noopener"' : ''}>${n.label}</a>`;
$('#hero h1').innerHTML = site.nameLines.join('<br class="mb"> ');
$('#hero .sub').textContent = site.subtitle;
$('.nm').textContent = site.name;
const em = $('.em');
em.href = 'mailto:' + site.email;
em.textContent = site.email;
$('#about').textContent = site.about;
$('#foot').textContent = site.footer;
$('#menu').insertAdjacentHTML('afterbegin', nav.filter((n) => n.menu).map(linkHTML).join(''));
$('#endlinks').innerHTML = nav.filter((n) => n.footer).map((n) => `<li>${linkHTML(n)}</li>`).join('');
mountIcons();
renderFeatured();
setTimeout(makeClouds, 60);

/* ---- plane + scroll effects ---- */
const plane = createPlane(state);
function tick() {
  const y = scrollY, vh = innerHeight;
  $('#top').classList.toggle('on', !state.isHome || y > vh * 0.8);
  if (!state.isHome) return;
  $('#cA').style.transform = `translate3d(0,${y * 0.16}px,0)`;
  $('#cB').style.transform = `translate3d(0,${y * 0.4}px,0) scale(-1.35,1.35)`;
  plane.update();
}
const rebuild = () => { plane.build(); tick(); };
let f;
addEventListener('scroll', () => { cancelAnimationFrame(f); f = requestAnimationFrame(tick); }, { passive: true });
addEventListener('resize', rebuild);
addEventListener('load', rebuild);
document.fonts && document.fonts.ready.then(rebuild);

/* ---- menu ---- */
const burger = $('#burger'), menu = $('#menu');
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
$('.dn').onclick = (e) => { e.preventDefault(); $('#wh').scrollIntoView({ behavior: 'smooth', block: 'center' }); };
$('.nm').onclick = () => { if (state.isHome) scrollTo(0, 0); };

/* ---- hash router: #/  #/hardware  #/hardware/some-slug  #/awards  #/resume ---- */
function route() {
  const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  state.isHome = !p[0];
  $('#home').style.display = state.isHome ? '' : 'none';
  const pg = $('#page');
  pg.style.display = state.isHome ? 'none' : '';
  if (!state.isHome) {
    pg.innerHTML = renderPage(p);
    scrollTo(0, 0);
    document.title = ($('.pt', pg)?.textContent || '') + ' | ' + site.name;
  } else document.title = site.name;
  toggleMenu(false);
  state.isHome ? rebuild() : tick();
}
addEventListener('hashchange', route);
route();
