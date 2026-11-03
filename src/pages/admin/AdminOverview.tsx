import { Link } from "react-router";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { Alert } from "@/components/Form";
import { daysSince } from "@/lib/format";
import { DIVISIONS, divisionOf } from "@/content/catalog";
import { formatPrice, isPaid } from "@/lib/commerce";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

const money = (by: Record<string, number>) => {
  const parts = Object.entries(by).filter(([, v]) => v > 0).map(([cur, v]) => formatPrice(v, cur));
  return parts.length ? parts.join(" + ") : "—";
};
const add = (into: Record<string, number>, from: Record<string, number>) => {
  for (const [k, v] of Object.entries(from)) into[k] = (into[k] ?? 0) + v;
};

export default function AdminOverview() {
  const { data, error } = useAdminData(async () => {
    const b = await getBackend();
    const [courses, students, submissions, certificates, stats, programmeStats, payments] = await Promise.all([
      b.listCourses({ includeUnpublished: true }),
      b.admin.listStudents(),
      b.admin.listSubmissions(),
      b.admin.listCertificates(),
      b.admin.listCourseStats(),
      b.admin.listProgrammeStats(),
      b.admin.listPayments(),
    ]);
    return { courses, students, submissions, certificates, stats, programmeStats, payments };
  });
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;

  const { courses } = data;
  const alone = courses.filter((c) => isPaid(c) && c.price != null);
  const inProgrammes = courses.filter((c) => isPaid(c) && c.price == null);
  const courseCards = [
    { label: "Courses in total", value: courses.length, note: "Everything in the catalogue", to: "/admin/courses" },
    { label: "Free courses", value: courses.filter((c) => !isPaid(c)).length, note: "Open to everyone", to: "/admin/courses?access=free" },
    { label: "Paid courses", value: alone.length, note: "Sold on their own", to: "/admin/courses?access=paid" },
    { label: "Inside programmes", value: inProgrammes.length, note: "Open with a programme", to: "/admin/courses?access=programme" },
    { label: "Available now", value: courses.filter((c) => c.status === "available").length, note: "Learners can start them", to: "/admin/courses?status=available" },
    { label: "Opening soon", value: courses.filter((c) => c.status === "coming_soon").length, note: "Lessons still being written", to: "/admin/courses?status=coming_soon" },
  ];

  const enrolments = new Map(data.stats.map((s) => [s.courseId, s]));
  const areas = DIVISIONS.map((d) => {
    const mine = courses.filter((c) => divisionOf(c.categoryId).id === d.id);
    const revenue: Record<string, number> = {};
    let enrolled = 0;
    for (const c of mine) {
      const s = enrolments.get(c.id);
      if (s) {
        enrolled += s.enrollments;
        add(revenue, s.revenue);
      }
    }
    return { id: d.id, name: d.name, courses: mine.length, free: mine.filter((c) => !isPaid(c)).length, paid: mine.filter((c) => isPaid(c)).length, enrolled, revenue };
  });
  const programmeRevenue: Record<string, number> = {};
  for (const p of data.programmeStats) add(programmeRevenue, p.revenue);

  const awaiting = data.payments.filter((p) => p.status === "submitted").length;
  const overdue = data.payments.filter((p) => p.status !== "confirmed" && p.dueAt && new Date(p.dueAt) < new Date()).length;
  const people = [
    { label: "Students", value: data.students.length, to: "/admin/students" },
    { label: "Active in the last 7 days", value: data.students.filter((s) => daysSince(s.lastActiveAt) <= 7).length, to: "/admin/students" },
    { label: "Badges earned", value: data.students.reduce((n, s) => n + s.badges, 0), to: "/admin/credentials" },
    { label: "Certificates issued", value: data.certificates.filter((c) => c.status === "valid").length, to: "/admin/certificates" },
  ];
  const attention = [
    { label: "Payments to confirm", value: awaiting, to: "/admin/payments" },
    { label: "Payments overdue", value: overdue, to: "/admin/payments" },
    { label: "Project submissions to review", value: data.submissions.filter((s) => s.status === "submitted").length, to: "/admin/submissions" },
  ];

  return (
    <>
      <AdminHeading title="Overview" />

      <section aria-labelledby="needs-title">
        <h2 id="needs-title" className="font-serif text-[1.3rem]">
          Needs your attention
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {attention.map((c) => (
            <Link key={c.label} to={c.to} className={`rounded-2xl border p-5 hover:border-line-strong ${c.value > 0 ? "border-brass/50 bg-brass-pale/40" : "border-line bg-paper"}`}>
              <p className="text-[0.8125rem] text-muted">{c.label}</p>
              <p className="mt-2 font-serif text-[2.2rem] leading-none">{c.value}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="courses-title" className="mt-10">
        <h2 id="courses-title" className="font-serif text-[1.3rem]">
          Courses
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courseCards.map((c) => (
            <Link key={c.label} to={c.to} className="rounded-2xl border border-line bg-paper p-5 hover:border-line-strong">
              <p className="text-[0.8125rem] text-muted">{c.label}</p>
              <p className="mt-2 font-serif text-[2.2rem] leading-none">{c.value}</p>
              <p className="mt-2 text-[0.8125rem] text-subtle">{c.note}</p>
            </Link>
          ))}
        </div>

        <div className="table-scroll mt-5 rounded-2xl border border-line bg-paper">
          <table>
            <thead>
              <tr>
                <th>Area</th>
                <th>Courses</th>
                <th>Free</th>
                <th>Paid</th>
                <th>Enrolments</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link to={`/admin/courses?area=${a.id}`} className="font-semibold hover:text-brass-dark">
                      {a.name}
                    </Link>
                  </td>
                  <td>{a.courses}</td>
                  <td>{a.free}</td>
                  <td>{a.paid}</td>
                  <td>{a.enrolled}</td>
                  <td>{money(a.revenue)}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <Link to="/admin/programmes" className="font-semibold hover:text-brass-dark">
                    Professional programmes
                  </Link>
                  <span className="block text-[0.75rem] text-muted">Sold as a whole; their courses are counted above</span>
                </td>
                <td>{data.programmeStats.length}</td>
                <td>—</td>
                <td>{data.programmeStats.length}</td>
                <td>{data.programmeStats.reduce((n, p) => n + p.enrollments, 0)}</td>
                <td>{money(programmeRevenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="people-title" className="mt-10">
        <h2 id="people-title" className="font-serif text-[1.3rem]">
          Students
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {people.map((c) => (
            <Link key={c.label} to={c.to} className="rounded-2xl border border-line bg-paper p-5 hover:border-line-strong">
              <p className="text-[0.8125rem] text-muted">{c.label}</p>
              <p className="mt-2 font-serif text-[2.2rem] leading-none">{c.value}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
