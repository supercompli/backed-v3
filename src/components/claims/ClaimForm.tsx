"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ClaimForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.delete("documents");
    const payload = Object.fromEntries(formData.entries());

    try {
      await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-primary-dark">Claim notification received</h2>
        <p className="mt-3 text-text-secondary leading-relaxed max-w-md mx-auto">
          A BackedSure claims specialist will be in touch shortly. Please keep any related
          correspondence and documents available.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-6 md:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Policy number</span>
          <input name="policyNumber" required className="border border-border rounded-md px-3 py-2.5 bg-warm-bg" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Customer name</span>
          <input name="customerName" required className="border border-border rounded-md px-3 py-2.5 bg-warm-bg" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Business</span>
          <input name="business" className="border border-border rounded-md px-3 py-2.5 bg-warm-bg" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Email</span>
          <input type="email" name="email" required className="border border-border rounded-md px-3 py-2.5 bg-warm-bg" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Phone</span>
          <input type="tel" name="phone" required className="border border-border rounded-md px-3 py-2.5 bg-warm-bg" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Date of incident</span>
          <input type="date" name="incidentDate" className="border border-border rounded-md px-3 py-2.5 bg-warm-bg" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-text-dark">Description</span>
          <textarea
            name="description"
            required
            rows={5}
            className="border border-border rounded-md px-3 py-2.5 bg-warm-bg resize-y"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-text-dark">Documents</span>
          <input type="file" name="documents" multiple className="text-sm" />
          <span className="text-xs text-text-secondary">
            Optional at this stage — a claims specialist will confirm what&apos;s required.
          </span>
        </label>
      </div>
      <div className="mt-8">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Claim Notification"}
        </Button>
      </div>
    </form>
  );
}
