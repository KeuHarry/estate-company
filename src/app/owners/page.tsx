import { Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { OwnerForm } from "@/components/owners/owner-form";
import { PageHeader } from "@/components/ui/page-header";
import { photos, photoSrc } from "@/data/photos";

export const metadata: Metadata = {
  title: "Let your home with Arise",
  description: "Arise finds and checks tenants, collects rent and looks after repairs for homeowners in Lisbon, Barcelona, Cape Town, Dubai and Paris.",
  alternates: { canonical: "/owners" },
};

const services = [
  {
    title: "We find the tenant",
    body: "Professional photos, a 3D model of the house, and viewings run by a local manager. Every applicant's identity, income and references are checked before you see them.",
  },
  {
    title: "We collect the rent",
    body: "Rent is paid to Arise on the 1st and reaches your account by the 5th, with a monthly statement. If a tenant is late, we chase it, not you.",
  },
  {
    title: "We look after the house",
    body: "Repairs are handled by tradespeople we've worked with for years. You approve anything over €300, and see every invoice in your owner account.",
  },
];

const plans = ["Letting only", "Full management"] as const;
const rows: [string, boolean, boolean][] = [
  ["Photos, 3D model and listing", true, true],
  ["Viewings and tenant checks", true, true],
  ["Lease and deposit protection", true, true],
  ["Monthly rent collection", false, true],
  ["Repairs and 24-hour emergency line", false, true],
  ["Inspections every six months", false, true],
  ["Move-out check and deposit return", false, true],
];

export default function OwnersPage() {
  return (
    <>
      <PageHeader
        title="Let your home with Arise"
        intro="We find tenants who stay, collect rent on time and look after the house as if we lived there. You hear from us when something needs your decision."
      />

      <section aria-label="What we do" className="container-x pb-24">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] sm:aspect-[21/9]">
          <Image src={photoSrc("timberHouse")} alt={photos.timberHouse.alt} fill priority sizes="(min-width: 1312px) 82rem, 100vw" className="object-cover" />
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.title}>
              <h2 className="heading text-xl">{s.title}</h2>
              <p className="mt-3 text-stone">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="fees-title" className="bg-sky-soft py-24 sm:py-32">
        <div className="container-x">
          <h2 id="fees-title" className="heading text-3xl sm:text-4xl">
            Two ways to work with us
          </h2>
          <p className="mt-3 max-w-lg text-stone">Fees are a share of the rent we collect. There&apos;s nothing to pay while your home is empty, and no fee to leave.</p>
          <div className="mt-10 overflow-x-auto rounded-[var(--radius-panel)] bg-white">
            <table className="w-full min-w-[34rem] text-left">
              <caption className="sr-only">What each plan includes</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-5 text-sm font-medium text-stone">
                    Included
                  </th>
                  <th scope="col" className="p-5">
                    <span className="block font-semibold">{plans[0]}</span>
                    <span className="text-sm font-normal text-stone">One month&apos;s rent, once</span>
                  </th>
                  <th scope="col" className="p-5">
                    <span className="block font-semibold">{plans[1]}</span>
                    <span className="text-sm font-normal text-stone">9% of rent collected</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, a, b]) => (
                  <tr key={label} className="border-b border-line last:border-0">
                    <th scope="row" className="p-5 font-normal">
                      {label}
                    </th>
                    {[a, b].map((v, i) => (
                      <td key={i} className="p-5">
                        {v ? <Check className="size-5" aria-label="Included" /> : <Minus className="size-5 text-pebble" aria-label="Not included" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="valuation-title" className="container-x py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="valuation-title" className="heading text-3xl sm:text-4xl">
              Find out what your home would rent for
            </h2>
            <p className="mt-4 max-w-md text-stone">
              A manager visits, looks at recent lets nearby and sends you a written rent estimate within a week. It&apos;s free, and you decide afterwards.
            </p>
          </div>
          <OwnerForm />
        </div>
      </section>
    </>
  );
}
