import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { Check, ExternalLink } from "lucide-react";
import { getBackend, type AcademyEvent, type EventInput } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { EVENT_FORMATS, EVENT_STATUSES, EVENT_TYPES, TIMEZONES, emptyEventInput, slugify, utcToZoned, validateEvent, zonedToUtc } from "@/lib/events";
import { Alert, TextArea, TextField } from "@/components/Form";
import { Button, ButtonLink } from "@/components/Button";
import { CheckField, ImageField, SelectField } from "@/components/FormExtras";
import { EventCard } from "@/components/EventCard";
import { AdminHeading } from "./AdminLayout";

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <legend className="px-1 font-serif text-[1.25rem]">{title}</legend>
      {note && <p className="-mt-1 mb-4 text-[0.875rem] text-muted">{note}</p>}
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

type Form = EventInput & { date: string; startTime: string; endTime: string; pointsText: string };

const toForm = (e: AcademyEvent | null): Form => {
  if (!e) return { ...emptyEventInput(), date: "", startTime: "", endTime: "", pointsText: "" };
  const start = utcToZoned(e.startDatetime, e.timezone);
  const end = e.endDatetime ? utcToZoned(e.endDatetime, e.timezone) : null;
  const { registeredCount: _r, createdAt: _c, updatedAt: _u, ...rest } = e;
  void _r; void _c; void _u;
  return { ...rest, date: start.date, startTime: start.time, endTime: end?.time ?? "", pointsText: e.learnPoints.join("\n") };
};

/** The event as it will be saved: wall-clock fields combined into UTC instants in the event's time zone. */
function toInput(f: Form): EventInput {
  const { date, startTime, endTime, pointsText, ...rest } = f;
  const start = date && startTime ? zonedToUtc(date, startTime, f.timezone) : "";
  const end = date && endTime ? zonedToUtc(date, endTime, f.timezone) : null;
  return { ...rest, startDatetime: start, endDatetime: end, learnPoints: pointsText.split("\n").map((x) => x.trim()).filter(Boolean) };
}

