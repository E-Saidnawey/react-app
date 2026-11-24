import { Suspense, useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import * as THREE from 'three';
import { projects, type Project } from '../../data/projects';
import Sun from './Sun';
import Planet from './Planet';
import StarSky from './StarSky';
import CameraRig from './CameraRig';

export interface SolarSystemProps {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onReady: () => void;
  reducedMotion: boolean;
  /** Phone-sized or touch screen: lighter rendering and bigger planets */
  compact: boolean;
}

const FOV = 45;
const ELEVATION = THREE.MathUtils.degToRad(34); // default viewing angle above the orbital plane
/** Radius of the outermost orbit plus its planet (and ring). */
function systemRadius(orbitScale: number, planetScale: number) {
  return (
    Math.max(
      ...projects.map(
        (p) => p.planet.orbitRadius * orbitScale + p.planet.size * planetScale * (p.planet.ring ? 2.3 : 1),
      ),
    ) + 0.6
  );
}

/** Camera distance that fits every orbit on screen for this aspect ratio. */
function homeDistanceFor(aspect: number, elevation: number, radius: number) {
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const fitWidth = radius / (tanHalf * aspect);
  const fitHeight = (radius * Math.sin(elevation) + 2) / tanHalf;
  return Math.max(fitWidth, fitHeight) * 1.08;
}

function OrbitPath({ radius, active, dimmed }: { radius: number; active: boolean; dimmed: boolean }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 256; i++) {
      const a = (i / 256) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);
  return <Line points={points} color="#c7d2fe" lineWidth={1} transparent opacity={dimmed ? 0.04 : active ? 0.35 : 0.12} depthWrite={false} />;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

/** Advances the shared orbit clock only while orbits are running. */
function OrbitClock({ clock, running }: { clock: MutableRefObject<number>; running: boolean }) {
  useFrame((_, dt) => {
    if (running) clock.current += Math.min(dt, 0.1);
  });
  return null;
}

function Scene({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  onReady,
  reducedMotion,
  compact,
}: SolarSystemProps) {
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const clock = useRef(0);
  const planets = useRef(new Map<string, THREE.Object3D>());
  const register = useCallback((id: string, obj: THREE.Object3D | null) => {
    if (obj) planets.current.set(id, obj);
    else planets.current.delete(id);
  }, []);

  const aspect = size.width / Math.max(size.height, 1);
  const portrait = aspect < 0.9;
  const elevation = portrait ? THREE.MathUtils.degToRad(62) : ELEVATION;
  // Phones: bigger planets on tighter orbits so they are easy to tap
  const planetScale = compact ? 1.5 : 1;
  const orbitScale = compact ? 0.8 : 1;
  const homeDistance = homeDistanceFor(aspect, elevation, systemRadius(orbitScale, planetScale));
  const selected: Project | null = projects.find((p) => p.id === selectedId) ?? null;

  // Initial framing (done once; resize is handled by CameraRig)
  const camera = useThree((s) => s.camera);
  const framed = useRef(false);
  if (!framed.current) {
    camera.position.set(0, Math.sin(elevation) * homeDistance, Math.cos(elevation) * homeDistance);
    camera.lookAt(0, 0, 0);
    framed.current = true;
  }

  return (
    <>
      <OrbitClock clock={clock} running={!reducedMotion && !selected} />
      <StarSky starCount={compact ? 900 : 2200} pixelRatio={dpr} interactive={!compact} />
      <Sun animate={!reducedMotion} />

      {projects.map((p) => (
        <OrbitPath key={p.id} radius={p.planet.orbitRadius * orbitScale} active={p.id === hoveredId} dimmed={!!selected} />
      ))}
      {projects.map((p) => (
        <Planet
          key={p.id}
          project={p}
          scale={planetScale}
          orbitScale={orbitScale}
          clock={clock}
          spin={!reducedMotion}
          hovered={p.id === hoveredId}
          selected={p.id === selectedId}
          showLabel={compact ? !selected : p.id === hoveredId}
          register={register}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.45}
        zoomSpeed={0.6}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 - 0.06}
      />
      <CameraRig
        selected={selected}
        planetScale={planetScale}
        planets={planets}
        homeDistance={homeDistance}
        instant={reducedMotion}
        panelDock={size.width < 768 ? 'bottom' : 'side'}
      />
      <Ready onReady={onReady} />
    </>
  );
}

export default function SolarSystem(props: SolarSystemProps) {
  const { compact, onSelect } = props;
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={compact ? [1, 1.5] : [1, 2]}
      camera={{ fov: FOV, near: 0.1, far: 2000, position: [0, 20, 30] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => onSelect(null)}
      aria-hidden="true"
    >
      <color attach="background" args={['#000005']} />
      <Suspense fallback={null}>
        <Scene {...props} />
        {!compact && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.7} radius={0.6} />
            <ToneMapping />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
