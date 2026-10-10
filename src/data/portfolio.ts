/**
 * Central portfolio data — generated from Gopichand's resume & portfolio dump.
 * Every fact on the site comes from this file. Update it here and the whole site follows.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

/**
 * Where the standalone Creative portfolio lives.
 * Production: served as a folder on the same host (e.g. gooichand.github.io/Creative/).
 * For local testing, point this at the Creative dev server (e.g. 'http://localhost:5173/').
 */
export const creativePortfolioUrl = '/Creative/';

/**
 * Where the standalone Unknown portfolio lives.
 * Production: served as a folder on the same host (e.g. gooichand.github.io/Unknown/).
 * Its chat/admin backend ships as /api functions in the same deployment
 * (see api/ and Unknown/api-config.js).
 */
export const unknownPortfolioUrl = '/Unknown/';

export const profile = {
  fullName: 'Gopichand Dandimeni',
  displayName: 'Gopichand Dandimeni',
  firstName: 'GOPICHAND',
  seriesTag: 'THE SERIES',
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: 'A DGC ORIGINAL',
  role: 'Cybersecurity & Digital Forensics',
  tagline: ['Cybersecurity', 'Digital Forensics', 'Web Development'],
  intro:
    'A fourth-year Cybersecurity & Digital Forensics student with specialized expertise in threat analysis, digital evidence examination, and incident response — committed to continuous learning in an evolving cyber threat landscape through advanced forensic methodologies and cutting-edge security technologies.',
  location: 'Nashik, Maharashtra',
  email: 'Dandimenigopichand6@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/dandimeni-gopichand',
    github: 'https://github.com/Gooichand',
  },
  resumePdf: '/assets/Gopichand%20_Resume.pdf',
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Portrait of Gopichand Dandimeni',
  },
  interests: ['Threat Analysis', 'Digital Forensics', 'Incident Response', 'Malware Analysis'],
};

export const education = [
  {
    school: 'Sandip University',
    place: 'Nashik, Maharashtra',
    degree: 'Bachelor of Technology — Cybersecurity and Forensics (CSF)',
    period: 'July 2023 – Present',
    score: 'CSE · CSF Specialization',
  },
  {
    school: "St Joseph's Jr College",
    place: 'Nashik, Maharashtra',
    degree: 'Higher Secondary Education — Mathematics',
    period: 'June 2021 – May 2023',
    score: 'Class XII · 2023',
  },
  {
    school: 'Sri Lakshmi School',
    place: 'Nashik, Maharashtra',
    degree: 'Secondary Education — Foundation Studies',
    period: '2019 – May 2021',
    score: 'Class X · 2021',
  },
];

