"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  professionSelectorList,
  getQuoteProfession,
  coverLimitOptions,
} from "@/data/professions";
import { Button } from "@/components/ui/Button";
import { ProfessionCombobox } from "@/components/ui/ProfessionCombobox";
import { QuestionField } from "@/components/quote/QuestionField";
import { QuoteResultView } from "@/components/quote/QuoteResultView";
import { QuoteSummary } from "@/components/quote/QuoteSummary";
import {
  PI_PRODUCT_SLUG,
  quoteProductNames,
  quoteProducts,
} from "@/data/quoteProducts";
import {
  initialQuoteFormState,
  RISK_FIELD_IDS,
  TOTAL_STEPS,
  stepLabels,
  type QuoteFormState,
} from "@/components/quote/quoteFormTypes";
import type { PIQuoteAnswers, PIRatingResult } from "@/types";
import { cn } from "@/lib/utils";

interface AddressSuggestion {
  id: string;
  label: string;
  placeType: string;
}

export function QuoteEngine({
  initialProducts,
  initialProfessionSlug,
  initialCoverLimit,
}: {
  initialProducts: string[];
  initialProfessionSlug?: string;
  initialCoverLimit?: string;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuoteFormState>({
    ...initialQuoteFormState,
    products: initialProducts,
    professionSlug: initialProfessionSlug ?? "",
    coverLimit: initialCoverLimit ?? initialQuoteFormState.coverLimit,
  });
  const [result, setResult] = useState<PIRatingResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressLookupError, setAddressLookupError] = useState<string | null>(null);
  const [addressLookupConfigured, setAddressLookupConfigured] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState("");

  const profession = form.professionSlug
    ? getQuoteProfession(form.professionSlug)
    : undefined;
  const extraQuestions = useMemo(
    () =>
      profession?.questions.filter((q) => !RISK_FIELD_IDS.includes(q.id)) ?? [],
    [profession],
  );

  useEffect(() => {
    const query = form.businessAddress.trim();

    if (query.length < 3) {
      setAddressSuggestions([]);
      setAddressLookupError(null);
      return;
    }

    if (query === selectedAddress) {
      setAddressSuggestions([]);
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
      } catch (error) {
        if (controller.signal.aborted) return;
        setAddressSuggestions([]);
        setAddressLookupError("Address suggestions are unavailable. You can still type the address manually.");
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [form.businessAddress, selectedAddress]);

  function update<K extends keyof QuoteFormState>(
    key: K,
    value: QuoteFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleProduct(slug: string) {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(slug)
        ? prev.products.filter((s) => s !== slug)
        : [...prev.products, slug],
    }));
  }

  const productNames = quoteProductNames(form.products);
  const includesPI = form.products.includes(PI_PRODUCT_SLUG);

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }
  function reset() {
    setForm({
      ...initialQuoteFormState,
      products: initialProducts,
      professionSlug: initialProfessionSlug ?? "",
      coverLimit: initialCoverLimit ?? initialQuoteFormState.coverLimit,
    });
    setResult(null);
    setSubmitError(null);
    setStep(1);
  }

  async function handleSubmit() {
    if (!profession) return;
    setSubmitting(true);
    setSubmitError(null);

    const answers: PIQuoteAnswers = {
      products: form.products,
      professionSlug: profession.slug,
      businessName: form.businessName,
      businessAddress: form.businessAddress,
      annualTurnover: Number(form.annualTurnover) || 0,
      principals: Number(form.principals) || 0,
      employees: Number(form.employees) || 0,
      yearsInBusiness: Number(form.yearsInBusiness) || 0,
      coverLimit: Number(form.coverLimit) || 0,
      claimsLast5Years: form.claimsLast5Years === "yes",
      knownCircumstances: form.knownCircumstances === "yes",
      worksOutsideSA: form.worksOutsideSA === "yes",
      hasExistingPI: form.hasExistingPI === "yes",
      retroactiveDateRequired: form.retroactiveDateRequired || undefined,
      extra: form.extra,
      contact: {
        fullName: form.fullName.trim(),
        email: form.email,
        mobile: form.mobile,
        consent: form.consent,
      },
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok)
        throw new Error("Unable to process your application right now.");
      const data = (await res.json()) as { result: PIRatingResult };
      setResult(data.result);
      setStep(6);
    } catch {
      setSubmitError(
        "Something went wrong submitting your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          {step < 6 && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span>
                  Step {step} of {TOTAL_STEPS - 1}
                </span>
                <span>{stepLabels[step - 1]}</span>
              </div>
              <div className="h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-green transition-all duration-300"
                  style={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-accent/10 blur-2xl rounded-full pointer-events-none" />
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-primary-dark">
                  Which cover do you need?
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Select all that apply. We&apos;ll use one set of business details for each.
                </p>
                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  {quoteProducts.map((product) => {
                    const selected = form.products.includes(product.slug);
                    return (
                      <label
                        key={product.slug}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors",
                          selected
                            ? "border-green bg-soft-green"
                            : "border-border bg-warm-bg hover:border-green/50",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleProduct(product.slug)}
                          className="mt-1 accent-[#2f6454]"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-text-dark">
                            {product.name}
                          </span>
                          <span className="block text-xs text-text-secondary leading-relaxed">
                            {product.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                <h2 className="mt-10 text-xl font-bold text-primary-dark">
                  What is your profession?
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  This determines the underwriting questions we ask you next.
                </p>
                <div className="mt-6">
                  <label htmlFor="profession-combobox" className="sr-only">
                    Profession
                  </label>
                  <ProfessionCombobox
                    id="profession-combobox"
                    options={professionSelectorList}
                    value={form.professionSlug}
                    onChange={(slug) => update("professionSlug", slug)}
                    placeholder="Start typing your profession…"
                    inputClassName="w-full border border-border rounded-md px-3 py-3 bg-warm-bg text-[15px]"
                  />
                </div>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={next}
                    disabled={!form.professionSlug || form.products.length === 0}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && profession && (
              <div>
                <h2 className="text-xl font-bold text-primary-dark">
                  Tell us about your business
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  {productNames.join(", ")} for {profession.pluralName.toLowerCase()}.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-5">
                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-text-dark">
                      Business / practice name
                    </span>
                    <input
                      value={form.businessName}
                      onChange={(e) => update("businessName", e.target.value)}
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
                    />
                  </label>
                  <div className="relative flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <label htmlFor="business-address" className="font-medium text-text-dark">
                      Business Address
                    </label>
                    <input
                      id="business-address"
                      value={form.businessAddress}
                      onChange={(e) => {
                        setSelectedAddress("");
                        update("businessAddress", e.target.value);
                      }}
                      autoComplete="street-address"
                      placeholder="Start typing your business address"
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
                    />
                    {addressSuggestions.length > 0 ? (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                        {addressSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onClick={() => {
                              update("businessAddress", suggestion.label);
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
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-text-dark">
                      Annual turnover / professional fees (R)
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={form.annualTurnover}
                      onChange={(e) => update("annualTurnover", e.target.value)}
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
                    />
                  </label>
                  {extraQuestions.map((q) => (
                    <div
                      key={q.id}
                      className={q.type === "boolean" ? "sm:col-span-2" : ""}
                    >
                      <QuestionField
                        question={q}
                        value={form.extra[q.id]}
                        onChange={(value) =>
                          update("extra", { ...form.extra, [q.id]: value })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={back}>
                    Back
                  </Button>
                  <Button
                    onClick={next}
                    disabled={
                      !form.businessName ||
                      !form.businessAddress ||
                      !form.annualTurnover
                    }
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-primary-dark">
                  Cover requirements
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Select the limit of indemnity you need.
                </p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {coverLimitOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        update(
                          "coverLimit",
                          opt.value === "other" ? "" : opt.value,
                        )
                      }
                      className={cn(
                        "border rounded-md px-4 py-3 text-sm font-medium text-left",
                        form.coverLimit === opt.value
                          ? "border-green bg-soft-green text-green-dark"
                          : "border-border bg-warm-bg text-text-dark",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {form.coverLimit === "" && (
                  <label className="mt-4 flex flex-col gap-1.5 text-sm max-w-xs">
                    <span className="font-medium text-text-dark">
                      Other amount (R)
                    </span>
                    <input
                      type="number"
                      min={0}
                      onChange={(e) => update("coverLimit", e.target.value)}
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
                    />
                  </label>
                )}
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={back}>
                    Back
                  </Button>
                  <Button onClick={next} disabled={!form.coverLimit}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-primary-dark">
                  Risk questions
                </h2>
                <div className="mt-6 grid gap-5">
                  <YesNoField
                    label="Any claims in the last 5 years?"
                    value={form.claimsLast5Years}
                    onChange={(v) => update("claimsLast5Years", v)}
                  />
                  <YesNoField
                    label="Any known circumstances that may result in a claim?"
                    value={form.knownCircumstances}
                    onChange={(v) => update("knownCircumstances", v)}
                  />
                  <YesNoField
                    label="Do you work outside South Africa?"
                    value={form.worksOutsideSA}
                    onChange={(v) => update("worksOutsideSA", v)}
                  />
                  <YesNoField
                    label="Do you have existing PI insurance?"
                    value={form.hasExistingPI}
                    onChange={(v) => update("hasExistingPI", v)}
                  />
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-text-dark">
                      Required retroactive date (if known)
                    </span>
                    <input
                      value={form.retroactiveDateRequired}
                      onChange={(e) =>
                        update("retroactiveDateRequired", e.target.value)
                      }
                      placeholder="e.g. 2019-01-01"
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
                    />
                  </label>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={back}>
                    Back
                  </Button>
                  <Button
                    onClick={next}
                    disabled={
                      !form.claimsLast5Years ||
                      !form.knownCircumstances ||
                      !form.worksOutsideSA ||
                      !form.hasExistingPI
                    }
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-xl font-bold text-primary-dark">
                  Contact details
                </h2>
                <div className="mt-6 grid sm:grid-cols-2 gap-5">
                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-text-dark">Full name</span>
                    <input
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      autoComplete="name"
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-text-dark">Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-text-dark">Mobile</span>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
                    />
                  </label>
                  <label className="flex items-start gap-3 text-sm sm:col-span-2 mt-2">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-text-secondary">
                      I consent to BackedSure processing my information to
                      provide {includesPI && form.products.length === 1
                        ? "a Professional Indemnity quote"
                        : "the insurance quotes I've requested"} and, where
                      applicable, to contact me about my application.
                    </span>
                  </label>
                </div>
                {submitError ? (
                  <p className="mt-4 text-sm text-danger">{submitError}</p>
                ) : null}
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={back}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !form.fullName.trim() ||
                      !form.email ||
                      !form.consent ||
                      submitting
                    }
                  >
                    {submitting ? "Submitting…" : "See My Result"}
                  </Button>
                </div>
              </div>
            )}

            {step === 6 && result && profession && (
              <QuoteResultView
                result={result}
                profession={profession}
                products={form.products}
              />
            )}
          </div>

          {step === 1 && (
            <p className="mt-4 text-center text-sm text-text-secondary">
              Not sure where to start?{" "}
              <Link
                href="/professions"
                className="text-green font-semibold hover:text-green-dark"
              >
                Browse professions
              </Link>
            </p>
          )}
        </div>

        <div className="lg:col-span-4">
          <QuoteSummary
            profession={profession}
            productNames={productNames}
            businessName={form.businessName}
            businessAddress={form.businessAddress}
            coverLimit={form.coverLimit}
            step={step}
            totalSteps={TOTAL_STEPS - 1}
            onReset={reset}
          />
        </div>
      </div>
    </div>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "" | "yes" | "no";
  onChange: (value: "yes" | "no") => void;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5 text-sm">
      <legend className="font-medium text-text-dark mb-1.5">{label}</legend>
      <div className="flex gap-3">
        {(["yes", "no"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex-1 border rounded-md px-3 py-2.5 text-sm font-medium capitalize transition-colors",
              value === opt
                ? "border-green bg-soft-green text-green-dark"
                : "border-border bg-warm-bg text-text-dark",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
