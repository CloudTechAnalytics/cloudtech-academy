import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Clock, Database, Download, FileSpreadsheet, Search, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getBackend, type PracticeSubmission } from "@/lib/backend";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { DATASETS, PRACTICE_PROJECTS, TOOLS, datasetTotals, datasetZipUrl, formatBytes, type PracticeProject, type Tool } from "@/content/projects";
import { ProjectCover } from "@/components/ProjectCover";

type Filter = "all" | Tool | "Beginner";

function ProjectCard({ project, mine }: { project: PracticeProject; mine?: PracticeSubmission }) {
  const t = datasetTotals(project.dataset);
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[0_24px_48px_-32px_rgba(23,23,23,0.45)]"
    >
      <span className="relative block">
        <ProjectCover cover={project.cover} className="h-28 w-full" />
        {mine && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-paper/95 px-2.5 py-1 text-[0.75rem] font-semibold text-ink shadow-sm">
            {mine.passed ? (
              <>
                <Trophy aria-hidden className="h-3.5 w-3.5 text-success" /> Badge earned
              </>
            ) : (
              `Submitted · ${mine.correct}/${mine.total}`
            )}
          </span>
        )}
      </span>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-[1.25rem] leading-snug text-ink group-hover:text-brass-dark">{project.title}</h3>
        <p className="mt-1 text-[0.8125rem] text-muted">
          {project.company} · {project.industry}
        </p>
        <p className="mt-3 line-clamp-3 text-[0.9063rem] leading-relaxed text-muted">{project.summary}</p>
        <p className="mt-4 text-[0.8125rem] text-subtle">
          {project.level} · About {project.hours} hours
        </p>
        <p className="mt-0.5 text-[0.8125rem] text-subtle">
          {t.files} {t.files === 1 ? "file" : "files"} (CSV) · {t.rows.toLocaleString("en-GB")} rows · {formatBytes(t.bytes)}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-4">
          {project.skills.map((s) => (
            <span key={s} className="rounded-full border border-line-strong px-2.5 py-0.5 text-[0.75rem] font-medium text-ink">
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function Projects() {
  useSeo({
    title: "Practice Projects & Datasets | CloudTech Academy",
    description:
      "Free data analysis practice projects with downloadable datasets: logistics, sales, pricing, data cleaning, law firm operations and HR. Work them in SQL, Excel, Power BI or Python.",
    jsonLd: breadcrumbs([["Projects", "/projects"]]),
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const auth = useAuth();
  const [mine, setMine] = useState<PracticeSubmission[]>([]);
  useEffect(() => {
    if (auth.status !== "signed-in") return;
    void getBackend()
      .then((b) => b.listMyPracticeSubmissions())
      .then(setMine)
      .catch(() => {});
  }, [auth.status]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRACTICE_PROJECTS.filter((p) => {
      if (filter === "Beginner" ? p.level !== "Beginner" : filter !== "all" && !p.skills.includes(filter)) return false;
      if (!q) return true;
      return [p.title, p.summary, p.company, p.industry, ...p.skills, ...p.questions].join(" ").toLowerCase().includes(q);
    });
  }, [query, filter]);

  const chips: { id: Filter; label: string }[] = [{ id: "all", label: "All projects" }, ...TOOLS.map((t) => ({ id: t, label: t })), { id: "Beginner", label: "Beginner friendly" }];
  const totalRows = DATASETS.reduce((n, d) => n + datasetTotals(d.id).rows, 0);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-14 sm:py-16">
          <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="kicker">Projects</p>
              <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">Practise on business-shaped data.</h1>
              <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-muted sm:text-[1.125rem]">
                Real-world briefs from fictional businesses, each with its own dataset, the questions a manager would ask, and starter code. Download the data,
                work it in SQL, Excel, Power BI or Python, then submit your work to earn a project badge.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-3">
              {[
                { label: "Projects", value: PRACTICE_PROJECTS.length },
                { label: "Datasets", value: DATASETS.length },
                { label: "Rows of data", value: totalRows.toLocaleString("en-GB") },
              ].map((s) => (
                <div key={s.label} className="flex flex-col-reverse rounded-xl border border-line bg-paper p-4">
                  <dt className="mt-1 text-[0.8125rem] text-muted">{s.label}</dt>
                  <dd className="font-serif text-[1.6rem] leading-none sm:text-[1.9rem]">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10">
            <label className="relative block">
              <span className="sr-only">Search projects</span>
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, businesses or skills"
                className="w-full rounded-full border border-line-strong bg-paper py-3 pr-5 pl-12 text-[1rem] text-ink placeholder:text-subtle/80 focus:border-ink/60 focus:outline-2 focus:outline-offset-2 focus:outline-brass-dark"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
              {chips.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-[0.875rem] font-medium transition-colors ${filter === c.id ? "border-ink bg-ink text-ivory" : "border-line-strong bg-paper text-ink hover:border-ink/50"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12" aria-labelledby="projects-title">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="projects-title" className="font-serif text-[1.6rem]">
            {filter === "all" && !query ? "All projects" : "Matching projects"}
          </h2>
          <p className="text-[0.875rem] text-muted" aria-live="polite">
            {shown.length} of {PRACTICE_PROJECTS.length}
          </p>
        </div>
        {shown.length ? (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} mine={mine.find((m) => m.projectId === p.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-line bg-paper p-8 text-center text-muted">
            No projects match.{" "}
            <button
              type="button"
              className="font-semibold text-brass-dark"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Show all projects
            </button>
          </div>
        )}
      </section>

      <section className="border-t border-line bg-paper/60" aria-labelledby="datasets-title">
        <div className="container-page py-12">
          <h2 id="datasets-title" className="flex items-center gap-2 font-serif text-[1.6rem]">
            <Database aria-hidden className="h-5 w-5 text-brass-dark" /> Datasets
          </h2>
          <p className="mt-1.5 max-w-2xl text-muted">Every dataset is free to download and use in your portfolio. Open a project to see what each column means.</p>
          <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-paper">
            {DATASETS.map((d) => {
              const t = datasetTotals(d.id);
              const used = PRACTICE_PROJECTS.filter((p) => p.dataset === d.id);
              return (
                <li key={d.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-semibold">
                      <FileSpreadsheet aria-hidden className="h-4 w-4 shrink-0 text-brass-dark" /> {d.name}
                    </p>
                    <p className="mt-1 text-[0.875rem] text-muted">
                      {t.files} {t.files === 1 ? "file" : "files"} · {t.rows.toLocaleString("en-GB")} rows · {formatBytes(t.bytes)}
                      {used.length > 0 && (
                        <>
                          {" · Used in "}
                          {used.map((p, i) => (
                            <span key={p.id}>
                              {i > 0 && ", "}
                              <Link to={`/projects/${p.id}`} className="font-medium text-brass-dark hover:text-ink">
                                {p.title}
                              </Link>
                            </span>
                          ))}
                        </>
                      )}
                    </p>
                  </div>
                  <a
                    href={datasetZipUrl(d.id)}
                    download
                    className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-line-strong px-3.5 py-2 text-[0.875rem] font-semibold hover:border-ink/50 sm:self-center"
                  >
                    <Download aria-hidden className="h-4 w-4" /> Download ZIP
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 flex items-center gap-2 text-[0.875rem] text-muted">
            <Clock aria-hidden className="h-4 w-4 shrink-0" /> More projects are on the way. All companies and data are made up for learning; any resemblance to
            a real business is a coincidence.
          </p>
        </div>
      </section>
    </>
  );
}
