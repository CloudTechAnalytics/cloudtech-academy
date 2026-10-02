import { useState } from "react";
import { Link } from "react-router";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { getBackend, type AdminPracticeSubmission } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { findProject } from "@/content/projects";
import { Button } from "@/components/Button";
import { Alert, TextArea } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

type Filter = "review" | "passed" | "trying" | "all";

function Row({ s, onDone }: { s: AdminPracticeSubmission; onDone: () => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(s.reviewNote ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const project = findProject(s.projectId);

  const review = async (reviewed: boolean) => {
    setBusy(true);
    setError(null);
    try {
      await (await getBackend()).admin.reviewPracticeSubmission(s.id, reviewed, note);
      await onDone();
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save the review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold">{s.learnerName}</p>
          <p className="text-[0.8125rem] text-muted">
            {s.projectTitle} · {formatDate(s.updatedAt)} · {s.attempts} {s.attempts === 1 ? "attempt" : "attempts"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-semibold">
          {s.reviewedAt ? (
            <span className="inline-flex items-center gap-1 text-success">
              <ShieldCheck aria-hidden className="h-4 w-4" /> Reviewed
            </span>
          ) : s.passed ? (
            <span className="text-brass-dark">Badge earned · not reviewed</span>
          ) : (
            <span className="text-muted">
              Still trying: {s.correct} of {s.total} right
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.875rem]">
        <a href={s.workUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 font-semibold text-brass-dark hover:text-ink">
          Open their work <ExternalLink aria-hidden className="h-3.5 w-3.5" />
        </a>
        {s.credentialId && (
          <Link to={`/credentials/${encodeURIComponent(s.credentialId)}`} className="font-mono text-[0.8125rem] text-muted hover:text-ink">
            {s.credentialId}
          </Link>
        )}
        <button type="button" onClick={() => setOpen((x) => !x)} aria-expanded={open} className="font-semibold text-ink">
          {open ? "Hide details" : "Details and review"}
        </button>
      </div>
      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted">Their summary</p>
            <p className="mt-1.5 whitespace-pre-wrap rounded-lg border border-line bg-ivory p-3 text-[0.9375rem]">{s.summary}</p>
          </div>
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Their answers ({s.correct} of {s.total} right on the latest attempt)
            </p>
            <ul className="mt-1.5 space-y-1 text-[0.875rem]">
              {(project?.checks ?? []).map((c) => (
                <li key={c.id}>
                  <span className="text-muted">{c.prompt}</span> <strong className="font-semibold">{String(s.answers[c.id] ?? "(blank)")}</strong>
                </li>
              ))}
            </ul>
          </div>
          <TextArea label="Note to the learner (optional, shown on their project page)" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          {error && <Alert tone="error">{error}</Alert>}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void review(true)} loading={busy}>
              {s.reviewedAt ? "Save note" : "Mark as reviewed"}
            </Button>
            {s.reviewedAt && (
              <Button variant="secondary" onClick={() => void review(false)} loading={busy}>
                Remove review
              </Button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function AdminPracticeProjects() {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listPracticeSubmissions());
  const [filter, setFilter] = useState<Filter>("review");
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const counts = {
    review: data.filter((s) => s.passed && !s.reviewedAt).length,
    passed: data.filter((s) => s.passed).length,
    trying: data.filter((s) => !s.passed).length,
    all: data.length,
  };
  const shown = data.filter((s) => (filter === "review" ? s.passed && !s.reviewedAt : filter === "passed" ? s.passed : filter === "trying" ? !s.passed : true));
  const tabs: [Filter, string][] = [
    ["review", "Not reviewed yet"],
    ["passed", "Badge earned"],
    ["trying", "Still trying"],
    ["all", "All"],
  ];
  return (
    <>
      <AdminHeading title="Practice project work" />
      <p className="-mt-2 mb-6 max-w-2xl text-[0.9375rem] text-muted">
        Learners earn a project badge as soon as every key number is right; you don't need to do anything. Reviewing is optional: open their work, and if it's
        good, mark it reviewed. Their badge then shows "Reviewed by CloudTech".
      </p>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter submissions">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className={`rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium ${filter === id ? "border-ink bg-ink text-ivory" : "border-line-strong bg-paper hover:border-ink/50"}`}
          >
            {label} ({counts[id]})
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="text-muted">{data.length ? "Nothing here." : "No practice project work has been submitted yet."}</p>
      ) : (
        <ul className="space-y-4">
          {shown.map((s) => (
            <Row key={s.id} s={s} onDone={reload} />
          ))}
        </ul>
      )}
    </>
  );
}
