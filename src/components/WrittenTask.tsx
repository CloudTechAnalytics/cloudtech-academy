import { useEffect, useId, useState, type ReactNode } from "react";
import { CheckCircle2, Circle, Clock, Lightbulb, XCircle } from "lucide-react";
import type { TaskSpec } from "@/content/types";
import { checkTask, type RuleResult } from "@/lib/task-check";

const draftKey = (id: string) => `cta-task:${id}`;
const readDraft = (id: string) => {
  try {
    return localStorage.getItem(draftKey(id)) ?? "";
  } catch {
    return "";
  }
};
const saveDraft = (id: string, text: string) => {
  try {
    localStorage.setItem(draftKey(id), text);
  } catch {
    /* private window: the draft just isn't remembered */
  }
};

/**
 * A written task: the learner does the real work (rewrites CV bullets, writes a prompt,
 * pastes some HTML), it's checked against the task's rules, and once it passes they can
 * compare it with a model answer. Drafts are kept in this browser.
 */
export function WrittenTask({
  spec,
  prompt,
  sample,
  note,
  label,
  completed,
  onSolved,
}: {
  spec: TaskSpec;
  /** The prompt rendered from Markdown. */
  prompt: ReactNode;
  /** The model answer rendered from Markdown. */
  sample: ReactNode;
  /** Commentary on the model answer, rendered from Markdown. */
  note?: ReactNode;
  label: string;
  completed: boolean;
  onSolved: (exerciseId: string) => void;
}) {
  const id = useId();
  const [text, setText] = useState("");
  const [results, setResults] = useState<RuleResult[] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [solved, setSolved] = useState(completed);
  useEffect(() => setText(readDraft(spec.id)), [spec.id]);
  useEffect(() => {
    if (completed) setSolved(true);
  }, [completed]);

  const check = () => {
    const r = checkTask(spec, text);
    setResults(r.results);
    if (r.passed && !solved) {
      setSolved(true);
      setShowSample(true);
      onSolved(spec.id);
    }
  };

  return (
    <section aria-labelledby={`${id}-title`} className="not-prose rounded-2xl border border-line-strong bg-paper p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p id={`${id}-title`} className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-brass-dark">
          {label}
          {spec.required ? "" : " · optional"}
        </p>
        <span className="flex items-center gap-3 text-[0.8125rem]">
          <span className="inline-flex items-center gap-1 text-muted">
            <Clock aria-hidden className="h-3.5 w-3.5" /> {spec.minutes} min
          </span>
          {solved && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-success">
              <CheckCircle2 aria-hidden className="h-4 w-4" /> Completed
            </span>
          )}
        </span>
      </div>
      <div className="mt-2 space-y-2 text-[1rem] leading-relaxed text-ink [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-sand [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.88em]">{prompt}</div>

      <div className="mt-4 rounded-lg border border-line bg-ivory px-3.5 py-3">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Your work is checked for</p>
        <ul className="mt-2 space-y-1.5 text-[0.9rem]">
          {spec.rules.map((rule, i) => {
            const r = results?.[i];
            return (
              <li key={i} className="flex items-start gap-2">
                {!r ? (
                  <Circle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
                ) : r.passed ? (
                  <CheckCircle2 aria-label="Met" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <XCircle aria-label="Not met yet" className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                )}
                <span>{rule.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <label htmlFor={`${id}-input`} className="sr-only">
          Your work
        </label>
        <textarea
          id={`${id}-input`}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            saveDraft(spec.id, e.target.value);
          }}
          rows={spec.rows ?? 8}
          placeholder={spec.placeholder ?? "Write your answer here."}
          className="block w-full resize-y rounded-lg border border-line-strong bg-ivory px-3.5 py-2.5 font-mono text-[0.875rem] leading-relaxed text-ink focus:border-ink/60 focus:outline-2 focus:outline-offset-2 focus:outline-brass-dark"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-5 text-[0.9375rem] font-semibold text-ivory hover:bg-ink/85">
            Check my work
          </button>
          {spec.hint && (
            <button type="button" onClick={() => setShowHint((h) => !h)} aria-expanded={showHint} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-sand">
              <Lightbulb aria-hidden className="h-4 w-4 text-brass-dark" /> {showHint ? "Hide hint" : "Show hint"}
            </button>
          )}
          {solved && spec.sample && (
            <button type="button" onClick={() => setShowSample((s) => !s)} aria-expanded={showSample} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-sand">
              {showSample ? "Hide the model answer" : "Compare with a model answer"}
            </button>
          )}
        </div>
      </form>

      {showHint && spec.hint && <p className="mt-3 rounded-lg bg-sand px-3.5 py-2.5 text-[0.9rem] text-ink">{spec.hint}</p>}
      <div aria-live="polite">
        {results && !results.every((r) => r.passed) && (
          <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-[0.9rem] text-ink">Not there yet. Fix the points marked with a cross, then check again.</p>
        )}
        {results && results.every((r) => r.passed) && <p className="mt-3 rounded-lg border border-success/40 bg-success-bg px-3.5 py-2.5 text-[0.9rem] text-success">Done. Compare yours with the model answer below.</p>}
      </div>
      {solved && showSample && spec.sample && (
        <div className="mt-3 rounded-lg border border-line bg-ivory px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-sand [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.88em] [&_pre]:my-2 [&_pre]:text-[0.84rem] [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p+p]:mt-2">
          <p className="mb-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Model answer</p>
          {sample}
          {note && <div className="mt-3 border-t border-line pt-3 text-muted">{note}</div>}
        </div>
      )}
    </section>
  );
}
