import type { PIQuoteAnswers, PIRatingResult, Profession } from "@/types";

/**
 * pi-general-2026-01
 *
 * V1 rating rules. Only professions explicitly approved for online rating
 * (`ratingEligibility === "rated"`) can produce a STANDARD or INDICATIVE
 * result. Every other profession is always referred to specialist
 * underwriting — this is a deliberate product decision, not a gap: we never
 * invent a premium where no approved rating model exists.
 *
 * Rated professions: insurance-brokers, it-consultants, management-consultants,
 * project-managers, software-companies, other-professional-services.
 */
const RATING_VERSION = "pi-general-2026-01";

const RATE_TABLE: Record<string, { annualRate: number; minAnnualPremium: number }> = {
  "insurance-brokers": { annualRate: 0.006, minAnnualPremium: 9500 },
  "it-consultants": { annualRate: 0.007, minAnnualPremium: 8500 },
  "management-consultants": { annualRate: 0.005, minAnnualPremium: 7500 },
  "project-managers": { annualRate: 0.0055, minAnnualPremium: 7500 },
  "software-companies": { annualRate: 0.008, minAnnualPremium: 9500 },
  "other-professional-services": { annualRate: 0.006, minAnnualPremium: 6500 },
};

const MAX_ONLINE_TURNOVER = 15_000_000;
const MAX_ONLINE_LIMIT = 10_000_000;
const INDICATIVE_TURNOVER_THRESHOLD = 5_000_000;
const MIN_YEARS_FOR_STANDARD = 2;

function round(value: number, nearest = 50): number {
  return Math.round(value / nearest) * nearest;
}

export function evaluatePIRisk(
  profession: Profession,
  answers: PIQuoteAnswers,
): PIRatingResult {
  const dateCalculated = new Date().toISOString();
  const referralReasons: string[] = [];

  if (profession.ratingEligibility !== "rated") {
    return {
      riskClassification: "REFER",
      premiumEstimate: null,
      minimumPremium: null,
      coverLimit: answers.coverLimit,
      excess: null,
      referralReasons: [
        `Specialist underwriting is required for ${profession.pluralName.toLowerCase()} until an approved online rating model is available for this profession.`,
      ],
      insurerOptions: [],
      ratingVersion: RATING_VERSION,
      dateCalculated,
    };
  }

  if (answers.claimsLast5Years) {
    referralReasons.push("Claims in the last 5 years require review by a specialist underwriter.");
  }
  if (answers.knownCircumstances) {
    referralReasons.push("Known circumstances that may result in a claim must be assessed by a specialist underwriter.");
  }
  if (answers.annualTurnover > MAX_ONLINE_TURNOVER) {
    referralReasons.push("Annual turnover exceeds the threshold for an online underwriting response.");
  }
  if (answers.coverLimit > MAX_ONLINE_LIMIT) {
    referralReasons.push("The requested limit of indemnity exceeds the threshold for an online underwriting response.");
  }
  const usCanadaExposure = answers.extra?.usCanadaExposure === true;
  if (answers.worksOutsideSA && usCanadaExposure) {
    referralReasons.push("US / Canada exposure requires review by a specialist underwriter.");
  }

  if (referralReasons.length > 0) {
    return {
      riskClassification: "REFER",
      premiumEstimate: null,
      minimumPremium: null,
      coverLimit: answers.coverLimit,
      excess: null,
      referralReasons,
      insurerOptions: [],
      ratingVersion: RATING_VERSION,
      dateCalculated,
    };
  }

  const rate = RATE_TABLE[profession.slug];
  if (!rate) {
    return {
      riskClassification: "REFER",
      premiumEstimate: null,
      minimumPremium: null,
      coverLimit: answers.coverLimit,
      excess: null,
      referralReasons: ["No approved rating model is available for this profession yet."],
      insurerOptions: [],
      ratingVersion: RATING_VERSION,
      dateCalculated,
    };
  }

  const baseAnnualPremium = Math.max(
    rate.minAnnualPremium,
    answers.annualTurnover * rate.annualRate,
  );

  const limitInMillions = answers.coverLimit / 1_000_000;
  const limitMultiplier = Math.max(1, 1 + 0.12 * (limitInMillions - 1));
  const annualPremium = round(baseAnnualPremium * limitMultiplier);
  const monthlyPremium = round(annualPremium / 12, 10);
  const excess = round(Math.max(10_000, answers.coverLimit * 0.01), 500);

  const isStandard =
    answers.yearsInBusiness >= MIN_YEARS_FOR_STANDARD &&
    answers.annualTurnover <= INDICATIVE_TURNOVER_THRESHOLD &&
    answers.hasExistingPI;

  return {
    riskClassification: isStandard ? "STANDARD" : "INDICATIVE",
    premiumEstimate: { monthly: monthlyPremium, annual: annualPremium },
    minimumPremium: rate.minAnnualPremium,
    coverLimit: answers.coverLimit,
    excess,
    referralReasons: [],
    insurerOptions: ["BackedSure underwriting panel"],
    ratingVersion: RATING_VERSION,
    dateCalculated,
  };
}

export { RATING_VERSION };
