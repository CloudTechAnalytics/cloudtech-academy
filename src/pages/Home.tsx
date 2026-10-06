import { ConnectSection } from "@/components/CommunityWidgets";
import { Link } from "react-router";
import { ArrowRight, Award, BookOpen, CheckCircle2, FolderKanban, PencilLine } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourses } from "@/lib/data";
import { ButtonLink } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { TrackCard } from "@/components/TrackCard";
import { Reveal } from "@/components/Reveal";
import { webSiteJsonLd } from "@/lib/schema";
import { TRACKS } from "@/content/tracks";

/** Courses we suggest to someone arriving with no experience. */
const STARTING_COURSES = [
  "data-analytics-foundations",
  "sql-for-data-analysis",
  "excel-for-data-analysis",
  "python-for-beginners",
  "power-bi-fundamentals",
  "business-analysis-fundamentals",
];

const STEPS = [
  { icon: BookOpen, title: "Learn", body: "Clear lessons that explain each idea step by step, with worked examples." },
  { icon: PencilLine, title: "Practise", body: "Write the query, formula or code yourself and get instant feedback." },
  { icon: Award, title: "Earn badges", body: "Pass each module check to earn a badge for that skill." },
  { icon: FolderKanban, title: "Build and certify", body: "Finish a real project and earn a certificate anyone can verify." },
];

