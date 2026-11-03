import { Link } from "react-router";
import { CalendarDays, Clock, Globe, MapPin, Mic, Users, Video } from "lucide-react";
import type { AcademyEvent } from "@/lib/backend";
import { eventDateLabel, eventDayParts, eventFormatLabel, eventPhase, eventTimeLabel, eventTypeLabel, registrationState, spotsLeft, statusChip } from "@/lib/events";
import { buttonClass } from "./Button";

const TONES = {
  good: "border-success/40 bg-success-bg text-success",
  warn: "border-brass/50 bg-brass-pale/60 text-brass-dark",
  muted: "border-line-strong bg-sand text-muted",
  bad: "border-danger/40 bg-danger/10 text-danger",
};

export function StatusChip({ event }: { event: AcademyEvent }) {
  const c = statusChip(event);
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.75rem] font-medium ${TONES[c.tone]}`}>{c.label}</span>;
}

export function TypeChip({ event }: { event: AcademyEvent }) {
  return <span className="inline-flex items-center rounded-full bg-brass-pale/70 px-2.5 py-0.5 text-[0.75rem] font-semibold text-brass-dark">{eventTypeLabel(event.eventType)}</span>;
}

const FormatIcon = ({ format }: { format: AcademyEvent["format"] }) =>
  format === "online" ? <Globe aria-hidden className="h-4 w-4" /> : format === "physical" ? <MapPin aria-hidden className="h-4 w-4" /> : <Video aria-hidden className="h-4 w-4" />;

/** A calm date tile for when there's no cover image: the event's own day and month. */
export function DateTile({ event, className = "" }: { event: AcademyEvent; className?: string }) {
  const d = eventDayParts(event);
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl bg-night text-cream ${className}`} aria-hidden>
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-brass-light">{d.weekday}</span>
      <span className="font-serif text-[2.2rem] leading-none">{d.day}</span>
      <span className="text-[0.75rem] uppercase tracking-[0.14em] text-cream/75">{d.month}</span>
    </div>
  );
}

/** What the card's main button should say and do. */
export function eventAction(e: AcademyEvent): { label: string; href: string; external: boolean; primary: boolean } {
  const reg = registrationState(e);
  const detail = `/events/${e.slug}`;
  if (reg === "open") return { label: "Register", href: `${detail}#register`, external: false, primary: true };
  if (reg === "external") return { label: "Register", href: e.registrationUrl!, external: true, primary: true };
  if (reg === "not_required" && e.meetingUrl && eventPhase(e) !== "past") return { label: "Join Event", href: e.meetingUrl, external: true, primary: true };
  return { label: eventPhase(e) === "past" ? "View details" : "Details", href: detail, external: false, primary: false };
}

/** An event in a list: cover or date tile, type, title, when, where, a short description and one clear button. */
export function EventCard({ event, featured = false }: { event: AcademyEvent; featured?: boolean }) {
  const action = eventAction(event);
  const left = spotsLeft(event);
  const past = eventPhase(event) === "past" || eventPhase(event) === "cancelled";
  const btn = buttonClass(action.primary ? "primary" : "secondary", "w-full sm:w-auto");
  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl border bg-paper ${featured ? "border-brass/50" : "border-line"} ${past ? "opacity-90" : ""}`}>
      <Link to={`/events/${event.slug}`} tabIndex={-1} aria-hidden className="block">
        {event.coverImage ? (
          <img src={event.coverImage} alt="" loading="lazy" className="aspect-[16/8] w-full object-cover" />
        ) : (
          <div className="flex aspect-[16/8] items-center gap-5 bg-gradient-to-br from-night to-[#2A2926] px-7">
            <DateTile event={event} className="h-24 w-24 shrink-0 border border-brass/40 bg-transparent" />
            <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-brass-light">{eventTypeLabel(event.eventType)}</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <TypeChip event={event} />
          <StatusChip event={event} />
          {featured && <span className="rounded-full bg-night px-2.5 py-0.5 text-[0.75rem] font-medium text-cream">Featured</span>}
        </div>
        <h3 className="mt-3 font-serif text-[1.35rem] leading-snug">
          <Link to={`/events/${event.slug}`} className="hover:text-brass-dark">
            {event.title}
          </Link>
        </h3>
        <dl className="mt-3 space-y-1.5 text-[0.9rem] text-muted">
          <div className="flex items-center gap-2">
            <CalendarDays aria-hidden className="h-4 w-4 shrink-0" />
            <dt className="sr-only">Date</dt>
            <dd>{eventDateLabel(event)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock aria-hidden className="h-4 w-4 shrink-0" />
            <dt className="sr-only">Time</dt>
            <dd>{eventTimeLabel(event)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <FormatIcon format={event.format} />
            <dt className="sr-only">Format</dt>
            <dd>
              {eventFormatLabel(event.format)}
              {event.venue && event.format !== "online" ? `: ${event.venue}` : ""}
            </dd>
          </div>
          {event.speakerName && (
            <div className="flex items-center gap-2">
              <Mic aria-hidden className="h-4 w-4 shrink-0" />
              <dt className="sr-only">Speaker</dt>
              <dd>{event.speakerName}</dd>
            </div>
          )}
        </dl>
        {event.shortDescription && <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink">{event.shortDescription}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {action.external ? (
            <a href={action.href} target="_blank" rel="noopener noreferrer" className={btn}>
              {action.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Link to={action.href} className={btn}>
              {action.label}
            </Link>
          )}
          {action.primary && !action.external ? null : action.label === "Details" || action.label === "View details" ? null : (
            <Link to={`/events/${event.slug}`} className="text-[0.875rem] font-semibold text-brass-dark">
              Details
            </Link>
          )}
          {left !== null && !past && left <= 10 && (
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted">
              <Users aria-hidden className="h-3.5 w-3.5" /> {left === 0 ? "Full" : `${left} ${left === 1 ? "spot" : "spots"} left`}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
