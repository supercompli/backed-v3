import type { Metadata } from "next";
import { GuideLandingPage } from "@/components/guides/GuideLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Medical Malpractice Insurance",
  description:
    "Medical malpractice insurance for doctors, specialists, dentists and allied health practitioners in South Africa — what it covers, who needs it, and what shapes the cost.",
  path: "/medical-malpractice-insurance",
});

const guideSections = [
  {
    heading: "What is medical malpractice insurance?",
    body: "Medical malpractice insurance (also called medical indemnity or medical negligence cover) protects healthcare practitioners against claims that a patient suffered harm as a result of negligent diagnosis, treatment or advice. It responds to the cost of defending a claim and any damages or settlement payable, subject to policy terms.",
  },
  {
    heading: "Who needs it?",
    body: "Any practitioner who diagnoses, treats or advises patients carries malpractice exposure — including general practitioners, specialists, surgeons, dentists, and allied health practitioners such as physiotherapists, psychologists and occupational therapists. Clinics and day hospitals employing or contracting practitioners also carry related exposure.",
  },
  {
    heading: "What does it typically cover?",
    body: "Cover generally responds to allegations of negligent diagnosis, treatment error, failure to obtain informed consent, or breach of the duty of care owed to a patient — plus the legal defence costs of responding to a claim or HPCSA complaint, even where the claim is ultimately unsuccessful.",
  },
  {
    heading: "How is this different from Public Liability?",
    body: "Public Liability covers bodily injury or property damage that happens at your premises — a patient slipping in reception, for example. Medical malpractice specifically covers harm arising from the clinical care, diagnosis or treatment you provide. Practices with client-facing premises often need both.",
  },
  {
    heading: "What drives the cost of cover?",
    body: "Premiums depend on your specialty (surgical and high-acuity specialties are rated differently to lower-risk disciplines), years in practice, claims history, patient volumes and the limit of indemnity you select. Regulatory requirements from bodies such as the HPCSA can also set a practical minimum limit.",
  },
];

const whatItCovers = [
  "Claims of negligent diagnosis, treatment or clinical advice",
  "Failure to obtain informed consent from a patient",
  "Legal defence costs for malpractice claims and regulatory complaints",
  "HPCSA or professional council inquiry-related defence costs, subject to policy terms",
];

const whoNeedsIt = [
  "General practitioners and medical specialists",
  "Surgeons and other high-acuity practitioners",
  "Dentists and allied health practitioners",
  "Clinics and day hospitals employing or contracting practitioners",
];

const commonClaims = [
  {
    title: "Delayed diagnosis",
    description:
      "A patient alleges a condition was not diagnosed in time, resulting in a worse clinical outcome and a claim against the treating practitioner.",
  },
  {
    title: "Informed consent dispute",
    description:
      "A patient claims they were not properly informed of the risks of a procedure before agreeing to treatment.",
  },
  {
    title: "Treatment complication",
    description:
      "A complication arises during or after treatment, and the patient alleges it resulted from negligent technique or aftercare.",
  },
];

const faqs = [
  {
    question: "Is medical malpractice insurance compulsory in South Africa?",
    answer:
      "There is no single law mandating it for every practitioner, but the HPCSA and many hospital groups, medical schemes and employers require proof of adequate indemnity cover as a condition of practising or being granted admitting privileges.",
  },
  {
    question: "Does it cover HPCSA complaints as well as civil claims?",
    answer:
      "Many policies extend to the legal costs of responding to a regulatory or HPCSA inquiry, in addition to civil malpractice claims — check your specific policy wording for the extent of this cover.",
  },
  {
    question: "What is a claims-made policy, and why does it matter here?",
    answer:
      "Medical malpractice cover is usually written on a claims-made basis, meaning the policy in force when a claim is first made against you responds — not the policy in force when the treatment occurred. Your retroactive date and continuous cover are therefore important.",
  },
  {
    question: "Do I need run-off cover when I retire or stop practising?",
    answer:
      "Yes. Malpractice claims can be notified years after treatment, so run-off cover protects you against claims made after you retire, emigrate or close your practice, for care given while you held cover.",
  },
  {
    question: "How much cover do I need?",
    answer:
      "This depends on your specialty, patient risk profile and any minimum limits required by the HPCSA, a hospital group or your employer. Higher-acuity and surgical specialties typically carry higher limits.",
  },
];

export default function MedicalMalpracticeInsurancePage() {
  return (
    <GuideLandingPage
      breadcrumbLabel="Medical Malpractice Insurance"
      breadcrumbPath="/medical-malpractice-insurance"
      h1="Medical Malpractice Insurance"
      intro="Cover for doctors, specialists, dentists and allied health practitioners against claims of negligent diagnosis, treatment or clinical advice."
      heroCtaLabel="Get a Quote"
      heroCtaHref="/quote"
      guideSections={guideSections}
      whatItCovers={whatItCovers}
      whoNeedsIt={whoNeedsIt}
      commonClaims={commonClaims}
      faqs={faqs}
      closingHeading="Ready to cover your practice?"
      closingCtaLabel="Get a Quote"
      closingCtaHref="/quote"
    />
  );
}
