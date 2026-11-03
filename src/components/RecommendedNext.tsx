import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/content/types";
import { useProgrammes } from "@/lib/data";
import { coursePrice, enrolmentState, formatPrice, isPaid, programmeCourseIds } from "@/lib/commerce";

/**
 * A gentle next step for a free course. It points to the Professional Programme that builds on the course, if there is one,
 * and never gets in the way: it is a suggestion, not a gate. With `intro` it explains how the free course relates to the
 * programme (before the learner finishes); otherwise it is the "Ready to go further?" prompt shown once they have.
 */
export function RecommendedNext({ course, className = "", intro = false }: { course: Course; className?: string; intro?: boolean }) {
  const programmes = useProgrammes();
  if (isPaid(course)) return null;
  const parents = programmes.filter((t) => isPaid(t) && programmeCourseIds(t).includes(course.id));
  if (!parents.length) return null;
  // Prefer a programme that is open for enrolment.
  const t = parents.find((p) => enrolmentState(p) === "open" && p.price) ?? parents[0];
  const price = coursePrice(t);
  const name = t.programmeName ?? t.title;
  return (
    <div className={`rounded-xl border border-brass/40 bg-brass-pale/40 p-5 ${className}`}>
      <p className="font-serif text-[1.25rem]">{intro ? "The free introduction" : "Ready to go further?"}</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
        {intro
          ? `This free course is the introduction to ${name}. The professional programme goes deeper, with real-world projects, assessments, a capstone and a professional certificate.`
          : `${name} builds on what you've learned, with the full curriculum, real-world projects, assessments, a capstone and a professional certificate.`}
      </p>
      <Link to={`/programmes/${t.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brass-dark hover:text-ink">
        See the programme{price && enrolmentState(t) === "open" ? ` · ${formatPrice(price.amount, price.currency)}` : ""} <ArrowRight aria-hidden className="h-4 w-4" />
      </Link>
    </div>
  );
}
