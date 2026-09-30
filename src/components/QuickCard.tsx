import { Link } from "react-router";
import { Award, CheckCircle2, Clock } from "lucide-react";
import type { QuickCourse } from "@/content/quick";
import { quickIcon } from "./QuickIcon";

/** Card for a quick course: icon, title, time and the badge it earns. */
export function QuickCard({ course, compact = false, earned = false }: { course: QuickCourse; compact?: boolean; earned?: boolean }) {
  const Icon = quickIcon(course.icon);
  return (
    <Link
      to={`/quick/${course.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_24px_48px_-36px_rgba(23,23,23,0.5)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brass text-white">
          <Icon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-muted">
          <Clock aria-hidden className="h-3.5 w-3.5" /> {course.minutes} min
        </span>
      </div>
      <h3 className={`mt-4 font-serif leading-snug group-hover:text-brass-dark ${compact ? "text-[1.1rem]" : "text-[1.3rem]"}`}>{course.title}</h3>
      {!compact && <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{course.summary}</p>}
      <p className="mt-auto flex items-center gap-1.5 pt-4 text-[0.8125rem] font-medium text-brass-dark">
        {earned ? <CheckCircle2 aria-hidden className="h-4 w-4" /> : <Award aria-hidden className="h-4 w-4" />}
        {earned ? "Badge earned" : `Badge: ${course.badge}`}
      </p>
    </Link>
  );
}
