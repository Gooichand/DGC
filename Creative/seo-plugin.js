import { createClient } from '@sanity/client';

// Sanity CMS is disabled for this portfolio (no project configured).
// When disabled, the plugin skips all fetches and leaves the rebranded static
// index.html untouched, while emitting a minimal fallback llms.txt.
// Set this to a real Sanity project ID to enable the CMS-driven SEO pipeline.
const SANITY_PROJECT_ID = 'placeholder';
export const isSanityConfigured = SANITY_PROJECT_ID !== 'placeholder';

const sanityClient = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-03-01',
});

// UPDATE DOMAIN: real deploy origin (see index.html).
const SITE_URL = 'https://gooichand.github.io/Creative';

// Tech stack filename -> human-readable name mapping for JSON-LD
const TECH_STACK_NAMES = {
    'reactlogo.webp': 'React',
    'htmllogo.webp': 'HTML',
    'csslogo.webp': 'CSS',
    'jslogo.webp': 'JavaScript',
    'tailwindlogo.webp': 'Tailwind CSS',
    'firebaselogo.webp': 'Firebase',
    'netlifylogo.webp': 'Netlify',
    'wordpresslogo.webp': 'WordPress',
    'elementorlogo.webp': 'Elementor',
    'phplogo.webp': 'PHP',
};

/**
 * Helper to ensure dates are in ISO-8601 format with timezone for SEO.
 */
function formatIsoDate(dateString) {
    if (!dateString) return undefined;
    if (dateString.includes('T')) return dateString; // Already has time/timezone
    return `${dateString}T12:00:00Z`; // Default to noon UTC
}

/**
 * Build dynamic JSON-LD structured data from Sanity content.
 * This generates schema.org entities that AI search engines (Google AI Overviews,
 * Perplexity, Gemini) use to understand and cite content in their answers.
 */
