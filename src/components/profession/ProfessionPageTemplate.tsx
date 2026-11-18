import Link from "next/link";
import type { Profession } from "@/types";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo";
import { getRelatedProfessions } from "@/data/professions";
import { getProductBySlug } from "@/data/products";
import { articleFor } from "@/lib/utils";

export function ProfessionPageTemplate({ profession }: { profession: Profession }) {
  const basePath = `/professional-indemnity/${profession.slug}`;
  const relatedProfessions = getRelatedProfessions(profession);
  const relatedProducts = profession.relatedProducts
    .map((rp) => ({ ...rp, product: getProductBySlug(rp.slug) }))
    .filter((rp) => rp.product);

  return (
    <>
      <JsonLd data={faqSchema(profession.faqs)} />

      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs
            items={[
              { name: "Professional Indemnity", path: "/professional-indemnity" },
              { name: profession.pluralName, path: basePath },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <p className="text-xs font-bold tracking-widest text-green uppercase mb-4">
              {profession.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-dark leading-[1.1]">
              Professional Indemnity Insurance for {profession.pluralName}
            </h1>
            <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-2xl">
              {profession.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={`/quote?profession=${profession.slug}`} size="lg">
                Get {articleFor(profession.name)} {profession.name} PI Quote
              </LinkButton>
              <LinkButton href="#what-it-covers" variant="outline" size="lg">
                See What Cover Includes
              </LinkButton>
            </div>
          </div>
        </div>
      </div>

      <Section bg="white">
        <SectionHeading
          eyebrow="Why it matters"
          title={`Why ${profession.pluralName.toLowerCase()} need Professional Indemnity`}
        />
        <ul className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-4 max-w-4xl">
          {profession.whyNeeded.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section bg="soft-green" id="what-it-covers">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <SectionHeading title={`What does ${profession.name} PI cover?`} />
            <ul className="mt-6 space-y-3">
              {profession.whatItCovers.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-dark leading-relaxed">
                  <span className="text-green font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="Common exclusions" />
            <ul className="mt-6 space-y-3">
              {profession.whatItExcludes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="text-text-secondary font-bold shrink-0">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section bg="white">
        <SectionHeading
          eyebrow="Real scenarios"
          title={`Common ${profession.name} PI claims`}
        />
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {profession.commonClaims.map((claim) => (
            <div key={claim.title} className="border border-border rounded-lg p-6">
              <h3 className="font-semibold text-text-dark">{claim.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {claim.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="warm">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <SectionHeading
              title={`How much PI cover does ${articleFor(profession.name)} ${profession.name.toLowerCase()} need?`}
            />
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">{profession.coverGuidance}</p>
          </div>
          <div>
            <SectionHeading title="What affects the premium?" />
            <ul className="mt-4 space-y-2">
              {profession.premiumFactors.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section bg="white">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <SectionHeading title="What information insurers require" />
            <ul className="mt-4 space-y-2">
              {profession.requiredInformation.map((item) => (
                <li key={item} className="text-sm text-text-secondary leading-relaxed">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="Retroactive cover" />
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">{profession.retroactiveNote}</p>
          </div>
          <div>
            <SectionHeading title="Run-off cover" />
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">{profession.runOffNote}</p>
          </div>
        </div>
      </Section>

      <Section bg="soft-green">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-8 max-w-3xl">
          <FaqAccordion faqs={profession.faqs} />
        </div>
      </Section>

      <Section bg="dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Get your {profession.name} PI quote
            </h2>
            <p className="mt-2 text-white/70 max-w-lg">
              One simple online application, tailored to how {profession.pluralName.toLowerCase()} actually work.
            </p>
          </div>
          <LinkButton href={`/quote?profession=${profession.slug}`} size="lg">
            Get My Quote
          </LinkButton>
        </div>
        {profession.slug === "it-consultants" && (
          <p className="mt-6 text-sm text-white/70">
            Software house or complex IT business?{" "}
            <Link
              href="/professional-indemnity-technology-quote"
              className="text-accent font-semibold hover:underline"
            >
              Complete our detailed Technology PI proposal form
            </Link>{" "}
            instead.
          </p>
        )}
      </Section>

      {(relatedProfessions.length > 0 || relatedProducts.length > 0) && (
        <Section bg="white">
          <div className="grid md:grid-cols-2 gap-10">
            {relatedProfessions.length > 0 && (
              <div>
                <SectionHeading title="Related professions" />
                <ul className="mt-4 space-y-2">
                  {relatedProfessions.map((rp) => (
                    <li key={rp.slug}>
                      <Link
                        href={`/professional-indemnity/${rp.slug}`}
                        className="text-sm font-semibold text-green hover:text-green-dark"
                      >
                        {rp.pluralName} PI →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedProducts.length > 0 && (
              <div>
                <SectionHeading title="Related covers" />
                <ul className="mt-4 space-y-3">
                  {relatedProducts.map((rp) => (
                    <li key={rp.slug}>
                      <Link
                        href={`/products/${rp.slug}`}
                        className="text-sm font-semibold text-green hover:text-green-dark"
                      >
                        {rp.product?.name} →
                      </Link>
                      <p className="text-xs text-text-secondary mt-1">{rp.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}
    </>
  );
}
