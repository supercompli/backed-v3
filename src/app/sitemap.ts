import type { MetadataRoute } from "next";
import { professions } from "@/data/professions";
import { products } from "@/data/products";
import { resources } from "@/data/resources";
import { piTopics } from "@/data/piTopics";
import { coverLimits } from "@/data/coverLimits";
import { piGuides } from "@/data/piGuides";
import { SITE_URL } from "@/lib/seo";

const staticRoutes = [
  "",
  "/professional-indemnity",
  "/professional-indemnity/cost",
  "/professions",
  "/how-it-works",
  "/quote",
  "/professional-indemnity-technology-quote",
  "/resources",
  "/claims",
  "/about",
  "/contact",
  "/directors-officers-liability",
  "/security-liability-insurance",
  "/medical-malpractice-insurance",
  "/proof-of-insurance",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const professionEntries: MetadataRoute.Sitemap = professions.flatMap((p) => [
    {
      url: `${SITE_URL}/professional-indemnity/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/professional-indemnity/${p.slug}/quote`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]);

  const topicEntries: MetadataRoute.Sitemap = piTopics.map((t) => ({
    url: `${SITE_URL}/professional-indemnity/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const coverLimitEntries: MetadataRoute.Sitemap = coverLimits.map((c) => ({
    url: `${SITE_URL}/professional-indemnity/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const guideEntries: MetadataRoute.Sitemap = piGuides.map((g) => ({
    url: `${SITE_URL}/professional-indemnity/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const resourceEntries: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${SITE_URL}/resources/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...professionEntries,
    ...topicEntries,
    ...coverLimitEntries,
    ...guideEntries,
    ...productEntries,
    ...resourceEntries,
  ];
}
