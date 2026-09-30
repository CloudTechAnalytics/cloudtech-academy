import { Link } from "react-router";
import { ArrowRight, BookOpen, Clock, FolderKanban, GraduationCap, Trophy } from "lucide-react";
import type { Course } from "@/content/types";
import { categoryName } from "@/content";
import { durationLabel } from "@/lib/format";
import { badgeCount, courseMinutes } from "@/lib/certificates";
import { ProgressBar } from "./ProgressBar";

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
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_56px_-40px_rgba(23,23,23,0.45)] sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={available ? "free" : "soon"}>{available ? "Free" : "Coming soon"}</Badge>
        {short && <Badge>Short course</Badge>}
        <span className="text-[0.8125rem] text-muted">{categoryName(course.categoryId)}</span>
      </div>
      <h3 className="mt-4 font-serif text-[1.5rem] leading-tight">
        <Link to={`/courses/${course.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {course.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{course.summary}</p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.8125rem] text-ink/80">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Level</dt>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brass" />
          <dd>{course.levelLabel}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock aria-hidden className="h-3.5 w-3.5 text-subtle" />
          <dt className="sr-only">Estimated time</dt>
          <dd>{short ? durationLabel(courseMinutes(course)) : durationLabel(undefined, course.estimatedHours)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen aria-hidden className="h-3.5 w-3.5 text-subtle" />
          <dt className="sr-only">Modules</dt>
          <dd>{available ? `${moduleCount} ${moduleCount === 1 ? "module" : "modules"}` : `${moduleCount} modules planned`}</dd>
        </div>
        {available && badges > 0 && (
          <div className="flex items-center gap-2">
            <Trophy aria-hidden className="h-3.5 w-3.5 text-subtle" />
            <dt className="sr-only">Badges</dt>
            <dd>
              {badges} {badges === 1 ? "badge" : "badges"}
            </dd>
          </div>
        )}
        {course.projectTitle && (
          <div className="flex items-center gap-2">
            <FolderKanban aria-hidden className="h-3.5 w-3.5 text-subtle" />
            <dt className="sr-only">Project</dt>
            <dd>Final project</dd>
          </div>
        )}
        {course.certificate.enabled && (
          <div className="flex items-center gap-2">
            <GraduationCap aria-hidden className="h-3.5 w-3.5 text-subtle" />
            <dt className="sr-only">Certificate</dt>
            <dd>Optional certificate</dd>
          </div>
        )}
      </dl>

      <div className="mt-auto pt-6">
        {progress !== undefined && available ? (
          <ProgressBar value={progress} label={`${course.title} progress`} />
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-ink group-hover:text-brass-dark">
            View course <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </article>
  );
}
