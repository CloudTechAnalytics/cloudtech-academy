import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { CATEGORIES } from "@/content";
import type { Course } from "@/content/types";
import { Badge } from "@/components/CourseCard";
import { Button } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { courseInput, slugOk, useAdminCourses } from "./useAdmin";

export default function AdminCourses() {
  const { data: courses, error, reload } = useAdminCourses();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

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
        levelLabel: "Beginner",
        isFree: true,
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

      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Status</th>
              <th>Lessons</th>
              <th>Visibility</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/admin/courses/${c.slug}`} className="font-semibold hover:text-brass-dark">
                    {c.title}
                  </Link>
                  <span className="block text-[0.75rem] text-muted">/{c.slug}</span>
                </td>
                <td>
                  <Badge tone={c.status === "available" ? "free" : "soon"}>{c.status === "available" ? "Available" : "Coming soon"}</Badge>
                </td>
                <td>{c.modules.flatMap((m) => m.lessons).length}</td>
                <td>{c.published ? "Published" : "Draft"}</td>
                <td className="whitespace-nowrap text-right">
                  <button type="button" disabled={busy === c.id} onClick={() => void togglePublish(c)} className="text-[0.8125rem] font-semibold text-brass-dark disabled:opacity-50">
                    {c.published ? "Unpublish" : "Publish"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
