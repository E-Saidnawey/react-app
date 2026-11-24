import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Project } from '../../data/projects';

type Mode = 'idle' | 'flying-in' | 'focused' | 'flying-out';

interface CameraRigProps {
  selected: Project | null;
  planetScale: number;
  planets: MutableRefObject<Map<string, THREE.Object3D>>;
  /** Default camera distance that frames the whole system */
  homeDistance: number;
  instant: boolean;
  /** 'side' leaves room for a panel on the right; 'bottom' for a bottom sheet */
  panelDock: 'side' | 'bottom';
}

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Flies the camera to the selected planet and back. While a planet is
 * selected OrbitControls are disabled so dragging doesn't move the view.
 */
export default function CameraRig({ selected, planetScale, planets, homeDistance, instant, panelDock }: CameraRigProps) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const size = useThree((s) => s.size);

  const mode = useRef<Mode>('idle');
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const savedPos = useMemo(() => new THREE.Vector3(), []);
  const savedTarget = useMemo(() => new THREE.Vector3(), []);
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const goalTarget = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(
    () => ({ p: new THREE.Vector3(), radial: new THREE.Vector3(), tangent: new THREE.Vector3(), dir: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3() }),
    [],
  );

  // Keep the whole system framed when the window is resized
  const lastHome = useRef(homeDistance);
  useEffect(() => {
    if (!controls) return;
    controls.minDistance = homeDistance * 0.45;
    controls.maxDistance = homeDistance * 1.25;
    if (mode.current === 'idle') {
      const ratio = homeDistance / lastHome.current;
      camera.position.sub(controls.target).multiplyScalar(ratio).add(controls.target);
      controls.update();
    } else {
      savedPos.sub(savedTarget).multiplyScalar(homeDistance / lastHome.current).add(savedTarget);
    }
    lastHome.current = homeDistance;
  }, [homeDistance, controls, camera, savedPos, savedTarget]);

  useEffect(() => {
    if (!controls) return;
    if (selected) {
      if (mode.current === 'idle') {
        savedPos.copy(camera.position);
        savedTarget.copy(controls.target);
        lookAt.copy(controls.target);
      }
      controls.enabled = false;
      mode.current = 'flying-in';
    } else if (mode.current !== 'idle') {
      goalPos.copy(savedPos);
      goalTarget.copy(savedTarget);
      mode.current = 'flying-out';
    }
  }, [selected, controls, camera, lookAt, savedPos, savedTarget, goalPos, goalTarget]);

  useFrame((_, dt) => {
    if (!controls || mode.current === 'idle') return;

    if (selected) {
      const obj = planets.current.get(selected.id);
      if (!obj) return;
      const { p, radial, tangent, dir, fwd, right, up } = tmp;
      obj.getWorldPosition(p);

      // Come in from the sun's side (and a little above and ahead) so the
      // lit hemisphere faces the camera, while staying clear of the sun.
      radial.copy(p).setY(0).normalize();
      tangent.crossVectors(UP, radial).normalize();
      dir.copy(radial).multiplyScalar(-0.5).addScaledVector(UP, 0.45).addScaledVector(tangent, 0.75).normalize();

      const r = selected.planet.size * planetScale * (selected.planet.ring ? 1.9 : 1);
      const aspect = size.width / size.height;
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const fill = panelDock === 'bottom' ? 0.62 : 0.4; // planet diameter / visible span
      const dist = r / (fill * tanHalf * Math.min(aspect, 1));

      goalPos.copy(p).addScaledVector(dir, dist);

      // Shift the aim so the planet sits beside (or above) the info panel
      fwd.copy(p).sub(goalPos).normalize();
      right.crossVectors(fwd, UP).normalize();
      up.crossVectors(right, fwd).normalize();
      goalTarget.copy(p);
      if (panelDock === 'side') {
        goalTarget.addScaledVector(right, dist * tanHalf * aspect * 0.38);
      } else {
        goalTarget.addScaledVector(up, -dist * tanHalf * 0.42);
      }
    }

    const k = instant ? 1 : 1 - Math.exp(-dt * 2.6);
    camera.position.lerp(goalPos, k);
    lookAt.lerp(goalTarget, k);
    camera.lookAt(lookAt);

    const arrived = camera.position.distanceTo(goalPos) < 0.03 && lookAt.distanceTo(goalTarget) < 0.03;
    if (mode.current === 'flying-in' && arrived) mode.current = 'focused';
    if (mode.current === 'flying-out' && arrived) {
      camera.position.copy(goalPos);
      controls.target.copy(goalTarget);
      controls.enabled = true;
      controls.update();
      mode.current = 'idle';
    }
  });

  return null;
}
