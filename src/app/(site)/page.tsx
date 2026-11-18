import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { PopularProfessions } from "@/components/home/PopularProfessions";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PiExplainer } from "@/components/home/PiExplainer";
import { QuoteEngineTeaser } from "@/components/home/QuoteEngineTeaser";
import { WhyBackedSure } from "@/components/home/WhyBackedSure";
import { ProfessionDirectoryTeaser } from "@/components/home/ProfessionDirectoryTeaser";
import { ClaimsExamples } from "@/components/home/ClaimsExamples";
import { RelatedCoversTeaser } from "@/components/home/RelatedCoversTeaser";
import { ResourcesTeaser } from "@/components/home/ResourcesTeaser";
import { HomeFaq } from "@/components/home/HomeFaq";
import { FinalCta } from "@/components/home/FinalCta";
import { buildMetadata, insuranceAgencySchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Professional Indemnity Insurance, simplified.",
  description:
    "Get Professional Indemnity cover for your profession. Complete one simple online application and let BackedSure help you find suitable cover.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={insuranceAgencySchema()} />
      <Hero />
      <TrustStrip />
      <PopularProfessions />
      <HowItWorks />
      <PiExplainer />
      <QuoteEngineTeaser />
      <WhyBackedSure />
      <ProfessionDirectoryTeaser />
      <ClaimsExamples />
      <RelatedCoversTeaser />
      <ResourcesTeaser />
      <HomeFaq />
      <FinalCta />
    </>
  );
}
