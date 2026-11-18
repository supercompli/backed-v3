"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { professions } from "@/data/professions";
import type { ProfessionCategory } from "@/types";
import { cn } from "@/lib/utils";

const categories: ProfessionCategory[] = [
  "Built Environment",
  "Financial Services",
  "Legal",
  "Technology",
  "Property",
  "Healthcare",
  "Consulting",
  "Professional Services",
  "Other",
];

function DirectoryInner() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProfessionCategory | "All">(
    (searchParams.get("category") as ProfessionCategory) || "All",
  );

  const filtered = useMemo(() => {
    return professions.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch =
        search.trim() === "" || p.pluralName.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="container-page pb-20">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search professions..."
          className="flex-1 rounded-md border border-[#dfe6ef] bg-white px-4 py-3 text-[15px] text-[#10172a] outline-none focus:border-[#ef233c]"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setCategory("All")}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold",
            category === "All" ? "bg-[#10172a] text-white border-[#10172a]" : "border-[#dfe6ef] bg-white text-[#10172a]",
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
              "rounded-full border px-4 py-2 text-sm font-semibold",
              category === c ? "bg-[#10172a] text-white border-[#10172a]" : "border-[#dfe6ef] bg-white text-[#10172a]",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/professional-indemnity/${p.slug}`}
            className="group rounded-2xl border border-[#dfe6ef] bg-[#f8fafc] p-6 shadow-[0_3px_8px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
          >
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#ef233c]">{p.category}</p>
            <h2 className="mt-3 text-base font-extrabold text-[#10172a]">{p.pluralName}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#40516a]">{p.shortDescription}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#ef233c]">
              Learn more
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                -&gt;
              </span>
            </span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-text-secondary text-sm col-span-full">
            No professions match your search. Try a different term, or{" "}
            <Link href="/quote" className="font-semibold text-[#ef233c]">
              start a general application
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export function ProfessionsDirectory() {
  return (
    <Suspense fallback={null}>
      <DirectoryInner />
    </Suspense>
  );
}
