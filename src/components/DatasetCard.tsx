import { Database, Download } from "lucide-react";
import type { DatasetBlock } from "@/content/types";
import { DATASETS, datasetUrl } from "@/content/projects";

/** Download links for a practice dataset, shown inside a lesson. */
export function DatasetCard({ block }: { block: DatasetBlock }) {
  const info = DATASETS.find((d) => d.id === block.dataset);
  if (!info) return null;
  const files = block.files?.length ? block.files : info.files;
  return (
    <aside className="not-prose rounded-xl border border-line-strong bg-paper px-4 py-4">
      <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-brass-dark">
        <Database aria-hidden className="h-4 w-4" /> Practice data
      </p>
      <p className="mt-1.5 font-semibold text-ink">{info.name}</p>
      <p className="mt-0.5 text-[0.9rem] text-muted">{block.note ?? info.description}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {files.map((f) => (
          <li key={f}>
            <a href={datasetUrl(info.id, f)} download className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-ivory px-3 py-1.5 text-[0.8125rem] font-medium text-ink hover:border-ink/40">
              <Download aria-hidden className="h-3.5 w-3.5" /> {f}.csv
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
