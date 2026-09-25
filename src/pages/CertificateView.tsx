import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { Download, ExternalLink, Printer, Share2 } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading, RequireAuth } from "@/lib/auth";
import { getBackend, type Certificate } from "@/lib/backend";
import { verifyUrl } from "@/lib/certificates";
import { SITE } from "@/lib/site";
import { CertificateArtwork, downloadCertificatePng } from "@/components/CertificateArtwork";
import { CopyButton } from "@/components/sql/SqlParts";
import { Alert } from "@/components/Form";
import { buttonClass } from "@/components/Button";

function linkedInUrl(c: Certificate) {
  const d = new Date(c.issuedAt);
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: c.courseTitle,
    organizationName: SITE.name,
    issueYear: String(d.getFullYear()),
    issueMonth: String(d.getMonth() + 1),
    certId: c.credentialId,
    certUrl: verifyUrl(SITE.url, c.credentialId),
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}

function Inner() {
  const { credentialId = "" } = useParams();
  const [cert, setCert] = useState<Certificate | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  useSeo({ title: "Your certificate | CloudTech Academy", description: "Your CloudTech Academy certificate.", noindex: true });

  useEffect(() => {
    void getBackend()
      .then((b) => b.getMyCertificate(credentialId))
      .then(setCert)
      .catch(() => setCert(null));
  }, [credentialId]);

  if (cert === undefined) return <PageLoading />;
  if (!cert)
    return (
      <div className="container-page py-20">
        <h1 className="font-serif text-[2.2rem]">Certificate not found</h1>
        <p className="mt-3 text-muted">It isn't in your account. Check your dashboard for the certificates you've earned.</p>
        <Link to="/dashboard" className="mt-5 inline-block font-semibold text-brass-dark">
          Go to dashboard
        </Link>
      </div>
    );

  const url = verifyUrl(SITE.url, cert.credentialId);
  const download = async () => {
    setError(null);
    try {
      if (svg.current) await downloadCertificatePng(svg.current, `${cert.credentialId}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't download the image.");
    }
  };

  return (
    <div className="container-page py-12 sm:py-16">
      <Link to="/dashboard" className="text-[0.875rem] text-muted hover:text-ink print:hidden">
        ← Dashboard
      </Link>
      <h1 className="mt-4 font-serif text-[2.1rem] leading-tight sm:text-[2.6rem] print:hidden">{cert.courseTitle}</h1>
      {cert.status === "revoked" && (
        <div className="mt-5 print:hidden">
          <Alert tone="error">This certificate was revoked{cert.revokedReason ? `: ${cert.revokedReason}` : "."}</Alert>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-line-strong shadow-[0_20px_50px_-30px_rgba(23,23,23,0.45)] print:border-0 print:shadow-none">
        <CertificateArtwork
          ref={svg}
          data={{ recipientName: cert.recipientName, courseTitle: cert.courseTitle, issuedAt: cert.issuedAt, credentialId: cert.credentialId, verifyUrl: url, revoked: cert.status === "revoked" }}
        />
      </div>

      {cert.status === "valid" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2 print:hidden">
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => void download()} className={buttonClass("primary")}>
              <Download aria-hidden className="h-4 w-4" /> Download PNG
            </button>
            <button type="button" onClick={() => window.print()} className={buttonClass("secondary")}>
              <Printer aria-hidden className="h-4 w-4" /> Print or save as PDF
            </button>
            <a href={linkedInUrl(cert)} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
              <Share2 aria-hidden className="h-4 w-4" /> Add to LinkedIn
            </a>
          </div>
          <div className="rounded-xl border border-line bg-paper p-5">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-muted">Verification link</p>
            <p className="mt-2 break-all font-mono text-[0.8125rem]">{url}</p>
            <div className="mt-3 flex items-center gap-4">
              <CopyButton text={url} />
              <Link to={`/verify/${cert.credentialId}`} className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brass-dark">
                Open <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mt-3 text-[0.8125rem] text-muted">Anyone with this link can confirm the certificate is genuine. It shows your name, the course and the issue date only.</p>
          </div>
        </div>
      )}
      <div aria-live="polite" className="mt-4">
        {error && <Alert tone="error">{error}</Alert>}
      </div>
    </div>
  );
}

export default function CertificateView() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