export const experience = [
  {
    company: 'Amroha Police (APCSIP-2026)',
    role: 'Cyber Security Intern',
    place: 'Amroha, UP · In-person',
    period: '2026',
    category: 'Security',
    status: 'Selected',
    points: [
      'Selected for APCSIP-2026 — hands-on exposure to cyber policing, digital forensics, threat intelligence, OSINT, cyber law, and cybercrime response.',
    ],
    evidence: ['Cyber Policing', 'Digital Forensics', 'OSINT', 'Cyber Law'],
  },
  {
    company: 'Naksh Foundation',
    role: 'Research & Content Team',
    place: 'Remote · Hybrid',
    period: 'Feb 2026 – Present',
    category: 'Research',
    status: 'Active',
    points: [
      'Selected for Project CyberShield — contributing to cybersecurity awareness, digital-safety research, and clear public-facing content.',
    ],
    evidence: ['CyberShield', 'Cybersecurity Research', 'Content Strategy'],
  },
  {
    company: 'The Linux Foundation · LFX',
    role: 'Student Intern · Mentee & Mentor',
    place: 'Remote · Open Source',
    period: 'Ongoing',
    category: 'Open Source',
    status: 'Ongoing',
    points: [
      'Contributing to cybersecurity and digital-forensics initiatives while supporting fellow open-source contributors through mentoring and code review.',
    ],
    evidence: ['Open Source', 'Mentorship', 'Code Review', 'Cybersecurity'],
  },
  {
    company: 'Edunet Foundation · VOIS',
    role: 'Cybersecurity Intern',
    place: 'Remote · Virtual',
    period: '4 weeks · 2025',
    category: 'Security',
    status: 'Completed',
    points: [
      'Built cybersecurity fundamentals through expert mentorship, blended learning, and hands-on project-based activities (VOIS & Vodafone Idea Foundation program).',
    ],
    evidence: ['Industry Training', 'Security Fundamentals', 'Project Work'],
  },
  {
    company: 'IISDGP · Public Policy Research',
    role: 'Research Intern',
    place: 'Remote · Policy Research',
    period: '2025',
    category: 'Research',
    status: 'Published',
    points: [
      'Conducted structured policy research aligned with the UN Sustainable Development Goals and authored a published research paper.',
    ],
    evidence: ['SDG Research', 'Policy Analysis', 'Published Paper'],
  },
  {
    company: 'Cyber War Lab',
    role: 'Cybersecurity Intern',
    place: 'Remote',
    period: 'Dec 2025 – Jan 2026',
    category: 'Security',
    status: 'Completed',
    points: [
      'Performed web-application and infrastructure testing, mapped attack paths with OWASP, Cyber Kill Chain, and MITRE ATT&CK, and documented findings.',
    ],
    evidence: ['OWASP', 'MITRE ATT&CK', 'Cyber Kill Chain', 'CTF'],
  },
  {
    company: 'Cyber Privilege',
    role: 'Cyber Forensics Specialist Intern',
    place: 'Remote',
    period: 'Aug 2025 – Jan 2026',
    category: 'Forensics',
    status: 'Completed',
    points: [
      'Supported digital-evidence acquisition, OSINT investigations, incident-response steps, and basic log review under supervision.',
    ],
    evidence: ['Evidence Acquisition', 'OSINT', 'Incident Response', 'Log Review'],
  },
  {
    company: 'Shadow Fox',
    role: 'Cybersecurity & Digital Forensics Intern',
    place: 'Remote',
    period: 'Jun – Jul 2025',
    category: 'Security',
    status: 'Completed',
    points: [
      'Completed task-based modules in vulnerability assessment, malware analysis, and digital-forensics workflows with documented write-ups.',
    ],
    evidence: ['Vulnerability Assessment', 'Malware Analysis', 'Digital Forensics'],
  },
  {
    company: 'GirlScript Summer of Code 2025',
    role: 'Open Source Mentor',
    place: 'Open Source',
    period: '2025',
    category: 'Open Source',
    status: 'Mentor',
    points: [
      'Mentored five open-source projects — Pouranik, NeoNest, Old School Game, DevNotes and Retail with Purpose — across collaboration, project planning, reviews and delivery.',
    ],
    evidence: ['Mentorship', 'Open Source', 'Project Management'],
  },
  {
    company: 'Cloud Counselage Pvt. Ltd.',
    role: 'Cybersecurity Intern',
    place: 'Remote',
    period: '6-week live project · 2025',
    category: 'Security',
    status: 'Completed',
    points: [
      'Worked on live cybersecurity projects, gaining industry exposure and completing a flexible project-based internship.',
    ],
    evidence: ['Live Projects', 'Cybersecurity', 'Industry Exposure'],
  },
  {
    company: 'LearnVern · Internshala · Great Learning · Ifortis · Coding Ninjas',
    role: 'Campus Ambassador',
    place: 'Multi-organization',
    period: '2024 – 2025',
    category: 'Leadership',
    status: 'Leadership',
    points: [
      'Represented multiple learning and technology organizations by engaging students and driving awareness of their opportunities.',
    ],
    evidence: ['Community', 'Communication', 'Outreach'],
  },
  {
    company: 'Asia Youth International MUN (AYIMUN)',
    role: 'Vice Chairperson',
    place: 'International youth leadership',
    period: '2024 – 2025',
    category: 'Leadership',
    status: 'Diplomacy',
    points: [
      'Developed diplomacy, negotiation, and global-issue awareness through engagement with an international community of youth leaders.',
    ],
    evidence: ['Diplomacy', 'Negotiation', 'Global Affairs'],
  },
  {
    company: 'SUN Cybersecurity Club · Sandip University',
    role: 'Secretary',
    place: 'Campus Leadership',
    period: '2024 – Present',
    category: 'Leadership',
    status: 'Leadership',
    points: [
      'Supported cybersecurity-club community activity and helped connect students around security learning and collaboration.',
    ],
    evidence: ['Leadership', 'Cybersecurity Community', 'Coordination'],
  },
  {
    company: 'IIT Guwahati',
    role: 'Data Analysis Intern',
    place: 'Virtual · Data Analysis',
    period: '2025',
    category: 'Research',
    status: 'Completed',
    points: [
      'Used Kaggle tools, Python, and statistical modeling techniques to analyze datasets and derive actionable insights.',
    ],
    evidence: ['Python', 'Kaggle', 'Statistical Analysis'],
  },
  {
    company: 'Internships & Personal Projects',
    role: 'Web Designer',
    place: 'Frontend Development',
    period: '2024 – Present',
    category: 'Open Source',
    status: 'Projects',
    points: [
      'Developed a portfolio of frontend websites focused on clear communication, effective interfaces, and engaging user experiences.',
    ],
    evidence: ['HTML', 'CSS', 'JavaScript', 'UI Design'],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  /** Omit when the repository isn't public — the GitHub button is hidden instead of linking to a 404. */
  github?: string;
  /** Live deployment — shows a "Live" button when present. */
  live?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants' | 'chain' | 'eye';
};

export const projects: Project[] = [
  {
    id: 'evid-dgc',
    title: 'EVID-DGC — Blockchain Evidence',
    year: '2026',
    genre: 'Blockchain · Forensics',
    logline: 'Digital forensic evidence management with immutable records and chain of custody — anchored on Polygon, stored on IPFS.',
    stack: ['Node.js', 'Express', 'Web3', 'Polygon', 'Supabase', 'IPFS', 'Socket.IO'],
    build: [
      'Designed an 8-role RBAC evidence platform that anchors chain-of-custody records on the Polygon blockchain with dual MetaMask + email authentication.',
      'Shipped Phase 1 & 2 (evidence upload, tamper-proof records, dual auth); Phase 3 in progress — AI deepfake detection, metadata forensics and legal compliance.',
    ],
    features: [
      '8-role RBAC access control',
      'Dual authentication — MetaMask + email',
      'Blockchain anchoring on Polygon',
      'IPFS (Pinata) evidence storage',
      'Immutable chain-of-custody records',
    ],
    metrics: [
      { value: '8', label: 'roles · RBAC' },
      { value: '2', label: 'phases shipped' },
      { value: '3', label: 'phase roadmap' },
      { value: '100%', label: 'tamper-proof records' },
    ],
    github: 'https://github.com/Gooichand/blockchain-evidence',
    live: 'https://blockchain-evidence.onrender.com',
    palette: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
    motif: 'chain',
  },
  {
    id: 'look-dgc',
    title: 'LOOK-DGC — Image Forensics',
    year: '2026',
    genre: 'Forensics · Computer Vision',
    logline: 'Digital image forensics toolkit with 50+ analysis tools — ghost detection, copy-move forgery, AI verification and PDF reports.',
    stack: ['Python', 'PySide6', 'OpenCV', 'NumPy', 'PyTorch', 'Docker'],
    build: [
      'Built a 50+ tool image-forensics suite with JPEG ghost detection, copy-move forgery analysis and AI-based TruFor verification.',
      'Shipped a PySide6 desktop GUI, PDF evidence reports and a Docker image for portable analysis.',
    ],
    features: [
      '50+ analysis tools',
      'JPEG ghost detection',
      'Copy-move forgery detection',
      'AI TruFor verification',
      'PDF evidence reports',
      'Dockerized distribution',
    ],
    metrics: [
      { value: '50+', label: 'analysis tools' },
      { value: '2', label: 'forgery detectors' },
      { value: '1', label: 'AI verification model' },
    ],
    github: 'https://github.com/Gooichand/LOOK-DGC',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'eye',
  },
  {
    id: 'evid-certs',
    title: 'evid-dgc-certificates',
    year: '2026',
    genre: 'Blockchain',
    logline: 'Digital certificate management — issuance anchored on the blockchain for verifiable, tamper-proof credentials.',
    stack: ['Node.js', 'Blockchain', 'Polygon', 'Supabase', 'IPFS'],
    build: [
      'Built a certificate issuance & verification platform with on-chain anchoring on Polygon and Supabase + IPFS storage.',
      'The verified-certificate layer is designed to pair with the EVID-DGC evidence system.',
    ],
    features: [
      'On-chain certificate anchoring',
      'Supabase + IPFS storage',
      'Verification links for recipients',
    ],
    metrics: [
      { value: '1', label: 'on-chain anchor' },
      { value: '100%', label: 'verifiable' },
    ],
    github: 'https://github.com/Gooichand/evid-dgc-certificates',
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'chain',
  },
  {
    id: 'neonest',
    title: 'NeoNest — AI Baby Care',
    year: '2025',
    genre: 'AI · Full-Stack · GSSoC',
    logline: 'AI chatbot for baby-care guidance built for new parents — mentored as a GSSoC 2025 project.',
    stack: ['React', 'Node.js', 'AI/ML', 'Vercel'],
    build: [
      'Mentored and contributed to an AI-powered baby-care guidance chatbot used by new parents.',
      'Drove planning, reviews and delivery through the GSSoC 2025 open-source cycle.',
    ],
    features: ['AI chatbot for baby care', 'New-parent guidance', 'Deployed on Vercel'],
    metrics: [{ value: 'GSSoC', label: '2025 · Mentor' }],
    github: 'https://github.com/AditiGupta-tech/neonest',
    live: 'https://neonest-babycare.vercel.app',
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'flow',
  },
  {
    id: 'eduhaven',
    title: 'EduHaven — Student Learning',
    year: '2025',
    genre: 'EdTech · Real-time · GSSoC',
    logline: 'Collaborative learning with real-time collaboration, tasks, an AI chatbot and gamification — GSSoC 2025.',
    stack: ['React', 'Node.js', 'WebSockets', 'MongoDB', 'Vercel'],
    build: [
      'Mentored an open learning platform with real-time collaboration, AI chatbot support and gamified task tracking.',
      'Guided architecture, reviews and delivery across the GSSoC 2025 cycle.',
    ],
    features: ['Real-time collaboration', 'AI chatbot', 'Gamified tasks', 'Student learning paths'],
    metrics: [{ value: 'GSSoC', label: '2025 · Mentor' }],
    github: 'https://github.com/EduHaven/EduHaven',
    live: 'https://eduhaven.online',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'tenants',
  },
  {
    id: 'pouranik',
    title: 'Pouranik — Digital Bookshelf',
    year: '2025',
    genre: 'Social Reading · GSSoC',
    logline: 'Social reading platform for books and reading communities — GSSoC 2025.',
    stack: ['React', 'Next.js', 'Vercel', 'Database'],
    build: [
      'Mentored a social reading platform connecting books and reading communities.',
      'Supported feature planning, code review and delivery through the GSSoC cycle.',
    ],
    features: ['Digital bookshelf', 'Reading communities', 'Next.js + Vercel'],
    metrics: [{ value: 'GSSoC', label: '2025 · Mentor' }],
    github: 'https://github.com/BhaktiMore18/Pouranik',
    live: 'https://pouranik.vercel.app',
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'tenants',
  },
  {
    id: 'devnotes',
    title: 'DevNotes — Web Dev Learning',
    year: '2025',
    genre: 'Learning Platform · GSSoC',
    logline: 'Frontend, backend and deployment learning paths with tutorials — GSSoC 2025.',
    stack: ['React', 'Next.js', 'Markdown', 'Vercel'],
    build: [
      'Mentored a web-development learning platform with structured learning paths and Markdown tutorials.',
    ],
    features: ['Learning paths', 'Markdown tutorials', 'Frontend / backend / deployment tracks'],
    metrics: [{ value: 'GSSoC', label: '2025 · Mentor' }],
    github: 'https://github.com/Amarjha01/DevNotes',
    live: 'https://devnotes.amarjha.dev',
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'flow',
  },
  {
    id: 'os-compass',
    title: 'OpenSource Compass',
    year: '2026',
    genre: 'Open Source · SWOC',
    logline: 'Guides beginners through Git/GitHub and open-source programs — SWOC 2026 mentor project.',
    stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    build: [
      'Mentored a beginner-friendly guide to Git, GitHub and open-source contribution.',
    ],
    features: ['Git/GitHub guides', 'Open-source program index', 'GitHub Pages'],
    metrics: [{ value: 'SWOC', label: '2026 · Mentor' }],
    github: 'https://github.com/sayeeg-11/OpenSource-Compass',
    palette: { from: '#04140e', via: '#0f4a33', to: '#050a08', accent: '#a3ff6f' },
    motif: 'flow',
  },
  {
    id: 'pixel-phantoms',
    title: 'Pixel Phantoms',
    year: '2026',
    genre: 'Open Source · SWOC',
    logline: 'Open-source project mentored during SWOC 2026.',
    stack: ['Web', 'Open Source'],
    build: ['Mentored and guided contributors through SWOC 2026.'],
    features: ['SWOC mentor track', 'Open-source collaboration'],
    metrics: [{ value: 'SWOC', label: '2026 · Mentor' }],
    palette: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'jan-suraksha',
    title: 'Jan Suraksha',
    year: '2026',
    genre: 'Open Source · SWOC',
    logline: 'Open-source project mentored during SWOC 2026.',
    stack: ['Web', 'Open Source'],
    build: ['Mentored and guided contributors through SWOC 2026.'],
    features: ['SWOC mentor track', 'Open-source collaboration'],
    metrics: [{ value: 'SWOC', label: '2026 · Mentor' }],
    palette: { from: '#0c1216', via: '#2b434f', to: '#070a0c', accent: '#7ee0ff' },
    motif: 'shield',
  },
  {
    id: 'cryptohub',
    title: 'CryptoHub',
    year: '2026',
    genre: 'Open Source · ECWoC',
    logline: 'Open-source project mentored during Elite Coders Winter of Code 2026.',
    stack: ['Web', 'Open Source'],
    build: ['Mentored and guided contributors through ECWoC 2026.'],
    features: ['ECWoC mentor track', 'Open-source collaboration'],
    metrics: [{ value: 'ECWoC', label: '2026 · Mentor' }],
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'shield',
  },
  {
    id: 'localmind',
    title: 'LocalMind',
    year: '2026',
    genre: 'AI · Local · ECWoC',
    logline: 'Local-first AI project contributed during Elite Coders Winter of Code 2026.',
    stack: ['AI', 'Web', 'Open Source'],
    build: ['Contributed features and fixes during ECWoC 2026.'],
    features: ['Contributor track', 'AI + web'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'flow',
  },
  {
    id: 'astraguard-ai',
    title: 'AstraGuard AI',
    year: '2026',
    genre: 'AI · Security · ECWoC',
    logline: 'AI-driven security project contributed during Elite Coders Winter of Code 2026.',
    stack: ['AI', 'Security', 'Open Source'],
    build: ['Contributed features and fixes during ECWoC 2026.'],
    features: ['Contributor track', 'AI + security'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'shield',
  },
  {
    id: 'ecolife',
    title: 'EcoLife',
    year: '2026',
    genre: 'Sustainability · ECWoC',
    logline: 'Sustainability-focused web project contributed during ECWoC 2026.',
    stack: ['Web', 'Open Source'],
    build: ['Contributed features and fixes during ECWoC 2026.'],
    features: ['Contributor track', 'Sustainability theme'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    palette: { from: '#04140e', via: '#0f4a33', to: '#050a08', accent: '#a3ff6f' },
    motif: 'tenants',
  },
  {
    id: 'personal-portfolio',
    title: 'Personal Portfolio',
    year: '2025',
    genre: 'Web · Own',
    logline: 'My own portfolio site — an early identity in the series, still streaming on GitHub Pages.',
    stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    build: ['Designed and shipped the original portfolio with a forensic workspace concept.'],
    features: ['Responsive design', 'GitHub Pages hosting'],
    metrics: [{ value: 'v1', label: 'origin story' }],
    github: 'https://github.com/Gooichand/Gooichand.github.io',
    live: 'https://gooichand.github.io/',
    palette: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
    motif: 'eye',
  },
  {
    id: 'agripredict',
    title: 'AgriPredict',
    year: '2025',
    genre: 'ML · Agriculture · Own',
    logline: 'Machine-learning crop prediction built around agriculture data.',
    stack: ['Python', 'ML', 'Web'],
    build: ['Built an ML-powered crop prediction flow and deployed it for demo use.'],
    features: ['Crop prediction', 'ML pipeline', 'Live demo'],
    metrics: [{ value: 'Own', label: 'project' }],
    github: 'https://github.com/Gooichand/AgriPredict',
    live: 'https://agri-predict-umber.vercel.app',
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'tenants',
  },
  {
    id: 'simpsons-rule',
    title: "Simpson's Rule Calculator",
    year: '2025',
    genre: 'Math · Web · Own',
    logline: 'Numerical-integration calculator implementing Simpson\'s rule — clean web tool.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    build: ['Implemented Simpson\'s rule numerical integration in a lightweight web calculator.'],
    features: ['Simpson\'s rule', 'Step-based approximation'],
    metrics: [{ value: 'Own', label: 'project' }],
    github: 'https://github.com/Gooichand/Simpson-s-Rule-Calculator',
    live: 'https://gooichand.github.io/Simpson-s-Rule-Calculator/',
    palette: { from: '#0c1216', via: '#2b434f', to: '#070a0c', accent: '#7ee0ff' },
    motif: 'flow',
  },
  {
    id: 'security-pass-dgc',
    title: 'SECURITY-PASS-DGC',
    year: '2025',
    genre: 'Security · Own',
    logline: 'A personal security pass project — password/credential-focused web utility.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    build: ['Built a security-pass generator utility with a clean web interface.'],
    features: ['Pass generation', 'Security-first UI'],
    metrics: [{ value: 'Own', label: 'project' }],
    github: 'https://github.com/Gooichand/SECURITY-PASS-DGC',
    live: 'https://gooichand.github.io/SECURITY-PASS-DGC/',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'shield',
  },
  {
    id: 'ai-learning-coach',
    title: 'AI Learning Coach',
    year: '2025',
    genre: 'AI · EdTech · Own',
    logline: 'IBM-backed AI learning coach — personalized study guidance in the browser.',
    stack: ['AI', 'Web', 'GitHub Pages'],
    build: ['Built an AI learning coach (IBM track) deployed to GitHub Pages.'],
    features: ['Personalized guidance', 'AI coach interface'],
    metrics: [{ value: 'Own', label: 'project' }],
    github: 'https://github.com/Gooichand/AI-Learning-Coach-ibm',
    live: 'https://gooichand.github.io/AI-Learning-Coach-ibm/',
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'flow',
  },
  {
    id: 'speedy-study',
    title: 'Speedy Study Demo',
    year: '2025',
    genre: 'Study Tool · Own',
    logline: 'Rapid study-assistant demo — a lightweight learning utility built with Lovable.',
    stack: ['Web', 'AI'],
    build: ['Shipped a quick study-assistant demo to test AI-assisted study flows.'],
    features: ['Study assistant', 'Quick demo'],
    metrics: [{ value: 'Own', label: 'project' }],
    github: 'https://github.com/Gooichand/speedy-study-demo',
    live: 'https://dgc-ai.lovable.app',
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'soul-sense',
    title: 'Soul Sense',
    year: '2026',
    genre: 'Health · AI · ECWoC',
    logline: 'AI-assisted wellness project contributed during ECWoC 2026.',
    stack: ['AI', 'Web'],
    build: ['Contributed features and fixes to a wellness-focused open-source project.'],
    features: ['Contributor track', 'Wellness + AI'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    github: 'https://github.com/nupurmadaan04/SOUL_SENSE_EXAM',
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'tenants',
  },
  {
    id: 'careerhub',
    title: 'CareerHub',
    year: '2026',
    genre: 'Career · ECWoC',
    logline: 'Career-discovery platform contributed during ECWoC 2026.',
    stack: ['Web', 'Open Source'],
    build: ['Contributed features and fixes to the CareerHub platform.'],
    features: ['Career discovery', 'Live demo'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    github: 'https://github.com/mansi066/CareerHub',
    live: 'https://career-hub-vert.vercel.app',
    palette: { from: '#0c1216', via: '#2b434f', to: '#070a0c', accent: '#7ee0ff' },
    motif: 'tenants',
  },
  {
    id: 'justcode',
    title: 'JustCode',
    year: '2026',
    genre: 'Dev · ECWoC',
    logline: 'Coding-practice platform contributed during ECWoC 2026.',
    stack: ['Web', 'Open Source'],
    build: ['Contributed features and fixes to the JustCode coding platform.'],
    features: ['Coding practice', 'Live demo'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    github: 'https://github.com/ANU-2524/JustCoding',
    live: 'https://just-coding-theta.vercel.app',
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'flow',
  },
  {
    id: 'devconnect',
    title: 'DevConnect',
    year: '2026',
    genre: 'Community · ECWoC',
    logline: 'Developer-community platform contributed during ECWoC 2026.',
    stack: ['Web', 'Open Source'],
    build: ['Contributed features and fixes to the DevConnect community platform.'],
    features: ['Community platform', 'Live demo'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    github: 'https://github.com/TiwariDivya25/DevConnect',
    live: 'https://devconnect-delta.vercel.app',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'tenants',
  },
  {
    id: 'sehat-saathi',
    title: 'Sehat Saathi',
    year: '2026',
    genre: 'Health · ECWoC',
    logline: 'Health companion guide contributed during ECWoC 2026.',
    stack: ['Web', 'Open Source'],
    build: ['Contributed features and fixes to the Sehat Saathi guide project.'],
    features: ['Health guide', 'Live demo'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    github: 'https://github.com/Naman-iitm/sehat-saathi-guide',
    live: 'https://sehat-saathi-guide.netlify.app',
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'shield',
  },
  {
    id: 'resilient-email',
    title: 'Resilient Email Service',
    year: '2026',
    genre: 'Infra · ECWoC',
    logline: 'Reliable email-delivery service contributed during ECWoC 2026.',
    stack: ['Web', 'Backend', 'Open Source'],
    build: ['Contributed features and fixes to a reliable email-delivery service.'],
    features: ['Reliable delivery', 'Live demo'],
    metrics: [{ value: 'ECWoC', label: '2026 · Contributor' }],
    github: 'https://github.com/Harshi-max/reliable-email-delivery',
    live: 'https://reliable-email-delivery.vercel.app',
    palette: { from: '#0c1216', via: '#2b434f', to: '#070a0c', accent: '#7ee0ff' },
    motif: 'flow',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'apcsip-2026',
    title: 'APCSIP-2026 Selection',
    org: 'Amroha Police Cyber Security Program',
    detail: 'Selected for the Amroha Police Cyber Security Internship Program.',
    laurel: 'Selected',
  },
  {
    id: 'postman-expert',
    title: 'Postman API Expert',
    org: 'Postman',
    detail: 'API expert credential — Level 1, 2025.',
    laurel: 'API · 2025',
  },
  {
    id: 'google-dmdm',
    title: 'Google DMDM',
    org: 'Google',
    detail: 'Digital marketing & data management credential.',
    laurel: 'Google',
  },
  {
    id: 'community-competitor',
    title: 'Community Competitor',
    org: 'Google',
    detail: 'Recognized for community competition participation.',
    laurel: 'Google',
  },
  {
    id: 'ewoc-26',
    title: 'ECWoC 2026',
    org: 'Elite Coders Winter of Code',
    detail: 'Mentor & contributor across multiple open-source projects.',
    laurel: 'Open Source',
  },
  {
    id: 'kaggle-community',
    title: 'Kaggle Community',
    org: 'Kaggle',
    detail: 'Active contributor in the Kaggle data-science community.',
    laurel: 'Data',
  },
  {
    id: 'open-source-mentor',
    title: 'Open Source Mentor',
    org: 'GSSoC · SWOC · ECWoC',
    detail: 'Mentored projects across GirlsScript SWoC, SWOC and ECWoC.',
    laurel: 'Mentor',
  },
  {
    id: 'opswat-cip',
    title: 'Critical Infrastructure',
    org: 'OPSWAT',
    detail: 'Introduction to Critical Infrastructure certification.',
    laurel: 'Training',
  },
  {
    id: 'pull-shark',
    title: 'Pull Shark',
    org: 'GitHub',
    detail: 'GitHub achievement — opened 16+ merged pull requests.',
    laurel: 'GitHub',
  },
  {
    id: 'quickdraw',
    title: 'Quickdraw',
    org: 'GitHub',
    detail: 'GitHub achievement — merged a pull request within 5 minutes of opening.',
    laurel: 'GitHub',
  },
  {
    id: 'swoc-26',
    title: 'SWOC 2026',
    org: 'Social Winter of Code',
    detail: 'Mentor for open-source projects in SWOC 2026.',
    laurel: 'Open Source',
  },
  {
    id: 'yolo',
    title: 'YOLO',
    org: 'GitHub',
    detail: 'GitHub achievement — merged a pull request without any code review.',
    laurel: 'GitHub',
  },
  {
    id: 'starstruck',
    title: 'Starstruck',
    org: 'GitHub',
    detail: 'GitHub achievement — repository with 16+ stars.',
    laurel: 'GitHub',
  },
  {
    id: 'blob',
    title: 'Blob',
    org: 'GitHub',
    detail: 'GitHub achievement — created and shared a repository.',
    laurel: 'GitHub',
  },
  {
    id: 'blob-1',
    title: 'Blob · Rookie',
    org: 'GitHub',
    detail: 'GitHub achievement — early repository creation milestone.',
    laurel: 'GitHub',
  },
  {
    id: 'blob-2',
    title: 'Blob · Explorer',
    org: 'GitHub',
    detail: 'GitHub achievement — repository creation series.',
    laurel: 'GitHub',
  },
  {
    id: 'cka',
    title: 'CKA',
    org: 'CNCF · Linux Foundation',
    detail: 'Certified Kubernetes Administrator.',
    laurel: 'Certification',
  },
];

export type Certification = { issuer: string; name: string; link?: string };

export const certifications: Certification[] = [
  { issuer: 'IBM', name: 'IBM Cybersecurity Certification (2025)' },
  { issuer: 'Cyber Privilege', name: 'Cyber Privilege Certification (2025)' },
  { issuer: 'ISC2', name: 'Certified in Cybersecurity — CC (2025)' },
  { issuer: 'Compliance', name: 'CC Compliance Certification (2025)' },
  { issuer: 'TCS iON', name: 'TCS iON Career Edge — Young Professional (2025)' },
  { issuer: 'Linux Foundation', name: 'Cybersecurity Essentials — LFC108 (2025)' },
  { issuer: 'Competition', name: "Strategy Storm's Case Competition (2026)" },
  { issuer: 'Security Training', name: 'Introduction to System Security (2025)' },
  { issuer: 'Security Training', name: 'Protection from Browser Attacks (2025)' },
  { issuer: 'ECWoC', name: 'Elite Coders Winter of Code (2026)' },
  { issuer: 'CSAM', name: 'CSAM Combat Certificate (2025)' },
  { issuer: 'Professional Training', name: 'Professional Certificate (2026)' },
  { issuer: 'Advanced Training', name: 'Advanced Certification (2026)' },
  { issuer: 'ShadowFox', name: 'ShadowFox Cybersecurity Internship (2024)' },
  { issuer: 'Build with Vision', name: 'Hack Storm Challenge (2024)' },
  { issuer: 'Postman', name: 'Postman API Fundamentals (2025)' },
  { issuer: 'Professional Course', name: 'Data Science with Python (2024)' },
  { issuer: 'Coding Bootcamp', name: 'DSA with Java Bootcamp (2024)' },
  { issuer: 'Security Training', name: 'Web Application Hacking (2024)' },
  { issuer: 'Security Institute', name: 'Critical Infrastructure Protection (2024)' },
  { issuer: 'Job Simulation', name: 'Cybersecurity Analysis Simulation (2024)' },
  { issuer: 'Professional Conference', name: 'Conference Certificate (2024)' },
  { issuer: 'Conference Award', name: 'Outstanding Delegate (2024)' },
  { issuer: 'Academic Conference', name: 'Conference Certificate (2024)' },
  { issuer: 'Professional Internship', name: 'Internship Completion Certificate (2024)' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    subtitle: 'Threat modeling · Defensive analysis',
    skills: [
      { name: 'Threat Modeling', mono: 'Tm' },
      { name: 'OWASP', mono: 'Ow' },
      { name: 'Incident Response', mono: 'Ir' },
      { name: 'Vulnerability Assessment', mono: 'Va' },
      { name: 'NIST', mono: 'Nt' },
      { name: 'Zero Trust', mono: 'Zt' },
    ],
  },
  {
    id: 'forensics',
    title: 'Digital Forensics',
    subtitle: 'Uncover · analyze · preserve evidence',
    skills: [
      { name: 'Autopsy', mono: 'Au' },
      { name: 'Volatility', mono: 'Vo' },
      { name: 'Wireshark', mono: 'Ws' },
      { name: 'OSINT', mono: 'Os' },
      { name: 'Windows Forensics', mono: 'Wf' },
      { name: 'Network Forensics', mono: 'Nf' },
    ],
  },
  {
    id: 'programming',
    title: 'Programming',
    subtitle: 'Languages that ship systems',
    skills: [
      { name: 'Python', mono: 'Py', note: 'Primary' },
      { name: 'JavaScript', mono: 'Js' },
      { name: 'Java', mono: 'Jv' },
      { name: 'C / C++', mono: 'Cc' },
      { name: 'TypeScript', mono: 'Ts' },
      { name: 'Go', mono: 'Go' },
      { name: 'Rust', mono: 'Rs' },
    ],
  },
  {
    id: 'web',
    title: 'Web Engineering',
    subtitle: 'Responsive · accessible interfaces',
    skills: [
      { name: 'HTML5', mono: 'H5' },
      { name: 'CSS3', mono: 'C3' },
      { name: 'React', mono: 'Re' },
      { name: 'Tailwind', mono: 'Tw' },
      { name: 'REST APIs', mono: 'Ap' },
      { name: 'Responsive UI', mono: 'Ru' },
    ],
  },
  {
    id: 'data',
    title: 'Data Intelligence',
    subtitle: 'Turn information into decisions',
    skills: [
      { name: 'NumPy', mono: 'Np' },
      { name: 'OpenCV', mono: 'Cv' },
      { name: 'SQLite', mono: 'Sq' },
      { name: 'Data Analysis', mono: 'Da' },
      { name: 'Visualization', mono: 'Vi' },
      { name: 'Reporting', mono: 'Rp' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & Tools',
    subtitle: 'Code · deploy · collaborate',
    skills: [
      { name: 'Git', mono: 'Gt' },
      { name: 'GitHub', mono: 'Gh' },
      { name: 'Docker', mono: 'Dk' },
      { name: 'Supabase', mono: 'Sb' },
      { name: 'IPFS', mono: 'Ip' },
      { name: 'Linux', mono: 'Lx' },
    ],
  },
  {
    id: 'osint',
    title: 'OSINT & Threat Intel',
    subtitle: 'Open-source intelligence gathering',
    skills: [
      { name: 'Maltego', mono: 'Ma' },
      { name: 'Shodan', mono: 'Sh' },
      { name: 'MISP', mono: 'Mp' },
      { name: 'MITRE ATT&CK', mono: 'Mt' },
      { name: 'VirusTotal', mono: 'Vt' },
      { name: 'Censys', mono: 'Ce' },
    ],
  },
  {
    id: 'malware',
    title: 'Malware Analysis',
    subtitle: 'Reverse engineering · behavior',
    skills: [
      { name: 'PE Studio', mono: 'Pe' },
      { name: 'Cutter', mono: 'Cu' },
      { name: 'Sysinternals', mono: 'Sy' },
      { name: 'ProcMon', mono: 'Pr' },
      { name: 'OllyDbg', mono: 'Ol' },
      { name: 'tcpdump', mono: 'Td' },
    ],
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill appears in the projects, certifications or experiences.
 */
export const skillEvidence: Record<string, string[]> = {
  Python: ['EVID-DGC', 'LOOK-DGC', 'IIT Guwahati intern'],
  JavaScript: ['Web Designer', 'OpenSource Compass'],
  React: ['NeoNest', 'EduHaven', 'Pouranik'],
  'C / C++': ['DSA with Java Bootcamp'],
  TypeScript: ['EduHaven', 'DevConnect'],
  Wireshark: ['Shadow Fox', 'Network forensics'],
  Autopsy: ['Cyber Privilege', 'Forensics workflow'],
  Volatility: ['Memory forensics'],
  OSINT: ['Amroha Police', 'Cyber Privilege'],
  'Incident Response': ['Cyber Privilege', 'IR workflows'],
  OWASP: ['Cyber War Lab'],
  'MITRE ATT&CK': ['Cyber War Lab'],
  'Threat Modeling': ['Cyber War Lab'],
  NIST: ['Security grounding'],
  Docker: ['LOOK-DGC', 'EVID-DGC'],
  Supabase: ['EVID-DGC', 'evid-dgc-certificates'],
  IPFS: ['EVID-DGC', 'evid-dgc-certificates'],
  Linux: ['LFX Mentorship', 'Kali Linux'],
  Git: ['GitHub achievements', 'Open Source Compass'],
  GitHub: ['Pull Shark', 'Quickdraw', 'Starstruck'],
  SQLite: ['Browser Download History Mapper'],
  NumPy: ['LOOK-DGC', 'IIT Guwahati'],
  OpenCV: ['LOOK-DGC', 'AgriPredict'],
  'Data Analysis': ['IIT Guwahati'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'The Foundations',
    period: '2019 – 2023',
    synopsis: 'School years in Nashik — secondary education through higher secondary with a mathematics focus.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'The Groundwork',
        description: 'Secondary education at Sri Lakshmi School with foundation studies.',
        tags: ['Class X', 'Secondary'],
        runtime: '2021',
        palette: amber,
      },
      {
        code: 'S01 E02',
        title: 'The Mathematician',
        description: 'Higher secondary education at St Joseph\'s Jr College with a mathematics major.',
        tags: ['Class XII', 'Mathematics'],
        runtime: '2023',
        palette: ocean,
      },
    ],
  },
  {
    number: 2,
    title: 'The Degree',
    period: '2023 – Present',
    synopsis: 'B.Tech in Cybersecurity and Forensics at Sandip University, plus campus leadership.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'The Specialist',
        description: 'Bachelor of Technology — CSE with a specialization in Cybersecurity and Forensics (CSF).',
        tags: ['B.Tech', 'CSF', 'CSE'],
        runtime: '2023 – Present',
        palette: violet,
      },
      {
        code: 'S02 E02',
        title: 'The Secretary',
        description: 'Serving as Secretary of the SUN Cybersecurity Club at Sandip University.',
        tags: ['SUN Club', 'Leadership'],
        runtime: '2024 – Present',
        palette: crimson,
      },
      {
        code: 'S02 E03',
        title: 'The Diplomat',
        description: 'Vice Chairperson at the Asia Youth International Model United Nations.',
        tags: ['AYIMUN', 'Diplomacy'],
        runtime: '2024 – 2025',
        palette: jade,
      },
    ],
  },
  {
    number: 3,
    title: 'Security Missions',
    period: '2024 – 2026',
    synopsis: 'Internships on the front lines — cyber policing, web-security testing and industry programs.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'The Selection',
        description: 'Selected for APCSIP-2026 at Amroha Police — cyber policing, OSINT, cyber law and cybercrime response.',
        tags: ['Amroha Police', 'APCSIP-2026', 'Cyber Law'],
        runtime: '2026',
        palette: ocean,
      },
      {
        code: 'S03 E02',
        title: 'The Tester',
        description: 'Web-application and infrastructure testing at Cyber War Lab — OWASP, MITRE ATT&CK and the Cyber Kill Chain.',
        tags: ['OWASP', 'MITRE ATT&CK', 'CTF'],
        runtime: 'Dec 2025 – Jan 2026',
        palette: crimson,
      },
      {
        code: 'S03 E03',
        title: 'The Prodigy',
        description: 'Shadow Fox modules in vulnerability assessment and malware analysis, then forensics specialization at Cyber Privilege.',
        tags: ['Vulnerability Assessment', 'Malware Analysis', 'Forensics'],
        runtime: 'Jun 2025 – Jan 2026',
        palette: violet,
      },
      {
        code: 'S03 E04',
        title: 'The Industry Track',
        description: 'Live cybersecurity projects at Cloud Counselage and industry training through VOIS / Edunet Foundation.',
        tags: ['Live Projects', 'Security Fundamentals'],
        runtime: '2025',
        palette: amber,
      },
    ],
  },
  {
    number: 4,
    title: 'Forensics, Research & Data',
    period: '2025 – Present',
    synopsis: 'The analytical side of the story — evidence work, policy research and data analysis.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'The Analyst',
        description: 'Data analysis internship at IIT Guwahati — Python, Kaggle and statistical modeling.',
        tags: ['Python', 'Kaggle', 'Statistics'],
        runtime: '2025',
        palette: jade,
      },
      {
        code: 'S04 E02',
        title: 'The Researcher',
        description: 'Policy research at the IISDGP aligned with the UN SDGs — with a published research paper.',
        tags: ['SDG', 'Policy Research', 'Published'],
        runtime: '2025',
        palette: ocean,
      },
      {
        code: 'S04 E03',
        title: 'The Defender',
        description: 'Forensics specialist intern at Cyber Privilege, then research & content for Naksh Foundation\'s Project CyberShield.',
        tags: ['Evidence Acquisition', 'CyberShield'],
        runtime: 'Aug 2025 – Present',
        palette: crimson,
      },
    ],
  },
  {
    number: 5,
    title: 'Open Source & Leadership',
    period: '2025 – Ongoing',
    synopsis: 'Giving back — mentorship, community and open-source contribution.',
    episodes: [
      {
        code: 'S05 E01',
        title: 'The Mentor',
        description: 'Mentored five open-source projects during GirlScript Summer of Code 2025.',
        tags: ['GSSoC', 'Mentorship'],
        runtime: '2025',
        palette: jade,
      },
      {
        code: 'S05 E02',
        title: 'The Maintainer',
        description: 'LFX mentorship with The Linux Foundation — open-source cybersecurity initiatives and code review.',
        tags: ['LFX', 'Linux Foundation'],
        runtime: 'Ongoing',
        palette: violet,
      },
      {
        code: 'S05 E03',
        title: 'The Ambassador',
        description: 'Campus ambassador across six learning platforms, plus freelance web design in the open.',
        tags: ['Community', 'Outreach', 'Web Design'],
        runtime: '2024 – Present',
        palette: amber,
      },
    ],
  },
  {
    number: 6,
    title: "What's Next",
    period: 'Now streaming',
    synopsis: 'The next arc — threat intelligence, advanced forensics and deeper research.',
    episodes: [
      {
        code: 'S06 E01',
        title: 'The Next Mission',
        description: 'APCSIP-2026, threat intelligence, incident response and the forensic-toolkit suite.',
        tags: ['APCSIP-2026', 'Threat Intel', 'Incident Response'],
        runtime: 'In production',
        palette: ocean,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Flagship', title: 'EVID-DGC', detail: 'Blockchain evidence · Polygon + IPFS', palette: crimson },
  { label: 'Selected', title: 'APCSIP-2026', detail: 'Amroha Police Cyber Security Program', palette: ocean },
  { label: 'Certified', title: 'ISC2 CC', detail: 'Certified in Cybersecurity', palette: violet },
  { label: 'Forensics', title: 'LOOK-DGC', detail: '50+ tool image-forensics suite', palette: jade },
  { label: 'Mentorship', title: 'GSSoC 2025', detail: 'Mentored five open-source projects', palette: amber },
  { label: 'Cloud', title: 'CKA', detail: 'Certified Kubernetes Administrator', palette: ocean },
  { label: 'Research', title: 'Published Paper', detail: 'SDG policy research · IISDGP', palette: violet },
  { label: 'Leadership', title: 'Vice Chairperson', detail: 'AYIMUN · international youth', palette: jade },
  { label: 'Stats', title: '50+', detail: 'security tools tested', palette: crimson },
  { label: 'Experience', title: '10+ Missions', detail: 'Security · Forensics · Open Source', palette: amber },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Identity',
    title: 'WHO IS DGC?',
    lines: ['Gopichand Dandimeni', 'Cybersecurity & Digital Forensics student', 'Nashik, Maharashtra, India'],
    chips: ['CyberSec', 'Forensics', 'Web', 'Data'],
  },
  {
    kicker: 'Education',
    title: 'B.Tech · CSF',
    lines: ['Sandip University — CSE with Cybersecurity & Forensics', '2023 – Present · Fourth year'],
    chips: ['B.Tech', 'CSF'],
  },
  {
    kicker: 'Skills',
    title: 'Six Domains',
    lines: ['Cybersecurity · Digital Forensics · Programming', 'Web Engineering · Data Intelligence · Cloud & Tools'],
    chips: ['Python', 'Linux', 'Wireshark', 'Autopsy', 'Docker'],
  },
  {
    kicker: 'Internships',
    title: 'The Missions',
    lines: ['10+ internships across security, forensics & research', 'APCSIP-2026 · Amroha Police — selected', 'LFX Mentorship · GSSoC 2025 · IIT Guwahati'],
  },
  {
    kicker: 'Projects',
    title: '26 Originals',
    lines: ['EVID-DGC — blockchain evidence on Polygon + IPFS', 'LOOK-DGC — 50+ tool image-forensics suite', 'Open-source mentorship across GSSoC, SWOC & ECWoC'],
  },
  {
    kicker: 'Certified',
    title: '25 Certifications',
    lines: ['ISC2 · IBM · TCS iON · Postman · Linux Foundation', 'Google DMDM · CKA · OPSWAT'],
    chips: ['ISC2 CC', 'CKA', 'IBM'],
  },
  {
    kicker: 'Stats',
    title: 'The Numbers',
    lines: ['4+ years studying · 50+ tools tested', '10+ malware analyzed · 19 badges'],
    chips: ['4+ yrs', '50+ tools', '19 badges'],
  },
  {
    kicker: 'Current mission',
    title: 'Now exploring',
    lines: ['Threat intelligence · Digital forensics · Incident response'],
  },
];

export type ProfileId = 'recruiter' | 'friends' | 'unknown' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Resume, skills & certifications first',
    color: '#4cc9ff',
    order: ['story', 'moments', 'skills', 'originals', 'about', 'journey', 'picks'],
  },
  {
    id: 'friends',
    name: "Friend's",
    blurb: 'The whole story, start to finish',
    color: '#ffb547',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  {
    id: 'unknown',
    name: 'Unknown',
    blurb: "Don't know me? Start here",
    color: '#46e3a8',
    order: ['about', 'skills', 'originals', 'journey', 'picks', 'moments', 'story'],
  },
  {
    id: 'creative',
    name: 'Creative',
    blurb: 'Open the Creative portfolio — a different world',
    color: '#b98bff',
    order: ['journey', 'picks', 'originals', 'moments', 'about', 'skills', 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'Profile', card: 'The Profile', meta: 'The Pilot · Bio & identity', palette: violet },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episodes`, palette: amber },
  originals: { nav: 'Projects', card: 'My Projects', meta: `${projects.length} Originals • DGC`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top Picks', meta: 'Top 10 from the profile', palette: jade },
  skills: { nav: 'Skills', card: 'My Skills', meta: `${skillCategories.length} Domains`, palette: ocean },
  moments: { nav: 'Badges', card: 'Badges & Certs', meta: `${achievements.length} Badges • ${certifications.length} Certifications`, palette: crimson },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download', palette: violet },
};