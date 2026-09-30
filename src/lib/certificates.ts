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
  /** Module ids the learner holds a valid badge for. */
  badgeModules: Set<string> = new Set(),
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

  const withBadges = badgeModulesOf(course);
  const badgesDone = withBadges.filter((m) => badgeModules.has(m.id)).length;

  const requirements: Requirement[] = [];
  if (rules.requireModuleBadges && withBadges.length)
    requirements.push({ key: "badges", label: "Earn every module badge", done: badgesDone === withBadges.length, detail: `${badgesDone} of ${withBadges.length}` });
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
    percent:
      rules.requireModuleBadges && withBadges.length
        ? Math.round((badgesDone / withBadges.length) * 100)
        : required.length
          ? Math.round((lessonsDone / required.length) * 100)
          : 0,
  };
}

/** Modules that award a badge, in order. */
export const badgeModulesOf = (course: Course) => course.modules.filter((m) => m.badge);

/** Number of badges a course offers: one per badge module, plus the completion badge. */
export const badgeCount = (course: Course) => badgeModulesOf(course).length + (course.certificate.enabled ? 1 : 0);

/** Total minutes of a course's published lessons. */
export const courseMinutes = (course: Course) => publishedLessons(course).reduce((n, l) => n + l.minutes, 0);

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** CTA-PROMPT-8F72K: easy to read aloud, with no 0/O or 1/I to confuse. Same format the database uses. */
export function newCredentialId(code: string) {
  const r = crypto.getRandomValues(new Uint32Array(5));
  return `CTA-${code.toUpperCase()}-${[...r].map((n) => ALPHABET[n % ALPHABET.length]).join("")}`;
}

/** CTA-CERT-2026-000124 */
export const certificateNumber = (n: number, date = new Date()) => `CTA-CERT-${date.getFullYear()}-${String(n).padStart(6, "0")}`;

/** Public page for a badge or completion credential. */
export const credentialUrl = (siteUrl: string, credentialId: string) => `${siteUrl}/credentials/${encodeURIComponent(credentialId)}`;
/** Public verification page for an official certificate. */
export const verifyUrl = (siteUrl: string, certificateId: string) => `${siteUrl}/verify/${encodeURIComponent(certificateId)}`;
