import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, CheckCircle2, Clock, Copy, Upload } from "lucide-react";
import { getBackend, type ManualOrder, type OrderPayment, type PaymentAccount, type PaymentSettings } from "@/lib/backend";
import { useAuth } from "@/lib/auth";
import { formatPrice, type CoursePrice } from "@/lib/commerce";
import { formatDate } from "@/lib/format";
import { Button, ButtonLink } from "@/components/Button";
import { Alert } from "@/components/Form";
import { track } from "@/lib/tracking";

type Props = {
  kind: "course" | "programme";
  id: string;
  /** What the learner is paying for, for the headings. */
  title: string;
  price: CoursePrice;
  /** Set when the programme can be paid in two parts. */
  instalments: { firstPercent: number; secondDueDays: number } | null;
  /** Where to send the learner once the first payment is confirmed. */
  openTo: string;
  openLabel: string;
  /** Render nothing unless an order already exists (used after enrolment, to show a remaining part). */
  onlyExisting?: boolean;
};

const STATUS_LABEL: Record<OrderPayment["status"], string> = {
  pending: "Awaiting your payment",
  submitted: "Sent. Waiting for us to confirm",
  confirmed: "Confirmed",
  rejected: "Not accepted",
};

export const isOverdue = (p: Pick<OrderPayment, "status" | "dueAt">) => p.status !== "confirmed" && !!p.dueAt && new Date(p.dueAt) < new Date();

