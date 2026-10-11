"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ModelSceneProps } from "@/components/three/model-scene";
import { lazyScene } from "@/components/three/scene-loader";
import { createSceneState, type SceneState } from "@/components/three/scene-state";
import { useNearViewport } from "@/components/three/use-on-screen";
import type { Property } from "@/data/properties";
import { cn } from "@/lib/utils";

const ModelScene = lazyScene<ModelSceneProps>(() => import("@/components/three/model-scene"), () => null);

const times = [
  { value: 0, label: "Noon", sky: "from-[#a9cdea] to-[#e6f1fa]" },
  { value: 0.5, label: "Golden hour", sky: "from-[#9db6d4] to-[#f6d2ae]" },
  { value: 1, label: "Dusk", sky: "from-[#273454] to-[#d98e6a]" },
] as const;

function Segmented<T extends string | number>({ label, options, value, onChange, id }: {
  label: string;
  id: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-white/80 p-1 backdrop-blur-md">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn("relative h-9 rounded-full px-3.5 text-sm font-medium transition-colors duration-200 sm:px-4", on ? "text-white" : "text-ink hover:text-ink/70")}
          >
            {on && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function PropertyViewer({ property }: { property: Property }) {
  const reduce = useReducedMotion();
  const state = useRef<SceneState>(createSceneState({ time: 0.1 }));
  const [time, setTime] = useState<number>(0);
  const [exploded, setExploded] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const near = useNearViewport(panel);

  useEffect(() => {
    state.current.rise = !reduce;
  }, [reduce]);

  useEffect(() => {
    const controls = animate(state.current.time, time === 0 ? 0.1 : time, {
      duration: reduce ? 0 : 1.2,
      ease: [0.77, 0, 0.175, 1],
      onUpdate: (v) => (state.current.time = v),
    });
    return () => controls.stop();
  }, [time, reduce]);

  const toggleExploded = () => {
    setExploded((e) => {
      state.current.explode = e ? 0 : 1;
      return !e;
    });
  };

  const sky = times.find((t) => t.value === time)?.sky ?? times[0].sky;
  const levels = property.model.floors.length;

  return (
    <section aria-labelledby="viewer-title" className="mt-20">
      <h2 id="viewer-title" className="heading text-2xl sm:text-3xl">
        Explore the house in 3D
      </h2>
      <p className="mt-2 max-w-lg text-stone">
        Drag to turn it, scroll or pinch to zoom. {levels > 1 ? "Pull the floors apart to see how the levels stack." : ""}
        {property.model.unit !== undefined ? " The lit floor is the home for rent." : ""}
      </p>
      <div ref={panel} className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[16/10]">
        {times.map((t) => (
          <div
            key={t.label}
            aria-hidden
            className={cn("absolute inset-0 bg-gradient-to-b transition-opacity duration-1000", t.sky, t.sky === sky ? "opacity-100" : "opacity-0")}
          />
        ))}
        <div role="img" aria-label={`Interactive 3D model of ${property.name}, ${levels} ${levels === 1 ? "level" : "levels"}`} className="absolute inset-0">
          {near && <ModelScene state={state} model={property.model} interactive autoRotate={!reduce} />}
        </div>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2 sm:inset-x-4 sm:bottom-4">
          <div className="pointer-events-auto">
            <Segmented id="time" label="Time of day" options={times} value={time as 0 | 0.5 | 1} onChange={setTime} />
          </div>
          {levels > 1 && (
            <button
              type="button"
              aria-pressed={exploded}
              onClick={toggleExploded}
              className={cn(
                "press pointer-events-auto h-11 rounded-full px-4 text-sm font-medium backdrop-blur-md",
                exploded ? "bg-ink text-white" : "bg-white/80 text-ink hover:bg-white",
              )}
            >
              {exploded ? "Stack the floors" : "Pull floors apart"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
