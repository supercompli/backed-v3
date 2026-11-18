import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { generalPIFaqs } from "@/data/faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo";

export function HomeFaq() {
  const faqs = generalPIFaqs.slice(0, 6);
  return (
    <Section bg="white">
      <JsonLd data={faqSchema(faqs)} />
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
      <div className="mt-10 max-w-3xl">
        <FaqAccordion faqs={faqs} />
      </div>
    </Section>
  );
}
