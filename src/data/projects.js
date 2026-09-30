import { site } from './site.js';
// ---------------------------------------------------------------
// CATEGORIES: add a new key here to get a new category page.
// (Also add it to `nav` in site.js if you want it in the menu.)
// ---------------------------------------------------------------
export const categories = {
  hardware: { title: 'Hardware', blurb: 'Embedded systems, physical manufacturing, random fun.' },
  software: { title: 'Software', blurb: 'Applications I think are either useful or interesting.' },
  arts: { title: 'Arts', blurb: 'Writing, theater, art, music, etc!' },
};

// Labels and hover descriptions for the four X/10 boxes on project pages.
export const scoreLabels = [
  ['fun', 'Fun', 'How fun it was to make!'],
  ['usability', 'Usability', 'How much I actually find myself using it!'],
  ['subjective', 'Difficulty (Subjective)', 'How difficult it was for me to make. Varies wildly.'],
  ['objective', 'Difficulty (Objective', 'A vaguely objective measure of how hard it should be to recreate.'],
];

// ---------------------------------------------------------------
// PROJECTS: copy any entry below to add a project. Fields:
//   slug         unique id used in the URL (#/hardware/my-slug)
//   category     a key from `categories`
//   title, year, summary (short, home page), description (project page)
//   colors       two colors for the gradient placeholder
//   images       optional, files in /public/images, e.g. ['images/a.jpg']
//                (first image is the tile; up to 3 are stacked on home)
//   featured     true = shown in "Selected work" on the home page
//   scores       optional { fun, usability, subjective, objective } out of 10
//   skills       optional list, shown dot-separated
//   wiki, github optional links (leave out to hide)
//   link         optional single extra link { label, url }
// Anything you omit is simply not shown. Tiles fill in blocks of 4.
// ---------------------------------------------------------------
export const projects = [
  {
    slug: 'vamp',
    category: 'hardware',
    title: 'VAMP (A Digital Sampler Synth)',
    year: 2026,
    summary: 'VAMP is a Daisy Seed based digital sampler synth, with an onboard mic, pitch shifting sampling, and a few dozen digital effects. Custom PCB and firmware.',
    description: 'VAMP is a Daisy Seed based digital sampler synth, with an onboard mic, pitch shifting sampling, and a few dozen digital effects. Custom PCB and firmware.',
    colors: ['#5b8fe8', '#b8a4ee'],
    images: ['/public/images/VAMP.png', '/public/images/VAMP-pcb.png', '/public/images/VAMP-schematic.png'],
    featured: true,
    scores: { fun: 10, usability: 10, subjective: 7, objective: 5 },
    skills: ['KiCad', 'libDaisy', 'C++', 'Design'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'cupi-can',
    category: 'hardware',
    title: 'CAN Actuator Control Board & CAN Firmware Stack (CUPI)',
    year: 2026,
    summary: 'Autonomous Hexapod - PCB for controlling actuator motion, full-stack firmware development for CAN communication buses.',
    description: 'Autonomous Hexapod - PCB for controlling actuator motion, full-stack firmware development for CAN communication buses',
    colors: ['#e89ab6', '#a9b7f0'],
    images: [],
    featured: true,
    scores: { fun: 4, usability: 8, subjective: 3, objective: 5 },
    skills: ['Altium', 'C++', 'Python', 'Embedded systems'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'mechanical-keyboard',
    category: 'hardware',
    title: 'Mechanical keyboard',
    year: 2020,
    summary: 'A short write-up of mechanical keyboard: what it is, why you made it, how it works, and what you would ch…',
    description: 'A short write-up of mechanical keyboard: what it is, why you made it, how it works, and what you would change. Replace this with your own words about the project.',
    colors: ['#f2b08c', '#e59fc0'],
    images: [],
    featured: true,
    scores: { fun: 3, usability: 8, subjective: 6, objective: 4 },
    skills: ['C++', '3D printing', 'Embedded systems', 'Soldering'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'miniMP3',
    category: 'hardware',
    title: 'Sensor node network',
    year: 2025,
    summary: 'A short write-up of sensor node network: what it is, why you made it, how it works, and what you would ch…',
    description: 'A short write-up of sensor node network: what it is, why you made it, how it works, and what you would change. Replace this with your own words about the project.',
    colors: ['#8fb4ee', '#d9a9e6'],
    images: [],
    scores: { fun: 3, usability: 8, subjective: 6, objective: 4 },
    skills: ['3D printing', 'Embedded systems', 'Soldering', 'KiCad'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'blackjack',
    category: 'software',
    title: 'Markov Decision Process Blackjack Optimization',
    year: 2025,
    summary: 'A linear algebra presentation and python demonstration of Blackjack, modeled as a Markov Decision Process, and how to actually win.',
    description: 'A linear algebra presentation and python demonstration of Blackjack, modeled as a Markov Decision Process, and how to actually win.',
    colors: ['#8fb4ee', '#d9a9e6'],
    images: [],
    featured: true,
    scores: { fun: 6, usability: 4, subjective: 9, objective: 7 },
    skills: ['TypeScript', 'Python', 'React', 'SQLite'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'photo-library-indexer',
    category: 'software',
    title: 'Photo library indexer',
    year: 2022,
    summary: 'A short write-up of photo library indexer: what it is, why you made it, how it works, and what you would …',
    description: 'A short write-up of photo library indexer: what it is, why you made it, how it works, and what you would change. Replace this with your own words about the project.',
    colors: ['#b7a4e8', '#f0a9b8'],
    images: [],
    scores: { fun: 6, usability: 4, subjective: 9, objective: 7 },
    skills: ['Python', 'React', 'SQLite', 'CLI design'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'realtime-chat-toy',
    category: 'software',
    title: 'Realtime chat toy',
    year: 2019,
    summary: 'A short write-up of realtime chat toy: what it is, why you made it, how it works, and what you would chan…',
    description: 'A short write-up of realtime chat toy: what it is, why you made it, how it works, and what you would change. Replace this with your own words about the project.',
    colors: ['#7fa3e6', '#f0b98f'],
    images: [],
    scores: { fun: 6, usability: 4, subjective: 9, objective: 7 },
    skills: ['React', 'SQLite', 'CLI design', 'TypeScript'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'static-site-generator',
    category: 'software',
    title: 'Static site generator',
    year: 2024,
    summary: 'A short write-up of static site generator: what it is, why you made it, how it works, and what you would …',
    description: 'A short write-up of static site generator: what it is, why you made it, how it works, and what you would change. Replace this with your own words about the project.',
    colors: ['#e6a3cf', '#9bb8f0'],
    images: [],
    scores: { fun: 6, usability: 4, subjective: 9, objective: 7 },
    skills: ['SQLite', 'CLI design', 'TypeScript', 'Python'],
    wiki: site.wiki,
    github: site.links.GitHub,
  },
  {
    slug: 'liturgy',
    category: 'arts',
    title: 'Field Notes on Liturgical Rites @ OTHERSIDE',
    year: 2026,
    summary: 'A short story I wrote in a fugue state during finals week SP2026. The absolute first short story I\'ve ever written! About two surgeons who create a miracle and pay for it again and again and again. Trolley problems, faith and praying for a better story, love and obligation and loyalty.',
    description: 'A short story I wrote in a fugue state during finals week SP2026. The absolute first short story I\'ve ever written! About two surgeons who create a miracle and pay for it again and again and again. Trolley problems, faith and praying for a better story, love and obligation and loyalty.',
    colors: ['#e6a3cf', '#9bb8f0'],
    images: ['/images/otherside-banner.png', '/images/otherside-issue3.png', '/images/otherside-2.png'],
    featured: true,
    link: { label: 'See more on Instagram', url: site.links.Instagram },
  },
  {
    slug: 'festival24-F2026',
    category: 'arts',
    title: 'Director for Festival 24 F2026',
    year: 2026,
    summary: 'Directed for Festival 24 F2026, a series of four plays and a film, all produced within 24 hours. I had an incredible cast and crew, and so, so much fun.',
    description: 'Directed for Festival 24 F2026, a series of four plays and a film, all produced within 24 hours. I had an incredible cast and crew, and so, so much fun.',
    colors: ['#f0a98a', '#a7a2e6'],
    images: ['/public/images/festival24.png'],
    link: { label: 'Program', url: 'https://docs.google.com/document/d/1iBza2IfLlP_-688KPKO6I1lQ4yf7WmsAMPoCMyZlAyk/edit?usp=sharing' },
  },
  {
    slug: 'analog-film-roll',
    category: 'arts',
    title: 'Analog film roll',
    year: 2026,
    summary: 'A short write-up of analog film roll: what it is, why you made it, how it works, and what you would chang…',
    description: 'A short write-up of analog film roll: what it is, why you made it, how it works, and what you would change. Replace this with your own words about the project.',
    colors: ['#5b8fe8', '#b8a4ee'],
    images: [],
    link: { label: 'See more on Instagram', url: site.links.Instagram },
  },
  {
    slug: 'paper-sculpture',
    category: 'arts',
    title: 'Paper sculpture',
    year: 2023,
    summary: 'A short write-up of paper sculpture: what it is, why you made it, how it works, and what you would change…',
    description: 'A short write-up of paper sculpture: what it is, why you made it, how it works, and what you would change. Replace this with your own words about the project.',
    colors: ['#e89ab6', '#a9b7f0'],
    images: [],
    link: { label: 'See more on Instagram', url: site.links.Instagram },
  },
];
