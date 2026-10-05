import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Download } from "lucide-react";
import { getBackend, type AcademyEvent, type AttendanceStatus, type EventRegistration } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { eventDateLabel, eventTimeLabel } from "@/lib/events";
import { Alert } from "@/components/Form";
import { Button } from "@/components/Button";
import { AdminHeading } from "./AdminLayout";
import { StatusPill } from "./AdminEvents";

const ATTENDANCE: { value: AttendanceStatus; label: string }[] = [
  { value: "registered", label: "Registered" },
  { value: "attended", label: "Attended" },
  { value: "did_not_attend", label: "Did not attend" },
];

function csv(rows: (string | number | null)[][], filename: string) {
  const cell = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const blob = new Blob([rows.map((r) => r.map(cell).join(",")).join("\r\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Admin Dashboard → Events → one event's registrations, with attendance. */
export default function AdminEventRegistrations() {
  const { eventId = "" } = useParams();
  const [event, setEvent] = useState<AcademyEvent | null | undefined>(undefined);
  const [regs, setRegs] = useState<EventRegistration[]>([]);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    const b = await getBackend();
    const [e, r] = await Promise.all([b.admin.getEventById(eventId), b.admin.listRegistrations(eventId)]);
    setEvent(e);
    setRegs(r);
  }, [eventId]);
  useEffect(() => {
    void load().catch((e: unknown) => {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't load registrations." });
      setEvent(null);
    });
  }, [load]);

  if (event === undefined) return <PageLoading />;
  if (!event)
    return (
      <>
        <AdminHeading title="Registrations" />
        <Alert tone="error">{msg?.text ?? "Event not found."}</Alert>
        <Link to="/admin/events" className="mt-4 inline-block font-semibold text-brass-dark">
          ← All events
        </Link>
      </>
    );

  const active = regs.filter((r) => r.registrationStatus === "registered");
  const count = (s: AttendanceStatus) => active.filter((r) => r.attendanceStatus === s).length;

  const setAttendance = async (r: EventRegistration, status: AttendanceStatus) => {
    // Show the change straight away; put it back if the save fails.
    const before = regs;
    setRegs((list) => list.map((x) => (x.id === r.id ? { ...x, attendanceStatus: status, attendedAt: status === "attended" ? new Date().toISOString() : null } : x)));
    try {
      await (await getBackend()).admin.setAttendance(r.id, status);
      setMsg(null);
    } catch (e) {
      setRegs(before);
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't update attendance." });
    }
  };

  return (
    <>
      <Link to="/admin/events" className="text-[0.875rem] text-muted hover:text-ink">
        ← All events
      </Link>
      <AdminHeading title="Registrations">
        <Button
          variant="secondary"
          disabled={!regs.length}
          onClick={() =>
            csv(
              [
                ["Name", "Email", "Phone", "Registered", "Registration", "Attendance"],
                ...regs.map((r) => [r.fullName, r.email, r.phone, r.registeredAt.slice(0, 16).replace("T", " "), r.registrationStatus === "registered" ? "Registered" : "Cancelled", r.registrationStatus === "registered" ? ATTENDANCE.find((a) => a.value === r.attendanceStatus)?.label ?? "" : ""]),
              ],
              `${event.slug}-registrations.csv`,
            )
          }
        >
          <Download aria-hidden className="h-4 w-4" /> Export CSV
        </Button>
      </AdminHeading>

      <div className="-mt-4 mb-6">
        <p className="font-serif text-[1.35rem]">
          <Link to={`/admin/events/${event.id}`} className="hover:text-brass-dark">
            {event.title}
          </Link>{" "}
          <StatusPill status={event.status} />
        </p>
        <p className="mt-1 text-[0.9375rem] text-muted">
          {eventDateLabel(event)}, {eventTimeLabel(event)}
        </p>
      </div>

      {!event.registrationRequired && <Alert tone="info">This event doesn't require registration, so nobody can register on the Academy. Turn on "Registration required" in the event's settings to collect registrations.</Alert>}

      <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Registered", active.length + (event.maxParticipants ? ` of ${event.maxParticipants}` : "")],
          ["Attended", count("attended")],
          ["Did not attend", count("did_not_attend")],
          ["Cancelled", regs.length - active.length],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-paper p-5">
            <dt className="text-[0.8125rem] text-muted">{k}</dt>
            <dd className="mt-2 font-serif text-[1.9rem] leading-none">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4" aria-live="polite">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      </div>

      {regs.length === 0 ? (
        <p className="mt-6 text-muted">Nobody has registered yet.</p>
      ) : (
        <div className="table-scroll mt-4 rounded-2xl border border-line bg-paper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {regs.map((r) => {
                const cancelled = r.registrationStatus === "cancelled";
                return (
                  <tr key={r.id} className={cancelled ? "text-muted" : ""}>
                    <td>
                      <span className={cancelled ? "line-through" : "font-semibold"}>{r.fullName}</span>
                      {r.userId && <span className="ml-2 rounded-full bg-brass-pale/70 px-2 py-0.5 text-[0.6875rem] font-medium text-brass-dark">Academy account</span>}
                    </td>
                    <td className="text-[0.875rem]">
                      <a href={`mailto:${r.email}`} className="hover:text-brass-dark">
                        {r.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap text-[0.875rem]">{r.phone ?? "—"}</td>
                    <td className="whitespace-nowrap text-[0.875rem]">{new Date(r.registeredAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>
                      {cancelled ? (
                        <span className="text-[0.875rem]">Cancelled</span>
                      ) : (
                        <>
                          <label htmlFor={`att-${r.id}`} className="sr-only">
                            Attendance for {r.fullName}
                          </label>
                          <select
                            id={`att-${r.id}`}
                            value={r.attendanceStatus}
                            onChange={(e) => void setAttendance(r, e.target.value as AttendanceStatus)}
                            className="rounded-lg border border-line-strong bg-paper px-2.5 py-1.5 text-[0.875rem]"
                          >
                            {ATTENDANCE.map((a) => (
                              <option key={a.value} value={a.value}>
                                {a.label}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
