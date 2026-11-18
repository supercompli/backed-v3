import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import type { TechnologyProposalAnswers, TechYearFees, YesNo } from "@/types";
import { formatCurrency } from "@/lib/utils";

// Fills the Santam "Professional Indemnity Proposal Form for Technology
// Industry" — unlike forms/iTOOPIForm_IT.pdf this template ships as a flat
// PDF with no AcroForm fields (0 form fields; verified with pdf-lib), so
// there are no field names to target. Instead this draws answers directly
// onto each page at coordinates reverse-engineered from the template's text
// layout (extracted with pdfjs-dist's text-content API — see the
// conversation/PR that introduced this file for the extraction script,
// since there's no reusable equivalent of scripts/list-pdf-fields.mjs for a
// fieldless PDF). Coordinates are in PDF points, origin bottom-left, matched
// against forms/Santam_Technology Industry PI Proposal Form.pdf at its
// native page size (595.32 x 841.92, portrait, no rotation) — if that file
// is ever replaced, these positions need to be re-derived.
//
// Only questions with a clean, faithful mapping to TechnologyProposalAnswers
// are filled; several Santam-specific tables (e.g. the SA/Foreign revenue
// split in 4.1/4.6, the Y2K/"millennium compliance" question in 4.14, staff
// complement counts) have no equivalent captured answer and are left blank
// for the broker/insurer to complete, same policy the iTOO filler follows
// for its own unmapped fields.
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

function yesNo(page: PDFPage, value: YesNo, yesBox: Box, noBox: Box) {
  if (value === "yes") circle(page, yesBox);
  else if (value === "no") circle(page, noBox);
}

function money(value: string | undefined): string {
  const n = Number(value);
  return value && !Number.isNaN(n) ? formatCurrency(n) : "";
}

function percent(value: string | undefined): string {
  return value ? `${value}%` : "";
}

/** Same as money(), but without the "R" prefix — for the cells in the fees/quotations
 * tables where the template already pre-prints a separate "R" glyph to the left. */
function numberOnly(value: string | number | undefined): string {
  const n = typeof value === "number" ? value : Number(value);
  return value !== undefined && value !== "" && !Number.isNaN(n)
    ? new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 }).format(n)
    : "";
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

