export interface PiTopicSection {
  heading: string;
  paragraphs: string[];
}

export interface PiTopic {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  sections: PiTopicSection[];
}

export const piTopics: PiTopic[] = [
  {
    slug: "claims",
    title: "Professional Indemnity claims explained",
    eyebrow: "Claims",
    description:
      "How a PI claim actually unfolds — from a client complaint to notification, investigation and resolution.",
    sections: [
      {
        heading: "What triggers a PI claim",
        paragraphs: [
          "A claim is typically triggered when a client, or a third party who relied on your professional service, alleges that your advice, design or service caused them financial loss.",
          "This can range from a formal letter of demand to a court summons, but also includes circumstances that could reasonably lead to a claim later — which is why early notification matters.",
        ],
      },
      {
        heading: "Notify potential claims early",
        paragraphs: [
          "Most PI policies require you to notify your insurer as soon as you become aware of circumstances that could give rise to a claim, not only once a formal claim is received.",
          "Late notification is one of the most common reasons an otherwise valid claim is disputed. If in doubt, notify — it does not commit you to anything, and it protects your position.",
        ],
      },
      {
        heading: "What happens after notification",
        paragraphs: [
          "Your insurer or their appointed attorneys typically investigate the circumstances, assess liability and quantum, and manage the response on your behalf, subject to your policy terms.",
          "You should generally avoid admitting liability or agreeing to settle directly with a claimant before consulting your insurer.",
        ],
      },
    ],
  },
  {
    slug: "exclusions",
    title: "Common Professional Indemnity exclusions",
    eyebrow: "Exclusions",
    description:
      "PI policies are not unlimited. Understanding what falls outside cover helps you plan for the risks that need a different solution.",
    sections: [
      {
        heading: "What PI generally does not cover",
        paragraphs: [
          "Deliberate, dishonest or fraudulent acts are excluded from virtually all PI policies.",
          "Bodily injury or property damage to third parties is typically a Public Liability exposure, not a PI exposure.",
          "Liability you assume under a contract that goes beyond your ordinary professional duty of care may fall outside standard cover.",
        ],
      },
      {
        heading: "Why exclusions vary by profession",
        paragraphs: [
          "Some exclusions are profession-specific — for example, cyber events for technology businesses, or fidelity exposure for FSPs handling client funds — and are better addressed with a complementary product.",
          "Always review the specific exclusions in your policy wording rather than relying on general guidance.",
        ],
      },
    ],
  },
  {
    slug: "retroactive-cover",
    title: "Retroactive cover explained",
    eyebrow: "Retroactive cover",
    description:
      "Why the date your cover reaches back to is one of the most important numbers on your PI policy.",
    sections: [
      {
        heading: "What a retroactive date does",
        paragraphs: [
          "Because PI policies are written on a claims-made basis, your current policy responds to claims made now — even for work carried out years ago — provided that work falls after your retroactive date.",
          "Work carried out before your retroactive date is generally not covered, even if a claim is made while your policy is active.",
        ],
      },
      {
        heading: "Setting the right retroactive date",
        paragraphs: [
          "Ideally, your retroactive date should match the date you first held continuous PI cover, or the date you began providing professional services if earlier.",
          "When switching insurers, always confirm that your new policy preserves your existing retroactive date to avoid an unintended gap in cover.",
        ],
      },
    ],
  },
  {
    slug: "run-off-cover",
    title: "Run-off cover explained",
    eyebrow: "Run-off cover",
    description:
      "What happens to your PI exposure after you retire, sell or close a professional practice.",
    sections: [
      {
        heading: "Why your exposure doesn't end when you stop practising",
        paragraphs: [
          "Because PI is claims-made, a claim relating to work you did years ago can still be made after you retire, sell your business or close your practice.",
          "Without a policy in place at the time a claim is made, you have no PI protection for that historic work.",
        ],
      },
      {
        heading: "How run-off cover works",
        paragraphs: [
          "Run-off cover keeps a policy in place — usually for a defined number of years — to respond to claims notified after you stop practising, for work carried out while you held cover.",
          "The appropriate run-off period varies by profession and regulatory requirement. Speak to a BackedSure specialist about what's right for your situation.",
        ],
      },
    ],
  },
  {
    slug: "limits-of-indemnity",
    title: "Choosing a limit of indemnity",
    eyebrow: "Limits of indemnity",
    description: "A practical way to think about how much PI cover is enough for your business.",
    sections: [
      {
        heading: "Start with your largest exposure",
        paragraphs: [
          "Your limit of indemnity should comfortably cover the largest single claim your business could realistically face — often linked to your largest project, contract or client relationship.",
          "Many professional bodies, regulators and client contracts specify a minimum limit, which sets a practical floor.",
        ],
      },
      {
        heading: "Aggregate vs any-one-claim limits",
        paragraphs: [
          "Some policies apply your limit per claim, others apply it in aggregate across all claims in a policy period. Understand which structure applies to your policy when comparing cover.",
        ],
      },
    ],
  },
  {
    slug: "claims-made-basis",
    title: "Claims-made policies explained",
    eyebrow: "Policy basis",
    description:
      "Why the timing of when a claim is made — not when the work was done — determines which policy responds.",
    sections: [
      {
        heading: "Claims-made vs occurrence-based cover",
        paragraphs: [
          "Professional Indemnity is written on a claims-made basis: the policy in force at the time a claim is first made against you is the policy that responds, regardless of when the underlying work took place.",
          "This differs from occurrence-based cover, common in some other insurance lines, where the policy in force at the time of the incident responds.",
        ],
      },
      {
        heading: "What this means in practice",
        paragraphs: [
          "You need continuous, unbroken PI cover throughout your career, with an appropriate retroactive date, to ensure past work remains protected.",
          "Gaps in cover — even short ones — can leave historic work unprotected if a claim arises during the gap.",
        ],
      },
    ],
  },
  {
    slug: "south-africa",
    title: "Professional Indemnity Insurance in South Africa",
    eyebrow: "South Africa",
    description:
      "An overview of the regulatory and market context for Professional Indemnity cover in South Africa.",
    sections: [
      {
        heading: "Regulatory context",
        paragraphs: [
          "While there is no single law mandating PI insurance for every profession, many South African regulators and professional bodies — including those governing financial services, the built environment, legal and healthcare professions — require or strongly recommend adequate PI cover as a condition of registration or practice.",
          "Client contracts, tender conditions and professional indemnity clauses in appointment letters frequently create a practical requirement even where no statutory obligation exists.",
        ],
      },
      {
        heading: "A specialist, not generalist, product",
        paragraphs: [
          "PI insurance in South Africa is underwritten by specialist insurers who assess risk profession by profession. BackedSure's role is to simplify how you access that specialist underwriting, through profession-specific questions and a transparent triage process.",
        ],
      },
    ],
  },
];

export function getPiTopicBySlug(slug: string): PiTopic | undefined {
  return piTopics.find((t) => t.slug === slug);
}
