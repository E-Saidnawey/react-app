import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '../../data/projects';

const atmosphereVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosW = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const atmosphereFragment = /* glsl */ `
uniform vec3 color;
uniform float intensity;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  vec3 L = normalize(-vPosW);                 // the sun sits at the origin
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);
  float lit = smoothstep(-0.3, 0.6, dot(N, L)); // no glow on the night side
  float a = rim * lit * intensity;
  gl_FragColor = vec4(color * a, a);
  #include <colorspace_fragment>
}
`;

interface PlanetProps {
  project: Project;
  /** Multiplier for planet size (larger on phones for tapping) */
  scale: number;
  /** Multiplier for orbit radius (tighter on phones) */
  orbitScale: number;
  /** Shared orbit clock in seconds; only advances while orbits run */
  clock: MutableRefObject<number>;
  spin: boolean;
  hovered: boolean;
  selected: boolean;
  showLabel: boolean;
  register: (id: string, obj: THREE.Object3D | null) => void;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export default function Planet({
  project,
  scale,
  orbitScale,
  clock,
  spin,
  hovered,
  selected,
  showLabel,
  register,
  onHover,
  onSelect,
}: PlanetProps) {
  const { planet } = project;
  const radius = planet.size * scale;

  const map = useTexture(planet.texture, (t) => {
    (t as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
  });
  const ringMap = useTexture('/textures/saturn_ring_alpha.png', (t) => {
    (t as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
  });

  const orbitGroup = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const scaleGroup = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);

  const atmosphere = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color(planet.atmosphere) }, intensity: { value: 0.9 } },
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [planet.atmosphere],
  );

  // Ring geometry with UVs remapped so the strip texture runs from the
  // inner edge (u = 0) to the outer edge (u = 1).
  const ringGeometry = useMemo(() => {
    if (!planet.ring) return null;
    const inner = radius * 1.25;
    const outer = radius * 2.3;
    const geo = new THREE.RingGeometry(inner, outer, 128, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
    }
    return geo;
  }, [planet.ring, radius]);

  useFrame((_, dt) => {
    const angle = planet.startAngle + planet.speed * clock.current;
    orbitGroup.current?.position.set(
      Math.cos(angle) * planet.orbitRadius * orbitScale,
      0,
      -Math.sin(angle) * planet.orbitRadius * orbitScale,
    );
    if (spin && body.current) body.current.rotation.y += dt * 0.15;

    const k = 1 - Math.exp(-dt * 10);
    const active = hovered && !selected;
    if (scaleGroup.current) {
      const s = THREE.MathUtils.lerp(scaleGroup.current.scale.x, active ? 1.07 : 1, k);
      scaleGroup.current.scale.setScalar(s);
    }
    if (material.current) {
      material.current.emissiveIntensity = THREE.MathUtils.lerp(
        material.current.emissiveIntensity,
        active ? 0.14 : 0,
        k,
      );
    }
    atmosphere.uniforms.intensity.value = THREE.MathUtils.lerp(
      atmosphere.uniforms.intensity.value,
      active ? 1.8 : 0.9,
      k,
    );
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 4) return; // that was a drag, not a click
    onSelect(project.id);
  };

  // Generous invisible hit sphere so small planets are easy to tap
  const hitRadius = Math.max(radius * 1.6, radius + 0.9);

  return (
    <group
      ref={(g) => {
        orbitGroup.current = g;
        register(project.id, g);
      }}
    >
      <group ref={scaleGroup}>
        <group rotation={[0, 0, planet.tilt]}>
          <mesh ref={body}>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshStandardMaterial
              ref={material}
              map={map}
              color={planet.tint ?? '#ffffff'}
              roughness={1}
              metalness={0}
              emissive="#ffffff"
              emissiveMap={map}
              emissiveIntensity={0}
            />
          </mesh>
          <mesh material={atmosphere} scale={1.045}>
            <sphereGeometry args={[radius, 48, 48]} />
          </mesh>
          {ringGeometry && (
            <mesh geometry={ringGeometry} rotation={[-Math.PI / 2, 0, 0]}>
              <meshStandardMaterial
                map={ringMap}
                transparent
                side={THREE.DoubleSide}
                roughness={1}
                metalness={0}
                depthWrite={false}
                // Real rings scatter light even at grazing angles; a little
                // self-glow keeps them visible from any orbit position.
                emissive="#ffffff"
                emissiveMap={ringMap}
                emissiveIntensity={0.55}
              />
            </mesh>
          )}
        </group>
      </group>

      <mesh
        // Once focused, shrink the hit area to the planet itself so clicks
        // on the space around it count as "empty space".
        scale={selected ? (radius * 1.02) / (planet.ring ? radius * 2.3 : hitRadius) : 1}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(project.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = '';
        }}
      >
        <sphereGeometry args={[planet.ring ? radius * 2.3 : hitRadius, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      {showLabel && !selected && (
        <Html
          position={[0, radius * (planet.ring ? 1.6 : 1.35) + 0.35, 0]}
          center
          zIndexRange={[10, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <span
            className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide backdrop-blur-sm transition-colors ${
              hovered ? 'border-white/40 bg-black/50 text-white' : 'border-white/10 bg-black/30 text-white/70'
            }`}
          >
            {project.name}
          </span>
        </Html>
      )}
    </group>
  );
}
