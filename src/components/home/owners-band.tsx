import Image from "next/image";
import Link from "next/link";
import { button } from "@/components/ui/pill-button";
import { photos, photoSrc } from "@/data/photos";

export function OwnersBand() {
  return (
    <section aria-labelledby="owners-title" className="container-x py-28 sm:py-36">
      <div className="relative isolate overflow-hidden rounded-[2rem] px-6 py-20 text-white sm:px-14 sm:py-28">
        <Image src={photoSrc("entryDusk")} alt={photos.entryDusk.alt} fill sizes="(min-width: 1312px) 82rem, 100vw" className="-z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-night/85 via-night/55 to-night/10" />
        <h2 id="owners-title" className="display max-w-xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.02]">
          Own a home like these? We&apos;ll let it and look after it.
        </h2>
        <p className="mt-5 max-w-md text-white/85">
          We find and check tenants, collect rent, and handle every repair. Owners pay 9% of rent collected, with no fee while the home is empty.
        </p>
        <Link href="/owners" className={button({ variant: "light", size: "lg", className: "mt-9" })}>
          Let your home with Arise
        </Link>
      </div>
    </section>
  );
}
