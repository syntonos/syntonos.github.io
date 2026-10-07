// Site-wide settings. Edit freely.
export const site = {
  name: 'Mina Yeh',
  nameLines: ['Mina', 'Yeh'], // how the big cover title breaks on phones
  subtitle: 'Prev @ MAG Manufacturing. ECE @ Cornell. I can make anything. [SITE IN PROGRESS...IMPORTING PROJECTS]',
  email: 'minayeh1347@gmail.com',
  // Contact page, a wrapper around a Google Form: the visitor fills in this site's own form and the answers
  // are sent to your Google Form (and appear in its Responses tab / linked sheet). Setup, once:
  //   1. In Google Forms, make a form with three questions: Name (short answer), Email (short answer),
  //      Message (paragraph).
  //   2. Open its link ("Send" > link icon) and change the end from /viewform to /formResponse. Paste it as `url`.
  //   3. Get each question's id: three-dot menu > "Get pre-filled link", fill in each question with a
  //      sample answer, click "Get link", then read entry.NNNNNNNN for each in the link. Paste them below.
  // Until `url` is filled in, the form opens the visitor's email app instead (a mailto: link).
  contact: {
    description:
      'Send me a message! I\'d love to chat!',
    googleForm: {
      url: 'https://forms.gle/VXJ4Nog4Lu6D8R2C7', // e.g. 'https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse'
      fields: { email: 'entry.0000000000', name: 'entry.0000000001', message: 'entry.0000000002' },
    },
  },
  wiki: 'https://wiki.minayeh.com',
  footer: '© Mina Yeh',
  about:
    'I believe adamantly in acting with universal human grace, exercising free will, and pursuing all the things of the universe with full-bodied curiosity. Currently leading FPGA CV and autonomy for Cornell University Physical Intelligence. Currently obsessed with exoskeletons, synthesizers, non-linearity, Taekwondo hurricane kicks, and learning how to better build community. Founding Jamboree Engineering @ Cornell for joyous, unconditionally open-access engineering.',
  links: {
    Instagram: 'https://www.instagram.com/_heiany/',
    LinkedIn: 'https://www.linkedin.com/in/mina-yeh/',
    GitHub: 'https://github.com/syntonos',
  },
};

// Menu (dropdown) and bottom-of-page links, in order.
// menu: show in the dropdown, footer: show in the bottom list.
export const nav = [
  { label: 'Contact', href: '#/contact', menu: true, footer: true },
  { label: 'Hardware', href: '#/hardware', menu: true, footer: true },
  { label: 'Software', href: '#/software', menu: true, footer: true },
  { label: 'Arts', href: '#/arts', menu: true, footer: true },
  { label: 'Awards', href: '#/awards', menu: true, footer: true },
  { label: 'Resume', href: '#/resume', menu: true, footer: false },
  { label: 'Wiki', href: site.wiki, external: true, menu: true, footer: true },
];
