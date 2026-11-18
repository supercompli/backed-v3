import Link from "next/link";
import { getProfessionBySlug } from "@/data/professions";
import { Section, SectionHeading } from "@/components/ui/Section";

const featuredSlugs = [
  "insurance-brokers",
  "architects",
  "engineers",
  "accountants",
  "it-consultants",
  "project-managers",
  "estate-agents",
  "veterinarians",
];

export function PopularProfessions() {
  const featured = featuredSlugs
    .map((slug) => getProfessionBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Section bg="white">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <SectionHeading
          title="Professional Indemnity by profession"
          description="Underwriting questions, cover recommendations and pricing factors differ by profession. Start with yours."
        />
        <Link href="/professions" className="text-xs font-extrabold uppercase tracking-wide text-[#ef233c] hover:text-[#c8102e]">
          View all professions -&gt;
        </Link>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((profession) => (
          <Link
            key={profession.slug}
            href={`/professional-indemnity/${profession.slug}`}
            className="group rounded-2xl border border-[#dfe6ef] bg-[#f8fafc] p-6 shadow-[0_3px_8px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
          >
            <h3 className="text-base font-extrabold text-[#10172a]">{profession.pluralName}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#40516a]">
              {profession.shortDescription}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#ef233c]">
              Learn more
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                -&gt;
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
