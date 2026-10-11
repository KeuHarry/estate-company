import type { MetadataRoute } from "next";
import { properties } from "@/data/properties";
import { site } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/rentals", "/owners", "/about", "/contact", "/privacy", "/terms"].map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  const homes = properties.map((p) => ({ url: `${site.url}/rentals/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 }));
  return [...pages, ...homes];
}
