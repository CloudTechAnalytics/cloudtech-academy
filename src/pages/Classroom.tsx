import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router";
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Home,
  LayoutGrid,
  Library,
  Lock,
  Megaphone,
  PlayCircle,
  Video,
  X,
} from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading, RequireAuth, useAuth } from "@/lib/auth";
import { lessonPath, useCourses, useMyProgrammes, useProgrammes } from "@/lib/data";
import { LmsShellContext } from "@/lib/lms";
import { getBackend, type Certificate, type ClassAttendance, type ClassroomData, type Credential, type Enrollment, type Progress } from "@/lib/backend";
import { isPaid, programmeCourseIds } from "@/lib/commerce";
import { publishedLessons } from "@/lib/certificates";
import { formatDate, percent } from "@/lib/format";
import { findProject } from "@/content/projects";
import { programmeCertificateAvailable, requiredCourses, type Track } from "@/content/tracks";
import type { Course } from "@/content/types";
import { Mark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import { LessonContent } from "@/components/LessonContent";
import { ProgressBar } from "@/components/ProgressBar";
import { PaymentReminders } from "@/components/PaymentReminders";
import { DeleteCourse } from "@/components/DeleteCourse";
import NotFound from "./NotFound";

/**
 * The programme LMS (/classroom/<programme>/…): where Professional Programme students learn, in an app layout of its
 * own, separate from the public site. Home, every course in order (work done in a free course counts), the schedule of
 * live classes and due dates, assignments, grades, announcements, the programme badge and certificate, and the
 * student's free courses. Nothing here is labelled free.
 */

/* ================================================================ shared data */

type CourseState = { course: Course; percent: number; done: boolean; resume: string | null; started: boolean; required: boolean };

type Lms = {
  track: Track;
  held: Track[];
  data: ClassroomData;
  courses: Record<string, CourseState>;
  enrollments: Enrollment[];
  credentials: Credential[];
  certificates: Certificate[];
  reload: () => Promise<void>;
};
const LmsContext = createContext<Lms | null>(null);
const useLms = () => useContext(LmsContext)!;

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const timeOnly = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });
/** A class without an end time counts as two hours long. */
const ended = (s: { startsAt: string; endsAt: string | null }) => (s.endsAt ? new Date(s.endsAt).getTime() : new Date(s.startsAt).getTime() + 2 * 3600e3) <= Date.now();

const ATTENDANCE: Record<ClassAttendance, { label: string; cls: string }> = {
  present: { label: "Present", cls: "bg-success-bg text-success" },
  late: { label: "Late", cls: "bg-brass-pale text-brass-deeper" },
  absent: { label: "Absent", cls: "bg-danger/10 text-danger" },
  excused: { label: "Excused", cls: "bg-sand text-muted" },
};

function buildCourseStates(track: Track, courses: Course[], enrollments: Enrollment[], credentials: Credential[], progress: Record<string, Progress>) {
  const required = new Set(requiredCourses(track));
  const map: Record<string, CourseState> = {};
  for (const id of programmeCourseIds(track)) {
    const course = courses.find((c) => c.id === id);
    if (!course) continue;
    const lessons = publishedLessons(course);
    const done = progress[id]?.completedLessons ?? [];
    const completed = credentials.some((c) => c.courseId === id && c.kind === "course_completion" && c.status === "valid");
    const last = enrollments.find((e) => e.courseId === id)?.lastLessonId;
    const resume = lessons.find((l) => l.id === last) ?? lessons.find((l) => !done.includes(l.id)) ?? lessons[0];
    map[id] = {
      course,
      percent: completed ? 100 : percent(lessons.filter((l) => done.includes(l.id)).length, lessons.length),
      done: completed,
      resume: resume?.slug ?? null,
      started: done.length > 0,
      required: required.has(id),
    };
  }
  return map;
}

/* ================================================================ the shell */

const NAV = [
  { to: "", label: "Home", icon: Home },
  { to: "courses", label: "Courses", icon: BookOpen },
  { to: "schedule", label: "Schedule", icon: CalendarDays },
  { to: "assignments", label: "Assignments", icon: ClipboardCheck },
  { to: "grades", label: "Grades", icon: BarChart3 },
  { to: "announcements", label: "Announcements", icon: Megaphone },
  { to: "certificate", label: "Badges & certificate", icon: Award },
  { to: "free-courses", label: "Free courses", icon: Library },
] as const;
const MOBILE = ["", "courses", "schedule", "assignments"] as const;

