import Link from "next/link";
import type { Profession } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function QuoteSummary({
  profession,
  productNames,
  businessName,
  businessAddress,
  coverLimit,
  step,
  totalSteps,
  onReset,
}: {
  profession?: Profession;
  productNames: string[];
  businessName: string;
  businessAddress: string;
  coverLimit: string;
  step: number;
  totalSteps: number;
  onReset: () => void;
}) {
  const coverLimitValue = Number(coverLimit) || 0;

  return (
    <div className="space-y-8">
      <div className="lg:sticky lg:top-24 bg-white border border-border rounded-3xl p-6 shadow-md space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-primary-dark border-b border-border pb-3">
            Application Summary
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <p className="text-text-secondary uppercase tracking-widest text-[10px] font-bold">
              Cover requested
            </p>
            <p className="font-extrabold text-text-dark mt-1">
              {productNames.length ? productNames.join(", ") : "Not selected yet"}
            </p>
          </div>

          <div className="flex justify-between items-start pt-2 border-t border-border">
            <span className="text-text-secondary uppercase tracking-widest text-[10px] font-bold">
              Profession
            </span>
            <span className="font-extrabold text-text-dark text-right">
              {profession ? profession.name : "Not selected yet"}
            </span>
          </div>

          <div className="flex justify-between items-start pt-2 border-t border-border">
            <span className="text-text-secondary uppercase tracking-widest text-[10px] font-bold">
              Business
            </span>
            <span className="font-extrabold text-text-dark text-right">
              {businessName || "Not provided yet"}
            </span>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-text-secondary uppercase tracking-widest text-[10px] font-bold">
              Address
            </p>
            <p className="font-extrabold text-text-dark mt-1">
              {businessAddress || "Not provided yet"}
            </p>
          </div>

          <div className="flex justify-between items-start pt-2 border-t border-border">
            <div>
              <p className="font-extrabold text-text-dark">Cover limit</p>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Limit of indemnity
              </p>
            </div>
            <span className="font-extrabold text-text-dark">
              {coverLimitValue
                ? formatCurrency(coverLimitValue, { decimals: 0 })
                : "—"}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-text-secondary font-semibold">
              Underwriting triage
            </span>
            <span className="text-green font-bold">Included</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-text-secondary font-semibold">
              Specialist review
            </span>
            <span className="text-green font-bold">Free</span>
          </div>

          <div className="pt-4 border-t border-border text-[11px] text-text-secondary bg-warm-bg p-3 rounded-xl border border-border">
            <p className="font-extrabold text-text-dark">
              Need help with your application?
            </p>
            <p className="mt-1 leading-relaxed">hello@backedsure.co.za</p>
            <p className="font-bold text-green">
              Mon – Fri, 08:00 – 17:00 SAST
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-between items-center">
          <span className="text-sm font-extrabold text-primary-dark">STEP</span>
          <span className="text-2xl font-black text-green">
            {Math.min(step, totalSteps)}
            <span className="text-sm text-text-secondary font-bold">
              {" "}
              / {totalSteps}
            </span>
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 text-xs font-semibold text-text-secondary">
        <Link href="/" className="hover:text-text-dark transition-colors">
          Return to Homepage
        </Link>
        <span className="text-border font-normal">|</span>
        <button
          type="button"
          onClick={onReset}
          className="hover:text-danger transition-colors"
        >
          Reset &amp; Start Over
        </button>
      </div>
    </div>
  );
}
