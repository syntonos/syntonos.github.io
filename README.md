# Personal site

Vite + vanilla JS. No framework. Your **words and pictures** live in `content/` and `public/images/`, and your **site-wide settings** in `src/data/`, so day-to-day edits never touch the code.

## Quick start

    npm install
    npm run dev        # local dev server with hot reload (reloads when you edit a project file or add a picture)
    npm run build      # checks your content, then builds the site into dist/
    npm run preview    # preview the production build
    npm run format     # tidy code formatting (Prettier)

Requires Node 20.19+ (or 22.12+).

## Where things live

| Where | What it is |
| --- | --- |
| `content/projects/<category>/<project>.md` | **One file per project**: settings at the top, your write-up below |
| `content/projects/<category>/_category.md` | A category's title, short description and order |
| `content/projects/_template.md` | Copy this to start a project: it lists every setting |
| `public/images/<category>/<project>/` | That project's pictures (and clips). Also put `resume.pdf` in `public/` |
| `src/data/site.js` | Your name, cover subtitle, email, social links, wiki, about text, menu links, contact form |
| `src/data/pages.js` | Awards and Resume pages |
| `src/style.css` | All styling (colors, fonts, spacing) |
| `vite-plugins/content.js` | Reads and checks the project files, and makes the smaller copies of your pictures |
| `src/lib/*.js` | The page templates, carousel, plane, sky and so on |

## Add a project

1. Make a folder for its pictures: `public/images/hardware/my-new-thing/` and drop the pictures in.
2. Copy `content/projects/_template.md` to `content/projects/hardware/my-new-thing.md`. The file name becomes the web address (`#/hardware/my-new-thing`), so use lowercase-with-dashes.
3. Fill in the settings at the top (only `title` and `year` are required, plus a `summary` or a write-up) and write the description below the second `---`. Delete the settings you don't need.
4. Run `npm run dev` and look at it. Run `npm run build` before publishing: it checks every project file.

In the settings, pictures are just file names (`images: [front.jpg, back.jpg]`). The site looks for them in that project's own folder. In the write-up, use `![A caption](front.jpg)` the same way.

## Settings reference

| Setting | What it does |
| --- | --- |
| `title`, `year` (or `date: 2026-03-14`) | Required. The year is shown next to the category |
| `summary` | A line or two for the home page. Also used as the description if there is no write-up |
| `order` | Place in its category (1 = first). Without it, projects are sorted newest first |
| `featured`, `featuredOrder` | `featured: true` shows it in Selected work on the home page, in `featuredOrder` order |
| `draft: true` | Hides the project on the real site. In `npm run dev` it still shows, marked "(draft)" |
| `images` | The pictures that rotate on the home page (any number) |
| `cover` | The tile on the category page, if it should differ from `images` (one name, or a list that fades through on hover) |
| `gallery` | The slide carousel on the project page: write-up on the left, slides on the right. Pictures, YouTube/Vimeo links, or short clips (see below) |
| `colors` | Two colors for the gradient shown while a project has no pictures |
| `size` | The tile's size on the category page as columns x rows (`2x2`, `2x1`, `1x2`, `3x2`...; width 1-4, height 1-3). If any project in a category has a size, that category uses your sizes (the rest are `1x1`); if none do, the automatic layout is used |
| `tags` | The filter links on the category page. Leave out to use `skills` |
| `scores` | The X/10 boxes: a list of `label`, `value` and an optional hover `note` |
| `skills` | The dotted line under the write-up (also used as tags) |
| `wiki`, `github` | Links. Write an address, or `true` to use the one from `site.js` |
| `links` | As many extra links as you like (`label`, `url`, and `home: true` to also show it on the home page). `linksOnHome: true` shows all of a project's links there |

## Pictures

- **Folders:** `public/images/<category>/<project>/`. Use any file names; avoid spaces if you can.
- **Resized automatically:** when you run `npm run build`, every JPG and PNG gets smaller WebP copies (480, 960 and 1600 px wide) in the built site, and each visitor's browser downloads only the size it needs. Your originals are untouched and still used as the fallback. Transparent PNGs stay transparent. (In `npm run dev` the originals are used.)
- **Nothing is cropped:** each picture is shown whole, in a box sized to fit it.
- **Videos in the gallery:** add `- video: https://www.youtube.com/watch?v=...` (or a Vimeo link) for an embedded player, or `- video: demo.mp4` for a short clip you put in the project's picture folder (it plays muted, on a loop). Only the slide in view plays.
- **Home page:** one picture shows at a time and they fade to the next every few seconds (`ROTATE_EVERY` in `src/lib/home.js`), pausing while the mouse is over them. A click or tap moves on.

## Categories

A category is a folder in `content/projects/`. To add one, create the folder (lowercase), put a `_category.md` in it:

    ---
    title: Photography
    blurb: A short line shown under the title.
    order: 4
    ---

then add its pictures folder `public/images/photography/`, and add a link to `nav` in `src/data/site.js` if you want it in the menu.

## What the build checks

`npm run build` stops with a plain list of problems if a project file has: a misspelled setting (it suggests the right one), a missing `title` or `year`, a bad `size` or `colors`, a score outside 0-10, a link that doesn't start with `https://`, a picture that is not in the project's folder, or a file name that is not lowercase-with-dashes. Fix them and run it again. In `npm run dev` the same message appears on the page.

## Cover subtitle

In `src/data/site.js`, `subtitle` is a list. Every item is its own line, so you decide where the breaks go (a long line can still wrap by itself on a narrow phone). A single string works too.


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

## Notes

- Fonts (Bodoni Moda, Noto Serif, Instrument Serif) load from Google Fonts in `index.html`.
- three.js is pinned to `0.128.0` so the paper plane's lighting matches the design. Newer versions change how light intensity is calculated.
- Projects without any picture, or a site with no projects yet, show a "Projects coming soon" note instead of breaking.
