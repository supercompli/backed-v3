import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo";
import type { ProfessionFaq } from "@/types";

export interface GuideSection {
  heading: string;
  body: string;
}

export interface GuideClaim {
  title: string;
  description: string;
}

export interface GuideLandingPageProps {
  breadcrumbLabel: string;
  breadcrumbPath: string;
  h1: string;
  intro: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  guideSections: GuideSection[];
  whatItCoversTitle?: string;
  whatItCovers: string[];
  whoNeedsItTitle?: string;
  whoNeedsIt: string[];
  commonClaims?: GuideClaim[];
  faqs: ProfessionFaq[];
  closingHeading: string;
  closingCtaLabel?: string;
  closingCtaHref?: string;
}

export function GuideLandingPage({
  breadcrumbLabel,
  breadcrumbPath,
  h1,
  intro,
  heroCtaLabel = "Get a Quote",
  heroCtaHref = "/quote",
  guideSections,
  whatItCoversTitle = "What it covers",
  whatItCovers,
  whoNeedsItTitle = "Who needs it",
  whoNeedsIt,
  commonClaims,
  faqs,
  closingHeading,
  closingCtaLabel = "Get a Quote",
  closingCtaHref = "/quote",
}: GuideLandingPageProps) {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: breadcrumbLabel, path: breadcrumbPath }]} />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-3xl leading-[1.1]">
            {h1}
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">{intro}</p>
          <div className="mt-8">
            <LinkButton href={heroCtaHref} size="lg">
              {heroCtaLabel}
            </LinkButton>
          </div>
        </div>
      </div>

      <Section bg="white">
        <div className="max-w-3xl space-y-12">
          {guideSections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-bold text-primary-dark">{section.heading}</h2>
              <p className="mt-4 text-text-secondary leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="soft-green">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <SectionHeading title={whatItCoversTitle} />
            <ul className="mt-6 space-y-3">
              {whatItCovers.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-dark leading-relaxed">
                  <span className="text-green font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title={whoNeedsItTitle} />
            <ul className="mt-6 space-y-3">
              {whoNeedsIt.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {commonClaims && commonClaims.length > 0 ? (
        <Section bg="white">
          <SectionHeading eyebrow="In practice" title="Common claims scenarios" />
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {commonClaims.map((claim) => (
              <div key={claim.title} className="border-t-2 border-primary-dark pt-5">
                <h3 className="font-semibold text-text-dark text-lg">{claim.title}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {claim.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section bg={commonClaims && commonClaims.length > 0 ? "soft-green" : "white"}>
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-8 max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </Section>

      <Section bg="dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg">{closingHeading}</h2>
          <LinkButton href={closingCtaHref} size="lg">
            {closingCtaLabel}
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
