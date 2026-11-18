import type { Metadata } from "next";
import { DashboardPageHeader, DataTable, EmptyState, Panel, Td } from "@/components/dashboard/DashboardUi";
import { formatDate, getDocuments } from "@/lib/dashboard";
import { slugToTitle } from "@/lib/utils";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div>
      <DashboardPageHeader title="Documents" description="Policy wordings, schedules and correspondence." />
      {documents.length ? (
        <Panel title="Your documents">
          <DataTable columns={[{ label: "Document" }, { label: "Type" }, { label: "Added" }, { label: "", align: "right" }]}>
            {documents.map((d) => (
              <tr key={d.id}>
                <Td className="font-medium">{d.fileName}</Td>
                <Td className="text-text-secondary">{slugToTitle(d.documentType)}</Td>
                <Td className="whitespace-nowrap text-text-secondary">{formatDate(d.createdAt)}</Td>
                <Td align="right">
                  {d.url ? (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-green hover:text-green-dark"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-text-secondary">Unavailable</span>
                  )}
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      ) : (
        <EmptyState
          title="No documents yet"
          description="Policy documents will be available here once your application is finalised."
        />
      )}
    </div>
  );
}
