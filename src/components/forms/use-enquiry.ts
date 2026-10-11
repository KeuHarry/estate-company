"use client";

import { useState } from "react";

export type Errors = Record<string, string>;
type Rule = (value: string, all: Record<string, string>) => string | undefined;

export const rules = {
  required: (message: string): Rule => (v) => (v.trim() ? undefined : message),
  email: (): Rule => (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? undefined : "Enter an email address like name@example.com."),
};

/**
 * Client validation + POST to the stub /api/enquiry route. On error, focus moves to the
 * first invalid field so keyboard and screen-reader users land on what needs fixing.
 */
export function useEnquiry(kind: "viewing" | "owner" | "contact", schema: Record<string, Rule[]>) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [reference, setReference] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v)]));
    const next: Errors = {};
    for (const [field, fieldRules] of Object.entries(schema)) {
      for (const rule of fieldRules) {
        const msg = rule(data[field] ?? "", data);
        if (msg) {
          next[field] = msg;
          break;
        }
      }
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      // Custom controls (select, date picker) mark their trigger with data-field.
      const target = form.querySelector<HTMLElement>(`[data-field="${first}"]`) ?? (form.elements.namedItem(first) as HTMLElement | null);
      target?.focus();
      return;
    }
    setStatus("sending");
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, ...data }),
    }).catch(() => null);
    if (res?.ok) {
      const body = (await res.json()) as { reference?: string };
      setReference(body.reference ?? "");
      setStatus("done");
    } else {
      setStatus("failed");
    }
  }

  const clear = (field: string) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return { errors, status, reference, onSubmit, clear };
}
