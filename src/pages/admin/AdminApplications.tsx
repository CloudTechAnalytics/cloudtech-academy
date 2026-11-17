import { useMemo, useState } from "react";
import { Copy, Mail, MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { getBackend, type ApplicationStatus, type BatchInput, type ProgrammeApplication, type ProgrammeBatch } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { useProgrammes } from "@/lib/data";
import { coursePrice, formatPrice, isPaid } from "@/lib/commerce";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";
import type { Track } from "@/content/tracks";
import { Button, buttonClass } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

/** Admin → Applications: applications from the shareable enrolment form, the batches it offers, and the links to share. */

const field = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]";
type Msg = { tone: "success" | "error"; text: string } | null;

const STATUS: Record<ApplicationStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-brass-pale text-brass-deeper" },
  contacted: { label: "Contacted", cls: "bg-sand text-ink" },
  paid: { label: "Paid, no account yet", cls: "bg-success-bg text-success" },
  enrolled: { label: "Enrolled", cls: "bg-success-bg text-success" },
  declined: { label: "Declined", cls: "bg-danger/10 text-danger" },
};
const OCCUPATION = { student: "Student", professional: "Working professional", business_owner: "Business owner", job_seeker: "Looking for a job", other: "Something else" } as const;
const EXPERIENCE = { none: "New to this", some: "Knows a little", experienced: "Already works with it" } as const;

/** wa.me wants digits with the country code: 0803… becomes 234803…. */
export const waNumber = (raw: string) => {
  const d = raw.replace(/[^0-9]/g, "");
  if (raw.trim().startsWith("+")) return d;
  if (d.startsWith("0") && d.length === 11) return `234${d.slice(1)}`;
  return d;
};

const programmeName = (programmes: Track[], id: string) => {
  const t = programmes.find((p) => p.id === id);
  return t ? (t.programmeName ?? t.title) : id;
};

