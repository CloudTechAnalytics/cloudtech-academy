import { Link } from "react-router";
import { ArrowRight, BarChart3, Bot, Cloud, Code2, FlaskConical, GraduationCap, KanbanSquare, ClipboardList, type LucideIcon } from "lucide-react";
import type { Track } from "@/content/tracks";
import type { Course } from "@/content/types";
import { courseMinutes } from "@/lib/certificates";
import { DELIVERY_LABEL, coursePrice, enrolmentState, formatPrice, isPaid } from "@/lib/commerce";

/** One icon per track, so tracks can be told apart at a glance. */
export const TRACK_ICONS: Record<string, LucideIcon> = {
  "data-analyst": BarChart3,
  "business-analyst": ClipboardList,
  "data-scientist": FlaskConical,
  "ai-engineer": Bot,
  "cloud-devops-engineer": Cloud,
  "software-developer": Code2,
  "project-manager": KanbanSquare,
  "career-study-skills": GraduationCap,
};

/** Courses, projects, hours and whether the track ends in a capstone. */
export function trackStats(track: Track, courses: Course[]) {
  const items = track.stages.flatMap((s) => s.items);
  const ids = new Set(items.flatMap((i) => (i.kind === "course" ? [i.courseId] : [])));
  const inTrack = courses.filter((c) => ids.has(c.id));
  const minutes = inTrack.reduce((n, c) => n + (c.format === "short" ? courseMinutes(c) : (c.estimatedHours ?? 0) * 60), 0);
  return {
    courses: ids.size,
    projects: items.filter((i) => i.kind === "project").length,
    hours: Math.round(minutes / 60),
    capstone: inTrack.some((c) => c.level === 4),
  };
}

/** A short, scannable card for a career track: icon, title, one-line outcome and three facts. */
export function TrackCard({ track, courses }: { track: Track; courses: Course[] }) {
  const Icon = TRACK_ICONS[track.id] ?? GraduationCap;
  const stats = trackStats(track, courses);
  const paid = isPaid(track);
  const price = paid ? coursePrice(track) : null;
  const open = enrolmentState(track) === "open" && !!price;
  return (
    <Link
      to={`/programmes/${track.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-[border-color,box-shadow] duration-200 hover:border-brass/60 hover:shadow-[0_12px_32px_-20px_rgba(23,32,51,0.35)]"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brass-pale text-brass-dark">
        <Icon aria-hidden className="h-5 w-5" />
      </span>
      <p className="mt-4 text-[0.75rem] font-semibold uppercase tracking-wide text-brass-dark">{paid ? "Professional Programme" : "Free Learning Path"}</p>
      <h3 className="mt-1 font-serif text-[1.25rem] leading-snug text-ink">{paid ? (track.programmeName ?? track.title) : (track.programmeTitle ?? track.title)}</h3>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{track.outcome}.</p>
      <ul className="mt-4 flex flex-wrap gap-1.5 text-[0.75rem] font-medium text-ink-soft">
        <li className="rounded-full bg-sand px-2.5 py-1">{stats.courses} courses</li>
        {stats.hours > 0 && <li className="rounded-full bg-sand px-2.5 py-1">About {stats.hours} hours</li>}
        {stats.capstone && <li className="rounded-full bg-sand px-2.5 py-1">Capstone project</li>}
        {paid && track.durationLabel && <li className="rounded-full bg-sand px-2.5 py-1">{track.durationLabel}</li>}
        {paid && track.deliveryType && track.deliveryType !== "self_paced" && <li className="rounded-full bg-sand px-2.5 py-1">{DELIVERY_LABEL[track.deliveryType].split(":")[0]}</li>}
      </ul>
      {paid ? (
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="font-serif text-[1.35rem] leading-none text-ink">
            {price ? formatPrice(price.amount, price.currency) : "Opens soon"}
            {price?.discounted && <s className="ml-2 text-[0.9rem] font-normal text-subtle">{formatPrice(price.listAmount, price.currency)}</s>}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-brass-dark px-3.5 py-2 text-[0.875rem] font-semibold text-white">
            {open ? "Enroll Now" : "View programme"} <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      ) : (
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.875rem] font-semibold text-brass-dark">
          Start Learning Free <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
    </Link>
  );
}
