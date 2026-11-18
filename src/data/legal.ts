export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "orderedList"; items: string[] };

export interface LegalPage {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  body: LegalBlock[];
}

const contactEmail = "hello@backedsure.co.za";
const contactPhone = "+27 83 575 6352";
const fspDetails =
  "BackedSure is a division of Covered Financial Services, an authorised Financial Services Provider, FSP number 54871.";

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How BackedSure collects, uses, stores and protects personal information under POPIA.",
    updatedAt: "4 September 2026",
    body: [
      {
        type: "paragraph",
        text: `${fspDetails} This Privacy Policy explains how we collect, use, disclose, store and protect personal information when you visit our website, request an insurance quote, submit a proposal form, contact us, create an account, lodge a claim or otherwise use our services.`,
      },
      {
        type: "paragraph",
        text: "We process personal information in accordance with the Protection of Personal Information Act, 2013, the Financial Advisory and Intermediary Services Act, 2002, applicable insurance legislation and other laws that apply to our business.",
      },
      { type: "heading", text: "Who Is Responsible For Your Information" },
      {
        type: "paragraph",
        text: "Covered Financial Services is the responsible party for personal information processed through BackedSure, except where an insurer, underwriting manager, administrator, payment provider or other authorised third party acts as an independent responsible party for its own regulatory or contractual purposes.",
      },
      {
        type: "paragraph",
        text: `Questions about privacy or data subject rights can be sent to ${contactEmail}. You can also contact us on ${contactPhone}.`,
      },
      { type: "heading", text: "Information We Collect" },
      {
        type: "list",
        items: [
          "Identity and contact details, including your name, ID or registration details, role, email address, telephone number and business address.",
          "Business and professional information, including your profession, services, licence details, turnover, fee income, locations, client profile, industry memberships, employees, subcontractors and risk management practices.",
          "Insurance information, including existing cover, policy history, claims history, loss circumstances, desired limits, deductibles, underwriting responses and supporting documents.",
          "Financial and transaction information, including premium amounts, payment status, invoice details and billing records where relevant.",
          "Account and platform information, including login identifiers, submitted forms, saved applications, uploaded documents and dashboard activity.",
          "Communications with us, including emails, calls, contact forms, complaints, claim notifications and records of advice or service interactions.",
          "Technical information, including IP address, browser, device type, pages visited, referral source, session information, approximate location and cookie data.",
        ],
      },
      { type: "heading", text: "How We Collect Information" },
      {
        type: "list",
        items: [
          "Directly from you when you complete forms, request quotes, send documents, contact us or use the platform.",
          "From your business, employer, representatives, brokers, advisers, directors, members, partners or authorised users.",
          "From insurers, underwriting managers, administrators, loss adjusters, claims handlers, compliance providers and other parties involved in arranging or administering cover.",
          "From public sources, regulatory registers, professional bodies, sanctions databases, credit or fraud prevention sources where lawful and relevant.",
          "Automatically through website analytics, logs and cookies.",
        ],
      },
      { type: "heading", text: "Why We Use Personal Information" },
      {
        type: "list",
        items: [
          "To respond to enquiries and provide information about insurance products.",
          "To assess your needs and collect information needed for quotation, underwriting, policy placement, policy administration and renewal.",
          "To submit applications to insurers, underwriting managers or administrators and obtain terms, declines, referrals or other underwriting outcomes.",
          "To provide intermediary services, keep records of services rendered and comply with FAIS duties.",
          "To administer claims, complaints, policy changes, cancellations, refunds and customer support requests.",
          "To verify identity, prevent fraud, manage sanctions and anti-money-laundering risks, and protect the platform.",
          "To operate, maintain, secure and improve the website, quote engine, forms, email systems and customer dashboard.",
          "To send service messages, quote updates, renewal reminders, compliance notices and other communications related to your relationship with us.",
          "To send marketing only where permitted by law or where you have consented, and to allow you to opt out of direct marketing.",
          "To comply with legal, regulatory, audit, tax, accounting, dispute resolution and reporting obligations.",
        ],
      },
      { type: "heading", text: "Legal Grounds For Processing" },
      {
        type: "paragraph",
        text: "We process personal information where it is necessary to perform a contract or take steps before entering into a contract, where you have consented, where processing is required by law, where processing protects a legitimate interest of you or BackedSure, or where processing is necessary for the proper performance of a public law duty by a regulator or authorised body.",
      },
      { type: "heading", text: "Special Personal Information And Children" },
      {
        type: "paragraph",
        text: "We do not intentionally collect special personal information or personal information of children unless it is necessary for a specific insurance, claim, complaint, legal or regulatory purpose and the processing is permitted by law. If you provide information about another person, you must have authority to do so and must make this policy available to that person where practical.",
      },
      { type: "heading", text: "Sharing Personal Information" },
      {
        type: "list",
        items: [
          "Insurers, underwriting managers, reinsurers, administrators and binder holders.",
          "Claims handlers, assessors, loss adjusters, legal advisers, investigators and dispute resolution bodies.",
          "Compliance officers, auditors, accountants, professional advisers and regulators, including the FSCA, Information Regulator and Ombud schemes where applicable.",
          "Technology providers used for hosting, storage, forms, email, analytics, security, CRM, document generation, payment and customer support.",
          "Your authorised representatives, business contacts, broker, adviser, employer or other persons you ask us to deal with.",
          "Law enforcement, courts, government bodies or third parties where disclosure is required or permitted by law.",
        ],
      },
      {
        type: "paragraph",
        text: "We require service providers who process personal information for us to protect it and use it only for authorised purposes.",
      },
      { type: "heading", text: "Cross-Border Transfers" },
      {
        type: "paragraph",
        text: "Some systems, insurers, reinsurers or service providers may process information outside South Africa. Where personal information is transferred cross-border, we take reasonable steps to ensure the recipient is subject to appropriate privacy, confidentiality and security obligations, or that another lawful basis for the transfer applies.",
      },
      { type: "heading", text: "Cookies And Analytics" },
      {
        type: "paragraph",
        text: "We may use cookies, pixels, logs and similar technologies to keep the website working, remember preferences, secure sessions, measure performance and understand how visitors use our services. You can usually disable cookies in your browser, but some parts of the website may not work properly without them.",
      },
      { type: "heading", text: "Security" },
      {
        type: "paragraph",
        text: "We use reasonable technical and organisational safeguards designed to protect personal information against loss, unauthorised access, misuse, alteration or disclosure. These safeguards may include access controls, secure hosting, encryption in transit, least-privilege permissions, monitoring, backups and staff or service-provider confidentiality controls.",
      },
      { type: "heading", text: "Retention" },
      {
        type: "paragraph",
        text: "We keep personal information only for as long as needed for the purpose for which it was collected, for a lawful related purpose, for insurance and claims administration, or to meet legal, regulatory, tax, accounting, audit and dispute resolution requirements. When information is no longer required, we will delete, destroy or de-identify it where practical.",
      },
      { type: "heading", text: "Your Rights" },
      {
        type: "list",
        items: [
          "Ask whether we hold personal information about you and request access to it.",
          "Ask us to correct, update or delete inaccurate, irrelevant, excessive, outdated or unlawfully obtained personal information.",
          "Object to processing where POPIA allows an objection.",
          "Withdraw consent where processing is based on consent, without affecting earlier lawful processing.",
          "Opt out of direct marketing.",
          "Complain to us or to the Information Regulator if you believe your privacy rights have been infringed.",
        ],
      },
      {
        type: "paragraph",
        text: `To exercise these rights, email ${contactEmail}. We may need to verify your identity and may refuse or limit a request where the law allows or requires us to do so.`,
      },
      { type: "heading", text: "Security Compromises" },
      {
        type: "paragraph",
        text: "If we have reasonable grounds to believe that your personal information has been accessed or acquired by an unauthorised person, we will assess the incident and notify affected data subjects and the Information Regulator where required by POPIA.",
      },
      { type: "heading", text: "Changes To This Policy" },
      {
        type: "paragraph",
        text: "We may update this Privacy Policy from time to time. The latest version published on this website applies from the updated date shown on the page.",
      },
    ],
  },
  {
    slug: "paia",
    title: "PAIA Manual",
    description:
      "BackedSure's access to information manual under PAIA and POPIA.",
    updatedAt: "4 September 2026",
    body: [
      {
        type: "paragraph",
        text: "This manual is prepared for BackedSure, a division of Covered Financial Services, in terms of section 51 of the Promotion of Access to Information Act, 2000 and relevant provisions of the Protection of Personal Information Act, 2013.",
      },
      {
        type: "paragraph",
        text: "PAIA gives persons a right to request access to records held by private bodies where access is required for the exercise or protection of any right. POPIA gives data subjects rights in relation to their personal information.",
      },
      { type: "heading", text: "Business Details" },
      {
        type: "list",
        items: [
          "Trading name: BackedSure.",
          "Operating entity: Covered Financial Services.",
          "Regulatory status: Authorised Financial Services Provider.",
          "FSP number: 54871.",
          `Public contact email: ${contactEmail}.`,
          `Public contact telephone: ${contactPhone}.`,
          "Website: https://backedsure.co.za.",
        ],
      },
      { type: "heading", text: "Information Officer" },
      {
        type: "paragraph",
        text: `Requests under PAIA or POPIA may be sent to the Information Officer through ${contactEmail}. Please mark the subject line as "PAIA request" or "POPIA request" and include enough detail for us to identify the record or personal information concerned.`,
      },
      { type: "heading", text: "Guide On How To Use PAIA" },
      {
        type: "paragraph",
        text: "The Information Regulator publishes a guide explaining how to use PAIA. The guide and prescribed forms are available from the Information Regulator and its eServices portal. The Information Regulator can be contacted at enquiries@inforegulator.org.za or 010 023 5200.",
      },
      { type: "heading", text: "Records Automatically Available" },
      {
        type: "paragraph",
        text: "The following records may be available without a formal PAIA request, depending on the information requested and any applicable restrictions:",
      },
      {
        type: "list",
        items: [
          "Public website pages, product information, resource articles and legal notices.",
          "Marketing material and general product summaries.",
          "Public regulatory details, including the FSP number.",
          "Your own quote, proposal, policy, claim or account information where we can verify your identity and authority.",
        ],
      },
      { type: "heading", text: "Records Held By BackedSure" },
      {
        type: "list",
        items: [
          "Client and prospect records, including enquiries, quote requests, proposal forms, declarations, communications and consent records.",
          "Insurance placement records, including underwriting submissions, quotes, schedules, policy documents, endorsements, renewal records and insurer communications.",
          "Claims records, including claim notifications, supporting documents, correspondence, decisions, recoveries and settlement information.",
          "Complaints records, including complaint submissions, investigation notes, outcomes and Ombud correspondence.",
          "Compliance records, including FAIS records, conflict-of-interest registers, advice and intermediary-service records, training records, representative records and audit material.",
          "Operational records, including supplier contracts, service-provider records, invoices, accounting records and tax records.",
          "Technology records, including website logs, security logs, platform records, support tickets and analytics.",
          "Human resources and contractor records where applicable.",
        ],
      },
      { type: "heading", text: "Records Held Under Other Laws" },
      {
        type: "paragraph",
        text: "We may hold records required by FAIS, POPIA, PAIA, the Financial Sector Regulation Act, insurance legislation, company law, tax law, employment law, anti-money-laundering and sanctions laws, electronic communications laws and other applicable legislation.",
      },
      { type: "heading", text: "POPIA Processing Details" },
      {
        type: "paragraph",
        text: "The categories of data subjects whose personal information we process include clients, prospective clients, policyholders, insured persons, claimants, complainants, representatives of businesses, directors, members, partners, employees, suppliers, service providers, website users and other persons connected to insurance services.",
      },
      {
        type: "paragraph",
        text: "The purposes of processing include responding to enquiries, assessing insurance needs, arranging quotes, placing and administering cover, handling claims and complaints, maintaining records, complying with regulatory duties, preventing fraud, securing our systems and improving our services.",
      },
      {
        type: "paragraph",
        text: "Recipients may include insurers, underwriting managers, administrators, reinsurers, claims providers, compliance providers, technology providers, professional advisers, regulators, Ombud schemes, courts, law enforcement and persons authorised by the data subject.",
      },
      {
        type: "paragraph",
        text: "Some processing may involve service providers or insurance market participants outside South Africa. We take reasonable steps to ensure that cross-border processing is lawful and subject to appropriate safeguards.",
      },
      { type: "heading", text: "How To Request Access To A Record" },
      {
        type: "orderedList",
        items: [
          `Send the prescribed PAIA Form 2, or a written request containing the same required information, to ${contactEmail}.`,
          "Describe the record clearly enough for us to identify it.",
          "Explain the right you seek to exercise or protect and why the record is required for that right.",
          "Provide proof of identity and, if acting for another person or business, proof of authority.",
          "State your preferred form of access, such as electronic copy, inspection or another reasonable format.",
          "Pay any prescribed request, search, preparation, reproduction or access fee if applicable.",
        ],
      },
      { type: "heading", text: "Timing And Outcome" },
      {
        type: "paragraph",
        text: "We will respond within the time periods required by PAIA. Access may be granted, partially granted or refused. If a fee is payable, we may require payment before providing access. If a request is refused, we will give reasons and explain available remedies.",
      },
      { type: "heading", text: "Grounds For Refusal" },
      {
        type: "paragraph",
        text: "PAIA requires or permits refusal of access in certain circumstances, including where disclosure would unreasonably reveal personal information of another person, reveal confidential commercial information, breach a duty of confidence, endanger safety, prejudice legal privilege, prejudice law enforcement, or disclose legally protected research, security or operational information.",
      },
      { type: "heading", text: "Remedies" },
      {
        type: "paragraph",
        text: "If your PAIA request is refused, partially refused or not answered within the required period, you may lodge a complaint with the Information Regulator or approach a court for appropriate relief. PAIA complaints may be sent to PAIAComplaints@inforegulator.org.za.",
      },
      { type: "heading", text: "Availability And Updates" },
      {
        type: "paragraph",
        text: "This manual is available on the BackedSure website and electronically on request. We may update it when our business, records, contact details or legal obligations change.",
      },
    ],
  },
  {
    slug: "complaints",
    title: "Complaints Process",
    description:
      "How to lodge a complaint with BackedSure and escalate unresolved complaints.",
    updatedAt: "4 September 2026",
    body: [
      {
        type: "paragraph",
        text: "BackedSure aims to resolve complaints fairly, consistently and as quickly as the matter allows. This process applies to complaints about our website, quote process, intermediary services, policy administration, communication, claims assistance, privacy handling or any other service provided by BackedSure.",
      },
      { type: "heading", text: "What Counts As A Complaint" },
      {
        type: "paragraph",
        text: "A complaint is any expression of dissatisfaction that requires a response or resolution. It may relate to service quality, advice or intermediary services, disclosure, delay, conduct, a policy outcome, a claim, a privacy issue or the way a previous complaint was handled.",
      },
      { type: "heading", text: "How To Lodge A Complaint" },
      {
        type: "paragraph",
        text: `Email your complaint to ${contactEmail} or contact us on ${contactPhone}. Please use the subject line "Complaint" where possible.`,
      },
      {
        type: "list",
        items: [
          "Your full name, business name and contact details.",
          "Policy, quote, claim or application reference, if available.",
          "A clear description of what happened and what outcome you want.",
          "Copies of relevant documents, emails, screenshots or other supporting information.",
          "Whether you are acting for yourself, a business or another person, and proof of authority where relevant.",
        ],
      },
      { type: "heading", text: "Our Internal Process" },
      {
        type: "orderedList",
        items: [
          "We acknowledge receipt as soon as reasonably possible and record the complaint.",
          "We assess the issue, identify whether another party such as an insurer or underwriting manager must be involved, and assign the matter for handling.",
          "We may ask for additional information if the complaint cannot be assessed from the material provided.",
          "We investigate the facts, relevant policy terms, service records, regulatory obligations and fairness considerations.",
          "We give you a written outcome, including reasons, any proposed remedy and escalation options if you remain dissatisfied.",
        ],
      },
      { type: "heading", text: "Timeframes" },
      {
        type: "paragraph",
        text: "We aim to acknowledge complaints promptly and resolve straightforward complaints as quickly as possible. More complex matters, claims disputes, underwriting issues or matters involving third parties may take longer. We will keep you informed where a final response cannot be provided quickly.",
      },
      { type: "heading", text: "Possible Outcomes" },
      {
        type: "list",
        items: [
          "An explanation or apology.",
          "Correction of an error or record.",
          "Escalation to an insurer, underwriting manager, administrator or claims handler.",
          "A service remedy, process change or further assistance.",
          "Confirmation that the original decision or action stands, with reasons.",
        ],
      },
      { type: "heading", text: "Escalation" },
      {
        type: "paragraph",
        text: "If you are not satisfied with our final response, or if the matter is not resolved within a reasonable time, you may escalate the complaint to the appropriate Ombud or regulator depending on the nature of the complaint.",
      },
      {
        type: "list",
        items: [
          "Complaints about financial advice or intermediary services: FAIS Ombud, info@faisombud.co.za, www.faisombud.co.za.",
          "Complaints about non-life insurance policy or claim disputes: National Financial Ombud Scheme South Africa, info@nfosa.co.za, www.nfosa.co.za, 086 800 900.",
          "Complaints about privacy or POPIA: Information Regulator, POPIAComplaints@inforegulator.org.za.",
          "Complaints about access to information under PAIA: Information Regulator, PAIAComplaints@inforegulator.org.za.",
          "Regulatory conduct enquiries: Financial Sector Conduct Authority, www.fsca.co.za.",
        ],
      },
      { type: "heading", text: "No Retaliation" },
      {
        type: "paragraph",
        text: "You will not be penalised for lodging a complaint. We treat complaints as an important part of customer fairness, risk management and service improvement.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description:
      "The terms that apply when using the BackedSure website and digital services.",
    updatedAt: "4 September 2026",
    body: [
      {
        type: "paragraph",
        text: "These Terms of Use govern your access to and use of the BackedSure website, quote tools, proposal forms, customer dashboard, content and related digital services. By using the website or submitting information to us, you agree to these terms.",
      },
      {
        type: "paragraph",
        text: `${fspDetails} References to "BackedSure", "we", "us" or "our" are references to BackedSure and Covered Financial Services where the context requires.`,
      },
      { type: "heading", text: "No Binding Cover From Website Use Alone" },
      {
        type: "paragraph",
        text: "Website content, indicative premiums, quote ranges, eligibility prompts and automated results are for information and triage only unless we expressly confirm in writing that a binding quotation, policy, renewal, endorsement or cover instruction has been accepted by the relevant insurer or underwriting authority.",
      },
      {
        type: "paragraph",
        text: "Insurance cover is subject to underwriting, completed proposal information, premium payment where required, policy terms, conditions, limits, deductibles, exclusions and any insurer requirements.",
      },
      { type: "heading", text: "No Personal Legal, Tax Or Financial Advice" },
      {
        type: "paragraph",
        text: "Information on this website is general in nature. It does not constitute legal, tax, accounting or other professional advice. Where financial advice or intermediary services are provided, they are provided in accordance with the applicable FAIS disclosures and requirements.",
      },
      { type: "heading", text: "Your Responsibilities" },
      {
        type: "list",
        items: [
          "Provide accurate, complete and current information.",
          "Tell us if information changes before cover is placed, renewed or amended.",
          "Do not submit information unless you have authority to do so.",
          "Review all quotes, proposal summaries, declarations, schedules, policy wording and insurer documents carefully.",
          "Ask questions if anything is unclear before accepting terms or relying on information.",
          "Keep your login details secure and tell us promptly if you suspect unauthorised account access.",
          "Use the website lawfully and do not interfere with its security, availability or integrity.",
        ],
      },
      { type: "heading", text: "Proposal Forms And Declarations" },
      {
        type: "paragraph",
        text: "Insurers rely on the information you provide. Incorrect, incomplete or misleading information may result in declined cover, changed terms, cancellation, rejected claims or recovery of claim payments. You are responsible for checking that proposal information and declarations are true and complete before submission.",
      },
      { type: "heading", text: "Quotes, Premiums And Product Information" },
      {
        type: "paragraph",
        text: "Premiums, cover descriptions and product summaries shown on the website are indicative unless expressly stated otherwise. The policy wording, schedule and written insurer terms take precedence over website summaries. Availability of products may change without notice.",
      },
      { type: "heading", text: "Third Parties" },
      {
        type: "paragraph",
        text: "Our services may involve insurers, underwriting managers, administrators, payment providers, analytics providers, document tools, email providers and other third parties. We are not responsible for third-party websites or services that are outside our control, even where we link to them.",
      },
      { type: "heading", text: "Intellectual Property" },
      {
        type: "paragraph",
        text: "The website, brand, content, copy, layout, software, forms, calculators and other materials belong to us or our licensors. You may use them for ordinary personal or business insurance purposes, but you may not copy, scrape, reproduce, resell, reverse engineer or commercially exploit them without written permission.",
      },
      { type: "heading", text: "Acceptable Use" },
      {
        type: "list",
        items: [
          "Do not use the website for unlawful, fraudulent, misleading or harmful purposes.",
          "Do not attempt to gain unauthorised access to systems, data, accounts or networks.",
          "Do not submit malware, spam, excessive automated requests or content that infringes another person's rights.",
          "Do not impersonate another person or misrepresent your authority.",
        ],
      },
      { type: "heading", text: "Availability And Changes" },
      {
        type: "paragraph",
        text: "We may change, suspend or discontinue any part of the website or digital services at any time. We aim to keep the services available and accurate, but we do not guarantee uninterrupted access, error-free operation or that all information is complete at all times.",
      },
      { type: "heading", text: "Limitation Of Liability" },
      {
        type: "paragraph",
        text: "To the maximum extent allowed by law, BackedSure is not liable for indirect, incidental, special or consequential loss arising from use of the website, inability to use the website, reliance on general content, third-party services, technical failures or unauthorised access beyond our reasonable control. Nothing in these terms excludes liability that cannot legally be excluded.",
      },
      { type: "heading", text: "Privacy" },
      {
        type: "paragraph",
        text: "Our processing of personal information is governed by our Privacy Policy. By submitting personal information, you confirm that you have authority to provide it and that it may be processed for the purposes described in that policy.",
      },
      { type: "heading", text: "Governing Law" },
      {
        type: "paragraph",
        text: "These terms are governed by the laws of the Republic of South Africa. Disputes may be referred to the appropriate court, Ombud, regulator or dispute resolution body with jurisdiction.",
      },
      { type: "heading", text: "Contact" },
      {
        type: "paragraph",
        text: `Questions about these terms can be sent to ${contactEmail}.`,
      },
    ],
  },
  {
    slug: "conflict-of-interest",
    title: "Conflict of Interest Policy",
    description:
      "How BackedSure identifies, manages and discloses conflicts of interest.",
    updatedAt: "4 September 2026",
    body: [
      {
        type: "paragraph",
        text: `${fspDetails} This Conflict of Interest Policy summarises how conflicts are identified, avoided, managed, disclosed and monitored in relation to financial services provided through BackedSure.`,
      },
      { type: "heading", text: "Purpose" },
      {
        type: "paragraph",
        text: "The purpose of this policy is to help ensure that clients receive fair, objective and appropriate service and that our interests, the interests of our representatives, associates, product suppliers or service providers do not improperly influence outcomes for clients.",
      },
      { type: "heading", text: "What Is A Conflict Of Interest" },
      {
        type: "paragraph",
        text: "A conflict of interest is any situation in which an actual or potential interest may influence, or may be perceived to influence, the objective performance of our duties to a client. A conflict may be financial or non-financial, direct or indirect, actual or perceived.",
      },
      { type: "heading", text: "Examples Of Potential Conflicts" },
      {
        type: "list",
        items: [
          "Receiving commission, fees or other remuneration from an insurer or underwriting manager.",
          "Having a preferred insurer, underwriting manager or service provider relationship.",
          "Receiving training, technology, marketing support, hospitality or other immaterial financial interests from a product supplier.",
          "Placing business with a supplier where an ownership, commercial or personal relationship exists.",
          "A representative handling a matter involving a family member, associate or business in which they have an interest.",
          "A complaint, claim or renewal decision that may affect our remuneration or commercial relationship.",
        ],
      },
      { type: "heading", text: "Management Measures" },
      {
        type: "list",
        items: [
          "We aim to avoid conflicts where reasonably possible.",
          "Where a conflict cannot be avoided, we manage it through disclosure, role separation, approval controls, supervision or other appropriate measures.",
          "We disclose material conflicts to affected clients in a clear and timely way.",
          "We keep records of identified conflicts and the steps taken to manage them.",
          "We monitor remuneration, supplier relationships and gifts or benefits for conflict risk.",
          "We require representatives and staff to act honestly, fairly, with due skill, care and diligence, and in the interests of clients.",
        ],
      },
      { type: "heading", text: "Remuneration" },
      {
        type: "paragraph",
        text: "BackedSure may earn commission, binder fees, administration fees, service fees or other lawful remuneration in connection with insurance products and services. The nature of remuneration will be disclosed where required and can be requested from us.",
      },
      { type: "heading", text: "Financial Interests And Gifts" },
      {
        type: "paragraph",
        text: "We do not permit financial interests that are prohibited by FAIS conflict-of-interest rules. Any allowable immaterial financial interests, gifts or benefits must be reasonable, recorded where required and must not compromise client outcomes.",
      },
      { type: "heading", text: "Product Supplier Relationships" },
      {
        type: "paragraph",
        text: "We may work with selected insurers, underwriting managers and administrators based on product suitability, underwriting appetite, service capability, pricing, claims handling, operational efficiency and regulatory standing. We do not allow these relationships to override fair treatment of clients.",
      },
      { type: "heading", text: "Disclosure To Clients" },
      {
        type: "paragraph",
        text: "Where a material conflict exists or may reasonably be perceived to exist, we will disclose the nature of the conflict, its possible impact, and the steps taken to manage it. Disclosure does not by itself cure a conflict; it forms part of a broader management process.",
      },
      { type: "heading", text: "Roles And Responsibilities" },
      {
        type: "paragraph",
        text: "Management is responsible for implementing this policy, maintaining appropriate controls and reviewing conflict risks. Representatives and staff must report actual or potential conflicts promptly and must not proceed with conflicted conduct unless the conflict has been assessed and managed.",
      },
      { type: "heading", text: "Reporting Concerns" },
      {
        type: "paragraph",
        text: `Clients who believe a conflict has affected their service may contact us at ${contactEmail} and may use our Complaints Process if they are dissatisfied with the response.`,
      },
    ],
  },
  {
    slug: "tcf",
    title: "Treating Customers Fairly",
    description:
      "BackedSure's commitment to fair outcomes for insurance customers.",
    updatedAt: "4 September 2026",
    body: [
      {
        type: "paragraph",
        text: "Treating Customers Fairly is an outcomes-based approach to financial sector conduct in South Africa. BackedSure applies TCF principles across product selection, marketing, quotations, advice and intermediary services, policy administration, claims support, complaints and renewals.",
      },
      { type: "heading", text: "Our Commitment" },
      {
        type: "paragraph",
        text: "We aim to make professional insurance easier to understand and easier to access without hiding the limitations, underwriting requirements or exclusions that matter. Fairness is built into how we design forms, explain products, handle referrals, communicate decisions and support clients after sale.",
      },
      { type: "heading", text: "Outcome 1: Fairness In Our Culture" },
      {
        type: "paragraph",
        text: "Customers should be confident that they are dealing with a business where fair treatment is central to the way decisions are made. We consider fairness when designing workflows, choosing partners, handling complaints, reviewing content and monitoring customer outcomes.",
      },
      { type: "heading", text: "Outcome 2: Products Designed For Identified Needs" },
      {
        type: "paragraph",
        text: "Products and services should be designed and marketed for identified customer groups. BackedSure focuses on professional-service businesses and professionals with professional indemnity and related risks. We ask profession-specific questions so that cover discussions are aligned to the risk profile being presented.",
      },
      { type: "heading", text: "Outcome 3: Clear Information" },
      {
        type: "paragraph",
        text: "Customers should receive clear information and be kept appropriately informed before, during and after point of sale. We aim to explain product purpose, underwriting requirements, indicative pricing, limits, deductibles, exclusions, referrals, claims steps and renewal obligations in plain language.",
      },
      { type: "heading", text: "Outcome 4: Suitable Advice Where Advice Is Given" },
      {
        type: "paragraph",
        text: "Where advice is provided, it should be suitable and take account of the customer's circumstances. We gather relevant information before making recommendations and encourage clients to ask questions where a limit, exclusion, disclosure or product choice is unclear.",
      },
      { type: "heading", text: "Outcome 5: Products Perform As Expected" },
      {
        type: "paragraph",
        text: "Customers should receive products that perform as they have been led to expect, subject to policy terms. We seek to avoid overpromising, distinguish between indicative and binding terms, and make policy documents available so clients can understand what is and is not covered.",
      },
      { type: "heading", text: "Outcome 6: No Unreasonable Post-Sale Barriers" },
      {
        type: "paragraph",
        text: "Customers should not face unreasonable barriers when they need to change cover, submit documents, claim, complain or cancel. We provide contact channels, keep records, assist with insurer processes and tell customers where unresolved matters can be escalated.",
      },
      { type: "heading", text: "Practical Measures" },
      {
        type: "list",
        items: [
          "Plain-language website and form content.",
          "Clear distinction between indicative pricing, referrals and binding quotations.",
          "Profession-specific information gathering.",
          "Escalation routes for complex underwriting or claims issues.",
          "Complaints process with access to relevant Ombud and regulator channels.",
          "Review of customer feedback, complaints and operational issues.",
          "Conflict-of-interest controls and disclosure where required.",
        ],
      },
      { type: "heading", text: "Customer Responsibilities" },
      {
        type: "paragraph",
        text: "Fair outcomes also depend on customers providing accurate information, reading policy documents, asking questions where anything is unclear, paying premiums when due, notifying us of material changes and reporting claims or circumstances promptly.",
      },
      { type: "heading", text: "Contact" },
      {
        type: "paragraph",
        text: `Questions or concerns about fair treatment can be sent to ${contactEmail}. Complaints can be lodged through our Complaints Process.`,
      },
    ],
  },
];

export function getLegalPageBySlug(slug: string): LegalPage | undefined {
  return legalPages.find((p) => p.slug === slug);
}
