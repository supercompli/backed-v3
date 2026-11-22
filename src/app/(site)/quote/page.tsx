import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteEngine } from "@/components/quote/QuoteEngine";
import { PI_PRODUCT_SLUG, parseQuoteProducts, quoteProductNames } from "@/data/quoteProducts";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Get a Professional Indemnity Quote",
  description:
    "Complete one simple online application and let BackedSure help you find suitable Professional Indemnity cover for your profession.",
  path: "/quote",
});

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ profession?: string; coverLimit?: string; product?: string | string[] }>;
}) {
  const { profession, coverLimit, product } = await searchParams;
  const products = parseQuoteProducts(product);
  const initialProducts = products.length ? products : [PI_PRODUCT_SLUG];
  const heading =
    initialProducts.length === 1
      ? `Your ${quoteProductNames(initialProducts)[0]} application`
      : "Your business insurance application";

  return (
    <div className="bg-warm-bg">
      <div className="container-page py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <p className="text-xs font-bold tracking-widest text-green uppercase mb-3">Get a Quote</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-dark">
            {heading}
          </h1>
          <p className="mt-3 text-text-secondary">
            No obligation. Most applications take under 1 minute.
          </p>
        </div>
        <Suspense fallback={null}>
          <QuoteEngine
            key={initialProducts.join(",")}
            initialProducts={initialProducts}
            initialProfessionSlug={profession}
            initialCoverLimit={coverLimit}
          />
        </Suspense>
      </div>
    </div>
  );
}
