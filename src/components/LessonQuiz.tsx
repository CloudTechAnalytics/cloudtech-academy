import { useId, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import { optionOrder } from "@/lib/shuffle";

/** "Check your understanding": instant feedback, not graded or stored. Options are shuffled per question. */
export function LessonQuiz({ questions }: { questions: QuizQuestion[] }) {
  const id = useId();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  return (
    <div className="not-prose rounded-2xl border border-line-strong bg-paper p-5 sm:p-6">
      <ol className="space-y-7">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const right = chosen === q.answer;
          return (
            <li key={qi}>
              <fieldset>
                <legend className="text-[1rem] font-semibold leading-snug text-ink">
                  {qi + 1}. {q.prompt}
                </legend>
                <div className="mt-3 grid gap-2">
                  {optionOrder(q.prompt, q.options.length).map((oi) => {
                    const opt = q.options[oi];
                    const isAnswer = checked && oi === q.answer;
                    const isWrongPick = checked && oi === chosen && !right;
                    return (
                      <label
                        key={oi}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 text-[0.9375rem] transition-colors ${
                          isAnswer ? "border-success/50 bg-success-bg" : isWrongPick ? "border-danger/50 bg-danger/10" : chosen === oi ? "border-brass bg-brass-pale/40" : "border-line hover:border-line-strong"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${id}-q${qi}`}
                          checked={chosen === oi}
                          onChange={() => {
                            setAnswers((a) => ({ ...a, [qi]: oi }));
                            setChecked(false);
                          }}
                          className="mt-1 accent-[var(--color-brass-dark)]"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
                {checked && (
                  <p className={`mt-2.5 flex items-start gap-2 text-[0.875rem] ${right ? "text-success" : "text-ink"}`}>
                    {right ? <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-danger" />}
                    <span>
                      <strong className="font-semibold">{right ? "Right. " : "Not quite. "}</strong>
                      {q.explanation}
                    </span>
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => setChecked(true)}
          className="rounded-lg bg-brass-button px-4 py-2 text-[0.875rem] font-semibold text-on-brass hover:bg-brass-button-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check answers
        </button>
        <p aria-live="polite" className="text-[0.9rem] text-muted">
          {checked ? `${score} of ${questions.length} correct.` : allAnswered ? "" : "Answer every question to check."}
        </p>
      </div>
    </div>
  );
}
