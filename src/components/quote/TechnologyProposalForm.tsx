"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { TechnologyProposalAnswers, TechYearFees } from "@/types";
import { LinkButton } from "@/components/ui/Button";
import {
  Field,
  TextAreaField,
  PercentField,
  PercentTotal,
  YesNoToggle,
  StepHeading,
  StepNav,
} from "@/components/quote/ProposalFields";
import { ProposalProgress } from "@/components/quote/ProposalProgress";
import {
  DRAFT_STORAGE_KEY,
  initialTechnologyProposalAnswers,
  emptyPrincipalRow,
  emptyClaimRow,
  feeActivityCategories,
  endUserApplicationCategories,
  marketCategories,
  coverLimitOptions,
  deductibleOptions,
  proposalSteps,
  TOTAL_STEPS,
} from "@/components/quote/technologyProposalTypes";
import { cn } from "@/lib/utils";

type YearKey = "pastYear" | "currentYear";
type PercentRecordKey = "feesByActivity" | "endUserApplications" | "markets";

function sumPercent(record: Record<string, string>): number {
  return Object.values(record).reduce((sum, v) => sum + (Number(v) || 0), 0);
}

function sumRows(rows: { percentage: string }[]): number {
  return rows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0);
}

function todayISODate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

interface AddressSuggestion {
  id: string;
  label: string;
  placeType: string;
}

