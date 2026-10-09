# Personal site

Vite + vanilla JS. No framework. All your content lives in `src/data/`, so day-to-day edits never touch the code.

## Quick start

    npm install
    npm run dev        # local dev server with hot reload
    npm run build      # production build into dist/
    npm run preview    # preview the production build
    npm run format     # tidy code formatting (Prettier)

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
| `src/lib/markdown.js`, `src/lib/media.js` | Markdown rendering; image stack and tile helpers |
| `src/content/projects/` | Optional `<slug>.md` files with long project write-ups |
| `index.html` | Page skeleton and Google Fonts link |
| `public/` | Static files: put images and your `resume.pdf` here |

## Add a project

Open `src/data/projects.js`, copy an existing entry, and change it. Every project gets its own page at `#/<category>/<slug>`. The comment at the top of that file explains each field.

    {
      slug: 'my-new-thing',          // unique, lowercase-with-dashes
      category: 'hardware',          // hardware | software | arts
      title: 'My new thing',
      year: 2026,
      summary: 'One or two lines for the home page.',
      description: 'Optional. **Markdown** for the project page.',
      colors: ['#5b8fe8', '#b8a4ee'],          // gradient used until you add images
      images: ['images/a.jpg', 'images/b.jpg'],  // optional, files in public/images
      featured: true,                // show in "Selected work" on the home page
      scores: [                      // optional: your own X/10 boxes for this project
        { label: 'Fun', value: 8, note: 'Shown on hover or tap.' },
        { label: 'Battery life', value: 6, note: 'Any label you like.' },
      ],
      skills: ['KiCad', 'C++'],      // optional
      wiki: site.wiki,               // optional
      github: 'https://github.com/you/repo',  // optional
    },

Anything you leave out is simply not shown (that is how the Arts pages skip the score boxes, skills and wiki/GitHub links; they use a single `link` instead).

Category pages lay projects out in blocks of 4 (a 2x2 tile plus three smaller ones, alternating layouts), so adding a 5th project starts a new block.

## Project descriptions: markdown and images

The text on a project page is markdown. It comes from, in priority order:

1. a file `src/content/projects/<slug>.md` (best for long write-ups; see `_example.md` there)
2. the `description` field in `projects.js` (fine for short text)
3. the `summary` field, if there is no description at all

Headings, lists, links, bold/italic, block quotes, code and tables all work. To add an image, put the file in `public/images/` and write:

    ![Caption or alt text](images/photo.jpg)

Markdown is written by you, so it is not sanitised. Only paste content you trust.

## Home page image stacks

List any number of images in a project's `images` (1, 2, 3 or more). On the home page one image shows at a time. With two or more they fade from one to the next every few seconds (`ROTATE_EVERY` in `src/lib/home.js`), pause while the mouse is over them, and a click or tap moves to the next one. Each image keeps its own proportions, so nothing is cropped, and the box resizes to fit the tallest one (very tall images are capped at 68% of the screen height). A picture with a transparent background stays transparent: nothing is painted behind it. Each image can be a path string or `{ src: 'images/a.jpg', alt: 'what it shows' }`.

Tiles on the category pages have fixed shapes, so they crop the first image to fill the tile.

## Add a category

1. Add a key in `categories` (`src/data/projects.js`), for example `photography: { title: 'Photography', blurb: '...' }`.
2. Give projects `category: 'photography'`.
3. Add `{ label: 'Photography', href: '#/photography', menu: true, footer: true }` to `nav` in `src/data/site.js`.

## Resume PDF

Put `resume.pdf` in `public/`, then set `pdf: 'resume.pdf'` in `src/data/pages.js`.

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. Repo Settings, Pages, Source: **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes on every push.

The site uses URL hashes for routing (`#/hardware`), so no server configuration is needed.

## Cover sky: night light, gulls, favicon

- The warm "night light" is the `.warm` layer in `src/style.css` (look for `#skywrap .warm`). It only covers the sky, never the text. Lower the G/B values in its gradient for a stronger effect.
- The gull cutouts in the top-right are a mask layer on `#skywrap` (the long `url("data:image/svg+xml...")`). Their size and position are `mask-size` / `mask-position` right below it.
- The favicon is `public/favicon.svg` (and `public/apple-touch-icon.png` for iOS).

## Notes

