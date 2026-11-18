import type { Metadata } from "next";
import { GuideLandingPage } from "@/components/guides/GuideLandingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Directors & Officers Liability Insurance",
  description:
    "Directors & Officers (D&O) Liability Insurance explained: what it covers, who needs it, what it excludes, and what drives the cost of cover in South Africa.",
  path: "/directors-officers-liability",
});

const guideSections = [
  {
    heading: "What is Directors & Officers Liability Insurance?",
    body: "Directors & Officers (D&O) Liability insurance protects the personal assets of a company's directors and officers against claims arising from actual or alleged wrongful acts committed while managing the business — things like breach of duty, mismanagement, negligent oversight or misleading statements. Because directors can be held personally liable, cover typically responds even after the company itself has been wound up or is unable to indemnify them.",
  },
  {
    heading: "Who needs D&O insurance?",
    body: "Any individual who sits on a board or holds an officer title carries personal exposure — this isn't limited to listed companies. Directors of private companies, close corporations, non-profits and FSPs can all be named personally in claims from shareholders, creditors, employees, regulators or liquidators.",
  },
  {
    heading: "What does D&O typically cover?",
    body: "A standard D&O policy responds on three levels: Side A cover pays directors and officers directly when the company cannot or will not indemnify them; Side B reimburses the company where it has indemnified its directors; and Side C (entity cover) extends protection to the company itself for specific claims, such as securities claims. In all cases, the policy generally pays defence costs as well as any damages or settlement.",
  },
  {
    heading: "What does D&O exclude?",
    body: "D&O cover does not respond to deliberate fraud, dishonesty or criminal conduct, and it will not indemnify fines or penalties that are uninsurable by law. Claims arising from conduct a director knew was wrongful at the time are also typically excluded, along with bodily injury and property damage, which fall under Public Liability.",
  },
  {
    heading: "What drives the cost of D&O cover?",
    body: "Premiums are shaped by the company's turnover, industry, governance structure, number of directors, claims history and whether the business is regulated, listed or holds an FSP licence. Higher-risk industries and businesses raising external capital typically attract closer underwriting scrutiny.",
  },
];

const whatItCovers = [
  "Defence costs for directors and officers facing management liability claims",
  "Claims brought by shareholders, regulators, employees or creditors",
  "Company reimbursement where the business indemnifies its directors",
  "Claims arising after a director has resigned, retired or the company has closed, subject to policy terms",
];

const whoNeedsIt = [
  "Directors and officers of private companies, of any size",
  "Non-executive directors and board members of non-profit organisations",
  "FSPs and other regulated entities with heightened director accountability",
  "Founders and directors raising capital from investors or lenders",
];

const commonClaims = [
  {
    title: "Insolvent trading allegations",
    description:
      "A liquidator alleges the board continued trading after the company was factually insolvent, exposing directors to personal claims from creditors.",
  },
  {
    title: "Employment-related claims",
    description:
      "A dismissed executive names individual directors alongside the company in a claim for unfair dismissal or discrimination.",
  },
  {
    title: "Regulatory investigation",
    description:
      "A regulator investigates the company's conduct and directors incur significant legal costs responding, even where no wrongdoing is ultimately found.",
  },
];

const faqs = [
  {
    question: "Do small company directors need D&O cover?",
    answer:
      "Yes — director liability is not limited to large or listed companies. Regulatory, employment and creditor claims can affect directors of businesses of any size, and personal assets can be at risk without cover.",
  },
  {
    question: "Does the company or the individual director buy the policy?",
    answer:
      "The company usually purchases and pays for the policy, but the protection is designed to sit alongside — and independently of — any indemnity the company itself offers its directors.",
  },
  {
    question: "Is D&O the same as Professional Indemnity?",
    answer:
      "No. Professional Indemnity covers liability arising from professional advice or services the business provides to clients. D&O covers liability arising from how the company itself is managed and governed.",
  },
  {
    question: "Am I still covered after I resign as a director?",
    answer:
      "Most D&O policies respond to claims made during the policy period for wrongful acts committed while you were a director, even if you have since resigned — subject to the policy's terms and retroactive date.",
  },
  {
    question: "What happens if the company can't afford to indemnify a director?",
    answer:
      "This is exactly what Side A cover is designed for — it pays directors and officers directly when the company is unable or unwilling to indemnify them, including where the company has become insolvent.",
  },
  {
    question: "Does D&O cover fines and penalties?",
    answer:
      "No. Fines and penalties that are uninsurable by law, along with deliberate fraud or dishonest conduct, fall outside D&O cover. It is designed for allegations of wrongful acts, not proven deliberate wrongdoing.",
  },
];

export default function DirectorsOfficersLiabilityPage() {
  return (
    <GuideLandingPage
      breadcrumbLabel="Directors & Officers Liability"
      breadcrumbPath="/directors-officers-liability"
      h1="Directors & Officers Liability Insurance"
      intro="Protect the personal assets of your directors and officers against claims of wrongful management decisions — from regulators, shareholders, employees and creditors."
      heroCtaLabel="Get a Quote"
      heroCtaHref="/quote"
      guideSections={guideSections}
      whatItCovers={whatItCovers}
      whoNeedsIt={whoNeedsIt}
      commonClaims={commonClaims}
      faqs={faqs}
      closingHeading="Ready to protect your directors and officers?"
      closingCtaLabel="Get a Quote"
      closingCtaHref="/quote"
    />
  );
}
