import { useState } from "react";
import { Link } from "react-router";
import { Copy, ExternalLink, MessageCircle, Plus, Settings } from "lucide-react";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { eventDateLabel, eventTimeLabel, eventTypeLabel, upcomingEvents } from "@/lib/events";
import { Alert } from "@/components/Form";
import { ButtonLink, buttonClass } from "@/components/Button";
import { AdminHeading } from "./AdminLayout";
import { StatusPill } from "./AdminEvents";
import { useAdminData } from "./useAdmin";

const SOURCE: Record<string, string> = {
  homepage: "Homepage",
  welcome: "Welcome step after sign-up",
  dashboard: "Learner dashboard",
  community_page: "Community page",
  navbar: "Navigation",
  events: "Events page",
  event_page: "An event page",
  sign_up: "Sign-up",
  other: "Other",
};

function Stat({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[0.8125rem] text-muted">{label}</p>
      <p className="mt-2 font-serif text-[1.9rem] leading-none">{value}</p>
      {note && <p className="mt-2 text-[0.8125rem] text-muted">{note}</p>}
    </div>
  );
}

/** Admin Dashboard → Community: a light overview. Wording and the link are edited under Settings. */
export default function AdminCommunity() {
  const { data, error } = useAdminData(async () => {
    const b = await getBackend();
    const [settings, stats, events, recent] = await Promise.all([b.admin.getCommunitySettings(), b.admin.communityStats(), b.admin.listAllEvents(), b.admin.recentRegistrations(6)]);
    return { settings, stats, events, recent };
  });
  const [copied, setCopied] = useState(false);
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!data) return <PageLoading />;
  const { settings, stats, events, recent } = data;
  const upcoming = upcomingEvents(events.filter((e) => e.status !== "draft")).slice(0, 5);
  const drafts = events.filter((e) => e.status === "draft").length;
  const hasLink = !!settings.whatsappUrl;

  return (
    <>
      <AdminHeading title="Community">
        <ButtonLink to="/admin/settings/community" variant="secondary">
          <Settings aria-hidden className="h-4 w-4" /> Community settings
        </ButtonLink>
        <ButtonLink to="/admin/events/new">
          <Plus aria-hidden className="h-4 w-4" /> Create event
        </ButtonLink>
      </AdminHeading>

      {!hasLink && (
        <div className="mb-6">
          <Alert tone="info">
            The community isn't set up yet. Add your WhatsApp invite link in{" "}
            <Link to="/admin/settings/community" className="font-semibold underline">
              Settings → Community
            </Link>{" "}
            and every Community button across the Academy will use it.
          </Alert>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Community status" value={settings.isActive ? "Active" : "Inactive"} note={settings.isActive ? "Buttons are showing" : "Buttons and links are hidden"} />
        <Stat label="Community button clicks" value={stats.clicks30d} note={`last 30 days · ${stats.clicksTotal} in total`} />
        <Stat label="Upcoming events" value={stats.upcomingEvents} note={drafts ? `${drafts} draft${drafts === 1 ? "" : "s"} not yet published` : undefined} />
        <Stat label="Event registrations" value={stats.registrationsTotal} note={`${stats.registrationsUpcoming} for upcoming events`} />
      </div>

      <section aria-labelledby="link-title" className="mt-8 rounded-2xl border border-line bg-paper p-6">
        <h2 id="link-title" className="font-serif text-[1.35rem]">
          {settings.name}
        </h2>
        <p className="mt-1 max-w-2xl text-[0.9375rem] text-muted">{settings.description}</p>
        {hasLink ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <code className="max-w-full truncate rounded-lg bg-sand px-3 py-2 font-mono text-[0.8125rem]">{settings.whatsappUrl}</code>
            <button
              type="button"
              className={buttonClass("secondary")}
              onClick={() => void navigator.clipboard.writeText(settings.whatsappUrl!).then(() => (setCopied(true), setTimeout(() => setCopied(false), 2000)))}
            >
              <Copy aria-hidden className="h-4 w-4" /> {copied ? "Copied" : "Copy link"}
            </button>
            <a href={settings.whatsappUrl!} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost")}>
              Test the link <ExternalLink aria-hidden className="h-4 w-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        ) : (
          <p className="mt-3 text-[0.9375rem] text-muted">No WhatsApp link yet.</p>
        )}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="next-title">
          <div className="flex items-end justify-between">
            <h2 id="next-title" className="font-serif text-[1.35rem]">
              Upcoming events
            </h2>
            <Link to="/admin/events" className="text-[0.875rem] font-semibold text-brass-dark">
              All events
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-line-strong p-5 text-[0.9375rem] text-muted">Nothing scheduled. Create an event, or a Community Day.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-paper">
              {upcoming.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <Link to={`/admin/events/${e.id}`} className="font-semibold hover:text-brass-dark">
                      {e.title}
                    </Link>
                    <p className="text-[0.8125rem] text-muted">
                      {eventTypeLabel(e.eventType)} · {eventDateLabel(e).replace(/^\w+, /, "")}, {eventTimeLabel(e, false)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusPill status={e.status} />
                    {e.registrationRequired && (
                      <Link to={`/admin/events/${e.id}/registrations`} className="mt-1 block text-[0.8125rem] font-semibold text-brass-dark">
                        {e.registeredCount} registered
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="activity-title">
          <h2 id="activity-title" className="font-serif text-[1.35rem]">
            Recent activity
          </h2>
          {recent.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-line-strong p-5 text-[0.9375rem] text-muted">No registrations yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-paper">
              {recent.map((r) => (
                <li key={r.id} className="flex items-start gap-3 p-4 text-[0.9375rem]">
                  <MessageCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" />
                  <p>
                    <strong className="font-semibold">{r.fullName}</strong> {r.registrationStatus === "cancelled" ? "cancelled their registration for" : "registered for"}{" "}
                    <Link to={`/admin/events/${r.eventId}/registrations`} className="font-semibold hover:text-brass-dark">
                      {r.eventTitle}
                    </Link>
                    <span className="block text-[0.8125rem] text-muted">{new Date(r.registeredAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {stats.clickSources.length > 0 && (
        <section aria-labelledby="sources-title" className="mt-8">
          <h2 id="sources-title" className="font-serif text-[1.35rem]">
            Where the community is joined from
          </h2>
          <p className="mt-1 text-[0.875rem] text-muted">Button presses in the last 30 days. It counts presses, not people who finished joining WhatsApp.</p>
          <ul className="mt-3 max-w-xl space-y-2">
            {stats.clickSources.map((s) => (
              <li key={s.source} className="grid grid-cols-[11rem_1fr_2.5rem] items-center gap-3 text-[0.9rem]">
                <span>{SOURCE[s.source] ?? s.source}</span>
                <span className="h-2.5 rounded-full bg-sand">
                  <span className="block h-2.5 rounded-full bg-brass" style={{ width: `${(s.clicks / stats.clickSources[0].clicks) * 100}%` }} />
                </span>
                <span className="text-right font-semibold">{s.clicks}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
