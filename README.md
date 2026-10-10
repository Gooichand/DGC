# GOPICHAND — THE SERIES

A cinematic, streaming-inspired portfolio for **Gopichand Dandimeni**: Cybersecurity & Digital Forensics student.
Every section is an episode, every project is an Original, and the whole site plays like a series.

> A personal portfolio with a fictional streaming-platform look. It is not affiliated with Netflix or any other streaming service and uses none of their logos.

## Run it locally

Requires **Node.js 20.19+** (the Creative build uses Vite 7).

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Production build (main site only):

```bash
npm run build
npm run preview
```

The static site is written to `dist/`. The full portfolio (main site + `/Creative/` + `/Unknown/` + the `/api` backend) ships together — see [Deploying to Vercel](#deploying-to-vercel-one-repo-one-link).

### The Creative portfolio (`/Creative/`)

Selecting the **Creative** profile opens a separate 3D portfolio that lives in [`Creative/`](Creative/) and is served as a folder on the same host (e.g. `https://gooichand.github.io/Creative/`). The main app links to it with an absolute `/Creative/` path.

- **Local dev:** run the Creative dev server alongside this one — `npm --prefix Creative run dev` (it serves `http://localhost:5173/Creative/`). The main dev server automatically proxies `/Creative` to it, so clicking the card just works. Override the target with `CREATIVE_DEV_URL` in `.env.local`.
- **Deploy:** `npm run build:all` builds both apps and nests the Creative build under `dist/Creative/`, so the whole site ships as a single folder.

### The Unknown portfolio (`/Unknown/`)

Selecting the **Unknown** profile opens another standalone portfolio that lives in [`Unknown/`](Unknown/) and is served as a folder on the same host (e.g. `https://gooichand.github.io/Unknown/`). The main app links to it with an absolute `/Unknown/` path.

Unlike Creative, Unknown is a plain HTML/CSS/JS site (no build step). Its chat/widget backend lives in the project-root [`api/`](api/) folder as Vercel serverless functions and ships with the same deployment.

- **Local dev:** run the static server alongside this one — `npm run dev:unknown` (serves `http://localhost:5175`). The main dev server proxies `/Unknown` to it, so clicking the card just works. Override the target with `UNKNOWN_DEV_URL` in `.env.local`.
- **Backend:** [`api/`](api/) holds the chat and admin functions. On Vercel they are served from the same origin (`/api/*`), so [`Unknown/api-config.js`](Unknown/api-config.js) stays empty (`''`). To run them locally with `vercel dev`, or proxy them elsewhere, set `UNKNOWN_API_URL` in `.env.local`.
- **Deploy:** `npm run build:all` copies the static site to `dist/Unknown/` (excluding `node_modules`, `.git`, `.opencode`, `.vscode`).

```bash
npm run build:all   # main site → dist/  ·  Creative → dist/Creative/  ·  Unknown → dist/Unknown/
npm run preview     # serves all three at /, /Creative/ and /Unknown/
```

### Deploying to Vercel (one repo, one link)

The whole portfolio — the main site, `/Creative/`, `/Unknown/` **and** the `/api` backend — deploys as a **single Vercel project** from this one repository.

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo. Keep **Root Directory** set to the repository root (there are nested `package.json` files under `Creative/` and `Unknown/`, but everything builds from the top level). [`vercel.json`](vercel.json) already sets the build command (`npm run build:all`), the install command (root **and** `Creative/` dependencies), the output directory (`dist`) and the API functions, so no other dashboard configuration is required.
3. Under **Settings → Environment Variables**, add the ones used by `api/`:

   | Variable | Used by | Notes |
   | --- | --- | --- |
   | `GEMINI_API_KEY` | `api/chat.js` | Google AI Studio key for the assistant |
   | `ADMIN_PASSWORD` | `api/admin/verify.js`, `api/admin/update.js` | Unlocks the chat knowledge editor |
   | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | `api/chat.js`, `api/admin/update.js`, `api/visitor-alert.js` | From a Vercel KV / Upstash Redis store (**Storage → KV**) |
   | `RESEND_API_KEY` | `api/visitor-alert.js` | Optional; only for the visitor-alert endpoint |

4. Deploy. The one production URL serves the main site at `/`, the Creative portfolio at `/Creative/`, the Unknown portfolio at `/Unknown/`, and the backend at `/api/*`.

## Updating the content

**All content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).** It was generated from the resume, and every component reads from it.

