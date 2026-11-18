import type { Metadata } from "next";
import { DashboardPageHeader, Panel } from "@/components/dashboard/DashboardUi";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { getProfile } from "@/lib/dashboard";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <DashboardPageHeader title="Profile" description="Your account and contact details." />
      <div className="max-w-2xl">
        <Panel title="Contact details">
          <div className="p-5">
            <ProfileForm profile={profile} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
