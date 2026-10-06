import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/content/types";
import { useCourses } from "@/lib/data";
import { coursePrice, enrolmentState, formatPrice, isPaid } from "@/lib/commerce";
import { TRACKS } from "@/content/tracks";

/**
 * A gentle next step shown when a learner finishes a free course. It offers a professional programme in the
 * same field when one is open for enrolment, otherwise the learning path the course belongs to. Never shown
 * for paid courses, and it is a suggestion, not a gate.
 */
export function RecommendedNext({ course, className = "" }: { course: Course; className?: string }) {
  const courses = useCourses();
  if (isPaid(course)) return null;
  const programme = courses.find((c) => isPaid(c) && c.published && c.status === "available" && c.categoryId === course.categoryId && enrolmentState(c) === "open");
  const path = TRACKS.find((t) => t.stages.some((s) => s.items.some((i) => i.kind === "course" && i.courseId === course.id)));
  if (!programme && !path) return null;
  const price = programme ? coursePrice(programme) : null;
  return (
    <div className={`rounded-xl border border-brass/40 bg-brass-pale/40 p-5 ${className}`}>
      <p className="font-serif text-[1.25rem]">Ready to go further?</p>
      {programme ? (
        <>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
            {programme.title} takes what you've learned into a complete, structured programme with projects, assessment and a professional certificate.
          </p>
          <Link to={`/courses/${programme.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brass-dark hover:text-ink">
            See the programme{price ? ` · ${formatPrice(price.amount, price.currency)}` : ""} <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </>
      ) : (
        path && (
          <>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">This course is one step on the {path.title} learning path. See what comes next.</p>
            <Link to={`/programmes/${path.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brass-dark hover:text-ink">
              View the learning path <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </>
        )
      )}
    </div>
  );
}
