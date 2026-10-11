"use client";

/*
 * three.js is imperative: materials and groups are mutated inside useFrame, which is the
 * react-three-fiber pattern.
 */
/* eslint-disable react-hooks/immutability */

import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import * as THREE from "three";
import type { HouseModel, Volume } from "@/data/properties";
import { type ArchMaterials, GLOW, useArchMaterials, worldBox } from "./materials";
import { Prop } from "./props";
import { type SceneState, smoothstep } from "./scene-state";

/*
 * A parametric modernist house. Each level is a glazed room (oak floor, furnished, with a
 * solid back wall and an optional solid core in render or cedar) under an overhanging slab.
 * Levels rise out of the ground on mount (top level first, so the house "arises"), can be
 * pulled apart, and light up from inside at dusk. Units: 1 ≈ 2.45 m.
 */

export const FLOOR_H = 1.35;
const SLAB = 0.18;
const OVER = 0.3;
const MULLION = 0.022;

// Deterministic jitter so curtains and plants sit in the same place on every render.
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export function modelBounds(model: HouseModel) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  const add = (x: number, z: number, w: number, d: number) => {
    minX = Math.min(minX, x - w / 2);
    maxX = Math.max(maxX, x + w / 2);
    minZ = Math.min(minZ, z - d / 2);
    maxZ = Math.max(maxZ, z + d / 2);
  };
  for (const f of model.floors) add(f.x ?? 0, f.z ?? 0, f.w + OVER * 2, f.d + OVER * 2);
  if (model.pool) add(model.pool.x, model.pool.z, model.pool.w + 0.4, model.pool.d + 0.4);
  if (model.stair) {
    const f = model.floors[0];
    const side = model.stair === "left" ? -1 : 1;
    add((f.x ?? 0) + side * (f.w / 2 + OVER + 0.35), f.z ?? 0, 0.7, f.d);
  }
  return { minX, maxX, minZ, maxZ, height: model.floors.length * FLOOR_H };
}

type Bounds = ReturnType<typeof modelBounds>;

function Mesh({ geometry, material, shadows = true, ...props }: { geometry: THREE.BufferGeometry; material: THREE.Material; shadows?: boolean } & React.ComponentProps<"mesh">) {
  return <mesh geometry={geometry} material={material} castShadow={shadows} receiveShadow={shadows} {...props} />;
}

/** Furniture for a glazed room, scaled to the space available. */
function Furnishing({ index, width, depth, clip }: { index: number; width: number; depth: number; clip: THREE.Plane[] }) {
  if (width < 1.2 || depth < 0.9) return null;
  const back = -depth / 2 + 0.42;
  const r = hash(index * 3.1);
  if (index === 0) {
    return (
      <group>
        <Prop name="sofa" clippingPlanes={clip} position={[-width * 0.12, 0, back]} />
        <Prop name="table" clippingPlanes={clip} position={[-width * 0.12, 0, back + 0.62]} scale={0.9} />
        <Prop name="lounge" clippingPlanes={clip} position={[width * 0.22, 0, back + 0.55]} rotation={[0, -0.7, 0]} />
        <Prop name="plant" clippingPlanes={clip} position={[-width / 2 + 0.22, 0, back - 0.05]} scale={1.3} />
      </group>
    );
  }
  return (
    <group>
      <Prop name="lounge" clippingPlanes={clip} position={[width * (r - 0.5) * 0.5, 0, back + 0.4]} rotation={[0, (r - 0.5) * 1.2, 0]} />
      <Prop name="plant" clippingPlanes={clip} position={[width / 2 - 0.25, 0, back - 0.05]} scale={1.2} />
    </group>
  );
}

