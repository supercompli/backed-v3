import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ClaimForm } from "@/components/claims/ClaimForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Report a Professional Indemnity Claim",
  description: "Notify BackedSure of a potential or actual Professional Indemnity claim.",
  path: "/claims",
});

export default function ClaimsPage() {
  return (
    <>
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-12 md:pt-8 md:pb-16">
          <Breadcrumbs items={[{ name: "Claims", path: "/claims" }]} />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-2xl leading-[1.1]">
            Need to report a Professional Indemnity claim?
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
            Notify potential claims early. Most policies require prompt notification of
            circumstances that could give rise to a claim, not only once a formal claim is
            received.
          </p>
        </div>
      </div>

      <Section bg="white">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div>
            <SectionHeading title="Before you submit" />
            <ul className="mt-6 space-y-3">
              {[
                "Notify as soon as you become aware of a potential claim, even before a formal letter of demand.",
                "Avoid admitting liability or agreeing to settle directly with a claimant.",
                "Keep any correspondence, contracts and documents related to the matter.",
                "Your policy number and business details help us process your notification faster.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ClaimForm />
        </div>
      </Section>
    </>
  );
}