export async function fillSantamTechnologyProposalPdf(answers: TechnologyProposalAnswers): Promise<Uint8Array> {
  const templateBytes = await readFile(TEMPLATE_PATH);
  const pdf = await PDFDocument.load(templateBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const page = (n: number) => pages[n - 1];

  // ---- Page 2: Details of Proposed Insured -------------------------------
  const p2 = page(2);
  wrapped(p2, font, answers.insuredName, 160, 763.08, 390, 5);
  wrapped(p2, font, answers.physicalAddress, 160, 623.98, 390, 6);
  text(p2, font, answers.declarationName, 160, 548.71); // Contact Person
  text(p2, font, answers.contactMobile, 122, 525.31); // Tel No.
  text(p2, font, answers.contactEmail, 160, 501.79); // E-mail address
  text(p2, font, answers.companyWebsite, 400, 501.79, SMALL); // Website address

  yesNo(
    p2,
    answers.officesOutsideSA,
    { x: 465.1, y: 342.77, w: 17.12, h: 9.96 },
    { x: 510.48, y: 342.77, w: 12.73, h: 9.96 },
  );
  wrapped(p2, font, answers.officesOutsideSAList, 252, 331.25, 290, 1, 11.5, SMALL);

  // 1.3 Names/Qualifications of Principals — a 4-row table (rows bounded by
  // ruling lines at y=224.06/200.54/177.02/153.62/130.10, found via the PDF's
  // path-drawing operators since the row lines aren't text).
  const principalRowY = [205.5, 182, 158.6, 135.1];
  answers.principals.slice(0, 4).forEach((p, i) => {
    const y = principalRowY[i];
    text(p2, font, p.name, 79, y, SMALL);
    text(p2, font, p.qualification, 185, y, SMALL);
    text(p2, font, p.yearsInPractice, 471, y, SMALL);
  });

  // ---- Page 3: structure, business description, international work -----
  const p3 = page(3);
  yesNo(
    p3,
    answers.controlledByOtherFirm,
    { x: 468.82, y: 588.58, w: 17.12, h: 9.96 },
    { x: 514.2, y: 588.58, w: 12.73, h: 9.96 },
  );
  wrapped(p3, font, answers.controlledByOtherFirmDetails, 96, 548, 460, 1, 11.5, SMALL);

  wrapped(p3, font, answers.activitiesDescription, 68, 335, 470, 6, 11.5, SMALL);

  yesNo(
    p3,
    answers.worksOutsideSA,
    { x: 465.1, y: 234.29, w: 17.12, h: 9.96 },
    { x: 510.48, y: 234.29, w: 12.73, h: 9.96 },
  );
  wrapped(p3, font, answers.worksOutsideSADetails, 252, 211.34, 290, 1, 11.5, SMALL);

  yesNo(
    p3,
    answers.northAmericaExposure,
    { x: 465.1, y: 153.26, w: 17.12, h: 9.96 },
    { x: 510.48, y: 153.26, w: 12.73, h: 9.96 },
  );
  text(p3, font, percent(answers.northAmericaFeePercentage), 420, 118.82, SMALL);

  // ---- Page 4: North American offices / foreign law -----------------------
  const p4 = page(4);
  yesNo(
    p4,
    answers.northAmericaPhysicalOffices,
    { x: 465.1, y: 797.16, w: 17.12, h: 9.96 },
    { x: 510.48, y: 797.16, w: 12.73, h: 9.96 },
  );
  text(p4, font, answers.northAmericaOfficeManagement, 420, 762.6, SMALL);
  if (answers.northAmericaForeignShareholding === "yes") {
    circle(p4, { x: 158.57, y: 691.9, w: 17.12, h: 9.96 });
  } else if (answers.northAmericaForeignShareholding === "no") {
    circle(p4, { x: 200, y: 691.9, w: 13, h: 9.96 });
  }
  text(p4, font, percent(answers.northAmericaForeignShareholdingPercentage), 356, 692.62, SMALL);
  yesNo(
    p4,
    answers.advisesOnForeignLaw,
    { x: 465.1, y: 668.38, w: 17.12, h: 9.96 },
    { x: 510.48, y: 668.38, w: 12.73, h: 9.96 },
  );
  wrapped(p4, font, answers.advisesOnForeignLawDetails, 153, 645, 380, 1, 11.5, SMALL);

  // ---- Page 7: claims experience (question 6.1 starts on page 6, but its
  // "Yes"/"No" boxes are printed on page 7 where the sentence ends) / details
  // of insurance ------------------------------------------------------------
  const p7 = page(7);
  const hasClaims: YesNo = answers.claimsHistory.length > 0 ? "yes" : "";
  yesNo(
    p7,
    hasClaims,
    { x: 465.1, y: 785.64, w: 17.12, h: 9.96 },
    { x: 510.48, y: 785.64, w: 12.73, h: 9.96 },
  );
  if (hasClaims === "yes") {
    const claimsText = answers.claimsHistory
      .slice(0, 5)
      .map((c) => `${c.date}: ${c.description}`)
      .join("; ");
    wrapped(p7, font, claimsText, 96, 740, 460, 2, 11.5, SMALL);
  }

  yesNo(
    p7,
    answers.awareOfCircumstances,
    { x: 465.1, y: 669.58, w: 17.12, h: 9.96 },
    { x: 510.48, y: 669.58, w: 12.73, h: 9.96 },
  );
  wrapped(p7, font, answers.awareOfCircumstancesDetails, 96, 645, 460, 1, 11.5, SMALL);

  yesNo(
    p7,
    answers.hasExistingPI,
    { x: 479.28, y: 561.31, w: 17.12, h: 9.96 },
    { x: 521.88, y: 561.31, w: 12.73, h: 9.96 },
  );
  text(p7, font, answers.existingPIInsurer, 190, 486.91, SMALL);
  text(p7, font, answers.existingPIExpiryDate, 210, 465.79, SMALL);
  text(p7, font, money(answers.existingPILimit), 195, 423.07, SMALL);
  text(p7, font, money(answers.existingPIDeductible), 250, 402.05, SMALL);
  text(p7, font, money(answers.existingPIPremium), 155, 380.81, SMALL);

  yesNo(
    p7,
    answers.priorInsuranceDeclinedCancelled,
    { x: 465.1, y: 340.97, w: 17.12, h: 9.96 },
    { x: 521.76, y: 340.97, w: 12.73, h: 9.96 },
  );
  yesNo(
    p7,
    answers.priorInsuranceDeclinedCancelled,
    { x: 465.1, y: 317.93, w: 17.12, h: 9.96 },
    { x: 521.76, y: 317.93, w: 12.73, h: 9.96 },
  );
  // Below the label rather than beside it — same y as the label itself would
  // overlap the label text ("If yes, please provide full details:").
  wrapped(p7, font, answers.priorInsuranceDeclinedDetails, 96, 283, 460, 1, 11.5, SMALL);

  // ---- Page 8: gross income, quotations required, declaration -----------
  const p8 = page(8);
  text(p8, font, answers.financialYearEndDate, 345, 758.88, SMALL);

  // 8.2 audited fees table: left column holds the past two disclosed years,
  // right column's 3rd row is the pre-printed "Estimate for next 12 months".
  // Values use numberOnly() (not money()) because the template already
  // pre-prints a separate "R" glyph immediately to the left of each cell.
  text(p8, font, offsetYearLabel(answers.financialYearEndDate, -1), 148, 688.42, SMALL);
  text(p8, font, numberOnly(yearTotal(answers.pastYear)), 210, 688.42, SMALL);
  text(p8, font, offsetYearLabel(answers.financialYearEndDate, 0), 148, 664.9, SMALL);
  text(p8, font, numberOnly(yearTotal(answers.currentYear)), 210, 664.9, SMALL);
  text(p8, font, numberOnly(yearTotal(answers.futureYear)), 460, 641.38, SMALL);

  // 9. Quotations required — up to 3 limit/deductible rows (same pre-printed
  // "R" glyph per cell, so numberOnly() again).
  const allLimits = [
    ...answers.desiredCoverLimits,
    ...(answers.desiredCoverLimitOther ? [answers.desiredCoverLimitOther] : []),
  ];
  const limitRowY = [539.35, 515.95, 492.43];
  allLimits.slice(0, 3).forEach((limit, i) => {
    text(p8, font, numberOnly(limit), 92, limitRowY[i], SMALL);
    text(p8, font, numberOnly(answers.desiredDeductible), 332, limitRowY[i], SMALL);
  });

  // Declaration — "Full name" label ends at x≈356.6, so start well clear of it.
  text(p8, font, answers.declarationName, 362, 273.77, SMALL);
  text(p8, font, answers.declarationDesignation, 160, 204.26, SMALL);
  text(p8, font, answers.declarationDate, 340, 204.26, SMALL);

  return pdf.save();
}
