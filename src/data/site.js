// Site-wide settings. Edit freely.
export const site = {
  name: 'Mina Yeh',
  nameLines: ['Mina', 'Yeh'], // how the big cover title breaks on phones
  subtitle: 'Prev @ MAG Manufacturing. ECE @ Cornell. I make things. [SITE IN PROGRESS]',
  email: 'minayeh1347@gmail.com',
  wiki: 'https://wiki.minayeh.com',
  footer: '© Mina Yeh 2026',
  about:
    'I believe adamantly in acting with universal human grace, exercising free will, and pursuing all the things of the universe with full-bodied curiosity. Leading FPGA CV and autonomy for Cornell University Physical Intelligence. Currently obsessed with exoskeletons, synthesizers, non-linearity, Taekwondo hurricane kicks, and learning how to better build community.',
  links: {
    Instagram: 'https://www.instagram.com/_heiany/',
    LinkedIn: 'https://www.linkedin.com/in/mina-yeh/',
    GitHub: 'https://github.com/syntonos',
  },
};

// Menu (dropdown) and bottom-of-page links, in order.
// menu: show in the dropdown, footer: show in the bottom list.
export const nav = [
  { label: 'Hardware', href: '#/hardware', menu: true, footer: true },
  { label: 'Software', href: '#/software', menu: true, footer: true },
  { label: 'Arts', href: '#/arts', menu: true, footer: true },
  { label: 'Awards', href: '#/awards', menu: true, footer: true },
  { label: 'Resume', href: '#/resume', menu: true, footer: false },
  { label: 'Wiki', href: site.wiki, external: true, menu: true, footer: true },
];
