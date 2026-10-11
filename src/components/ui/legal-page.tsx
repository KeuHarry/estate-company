import Link from "next/link";
import type { LegalDoc } from "@/data/legal";
import { PageHeader } from "./page-header";

export function LegalPage({ doc, other }: { doc: LegalDoc; other: { href: string; label: string } }) {
  const date = new Date(`${doc.updated}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return (
    <>
      <PageHeader title={doc.title} intro={doc.intro}>
        <p className="mt-4 text-sm text-stone">
          Last updated <time dateTime={doc.updated}>{date}</time>
        </p>
      </PageHeader>
      <div className="container-x grid gap-12 pb-28 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-semibold text-stone">On this page</p>
          <ol className="mt-3 space-y-1 border-l border-line">
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-sm text-stone hover:border-ink hover:text-ink">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="max-w-2xl">
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="border-t border-line pt-8 pb-10 first:border-t-0 first:pt-0">
              <h2 id={`${s.id}-title`} className="heading text-2xl">
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 text-ink/80">
                {s.body.map((b, i) =>
                  typeof b === "string" ? (
                    <p key={i}>{b}</p>
                  ) : (
                    <ul key={i} className="list-disc space-y-2 pl-5 marker:text-pebble">
                      {b.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
          <p className="mt-4 text-sm text-stone">
            See also our{" "}
            <Link href={other.href} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              {other.label}
            </Link>
            .
          </p>
        </article>
      </div>
    </>
  );
}
