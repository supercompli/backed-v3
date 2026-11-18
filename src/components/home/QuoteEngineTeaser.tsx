import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";

const outcomes = [
  {
    label: "Standard",
    title: "Suitable for online quotation",
    body: "Where approved rating rules exist for your profession and risk profile, you can continue straight to application.",
  },
  {
    label: "Indicative",
    title: "Estimated premium, subject to underwriting",
    body: "We'll show an indicative monthly premium and cover summary, confirmed once underwriting is complete.",
  },
  {
    label: "Refer",
    title: "Specialist underwriting required",
    body: "For complex or higher-risk profiles, a BackedSure specialist prepares the appropriate submission on your behalf.",
  },
];

export function QuoteEngineTeaser() {
  return (
    <Section bg="white">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <SectionHeading
          eyebrow="The quote engine"
          title="A quote process built on real underwriting, not guesswork."
          description="BackedSure never invents a binding premium where no rating model exists. Your application is triaged into one of three honest outcomes."
        />
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {outcomes.map((outcome) => (
          <div key={outcome.label} className="rounded-lg border border-border p-6 bg-warm-bg">
            <span className="text-xs font-bold tracking-widest uppercase text-green">
              {outcome.label}
            </span>
            <h3 className="mt-3 font-semibold text-text-dark">{outcome.title}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">{outcome.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <LinkButton href="/quote">Get My Quote</LinkButton>
      </div>
    </Section>
  );
}
