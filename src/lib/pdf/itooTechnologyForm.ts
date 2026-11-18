import { PDFDocument, PDFForm, PDFName } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import type { TechYearFees, TechnologyProposalAnswers } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  feeActivityCategories,
  endUserApplicationCategories,
  marketCategories,
} from "@/components/quote/technologyProposalTypes";

// Fills the official iTOO Special Risks "Technology/Telecommunications"
// proposal form (an AcroForm PDF with named text/checkbox fields) with the
// submitted answers, so the admin notification carries a ready-to-review
// prefilled copy alongside the raw JSON. Field names were reverse-engineered
// from forms/iTOOPIForm_IT.pdf — see scripts/list-pdf-fields.mjs if the
// template is ever replaced and field names need re-mapping.
const TEMPLATE_PATH = path.join(process.cwd(), "forms", "iTOOPIForm_IT.pdf");

function setText(form: PDFForm, name: string, value: string | undefined) {
  try {
    form.getTextField(name).setText(value ?? "");
  } catch {
    // Field missing/renamed in a template revision — skip rather than fail the whole fill.
  }
}

function setYesNo(form: PDFForm, name: string, value: "" | "yes" | "no") {
  try {
    const field = form.getCheckBox(name);
    const target =
      value === "yes" ? PDFName.of("Yes") : value === "no" ? PDFName.of("No") : PDFName.of("Off");
    // This template pairs each Yes/No question with ONE field that has TWO
    // widgets (a "Yes" box and a "No" box) rather than two independent
    // fields. pdf-lib's high-level check()/uncheck() can't select "No" here
    // (it throws — "No" isn't the field's single recognised on-value), so
    // the field's /V and each widget's /AS are set directly instead. This
    // reuses the template's own pre-drawn tick-mark appearance streams
    // rather than pdf-lib's synthesized default, so the existing form
    // artwork is preserved.
    field.acroField.dict.set(PDFName.of("V"), target);
    for (const widget of field.acroField.getWidgets()) {
      const onValue = widget.getOnValue();
      widget.setAppearanceState(onValue === target ? target : PDFName.of("Off"));
    }
  } catch {
    // ignore
  }
}

function wrapLines(text: string, charsPerLine: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > charsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Wraps `text` across the given field names in order; any overflow beyond the last field is appended to it in full. */
function fillWrapped(form: PDFForm, names: string[], text: string | undefined, charsPerLine = 90) {
  if (!text) return;
  const lines = wrapLines(text, charsPerLine);
  names.forEach((name, i) => {
    const isLast = i === names.length - 1;
    const value = isLast && lines.length > names.length ? lines.slice(i).join(" ") : (lines[i] ?? "");
    setText(form, name, value);
  });
}

function money(value: string | undefined): string {
  const n = Number(value);
  return value && !Number.isNaN(n) ? formatCurrency(n) : "";
}

function percent(value: string | undefined): string {
  return value ? `${value}%` : "";
}

function yearTotal(year: TechYearFees): number {
  return (Number(year.domesticFees) || 0) + (Number(year.subConsultedFees) || 0) + (Number(year.internationalFees) || 0);
}

function offsetYearLabel(dateStr: string | undefined, deltaYears: number): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCFullYear(d.getUTCFullYear() + deltaYears);
  return d.toLocaleDateString("en-ZA", { year: "numeric", month: "short", timeZone: "UTC" });
}

