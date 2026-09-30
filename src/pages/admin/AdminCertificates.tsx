import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Download, Mail } from "lucide-react";
import { getBackend, type AdminOrder, type Certificate, type CertificatePrice } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { formatMoney } from "@/lib/currency";
import { gmailUrl } from "@/lib/email";
import { verifyUrl } from "@/lib/certificates";
import { SITE } from "@/lib/site";
import { Button, buttonClass } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

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

function Issued({ version }: { version: number }) {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listCertificates(search), [search, version]);
  const [msg, setMsg] = useState<string | null>(null);
  const revoke = async (c: Certificate) => {
    const reason = window.prompt(`Why is ${c.certificateId} being revoked? Its verification page will show it as revoked.`);
    if (!reason?.trim()) return;
    try {
      await (await getBackend()).admin.revokeCertificate(c.id, reason.trim());
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Couldn't revoke the certificate.");
    }
  };
  if (error) return <Alert tone="error">{error}</Alert>;
  return (
    <section aria-labelledby="issued-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="issued-title" className="font-serif text-[1.5rem]">
          Issued certificates
        </h2>
        <Button
          variant="secondary"
          disabled={!data?.length}
          onClick={() =>
            csv(
              [["Certificate", "Credential", "Recipient", "Course", "Issued", "Status"], ...(data ?? []).map((c) => [c.certificateId, c.credentialId, c.recipientName, c.courseTitle, c.issuedAt.slice(0, 10), c.status])],
              `certificates-${new Date().toISOString().slice(0, 10)}.csv`,
            )
          }
        >
          <Download aria-hidden className="h-4 w-4" /> Download records
        </Button>
      </div>
      <form
        className="mt-4 mb-4 flex max-w-lg items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(q);
        }}
      >
        <div className="flex-1">
          <TextField label="Search by name or certificate ID" type="search" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button type="submit" className="mb-0.5 rounded-lg border border-line-strong px-4 py-2.5 text-[0.9375rem] font-semibold hover:border-ink/40">
          Search
        </button>
      </form>
      {msg && <Alert tone="error">{msg}</Alert>}
      {!data ? (
        <PageLoading />
      ) : data.length === 0 ? (
        <p className="text-muted">{search ? "No certificates match that search." : "No certificates issued yet."}</p>
      ) : (
        <div className="table-scroll rounded-2xl border border-line bg-paper">
          <table>
            <thead>
              <tr>
                <th>Certificate</th>
                <th>Recipient</th>
                <th>Course</th>
                <th>Issued</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id}>
                  <td className="whitespace-nowrap font-mono text-[0.8125rem]">
                    <Link to={`/verify/${c.certificateId}`} className="hover:text-brass-dark">
                      {c.certificateId}
                    </Link>
                  </td>
                  <td>{c.recipientName}</td>
                  <td>{c.courseTitle}</td>
                  <td className="whitespace-nowrap">{formatDate(c.issuedAt)}</td>
                  <td>
                    {c.status === "valid" ? (
                      "Valid"
                    ) : (
                      <span className="text-danger" title={c.revokedReason ?? undefined}>
                        Revoked
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    {c.status === "valid" && (
                      <button type="button" onClick={() => void revoke(c)} className="text-[0.8125rem] font-semibold text-danger">
                        Revoke
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

function Pricing() {
  // Admins see every price, including ones switched off.
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listPrices());
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const save = async (p: CertificatePrice) => {
    setMsg(null);
    try {
      await (await getBackend()).admin.savePrice(p);
      setMsg({ tone: "success", text: `${p.currency} price saved.` });
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
      <div className="table-scroll mt-4 max-w-2xl rounded-2xl border border-line bg-paper">
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
            {data.map((p) => (
              <PriceRow key={p.currency} price={p} onSave={save} />
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="mt-4 flex max-w-2xl flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const c = currency.trim().toUpperCase();
          if (!/^[A-Z]{3}$/.test(c) || !(Number(amount) > 0)) return setMsg({ tone: "error", text: "Enter a three-letter currency code (e.g. GBP) and a price." });
          void save({ currency: c, amount: Number(amount), active: true, position: data.length + 1 }).then(() => {
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
    </section>
  );
}

export default function AdminCertificates() {
  const [version, setVersion] = useState(0);
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => {
    void getBackend().then((b) => setOnline(b.paymentsEnabled));
  }, []);
  return (
    <>
      <AdminHeading title="Certificates & payments" />
      <div className="mb-8 max-w-3xl">
        {online === false && (
          <Alert tone="info">
            Online payment isn't connected yet. Learners who want a certificate create an order and message you to pay by bank transfer. Once you've
            confirmed the transfer, press <strong>Grant certificate</strong> on their order below.{" "}
            <a href={`${SITE.url}/certificates`} className={`${buttonClass("ghost")} px-0 underline`}>
              What learners see
            </a>
          </Alert>
        )}
      </div>
      <div className="space-y-14">
        <Orders onGranted={() => setVersion((v) => v + 1)} />
        <Issued version={version} />
        <Pricing />
      </div>
    </>
  );
}
