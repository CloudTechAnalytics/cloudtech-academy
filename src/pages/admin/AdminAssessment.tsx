import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Plus, Trash2 } from "lucide-react";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import type { AssessmentDef } from "@/content/types";
import { Button } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import NotFound from "../NotFound";
import { AdminHeading } from "./AdminLayout";
import { randomId, useAdminCourse, useAdminData } from "./useAdmin";

export default function AdminAssessment() {
  const { slug } = useParams();
  const { data: course, error } = useAdminCourse(slug);
  const { data: loaded } = useAdminData(async () => (course ? (await getBackend()).admin.getAssessment(course.id) : undefined), [course?.id]);
  const [a, setA] = useState<AssessmentDef | null>(null);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!course || loaded === undefined) return;
    setA(loaded ?? { id: `${course.slug}-final`, courseId: course.id, title: `${course.title}: final assessment`, passingScore: course.certificate.passingScore, questions: [] });
  }, [course, loaded]);

  if (error) return <Alert tone="error">{error}</Alert>;
  if (course === null) return <NotFound />;
  if (!course || !a) return <PageLoading />;

  const update = (i: number, patch: Partial<AssessmentDef["questions"][number]>) => setA({ ...a, questions: a.questions.map((q, j) => (j === i ? { ...q, ...patch } : q)) });

  const save = async () => {
    setMsg(null);
    for (const [i, q] of a.questions.entries()) {
      if (!q.prompt.trim()) return setMsg({ tone: "error", text: `Question ${i + 1} has no text.` });
      if (q.options.length < 2 || q.options.some((o) => !o.trim())) return setMsg({ tone: "error", text: `Question ${i + 1} needs at least two filled-in options.` });
      if (q.answer < 0 || q.answer >= q.options.length) return setMsg({ tone: "error", text: `Pick the correct answer for question ${i + 1}.` });
    }
    setBusy(true);
    try {
      await (await getBackend()).admin.saveAssessment(a);
      setMsg({ tone: "success", text: "Saved. Learners see the new questions on their next attempt." });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHeading title="Final assessment" />
      <p className="-mt-4 mb-6 text-[0.875rem] text-muted">
        <Link to={`/admin/courses/${course.slug}`} className="hover:text-ink">
          ← {course.title}
        </Link>
      </p>
      <form
        className="space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <div className="grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-[1fr_10rem]">
          <TextField label="Title" value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} />
          <TextField label="Pass mark (%)" type="number" min={1} max={100} value={a.passingScore} onChange={(e) => setA({ ...a, passingScore: Number(e.target.value) })} />
        </div>

        <ol className="space-y-4">
          {a.questions.map((q, i) => (
            <li key={q.id} className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-brass-dark">Question {i + 1}</p>
                <button type="button" onClick={() => setA({ ...a, questions: a.questions.filter((_, j) => j !== i) })} className="rounded p-1.5 text-danger hover:bg-danger/10" aria-label={`Delete question ${i + 1}`}>
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2">
                <TextArea label="Question" rows={2} value={q.prompt} onChange={(e) => update(i, { prompt: e.target.value })} />
              </div>
              <fieldset className="mt-4 space-y-2">
                <legend className="text-[0.875rem] font-medium">Options (select the correct one)</legend>
                {q.options.map((o, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input type="radio" name={`answer-${q.id}`} checked={q.answer === oi} onChange={() => update(i, { answer: oi })} aria-label={`Option ${oi + 1} is correct`} className="accent-[var(--color-brass-dark)]" />
                    <input
                      value={o}
                      onChange={(e) => update(i, { options: q.options.map((x, xi) => (xi === oi ? e.target.value : x)) })}
                      aria-label={`Option ${oi + 1}`}
                      className="min-w-0 flex-1 rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]"
                    />
                    <button
                      type="button"
                      disabled={q.options.length <= 2}
                      onClick={() => update(i, { options: q.options.filter((_, xi) => xi !== oi), answer: q.answer === oi ? 0 : q.answer > oi ? q.answer - 1 : q.answer })}
                      className="rounded p-1.5 text-muted hover:bg-sand disabled:opacity-30"
                      aria-label={`Remove option ${oi + 1}`}
                    >
                      <Trash2 aria-hidden className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => update(i, { options: [...q.options, ""] })} className="text-[0.8125rem] font-semibold text-brass-dark">
                  Add option
                </button>
              </fieldset>
              <div className="mt-4">
                <TextField label="Explanation (optional, for reviewers)" value={q.explanation ?? ""} onChange={(e) => update(i, { explanation: e.target.value || undefined })} />
              </div>
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setA({ ...a, questions: [...a.questions, { id: `${a.id}-q-${randomId()}`, prompt: "", options: ["", "", "", ""], answer: 0 }] })}
        >
          <Plus aria-hidden className="h-4 w-4" /> Add question
        </Button>
        <div aria-live="polite">{msg && <Alert tone={msg.tone}>{msg.text}</Alert>}</div>
        <Button type="submit" loading={busy}>
          Save assessment
        </Button>
      </form>
    </>
  );
}
