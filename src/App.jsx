import { useCallback, useEffect, useRef, useState, Suspense, lazy } from 'react';
import { ModeSwitcher } from './components/ModeSwitcher';
import { ProfessionalMode } from './modes/professional/ProfessionalMode';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const TerminalMode = lazy(() =>
  import('./modes/terminal/TerminalMode').then((m) => ({ default: m.TerminalMode }))
);

const MangaMode = lazy(() =>
  import('./modes/manga/MangaMode').then((m) => ({ default: m.MangaMode }))
);

// Easter-egg widgets stay available in every mode, loaded on demand only.
const ChessChatbot = lazy(() =>
  import('./components/sections/ChessChatbot').then((m) => ({ default: m.ChessChatbot }))
);

const AboutMeChatBot = lazy(() =>
  import('./components/sections/AboutMeChatBot').then((m) => ({ default: m.AboutMeChatBot }))
);

const ImagePuzzleWidget = lazy(() =>
  import('./components/ImagePuzzle/ImagePuzzleWidget').then((m) => ({ default: m.ImagePuzzleWidget }))
);

const MODE_STORAGE_KEY = 'portfolio-mode';

/** Sections shared across all three modes — enables cross-mode position preservation. */
const SHARED_SECTIONS = ['about', 'experience', 'skills', 'projects', 'education', 'certifications', 'contact'];

function getCurrentSection() {
  const midline = window.innerHeight * 0.4;
  let current = null;
  for (const id of SHARED_SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= midline) {
      current = id;
    }
  }
  return current;
}

export default function App() {
  const [mode, setMode] = useLocalStorage(MODE_STORAGE_KEY, 'professional');
  const [switching, setSwitching] = useState(false);
  const pendingSectionRef = useRef(null);

  const handleModeChange = useCallback(
    (next) => {
      if (next === mode) return;
      pendingSectionRef.current = getCurrentSection();
      setSwitching(true);
      setTimeout(() => {
        setMode(next);
        // Overlay covers the swap; released after the new mode mounts (effect below).
      }, 120);
    },
    [mode, setMode]
  );

  // Land on the equivalent section once the new mode has mounted.
  useEffect(() => {
    const target = pendingSectionRef.current;
    if (!target) return;
    pendingSectionRef.current = null;
    requestAnimationFrame(() => {
      const el = document.getElementById(target);
      setSwitching(false);
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }, [mode]);

  // Reflect the active mode globally (theme-color + global styling hook).
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const themes = {
        terminal: '#0a0f0a',
        professional: '#ffffff',
        manga: '#ffffff',
      };
      metaTheme.setAttribute('content', themes[mode] || themes.professional);
    }
  }, [mode]);

  const renderMode = () => {
    if (mode === 'terminal') {
      return (
        <Suspense fallback={<div className="app__loading">Booting terminal…</div>}>
          <TerminalMode />
        </Suspense>
      );
    }
    if (mode === 'manga') {
      return (
        <Suspense fallback={<div className="app__loading">Loading manga…</div>}>
          <MangaMode />
        </Suspense>
      );
    }
    return <ProfessionalMode />;
  };

  return (
    <div className={`App ${switching ? 'is-switching' : ''}`}>
      <div className="app__overlay" key={mode} aria-hidden="true" />
      <ModeSwitcher mode={mode} onChange={handleModeChange} />
      {renderMode()}
      <Suspense fallback={null}>
        <ImagePuzzleWidget />
        <ChessChatbot />
        <AboutMeChatBot />
      </Suspense>
    </div>
  );
}