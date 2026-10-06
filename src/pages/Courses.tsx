import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Briefcase, GraduationCap, PlayCircle, Search } from "lucide-react";
import type { Course } from "@/content/types";
import { useSeo } from "@/lib/seo";
import { useCourses, useProgrammes } from "@/lib/data";
import { CATEGORIES } from "@/content";
import { CourseCard } from "@/components/CourseCard";
import { TrackCard } from "@/components/TrackCard";
import { breadcrumbs } from "@/lib/schema";
import { LEVELS } from "@/content/tracks";
import { isPaid } from "@/lib/commerce";

const ACCESS = [
  { id: "", label: "All" },
  { id: "free", label: "Free Courses" },
  { id: "professional", label: "Professional Programmes" },
];

const TYPES = [
  { id: "", label: "All types" },
  { id: "full", label: "Full courses" },
  { id: "short", label: "Short courses" },
];

/** The two things the Academy offers, and where the Student Starter fits. Shown above the list so learners can choose. */
const KINDS = [
  {
    Icon: PlayCircle,
    title: "Free Courses",
    time: "Start Learning Free",
    body: "Short, genuinely useful courses that teach one skill at a time, with a badge for what you finish. Free, always.",
    href: "/courses?access=free",
    cta: "Explore free courses",
  },
  {
    Icon: Briefcase,
    title: "Professional Programmes",
    time: "Become a professional",
    body: "Complete, structured programmes: the full curriculum, practical projects, assessments, a capstone and a professional certificate.",
    href: "/courses?access=professional",
    cta: "Explore professional programmes",
  },
  {
    Icon: GraduationCap,
    title: "Student Starter",
    time: "A collection, not a course",
    body: "25 hand-picked skills for school, internships and your first job.",
    href: "/students",
    cta: "Open the Student Starter",
  },
];

const LEVEL_FILTERS = [{ id: "", label: "All levels" }, ...([1, 2, 3, 4] as const).map((l) => ({ id: String(l), label: `${l}. ${LEVELS[l].name}` }))];

function CourseGroup({ id, title, intro, courses }: { id: string; title: string; intro: string; courses: Course[] }) {
  if (!courses.length) return null;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
        <h2 id={`${id}-title`} className="font-serif text-[1.8rem]">
          {title}
        </h2>
        <p className="text-[0.875rem] text-muted">
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </p>
      </div>
      <p className="mt-2 text-muted">{intro}</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  );
}

