"use client";

import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { lazyScene } from "@/components/three/scene-loader";
import { createSceneState, type SceneState } from "@/components/three/scene-state";
import { useNearViewport } from "@/components/three/use-on-screen";
import type { ModelSceneProps } from "@/components/three/model-scene";
import { getProperty } from "@/data/properties";
import { cn } from "@/lib/utils";

const ModelScene = lazyScene<ModelSceneProps>(() => import("@/components/three/model-scene"), () => null);

const home = getProperty("mirador")!;
const levelNames = ["Ground floor", "First floor", "Roof"];

/** Mirador pulled apart level by level; choosing a level in the list lifts and lights it. */
export function Levels() {
  const reduce = useReducedMotion();
  const state = useRef<SceneState>(createSceneState({ time: 0.12, explode: 1 }));
  const [active, setActive] = useState(-1);
  const panel = useRef<HTMLDivElement>(null);
  const near = useNearViewport(panel);

  useEffect(() => {
    state.current.rise = !reduce;
  }, [reduce]);

  const select = (i: number) => {
    setActive(i);
    state.current.highlight = i;
  };

  return (
    <section aria-labelledby="levels-title" className="container-x py-28 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 id="levels-title" className="heading text-3xl sm:text-4xl">
            See every level before you visit
          </h2>
          <p className="mt-4 max-w-md text-stone">
            Each listing comes with a 3D model built from the floor plans. Turn it, pull the floors apart, and see it at noon or after dark.
          </p>
          <ul className="mt-10 border-t border-line" onMouseLeave={() => select(-1)}>
            {home.model.floors.map((f, i) => (
              <li key={i} className="border-b border-line">
                <button
                  type="button"
                  aria-pressed={active === i}
                  onMouseEnter={() => select(i)}
                  onFocus={() => select(i)}
                  onBlur={() => select(-1)}
                  onClick={() => select(active === i ? -1 : i)}
                  className="group flex w-full items-start gap-5 py-5 text-left"
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2.5 shrink-0 rounded-full transition-colors duration-200",
                      active === i ? "bg-dusk" : "bg-line-strong group-hover:bg-pebble",
                    )}
                    aria-hidden
                  />
                  <span>
                    <span className="block font-semibold">{levelNames[i] ?? `Level ${i}`}</span>
                    <span className="mt-0.5 block text-sm text-stone">{f.rooms}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <Link href={`/rentals/${home.slug}`} className="mt-8 inline-flex font-semibold underline decoration-line-strong underline-offset-[6px] hover:decoration-ink">
            Open the full model of {home.name}
          </Link>
        </div>
        <div
          ref={panel}
          className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky to-sky-soft"
          role="img"
          aria-label={`3D model of ${home.name} with its three levels pulled apart`}
        >
          {near && <ModelScene state={state} model={home.model} autoRotate={!reduce} />}
        </div>
      </div>
    </section>
  );
}
