export type ResourceCategory =
  | "Professional Indemnity"
  | "Profession Guides"
  | "Claims"
  | "Risk Management"
  | "Cyber"
  | "Compliance"
  | "Insurance Guides";

export interface Resource {
  slug: string;
  title: string;
  category: ResourceCategory;
  excerpt: string;
  body: string[];
}

export const resources: Resource[] = [
  {
    slug: "understanding-claims-made-policies",
    title: "Understanding claims-made Professional Indemnity policies",
    category: "Professional Indemnity",
    excerpt: "Why the policy in force when a claim is made matters more than the policy you held when the work was done.",
    body: [
      "Professional Indemnity insurance is written on a claims-made basis. This means the policy that responds to a claim is the one in force at the time the claim is first made against you — not the policy that was in force when you did the work.",
      "This is a critical distinction from occurrence-based cover, which is more common in other insurance lines. It means continuous, unbroken PI cover matters far more than it would under an occurrence-based policy.",
      "If you let your PI cover lapse, even briefly, and a claim is made against you during that gap for work done years earlier, you may have no cover at all — regardless of whether you held a policy at the time the work was performed.",
      "This is also why your retroactive date matters so much: it defines how far back your current policy will reach when a claim is eventually made.",
    ],
  },
  {
    slug: "retroactive-dates-explained",
    title: "Retroactive dates explained",
    category: "Professional Indemnity",
    excerpt: "How your retroactive date determines what past work is protected, and what to check before you switch insurer.",
    body: [
      "Your retroactive date is the earliest date from which your PI policy will respond to claims. Work carried out before this date is generally excluded from cover, even if a claim relating to it is made while your policy is active.",
      "For most professionals, the ideal retroactive date is the date you first held continuous PI cover, or the date you began providing professional services if that was earlier.",
      "When switching insurers, always confirm in writing that your new insurer will honour your existing retroactive date. A new insurer starting your retroactive date at the policy inception date — rather than your original start date — can leave years of past work unprotected.",
      "Keep records of your PI policy schedules over time. If a dispute arises about your retroactive date, this history is the easiest way to resolve it.",
    ],
  },
  {
    slug: "notifying-a-potential-claim-early",
    title: "Why you should notify a potential claim early",
    category: "Claims",
    excerpt: "Late notification is one of the most common reasons a PI claim is disputed. Here's what 'early' actually means.",
    body: [
      "Most PI policies require you to notify your insurer as soon as you become aware of circumstances that could reasonably give rise to a claim — not only once a formal letter of demand or summons arrives.",
      "This includes situations like an unhappy client raising concerns informally, a project going materially over budget, or noticing an error in your own work before the client has.",
      "Notifying early does not commit you to anything and does not admit liability. It simply puts your insurer on notice, which protects your position if the matter escalates later.",
      "Late notification is one of the most common grounds insurers rely on to dispute an otherwise valid claim. If you are ever unsure whether something is notifiable, the safer choice is almost always to notify.",
    ],
  },
  {
    slug: "run-off-cover-when-you-stop-practising",
    title: "Run-off cover: what happens when you stop practising",
    category: "Risk Management",
    excerpt: "Retiring, selling or closing a practice doesn't end your PI exposure. Run-off cover explained.",
    body: [
      "Because PI is claims-made, your exposure to historic work doesn't disappear the day you retire, sell your business or close your practice. A client could still make a claim relating to work from years earlier.",
      "Without an active policy at the time that claim is made, you have no PI protection — regardless of how good your track record was while practising.",
      "Run-off cover keeps a policy in force, typically for a defined number of years, specifically to respond to claims notified after you've stopped practising, for work carried out while you held cover.",
      "The appropriate run-off period varies by profession, regulatory expectation and personal risk tolerance. It's worth discussing with a specialist before your current policy lapses, not after.",
    ],
  },
  {
    slug: "popia-and-professional-service-firms",
    title: "POPIA and professional service firms",
    category: "Compliance",
    excerpt: "What professional firms handling client personal information need to know about their compliance obligations.",
    body: [
      "Most professional service firms process personal information as a matter of course — client identity documents, financial records, medical information or contract details — which brings POPIA obligations into play.",
      "Firms should have a clear basis for processing personal information, reasonable security safeguards in place, and a process for responding to data subject requests and breaches.",
      "A data breach involving client personal information can trigger both regulatory exposure and a Professional Indemnity or Cyber Liability claim, depending on how the breach occurred and what advice or service was involved.",
      "Reviewing your data handling practices alongside your insurance cover — rather than treating them as separate issues — gives a more complete picture of your risk.",
    ],
  },
  {
    slug: "cyber-vs-professional-indemnity",
    title: "Cyber Liability vs Professional Indemnity: what's the difference?",
    category: "Cyber",
    excerpt: "Two distinct exposures that are frequently confused — and why technology and advisory businesses often need both.",
    body: [
      "Professional Indemnity covers liability arising from your advice, design or professional service — a coding error, a negligent recommendation, a design flaw.",
      "Cyber Liability covers a different exposure entirely: data breaches, ransomware, network security failures and the costs of responding to them, including notification and forensic investigation.",
      "A software company, for instance, could face a PI claim because its product had a defect that caused a client loss, and separately face a Cyber claim because an unrelated ransomware attack encrypted client data.",
      "Businesses that both build or advise on technology and hold sensitive client data typically need both covers to be properly protected.",
    ],
  },
  {
    slug: "fsp-professional-indemnity-requirements",
    title: "FAIS Professional Indemnity requirements for FSPs",
    category: "Compliance",
    excerpt: "An overview of how FAIS licence categories influence your Professional Indemnity obligations.",
    body: [
      "FAIS requires most authorised Financial Services Providers to hold Professional Indemnity cover appropriate to their licence category and the products they advise on.",
      "The scope of cover required can vary depending on whether you advise on short-term insurance, long-term insurance, investments, medical aid or employee benefits — and whether you handle client funds or assets.",
      "Where representatives handle client funds directly, Fidelity Guarantee cover is typically required alongside PI cover, since Fidelity addresses theft and dishonesty exposure that a PI policy does not.",
      "FSPs should review their PI arrangements whenever their licence category, representative count or product lines change materially.",
    ],
  },
  {
    slug: "choosing-a-limit-of-indemnity",
    title: "How to choose a limit of indemnity",
    category: "Insurance Guides",
    excerpt: "A practical framework for sizing your PI cover against contract values, client requirements and risk appetite.",
    body: [
      "Start with your largest realistic exposure — usually your biggest single project, contract or client relationship. Your limit of indemnity should comfortably cover a claim of that size, plus associated legal defence costs.",
      "Check whether any regulator, professional body or client contract specifies a minimum limit. Many tenders and appointment letters set a floor that overrides your own risk assessment.",
      "Understand whether your limit applies per claim or in aggregate across the policy period. An aggregate limit that looks generous can be eroded quickly if you face multiple claims in one year.",
      "Revisit your limit periodically as your business grows — a limit that was adequate three years ago may no longer reflect your current contract values.",
    ],
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}
