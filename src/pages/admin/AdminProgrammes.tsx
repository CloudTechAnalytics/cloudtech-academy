import { useMemo, useState } from "react";
import { Link } from "react-router";
import { getBackend, type AdminCourseOrder, type AdminEnrollment } from "@/lib/backend";
import { TRACKS } from "@/content/tracks";
import { divisionOf } from "@/content/catalog";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { formatPrice } from "@/lib/commerce";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

const SOURCE: Record<AdminEnrollment["source"], string> = { free: "Free", purchase: "Paid", granted: "Granted by admin" };
const ORDER_STATUS: Record<AdminCourseOrder["status"], string> = { pending: "Awaiting payment", partial: "Part paid", paid: "Paid", granted: "Granted", failed: "Failed", cancelled: "Cancelled" };
const selectCls = "rounded-lg border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]";

const money = (by: Record<string, number>) => {
  const parts = Object.entries(by).filter(([, v]) => v > 0).map(([cur, v]) => formatPrice(v, cur));
  return parts.length ? parts.join(" + ") : "—";
};

/** Everyone enrolled on the Academy's courses, with who paid and who was given access. Admins can grant or take back access. */
export function AdminEnrollments() {
  const { data, error, reload } = useAdminData(async () => {
    const b = await getBackend();
    const [rows, courses, students, programmeRows, sales] = await Promise.all([
      b.admin.listCourseEnrollments(),
      b.listCourses({ includeUnpublished: true }),
      b.admin.listStudents(),
      b.admin.listProgrammeEnrollments(),
      b.listProgrammeSales(),
    ]);
    const programmes = TRACKS.filter((t) => (sales[t.id]?.access ?? t.access) === "paid");
    return { rows, courses, students, programmeRows, programmes };
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
          void run("Access granted. The learner can open the lessons now.", async () =>
            grantCourse.startsWith("track:")
              ? (await getBackend()).admin.grantProgrammeAccess(grantUser, grantCourse.slice(6), note)
              : (await getBackend()).admin.grantCourseAccess(grantUser, grantCourse, note),
          );
        }}
      >
        <h2 className="font-serif text-[1.25rem]">Grant access to a programme or paid course</h2>
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
            Programme or course
            <select className={`${selectCls} mt-1.5 block`} value={grantCourse} onChange={(e) => setGrantCourse(e.target.value)}>
              <option value="">Choose…</option>
              <optgroup label="Professional programmes">
                {data.programmes.map((t) => (
                  <option key={t.id} value={`track:${t.id}`}>
                    {t.programmeName ?? t.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Paid courses">
                {paidCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <Button type="submit" loading={busy} disabled={!grantUser || !grantCourse}>
            Grant access
          </Button>
        </div>
        {paidCourses.length === 0 && data.programmes.length === 0 && <p className="mt-3 text-[0.8125rem] text-muted">Nothing is paid yet. Set a programme's access to Paid in Programmes first.</p>}
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

      <h2 className="mb-3 mt-10 font-serif text-[1.4rem]">Programme enrolments</h2>
      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Programme</th>
              <th>How</th>
              <th>Enrolled</th>
              <th>Completed</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.programmeRows.map((r) => (
              <tr key={`${r.userId}:${r.trackId}`}>
                <td>
                  {r.fullName}
                  <span className="block text-[0.75rem] text-muted">{r.email}</span>
                </td>
                <td>{r.trackTitle}</td>
                <td>
                  {SOURCE[r.source]}
                  {r.source === "purchase" && r.amount !== null && <span className="block text-[0.75rem] text-muted">{formatPrice(r.amount, r.currency ?? "NGN")}</span>}
                </td>
                <td>{formatDate(r.enrolledAt)}</td>
                <td>{r.completedAt ? formatDate(r.completedAt) : "—"}</td>
                <td className="whitespace-nowrap text-right">
                  <button
                    type="button"
                    disabled={busy}
                    className="text-[0.8125rem] font-semibold text-danger disabled:opacity-50"
                    onClick={() => {
                      const reason = window.prompt(`Take back access to ${r.trackTitle} for ${r.fullName}? Their progress is kept. Reason:`, "");
                      if (reason === null) return;
                      void run("Programme access revoked.", async () => (await getBackend()).admin.revokeProgrammeAccess(r.userId, r.trackId, reason));
                    }}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
            {data.programmeRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No programme enrolments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/** Card payments through Paystack, kept for when card payment is switched on: what was ordered, what was paid, and the provider reference. */
export function AdminCardOrders({ onDeleted }: { onDeleted?: () => unknown } = {}) {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listCourseOrders());
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const rows = data.filter((o) => !status || o.status === status);
  const paid = data.filter((o) => o.status === "paid");
  const revenue: Record<string, number> = {};
  for (const o of paid) revenue[o.currency] = (revenue[o.currency] ?? 0) + o.amount;
  return (
    <>
      <h2 className="mb-4 font-serif text-[1.5rem]">Card payments (Paystack)</h2>
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
      {msg && (
        <div className="mb-4" aria-live="polite">
          <Alert tone="error">{msg}</Alert>
        </div>
      )}
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
              <th>
                <span className="sr-only">Actions</span>
              </th>
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
                <td className="whitespace-nowrap text-right">
                  <button
                    type="button"
                    disabled={busy}
                    className="text-[0.8125rem] font-semibold text-danger disabled:opacity-50"
                    onClick={() => {
                      const opens = o.status === "paid" || o.status === "partial" || o.status === "granted";
                      if (!window.confirm(`Delete this ${formatPrice(o.amount, o.currency)} order from ${o.studentName}?${opens ? " Access it opened is closed, and its payments are deleted too." : ""}`)) return;
                      setBusy(true);
                      setMsg(null);
                      void getBackend()
                        .then((b) => b.admin.deleteCourseOrder(o.id))
                        .then(() => Promise.all([reload(), onDeleted?.()]))
                        .catch((e) => setMsg(e instanceof Error ? e.message : "Couldn't delete the order."))
                        .finally(() => setBusy(false));
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted">
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
  const { data: all, error } = useAdminData(async () => {
    const b = await getBackend();
    const [courses, programmes, catalogue] = await Promise.all([b.admin.listCourseStats(), b.admin.listProgrammeStats(), b.listCourses({ includeUnpublished: true })]);
    return { courses, programmes, area: new Map(catalogue.map((c) => [c.id, divisionOf(c.categoryId).name])) };
  });
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!all) return <PageLoading />;
  const data = all.courses;
  const programmes = all.programmes;
  const areaOf = (id: string) => all.area.get(id) ?? "";

  const free = data.filter((c) => c.accessType === "free");
  const revenue: Record<string, number> = {};
  for (const c of data) for (const [cur, v] of Object.entries(c.revenue)) revenue[cur] = (revenue[cur] ?? 0) + v;
  for (const p of programmes) for (const [cur, v] of Object.entries(p.revenue)) revenue[cur] = (revenue[cur] ?? 0) + v;
  const freeLearners = free.reduce((n, c) => n + c.enrollments, 0);
  // Programme holders are counted once, as programme enrolments, not once per course they unlocked.
  const converted = programmes.reduce((n, p) => n + p.converted, 0);
  const paidEnrolments = programmes.reduce((n, p) => n + p.enrollments, 0);
  const total = freeLearners + paidEnrolments;
  const finished = free.reduce((n, c) => n + c.completions, 0) + programmes.reduce((n, p) => n + p.completions, 0);
  const popular = [
    ...free.map((c) => ({ id: c.courseId, title: c.title, enrollments: c.enrollments })),
    ...programmes.map((p) => ({ id: p.trackId, title: p.title, enrollments: p.enrollments })),
  ]
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 5);

  return (
    <>
      <AdminHeading title="Analytics" />
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total enrolments", String(total)],
          ["Free enrolments", String(freeLearners)],
          ["Paid enrolments", String(paidEnrolments)],
          ["Revenue", money(revenue)],
          ["Completion rate", pct(finished, total)],
          ["Free to paid conversion", programmes.length ? `${converted} of ${paidEnrolments} programme learners` : "No paid programme yet"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-paper p-5">
            <dt className="text-[0.875rem] text-muted">{label}</dt>
            <dd className="mt-2 font-serif text-[1.7rem] leading-tight">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[0.8125rem] text-muted">Conversion counts programme buyers who had already taken a free course. Programme completion means the programme badge was earned.</p>

      <h2 className="mt-10 font-serif text-[1.4rem]">Professional programmes</h2>
      <div className="table-scroll mt-3 rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Programme</th>
              <th>Price</th>
              <th>Enrolled</th>
              <th>Completed</th>
              <th>Completion</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {programmes.map((p) => (
              <tr key={p.trackId}>
                <td>{p.title}</td>
                <td>{p.price ? formatPrice(p.price, p.currency) : "Not set"}</td>
                <td>
                  {p.enrollments}
                  <span className="block text-[0.75rem] text-muted">
                    {p.paidEnrollments} paid · {p.grantedEnrollments} granted
                  </span>
                </td>
                <td>{p.completions}</td>
                <td>{pct(p.completions, p.enrollments)}</td>
                <td>{money(p.revenue)}</td>
              </tr>
            ))}
            {programmes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No paid programme yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 font-serif text-[1.4rem]">Most popular</h2>
      <ol className="mt-3 space-y-1.5 text-[0.9375rem]">
        {popular.map((c, i) => (
          <li key={c.id}>
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
              <th>Area</th>
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
                <td>{areaOf(c.courseId)}</td>
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
