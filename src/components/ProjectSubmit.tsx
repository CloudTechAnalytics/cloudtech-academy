import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, CircleX, ExternalLink, MessageSquareText, ShieldCheck, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getBackend, type PracticeResult, type PracticeSubmission, type PublicCredential } from "@/lib/backend";
import { credentialBadge } from "@/lib/badges";
import { formatDate } from "@/lib/format";
import { SUMMARY_MAX, SUMMARY_MIN, isWorkUrl, submittedValue } from "@/lib/project-grading";
import type { PracticeProject, ProjectCheck } from "@/content/projects";
import { BadgeArtwork } from "./BadgeArtwork";
import { ShareMenu } from "./ShareMenu";
import { Button, ButtonLink } from "./Button";
import { Alert, TextField } from "./Form";

const UNIT: Record<ProjectCheck["format"], { prefix?: string; suffix?: string; placeholder: string }> = {
  number: { placeholder: "e.g. 120" },
  naira: { prefix: "₦", placeholder: "e.g. 1,250,000" },
  percent: { suffix: "%", placeholder: "e.g. 18.5" },
  text: { placeholder: "Type your answer" },
};

function CheckField({
  check,
  n,
  value,
  onChange,
  result,
}: {
  check: ProjectCheck;
  n: number;
  value: string;
  onChange: (v: string) => void;
  result?: boolean;
}) {
  const u = UNIT[check.format];
  const id = `check-${check.id}`;
  return (
    <div>
      <label htmlFor={id} className="flex gap-2 text-[0.9375rem] font-medium leading-snug text-ink">
        <span className="shrink-0 text-brass-dark">{n}.</span> {check.prompt}
      </label>
      <div className="mt-2 flex items-center gap-2 pl-5">
        <div className="relative w-full max-w-xs">
          {u.prefix && <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">{u.prefix}</span>}
          <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={u.placeholder}
            inputMode={check.format === "text" ? "text" : "decimal"}
            autoComplete="off"
            aria-describedby={check.hint ? `${id}-hint` : undefined}
            aria-invalid={result === false ? true : undefined}
            className={`block w-full rounded-lg border bg-paper py-2 text-[0.9375rem] text-ink ${u.prefix ? "pl-7" : "pl-3"} ${u.suffix ? "pr-8" : "pr-3"} ${
              result === true ? "border-success" : result === false ? "border-danger" : "border-line-strong"
            }`}
          />
          {u.suffix && <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted">{u.suffix}</span>}
        </div>
        {result === true && <CheckCircle2 aria-label="Correct" className="h-5 w-5 shrink-0 text-success" />}
        {result === false && <CircleX aria-label="Not correct yet" className="h-5 w-5 shrink-0 text-danger" />}
      </div>
      {check.hint && (
        <p id={`${id}-hint`} className="mt-1 pl-5 text-[0.8125rem] text-muted">
          {check.hint}
        </p>
      )}
    </div>
  );
}

/** The earned project badge, with sharing. */
function EarnedBadge({ credentialId }: { credentialId: string }) {
  const [cred, setCred] = useState<PublicCredential | null>(null);
  const art = useRef<SVGSVGElement>(null);
  useEffect(() => {
    void getBackend()
      .then((b) => b.verifyCredential(credentialId))
      .then(setCred);
  }, [credentialId]);
  if (!cred) return null;
  return (
    <div className="grid gap-5 sm:grid-cols-[12rem_1fr] sm:items-start">
      <Link to={`/credentials/${encodeURIComponent(cred.credentialId)}`} aria-label="Open your badge's public page">
        <BadgeArtwork ref={art} data={credentialBadge(cred)} className="h-auto w-full rounded-xl border border-line" />
      </Link>
      <div>
        <ShareMenu credential={cred} art={art} />
      </div>
    </div>
  );
}

/**
 * Submit your work: a link, a short summary, and answers to the project's checks. The server grades the
 * answers and issues the project badge when every one is right.
 */
export function ProjectSubmit({ project }: { project: PracticeProject }) {
  const auth = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [sub, setSub] = useState<PracticeSubmission | null>(null);
  const [badgeId, setBadgeId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const signedIn = auth.status === "signed-in";

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    void getBackend().then(async (b) => {
      const [s, creds] = await Promise.all([b.getPracticeSubmission(project.id), b.listMyCredentials()]);
      if (!live) return;
      setSub(s);
      setBadgeId(creds.find((c) => c.kind === "project_badge" && c.projectId === project.id && c.status === "valid")?.credentialId ?? null);
      if (s) {
        setUrl(s.workUrl);
        setSummary(s.summary);
        setAnswers(Object.fromEntries(Object.entries(s.answers).map(([k, v]) => [k, v === null ? "" : String(v)])));
      }
      setLoaded(true);
    });
    return () => {
      live = false;
    };
  }, [signedIn, project.id]);

  if (auth.status === "loading") return null;

  if (!signedIn) {
    const next = encodeURIComponent(`/projects/${project.id}#submit`);
    return (
      <div className="rounded-2xl border border-line bg-paper p-6">
        <p className="flex items-center gap-2 font-semibold">
          <Trophy aria-hidden className="h-5 w-5 text-brass-dark" /> Earn the {project.badge.name} badge
        </p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
          When you've finished, submit a link to your work, a short summary and {project.checks.length} key numbers from your analysis. Get them right and you
          earn a project badge straight away, shown on your public profile with a link to your work. It's free.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink to={`/sign-up?next=${next}`}>Create a free account</ButtonLink>
          <ButtonLink to={`/sign-in?next=${next}`} variant="secondary">
            Sign in
          </ButtonLink>
        </div>
      </div>
    );
  }
  if (!loaded) return <p className="text-muted">Loading your submission…</p>;

  const urlError = url.trim() && !isWorkUrl(url) ? "Paste the full link, starting with https://" : undefined;
  const len = summary.trim().length;

  const submit = async () => {
    setError(null);
    if (!isWorkUrl(url)) return setError("Add a link to your work that starts with https://");
    if (len < SUMMARY_MIN) return setError(`Write a few sentences (at least ${SUMMARY_MIN} characters) about what you found.`);
    const sent = Object.fromEntries(project.checks.map((c) => [c.id, submittedValue(c, answers[c.id] ?? "")]));
    const unreadable = project.checks.find((c) => (answers[c.id] ?? "").trim() && sent[c.id] === null);
    if (unreadable) return setError(`"${answers[unreadable.id]}" doesn't look like a number. Type digits only, for example 1250000 or 18.5.`);
    setBusy(true);
    try {
      const b = await getBackend();
      const r = await b.submitPracticeProject({ projectId: project.id, workUrl: url.trim(), summary: summary.trim(), answers: sent });
      setResult(r);
      // Refresh the saved submission in the background so the learner can correct an answer and resubmit straight away.
      void b.getPracticeSubmission(project.id).then(setSub);
      if (r.credentialId) setBadgeId(r.credentialId);
      if (r.passed) setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't submit your work. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const showForm = !sub?.passed || editing;

  return (
    <div className="space-y-6">
      {sub?.passed && badgeId && (
        <div className="rounded-2xl border border-success/40 bg-success-bg/60 p-5 sm:p-6">
          <p className="flex items-center gap-2 font-semibold text-success">
            <Trophy aria-hidden className="h-5 w-5" /> {result?.passed ? "Every answer is right. You've earned the project badge." : "Project badge earned"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.875rem] text-muted">
            <span>Submitted {formatDate(sub.updatedAt)}</span>
            <a href={sub.workUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-brass-dark hover:text-ink">
              Your work <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
            {sub.reviewedAt ? (
              <span className="inline-flex items-center gap-1 font-semibold text-success">
                <ShieldCheck aria-hidden className="h-4 w-4" /> Reviewed by CloudTech
              </span>
            ) : (
              <span>Not reviewed yet: CloudTech may review your work and add a Reviewed mark to your badge.</span>
            )}
          </div>
          {sub.reviewNote && (
            <p className="mt-3 flex gap-2 rounded-lg border border-line bg-paper p-3 text-[0.9375rem]">
              <MessageSquareText aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" />
              <span>
                <span className="font-semibold">Feedback from CloudTech: </span>
                {sub.reviewNote}
              </span>
            </p>
          )}
          <div className="mt-5">
            <EarnedBadge credentialId={badgeId} />
          </div>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="mt-5 text-[0.875rem] font-semibold text-brass-dark hover:text-ink">
              Update your link or summary
            </button>
          )}
        </div>
      )}

      {showForm && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="space-y-6 rounded-2xl border border-line bg-paper p-5 sm:p-6"
        >
          {!sub?.passed && (
            <p className="text-[0.9375rem] leading-relaxed text-muted">
              Share your finished work and answer {project.checks.length} questions from your analysis. Get every answer right to earn the{" "}
              <strong className="font-semibold text-ink">{project.badge.name}</strong> badge. You can try again as many times as you need.
            </p>
          )}

          <div>
            <TextField
              label="Link to your work"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              error={urlError}
              placeholder="https://github.com/you/project"
              hint="A GitHub repository, Google Colab notebook, Google Drive or OneDrive file, or a public Power BI report. Set sharing to “Anyone with the link can view”. The link is shown on your badge and public profile."
            />
          </div>

          <fieldset className="space-y-5">
            <legend className="text-[0.875rem] font-medium text-ink">Key numbers from your analysis</legend>
            {project.checks.map((c, i) => (
              <CheckField
                key={c.id}
                check={c}
                n={i + 1}
                value={answers[c.id] ?? ""}
                onChange={(v) => setAnswers((a) => ({ ...a, [c.id]: v }))}
                result={result?.results[c.id]}
              />
            ))}
          </fieldset>

          <div>
            <label htmlFor="project-summary" className="text-[0.875rem] font-medium text-ink">
              What did you find?
            </label>
            <textarea
              id="project-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              maxLength={SUMMARY_MAX}
              placeholder="Two or three findings in plain language, and what you'd recommend."
              className="mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-[1rem] text-ink placeholder:text-subtle/70"
            />
            <p className={`mt-1.5 text-[0.8125rem] ${len && len < SUMMARY_MIN ? "text-danger" : "text-muted"}`}>
              {len < SUMMARY_MIN ? `${len} of at least ${SUMMARY_MIN} characters` : `${len.toLocaleString("en-GB")} characters`}
            </p>
          </div>

          <div aria-live="polite" className="space-y-3">
            {error && <Alert tone="error">{error}</Alert>}
            {result && !result.passed && (
              <Alert tone="info">
                {result.correct} of {result.total} right. Your work is saved; check the answers marked with a cross against your analysis, then submit again.
              </Alert>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={busy}>
              {sub ? "Submit again" : "Submit my work"}
            </Button>
            {editing && (
              <button type="button" onClick={() => setEditing(false)} className="text-[0.875rem] font-semibold text-muted hover:text-ink">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
