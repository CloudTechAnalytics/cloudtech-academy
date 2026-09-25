import { Link } from "react-router";
import { Download } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { DATASETS, PRACTICE_PROJECTS, datasetUrl } from "@/content/projects";
import { findCourseDef } from "@/content/catalog";
import { Badge } from "@/components/CourseCard";

export default function Projects() {
  useSeo({
    title: "Practice Projects & Datasets | CloudTech Academy",
    description: "Free practice projects and downloadable datasets for SQL, Excel and Power BI: logistics, sales, law firm operations and HR.",
    jsonLd: breadcrumbs([["Projects", "/projects"]]),
  });
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-4xl py-16 sm:py-20">
          <p className="kicker">Projects</p>
          <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">Practise on business-shaped data.</h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">
            Four fictional businesses, each with its own dataset and a set of questions a manager would actually ask. Download the CSV files and answer them in SQL, Excel or Power BI, then add the work to your portfolio.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          {PRACTICE_PROJECTS.map((p) => {
            const d = DATASETS.find((x) => x.id === p.dataset)!;
            return (
              <article key={p.id} id={p.id} className="flex scroll-mt-24 flex-col rounded-2xl border border-line bg-paper p-6 sm:p-7">
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
                <h2 className="mt-4 font-serif text-[1.55rem] leading-snug">{p.title}</h2>
                <p className="mt-2 text-[0.9688rem] leading-relaxed text-muted">{p.summary}</p>
                <h3 className="mt-5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">Questions to answer</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem] marker:text-brass">
                  {p.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
                <h3 className="mt-5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">Dataset: {d.name}</h3>
                <p className="mt-1 text-[0.875rem] text-muted">{d.description}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {d.files.map((f) => (
                    <li key={f}>
                      <a
                        href={datasetUrl(d.id, f)}
                        download
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-[0.8125rem] font-medium hover:border-ink/40"
                        aria-label={`Download ${f}.csv from the ${d.name} dataset`}
                      >
                        <Download aria-hidden className="h-3.5 w-3.5" /> {f}.csv
                      </a>
                    </li>
                  ))}
                </ul>
                {p.courseSlug && (
                  <p className="mt-auto pt-6 text-[0.875rem]">
                    This data is used throughout{" "}
                    <Link to={`/courses/${p.courseSlug}`} className="font-semibold text-brass-dark">
                      {findCourseDef(p.courseSlug)?.title ?? "a course"}
                    </Link>
                    , with guided lessons and a final project.
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <p className="mt-10 max-w-3xl text-[0.875rem] text-muted">
          All four companies and their data are made up for learning. Any resemblance to a real business is a coincidence. You're free to use the datasets and your analysis in a portfolio.
        </p>
      </section>
    </>
  );
}
