"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { type PhotoKey, photos, photoSrc } from "@/data/photos";
import { cn } from "@/lib/utils";

export function Gallery({ keys, name }: { keys: PhotoKey[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const show = (i: number, from: HTMLElement) => {
    opener.current = from;
    setOpen(i);
  };
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => {
      setDir(d);
      setOpen((i) => (i === null ? i : (i + d + keys.length) % keys.length));
    },
    [keys.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open !== null && !el.open) el.showModal();
    if (open === null && el.open) {
      el.close();
      opener.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, step]);

  const [main, ...rest] = keys;
  const side = rest.slice(0, 2);

  return (
    <>
      <div className="grid gap-3 md:h-[34rem] md:grid-cols-3 md:grid-rows-2">
        <button
          type="button"
          onClick={(e) => show(0, e.currentTarget)}
          className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-photo)] bg-mist md:col-span-2 md:row-span-2 md:aspect-auto"
          aria-label={`Open photo 1 of ${keys.length}: ${photos[main].alt}`}
        >
          <Image src={photoSrc(main)} alt="" fill priority sizes="(min-width: 768px) 66vw, 100vw" className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]" />
        </button>
        {side.map((k, i) => (
          <button
            key={k}
            type="button"
            onClick={(e) => show(i + 1, e.currentTarget)}
            className="group relative hidden overflow-hidden rounded-[var(--radius-photo)] bg-mist md:block"
            aria-label={`Open photo ${i + 2} of ${keys.length}: ${photos[k].alt}`}
          >
            <Image src={photoSrc(k)} alt="" fill sizes="33vw" className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={(e) => show(0, e.currentTarget)}
        className="press mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-mist px-4 text-sm font-medium hover:bg-line"
      >
        <Images className="size-4" aria-hidden /> All {keys.length} photos
      </button>

      <dialog
        ref={dialog}
        onClose={close}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label={`Photos of ${name}`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/90 backdrop:backdrop-blur-sm"
      >
        {open !== null && (
          <div className="flex h-full flex-col p-3 sm:p-6" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="flex items-center justify-between text-white">
              <p className="text-sm tabular-nums" aria-live="polite">
                {open + 1} / {keys.length}
              </p>
              <button type="button" onClick={close} className="press inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close photos">
                <X className="size-5" />
              </button>
            </div>
            <div className="relative my-3 flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.figure
                  key={open}
                  custom={dir}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, transform: `translateX(${dir * 40}px)` }}
                  animate={{ opacity: 1, transform: "translateX(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, transform: `translateX(${dir * -40}px)` }}
                  transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="relative flex-1">
                    <Image src={photoSrc(keys[open])} alt={photos[keys[open]].alt} fill sizes="100vw" className="object-contain" />
                  </div>
                  <figcaption className="mt-3 text-center text-sm text-white/75">{photos[keys[open]].alt}</figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-2">
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => step(d)}
                  className={cn("press inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20")}
                  aria-label={d < 0 ? "Previous photo" : "Next photo"}
                >
                  {d < 0 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