/** Admin Dashboard → Events → Create / Edit. Only a title, date and start time are required. */
export default function AdminEventForm() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const editing = !!eventId;
  const [form, setForm] = useState<Form>(toForm(null));
  const [slugEdited, setSlugEdited] = useState(false);
  const [loaded, setLoaded] = useState(!editing);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const created = (useLocation().state as { created?: boolean } | null)?.created;
  const [saved, setSaved] = useState<AcademyEvent | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    void getBackend()
      .then((b) => b.admin.getEventById(eventId))
      .then((e) => {
        if (!e) return setLoadError("Event not found.");
        setForm(toForm(e));
        setSlugEdited(true);
        setLoaded(true);
      })
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : "Couldn't load the event."));
  }, [eventId]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const preview = useMemo<AcademyEvent | null>(() => {
    const input = toInput(form);
    if (!input.startDatetime) return null;
    return { ...input, id: "preview", title: input.title || "Your event title", registeredCount: 0, createdAt: "", updatedAt: "" } as AcademyEvent;
  }, [form]);

  const save = async (status?: AcademyEvent["status"]) => {
    setError(null);
    const input = { ...toInput(form), ...(status ? { status } : {}) };
    const e = validateEvent(input);
    if (form.endTime && form.startTime && form.endTime <= form.startTime) e.endTime = "The end time must be after the start time.";
    if (!form.date) e.date = "Choose the date.";
    else if (!form.startTime) e.startTime = "Choose the start time.";
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setBusy(true);
    try {
      const result = await (await getBackend()).admin.saveEvent({ ...input, id: eventId });
      setSaved(result);
      if (!editing) navigate(`/admin/events/${result.id}`, { replace: true, state: { created: true } });
      else setForm(toForm(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the event.");
    } finally {
      setBusy(false);
    }
  };

  if (loadError)
    return (
      <>
        <AdminHeading title="Event" />
        <Alert tone="error">{loadError}</Alert>
        <Link to="/admin/events" className="mt-4 inline-block font-semibold text-brass-dark">
          ← All events
        </Link>
      </>
    );
  if (!loaded) return <PageLoading />;

  const publishStatus = form.registrationRequired ? "registration_open" : "published";
  const isDraft = form.status === "draft";
  const inPerson = form.format !== "online";
  const online = form.format !== "physical";

  return (
    <div>
      <Link to="/admin/events" className="text-[0.875rem] text-muted hover:text-ink">
        ← All events
      </Link>
      <AdminHeading title={editing ? "Edit event" : "Create event"}>
        {editing && (
          <>
            <ButtonLink to={`/admin/events/${eventId}/registrations`} variant="secondary">
              Registrations
            </ButtonLink>
            {form.status !== "draft" && (
              <Link to={`/events/${form.slug}`} target="_blank" className="inline-flex min-h-11 items-center gap-2 px-3 text-[0.9375rem] font-semibold text-brass-dark">
                View page <ExternalLink aria-hidden className="h-4 w-4" />
              </Link>
            )}
          </>
        )}
      </AdminHeading>

      <div aria-live="polite" className="mb-5 space-y-3">
        {(saved || created) && (
          <Alert tone="success">
            <Check aria-hidden className="mr-1 inline h-4 w-4" /> {created && !saved ? "Event created." : "Saved."}{" "}
            {(saved?.status ?? form.status) === "draft" ? "It's a draft, so only admins can see it." : "It's live on the Events page."}
          </Alert>
        )}
        {error && <Alert tone="error">{error}</Alert>}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <form
          noValidate
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <Section title="The basics">
            <div className="sm:col-span-2">
              <TextField
                label="Event title"
                value={form.title}
                maxLength={150}
                error={errors.title}
                placeholder="e.g. Excel for Beginners Workshop"
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!slugEdited) set("slug", slugify(e.target.value));
                }}
              />
            </div>
            <SelectField label="Event type" value={form.eventType} onChange={(v) => set("eventType", v as Form["eventType"])}>
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectField>
            <TextField
              label="Web address"
              value={form.slug}
              error={errors.slug}
              hint={errors.slug ? undefined : `/events/${form.slug || "…"}`}
              onChange={(e) => {
                setSlugEdited(true);
                set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
              }}
            />
            <div className="sm:col-span-2">
              <TextArea label="Short description" rows={2} maxLength={300} value={form.shortDescription ?? ""} error={errors.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="One or two sentences, shown on event cards." />
              <p className="mt-1 text-right text-[0.75rem] text-muted">{(form.shortDescription ?? "").length}/300</p>
            </div>
            <div className="sm:col-span-2">
              <TextArea label="Full description (optional)" rows={6} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="What the event is about. Leave a blank line between paragraphs." />
            </div>
            <div className="sm:col-span-2">
              <TextArea label="What attendees will learn (optional)" rows={4} value={form.pointsText} onChange={(e) => set("pointsText", e.target.value)} placeholder={"One point per line:\nBuild a pivot table\nClean messy data"} />
            </div>
            <div className="sm:col-span-2">
              <ImageField label="Cover image (optional)" value={form.coverImage} onChange={(v) => set("coverImage", v)} />
            </div>
          </Section>

          <Section title="When" note="Times are in the time zone you choose, and shown that way to everyone.">
            <TextField label="Date" type="date" value={form.date} error={errors.date} onChange={(e) => set("date", e.target.value)} />
            <SelectField label="Time zone" value={TIMEZONES.some((z) => z.value === form.timezone) ? form.timezone : "UTC"} onChange={(v) => set("timezone", v)}>
              {TIMEZONES.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </SelectField>
            <TextField label="Start time" type="time" value={form.startTime} error={errors.startTime} onChange={(e) => set("startTime", e.target.value)} />
            <TextField label="End time (optional)" type="time" value={form.endTime} error={errors.endTime} onChange={(e) => set("endTime", e.target.value)} />
          </Section>

          <Section title="Where">
            <div className="sm:col-span-2">
              <SelectField label="Format" value={form.format} onChange={(v) => set("format", v as Form["format"])}>
                {EVENT_FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </SelectField>
            </div>
            {inPerson && (
              <div className="sm:col-span-2">
                <TextField label="Venue" value={form.venue ?? ""} onChange={(e) => set("venue", e.target.value)} placeholder="e.g. CloudTech Hub, Wuse 2, Abuja" maxLength={300} />
              </div>
            )}
            {online && (
              <div className="sm:col-span-2">
                <TextField
                  label="Meeting link (optional)"
                  type="url"
                  value={form.meetingUrl ?? ""}
                  error={errors.meetingUrl}
                  onChange={(e) => set("meetingUrl", e.target.value)}
                  placeholder="https://meet.google.com/…"
                  hint={form.registrationRequired ? "Only people who register see this link." : "Shown to everyone on the event page."}
                />
              </div>
            )}
          </Section>

          <Section title="Registration" note="Not every event needs one. A casual Community Day can skip this whole section.">
            <div className="sm:col-span-2">
              <CheckField label="Registration required" hint="Visitors register on the event page with their name, email and phone number. No account needed." checked={form.registrationRequired} onChange={(v) => set("registrationRequired", v)} />
            </div>
            {form.registrationRequired && (
              <>
                <TextField
                  label="Maximum participants (optional)"
                  type="number"
                  min={1}
                  value={form.maxParticipants ?? ""}
                  error={errors.maxParticipants}
                  onChange={(e) => set("maxParticipants", e.target.value === "" ? null : Number(e.target.value))}
                  hint="Registration closes automatically when it's full."
                />
                <TextField
                  label="External registration link (optional)"
                  type="url"
                  value={form.registrationUrl ?? ""}
                  error={errors.registrationUrl}
                  onChange={(e) => set("registrationUrl", e.target.value)}
                  hint="If you register people elsewhere, add the link: the Register button goes there instead."
                />
              </>
            )}
          </Section>

          <Section title="Speaker (optional)">
            <TextField label="Speaker name" value={form.speakerName ?? ""} onChange={(e) => set("speakerName", e.target.value)} maxLength={120} />
            <TextField label="Speaker title" value={form.speakerTitle ?? ""} onChange={(e) => set("speakerTitle", e.target.value)} placeholder="e.g. Data Analyst at Paystream" maxLength={160} />
            <div className="sm:col-span-2">
              <ImageField label="Speaker photo" shape="round" value={form.speakerImage} onChange={(v) => set("speakerImage", v)} />
            </div>
          </Section>

          <Section title="WhatsApp (optional)" note="An event can have its own WhatsApp group. It never uses the main community link unless you paste that link here yourself.">
            <div className="sm:col-span-2">
              <TextField label="Event WhatsApp link" type="url" value={form.whatsappUrl ?? ""} error={errors.whatsappUrl} onChange={(e) => set("whatsappUrl", e.target.value)} placeholder="https://chat.whatsapp.com/…" />
            </div>
          </Section>

          <Section title="Publishing">
            <SelectField
              label="Status"
              value={form.status}
              onChange={(v) => set("status", v as Form["status"])}
              hint="Draft events are visible to admins only. Completed and cancelled events move to Past events."
            >
              {EVENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </SelectField>
            <div className="self-center">
              <CheckField label="Featured event" hint="Shown first on the Events page." checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} />
            </div>
          </Section>

          <div className="flex flex-wrap gap-3">
            {isDraft ? (
              <>
                <Button type="submit" variant="secondary" disabled={busy}>
                  {busy ? "Saving…" : "Save draft"}
                </Button>
                <Button type="button" disabled={busy} onClick={() => void save(publishStatus)}>
                  Publish event
                </Button>
              </>
            ) : (
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
              </Button>
            )}
            <ButtonLink to="/admin/events" variant="ghost">
              Cancel
            </ButtonLink>
          </div>
        </form>

        <aside className="xl:sticky xl:top-24 xl:self-start" aria-label="Preview">
          <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-muted">Preview</p>
          {preview ? <EventCard event={preview} /> : <p className="rounded-2xl border border-dashed border-line-strong p-6 text-[0.9375rem] text-muted">Choose a date and start time to see how the event will look on the Events page.</p>}
        </aside>
      </div>
    </div>
  );
}
