"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Loads a three.js scene on the client only. Until it arrives, and on devices without
 * WebGL, the fallback (a photo of the home) stays in place.
 */
export function lazyScene<P extends object>(load: () => Promise<{ default: ComponentType<P> }>, Fallback: ComponentType<P>) {
  return dynamic<P>(
    async () => {
      if (!hasWebGL()) return Fallback;
      return (await load()).default;
    },
    { ssr: false, loading: () => null },
  );
}
