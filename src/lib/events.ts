import type { AcademyEvent, EventFormat, EventInput, EventStatus, EventType } from "./backend/types";

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "workshop", label: "Workshop" },
  { value: "webinar", label: "Webinar" },
  { value: "seminar", label: "Seminar" },
  { value: "community_day", label: "Community Day" },
  { value: "practical_session", label: "Practical Session" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "masterclass", label: "Masterclass" },
  { value: "career_session", label: "Career Session" },
  { value: "guest_session", label: "Guest Session" },
  { value: "networking", label: "Networking Event" },
  { value: "competition", label: "Competition / Challenge" },
  { value: "conference", label: "Conference" },
  { value: "training", label: "Training" },
  { value: "other", label: "Other" },
];

export const EVENT_FORMATS: { value: EventFormat; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "physical", label: "In person" },
  { value: "hybrid", label: "Hybrid" },
];

export const EVENT_STATUSES: { value: EventStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "registration_open", label: "Registration open" },
  { value: "registration_closed", label: "Registration closed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

/** A short list of zones; Africa/Lagos is the default. Any IANA zone saved earlier still displays correctly. */
export const TIMEZONES: { value: string; label: string }[] = [
  { value: "Africa/Lagos", label: "West Africa Time (Lagos)" },
  { value: "Africa/Nairobi", label: "East Africa Time (Nairobi)" },
  { value: "Africa/Johannesburg", label: "South Africa (Johannesburg)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Berlin", label: "Central Europe (Berlin)" },
  { value: "America/New_York", label: "US Eastern (New York)" },
  { value: "America/Los_Angeles", label: "US Pacific (Los Angeles)" },
  { value: "Asia/Dubai", label: "Gulf (Dubai)" },
  { value: "Asia/Kolkata", label: "India (Kolkata)" },
  { value: "UTC", label: "UTC" },
];

export const eventTypeLabel = (t: EventType) => EVENT_TYPES.find((x) => x.value === t)?.label ?? "Event";
export const eventFormatLabel = (f: EventFormat) => EVENT_FORMATS.find((x) => x.value === f)?.label ?? "";
export const eventStatusLabel = (s: EventStatus) => EVENT_STATUSES.find((x) => x.value === s)?.label ?? s;

/** "excel-workshop-october" from a title. */
export const slugify = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/* ---------------------------------------------------------------- time zones */

/** How far the zone is ahead of UTC at an instant, in milliseconds. */
function offsetMs(ts: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(new Date(ts));
  const o = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute, +o.second) - Math.floor(ts / 1000) * 1000;
}

/** The instant (ISO, UTC) at which a wall-clock date and time happens in the given zone. */
export function zonedToUtc(date: string, time: string, timeZone: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let utc = guess - offsetMs(guess, timeZone);
  const again = guess - offsetMs(utc, timeZone);
  if (again !== utc) utc = again; // the offset changed between the guess and the answer (daylight saving)
  return new Date(utc).toISOString();
}

/** A UTC instant as the zone's wall-clock date (YYYY-MM-DD) and time (HH:mm), for form fields. */
export function utcToZoned(iso: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(iso));
  const o = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return { date: `${o.year}-${o.month}-${o.day}`, time: `${o.hour === "24" ? "00" : o.hour}:${o.minute}` };
}

const safeZone = (tz: string) => {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
};

/** "Saturday, 17 October 2026", in the event's own time zone. */
export const eventDateLabel = (e: Pick<AcademyEvent, "startDatetime" | "timezone">) =>
  new Date(e.startDatetime).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: safeZone(e.timezone) });

/** "17 Oct" and "Sat", for compact date tiles. */
export const eventDayParts = (e: Pick<AcademyEvent, "startDatetime" | "timezone">) => {
  const tz = safeZone(e.timezone);
  const d = new Date(e.startDatetime);
  return {
    day: d.toLocaleDateString("en-GB", { day: "numeric", timeZone: tz }),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: tz }),
    weekday: d.toLocaleDateString("en-GB", { weekday: "short", timeZone: tz }),
  };
};

/** "10:00 AM – 12:00 PM (WAT)". Without an end time it's just the start. */
export function eventTimeLabel(e: Pick<AcademyEvent, "startDatetime" | "endDatetime" | "timezone">, withZone = true) {
  const tz = safeZone(e.timezone);
  const fmt = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });
  const zone = new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "short" }).formatToParts(new Date(e.startDatetime)).find((p) => p.type === "timeZoneName")?.value ?? "";
  const range = e.endDatetime ? `${fmt(e.startDatetime)} – ${fmt(e.endDatetime)}` : fmt(e.startDatetime);
  return withZone && zone ? `${range} (${zone})` : range;
}

/* ---------------------------------------------------------------- what state an event is in */

const THREE_HOURS = 3 * 3_600_000;

/** When the event is over: its end time, or three hours after it starts when no end time was given. */
export const eventEnd = (e: Pick<AcademyEvent, "startDatetime" | "endDatetime">) => (e.endDatetime ? new Date(e.endDatetime).getTime() : new Date(e.startDatetime).getTime() + THREE_HOURS);

export type EventPhase = "upcoming" | "live" | "past" | "cancelled";

