import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourses } from "@/lib/data";
import { CATEGORIES } from "@/content";
import { CourseCard } from "@/components/CourseCard";
import { breadcrumbs } from "@/lib/schema";

const LEVELS = [
  { id: "", label: "All levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export default function Courses() {
  useSeo({
    title: "Courses | CloudTech Academy",
    description: "Free, practical courses in data analytics, SQL, Excel and Power BI. Read, practise on real-looking data, and earn a certificate.",
    jsonLd: breadcrumbs([["Home", "/"], ["Courses", "/courses"]]),
  });
  const courses = useCourses();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (!category || c.categoryId === category) &&
        (!level || c.difficulty === level) &&
        (!term || [c.title, c.summary, ...c.skills].some((s) => s.toLowerCase().includes(term))),
    );
  }, [courses, q, category, level]);

  const current = CATEGORIES.filter((c) => !c.future);
  const future = CATEGORIES.filter((c) => c.future);
  const select = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[0.9375rem]";

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-14 sm:py-16">
          <h1 className="font-serif text-[2.6rem] leading-tight sm:text-[3.2rem]">Courses</h1>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
            Every course is free, self-paced and built around business problems, with practice on realistic company data and a certificate you can verify.
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-[1fr_12rem_12rem]">
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
              {LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <p aria-live="polite" className="mt-6 text-[0.875rem] text-muted">
          {results.length} course{results.length === 1 ? "" : "s"}
        </p>
        {results.length ? (
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {results.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
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