- Fonts (Bodoni Moda, Noto Serif, Instrument Serif) load from Google Fonts in `index.html`.
- three.js is pinned to `0.128.0` so the paper plane's lighting matches the design. Newer versions change how light intensity is calculated.


## Project links, home-page links, resumes and the contact page

- **Links:** a project can have as many links as you want. Use `wiki` and `github` for those two, and `links: [{ label, url }, ...]` for any others. Add `home: true` to a link to also show it on the home page under that project, or `linksOnHome: true` on the project to show all of its links there.
- **Resumes:** `pdfs` in `src/data/pages.js` holds one or two download buttons. Put the PDFs in `public/`.
- **Contact:** `#/contact` has a name, email (checked for a valid address) and message form that sends its answers to a Google Form. See "Setting up the contact form" below. Until that is done, the form falls back to opening the visitor's email app (`mailto:`).

## Setting up the contact form (Google Form)

The contact page is a wrapper: the visitor fills in this site's own form, and the answers are sent to a Google Form that you own. You see them in the form's Responses tab (or a linked Google Sheet).

1. **Create the form.** Go to forms.google.com and start a blank form. Add three questions, in this order: **Name** (Short answer), **Email** (Short answer), **Message** (Paragraph). Marking them Required is fine.
2. **Keep it open to everyone.** Click Settings, then Responses. Turn **off** "Collect email addresses", and make sure "Limit to 1 response" and "Restrict to users in your organization" are off. A form that asks visitors to sign in will not accept submissions from the site.
3. **Get the form address.** Click the eye icon (Preview). In the new tab, copy the address from the browser bar. It looks like `https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform`. Change the end, from `viewform` (and anything after it) to `formResponse`:
   `https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse`
4. **Find the three question ids.** Back in the editor, click the three dots (top right), then **Get pre-filled link**. Type a sample answer into each question: `NAME`, `EMAIL`, `MESSAGE`. Click **Get link**, then **Copy link**, and paste it somewhere you can read it. It looks like `.../viewform?usp=pp_url&entry.1111111111=NAME&entry.2222222222=EMAIL&entry.3333333333=MESSAGE`. The number after each `entry.` is that question's id.
5. **Paste them into the site.** Open `src/data/site.js` and fill in `contact.googleForm`:

        googleForm: {
          url: 'https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse',
          fields: { name: 'entry.1111111111', email: 'entry.2222222222', message: 'entry.3333333333' },
        },

6. **Test it.** Run `npm run dev`, open `#/contact`, send a test message, then check the form's **Responses** tab (it can take a few seconds). The site cannot read Google's reply, so it always shows "Thank you" after sending. The Responses tab is the only way to confirm it arrived. If nothing shows up, re-check the three ids and the `/formResponse` ending.
7. **Get notified (optional).** In the form's Responses tab, click the three dots and choose **Get email notifications for new responses**. To keep everything in a spreadsheet, click **Link to Sheets**.

## If the 3D paper plane doesn't show

The paper plane in "Selected work" is a 3D model (WebGL). If a browser can't create a WebGL context (for example, hardware acceleration is switched off), the site automatically uses a flat 2D paper plane with the same white and grey facets instead. The dotted path and the movement are the same, and nothing else on the site is affected.

## Cover images, image carousel and tile sizes

All three are optional fields on a project in `src/data/projects.js` (the comment at the top of that file lists every field):

- **`cover`**: the picture for the project's tile on the category page, if it should differ from the home-page `images`. A path, `{ src, alt }`, or a list of pictures that fade through on hover.
- **`gallery`**: pictures for a carousel on the project page. The page becomes two columns, with the description on the left and the carousel on the right. Each picture is shown whole in a box that resizes to fit it, with arrows, dots, swiping and the arrow keys. Add a `caption` to any picture (`{ src: 'images/a.jpg', caption: 'Front view' }`). On phones the carousel sits below the text.
- **`size`**: how big the project's block is on the category page, as columns x rows: `'2x2'`, `'2x1'`, `'1x2'`, `'1x1'`, `'3x2'`, `'4x1'`... Width can be 1 to 4 and height 1 to 3. If any project in a category has a `size`, that category uses your sizes (projects without one are `'1x1'`) and the tiles pack together. If none do, the automatic layout is used. On phones the grid has two columns, so widths above 2 become 2.
