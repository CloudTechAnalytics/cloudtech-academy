import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { CATEGORIES } from "@/content";
import type { Course, Difficulty, Module } from "@/content/types";
import type { ModuleInput } from "@/lib/backend";
import { Button, ButtonLink } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import NotFound from "../NotFound";
import { AdminHeading } from "./AdminLayout";
import { courseInput, randomId, useAdminCourse } from "./useAdmin";
import { LEVELS, type Level } from "@/content/tracks";

const selectCls = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[1rem]";

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-[0.9375rem]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--color-brass-dark)]" />
      {label}
    </label>
  );
}

function Details({ course, onSaved }: { course: Course; onSaved: () => Promise<unknown> }) {
  const [c, setC] = useState(course);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => setC(course), [course]);
  const set = <K extends keyof Course>(k: K, v: Course[K]) => setC((x) => ({ ...x, [k]: v }));
  const rule = <K extends keyof Course["certificate"]>(k: K, v: Course["certificate"][K]) => setC((x) => ({ ...x, certificate: { ...x.certificate, [k]: v } }));

  const save = async () => {
    setMsg(null);
    if (c.title.trim().length < 3) return setMsg({ tone: "error", text: "The title is too short." });
    const score = c.certificate.passingScore;
    if (!Number.isInteger(score) || score < 1 || score > 100) return setMsg({ tone: "error", text: "The pass mark must be a whole number from 1 to 100." });
    setBusy(true);
    try {
      await (await getBackend()).admin.saveCourse(courseInput(c));
      await onSaved();
      setMsg({ tone: "success", text: "Saved." });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      className="space-y-5 rounded-2xl border border-line bg-paper p-5 sm:p-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <h2 className="font-serif text-[1.4rem]">Details</h2>
      <TextField label="Title" value={c.title} onChange={(e) => set("title", e.target.value)} />
      <TextArea label="Summary (one or two sentences, used on cards and in search results)" rows={2} value={c.summary} onChange={(e) => set("summary", e.target.value)} />
      <TextArea label="Description" rows={5} value={c.description} onChange={(e) => set("description", e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[0.875rem] font-medium" htmlFor="cat">
            Category
          </label>
          <select id="cat" className={selectCls} value={c.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            {CATEGORIES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[0.875rem] font-medium" htmlFor="status">
            Status
          </label>
          <select id="status" className={selectCls} value={c.status} onChange={(e) => set("status", e.target.value as Course["status"])}>
            <option value="available">Available</option>
            <option value="coming_soon">Coming soon</option>
          </select>
        </div>
        <div>
          <label className="text-[0.875rem] font-medium" htmlFor="diff">
            Difficulty
          </label>
          <select id="diff" className={selectCls} value={c.difficulty} onChange={(e) => set("difficulty", e.target.value as Difficulty)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="text-[0.875rem] font-medium" htmlFor="level">
            Level
          </label>
          <select id="level" className={selectCls} value={c.level} onChange={(e) => set("level", Number(e.target.value) as Level)}>
            {([1, 2, 3, 4] as Level[]).map((l) => (
              <option key={l} value={l}>
                {l}. {LEVELS[l].name}
              </option>
            ))}
          </select>
        </div>
        <TextField label="Level label" value={c.levelLabel} onChange={(e) => set("levelLabel", e.target.value)} />
        <TextField
          label="Estimated hours"
          type="number"
          min={1}
          value={c.estimatedHours ?? ""}
          onChange={(e) => set("estimatedHours", e.target.value ? Number(e.target.value) : undefined)}
          hint="Leave empty while the course is being written."
        />
        <TextField label="Project title" value={c.projectTitle ?? ""} onChange={(e) => set("projectTitle", e.target.value || undefined)} />
      </div>
      <TextField
        label="Skills (comma separated)"
        value={c.skills.join(", ")}
        onChange={(e) =>
          set(
            "skills",
            e.target.value.split(",").map((s) => s.trimStart()),
          )
        }
        onBlur={() => set("skills", c.skills.map((s) => s.trim()).filter(Boolean))}
      />
      <TextArea
        label="Prerequisites (one per line)"
        rows={3}
        value={c.prerequisites.join("\n")}
        onChange={(e) => set("prerequisites", e.target.value.split("\n"))}
        onBlur={() => set("prerequisites", c.prerequisites.map((s) => s.trim()).filter(Boolean))}
      />

      <fieldset className="space-y-3 rounded-xl border border-line p-4">
        <legend className="px-1 text-[0.875rem] font-semibold">Completion rules</legend>
        <Check label="Short course (modules with checks and badges)" checked={c.format === "short"} onChange={(v) => set("format", v ? "short" : "full")} />
        <Check label="Completion badge and optional certificate enabled" checked={c.certificate.enabled} onChange={(v) => rule("enabled", v)} />
        <Check label="Require every module badge" checked={c.certificate.requireModuleBadges} onChange={(v) => rule("requireModuleBadges", v)} />
        <Check label="Require every lesson" checked={c.certificate.requireAllLessons} onChange={(v) => rule("requireAllLessons", v)} />
        <Check label="Require the practice exercises" checked={c.certificate.requireExercises} onChange={(v) => rule("requireExercises", v)} />
        <Check label="Require the final project" checked={c.certificate.requireProject} onChange={(v) => rule("requireProject", v)} />
        <div className="max-w-40">
          <TextField label="Pass mark (%)" type="number" min={1} max={100} value={c.certificate.passingScore} onChange={(e) => rule("passingScore", Number(e.target.value))} />
        </div>
      </fieldset>

      <div aria-live="polite">{msg && <Alert tone={msg.tone}>{msg.text}</Alert>}</div>
      <Button type="submit" loading={busy}>
        Save details
      </Button>
    </form>
  );
}

const moduleInput = (m: Module): ModuleInput => ({ id: m.id, courseId: m.courseId, title: m.title, position: m.position, badge: m.badge, badgeCode: m.badgeCode, skills: m.skills });

/** A module's badge: its name, the code in its credential IDs, the skills on its credential page, and its check. */
function ModuleBadge({ course, module: m, onSave }: { course: Course; module: Module; onSave: (m: ModuleInput) => Promise<void> }) {
  const [badge, setBadge] = useState(m.badge ?? "");
  const [code, setCode] = useState(m.badgeCode ?? "");
  const [skills, setSkills] = useState(m.skills.join("\n"));
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <p className="mt-3 ml-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem]">
        <span className="text-muted">{m.badge ? `Badge: ${m.badge}` : "No badge"}</span>
        <button type="button" onClick={() => setOpen(true)} className="font-semibold text-brass-dark">
          {m.badge ? "Edit badge" : "Add a badge"}
        </button>
        {m.badge && (
          <Link to={`/admin/courses/${course.slug}/modules/${encodeURIComponent(m.id)}/assessment`} className="font-semibold text-brass-dark">
            Module check
          </Link>
        )}
      </p>
    );
  return (
    <form
      className="mt-3 ml-6 grid gap-3 rounded-lg border border-line bg-ivory p-3"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave({
          ...moduleInput(m),
          badge: badge.trim() || null,
          badgeCode: code.trim().toUpperCase() || null,
          skills: skills.split("\n").map((s) => s.trim()).filter(Boolean),
        }).then(() => setOpen(false));
      }}
    >
      <TextField label="Badge name" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Prompting Essentials" hint="Leave empty for no badge." />
      <TextField label="Badge code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="PROMPT" hint="2–8 letters or digits, used in credential IDs like CTA-PROMPT-8F72K." />
      <TextArea label="Skills on the credential (one per line)" rows={3} value={skills} onChange={(e) => setSkills(e.target.value)} />
      <div className="flex gap-2">
        <Button type="submit">Save badge</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Curriculum({ course, reload }: { course: Course; reload: () => Promise<unknown> }) {
  const [newModule, setNewModule] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    try {
      await fn();
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const move = (i: number, dir: -1 | 1) =>
    run(async () => {
      const ids = course.modules.map((m) => m.id);
      [ids[i], ids[i + dir]] = [ids[i + dir], ids[i]];
      await (await getBackend()).admin.reorderModules(course.id, ids);
    });

  const rename = (id: string, title: string) =>
    run(async () => {
      const m = course.modules.find((x) => x.id === id)!;
      if (!title.trim() || title === m.title) return;
      await (await getBackend()).admin.saveModule({ ...moduleInput(m), title: title.trim() });
    });

  const remove = (id: string, lessons: number) => {
    const warning = lessons ? `Delete this module and its ${lessons} lesson(s)? Learner progress on those lessons is deleted too.` : "Delete this module?";
    if (!window.confirm(warning)) return;
    void run(async () => (await getBackend()).admin.deleteModule(id));
  };

  const add = () =>
    run(async () => {
      if (!newModule.trim()) throw new Error("Give the module a title.");
      await (await getBackend()).admin.saveModule({
        id: `${course.id}-m-${randomId()}`,
        courseId: course.id,
        title: newModule.trim(),
        position: course.modules.length + 1,
        badge: null,
        badgeCode: null,
        skills: [],
      });
      setNewModule("");
    });

  return (
    <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <h2 className="font-serif text-[1.4rem]">Curriculum</h2>
      <div aria-live="polite" className="mt-3">
        {error && <Alert tone="error">{error}</Alert>}
      </div>
      <ol className="mt-4 space-y-4">
        {course.modules.map((m, i) => (
          <li key={m.id} className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-brass-dark">{i + 1}</span>
              <label className="sr-only" htmlFor={`m-${m.id}`}>
                Module title
              </label>
              <input
                id={`m-${m.id}`}
                defaultValue={m.title}
                onBlur={(e) => void rename(m.id, e.target.value)}
                className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 font-semibold hover:border-line focus:border-line-strong"
              />
              <div className="flex items-center">
                <button type="button" disabled={i === 0} onClick={() => void move(i, -1)} className="rounded p-1.5 hover:bg-sand disabled:opacity-30" aria-label="Move module up">
                  <ArrowUp aria-hidden className="h-4 w-4" />
                </button>
                <button type="button" disabled={i === course.modules.length - 1} onClick={() => void move(i, 1)} className="rounded p-1.5 hover:bg-sand disabled:opacity-30" aria-label="Move module down">
                  <ArrowDown aria-hidden className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => remove(m.id, m.lessons.length)} className="rounded p-1.5 text-danger hover:bg-danger/10" aria-label="Delete module">
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ul className="mt-3 space-y-1 pl-6">
              {m.lessons.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 text-[0.9375rem]">
                  <Link to={`/admin/courses/${course.slug}/lessons/${encodeURIComponent(l.id)}`} className="min-w-0 truncate hover:text-brass-dark">
                    {l.title}
                  </Link>
                  <span className="shrink-0 text-[0.75rem] text-muted">{l.published ? "Published" : "Draft"}</span>
                </li>
              ))}
            </ul>
            <Link to={`/admin/courses/${course.slug}/lessons/new?module=${encodeURIComponent(m.id)}`} className="mt-3 ml-6 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-brass-dark">
              <Plus aria-hidden className="h-3.5 w-3.5" /> Add lesson
            </Link>
            <ModuleBadge course={course} module={m} onSave={(input) => run(async () => (await getBackend()).admin.saveModule(input))} />
          </li>
        ))}
      </ol>
      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          void add();
        }}
      >
        <div className="flex-1">
          <TextField label="New module" value={newModule} onChange={(e) => setNewModule(e.target.value)} placeholder="Module title" />
        </div>
        <Button type="submit" variant="secondary">
          Add module
        </Button>
      </form>
    </section>
  );
}

export default function AdminCourseEditor() {
  const { slug } = useParams();
  const { data: course, error, reload } = useAdminCourse(slug);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (course === undefined) return <PageLoading />;
  if (!course) return <NotFound />;
  return (
    <>
      <AdminHeading title={course.title}>
        <ButtonLink to={`/admin/courses/${course.slug}/assessment`} variant="secondary">
          Assessment
        </ButtonLink>
        <ButtonLink to={`/courses/${course.slug}`} variant="ghost">
          View course
        </ButtonLink>
      </AdminHeading>
      <p className="-mt-4 mb-6 text-[0.875rem] text-muted">
        <Link to="/admin/courses" className="hover:text-ink">
          ← All courses
        </Link>
      </p>
      <div className="grid gap-8 xl:grid-cols-2">
        <Details course={course} onSaved={reload} />
        <Curriculum course={course} reload={reload} />
      </div>
    </>
  );
}
