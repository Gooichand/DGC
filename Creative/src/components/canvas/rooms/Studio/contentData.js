/**
 * Studio Content Data
 * 
 * This file contains all content items for the Studio monitor tower.
 * Each item will be displayed on a monitor in the tower.
 * 
 * Platforms: 'github', 'blog', 'notes'
 */

export const PLATFORM_CONFIG = {
    github: {
        color: '#161b22',
        accentColor: '#58a6ff',
        icon: '🐙',
        label: 'GitHub',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#0d5a40',
        accentColor: '#0a3d2c',
        icon: '📝',
        label: 'Research',
        shape: 'monitor', // Thin desktop monitor
    },
    notes: {
        color: '#0f4c6e',
        accentColor: '#0a3450',
        icon: '🛡️',
        label: 'Field Notes',
        shape: 'phone', // Vertical phone
    },
};

// Sample content data - replace with real content later
const RAW_CONTENT_DATA = [
    // ============ GitHub Repositories ============
    {
        id: 'gh-001',
        platform: 'github',
        title: 'LOOK-DGC — Image Forensics',
        description: 'Digital image forensics toolkit with 50+ analysis tools — ghost detection, copy-move forgery, AI verification and PDF evidence reports.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/LOOK-DGC',
        date: '2026-04-12',
        views: '4 ★',
    },
    {
        id: 'gh-002',
        platform: 'github',
        title: 'EVID-DGC — Blockchain Evidence',
        description: 'Evidence vault with 8-role RBAC, Polygon anchoring, IPFS storage and immutable chain-of-custody records ready for the courtroom.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/blockchain-evidence',
        date: '2026-03-08',
        views: '6 ★',
    },
    {
        id: 'gh-003',
        platform: 'github',
        title: 'evid-dgc-certificates',
        description: 'On-chain verifiable credentials for every DGC certification — tamper-proof proof of every badge and certificate earned.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/evid-dgc-certificates',
        date: '2026-02-21',
        views: '3 ★',
    },
    {
        id: 'gh-004',
        platform: 'github',
        title: 'OpenSource-Compass',
        description: 'A compass for first-time contributors — curated good-first-issues and maintainer guidance for open source newcomers.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/sayeeg-11/OpenSource-Compass',
        date: '2025-11-19',
        views: '12 ★',
    },
    {
        id: 'gh-005',
        platform: 'github',
        title: 'AgriPredict',
        description: 'ML-driven crop yield forecasting to help farmers plan ahead with weather and soil data.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/AgriPredict',
        date: '2025-08-14',
        views: '5 ★',
    },
    {
        id: 'gh-006',
        platform: 'github',
        title: 'SECURITY-PASS-DGC',
        description: 'Password strength analyzer with breach checks — because your passphrase is your first firewall.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/SECURITY-PASS-DGC',
        date: '2025-06-30',
        views: '7 ★',
    },
    {
        id: 'gh-007',
        platform: 'github',
        title: 'AI-Learning-Coach',
        description: 'IBM challenge project — a personal AI tutor that adapts study plans to the learner.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/AI-Learning-Coach-ibm',
        date: '2025-05-22',
        views: '4 ★',
    },
    {
        id: 'gh-008',
        platform: 'github',
        title: "Simpson's Rule Calculator",
        description: 'Numerical integration calculator — math turned into code for fast, accurate approximations.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/Simpson-s-Rule-Calculator',
        date: '2024-11-09',
        views: '9 ★',
    },

    // ============ Research & Blog ============
    {
        id: 'blog-001',
        platform: 'blog',
        title: 'Published Research — IISDGP',
        description: 'SDG policy research paper published in the IISDGP journal — my first academic milestone in the series.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://www.linkedin.com/in/dandimeni-gopichand',
        date: '2024-11-15',
        readTime: '4 min',
    },
    {
        id: 'blog-002',
        platform: 'blog',
        title: 'How EVID-DGC keeps evidence honest',
        description: 'Designing immutable chain-of-custody records on the Polygon blockchain — hashes, anchoring, verification.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/blockchain-evidence',
        date: '2026-03-10',
        readTime: '5 min',
    },
    {
        id: 'blog-003',
        platform: 'blog',
        title: 'LOOK-DGC: reading images like a forensic analyst',
        description: 'JPEG ghosts, copy-move forgeries and AI verification — how the image speaks when you know where to look.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand/LOOK-DGC',
        date: '2026-04-14',
        readTime: '7 min',
    },
    {
        id: 'blog-004',
        platform: 'blog',
        title: 'My APCSIP-2026 experience',
        description: 'Two weeks of cyber-security challenge prep — forensics, ethics and the fights worth picking.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://www.linkedin.com/in/dandimeni-gopichand',
        date: '2025-12-02',
        readTime: '6 min',
    },
    {
        id: 'blog-005',
        platform: 'blog',
        title: 'Mentoring in GSSoC 2025',
        description: 'Helping first-time contributors find their first pull request — and the lessons I learned back.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand',
        date: '2025-10-18',
        readTime: '5 min',
    },
    {
        id: 'blog-006',
        platform: 'blog',
        title: 'The forensic mindset in web security',
        description: 'Same discipline, different battlefield — hashes, logs, verification and documented assumptions.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://www.linkedin.com/in/dandimeni-gopichand',
        date: '2025-08-27',
        readTime: '8 min',
    },

    // ============ Field Notes ============
    {
        id: 'notes-001',
        platform: 'notes',
        title: 'Hash every artifact.',
        description: 'Everything you touch in an investigation gets a hash before anything else happens.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand',
        date: '2026-05-02',
        views: '1.2K',
        likes: '180',
    },
    {
        id: 'notes-002',
        platform: 'notes',
        title: 'Preserve the chain of custody.',
        description: 'Document every copy, every move, every access — or lose the case in court.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://www.linkedin.com/in/dandimeni-gopichand',
        date: '2026-04-19',
        views: '980',
        likes: '141',
    },
    {
        id: 'notes-003',
        platform: 'notes',
        title: 'The timeline never lies.',
        description: 'Artifact times tell the story — learn to read them before you read anything else.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://www.linkedin.com/in/dandimeni-gopichand',
        date: '2026-04-03',
        views: '1.5K',
        likes: '220',
    },
    {
        id: 'notes-004',
        platform: 'notes',
        title: 'OSINT in 60 seconds.',
        description: 'Open-source intelligence quick hits — the free data trail everyone leaves behind.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand',
        date: '2026-03-21',
        views: '2.1K',
        likes: '310',
    },
    {
        id: 'notes-005',
        platform: 'notes',
        title: 'Assume breach, verify trust.',
        description: 'Zero-trust thinking for investigators and builders alike.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://www.linkedin.com/in/dandimeni-gopichand',
        date: '2026-02-14',
        views: '1.8K',
        likes: '260',
    },
    {
        id: 'notes-006',
        platform: 'notes',
        title: 'Logs before conclusions.',
        description: 'Never form a verdict before the logs speak.',
        frontTexture: null,
        thumbnail: null,
        url: 'https://github.com/Gooichand',
        date: '2025-12-10',
        views: '1.4K',
        likes: '190',
    },
];

const ghTextures = ['/textures/studio/tvfront_dgc.webp'];
const ghPaintedTextures = ['/textures/studio/tvfront_dgc_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_dgc.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_dgc_painted.webp'];
const notesTextures = ['/textures/studio/phonefront_dgc.webp'];
const notesPaintedTextures = ['/textures/studio/phonefront_dgc_painted.webp'];

let ghIdx = 0, blogIdx = 0, notesIdx = 0;
let ghPIdx = 0, blogPIdx = 0, notesPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'github' ? ghTextures[ghIdx++ % ghTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    notesTextures[notesIdx++ % notesTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'github' ? ghPaintedTextures[ghPIdx++ % ghPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    notesPaintedTextures[notesPIdx++ % notesPaintedTextures.length]
        )
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};