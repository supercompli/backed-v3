"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SATechnologyProposalAnswers } from "@/types";
import { LinkButton } from "@/components/ui/Button";
import {
  Field,
  TextAreaField,
  SelectField,
  MoneyField,
  formatThousands,
  parseThousands,
  PercentTotal,
  YesNoToggle,
  StepHeading,
  StepNav,
} from "@/components/quote/ProposalFields";
import { ProposalProgress } from "@/components/quote/ProposalProgress";
import {
  SA_DRAFT_STORAGE_KEY,
  initialSATechnologyProposalAnswers,
  emptyKeyPersonRow,
  emptyForeignContractRow,
  emptyProjectRow,
  emptySAClaimRow,
  staffCategories,
  incomeActivityCategories,
  clientTypeCategories,
  coverLimitOptions,
  saProposalSteps,
  SA_TOTAL_STEPS,
} from "@/components/quote/saTechnologyProposalTypes";
import { cn } from "@/lib/utils";

type ArrayKey =
  | "keyPeople"
  | "foreignContracts"
  | "previousProjects"
  | "claimsHistory"
  | "grossFeesHistory";

function sumPercentColumn(record: Record<string, { southAfrica?: string; foreign?: string }>, key: "southAfrica" | "foreign"): number {
  return Object.values(record).reduce((sum, v) => sum + (Number(v[key]) || 0), 0);
}

function todayISODate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

/** "2026-02" -> "Feb 2026" */
function formatMonthYear(value: string): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  if (!year || index < 0 || index > 11) return value;
  const label = new Date(Number(year), index, 1).toLocaleDateString("en-ZA", { month: "short", year: "numeric" });
  return label;
}

/** Given a "YYYY-MM" financial year-end, returns the same month/year-end for
 * this year and the preceding 4 years, oldest first. */
function financialYearEndsFor(value: string): string[] {
  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  if (!year || !monthStr) return [];
  return Array.from({ length: 5 }, (_, i) => `${year - 4 + i}-${monthStr}`);
}

interface AddressSuggestion {
  id: string;
  label: string;
  placeType: string;
}

const backupsMaintainedByOptions = [
  { value: "Your business", label: "Your business" },
  { value: "Client", label: "Client" },
  { value: "Both", label: "Both" },
  { value: "Other", label: "Other" },
];

const financialYearEndMonthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const financialYearEndYearOptions = Array.from({ length: 7 }, (_, i) => {
  const year = new Date().getFullYear() + 1 - i;
  return { value: String(year), label: String(year) };
});

