// Everything you are likely to edit lives in this file.
// Save it and the site updates. Empty fields are hidden on the live site.

export const profile = {
  name: 'Adrian Estrecho',
  initials: 'AE',
  // The two sides of the hero.
  sides: {
    edit: {
      title: 'Video editor',
      text: 'I edit reels, shorts, and long-form videos. Senior editor and project manager at YuDevelopment and High Con, project manager at Foundry Media.',
    },
    code: {
      title: 'Web developer',
      text: 'I build responsive web applications with real accounts and databases.',
    },
  },
  phone: '09501413362',
  phoneDisplay: '0950 141 3362',
  email: 'driureditor@gmail.com',
  photo: '/adrian.webp', // A cutout with a transparent background, kept in /public.
  socials: [
    // { label: 'GitHub', url: 'https://github.com/your-name' },
    // { label: 'LinkedIn', url: 'https://linkedin.com/in/your-name' },
  ],
};

// The resume page at /resume.html. Clients, projects, and skills fill in from the
// rest of this file. Empty fields are left out. After editing, run `npm run resume`
// to update the PDF.
export const resume = {
  headline: 'Senior video editor, project manager, and web developer',
  summary:
    'Senior editor and project manager at YuDevelopment and High Con, and project manager at Foundry Media. Edits reels, shorts, and long-form videos for agencies, creators, and companies, including as a senior video editor at YGCC. IT student who builds responsive web applications with real accounts and databases.',
  location: 'Philippines',
  website: '', // Your live portfolio address, once it is published.
  // Results for each job, listed by client id. For example:
  // ygcc: ['Edited 20 videos a month for 3 company channels'],
  // The three agency panels in the Experience section show these too.
  jobPoints: {
    yudevelopment: [],
    highcon: [],
    foundry: [],
    ygcc: [],
    ws: [],
  },
  // `school` and `years` are optional, for example: school: 'School name', years: '2023 - 2027'
  education: [{ degree: 'Bachelor of Science in Information Technology' }],
};

// TRACKS are the rows on the timeline, listed top to bottom.
export const tracks = [
  { id: 'company', tag: 'V3', name: 'Company & agency' },
  { id: 'long', tag: 'V2', name: 'Long form' },
  { id: 'short', tag: 'V1', name: 'Reels & shorts' },
];

// CLIENTS are the clips. `from` and `to` are years, and both years are included.
//
// A client with `roles` also gets an expanding panel in the Experience section.
// Optional panel fields: `scope` (the work), `note` and `link` (a related project).
// `sample` also shows in that panel: paste a YouTube link or a video path such as
// '/samples/highcon.mp4'.
// A client joins the timeline once `from` and `to` are filled in.
export const clients = [
  { id: 'yudevelopment', name: 'YuDevelopment', kind: 'Agency', work: 'Senior editor and project manager', roles: ['Senior editor', 'Project manager'], track: 'company', from: null, to: null, sample: '' },
  { id: 'highcon', name: 'High Con', kind: 'Agency', work: 'Senior editor and project manager', roles: ['Senior editor', 'Project manager'], scope: 'Short videos', track: 'company', from: 2025, to: 2025, sample: '' },
  {
    id: 'foundry',
    name: 'Foundry Media',
    kind: 'Agency',
    work: 'Project manager',
    roles: ['Project manager'],
    note: 'ReEdit, the team workspace in my projects, started as a private tool for Foundry Media.',
    link: { label: 'See ReEdit', url: '#reedit' },
    track: 'company',
    from: null,
    to: null,
    sample: '',
  },
  { id: 'thuba', name: 'Thuba The Realor', kind: 'Client', work: 'Instagram Reels', track: 'short', from: 2023, to: 2024, sample: '' },
  { id: 'ws', name: 'WS Media Production', kind: 'Agency', work: 'Video editor', track: 'company', from: 2024, to: 2025, sample: '' },
  { id: 'lance', name: 'Lance', kind: 'Handler', work: 'Long-form videos and shorts', track: 'long', from: 2024, to: 2025, sample: '' },
  { id: 'mark', name: 'Mark', kind: 'Handler', work: 'Short videos', track: 'short', from: 2024, to: 2026, sample: '' },
  { id: 'kevin', name: 'Kevin Ticsay', kind: 'YouTube', work: 'Long-form videos', track: 'long', from: 2024, to: 2026, sample: '' },
  { id: 'justdoyuu', name: 'JustDoYuu', kind: 'Client', work: 'Long-form videos', track: 'long', from: 2024, to: 2026, sample: '' },
  { id: 'nationwide', name: 'NationwideHouseFlipper', kind: 'Client', work: 'Instagram Reels', track: 'short', from: 2025, to: 2026, sample: '' },
  { id: 'ygcc', name: 'YGCC', kind: 'Company', work: 'Senior video editor', track: 'company', from: 2024, to: 2026, sample: '' },
];

