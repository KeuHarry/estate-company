import type { Metadata } from "next";
import { Suspense } from "react";
import { RentalsBrowser } from "@/components/rentals/rentals-browser";
import { PageHeader } from "@/components/ui/page-header";
import { properties } from "@/data/properties";

export const metadata: Metadata = {
  title: "Homes to rent",
  description: "Villas, houses, townhouses, apartments and lofts to rent for six months or longer in Lisbon, Barcelona, Cape Town, Dubai and Paris.",
  alternates: { canonical: "/rentals" },
};

export default function RentalsPage() {
  return (
    <>
      <PageHeader
        title="Homes to rent"
        intro={`${properties.length} homes in five cities, let for six months or longer. Rents include building charges; utilities are billed at cost.`}
      />
      <Suspense fallback={<div className="container-x min-h-[60svh]" />}>
        <RentalsBrowser />
      </Suspense>
    </>
  );
}