/** Formats a `type="month"` input value (`yyyy-MM`) as e.g. "Feb 2020". */
function monthLabel(monthStr: string | undefined): string {
  if (!monthStr) return "";
  const d = new Date(monthStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-ZA", { year: "numeric", month: "short", timeZone: "UTC" });
}

export async function fillTechnologyProposalPdf(answers: TechnologyProposalAnswers): Promise<Uint8Array> {
  const templateBytes = await readFile(TEMPLATE_PATH);
  const pdf = await PDFDocument.load(templateBytes);
  const form = pdf.getForm();

  const futureYear: TechYearFees = {
    domesticFees: String(Math.round((Number(answers.currentYear.domesticFees) || 0) * 1.1)),
    subConsultedFees: String(Math.round((Number(answers.currentYear.subConsultedFees) || 0) * 1.1)),
    internationalFees: String(Math.round((Number(answers.currentYear.internationalFees) || 0) * 1.1)),
  };

  // 1-4 Company details
  setText(form, "Name of Insured", answers.insuredName);
  setText(form, "Physical address 01", answers.physicalAddress);
  setText(form, "Company Website", answers.companyWebsite);

  // 5 Fees / financials — one recurring year-end date offset ±1 year for the past/future blocks
  const yearBlocks: { date: string; fees: TechYearFees; fields: [string, string, string, string, string] }[] = [
    { date: offsetYearLabel(answers.financialYearEndDate, -1), fees: answers.pastYear, fields: ["Text 22", "Text 23", "Text 24", "Text 25", "Text 26"] },
    { date: offsetYearLabel(answers.financialYearEndDate, 0), fees: answers.currentYear, fields: ["Text 27", "Text 28", "Text 29", "Text 30", "Text 31"] },
    { date: offsetYearLabel(answers.financialYearEndDate, 1), fees: futureYear, fields: ["Text 32", "Text 33", "Text 34", "Text 35", "Text 36"] },
  ];
  for (const block of yearBlocks) {
    const [dateField, domField, subField, intlField, totalField] = block.fields;
    setText(form, dateField, block.date);
    setText(form, domField, money(block.fees.domesticFees));
    setText(form, subField, money(block.fees.subConsultedFees));
    setText(form, intlField, money(block.fees.internationalFees));
    setText(form, totalField, formatCurrency(yearTotal(block.fees)));
  }

  // 6-8 Structure
  setText(form, "6 Text 1", answers.controlledByOtherFirm === "yes" ? "Yes" : answers.controlledByOtherFirm === "no" ? "No" : "");
  setText(form, "6 Text 2", answers.controlledByOtherFirmDetails);
  setText(form, "7 Text 1", answers.numPrincipals);
  setText(form, "7 Text 2", answers.numNonProfessionalEmployees);

  const principalFields: [string, string, string, string][] = [
    ["Name 01", "Qualifications 01", "Year Qualified 01", "How long Principal in this Practice 01"],
    ["Name 02", "Qualifications 02", "Year Qualified 02", "How long Principal in this Practice 02"],
    ["Name 03", "Qualifications 03", "Year Qualified 03", "How long Principal in this Practice 03"],
    ["Name 04", "Qualifications 04", "Year Qualified 04", "How long Principal in this Practice 04"],
    ["Name 05", "Qualifications 05", "Year Qualified 05", "How long Principal in this Practice 05"],
  ];
  answers.principals.slice(0, 5).forEach((p, i) => {
    const [nameField, qualField, dateField, yearsField] = principalFields[i];
    setText(form, nameField, p.name);
    setText(form, qualField, p.qualification);
    setText(form, dateField, monthLabel(p.dateQualified));
    setText(form, yearsField, p.yearsInPractice);
  });

  // 9 Associations
  setYesNo(form, "Yes / No 9", answers.belongsToAssociation);
  setText(form, "9 Text 1", answers.associationDetails);
  setYesNo(form, "Yes / No 09.2", answers.membershipCancelledSuspended);

  // 10-14 Contracts, risk management, subcontracting
  setYesNo(form, "Yes / No 10", answers.usesWrittenContract);
  setYesNo(form, "Yes / No 11", answers.hasRiskManagementProcedures);
  setText(form, "11 Text 1", answers.riskManagementDetails);
  setText(form, "12 Text 1", percent(answers.subcontractingPercentage));
  setYesNo(form, "Yes / No 13", answers.usesWrittenContractWithSubcontractors);
  setYesNo(form, "Yes / No 14", answers.limitsLiabilityUnderContract);

  // 15 International exposure
  setYesNo(form, "Yes / No 15", answers.worksOutsideSA);
  fillWrapped(form, ["15 Text 1", "15 Text 2"], answers.worksOutsideSADetails);
  setYesNo(form, "Yes / No 15_1", answers.undertakesWorkOutsideSA);
  fillWrapped(form, ["15 Text 3", "15 Text 4"], answers.workOutsideSADetails);
  setYesNo(form, "Yes / No 15_2", answers.officesOutsideSA);
  setText(form, "15 Text 5", answers.officesOutsideSAList);
  setYesNo(form, "Yes / No 15_3", answers.northAmericaExposure);
  setText(form, "15 Text 6", percent(answers.northAmericaFeePercentage));
  setYesNo(form, "Yes / No 15_4", answers.northAmericaPhysicalOffices);
  setText(form, "15 Text 7", answers.northAmericaOfficeManagement);
  setYesNo(form, "Yes / No 15_5", answers.northAmericaForeignShareholding);
  setText(form, "15 Text 8", percent(answers.northAmericaForeignShareholdingPercentage));
  setYesNo(form, "Yes / No 15_6", answers.advisesOnForeignLaw);
  setText(form, "15 Text 9", answers.advisesOnForeignLawDetails);

  // 16 Existing PI cover
  setYesNo(form, "Yes / No 16", answers.hasExistingPI);
  setText(form, "Text 16a", answers.existingPIInsurer);
  setText(form, "Text 16b", answers.existingPIExpiryDate);
  setText(form, "Text 16c", money(answers.existingPILimit));
  setText(form, "Text 16d", answers.existingPIRetroactiveDate);
  setText(form, "Text 16e", money(answers.existingPIDeductible));
  setText(form, "Text 16f", money(answers.existingPIPremium));

  // 17-18 Prior insurance / known circumstances
  setYesNo(form, "Yes / No 17", answers.priorInsuranceDeclinedCancelled);
  fillWrapped(form, ["17 Text 1", "17 Text 2"], answers.priorInsuranceDeclinedDetails);
  setYesNo(form, "Yes / No 18", answers.knowledgeOfPotentialClaim);
  fillWrapped(form, ["18 Text 1", "18 Text 2"], answers.knowledgeOfPotentialClaimDetails);

  // 19 Claims history
  const claimFields: [string, string][] = [
    ["Date of Claim 1", "Description 1"],
    ["Date of Claim 2", "Description 2"],
    ["Date of Claim 3", "Description 3"],
    ["Date of Claim 4", "Description 4"],
    ["Date of Claim 5", "Description 5"],
  ];
  answers.claimsHistory.slice(0, 5).forEach((c, i) => {
    setText(form, claimFields[i][0], c.date);
    setText(form, claimFields[i][1], c.description);
  });

  // 20 Aware of circumstances
  setYesNo(form, "Yes / No 19", answers.awareOfCircumstances);
  fillWrapped(form, ["20 Text 1", "20 Text 2"], answers.awareOfCircumstancesDetails);

  // Technology activities
  fillWrapped(form, ["1 OA Text 1", "1 OA Text 2", "1 OA Text 3"], answers.activitiesDescription, 80);

  const revenueFields: [string, string][] = Array.from({ length: 11 }, (_, i) => [
    `2. Activities ${i + 1}`,
    `2. Revenue % ${i + 1}`,
  ]);
  answers.activityRevenueSplit.slice(0, 11).forEach((row, i) => {
    setText(form, revenueFields[i][0], row.activity);
    setText(form, revenueFields[i][1], percent(row.percentage));
  });

  feeActivityCategories.forEach((cat, i) => {
    setText(form, `3. Approximate % ${i + 1}`, percent(answers.feesByActivity[cat]));
  });
  setText(form, "3. Approximate % 17", percent(answers.feesByActivity["Other IT"]));
  fillWrapped(form, ["3. Other 1", "3. Other 2"], answers.otherActivityDescription);

  endUserApplicationCategories.forEach((cat, i) => {
    setText(form, `4. Approximate % ${i + 1}`, percent(answers.endUserApplications[cat]));
  });
  setText(form, "4. Approximate % 15", percent(answers.endUserApplications["Other"]));
  fillWrapped(form, ["4. Other 1", "4. Other 2"], answers.otherEndUserDescription);

  marketCategories.forEach((cat, i) => {
    setText(form, `5. Approximate % ${i + 1}`, percent(answers.markets[cat]));
  });
  setText(form, "5. Approximate % 13", percent(answers.markets["Other"]));
  fillWrapped(form, ["5. Other 1", "5. Other 2"], answers.otherMarketDescription);

  // Risk / quality management
  setYesNo(form, "6. Yes / No 1", answers.contractsExcludeConsequentialLoss);
  setYesNo(form, "6. Yes / No 2", answers.systemWorkDocumentedTested);
  setYesNo(form, "6. Yes / No 3", answers.clientsSignOffPilotTests);
  setYesNo(form, "6. Yes / No 4", answers.clientsResponsibleForAccuracy);
  setYesNo(form, "6. Yes / No 5", answers.contractDelaysExamined);
  fillWrapped(
    form,
    [
      "Development methodology 1",
      "Development methodology 2",
      "Development methodology 3",
      "Development methodology 4",
      "Development methodology 5",
      "Development methodology 6",
    ],
    answers.developmentMethodology,
    85,
  );

  // Artificial intelligence
  setYesNo(form, "Yes / No AI 1", answers.usesGenerativeAI);
  fillWrapped(form, ["Text 7.1.2", "Text 7.1.3", "Text 7.1.4", "Text 7.1.5"], answers.aiDescription, 85);
  fillWrapped(form, ["Text 7.1.6"], answers.aiAuthorisedUsers, 85);
  fillWrapped(form, ["Text 7.1.7", "Text 7.1.8"], answers.aiUsageMonitoring, 85);
  fillWrapped(form, ["Text 7.1.9"], percent(answers.aiBusinessReliancePercentage), 85);
  fillWrapped(form, ["Text 7.1.10", "Text 7.1.11", "Text 7.1.12"], answers.aiOutputVerification, 85);
  fillWrapped(form, ["Text 7.1.13", "Text 7.1.14"], answers.aiFinalDecisionMaker, 85);

  // Limit of indemnity — up to 4 quote/deductible option columns
  const allLimits = [
    ...answers.desiredCoverLimits,
    ...(answers.desiredCoverLimitOther ? [answers.desiredCoverLimitOther] : []),
  ];
  const quoteFields = ["LOI Qoute 1", "LOI Qoute 2", "LOI Qoute 3", "LOI Qoute 4"];
  const deductibleFields = ["LOI Deductible 1", "LOI Deductible 2", "LOI Deductible 3", "LOI Deductible 4"];
  allLimits.slice(0, 4).forEach((limit, i) => {
    setText(form, quoteFields[i], money(limit));
    setText(form, deductibleFields[i], money(answers.desiredDeductible));
  });

  // Declaration (the PDF's cryptographic Signature Field is left untouched —
  // this is an internal reference copy, not an executed contract)
  setText(form, "Name (duly authorised)", answers.declarationName);
  setText(form, "Designation", answers.declarationDesignation);
  setText(form, "Date", answers.declarationDate);

  return pdf.save();
}
