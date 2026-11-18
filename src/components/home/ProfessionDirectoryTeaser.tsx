import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { professions } from "@/data/professions";
import type { ProfessionCategory } from "@/types";

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

export function ProfessionDirectoryTeaser() {
  return (
    <Section bg="white">
      <SectionHeading
        title="Professional Indemnity by category"
        description="Browse the full profession directory to find the closest match to your business."
      />
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const count = professions.filter((p) => p.category === category).length;
          if (count === 0) return null;
          return (
            <Link
              key={category}
              href={`/professions?category=${encodeURIComponent(category)}`}
              className="group rounded-2xl border border-[#dfe6ef] bg-[#f8fafc] p-6 shadow-[0_3px_8px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
            >
              <p className="text-base font-extrabold text-[#10172a]">{category}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#40516a]">
                {count} profession{count === 1 ? "" : "s"}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#ef233c]">
                Learn more
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  -&gt;
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-6">
        <Link href="/professions" className="text-xs font-extrabold uppercase tracking-wide text-[#ef233c] hover:text-[#c8102e]">
          View the full directory -&gt;
        </Link>
      </div>
    </Section>
  );
}
