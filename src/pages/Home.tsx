import { ConnectSection } from "@/components/CommunityWidgets";
import { Link } from "react-router";
import { ArrowRight, Award, BookOpen, Bot, CheckCircle2, Code2, FolderKanban, GraduationCap, LineChart, PencilLine, type LucideIcon } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourses } from "@/lib/data";
import { ButtonLink } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { Reveal } from "@/components/Reveal";
import { webSiteJsonLd } from "@/lib/schema";
import { isPaid } from "@/lib/commerce";
import { DIVISIONS } from "@/content/catalog";

/** Courses we suggest to someone arriving with no experience. All are free. */
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

/** What a visitor might want, each pointing at a free course to start with. */
const GOALS: { icon: LucideIcon; title: string; body: string; course: string; cta: string }[] = [
  { icon: LineChart, title: "Work with data", body: "Spreadsheets, SQL and dashboards: the skills behind almost every analyst job.", course: "data-analytics-foundations", cta: "Start with data basics" },
  { icon: Code2, title: "Learn to code", body: "Python, Git and your first website, from the very first line.", course: "python-for-beginners", cta: "Start with Python" },
  { icon: Bot, title: "Use AI at work", body: "Prompting, ChatGPT and Claude, used well and with your own judgement.", course: "ai-productivity-fundamentals", cta: "Start with AI tools" },
  { icon: GraduationCap, title: "Get ready for work", body: "A CV that gets read, a LinkedIn profile, and your first internship.", course: "career-essentials", cta: "Start with your CV" },
];

