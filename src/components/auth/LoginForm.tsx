"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm({ next, linkError }: { next: string; linkError?: boolean }) {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    linkError ? "That sign-in link has expired or was already used. Request a new one below." : null,
  );
  const [loading, setLoading] = useState(false);

  async function sendLink(address: string) {
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Customer accounts aren't connected yet in this environment.");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    redirectTo.searchParams.set("next", next);

    const { error: authError } = await supabase!.auth.signInWithOtp({
      email: address,
      options: { emailRedirectTo: redirectTo.toString(), shouldCreateUser: true },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    setSentTo(address);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendLink(email.trim());
  }

  if (sentTo) {
    return (
      <div className="flex flex-col gap-4 text-sm">
        <div className="rounded-md bg-soft-green p-4 text-text-dark">
          <p className="font-semibold">Check your inbox</p>
          <p className="mt-1 text-text-secondary leading-relaxed">
            We&apos;ve emailed a sign-in link to <strong className="text-text-dark">{sentTo}</strong>.
            Click the link on this device to open your dashboard.
          </p>
        </div>
        {error ? <p className="text-danger">{error}</p> : null}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="font-semibold text-green hover:text-green-dark"
          >
            Use a different email
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => sendLink(sentTo)}
            className="font-semibold text-green hover:text-green-dark disabled:opacity-50"
          >
            {loading ? "Sending…" : "Resend link"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-text-dark">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.co.za"
          className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full justify-center">
        {loading ? "Sending link…" : "Email me a sign-in link"}
      </Button>
      <p className="text-xs text-text-secondary leading-relaxed">
        No password needed. Use the email address you gave on your quote or proposal so we can
        show your applications.
      </p>
    </form>
  );
}
