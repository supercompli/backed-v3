"use client";

import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";

export function StickyMobileCta() {
  const pathname = usePathname();
  if (pathname?.startsWith("/quote") || pathname?.startsWith("/professional-indemnity-technology-quote"))
    return null;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-border p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      <LinkButton href="/quote" className="w-full justify-center">
        Get a Quote
      </LinkButton>
    </div>
  );
}
