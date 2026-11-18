import type { Metadata } from "next";
import Link from "next/link";
import {
  DashboardPageHeader,
  DataTable,
  Panel,
  StatCard,
  StatusBadge,
  Td,
} from "@/components/dashboard/DashboardUi";
import {
  daysUntil,
  formatDate,
  getApplications,
  getClaims,
  getPolicies,
  getProfile,
} from "@/lib/dashboard";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const quickActions = [
  { label: "Start a new quote", description: "Get PI cover for another business or profession.", href: "/quote" },
  { label: "Report a claim", description: "Notify us of a claim or circumstance early.", href: "/claims" },
  { label: "Proof of insurance", description: "Request a confirmation letter for a client.", href: "/proof-of-insurance" },
];

export default async function DashboardOverviewPage() {
  const [profile, applications, policies, claims] = await Promise.all([
    getProfile(),
    getApplications(),
    getPolicies(),
    getClaims(),
  ]);

  const firstName = profile.fullName.split(" ")[0];
  const activePolicies = policies.filter((p) => p.active);
  const nextRenewal = activePolicies[0];
  const openClaims = claims.filter((c) => c.open);

  return (
    <div>
      <DashboardPageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description="Your applications, cover and claims in one place."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Applications in progress"
          value={applications.filter((a) => a.inProgress).length}
        />
        <StatCard
          label="Active policies"
          value={activePolicies.length}
          hint={
            activePolicies.length
              ? `${formatCurrency(activePolicies.reduce((sum, p) => sum + p.coverLimit, 0))} total cover`
              : undefined
          }
        />
        <StatCard
          label="Next renewal"
          value={nextRenewal ? formatDate(nextRenewal.renewalDate) : "—"}
          hint={nextRenewal ? `In ${Math.max(daysUntil(nextRenewal.renewalDate), 0)} days` : undefined}
        />
        <StatCard label="Open claims" value={openClaims.length} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <Panel
          title="Recent applications"
          action={
            applications.length ? (
              <Link href="/dashboard/applications" className="text-sm font-semibold text-green hover:text-green-dark">
                View all
              </Link>
            ) : null
          }
        >
          {applications.length ? (
            <DataTable columns={[{ label: "Application" }, { label: "Submitted" }, { label: "Status", align: "right" }]}>
              {applications.slice(0, 5).map((a) => (
                <tr key={a.id}>
                  <Td>
                    <p className="font-medium">{a.business}</p>
                    <p className="text-xs text-text-secondary">{a.title}</p>
                  </Td>
                  <Td className="whitespace-nowrap text-text-secondary">{formatDate(a.createdAt)}</Td>
                  <Td align="right">
                    <StatusBadge tone={a.tone}>{a.status}</StatusBadge>
                  </Td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-text-secondary">
              <p>
                We couldn&apos;t find any quotes for <strong className="text-text-dark">{profile.email}</strong>.
              </p>
              <Link href="/quote" className="mt-3 inline-block font-semibold text-green hover:text-green-dark">
                Get your first quote
              </Link>
            </div>
          )}
        </Panel>

        <Panel title="Quick actions">
          <ul className="divide-y divide-border">
            {quickActions.map((action) => (
              <li key={action.href}>
                <Link href={action.href} className="group flex items-center justify-between gap-3 px-5 py-4 hover:bg-warm-bg">
                  <span>
                    <span className="block text-sm font-semibold text-text-dark">{action.label}</span>
                    <span className="block text-xs text-text-secondary">{action.description}</span>
                  </span>
                  <span aria-hidden="true" className="text-text-secondary group-hover:text-green">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
