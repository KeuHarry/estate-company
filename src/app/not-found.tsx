import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { button } from "@/components/ui/pill-button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-gradient-to-b from-sky-soft to-white pt-28">
      <div className="container-x text-center">
        <LogoMark className="mx-auto size-14" />
        <h1 className="display mt-8 text-[clamp(2.25rem,6vw,4rem)] leading-none">This page isn&apos;t here</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-stone">The home may have been let, or the link has a typo. Every home that&apos;s still available is on the rentals page.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/rentals" className={button({ size: "lg" })}>
            See homes to rent
          </Link>
          <Link href="/" className={button({ variant: "secondary", size: "lg" })}>
            Go to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
