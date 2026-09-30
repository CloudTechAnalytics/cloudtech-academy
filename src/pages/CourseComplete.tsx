import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, Circle, PartyPopper } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourse, useLearner } from "@/lib/data";
import { getBackend, type Credential } from "@/lib/backend";
import { PageLoading, RequireAuth } from "@/lib/auth";
import { credentialBadge } from "@/lib/badges";
import { ButtonLink } from "@/components/Button";
import { Alert } from "@/components/Form";
import { BadgeArtwork } from "@/components/BadgeArtwork";
import { ShareMenu } from "@/components/ShareMenu";
import NotFound from "./NotFound";

/** Issues the free course completion credential and celebrates it. */
function Inner() {
  const { slug } = useParams();
  const { course, loading } = useCourse(slug);
  const learner = useLearner(course);
  const [credential, setCredential] = useState<Credential | null>(null);
  const [error, setError] = useState<string | null>(null);
  const art = useRef<SVGSVGElement>(null);

  useSeo({ title: course ? `Course complete | ${course.title}` : "Course complete", description: "Your course completion badge", noindex: true });

  const ready = !!course && !learner.loading && !!learner.eligibility;
  const eligible = !!learner.eligibility?.eligible;
  useEffect(() => {
    if (!ready || credential || error) return;
    if (learner.completion) return setCredential(learner.completion);
    if (!eligible) return;
    void getBackend()
      .then((b) => b.issueCourseCredential(course!.id))
      .then(setCredential)
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't issue your badge."));
  }, [ready, eligible, credential, error, learner.completion, course]);

  if (!course) return loading ? <PageLoading /> : <NotFound />;
  if (!ready) return <PageLoading />;

  if (!credential) {
    return (
      <div className="container-page max-w-2xl py-14 sm:py-20">
        <Link to={`/courses/${course.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
          ← {course.title}
        </Link>
        <h1 className="mt-4 font-serif text-[2.3rem] leading-tight sm:text-[2.8rem]">{eligible && !error ? "Issuing your badge…" : "Almost there"}</h1>
        {!eligible && (
          <>
            <p className="mt-3 text-[1.0625rem] text-muted">Finish these to complete the course and earn your free completion badge.</p>
            <ul className="mt-8 space-y-3 rounded-2xl border border-line bg-paper p-6">
              {learner.eligibility!.requirements.map((r) => (
                <li key={r.key} className="flex items-start gap-3">
                  {r.done ? (
                    <CheckCircle2 aria-label="Done" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <Circle aria-label="Not yet" className="mt-0.5 h-5 w-5 shrink-0 text-line-strong" />
                  )}
                  <span>
                    <span className="font-medium">{r.label}</span>
                    <span className="block text-[0.875rem] text-muted">{r.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink to={`/courses/${course.slug}`} variant="secondary" className="mt-6">
              Back to the course
            </ButtonLink>
          </>
        )}
        <div className="mt-6" aria-live="polite">
          {error && (
            <Alert tone="error">
              {error}{" "}
              {/name/i.test(error) && (
                <Link to="/profile" className="font-semibold underline">
                  Add your name
                </Link>
              )}
            </Alert>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
        <BadgeArtwork ref={art} data={credentialBadge(credential, course)} className="h-auto w-full rounded-2xl border border-line shadow-[0_40px_80px_-50px_rgba(23,23,23,0.6)]" />
        <div>
          <p className="flex items-center gap-2 font-semibold text-brass-dark">
            <PartyPopper aria-hidden className="h-5 w-5" /> Congratulations!
          </p>
          <p className="mt-4 text-muted">You completed:</p>
          <h1 className="mt-1 font-serif text-[2.4rem] leading-[1.08] sm:text-[2.9rem]">{course.title}</h1>
          <p className="mt-4 text-[1.0625rem] leading-relaxed">
            You've earned your CloudTech Academy course completion badge. <strong className="font-semibold">Your badge is free.</strong> Share it with your
            network or add it to your portfolio.
          </p>
          <p className="mt-2 text-[0.875rem] text-muted">Credential ID {credential.credentialId}</p>

          <div className="mt-6">
            <ShareMenu credential={credential} art={art} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={`/credentials/${credential.credentialId}`}>View credential</ButtonLink>
            <ButtonLink to={`/courses/${course.slug}/certificate`} variant="secondary">
              {learner.certificate ? "Your official certificate" : "Get official certificate"}
            </ButtonLink>
          </div>
          {!learner.certificate && (
            <p className="mt-3 text-[0.8125rem] text-muted">The official PDF certificate is optional. Your badge and credential are already yours.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CourseComplete() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
