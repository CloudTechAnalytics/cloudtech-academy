import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourses, useProgrammes } from "@/lib/data";
import { CATEGORIES, DIVISIONS, divisionOf } from "@/content/catalog";
import { PATHWAYS } from "@/content/pathways";
import { CourseCard } from "@/components/CourseCard";
import { PathwayStrip } from "@/components/PathwayStrip";
import { TrackCard } from "@/components/TrackCard";
import { breadcrumbs } from "@/lib/schema";
import { isPaid } from "@/lib/commerce";
import { DURATIONS, durationBucket, inCatalogue, matchesLevel } from "@/lib/catalogue";

const AREAS = [{ id: "", name: "All Courses" }, ...DIVISIONS.map((d) => ({ id: d.id, name: d.name }))];
const PRICES = [
  { id: "", label: "Free and paid" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];
const LEVELS = [
  { id: "", label: "All levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
];

const select = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[0.9375rem]";

export default function Courses() {
  useSeo({
    title: "Courses: Data, Business, Trade and Professional Skills | CloudTech Academy",
    description:
      "Practical learning from CloudTech Academy: free courses in data, AI and technology, and professional courses in business, import and export, procurement, logistics, supply chain, project management, HR, customer service, administration and bookkeeping.",
    jsonLd: breadcrumbs([["Home", "/"], ["Courses", "/courses"]]),
  });
  const all = useCourses();
  const programmes = useProgrammes();
  const [urlParams, setParams] = useSearchParams();
  // The prerendered page has no filters in it, so the first render ignores the address and the filters apply straight after,
  // which keeps the page matching what the server sent.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const params = useMemo(() => (mounted ? urlParams : new URLSearchParams()), [mounted, urlParams]);
  const get = (k: string) => params.get(k) ?? "";
  const area = AREAS.some((a) => a.id === get("area")) ? get("area") : "";
  // "access=professional" is the older link to the programmes; it still works.
  const programmesOnly = get("access") === "professional";
  const access = PRICES.some((p) => p.id === get("access")) ? get("access") : "";
  const level = LEVELS.some((l) => l.id === get("level")) ? get("level") : "";
  const duration = DURATIONS.some((d) => d.id === get("duration")) ? get("duration") : "";
  const category = get("category");
  const q = get("q");
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const courses = useMemo(() => all.filter(inCatalogue), [all]);
  const term = q.trim().toLowerCase();
  const results = useMemo(
    () =>
      courses.filter(
        (c) =>
          (!area || divisionOf(c.categoryId).id === area) &&
          (!category || c.categoryId === category) &&
          (!access || (access === "paid") === isPaid(c)) &&
          (!level || matchesLevel(c, level as "beginner" | "intermediate")) &&
          (!duration || durationBucket(c) === duration) &&
          (!term || [c.title, c.summary, ...c.skills].some((s) => s.toLowerCase().includes(term))),
      ),
    [courses, area, category, access, level, duration, term],
  );
  // Free courses first, then the rest in catalogue order.
  const ordered = useMemo(() => [...results].sort((a, b) => Number(isPaid(a)) - Number(isPaid(b))), [results]);
  const counts = (id: string) => courses.filter((c) => !id || divisionOf(c.categoryId).id === id).length;

  const showProgrammes = (!area || area === "data-tech") && access !== "free" && !level && !duration && !category;
  const matchProgrammes = programmes.filter((t) => isPaid(t) && (!term || [t.title, t.programmeName ?? "", t.outcome, ...t.skills].some((x) => x.toLowerCase().includes(term))));
  const pathways = PATHWAYS.filter((p) => !area || p.divisionId === area);
  const showPathways = !programmesOnly && !term && !level && !duration && !category && !access && (area === "" || area === "trade" || area === "business");
  const categories = CATEGORIES.filter((c) => !c.future && (!area || divisionOf(c.id).id === area));
  const future = CATEGORIES.filter((c) => c.future);
  const total = (programmesOnly ? 0 : ordered.length) + (showProgrammes || programmesOnly ? matchProgrammes.length : 0);
  const anyFilter = !!(area || category || access || level || duration || q);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-14 sm:py-16">
          <p className="kicker">Practical learning. Professional skills. Real-world outcomes.</p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.02em] sm:text-[3.2rem]">Learn Skills. Build Careers. Create Opportunities.</h1>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
            From data and technology to business, trade and professional skills, CloudTech Academy provides practical learning designed for the real world. Start with a free course, then go further
            with a professional one when you are ready.
          </p>
          <p className="mt-4 text-[0.9375rem]">
            In school or just starting out?{" "}
            <Link to="/students" className="font-semibold text-brass-dark hover:text-ink">
              Open the Student Starter →
            </Link>
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12">
        <div role="tablist" aria-label="Area" className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
          {AREAS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={area === a.id}
              onClick={() => {
                const next = new URLSearchParams(params);
                if (a.id) next.set("area", a.id);
                else next.delete("area");
                next.delete("category");
                next.delete("access");
                setParams(next, { replace: true });
              }}
              className={`shrink-0 rounded-full border px-4 py-2 text-[0.875rem] font-semibold ${area === a.id && !programmesOnly ? "border-ink bg-ink text-paper" : "border-line-strong bg-paper text-muted hover:text-ink"}`}
            >
              {a.name} <span className={area === a.id ? "opacity-70" : "text-subtle"}>({counts(a.id)})</span>
            </button>
          ))}
        </div>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
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
                onChange={(e) => set("q", e.target.value)}
                placeholder="Excel, import, sales…"
                className="block w-full rounded-lg border border-line-strong bg-paper py-2.5 pl-9 pr-3 text-[0.9375rem]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="f-price" className="text-[0.875rem] font-medium">
              Price
            </label>
            <select id="f-price" value={programmesOnly ? "" : access} onChange={(e) => set("access", e.target.value)} className={select}>
              {PRICES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-level" className="text-[0.875rem] font-medium">
              Level
            </label>
            <select id="f-level" value={level} onChange={(e) => set("level", e.target.value)} className={select}>
              {LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-duration" className="text-[0.875rem] font-medium">
              Duration
            </label>
            <select id="f-duration" value={duration} onChange={(e) => set("duration", e.target.value)} className={select}>
              {DURATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-category" className="text-[0.875rem] font-medium">
              Category
            </label>
            <select id="f-category" value={category} onChange={(e) => set("category", e.target.value)} className={select}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
            {!programmesOnly && ordered.length > 0 && (
              <section aria-labelledby="courses-title">
                <h2 id="courses-title" className="sr-only">
                  Courses
                </h2>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {ordered.map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
                </div>
              </section>
            )}

            {showPathways && (
              <section aria-labelledby="paths-title" className="space-y-5">
                <div>
                  <h2 id="paths-title" className="font-serif text-[1.8rem] leading-tight">
                    Learning pathways
                  </h2>
                  <p className="mt-1 max-w-2xl text-muted">Not sure what to learn next? Follow a route. Each step stands on its own, so start where you are.</p>
                </div>
                {pathways.map((p) => (
                  <PathwayStrip key={p.id} pathway={p} courses={courses} />
                ))}
              </section>
            )}

            {(showProgrammes || programmesOnly) && matchProgrammes.length > 0 && (
              <section id="programmes" aria-labelledby="programmes-title" className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                  <h2 id="programmes-title" className="font-serif text-[2rem] leading-tight">
                    Professional Programmes
                  </h2>
                  <p className="text-[0.875rem] text-muted">{matchProgrammes.length} programmes</p>
                </div>
                <p className="mt-2 max-w-2xl text-muted">
                  Complete, structured programmes in data, AI, cloud and software: the full curriculum, projects, assessments, a capstone and a professional certificate. The free courses inside each one
                  stay free.
                </p>
                <ul className="mt-5 grid gap-5 md:grid-cols-2">
                  {matchProgrammes.map((t) => (
                    <li key={t.id}>
                      <TrackCard track={t} courses={all} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-line-strong p-10 text-center">
            <p className="font-serif text-[1.3rem]">No courses match those filters yet.</p>
            {anyFilter && (
              <button type="button" className="mt-3 text-[0.9rem] font-semibold text-brass-dark hover:text-brass-deeper" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </button>
            )}
          </div>
        )}

        <section aria-labelledby="future-title" className="mt-16 border-t border-line pt-10">
          <h2 id="future-title" className="font-serif text-[1.6rem]">
            Coming later
          </h2>
          <p className="mt-2 max-w-2xl text-muted">Subjects we plan to add. No dates yet.</p>
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
