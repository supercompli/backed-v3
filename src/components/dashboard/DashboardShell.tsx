"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const icons = {
  overview: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  applications: "M9 5h6M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1zM6 5h12v16H6zM9 11h6M9 15h4",
  policies: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4",
  documents: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  claims: "M12 8v5M12 16.5v.5M10.3 3.9L2.5 17.5A2 2 0 004.2 20.5h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  profile: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
} as const;

const navItems: { label: string; href: string; icon: keyof typeof icons }[] = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Applications", href: "/dashboard/applications", icon: "applications" },
  { label: "Policies", href: "/dashboard/policies", icon: "policies" },
  { label: "Documents", href: "/dashboard/documents", icon: "documents" },
  { label: "Claims", href: "/dashboard/claims", icon: "claims" },
  { label: "Profile", href: "/dashboard/profile", icon: "profile" },
];

function Icon({ name, className }: { name: keyof typeof icons; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-[18px] shrink-0", className)}
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-full bg-white">
        <span className="size-3 rounded-full bg-[#ef233c]" />
      </span>
      <span className="text-sm font-extrabold tracking-tight text-white">BackedSure</span>
    </Link>
  );
}

function initials(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length) return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

export function DashboardShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  // Menus remember the path they were opened on, so navigating closes them.
  const [navOpenOn, setNavOpenOn] = useState<string | null>(null);
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const navOpen = navOpenOn === pathname;
  const menuOpen = menuOpenOn === pathname;
  const setNavOpen = (open: boolean) => setNavOpenOn(open ? pathname : null);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col bg-primary-dark text-white">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-4" aria-label="Dashboard">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/12 text-white"
                      : "text-white/70 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <Icon name={item.icon} className={active ? "text-accent" : undefined} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="m-3 rounded-lg bg-white/8 p-4 text-sm">
        <p className="font-semibold">Need help?</p>
        <p className="mt-1 text-white/70 leading-relaxed">
          Our team is on WhatsApp during business hours.
        </p>
        <a
          href="https://wa.me/27835756352"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex font-semibold text-accent hover:underline"
        >
          Chat with us
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-bg lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">{sidebar}</aside>

      {navOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setNavOpen(false)}
          />
          <div className="relative h-full w-[264px] max-w-[85vw] shadow-xl">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="-ml-2 rounded-md p-2 text-text-dark hover:bg-warm-bg lg:hidden"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <Link
              href="/quote"
              className="hidden sm:inline-flex items-center rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-primary-dark hover:bg-accent-dark"
            >
              New quote
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2.5 rounded-full p-0.5 pr-2 hover:bg-warm-bg"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-soft-green text-xs font-bold text-green">
                  {initials(name, email)}
                </span>
                <span className="hidden text-sm font-medium text-text-dark md:block max-w-[180px] truncate">
                  {name || email}
                </span>
              </button>
              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 rounded-lg border border-border bg-white p-1.5 shadow-lg"
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold text-text-dark">{name || "Signed in"}</p>
                    <p className="truncate text-xs text-text-secondary">{email}</p>
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <Link
                    role="menuitem"
                    href="/dashboard/profile"
                    className="block rounded-md px-3 py-2 text-sm text-text-dark hover:bg-warm-bg"
                  >
                    Profile
                  </Link>
                  <Link
                    role="menuitem"
                    href="/"
                    className="block rounded-md px-3 py-2 text-sm text-text-dark hover:bg-warm-bg"
                  >
                    BackedSure website
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button
                      role="menuitem"
                      type="submit"
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-warm-bg"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
