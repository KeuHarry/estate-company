"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState } from "react";

/**
 * Starts at up to 1.5× resolution and steps down when the frame rate drops (integrated GPUs
 * with ambient occlusion and soft shadows), stepping back up if there's headroom.
 */
export function AdaptiveResolution() {
  const setDpr = useThree((s) => s.setDpr);
  const [max] = useState(() => (typeof window === "undefined" ? 1 : Math.min(1.5, window.devicePixelRatio)));
  return (
    <PerformanceMonitor
      bounds={() => [30, 55]}
      flipflops={4}
      onChange={({ factor }) => setDpr(Math.max(0.7, Math.round((0.7 + (max - 0.7) * factor) * 10) / 10))}
      onFallback={() => setDpr(0.7)}
    />
  );
}
