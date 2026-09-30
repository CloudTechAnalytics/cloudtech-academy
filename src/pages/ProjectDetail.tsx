import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, BookOpen, CalendarDays, Clock, Download, FileSpreadsheet, Gauge, Rows3, Scale, Wrench } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import {
  DATASETS,
  DATASET_META,
  DATA_DICTIONARY,
  PRACTICE_PROJECTS,
  datasetTotals,
  datasetUrl,
  datasetZipUrl,
  findProject,
  formatBytes,
  type ColumnMeta,
  type FileMeta,
  type PracticeProject,
  type Starter,
} from "@/content/projects";
import { findCourseDef } from "@/content/catalog";
import { formatDate } from "@/lib/format";
import { ProjectCover } from "@/components/ProjectCover";
import { CopyButton } from "@/components/sql/SqlParts";
import NotFound from "./NotFound";

const TYPE_LABEL: Record<ColumnMeta["type"], string> = { number: "Number", date: "Date", text: "Text" };

const fmt = (v: number | string | undefined) => (typeof v === "number" ? v.toLocaleString("en-GB") : (v ?? ""));

function columnRange(c: ColumnMeta) {
  if (c.type === "number" || c.type === "date") return `${fmt(c.min)} to ${fmt(c.max)}`;
  return `${c.distinct.toLocaleString("en-GB")} distinct`;
}

