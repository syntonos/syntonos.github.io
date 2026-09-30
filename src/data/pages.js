// Content for the Awards and Resume pages.
export const awards = [
  { name: 'Best Overall @ Cornell Makeathon 2026', issuer: 'Faculty & ASML Reps', year: '2026' },
  { name: 'Distinguished Honor Roll', issuer: 'American Mathematics Competition', year: '2024' },
  { name: 'Honor Roll', issuer: 'American Mathematics Competition', year: '2024' },
  { name: '4th Place - Forecasting the Future', issuer: 'Alliance for Decision Making', year: '2025' },
  { name: 'Vassar Parliamentary Debate Tourney Finalist', issuer: 'Vassar College', year: '2023' },
  { name: '1st Place (Crew Coxswain) - VCB Race 2025', issuer: 'VCB NYC', year: '2025' },
];

export const resume = {
  intro: '',
  pdf: 'resume.pdf', // e.g. 'resume.pdf' (put the file in /public). Empty = button does nothing yet.
  experience: [['Electrical Subteam, Cornell University Physical Intelligence', '2026 - Present'], ['JLCPCB Student Ambassador', '2026 - Present'], ['R&D Intern @ MAG Manufacturing', '2026'], ['Cornell Duffield Engineering Student Ambassador', '2026 - Present']],
  education: [['BS, Cornell University', '2025 -2029'], ['Stuyvesant High School', '2021 - 2025']],
  skills: 'FPGA Development, Embedded Systems, Firmware. Verilog, Altium, KiCad, LTSpice, Python, C++', 
  activities: [['Cornell Taekwondo', '2025 - Present'], ['qSTEM', 'Head of Outreach'], ['Maker Lab', '2025 - Present']],
  sideQuests: [['Climbing', 'Getting to V7!'], ['Getting lunch with all my professors', '3/5'], ['1000 Rejections', '21/1000']],
};