/** The hero's picture: a lesson in progress, the practice check and a badge earned, drawn in code. */
function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[34rem] pb-10 lg:pb-0">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1E1D1B] p-6 pb-8 shadow-[0_40px_80px_-40px_rgba(23,23,23,0.7)] sm:p-8 sm:pb-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C9A45C]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#C9A45C]/15 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-[#C9A45C]">Lesson 3 of 8</p>
          <p className="text-[0.75rem] text-[#E6DECB]/70">12 min</p>
        </div>
        <p className="relative mt-3 font-serif text-[1.6rem] leading-tight text-white sm:text-[1.9rem]">Filter your data with WHERE</p>
        <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[38%] rounded-full bg-[#C9A45C]" />
        </div>
        <div className="relative mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[0.6875rem] text-[#E6DECB]/70">
            <span>Practice</span>
            <span className="rounded bg-[#C9A45C] px-2 py-0.5 font-semibold text-[#1E1D1B]">Run and check</span>
          </div>
          <pre className="overflow-hidden px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-[#E6DECB]">{"SELECT customer, total\nFROM orders\nWHERE total > 50000\nORDER BY total DESC;"}</pre>
          <p className="flex items-center gap-2 border-t border-white/10 bg-[#1f3a2a] px-4 py-2.5 text-[0.75rem] font-medium text-[#8fd6a8]">
            <CheckCircle2 className="h-4 w-4" /> Correct. Your result matches.
          </p>
        </div>
        <ul className="relative mt-5 grid grid-cols-3 gap-2 text-center text-[0.6875rem] text-[#E6DECB]/80">
          {["Learn it", "Try it", "Get a badge"].map((t, i) => (
            <li key={t} className={`rounded-lg border px-2 py-2 ${i < 2 ? "border-[#C9A45C]/40 bg-[#C9A45C]/10 text-[#E8CF96]" : "border-white/10 bg-white/5"}`}>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute -bottom-3 left-3 w-52 rounded-xl border border-line bg-paper p-4 shadow-[0_20px_40px_-24px_rgba(23,32,51,0.45)] sm:-left-6 lg:-bottom-6">
        <div className="flex items-center justify-between text-[0.75rem]">
          <span className="font-medium text-muted">Your progress</span>
          <span className="font-semibold text-ink">38%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
          <div className="h-full w-[38%] rounded-full bg-brass" />
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
    title: "CloudTech Academy | Learn Data, Analytics & Technology for Free",
    description: "Free, practical courses in data, analytics, AI and technology from CloudTech Analytics. Learn step by step, practise in your browser, earn badges and build projects.",
    jsonLd: webSiteJsonLd(),
  });
  const all = useCourses();
  const courses = all.filter((c) => !isPaid(c));
  const lessons = courses.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);
  const starters = STARTING_COURSES.map((id) => courses.find((c) => c.id === id)).filter((c) => c !== undefined);

  return (
    <>
      <section className="border-b border-line bg-paper" style={{ backgroundImage: "radial-gradient(60rem 28rem at 85% -10%, rgba(201,164,92,0.16), transparent 60%)" }}>
        <div className="container-page grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-brass-pale px-3 py-1 text-[0.8125rem] font-semibold text-brass-dark">Free courses in data, AI and technology</p>
            <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.08] tracking-[-0.025em] sm:text-[3.4rem]">
              Learn a skill that gets you <span className="text-brass-accent">noticed.</span> Start free today.
            </h1>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-muted sm:text-[1.125rem]">
              Short, clear lessons you can finish in an evening. Practise in your browser, get instant feedback, and earn badges you can show on your CV and LinkedIn. No experience
              needed, and nothing to install.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/sign-up" arrow>
                Start learning free
              </ButtonLink>
              <ButtonLink to="/courses" variant="secondary">
                Browse free courses
              </ButtonLink>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.875rem] text-muted">
              {["Free to start", "Learn at your own pace", "Badges you can share"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 aria-hidden className="h-4 w-4 text-brass-dark" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      <section aria-label="The Academy in numbers" className="border-b border-line">
        <dl className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {[
            [String(courses.length), "free courses"],
            [String(lessons), "lessons"],
            ["Instant", "feedback on practice"],
            ["Free", "badge for every module"],
          ].map(([n, label]) => (
            <div key={label} className="text-center sm:text-left">
              <dt className="sr-only">{label}</dt>
              <dd className="font-serif text-[1.75rem] leading-none text-ink [font-variant-numeric:lining-nums]">{n}</dd>
              <dd className="mt-1.5 text-[0.875rem] text-muted">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="goals-title" className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading id="goals-title" kicker="Where do you want to start?" title="Pick what you want to get better at" intro="Choose a goal and open a free course that fits. You can change your mind any time." />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GOALS.map((g, i) => {
              const c = courses.find((x) => x.id === g.course);
              return (
                <Reveal as="li" key={g.title} delay={(i % 4) * 60} className="h-full">
                  <Link
                    to={c ? `/courses/${c.slug}` : "/courses"}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-[border-color,box-shadow] duration-200 hover:border-brass/60 hover:shadow-[0_12px_32px_-20px_rgba(23,32,51,0.35)]"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brass-pale text-brass-dark">
                      <g.icon aria-hidden className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-serif text-[1.25rem] leading-snug text-ink">{g.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{g.body}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.875rem] font-semibold text-brass-dark">
                      {g.cta} <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="areas-title" className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            id="areas-title"
            kicker="Learn Skills. Build Careers. Create Opportunities."
            title="Learning for the real world"
            intro="From data and technology to business, trade and professional skills, CloudTech Academy provides practical learning designed for the real world."
            link={{ to: "/courses", label: "Explore all courses" }}
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DIVISIONS.map((d, i) => (
              <Reveal as="li" key={d.id} delay={(i % 4) * 60} className="h-full">
                <Link to={`/courses?area=${d.id}`} className="group flex h-full flex-col rounded-2xl border border-line bg-ivory p-6 transition-[border-color,box-shadow] duration-200 hover:border-brass/60 hover:shadow-[0_12px_32px_-20px_rgba(23,32,51,0.35)]">
                  <h3 className="font-serif text-[1.25rem] leading-snug text-ink">{d.name}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{d.blurb}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.875rem] font-semibold text-brass-dark">
                    Explore <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-title" className="bg-ivory py-16 sm:py-20">
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
            intro="New to data or technology? These free courses assume no experience."
            link={{ to: "/courses", label: `Browse all ${courses.length} free courses` }}
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
              The SQL course comes with a practice database for a logistics company: thousands of shipments, customers and payments. Run your query and find out straight away
              whether your answer is right. Nothing to install.
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
              <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-muted">Short courses for school, internships and your first job, each with its own badge for your skills profile.</p>
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
              <p className="mt-2 max-w-xl text-[1.0625rem] leading-relaxed text-cream/75">Create a free account to save your progress and earn badges. It takes a minute.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/sign-up" arrow>
                Start learning free
              </ButtonLink>
              <Link to="/courses" className="inline-flex items-center justify-center rounded-lg border border-cream/25 px-5 py-3 text-[0.9375rem] font-semibold text-cream hover:bg-cream/10">
                Browse courses
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
