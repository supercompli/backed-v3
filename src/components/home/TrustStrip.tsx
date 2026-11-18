import Link from "next/link";
import { quoteHref } from "@/data/quoteProducts";

const productQuotes = [
  {
    title: "Professional Indemnity",
    href: quoteHref("professional-indemnity"),
    icon: (
      <path d="M12 3 4 7l8 4 8-4-8-4Zm-6 7v4a6 6 0 0 0 12 0v-4M8 21h8M12 11v10" />
    ),
  },
  {
    title: "Public Liability",
    href: quoteHref("public-liability"),
    icon: <path d="m7 8 4-4 4 4M11 4v13M5 17h12M8 21h6M16 10l3 3-3 3M5 10l3 3-3 3" />,
  },
  {
    title: "Commercial Crime",
    href: quoteHref("commercial-crime"),
    icon: <path d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6V10Zm6 4v2" />,
  },
  {
    title: "Comprehensive Business",
    href: quoteHref("comprehensive-business"),
    icon: <path d="M8 7V5h8v2M5 8h14v11H5V8Zm0 5h14M10 13v2h4v-2" />,
  },
  {
    title: "Cyber Liability",
    href: quoteHref("cyber-liability"),
    icon: <path d="M12 4v4m0 8v4M6 12H3m18 0h-3M8 8h8v8H8V8Zm-3-3 3 3m8 8 3 3m0-14-3 3M8 16l-3 3" />,
  },
  {
    title: "Directors & Officers",
    href: quoteHref("directors-officers"),
    icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0M4 10h3m10 0h3" />,
  },
];

export function TrustStrip() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-warm-bg py-6">
      <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
      <div className="container-page relative">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {productQuotes.map((product) => (
            <Link
              key={product.title}
              href={product.href}
              className="group flex min-h-[170px] flex-col items-center justify-between rounded-lg border border-border bg-white px-4 py-5 text-center shadow-[0_8px_22px_rgba(22,42,36,0.08)] transition hover:-translate-y-0.5 hover:border-green hover:shadow-[0_14px_30px_rgba(22,42,36,0.12)]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-11 text-green transition-colors group-hover:text-primary-dark"
              >
                {product.icon}
              </svg>
              <h2 className="text-base font-extrabold leading-tight text-primary-dark lg:text-[17px]">
                {product.title}
              </h2>
              <span className="rounded-md bg-accent px-5 py-2.5 text-xs font-extrabold uppercase tracking-wide text-primary-dark transition-colors group-hover:bg-accent-dark">
                Get Quote
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
