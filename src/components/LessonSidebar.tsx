import { Link } from "react-router";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import type { Course } from "@/content/types";

/** Course curriculum with per-lesson status. Used in the lesson page sidebar and mobile drawer. */
export function LessonSidebar({
  course,
  currentLessonId,
  completed,
}: {
  course: Course;
  currentLessonId?: string;
  completed: string[];
}) {
  return (
    <nav aria-label={`${course.title} curriculum`}>
      <ol className="space-y-1">
        {course.modules.map((m, mi) => {
          const lessons = m.lessons.filter((l) => l.published);
          return (
            <li key={m.id}>
              {lessons.length === 0 ? (
                <p className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[0.875rem] text-subtle">
                  <Lock aria-hidden className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {mi + 1}. {m.title} <span className="text-[0.75rem]">(coming soon)</span>
                  </span>
                </p>
              ) : (
                lessons.map((l) => {
                  const current = l.id === currentLessonId;
                  const done = completed.includes(l.id);
                  return (
                    <Link
                      key={l.id}
                      to={`/learn/${course.slug}/${l.slug}`}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-start gap-2.5 rounded-md px-2.5 py-2 text-[0.875rem] leading-snug transition-colors ${
                        current ? "bg-brass-pale/50 font-semibold text-ink" : "text-ink/80 hover:bg-sand"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 aria-label="Completed" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <Circle aria-hidden className={`mt-0.5 h-4 w-4 shrink-0 ${current ? "text-brass" : "text-line-strong"}`} />
                      )}
                      <span>
                        <span className="text-subtle">{mi + 1}.</span> {m.lessons.length > 1 ? l.title : m.title}
                      </span>
                    </Link>
                  );
                })
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