function SideNav({ base, counts, onNavigate }: { base: string; counts: Record<string, number>; onNavigate?: () => void }) {
  const item = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition-colors ${isActive ? "bg-brass-pale/60 text-ink" : "text-ink/75 hover:bg-sand hover:text-ink"}`;
  return (
    <nav aria-label="Classroom" className="flex h-full flex-col">
      <ul className="space-y-0.5">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink to={n.to ? `${base}/${n.to}` : base} end={!n.to} className={item} onClick={onNavigate}>
              <n.icon aria-hidden className="h-[1.1rem] w-[1.1rem] shrink-0 text-brass-dark" />
              <span className="flex-1">{n.label}</span>
              {!!counts[n.to] && <span className="rounded-full bg-brass px-1.5 text-[0.6875rem] font-semibold text-on-brass">{counts[n.to]}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ProgrammeSwitcher({ track, held }: { track: Track; held: Track[] }) {
  const navigate = useNavigate();
  const name = (t: Track) => t.programmeName ?? t.title;
  if (held.length < 2) return <p className="truncate font-serif text-[1.15rem] leading-tight sm:text-[1.3rem]">{name(track)}</p>;
  return (
    <label className="block min-w-0">
      <span className="sr-only">Programme</span>
      <select value={track.slug} onChange={(e) => navigate(`/classroom/${e.target.value}`)} className="max-w-full truncate rounded-lg border border-line bg-paper px-2 py-1.5 font-serif text-[1.1rem]">
        {held.map((t) => (
          <option key={t.id} value={t.slug}>
            {name(t)}
          </option>
        ))}
      </select>
    </label>
  );
}

type Loaded = { data: ClassroomData; enrollments: Enrollment[]; credentials: Credential[]; certificates: Certificate[]; progress: Record<string, Progress> };

function Shell() {
  const { slug } = useParams();
  const auth = useAuth();
  const location = useLocation();
  const programmes = useProgrammes();
  const allCourses = useCourses();
  const { held, loading: heldLoading } = useMyProgrammes();
  const track = programmes.find((t) => t.slug === slug && isPaid(t)) ?? null;
  const allowed = !!track && (!!held?.includes(track.id) || auth.user?.role === "admin");
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [more, setMore] = useState(false);
  const [focus, setFocusState] = useState(() => {
    try {
      return localStorage.getItem("ct-lms-focus") === "1";
    } catch {
      return false;
    }
  });
  const setFocus = useCallback((on: boolean) => {
    setFocusState(on);
    try {
      localStorage.setItem("ct-lms-focus", on ? "1" : "0");
    } catch {
      /* the choice just isn't remembered */
    }
  }, []);

  const reload = useCallback(async () => {
    if (!track) return;
    try {
      const b = await getBackend();
      const ids = programmeCourseIds(track);
      const [data, enrollments, credentials, certificates, progress] = await Promise.all([
        b.getClassroom(track.id),
        b.listEnrollments(),
        b.listMyCredentials(),
        b.listMyCertificates(),
        Promise.all(ids.map((id) => b.getProgress(id))),
      ]);
      setLoaded({ data, enrollments, credentials, certificates, progress: Object.fromEntries(ids.map((id, i) => [id, progress[i]])) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't open the classroom.");
    }
  }, [track]);

  // Lessons record progress as you go, so overviews refresh each time you come back to one. A lesson opened
  // straight from a link still loads the classroom once.
  const isLesson = /^\/classroom\/[^/]+\/[^/]+\/[^/]+/.test(location.pathname);
  const hasLoaded = loaded !== null;
  useEffect(() => {
    if (allowed && (!isLesson || !hasLoaded)) void reload();
    setMore(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, isLesson, location.pathname, reload]);

  const heldTracks = useMemo(() => programmes.filter((t) => held?.includes(t.id) && isPaid(t)), [programmes, held]);
  const value = useMemo<Lms | null>(
    () =>
      track && loaded
        ? {
            track,
            held: heldTracks,
            data: loaded.data,
            enrollments: loaded.enrollments,
            credentials: loaded.credentials,
            certificates: loaded.certificates,
            reload,
            courses: buildCourseStates(track, allCourses, loaded.enrollments, loaded.credentials, loaded.progress),
          }
        : null,
    [track, loaded, heldTracks, allCourses, reload],
  );

  useSeo({ title: track ? `${track.programmeName ?? track.title} | Classroom` : "Classroom", description: "Your Professional Programme classroom.", noindex: true });

  if (!track) return <NotFound />;
  if (heldLoading) return <PageLoading />;
  if (!allowed)
    return (
      <div className="flex min-h-screen items-center bg-ivory">
        <div className="container-page max-w-2xl py-16">
          <Lock aria-hidden className="h-8 w-8 text-brass-dark" />
          <h1 className="mt-4 font-serif text-[2.2rem] leading-tight">This classroom is for students of {track.programmeName ?? track.title}</h1>
          <p className="mt-3 text-[1.0625rem] text-muted">Enroll in the programme to open its classroom, live classes and assignments.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to={`/programmes/${track.slug}`}>About the programme</ButtonLink>
            <ButtonLink to="/" variant="secondary">
              Back to website
            </ButtonLink>
          </div>
        </div>
      </div>
    );

  const base = `/classroom/${track.slug}`;
  const counts: Record<string, number> = value
    ? {
        assignments: value.data.assignments.filter((a) => !a.submission || a.submission.status === "returned").length,
        schedule: value.data.sessions.filter((s) => !ended(s) && new Date(s.startsAt).getTime() - Date.now() < 7 * 864e5).length,
      }
    : {};
  const hideNav = focus && isLesson;

  return (
    <LmsShellContext.Provider value={{ focus: hideNav, setFocus }}>
      <div className="min-h-screen bg-ivory">
        {!hideNav && (
          <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-paper px-3 py-4 lg:flex">
            <Link to="/" className="mb-6 flex items-center gap-2.5 px-2" title="Go to the website">
              <Mark className="h-8 w-8 shrink-0" />
              <span className="leading-tight">
                <span className="block font-serif text-[1.1rem] font-bold">CloudTech</span>
                <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brass-dark">Classroom</span>
              </span>
            </Link>
            <SideNav base={base} counts={counts} />
          </aside>
        )}

        <div className={hideNav ? "" : "lg:pl-64"}>
          <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
            <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
              <Link to="/" className="lg:hidden" aria-label="Go to the website">
                <Mark className="h-7 w-7" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="hidden text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-brass-dark sm:block">Professional Programme</p>
                <ProgrammeSwitcher track={track} held={heldTracks.length ? heldTracks : [track]} />
              </div>
              {hideNav && (
                <button type="button" onClick={() => setFocus(false)} className={buttonClass("secondary")}>
                  Exit focus
                </button>
              )}
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>

          <main id="main" className="pb-24 lg:pb-10">
            {error ? (
              <div className="p-6">
                <Alert tone="error">{error}</Alert>
              </div>
            ) : !value ? (
              <PageLoading label="Opening your classroom…" />
            ) : (
              <LmsContext.Provider value={value}>
                <Outlet />
              </LmsContext.Provider>
            )}
          </main>
        </div>

        {!hideNav && (
          <nav aria-label="Classroom shortcuts" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper lg:hidden">
            <ul className="grid grid-cols-5">
              {MOBILE.map((k) => {
                const n = NAV.find((x) => x.to === k)!;
                return (
                  <li key={k}>
                    <NavLink
                      to={k ? `${base}/${k}` : base}
                      end={!k}
                      className={({ isActive }) => `relative flex flex-col items-center gap-0.5 py-2 text-[0.6875rem] font-medium ${isActive ? "text-brass-dark" : "text-muted"}`}
                    >
                      <n.icon aria-hidden className="h-5 w-5" />
                      {n.label}
                      {!!counts[k] && <span className="absolute right-[22%] top-1 h-2 w-2 rounded-full bg-brass" />}
                    </NavLink>
                  </li>
                );
              })}
              <li>
                <button type="button" onClick={() => setMore(true)} className="flex w-full flex-col items-center gap-0.5 py-2 text-[0.6875rem] font-medium text-muted">
                  <LayoutGrid aria-hidden className="h-5 w-5" /> More
                </button>
              </li>
            </ul>
          </nav>
        )}
        {more && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Classroom menu">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-night/40" onClick={() => setMore(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-paper p-4 pb-8">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">Menu</p>
                <button type="button" onClick={() => setMore(false)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sand">
                  <X aria-hidden className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <SideNav base={base} counts={counts} onNavigate={() => setMore(false)} />
            </div>
          </div>
        )}
      </div>
    </LmsShellContext.Provider>
  );
}

export default function LmsLayout() {
  return (
    <RequireAuth>
      <Shell />
    </RequireAuth>
  );
}

/** /classroom with no programme: the first programme the learner holds, or their dashboard. */
export function ClassroomIndex() {
  const programmes = useProgrammes();
  const { held, loading } = useMyProgrammes();
  if (loading) return <PageLoading />;
  const first = programmes.find((t) => held?.includes(t.id) && isPaid(t));
  return <Navigate to={first ? `/classroom/${first.slug}` : "/dashboard"} replace />;
}

/* ================================================================ page frame */

function Page({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10 lg:py-10 2xl:px-14">
      <div className="mb-8">
        <h1 className="font-serif text-[2rem] leading-tight sm:text-[2.4rem]">{title}</h1>
        {intro && <p className="mt-1.5 max-w-2xl text-[0.9375rem] text-muted">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

function CourseCard({ s, track, why }: { s: CourseState; track: Track; why?: string }) {
  return (
    <li className="flex min-w-0 flex-col rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-serif text-[1.2rem] leading-snug">{s.course.title}</p>
        {s.done ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-bg px-2.5 py-0.5 text-[0.75rem] font-semibold text-success">
            <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> Complete
          </span>
        ) : !s.required ? (
          <span className="shrink-0 rounded-full bg-sand px-2.5 py-0.5 text-[0.75rem] text-muted">Optional</span>
        ) : null}
      </div>
      {why && <p className="mt-1 text-[0.875rem] text-muted">{why}</p>}
      <div className="mt-4">
        <ProgressBar value={s.percent} label={`${s.course.title} progress`} />
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
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

/* ================================================================ Home */

function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const ms = new Date(to).getTime() - now;
  if (ms <= 0) return <span className="font-semibold text-success">Happening now</span>;
  const d = Math.floor(ms / 864e5);
  const h = Math.floor((ms % 864e5) / 36e5);
  const m = Math.floor((ms % 36e5) / 6e4);
  return <span>Starts in {d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m} min`}</span>;
}

