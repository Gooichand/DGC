/**
 * generate-dgc-brand.mjs
 * ---------------------
 * Regenerates owner-branded binary assets for the Creative 3D portfolio
 * in the site's own hand-drawn style. Text is rendered as vector outlines
 * from the project's own fonts (Rubik Scribble + Cabin Sketch) via
 * opentype.js, so no system font is required.
 *
 * Produces:
 *   - gallery cards      (4 projects x front + painted, 1024x2048 webp)
 *   - studio screens     (GitHub TV, Research monitor, Field Notes phone)
 *   - about certificates (4 cert cards + FEATURED)
 *   - entrance sign      (sign.webp, 1802x901)
 *   - favicon + OG image
 *
 * Run:  node scripts/generate-dgc-brand.mjs   (from the Creative folder)
 */
import sharp from 'sharp';
import opentype from 'opentype.js';
import fs from 'fs';
import path from 'path';

const PUBLIC = path.resolve('public');

/* ------------------------------------------------------------------ fonts */
const fontDir = path.join(PUBLIC, 'fonts');
const loadFont = (file) => {
    const buf = fs.readFileSync(path.join(fontDir, file));
    return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const FONTS = {
    rubik: loadFont('RubikScribble-Regular.ttf'),
    cabinBold: loadFont('CabinSketch-Bold.ttf'),
    cabin: loadFont('CabinSketch-Regular.ttf'),
};

/** Text as vector paths (direct glyph lookup — skips GSUB shaping).
 *  anchor: start | middle | end. */
function T(font, str, { x = 0, y = 0, size = 80, fill = '#000', anchor = 'middle' }) {
    const f = FONTS[font];
    const scale = size / f.unitsPerEm;
    const glyphs = [...str].map((ch) => f.charToGlyph(ch));
    const advances = glyphs.map((g) => ((g.advanceWidth != null ? g.advanceWidth : f.unitsPerEm * 0.5) * scale));
    const total = advances.reduce((a, b) => a + b, 0);
    let cx = anchor === 'middle' ? x - total / 2 : anchor === 'end' ? x - total : x;
    let out = '';
    glyphs.forEach((g, i) => {
        out += `<path d="${g.getPath(cx, y, size).toPathData(2)}" fill="${fill}"/>`;
        cx += advances[i];
    });
    return out;
}

const squiggle = (x1, y, x2, stroke = '#1a1a1a', sw = 5) =>
    `<path d="M ${x1},${y} Q ${x1 + (x2 - x1) / 4},${y - 12} ${x1 + (x2 - x1) / 2},${y} T ${x2},${y}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;

const star = (cx, cy, r, fill) => {
    let pts = '';
    for (let i = 0; i < 10; i++) {
        const ang = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.45;
        pts += `${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad} `;
    }
    return `<polygon points="${pts}" fill="${fill}"/>`;
};

const svgDoc = (w, h, body) =>
    `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const paper = (w, h, tint = '#FAF7F2') =>
    `<rect width="${w}" height="${h}" fill="${tint}"/>
     <rect x="28" y="28" width="${w - 56}" height="${h - 56}" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-dasharray="14 10" opacity="0.35"/>`;

async function toWebp(name, w, h, body) {
    const out = path.join(PUBLIC, name);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(Buffer.from(svgDoc(w, h, body))).webp({ quality: 90 }).toFile(out);
    console.log('  ok', name);
}

/* ======================================================== 1. GALLERY CARDS */
const GALLERY_PROJECTS = [
    { name: 'dgc_evid', title: 'EVID-DGC', sub: 'BLOCKCHAIN EVIDENCE', accent: '#ff3d5a', wash: '#fbeef0' },
    { name: 'dgc_look', title: 'LOOK-DGC', sub: 'IMAGE FORENSICS', accent: '#4cc9ff', wash: '#e9f6fc' },
    { name: 'dgc_certs', title: 'DGC CERTS', sub: 'VERIFIABLE CREDENTIALS', accent: '#b98bff', wash: '#f2ecfb' },
    { name: 'dgc_portfolio', title: 'PORTFOLIO', sub: 'THE ORIGIN SERIES', accent: '#ffb547', wash: '#fdf3e2' },
];

function galleryCard(proj, painted) {
    const w = 1024, h = 2048;
    const bg = painted ? proj.wash : '#FAF7F2';
    const ink = painted ? proj.accent : '#1a1a1a';
    return `
        ${paper(w, h, bg)}
        ${painted ? `<circle cx="512" cy="560" r="330" fill="${proj.accent}" opacity="0.12"/>
                     <circle cx="512" cy="1500" r="240" fill="${proj.accent}" opacity="0.08"/>` : ''}
        ${T('rubik', proj.title, { x: 512, y: 800, size: 175, fill: ink })}
        ${squiggle(330, 890, 694, ink, 7)}
        ${T('cabinBold', proj.sub, { x: 512, y: 1010, size: 64, fill: painted ? '#1a1a1a' : '#4a4a4a' })}
        ${T('cabin', 'A DGC ORIGINAL', { x: 512, y: 1770, size: 48, fill: '#8a857c' })}
        ${squiggle(340, 1830, 684, '#8a857c', 4)}`;
}

for (const p of GALLERY_PROJECTS) {
    await toWebp(`textures/gallery/${p.name}.webp`, 1024, 2048, galleryCard(p, false));
    await toWebp(`textures/gallery/${p.name}_painted.webp`, 1024, 2048, galleryCard(p, true));
}

/* ======================================================= 2. STUDIO SCREENS */
function ghScreen(repo, desc, stars, painted) {
    const w = 1474, h = 737;
    const bg = painted ? '#f6f8fa' : '#161b22';
    const fg = painted ? '#161b22' : '#e6edf3';
    const dim = painted ? '#57606a' : '#8b949e';
    const topBar = painted
        ? `<rect width="${w}" height="64" fill="#d0d7de"/>
           <circle cx="40" cy="32" r="12" fill="#57606a"/><circle cx="84" cy="32" r="12" fill="#57606a"/><circle cx="128" cy="32" r="12" fill="#57606a"/>`
        : `<rect width="${w}" height="64" fill="#010409"/>
           <circle cx="40" cy="32" r="12" fill="#ff5f56"/><circle cx="84" cy="32" r="12" fill="#ffbd2e"/><circle cx="128" cy="32" r="12" fill="#27c93f"/>`;
    return `
        <rect width="${w}" height="${h}" fill="${bg}"/>
        ${topBar}
        ${T('cabinBold', 'github.com/Gooichand', { x: 737, y: 118, size: 50, fill: fg })}
        <rect x="220" y="170" width="${w - 440}" height="450" rx="24" fill="${painted ? '#ffffff' : '#0d1117'}" stroke="${dim}" stroke-width="4"/>
        ${T('rubik', repo, { x: 300, y: 275, size: 90, fill: painted ? '#1f883d' : '#58a6ff', anchor: 'start' })}
        ${T('cabin', desc, { x: 300, y: 345, size: 48, fill: fg, anchor: 'start' })}
        ${squiggle(300, 385, 1000, dim, 4)}
        ${T('cabin', stars, { x: 300, y: 475, size: 44, fill: dim, anchor: 'start' })}
        ${T('cabin', 'JavaScript  /  0 forks  /  DGC', { x: 300, y: 545, size: 44, fill: dim, anchor: 'start' })}`;
}
await toWebp('textures/studio/tvfront_dgc.webp', 1474, 737, ghScreen('LOOK-DGC', 'Find hidden image edits and metadata trails', 'STARS 4 - image forensics', false));
await toWebp('textures/studio/tvfront_dgc_painted.webp', 1474, 737, ghScreen('EVID-DGC', 'Blockchain-backed evidence vault', 'Open source - DGC', true));

function monitorScreen(headline, painted) {
    const w = 1024, h = 512;
    const bg = painted ? '#fef4e2' : '#FAF7F2';
    const ink = painted ? '#b45309' : '#1a1a1a';
    return `
        ${paper(w, h, bg)}
        ${T('rubik', 'SECURITY RESEARCH', { x: 512, y: 160, size: 100, fill: ink })}
        ${squiggle(300, 205, 724, ink, 5)}
        ${T('cabinBold', headline, { x: 512, y: 300, size: 48, fill: painted ? '#7c4a03' : '#4a4a4a' })}`;
}
await toWebp('textures/studio/monitorfront_dgc.webp', 1024, 512, monitorScreen('threat analysis / digital evidence / incident response', false));
await toWebp('textures/studio/monitorfront_dgc_painted.webp', 1024, 512, monitorScreen('threat analysis / digital evidence / incident response', true));

function phoneScreen(painted) {
    const w = 1024, h = 2048;
    const bg = painted ? '#eaf6fc' : '#0f1b2d';
    const fg = painted ? '#0c4a6e' : '#e6f1fb';
    const dim = painted ? '#334155' : '#7d93ab';
    const shield = painted ? '#0ea5e9' : '#38bdf8';
    return `
        <rect width="${w}" height="${h}" fill="${bg}"/>
        <rect x="60" y="60" width="${w - 120}" height="${h - 120}" rx="48" fill="none" stroke="${fg}" stroke-width="6" opacity="0.4"/>
        ${T('rubik', 'FIELD NOTES', { x: 512, y: 300, size: 145, fill: fg })}
        ${T('cabinBold', 'cyber / forensic / osint', { x: 512, y: 470, size: 56, fill: shield })}
        ${squiggle(320, 560, 704, fg, 6)}
        ${T('cabin', 'Hash-check every artifact.', { x: 512, y: 760, size: 52, fill: dim })}
        ${T('cabin', 'Preserve the chain of custody.', { x: 512, y: 900, size: 52, fill: dim })}
        ${T('cabin', 'The timeline never lies.', { x: 512, y: 1040, size: 52, fill: dim })}
        ${T('cabin', 'Logs before conclusions.', { x: 512, y: 1180, size: 52, fill: dim })}
        ${T('cabin', 'Assume breach, verify trust.', { x: 512, y: 1320, size: 52, fill: dim })}
        ${T('cabinBold', 'DGC - THE SERIES', { x: 512, y: 1780, size: 54, fill: fg })}`;
}
await toWebp('textures/studio/phonefront_dgc.webp', 1024, 2048, phoneScreen(false));
await toWebp('textures/studio/phonefront_dgc_painted.webp', 1024, 2048, phoneScreen(true));

/* ================================================ 3. ABOUT CERTIFICATES */
const CERTS = [
    { name: 'dgccert1', title: 'ISC2 CC', sub: 'Certified in Cybersecurity', url: 'linkedin.com/in/dandimeni-gopichand' },
    { name: 'dgccert2', title: 'IBM', sub: 'Cybersecurity Fundamentals', url: 'linkedin.com/in/dandimeni-gopichand' },
    { name: 'dgccert3', title: 'ECWoC 2026', sub: 'Mentor and Contributor', url: 'github.com/Gooichand' },
    { name: 'dgccert4', title: 'GITHUB', sub: 'Pull Shark / Quickdraw', url: 'github.com/Gooichand' },
];
function cert(c, painted) {
    const w = 512, h = 512;
    const bg = painted ? '#f2ecfb' : '#FAF7F2';
    const ink = painted ? '#7c3aed' : '#1a1a1a';
    return `
        <rect width="${w}" height="${h}" fill="${bg}"/>
        <rect x="22" y="22" width="${w - 44}" height="${h - 44}" fill="none" stroke="${ink}" stroke-width="4" stroke-dasharray="10 8" opacity="0.4"/>
        ${T('rubik', c.title, { x: 256, y: 155, size: 64, fill: ink })}
        ${squiggle(130, 195, 382, ink, 4)}
        ${T('cabinBold', c.sub, { x: 256, y: 290, size: 38, fill: painted ? '#1a1a1a' : '#4a4a4a' })}
        ${T('cabin', c.url, { x: 256, y: 355, size: 25, fill: '#8a857c' })}
        ${star(226, 429, 13, '#8a857c')}
        ${T('cabin', 'DGC', { x: 285, y: 442, size: 30, fill: '#8a857c' })}`;
}
for (const c of CERTS) {
    await toWebp(`textures/about/${c.name}.webp`, 512, 512, cert(c, false));
    await toWebp(`textures/about/${c.name}_painted.webp`, 512, 512, cert(c, true));
}

await toWebp('textures/about/FEATURED.webp', 1024, 512, `
    ${paper(1024, 512)}
    ${T('rubik', 'FEATURED COLLECTION', { x: 512, y: 190, size: 105, fill: '#1a1a1a' })}
    ${squiggle(300, 240, 724, '#1a1a1a', 6)}
    ${T('cabinBold', 'research / mentorship / leadership / code', { x: 512, y: 340, size: 50, fill: '#ff3d5a' })}`);

/* ===================================================== 4. ENTRANCE SIGN */
await toWebp('textures/entrance/sign.webp', 1802, 901, `
    ${paper(1802, 901, '#FAF7F2')}
    ${T('rubik', 'GOPICHAND', { x: 901, y: 400, size: 320, fill: '#1a1a1a' })}
    ${squiggle(500, 490, 1302, '#1a1a1a', 8)}
    ${T('cabinBold', 'CYBER SECURITY & FORENSICS', { x: 901, y: 620, size: 86, fill: '#4a4a4a' })}
    ${T('cabin', 'the series - a DGC original', { x: 901, y: 745, size: 54, fill: '#8a857c' })}`);

/* ========================================================== 5. FAVICON */
{
    const svg = svgDoc(512, 512, `
        <rect width="512" height="512" rx="96" fill="#14161a"/>
        ${T('rubik', 'G', { x: 256, y: 400, size: 400, fill: '#FAF7F2' })}
        <circle cx="398" cy="120" r="34" fill="#ffb547"/>`);
    await sharp(Buffer.from(svg)).png().toFile(path.join(PUBLIC, 'favico.png'));
    console.log('  ok favico.png');
}

/* ========================================================= 6. OG IMAGE */
await toWebp('og-image.webp', 1200, 630, `
    <defs><linearGradient id="ogbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c1e24"/><stop offset="1" stop-color="#0b0c10"/>
    </linearGradient></defs>
    <rect width="1200" height="630" fill="url(#ogbg)"/>
    <circle cx="1050" cy="90" r="150" fill="#ffb547" opacity="0.14"/>
    <circle cx="150" cy="560" r="200" fill="#ff3d5a" opacity="0.08"/>
    ${T('rubik', 'GOPICHAND', { x: 600, y: 270, size: 210, fill: '#FAF7F2' })}
    ${T('cabinBold', '- THE SERIES -', { x: 600, y: 365, size: 90, fill: '#ffb547' })}
    ${T('cabin', 'CYBERSECURITY  /  DIGITAL FORENSICS  /  WEB', { x: 600, y: 470, size: 56, fill: '#9aa0ab' })}
    ${squiggle(360, 530, 840, '#ffb547', 6)}`);

/* ============================================ 7. AWARDS CARD BANNERS */
function awardBanner(painted, label = 'THE SERIES') {
    const w = 2048, h = 1024;
    const bg = painted ? '#fdf3e2' : '#FAF7F2';
    const ink = painted ? '#b45309' : '#1a1a1a';
    return `
        ${paper(w, h, bg)}
        ${painted ? `<circle cx="1600" cy="260" r="260" fill="#ffb547" opacity="0.14"/>
                     <circle cx="400" cy="820" r="220" fill="#ff3d5a" opacity="0.08"/>` : ''}
        ${T('rubik', 'DGC', { x: 1024, y: 520, size: 330, fill: ink })}
        ${squiggle(700, 610, 1348, ink, 8)}
        ${T('cabinBold', label, { x: 1024, y: 760, size: 88, fill: painted ? '#7c4a03' : '#4a4a4a' })
        }
        ${T('cabin', 'cyber security / digital forensics', { x: 1024, y: 880, size: 52, fill: '#8a857c' })}`;
}
const AWARD_LABELS = { SOTD: 'CERTIFIED', SOTM: 'COMMUNITY', SOTY: 'MILESTONES' };
for (const name of ['SOTD', 'SOTM', 'SOTY']) {
    await toWebp(`textures/about/${name}.webp`, 2048, 1024, awardBanner(false, AWARD_LABELS[name]));
    await toWebp(`textures/about/${name}_painted.webp`, 2048, 1024, awardBanner(true, AWARD_LABELS[name]));
}

console.log('\nDone - branded assets written to public/.');
