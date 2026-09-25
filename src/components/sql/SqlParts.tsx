import { useState } from "react";
import { Copy, Check, Play, Table2 } from "lucide-react";
import type { QueryResult, SqlValue } from "@/lib/sql/sandbox";
import { HARBOURLINE_SCHEMA } from "@/content/sql/schema";

const SHOW_ROWS = 100;

function cell(v: SqlValue) {
  if (v === null) return <span className="italic text-subtle">NULL</span>;
  if (v instanceof Uint8Array) return <span className="text-subtle">[binary]</span>;
  return String(v);
}

export function ResultTable({ result }: { result: QueryResult }) {
  if (!result.columns.length)
    return <p className="mt-3 text-[0.875rem] text-muted">The statement ran and returned no rows.</p>;
  const rows = result.rows.slice(0, SHOW_ROWS);
  return (
    <div className="mt-3">
      <p className="mb-2 text-[0.8125rem] text-muted" aria-live="polite">
        {result.total.toLocaleString("en-GB")} row{result.total === 1 ? "" : "s"}
        {result.total > SHOW_ROWS ? `, showing the first ${SHOW_ROWS}` : ""} · {result.ms} ms
      </p>
      <div className="table-scroll max-h-96">
        <table>
          <thead className="sticky top-0">
            <tr>
              {result.columns.map((c, i) => (
                <th key={i} scope="col" className="font-mono text-[0.8rem]">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, j) => (
                  <td key={j} className={`whitespace-nowrap font-mono text-[0.8rem] ${typeof v === "number" ? "text-right" : ""}`}>
                    {cell(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SchemaPanel() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {HARBOURLINE_SCHEMA.map((t) => (
        <div key={t.table} className="rounded-lg border border-line bg-ivory p-3">
          <p className="font-mono text-[0.85rem] font-semibold text-ink">{t.table}</p>
          <p className="text-[0.75rem] text-muted">{t.description}</p>
          <ul className="mt-2 space-y-0.5">
            {t.columns.map(([name, type, note]) => (
              <li key={name} className="flex flex-wrap gap-x-2 font-mono text-[0.75rem]">
                <span className="text-ink">{name}</span>
                <span className="text-subtle">{type}</span>
                {note && <span className="font-sans text-subtle">· {note}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SchemaToggle() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brass-dark hover:text-brass-deeper">
        <Table2 aria-hidden className="h-4 w-4" />
        {open ? "Hide tables" : "Show tables"}
      </button>
      {open && (
        <div className="mt-3">
          <SchemaPanel />
        </div>
      )}
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard blocked: nothing to do */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.75rem] text-cream/70 hover:bg-cream/10 hover:text-cream"
    >
      {done ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Copy aria-hidden className="h-3.5 w-3.5" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export function RunButton({ onClick, running, label = "Run" }: { onClick: () => void; running: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={running}
      className="inline-flex items-center gap-1.5 rounded-md bg-brass-button px-3 py-1.5 text-[0.8125rem] font-semibold text-on-brass hover:bg-brass-button-hover disabled:opacity-60"
    >
      {running ? <span aria-hidden className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Play aria-hidden className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}
