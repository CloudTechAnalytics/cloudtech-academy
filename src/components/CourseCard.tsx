import { Link } from "react-router";
import { BookOpen, Clock, GraduationCap, Trophy } from "lucide-react";
import type { Course } from "@/content/types";
import { categoryName } from "@/content";
import { durationLabel } from "@/lib/format";
import { badgeCount, courseMinutes } from "@/lib/certificates";
import { ProgressBar } from "./ProgressBar";
import { LEVELS } from "@/content/tracks";
import { DELIVERY_LABEL, coursePrice, enrolmentState, formatPrice, isPaid, isProfessional } from "@/lib/commerce";

export function Badge({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "free" | "soon" | "success" }) {
  const tones = {
    neutral: "border-line-strong text-muted",
    free: "border-brass/50 bg-brass-pale/50 text-brass-dark",
    soon: "border-line-strong bg-sand text-muted",
    success: "border-success/40 bg-success-bg text-success",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.75rem] font-medium ${tones[tone]}`}>{children}</span>;
}

/** The level shown on a card: a range for the professional courses ("Beginner to Intermediate"), the usual level otherwise. */
export function levelText(course: Course) {
  if (course.durationWeeks || course.difficultyMax) return course.levelLabel;
  return course.format === "short" ? "Short course" : course.level === 4 ? "Capstone" : LEVELS[course.level].name;
}

export function CourseCard({ course, progress }: { course: Course; progress?: number }) {
  const available = course.status === "available";
  const short = course.format === "short";
  const moduleCount = course.modules.length;
  const badges = badgeCount(course);
  const paid = isPaid(course);
  const price = paid ? coursePrice(course) : null;
  const open = paid && available && !!price && enrolmentState(course) === "open";
  const duration = course.durationLabel ?? (short ? durationLabel(courseMinutes(course)) : durationLabel(undefined, course.estimatedHours));
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-[border-color,box-shadow] duration-200 hover:border-brass/60 hover:shadow-[0_12px_32px_-20px_rgba(23,32,51,0.35)]">
      {course.thumbnail && <img src={course.thumbnail} alt="" loading="lazy" className="h-36 w-full object-cover" />}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={paid ? "neutral" : "free"}>{paid ? (isProfessional(course) ? "Professional" : "Paid") : "Free"}</Badge>
          {!available && <Badge tone="soon">{paid ? "Opens soon" : "Coming soon"}</Badge>}
          {paid && course.deliveryType && course.deliveryType !== "self_paced" && <Badge tone="neutral">{DELIVERY_LABEL[course.deliveryType].split(":")[0]}</Badge>}
          <span className="text-[0.8125rem] text-subtle">{categoryName(course.categoryId)}</span>
        </div>
        <h3 className="mt-3 font-serif text-[1.2rem] leading-snug text-ink">
          <Link to={`/courses/${course.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">{course.summary}</p>

        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8125rem] text-ink-soft">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Level</dt>
            <GraduationCap aria-hidden className="h-3.5 w-3.5 text-subtle" />
            <dd>{levelText(course)}</dd>
          </div>
          {duration && (
            <div className="flex items-center gap-1.5">
              <Clock aria-hidden className="h-3.5 w-3.5 text-subtle" />
              <dt className="sr-only">Duration</dt>
              <dd>{duration}</dd>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <BookOpen aria-hidden className="h-3.5 w-3.5 text-subtle" />
            <dt className="sr-only">Modules</dt>
            <dd>{`${moduleCount} ${moduleCount === 1 ? "module" : "modules"}`}</dd>
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
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
              <div>
                {paid ? (
                  price ? (
                    <>
                      <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-serif text-[1.45rem] leading-none text-ink">{formatPrice(price.amount, price.currency)}</span>
                        {price.discounted && <s className="text-[0.9rem] text-subtle">{formatPrice(price.listAmount, price.currency)}</s>}
                      </p>
                      {price.discounted && (
                        <p className="mt-1 text-[0.75rem] font-semibold text-brass-dark">
                          {price.percentOff}% off{price.label ? ` · ${price.label}` : ""}
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="font-serif text-[1.2rem] text-ink">Paid</span>
                  )
                ) : (
                  <span className="font-serif text-[1.2rem] tracking-wide text-ink">FREE</span>
                )}
              </div>
              <div className="relative z-10 flex flex-wrap gap-2">
                <Link to={`/courses/${course.slug}`} className="rounded-lg border border-line-strong px-3.5 py-2 text-[0.8125rem] font-semibold text-ink hover:border-ink/50">
                  View course
                </Link>
                {open ? (
                  <Link to={`/courses/${course.slug}/enroll`} className="rounded-lg bg-brass-dark px-3.5 py-2 text-[0.8125rem] font-semibold text-white hover:bg-brass-deeper">
                    Enroll
                  </Link>
                ) : !paid && available ? (
                  <Link to={`/courses/${course.slug}`} className="rounded-lg bg-brass-dark px-3.5 py-2 text-[0.8125rem] font-semibold text-white hover:bg-brass-deeper">
                    Start free
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
