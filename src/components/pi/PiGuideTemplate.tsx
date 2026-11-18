import Link from "next/link";
import type { PiGuide } from "@/data/piGuides";
import { getRelatedGuides } from "@/data/piGuides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo";

export function PiGuideTemplate({ guide }: { guide: PiGuide }) {
  const basePath = `/professional-indemnity/${guide.slug}`;
  const relatedGuides = getRelatedGuides(guide);

  return (
    <>
      <JsonLd data={faqSchema(guide.faqs)} />

      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-12 md:pt-8 md:pb-16">
          <Breadcrumbs
            items={[
              { name: "Professional Indemnity", path: "/professional-indemnity" },
              { name: guide.eyebrow, path: basePath },
            ]}
          />
          <p className="mt-6 text-xs font-bold tracking-widest text-green uppercase">
            {guide.category}
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-primary-dark leading-[1.1] max-w-3xl">
            {guide.title}
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
            {guide.description}
          </p>
          <div className="mt-8">
            <LinkButton href="/quote" size="lg">
              Get a Quote
            </LinkButton>
          </div>
        </div>
      </div>

      <Section bg="soft-green">
        <SectionHeading title="Key takeaways" />
        <ul className="mt-6 grid md:grid-cols-2 gap-x-10 gap-y-3 max-w-4xl">
          {guide.keyTakeaways.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-text-dark leading-relaxed">
              <span className="text-green font-bold shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section bg="white">
        <div className="max-w-3xl space-y-12">
          {guide.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-bold text-primary-dark">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section bg="soft-green">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-8 max-w-3xl">
          <FaqAccordion faqs={guide.faqs} />
        </div>
      </Section>

      <Section bg="dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg">
            Get a Professional Indemnity quote for your profession.
          </h2>
          <LinkButton href="/quote" size="lg">
            Get a Quote
          </LinkButton>
        </div>
      </Section>

      {relatedGuides.length > 0 && (
        <Section bg="white">
          <SectionHeading title="Related guides" />
          <div className="mt-8 flex flex-wrap gap-3">
            {relatedGuides.map((rg) => (
              <Link
                key={rg.slug}
                href={`/professional-indemnity/${rg.slug}`}
                className="text-sm bg-warm-bg border border-border rounded-full px-4 py-2 hover:border-green"
              >
                {rg.eyebrow}
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
