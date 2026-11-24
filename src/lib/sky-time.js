/**
 * Time-of-day sky: the cover sky shifts a little with the visitor's local time. Pink and peach at dawn, clear
 * and bright in the day, warm orange and rose at dusk, deeper indigo at night. It is a soft color layer over
 * the sky only (inside #skywrap), so the text is never affected.
 *
 * To preview a time of day, add ?hour=19 to the address (19 = 7 pm), for example  http://localhost:5173/?hour=19
 * To change the look, edit KEYS: [hour, [r, g, b] color, opacity of the color, brightness].
 */
import { $ } from './dom.js';

const KEYS = [
  [0, [40, 40, 110], 0.26, 0.9],
  [5, [70, 60, 140], 0.2, 0.93],
  [6.5, [255, 170, 150], 0.2, 0.98],
  [9, [255, 255, 255], 0, 1.03],
  [15, [255, 255, 255], 0, 1.03],
  [17.5, [255, 170, 120], 0.2, 1],
  [19, [230, 120, 160], 0.22, 0.97],
  [21, [60, 50, 130], 0.25, 0.92],
  [24, [40, 40, 110], 0.26, 0.9],
];

/** Blend between the two keys on either side of `hour`. */
function lookup(hour) {
  let i = KEYS.findIndex(([h]) => h > hour);
  if (i < 1) i = KEYS.length - 1;
  const [h0, c0, a0, b0] = KEYS[i - 1];
  const [h1, c1, a1, b1] = KEYS[i];
  const t = (hour - h0) / (h1 - h0);
  const mix = (x, y) => x + (y - x) * t;
  return { color: c0.map((v, k) => Math.round(mix(v, c1[k]))), alpha: mix(a0, a1), bright: mix(b0, b1) };
}

export function initSkyTime() {
  const sky = $('#skywrap');
  if (!sky) return;
  const layer = document.createElement('div');
  layer.className = 'tod';
  sky.appendChild(layer);

  const override = new URLSearchParams(location.search).get('hour');
  const apply = () => {
    const now = new Date();
    const hour =
      override !== null && !Number.isNaN(Number(override))
        ? Number(override) % 24
        : now.getHours() + now.getMinutes() / 60;
    const { color, alpha, bright } = lookup(hour);
    sky.style.setProperty('--tod-color', `rgb(${color.join(',')})`);
    sky.style.setProperty('--tod-alpha', alpha.toFixed(3));
    sky.style.setProperty('--tod-bright', bright.toFixed(3));
  };
  apply();
  setInterval(apply, 5 * 60 * 1000); // keep up if the page stays open
}
