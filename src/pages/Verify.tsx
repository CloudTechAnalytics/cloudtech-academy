import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { BadgeCheck, ShieldAlert, ShieldX } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading } from "@/lib/auth";
import { getBackend, IS_LIVE, type PublicCertificate } from "@/lib/backend";
import { formatDate } from "@/lib/format";
import { VerifyForm } from "./Certificates";

export default function Verify() {
  const { credentialId = "" } = useParams();
  const [cert, setCert] = useState<PublicCertificate | null | undefined>(undefined);
  useSeo({ title: `Verify ${credentialId} | CloudTech Academy`, description: "Check that a CloudTech Academy certificate is genuine.", noindex: true });

  useEffect(() => {
    setCert(undefined);
    void getBackend()
      .then((b) => b.verifyCertificate(credentialId.trim().toUpperCase()))
      .then(setCert)
      .catch(() => setCert(null));
  }, [credentialId]);

  if (cert === undefined) return <PageLoading label="Checking the certificate…" />;

  return (
    <div className="container-page max-w-2xl py-14 sm:py-20">
      <p className="kicker">Certificate verification</p>
      {cert ? (
        <div className={`mt-5 rounded-2xl border p-7 sm:p-8 ${cert.status === "valid" ? "border-success/40 bg-success-bg" : "border-danger/40 bg-danger/10"}`}>
          <div className="flex items-center gap-3">
            {cert.status === "valid" ? <BadgeCheck aria-hidden className="h-8 w-8 text-success" /> : <ShieldX aria-hidden className="h-8 w-8 text-danger" />}
            <h1 className="font-serif text-[1.9rem] leading-tight">{cert.status === "valid" ? "Valid certificate" : "Revoked certificate"}</h1>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[0.8125rem] text-muted">Awarded to</dt>
              <dd className="mt-0.5 text-[1.125rem] font-semibold">{cert.recipientName}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Course</dt>
              <dd className="mt-0.5 text-[1.125rem] font-semibold">{cert.courseTitle}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Issued</dt>
              <dd className="mt-0.5">{formatDate(cert.issuedAt)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Credential ID</dt>
              <dd className="mt-0.5 font-mono text-[0.9375rem]">{cert.credentialId}</dd>
            </div>
          </dl>
          <p className="mt-6 text-[0.9rem] leading-relaxed">
            {cert.status === "valid"
              ? "Issued by CloudTech Academy after the learner met every requirement of the course, including passing its final assessment."
              : "CloudTech Academy has withdrawn this certificate. It should not be accepted as proof of completion."}
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-line-strong bg-paper p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldAlert aria-hidden className="h-8 w-8 text-muted" />
            <h1 className="font-serif text-[1.9rem] leading-tight">No certificate found</h1>
          </div>
          <p className="mt-4 leading-relaxed">
            We couldn't find a certificate with the ID <span className="font-mono">{credentialId}</span>. Check it was typed exactly as printed, for example CTA-SQL-2026-004821.
          </p>
          {!IS_LIVE && <p className="mt-3 text-[0.875rem] text-muted">The Academy is in demo mode, so only certificates issued in this browser can be checked.</p>}
        </div>
      )}
      <div className="mt-10">
        <VerifyForm />
      </div>
      <p className="mt-8 text-[0.875rem] text-muted">
        Questions about a certificate? <Link to="/about#contact" className="font-semibold text-brass-dark">Contact us</Link>.
      </p>
    </div>
  );
}
