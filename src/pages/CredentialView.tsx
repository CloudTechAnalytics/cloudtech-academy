import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { BadgeCheck, CheckCircle2, ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useAuth } from "@/lib/auth";
import { getBackend, IS_LIVE, type PublicCredential } from "@/lib/backend";
import { credentialBadge } from "@/lib/badges";
import { formatDate } from "@/lib/format";
import { BUNDLED_COURSES } from "@/content";
import { findProject } from "@/content/projects";
import { BadgeArtwork } from "@/components/BadgeArtwork";
import { ShareMenu } from "@/components/ShareMenu";
import { ButtonLink } from "@/components/Button";

/** Public page for a badge or course completion credential. Anyone with the link can check it. */
export default function CredentialView() {
  const { credentialId = "" } = useParams();
  const auth = useAuth();
  const [cred, setCred] = useState<PublicCredential | null | undefined>(undefined);
  const art = useRef<SVGSVGElement>(null);

  useSeo({
    title: cred ? `${cred.badgeName} | ${cred.recipientName} | CloudTech Academy` : "Credential | CloudTech Academy",
    description: cred ? `${cred.recipientName} earned the ${cred.badgeName} credential from CloudTech Academy.` : "Check a CloudTech Academy credential.",
    noindex: true,
  });

  useEffect(() => {
    let alive = true;
    void getBackend()
      .then((b) => b.verifyCredential(credentialId))
      .then((c) => alive && setCred(c))
      .catch(() => alive && setCred(null));
    return () => {
      alive = false;
    };
  }, [credentialId]);

  if (cred === undefined)
    return (
      <div className="container-page py-24 text-center text-muted" aria-live="polite">
        Checking credential {credentialId}…
      </div>
    );

  if (!cred)
    return (
      <div className="container-page max-w-2xl py-20">
        <p className="flex items-center gap-2 font-semibold text-danger">
          <ShieldAlert aria-hidden className="h-5 w-5" /> Not found
        </p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-tight">We couldn't find credential {credentialId.toUpperCase()}</h1>
        <p className="mt-3 text-muted">Check the ID was typed exactly as it appears on the badge, for example CTA-PROMPT-8F72K.</p>
        {!IS_LIVE && <p className="mt-3 text-[0.875rem] text-muted">This is the demo version of the Academy: credentials can only be checked in the browser that earned them.</p>}
      </div>
    );

  const course = BUNDLED_COURSES.find((c) => c.id === cred.courseId) ?? null;
  const project = cred.kind === "project_badge" ? (findProject(cred.projectId ?? undefined) ?? null) : null;
  const valid = cred.status === "valid";
  const mine = auth.status === "signed-in" && auth.user.fullName.trim() === cred.recipientName;

  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
        <BadgeArtwork ref={art} data={credentialBadge(cred, course)} className="h-auto w-full rounded-2xl border border-line shadow-[0_40px_80px_-50px_rgba(23,23,23,0.6)]" />
        <div>
          {valid ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success-bg px-3 py-1 text-[0.875rem] font-semibold text-success">
              <BadgeCheck aria-hidden className="h-4 w-4" /> Verified credential
            </p>
          ) : (
            <p className="inline-flex items-center gap-2 rounded-full border border-danger/40 bg-danger/10 px-3 py-1 text-[0.875rem] font-semibold text-danger">
              <ShieldAlert aria-hidden className="h-4 w-4" /> Revoked: this credential is no longer valid
            </p>
          )}
          <h1 className="mt-4 font-serif text-[2.4rem] leading-[1.08]">{cred.badgeName}</h1>
          <p className="mt-2 text-muted">
            {cred.kind === "course_completion" ? "Course completion" : cred.kind === "project_badge" ? "Practice project badge" : `Module badge · ${cred.courseTitle}`}
          </p>
          {cred.kind === "project_badge" && cred.reviewed && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-success">
              <ShieldCheck aria-hidden className="h-4 w-4" /> Work reviewed by CloudTech
            </p>
          )}

          <dl className="mt-6 grid gap-4 border-y border-line py-5 sm:grid-cols-2">
            <div>
              <dt className="text-[0.8125rem] text-muted">Earned by</dt>
              <dd className="font-semibold">{cred.recipientName}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Date earned</dt>
              <dd>{formatDate(cred.issuedAt)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">{project ? "Project" : "Course"}</dt>
              <dd>
                {project ? (
                  <>
                    <Link to={`/projects/${project.id}`} className="hover:text-brass-dark">
                      {project.title}
                    </Link>
                    <span className="block text-[0.875rem] text-muted">{project.company}</span>
                  </>
                ) : course ? (
                  <Link to={`/courses/${course.slug}`} className="hover:text-brass-dark">
                    {cred.courseTitle}
                  </Link>
                ) : (
                  cred.courseTitle
                )}
                {cred.moduleTitle && <span className="block text-[0.875rem] text-muted">Module: {cred.moduleTitle}</span>}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Credential ID</dt>
              <dd className="font-mono">{cred.credentialId}</dd>
            </div>
          </dl>

          {cred.workUrl && (
            <a
              href={cred.workUrl}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2 text-[0.9375rem] font-semibold hover:border-ink/50"
            >
              View the work <ExternalLink aria-hidden className="h-4 w-4" />
            </a>
          )}

          {cred.skills.length > 0 && (
            <div className="mt-5">
              <p className="text-[0.875rem] font-semibold">Skills covered</p>
              <ul className="mt-2 space-y-1.5">
                {cred.skills.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[0.9375rem]">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-6 text-[0.875rem] text-muted">
            Issued by <strong className="font-semibold text-ink">CloudTech Academy</strong>, part of CloudTech Analytics.{" "}
            {project
              ? "Project badges are issued when the learner submits their work and gets every key result from the data right."
              : "Credentials are issued only when the learner passes the required assessments."}
          </p>

          {valid && (
            <div className="mt-6 border-t border-line pt-6">
              <ShareMenu credential={cred} art={art} />
            </div>
          )}
          {!mine && project && (
            <div className="mt-8 rounded-xl border border-line bg-paper p-5">
              <p className="font-semibold">Try this project yourself</p>
              <p className="mt-1 text-[0.9375rem] text-muted">Free data, a real business brief and starter code.</p>
              <ButtonLink to={`/projects/${project.id}`} className="mt-3">
                Open the project
              </ButtonLink>
            </div>
          )}
          {!mine && course && (
            <div className="mt-8 rounded-xl border border-line bg-paper p-5">
              <p className="font-semibold">Earn this badge yourself</p>
              <p className="mt-1 text-[0.9375rem] text-muted">It's free: learn at your own pace and pass the short checks.</p>
              <ButtonLink to={`/courses/${course.slug}`} className="mt-3">
                Start learning — Free
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
