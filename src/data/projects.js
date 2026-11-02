/**
 * The site's projects. They are NOT written here any more: each project is one file in
 *
 *   content/projects/<category>/<project>.md      (settings at the top, the write-up below)
 *   content/projects/<category>/_category.md      (the category's title, blurb and order)
 *
 * and its pictures go in public/images/<category>/<project>/. Copy content/projects/_template.md to start a new
 * project (it lists every setting). The build plugin (vite-plugins/content.js) reads those files, checks them and
 * hands them over as `virtual:content`; this file only tidies them up for the pages.
 */
import { site } from './site.js';
import { categories, projects as rawProjects } from 'virtual:content';
import { resolveRef } from '../lib/resolve-image.js';

export { categories };

// Default labels/notes, used only by projects that give `scores` as { fun, usability, subjective, objective }
// (optionally with `scoreNotes: { fun: '...' }` to override the hover text).
export const scoreLabels = [
  ['fun', 'Fun', 'How much fun I had making it.'],
  ['usability', 'Usability', 'How much I actually use it.'],
  ['subjective', 'Difficulty (Subjective)', 'How hard it was for me personally.'],
  [
    'objective',
    'Difficulty (Objective)',
    'A vaguely objective measure of how difficult it would be to reproduce (full documentation included)! ',
  ],
];

/** Gradients used for a project that has no `colors` (it shows these until it has pictures). */
const FALLBACK_COLORS = [
  ['#5b8fe8', '#b8a4ee'],
  ['#e89ab6', '#a9b7f0'],
  ['#f2b08c', '#e59fc0'],
  ['#8fb4ee', '#d9a9e6'],
];

/** A picture / video reference in a project file -> its real path (see resolve-image.js). */
const media = (p) => (item) => {
  if (typeof item === 'string') return resolveRef(item, p.category, p.slug);
  if (!item || typeof item !== 'object') return item;
  return {
    ...item,
    ...(item.src ? { src: resolveRef(item.src, p.category, p.slug) } : {}),
    ...(item.video ? { video: resolveRef(item.video, p.category, p.slug) } : {}),
  };
};
const mediaList = (p, v) => (v === undefined ? undefined : [].concat(v).map(media(p)));

const tidy = (p, i) => ({
  ...p,
  // in `npm run dev` unfinished projects (draft: true) show up marked as drafts; the built site hides them
  title: p.draft ? `${p.title} (draft)` : p.title,
  colors: p.colors || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  images: mediaList(p, p.images) || [],
  cover: mediaList(p, p.cover),
  gallery: mediaList(p, p.gallery) || [],
  wiki: p.wiki === true ? site.wiki : p.wiki,
  github: p.github === true ? site.links.GitHub : p.github,
  tags: p.tags ?? p.skills ?? [], // the category-page filter uses `tags`, or the skills if there are no tags
});

/** Every project, in order: by category, then by `order`, then newest first (sorted by the build plugin). */
export const projects = rawProjects.map(tidy);

/** The projects shown in "Selected work" on the home page, in `featuredOrder` (then date) order. */
export const featured = projects
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 1e9) - (b.featuredOrder ?? 1e9));
