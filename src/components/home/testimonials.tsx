"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { photoSrc, type PhotoKey } from "@/data/photos";
import { cn } from "@/lib/utils";

const quotes: { name: string; detail: string; photo: PhotoKey; quote: string }[] = [
  {
    name: "Inês Moreau",
    detail: "Rented Atelier Loft, Lisbon",
    photo: "personInes",
    quote: "I signed from Montréal after a video viewing. When I landed, the loft was cleaned, the wifi worked, and Rui had left a list of the bakeries worth the queue.",
  },
  {
    name: "Daniel Okafor",
    detail: "Rented The Eaves House, Cape Town",
    photo: "personDaniel",
    quote: "The geyser burst on a Sunday. Someone was there in two hours. That's the whole review, really.",
  },
  {
    name: "Clara Lindqvist",
    detail: "Rented Linden Court, Paris",
    photo: "personClara",
    quote: "Every other agency asked for the same documents four times. Arise asked once and answered the next afternoon.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const q = quotes[i];
  return (
    <section aria-labelledby="quotes-title" className="bg-mist py-28 sm:py-36">
      <div className="container-x">
        <h2 id="quotes-title" className="sr-only">
          What tenants say
        </h2>
        <figure className="mx-auto max-w-4xl text-center">
          <div className="grid">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="display [grid-area:1/1] text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.15]"
              >
                &ldquo;{q.quote}&rdquo;
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <figcaption className="mt-10" aria-live="polite">
            <span className="font-semibold">{q.name}</span>
            <span className="block text-sm text-stone">{q.detail}</span>
          </figcaption>
        </figure>
        <div className="mt-8 flex justify-center gap-3" role="group" aria-label="Choose a tenant">
          {quotes.map((t, n) => (
            <button
              key={t.name}
              type="button"
              aria-pressed={n === i}
              aria-label={`Read ${t.name}'s review`}
              onClick={() => setI(n)}
              className={cn(
                "press relative size-12 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-mist transition-[box-shadow,opacity]",
                n === i ? "ring-ink" : "opacity-60 ring-transparent hover:opacity-100",
              )}
            >
              <Image src={photoSrc(t.photo)} alt="" fill sizes="48px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
