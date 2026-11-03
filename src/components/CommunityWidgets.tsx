import { Link } from "react-router";
import { ArrowRight, Bell, CalendarDays, MessageCircle } from "lucide-react";
import type { AcademyEvent, EventRegistration } from "@/lib/backend";
import { CommunityButton, useCommunity } from "@/lib/community";
import { useEvents } from "@/lib/event-data";
import { eventDateLabel, eventPhase, eventTimeLabel, eventFormatLabel, eventTypeLabel, registrationState, upcomingEvents } from "@/lib/events";
import { buttonClass } from "./Button";
import { EventCard, eventAction } from "./EventCard";

/** "Learn. Build. Connect." on the public homepage. Appears only while the community is active. */
export function ConnectSection() {
  const { community } = useCommunity();
  const { events } = useEvents();
  if (!community) return null;
  const next = upcomingEvents(events ?? []).slice(0, 3);
  return (
    <section aria-labelledby="connect-title" className="border-y border-line bg-paper py-16 sm:py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="kicker">Community</p>
          <h2 id="connect-title" className="mt-2 font-serif text-[1.85rem] leading-tight sm:text-[2.25rem]">
            Learn. Build. Connect.
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
            CloudTech Academy is more than courses. Join a growing community of learners, participate in practical sessions, workshops, masterclasses and other
            opportunities designed to help you build real skills.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CommunityButton source="homepage">Join the Community</CommunityButton>
            <Link to="/events" className={buttonClass("secondary")}>
              Explore Events
            </Link>
          </div>
        </div>
        {next.length > 0 && (
          <div className="mt-10">
            <h3 className="font-serif text-[1.3rem]">Coming up</h3>
            <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {next.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/** A subtle card on the learner dashboard. Renders nothing while the community is off. */
export function DashboardCommunityCard() {
  const { community } = useCommunity();
  if (!community) return null;
  return (
    <section aria-labelledby="community-card-title" className="rounded-2xl border border-line bg-paper p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-pale/70 text-brass-dark">
        <MessageCircle aria-hidden className="h-5 w-5" />
      </span>
      <h2 id="community-card-title" className="mt-4 font-serif text-[1.35rem] leading-snug">
        {community.name}
      </h2>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{community.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <CommunityButton source="dashboard" variant="secondary" />
        <Link to="/community" className="text-[0.875rem] font-semibold text-brass-dark">
          About the community
        </Link>
      </div>
    </section>
  );
}

const startsSoon = (e: AcademyEvent, now: number) => {
  const ms = new Date(e.startDatetime).getTime() - now;
  return eventPhase(e, now) === "live" || (ms > 0 && ms <= 24 * 3_600_000);
};

/** Registered events that are happening now or within a day. */
export function StartingSoonBanner({ events, registrations }: { events: AcademyEvent[]; registrations: EventRegistration[] }) {
  const now = Date.now();
  const mine = events.filter((e) => registrations.some((r) => r.eventId === e.id) && startsSoon(e, now));
  if (mine.length === 0) return null;
  return (
    <div role="status" className="mt-6 space-y-2">
      {mine.map((e) => {
        const live = eventPhase(e, now) === "live";
        return (
          <p key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-brass/50 bg-brass-pale/50 px-4 py-3 text-[0.9375rem]">
            <Bell aria-hidden className="h-4 w-4 shrink-0 text-brass-dark" />
            <span>
              <strong className="font-semibold">{live ? "Happening now" : "Starting soon"}:</strong> {e.title}, {eventTimeLabel(e, false)}
            </span>
            <Link to={`/events/${e.slug}`} className="font-semibold text-brass-dark">
              {live ? "Join" : "Details"} <ArrowRight aria-hidden className="inline h-3.5 w-3.5" />
            </Link>
          </p>
        );
      })}
    </div>
  );
}

/** Upcoming events and the community card, side by side when there is a community. */
export function DashboardConnect({ events, registrations }: { events: AcademyEvent[]; registrations: EventRegistration[] }) {
  const { community } = useCommunity();
  return (
    <div className={`mt-12 grid gap-8 ${community ? "lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start" : ""}`}>
      <UpcomingEventsPanel events={events} registrations={registrations} />
      <DashboardCommunityCard />
    </div>
  );
}

/** "Starts tomorrow", "In 3 days", for the compact list. */
function relative(e: AcademyEvent, now: number) {
  if (eventPhase(e, now) === "live") return "Happening now";
  const days = Math.round((new Date(e.startDatetime).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return days <= 7 ? `In ${days} days` : "";
}

/** The next three events on the learner dashboard: ones they've registered for first, then featured, then soonest. */
export function UpcomingEventsPanel({ events, registrations }: { events: AcademyEvent[]; registrations: EventRegistration[] }) {
  const now = Date.now();
  const registered = new Set(registrations.map((r) => r.eventId));
  const next = upcomingEvents(events, now)
    .sort((a, b) => Number(registered.has(b.id)) - Number(registered.has(a.id)) || Number(b.isFeatured) - Number(a.isFeatured) || a.startDatetime.localeCompare(b.startDatetime))
    .slice(0, 3)
    .sort((a, b) => a.startDatetime.localeCompare(b.startDatetime));
  return (
    <section aria-labelledby="upcoming-events-title">
      <div className="flex items-end justify-between gap-3">
        <h2 id="upcoming-events-title" className="font-serif text-[1.7rem]">
          Upcoming Events
        </h2>
        <Link to="/events" className="text-[0.9375rem] font-semibold text-brass-dark">
          View All Events <ArrowRight aria-hidden className="inline h-4 w-4" />
        </Link>
      </div>
      {next.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line-strong p-6 text-muted">No events are scheduled right now. New sessions are added regularly.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-paper">
          {next.map((e) => {
            const action = eventAction(e);
            const isReg = registered.has(e.id);
            const rel = relative(e, now);
            const state = registrationState(e, now);
            return (
              <li key={e.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-brass-dark">{eventTypeLabel(e.eventType)}</p>
                  <Link to={`/events/${e.slug}`} className="mt-0.5 block font-serif text-[1.2rem] leading-snug hover:text-brass-dark">
                    {e.title}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[0.875rem] text-muted">
                    <CalendarDays aria-hidden className="h-3.5 w-3.5" /> {eventDateLabel(e)}
                    <span aria-hidden>·</span> {eventTimeLabel(e, false)}
                    <span aria-hidden>·</span> {eventFormatLabel(e.format)}
                    {rel && <span className="rounded-full bg-brass-pale/70 px-2 py-0.5 text-[0.75rem] font-medium text-brass-dark">{rel}</span>}
                  </p>
                </div>
                <div className="shrink-0">
                  {isReg ? (
                    <Link to={`/events/${e.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-success/40 bg-success-bg px-3.5 py-2 text-[0.875rem] font-semibold text-success">
                      Registered ✓
                    </Link>
                  ) : action.external ? (
                    <a href={action.href} target="_blank" rel="noopener noreferrer" className={buttonClass(action.primary ? "primary" : "secondary")}>
                      {action.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link to={action.href} className={buttonClass(action.primary && state !== "full" ? "primary" : "secondary")}>
                      {action.label}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
