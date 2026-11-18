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
import { formatDate, getClaims } from "@/lib/dashboard";

export const metadata: Metadata = { title: "Claims" };

export default async function DashboardClaimsPage() {
  const claims = await getClaims();

  return (
    <div>
      <DashboardPageHeader
        title="Claims"
        description="Claims you've notified and their status."
        action={claims.length ? <LinkButton href="/claims" size="sm">Report a claim</LinkButton> : null}
      />
      {claims.length ? (
        <Panel title="Notified claims">
          <DataTable
            columns={[
              { label: "Policy" },
              { label: "Description" },
              { label: "Incident date" },
              { label: "Reported" },
              { label: "Status", align: "right" },
            ]}
          >
            {claims.map((c) => (
              <tr key={c.id}>
                <Td className="whitespace-nowrap font-medium">{c.policyNumber}</Td>
                <Td className="max-w-md">
                  <p className="line-clamp-2 text-text-secondary">{c.description}</p>
                </Td>
                <Td className="whitespace-nowrap text-text-secondary">{formatDate(c.incidentDate)}</Td>
                <Td className="whitespace-nowrap text-text-secondary">{formatDate(c.createdAt)}</Td>
                <Td align="right">
                  <StatusBadge tone={c.tone}>{c.status}</StatusBadge>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      ) : (
        <EmptyState
          title="No claims reported"
          description="If you need to report a potential or actual claim, do so as early as possible."
          ctaLabel="Report a Claim"
          ctaHref="/claims"
        />
      )}
    </div>
  );
}
