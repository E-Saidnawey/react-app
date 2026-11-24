import BackToSystem from '../components/BackToSystem';

// Placeholder until the writings section exists.
export default function Writings() {
  return (
    <div className="space-bg dark min-h-screen text-white">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <BackToSystem />
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-indigo-200/70">Signal pending</p>
          <h1 className="mb-4 text-4xl font-light md:text-5xl">Writings</h1>
          <p className="max-w-md leading-relaxed text-white/60">
            Notes on data, engineering and everything between. The first transmissions are on their way.
          </p>
        </div>
      </div>
    </div>
  );
}
