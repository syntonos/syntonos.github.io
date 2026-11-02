/**
 * Content plugin: reads the project files in /content, checks them, and hands them to the site.
 *
 *   content/projects/<category>/_category.md   -> the category's title, blurb and order
 *   content/projects/<category>/<project>.md   -> one project: settings (YAML) + write-up (markdown)
 *   public/images/<category>/<project>/...     -> that project's pictures
 *
 * What it does:
 *   1. Parses every project file and CHECKS it. A typo'd field, a missing image, a bad size or a duplicate
 *      slug stops the build with a plain message (in `npm run dev` it shows on the page).
 *   2. Sorts categories and projects (by `order`, then newest first).
 *   3. Makes the list available to the site as `virtual:content`.
 *   4. On `npm run build`, shrinks every photo into smaller WebP copies (480 / 960 / 1600 px wide), and the
 *      site uses them automatically (srcset), so pages stay fast. Originals are left untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import sharp from 'sharp';
import { resolveRef } from '../src/lib/resolve-image.js';

const VIRTUAL_ID = 'virtual:content';
const RESOLVED_ID = '\0virtual:content';
const WIDTHS = [480, 960, 1600]; // sizes of the resized copies made at build time
const WEBP_QUALITY = 85;
const RESIZE_EXT = /\.(jpe?g|png)$/i; // formats that get resized copies
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg|avif)$/i;

/** Every setting a project file may contain. Anything else is reported as a typo. */
const PROJECT_FIELDS = [
  'title',
  'year',
  'date',
  'summary',
  'order',
  'featured',
  'featuredOrder',
  'draft',
  'colors',
  'images',
  'cover',
  'gallery',
  'size',
  'scores',
  'scoreNotes',
  'skills',
  'tags',
  'wiki',
  'github',
  'links',
  'linksOnHome',
  'link',
];
const CATEGORY_FIELDS = ['title', 'blurb', 'order'];
const SCORE_KEYS = ['fun', 'usability', 'subjective', 'objective'];

// ---------------------------------------------------------------- small helpers

const posix = (p) => p.split(path.sep).join('/');
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Closest known field name, for "did you mean ...?" */
function suggest(word, options) {
  const dist = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
        );
    return d[a.length][b.length];
  };
  const best = options
    .map((o) => [o, dist(word.toLowerCase(), o.toLowerCase())])
    .sort((x, y) => x[1] - y[1])[0];
  return best && best[1] <= 3 ? best[0] : null;
}

/** Splits "---\nsettings\n---\nwrite-up" into { data, body }. */
function parseFile(text, file, errors) {
  const m = /^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/.exec(text);
  const yamlText = m ? m[1] : '';
  const body = (m ? m[2] : text).replace(/\r\n/g, '\n').trim();
  let data = {};
  if (m) {
    try {
      data = yaml.load(yamlText, { schema: yaml.CORE_SCHEMA }) || {};
    } catch (e) {
      errors.push(
        `${file}: the settings block at the top could not be read (${String(e.message).split('\n')[0]})`,
      );
    }
    if (!isObj(data)) {
      errors.push(`${file}: the settings block at the top must be "name: value" lines`);
      data = {};
    }
  }
  return { data, body };
}

// ---------------------------------------------------------------- reading + checking the content

