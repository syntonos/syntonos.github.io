/**
 * Markdown support for project descriptions.
 *
 * A project's body text comes from (first match wins):
 *   1. a file  src/content/projects/<slug>.md
 *   2. the `description` field in src/data/projects.js (markdown allowed)
 *   3. the `summary` field (used when there is no description at all)
 *
 * Images: put files in /public/images and write ![caption](images/photo.jpg).
 */
import { marked } from 'marked';
import { asset } from './dom.js';

// Load every .md file in src/content/projects at build time, keyed by path.
const mdFiles = import.meta.glob('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** The markdown source for a project's page. */
export function projectBody(p) {
  return mdFiles[`../content/projects/${p.slug}.md`] || p.description || p.summary || '';
}

/** Markdown -> HTML, with image paths resolved and external links opening in a new tab. */
export function renderMarkdown(md) {
  return marked
    .parse(md, { async: false })
    .replace(/(<img[^>]*?\ssrc=")([^"]+)(")/g, (_, a, src, c) => a + asset(src) + c)
    .replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
}

/** Plain-text teaser (for the home page when a project has no `summary`). */
export function plainSummary(md, max = 140) {
  const text = md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // drop images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> their text
    .replace(/[#>*_`~-]/g, '') // markdown punctuation
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}
