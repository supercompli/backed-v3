import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth";

// Landing point for the sign-in link emailed by Supabase. Handles both the
// default PKCE link (?code=) and token-hash links (?token_hash=&type=).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : tokenHash && type
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        : { error: new Error("Missing sign-in token") };

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "link");
  loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}
