import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CostEstimatorWidget } from "@/components/pi/CostEstimatorWidget";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How much does Professional Indemnity Insurance cost?",
  description:
    "What drives Professional Indemnity premiums in South Africa, and how to estimate your requirements before applying.",
  path: "/professional-indemnity/cost",
});

const factors = [
  "Profession",
  "Revenue / fees",
  "Type of work",
  "Claims history",
  "Contract values",
  "Territory",
  "Limit of indemnity",
  "Excess",
  "Retroactive exposure",
];

export default function PiCostPage() {
  return (
    <>
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs
            items={[
              { name: "Professional Indemnity", path: "/professional-indemnity" },
              { name: "Cost", path: "/professional-indemnity/cost" },
            ]}
          />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-3xl leading-[1.1]">
            How much does Professional Indemnity Insurance cost?
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
            There is no single market rate for PI insurance. Pricing is set by underwriters based
            on your specific risk profile — we won&apos;t publish a number that doesn&apos;t reflect your
            business.
          </p>
        </div>
      </div>

      <Section bg="white">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <SectionHeading title="What determines your premium" />
            <ul className="mt-6 space-y-3">
              {factors.map((factor) => (
                <li key={factor} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-text-secondary leading-relaxed">
              Two businesses in the same profession can have materially different premiums once
              claims history, contract values and territory are taken into account. That&apos;s why
              BackedSure asks profession-specific questions rather than quoting from a flat rate
              card.
            </p>
          </div>
          <CostEstimatorWidget />
        </div>
      </Section>
    </>
  );
}
