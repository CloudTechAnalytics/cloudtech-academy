import { useState } from "react";
import { runQuery, type QueryResult } from "@/lib/sql/sandbox";
import { ResultTable, RunButton, SchemaToggle } from "./SqlParts";

/** A free-form SQL editor with no checking, for projects and exploration. */
export function SqlScratchpad({ initial = "SELECT *\nFROM shipments\nLIMIT 20;" }: { initial?: string }) {
  const [sql, setSql] = useState(initial);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      setResult(await runQuery(sql));
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line-strong bg-paper p-5">
      <SchemaToggle />
      <label htmlFor="scratchpad" className="sr-only">
        SQL editor
      </label>
      <textarea
        id="scratchpad"
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            void run();
          }
        }}
        spellCheck={false}
        rows={8}
        className="sql-editor mt-3"
      />
      <div className="mt-3 flex items-center gap-3">
        <RunButton onClick={() => void run()} running={running} />
        <span className="text-[0.75rem] text-subtle">Ctrl + Enter</span>
      </div>
      <div aria-live="polite">{error && <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-[0.8125rem]">{error}</p>}</div>
      {result && <ResultTable result={result} />}
    </div>
  );
}
