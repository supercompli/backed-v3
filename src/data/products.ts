import type { InsuranceProduct } from "@/types";

export const products: InsuranceProduct[] = [
  {
    slug: "cyber-liability",
    name: "Cyber Liability",
    shortDescription: "Cover for data breaches, ransomware and network security failures.",
    intro:
      "Cyber Liability insurance responds when your business suffers a data breach, ransomware attack or network security failure. It sits alongside Professional Indemnity to cover the technology and data risks a PI policy does not.",
    whatItCovers: [
      "Costs of responding to a data breach, including notification and forensic investigation",
      "Business interruption caused by a network security failure",
      "Cyber extortion and ransomware response costs",
      "Third-party liability for failure to protect client data",
    ],
    whoNeedsIt: [
      "IT and technology businesses handling client data or systems",
      "Insurance brokers and financial advisers holding personal and financial information",
      "Any business processing personal information under POPIA",
    ],
    faqs: [
      { question: "Is Cyber cover the same as Professional Indemnity?", answer: "No. Cyber covers data breaches and network security events; Professional Indemnity covers liability for advice, design or service errors. Many technology and financial services businesses hold both." },
    ],
  },
  {
    slug: "directors-officers",
    name: "Directors & Officers Liability",
    shortDescription: "Cover for directors and officers against claims of wrongful management decisions.",
    intro:
      "Directors & Officers (D&O) Liability insurance protects individual directors and officers against claims arising from actual or alleged wrongful acts in managing the company.",
    whatItCovers: [
      "Defence costs for directors and officers facing management liability claims",
      "Claims from shareholders, regulators, employees or creditors",
      "Company reimbursement where the company indemnifies its directors",
    ],
    whoNeedsIt: [
      "Company directors and officers of any size business",
      "FSPs and regulated entities with heightened director accountability",
    ],
    faqs: [
      { question: "Do small company directors need D&O cover?", answer: "Yes — director liability is not limited to large companies. Regulatory, employment and creditor claims can affect directors of businesses of any size." },
    ],
  },
  {
    slug: "fidelity-guarantee",
    name: "Fidelity Guarantee",
    shortDescription: "Cover against employee theft, fraud and dishonesty.",
    intro:
      "Fidelity Guarantee insurance protects your business against direct financial loss caused by the theft, fraud or dishonesty of an employee or representative.",
    whatItCovers: [
      "Theft of money, securities or property by an employee",
      "Fraudulent manipulation of accounts by staff",
      "Loss arising from dishonest acts of representatives handling client funds",
    ],
    whoNeedsIt: [
      "FSPs and brokers handling client funds or assets",
      "Estate agencies operating trust accounts",
      "Any business where staff have access to money or valuable assets",
    ],
    faqs: [
      { question: "Is Fidelity cover the same as Professional Indemnity?", answer: "No. PI covers liability for professional advice and service errors; Fidelity covers direct loss from employee theft or dishonesty." },
    ],
  },
  {
    slug: "commercial-crime",
    name: "Commercial Crime",
    shortDescription: "Broader cover for crime exposures including third-party theft and cyber fraud.",
    intro:
      "Commercial Crime insurance extends beyond employee dishonesty to cover a broader range of crime exposures, including theft by third parties, forgery and computer fraud.",
    whatItCovers: [
      "Employee and third-party theft",
      "Forgery and alteration of financial instruments",
      "Computer and funds transfer fraud",
    ],
    whoNeedsIt: [
      "Businesses handling significant cash, stock or client funds",
      "Businesses seeking broader crime protection than Fidelity cover alone provides",
    ],
    faqs: [
      { question: "How is this different from Fidelity Guarantee?", answer: "Fidelity focuses on employee dishonesty. Commercial Crime typically extends to third-party crime, forgery and computer fraud exposures as well." },
    ],
  },
  {
    slug: "public-liability",
    name: "Public Liability",
    shortDescription: "Cover for bodily injury or property damage to third parties.",
    intro:
      "Public Liability insurance covers claims from third parties for bodily injury or property damage arising from your business operations, premises or site activities — exposure that sits outside a Professional Indemnity policy.",
    whatItCovers: [
      "Third-party bodily injury at your premises or a client site",
      "Accidental damage to third-party property during business activities",
      "Legal defence costs for liability claims",
    ],
    whoNeedsIt: [
      "Businesses with client-facing premises or site visits",
      "Architects, engineers and project managers conducting site inspections",
      "Veterinary practices and other client-facing professional premises",
    ],
    faqs: [
      { question: "Does Professional Indemnity cover bodily injury?", answer: "No. PI covers financial loss from professional advice or service errors. Bodily injury and property damage are covered under Public Liability." },
    ],
  },
];

export function getProductBySlug(slug: string): InsuranceProduct | undefined {
  return products.find((p) => p.slug === slug);
}
