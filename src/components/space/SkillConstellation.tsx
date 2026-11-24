import { useState } from 'react';

interface StarNode {
  skill: string;
  x: number;
  y: number;
  labelPos?: 'top' | 'bottom';
}

// Positions are in a 600 x 300 coordinate space; the SVG scales to fit.
const NODES: StarNode[] = [
  { skill: 'Python', x: 150, y: 120, labelPos: 'top' },
  { skill: 'SQL', x: 60, y: 210 },
  { skill: 'PostgreSQL', x: 130, y: 260 },
  { skill: 'MATLAB', x: 270, y: 50, labelPos: 'top' },
  { skill: 'Machine Learning', x: 300, y: 170 },
  { skill: 'Statistical Analysis', x: 450, y: 110, labelPos: 'top' },
  { skill: 'R', x: 540, y: 190 },
  { skill: 'Data Visualization', x: 420, y: 250 },
];

const EDGES: [string, string][] = [
  ['Python', 'SQL'],
  ['SQL', 'PostgreSQL'],
  ['Python', 'MATLAB'],
  ['Python', 'Machine Learning'],
  ['MATLAB', 'Statistical Analysis'],
  ['Machine Learning', 'Statistical Analysis'],
  ['Statistical Analysis', 'R'],
  ['R', 'Data Visualization'],
  ['Machine Learning', 'Data Visualization'],
];

interface Props {
  skills: string[];
  onSelect: (skill: string) => void;
}

/** Skills drawn as a constellation. Hover/focus lights a star and its links; click opens details. */
const SkillConstellation: React.FC<Props> = ({ skills, onSelect }) => {
  const [active, setActive] = useState<string | null>(null);
  const nodes = NODES.filter((n) => skills.includes(n.skill));
  const byName = Object.fromEntries(nodes.map((n) => [n.skill, n]));
  const edges = EDGES.filter(([a, b]) => byName[a] && byName[b]);
  const isLinked = (skill: string) =>
    active !== null && (skill === active || edges.some(([a, b]) => (a === active && b === skill) || (b === active && a === skill)));

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-sm p-2 md:p-4">
      <svg viewBox="0 0 600 300" className="w-full h-auto select-none" role="group" aria-label="Skills constellation">
        <defs>
          <radialGradient id="star-glow">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#a5b4fc" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
          </radialGradient>
        </defs>

        {edges.map(([a, b]) => {
          const lit = active !== null && (a === active || b === active);
          return (
            <line
              key={`${a}-${b}`}
              x1={byName[a].x}
              y1={byName[a].y}
              x2={byName[b].x}
              y2={byName[b].y}
              stroke={lit ? '#c7d2fe' : '#ffffff'}
              strokeOpacity={lit ? 0.9 : 0.15}
              strokeWidth={lit ? 1.6 : 1}
              strokeDasharray={lit ? undefined : '3 4'}
              style={{ transition: 'all 250ms ease' }}
            />
          );
        })}

        {nodes.map((n, i) => {
          const lit = isLinked(n.skill);
          const isActive = active === n.skill;
          const labelY = n.labelPos === 'top' ? n.y - 18 : n.y + 26;
          return (
            <g
              key={n.skill}
              role="button"
              tabIndex={0}
              aria-label={`${n.skill}: show details`}
              className="cursor-pointer outline-none"
              onMouseEnter={() => setActive(n.skill)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.skill)}
              onBlur={() => setActive(null)}
              onClick={() => onSelect(n.skill)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(n.skill);
                }
              }}
            >
              {/* larger invisible hit area */}
              <circle cx={n.x} cy={n.y} r={22} fill="transparent" />
              <circle
                cx={n.x}
                cy={n.y}
                r={isActive ? 26 : lit ? 18 : 12}
                fill="url(#star-glow)"
                opacity={active === null ? 0.6 : lit ? 1 : 0.25}
                style={{ transition: 'all 250ms ease' }}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={isActive ? 4.5 : 3}
                fill="#fff"
                className="constellation-twinkle"
                style={{ animationDelay: `${i * 0.4}s`, transition: 'r 250ms ease' }}
              />
              <text
                x={n.x}
                y={labelY}
                textAnchor="middle"
                fontSize={13}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                letterSpacing="0.06em"
                fill={isActive ? '#ffffff' : lit ? '#e0e7ff' : active === null ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'}
                style={{ transition: 'fill 250ms ease' }}
              >
                {n.skill}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-center text-xs font-mono text-white/40 pb-2">Hover a star to trace its connections · click for details</p>
    </div>
  );
};

export default SkillConstellation;
