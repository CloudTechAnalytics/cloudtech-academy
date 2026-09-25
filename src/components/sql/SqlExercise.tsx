import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CheckCircle2, Eye, Lightbulb, RotateCcw } from "lucide-react";
import type { ExerciseSpec } from "@/content/types";
import { runForCheck, runQuery, resetDatabase, type QueryResult } from "@/lib/sql/sandbox";
import { compareResults } from "@/lib/sql/compare";
import { ResultTable, RunButton, SchemaToggle } from "./SqlParts";

type Feedback = { tone: "success" | "error" | "info"; text: string } | null;

/**
 * A practice exercise: the learner writes SQL, runs it, and it's checked against the model
 * answer by comparing results, so any correct query passes, not only one exact spelling.
 */
export function SqlExercise({
  spec,
  label,
  completed,
  onSolved,
}: {
  spec: ExerciseSpec;
  label: string;
  completed: boolean;
  onSolved: (exerciseId: string) => void;
}) {
  const id = useId();
  const [sql, setSql] = useState(spec.starter ?? "");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(completed);
  const editor = useRef<HTMLTextAreaElement>(null);
  // Saved progress arrives after the first render.
  useEffect(() => {
    if (completed) setSolved(true);
  }, [completed]);

  const run = async () => {
    if (!sql.trim()) {
      setFeedback({ tone: "info", text: "Write a query first." });
      return;
    }
    setRunning(true);
    setFeedback(null);
    try {
      const [mine, expected] = await Promise.all([runForCheck(sql), runForCheck(spec.solution)]);
      setResult({ ...mine, rows: mine.rows.slice(0, 500) });
      setAttempts((a) => a + 1);
      const cmp = compareResults(mine, expected, spec.orderMatters);
      if (cmp.match) {
        setSolved(true);
        setFeedback({ tone: "success", text: "Correct. Your result matches the expected answer." });
        onSolved(spec.id);
      } else setFeedback({ tone: "error", text: cmp.reason });
    } catch (e) {
      setResult(null);
      setAttempts((a) => a + 1);
      setFeedback({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    } finally {
      setRunning(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void run();
    } else if (e.key === "Tab" && !e.shiftKey) {
      // Indent instead of leaving the editor. Escape then Tab moves focus on.
      const el = e.currentTarget;
      if (el.dataset.escaped === "1") return;
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end } = el;
      const next = sql.slice(0, s) + "  " + sql.slice(end);
      setSql(next);
      requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
    } else if (e.key === "Escape") {
      e.currentTarget.dataset.escaped = "1";
    } else {
      e.currentTarget.dataset.escaped = "";
    }
  };

  const toneCls = {
    success: "border-success/40 bg-success-bg text-success",
    error: "border-danger/40 bg-danger/10 text-ink",
    info: "border-line-strong bg-sand text-ink",
  };

  return (
    <section aria-labelledby={`${id}-title`} className="not-prose rounded-2xl border border-line-strong bg-paper p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p id={`${id}-title`} className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-brass-dark">
          {label}
          {spec.required ? "" : " · optional"}
        </p>
        {solved && (
          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-success">
            <CheckCircle2 aria-hidden className="h-4 w-4" /> Completed
          </span>
        )}
      </div>
      <p className="mt-2 text-[1rem] leading-relaxed text-ink">{spec.prompt}</p>

      <div className="mt-4">
        <SchemaToggle />
      </div>

      <label htmlFor={`${id}-editor`} className="sr-only">
        Your SQL
      </label>
      <textarea
        id={`${id}-editor`}
        ref={editor}
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={Math.max(4, sql.split("\n").length + 1)}
        placeholder="Write your SQL here"
        className="sql-editor mt-4"
      />
      <p className="mt-1.5 text-[0.75rem] text-subtle">Ctrl + Enter to run. Tab indents; press Esc then Tab to leave the editor.</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <RunButton onClick={() => void run()} running={running} label="Run and check" />
        {spec.hint && (
          <button type="button" onClick={() => setShowHint((h) => !h)} aria-expanded={showHint} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-sand">
            <Lightbulb aria-hidden className="h-4 w-4 text-brass-dark" /> {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowSolution((s) => !s)}
          aria-expanded={showSolution}
          disabled={attempts === 0 && !solved}
          title={attempts === 0 && !solved ? "Try running a query first" : undefined}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eye aria-hidden className="h-4 w-4 text-brass-dark" /> {showSolution ? "Hide solution" : "View solution"}
        </button>
        <button
          type="button"
          onClick={async () => {
            setSql(spec.starter ?? "");
            setResult(null);
            setFeedback(null);
            await resetDatabase().catch(() => {});
            editor.current?.focus();
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-muted hover:bg-sand"
        >
          <RotateCcw aria-hidden className="h-4 w-4" /> Start over
        </button>
      </div>

      {showHint && spec.hint && <p className="mt-3 rounded-lg bg-sand px-3.5 py-2.5 text-[0.9rem] text-ink">{spec.hint}</p>}
      {showSolution && (
        <div className="mt-3">
          <p className="mb-1.5 text-[0.8125rem] text-muted">One correct answer (yours can differ and still be right):</p>
          <pre className="code-block">
            <code>{formatSql(spec.solution)}</code>
          </pre>
          <button type="button" className="mt-2 text-[0.8125rem] font-semibold text-brass-dark hover:text-brass-deeper" onClick={() => void runQuery(spec.solution).then(setResult)}>
            Run the solution
          </button>
        </div>
      )}

      <div aria-live="polite">
        {feedback && <p className={`mt-4 rounded-lg border px-3.5 py-2.5 text-[0.9rem] ${toneCls[feedback.tone]}`}>{feedback.text}</p>}
      </div>
      {result && <ResultTable result={result} />}
    </section>
  );
}

/** Puts main clauses on their own lines so one-line model answers are readable. */
function formatSql(sql: string) {
  return sql
    .replace(/\s+(FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|JOIN|LEFT JOIN|INNER JOIN|WITH|SELECT)\b/g, "\n$1")
    .replace(/\n(JOIN|LEFT JOIN|INNER JOIN)\b/g, "\n$1")
    .replace(/\)\s*,\s*(\w+ AS \()/g, "),\n$1")
    .trim();
}