function buildJsonLd(globalInfo, projects, studio, awards, faqList) {
    const graph = [];

    // --- 1. Person: Central node of the Knowledge Graph ---
    const person = {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Gopichand Dandimeni',
        alternateName: ['DGC', 'Gopi Dandimeni', 'Gooichand'],
        url: SITE_URL,
        jobTitle: 'Cyber Security & Digital Forensics Specialist',
        description: globalInfo?.aboutMe || 'Cyber security and digital forensics specialist who builds immersive 3D web experiences.',
        knowsAbout: ['Cyber Security', 'Digital Forensics', 'Incident Response', 'OSINT', 'Blockchain Evidence', 'Image Forensics', 'React', 'Three.js', 'JavaScript', 'TypeScript', 'GSAP', 'WebGL', 'Web Development'],
        sameAs: [
            globalInfo?.linkedinUrl || 'https://www.linkedin.com/in/dandimeni-gopichand',
            globalInfo?.githubUrl || 'https://github.com/Gooichand',
        ].filter(Boolean)
    };
    graph.push(person);

    // --- 2. WebSite ---
    const website = {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: globalInfo?.siteTitle || 'Gopichand Dandimeni | Creative 3D Portfolio',
        description: globalInfo?.siteDescription || 'Interactive 3D portfolio by Gopichand Dandimeni — cyber security, digital forensics and creative web development.',
        publisher: { '@id': `${SITE_URL}/#person` }
    };
    graph.push(website);

    // --- 3. ProfilePage ---
    const profilePage = {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        mainEntity: { '@id': `${SITE_URL}/#person` },
        about: { '@id': `${SITE_URL}/#person` }
    };
    graph.push(profilePage);

    // --- 4. FAQPage (GEO & AI search engine optimizer) ---
    if (faqList && faqList.length > 0) {
        const faqPage = {
            '@type': 'FAQPage',
            '@id': `${SITE_URL}/#faq`,
            mainEntity: faqList.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        };
        graph.push(faqPage);
    }

    // --- 5. ItemList: Portfolio Projects (Google rich results for lists) ---
    if (projects && projects.length > 0) {
        graph.push({
            '@type': 'ItemList',
            '@id': 'https://gooichand.github.io/Creative/#projectslist',
            name: 'Portfolio Projects by Gopichand Dandimeni',
            description: 'Selected cyber security, digital forensics and web development projects showcasing React, Three.js and secure engineering.',
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: p.seoTitle || p.title,
                    description: p.seoDescription || p.description || '',
                    url: p.url || undefined,
                    creator: { '@id': 'https://gooichand.github.io/Creative/#person' },
                    ...(p.techStack && p.techStack.length > 0 ? {
                        keywords: p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')
                    } : {}),
                }
            }))
        });

        // Individual CreativeWork entries for each project (richer detail)
        projects.forEach(p => {
            const projectSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            graph.push({
                '@type': 'CreativeWork',
                '@id': `https://gooichand.github.io/Creative/#project-${projectSlug}`,
                name: p.seoTitle || p.title,
                description: p.seoDescription || p.description || '',
                url: p.url || undefined,
                creator: { '@id': 'https://gooichand.github.io/Creative/#person' },
                ...(p.techStack && p.techStack.length > 0 ? {
                    keywords: p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')
                } : {}),
            });
        });
    }

    // --- 6. Studio Content (YouTube -> VideoObject, Blog -> Article, TikTok -> VideoObject) ---
    if (studio && studio.length > 0) {
        studio.forEach((s, idx) => {
            const studioSlug = `studio-item-${idx}`;
            if (s.platform === 'github') {
                graph.push({
                    '@type': 'SoftwareSourceCode',
                    '@id': `${SITE_URL}/#${studioSlug}`,
                    name: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    codeRepository: s.url || undefined,
                    thumbnailUrl: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    author: { '@id': `${SITE_URL}/#person` },
                });
            } else if (s.platform === 'blog') {
                graph.push({
                    '@type': 'Article',
                    '@id': `${SITE_URL}/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    ...(s.readTime ? { timeRequired: `PT${s.readTime.replace(' min', '')}M` } : {}),
                    author: { '@id': `${SITE_URL}/#person` },
                });
            } else if (s.platform === 'notes') {
                graph.push({
                    '@type': 'Article',
                    '@id': `${SITE_URL}/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    ...(s.views ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: s.views } } : {}),
                    author: { '@id': `${SITE_URL}/#person` },
                });
            } else if (s.platform === 'instagram' || s.platform === 'x' || s.platform === 'linkedin') {
                graph.push({
                    '@type': 'SocialMediaPosting',
                    '@id': `https://gooichand.github.io/Creative/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || 'https://gooichand.github.io/Creative/og-image.webp',
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    ...(s.likes ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: s.likes } } : {}),
                    author: { '@id': 'https://gooichand.github.io/Creative/#person' },
                });
            } else if (s.platform === 'codrops') {
                graph.push({
                    '@type': 'Article',
                    '@id': `https://gooichand.github.io/Creative/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || 'https://gooichand.github.io/Creative/og-image.webp',
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    author: { '@id': 'https://gooichand.github.io/Creative/#person' },
                });
            }
        });
    }

    // --- 7. Awards as schema.org Award/CreativeWork ---
    if (awards && awards.length > 0) {
        const categoryLabels = { sotd: 'Certification', sotm: 'Community', other: 'Milestone' };
        graph.push({
            '@type': 'ItemList',
            '@id': `${SITE_URL}/#awardslist`,
            name: 'Certifications & Achievements of Gopichand Dandimeni',
            numberOfItems: awards.length,
            itemListElement: awards.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: `${categoryLabels[a.category] || a.category} — ${a.seoTitle || a.title}`,
                    ...(a.date ? { dateCreated: formatIsoDate(a.date) } : {}),
                    url: a.url || undefined,
                    description: a.seoDescription || undefined,
                    award: categoryLabels[a.category] || a.category,
                    creator: { '@id': 'https://gooichand.github.io/Creative/#person' },
                }
            }))
        });
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph
    };
}

// Helper to generate the llms.txt content in clean Markdown
function buildLlmsTxt(globalInfo, projects, studio, awards, faqList) {
    const siteTitle = globalInfo?.siteTitle || 'Gopichand Dandimeni | Creative 3D Portfolio';
    const siteDescription = globalInfo?.siteDescription || 'Cyber security & digital forensics specialist building interactive 3D web experiences.';
    const aboutMe = globalInfo?.aboutMe || 'I am a cyber security and digital forensics specialist who builds immersive 3D web experiences.';

    let content = `# ${siteTitle}\n`;
    content += `> ${siteDescription}\n\n`;

    content += `## Biography / About Me\n`;
    content += `${aboutMe}\n\n`;

    content += `## Core Technologies & Skills\n`;
    content += `- Cybersecurity, digital forensics, incident response, OSINT, blockchain evidence, image forensics.\n`;
    content += `- React, Three.js, React Three Fiber (R3F), GSAP (GreenSock), JavaScript, TypeScript, WebGL, Web Development.\n\n`;

    if (projects && projects.length > 0) {
        content += `## Selected Portfolio Projects\n`;
        projects.forEach(p => {
            const tech = p.techStack ? ` (Tech: ${p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')})` : '';
            content += `- [${p.seoTitle || p.title}](${p.url || 'https://gooichand.github.io/Creative'}): ${p.seoDescription || p.description || ''}${tech}\n`;
        });
        content += `\n`;
    }

    if (studio && studio.length > 0) {
        content += `## Studio Content & Publications\n`;
        studio.forEach(s => {
            content += `- [${s.seoTitle || s.title} (${s.platform})](${s.url || 'https://gooichand.github.io/Creative'}): ${s.seoDescription || s.description || ''}\n`;
        });
        content += `\n`;
    }

    if (awards && awards.length > 0) {
        content += `## Certifications & Achievements\n`;
        const categoryLabels = { sotd: 'Certification', sotm: 'Community', other: 'Milestone' };
        awards.forEach(a => {
            const category = categoryLabels[a.category] || a.category;
            content += `- **${category}** — [${a.seoTitle || a.title}](${a.url || SITE_URL}): Awarded on ${a.date || 'unknown'}. ${a.seoDescription || ''}\n`;
        });
        content += `\n`;
    }

    if (faqList && faqList.length > 0) {
        content += `## Frequently Asked Questions (FAQ)\n`;
        faqList.forEach(item => {
            content += `- **${item.question}**\n`;
            content += `  ${item.answer.replace(/\n/g, '\n  ')}\n`;
        });
    }

    return content;
}

