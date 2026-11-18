import { LinkButton } from "@/components/ui/Button";
import { PI_PRODUCT_SLUG, quoteProductNames } from "@/data/quoteProducts";
import { formatCurrency } from "@/lib/utils";
import type { PIRatingResult, Profession } from "@/types";

export function QuoteResultView({
  result,
  profession,
  products,
}: {
  result: PIRatingResult;
  profession: Profession;
  products: string[];
}) {
  const otherProducts = quoteProductNames(products.filter((p) => p !== PI_PRODUCT_SLUG));

  if (!products.includes(PI_PRODUCT_SLUG)) {
    return <SpecialistQuoteView productNames={otherProducts} profession={profession} />;
  }

  return (
    <div>
      <PIResultView result={result} profession={profession} />
      {otherProducts.length ? (
        <div className="mt-8 rounded-lg border border-border bg-warm-bg p-4 text-sm">
          <p className="font-semibold text-text-dark">Also requested: {otherProducts.join(", ")}</p>
          <p className="mt-1 text-text-secondary leading-relaxed">
            These covers are quoted by a specialist. We&apos;ll email your quotes once
            they&apos;re ready.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function SpecialistQuoteView({
  productNames,
  profession,
}: {
  productNames: string[];
  profession: Profession;
}) {
  return (
    <div>
      <span className="inline-block text-xs font-bold tracking-widest uppercase text-green bg-soft-green rounded-full px-3 py-1">
        Received
      </span>
      <h2 className="mt-4 text-2xl font-bold text-primary-dark">
        Thanks, we&apos;ve got your application.
      </h2>
      <p className="mt-3 text-text-secondary leading-relaxed">
        A BackedSure specialist will prepare quotes for your business based on the details
        you&apos;ve given for {profession.pluralName.toLowerCase()}.
      </p>
      <ul className="mt-5 space-y-2">
        {productNames.map((name) => (
          <li key={name} className="flex gap-3 text-sm text-text-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
            {name}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-text-secondary">
        Quotes are subject to underwriting, policy terms and final acceptance by the insurer.
      </p>
      <div className="mt-6">
        <LinkButton href="/dashboard/applications">Track your application →</LinkButton>
      </div>
    </div>
  );
}

function PIResultView({
  result,
  profession,
}: {
  result: PIRatingResult;
  profession: Profession;
}) {
  if (result.riskClassification === "STANDARD") {
    return (
      <div>
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-green bg-soft-green rounded-full px-3 py-1">
          Standard
        </span>
        <h2 className="mt-4 text-2xl font-bold text-primary-dark">
          Your application looks suitable for online quotation.
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Based on the information you&apos;ve provided, {profession.pluralName.toLowerCase()} like
          yours typically proceed straight to application. Continue to confirm your cover.
        </p>
        {result.premiumEstimate ? (
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <ResultStat label="Estimated premium" value={`${formatCurrency(result.premiumEstimate.monthly)} / month`} />
            <ResultStat label="Cover" value={formatCurrency(result.coverLimit)} />
            <ResultStat label="Indicative excess" value={result.excess ? formatCurrency(result.excess) : "—"} />
          </div>
        ) : null}
        <p className="mt-6 text-xs text-text-secondary">
          Indicative only and subject to underwriting, policy terms and final acceptance.
        </p>
        <div className="mt-6">
          <LinkButton href="/dashboard/applications">Continue →</LinkButton>
        </div>
      </div>
    );
  }

  if (result.riskClassification === "INDICATIVE" && result.premiumEstimate) {
    return (
      <div>
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-green-dark bg-accent/40 rounded-full px-3 py-1">
          Indicative
        </span>
        <h2 className="mt-4 text-2xl font-bold text-primary-dark">
          Your estimated Professional Indemnity premium
        </h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <ResultStat label="Estimated premium" value={`${formatCurrency(result.premiumEstimate.monthly)} / month`} />
          <ResultStat label="Cover" value={formatCurrency(result.coverLimit)} />
          <ResultStat label="Indicative excess" value={result.excess ? formatCurrency(result.excess) : "—"} />
        </div>
        <p className="mt-6 text-sm text-text-secondary leading-relaxed">
          Indicative only and subject to underwriting, policy terms and final acceptance. A
          BackedSure specialist may contact you to confirm final terms.
        </p>
        <div className="mt-6">
          <LinkButton href="/dashboard/applications">Continue Application →</LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary-dark bg-warm-bg border border-border rounded-full px-3 py-1">
        Refer
      </span>
      <h2 className="mt-4 text-2xl font-bold text-primary-dark">
        Your risk requires specialist underwriting.
      </h2>
      <p className="mt-3 text-text-secondary leading-relaxed">
        We&apos;ve received your information and will prepare the appropriate submission for{" "}
        {profession.pluralName.toLowerCase()}.
      </p>
      {result.referralReasons.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {result.referralReasons.map((reason) => (
            <li key={reason} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-6 text-xs text-text-secondary">
        Terms, conditions and exclusions apply. Final acceptance and premium are subject to
        insurer underwriting.
      </p>
      <div className="mt-6">
        <LinkButton href="/dashboard/applications">Continue Application →</LinkButton>
      </div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-warm-bg">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 text-lg font-bold text-primary-dark">{value}</p>
    </div>
  );
}
