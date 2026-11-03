import type { Course } from "@/content/types";
import type { Track } from "@/content/tracks";
import { DIVISIONS, divisionOf } from "@/content/catalog";
import { isPaid } from "@/lib/commerce";
import { inCatalogue } from "@/lib/catalogue";
import { CourseCard } from "./CourseCard";
import { TrackCard } from "./TrackCard";

/**
 * Everything paid, in one list, split by area: the professional programmes under Data & Technology, and the paid courses
 * under Business & Entrepreneurship, Trade & Logistics and Professional Skills.
 */
export function ProfessionalByArea({ tracks, courses, area = "" }: { tracks: Track[]; courses: Course[]; area?: string }) {
  const paidTracks = tracks.filter((t) => isPaid(t));
  const paidCourses = courses.filter((c) => inCatalogue(c) && isPaid(c));
  const sections = DIVISIONS.filter((d) => !area || d.id === area)
    .map((d) => ({
      division: d,
      tracks: d.id === "data-tech" ? paidTracks : [],
      courses: paidCourses.filter((c) => divisionOf(c.categoryId).id === d.id),
    }))
    .filter((s) => s.tracks.length + s.courses.length > 0);
  if (!sections.length) return null;
  return (
    <div className="space-y-14">
      {sections.map(({ division, tracks: ts, courses: cs }) => (
        <section key={division.id} id={`pro-${division.id}`} aria-labelledby={`pro-${division.id}-title`} className="scroll-mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
            <h2 id={`pro-${division.id}-title`} className="font-serif text-[1.8rem] leading-tight">
              {division.name}
            </h2>
            <p className="text-[0.875rem] text-muted">
              {ts.length > 0 && `${ts.length} programmes`}
              {ts.length > 0 && cs.length > 0 && " · "}
              {cs.length > 0 && `${cs.length} courses`}
            </p>
          </div>
          <p className="mt-2 text-muted">{division.blurb}</p>
          <ul className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ts.map((t) => (
              <li key={t.id}>
                <TrackCard track={t} courses={courses} />
              </li>
            ))}
            {cs.map((c) => (
              <li key={c.id}>
                <CourseCard course={c} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
