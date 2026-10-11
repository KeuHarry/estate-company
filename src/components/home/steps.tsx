"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

const steps = [
  {
    title: "Book a viewing",
    body: "Pick a time on any listing. Visit with a local manager, or take a live video tour if you're moving from abroad.",
  },
  {
    title: "Apply in one form",
    body: "Send ID, proof of income and references once. We reply within two working days, with a yes or a clear reason.",
  },
  {
    title: "Sign and pay the deposit",
    body: "Sign the lease online. Your deposit is held in a protected account and returned within 14 days of moving out.",
  },
  {
    title: "Move in",
    body: "The home is cleaned and checked the day before. Your manager hands over the keys and stays your contact for repairs.",
  },
];

export function Steps() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section aria-labelledby="steps-title" className="bg-sky-soft py-28 sm:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 id="steps-title" className="heading text-3xl sm:text-4xl">
            From viewing to keys in about three weeks
          </h2>
          <p className="mt-4 max-w-md text-stone">
            Tenants pay no agency fee. You pay the first month&apos;s rent and a deposit of two months, and that&apos;s all.
          </p>
        </div>
        <ol ref={list} className="relative">
          <span aria-hidden className="absolute top-3 bottom-3 left-[1.1875rem] w-px bg-sky-deep/40" />
          <motion.span aria-hidden style={{ scaleY: progress }} className="absolute top-3 bottom-3 left-[1.1875rem] w-px origin-top bg-ink" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[2.5rem_1fr] gap-5 pb-12 last:pb-0">
              <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-white text-sm font-semibold shadow-float">{i + 1}</span>
              <div className="pt-1.5">
                <h3 className="heading text-xl">{s.title}</h3>
                <p className="mt-2 max-w-md text-stone">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
