import { useState } from "react";
import { AlertTriangle, Award, Trash2 } from "lucide-react";
import { getBackend, type Credential } from "@/lib/backend";
import { Button } from "./Button";

/**
 * Deleting a free course, with a warning that spells out what goes: progress, practice, attempts, the project
 * submission, and every badge earned in the course. The learner has to tick that they understand first.
 */
export function DeleteCourse({ courseId, title, badges, onDeleted }: { courseId: string; title: string; badges: Credential[]; onDeleted: () => void | Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [sure, setSure] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mine = badges.filter((b) => b.courseId === courseId && b.status === "valid" && (b.kind === "module_badge" || b.kind === "course_completion"));

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await (await getBackend()).removeCourse(courseId);
      setOpen(false);
      await onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't delete the course. Try again.");
    }
    setBusy(false);
  };

  if (!open)
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setSure(false);
          setError(null);
        }}
        aria-label={`Delete ${title}`}
        title="Delete this course"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 aria-hidden className="h-4 w-4" />
      </button>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="alertdialog" aria-modal="true" aria-labelledby={`del-${courseId}`}>
      <button type="button" aria-label="Cancel" className="absolute inset-0 bg-night/50" onClick={() => !busy && setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-2xl border border-danger/40 bg-paper p-6 shadow-xl">
        <p id={`del-${courseId}`} className="flex items-start gap-2.5 font-serif text-[1.4rem] leading-snug">
          <AlertTriangle aria-hidden className="mt-1 h-5 w-5 shrink-0 text-danger" /> Delete {title}?
        </p>
        <p className="mt-3 text-[0.9375rem]">This permanently deletes everything you did in this course:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem] text-ink/85">
          <li>your progress, practice answers and assessment attempts</li>
          <li>your final project submission</li>
          <li>
            <strong className="text-danger">{mine.length ? `all ${mine.length} ${mine.length === 1 ? "badge" : "badges"} you earned in it` : "any badges you earn in it"}</strong>
            {mine.length > 0 && ". Their credential links stop working, including any you've shared on LinkedIn."}
          </li>
        </ul>
        {mine.length > 0 && (
          <ul className="mt-3 space-y-1 rounded-xl border border-danger/30 bg-danger/5 p-3">
            {mine.map((b) => (
              <li key={b.credentialId} className="flex items-center gap-2 text-[0.875rem]">
                <Award aria-hidden className="h-4 w-4 shrink-0 text-danger" /> {b.badgeName}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[0.9375rem] font-semibold">This can't be undone. If you start the course again, you begin from the first lesson.</p>
        <label className="mt-4 flex items-start gap-2.5 text-[0.9375rem]">
          <input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} className="mt-1 h-4 w-4 accent-(--color-danger)" />
          I understand that my progress{mine.length ? " and badges" : ""} for this course will be deleted for good.
        </label>
        {error && <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-[0.875rem]">{error}</p>}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
            Keep the course
          </Button>
          <button
            type="button"
            onClick={() => void remove()}
            disabled={!sure || busy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-[0.9375rem] font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 aria-hidden className="h-4 w-4" /> {busy ? "Deleting…" : "Delete course"}
          </button>
        </div>
      </div>
    </div>
  );
}
