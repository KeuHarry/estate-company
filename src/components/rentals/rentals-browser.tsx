"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cities, formatRent, properties, propertyTypes, type Property } from "@/data/properties";
import { cn } from "@/lib/utils";
import { PropertyCard } from "./property-card";

const rentSteps = [3000, 5000, 8000, 12000, 20000];
const sorts = [
  { value: "featured", label: "Featured first" },
  { value: "rent-asc", label: "Rent: low to high" },
  { value: "rent-desc", label: "Rent: high to low" },
  { value: "size", label: "Largest first" },
] as const;

const ANY = "any";

/**
 * Filter pill built on the shadcn/ui select. Radix doesn't allow an empty item value, so
 * "no filter" travels as ANY internally and as an absent URL param outside.
 */
function PillSelect({ label, value, onChange, options, anyLabel, className }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  anyLabel?: string;
  className?: string;
}) {
  const active = Boolean(value) && value !== options[0]?.value;
  const items = anyLabel ? [{ value: ANY, label: anyLabel }, ...options] : options;
  return (
    <Select value={value || (anyLabel ? ANY : options[0]?.value)} onValueChange={(v) => onChange(v === ANY ? "" : v)}>
      <SelectTrigger
        aria-label={label}
        size="sm"
        className={cn(
          "press h-11 shrink-0 gap-1.5 rounded-full border-0 px-4 text-sm font-medium data-[size=sm]:h-11",
          active || (anyLabel && value) ? "bg-ink text-white hover:bg-ink/90 [&_svg]:text-white" : "bg-mist text-ink hover:bg-line",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function RentalsBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const city = params.get("city") ?? "";
  const type = params.get("type") ?? "";
  const beds = params.get("beds") ?? "";
  const max = params.get("max") ?? "";
  const furnished = params.get("furnished") === "1";
  const sort = params.get("sort") ?? "featured";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && !(key === "sort" && value === "featured")) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const list = properties.filter(
      (p) =>
        (!city || p.city === city) &&
        (!type || p.type === type) &&
        (!beds || p.beds >= Number(beds)) &&
        (!max || p.rent <= Number(max)) &&
        (!furnished || p.furnished),
    );
    const by: Record<string, (a: Property, b: Property) => number> = {
      featured: (a, b) => Number(!!b.featured) - Number(!!a.featured),
      "rent-asc": (a, b) => a.rent - b.rent,
      "rent-desc": (a, b) => b.rent - a.rent,
      size: (a, b) => b.size - a.size,
    };
    return [...list].sort(by[sort] ?? by.featured);
  }, [city, type, beds, max, furnished, sort]);

  const active = Boolean(city || type || beds || max || furnished);

  return (
    <section aria-label="Listings" className="container-x pb-28">
      <div className="sticky top-[calc(5rem+env(safe-area-inset-top))] z-30 -mx-4 bg-white/90 px-4 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <PillSelect
            label="City"
            value={city}
            onChange={(v) => set("city", v)}
            anyLabel="All cities"
            options={cities.map((c) => ({ value: c.name, label: c.name }))}
          />
          <PillSelect label="Type of home" value={type} onChange={(v) => set("type", v)} anyLabel="Any type" options={propertyTypes} />
          <PillSelect
            label="Bedrooms"
            value={beds}
            onChange={(v) => set("beds", v)}
            anyLabel="Any bedrooms"
            options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+ bedrooms` }))}
          />
          <PillSelect
            label="Maximum rent"
            value={max}
            onChange={(v) => set("max", v)}
            anyLabel="Any rent"
            options={rentSteps.map((n) => ({ value: String(n), label: `Up to ${formatRent(n)}` }))}
          />
          <button
            type="button"
            aria-pressed={furnished}
            onClick={() => set("furnished", furnished ? "" : "1")}
            className={cn("press h-11 shrink-0 rounded-full px-4 text-sm font-medium", furnished ? "bg-ink text-white" : "bg-mist text-ink hover:bg-line")}
          >
            Furnished
          </button>
          {active && (
            <button
              type="button"
              onClick={() => router.replace(sort !== "featured" ? `${pathname}?sort=${sort}` : pathname, { scroll: false })}
              className="press inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-stone hover:text-ink"
            >
              <X className="size-4" aria-hidden /> Clear filters
            </button>
          )}
          <PillSelect label="Sort by" value={sort} onChange={(v) => set("sort", v)} options={[...sorts]} className="sm:ml-auto" />
        </div>
      </div>

      <p className="mt-6 text-sm text-stone" aria-live="polite">
        {results.length === 1 ? "1 home" : `${results.length} homes`}
        {city ? ` in ${city}` : ""}
      </p>

      {results.length > 0 ? (
        <motion.ul layout={!reduce} className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((p, i) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
              >
                <PropertyCard property={p} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mt-6 rounded-[var(--radius-panel)] bg-mist px-6 py-16 text-center">
          <p className="heading text-2xl">No homes match all of these filters</p>
          <p className="mx-auto mt-2 max-w-md text-stone">Remove a filter to see more, or leave your email in the footer and we&apos;ll send new homes as they&apos;re listed.</p>
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="press mt-6 h-11 rounded-full bg-black px-5 text-sm font-semibold text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
