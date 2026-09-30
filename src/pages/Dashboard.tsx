import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Award, BookOpen, CheckCircle2 } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useAuth, PageLoading, RequireAuth } from "@/lib/auth";
import { useCourses } from "@/lib/data";
import { getBackend, type AttemptResult, type Certificate, type Enrollment, type Progress, type QuickCompletion } from "@/lib/backend";
import { QUICK_COURSES } from "@/content/quick";
import { BadgeArtwork } from "@/components/BadgeArtwork";
import { QuickBadge } from "@/components/QuickBadge";
import { quickIcon } from "@/components/QuickIcon";
import { publishedLessons } from "@/lib/certificates";
import { formatDate, percent } from "@/lib/format";
import { ButtonLink } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { ProgressBar } from "@/components/ProgressBar";
import { CourseBadges } from "@/components/CourseBadges";
import { earnedBadges } from "@/lib/badges";

type Row = { enrollment: Enrollment; progress: Progress; attempts: AttemptResult[] };

function DashboardInner() {
  const auth = useAuth();
  const courses = useCourses();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [quick, setQuick] = useState<QuickCompletion[]>([]);
  const [openQuick, setOpenQuick] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const b = await getBackend();
      const [enrollments, certificates, quickDone] = await Promise.all([b.listEnrollments(), b.listMyCertificates(), b.listQuickCompletions()]);
      setQuick(quickDone);
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
      setCerts(certificates);
    })().catch(() => setRows([]));
  }, []);

  useSeo({ title: "Dashboard | CloudTech Academy", description: "Your courses, progress and certificates.", noindex: true });
  if (!rows || auth.status !== "signed-in") return <PageLoading />;

  const firstName = auth.user.fullName.split(" ")[0] || "there";
  const active = rows
    .map((r) => {
      const course = courses.find((c) => c.id === r.enrollment.courseId);
      if (!course) return null;
      const lessons = publishedLessons(course);
      const done = lessons.filter((l) => r.progress.completedLessons.includes(l.id)).length;
      const resume = lessons.find((l) => l.id === r.enrollment.lastLessonId) ?? lessons.find((l) => !r.progress.completedLessons.includes(l.id)) ?? lessons[0];
      return { course, done, total: lessons.length, resume, enrollment: r.enrollment, badges: earnedBadges(course, r.progress, r.attempts) };
    })
    .filter((x) => x !== null);
  const enrolledIds = new Set(active.map((a) => a.course.id));
  const suggestions = courses.filter((c) => !enrolledIds.has(c.id)).slice(0, 3);
  const lessonsDone = active.reduce((n, a) => n + a.done, 0);
  const earnedQuick = QUICK_COURSES.filter((c) => quick.some((q) => q.slug === c.slug));
  const openCourse = earnedQuick.find((c) => c.slug === openQuick);

  return (
    <div className="container-page py-12 sm:py-16">
      <p className="kicker">Dashboard</p>
      <h1 className="mt-3 font-serif text-[2.3rem] leading-tight sm:text-[2.8rem]">Welcome back, {firstName}</h1>

      <dl className="mt-8 grid grid-cols-3 gap-3 sm:max-w-xl">
        {[
          { icon: BookOpen, label: "Courses", value: active.length },
          { icon: CheckCircle2, label: "Lessons done", value: lessonsDone },
          { icon: Award, label: "Certificates", value: certs.filter((c) => c.status === "valid").length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-line bg-paper p-4">
            <dt className="flex items-center gap-1.5 text-[0.75rem] text-muted">
              <Icon aria-hidden className="h-3.5 w-3.5" /> {label}
            </dt>
            <dd className="mt-1 font-serif text-[1.8rem] leading-none">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12" aria-labelledby="my-courses">
        <h2 id="my-courses" className="font-serif text-[1.7rem]">
          My courses
        </h2>
        {active.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-line-strong p-8 text-center">
            <p className="text-[1.0625rem]">You haven't started a course yet.</p>
            <p className="mt-1 text-muted">Open any lesson and you're enrolled automatically.</p>
            <div className="mt-5">
              <ButtonLink to="/courses" arrow>
                Browse courses
              </ButtonLink>
            </div>
          </div>
        ) : (
          <ul className="mt-5 grid gap-4 lg:grid-cols-2">
            {active.map(({ course, done, total, resume, enrollment }) => {
              const cert = certs.find((c) => c.courseId === course.id && c.status === "valid");
              return (
                <li key={course.id} className="flex flex-col rounded-2xl border border-line bg-paper p-6">
                  <Link to={`/courses/${course.slug}`} className="font-serif text-[1.35rem] leading-snug hover:text-brass-dark">
                    {course.title}
                  </Link>
                  <p className="mt-1 text-[0.8125rem] text-muted">Started {formatDate(enrollment.enrolledAt)}</p>
                  <div className="mt-5">
                    <ProgressBar value={percent(done, total)} label={`${done} of ${total} lessons`} />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {cert ? (
                      <ButtonLink to={`/dashboard/certificates/${cert.credentialId}`}>View certificate</ButtonLink>
                    ) : done === total && total > 0 ? (
                      <ButtonLink to={`/courses/${course.slug}`}>Finish requirements</ButtonLink>
                    ) : (
                      resume && (
                        <ButtonLink to={`/learn/${course.slug}/${resume.slug}`} arrow>
                          {done === 0 ? "Start" : "Continue"}: {resume.title}
                        </ButtonLink>
                      )
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {active.length > 0 && (
        <section className="mt-14" aria-labelledby="my-badges">
          <h2 id="my-badges" className="font-serif text-[1.7rem]">
            Badges
          </h2>
          <p className="mt-1 text-muted">Earn a badge at each stage of a course, and share it on LinkedIn.</p>
          <ul className="mt-5 grid gap-4">
            {active.map((a) => (
              <CourseBadges key={a.course.id} course={a.course} earned={a.badges} recipientName={auth.user.fullName} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14" aria-labelledby="my-quick">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="my-quick" className="font-serif text-[1.7rem]">
            Quick skill badges
          </h2>
          <Link to="/quick" className="text-[0.9375rem] font-semibold text-brass-dark hover:text-ink">
            Browse quick skills →
          </Link>
        </div>
        {earnedQuick.length === 0 ? (
          <p className="mt-3 text-muted">Finish a 20-minute quick skill and pass its quiz to earn your first badge.</p>
        ) : (
          <>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {earnedQuick.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setOpenQuick(openQuick === c.slug ? null : c.slug)}
                    aria-pressed={openQuick === c.slug}
                    className={`w-full rounded-xl border p-2 text-left transition-colors ${openQuick === c.slug ? "border-brass bg-brass-pale/40" : "border-line bg-paper hover:border-line-strong"}`}
                  >
                    <BadgeArtwork data={{ icon: quickIcon(c.icon), kicker: `${c.minutes}-MINUTE COURSE`, stageTitle: "Skill badge", courseTitle: c.badge }} className="h-auto w-full rounded-lg" />
                    <span className="mt-2 block text-[0.8125rem] font-semibold leading-snug">{c.badge}</span>
                  </button>
                </li>
              ))}
            </ul>
            {openCourse && (
              <div className="mt-5 rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <QuickBadge key={openCourse.slug} course={openCourse} name={auth.user.fullName} />
              </div>
            )}
          </>
        )}
      </section>

      {certs.length > 0 && (
        <section className="mt-14" aria-labelledby="my-certs">
          <h2 id="my-certs" className="font-serif text-[1.7rem]">
            Certificates
          </h2>
          <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-paper">
            {certs.map((c) => (
              <li key={c.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{c.courseTitle}</p>
                  <p className="text-[0.8125rem] text-muted">
                    {c.credentialId} · Issued {formatDate(c.issuedAt)}
                    {c.status === "revoked" && <span className="ml-2 font-semibold text-danger">Revoked</span>}
                  </p>
                </div>
                <Link to={`/dashboard/certificates/${c.credentialId}`} className="text-[0.875rem] font-semibold text-brass-dark">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="mt-14" aria-labelledby="more">
          <h2 id="more" className="font-serif text-[1.7rem]">
            {active.length ? "What to learn next" : "Courses"}
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
