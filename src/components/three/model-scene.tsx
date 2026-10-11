"use client";

 

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { HouseModel } from "@/data/properties";
import type { SceneState } from "./scene-state";
import { AdaptiveResolution } from "./adaptive-dpr";
import { FrameloopSync } from "./frameloop-sync";
import { Stage } from "./stage";
import { useOnScreen } from "./use-on-screen";
import { FLOOR_H, modelBounds, Villa } from "./villa";

/*
 * A house on a turntable: used for the levels section on the home page and the 3D tour on
 * each listing. With `interactive`, visitors can drag to orbit and pinch or scroll to zoom.
 */

export interface ModelSceneProps {
  state: RefObject<SceneState>;
  model: HouseModel;
  interactive?: boolean;
  autoRotate?: boolean;
}

const UP = new THREE.Vector3(0, 1, 0);

function Rig({ state, model, interactive, autoRotate }: ModelSceneProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const bounds = useMemo(() => modelBounds(model), [model]);
  const focusY = useRef(bounds.height / 2);
  const framed = useRef("");

  const span = Math.max(bounds.maxX - bounds.minX, bounds.maxZ - bounds.minZ, bounds.height * 1.5);

  useFrame((_, delta) => {
    const s = state.current;
    if (!s) return;
    const dt = Math.min(delta, 0.05);
    const height = bounds.height + s.explode * (model.floors.length - 1) * 1.15;
    focusY.current = THREE.MathUtils.damp(focusY.current, height / 2, 4, dt);

    const key = `${size.width}x${size.height}`;
    if (framed.current !== key && size.width > 0 && size.height > 0) {
      // Fit the fully exploded model's bounding sphere to the canvas (on mount and resize);
      // in between, the visitor owns the camera.
      const w = bounds.maxX - bounds.minX;
      const d = bounds.maxZ - bounds.minZ;
      const h = bounds.height + (model.floors.length - 1) * 1.15;
      const radius = 0.5 * Math.sqrt(w * w + d * d + h * h);
      const vFov = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov);
      const aspect = size.width / size.height;
      const fitFov = aspect < 1 ? 2 * Math.atan(Math.tan(vFov / 2) * aspect) : vFov;
      const dist = (radius / Math.sin(fitFov / 2)) * 0.92;
      const dir = new THREE.Vector3(0.62, 0.34, 0.78).normalize();
      camera.position.copy(dir.multiplyScalar(dist)).setY(camera.position.y + FLOOR_H * 0.5);
      framed.current = key;
    }
    if (controls.current) {
      controls.current.target.y = focusY.current;
      controls.current.update();
    } else {
      camera.lookAt(0, focusY.current, 0);
    }
    // Orbit the camera rather than spinning the house: the sun stays put, so shadows don't
    // need redrawing every frame.
    if (!interactive && autoRotate) camera.position.applyAxisAngle(UP, dt * 0.12);
  });

  return (
    <>
      <Suspense fallback={null}>
        <Stage state={state} radius={span} />
        <group position={[-(bounds.maxX + bounds.minX) / 2, 0, -(bounds.maxZ + bounds.minZ) / 2]}>
          <Villa model={model} state={state} />
        </group>
      </Suspense>
      {interactive && (
        <OrbitControls
          ref={controls}
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          minDistance={span * 1.2}
          maxDistance={span * 4}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2 - 0.08}
        />
      )}
    </>
  );
}

export default function ModelScene(props: ModelSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(wrap);
  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        shadows="variance"
        dpr={[1, 1.5]}
        camera={{ fov: 30, near: 0.5, far: 200, position: [12, 9, 15] }}
        // Anti-aliasing and tone mapping happen in the post-processing stack (see Stage).
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
      >
        <FrameloopSync visible={visible} />
        <AdaptiveResolution />
        <Rig {...props} />
      </Canvas>
    </div>
  );
}
