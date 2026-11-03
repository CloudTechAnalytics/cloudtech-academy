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

/** Connect sending with a Gmail address and an app password. The password is saved but never shown again. */
function ConnectGmail({ smtpUser, connected, onChanged, note }: { smtpUser: string | null; connected: boolean; onChanged: () => Promise<unknown>; note: (m: Msg) => void }) {
  const [gmail, setGmail] = useState(smtpUser ?? "");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>, ok: string) => {
    setBusy(true);
    try {
      await fn();
      setPass("");
      await onChanged();
      note({ tone: "success", text: ok });
    } catch (e) {
      note({ tone: "error", text: e instanceof Error ? e.message : "That didn't work." });
    }
    setBusy(false);
  };
  return (
    <div className="mt-5 rounded-xl border border-line-strong bg-sand/40 p-4">
      <p className="font-semibold">{connected ? "Sending from Gmail" : "Connect with Gmail"}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-[0.875rem] text-muted">
        <li>Turn on 2-Step Verification for the Gmail account you want to send from.</li>
        <li>
          Open <span className="font-mono">myaccount.google.com/apppasswords</span>, create an app password called "CloudTech Academy", and copy the 16 letters.
        </li>
        <li>Paste your Gmail address and that app password here. Use the app password, not your normal Gmail password.</li>
      </ol>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-[0.875rem] font-medium">
          Gmail address
          <input className={field} type="email" value={gmail} onChange={(e) => setGmail(e.target.value)} placeholder="you@gmail.com" autoComplete="off" />
        </label>
        <label className="text-[0.875rem] font-medium">
          App password
          <input className={field} type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder={smtpUser ? "Saved. Leave empty to keep it." : "xxxx xxxx xxxx xxxx"} autoComplete="new-password" />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <Button loading={busy} onClick={() => void run(async () => (await getBackend()).admin.saveEmailCredentials(gmail, pass), "Saved. Press Send waiting to send the queued emails.")}>
          Save and connect
        </Button>
        {smtpUser && (
          <Button variant="secondary" disabled={busy} onClick={() => void run(async () => (await getBackend()).admin.clearEmailCredentials(), "Disconnected.")}>
            Disconnect
          </Button>
        )}
      </div>
      <p className="mt-2 text-[0.8125rem] text-muted">Gmail sends about 500 emails a day, which is plenty for welcome and enrolment emails. Emails show your Gmail address as the sender.</p>
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
  const [picked, setPicked] = useState<Set<string>>(new Set());

  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const { templates, log, setup, students } = data;
  const reply = replyTo ?? setup.replyTo ?? "";
  const queued = log.filter((l) => l.status === "queued").length;
  const failed = log.filter((l) => l.status === "failed").length;
  const rows = log.filter((l) => !show || l.status === show);
  const allShown = rows.length > 0 && rows.every((r) => picked.has(r.id));
  const togglePick = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const remove = (ids: string[], what: string) => {
    if (!ids.length || !window.confirm(`Delete ${what} from the log? Emails already sent can't be recalled, and waiting emails won't be sent.`)) return;
    void act(
      () => `${ids.length} ${ids.length === 1 ? "entry" : "entries"} deleted.`,
      async () => {
        await (await getBackend()).admin.deleteEmails(ids);
        setPicked(new Set());
      },
    );
  };

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
                : "Emails are saved and wait in the queue. They go out as soon as you connect an email account below."}
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
        {setup.provider !== "resend" && <ConnectGmail smtpUser={setup.smtpUser} connected={setup.provider === "gmail"} onChanged={reload} note={setMsg} />}
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
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" disabled={busy || picked.size === 0} onClick={() => remove([...picked], picked.size === 1 ? "this entry" : `${picked.size} entries`)}>
            Delete selected{picked.size ? ` (${picked.size})` : ""}
          </Button>
          <Button variant="secondary" disabled={busy || !log.some((l) => l.status === "sent")} onClick={() => remove(log.filter((l) => l.status === "sent").map((l) => l.id), "all sent emails")}>
            Clear sent
          </Button>
        <select aria-label="Status" className="rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]" value={show} onChange={(e) => setShow(e.target.value)}>
          <option value="">All</option>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        </div>
      </div>
      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th className="w-10">
                <input
                  type="checkbox"
                  aria-label="Select everything shown"
                  checked={allShown}
                  onChange={() => setPicked(allShown ? new Set() : new Set(rows.map((r) => r.id)))}
                  className="h-4 w-4 accent-[var(--color-brass-dark)]"
                />
              </th>
              <th>To</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td>
                  <input type="checkbox" aria-label={`Select ${l.subject}`} checked={picked.has(l.id)} onChange={() => togglePick(l.id)} className="h-4 w-4 accent-[var(--color-brass-dark)]" />
                </td>
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
                <td className="text-right">
                  <button type="button" disabled={busy} className="text-[0.8125rem] font-semibold text-danger disabled:opacity-50" onClick={() => remove([l.id], "this entry")}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
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
