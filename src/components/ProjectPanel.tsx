import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { isExternalLink, type Project } from '../data/projects';

interface ProjectPanelProps {
  project: Project;
  onClose: () => void;
}

/** Glass info card beside the focused planet (a bottom sheet on phones). */
export default function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [project.id]);

  const external = isExternalLink(project.link);
  const cta = (
    <>
      {external ? 'Open project' : 'Land'}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </>
  );
  const ctaClass =
    'group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(165,180,252,0.35)] transition-colors hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300';

  return (
    <section
      key={project.id}
      role="dialog"
      aria-modal="false"
      aria-labelledby="project-panel-title"
      className="glass-panel absolute inset-x-3 bottom-3 z-20 max-h-[46dvh] overflow-y-auto rounded-3xl p-6 text-left
                 md:inset-x-auto md:bottom-auto md:right-8 md:top-1/2 md:max-h-[80dvh] md:w-[min(26rem,38vw)] md:-translate-y-1/2 md:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-300"
        aria-label="Close and return to the solar system"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-indigo-200/70">Project</p>
      <h2
        id="project-panel-title"
        ref={heading}
        tabIndex={-1}
        className="pr-10 text-2xl font-light text-white outline-none md:text-3xl"
      >
        {project.name}
      </h2>
      <p className="mt-1 text-sm text-indigo-100/80 md:text-base">{project.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-white/70">{project.description}</p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-4">
        {external ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className={ctaClass}>
            {cta}
          </a>
        ) : (
          <Link to={project.link} className={ctaClass}>
            {cta}
          </Link>
        )}
        <span className="hidden text-xs text-white/40 md:inline">Esc to fly back</span>
      </div>
    </section>
  );
}
