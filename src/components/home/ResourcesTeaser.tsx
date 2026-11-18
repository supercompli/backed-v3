import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { resources } from "@/data/resources";

export function ResourcesTeaser() {
  const featured = resources.slice(0, 3);
  return (
    <Section bg="soft-green">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <SectionHeading eyebrow="Resource centre" title="Understand PI before you need it" />
        <Link href="/resources" className="text-sm font-semibold text-green hover:text-green-dark">
          Browse all resources →
        </Link>
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {featured.map((resource) => (
          <Link
            key={resource.slug}
            href={`/resources/${resource.slug}`}
            className="bg-white border border-border rounded-lg p-6 hover:border-green transition-colors"
          >
            <p className="text-xs font-bold tracking-widest text-green uppercase">
              {resource.category}
            </p>
            <h3 className="mt-3 font-semibold text-text-dark leading-snug">{resource.title}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">{resource.excerpt}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
