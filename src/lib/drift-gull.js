/**
 * A single gull drifts slowly across the cover sky now and then (a few seconds after the page opens, then every
 * minute or so). It is one of the cover gulls (same shape, same warm off-white, same paper grain), flying across
 * at a random height, bobbing gently. It only appears while the cover is on screen, and never for visitors who
 * prefer reduced motion. Tweak the numbers in this file to change how often or how fast.
 */
import { $ } from './dom.js';

const NS = 'http://www.w3.org/2000/svg';
const FIRST_DELAY = [6000, 14000]; // ms until the first gull
const EVERY = [40000, 90000]; // ms between gulls
const FLIGHT = [26000, 38000]; // ms to cross the screen
const SIZE = [46, 78]; // width in px
const rand = ([a, b]) => a + Math.random() * (b - a);

export function initDriftGull(state) {
  const hero = $('#hero');
  const source = document.querySelector('#gull-shapes'); // the cover gulls' shapes (index.html)
  if (!hero || !source || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const shape = source.getAttribute('d').split(/(?=M)/).filter(Boolean);
  const d = shape[1] || shape[0]; // the second gull has the classic V of wings

  const lane = document.createElement('div');
  lane.className = 'drift-lane';
  hero.appendChild(lane);

  function spawn() {
    // only while the cover is showing and the tab is visible
    if (!state.isHome || document.hidden || scrollY > innerHeight * 0.6) return false;
    const svg = document.createElementNS(NS, 'svg');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', '#fffdf9');
    path.setAttribute('filter', 'url(#gull-rough)'); // the same rough, grainy edge as the other gulls
    svg.appendChild(path);
    lane.appendChild(svg);
    const box = path.getBBox();
    svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
    const width = rand(SIZE);
    Object.assign(svg.style, {
      position: 'absolute',
      left: '0',
      top: `${rand([10, 42])}vh`,
      width: `${width}px`,
      height: `${(width * box.height) / box.width}px`,
      overflow: 'visible',
    });

    const goRight = Math.random() < 0.5;
    const from = goRight ? -width - 20 : innerWidth + 20;
    const to = goRight ? innerWidth + 20 : -width - 20;
    const flip = goRight ? 1 : -1; // mirror it when it flies the other way
    const bob = [0, -16, 6, -12, 0];
    const frames = bob.map((y, i) => {
      const t = i / (bob.length - 1);
      return {
        transform: `translate(${from + (to - from) * t}px, ${y}px) scaleX(${flip})`,
        opacity: t === 0 || t === 1 ? 0 : 0.95,
        offset: t,
      };
    });
    svg
      .animate(frames, { duration: rand(FLIGHT), easing: 'linear' })
      .addEventListener('finish', () => svg.remove());
    return true;
  }

  const later = () => setTimeout(() => (spawn(), later()), rand(EVERY));
  setTimeout(() => (spawn(), later()), rand(FIRST_DELAY));
  window.addEventListener('spawn-gull', spawn); // lets you trigger one by hand: window.dispatchEvent(new Event('spawn-gull'))
}
