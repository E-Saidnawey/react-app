import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Project } from '../data/projects';

type Mode = 'hidden' | 'scan' | 'pointer';

interface SpaceCursorProps {
  /** Planet currently under the mouse in the 3D scene, if any */
  target: Project | null;
}

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

/**
 * Telescope / radar cursor drawn as a DOM + SVG overlay above the canvas.
 * It never receives pointer events, so clicks go straight through.
 * Only mount it where `(hover: hover) and (pointer: fine)` matches.
 */
export default function SpaceCursor({ target }: SpaceCursorProps) {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('hidden');

  useEffect(() => {
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let seen = false;
    let last = performance.now();
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        cx = x;
        cy = y;
        seen = true;
      }
      const el = e.target instanceof Element ? e.target : null;
      setMode(el?.closest(INTERACTIVE) ? 'pointer' : 'scan');
    };
    const onLeave = () => {
      seen = false;
      setMode('hidden');
    };

    // Short exponential smoothing: soft but never more than a frame or two behind
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const k = 1 - Math.exp(-dt * 32);
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      const el = root.current;
      if (el) {
        el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        // Put the readout on the left when there's no room on the right
        const flip = cx > window.innerWidth - 360 ? 'true' : 'false';
        if (el.dataset.flip !== flip) el.dataset.flip = flip;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const locked = mode === 'scan' && target !== null;
  const style = { '--cursor-accent': target?.planet.atmosphere ?? '#c7d2fe' } as CSSProperties;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="space-cursor pointer-events-none fixed left-0 top-0 z-50"
      data-mode={mode}
      data-locked={locked || undefined}
      style={{ ...style, transform: 'translate3d(-200px, -200px, 0)' }}
    >
      <div className="space-cursor__reticle">
        <div className="space-cursor__sweep" />
        <svg viewBox="0 0 48 48" className="space-cursor__svg">
          <circle cx="24" cy="24" r="19" className="space-cursor__ring" />
          <circle cx="24" cy="24" r="11" className="space-cursor__inner" />
          {/* crosshair ticks */}
          <line x1="24" y1="1" x2="24" y2="9" />
          <line x1="24" y1="39" x2="24" y2="47" />
          <line x1="1" y1="24" x2="9" y2="24" />
          <line x1="39" y1="24" x2="47" y2="24" />
          <circle cx="24" cy="24" r="1.3" className="space-cursor__dot" />
        </svg>
      </div>
      {locked && target && (
        <div className="space-cursor__readout">
          TARGET: {target.planet.body.toUpperCase()} · {target.name.toUpperCase()}
        </div>
      )}
    </div>
  );
}
