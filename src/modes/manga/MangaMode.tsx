import { useEffect, useState } from 'react';
import { portfolioData as d } from '../../data/portfolio';
import { ContactForm } from '../../components/shared/ContactForm';
import './manga.css';

/** Reveal-on-scroll hook (one-shot), reduced-motion aware. */
function useRevealOnce() {
  const [node, setNode] = useState<Element | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [setNode, visible];
}

/** Wrapper that reveals a panel when it enters the viewport, reduced-motion aware. */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [setNode, isVisible] = useRevealOnce();
  return (
    <div
      ref={setNode as unknown as React.Ref<HTMLDivElement>}
      className={`manga-panel-wrap ${isVisible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: delay + 'ms' } : undefined}
    >
      {children}
    </div>
  );
}

/** Small onomatopoeia burst (ドン!, バン!). Decorative only. */
function Sfx({ text }: { text: string }) {
  return <span className="manga-sfx" aria-hidden="true">{text}</span>;
}

export function MangaMode() {
  return (
    <div className="manga">
      <CoverSection />
      <AboutPanels />
      <StoryArc />
      <ProjectChapters />
      <PowerStats />
      <FlashbackPages />
      <FinalPage />
    </div>
  );
}

/* ================= COVER — CHAPTER 01 ================= */

function CoverSection() {
  return (
    <header className="manga-cover">
      <div className="manga-cover__speedlines" aria-hidden="true" />
      <div className="manga-cover__frame">
        <p className="manga-cover__kicker">WEEKLY PORTFOLIO — CHAPTER 01</p>
        <h1 className="manga-cover__title">
          VAIBHAV SONI
          <span className="manga-cover__jp">バックエンド・エンジニア</span>
        </h1>
        <p className="manga-cover__tagline">THE BACKEND ENGINEER</p>
        <p className="manga-cover__tags">AI • CODE • SYSTEMS</p>
        <MangaAvatar />
        <div className="manga-cover__scroll-cue">SCROLL TO BEGIN THE STORY ↓</div>
      </div>
    </header>
  );
}

/** Ink-style SVG avatar bust, pure vector (no image assets). */
function MangaAvatar() {
  return (
    <svg
      className="manga-avatar"
      viewBox="0 0 200 220"
      role="img"
      aria-label="Stylized ink illustration of Vaibhav"
    >
      <defs>
        <pattern id="manga-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#111" opacity="0.25" />
        </pattern>
      </defs>
      <rect x="10" y="10" width="180" height="200" fill="url(#manga-dots)" />
      <g stroke="#111" strokeWidth="5" fill="#fff">
        <path d="M100 30 C60 30 55 75 62 95 C66 106 74 112 74 122 L74 132 C40 140 28 168 26 210 L174 210 C172 168 160 140 126 132 L126 122 C126 112 134 106 138 95 C145 75 140 30 100 30 Z" />
      </g>
      <g fill="#111">
        <ellipse cx="82" cy="92" rx="5" ry="6" />
        <ellipse cx="118" cy="92" rx="5" ry="6" />
        <path d="M84 116 Q100 128 116 116" stroke="#111" strokeWidth="4" fill="none" />
      </g>
    </svg>
  );
}

/* ================= ABOUT — PANELS 01/02 ================= */

function AboutPanels() {
  const [cardOne, cardTwo] = d.about.cards;
  return (
    <section id="about" className="manga-section manga-about">
      <Reveal>
        <PanelFrame label="PANEL 01 — WHO AM I?">
          <SpeechBubble tail="left">{cardOne.description}</SpeechBubble>
        </PanelFrame>
      </Reveal>
      <Reveal delay={120}>
        <PanelFrame label="PANEL 02 — WHAT DO I DO?">
          <SpeechBubble tail="right">{cardTwo.description}</SpeechBubble>
        </PanelFrame>
      </Reveal>
    </section>
  );
}

/* ================= SHARED PANEL PRIMITIVES ================= */

/** Ink-framed panel with an optional label tab. */
function PanelFrame({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <figure className="manga-panel">
      {label ? <figcaption className="manga-panel__label">{label}</figcaption> : null}
      {children}
    </figure>
  );
}

/** Comic speech bubble with a directional tail. */
function SpeechBubble({ children, tail = 'left' }: { children: React.ReactNode; tail?: string }) {
  return (
    <div className={`manga-bubble manga-bubble--${tail}`}>
      {children}
    </div>
  );
}

/* ================= EXPERIENCE — CHAPTER 02: THE BACKEND ARC ================= */

function StoryArc() {
  const job = d.experience[0];
  if (!job) return null;
  return (
    <section id="experience" className="manga-section manga-story">
      <ChapterTitle number="02" title="THE BACKEND ARC" subtitle="EXPERIENCE" />
      <Reveal>
        <PanelFrame label="SCENE 01 — THE NEW FRONTIER">
          <div className="manga-scene">
            <p className="manga-narration">
              Somewhere in Kolkata, a developer joins Tata Consultancy Services.
              The mission: bring Generative AI to enterprise systems.
            </p>
            <SpeechBubble tail="left">
              <strong>{job.position}</strong> @ {job.company}
              <span className="manga-bubble__meta">{job.period} · {job.location}</span>
            </SpeechBubble>
            <ul className="manga-list">
              {job.responsibilities.map((item) => (
                <li key={item.slice(0, 24)}>{item}</li>
              ))}
            </ul>
          </div>
        </PanelFrame>
      </Reveal>
    </section>
  );
}

/** Big chapter heading with JP flourish. */
function ChapterTitle({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="manga-chapter-head-wrap">
      <div className="manga-chapter-head">
        <span className="manga-chapter-head__num">CHAPTER {number}</span>
        <h2 className="manga-chapter-head__title">{title}</h2>
        {subtitle ? <span className="manga-chapter-head__sub">{subtitle}</span> : null}
      </div>
    </Reveal>
  );
}

/* ================= PROJECTS — CHAPTERS 03+ ================= */

function ProjectChapters() {
  const [featured, ...rest] = d.projects;
  return (
    <section id="projects" className="manga-section manga-projects">
      <ChapterTitle number="03" title="THE PROJECT SAGA" subtitle="SELECTED WORKS" />
      {/* Featured double-spread panel */}
      <Reveal>
        <article className="manga-project manga-project--featured">
          <div className="manga-project__cover">
            <span className="manga-project__chapter">CH.03</span>
            <Sfx text="ドン!" />
          </div>
          <div className="manga-project__body">
            <h3>{featured.title}</h3>
            <p className="manga-narration">{featured.description}</p>
            <p className="manga-meta">{featured.period}</p>
            <ul className="manga-tags">
              {featured.technologies.map((tech) => (
                <li key={tech}>{tech.toUpperCase()}</li>
              ))}
            </ul>
            <div className="manga-links">
              {featured.liveUrl ? (
                <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer">LIVE DEMO →</a>
              ) : null}
              <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer">GITHUB →</a>
            </div>
          </div>
        </article>
      </Reveal>
      <div className="manga-project-grid">
        {rest.map((project: (typeof d.projects)[number]) => (
          <Reveal key={project.id}>
            <article className="manga-project">
              <div className="manga-project__cover">
                <span className="manga-project__chapter">{chapterNumber(project.id)}</span>
                <span className="manga-project__cover-title">{shortTitle(project.title)}</span>
              </div>
              <div className="manga-project__body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul className="manga-tags">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <li key={tech}>{tech.toUpperCase()}</li>
                  ))}
                </ul>
                <div className="manga-links">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">DEMO →</a>
                  ) : null}
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GITHUB →</a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Chapter label per project id, e.g. CH.04 … */
function chapterNumber(id: string): string {
  const index = d.projects.findIndex((p) => p.id === id);
  return 'CH.' + String(index + 3).padStart(2, '0');
}

/** Shortened cover title for project covers. */
function shortTitle(title: string): string {
  return title.split(/[\s(]+/)[0].toUpperCase().slice(0, 14);
}

/* ================= SKILLS — POWER STATS ================= */

const POWER_LEVELS: Record<string, number> = {
  python: 5,
  sql: 4,
  java: 3,
  fastapi: 5,
  flask: 5,
  postgresql: 4,
  sqlite: 4,
  'restful api development': 4,
  rag: 4,
  langgraph: 4,
  'prompt engineering': 4,
};

function levelFor(skill: string): number {
  const direct = POWER_LEVELS[skill.toLowerCase()];
  if (direct) return direct;
  if (/llm|ai|rag|whisper|roboflow|ocr/i.test(skill)) return 4;
  return 3;
}

function PowerStats() {
  return (
    <section id="skills" className="manga-section manga-stats">
      <ChapterTitle number="04" title="POWER LEVELS" subtitle="SKILLS" />
      <div className="manga-stat-grid">
        {d.skills.flatMap((cat) =>
          cat.skills.map((skill) => (
            <Reveal key={cat.id + skill}>
              <div className="manga-stat">
                <span className="manga-stat__name">{skill}</span>
                <span className="manga-stat__bar">{renderBar(levelFor(skill))}</span>
                <span className="manga-stat__level">{levelFor(skill)}/5</span>
              </div>
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
}

/** █░ glyph bar renderer. */
function renderBar(level: number): string {
  const filled = Math.round(level);
  return '█'.repeat(filled) + '░'.repeat(5 - filled);
}

/* ================= EDUCATION — FLASHBACK PAGES ================= */

function FlashbackPages() {
  return (
    <section id="education" className="manga-section manga-flashbacks">
      <ChapterTitle number="05" title="FLASHBACKS" subtitle="EDUCATION" />
      <div className="manga-flashback-grid">
        {d.education.map((school) => (
          <Reveal key={school.id}>
            <PanelFrame label={'FLASHBACK — ' + school.period}>
              <div className="manga-flashback">
                <h3>{school.institution}</h3>
                <p className="manga-narration">{school.degree}</p>
                <p className="manga-meta">{[school.details, school.status].filter(Boolean).join(' · ')}</p>
              </div>
            </PanelFrame>
          </Reveal>
        ))}
      </div>
      {/* Certifications & achievements as trophy panels */}
      <p className="manga-trophies-title">CERTIFICATES &amp; BADGES</p>
      <div id="certifications" className="manga-trophies">
        {d.certifications.map((cert) => (
          <Reveal key={cert.id}>
            <a
              className="manga-trophy"
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              🏆 {cert.title}
              <span className="manga-trophy__meta">{cert.issuer} · {cert.date}</span>
            </a>
          </Reveal>
        ))}
        {d.achievements.map((achievement) => (
          <Reveal key={achievement.id}>
            <div className="manga-trophy">
              ⭐ {achievement.title}
              <span className="manga-trophy__meta">{achievement.org}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= CONTACT — THE FINAL PAGE ================= */

function FinalPage() {
  return (
    <section id="contact" className="manga-section manga-final">
      <ChapterTitle number="06" title="TO BE CONTINUED…" subtitle="CONTACT" />
      <Reveal>
        <PanelFrame label="FINAL PAGE — SEND A TRANSMISSION">
          <p className="manga-narration manga-final__cta">
            Let's build something great together.
          </p>
          <ContactForm variant="ink" />
          <div className="manga-links">
            <a href={'mailto:' + d.profile.email}>EMAIL →</a>
            {d.socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label.toUpperCase()} →
              </a>
            ))}
          </div>
        </PanelFrame>
      </Reveal>
    </section>
  );
}