| To change… | Edit |
| --- | --- |
| Name, intro, email, LinkedIn, GitHub | `profile` |
| A project, or a new one | `projects` (add an object; it appears in Originals, the overlay, the resume sheet and the counts) |
| Achievements / certifications | `achievements`, `certifications` |
| Skills and their "where it's used" notes | `skillCategories`, `skillEvidence` |
| Seasons and episodes (My Journey) | `seasons` |
| Top 10 row | `topPicks` |
| ▶ Play Intro highlight reel | `introSlides` |
| Profile order (Recruiter / Friends / Unknown / Creative) | `viewerProfiles` |
| Opening studio card text | `profile.originalLabel` |

**Resume:** the site reads `public/assets/Gopichand _Resume.pdf` (replace it with the latest version, keeping that name — or update `profile.resumePdf` in `src/data/portfolio.ts`).

**Photo:** replace `pic1.jpeg` (high-res photo) and `pic.png` (background-removed cutout with the same framing), then run:

```bash
npm run images
```

This rebuilds the responsive WebP portraits and the social share image in `public/assets/`.

## What's inside

```
src/
  data/portfolio.ts        ← single source of truth (from the resume)
  App.tsx                  ← stages: opening → profile select → home; overlays
  components/
    OpeningSequence        ← black → studio card → GOPICHAND → THE SERIES → portrait → ▶ PLAY
    ProfileSelector        ← "Who's watching?" (4 profiles: Recruiter, Friends, Unknown, Creative)
    UnknownLayout          ← distinct "dossier/terminal" layout for the Unknown profile
    Navbar                 ← hide-on-scroll nav, profile switcher, mobile menu
    Hero                   ← billboard: parallax portrait, particles, light streaks, floating chips
    PlayIntro              ← ▶ Play Intro: zoom into portrait → highlight reel (pause, ← →, tap zones)
    ContinueWatching       ← cards with real "watched" progress bars
    About                  ← The Pilot
    Seasons / EpisodeCard  ← My Journey as seasons and episodes
    Originals / ProjectCard← pinned horizontal sequence on desktop, swipe rail on touch
    ProjectModal           ← full-screen project overlay with a shared-element transition
    TopPicks               ← Top 10-style row
    Skills                 ← skill genres; each card shows where the skill appears
    Achievements           ← award-poster cards + certification rail (links to credentials)
    ResumeViewer/ResumeModal ← designed resume sheet, PDF viewer, download
    FinalCTA               ← TO BE CONTINUED… + contact links
    CustomCursor, fx.tsx   ← cursor states, magnetic buttons, 3D tilt, text reveals, particles
  hooks/                   ← Lenis smooth scroll + scroll lock, media queries, watch progress
scripts/build-images.mjs   ← portrait/share-image pipeline (sharp)
```

**Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion 11, Lenis.

## Accessibility and performance

- `prefers-reduced-motion` is respected: smooth scroll, the custom cursor, tilt, particles, grain and the pinned horizontal scroll turn off, and the opening jumps straight to its final frame.
- Hover effects only run on devices with a precise pointer. Touch devices get tap interactions and native swipe rails.
- The custom cursor appears only with a mouse or trackpad.
- Overlays close with Esc, and the highlight reel supports Space and the ← → keys.
- Portraits are responsive WebP files (25–90 KB). Overlays are code-split, and particles pause when they're off screen.

## Keyboard shortcuts

- **Opening:** Enter or Esc skips it.
- **Play Intro:** Space pauses, ← and → change slides, Esc closes.
- **Project and resume overlays:** Esc closes.