export default function Courses() {
  useSeo({
    title: "Free Courses and Professional Programmes | CloudTech Academy",
    description: "Free courses in data, AI, careers and coding that help you start learning, and professional programmes in data analytics, data science, business analysis, AI engineering, cloud and software development that help you become a professional.",
    jsonLd: breadcrumbs([["Home", "/"], ["Courses", "/courses"]]),
  });
  const courses = useCourses();
  const tracks = useProgrammes();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [params, setParams] = useSearchParams();
  const access = ACCESS.some((a) => a.id === params.get("access")) ? (params.get("access") as string) : "";
  const setAccess = (id: string) => setParams(id ? { access: id } : {}, { replace: true });

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (!category || c.categoryId === category) &&
        (!level || c.level === Number(level)) &&
        (!type || (type === "short") === (c.format === "short")) &&
        !isPaid(c) &&
        (!term || [c.title, c.summary, ...c.skills].some((s) => s.toLowerCase().includes(term))),
    );
  }, [courses, q, category, level, type, access]);
  const full = results.filter((c) => c.format !== "short");
  const short = results.filter((c) => c.format === "short");
  // Programmes are found by search only: the category, difficulty and type filters describe individual free courses.
  const term = q.trim().toLowerCase();
  const programmes = tracks.filter(
    (t) => isPaid(t) && !category && !level && !type && (!term || [t.title, t.programmeName ?? "", t.outcome, ...t.skills].some((x) => x.toLowerCase().includes(term))),
  );
  const showFree = access !== "professional";
  const showProgrammes = access !== "free";
  const total = (showFree ? results.length : 0) + (showProgrammes ? programmes.length : 0);

  const current = CATEGORIES.filter((c) => !c.future);
  const future = CATEGORIES.filter((c) => c.future);
  const select = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[0.9375rem]";

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-14 sm:py-16">
          <h1 className="font-serif text-[2.6rem] leading-tight sm:text-[3.2rem]">Courses and programmes</h1>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
            Free courses help people start learning. Professional programmes help people become professionals. Start with a free course, then go further when you are
            ready.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {KINDS.map(({ Icon, title, time, body, href, cta }) => (
              <li key={title} className="flex flex-col rounded-2xl border border-line bg-paper p-5">
                <Icon aria-hidden className="h-5 w-5 text-brass-dark" />
                <p className="mt-3 font-serif text-[1.3rem] leading-snug">{title}</p>
                <p className="text-[0.8125rem] font-semibold text-brass-dark">{time}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{body}</p>
                {href.startsWith("#") ? (
                  <a href={href} className="mt-auto pt-4 text-[0.9375rem] font-semibold text-ink hover:text-brass-dark">
                    {cta} →
                  </a>
                ) : (
                  <Link to={href} className="mt-auto pt-4 text-[0.9375rem] font-semibold text-ink hover:text-brass-dark">
                    {cta} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12">
        <div role="tablist" aria-label="Course access" className="mb-6 inline-flex rounded-full border border-line-strong bg-paper p-1">
          {ACCESS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={access === a.id}
              onClick={() => setAccess(a.id)}
              className={`rounded-full px-4 py-1.5 text-[0.875rem] font-semibold ${access === a.id ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_12rem_12rem]">
          <div>
            <label htmlFor="course-search" className="text-[0.875rem] font-medium">
              Search
            </label>
            <div className="relative mt-1.5">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                id="course-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="SQL, Excel, dashboards…"
                className="block w-full rounded-lg border border-line-strong bg-paper py-2.5 pl-9 pr-3 text-[0.9375rem]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="course-type" className="text-[0.875rem] font-medium">
              Type
            </label>
            <select id="course-type" value={type} onChange={(e) => setType(e.target.value)} className={select}>
              {TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="course-category" className="text-[0.875rem] font-medium">
              Category
            </label>
            <select id="course-category" value={category} onChange={(e) => setCategory(e.target.value)} className={select}>
              <option value="">All categories</option>
              {current.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="course-level" className="text-[0.875rem] font-medium">
              Difficulty
            </label>
            <select id="course-level" value={level} onChange={(e) => setLevel(e.target.value)} className={select}>
              {LEVEL_FILTERS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <p aria-live="polite" className="mt-6 text-[0.875rem] text-muted">
          {total} {total === 1 ? "result" : "results"}
        </p>
        {total > 0 ? (
          <div className="mt-4 space-y-14">
            {showFree && (full.length > 0 || short.length > 0) && (
              <div className="space-y-12">
                <div>
                  <h2 className="font-serif text-[2.2rem] leading-tight">Free Courses</h2>
                  <p className="mt-1 max-w-2xl text-muted">Start learning free. Each course teaches a useful skill on its own, and every one ends with a badge.</p>
                </div>
                <CourseGroup id="professional" title="In-depth free courses" intro="Job skills taught properly, with hands-on practice, a final assessment and a project." courses={full} />
                <CourseGroup id="short" title="Short free courses" intro="Quick, practical skills in modules of 15 to 40 minutes. Do the tasks, pass the check, and earn a badge for each module." courses={short} />
              </div>
            )}
            {showProgrammes && programmes.length > 0 && (
              <section id="programmes" aria-labelledby="programmes-title" className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                  <h2 id="programmes-title" className="font-serif text-[2.2rem] leading-tight">
                    Professional Programmes
                  </h2>
                  <p className="text-[0.875rem] text-muted">{programmes.length} programmes</p>
                </div>
                <p className="mt-2 max-w-2xl text-muted">
                  Complete, structured programmes with the full curriculum, projects, assessments, a capstone and a professional certificate. The free courses inside each one stay
                  free.
                </p>
                <ul className="mt-5 grid gap-5 md:grid-cols-2">
                  {programmes.map((t) => (
                    <li key={t.id}>
                      <TrackCard track={t} courses={courses} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-line-strong p-10 text-center">
            <p className="font-serif text-[1.3rem]">No courses match those filters yet.</p>
            <button
              type="button"
              className="mt-3 text-[0.9rem] font-semibold text-brass-dark hover:text-brass-deeper"
              onClick={() => {
                setQ("");
                setCategory("");
                setLevel("");
                setType("");
                setAccess("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <section aria-labelledby="future-title" className="mt-16 border-t border-line pt-10">
          <h2 id="future-title" className="font-serif text-[1.6rem]">
            Coming later
          </h2>
          <p className="mt-2 max-w-2xl text-muted">Subjects we plan to add once the Data Analyst path is complete. No dates yet.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {future.map((c) => (
              <li key={c.id} className="rounded-full border border-line-strong px-3.5 py-1.5 text-[0.875rem] text-muted">
                {c.name}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
