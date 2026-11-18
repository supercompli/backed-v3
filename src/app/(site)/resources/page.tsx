import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ResourcesList } from "@/components/resources/ResourcesList";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Resource Centre",
  description:
    "Guides on Professional Indemnity, claims, risk management and compliance for South African professionals.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <div className="bg-warm-bg min-h-screen">
      <div className="container-page pt-6 pb-10 md:pt-8">
        <Breadcrumbs items={[{ name: "Resources", path: "/resources" }]} />
        <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary-dark max-w-2xl leading-[1.1]">
          Resource Centre
        </h1>
        <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
          Practical guidance on Professional Indemnity, claims, risk management and compliance.
        </p>
      </div>
      <ResourcesList />
    </div>
  );
}