export function SATechnologyProposalForm() {
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [form, setForm] = useState<SATechnologyProposalAnswers>(initialSATechnologyProposalAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressLookupError, setAddressLookupError] = useState<string | null>(null);
  const [addressLookupConfigured, setAddressLookupConfigured] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [showOtherLimit, setShowOtherLimit] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(SA_DRAFT_STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as {
            form: SATechnologyProposalAnswers;
            step: number;
            furthestStep: number;
          };
          setForm({ ...initialSATechnologyProposalAnswers, ...saved.form });
          setStep(saved.step ?? 0);
          setFurthestStep(saved.furthestStep ?? 0);
          setShowOtherLimit(Boolean(saved.form?.desiredCoverLimitOther));
          setRestoredDraft(true);
        }
      } catch {
        // Ignore a corrupt or inaccessible draft — start fresh.
      } finally {
        hydrated.current = true;
      }
      setForm((prev) => (prev.declarationDate ? prev : { ...prev, declarationDate: todayISODate() }));
    });
  }, []);

  useEffect(() => {
    if (!hydrated.current || submitted) return;
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          SA_DRAFT_STORAGE_KEY,
          JSON.stringify({ form, step, furthestStep }),
        );
      } catch {
        // Storage unavailable (private browsing, quota) — proceed without autosave.
      }
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [form, step, furthestStep, submitted]);

  useEffect(() => {
    const query = form.physicalAddress.trim();

    if (query.length < 3) {
      queueMicrotask(() => {
        setAddressSuggestions([]);
        setAddressLookupError(null);
      });
      return;
    }

    if (query === selectedAddress) {
      queueMicrotask(() => setAddressSuggestions([]));
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/address/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Address lookup failed.");

        const data = (await res.json()) as {
          suggestions?: AddressSuggestion[];
          configured?: boolean;
        };

        setAddressSuggestions(data.suggestions ?? []);
        setAddressLookupConfigured(data.configured !== false);
        setAddressLookupError(null);
      } catch {
        if (controller.signal.aborted) return;
        setAddressSuggestions([]);
        setAddressLookupError("Address suggestions are unavailable. You can still type the address manually.");
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [form.physicalAddress, selectedAddress]);

  function update<K extends keyof SATechnologyProposalAnswers>(
    key: K,
    value: SATechnologyProposalAnswers[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateRow<K extends ArrayKey>(
    key: K,
    index: number,
    field: keyof SATechnologyProposalAnswers[K][number],
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] as unknown as Array<Record<string, string>>).map((row, i) =>
        i === index ? { ...row, [field as string]: value } : row,
      ),
    }));
  }

  function addRow<K extends ArrayKey>(key: K, empty: SATechnologyProposalAnswers[K][number]) {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] as unknown[]), empty] }));
  }

  function removeRow<K extends ArrayKey>(key: K, index: number) {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] as unknown[]).filter((_, i) => i !== index),
    }));
  }

  function updateFinancialYearEnd(value: string) {
    setForm((prev) => {
      const years = financialYearEndsFor(value);
      if (years.length === 0) return { ...prev, financialYearEnd: value };
      return {
        ...prev,
        financialYearEnd: value,
        grossFeesHistory: years.map((financialYearEnd, i) => ({
          financialYearEnd,
          grossFees: prev.grossFeesHistory[i]?.grossFees ?? "",
        })),
      };
    });
  }

  function updateStaffCount(category: string, value: string) {
    setForm((prev) => ({ ...prev, staffCounts: { ...prev.staffCounts, [category]: value } }));
  }

  function updateIncomeRow(category: string, field: "southAfrica" | "foreign", value: string) {
    setForm((prev) => {
      const existing = prev.incomeByActivity[category] ?? { southAfrica: "", foreign: "" };
      return {
        ...prev,
        incomeByActivity: { ...prev.incomeByActivity, [category]: { ...existing, [field]: value } },
      };
    });
  }

  function updateClientRow(category: string, field: "southAfrica" | "foreign", value: string) {
    setForm((prev) => {
      const existing = prev.clientBreakdown[category] ?? { southAfrica: "", foreign: "" };
      return {
        ...prev,
        clientBreakdown: { ...prev.clientBreakdown, [category]: { ...existing, [field]: value } },
      };
    });
  }

  function updateUploadedFile(key: string, files: FileList | null) {
    const names = files ? Array.from(files).map((f) => f.name).join(", ") : "";
    setForm((prev) => ({ ...prev, uploadedFileNames: { ...prev.uploadedFileNames, [key]: names } }));
  }

  function goTo(index: number) {
    setStep(Math.max(0, Math.min(index, SA_TOTAL_STEPS - 1)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function next() {
    const nextIndex = Math.min(step + 1, SA_TOTAL_STEPS - 1);
    setStep(nextIndex);
    setFurthestStep((f) => Math.max(f, nextIndex));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    goTo(step - 1);
  }

  function reset() {
    setForm({ ...initialSATechnologyProposalAnswers, declarationDate: todayISODate() });
    setShowOtherLimit(false);
    setStep(0);
    setFurthestStep(0);
    setSubmitted(false);
    setSubmitError(null);
    try {
      window.localStorage.removeItem(SA_DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/proposal/sa-technology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      try {
        window.localStorage.removeItem(SA_DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Something went wrong submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepId = saProposalSteps[step].id;
  const [financialYearEndYear = "", financialYearEndMonth = ""] = form.financialYearEnd
    ? form.financialYearEnd.split("-")
    : [];
  const financialYearEndParts = { year: financialYearEndYear, month: financialYearEndMonth };
  const totalStaff = Object.values(form.staffCounts).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const incomeSouthAfricaTotal = sumPercentColumn(form.incomeByActivity, "southAfrica");
  const incomeForeignTotal = sumPercentColumn(form.incomeByActivity, "foreign");
  const hasBusinessChanges =
    form.changedName === "yes" || form.purchasedBusiness === "yes" || form.mergedOrConsolidated === "yes";
  const hasPriorInsuranceIssues =
    form.insurerDeclined === "yes" || form.insurerImposedTerms === "yes" || form.insurerCancelled === "yes";

  if (submitted) {
    return (
      <div className="bg-white border border-border rounded-3xl p-8 sm:p-12 shadow-md text-center max-w-2xl mx-auto">
        <div className="mx-auto h-14 w-14 rounded-full bg-soft-green text-green-dark flex items-center justify-center text-2xl font-black">
          ✓
        </div>
        <h2 className="mt-6 text-2xl font-bold text-primary-dark">
          Your application has been submitted
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Thank you, {form.declarationName || "there"}. A BackedSure specialist will review your
          Technology Professional Indemnity proposal and get back to you at{" "}
          <span className="font-semibold text-text-dark">{form.contactEmail}</span> with next
          steps. If you need to attach any of the documents mentioned in this form, reply to your
          confirmation email or send them to{" "}
          <a href="mailto:hello@backedsure.co.za" className="text-green font-semibold">
            hello@backedsure.co.za
          </a>
          .
        </p>
        <div className="mt-8">
          <LinkButton href="/" size="lg">
            Return to Homepage
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8">
        <div className="mb-6 flex items-center justify-between text-xs text-text-secondary">
          <span>
            Step {step + 1} of {SA_TOTAL_STEPS}
          </span>
          <span className="font-semibold text-text-dark">{saProposalSteps[step].label}</span>
        </div>

        {restoredDraft && step > 0 ? (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-md border border-green/30 bg-soft-green px-4 py-3 text-sm text-green-dark">
            <span>We restored your saved progress.</span>
            <button
              type="button"
              onClick={() => setRestoredDraft(false)}
              className="font-semibold hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-accent/10 blur-2xl rounded-full pointer-events-none" />

          {stepId === "business" && (
            <div>
              <StepHeading
                title="Business details"
                description="Tell us about the business applying for cover."
              />
              <div className="mt-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Business / practice name"
                    required
                    className="sm:col-span-2"
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                  />
                  <div className="relative flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <label htmlFor="sa-physical-address" className="font-medium text-text-dark">
                      Physical address<span className="text-danger"> *</span>
                    </label>
                    <input
                      id="sa-physical-address"
                      value={form.physicalAddress}
                      onChange={(e) => {
                        setSelectedAddress("");
                        update("physicalAddress", e.target.value);
                      }}
                      autoComplete="street-address"
                      placeholder="Start typing your business address"
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg text-[15px] text-text-dark focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
                    />
                    {addressSuggestions.length > 0 ? (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                        {addressSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onClick={() => {
                              update("physicalAddress", suggestion.label);
                              setSelectedAddress(suggestion.label);
                              setAddressSuggestions([]);
                            }}
                            className="block w-full px-3 py-2.5 text-left text-sm text-text-dark hover:bg-soft-green"
                          >
                            {suggestion.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {!addressLookupConfigured ? (
                      <p className="text-xs text-text-secondary">
                        Address autocomplete needs Amazon Location environment variables.
                      </p>
                    ) : null}
                    {addressLookupError ? (
                      <p className="text-xs text-danger">{addressLookupError}</p>
                    ) : null}
                  </div>
                  <Field
                    label="Website"
                    className="sm:col-span-2"
                    placeholder="https://"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                  />
                </div>

                <YesNoToggle
                  label="Is your annual turnover or total asset value less than R2 million?"
                  value={form.turnoverUnder2Million}
                  onChange={(v) => update("turnoverUnder2Million", v)}
                />

                <YesNoToggle
                  label="Do you have any subsidiary companies?"
                  value={form.hasSubsidiaries}
                  onChange={(v) => update("hasSubsidiaries", v)}
                />
                {form.hasSubsidiaries === "yes" && (
                  <Field
                    label="Business name(s)"
                    value={form.subsidiaryNames}
                    onChange={(e) => update("subsidiaryNames", e.target.value)}
                  />
                )}

                <YesNoToggle
                  label="Do you have any branches outside South Africa?"
                  value={form.hasForeignBranches}
                  onChange={(v) => update("hasForeignBranches", v)}
                />
                {form.hasForeignBranches === "yes" && (
                  <TextAreaField
                    label="Country, location and brief details"
                    value={form.foreignBranchesDetails}
                    onChange={(e) => update("foreignBranchesDetails", e.target.value)}
                  />
                )}

                <YesNoToggle
                  label="Is the business, or any director, partner or principal, financially or otherwise connected to another business or organisation?"
                  value={form.hasOtherBusinessConnection}
                  onChange={(v) => update("hasOtherBusinessConnection", v)}
                />
                {form.hasOtherBusinessConnection === "yes" && (
                  <TextAreaField
                    label="Please provide details"
                    value={form.otherBusinessConnectionDetails}
                    onChange={(e) => update("otherBusinessConnectionDetails", e.target.value)}
                  />
                )}

                <div className="border-t border-border pt-6 space-y-4">
                  <p className="text-sm font-semibold text-text-dark">
                    In the past 5 years, has the business:
                  </p>
                  <YesNoToggle
                    label="Changed its name?"
                    value={form.changedName}
                    onChange={(v) => update("changedName", v)}
                  />
                  <YesNoToggle
                    label="Purchased another business?"
                    value={form.purchasedBusiness}
                    onChange={(v) => update("purchasedBusiness", v)}
                  />
                  <YesNoToggle
                    label="Merged or consolidated with another business?"
                    value={form.mergedOrConsolidated}
                    onChange={(v) => update("mergedOrConsolidated", v)}
                  />
                  {hasBusinessChanges && (
                    <TextAreaField
                      label="Please provide details"
                      value={form.businessChangesDetails}
                      onChange={(e) => update("businessChangesDetails", e.target.value)}
                    />
                  )}
                </div>
              </div>
              <StepNav onNext={next} nextDisabled={!form.businessName || !form.physicalAddress} />
            </div>
          )}

          {stepId === "people" && (
            <div>
              <StepHeading
                title="Directors, partners and key people"
                description="Add each director, partner, principal or member."
              />
              <div className="mt-6 space-y-4">
                {form.keyPeople.map((row, index) => (
                  <div key={index} className="border border-border rounded-xl p-4 relative">
                    {form.keyPeople.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow("keyPeople", index)}
                        className="absolute top-3 right-3 text-xs font-semibold text-danger hover:underline"
                      >
                        Remove
                      </button>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4 pr-16">
                      <Field
                        label="Full name"
                        value={row.name}
                        onChange={(e) => updateRow("keyPeople", index, "name", e.target.value)}
                      />
                      <Field
                        label="Qualifications"
                        value={row.qualifications}
                        onChange={(e) => updateRow("keyPeople", index, "qualifications", e.target.value)}
                      />
                      <Field
                        label="Professional memberships"
                        value={row.professionalMemberships}
                        onChange={(e) =>
                          updateRow("keyPeople", index, "professionalMemberships", e.target.value)
                        }
                      />
                      <Field
                        label="Years of IT experience"
                        type="number"
                        min={0}
                        value={row.yearsItExperience}
                        onChange={(e) => updateRow("keyPeople", index, "yearsItExperience", e.target.value)}
                      />
                      <Field
                        label="Years as principal / director"
                        type="number"
                        min={0}
                        value={row.yearsAsPrincipal}
                        onChange={(e) => updateRow("keyPeople", index, "yearsAsPrincipal", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addRow("keyPeople", { ...emptyKeyPersonRow })}
                className="mt-3 text-sm font-semibold text-green hover:text-green-dark"
              >
                + Add another person
              </button>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "staff" && (
            <div>
              <StepHeading
                title="Staff"
                description="Enter the number of people in each category."
              />
              <div className="mt-6 divide-y divide-border">
                {staffCategories.map((category) => (
                  <div key={category} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="text-text-dark">{category}</span>
                    <input
                      type="number"
                      min={0}
                      value={form.staffCounts[category] ?? ""}
                      onChange={(e) => updateStaffCount(category, e.target.value)}
                      className="w-24 border border-border rounded-md px-3 py-1.5 bg-warm-bg text-[15px] text-text-dark text-right focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3 py-3 text-sm font-bold text-primary-dark">
                  <span>Total staff</span>
                  <span>{totalStaff}</span>
                </div>
              </div>
              <Field
                label="How many staff members, excluding principals/directors, are authorised to quote prices for your services?"
                type="number"
                min={0}
                className="mt-6 max-w-sm"
                value={form.staffAuthorisedToQuote}
                onChange={(e) => update("staffAuthorisedToQuote", e.target.value)}
              />
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "activities" && (
            <div>
              <StepHeading
                title="What your business does"
                description="Briefly describe your business and break your income down by activity. Each of the South Africa % and Foreign % columns must add up to 100%."
              />
              <div className="mt-6 space-y-6">
                <TextAreaField
                  label="Briefly describe your business and the services you provide"
                  required
                  rows={4}
                  value={form.businessDescription}
                  onChange={(e) => update("businessDescription", e.target.value)}
                />

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left text-xs text-text-secondary">
                        <th className="pb-2 font-medium">Activity</th>
                        <th className="pb-2 font-medium text-right w-28">South Africa %</th>
                        <th className="pb-2 font-medium text-right w-24">Foreign %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[...incomeActivityCategories, "Other"].map((category) => {
                        const row = form.incomeByActivity[category] ?? { southAfrica: "", foreign: "" };
                        return (
                          <tr key={category}>
                            <td className="py-2 pr-2 text-text-dark">{category}</td>
                            <td className="py-2 pl-2">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={row.southAfrica}
                                onChange={(e) => updateIncomeRow(category, "southAfrica", e.target.value)}
                                className="w-24 border border-border rounded-md px-2 py-1.5 bg-warm-bg text-right text-[14px] focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
                              />
                            </td>
                            <td className="py-2 pl-2">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={row.foreign}
                                onChange={(e) => updateIncomeRow(category, "foreign", e.target.value)}
                                className="w-20 border border-border rounded-md px-2 py-1.5 bg-warm-bg text-right text-[14px] focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <PercentTotal total={incomeSouthAfricaTotal} label="South Africa % total" />
                  <PercentTotal total={incomeForeignTotal} label="Foreign % total" />
                </div>

                {form.incomeByActivity["Other"] && (form.incomeByActivity["Other"].southAfrica || form.incomeByActivity["Other"].foreign) && (
                  <TextAreaField
                    label="If Other, describe the activity"
                    value={form.otherActivityDescription}
                    onChange={(e) => update("otherActivityDescription", e.target.value)}
                  />
                )}
              </div>
              <StepNav onBack={back} onNext={next} nextDisabled={!form.businessDescription} />
            </div>
          )}

          {stepId === "services" && (
            <div>
              <StepHeading
                title="Technology services"
                description="Tell us more about the technology services you provide."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Do you provide payment facilitation, payment platforms or payment-related services?"
                  value={form.providesPaymentServices}
                  onChange={(v) => update("providesPaymentServices", v)}
                />
                {form.providesPaymentServices === "yes" && (
                  <TextAreaField
                    label="Describe the service"
                    value={form.paymentServicesDescription}
                    onChange={(e) => update("paymentServicesDescription", e.target.value)}
                  />
                )}

                <YesNoToggle
                  label="Do you design computer software or software packages?"
                  value={form.designsSoftware}
                  onChange={(v) => update("designsSoftware", v)}
                />

                <YesNoToggle
                  label="Do you install computer hardware?"
                  value={form.installsHardware}
                  onChange={(v) => update("installsHardware", v)}
                />

                <YesNoToggle
                  label="Do you install computer hardware as a contractor for another business?"
                  value={form.installsHardwareAsContractor}
                  onChange={(v) => update("installsHardwareAsContractor", v)}
                />
                {form.installsHardwareAsContractor === "yes" && (
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-text-dark">
                      Upload the relevant contract or agreement
                    </span>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => updateUploadedFile("hardwareContract", e.target.files)}
                      className="text-sm"
                    />
                    <span className="text-xs text-text-secondary">
                      Files aren&apos;t submitted with this form — reply to your confirmation email
                      with the document attached.
                    </span>
                  </label>
                )}

                <YesNoToggle
                  label="If you do not install hardware, do you design, manufacture or assemble computer units/equipment yourself?"
                  value={form.designsOwnHardware}
                  onChange={(v) => update("designsOwnHardware", v)}
                />
                {form.designsOwnHardware === "yes" && (
                  <TextAreaField
                    label="Please provide details"
                    value={form.designsOwnHardwareDetails}
                    onChange={(e) => update("designsOwnHardwareDetails", e.target.value)}
                  />
                )}

                <Field
                  label="What percentage of your income comes from computer applications used for industrial processing, engineering or architectural design?"
                  type="number"
                  min={0}
                  max={100}
                  className="max-w-xs"
                  value={form.industrialApplicationsPercentage}
                  onChange={(e) => update("industrialApplicationsPercentage", e.target.value)}
                />
                <TextAreaField
                  label="Briefly describe this work"
                  value={form.industrialApplicationsDescription}
                  onChange={(e) => update("industrialApplicationsDescription", e.target.value)}
                />
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "clients" && (
            <div>
              <StepHeading
                title="Clients and industry exposure"
                description="Break down your income by customer type."
              />
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left text-xs text-text-secondary">
                      <th className="pb-2 font-medium">Client type</th>
                      <th className="pb-2 font-medium text-right w-28">South Africa %</th>
                      <th className="pb-2 font-medium text-right w-24">Foreign %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[...clientTypeCategories, "Other"].map((category) => {
                      const row = form.clientBreakdown[category] ?? { southAfrica: "", foreign: "" };
                      return (
                        <tr key={category}>
                          <td className="py-2 pr-2 text-text-dark">{category}</td>
                          <td className="py-2 pl-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={row.southAfrica}
                              onChange={(e) => updateClientRow(category, "southAfrica", e.target.value)}
                              className="w-24 border border-border rounded-md px-2 py-1.5 bg-warm-bg text-right text-[14px] focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
                            />
                          </td>
                          <td className="py-2 pl-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={row.foreign}
                              onChange={(e) => updateClientRow(category, "foreign", e.target.value)}
                              className="w-20 border border-border rounded-md px-2 py-1.5 bg-warm-bg text-right text-[14px] focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {form.clientBreakdown["Other"] && (form.clientBreakdown["Other"].southAfrica || form.clientBreakdown["Other"].foreign) && (
                <TextAreaField
                  label="If Other, describe"
                  className="mt-4"
                  value={form.otherClientTypeDescription}
                  onChange={(e) => update("otherClientTypeDescription", e.target.value)}
                />
              )}
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "international" && (
            <div>
              <StepHeading
                title="International business"
                description="Work undertaken, or planned, outside South Africa."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Do you provide services to clients outside South Africa?"
                  value={form.servicesOutsideSA}
                  onChange={(v) => update("servicesOutsideSA", v)}
                />
                {form.servicesOutsideSA === "yes" && (
                  <div className="space-y-4 pl-4 border-l-2 border-soft-green">
                    <Field
                      label="Countries"
                      value={form.foreignCountries}
                      onChange={(e) => update("foreignCountries", e.target.value)}
                    />
                    <TextAreaField
                      label="Services provided"
                      value={form.foreignServicesProvided}
                      onChange={(e) => update("foreignServicesProvided", e.target.value)}
                    />
                    <Field
                      label="Percentage of total fees earned from foreign work"
                      type="number"
                      min={0}
                      max={100}
                      className="max-w-xs"
                      value={form.foreignFeePercentage}
                      onChange={(e) => update("foreignFeePercentage", e.target.value)}
                    />
                  </div>
                )}

                <YesNoToggle
                  label="Do you conduct any business in North America or undertake work governed by North American or other foreign laws?"
                  value={form.northAmericaBusiness}
                  onChange={(v) => update("northAmericaBusiness", v)}
                />
                {form.northAmericaBusiness === "yes" && (
                  <div className="space-y-5 pl-4 border-l-2 border-soft-green">
                    <Field
                      label="Countries / states involved"
                      value={form.naCountriesStates}
                      onChange={(e) => update("naCountriesStates", e.target.value)}
                    />
                    <Field
                      label="Percentage of fees from this work"
                      type="number"
                      min={0}
                      max={100}
                      className="max-w-xs"
                      value={form.naFeePercentage}
                      onChange={(e) => update("naFeePercentage", e.target.value)}
                    />
                    <YesNoToggle
                      label="Do you have physical offices in these locations?"
                      value={form.naPhysicalOffices}
                      onChange={(v) => update("naPhysicalOffices", v)}
                    />
                    {form.naPhysicalOffices === "yes" && (
                      <>
                        <Field
                          label="Who manages or controls the offices?"
                          value={form.naOfficeManagement}
                          onChange={(e) => update("naOfficeManagement", e.target.value)}
                        />
                        <YesNoToggle
                          label="Is there foreign ownership/shareholding?"
                          value={form.naForeignShareholding}
                          onChange={(v) => update("naForeignShareholding", v)}
                        />
                        {form.naForeignShareholding === "yes" && (
                          <Field
                            label="Foreign shareholding percentage"
                            type="number"
                            min={0}
                            max={100}
                            className="max-w-xs"
                            value={form.naForeignShareholdingPercentage}
                            onChange={(e) => update("naForeignShareholdingPercentage", e.target.value)}
                          />
                        )}
                      </>
                    )}
                    <YesNoToggle
                      label="Do you provide advice relating to the laws of these countries?"
                      value={form.naAdvisesOnLaw}
                      onChange={(v) => update("naAdvisesOnLaw", v)}
                    />
                    {form.naAdvisesOnLaw === "yes" && (
                      <TextAreaField
                        label="Please provide details"
                        value={form.naAdvisesOnLawDetails}
                        onChange={(e) => update("naAdvisesOnLawDetails", e.target.value)}
                      />
                    )}
                    <YesNoToggle
                      label="Does the company or any director, partner or principal own assets in North America?"
                      value={form.naAssetsOwned}
                      onChange={(v) => update("naAssetsOwned", v)}
                    />
                    {form.naAssetsOwned === "yes" && (
                      <TextAreaField
                        label="Please provide details"
                        value={form.naAssetsOwnedDetails}
                        onChange={(e) => update("naAssetsOwnedDetails", e.target.value)}
                      />
                    )}
                  </div>
                )}

                <YesNoToggle
                  label="Is any of your work subject to the jurisdiction of a foreign court?"
                  value={form.foreignJurisdictionWork}
                  onChange={(v) => update("foreignJurisdictionWork", v)}
                />
                {form.foreignJurisdictionWork === "yes" && (
                  <div>
                    <p className="text-sm font-medium text-text-dark mb-3">
                      Add each relevant contract
                    </p>
                    <div className="space-y-3">
                      {form.foreignContracts.map((row, index) => (
                        <div key={index} className="border border-border rounded-xl p-4 relative">
                          {form.foreignContracts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow("foreignContracts", index)}
                              className="absolute top-3 right-3 text-xs font-semibold text-danger hover:underline"
                            >
                              Remove
                            </button>
                          )}
                          <div className="grid sm:grid-cols-2 gap-4 pr-16">
                            <Field
                              label="Country"
                              value={row.country}
                              onChange={(e) => updateRow("foreignContracts", index, "country", e.target.value)}
                            />
                            <Field
                              label="Client"
                              value={row.client}
                              onChange={(e) => updateRow("foreignContracts", index, "client", e.target.value)}
                            />
                            <Field
                              label="Type of contract"
                              value={row.contractType}
                              onChange={(e) =>
                                updateRow("foreignContracts", index, "contractType", e.target.value)
                              }
                            />
                            <Field
                              label="Expected completion date"
                              type="date"
                              value={row.expectedCompletionDate}
                              onChange={(e) =>
                                updateRow("foreignContracts", index, "expectedCompletionDate", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addRow("foreignContracts", { ...emptyForeignContractRow })}
                      className="mt-3 text-sm font-semibold text-green hover:text-green-dark"
                    >
                      + Add another contract
                    </button>
                  </div>
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "changes" && (
            <div>
              <StepHeading
                title="Business changes and supplier commitments"
                description="Any significant changes expected, and any minimum-volume commitments."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Do you expect any significant changes to your business during the next 12 months?"
                  value={form.expectsBusinessChanges}
                  onChange={(v) => update("expectsBusinessChanges", v)}
                />
                {form.expectsBusinessChanges === "yes" && (
                  <TextAreaField
                    label="Describe the expected changes"
                    value={form.businessChangesExpectedDetails}
                    onChange={(e) => update("businessChangesExpectedDetails", e.target.value)}
                  />
                )}

                <YesNoToggle
                  label="Have you made, or will you make, commitments to suppliers relating to minimum sales volumes or sales values?"
                  value={form.supplierCommitments}
                  onChange={(v) => update("supplierCommitments", v)}
                />
                {form.supplierCommitments === "yes" && (
                  <Field
                    label="What percentage of your last 12 months' income does this commitment represent?"
                    type="number"
                    min={0}
                    max={100}
                    className="max-w-xs"
                    value={form.supplierCommitmentPercentage}
                    onChange={(e) => update("supplierCommitmentPercentage", e.target.value)}
                  />
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "continuity" && (
            <div>
              <StepHeading
                title="Business continuity and data protection"
                description="Standby equipment and backup arrangements."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Do you have access to standby equipment if your computers or related equipment fail or are damaged?"
                  value={form.standbyEquipment}
                  onChange={(v) => update("standbyEquipment", v)}
                />
                {form.standbyEquipment === "yes" && (
                  <TextAreaField
                    label="Describe the arrangements"
                    value={form.standbyEquipmentDetails}
                    onChange={(e) => update("standbyEquipmentDetails", e.target.value)}
                  />
                )}

                <YesNoToggle
                  label="Are duplicate copies/backups of computer system records maintained?"
                  value={form.backupsMaintained}
                  onChange={(v) => update("backupsMaintained", v)}
                />
                {form.backupsMaintained === "yes" && (
                  <SelectField
                    label="Who maintains them?"
                    className="max-w-xs"
                    options={backupsMaintainedByOptions}
                    value={form.backupsMaintainedBy}
                    onChange={(e) => update("backupsMaintainedBy", e.target.value)}
                  />
                )}

                <YesNoToggle
                  label="Are backup records stored separately from the original records?"
                  value={form.backupsStoredSeparately}
                  onChange={(v) => update("backupsStoredSeparately", v)}
                />
                {form.backupsStoredSeparately === "yes" && (
                  <TextAreaField
                    label="Describe the backup/storage arrangements"
                    value={form.backupsStorageDetails}
                    onChange={(e) => update("backupsStorageDetails", e.target.value)}
                  />
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "projects" && (
            <div>
              <StepHeading
                title="Previous projects"
                description="Briefly describe typical projects or assignments completed during the past 3 years."
              />
              <div className="mt-6 space-y-4">
                {form.previousProjects.map((row, index) => (
                  <div key={index} className="border border-border rounded-xl p-4 relative">
                    {form.previousProjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow("previousProjects", index)}
                        className="absolute top-3 right-3 text-xs font-semibold text-danger hover:underline"
                      >
                        Remove
                      </button>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4 pr-16">
                      <Field
                        label="Project / assignment"
                        value={row.project}
                        onChange={(e) => updateRow("previousProjects", index, "project", e.target.value)}
                      />
                      <Field
                        label="Client or industry"
                        value={row.clientOrIndustry}
                        onChange={(e) =>
                          updateRow("previousProjects", index, "clientOrIndustry", e.target.value)
                        }
                      />
                      <TextAreaField
                        label="Services provided"
                        rows={2}
                        className="sm:col-span-2"
                        value={row.servicesProvided}
                        onChange={(e) =>
                          updateRow("previousProjects", index, "servicesProvided", e.target.value)
                        }
                      />
                      <Field
                        label="Approximate completion date"
                        type="date"
                        value={row.completionDate}
                        onChange={(e) =>
                          updateRow("previousProjects", index, "completionDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addRow("previousProjects", { ...emptyProjectRow })}
                className="mt-3 text-sm font-semibold text-green hover:text-green-dark"
              >
                + Add another project
              </button>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "legacy" && (
            <div>
              <StepHeading
                title="Legacy systems"
                description="Systems or software that stored the year using only two characters."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Have you ever supplied, installed, maintained or advised on systems or software where the year was stored using only two characters?"
                  value={form.legacyTwoDigitYear}
                  onChange={(v) => update("legacyTwoDigitYear", v)}
                />
                {form.legacyTwoDigitYear === "yes" && (
                  <div className="space-y-4 pl-4 border-l-2 border-soft-green">
                    <TextAreaField
                      label="What action or advice was taken regarding previous contracts?"
                      value={form.legacyPreviousContractsAction}
                      onChange={(e) => update("legacyPreviousContractsAction", e.target.value)}
                    />
                    <TextAreaField
                      label="How were non-compliant contracts in progress handled?"
                      value={form.legacyNonCompliantHandling}
                      onChange={(e) => update("legacyNonCompliantHandling", e.target.value)}
                    />
                    <TextAreaField
                      label="What measures were introduced for future contracts?"
                      value={form.legacyFutureMeasures}
                      onChange={(e) => update("legacyFutureMeasures", e.target.value)}
                    />
                  </div>
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "contractual-liability" && (
            <div>
              <StepHeading
                title="Contractual liability"
                description="Obligations beyond the normal duty of reasonable professional skill and care."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Do you accept contractual responsibilities that go beyond the normal obligation to exercise reasonable professional skill and care?"
                  value={form.extendedContractualLiability}
                  onChange={(v) => update("extendedContractualLiability", v)}
                />
                {form.extendedContractualLiability === "yes" && (
                  <div className="space-y-4 pl-4 border-l-2 border-soft-green">
                    <Field
                      label="What percentage of your income relates to these contracts?"
                      type="number"
                      min={0}
                      max={100}
                      className="max-w-xs"
                      value={form.extendedLiabilityPercentage}
                      onChange={(e) => update("extendedLiabilityPercentage", e.target.value)}
                    />
                    <TextAreaField
                      label="Describe the additional contractual obligations"
                      value={form.extendedLiabilityDescription}
                      onChange={(e) => update("extendedLiabilityDescription", e.target.value)}
                    />
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium text-text-dark">
                        Upload copies of the relevant contracts
                      </span>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => updateUploadedFile("liabilityContracts", e.target.files)}
                        className="text-sm"
                      />
                      <span className="text-xs text-text-secondary">
                        Files aren&apos;t submitted with this form — reply to your confirmation
                        email with the documents attached.
                      </span>
                    </label>
                  </div>
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "claims" && (
            <div>
              <StepHeading
                title="Claims history"
                description="Claims made, and circumstances that could give rise to a claim."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Has any claim ever been made against the business, its directors, partners, members or employees relating to the type of professional services being insured?"
                  value={form.hasClaimsHistory}
                  onChange={(v) => {
                    update("hasClaimsHistory", v);
                    if (v === "no") update("claimsHistory", []);
                    if (v === "yes" && form.claimsHistory.length === 0) addRow("claimsHistory", { ...emptySAClaimRow });
                  }}
                />
                {form.hasClaimsHistory === "yes" && (
                  <div>
                    <div className="space-y-3">
                      {form.claimsHistory.map((row, index) => (
                        <div key={index} className="border border-border rounded-xl p-4 relative">
                          {form.claimsHistory.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow("claimsHistory", index)}
                              className="absolute top-3 right-3 text-xs font-semibold text-danger hover:underline"
                            >
                              Remove
                            </button>
                          )}
                          <div className="grid sm:grid-cols-2 gap-4 pr-16">
                            <Field
                              label="Date"
                              type="date"
                              value={row.date}
                              onChange={(e) => updateRow("claimsHistory", index, "date", e.target.value)}
                            />
                            <Field
                              label="Claimant"
                              value={row.claimant}
                              onChange={(e) => updateRow("claimsHistory", index, "claimant", e.target.value)}
                            />
                            <TextAreaField
                              label="Nature of claim"
                              rows={2}
                              className="sm:col-span-2"
                              value={row.natureOfClaim}
                              onChange={(e) =>
                                updateRow("claimsHistory", index, "natureOfClaim", e.target.value)
                              }
                            />
                            <MoneyField
                              label="Amount claimed (R)"
                              value={row.amountClaimed}
                              onChange={(v) => updateRow("claimsHistory", index, "amountClaimed", v)}
                            />
                            <MoneyField
                              label="Amount paid, if any (R)"
                              value={row.amountPaid}
                              onChange={(v) => updateRow("claimsHistory", index, "amountPaid", v)}
                            />
                            <Field
                              label="Current status"
                              value={row.currentStatus}
                              onChange={(e) =>
                                updateRow("claimsHistory", index, "currentStatus", e.target.value)
                              }
                            />
                            <Field
                              label="Insurer involved"
                              value={row.insurerInvolved}
                              onChange={(e) =>
                                updateRow("claimsHistory", index, "insurerInvolved", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addRow("claimsHistory", { ...emptySAClaimRow })}
                      className="mt-3 text-sm font-semibold text-green hover:text-green-dark"
                    >
                      + Add another claim
                    </button>
                  </div>
                )}

                <YesNoToggle
                  label="Are you aware of any incident, complaint, error, circumstance or situation that could potentially result in a claim?"
                  value={form.awareOfPotentialClaim}
                  onChange={(v) => update("awareOfPotentialClaim", v)}
                />
                {form.awareOfPotentialClaim === "yes" && (
                  <TextAreaField
                    label="Provide full details"
                    value={form.awareOfPotentialClaimDetails}
                    onChange={(e) => update("awareOfPotentialClaimDetails", e.target.value)}
                  />
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "pi-history" && (
            <div>
              <StepHeading
                title="Previous and current Professional Indemnity insurance"
                description="Existing cover, and any prior declines, terms or cancellations."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Have you previously had, or do you currently have, Professional Indemnity insurance?"
                  value={form.hasHadPI}
                  onChange={(v) => update("hasHadPI", v)}
                />
                {form.hasHadPI === "yes" && (
                  <div className="space-y-4 pl-4 border-l-2 border-soft-green">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        label="Broker"
                        value={form.piBroker}
                        onChange={(e) => update("piBroker", e.target.value)}
                      />
                      <Field
                        label="Insurer"
                        value={form.piInsurer}
                        onChange={(e) => update("piInsurer", e.target.value)}
                      />
                      <Field
                        label="Policy expiry date"
                        type="date"
                        value={form.piPolicyExpiryDate}
                        onChange={(e) => update("piPolicyExpiryDate", e.target.value)}
                      />
                      <Field
                        label="Run-off cover expiry date, if applicable"
                        type="date"
                        value={form.piRunOffExpiryDate}
                        onChange={(e) => update("piRunOffExpiryDate", e.target.value)}
                      />
                      <MoneyField
                        label="Limit of indemnity (R)"
                        value={form.piLimitOfIndemnity}
                        onChange={(v) => update("piLimitOfIndemnity", v)}
                      />
                      <MoneyField
                        label="Excess / deductible (R)"
                        value={form.piExcessDeductible}
                        onChange={(v) => update("piExcessDeductible", v)}
                      />
                      <MoneyField
                        label="Premium (R)"
                        value={form.piPremium}
                        onChange={(v) => update("piPremium", v)}
                      />
                    </div>
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium text-text-dark">
                        Upload current or previous policy
                      </span>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => updateUploadedFile("priorPolicy", e.target.files)}
                        className="text-sm"
                      />
                      <span className="text-xs text-text-secondary">
                        Files aren&apos;t submitted with this form — reply to your confirmation
                        email with the document attached.
                      </span>
                    </label>
                  </div>
                )}

                <div className="border-t border-border pt-6 space-y-4">
                  <p className="text-sm font-semibold text-text-dark">Has an insurer ever:</p>
                  <YesNoToggle
                    label="Declined your application or renewal?"
                    value={form.insurerDeclined}
                    onChange={(v) => update("insurerDeclined", v)}
                  />
                  <YesNoToggle
                    label="Charged an increased premium or imposed special terms?"
                    value={form.insurerImposedTerms}
                    onChange={(v) => update("insurerImposedTerms", v)}
                  />
                  <YesNoToggle
                    label="Cancelled your insurance?"
                    value={form.insurerCancelled}
                    onChange={(v) => update("insurerCancelled", v)}
                  />
                  {hasPriorInsuranceIssues && (
                    <TextAreaField
                      label="Please provide details"
                      value={form.priorInsuranceIssuesDetails}
                      onChange={(e) => update("priorInsuranceIssuesDetails", e.target.value)}
                    />
                  )}
                </div>

                <YesNoToggle
                  label="Do you require retroactive cover for work performed before the start of the new policy?"
                  value={form.requiresRetroactiveCover}
                  onChange={(v) => update("requiresRetroactiveCover", v)}
                />
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "financials" && (
            <div>
              <StepHeading
                title="Financial information"
                description="Gross fees / income for the last 5 completed financial years."
              />
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-sm font-medium text-text-dark mb-1.5">
                    Company financial year-end
                  </p>
                  <p className="text-xs text-text-secondary mb-3">
                    Month and year only — the 5 years below are filled in automatically from this.
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-w-xs">
                    <SelectField
                      label="Month"
                      options={financialYearEndMonthOptions}
                      value={financialYearEndParts.month}
                      onChange={(e) =>
                        updateFinancialYearEnd(
                          e.target.value
                            ? `${financialYearEndParts.year || new Date().getFullYear()}-${e.target.value}`
                            : "",
                        )
                      }
                    />
                    <SelectField
                      label="Year"
                      options={financialYearEndYearOptions}
                      value={financialYearEndParts.year}
                      onChange={(e) =>
                        updateFinancialYearEnd(
                          e.target.value ? `${e.target.value}-${financialYearEndParts.month || "01"}` : "",
                        )
                      }
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left text-xs text-text-secondary">
                        <th className="pb-2 font-medium">Financial year end</th>
                        <th className="pb-2 font-medium text-right">Gross fees / income (R)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {form.grossFeesHistory.map((row, index) => (
                        <tr key={index}>
                          <td className="py-2 pr-2 text-text-dark">
                            {row.financialYearEnd ? (
                              formatMonthYear(row.financialYearEnd)
                            ) : (
                              <span className="text-text-secondary">
                                Select a financial year-end above
                              </span>
                            )}
                          </td>
                          <td className="py-2 pl-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatThousands(row.grossFees)}
                              onChange={(e) =>
                                updateRow("grossFeesHistory", index, "grossFees", parseThousands(e.target.value))
                              }
                              className="w-full border border-border rounded-md px-2 py-1.5 bg-warm-bg text-right text-[14px] focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <MoneyField
                  label="Estimated gross fees / income for the next 12 months (R)"
                  className="max-w-xs"
                  value={form.estimatedNextYearFees}
                  onChange={(v) => update("estimatedNextYearFees", v)}
                />
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "cover" && (
            <div>
              <StepHeading
                title="Cover required"
                description="Select one or more limits of indemnity you'd like us to quote, for comparison."
              />
              <div className="mt-6">
                <p className="text-sm font-medium text-text-dark mb-3">Limit of indemnity</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {coverLimitOptions.map((opt) => {
                    const isSelected = form.desiredCoverLimits.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          update(
                            "desiredCoverLimits",
                            isSelected
                              ? form.desiredCoverLimits.filter((v) => v !== opt.value)
                              : [...form.desiredCoverLimits, opt.value],
                          )
                        }
                        className={cn(
                          "border rounded-md px-4 py-3 text-sm font-medium text-left flex items-center gap-2",
                          isSelected
                            ? "border-green bg-soft-green text-green-dark"
                            : "border-border bg-warm-bg text-text-dark",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                            isSelected ? "border-green bg-green text-white" : "border-border",
                          )}
                        >
                          {isSelected ? "✓" : ""}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-pressed={showOtherLimit}
                    onClick={() => {
                      setShowOtherLimit((v) => !v);
                      if (showOtherLimit) update("desiredCoverLimitOther", "");
                    }}
                    className={cn(
                      "border rounded-md px-4 py-3 text-sm font-medium text-left flex items-center gap-2",
                      showOtherLimit
                        ? "border-green bg-soft-green text-green-dark"
                        : "border-border bg-warm-bg text-text-dark",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                        showOtherLimit ? "border-green bg-green text-white" : "border-border",
                      )}
                    >
                      {showOtherLimit ? "✓" : ""}
                    </span>
                    Other
                  </button>
                </div>
                {showOtherLimit && (
                  <MoneyField
                    label="Other amount (R)"
                    className="mt-4 max-w-xs"
                    value={form.desiredCoverLimitOther}
                    onChange={(v) => update("desiredCoverLimitOther", v)}
                  />
                )}
              </div>
              <StepNav
                onBack={back}
                onNext={next}
                nextDisabled={form.desiredCoverLimits.length === 0 && !form.desiredCoverLimitOther}
              />
            </div>
          )}

          {stepId === "declaration" && (
            <div>
              <StepHeading title="Authorised person & submit" />
              <div className="mt-6 space-y-6">
                <div className="text-xs text-text-secondary leading-relaxed bg-warm-bg border border-border rounded-md p-4 space-y-3">
                  <p>
                    <strong className="text-text-dark">Privacy:</strong> In accordance with
                    applicable laws, we may be required to share your personal information with
                    other insurers, industry bodies, credit agencies and service providers to
                    provide insurance services, prevent fraud, assess claims and conduct surveys.
                    By submitting this application, you agree to the processing and sharing of
                    your personal information for these purposes.
                  </p>
                  <p>
                    <strong className="text-text-dark">Declaration:</strong> I/We declare that the
                    statements set out in this proposal, together with any other information
                    supplied, are true and correct, and that I/we have not misstated or suppressed
                    any material facts. I/We agree that this proposal shall form the basis of the
                    contract of insurance and shall be incorporated into it. I/We undertake to
                    notify BackedSure of any change in this information between the date of this
                    application and inception of cover.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Full name"
                    required
                    value={form.declarationName}
                    onChange={(e) => update("declarationName", e.target.value)}
                  />
                  <Field
                    label="Position in the business"
                    required
                    value={form.declarationPosition}
                    onChange={(e) => update("declarationPosition", e.target.value)}
                  />
                  <Field
                    label="Date"
                    type="date"
                    required
                    value={form.declarationDate}
                    onChange={(e) => update("declarationDate", e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-border">
                  <Field
                    label="Email"
                    type="email"
                    required
                    hint="For BackedSure to send confirmation and follow up."
                    value={form.contactEmail}
                    onChange={(e) => update("contactEmail", e.target.value)}
                  />
                  <Field
                    label="Mobile"
                    type="tel"
                    required
                    value={form.contactMobile}
                    onChange={(e) => update("contactMobile", e.target.value)}
                  />
                </div>

                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.declarationAccepted}
                    onChange={(e) => update("declarationAccepted", e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-text-secondary">
                    By typing my name above and checking this box, I confirm this serves as my
                    electronic signature and that I have read and agree to the declaration and
                    privacy statement.
                  </span>
                </label>
              </div>

              {submitError ? <p className="mt-4 text-sm text-danger">{submitError}</p> : null}

              <StepNav
                onBack={back}
                onNext={handleSubmit}
                nextLabel="Submit application"
                submitting={submitting}
                nextDisabled={
                  !form.declarationName ||
                  !form.declarationPosition ||
                  !form.declarationDate ||
                  !form.contactEmail ||
                  !form.contactMobile ||
                  !form.declarationAccepted ||
                  submitting
                }
              />
            </div>
          )}
        </div>

        {step === 0 && (
          <p className="mt-4 text-center text-sm text-text-secondary">
            Not the right form?{" "}
            <Link href="/quote" className="text-green font-semibold hover:text-green-dark">
              Get a quick quote instead
            </Link>
          </p>
        )}
      </div>

      <div className="lg:col-span-4">
        <ProposalProgress
          steps={saProposalSteps}
          currentIndex={step}
          furthestIndex={furthestStep}
          onJump={goTo}
          businessName={form.businessName}
          onReset={reset}
        />
      </div>
    </div>
  );
}
