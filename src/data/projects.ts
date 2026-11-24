// Every planet in the solar system on the home page is one project.
// Edit this file to change the text, links or how each planet looks.
//
// ✏️  DRAFT: the `tagline` and `description` fields below are first drafts
//     written from the existing pages. Search for "DRAFT" to find them.

export interface PlanetAppearance {
  /** Real body the texture shows (used in the cursor's target readout) */
  body: string;
  /** Path to an equirectangular texture in /public/textures */
  texture: string;
  /** Planet radius in scene units (the sun is 2.4) */
  size: number;
  /** Distance from the sun in scene units */
  orbitRadius: number;
  /** Orbit speed in radians per second */
  speed: number;
  /** Where on its orbit the planet starts, in radians */
  startAngle: number;
  /** Axial tilt in radians */
  tilt: number;
  /** Colour of the thin atmosphere glow */
  atmosphere: string;
  /** Optional colour multiplied over the texture */
  tint?: string;
  /** Draw Saturn-style rings around the planet */
  ring: boolean;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Internal route (e.g. /resume) or a file/URL (e.g. /notebooks/x.pdf) */
  link: string;
  planet: PlanetAppearance;
}

export const projects: Project[] = [
  {
    id: 'resume',
    name: 'Resume',
    tagline: 'Data Analyst & Systems Engineer at Northrop Grumman', // DRAFT
    description: // DRAFT
      'Three years building analytical systems for satellite programs: anomaly-detection pipelines, predictive trending models and root-cause investigations, alongside an M.S. in Data Science at Georgia Tech.',
    tags: ['Python', 'MATLAB', 'SQL', 'Machine Learning'],
    link: '/resume',
    planet: {
      body: 'Earth',
      texture: '/textures/earth_daymap.jpg',
      size: 0.72,
      orbitRadius: 5.4,
      speed: 0.2,
      startAngle: 0.6,
      tilt: 0.41,
      atmosphere: '#6fb6ff',
      ring: false,
    },
  },
  {
    id: 'spotify',
    name: 'Spotify Insight',
    tagline: 'Get to know me through my music', // DRAFT
    description: // DRAFT
      'An interactive query builder over my full Spotify listening history. Group by artist, track or time, filter, and explore the results as charts and tables served from a PostgreSQL backend.',
    tags: ['React', 'Recharts', 'PostgreSQL', 'API'],
    link: '/spotify',
    planet: {
      body: 'Uranus',
      texture: '/textures/uranus.jpg',
      size: 0.82,
      orbitRadius: 8,
      speed: 0.14,
      startAngle: 2.5,
      tilt: 0.2,
      atmosphere: '#7dffb0',
      tint: '#c4ffd6',
      ring: false,
    },
  },
  {
    id: 'flights',
    name: 'Flight Simulator',
    tagline: 'A live flight operations center', // DRAFT
    description: // DRAFT
      'A real-time operations dashboard that replays simulated flights over Socket.IO, tracking departures, delays and high-risk flights as they propagate through the schedule.',
    tags: ['Socket.IO', 'TypeScript', 'Simulation', 'Real-time'],
    link: '/flights',
    planet: {
      body: 'Mars',
      texture: '/textures/mars.jpg',
      size: 0.62,
      orbitRadius: 10.6,
      speed: 0.1,
      startAngle: 4.3,
      tilt: 0.44,
      atmosphere: '#ffae7a',
      ring: false,
    },
  },
  {
    id: 'hurricane',
    name: 'Hurricane Catastrophe Model',
    tagline: 'Monte Carlo risk for hurricane coverage', // DRAFT
    description: // DRAFT
      'A Monte Carlo simulation of hurricane insurance risk in Python: negative binomial storm frequency, log-normal severity, damage equations and an automatically generated loss report.',
    tags: ['Python', 'Monte Carlo', 'Risk Analysis', 'Statistics'],
    link: '/notebooks/Hurricane_Model.pdf',
    planet: {
      body: 'Jupiter',
      texture: '/textures/jupiter.jpg',
      size: 1.35,
      orbitRadius: 14,
      speed: 0.065,
      startAngle: 1.2,
      tilt: 0.05,
      atmosphere: '#ffd9a8',
      ring: false,
    },
  },
  {
    id: 'writings',
    name: 'Writings',
    tagline: 'Notes on data, engineering and everything between', // DRAFT
    description: // DRAFT
      'Longer-form thoughts on analytics, systems engineering and the projects in this system. Coming soon.',
    tags: ['Essays', 'Notes'],
    link: '/writings',
    planet: {
      body: 'Saturn',
      texture: '/textures/saturn.jpg',
      size: 1.05,
      orbitRadius: 18,
      speed: 0.045,
      startAngle: 3.4,
      tilt: 0.47,
      atmosphere: '#ffe7b8',
      ring: true,
    },
  },
];

/** Links to files or other sites open in a new tab instead of the router. */
export function isExternalLink(link: string) {
  return /^https?:\/\//.test(link) || /\.[a-z0-9]+$/i.test(link);
}
