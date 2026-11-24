import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CONSTELLATIONS, SKY_ANCHORS, type Constellation } from './constellations';

const SKY_RADIUS = 600;
const STAR_RADIUS = 520;

// --- Sky orientation ------------------------------------------------------
// Every star is placed at its true right ascension / declination. The whole
// celestial sphere is then rotated as ONE rigid unit so the two SKY_ANCHORS
// constellations land where we want them in the default camera view.
// Relative positions between stars are never changed.

/** Celestial unit vector: x toward RA 0h, y toward the north celestial pole. */
function raDecToVec(ra: number, dec: number) {
  const a = (ra / 24) * Math.PI * 2;
  const d = THREE.MathUtils.degToRad(dec);
  return new THREE.Vector3(Math.cos(d) * Math.cos(a), Math.sin(d), -Math.cos(d) * Math.sin(a));
}

const DEFAULT_ELEVATION = THREE.MathUtils.degToRad(34); // matches the default camera

function centroidOf(name: string) {
  const c = CONSTELLATIONS.find((k) => k.name === name);
  if (!c) throw new Error(`Unknown constellation ${name}`);
  return Object.values(c.stars)
    .reduce((s, [ra, dec]) => s.add(raDecToVec(ra, dec)), new THREE.Vector3())
    .normalize();
}

/** Orthonormal basis spanned by two directions (bisector, difference, normal). */
function basisFrom(a: THREE.Vector3, b: THREE.Vector3) {
  const e1 = a.clone().add(b).normalize();
  const e2 = a.clone().sub(b);
  e2.addScaledVector(e1, -e2.dot(e1)).normalize();
  return new THREE.Matrix4().makeBasis(e1, e2, e1.clone().cross(e2));
}

function skyRotation() {
  // Default camera looks down at the origin from +z, tilted by the elevation
  const view = new THREE.Vector3(0, -Math.sin(DEFAULT_ELEVATION), -Math.cos(DEFAULT_ELEVATION));
  const up = new THREE.Vector3(0, Math.cos(DEFAULT_ELEVATION), -Math.sin(DEFAULT_ELEVATION));
  const right = view.clone().cross(up);
  const screenDir = ([x, y]: [number, number]) =>
    view
      .clone()
      .addScaledVector(right, Math.tan(THREE.MathUtils.degToRad(x)))
      .addScaledVector(up, Math.tan(THREE.MathUtils.degToRad(y)))
      .normalize();

  const [a, b] = SKY_ANCHORS;
  const cel = basisFrom(centroidOf(a.name), centroidOf(b.name));
  const world = basisFrom(screenDir(a.screen), screenDir(b.screen));
  // R maps the celestial basis onto the world basis: R = world * cel^T
  return new THREE.Quaternion().setFromRotationMatrix(world.multiply(cel.transpose()));
}

