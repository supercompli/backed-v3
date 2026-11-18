"use client";

import { useState } from "react";
import type { ProfessionFaq } from "@/types";
import { cn } from "@/lib/utils";

export function FaqAccordion({ faqs }: { faqs: ProfessionFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-t border-b border-border">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-semibold text-text-dark">{faq.question}</span>
              <span
                className={cn(
                  "shrink-0 text-xl leading-none text-green transition-transform duration-150",
                  isOpen && "rotate-45",
                )}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen ? (
              <p className="pb-5 text-text-secondary leading-relaxed max-w-3xl">{faq.answer}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
