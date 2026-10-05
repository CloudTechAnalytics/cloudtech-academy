import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router";
import { BadgeCheck, Download, Eye, RefreshCw, ShieldAlert, ShieldX } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading } from "@/lib/auth";
import { getBackend, IS_LIVE, type PublicCertificate } from "@/lib/backend";
import { formatDate } from "@/lib/format";
import { certificateTypeMeta, isCertificateId, trainingPeriod, trainingTypeLabel } from "@/lib/certificates";
import { CertificateDocument, renderOf } from "@/components/CertificateDocument";
import { downloadCertificatePdf } from "@/components/CertificateArtwork";
import { Alert } from "@/components/Form";
import { buttonClass } from "@/components/Button";
import { VerifyForm } from "./Certificates";

/** Badge and completion credential IDs, e.g. CTA-PROMPT-8F72K. They have their own public page. */
const isBadgeId = (id: string) => /^CTA-[A-Z0-9]{2,8}-[2-9A-HJ-NP-Z]{5}$/i.test(id.trim()) && !isCertificateId(id);

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-[0.8125rem] text-muted">{label}</dt>
      <dd className="mt-0.5 text-[1.0625rem] font-semibold">{children}</dd>
    </div>
  );
}

function Footer() {
  return (
    <>
      <div className="mt-10">
        <VerifyForm title="Verify another certificate" />
      </div>
      <p className="mt-8 text-[0.875rem] text-muted">
        Questions about a certificate? <Link to="/about#contact" className="font-semibold text-brass-dark">Contact us</Link>.
      </p>
    </>
  );
}

/** /verify: anyone can check a certificate number. No sign-in needed. */
export function VerifySearch() {
  useSeo({
    title: "Verify a Certificate | CloudTech Academy",
    description: "Check that a CloudTech Academy certificate is genuine. Enter the certificate ID printed on it.",
  });
  return (
    <div className="container-page max-w-2xl py-14 sm:py-20">
      <p className="kicker">Certificate verification</p>
      <h1 className="mt-3 font-serif text-[2.2rem] leading-tight sm:text-[2.6rem]">Verify a CloudTech Academy Certificate</h1>
      <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
        Every CloudTech Academy certificate has a unique ID and a QR code. Enter the ID to confirm who it was issued to, for what, and whether it is still valid.
      </p>
      <div className="mt-8">
        <VerifyForm title="Enter the certificate ID" />
      </div>
      <p className="mt-6 text-[0.875rem] leading-relaxed text-muted">
        Verification shows only what is printed on the certificate. It never shows email addresses or account details.
      </p>
    </div>
  );
}

