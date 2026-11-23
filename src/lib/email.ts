import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type {
  PIQuoteAnswers,
  PIRatingResult,
  Profession,
  TechnologyProposalAnswers,
  SATechnologyProposalAnswers,
} from "@/types";
import { formatCurrency } from "@/lib/utils";
import { PI_PRODUCT_SLUG, quoteProductNames } from "@/data/quoteProducts";
import {
  feeActivityCategories,
  endUserApplicationCategories,
  marketCategories,
} from "@/components/quote/technologyProposalTypes";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.SMTP_FROM || smtpUser;
const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_TO;

function isEmailConfigured() {
  return Boolean(smtpHost && smtpUser && smtpPass && mailFrom);
}

function createTransport() {
  const options: SMTPTransport.Options = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  };

  return nodemailer.createTransport(options);
}

function formatResult(result: PIRatingResult) {
  if (result.riskClassification === "REFER") {
    return "Specialist review required";
  }

  if (!result.premiumEstimate) {
    return result.riskClassification;
  }

  return `${formatCurrency(result.premiumEstimate.monthly)} per month / ${formatCurrency(result.premiumEstimate.annual)} per year`;
}

function plainQuoteSummary(
  answers: PIQuoteAnswers,
  profession: Profession,
  result: PIRatingResult,
) {
  const includesPI = answers.products.includes(PI_PRODUCT_SLUG);

  return [
    `Cover requested: ${quoteProductNames(answers.products).join(", ")}`,
    `Profession: ${profession.pluralName}`,
    `Business: ${answers.businessName}`,
    `Business address: ${answers.businessAddress}`,
    `Contact: ${answers.contact.fullName}`,
    `Email: ${answers.contact.email}`,
    `Mobile: ${answers.contact.mobile}`,
    `Turnover: ${formatCurrency(answers.annualTurnover)}`,
    `Cover limit: ${formatCurrency(answers.coverLimit)}`,
    includesPI ? `PI risk result: ${result.riskClassification}` : null,
    includesPI ? `PI estimated premium: ${formatResult(result)}` : null,
    includesPI && result.referralReasons.length
      ? `Referral reasons: ${result.referralReasons.join("; ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendQuoteEmails({
  answers,
  profession,
  result,
}: {
  answers: PIQuoteAnswers;
  profession: Profession;
  result: PIRatingResult;
}) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "SMTP is not configured." };
  }

  if (!adminEmail) {
    return { sent: false, reason: "The admin notification email is not configured." };
  }

  const transport = createTransport();
  const summary = plainQuoteSummary(answers, profession, result);
  const customerName = answers.contact.fullName.split(" ")[0] || "there";

  const customerEmail = transport.sendMail({
    from: mailFrom,
    to: answers.contact.email,
    subject: "We received your BackedSure quote request",
    text: [
      `Hi ${customerName},`,
      "",
      `Thanks for submitting your ${quoteProductNames(answers.products).join(", ")} quote request.`,
      "A BackedSure specialist will review your information and contact you with the next steps.",
      "",
      "Your application summary:",
      summary,
      "",
      "Regards,",
      "BackedSure",
    ].join("\n"),
  });

  const adminNotification = transport.sendMail({
    from: mailFrom,
    to: adminEmail,
    replyTo: answers.contact.email,
    subject: `New quote request (${quoteProductNames(answers.products).join(", ")}): ${profession.pluralName} - ${answers.businessName}`,
    text: [
      "A new BackedSure quote request was submitted.",
      "",
      summary,
      "",
      "Raw answers:",
      JSON.stringify(answers, null, 2),
    ].join("\n"),
  });

  await Promise.all([customerEmail, adminNotification]);

  return { sent: true };
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmails(submission: ContactSubmission) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "SMTP is not configured." };
  }

  if (!adminEmail) {
    return { sent: false, reason: "The admin notification email is not configured." };
  }

  const transport = createTransport();
  const customerName = submission.name.split(" ")[0] || "there";

  const customerEmail = transport.sendMail({
    from: mailFrom,
    to: submission.email,
    subject: "We received your BackedSure message",
    text: [
      `Hi ${customerName},`,
      "",
      "Thanks for contacting BackedSure. A specialist will respond shortly.",
      "",
      "Your message:",
      submission.message,
      "",
      "Regards,",
      "BackedSure",
    ].join("\n"),
  });

  const adminNotification = transport.sendMail({
    from: mailFrom,
    to: adminEmail,
    replyTo: submission.email,
    subject: `New website contact: ${submission.name}`,
    text: [
      "A new message was submitted through the BackedSure contact form.",
      "",
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      "",
      "Message:",
      submission.message,
    ].join("\n"),
  });

  await Promise.all([customerEmail, adminNotification]);

  return { sent: true };
}

function plainTechnologyProposalSummary(answers: TechnologyProposalAnswers) {
  const desiredLimits = [
    ...answers.desiredCoverLimits.map((v) => formatCurrency(Number(v))),
    ...(answers.desiredCoverLimitOther ? [formatCurrency(Number(answers.desiredCoverLimitOther))] : []),
  ];

  return [
    `Insured: ${answers.insuredName}`,
    `Physical address: ${answers.physicalAddress}`,
    `Website: ${answers.companyWebsite || "N/A"}`,
    `Principals/professionals: ${answers.numPrincipals || "N/A"}`,
    `Non-professional employees: ${answers.numNonProfessionalEmployees || "N/A"}`,
    `Current year fees — domestic: ${answers.currentYear.domesticFees || "N/A"}, sub-consulted: ${answers.currentYear.subConsultedFees || "N/A"}, international: ${answers.currentYear.internationalFees || "N/A"}`,
    `Works outside SA: ${answers.worksOutsideSA || "N/A"}`,
    `Existing PI cover: ${answers.hasExistingPI || "N/A"}${answers.hasExistingPI === "yes" ? ` (${answers.existingPIInsurer})` : ""}`,
    `Claims in last 5 years: ${answers.claimsHistory.length > 0 ? answers.claimsHistory.length : "None declared"}`,
    `Uses Generative AI: ${answers.usesGenerativeAI || "N/A"}`,
    `Desired limit(s) of indemnity: ${desiredLimits.length > 0 ? desiredLimits.join(", ") : "N/A"}`,
    `Desired deductible: ${answers.desiredDeductible ? formatCurrency(Number(answers.desiredDeductible)) : "N/A"}`,
    `Contact: ${answers.declarationName} (${answers.declarationDesignation})`,
    `Email: ${answers.contactEmail}`,
    `Mobile: ${answers.contactMobile}`,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function yesNoLabel(value: string): string {
  return value === "yes" ? "Yes" : value === "no" ? "No" : "";
}

/** One label/value table row — renders nothing if the value is empty, so sections stay compact. */
function emailRow(label: string, value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  return `<tr>
    <td style="padding:5px 16px 5px 0;color:#5b6b64;font-size:13px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:5px 0;color:#162a24;font-size:13px;font-weight:600;vertical-align:top;">${escapeHtml(String(value))}</td>
  </tr>`;
}

/** A titled section containing the given rows — renders nothing if every row was empty. */
function emailSection(title: string, rowsHtml: string): string {
  if (!rowsHtml.trim()) return "";
  return `
  <tr><td style="padding-top:22px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#2f6454;border-bottom:1px solid #e5e7e3;padding-bottom:8px;">${escapeHtml(title)}</p>
    <table role="presentation" style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
  </td></tr>`;
}

function moneyOrEmpty(value: string | undefined): string {
  const n = Number(value);
  return value && !Number.isNaN(n) ? formatCurrency(n) : "";
}

/** "2026-02" -> "Feb 2026" — the SA technology form collects financial year-end as a month/year only. */
function monthYear(value: string | undefined): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  if (!year || index < 0 || index > 11) return value;
  return new Date(Number(year), index, 1).toLocaleDateString("en-ZA", { month: "short", year: "numeric" });
}

function percentRows(record: Record<string, string>): string {
  return Object.entries(record)
    .filter(([, v]) => v)
    .map(([label, v]) => emailRow(label, `${v}%`))
    .join("");
}

function buildTechnologyProposalAdminHtml(answers: TechnologyProposalAnswers): string {
  const futureYear = {
    domesticFees: String(Math.round((Number(answers.currentYear.domesticFees) || 0) * 1.1)),
    subConsultedFees: String(Math.round((Number(answers.currentYear.subConsultedFees) || 0) * 1.1)),
    internationalFees: String(Math.round((Number(answers.currentYear.internationalFees) || 0) * 1.1)),
  };
  const yearTotal = (y: { domesticFees: string; subConsultedFees: string; internationalFees: string }) =>
    (Number(y.domesticFees) || 0) + (Number(y.subConsultedFees) || 0) + (Number(y.internationalFees) || 0);

  const feesTable = `
    <table role="presentation" style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr>
        <td style="padding:6px 12px 6px 0;color:#5b6b64;"></td>
        <td style="padding:6px 12px;color:#5b6b64;text-align:right;">Past year</td>
        <td style="padding:6px 12px;color:#5b6b64;text-align:right;">Current year</td>
        <td style="padding:6px 0;color:#5b6b64;text-align:right;">Future (est. +10%)</td>
      </tr>
      ${[
        ["Domestic fees", answers.pastYear.domesticFees, answers.currentYear.domesticFees, futureYear.domesticFees],
        ["Sub-consulted fees", answers.pastYear.subConsultedFees, answers.currentYear.subConsultedFees, futureYear.subConsultedFees],
        ["International fees", answers.pastYear.internationalFees, answers.currentYear.internationalFees, futureYear.internationalFees],
      ]
        .map(
          ([label, past, current, future]) => `<tr>
        <td style="padding:4px 12px 4px 0;color:#162a24;">${escapeHtml(label as string)}</td>
        <td style="padding:4px 12px;color:#162a24;text-align:right;">${moneyOrEmpty(past as string) || "—"}</td>
        <td style="padding:4px 12px;color:#162a24;text-align:right;">${moneyOrEmpty(current as string) || "—"}</td>
        <td style="padding:4px 0;color:#162a24;text-align:right;">${moneyOrEmpty(future as string) || "—"}</td>
      </tr>`,
        )
        .join("")}
      <tr>
        <td style="padding:6px 12px 0 0;color:#162a24;font-weight:800;border-top:1px solid #e5e7e3;">Total</td>
        <td style="padding:6px 12px 0;color:#162a24;font-weight:800;text-align:right;border-top:1px solid #e5e7e3;">${formatCurrency(yearTotal(answers.pastYear))}</td>
        <td style="padding:6px 12px 0;color:#162a24;font-weight:800;text-align:right;border-top:1px solid #e5e7e3;">${formatCurrency(yearTotal(answers.currentYear))}</td>
        <td style="padding:6px 0 0;color:#162a24;font-weight:800;text-align:right;border-top:1px solid #e5e7e3;">${formatCurrency(yearTotal(futureYear))}</td>
      </tr>
    </table>`;

  const principalsRows = answers.principals
    .filter((p) => p.name)
    .map(
      (p) =>
        `<tr>
          <td style="padding:4px 12px 4px 0;color:#162a24;">${escapeHtml(p.name)}</td>
          <td style="padding:4px 12px;color:#5b6b64;">${escapeHtml(p.qualification || "—")}</td>
          <td style="padding:4px 12px;color:#5b6b64;">${escapeHtml(p.dateQualified ? new Date(p.dateQualified).toLocaleDateString("en-ZA", { month: "short", year: "numeric", timeZone: "UTC" }) : "—")}</td>
          <td style="padding:4px 0;color:#5b6b64;">${escapeHtml(p.yearsInPractice ? `${p.yearsInPractice} yrs` : "—")}</td>
        </tr>`,
    )
    .join("");

  const claimsRows = answers.claimsHistory
    .filter((c) => c.date || c.description)
    .map(
      (c) =>
        `<tr>
          <td style="padding:4px 12px 4px 0;color:#162a24;white-space:nowrap;vertical-align:top;">${escapeHtml(c.date || "—")}</td>
          <td style="padding:4px 0;color:#5b6b64;">${escapeHtml(c.description)}</td>
        </tr>`,
    )
    .join("");

  const revenueSplitRows = answers.activityRevenueSplit
    .filter((r) => r.activity)
    .map((r) => emailRow(r.activity, r.percentage ? `${r.percentage}%` : ""))
    .join("");

  const desiredLimitsList = [
    ...answers.desiredCoverLimits.map((v) => formatCurrency(Number(v))),
    ...(answers.desiredCoverLimitOther ? [`${formatCurrency(Number(answers.desiredCoverLimitOther))} (other)`] : []),
  ].join(", ");

  const internationalRows = answers.worksOutsideSA === "yes"
    ? [
        emailRow("Work outside SA — details", answers.worksOutsideSADetails),
        emailRow("Undertakes work outside SA borders", yesNoLabel(answers.undertakesWorkOutsideSA)),
        emailRow("— details", answers.workOutsideSADetails),
        emailRow("Offices domiciled outside SA", yesNoLabel(answers.officesOutsideSA)),
        emailRow("— offices list", answers.officesOutsideSAList),
        emailRow("North America / similar-jurisdiction exposure", yesNoLabel(answers.northAmericaExposure)),
        emailRow("— % of fees", answers.northAmericaFeePercentage ? `${answers.northAmericaFeePercentage}%` : ""),
        emailRow("— physical offices there", yesNoLabel(answers.northAmericaPhysicalOffices)),
        emailRow("— office management", answers.northAmericaOfficeManagement),
        emailRow("— foreign shareholding", yesNoLabel(answers.northAmericaForeignShareholding)),
        emailRow("— shareholding %", answers.northAmericaForeignShareholdingPercentage ? `${answers.northAmericaForeignShareholdingPercentage}%` : ""),
        emailRow("Advises on foreign law", yesNoLabel(answers.advisesOnForeignLaw)),
        emailRow("— details", answers.advisesOnForeignLawDetails),
      ].join("")
    : emailRow("Works outside South Africa", "No");

  const existingPiRows =
    answers.hasExistingPI === "yes"
      ? [
          emailRow("Insurer", answers.existingPIInsurer),
          emailRow("Expiry date", answers.existingPIExpiryDate),
          emailRow("Limit of indemnity", moneyOrEmpty(answers.existingPILimit)),
          emailRow("Retroactive date", answers.existingPIRetroactiveDate),
          emailRow("Deductible", moneyOrEmpty(answers.existingPIDeductible)),
          emailRow("Premium", moneyOrEmpty(answers.existingPIPremium)),
        ].join("")
      : "";

  const aiRows =
    answers.usesGenerativeAI === "yes"
      ? [
          emailRow("What & how it's used", answers.aiDescription),
          emailRow("Who may use it", answers.aiAuthorisedUsers),
          emailRow("Usage monitoring", answers.aiUsageMonitoring),
          emailRow("% of business reliant on it", answers.aiBusinessReliancePercentage ? `${answers.aiBusinessReliancePercentage}%` : ""),
          emailRow("Output verification", answers.aiOutputVerification),
          emailRow("Final sign-off on AI output", answers.aiFinalDecisionMaker),
        ].join("")
      : "";

  return `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;background:#f5f7f5;padding:24px;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr><td style="background:#162a24;padding:22px 28px;border-radius:10px 10px 0 0;">
        <p style="margin:0;color:#a9bab2;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">New Technology PI Proposal</p>
        <h1 style="margin:6px 0 0;color:#ffffff;font-size:21px;">${escapeHtml(answers.insuredName)}</h1>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e5e7e3;border-top:none;border-radius:0 0 10px 10px;padding:6px 28px 26px;">
        <table role="presentation" style="width:100%;border-collapse:collapse;">

          ${emailSection(
            "Company",
            [
              emailRow("Physical address", answers.physicalAddress),
              emailRow("Website", answers.companyWebsite),
              emailRow("Principals / professionals", answers.numPrincipals),
              emailRow("Non-professional employees", answers.numNonProfessionalEmployees),
              emailRow("Controlled by another firm", yesNoLabel(answers.controlledByOtherFirm)),
              emailRow("— details", answers.controlledByOtherFirmDetails),
            ].join(""),
          )}

          ${emailSection("Fees & financials", `<tr><td colspan="2">${feesTable}</td></tr>`)}

          ${principalsRows ? emailSection("Partners / principals / key employees", principalsRows) : ""}

          ${emailSection(
            "Professional practice",
            [
              emailRow("Professional association membership", yesNoLabel(answers.belongsToAssociation)),
              emailRow("— details", answers.associationDetails),
              emailRow("Membership ever cancelled/suspended", yesNoLabel(answers.membershipCancelledSuspended)),
              emailRow("Uses written contract with clients", yesNoLabel(answers.usesWrittenContract)),
              emailRow("Has risk management procedures", yesNoLabel(answers.hasRiskManagementProcedures)),
              emailRow("— details", answers.riskManagementDetails),
              emailRow("Subcontracting", answers.subcontractingPercentage ? `${answers.subcontractingPercentage}%` : ""),
              emailRow("Written contract with subcontractors", yesNoLabel(answers.usesWrittenContractWithSubcontractors)),
              emailRow("Limits liability under contract", yesNoLabel(answers.limitsLiabilityUnderContract)),
            ].join(""),
          )}

          ${emailSection("International exposure", internationalRows)}

          ${emailSection(
            "Insurance & claims history",
            [
              emailRow("Existing PI cover", yesNoLabel(answers.hasExistingPI)),
              existingPiRows,
              emailRow("Prior insurance declined/cancelled", yesNoLabel(answers.priorInsuranceDeclinedCancelled)),
              emailRow("— details", answers.priorInsuranceDeclinedDetails),
              emailRow("Knowledge of a potential claim", yesNoLabel(answers.knowledgeOfPotentialClaim)),
              emailRow("— details", answers.knowledgeOfPotentialClaimDetails),
              claimsRows ? `<tr><td colspan="2" style="padding-top:6px;color:#5b6b64;font-size:13px;">Claims in the last 5 years</td></tr>${claimsRows}` : emailRow("Claims in the last 5 years", "None declared"),
              emailRow("Aware of circumstances that may give rise to a claim", yesNoLabel(answers.awareOfCircumstances)),
              emailRow("— details", answers.awareOfCircumstancesDetails),
            ].join(""),
          )}

          ${emailSection(
            "Technology activities",
            [
              emailRow("Activities", answers.activitiesDescription),
              revenueSplitRows ? `<tr><td colspan="2" style="padding-top:6px;color:#5b6b64;font-size:13px;">Revenue split</td></tr>${revenueSplitRows}` : "",
            ].join(""),
          )}

          ${emailSection("Revenue by activity type", percentRows(answers.feesByActivity) + emailRow("Other IT — details", answers.otherActivityDescription))}

          ${emailSection("End-user applications", percentRows(answers.endUserApplications) + emailRow("Other — details", answers.otherEndUserDescription))}

          ${emailSection("Markets served", percentRows(answers.markets) + emailRow("Other — details", answers.otherMarketDescription))}

          ${emailSection(
            "Risk & quality management",
            [
              emailRow("Contracts exclude consequential loss", yesNoLabel(answers.contractsExcludeConsequentialLoss)),
              emailRow("System work documented & tested", yesNoLabel(answers.systemWorkDocumentedTested)),
              emailRow("Clients sign off pilot tests", yesNoLabel(answers.clientsSignOffPilotTests)),
              emailRow("Clients responsible for accuracy (in writing)", yesNoLabel(answers.clientsResponsibleForAccuracy)),
              emailRow("Contract delays examined", yesNoLabel(answers.contractDelaysExamined)),
              emailRow("Development methodology", answers.developmentMethodology),
            ].join(""),
          )}

          ${emailSection("Artificial intelligence", emailRow("Uses Generative AI / ML", yesNoLabel(answers.usesGenerativeAI)) + aiRows)}

          ${emailSection(
            "Limit of indemnity",
            [
              emailRow("Requested limit(s)", desiredLimitsList || "—"),
              emailRow("Preferred deductible", moneyOrEmpty(answers.desiredDeductible)),
            ].join(""),
          )}

          ${emailSection(
            "Declaration & contact",
            [
              emailRow("Name", `${answers.declarationName} (${answers.declarationDesignation})`),
              emailRow("Date", answers.declarationDate),
              emailRow("Email", answers.contactEmail),
              emailRow("Mobile", answers.contactMobile),
            ].join(""),
          )}

        </table>
      </td></tr>
    </table>

    <p style="margin:18px 4px 0;color:#a9bab2;font-size:11px;">
      Full raw submission JSON is attached for reference alongside the prefilled iTOO PDF.
    </p>
  </div>`;
}

function buildTechnologyProposalCustomerHtml(answers: TechnologyProposalAnswers): string {
  const firstName = escapeHtml(answers.declarationName.split(" ")[0] || "there");
  const desiredLimits = [
    ...answers.desiredCoverLimits.map((v) => formatCurrency(Number(v))),
    ...(answers.desiredCoverLimitOther ? [formatCurrency(Number(answers.desiredCoverLimitOther))] : []),
  ];
  const submittedDate = answers.declarationDate
    ? new Date(answers.declarationDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const snapshotRow = (label: string, value: string) =>
    !value
      ? ""
      : `<tr>
      <td style="padding:7px 0;color:#5b6b64;font-size:13px;">${escapeHtml(label)}</td>
      <td style="padding:7px 0;color:#162a24;font-size:13px;font-weight:700;text-align:right;">${escapeHtml(value)}</td>
    </tr>`;

  return `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f7f5;padding:24px;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr><td style="background:#162a24;padding:28px 32px;border-radius:12px 12px 0 0;">
        <table role="presentation" style="border-collapse:collapse;">
          <tr>
            <td style="width:30px;height:30px;background:#c8e36e;border-radius:8px;text-align:center;vertical-align:middle;font-size:15px;font-weight:800;color:#162a24;">B</td>
            <td style="padding-left:10px;color:#ffffff;font-size:15px;font-weight:800;">BackedSure</td>
          </tr>
        </table>
        <p style="margin:22px 0 0;display:inline-block;background:rgba(200,227,110,0.16);color:#c8e36e;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 10px;border-radius:999px;">
          Application received
        </p>
        <h1 style="margin:12px 0 0;color:#ffffff;font-size:22px;line-height:1.3;">
          Thanks, ${firstName} — we've got your Technology PI proposal.
        </h1>
      </td></tr>

      <tr><td style="background:#ffffff;border:1px solid #e5e7e3;border-top:none;padding:30px 32px;">
        <p style="margin:0 0 16px;color:#162a24;font-size:14px;line-height:1.7;">
          A BackedSure specialist is reviewing your Technology / IT Professional Indemnity proposal for
          <strong>${escapeHtml(answers.insuredName)}</strong>. Here's what happens from here:
        </p>

        <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 22px;">
          ${[
            ["1", "A specialist reviews your application", "Usually within one business day."],
            ["2", "We'll follow up if anything needs clarifying", `We may call or email you at ${escapeHtml(answers.contactMobile || answers.contactEmail)}.`],
            ["3", "You'll receive your quote and next steps", "Sent straight to this email address."],
          ]
            .map(
              ([num, title, detail]) => `<tr>
                <td style="width:28px;vertical-align:top;padding:6px 0;">
                  <span style="display:inline-flex;width:22px;height:22px;border-radius:50%;background:#e8f1ed;color:#234c40;font-size:11px;font-weight:800;text-align:center;line-height:22px;">${num}</span>
                </td>
                <td style="padding:6px 0 6px 10px;">
                  <p style="margin:0;color:#162a24;font-size:13.5px;font-weight:700;">${title}</p>
                  <p style="margin:2px 0 0;color:#5b6b64;font-size:12.5px;">${detail}</p>
                </td>
              </tr>`,
            )
            .join("")}
        </table>

        <table role="presentation" style="width:100%;border-collapse:collapse;background:#f5f7f5;border:1px solid #e5e7e3;border-radius:10px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#5b6b64;">Application snapshot</p>
            <table role="presentation" style="width:100%;border-collapse:collapse;">
              ${snapshotRow("Business", answers.insuredName)}
              ${snapshotRow("Requested limit(s)", desiredLimits.join(", "))}
              ${snapshotRow("Preferred deductible", moneyOrEmpty(answers.desiredDeductible))}
              ${snapshotRow("Submitted by", `${answers.declarationName} (${answers.declarationDesignation})`)}
              ${snapshotRow("Date", submittedDate)}
            </table>
          </td></tr>
        </table>

        <p style="margin:22px 0 0;color:#5b6b64;font-size:12.5px;line-height:1.7;">
          Need to send us your standard client contract or other supporting documents? Just reply to this
          email and attach them — no need to fill anything in again.
        </p>

        <p style="margin:22px 0 0;color:#162a24;font-size:14px;">
          Warm regards,<br />The BackedSure Team
        </p>

        <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:26px;border-top:1px solid #e5e7e3;">
          <tr><td style="padding-top:18px;">
            <p style="margin:0;color:#5b6b64;font-size:12px;">Questions in the meantime?</p>
            <p style="margin:3px 0 0;color:#234c40;font-size:13px;font-weight:700;">hello@backedsure.co.za &nbsp;&middot;&nbsp; +27 83 575 6352</p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:16px 6px 0;">
        <p style="margin:0;color:#8a9690;font-size:10.5px;line-height:1.6;">
          BackedSure is a div of Covered Financial Services, an authorised Financial Services Provider (FSP 54871).
          Professional Indemnity and related insurance products are underwritten by insurers registered with the
          Prudential Authority. Premiums shown are indicative unless confirmed as a formal quotation.
        </p>
      </td></tr>
    </table>
  </div>`;
}

export async function sendTechnologyProposalEmails(
  answers: TechnologyProposalAnswers,
  prefilledPdf?: Uint8Array,
  santamPdf?: Uint8Array,
) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "SMTP is not configured." };
  }

  const transport = createTransport();
  const summary = plainTechnologyProposalSummary(answers);
  const customerName = answers.declarationName.split(" ")[0] || "there";

  await transport.sendMail({
    from: mailFrom,
    to: answers.contactEmail,
    subject: "We received your BackedSure Technology PI proposal",
    text: [
      `Hi ${customerName},`,
      "",
      "Thanks for submitting your Technology / IT Professional Indemnity proposal form.",
      "A BackedSure specialist will review your application and contact you with next steps.",
      "",
      "Your application summary:",
      summary,
      "",
      "Regards,",
      "BackedSure",
    ].join("\n"),
    html: buildTechnologyProposalCustomerHtml(answers),
  });

  if (adminEmail) {
    const safeName = (answers.insuredName || "proposal").replace(/[^\w.\- ]/g, "");
    await transport.sendMail({
      from: mailFrom,
      to: adminEmail,
      replyTo: answers.contactEmail,
      subject: `New Technology PI proposal: ${answers.insuredName}`,
      text: ["A new BackedSure Technology PI proposal was submitted.", "", summary].join("\n"),
      html: buildTechnologyProposalAdminHtml(answers),
      attachments: [
        ...(prefilledPdf
          ? [
              {
                filename: `iTOO-PI-Technology-${safeName}.pdf`,
                content: Buffer.from(prefilledPdf),
                contentType: "application/pdf",
              },
            ]
          : []),
        ...(santamPdf
          ? [
              {
                filename: `Santam-PI-Technology-${safeName}.pdf`,
                content: Buffer.from(santamPdf),
                contentType: "application/pdf",
              },
            ]
          : []),
        {
          filename: `technology-proposal-${safeName}.json`,
          content: JSON.stringify(answers, null, 2),
          contentType: "application/json",
        },
      ],
    });
  }

  return { sent: true };
}

function plainSATechnologyProposalSummary(answers: SATechnologyProposalAnswers) {
  const totalStaff = Object.values(answers.staffCounts).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const desiredLimits = [
    ...answers.desiredCoverLimits.map((v) => formatCurrency(Number(v))),
    ...(answers.desiredCoverLimitOther ? [formatCurrency(Number(answers.desiredCoverLimitOther))] : []),
  ];

  return [
    `Business: ${answers.businessName}`,
    `Physical address: ${answers.physicalAddress}`,
    `Website: ${answers.website || "N/A"}`,
    `Total staff: ${totalStaff || "N/A"}`,
    `Business description: ${answers.businessDescription || "N/A"}`,
    `Works outside SA: ${answers.servicesOutsideSA || "N/A"}`,
    `North America exposure: ${answers.northAmericaBusiness || "N/A"}`,
    `Has claims history: ${answers.hasClaimsHistory || "N/A"}${answers.hasClaimsHistory === "yes" ? ` (${answers.claimsHistory.length} claim(s))` : ""}`,
    `Previously/currently had PI: ${answers.hasHadPI || "N/A"}${answers.hasHadPI === "yes" ? ` (${answers.piInsurer})` : ""}`,
    `Cover limit(s) requested: ${desiredLimits.length > 0 ? desiredLimits.join(", ") : "N/A"}`,
    `Authorised by: ${answers.declarationName} (${answers.declarationPosition})`,
    `Email: ${answers.contactEmail}`,
    `Mobile: ${answers.contactMobile}`,
  ].join("\n");
}

function saClientBreakdownRows(record: Record<string, { southAfrica?: string; foreign?: string }>): string {
  return Object.entries(record)
    .filter(([, v]) => v.southAfrica || v.foreign)
    .map(([label, v]) => emailRow(label, [v.southAfrica ? `SA ${v.southAfrica}%` : "", v.foreign ? `Foreign ${v.foreign}%` : ""].filter(Boolean).join(" / ")))
    .join("");
}

function buildSATechnologyProposalAdminHtml(answers: SATechnologyProposalAnswers): string {
  const totalStaff = Object.values(answers.staffCounts).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const keyPeopleRows = answers.keyPeople
    .filter((p) => p.name)
    .map(
      (p) =>
        `<tr>
          <td style="padding:4px 12px 4px 0;color:#162a24;">${escapeHtml(p.name)}</td>
          <td style="padding:4px 12px;color:#5b6b64;">${escapeHtml(p.qualifications || "—")}</td>
          <td style="padding:4px 12px;color:#5b6b64;">${escapeHtml(p.yearsItExperience ? `${p.yearsItExperience} yrs IT` : "—")}</td>
          <td style="padding:4px 0;color:#5b6b64;">${escapeHtml(p.yearsAsPrincipal ? `${p.yearsAsPrincipal} yrs as principal` : "—")}</td>
        </tr>`,
    )
    .join("");

  const staffRows = Object.entries(answers.staffCounts)
    .filter(([, v]) => v)
    .map(([label, v]) => emailRow(label, v))
    .join("");

  const claimsRows = answers.claimsHistory
    .filter((c) => c.date || c.claimant || c.natureOfClaim)
    .map(
      (c) =>
        `<tr>
          <td style="padding:4px 12px 4px 0;color:#162a24;white-space:nowrap;vertical-align:top;">${escapeHtml(c.date || "—")}</td>
          <td style="padding:4px 12px;color:#5b6b64;vertical-align:top;">${escapeHtml(c.claimant || "—")}</td>
          <td style="padding:4px 12px;color:#5b6b64;vertical-align:top;">${escapeHtml(c.natureOfClaim || "—")}</td>
          <td style="padding:4px 0;color:#5b6b64;vertical-align:top;">${escapeHtml(moneyOrEmpty(c.amountClaimed) || "—")}</td>
        </tr>`,
    )
    .join("");

  const projectsRows = answers.previousProjects
    .filter((p) => p.project)
    .map(
      (p) =>
        `<tr>
          <td style="padding:4px 12px 4px 0;color:#162a24;">${escapeHtml(p.project)}</td>
          <td style="padding:4px 12px;color:#5b6b64;">${escapeHtml(p.clientOrIndustry || "—")}</td>
          <td style="padding:4px 0;color:#5b6b64;">${escapeHtml(p.servicesProvided || "—")}</td>
        </tr>`,
    )
    .join("");

  const grossFeesRows = answers.grossFeesHistory
    .filter((g) => g.financialYearEnd || g.grossFees)
    .map((g) => emailRow(monthYear(g.financialYearEnd) || "—", moneyOrEmpty(g.grossFees)))
    .join("");

  const desiredLimitsList = [
    ...answers.desiredCoverLimits.map((v) => formatCurrency(Number(v))),
    ...(answers.desiredCoverLimitOther ? [`${formatCurrency(Number(answers.desiredCoverLimitOther))} (other)`] : []),
  ].join(", ");

  const internationalRows = [
    emailRow("Provides services outside SA", yesNoLabel(answers.servicesOutsideSA)),
    emailRow("— countries", answers.foreignCountries),
    emailRow("— services provided", answers.foreignServicesProvided),
    emailRow("— % of fees from foreign work", answers.foreignFeePercentage ? `${answers.foreignFeePercentage}%` : ""),
    emailRow("North America / NA-governed business", yesNoLabel(answers.northAmericaBusiness)),
    emailRow("— countries/states", answers.naCountriesStates),
    emailRow("— % of fees", answers.naFeePercentage ? `${answers.naFeePercentage}%` : ""),
    emailRow("— physical offices there", yesNoLabel(answers.naPhysicalOffices)),
    emailRow("— office management", answers.naOfficeManagement),
    emailRow("— foreign shareholding", yesNoLabel(answers.naForeignShareholding)),
    emailRow("— shareholding %", answers.naForeignShareholdingPercentage ? `${answers.naForeignShareholdingPercentage}%` : ""),
    emailRow("— advises on foreign law", yesNoLabel(answers.naAdvisesOnLaw)),
    emailRow("— assets owned in North America", yesNoLabel(answers.naAssetsOwned)),
    emailRow("Work subject to a foreign court's jurisdiction", yesNoLabel(answers.foreignJurisdictionWork)),
  ].join("");

  const priorPiRows =
    answers.hasHadPI === "yes"
      ? [
          emailRow("Broker", answers.piBroker),
          emailRow("Insurer", answers.piInsurer),
          emailRow("Policy expiry date", answers.piPolicyExpiryDate),
          emailRow("Run-off expiry date", answers.piRunOffExpiryDate),
          emailRow("Limit of indemnity", moneyOrEmpty(answers.piLimitOfIndemnity)),
          emailRow("Excess / deductible", moneyOrEmpty(answers.piExcessDeductible)),
          emailRow("Premium", moneyOrEmpty(answers.piPremium)),
        ].join("")
      : "";

  return `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;background:#f5f7f5;padding:24px;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr><td style="background:#162a24;padding:22px 28px;border-radius:10px 10px 0 0;">
        <p style="margin:0;color:#a9bab2;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">New SA Technology PI Proposal</p>
        <h1 style="margin:6px 0 0;color:#ffffff;font-size:21px;">${escapeHtml(answers.businessName)}</h1>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e5e7e3;border-top:none;border-radius:0 0 10px 10px;padding:6px 28px 26px;">
        <table role="presentation" style="width:100%;border-collapse:collapse;">

          ${emailSection(
            "Business details",
            [
              emailRow("Physical address", answers.physicalAddress),
              emailRow("Website", answers.website),
              emailRow("Turnover/assets under R2m", yesNoLabel(answers.turnoverUnder2Million)),
              emailRow("Has subsidiaries", yesNoLabel(answers.hasSubsidiaries)),
              emailRow("— names", answers.subsidiaryNames),
              emailRow("Branches outside SA", yesNoLabel(answers.hasForeignBranches)),
              emailRow("— details", answers.foreignBranchesDetails),
              emailRow("Connected to another business", yesNoLabel(answers.hasOtherBusinessConnection)),
              emailRow("— details", answers.otherBusinessConnectionDetails),
              emailRow("Changed name / bought / merged in last 5 yrs", [answers.changedName, answers.purchasedBusiness, answers.mergedOrConsolidated].includes("yes") ? "Yes" : "No"),
              emailRow("— details", answers.businessChangesDetails),
            ].join(""),
          )}

          ${keyPeopleRows ? emailSection("Directors, partners & key people", keyPeopleRows) : ""}

          ${emailSection("Staff", staffRows + emailRow("Total staff", totalStaff) + emailRow("Authorised to quote prices", answers.staffAuthorisedToQuote))}

          ${emailSection(
            "What the business does",
            emailRow("Description", answers.businessDescription) +
              (Object.keys(answers.incomeByActivity).length
                ? `<tr><td colspan="2" style="padding-top:6px;color:#5b6b64;font-size:13px;">Income by activity (SA% / Foreign%)</td></tr>${saClientBreakdownRows(answers.incomeByActivity)}`
                : "") +
              emailRow("Other activity — details", answers.otherActivityDescription),
          )}

          ${emailSection(
            "Technology services",
            [
              emailRow("Payment facilitation/platform services", yesNoLabel(answers.providesPaymentServices)),
              emailRow("— details", answers.paymentServicesDescription),
              emailRow("Designs software", yesNoLabel(answers.designsSoftware)),
              emailRow("Installs hardware", yesNoLabel(answers.installsHardware)),
              emailRow("Installs hardware as contractor", yesNoLabel(answers.installsHardwareAsContractor)),
              emailRow("Designs/assembles own hardware", yesNoLabel(answers.designsOwnHardware)),
              emailRow("— details", answers.designsOwnHardwareDetails),
              emailRow("% income — industrial/engineering/architectural apps", answers.industrialApplicationsPercentage ? `${answers.industrialApplicationsPercentage}%` : ""),
              emailRow("— details", answers.industrialApplicationsDescription),
            ].join(""),
          )}

          ${emailSection(
            "Clients & industry exposure",
            saClientBreakdownRows(answers.clientBreakdown) + emailRow("Other client type — details", answers.otherClientTypeDescription),
          )}

          ${emailSection("International business", internationalRows)}

          ${emailSection(
            "Business changes & supplier commitments",
            [
              emailRow("Expects significant changes", yesNoLabel(answers.expectsBusinessChanges)),
              emailRow("— details", answers.businessChangesExpectedDetails),
              emailRow("Supplier volume/value commitments", yesNoLabel(answers.supplierCommitments)),
              emailRow("— % of last 12 months income", answers.supplierCommitmentPercentage ? `${answers.supplierCommitmentPercentage}%` : ""),
            ].join(""),
          )}

          ${emailSection(
            "Business continuity & data protection",
            [
              emailRow("Standby equipment available", yesNoLabel(answers.standbyEquipment)),
              emailRow("— details", answers.standbyEquipmentDetails),
              emailRow("Backups maintained", yesNoLabel(answers.backupsMaintained)),
              emailRow("— maintained by", answers.backupsMaintainedBy),
              emailRow("Backups stored separately", yesNoLabel(answers.backupsStoredSeparately)),
              emailRow("— details", answers.backupsStorageDetails),
            ].join(""),
          )}

          ${projectsRows ? emailSection("Previous projects (last 3 years)", projectsRows) : ""}

          ${emailSection(
            "Legacy systems",
            [
              emailRow("Two-digit year systems supplied/advised on", yesNoLabel(answers.legacyTwoDigitYear)),
              emailRow("— action on previous contracts", answers.legacyPreviousContractsAction),
              emailRow("— non-compliant contracts handling", answers.legacyNonCompliantHandling),
              emailRow("— future measures", answers.legacyFutureMeasures),
            ].join(""),
          )}

          ${emailSection(
            "Contractual liability",
            [
              emailRow("Extended contractual liability accepted", yesNoLabel(answers.extendedContractualLiability)),
              emailRow("— % of income", answers.extendedLiabilityPercentage ? `${answers.extendedLiabilityPercentage}%` : ""),
              emailRow("— details", answers.extendedLiabilityDescription),
            ].join(""),
          )}

          ${emailSection(
            "Claims history",
            [
              emailRow("Claims ever made", yesNoLabel(answers.hasClaimsHistory)),
              claimsRows ? `<tr><td colspan="2" style="padding-top:6px;color:#5b6b64;font-size:13px;">Claims</td></tr>${claimsRows}` : "",
              emailRow("Aware of potential claim circumstances", yesNoLabel(answers.awareOfPotentialClaim)),
              emailRow("— details", answers.awareOfPotentialClaimDetails),
            ].join(""),
          )}

          ${emailSection(
            "Previous / current PI insurance",
            [
              emailRow("Has had PI insurance", yesNoLabel(answers.hasHadPI)),
              priorPiRows,
              emailRow("Insurer ever declined application/renewal", yesNoLabel(answers.insurerDeclined)),
              emailRow("Insurer imposed special terms/premium", yesNoLabel(answers.insurerImposedTerms)),
              emailRow("Insurer ever cancelled", yesNoLabel(answers.insurerCancelled)),
              emailRow("— details", answers.priorInsuranceIssuesDetails),
              emailRow("Requires retroactive cover", yesNoLabel(answers.requiresRetroactiveCover)),
            ].join(""),
          )}

          ${emailSection(
            "Financial information",
            [
              emailRow("Financial year-end", monthYear(answers.financialYearEnd)),
              grossFeesRows ? `<tr><td colspan="2" style="padding-top:6px;color:#5b6b64;font-size:13px;">Gross fees / income — last 5 years</td></tr>${grossFeesRows}` : "",
              emailRow("Estimated next 12 months fees", moneyOrEmpty(answers.estimatedNextYearFees)),
            ].join(""),
          )}

          ${emailSection("Cover required", emailRow("Requested limit(s)", desiredLimitsList || "—"))}

          ${emailSection(
            "Authorised person",
            [
              emailRow("Name", `${answers.declarationName} (${answers.declarationPosition})`),
              emailRow("Date", answers.declarationDate),
              emailRow("Email", answers.contactEmail),
              emailRow("Mobile", answers.contactMobile),
            ].join(""),
          )}

        </table>
      </td></tr>
    </table>

    <p style="margin:18px 4px 0;color:#a9bab2;font-size:11px;">
      Full raw submission JSON is attached for reference. Any documents the applicant referenced
      (contracts, policies, brochures) are not attached automatically — they were asked to email
      these separately.
    </p>
  </div>`;
}

function buildSATechnologyProposalCustomerHtml(answers: SATechnologyProposalAnswers): string {
  const firstName = escapeHtml(answers.declarationName.split(" ")[0] || "there");
  const submittedDate = answers.declarationDate
    ? new Date(answers.declarationDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const snapshotRow = (label: string, value: string) =>
    !value
      ? ""
      : `<tr>
      <td style="padding:7px 0;color:#5b6b64;font-size:13px;">${escapeHtml(label)}</td>
      <td style="padding:7px 0;color:#162a24;font-size:13px;font-weight:700;text-align:right;">${escapeHtml(value)}</td>
    </tr>`;

  return `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f7f5;padding:24px;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr><td style="background:#162a24;padding:28px 32px;border-radius:12px 12px 0 0;">
        <table role="presentation" style="border-collapse:collapse;">
          <tr>
            <td style="width:30px;height:30px;background:#c8e36e;border-radius:8px;text-align:center;vertical-align:middle;font-size:15px;font-weight:800;color:#162a24;">B</td>
            <td style="padding-left:10px;color:#ffffff;font-size:15px;font-weight:800;">BackedSure</td>
          </tr>
        </table>
        <p style="margin:22px 0 0;display:inline-block;background:rgba(200,227,110,0.16);color:#c8e36e;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 10px;border-radius:999px;">
          Application received
        </p>
        <h1 style="margin:12px 0 0;color:#ffffff;font-size:22px;line-height:1.3;">
          Thanks, ${firstName} — we've got your Technology PI proposal.
        </h1>
      </td></tr>

      <tr><td style="background:#ffffff;border:1px solid #e5e7e3;border-top:none;padding:30px 32px;">
        <p style="margin:0 0 16px;color:#162a24;font-size:14px;line-height:1.7;">
          A BackedSure specialist is reviewing your Professional Indemnity — Technology proposal for
          <strong>${escapeHtml(answers.businessName)}</strong>. Here's what happens from here:
        </p>

        <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 22px;">
          ${[
            ["1", "A specialist reviews your application", "Usually within one business day."],
            ["2", "We'll follow up if anything needs clarifying", `We may call or email you at ${escapeHtml(answers.contactMobile || answers.contactEmail)}.`],
            ["3", "You'll receive your quote and next steps", "Sent straight to this email address."],
          ]
            .map(
              ([num, title, detail]) => `<tr>
                <td style="width:28px;vertical-align:top;padding:6px 0;">
                  <span style="display:inline-flex;width:22px;height:22px;border-radius:50%;background:#e8f1ed;color:#234c40;font-size:11px;font-weight:800;text-align:center;line-height:22px;">${num}</span>
                </td>
                <td style="padding:6px 0 6px 10px;">
                  <p style="margin:0;color:#162a24;font-size:13.5px;font-weight:700;">${title}</p>
                  <p style="margin:2px 0 0;color:#5b6b64;font-size:12.5px;">${detail}</p>
                </td>
              </tr>`,
            )
            .join("")}
        </table>

        <table role="presentation" style="width:100%;border-collapse:collapse;background:#f5f7f5;border:1px solid #e5e7e3;border-radius:10px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#5b6b64;">Application snapshot</p>
            <table role="presentation" style="width:100%;border-collapse:collapse;">
              ${snapshotRow("Business", answers.businessName)}
              ${snapshotRow("Submitted by", `${answers.declarationName} (${answers.declarationPosition})`)}
              ${snapshotRow("Date", submittedDate)}
            </table>
          </td></tr>
        </table>

        <p style="margin:22px 0 0;color:#162a24;font-size:14px;">
          Need to send us any of the documents mentioned in the form? Just reply to this email and
          attach them — no need to fill anything in again.
        </p>

        <p style="margin:22px 0 0;color:#162a24;font-size:14px;">
          Warm regards,<br />The BackedSure Team
        </p>

        <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:26px;border-top:1px solid #e5e7e3;">
          <tr><td style="padding-top:18px;">
            <p style="margin:0;color:#5b6b64;font-size:12px;">Questions in the meantime?</p>
            <p style="margin:3px 0 0;color:#234c40;font-size:13px;font-weight:700;">hello@backedsure.co.za &nbsp;&middot;&nbsp; +27 83 575 6352</p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:16px 6px 0;">
        <p style="margin:0;color:#8a9690;font-size:10.5px;line-height:1.6;">
          BackedSure is a div of Covered Financial Services, an authorised Financial Services Provider (FSP 54871).
          Professional Indemnity and related insurance products are underwritten by insurers registered with the
          Prudential Authority. Premiums shown are indicative unless confirmed as a formal quotation.
        </p>
      </td></tr>
    </table>
  </div>`;
}

export async function sendSATechnologyProposalEmails(answers: SATechnologyProposalAnswers, prefilledPdf?: Uint8Array) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "SMTP is not configured." };
  }

  const transport = createTransport();
  const summary = plainSATechnologyProposalSummary(answers);
  const customerName = answers.declarationName.split(" ")[0] || "there";

  await transport.sendMail({
    from: mailFrom,
    to: answers.contactEmail,
    subject: "We received your BackedSure SA Technology PI proposal",
    text: [
      `Hi ${customerName},`,
      "",
      "Thanks for submitting your Professional Indemnity — Technology proposal form.",
      "A BackedSure specialist will review your application and contact you with next steps.",
      "",
      "Your application summary:",
      summary,
      "",
      "Regards,",
      "BackedSure",
    ].join("\n"),
    html: buildSATechnologyProposalCustomerHtml(answers),
  });

  if (adminEmail) {
    const safeName = (answers.businessName || "proposal").replace(/[^\w.\- ]/g, "");
    await transport.sendMail({
      from: mailFrom,
      to: adminEmail,
      replyTo: answers.contactEmail,
      subject: `New SA Technology PI proposal: ${answers.businessName}`,
      text: ["A new BackedSure SA Technology PI proposal was submitted.", "", summary].join("\n"),
      html: buildSATechnologyProposalAdminHtml(answers),
      attachments: [
        ...(prefilledPdf
          ? [
              {
                filename: `Santam-SA-PI-Technology-${safeName}.pdf`,
                content: Buffer.from(prefilledPdf),
                contentType: "application/pdf",
              },
            ]
          : []),
        {
          filename: `sa-technology-proposal-${safeName}.json`,
          content: JSON.stringify(answers, null, 2),
          contentType: "application/json",
        },
      ],
    });
  }

  return { sent: true };
}
