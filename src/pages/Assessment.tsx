import { useState } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourse, useLearner } from "@/lib/data";
import { getBackend, type AttemptResult } from "@/lib/backend";
import { PageLoading, RequireAuth } from "@/lib/auth";
import { Button, ButtonLink } from "@/components/Button";
import { Alert } from "@/components/Form";
import { optionOrder } from "@/lib/shuffle";
import NotFound from "./NotFound";

function AssessmentInner() {
  const { slug } = useParams();
  const { course, loading } = useCourse(slug);
  const learner = useLearner(course);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useSeo({ title: course ? `Final assessment | ${course.title}` : "Assessment", description: "Final assessment", noindex: true });

  if (!course) return loading ? <PageLoading /> : <NotFound />;
  if (learner.loading) return <PageLoading />;
  const a = learner.assessment;
  if (!a)
    return (
      <div className="container-page py-20">
        <h1 className="font-serif text-[2.2rem]">No assessment yet</h1>
        <p className="mt-3 text-muted">This course doesn't have a final assessment yet.</p>
      </div>
    );

  const answered = a.questions.filter((q) => answers[q.id] !== undefined).length;
  const best = learner.attempts.reduce((m, x) => Math.max(m, x.score), 0);
  const passedBefore = learner.attempts.some((x) => x.passed);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const r = await (await getBackend()).submitAssessment(a.id, answers);
      setResult(r);
      await learner.reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't submit your answers.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <Link to={`/courses/${course.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
        ← {course.title}
      </Link>
      <h1 className="mt-4 font-serif text-[2.3rem] leading-tight sm:text-[2.8rem]">Final assessment</h1>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">
        {a.questions.length} questions. You need {a.passingScore}% to pass, and you can try again as many times as you need.
        {learner.attempts.length > 0 && ` Your best score so far is ${best}%.`}
      </p>

      <div aria-live="polite" className="mt-6">
        {result &&
          (result.passed ? (
            <Alert tone="success">
              <p className="font-semibold">
                You passed with {result.score}% ({result.correct} of {result.total}).
              </p>
              <p className="mt-1">
                {learner.eligibility?.eligible ? (
                  <>
                    You've met every requirement.{" "}
                    <Link to={`/courses/${course.slug}/certificate`} className="font-semibold underline">
                      Get your certificate
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Finish the remaining requirements on the <Link to={`/courses/${course.slug}`} className="font-semibold underline">course page</Link> to earn your certificate.
                  </>
                )}
              </p>
            </Alert>
          ) : (
            <Alert tone="info">
              <p className="font-semibold">
                You scored {result.score}% ({result.correct} of {result.total}). The pass mark is {a.passingScore}%.
              </p>
              <p className="mt-1">Review the lessons on the topics you weren't sure about, then try again. There's no limit on attempts.</p>
            </Alert>
          ))}
        {!result && passedBefore && <Alert tone="success">You've already passed this assessment. You can take it again for practice.</Alert>}
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
