"use client";

import { useActionState } from "react";
import { saveProfile, type ProfileFormState } from "@/app/dashboard/profile/actions";
import { Button } from "@/components/ui/Button";
import type { DashboardProfile } from "@/lib/dashboard";

const inputClass = "border border-border rounded-md px-3 py-2.5 bg-warm-bg";

export function ProfileForm({ profile }: { profile: DashboardProfile }) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(saveProfile, {
    status: "idle",
  });

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
        <span className="font-medium text-text-dark">Full name</span>
        <input name="fullName" required autoComplete="name" defaultValue={profile.fullName} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-text-dark">Email</span>
        <input value={profile.email} readOnly disabled className={`${inputClass} text-text-secondary`} />
        <span className="text-xs text-text-secondary">This is the address you sign in with.</span>
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-text-dark">Mobile</span>
        <input name="mobile" type="tel" autoComplete="tel" defaultValue={profile.mobile} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
        <span className="font-medium text-text-dark">Business name</span>
        <input name="company" autoComplete="organization" defaultValue={profile.company} className={inputClass} />
      </label>
      <div className="flex items-center gap-4 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {state.message ? (
          <p role="status" className={state.status === "error" ? "text-sm text-danger" : "text-sm text-green"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
