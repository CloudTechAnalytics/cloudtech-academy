import { useState } from "react";
import { getBackend, type EmailLogEntry, type EmailTemplate } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

const field = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]";
const STATUS: Record<EmailLogEntry["status"], string> = { queued: "Waiting to send", sent: "Sent", failed: "Failed", skipped: "Sending…" };
const TEMPLATE_LABEL: Record<string, string> = { welcome: "Welcome", enrolment: "Enrolment", message: "Your message" };
const SAMPLE = { name: "Ngozi", full_name: "Ngozi Eze", course: "Excel for Data Analysis", link: "https://academy.cloudtechanalytics.com/courses/excel-for-data-analysis", site: "https://academy.cloudtechanalytics.com" };
const fill = (t: string) => Object.entries(SAMPLE).reduce((v, [k, val]) => v.split(`{{${k}}}`).join(val), t);

type Msg = { tone: "success" | "error"; text: string } | null;

function TemplateCard({ t, onSaved, note }: { t: EmailTemplate; onSaved: () => Promise<unknown>; note: (m: Msg) => void }) {
  const [subject, setSubject] = useState(t.subject);
  const [body, setBody] = useState(t.body);
  const [enabled, setEnabled] = useState(t.enabled);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const dirty = subject !== t.subject || body !== t.body || enabled !== t.enabled;

  const save = async () => {
    if (subject.trim().length < 2 || body.trim().length < 2) return note({ tone: "error", text: "Give the email a subject and a message." });
    setBusy(true);
    try {
      await (await getBackend()).admin.saveEmailTemplate({ ...t, subject, body, enabled });
      await onSaved();
      note({ tone: "success", text: `${t.label.split(" (")[0]} saved.` });
    } catch (e) {
      note({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save." });
    }
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-[1.2rem]">{t.label}</h3>
        <label className="flex items-center gap-2 text-[0.9375rem]">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4 accent-[var(--color-brass-dark)]" />
          Send this email
        </label>
      </div>
      <label className="mt-3 block text-[0.875rem] font-medium">
        Subject
        <input className={field} value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <label className="mt-3 block text-[0.875rem] font-medium">
        Message
        <textarea rows={9} className={field} value={body} onChange={(e) => setBody(e.target.value)} />
      </label>
      <p className="mt-1.5 text-[0.8125rem] text-muted">
        These fill in by themselves: <code>{"{{name}}"}</code> (first name), <code>{"{{link}}"}</code>
        {t.key === "enrolment" && (
          <>
            , <code>{"{{course}}"}</code>
          </>
        )}
        .
      </p>
      {preview && (
        <div className="mt-4 rounded-xl border border-line-strong bg-sand/50 p-4 text-[0.9375rem]">
          <p className="text-[0.8125rem] text-muted">Preview, as Ngozi would see it</p>
          <p className="mt-1 font-semibold">{fill(subject)}</p>
          <p className="mt-2 whitespace-pre-line">{fill(body)}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => void save()} loading={busy} disabled={!dirty}>
          Save
        </Button>
        <Button variant="secondary" onClick={() => setPreview((x) => !x)}>
          {preview ? "Hide preview" : "Preview"}
        </Button>
      </div>
    </div>
  );
}

/** Admin → Emails: the welcome and enrolment emails, messages to students, and a log of everything sent. */
export default function AdminEmails() {
  const { data, error, reload } = useAdminData(async () => {
    const b = await getBackend();
    const [templates, log, setup, students] = await Promise.all([b.admin.listEmailTemplates(), b.admin.listEmailLog(), b.admin.emailSetup(), b.admin.listStudents()]);
    return { templates, log, setup, students };
  });
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);
  const [to, setTo] = useState("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [show, setShow] = useState("");

  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const { templates, log, setup, students } = data;
  const reply = replyTo ?? setup.replyTo ?? "";
  const queued = log.filter((l) => l.status === "queued").length;
  const failed = log.filter((l) => l.status === "failed").length;
  const rows = log.filter((l) => !show || l.status === show);

  const act = async (okText: (n?: number) => string, fn: () => Promise<number | void>) => {
    setBusy(true);
    setMsg(null);
    try {
      const n = await fn();
      await reload();
      setMsg({ tone: "success", text: okText(typeof n === "number" ? n : undefined) });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "That didn't work." });
    }
    setBusy(false);
  };

  return (
    <>
      <AdminHeading title="Emails" />
      {msg && (
        <div className="mb-5" aria-live="polite">
          <Alert tone={msg.tone}>{msg.text}</Alert>
        </div>
      )}

      <section className="rounded-2xl border border-line bg-paper p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-serif text-[1.25rem]">{setup.configured ? "Email sending is set up" : "Email sending isn't connected yet"}</p>
            <p className="mt-1 max-w-2xl text-[0.9375rem] text-muted">
              {setup.configured
                ? `Emails go out from ${setup.from}.`
                : "Emails are saved and wait in the queue. They go out as soon as the mail provider is connected (the RESEND_API_KEY and EMAIL_FROM secrets on the server)."}
            </p>
          </div>
          <label className="flex items-center gap-2.5 text-[0.9375rem]">
            <input
              type="checkbox"
              checked={setup.enabled}
              disabled={busy}
              onChange={(e) => void act(() => (e.target.checked ? "Emails are on." : "Emails are paused."), async () => (await getBackend()).admin.saveEmailSettings({ enabled: e.target.checked, replyTo: setup.replyTo }))}
              className="h-4 w-4 accent-[var(--color-brass-dark)]"
            />
            Send emails
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-[16rem] flex-1 text-[0.875rem] font-medium">
            Replies go to (optional)
            <input className={field} type="email" value={reply} onChange={(e) => setReplyTo(e.target.value)} placeholder="academy@yourdomain.com" />
          </label>
          <Button variant="secondary" loading={busy} onClick={() => void act(() => "Reply address saved.", async () => (await getBackend()).admin.saveEmailSettings({ enabled: setup.enabled, replyTo: reply || null }))}>
            Save
          </Button>
          <Button
            variant="secondary"
            loading={busy}
            disabled={!queued}
            onClick={() =>
              void act(
                () => "Done.",
                async () => {
                  const r = await (await getBackend()).admin.sendQueuedEmails();
                  setMsg(r.configured ? { tone: "success", text: `Sent ${r.sent}${r.failed ? `, ${r.failed} failed` : ""}.` } : { tone: "error", text: "Email sending isn't connected yet, so these are still waiting." });
                },
              )
            }
          >
            Send {queued} waiting
          </Button>
          <Button variant="secondary" loading={busy} disabled={!failed} onClick={() => void act((n) => `${n ?? 0} failed emails put back in the queue.`, async () => (await getBackend()).admin.retryEmails())}>
            Retry {failed} failed
          </Button>
        </div>
      </section>

      <h2 className="mt-10 font-serif text-[1.5rem]">Automatic emails</h2>
      <p className="mt-1 max-w-2xl text-[0.9375rem] text-muted">Sent for you when someone signs up and when they enrol. Edit the wording, or switch one off.</p>
      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {templates.map((t) => (
          <TemplateCard key={`${t.key}:${t.subject}:${t.body}:${t.enabled}`} t={t} onSaved={reload} note={setMsg} />
        ))}
      </div>

      <h2 className="mt-12 font-serif text-[1.5rem]">Send a message</h2>
      <form
        className="mt-4 space-y-4 rounded-2xl border border-line bg-paper p-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const ids = to === "all" ? students.map((s) => s.userId) : [to];
          if (!window.confirm(`Send this message to ${to === "all" ? `all ${ids.length} students` : "this student"}?`)) return;
          void act(
            (n) => `Message queued for ${n ?? 0} ${n === 1 ? "student" : "students"}.`,
            async () => {
              const n = await (await getBackend()).admin.sendMessage(ids, subject, body);
              setSubject("");
              setBody("");
              return n;
            },
          );
        }}
      >
        <label className="block text-[0.875rem] font-medium">
          To
          <select className={field} value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="all">Everyone ({students.length} students)</option>
            {students.map((s) => (
              <option key={s.userId} value={s.userId}>
                {s.fullName} ({s.email})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[0.875rem] font-medium">
          Subject
          <input className={field} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label className="block text-[0.875rem] font-medium">
          Message
          <textarea rows={6} className={field} value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
        <p className="text-[0.8125rem] text-muted">
          <code>{"{{name}}"}</code> becomes each student's first name.
        </p>
        <Button type="submit" loading={busy}>
          Send message
        </Button>
      </form>

      <div className="mb-3 mt-12 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-[1.5rem]">Email log</h2>
        <select aria-label="Status" className="rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]" value={show} onChange={(e) => setShow(e.target.value)}>
          <option value="">All</option>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>To</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td>
                  {l.toName ?? "—"}
                  <span className="block text-[0.75rem] text-muted">{l.toEmail}</span>
                </td>
                <td className="max-w-[22rem]">
                  {l.subject}
                  <span className="block text-[0.75rem] text-muted">{TEMPLATE_LABEL[l.template ?? ""] ?? l.template}</span>
                  {l.error && <span className="block break-words text-[0.75rem] text-danger">{l.error}</span>}
                </td>
                <td>{STATUS[l.status]}</td>
                <td className="whitespace-nowrap">{formatDate(l.sentAt ?? l.createdAt)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted">
                  No emails yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
