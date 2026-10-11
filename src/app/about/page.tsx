import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { button } from "@/components/ui/pill-button";
import { PageHeader } from "@/components/ui/page-header";
import { photos, photoSrc, type PhotoKey } from "@/data/photos";

export const metadata: Metadata = {
  title: "About",
  description: "Arise started in Lisbon in 2019 with twelve homes and a simple rule: the person who shows you the house is the one who looks after it.",
  alternates: { canonical: "/about" },
};

const timeline = [
  { year: "2019", text: "John and Jane start Arise in Lisbon with twelve homes, all within a tram ride of their office in Príncipe Real." },
  { year: "2021", text: "Barcelona opens. Owners in Pedralbes and Sitges ask us to manage homes they'd stopped letting after bad experiences." },
  { year: "2022", text: "Cape Town follows, with a team that includes our first full-time maintenance crew." },
  { year: "2024", text: "Dubai and Paris. Each city has its own managers, and none of them covers more than 30 homes." },
  { year: "2026", text: "Every listing gets a 3D model built from its floor plans, so tenants abroad can see a home properly before they fly in." },
];

const values = [
  { title: "One person, start to finish", body: "Your manager shows you the home, hands you the keys and takes the call when something breaks." },
  { title: "Fewer homes, looked after better", body: "We cap each manager at 30 homes. We'd rather turn an owner away than let a tenant wait a week for a plumber." },
  { title: "Plain prices", body: "Tenants pay no agency fee. Owners pay a share of rent we actually collect. Nobody pays for an empty house." },
];

const founders: { name: string; role: string; photo: PhotoKey; bio: string }[] = [
  { name: "John Doe", role: "Co-founder, Lisbon", photo: "personMarc", bio: "Spent fifteen years restoring buildings in Lisbon's old town before deciding they deserved better landlords." },
  { name: "Jane Dawson", role: "Co-founder, Dubai", photo: "personAmira", bio: "Ran operations for a hotel group across the Gulf, and brought its standard for housekeeping to long lets." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="Homes looked after by the people who let them" intro="Arise is a rental company of 38 people in five cities. We let fewer homes than most agencies, and we look after every one ourselves." />

      <section aria-label="Our values" className="container-x pb-24">
        <div className="relative aspect-video overflow-hidden rounded-4xl sm:aspect-21/9">
          <Image src={photoSrc("villaSymmetry")} alt={photos.villaSymmetry.alt} fill priority sizes="(min-width: 1312px) 82rem, 100vw" className="object-cover" />
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title}>
              <h2 className="heading text-xl">{v.title}</h2>
              <p className="mt-3 text-stone">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="story-title" className="bg-sky-soft py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="story-title" className="heading text-3xl sm:text-4xl lg:sticky lg:top-32 lg:self-start">
            How we got here
          </h2>
          <ol className="space-y-10">
            {timeline.map((t) => (
              <li key={t.year} className="grid gap-2 border-t border-sky-deep/40 pt-6 sm:grid-cols-[6rem_1fr] sm:gap-6">
                <span className="heading text-xl tabular-nums">{t.year}</span>
                <p className="text-ink/80">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="team-title" className="container-x py-24 sm:py-32">
        <h2 id="team-title" className="heading text-3xl sm:text-4xl">
          Founders
        </h2>
        <ul className="mt-10 grid gap-10 sm:grid-cols-2">
          {founders.map((f) => (
            <li key={f.name} className="flex gap-5">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-mist sm:size-28">
                <Image src={photoSrc(f.photo)} alt={photos[f.photo].alt} fill sizes="112px" className="object-cover" />
              </div>
              <div>
                <p className="heading text-xl">{f.name}</p>
                <p className="text-sm text-stone">{f.role}</p>
                <p className="mt-3 max-w-sm text-stone">{f.bio}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-20 flex flex-wrap gap-3">
          <Link href="/rentals" className={button({ size: "lg" })}>
            Find a home
          </Link>
          <Link href="/contact" className={button({ variant: "secondary", size: "lg" })}>
            Talk to our team
          </Link>
        </div>
      </section>
    </>
  );
}
