import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/legal-page";
import { terms } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The rules for using the Arise website: listings, viewings, fees, content and liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage doc={terms} other={{ href: "/privacy", label: "privacy policy" }} />;
}
