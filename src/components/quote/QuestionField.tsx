import type { ProfessionQuestion } from "@/types";
import { cn } from "@/lib/utils";

export function QuestionField({
  question,
  value,
  onChange,
}: {
  question: ProfessionQuestion;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
}) {
  if (question.type === "boolean") {
    return (
      <fieldset className="flex flex-col gap-1.5 text-sm">
        <legend className="font-medium text-text-dark mb-1.5">
          {question.label}
        </legend>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((opt) => {
            const selected = value === (opt === "yes");
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt === "yes")}
                className={cn(
                  "flex-1 border rounded-md px-3 py-2.5 text-sm font-medium capitalize transition-colors",
                  selected
                    ? "border-green bg-soft-green text-green-dark"
                    : "border-border bg-warm-bg text-text-dark",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {question.helpText ? (
          <p className="text-xs text-text-secondary">{question.helpText}</p>
        ) : null}
      </fieldset>
    );
  }

  if (question.type === "select") {
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-text-dark">{question.label}</span>
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          required={question.required}
          className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
        >
          <option value="">Select</option>
          {question.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  const inputType =
    question.type === "number" ||
    question.type === "currency" ||
    question.type === "percentage"
      ? "number"
      : "text";

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-text-dark">{question.label}</span>
      <input
        type={inputType}
        value={
          typeof value === "string" || typeof value === "number" ? value : ""
        }
        onChange={(e) =>
          onChange(
            inputType === "number"
              ? e.target.valueAsNumber || 0
              : e.target.value,
          )
        }
        required={question.required}
        min={inputType === "number" ? 0 : undefined}
        max={question.type === "percentage" ? 100 : undefined}
        className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
      />
      {question.helpText ? (
        <p className="text-xs text-text-secondary">{question.helpText}</p>
      ) : null}
    </label>
  );
}
