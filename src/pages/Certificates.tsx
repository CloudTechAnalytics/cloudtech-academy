import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Award, BadgeCheck, BookOpen, ClipboardCheck, GraduationCap } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { getBackend, type CertificatePrice } from "@/lib/backend";
import { Button, ButtonLink } from "@/components/Button";
import { TextField } from "@/components/Form";
import { CertificateArtwork, type CertificateData } from "@/components/CertificateArtwork";
import { BadgeArtwork } from "@/components/BadgeArtwork";
import { badgeIcon } from "@/components/BadgeIcon";
import { formatMoney } from "@/lib/currency";
import { isCertificateId, verifyUrl } from "@/lib/certificates";
import { SITE } from "@/lib/site";

const SAMPLE_CERTIFICATE: CertificateData = {
  recipientName: "Your Name",
  courseTitle: "AI Productivity Fundamentals",
  issuedAt: "2026-09-30T09:00:00Z",
  certificateId: "CTA-2026-000124",
  credentialId: "CTA-AIPF-8F72K",
  verifyUrl: verifyUrl(SITE.url, "CTA-2026-000124"),
};

const SAMPLE_BADGES = [
  { kind: "module_badge" as const, badgeName: "Prompting Essentials", code: "PROMPT" },
  { kind: "module_badge" as const, badgeName: "Claude AI Essentials", code: "CLAUDE" },
  { kind: "module_badge" as const, badgeName: "ChatGPT Essentials", code: "CHATGPT" },
  { kind: "course_completion" as const, badgeName: "AI Productivity Fundamentals", code: "AIPF" },
];

export function VerifyForm({ title = "Verify a certificate or badge" }: { title?: string }) {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [error, setError] = useState<string | undefined>();
  return (
    <form
      className="rounded-2xl border border-line bg-paper p-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const clean = id.trim().toUpperCase().replace(/\s+/g, "");
        if (!clean) return setError("Enter the certificate ID, for example CTA-2026-000184.");
        setError(undefined);
        // Badge IDs (CTA-PROMPT-8F72K) have their own page; everything else is checked as a certificate.
        if (!isCertificateId(clean) && /^CTA-[A-Z0-9]{2,8}-[2-9A-HJ-NP-Z]{5}$/.test(clean)) return navigate(`/credentials/${clean}`);
        return navigate(`/verify/${encodeURIComponent(clean)}`);
      }}
    >
      <h2 className="font-serif text-[1.4rem]">{title}</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <TextField
            label="Certificate ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter Certificate ID, e.g. CTA-2026-000184"
            hint="Badge IDs such as CTA-PROMPT-8F72K work here too."
            error={error}
            autoCapitalize="characters"
            spellCheck={false}
          />
        </div>
        <Button type="submit" className="sm:mt-7">
          Verify Certificate
        </Button>
      </div>
    </form>
  );
}

const STEPS = [
  { icon: BookOpen, title: "Learn, free", body: "Every course, lesson and practice task is free. Start straight away." },
  { icon: Award, title: "Earn module badges", body: "Pass each short module check to earn its badge, with its own credential ID." },
  { icon: ClipboardCheck, title: "Complete the course", body: "Pass the final assessment to earn the free course completion badge." },
  { icon: GraduationCap, title: "Certificate, if you want one", body: "Optionally get the official verified PDF certificate for the course." },
];

export default function Certificates() {
  useSeo({
    title: "Badges & Certificates | CloudTech Academy",
    description:
      "Learn free and earn free, verifiable badges for every module and course you complete. The official PDF certificate is optional. Check any CloudTech credential by its ID.",
    jsonLd: breadcrumbs([["Certificates", "/certificates"]]),
  });
  const [prices, setPrices] = useState<CertificatePrice[]>([]);
  useEffect(() => {
    void getBackend()
      .then((b) => b.listCertificatePrices())
      .then(setPrices)
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="kicker">Badges & certificates</p>
            <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">
              Learn free. Earn your badges free.
            </h1>
            <ul className="mt-6 space-y-2 text-[1.0625rem]">
              <li className="flex gap-3">
                <BadgeCheck aria-hidden className="mt-1 h-5 w-5 shrink-0 text-brass-dark" /> You don't need to pay to learn.
              </li>
              <li className="flex gap-3">
                <BadgeCheck aria-hidden className="mt-1 h-5 w-5 shrink-0 text-brass-dark" /> You don't need to pay to earn a CloudTech badge.
              </li>
              <li className="flex gap-3">
                <BadgeCheck aria-hidden className="mt-1 h-5 w-5 shrink-0 text-brass-dark" /> You only pay if you want the official downloadable certificate.
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-6">
            {SAMPLE_BADGES.map((b) => (
              <BadgeArtwork
                key={b.badgeName}
                data={{ kind: b.kind, badgeName: b.badgeName, courseTitle: "AI Productivity Fundamentals", icon: badgeIcon({ code: b.code, completion: b.kind === "course_completion" }) }}
                className="h-auto w-full rounded-xl border border-line shadow-[0_24px_48px_-36px_rgba(23,23,23,0.5)]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="font-serif text-[1.9rem]">How it works</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="rounded-2xl border border-line bg-paper p-6">
              <p className="flex items-center justify-between">
                <Icon aria-hidden className="h-5 w-5 text-brass-dark" />
                <span className="font-serif text-[1.1rem] text-subtle">{i + 1}</span>
              </p>
              <h3 className="mt-4 text-[1.0625rem] font-semibold">{title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-[0.9375rem] text-muted">
          Every badge and course completion has a credential ID and a public page, so anyone can check it's genuine. Requirements are checked on the server,
          so they can't be skipped.
        </p>
      </section>

      <section aria-labelledby="official-title" className="border-t border-line bg-paper py-16">
        <div className="container-page grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker">Optional</p>
            <h2 id="official-title" className="mt-3 font-serif text-[2rem] leading-tight">
              The official verified certificate
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              When you've completed a course, you can get an official PDF certificate to print or attach to applications. It carries your name, the course,
              your completion date, a certificate number, your credential ID and a QR code that opens its verification page.
            </p>
            {prices.length > 0 && (
              <p className="mt-4 text-[0.9375rem]">
                It's a one-off {prices.map((p) => formatMoney(p.amount, p.currency)).join(" or ")}. Your badges and completion credential stay free either way.
              </p>
            )}
          </div>
          <figure className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-line-strong bg-paper shadow-[0_40px_80px_-44px_rgba(23,23,23,0.55)] lg:rotate-[1deg]">
              <CertificateArtwork data={SAMPLE_CERTIFICATE} />
            </div>
            <figcaption className="mt-4 text-center text-[0.8125rem] text-muted">A sample official certificate.</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-line bg-sand/50">
        <div id="verify" className="container-page grid scroll-mt-24 gap-12 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-[1.9rem]">For employers and recruiters</h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-muted">
              Enter the ID from a CloudTech badge or certificate to confirm it's genuine and hasn't been revoked. Verification pages show only the learner's
              name, what they earned and when, never their email or account details.
            </p>
          </div>
          <VerifyForm />
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="font-serif text-[1.9rem]">Start earning your first badge</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">Short courses in AI, design, careers and data, and in-depth courses in analytics. All free to learn.</p>
        <div className="mt-6">
          <ButtonLink to="/courses" arrow>
            Browse the courses
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
