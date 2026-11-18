import type { Metadata } from "next";
import { SATechnologyProposalForm } from "@/components/quote/SATechnologyProposalForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SA Professional Indemnity Technology Proposal Form",
  description:
    "Detailed Professional Indemnity proposal form for South African software developers, IT consultants and technology businesses.",
  path: "/sa-professional-indemnity-technology-quote",
});

export default function SATechnologyProposalPage() {
  return (
    <div className="bg-warm-bg">
      <div className="container-page py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <p className="text-xs font-bold tracking-widest text-green uppercase mb-3">
            Software & IT specialists
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-dark">
            SA Professional Indemnity — Technology
          </h1>
          <p className="mt-3 text-text-secondary">
            For South African software developers, systems integrators, IT consultancies and other
            technology businesses. Your progress is saved automatically as you go.
          </p>
        </div>
        <SATechnologyProposalForm />
      </div>
    </div>
  );
}
