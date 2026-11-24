import { Link } from 'react-router-dom';

/** "← Back to the system" link shown at the top of every project page. */
export default function BackToSystem({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/70 px-4 py-2 font-mono text-xs tracking-wide text-white/80 backdrop-blur-sm transition-colors hover:border-indigo-300/60 hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-300 ${className}`}
    >
      <span aria-hidden="true">←</span> Back to the system
    </Link>
  );
}
