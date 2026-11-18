// Core domain types for BackedSure.
// These mirror the Supabase schema (see supabase/migrations) and the
// structured content objects used to drive programmatic SEO pages.

export type ProfessionCategory =
  | "Built Environment"
  | "Financial Services"
  | "Legal"
  | "Technology"
  | "Property"
  | "Healthcare"
  | "Consulting"
  | "Professional Services"
  | "Other";

/** Whether the current rating engine can produce a real premium for this profession. */
export type RatingEligibility = "rated" | "refer-only";

export interface ProfessionQuestionOption {
  value: string;
  label: string;
}

export interface ProfessionQuestion {
  id: string;
  label: string;
  type: "text" | "number" | "currency" | "select" | "boolean" | "percentage";
  options?: ProfessionQuestionOption[];
  helpText?: string;
  required?: boolean;
}

export interface ProfessionFaq {
  question: string;
  answer: string;
}

export interface RelatedProductSlug {
  slug: string;
  reason: string;
}

export interface Profession {
  slug: string;
  name: string;
  pluralName: string;
  category: ProfessionCategory;
  ratingEligibility: RatingEligibility;
  shortDescription: string;
  intro: string;
  whyNeeded: string[];
  whatItCovers: string[];
  whatItExcludes: string[];
  commonClaims: { title: string; description: string }[];
  coverGuidance: string;
  premiumFactors: string[];
  requiredInformation: string[];
  retroactiveNote: string;
  runOffNote: string;
  questions: ProfessionQuestion[];
  faqs: ProfessionFaq[];
  relatedProfessionSlugs: string[];
  relatedProducts: RelatedProductSlug[];
}

export interface InsuranceProduct {
  slug: string;
  name: string;
  shortDescription: string;
  intro: string;
  whatItCovers: string[];
  whoNeedsIt: string[];
  faqs: ProfessionFaq[];
}

export type RiskClassification = "STANDARD" | "INDICATIVE" | "REFER";

export interface PIQuoteAnswers {
  /** Covers requested, as slugs from src/data/quoteProducts.ts. */
  products: string[];
  professionSlug: string;
  businessName: string;
  businessAddress: string;
  annualTurnover: number;
  principals: number;
  employees: number;
  yearsInBusiness: number;
  coverLimit: number;
  excessPreference?: number;
  claimsLast5Years: boolean;
  knownCircumstances: boolean;
  worksOutsideSA: boolean;
  hasExistingPI: boolean;
  retroactiveDateRequired?: string;
  extra: Record<string, string | number | boolean>;
  contact: {
    fullName: string;
    email: string;
    mobile: string;
    consent: boolean;
  };
}

export interface PIRatingResult {
  riskClassification: RiskClassification;
  premiumEstimate: { monthly: number; annual: number } | null;
  minimumPremium: number | null;
  coverLimit: number;
  excess: number | null;
  referralReasons: string[];
  insurerOptions: string[];
  ratingVersion: string;
  dateCalculated: string;
}

// ---------------------------------------------------------------------------
// Technology / IT Professional Indemnity proposal form
// Mirrors the iTOO Special Risks "Technology/Telecommunications" proposal
// form. This is a full underwriting proposal (not a rated quick-quote) —
// submissions go to a specialist for manual review, so there is no
// PIRatingResult produced here.
// ---------------------------------------------------------------------------
export type YesNo = "" | "yes" | "no";

export interface TechYearFees {
  domesticFees: string;
  subConsultedFees: string;
  internationalFees: string;
}

export interface TechPrincipalRow {
  name: string;
  qualification: string;
  dateQualified: string;
  yearsInPractice: string;
}

export interface TechClaimRow {
  date: string;
  description: string;
}

export interface TechActivityRow {
  activity: string;
  percentage: string;
}

export interface TechnologyProposalAnswers {
  // 1-4 Insured details
  insuredName: string;
  physicalAddress: string;
  companyWebsite: string;

  // 5 Fees / income. The financial year-end date is a single recurring date
  // (it doesn't change year to year). futureYear is auto-estimated as
  // currentYear + 10% rather than entered manually.
  financialYearEndDate: string;
  pastYear: TechYearFees;
  currentYear: TechYearFees;
  futureYear: TechYearFees;

  // 6-8 Structure
  controlledByOtherFirm: YesNo;
  controlledByOtherFirmDetails: string;
  numPrincipals: string;
  numNonProfessionalEmployees: string;
  principals: TechPrincipalRow[];

