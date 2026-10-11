import * as THREE from "three";

// Kept apart from scene-state so pages that only hold scene state don't bundle three.js.
/* Time-of-day ramps: [noon, golden hour, dusk]. */
const tmp = new THREE.Color();

export function rampColor(out: THREE.Color, t: number, stops: readonly [string, string, string]) {
  const [a, b, c] = stops;
  if (t <= 0.5) return out.set(a).lerp(tmp.set(b), t * 2);
  return out.set(b).lerp(tmp.set(c), (t - 0.5) * 2);
}

export const SUN_COLOR = ["#fff7ec", "#ffbe7d", "#8c7fc0"] as const;
export const HEMI_SKY = ["#dcecf8", "#f4cfa8", "#3a4a72"] as const;
export const HEMI_GROUND = ["#a9a49b", "#9c8270", "#24232f"] as const;

/** CSS sky behind the canvas, matched to the same three stops (top, horizon). */
export const SKY_TOP = ["#a9cdea", "#9db6d4", "#273454"] as const;
export const SKY_HORIZON = ["#e6f1fa", "#f6d2ae", "#d98e6a"] as const;
