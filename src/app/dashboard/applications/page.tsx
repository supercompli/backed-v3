import type { Metadata } from "next";
import {
  DashboardPageHeader,
  DataTable,
  EmptyState,
  Panel,
  StatusBadge,
  Td,
} from "@/components/dashboard/DashboardUi";
import { LinkButton } from "@/components/ui/Button";
import { formatDate, getApplications } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Applications" };

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <div>
      <DashboardPageHeader
        title="Applications"
        description="Quotes and proposals you've submitted, and where each one stands."
        action={applications.length ? <LinkButton href="/quote" size="sm">New quote</LinkButton> : null}
      />
      {applications.length ? (
        <Panel title={`${applications.length} application${applications.length === 1 ? "" : "s"}`}>
          <DataTable
            columns={[
              { label: "Business" },
              { label: "Cover limit" },
              { label: "Estimated premium" },
              { label: "Submitted" },
              { label: "Status", align: "right" },
            ]}
          >
            {applications.map((a) => (
              <tr key={a.id}>
                <Td>
                  <p className="font-medium">{a.business}</p>
                  <p className="text-xs text-text-secondary">{a.title}</p>
                </Td>
                <Td className="whitespace-nowrap">{a.coverLimit ? formatCurrency(a.coverLimit) : "—"}</Td>
                <Td className="whitespace-nowrap">{a.premium ?? "—"}</Td>
                <Td className="whitespace-nowrap text-text-secondary">{formatDate(a.createdAt)}</Td>
                <Td align="right">
                  <StatusBadge tone={a.tone}>{a.status}</StatusBadge>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      ) : (
        <EmptyState
          title="No applications yet"
          description="Start a Professional Indemnity application and it will appear here with its current status."
          ctaLabel="Get a Quote"
          ctaHref="/quote"
        />
      )}
    </div>
  );
}
