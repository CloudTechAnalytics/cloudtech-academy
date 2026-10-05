import { useCallback, useEffect, useRef, useState } from "react";
import { getBackend, type Certificate, type OfficialCertificateStatus } from "@/lib/backend";
import { certificateName, verifyUrl } from "@/lib/certificates";
import { SITE } from "@/lib/site";
import { CertificateDocument, renderOf } from "@/components/CertificateDocument";
import { downloadCertificatePdf } from "@/components/CertificateArtwork";
import { Modal } from "@/components/Modal";
import { Alert, TextArea } from "@/components/Form";
import { Button } from "@/components/Button";

export const STATUS_LABEL: Record<OfficialCertificateStatus, string> = { valid: "Active", revoked: "Revoked", replaced: "Replaced" };

export function StatusChip({ status }: { status: OfficialCertificateStatus }) {
  const tone = {
    valid: "border-success/40 bg-success-bg text-success",
    revoked: "border-danger/40 bg-danger/10 text-danger",
    replaced: "border-line-strong bg-sand text-muted",
  }[status];
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.75rem] font-semibold ${tone}`}>{STATUS_LABEL[status]}</span>;
}

export const certificateLink = (certificateId: string) => verifyUrl(SITE.url, certificateId);

/** Copies text; returns false if the browser refused. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Downloads any certificate as a PDF: it is drawn off-screen in its template, converted, and the
 * download is recorded in the audit log. Render `hidden` somewhere on the page.
 */
export function useCertificateDownload(onError: (message: string) => void) {
  const [cert, setCert] = useState<Certificate | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const done = useRef<((ok: boolean) => void) | null>(null);

  useEffect(() => {
    if (!cert || !svg.current) return;
    const el = svg.current;
    void downloadCertificatePdf(el, `${cert.certificateId}.pdf`, `${certificateName(cert)} certificate`)
      .then(() => {
        void getBackend().then((b) => b.recordCertificateDownload(cert.certificateId)).catch(() => undefined);
        done.current?.(true);
      })
      .catch((e: unknown) => {
        onError(e instanceof Error ? e.message : "Couldn't create the PDF.");
        done.current?.(false);
      })
      .finally(() => setCert(null));
  }, [cert, onError]);

  const download = useCallback(
    (c: Certificate) =>
      new Promise<boolean>((resolve) => {
        done.current = resolve;
        setCert(c);
      }),
    [],
  );

  const hidden = cert ? (
    <div aria-hidden className="pointer-events-none fixed top-0 -left-[10000px] w-[1600px]">
      <CertificateDocument ref={svg} templateId={cert.templateId} data={renderOf(cert)} />
    </div>
  ) : null;

  return { download, hidden, busy: cert !== null };
}

/** "Are you sure you want to revoke this certificate?", with an optional reason. */
export function RevokeDialog({ cert, onClose, onRevoked }: { cert: Certificate | null; onClose: () => void; onRevoked: () => void }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setReason("");
    setError(null);
  }, [cert]);
  const revoke = async () => {
    if (!cert) return;
    setBusy(true);
    setError(null);
    try {
      await (await getBackend()).admin.revokeCertificate(cert.certificateId, reason.trim());
      onRevoked();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't revoke the certificate.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={!!cert} title="Revoke this certificate?" onClose={onClose}>
      {cert && (
        <>
          <p className="leading-relaxed">
            Are you sure you want to revoke this certificate? <strong>{cert.recipientName}</strong>'s <strong>{certificateName(cert)}</strong> (
            <span className="font-mono text-[0.875rem]">{cert.certificateId}</span>) will show as revoked on its public verification page.
          </p>
          <p className="mt-2 text-[0.875rem] text-muted">The record stays in your certificates list. This can't be undone; to correct a certificate instead, reissue it.</p>
          <div className="mt-4">
            <TextArea label="Reason for revocation (optional, not shown publicly)" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} />
          </div>
          {error && (
            <div className="mt-3">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" disabled={busy} onClick={() => void revoke()}>
              {busy ? "Revoking…" : "Revoke certificate"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
