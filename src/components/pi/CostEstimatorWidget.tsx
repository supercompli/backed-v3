"use client";

import { useState } from "react";
import Link from "next/link";
import { professionSelectorList, getQuoteProfession, coverLimitOptions } from "@/data/professions";
import { Button, LinkButton } from "@/components/ui/Button";
import { ProfessionCombobox } from "@/components/ui/ProfessionCombobox";

export function CostEstimatorWidget({
  defaultCoverLimit = "1000000",
}: {
  defaultCoverLimit?: string;
}) {
  const [professionSlug, setProfessionSlug] = useState("");
  const [turnover, setTurnover] = useState("");
  const [coverLimit, setCoverLimit] = useState(defaultCoverLimit);
  const [hasClaims, setHasClaims] = useState<"yes" | "no" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const profession = professionSlug ? getQuoteProfession(professionSlug) : undefined;
  const eligibleForOnline =
    profession?.ratingEligibility === "rated" &&
    hasClaims === "no" &&
    Number(turnover || 0) > 0 &&
    Number(turnover) <= 5_000_000;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-white border border-border rounded-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-primary-dark">Estimate your PI requirements</h2>
      <form onSubmit={handleSubmit} className="mt-6 grid sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Profession</span>
          <ProfessionCombobox
            options={professionSelectorList}
            value={professionSlug}
            onChange={(slug) => {
              setProfessionSlug(slug);
              setSubmitted(false);
            }}
            placeholder="Start typing your profession…"
            inputClassName="border border-border rounded-md px-3 py-2.5 bg-warm-bg w-full"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Annual turnover (R)</span>
          <input
            required
            type="number"
            min={0}
            value={turnover}
            onChange={(e) => {
              setTurnover(e.target.value);
              setSubmitted(false);
            }}
            className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
            placeholder="e.g. 1500000"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Required cover</span>
          <select
            value={coverLimit}
            onChange={(e) => {
              setCoverLimit(e.target.value);
              setSubmitted(false);
            }}
            className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
          >
            {coverLimitOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="flex flex-col gap-1.5 text-sm">
          <legend className="font-medium text-text-dark mb-1.5">Any claims in the last 5 years?</legend>
          <div className="flex gap-3">
            {(["no", "yes"] as const).map((val) => (
              <label key={val} className="flex items-center gap-2 border border-border rounded-md px-3 py-2.5 flex-1 cursor-pointer bg-warm-bg">
                <input
                  type="radio"
                  name="claims"
                  value={val}
                  checked={hasClaims === val}
                  onChange={() => {
                    setHasClaims(val);
                    setSubmitted(false);
                  }}
                />
                <span className="capitalize">{val}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2 mt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={!professionSlug || !turnover || !hasClaims}
          >
            Check My Quote Options
          </Button>
        </div>
      </form>

      {submitted && (
        <div className="mt-6 border-t border-border pt-6">
          {eligibleForOnline ? (
            <div>
              <p className="text-text-dark font-semibold">
                Based on your information, you may be eligible for an online quotation.
              </p>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Continue to our full quote engine to confirm your indicative premium and cover
                details.
              </p>
              <div className="mt-4">
                <LinkButton href={`/quote?profession=${professionSlug}`}>Continue to Quote →</LinkButton>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-text-dark font-semibold">
                Based on your information, we&apos;ll need a few additional details before providing an
                accurate premium.
              </p>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                This is common for higher-risk profiles, larger businesses or where claims history
                needs review. A BackedSure specialist will prepare the appropriate submission.
              </p>
              <div className="mt-4">
                <LinkButton href={`/quote?profession=${professionSlug || ""}`}>
                  Start Full Application →
                </LinkButton>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-xs text-text-secondary">
        This tool provides an eligibility indication only, not a quotation.{" "}
        <Link href="/professional-indemnity/cost" className="underline">
          Learn what affects PI pricing.
        </Link>
      </p>
    </div>
  );
}
