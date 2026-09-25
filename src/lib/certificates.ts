import type { Course, ProjectDef } from "@/content/types";
import type { AttemptResult, Progress, ProjectSubmission } from "./backend/types";

export type Requirement = { key: string; label: string; done: boolean; detail: string };

export type Eligibility = {
  requirements: Requirement[];
  eligible: boolean;
  lessonsDone: number;
  lessonsTotal: number;
  percent: number;
};

export function publishedLessons(course: Course) {
  return course.modules.flatMap((m) => m.lessons).filter((l) => l.published);
}

/**
 * What a learner has done towards a course certificate. Used to show progress; the server
 * (or the demo backend) applies the same rules again before issuing anything.
 */
export function eligibility(
  course: Course,
  progress: Progress,
  attempts: AttemptResult[],
  submission: ProjectSubmission | null,
  project: ProjectDef | null,
): Eligibility {
  const rules = course.certificate;
  const lessons = publishedLessons(course);
  const required = lessons.filter((l) => l.required);
  const lessonsDone = required.filter((l) => progress.completedLessons.includes(l.id)).length;
  const exercises = lessons.flatMap((l) => l.requiredExercises);
  const exercisesDone = exercises.filter((id) => progress.completedExercises.includes(id)).length;
  const best = attempts.reduce((m, a) => Math.max(m, a.score), 0);
  const passed = attempts.some((a) => a.passed);
  const projectNeeded = rules.requireProject && !!project?.required;
  const projectDone = !!submission && submission.status !== "needs_changes";

  const requirements: Requirement[] = [];
  if (rules.requireAllLessons)
    requirements.push({ key: "lessons", label: "Complete every lesson", done: lessonsDone === required.length, detail: `${lessonsDone} of ${required.length}` });
  if (rules.requireExercises && exercises.length)
    requirements.push({ key: "exercises", label: "Complete the practice exercises", done: exercisesDone === exercises.length, detail: `${exercisesDone} of ${exercises.length}` });
  requirements.push({
    key: "assessment",
    label: `Pass the final assessment (${rules.passingScore}% or more)`,
    done: passed,
    detail: attempts.length ? `Best score ${best}%` : "Not attempted",
  });
  if (projectNeeded)
    requirements.push({
      key: "project",
      label: "Submit the final project",
      done: projectDone,
      detail: !submission ? "Not submitted" : submission.status === "needs_changes" ? "Changes requested" : submission.status === "accepted" ? "Accepted" : "Submitted",
    });

  return {
    requirements,
    eligible: rules.enabled && requirements.every((r) => r.done),
    lessonsDone,
    lessonsTotal: required.length,
    percent: required.length ? Math.round((lessonsDone / required.length) * 100) : 0,
  };
}

/** CTA-SQL-2026-004821 */
export function newCredentialId(courseCode: string, date = new Date()) {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return `CTA-${courseCode}-${date.getFullYear()}-${String(n).padStart(6, "0")}`;
}

export const verifyUrl = (siteUrl: string, credentialId: string) => `${siteUrl}/verify/${encodeURIComponent(credentialId)}`;