function ApplicationCard({ a, programmes, onChanged, note }: { a: ProgrammeApplication; programmes: Track[]; onChanged: () => Promise<unknown>; note: (m: Msg) => void }) {
  const track = programmes.find((p) => p.id === a.trackId);
  const price = track ? coursePrice(track) : null;
  const firstPart = price && a.plan === "two_part" ? Math.round(price.amount * (track?.firstPercent ?? 50)) / 100 : null;
  const suggested = price ? (a.amountPaid === 0 ? (firstPart ?? price.amount) : Math.max(0, price.amount - a.amountPaid)) : 0;

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ApplicationStatus>(a.status);
  const [adminNote, setAdminNote] = useState(a.adminNote ?? "");
  const [paying, setPaying] = useState(false);
  const [amount, setAmount] = useState(String(suggested || ""));
  const [method, setMethod] = useState("Bank transfer");
  const [reference, setReference] = useState(a.reference);
  const [paidOn, setPaidOn] = useState(new Date().toISOString().slice(0, 10));
  const [payNote, setPayNote] = useState("");
  const [busy, setBusy] = useState(false);

  const first = a.fullName.split(" ")[0];
  const wa = `https://wa.me/${waNumber(a.whatsapp)}?text=${encodeURIComponent(`Hello ${first}, this is CloudTech Academy about your application for ${programmeName(programmes, a.trackId)} (${a.reference}).`)}`;
  const paidLocked = a.status === "paid" || a.status === "enrolled";

  const run = async (fn: () => Promise<string | void>) => {
    setBusy(true);
    note(null);
    try {
      const text = await fn();
      await onChanged();
      if (text) note({ tone: "success", text });
    } catch (e) {
      note({ tone: "error", text: e instanceof Error ? e.message : "Something went wrong." });
    }
    setBusy(false);
  };

  const saveStatus = () => run(async () => {
    await (await getBackend()).admin.updateApplication(a.id, status, adminNote);
    return `${a.fullName}: saved.`;
  });
  const record = () => run(async () => {
    const value = Number(amount.replace(/,/g, ""));
    if (!(value > 0)) throw new Error("Enter the amount received.");
    const result = await (await getBackend()).admin.recordApplicationPayment(a.id, { amount: value, method, reference, paidOn, note: payNote });
    setPaying(false);
    return result === "enrolled"
      ? `${a.fullName} is enrolled: their programme is open in their account.`
      : `Payment recorded. ${a.fullName} has no account yet, so we've emailed them a link to create one with ${a.email}. Their programme opens as soon as they do.`;
  });
  const remove = () => {
    if (!window.confirm(`Delete ${a.fullName}'s application (${a.reference})? This can't be undone.`)) return;
    void run(async () => {
      await (await getBackend()).admin.deleteApplication(a.id);
      return "Application deleted.";
    });
  };

  return (
    <li className="rounded-2xl border border-line bg-paper">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-left">
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{a.fullName}</span>
          <span className="block text-[0.8125rem] text-muted">
            {programmeName(programmes, a.trackId)} · {a.reference} · {formatDate(a.createdAt)}
          </span>
        </span>
        {a.amountPaid > 0 && price && (
          <span className="text-[0.8125rem] text-muted">
            Paid {formatPrice(a.amountPaid, price.currency)} of {formatPrice(price.amount, price.currency)}
          </span>
        )}
        <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${STATUS[a.status].cls}`}>{STATUS[a.status].label}</span>
      </button>
      {open && (
        <div className="border-t border-line p-4">
          <div className="flex flex-wrap gap-2">
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
              <MessageCircle aria-hidden className="h-4 w-4" /> WhatsApp {a.whatsapp}
            </a>
            <a href={`mailto:${a.email}?subject=${encodeURIComponent(`Your application ${a.reference}`)}`} className={buttonClass("secondary")}>
              <Mail aria-hidden className="h-4 w-4" /> {a.email}
            </a>
          </div>
          <dl className="mt-4 grid gap-x-6 gap-y-2 text-[0.9375rem] sm:grid-cols-2">
            <div>
              <dt className="text-[0.8125rem] text-muted">Batch</dt>
              <dd>{a.batchLabel ?? "Next batch (dates not set)"}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Payment plan</dt>
              <dd>
                {a.plan === "two_part" ? "Two parts" : "In full"}
                {price && ` · ${formatPrice(price.amount, price.currency)}${firstPart !== null ? ` (${formatPrice(firstPart, price.currency)} first)` : ""}`}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Does now</dt>
              <dd>{OCCUPATION[a.occupation]}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Experience</dt>
              <dd>{EXPERIENCE[a.experience]}</dd>
            </div>
            {a.heardFrom && (
              <div>
                <dt className="text-[0.8125rem] text-muted">Heard about us</dt>
                <dd>{a.heardFrom}</dd>
              </div>
            )}
            <div>
              <dt className="text-[0.8125rem] text-muted">Account</dt>
              <dd>{a.userId ? "Has an account" : "No account yet"}</dd>
            </div>
            {a.message && (
              <div className="sm:col-span-2">
                <dt className="text-[0.8125rem] text-muted">Their message</dt>
                <dd className="whitespace-pre-line">{a.message}</dd>
              </div>
            )}
          </dl>

          <div className="mt-5 grid gap-4 rounded-xl border border-line p-4 sm:grid-cols-[12rem_1fr]">
            <label className="block text-[0.875rem] font-medium">
              Status
              <select className={field} value={status} disabled={paidLocked} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
                {paidLocked ? (
                  <option value={a.status}>{STATUS[a.status].label}</option>
                ) : (
                  (["new", "contacted", "declined"] as ApplicationStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS[s].label}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label className="block text-[0.875rem] font-medium">
              Private note
              <input className={field} value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="e.g. Called on 18 Nov, paying Friday" />
            </label>
            <div className="sm:col-span-2">
              <Button variant="secondary" onClick={() => void saveStatus()} loading={busy} disabled={status === a.status && adminNote === (a.adminNote ?? "")}>
                Save status and note
              </Button>
            </div>
          </div>

          {a.status !== "declined" && (
            <div className="mt-4 rounded-xl border border-line p-4">
              {!paying ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => setPaying(true)}>Record a payment</Button>
                  <p className="text-[0.8125rem] text-muted">When their money arrives. This opens the programme (or emails them to create an account first).</p>
                </div>
              ) : (
                <form
                  className="grid gap-3 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void record();
                  }}
                >
                  <TextField label={`Amount received${price ? ` (${price.currency})` : ""}`} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <TextField label="Date received" type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} />
                  <TextField label="How they paid" value={method} onChange={(e) => setMethod(e.target.value)} />
                  <TextField label="Payment reference" value={reference} onChange={(e) => setReference(e.target.value)} />
                  <div className="sm:col-span-2">
                    <TextField label="Note (optional)" value={payNote} onChange={(e) => setPayNote(e.target.value)} />
                  </div>
                  <div className="flex gap-2 sm:col-span-2">
                    <Button type="submit" loading={busy}>
                      Record payment
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setPaying(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {!paidLocked && (
            <button type="button" onClick={remove} className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-danger">
              <Trash2 aria-hidden className="h-3.5 w-3.5" /> Delete application
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function Applications({ programmes, note }: { programmes: Track[]; note: (m: Msg) => void }) {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listApplications());
  const [programme, setProgramme] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (a) =>
        (!programme || a.trackId === programme) &&
        (!status || a.status === status) &&
        (!term || [a.fullName, a.email, a.whatsapp, a.reference].some((v) => v.toLowerCase().includes(term))),
    );
  }, [data, programme, status, q]);

  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const counts = (Object.keys(STATUS) as ApplicationStatus[]).map((s) => [s, data.filter((a) => a.status === s).length] as const);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {counts.map(([s, n]) => (
          <button key={s} type="button" onClick={() => setStatus(status === s ? "" : s)} className={`rounded-full border px-3 py-1 text-[0.8125rem] ${status === s ? "border-ink bg-ink text-paper" : "border-line-strong"}`}>
            {STATUS[s].label} · {n}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr]">
        <select className={field} value={programme} onChange={(e) => setProgramme(e.target.value)} aria-label="Programme">
          <option value="">All programmes</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.programmeName ?? p.title}
            </option>
          ))}
        </select>
        <input className={field} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone or reference" aria-label="Search" />
      </div>
      {list.length ? (
        <ul className="mt-5 space-y-3">
          {list.map((a) => (
            <ApplicationCard key={`${a.id}${a.updatedAt}`} a={a} programmes={programmes} onChanged={reload} note={note} />
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-muted">{data.length ? "No applications match." : "No applications yet. Share a programme's link from the Share links tab."}</p>
      )}
    </>
  );
}

const emptyBatch = (trackId: string): BatchInput => ({ trackId, name: "", startsOn: null, schedule: null, mode: "online", location: null, applyBy: null, seats: null, status: "open" });

function BatchForm({ initial, programmes, onDone, note }: { initial: BatchInput; programmes: Track[]; onDone: () => Promise<unknown>; note: (m: Msg) => void }) {
  const [b, setB] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof BatchInput>(k: K, v: BatchInput[K]) => setB((x) => ({ ...x, [k]: v }));
  const save = async () => {
    if (b.name.trim().length < 2) return note({ tone: "error", text: "Give the batch a name, e.g. December 2026 batch." });
    setBusy(true);
    try {
      await (await getBackend()).admin.saveBatch(b);
      await onDone();
      note({ tone: "success", text: `${b.name.trim()} saved.` });
    } catch (e) {
      note({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save the batch." });
    }
    setBusy(false);
  };
  return (
    <form
      className="grid gap-3 rounded-2xl border border-line-strong bg-paper p-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <label className="block text-[0.875rem] font-medium">
        Programme
        <select className={field} value={b.trackId} onChange={(e) => set("trackId", e.target.value)}>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.programmeName ?? p.title}
            </option>
          ))}
        </select>
      </label>
      <TextField label="Batch name" value={b.name} onChange={(e) => set("name", e.target.value)} placeholder="December 2026 batch" />
      <TextField label="Start date" type="date" value={b.startsOn ?? ""} onChange={(e) => set("startsOn", e.target.value || null)} />
      <TextField label="Class days and times" value={b.schedule ?? ""} onChange={(e) => set("schedule", e.target.value || null)} placeholder="Tue & Thu, 7–9pm WAT; Sat 10am–1pm" />
      <label className="block text-[0.875rem] font-medium">
        How classes run
        <select className={field} value={b.mode} onChange={(e) => set("mode", e.target.value as BatchInput["mode"])}>
          <option value="online">Online</option>
          <option value="physical">In person</option>
          <option value="hybrid">Hybrid (online and in person)</option>
        </select>
      </label>
      <TextField label="Location (for in person or hybrid)" value={b.location ?? ""} onChange={(e) => set("location", e.target.value || null)} placeholder="Ikeja, Lagos" />
      <TextField label="Last day to apply (optional)" type="date" value={b.applyBy ?? ""} onChange={(e) => set("applyBy", e.target.value || null)} />
      <TextField
        label="Seats (optional)"
        type="number"
        min={1}
        value={b.seats ?? ""}
        onChange={(e) => set("seats", e.target.value ? Number(e.target.value) : null)}
        hint="Counts applicants who have paid. Leave empty for no limit."
      />
      <label className="flex items-center gap-2.5 text-[0.9375rem] sm:col-span-2">
        <input type="checkbox" checked={b.status === "open"} onChange={(e) => set("status", e.target.checked ? "open" : "closed")} className="h-4 w-4 accent-(--color-brass-dark)" />
        Taking applications (shown on the enrolment form)
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" loading={busy}>
          Save batch
        </Button>
        <Button type="button" variant="ghost" onClick={() => void onDone()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Batches({ programmes, note }: { programmes: Track[]; note: (m: Msg) => void }) {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listAllBatches());
  const [editing, setEditing] = useState<BatchInput | null>(null);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;

  const done = async () => {
    setEditing(null);
    await reload();
  };
  const remove = async (b: ProgrammeBatch) => {
    if (!window.confirm(`Delete ${b.name}? Applications that chose it keep their batch description.`)) return;
    try {
      await (await getBackend()).admin.deleteBatch(b.id);
      await reload();
      note({ tone: "success", text: `${b.name} deleted.` });
    } catch (e) {
      note({ tone: "error", text: e instanceof Error ? e.message : "Couldn't delete the batch." });
    }
  };

  return (
    <>
      <p className="max-w-2xl text-[0.9375rem] text-muted">
        Batches appear on each programme's enrolment form, so applicants can pick when they start. With no open batch, the form says "Next batch: dates announced soon".
      </p>
      {editing ? (
        <div className="mt-5">
          <BatchForm initial={editing} programmes={programmes} onDone={done} note={note} />
        </div>
      ) : (
        <Button className="mt-5" onClick={() => setEditing(emptyBatch(programmes[0]?.id ?? ""))}>
          <Plus aria-hidden className="h-4 w-4" /> Add a batch
        </Button>
      )}
      <div className="mt-6 space-y-6">
        {programmes.map((p) => {
          const list = data.filter((b) => b.trackId === p.id).sort((x, y) => (y.startsOn ?? "").localeCompare(x.startsOn ?? ""));
          return (
            <section key={p.id}>
              <h3 className="font-serif text-[1.2rem]">{p.programmeName ?? p.title}</h3>
              {list.length ? (
                <ul className="mt-2 space-y-2">
                  {list.map((b) => (
                    <li key={b.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3">
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">
                          {b.name}{" "}
                          <span className={`ml-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold ${b.status === "open" ? "bg-success-bg text-success" : "bg-sand text-muted"}`}>
                            {b.status === "open" ? "Open" : "Closed"}
                          </span>
                        </span>
                        <span className="block text-[0.8125rem] text-muted">
                          {[b.startsOn ? `Starts ${formatDate(b.startsOn)}` : "No start date", b.schedule, b.applyBy ? `apply by ${formatDate(b.applyBy)}` : null, b.seats ? `${b.seatsTaken} of ${b.seats} seats paid` : `${b.seatsTaken} paid`]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <button type="button" onClick={() => setEditing({ ...b })} className="rounded p-1.5 hover:bg-sand" aria-label={`Edit ${b.name}`}>
                        <Pencil aria-hidden className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => void remove(b)} className="rounded p-1.5 text-danger hover:bg-danger/10" aria-label={`Delete ${b.name}`}>
                        <Trash2 aria-hidden className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-[0.875rem] text-muted">No batches yet.</p>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

function ShareLinks({ programmes }: { programmes: Track[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt("Copy this:", text);
    }
  };
  const all = `${SITE.url}/apply`;
  return (
    <>
      <p className="max-w-2xl text-[0.9375rem] text-muted">Send these to people who message you on WhatsApp. Each link opens the programme's enrolment form, with the batches, fee and payment plans.</p>
      <ul className="mt-5 space-y-3">
        {programmes.map((p) => {
          const url = `${SITE.url}/apply/${p.slug}`;
          const price = coursePrice(p);
          const msg = [
            `Thank you for your interest in ${p.programmeName ?? p.title} at CloudTech Academy.`,
            "",
            `Here's the enrolment form, with the next batch dates, the fee${p.allowInstalments ? " and the instalment plan" : ""}:`,
            url,
            "",
            "Fill it in, and you'll get your reference and payment details straight away.",
          ].join("\n");
          return (
            <li key={p.id} className="rounded-2xl border border-line bg-paper p-4">
              <p className="font-semibold">{p.programmeName ?? p.title}</p>
              <p className="mt-0.5 text-[0.8125rem] text-muted">{price ? formatPrice(price.amount, price.currency) : "No price set: the form says applications aren't open"}</p>
              <p className="mt-2 break-all font-mono text-[0.875rem]">{url}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => void copy(`${p.id}-link`, url)} className={buttonClass("secondary")}>
                  <Copy aria-hidden className="h-4 w-4" /> {copied === `${p.id}-link` ? "Copied" : "Copy link"}
                </button>
                <button type="button" onClick={() => void copy(`${p.id}-msg`, msg)} className={buttonClass("secondary")}>
                  <MessageCircle aria-hidden className="h-4 w-4" /> {copied === `${p.id}-msg` ? "Copied" : "Copy WhatsApp message"}
                </button>
              </div>
            </li>
          );
        })}
        <li className="rounded-2xl border border-line bg-paper p-4">
          <p className="font-semibold">All programmes</p>
          <p className="mt-0.5 text-[0.8125rem] text-muted">For people who haven't chosen yet.</p>
          <p className="mt-2 break-all font-mono text-[0.875rem]">{all}</p>
          <button type="button" onClick={() => void copy("all", all)} className={`${buttonClass("secondary")} mt-3`}>
            <Copy aria-hidden className="h-4 w-4" /> {copied === "all" ? "Copied" : "Copy link"}
          </button>
        </li>
      </ul>
    </>
  );
}

const TABS = [
  ["applications", "Applications"],
  ["batches", "Batches"],
  ["links", "Share links"],
] as const;

export default function AdminApplications() {
  const programmes = useProgrammes().filter((t) => isPaid(t));
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("applications");
  const [msg, setMsg] = useState<Msg>(null);
  return (
    <>
      <AdminHeading title="Applications" />
      <div role="tablist" className="mb-6 flex flex-wrap gap-2 border-b border-line">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => {
              setTab(k);
              setMsg(null);
            }}
            className={`-mb-px border-b-2 px-3 py-2 text-[0.9375rem] font-medium ${tab === k ? "border-brass-dark text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mb-4">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      </div>
      {tab === "applications" && <Applications programmes={programmes} note={setMsg} />}
      {tab === "batches" && <Batches programmes={programmes} note={setMsg} />}
      {tab === "links" && <ShareLinks programmes={programmes} />}
    </>
  );
}
