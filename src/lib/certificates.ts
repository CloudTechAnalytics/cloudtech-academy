import type { Course, Module, ProjectDef } from "@/content/types";
import type { AttemptResult, Certificate, CertificateInput, CertificateType, Progress, ProjectSubmission, TrainingType } from "./backend/types";

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

/** Required practice tasks in a module's lessons. A module's check unlocks once they're all done. */
export const moduleTaskIds = (module: Module) => module.lessons.filter((l) => l.published).flatMap((l) => l.requiredExercises);

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

/** CTA-2026-000124. The database assigns these; the demo backend mirrors it. */
export const certificateNumber = (n: number, date = new Date()) => `CTA-${date.getFullYear()}-${String(n).padStart(6, "0")}`;

/** Official certificate numbers: CTA-2026-000124, or the older CTA-CERT-2026-000124. Badge IDs (CTA-AIPF-8F72K) don't match. */
export const isCertificateId = (id: string) => /^CTA-(CERT-)?\d{4}-\d+$/i.test(id.trim());

/** Public page for a badge or completion credential. */
export const credentialUrl = (siteUrl: string, credentialId: string) => `${siteUrl}/credentials/${encodeURIComponent(credentialId)}`;
/** Public verification page for an official certificate. */
export const verifyUrl = (siteUrl: string, certificateId: string) => `${siteUrl}/verify/${encodeURIComponent(certificateId)}`;

/* ---------------------------------------------------------------- official certificates */

export const TRAINING_TYPES: { value: TrainingType; label: string }[] = [
  { value: "academy_course", label: "Academy Course" },
  { value: "academy_programme", label: "Academy Programme" },
  { value: "one_on_one", label: "One-on-One Training" },
  { value: "corporate", label: "Corporate Training" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "workshop", label: "Workshop" },
  { value: "private", label: "Private Training" },
  { value: "other", label: "Other" },
];

/** label: what admins choose. heading: the certificate's title line. verb: the line before the training. */
export const CERTIFICATE_TYPES: { value: CertificateType; label: string; heading: string; verb: string }[] = [
  { value: "completion", label: "Certificate of Completion", heading: "Certificate of Completion", verb: "has successfully completed" },
  { value: "professional_training", label: "Professional Training Certificate", heading: "Certificate of Professional Training", verb: "has successfully completed professional training in" },
  { value: "achievement", label: "Certificate of Achievement", heading: "Certificate of Achievement", verb: "is recognised for outstanding achievement in" },
  { value: "participation", label: "Certificate of Participation", heading: "Certificate of Participation", verb: "has participated in" },
  { value: "workshop", label: "Workshop Certificate", heading: "Workshop Certificate", verb: "has attended the workshop" },
  { value: "professional_programme", label: "Professional Programme Certificate", heading: "Professional Certificate", verb: "has successfully completed the professional programme" },
];

export const trainingTypeLabel = (t: TrainingType) => TRAINING_TYPES.find((x) => x.value === t)?.label ?? "Training";
export const certificateTypeMeta = (t: CertificateType) => CERTIFICATE_TYPES.find((x) => x.value === t) ?? CERTIFICATE_TYPES[0];

/** "5 October 2026" from a YYYY-MM-DD date, without time-zone shifts. */
export function formatDay(day: string | null | undefined) {
  if (!day) return "";
  const [y, m, d] = day.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** The issue date as YYYY-MM-DD (it is stored as midday UTC on that date). */
export const issueDay = (issuedAt: string) => new Date(issuedAt).toISOString().slice(0, 10);

/** Today in the admin's own time zone, as YYYY-MM-DD. */
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "1 August – 30 September 2026", or a single date. */
export function trainingPeriod(start: string | null, end: string | null) {
  if (!end) return formatDay(start);
  if (!start || start === end) return formatDay(end);
  const [a, b] = [formatDay(start), formatDay(end)];
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return `${sameYear ? a.replace(/ \d{4}$/, "") : a} – ${b}`;
}

/** The JSON the certificate functions take. The server trims everything and turns empty strings into nulls. */
export const certificatePayload = (i: CertificateInput) => ({
  recipientName: i.recipientName,
  recipientEmail: i.recipientEmail,
  userId: i.userId,
  courseId: i.courseId,
  certificateTitle: i.certificateTitle,
  programmeName: i.programmeName,
  trainingType: i.trainingType,
  certificateType: i.certificateType,
  instructorName: i.instructorName,
  description: i.description,
  startDate: i.startDate,
  completionDate: i.completionDate,
  issueDate: i.issueDate,
  grade: i.grade,
  duration: i.duration,
  templateId: i.templateId,
});

/** Admin search: name, email, certificate title, programme or number. */
export function matchesCertificate(c: Certificate, search?: string) {
  const q = (search ?? "").trim().toLowerCase();
  if (!q) return true;
  return [c.certificateId, c.recipientName, c.recipientEmail, c.certificateTitle, c.courseTitle].some((v) => v?.toLowerCase().includes(q));
}

/** A certificate's details as form input, for reissuing. */
export const inputFromCertificate = (c: Certificate): CertificateInput => ({
  recipientName: c.recipientName,
  recipientEmail: c.recipientEmail ?? "",
  userId: c.userId ?? "",
  courseId: c.courseId ?? "",
  certificateTitle: c.certificateTitle ?? "",
  programmeName: c.courseTitle,
  trainingType: c.trainingType,
  certificateType: c.certificateType,
  instructorName: c.instructorName ?? "",
  description: c.description ?? "",
  startDate: c.startDate ?? "",
  completionDate: c.completionDate ?? issueDay(c.issuedAt),
  issueDate: today(),
  grade: c.grade ?? "",
  duration: c.duration ?? "",
  templateId: c.templateId,
});

/** What a certificate is for: its title, or the course for course certificates. */
export const certificateName = (c: Pick<Certificate, "certificateTitle" | "courseTitle" | "source">) =>
  c.source !== "course" && c.certificateTitle ? (c.source === "programme" ? `Professional Certificate in ${c.certificateTitle}` : c.certificateTitle) : c.courseTitle;