function Level({ f, index, above, materials, timber, light }: {
  f: Volume;
  index: number;
  above?: Volume;
  materials: ArchMaterials;
  timber?: boolean;
  light: THREE.MeshStandardMaterial;
}) {
  const h = FLOOR_H - SLAB;
  const core = f.core ?? 0;
  const cw = Math.abs(core) * f.w;
  const coreSide = Math.sign(core) || 1;
  const gw = f.w - cw;
  const gx = -coreSide * (cw / 2);
  const gd = f.d - 0.3;

  const geo = useMemo(() => {
    const n = Math.max(2, Math.round(gw / 0.75));
    return {
      plinth: worldBox(f.w + OVER * 2 + 0.1, 0.1, f.d + OVER * 2 + 0.1, 1.2),
      floor: worldBox(gw - 0.04, 0.03, gd - 0.04, 0.9),
      backWall: worldBox(gw - 0.04, h - 0.02, 0.05, 1),
      paneFront: new THREE.BoxGeometry(gw, h, 0.012),
      paneSide: new THREE.BoxGeometry(0.012, h, gd * 0.55),
      mullion: new THREE.BoxGeometry(MULLION, h, MULLION * 1.6),
      rail: new THREE.BoxGeometry(gw, MULLION * 1.4, MULLION * 2),
      mullionsX: Array.from({ length: n - 1 }, (_, i) => gx - gw / 2 + ((i + 1) * gw) / n),
      core: cw > 0 ? worldBox(cw, h, f.d - 0.1, timber ? 0.6 : 1.2) : null,
      slab: worldBox(f.w + OVER * 2, SLAB, f.d + OVER * 2, 1.2),
      lightStrip: new THREE.BoxGeometry(gw * 0.7, 0.012, 0.05),
      railFront: new THREE.BoxGeometry(f.w + OVER * 2 - 0.06, 0.34, 0.016),
      railSide: new THREE.BoxGeometry(0.016, 0.34, f.d + OVER * 2 - 0.06),
      shoeFront: new THREE.BoxGeometry(f.w + OVER * 2 - 0.06, 0.03, 0.04),
      shoeSide: new THREE.BoxGeometry(0.04, 0.03, f.d + OVER * 2 - 0.06),
      curtain: new THREE.PlaneGeometry(1, h - 0.06),
      curtains: Array.from({ length: Math.max(1, Math.round(gw / 1.8)) }, (_, i) => {
        const count = Math.max(1, Math.round(gw / 1.8));
        const r = hash(index * 13 + i);
        const width = 0.3 + r * 0.45;
        const x = gx - gw / 2 + ((i + 0.5) * gw) / count + (r - 0.5) * 0.4;
        return { x: THREE.MathUtils.clamp(x, gx - gw / 2 + width / 2, gx + gw / 2 - width / 2), width };
      }),
    };
  }, [f.w, f.d, gw, gx, gd, h, cw, timber, index]);

  // A glass balustrade where this level's roof is open to the sky.
  const openRoof = !above || above.w < f.w - 0.6 || above.d < f.d - 0.6;
  const y = h / 2 + 0.03;

  return (
    <group>
      {index === 0 && <Mesh geometry={geo.plinth} material={materials.plaster} position={[0, 0.05, 0]} />}

      {/* the room */}
      <Mesh geometry={geo.floor} material={materials.oak} position={[gx, 0.015, 0]} />
      <Mesh geometry={geo.backWall} material={materials.wall} position={[gx, y, -gd / 2 + 0.06]} />
      <group position={[gx, 0.03, 0]}>
        <Furnishing index={index} width={gw} depth={gd} clip={materials.clippingPlanes} />
      </group>
      <mesh geometry={geo.lightStrip} material={light} position={[gx, h + 0.02, -gd * 0.1]} />
      {geo.curtains.map((c, i) => (
        <mesh key={i} geometry={geo.curtain} material={materials.curtain} position={[c.x, y, gd / 2 - 0.06]} scale={[c.width, 1, 1]} />
      ))}

      {/* glazing: frameless panes with slim aluminium mullions */}
      <mesh geometry={geo.paneFront} material={materials.glass} position={[gx, y, gd / 2]} />
      <mesh geometry={geo.paneSide} material={materials.glass} position={[gx - gw / 2, y, gd * 0.2]} />
      <mesh geometry={geo.paneSide} material={materials.glass} position={[gx + gw / 2, y, gd * 0.2]} />
      {geo.mullionsX.map((x, i) => (
        <Mesh key={i} geometry={geo.mullion} material={materials.frame} position={[x, y, gd / 2 + 0.004]} />
      ))}
      <Mesh geometry={geo.rail} material={materials.frame} position={[gx, 0.04, gd / 2]} />
      <Mesh geometry={geo.rail} material={materials.frame} position={[gx, h + 0.01, gd / 2]} />

      {geo.core && <Mesh geometry={geo.core} material={timber ? materials.timber : materials.plaster} position={[coreSide * (f.w / 2 - cw / 2), y, 0]} />}

      <Mesh geometry={geo.slab} material={materials.plaster} position={[0, FLOOR_H - SLAB / 2, 0]} />

      {openRoof && (
        <group position={[0, FLOOR_H, 0]}>
          <mesh geometry={geo.railFront} material={materials.rail} position={[0, 0.2, f.d / 2 + OVER - 0.04]} />
          <mesh geometry={geo.railSide} material={materials.rail} position={[f.w / 2 + OVER - 0.04, 0.2, 0]} />
          <mesh geometry={geo.railSide} material={materials.rail} position={[-(f.w / 2 + OVER - 0.04), 0.2, 0]} />
          <Mesh geometry={geo.shoeFront} material={materials.frame} position={[0, 0.015, f.d / 2 + OVER - 0.04]} />
          <Mesh geometry={geo.shoeSide} material={materials.frame} position={[f.w / 2 + OVER - 0.04, 0.015, 0]} />
          <Mesh geometry={geo.shoeSide} material={materials.frame} position={[-(f.w / 2 + OVER - 0.04), 0.015, 0]} />
          {!above && index > 0 && <Prop name="plant" clippingPlanes={materials.clippingPlanes} position={[f.w / 2 - 0.1, 0, f.d / 2 + 0.05]} scale={1.4} />}
        </group>
      )}
    </group>
  );
}