/** One file of the dataset: what it is, its columns, a preview and a download link. */
function FileCard({ dataset, name, meta }: { dataset: string; name: string; meta: FileMeta }) {
  const doc = DATA_DICTIONARY[dataset]?.[name];
  const [preview, setPreview] = useState(false);
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-paper">
      <header className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-mono text-[0.9375rem] font-semibold">
            <FileSpreadsheet aria-hidden className="h-4 w-4 shrink-0 text-brass-dark" /> {name}.csv
          </h3>
          <p className="mt-1 text-[0.8125rem] text-muted">
            {meta.rows.toLocaleString("en-GB")} rows · {meta.columns.length} columns · {formatBytes(meta.bytes)}
          </p>
        </div>
        <a
          href={datasetUrl(dataset, name)}
          download
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-line-strong px-3 py-1.5 text-[0.8125rem] font-semibold hover:border-ink/50 sm:self-center"
          aria-label={`Download ${name}.csv`}
        >
          <Download aria-hidden className="h-3.5 w-3.5" /> Download
        </a>
      </header>
      {doc?.about && <p className="px-4 pt-4 text-[0.9375rem] leading-relaxed text-muted sm:px-5">{doc.about}</p>}

      <div className="overflow-x-auto px-4 py-4 sm:px-5">
        <table className="w-full min-w-[34rem] border-collapse text-left text-[0.875rem]">
          <thead>
            <tr className="border-b border-line text-[0.75rem] uppercase tracking-[0.08em] text-muted">
              <th scope="col" className="py-2 pr-3 font-semibold">
                Column
              </th>
              <th scope="col" className="py-2 pr-3 font-semibold">
                Type
              </th>
              <th scope="col" className="py-2 pr-3 font-semibold">
                Description
              </th>
              <th scope="col" className="py-2 pr-3 font-semibold whitespace-nowrap">
                Values
              </th>
              <th scope="col" className="py-2 font-semibold">
                Missing
              </th>
            </tr>
          </thead>
          <tbody>
            {meta.columns.map((c) => (
              <tr key={c.name} className="border-b border-line/70 align-top last:border-0">
                <th scope="row" className="py-2.5 pr-3 font-mono text-[0.8125rem] font-semibold whitespace-nowrap text-ink">
                  {c.name}
                </th>
                <td className="py-2.5 pr-3">
                  <span className="rounded-md bg-sand px-1.5 py-0.5 text-[0.75rem] font-medium text-ink">{TYPE_LABEL[c.type]}</span>
                </td>
                <td className="py-2.5 pr-3 text-muted">{doc?.columns[c.name] ?? ""}</td>
                <td className="py-2.5 pr-3 text-[0.8125rem] whitespace-nowrap text-muted">{columnRange(c)}</td>
                <td className={`py-2.5 text-[0.8125rem] ${c.missing ? "font-semibold text-ink" : "text-subtle"}`}>{c.missing ? c.missing.toLocaleString("en-GB") : "None"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-line px-4 py-3 sm:px-5">
        <button type="button" onClick={() => setPreview(!preview)} aria-expanded={preview} className="text-[0.875rem] font-semibold text-brass-dark hover:text-ink">
          {preview ? "Hide preview" : `Preview the first ${meta.preview.length} rows`}
        </button>
        {preview && (
          <div className="mt-3 overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse text-left font-mono text-[0.75rem]">
              <thead className="bg-sand/60">
                <tr>
                  {meta.columns.map((c) => (
                    <th key={c.name} scope="col" className="px-2.5 py-2 font-semibold whitespace-nowrap">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meta.preview.map((row, i) => (
                  <tr key={i} className="border-t border-line">
                    {row.map((v, j) => (
                      <td key={j} className="px-2.5 py-1.5 whitespace-pre text-muted">
                        {v === "" ? <span className="text-subtle italic">blank</span> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
}

function StarterCard({ starter }: { starter: Starter }) {
  return (
    <article className="rounded-xl border border-line bg-paper p-4 sm:p-5">
      <p className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.75rem] font-semibold text-ivory">{starter.tool}</span>
        <span className="font-semibold">{starter.title}</span>
      </p>
      {starter.code && (
        <div className="relative mt-3">
          <pre className="code-block pr-20">
            <code>{starter.code}</code>
          </pre>
          <div className="absolute top-2 right-2">
            <CopyButton text={starter.code} />
          </div>
        </div>
      )}
      {starter.steps && (
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed marker:text-brass-dark">
          {starter.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      )}
    </article>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32">
      <h2 id={`${id}-title`} className="font-serif text-[1.75rem] leading-tight">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Facts({ project }: { project: PracticeProject }) {
  const t = datasetTotals(project.dataset);
  const rows: [typeof Gauge, string, string][] = [
    [Gauge, "Level", project.level],
    [Clock, "Time", `About ${project.hours} hours`],
    [Wrench, "Tools", project.skills.join(", ")],
    [FileSpreadsheet, "Files", `${t.files} CSV ${t.files === 1 ? "file" : "files"}, ${formatBytes(t.bytes)}`],
    [Rows3, "Rows", t.rows.toLocaleString("en-GB")],
    [CalendarDays, "Updated", formatDate(project.updated)],
    [Scale, "Licence", "Free to use for learning and in your portfolio"],
  ];
  return (
    <dl className="space-y-3">
      {rows.map(([Icon, k, v]) => (
        <div key={k} className="flex gap-3 text-[0.875rem]">
          <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" />
          <div>
            <dt className="text-muted">{k}</dt>
            <dd className="font-medium text-ink">{v}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);
  useSeo({
    title: project ? `${project.title}: Practice Project & Dataset | CloudTech Academy` : "Project not found | CloudTech Academy",
    description: project ? `${project.summary} Free dataset, questions, data dictionary and starter code for ${project.skills.join(", ")}.` : "",
    jsonLd: project ? breadcrumbs([["Projects", "/projects"], [project.title, `/projects/${project.id}`]]) : undefined,
    noindex: !project,
  });
  if (!project) return <NotFound />;

  const dataset = DATASETS.find((d) => d.id === project.dataset)!;
  const meta = DATASET_META[project.dataset];
  const t = datasetTotals(project.dataset);
  const courses = project.courseSlugs.map((s) => findCourseDef(s)).filter((c) => c !== undefined);
  const more = PRACTICE_PROJECTS.filter((p) => p.id !== project.id)
    .sort((a, b) => Number(b.dataset === project.dataset) - Number(a.dataset === project.dataset))
    .slice(0, 3);
  const nav = [
    ["overview", "Overview"],
    ["data", "Data"],
    ["start", "Get started"],
  ];

  return (
    <>
      <div className="container-page pt-8">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-muted hover:text-ink">
          <ArrowLeft aria-hidden className="h-4 w-4" /> All projects
        </Link>
        <ProjectCover cover={project.cover} className="mt-4 h-32 w-full rounded-2xl sm:h-44" />
      </div>

      <header className="container-page pt-8 pb-6">
        <p className="kicker">
          {project.company} · {project.industry}
        </p>
        <h1 className="mt-3 max-w-4xl font-serif text-[2.4rem] leading-[1.06] tracking-[-0.015em] sm:text-[3.1rem]">{project.title}</h1>
        <p className="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-muted sm:text-[1.1875rem]">{project.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={datasetZipUrl(project.dataset)}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-[0.9375rem] font-semibold text-ivory hover:bg-ink/90"
          >
            <Download aria-hidden className="h-4 w-4" /> Download data ({formatBytes(meta?.zipBytes ?? t.bytes)} ZIP)
          </a>
          <div className="flex flex-wrap gap-1.5">
            {project.skills.map((s) => (
              <span key={s} className="rounded-full border border-line-strong px-2.5 py-0.5 text-[0.8125rem] font-medium">
                {s}
              </span>
            ))}
            <span className="rounded-full bg-brass-pale px-2.5 py-0.5 text-[0.8125rem] font-medium text-brass-dark">{project.level}</span>
          </div>
        </div>
      </header>

      <nav aria-label="Project sections" className="sticky top-16 z-20 border-y border-line bg-ivory/95 backdrop-blur">
        <ul className="container-page flex gap-6 overflow-x-auto">
          {nav.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="block border-b-2 border-transparent py-3 text-[0.9375rem] font-medium whitespace-nowrap text-muted hover:border-brass hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
        <div className="min-w-0 space-y-14">
          <Section id="overview" title="Overview">
            <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">The business</h3>
            <div className="mt-2 space-y-3 text-[1rem] leading-relaxed">
              {project.context.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-6 rounded-xl border-l-4 border-brass bg-brass-pale/40 p-5">
              <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-brass-dark">Your brief</h3>
              <p className="mt-2 text-[1rem] leading-relaxed">{project.brief}</p>
            </div>
            <h3 className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">Questions to answer</h3>
            <ol className="mt-3 space-y-2.5">
              {project.questions.map((q, i) => (
                <li key={q} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brass font-serif text-[0.9rem] text-brass-dark">{i + 1}</span>
                  <span className="pt-0.5">{q}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">What to deliver</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed marker:text-brass">
                  {project.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">Suggested approach</h3>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed marker:text-brass-dark">
                  {project.approach.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ol>
              </div>
            </div>
          </Section>

          <Section id="data" title="Data">
            <p className="text-[1rem] leading-relaxed">
              <strong className="font-semibold">{dataset.name}.</strong> {dataset.description}
            </p>
            <p className="mt-2 text-[0.875rem] text-muted">
              {t.files} {t.files === 1 ? "file" : "files"} · {t.rows.toLocaleString("en-GB")} rows in total · {formatBytes(t.bytes)}.{" "}
              <a href={datasetZipUrl(project.dataset)} download className="font-semibold text-brass-dark hover:text-ink">
                Download everything as a ZIP
              </a>
              .
            </p>
            <div className="mt-6 space-y-5">
              {Object.entries(meta?.files ?? {}).map(([name, fm]) => (
                <FileCard key={name} dataset={project.dataset} name={name} meta={fm} />
              ))}
            </div>
          </Section>

          <Section id="start" title="Get started">
            <p className="text-[1rem] leading-relaxed text-muted">
              Starter code to get you going. The Python runs as it is in{" "}
              <a href="https://colab.research.google.com" target="_blank" rel="noreferrer" className="font-medium text-brass-dark hover:text-ink">
                Google Colab
              </a>
              : it loads the data straight from this site. For SQL, import each CSV as a table with the same name as the file.
            </p>
            <div className="mt-5 space-y-5">
              {project.starters.map((s) => (
                <StarterCard key={`${s.tool}-${s.title}`} starter={s} />
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-line bg-sand/50 p-5">
              <h3 className="font-semibold">When you've finished</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">
                Put your work on GitHub with a short README, add it to your portfolio, and share what you found. The{" "}
                <Link to="/courses/git-and-github-for-beginners" className="font-medium text-brass-dark hover:text-ink">
                  Git & GitHub
                </Link>{" "}
                and{" "}
                <Link to="/courses/build-your-student-portfolio" className="font-medium text-brass-dark hover:text-ink">
                  Student Portfolio
                </Link>{" "}
                courses show you how.
              </p>
            </div>
          </Section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <a
              href={datasetZipUrl(project.dataset)}
              download
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-[0.9375rem] font-semibold text-ivory hover:bg-ink/90"
            >
              <Download aria-hidden className="h-4 w-4" /> Download data
            </a>
            <div className="mt-5">
              <Facts project={project} />
            </div>
          </div>

          {courses.length > 0 && (
            <div className="rounded-2xl border border-line bg-paper p-5">
              <h2 className="flex items-center gap-2 text-[0.9375rem] font-semibold">
                <BookOpen aria-hidden className="h-4 w-4 text-brass-dark" /> Learn the skills
              </h2>
              <ul className="mt-3 space-y-2 text-[0.9375rem]">
                {courses.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/courses/${c.slug}`} className="font-medium text-brass-dark hover:text-ink">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="text-[0.9375rem] font-semibold">More projects</h2>
            <ul className="mt-3 space-y-3">
              {more.map((p) => (
                <li key={p.id}>
                  <Link to={`/projects/${p.id}`} className="group flex items-center gap-3 rounded-xl border border-line bg-paper p-2.5 hover:border-line-strong">
                    <ProjectCover cover={p.cover} className="h-12 w-16 shrink-0 rounded-lg" />
                    <span className="min-w-0">
                      <span className="block text-[0.875rem] leading-snug font-semibold group-hover:text-brass-dark">{p.title}</span>
                      <span className="block text-[0.75rem] text-muted">{p.skills.join(" · ")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
