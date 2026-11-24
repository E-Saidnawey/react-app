import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects';
import ProjectPanel from '../components/ProjectPanel';
import SpaceCursor from '../components/SpaceCursor';
import { useMediaQuery } from '../hooks/useMediaQuery';

// three.js is heavy, so the 3D scene loads in its own chunk
const SolarSystem = lazy(() => import('../components/solar/SolarSystem'));

function Loading() {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#000005]" role="status">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-pulse rounded-full bg-amber-200 shadow-[0_0_60px_20px_rgba(251,191,36,0.45)]" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">Plotting orbits…</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Planet under the mouse in the scene, and planet button hovered/focused in the list
  const [sceneHoverId, setSceneHoverId] = useState<string | null>(null);
  const [listHoverId, setListHoverId] = useState<string | null>(null);
  const hoveredId = sceneHoverId ?? listHoverId;
  const [ready, setReady] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const compact = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  const close = useCallback(() => {
    setSelectedId(null);
    // Give keyboard users their place back in the planet list
    lastTrigger.current?.focus({ preventScroll: true });
    lastTrigger.current = null;
  }, []);

  const select = useCallback(
    (id: string | null) => {
      if (id === null) close();
      else setSelectedId(id);
    },
    [close],
  );

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, close]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <main className={`fixed inset-0 overflow-hidden bg-[#000005] text-white ${finePointer ? 'has-space-cursor' : ''}`}>
      <Suspense fallback={null}>
        <SolarSystem
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={select}
          onHover={setSceneHoverId}
          onReady={handleReady}
          reducedMotion={reducedMotion}
          compact={compact}
        />
      </Suspense>
      {!ready && <Loading />}

      <header className="pointer-events-none absolute left-4 top-4 z-10 max-w-[80vw] md:left-8 md:top-7">
        <h1 className="text-xl font-light tracking-wide text-white md:text-2xl">Eric Saidnawey</h1>
        <p className="text-sm text-white/65 md:text-base">Data Analyst &amp; Systems Engineer</p>
        <p className="mt-2 font-mono text-[11px] tracking-wide text-indigo-200/60 md:text-xs">
          Every planet is a project. Click one to land.
        </p>
      </header>

      {/* Keyboard and screen-reader way to pick a planet */}
      <nav
        aria-label="Projects"
        className={`absolute bottom-3 left-3 right-3 z-10 transition-opacity md:bottom-6 md:left-8 md:right-auto ${
          selected && compact ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <ul className="flex flex-wrap gap-1.5">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={p.id === selectedId}
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setSelectedId(p.id);
                }}
                onMouseEnter={() => setListHoverId(p.id)}
                onMouseLeave={() => setListHoverId(null)}
                onFocus={() => setListHoverId(p.id)}
                onBlur={() => setListHoverId(null)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-indigo-300 ${
                  p.id === selectedId
                    ? 'border-white/50 bg-white/15 text-white'
                    : 'border-white/10 bg-black/20 text-white/55 hover:border-white/30 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {selected && <ProjectPanel project={selected} onClose={close} />}

      {finePointer && <SpaceCursor target={projects.find((p) => p.id === sceneHoverId) ?? null} />}

      <p aria-live="polite" className="sr-only">
        {selected ? `Flying to ${selected.name}.` : ''}
      </p>

      <a
        href="https://www.solarsystemscope.com/textures/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-1 right-2 z-10 hidden text-[10px] text-white/25 hover:text-white/60 md:block"
      >
        Textures: Solar System Scope (CC BY 4.0)
      </a>
    </main>
  );
}
