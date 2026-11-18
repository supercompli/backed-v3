"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
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
          <input required className="border border-border rounded-md px-3 py-2.5 bg-warm-bg" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-dark">Email</span>
          <input type="email" required className="border border-border rounded-md px-3 py-2.5 bg-warm-bg" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-text-dark">How can we help?</span>
          <textarea required rows={5} className="border border-border rounded-md px-3 py-2.5 bg-warm-bg resize-y" />
        </label>
      </div>
      <div className="mt-6">
        <Button type="submit" size="lg">
          Send message
        </Button>
      </div>
    </form>
  );
}
