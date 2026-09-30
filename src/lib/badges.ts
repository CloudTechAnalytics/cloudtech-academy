import type { Course } from "@/content/types";
import type { AttemptResult, Progress } from "./backend/types";
import { publishedLessons } from "./certificates";

/**
 * Badges mark the stages of a course on the way to its certificate. They are worked out
 * from the learner's own progress, so there is nothing extra to store. The certificate,
 * with its credential ID and verification page, stays the formal proof.
 */
export type BadgeId = "started" | "halfway" | "lessons" | "assessment";

export type BadgeStage = { id: BadgeId; title: string; requirement: string; shareLine: string };

export const BADGE_STAGES: BadgeStage[] = [
  { id: "started", title: "Getting started", requirement: "Complete your first lesson", shareLine: "First lesson done, and I'm on my way." },
  { id: "halfway", title: "Halfway there", requirement: "Complete half of the lessons", shareLine: "Halfway through the course." },
  { id: "lessons", title: "All lessons complete", requirement: "Complete every lesson", shareLine: "Every lesson complete." },
  { id: "assessment", title: "Assessment passed", requirement: "Pass the final assessment", shareLine: "Final assessment passed." },
];

export function earnedBadges(course: Course, progress: Progress, attempts: AttemptResult[]): Set<BadgeId> {
  const lessons = publishedLessons(course).filter((l) => l.required);
  const done = lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
  const earned = new Set<BadgeId>();
  if (done >= 1) earned.add("started");
  if (lessons.length && done >= Math.ceil(lessons.length / 2)) earned.add("halfway");
  if (lessons.length && done === lessons.length) earned.add("lessons");
  if (attempts.some((a) => a.passed)) earned.add("assessment");
  return earned;
}

/** Opens LinkedIn with a post already written; the learner attaches the badge image. */
export function linkedInPostUrl(stage: BadgeStage, courseTitle: string, courseUrl: string) {
  const text = `I've earned the "${stage.title}" badge in ${courseTitle} on CloudTech Academy. ${stage.shareLine}\n\n${courseUrl}\n\n#CloudTechAcademy #DataAnalytics #Learning`;
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
}
