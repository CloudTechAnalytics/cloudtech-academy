import { enrolmentState, isPaid, priceLabel } from "@/lib/commerce";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { DIVISIONS, divisionOf } from "@/content/catalog";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { CATEGORIES, categoryName } from "@/content";
import type { Course } from "@/content/types";
import { Badge } from "@/components/CourseCard";
import { Button } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { courseInput, slugOk, useAdminCourses } from "./useAdmin";

export default function AdminCourses() {
  const { data: courses, error, reload } = useAdminCourses();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const get = (k: string) => params.get(k) ?? "";
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  const [draft, setDraft] = useState(get("q"));
  const [showFilters, setShowFilters] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const q = get("q").trim().toLowerCase();
  const shown = useMemo(
    () =>
      (courses ?? []).filter((c) => {
        const a = get("access");
        const st = get("status");
        const v = get("state");
        const state = c.archived ? "archived" : c.published ? "published" : c.publishedAt ? "unpublished" : "draft";
        return (
          (!get("area") || divisionOf(c.categoryId).id === get("area")) &&
          (!a || (a === "free" ? !isPaid(c) : a === "paid" ? isPaid(c) && c.price != null : isPaid(c) && c.price == null)) &&
          (!st || c.status === st) &&
          (!v || state === v) &&
          (!q || c.title.toLowerCase().includes(q) || c.slug.includes(q))
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [courses, params],
  );
  const filterCls = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]";

  const togglePublish = async (c: Course) => {
    setBusy(c.id);
    try {
      await (await getBackend()).admin.saveCourse(courseInput({ ...c, published: !c.published }));
      await reload();
    } finally {
      setBusy(null);
    }
  };

  const create = async () => {
    setFormError(null);
    if (title.trim().length < 3) return setFormError("Give the course a title.");
    if (!slugOk(slug)) return setFormError("The slug can only use lowercase letters, numbers and single hyphens.");
    if (!/^[A-Z]{2,5}$/.test(code)) return setFormError("The code must be 2 to 5 capital letters, e.g. PY.");
    if (courses?.some((c) => c.slug === slug || c.id === slug)) return setFormError("A course with that slug already exists.");
    try {
      await (await getBackend()).admin.saveCourse({
        id: slug,
        slug,
        code,
        title: title.trim(),
        summary: "",
        description: "",
        categoryId: CATEGORIES[0].id,
        difficulty: "beginner",
        level: 1,
        levelLabel: "Beginner",
        isFree: true,
        courseType: "free",
        access: "free",
        status: "coming_soon",
        skills: [],
        prerequisites: [],
        certificate: { enabled: true, requireAllLessons: true, requireExercises: true, requireProject: false, requireModuleBadges: false, passingScore: 60 },
        published: false,
        position: (courses?.length ?? 0) + 1,
      });
      navigate(`/admin/courses/${slug}`);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Couldn't create the course.");
    }
  };

  if (error) return <Alert tone="error">{error}</Alert>;
  if (!courses) return <PageLoading />;

  return (
    <>
      <AdminHeading title="Courses">
        <Button variant="secondary" onClick={() => setCreating((x) => !x)}>
          {creating ? "Cancel" : "New course"}
        </Button>
      </AdminHeading>

      {creating && (
        <form
          className="mb-8 grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-3"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void create();
          }}
        >
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="URL slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} placeholder="python-for-analysis" />
          <TextField label="Certificate code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="PY" />
          <div className="sm:col-span-3">
            {formError && (
              <div className="mb-3">
                <Alert tone="error">{formError}</Alert>
              </div>
            )}
            <Button type="submit">Create draft</Button>
          </div>
        </form>
      )}

      <div className="sticky top-[4.5rem] z-30 -mx-1 mb-4 bg-ivory/95 px-1 py-3 backdrop-blur">
        <form
          role="search"
          className="flex flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            set("q", draft.trim());
          }}
        >
          <div className="relative min-w-[14rem] flex-1">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              aria-label="Search courses"
              className="block w-full rounded-lg border border-line-strong bg-paper py-2.5 pl-9 pr-9 text-[0.9375rem]"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search by title or slug, then press Search"
            />
            {draft && (
              <button
                type="button"
                aria-label="Clear the search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-subtle hover:text-ink"
                onClick={() => {
                  setDraft("");
                  set("q", "");
                }}
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="secondary" onClick={() => setShowFilters((x) => !x)} aria-expanded={showFilters}>
            <SlidersHorizontal aria-hidden className="h-4 w-4" /> Filters{[...params.keys()].filter((k) => k !== "q").length ? ` (${[...params.keys()].filter((k) => k !== "q").length})` : ""}
          </Button>
        </form>
        {showFilters && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-[0.8125rem] font-medium">
          Area
          <select className={filterCls} value={get("area")} onChange={(e) => set("area", e.target.value)}>
            <option value="">All areas</option>
            {DIVISIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[0.8125rem] font-medium">
          Access
          <select className={filterCls} value={get("access")} onChange={(e) => set("access", e.target.value)}>
            <option value="">Free and paid</option>
            <option value="free">Free</option>
            <option value="paid">Paid, sold on its own</option>
            <option value="programme">Paid, inside a programme</option>
          </select>
        </label>
        <label className="text-[0.8125rem] font-medium">
          Status
          <select className={filterCls} value={get("status")} onChange={(e) => set("status", e.target.value)}>
            <option value="">Any status</option>
            <option value="available">Available</option>
            <option value="coming_soon">Coming soon</option>
          </select>
        </label>
        <label className="text-[0.8125rem] font-medium">
          Visibility
          <select className={filterCls} value={get("state")} onChange={(e) => set("state", e.target.value)}>
            <option value="">Any</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="unpublished">Unpublished</option>
            <option value="archived">Archived</option>
          </select>
        </label>
          </div>
        )}
      </div>
      <p className="mb-3 text-[0.875rem] text-muted" aria-live="polite">
        Showing {shown.length} of {courses.length} courses
        {params.size > 0 && (
          <>
            {" "}
            <button
              type="button"
              className="font-semibold text-brass-dark"
              onClick={() => {
                setDraft("");
                setParams({}, { replace: true });
              }}
            >
              Clear search and filters
            </button>
          </>
        )}
      </p>

      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Area</th>
              <th>Status</th>
              <th>Access</th>
              <th>Lessons</th>
              <th>Visibility</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/admin/courses/${c.slug}`} className="font-semibold hover:text-brass-dark">
                    {c.title}
                  </Link>
                  <span className="block text-[0.75rem] text-muted">/{c.slug}</span>
                </td>
                <td>
                  {divisionOf(c.categoryId).name}
                  <span className="block text-[0.75rem] text-muted">{categoryName(c.categoryId)}</span>
                </td>
                <td>
                  <Badge tone={c.status === "available" ? "free" : "soon"}>{c.status === "available" ? "Available" : "Coming soon"}</Badge>
                </td>
                <td>
                  <Badge tone={isPaid(c) ? "neutral" : "free"}>{isPaid(c) ? (c.courseType === "professional" ? "Professional" : "Paid") : "Free"}</Badge>
                  {isPaid(c) && (
                    <span className="block text-[0.75rem] text-muted">
                      {c.price == null ? "Inside a programme" : priceLabel(c)}
                      {c.price != null && c.status === "available" && enrolmentState(c) !== "open" ? " · enrolment closed" : ""}
                    </span>
                  )}
                </td>
                <td>
                  {c.modules.flatMap((m) => m.lessons).length}
                  <span className="block text-[0.75rem] text-muted">{c.modules.length} modules</span>
                </td>
                <td>{c.archived ? "Archived" : c.published ? "Published" : c.publishedAt ? "Unpublished" : "Draft"}</td>
                <td className="whitespace-nowrap text-right">
                  <button type="button" disabled={busy === c.id} onClick={() => void togglePublish(c)} className="text-[0.8125rem] font-semibold text-brass-dark disabled:opacity-50">
                    {c.published ? "Unpublish" : "Publish"}
                  </button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted">
                  No courses match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
