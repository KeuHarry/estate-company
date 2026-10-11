import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/legal-page";
import { privacy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Arise collects through this website, why, who sees it, and how to have it changed or deleted.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage doc={privacy} other={{ href: "/terms", label: "terms of service" }} />;
}