export function LmsHome() {
  const { track, data, courses } = useLms();
  const auth = useAuth();
  const list = Object.values(courses);
  const overall = list.length ? Math.round(list.reduce((n, s) => n + s.percent, 0) / list.length) : 0;
  const next = list.find((s) => !s.done && s.started) ?? list.find((s) => !s.done);
  const nextClass = data.sessions.find((s) => !ended(s));
  const due = data.assignments.filter((a) => !a.submission || a.submission.status === "returned").sort((a, b) => (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999"));
  const latest = data.announcements[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const base = `/classroom/${track.slug}`;
  const batch = data.batch;

  return (
    <Page
      title={`${greeting}, ${auth.user?.fullName.split(" ")[0] || "there"}`}
      intro={
        batch
          ? `${batch.name}${batch.schedule ? ` · ${batch.schedule}` : ""}${batch.startsOn ? ` · ${new Date(`${batch.startsOn}T00:00:00`) > new Date() ? "starts" : "started"} ${formatDate(batch.startsOn)}` : ""}`
          : "We'll confirm your batch and class times soon."
      }
    >
      <PaymentReminders />
      <div className="mt-2 grid gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <section className="rounded-2xl border border-line-strong bg-paper p-5 lg:col-span-2">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">Continue learning</p>
          {next?.resume ? (
            <>
              <p className="mt-2 font-serif text-[1.5rem] leading-snug">{next.course.title}</p>
              <div className="mt-3 max-w-md">
                <ProgressBar value={next.percent} label={`${next.course.title} progress`} />
              </div>
              <ButtonLink to={lessonPath(next.course.slug, next.resume, track.slug)} className="mt-5" arrow>
                {next.started ? "Continue" : "Start"}
              </ButtonLink>
            </>
          ) : (
            <p className="mt-2 text-muted">Every course is complete. Claim your programme badge from Badges & certificate.</p>
          )}
        </section>
        <section className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">Programme progress</p>
          <p className="mt-2 font-serif text-[2.6rem] leading-none">{overall}%</p>
          <div className="mt-3">
            <ProgressBar value={overall} label="Programme progress" showValue={false} />
          </div>
          <p className="mt-2 text-[0.875rem] text-muted">
            {list.filter((s) => s.done).length} of {list.length} courses complete
          </p>
        </section>

        <section className="rounded-2xl border border-line bg-paper p-5">
          <p className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">
            <Video aria-hidden className="h-4 w-4 text-brass-dark" /> Next live class
          </p>
          {nextClass ? (
            <>
              <p className="mt-2 font-semibold">{nextClass.title}</p>
              <p className="text-[0.875rem] text-muted">{when(nextClass.startsAt)}</p>
              <p className="mt-1 text-[0.875rem] text-brass-dark">
                <Countdown to={nextClass.startsAt} />
              </p>
              {nextClass.joinUrl && (
                <a href={nextClass.joinUrl} target="_blank" rel="noopener noreferrer" className={`${buttonClass("primary")} mt-3`}>
                  <PlayCircle aria-hidden className="h-4 w-4" /> Join class
                </a>
              )}
            </>
          ) : (
            <p className="mt-2 text-[0.9375rem] text-muted">No class scheduled yet.</p>
          )}
        </section>
        <section className="rounded-2xl border border-line bg-paper p-5">
          <p className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">
            <ClipboardCheck aria-hidden className="h-4 w-4 text-brass-dark" /> To hand in
          </p>
          {due.length ? (
            <ul className="mt-2 space-y-2">
              {due.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <Link to={`${base}/assignments`} className="block font-semibold hover:text-brass-dark">
                    {a.title}
                  </Link>
                  <span className="text-[0.8125rem] text-muted">{a.dueAt ? `Due ${when(a.dueAt)}` : "No due date"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[0.9375rem] text-muted">Nothing to hand in right now.</p>
          )}
        </section>
        <section className="rounded-2xl border border-line bg-paper p-5">
          <p className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">
            <Megaphone aria-hidden className="h-4 w-4 text-brass-dark" /> Latest announcement
          </p>
          {latest ? (
            <Link to={`${base}/announcements`} className="mt-2 block">
              <span className="block font-semibold hover:text-brass-dark">{latest.title}</span>
              <span className="line-clamp-3 text-[0.875rem] text-muted">{latest.body}</span>
            </Link>
          ) : (
            <p className="mt-2 text-[0.9375rem] text-muted">Nothing yet.</p>
          )}
        </section>
      </div>

      <div className="mt-10 flex items-end justify-between gap-3">
        <h2 className="font-serif text-[1.5rem]">Your courses</h2>
        <Link to={`${base}/courses`} className="text-[0.9375rem] font-semibold text-brass-dark">
          See all
        </Link>
      </div>
      {/* Three on laptops, four where there's room. */}
      <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 [&>*]:min-w-0 [&>*:nth-child(4)]:hidden 2xl:[&>*:nth-child(4)]:flex">
        {list
          .filter((s) => !s.done)
          .slice(0, 4)
          .map((s) => (
            <CourseCard key={s.course.id} s={s} track={track} />
          ))}
      </ul>
    </Page>
  );
}

/* ================================================================ Courses */

export function LmsCourses() {
  const { track, courses } = useLms();
  return (
    <Page title="Courses" intro="Every course in your programme, in the order we recommend. Courses you'd already started keep your progress.">
      <div className="space-y-10">
        {track.stages.map((stage, si) => (
          <section key={stage.title}>
            <h2 className="font-serif text-[1.5rem]">
              <span className="text-brass-dark">{si + 1}.</span> {stage.title}
            </h2>
            <p className="mt-1 text-[0.9375rem] text-muted">{stage.summary}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 [&>*]:min-w-0">
              {stage.items.map((item) => {
                if (item.kind === "course") {
                  const s = courses[item.courseId];
                  return s ? <CourseCard key={item.courseId} s={s} track={track} why={item.why} /> : null;
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
    </Page>
  );
}

/* ================================================================ Schedule: calendar and agenda */

type CalEvent = { id: string; at: Date; title: string; kind: "class" | "due"; href?: string; joinUrl?: string | null; recordingUrl?: string | null; endsAt?: string | null; detail?: string | null };

const gcalStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const googleCalendar = (e: CalEvent, programme: string) => {
  const end = e.endsAt ? new Date(e.endsAt) : new Date(e.at.getTime() + (e.kind === "class" ? 2 * 3600e3 : 30 * 60e3));
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.kind === "due" ? "Due: " : ""}${e.title} · ${programme}`,
    dates: `${gcalStamp(e.at)}/${gcalStamp(end)}`,
    details: [e.detail, e.joinUrl ? `Join: ${e.joinUrl}` : null, "https://academy.cloudtechanalytics.com/classroom"].filter(Boolean).join("\n\n"),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

function EventRow({ e, programme }: { e: CalEvent; programme: string }) {
  const soon = e.at.getTime() > Date.now() - 3 * 3600e3;
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-4">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${e.kind === "class" ? "bg-brass-pale/60 text-brass-dark" : "bg-sand text-ink"}`}>
        {e.kind === "class" ? <Video aria-hidden className="h-5 w-5" /> : <ClipboardCheck aria-hidden className="h-5 w-5" />}
      </span>
      <span className="min-w-[12rem] flex-1">
        <span className="block font-medium">
          {e.kind === "due" ? "Due: " : ""}
          {e.title}
        </span>
        <span className="block text-[0.8125rem] text-muted">
          {when(e.at.toISOString())}
          {e.endsAt ? ` – ${timeOnly(e.endsAt)}` : ""}
        </span>
      </span>
      <span className="flex flex-wrap gap-2">
        {e.kind === "class" && e.joinUrl && soon && (
          <a href={e.joinUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
            <PlayCircle aria-hidden className="h-4 w-4" /> Join
          </a>
        )}
        {e.kind === "class" && e.recordingUrl && (
          <a href={e.recordingUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
            <Video aria-hidden className="h-4 w-4" /> Recording
          </a>
        )}
        {e.href && (
          <Link to={e.href} className={buttonClass("secondary")}>
            Open
          </Link>
        )}
        {e.at.getTime() > Date.now() && (
          <a href={googleCalendar(e, programme)} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost")} title="Add to Google Calendar">
            <CalendarPlus aria-hidden className="h-4 w-4" /> <span className="hidden sm:inline">Add to calendar</span>
          </a>
        )}
      </span>
    </li>
  );
}

export function LmsSchedule() {
  const { track, data } = useLms();
  const base = `/classroom/${track.slug}`;
  const programme = track.programmeName ?? track.title;
  const events: CalEvent[] = useMemo(
    () =>
      [
        ...data.sessions.map((s) => ({ id: s.id, at: new Date(s.startsAt), title: s.title, kind: "class" as const, joinUrl: s.joinUrl, recordingUrl: s.recordingUrl, endsAt: s.endsAt, detail: s.description })),
        ...data.assignments.filter((a) => a.dueAt).map((a) => ({ id: a.id, at: new Date(a.dueAt!), title: a.title, kind: "due" as const, href: `${base}/assignments` })),
      ].sort((a, b) => a.at.getTime() - b.at.getTime()),
    [data, base],
  );
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [picked, setPicked] = useState(() => new Date().toDateString());

  const first = new Date(month);
  first.setDate(1 - ((month.getDay() + 6) % 7)); // weeks start on Monday
  const days = Array.from({ length: 42 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + i));
  const on = (d: Date) => events.filter((e) => e.at.toDateString() === d.toDateString());
  const today = new Date().toDateString();
  const dayEvents = events.filter((e) => e.at.toDateString() === picked);
  const upcoming = events.filter((e) => (e.kind === "class" ? !ended({ startsAt: e.at.toISOString(), endsAt: e.endsAt ?? null }) : e.at.getTime() >= Date.now()));
  const past = data.sessions.filter((s) => ended(s)).reverse();

  return (
    <Page title="Schedule" intro="Live classes and assignment due dates, shown in your own time zone.">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section aria-label="Calendar" className="min-w-0 rounded-2xl border border-line bg-paper p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sand" aria-label="Previous month">
              <ChevronLeft aria-hidden className="h-5 w-5" />
            </button>
            <p className="font-serif text-[1.3rem]">{month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
            <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sand" aria-label="Next month">
              <ChevronRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center text-[0.75rem] font-semibold text-muted">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const list = on(d);
              const key = d.toDateString();
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPicked(key)}
                  aria-pressed={picked === key}
                  aria-label={`${d.toDateString()}${list.length ? `, ${list.length} ${list.length === 1 ? "item" : "items"}` : ""}`}
                  className={`flex min-h-12 min-w-0 flex-col items-center rounded-lg border p-1 text-[0.8125rem] sm:min-h-20 sm:items-stretch sm:text-left ${
                    picked === key ? "border-brass bg-brass-pale/40" : "border-transparent hover:bg-sand"
                  } ${d.getMonth() === month.getMonth() ? "" : "opacity-40"}`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${key === today ? "bg-ink font-semibold text-paper" : ""}`}>{d.getDate()}</span>
                  <span className="mt-0.5 hidden space-y-0.5 sm:block">
                    {list.slice(0, 2).map((e) => (
                      <span key={e.id} className={`block truncate rounded px-1 text-[0.6875rem] ${e.kind === "class" ? "bg-brass-pale text-brass-deeper" : "bg-sand text-ink"}`}>
                        {e.kind === "due" ? "Due: " : `${timeOnly(e.at.toISOString())} `}
                        {e.title}
                      </span>
                    ))}
                    {list.length > 2 && <span className="block text-[0.6875rem] text-muted">+{list.length - 2} more</span>}
                  </span>
                  {list.length > 0 && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brass sm:hidden" />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-[0.875rem] font-semibold">{new Date(picked).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
            {dayEvents.length ? (
              <ul className="mt-2 space-y-2">
                {dayEvents.map((e) => (
                  <EventRow key={e.id} e={e} programme={programme} />
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[0.875rem] text-muted">Nothing on this day.</p>
            )}
          </div>
        </section>
        <section aria-labelledby="upcoming" className="min-w-0">
          <h2 id="upcoming" className="font-serif text-[1.4rem]">
            Coming up
          </h2>
          {upcoming.length ? (
            <ul className="mt-3 space-y-2">
              {upcoming.map((e) => (
                <EventRow key={e.id} e={e} programme={programme} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-muted">Nothing scheduled yet. Your instructor will add classes here.</p>
          )}
          {past.length > 0 && (
            <>
              <h2 className="mt-8 font-serif text-[1.4rem]">Past classes</h2>
              <ul className="mt-3 space-y-2">
                {past.map((s) => {
                  const m = data.attendance.find((a) => a.sessionId === s.id)?.status;
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
            </>
          )}
        </section>
      </div>
    </Page>
  );
}

/* ================================================================ Assignments */

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

export function LmsAssignments() {
  const { data, reload } = useLms();
  const todo = data.assignments.filter((a) => !a.submission || a.submission.status === "returned");
  const handedIn = data.assignments.filter((a) => a.submission && a.submission.status !== "returned");
  return (
    <Page title="Assignments" intro="Work your instructor marks. Required assignments must be passed before you can claim the programme badge.">
      {!data.assignments.length ? (
        <p className="text-muted">No assignments yet. They'll appear here when your instructor sets them.</p>
      ) : (
        <div className="space-y-8">
          {todo.length > 0 && (
            <section>
              <h2 className="mb-3 font-serif text-[1.4rem]">To do</h2>
              <ul className="space-y-3">
                {todo.map((a) => (
                  <AssignmentCard key={`${a.id}${a.submission?.status ?? ""}`} a={a} onSaved={reload} />
                ))}
              </ul>
            </section>
          )}
          {handedIn.length > 0 && (
            <section>
              <h2 className="mb-3 font-serif text-[1.4rem]">Handed in</h2>
              <ul className="space-y-3">
                {handedIn.map((a) => (
                  <AssignmentCard key={`${a.id}${a.submission?.status ?? ""}`} a={a} onSaved={reload} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Page>
  );
}

/* ================================================================ Grades */

export function LmsGrades() {
  const { data, courses } = useLms();
  const graded = data.assignments.filter((a) => a.submission?.status === "graded");
  const avg = graded.length ? Math.round(graded.reduce((n, a) => n + ((a.submission!.score ?? 0) / a.maxScore) * 100, 0) / graded.length) : null;
  const held = data.sessions.filter((s) => new Date(s.startsAt).getTime() <= Date.now());
  const marks = held.map((s) => data.attendance.find((a) => a.sessionId === s.id)?.status).filter((m): m is ClassAttendance => !!m);
  const attended = marks.filter((m) => m === "present" || m === "late").length;
  const list = Object.values(courses);
  const stat = (label: string, value: string, note: string) => (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[0.875rem] text-muted">{label}</p>
      <p className="mt-1 font-serif text-[2.2rem] leading-none">{value}</p>
      <p className="mt-1.5 text-[0.8125rem] text-muted">{note}</p>
    </div>
  );
  return (
    <Page title="Grades" intro="Your assignment scores, attendance and courses in one place.">
      <div className="grid gap-4 sm:grid-cols-3">
        {stat("Assignment average", avg === null ? "–" : `${avg}%`, `${graded.length} of ${data.assignments.length} graded`)}
        {stat("Attendance", marks.length ? `${percent(attended, marks.length)}%` : "–", `${attended} of ${held.length} classes attended`)}
        {stat("Courses complete", `${list.filter((s) => s.done).length}/${list.length}`, `${list.filter((s) => s.required && !s.done).length} required still to finish`)}
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-[1.4rem]">Assignments</h2>
        {data.assignments.length ? (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full text-left text-[0.9375rem]">
              <thead className="border-b border-line bg-sand/60 text-[0.8125rem] text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Assignment</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {data.assignments.map((a) => {
                  const s = a.submission;
                  const passed = s?.status === "graded" && (a.passScore === null || (s.score ?? 0) >= a.passScore);
                  return (
                    <tr key={a.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3">
                        {a.title}
                        {!a.required && <span className="ml-1 text-[0.75rem] text-muted">(optional)</span>}
                      </td>
                      <td className="px-4 py-3 text-[0.875rem]">
                        {!s ? "Not handed in" : s.status === "graded" ? (passed ? "Passed" : "Not passed") : s.status === "returned" ? "Returned to improve" : "Awaiting grade"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{s?.status === "graded" ? `${s.score}/${a.maxScore}` : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-muted">No assignments yet.</p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-[1.4rem]">Attendance</h2>
        {held.length ? (
          <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-paper">
            {held
              .slice()
              .reverse()
              .map((s) => {
                const m = data.attendance.find((a) => a.sessionId === s.id)?.status;
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
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
        ) : (
          <p className="mt-2 text-muted">Your attendance appears here once classes start.</p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-[1.4rem]">Courses</h2>
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-paper">
          {list.map((s) => (
            <li key={s.course.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <span className="min-w-0">
                {s.course.title}
                {!s.required && <span className="ml-1 text-[0.75rem] text-muted">(optional)</span>}
              </span>
              <span className={`text-[0.875rem] font-semibold ${s.done ? "text-success" : "text-muted"}`}>{s.done ? "Complete" : `${s.percent}%`}</span>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}

/* ================================================================ Announcements */

export function LmsAnnouncements() {
  const { data } = useLms();
  return (
    <Page title="Announcements" intro="Updates from your instructors.">
      {data.announcements.length ? (
        <ul className="max-w-3xl space-y-3">
          {data.announcements.map((a) => (
            <li key={a.id} className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-[0.8125rem] text-muted">{formatDate(a.createdAt)}</p>
              <p className="mt-1 font-serif text-[1.25rem]">{a.title}</p>
              <p className="mt-2 whitespace-pre-line text-[0.9375rem] text-ink/90">{a.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No announcements yet.</p>
      )}
    </Page>
  );
}

/* ================================================================ Badges & certificate */

export function LmsCertificate() {
  const { track, data, courses, credentials, certificates, reload } = useLms();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const required = Object.values(courses).filter((s) => s.required);
  const requiredDone = required.filter((s) => s.done).length;
  const requiredAssignments = data.assignments.filter((a) => a.required);
  const passed = requiredAssignments.filter((a) => a.submission?.status === "graded" && (a.passScore === null || (a.submission.score ?? 0) >= a.passScore)).length;
  const badge = credentials.find((c) => c.kind === "track_completion" && c.trackId === track.id && c.status === "valid");
  const cert = certificates.find((c) => c.source === "programme" && c.trackId === track.id && c.status === "valid");
  const ready = requiredDone === required.length && passed === requiredAssignments.length;
  const ids = programmeCourseIds(track);
  const earned = credentials.filter((c) => c.status === "valid" && c.kind !== "track_completion" && (ids.includes(c.courseId) || c.kind === "project_badge"));

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
    setBusy(false);
  };

  return (
    <Page title="Badges & certificate" intro={`Complete the programme to earn the ${track.badge} badge and your Professional Certificate.`}>
      <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <section className="rounded-2xl border border-line-strong bg-paper p-6">
          <p className="flex items-center gap-2 font-semibold">
            <Award aria-hidden className="h-5 w-5 text-brass-dark" /> {track.badge}
          </p>
          {badge ? (
            <>
              <p className="mt-2 text-success">You've earned the programme badge.</p>
              <ButtonLink to={`/credentials/${badge.credentialId}`} variant="secondary" className="mt-4">
                View and share your badge
              </ButtonLink>
            </>
          ) : (
            <>
              <ul className="mt-4 space-y-2 text-[0.9375rem]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 aria-hidden className={`h-4 w-4 ${requiredDone === required.length ? "text-success" : "text-line-strong"}`} />
                  Required courses: {requiredDone} of {required.length}
                </li>
                {requiredAssignments.length > 0 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 aria-hidden className={`h-4 w-4 ${passed === requiredAssignments.length ? "text-success" : "text-line-strong"}`} />
                    Required assignments passed: {passed} of {requiredAssignments.length}
                  </li>
                )}
              </ul>
              <Button className="mt-5" disabled={!ready} loading={busy} onClick={() => void act(async () => (await getBackend()).issueTrackCredential(track.id))}>
                Claim your programme badge
              </Button>
              {!ready && <p className="mt-2 text-[0.8125rem] text-muted">Unlocks when everything above is done.</p>}
            </>
          )}
        </section>
        <section className="rounded-2xl border border-line-strong bg-paper p-6">
          <p className="flex items-center gap-2 font-semibold">
            <GraduationCap aria-hidden className="h-5 w-5 text-brass-dark" /> Professional Certificate
          </p>
          {cert ? (
            <>
              <p className="mt-2 text-success">Your official certificate is ready.</p>
              <ButtonLink to={`/dashboard/certificates/${cert.certificateId}`} className="mt-4">
                View and download
              </ButtonLink>
            </>
          ) : !programmeCertificateAvailable(track) ? (
            <p className="mt-2 text-[0.9375rem] text-muted">Opens when the capstone project for this programme is released.</p>
          ) : badge ? (
            <>
              <p className="mt-2 text-[0.9375rem] text-muted">Included with your programme: one official, verifiable certificate.</p>
              <Button className="mt-4" loading={busy} onClick={() => void act(async () => (await getBackend()).claimProgrammeCertificate(track.id))}>
                Claim your certificate
              </Button>
            </>
          ) : (
            <p className="mt-2 text-[0.9375rem] text-muted">Included with your programme. Claim it once you've earned the programme badge.</p>
          )}
        </section>
      </div>
      <div aria-live="polite" className="mt-4">
        {error && <Alert tone="error">{error}</Alert>}
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-[1.4rem]">Badges you've earned</h2>
        {earned.length ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {earned.map((c) => (
              <li key={c.credentialId}>
                <Link to={`/credentials/${c.credentialId}`} className="flex items-center gap-3 rounded-xl border border-line bg-paper p-4 hover:border-brass">
                  <Award aria-hidden className="h-5 w-5 shrink-0 text-brass-dark" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{c.badgeName}</span>
                    <span className="block text-[0.8125rem] text-muted">{formatDate(c.issuedAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted">Pass a module check or complete a course to earn your first badge.</p>
        )}
      </section>
    </Page>
  );
}

/* ================================================================ Free courses */

export function LmsFreeCourses() {
  const { track, held, enrollments, credentials, reload } = useLms();
  const courses = useCourses();
  const inProgrammes = new Set([...held.flatMap((t) => programmeCourseIds(t)), ...programmeCourseIds(track)]);
  const mine = enrollments
    .filter((e) => e.source === "free" && !inProgrammes.has(e.courseId))
    .map((e) => courses.find((c) => c.id === e.courseId))
    .filter((c): c is Course => !!c);
  return (
    <Page title="Free courses" intro="Free courses you've started outside your programme. They open on the public site. You can delete one you no longer want, along with its badges.">
      {mine.length ? (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {mine.map((c) => (
            <li key={c.id} className="flex flex-col rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-serif text-[1.2rem] leading-snug">{c.title}</p>
                <DeleteCourse courseId={c.id} title={c.title} badges={credentials} onDeleted={reload} />
              </div>
              <p className="mt-1 line-clamp-2 text-[0.875rem] text-muted">{c.summary}</p>
              <div className="mt-auto pt-4">
                <ButtonLink to={`/courses/${c.slug}`} variant="secondary">
                  Open course <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-line-strong p-8 text-center">
          <p>You haven't started any free courses outside your programme.</p>
          <ButtonLink to="/courses" variant="secondary" className="mt-4">
            Browse free courses <ExternalLink aria-hidden className="h-3.5 w-3.5" />
          </ButtonLink>
        </div>
      )}
      <p className="mt-6 flex items-center gap-2 text-[0.875rem] text-muted">
        <Clock aria-hidden className="h-4 w-4" /> Free courses start over after 14 days without activity. Your programme courses never do.
      </p>
    </Page>
  );
}
