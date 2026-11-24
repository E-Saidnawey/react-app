import { useEffect, useRef, useState } from 'react';

export interface MissionEntry {
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements: string[];
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 motion-reduce:transition-none ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'}`}
    >
      {children}
    </div>
  );
}

/** Experience rendered as a vertical "mission log" timeline. Newest entry first. */
const MissionLog: React.FC<{ entries: MissionEntry[] }> = ({ entries }) => {
  return (
    <ol className="relative ml-3 md:ml-4 border-l border-dashed border-indigo-300/30">
      {entries.map((job, index) => {
        const entryNo = String(entries.length - index).padStart(2, '0');
        const active = /present/i.test(job.duration);
        return (
          <li key={index} className="relative pl-8 md:pl-10 pb-10 last:pb-0">
            {/* timeline node */}
            <span className="absolute -left-[9px] top-6 flex h-4 w-4 items-center justify-center">
              {active && <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60 animate-ping motion-reduce:animate-none" />}
              <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-300 shadow-[0_0_12px_#a5b4fc]" />
            </span>

            <Reveal delay={index * 80}>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-sm p-6 text-left hover:border-indigo-300/40 transition-colors">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 font-mono text-[11px] tracking-widest uppercase">
                  <span className="text-indigo-300">Log entry {entryNo}</span>
                  <span className="text-white/30">//</span>
                  <span className="text-white/50">{job.duration}</span>
                  {active && (
                    <span className="ml-auto rounded-full border border-emerald-400/40 px-2 py-0.5 text-emerald-300">● Active</span>
                  )}
                </div>
                <h3 className="text-xl font-medium text-white">{job.position}</h3>
                <p className="text-sm text-white/50 mb-3">{job.company}</p>
                <p className="text-white/70 mb-4">{job.description}</p>
                <ul className="space-y-2">
                  {job.achievements.map((a, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/70 leading-relaxed">
                      <span className="text-indigo-300 mt-0.5">▸</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
};

export default MissionLog;
