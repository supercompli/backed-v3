import { Section, SectionHeading } from "@/components/ui/Section";

const steps = [
  { number: "01", title: "Choose your profession", description: "Select your profession so we can ask the right underwriting questions from the start." },
  { number: "02", title: "Tell us about your business", description: "Share your fee income, team size and years in business — it takes a few minutes." },
  { number: "03", title: "Receive your PI options or underwriting response", description: "Get an instant result, an indicative premium, or confirmation that a specialist is preparing your submission." },
  { number: "04", title: "Choose your cover", description: "Review your options, confirm your details and complete your application online." },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" bg="warm">
      <SectionHeading
        eyebrow="How it works"
        title="One digital journey from application to cover."
      />
      <div className="mt-12 grid md:grid-cols-4 gap-8 md:gap-6">
        {steps.map((step) => (
          <div key={step.number} className="border-t-2 border-primary-dark pt-5">
            <span className="text-sm font-bold text-green">{step.number}</span>
            <h3 className="mt-3 font-semibold text-text-dark text-lg">{step.title}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
