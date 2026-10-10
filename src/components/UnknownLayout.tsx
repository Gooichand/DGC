import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { profile, viewerProfiles, type ProfileId } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE, Magnetic } from './fx';
import Navbar from './Navbar';
import About from './About';
import Skills from './Skills';
import Originals from './Originals';
import Seasons from './Seasons';
import TopPicks from './TopPicks';
import Achievements from './Achievements';
import ResumeSection from './ResumeViewer';
import FinalCTA from './FinalCTA';
import { SeriesMark } from './Poster';

/**
 * UNKNOWN VIEWER — a deliberately different layout for the "Unknown" profile.
 * Instead of the cinematic crimson billboard it opens into a green "dossier":
 * a terminal hero, an interactive whoami, and numbered case-file sections.
 * The data is the same story — the presentation is a different case file.
 */
export default function UnknownLayout({
  onSwitch,
  onReplay,
  onOpenProject,
  onViewResume,
}: {
  onSwitch: (id: ProfileId) => void;
  onReplay: () => void;
  onOpenProject: (p: import('../data/portfolio').Project) => void;
  onViewResume: () => void;
}) {
  const order = viewerProfiles.find((p) => p.id === 'unknown')!.order;
  return (
    <div className="relative">
      <Navbar order={order} profileId="unknown" onSwitch={onSwitch} />
      <main>
        <DossierHero />
        <DossierSection id="about" index={1} label="PROFILE" file="DGC_Information.txt">
          <About />
        </DossierSection>
        <DossierSection id="skills" index={2} label="SKILLS" file="skills.txt">
          <Skills />
        </DossierSection>
        <DossierSection id="originals" index={3} label="PROJECTS" file="projects/">
          <Originals onOpen={onOpenProject} />
        </DossierSection>
        <DossierSection id="journey" index={4} label="JOURNEY" file="missions.log">
          <Seasons />
        </DossierSection>
        <DossierSection id="picks" index={5} label="TOP MOMENTS" file="highlights.dat">
          <TopPicks />
        </DossierSection>
        <DossierSection id="moments" index={6} label="BADGES & CERTS" file="credentials.xml">
          <Achievements />
        </DossierSection>
        <DossierSection id="story" index={7} label="RESUME" file="DGC_Resume.pdf">
          <ResumeSection onView={onViewResume} />
        </DossierSection>
        <FinalCTA onReplay={onReplay} />
      </main>
    </div>
  );
}

const ACCENT = '#46e3a8';

