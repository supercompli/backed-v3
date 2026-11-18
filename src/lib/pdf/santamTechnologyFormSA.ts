import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import type { SATechnologyProposalAnswers, YesNo } from "@/types";
import { formatCurrency } from "@/lib/utils";

// Fills the Santam "Professional Indemnity Proposal Form for Technology
// Industry" for the /sa-professional-indemnity-technology-quote proposal —
// whose 18 steps were modelled directly on this same PDF's own questions, so
// (unlike src/lib/pdf/santamTechnologyForm.ts, which cross-maps a
// differently-structured iTOO-style proposal onto this template on a
// best-effort basis) almost every question here has a clean 1:1 mapping.
//
// This is a flat PDF with no AcroForm fields, so answers are drawn directly
// onto each page at coordinates reverse-engineered from the template's text
// layout (extracted with pdfjs-dist's text-content API — see the
// conversation/PR that introduced this file for the extraction script).
// Coordinates are in PDF points, origin bottom-left, matched against
// forms/Santam_Technology Industry PI Proposal Form.pdf at its native page
// size (595.32 x 841.92, portrait, no rotation) — if that file is ever
// replaced, these positions need to be re-derived.
//
// A few fields intentionally have no equivalent captured answer and are left
// blank for the broker/insurer to complete: postal address, company
// registration/VAT numbers, legal constitution, and "date of commencement of
// practice" (all removed from the online form as not needed), the "if
// foreign, which country" column on the client/industry table, the
// foreign-contracts table beyond 3 rows, and the "Deductibles" column of the
// quotations-required table (the online form only collects a limit of
// indemnity to quote against, not a preferred deductible).
const TEMPLATE_PATH = path.join(process.cwd(), "forms", "Santam_Technology Industry PI Proposal Form.pdf");

const SIZE = 9;
const SMALL = 8;
const INK = rgb(0.09, 0.16, 0.55); // distinguishes typed answers from the printed template
const MARK = rgb(0.75, 0.1, 0.1);

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function text(page: PDFPage, font: PDFFont, value: string | undefined, x: number, y: number, size = SIZE) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return;
  page.drawText(trimmed, { x, y, size, font, color: INK });
}

/** Right-aligns `value` so it ends at `xRight` — for cells where the template pre-prints a "%" or similar glyph just to the right of the blank. */
function textRight(page: PDFPage, font: PDFFont, value: string | undefined, xRight: number, y: number, size = SIZE) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return;
  const width = font.widthOfTextAtSize(trimmed, size);
  page.drawText(trimmed, { x: xRight - width, y, size, font, color: INK });
}

function wrapText(font: PDFFont, value: string, maxWidth: number, size: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Draws `value` starting at (x, yTop), wrapping within maxWidth and stepping down by lineHeight per line, up to maxLines. */
function wrapped(
  page: PDFPage,
  font: PDFFont,
  value: string | undefined,
  x: number,
  yTop: number,
  maxWidth: number,
  maxLines: number,
  lineHeight = 11.5,
  size = SIZE,
) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return;
  const lines = wrapText(font, trimmed, maxWidth, size).slice(0, maxLines);
  lines.forEach((line, i) => text(page, font, line, x, yTop - i * lineHeight, size));
}

/** Circles the printed word at `box` (its text bounding box) to mark it as the chosen answer. */
function circle(page: PDFPage, box: Box) {
  page.drawEllipse({
    x: box.x + box.w / 2,
    y: box.y + box.h * 0.32,
    xScale: box.w / 2 + 4,
    yScale: box.h / 2 + 3,
    borderColor: MARK,
    borderWidth: 1.1,
  });
}

function yesNo(page: PDFPage, value: YesNo | "", yesBox: Box, noBox: Box) {
  if (value === "yes") circle(page, yesBox);
  else if (value === "no") circle(page, noBox);
}

function money(value: string | undefined): string {
  const n = Number(value);
  return value && !Number.isNaN(n) ? formatCurrency(n) : "";
}

