import { Link } from "react-router";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { Alert } from "@/components/Form";
import { daysSince } from "@/lib/format";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

export default function AdminOverview() {
  const { data, error } = useAdminData(async () => {
    const b = await getBackend();
    const [courses, students, submissions, certificates] = await Promise.all([
      b.listCourses({ includeUnpublished: true }),
      b.admin.listStudents(),
      b.admin.listSubmissions(),
      b.admin.listCertificates(),
    ]);
    return { courses, students, submissions, certificates };
  });
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;

  const cards = [
    { label: "Published courses", value: data.courses.filter((c) => c.published && c.status === "available").length, to: "/admin/courses" },
    { label: "Students", value: data.students.length, to: "/admin/students" },
    { label: "Active in the last 7 days", value: data.students.filter((s) => daysSince(s.lastActiveAt) <= 7).length, to: "/admin/students" },
    { label: "Submissions to review", value: data.submissions.filter((s) => s.status === "submitted").length, to: "/admin/submissions" },
    { label: "Certificates issued", value: data.certificates.filter((c) => c.status === "valid").length, to: "/admin/certificates" },
  ];

  return (
    <>
      <AdminHeading title="Overview" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-2xl border border-line bg-paper p-5 hover:border-line-strong">
            <p className="text-[0.8125rem] text-muted">{c.label}</p>
            <p className="mt-2 font-serif text-[2.2rem] leading-none">{c.value}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
