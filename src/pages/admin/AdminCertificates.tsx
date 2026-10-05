import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Award, Ban, Copy, Download, Eye, Mail, MoreHorizontal, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { getBackend, type AdminCertificate, type AdminOrder, type CertificateKind, type CertificatePrice } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { formatMoney } from "@/lib/currency";
import { gmailUrl } from "@/lib/email";
import {
  CERTIFICATE_TYPES,
  certificateName,
  certificateTypeMeta,
  issueDay,
  matchesCertificate,
  TRAINING_TYPES,
  trainingTypeLabel,
  verifyUrl,
} from "@/lib/certificates";
import { SITE } from "@/lib/site";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";
import { certificateLink, copyText, DeleteCertificateDialog, RevokeDialog, STATUS_LABEL, StatusChip, useCertificateDownload } from "./certificate-shared";

const STATUS: Record<AdminOrder["status"], string> = {
  pending: "Awaiting payment",
  paid: "Paid online",
  granted: "Granted",
  failed: "Failed",
  cancelled: "Cancelled",
};

function csv(rows: (string | number | null)[][], filename: string) {
  const cell = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const blob = new Blob([rows.map((r) => r.map(cell).join(",")).join("\r\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Resends access: the learner can always download from My Certificates. */
function accessEmail(o: AdminOrder) {
  const body = `Hi ${o.learnerName.split(" ")[0] || "there"},\n\nYour official CloudTech Academy certificate for ${o.courseTitle} is ready.\n\nDownload it any time from your dashboard (My Certificates): ${SITE.url}/dashboard\nAnyone can verify it here: ${verifyUrl(SITE.url, o.certificateId ?? "")}\n\nCloudTech Academy`;
  return gmailUrl({ to: [o.learnerEmail], subject: `Your ${o.courseTitle} certificate`, body }) ?? `mailto:${o.learnerEmail}`;
}

function Orders({ onGranted }: { onGranted: () => void }) {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listOrders());
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const grant = async (o: AdminOrder) => {
    const note = window.prompt(`Grant the certificate for ${o.learnerName} (${o.courseTitle})?\nAdd a note, e.g. the bank transfer reference:`, "Bank transfer");
    if (note === null) return;
    try {
      const cert = await (await getBackend()).admin.grantCertificate(o.id, note);
      setMsg({ tone: "success", text: `Issued ${cert.certificateId}. It's now in the learner's My Certificates.` });
      await reload();
      onGranted();
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't grant the certificate." });
    }
  };
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  return (
    <section aria-labelledby="orders-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="orders-title" className="font-serif text-[1.5rem]">
          Purchases
        </h2>
        <Button
          variant="secondary"
          disabled={!data.length}
          onClick={() =>
            csv(
              [
                ["Created", "Learner", "Email", "Course", "Currency", "Amount", "Status", "Reference", "Note", "Paid", "Certificate"],
                ...data.map((o) => [o.createdAt.slice(0, 10), o.learnerName, o.learnerEmail, o.courseTitle, o.currency, o.amount, STATUS[o.status], o.providerRef, o.note, o.paidAt?.slice(0, 10) ?? "", o.certificateId]),
              ],
              `certificate-purchases-${new Date().toISOString().slice(0, 10)}.csv`,
            )
          }
        >
          <Download aria-hidden className="h-4 w-4" /> Export CSV
        </Button>
      </div>
      <div className="mt-3" aria-live="polite">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      </div>
      {data.length === 0 ? (
        <p className="mt-3 text-muted">No certificate orders yet.</p>
      ) : (
        <div className="table-scroll mt-4 rounded-2xl border border-line bg-paper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Learner</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((o) => (
                <tr key={o.id}>
                  <td className="whitespace-nowrap">
                    {formatDate(o.createdAt)}
                    <span className="block font-mono text-[0.75rem] text-muted">{o.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td>
                    {o.learnerName}
                    <span className="block text-[0.75rem] text-muted">{o.learnerEmail}</span>
                  </td>
                  <td>{o.courseTitle}</td>
                  <td className="whitespace-nowrap">{formatMoney(o.amount, o.currency)}</td>
                  <td className="whitespace-nowrap">
                    {STATUS[o.status]}
                    {o.note && <span className="block text-[0.75rem] text-muted">{o.note}</span>}
                  </td>
                  <td className="whitespace-nowrap">
                    {o.certificateId ? (
                      <span className="flex flex-col gap-1">
                        <Link to={`/verify/${o.certificateId}`} className="font-mono text-[0.8125rem] hover:text-brass-dark">
                          {o.certificateId}
                        </Link>
                        <a href={accessEmail(o)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-brass-dark">
                          <Mail aria-hidden className="h-3.5 w-3.5" /> Email learner
                        </a>
                      </span>
                    ) : (
                      <button type="button" onClick={() => void grant(o)} className="text-[0.8125rem] font-semibold text-brass-dark">
                        Grant certificate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PriceRow({ price, onSave }: { price: CertificatePrice; onSave: (p: CertificatePrice) => Promise<void> }) {
  const [amount, setAmount] = useState(String(price.amount));
  const [active, setActive] = useState(price.active);
  const changed = Number(amount) !== price.amount || active !== price.active;
  return (
    <tr>
      <td className="font-semibold">{price.currency}</td>
      <td>
        <label className="sr-only" htmlFor={`price-${price.currency}`}>
          Amount in {price.currency}
        </label>
        <input
          id={`price-${price.currency}`}
          type="number"
          min={0.01}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-32 rounded-lg border border-line-strong bg-paper px-3 py-1.5"
        />
        <span className="ml-2 text-[0.8125rem] text-muted">{Number(amount) > 0 ? formatMoney(Number(amount), price.currency) : ""}</span>
      </td>
      <td>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-[var(--color-brass-dark)]" /> Offered
        </label>
      </td>
      <td className="text-right">
        <Button variant="secondary" disabled={!changed || !(Number(amount) > 0)} onClick={() => void onSave({ ...price, amount: Number(amount), active })}>
          Save
        </Button>
      </td>
    </tr>
  );
}

function PriceTable({ kind, title, note, prices, onSave }: { kind: CertificateKind; title: string; note: string; prices: CertificatePrice[]; onSave: (p: CertificatePrice) => Promise<void> }) {
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const mine = prices.filter((p) => p.kind === kind);
  return (
    <div>
      <h3 className="font-serif text-[1.2rem]">{title}</h3>
      <p className="mt-1 max-w-2xl text-[0.875rem] text-muted">{note}</p>
      <div className="table-scroll mt-3 max-w-2xl rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Price</th>
              <th>Status</th>
              <th>
                <span className="sr-only">Save</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {mine.map((p) => (
              <PriceRow key={`${kind}-${p.currency}`} price={p} onSave={onSave} />
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="mt-3 flex max-w-2xl flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const c = currency.trim().toUpperCase();
          if (!/^[A-Z]{3}$/.test(c) || !(Number(amount) > 0)) return setErr("Enter a three-letter currency code (e.g. GBP) and a price.");
          setErr(null);
          void onSave({ kind, currency: c, amount: Number(amount), active: true, position: mine.length + 1 }).then(() => {
            setCurrency("");
            setAmount("");
          });
        }}
      >
        <div className="w-32">
          <TextField label="Add currency" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="GBP" maxLength={3} />
        </div>
        <div className="w-40">
          <TextField label="Price" type="number" min={0.01} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <Button type="submit" variant="secondary">
          Add
        </Button>
      </form>
      {err && <p className="mt-2 text-[0.8125rem] text-danger">{err}</p>}
    </div>
  );
}

function Pricing() {
  // Admins see every price, including ones switched off.
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listPrices());
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const save = async (p: CertificatePrice) => {
    setMsg(null);
    try {
      await (await getBackend()).admin.savePrice(p);
      setMsg({ tone: "success", text: `${p.kind === "programme" ? "Programme" : "Course"} ${p.currency} price saved.` });
      await reload();
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save the price." });
    }
  };
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  return (
    <section aria-labelledby="pricing-title">
      <h2 id="pricing-title" className="font-serif text-[1.5rem]">
        Certificate pricing
      </h2>
      <p className="mt-1 max-w-2xl text-[0.9375rem] text-muted">
        Learners in Nigeria see the naira price and everyone else sees US dollars; they can switch. Learning and badges stay free.
      </p>
      <div className="mt-3" aria-live="polite">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      </div>
      <div className="mt-4 space-y-10">
        <PriceTable kind="programme" title="Professional Programme certificates" note="One certificate for a whole programme: every required course and the capstone. Priced higher than a single course." prices={data} onSave={save} />
        <PriceTable kind="course" title="Course certificates" note="The optional certificate for a single completed course." prices={data} onSave={save} />
      </div>
    </section>
  );
}

/** Certificates → Course purchases: orders for paid course certificates, and pricing. */
export function AdminCertificatePayments() {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => {
    void getBackend().then((b) => setOnline(b.paymentsEnabled));
  }, []);
  return (
    <>
      <AdminHeading title="Certificates" />
      <CertificateTabs />
      <div className="mb-8 max-w-3xl">
        {online === false && (
          <Alert tone="info">
            Online payment isn't connected yet. Learners who want a course certificate create an order and message you to pay by bank transfer. Once you've
            confirmed the transfer, press <strong>Grant certificate</strong> on their order below.{" "}
            <a href={`${SITE.url}/certificates`} className={`${buttonClass("ghost")} px-0 underline`}>
              What learners see
            </a>
          </Alert>
        )}
      </div>
      <div className="space-y-14">
        <Orders onGranted={() => undefined} />
        <Pricing />
      </div>
    </>
  );
}

export function CertificateTabs() {
  const tab = (isActive: boolean) =>
    `-mb-px border-b-2 px-1 pb-2.5 text-[0.9375rem] ${isActive ? "border-brass-dark font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`;
  return (
    <nav aria-label="Certificate sections" className="-mt-4 mb-8 flex gap-6 border-b border-line">
      <NavLink to="/admin/certificates" end className={({ isActive }) => tab(isActive)}>
        All certificates
      </NavLink>
      <NavLink to="/admin/certificates/payments" className={({ isActive }) => tab(isActive)}>
        Course purchases & pricing
      </NavLink>
    </nav>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[0.8125rem] text-muted">{label}</p>
      <p className="mt-2 font-serif text-[2.1rem] leading-none">{value}</p>
    </div>
  );
}

const selectCls =
  "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[0.9375rem] text-ink focus:border-ink/60 focus:outline-2 focus:outline-offset-2 focus:outline-brass-dark";

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[0.875rem] font-medium">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Row actions in a small menu. <details> keeps it keyboard-accessible without extra code. */
function Actions({ c, onDownload, onCopy, onRevoke, onDelete }: { c: AdminCertificate; onDownload: () => void; onCopy: () => void; onRevoke: () => void; onDelete: () => void }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");
  const item = "flex w-full items-center gap-2 px-3.5 py-2 text-left text-[0.875rem] hover:bg-sand";
  return (
    <details ref={ref} className="relative inline-block text-left">
      <summary
        title="Actions"
        className="inline-flex cursor-pointer list-none items-center rounded-lg border border-line-strong p-2 hover:border-ink/40 [&::-webkit-details-marker]:hidden"
      >
        <MoreHorizontal aria-hidden className="h-4 w-4" />
        <span className="sr-only">Actions for {c.certificateId}</span>
      </summary>
      <div className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-line bg-paper py-1 shadow-[0_16px_40px_-20px_rgba(23,23,23,0.45)]">
        <Link to={`/admin/certificates/${c.certificateId}`} className={item}>
          <Eye aria-hidden className="h-4 w-4" /> View
        </Link>
        <button type="button" className={item} onClick={() => (close(), onDownload())}>
          <Download aria-hidden className="h-4 w-4" /> Download PDF
        </button>
        <button type="button" className={item} onClick={() => (close(), onCopy())}>
          <Copy aria-hidden className="h-4 w-4" /> Copy verification link
        </button>
        {c.status !== "replaced" && (
          <Link to={`/admin/certificates/${c.certificateId}/edit`} className={item}>
            <Pencil aria-hidden className="h-4 w-4" /> Edit
          </Link>
        )}
        {c.status !== "replaced" && (
          <Link to={`/admin/certificates/${c.certificateId}/reissue`} className={item}>
            <RefreshCw aria-hidden className="h-4 w-4" /> Reissue
          </Link>
        )}
        {c.status === "valid" && (
          <button type="button" className={`${item} text-danger`} onClick={() => (close(), onRevoke())}>
            <Ban aria-hidden className="h-4 w-4" /> Revoke
          </button>
        )}
        <button type="button" className={`${item} border-t border-line text-danger`} onClick={() => (close(), onDelete())}>
          <Trash2 aria-hidden className="h-4 w-4" /> Delete
        </button>
      </div>
    </details>
  );
}

const thisMonth = (iso: string) => {
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
};

/** Admin Dashboard → Certificates. */
export default function AdminCertificates() {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listCertificates());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [training, setTraining] = useState("");
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const deletedId = (useLocation().state as { deleted?: string } | null)?.deleted;
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(
    deletedId ? { tone: "success", text: `${deletedId} deleted. Its verification page now says "Certificate Not Found".` } : null,
  );
  const [revoking, setRevoking] = useState<AdminCertificate | null>(null);
  const [deleting, setDeleting] = useState<AdminCertificate | null>(null);
  const onError = useCallback((text: string) => setMsg({ tone: "error", text }), []);
  const { download, hidden } = useCertificateDownload(onError);

  const rows = useMemo(
    () =>
      (data ?? []).filter(
        (c) =>
          matchesCertificate(c, q) &&
          (!status || c.status === status) &&
          (!training || c.trainingType === training) &&
          (!type || c.certificateType === type) &&
          (!from || issueDay(c.issuedAt) >= from) &&
          (!to || issueDay(c.issuedAt) <= to),
      ),
    [data, q, status, training, type, from, to],
  );

  if (error) return <Alert tone="error">{error}</Alert>;
  const all = data ?? [];
  const filtered = q || status || training || type || from || to;

  return (
    <>
      <AdminHeading title="Certificates">
        <ButtonLink to="/admin/certificates/new">
          <Plus aria-hidden className="h-4 w-4" /> Issue certificate
        </ButtonLink>
      </AdminHeading>
      <CertificateTabs />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total certificates" value={all.length} />
        <Stat label="Active" value={all.filter((c) => c.status === "valid").length} />
        <Stat label="Revoked" value={all.filter((c) => c.status === "revoked").length} />
        <Stat label="Issued this month" value={all.filter((c) => thisMonth(c.issuedAt)).length} />
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3">
          <TextField label="Search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, certificate title or ID" />
        </div>
        <Filter label="Status" value={status} onChange={setStatus} options={(["valid", "revoked", "replaced"] as const).map((v) => ({ value: v, label: STATUS_LABEL[v] }))} />
        <Filter label="Training type" value={training} onChange={setTraining} options={TRAINING_TYPES} />
        <Filter label="Certificate type" value={type} onChange={setType} options={CERTIFICATE_TYPES} />
        <TextField label="Issued from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <TextField label="Issued to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <div className="flex items-end gap-3">
          <Button
            variant="secondary"
            disabled={!filtered}
            onClick={() => {
              setQ("");
              setStatus("");
              setTraining("");
              setType("");
              setFrom("");
              setTo("");
            }}
          >
            Clear filters
          </Button>
          <Button
            variant="ghost"
            disabled={!rows.length}
            onClick={() =>
              csv(
                [
                  ["Certificate ID", "Recipient", "Email", "Certificate", "Programme", "Training type", "Certificate type", "Issued", "Status", "Issued by", "Replaced by"],
                  ...rows.map((c) => [
                    c.certificateId,
                    c.recipientName,
                    c.recipientEmail,
                    certificateName(c),
                    c.courseTitle,
                    trainingTypeLabel(c.trainingType),
                    certificateTypeMeta(c.certificateType).label,
                    issueDay(c.issuedAt),
                    STATUS_LABEL[c.status],
                    c.issuedBy,
                    c.replacedBy,
                  ]),
                ],
                `certificates-${new Date().toISOString().slice(0, 10)}.csv`,
              )
            }
          >
            <Download aria-hidden className="h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      <div className="mt-4" aria-live="polite">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      </div>

      {!data ? (
        <PageLoading />
      ) : all.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong p-10 text-center">
          <Award aria-hidden className="mx-auto h-9 w-9 text-brass-dark" />
          <p className="mt-3 font-serif text-[1.4rem]">No certificates yet</p>
          <p className="mx-auto mt-1 max-w-md text-muted">Issue one for anyone CloudTech has trained, with or without an Academy account. It takes under a minute.</p>
          <ButtonLink to="/admin/certificates/new" className="mt-5">
            <Plus aria-hidden className="h-4 w-4" /> Issue certificate
          </ButtonLink>
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-muted">No certificates match these filters.</p>
      ) : (
        <div className="table-scroll mt-4 rounded-2xl border border-line bg-paper">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Certificate</th>
                <th>Certificate ID</th>
                <th>Training type</th>
                <th>Issued</th>
                <th>Status</th>
                <th>Issued by</th>
                <th className="sticky right-0 bg-sand">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/admin/certificates/${c.certificateId}`} className="font-semibold hover:text-brass-dark">
                      {c.recipientName}
                    </Link>
                    {c.recipientEmail && <span className="block text-[0.75rem] text-muted">{c.recipientEmail}</span>}
                  </td>
                  <td className="min-w-[11rem]">
                    {certificateName(c)}
                    <span className="block text-[0.75rem] text-muted">{certificateTypeMeta(c.certificateType).label}</span>
                  </td>
                  <td className="whitespace-nowrap font-mono text-[0.8125rem]">{c.certificateId}</td>
                  <td className="text-[0.875rem]">{trainingTypeLabel(c.trainingType).replace(" Training", "")}</td>
                  <td className="whitespace-nowrap text-[0.875rem]">{formatDate(c.issuedAt).replace(/ (\w{3})\w* /, " $1 ")}</td>
                  <td>
                    <StatusChip status={c.status} />
                  </td>
                  <td className="text-[0.875rem]">{c.issuedBy ?? (c.source === "course" ? "Course purchase" : "")}</td>
                  <td className="sticky right-0 bg-paper text-right shadow-[-12px_0_12px_-12px_rgba(23,23,23,0.18)]">
                    <Actions
                      c={c}
                      onDownload={() => void download(c)}
                      onCopy={() =>
                        void copyText(certificateLink(c.certificateId)).then((ok) =>
                          setMsg(ok ? { tone: "success", text: `Verification link for ${c.certificateId} copied.` } : { tone: "error", text: certificateLink(c.certificateId) }),
                        )
                      }
                      onRevoke={() => setRevoking(c)}
                      onDelete={() => setDeleting(c)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <RevokeDialog
        cert={revoking}
        onClose={() => setRevoking(null)}
        onRevoked={() => {
          setMsg({ tone: "success", text: `${revoking?.certificateId} revoked. Its verification page now shows it as revoked.` });
          void reload();
        }}
      />
      <DeleteCertificateDialog
        cert={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={(id) => {
          setMsg({ tone: "success", text: `${id} deleted. Its verification page now says "Certificate Not Found".` });
          void reload();
        }}
      />
      {hidden}
    </>
  );
}
