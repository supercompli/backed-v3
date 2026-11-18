import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About BackedSure",
  description:
    "BackedSure is a South African specialist insurance platform focused on Professional Indemnity Insurance for professionals and professional-service businesses.",
  path: "/about",
});

const values = [
  { title: "Specialist, not generalist", body: "Professional Indemnity is our core focus, so every part of the platform — questions, guidance, underwriting routing — is built around it." },
  { title: "Honest triage", body: "We classify every application as standard, indicative or refer, and never present a fabricated instant price." },
  { title: "Digital by default", body: "From application to renewal, your PI journey happens online, with specialist support where you need it." },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-warm-bg border-b border-border">
        <div className="container-page pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-2xl leading-[1.1]">
            About BackedSure
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
            BackedSure is a South African specialist insurance platform focused on Professional
            Indemnity Insurance for professionals and professional-service businesses.
          </p>
        </div>
      </div>

      <Section bg="white">
        <div className="max-w-2xl space-y-5">
          <p className="text-text-secondary leading-relaxed">
            Professional Indemnity is a specialist line of insurance — the questions that matter
            for an architect are different from those that matter for an insurance broker or an
            IT consultant. Generic insurance platforms treat PI as one product among many. We
            built BackedSure to treat it as the primary product it is.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Our platform combines profession-specific underwriting questions with a transparent
            triage process, so you always know whether your application is suitable for an
            online result or needs a specialist underwriter&apos;s attention.
          </p>
        </div>
      </Section>

      <Section bg="soft-green">
        <SectionHeading eyebrow="How we work" title="What guides the platform" />
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {values.map((value) => (
            <div key={value.title} className="bg-white border border-border rounded-lg p-6">
              <h3 className="font-semibold text-text-dark">{value.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{value.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg">
            Start your Professional Indemnity application.
          </h2>
          <LinkButton href="/quote" size="lg">
            Get a Quote
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
