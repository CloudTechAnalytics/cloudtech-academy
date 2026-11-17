import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Award, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, Clock, ExternalLink, FolderKanban, Lock, Megaphone, PlayCircle, UserCheck, Video } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading, RequireAuth, useAuth } from "@/lib/auth";
import { lessonPath, useCourses, useMyProgrammes, useProgrammes } from "@/lib/data";
import { getBackend, type ClassAttendance, type ClassroomData, type Credential, type Enrollment, type Progress } from "@/lib/backend";
import { isPaid } from "@/lib/commerce";
import { publishedLessons } from "@/lib/certificates";
import { formatDate, percent } from "@/lib/format";
import { findProject } from "@/content/projects";
import type { Track } from "@/content/tracks";
import type { Course } from "@/content/types";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import { LessonContent } from "@/components/LessonContent";
import { ProgressBar } from "@/components/ProgressBar";
import NotFound from "./NotFound";

/**
 * The programme classroom (/classroom/<programme>): where Professional Programme students learn. Every course in the
 * programme, in order, with their progress (courses they started for free count), plus the programme's live classes,
 * announcements, graded assignments and their attendance. Nothing here is labelled free.
 */

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const ATTENDANCE: Record<ClassAttendance, { label: string; cls: string }> = {
  present: { label: "Present", cls: "bg-success-bg text-success" },
  late: { label: "Late", cls: "bg-brass-pale text-brass-deeper" },
  absent: { label: "Absent", cls: "bg-danger/10 text-danger" },
  excused: { label: "Excused", cls: "bg-sand text-muted" },
};

type CourseState = { course: Course; percent: number; done: boolean; resume: string | null; started: boolean };

function useCourseStates(track: Track | null, courses: Course[]) {
  const [state, setState] = useState<{ enrollments: Enrollment[]; progress: Record<string, Progress>; credentials: Credential[] } | null>(null);
  const ids = useMemo(() => (track ? track.stages.flatMap((s) => s.items).flatMap((i) => (i.kind === "course" ? [i.courseId] : [])) : []), [track]);
  useEffect(() => {
    if (!ids.length) return;
    let alive = true;
    void (async () => {
      const b = await getBackend();
      const [enrollments, credentials, progress] = await Promise.all([b.listEnrollments(), b.listMyCredentials(), Promise.all(ids.map((id) => b.getProgress(id)))]);
      if (alive) setState({ enrollments, credentials, progress: Object.fromEntries(ids.map((id, i) => [id, progress[i]])) });
    })().catch(() => alive && setState({ enrollments: [], credentials: [], progress: {} }));
    return () => {
      alive = false;
    };
  }, [ids]);
  if (!state) return null;
  const map: Record<string, CourseState> = {};
  for (const id of ids) {
    const course = courses.find((c) => c.id === id);
    if (!course) continue;
    const lessons = publishedLessons(course);
    const done = state.progress[id]?.completedLessons ?? [];
    const completed = state.credentials.some((c) => c.courseId === id && c.kind === "course_completion" && c.status === "valid");
    const last = state.enrollments.find((e) => e.courseId === id)?.lastLessonId;
    const resume = lessons.find((l) => l.id === last) ?? lessons.find((l) => !done.includes(l.id)) ?? lessons[0];
    map[id] = { course, percent: completed ? 100 : percent(lessons.filter((l) => done.includes(l.id)).length, lessons.length), done: completed, resume: resume?.slug ?? null, started: done.length > 0 };
  }
  return map;
}

