import { Mail } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { ButtonLink } from "@/components/Button";

const BELIEFS = [
  { title: "Reading beats watching for this kind of skill", body: "Text is quicker to scan, easier to come back to, and works on a slow connection. Every idea is followed straight away by something to try." },
  { title: "Practice on data that looks like work", body: "Our datasets are fictional but shaped like real companies: freight, sales, a law firm, an HR team. The questions are ones a manager would ask." },
  { title: "Free where it matters", body: "The core courses are free to read and free to certify. You only need an account to save progress and earn a certificate." },
  { title: "Honest about what's ready", body: "We publish courses when they're finished. Anything marked coming soon is still being written." },
];

export default function About() {
  useSeo({
    title: "About | CloudTech Academy",
    description: "CloudTech Academy is the learning arm of CloudTech Analytics: practical, text-first courses in data, analytics and technology.",
    jsonLd: breadcrumbs([["About", "/about"]]),
  });
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-4xl py-16 sm:py-20">
          <p className="kicker">About</p>
          <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">Practical data skills, taught the way work actually happens.</h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">
            CloudTech Academy is the learning arm of{" "}
            <a href={SITE.parentUrl} className="font-semibold text-ink underline decoration-brass underline-offset-4">
              CloudTech Analytics
            </a>
            , the company behind The Counsel and The Manifest. We build software for law firms and logistics companies, and the Academy teaches the data skills we use to do it.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="font-serif text-[1.9rem]">What we believe</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {BELIEFS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-line bg-paper p-6">
              <h3 className="text-[1.0625rem] font-semibold">{b.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-sand/50">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-[1.9rem]">How a course works</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Each lesson opens with a business problem, explains one idea, shows a worked example, then hands you a task. In the SQL course that task runs against a real database in your browser and is checked on the spot. A final assessment and a project close each course, and passing both earns a certificate anyone can verify.
            </p>
          </div>
          <div id="contact" className="scroll-mt-24">
            <h2 className="font-serif text-[1.9rem]">Contact</h2>
            <p className="mt-4 leading-relaxed text-muted">Questions about a course, a certificate, or training for your team? Email us and a person will reply.</p>
            <a href={`mailto:${SITE.email}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-brass-dark">
              <Mail aria-hidden className="h-4 w-4" /> {SITE.email}
            </a>
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="font-serif text-[1.9rem]">Ready to start?</h2>
        <div className="mt-6">
          <ButtonLink to="/courses" arrow>
            Browse courses
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
