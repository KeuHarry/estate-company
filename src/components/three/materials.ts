"use client";

import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

/*
 * Physically based materials for the house, built from the CC0 texture sets in public/3d/tex
 * (see scripts/fetch-3d-assets.mjs). Geometry uses world-scaled UVs (worldBox below), so one
 * texture repeat equals TILE units on every surface instead of stretching per box.
 */

const tex = (name: string) => `/3d/tex/${name}.webp`;

export const TEXTURE_URLS = {
  plasterN: tex("plaster_normal"),
  plasterR: tex("plaster_rough"),
  cedarC: tex("cedar_color"),
  cedarN: tex("cedar_normal"),
  cedarR: tex("cedar_rough"),
  tilesC: tex("tiles_color"),
  tilesN: tex("tiles_normal"),
  tilesR: tex("tiles_rough"),
  grassC: tex("grass_color"),
  grassN: tex("grass_normal"),
  grassR: tex("grass_rough"),
  oakC: tex("oak_color"),
  oakN: tex("oak_normal"),
};

export const GLOW = new THREE.Color("#ffb46a");
export const POOL_GLOW = new THREE.Color("#3cc8ff");
const GROUND_CLIP = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)];

/** A box whose UVs are in world units / tile, so textures keep a constant scale. */
export function worldBox(w: number, h: number, d: number, tile = 1) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  // Face order: +x, -x, +y, -y, +z, -z; four vertices each.
  const dims: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++) {
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * dims[f][0]) / tile, (uv.getY(i) * dims[f][1]) / tile);
    }
  }
  uv.needsUpdate = true;
  return g;
}

/** Procedural ripple normal map for the pool, so no extra download is needed. */
function rippleNormalMap() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const height = (x: number, y: number) => {
    const u = (x / size) * Math.PI * 2;
    const v = (y / size) * Math.PI * 2;
    return Math.sin(u * 3 + v * 2) * 0.5 + Math.sin(u * 5 - v * 4) * 0.3 + Math.sin(u * 9 + v * 7) * 0.15 + Math.sin(v * 11 - u * 2) * 0.1;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = height(x + 1, y) - height(x - 1, y);
      const dy = height(x, y + 1) - height(x, y - 1);
      const n = new THREE.Vector3(-dx * 2.2, -dy * 2.2, 1).normalize();
      const i = (y * size + x) * 4;
      data[i] = (n.x * 0.5 + 0.5) * 255;
      data[i + 1] = (n.y * 0.5 + 0.5) * 255;
      data[i + 2] = (n.z * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, size, size);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.needsUpdate = true;
  return t;
}

export function useArchMaterials(clip: boolean) {
  const t = useTexture(TEXTURE_URLS);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  return useMemo(() => {
    for (const [key, texture] of Object.entries(t)) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = Math.min(8, maxAniso);
      texture.colorSpace = key.endsWith("C") ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      texture.needsUpdate = true;
    }
    const clippingPlanes = clip ? GROUND_CLIP : [];

    return {
      clippingPlanes,
      // White mineral render: colour from the material, relief and sheen from the scan.
      plaster: new THREE.MeshStandardMaterial({
        color: "#eeece6",
        normalMap: t.plasterN,
        normalScale: new THREE.Vector2(0.35, 0.35),
        roughnessMap: t.plasterR,
        roughness: 0.95,
        clippingPlanes,
      }),
      soffit: new THREE.MeshStandardMaterial({ color: "#e6e3dc", roughness: 0.9, clippingPlanes }),
      timber: new THREE.MeshStandardMaterial({
        map: t.cedarC,
        normalMap: t.cedarN,
        roughnessMap: t.cedarR,
        color: "#d9c2a8",
        clippingPlanes,
      }),
      frame: new THREE.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.38, metalness: 0.75, clippingPlanes }),
      // Architectural glazing reads as a dark mirror of the sky with the room faintly behind it.
      // A transparent reflective pane gives that without a costly transmission pass.
      glass: new THREE.MeshPhysicalMaterial({
        color: "#1c2a31",
        metalness: 0.1,
        roughness: 0.02,
        transparent: true,
        opacity: 0.32,
        specularIntensity: 1,
        envMapIntensity: 2.2,
        depthWrite: false,
        clippingPlanes,
      }),
      rail: new THREE.MeshPhysicalMaterial({
        color: "#a9c3c4",
        metalness: 0.1,
        roughness: 0.02,
        transparent: true,
        opacity: 0.22,
        envMapIntensity: 1.8,
        depthWrite: false,
        clippingPlanes,
      }),
      curtain: new THREE.MeshStandardMaterial({
        color: "#f1ece3",
        roughness: 1,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
        emissive: GLOW,
        emissiveIntensity: 0,
        clippingPlanes,
      }),
      wall: new THREE.MeshStandardMaterial({ color: "#efebe4", roughness: 0.92, clippingPlanes }),
      oak: new THREE.MeshStandardMaterial({ map: t.oakC, normalMap: t.oakN, roughness: 0.55, clippingPlanes }),
      ceilingLight: new THREE.MeshStandardMaterial({ color: "#fff4e2", emissive: GLOW, emissiveIntensity: 0, roughness: 1, clippingPlanes }),
      deck: new THREE.MeshStandardMaterial({ map: t.tilesC, normalMap: t.tilesN, roughnessMap: t.tilesR, color: "#f4f1ea" }),
      coping: new THREE.MeshStandardMaterial({ color: "#efece5", roughness: 0.7 }),
      poolTile: new THREE.MeshStandardMaterial({ color: "#a9cfd6", roughness: 0.4, emissive: POOL_GLOW, emissiveIntensity: 0 }),
      water: new THREE.MeshPhysicalMaterial({
        color: "#2d7f93",
        roughness: 0.03,
        metalness: 0.05,
        transparent: true,
        opacity: 0.5,
        envMapIntensity: 1.6,
        normalMap: rippleNormalMap(),
        normalScale: new THREE.Vector2(0.25, 0.25),
        depthWrite: false,
      }),
      lawn: new THREE.MeshStandardMaterial({ map: t.grassC, normalMap: t.grassN, roughnessMap: t.grassR, color: "#b9cf9f" }),
    };
  }, [t, clip, maxAniso]);
}

export type ArchMaterials = ReturnType<typeof useArchMaterials>;
