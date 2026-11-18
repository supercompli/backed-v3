import type { ReactNode } from "react";
import { LinkButton } from "@/components/ui/Button";
import type { StatusTone } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

export function DashboardPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-text-secondary">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="bg-white border border-dashed border-border rounded-lg p-10 text-center">
      <h2 className="font-semibold text-text-dark">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {ctaLabel && ctaHref ? (
        <div className="mt-6">
          <LinkButton href={ctaHref}>{ctaLabel}</LinkButton>
        </div>
      ) : null}
    </div>
  );
}

export function DashboardCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <h3 className="font-semibold text-text-dark text-sm">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="bg-white border border-border rounded-lg p-5">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-bold text-primary-dark">{value}</p>
      {hint ? <p className="mt-1 text-xs text-text-secondary">{hint}</p> : null}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-white border border-border rounded-lg">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <h2 className="font-semibold text-text-dark">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-[#f1f2f0] text-text-secondary",
  info: "bg-[#e8eff8] text-[#1f4a7a]",
  success: "bg-soft-green text-green-dark",
  warning: "bg-[#fdf3dc] text-[#7a5410]",
  danger: "bg-[#fbe9e5] text-danger",
};

export function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

export function DataTable({
  columns,
  children,
}: {
  columns: { label: string; align?: "right" }[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
            {columns.map((c) => (
              <th
                key={c.label}
                scope="col"
                className={cn("px-5 py-3 font-semibold whitespace-nowrap", c.align === "right" && "text-right")}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  align,
  className,
}: {
  children: ReactNode;
  align?: "right";
  className?: string;
}) {
  return (
    <td className={cn("px-5 py-3.5 align-top text-text-dark", align === "right" && "text-right", className)}>
      {children}
    </td>
  );
}
