"use client";

import { CalendarCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DateField, Field, TextArea } from "@/components/forms/fields";
import { rules, useEnquiry } from "@/components/forms/use-enquiry";
import { button } from "@/components/ui/pill-button";
import { formatRent, type Property } from "@/data/properties";
import { cn } from "@/lib/utils";

function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function ViewingForm({ property: p }: { property: Property }) {
  const [mode, setMode] = useState<"in-person" | "video">("in-person");
  const { errors, status, reference, onSubmit, clear } = useEnquiry("viewing", {
    name: [rules.required("Enter your name.")],
    email: [rules.required("Enter your email address."), rules.email()],
    date: [
      rules.required("Choose a day for the viewing."),
      (v) => (v < today() ? "Choose today or a later day." : undefined),
    ],
  });

  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-float ring-1 ring-line sm:p-7">
      <p>
        <span className="heading text-3xl">{formatRent(p.rent)}</span> <span className="text-stone">a month</span>
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-mist px-4 py-3">
          <dt className="text-stone">Available</dt>
          <dd className="font-semibold">{p.available}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-4 py-3">
          <dt className="text-stone">Minimum stay</dt>
          <dd className="font-semibold">{p.minTerm}</dd>
        </div>
      </dl>

      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="mt-6"
            role="status"
          >
            <CalendarCheck className="size-8 text-dusk-ink" aria-hidden />
            <h2 className="heading mt-3 text-xl">Viewing requested</h2>
            <p className="mt-2 text-sm text-stone">
              Your {mode === "video" ? "video viewing" : "viewing"} of {p.name} is pencilled in. A manager in {p.city} will email you within a working day to confirm the time.
            </p>
            {reference && (
              <p className="mt-3 text-sm">
                Reference <span className="font-semibold tabular-nums">{reference}</span>
              </p>
            )}
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.15 } }} className="mt-6 space-y-4">
            <h2 className="heading text-xl">Book a viewing</h2>
            <input type="hidden" name="property" value={p.slug} />
            <input type="hidden" name="mode" value={mode} />
            <div role="radiogroup" aria-label="Viewing type" className="grid grid-cols-2 gap-1 rounded-full bg-mist p-1">
              {(["in-person", "video"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className={cn("h-10 rounded-full text-sm font-medium transition-colors duration-200", mode === m ? "bg-white shadow-sm" : "text-stone hover:text-ink")}
                >
                  {m === "video" ? "Video tour" : "In person"}
                </button>
              ))}
            </div>
            <Field label="Name" name="name" autoComplete="name" error={errors.name} onInput={() => clear("name")} />
            <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" error={errors.email} onInput={() => clear("email")} />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" optional />
            <DateField label="Preferred day" name="date" error={errors.date} onValueChange={() => clear("date")} />
            <TextArea label="Anything we should know?" name="message" optional rows={3} placeholder="Moving date, pets, who'll be living there" />
            {status === "failed" && (
              <p className="text-sm text-dusk-ink" role="alert">
                The request didn&apos;t go through. Check your connection and send it again.
              </p>
            )}
            <button type="submit" disabled={status === "sending"} className={button({ size: "lg", className: "w-full" })}>
              {status === "sending" ? "Sending request…" : "Request viewing"}
            </button>
            <p className="text-center text-xs text-stone">Free, and you won&apos;t be asked for payment.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
