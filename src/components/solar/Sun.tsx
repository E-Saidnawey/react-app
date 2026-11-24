import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { noiseGLSL } from './noise';

export const SUN_RADIUS = 2.4;

const surfaceVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vObjPos;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vUv = uv;
  vObjPos = position;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosW = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const surfaceFragment = /* glsl */ `
uniform sampler2D map;
uniform float time;
varying vec2 vUv;
varying vec3 vObjPos;
varying vec3 vNormalW;
varying vec3 vPosW;
${noiseGLSL}
void main() {
  vec3 p = normalize(vObjPos);
  // churning granulation: two noise layers drifting at different rates
  float n1 = fbm(p * 3.0 + vec3(0.0, time * 0.05, time * 0.03));
  float n2 = fbm(p * 9.0 - vec3(time * 0.08, 0.0, time * 0.06));
  vec2 warp = vec2(n1, n2) * 0.012;
  vec3 tex = texture2D(map, vUv + warp).rgb;
  float heat = 0.75 + 0.35 * n1 + 0.2 * n2;
  vec3 col = tex * heat * vec3(2.6, 1.9, 1.25);
  // limb darkening: the edge of a real star looks dimmer and redder
  vec3 V = normalize(cameraPosition - vPosW);
  float mu = clamp(dot(normalize(vNormalW), V), 0.0, 1.0);
  col *= mix(vec3(0.55, 0.35, 0.2), vec3(1.0), pow(mu, 0.45));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

const coronaFragment = /* glsl */ `
uniform float time;
uniform float sunEdge;
varying vec2 vUv;
${noiseGLSL}
void main() {
  vec2 c = vUv - 0.5;
  float d = length(c) * 2.0;           // 0 at centre, 1 at quad edge
  float r = max(d - sunEdge, 0.0);     // distance outside the photosphere
  vec2 dir = c / max(length(c), 1e-4);
  // streamers: noise sampled around the circle so there is no seam
  float rays = fbm(vec3(dir * 2.2, time * 0.04)) * 0.5 + 0.5;
  // tight inner glow plus faint streamers, both falling off quickly
  float glow = exp(-r * 16.0) * 0.85 + exp(-r * 6.0) * 0.22 * rays;
  glow *= smoothstep(1.0, 0.7, d);
  vec3 col = mix(vec3(1.0, 0.45, 0.12), vec3(1.0, 0.85, 0.55), exp(-r * 10.0));
  gl_FragColor = vec4(col * glow * 1.3, glow);
  #include <colorspace_fragment>
}
`;

const quadVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

interface SunProps {
  animate: boolean;
}

export default function Sun({ animate }: SunProps) {
  const map = useTexture('/textures/sun.jpg', (t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
  });
  const surface = useRef<THREE.Mesh>(null);
  const coronaSize = SUN_RADIUS * 4.2;

  const surfaceMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { map: { value: map }, time: { value: 0 } },
        vertexShader: surfaceVertex,
        fragmentShader: surfaceFragment,
        toneMapped: false,
      }),
    [map],
  );

  const coronaMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, sunEdge: { value: (SUN_RADIUS * 2) / coronaSize } },
        vertexShader: quadVertex,
        fragmentShader: coronaFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [coronaSize],
  );

  useFrame((_, dt) => {
    if (!animate) return;
    surfaceMat.uniforms.time.value += dt;
    coronaMat.uniforms.time.value += dt;
    if (surface.current) surface.current.rotation.y += dt * 0.02;
  });

  return (
    <group>
      <mesh ref={surface} material={surfaceMat}>
        <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
      </mesh>
      <Billboard>
        <mesh material={coronaMat} renderOrder={-1}>
          <planeGeometry args={[coronaSize, coronaSize]} />
        </mesh>
      </Billboard>
      {/* The sun is the only real light: planets get a lit and a dark side. */}
      <pointLight position={[0, 0, 0]} intensity={3.4} decay={0} color="#fff2df" />
      <ambientLight intensity={0.03} />
    </group>
  );
}
