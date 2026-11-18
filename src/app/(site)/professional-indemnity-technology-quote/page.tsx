import type { Metadata } from "next";
import { TechnologyProposalForm } from "@/components/quote/TechnologyProposalForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Technology & IT Professional Indemnity Proposal Form",
  description:
    "Detailed Professional Indemnity proposal form for software developers, IT consultants and technology businesses, based on the iTOO Special Risks Technology/Telecommunications proposal.",
  path: "/professional-indemnity-technology-quote",
});

export default function TechnologyProposalPage() {
  return (
    <div className="bg-warm-bg">
      <div className="container-page py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <p className="text-xs font-bold tracking-widest text-green uppercase mb-3">
            Software & IT specialists
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-dark">
            Technology Professional Indemnity
          </h1>
          <p className="mt-3 text-text-secondary">
            For software developers, systems integrators, IT consultancies and other technology
            businesses. It takes 3 minutes to complete, and your progress is saved automatically as you go.
          </p>
        </div>
        <TechnologyProposalForm />
      </div>
    </div>
  );
}