function PartForm({ payment, accounts, settings, onDone }: { payment: OrderPayment; accounts: PaymentAccount[]; settings: PaymentSettings; onDone: () => Promise<void> }) {
  const auth = useAuth();
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [payer, setPayer] = useState(auth.status === "signed-in" ? auth.user.fullName : "");
  const [paidOn, setPaidOn] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = accounts.find((a) => a.id === accountId);
  const field = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[0.9375rem]";

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await (await getBackend()).submitPayment({ paymentId: payment.id, accountId, payerName: payer, paidOn, note, proof });
      await onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send your payment details.");
    }
    setBusy(false);
  };

  if (!accounts.length) return <Alert tone="info">Payment details aren't set up yet. Please contact us and we'll send them.</Alert>;

  return (
    <form
      className="mt-4 space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <fieldset>
        <legend className="text-[0.875rem] font-medium">How are you paying?</legend>
        <div className="mt-2 space-y-2">
          {accounts.map((a) => (
            <label key={a.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${a.id === accountId ? "border-brass bg-brass-pale/30" : "border-line"}`}>
              <input type="radio" name={`acc-${payment.id}`} checked={a.id === accountId} onChange={() => setAccountId(a.id)} className="mt-1 accent-[var(--color-brass-dark)]" />
              <span className="font-medium">{a.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {account && (
        <div className="rounded-xl border border-line-strong bg-sand/50 p-4 text-[0.9375rem]">
          <p className="font-semibold">Send {formatPrice(payment.amount, payment.currency)} to</p>
          <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
            {account.bankName && (
              <>
                <dt className="text-muted">Bank</dt>
                <dd>{account.bankName}</dd>
              </>
            )}
            {account.accountName && (
              <>
                <dt className="text-muted">Account name</dt>
                <dd>{account.accountName}</dd>
              </>
            )}
            {account.accountNumber && (
              <>
                <dt className="text-muted">Account number</dt>
                <dd className="font-mono">
                  {account.accountNumber}{" "}
                  <button type="button" onClick={() => void navigator.clipboard?.writeText(account.accountNumber ?? "")} className="ml-1 inline-flex items-center gap-1 text-[0.75rem] font-semibold text-brass-dark">
                    <Copy aria-hidden className="h-3 w-3" /> Copy
                  </button>
                </dd>
              </>
            )}
            <dt className="text-muted">Reference</dt>
            <dd className="font-mono">{payment.reference}</dd>
          </dl>
          {account.instructions && <p className="mt-2 text-muted">{account.instructions}</p>}
          <p className="mt-2 text-[0.8125rem] text-muted">Put your reference in the transfer narration so we can find it.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-[0.875rem] font-medium">
          Name on the account you paid from
          <input value={payer} onChange={(e) => setPayer(e.target.value)} className={field} />
        </label>
        <label className="text-[0.875rem] font-medium">
          Date you paid
          <input type="date" value={paidOn} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setPaidOn(e.target.value)} className={field} />
        </label>
      </div>
      <label className="block text-[0.875rem] font-medium">
        Receipt or screenshot {settings.proofRequired ? "" : "(optional)"}
        <span className="mt-1.5 flex items-center gap-3 rounded-lg border border-dashed border-line-strong p-3 text-[0.875rem] font-normal">
          <Upload aria-hidden className="h-4 w-4 text-muted" />
          <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(e) => setProof(e.target.files?.[0] ?? null)} className="min-w-0 flex-1 text-[0.8125rem]" />
        </span>
        <span className="mt-1 block text-[0.75rem] font-normal text-muted">PNG, JPG, WebP or PDF, up to 5 MB.</span>
      </label>
      <label className="block text-[0.875rem] font-medium">
        Note (optional)
        <input value={note} onChange={(e) => setNote(e.target.value)} className={field} />
      </label>
      <Button type="submit" loading={busy} className="w-full">
        I have paid {formatPrice(payment.amount, payment.currency)}
      </Button>
      {error && <Alert tone="error">{error}</Alert>}
    </form>
  );
}

/** Pay into the Academy's account: choose full or two parts, pay, report the payment, then wait for an admin to confirm it. */
export function ManualCheckout({ kind, id, title, price, instalments, openTo, openLabel, onlyExisting }: Props) {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [current, setCurrent] = useState<ManualOrder | null | undefined>(undefined);
  const [plan, setPlan] = useState<"full" | "two_part">("full");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    const b = await getBackend();
    const orders = await b.listMyManualOrders();
    setCurrent(orders.find((o) => (kind === "programme" ? o.order.trackId === id : o.order.courseId === id) && o.order.status !== "cancelled" && o.order.status !== "failed") ?? null);
  };

  useEffect(() => {
    void (async () => {
      const b = await getBackend();
      const [s, a] = await Promise.all([b.getPaymentSettings(), b.listPaymentAccounts()]);
      setSettings(s);
      setAccounts(a);
      await reload();
    })().catch((e) => {
      setError(e instanceof Error ? e.message : "Couldn't load the payment details.");
      setCurrent(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, id]);

  if (current === undefined || !settings) return <p className="text-muted">Loading payment details…</p>;
  if (!current && onlyExisting) return null;

  const first = instalments ? Math.round(((price.amount * instalments.firstPercent) / 100) * 100) / 100 : 0;

  if (!current)
    return (
      <div>
        <p className="font-serif text-[1.4rem]">How would you like to pay?</p>
        <div className="mt-3 space-y-2">
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${plan === "full" ? "border-brass bg-brass-pale/30" : "border-line"}`}>
            <input type="radio" name="plan" checked={plan === "full"} onChange={() => setPlan("full")} className="mt-1 accent-[var(--color-brass-dark)]" />
            <span>
              <span className="block font-semibold">Pay in full · {formatPrice(price.amount, price.currency)}</span>
              <span className="text-[0.875rem] text-muted">One payment. The programme opens once we confirm it.</span>
            </span>
          </label>
          {instalments && (
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${plan === "two_part" ? "border-brass bg-brass-pale/30" : "border-line"}`}>
              <input type="radio" name="plan" checked={plan === "two_part"} onChange={() => setPlan("two_part")} className="mt-1 accent-[var(--color-brass-dark)]" />
              <span>
                <span className="block font-semibold">Pay in two parts</span>
                <span className="text-[0.875rem] text-muted">
                  {formatPrice(first, price.currency)} now, and {formatPrice(price.amount - first, price.currency)} within {instalments.secondDueDays} days of the first payment being confirmed. The
                  programme opens when the first part is confirmed.
                </span>
              </span>
            </label>
          )}
        </div>
        <Button
          className="mt-4 w-full"
          loading={busy}
          onClick={() => {
            setBusy(true);
            setError(null);
            void getBackend()
              .then((b) => b.startManualOrder(kind, id, plan))
              .then((o) => {
                track("begin_checkout", { value: price.amount, currency: price.currency, item: title });
                setCurrent(o);
              })
              .catch((e) => setError(e instanceof Error ? e.message : "Couldn't start your payment."))
              .finally(() => setBusy(false));
          }}
        >
          Continue to payment
        </Button>
        {error && (
          <div className="mt-3">
            <Alert tone="error">{error}</Alert>
          </div>
        )}
      </div>
    );

  const { order, payments } = current;
  const confirmedFirst = payments.some((p) => p.part === 1 && p.status === "confirmed");
  const done = order.status === "paid";

  return (
    <div>
      <p className="kicker">Order {order.id.slice(0, 8).toUpperCase()}</p>
      <h2 className="mt-1 font-serif text-[1.5rem] leading-tight">{done ? "Paid in full" : confirmedFirst ? "Your payment is under way" : "Complete your payment"}</h2>
      <p className="mt-1 text-[0.875rem] text-muted">{title}</p>

      {confirmedFirst && (
        <div className="mt-4">
          <ButtonLink to={openTo} className="w-full">
            {openLabel}
          </ButtonLink>
        </div>
      )}

      <ol className="mt-5 space-y-4">
        {payments.map((p) => {
          const locked = p.part === 2 && !confirmedFirst;
          const late = isOverdue(p);
          return (
            <li key={p.id} className="rounded-2xl border border-line-strong bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  {payments.length > 1 ? `Part ${p.part} of ${payments.length} · ` : ""}
                  {formatPrice(p.amount, p.currency)}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.75rem] font-medium ${
                    p.status === "confirmed" ? "border-success/40 bg-success-bg text-success" : p.status === "rejected" ? "border-danger/40 bg-danger/10 text-danger" : "border-line-strong bg-sand text-muted"
                  }`}
                >
                  {p.status === "confirmed" ? <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> : p.status === "submitted" ? <Clock aria-hidden className="h-3.5 w-3.5" /> : null}
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <p className="mt-1 text-[0.8125rem] text-muted">
                Reference <span className="font-mono">{p.reference}</span>
                {p.dueAt && p.status !== "confirmed" && <> · Due {formatDate(p.dueAt)}</>}
              </p>
              {late && (
                <p className="mt-2 flex items-center gap-1.5 text-[0.875rem] font-semibold text-danger">
                  <AlertTriangle aria-hidden className="h-4 w-4" /> This payment is overdue. Please pay it as soon as you can.
                </p>
              )}
              {p.status === "rejected" && p.rejectedReason && <p className="mt-2 text-[0.875rem] text-danger">We couldn't accept it: {p.rejectedReason}. You can send it again below.</p>}
              {p.status === "submitted" && <p className="mt-2 text-[0.875rem] text-muted">Thank you. We're checking that the money arrived, and will confirm it as soon as we can.</p>}
              {locked && <p className="mt-2 text-[0.875rem] text-muted">You can pay this part once the first payment is confirmed.</p>}
              {!locked && (p.status === "pending" || p.status === "rejected") && settings && <PartForm payment={p} accounts={accounts} settings={settings} onDone={reload} />}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-[0.8125rem] text-muted">
        Need help? Message us and quote your reference.{" "}
        <Link to="/about" className="font-semibold text-brass-dark">
          Contact
        </Link>
      </p>
    </div>
  );
}
