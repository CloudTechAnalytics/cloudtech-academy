import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Award, CheckCircle2, Clock, ListChecks, RotateCcw, XCircle } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { useAuth } from "@/lib/auth";
import { getBackend } from "@/lib/backend";
import { optionOrder } from "@/lib/shuffle";
import { QUICK_COURSES, QUICK_PASS, quickCourse, type QuickCourse as QuickCourseT } from "@/content/quick";
import { LessonContent } from "@/components/LessonContent";
import { BadgeArtwork } from "@/components/BadgeArtwork";
import { QuickBadge } from "@/components/QuickBadge";
import { QuickCard } from "@/components/QuickCard";
import { quickIcon } from "@/components/QuickIcon";
import { Button, ButtonLink } from "@/components/Button";
import NotFound from "./NotFound";

export default function QuickCourse() {
  const { slug = "" } = useParams();
  const course = quickCourse(slug);
  useSeo({
    title: course ? `${course.title}: free ${course.minutes}-minute course | CloudTech Academy` : "Course not found | CloudTech Academy",
    description: course ? `${course.summary} Pass a five-question quiz to earn the ${course.badge} badge.` : "This course doesn't exist.",
    noindex: !course,
    jsonLd: course ? breadcrumbs([["Home", "/"], ["Quick skills", "/quick"], [course.title, `/quick/${course.slug}`]]) : undefined,
  });
  if (!course) return <NotFound />;

  const steps = [...course.body.matchAll(/^## (.+)$/gm)].length;
  const more = QUICK_COURSES.filter((c) => c.slug !== course.slug && c.category === course.category)
    .concat(QUICK_COURSES.filter((c) => c.category !== course.category))
    .slice(0, 3);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="kicker">
              <Link to="/quick" className="hover:text-ink">
                Quick skills
              </Link>{" "}
              · {course.category}
            </p>
            <h1 className="mt-4 font-serif text-[2.4rem] leading-[1.06] tracking-[-0.015em] sm:text-[3.1rem]">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-[1.125rem] leading-relaxed text-muted">{course.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-ink">
              <li className="flex items-center gap-2">
                <Clock aria-hidden className="h-4 w-4 text-brass-dark" /> {course.minutes} minutes
              </li>
              <li className="flex items-center gap-2">
                <ListChecks aria-hidden className="h-4 w-4 text-brass-dark" /> {steps} short steps and a 5-question quiz
              </li>
              <li className="flex items-center gap-2">
                <Award aria-hidden className="h-4 w-4 text-brass-dark" /> Badge: {course.badge}
              </li>
            </ul>
          </div>
          <div className="hidden lg:col-span-4 lg:block">
            <BadgeArtwork
              data={{ icon: quickIcon(course.icon), kicker: `${course.minutes}-MINUTE COURSE`, stageTitle: "Skill badge", courseTitle: course.badge }}
              className="mx-auto h-auto w-full max-w-72 rounded-xl border border-line shadow-[0_30px_60px_-40px_rgba(23,23,23,0.55)]"
            />
          </div>
        </div>
      </section>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-12">
        <article className="min-w-0 lg:col-span-8">
          {course.skills.length > 0 && (
            <div className="mb-10 rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <h2 className="text-[1rem] font-semibold">You'll be able to</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {course.skills.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[0.9375rem]">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <LessonContent body={course.body} />
          <BadgeQuiz course={course} />
        </article>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <p className="kicker mb-4">More quick skills</p>
            <ul className="grid gap-4">
              {more.map((c) => (
                <li key={c.slug}>
                  <QuickCard course={c} compact />
                </li>
              ))}
            </ul>
            <Link to="/quick" className="mt-4 inline-block text-[0.9375rem] font-semibold text-brass-dark hover:text-ink">
              All quick skills →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

/** The five-question badge quiz. Pass (3 of 5) to see, download and share the badge. */
function BadgeQuiz({ course }: { course: QuickCourseT }) {
  const auth = useAuth();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");
  const score = course.quiz.filter((q, i) => answers[i] === q.answer).length;
  const passed = checked && score >= QUICK_PASS;
  const allAnswered = course.quiz.every((_, i) => answers[i] !== undefined);
  const signedIn = auth.status === "signed-in";

  useEffect(() => {
    if (!passed || !signedIn) return;
    void getBackend()
      .then((b) => b.recordQuickCourse(course.slug, Math.round((score / course.quiz.length) * 100)))
      .then(() => setSaved("saved"))
      .catch(() => setSaved("error"));
  }, [passed, signedIn, course.slug, course.quiz.length, score]);

  const retry = () => {
    setAnswers({});
    setChecked(false);
    document.getElementById("badge-quiz")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="badge-quiz" aria-labelledby="badge-quiz-title" className="mt-14 scroll-mt-24 rounded-2xl border border-line-strong bg-paper p-5 sm:p-7">
      <p className="kicker">Earn your badge</p>
      <h2 id="badge-quiz-title" className="mt-2 font-serif text-[1.8rem] leading-tight">
        Five quick questions
      </h2>
      <p className="mt-2 text-muted">Get {QUICK_PASS} or more right to earn the {course.badge} badge. You can try as many times as you like.</p>

      <ol className="mt-6 space-y-7">
        {course.quiz.map((q, qi) => {
          const chosen = answers[qi];
          const right = chosen === q.answer;
          return (
            <li key={qi}>
              <fieldset disabled={passed}>
                <legend className="text-[1rem] font-semibold leading-snug">
                  {qi + 1}. {q.prompt}
                </legend>
                <div className="mt-3 grid gap-2">
                  {optionOrder(q.prompt, q.options.length).map((oi) => {
                    const showRight = checked && oi === q.answer && right;
                    const showWrong = checked && oi === chosen && !right;
                    return (
                      <label
                        key={oi}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 text-[0.9375rem] transition-colors ${
                          showRight ? "border-success/50 bg-success-bg" : showWrong ? "border-danger/50 bg-danger/10" : chosen === oi ? "border-brass bg-brass-pale/40" : "border-line hover:border-line-strong"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quick-${qi}`}
                          checked={chosen === oi}
                          onChange={() => {
                            setAnswers((a) => ({ ...a, [qi]: oi }));
                            setChecked(false);
                          }}
                          className="mt-1 accent-[var(--color-brass-dark)]"
                        />
                        <span>{q.options[oi]}</span>
                      </label>
                    );
                  })}
                </div>
                {checked && (
                  <p className={`mt-2.5 flex items-start gap-2 text-[0.875rem] ${right ? "text-success" : "text-ink"}`}>
                    {right ? <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-danger" />}
                    <span>
                      <strong className="font-semibold">{right ? "Right. " : "Not this one. "}</strong>
                      {/* Explanations for wrong answers only appear after a pass, so a retry isn't just copying. */}
                      {right || passed ? q.explanation : "Look back at the steps above, then try again."}
                    </span>
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {!passed && (
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Button onClick={() => setChecked(true)} disabled={!allAnswered}>
            Check my answers
          </Button>
          {checked && (
            <>
              <p aria-live="polite" className="text-[0.9375rem]">
                {score} of {course.quiz.length} right. You need {QUICK_PASS}.
              </p>
              <Button variant="ghost" onClick={retry}>
                <RotateCcw aria-hidden className="h-4 w-4" /> Start again
              </Button>
            </>
          )}
          {!checked && !allAnswered && <p className="text-[0.875rem] text-muted">Answer all five to check.</p>}
        </div>
      )}

      {passed && (
        <div className="mt-8 border-t border-line pt-8" aria-live="polite">
          <p className="font-serif text-[1.6rem] leading-tight">
            You passed with {score} of {course.quiz.length}. Here's your badge.
          </p>
          <div className="mt-6">
            <QuickBadge course={course} name={signedIn ? auth.user.fullName : ""} askName={!signedIn} />
          </div>
          {signedIn ? (
            <p className="mt-5 text-[0.875rem] text-muted">
              {saved === "saved" ? "Saved to your dashboard." : saved === "error" ? "We couldn't save it to your dashboard, but you can still download it." : "Saving to your dashboard…"}
            </p>
          ) : (
            <div className="mt-6 rounded-xl border border-line bg-ivory p-4 text-[0.9375rem]">
              <strong>Keep your badges in one place.</strong> Create a free account and your next badges are saved to your dashboard.
              <div className="mt-3">
                <ButtonLink to="/sign-up" variant="secondary">
                  Create a free account
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
