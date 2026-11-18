import type { Metadata } from "next";
import { ProfessionsDirectory } from "@/components/profession/ProfessionsDirectory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Professional Indemnity Insurance by Profession",
  description:
    "Browse Professional Indemnity Insurance information by profession and category, from architects to veterinarians.",
  path: "/professions",
});

export default function ProfessionsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container-page pt-6 pb-10 md:pt-8">
        <Breadcrumbs items={[{ name: "Professions", path: "/professions" }]} />
        <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-2xl leading-[1.1]">
          Professional Indemnity Insurance by Profession
        </h1>
        <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
          Find profession-specific Professional Indemnity guidance, cover recommendations and a
          tailored application.
        </p>
      </div>
      <ProfessionsDirectory />
    </div>
  );
}
