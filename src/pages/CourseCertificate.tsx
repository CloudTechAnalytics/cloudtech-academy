import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourse, useLearner } from "@/lib/data";
import { getBackend } from "@/lib/backend";
import { PageLoading, RequireAuth } from "@/lib/auth";
import { Button, ButtonLink } from "@/components/Button";
import { Alert } from "@/components/Form";
import NotFound from "./NotFound";

/** Checks requirements and issues the certificate, then opens it. */
function Inner() {
  const { slug } = useParams();
  const { course, loading } = useCourse(slug);
  const learner = useLearner(course);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);

  useSeo({ title: course ? `Certificate | ${course.title}` : "Certificate", description: "Claim your certificate", noindex: true });

  // If a certificate already exists, go straight to it.
  useEffect(() => {
    if (!course) return;
    void getBackend()
      .then((b) => b.listMyCertificates())
      .then((certs) => {
        const c = certs.find((x) => x.courseId === course.id && x.status === "valid");
        if (c) navigate(`/dashboard/certificates/${c.credentialId}`, { replace: true });
      });
  }, [course, navigate]);

  if (!course) return loading ? <PageLoading /> : <NotFound />;
  if (learner.loading || !learner.eligibility) return <PageLoading />;

  const claim = async () => {
    setIssuing(true);
    setError(null);
    try {
      const cert = await (await getBackend()).issueCertificate(course.id);
      navigate(`/dashboard/certificates/${cert.credentialId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't issue the certificate.");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="container-page max-w-2xl py-14 sm:py-20">
      <Link to={`/courses/${course.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
        ← {course.title}
      </Link>
      <h1 className="mt-4 font-serif text-[2.3rem] leading-tight sm:text-[2.8rem]">Your certificate</h1>
      <p className="mt-3 text-[1.0625rem] text-muted">A CloudTech Academy certificate for {course.title}, with a public link anyone can use to verify it.</p>
      <ul className="mt-8 space-y-3 rounded-2xl border border-line bg-paper p-6">
        {learner.eligibility.requirements.map((r) => (
          <li key={r.key} className="flex items-start gap-3">
            {r.done ? <CheckCircle2 aria-label="Done" className="mt-0.5 h-5 w-5 shrink-0 text-success" /> : <Circle aria-label="Not yet" className="mt-0.5 h-5 w-5 shrink-0 text-line-strong" />}
            <span>
              <span className="font-medium">{r.label}</span>
              <span className="block text-[0.875rem] text-muted">{r.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6" aria-live="polite">
        {error && <Alert tone="error">{error}</Alert>}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {learner.eligibility.eligible ? (
          <Button onClick={() => void claim()} loading={issuing}>
            Issue my certificate
          </Button>
        ) : (
          <ButtonLink to={`/courses/${course.slug}`} variant="secondary">
            See what's left
          </ButtonLink>
        )}
      </div>
      <p className="mt-6 text-[0.8125rem] text-muted">
        The name on the certificate comes from your <Link to="/profile" className="font-semibold text-brass-dark">profile</Link>. Check it's spelled the way you want before issuing.
      </p>
    </div>
  );
}

export default function CourseCertificate() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
