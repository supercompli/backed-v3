import type { Metadata } from "next";
import { GuideLandingPage } from "@/components/guides/GuideLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Security Company Liability Insurance",
  description:
    "Liability insurance for security companies in South Africa — guarding, armed response, alarm monitoring and VIP protection. What it covers, who needs it, and what drives cost.",
  path: "/security-liability-insurance",
});

const guideSections = [
  {
    heading: "What is security liability insurance?",
    body: "Security liability insurance is a combination of covers built around the specific risks security businesses face — guarding, armed response, alarm monitoring, access control and VIP protection. It typically blends Public Liability for third-party injury or property damage, Professional Indemnity for negligent advice or service failures, and Fidelity Guarantee for theft or dishonesty by guards and staff with access to client premises and valuables.",
  },
  {
    heading: "Who needs it?",
    body: "Any registered security business providing guarding, armed response, alarm monitoring, cash-in-transit, event security or close protection services carries meaningful liability exposure — both to the clients whose sites they protect and to third parties who may be affected by a response.",
  },
  {
    heading: "What does it typically cover?",
    body: "Cover generally responds to bodily injury or property damage caused during a security operation, negligent failure to respond or detect an incident, and theft or dishonesty by an employee at a client's premises. Many security businesses also carry cover for wrongful arrest, assault allegations arising from a response, and errors in monitoring or dispatch.",
  },
  {
    heading: "What does it typically exclude?",
    body: "Deliberate criminal acts by the business or its principals, contractual liabilities assumed beyond the ordinary duty of care, and losses arising from unlicensed or unregistered operators are generally excluded. Cover is also conditional on the business and its officers holding valid PSIRA registration.",
  },
  {
    heading: "What drives the cost of cover?",
    body: "Premiums are shaped by the type of security services offered (static guarding versus armed response versus cash-in-transit carries very different risk), annual turnover, number of employees, claims history, and whether firearms or armed response vehicles are involved.",
  },
];

const whatItCovers = [
  "Third-party bodily injury or property damage during a security operation",
  "Negligent failure to detect, prevent or respond to an incident",
  "Theft or dishonesty by a guard or employee at a client's premises",
  "Legal defence costs for liability claims, including wrongful arrest or assault allegations",
];

const whoNeedsIt = [
  "Static guarding and access control companies",
  "Armed response and alarm monitoring providers",
  "Cash-in-transit and asset protection businesses",
  "Event security and close/VIP protection providers",
];

const commonClaims = [
  {
    title: "Response failure",
    description:
      "An armed response provider is alleged to have responded late to an alarm, and the client claims for the resulting burglary loss.",
  },
  {
    title: "Guard-related theft",
    description:
      "A guard on site is found to have colluded in the theft of stock or equipment from a client's premises.",
  },
  {
    title: "Third-party injury during a response",
    description:
      "A bystander is injured during an armed response incident and brings a claim against the security company.",
  },
];

const faqs = [
  {
    question: "Is Public Liability enough for a security company?",
    answer:
      "Usually not on its own. Public Liability covers third-party injury or property damage, but security businesses also need Fidelity Guarantee for staff dishonesty and often Professional Indemnity for failures in monitoring, advice or response services.",
  },
  {
    question: "Do I need PSIRA registration to get cover?",
    answer:
      "Yes. Insurers generally require the business and relevant officers to hold valid PSIRA registration as a condition of cover.",
  },
  {
    question: "Does cover apply to armed response and firearms use?",
    answer:
      "This depends on the policy — armed response, firearms use and cash-in-transit are higher-risk activities that need to be specifically disclosed and rated, rather than assumed under a general guarding policy.",
  },
  {
    question: "Are subcontracted guards covered?",
    answer:
      "Only if disclosed and agreed with the insurer. Using subcontracted or outsourced guarding without disclosure can affect a claim, so this should always be discussed upfront.",
  },
  {
    question: "What information do I need to get a quote?",
    answer:
      "Typically your PSIRA registration details, annual turnover, number of guards and employees, the services you offer (static guarding, armed response, cash-in-transit, etc.) and your claims history.",
  },
];

export default function SecurityLiabilityInsurancePage() {
  return (
    <GuideLandingPage
      breadcrumbLabel="Security Company Liability Insurance"
      breadcrumbPath="/security-liability-insurance"
      h1="Security Company Liability Insurance"
      intro="Cover built for guarding, armed response, alarm monitoring and VIP protection businesses — protecting you against third-party injury, property damage and staff dishonesty claims."
      heroCtaLabel="Get a Quote"
      heroCtaHref="/quote"
      guideSections={guideSections}
      whatItCovers={whatItCovers}
      whoNeedsIt={whoNeedsIt}
      commonClaims={commonClaims}
      faqs={faqs}
      closingHeading="Ready to cover your security business?"
      closingCtaLabel="Get a Quote"
      closingCtaHref="/quote"
    />
  );
}
