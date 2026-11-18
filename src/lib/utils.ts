export function formatCurrency(value: number, options?: { decimals?: number }): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: options?.decimals ?? 0,
    minimumFractionDigits: options?.decimals ?? 0,
  })
    .format(value)
    .replace("ZAR", "R")
    .replace(/ /g, " ");
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function articleFor(word: string): "a" | "an" {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
