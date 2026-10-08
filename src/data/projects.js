import { site } from './site.js';
// ---------------------------------------------------------------
// CATEGORIES: add a new key here to get a new category page.
// (Also add it to `nav` in site.js if you want it in the menu.)
// ---------------------------------------------------------------
export const categories = {
  hardware: { title: 'Hardware', blurb: 'Embedded, FPGA, ASIC, Power Systems.' },
  software: { title: 'Software', blurb: '' },
  arts: { title: 'Arts', blurb: '' },
};


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

// ---------------------------------------------------------------
// PROJECTS: copy any entry below to add a project. Fields:
//   slug         unique id used in the URL (#/hardware/my-slug)
//   category     a key from `categories`
//   title, year
//   summary      short teaser, shown on the home page
//   description  optional, MARKDOWN (headings, lists, links, images...).
//                If you leave it out, `summary` is used instead.
//                For long write-ups, create src/content/projects/<slug>.md
//                instead (it takes priority over this field).
//   colors       two colors for the gradient placeholder
//   images       optional. Files in /public/images, e.g. ['images/a.jpg'].
//                Use 1, 2, 3+ images: they are stacked on the home page and
//                cycle on hover/tap. Each keeps its own proportions.
//                Can also be { src: 'images/a.jpg', alt: 'describe it' }.
//   cover        optional. The picture for this project's tile on the category page, if you want it
//                to differ from the home-page `images`: a path, { src, alt }, or a list (a list
//                fades through the pictures on hover). Without it, `images` are used.
//   gallery      optional. Images for the carousel on the project page (description left, carousel
//                right, each picture shown whole in a box sized to it). Items can be a path or
//                { src, alt, caption }. Without it, the description takes the full width.
//   size         optional. How big this project's block is on the category page: 'WxH' = columns x rows,
//                width 1-4, height 1-3, e.g. '2x2', '2x1', '1x2', '1x1', '3x2', '4x1'.
//                If ANY project in a category has a size, that category uses your sizes (projects
//                without one are '1x1'). If none do, the automatic layout is used.
//   featured     true = shown in "Selected work" on the home page
//   scores       optional, your own X/10 boxes for this project. A list of
//                { label, value, note }: label = box title, value = 0-10,
//                note = text shown on hover/tap (optional). Use any labels and
//                as many boxes as you like (4 fits best).
//   skills       optional list, shown dot-separated
//   wiki, github optional links (leave out to hide)
//   links        optional, as many extra links as you like:
//                  links: [{ label: 'Demo video', url: 'https://...', home: true }, { label: 'Paper', url: '...' }]
//                `home: true` also shows that link on the home page, under the project's text.
//   linksOnHome  optional, true = show ALL of this project's links on the home page
//   link         optional single extra link { label, url } (same as one entry in `links`)
// Anything you omit is simply not shown. Tiles fill in blocks of 4.
// ---------------------------------------------------------------
export const projects = [
  {
    slug: 'vamp',
    category: 'hardware',
    title: 'VAMP (A Sampler Synth)',
    year: 2026,
    summary:
      'VAMP is a Daisy Seed based digital sampler synth, with an onboard mic, pitch shifting sampling, and a few dozen digital effects. Custom PCB and firmware. Designed in KiCad.',
    description:
      'VAMP is a Daisy Seed based digital sampler synth, with an onboard mic, pitch shifting sampling, and a few dozen digital effects. Custom PCB and firmware.',
    colors: ['#5b8fe8', '#b8a4ee'],
    images: [],
    // EXAMPLE gallery (three different shapes, to show the smart sizing). Replace with your own images.
    gallery: [
      { src: 'images/example-wide.svg', caption: 'A wide shot' },
      { src: 'images/example-tall.svg', caption: 'A tall one' },
      { src: 'images/example.svg', caption: 'And a regular one' },
    ],
    featured: true,
    scores: [
      {
        label: 'Fun',
        value: 8,
        note: '',
      },
      {
        label: 'Usability',
        value: 6,
        note: '',
      },
      { label: 'Difficulty (Subjective)', value: 7, note: '' },
      {
        label: 'Difficulty (Objective)',
        value: 7,
        note: '',
      },
    ],
    skills: ['Soldering', 'KiCad', 'C++', '3D printing'],
    wiki: site.wiki,
    github: site.links.GitHub,
    links: [
      { label: 'Build video', url: 'https://example.com', home: true },
      { label: 'Schematic (PDF)', url: 'https://example.com' },
    ],
  },
  {
    slug: 'cupi-can',
    category: 'hardware',
    title: 'CUPI CAN Board + Firmware Stack (Autonomous Hexapod)',
    year: 2023,
    summary:
      'Cornell University Physical Intelligence (Autonomous Hexapod) - PCB for controlling actuator motion, full-stack firmware development for CAN communication buses. Takes USB-C input from the Jetson t5000 and converts to FDCAN differential bus for 18 actuators. Designed in Altium. Written in C and Python.',
    description:
      'Cornell University Physical Intelligence (Autonomous Hexapod) - PCB for controlling actuator motion, full-stack firmware development for CAN communication buses. Takes USB-C input from the Jetson t5000 and converts to FDCAN differential bus for 18 actuators. Designed in Altium. Written in C and Python.',
    colors: ['#e89ab6', '#a9b7f0'],
    images: [],
    scores: [
      { label: 'Fun', value: 3, note: 'Fairly useful, but not particularly riveting.' },
      {
        label: 'Usability',
        value: 10,
        note: 'Extremely useful and reusable. Most robotics and exoskeletons use CAN communication, and require conversion between different communication protocols.',
      },
      {
        label: 'Difficulty (Subjective)',
        value: 3,
        note: 'Not that bad. I feel like I\'ve just done this a lot recently.',
      },
      {
        label: 'Difficulty (Objective)',
        value: 4,
        note: 'Not that bad.',
      },
    ],
    featured: true,
    skills: ['KiCad', 'C++', '3D printing', 'Embedded systems'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'split-ortho',
    category: 'hardware',
    title: 'Ortholinear Keyboard',
    year: 2020,
    summary:
      'A tiny 46-key ortholinear split keyboard with a custom PCB, embedded design with the nRF52840 bare MCU. Designed for use with a phone, with custom keybinds and shortcuts. Designed in KiCad. Firmware with QMK.',
    colors: ['#f2b08c', '#e59fc0'],
    images: ['/images/ortho-antenna.png'],
    cover: ['/images/ortho-antenna.png'],
    gallery: ['/images/ortho-antenna.png', '/images/ortho-pcb.png', '/images/ortho-schematic.png'],
    scores: [
      { label: 'Fun', value: 7, note: 'I just like keyboards. And I have fun nuphy moss swtiches.' },
      { label: 'Usability', value: 9, note: 'Pretty fun to use!' },
      { label: 'Difficulty (Subjective)', value: 6, note: 'Using the Bare nRF52840 MCU was a fair bit harder than using a devboard, especially for antenna matching.' },
      {
        label: 'Difficulty (Objective)',
        value: 6,
        note: 'Probably use a devboard instead.',
      },
    ],
    featured: true,
    skills: ['Embedded systems', 'nRF52840', 'KiCad', 'QMK'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'miniMP3',
    category: 'hardware',
    title: 'miniMP3',
    year: 2025,
    colors: [],
    images: ['/images/mp3-pcb-back.png'],
    gallery: ['/images/mp3-3D.png', '/images/mp3-3D-2.png', '/images/mp3-pcb-back.png', '/images/mp3-pcb-front.png'],
    cover: ['/images/mp3-pcb-back.png'],
    scores: [
      {
        label: 'Fun',
        value: 8,
        note: 'Honestly just a fun tiling challenge; it reminded me of a lot of puzzle? games? Routing differential pairs under these conditions was not fun though.',
      },
      {
        label: 'Usability',
        value: 10,
        note: 'It\'s an MP3 player! And it\'s incredibly compact.',
      },
      {
        label: 'Difficulty (Subjective)',
        value: 4,
        note: 'Not that complex. Baby\'s third? Electronics project.',
      },
      {
        label: 'Difficulty (Objective)',
        value: 4,
        note: 'Good project for learning more PCB design. Firmware is a bit tricky though.',
      },
    ],
    skills: ['Embedded', 'KiCad', 'C++', 'Firmware'],
    featured: true,
    wiki: site.wiki,
    github: 'https://github.com/syntonos/miniMP3',
  },
  {
    slug: 'blackjack',
    category: 'software',
    title: 'Blackjack, Modeled as a Markov Decision Process',
    year: 2025,
    summary:
      'A linear algebra presentation and python demonstration of Blackjack, as modeled as a Markov Decision Process + how to actually win.',
    description:
      'A linear algebra presentation and python demonstration of Blackjack, as modeled as a Markov Decision Process, and how to actually win. A twenty minute presentation with a code demo, written in Python, using numpy and matplotlib.',
    colors: ['#8fb4ee', '#d9a9e6'],
    images: ['/images/blackjack.png'],
    cover: ['/images/blackjack.png'],
    gallery: ['/images/blackjack.png'],
    featured: true,
    scores: [
      { label: 'Fun', value: 10, note: 'This was so incredibly fun to write and present. 10/10. I do still give this presentation occassionally, just for fun!' },
      { label: 'Usability', value: 10, note: 'If and only if you do end up going to Vegas. Otherwise, closer to 0.' },
      {
        label: 'Difficulty (Subjective)',
        value: 7,
        note: 'Difficult for me to visualize the process, and I don\'t think I went about it the usual way. Also done in high school, when I was much less experienced. I also basically learned how to use python in two hours for this.',
      },
      {
        label: 'Difficulty (Objective)',
        value: 5,
        note: 'A fairly interesting application of linear algebra! Straightforward if your fundamentals are solid.',
      },
    ],
    skills: ['Linear Algebra', 'Markov Chains', 'Python', 'numpy'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'fdsc2300',
    category: 'software',
    title: 'FDSC 2300: Culinary Science Website',
    year: 2026,
    colors: ['#b7a4e8', '#f0a9b8'],
    images: [],
    scores: [
      { label: 'Fun', value: 5, note: 'I really love design, and I really loved the class, and I really hate frontend.' },
      { label: 'Usability', value: 10, note: 'Used right now for the Cornell Culinary Science Course.' },
      {
        label: 'Difficulty (Subjective)',
        value: 7,
        note: 'Frontend!',
      },
      {
        label: 'Difficulty (Objective)',
        value: 8,
        note: 'Probably easier if you didn\'t learn frontend as you were making the project.',
      },
    ],
    skills: ['Design', 'TSX', 'React'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'liturgy',
    category: 'arts',
    title: 'Field Notes on Liturgical Rites, Co-authored Li and Albrecht',
    year: 2026,
    summary:
      'Published professionally in OTHERSIDE Issue 3. The first short story I\'ve written, done in a fugue state during SP2026 finals week. Recursive trolley problems, Prometheus stories, and praying for a better ending. Love and obligation and choice.',
    description:
      'Published professionally in OTHERSIDE Issue 3. The first short story I\'ve written, done in a fugue state during SP2026 finals week. Recursive trolley problems, Prometheus stories, and praying for a better ending. Love and obligation and choice.',
    colors: ['#e6a3cf', '#9bb8f0'],
    cover: { src: '/images/otherside-coverart.webp' },
    gallery: ['/images/otherside-issue3.webp'],
    images: ['/images/otherside-issue3.webp'],
    featured: true,
    link: { label: 'Read it for free online!', url: 'https://othersidespec.com/pieces/field-notes-on-liturgical-rites-co-authored-li-and-albrecht/', home: true},
  },
  {
    slug: 'festival24-fa2026',
    category: 'arts',
    title: 'Director for Festival24 Fall 2026 @ Cornell',
    year: 2026,
    summary:
      'Directed for Festival24, a 24-hour festival of four plays and one film, all created from scratch within one day; completely packed theater. I had so much fun. I had an incredible time, and I could not have asked for a better cast and crew. Thank you so much to Catherine, Lani, Devi, Crystal, Luke, and Alanna, and to our wonderful producers Bailey and Gwendolyn.',
    colors: ['#f0a98a', '#a7a2e6'],
    imgaes: ['/images/festival24.png'],
    cover: ['/images/festival24.png'],
    gallery: ['/images/festival24.png'],
    links: [
      { label: 'See more on Instagram', url: site.links.Instagram },
      { label: 'Program!', url: 'https://docs.google.com/document/d/1iBza2IfLlP_-688KPKO6I1lQ4yf7WmsAMPoCMyZlAyk/edit?usp=sharing'}
    ]
  },
];
