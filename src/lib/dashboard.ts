import { cache } from "react";
import { getQuoteProfession } from "@/data/professions";
import { PI_PRODUCT_SLUG, quoteProductNames } from "@/data/quoteProducts";
import { requireUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import type { PIQuoteAnswers, PIRatingResult } from "@/types";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface DashboardApplication {
  id: string;
  kind: "quote" | "proposal";
  title: string;
  business: string;
  status: string;
  tone: StatusTone;
  inProgress: boolean;
  premium: string | null;
  coverLimit: number | null;
  createdAt: string;
}

export interface DashboardPolicy {
  id: string;
  policyNumber: string;
  coverLimit: number;
  excess: number | null;
  premium: string | null;
  inceptionDate: string;
  renewalDate: string;
  status: string;
  tone: StatusTone;
  active: boolean;
}

export interface DashboardClaim {
  id: string;
  policyNumber: string;
  description: string;
  incidentDate: string | null;
  status: string;
  tone: StatusTone;
  open: boolean;
  createdAt: string;
}

export interface DashboardDocument {
  id: string;
  fileName: string;
  documentType: string;
  url: string | null;
  createdAt: string;
}

export interface DashboardProfile {
  email: string;
  fullName: string;
  mobile: string;
  company: string;
}

// One auth check per request, shared by the layout and every page.
export const getSession = cache(requireUser);

const quoteStatus: Record<PIRatingResult["riskClassification"], [string, StatusTone]> = {
  STANDARD: ["Quote ready", "success"],
  INDICATIVE: ["Indicative quote", "info"],
  REFER: ["Specialist review", "warning"],
};

const proposalStatus: Record<string, [string, StatusTone]> = {
  submitted: ["Submitted", "info"],
  under_review: ["Under review", "warning"],
  quoted: ["Quoted", "success"],
  declined: ["Declined", "danger"],
};

const policyStatus: Record<string, [string, StatusTone]> = {
  active: ["Active", "success"],
  lapsed: ["Lapsed", "danger"],
  cancelled: ["Cancelled", "neutral"],
  run_off: ["Run-off", "info"],
};

const claimStatus: Record<string, [string, StatusTone]> = {
  notified: ["Notified", "info"],
  under_review: ["Under review", "warning"],
  closed: ["Closed", "neutral"],
};

function premiumLabel(premium: unknown): string | null {
  if (!premium || typeof premium !== "object") return null;
  const p = premium as { monthly?: number; annual?: number };
  if (typeof p.monthly === "number") return `${formatCurrency(p.monthly)} / month`;
  if (typeof p.annual === "number") return `${formatCurrency(p.annual)} / year`;
  return null;
}

export const getApplications = cache(async (): Promise<DashboardApplication[]> => {
  const { supabase } = await getSession();

  const [quotes, tech, saTech] = await Promise.all([
    supabase
      .from("quote_requests")
      .select("id, profession_slug, answers, result, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("technology_pi_proposals")
      .select("id, insured_name, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("sa_technology_pi_proposals")
      .select("id, business_name, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const rows: DashboardApplication[] = [];

  for (const q of quotes.data ?? []) {
    const answers = q.answers as PIQuoteAnswers;
    const result = q.result as PIRatingResult;
    // Quotes from before product selection existed were PI-only.
    const products = answers.products?.length ? answers.products : [PI_PRODUCT_SLUG];
    const includesPI = products.includes(PI_PRODUCT_SLUG);
    const [status, tone] = includesPI
      ? (quoteStatus[result.riskClassification] ?? ["Received", "neutral"])
      : (["Specialist review", "warning"] as [string, StatusTone]);
    const profession = getQuoteProfession(q.profession_slug);
    rows.push({
      id: q.id,
      kind: "quote",
      title: `${quoteProductNames(products).join(", ")} — ${profession?.name ?? q.profession_slug}`,
      business: answers.businessName,
      status,
      tone,
      inProgress: true,
      premium:
        includesPI && result.riskClassification !== "REFER"
          ? premiumLabel(result.premiumEstimate)
          : null,
      coverLimit: result.coverLimit ?? answers.coverLimit ?? null,
      createdAt: q.created_at,
    });
  }

  const proposals = [
    ...(tech.data ?? []).map((p) => ({ ...p, business: p.insured_name as string })),
    ...(saTech.data ?? []).map((p) => ({ ...p, business: p.business_name as string })),
  ];
  for (const p of proposals) {
    const [status, tone] = proposalStatus[p.status] ?? ["Received", "neutral"];
    rows.push({
      id: p.id,
      kind: "proposal",
      title: "Technology & IT Professional Indemnity proposal",
      business: p.business,
      status,
      tone,
      inProgress: p.status === "submitted" || p.status === "under_review",
      premium: null,
      coverLimit: null,
      createdAt: p.created_at,
    });
  }

  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

export const getPolicies = cache(async (): Promise<DashboardPolicy[]> => {
  const { supabase } = await getSession();
  const { data } = await supabase
    .from("policies")
    .select("id, policy_number, cover_limit, excess, premium, inception_date, renewal_date, status")
    .order("renewal_date", { ascending: true });

  return (data ?? []).map((p) => {
    const [status, tone] = policyStatus[p.status] ?? [p.status, "neutral"];
    return {
      id: p.id,
      policyNumber: p.policy_number,
      coverLimit: Number(p.cover_limit),
      excess: p.excess === null ? null : Number(p.excess),
      premium: premiumLabel(p.premium),
      inceptionDate: p.inception_date,
      renewalDate: p.renewal_date,
      status,
      tone,
      active: p.status === "active",
    };
  });
});

export const getClaims = cache(async (): Promise<DashboardClaim[]> => {
  const { supabase } = await getSession();
  const { data } = await supabase
    .from("claims")
    .select("id, policy_number, description, incident_date, status, created_at")
    .order("created_at", { ascending: false });

  return (data ?? []).map((c) => {
    const [status, tone] = claimStatus[c.status] ?? [c.status, "neutral"];
    return {
      id: c.id,
      policyNumber: c.policy_number,
      description: c.description,
      incidentDate: c.incident_date,
      status,
      tone,
      open: c.status !== "closed",
      createdAt: c.created_at,
    };
  });
});

export const getDocuments = cache(async (): Promise<DashboardDocument[]> => {
  const { supabase } = await getSession();
  const { data } = await supabase
    .from("documents")
    .select("id, storage_path, file_name, document_type, created_at")
    .order("created_at", { ascending: false });

  const docs = data ?? [];
  const signed = docs.length
    ? (
        await supabase.storage
          .from("documents")
          .createSignedUrls(
            docs.map((d) => d.storage_path),
            60 * 10,
          )
      ).data
    : [];

  return docs.map((d) => ({
    id: d.id,
    fileName: d.file_name,
    documentType: d.document_type,
    url: signed?.find((s) => s.path === d.storage_path)?.signedUrl ?? null,
    createdAt: d.created_at,
  }));
});

export const getProfile = cache(async (): Promise<DashboardProfile> => {
  const { supabase, user } = await getSession();
  const email = user.email ?? "";

  const { data: customer } = await supabase
    .from("customers")
    .select("full_name, first_name, last_name, mobile, company")
    .eq("id", user.id)
    .maybeSingle();

  if (customer) {
    return {
      email,
      fullName:
        customer.full_name ?? [customer.first_name, customer.last_name].filter(Boolean).join(" "),
      mobile: customer.mobile ?? "",
      company: customer.company ?? "",
    };
  }

  // No saved profile yet: prefill from the most recent quote.
  const { data: latest } = await supabase
    .from("quote_requests")
    .select("answers")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const answers = latest?.answers as PIQuoteAnswers | undefined;

  return {
    email,
    fullName: answers?.contact?.fullName ?? "",
    mobile: answers?.contact?.mobile ?? "",
    company: answers?.businessName ?? "",
  };
});

export function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function daysUntil(value: string) {
  return Math.ceil((new Date(value).getTime() - Date.now()) / 86_400_000);
}
