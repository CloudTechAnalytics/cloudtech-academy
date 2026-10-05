import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router";
import { Ban, Copy, Download, ExternalLink, Pencil, RefreshCw } from "lucide-react";
import { getBackend, type AdminCertificate, type CertificateEvent, type StudentSummary } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { certificateName, certificateTypeMeta, trainingPeriod, trainingTypeLabel } from "@/lib/certificates";
import { CertificateDocument, renderOf } from "@/components/CertificateDocument";
import { Alert } from "@/components/Form";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { AdminHeading } from "./AdminLayout";
import { certificateLink, copyText, RevokeDialog, StatusChip, useCertificateDownload } from "./certificate-shared";

const ACTION_LABEL: Record<CertificateEvent["action"], string> = {
  created: "Created",
  edited: "Edited",
  issued: "Issued",
  downloaded: "Downloaded",
  revoked: "Revoked",
  reissued: "Reissued",
};

const FIELD_LABEL: Record<string, string> = { recipient_email: "email", linked_account: "linked account", course: "course", template: "template" };

/** One line describing what an event changed. */
function eventDetail(e: CertificateEvent): ReactNode {
  const d = e.details as Record<string, unknown>;
  if (e.action === "reissued") return <>Replaced by <Link to={`/admin/certificates/${d.replaced_by}`} className="font-mono text-brass-dark">{String(d.replaced_by)}</Link>{d.reason ? `: ${d.reason}` : ""}</>;
  if (e.action === "issued" && d.replaces) return <>Replaces <Link to={`/admin/certificates/${d.replaces}`} className="font-mono text-brass-dark">{String(d.replaces)}</Link>{d.reason ? `: ${d.reason}` : ""}</>;
  if (e.action === "issued" && d.order) return <>From a course certificate order ({String(d.payment)})</>;
  if (e.action === "revoked") return d.reason ? `Reason: ${d.reason}` : "No reason given";
  if (e.action === "edited") return `Changed ${Object.keys(d).map((k) => FIELD_LABEL[k] ?? k).join(", ")}`;
  if (e.action === "downloaded") return d.by === "recipient" ? "By the recipient" : "PDF downloaded";
  return null;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[0.8125rem] text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium">{children}</dd>
    </div>
  );
}

