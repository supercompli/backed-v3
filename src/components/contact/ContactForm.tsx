"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (!response.ok) {
        throw new Error("Unable to send contact message.");
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        "We couldn't send your message. Please try again or email hello@backedsure.co.za.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-primary-dark">Thanks — we&apos;ll be in touch</h2>
        <p className="mt-3 text-text-secondary">A BackedSure specialist will respond shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-6 md:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Name</span>
          <input
            name="name"
            autoComplete="name"
            required
            className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="border border-border rounded-md px-3 py-2.5 bg-warm-bg"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-text-dark">How can we help?</span>
          <textarea
            name="message"
            required
            rows={5}
            className="border border-border rounded-md px-3 py-2.5 bg-warm-bg resize-y"
          />
        </label>
      </div>
      {submitError ? <p className="mt-4 text-sm text-danger">{submitError}</p> : null}
      <div className="mt-6">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
