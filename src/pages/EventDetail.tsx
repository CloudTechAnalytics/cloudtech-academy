import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, CalendarDays, CalendarPlus, Check, Clock, ExternalLink, Globe, MapPin, MessageCircle, Mic, Users, Video } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading, useAuth } from "@/lib/auth";
import { getBackend, type AcademyEvent, type EventRegistration } from "@/lib/backend";
import { eventDateLabel, eventFormatLabel, eventPhase, eventTimeLabel, googleCalendarUrl, registrationState, spotsLeft } from "@/lib/events";
import { useMyRegistrations } from "@/lib/event-data";
import { DateTile, StatusChip, TypeChip } from "@/components/EventCard";
import { Alert, TextField } from "@/components/Form";
import { Button, buttonClass } from "@/components/Button";

function InfoRow({ icon: Icon, label, children }: { icon: typeof Clock; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brass-pale/60 text-brass-dark">
        <Icon aria-hidden className="h-4 w-4" />
      </span>
      <div>
        <dt className="text-[0.8125rem] text-muted">{label}</dt>
        <dd className="font-medium">{children}</dd>
      </div>
    </div>
  );
}

/** The registration panel: a short form, a confirmation, or a plain message about why it isn't open. */
function Registration({ event, onChanged }: { event: AcademyEvent; onChanged: () => void }) {
  const auth = useAuth();
  const signedIn = auth.status === "signed-in";
  const { registrations, reload } = useMyRegistrations(signedIn);
  const mine = registrations.find((r) => r.eventId === event.id);
  const [done, setDone] = useState<EventRegistration | null>(null);
  const [link, setLink] = useState<string | null>(event.meetingUrl);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"fullName" | "email" | "phone", string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const state = registrationState(event);
  const registered = done ?? mine ?? null;

  useEffect(() => {
    if (auth.status === "signed-in") {
      setFullName((n) => n || auth.user.fullName);
      setEmail((m) => m || auth.user.email);
    }
  }, [auth]);
  // A registered learner gets the meeting link back on later visits.
  useEffect(() => {
    if (mine) void getBackend().then((b) => b.revealEventLink(event.id)).then((l) => l && setLink(l)).catch(() => undefined);
  }, [mine, event.id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (fullName.trim().length < 2) er.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) er.email = "Enter a valid email address.";
    if (!/^[0-9+()\-\s]{7,20}$/.test(phone.trim())) er.phone = "Enter a phone number we can reach you on, e.g. 0801 234 5678.";
    setErrors(er);
    setError(null);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      const b = await getBackend();
      const reg = await b.registerForEvent(event.id, { fullName: fullName.trim(), email: email.trim(), phone: phone.trim() });
      setDone(reg);
      const l = await b.revealEventLink(event.id, email.trim());
      if (l) setLink(l);
      await reload();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't register you.");
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    setBusy(true);
    try {
      await (await getBackend()).cancelMyRegistration(event.id);
      setDone(null);
      await reload();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't cancel.");
    } finally {
      setBusy(false);
    }
  };

  const left = spotsLeft(event);
  const calendar = (
    <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-brass-dark">
      <CalendarPlus aria-hidden className="h-4 w-4" /> Add to Google Calendar
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );

  return (
    <section id="register" aria-labelledby="register-title" className="scroll-mt-24 rounded-2xl border border-line bg-paper p-6">
      <h2 id="register-title" className="font-serif text-[1.4rem]">
        {registered ? "You're registered" : state === "open" || state === "external" ? "Register" : "Attend"}
      </h2>

      {registered ? (
        <div className="mt-4 space-y-4" aria-live="polite">
          <p className="flex items-start gap-2 rounded-lg border border-success/40 bg-success-bg px-4 py-3 text-[0.9375rem]">
            <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>
              Thanks, {registered.fullName.split(" ")[0]}. You're on the list for <strong>{event.title}</strong> on {eventDateLabel(event)}, {eventTimeLabel(event)}.
            </span>
          </p>
          {link && eventPhase(event) !== "past" && (
            <a href={link} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "w-full")}>
              Join Event <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {!link && event.format !== "physical" && <p className="text-[0.875rem] text-muted">The joining link will appear here before the event starts.</p>}
          {calendar}
          {mine && signedIn && (
            <p className="text-[0.8125rem] text-muted">
              Can't make it?{" "}
              <button type="button" onClick={() => void cancel()} disabled={busy} className="font-semibold text-brass-dark underline-offset-2 hover:underline">
                Cancel my registration
              </button>
            </p>
          )}
        </div>
      ) : state === "open" ? (
        <form noValidate className="mt-4 space-y-4" onSubmit={(e) => void submit(e)}>
          {left !== null && <p className="text-[0.875rem] text-muted">{left === 0 ? "No spots left." : `${left} of ${event.maxParticipants} spots left.`}</p>}
          <TextField label="Full name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <TextField label="Phone number" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} hint="Used only to reach you about this event." />
          {signedIn ? <p className="text-[0.8125rem] text-muted">Registering as {auth.user.email}: this will show in your dashboard.</p> : <p className="text-[0.8125rem] text-muted">No account needed.</p>}
          <div aria-live="polite">{error && <Alert tone="error">{error}</Alert>}</div>
          <Button type="submit" loading={busy} className="w-full">
            Register
          </Button>
        </form>
      ) : state === "external" ? (
        <div className="mt-4 space-y-3">
          <p className="text-[0.9375rem] text-muted">Registration for this event is on another site.</p>
          <a href={event.registrationUrl!} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "w-full")}>
            Register <ExternalLink aria-hidden className="h-4 w-4" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      ) : state === "not_required" ? (
        <div className="mt-4 space-y-4">
          <p className="text-[0.9375rem]">No registration needed: everyone is welcome.</p>
          {event.meetingUrl && (
            <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "w-full")}>
              Join Event <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {calendar}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-line-strong bg-sand px-4 py-3 text-[0.9375rem]">
          {state === "full" && "This event is full."}
          {state === "closed" && "Registration for this event has closed."}
          {state === "ended" && "This event has ended."}
          {state === "cancelled" && "This event was cancelled."}
        </p>
      )}
    </section>
  );
}

