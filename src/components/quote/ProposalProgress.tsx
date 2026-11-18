import { cn } from "@/lib/utils";
import type { StepDefinition } from "@/components/quote/technologyProposalTypes";

export function ProposalProgress({
  steps,
  currentIndex,
  furthestIndex,
  onJump,
  businessName,
  onReset,
}: {
  steps: StepDefinition[];
  currentIndex: number;
  furthestIndex: number;
  onJump: (index: number) => void;
  businessName: string;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="lg:sticky lg:top-24 bg-white border border-border rounded-3xl p-6 shadow-md space-y-5">
        <div>
          <h3 className="text-base font-extrabold text-primary-dark">
            Technology PI Proposal
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            {businessName || "Your application"}
          </p>
        </div>

        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-green transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <ol className="space-y-1 text-sm">
          {steps.map((step, index) => {
            const isDone = index < furthestIndex;
            const isCurrent = index === currentIndex;
            const isReachable = index <= furthestIndex;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  disabled={!isReachable}
                  onClick={() => onJump(index)}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors",
                    isCurrent
                      ? "bg-soft-green text-green-dark font-semibold"
                      : isReachable
                        ? "text-text-dark hover:bg-warm-bg"
                        : "text-text-secondary/50 cursor-not-allowed",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      isDone
                        ? "bg-green text-white"
                        : isCurrent
                          ? "border-2 border-green text-green-dark"
                          : "border border-border text-text-secondary",
                    )}
                  >
                    {isDone ? "✓" : index + 1}
                  </span>
                  {step.shortLabel}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="pt-4 border-t border-border text-[11px] text-text-secondary bg-warm-bg p-3 rounded-xl">
          <p className="font-extrabold text-text-dark">Need help with this application?</p>
          <p className="mt-1 leading-relaxed">hello@backedsure.co.za</p>
          <p className="font-bold text-green">Mon – Fri, 08:00 – 17:00 SAST</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-text-secondary hover:text-danger transition-colors"
        >
          Reset &amp; start over
        </button>
      </div>
    </div>
  );
}