/** Certificates → one certificate: the artwork, every detail, actions and the audit history. */
export default function AdminCertificateDetail() {
  const { certificateId = "" } = useParams();
  const location = useLocation();
  const [cert, setCert] = useState<AdminCertificate | null | undefined>(undefined);
  const [events, setEvents] = useState<CertificateEvent[]>([]);
  const [account, setAccount] = useState<StudentSummary | null>(null);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>((location.state as { saved?: boolean } | null)?.saved ? { tone: "success", text: "Changes saved." } : null);
  const [revoking, setRevoking] = useState(false);
  const onError = useCallback((text: string) => setMsg({ tone: "error", text }), []);
  const downloader = useCertificateDownload(onError);

  const load = useCallback(async () => {
    const b = await getBackend();
    const [c, ev] = await Promise.all([b.admin.getCertificate(certificateId), b.admin.listCertificateEvents(certificateId)]);
    setCert(c);
    setEvents(ev);
    if (c?.userId) setAccount((await b.admin.listStudents().catch(() => [])).find((s) => s.userId === c.userId) ?? null);
  }, [certificateId]);

  useEffect(() => {
    setCert(undefined);
    void load().catch((e: unknown) => {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't load the certificate." });
      setCert(null);
    });
  }, [load]);

  if (cert === undefined) return <PageLoading />;
  if (!cert)
    return (
      <>
        <AdminHeading title="Certificate not found" />
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        <Link to="/admin/certificates" className="mt-4 inline-block font-semibold text-brass-dark">
          ← All certificates
        </Link>
      </>
    );

  const url = certificateLink(cert.certificateId);
  const period = trainingPeriod(cert.startDate, cert.completionDate);

  return (
    <div>
      <Link to="/admin/certificates" className="text-[0.875rem] text-muted hover:text-ink">
        ← All certificates
      </Link>
      <AdminHeading title={cert.recipientName}>
        <StatusChip status={cert.status} />
      </AdminHeading>
      <p className="-mt-5 mb-6 text-[1.0625rem]">
        {certificateName(cert)} · <span className="font-mono text-[0.9375rem]">{cert.certificateId}</span>
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" className={buttonClass("primary")} disabled={downloader.busy} onClick={() => void downloader.download(cert).then((ok) => ok && void load())}>
          <Download aria-hidden className="h-4 w-4" /> {downloader.busy ? "Preparing…" : "Download PDF"}
        </button>
        <button
          type="button"
          className={buttonClass("secondary")}
          onClick={() => void copyText(url).then((ok) => setMsg(ok ? { tone: "success", text: "Verification link copied." } : { tone: "error", text: `Copy this link: ${url}` }))}
        >
          <Copy aria-hidden className="h-4 w-4" /> Copy verification link
        </button>
        <Link to={`/verify/${cert.certificateId}`} target="_blank" className={buttonClass("ghost")}>
          Verification page <ExternalLink aria-hidden className="h-4 w-4" />
        </Link>
        {cert.status !== "replaced" && (
          <>
            <ButtonLink to={`/admin/certificates/${cert.certificateId}/edit`} variant="secondary">
              <Pencil aria-hidden className="h-4 w-4" /> Edit
            </ButtonLink>
            <ButtonLink to={`/admin/certificates/${cert.certificateId}/reissue`} variant="secondary">
              <RefreshCw aria-hidden className="h-4 w-4" /> Reissue
            </ButtonLink>
          </>
        )}
        {cert.status === "valid" && (
          <Button variant="danger" onClick={() => setRevoking(true)}>
            <Ban aria-hidden className="h-4 w-4" /> Revoke
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        {cert.status === "replaced" && cert.replacedBy && (
          <Alert tone="info">
            Replaced by{" "}
            <Link to={`/admin/certificates/${cert.replacedBy}`} className="font-mono font-semibold underline">
              {cert.replacedBy}
            </Link>
            . This record is kept for history; its verification page points to the replacement.
          </Alert>
        )}
        {cert.status === "revoked" && (
          <Alert tone="error">
            Revoked {formatDate(cert.revokedAt)}
            {cert.revokedReason ? `: ${cert.revokedReason}` : "."} Its verification page shows it as revoked.
          </Alert>
        )}
        {cert.replacedCertificateId && (
          <Alert tone="info">
            This certificate replaced{" "}
            <Link to={`/admin/certificates/${cert.replacedCertificateId}`} className="font-mono font-semibold underline">
              {cert.replacedCertificateId}
            </Link>
            .
          </Alert>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line-strong shadow-[0_20px_50px_-30px_rgba(23,23,23,0.45)]">
        <CertificateDocument templateId={cert.templateId} data={renderOf(cert)} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="details-title" className="rounded-2xl border border-line bg-paper p-6">
          <h2 id="details-title" className="font-serif text-[1.35rem]">
            Details
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Row label="Recipient">{cert.recipientName}</Row>
            <Row label="Email (private)">{cert.recipientEmail ?? "None"}</Row>
            <Row label="Academy account">{cert.userId ? (account ? `${account.fullName} (${account.email})` : "Linked") : "None"}</Row>
            <Row label="Source">{cert.source === "course" ? "Course certificate (purchase or grant)" : "Issued by an admin"}</Row>
            <Row label="Certificate title">{cert.certificateTitle ?? "None"}</Row>
            <Row label={cert.source === "course" ? "Course" : "Programme"}>{cert.courseTitle}</Row>
            <Row label="Training type">{trainingTypeLabel(cert.trainingType)}</Row>
            <Row label="Certificate type">{certificateTypeMeta(cert.certificateType).label}</Row>
            <Row label="Training period">{period || "Not set"}</Row>
            <Row label="Issue date">{formatDate(cert.issuedAt)}</Row>
            <Row label="Instructor">{cert.instructorName ?? "None"}</Row>
            <Row label="Duration">{cert.duration ?? "None"}</Row>
            <Row label="Grade">{cert.grade ?? "None"}</Row>
            <Row label="Template">{cert.templateId === "classic" ? "CloudTech Classic" : "CloudTech Signature"}</Row>
            <Row label="Issued by">{cert.issuedBy ?? "System"}</Row>
            {cert.credentialId && (
              <Row label="Completion credential">
                <Link to={`/credentials/${cert.credentialId}`} className="font-mono text-brass-dark">
                  {cert.credentialId}
                </Link>
              </Row>
            )}
            {cert.description && (
              <div className="sm:col-span-2">
                <Row label="Description / skills">{cert.description}</Row>
              </div>
            )}
            <div className="sm:col-span-2">
              <Row label="Verification URL">
                <span className="break-all font-mono text-[0.875rem]">{url}</span>
              </Row>
            </div>
          </dl>
        </section>

        <section aria-labelledby="log-title" className="rounded-2xl border border-line bg-paper p-6">
          <h2 id="log-title" className="font-serif text-[1.35rem]">
            Activity
          </h2>
          <p className="mt-1 text-[0.8125rem] text-muted">Visible to admins only.</p>
          {events.length === 0 ? (
            <p className="mt-4 text-[0.875rem] text-muted">No activity recorded.</p>
          ) : (
            <ol className="mt-4 space-y-4 border-l border-line pl-4">
              {events.map((e) => (
                <li key={e.id} className="relative">
                  <span aria-hidden className="absolute top-1.5 -left-[1.36rem] h-2.5 w-2.5 rounded-full border-2 border-paper bg-brass-dark" />
                  <p className="text-[0.9375rem] font-semibold">
                    {ACTION_LABEL[e.action]} <span className="font-normal text-muted">by {e.actorName || "Unknown"}</span>
                  </p>
                  <p className="text-[0.8125rem] text-muted">{new Date(e.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
                  {eventDetail(e) && <p className="mt-0.5 text-[0.8125rem]">{eventDetail(e)}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <RevokeDialog
        cert={revoking ? cert : null}
        onClose={() => setRevoking(false)}
        onRevoked={() => {
          setMsg({ tone: "success", text: "Certificate revoked. Its verification page now shows it as revoked." });
          void load();
        }}
      />
      {downloader.hidden}
    </div>
  );
}
