import type { Metadata } from "next";
import { GuideLandingPage } from "@/components/guides/GuideLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Proof of Insurance",
  description:
    "What proof of insurance is, when you'll be asked for it, what it includes, and how to get yours from BackedSure — for tenders, regulators, clients and landlords.",
  path: "/proof-of-insurance",
});

const guideSections = [
  {
    heading: "What is proof of insurance?",
    body: "Proof of insurance — sometimes called a certificate of insurance or a broker's letter of confirmation — is a short document confirming that you hold active cover. It states who the insured is, which insurer holds the risk, what class of business is covered, the limit of indemnity, and the period the policy runs for.",
  },
  {
    heading: "When will you be asked for it?",
    body: "Proof of insurance is most commonly requested during tenders and RFPs, when renewing registration with a regulator or professional body, when a client or landlord's contract requires evidence of cover as a condition of appointment, or at project sign-off. Deadlines for these requests are often short, so it helps to know in advance how to get yours.",
  },
  {
    heading: "What does it include?",
    body: "A standard proof of insurance document sets out the insured entity's name and registration details, the insurer's name, your policy number, the class of business and limit of indemnity, the period of insurance, and — for claims-made covers like Professional Indemnity — your retroactive date. Some clients or tenders ask for additional confirmations, such as being noted as an interested party.",
  },
  {
    heading: "How do you get yours from BackedSure?",
    body: "Once your policy is active, your proof of insurance and other policy documents are available from your BackedSure dashboard. If you need it urgently, or need a document formatted for a specific tender or client requirement, our team can issue one directly — just get in touch.",
  },
  {
    heading: "Keeping it current",
    body: "Proof of insurance reflects your cover at a point in time, so it needs to be reissued whenever your policy renews, your limit of indemnity changes, or your business details change. Check the validity period on any document before submitting it, particularly close to a renewal date.",
  },
];

const whatItCovers = [
  "Insured name and business registration details",
  "Insurer name and your policy number",
  "Class of business and limit of indemnity",
  "Period of insurance and, for claims-made policies, your retroactive date",
];

const whoNeedsIt = [
  "Responding to a tender or RFP that requires evidence of cover",
  "Renewing registration with a regulator or professional body",
  "Meeting a client or landlord's contractual insurance requirement",
  "Project sign-off or close-out documentation",
];

const faqs = [
  {
    question: "Is proof of insurance the same as a certificate of insurance?",
    answer:
      "Yes — these terms are generally used interchangeably to describe a short confirmation of your active cover, insurer, limit and period of insurance.",
  },
  {
    question: "How quickly can I get proof of insurance?",
    answer:
      "Once your policy is active, proof of insurance is available from your BackedSure dashboard. If you need it urgently for a tender deadline, contact our team and we'll issue it directly.",
  },
  {
    question: "Can I get proof of insurance before my policy renews?",
    answer:
      "Yes, current proof of insurance reflects your active policy period — you don't need to wait for renewal. If your renewal is approaching and you need cover confirmed past the current period, let us know so we can time the document correctly.",
  },
  {
    question: "Does proof of insurance show my full policy wording?",
    answer:
      "No — it's a summary confirming key details of your cover, not the full policy document. Your complete policy wording and schedule are also available from your dashboard.",
  },
  {
    question: "What if a tender or client asks for something specific, like being named an interested party?",
    answer:
      "Let us know the exact requirement — some tenders and client contracts ask for additional wording or confirmations, and our team can advise whether this is something your policy can accommodate.",
  },
];

export default function ProofOfInsurancePage() {
  return (
    <GuideLandingPage
      breadcrumbLabel="Proof of Insurance"
      breadcrumbPath="/proof-of-insurance"
      h1="Proof of Insurance"
      intro="Need to confirm your cover for a tender, regulator, client or landlord? Here's what proof of insurance includes, when you'll need it, and how to get yours."
      heroCtaLabel="Log in to your dashboard"
      heroCtaHref="/login"
      guideSections={guideSections}
      whatItCoversTitle="What it includes"
      whatItCovers={whatItCovers}
      whoNeedsItTitle="When you'll need it"
      whoNeedsIt={whoNeedsIt}
      faqs={faqs}
      closingHeading="Need proof of insurance urgently, or don't have cover yet?"
      closingCtaLabel="Contact us"
      closingCtaHref="/contact"
    />
  );
}
