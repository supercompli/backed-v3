import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getProfile } from "@/lib/dashboard";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const profile = await getProfile();

  return (
    <DashboardShell name={profile.fullName} email={profile.email}>
      {children}
    </DashboardShell>
  );
}
