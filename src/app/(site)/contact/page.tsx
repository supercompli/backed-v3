import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact BackedSure",
  description: "Speak to a BackedSure Professional Indemnity specialist.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-14 md:pt-8 md:pb-16">
          <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-2xl leading-[1.1]">
            Speak to a specialist
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
            Have a question before you apply, or a complex risk to discuss? Reach out and a
            BackedSure specialist will respond.
          </p>
        </div>
      </div>

      <Section bg="white">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div>
            <SectionHeading title="Contact details" />
            <div className="mt-6 space-y-4 text-sm text-text-secondary">
              <p>Email: hello@backedsure.co.za</p>
              <p>Hours: Monday – Friday, 08:00 – 17:00 SAST</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
