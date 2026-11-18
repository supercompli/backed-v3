export interface CoverLimit {
  slug: string;
  amount: number;
  amountValue: string;
  label: string;
  title: string;
  eyebrow: string;
  description: string;
  whoRequestsIt: string[];
  contractualRequirements: string[];
  premiumImplications: string;
}

export const coverLimits: CoverLimit[] = [
  {
    slug: "500000-cover",
    amount: 500000,
    amountValue: "500000",
    label: "R500,000",
    title: "R500,000 Professional Indemnity cover",
    eyebrow: "R500,000 limit",
    description:
      "The entry-level limit of indemnity, typically suited to sole practitioners and small practices with modest client contract values.",
    whoRequestsIt: [
      "Sole practitioners and small consulting practices in the early stages of their business",
      "Professionals whose largest single client engagement is well under R500,000 in value",
      "Businesses meeting a professional body's or association's minimum recommended limit, where no client contract sets a higher floor",
      "Part-time or supplementary consulting work alongside another primary occupation",
    ],
    contractualRequirements: [
      "Rarely accepted for corporate, provincial or national government tenders, which typically specify a much higher minimum",
      "May satisfy some professional body membership conditions where no specific rand value is mandated",
      "Generally adequate only where client engagement letters are silent on a minimum limit and contract values are genuinely small",
      "Not usually sufficient once a practice takes on its first mid-size corporate client — worth reviewing before, not after, signing that engagement",
    ],
    premiumImplications:
      "This is the lowest tier most insurers will quote, but the saving over a R1,000,000 limit is often smaller than expected. Most insurers apply a minimum premium regardless of limit, so professionals who can reasonably expect to grow their client base within the policy year frequently find the step up to R1,000,000 costs proportionally less than the jump between any other two tiers.",
  },
  {
    slug: "1-million-cover",
    amount: 1000000,
    amountValue: "1000000",
    label: "R1,000,000",
    title: "R1,000,000 Professional Indemnity cover",
    eyebrow: "R1,000,000 limit",
    description:
      "The most commonly selected limit of indemnity across South African professional practices, and the default most insurers price most competitively.",
    whoRequestsIt: [
      "Established small-to-mid-size practices without a single dominant, high-value client relationship",
      "Professionals who don't yet have a specific contractual limit requirement, but want cover that comfortably exceeds a typical claim",
      "Businesses in professions where consequential loss exposure per project is moderate rather than severe",
      "Practices renewing cover for the first time after starting at R500,000, once client contract values have grown",
    ],
    contractualRequirements: [
      "The most frequently cited minimum in standard client engagement letters and smaller private-sector tenders",
      "Referenced as a typical adequate limit in guidance from several South African professional bodies, though this varies by profession and should be confirmed against your own registration requirements",
      "Often sufficient for FSPs in lower FAIS categories with a modest representative count and book size",
      "Should still be checked against your largest individual contract value, not assumed adequate by default",
    ],
    premiumImplications:
      "Because this is the volume tier most insurers underwrite at scale, pricing per rand of cover is often most efficient here. Annual turnover, claims history and profession remain the dominant pricing factors — a R1,000,000 limit for a claims-free, established practice is frequently only modestly more expensive than R500,000 cover for the same business.",
  },
  {
    slug: "2-million-cover",
    amount: 2000000,
    amountValue: "2000000",
    label: "R2,000,000",
    title: "R2,000,000 Professional Indemnity cover",
    eyebrow: "R2,000,000 limit",
    description:
      "A step up for growing practices whose contract values or consequential loss exposure have outgrown the R1,000,000 tier.",
    whoRequestsIt: [
      "Growing practices with at least one client contract in the R1,000,000–R2,000,000 range",
      "Professions with moderate consequential-loss exposure per engagement — quantity surveyors, IT consultants and project managers on mid-size projects",
      "Practices that have taken on their first provincial government or larger corporate client",
      "Multi-principal practices where combined exposure across concurrent projects has grown beyond a single-practitioner risk profile",
    ],
    contractualRequirements: [
      "Increasingly specified as the floor by mid-size corporate clients and provincial (as opposed to purely local) government tenders",
      "Common minimum for larger property transactions, mid-tier audit engagements and IT implementation contracts",
      "Worth confirming against any Master Service Agreement or panel appointment terms, which frequently set limits independently of general market practice",
    ],
    premiumImplications:
      "Premium at this tier becomes more sensitive to claims history and the split of your work across higher-exposure activities (structural design, audit sign-off, system implementation, and similar). Two practices with identical turnover can see materially different pricing here depending on the nature — not just the value — of the work performed.",
  },
  {
    slug: "5-million-cover",
    amount: 5000000,
    amountValue: "5000000",
    label: "R5,000,000",
    title: "R5,000,000 Professional Indemnity cover",
    eyebrow: "R5,000,000 limit",
    description:
      "Cover for established practices with significant contract values or consequential-loss exposure, and a common floor set by large corporate and listed clients.",
    whoRequestsIt: [
      "Established practices with individual contract or engagement values approaching or exceeding R5,000,000",
      "Professions with high consequential-loss exposure — architects and engineers on major projects, software companies serving enterprise clients, larger FSPs",
      "Firms appointed to panels for JSE-listed or large private-sector clients",
      "Practices that have experienced material growth in book size, representative count or largest client relationship since their last renewal",
    ],
    contractualRequirements: [
      "A frequent minimum specified by large corporate clients, listed companies and national (as opposed to provincial) government tenders",
      "Often required for firms carrying SAICA-, IRBA- or ECSA-linked obligations once practice size crosses certain thresholds",
      "Standard requirement on many state-owned entity (SOE) supplier panels",
    ],
    premiumImplications:
      "Most professions requiring this limit sit at or near a refer-only underwriting threshold — insurers generally want a full submission covering claims history, largest contract detail and specific service mix before quoting, rather than an instant online indication. Premium is meaningfully influenced by any prior claims or known circumstances, so accurate disclosure at this tier matters more than at lower limits.",
  },
  {
    slug: "10-million-cover",
    amount: 10000000,
    amountValue: "10000000",
    label: "R10,000,000",
    title: "R10,000,000 Professional Indemnity cover",
    eyebrow: "R10,000,000 limit",
    description:
      "The highest standard tier, typically reserved for large practices bidding on major infrastructure, public-sector or multinational client work.",
    whoRequestsIt: [
      "Large or multi-office practices with contract values regularly exceeding R5,000,000",
      "Firms bidding on major infrastructure or public-sector projects where tender conditions specify this or a higher limit",
      "Technology and professional service businesses with US, UK or European client exposure, where litigation risk and expected damages run higher",
      "Practices where a single claim at a lower limit could plausibly exceed available cover, given known project or engagement values",
    ],
    contractualRequirements: [
      "A standard floor for state-owned entity (SOE) tenders, national infrastructure projects and many public-sector appointment panels",
      "Frequently mandated in Master Service Agreements with multinational clients, particularly where US or Canada exposure is involved",
      "Some tenders specify this as a per-claim (any-one-claim) requirement rather than in the aggregate — confirm which structure the tender expects before quoting",
    ],
    premiumImplications:
      "Cover at this level is placed on a fully underwritten, refer-only basis in virtually all cases — it is not available through an instant online quote. Pricing is bespoke, reflecting your specific claims history, contract concentration, sector exposure and often requiring input from specialist insurers rather than a single standard market. Expect underwriting to take longer than lower-tier applications, so it's worth starting the process ahead of a tender deadline rather than against it.",
  },
];

export function getCoverLimitBySlug(slug: string): CoverLimit | undefined {
  return coverLimits.find((c) => c.slug === slug);
}
