import { useMemo, useState } from "react";
import { getBackend, type AdminPayment, type PaymentAccount, type PaymentSettings, type PaymentStatus } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { formatPrice, isPaid } from "@/lib/commerce";
import { TRACKS } from "@/content/tracks";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";
import { AdminCardOrders } from "./AdminProgrammes";

const selectCls = "rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]";
const field = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]";

const STATUS: Record<PaymentStatus, string> = { pending: "Not paid yet", submitted: "Awaiting confirmation", confirmed: "Confirmed", rejected: "Rejected" };
const overdue = (p: AdminPayment) => p.status !== "confirmed" && !!p.dueAt && new Date(p.dueAt) < new Date();
const todayIso = () => new Date().toISOString().slice(0, 10);

function Chip({ p }: { p: AdminPayment }) {
  const late = overdue(p);
  const cls = late || p.status === "rejected" ? "border-danger/40 bg-danger/10 text-danger" : p.status === "confirmed" ? "border-success/40 bg-success-bg text-success" : p.status === "submitted" ? "border-brass/50 bg-brass-pale/50 text-brass-dark" : "border-line-strong bg-sand text-muted";
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.75rem] font-medium ${cls}`}>{late ? "Overdue" : STATUS[p.status]}</span>;
}

/** Payment accounts and how payments are taken: the settings learners see when they pay. */
function AccountsAndSettings({ accounts, settings, reload, note }: { accounts: PaymentAccount[]; settings: PaymentSettings; reload: () => Promise<unknown>; note: (m: { tone: "success" | "error"; text: string }) => void }) {
  const [draft, setDraft] = useState<(Partial<PaymentAccount> & { label: string }) | null>(null);
  const [mode, setMode] = useState(settings.mode);
  const [proof, setProof] = useState(settings.proofRequired);
  const [instructions, setInstructions] = useState(settings.instructions ?? "");
  const [busy, setBusy] = useState(false);

  const act = async (okText: string, fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      await reload();
      note({ tone: "success", text: okText });
    } catch (e) {
      note({ tone: "error", text: e instanceof Error ? e.message : "That didn't work." });
    }
    setBusy(false);
  };

  return (
    <section className="mt-12" aria-labelledby="accounts-title">
      <h2 id="accounts-title" className="font-serif text-[1.5rem]">
        Payment accounts and settings
      </h2>
      <div className="mt-4 rounded-2xl border border-line bg-paper p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-[0.875rem] font-medium">
            How learners pay
            <select className={field} value={mode} onChange={(e) => setMode(e.target.value as PaymentSettings["mode"])}>
              <option value="manual">Direct to our account (confirmed by an admin)</option>
              <option value="paystack">Card payment through Paystack</option>
            </select>
          </label>
          <label className="flex items-center gap-2.5 self-end pb-2 text-[0.9375rem]">
            <input type="checkbox" checked={proof} onChange={(e) => setProof(e.target.checked)} className="h-4 w-4 accent-[var(--color-brass-dark)]" />
            Learners must upload a receipt
          </label>
        </div>
        <label className="mt-4 block text-[0.875rem] font-medium">
          Extra instructions shown with payment details (optional)
          <textarea rows={2} className={field} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </label>
        <Button className="mt-4" loading={busy} onClick={() => void act("Settings saved.", async () => (await getBackend()).admin.savePaymentSettings({ mode, proofRequired: proof, instructions }))}>
          Save settings
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="font-serif text-[1.2rem]">Accounts learners can pay into</h3>
        <Button variant="secondary" onClick={() => setDraft({ label: "", currency: "NGN", active: true })}>
          Add account
        </Button>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {accounts.map((a) => (
          <div key={a.id} className={`rounded-2xl border p-4 ${a.active ? "border-line bg-paper" : "border-line bg-sand/50 opacity-70"}`}>
            <p className="font-semibold">
              {a.label} {!a.active && <span className="text-[0.75rem] font-normal text-muted">(hidden from learners)</span>}
            </p>
            <p className="mt-1 text-[0.875rem] text-muted">{[a.bankName, a.accountName, a.accountNumber].filter(Boolean).join(" · ") || "No details yet"}</p>
            <div className="mt-3 flex gap-4 text-[0.8125rem] font-semibold">
              <button type="button" className="text-brass-dark" onClick={() => setDraft(a)}>
                Edit
              </button>
              <button
                type="button"
                className="text-danger"
                onClick={() => {
                  if (window.confirm(`Delete the account "${a.label}"? Payments already made keep its name.`)) void act("Account deleted.", async () => (await getBackend()).admin.deletePaymentAccount(a.id));
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {accounts.length === 0 && <p className="text-muted">No accounts yet. Add the account learners should pay into.</p>}
      </div>

      {draft && (
        <form
          className="mt-4 space-y-4 rounded-2xl border border-brass/40 bg-paper p-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.label.trim().length < 2) return note({ tone: "error", text: "Give the account a name learners will recognise, like Bank transfer." });
            void act("Account saved.", async () => {
              await (await getBackend()).admin.savePaymentAccount({
                id: draft.id,
                label: draft.label,
                bankName: draft.bankName ?? null,
                accountName: draft.accountName ?? null,
                accountNumber: draft.accountNumber ?? null,
                instructions: draft.instructions ?? null,
                currency: draft.currency ?? "NGN",
                active: draft.active ?? true,
              });
              setDraft(null);
            });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-[0.875rem] font-medium">
              Method name
              <input className={field} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Bank transfer" />
            </label>
            <label className="text-[0.875rem] font-medium">
              Bank
              <input className={field} value={draft.bankName ?? ""} onChange={(e) => setDraft({ ...draft, bankName: e.target.value })} />
            </label>
            <label className="text-[0.875rem] font-medium">
              Account name
              <input className={field} value={draft.accountName ?? ""} onChange={(e) => setDraft({ ...draft, accountName: e.target.value })} />
            </label>
            <label className="text-[0.875rem] font-medium">
              Account number
              <input className={field} value={draft.accountNumber ?? ""} onChange={(e) => setDraft({ ...draft, accountNumber: e.target.value })} />
            </label>
          </div>
          <label className="block text-[0.875rem] font-medium">
            Instructions for this method (optional)
            <textarea rows={2} className={field} value={draft.instructions ?? ""} onChange={(e) => setDraft({ ...draft, instructions: e.target.value })} />
          </label>
          <label className="flex items-center gap-2.5 text-[0.9375rem]">
            <input type="checkbox" checked={draft.active ?? true} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="h-4 w-4 accent-[var(--color-brass-dark)]" />
            Show to learners
          </label>
          <div className="flex gap-3">
            <Button type="submit" loading={busy}>
              Save account
            </Button>
            <Button type="button" variant="secondary" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

/** Admin Payments: confirm what learners say they paid, record payments received elsewhere, correct or delete them, and set where learners pay. */
export default function AdminPayments() {
  const { data, error, reload } = useAdminData(async () => {
    const b = await getBackend();
    const [payments, accounts, settings, students, courses, sales] = await Promise.all([
      b.admin.listPayments(),
      b.admin.listAllPaymentAccounts(),
      b.getPaymentSettings(),
      b.admin.listStudents(),
      b.listCourses({ includeUnpublished: true }),
      b.listProgrammeSales(),
    ]);
    const programmes = TRACKS.filter((t) => (sales[t.id]?.access ?? t.access) === "paid");
    return { payments, accounts, settings, students, courses, programmes };
  });
  const [filter, setFilter] = useState("attention");
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<AdminPayment | null>(null);
  const [edit, setEdit] = useState({ amount: "", status: "confirmed" as PaymentStatus, method: "", note: "", paidOn: "" });
  const [reg, setReg] = useState({ userId: "", target: "", amount: "", method: "", reference: "", note: "", paidOn: todayIso() });

  const rows = useMemo(() => {
    const all = data?.payments ?? [];
    switch (filter) {
      case "attention":
        return all.filter((p) => p.status === "submitted" || overdue(p));
      case "overdue":
        return all.filter(overdue);
      case "all":
        return all;
      default:
        return all.filter((p) => p.status === filter);
    }
  }, [data, filter]);

  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;

  const all = data.payments;
  const confirmedTotal: Record<string, number> = {};
  for (const p of all) if (p.status === "confirmed") confirmedTotal[p.currency] = (confirmedTotal[p.currency] ?? 0) + p.amount;
  const money = (m: Record<string, number>) => (Object.keys(m).length ? Object.entries(m).map(([c, v]) => formatPrice(v, c)).join(" + ") : "—");
  const awaiting = all.filter((p) => p.status === "submitted").length;
  const late = all.filter(overdue).length;
  const partPaid = new Set(all.filter((p) => p.orderStatus === "partial").map((p) => p.orderId)).size;
  const paidCourses = data.courses.filter((c) => isPaid(c));

  const act = async (okText: string, fn: () => Promise<void>) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      await reload();
      setMsg({ tone: "success", text: okText });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "That didn't work." });
    }
    setBusy(false);
  };

  const openProof = async (path: string) => {
    const url = await (await getBackend()).admin.proofUrl(path);
    if (url) window.open(url, "_blank", "noopener");
    else setMsg({ tone: "error", text: path.startsWith("demo:") ? `Demo mode keeps only the file name: ${path.slice(5)}` : "Couldn't open the receipt." });
  };

  return (
    <>
      <AdminHeading title="Payments" />
      {msg && (
        <div className="mb-5" aria-live="polite">
          <Alert tone={msg.tone}>{msg.text}</Alert>
        </div>
      )}

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Confirmed revenue", money(confirmedTotal)],
          ["Awaiting confirmation", String(awaiting)],
          ["Overdue", String(late)],
          ["Part-paid orders", String(partPaid)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-paper p-5">
            <dt className="text-[0.875rem] text-muted">{label}</dt>
            <dd className="mt-2 font-serif text-[1.7rem] leading-none">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mb-4 mt-8 flex flex-wrap items-center gap-3">
        <select aria-label="Show" className={selectCls} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="attention">Needs attention</option>
          <option value="all">All payments</option>
          <option value="submitted">Awaiting confirmation</option>
          <option value="overdue">Overdue</option>
          <option value="pending">Not paid yet</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
        <p className="text-[0.875rem] text-muted">{rows.length} payments</p>
      </div>

      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>For</th>
              <th>Amount</th>
              <th>Paid with</th>
              <th>Status</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const parts = all.filter((x) => x.orderId === p.orderId).length;
              return (
                <tr key={p.id}>
                  <td>
                    {p.fullName}
                    <span className="block text-[0.75rem] text-muted">{p.email}</span>
                  </td>
                  <td>
                    {p.targetTitle}
                    <span className="block text-[0.75rem] text-muted">{parts > 1 ? `Part ${p.part} of ${parts}` : "Full payment"}</span>
                  </td>
                  <td>
                    {formatPrice(p.amount, p.currency)}
                    {p.dueAt && p.status !== "confirmed" && <span className="block text-[0.75rem] text-muted">Due {formatDate(p.dueAt)}</span>}
                  </td>
                  <td>
                    {p.accountLabel ?? "—"}
                    <span className="block font-mono text-[0.75rem] text-muted">{p.reference}</span>
                    {p.payerName && <span className="block text-[0.75rem] text-muted">From {p.payerName}{p.paidOn ? `, ${formatDate(p.paidOn)}` : ""}</span>}
                    {p.note && <span className="block text-[0.75rem] text-muted">{p.note}</span>}
                    {p.rejectedReason && <span className="block text-[0.75rem] text-danger">Rejected: {p.rejectedReason}</span>}
                  </td>
                  <td>
                    <Chip p={p} />
                    <span className="mt-1 block text-[0.75rem] text-muted">{p.source === "admin" ? "Recorded by admin" : ""}</span>
                  </td>
                  <td className="whitespace-nowrap text-right text-[0.8125rem] font-semibold">
                    {p.proofPath && (
                      <button type="button" className="mr-3 text-brass-dark" onClick={() => void openProof(p.proofPath!)}>
                        Receipt
                      </button>
                    )}
                    {p.status !== "confirmed" && (
                      <button type="button" disabled={busy} className="mr-3 text-success disabled:opacity-50" onClick={() => void act("Payment confirmed.", async () => (await getBackend()).admin.confirmPayment(p.id, ""))}>
                        Confirm
                      </button>
                    )}
                    {p.status === "submitted" && (
                      <button
                        type="button"
                        disabled={busy}
                        className="mr-3 text-danger disabled:opacity-50"
                        onClick={() => {
                          const reason = window.prompt("Why can't you accept this payment? The learner will see this.", "We couldn't find the payment");
                          if (reason !== null) void act("Payment rejected.", async () => (await getBackend()).admin.rejectPayment(p.id, reason));
                        }}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      type="button"
                      className="mr-3 text-ink"
                      onClick={() => {
                        setEditing(p);
                        setEdit({ amount: String(p.amount), status: p.status, method: p.accountLabel ?? "", note: p.note ?? "", paidOn: p.paidOn ?? "" });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      className="text-danger disabled:opacity-50"
                      onClick={() => {
                        if (window.confirm(`Delete this ${formatPrice(p.amount, p.currency)} payment from ${p.fullName}?${p.status === "confirmed" ? " If no confirmed payment is left on the order, the access it opened is closed." : ""}`))
                          void act("Payment deleted.", async () => (await getBackend()).admin.deletePayment(p.id));
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  {filter === "attention" ? "Nothing needs your attention." : "No payments here."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <form
          className="mt-4 space-y-4 rounded-2xl border border-brass/40 bg-paper p-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const amount = Number(edit.amount);
            if (!(amount >= 0)) return setMsg({ tone: "error", text: "Enter a valid amount." });
            void act("Payment updated.", async () => {
              await (await getBackend()).admin.updatePayment(editing.id, { amount, status: edit.status, method: edit.method, note: edit.note, paidOn: edit.paidOn || null });
              setEditing(null);
            });
          }}
        >
          <p className="font-serif text-[1.2rem]">
            Edit payment from {editing.fullName} <span className="font-mono text-[0.8125rem] text-muted">{editing.reference}</span>
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <label className="text-[0.875rem] font-medium">
              Amount
              <input type="number" min={0} className={field} value={edit.amount} onChange={(e) => setEdit({ ...edit, amount: e.target.value })} />
            </label>
            <label className="text-[0.875rem] font-medium">
              Status
              <select className={field} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as PaymentStatus })}>
                {Object.entries(STATUS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[0.875rem] font-medium">
              Method
              <input className={field} value={edit.method} onChange={(e) => setEdit({ ...edit, method: e.target.value })} />
            </label>
            <label className="text-[0.875rem] font-medium">
              Date paid
              <input type="date" className={field} value={edit.paidOn} onChange={(e) => setEdit({ ...edit, paidOn: e.target.value })} />
            </label>
          </div>
          <label className="block text-[0.875rem] font-medium">
            Note
            <input className={field} value={edit.note} onChange={(e) => setEdit({ ...edit, note: e.target.value })} />
          </label>
          <p className="text-[0.8125rem] text-muted">Setting a payment to Confirmed opens the learner's access; taking back the last confirmed payment closes it.</p>
          <div className="flex gap-3">
            <Button type="submit" loading={busy}>
              Save changes
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <section className="mt-12" aria-labelledby="register-title">
        <h2 id="register-title" className="font-serif text-[1.5rem]">
          Register a payment
        </h2>
        <p className="mt-1 max-w-2xl text-[0.9375rem] text-muted">For money received outside the site, such as cash or a transfer. It is confirmed straight away and opens the learner's access. Use it again for a second part.</p>
        <form
          className="mt-4 space-y-4 rounded-2xl border border-line bg-paper p-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const amount = Number(reg.amount);
            if (!reg.userId || !reg.target) return setMsg({ tone: "error", text: "Choose the learner and what they paid for." });
            if (!(amount > 0)) return setMsg({ tone: "error", text: "Enter the amount received." });
            const isTrack = reg.target.startsWith("track:");
            void act("Payment registered.", async () => {
              await (await getBackend()).admin.registerPayment({ userId: reg.userId, kind: isTrack ? "programme" : "course", targetId: reg.target.replace(/^(track|course):/, ""), amount, method: reg.method, reference: reg.reference, note: reg.note, paidOn: reg.paidOn });
              setReg({ userId: "", target: "", amount: "", method: "", reference: "", note: "", paidOn: todayIso() });
            });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-[0.875rem] font-medium">
              Learner
              <select className={field} value={reg.userId} onChange={(e) => setReg({ ...reg, userId: e.target.value })}>
                <option value="">Choose…</option>
                {data.students.map((s) => (
                  <option key={s.userId} value={s.userId}>
                    {s.fullName} ({s.email})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[0.875rem] font-medium">
              Paid for
              <select
                className={field}
                value={reg.target}
                onChange={(e) => {
                  const t = data.programmes.find((x) => `track:${x.id}` === e.target.value);
                  setReg({ ...reg, target: e.target.value, amount: t?.price ? String(t.price) : reg.amount });
                }}
              >
                <option value="">Choose…</option>
                <optgroup label="Professional programmes">
                  {data.programmes.map((t) => (
                    <option key={t.id} value={`track:${t.id}`}>
                      {t.programmeName ?? t.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Paid courses">
                  {paidCourses.map((c) => (
                    <option key={c.id} value={`course:${c.id}`}>
                      {c.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <label className="text-[0.875rem] font-medium">
              Amount received
              <input type="number" min={0} className={field} value={reg.amount} onChange={(e) => setReg({ ...reg, amount: e.target.value })} />
            </label>
            <label className="text-[0.875rem] font-medium">
              Method
              <input className={field} list="methods" value={reg.method} onChange={(e) => setReg({ ...reg, method: e.target.value })} placeholder="Bank transfer, Cash…" />
              <datalist id="methods">
                {data.accounts.map((a) => (
                  <option key={a.id} value={a.label} />
                ))}
                <option value="Cash" />
              </datalist>
            </label>
            <label className="text-[0.875rem] font-medium">
              Reference (optional)
              <input className={field} value={reg.reference} onChange={(e) => setReg({ ...reg, reference: e.target.value })} />
            </label>
            <label className="text-[0.875rem] font-medium">
              Date received
              <input type="date" className={field} value={reg.paidOn} onChange={(e) => setReg({ ...reg, paidOn: e.target.value })} />
            </label>
          </div>
          <label className="block text-[0.875rem] font-medium">
            Note (optional)
            <input className={field} value={reg.note} onChange={(e) => setReg({ ...reg, note: e.target.value })} />
          </label>
          <Button type="submit" loading={busy}>
            Register payment
          </Button>
        </form>
      </section>

      <AccountsAndSettings accounts={data.accounts} settings={data.settings} reload={reload} note={setMsg} />

      <div className="mt-14">
        <AdminCardOrders />
      </div>
    </>
  );
}
