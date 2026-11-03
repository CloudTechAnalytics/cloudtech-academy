import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading } from "@/lib/auth";
import { useEvents } from "@/lib/event-data";
import { EVENT_TYPES, pastEvents, upcomingEvents } from "@/lib/events";
import { useCommunity, CommunityButton } from "@/lib/community";
import { EventCard } from "@/components/EventCard";
import { Alert } from "@/components/Form";

const selectCls =
  "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[0.9375rem] text-ink focus:border-ink/60 focus:outline-2 focus:outline-offset-2 focus:outline-brass-dark sm:w-64";

/** /events: what's coming up, then what's happened. */
export default function Events() {
  useSeo({
    title: "Events | CloudTech Academy",
    description: "Workshops, webinars, masterclasses, practical sessions and community days from CloudTech Academy. See what's coming up and register.",
  });
  const { events, error } = useEvents();
  const { community } = useCommunity();
  const [type, setType] = useState("");

  const { upcoming, past, featured } = useMemo(() => {
    const all = (events ?? []).filter((e) => !type || e.eventType === type);
    const up = upcomingEvents(all);
    return { upcoming: up, past: pastEvents(all), featured: up.filter((e) => e.isFeatured) };
  }, [events, type]);
  const rest = upcoming.filter((e) => !e.isFeatured);
  const usedTypes = new Set((events ?? []).map((e) => e.eventType));

  return (
    <div className="container-page py-14 sm:py-20">
      <p className="kicker">Events</p>
      <h1 className="mt-3 font-serif text-[2.4rem] leading-tight sm:text-[3rem]">Learn together, in person and online</h1>
      <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
        Workshops, webinars, masterclasses, practical sessions and community days. Some need a quick registration; many are open to everyone.
      </p>

      {events && usedTypes.size > 1 && (
        <div className="mt-8">
          <label htmlFor="type" className="text-[0.875rem] font-medium">
            Show
          </label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
            <option value="">All events</option>
            {EVENT_TYPES.filter((t) => usedTypes.has(t.value)).map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="mt-8">
          <Alert tone="error">{error}</Alert>
        </div>
      )}
      {!events ? (
        <PageLoading label="Loading events…" />
      ) : (
        <>
          <section aria-labelledby="upcoming-title" className="mt-10">
            <h2 id="upcoming-title" className="font-serif text-[1.7rem]">
              Upcoming
            </h2>
            {upcoming.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-line-strong p-8 text-center">
                <p className="font-serif text-[1.35rem]">{type ? "No upcoming events of this type" : "No events scheduled right now"}</p>
                <p className="mx-auto mt-2 max-w-md text-muted">
                  {community ? "New sessions are announced in the Academy community first." : "Check back soon: new sessions are added regularly."}
                </p>
                {community && <CommunityButton source="events" className="mt-5" />}
              </div>
            ) : (
              <>
                {featured.length > 0 && (
                  <ul className="mt-5 grid gap-5 lg:grid-cols-2">
                    {featured.map((e) => (
                      <li key={e.id}>
                        <EventCard event={e} featured />
                      </li>
                    ))}
                  </ul>
                )}
                {rest.length > 0 && (
                  <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((e) => (
                      <li key={e.id}>
                        <EventCard event={e} />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>

          {community && upcoming.length > 0 && (
            <aside className="mt-12 flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brass-pale/70 text-brass-dark">
                  <MessageCircle aria-hidden className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-serif text-[1.2rem]">{community.name}</p>
                  <p className="mt-1 max-w-xl text-[0.9375rem] text-muted">Hear about new sessions first and chat with other learners.</p>
                </div>
              </div>
              <CommunityButton source="events" variant="secondary" />
            </aside>
          )}

          {past.length > 0 && (
            <section aria-labelledby="past-title" className="mt-14">
              <h2 id="past-title" className="font-serif text-[1.7rem]">
                Past events
              </h2>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((e) => (
                  <li key={e.id}>
                    <EventCard event={e} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
