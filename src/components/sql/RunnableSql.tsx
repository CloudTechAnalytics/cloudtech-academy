import { useState } from "react";
import { runQuery, type QueryResult } from "@/lib/sql/sandbox";
import { CopyButton, ResultTable, RunButton } from "./SqlParts";

/** A worked example: the query, a Run button, and its result. */
export function RunnableSql({ sql }: { sql: string }) {
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      setResult(await runQuery(sql));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="not-prose">
      <div className="overflow-hidden rounded-xl" style={{ background: "var(--color-code-bg)" }}>
        <div className="flex items-center justify-between gap-2 border-b border-cream/10 px-3 py-2">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-brass-light">SQL example</span>
          <div className="flex items-center gap-1.5">
            <CopyButton text={sql} />
            <RunButton onClick={run} running={running} />
          </div>
        </div>
        <pre className="code-block rounded-none">
          <code>{sql}</code>
        </pre>
      </div>
      {error && <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-[0.8125rem] text-danger">{error}</p>}
      {result && <ResultTable result={result} />}
    </div>
  );
}