/** What the event looks like to a visitor: a published event that's over counts as past even if nobody marked it completed. */
export function eventPhase(e: Pick<AcademyEvent, "startDatetime" | "endDatetime" | "status">, now = Date.now()): EventPhase {
  if (e.status === "cancelled") return "cancelled";
  if (e.status === "completed" || eventEnd(e) < now) return "past";
  if (new Date(e.startDatetime).getTime() <= now) return "live";
  return "upcoming";
}

export type RegistrationState =
  | "not_required" // nothing to sign up for
  | "open" // register here
  | "external" // register on another site
  | "full"
  | "closed"
  | "ended"
  | "cancelled";

export function registrationState(e: AcademyEvent, now = Date.now()): RegistrationState {
  const phase = eventPhase(e, now);
  if (phase === "cancelled") return "cancelled";
  if (phase === "past") return "ended";
  if (!e.registrationRequired) return "not_required";
  if (e.status === "registration_closed") return "closed";
  if (e.maxParticipants !== null && e.registeredCount >= e.maxParticipants) return "full";
  return e.registrationUrl ? "external" : "open";
}

export const spotsLeft = (e: Pick<AcademyEvent, "maxParticipants" | "registeredCount">) => (e.maxParticipants === null ? null : Math.max(0, e.maxParticipants - e.registeredCount));

/** Upcoming and live events, soonest first. */
export const upcomingEvents = (events: AcademyEvent[], now = Date.now()) =>
  events.filter((e) => ["upcoming", "live"].includes(eventPhase(e, now))).sort((a, b) => a.startDatetime.localeCompare(b.startDatetime));

/** Past and cancelled events, most recent first. */
export const pastEvents = (events: AcademyEvent[], now = Date.now()) =>
  events.filter((e) => ["past", "cancelled"].includes(eventPhase(e, now))).sort((a, b) => b.startDatetime.localeCompare(a.startDatetime));

/** The label for the card's status chip. */
export function statusChip(e: AcademyEvent, now = Date.now()): { label: string; tone: "good" | "warn" | "muted" | "bad" } {
  const phase = eventPhase(e, now);
  if (phase === "cancelled") return { label: "Cancelled", tone: "bad" };
  if (phase === "past") return { label: "Completed", tone: "muted" };
  if (phase === "live") return { label: "Happening now", tone: "good" };
  const reg = registrationState(e, now);
  if (reg === "full") return { label: "Full", tone: "warn" };
  if (reg === "closed") return { label: "Registration closed", tone: "muted" };
  if (reg === "open" || reg === "external") return { label: "Registration open", tone: "good" };
  return { label: "Open to all", tone: "good" };
}

/** An "Add to Google Calendar" link. */
export function googleCalendarUrl(e: AcademyEvent) {
  const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const where = e.format === "online" ? (e.meetingUrl ?? "Online") : (e.venue ?? "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(new Date(e.startDatetime).getTime())}/${stamp(eventEnd(e))}`,
    details: e.shortDescription ?? "",
    location: where,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/* ---------------------------------------------------------------- forms */

export const WHATSAPP_URL_RE = /^https:\/\/(chat\.whatsapp\.com|wa\.me|whatsapp\.com|www\.whatsapp\.com)\/\S+$/i;
export const WEB_URL_RE = /^https?:\/\/\S+$/i;

export const emptyEventInput = (): EventInput => ({
  title: "",
  slug: "",
  eventType: "workshop",
  shortDescription: null,
  description: null,
  learnPoints: [],
  coverImage: null,
  startDatetime: "",
  endDatetime: null,
  timezone: "Africa/Lagos",
  venue: null,
  format: "online",
  meetingUrl: null,
  registrationUrl: null,
  whatsappUrl: null,
  speakerName: null,
  speakerTitle: null,
  speakerImage: null,
  maxParticipants: null,
  registrationRequired: false,
  status: "draft",
  isFeatured: false,
  series: null,
});

/** Same checks the database makes, with friendlier messages. Returns field → message. */
export function validateEvent(e: EventInput): Record<string, string> {
  const err: Record<string, string> = {};
  if (e.title.trim().length < 3) err.title = "Give the event a title (at least 3 characters).";
  if (!e.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug)) err.slug = "Use lowercase letters, numbers and hyphens only.";
  if (!e.startDatetime) err.date = "Choose the date and start time.";
  if (e.startDatetime && e.endDatetime && e.endDatetime <= e.startDatetime) err.endTime = "The end time must be after the start time.";
  if (e.meetingUrl && !WEB_URL_RE.test(e.meetingUrl)) err.meetingUrl = "Enter a full link starting with https://";
  if (e.registrationUrl && !WEB_URL_RE.test(e.registrationUrl)) err.registrationUrl = "Enter a full link starting with https://";
  if (e.whatsappUrl && !WHATSAPP_URL_RE.test(e.whatsappUrl)) err.whatsappUrl = "Use a WhatsApp link, such as https://chat.whatsapp.com/…";
  if (e.maxParticipants !== null && (!Number.isInteger(e.maxParticipants) || e.maxParticipants < 1)) err.maxParticipants = "Enter a whole number, or leave it empty for no limit.";
  if ((e.shortDescription ?? "").length > 300) err.shortDescription = "Keep it under 300 characters.";
  return err;
}
