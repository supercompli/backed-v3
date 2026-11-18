import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  bg,
  id,
}: {
  children: ReactNode;
  className?: string;
  bg?: "warm" | "white" | "soft-green" | "dark";
  id?: string;
}) {
  const bgClass =
    bg === "white"
      ? "bg-white"
      : bg === "soft-green"
        ? "bg-soft-green"
        : bg === "dark"
          ? "bg-primary-dark text-white"
          : "bg-warm-bg";

  return (
    <section id={id} className={cn(bgClass, "py-16 md:py-24", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-bold tracking-widest uppercase mb-3",
            tone === "light" ? "text-accent" : "text-green",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold tracking-tight",
          tone === "light" ? "text-white" : "text-primary-dark",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed",
            tone === "light" ? "text-white/70" : "text-text-secondary",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