function Courses({ track, states, data }: { track: Track; states: Record<string, CourseState>; data: ClassroomData }) {
  const list = Object.values(states);
  const overall = list.length ? Math.round(list.reduce((n, s) => n + s.percent, 0) / list.length) : 0;
  const next = list.find((s) => !s.done && s.started) ?? list.find((s) => !s.done);
  const upcoming = data.sessions.find((s) => new Date(s.endsAt ?? s.startsAt).getTime() > Date.now());
  const latest = data.announcements[0];
  const due = data.assignments.filter((a) => !a.submission || a.submission.status === "returned");
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <div className="rounded-2xl border border-line-strong bg-paper p-5 lg:col-span-1">
          <ProgressBar value={overall} label="Programme progress" />
          <p className="mt-2 text-[0.875rem] text-muted">
            {list.filter((s) => s.done).length} of {list.length} courses complete
          </p>
          {next?.resume && (
            <ButtonLink to={lessonPath(next.course.slug, next.resume, track.slug)} className="mt-4 h-auto w-full py-3 text-center whitespace-normal!" arrow>
              {next.started ? "Continue" : "Start"}: {next.course.title}
            </ButtonLink>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">
            <Video aria-hidden className="h-4 w-4 text-brass-dark" /> Next live class
          </p>
          {upcoming ? (
            <>
              <p className="mt-2 font-semibold">{upcoming.title}</p>
              <p className="text-[0.875rem] text-muted">{when(upcoming.startsAt)}</p>
              {upcoming.joinUrl && (
                <a href={upcoming.joinUrl} target="_blank" rel="noopener noreferrer" className={`${buttonClass("secondary")} mt-3`}>
                  <PlayCircle aria-hidden className="h-4 w-4" /> Join class
                </a>
              )}
            </>
          ) : (
            <p className="mt-2 text-[0.9375rem] text-muted">No class scheduled yet. We'll post the timetable here.</p>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">
            <Megaphone aria-hidden className="h-4 w-4 text-brass-dark" /> Latest announcement
          </p>
          {latest ? (
            <>
              <p className="mt-2 font-semibold">{latest.title}</p>
              <p className="line-clamp-3 text-[0.875rem] text-muted">{latest.body}</p>
            </>
          ) : (
            <p className="mt-2 text-[0.9375rem] text-muted">Nothing yet.</p>
          )}
          {due.length > 0 && <p className="mt-3 text-[0.875rem] font-medium text-brass-dark">{due.length === 1 ? "1 assignment to hand in" : `${due.length} assignments to hand in`}</p>}
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {track.stages.map((stage, si) => (
          <section key={stage.title}>
            <h2 className="font-serif text-[1.5rem]">
              <span className="text-brass-dark">{si + 1}.</span> {stage.title}
            </h2>
            <p className="mt-1 text-[0.9375rem] text-muted">{stage.summary}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3 [&>*]:min-w-0">
              {stage.items.map((item) => {
                if (item.kind === "course") {
                  const s = states[item.courseId];
                  if (!s) return null;
                  return (
                    <li key={item.courseId} className="flex flex-col rounded-2xl border border-line bg-paper p-5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-serif text-[1.2rem] leading-snug">{s.course.title}</p>
                        {s.done ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-bg px-2.5 py-0.5 text-[0.75rem] font-semibold text-success">
                            <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> Complete
                          </span>
                        ) : item.required === false ? (
                          <span className="shrink-0 rounded-full bg-sand px-2.5 py-0.5 text-[0.75rem] text-muted">Optional</span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[0.875rem] text-muted">{item.why}</p>
                      <div className="mt-4">
                        <ProgressBar value={s.percent} label={`${s.course.title} progress`} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 pt-1">
                        {s.resume && (
                          <ButtonLink to={lessonPath(s.course.slug, s.resume, track.slug)} variant={s.done ? "secondary" : "primary"}>
                            {s.done ? "Review" : s.started ? "Continue" : "Start"}
                          </ButtonLink>
                        )}
                        {!s.done && s.percent === 100 && (
                          <ButtonLink to={`/courses/${s.course.slug}/assessment`} variant="secondary">
                            Final assessment
                          </ButtonLink>
                        )}
                      </div>
                    </li>
                  );
                }
                if (item.kind === "project") {
                  const p = findProject(item.projectId);
                  if (!p) return null;
                  return (
                    <li key={item.projectId} className="flex flex-col rounded-2xl border border-line bg-paper p-5">
                      <p className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-brass-dark">
                        <FolderKanban aria-hidden className="h-4 w-4" /> Practice project
                      </p>
                      <p className="mt-1 font-serif text-[1.2rem] leading-snug">{p.title}</p>
                      <p className="mt-1 text-[0.875rem] text-muted">{item.why}</p>
                      <div className="mt-auto pt-4">
                        <ButtonLink to={`/projects/${p.id}`} variant="secondary">
                          Open project
                        </ButtonLink>
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function LiveClasses({ data }: { data: ClassroomData }) {
  const now = Date.now();
  const upcoming = data.sessions.filter((s) => new Date(s.endsAt ?? s.startsAt).getTime() > now);
  const past = data.sessions.filter((s) => new Date(s.endsAt ?? s.startsAt).getTime() <= now).reverse();
  const mark = (id: string) => data.attendance.find((a) => a.sessionId === id)?.status;
  if (!data.sessions.length) return <p className="text-muted">No live classes yet. Your timetable will appear here.</p>;
  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-[1.5rem]">Coming up</h2>
        {upcoming.length ? (
          <ul className="mt-4 space-y-3">
            {upcoming.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brass-pale/60 text-brass-dark">
                  <CalendarDays aria-hidden className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{s.title}</span>
                  <span className="block text-[0.875rem] text-muted">
                    {when(s.startsAt)}
                    {s.endsAt ? ` – ${new Date(s.endsAt).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}` : ""}
                  </span>
                  {s.description && <span className="mt-1 block text-[0.875rem] text-ink/80">{s.description}</span>}
                </span>
                {s.joinUrl ? (
                  <a href={s.joinUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
                    <PlayCircle aria-hidden className="h-4 w-4" /> Join class
                  </a>
                ) : (
                  <span className="text-[0.8125rem] text-muted">Join link coming soon</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted">No upcoming classes right now.</p>
        )}
      </section>
      {past.length > 0 && (
        <section>
          <h2 className="font-serif text-[1.5rem]">Past classes and recordings</h2>
          <ul className="mt-4 space-y-2">
            {past.map((s) => {
              const m = mark(s.id);
              return (
                <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-4">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.title}</span>
                    <span className="block text-[0.8125rem] text-muted">{when(s.startsAt)}</span>
                  </span>
                  {m && <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${ATTENDANCE[m].cls}`}>{ATTENDANCE[m].label}</span>}
                  {s.recordingUrl ? (
                    <a href={s.recordingUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
                      <Video aria-hidden className="h-4 w-4" /> Watch recording
                    </a>
                  ) : (
                    <span className="text-[0.8125rem] text-muted">Recording not added yet</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function AssignmentCard({ a, onSaved }: { a: ClassroomData["assignments"][number]; onSaved: () => Promise<void> }) {
  const sub = a.submission;
  const canSubmit = !sub || sub.status === "returned" || sub.status === "submitted";
  const [open, setOpen] = useState(!sub || sub.status === "returned");
  const [content, setContent] = useState(sub?.content ?? "");
  const [url, setUrl] = useState(sub?.url ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const late = !!a.dueAt && new Date(a.dueAt).getTime() < Date.now() && !sub;
  const status = !sub
    ? { label: late ? "Overdue" : "To do", cls: late ? "bg-danger/10 text-danger" : "bg-brass-pale text-brass-deeper" }
    : sub.status === "graded"
      ? { label: a.passScore !== null && (sub.score ?? 0) < a.passScore ? "Graded · not passed" : "Graded", cls: "bg-success-bg text-success" }
      : sub.status === "returned"
        ? { label: "Returned: improve and resubmit", cls: "bg-brass-pale text-brass-deeper" }
        : { label: "Handed in · awaiting grade", cls: "bg-sand text-ink" };
  const submit = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await (await getBackend()).submitAssignment(a.id, { content, url });
      await onSaved();
      setMsg({ tone: "success", text: "Handed in. Your instructor will grade it." });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't hand it in." });
    }
    setBusy(false);
  };
  return (
    <li className="rounded-2xl border border-line bg-paper">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-5 text-left">
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">
            {a.title}
            {!a.required && <span className="ml-2 text-[0.75rem] font-normal text-muted">(optional)</span>}
          </span>
          <span className="block text-[0.8125rem] text-muted">
            {a.dueAt ? `Due ${when(a.dueAt)}` : "No due date"} · out of {a.maxScore}
            {a.passScore !== null ? `, pass mark ${a.passScore}` : ""}
          </span>
        </span>
        {sub?.status === "graded" && (
          <span className="font-serif text-[1.3rem]">
            {sub.score}/{a.maxScore}
          </span>
        )}
        <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${status.cls}`}>{status.label}</span>
      </button>
      {open && (
        <div className="border-t border-line p-5">
          {a.brief.trim() && (
            <div className="max-w-[46rem]">
              <LessonContent body={a.brief} />
            </div>
          )}
          {sub?.feedback && (
            <div className="mt-5 rounded-xl border border-brass/40 bg-brass-pale/30 p-4">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-brass-dark">Feedback from your instructor</p>
              <p className="mt-1 whitespace-pre-line text-[0.9375rem]">{sub.feedback}</p>
            </div>
          )}
          {canSubmit ? (
            <form
              className="mt-5 max-w-[46rem] space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <TextArea label="Your answer" rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your answer, or summarise your work and add the link below." />
              <TextField label="Link to your work (optional)" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://drive.google.com/…, https://github.com/…" />
              <div aria-live="polite">{msg && <Alert tone={msg.tone}>{msg.text}</Alert>}</div>
              <Button type="submit" loading={busy}>
                {sub ? "Hand in again" : "Hand in"}
              </Button>
            </form>
          ) : (
            <p className="mt-5 text-[0.875rem] text-muted">Handed in {formatDate(sub?.submittedAt)}. Graded work is final.</p>
          )}
        </div>
      )}
    </li>
  );
}

function Assignments({ data, reload }: { data: ClassroomData; reload: () => Promise<void> }) {
  if (!data.assignments.length) return <p className="text-muted">No assignments yet. They'll appear here when your instructor sets them.</p>;
  return (
    <ul className="space-y-3">
      {data.assignments.map((a) => (
        <AssignmentCard key={`${a.id}${a.submission?.status ?? ""}`} a={a} onSaved={reload} />
      ))}
    </ul>
  );
}

function Announcements({ data }: { data: ClassroomData }) {
  if (!data.announcements.length) return <p className="text-muted">No announcements yet.</p>;
  return (
    <ul className="space-y-3">
      {data.announcements.map((a) => (
        <li key={a.id} className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-[0.8125rem] text-muted">{formatDate(a.createdAt)}</p>
          <p className="mt-1 font-serif text-[1.25rem]">{a.title}</p>
          <p className="mt-2 whitespace-pre-line text-[0.9375rem] text-ink/90">{a.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Attendance({ data }: { data: ClassroomData }) {
  const held = data.sessions.filter((s) => new Date(s.startsAt).getTime() <= Date.now());
  const marked = held.map((s) => ({ s, m: data.attendance.find((a) => a.sessionId === s.id)?.status })).filter((x) => x.m);
  const attended = marked.filter((x) => x.m === "present" || x.m === "late").length;
  if (!held.length) return <p className="text-muted">Your attendance appears here once classes start.</p>;
  return (
    <>
      <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-[0.875rem] text-muted">Attendance</p>
          <p className="mt-1 font-serif text-[2.2rem] leading-none">{marked.length ? `${percent(attended, marked.length)}%` : "–"}</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-[0.875rem] text-muted">Classes attended</p>
          <p className="mt-1 font-serif text-[2.2rem] leading-none">{attended}</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-[0.875rem] text-muted">Classes held</p>
          <p className="mt-1 font-serif text-[2.2rem] leading-none">{held.length}</p>
        </div>
      </div>
      <ul className="mt-6 max-w-3xl divide-y divide-line rounded-2xl border border-line bg-paper">
        {held
          .slice()
          .reverse()
          .map((s) => {
            const m = data.attendance.find((a) => a.sessionId === s.id)?.status;
            return (
              <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <span>
                  <span className="block font-medium">{s.title}</span>
                  <span className="block text-[0.8125rem] text-muted">{when(s.startsAt)}</span>
                </span>
                {m ? (
                  <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${ATTENDANCE[m].cls}`}>{ATTENDANCE[m].label}</span>
                ) : (
                  <span className="text-[0.8125rem] text-muted">Not marked yet</span>
                )}
              </li>
            );
          })}
      </ul>
    </>
  );
}

const TABS = [
  ["courses", "Courses", BookOpen],
  ["classes", "Live classes", Video],
  ["assignments", "Assignments", ClipboardCheck],
  ["announcements", "Announcements", Megaphone],
  ["attendance", "Attendance", UserCheck],
] as const;

function Inner() {
  const { slug } = useParams();
  const auth = useAuth();
  const programmes = useProgrammes();
  const courses = useCourses();
  const { held, loading: heldLoading } = useMyProgrammes();
  const track = programmes.find((t) => t.slug === slug && isPaid(t)) ?? null;
  const states = useCourseStates(track, courses);
  const [data, setData] = useState<ClassroomData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>(() => {
    const t = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("tab");
    return (TABS.find(([k]) => k === t)?.[0] ?? "courses") as (typeof TABS)[number][0];
  });
  const allowed = !!track && (!!held?.includes(track.id) || auth.user?.role === "admin");

  const reload = useCallback(async () => {
    if (!track) return;
    try {
      setData(await (await getBackend()).getClassroom(track.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't open the classroom.");
    }
  }, [track]);

  useEffect(() => {
    if (allowed) void reload();
  }, [allowed, reload]);

  useSeo({ title: track ? `Classroom | ${track.programmeName ?? track.title}` : "Classroom", description: "Your Professional Programme classroom.", noindex: true });

  if (!track) return <NotFound />;
  if (heldLoading) return <PageLoading />;
  if (!allowed)
    return (
      <div className="container-page max-w-2xl py-16 sm:py-24">
        <Lock aria-hidden className="h-8 w-8 text-brass-dark" />
        <h1 className="mt-4 font-serif text-[2.2rem] leading-tight">This classroom is for students of {track.programmeName ?? track.title}</h1>
        <p className="mt-3 text-[1.0625rem] text-muted">Enroll in the programme to open its classroom, live classes and assignments.</p>
        <ButtonLink to={`/programmes/${track.slug}`} className="mt-6">
          About the programme
        </ButtonLink>
      </div>
    );
  if (error)
    return (
      <div className="container-page py-16">
        <Alert tone="error">{error}</Alert>
      </div>
    );
  if (!data || !states) return <PageLoading label="Opening your classroom…" />;

  const counts: Partial<Record<(typeof TABS)[number][0], number>> = {
    assignments: data.assignments.filter((a) => !a.submission || a.submission.status === "returned").length,
    classes: data.sessions.filter((s) => new Date(s.endsAt ?? s.startsAt).getTime() > Date.now()).length,
  };

  return (
    <>
      <section className="border-b border-line bg-night text-cream">
        <div className="container-page py-10 sm:py-12">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-brass-light">Your classroom · Professional Programme</p>
          <h1 className="mt-3 font-serif text-[2.3rem] leading-tight sm:text-[2.9rem]">{track.programmeName ?? track.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem] text-cream/80">
            {data.batch ? (
              <span className="flex items-center gap-2">
                <CalendarDays aria-hidden className="h-4 w-4 text-brass-light" /> {data.batch.name}
                {data.batch.startsOn ? ` · ${new Date(`${data.batch.startsOn}T00:00:00`) > new Date() ? "starts" : "started"} ${formatDate(data.batch.startsOn)}` : ""}
                {data.batch.schedule ? ` · ${data.batch.schedule}` : ""}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CalendarDays aria-hidden className="h-4 w-4 text-brass-light" /> We'll confirm your batch and class times soon
              </span>
            )}
            {track.durationLabel && (
              <span className="flex items-center gap-2">
                <Clock aria-hidden className="h-4 w-4 text-brass-light" /> {track.durationLabel}
              </span>
            )}
            <Link to={`/programmes/${track.slug}`} className="flex items-center gap-2 hover:text-cream">
              <Award aria-hidden className="h-4 w-4 text-brass-light" /> Programme badge and certificate <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </section>
      <div className="container-page py-8">
        <div role="tablist" className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line">
          {TABS.map(([k, label, Icon]) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={tab === k}
              onClick={() => {
                setTab(k);
                window.history.replaceState(null, "", k === "courses" ? window.location.pathname : `?tab=${k}`);
              }}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[0.9375rem] font-medium ${tab === k ? "border-brass-dark text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              <Icon aria-hidden className="h-4 w-4" /> {label}
              {!!counts[k] && <span className="rounded-full bg-brass px-1.5 text-[0.6875rem] font-semibold text-on-brass">{counts[k]}</span>}
            </button>
          ))}
        </div>
        <div className="pt-8">
          {tab === "courses" && <Courses track={track} states={states} data={data} />}
          {tab === "classes" && <LiveClasses data={data} />}
          {tab === "assignments" && <Assignments data={data} reload={reload} />}
          {tab === "announcements" && <Announcements data={data} />}
          {tab === "attendance" && <Attendance data={data} />}
        </div>
      </div>
    </>
  );
}

export default function Classroom() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
