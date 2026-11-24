/**
 * Email protection. The address (site.email in src/data/site.js) is kept out of the page's HTML:
 *  - in the built code it is stored as base64 (see vite-plugins/content.js), not as plain text;
 *  - on the page, links are written as href="#/contact" and the real mailto: address is only put into a link
 *    at the moment someone points at it, focuses it, touches it or clicks it (a real visitor always does);
 *  - the address shown in the top bar is drawn with CSS from a reversed copy, so it is not a plain text node.
 * Simple scrapers and bots that only read the page never see the address. People just see and click a normal link.
 */
import { site } from '../data/site.js';

/** An email link. Use it instead of writing  href="mailto:..."  by hand. */
export const mailLink = (label, cls = 'ul') => `<a class="${cls}" href="#/contact" data-mail>${label}</a>`;

/** The address backwards (the top bar un-reverses it with CSS). */
export const reversedEmail = () => [...site.email].reverse().join('');

export function initMail() {
  const mailto = `mailto:${site.email}`;
  const arm = (e) => {
    const a = e.target.closest?.('[data-mail]');
    if (a && a.getAttribute('href') !== mailto) a.setAttribute('href', mailto);
  };
  ['mouseover', 'focusin', 'touchstart', 'pointerdown'].forEach((ev) =>
    document.addEventListener(ev, arm, { passive: true }),
  );
  // a click without any of the above (a script, a keyboard shortcut) still works
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('[data-mail]');
    if (a && a.getAttribute('href') !== mailto) {
      e.preventDefault();
      window.location.href = mailto;
    }
  });
}
