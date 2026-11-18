import type { Metadata } from "next";
import {
  DashboardPageHeader,
  DataTable,
  EmptyState,
  Panel,
  StatusBadge,
  Td,
} from "@/components/dashboard/DashboardUi";
import { daysUntil, formatDate, getPolicies } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Policies" };

export default async function PoliciesPage() {
  const policies = await getPolicies();

  return (
    <div>
      <DashboardPageHeader title="Policies" description="Active cover, renewal dates and policy details." />
      {policies.length ? (
        <Panel title="Your policies">
          <DataTable
            columns={[
              { label: "Policy number" },
              { label: "Cover limit" },
              { label: "Excess" },
              { label: "Premium" },
              { label: "Renewal" },
              { label: "Status", align: "right" },
            ]}
          >
            {policies.map((p) => {
              const days = daysUntil(p.renewalDate);
              return (
                <tr key={p.id}>
                  <Td>
                    <p className="font-medium">{p.policyNumber}</p>
                    <p className="text-xs text-text-secondary">Since {formatDate(p.inceptionDate)}</p>
                  </Td>
                  <Td className="whitespace-nowrap">{formatCurrency(p.coverLimit)}</Td>
                  <Td className="whitespace-nowrap">{p.excess === null ? "—" : formatCurrency(p.excess)}</Td>
                  <Td className="whitespace-nowrap">{p.premium ?? "—"}</Td>
                  <Td className="whitespace-nowrap">
                    <p>{formatDate(p.renewalDate)}</p>
                    {p.active && days >= 0 && days <= 30 ? (
                      <p className="text-xs font-semibold text-[#7a5410]">Renews in {days} days</p>
                    ) : null}
                  </Td>
                  <Td align="right">
                    <StatusBadge tone={p.tone}>{p.status}</StatusBadge>
                  </Td>
                </tr>
              );
            })}
          </DataTable>
        </Panel>
      ) : (
        <EmptyState
          title="No policies yet"
          description="Once an application is accepted and cover is bound, your policy details and renewal date will appear here."
          ctaLabel="Get a Quote"
          ctaHref="/quote"
        />
      )}
    </div>
  );
}
