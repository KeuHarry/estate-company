"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Field, SelectField, TextArea } from "@/components/forms/fields";
import { rules, useEnquiry } from "@/components/forms/use-enquiry";
import { button } from "@/components/ui/pill-button";
import { cities, propertyTypes } from "@/data/properties";

export function OwnerForm() {
  const { errors, status, reference, onSubmit, clear } = useEnquiry("owner", {
    name: [rules.required("Enter your name.")],
    email: [rules.required("Enter your email address."), rules.email()],
    city: [rules.required("Choose the city the home is in.")],
    type: [rules.required("Choose the type of home.")],
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "done" ? (
        <motion.div key="done" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} role="status" className="rounded-[1.75rem] bg-mist p-8">
          <CheckCircle2 className="size-8 text-dusk-ink" aria-hidden />
          <h3 className="heading mt-3 text-2xl">Valuation requested</h3>
          <p className="mt-2 max-w-md text-stone">A manager will call within two working days to arrange a visit. The valuation is free and doesn&apos;t commit you to anything.</p>
          {reference && <p className="mt-3 text-sm">Reference <span className="font-semibold tabular-nums">{reference}</span></p>}
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.15 } }} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" autoComplete="name" error={errors.name} onInput={() => clear("name")} />
          <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" error={errors.email} onInput={() => clear("email")} />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" optional />
          <SelectField
            label="City"
            name="city"
            placeholder="Choose a city"
            error={errors.city}
            onValueChange={() => clear("city")}
            options={cities.map((c) => ({ value: c.name, label: c.name }))}
          />
          <SelectField
            label="Type of home"
            name="type"
            placeholder="Choose a type"
            error={errors.type}
            onValueChange={() => clear("type")}
            options={propertyTypes.map((t) => ({ value: t.value, label: t.label }))}
          />
          <Field label="Bedrooms" name="beds" type="number" min={0} max={20} inputMode="numeric" optional />
          <TextArea label="Tell us about the home" name="message" optional className="sm:col-span-2" placeholder="Address or area, when it's free, anything that needs work" />
          {status === "failed" && (
            <p className="text-sm text-dusk-ink sm:col-span-2" role="alert">
              The request didn&apos;t go through. Check your connection and send it again.
            </p>
          )}
          <div className="sm:col-span-2">
            <button type="submit" disabled={status === "sending"} className={button({ size: "lg" })}>
              {status === "sending" ? "Sending…" : "Request a free valuation"}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
