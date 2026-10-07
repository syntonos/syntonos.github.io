/**
 * A project's links, gathered into one list. Used on the project page and (optionally) the home page.
 * Add links in src/data/projects.js: `wiki`, `github`, `link`, or as many as you like in `links`.
 */

/** Every link of a project, in order: wiki, GitHub, then `links`, then the single `link`. */
export function projectLinks(p) {
  const list = [];
  if (p.wiki) list.push({ label: 'Wiki page', url: p.wiki });
  if (p.github) list.push({ label: 'GitHub repo', url: p.github });
  (p.links || []).forEach((l) => list.push(l));
  if (p.link) list.push(p.link);
  return list;
}

/** Links to show on the home page: all of them if `linksOnHome`, otherwise the ones marked `home: true`. */
export const homeLinks = (p) => (p.linksOnHome ? projectLinks(p) : projectLinks(p).filter((l) => l.home));

export const linkHTML = (l) => `<a class="ul" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`;
