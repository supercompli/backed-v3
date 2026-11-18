export interface PiGuideFaq {
  question: string;
  answer: string;
}

export interface PiGuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export type PiGuideCategory =
  | "Policy mechanics"
  | "Buying process"
  | "Contracts & tenders"
  | "Comparisons"
  | "Emerging risk";

export interface PiGuide {
  slug: string;
  title: string;
  eyebrow: string;
  category: PiGuideCategory;
  description: string;
  keyTakeaways: string[];
  sections: PiGuideSection[];
  faqs: PiGuideFaq[];
  relatedGuideSlugs: string[];
}

export const piGuides: PiGuide[] = [
  {
    slug: "excess",
    title: "Understanding your Professional Indemnity excess",
    eyebrow: "Excess",
    category: "Policy mechanics",
    description:
      "What an excess is, how insurers set it, and how it interacts with your limit of indemnity and premium.",
    keyTakeaways: [
      "Your excess is the amount you pay toward each claim before your insurer's payment applies",
      "Excess and limit of indemnity are set independently — a high limit can carry a modest excess, and vice versa",
      "A higher excess typically lowers your premium, but should be sized against what your business could comfortably self-fund",
      "Some policies apply a different excess to specific higher-risk activities within the same practice",
    ],
    sections: [
      {
        heading: "What your excess actually pays for",
        paragraphs: [
          "Your excess applies per claim, not once per policy period. If you face two unrelated claims in the same year, your excess is typically payable on each one separately, not just the first.",
          "On most policies, the excess applies to the combined cost of a claim — damages and legal defence costs together — rather than to damages alone. Whether defence costs erode your excess (and your limit) depends on your specific policy wording; see our guide to defence costs for the detail.",
        ],
      },
      {
        heading: "How insurers set your excess",
        paragraphs: [
          "For professions eligible for automated online rating, insurers typically apply a standard excess linked to your turnover band and chosen limit, with limited room to negotiate.",
          "For refer-only professions — where a specialist underwriter prices your risk individually — excess is usually one of several negotiable terms, alongside limit, premium and any specific exclusions, based on your claims history, sector and contract profile.",
        ],
      },
      {
        heading: "Balancing excess against premium",
        paragraphs: [
          "Raising your excess is one of the more reliable ways to reduce premium, since it shifts a defined amount of risk from the insurer back to you. The trade-off only makes sense if you can comfortably self-fund that amount without disrupting your business.",
          "A common mistake is choosing the highest available excess purely to minimise premium, without checking it against actual cash reserves. Size your excess against what you could pay out of working capital on short notice, not against what feels like an acceptable number in the abstract.",
        ],
      },
      {
        heading: "Can you choose your own excess?",
        paragraphs: [
          "Within the range an insurer offers, yes. Online rating tools usually present a small set of excess options tied to your profession and turnover. Refer-only submissions can often negotiate a bespoke excess as part of the underwriting conversation with your broker.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is my excess payable per claim or per policy year?",
        answer:
          "Per claim. If multiple separate claims arise during the same policy period, your excess is typically applied to each one individually.",
      },
      {
        question: "Does my excess apply to legal defence costs?",
        answer:
          "Generally yes, on most policies — defence costs and damages are usually combined for excess purposes. Always confirm this against your specific policy schedule, since wording varies. See our defence costs guide for more detail.",
      },
      {
        question: "Can I reduce my excess after a claims-free year?",
        answer:
          "It's worth raising at renewal, but insurers more commonly review excess upward following a claim than automatically reduce it after a clean year. Ask your broker to specifically negotiate this if a lower excess is important to you.",
      },
    ],
    relatedGuideSlugs: ["defence-costs", "how-much-cover", "renewal"],
  },
  {
    slug: "defence-costs",
    title: "Legal defence costs under a Professional Indemnity policy",
    eyebrow: "Defence costs",
    category: "Policy mechanics",
    description:
      "How PI insurance pays for legal defence, whether those costs erode your limit, and what happens with unsuccessful claims.",
    keyTakeaways: [
      "PI insurance pays reasonable legal defence costs in responding to a claim, even where the claim is ultimately unsuccessful or withdrawn",
      "On most policies, defence costs are paid within — not in addition to — your limit of indemnity, so check your wording carefully",
      "Insurers usually control or must approve the appointment of defence attorneys and any settlement",
      "Notifying a potential claim early protects your ability to have defence costs covered from the outset",
    ],
    sections: [
      {
        heading: "What defence costs cover",
        paragraphs: [
          "Defence costs typically include attorney fees, expert witness costs, costs of responding to a regulatory complaint or Ombud referral, and the general cost of investigating and formally responding to an allegation against you.",
          "These costs are payable regardless of how the claim resolves — even a claim your insurer successfully defends, or one the claimant withdraws, still generates defence costs that your policy responds to.",
        ],
      },
      {
        heading: "Costs inclusive vs costs in addition to the limit",
        paragraphs: [
          "Most South African PI policies are written on a \"costs inclusive\" basis: defence costs and any damages or settlement share the same limit of indemnity. A large legal defence bill on a costs-inclusive policy reduces the amount of your limit left available to pay a settlement.",
          "A smaller number of policies — usually at higher premium — offer defence costs \"in addition to\" the limit, meaning legal fees are paid separately and don't erode the amount available for damages. This distinction materially affects whether a given limit is genuinely adequate, and it's worth confirming explicitly with your broker rather than assuming.",
        ],
      },
      {
        heading: "Who controls the defence",
        paragraphs: [
          "Your insurer typically has the right to appoint, or approve your choice of, defence attorneys, and to direct the strategy of the defence, subject to your policy's terms and your duty to cooperate.",
          "Settling a claim, or admitting liability, without your insurer's consent can jeopardise cover for that settlement — always notify and involve your insurer before agreeing to any resolution with a claimant, however informal.",
        ],
      },
    ],
    faqs: [
      {
        question: "Will I have to pay my own legal fees upfront?",
        answer:
          "No, provided the claim or circumstance has been properly notified and accepted — your insurer typically appoints and pays defence costs directly, subject to your excess.",
      },
      {
        question: "What if a claim against me is dropped or withdrawn?",
        answer:
          "Defence costs already incurred responding to it remain covered, even though no damages were ultimately paid.",
      },
      {
        question: "Does a successfully defended claim still affect my premium?",
        answer:
          "It can. Insurers typically consider your full claims and notification history at renewal, including matters that were successfully defended without a payout, since it reflects your overall claims experience.",
      },
    ],
    relatedGuideSlugs: ["excess", "notification-of-circumstances", "how-much-cover"],
  },
  {
    slug: "notification-of-circumstances",
    title: "Notification of circumstances: when and how to notify your insurer",
    eyebrow: "Notification",
    category: "Policy mechanics",
    description:
      "What counts as a notifiable circumstance, why timing matters, and how notification protects you even before a formal claim arrives.",
    keyTakeaways: [
      "A \"circumstance\" is any situation that could reasonably be expected to give rise to a claim — not only a formal letter of demand or summons",
      "Notifying a circumstance during your current policy period preserves cover for a claim that crystallises later, even after that policy has expired",
      "Failing to notify promptly is one of the most common grounds insurers use to dispute an otherwise valid claim",
      "Notification does not require you to admit fault or liability",
    ],
    sections: [
      {
        heading: "What counts as a notifiable circumstance",
        paragraphs: [
          "The threshold is lower than most professionals assume. It includes an informal complaint from a client, discovering your own error before the client has raised it, a project running materially over budget or behind schedule where a dispute seems likely, or receiving a letter from an attorney requesting information about your work.",
          "You don't need certainty that a claim will follow — only a reasonable possibility, based on what you know at the time.",
        ],
      },
      {
        heading: "Why timing matters more than it seems",
        paragraphs: [
          "Because PI is written on a claims-made basis, a circumstance notified within your current policy period is dealt with under that policy, even if the claim itself only formally crystallises after that policy has expired or you've since switched insurers. This protects continuity of cover for issues you already knew about.",
          "The opposite scenario is the real risk: if you switch insurers without disclosing something you were already aware of, the new insurer can treat it as a prior known circumstance and decline it outright. Our guide to prior known circumstances covers this in detail.",
        ],
      },
      {
        heading: "How to notify",
        paragraphs: [
          "Notify your broker or insurer in writing, describing the relevant facts as you understand them, without making admissions of fault. Keep a record of what you disclosed and when — this becomes important if the matter is ever disputed later.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need proof a claim will definitely happen before I notify?",
        answer:
          "No — a reasonable possibility that a claim could arise is enough to justify notification. You don't need to wait for certainty.",
      },
      {
        question: "Can notifying too often ever hurt me?",
        answer:
          "Over-notifying genuinely trivial matters can shape how your claims history reads at renewal, but under-notifying carries the far greater risk of losing cover entirely for something real. Your broker can help judge borderline cases.",
      },
      {
        question: "What happens after I notify a circumstance?",
        answer:
          "Your insurer typically opens a file, may ask follow-up questions, and begins monitoring the matter — see our defence costs guide for what happens if it develops into a formal claim.",
      },
    ],
    relatedGuideSlugs: ["defence-costs", "prior-known-circumstances", "switching-insurers"],
  },
  {
    slug: "subcontractors",
    title: "Professional Indemnity cover for subcontractors and consultants",
    eyebrow: "Subcontractors",
    category: "Policy mechanics",
    description:
      "How liability works when you engage subcontractors or work as one, and what your PI policy does and doesn't extend to.",
    keyTakeaways: [
      "Engaging a subcontractor does not automatically transfer your professional liability to them — you generally remain liable to your client for the overall engagement",
      "Most PI policies extend to subcontracted work performed under your instruction, often subject to conditions",
      "Independent subcontractors should hold their own PI cover — relying solely on the main contractor's policy can leave real gaps",
      "Direct appointment or novation of a subcontractor by the client changes the liability picture and is worth reviewing specifically",
    ],
    sections: [
      {
        heading: "Vicarious liability vs your own duty of care",
        paragraphs: [
          "When you subcontract part of an engagement, your client typically still looks to you for the overall outcome — a claim is usually brought against the party they contracted with directly, which is you, even where a subcontractor actually performed the defective work.",
          "You may have a right of recourse against the subcontractor afterwards, but that doesn't change your immediate exposure to the client, or your need for adequate cover in your own name.",
        ],
      },
      {
        heading: "What your policy typically covers",
        paragraphs: [
          "Most PI policies cover claims arising from subcontracted work performed under your direction and supervision as part of your own engagement. Some policies attach conditions — commonly a requirement that subcontractors themselves hold adequate PI cover, or that you obtain warranties from them regarding their own professional standards.",
          "Check your policy wording specifically rather than assuming subcontracted work is automatically and unconditionally covered.",
        ],
      },
      {
        heading: "If you are the subcontractor",
        paragraphs: [
          "You carry your own direct exposure to the party who appointed you, and in some contract structures, potentially to the end client as well. Confirm your own retroactive date and limit of indemnity are adequate for the actual value of work you're performing, not just for your historical, smaller engagements.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need to check my subcontractors' own insurance?",
        answer:
          "Yes — this is both good practice and, on many policies, an actual condition of cover. Request evidence of adequate, current PI cover before engaging a subcontractor on client work.",
      },
      {
        question: "What if my subcontractor's insurer disputes their claim?",
        answer:
          "You may still face a claim directly from your own client and need your own policy to respond, regardless of how the subcontractor's insurer treats the matter on their side.",
      },
      {
        question: "Does using freelance or gig-based subcontractors change anything?",
        answer:
          "No — formal employment status doesn't remove your professional duty to the client. The same principles around oversight, warranties and your own cover apply.",
      },
    ],
    relatedGuideSlugs: ["contract-requirements", "liability-caps", "tenders"],
  },
  {
    slug: "aggregate-vs-any-one-claim",
    title: "Aggregate vs any-one-claim limits: how your policy structure affects real protection",
    eyebrow: "Policy structure",
    category: "Policy mechanics",
    description:
      "The difference between an aggregate limit and an any-one-claim (each-and-every-claim) limit, and why the same headline limit can mean very different protection.",
    keyTakeaways: [
      "An aggregate limit is the total your insurer will pay across all claims in the policy period combined",
      "An any-one-claim (each-and-every-claim) limit reinstates in full for each separate claim, regardless of how many arise",
      "Two policies advertising the same rand-value limit can offer materially different protection depending on which structure applies",
      "Businesses with a realistic chance of multiple claims in one year should weigh this structure as carefully as the limit itself",
    ],
    sections: [
      {
        heading: "How each structure plays out in practice",
        paragraphs: [
          "Consider a firm with a R2,000,000 aggregate limit that faces two unrelated claims of R1,200,000 each in the same policy year. Only R2,000,000 in total is available across both — the second claim is likely underfunded, regardless of its individual merit.",
          "Under an any-one-claim structure, the same firm would have R2,000,000 available for each of those two claims separately — up to R4,000,000 in total exposure covered across the year.",
        ],
      },
      {
        heading: "Why any-one-claim cover usually costs more",
        paragraphs: [
          "Because an insurer's theoretical maximum payout across a policy period is effectively unlimited under an any-one-claim structure (bounded only by how many claims actually arise), it's priced at a premium compared to an equivalent aggregate limit.",
        ],
      },
      {
        heading: "What drives which structure you're offered",
        paragraphs: [
          "Profession, historical claim frequency in your sector, and individual insurer appetite all play a role. Professions with a realistic chance of multiple, unrelated claims in a single year — high-transaction-volume practices, for example — are more commonly offered or should specifically request an any-one-claim structure.",
        ],
      },
      {
        heading: "How to check your own policy",
        paragraphs: [
          "Look for the phrase \"in the aggregate\" or \"any one claim\" / \"each and every claim\" in your policy schedule. If it isn't clear, ask your broker to confirm the structure in writing — this is a material term worth understanding before you ever need to rely on it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is one structure simply 'better' than the other?",
        answer:
          "Not inherently — it depends on your realistic claim-frequency risk and what you can afford to pay in premium. A practice unlikely to ever face more than one claim in a year may not need to pay for any-one-claim cover.",
      },
      {
        question: "Can I negotiate from an aggregate to an any-one-claim structure?",
        answer:
          "Often yes, usually at a higher premium, subject to your insurer's appetite for your specific profession and risk profile.",
      },
      {
        question: "Does this affect my excess?",
        answer:
          "No — excess and limit structure are set independently of one another.",
      },
    ],
    relatedGuideSlugs: ["how-much-cover", "liability-caps", "excess"],
  },
  {
    slug: "territorial-limits",
    title: "Territorial limits: where in the world does your PI policy respond?",
    eyebrow: "Territorial limits",
    category: "Policy mechanics",
    description:
      "What territorial limit means, why work outside South Africa can affect your cover, and what to disclose to your insurer.",
    keyTakeaways: [
      "Territorial limit defines where the professional work giving rise to a claim must have been performed for cover to respond",
      "Many South African PI policies are written for work performed within South Africa unless specifically extended",
      "International work — remote consulting, cross-border projects, US, UK or EU clients — often needs explicit disclosure and can carry different pricing",
      "Territorial limit is separate from jurisdiction, which concerns where a claim can be brought or a judgment enforced",
    ],
    sections: [
      {
        heading: "What's typically included by default",
        paragraphs: [
          "Most South African PI policies are written on the basis that professional services are performed within South Africa, sometimes extending automatically to the rest of Africa or to specifically listed countries. Anything beyond that default scope usually needs to be requested and underwritten.",
        ],
      },
      {
        heading: "Why remote and cross-border work needs disclosure",
        paragraphs: [
          "Technology, consulting and advisory businesses increasingly serve clients outside South Africa while remaining physically based here. Insurers assess this separately from domestic work, because litigation norms, court costs and typical damages awards vary significantly by country.",
        ],
      },
      {
        heading: "US and Canada exposure specifically",
        paragraphs: [
          "This is treated as a distinct underwriting factor for many professions — particularly technology and consulting businesses — because litigation in those markets is generally associated with materially higher legal costs and damages than in South Africa. Disclose any US or Canada client work explicitly, even if it's a small part of your practice.",
        ],
      },
    ],
    faqs: [
      {
        question: "I only occasionally have an overseas client — do I still need to disclose it?",
        answer:
          "Yes. Disclose any material international work so your insurer can confirm territorial scope actually applies — non-disclosure risks a declined claim if that work is ever the subject of one.",
      },
      {
        question: "Does territorial limit affect where I can be sued?",
        answer:
          "No — that's a separate concept called jurisdiction. See our dedicated jurisdiction guide for the distinction.",
      },
      {
        question: "Can territorial limit be extended after my policy starts?",
        answer:
          "Usually yes, via a policy endorsement, subject to underwriting — talk to your broker before taking on new international work rather than after.",
      },
    ],
    relatedGuideSlugs: ["jurisdiction", "how-much-cover", "contract-requirements"],
  },
  {
    slug: "jurisdiction",
    title: "Jurisdiction and governing law in Professional Indemnity policies",
    eyebrow: "Jurisdiction",
    category: "Policy mechanics",
    description:
      "How the jurisdiction clause in your PI policy determines where a claim can be brought against you, and why it matters even for domestic practices.",
    keyTakeaways: [
      "Jurisdiction defines which country's courts, or which arbitration forum, a claim covered by your policy can be brought in",
      "It's distinct from territorial limit, which concerns where the underlying work was performed",
      "Many South African PI policies limit cover to claims brought in South African courts unless specifically extended",
      "Contracts with foreign clients sometimes include a foreign jurisdiction or arbitration clause — check this against your policy before you sign",
    ],
    sections: [
      {
        heading: "Jurisdiction vs territorial limit",
        paragraphs: [
          "These are frequently confused but answer different questions. Territorial limit asks: where was the work performed? Jurisdiction asks: in which court or forum can a claim relating to that work actually be brought?",
          "You could perform work entirely within South Africa — satisfying your territorial limit — but if your engagement letter designates a foreign court or arbitration seat for disputes, that may fall outside your policy's jurisdiction clause entirely.",
        ],
      },
      {
        heading: "Why jurisdiction affects cost and complexity",
        paragraphs: [
          "Claims litigated overseas, or conducted under foreign procedural rules — particularly in the United States — are typically far more expensive to defend than equivalent South African litigation. Insurers price and restrict jurisdiction accordingly, and many South African PI policies simply don't extend to certain foreign jurisdictions by default.",
        ],
      },
      {
        heading: "Checking your contracts against your policy",
        paragraphs: [
          "Before agreeing to a client's standard contract, check its dispute-resolution and governing-law clause against your PI policy's jurisdiction wording. A mismatch can leave you contractually bound to terms your insurer won't actually support if a dispute arises.",
        ],
      },
    ],
    faqs: [
      {
        question: "My client is based overseas but the contract specifies South African law and courts — am I covered?",
        answer:
          "Generally yes, since jurisdiction concerns where the claim is brought and governed, not where the client is based — but always confirm the specific wording with your broker.",
      },
      {
        question: "What if my policy is silent on jurisdiction?",
        answer:
          "Most policies specify it explicitly. If you can't locate the clause, ask your broker to confirm the position in writing rather than assuming.",
      },
      {
        question: "Can jurisdiction wording be negotiated?",
        answer:
          "Sometimes, particularly for practices with regular foreign client contracts, subject to insurer underwriting appetite.",
      },
    ],
    relatedGuideSlugs: ["territorial-limits", "contract-requirements", "tenders"],
  },
  {
    slug: "extended-reporting-period",
    title: "Extended reporting period (ERP): what it is and how it differs from run-off cover",
    eyebrow: "Extended reporting period",
    category: "Policy mechanics",
    description:
      "The formal insurance term for extending your window to report claims after a policy ends, and how it relates to run-off cover in South Africa.",
    keyTakeaways: [
      "An extended reporting period (ERP), sometimes called a discovery period, gives you extra time after a policy ends to notify claims or circumstances relating to work done while it was in force",
      "In South African PI practice, \"run-off cover\" is the more commonly used term for a longer, deliberately arranged version of the same concept",
      "A short ERP is sometimes automatically included if a policy isn't renewed; run-off cover is a separately purchased, longer-term extension",
      "Neither ERP nor run-off cover extends your retroactive date — they extend how long you have to report a claim, not how far back your policy reaches",
    ],
    sections: [
      {
        heading: "How ERP and run-off cover relate",
        paragraphs: [
          "These terms describe the same underlying mechanism at different scales. A standard or automatic ERP is often brief — sometimes just days to a few months — and included at no extra cost as a courtesy window if you don't renew. Run-off cover is a specifically negotiated, usually paid, extension typically running to several years, arranged when a practice closes, merges or a practitioner retires.",
          "See our dedicated run-off cover guide for the full detail on arranging and pricing this longer-term option.",
        ],
      },
      {
        heading: "When you actually need this",
        paragraphs: [
          "Practice closure, sale, merger, retirement, or even a temporary break from practising, are the situations where ERP or run-off cover become relevant — any point where historic claims-made exposure would otherwise go completely uninsured once your active policy ends.",
        ],
      },
      {
        heading: "What ERP or run-off cover does not do",
        paragraphs: [
          "It doesn't cover new work performed after your original policy ended, and it doesn't move your retroactive date. A claim relating to work carried out before your retroactive date remains excluded, regardless of how long an ERP or run-off period you hold.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a short ERP automatic on every policy?",
        answer:
          "A brief, unpaid ERP is common on many policies if you don't renew, but the exact period varies by insurer — confirm the specific term rather than assuming a standard length.",
      },
      {
        question: "How far ahead should I arrange run-off cover?",
        answer:
          "Before your current policy lapses, ideally as part of planning a retirement, sale or closure well in advance — not scrambled together after the event.",
      },
      {
        question: "Does an extended reporting period cost extra?",
        answer:
          "A brief automatic ERP is usually included at no cost. Longer extensions, or run-off-length periods, are typically a separate, specifically priced arrangement.",
      },
    ],
    relatedGuideSlugs: ["notification-of-circumstances", "renewal", "switching-insurers"],
  },
  {
    slug: "prior-known-circumstances",
    title: "Prior and known circumstances: what happens to issues you already knew about",
    eyebrow: "Prior known circumstances",
    category: "Policy mechanics",
    description:
      "Why a new PI policy won't cover a circumstance you were already aware of before it started, and how this affects switching insurers.",
    keyTakeaways: [
      "PI insurance responds to claims and circumstances that were not known to you before the policy began",
      "A \"known circumstance\" — something you were aware of and reasonably should have expected could lead to a claim — is typically excluded from a new policy, even if you never formally notified anyone",
      "This is why accurate disclosure at renewal or when switching insurers matters — an undisclosed known circumstance can void cover for that specific matter",
      "The right response when you become aware of a possible issue is to notify your current insurer promptly, not wait and hope it doesn't surface before your next renewal",
    ],
    sections: [
      {
        heading: "Why this exclusion exists",
        paragraphs: [
          "Insurance is designed to cover unknown, uncertain future risk — not issues you already know exist. Without this exclusion, cover could effectively be purchased retroactively to insure a problem you were already aware of, which would undermine the basic economics of insurance for everyone.",
        ],
      },
      {
        heading: "How this interacts with notification",
        paragraphs: [
          "This is the flip side of notifying circumstances promptly. Notifying your current insurer as soon as you become aware of a possible issue means it's dealt with under the policy in force at that time — rather than becoming an uninsurable \"known circumstance\" for any future policy you take out. See our notification of circumstances guide for how and when to do this.",
        ],
      },
      {
        heading: "Switching insurers with an open circumstance",
        paragraphs: [
          "A new insurer will typically ask you to disclose any known circumstances as part of the application. Failing to disclose can void the new policy for that specific matter, even if it was never formally lodged as a claim.",
          "If properly disclosed, the new insurer may specifically exclude that matter from the new policy, while your outgoing insurer — if it was notified in time — generally remains responsible for it under your old policy.",
        ],
      },
    ],
    faqs: [
      {
        question: "What if I genuinely didn't realise something could lead to a claim?",
        answer:
          "The test is usually what a reasonable professional in your position ought to have expected, not absolute certainty. If you're in doubt, the safer course is always to disclose and notify.",
      },
      {
        question: "Does this mean I can never switch insurers if I have an open matter?",
        answer:
          "No, but expect that matter to be specifically excluded from the new policy, or to remain the responsibility of your outgoing insurer, rather than silently covered by a new one.",
      },
      {
        question: "Is this the same idea as a pre-existing condition in other insurance types?",
        answer:
          "Conceptually similar — insurance generally does not cover issues that already existed and were known to you before cover incepted.",
      },
    ],
    relatedGuideSlugs: ["notification-of-circumstances", "switching-insurers", "renewal"],
  },
  {
    slug: "loss-of-documents",
    title: "Loss of documents cover under a Professional Indemnity policy",
    eyebrow: "Loss of documents",
    category: "Policy mechanics",
    description:
      "Why losing a client's original documents can trigger a claim even without any error in your professional advice, and how PI policies typically respond.",
    keyTakeaways: [
      "Many PI policies include a specific extension for loss of, or damage to, client documents entrusted to you",
      "This exists because losing an important original document can cause a client real financial loss even where your professional advice was entirely correct",
      "Cover typically responds to the cost of restoring or reconstructing lost documents, and consequential loss where reconstruction isn't possible",
      "This is distinct from a cyber or data breach event — loss of documents cover addresses physical or specific-file loss, not a broader network security failure",
    ],
    sections: [
      {
        heading: "What triggers this cover",
        paragraphs: [
          "Typical scenarios include a file destroyed in a fire or flood, an original signed contract or title deed misplaced in your office, or physical documents lost in transit between offices or to a client.",
        ],
      },
      {
        heading: "What it typically pays for",
        paragraphs: [
          "Reasonable costs of reconstructing lost documents — search fees, re-drafting costs, retrieval from third-party sources such as a deeds office or court registry — and, in some cases, a client's consequential loss where reconstruction genuinely isn't possible.",
        ],
      },
      {
        heading: "Where this overlaps with, and differs from, Cyber cover",
        paragraphs: [
          "A loss of documents extension on a PI policy is generally narrower than a full Cyber Liability policy. A ransomware attack encrypting your entire document management system is a network security event, better addressed by Cyber cover, while a single lost physical file sits more naturally under a PI document-loss extension. See our PI vs Cyber Insurance comparison for the fuller picture.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does this extension cover digital files too?",
        answer:
          "Increasingly, yes, on modern policy wordings — but always confirm with your specific insurer, since older wordings were drafted with physical documents in mind.",
      },
      {
        question: "Is there a separate limit for this extension?",
        answer:
          "Often yes — a sub-limit within your overall limit of indemnity is common. Check your policy schedule for the specific amount.",
      },
      {
        question: "What should I do if I lose a client document?",
        answer:
          "Notify your insurer promptly, in the same way you would any other circumstance, even before the client raises a complaint.",
      },
    ],
    relatedGuideSlugs: ["vs-cyber-insurance", "notification-of-circumstances", "documents-required"],
  },
  {
    slug: "how-much-cover",
    title: "How much Professional Indemnity cover do you actually need?",
    eyebrow: "Sizing your cover",
    category: "Buying process",
    description:
      "A practical framework for deciding your limit of indemnity, beyond just picking a familiar round number.",
    keyTakeaways: [
      "Start from your largest realistic single claim, not an average engagement value or a habit of picking a round number",
      "Check every contract, tender and professional body requirement for a specified minimum before relying on your own judgement alone",
      "Consider claim frequency risk — aggregate vs any-one-claim structure — not just claim size",
      "Revisit your limit at every renewal — a limit that was right three years ago may already be outdated",
    ],
    sections: [
      {
        heading: "Step 1: identify your largest realistic exposure",
        paragraphs: [
          "Look at your largest single contract, project or client relationship over the last two to three years, and add a margin for legal defence costs — which usually erode the same limit on a costs-inclusive policy. See our defence costs guide for why this matters.",
        ],
      },
      {
        heading: "Step 2: check contractual and regulatory floors",
        paragraphs: [
          "Client engagement letters, tender conditions and professional body or regulator guidance frequently set a specific minimum limit that overrides your own risk assessment. Our guides to tenders and contract requirements cover how to find and interpret these.",
        ],
      },
      {
        heading: "Step 3: factor in claim frequency, not just size",
        paragraphs: [
          "A practice handling many small-to-mid engagements concurrently carries different exposure to a firm with one very large annual contract, even at the same headline limit. Our aggregate vs any-one-claim guide explains why the structure of your limit matters as much as its rand value.",
        ],
      },
      {
        heading: "Step 4: revisit every year",
        paragraphs: [
          "Growth in turnover, a new largest client, or taking on higher-value work should each trigger a limit review at your next renewal, not just at initial purchase. See our renewal guide for a full pre-renewal checklist.",
        ],
        bullets: [
          "R500,000 — typically entry-level, for sole practitioners and small contract values",
          "R1,000,000 — the most commonly selected limit across South African practices",
          "R2,000,000 — for growing practices with larger individual contracts",
          "R5,000,000 — common for established practices and larger corporate client requirements",
          "R10,000,000 — typical floor for major infrastructure, SOE and multinational client work",
        ],
      },
    ],
    faqs: [
      {
        question: "Is more cover always better?",
        answer:
          "Not necessarily — higher limits cost more, and an oversized limit relative to your actual exposure can be an inefficient use of premium. The goal is to right-size cover, not maximise it.",
      },
      {
        question: "What if my biggest client relationship changes mid-year?",
        answer:
          "Talk to your broker about a mid-term limit increase rather than waiting for renewal, particularly before signing a materially larger contract than anything you've held before.",
      },
      {
        question: "Do I need the same limit as competitors in my profession?",
        answer:
          "No — your own contract values, claims history and client base matter far more than a general industry norm.",
      },
    ],
    relatedGuideSlugs: ["aggregate-vs-any-one-claim", "tenders", "renewal"],
  },
  {
    slug: "documents-required",
    title: "What documents and information insurers need for a PI application",
    eyebrow: "Documents required",
    category: "Buying process",
    description:
      "What to have ready before applying for Professional Indemnity cover, so your quote is accurate the first time.",
    keyTakeaways: [
      "Most applications need financial, contractual and claims-history information — not just a completed form",
      "Refer-only professions typically need a more detailed submission than professions eligible for instant online quotes",
      "Having your largest contract value and claims history ready in advance materially speeds up underwriting",
      "Incomplete or inaccurate information is one of the most common causes of quote delay or a later coverage dispute",
    ],
    sections: [
      {
        heading: "Core information every application needs",
        paragraphs: [
          "Regardless of profession, most PI applications require a consistent core set of details.",
        ],
        bullets: [
          "Business or practice name and registration details",
          "Annual turnover or professional fee income",
          "Number of principals, directors and employees",
          "Years in business",
          "Largest client or contract value",
          "Claims and notified circumstances over the past 5 years",
          "Desired limit of indemnity and excess",
        ],
      },
      {
        heading: "Profession-specific additions",
        paragraphs: [
          "Beyond the core set, most professions face specific follow-up questions: FSP number and category for insurance brokers, engineering discipline and structural or mining exposure for engineers, or the split between consulting, SaaS, hosting and managed services for IT and software businesses. Check your specific profession page on this site for the exact information typically requested.",
        ],
      },
      {
        heading: "Why refer-only professions need more",
        paragraphs: [
          "Professions outside the automated online-rating band are priced individually by a specialist underwriter rather than from a standard rate table, so they typically require a fuller submission — project examples, sector breakdown, and sometimes background on the principals involved.",
        ],
      },
      {
        heading: "Getting it right the first time",
        paragraphs: [
          "Accuracy matters beyond just speed. The information you disclose in your application forms the basis of your cover, and a material misstatement can be grounds for a declined claim later — even years after the policy was issued.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need audited financials to apply?",
        answer:
          "Not usually for standard applications — management figures or your latest annual turnover are typically sufficient. Larger or refer-only submissions may ask for more detail.",
      },
      {
        question: "What counts as a 'claim' I need to disclose?",
        answer:
          "Any circumstance that could reasonably lead to a claim, not just a claim that's already been formally lodged — see our notification of circumstances guide for the full test.",
      },
      {
        question: "Can I start an application before I have all the information ready?",
        answer:
          "Yes, but expect the process to pause at the point where claims history and contract-value details are needed to finalise a quote.",
      },
    ],
    relatedGuideSlugs: ["how-much-cover", "renewal", "notification-of-circumstances"],
  },
  {
    slug: "renewal",
    title: "Professional Indemnity renewal: what changes each year and what to check",
    eyebrow: "Renewal",
    category: "Buying process",
    description:
      "Why a PI renewal is not just a formality, and what to review before accepting your terms each year.",
    keyTakeaways: [
      "Because PI is claims-made, continuous renewal without a gap is what protects your historic work — a lapse can leave past claims uninsured",
      "Your risk profile changes every year — turnover, largest client, claims history and services offered should all be reviewed, not just rolled over",
      "Renewal is the natural point to revisit your limit of indemnity, excess, and any territorial or jurisdiction requirements",
      "A claim or notified circumstance during the expiring year will usually affect your renewal terms, even without a payout",
    ],
    sections: [
      {
        heading: "Why continuity matters more than for other insurance",
        paragraphs: [
          "PI's claims-made structure means a missed renewal date, even briefly, can create a genuine coverage gap for historic work — unlike occurrence-based insurance, where a lapse only affects incidents happening during the gap itself. Continuous cover is what actually protects work you did years ago.",
        ],
      },
      {
        heading: "What actually changes year to year",
        paragraphs: [
          "Turnover growth, a new largest contract, new service lines — a consultant starting international work, for example — claims or circumstances notified, and changes in principal or employee count all feed into a fresh underwriting view at renewal, not an automatic like-for-like rollover.",
        ],
      },
      {
        heading: "A short renewal checklist",
        paragraphs: [
          "Before accepting your renewal terms, work through the following:",
        ],
        bullets: [
          "Confirm your limit still reflects your current largest contract, not last year's",
          "Confirm your retroactive date has carried over correctly",
          "Review any circumstances notified during the past year",
          "Check whether new services or markets need to be disclosed",
          "Compare your excess against your current cash reserves",
        ],
      },
      {
        heading: "What happens if you renew late or lapse",
        paragraphs: [
          "A lapse of even a few days can mean a claim made during that gap has no policy to respond, regardless of when the underlying work was actually done. If you anticipate needing to lapse temporarily, discuss the options with your broker before it happens, not after.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does my premium always increase at renewal?",
        answer:
          "Not necessarily — it reflects your updated risk profile, which can also improve on a clean claims year with stable turnover.",
      },
      {
        question: "Can I switch insurers at renewal without losing my retroactive date?",
        answer:
          "Generally yes, provided you disclose your full history and the new insurer confirms in writing that it will honour your existing retroactive date — see our switching insurers guide.",
      },
      {
        question: "What if I simply forget to renew?",
        answer:
          "Contact your broker immediately. A short administrative delay is different from a genuine lapse in cover, but don't assume any grace period applies without confirming it directly.",
      },
    ],
    relatedGuideSlugs: ["switching-insurers", "extended-reporting-period", "how-much-cover"],
  },
  {
    slug: "switching-insurers",
    title: "Switching Professional Indemnity insurers without losing cover",
    eyebrow: "Switching insurers",
    category: "Buying process",
    description:
      "The specific things to confirm before moving your PI policy to a new insurer, so historic work stays protected.",
    keyTakeaways: [
      "The single most important thing to confirm in writing is that your new insurer will honour your existing retroactive date",
      "Disclose your full claims and circumstance history to the new insurer — non-disclosure can void cover for anything left out",
      "A circumstance already notified to your outgoing insurer generally remains that insurer's responsibility, not the new insurer's",
      "Compare policy structure — aggregate vs any-one-claim, costs-inclusive vs costs-in-addition, excess — not just headline premium and limit",
    ],
    sections: [
      {
        heading: "Retroactive date: the detail that catches people out",
        paragraphs: [
          "A new insurer defaulting your retroactive date to the new policy's start date, rather than your original starting date, can silently strip away years of historic protection. Get this confirmed in writing before you commit — don't take it on trust from a quote alone.",
        ],
      },
      {
        heading: "Disclosure obligations when switching",
        paragraphs: [
          "Full, accurate disclosure of claims and known circumstances is a condition of any new policy. Anything left undisclosed, and later shown to have been known beforehand, can be treated as a prior known circumstance and excluded — even retrospectively. See our dedicated guide on that topic.",
        ],
      },
      {
        heading: "What stays with your old insurer",
        paragraphs: [
          "Circumstances properly notified during a prior policy period generally remain that insurer's responsibility to handle, even after you've moved to a new one. Confirm this explicitly with both insurers rather than assuming it's automatic.",
        ],
      },
      {
        heading: "Comparing more than price",
        paragraphs: [
          "A cheaper quote built on a lower-quality limit structure, a higher excess, or costs-inclusive defence-cost treatment may not genuinely be comparable to what you currently hold. Ask your broker for a like-for-like structural comparison, not just a premium number.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why would I switch insurers at all?",
        answer:
          "Common reasons include better pricing, broader cover terms, an unsatisfactory claims experience, or your broker recommending a market review at renewal.",
      },
      {
        question: "Is there a right time of year to switch?",
        answer:
          "Typically at your renewal date, to avoid the complications of a short-period policy or mid-term cancellation.",
      },
      {
        question: "What if my new insurer won't match my retroactive date?",
        answer:
          "Treat this as a material term, not a minor detail — it's a reason to reconsider that insurer or negotiate further before committing, not something to accept and hope doesn't matter.",
      },
    ],
    relatedGuideSlugs: ["renewal", "prior-known-circumstances", "extended-reporting-period"],
  },
  {
    slug: "tenders",
    title: "Professional Indemnity requirements in tenders and RFPs",
    eyebrow: "Tenders",
    category: "Contracts & tenders",
    description:
      "How to read and respond to the PI insurance clauses in a tender document, and what to check before you bid.",
    keyTakeaways: [
      "Tender documents frequently specify a minimum limit of indemnity, and sometimes a specific structure or minimum period of run-off cover",
      "Public-sector and SOE tenders in South Africa commonly set higher minimums than typical private-client contracts",
      "Confirm you can actually obtain the specified limit, structure and territorial or jurisdiction terms before submitting a bid that commits you to them",
      "Starting the insurance conversation only after winning a tender is a common and avoidable mistake",
    ],
    sections: [
      {
        heading: "What tender PI clauses typically specify",
        paragraphs: [
          "A minimum rand limit, occasionally whether it must apply per claim rather than in the aggregate, a minimum number of years of run-off cover to be maintained after project completion, and sometimes a requirement to name the client as an interested party or to provide a formal certificate of insurance.",
        ],
      },
      {
        heading: "Public sector and SOE tenders",
        paragraphs: [
          "These often set materially higher limits — frequently in the R5,000,000 to R10,000,000 range or above for larger infrastructure work — and stricter proof-of-cover requirements than typical private-sector contracts. See our R5,000,000 and R10,000,000 cover pages for the detail on what typically sits at these tiers.",
        ],
      },
      {
        heading: "Checking feasibility before you bid",
        paragraphs: [
          "For refer-only professions, or unusually high required limits, get written confirmation from your insurer or broker that the required limit and structure are actually obtainable before submitting your bid — not after you've won. Losing a contract because cover couldn't be arranged in time is entirely avoidable with early engagement.",
        ],
      },
      {
        heading: "Providing proof of cover",
        paragraphs: [
          "Most tenders require a current certificate of insurance, or a broker's letter of confirmation. Keep this documentation current and ready to produce on short notice, since tender deadlines rarely allow much lead time.",
        ],
      },
    ],
    faqs: [
      {
        question: "What if the tender requires a higher limit than I currently hold?",
        answer:
          "Ask your insurer or broker whether your limit can be increased for the duration of the specific contract, either permanently or via a temporary endorsement.",
      },
      {
        question: "Do I need to hold the tender's required limit even if I don't win?",
        answer:
          "No — only if you're awarded the contract. Confirming feasibility before bidding simply avoids a late scramble if you do win.",
      },
      {
        question: "What does a 'letter of undertaking' from an insurer mean?",
        answer:
          "It's a broker or insurer confirmation that cover at the required terms can be arranged if you're awarded the contract — useful, and sometimes required, to include with a tender bid.",
      },
    ],
    relatedGuideSlugs: ["contract-requirements", "how-much-cover", "liability-caps"],
  },
  {
    slug: "contract-requirements",
    title: "Reading the Professional Indemnity clause in a client contract",
    eyebrow: "Contract requirements",
    category: "Contracts & tenders",
    description:
      "What to check in a client's standard contract before you sign, so its insurance clause actually matches what your policy provides.",
    keyTakeaways: [
      "A contract's insurance clause is a promise about what cover you'll maintain — check it matches your actual policy before signing, not after a claim",
      "Watch for liability caps, indemnity and hold-harmless wording that goes beyond your ordinary professional duty of care — this can fall outside standard PI cover",
      "Confirm the contract's governing law and dispute-resolution clause is consistent with your policy's jurisdiction terms",
      "If a contract requires a specific limit, a period of post-completion run-off cover, or that the client be named as an interested party, confirm feasibility with your insurer before signing",
    ],
    sections: [
      {
        heading: "The most commonly missed clauses",
        paragraphs: [
          "A handful of clauses cause the most trouble in practice:",
        ],
        bullets: [
          "A minimum limit of indemnity required to be maintained",
          "A requirement to maintain cover for a defined period after the contract ends — a de facto run-off requirement",
          "A requirement to notify the client of any lapse or material change in your cover",
          "Broad indemnity or liability wording that exceeds your ordinary professional duty of care",
        ],
      },
      {
        heading: "Why broad indemnity clauses are a problem",
        paragraphs: [
          "A PI policy generally responds to your legal liability for negligence — not to liability you've contractually assumed beyond that. Signing a broad indemnity clause can create a gap between what you've promised the client and what your insurer will actually pay. See our liability caps guide for how this plays out in practice.",
        ],
      },
      {
        heading: "Aligning contract terms with your policy",
        paragraphs: [
          "Compare the contract's required limit against your actual limit, check its governing law and jurisdiction clause against your policy's jurisdiction terms, and flag any post-termination cover requirement to your broker before signing, not after.",
        ],
      },
      {
        heading: "When to push back",
        paragraphs: [
          "It's entirely reasonable to negotiate a contract clause your insurer has confirmed it cannot support — an unusually long run-off requirement, or a liability cap set above your actual limit — rather than signing and hoping it never becomes relevant.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I just sign and sort out the insurance detail afterwards?",
        answer:
          "No — if a claim arises and your policy doesn't match what you contractually promised, you may be personally exposed for the difference.",
      },
      {
        question: "What if the client insists on wording my insurer won't support?",
        answer:
          "Raise it directly. Many clients will accept reasonable amendments once the specific mismatch is explained, particularly around excessive indemnity language.",
      },
      {
        question: "Does every contract need an explicit PI clause?",
        answer:
          "Not necessarily, but the absence of one doesn't remove your underlying professional liability — it simply means the contract is silent on your insurance obligations specifically.",
      },
    ],
    relatedGuideSlugs: ["liability-caps", "tenders", "subcontractors"],
  },
  {
    slug: "liability-caps",
    title: "Liability caps in client contracts: how they interact with your PI cover",
    eyebrow: "Liability caps",
    category: "Contracts & tenders",
    description:
      "What a contractual liability cap is, why clients ask for them, and how they relate to — but don't replace — your Professional Indemnity limit.",
    keyTakeaways: [
      "A liability cap in a contract limits how much you can be required to pay a specific client under that agreement — it's a contract term, not an insurance term",
      "A liability cap does not increase or guarantee your insurance cover — your PI limit still governs what your insurer will actually pay",
      "Capping your liability below your PI limit is a reasonable risk-management tool; capping it above your limit creates a personal exposure gap",
      "Uncapped liability clauses should generally be treated as a red flag requiring specific insurer sign-off before you agree",
    ],
    sections: [
      {
        heading: "What a liability cap actually does",
        paragraphs: [
          "It's a negotiated contractual ceiling on your financial exposure to a specific client under a specific engagement, typically expressed as a fixed rand amount or a multiple of fees paid under that contract.",
        ],
      },
      {
        heading: "The gap between a cap and your insurance limit",
        paragraphs: [
          "A contract capping your liability at R10,000,000 doesn't mean your insurer will pay R10,000,000 — your policy's actual limit of indemnity governs what's paid. If your limit is lower than the contractual cap, you personally carry the difference.",
        ],
      },
      {
        heading: "Setting a cap that matches your cover",
        paragraphs: [
          "Good practice is to cap contractual liability at or below your PI limit of indemnity, so a worst-case claim under that contract stays within what your insurance actually pays. See our how much cover guide for sizing your limit correctly in the first place.",
        ],
      },
      {
        heading: "Uncapped liability clauses",
        paragraphs: [
          "Some contracts — particularly from large corporates or in specific sectors — refuse any cap at all. This should prompt a specific, direct conversation with your insurer or broker about whether your policy and limit are genuinely appropriate for that level of exposure before you sign.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I always try to cap my liability?",
        answer:
          "Generally sensible risk management, but the right cap level depends on the specific contract value and your available cover — it isn't a fixed, one-size-fits-all rule.",
      },
      {
        question: "Can I agree to a cap higher than my PI limit?",
        answer:
          "You can agree to it contractually, but you'd be personally responsible for any amount above your actual insurance limit.",
      },
      {
        question: "Do liability caps apply to gross negligence or fraud?",
        answer:
          "Usually not — most caps, like most PI policies themselves, exclude deliberate or grossly negligent conduct from any form of limitation.",
      },
    ],
    relatedGuideSlugs: ["contract-requirements", "how-much-cover", "tenders"],
  },
  {
    slug: "vs-public-liability",
    title: "Professional Indemnity vs Public Liability: what's the difference?",
    eyebrow: "PI vs Public Liability",
    category: "Comparisons",
    description:
      "Two of the most commonly confused business insurance covers, and why many professional practices need both.",
    keyTakeaways: [
      "Professional Indemnity covers financial loss caused by your advice, design or professional service; Public Liability covers third-party bodily injury or property damage",
      "The two covers respond to fundamentally different triggers — a design error is a PI matter, a visitor tripping in your reception is a Public Liability matter",
      "Many professional practices need both, since site visits, inspections and client-facing premises all create Public Liability exposure alongside pure advice risk",
      "Holding only one when your business needs both leaves a real gap — check both, not just the one that feels most relevant to your title",
    ],
    sections: [
      {
        heading: "What triggers each policy",
        paragraphs: [
          "A claim alleging that your advice, design, certification or professional service caused financial loss is a Professional Indemnity matter. A claim alleging physical injury to a person, or physical damage to property, caused by your business's operations or premises is a Public Liability matter.",
        ],
      },
      {
        heading: "Where professions typically need both",
        paragraphs: [
          "Architects, engineers and project managers conducting site inspections; veterinary practices with client and animal-owner premises exposure; and effectively any business with client-facing offices or regular site visits all carry meaningful Public Liability exposure alongside their PI risk. See our Public Liability product page for what that cover typically includes.",
        ],
      },
      {
        heading: "A worked example",
        paragraphs: [
          "An engineer's design error causing a structural defect is a PI claim. A subcontractor injured on a site the same engineer is inspecting, in the course of the same project, is a Public Liability matter — two distinct policies, potentially arising from work on the very same job.",
        ],
      },
      {
        heading: "Checking you're not accidentally relying on the wrong policy",
        paragraphs: [
          "Read your PI policy's exclusions (bodily injury and property damage are near-universally excluded) alongside your Public Liability policy's exclusions (professional advice or service claims are near-universally excluded there) to confirm nothing falls into the gap between the two.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need both if I mostly work from an office with no site visits?",
        answer:
          "Public Liability exposure is lower in that case, but rarely zero — client visits to your premises, deliveries and general occupier liability still apply.",
      },
      {
        question: "Is Public Liability more expensive than PI?",
        answer:
          "Pricing depends on the specific risk factors relevant to each cover — there's no general rule that one is consistently cheaper than the other.",
      },
      {
        question: "Can one insurer provide both on a combined policy?",
        answer:
          "Often yes — many insurers offer combined or linked PI and Public Liability policies for convenience. Ask your broker to compare this against separate policies.",
      },
    ],
    relatedGuideSlugs: ["vs-cyber-insurance", "how-much-cover", "subcontractors"],
  },
  {
    slug: "vs-cyber-insurance",
    title: "Professional Indemnity vs Cyber Insurance: what's the difference?",
    eyebrow: "PI vs Cyber",
    category: "Comparisons",
    description:
      "Why a data breach and a professional negligence claim are different exposures, and why technology and advisory businesses increasingly need both covers.",
    keyTakeaways: [
      "Professional Indemnity covers liability for your advice, design or service; Cyber Insurance covers data breaches, ransomware and network security failures",
      "The same underlying incident can trigger both — a software defect that causes financial loss to a client and a subsequent data exposure",
      "Technology, financial services and any business holding significant client data typically carry meaningful exposure under both",
      "Assuming PI covers everything \"digital\" because it sounds broader is a common and costly misunderstanding — most PI wordings exclude cyber events entirely",
    ],
    sections: [
      {
        heading: "What triggers each policy",
        paragraphs: [
          "Professional Indemnity responds to a claim that your advice, code, design or professional service was negligent and caused loss. Cyber Insurance responds to a data breach, ransomware attack, network security failure, or the costs of responding to one — notification, forensic investigation, business interruption and cyber extortion.",
        ],
      },
      {
        heading: "Where the two overlap in practice",
        paragraphs: [
          "Consider a software company shipping defective code that both causes a client's system to fail — a PI trigger — and, through the same underlying vulnerability, separately exposes that client's data — a Cyber trigger. One incident, two distinct policy triggers, often needing both covers to respond fully.",
        ],
      },
      {
        heading: "Why 'my PI covers everything digital' is a myth",
        paragraphs: [
          "Most PI wordings explicitly exclude cyber events. A ransomware attack on your own systems, even where it also disrupts a client project, is generally a Cyber matter, not a PI one. Our loss of documents guide covers the narrower document-specific overlap that does sometimes sit within a PI policy.",
        ],
      },
      {
        heading: "Who should seriously consider both",
        paragraphs: [
          "IT consultants, software companies, financial advisers, and any business processing meaningful volumes of personal information under POPIA all carry real exposure on both fronts. See our Cyber Liability product page and our POPIA resource article for more on this specific compliance angle.",
        ],
      },
    ],
    faqs: [
      {
        question: "If I can only budget for one, which matters more?",
        answer:
          "It depends on your business — a pure advisory practice with little client data may weight PI higher, while a data-heavy technology business may weight Cyber equally or higher. There's no universal answer.",
      },
      {
        question: "Does Cyber cover my liability if a client sues me over a data breach?",
        answer:
          "Many Cyber policies include third-party liability for failing to protect client data, but confirm the specific scope with your insurer — this varies by policy.",
      },
      {
        question: "Can I buy these as one combined policy?",
        answer:
          "Some insurers offer combined technology-focused packages covering both angles, particularly for software and IT businesses — worth asking your broker to compare against separate policies.",
      },
    ],
    relatedGuideSlugs: ["loss-of-documents", "vs-public-liability", "documents-required"],
  },
  {
    slug: "artificial-intelligence",
    title: "Professional Indemnity and artificial intelligence: emerging risk for South African professionals",
    eyebrow: "AI & professional liability",
    category: "Emerging risk",
    description:
      "How the growing use of AI tools in professional services is starting to affect PI risk, disclosure and underwriting.",
    keyTakeaways: [
      "Using AI tools in your professional work doesn't remove your professional duty of care — you remain responsible for the advice, design or output you deliver to a client",
      "Insurers are increasingly asking about AI tool usage as part of underwriting, particularly for technology, legal, financial and consulting practices",
      "An error originating from an AI tool is generally treated the same as any other professional error for PI purposes — your policy responds to your liability for the deliverable, not to how it was produced",
      "Disclosing significant reliance on AI tools in client-facing work is emerging as good practice, both contractually and for accurate underwriting",
    ],
    sections: [
      {
        heading: "Does using AI change what your PI policy covers?",
        paragraphs: [
          "Generally, no. Cover responds to your professional liability for the advice, design or service you deliver, regardless of what tools you used to produce it. Using an AI tool doesn't itself void or reduce cover, provided you exercised appropriate professional oversight and judgement over the final output before it reached your client.",
        ],
      },
      {
        heading: "Where new risk is emerging",
        paragraphs: [
          "The real exposure is over-reliance on unverified AI output without adequate professional review — a lawyer citing a fabricated case, an accountant accepting an AI-generated figure without checking it, a developer shipping AI-generated code without testing.",
          "Insurers are starting to treat inadequate oversight of AI-assisted output as a potential aggravating factor in a negligence claim, in much the same way inadequate review of a junior staff member's work has always been treated.",
        ],
      },
      {
        heading: "What insurers are starting to ask",
        paragraphs: [
          "Expect increasing underwriting questions about whether AI tools are used in producing client deliverables, what review process exists before AI-assisted output reaches a client, and whether client data is shared with third-party AI tools — which raises a separate POPIA and Cyber consideration alongside the PI question. See our PI vs Cyber Insurance guide for that overlap.",
        ],
      },
      {
        heading: "Practical steps for professionals using AI tools",
        paragraphs: [
          "A few habits materially reduce this emerging risk:",
        ],
        bullets: [
          "Maintain the same review and sign-off standard for AI-assisted work as for any other output",
          "Disclose material AI use to clients where it could reasonably affect their expectations",
          "Check whether client data entered into AI tools is handled consistently with your POPIA obligations",
          "Ask your insurer directly whether AI use is now a specific underwriting question at your renewal",
        ],
      },
    ],
    faqs: [
      {
        question: "Will my premium increase because I use AI tools?",
        answer:
          "Not automatically. Insurers are still developing their approach to this — the more relevant factor is whether your review and quality-control processes are adequate, AI-assisted or not.",
      },
      {
        question: "Is there a specific 'AI exclusion' on PI policies?",
        answer:
          "Not standard practice currently on South African PI wordings, but this is a genuinely evolving area — always check your specific policy wording and ask your broker directly rather than assuming.",
      },
      {
        question: "Does this affect software companies differently to advisory professions?",
        answer:
          "Yes — a software company building AI features into its own product carries product-liability-style exposure for the tool itself, in addition to any PI exposure from advice given about it. This is a more complex and faster-evolving risk area than a professional simply using an AI tool to help produce their own advice.",
      },
    ],
    relatedGuideSlugs: ["vs-cyber-insurance", "defence-costs", "notification-of-circumstances"],
  },
];

export function getPiGuideBySlug(slug: string): PiGuide | undefined {
  return piGuides.find((g) => g.slug === slug);
}

export function getRelatedGuides(guide: PiGuide): PiGuide[] {
  return guide.relatedGuideSlugs
    .map((slug) => getPiGuideBySlug(slug))
    .filter((g): g is PiGuide => Boolean(g));
}
