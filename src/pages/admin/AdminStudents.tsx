import { useState } from "react";
import { Link, useParams } from "react-router";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate, percent } from "@/lib/format";
import { Alert, TextField } from "@/components/Form";
import { ProgressBar } from "@/components/ProgressBar";
import NotFound from "../NotFound";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

export function AdminStudents() {
  const { data, error } = useAdminData(async () => (await getBackend()).admin.listStudents());
  const [q, setQ] = useState("");
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const term = q.trim().toLowerCase();
  const rows = data.filter((s) => !term || s.fullName.toLowerCase().includes(term) || s.email.toLowerCase().includes(term));

  return (
    <>
      <AdminHeading title="Students" />
      <div className="mb-5 max-w-sm">
        <TextField label="Search by name or email" type="search" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {rows.length === 0 ? (
        <p className="text-muted">{data.length ? "No students match that search." : "No one has signed up yet."}</p>
      ) : (
        <div className="table-scroll rounded-2xl border border-line bg-paper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Courses</th>
                <th>Certificates</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.userId}>
                  <td>
                    <Link to={`/admin/students/${s.userId}`} className="font-semibold hover:text-brass-dark">
                      {s.fullName || "(no name)"}
                    </Link>
                  </td>
                  <td>{s.email}</td>
                  <td className="whitespace-nowrap">{formatDate(s.joinedAt)}</td>
                  <td>{s.enrollments}</td>
                  <td>{s.certificates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export function AdminStudent() {
  const { userId = "" } = useParams();
  const { data, error } = useAdminData(async () => (await getBackend()).admin.getStudent(userId), [userId]);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (data === undefined) return <PageLoading />;
  if (!data) return <NotFound />;
  const s = data.summary;
  return (
    <>
      <AdminHeading title={s.fullName || s.email} />
      <p className="-mt-4 mb-6 text-[0.875rem] text-muted">
        <Link to="/admin/students" className="hover:text-ink">
          ← Students
        </Link>
      </p>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-[0.8125rem] text-muted">Email</dt>
          <dd className="break-all">{s.email}</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted">Joined</dt>
          <dd>{formatDate(s.joinedAt)}</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-muted">Certificates</dt>
          <dd>{s.certificates}</dd>
        </div>
      </dl>
      <h2 className="mt-10 font-serif text-[1.4rem]">Courses</h2>
      {data.courses.length === 0 ? (
        <p className="mt-3 text-muted">Not enrolled in any course yet.</p>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {data.courses.map((c) => (
            <li key={c.courseId} className="rounded-2xl border border-line bg-paper p-5">
              <p className="font-semibold">{c.courseTitle}</p>
              <p className="mt-1 text-[0.8125rem] text-muted">
                Enrolled {formatDate(c.enrolledAt)}
                {c.completedAt && ` · Completed ${formatDate(c.completedAt)}`}
              </p>
              <div className="mt-4">
                <ProgressBar value={percent(c.completedLessons, c.totalLessons)} label={`${c.completedLessons} of ${c.totalLessons} lessons`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
