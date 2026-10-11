"use client";

/* eslint-disable react-hooks/immutability */

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { HEMI_GROUND, HEMI_SKY, rampColor, SKY_HORIZON, SKY_TOP, SUN_COLOR } from "./color-ramps";
import { ramp, type SceneState, smoothstep } from "./scene-state";

/*
 * Photographic lighting shared by every scene:
 * - a shadow-casting sun with soft, contact-hardening (PCSS) shadows that sinks and warms with `time`
 * - image-based light from two photographed skies (CC0 HDRIs from Poly Haven): day before golden
 *   hour, sunset after it, so glass and water reflect a real sky
 * - an in-scene sky dome with a sun glow, and horizon fog that melts the lawn into it
 * - post-processing: ambient occlusion, bloom for lit windows at dusk, neutral (Khronos PBR) tone mapping
 */

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const SKY_FRAG = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uSunGlow;
uniform float uExposure;
varying vec3 vDir;
void main() {
  vec3 dir = normalize(vDir);
  float h = clamp(dir.y, 0.0, 1.0);
  vec3 col = mix(uHorizon, uTop, pow(h, 0.55));
  float s = max(dot(dir, normalize(uSunDir)), 0.0);
  col += uSunColor * (pow(s, 10.0) * 0.3 + pow(s, 400.0) * 3.0) * uSunGlow;
  gl_FragColor = vec4(col * uExposure, 1.0);
}`;

function SkyDome({ state, sunDir }: { state: RefObject<SceneState>; sunDir: THREE.Vector3 }) {
  const mesh = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new THREE.Color() },
          uHorizon: { value: new THREE.Color() },
          uSunDir: { value: sunDir },
          uSunColor: { value: new THREE.Color() },
          uSunGlow: { value: 1 },
          uExposure: { value: 1 },
        },
      }),
    [sunDir],
  );
  useFrame(() => {
    const t = state.current?.time ?? 0;
    // The dome follows the camera so it never reaches the far plane.
    mesh.current?.position.copy(camera.position);
    rampColor(material.uniforms.uTop.value, t, SKY_TOP);
    rampColor(material.uniforms.uHorizon.value, t, SKY_HORIZON);
    rampColor(material.uniforms.uSunColor.value, t, SUN_COLOR);
    material.uniforms.uSunGlow.value = ramp(t, 0.5, 1.3, 0.7);
  });
  return (
    <mesh ref={mesh} material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[40, 32, 16]} />
    </mesh>
  );
}

function SkyEnvironment({ state }: { state: RefObject<SceneState> }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const [dayHdr, duskHdr] = useLoader(HDRLoader, ["/3d/hdri/day.hdr", "/3d/hdri/dusk.hdr"]);
  const maps = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const day = pmrem.fromEquirectangular(dayHdr).texture;
    const dusk = pmrem.fromEquirectangular(duskHdr).texture;
    pmrem.dispose();
    return { day, dusk };
  }, [gl, dayHdr, duskHdr]);
  useEffect(
    () => () => {
      maps.day.dispose();
      maps.dusk.dispose();
    },
    [maps],
  );
  useFrame(() => {
    const t = state.current?.time ?? 0;
    const env = t < 0.45 ? maps.day : maps.dusk;
    if (scene.environment !== env) scene.environment = env;
    scene.environmentIntensity = ramp(t, 0.6, 0.4, 0.14);
  });
  return null;
}

function Effects({ state, quality }: { state: RefObject<SceneState>; quality: "high" | "low" }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloom = useRef<any>(null);
  useFrame(() => {
    const t = state.current?.time ?? 0;
    if (bloom.current) bloom.current.intensity = 0.12 + smoothstep(0.4, 1, t) * 1.1;
  });
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={0.5} distanceFalloff={0.6} intensity={2.2} quality={quality === "high" ? "low" : "performance"} halfRes />
      <Bloom ref={bloom} mipmapBlur luminanceThreshold={1.1} luminanceSmoothing={0.25} intensity={0.12} radius={0.7} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Vignette offset={0.35} darkness={0.3} />
      <SMAA />
    </EffectComposer>
  );
}

export function Stage({ state, radius = 9 }: { state: RefObject<SceneState>; radius?: number }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const fog = useRef<THREE.Fog>(null);
  const sunDir = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const quality = size.width < 700 ? "low" : "high";
  const lastTime = useRef(-1);

  // Soft shadows are the most expensive part of the frame, so the shadow map is only redrawn
  // when the sun moves or the house does, not while the camera orbits.
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);

  useFrame(() => {
    const s = state.current;
    const t = s?.time ?? 0;
    if (s && (s.shadowsDirty || Math.abs(t - lastTime.current) > 0.002)) {
      gl.shadowMap.needsUpdate = true;
      s.shadowsDirty = false;
      lastTime.current = t;
    }
    if (fog.current) {
      // Fog starts just behind the house wherever the camera is, so only the far lawn fades.
      const dist = camera.position.length();
      fog.current.near = dist + radius * 0.5;
      fog.current.far = dist + radius * 2.6;
    }
    const elevation = THREE.MathUtils.degToRad(ramp(t, 48, 14, 2));
    const azimuth = THREE.MathUtils.degToRad(ramp(t, -40, -64, -80));
    sunDir.set(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation));
    if (sun.current) {
      sun.current.position.copy(sunDir).multiplyScalar(30);
      rampColor(sun.current.color, t, SUN_COLOR);
      sun.current.intensity = ramp(t, 4.2, 3.4, 0.3);
    }
    if (hemi.current) {
      rampColor(hemi.current.color, t, HEMI_SKY);
      rampColor(hemi.current.groundColor, t, HEMI_GROUND);
      hemi.current.intensity = ramp(t, 0.35, 0.3, 0.2);
    }
    // Same colour as the sky dome at the horizon, so lawn and sky meet without a seam.
    if (fog.current) rampColor(fog.current.color, t, SKY_HORIZON);
  });

  return (
    <>
      <fog ref={fog} attach="fog" args={["#e6f1fa", radius * 2.2, radius * 6]} />
      <SkyDome state={state} sunDir={sunDir} />
      <SkyEnvironment state={state} />
      <hemisphereLight ref={hemi} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-radius={5}
        shadow-blurSamples={8}
        shadow-camera-left={-radius}
        shadow-camera-right={radius}
        shadow-camera-top={radius}
        shadow-camera-bottom={-radius}
        shadow-camera-near={5}
        shadow-camera-far={60}
      />
      <Effects state={state} quality={quality} />
    </>
  );
}