function Stair({ f, side, materials }: { f: Volume; side: number; materials: ArchMaterials }) {
  const steps = 10;
  const run = (f.d + OVER) / steps;
  const geo = useMemo(
    () => ({
      step: worldBox(0.6, FLOOR_H / steps, run + 0.01, 1),
      rail: new THREE.BoxGeometry(0.016, 0.36, Math.hypot(FLOOR_H, f.d + OVER)),
    }),
    [run, f.d],
  );
  const x = (f.x ?? 0) + side * (f.w / 2 + OVER + 0.32);
  return (
    <group position={[x, 0, f.z ?? 0]}>
      {Array.from({ length: steps }, (_, i) => (
        <Mesh key={i} geometry={geo.step} material={materials.plaster} position={[0, (i + 0.5) * (FLOOR_H / steps), f.d / 2 - (i + 0.5) * run]} />
      ))}
      <mesh geometry={geo.rail} material={materials.rail} position={[side * 0.31, FLOOR_H / 2 + 0.2, 0]} rotation={[Math.atan2(FLOOR_H, f.d + OVER), 0, 0]} />
    </group>
  );
}

/** Tiled terrace with the pool cut into it, a tiled basin and a rippled water surface. */
function Terrace({ model, bounds, materials }: { model: HouseModel; bounds: Bounds; materials: ArchMaterials }) {
  const pool = model.pool;
  const deck = useMemo(() => {
    const minX = bounds.minX - 0.7;
    const maxX = bounds.maxX + 0.7;
    const minZ = bounds.minZ - 0.7;
    const maxZ = bounds.maxZ + 0.7;
    // The shape is drawn in (x, -z) so that laying it flat maps its y back onto world z.
    const shape = new THREE.Shape();
    shape.moveTo(minX, -maxZ);
    shape.lineTo(maxX, -maxZ);
    shape.lineTo(maxX, -minZ);
    shape.lineTo(minX, -minZ);
    shape.closePath();
    if (pool) {
      const hole = new THREE.Path();
      hole.moveTo(pool.x - pool.w / 2, -(pool.z + pool.d / 2));
      hole.lineTo(pool.x - pool.w / 2, -(pool.z - pool.d / 2));
      hole.lineTo(pool.x + pool.w / 2, -(pool.z - pool.d / 2));
      hole.lineTo(pool.x + pool.w / 2, -(pool.z + pool.d / 2));
      hole.closePath();
      shape.holes.push(hole);
    }
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 0.9, uv.getY(i) / 0.9);

    // The lawn has the terrace cut out of it, so it never covers the pool basin.
    const lawnShape = new THREE.Shape();
    lawnShape.absarc(0, 0, 60, 0, Math.PI * 2, false);
    const cut = new THREE.Path();
    cut.moveTo(minX + 0.02, -(maxZ - 0.02));
    cut.lineTo(minX + 0.02, -(minZ + 0.02));
    cut.lineTo(maxX - 0.02, -(minZ + 0.02));
    cut.lineTo(maxX - 0.02, -(maxZ - 0.02));
    cut.closePath();
    lawnShape.holes.push(cut);
    const lawn = new THREE.ShapeGeometry(lawnShape, 48);
    lawn.rotateX(-Math.PI / 2);
    const luv = lawn.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < luv.count; i++) luv.setXY(i, luv.getX(i) / 2.5, luv.getY(i) / 2.5);
    return { deck: g, lawn };
  }, [bounds, pool]);

  useFrame((_, delta) => {
    const map = materials.water.normalMap;
    if (map) {
      map.offset.x += delta * 0.012;
      map.offset.y += delta * 0.007;
    }
  });

  const depth = 0.5;
  return (
    <group>
      <mesh geometry={deck.deck} material={materials.deck} position={[0, -0.16, 0]} receiveShadow castShadow />
      <mesh geometry={deck.lawn} material={materials.lawn} position={[0, -0.16, 0]} receiveShadow />
      {pool && (
        <group position={[pool.x, 0, pool.z]}>
          <mesh material={materials.poolTile} position={[0, -depth, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[pool.w, pool.d]} />
          </mesh>
          {(
            [
              [0, -pool.d / 2, pool.w, 0],
              [0, pool.d / 2, pool.w, Math.PI],
              [-pool.w / 2, 0, pool.d, Math.PI / 2],
              [pool.w / 2, 0, pool.d, -Math.PI / 2],
            ] as const
          ).map(([x, z, len, rot], i) => (
            <mesh key={i} material={materials.poolTile} position={[x, -depth / 2, z]} rotation={[0, rot, 0]} receiveShadow>
              <planeGeometry args={[len, depth]} />
            </mesh>
          ))}
          <mesh material={materials.water} position={[0, -0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[pool.w, pool.d]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** Shrubs planted along the front and sides of the terrace. */
function Planting({ bounds }: { bounds: Bounds }) {
  const spots = useMemo(() => {
    const out: { x: number; z: number; r: number; s: number }[] = [];
    const front = bounds.maxZ + 1.1;
    for (let i = 0; i < 3; i++) {
      const r = hash(i * 9.7 + bounds.maxX);
      out.push({ x: bounds.minX + ((i + 0.5) / 3) * (bounds.maxX - bounds.minX) + (r - 0.5), z: front + r * 0.3, r: r * 6, s: 0.4 + r * 0.2 });
    }
    out.push({ x: bounds.minX - 1, z: bounds.minZ + 0.6, r: 1.3, s: 0.5 });
    out.push({ x: bounds.maxX + 1, z: bounds.minZ + 1.2, r: 4.2, s: 0.45 });
    return out;
  }, [bounds]);
  return (
    <>
      {spots.map((p, i) => (
        <Prop key={i} name="shrub" position={[p.x, -0.16, p.z]} rotation={[0, p.r, 0]} scale={p.s} />
      ))}
    </>
  );
}

export function Villa({ model, state, clip = true, ground = true }: {
  model: HouseModel;
  state: RefObject<SceneState>;
  /** hide geometry below ground level, used by the rise animation */
  clip?: boolean;
  ground?: boolean;
}) {
  const materials = useArchMaterials(clip);
  const n = model.floors.length;
  // One ceiling-light material per level, so a level can be lit on its own.
  const lights = useMemo(
    () =>
      model.floors.map(
        () => new THREE.MeshStandardMaterial({ color: "#fff4e2", emissive: GLOW, emissiveIntensity: 0, roughness: 1, clippingPlanes: materials.clippingPlanes }),
      ),
    [model.floors, materials.clippingPlanes],
  );
  const lamps = useRef<(THREE.PointLight | null)[]>([]);
  const levelRefs = useRef<(THREE.Group | null)[]>([]);
  const extrasRef = useRef<THREE.Group>(null);
  // Accumulate clamped frame time rather than reading the clock, so a scene that was paused
  // off screen starts its entrance when it is first seen instead of skipping it.
  const elapsedRef = useRef(0);
  const explode = useRef(state.current?.explode ?? 0);
  const lift = useRef<number[]>(model.floors.map(() => 0));
  const bounds = useMemo(() => modelBounds(model), [model]);

  useFrame((_, delta) => {
    const s = state.current;
    if (!s) return;
    const dt = Math.min(delta, 0.05);
    elapsedRef.current += Math.min(delta, 0.1);
    const elapsed = s.rise ? elapsedRef.current : 99;

    explode.current = THREE.MathUtils.damp(explode.current, s.explode, 6, dt);
    const dusk = smoothstep(0.42, 1, s.time);
    const riseDist = bounds.height + 0.6;

    let moved = false;
    for (let i = 0; i < n; i++) {
      const g = levelRefs.current[i];
      if (!g) continue;
      // Top level surfaces first; each lower level then pushes the stack up into place.
      const delay = 0.15 + (n - 1 - i) * 0.17;
      const p = smoothstep(0, 1, (elapsed - delay) / 1.25);
      const eased = 1 - Math.pow(1 - p, 3);
      lift.current[i] = THREE.MathUtils.damp(lift.current[i], s.highlight === i ? 1 : 0, 8, dt);
      const y = i * FLOOR_H + explode.current * i * 1.15 + lift.current[i] * 0.18 * explode.current - (1 - eased) * riseDist;
      if (Math.abs(y - g.position.y) > 1e-4) moved = true;
      g.position.y = y;

      const unit = model.unit === i ? 0.6 : 0;
      const dim = s.highlight >= 0 && s.highlight !== i ? 0.3 : 1;
      const glow = Math.max(dusk * dim, unit, lift.current[i] * 0.9);
      lights[i].emissiveIntensity = glow * 7;
      const lamp = lamps.current[i];
      if (lamp) lamp.intensity = glow * 2.2;
    }
    materials.curtain.emissiveIntensity = dusk * 0.55;
    materials.poolTile.emissiveIntensity = dusk * 1.4;

    const extrasP = smoothstep(0, 1, (elapsed - 0.15 - n * 0.17) / 0.8);
    if (extrasRef.current) {
      const y = -(1 - extrasP) * (FLOOR_H + 0.3);
      if (Math.abs(y - extrasRef.current.position.y) > 1e-4) moved = true;
      extrasRef.current.position.y = y;
    }
    if (moved) s.shadowsDirty = true;
  });

  const first = model.floors[0];

  return (
    <group>
      {model.floors.map((f, i) => {
        const core = f.core ?? 0;
        const gx = -(Math.sign(core) || 1) * ((Math.abs(core) * f.w) / 2);
        return (
          <group key={i} ref={(el) => void (levelRefs.current[i] = el)} position={[f.x ?? 0, i * FLOOR_H, f.z ?? 0]}>
            <Level f={f} index={i} above={model.floors[i + 1]} materials={materials} timber={model.timber} light={lights[i]} />
            <pointLight ref={(el) => void (lamps.current[i] = el)} position={[gx, FLOOR_H * 0.62, 0.15]} color="#ffbe7a" intensity={0} distance={4.5} decay={2} />
          </group>
        );
      })}

      <group ref={extrasRef}>{model.stair && <Stair f={first} side={model.stair === "left" ? -1 : 1} materials={materials} />}</group>

      {ground && (
        <>
          <Terrace model={model} bounds={bounds} materials={materials} />
          <Planting bounds={bounds} />
          {model.trees?.map(([x, z, s], i) => (
            <Prop key={i} name="tree" position={[x * 1.15, -0.16, z * 1.15]} rotation={[0, hash(x * 7 + z * 3) * Math.PI * 2, 0]} scale={0.75 + s * 0.45} />
          ))}
        </>
      )}
    </group>
  );
}
