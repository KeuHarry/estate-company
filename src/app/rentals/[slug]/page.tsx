import { Check, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/property/gallery";
import { PropertyViewer } from "@/components/property/property-viewer";
import { ViewingForm } from "@/components/property/viewing-form";
import { PropertyCard, specs } from "@/components/rentals/property-card";
import { photoSrc } from "@/data/photos";
import { formatRent, getProperty, properties, propertyTypes } from "@/data/properties";

// Every listing is prerendered from generateStaticParams. Unknown slugs render on request and
// call notFound(), so this segment is allowed to block instead of streaming a fallback shell
// (which would answer 200 before the 404 is known).
export const instant = false;

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rentals/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) return {};
  return {
    title: `${p.name}, ${p.area}`,
    description: `${p.summary} ${specs(p)}. ${formatRent(p.rent)} a month.`,
    alternates: { canonical: `/rentals/${p.slug}` },
    openGraph: { images: [{ url: photoSrc(p.photos[0]) }] },
  };
}

export default async function PropertyPage({ params }: PageProps<"/rentals/[slug]">) {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) notFound();

  const typeLabel = propertyTypes.find((t) => t.value === p.type)?.label ?? p.type;
  const similar = properties
    .filter((o) => o.slug !== p.slug)
    .sort((a, b) => Number(b.city === p.city) - Number(a.city === p.city) || Math.abs(a.rent - p.rent) - Math.abs(b.rent - p.rent))
    .slice(0, 3);

  const facts = [
    ["Type", typeLabel],
    ["Bedrooms", String(p.beds)],
    ["Bathrooms", String(p.baths)],
    ["Size", `${p.size} m²`],
    ["Furnished", p.furnished ? "Yes" : "No, unfurnished"],
    ["Levels", String(p.model.unit !== undefined ? 1 : p.model.floors.length)],
  ];

  return (
    <article className="pt-28 sm:pt-32">
      <div className="container-x">
        <Link href={`/rentals?city=${encodeURIComponent(p.city)}`} className="press inline-flex h-10 items-center gap-1 rounded-full pr-4 pl-2 text-sm font-medium text-stone hover:bg-mist hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden /> Homes in {p.city}
        </Link>
        <header className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="display text-[clamp(2.4rem,6vw,4rem)] leading-[1]">{p.name}</h1>
            <p className="mt-3 text-lg text-stone">
              {typeLabel} in {p.area}, {p.city}
            </p>
          </div>
          <p className="text-stone">{specs(p)}</p>
        </header>

        <Gallery keys={p.photos} name={p.name} />

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_24rem]">
          <div className="min-w-0">
            <p className="heading max-w-2xl text-2xl leading-snug">{p.summary}</p>
            <div className="mt-6 max-w-2xl space-y-4 text-stone">
              {p.description.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            <h2 className="heading mt-14 text-2xl">The details</h2>
            <dl className="mt-5 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line sm:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={k} className="bg-white p-4">
                  <dt className="text-sm text-stone">{k}</dt>
                  <dd className="mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="heading mt-14 text-2xl">What&apos;s included</h2>
            <ul className="mt-5 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
              {p.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-soft">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  {a}
                </li>
              ))}
            </ul>

            <PropertyViewer property={p} />
          </div>

          <aside aria-label="Book a viewing" className="lg:sticky lg:top-28 lg:self-start">
            <ViewingForm property={p} />
          </aside>
        </div>
      </div>

      <section aria-labelledby="similar-title" className="container-x py-28">
        <h2 id="similar-title" className="heading text-3xl">
          Similar homes
        </h2>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((o) => (
            <PropertyCard key={o.slug} property={o} />
          ))}
        </div>
      </section>
    </article>
  );
}
