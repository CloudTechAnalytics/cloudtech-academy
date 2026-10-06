import { Link } from "react-router";
import { ArrowRight, BookOpen, Clock, GraduationCap, Trophy } from "lucide-react";
import type { Course } from "@/content/types";
import { categoryName } from "@/content";
import { durationLabel } from "@/lib/format";
import { badgeCount, courseMinutes } from "@/lib/certificates";
import { ProgressBar } from "./ProgressBar";
import { LEVELS } from "@/content/tracks";
import { DELIVERY_LABEL, coursePrice, formatPrice, isPaid, isProfessional } from "@/lib/commerce";

export function Badge({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "free" | "soon" | "success" }) {
  const tones = {
    neutral: "border-line-strong text-muted",
    free: "border-brass/50 bg-brass-pale/50 text-brass-dark",
    soon: "border-line-strong bg-sand text-muted",
    success: "border-success/40 bg-success-bg text-success",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.75rem] font-medium ${tones[tone]}`}>{children}</span>;
}

export function CourseCard({ course, progress }: { course: Course; progress?: number }) {
  const available = course.status === "available";
  const short = course.format === "short";
  const moduleCount = course.modules.length;
  const badges = badgeCount(course);
  const paid = isPaid(course);
  const price = paid ? coursePrice(course) : null;
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-[border-color,box-shadow] duration-200 hover:border-brass/60 hover:shadow-[0_12px_32px_-20px_rgba(23,32,51,0.35)]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={available ? (paid ? "neutral" : "free") : "soon"}>{!available ? "Coming soon" : paid ? (isProfessional(course) ? "Professional" : "Paid") : "Free"}</Badge>
        {paid && course.deliveryType && course.deliveryType !== "self_paced" && <Badge tone="neutral">{DELIVERY_LABEL[course.deliveryType].split(":")[0]}</Badge>}
        <span className="text-[0.8125rem] text-subtle">{categoryName(course.categoryId)}</span>
      </div>
      <h3 className="mt-3 font-serif text-[1.2rem] leading-snug text-ink">
        <Link to={`/courses/${course.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {course.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted">{course.summary}</p>

      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8125rem] text-ink-soft">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Level</dt>
          <GraduationCap aria-hidden className="h-3.5 w-3.5 text-subtle" />
          <dd>{short ? "Short course" : course.level === 4 ? "Capstone" : LEVELS[course.level].name}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock aria-hidden className="h-3.5 w-3.5 text-subtle" />
          <dt className="sr-only">Estimated time</dt>
          <dd>{short ? durationLabel(courseMinutes(course)) : durationLabel(undefined, course.estimatedHours)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen aria-hidden className="h-3.5 w-3.5 text-subtle" />
          <dt className="sr-only">Modules</dt>
          <dd>{available ? `${moduleCount} ${moduleCount === 1 ? "module" : "modules"}` : `${moduleCount} planned`}</dd>
        </div>
        {available && badges > 0 && (
          <div className="flex items-center gap-1.5">
            <Trophy aria-hidden className="h-3.5 w-3.5 text-subtle" />
            <dt className="sr-only">Badges</dt>
            <dd>
              {badges} {badges === 1 ? "badge" : "badges"}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-auto pt-5">
        {progress !== undefined && available ? (
          <ProgressBar value={progress} label={`${course.title} progress`} />
        ) : (
          <span className="flex items-center justify-between gap-3 text-[0.875rem] font-semibold text-brass-dark">
            {paid ? (
              <span className="text-ink">
                {price ? (
                  <>
                    {formatPrice(price.amount, price.currency)}
                    {price.discounted && <s className="ml-2 font-normal text-subtle">{formatPrice(price.listAmount, price.currency)}</s>}
                  </>
                ) : (
                  "Paid"
                )}
              </span>
            ) : (
              <span className="text-ink">FREE</span>
            )}
            <span className="inline-flex items-center gap-1.5">{paid ? "View course" : "Start Learning Free"} <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
          </span>
        )}
      </div>
    </article>
  );
}