function loadContent(root, isBuild) {
  const errors = [];
  const warnings = [];
  const contentDir = path.join(root, 'content', 'projects');
  const publicDir = path.join(root, 'public');
  const rel = (f) => posix(path.relative(root, f));

  if (!fs.existsSync(contentDir)) {
    warnings.push('No content/projects folder found, so the site has no projects yet.');
    return { categories: {}, projects: [], errors, warnings };
  }

  const categories = {};
  const projects = [];

  const categoryDirs = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'));

  for (const dirent of categoryDirs) {
    const key = dirent.name;
    const dir = path.join(contentDir, key);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) {
      errors.push(`${rel(dir)}: category folder names must be lowercase-with-dashes (like "hardware")`);
      continue;
    }

    // ---- the category itself
    const catFile = path.join(dir, '_category.md');
    let cat = { title: key[0].toUpperCase() + key.slice(1), blurb: '', order: null };
    if (fs.existsSync(catFile)) {
      const { data } = parseFile(fs.readFileSync(catFile, 'utf8'), rel(catFile), errors);
      for (const k of Object.keys(data)) {
        if (!CATEGORY_FIELDS.includes(k)) {
          const s = suggest(k, CATEGORY_FIELDS);
          errors.push(`${rel(catFile)}: unknown field "${k}"${s ? ` (did you mean "${s}"?)` : ''}`);
        }
      }
      if (data.title !== undefined && typeof data.title !== 'string')
        errors.push(`${rel(catFile)}: "title" must be text`);
      if (data.order !== undefined && typeof data.order !== 'number')
        errors.push(`${rel(catFile)}: "order" must be a number`);
      cat = { title: data.title || cat.title, blurb: data.blurb || '', order: data.order ?? null };
    } else {
      warnings.push(
        `${rel(dir)}: no _category.md, so the category is called "${cat.title}" (add one to set its title and blurb)`,
      );
    }
    categories[key] = cat;

    // ---- its projects
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
      .sort();
    const orders = new Map();
    for (const f of files) {
      const file = path.join(dir, f);
      const label = rel(file);
      const slug = f.replace(/\.md$/, '');
      const { data, body } = parseFile(fs.readFileSync(file, 'utf8'), label, errors);
      const draft = data.draft === true;
      const here = (msg) => errors.push(`${label}: ${msg}`);

      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
        here(`the file name becomes the web address, so use lowercase-with-dashes (like "my-project.md")`);

      for (const k of Object.keys(data)) {
        if (!PROJECT_FIELDS.includes(k)) {
          const s = suggest(k, PROJECT_FIELDS);
          here(`unknown field "${k}"${s ? ` (did you mean "${s}"?)` : ''}`);
        }
      }

      // a draft may be unfinished, so only the checks above apply to it
      if (!draft) {
        if (typeof data.title !== 'string' || !data.title.trim()) here('needs a "title"');
        if (data.year === undefined && data.date === undefined)
          here('needs a "year" (or a full "date" like 2026-03-14)');
        if (!data.summary && !body) here('needs a "summary" or a write-up below the settings');
      }
      if (data.year !== undefined && !(Number.isInteger(data.year) && data.year > 1900 && data.year < 2200))
        here('"year" must be a 4-digit number');
      if (data.date !== undefined && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(String(data.date)))
        here('"date" must look like 2026, 2026-03 or 2026-03-14');
      for (const k of ['order', 'featuredOrder'])
        if (data[k] !== undefined && typeof data[k] !== 'number') here(`"${k}" must be a number`);
      for (const k of ['featured', 'draft', 'linksOnHome'])
        if (data[k] !== undefined && typeof data[k] !== 'boolean') here(`"${k}" must be true or false`);
      if (data.summary !== undefined && typeof data.summary !== 'string') here('"summary" must be text');
      if (
        data.colors !== undefined &&
        !(
          Array.isArray(data.colors) &&
          data.colors.length === 2 &&
          data.colors.every((c) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c))
        )
      )
        here("\"colors\" must be two colors like ['#5b8fe8', '#b8a4ee']");
      if (data.size !== undefined && !/^[1-4]\s*[x×]\s*[1-3]$/i.test(String(data.size)))
        here('"size" must be columns x rows, like 2x2 (width 1-4, height 1-3)');
      for (const k of ['skills', 'tags'])
        if (data[k] !== undefined && !(Array.isArray(data[k]) && data[k].every((s) => typeof s === 'string')))
          here(`"${k}" must be a list of words`);

      // scores: a list of { label, value, note } or the short { fun, usability, subjective, objective }
      if (data.scores !== undefined) {
        if (Array.isArray(data.scores)) {
          data.scores.forEach((s, i) => {
            if (!isObj(s) || typeof s.label !== 'string') here(`scores item ${i + 1} needs a "label"`);
            else if (typeof s.value !== 'number' || s.value < 0 || s.value > 10)
              here(`score "${s.label}" needs a "value" from 0 to 10`);
          });
        } else if (isObj(data.scores)) {
          for (const [k, v] of Object.entries(data.scores)) {
            if (!SCORE_KEYS.includes(k))
              here(
                `unknown score "${k}" (use ${SCORE_KEYS.join(', ')}, or a list of { label, value, note })`,
              );
            else if (typeof v !== 'number' || v < 0 || v > 10)
              here(`score "${k}" must be a number from 0 to 10`);
          }
        } else here('"scores" must be a list');
      }

      // links
      const checkLink = (l, where) => {
        if (!isObj(l) || typeof l.label !== 'string' || typeof l.url !== 'string')
          here(`${where} needs a "label" and a "url"`);
        else if (!/^(https?:\/\/|mailto:|#\/|\/)/i.test(l.url))
          here(`${where} "${l.label}" has a web address that does not start with https:// (${l.url})`);
      };
      (Array.isArray(data.links)
        ? data.links
        : data.links === undefined
          ? []
          : (here('"links" must be a list'), [])
      ).forEach((l, i) => checkLink(l, `links item ${i + 1}`));
      if (data.link !== undefined) checkLink(data.link, '"link"');
      for (const k of ['wiki', 'github'])
        if (
          data[k] !== undefined &&
          data[k] !== true &&
          !(typeof data[k] === 'string' && /^https?:\/\//i.test(data[k]))
        )
          here(`"${k}" must be a web address starting with https:// (or true to use the one from site.js)`);

      // images: every picture named must exist in public/images/<category>/<project>/
      const checkImage = (ref, where) => {
        if (typeof ref !== 'string') return;
        const p = resolveRef(ref, key, slug);
        if (/^(https?:|data:|\/\/)/i.test(p)) return;
        if (!fs.existsSync(path.join(publicDir, p)))
          here(`${where} "${ref}" was not found (looked for public/${p})`);
      };
      const checkMedia = (list, field) => {
        if (list === undefined || list === null) return;
        const items = Array.isArray(list) ? list : [list];
        items.forEach((it) => {
          if (typeof it === 'string') checkImage(it, `picture in "${field}":`);
          else if (isObj(it) && typeof it.src === 'string') checkImage(it.src, `picture in "${field}":`);
          else if (isObj(it) && typeof it.video === 'string') {
            if (!/^https?:\/\//i.test(it.video)) checkImage(it.video, `video in "${field}":`);
          } else here(`${field} has an item that is not a picture name, { src }, or { video }`);
        });
      };
      checkMedia(data.images, 'images');
      checkMedia(data.cover, 'cover');
      checkMedia(data.gallery, 'gallery');
      for (const m of body.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/g))
        checkImage(m[1], 'picture in the write-up:');

      if (typeof data.order === 'number') {
        if (orders.has(data.order))
          warnings.push(
            `${label}: "order: ${data.order}" is also used by ${orders.get(data.order)} (they will be sorted by date)`,
          );
        else orders.set(data.order, f);
      }

      const year = data.year ?? (data.date ? Number(String(data.date).slice(0, 4)) : undefined);
      projects.push({
        slug,
        category: key,
        title: data.title ?? slug,
        year,
        date: data.date !== undefined ? String(data.date) : undefined,
        summary: data.summary ?? '',
        body,
        order: data.order ?? null,
        featured: data.featured === true,
        featuredOrder: data.featuredOrder ?? null,
        draft,
        colors: data.colors,
        images: data.images,
        cover: data.cover,
        gallery: data.gallery,
        size: data.size,
        scores: data.scores,
        scoreNotes: data.scoreNotes,
        skills: data.skills,
        tags: data.tags,
        wiki: data.wiki,
        github: data.github,
        links: data.links,
        linksOnHome: data.linksOnHome === true,
        link: data.link,
      });
    }
  }

  // drafts are only for `npm run dev`; they never reach the built site
  const kept = isBuild ? projects.filter((p) => !p.draft) : projects;

  // ---- sorting: categories by `order`, projects by `order`, then newest first
  const byOrder = (a, b) => (a ?? 1e9) - (b ?? 1e9);
  const sortedKeys = Object.keys(categories).sort(
    (a, b) =>
      byOrder(categories[a].order, categories[b].order) ||
      categories[a].title.localeCompare(categories[b].title),
  );
  const sortedCategories = Object.fromEntries(
    sortedKeys.map((k) => [k, { title: categories[k].title, blurb: categories[k].blurb }]),
  );
  const sortDate = (p) => p.date || `${p.year ?? 0}-01-01`;
  kept.sort(
    (a, b) =>
      sortedKeys.indexOf(a.category) - sortedKeys.indexOf(b.category) ||
      byOrder(a.order, b.order) ||
      sortDate(b).localeCompare(sortDate(a)) ||
      a.title.localeCompare(b.title),
  );

  return { categories: sortedCategories, projects: kept, errors, warnings };
}

// ---------------------------------------------------------------- the picture list (sizes + resized copies)

const variantPath = (rel, w) => rel.replace(/\.[^.]+$/, `.w${w}.webp`);

async function buildManifest(root, isBuild) {
  const imagesDir = path.join(root, 'public', 'images');
  const manifest = {};
  if (!fs.existsSync(imagesDir)) return manifest;
  const walk = (dir) =>
    fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
  for (const file of walk(imagesDir).filter((f) => IMAGE_EXT.test(f))) {
    const rel = posix(path.relative(path.join(root, 'public'), file));
    let w = 0;
    let h = 0;
    try {
      const meta = await sharp(file).metadata();
      w = meta.width || 0;
      h = meta.height || 0;
    } catch {
      /* unreadable picture: the site still shows it, just without sizes */
    }
    // resized copies only exist in the built site, so `npm run dev` just uses the originals
    const variants =
      isBuild && RESIZE_EXT.test(file) && w
        ? WIDTHS.filter((x) => x < w).map((x) => ({ w: x, src: variantPath(rel, x) }))
        : [];
    manifest[rel] = { w, h, variants };
  }
  return manifest;
}

// ---------------------------------------------------------------- the plugin

export default function contentPlugin() {
  let config;
  let isBuild = false;
  let lastManifest = {};

  return {
    name: 'site-content',

    configResolved(c) {
      config = c;
      isBuild = c.command === 'build';
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    async load(id) {
      if (id !== RESOLVED_ID) return;
      const { categories, projects, errors, warnings } = loadContent(config.root, isBuild);
      warnings.forEach((w) => this.warn(w));
      if (errors.length) {
        const msg = `\nContent check found ${errors.length} problem${errors.length > 1 ? 's' : ''}:\n${errors.map((e) => `  • ${e}`).join('\n')}\n`;
        // keep it short: only the list of problems, no technical stack trace
        const err = new Error(msg);
        err.stack = '';
        if (isBuild) this.error(err);
        throw err;
      }
      lastManifest = await buildManifest(config.root, isBuild);
      const contentDir = path.join(config.root, 'content');
      if (fs.existsSync(contentDir)) {
        const walk = (d) =>
          fs
            .readdirSync(d, { withFileTypes: true })
            .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
        walk(contentDir).forEach((f) => this.addWatchFile(f));
      }
      return `export const categories = ${JSON.stringify(categories)};\nexport const projects = ${JSON.stringify(projects)};\nexport const imageManifest = ${JSON.stringify(lastManifest)};\n`;
    },

    // `npm run dev`: reload when a project file or a picture changes
    configureServer(server) {
      const watched = [path.join(config.root, 'content'), path.join(config.root, 'public', 'images')];
      server.watcher.add(watched);
      const refresh = (file) => {
        if (!watched.some((w) => file.startsWith(w))) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      ['add', 'change', 'unlink'].forEach((ev) => server.watcher.on(ev, refresh));
    },

    // `npm run build`: make the smaller WebP copies of every photo, next to the originals in the output folder
    async closeBundle() {
      if (!isBuild) return;
      const outDir = path.resolve(config.root, config.build.outDir);
      const jobs = [];
      for (const [rel, info] of Object.entries(lastManifest)) {
        for (const v of info.variants)
          jobs.push({ from: path.join(config.root, 'public', rel), to: path.join(outDir, v.src), w: v.w });
      }
      let made = 0;
      const queue = [...jobs];
      const worker = async () => {
        while (queue.length) {
          const job = queue.shift();
          if (fs.existsSync(job.to) && fs.statSync(job.to).mtimeMs >= fs.statSync(job.from).mtimeMs) continue; // already up to date
          fs.mkdirSync(path.dirname(job.to), { recursive: true });
          await sharp(job.from)
            .resize({ width: job.w, withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY })
            .toFile(job.to);
          made++;
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
      if (jobs.length)
        config.logger.info(
          `\n  site-content: ${made} resized picture${made === 1 ? '' : 's'} written (${jobs.length} total)`,
        );
    },
  };
}