  // 9 Associations / regulatory bodies
  belongsToAssociation: YesNo;
  associationDetails: string;
  membershipCancelledSuspended: YesNo;
  membershipCancelledDetails: string;

  // 10-14 Contracts, risk management, subcontracting
  usesWrittenContract: YesNo;
  hasRiskManagementProcedures: YesNo;
  riskManagementDetails: string;
  subcontractingPercentage: string;
  usesWrittenContractWithSubcontractors: YesNo;
  limitsLiabilityUnderContract: YesNo;

  // 15 International exposure
  worksOutsideSA: YesNo;
  worksOutsideSADetails: string;
  undertakesWorkOutsideSA: YesNo;
  workOutsideSADetails: string;
  officesOutsideSA: YesNo;
  officesOutsideSAList: string;
  northAmericaExposure: YesNo;
  northAmericaFeePercentage: string;
  northAmericaPhysicalOffices: YesNo;
  northAmericaOfficeManagement: string;
  northAmericaForeignShareholding: YesNo;
  northAmericaForeignShareholdingPercentage: string;
  advisesOnForeignLaw: YesNo;
  advisesOnForeignLawDetails: string;

  // 16 Existing PI cover
  hasExistingPI: YesNo;
  existingPIInsurer: string;
  existingPIExpiryDate: string;
  existingPILimit: string;
  existingPIRetroactiveDate: string;
  existingPIDeductible: string;
  existingPIPremium: string;

  // 17-20 Insurance / claims history
  priorInsuranceDeclinedCancelled: YesNo;
  priorInsuranceDeclinedDetails: string;
  knowledgeOfPotentialClaim: YesNo;
  knowledgeOfPotentialClaimDetails: string;
  claimsHistory: TechClaimRow[];
  awareOfCircumstances: YesNo;
  awareOfCircumstancesDetails: string;

  // Technology activities
  activitiesDescription: string;
  activityRevenueSplit: TechActivityRow[];
  feesByActivity: Record<string, string>;
  otherActivityDescription: string;
  endUserApplications: Record<string, string>;
  otherEndUserDescription: string;
  markets: Record<string, string>;
  otherMarketDescription: string;

  // Risk / quality management
  contractsExcludeConsequentialLoss: YesNo;
  systemWorkDocumentedTested: YesNo;
  clientsSignOffPilotTests: YesNo;
  clientsResponsibleForAccuracy: YesNo;
  contractDelaysExamined: YesNo;
  developmentMethodology: string;

  // Artificial intelligence
  usesGenerativeAI: YesNo;
  aiDescription: string;
  aiAuthorisedUsers: string;
  aiUsageMonitoring: string;
  aiBusinessReliancePercentage: string;
  aiOutputVerification: string;
  aiFinalDecisionMaker: string;

  // Limit of indemnity — a user can select more than one amount to be quoted
  // for comparison, plus an optional custom "Other" amount.
  desiredCoverLimits: string[];
  desiredCoverLimitOther: string;
  desiredDeductible: string;

  // Declaration / e-signature
  declarationName: string;
  declarationDesignation: string;
  declarationDate: string;
  declarationAccepted: boolean;

  // Contact (for BackedSure follow-up — not part of the iTOO form itself)
  contactEmail: string;
  contactMobile: string;
}

// ---------------------------------------------------------------------------
// SA Technology Professional Indemnity proposal (/sa-professional-indemnity-technology-quote).
// A separate, longer-form proposal covering business/practice details,
// directors & key people, staffing, activities, clients, international
// exposure, continuity, claims and financial history.
// ---------------------------------------------------------------------------
export interface SAKeyPersonRow {
  name: string;
  qualifications: string;
  professionalMemberships: string;
  yearsItExperience: string;
  yearsAsPrincipal: string;
}

export interface SAActivityBreakdownRow {
  southAfrica: string;
  foreign: string;
}

export interface SAClientBreakdownRow {
  southAfrica: string;
  foreign: string;
}

export interface SAForeignContractRow {
  country: string;
  client: string;
  contractType: string;
  expectedCompletionDate: string;
}

export interface SAProjectRow {
  project: string;
  clientOrIndustry: string;
  servicesProvided: string;
  completionDate: string;
}

export interface SAClaimRow {
  date: string;
  claimant: string;
  natureOfClaim: string;
  amountClaimed: string;
  amountPaid: string;
  currentStatus: string;
  insurerInvolved: string;
}

export interface SAGrossFeeRow {
  financialYearEnd: string;
  grossFees: string;
}

