import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { getBackend, type LessonInput } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { extractAnswers, extractExercises, extractQuizzes } from "@/lib/lesson-format";
import { LessonContent } from "@/components/LessonContent";
import { Button } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import NotFound from "../NotFound";
import { AdminHeading } from "./AdminLayout";
import { slugOk, useAdminCourse } from "./useAdmin";

const TEMPLATE = `## The problem

Describe the business situation.

## The concept

Explain one idea in plain language.

## Example

\`\`\`sql run
SELECT *
FROM shipments
LIMIT 5;
\`\`\`

## Practice

\`\`\`exercise
{
  "id": "new-exercise-id",
  "prompt": "What should the learner find?",
  "starter": "SELECT ",
  "solution": "SELECT COUNT(*) FROM shipments;",
  "hint": "A nudge, not the answer.",
  "required": true
}
\`\`\`
`;

/** Checks that exercise and quiz blocks are valid JSON before saving. */
function validateBody(body: string): string | null {
  try {
    const ex = [...extractExercises(body), ...extractAnswers(body)];
    const ids = new Set<string>();
    for (const e of ex) {
      if (!e.id) return "Every exercise needs an id.";
      if (ids.has(e.id)) return `The exercise id "${e.id}" is used twice.`;
      ids.add(e.id);
    }
    for (const q of extractQuizzes(body).flat()) {
      if (!Array.isArray(q.options) || q.answer < 0 || q.answer >= q.options.length) return "A quiz answer points to an option that doesn't exist.";
    }
    return null;
  } catch (e) {
    return `An exercise, answer or quiz block isn't valid: ${e instanceof Error ? e.message : String(e)}`;
  }
}

