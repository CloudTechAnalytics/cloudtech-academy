import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowRight, CheckCircle2, Circle, RotateCcw, Trophy } from "lucide-react";
import type { AssessmentPublic } from "@/content/types";
import { useSeo } from "@/lib/seo";
import { useCourse, useLearner } from "@/lib/data";
import { getBackend, type AttemptResult, type Credential } from "@/lib/backend";
import { PageLoading, RequireAuth } from "@/lib/auth";
import { credentialBadge } from "@/lib/badges";
import { eligibility, moduleTaskIds } from "@/lib/certificates";
import { Button, ButtonLink } from "@/components/Button";
import { Alert } from "@/components/Form";
import { BadgeArtwork } from "@/components/BadgeArtwork";
import { ShareMenu } from "@/components/ShareMenu";
import { optionOrder } from "@/lib/shuffle";
import NotFound from "./NotFound";

/** A module check (awards the module badge) or the course's final assessment. */
function AssessmentInner() {
  const { slug, moduleId } = useParams();
  const { course, loading } = useCourse(slug);
  const learner = useLearner(course);
  const navigate = useNavigate();
  const [moduleCheck, setModuleCheck] = useState<{ assessment: AssessmentPublic | null; attempts: AttemptResult[] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [badge, setBadge] = useState<Credential | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const art = useRef<SVGSVGElement>(null);

  const mod = moduleId ? course?.modules.find((m) => m.id === moduleId) : undefined;
  useSeo({
    title: course ? `${mod ? `${mod.title} check` : "Final assessment"} | ${course.title}` : "Assessment",
    description: "Assessment",
    noindex: true,
  });

  useEffect(() => {
    if (!course || !moduleId) return;
    let alive = true;
    void (async () => {
      const b = await getBackend();
      const assessment = await b.getAssessment(course.id, moduleId);
      const attempts = assessment ? await b.listAttempts(assessment.id) : [];
      if (alive) setModuleCheck({ assessment, attempts });
    })().catch(() => alive && setModuleCheck({ assessment: null, attempts: [] }));
    return () => {
      alive = false;
    };
  }, [course, moduleId]);

  if (!course) return loading ? <PageLoading /> : <NotFound />;
  if (moduleId && !mod) return <NotFound />;
  if (learner.loading || (moduleId && !moduleCheck)) return <PageLoading />;
  const a = moduleId ? moduleCheck!.assessment : learner.assessment;
  const attempts = moduleId ? moduleCheck!.attempts : learner.attempts;
  if (!a)
    return (
      <div className="container-page py-20">
        <h1 className="font-serif text-[2.2rem]">No assessment yet</h1>
        <p className="mt-3 text-muted">{mod ? "This module doesn't have a check yet." : "This course doesn't have a final assessment yet."}</p>
      </div>
    );

  // A module check unlocks once the module's tasks are done (the server checks this again).
  const tasksLeft = mod ? moduleTaskIds(mod).filter((id) => !learner.progress.completedExercises.includes(id)).length : 0;
  if (mod && tasksLeft > 0 && !attempts.some((x) => x.passed)) {
    const first = mod.lessons.find((l) => l.published);
    return (
      <div className="container-page max-w-3xl py-12 sm:py-16">
        <p className="kicker">Module check · {course.title}</p>
        <h1 className="mt-3 font-serif text-[2.3rem] leading-tight">{mod.title}</h1>
        <div className="mt-6">
          <Alert tone="info">
            <p className="font-semibold">Finish {tasksLeft === 1 ? "the last task" : `the ${tasksLeft} tasks`} in this module first.</p>
            <p className="mt-1">The {mod.badge} badge shows you've done the work, not just read about it. Complete the tasks in the lesson, then come back.</p>
          </Alert>
        </div>
        {first && (
          <ButtonLink to={`/learn/${course.slug}/${first.slug}`} className="mt-6">
            Back to the lesson
          </ButtonLink>
        )}
      </div>
    );
  }

  const answered = a.questions.filter((q) => answers[q.id] !== undefined).length;
  const best = attempts.reduce((m, x) => Math.max(m, x.score), 0);
  const passedBefore = attempts.some((x) => x.passed);
  const lesson = mod?.lessons.find((l) => l.published);
  const modIndex = mod ? course.modules.indexOf(mod) : -1;
  const nextModule = modIndex >= 0 ? course.modules.slice(modIndex + 1).find((m) => m.lessons.some((l) => l.published)) : undefined;
  const nextLesson = nextModule?.lessons.find((l) => l.published);

  const retry = () => {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const b = await getBackend();
      const r = await b.submitAssessment(a.id, answers);
      setResult(r);
      if (r.passed && mod) {
        // A passed module check completes the module and awards its badge.
        if (lesson) await b.setLessonComplete(course.id, lesson.id, true);
        setBadge(await b.claimModuleBadge(mod.id));
        setModuleCheck((m) => (m ? { ...m, attempts: [...m.attempts, r] } : m));
      }
      if (r.passed && !mod) {
        const fresh = eligibility(course, learner.progress, [...learner.attempts, r], learner.submission, learner.project, learner.badgeModules);
        if (fresh.eligible) {
          navigate(`/courses/${course.slug}/complete`);
          return;
        }
      }
      await learner.reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't submit your answers.");
    } finally {
      setSubmitting(false);
    }
  };

  // Module passed: show the badge they just earned.
  if (mod && result?.passed && badge) {
    return (
      <div className="container-page max-w-4xl py-12 sm:py-16">
        <Link to={`/courses/${course.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
          ← {course.title}
        </Link>
        <div className="mt-6 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
          <BadgeArtwork ref={art} data={credentialBadge(badge, course)} className="h-auto w-full rounded-2xl border border-line shadow-[0_40px_80px_-50px_rgba(23,23,23,0.6)]" />
          <div>
            <p className="flex items-center gap-2 font-semibold text-success">
              <CheckCircle2 aria-hidden className="h-5 w-5" /> Module completed · {result.correct} of {result.total} right
            </p>
            <h1 className="mt-3 flex items-start gap-3 font-serif text-[2.2rem] leading-tight">
              <Trophy aria-hidden className="mt-2 h-7 w-7 shrink-0 text-brass" /> Badge earned: {badge.badgeName}
            </h1>
            <p className="mt-3 text-muted">It's yours, free, with its own credential ID ({badge.credentialId}) and a public page anyone can check.</p>
            <div className="mt-6">
              <ShareMenu credential={badge} art={art} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {nextLesson ? (
                <ButtonLink to={`/learn/${course.slug}/${nextLesson.slug}`}>
                  Next module: {nextModule!.title} <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
              ) : (
                <ButtonLink to={`/courses/${course.slug}/assessment`}>
                  Final assessment <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
              )}
              <ButtonLink to={`/credentials/${badge.credentialId}`} variant="secondary">
                View credential
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <Link to={mod && lesson ? `/learn/${course.slug}/${lesson.slug}` : `/courses/${course.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
        ← {mod ? mod.title : course.title}
      </Link>
      <p className="kicker mt-6">{mod ? `Module check · ${course.title}` : course.title}</p>
      <h1 className="mt-3 font-serif text-[2.3rem] leading-tight sm:text-[2.8rem]">{mod ? mod.title : "Final assessment"}</h1>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">
        {a.questions.length} questions. You need {a.passingScore}% to pass
        {mod?.badge ? ` and earn the ${mod.badge} badge` : ""}. You can try again as many times as you like.
        {attempts.length > 0 && ` Your best score so far is ${best}%.`}
      </p>

      <div aria-live="polite" className="mt-6">
        {result &&
          (result.passed ? (
            <Alert tone="success">
              <p className="font-semibold">
                You passed with {result.score}% ({result.correct} of {result.total}).
              </p>
              <p className="mt-1">
                {mod ? (
                  "Saving your badge…"
                ) : (
                  <>
                    Finish the remaining steps on the{" "}
                    <Link to={`/courses/${course.slug}`} className="font-semibold underline">
                      course page
                    </Link>{" "}
                    to complete the course.
                  </>
                )}
              </p>
            </Alert>
          ) : (
            <Alert tone="info">
              <p className="font-semibold">Not quite yet.</p>
              <p className="mt-1">
                You got {result.correct} of {result.total} ({result.score}%); the pass mark is {a.passingScore}%. Review the{" "}
                {mod && lesson ? (
                  <Link to={`/learn/${course.slug}/${lesson.slug}`} className="font-semibold underline">
                    lesson
                  </Link>
                ) : (
                  "lessons"
                )}{" "}
                and try again.
              </p>
              <Button variant="secondary" onClick={retry} className="mt-3">
                <RotateCcw aria-hidden className="h-4 w-4" /> Try again
              </Button>
            </Alert>
          ))}
        {!result && passedBefore && (
          <Alert tone="success">
            {mod ? "You've already passed this module check and earned its badge." : "You've already passed this assessment."} You can take it again for practice.
          </Alert>
        )}
        {error && <Alert tone="error">{error}</Alert>}
      </div>

      <form
        className="mt-8 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        {a.questions.map((q, i) => (
          <fieldset key={q.id} className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <legend className="sr-only">Question {i + 1}</legend>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-brass-dark">Question {i + 1}</p>
            <p className="mt-2 text-[1.0313rem] font-semibold leading-snug">{q.prompt}</p>
            <div className="mt-4 grid gap-2">
              {optionOrder(q.id, q.options.length).map((oi) => (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 text-[0.9375rem] ${answers[q.id] === oi ? "border-brass bg-brass-pale/40" : "border-line hover:border-line-strong"}`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === oi}
                    onChange={() => setAnswers((x) => ({ ...x, [q.id]: oi }))}
                    className="mt-1 accent-[var(--color-brass-dark)]"
                  />
                  <span className="break-words">{q.options[oi]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-line bg-ivory/95 px-5 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:border">
          <p className="flex items-center gap-2 text-[0.875rem] text-muted">
            {answered === a.questions.length ? <CheckCircle2 aria-hidden className="h-4 w-4 text-success" /> : <Circle aria-hidden className="h-4 w-4" />}
            {answered} of {a.questions.length} answered
          </p>
          <Button type="submit" loading={submitting} disabled={answered < a.questions.length}>
            Submit answers
          </Button>
        </div>
      </form>
      {result && (
        <div className="mt-8">
          <ButtonLink to={`/courses/${course.slug}`} variant="secondary">
            Back to the course
          </ButtonLink>
        </div>
      )}
    </div>
  );
}

export default function Assessment() {
  return (
    <RequireAuth>
      <AssessmentInner />
    </RequireAuth>
  );
}
