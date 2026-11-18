export interface QuoteFormState {
  products: string[];
  professionSlug: string;
  businessName: string;
  businessAddress: string;
  annualTurnover: string;
  principals: string;
  employees: string;
  yearsInBusiness: string;
  extra: Record<string, string | number | boolean>;
  coverLimit: string;
  claimsLast5Years: "" | "yes" | "no";
  knownCircumstances: "" | "yes" | "no";
  worksOutsideSA: "" | "yes" | "no";
  hasExistingPI: "" | "yes" | "no";
  retroactiveDateRequired: string;
  fullName: string;
  email: string;
  mobile: string;
  consent: boolean;
}

export const initialQuoteFormState: QuoteFormState = {
  products: [],
  professionSlug: "",
  businessName: "",
  businessAddress: "",
  annualTurnover: "",
  principals: "",
  employees: "",
  yearsInBusiness: "",
  extra: {},
  coverLimit: "1000000",
  claimsLast5Years: "",
  knownCircumstances: "",
  worksOutsideSA: "",
  hasExistingPI: "",
  retroactiveDateRequired: "",
  fullName: "",
  email: "",
  mobile: "",
  consent: true,
};

export const RISK_FIELD_IDS = [
  "claimsLast5Years",
  "knownCircumstances",
  "worksOutsideSA",
  "hasExistingPI",
  "retroactiveDateRequired",
  "annualTurnover",
  "largestContractValue",
];

export const TOTAL_STEPS = 6;

export const stepLabels = [
  "Cover & profession",
  "Your business",
  "Cover requirements",
  "Risk questions",
  "Contact details",
  "Result",
];
