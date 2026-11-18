import { Section, SectionHeading } from "@/components/ui/Section";
import { professions } from "@/data/professions";

const examples = [
  { profession: "architects", claim: professions.find((p) => p.slug === "architects")?.commonClaims[0] },
  { profession: "it-consultants", claim: professions.find((p) => p.slug === "it-consultants")?.commonClaims[0] },
  { profession: "insurance-brokers", claim: professions.find((p) => p.slug === "insurance-brokers")?.commonClaims[0] },
  { profession: "accountants", claim: professions.find((p) => p.slug === "accountants")?.commonClaims[0] },
].filter((e): e is { profession: string; claim: NonNullable<typeof e.claim> } => Boolean(e.claim));

export function ClaimsExamples() {
  return (
    <Section bg="warm">
      <SectionHeading
        eyebrow="Claims examples"
        title="What a Professional Indemnity claim actually looks like"
        description="Understanding real claim scenarios helps clarify what PI cover is for — and why it matters before something goes wrong."
      />
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {examples.map((example) => (
          <div key={example.profession} className="bg-white border border-border rounded-lg p-6">
            <p className="text-xs font-bold tracking-widest text-green uppercase">
              {example.profession.replace("-", " ")}
            </p>
            <h3 className="mt-2 font-semibold text-text-dark">{example.claim.title}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              {example.claim.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
