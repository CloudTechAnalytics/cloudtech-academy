import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Clock, ListTree, X } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourse, useLearner } from "@/lib/data";
import { publishedLessons } from "@/lib/certificates";
import { breadcrumbs } from "@/lib/schema";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { LessonContent, lessonSections } from "@/components/LessonContent";
import { LessonSidebar } from "@/components/LessonSidebar";
import { ProgressBar } from "@/components/ProgressBar";
import { Button, ButtonLink } from "@/components/Button";
import NotFound from "./NotFound";

function CurriculumDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Course contents">
      <button type="button" aria-label="Close course contents" className="absolute inset-0 bg-night/40" onClick={onClose} />
      <div ref={panel} tabIndex={-1} className="absolute inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col bg-ivory shadow-xl outline-none">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="font-semibold">Course contents</p>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sand">
            <X aria-hidden className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{children}</div>
      </div>
    </div>
  );
}

export default function Learn() {
  const { course: courseSlug, lesson: lessonSlug } = useParams();
  const { course, loading } = useCourse(courseSlug);
  const learner = useLearner(course);
  const [drawer, setDrawer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localDone, setLocalDone] = useState<string[]>([]);
  const [localExercises, setLocalExercises] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const lessons = course ? publishedLessons(course) : [];
  const index = lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = index >= 0 ? lessons[index] : null;
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
  const module = course?.modules.find((m) => m.id === lesson?.moduleId);
  const moduleNumber = course && module ? course.modules.indexOf(module) + 1 : 0;

  useSeo({
    title: lesson && course ? `${lesson.title} | ${course.title} | CloudTech Academy` : "Lesson not found | CloudTech Academy",
    description: lesson?.summary || course?.summary || "",
    noindex: !lesson,
    jsonLd:
      lesson && course
        ? breadcrumbs([
            ["Courses", "/courses"],
            [course.title, `/courses/${course.slug}`],
            [lesson.title, `/learn/${course.slug}/${lesson.slug}`],
          ])
        : undefined,
  });

  // Signed-in learners are enrolled automatically and their place is remembered.
  useEffect(() => {
    if (!course || !lesson || !learner.signedIn || learner.loading) return;
    void (async () => {
      const b = await getBackend();
      if (!learner.enrollment) await b.enroll(course.id);
      await b.setLastLesson(course.id, lesson.id);
    })().catch(() => {});
  }, [course, lesson, learner.signedIn, learner.loading, learner.enrollment]);

  useEffect(() => {
    setMessage(null);
  }, [lessonSlug]);

  const completedLessons = useMemo(() => [...new Set([...learner.progress.completedLessons, ...localDone])], [learner.progress.completedLessons, localDone]);
  const completedExercises = useMemo(() => [...new Set([...learner.progress.completedExercises, ...localExercises])], [learner.progress.completedExercises, localExercises]);

  if (!course || !lesson) return loading ? <PageLoading /> : <NotFound />;

  const done = completedLessons.includes(lesson.id);
  const requiredLeft = lesson.requiredExercises.filter((id) => !completedExercises.includes(id)).length;
  const percent = lessons.length ? Math.round((lessons.filter((l) => completedLessons.includes(l.id)).length / lessons.length) * 100) : 0;
  const sections = lessonSections(lesson.body);

  const onExerciseSolved = async (exerciseId: string) => {
    setLocalExercises((x) => [...x, exerciseId]);
    if (!learner.signedIn) return;
    try {
      await (await getBackend()).recordExercise(course.id, lesson.id, exerciseId);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Couldn't save that exercise.");
    }
  };

  const toggleComplete = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await (await getBackend()).setLessonComplete(course.id, lesson.id, !done);
      if (done) {
        setLocalDone((x) => x.filter((id) => id !== lesson.id));
        await learner.reload();
      } else setLocalDone((x) => [...x, lesson.id]);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Couldn't save your progress.");
    } finally {
      setSaving(false);
    }
  };

  // In short courses each module ends with a quick check that awards the module's badge.
  const badgeModule = module?.badge ? module : null;
  const badgeEarned = !!badgeModule && learner.badgeModules.has(badgeModule.id);
  const checkUrl = badgeModule ? `/courses/${course.slug}/modules/${badgeModule.id}/check` : "";
  const nextUrl = next ? `/learn/${course.slug}/${next.slug}` : `/courses/${course.slug}/assessment`;

  const sidebar = <LessonSidebar course={course} currentLessonId={lesson.id} completed={completedLessons} />;

  return (
    <div className="container-page grid gap-8 py-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-10 xl:grid-cols-[16rem_minmax(0,1fr)_13rem]">
      {/* Curriculum */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
          <Link to={`/courses/${course.slug}`} className="mb-3 block px-2.5 font-serif text-[1.1rem] leading-snug hover:text-brass-dark">
            {course.title}
          </Link>
          {sidebar}
        </div>
      </aside>

      <article className="min-w-0">
        <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
          <button type="button" onClick={() => setDrawer(true)} className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.875rem] font-medium">
            <ListTree aria-hidden className="h-4 w-4" /> Course contents
          </button>
          <span className="text-[0.8125rem] text-muted">
            Lesson {index + 1} of {lessons.length}
          </span>
        </div>
        <CurriculumDrawer open={drawer} onClose={() => setDrawer(false)}>
          {sidebar}
        </CurriculumDrawer>

        <header className="border-b border-line pb-8">
          <p className="kicker">
            Module {moduleNumber} · {course.title}
          </p>
          <h1 className="mt-3 font-serif text-[2.3rem] leading-[1.08] tracking-[-0.015em] sm:text-[2.9rem]">{lesson.title}</h1>
          {lesson.summary && <p className="mt-3 max-w-2xl text-[1.0625rem] text-muted">{lesson.summary}</p>}
          <p className="mt-4 flex items-center gap-4 text-[0.8125rem] text-muted">
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="h-3.5 w-3.5" /> About {lesson.minutes} minutes
            </span>
            {done && (
              <span className="flex items-center gap-1.5 font-semibold text-success">
                <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> Completed
              </span>
            )}
          </p>
          {!learner.signedIn && !learner.loading && (
            <p className="mt-5 rounded-lg border border-brass/40 bg-brass-pale/35 px-4 py-3 text-[0.9rem]">
              You can read and practise without an account.{" "}
              <Link to={`/sign-up?next=${encodeURIComponent(`/learn/${course.slug}/${lesson.slug}`)}`} className="font-semibold text-brass-dark underline underline-offset-2">
                Create a free account
              </Link>{" "}
              to save your progress and earn your badges.
            </p>
          )}
        </header>

        <div className="max-w-[46rem] pt-8">
          <LessonContent body={lesson.body} completedExercises={completedExercises} onExerciseSolved={onExerciseSolved} />
        </div>

        {badgeModule && (
          <section aria-labelledby="module-check" className="mt-14 max-w-[46rem] rounded-2xl border border-line-strong bg-paper p-6">
            {badgeEarned ? (
              <>
                <p id="module-check" className="flex items-center gap-2 font-semibold text-success">
                  <CheckCircle2 aria-hidden className="h-5 w-5" /> Module completed · Badge earned: {badgeModule.badge}
                </p>
                <p className="mt-2 text-[0.9375rem] text-muted">{next ? "On to the next module." : "Every module done. The final assessment is next."}</p>
                <ButtonLink to={nextUrl} className="mt-4">
                  {next ? "Next module" : "Final assessment"} <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
              </>
            ) : (
              <>
                <p className="kicker">Earn your badge</p>
                <h2 id="module-check" className="mt-2 font-serif text-[1.5rem] leading-tight">
                  Take the module check
                </h2>
                <p className="mt-2 text-[0.9375rem] text-muted">
                  Five quick questions about this module. Pass and you earn the <strong className="font-semibold text-ink">{badgeModule.badge}</strong> badge, free.
                </p>
                <ButtonLink to={learner.signedIn ? checkUrl : `/sign-up?next=${encodeURIComponent(checkUrl)}`} className="mt-4">
                  <Award aria-hidden className="h-4 w-4" /> {learner.signedIn ? "Take the module check" : "Create a free account to earn the badge"}
                </ButtonLink>
              </>
            )}
          </section>
        )}

        <footer className="mt-14 max-w-[46rem] border-t border-line pt-8">
          <div aria-live="polite">
            {message && <p className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-[0.9rem]">{message}</p>}
            {learner.signedIn && !done && requiredLeft > 0 && (
              <p className="mb-4 text-[0.875rem] text-muted">
                {requiredLeft} required exercise{requiredLeft === 1 ? "" : "s"} left in this lesson. You can mark the lesson complete now; the exercises still count towards the certificate.
              </p>
            )}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {prev ? (
              <ButtonLink to={`/learn/${course.slug}/${prev.slug}`} variant="ghost">
                <ArrowLeft aria-hidden className="h-4 w-4" /> Previous lesson
              </ButtonLink>
            ) : (
              <span />
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              {badgeModule ? null : learner.signedIn ? (
                <Button variant={done ? "secondary" : "primary"} onClick={() => void toggleComplete()} loading={saving}>
                  {done ? (
                    <>
                      <CheckCircle2 aria-hidden className="h-4 w-4 text-success" /> Completed
                    </>
                  ) : (
                    "Mark complete"
                  )}
                </Button>
              ) : (
                <ButtonLink to={`/sign-in?next=${encodeURIComponent(`/learn/${course.slug}/${lesson.slug}`)}`} variant="secondary">
                  Sign in to track progress
                </ButtonLink>
              )}
              {next ? (
                <ButtonLink to={`/learn/${course.slug}/${next.slug}`} variant={done && !badgeModule ? "primary" : "secondary"}>
                  {badgeModule ? "Next module" : "Next lesson"} <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
              ) : (
                <ButtonLink to={`/courses/${course.slug}/assessment`} variant={done && !badgeModule ? "primary" : "secondary"}>
                  Final assessment <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
              )}
            </div>
          </div>
        </footer>
      </article>

      {/* On this page + progress */}
      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-8">
          {learner.signedIn && <ProgressBar value={percent} label="Course progress" />}
          <nav aria-label="On this page">
            <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">On this page</p>
            <ul className="space-y-1.5 border-l border-line">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-3 text-[0.8125rem] text-muted hover:border-brass hover:text-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
