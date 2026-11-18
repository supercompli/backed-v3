import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { LinkButton } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, faqSchema } from "@/lib/seo";
import { quoteHref } from "@/data/quoteProducts";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={faqSchema(product.faqs)} />
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs
            items={[
              { name: "Products", path: "/professional-indemnity" },
              { name: product.name, path: `/products/${product.slug}` },
            ]}
          />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-2xl leading-[1.1]">
            {product.name}
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
            {product.intro}
          </p>
          <div className="mt-8">
            <LinkButton href={quoteHref(product.slug)} size="lg">
              Instant Quote Online
            </LinkButton>
          </div>
        </div>
      </div>

      <Section bg="white">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <SectionHeading title="What it covers" />
            <ul className="mt-6 space-y-3">
              {product.whatItCovers.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-dark leading-relaxed">
                  <span className="text-green font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="Who needs it" />
            <ul className="mt-6 space-y-3">
              {product.whoNeedsIt.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section bg="soft-green">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-8 max-w-3xl">
          <FaqAccordion faqs={product.faqs} />
        </div>
      </Section>

      <Section bg="dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-white max-w-lg">
            Professional Indemnity is our starting point — ask about {product.name.toLowerCase()} too.
          </h2>
          <LinkButton href={quoteHref(product.slug)} size="lg">
            Get a Quote
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
