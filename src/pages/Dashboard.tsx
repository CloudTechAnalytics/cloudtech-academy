import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, Award, BookOpen, CheckCircle2, ExternalLink, GraduationCap, ShieldCheck, Trophy, X } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useAuth, PageLoading, RequireAuth } from "@/lib/auth";
import { useCourses } from "@/lib/data";
import { getBackend, type AttemptResult, type Certificate, type Credential, type Enrollment, type PracticeSubmission, type Progress } from "@/lib/backend";
import { findProject } from "@/content/projects";
import { ProjectCover } from "@/components/ProjectCover";
import { eligibility } from "@/lib/certificates";
import { credentialBadge, credentialKindLabel } from "@/lib/badges";
import { formatDate } from "@/lib/format";
import { Button, ButtonLink } from "@/components/Button";
import { daysUntilReset, RESET_AFTER_DAYS } from "@/lib/inactivity";
import { CourseCard } from "@/components/CourseCard";
import { ProgressBar } from "@/components/ProgressBar";
import { BadgeArtwork } from "@/components/BadgeArtwork";
import { ShareMenu } from "@/components/ShareMenu";
import { publishedLessons } from "@/lib/certificates";

type Row = { enrollment: Enrollment; progress: Progress; attempts: AttemptResult[] };

function DashboardInner() {
  const auth = useAuth();
  const courses = useCourses();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [practice, setPractice] = useState<PracticeSubmission[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [resetIds, setResetIds] = useState<string[]>([]);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const art = useRef<SVGSVGElement>(null);

  const load = useCallback(async () => {
    const b = await getBackend();
    // Courses untouched for 14 days start over before anything is shown.
    const reset = await b.applyInactivityResets().catch(() => [] as string[]);
    if (reset.length) setResetIds(reset);
    const [enrollments, creds, certificates, subs] = await Promise.all([
      b.listEnrollments(),
      b.listMyCredentials(),
      b.listMyCertificates(),
      b.listMyPracticeSubmissions().catch(() => []),
    ]);
    const [progress, attempts] = await Promise.all([
      Promise.all(enrollments.map((e) => b.getProgress(e.courseId))),
      Promise.all(
        enrollments.map(async (e) => {
          const a = await b.getAssessment(e.courseId);
          return a ? b.listAttempts(a.id) : [];
        }),
      ),
    ]);
    setRows(enrollments.map((enrollment, i) => ({ enrollment, progress: progress[i], attempts: attempts[i] })));
    setCredentials(creds);
    setCerts(certificates);
    setPractice(subs);
  }, []);

  useEffect(() => {
    void load().catch(() => setRows([]));
  }, [load]);

  const remove = async (courseId: string) => {
    setRemoving(true);
    setRemoveError(null);
    try {
      await (await getBackend()).removeCourse(courseId);
      setConfirming(null);
      await load();
    } catch (e) {
      setRemoveError(e instanceof Error ? e.message : "Couldn't remove the course. Try again.");
    } finally {
      setRemoving(false);
    }
  };

  useSeo({ title: "Dashboard | CloudTech Academy", description: "Your learning, badges, certificates and credentials.", noindex: true });
  if (!rows || auth.status !== "signed-in") return <PageLoading />;

  const firstName = auth.user.fullName.split(" ")[0] || "there";
  const valid = credentials.filter((c) => c.status === "valid");
  const learning = rows
    .map((r) => {
      const course = courses.find((c) => c.id === r.enrollment.courseId);
      if (!course) return null;
      const lessons = publishedLessons(course);
      const badges = new Set(valid.filter((c) => c.courseId === course.id && c.kind === "module_badge").map((c) => c.moduleId ?? ""));
      const status = eligibility(course, r.progress, r.attempts, null, null, badges);
      const completion = valid.find((c) => c.courseId === course.id && c.kind === "course_completion");
      const resume = lessons.find((l) => l.id === r.enrollment.lastLessonId) ?? lessons.find((l) => !r.progress.completedLessons.includes(l.id)) ?? lessons[0];
      // Warn only when there's something to lose: done lessons, tasks or assessment attempts.
      const hasProgress = r.progress.completedLessons.length > 0 || r.progress.completedExercises.length > 0 || r.attempts.length > 0;
      const resetsIn = !completion && hasProgress ? daysUntilReset(r.enrollment.lastActiveAt) : null;
      return { course, percent: completion ? 100 : status.percent, completion, resume, resetsIn };
    })
    .filter((x) => x !== null);
  const inProgress = learning.filter((l) => !l.completion);
  const completed = learning.filter((l) => l.completion);
  const enrolledIds = new Set(learning.map((a) => a.course.id));
  const suggestions = courses.filter((c) => !enrolledIds.has(c.id)).slice(0, 3);
  const opened = valid.find((c) => c.credentialId === open);

  return (
    <div className="container-page py-12 sm:py-16">
      <p className="kicker">Dashboard</p>
      <h1 className="mt-3 font-serif text-[2.3rem] leading-tight sm:text-[2.8rem]">Welcome back, {firstName}</h1>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "Courses in progress", value: inProgress.length },
          { icon: CheckCircle2, label: "Completed courses", value: completed.length },
          { icon: Trophy, label: "Badges earned", value: valid.length },
          { icon: GraduationCap, label: "Certificates", value: certs.filter((c) => c.status === "valid").length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col justify-between rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <dt className="flex items-center gap-2 text-[0.875rem] text-muted">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass-pale/60 text-brass-dark">
                <Icon aria-hidden className="h-4 w-4" />
              </span>
              {label}
            </dt>
            <dd className="mt-5 font-serif text-[2.6rem] leading-none sm:text-[3rem]">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12" aria-labelledby="my-learning">
        <h2 id="my-learning" className="font-serif text-[1.7rem]">
          My Learning
        </h2>
        <p className="mt-1 text-[0.9375rem] text-muted">
          A course you haven't worked on for {RESET_AFTER_DAYS} days starts over from the beginning. Badges you've earned always stay.
        </p>
        {resetIds.length > 0 && (
          <p role="status" className="mt-4 rounded-lg border border-line-strong bg-sand px-4 py-3 text-[0.9375rem]">
            {resetIds.map((id) => courses.find((c) => c.id === id)?.title ?? id).join(", ")} {resetIds.length === 1 ? "has" : "have"} started over after{" "}
            {RESET_AFTER_DAYS} days without activity. Your badges are still yours.
          </p>
        )}
        {removeError && <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-[0.9375rem]">{removeError}</p>}
        {learning.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-line-strong p-8 text-center">
            <p className="text-[1.0625rem]">You haven't started a course yet.</p>
            <p className="mt-1 text-muted">Open any lesson and you're enrolled automatically. It's free.</p>
            <div className="mt-5">
              <ButtonLink to="/courses" arrow>
                Browse courses
              </ButtonLink>
            </div>
          </div>
        ) : (
          <ul className="mt-5 grid gap-4 lg:grid-cols-2">
            {[...inProgress, ...completed].map(({ course, percent, completion, resume, resetsIn }) => (
              <li key={course.id} className="flex flex-col rounded-2xl border border-line bg-paper p-6">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/courses/${course.slug}`} className="font-serif text-[1.35rem] leading-snug hover:text-brass-dark">
                    {course.title}
                  </Link>
                  <div className="flex shrink-0 items-center gap-2">
                    {completion && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success-bg px-2.5 py-0.5 text-[0.75rem] font-medium text-success">
                        <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> Completed
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setConfirming(course.id)}
                      aria-label={`Remove ${course.title} from My Learning`}
                      title="Remove from My Learning"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-sand hover:text-ink"
                    >
                      <X aria-hidden className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {confirming === course.id && (
                  <div role="alertdialog" aria-label={`Remove ${course.title}?`} className="mt-4 rounded-xl border border-line-strong bg-sand p-4 text-[0.9375rem]">
                    <p className="font-semibold">Remove {course.title} from My Learning?</p>
                    <p className="mt-1 text-muted">
                      {completion
                        ? "Your completion badge and any certificate stay valid. You can open the course again any time."
                        : "Your progress in this course will be cleared, so starting it again begins from the first lesson. Badges you've earned stay."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button onClick={() => void remove(course.id)} loading={removing}>
                        Remove
                      </Button>
                      <Button variant="secondary" onClick={() => setConfirming(null)} disabled={removing}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <div className="mt-5">
                  <ProgressBar value={percent} label={`${course.title} progress`} />
                </div>
                {resetsIn !== null && (
                  <p className="mt-3 flex items-start gap-2 text-[0.875rem] text-ink">
                    <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" />
                    {resetsIn === 0 ? "Starts over today" : `Starts over in ${resetsIn} ${resetsIn === 1 ? "day" : "days"}`} unless you continue. Open a lesson to keep your
                    progress.
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  {completion ? (
                    <ButtonLink to={`/credentials/${completion.credentialId}`} variant="secondary">
                      View credential
                    </ButtonLink>
                  ) : percent === 100 ? (
                    <ButtonLink to={`/courses/${course.slug}`}>Finish the course</ButtonLink>
                  ) : (
                    resume && (
                      <ButtonLink to={`/learn/${course.slug}/${resume.slug}`} arrow>
                        {percent === 0 ? "Start" : "Continue"}: {resume.title}
                      </ButtonLink>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14" aria-labelledby="my-badges">
        <h2 id="my-badges" className="font-serif text-[1.7rem]">
          My Badges
        </h2>
        <p className="mt-1 text-muted">
          {valid.length ? `${valid.length} ${valid.length === 1 ? "badge" : "badges"} earned. Open one to share it or download the image.` : "Pass a module check to earn your first badge."}
        </p>
        <p className="mt-1 text-[0.9375rem]">
          <Link to="/profile" className="font-semibold text-brass-dark hover:text-ink">
            Show all your badges on a public skills profile
          </Link>
        </p>
        {valid.length > 0 && (
          <>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {valid.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(open === c.credentialId ? null : c.credentialId)}
                    aria-pressed={open === c.credentialId}
                    className={`w-full rounded-xl border p-2 text-left transition-colors ${open === c.credentialId ? "border-brass bg-brass-pale/40" : "border-line bg-paper hover:border-line-strong"}`}
                  >
                    <BadgeArtwork data={credentialBadge(c, courses.find((x) => x.id === c.courseId))} className="h-auto w-full rounded-lg" />
                    <span className="mt-2 block text-[0.8125rem] font-semibold leading-snug">{c.badgeName}</span>
                    <span className="block text-[0.75rem] text-muted">{formatDate(c.issuedAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
            {opened && (
              <div className="mt-5 grid gap-6 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-[14rem_1fr] sm:p-6">
                <BadgeArtwork ref={art} data={credentialBadge(opened, courses.find((x) => x.id === opened.courseId))} className="h-auto w-full rounded-lg border border-line" />
                <div>
                  <p className="font-serif text-[1.3rem]">{opened.badgeName}</p>
                  <p className="text-[0.875rem] text-muted">
                    {opened.credentialId} ·{" "}
                    <Link to={`/credentials/${opened.credentialId}`} className="font-medium text-brass-dark">
                      Public page
                    </Link>
                  </p>
                  <div className="mt-4">
                    <ShareMenu key={opened.credentialId} credential={opened} art={art} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="mt-14" aria-labelledby="my-projects">
        <h2 id="my-projects" className="font-serif text-[1.7rem]">
          My Projects
        </h2>
        <p className="mt-1 text-muted">
          {practice.length
            ? "Practice projects you've submitted. Get every key number right to earn the project badge."
            : "Work a practice project on real business data, submit it, and earn a project badge with your work linked."}
        </p>
        {practice.length > 0 ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {practice.map((p) => {
              const project = findProject(p.projectId);
              return (
                <li key={p.id}>
                  <Link to={`/projects/${p.projectId}#submit`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper hover:border-line-strong">
                    {project && <ProjectCover cover={project.cover} className="h-16 w-full" />}
                    <span className="flex flex-1 flex-col p-4">
                      <span className="font-semibold group-hover:text-brass-dark">{project?.title ?? p.projectId}</span>
                      <span className="mt-1 text-[0.8125rem] text-muted">Updated {formatDate(p.updatedAt)}</span>
                      <span className="mt-3 text-[0.875rem] font-semibold">
                        {p.reviewedAt ? (
                          <span className="inline-flex items-center gap-1 text-success">
                            <ShieldCheck aria-hidden className="h-4 w-4" /> Badge earned · Reviewed
                          </span>
                        ) : p.passed ? (
                          <span className="inline-flex items-center gap-1 text-success">
                            <Trophy aria-hidden className="h-4 w-4" /> Badge earned
                          </span>
                        ) : (
                          <span className="text-brass-dark">
                            {p.correct} of {p.total} right · keep going
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <ButtonLink to="/projects" variant="secondary" className="mt-5">
            Browse practice projects
          </ButtonLink>
        )}
      </section>

      <section className="mt-14" aria-labelledby="my-certs">
        <h2 id="my-certs" className="font-serif text-[1.7rem]">
          My Certificates
        </h2>
        {certs.length === 0 ? (
          <p className="mt-1 text-muted">
            Official certificates are optional. When you complete a course, you can get one from its completion page. Your badges are free either way.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-paper">
            {certs.map((c) => (
              <li key={c.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{c.courseTitle}</p>
                  <p className="text-[0.8125rem] text-muted">
                    {c.certificateId} · Issued {formatDate(c.issuedAt)}
                    {c.status === "revoked" && <span className="ml-2 font-semibold text-danger">Revoked</span>}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link to={`/dashboard/certificates/${c.certificateId}`} className="text-[0.875rem] font-semibold text-brass-dark">
                    Download
                  </Link>
                  <Link to={`/verify/${c.certificateId}`} className="inline-flex items-center gap-1 text-[0.875rem] font-semibold text-muted hover:text-ink">
                    Verify <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(valid.length > 0 || certs.length > 0) && (
        <section className="mt-14" aria-labelledby="my-creds">
          <h2 id="my-creds" className="font-serif text-[1.7rem]">
            My Credentials
          </h2>
          <p className="mt-1 text-muted">Everything you've earned at CloudTech Academy, with the link anyone can use to check it.</p>
          <div className="table-scroll mt-5 rounded-2xl border border-line bg-paper">
            <table>
              <thead>
                <tr>
                  <th>Credential</th>
                  <th>Type</th>
                  <th>Earned</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...certs.map((c) => ({ key: c.id, name: `${c.courseTitle}: official certificate`, type: "Certificate", date: c.issuedAt, id: c.certificateId, href: `/verify/${c.certificateId}`, status: c.status })),
                  ...credentials.map((c) => ({
                    key: c.id,
                    name: c.badgeName,
                    type: credentialKindLabel(c.kind),
                    date: c.issuedAt,
                    id: c.credentialId,
                    href: `/credentials/${c.credentialId}`,
                    status: c.status,
                  })),
                ]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((r) => (
                    <tr key={r.key}>
                      <td className="font-medium">
                        <span className="inline-flex items-center gap-2">
                          {r.type === "Certificate" ? <GraduationCap aria-hidden className="h-4 w-4 text-brass-dark" /> : <Award aria-hidden className="h-4 w-4 text-brass-dark" />}
                          {r.name}
                        </span>
                        {r.status === "revoked" && <span className="ml-2 text-[0.8125rem] font-semibold text-danger">Revoked</span>}
                      </td>
                      <td className="whitespace-nowrap">{r.type}</td>
                      <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                      <td className="whitespace-nowrap">
                        <Link to={r.href} className="font-mono text-[0.8125rem] hover:text-brass-dark">
                          {r.id}
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="mt-14" aria-labelledby="more">
          <h2 id="more" className="font-serif text-[1.7rem]">
            {learning.length ? "What to learn next" : "Courses"}
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}
