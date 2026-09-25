import { Link } from "react-router";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { useCourses } from "@/lib/data";
import { Badge } from "@/components/CourseCard";
import { ButtonLink } from "@/components/Button";

const PATH = {
  title: "Data Analyst Foundation",
  summary:
    "The order we recommend if you're starting out in data analysis. It moves from how analysis works, to the tools most teams use every day, to designing data models, to a full project you can show an employer.",
  steps: [
    { slug: "data-analytics-foundations", why: "How analysis works: questions, data types, cleaning, and telling the story." },
    { slug: "excel-for-data-analysis", why: "The tool almost every business already uses, from formulas to pivot tables." },
    { slug: "sql-for-data-analysis", why: "Pull and summarise data straight from a database." },
    { slug: "data-modelling", why: "Design the tables, keys and star schemas that reliable reports are built on." },
    { slug: "power-bi-fundamentals", why: "Turn the numbers into dashboards people can use." },
  ],
  capstone: { title: "Portfolio project", why: "Answer a real business question end to end with one of the practice datasets.", to: "/projects" },
};

export default function Paths() {
  useSeo({
    title: "Learning Paths | CloudTech Academy",
    description: "Follow the Data Analyst Foundation path: data analytics foundations, Excel, SQL, data modelling and Power BI, finishing with a portfolio project.",
    jsonLd: breadcrumbs([["Learning Paths", "/paths"]]),
  });
  const courses = useCourses();

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-4xl py-16 sm:py-20">
          <p className="kicker">Learning paths</p>
          <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">{PATH.title}</h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">{PATH.summary}</p>
        </div>
      </section>

      <section className="container-page max-w-4xl py-14">
        <ol className="relative">
          {PATH.steps.map((s, i) => {
            const c = courses.find((x) => x.slug === s.slug);
            if (!c) return null;
            const available = c.status === "available";
            return (
              <li key={s.slug} className="relative flex gap-5 pb-10 sm:gap-7">
                <span aria-hidden className="absolute top-12 bottom-0 left-[1.3rem] w-px bg-line-strong" />
                <span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-serif text-[1.1rem] ${available ? "border-brass bg-brass-pale text-brass-dark" : "border-line-strong bg-paper text-muted"}`}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border border-line bg-paper p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={available ? "free" : "soon"}>{available ? "Available now" : "Coming soon"}</Badge>
                    <span className="text-[0.8125rem] text-muted">{c.levelLabel}</span>
                  </div>
                  <h2 className="mt-3 font-serif text-[1.45rem] leading-snug">
                    <Link to={`/courses/${c.slug}`} className="hover:text-brass-dark">
                      {c.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-[0.9688rem] leading-relaxed text-muted">{s.why}</p>
                </div>
              </li>
            );
          })}
          <li className="relative flex gap-5 sm:gap-7">
            <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-[1.1rem] text-ivory">★</span>
            <div className="min-w-0 flex-1 rounded-2xl border border-line-strong bg-paper p-5 sm:p-6">
              <h2 className="font-serif text-[1.45rem] leading-snug">{PATH.capstone.title}</h2>
              <p className="mt-2 text-[0.9688rem] leading-relaxed text-muted">{PATH.capstone.why}</p>
              <Link to={PATH.capstone.to} className="mt-3 inline-block text-[0.9375rem] font-semibold text-brass-dark">
                See the practice projects
              </Link>
            </div>
          </li>
        </ol>

        <div className="mt-14 rounded-2xl border border-line bg-sand/50 p-6 sm:p-8">
          <h2 className="font-serif text-[1.5rem]">Where to start today</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Every course in the path is open. If you're new to data, start at step 1. If you already use spreadsheets at work, you can begin with SQL or Power BI; each course stands on its own.
          </p>
          <div className="mt-5">
            <ButtonLink to="/courses/data-analytics-foundations" arrow>
              Start with Data Analytics Foundations
            </ButtonLink>
          </div>
        </div>

        <p className="mt-10 text-[0.9375rem] text-muted">More paths, such as Data Science and Business Intelligence, will follow once their courses exist.</p>
      </section>
    </>
  );
}
