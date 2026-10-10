/**
 * Unknown portfolio — backend API base.
 *
 * The chat widget / admin endpoints are served by the Vercel serverless
 * functions in the project-root `api/` folder. They deploy together with the
 * static site as one Vercel project, so same-origin is correct:
 *
 *   '' (default)  → same origin. Used when the whole project (main site,
 *                   /Creative/, /Unknown/ and /api functions) is deployed as a
 *                   single Vercel project.
 *
 *   a URL         → only needed if this static copy is hosted somewhere that
 *                   cannot serve the /api functions (e.g. GitHub Pages), in
 *                   which case point it at the Vercel deployment:
 *                     window.UNKNOWN_API_BASE = 'https://your-project.vercel.app';
 *
 * Loaded before src/components/PortfolioAssistant/chat-widget.js.
 */
window.UNKNOWN_API_BASE = window.UNKNOWN_API_BASE || '';
