// Content for the Awards and Resume pages.
// Awards: name, a short description (shown small, in Instrument Serif) and year.
export const awards = [
  {
    name: 'Best Overall @ Cornell Makeathon 2026',
    description: 'Won Best Overall at the Cornell 2026 Makeathon for the prompt Intelligent Wearables; judged by Cornell faculty and ASML respresentatives, made an automatic posture corrector based in two prongs of behavior change. Team lead, electronics, and test monkey.',
    year: '2026',
  },
  {
    name: 'Distinguished Honor Roll on AMC',
    description: 'Top 1% Scorer on the American Mathematics Competition.',
    year: '2024',
  },
  {
    name: 'Distinction on AMC',
    description: 'Top 5% Scorer on the American Mathematics Competition.',
    year: '2024',
  },
  {
    name: '4th Place - Forecasting the Future',
    description: 'Top 98th percentile for a New York State forecasting tournament, modeling future events. Hosted by the Alliance for Decision Making, counseled by an expert panel (including Daniel Kahneman, Richard Thaler, Carl Wieman, Adam Grant, Gary Kasparov, etc.)',
    year: '2024',
  },
  {
    name: 'Guggenheim Museum Art Exhibition',
    description: 'My self-portrait was chosen for display at the Guggenheim Museum in NYC as part of a student art exhibition.',
    year: '2015',
  }, 
  {
    name: 'National Merit Scholarship Finalist',
    description: 'Top 1% of PSAT scorers in the nation with a perfect PSAT, qualifying for the National Merit Scholarship Program.',
    year: '2025',
  }, 
  {
    name: 'Vassar Parliamentary Debate Tournament, Finalist',
    description: 'Placed in finals at my first and only parliamentary tournament. Interstate, with well over 50 teams.',
    year: '2023',
  },
  {
    name: '1st Place at VCB NYC',
    description: 'Coxswain for a first-place team at the annual VCB NYC crew rowing competition.',
    year: '2024',
  }
];

export const resume = {
  intro: '',
  // Resume downloads: keep one or two entries. Put the PDFs in /public (e.g. 'resume-hardware.pdf').
  // An empty `file` means the button does nothing yet.
  pdfs: [
    { label: 'RESUME', file: 'resume.pdf' },
  ],
  experience: [
    ['Electrical Subteam, Cornell University Physical Intelligence', '2026 to Present'],
    ['JLCPCB Student Ambassador', '2026 to Present'],
    ['R&D Intern, MAG Manufacturing', '2026'],
    ['Cornell Duffield Engineering Ambassador', '2026 to Present']
  ],
  education: [
    ['BS + MEng in Electrical & Computer Engineering, College of Engineering, Cornell University', '2025 to 2029'],
    ['Stuyvesant High School, New York City', '2021 to 2025'],
  ],
  skills: 'Embedded systems, PCB design, TypeScript, Python, printmaking.',
  
  // Activities and side quests: a name and a short description of each.
  activities: [
    {
      name: 'qSTEM, Head of Outreach',
      description:
        'Personally doubled our member count. Designed posters and graphics for club events. Tried very hard and hopefully succeeded in making qSTEM a more welcoming space.',
    },
    {
      name: 'Cornell Club Taekwondo ',
      description: 'Having fun! Got my right front split!',
    },
    { name: 'Rock Climbing & Calisthetics', 
      description: 'Getting to V7! And a muscle up!',
    },
    {
      name: 'Shakespeare Troupe',
      description: 'Tech and stage managing!',
    }
  ],
  sideQuests: [
    {
      name: 'Making a full music setup from scratch',
      description: 'Digital and analog pedals, guitar preamp, midi controllers, polyphonic synthesizers, modeling amps, a full guitar in a year. I want to make more music.',
    },
    { 
      name: 'Getting Lunch with All My Professors', 
      description: '3/5. Very fun! Highly recommended!' },
    {
      name: '52 Books a Year',
      description: '38/52. Currently reading <em>Drive Your Plow Over the Bones of the Dead</em> by Olga Tokarczuk and <em>The Myth of Sisyphus</em> (中) by Albert Camus.',
    },
  ],
};