export interface SATechnologyProposalAnswers {
  // Step 1 — Business details
  businessName: string;
  physicalAddress: string;
  website: string;
  turnoverUnder2Million: YesNo;
  hasSubsidiaries: YesNo;
  subsidiaryNames: string;
  hasForeignBranches: YesNo;
  foreignBranchesDetails: string;
  hasOtherBusinessConnection: YesNo;
  otherBusinessConnectionDetails: string;
  changedName: YesNo;
  purchasedBusiness: YesNo;
  mergedOrConsolidated: YesNo;
  businessChangesDetails: string;

  // Step 2 — Directors, partners and key people
  keyPeople: SAKeyPersonRow[];

  // Step 3 — Staff
  staffCounts: Record<string, string>;
  staffAuthorisedToQuote: string;

  // Step 4 — What your business does
  businessDescription: string;
  incomeByActivity: Record<string, SAActivityBreakdownRow>;
  otherActivityDescription: string;

  // Step 5 — Technology services
  providesPaymentServices: YesNo;
  paymentServicesDescription: string;
  designsSoftware: YesNo;
  installsHardware: YesNo;
  installsHardwareAsContractor: YesNo;
  designsOwnHardware: YesNo;
  designsOwnHardwareDetails: string;
  industrialApplicationsPercentage: string;
  industrialApplicationsDescription: string;

  // Step 6 — Clients and industry exposure
  clientBreakdown: Record<string, SAClientBreakdownRow>;
  otherClientTypeDescription: string;

  // Step 7 — International business
  servicesOutsideSA: YesNo;
  foreignCountries: string;
  foreignServicesProvided: string;
  foreignFeePercentage: string;
  northAmericaBusiness: YesNo;
  naCountriesStates: string;
  naFeePercentage: string;
  naPhysicalOffices: YesNo;
  naOfficeManagement: string;
  naForeignShareholding: YesNo;
  naForeignShareholdingPercentage: string;
  naAdvisesOnLaw: YesNo;
  naAdvisesOnLawDetails: string;
  naAssetsOwned: YesNo;
  naAssetsOwnedDetails: string;
  foreignJurisdictionWork: YesNo;
  foreignContracts: SAForeignContractRow[];

  // Step 8 — Business changes & supplier commitments
  expectsBusinessChanges: YesNo;
  businessChangesExpectedDetails: string;
  supplierCommitments: YesNo;
  supplierCommitmentPercentage: string;

  // Step 9 — Business continuity & data protection
  standbyEquipment: YesNo;
  standbyEquipmentDetails: string;
  backupsMaintained: YesNo;
  backupsMaintainedBy: string;
  backupsStoredSeparately: YesNo;
  backupsStorageDetails: string;

  // Step 10 — Previous projects
  previousProjects: SAProjectRow[];

  // Step 11 — Legacy systems
  legacyTwoDigitYear: YesNo;
  legacyPreviousContractsAction: string;
  legacyNonCompliantHandling: string;
  legacyFutureMeasures: string;

  // Step 12 — Contractual liability
  extendedContractualLiability: YesNo;
  extendedLiabilityPercentage: string;
  extendedLiabilityDescription: string;

  // Step 13 — Claims history
  hasClaimsHistory: YesNo;
  claimsHistory: SAClaimRow[];
  awareOfPotentialClaim: YesNo;
  awareOfPotentialClaimDetails: string;

  // Step 14 — Previous / current PI insurance
  hasHadPI: YesNo;
  piBroker: string;
  piInsurer: string;
  piPolicyExpiryDate: string;
  piRunOffExpiryDate: string;
  piLimitOfIndemnity: string;
  piExcessDeductible: string;
  piPremium: string;
  insurerDeclined: YesNo;
  insurerImposedTerms: YesNo;
  insurerCancelled: YesNo;
  priorInsuranceIssuesDetails: string;
  requiresRetroactiveCover: YesNo;

  // Step 15 — Financial information
  financialYearEnd: string;
  grossFeesHistory: SAGrossFeeRow[];
  estimatedNextYearFees: string;

  // Step 16 — Cover required
  desiredCoverLimits: string[];
  desiredCoverLimitOther: string;

  // Step 17 — Documents (file names only — actual files are emailed separately,
  // not uploaded through this form)
  uploadedFileNames: Record<string, string>;

  // Step 18 — Authorised person
  declarationName: string;
  declarationPosition: string;
  declarationDate: string;
  declarationAccepted: boolean;

  // Contact (for BackedSure follow-up — not part of the source questionnaire)
  contactEmail: string;
  contactMobile: string;
}
