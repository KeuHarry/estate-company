import Image from "next/image";
import Link from "next/link";
import { photos, photoSrc } from "@/data/photos";
import { formatRent, type Property } from "@/data/properties";
import { cn } from "@/lib/utils";

export function specs(p: Property) {
  const beds = p.beds === 1 ? "1 bedroom" : `${p.beds} bedrooms`;
  const baths = p.baths === 1 ? "1 bath" : `${p.baths} baths`;
  return `${beds}, ${baths}, ${p.size} m²`;
}

export function PropertyCard({
  property: p,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
}: {
  property: Property;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const cover = p.photos[0];
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[var(--radius-photo)] bg-mist", imageClassName)}>
        <Image
          src={photoSrc(cover)}
          alt={photos[cover].alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {p.available === "Now" && (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur">Available now</span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <h3 className="heading text-xl">
            <Link href={`/rentals/${p.slug}`} className="after:absolute after:inset-0 after:rounded-[var(--radius-photo)] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ink">
              {p.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-stone">
            {p.area}, {p.city}
          </p>
          <p className="mt-2 text-sm text-stone">{specs(p)}</p>
        </div>
        <p className="shrink-0 text-right">
          <span className="font-semibold">{formatRent(p.rent)}</span>
          <span className="block text-xs text-stone">a month</span>
        </p>
      </div>
    </article>
  );
}
