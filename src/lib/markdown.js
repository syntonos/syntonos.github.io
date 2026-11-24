/**
 * Markdown support for project write-ups.
 *
 * The write-up is everything below the settings block in a project file
 * (content/projects/<category>/<project>.md). If a project has no write-up, its `summary` is used instead.
 *
 * Pictures: put the file in public/images/<category>/<project>/ and write ![caption](photo.jpg). A bare file name
 * is looked up in that project's own folder; resized copies are used automatically.
 */
import { marked } from 'marked';
import { imgTag } from './media.js';
import { resolveRef } from './resolve-image.js';

let current = null; // the project being rendered, so a bare picture name finds that project's folder

marked.use({
  renderer: {
    // supports both marked's older (href, title, text) and newer ({ href, title, text }) calls
    image(a, b, c) {
      const t = typeof a === 'object' ? a : { href: a, title: b, text: c };
      const src = current ? resolveRef(t.href, current.category, current.slug) : t.href;
      return imgTag(src, t.text, { sizes: '(max-width: 760px) 100vw, 760px' });
    },
  },
});

/** The markdown source for a project's page. */
export function projectBody(p) {
  return p.body || p.summary || '';
}

/** Markdown -> HTML (external links open in a new tab). Pass the project so pictures are found. */
export function renderMarkdown(md, project = null) {
  current = project;
  try {
    return marked
      .parse(md, { async: false })
      .replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
  } finally {
    current = null;
  }
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