export function TechnologyProposalForm() {
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [form, setForm] = useState<TechnologyProposalAnswers>(initialTechnologyProposalAnswers);
  const [hasClaims, setHasClaims] = useState(false);
  const [showOtherLimit, setShowOtherLimit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressLookupError, setAddressLookupError] = useState<string | null>(null);
  const [addressLookupConfigured, setAddressLookupConfigured] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [restoredDraft, setRestoredDraft] = useState(false);
  const hydrated = useRef(false);

  // Restore an in-progress draft on mount. Deferred to a microtask so the
  // restore doesn't set state synchronously within the effect body.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as {
            form: TechnologyProposalAnswers;
            step: number;
            furthestStep: number;
            hasClaims: boolean;
          };
          setForm({ ...initialTechnologyProposalAnswers, ...saved.form });
          setStep(saved.step ?? 0);
          setFurthestStep(saved.furthestStep ?? 0);
          setHasClaims(Boolean(saved.hasClaims));
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

  // Autosave the draft as the user progresses.
  useEffect(() => {
    if (!hydrated.current || submitted) return;
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({ form, step, furthestStep, hasClaims }),
        );
      } catch {
        // Storage unavailable (private browsing, quota) — proceed without autosave.
      }
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [form, step, furthestStep, hasClaims, submitted]);

  // Amazon Location Service address autocomplete for the physical address field.
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

  function update<K extends keyof TechnologyProposalAnswers>(
    key: K,
    value: TechnologyProposalAnswers[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateYearFees(year: YearKey, field: keyof TechnologyProposalAnswers["pastYear"], value: string) {
    setForm((prev) => ({ ...prev, [year]: { ...prev[year], [field]: value } }));
  }

  function updatePercentRecord(key: PercentRecordKey, category: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: { ...prev[key], [category]: value } }));
  }

  function updatePrincipal(index: number, field: keyof TechnologyProposalAnswers["principals"][number], value: string) {
    setForm((prev) => ({
      ...prev,
      principals: prev.principals.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
  }
  function addPrincipal() {
    setForm((prev) => ({ ...prev, principals: [...prev.principals, { ...emptyPrincipalRow }] }));
  }
  function removePrincipal(index: number) {
    setForm((prev) => ({ ...prev, principals: prev.principals.filter((_, i) => i !== index) }));
  }

  function updateClaim(index: number, field: keyof TechnologyProposalAnswers["claimsHistory"][number], value: string) {
    setForm((prev) => ({
      ...prev,
      claimsHistory: prev.claimsHistory.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
  }
  function addClaim() {
    setForm((prev) => ({ ...prev, claimsHistory: [...prev.claimsHistory, { ...emptyClaimRow }] }));
  }
  function removeClaim(index: number) {
    setForm((prev) => ({ ...prev, claimsHistory: prev.claimsHistory.filter((_, i) => i !== index) }));
  }

  function updateActivityRow(index: number, field: "activity" | "percentage", value: string) {
    setForm((prev) => ({
      ...prev,
      activityRevenueSplit: prev.activityRevenueSplit.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    }));
  }
  function addActivityRow() {
    setForm((prev) => ({
      ...prev,
      activityRevenueSplit: [...prev.activityRevenueSplit, { activity: "", percentage: "" }],
    }));
  }
  function removeActivityRow(index: number) {
    setForm((prev) => ({
      ...prev,
      activityRevenueSplit: prev.activityRevenueSplit.filter((_, i) => i !== index),
    }));
  }

  function goTo(index: number) {
    setStep(Math.max(0, Math.min(index, TOTAL_STEPS - 1)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function next() {
    const nextIndex = Math.min(step + 1, TOTAL_STEPS - 1);
    setStep(nextIndex);
    setFurthestStep((f) => Math.max(f, nextIndex));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    goTo(step - 1);
  }

  function reset() {
    setForm({ ...initialTechnologyProposalAnswers, declarationDate: todayISODate() });
    setHasClaims(false);
    setShowOtherLimit(false);
    setStep(0);
    setFurthestStep(0);
    setSubmitted(false);
    setSubmitError(null);
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/proposal/technology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, futureYear }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
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

  const futureYear: TechYearFees = {
    domesticFees: String(Math.round((Number(form.currentYear.domesticFees) || 0) * 1.1)),
    subConsultedFees: String(Math.round((Number(form.currentYear.subConsultedFees) || 0) * 1.1)),
    internationalFees: String(Math.round((Number(form.currentYear.internationalFees) || 0) * 1.1)),
  };
  const futureYearTotal =
    (Number(futureYear.domesticFees) || 0) +
    (Number(futureYear.subConsultedFees) || 0) +
    (Number(futureYear.internationalFees) || 0);

  const stepId = proposalSteps[step].id;
  const feesPercentTotal = sumPercent(form.feesByActivity);
  const appsPercentTotal = sumPercent(form.endUserApplications);
  const marketsPercentTotal = sumPercent(form.markets);
  const revenueSplitTotal = sumRows(form.activityRevenueSplit);

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
          Technology / IT Professional Indemnity proposal and get back to you at{" "}
          <span className="font-semibold text-text-dark">{form.contactEmail}</span> with next
          steps. If you need to attach a standard contract or other supporting documents, reply
          to your confirmation email or send them to{" "}
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
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span className="font-semibold text-text-dark">{proposalSteps[step].label}</span>
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

          {stepId === "company" && (
            <div>
              <StepHeading
                title="Company details"
                description="Tell us about the business applying for cover."
              />
              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                <Field
                  label="Name of Insured"
                  required
                  className="sm:col-span-2"
                  value={form.insuredName}
                  onChange={(e) => update("insuredName", e.target.value)}
                />
                <div className="relative flex flex-col gap-1.5 text-sm sm:col-span-2">
                  <label htmlFor="tech-physical-address" className="font-medium text-text-dark">
                    Physical address<span className="text-danger"> *</span>
                  </label>
                  <input
                    id="tech-physical-address"
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
                  label="Company website"
                  className="sm:col-span-2"
                  placeholder="https://"
                  value={form.companyWebsite}
                  onChange={(e) => update("companyWebsite", e.target.value)}
                />
              </div>
              <StepNav
                onNext={next}
                nextDisabled={!form.insuredName || !form.physicalAddress}
              />
            </div>
          )}

          {stepId === "financials" && (
            <div>
              <StepHeading
                title="Fees & financials"
                description="Total gross income / fees for the current, past and next financial year."
              />
              <div className="mt-6">
                <Field
                  label="Financial year end date"
                  type="month"
                  hint="Your recurring year-end (e.g. February) — this doesn't change year to year."
                  className="max-w-xs"
                  value={form.financialYearEndDate}
                  onChange={(e) => update("financialYearEndDate", e.target.value)}
                />
              </div>
              <div className="mt-6 space-y-8">
                {(
                  [
                    ["pastYear", "Past financial year"],
                    ["currentYear", "Current financial year"],
                  ] as [YearKey, string][]
                ).map(([key, label]) => {
                  const year = form[key];
                  const total =
                    (Number(year.domesticFees) || 0) +
                    (Number(year.subConsultedFees) || 0) +
                    (Number(year.internationalFees) || 0);
                  return (
                    <div key={key} className="border border-border rounded-2xl p-5 bg-warm-bg/50">
                      <h3 className="font-semibold text-text-dark">{label}</h3>
                      <div className="mt-4 flex flex-col gap-4 max-w-sm">
                        <Field
                          label="Domestic fees (R)"
                          type="number"
                          min={0}
                          value={year.domesticFees}
                          onChange={(e) => updateYearFees(key, "domesticFees", e.target.value)}
                        />
                        <Field
                          label="Sub-consulted fees (R)"
                          type="number"
                          min={0}
                          value={year.subConsultedFees}
                          onChange={(e) => updateYearFees(key, "subConsultedFees", e.target.value)}
                        />
                        <Field
                          label="International fees (R)"
                          type="number"
                          min={0}
                          value={year.internationalFees}
                          onChange={(e) => updateYearFees(key, "internationalFees", e.target.value)}
                        />
                        <div className="flex items-baseline justify-between pt-2 border-t border-border">
                          <span className="text-xs font-medium text-text-secondary">
                            Total annual fees
                          </span>
                          <span className="text-lg font-bold text-primary-dark">
                            R{total.toLocaleString("en-ZA")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="border border-dashed border-green/40 rounded-2xl p-5 bg-soft-green/30">
                  <h3 className="font-semibold text-text-dark">
                    Future financial year (estimate)
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary">
                    Automatically estimated as the current year&apos;s fees + 10%.
                  </p>
                  <div className="mt-4 flex flex-col gap-2.5 max-w-sm text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Domestic fees</span>
                      <span className="font-semibold text-text-dark">
                        R{Math.round((Number(form.currentYear.domesticFees) || 0) * 1.1).toLocaleString("en-ZA")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Sub-consulted fees</span>
                      <span className="font-semibold text-text-dark">
                        R{Math.round((Number(form.currentYear.subConsultedFees) || 0) * 1.1).toLocaleString("en-ZA")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">International fees</span>
                      <span className="font-semibold text-text-dark">
                        R{Math.round((Number(form.currentYear.internationalFees) || 0) * 1.1).toLocaleString("en-ZA")}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-2 border-t border-green/30">
                      <span className="text-xs font-medium text-text-secondary">
                        Total annual fees
                      </span>
                      <span className="text-lg font-bold text-primary-dark">
                        R{Math.round(futureYearTotal).toLocaleString("en-ZA")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "structure" && (
            <div>
              <StepHeading
                title="Practice structure"
                description="Ownership, headcount and key people."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Is your company controlled, owned or associated with any other firm, corporation or company?"
                  value={form.controlledByOtherFirm}
                  onChange={(v) => update("controlledByOtherFirm", v)}
                />
                {form.controlledByOtherFirm === "yes" && (
                  <TextAreaField
                    label="Please provide details"
                    value={form.controlledByOtherFirmDetails}
                    onChange={(e) => update("controlledByOtherFirmDetails", e.target.value)}
                  />
                )}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Number of principals, partners, officers and professionals"
                    type="number"
                    min={0}
                    value={form.numPrincipals}
                    onChange={(e) => update("numPrincipals", e.target.value)}
                  />
                  <Field
                    label="Number of non-professional employees"
                    type="number"
                    min={0}
                    value={form.numNonProfessionalEmployees}
                    onChange={(e) => update("numNonProfessionalEmployees", e.target.value)}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-text-dark mb-3">
                    Partners / principals / key employees
                  </p>
                  <div className="space-y-4">
                    {form.principals.map((row, index) => (
                      <div key={index} className="border border-border rounded-xl p-4 relative">
                        {form.principals.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePrincipal(index)}
                            className="absolute top-3 right-3 text-xs font-semibold text-danger hover:underline"
                          >
                            Remove
                          </button>
                        )}
                        <div className="grid sm:grid-cols-2 gap-4 pr-16">
                          <Field
                            label="Name"
                            value={row.name}
                            onChange={(e) => updatePrincipal(index, "name", e.target.value)}
                          />
                          <Field
                            label="Professional qualification"
                            value={row.qualification}
                            onChange={(e) => updatePrincipal(index, "qualification", e.target.value)}
                          />
                          <Field
                            label="Date qualified"
                            type="month"
                            value={row.dateQualified}
                            onChange={(e) => updatePrincipal(index, "dateQualified", e.target.value)}
                          />
                          <Field
                            label="Years as partner/principal in this practice"
                            type="number"
                            min={0}
                            value={row.yearsInPractice}
                            onChange={(e) => updatePrincipal(index, "yearsInPractice", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addPrincipal}
                    className="mt-3 text-sm font-semibold text-green hover:text-green-dark"
                  >
                    + Add another person
                  </button>
                </div>
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "practice" && (
            <div>
              <StepHeading
                title="Contracts & risk management"
                description="Associations, client contracts and subcontracting."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Do you belong to any Professional Associations or Regulatory bodies?"
                  value={form.belongsToAssociation}
                  onChange={(v) => update("belongsToAssociation", v)}
                />
                <YesNoToggle
                  label="Has any membership ever been cancelled, revoked, suspended or declined?"
                  value={form.membershipCancelledSuspended}
                  onChange={(v) => update("membershipCancelledSuspended", v)}
                />
                {form.membershipCancelledSuspended === "yes" && (
                  <TextAreaField
                    label="Please provide details"
                    value={form.membershipCancelledDetails}
                    onChange={(e) => update("membershipCancelledDetails", e.target.value)}
                  />
                )}
                <YesNoToggle
                  label="Do you use a written contract with clients?"
                  value={form.usesWrittenContract}
                  onChange={(v) => update("usesWrittenContract", v)}
                />
                <YesNoToggle
                  label="Do you have Risk Management Procedures in place to help prevent claims?"
                  value={form.hasRiskManagementProcedures}
                  onChange={(v) => update("hasRiskManagementProcedures", v)}
                />
                <Field
                  label="What percentage of your business involves sub-contracting to others?"
                  type="number"
                  min={0}
                  max={100}
                  className="max-w-xs"
                  value={form.subcontractingPercentage}
                  onChange={(e) => update("subcontractingPercentage", e.target.value)}
                />
                <YesNoToggle
                  label="Do you use a written contract with such sub-contractors?"
                  value={form.usesWrittenContractWithSubcontractors}
                  onChange={(v) => update("usesWrittenContractWithSubcontractors", v)}
                />
                <YesNoToggle
                  label="Do you limit your liability under contract?"
                  value={form.limitsLiabilityUnderContract}
                  onChange={(v) => update("limitsLiabilityUnderContract", v)}
                />
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "international" && (
            <div>
              <StepHeading
                title="International exposure"
                description="Work undertaken, or planned, outside South Africa."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Is any work undertaken currently, or planned to be undertaken, outside of South Africa?"
                  value={form.worksOutsideSA}
                  onChange={(v) => update("worksOutsideSA", v)}
                />
                {form.worksOutsideSA === "yes" && (
                  <TextAreaField
                    label="Please provide details"
                    value={form.worksOutsideSADetails}
                    onChange={(e) => update("worksOutsideSADetails", e.target.value)}
                  />
                )}

                {form.worksOutsideSA === "yes" && (
                  <div className="border-t border-border pt-6 space-y-6">
                    <p className="text-xs font-bold tracking-widest text-green uppercase">
                      Jurisdiction
                    </p>
                    <YesNoToggle
                      label="Does the practice undertake any work outside the borders of South Africa?"
                      value={form.undertakesWorkOutsideSA}
                      onChange={(v) => update("undertakesWorkOutsideSA", v)}
                    />
                    {form.undertakesWorkOutsideSA === "yes" && (
                      <TextAreaField
                        label="Please specify"
                        value={form.workOutsideSADetails}
                        onChange={(e) => update("workOutsideSADetails", e.target.value)}
                      />
                    )}
                    <YesNoToggle
                      label="Do you have any offices domiciled outside South Africa?"
                      value={form.officesOutsideSA}
                      onChange={(v) => update("officesOutsideSA", v)}
                    />
                    {form.officesOutsideSA === "yes" && (
                      <TextAreaField
                        label="List any offices established outside SA and their registered jurisdiction"
                        value={form.officesOutsideSAList}
                        onChange={(e) => update("officesOutsideSAList", e.target.value)}
                      />
                    )}
                    <YesNoToggle
                      label="Does your company provide services for clients in Northern America, or any other countries/states governed by their laws?"
                      value={form.northAmericaExposure}
                      onChange={(v) => update("northAmericaExposure", v)}
                    />
                    {form.northAmericaExposure === "yes" && (
                      <div className="space-y-5 pl-4 border-l-2 border-soft-green">
                        <Field
                          label="What percentage of your fees are attributable to these activities?"
                          type="number"
                          min={0}
                          max={100}
                          className="max-w-xs"
                          value={form.northAmericaFeePercentage}
                          onChange={(e) => update("northAmericaFeePercentage", e.target.value)}
                        />
                        <YesNoToggle
                          label="Do you have physical offices in these areas?"
                          value={form.northAmericaPhysicalOffices}
                          onChange={(v) => update("northAmericaPhysicalOffices", v)}
                        />
                        {form.northAmericaPhysicalOffices === "yes" && (
                          <>
                            <Field
                              label="Under whose management and control are these offices?"
                              value={form.northAmericaOfficeManagement}
                              onChange={(e) => update("northAmericaOfficeManagement", e.target.value)}
                            />
                            <YesNoToggle
                              label="Is there any foreign shareholding in these offices?"
                              value={form.northAmericaForeignShareholding}
                              onChange={(v) => update("northAmericaForeignShareholding", v)}
                            />
                            {form.northAmericaForeignShareholding === "yes" && (
                              <Field
                                label="What percentage?"
                                type="number"
                                min={0}
                                max={100}
                                className="max-w-xs"
                                value={form.northAmericaForeignShareholdingPercentage}
                                onChange={(e) =>
                                  update("northAmericaForeignShareholdingPercentage", e.target.value)
                                }
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <YesNoToggle
                      label="Do you give any advice relating to the laws of these countries?"
                      value={form.advisesOnForeignLaw}
                      onChange={(v) => update("advisesOnForeignLaw", v)}
                    />
                    {form.advisesOnForeignLaw === "yes" && (
                      <TextAreaField
                        label="Please specify"
                        value={form.advisesOnForeignLawDetails}
                        onChange={(e) => update("advisesOnForeignLawDetails", e.target.value)}
                      />
                    )}
                  </div>
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "insurance-history" && (
            <div>
              <StepHeading
                title="Insurance & claims history"
                description="Existing cover, prior declines and claims over the last 5 years."
              />
              <div className="mt-6 space-y-6">
                <YesNoToggle
                  label="Do you currently have PI cover in place?"
                  value={form.hasExistingPI}
                  onChange={(v) => update("hasExistingPI", v)}
                />
                {form.hasExistingPI === "yes" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="Name of insurer"
                      value={form.existingPIInsurer}
                      onChange={(e) => update("existingPIInsurer", e.target.value)}
                    />
                    <Field
                      label="Expiry date"
                      type="date"
                      value={form.existingPIExpiryDate}
                      onChange={(e) => update("existingPIExpiryDate", e.target.value)}
                    />
                    <Field
                      label="Limit of indemnity (R)"
                      type="number"
                      min={0}
                      value={form.existingPILimit}
                      onChange={(e) => update("existingPILimit", e.target.value)}
                    />
                    <Field
                      label="Retroactive date"
                      type="date"
                      value={form.existingPIRetroactiveDate}
                      onChange={(e) => update("existingPIRetroactiveDate", e.target.value)}
                    />
                    <Field
                      label="Deductible (R)"
                      type="number"
                      min={0}
                      value={form.existingPIDeductible}
                      onChange={(e) => update("existingPIDeductible", e.target.value)}
                    />
                    <Field
                      label="Premium (R)"
                      type="number"
                      min={0}
                      value={form.existingPIPremium}
                      onChange={(e) => update("existingPIPremium", e.target.value)}
                    />
                  </div>
                )}

                <YesNoToggle
                  label="Has any similar insurance ever been declined or cancelled?"
                  value={form.priorInsuranceDeclinedCancelled}
                  onChange={(v) => update("priorInsuranceDeclinedCancelled", v)}
                />
                {form.priorInsuranceDeclinedCancelled === "yes" && (
                  <TextAreaField
                    label="Please provide details"
                    value={form.priorInsuranceDeclinedDetails}
                    onChange={(e) => update("priorInsuranceDeclinedDetails", e.target.value)}
                  />
                )}

                <YesNoToggle
                  label="Does any person to be insured have knowledge of any act, error or omission that might reasonably be expected to give rise to a claim?"
                  value={form.knowledgeOfPotentialClaim}
                  onChange={(v) => update("knowledgeOfPotentialClaim", v)}
                />
                {form.knowledgeOfPotentialClaim === "yes" && (
                  <TextAreaField
                    label="Please provide details"
                    value={form.knowledgeOfPotentialClaimDetails}
                    onChange={(e) => update("knowledgeOfPotentialClaimDetails", e.target.value)}
                  />
                )}

                <YesNoToggle
                  label="Any claims made against the Company over the last 5 years?"
                  value={hasClaims ? "yes" : ""}
                  onChange={(v) => {
                    setHasClaims(v === "yes");
                    if (v === "no") update("claimsHistory", []);
                    if (v === "yes" && form.claimsHistory.length === 0) addClaim();
                  }}
                />
                {hasClaims && (
                  <div>
                    <div className="space-y-3">
                      {form.claimsHistory.map((row, index) => (
                        <div key={index} className="border border-border rounded-xl p-4 relative">
                          {form.claimsHistory.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeClaim(index)}
                              className="absolute top-3 right-3 text-xs font-semibold text-danger hover:underline"
                            >
                              Remove
                            </button>
                          )}
                          <div className="grid sm:grid-cols-3 gap-4 pr-16">
                            <Field
                              label="Date of claim"
                              type="date"
                              value={row.date}
                              onChange={(e) => updateClaim(index, "date", e.target.value)}
                            />
                            <TextAreaField
                              label="Description"
                              className="sm:col-span-2"
                              rows={2}
                              value={row.description}
                              onChange={(e) => updateClaim(index, "description", e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addClaim}
                      className="mt-3 text-sm font-semibold text-green hover:text-green-dark"
                    >
                      + Add another claim
                    </button>
                  </div>
                )}

                <YesNoToggle
                  label="Is the Company, after enquiry, aware of any circumstances which may give rise to a claim under the proposed insurance?"
                  value={form.awareOfCircumstances}
                  onChange={(v) => update("awareOfCircumstances", v)}
                />
                {form.awareOfCircumstances === "yes" && (
                  <TextAreaField
                    label="Please provide details"
                    value={form.awareOfCircumstancesDetails}
                    onChange={(e) => update("awareOfCircumstancesDetails", e.target.value)}
                  />
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "activities" && (
            <div>
              <StepHeading
                title="Technology activities"
                description="Describe your professional activities and how revenue splits across them."
              />
              <div className="mt-6 space-y-6">
                <TextAreaField
                  label="Please describe in detail the professional activities for which coverage is required"
                  required
                  rows={4}
                  value={form.activitiesDescription}
                  onChange={(e) => update("activitiesDescription", e.target.value)}
                />
                <div>
                  <p className="text-sm font-medium text-text-dark mb-3">
                    Split your business activity by revenue
                  </p>
                  <div className="space-y-3">
                    {form.activityRevenueSplit.map((row, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <Field
                          label={index === 0 ? "Activity" : ""}
                          className="flex-1"
                          value={row.activity}
                          onChange={(e) => updateActivityRow(index, "activity", e.target.value)}
                          placeholder="e.g. Custom software development"
                        />
                        <div className="w-28 shrink-0">
                          <Field
                            label={index === 0 ? "% of income" : ""}
                            type="number"
                            min={0}
                            max={100}
                            value={row.percentage}
                            onChange={(e) => updateActivityRow(index, "percentage", e.target.value)}
                          />
                        </div>
                        {form.activityRevenueSplit.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeActivityRow(index)}
                            className={cn(
                              "text-xs font-semibold text-danger hover:underline shrink-0",
                              index === 0 ? "mt-8" : "mt-2.5",
                            )}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addActivityRow}
                    className="mt-3 text-sm font-semibold text-green hover:text-green-dark"
                  >
                    + Add another activity
                  </button>
                  <PercentTotal total={revenueSplitTotal} />
                </div>
              </div>
              <StepNav onBack={back} onNext={next} nextDisabled={!form.activitiesDescription} />
            </div>
          )}

          {stepId === "activity-breakdown" && (
            <div>
              <StepHeading
                title="Revenue by activity type"
                description="For the fees listed earlier, give the approximate percentage derived from each activity."
              />
              <div className="mt-6 divide-y divide-border">
                {feeActivityCategories.map((category) => (
                  <PercentField
                    key={category}
                    label={category}
                    value={form.feesByActivity[category] ?? ""}
                    onChange={(v) => updatePercentRecord("feesByActivity", category, v)}
                  />
                ))}
                <PercentField
                  label="Other IT"
                  value={form.feesByActivity["Other IT"] ?? ""}
                  onChange={(v) => updatePercentRecord("feesByActivity", "Other IT", v)}
                />
              </div>
              {form.feesByActivity["Other IT"] && (
                <TextAreaField
                  label="Please describe 'Other IT'"
                  className="mt-4"
                  value={form.otherActivityDescription}
                  onChange={(e) => update("otherActivityDescription", e.target.value)}
                />
              )}
              <PercentTotal total={feesPercentTotal} />
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "applications-markets" && (
            <div>
              <StepHeading
                title="End-user applications & markets"
                description="Where your services are ultimately used."
              />
              <div className="mt-6">
                <p className="text-sm font-semibold text-text-dark mb-2">End-user applications</p>
                <div className="divide-y divide-border">
                  {endUserApplicationCategories.map((category) => (
                    <PercentField
                      key={category}
                      label={category}
                      value={form.endUserApplications[category] ?? ""}
                      onChange={(v) => updatePercentRecord("endUserApplications", category, v)}
                    />
                  ))}
                  <PercentField
                    label="Other"
                    value={form.endUserApplications["Other"] ?? ""}
                    onChange={(v) => updatePercentRecord("endUserApplications", "Other", v)}
                  />
                </div>
                {form.endUserApplications["Other"] && (
                  <TextAreaField
                    label="Please describe 'Other'"
                    className="mt-4"
                    value={form.otherEndUserDescription}
                    onChange={(e) => update("otherEndUserDescription", e.target.value)}
                  />
                )}
                <PercentTotal total={appsPercentTotal} />
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-text-dark mb-2">Markets served</p>
                <div className="divide-y divide-border">
                  {marketCategories.map((category) => (
                    <PercentField
                      key={category}
                      label={category}
                      value={form.markets[category] ?? ""}
                      onChange={(v) => updatePercentRecord("markets", category, v)}
                    />
                  ))}
                  <PercentField
                    label="Other"
                    value={form.markets["Other"] ?? ""}
                    onChange={(v) => updatePercentRecord("markets", "Other", v)}
                  />
                </div>
                {form.markets["Other"] && (
                  <TextAreaField
                    label="Please describe 'Other'"
                    className="mt-4"
                    value={form.otherMarketDescription}
                    onChange={(e) => update("otherMarketDescription", e.target.value)}
                  />
                )}
                <PercentTotal total={marketsPercentTotal} />
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "quality" && (
            <div>
              <StepHeading
                title="Risk & quality management"
                description="Your product and service development controls."
              />
              <div className="mt-6 space-y-5">
                <YesNoToggle
                  label="Does your standard contract limit your liability for consequential or indirect losses?"
                  value={form.contractsExcludeConsequentialLoss}
                  onChange={(v) => update("contractsExcludeConsequentialLoss", v)}
                />
                <YesNoToggle
                  label="Is all system work documented and tested?"
                  value={form.systemWorkDocumentedTested}
                  onChange={(v) => update("systemWorkDocumentedTested", v)}
                />
                <YesNoToggle
                  label="Are clients required to sign off on pilot tests prior to regular production?"
                  value={form.clientsSignOffPilotTests}
                  onChange={(v) => update("clientsSignOffPilotTests", v)}
                />
                <YesNoToggle
                  label="Do the clients have responsibility for determining the accuracy of results, in writing?"
                  value={form.clientsResponsibleForAccuracy}
                  onChange={(v) => update("clientsResponsibleForAccuracy", v)}
                />
                <YesNoToggle
                  label="Are the causes of contract delays examined and responded to?"
                  value={form.contractDelaysExamined}
                  onChange={(v) => update("contractDelaysExamined", v)}
                />
                <TextAreaField
                  label="Briefly explain your product/service development methodology"
                  rows={4}
                  value={form.developmentMethodology}
                  onChange={(e) => update("developmentMethodology", e.target.value)}
                />
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "ai" && (
            <div>
              <StepHeading
                title="Artificial intelligence"
                description="Use of Generative AI / Machine Learning in your business."
              />
              <div className="mt-6 space-y-5">
                <YesNoToggle
                  label="Do you make use of any Generative Artificial Intelligence / Machine Learning in your business?"
                  value={form.usesGenerativeAI}
                  onChange={(v) => update("usesGenerativeAI", v)}
                />
                {form.usesGenerativeAI === "yes" && (
                  <div className="space-y-5 pl-4 border-l-2 border-soft-green">
                    <TextAreaField
                      label="Please describe what and how it is used within your business"
                      value={form.aiDescription}
                      onChange={(e) => update("aiDescription", e.target.value)}
                    />
                    <Field
                      label="Who has the authority to use such tools?"
                      value={form.aiAuthorisedUsers}
                      onChange={(e) => update("aiAuthorisedUsers", e.target.value)}
                    />
                    <TextAreaField
                      label="How do you monitor the usage of such tools?"
                      value={form.aiUsageMonitoring}
                      onChange={(e) => update("aiUsageMonitoring", e.target.value)}
                    />
                    <Field
                      label="What percentage of your business is reliant on such tools?"
                      type="number"
                      min={0}
                      max={100}
                      className="max-w-xs"
                      value={form.aiBusinessReliancePercentage}
                      onChange={(e) => update("aiBusinessReliancePercentage", e.target.value)}
                    />
                    <TextAreaField
                      label="How do you check and verify that the output generated makes sense and is reliable?"
                      value={form.aiOutputVerification}
                      onChange={(e) => update("aiOutputVerification", e.target.value)}
                    />
                    <Field
                      label="Who has the final say in utilising such output in your business?"
                      value={form.aiFinalDecisionMaker}
                      onChange={(e) => update("aiFinalDecisionMaker", e.target.value)}
                    />
                  </div>
                )}
              </div>
              <StepNav onBack={back} onNext={next} />
            </div>
          )}

          {stepId === "cover" && (
            <div>
              <StepHeading
                title="Limit of indemnity"
                description="Select one or more amounts you'd like us to quote, for comparison."
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
                  <Field
                    label="Other amount (R)"
                    type="number"
                    min={0}
                    className="mt-4 max-w-xs"
                    value={form.desiredCoverLimitOther}
                    onChange={(e) => update("desiredCoverLimitOther", e.target.value)}
                    autoFocus
                  />
                )}
              </div>
              <div className="mt-8">
                <p className="text-sm font-medium text-text-dark mb-3">Preferred deductible</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {deductibleOptions.map((opt) => {
                    const isFixedMatch = opt.value !== "" && opt.value === form.desiredDeductible;
                    const isOtherActive =
                      opt.value === "" &&
                      !deductibleOptions.some((o) => o.value !== "" && o.value === form.desiredDeductible);
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => update("desiredDeductible", opt.value)}
                        className={cn(
                          "border rounded-md px-4 py-3 text-sm font-medium text-left",
                          isFixedMatch || isOtherActive
                            ? "border-green bg-soft-green text-green-dark"
                            : "border-border bg-warm-bg text-text-dark",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {!deductibleOptions.some((o) => o.value !== "" && o.value === form.desiredDeductible) && (
                  <Field
                    label="Other amount (R)"
                    type="number"
                    min={0}
                    className="mt-4 max-w-xs"
                    value={form.desiredDeductible}
                    onChange={(e) => update("desiredDeductible", e.target.value)}
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
              <StepHeading title="Declaration & submit" />
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
                    label="Full name (duly authorised)"
                    required
                    value={form.declarationName}
                    onChange={(e) => update("declarationName", e.target.value)}
                  />
                  <Field
                    label="Designation"
                    required
                    value={form.declarationDesignation}
                    onChange={(e) => update("declarationDesignation", e.target.value)}
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
                  !form.declarationDesignation ||
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
          steps={proposalSteps}
          currentIndex={step}
          furthestIndex={furthestStep}
          onJump={goTo}
          businessName={form.insuredName}
          onReset={reset}
        />
      </div>
    </div>
  );
}
