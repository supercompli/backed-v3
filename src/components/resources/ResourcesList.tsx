"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { resources, type ResourceCategory } from "@/data/resources";
import { cn } from "@/lib/utils";

const categories: ResourceCategory[] = [
  "Professional Indemnity",
  "Profession Guides",
  "Claims",
  "Risk Management",
  "Cyber",
  "Compliance",
  "Insurance Guides",
];

export function ResourcesList() {
  const [category, setCategory] = useState<ResourceCategory | "All">("All");

  const filtered = useMemo(
    () => resources.filter((r) => category === "All" || r.category === category),
    [category],
  );

  return (
    <div className="container-page pb-20">
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setCategory("All")}
          className={cn(
            "text-sm px-4 py-2 rounded-full border",
            category === "All" ? "bg-primary-dark text-white border-primary-dark" : "border-border bg-white text-text-dark",
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "text-sm px-4 py-2 rounded-full border",
              category === c ? "bg-primary-dark text-white border-primary-dark" : "border-border bg-white text-text-dark",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Link
            key={r.slug}
            href={`/resources/${r.slug}`}
            className="bg-white border border-border rounded-lg p-6 hover:border-green transition-colors"
          >
            <p className="text-xs font-bold tracking-widest text-green uppercase">{r.category}</p>
            <h2 className="mt-3 font-semibold text-text-dark leading-snug">{r.title}</h2>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">{r.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
