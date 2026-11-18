import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalPages, getLegalPageBySlug, type LegalBlock } from "@/data/legal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPageBySlug(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/legal/${page.slug}`,
    noIndex: true,
  });
}

function LegalContentBlock({ block }: { block: LegalBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="pt-5 text-xl font-bold text-primary-dark">
        {block.text}
      </h2>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-text-secondary leading-relaxed">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "orderedList") {
    return (
      <ol className="list-decimal space-y-2 pl-5 text-text-secondary leading-relaxed">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  }

  return (
    <p className="text-text-secondary leading-relaxed">
      {block.text}
    </p>
  );
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-10 md:pt-8">
          <Breadcrumbs items={[{ name: page.title, path: `/legal/${page.slug}` }]} />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-primary-dark">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">
            {page.description}
          </p>
        </div>
      </div>
      <Section bg="white">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium text-text-muted">
            Last updated: {page.updatedAt}
          </p>
          {page.body.map((block, index) => (
            <LegalContentBlock key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      </Section>
    </>
  );
}
