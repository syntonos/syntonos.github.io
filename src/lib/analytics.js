/**
 * Privacy-friendly visit counts with GoatCounter (https://www.goatcounter.com): no cookies, no tracking of
 * individuals, and it respects "Do Not Track". It is OFF until you add this to src/data/site.js:
 *
 *     analytics: { goatcounter: 'your-code' },      // the part before .goatcounter.com
 *
 * Each page of the site (#/hardware/vamp and so on) is counted as its own page.
 */
import { site } from '../data/site.js';

const enabled = () =>
  Boolean(site.analytics?.goatcounter) && navigator.doNotTrack !== '1' && window.doNotTrack !== '1';

export function initAnalytics() {
  if (!enabled()) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${site.analytics.goatcounter}.goatcounter.com/count`;
  script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true }); // we report pages ourselves (below)
  script.addEventListener('load', () => trackPage());
  document.head.appendChild(script);
}

/** Report the page that is showing now. Called on every page change. */
export function trackPage() {
  if (!enabled() || !window.goatcounter?.count) return;
  window.goatcounter.count({ path: '/' + location.hash.replace(/^#\/?/, ''), title: document.title });
}
