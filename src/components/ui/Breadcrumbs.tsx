import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className="text-sm text-text-secondary">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === items.length - 1 ? (
                <span className="text-text-dark font-medium">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-green">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