export function generateSeoHtml() {
    let cachedLlmsContent = '';

    async function getLlmsContent() {
        if (!cachedLlmsContent) {
            if (!isSanityConfigured) {
                cachedLlmsContent = `# Gopichand Dandimeni\n> Cyber Security & Digital Forensics Specialist | Creative 3D Portfolio\n\nSanity CMS is disabled; this portfolio serves curated local content.\n`;
                return cachedLlmsContent;
            }
            try {
                const [globalInfo, projects, studio, awards, faqList] = await Promise.all([
                    sanityClient.fetch(`*[_id == "globalInfo"][0]`),
                    sanityClient.fetch(`*[_type == "galleryProject"]`),
                    sanityClient.fetch(`*[_type == "studioItem"]`),
                    sanityClient.fetch(`*[_type == "awardCertificate"]`),
                    sanityClient.fetch(`*[_type == "faq"]`)
                ]);
                cachedLlmsContent = buildLlmsTxt(globalInfo, projects, studio, awards, faqList);
            } catch (e) {
                console.error('SEO Plugin Error: Failed to fetch Sanity data for llms.txt', e);
                cachedLlmsContent = `# Gopichand Dandimeni\n> Cyber Security & Digital Forensics Specialist | Creative 3D Portfolio\n`;
            }
        }
        return cachedLlmsContent;
    }

    return {
        name: 'sanity-seo-plugin',

        // Serve llms.txt in local development mode
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url === '/llms.txt') {
                    const content = await getLlmsContent();
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    res.end(content);
                } else {
                    next();
                }
            });
        },

        // This hook runs when Vite generates or serves index.html
        async transformIndexHtml(html) {
            // Sanity disabled — keep the static, already-rebranded HTML as-is.
            if (!isSanityConfigured) {
                return html;
            }
            try {
                // Fetch all data in parallel
                const [globalInfo, projects, studio, awards, faqList] = await Promise.all([
                    sanityClient.fetch(`*[_id == "globalInfo"][0]`),
                    sanityClient.fetch(`*[_type == "galleryProject"]`),
                    sanityClient.fetch(`*[_type == "studioItem"] { ..., "thumbnailUrl": frontTexture.asset->url }`),
                    sanityClient.fetch(`*[_type == "awardCertificate"]`),
                    sanityClient.fetch(`*[_type == "faq"]`)
                ]);

                // Fallback values if globalInfo is not yet created in Sanity
                const siteTitle = globalInfo?.siteTitle || 'Gopichand Dandimeni | Creative 3D Portfolio';
                const siteDescription = globalInfo?.siteDescription || 'Interactive 3D portfolio by Gopichand Dandimeni — cyber security, digital forensics and creative web development.';
                const aboutMe = globalInfo?.aboutMe || 'I am a cyber security and digital forensics specialist who builds immersive 3D web experiences.';

                // Cache llms.txt content for later bundle emission
                cachedLlmsContent = buildLlmsTxt(globalInfo, projects, studio, awards, faqList);

                // ====== PART 1: Build the semantic HTML string ======
                let seoHtml = `\n<div id="seo-content" class="sr-only-seo">\n`;
                
                seoHtml += `  <header>\n`;
                seoHtml += `    <h1>${siteTitle}</h1>\n`;
                seoHtml += `    <p>${siteDescription}</p>\n`;
                seoHtml += `  </header>\n`;

                seoHtml += `  <section id="about">\n`;
                seoHtml += `    <h2>About Me</h2>\n`;
                seoHtml += `    <p>${aboutMe}</p>\n`;
                if (globalInfo?.githubUrl) seoHtml += `    <a href="${globalInfo.githubUrl}">GitHub</a>\n`;
                if (globalInfo?.linkedinUrl) seoHtml += `    <a href="${globalInfo.linkedinUrl}">LinkedIn</a>\n`;
                seoHtml += `  </section>\n`;

                if (projects && projects.length > 0) {
                    seoHtml += `  <section id="projects">\n    <h2>Projects</h2>\n    <ul>\n`;
                    projects.forEach(p => {
                        seoHtml += `      <li>\n        <h3>${p.seoTitle || p.title}</h3>\n        <p>${p.seoDescription || p.description || ''}</p>\n        ${p.url ? `<a href="${p.url}">Visit ${p.seoTitle || p.title}</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                if (studio && studio.length > 0) {
                    seoHtml += `  <section id="studio">\n    <h2>The Studio (Content)</h2>\n    <ul>\n`;
                    studio.forEach(s => {
                        seoHtml += `      <li>\n        <h3>${s.seoTitle || s.title} (${s.platform})</h3>\n        <p>${s.seoDescription || s.description || ''}</p>\n        ${s.url ? `<a href="${s.url}">View Content</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                if (awards && awards.length > 0) {
                    seoHtml += `  <section id="awards">\n    <h2>Awards & Certificates</h2>\n    <ul>\n`;
                    awards.forEach(a => {
                        seoHtml += `      <li>\n        <h3>${a.seoTitle || a.title}</h3>\n        <p>${a.category} - ${a.date}</p>\n        <p>${a.seoDescription || ''}</p>\n        ${a.url ? `<a href="${a.url}">Link</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                // FAQ Section (GEO/AI search optimizer fallback)
                if (faqList && faqList.length > 0) {
                    seoHtml += `  <section id="faq">\n`;
                    seoHtml += `    <h2>Frequently Asked Questions (FAQ)</h2>\n`;
                    faqList.forEach(item => {
                        seoHtml += `    <article>\n`;
                        seoHtml += `      <h3>${item.question}</h3>\n`;
                        seoHtml += `      <p>${item.answer}</p>\n`;
                        seoHtml += `    </article>\n`;
                    });
                    seoHtml += `  </section>\n`;
                }

                seoHtml += `</div>\n`;

                // ====== PART 2: Build dynamic JSON-LD ======
                const jsonLdSchemas = buildJsonLd(globalInfo, projects, studio, awards, faqList);
                const jsonLdScript = `\n  <!-- Dynamic Structured Data (JSON-LD) — generated from Sanity at build time -->\n  <script type="application/ld+json">\n${JSON.stringify(jsonLdSchemas, null, 2)}\n  </script>\n`;

                // ====== PART 3: Transform HTML ======
                // Update the <title> tag
                let transformedHtml = html.replace(
                    /<title>(.*?)<\/title>/,
                    `<title>${siteTitle}</title>`
                );
                
                // Add or replace meta description
                if (transformedHtml.includes('<meta name="description"')) {
                    transformedHtml = transformedHtml.replace(
                        /<meta name="description" content="(.*?)"\s*\/?>/,
                        `<meta name="description" content="${siteDescription}" />`
                    );
                } else {
                    transformedHtml = transformedHtml.replace(
                        '</head>',
                        `  <meta name="description" content="${siteDescription}" />\n</head>`
                    );
                }

                // Update Open Graph dynamic metadata
                transformedHtml = transformedHtml
                    .replace(
                        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
                        `<meta property="og:title" content="${siteTitle}" />`
                    )
                    .replace(
                        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
                        `<meta property="og:description" content="${siteDescription}" />`
                    );

                // Update Twitter card dynamic metadata
                transformedHtml = transformedHtml
                    .replace(
                        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
                        `<meta name="twitter:title" content="${siteTitle}" />`
                    )
                    .replace(
                        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
                        `<meta name="twitter:description" content="${siteDescription}" />`
                    );

                // Inject dynamic JSON-LD right before </head> (next to the existing static one)
                transformedHtml = transformedHtml.replace('</head>', `${jsonLdScript}</head>`);

                // Replace the static placeholder with the dynamic one to prevent duplicate #seo-content and double h1s
                if (transformedHtml.includes('id="seo-content"')) {
                    transformedHtml = transformedHtml.replace(
                        /<div id="seo-content" class="sr-only-seo">[\s\S]*?<\/div>/,
                        seoHtml
                    );
                } else {
                    // Fallback injection if the template doesn't contain the static block
                    transformedHtml = transformedHtml.replace('</body>', `${seoHtml}</body>`);
                }

                return transformedHtml;
            } catch (error) {
                console.error('SEO Plugin Error: Failed to fetch Sanity data', error);
                // Return original HTML on failure so we don't break the build
                return html;
            }
        },

        // Emit llms.txt to the build output directory
        async generateBundle() {
            const content = await getLlmsContent();
            this.emitFile({
                type: 'asset',
                fileName: 'llms.txt',
                source: content
            });
        }
    };
}
