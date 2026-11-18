import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Log in to your BackedSure account.",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : null);

  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (user) redirect(next);

  return (
    <div className="bg-warm-bg min-h-[70vh] flex items-center">
      <div className="container-page py-16">
        <div className="max-w-sm mx-auto bg-white border border-border rounded-lg p-8">
          <h1 className="text-xl font-bold text-primary-dark">Log in to BackedSure</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Access your applications, policies and documents.
          </p>
          <div className="mt-6">
            <LoginForm next={next} linkError={params.error === "link"} />
          </div>
          <p className="mt-6 text-center text-sm text-text-secondary">
            New to BackedSure?{" "}
            <Link href="/quote" className="text-green font-semibold hover:text-green-dark">
              Start a quote
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
