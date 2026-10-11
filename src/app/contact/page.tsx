import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/ui/page-header";
import { site } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Arise about a home to rent or a home to let. Offices in Lisbon, Barcelona, Cape Town, Dubai and Paris.",
  alternates: { canonical: "/contact" },
};

const offices = [
  { city: "Lisbon", address: ["Rua da Escola Politécnica 42", "1250-102 Lisboa"] },
  { city: "Barcelona", address: ["Carrer de Provença 288", "08008 Barcelona"] },
  { city: "Cape Town", address: ["14 Kloof Nek Road", "Tamboerskloof, 8001"] },
  { city: "Dubai", address: ["Jumeirah Beach Road, Villa 9", "Umm Suqeim 1"] },
  { city: "Paris", address: ["27 rue de Turenne", "75004 Paris"] },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Talk to us" intro="Questions about a home, a lease or letting your own place. A person in the right city will answer.">
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-lg">
          <a href={`mailto:${site.email}`} className="font-semibold underline decoration-line-strong underline-offset-[6px] hover:decoration-ink">
            {site.email}
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-semibold underline decoration-line-strong underline-offset-[6px] hover:decoration-ink">
            {site.phone}
          </a>
        </div>
      </PageHeader>
      <section aria-label="Send a message" className="container-x pb-24">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />
          <div>
            <h2 className="heading text-2xl">Offices</h2>
            <p className="mt-2 text-sm text-stone">Monday to Saturday, 9:00 to 19:00 local time. Emergency repairs for tenants: 24 hours.</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {offices.map((o) => (
                <li key={o.city} className="grid grid-cols-[7rem_1fr] gap-4 py-4">
                  <span className="font-semibold">{o.city}</span>
                  <address className="text-stone not-italic">
                    {o.address[0]}
                    <br />
                    {o.address[1]}
                  </address>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
