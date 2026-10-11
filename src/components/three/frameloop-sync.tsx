"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/**
 * Pauses the render loop while the canvas is off screen. Switching the Canvas `frameloop`
 * prop from "never" back to "always" doesn't restart the loop until the next event, so the
 * loop is driven from inside the canvas and kicked with invalidate().
 */
export function FrameloopSync({ visible }: { visible: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    setFrameloop(visible ? "always" : "never");
    if (visible) invalidate();
  }, [visible, setFrameloop, invalidate]);
  return null;
}