export default function AdminLessonEditor() {
  const { slug, lessonId = "new" } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data: course, error } = useAdminCourse(slug);
  const isNew = lessonId === "new";
  const [lesson, setLesson] = useState<LessonInput | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!course) return;
    const existing = course.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
    if (existing) {
      const { requiredExercises: _r, ...rest } = existing;
      setLesson(rest);
    } else if (isNew) {
      const moduleId = params.get("module") ?? course.modules[0]?.id ?? "";
      const m = course.modules.find((x) => x.id === moduleId);
      setLesson({ id: "", courseId: course.id, moduleId, slug: "", title: "", summary: "", minutes: 15, body: TEMPLATE, required: true, published: false, position: (m?.lessons.length ?? 0) + 1 });
    }
  }, [course, lessonId, isNew, params]);

  if (error) return <Alert tone="error">{error}</Alert>;
  if (course === undefined || (course && !lesson && (isNew || course.modules.some((m) => m.lessons.some((l) => l.id === lessonId))))) return <PageLoading />;
  if (!course || !lesson) return <NotFound />;

  const set = <K extends keyof LessonInput>(k: K, v: LessonInput[K]) => setLesson((x) => (x ? { ...x, [k]: v } : x));
  const allLessons = course.modules.flatMap((m) => m.lessons);

  const save = async () => {
    setMsg(null);
    if (lesson.title.trim().length < 3) return setMsg({ tone: "error", text: "Give the lesson a title." });
    if (!slugOk(lesson.slug)) return setMsg({ tone: "error", text: "The slug can only use lowercase letters, numbers and single hyphens." });
    const id = isNew ? `${course.id}:${lesson.slug}` : lesson.id;
    if (isNew && allLessons.some((l) => l.id === id)) return setMsg({ tone: "error", text: "Another lesson in this course already uses that slug." });
    if (!isNew && allLessons.some((l) => l.id !== lesson.id && l.slug === lesson.slug)) return setMsg({ tone: "error", text: "Another lesson in this course already uses that slug." });
    const bodyError = validateBody(lesson.body);
    if (bodyError) return setMsg({ tone: "error", text: bodyError });
    setBusy(true);
    try {
      await (await getBackend()).admin.saveLesson({ ...lesson, id, title: lesson.title.trim() });
      set("id", id);
      if (isNew) navigate(`/admin/courses/${course.slug}/lessons/${encodeURIComponent(id)}`, { replace: true });
      setMsg({ tone: "success", text: "Saved." });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this lesson? Learner progress on it is deleted too.")) return;
    await (await getBackend()).admin.deleteLesson(lesson.id);
    navigate(`/admin/courses/${course.slug}`);
  };

  return (
    <>
      <AdminHeading title={isNew ? "New lesson" : lesson.title || "Lesson"}>
        {!isNew && lesson.published && (
          <Link to={`/learn/${course.slug}/${lesson.slug}`} className="self-center text-[0.875rem] font-semibold text-brass-dark">
            View live
          </Link>
        )}
      </AdminHeading>
      <p className="-mt-4 mb-6 text-[0.875rem] text-muted">
        <Link to={`/admin/courses/${course.slug}`} className="hover:text-ink">
          ← {course.title}
        </Link>
      </p>

      <form
        className="space-y-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <div className="grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-2 sm:p-6">
          <TextField label="Title" value={lesson.title} onChange={(e) => set("title", e.target.value)} />
          <TextField label="URL slug" value={lesson.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} disabled={!isNew} hint={isNew ? "Can't be changed after saving." : undefined} />
          <div className="sm:col-span-2">
            <TextArea label="Summary" rows={2} value={lesson.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
          <div>
            <label htmlFor="module" className="text-[0.875rem] font-medium">
              Module
            </label>
            <select id="module" value={lesson.moduleId} onChange={(e) => set("moduleId", e.target.value)} className="mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5">
              {course.modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Minutes" type="number" min={1} value={lesson.minutes} onChange={(e) => set("minutes", Number(e.target.value))} />
            <TextField label="Position" type="number" min={1} value={lesson.position} onChange={(e) => set("position", Number(e.target.value))} />
          </div>
          <div className="flex flex-wrap gap-6 sm:col-span-2">
            <label className="flex items-center gap-2.5 text-[0.9375rem]">
              <input type="checkbox" checked={lesson.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-[var(--color-brass-dark)]" />
              Published
            </label>
            <label className="flex items-center gap-2.5 text-[0.9375rem]">
              <input type="checkbox" checked={lesson.required} onChange={(e) => set("required", e.target.checked)} className="h-4 w-4 accent-[var(--color-brass-dark)]" />
              Required for the certificate
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper">
          <div role="tablist" aria-label="Lesson body" className="flex gap-1 border-b border-line p-2">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-[0.875rem] font-medium capitalize ${tab === t ? "bg-sand text-ink" : "text-muted hover:text-ink"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-4 sm:p-6">
            {tab === "write" ? (
              <>
                <label htmlFor="body" className="sr-only">
                  Lesson body in Markdown
                </label>
                <textarea id="body" value={lesson.body} onChange={(e) => set("body", e.target.value)} rows={28} spellCheck className="sql-editor min-h-[30rem]" />
                <p className="mt-3 text-[0.8125rem] text-muted">
                  Markdown. Use ```sql run for runnable examples; ```exercise (SQL), ```answer (checked result) and ```quiz for JSON practice blocks; ```dataset for download links; and &gt; [!TIP], [!NOTE], [!WARNING] or [!BUSINESS] for callouts.
                </p>
              </>
            ) : (
              <div className="max-w-[46rem]">
                <LessonContent body={lesson.body} />
              </div>
            )}
          </div>
        </div>

        <div aria-live="polite">{msg && <Alert tone={msg.tone}>{msg.text}</Alert>}</div>
        <div className="flex flex-wrap justify-between gap-3">
          <Button type="submit" loading={busy}>
            Save lesson
          </Button>
          {!isNew && (
            <Button type="button" variant="danger" onClick={() => void remove()}>
              Delete lesson
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
