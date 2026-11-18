import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClass =
  "border border-border rounded-md px-3 py-2.5 bg-warm-bg text-[15px] text-text-dark focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green";

export function Field({
  label,
  hint,
  className,
  required,
  ...props
}: {
  label: string;
  hint?: string;
  className?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="font-medium text-text-dark">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      <input className={inputClass} {...props} />
      {hint ? <span className="text-xs text-text-secondary">{hint}</span> : null}
    </label>
  );
}

/** Space-grouped thousands for on-screen readability, e.g. "1 000 000". */
export function formatThousands(value: string): string {
  return value !== "" && !Number.isNaN(Number(value)) ? new Intl.NumberFormat("en-ZA").format(Number(value)) : "";
}

/** Strips everything but digits, so formatted display text round-trips back to a plain numeric string. */
export function parseThousands(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** A Rand-amount field that displays space-grouped thousands (e.g. "1 000 000") while storing a plain digit string. */
export function MoneyField({
  label,
  hint,
  className,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  className?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="font-medium text-text-dark">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={formatThousands(value)}
        placeholder={placeholder}
        onChange={(e) => onChange(parseThousands(e.target.value))}
        className={inputClass}
      />
      {hint ? <span className="text-xs text-text-secondary">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  hint,
  className,
  required,
  ...props
}: {
  label: string;
  hint?: string;
  className?: string;
  required?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="font-medium text-text-dark">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      <textarea rows={3} className={cn(inputClass, "resize-y")} {...props} />
      {hint ? <span className="text-xs text-text-secondary">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  hint,
  className,
  required,
  options,
  ...props
}: {
  label: string;
  hint?: string;
  className?: string;
  required?: boolean;
  options: { value: string; label: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="font-medium text-text-dark">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      <select className={inputClass} {...props}>
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint ? <span className="text-xs text-text-secondary">{hint}</span> : null}
    </label>
  );
}

export function PercentField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("flex items-center justify-between gap-3 text-sm py-1.5", className)}>
      <span className="text-text-dark">{label}</span>
      <span className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClass, "w-20 text-right py-1.5")}
        />
        <span className="text-text-secondary">%</span>
      </span>
    </label>
  );
}

export function PercentTotal({ total, label = "Total allocated" }: { total: number; label?: string }) {
  const isComplete = total === 100;
  const isOver = total > 100;
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between rounded-md px-4 py-2.5 text-sm font-semibold border",
        isComplete
          ? "bg-soft-green border-green text-green-dark"
          : isOver
            ? "bg-danger/10 border-danger text-danger"
            : "bg-warm-bg border-border text-text-secondary",
      )}
    >
      <span>{label}</span>
      <span>{total}% {isComplete ? "✓" : "/ 100%"}</span>
    </div>
  );
}

export function YesNoToggle({
  label,
  value,
  onChange,
  required,
}: {
  label: ReactNode;
  value: "" | "yes" | "no";
  onChange: (value: "yes" | "no") => void;
  required?: boolean;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5 text-sm">
      <legend className="font-medium text-text-dark mb-1.5">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </legend>
      <div className="flex gap-3 max-w-xs">
        {(["yes", "no"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex-1 border rounded-md px-3 py-2.5 text-sm font-medium capitalize transition-colors",
              value === opt
                ? "border-green bg-soft-green text-green-dark"
                : "border-border bg-warm-bg text-text-dark hover:border-green/50",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function StepHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary-dark">{title}</h2>
      {description ? <p className="mt-2 text-sm text-text-secondary">{description}</p> : null}
    </div>
  );
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
  backDisabled,
  submitting,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  submitting?: boolean;
}) {
  return (
    <div className="mt-8 flex justify-between">
      {onBack ? (
        <Button variant="outline" onClick={onBack} disabled={backDisabled}>
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={onNext} disabled={nextDisabled}>
        {submitting ? "Submitting…" : nextLabel}
      </Button>
    </div>
  );
}
