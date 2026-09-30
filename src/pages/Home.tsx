import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourses } from "@/lib/data";
import { ButtonLink } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { Reveal } from "@/components/Reveal";
import { webSiteJsonLd } from "@/lib/schema";

/** A learner in an online lesson, with the kind of progress card the Academy shows. Photo: Unsplash licence. */
function LearnerVisual() {
  return (
    <div className="relative pb-10 sm:pb-0">
      <img
        src="/images/home/learner.webp"
        srcSet="/images/home/learner-760.webp 760w, /images/home/learner.webp 1400w"
        sizes="(min-width: 1024px) 560px, 100vw"
        alt="A learner at a laptop, following an online lesson"
        width={1400}
        height={1120}
        fetchPriority="high"
        className="aspect-[5/4] w-full rounded-2xl border border-line object-cover shadow-[0_40px_80px_-48px_rgba(23,23,23,0.55)]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-4 w-[17.5rem] rounded-xl border border-line bg-paper p-4 shadow-[0_24px_48px_-28px_rgba(23,23,23,0.5)] sm:-bottom-8 sm:-left-8"
      >
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-brass-dark">SQL for Data Analysis</p>
        <p className="mt-1.5 font-serif text-[1rem] font-bold leading-snug text-ink">Lesson 7 · Aggregate functions</p>
        <div className="mt-3 flex items-center justify-between text-[0.6875rem] text-muted">
          <span>6 of 16 lessons</span>
          <span className="font-semibold text-ink">38%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand">
          <div className="h-full w-[38%] rounded-full bg-brass" />
        </div>
      </div>
    </div>
  );
}

const PRINCIPLES = [
  { title: "Practical", body: "Every lesson starts with a realistic business problem, and you practise on real-looking company data." },
  { title: "Self-paced", body: "Learn when you have the time. Lessons are short enough for a lunch break and read well on a phone." },
  { title: "Accessible", body: "The core courses are free. You can read every lesson without an account; sign up only to save progress and earn a certificate." },
  { title: "Career-focused", body: "Finish with projects you can show and explain to an employer, not only a certificate." },
];

const STEPS = ["Read", "Understand", "Practise", "Apply", "Assess", "Earn"];

