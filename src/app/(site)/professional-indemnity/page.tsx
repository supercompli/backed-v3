import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, faqSchema, insuranceAgencySchema } from "@/lib/seo";
import { generalPIFaqs } from "@/data/faqs";
import { professions } from "@/data/professions";
import { piTopics } from "@/data/piTopics";
import { coverLimits } from "@/data/coverLimits";
import { piGuides, type PiGuideCategory } from "@/data/piGuides";

export const metadata: Metadata = buildMetadata({
  title: "Professional Indemnity Insurance — a complete guide",
  description:
    "What Professional Indemnity Insurance is, who needs it, what it covers, how much it costs, and how to get cover for your profession in South Africa.",
  path: "/professional-indemnity",
});

const guideSections = [
  {
    heading: "What is Professional Indemnity?",
    body: "Professional Indemnity (PI) Insurance covers your business against claims from clients or third parties alleging financial loss caused by negligent advice, errors, omissions or breach of professional duty. It responds to the cost of defending a claim, and any damages or settlement payable, subject to your policy terms.",
  },
  {
    heading: "Who needs PI insurance?",
    body: "Any business that gives advice, designs, certifies, advises on transactions or provides a professional service for a fee typically carries PI exposure. This includes architects, engineers, accountants, financial advisers, IT consultants, project managers and many other professions.",
  },
  {
    heading: "What does PI cover?",
    body: "PI cover generally responds to allegations of negligence, error, omission or breach of professional duty in the advice or service you provide, plus your legal defence costs — even where a claim is ultimately unsuccessful.",
  },
  {
    heading: "What does it not cover?",
    body: "PI does not typically cover deliberate or fraudulent acts, bodily injury or property damage (usually a Public Liability matter), or liability you assume under contract terms broader than your ordinary duty of care.",
  },
  {
    heading: "How much PI insurance do I need?",
    body: "Your limit of indemnity should reflect your largest realistic claim exposure — often linked to your biggest project or contract value — and any minimum requirements set by regulators, professional bodies or client contracts.",
  },
  {
    heading: "How much does PI insurance cost?",
    body: "Pricing depends on your profession, turnover, claims history, contract values, territory and the limit and excess you choose. There is no single market rate — see our dedicated cost guide for a breakdown of what drives premium.",
  },
];

const guideCategoryOrder: PiGuideCategory[] = [
  "Policy mechanics",
  "Buying process",
  "Contracts & tenders",
  "Comparisons",
  "Emerging risk",
];

export default function ProfessionalIndemnityHub() {
  return (
    <>
      <JsonLd data={insuranceAgencySchema()} />
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "Professional Indemnity", path: "/professional-indemnity" }]} />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-3xl leading-[1.1]">
            Professional Indemnity Insurance
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
            Cover for professionals and professional-service businesses against claims arising
            from errors, omissions, negligence and professional advice — explained simply, by
            profession.
          </p>
          <div className="mt-8">
            <LinkButton href="/quote" size="lg">
              Get a PI Quote
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

      <Section bg="white">
        <SectionHeading title="Understand the mechanics of a PI policy" />
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {piTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/professional-indemnity/${topic.slug}`}
              className="group rounded-2xl border border-[#dfe6ef] bg-[#f8fafc] p-6 shadow-[0_3px_8px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
            >
              <h3 className="text-base font-extrabold text-[#10172a]">{topic.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#40516a]">{topic.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#ef233c]">
                Learn more
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  -&gt;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section bg="white">
        <SectionHeading
          title="PI insurance guides"
          description="In-depth guides on policy mechanics, the buying process, contracts and tenders, and how PI compares to other covers."
        />
        <div className="mt-10 space-y-10">
          {guideCategoryOrder.map((category) => {
            const guidesInCategory = piGuides.filter((g) => g.category === category);
            if (guidesInCategory.length === 0) return null;
            return (
              <div key={category}>
                <p className="text-xs font-bold tracking-widest text-green uppercase mb-4">
                  {category}
                </p>
                <div className="flex flex-wrap gap-3">
                  {guidesInCategory.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/professional-indemnity/${g.slug}`}
                      className="text-sm bg-[#f8fafc] border border-[#dfe6ef] rounded-full px-4 py-2 hover:border-[#cbd5e1]"
                    >
                      {g.eyebrow}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section bg="white">
        <SectionHeading title="Choose your limit of indemnity" />
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {coverLimits.map((c) => (
            <Link
              key={c.slug}
              href={`/professional-indemnity/${c.slug}`}
              className="group rounded-2xl border border-[#dfe6ef] bg-[#f8fafc] p-6 shadow-[0_3px_8px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
            >
              <h3 className="text-base font-extrabold text-[#10172a]">{c.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#40516a]">{c.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#ef233c]">
                Learn more
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  -&gt;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section bg="white">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading title="Professional Indemnity by profession" />
          <Link href="/professions" className="text-xs font-extrabold uppercase tracking-wide text-[#ef233c] hover:text-[#c8102e]">
            View all professions →
          </Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {professions.map((p) => (
            <Link
              key={p.slug}
              href={`/professional-indemnity/${p.slug}`}
              className="group rounded-2xl border border-[#dfe6ef] bg-[#f8fafc] p-6 shadow-[0_3px_8px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
            >
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#ef233c]">{p.category}</p>
              <h3 className="mt-3 text-base font-extrabold text-[#10172a]">{p.pluralName}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#40516a]">{p.shortDescription}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#ef233c]">
                Learn more
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  -&gt;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section bg="warm">
        <JsonLd data={faqSchema(generalPIFaqs)} />
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-8 max-w-3xl">
          <FaqAccordion faqs={generalPIFaqs} />
        </div>
      </Section>

      <Section bg="dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg">
            Ready to start your Professional Indemnity application?
          </h2>
          <LinkButton href="/quote" size="lg">
            Get a Quote
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
