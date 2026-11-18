import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";

const points = [
  {
    title: "What is Professional Indemnity?",
    body: "Cover that responds when a client alleges your advice, design or professional service caused them financial loss.",
  },
  {
    title: "Claims-made basis",
    body: "PI policies respond to claims made while the policy is active — your retroactive date determines how far back cover reaches.",
  },
  {
    title: "Built for your profession",
    body: "Underwriting questions and cover recommendations are tailored to how your profession actually works.",
  },
];

export function PiExplainer() {
  return (
    <Section bg="soft-green">
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">
        <SectionHeading
          eyebrow="Professional Indemnity"
          title="Cover for the advice you give, not just the work you do."
          description="Professional Indemnity is different to general business insurance. It protects your practice against the financial consequences of professional error — not property damage or bodily injury."
        />
        <div className="grid sm:grid-cols-1 gap-6">
          {points.map((point) => (
            <div key={point.title} className="bg-white border border-border rounded-lg p-6">
              <h3 className="font-semibold text-text-dark">{point.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{point.body}</p>
            </div>
          ))}
          <Link
            href="/professional-indemnity"
            className="text-sm font-semibold text-green hover:text-green-dark"
          >
            Read the full Professional Indemnity guide →
          </Link>
        </div>
      </div>
    </Section>
  );
}