/** /events/:slug */
export default function EventDetail() {
  const { slug = "" } = useParams();
  const [event, setEvent] = useState<AcademyEvent | null | undefined>(undefined);
  const load = () => void getBackend().then((b) => b.getEvent(slug)).then(setEvent).catch(() => setEvent(null));
  useEffect(() => {
    setEvent(undefined);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  useSeo({
    title: event ? `${event.title} | CloudTech Academy Events` : "Event | CloudTech Academy",
    description: event?.shortDescription ?? "An event from CloudTech Academy.",
    noindex: !event,
  });

  if (event === undefined) return <PageLoading label="Loading event…" />;
  if (!event)
    return (
      <div className="container-page py-20">
        <h1 className="font-serif text-[2.2rem]">Event not found</h1>
        <p className="mt-3 text-muted">It may have been removed, or the link is wrong.</p>
        <Link to="/events" className="mt-5 inline-block font-semibold text-brass-dark">
          See all events
        </Link>
      </div>
    );

  const phase = eventPhase(event);
  const inPerson = event.format !== "online";

  return (
    <div className="pb-20">
      {event.coverImage ? (
        <img src={event.coverImage} alt="" className="max-h-[22rem] w-full object-cover" />
      ) : (
        <div className="bg-gradient-to-br from-night to-[#2A2926]">
          <div className="container-page flex items-center gap-6 py-10 sm:py-14">
            <DateTile event={event} className="h-28 w-28 shrink-0 border border-brass/40 bg-transparent" />
            <span className="text-[0.875rem] font-semibold uppercase tracking-[0.22em] text-brass-light">CloudTech Academy Events</span>
          </div>
        </div>
      )}

      <div className="container-page pt-8">
        <Link to="/events" className="inline-flex items-center gap-1.5 text-[0.875rem] text-muted hover:text-ink">
          <ArrowLeft aria-hidden className="h-4 w-4" /> All events
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <TypeChip event={event} />
          <StatusChip event={event} />
        </div>
        <h1 className="mt-3 max-w-3xl font-serif text-[2.2rem] leading-tight sm:text-[2.9rem]">{event.title}</h1>
        {event.shortDescription && <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">{event.shortDescription}</p>}

        {phase === "cancelled" && (
          <div className="mt-6 max-w-2xl">
            <Alert tone="error">This event was cancelled.</Alert>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-10">
            <dl className="grid gap-5 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
              <InfoRow icon={CalendarDays} label="Date">
                {eventDateLabel(event)}
              </InfoRow>
              <InfoRow icon={Clock} label="Time">
                {eventTimeLabel(event)}
              </InfoRow>
              <InfoRow icon={event.format === "online" ? Globe : event.format === "physical" ? MapPin : Video} label="Format">
                {eventFormatLabel(event.format)}
              </InfoRow>
              {inPerson && event.venue && (
                <InfoRow icon={MapPin} label="Venue">
                  {event.venue}
                </InfoRow>
              )}
              {event.format !== "physical" && !event.venue && event.format === "online" && (
                <InfoRow icon={Globe} label="Where">
                  Online. The joining link {event.registrationRequired ? "is shared with people who register" : "is on this page"}.
                </InfoRow>
              )}
              {event.maxParticipants !== null && (
                <InfoRow icon={Users} label="Places">
                  {event.maxParticipants} in total
                </InfoRow>
              )}
            </dl>

            {event.speakerName && (
              <section aria-labelledby="speaker-title">
                <h2 id="speaker-title" className="font-serif text-[1.5rem]">
                  Speaker
                </h2>
                <div className="mt-4 flex items-center gap-4">
                  {event.speakerImage ? (
                    <img src={event.speakerImage} alt="" className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brass-pale/70 text-brass-dark">
                      <Mic aria-hidden className="h-6 w-6" />
                    </span>
                  )}
                  <div>
                    <p className="text-[1.0625rem] font-semibold">{event.speakerName}</p>
                    {event.speakerTitle && <p className="text-[0.9375rem] text-muted">{event.speakerTitle}</p>}
                  </div>
                </div>
              </section>
            )}

            {event.description && (
              <section aria-labelledby="about-title">
                <h2 id="about-title" className="font-serif text-[1.5rem]">
                  About this event
                </h2>
                <div className="mt-4 max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed">
                  {event.description.split(/\n{2,}/).map((p, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {event.learnPoints.length > 0 && (
              <section aria-labelledby="learn-title">
                <h2 id="learn-title" className="font-serif text-[1.5rem]">
                  What you'll learn
                </h2>
                <ul className="mt-4 max-w-2xl space-y-3">
                  {event.learnPoints.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[1.0625rem]">
                      <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-success" />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Registration event={event} onChanged={load} />
            {event.whatsappUrl && phase !== "past" && phase !== "cancelled" && (
              <div className="rounded-2xl border border-line bg-paper p-6">
                <h2 className="font-serif text-[1.25rem]">Event group</h2>
                <p className="mt-1 text-[0.9375rem] text-muted">Chat with other attendees and get reminders for this event on WhatsApp.</p>
                <a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "mt-4 w-full")}>
                  <MessageCircle aria-hidden className="h-4 w-4" /> Join on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
