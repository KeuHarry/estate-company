/**
 * Mutable state shared between the DOM (scroll, toggles, hover) and a three.js scene.
 * It lives in a ref so scroll updates never re-render React.
 */
export interface SceneState {
  /** 0 = noon, 0.5 = golden hour, 1 = dusk */
  time: number;
  /** 0 = stacked, 1 = levels pulled apart */
  explode: number;
  /** level to emphasise, or -1 */
  highlight: number;
  /** false skips the rise-from-the-ground entrance (reduced motion) */
  rise: boolean;
  /** -1..1 pointer offset for parallax */
  pointerX: number;
  pointerY: number;
  /** set by the house on frames where something moved, so the shadow map is redrawn */
  shadowsDirty: boolean;
}

export const createSceneState = (init: Partial<SceneState> = {}): SceneState => ({
  time: 0,
  explode: 0,
  highlight: -1,
  rise: true,
  pointerX: 0,
  pointerY: 0,
  shadowsDirty: true,
  ...init,
});

export function ramp(t: number, a: number, b: number, c: number) {
  return t <= 0.5 ? a + (b - a) * t * 2 : b + (c - b) * (t - 0.5) * 2;
}

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
