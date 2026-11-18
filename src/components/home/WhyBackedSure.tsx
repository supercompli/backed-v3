import { Section, SectionHeading } from "@/components/ui/Section";

const reasons = [
  { title: "Specialist PI focus", body: "Professional Indemnity is our core product, not an add-on to a general brokerage — every part of the platform is built around it." },
  { title: "Profession-specific underwriting", body: "Questions, cover guidance and risk factors are tailored to how your profession actually operates." },
  { title: "Transparent triage", body: "You always know whether your result is standard, indicative or referred for specialist underwriting — never a fabricated instant price." },
  { title: "Digital from application to renewal", body: "Manage applications, documents, policies and renewals in one place, without paper forms." },
];

export function WhyBackedSure() {
  return (
    <Section bg="dark">
      <SectionHeading
        eyebrow="Why BackedSure"
        title="Built as a specialist PI platform, not a general brokerage."
        tone="light"
      />
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {reasons.map((reason) => (
          <div key={reason.title} className="border-t border-white/15 pt-5">
            <h3 className="font-semibold text-white">{reason.title}</h3>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">{reason.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
