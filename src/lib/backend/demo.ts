/**
 * Demo backend: everything is stored in this browser's localStorage.
 * Used when Supabase isn't configured, so the whole learning journey can be tried
 * locally. Accounts here are not real accounts and certificates can only be verified
 * in the same browser; the UI says so wherever it matters.
 */
import { BUNDLED_ASSESSMENTS, BUNDLED_COURSES, BUNDLED_PROJECTS } from "@/content";
import type { AssessmentDef, Course } from "@/content/types";
import { requiredExerciseIds } from "../lesson-format";
import { eligibility, newCredentialId } from "../certificates";
import {
  BackendError,
  type AttemptResult,
  type Backend,
  type Certificate,
  type Enrollment,
  type ProjectSubmission,
  type QuickCompletion,
  type User,
} from "./types";

type StoredUser = User & { passwordHash: string; salt: string; joinedAt: string };
type Store = {
  users: StoredUser[];
  sessionUserId: string | null;
  enrollments: Record<string, Enrollment[]>;
  lessons: Record<string, string[]>; // `${userId}|${courseId}` -> lesson ids
  exercises: Record<string, string[]>;
  attempts: Record<string, (AttemptResult & { assessmentId: string })[]>; // userId -> attempts
  submissions: ProjectSubmission[];
  certificates: Certificate[];
  courses: Course[] | null; // admin edits (null = bundled content)
  assessments: AssessmentDef[] | null;
  activity: Record<string, string>; // userId -> last active
  quick: Record<string, QuickCompletion[]>; // userId -> passed quick courses
};

const KEY = "ct-academy-demo-v1";
const empty = (): Store => ({
  users: [],
  sessionUserId: null,
  enrollments: {},
  lessons: {},
  exercises: {},
  attempts: {},
  submissions: [],
  certificates: [],
  courses: null,
  assessments: null,
  activity: {},
  quick: {},
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

    async listCourses(opts) {
      return courses().filter((c) => opts?.includeUnpublished || c.published);
    },
    async getCourse(slug, opts) {
      const c = courses().find((x) => x.slug === slug);
      return c && (opts?.includeUnpublished || c.published) ? c : null;
    },
    async getAssessment(courseId) {
      const a = assessments().find((x) => x.courseId === courseId);
      if (!a) return null;
      return { id: a.id, courseId: a.courseId, title: a.title, passingScore: a.passingScore, questions: a.questions.map(({ id, prompt, options }) => ({ id, prompt, options })) };
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

    async issueCertificate(courseId) {
      const u = requireUser();
      const s = load();
      const existing = s.certificates.find((c) => c.userId === u.id && c.courseId === courseId && c.status === "valid");
      if (existing) return existing;
      const course = courses(s).find((c) => c.id === courseId);
      if (!course) throw new BackendError("Course not found.");
      const assessment = assessments(s).find((a) => a.courseId === courseId);
      const project = BUNDLED_PROJECTS.find((p) => p.courseId === courseId) ?? null;
      const progress = await backend.getProgress(courseId);
      const attempts = assessment ? await backend.listAttempts(assessment.id) : [];
      const submission = project ? await backend.getSubmission(project.id) : null;
      if (!eligibility(course, progress, attempts, submission, project).eligible)
        throw new BackendError("You haven't met every requirement for this certificate yet.");
      let credentialId = newCredentialId(course.code);
      while (s.certificates.some((c) => c.credentialId === credentialId)) credentialId = newCredentialId(course.code);
      const cert: Certificate = { id: uid(), credentialId, userId: u.id, courseId, recipientName: u.fullName, courseTitle: course.title, issuedAt: now(), status: "valid", revokedReason: null };
      s.certificates.push(cert);
      const enr = (s.enrollments[u.id] ?? []).find((e) => e.courseId === courseId);
      if (enr) enr.completedAt = cert.issuedAt;
      save(s);
      return cert;
    },
    async recordQuickCourse(slug, score) {
      const u = requireUser();
      const s = load();
      const list = (s.quick[u.id] ??= []);
      const prev = list.find((q) => q.slug === slug);
      if (prev) {
        if (score > prev.score) Object.assign(prev, { score, completedAt: now() });
      } else list.push({ slug, score, completedAt: now() });
      s.activity[u.id] = now();
      save(s);
    },
    async listQuickCompletions() {
      const u = current();
      return u ? (load().quick[u.id] ?? []) : [];
    },
    async listMyCertificates() {
      const u = current();
      return u ? load().certificates.filter((c) => c.userId === u.id) : [];
    },
    async getMyCertificate(credentialId) {
      const u = current();
      return u ? (load().certificates.find((c) => c.userId === u.id && c.credentialId === credentialId) ?? null) : null;
    },
    async verifyCertificate(credentialId) {
      const c = load().certificates.find((x) => x.credentialId === credentialId.trim().toUpperCase());
      return c ? { credentialId: c.credentialId, recipientName: c.recipientName, courseTitle: c.courseTitle, issuedAt: c.issuedAt, status: c.status } : null;
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
      async getAssessment(courseId) {
        requireAdmin();
        return assessments().find((a) => a.courseId === courseId) ?? null;
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
          quickBadges: (s.quick[u.id] ?? []).length,
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
          quick: s.quick[userId] ?? [],
          courses: (s.enrollments[userId] ?? []).map((e) => {
            const c = courses(s).find((x) => x.id === e.courseId);
            const total = c ? c.modules.flatMap((m) => m.lessons).filter((l) => l.published && l.required).length : 0;
            return { courseId: e.courseId, courseTitle: c?.title ?? e.courseId, enrolledAt: e.enrolledAt, completedLessons: (s.lessons[key(userId, e.courseId)] ?? []).length, totalLessons: total, completedAt: e.completedAt };
          }),
        };
      },
      async listCertificates(search) {
        requireAdmin();
        const q = (search ?? "").trim().toLowerCase();
        return load().certificates.filter((c) => !q || c.credentialId.toLowerCase().includes(q) || c.recipientName.toLowerCase().includes(q));
      },
      async revokeCertificate(id, reason) {
        requireAdmin();
        const s = load();
        const c = s.certificates.find((x) => x.id === id);
        if (c) Object.assign(c, { status: "revoked", revokedReason: reason });
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