// In `images`, `focus` is the part of a screenshot its crop keeps in view, as an
// x% y% position. `zoom` optionally moves a cover closer to that point.
// `role` and `school` appear on the resume. `school: true` labels a school project.
export const projects = [
  {
    id: 'homelink',
    name: 'HomeLink',
    type: 'Home improvement marketplace',
    role: 'Team leader',
    school: true,
    summary:
      'Customers buy CCTV, air conditioners, solar equipment, and smart home devices, then book installation or repair in the same place.',
    points: [
      'Separate customer, admin, and employee portals with role-based sign-in',
      'Service booking with scheduling, technician assignment, and job status tracking',
      'Gemini-powered assistant that suggests products for a budget and looks up a customer’s orders',
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'SQL', 'Angular + Capacitor (mobile)'],
    images: [
      { src: '/projects/homelink-home.webp', focus: '50% 22%', alt: 'HomeLink home page with the headline “Shop products. Book services.” above a modern house at dusk, surrounded by product cards.', label: 'Home' },
      { src: '/projects/homelink-catalog.webp', focus: '50% 60%', alt: 'HomeLink product catalog with category tiles, a search bar, and featured products.', label: 'Catalog' },
    ],
    links: [{ label: 'Open live demo', url: 'https://homelink-frontend-umber.vercel.app' }],
  },
  {
    id: 'reedit',
    name: 'ReEdit',
    type: 'Workspace for video editing teams',
    role: 'Founder and leader',
    summary:
      'One place to run a video editing team: client onboarding, hiring, projects, attendance, messages, and a private portal for each client. This is where my two jobs meet.',
    points: [
      'Kanban, list, calendar, and workload views for projects and tasks',
      'Live attendance and timesheets, plus hiring with test edits and onboarding steps',
      'Workspaces for multiple companies, kept apart with row-level security',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    images: [], // Add screenshots here. The product map shows until you do.
    map: ['Clients & intake', 'Projects & tasks', 'Hiring & onboarding', 'Attendance & timesheets', 'Messages & SOPs', 'Client portals'],
    links: [],
  },
  {
    id: 'ninre',
    name: 'NinRe',
    type: 'Shared travel diary',
    role: 'Founder and leader',
    summary:
      'Couples and friends write one travel book together. Each page holds photos, a pin on the book’s atlas, the date, the story, and a note from each person.',
    points: [
      'Live 3D cover designer with cloth, foil, type, and stickers you can drag',
      'Read a book as chapters by year, an atlas with a route, or a photo album',
      'Invite links, plus prepaid plans through PayMongo with cards, GCash, and Maya',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Express', 'SQLite', 'Docker'],
    images: [
      { src: '/projects/ninre-home.webp', focus: '50% 100%', zoom: 1.45, alt: 'NinRe home page with an open sample book on a green hillside, surrounded by polaroids and a boarding pass.', label: 'Home' },
      { src: '/projects/ninre-designer.webp', focus: '34% 72%', alt: 'NinRe cover designer showing a blue cloth book with stickers beside a sheet of sticker choices.', label: 'Cover designer' },
      { src: '/projects/ninre-page.webp', focus: '14% 20%', alt: 'A NinRe book spread with a photo, a map pin, a postmark, a story, and a sticky note.', label: 'Book page' },
    ],
    links: [],
  },
];

// Add certificates like this:
// { title: 'Responsive Web Design', issuer: 'freeCodeCamp', year: 2025, image: '/certificates/rwd.jpg', url: '' }
// Empty slots show only while you run the site locally, never on the live site.
export const certificates = [];
