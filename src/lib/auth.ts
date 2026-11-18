import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Only allow same-site relative paths as post-login destinations.
export function safeNextPath(next: string | null | undefined, fallback = "/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}

export async function requireUser() {
  // Always render per request, even when Supabase env vars are missing at build.
  await connection();
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return { supabase, user };
}
