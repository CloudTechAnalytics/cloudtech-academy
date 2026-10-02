/**
 * Demo backend: everything is stored in this browser's localStorage.
 * Used when Supabase isn't configured, so the whole learning journey can be tried
 * locally. Accounts here are not real accounts, and credentials and certificates can only be
 * verified in the same browser; the UI says so wherever it matters. Payment is simulated.
 */
import { BUNDLED_ASSESSMENTS, BUNDLED_COURSES, BUNDLED_PROJECTS } from "@/content";
import type { AssessmentDef, Course } from "@/content/types";
import { requiredExerciseIds } from "../lesson-format";
import { certificateNumber, eligibility, newCredentialId } from "../certificates";
import { PROFILE_SLUG_RE, SLUG_HELP } from "../profile";
import { PRACTICE_PROJECTS } from "@/content/projects";
import { PROJECT_ANSWERS } from "@/content/project-answers";
import { SUMMARY_MAX, SUMMARY_MIN, gradeCheck, gradingKey, isWorkUrl } from "../project-grading";
import {
  BackendError,
  type AttemptResult,
  type Backend,
  type Certificate,
  type CertificateOrder,
  type CertificatePrice,
  type Credential,
  type PracticeSubmission,
  type PublicCredential,
  type Enrollment,
  type ProjectSubmission,
  type User,
} from "./types";

type StoredUser = User & { passwordHash: string; salt: string; joinedAt: string; publicSlug?: string; profilePublic?: boolean; headline?: string };
type Store = {
  users: StoredUser[];
  sessionUserId: string | null;
  enrollments: Record<string, Enrollment[]>;
  lessons: Record<string, string[]>; // `${userId}|${courseId}` -> lesson ids
  exercises: Record<string, string[]>;
  attempts: Record<string, (AttemptResult & { assessmentId: string })[]>; // userId -> attempts
  submissions: ProjectSubmission[];
  credentials: Credential[];
  orders: CertificateOrder[];
  certificates: Certificate[];
  certificateSeq: number;
  prices: CertificatePrice[] | null; // admin edits (null = defaults)
  courses: Course[] | null; // admin edits (null = bundled content)
  assessments: AssessmentDef[] | null;
  activity: Record<string, string>; // userId -> last active
  practice: PracticeSubmission[];
};

// v2: credentials, orders and paid certificates replaced the v1 certificates.
const KEY = "ct-academy-demo-v2";

/** Same starting prices as the database. */
const DEFAULT_PRICES: CertificatePrice[] = [
  { currency: "NGN", amount: 3000, active: true, position: 1 },
  { currency: "USD", amount: 7, active: true, position: 2 },
];
const empty = (): Store => ({
  users: [],
  sessionUserId: null,
  enrollments: {},
  lessons: {},
  exercises: {},
  attempts: {},
  submissions: [],
  credentials: [],
  orders: [],
  certificates: [],
  certificateSeq: 0,
  prices: null,
  courses: null,
  assessments: null,
  activity: {},
  practice: [],
});

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}
function save(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    throw new BackendError("Your browser blocked storage, so demo progress can't be saved.");
  }
}
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

