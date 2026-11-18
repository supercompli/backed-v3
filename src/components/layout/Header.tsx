"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "27835756352";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <span className="flex size-8 items-center justify-center rounded-full bg-[#10172a]">
        <span className="size-3 rounded-full bg-[#ef233c]" />
      </span>
      <span className="text-sm font-extrabold tracking-tight text-[#10172a]">
        BackedSure
      </span>
    </Link>
  );
}

function WhatsAppButton({ message }: { message?: string }) {
  const href = message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-[4px] bg-[#25D366] px-4 py-2 text-[13px] font-extrabold text-white transition-colors hover:bg-[#1ebd5a]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.986.579 3.836 1.578 5.392L2 22l4.735-1.548A9.953 9.953 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.2a8.174 8.174 0 0 1-4.168-1.14l-.299-.177-3.096 1.012 1.03-3.02-.194-.31A8.176 8.176 0 0 1 3.8 12c0-4.522 3.679-8.2 8.201-8.2 4.521 0 8.199 3.678 8.199 8.2 0 4.522-3.678 8.2-8.199 8.2z" />
      </svg>
      {"+27 83 575 6352"}
    </a>
  );
}

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Resources", href: "/resources" },
  { label: "Claims", href: "/claims" },
];

const coverLinks = [
  {
    label: "Professional Indemnity",
    href: "/professional-indemnity",
    description: "Core protection for advice, design and service mistakes.",
  },
  {
    label: "PI cost guide",
    href: "/professional-indemnity/cost",
    description: "Understand the factors that shape monthly premiums.",
  },
  {
    label: "Cyber Liability",
    href: "/products/cyber-liability",
    description: "Cover for data breaches, ransomware and network failures.",
  },
  {
    label: "Public Liability",
    href: "/products/public-liability",
    description: "Protection for third-party injury or property damage.",
  },
];

const professionLinks = [
  {
    label: "Architects",
    href: "/professional-indemnity/architects",
    description: "Design liability for built environment professionals.",
  },
  {
    label: "Engineers",
    href: "/professional-indemnity/engineers",
    description: "PI cover for consulting and design engineers.",
  },
  {
    label: "Insurance brokers",
    href: "/professional-indemnity/insurance-brokers",
    description: "FAIS-aligned protection for licensed intermediaries.",
  },
  {
    label: "IT consultants",
    href: "/professional-indemnity/it-consultants",
    description: "Cover for implementation, support and advisory work.",
  },
  {
    label: "View all professions",
    href: "/professions",
    description: "Browse the full profession directory.",
  },
];

const mainMenuItems = [
  { label: "Cover", links: coverLinks },
  { label: "Professions", links: professionLinks },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const closeMenus = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  if (pathname?.startsWith("/sa-professional-indemnity-technology-quote")) {
    return (
      <header className="sticky top-0 z-50 border-b border-[#edf0f4] bg-white/95 backdrop-blur">
        <div className="container-page flex h-14 items-center md:h-16">
          <Logo />
        </div>
      </header>
    );
  }

  if (pathname?.startsWith("/quote") || pathname?.startsWith("/professional-indemnity-technology-quote")) {
    const whatsAppMessage = pathname?.startsWith("/professional-indemnity-technology-quote")
      ? "Hi, I'm completing the Technology & IT Professional Indemnity proposal form and I have a question."
      : undefined;

    return (
      <header className="sticky top-0 z-50 border-b border-[#edf0f4] bg-white/95 backdrop-blur">
        <div className="container-page flex h-14 items-center justify-between gap-6 md:h-16">
          <Logo />
          <WhatsAppButton message={whatsAppMessage} />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#edf0f4] bg-white/95 backdrop-blur">
      <div className="container-page relative flex h-14 items-center justify-between gap-6 md:h-16">
        <Logo />

        <nav className="hidden xl:flex items-center gap-8">
          {mainMenuItems.map((item) => {
            const isOpen = openMenu === item.label;
            const menuId = `main-${item.label.toLowerCase()}-menu`;

            return (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-[#10172a] transition-colors hover:text-[#ef233c] whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef233c]"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                >
                  {item.label}
                  <span
                    className={cn(
                      "mt-[-3px] size-1.5 rotate-45 border-b border-r border-current transition-transform",
                      isOpen && "rotate-[-135deg]",
                    )}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={menuId}
                  className={cn(
                    "absolute left-1/2 top-full pt-5 -translate-x-1/2",
                    "opacity-0 invisible translate-y-1 pointer-events-none transition duration-150",
                    "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto",
                    "group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto",
                    isOpen && "opacity-100 visible translate-y-0 pointer-events-auto",
                  )}
                >
                  <div className="w-[520px] rounded-lg border border-[#e8edf3] bg-white shadow-[0_24px_70px_rgba(16,23,42,0.12)]">
                    <div className="grid grid-cols-2 gap-2 p-5">
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenus}
                          className="group/link block rounded-md p-3 transition-colors hover:bg-[#f6f8fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef233c]"
                        >
                          <span className="flex items-center gap-2 text-sm font-extrabold text-[#10172a]">
                            <span className="size-1.5 rounded-full bg-[#ef233c]" />
                            {link.label}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-[#6b7280]">
                            {link.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-semibold text-[#10172a] transition-colors hover:text-[#ef233c] whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-5 shrink-0">
          <Link
            href="/login"
            className="text-[11px] font-extrabold uppercase tracking-wide text-[#10172a] hover:text-[#ef233c]"
          >
            Login
          </Link>
          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-[4px] bg-[#ef233c] px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#c8102e]"
          >
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="xl:hidden p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className="block w-6 h-0.5 bg-primary-dark mb-1.5" />
          <span className="block w-6 h-0.5 bg-primary-dark mb-1.5" />
          <span className="block w-6 h-0.5 bg-primary-dark" />
        </button>
      </div>

      <div
        className={cn(
          "xl:hidden overflow-hidden border-t border-[#edf0f4] bg-white transition-[max-height] duration-200",
          mobileOpen ? "max-h-[760px]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="container-page flex flex-col py-4">
          <div className="grid gap-5 border-b border-[#edf0f4] pb-4 sm:grid-cols-2">
            {mainMenuItems.map((item) => (
              <div key={item.label}>
                <p className="pb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#7b8494]">
                  {item.label}
                </p>
                {item.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    className="block py-2.5 text-sm font-bold text-[#10172a]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="border-b border-[#edf0f4] py-3">
            <p className="pb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#7b8494]">
              Browse
            </p>
            <Link
              href="/professions"
              onClick={closeMenus}
              className="block py-2.5 text-sm font-extrabold text-[#ef233c]"
            >
              View all professions
            </Link>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className="py-3 text-sm font-bold text-[#10172a] border-b border-[#edf0f4] last:border-b-0"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Link
              href="/login"
              onClick={closeMenus}
              className="rounded-md border border-[#e8edf3] py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-[#10172a]"
            >
              Login
            </Link>
            <Link
              href="/quote"
              onClick={closeMenus}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#ef233c] px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-[#c8102e]"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
