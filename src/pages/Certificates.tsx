import { useState } from "react";
import { useNavigate } from "react-router";
import { BadgeCheck, BookOpen, ClipboardCheck, FolderKanban, PenLine } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { Button, ButtonLink } from "@/components/Button";
import { TextField } from "@/components/Form";

export function VerifyForm() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [error, setError] = useState<string | undefined>();
  return (
    <form
      className="rounded-2xl border border-line bg-paper p-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const clean = id.trim().toUpperCase();
        if (!/^CTA-[A-Z]{2,5}-\d{4}-\d{6}$/.test(clean)) return setError("Enter the full credential ID, for example CTA-SQL-2026-004821.");
        setError(undefined);
        navigate(`/verify/${clean}`);
      }}
    >
      <h2 className="font-serif text-[1.4rem]">Verify a certificate</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <TextField label="Credential ID" value={id} onChange={(e) => setId(e.target.value)} placeholder="CTA-SQL-2026-004821" error={error} autoCapitalize="characters" spellCheck={false} />
        </div>
        <Button type="submit" className="sm:mt-7">
          Verify
        </Button>
      </div>
    </form>
  );
}

const STEPS = [
  { icon: BookOpen, title: "Complete the lessons", body: "Work through every required lesson in the course and mark it complete." },
  { icon: PenLine, title: "Do the practice", body: "Solve the required exercises. In SQL courses they're checked against the real query result." },
  { icon: ClipboardCheck, title: "Pass the assessment", body: "Score 70% or more on the final assessment. You can retake it as often as you need." },
  { icon: FolderKanban, title: "Submit the project", body: "Where a course has a final project, submit your work on it." },
];

export default function Certificates() {
  useSeo({
    title: "Certificates | CloudTech Academy",
    description: "How CloudTech Academy certificates are earned, what they show, and how employers can verify them with a credential ID.",
    jsonLd: breadcrumbs([["Certificates", "/certificates"]]),
  });
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-4xl py-16 sm:py-20">
          <p className="kicker">Certificates</p>
          <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">Earned, not given out for watching.</h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">
            A CloudTech Academy certificate says you finished the work: the lessons, the practice and a passed assessment. Each one has a unique credential ID and a public page where anyone can check it.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="font-serif text-[1.9rem]">How to earn one</h2>
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
          The requirements are checked on the server when you claim a certificate, so they can't be skipped. Certificates are free, like the courses.
        </p>
      </section>

      <section className="border-y border-line bg-sand/50">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-[1.9rem]">What each certificate shows</h2>
            <ul className="mt-6 space-y-3 text-[1rem]">
              {["Your full name", "The course title", "The date it was issued", "A unique credential ID, like CTA-SQL-2026-004821", "A verification link"].map((x) => (
                <li key={x} className="flex gap-3">
                  <BadgeCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brass-dark" />
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted">
              You can download it as an image, print it or save it as a PDF, and add it to the Licenses & certifications section of your LinkedIn profile. The public verification page shows only the details above, never your email.
            </p>
          </div>
          <div id="verify" className="scroll-mt-24">
            <p className="mb-4 text-[1rem] leading-relaxed">Employers and recruiters: enter the credential ID printed on the certificate to confirm it's genuine and hasn't been revoked.</p>
            <VerifyForm />
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="font-serif text-[1.9rem]">Start with SQL for Data Analysis</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">Our first certificate course. Free, self-paced, and practised on a real-looking company database.</p>
        <div className="mt-6">
          <ButtonLink to="/courses/sql-for-data-analysis" arrow>
            View the course
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
