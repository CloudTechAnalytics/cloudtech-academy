import { useState } from "react";
import { getBackend, type AdminSubmission, type SubmissionStatus } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/Button";
import { Alert, TextArea } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

const LABEL: Record<SubmissionStatus, string> = { submitted: "Waiting for review", accepted: "Accepted", needs_changes: "Changes requested" };

function Review({ s, onDone }: { s: AdminSubmission; onDone: () => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState(s.feedback ?? "");
  const [busy, setBusy] = useState<SubmissionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decide = async (status: SubmissionStatus) => {
    if (status === "needs_changes" && !feedback.trim()) return setError("Say what needs to change so the learner can fix it.");
    setBusy(status);
    setError(null);
    try {
      await (await getBackend()).admin.reviewSubmission(s.id, status, feedback.trim());
      await onDone();
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save the review.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <li className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold">{s.studentName}</p>
          <p className="text-[0.8125rem] text-muted">
            {s.projectTitle} · {formatDate(s.submittedAt)}
          </p>
        </div>
        <span className={`text-[0.8125rem] font-semibold ${s.status === "submitted" ? "text-brass-dark" : s.status === "accepted" ? "text-success" : "text-danger"}`}>{LABEL[s.status]}</span>
      </div>
      <button type="button" onClick={() => setOpen((x) => !x)} aria-expanded={open} className="mt-3 text-[0.875rem] font-semibold text-brass-dark">
        {open ? "Hide" : "Open"} submission
      </button>
      {open && (
        <div className="mt-4 space-y-4">
          <pre className="max-h-[28rem] overflow-auto rounded-lg border border-line bg-code-bg p-4 font-mono text-[0.8125rem] whitespace-pre-wrap text-code-ink">{s.content}</pre>
          {s.url && (
            <p className="text-[0.875rem]">
              Link:{" "}
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="break-all font-semibold text-brass-dark">
                {s.url}
              </a>
            </p>
          )}
          <TextArea label="Feedback for the learner" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          {error && <Alert tone="error">{error}</Alert>}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void decide("accepted")} loading={busy === "accepted"}>
              Accept
            </Button>
            <Button variant="secondary" onClick={() => void decide("needs_changes")} loading={busy === "needs_changes"}>
              Request changes
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}

export default function AdminSubmissions() {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listSubmissions());
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const sorted = [...data].sort((a, b) => Number(b.status === "submitted") - Number(a.status === "submitted") || b.submittedAt.localeCompare(a.submittedAt));
  return (
    <>
      <AdminHeading title="Project submissions" />
      <p className="-mt-2 mb-6 max-w-2xl text-[0.9375rem] text-muted">
        A submitted project counts towards the certificate straight away. Requesting changes pauses that until the learner resubmits.
      </p>
      {sorted.length === 0 ? (
        <p className="text-muted">No projects have been submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {sorted.map((s) => (
            <Review key={s.id} s={s} onDone={reload} />
          ))}
        </ul>
      )}
    </>
  );
}
