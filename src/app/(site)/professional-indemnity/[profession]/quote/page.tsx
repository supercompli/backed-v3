import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { professions, getProfessionBySlug } from "@/data/professions";

export function generateStaticParams() {
  return professions.map((p) => ({ profession: p.slug }));
}

export default async function ProfessionQuoteRedirect({
  params,
}: {
  params: Promise<{ profession: string }>;
}) {
  const { profession: slug } = await params;
  const profession = getProfessionBySlug(slug);
  if (!profession) notFound();
  redirect(`/quote?profession=${profession.slug}`);
}
