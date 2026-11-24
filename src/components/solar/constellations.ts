// Real constellation figures. Star positions are J2000 right ascension
// (hours) and declination (degrees) with apparent magnitude.

export type Star = [ra: number, dec: number, mag: number];

export interface Constellation {
  name: string;
  stars: Record<string, Star>;
  lines: [string, string][];
}

const hms = (h: number, m: number, s = 0) => h + m / 60 + s / 3600;
/** Degrees and arcminutes; pass a negative `d` (or -0 via `south`) for southern stars. */
const dms = (d: number, m: number) => d + (d < 0 ? -m : m) / 60;
const south = (d: number, m: number) => -(d + m / 60);

/**
 * How the whole sky is turned for the default view. The celestial sphere
 * is rotated as one rigid unit so that these two constellations land at
 * the given screen offsets (degrees right/up of the view centre). Every
 * other constellation keeps its true position relative to them, so the
 * rest come into view as you drag.
 */
export const SKY_ANCHORS: { name: string; screen: [right: number, up: number] }[] = [
  { name: 'Ursa Major', screen: [-14, 15] },
  { name: 'Leo', screen: [26, 10] },
];

export const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Orion',
    stars: {
      betelgeuse: [hms(5, 55, 10), dms(7, 24), 0.5],
      bellatrix: [hms(5, 25, 8), dms(6, 21), 1.6],
      meissa: [hms(5, 35, 8), dms(9, 56), 3.4],
      mintaka: [hms(5, 32, 0), south(0, 18), 2.2],
      alnilam: [hms(5, 36, 13), south(1, 12), 1.7],
      alnitak: [hms(5, 40, 46), south(1, 57), 1.8],
      saiph: [hms(5, 47, 45), south(9, 40), 2.1],
      rigel: [hms(5, 14, 32), south(8, 12), 0.1],
    },
    lines: [
      ['meissa', 'betelgeuse'],
      ['meissa', 'bellatrix'],
      ['betelgeuse', 'alnitak'],
      ['bellatrix', 'mintaka'],
      ['mintaka', 'alnilam'],
      ['alnilam', 'alnitak'],
      ['alnitak', 'saiph'],
      ['mintaka', 'rigel'],
    ],
  },
  {
    name: 'Ursa Major',
    stars: {
      dubhe: [hms(11, 3, 44), dms(61, 45), 1.8],
      merak: [hms(11, 1, 50), dms(56, 23), 2.4],
      phecda: [hms(11, 53, 50), dms(53, 42), 2.4],
      megrez: [hms(12, 15, 26), dms(57, 2), 3.3],
      alioth: [hms(12, 54, 2), dms(55, 58), 1.8],
      mizar: [hms(13, 23, 56), dms(54, 56), 2.2],
      alkaid: [hms(13, 47, 32), dms(49, 19), 1.9],
    },
    lines: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid'],
    ],
  },
  {
    name: 'Cassiopeia',
    stars: {
      caph: [hms(0, 9, 11), dms(59, 9), 2.3],
      schedar: [hms(0, 40, 30), dms(56, 32), 2.2],
      navi: [hms(0, 56, 42), dms(60, 43), 2.2],
      ruchbah: [hms(1, 25, 49), dms(60, 14), 2.7],
      segin: [hms(1, 54, 24), dms(63, 40), 3.4],
    },
    lines: [
      ['caph', 'schedar'],
      ['schedar', 'navi'],
      ['navi', 'ruchbah'],
      ['ruchbah', 'segin'],
    ],
  },
  {
    name: 'Leo',
    stars: {
      regulus: [hms(10, 8, 22), dms(11, 58), 1.4],
      eta: [hms(10, 7, 20), dms(16, 46), 3.5],
      algieba: [hms(10, 19, 58), dms(19, 50), 2.0],
      adhafera: [hms(10, 16, 41), dms(23, 25), 3.4],
      rasalas: [hms(9, 52, 46), dms(26, 0), 3.9],
      epsilon: [hms(9, 45, 51), dms(23, 46), 3.0],
      zosma: [hms(11, 14, 6), dms(20, 31), 2.6],
      chertan: [hms(11, 14, 14), dms(15, 26), 3.3],
      denebola: [hms(11, 49, 4), dms(14, 34), 2.1],
    },
    lines: [
      ['regulus', 'eta'],
      ['eta', 'algieba'],
      ['algieba', 'adhafera'],
      ['adhafera', 'rasalas'],
      ['rasalas', 'epsilon'],
      ['algieba', 'zosma'],
      ['zosma', 'denebola'],
      ['denebola', 'chertan'],
      ['chertan', 'regulus'],
    ],
  },
  {
    name: 'Boötes',
    stars: {
      arcturus: [hms(14, 15, 40), dms(19, 11), 0],
      izar: [hms(14, 44, 59), dms(27, 4), 2.4],
      delta: [hms(15, 15, 30), dms(33, 19), 3.5],
      nekkar: [hms(15, 1, 57), dms(40, 23), 3.5],
      seginus: [hms(14, 32, 5), dms(38, 18), 3.0],
      rho: [hms(14, 31, 50), dms(30, 22), 3.6],
      muphrid: [hms(13, 54, 41), dms(18, 24), 2.7],
    },
    lines: [
      ['arcturus', 'izar'],
      ['izar', 'delta'],
      ['delta', 'nekkar'],
      ['nekkar', 'seginus'],
      ['seginus', 'rho'],
      ['rho', 'arcturus'],
      ['arcturus', 'muphrid'],
    ],
  },
  {
    name: 'Crux',
    stars: {
      acrux: [hms(12, 26, 36), south(63, 6), 0.8],
      mimosa: [hms(12, 47, 43), south(59, 41), 1.3],
      gacrux: [hms(12, 31, 10), south(57, 7), 1.6],
      delta: [hms(12, 15, 9), south(58, 45), 2.8],
    },
    lines: [
      ['acrux', 'gacrux'],
      ['mimosa', 'delta'],
    ],
  },
  {
    name: 'Scorpius',
    stars: {
      acrab: [hms(16, 5, 26), south(19, 48), 2.6],
      dschubba: [hms(16, 0, 20), south(22, 37), 2.3],
      pi: [hms(15, 58, 51), south(26, 7), 2.9],
      sigma: [hms(16, 21, 11), south(25, 36), 2.9],
      antares: [hms(16, 29, 24), south(26, 26), 1.0],
      tau: [hms(16, 35, 53), south(28, 13), 2.8],
      epsilon: [hms(16, 50, 10), south(34, 18), 2.3],
      mu: [hms(16, 51, 52), south(38, 3), 3.0],
      zeta: [hms(16, 54, 35), south(42, 22), 3.6],
      eta: [hms(17, 12, 9), south(43, 14), 3.3],
      sargas: [hms(17, 37, 19), south(43, 0), 1.9],
      iota: [hms(17, 47, 35), south(40, 8), 3.0],
      kappa: [hms(17, 42, 29), south(39, 2), 2.4],
      shaula: [hms(17, 33, 36), south(37, 6), 1.6],
    },
    lines: [
      ['acrab', 'dschubba'],
      ['dschubba', 'pi'],
      ['dschubba', 'sigma'],
      ['sigma', 'antares'],
      ['antares', 'tau'],
      ['tau', 'epsilon'],
      ['epsilon', 'mu'],
      ['mu', 'zeta'],
      ['zeta', 'eta'],
      ['eta', 'sargas'],
      ['sargas', 'iota'],
      ['iota', 'kappa'],
      ['kappa', 'shaula'],
    ],
  },
  {
    name: 'Cygnus',
    stars: {
      deneb: [hms(20, 41, 26), dms(45, 17), 1.3],
      sadr: [hms(20, 22, 14), dms(40, 15), 2.2],
      eta: [hms(19, 56, 18), dms(35, 5), 3.9],
      albireo: [hms(19, 30, 43), dms(27, 58), 3.1],
      gienah: [hms(20, 46, 13), dms(33, 58), 2.5],
      zeta: [hms(21, 12, 56), dms(30, 14), 3.2],
      delta: [hms(19, 44, 58), dms(45, 8), 2.9],
    },
    lines: [
      ['deneb', 'sadr'],
      ['sadr', 'eta'],
      ['eta', 'albireo'],
      ['sadr', 'gienah'],
      ['gienah', 'zeta'],
      ['sadr', 'delta'],
    ],
  },
  {
    name: 'Pegasus',
    stars: {
      markab: [hms(23, 4, 46), dms(15, 12), 2.5],
      scheat: [hms(23, 3, 46), dms(28, 5), 2.4],
      alpheratz: [hms(0, 8, 23), dms(29, 5), 2.1],
      algenib: [hms(0, 13, 14), dms(15, 11), 2.8],
      homam: [hms(22, 41, 28), dms(10, 50), 3.4],
      biham: [hms(22, 10, 12), dms(6, 12), 3.5],
      enif: [hms(21, 44, 11), dms(9, 52), 2.4],
      matar: [hms(22, 43, 0), dms(30, 13), 2.9],
    },
    lines: [
      ['markab', 'scheat'],
      ['scheat', 'alpheratz'],
      ['alpheratz', 'algenib'],
      ['algenib', 'markab'],
      ['markab', 'homam'],
      ['homam', 'biham'],
      ['biham', 'enif'],
      ['scheat', 'matar'],
    ],
  },
];
