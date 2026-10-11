import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { Newsletter } from "@/components/forms/newsletter";
import { cities } from "@/data/properties";
import { site } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto bg-night text-white">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <LogoMark className="size-10 text-white" />
            <p className="heading mt-6 max-w-sm text-2xl">New homes, the week they&apos;re listed.</p>
            <p className="mt-3 max-w-sm text-sm text-white/65">One email on Fridays. No other mail, and you can leave with one click.</p>
            <Newsletter tone="dark" className="mt-6" />
          </div>
          <nav aria-label="Rentals by city">
            <h2 className="text-sm font-semibold text-white/55">Rentals</h2>
            <ul className="mt-4 space-y-2.5">
              {cities.map((c) => (
                <li key={c.name}>
                  <Link href={`/rentals?city=${encodeURIComponent(c.name)}`} className="text-white/85 hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className="text-sm font-semibold text-white/55">Company</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/about" className="text-white/85 hover:text-white">About Arise</Link></li>
              <li><Link href="/owners" className="text-white/85 hover:text-white">Let your home with us</Link></li>
              <li><Link href="/contact" className="text-white/85 hover:text-white">Contact</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="text-sm font-semibold text-white/55">Talk to us</h2>
            <ul className="mt-4 space-y-2.5 text-white/85">
              <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
              <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a></li>
              <li className="text-white/65">Monday to Saturday, 9:00 to 19:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:justify-between">
          <p>© 2026 Arise Homes. Listings shown are examples.</p>
          <p>
            Photography from{" "}
            <a href="https://unsplash.com" className="underline decoration-white/30 underline-offset-4 hover:text-white">
              Unsplash
            </a>
            , 3D skies, textures and models from{" "}
            <a href="https://polyhaven.com" className="underline decoration-white/30 underline-offset-4 hover:text-white">
              Poly Haven
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
