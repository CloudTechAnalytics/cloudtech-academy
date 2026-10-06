import { useMemo, useState } from "react";
import { Link } from "react-router";
import { getBackend, type AdminCourseOrder, type AdminEnrollment, type CourseStats } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { formatPrice } from "@/lib/commerce";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

const SOURCE: Record<AdminEnrollment["source"], string> = { free: "Free", purchase: "Paid", granted: "Granted by admin" };
const ORDER_STATUS: Record<AdminCourseOrder["status"], string> = { pending: "Awaiting payment", paid: "Paid", granted: "Granted", failed: "Failed", cancelled: "Cancelled" };
const selectCls = "rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]";

const money = (by: Record<string, number>) => {
  const parts = Object.entries(by).filter(([, v]) => v > 0).map(([cur, v]) => formatPrice(v, cur));
  return parts.length ? parts.join(" + ") : "—";
};

/** Everyone enrolled on the Academy's courses, with who paid and who was given access. Admins can grant or take back access. */
export function AdminEnrollments() {
  const { data, error, reload } = useAdminData(async () => {
    const b = await getBackend();
    const [rows, courses, students] = await Promise.all([b.admin.listCourseEnrollments(), b.listCourses({ includeUnpublished: true }), b.admin.listStudents()]);
    return { rows, courses, students };
  });
  const [course, setCourse] = useState("");
  const [source, setSource] = useState("");
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [grantUser, setGrantUser] = useState("");
  const [grantCourse, setGrantCourse] = useState("");
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => (data?.rows ?? []).filter((r) => (!course || r.courseId === course) && (!source || r.source === source)), [data, course, source]);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const paidCourses = data.courses.filter((c) => c.access === "paid" || c.isFree === false);

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      await reload();
      setMsg({ tone: "success", text: label });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "That didn't work." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHeading title="Enrollments" />
      {msg && (
        <div className="mb-5">
          <Alert tone={msg.tone}>{msg.text}</Alert>
        </div>
      )}

      <form
        className="mb-8 rounded-2xl border border-line bg-paper p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!grantUser || !grantCourse) return;
          const note = window.prompt("Add a note for the record, e.g. a bank transfer reference or scholarship:", "Granted by admin");
          if (note === null) return;
          void run("Access granted. The learner can open the lessons now.", async () => (await getBackend()).admin.grantCourseAccess(grantUser, grantCourse, note));
        }}
      >
        <h2 className="font-serif text-[1.25rem]">Grant access to a paid course</h2>
        <p className="mt-1 text-[0.875rem] text-muted">For bank transfers, scholarships or corrections. It enrols the learner without a card payment.</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-[0.875rem] font-medium">
            Learner
            <select className={`${selectCls} mt-1.5 block`} value={grantUser} onChange={(e) => setGrantUser(e.target.value)}>
              <option value="">Choose…</option>
              {data.students.map((s) => (
                <option key={s.userId} value={s.userId}>
                  {s.fullName} ({s.email})
                </option>
              ))}
            </select>
          </label>
          <label className="text-[0.875rem] font-medium">
            Course
            <select className={`${selectCls} mt-1.5 block`} value={grantCourse} onChange={(e) => setGrantCourse(e.target.value)}>
              <option value="">Choose…</option>
              {paidCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" loading={busy} disabled={!grantUser || !grantCourse}>
            Grant access
          </Button>
        </div>
        {paidCourses.length === 0 && <p className="mt-3 text-[0.8125rem] text-muted">No course is paid yet. Set a course's access to Paid in Courses first.</p>}
      </form>

      <div className="mb-4 flex flex-wrap gap-3">
        <select aria-label="Course" className={selectCls} value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">All courses</option>
          {data.courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select aria-label="How they enrolled" className={selectCls} value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">Any source</option>
          <option value="free">Free</option>
          <option value="purchase">Paid</option>
          <option value="granted">Granted by admin</option>
        </select>
        <p className="self-center text-[0.875rem] text-muted">{rows.length} enrolments</p>
      </div>

      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Course</th>
              <th>How</th>
              <th>Enrolled</th>
              <th>Completed</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.userId}:${r.courseId}`}>
                <td>
                  <Link to={`/admin/students/${r.userId}`} className="font-semibold hover:text-brass-dark">
                    {r.fullName}
                  </Link>
                  <span className="block text-[0.75rem] text-muted">{r.email}</span>
                </td>
                <td>{r.courseTitle}</td>
                <td>
                  {SOURCE[r.source]}
                  {r.source === "purchase" && r.amount !== null && <span className="block text-[0.75rem] text-muted">{formatPrice(r.amount, r.currency ?? "NGN")}</span>}
                </td>
                <td>{formatDate(r.enrolledAt)}</td>
                <td>{r.completedAt ? formatDate(r.completedAt) : "—"}</td>
                <td className="whitespace-nowrap text-right">
                  {r.source !== "free" && (
                    <button
                      type="button"
                      disabled={busy}
                      className="text-[0.8125rem] font-semibold text-danger disabled:opacity-50"
                      onClick={() => {
                        const reason = window.prompt(`Take back access to ${r.courseTitle} for ${r.fullName}? Their progress is kept. Reason:`, "");
                        if (reason === null) return;
                        void run("Access revoked.", async () => (await getBackend()).admin.revokeCourseAccess(r.userId, r.courseId, reason));
                      }}
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No enrolments match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/** Course payments: what was ordered, what was paid, and the provider reference for reconciling. */
export function AdminPayments() {
  const { data, error } = useAdminData(async () => (await getBackend()).admin.listCourseOrders());
  const [status, setStatus] = useState("");
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const rows = data.filter((o) => !status || o.status === status);
  const paid = data.filter((o) => o.status === "paid");
  const revenue: Record<string, number> = {};
  for (const o of paid) revenue[o.currency] = (revenue[o.currency] ?? 0) + o.amount;
  return (
    <>
      <AdminHeading title="Payments" />
      <dl className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Revenue (paid orders)", money(revenue)],
          ["Paid orders", String(paid.length)],
          ["Awaiting payment", String(data.filter((o) => o.status === "pending").length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-paper p-5">
            <dt className="text-[0.875rem] text-muted">{label}</dt>
            <dd className="mt-2 font-serif text-[1.8rem] leading-none">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mb-6 text-[0.875rem] text-muted">
        These are programme and course payments. Certificate payments are under{" "}
        <Link to="/admin/certificates/payments" className="font-semibold text-brass-dark">
          Certificates
        </Link>
        .
      </p>
      <select aria-label="Status" className={`${selectCls} mb-4`} value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        {Object.entries(ORDER_STATUS).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id}>
                <td>
                  {o.studentName}
                  <span className="block text-[0.75rem] text-muted">{o.studentEmail}</span>
                </td>
                <td>{o.courseTitle}</td>
                <td>
                  {formatPrice(o.amount, o.currency)}
                  {o.amount < o.listAmount && <s className="block text-[0.75rem] text-muted">{formatPrice(o.listAmount, o.currency)}</s>}
                </td>
                <td>{ORDER_STATUS[o.status]}</td>
                <td>{formatDate(o.paidAt ?? o.createdAt)}</td>
                <td className="font-mono text-[0.75rem]">{o.providerRef ?? o.note ?? o.id.slice(0, 8).toUpperCase()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No payments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "—");

/** Enrolments, revenue, completion and free-to-paid conversion, per course. */
export function AdminAnalytics() {
  const { data, error } = useAdminData(async () => (await getBackend()).admin.listCourseStats());
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;

  const sum = (f: (c: CourseStats) => number) => data.reduce((n, c) => n + f(c), 0);
  const total = sum((c) => c.enrollments);
  const free = data.filter((c) => c.accessType === "free");
  const paid = data.filter((c) => c.accessType === "paid");
  const revenue: Record<string, number> = {};
  for (const c of data) for (const [cur, v] of Object.entries(c.revenue)) revenue[cur] = (revenue[cur] ?? 0) + v;
  const freeLearners = free.reduce((n, c) => n + c.enrollments, 0);
  const converted = paid.reduce((n, c) => n + c.converted, 0);
  const paidEnrolments = paid.reduce((n, c) => n + c.paidEnrollments + c.grantedEnrollments, 0);
  const popular = [...data].sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);

  return (
    <>
      <AdminHeading title="Analytics" />
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total enrolments", String(total)],
          ["Free enrolments", String(freeLearners)],
          ["Paid enrolments", String(paidEnrolments)],
          ["Revenue", money(revenue)],
          ["Completion rate", pct(sum((c) => c.completions), total)],
          ["Free to paid conversion", paid.length ? `${converted} of ${paidEnrolments} buyers` : "No paid course yet"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-paper p-5">
            <dt className="text-[0.875rem] text-muted">{label}</dt>
            <dd className="mt-2 font-serif text-[1.7rem] leading-tight">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[0.8125rem] text-muted">Conversion counts buyers of a paid course who had already taken a free course.</p>

      <h2 className="mt-10 font-serif text-[1.4rem]">Most popular</h2>
      <ol className="mt-3 space-y-1.5 text-[0.9375rem]">
        {popular.map((c, i) => (
          <li key={c.courseId}>
            {i + 1}. {c.title} <span className="text-muted">· {c.enrollments} enrolled</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 font-serif text-[1.4rem]">By course</h2>
      <div className="table-scroll mt-3 rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Access</th>
              <th>Enrolled</th>
              <th>Completed</th>
              <th>Completion</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.courseId}>
                <td>
                  {c.title}
                  {!c.published && <span className="block text-[0.75rem] text-muted">Draft</span>}
                </td>
                <td>{c.accessType === "paid" ? (c.price ? `Paid · ${formatPrice(c.price, c.currency)}` : "Paid") : "Free"}</td>
                <td>
                  {c.enrollments}
                  {c.accessType === "paid" && (
                    <span className="block text-[0.75rem] text-muted">
                      {c.paidEnrollments} paid · {c.grantedEnrollments} granted
                    </span>
                  )}
                </td>
                <td>{c.completions}</td>
                <td>{pct(c.completions, c.enrollments)}</td>
                <td>{money(c.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
