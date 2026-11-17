import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import {
  getBackend,
  type AdminAssignmentSubmission,
  type Assignment,
  type AssignmentInput,
  type ClassAttendance,
  type ClassSession,
  type ProgrammeBatch,
  type RosterStudent,
  type SessionInput,
} from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { useCourses, useProgrammes } from "@/lib/data";
import { isPaid, programmeCourseIds } from "@/lib/commerce";
import { formatDate } from "@/lib/format";
import type { Track } from "@/content/tracks";
import { Button } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

/** Admin → Classroom: run a Professional Programme's classroom: students and batches, live classes and attendance, announcements, and graded assignments. */

const field = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]";
type Msg = { tone: "success" | "error"; text: string } | null;
type Note = (m: Msg) => void;

/** ISO time to the value a datetime-local input wants, in the admin's own time zone. */
const toLocal = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const fromLocal = (v: string) => (v ? new Date(v).toISOString() : null);
const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

const run = async (note: Note, fn: () => Promise<string | void>) => {
  note(null);
  try {
    const text = await fn();
    if (text) note({ tone: "success", text });
    return true;
  } catch (e) {
    note({ tone: "error", text: e instanceof Error ? e.message : "Something went wrong." });
    return false;
  }
};

function BatchSelect({ batches, value, onChange, label = "Who it's for" }: { batches: ProgrammeBatch[]; value: string | null; onChange: (v: string | null) => void; label?: string }) {
  return (
    <label className="block text-[0.875rem] font-medium">
      {label}
      <select className={field} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">Everyone in the programme</option>
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
            {b.status === "closed" ? " (closed)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

const batchName = (batches: ProgrammeBatch[], id: string | null) => (id ? (batches.find((b) => b.id === id)?.name ?? "A batch") : "Everyone");

/* ---------------------------------------------------------------- students */

function Students({ track, batches, roster, reload, note }: { track: Track; batches: ProgrammeBatch[]; roster: RosterStudent[]; reload: () => Promise<unknown>; note: Note }) {
  if (!roster.length)
    return (
      <p className="text-muted">
        No students yet. Students appear here once they pay (recorded on <Link to="/admin/applications" className="font-semibold text-brass-dark">Applications</Link> or Payments) or are granted the programme.
      </p>
    );
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
      <table className="w-full text-left text-[0.9375rem]">
        <thead className="border-b border-line bg-sand/60 text-[0.8125rem] text-muted">
          <tr>
            <th className="px-4 py-2.5 font-medium">Student</th>
            <th className="px-4 py-2.5 font-medium">Enrolled</th>
            <th className="px-4 py-2.5 font-medium">Batch</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((r) => (
            <tr key={r.userId} className="border-b border-line last:border-0">
              <td className="px-4 py-3">
                <Link to={`/admin/students/${r.userId}`} className="font-medium hover:text-brass-dark">
                  {r.fullName || r.email}
                </Link>
                <span className="block text-[0.8125rem] text-muted">{r.email}</span>
              </td>
              <td className="px-4 py-3 text-[0.875rem] text-muted">
                {formatDate(r.enrolledAt)}
                {r.source === "granted" ? " · granted" : ""}
              </td>
              <td className="px-4 py-3">
                <select
                  aria-label={`Batch for ${r.fullName}`}
                  className={`${field} mt-0 min-w-48`}
                  value={r.batchId ?? ""}
                  onChange={(e) =>
                    void run(note, async () => {
                      await (await getBackend()).admin.setStudentBatch(track.id, r.userId, e.target.value || null);
                      await reload();
                      return `${r.fullName || r.email} moved.`;
                    })
                  }
                >
                  <option value="">Not placed yet</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------- live classes and attendance */

const MARKS: [ClassAttendance, string][] = [
  ["present", "Present"],
  ["late", "Late"],
  ["absent", "Absent"],
  ["excused", "Excused"],
];

function AttendancePanel({ session, roster, note }: { session: ClassSession; roster: RosterStudent[]; note: Note }) {
  const students = roster.filter((r) => !session.batchId || !r.batchId || r.batchId === session.batchId);
  const { data, reload } = useAdminData(async () => (await getBackend()).admin.listAttendance(session.id), [session.id]);
  if (!data) return <p className="text-[0.875rem] text-muted">Loading attendance…</p>;
  if (!students.length) return <p className="text-[0.875rem] text-muted">No students in this class yet.</p>;
  const set = (userId: string, status: ClassAttendance | null) =>
    void run(note, async () => {
      await (await getBackend()).admin.setClassAttendance(session.id, userId, status);
      await reload();
    });
  const allPresent = () =>
    void run(note, async () => {
      const b = await getBackend();
      for (const s of students.filter((x) => !data.some((d) => d.userId === x.userId))) await b.admin.setClassAttendance(session.id, s.userId, "present");
      await reload();
      return "Everyone not yet marked is now Present.";
    });
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.875rem] font-semibold">
          Attendance · {data.filter((d) => d.status === "present" || d.status === "late").length} of {students.length} attended
        </p>
        <button type="button" onClick={allPresent} className="text-[0.8125rem] font-semibold text-brass-dark">
          Mark the rest present
        </button>
      </div>
      <ul className="mt-2 divide-y divide-line rounded-xl border border-line">
        {students.map((s) => {
          const m = data.find((d) => d.userId === s.userId)?.status ?? null;
          return (
            <li key={s.userId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
              <span className="text-[0.9375rem]">{s.fullName || s.email}</span>
              <span className="flex flex-wrap gap-1">
                {MARKS.map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={m === k}
                    onClick={() => set(s.userId, m === k ? null : k)}
                    className={`rounded-full border px-2.5 py-0.5 text-[0.75rem] ${m === k ? "border-ink bg-ink text-paper" : "border-line-strong hover:border-ink/50"}`}
                  >
                    {label}
                  </button>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const emptySession = (trackId: string): SessionInput => ({ trackId, batchId: null, title: "", description: null, startsAt: "", endsAt: null, joinUrl: null, recordingUrl: null });

function SessionForm({ initial, batches, onDone, note }: { initial: SessionInput; batches: ProgrammeBatch[]; onDone: () => Promise<unknown>; note: Note }) {
  const [x, setX] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof SessionInput>(k: K, v: SessionInput[K]) => setX((o) => ({ ...o, [k]: v }));
  const save = async () => {
    if (!x.startsAt) return note({ tone: "error", text: "Choose when the class starts." });
    setBusy(true);
    const ok = await run(note, async () => {
      await (await getBackend()).admin.saveSession(x);
      return `${x.title.trim()} saved.`;
    });
    setBusy(false);
    if (ok) await onDone();
  };
  return (
    <form
      className="grid gap-3 rounded-2xl border border-line-strong bg-paper p-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <TextField label="Class title" value={x.title} onChange={(e) => set("title", e.target.value)} placeholder="Week 3: Pivot tables, live" />
      <BatchSelect batches={batches} value={x.batchId} onChange={(v) => set("batchId", v)} />
      <TextField label="Starts" type="datetime-local" value={toLocal(x.startsAt || null)} onChange={(e) => set("startsAt", fromLocal(e.target.value) ?? "")} />
      <TextField label="Ends (optional)" type="datetime-local" value={toLocal(x.endsAt)} onChange={(e) => set("endsAt", fromLocal(e.target.value))} />
      <TextField label="Join link (Zoom, Meet or Teams)" value={x.joinUrl ?? ""} onChange={(e) => set("joinUrl", e.target.value || null)} placeholder="https://meet.google.com/…" />
      <TextField label="Recording link (after the class)" value={x.recordingUrl ?? ""} onChange={(e) => set("recordingUrl", e.target.value || null)} placeholder="https://youtu.be/…" />
      <div className="sm:col-span-2">
        <TextArea label="What the class covers (optional)" rows={2} value={x.description ?? ""} onChange={(e) => set("description", e.target.value || null)} />
      </div>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" loading={busy}>
          Save class
        </Button>
        <Button type="button" variant="ghost" onClick={() => void onDone()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function LiveClasses({ track, batches, roster, note }: { track: Track; batches: ProgrammeBatch[]; roster: RosterStudent[]; note: Note }) {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listSessions(track.id), [track.id]);
  const [editing, setEditing] = useState<SessionInput | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const done = async () => {
    setEditing(null);
    await reload();
  };
  return (
    <>
      {editing ? (
        <SessionForm initial={editing} batches={batches} onDone={done} note={note} />
      ) : (
        <Button onClick={() => setEditing(emptySession(track.id))}>
          <Plus aria-hidden className="h-4 w-4" /> Schedule a class
        </Button>
      )}
      {data.length ? (
        <ul className="mt-6 space-y-2">
          {data.map((s) => (
            <li key={s.id} className="rounded-xl border border-line bg-paper p-4">
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => setOpen(open === s.id ? null : s.id)} className="min-w-0 flex-1 text-left">
                  <span className="block font-medium">{s.title}</span>
                  <span className="block text-[0.8125rem] text-muted">
                    {when(s.startsAt)} · {batchName(batches, s.batchId)} · {s.joinUrl ? "join link set" : "no join link"} · {s.recordingUrl ? "recording added" : "no recording"}
                  </span>
                </button>
                <button type="button" onClick={() => setEditing({ ...s })} className="rounded p-1.5 hover:bg-sand" aria-label={`Edit ${s.title}`}>
                  <Pencil aria-hidden className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    window.confirm(`Delete ${s.title} and its attendance?`) &&
                    void run(note, async () => {
                      await (await getBackend()).admin.deleteSession(s.id);
                      await reload();
                      return "Class deleted.";
                    })
                  }
                  className="rounded p-1.5 text-danger hover:bg-danger/10"
                  aria-label={`Delete ${s.title}`}
                >
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </div>
              {open === s.id && <AttendancePanel session={s} roster={roster} note={note} />}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-muted">No classes scheduled. Students see the timetable in their classroom, with the join link and, afterwards, the recording.</p>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- announcements */

function Announcements({ track, batches, note }: { track: Track; batches: ProgrammeBatch[]; note: Note }) {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listAnnouncements(track.id), [track.id]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [batchId, setBatchId] = useState<string | null>(null);
  const [email, setEmail] = useState(true);
  const [busy, setBusy] = useState(false);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const post = async () => {
    setBusy(true);
    const ok = await run(note, async () => {
      const n = await (await getBackend()).admin.postAnnouncement({ trackId: track.id, batchId, title, body, email });
      await reload();
      return email ? `Posted and emailed to ${n} ${n === 1 ? "student" : "students"}.` : "Posted to the classroom.";
    });
    if (ok) {
      setTitle("");
      setBody("");
    }
    setBusy(false);
  };
  return (
    <>
      <form
        className="grid gap-3 rounded-2xl border border-line-strong bg-paper p-5"
        onSubmit={(e) => {
          e.preventDefault();
          void post();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Class moved to Thursday" />
          <BatchSelect batches={batches} value={batchId} onChange={setBatchId} />
        </div>
        <TextArea label="Message" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
        <label className="flex items-center gap-2.5 text-[0.9375rem]">
          <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} className="h-4 w-4 accent-(--color-brass-dark)" />
          Also email it to these students
        </label>
        <div>
          <Button type="submit" loading={busy}>
            Post announcement
          </Button>
        </div>
      </form>
      <ul className="mt-6 space-y-2">
        {data.map((a) => (
          <li key={a.id} className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-[0.8125rem] text-muted">
                  {formatDate(a.createdAt)} · {batchName(batches, a.batchId)}
                  {a.emailed ? " · emailed" : ""}
                </p>
                <p className="mt-2 whitespace-pre-line text-[0.9375rem]">{a.body}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  window.confirm("Delete this announcement from the classroom?") &&
                  void run(note, async () => {
                    await (await getBackend()).admin.deleteAnnouncement(a.id);
                    await reload();
                    return "Announcement deleted.";
                  })
                }
                className="rounded p-1.5 text-danger hover:bg-danger/10"
                aria-label={`Delete ${a.title}`}
              >
                <Trash2 aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------- assignments */

const emptyAssignment = (trackId: string): AssignmentInput => ({
  trackId,
  batchId: null,
  courseId: null,
  title: "",
  brief: "",
  dueAt: null,
  maxScore: 100,
  passScore: 50,
  required: true,
  published: true,
});

function AssignmentForm({ initial, track, batches, onDone, note }: { initial: AssignmentInput; track: Track; batches: ProgrammeBatch[]; onDone: () => Promise<unknown>; note: Note }) {
  const courses = useCourses();
  const inProgramme = programmeCourseIds(track)
    .map((id) => courses.find((c) => c.id === id))
    .filter((c) => !!c);
  const [x, setX] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof AssignmentInput>(k: K, v: AssignmentInput[K]) => setX((o) => ({ ...o, [k]: v }));
  const save = async () => {
    if (x.passScore !== null && x.passScore > x.maxScore) return note({ tone: "error", text: "The pass mark can't be above the maximum score." });
    setBusy(true);
    const ok = await run(note, async () => {
      await (await getBackend()).admin.saveAssignment(x);
      return `${x.title.trim()} saved.`;
    });
    setBusy(false);
    if (ok) await onDone();
  };
  return (
    <form
      className="grid gap-3 rounded-2xl border border-line-strong bg-paper p-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <TextField label="Title" value={x.title} onChange={(e) => set("title", e.target.value)} placeholder="Assignment 1: Clean the sales export" />
      <BatchSelect batches={batches} value={x.batchId} onChange={(v) => set("batchId", v)} />
      <label className="block text-[0.875rem] font-medium">
        Goes with course (optional)
        <select className={field} value={x.courseId ?? ""} onChange={(e) => set("courseId", e.target.value || null)}>
          <option value="">The whole programme</option>
          {inProgramme.map((c) => (
            <option key={c!.id} value={c!.id}>
              {c!.title}
            </option>
          ))}
        </select>
      </label>
      <TextField label="Due (optional)" type="datetime-local" value={toLocal(x.dueAt)} onChange={(e) => set("dueAt", fromLocal(e.target.value))} />
      <TextField label="Maximum score" type="number" min={1} value={x.maxScore} onChange={(e) => set("maxScore", Number(e.target.value) || 1)} />
      <TextField
        label="Pass mark (optional)"
        type="number"
        min={0}
        value={x.passScore ?? ""}
        onChange={(e) => set("passScore", e.target.value === "" ? null : Number(e.target.value))}
        hint="Leave empty if any graded submission passes."
      />
      <div className="sm:col-span-2">
        <TextArea label="Brief (what to do and how it's marked; Markdown works)" rows={8} value={x.brief} onChange={(e) => set("brief", e.target.value)} />
      </div>
      <label className="flex items-center gap-2.5 text-[0.9375rem]">
        <input type="checkbox" checked={x.required} onChange={(e) => set("required", e.target.checked)} className="h-4 w-4 accent-(--color-brass-dark)" />
        Required for the programme badge
      </label>
      <label className="flex items-center gap-2.5 text-[0.9375rem]">
        <input type="checkbox" checked={x.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-(--color-brass-dark)" />
        Published (students can see it)
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" loading={busy}>
          Save assignment
        </Button>
        <Button type="button" variant="ghost" onClick={() => void onDone()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function GradeRow({ s, a, onDone, note }: { s: AdminAssignmentSubmission; a: Assignment; onDone: () => Promise<unknown>; note: Note }) {
  const [score, setScore] = useState(s.score === null ? "" : String(s.score));
  const [feedback, setFeedback] = useState(s.feedback ?? "");
  const [busy, setBusy] = useState(false);
  const grade = async (status: "graded" | "returned") => {
    setBusy(true);
    await run(note, async () => {
      await (await getBackend()).admin.gradeSubmission(s.id, status, score === "" ? null : Number(score), feedback);
      await onDone();
      return status === "graded" ? `${s.fullName}: graded.` : `${s.fullName}: returned to improve.`;
    });
    setBusy(false);
  };
  return (
    <li className="rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">
          {s.fullName || s.email} <span className="text-[0.8125rem] font-normal text-muted">· handed in {formatDate(s.submittedAt)}</span>
        </p>
        <span className="rounded-full bg-sand px-2.5 py-0.5 text-[0.75rem] font-semibold">
          {s.status === "graded" ? `Graded ${s.score}/${a.maxScore}` : s.status === "returned" ? "Returned" : "Awaiting grade"}
        </span>
      </div>
      {s.content && <p className="mt-2 whitespace-pre-line rounded-lg bg-sand/50 p-3 text-[0.9375rem]">{s.content}</p>}
      {s.url && (
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-brass-dark">
          Open their work <ExternalLink aria-hidden className="h-3.5 w-3.5" />
        </a>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-[8rem_1fr]">
        <TextField label={`Score (of ${a.maxScore})`} type="number" min={0} max={a.maxScore} value={score} onChange={(e) => setScore(e.target.value)} />
        <TextArea label="Feedback" rows={2} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => void grade("graded")} loading={busy}>
          Save grade
        </Button>
        <Button variant="secondary" onClick={() => void grade("returned")} disabled={busy}>
          Return to improve
        </Button>
      </div>
    </li>
  );
}

function Submissions({ a, note }: { a: Assignment; note: Note }) {
  const { data, reload } = useAdminData<AdminAssignmentSubmission[]>(async () => (await getBackend()).admin.listAssignmentSubmissions(a.id), [a.id]);
  if (!data) return <p className="mt-3 text-[0.875rem] text-muted">Loading submissions…</p>;
  if (!data.length) return <p className="mt-3 text-[0.875rem] text-muted">No submissions yet.</p>;
  return (
    <ul className="mt-3 space-y-2">
      {data.map((s) => (
        <GradeRow key={`${s.id}${s.status}${s.score}`} s={s} a={a} onDone={reload} note={note} />
      ))}
    </ul>
  );
}

function Assignments({ track, batches, note }: { track: Track; batches: ProgrammeBatch[]; note: Note }) {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listAssignments(track.id), [track.id]);
  const [editing, setEditing] = useState<AssignmentInput | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const done = async () => {
    setEditing(null);
    await reload();
  };
  return (
    <>
      {editing ? (
        <AssignmentForm initial={editing} track={track} batches={batches} onDone={done} note={note} />
      ) : (
        <Button onClick={() => setEditing(emptyAssignment(track.id))}>
          <Plus aria-hidden className="h-4 w-4" /> Set an assignment
        </Button>
      )}
      {data.length ? (
        <ul className="mt-6 space-y-2">
          {data.map((a) => (
            <li key={a.id} className="rounded-xl border border-line bg-paper p-4">
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => setOpen(open === a.id ? null : a.id)} className="min-w-0 flex-1 text-left">
                  <span className="block font-medium">
                    {a.title}
                    {!a.published && <span className="ml-2 text-[0.75rem] font-normal text-muted">(draft)</span>}
                  </span>
                  <span className="block text-[0.8125rem] text-muted">
                    {a.dueAt ? `Due ${when(a.dueAt)}` : "No due date"} · {batchName(batches, a.batchId)} · out of {a.maxScore}
                    {a.passScore !== null ? `, pass ${a.passScore}` : ""} · {a.required ? "required" : "optional"}
                  </span>
                </button>
                <button type="button" onClick={() => setEditing({ ...a })} className="rounded p-1.5 hover:bg-sand" aria-label={`Edit ${a.title}`}>
                  <Pencil aria-hidden className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    window.confirm(`Delete ${a.title} and every submission for it?`) &&
                    void run(note, async () => {
                      await (await getBackend()).admin.deleteAssignment(a.id);
                      await reload();
                      return "Assignment deleted.";
                    })
                  }
                  className="rounded p-1.5 text-danger hover:bg-danger/10"
                  aria-label={`Delete ${a.title}`}
                >
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </div>
              {open === a.id && <Submissions a={a} note={note} />}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-muted">No assignments yet. Required assignments must be graded as passed before a student can claim the programme badge.</p>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- page */

const TABS = [
  ["students", "Students"],
  ["classes", "Live classes"],
  ["announcements", "Announcements"],
  ["assignments", "Assignments"],
] as const;

export default function AdminClassroom() {
  const programmes = useProgrammes().filter((t) => isPaid(t));
  const [trackId, setTrackId] = useState(() => (typeof window === "undefined" ? "" : (new URLSearchParams(window.location.search).get("programme") ?? "")));
  const track = programmes.find((t) => t.id === trackId) ?? programmes[0];
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("students");
  const [msg, setMsg] = useState<Msg>(null);
  const { data: allBatches } = useAdminData(async () => (await getBackend()).admin.listAllBatches());
  const { data: roster, reload: reloadRoster } = useAdminData(async () => (track ? (await getBackend()).admin.listRoster(track.id) : []), [track?.id]);
  const batches = useMemo(() => (allBatches ?? []).filter((b) => b.trackId === track?.id), [allBatches, track?.id]);

  useEffect(() => setMsg(null), [tab, track?.id]);
  if (!track) return <PageLoading />;

  return (
    <>
      <AdminHeading title="Classroom">
        <Link to={`/classroom/${track.slug}`} className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brass-dark">
          View as a student <ExternalLink aria-hidden className="h-4 w-4" />
        </Link>
      </AdminHeading>
      <label className="block max-w-md text-[0.875rem] font-medium">
        Programme
        <select
          className={field}
          value={track.id}
          onChange={(e) => {
            setTrackId(e.target.value);
            window.history.replaceState(null, "", `?programme=${e.target.value}`);
          }}
        >
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.programmeName ?? p.title}
            </option>
          ))}
        </select>
      </label>
      <div role="tablist" className="mt-6 mb-6 flex flex-wrap gap-2 border-b border-line">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`-mb-px border-b-2 px-3 py-2 text-[0.9375rem] font-medium ${tab === k ? "border-brass-dark text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {label}
            {k === "students" && roster ? ` (${roster.length})` : ""}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mb-4">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      </div>
      {!roster ? (
        <PageLoading />
      ) : (
        <div key={track.id}>
          {tab === "students" && <Students track={track} batches={batches} roster={roster} reload={reloadRoster} note={setMsg} />}
          {tab === "classes" && <LiveClasses track={track} batches={batches} roster={roster} note={setMsg} />}
          {tab === "announcements" && <Announcements track={track} batches={batches} note={setMsg} />}
          {tab === "assignments" && <Assignments track={track} batches={batches} note={setMsg} />}
        </div>
      )}
    </>
  );
}