/** /verify/:id: the result for one certificate. */
export default function Verify() {
  const { credentialId: raw = "" } = useParams();
  const id = raw.trim().toUpperCase();
  const [cert, setCert] = useState<PublicCertificate | null | undefined>(undefined);
  const [showing, setShowing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const art = useRef<HTMLDivElement>(null);
  useSeo({ title: `Verify ${id} | CloudTech Academy`, description: "Check that a CloudTech Academy certificate is genuine.", noindex: true });

  useEffect(() => {
    if (isBadgeId(id)) return;
    setCert(undefined);
    setShowing(false);
    void getBackend()
      .then((b) => b.verifyCertificate(id))
      .then(setCert)
      .catch(() => setCert(null));
  }, [id]);

  // Badge and completion credentials have their own public page.
  if (isBadgeId(id)) return <Navigate to={`/credentials/${encodeURIComponent(id)}`} replace />;
  if (cert === undefined) return <PageLoading label="Checking the certificate…" />;

  if (!cert)
    return (
      <div className="container-page max-w-2xl py-14 sm:py-20">
        <p className="kicker">Certificate verification</p>
        <div className="mt-5 rounded-2xl border border-line-strong bg-paper p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldAlert aria-hidden className="h-8 w-8 shrink-0 text-muted" />
            <h1 className="font-serif text-[1.9rem] leading-tight">Certificate Not Found</h1>
          </div>
          <p className="mt-4 leading-relaxed">We could not find a certificate matching this ID. Please check the certificate number and try again.</p>
          <p className="mt-2 text-[0.9rem] text-muted">
            You entered <span className="font-mono">{id}</span>. Certificate IDs look like CTA-2026-000184.
          </p>
          {!IS_LIVE && <p className="mt-3 text-[0.875rem] text-muted">The Academy is in demo mode, so only certificates issued in this browser can be checked.</p>}
        </div>
        <Footer />
      </div>
    );

  const title = cert.certificateTitle?.trim() || cert.courseTitle;
  const showProgramme = cert.courseTitle.trim().toLowerCase() !== title.toLowerCase();
  const period = trainingPeriod(cert.startDate, cert.completionDate);

  const download = async () => {
    setError(null);
    try {
      if (svg.current) await downloadCertificatePdf(svg.current, `${cert.certificateId}.pdf`, `${title} certificate`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't create the PDF.");
    }
  };

  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <p className="kicker">Certificate verification</p>
      {cert.status === "valid" && (
        <div className="mt-5 rounded-2xl border border-success/40 bg-success-bg p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <BadgeCheck aria-hidden className="h-8 w-8 shrink-0 text-success" />
            <h1 className="font-serif text-[1.9rem] leading-tight">Certificate Verified ✓</h1>
          </div>
          <p className="mt-3">This is a genuine certificate issued by CloudTech Academy.</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Recipient">{cert.recipientName}</Field>
            <Field label="Certificate">{title}</Field>
            {showProgramme && <Field label={cert.credentialId ? "Course" : "Programme"}>{cert.courseTitle}</Field>}
            <Field label="Certificate type">{certificateTypeMeta(cert.certificateType).label}</Field>
            <Field label="Training type">{trainingTypeLabel(cert.trainingType)}</Field>
            {cert.instructorName && <Field label="Instructor">{cert.instructorName}</Field>}
            {period && <Field label={cert.startDate ? "Training period" : "Completed"}>{period}</Field>}
            <Field label="Issued by">CloudTech Academy</Field>
            <Field label="Issue date">{formatDate(cert.issuedAt)}</Field>
            <Field label="Certificate ID">
              <span className="font-mono text-[0.9375rem]">{cert.certificateId}</span>
            </Field>
            <Field label="Status">
              <span className="text-success">Active</span>
            </Field>
            {cert.credentialId && (
              <Field label="Completion credential">
                <Link to={`/credentials/${cert.credentialId}`} className="font-mono text-[0.9375rem] hover:text-brass-dark">
                  {cert.credentialId}
                </Link>
              </Field>
            )}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              className={buttonClass("primary")}
              aria-expanded={showing}
              onClick={() => {
                setShowing(true);
                requestAnimationFrame(() => art.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
              }}
            >
              <Eye aria-hidden className="h-4 w-4" /> View Certificate
            </button>
            <button type="button" className={buttonClass("secondary")} onClick={() => void download()}>
              <Download aria-hidden className="h-4 w-4" /> Download Certificate
            </button>
          </div>
          <div aria-live="polite" className="mt-3">
            {error && <Alert tone="error">{error}</Alert>}
          </div>
        </div>
      )}

      {cert.status === "revoked" && (
        <div className="mt-5 rounded-2xl border border-danger/40 bg-danger/10 p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldX aria-hidden className="h-8 w-8 shrink-0 text-danger" />
            <h1 className="font-serif text-[1.9rem] leading-tight">Certificate Revoked</h1>
          </div>
          <p className="mt-3 leading-relaxed">This certificate was previously issued by CloudTech Academy but is no longer valid.</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Recipient">{cert.recipientName}</Field>
            <Field label="Certificate">{title}</Field>
            <Field label="Certificate ID">
              <span className="font-mono text-[0.9375rem]">{cert.certificateId}</span>
            </Field>
            <Field label="Original issue date">{formatDate(cert.issuedAt)}</Field>
            <Field label="Status">
              <span className="text-danger">Revoked</span>
            </Field>
          </dl>
        </div>
      )}

      {cert.status === "replaced" && (
        <div className="mt-5 rounded-2xl border border-brass/40 bg-brass-pale/40 p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <RefreshCw aria-hidden className="h-8 w-8 shrink-0 text-brass-dark" />
            <h1 className="font-serif text-[1.9rem] leading-tight">Certificate Replaced</h1>
          </div>
          <p className="mt-3 leading-relaxed">
            CloudTech Academy issued this certificate, then corrected it and issued a replacement. This copy is no longer valid; the replacement is.
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Recipient">{cert.recipientName}</Field>
            <Field label="Certificate">{title}</Field>
            <Field label="Certificate ID">
              <span className="font-mono text-[0.9375rem]">{cert.certificateId}</span>
            </Field>
            <Field label="Original issue date">{formatDate(cert.issuedAt)}</Field>
            <Field label="Status">Replaced</Field>
            {cert.replacedBy && (
              <Field label="Replacement certificate">
                <Link to={`/verify/${cert.replacedBy}`} className="font-mono text-[0.9375rem] text-brass-dark hover:text-ink">
                  {cert.replacedBy}
                </Link>
              </Field>
            )}
          </dl>
        </div>
      )}

      {/* Rendered for the PDF download; shown when "View Certificate" is pressed. */}
      {cert.status === "valid" && (
        <div ref={art} hidden={!showing} className="mt-8 scroll-mt-24">
          <div className="overflow-hidden rounded-xl border border-line-strong shadow-[0_20px_50px_-30px_rgba(23,23,23,0.45)]">
            <CertificateDocument ref={svg} templateId={cert.templateId} data={renderOf(cert)} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
