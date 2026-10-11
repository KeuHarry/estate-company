"use client";

import { type RefObject, useEffect, useState } from "react";

/** Tracks whether an element is near the viewport, to pause off-screen canvases. */
export function useOnScreen<T extends Element>(ref: RefObject<T | null>, rootMargin = "100px") {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return visible;
}

/**
 * Becomes true once the element comes within `rootMargin` of the viewport, and stays true.
 * Used to delay downloading three.js and the 3D assets until a scene is about to be seen.
 */
export function useNearViewport<T extends Element>(ref: RefObject<T | null>, rootMargin = "600px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, near]);
  return near;
}
