"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export interface ProfileFormState {
  status: "idle" | "saved" | "error";
  message?: string;
}

export async function saveProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const { supabase, user } = await requireUser();
  const field = (key: string) => String(formData.get(key) ?? "").trim();

  const fullName = field("fullName");
  if (!fullName) {
    return { status: "error", message: "Please enter your full name." };
  }

  const { error } = await supabase.from("customers").upsert({
    id: user.id,
    email: user.email ?? "",
    full_name: fullName,
    mobile: field("mobile") || null,
    company: field("company") || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { status: "error", message: "We couldn't save your details. Please try again." };
  }

  revalidatePath("/dashboard", "layout");
  return { status: "saved", message: "Your details have been saved." };
}
