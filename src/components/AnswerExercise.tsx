import { useEffect, useId, useState, type ReactNode } from "react";
import { CheckCircle2, Download, Eye, Lightbulb } from "lucide-react";
import type { AnswerSpec } from "@/content/types";
import { checkAnswer, formatAnswer } from "@/lib/answers";
import { datasetUrl } from "@/content/projects";

type Feedback = { tone: "success" | "error" | "info"; text: string } | null;

/**
 * A practice task done in Excel, Google Sheets, Power BI or by hand. The learner types
 * the result and it's checked here; numbers can be typed with ₦, commas or %.
 */
export function AnswerExercise({
  spec,
  prompt,
  label,
  completed,
  onSolved,
}: {
  spec: AnswerSpec;
  /** The prompt rendered from Markdown. */
  prompt: ReactNode;
  label: string;
  completed: boolean;
  onSolved: (exerciseId: string) => void;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [solved, setSolved] = useState(completed);
  useEffect(() => {
    if (completed) setSolved(true);
  }, [completed]);

  const check = () => {
    const r = checkAnswer(spec, value);
    if (!value.trim()) return setFeedback({ tone: "info", text: r.message });
    setAttempts((a) => a + 1);
    if (r.correct) {
      setSolved(true);
      setFeedback({ tone: "success", text: "Correct." });
      onSolved(spec.id);
    } else setFeedback({ tone: "error", text: r.message });
  };

  const toneCls = {
    success: "border-success/40 bg-success-bg text-success",
    error: "border-danger/40 bg-danger/10 text-ink",
    info: "border-line-strong bg-sand text-ink",
  };
  const numeric = typeof spec.answer === "number";

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
      <div className="mt-2 space-y-2 text-[1rem] leading-relaxed text-ink [&_code]:rounded [&_code]:bg-sand [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.88em]">{prompt}</div>

      {spec.dataset && spec.files?.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {spec.files.map((f) => (
            <li key={f}>
              <a href={datasetUrl(spec.dataset!, f)} download className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-2.5 py-1 text-[0.8125rem] font-medium hover:border-ink/40">
                <Download aria-hidden className="h-3.5 w-3.5" /> {f}.csv
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <label htmlFor={`${id}-input`} className="sr-only">
          Your answer
        </label>
        <input
          id={`${id}-input`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode={numeric ? "decimal" : "text"}
          autoComplete="off"
          spellCheck={false}
          placeholder={numeric ? (spec.format === "naira" ? "e.g. 1250000 or 1.25m" : spec.format === "percent" ? "e.g. 18.5" : "Your answer") : "Your answer"}
          className="min-w-0 flex-1 rounded-lg border border-line-strong bg-ivory px-3.5 py-2.5 font-mono text-[0.9375rem] text-ink focus:border-ink/60 focus:outline-2 focus:outline-offset-2 focus:outline-brass-dark"
        />
        <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-5 text-[0.9375rem] font-semibold text-ivory hover:bg-ink/85">
          Check
        </button>
      </form>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {spec.hint && (
          <button type="button" onClick={() => setShowHint((h) => !h)} aria-expanded={showHint} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-sand">
            <Lightbulb aria-hidden className="h-4 w-4 text-brass-dark" /> {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          aria-expanded={revealed}
          disabled={attempts < 2 && !solved}
          title={attempts < 2 && !solved ? "Available after two tries" : undefined}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eye aria-hidden className="h-4 w-4 text-brass-dark" /> {revealed ? "Hide answer" : "Show answer"}
        </button>
      </div>

      {showHint && spec.hint && <p className="mt-3 rounded-lg bg-sand px-3.5 py-2.5 text-[0.9rem] text-ink">{spec.hint}</p>}
      <div aria-live="polite">{feedback && <p className={`mt-3 rounded-lg border px-3.5 py-2.5 text-[0.9rem] ${toneCls[feedback.tone]}`}>{feedback.text}</p>}</div>
      {(revealed || solved) && (revealed || spec.explanation) && (
        <div className="mt-3 rounded-lg border border-line bg-ivory px-3.5 py-3 text-[0.9rem] leading-relaxed text-ink">
          {revealed && (
            <p>
              <span className="font-semibold">Answer:</span> <span className="font-mono">{formatAnswer(spec)}</span>
            </p>
          )}
          {spec.explanation && <p className={revealed ? "mt-1.5" : ""}>{spec.explanation}</p>}
        </div>
      )}
    </section>
  );
}
