"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { button } from "@/components/ui/pill-button";
import { photos, photoSrc } from "@/data/photos";
import { properties } from "@/data/properties";

/** The brand's inline-photo headline: a home opens up inside the sentence as it scrolls in. */
export function Intro() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="intro-title" className="container-x pt-24 pb-28 text-center sm:pt-32 sm:pb-36">
      <h2 id="intro-title" className="display mx-auto max-w-4xl text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.02]">
        Where your next chapter finds its
        <motion.span
          aria-hidden
          className="relative mx-[0.18em] inline-block h-[0.78em] w-[1.9em] translate-y-[0.06em] overflow-hidden align-baseline"
          initial={reduce ? false : { clipPath: "inset(0 38% 0 38% round 999px)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0% round 999px)" }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
        >
          <motion.span
            className="absolute inset-0 block"
            initial={reduce ? false : { scale: 1.25 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <Image src={photoSrc("singleStorey")} alt={photos.singleStorey.alt} fill sizes="200px" className="object-cover" />
          </motion.span>
        </motion.span>
        home.
      </h2>
      <p className="mx-auto mt-7 max-w-2xl text-lg text-stone">
        Arise lets homes for a year or longer, not for a weekend. Every one is visited by our team before it&apos;s listed, priced with no agency fee for tenants, and looked after by a
        local manager you can call.
      </p>
      <Link href="/rentals" className={button({ size: "lg", className: "mt-9" })}>
        Browse all {properties.length} homes
      </Link>
    </section>
  );
}