/** Plain number, no "R"/"%" — for cells where the template already pre-prints that glyph. */
function numberOnly(value: string | number | undefined): string {
  const n = typeof value === "number" ? value : Number(value);
  return value !== undefined && value !== "" && !Number.isNaN(n)
    ? new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 }).format(n)
    : "";
}

/** "2026-02" -> "Feb 2026" — the financial year-end is now collected as a month/year only. */
function monthYear(value: string | undefined): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  if (!year || index < 0 || index > 11) return value;
  return new Date(Number(year), index, 1).toLocaleDateString("en-ZA", { month: "short", year: "numeric" });
}

export async function fillSantamTechnologyProposalPdfSA(answers: SATechnologyProposalAnswers): Promise<Uint8Array> {
  const templateBytes = await readFile(TEMPLATE_PATH);
  const pdf = await PDFDocument.load(templateBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const page = (n: number) => pages[n - 1];

  // ---- Page 2: Details of Proposed Insured -------------------------------
  const p2 = page(2);
  wrapped(p2, font, answers.businessName, 160, 763.08, 390, 5);
  wrapped(p2, font, answers.physicalAddress, 160, 623.98, 390, 6);
  text(p2, font, answers.declarationName, 160, 548.71); // Contact Person
  text(p2, font, answers.contactMobile, 122, 525.31); // Tel No.
  text(p2, font, answers.contactEmail, 160, 501.79); // E-mail address
  text(p2, font, answers.website, 400, 501.79, SMALL); // Website address

  yesNo(
    p2,
    answers.turnoverUnder2Million,
    { x: 98.8, y: 437.0, w: 17.1, h: 10 },
    { x: 144.1, y: 437.0, w: 12.7, h: 10 },
  );

  yesNo(
    p2,
    answers.hasForeignBranches,
    { x: 465.1, y: 342.8, w: 17.1, h: 10 },
    { x: 510.5, y: 342.8, w: 12.7, h: 10 },
  );
  wrapped(p2, font, answers.foreignBranchesDetails, 252, 331.25, 290, 4, 11.5, SMALL);

  // 1.3 Names/Qualifications of Principals — a 4-row table (row baselines
  // shared with santamTechnologyForm.ts's page-2 principal table on the same
  // template), now with 2 extra columns this form actually collects.
  const keyPersonRowY = [205.5, 182, 158.6, 135.1];
  answers.keyPeople.slice(0, 4).forEach((p, i) => {
    const y = keyPersonRowY[i];
    text(p2, font, p.name, 79, y, SMALL);
    text(p2, font, p.qualifications, 185, y, SMALL);
    text(p2, font, p.professionalMemberships, 284.6, y, SMALL);
    text(p2, font, p.yearsItExperience, 376.7, y, SMALL);
    text(p2, font, p.yearsAsPrincipal, 468.8, y, SMALL);
  });

  // ---- Page 3: staff, connections, business changes, description, ------
  //      North America (part 1) --------------------------------------------
  const p3 = page(3);
  const staffRowY: Record<string, number> = {
    "Partners / Principals / Directors": 768.8,
    "Software Designers / Systems Analysts": 747.3,
    "Quality Assurance": 725.9,
    "Computer Operations / Data Handling": 704.4,
    "Hardware / Software Sales": 682.9,
    "Other Staff": 661.4,
  };
  let totalStaff = 0;
  for (const [category, y] of Object.entries(staffRowY)) {
    const count = answers.staffCounts[category];
    if (count) totalStaff += Number(count) || 0;
    text(p3, font, count, 480, y, SMALL);
  }
  text(p3, font, totalStaff ? String(totalStaff) : "", 480, 639.8, SMALL);

  yesNo(
    p3,
    answers.hasOtherBusinessConnection,
    { x: 468.8, y: 588.6, w: 17.1, h: 10 },
    { x: 514.2, y: 588.6, w: 12.7, h: 10 },
  );
  wrapped(p3, font, answers.otherBusinessConnectionDetails, 245, 559.5, 300, 4, 11.5, SMALL);

  yesNo(
    p3,
    answers.changedName,
    { x: 465.1, y: 485.5, w: 17.1, h: 10 },
    { x: 510.5, y: 485.5, w: 12.7, h: 10 },
  );
  // Santam asks "purchased / merger or consolidation" as one combined question.
  const purchasedOrMerged: YesNo =
    answers.purchasedBusiness === "yes" || answers.mergedOrConsolidated === "yes"
      ? "yes"
      : answers.purchasedBusiness === "no" && answers.mergedOrConsolidated === "no"
        ? "no"
        : "";
  yesNo(
    p3,
    purchasedOrMerged,
    { x: 465.1, y: 462.4, w: 17.1, h: 10 },
    { x: 510.5, y: 462.4, w: 12.7, h: 10 },
  );
  wrapped(p3, font, answers.businessChangesDetails, 245, 439.4, 300, 3, 11.5, SMALL);

  wrapped(p3, font, answers.businessDescription, 68, 335, 470, 6, 11.5, SMALL);

  yesNo(
    p3,
    answers.servicesOutsideSA,
    { x: 465.1, y: 234.3, w: 17.1, h: 10 },
    { x: 510.5, y: 234.3, w: 12.7, h: 10 },
  );
  const foreignServiceSummary = [
    answers.foreignCountries,
    answers.foreignServicesProvided,
    answers.foreignFeePercentage ? `${answers.foreignFeePercentage}% of fees` : "",
  ]
    .filter(Boolean)
    .join(" — ");
  wrapped(p3, font, foreignServiceSummary, 252, 211.3, 290, 4, 11.5, SMALL);

  yesNo(
    p3,
    answers.northAmericaBusiness,
    { x: 465.1, y: 153.3, w: 17.1, h: 10 },
    { x: 510.5, y: 153.3, w: 12.7, h: 10 },
  );
  text(p3, font, answers.naCountriesStates, 96, 118.82, SMALL);

  // ---- Page 4: North America (part 2), income by activity, --------------
  //      software/hardware questions ----------------------------------------
  const p4 = page(4);
  yesNo(
    p4,
    answers.naPhysicalOffices,
    { x: 465.1, y: 797.16, w: 17.12, h: 9.96 },
    { x: 510.48, y: 797.16, w: 12.73, h: 9.96 },
  );
  text(p4, font, answers.naOfficeManagement, 420, 762.6, SMALL);
  if (answers.naForeignShareholding === "yes") {
    circle(p4, { x: 158.57, y: 691.9, w: 17.12, h: 9.96 });
  } else if (answers.naForeignShareholding === "no") {
    circle(p4, { x: 200, y: 691.9, w: 13, h: 9.96 });
  }
  textRight(p4, font, numberOnly(answers.naForeignShareholdingPercentage), 431, 692.62, SMALL);
  yesNo(
    p4,
    answers.naAdvisesOnLaw,
    { x: 465.1, y: 668.38, w: 17.12, h: 9.96 },
    { x: 510.48, y: 668.38, w: 12.73, h: 9.96 },
  );
  wrapped(p4, font, answers.naAdvisesOnLawDetails, 153, 645, 380, 3, 11.5, SMALL);

  yesNo(
    p4,
    answers.naAssetsOwned,
    { x: 125.3, y: 598.9, w: 17.1, h: 10 },
    { x: 165.2, y: 598.9, w: 12.7, h: 10 },
  );
  wrapped(p4, font, answers.naAssetsOwnedDetails, 245, 587.4, 300, 4, 11.5, SMALL);

  // 4.1 Approximate percentage of gross income by activity — Total/Local/Foreign
  // columns, each row bounded by a pre-printed "%" glyph. Total isn't
  // collected by the online form (which validates the Local and Foreign
  // columns each summing to 100% independently, rather than a Total column
  // summing to 100%), so it's filled here as Local + Foreign per row as the
  // most useful derived figure rather than left blank.
  const incomeRows: [string, number][] = [
    ["General consulting", 477.6],
    ["Systems / programme design", 453.7],
    ["Data processing / communications", 429.9],
    ["Software sales — software modified by you", 406.1],
    ["Hardware sales", 385.5],
    ["Software sales — no modification", 363.9],
    ["Other", 342.8],
  ];
  incomeRows.forEach(([category, y]) => {
    const row = answers.incomeByActivity[category];
    if (!row) return;
    const sa = Number(row.southAfrica) || 0;
    const foreign = Number(row.foreign) || 0;
    const total = sa + foreign;
    if (total) textRight(p4, font, numberOnly(total), 424, y, SMALL);
    if (sa) textRight(p4, font, numberOnly(sa), 481, y, SMALL);
    if (foreign) textRight(p4, font, numberOnly(foreign), 538, y, SMALL);
  });
  text(p4, font, answers.otherActivityDescription, 300, 347.3, 7);

  yesNo(
    p4,
    answers.providesPaymentServices,
    { x: 486.4, y: 255.2, w: 17.1, h: 10 },
    { x: 526.2, y: 255.2, w: 12.7, h: 10 },
  );
  wrapped(p4, font, answers.paymentServicesDescription, 245, 232.1, 300, 4, 11.5, SMALL);

  yesNo(
    p4,
    answers.designsSoftware,
    { x: 486.4, y: 158.1, w: 17.1, h: 10 },
    { x: 526.2, y: 158.1, w: 12.7, h: 10 },
  );
  yesNo(
    p4,
    answers.installsHardware,
    { x: 486.4, y: 135.0, w: 17.1, h: 10 },
    { x: 526.2, y: 135.0, w: 12.7, h: 10 },
  );
  yesNo(
    p4,
    answers.installsHardwareAsContractor,
    { x: 486.4, y: 123.5, w: 17.1, h: 10 },
    { x: 526.2, y: 123.5, w: 12.7, h: 10 },
  );
  yesNo(
    p4,
    answers.designsOwnHardware,
    { x: 480.8, y: 66.0, w: 17.1, h: 10 },
    { x: 520.7, y: 66.0, w: 12.7, h: 10 },
  );

  // ---- Page 5: hardware design details, staff pricing authority, --------
  //      clients/industry, foreign jurisdiction, business changes ----------
  const p5 = page(5);
  wrapped(p5, font, answers.designsOwnHardwareDetails, 245, 785.6, 300, 4, 11.5, SMALL);
  text(p5, font, answers.staffAuthorisedToQuote, 250, 711.5, SMALL);

  // 4.6 Approximate percentage of gross income by client/industry — SA/Foreign
  const clientRows: [string, number][] = [
    ["Government", 653.9],
    ["Financial institutions / finance houses", 632.5],
    ["Commercial businesses", 611.4],
    ["Industrial businesses", 590.0],
    ["Other", 568.9],
  ];
  clientRows.forEach(([category, y]) => {
    const row = answers.clientBreakdown[category];
    if (!row) return;
    if (row.southAfrica) textRight(p5, font, numberOnly(row.southAfrica), 276, y, SMALL);
    if (row.foreign) textRight(p5, font, numberOnly(row.foreign), 340, y, SMALL);
  });

  yesNo(
    p5,
    answers.foreignJurisdictionWork,
    { x: 465.1, y: 522.4, w: 17.1, h: 10 },
    { x: 510.5, y: 522.4, w: 12.7, h: 10 },
  );
  const foreignContractRowY = [462, 438, 414];
  answers.foreignContracts.slice(0, 3).forEach((c, i) => {
    const y = foreignContractRowY[i];
    text(p5, font, c.country, 107.4, y, SMALL);
    text(p5, font, c.client, 216.8, y, SMALL);
    text(p5, font, c.contractType, 331.5, y, SMALL);
    text(p5, font, c.expectedCompletionDate, 446.1, y, SMALL);
  });

  yesNo(
    p5,
    answers.expectsBusinessChanges,
    { x: 465.1, y: 396.2, w: 17.1, h: 10 },
    { x: 510.5, y: 396.2, w: 12.7, h: 10 },
  );
  wrapped(p5, font, answers.businessChangesExpectedDetails, 245, 384.6, 300, 4, 11.5, SMALL);

  yesNo(
    p5,
    answers.supplierCommitments,
    { x: 465.1, y: 310.6, w: 17.1, h: 10 },
    { x: 510.5, y: 310.6, w: 12.7, h: 10 },
  );
  textRight(p5, font, numberOnly(answers.supplierCommitmentPercentage), 538, 281.3, SMALL);

  textRight(p5, font, numberOnly(answers.industrialApplicationsPercentage), 538, 234.8, SMALL);
  wrapped(p5, font, answers.industrialApplicationsDescription, 245, 212.1, 300, 3, 11.5, SMALL);

  yesNo(
    p5,
    answers.standbyEquipment,
    { x: 465.1, y: 155.3, w: 17.1, h: 10 },
    { x: 510.5, y: 155.3, w: 12.7, h: 10 },
  );
  wrapped(p5, font, answers.standbyEquipmentDetails, 245, 143.9, 300, 4, 11.5, SMALL);

  yesNo(
    p5,
    answers.backupsMaintained,
    { x: 465.1, y: 69.7, w: 17.1, h: 10 },
    { x: 510.5, y: 69.7, w: 12.7, h: 10 },
  );

  // ---- Page 6: backups, previous projects, legacy systems, ---------------
  //      contractual liability ----------------------------------------------
  const p6 = page(6);
  yesNo(
    p6,
    answers.backupsStoredSeparately,
    { x: 465.1, y: 797.2, w: 17.1, h: 10 },
    { x: 510.5, y: 797.2, w: 12.7, h: 10 },
  );
  wrapped(p6, font, answers.backupsStorageDetails, 245, 785.6, 300, 5, 11.5, SMALL);

  const projectsSummary = answers.previousProjects
    .filter((p) => p.project)
    .map((p) => `${p.project} (${p.clientOrIndustry || "—"}): ${p.servicesProvided}${p.completionDate ? ` — ${p.completionDate}` : ""}`)
    .join("; ");
  wrapped(p6, font, projectsSummary, 96, 685, 460, 4, 11.5, SMALL);

  yesNo(
    p6,
    answers.legacyTwoDigitYear,
    { x: 465.1, y: 625.9, w: 17.1, h: 10 },
    { x: 521.8, y: 625.9, w: 12.7, h: 10 },
  );
  wrapped(p6, font, answers.legacyPreviousContractsAction, 100, 562, 460, 3, 11.5, SMALL);
  wrapped(p6, font, answers.legacyNonCompliantHandling, 100, 515.5, 460, 3, 11.5, SMALL);
  wrapped(p6, font, answers.legacyFutureMeasures, 100, 458, 460, 5, 11.5, SMALL);

  yesNo(
    p6,
    answers.extendedContractualLiability,
    { x: 465.1, y: 334.3, w: 17.1, h: 10 },
    { x: 521.8, y: 334.3, w: 12.7, h: 10 },
  );
  textRight(p6, font, numberOnly(answers.extendedLiabilityPercentage), 538, 290.1, SMALL);
  wrapped(p6, font, answers.extendedLiabilityDescription, 100, 234, 460, 6, 11.5, SMALL);

  // ---- Page 7: claims experience, details of insurance -------------------
  const p7 = page(7);
  yesNo(
    p7,
    answers.hasClaimsHistory,
    { x: 465.1, y: 785.6, w: 17.1, h: 10 },
    { x: 510.5, y: 785.6, w: 12.7, h: 10 },
  );
  const claimsSummary = answers.claimsHistory
    .filter((c) => c.date || c.claimant || c.natureOfClaim)
    .map((c) => `${c.date || "—"}: ${c.claimant || "—"} — ${c.natureOfClaim}${c.amountClaimed ? ` (${money(c.amountClaimed)})` : ""}`)
    .join("; ");
  wrapped(p7, font, claimsSummary, 96, 748, 460, 4, 11.5, SMALL);

  yesNo(
    p7,
    answers.awareOfPotentialClaim,
    { x: 465.1, y: 669.6, w: 17.1, h: 10 },
    { x: 510.5, y: 669.6, w: 12.7, h: 10 },
  );
  wrapped(p7, font, answers.awareOfPotentialClaimDetails, 96, 644, 460, 5, 11.5, SMALL);

  yesNo(
    p7,
    answers.hasHadPI,
    { x: 479.3, y: 561.3, w: 17.1, h: 10 },
    { x: 521.9, y: 561.3, w: 12.7, h: 10 },
  );
  text(p7, font, answers.piBroker, 190, 509.1, SMALL);
  text(p7, font, answers.piInsurer, 190, 486.9, SMALL);
  text(p7, font, answers.piPolicyExpiryDate, 210, 465.8, SMALL);
  text(p7, font, answers.piRunOffExpiryDate, 260, 444.4, SMALL);
  text(p7, font, money(answers.piLimitOfIndemnity), 195, 423.1, SMALL);
  text(p7, font, money(answers.piExcessDeductible), 250, 402.1, SMALL);
  text(p7, font, money(answers.piPremium), 155, 380.8, SMALL);

  yesNo(
    p7,
    answers.insurerDeclined,
    { x: 465.1, y: 341.0, w: 17.1, h: 10 },
    { x: 521.8, y: 341.0, w: 12.7, h: 10 },
  );
  yesNo(
    p7,
    answers.insurerImposedTerms,
    { x: 465.1, y: 329.4, w: 17.1, h: 10 },
    { x: 521.8, y: 329.4, w: 12.7, h: 10 },
  );
  yesNo(
    p7,
    answers.insurerCancelled,
    { x: 465.1, y: 317.9, w: 17.1, h: 10 },
    { x: 521.8, y: 317.9, w: 12.7, h: 10 },
  );
  wrapped(p7, font, answers.priorInsuranceIssuesDetails, 96, 281, 460, 4, 11.5, SMALL);

  yesNo(
    p7,
    answers.requiresRetroactiveCover,
    { x: 465.1, y: 215.8, w: 17.1, h: 10 },
    { x: 521.8, y: 215.8, w: 12.7, h: 10 },
  );

  // ---- Page 8: gross income, quotations required, declaration -----------
  const p8 = page(8);
  text(p8, font, monthYear(answers.financialYearEnd), 345, 758.88, SMALL);

  // 8.2 audited fees for the last 5 years: 3 rows in the left column, 2 in
  // the right, then the right column's 3rd row is the pre-printed "Estimate
  // for next 12 months".
  const feesLeftY = [688.4, 664.9, 641.4];
  const feesRightY = [688.4, 664.9];
  answers.grossFeesHistory.slice(0, 3).forEach((g, i) => {
    text(p8, font, monthYear(g.financialYearEnd), 148, feesLeftY[i], SMALL);
    text(p8, font, numberOnly(g.grossFees), 210, feesLeftY[i], SMALL);
  });
  answers.grossFeesHistory.slice(3, 5).forEach((g, i) => {
    text(p8, font, monthYear(g.financialYearEnd), 383, feesRightY[i], SMALL);
    text(p8, font, numberOnly(g.grossFees), 460, feesRightY[i], SMALL);
  });
  text(p8, font, numberOnly(answers.estimatedNextYearFees), 460, 641.4, SMALL);

  // 9. Quotations required — up to 3 limit rows. The online form no longer
  // collects a preferred deductible, so that column is left blank for the
  // broker/insurer to complete.
  const coverRowY = [539.4, 516.0, 492.4];
  const desiredLimits = [
    ...answers.desiredCoverLimits,
    ...(answers.desiredCoverLimitOther ? [answers.desiredCoverLimitOther] : []),
  ];
  desiredLimits.slice(0, 3).forEach((limit, i) => {
    text(p8, font, numberOnly(limit), 92, coverRowY[i], SMALL);
  });

  // Declaration
  text(p8, font, answers.declarationName, 362, 273.77, SMALL);
  text(p8, font, answers.declarationPosition, 160, 204.26, SMALL);
  text(p8, font, answers.declarationDate, 340, 204.26, SMALL);

  return pdf.save();
}