export default function Home() {
  useSeo({
    title: "CloudTech Academy | Learn Data, Analytics & Technology",
    description:
      "Practical, self-paced courses in data, analytics and technology from CloudTech Analytics. Learn, practise, build and earn CloudTech certificates.",
    jsonLd: webSiteJsonLd(),
  });
  const courses = useCourses();

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:py-24">
          <Reveal className="lg:col-span-6">
            <p className="kicker">CloudTech Academy</p>
            <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.06] tracking-[-0.02em] sm:text-[3.4rem] xl:text-[3.9rem]">
              Learn the skills businesses <span className="text-brass-accent">actually use.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted sm:text-[1.1875rem]">
              Practical, self-paced courses in data, analytics and technology, designed to help you learn, practise and build real skills without
              expensive course fees.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/courses" arrow>
                Explore courses
              </ButtonLink>
              <ButtonLink to="/sign-up" variant="secondary">
                Start learning free
              </ButtonLink>
            </div>
            <ol className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted" aria-label="How each course works">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className={i === STEPS.length - 1 ? "font-semibold text-brass-dark" : ""}>{s}</span>
                  {i < STEPS.length - 1 && <ArrowRight aria-hidden className="h-3 w-3 text-line-strong" />}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6">
            <LearnerVisual />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="short-title" className="border-b border-line bg-paper py-16 sm:py-20">
        <div className="container-page">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="kicker">Short courses · Free badges</p>
              <h2 id="short-title" className="mt-3 font-serif text-[2.1rem] leading-[1.1] sm:text-[2.5rem]">
                Short modules. A badge for each one.
              </h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">
                AI tools, design, careers, coding and Python in modules of about 20 minutes. Pass each short check to earn a free badge you can share,
                with its own credential ID.
              </p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brass-dark hover:text-ink">
              All courses <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </Reveal>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {courses
              .filter((c) => c.format === "short")
              .slice(0, 3)
              .map((c, i) => (
                <Reveal as="li" key={c.id} delay={i * 80} className="h-full">
                  <CourseCard course={c} />
                </Reveal>
              ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="students-title" className="border-b border-line py-16 sm:py-20">
        <div className="container-page">
          <Reveal className="grid gap-8 rounded-2xl border border-line bg-sand/50 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="kicker">Student Starter · Free</p>
              <h2 id="students-title" className="mt-3 font-serif text-[2.1rem] leading-[1.1] sm:text-[2.5rem]">
                Practical skills for students who want to get ahead.
              </h2>
              <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
                25 skills for school, internships and your first job, from ChatGPT for study and research to CVs, Excel,
                Git, Python and freelancing. Earn a badge for each one and show them all on your own skills profile.
              </p>
              <div className="mt-6">
                <ButtonLink to="/students" arrow>
                  See the Student Starter
                </ButtonLink>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-2 text-[0.9375rem]">
              {[
                "ChatGPT for study",
                "Research online",
                "CV and LinkedIn",
                "Student portfolio",
                "Excel and SQL",
                "Canva and CapCut",
                "Git and GitHub",
                "Your first website",
                "Python",
                "Internships",
              ].map((t) => (
                <li key={t} className="rounded-lg border border-line bg-paper px-3 py-2">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="why-title" className="py-20 sm:py-24">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <h2 id="why-title" className="font-serif text-[2.1rem] leading-[1.1] sm:text-[2.6rem]">
              Learn by doing, not just watching.
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              CloudTech Academy is text-first. You read a short explanation, then write the query, build the formula or answer the question yourself.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-x-10 border-t border-ink/80 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="border-b border-line py-7 lg:border-b-0">
                <h3 className="font-serif text-[1.4rem]">{p.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="courses-title" className="border-t border-line bg-paper py-20 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <h2 id="courses-title" className="font-serif text-[2.1rem] leading-[1.1] sm:text-[2.6rem]">
                Courses
              </h2>
              <p className="mt-3 max-w-xl text-muted">All five courses are open and free. New to data? Start with Data Analytics Foundations, or go straight to the tool you need.</p>
            </Reveal>
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink hover:text-brass-dark">
              All courses <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {courses.map((c, i) => (
              <Reveal key={c.id} delay={(i % 2) * 80} className="h-full">
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="sandbox-title" className="border-t border-line py-20 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <h2 id="sandbox-title" className="font-serif text-[2rem] leading-[1.1] sm:text-[2.4rem]">
              Practise on a real database, in your browser.
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              The SQL course comes with Harbourline Freight, a fictional logistics company with thousands of shipments, customers and payments. Write a
              query, run it, and get told straight away whether your result is right. Nothing to install.
            </p>
            <ButtonLink to="/learn/sql-for-data-analysis/introduction-to-databases" variant="secondary" arrow className="mt-7">
              Try the first lesson
            </ButtonLink>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-line shadow-[0_30px_60px_-40px_rgba(23,23,23,0.5)]">
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--color-code-bg)" }}>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-brass-light">Practice</span>
                <span className="rounded-md bg-brass-button px-2.5 py-1 text-[0.75rem] font-semibold text-on-brass">Run and check</span>
              </div>
              <pre className="code-block rounded-none">
                <code>{"SELECT c.company_name,\n       SUM(s.containers) AS containers\nFROM shipments AS s\nJOIN customers AS c ON c.customer_id = s.customer_id\nWHERE s.booking_date >= '2026-01-01'\nGROUP BY c.customer_id, c.company_name\nORDER BY containers DESC\nLIMIT 5;"}</code>
              </pre>
              <p className="border-t border-line bg-success-bg px-4 py-3 text-[0.875rem] font-medium text-success">Correct. Your result matches the expected answer.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="cta-title" className="border-t border-line bg-sand/60 py-20 sm:py-24">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <h2 id="cta-title" className="font-serif text-[2.3rem] leading-[1.08] sm:text-[2.9rem]">
              Your next skill starts here.
            </h2>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
              Whether you're starting your first data course or building your next professional skill, CloudTech Academy gives you a practical place to
              learn, practise and build.
            </p>
          </Reveal>
          <Reveal delay={80} className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
            <ButtonLink to="/courses">Explore courses</ButtonLink>
            <ButtonLink to="/sign-up" variant="secondary">
              Start learning free
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
