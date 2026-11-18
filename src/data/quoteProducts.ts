// Covers a customer can request through the /quote form. Professional
// Indemnity is rated online; every other cover is quoted by a specialist
// using the same business details.
export interface QuoteProduct {
  slug: string;
  name: string;
  description: string;
}

export const PI_PRODUCT_SLUG = "professional-indemnity";

export const quoteProducts: QuoteProduct[] = [
  {
    slug: PI_PRODUCT_SLUG,
    name: "Professional Indemnity",
    description: "Claims arising from your advice, design or professional services.",
  },
  {
    slug: "public-liability",
    name: "Public Liability",
    description: "Third-party injury or property damage at your premises or on site.",
  },
  {
    slug: "commercial-crime",
    name: "Commercial Crime",
    description: "Theft, fraud, forgery and computer crime by employees or outsiders.",
  },
  {
    slug: "comprehensive-business",
    name: "Comprehensive Business",
    description: "Buildings, contents, equipment, stock and business interruption.",
  },
  {
    slug: "cyber-liability",
    name: "Cyber Liability",
    description: "Data breaches, ransomware, network failures and recovery costs.",
  },
  {
    slug: "directors-officers",
    name: "Directors & Officers",
    description: "Personal liability of directors and managers for their decisions.",
  },
  {
    slug: "fidelity-guarantee",
    name: "Fidelity Guarantee",
    description: "Losses caused by employee dishonesty.",
  },
];

export function getQuoteProduct(slug: string) {
  return quoteProducts.find((p) => p.slug === slug);
}

// Accepts a single slug or a comma-separated list, e.g. ?product=cyber-liability,public-liability
export function parseQuoteProducts(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : (value ?? "");
  const slugs = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => getQuoteProduct(s));
  return [...new Set(slugs)];
}

export function quoteProductNames(slugs: string[]) {
  return slugs.map((s) => getQuoteProduct(s)?.name ?? s);
}

export function quoteHref(productSlug: string) {
  return `/quote?product=${productSlug}`;
}
