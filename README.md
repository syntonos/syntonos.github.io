# Personal site

Vite + vanilla JS. No framework. All your content lives in `src/data/`, so day-to-day edits never touch the code.

## Quick start

    npm install
    npm run dev        # local dev server with hot reload
    npm run build      # production build into dist/
    npm run preview    # preview the production build

Requires Node 18+.

## Where things live

| File | What it controls |
| --- | --- |
| `src/data/site.js` | Your name, subtitle, email, social links, wiki URL, about text, footer, menu and bottom links |
| `src/data/projects.js` | Categories and every project (this is where you add entries) |
| `src/data/pages.js` | Awards and Resume pages |
| `src/style.css` | All styling (colors, fonts, spacing) |
| `src/lib/sky.js` | The procedural cover sky/haze |
| `src/lib/plane.js` | The 3D paper plane and its winding path |
| `src/lib/pages.js` | Category, project, awards and resume page templates |
| `index.html` | Page skeleton and Google Fonts link |
| `public/` | Static files: put images and your `resume.pdf` here |

## Add a project

Open `src/data/projects.js`, copy an existing entry, and change it. Every project gets its own page at `#/<category>/<slug>`.

    {
      slug: 'my-new-thing',          // unique, lowercase-with-dashes
      category: 'hardware',          // hardware | software | arts
      title: 'My new thing',
      year: 2026,
      summary: 'One or two lines for the home page.',
      description: 'The longer write-up on the project page.',
      colors: ['#5b8fe8', '#b8a4ee'],   // gradient used until you add images
      images: ['images/my-new-thing-1.jpg'],  // optional, files in public/images
      featured: true,                // show in "Selected work" on the home page
      scores: { fun: 8, usability: 6, subjective: 5, objective: 7 },  // optional
      skills: ['KiCad', 'C++'],      // optional
      wiki: site.wiki,               // optional
      github: 'https://github.com/you/repo',  // optional
    },

Anything you leave out is simply not shown (that is how the Arts pages skip the score boxes, skills and wiki/GitHub links; they use a single `link` instead).

Category pages lay projects out in blocks of 4 (a 2x2 tile plus three smaller ones, alternating layouts), so adding a 5th project starts a new block.

## Add a category

1. Add a key in `categories` (`src/data/projects.js`), for example `photography: { title: 'Photography', blurb: '...' }`.
2. Give projects `category: 'photography'`.
3. Add `{ label: 'Photography', href: '#/photography', menu: true, footer: true }` to `nav` in `src/data/site.js`.

## Images

Put files in `public/images/` and reference them as `images/name.jpg`. Up to 3 images per featured project are stacked on the home page (they cycle on hover); the first image is used for tiles.

## Resume PDF

Put `resume.pdf` in `public/`, then set `pdf: 'resume.pdf'` in `src/data/pages.js`.

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. Repo Settings, Pages, Source: **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes on every push.

The site uses URL hashes for routing (`#/hardware`), so no server configuration is needed.

## Notes

- Fonts (Bodoni Moda, Noto Serif, Instrument Serif) load from Google Fonts in `index.html`.
- three.js is pinned to `0.128.0` so the paper plane's lighting matches the design. Newer versions change how light intensity is calculated.