async function hash(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const publicUser = ({ id, email, fullName, role }: StoredUser): User => ({ id, email, fullName, role });

const prices = (s = load()) => s.prices ?? DEFAULT_PRICES;

function recipientName(u: User) {
  if (!u.fullName.trim()) throw new BackendError("Add your full name to your profile first. It appears on your badges and certificate.");
  return u.fullName.trim();
}

/** Adds a credential to the store (the caller saves). */
function newCredential(
  s: Store,
  u: User,
  f: Pick<Credential, "kind" | "courseId" | "moduleId" | "badgeName" | "courseTitle" | "moduleTitle" | "skills" | "projectId"> & { code: string },
): Credential {
  let credentialId = newCredentialId(f.code);
  while (s.credentials.some((c) => c.credentialId === credentialId)) credentialId = newCredentialId(f.code);
  const { code: _code, ...fields } = f;
  void _code;
  const cred: Credential = { id: uid(), credentialId, userId: u.id, recipientName: recipientName(u), issuedAt: now(), status: "valid", revokedReason: null, ...fields };
  s.credentials.push(cred);
  s.activity[u.id] = now();
  return cred;
}

/** A project badge also shows the learner's work and whether it was reviewed. */
function withWork(s: Store, c: Credential): Credential {
  if (c.kind !== "project_badge") return c;
  const sub = s.practice.find((p) => p.userId === c.userId && p.projectId === c.projectId);
  return { ...c, workUrl: sub?.workUrl ?? null, reviewed: !!sub?.reviewedAt };
}

function publicCredential(s: Store, c: Credential): PublicCredential {
  const { credentialId, kind, badgeName, courseId, courseTitle, moduleTitle, recipientName, skills, issuedAt, status } = c;
  const w = withWork(s, c);
  return { credentialId, kind, badgeName, courseId, courseTitle, moduleTitle, recipientName, skills, issuedAt, status, projectId: c.projectId ?? null, workUrl: w.workUrl ?? null, reviewed: !!w.reviewed };
}

/** Issues the certificate for a paid or granted order (the caller saves). */
function issueCertificate(s: Store, order: CertificateOrder): Certificate {
  const existing = s.certificates.find((c) => c.userId === order.userId && c.courseId === order.courseId && c.status === "valid");
  if (existing) return existing;
  const cred = s.credentials.find((c) => c.credentialId === order.credentialId)!;
  s.certificateSeq += 1;
  const cert: Certificate = {
    id: uid(),
    certificateId: certificateNumber(s.certificateSeq),
    credentialId: cred.credentialId,
    userId: order.userId,
    courseId: order.courseId,
    recipientName: cred.recipientName,
    courseTitle: cred.courseTitle,
    issuedAt: now(),
    status: "valid",
    revokedReason: null,
  };
  s.certificates.push(cert);
  return cert;
}

export function createDemoBackend(): Backend {
  const listeners = new Set<(u: User | null) => void>();
  const current = () => {
    const s = load();
    const u = s.users.find((x) => x.id === s.sessionUserId);
    return u ? publicUser(u) : null;
  };
  const notify = () => listeners.forEach((cb) => cb(current()));
  const requireUser = () => {
    const u = current();
    if (!u) throw new BackendError("Please sign in first.");
    return u;
  };
  const requireAdmin = () => {
    const u = requireUser();
    if (u.role !== "admin") throw new BackendError("Admins only.");
    return u;
  };
  const courses = (s = load()) => s.courses ?? BUNDLED_COURSES;
  const assessments = (s = load()) => s.assessments ?? BUNDLED_ASSESSMENTS;
  const mutateCourses = (fn: (courses: Course[]) => void) => {
    const s = load();
    const list = clone(courses(s));
    fn(list);
    s.courses = list;
    save(s);
  };
  const key = (userId: string, courseId: string) => `${userId}|${courseId}`;
  /** A module's check when moduleId is given, otherwise the course's final assessment. */
  const findAssessment = (courseId: string, moduleId?: string) =>
    assessments().find((a) => a.courseId === courseId && (moduleId ? a.kind === "module" && a.moduleId === moduleId : a.kind !== "module"));

  if (typeof window !== "undefined") window.addEventListener("storage", (e) => e.key === KEY && notify());

  const backend: Backend = {
    mode: "demo",

    async getUser() {
      return current();
    },
    onAuthChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    async signUp({ fullName, email, password }) {
      const s = load();
      const e = email.trim().toLowerCase();
      if (s.users.some((u) => u.email === e)) throw new BackendError("An account with this email already exists in this browser.");
      const salt = uid();
      // When running locally, the first demo account is an admin so the admin area can be explored.
      // Never on the live site: there, admins exist only in the database.
      const user: StoredUser = { id: uid(), email: e, fullName: fullName.trim(), role: import.meta.env.DEV && !s.users.length ? "admin" : "student", salt, passwordHash: await hash(password, salt), joinedAt: now() };
      s.users.push(user);
      s.sessionUserId = user.id;
      save(s);
      notify();
      return { needsConfirmation: false };
    },
    async signIn(email, password) {
      const s = load();
      const u = s.users.find((x) => x.email === email.trim().toLowerCase());
      if (!u || (await hash(password, u.salt)) !== u.passwordHash) throw new BackendError("That email and password don't match.");
      s.sessionUserId = u.id;
      save(s);
      notify();
    },
    async signOut() {
      const s = load();
      s.sessionUserId = null;
      save(s);
      notify();
    },
    async requestPasswordReset() {
      throw new BackendError("Password reset emails need the live Academy. In demo mode, create a new account instead.");
    },
    async updatePassword(password) {
      const u = requireUser();
      const s = load();
      const stored = s.users.find((x) => x.id === u.id)!;
      stored.salt = uid();
      stored.passwordHash = await hash(password, stored.salt);
      save(s);
    },
    async updateProfile({ fullName }) {
      const u = requireUser();
      const s = load();
      s.users.find((x) => x.id === u.id)!.fullName = fullName.trim();
      save(s);
      notify();
    },

    async getPublicProfileSettings() {
      const u = requireUser();
      const me = load().users.find((x) => x.id === u.id)!;
      return { isPublic: Boolean(me.profilePublic), slug: me.publicSlug ?? "", headline: me.headline ?? "" };
    },
    async savePublicProfileSettings({ isPublic, slug, headline }) {
      const u = requireUser();
      const s = load();
      const me = s.users.find((x) => x.id === u.id)!;
      const clean = slug.trim().toLowerCase();
      if (clean && !PROFILE_SLUG_RE.test(clean)) throw new BackendError(`Your profile address needs ${SLUG_HELP}`);
      if (isPublic && !clean) throw new BackendError("Choose a profile address first.");
      if (isPublic && !me.fullName.trim())
        throw new BackendError("Add your full name first. It appears on your public profile.");
      if (clean && s.users.some((x) => x.id !== me.id && x.publicSlug === clean))
        throw new BackendError("That profile address is taken. Try another.");
      me.profilePublic = isPublic;
      me.publicSlug = clean || undefined;
      me.headline = headline.trim().slice(0, 120);
      save(s);
    },
    async getPublicProfile(slug) {
      const s = load();
      const me = s.users.find((x) => x.publicSlug === slug.trim().toLowerCase() && x.profilePublic);
      if (!me) return null;
      const byNewest = (a: { issuedAt: string }, b: { issuedAt: string }) => b.issuedAt.localeCompare(a.issuedAt);
      return {
        slug: me.publicSlug!,
        name: me.fullName.trim(),
        headline: me.headline ?? "",
        memberSince: me.joinedAt,
        credentials: s.credentials
          .filter((c) => c.userId === me.id && c.status === "valid")
          .sort(byNewest)
          .map((c) => publicCredential(s, c)),
        certificates: s.certificates
          .filter((c) => c.userId === me.id && c.status === "valid")
          .sort(byNewest)
          .map(({ certificateId, credentialId, recipientName, courseTitle, issuedAt, status }) => ({
            certificateId,
            credentialId,
            recipientName,
            courseTitle,
            issuedAt,
            status,
          })),
      };
    },

    async listCourses(opts) {
      return courses().filter((c) => opts?.includeUnpublished || c.published);
    },
    async getCourse(slug, opts) {
      const c = courses().find((x) => x.slug === slug);
      return c && (opts?.includeUnpublished || c.published) ? c : null;
    },
    async getAssessment(courseId, moduleId) {
      const a = findAssessment(courseId, moduleId);
      if (!a) return null;
      return {
        id: a.id,
        courseId: a.courseId,
        kind: a.kind ?? "final",
        moduleId: a.moduleId ?? null,
        title: a.title,
        passingScore: a.passingScore,
        questions: a.questions.map(({ id, prompt, options }) => ({ id, prompt, options })),
      };
    },
    async getProject(courseId) {
      return BUNDLED_PROJECTS.find((p) => p.courseId === courseId) ?? null;
    },

    async listEnrollments() {
      const u = current();
      return u ? (load().enrollments[u.id] ?? []) : [];
    },
    async enroll(courseId) {
      const u = requireUser();
      const s = load();
      const list = (s.enrollments[u.id] ??= []);
      if (!list.some((e) => e.courseId === courseId)) list.push({ courseId, enrolledAt: now(), completedAt: null, lastLessonId: null });
      save(s);
    },
    async setLastLesson(courseId, lessonId) {
      const u = current();
      if (!u) return;
      const s = load();
      const e = (s.enrollments[u.id] ?? []).find((x) => x.courseId === courseId);
      if (e) {
        e.lastLessonId = lessonId;
        save(s);
      }
    },
    async getProgress(courseId) {
      const u = current();
      if (!u) return { completedLessons: [], completedExercises: [] };
      const s = load();
      return { completedLessons: s.lessons[key(u.id, courseId)] ?? [], completedExercises: s.exercises[key(u.id, courseId)] ?? [] };
    },
    async setLessonComplete(courseId, lessonId, done) {
      const u = requireUser();
      await backend.enroll(courseId);
      const s = load();
      const set = new Set(s.lessons[key(u.id, courseId)] ?? []);
      if (done) set.add(lessonId);
      else set.delete(lessonId);
      s.lessons[key(u.id, courseId)] = [...set];
      s.activity[u.id] = now();
      save(s);
    },
    async recordExercise(courseId, _lessonId, exerciseId) {
      const u = requireUser();
      await backend.enroll(courseId);
      const s = load();
      const set = new Set(s.exercises[key(u.id, courseId)] ?? []);
      set.add(exerciseId);
      s.exercises[key(u.id, courseId)] = [...set];
      s.activity[u.id] = now();
      save(s);
    },
    async submitAssessment(assessmentId, answers) {
      const u = requireUser();
      const a = assessments().find((x) => x.id === assessmentId);
      if (!a) throw new BackendError("Assessment not found.");
      const correct = a.questions.filter((q) => answers[q.id] === q.answer).length;
      const score = Math.round((correct / a.questions.length) * 100);
      const result = { id: uid(), assessmentId, score, passed: score >= a.passingScore, correct, total: a.questions.length, submittedAt: now() };
      const s = load();
      (s.attempts[u.id] ??= []).push(result);
      s.activity[u.id] = now();
      save(s);
      return result;
    },
    async listAttempts(assessmentId) {
      const u = current();
      if (!u) return [];
      return (load().attempts[u.id] ?? []).filter((a) => a.assessmentId === assessmentId);
    },
    async getSubmission(projectId) {
      const u = current();
      if (!u) return null;
      return load().submissions.find((x) => x.userId === u.id && x.projectId === projectId) ?? null;
    },
    async submitProject(projectId, { content, url }) {
      const u = requireUser();
      const s = load();
      let sub = s.submissions.find((x) => x.userId === u.id && x.projectId === projectId);
      if (sub) Object.assign(sub, { content, url, status: "submitted", submittedAt: now() });
      else {
        sub = { id: uid(), projectId, userId: u.id, content, url, status: "submitted", submittedAt: now(), feedback: null };
        s.submissions.push(sub);
      }
      save(s);
      return sub;
    },

    async claimModuleBadge(moduleId) {
      const u = requireUser();
      const s = load();
      const existing = s.credentials.find((c) => c.userId === u.id && c.kind === "module_badge" && c.moduleId === moduleId && c.status === "valid");
      if (existing) return existing;
      const course = courses(s).find((c) => c.modules.some((m) => m.id === moduleId));
      const mod = course?.modules.find((m) => m.id === moduleId);
      if (!course || !mod?.badge) throw new BackendError("This module has no badge.");
      const check = assessments(s).find((a) => a.kind === "module" && a.moduleId === moduleId);
      if (!check || !(s.attempts[u.id] ?? []).some((t) => t.assessmentId === check.id && t.passed)) throw new BackendError("Pass the module check first.");
      const cred = newCredential(s, u, {
        kind: "module_badge",
        code: mod.badgeCode ?? course.code,
        courseId: course.id,
        moduleId: mod.id,
        badgeName: mod.badge,
        courseTitle: course.title,
        moduleTitle: mod.title,
        skills: mod.skills,
      });
      save(s);
      return cred;
    },
    async issueCourseCredential(courseId) {
      const u = requireUser();
      const s = load();
      const existing = s.credentials.find((c) => c.userId === u.id && c.kind === "course_completion" && c.courseId === courseId && c.status === "valid");
      if (existing) return existing;
      const course = courses(s).find((c) => c.id === courseId);
      if (!course) throw new BackendError("Course not found.");
      const final = assessments(s).find((a) => a.courseId === courseId && a.kind !== "module");
      const project = BUNDLED_PROJECTS.find((p) => p.courseId === courseId) ?? null;
      const progress = await backend.getProgress(courseId);
      const attempts = final ? await backend.listAttempts(final.id) : [];
      const submission = project ? await backend.getSubmission(project.id) : null;
      const badges = new Set(s.credentials.filter((c) => c.userId === u.id && c.kind === "module_badge" && c.status === "valid").map((c) => c.moduleId ?? ""));
      if (!eligibility(course, progress, attempts, submission, project, badges).eligible)
        throw new BackendError("You haven't met every requirement for this course yet.");
      const cred = newCredential(s, u, {
        kind: "course_completion",
        code: course.code,
        courseId,
        moduleId: null,
        badgeName: course.completionBadge ?? course.title,
        courseTitle: course.title,
        moduleTitle: null,
        skills: course.skills,
      });
      const enr = (s.enrollments[u.id] ?? []).find((e) => e.courseId === courseId);
      if (enr) enr.completedAt = cred.issuedAt;
      save(s);
      return cred;
    },
    async listMyCredentials() {
      const u = current();
      if (!u) return [];
      const s = load();
      return s.credentials.filter((c) => c.userId === u.id).map((c) => withWork(s, c));
    },
    async verifyCredential(credentialId) {
      const s = load();
      const c = s.credentials.find((x) => x.credentialId === credentialId.trim().toUpperCase());
      return c ? publicCredential(s, c) : null;
    },

    async getPracticeSubmission(projectId) {
      const u = current();
      return (u && load().practice.find((p) => p.userId === u.id && p.projectId === projectId)) || null;
    },
    async listMyPracticeSubmissions() {
      const u = current();
      return u ? load().practice.filter((p) => p.userId === u.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) : [];
    },
    // Mirrors submit_practice_project() in supabase/migrations/0003_project_badges.sql.
    async submitPracticeProject({ projectId, workUrl, summary, answers }) {
      const u = requireUser();
      const project = PRACTICE_PROJECTS.find((p) => p.id === projectId);
      if (!project) throw new BackendError("Project not found.");
      const url = workUrl.trim();
      const text = summary.trim();
      if (!isWorkUrl(url)) throw new BackendError("Add a link to your work that starts with https://");
      if (text.length < SUMMARY_MIN) throw new BackendError(`Write a few sentences (at least ${SUMMARY_MIN} characters) about what you found.`);
      if (text.length > SUMMARY_MAX) throw new BackendError("Keep your summary under 3,000 characters.");
      const results: Record<string, boolean> = {};
      for (const c of project.checks) results[c.id] = gradeCheck(gradingKey(c, PROJECT_ANSWERS[c.id]), answers[c.id]);
      const correct = Object.values(results).filter(Boolean).length;
      const total = project.checks.length;
      const s = load();
      let sub = s.practice.find((p) => p.userId === u.id && p.projectId === projectId);
      const t = now();
      if (sub) {
        const sameWork = sub.workUrl === url;
        Object.assign(sub, {
          workUrl: url,
          summary: text,
          answers,
          correct,
          total,
          passed: sub.passed || correct === total,
          attempts: sub.attempts + 1,
          updatedAt: t,
          reviewedAt: sameWork ? sub.reviewedAt : null,
          reviewNote: sameWork ? sub.reviewNote : null,
        });
      } else {
        sub = { id: uid(), userId: u.id, projectId, workUrl: url, summary: text, answers, correct, total, passed: correct === total, attempts: 1, submittedAt: t, updatedAt: t, reviewedAt: null, reviewNote: null };
        s.practice.push(sub);
      }
      let cred = s.credentials.find((c) => c.userId === u.id && c.kind === "project_badge" && c.projectId === projectId && c.status === "valid");
      if (sub.passed && !cred)
        cred = newCredential(s, u, {
          kind: "project_badge",
          code: project.badge.code,
          courseId: null,
          moduleId: null,
          projectId,
          badgeName: project.badge.name,
          courseTitle: project.title,
          moduleTitle: null,
          skills: project.badge.skills,
        });
      s.activity[u.id] = t;
      save(s);
      return { passed: sub.passed, correct, total, results, credentialId: cred?.credentialId ?? null };
    },

    paymentsEnabled: true,
    async listCertificatePrices() {
      return prices().filter((p) => p.active);
    },
    async startCertificateOrder(courseId, currency) {
      const u = requireUser();
      const s = load();
      const cred = s.credentials.find((c) => c.userId === u.id && c.courseId === courseId && c.kind === "course_completion" && c.status === "valid");
      if (!cred) throw new BackendError("Complete the course first. Your free completion badge comes first.");
      if (s.certificates.some((c) => c.userId === u.id && c.courseId === courseId && c.status === "valid"))
        throw new BackendError("You already have the official certificate for this course.");
      const price = prices(s).find((p) => p.currency === currency.toUpperCase() && p.active);
      if (!price) throw new BackendError("That currency isn't available.");
      const pending = s.orders.find((o) => o.userId === u.id && o.courseId === courseId && o.status === "pending" && o.currency === price.currency);
      if (pending) return pending;
      const order: CertificateOrder = {
        id: uid(),
        userId: u.id,
        courseId,
        credentialId: cred.credentialId,
        currency: price.currency,
        amount: price.amount,
        status: "pending",
        provider: null,
        providerRef: null,
        note: null,
        createdAt: now(),
        paidAt: null,
      };
      s.orders.push(order);
      save(s);
      return order;
    },
    async listMyOrders() {
      const u = current();
      return u ? load().orders.filter((o) => o.userId === u.id) : [];
    },
    async simulatePayment(orderId) {
      const u = requireUser();
      const s = load();
      const order = s.orders.find((o) => o.id === orderId && o.userId === u.id);
      if (!order) throw new BackendError("Order not found.");
      Object.assign(order, { status: "paid", provider: "demo", providerRef: `demo-${order.id.slice(0, 8)}`, paidAt: now() });
      const cert = issueCertificate(s, order);
      save(s);
      return cert;
    },
    async listMyCertificates() {
      const u = current();
      return u ? load().certificates.filter((c) => c.userId === u.id) : [];
    },
    async getMyCertificate(certificateId) {
      const u = current();
      return u ? (load().certificates.find((c) => c.userId === u.id && c.certificateId === certificateId) ?? null) : null;
    },
    async verifyCertificate(certificateId) {
      const c = load().certificates.find((x) => x.certificateId === certificateId.trim().toUpperCase());
      return c
        ? { certificateId: c.certificateId, credentialId: c.credentialId, recipientName: c.recipientName, courseTitle: c.courseTitle, issuedAt: c.issuedAt, status: c.status }
        : null;
    },

    admin: {
      async saveCourse(input) {
        requireAdmin();
        mutateCourses((list) => {
          const i = list.findIndex((c) => c.id === input.id);
          if (i >= 0) list[i] = { ...list[i], ...input };
          else list.push({ ...input, modules: [] });
        });
      },
      async saveModule(input) {
        requireAdmin();
        mutateCourses((list) => {
          const c = list.find((x) => x.id === input.courseId);
          if (!c) throw new BackendError("Course not found.");
          const m = c.modules.find((x) => x.id === input.id);
          if (m) Object.assign(m, input);
          else c.modules.push({ ...input, lessons: [] });
          c.modules.sort((a, b) => a.position - b.position);
        });
      },
      async deleteModule(moduleId) {
        requireAdmin();
        mutateCourses((list) => list.forEach((c) => (c.modules = c.modules.filter((m) => m.id !== moduleId))));
      },
      async reorderModules(courseId, ids) {
        requireAdmin();
        mutateCourses((list) => {
          const c = list.find((x) => x.id === courseId)!;
          c.modules.forEach((m) => (m.position = ids.indexOf(m.id) + 1));
          c.modules.sort((a, b) => a.position - b.position);
        });
      },
      async saveLesson(input) {
        requireAdmin();
        mutateCourses((list) => {
          const c = list.find((x) => x.id === input.courseId);
          const m = c?.modules.find((x) => x.id === input.moduleId);
          if (!c || !m) throw new BackendError("Module not found.");
          c.modules.forEach((mod) => (mod.lessons = mod.lessons.filter((l) => l.id !== input.id || mod.id === m.id)));
          const lesson = { ...input, requiredExercises: requiredExerciseIds(input.body) };
          const i = m.lessons.findIndex((l) => l.id === input.id);
          if (i >= 0) m.lessons[i] = lesson;
          else m.lessons.push(lesson);
          m.lessons.sort((a, b) => a.position - b.position);
        });
      },
      async deleteLesson(lessonId) {
        requireAdmin();
        mutateCourses((list) => list.forEach((c) => c.modules.forEach((m) => (m.lessons = m.lessons.filter((l) => l.id !== lessonId)))));
      },
      async getAssessment(courseId, moduleId) {
        requireAdmin();
        return findAssessment(courseId, moduleId) ?? null;
      },
      async saveAssessment(def) {
        requireAdmin();
        const s = load();
        const list = clone(assessments(s)).filter((a) => a.id !== def.id);
        list.push(def);
        s.assessments = list;
        save(s);
      },
      async listStudents() {
        requireAdmin();
        const s = load();
        return s.users.filter((u) => u.role !== "admin").map((u) => ({
          userId: u.id,
          fullName: u.fullName,
          email: u.email,
          joinedAt: u.joinedAt,
          enrollments: (s.enrollments[u.id] ?? []).length,
          completedCourses: (s.enrollments[u.id] ?? []).filter((e) => e.completedAt).length,
          certificates: s.certificates.filter((c) => c.userId === u.id && c.status === "valid").length,
          badges: s.credentials.filter((c) => c.userId === u.id && c.status === "valid").length,
          lessonsCompleted: Object.entries(s.lessons)
            .filter(([k]) => k.startsWith(`${u.id}|`))
            .reduce((n, [, ids]) => n + ids.length, 0),
          lastActiveAt: [s.activity[u.id], ...(s.enrollments[u.id] ?? []).map((e) => e.enrolledAt)].filter(Boolean).sort().at(-1) ?? null,
        }));
      },
      async getStudent(userId) {
        const all = await backend.admin.listStudents();
        const summary = all.find((x) => x.userId === userId);
        if (!summary) return null;
        const s = load();
        return {
          summary,
          credentials: s.credentials.filter((c) => c.userId === userId),
          courses: (s.enrollments[userId] ?? []).map((e) => {
            const c = courses(s).find((x) => x.id === e.courseId);
            const total = c ? c.modules.flatMap((m) => m.lessons).filter((l) => l.published && l.required).length : 0;
            return { courseId: e.courseId, courseTitle: c?.title ?? e.courseId, enrolledAt: e.enrolledAt, completedLessons: (s.lessons[key(userId, e.courseId)] ?? []).length, totalLessons: total, completedAt: e.completedAt };
          }),
        };
      },
      async listCredentials(search) {
        requireAdmin();
        const q = (search ?? "").trim().toLowerCase();
        return load()
          .credentials.filter((c) => !q || c.credentialId.toLowerCase().includes(q) || c.recipientName.toLowerCase().includes(q) || c.badgeName.toLowerCase().includes(q))
          .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
      },
      async revokeCredential(id, reason) {
        requireAdmin();
        const s = load();
        const c = s.credentials.find((x) => x.id === id);
        if (c) Object.assign(c, { status: "revoked", revokedReason: reason });
        save(s);
      },
      async listCertificates(search) {
        requireAdmin();
        const q = (search ?? "").trim().toLowerCase();
        return load().certificates.filter((c) => !q || c.certificateId.toLowerCase().includes(q) || c.recipientName.toLowerCase().includes(q));
      },
      async revokeCertificate(id, reason) {
        requireAdmin();
        const s = load();
        const c = s.certificates.find((x) => x.id === id);
        if (c) Object.assign(c, { status: "revoked", revokedReason: reason });
        save(s);
      },
      async listOrders() {
        requireAdmin();
        const s = load();
        return s.orders
          .map((o) => {
            const u = s.users.find((x) => x.id === o.userId);
            return {
              ...o,
              learnerName: u?.fullName ?? "Unknown",
              learnerEmail: u?.email ?? "",
              courseTitle: courses(s).find((c) => c.id === o.courseId)?.title ?? o.courseId,
              certificateId: s.certificates.find((c) => c.userId === o.userId && c.courseId === o.courseId && c.status === "valid")?.certificateId ?? null,
            };
          })
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },
      async listPracticeSubmissions() {
        requireAdmin();
        const s = load();
        return [...s.practice]
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .map((p) => {
            const who = s.users.find((x) => x.id === p.userId);
            return {
              ...p,
              learnerName: who?.fullName || "Unknown",
              learnerEmail: who?.email ?? "",
              projectTitle: PRACTICE_PROJECTS.find((x) => x.id === p.projectId)?.title ?? p.projectId,
              credentialId: s.credentials.find((c) => c.userId === p.userId && c.kind === "project_badge" && c.projectId === p.projectId && c.status === "valid")?.credentialId ?? null,
            };
          });
      },
      async reviewPracticeSubmission(id, reviewed, note) {
        requireAdmin();
        const s = load();
        const p = s.practice.find((x) => x.id === id);
        if (!p) throw new BackendError("Submission not found.");
        p.reviewedAt = reviewed ? now() : null;
        p.reviewNote = note.trim() || null;
        save(s);
      },
      async grantCertificate(orderId, note) {
        requireAdmin();
        const s = load();
        const order = s.orders.find((o) => o.id === orderId);
        if (!order) throw new BackendError("Order not found.");
        Object.assign(order, { status: "granted", note: note.trim() || null, paidAt: order.paidAt ?? now() });
        const cert = issueCertificate(s, order);
        save(s);
        return cert;
      },
      async listPrices() {
        requireAdmin();
        return prices();
      },
      async savePrice(price) {
        requireAdmin();
        const s = load();
        const list = clone(prices(s)).filter((p) => p.currency !== price.currency.toUpperCase());
        list.push({ ...price, currency: price.currency.toUpperCase() });
        s.prices = list.sort((a, b) => a.position - b.position);
        save(s);
      },
      async listSubmissions() {
        requireAdmin();
        const s = load();
        return s.submissions.map((x) => ({
          ...x,
          studentName: s.users.find((u) => u.id === x.userId)?.fullName ?? "Unknown",
          projectTitle: BUNDLED_PROJECTS.find((p) => p.id === x.projectId)?.title ?? x.projectId,
        }));
      },
      async reviewSubmission(id, status, feedback) {
        requireAdmin();
        const s = load();
        const x = s.submissions.find((y) => y.id === id);
        if (x) Object.assign(x, { status, feedback });
        save(s);
      },
    },
  };
  return backend;
}
