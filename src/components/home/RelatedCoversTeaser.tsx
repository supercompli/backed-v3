import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { products } from "@/data/products";

export function RelatedCoversTeaser() {
  return (
    <Section bg="white">
      <SectionHeading
        title="Our Products"
        description="Professional Indemnity is where we start. Depending on your profession, other covers may round out your protection."
      />
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group rounded-2xl border border-[#dfe6ef] bg-[#f8fafc] p-6 shadow-[0_3px_8px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
          >
            <h3 className="text-base font-extrabold text-[#10172a]">{product.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#40516a]">
              {product.shortDescription}
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
