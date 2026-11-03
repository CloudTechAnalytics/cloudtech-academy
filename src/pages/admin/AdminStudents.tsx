import { credentialKindLabel } from "@/lib/badges";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { Copy, Download, Mail, Trash2, X } from "lucide-react";
import type { StudentSummary } from "@/lib/backend";
import { daysSince, formatDate, percent, plural, timeAgo } from "@/lib/format";
import { gmailUrl, mailtoUrl } from "@/lib/email";
import { Alert, TextArea, TextField } from "@/components/Form";
import { Button, buttonClass } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { Modal } from "@/components/Modal";
import NotFound from "../NotFound";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

/**
 * Removes students for good: their account, enrolments, progress, orders and payments. A student who holds certificates is
 * refused (their certificates must stay verifiable), and the reason is shown.
 */
function RemoveStudents({ people, open, onClose, onDone }: { people: { userId: string; fullName: string; email: string }[]; open: boolean; onClose: () => void; onDone: (removed: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const run = async () => {
    setBusy(true);
    setProblems([]);
    const b = await getBackend();
    const removed: string[] = [];
    const failed: string[] = [];
    for (const p of people) {
      try {
        await b.admin.deleteStudent(p.userId);
        removed.push(p.userId);
      } catch (e) {
        failed.push(`${p.fullName || p.email}: ${e instanceof Error ? e.message : "couldn't be removed."}`);
      }
    }
    setBusy(false);
    setProblems(failed);
    if (removed.length) onDone(removed);
    if (!failed.length) onClose();
  };
  return (
    <Modal open={open} title={people.length === 1 ? "Remove this student?" : `Remove ${people.length} students?`} onClose={busy ? () => {} : onClose}>
      <p className="text-[0.9375rem] leading-relaxed">
        {people.length === 1 ? (
          <>
            <strong className="font-semibold">{people[0].fullName || people[0].email}</strong> ({people[0].email}) will be removed.
          </>
        ) : (
          <>These students will be removed: {people.map((p) => p.fullName || p.email).join(", ")}.</>
        )}{" "}
        Their account, enrolments, progress, badges, orders and payments are deleted. This cannot be undone.
      </p>
      {problems.length > 0 && (
        <div className="mt-4 space-y-2">
          {problems.map((m) => (
            <Alert key={m} tone="error">
              {m}
            </Alert>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => void run()} loading={busy} className="!bg-danger !text-white">
          <Trash2 aria-hidden className="h-4 w-4" /> Remove
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

type Filter = "all" | "active" | "inactive" | "completed" | "quick" | "not-started";

const FILTERS: { id: Filter; label: string; test: (s: StudentSummary) => boolean }[] = [
  { id: "all", label: "All students", test: () => true },
  { id: "active", label: "Active in the last 7 days", test: (s) => daysSince(s.lastActiveAt) <= 7 },
  { id: "inactive", label: "Inactive for 14+ days", test: (s) => s.lessonsCompleted > 0 && daysSince(s.lastActiveAt) >= 14 },
  { id: "completed", label: "Finished a course", test: (s) => s.completedCourses > 0 },
  { id: "quick", label: "Earned a badge", test: (s) => s.badges > 0 },
  { id: "not-started", label: "Signed up, not started", test: (s) => s.lessonsCompleted === 0 },
];

const selectCls = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[1rem]";

export function AdminStudents() {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listStudents());
  const [removing, setRemoving] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [composing, setComposing] = useState(false);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;

  const term = q.trim().toLowerCase();
  const test = FILTERS.find((f) => f.id === filter)!.test;
  const rows = data.filter((s) => test(s) && (!term || s.fullName.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)));
  const chosen = data.filter((s) => picked.has(s.userId));
  const allShown = rows.length > 0 && rows.every((s) => picked.has(s.userId));

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleShown = () =>
    setPicked((prev) => {
      const next = new Set(prev);
      for (const s of rows) {
        if (allShown) next.delete(s.userId);
        else next.add(s.userId);
      }
      return next;
    });

  return (
    <>
      <AdminHeading title="Students">
        <Button variant="secondary" onClick={() => downloadCsv(rows)} disabled={!rows.length}>
          <Download aria-hidden className="h-4 w-4" /> Export CSV
        </Button>
        <Button onClick={() => setComposing(true)} disabled={!chosen.length}>
          <Mail aria-hidden className="h-4 w-4" /> Email {chosen.length ? plural(chosen.length, "student") : "students"}
        </Button>
        <Button variant="secondary" onClick={() => setRemoving(true)} disabled={!chosen.length}>
          <Trash2 aria-hidden className="h-4 w-4" /> Remove {chosen.length ? plural(chosen.length, "student") : "students"}
        </Button>
      </AdminHeading>
      <RemoveStudents
        people={chosen}
        open={removing && chosen.length > 0}
        onClose={() => setRemoving(false)}
        onDone={(ids) => {
          setPicked((prev) => new Set([...prev].filter((id) => !ids.includes(id))));
          void reload();
        }}
      />

      {composing && chosen.length > 0 && <Composer recipients={chosen} onClose={() => setComposing(false)} />}

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
        <TextField label="Search by name or email" type="search" value={q} onChange={(e) => setQ(e.target.value)} />
        <div>
          <label htmlFor="student-filter" className="text-[0.875rem] font-medium text-ink">
            Show
          </label>
          <select id="student-filter" className={selectCls} value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            {FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label} ({data.filter(f.test).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted">{data.length ? "No students match." : "No one has signed up yet."}</p>
      ) : (
        <div className="table-scroll rounded-2xl border border-line bg-paper">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" aria-label="Select everyone shown" checked={allShown} onChange={toggleShown} className="h-4 w-4 accent-brass" />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Last active</th>
                <th>Lessons done</th>
                <th>Courses</th>
                <th>Certificates</th>
                <th>Badges</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.userId} className={picked.has(s.userId) ? "bg-brass-pale/30" : undefined}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${s.fullName || s.email}`}
                      checked={picked.has(s.userId)}
                      onChange={() => toggle(s.userId)}
                      className="h-4 w-4 accent-brass"
                    />
                  </td>
                  <td className="whitespace-nowrap">
                    <Link to={`/admin/students/${s.userId}`} className="font-semibold hover:text-brass-dark">
                      {s.fullName || "(no name)"}
                    </Link>
                  </td>
                  <td>{s.email}</td>
                  <td className="whitespace-nowrap">{s.lastActiveAt ? timeAgo(s.lastActiveAt) : <span className="text-subtle">Not started</span>}</td>
                  <td>{s.lessonsCompleted}</td>
                  <td className="whitespace-nowrap">
                    {s.enrollments} enrolled{s.completedCourses > 0 && `, ${s.completedCourses} finished`}
                  </td>
                  <td>{s.certificates}</td>
                  <td>{s.badges}</td>
                  <td className="whitespace-nowrap">{formatDate(s.joinedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {picked.size > 0 && (
        <p className="mt-3 text-[0.875rem] text-muted">
          {plural(picked.size, "student")} selected.{" "}
          <button type="button" className="underline hover:text-ink" onClick={() => setPicked(new Set())}>
            Clear
          </button>
        </p>
      )}
    </>
  );
}

/** Writes the message here, then hands it to Gmail or the mail app, with everyone in BCC. */
function Composer({ recipients, onClose }: { recipients: StudentSummary[]; onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const emails = recipients.map((r) => r.email);
  const draft = { bcc: emails, subject, body };
  const gmail = gmailUrl(draft);
  const mailto = mailtoUrl(draft);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section aria-label="Write an email" className="mb-8 rounded-2xl border border-line-strong bg-paper p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-[1.3rem]">Email {plural(recipients.length, "student")}</h2>
          <p className="mt-1 text-[0.875rem] text-muted">Everyone goes in BCC, so no one sees the other addresses.</p>
        </div>
        <Button variant="ghost" onClick={onClose} aria-label="Close">
          <X aria-hidden className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-5 grid gap-4">
        <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="New lesson: Window functions" />
        <TextArea label="Message" rows={7} value={body} onChange={(e) => setBody(e.target.value)} placeholder={"Hi,\n\n…\n\nCloudTech Academy"} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {gmail && (
          <a href={gmail} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
            Open in Gmail
          </a>
        )}
        {mailto && (
          <a href={mailto} className={buttonClass("secondary")}>
            Open in mail app
          </a>
        )}
        <Button variant="secondary" onClick={copy}>
          <Copy aria-hidden className="h-4 w-4" /> {copied ? "Addresses copied" : "Copy addresses"}
        </Button>
      </div>
      {(!gmail || !mailto) && (
        <p className="mt-3 text-[0.875rem] text-muted">
          This message is too long to hand over directly. Copy the addresses, paste them into BCC in your email, then add your subject and
          message.
        </p>
      )}
    </section>
  );
}

function downloadCsv(rows: StudentSummary[]) {
  const cell = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    ["Name", "Email", "Joined", "Last active", "Lessons completed", "Courses enrolled", "Courses finished", "Certificates", "Badges"],
    ...rows.map((s) => [s.fullName, s.email, s.joinedAt.slice(0, 10), s.lastActiveAt?.slice(0, 10) ?? "", s.lessonsCompleted, s.enrollments, s.completedCourses, s.certificates, s.badges]),
  ];
  const blob = new Blob([lines.map((l) => l.map(cell).join(",")).join("\r\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `academy-students-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function AdminStudent() {
  const { userId = "" } = useParams();
  const { data, error } = useAdminData(async () => (await getBackend()).admin.getStudent(userId), [userId]);
  const [removing, setRemoving] = useState(false);
  const navigate = useNavigate();
  if (error) return <Alert tone="error">{error}</Alert>;
  if (data === undefined) return <PageLoading />;
  if (!data) return <NotFound />;
  const s = data.summary;
  return (
    <>
      <AdminHeading title={s.fullName || s.email}>
        <a href={gmailUrl({ to: [s.email], subject: "", body: "" }) ?? `mailto:${s.email}`} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
          <Mail aria-hidden className="h-4 w-4" /> Email in Gmail
        </a>
        <a href={`mailto:${s.email}`} className={buttonClass("ghost")}>
          Mail app
        </a>
        <Button variant="secondary" onClick={() => setRemoving(true)}>
          <Trash2 aria-hidden className="h-4 w-4" /> Remove student
        </Button>
      </AdminHeading>
      <RemoveStudents people={[{ userId: s.userId, fullName: s.fullName, email: s.email }]} open={removing} onClose={() => setRemoving(false)} onDone={() => navigate("/admin/students")} />
      <p className="-mt-4 mb-6 text-[0.875rem] text-muted">
        <Link to="/admin/students" className="hover:text-ink">
          ← Students
        </Link>
      </p>
      <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div>
          <dt className="text-[0.8125rem] text-muted">Email</dt>
          <dd className="break-all">{s.email}</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted">Joined</dt>
          <dd>{formatDate(s.joinedAt)}</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted">Last active</dt>
          <dd>{s.lastActiveAt ? timeAgo(s.lastActiveAt) : "Not started"}</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted">Lessons completed</dt>
          <dd>{s.lessonsCompleted}</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted">Certificates</dt>
          <dd>{s.certificates}</dd>
        </div>
      </dl>
      <h2 className="mt-10 font-serif text-[1.4rem]">Courses</h2>
      {data.courses.length === 0 ? (
        <p className="mt-3 text-muted">Not enrolled in any course yet.</p>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {data.courses.map((c) => (
            <li key={c.courseId} className="rounded-2xl border border-line bg-paper p-5">
              <p className="font-semibold">{c.courseTitle}</p>
              <p className="mt-1 text-[0.8125rem] text-muted">
                Enrolled {formatDate(c.enrolledAt)}
                {c.completedAt && ` · Completed ${formatDate(c.completedAt)}`}
              </p>
              <div className="mt-4">
                <ProgressBar value={percent(c.completedLessons, c.totalLessons)} label={`${c.completedLessons} of ${c.totalLessons} lessons`} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-10 font-serif text-[1.4rem]">Badges and credentials</h2>
      {data.credentials.length === 0 ? (
        <p className="mt-3 text-muted">No badges yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-paper">
          {data.credentials.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
              <span>
                <span className="font-medium">{c.badgeName}</span>
                <span className="block text-[0.8125rem] text-muted">
                  {c.kind === "module_badge" || c.kind === "project_badge" ? `${credentialKindLabel(c.kind)} · ${c.courseTitle}` : credentialKindLabel(c.kind)}
                </span>
              </span>
              <span className="text-[0.8125rem] text-muted">
                <Link to={`/credentials/${c.credentialId}`} className="font-mono hover:text-ink">
                  {c.credentialId}
                </Link>{" "}
                · {formatDate(c.issuedAt)}
                {c.status === "revoked" && <span className="ml-2 font-semibold text-danger">Revoked</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
