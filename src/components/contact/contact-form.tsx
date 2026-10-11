"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Field, SelectField, TextArea } from "@/components/forms/fields";
import { rules, useEnquiry } from "@/components/forms/use-enquiry";
import { button } from "@/components/ui/pill-button";

export function ContactForm() {
  const { errors, status, reference, onSubmit, clear } = useEnquiry("contact", {
    name: [rules.required("Enter your name.")],
    email: [rules.required("Enter your email address."), rules.email()],
    message: [rules.required("Write a message so we know how to help.")],
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "done" ? (
        <motion.div key="done" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} role="status" className="rounded-[1.75rem] bg-mist p-8">
          <CheckCircle2 className="size-8 text-dusk-ink" aria-hidden />
          <h2 className="heading mt-3 text-2xl">Message sent</h2>
          <p className="mt-2 max-w-md text-stone">We reply within one working day, usually sooner.</p>
          {reference && <p className="mt-3 text-sm">Reference <span className="font-semibold tabular-nums">{reference}</span></p>}
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.15 } }} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" autoComplete="name" error={errors.name} onInput={() => clear("name")} />
          <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" error={errors.email} onInput={() => clear("email")} />
          <SelectField
            label="I'm a"
            name="role"
            defaultValue="tenant"
            className="sm:col-span-2"
            options={[
              { value: "tenant", label: "Tenant or looking for a home" },
              { value: "owner", label: "Homeowner" },
              { value: "other", label: "Something else" },
            ]}
          />
          <TextArea label="Message" name="message" rows={5} error={errors.message} onInput={() => clear("message")} className="sm:col-span-2" />
          {status === "failed" && (
            <p className="text-sm text-dusk-ink sm:col-span-2" role="alert">
              The message didn&apos;t go through. Check your connection and send it again.
            </p>
          )}
          <div className="sm:col-span-2">
            <button type="submit" disabled={status === "sending"} className={button({ size: "lg" })}>
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <p className="mt-3 text-xs text-stone">
              We use your details only to answer this request. See our{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
