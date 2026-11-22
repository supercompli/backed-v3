"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { professions } from "@/data/professions";

const footerProfessions = professions.slice(0, 8);

function MinimalFooter() {
  return (
    <footer className="bg-primary-dark text-white/90">
      <div className="container-page py-10">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <span className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <span className="w-3 h-3 rounded-sm bg-primary-dark" />
          </span>
          <span className="text-lg font-bold text-white">BackedSure</span>
        </Link>

        <p className="text-xs text-white/50 leading-relaxed max-w-4xl">
          BackedSure is a div of Covered Financial Services, an authorised Financial Services
          Provider. FSP number: 54871. Professional Indemnity and related insurance products are
          underwritten by insurers registered with the Prudential Authority. Terms, conditions and
          exclusions apply.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/legal/privacy-policy" className="text-xs text-white/60 hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="text-xs text-white/60 hover:text-accent">
            Terms of Use
          </Link>
          <span className="text-xs text-white/40">
            © {new Date().getFullYear()} BackedSure. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/professional-indemnity-technology-quote") ||
    pathname?.startsWith("/sa-professional-indemnity-technology-quote") ||
    pathname?.startsWith("/quote")
  ) {
    return <MinimalFooter />;
  }

  return (
    <footer className="bg-primary-dark text-white/90">
      <div className="container-page py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
                <span className="w-3 h-3 rounded-sm bg-primary-dark" />
              </span>
              <span className="text-lg font-bold text-white">BackedSure</span>
            </Link>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              Professional Indemnity, simplified. A specialist digital insurance platform for
              South African professionals and professional-service businesses.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Professions
            </p>
            <ul className="space-y-2.5">
              {footerProfessions.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/professional-indemnity/${p.slug}`}
                    className="text-sm text-white/70 hover:text-accent"
                  >
                    {p.pluralName}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/professions" className="text-sm text-accent">
                  View all professions →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Platform
            </p>
            <ul className="space-y-2.5">
              <li><Link href="/professional-indemnity" className="text-sm text-white/70 hover:text-accent">Professional Indemnity</Link></li>
              <li><Link href="/professional-indemnity/cost" className="text-sm text-white/70 hover:text-accent">Cost of PI cover</Link></li>
              <li><Link href="/quote" className="text-sm text-white/70 hover:text-accent">Get a Quote</Link></li>
              <li><Link href="/claims" className="text-sm text-white/70 hover:text-accent">Claims</Link></li>
              <li><Link href="/resources" className="text-sm text-white/70 hover:text-accent">Resources</Link></li>
              <li><Link href="/dashboard" className="text-sm text-white/70 hover:text-accent">Customer Login</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Company
            </p>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-white/70 hover:text-accent">About BackedSure</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-accent">Contact</Link></li>
              <li><Link href="/resources" className="text-sm text-white/70 hover:text-accent">Resource Centre</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-white/50 leading-relaxed max-w-4xl">
            Professional Indemnity and related insurance products are underwritten by insurers registered with the Prudential Authority. Terms, conditions and exclusions apply. Premiums shown on this website are indicative unless expressly
            confirmed as a formal quotation, and final acceptance and premium are subject to
            insurer underwriting.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/legal/privacy-policy" className="text-xs text-white/60 hover:text-accent">Privacy Policy</Link>
            <Link href="/legal/paia" className="text-xs text-white/60 hover:text-accent">PAIA Manual</Link>
            <Link href="/legal/complaints" className="text-xs text-white/60 hover:text-accent">Complaints Process</Link>
            <Link href="/legal/terms" className="text-xs text-white/60 hover:text-accent">Terms of Use</Link>
            <Link href="/legal/conflict-of-interest" className="text-xs text-white/60 hover:text-accent">Conflict of Interest Policy</Link>
            <Link href="/legal/tcf" className="text-xs text-white/60 hover:text-accent">Treating Customers Fairly</Link>
          </div>

          <p className="mt-6 text-xs text-white/40">
            © {new Date().getFullYear()} BackedSure. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
