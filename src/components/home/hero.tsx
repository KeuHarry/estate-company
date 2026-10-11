"use client";

import { Search } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { button } from "@/components/ui/pill-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { photos, photoSrc } from "@/data/photos";
import { cities } from "@/data/properties";

/*
 * Hero: a photograph of a white villa whose sky melts into the page's own sky, as in the
 * brand reference. Depth comes from layering, not WebGL: the house settles into place on load,
 * drifts slower than the page as you scroll, and leans gently toward the pointer.
 * The CSS sky matches the photo's top row (glare on the left, blue on the right), so the
 * masked top edge of the image is seamless.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const router = useRouter();

  const { scrollYProgress: raw } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  // Springing the progress keeps derived styles on the JS path: Motion hands raw scroll-linked
  // opacity to a native ScrollTimeline, which some Chromium builds evaluated wrongly.
  const progress = useSpring(raw, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.0005,
  });
  const copyY = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, -80]);
  const copyOpacity = useTransform(progress, [0, 0.55], [1, 0]);
  const houseScale = useTransform(
    progress,
    [0, 1],
    reduce ? [1, 1] : [1, 1.08],
  );

  // Pointer parallax: the house leans a few pixels toward the cursor, the sky barely moves.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 20 });
  const sy = useSpring(py, { stiffness: 80, damping: 20 });
  const houseX = useTransform(sx, (v) => v * -14);
  const houseY = useTransform([progress, sy], ([p, y]: number[]) =>
    reduce ? 0 : p * 140 + y * -8,
  );
  const skyX = useTransform(sx, (v) => v * 6);

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    px.set((e.clientX / window.innerWidth) * 2 - 1);
    py.set((e.clientY / window.innerHeight) * 2 - 1);
  }

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const city = String(new FormData(e.currentTarget).get("city") ?? "");
    router.push(
      city ? `/rentals?city=${encodeURIComponent(city)}` : "/rentals",
    );
  }

  // Entrance animations are CSS (globals.css), so the headline and photo are visible from the
  // server-rendered HTML and animate before any JavaScript has loaded.
  const line = (text: string, i: number) => (
    <span className="block overflow-hidden pb-[0.08em]">
      <span
        className="hero-rise block"
        style={{ animationDelay: `${100 + i * 80}ms` }}
      >
        {text}
      </span>
    </span>
  );

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      className="relative isolate flex h-svh min-h-[40rem] flex-col overflow-hidden"
    >
      {/* Sky, matched to the photograph's own sky */}
      <motion.div
        aria-hidden
        style={{ x: skyX }}
        className="absolute -inset-x-4 inset-y-0 -z-20 bg-[linear-gradient(90deg,#f6fafb_0%,#d6ebf2_50%,#a6d1e2_100%)]"
      />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="container-x relative pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-28"
      >
        <h1
          id="hero-title"
          className="display mx-auto max-w-4xl text-[clamp(2.25rem,5.6vw,3.75rem)] leading-[1] lg:text-[4.375rem]"
        >
          {line("Wake up somewhere", 0)}
          {line("extraordinary.", 1)}
        </h1>
        <p
          className="hero-fade mx-auto mt-5 max-w-lg text-base text-ink/70 sm:text-lg"
          style={{ animationDelay: "300ms" }}
        >
          Architect-designed homes to rent in five cities, from lofts to villas
          with a pool. One team handles your viewing, contract and repairs.
        </p>
      </motion.div>

      {/* The house: settles in on load, then parallax on scroll and pointer */}
      <motion.div
        style={{ y: houseY, x: houseX, scale: houseScale }}
        // Fills the space under the headline; the photo's own sky dissolves into the page sky.
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[max(22rem,calc(100svh-12rem))] w-[min(100%,max(48rem,calc((100svh-12rem)*1.75)))] origin-bottom -translate-x-1/2"
      >
        <div className="hero-house-sides h-full w-full">
          <div className="hero-settle hero-house-mask relative h-full w-full">
            <Image
              src={photoSrc("heroVilla")}
              alt={photos.heroVilla.alt}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              // Anchor to the top so the roofline stays under the headline; the pool edge is cropped.
              className="object-cover object-top"
            />
          </div>
        </div>
      </motion.div>
      {/* The ground fades into the page, as on a printed brochure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[22%] bg-gradient-to-b from-white/0 via-white/75 to-white"
      />

      <motion.div
        style={{ opacity: copyOpacity }}
        className="container-x relative mt-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      >
        <form
          role="search"
          onSubmit={onSearch}
          style={{ animationDelay: "500ms" }}
          className="hero-fade mx-auto flex h-14 w-full max-w-md items-center rounded-full bg-white p-1.5 pl-5 shadow-float has-[[data-slot=select-trigger]:focus-visible]:ring-2 has-[[data-slot=select-trigger]:focus-visible]:ring-ink"
        >
          <Select name="city">
            <SelectTrigger
              aria-label="City"
              className="h-11 min-w-0 flex-1 gap-2 rounded-full border-0 bg-transparent px-0 pr-3 text-base hover:bg-transparent focus-visible:ring-0 data-[placeholder]:text-stone data-[size=default]:h-11"
            >
              <SelectValue placeholder="Choose a city" />
            </SelectTrigger>
            <SelectContent className="min-w-[14rem]">
              {cities.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="submit"
            className={button({ size: "md", className: "h-11" })}
          >
            <Search className="size-4" aria-hidden /> Find a home
          </button>
        </form>
      </motion.div>
    </section>
  );
}
