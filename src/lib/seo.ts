import type { Metadata } from "next";
import type { ProfessionFaq } from "@/types";

export const SITE_NAME = "BackedSure";
export const SITE_URL = "https://backedsure.co.za";

// Shared by the generated cards (app/opengraph-image.tsx, app/twitter-image.tsx)
// and by buildMetadata below. Keep this file free of next/og imports — it is
// pulled into every page.
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_ALT = `${SITE_NAME} — Professional Indemnity, simplified.`;

export function buildMetadata(options: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${options.path}`;
  return {
    title: options.title,
    description: options.description,
    alternates: { canonical: url },
    robots: options.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: options.title,
      description: options.description,
      url,
      siteName: SITE_NAME,
      locale: "en_ZA",
      type: "website",
      // Next shallow-merges metadata, so a page that sets openGraph/twitter
      // drops the root file-convention images — reference them explicitly.
      images: [
        {
          url: "/opengraph-image",
          ...OG_IMAGE_SIZE,
          alt: OG_IMAGE_ALT,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [
        {
          url: "/twitter-image",
          ...OG_IMAGE_SIZE,
          alt: OG_IMAGE_ALT,
          type: "image/png",
        },
      ],
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: ProfessionFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function insuranceAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: SITE_NAME,
    url: SITE_URL,
    areaServed: "ZA",
    description:
      "BackedSure is a South African specialist insurance platform focused on Professional Indemnity Insurance for professionals and professional-service businesses.",
  };
}

export function articleSchema(options: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.headline,
    description: options.description,
    url: `${SITE_URL}${options.path}`,
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}
