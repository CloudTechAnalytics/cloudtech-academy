import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Ban, CalendarDays, Copy, ExternalLink, Eye, EyeOff, MoreHorizontal, Pencil, Plus, Trash2, Users, CheckCheck } from "lucide-react";
import { getBackend, type AcademyEvent, type EventStatus } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { EVENT_STATUSES, EVENT_TYPES, eventDateLabel, eventFormatLabel, eventPhase, eventStatusLabel, eventTimeLabel, eventTypeLabel } from "@/lib/events";
import { Alert, TextField } from "@/components/Form";
import { Button, ButtonLink } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { DeleteDialog } from "@/components/DeleteDialog";
import { SelectField } from "@/components/FormExtras";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

const TONE: Record<EventStatus, string> = {
  draft: "border-line-strong bg-sand text-muted",
  published: "border-success/40 bg-success-bg text-success",
  registration_open: "border-success/40 bg-success-bg text-success",
  registration_closed: "border-brass/50 bg-brass-pale/60 text-brass-dark",
  completed: "border-line-strong bg-sand text-muted",
  cancelled: "border-danger/40 bg-danger/10 text-danger",
};

export function StatusPill({ status }: { status: EventStatus }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.75rem] font-semibold ${TONE[status]}`}>{eventStatusLabel(status)}</span>;
}

function Row({ event, onChange, onCancel, onDelete }: { event: AcademyEvent; onChange: (msg: string) => void; onCancel: () => void; onDelete: () => void }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");
  const item = "flex w-full items-center gap-2 px-3.5 py-2 text-left text-[0.875rem] hover:bg-sand";
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    close();
    try {
      await fn();
      onChange(msg);
    } catch (e) {
      onChange(e instanceof Error ? e.message : "That didn't work.");
    }
  };
  const b = () => getBackend();
  const live = event.status !== "draft";
  const reg = event.registrationRequired;
  return (
    <details ref={ref} className="relative inline-block text-left">
      <summary title="Actions" className="inline-flex cursor-pointer list-none items-center rounded-lg border border-line-strong p-2 hover:border-ink/40 [&::-webkit-details-marker]:hidden">
        <MoreHorizontal aria-hidden className="h-4 w-4" />
        <span className="sr-only">Actions for {event.title}</span>
      </summary>
      <div className="absolute right-0 z-20 mt-1 w-60 overflow-hidden rounded-xl border border-line bg-paper py-1 shadow-[0_16px_40px_-20px_rgba(23,23,23,0.45)]">
        <Link to={`/admin/events/${event.id}`} className={item}>
          <Pencil aria-hidden className="h-4 w-4" /> Edit
        </Link>
        <Link to={`/admin/events/${event.id}/registrations`} className={item}>
          <Users aria-hidden className="h-4 w-4" /> Registrations
        </Link>
        {live && (
          <Link to={`/events/${event.slug}`} target="_blank" className={item}>
            <ExternalLink aria-hidden className="h-4 w-4" /> View public page
          </Link>
        )}
        <button type="button" className={item} onClick={() => void run(async () => (await b()).admin.duplicateEvent(event.id), `Copied: a draft of "${event.title}" was created.`)}>
          <Copy aria-hidden className="h-4 w-4" /> Duplicate
        </button>
        {event.status === "draft" ? (
          <button type="button" className={item} onClick={() => void run(async () => (await b()).admin.setEventStatus(event.id, reg ? "registration_open" : "published"), `"${event.title}" is published.`)}>
            <Eye aria-hidden className="h-4 w-4" /> Publish
          </button>
        ) : (
          <button type="button" className={item} onClick={() => void run(async () => (await b()).admin.setEventStatus(event.id, "draft"), `"${event.title}" was unpublished and is now a draft.`)}>
            <EyeOff aria-hidden className="h-4 w-4" /> Unpublish
          </button>
        )}
        {reg && event.status === "registration_open" && (
          <button type="button" className={item} onClick={() => void run(async () => (await b()).admin.setEventStatus(event.id, "registration_closed"), "Registration closed.")}>
            <Ban aria-hidden className="h-4 w-4" /> Close registration
          </button>
        )}
        {reg && (event.status === "registration_closed" || event.status === "published") && (
          <button type="button" className={item} onClick={() => void run(async () => (await b()).admin.setEventStatus(event.id, "registration_open"), "Registration opened.")}>
            <CalendarDays aria-hidden className="h-4 w-4" /> Open registration
          </button>
        )}
        {live && event.status !== "completed" && event.status !== "cancelled" && (
          <button type="button" className={item} onClick={() => void run(async () => (await b()).admin.setEventStatus(event.id, "completed"), "Marked as completed.")}>
            <CheckCheck aria-hidden className="h-4 w-4" /> Mark completed
          </button>
        )}
        {event.status !== "cancelled" && (
          <button type="button" className={`${item} text-danger`} onClick={() => (close(), onCancel())}>
            <Ban aria-hidden className="h-4 w-4" /> Cancel event
          </button>
        )}
        <button type="button" className={`${item} border-t border-line text-danger`} onClick={() => (close(), onDelete())}>
          <Trash2 aria-hidden className="h-4 w-4" /> Delete
        </button>
      </div>
    </details>
  );
}

/** Admin Dashboard → Events. */
export default function AdminEvents() {
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listAllEvents());
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [cancelling, setCancelling] = useState<AcademyEvent | null>(null);
  const [deleting, setDeleting] = useState<AcademyEvent | null>(null);
  const [busy, setBusy] = useState(false);

  const all = data ?? [];
  const now = Date.now();
  const counts = {
    upcoming: all.filter((e) => ["upcoming", "live"].includes(eventPhase(e, now))).length,
    past: all.filter((e) => ["past", "cancelled"].includes(eventPhase(e, now))).length,
  };
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return all
      .filter((e) => (tab === "upcoming" ? ["upcoming", "live"].includes(eventPhase(e, now)) : ["past", "cancelled"].includes(eventPhase(e, now))))
      .filter((e) => (!type || e.eventType === type) && (!status || e.status === status))
      .filter((e) => !t || [e.title, e.speakerName, e.slug, e.venue].some((v) => v?.toLowerCase().includes(t)))
      .sort((a, b) => (tab === "upcoming" ? a.startDatetime.localeCompare(b.startDatetime) : b.startDatetime.localeCompare(a.startDatetime)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tab, q, type, status]);

  if (error) return <Alert tone="error">{error}</Alert>;
  const flash = (text: string) => {
    setMsg({ tone: /couldn't|didn't|already|failed|not found/i.test(text) ? "error" : "success", text });
    void reload();
  };

  const confirmCancel = async () => {
    if (!cancelling) return;
    setBusy(true);
    try {
      await (await getBackend()).admin.setEventStatus(cancelling.id, "cancelled");
      flash(`"${cancelling.title}" was cancelled. It stays on the Events page marked as cancelled.`);
      setCancelling(null);
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't cancel the event." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHeading title="Events">
        <ButtonLink to="/admin/events/new">
          <Plus aria-hidden className="h-4 w-4" /> Create event
        </ButtonLink>
      </AdminHeading>

      <div role="tablist" aria-label="Events" className="-mt-4 mb-6 flex gap-6 border-b border-line">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-1 pb-2.5 text-[0.9375rem] capitalize ${tab === t ? "border-brass-dark font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {t} <span className="ml-1 rounded-full bg-sand px-2 py-0.5 text-[0.75rem] text-muted">{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-3">
        <TextField label="Search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, speaker or venue" />
        <SelectField label="Event type" value={type} onChange={setType}>
          <option value="">All types</option>
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Status" value={status} onChange={setStatus}>
          <option value="">All statuses</option>
          {EVENT_STATUSES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-4" aria-live="polite">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      </div>

      {!data ? (
        <PageLoading />
      ) : all.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong p-10 text-center">
          <CalendarDays aria-hidden className="mx-auto h-9 w-9 text-brass-dark" />
          <p className="mt-3 font-serif text-[1.4rem]">No events yet</p>
          <p className="mx-auto mt-1 max-w-md text-muted">Create a workshop, webinar, masterclass or Community Day. A title, date and time are all you need to start.</p>
          <ButtonLink to="/admin/events/new" className="mt-5">
            <Plus aria-hidden className="h-4 w-4" /> Create event
          </ButtonLink>
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-muted">{q || type || status ? "No events match these filters." : tab === "upcoming" ? "No upcoming events. Create one." : "No past events yet."}</p>
      ) : (
        <div className="table-scroll mt-4 rounded-2xl border border-line bg-paper">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>When</th>
                <th>Format</th>
                <th>Status</th>
                <th>Registered</th>
                <th className="sticky right-0 bg-sand">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td className="min-w-[13rem]">
                    <Link to={`/admin/events/${e.id}`} className="font-semibold hover:text-brass-dark">
                      {e.title}
                    </Link>
                    {e.isFeatured && <span className="ml-2 rounded-full bg-night px-2 py-0.5 text-[0.6875rem] text-cream">Featured</span>}
                    <span className="block font-mono text-[0.75rem] text-muted">/events/{e.slug}</span>
                  </td>
                  <td className="text-[0.875rem]">{eventTypeLabel(e.eventType)}</td>
                  <td className="whitespace-nowrap text-[0.875rem]">
                    {eventDateLabel(e).replace(/^\w+, /, "")}
                    <span className="block text-[0.75rem] text-muted">{eventTimeLabel(e, false)}</span>
                  </td>
                  <td className="whitespace-nowrap text-[0.875rem]">{eventFormatLabel(e.format)}</td>
                  <td>
                    <StatusPill status={e.status} />
                  </td>
                  <td className="whitespace-nowrap text-[0.875rem]">
                    {e.registrationRequired ? (
                      <Link to={`/admin/events/${e.id}/registrations`} className="font-semibold hover:text-brass-dark">
                        {e.registeredCount}
                        {e.maxParticipants !== null ? ` / ${e.maxParticipants}` : ""}
                      </Link>
                    ) : (
                      <span className="text-muted">Not required</span>
                    )}
                  </td>
                  <td className="sticky right-0 bg-paper text-right shadow-[-12px_0_12px_-12px_rgba(23,23,23,0.18)]">
                    <Row event={e} onChange={flash} onCancel={() => setCancelling(e)} onDelete={() => setDeleting(e)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!cancelling} title="Cancel this event?" onClose={() => setCancelling(null)}>
        {cancelling && (
          <>
            <p className="leading-relaxed">
              <strong>{cancelling.title}</strong> will show as cancelled on the Events page, and nobody can register for it. {cancelling.registeredCount > 0 ? `${cancelling.registeredCount} registered ${cancelling.registeredCount === 1 ? "person" : "people"} keep their registration on record, so you can contact them.` : ""}
            </p>
            <p className="mt-2 text-[0.875rem] text-muted">You can change the status back later from the event's Edit page.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={() => setCancelling(null)}>
                Keep event
              </Button>
              <Button variant="danger" disabled={busy} onClick={() => void confirmCancel()}>
                {busy ? "Cancelling…" : "Cancel event"}
              </Button>
            </div>
          </>
        )}
      </Modal>

      <DeleteDialog
        open={!!deleting}
        title="Delete this event?"
        confirmWord="DELETE"
        onClose={() => setDeleting(null)}
        onDelete={async () => {
          if (!deleting) return;
          await (await getBackend()).admin.deleteEvent(deleting.id);
          flash(`"${deleting.title}" was deleted.`);
        }}
      >
        {deleting && (
          <>
            <p>
              This permanently deletes <strong>{deleting.title}</strong>
              {deleting.registeredCount > 0 ? ` and its ${deleting.registeredCount} ${deleting.registeredCount === 1 ? "registration" : "registrations"}` : ""}. It disappears from the Events page.
            </p>
            <p className="text-[0.875rem] text-muted">To keep a public record that it didn't go ahead, cancel it instead. Deleting can't be undone.</p>
          </>
        )}
      </DeleteDialog>
    </>
  );
}
