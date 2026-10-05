import { Link } from "react-router";
import { BookOpen, CalendarDays, Compass, Lightbulb, MessageCircle, Megaphone, Rocket, Users } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading } from "@/lib/auth";
import { CommunityButton, useCommunity } from "@/lib/community";
import { useEvents } from "@/lib/event-data";
import { upcomingEvents } from "@/lib/events";
import { EventCard } from "@/components/EventCard";
import { buttonClass } from "@/components/Button";

const BENEFITS = [
  { icon: Users, title: "Connect with learners", body: "Meet people learning the same skills, at every level." },
  { icon: MessageCircle, title: "Ask questions", body: "Get unstuck faster with help from the people around you." },
  { icon: Rocket, title: "Share what you're building", body: "Show your projects and get honest, kind feedback." },
  { icon: Megaphone, title: "Academy updates", body: "New courses, projects and sessions, as they happen." },
  { icon: Lightbulb, title: "Practical sessions", body: "Learn by doing, together, in live working sessions." },
  { icon: Compass, title: "Opportunities", body: "Workshops, internships and announcements worth knowing about." },
];

/** /community: what the WhatsApp community is, and the one button to join it. */
export default function Community() {
  useSeo({
    title: "Community | CloudTech Academy",
    description: "Join the CloudTech Academy community on WhatsApp: connect with learners, ask questions, share your projects and hear about sessions and opportunities.",
  });
  const { community, loaded } = useCommunity();
  const { events } = useEvents();
  if (!loaded) return <PageLoading />;

  if (!community)
    return (
      <div className="container-page max-w-2xl py-20">
        <p className="kicker">Community</p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-tight">The community isn't open right now</h1>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">Check back soon. In the meantime, see what's coming up at the Academy.</p>
        <Link to="/events" className={buttonClass("primary", "mt-6")}>
          <CalendarDays aria-hidden className="h-4 w-4" /> Explore events
        </Link>
      </div>
    );

  const days = upcomingEvents((events ?? []).filter((e) => e.eventType === "community_day")).slice(0, 2);
  const others = upcomingEvents((events ?? []).filter((e) => e.eventType !== "community_day")).slice(0, 3);

  return (
    <div className="pb-20">
      <section className="border-b border-line bg-paper">
        <div className="container-page py-16 sm:py-24">
          <p className="kicker">Community</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[2.4rem] leading-tight sm:text-[3.1rem]">{community.name}</h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">{community.description}</p>
          <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed">{community.welcomeMessage}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CommunityButton source="community_page" className="px-6" />
            <span className="text-[0.875rem] text-muted">Free to join. Opens WhatsApp.</span>
          </div>
        </div>
      </section>

      <div className="container-page">
        <section aria-labelledby="inside-title" className="py-14">
          <h2 id="inside-title" className="font-serif text-[1.7rem]">
            What you'll find inside
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-2xl border border-line bg-paper p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-pale/70 text-brass-dark">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-serif text-[1.2rem]">{title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        {days.length > 0 && (
          <section aria-labelledby="days-title" className="pb-14">
            <h2 id="days-title" className="font-serif text-[1.7rem]">
              Community Day
            </h2>
            <p className="mt-2 max-w-2xl text-muted">A regular session to share Academy updates, spotlight learners, work through a practical session and take your questions.</p>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2">
              {days.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {others.length > 0 && (
          <section aria-labelledby="more-title" className="pb-6">
            <div className="flex items-end justify-between gap-3">
              <h2 id="more-title" className="font-serif text-[1.7rem]">
                Coming up
              </h2>
              <Link to="/events" className="text-[0.9375rem] font-semibold text-brass-dark">
                All events
              </Link>
            </div>
            <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {others.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="mt-10 flex items-center gap-2 text-[0.875rem] text-muted">
          <BookOpen aria-hidden className="h-4 w-4" /> Be kind, be curious, and keep personal details private. The Academy team looks after the community.
        </p>
      </div>
    </div>
  );
}
