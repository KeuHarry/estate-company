import Link from "next/link";
import { PropertyCard } from "@/components/rentals/property-card";
import { properties } from "@/data/properties";

export function Featured() {
  const featured = properties.filter((p) => p.featured).slice(0, 5);
  const [first, ...rest] = featured;
  return (
    <section aria-labelledby="featured-title" className="container-x pb-28 sm:pb-36">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="featured-title" className="heading text-3xl sm:text-4xl">
            Homes to rent now
          </h2>
          <p className="mt-3 max-w-md text-stone">Long lets in five cities, each visited and photographed by our team.</p>
        </div>
        <Link href="/rentals" className="press inline-flex h-11 items-center rounded-full bg-mist px-5 text-sm font-semibold hover:bg-line">
          See all rentals
        </Link>
      </div>
      <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-12">
        <PropertyCard property={first} className="md:col-span-7 md:row-span-2" imageClassName="md:aspect-auto md:flex-1 md:min-h-[28rem]" sizes="(min-width: 768px) 58vw, 100vw" />
        {rest.map((p, i) => (
          <PropertyCard
            key={p.slug}
            property={p}
            className={i < 3 ? "md:col-span-5" : "md:col-span-7"}
            // The wide card in the last row matches the height of its narrower neighbour.
            imageClassName={i === 3 ? "md:aspect-[15/8]" : undefined}
            sizes={i === 3 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"}
          />
        ))}
      </div>
    </section>
  );
}
