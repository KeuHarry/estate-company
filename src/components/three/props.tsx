"use client";



import { Clone, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

/*
 * Scanned CC0 models from Poly Haven (furniture and plants), compressed by
 * scripts/fetch-3d-assets.mjs. Models are in metres; the house is built at roughly 1:2.45,
 * so everything is scaled by M.
 */

export const M = 1 / 2.45;

const MODELS = {
  tree: "/3d/models/tree.glb",
  shrub: "/3d/models/shrub.glb",
  plant: "/3d/models/potted-plant.glb",
  sofa: "/3d/models/sofa.glb",
  lounge: "/3d/models/lounge-chair.glb",
  table: "/3d/models/coffee-table.glb",
} as const;

export type PropName = keyof typeof MODELS;

for (const url of Object.values(MODELS)) useGLTF.preload(url);

/** Loads a model once, turns on shadows, and applies the scene's clipping planes. */
function usePropScene(name: PropName, clippingPlanes: THREE.Plane[]) {
  const { scene } = useGLTF(MODELS[name]);
  return useMemo(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        m.clippingPlanes = clippingPlanes;
        if (name === "tree" || name === "shrub") (m as THREE.MeshStandardMaterial).envMapIntensity = 0.6;
      }
    });
    return scene;
  }, [scene, clippingPlanes, name]);
}

export function Prop({
  name,
  clippingPlanes = [],
  scale = 1,
  ...props
}: { name: PropName; clippingPlanes?: THREE.Plane[]; scale?: number } & Omit<React.ComponentProps<"group">, "scale">) {
  const scene = usePropScene(name, clippingPlanes);
  return (
    <group {...props} scale={scale * M}>
      <Clone object={scene} />
    </group>
  );
}
