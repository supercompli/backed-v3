import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  description:
    "See how BackedSure's online Professional Indemnity application works, from choosing your profession to receiving your underwriting result.",
  path: "/how-it-works",
});

const steps = [
  {
    number: "01",
    title: "Choose your profession",
    description:
      "Select your profession so we can ask the right underwriting questions from the start, instead of a generic one-size-fits-all form.",
  },
  {
    number: "02",
    title: "Tell us about your business",
    description:
      "Share your fee income, team size and years in business. Most applicants complete this in a few minutes.",
  },
  {
    number: "03",
    title: "Receive your PI options or underwriting response",
    description:
      "Get an instant result, an indicative premium, or confirmation that a specialist underwriter is preparing your submission.",
  },
  {
    number: "04",
    title: "Choose your cover",
    description:
      "Review your options, confirm your details and complete your application online — no paperwork, no branch visits.",
  },
];

const faqs = [
  {
    question: "How long does an application take?",
    answer:
      "Most applicants complete the online form in under 10 minutes. Some professions or higher fee incomes may need extra underwriting information.",
  },
  {
    question: "Will I always get an instant price?",
    answer:
      "Not always. We classify every application as standard, indicative or refer, and we're upfront about which one you'll get rather than showing a fabricated instant price.",
  },
  {
    question: "What happens if my application needs a specialist?",
    answer:
      "A specialist underwriter reviews your submission and follows up directly — you don't need to start over or resubmit anything.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-warm-bg border-b border-border">
        <div className="container-page relative z-10 py-16 md:py-24">
          <Breadcrumbs items={[{ name: "How It Works", path: "/how-it-works" }]} />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="text-center lg:text-left">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green/30 bg-soft-green px-3 py-1 text-sm font-bold text-green-dark">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
                </span>
                How it works
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] text-primary-dark">
                One digital journey
                <br />
                from application to <span className="text-green">cover.</span>
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-xl font-light text-text-secondary md:text-2xl lg:mx-0">
                No branch visits, no paperwork. Apply for Professional Indemnity Insurance online
                in four simple steps.
              </p>
              <div className="flex flex-col items-center justify-center gap-6 lg:items-start">
                <LinkButton
                  href="/quote"
                  size="lg"
                  className="w-full sm:w-auto px-10 py-5 text-xl shadow-2xl shadow-primary-dark/20 hover:scale-105 uppercase tracking-tight"
                >
                  Get a Quote
                </LinkButton>
                <div className="flex flex-col items-center justify-center gap-3 text-sm font-semibold text-text-secondary sm:flex-row sm:gap-6 md:text-base lg:justify-start">
                  <span>Specialist Professional Indemnity underwriting</span>
                  <span>Instant or same-week results</span>
                  <span>Secure online application</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-5 rounded-[2rem] bg-accent/30 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-warm-bg shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1758876203026-99a024dc43b9?auto=format&fit=crop&w=1200&q=85"
                  alt="Two business colleagues reviewing documents together at a laptop"
                  width={1200}
                  height={900}
                  priority
                  className="h-[360px] w-full object-cover md:h-[480px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section bg="white">
        <SectionHeading
          eyebrow="The process"
          title="From profession to cover in four steps"
          description="Every step happens online, and you always know where your application stands."
        />
        <div className="mt-12 grid md:grid-cols-2 gap-8 md:gap-10">
          {steps.map((step) => (
            <div key={step.number} className="border-t-2 border-primary-dark pt-5">
              <span className="text-sm font-bold text-green">{step.number}</span>
              <h3 className="mt-3 font-semibold text-text-dark text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="soft-green">
        <SectionHeading eyebrow="Questions" title="Common questions about the process" />
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white border border-border rounded-lg p-6">
              <h3 className="font-semibold text-text-dark">{faq.question}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg">
              Ready to start your application?
            </h2>
            <p className="mt-3 text-white/70 max-w-lg">
              Choose your profession and get your Professional Indemnity options online.
            </p>
          </div>
          <LinkButton href="/quote" size="lg">
            Get a Quote
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