/** The hero's picture: a Professional Certificate and the badges and progress that lead to it, drawn in code. */
function HeroVisual() {
  const programmes = ["Data Analysis", "Business Analysis", "Data Science", "AI Engineering", "Cloud & DevOps"];
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[34rem] pb-10 lg:pb-0">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1E1D1B] p-6 pb-10 shadow-[0_40px_80px_-40px_rgba(23,23,23,0.7)] sm:p-9 sm:pb-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C9A45C]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#C9A45C]/15 blur-3xl" />
        <p className="relative text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-[#C9A45C]">Professional Programme</p>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {programmes.map((p, i) => (
            <span
              key={p}
              className={`rounded-full px-3 py-1.5 text-[0.75rem] font-medium ${i === 0 ? "bg-[#C9A45C] text-[#1E1D1B]" : "border border-white/15 bg-white/5 text-[#E6DECB]"}`}
            >
              {p}
            </span>
          ))}
        </div>
        <div className="relative mt-7 -rotate-2 overflow-hidden rounded-xl bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <div className="flex">
            <div className="w-5 shrink-0 bg-[#1E1D1B] sm:w-6" style={{ backgroundImage: "linear-gradient(180deg,#C9A45C,#1E1D1B 60%)" }} />
            <div className="min-w-0 flex-1 p-5 sm:p-6">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.26em] text-[#8A6A1F]">Professional Certificate</p>
              <p className="mt-3 text-[0.6875rem] text-[#6B665C]">This is to certify that</p>
              <p className="font-serif text-[1.6rem] leading-tight text-[#1E1D1B]">Your Name Here</p>
              <p className="mt-1 text-[0.6875rem] text-[#6B665C]">has completed the professional programme</p>
              <p className="font-serif text-[1.15rem] text-[#8A6A1F]">Data Analysis</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="font-mono text-[0.625rem] text-[#6B665C]">CTA-2026-000124</span>
                <span className="grid h-12 w-12 grid-cols-5 gap-px rounded bg-white p-1 ring-1 ring-[#E4D9C3]">
                  {Array.from({ length: 25 }, (_, i) => (
                    <span key={i} className={[0, 1, 4, 5, 6, 9, 10, 12, 14, 15, 18, 20, 21, 22, 24].includes(i) ? "bg-[#1E1D1B]" : "bg-transparent"} />
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-3 left-3 w-56 rounded-xl border border-line bg-paper p-4 shadow-[0_20px_40px_-24px_rgba(23,32,51,0.45)] sm:-left-6 lg:-bottom-6">
        <div className="flex items-center justify-between text-[0.75rem]">
          <span className="font-medium text-muted">Programme progress</span>
          <span className="font-semibold text-ink">62%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
          <div className="h-full w-[62%] rounded-full bg-brass" />
        </div>
      </div>
      <div className="absolute -top-4 right-3 hidden items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 shadow-[0_20px_40px_-24px_rgba(23,32,51,0.45)] sm:-right-5 sm:flex">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brass-pale text-brass-dark">
          <Award className="h-4 w-4" />
        </span>
        <span className="text-[0.75rem] leading-tight">
          <span className="block text-subtle">Badge earned</span>
          <span className="block font-semibold text-ink">SQL Querying</span>
        </span>
      </div>
      <div className="absolute -right-2 bottom-14 hidden items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-[0.75rem] font-semibold text-success shadow-[0_20px_40px_-24px_rgba(23,32,51,0.45)] sm:flex lg:-right-6">
        <CheckCircle2 className="h-4 w-4" /> Verified
      </div>
    </div>
  );
}

function SectionHeading({ id, kicker, title, intro, link }: { id: string; kicker: string; title: string; intro?: string; link?: { to: string; label: string } }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="kicker">{kicker}</p>
        <h2 id={id} className="mt-2 font-serif text-[1.85rem] leading-tight sm:text-[2.25rem]">
          {title}
        </h2>
        {intro && <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">{intro}</p>}
      </div>
      {link && (
        <Link to={link.to} className="inline-flex shrink-0 items-center gap-1.5 text-[0.9375rem] font-semibold text-brass-dark hover:text-ink">
          {link.label} <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  useSeo({
    title: "CloudTech Academy | Learn Data, Analytics & Technology",
    description:
      "Practical, self-paced courses in data, analytics and technology from CloudTech Analytics. Learn, practise, build and earn CloudTech certificates.",
    jsonLd: webSiteJsonLd(),
  });
  const courses = useCourses();
  const lessons = courses.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);
  const starters = STARTING_COURSES.map((id) => courses.find((c) => c.id === id)).filter((c) => c !== undefined);

  return (
    <>
      <section className="border-b border-line bg-paper" style={{ backgroundImage: "radial-gradient(60rem 28rem at 85% -10%, rgba(201,164,92,0.16), transparent 60%)" }}>
        <div className="container-page grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-brass-pale px-3 py-1 text-[0.8125rem] font-semibold text-brass-dark">
              Free courses in data and technology
            </p>
            <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.1] tracking-[-0.025em] sm:text-[3.25rem]">
              Learn the skills businesses <span className="text-brass-accent">actually use.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-muted sm:text-[1.125rem]">
              Step-by-step courses in data, analytics and technology. Learn each idea, practise it on real-looking company data, and build projects you can
              show an employer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/sign-up" arrow>
                Start learning free
              </ButtonLink>
              <ButtonLink to="/programmes" variant="secondary">
                Explore learning paths
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      <section aria-label="The Academy in numbers" className="border-b border-line">
        <dl className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {[
            [String(courses.length), "courses"],
            [String(lessons), "lessons"],
            [String(TRACKS.length), "learning paths"],
            ["Free", "to learn"],
          ].map(([n, label]) => (
            <div key={label} className="text-center sm:text-left">
              <dt className="sr-only">{label}</dt>
              <dd className="font-serif text-[1.75rem] leading-none text-ink [font-variant-numeric:lining-nums]">{n}</dd>
              <dd className="mt-1.5 text-[0.875rem] text-muted">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="go-further-title" className="border-b border-line bg-paper py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            id="go-further-title"
            kicker="Free and professional"
            title="Start Learning. Then Go Further."
            intro="Begin with free courses that teach a real skill. When you are ready to build a career, join a professional programme with projects, assessments, a capstone and support."
          />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { title: "Free courses", line: "Learn a skill", body: "Short, genuinely useful courses on one skill at a time. Sign up, learn at your pace and earn a badge. Free, always." },
              { title: "Professional programmes", line: "Build a career", body: "Complete, structured programmes with projects, assessments, a capstone and a professional certificate when you meet the requirements." },
              { title: "Community", line: "Connect and grow", body: "Meet other learners, join events and keep going together with the CloudTech community." },
            ].map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 60} className="rounded-2xl border border-line bg-ivory p-6">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-brass-dark">{c.line}</p>
                <p className="mt-2 font-serif text-[1.35rem]">{c.title}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{c.body}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/courses?access=free" arrow>
              Explore Free Courses
            </ButtonLink>
            <ButtonLink to="/courses?access=professional" variant="secondary">
              Explore Professional Programmes
            </ButtonLink>
          </div>
          <p className="mt-6 text-[0.9375rem] text-muted">CloudTech: Build technology. Build people. Solve real problems.</p>
        </div>
      </section>

      <section aria-labelledby="tracks-title" className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            id="tracks-title"
            kicker="Learning paths"
            title="Choose a career, earn the certificate"
            intro="Each learning path is a complete route: the right courses in order, a capstone project, and one official Professional Certificate for the whole thing. Start with the free steps, and go deeper with a professional programme when you are ready."
            link={{ to: "/programmes", label: "Compare all learning paths" }}
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRACKS.map((t, i) => (
              <Reveal as="li" key={t.id} delay={(i % 4) * 60} className="h-full">
                <TrackCard track={t} courses={courses} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-title" className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading id="how-title" kicker="How it works" title="Every course follows the same four steps" />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 60} className="rounded-2xl border border-line bg-ivory p-6">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brass-pale text-brass-dark">
                    <s.icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="text-[0.8125rem] font-semibold text-subtle">Step {i + 1}</span>
                </span>
                <h3 className="mt-4 font-serif text-[1.15rem] text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="courses-title" className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            id="courses-title"
            kicker="Start here"
            title="Good first courses"
            intro="New to data or technology? These courses assume no experience."
            link={{ to: "/courses", label: `Browse all ${courses.length} courses` }}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {starters.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 60} className="h-full">
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="sandbox-title" className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="kicker">Practise as you learn</p>
            <h2 id="sandbox-title" className="mt-2 font-serif text-[1.85rem] leading-tight sm:text-[2.25rem]">
              Write real queries in your browser
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              The SQL course comes with a practice database for a logistics company: thousands of shipments, customers and payments. Run your query and
              find out straight away whether your answer is right. Nothing to install.
            </p>
            <ButtonLink to="/learn/sql-for-data-analysis/introduction-to-databases" variant="secondary" arrow className="mt-7">
              Try the first lesson
            </ButtonLink>
          </Reveal>
          <Reveal delay={100} className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-line">
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--color-code-bg)" }}>
                <span className="text-[0.75rem] font-semibold text-brass-light">Practice</span>
                <span className="rounded-md bg-brass-button px-2.5 py-1 text-[0.75rem] font-semibold text-on-brass">Run and check</span>
              </div>
              <pre className="code-block rounded-none">
                <code>{"SELECT c.company_name,\n       SUM(s.containers) AS containers\nFROM shipments AS s\nJOIN customers AS c ON c.customer_id = s.customer_id\nWHERE s.booking_date >= '2026-01-01'\nGROUP BY c.customer_id, c.company_name\nORDER BY containers DESC\nLIMIT 5;"}</code>
              </pre>
              <p className="flex items-center gap-2 border-t border-line bg-success-bg px-4 py-3 text-[0.875rem] font-medium text-success">
                <CheckCircle2 aria-hidden className="h-4 w-4" /> Correct. Your result matches the expected answer.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="students-title" className="py-16 sm:py-20">
        <div className="container-page">
          <Reveal className="grid gap-8 rounded-2xl border border-line bg-paper p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="kicker">For students · Free</p>
              <h2 id="students-title" className="mt-2 font-serif text-[1.85rem] leading-tight sm:text-[2.25rem]">
                Student Starter
              </h2>
              <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
                Short courses for school, internships and your first job, each with its own badge for your skills profile.
              </p>
              <ButtonLink to="/students" arrow className="mt-6">
                See the Student Starter
              </ButtonLink>
            </div>
            <ul className="flex flex-wrap gap-2 text-[0.875rem]">
              {["ChatGPT for study", "Research online", "CV and LinkedIn", "Portfolio", "Excel", "Canva", "Git and GitHub", "First website", "Python", "Internships"].map((t) => (
                <li key={t} className="rounded-full border border-line bg-ivory px-3 py-1.5 text-ink-soft">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <ConnectSection />

      <section aria-labelledby="cta-title" className="pb-20 sm:pb-24">
        <div className="container-page">
          <Reveal className="flex flex-col items-start gap-6 rounded-2xl bg-night px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="cta-title" className="font-serif text-[1.85rem] leading-tight text-cream sm:text-[2.1rem]">
                Your next skill starts here
              </h2>
              <p className="mt-2 max-w-xl text-[1.0625rem] leading-relaxed text-cream/75">Every course is free to read. Sign up to save your progress and earn badges.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/sign-up" arrow>
                Start learning free
              </ButtonLink>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center rounded-lg border border-cream/25 px-5 py-3 text-[0.9375rem] font-semibold text-cream hover:bg-cream/10"
              >
                Browse courses
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
