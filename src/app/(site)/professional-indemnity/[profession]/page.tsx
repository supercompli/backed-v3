import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { professions, getProfessionBySlug } from "@/data/professions";
import { piTopics, getPiTopicBySlug } from "@/data/piTopics";
import { coverLimits, getCoverLimitBySlug } from "@/data/coverLimits";
import { piGuides, getPiGuideBySlug } from "@/data/piGuides";
import { ProfessionPageTemplate } from "@/components/profession/ProfessionPageTemplate";
import { PiGuideTemplate } from "@/components/pi/PiGuideTemplate";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { CostEstimatorWidget } from "@/components/pi/CostEstimatorWidget";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [
    ...professions.map((p) => ({ profession: p.slug })),
    ...piTopics.map((t) => ({ profession: t.slug })),
    ...coverLimits.map((c) => ({ profession: c.slug })),
    ...piGuides.map((g) => ({ profession: g.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string }>;
}): Promise<Metadata> {
  const { profession: slug } = await params;
  const profession = getProfessionBySlug(slug);
  if (profession) {
    return buildMetadata({
      title: `Professional Indemnity Insurance for ${profession.pluralName}`,
      description: profession.shortDescription,
      path: `/professional-indemnity/${profession.slug}`,
    });
  }

  const topic = getPiTopicBySlug(slug);
  if (topic) {
    return buildMetadata({
      title: topic.title,
      description: topic.description,
      path: `/professional-indemnity/${topic.slug}`,
    });
  }

  const coverLimit = getCoverLimitBySlug(slug);
  if (coverLimit) {
    return buildMetadata({
      title: coverLimit.title,
      description: coverLimit.description,
      path: `/professional-indemnity/${coverLimit.slug}`,
    });
  }

  const guide = getPiGuideBySlug(slug);
  if (guide) {
    return buildMetadata({
      title: guide.title,
      description: guide.description,
      path: `/professional-indemnity/${guide.slug}`,
    });
  }

  return {};
}

export default async function ProfessionOrTopicPage({
  params,
}: {
  params: Promise<{ profession: string }>;
}) {
  const { profession: slug } = await params;

  const profession = getProfessionBySlug(slug);
  if (profession) {
    return <ProfessionPageTemplate profession={profession} />;
  }

  const topic = getPiTopicBySlug(slug);
  if (topic) {
    return (
      <>
        <div className="bg-warm-bg border-b border-border">
          <div className="container-page pt-6 pb-12 md:pt-8 md:pb-16">
            <Breadcrumbs
              items={[
                { name: "Professional Indemnity", path: "/professional-indemnity" },
                { name: topic.eyebrow, path: `/professional-indemnity/${topic.slug}` },
              ]}
            />
            <p className="mt-6 text-xs font-bold tracking-widest text-green uppercase">
              {topic.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-primary-dark leading-[1.1] max-w-3xl">
              {topic.title}
            </h1>
            <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
              {topic.description}
            </p>
          </div>
        </div>

        <Section bg="white">
          <div className="max-w-3xl space-y-12">
            {topic.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-2xl font-bold text-primary-dark">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-text-secondary leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
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

        <Section bg="soft-green">
          <p className="text-xs font-bold tracking-widest text-green uppercase mb-4">
            PI by profession
          </p>
          <div className="flex flex-wrap gap-3">
            {professions.slice(0, 10).map((p) => (
              <Link
                key={p.slug}
                href={`/professional-indemnity/${p.slug}`}
                className="text-sm bg-white border border-border rounded-full px-4 py-2 hover:border-green"
              >
                {p.pluralName}
              </Link>
            ))}
          </div>
        </Section>
      </>
    );
  }

  const coverLimit = getCoverLimitBySlug(slug);
  if (coverLimit) {
    return (
      <>
        <div className="bg-warm-bg border-b border-border">
          <div className="container-page pt-6 pb-12 md:pt-8 md:pb-16">
            <Breadcrumbs
              items={[
                { name: "Professional Indemnity", path: "/professional-indemnity" },
                { name: coverLimit.eyebrow, path: `/professional-indemnity/${coverLimit.slug}` },
              ]}
            />
            <p className="mt-6 text-xs font-bold tracking-widest text-green uppercase">
              {coverLimit.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-primary-dark leading-[1.1] max-w-3xl">
              {coverLimit.title}
            </h1>
            <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
              {coverLimit.description}
            </p>
            <div className="mt-8">
              <LinkButton href={`/quote?coverLimit=${coverLimit.amountValue}`} size="lg">
                Get a {coverLimit.label} PI Quote
              </LinkButton>
            </div>
          </div>
        </div>

        <Section bg="white">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <SectionHeading title="Who typically requests this limit" />
              <ul className="mt-6 space-y-3">
                {coverLimit.whoRequestsIt.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading title="Contractual & tender requirements" />
              <ul className="mt-6 space-y-3">
                {coverLimit.contractualRequirements.map((item) => (
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
          <SectionHeading title="Premium implications" />
          <p className="mt-6 max-w-3xl text-sm text-text-dark leading-relaxed">
            {coverLimit.premiumImplications}
          </p>
        </Section>

        <Section bg="white">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <SectionHeading title="Limit vs excess: what's the difference?" />
              <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                Your limit of indemnity is the maximum amount your insurer will pay out for a
                covered claim, or across all claims in the policy period if your limit applies in
                the aggregate. Your excess is the amount you contribute toward each claim before
                the insurer&apos;s payment applies. The two are set independently — you can hold a
                high limit with a modest excess suited to your risk profile, or accept a higher
                excess to reduce your premium. Choosing a limit does not determine your excess, and
                vice versa; both should be set deliberately based on your claim exposure and risk
                appetite.
              </p>
              <Link
                href="/professional-indemnity/excess"
                className="mt-3 inline-block text-sm font-semibold text-green hover:text-green-dark"
              >
                Read the full excess guide →
              </Link>
            </div>
            <div>
              <SectionHeading title="Aggregate vs each-and-every claim" />
              <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                Some PI policies apply the limit of indemnity &ldquo;in the aggregate&rdquo; —
                the total available across all claims made during the policy period. Others apply
                it &ldquo;any one claim&rdquo; (each-and-every-claim), where the full limit is
                available again for every separate claim, regardless of how many arise in the
                period. An aggregate limit can be eroded quickly if you face multiple claims in one
                year, while an each-and-every-claim structure gives broader protection for
                higher-claim-frequency professions, priced accordingly. Always confirm which
                structure applies before comparing quotes on the basis of limit alone.
              </p>
              <Link
                href="/professional-indemnity/aggregate-vs-any-one-claim"
                className="mt-3 inline-block text-sm font-semibold text-green hover:text-green-dark"
              >
                Read the full aggregate vs any-one-claim guide →
              </Link>
            </div>
          </div>
        </Section>

        <Section bg="warm">
          <SectionHeading
            eyebrow="Quote calculator"
            title={`Check your eligibility for ${coverLimit.label} cover`}
          />
          <div className="mt-8 max-w-2xl">
            <CostEstimatorWidget defaultCoverLimit={coverLimit.amountValue} />
          </div>
        </Section>

        <Section bg="soft-green">
          <p className="text-xs font-bold tracking-widest text-green uppercase mb-4">
            Other limits of indemnity
          </p>
          <div className="flex flex-wrap gap-3">
            {coverLimits
              .filter((c) => c.slug !== coverLimit.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/professional-indemnity/${c.slug}`}
                  className="text-sm bg-white border border-border rounded-full px-4 py-2 hover:border-green"
                >
                  {c.label}
                </Link>
              ))}
          </div>
        </Section>

        <Section bg="dark">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg">
              Get your {coverLimit.label} Professional Indemnity quote.
            </h2>
            <LinkButton href={`/quote?coverLimit=${coverLimit.amountValue}`} size="lg">
              Get a Quote
            </LinkButton>
          </div>
        </Section>
      </>
    );
  }

  const guide = getPiGuideBySlug(slug);
  if (guide) {
    return <PiGuideTemplate guide={guide} />;
  }

  notFound();
}
