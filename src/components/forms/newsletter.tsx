"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "done" | "error";

/** The joined input + black button pill from the brand, used for "new homes" emails. */
export function Newsletter({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter an email address like name@example.com.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    const res = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    if (res?.ok) {
      setStatus("done");
    } else {
      setError("We couldn't add you just now. Try again in a minute.");
      setStatus("error");
    }
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.25 }}
            role="status"
            className={cn("flex h-13 items-center gap-2 rounded-full px-5 text-sm font-medium", tone === "dark" ? "bg-white/10 text-white" : "bg-mist text-ink")}
          >
            <Check className="size-4" aria-hidden /> Subscribed. New homes will arrive in your inbox.
          </motion.p>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.15 }}>
            <label htmlFor={id} className="sr-only">
              Email address
            </label>
            <div className={cn("flex h-13 items-center rounded-full p-1.5 pl-5", tone === "dark" ? "bg-white/10" : "bg-mist")}>
              <input
                id={id}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Your email address"
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? `${id}-error` : undefined}
                onChange={() => status === "error" && setStatus("idle")}
                className={cn(
                  "min-w-0 flex-1 bg-transparent outline-none",
                  tone === "dark" ? "text-white placeholder:text-white/60" : "text-ink placeholder:text-pebble",
                )}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className={cn("press h-10 shrink-0 rounded-full px-4 text-sm font-semibold", tone === "dark" ? "bg-white text-ink" : "bg-black text-white")}
              >
                {status === "sending" ? "Subscribing…" : "Stay updated"}
              </button>
            </div>
            {status === "error" && (
              <p id={`${id}-error`} className={cn("mt-2 pl-5 text-sm", tone === "dark" ? "text-dusk" : "text-dusk-ink")}>
                {error}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
