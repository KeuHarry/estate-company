import Image from "next/image";
import Link from "next/link";
import { photos, photoSrc } from "@/data/photos";
import { cities, properties } from "@/data/properties";

export function Cities() {
  return (
    <section aria-labelledby="cities-title" className="pb-28 sm:pb-36">
      <div className="container-x">
        <h2 id="cities-title" className="heading text-3xl sm:text-4xl">
          Five cities, one team
        </h2>
        <p className="mt-3 max-w-md text-stone">Managers live in each city, so the person who shows you the home is the one who fixes the boiler.</p>
      </div>
      <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 sm:scroll-px-8 sm:px-8 xl:px-[max(2rem,calc((100vw-82rem)/2+2rem))]">
        {cities.map((c) => {
          const count = properties.filter((p) => p.city === c.name).length;
          return (
            <li key={c.name} className="w-[72vw] max-w-[19rem] shrink-0 snap-start">
              <Link href={`/rentals?city=${encodeURIComponent(c.name)}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-photo)] bg-mist">
                  <Image
                    src={photoSrc(c.photo)}
                    alt={photos[c.photo].alt}
                    fill
                    sizes="19rem"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <p className="heading text-2xl">{c.name}</p>
                    <p className="text-sm text-white/85">{count === 1 ? "1 home" : `${count} homes`}</p>
                  </div>
                </div>
                <p className="mt-3 px-1 text-sm text-stone">{c.note}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
