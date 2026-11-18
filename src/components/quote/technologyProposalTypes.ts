import type { TechnologyProposalAnswers } from "@/types";

export const DRAFT_STORAGE_KEY = "backedsure-tech-pi-proposal-draft-v1";

export const emptyYearFees = {
  domesticFees: "",
  subConsultedFees: "",
  internationalFees: "",
};

export const emptyPrincipalRow = {
  name: "",
  qualification: "",
  dateQualified: "",
  yearsInPractice: "",
};

export const emptyClaimRow = { date: "", description: "" };

export const initialTechnologyProposalAnswers: TechnologyProposalAnswers = {
  insuredName: "",
  physicalAddress: "",
  companyWebsite: "",

  financialYearEndDate: "",
  pastYear: { ...emptyYearFees },
  currentYear: { ...emptyYearFees },
  futureYear: { ...emptyYearFees },

  controlledByOtherFirm: "",
  controlledByOtherFirmDetails: "",
  numPrincipals: "",
  numNonProfessionalEmployees: "",
  principals: [{ ...emptyPrincipalRow }],

  belongsToAssociation: "",
  associationDetails: "",
  membershipCancelledSuspended: "",
  membershipCancelledDetails: "",

  usesWrittenContract: "",
  hasRiskManagementProcedures: "",
  riskManagementDetails: "",
  subcontractingPercentage: "",
  usesWrittenContractWithSubcontractors: "",
  limitsLiabilityUnderContract: "",

  worksOutsideSA: "",
  worksOutsideSADetails: "",
  undertakesWorkOutsideSA: "",
  workOutsideSADetails: "",
  officesOutsideSA: "",
  officesOutsideSAList: "",
  northAmericaExposure: "",
  northAmericaFeePercentage: "",
  northAmericaPhysicalOffices: "",
  northAmericaOfficeManagement: "",
  northAmericaForeignShareholding: "",
  northAmericaForeignShareholdingPercentage: "",
  advisesOnForeignLaw: "",
  advisesOnForeignLawDetails: "",

  hasExistingPI: "",
  existingPIInsurer: "",
  existingPIExpiryDate: "",
  existingPILimit: "",
  existingPIRetroactiveDate: "",
  existingPIDeductible: "",
  existingPIPremium: "",

  priorInsuranceDeclinedCancelled: "",
  priorInsuranceDeclinedDetails: "",
  knowledgeOfPotentialClaim: "",
  knowledgeOfPotentialClaimDetails: "",
  claimsHistory: [],
  awareOfCircumstances: "",
  awareOfCircumstancesDetails: "",

  activitiesDescription: "",
  activityRevenueSplit: [{ activity: "", percentage: "" }],
  feesByActivity: {},
  otherActivityDescription: "",
  endUserApplications: {},
  otherEndUserDescription: "",
  markets: {},
  otherMarketDescription: "",

  contractsExcludeConsequentialLoss: "",
  systemWorkDocumentedTested: "",
  clientsSignOffPilotTests: "",
  clientsResponsibleForAccuracy: "",
  contractDelaysExamined: "",
  developmentMethodology: "",

  usesGenerativeAI: "",
  aiDescription: "",
  aiAuthorisedUsers: "",
  aiUsageMonitoring: "",
  aiBusinessReliancePercentage: "",
  aiOutputVerification: "",
  aiFinalDecisionMaker: "",

  desiredCoverLimits: ["1000000"],
  desiredCoverLimitOther: "",
  desiredDeductible: "",

  declarationName: "",
  declarationDesignation: "",
  declarationDate: "",
  declarationAccepted: false,

  contactEmail: "",
  contactMobile: "",
};

export const feeActivityCategories = [
  "Packaged Software",
  "Customisable Software",
  "Bespoke Software",
  "Systems Analysis",
  "Data Processing",
  "Facilities Management",
  "Sale/Supply Hardware",
  "Hardware Maintenance/Installation",
  "Software Installation",
  "General IT Advice",
  "Strategic Planning",
  "Procurement",
  "Training",
  "Trouble Shooting",
  "Project Management",
  "Systems Audit",
] as const;

export const endUserApplicationCategories = [
  "Administrative",
  "Accounting/Financial (Non-Funds Transfer)",
  "Architectural/Engineering",
  "Communications",
  "Database Management",
  "Educational",
  "Funds Transfer",
  "Imaging",
  "Inventory Control",
  "LAN/Network Management",
  "Medical Management",
  "Manufacturing Control Process",
  "Scientific/Mathematical",
  "Security (Firewalls etc)",
] as const;

export const marketCategories = [
  "Aerospace",
  "Communications/Transport",
  "Construction/Mining/Agriculture",
  "Education",
  "Financial Institutions",
  "Government (Military)",
  "Government (non-Military)",
  "Healthcare/Medical",
  "Home Use",
  "Internet Service Providers",
  "Manufacturing/Industrial",
  "Trade Retail/Wholesale",
] as const;

export const coverLimitOptions = [
  { value: "1000000", label: "R1,000,000" },
  { value: "2500000", label: "R2,500,000" },
  { value: "5000000", label: "R5,000,000" },
  { value: "10000000", label: "R10,000,000" },
  { value: "20000000", label: "R20,000,000" },
];

export const deductibleOptions = [
  { value: "10000", label: "R10,000" },
  { value: "25000", label: "R25,000" },
  { value: "50000", label: "R50,000" },
  { value: "100000", label: "R100,000" },
  { value: "", label: "Other" },
];

export interface StepDefinition {
  id: string;
  label: string;
  shortLabel: string;
}

export const proposalSteps: StepDefinition[] = [
  { id: "company", label: "Company details", shortLabel: "Company" },
  { id: "financials", label: "Fees & financials", shortLabel: "Financials" },
  { id: "structure", label: "Practice structure", shortLabel: "Structure" },
  { id: "practice", label: "Contracts & risk management", shortLabel: "Contracts" },
  { id: "international", label: "International exposure", shortLabel: "International" },
  { id: "insurance-history", label: "Insurance & claims history", shortLabel: "History" },
  { id: "activities", label: "Technology activities", shortLabel: "Activities" },
  { id: "activity-breakdown", label: "Revenue by activity", shortLabel: "Breakdown" },
  { id: "applications-markets", label: "Applications & markets", shortLabel: "Markets" },
  { id: "quality", label: "Risk & quality management", shortLabel: "Quality" },
  { id: "ai", label: "Artificial intelligence", shortLabel: "AI" },
  { id: "cover", label: "Limit of indemnity", shortLabel: "Cover" },
  { id: "declaration", label: "Declaration & submit", shortLabel: "Declare" },
];

export const TOTAL_STEPS = proposalSteps.length;
