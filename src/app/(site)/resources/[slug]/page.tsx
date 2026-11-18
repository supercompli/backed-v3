import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resources, getResourceBySlug } from "@/data/resources";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, articleSchema } from "@/lib/seo";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return buildMetadata({
    title: resource.title,
    description: resource.excerpt,
    path: `/resources/${resource.slug}`,
  });
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: resource.title,
          description: resource.excerpt,
          path: `/resources/${resource.slug}`,
          datePublished: "2026-01-01",
        })}
      />
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-12 md:pt-8 md:pb-16">
          <Breadcrumbs
            items={[
              { name: "Resources", path: "/resources" },
              { name: resource.title, path: `/resources/${resource.slug}` },
            ]}
          />
          <p className="mt-6 text-xs font-bold tracking-widest text-green uppercase">
            {resource.category}
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-primary-dark leading-[1.1] max-w-3xl">
            {resource.title}
          </h1>
        </div>
      </div>

      <Section bg="white">
        <div className="max-w-2xl space-y-5">
          {resource.body.map((paragraph) => (
            <p key={paragraph} className="text-text-secondary leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section bg="dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-white max-w-lg">
            Ready to get Professional Indemnity cover?
          </h2>
          <LinkButton href="/quote" size="lg">
            Get a Quote
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