function DossierHero() {
  const { scrollTo } = useSmoothScroll();
  const reduced = useReducedMotionPref();
  const [typed, setTyped] = useState('');
  const full = profile.intro;
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setTyped(full);
      return;
    }
    started.current = true;
    let i = 0;
    const t = window.setInterval(() => {
      i += 2;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(t);
    }, 14);
    return () => window.clearInterval(t);
  }, [full, reduced]);

  const stats = [
    { v: '4+', k: 'years studying' },
    { v: '10+', k: 'malware analyzed' },
    { v: '50+', k: 'tools tested' },
    { v: '26', k: 'projects' },
  ];

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* grid + glow backdrop */}
      <div aria-hidden className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(70,227,168,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(70,227,168,0.07)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div aria-hidden className="absolute -left-40 top-1/3 h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(closest-side,rgba(70,227,168,0.16),transparent)] blur-2xl" />
      <span aria-hidden className="text-outline pointer-events-none absolute -right-6 top-6 select-none font-display leading-none opacity-30" style={{ fontSize: 'clamp(12rem, 40vw, 30rem)', ['-webkit-text-stroke' as string]: '3px rgba(70,227,168,0.25)' }}>
        ?
      </span>

      <div className="gutter relative z-10 w-full py-24">
        <motion.p
          className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.4em]"
          style={{ color: ACCENT }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Secure connection // unknown viewer
        </motion.p>

        <motion.h1
          className="font-display leading-[0.85] tracking-wide text-bone"
          style={{ fontSize: 'clamp(3.6rem, 12vw, 10rem)' }}
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        >
          WHO IS <span style={{ color: ACCENT }}>THIS?</span>
        </motion.h1>

        <motion.p
          className="mt-4 max-w-xl font-sans text-base text-mist sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          You&apos;ve reached the portfolio of {profile.displayName}. Before the series plays — here&apos;s the case file.
        </motion.p>

        {/* terminal card */}
        <motion.div
          className="mt-8 max-w-2xl overflow-hidden rounded-xl border bg-[#0a0f0c]/90 backdrop-blur"
          style={{ borderColor: `${ACCENT}44` }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
        >
          <div className="flex items-center gap-1.5 border-b px-4 py-2.5" style={{ borderColor: `${ACCENT}22` }}>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-[11px] tracking-wider text-mist">dgc@mhne: ~ — whoami</span>
          </div>
          <div className="space-y-3 p-4 font-mono text-[13px] leading-relaxed sm:p-5">
            <p className="text-mist">
              <span style={{ color: ACCENT }}>dgc@mhne</span>:<span className="text-bone/60">~$</span> whoami
            </p>
            <p className="text-bone">
              {profile.displayName} — <span style={{ color: ACCENT }}>{profile.role}</span> student
            </p>
            <p className="text-mist">
              <span style={{ color: ACCENT }}>dgc@mhne</span>:<span className="text-bone/60">~$</span> cat DGC_Information.txt
            </p>
            <p className="min-h-[3.5em] text-bone/85">
              {typed}
              <span aria-hidden className="ml-0.5 inline-block h-4 w-2 animate-pulse align-middle" style={{ background: ACCENT }} />
            </p>
            <p className="text-smoke">
              <span style={{ color: ACCENT }}>dgc@mhne</span>:<span className="text-bone/60">~$</span>{' '}
              <span className="text-transparent">_</span>
            </p>
          </div>
        </motion.div>

        {/* stats */}
        <motion.dl
          className="mt-8 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-4"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08, delayChildren: 0.7 }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.k}
              className="bg-[#0a0f0c] p-4"
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
            >
              <dd className="font-display text-3xl leading-none" style={{ color: ACCENT }}>
                {s.v}
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">{s.k}</dt>
            </motion.div>
          ))}
        </motion.dl>

        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Magnetic>
            <button
              type="button"
              data-cursor="play"
              onClick={() => scrollTo('#about')}
              className="flex min-h-12 items-center gap-3 rounded-md px-7 text-[15px] font-bold text-[#031109] transition hover:brightness-110"
              style={{ background: ACCENT }}
            >
              Open the dossier ↓
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="glass flex min-h-12 items-center gap-3 rounded-md px-7 text-[15px] font-semibold text-bone transition hover:bg-white/15"
            >
              GitHub ↗
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

function DossierSection({ id, index, label, file, children }: { id: string; index: number; label: string; file: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 py-12 sm:py-16">
      <div className="gutter mb-8">
        <div className="flex flex-wrap items-center gap-3 border-b pb-3" style={{ borderColor: `${ACCENT}33` }}>
          <span className="font-mono text-xs font-bold tracking-[0.3em]" style={{ color: ACCENT }}>
            CASE FILE {String(index).padStart(2, '0')}
          </span>
          <span className="h-px w-8 bg-white/20" />
          <span className="font-sans text-sm font-semibold uppercase tracking-[0.24em] text-bone">{label}</span>
          <span className="ml-auto font-mono text-[11px] text-smoke">{file}</span>
        </div>
        <div className="mt-8">{children}</div>
        <div className="mt-8 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.3em] text-smoke">REPORT: INTACT</span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-smoke">INTEGRITY: 100%</span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-smoke">NODE: {String(index).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}

export const UnknownMark = SeriesMark;