import type {
  SATechnologyProposalAnswers,
  SAActivityBreakdownRow,
  SAClientBreakdownRow,
} from "@/types";
import type { StepDefinition } from "@/components/quote/technologyProposalTypes";

export const SA_DRAFT_STORAGE_KEY = "backedsure-sa-tech-pi-proposal-draft-v1";

export const emptyKeyPersonRow = {
  name: "",
  qualifications: "",
  professionalMemberships: "",
  yearsItExperience: "",
  yearsAsPrincipal: "",
};

export const emptyForeignContractRow = {
  country: "",
  client: "",
  contractType: "",
  expectedCompletionDate: "",
};

export const emptyProjectRow = {
  project: "",
  clientOrIndustry: "",
  servicesProvided: "",
  completionDate: "",
};

export const emptySAClaimRow = {
  date: "",
  claimant: "",
  natureOfClaim: "",
  amountClaimed: "",
  amountPaid: "",
  currentStatus: "",
  insurerInvolved: "",
};

export const emptyGrossFeeRow = { financialYearEnd: "", grossFees: "" };

export const emptyActivityBreakdownRow: SAActivityBreakdownRow = {
  southAfrica: "",
  foreign: "",
};

export const emptyClientBreakdownRow: SAClientBreakdownRow = {
  southAfrica: "",
  foreign: "",
};

export const staffCategories = [
  "Partners / Principals / Directors",
  "Software Designers / Systems Analysts",
  "Quality Assurance",
  "Computer Operations / Data Handling",
  "Hardware / Software Sales",
  "Other Staff",
] as const;

export const incomeActivityCategories = [
  "General consulting",
  "Systems / programme design",
  "Data processing / communications",
  "Software sales — software modified by you",
  "Hardware sales",
  "Software sales — no modification",
] as const;

export const clientTypeCategories = [
  "Government",
  "Financial institutions / finance houses",
  "Commercial businesses",
  "Industrial businesses",
] as const;

export const coverLimitOptions = [
  { value: "1000000", label: "R1,000,000" },
  { value: "5000000", label: "R5,000,000" },
  { value: "10000000", label: "R10,000,000" },
  { value: "20000000", label: "R20,000,000" },
];

export const initialSATechnologyProposalAnswers: SATechnologyProposalAnswers = {
  businessName: "",
  physicalAddress: "",
  website: "",
  turnoverUnder2Million: "",
  hasSubsidiaries: "",
  subsidiaryNames: "",
  hasForeignBranches: "",
  foreignBranchesDetails: "",
  hasOtherBusinessConnection: "",
  otherBusinessConnectionDetails: "",
  changedName: "",
  purchasedBusiness: "",
  mergedOrConsolidated: "",
  businessChangesDetails: "",

  keyPeople: [{ ...emptyKeyPersonRow }],

  staffCounts: {},
  staffAuthorisedToQuote: "",

  businessDescription: "",
  incomeByActivity: {},
  otherActivityDescription: "",

  providesPaymentServices: "",
  paymentServicesDescription: "",
  designsSoftware: "",
  installsHardware: "",
  installsHardwareAsContractor: "",
  designsOwnHardware: "",
  designsOwnHardwareDetails: "",
  industrialApplicationsPercentage: "",
  industrialApplicationsDescription: "",

  clientBreakdown: {},
  otherClientTypeDescription: "",

  servicesOutsideSA: "",
  foreignCountries: "",
  foreignServicesProvided: "",
  foreignFeePercentage: "",
  northAmericaBusiness: "",
  naCountriesStates: "",
  naFeePercentage: "",
  naPhysicalOffices: "",
  naOfficeManagement: "",
  naForeignShareholding: "",
  naForeignShareholdingPercentage: "",
  naAdvisesOnLaw: "",
  naAdvisesOnLawDetails: "",
  naAssetsOwned: "",
  naAssetsOwnedDetails: "",
  foreignJurisdictionWork: "",
  foreignContracts: [{ ...emptyForeignContractRow }],

  expectsBusinessChanges: "",
  businessChangesExpectedDetails: "",
  supplierCommitments: "",
  supplierCommitmentPercentage: "",

  standbyEquipment: "",
  standbyEquipmentDetails: "",
  backupsMaintained: "",
  backupsMaintainedBy: "",
  backupsStoredSeparately: "",
  backupsStorageDetails: "",

  previousProjects: [{ ...emptyProjectRow }],

  legacyTwoDigitYear: "",
  legacyPreviousContractsAction: "",
  legacyNonCompliantHandling: "",
  legacyFutureMeasures: "",

  extendedContractualLiability: "",
  extendedLiabilityPercentage: "",
  extendedLiabilityDescription: "",

  hasClaimsHistory: "",
  claimsHistory: [],
  awareOfPotentialClaim: "",
  awareOfPotentialClaimDetails: "",

  hasHadPI: "",
  piBroker: "",
  piInsurer: "",
  piPolicyExpiryDate: "",
  piRunOffExpiryDate: "",
  piLimitOfIndemnity: "",
  piExcessDeductible: "",
  piPremium: "",
  insurerDeclined: "",
  insurerImposedTerms: "",
  insurerCancelled: "",
  priorInsuranceIssuesDetails: "",
  requiresRetroactiveCover: "",

  financialYearEnd: "",
  grossFeesHistory: [
    { ...emptyGrossFeeRow },
    { ...emptyGrossFeeRow },
    { ...emptyGrossFeeRow },
    { ...emptyGrossFeeRow },
    { ...emptyGrossFeeRow },
  ],
  estimatedNextYearFees: "",

  desiredCoverLimits: [],
  desiredCoverLimitOther: "",

  uploadedFileNames: {},

  declarationName: "",
  declarationPosition: "",
  declarationDate: "",
  declarationAccepted: false,

  contactEmail: "",
  contactMobile: "",
};

export const saProposalSteps: StepDefinition[] = [
  { id: "business", label: "Business details", shortLabel: "Business" },
  { id: "people", label: "Directors, partners & key people", shortLabel: "Key people" },
  { id: "staff", label: "Staff", shortLabel: "Staff" },
  { id: "activities", label: "What your business does", shortLabel: "Activities" },
  { id: "services", label: "Technology services", shortLabel: "Services" },
  { id: "clients", label: "Clients & industry exposure", shortLabel: "Clients" },
  { id: "international", label: "International business", shortLabel: "International" },
  { id: "changes", label: "Business changes & suppliers", shortLabel: "Changes" },
  { id: "continuity", label: "Business continuity & data protection", shortLabel: "Continuity" },
  { id: "projects", label: "Previous projects", shortLabel: "Projects" },
  { id: "legacy", label: "Legacy systems", shortLabel: "Legacy" },
  { id: "contractual-liability", label: "Contractual liability", shortLabel: "Liability" },
  { id: "claims", label: "Claims history", shortLabel: "Claims" },
  { id: "pi-history", label: "Previous & current PI insurance", shortLabel: "PI history" },
  { id: "financials", label: "Financial information", shortLabel: "Financials" },
  { id: "cover", label: "Cover required", shortLabel: "Cover" },
  { id: "declaration", label: "Authorised person & submit", shortLabel: "Declare" },
];

export const SA_TOTAL_STEPS = saProposalSteps.length;