// --- Milky Way: galactic-coordinate texture mapped onto the real sky --------
const milkyWayVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const milkyWayFragment = /* glsl */ `
uniform sampler2D map;
uniform mat3 worldToCelestial;
uniform vec3 tint;
varying vec3 vDir;
const float PI = 3.141592653589793;
// ICRS equatorial -> galactic rotation (IAU)
const mat3 EQ_TO_GAL = mat3(
  -0.0548755604, 0.4941094279, -0.8676661490,
  -0.8734370902, -0.4448296300, -0.1980763734,
  -0.4838350155, 0.7469822445, 0.4559837762
);
void main() {
  vec3 c = worldToCelestial * normalize(vDir);
  vec3 icrs = vec3(c.x, -c.z, c.y);
  vec3 g = EQ_TO_GAL * icrs;
  float l = atan(g.y, g.x);
  float b = asin(clamp(g.z, -1.0, 1.0));
  // The texture has galactic longitude increasing to the left with the
  // galactic centre in the middle, and latitude flipped (south at the top).
  float u = fract(0.5 - l / (2.0 * PI));
  float v = 0.5 - b / PI;
  vec3 col = texture2D(map, vec2(u, v)).rgb * tint;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

// --- Round, soft star points with per-star size and brightness -------------
const starVertex = /* glsl */ `
attribute float size;
attribute float brightness;
uniform float pixelRatio;
varying float vBrightness;
void main() {
  vBrightness = brightness;
  gl_PointSize = size * pixelRatio;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const starFragment = /* glsl */ `
uniform vec3 color;
uniform float opacity;
varying float vBrightness;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d);
  a = a * a * vBrightness * opacity;
  gl_FragColor = vec4(color * a, a);
  #include <colorspace_fragment>
}
`;

function makeStarMaterial(pixelRatio: number, color = '#f4f6ff', opacity = 1) {
  return new THREE.ShaderMaterial({
    uniforms: {
      pixelRatio: { value: pixelRatio },
      color: { value: new THREE.Color(color) },
      opacity: { value: opacity },
    },
    vertexShader: starVertex,
    fragmentShader: starFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

// --- Constellation figures --------------------------------------------------
interface BuiltConstellation {
  name: string;
  points: THREE.Vector3[];
  starGeo: THREE.BufferGeometry;
  lineGeo: THREE.BufferGeometry;
  labelPos: THREE.Vector3;
}

function buildConstellation(c: Constellation, sky: THREE.Quaternion): BuiltConstellation {
  const keys = Object.keys(c.stars);
  const r = STAR_RADIUS * 0.98;
  const points = keys.map((k) => raDecToVec(c.stars[k][0], c.stars[k][1]).applyQuaternion(sky).multiplyScalar(r));
  const index = Object.fromEntries(keys.map((k, i) => [k, i]));

  const starGeo = new THREE.BufferGeometry().setFromPoints(points);
  const mags = keys.map((k) => c.stars[k][2]);
  starGeo.setAttribute('size', new THREE.Float32BufferAttribute(mags.map((m) => Math.max(5.5 - m * 0.9, 2.2)), 1));
  starGeo.setAttribute('brightness', new THREE.Float32BufferAttribute(mags.map((m) => 0.95 - m * 0.14), 1));

  const segs: THREE.Vector3[] = [];
  for (const [a, b] of c.lines) segs.push(points[index[a]], points[index[b]]);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(segs);

  // Label just below the figure's lowest star (in screen-ish terms: toward -y)
  const centroid = points.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(points.length);
  const labelPos = centroid.normalize().multiplyScalar(r);

  return { name: c.name, points, starGeo, lineGeo, labelPos };
}

const BASE_LINE = 0.07;
const BASE_STAR = 0.45;

function ConstellationFigure({
  data,
  pixelRatio,
  mouseOver,
}: {
  data: BuiltConstellation;
  pixelRatio: number;
  /** True while a real mouse is over the canvas (null on touch screens) */
  mouseOver: MutableRefObject<boolean> | null;
}) {
  const glow = useRef(0);
  const [hot, setHot] = useState(false);
  const lineMat = useMemo(
    () =>
      new THREE.LineDashedMaterial({
        color: '#a9bcff',
        transparent: true,
        opacity: BASE_LINE,
        dashSize: 2.6,
        gapSize: 3.4,
        depthWrite: false,
      }),
    [],
  );
  const starMat = useMemo(() => makeStarMaterial(pixelRatio, '#e6ebff', BASE_STAR), [pixelRatio]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, pointer, size }, dt) => {
    if (!mouseOver) return; // phones: static and faint
    let target = 0;
    if (mouseOver.current) {
      // Distance in pixels from the mouse to the nearest star of the figure
      let min = Infinity;
      for (const p of data.points) {
        tmp.copy(p).project(camera);
        if (tmp.z > 1) continue;
        const dx = ((tmp.x - pointer.x) * size.width) / 2;
        const dy = ((tmp.y - pointer.y) * size.height) / 2;
        min = Math.min(min, Math.hypot(dx, dy));
      }
      target = THREE.MathUtils.clamp(1 - (min - 30) / 110, 0, 1);
    }
    glow.current = THREE.MathUtils.lerp(glow.current, target, 1 - Math.exp(-dt * 3));
    lineMat.opacity = BASE_LINE + glow.current * 0.16;
    starMat.uniforms.opacity.value = BASE_STAR + glow.current * 0.3;
    const isHot = glow.current > 0.55;
    if (isHot !== hot) setHot(isHot);
  });

  return (
    <group>
      <lineSegments
        geometry={data.lineGeo}
        material={lineMat}
        ref={(l) => {
          l?.computeLineDistances();
        }}
      />
      <points geometry={data.starGeo} material={starMat} />
      {hot && (
        <Html position={data.labelPos} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <span className="constellation-label whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.35em] text-indigo-100/55">
            {data.name}
          </span>
        </Html>
      )}
    </group>
  );
}

interface StarSkyProps {
  starCount: number;
  pixelRatio: number;
  interactive: boolean;
}

export default function StarSky({ starCount, pixelRatio, interactive }: StarSkyProps) {
  const milkyWay = useTexture('/textures/milky_way.jpg', (t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
    // No mipmaps: avoids a visible seam where the longitude wraps around
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
  });

  const sky = useMemo(skyRotation, []);

  const milkyWayMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: milkyWay },
          worldToCelestial: { value: new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(sky.clone().invert())) },
          tint: { value: new THREE.Color('#5a6078') },
        },
        vertexShader: milkyWayVertex,
        fragmentShader: milkyWayFragment,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [milkyWay, sky],
  );

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const bright = new Float32Array(starCount);
    const v = new THREE.Vector3();
    for (let i = 0; i < starCount; i++) {
      v.randomDirection().multiplyScalar(STAR_RADIUS);
      positions.set([v.x, v.y, v.z], i * 3);
      const r = Math.random();
      sizes[i] = r > 0.985 ? 4.5 : r > 0.9 ? 3 : 2;
      bright[i] = 0.25 + Math.random() * Math.random() * 0.75;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('brightness', new THREE.BufferAttribute(bright, 1));
    return { geometry: geo, material: makeStarMaterial(pixelRatio) };
  }, [starCount, pixelRatio]);

  const constellations = useMemo(() => CONSTELLATIONS.map((c) => buildConstellation(c, sky)), [sky]);

  // Only react to a real mouse that is over the scene (not touch, and not
  // a stale pointer position left behind after clicking an HTML button).
  const canvas = useThree((s) => s.gl.domElement);
  const mouseOver = useRef(false);
  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      mouseOver.current = e.pointerType === 'mouse' && e.target === canvas;
    };
    const onLeave = () => {
      mouseOver.current = false;
    };
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [interactive, canvas]);

  return (
    <group>
      <mesh material={milkyWayMat}>
        <sphereGeometry args={[SKY_RADIUS, 64, 32]} />
      </mesh>
      <points geometry={geometry} material={material} />
      {constellations.map((c) => (
        <ConstellationFigure key={c.name} data={c} pixelRatio={pixelRatio} mouseOver={interactive ? mouseOver : null} />
      ))}
    </group>
  );
}
