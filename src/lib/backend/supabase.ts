/**
 * Supabase backend. Tables, row-level security and the grading/certificate functions
 * are defined in supabase/migrations/0001_academy.sql.
 */
import { createClient, type SupabaseClient, type User as SbUser } from "@supabase/supabase-js";
import type { AssessmentDef, Course, Lesson, Module, ProjectDef } from "@/content/types";
import { requiredExerciseIds } from "../lesson-format";
import {
  BackendError,
  type AttemptResult,
  type Backend,
  type Certificate,
  type ProjectSubmission,
  type Role,
  type User,
} from "./types";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new BackendError(res.error.message);
  return res.data;
}

const toLesson = (r: Row): Lesson => ({
  id: r.id,
  courseId: r.course_id,
  moduleId: r.module_id,
  slug: r.slug,
  title: r.title,
  summary: r.summary ?? "",
  minutes: r.minutes,
  body: r.body_md ?? "",
  required: r.required,
  published: r.published,
  position: r.position,
  requiredExercises: r.required_exercises ?? [],
});

const toCourse = (r: Row): Course => ({
  id: r.id,
  slug: r.slug,
  code: r.code,
  title: r.title,
  summary: r.summary,
  description: r.description,
  categoryId: r.category_id,
  difficulty: r.difficulty,
  levelLabel: r.level_label,
  estimatedHours: r.estimated_hours ?? undefined,
  isFree: r.is_free,
  status: r.status,
  published: r.published,
  position: r.position,
  skills: r.skills ?? [],
  prerequisites: r.prerequisites ?? [],
  projectTitle: r.project_title ?? undefined,
  certificate: {
    enabled: r.certificate_enabled,
    requireAllLessons: r.require_all_lessons,
    requireExercises: r.require_exercises,
    requireProject: r.require_project,
    passingScore: r.passing_score,
  },
  modules: ((r.course_modules ?? []) as Row[])
    .map(
      (m): Module => ({
        id: m.id,
        courseId: m.course_id,
        title: m.title,
        position: m.position,
        lessons: ((m.lessons ?? []) as Row[]).map(toLesson).sort((a, b) => a.position - b.position),
      }),
    )
    .sort((a, b) => a.position - b.position),
});

const toCertificate = (r: Row): Certificate => ({
  id: r.id,
  credentialId: r.credential_id,
  userId: r.user_id,
  courseId: r.course_id,
  recipientName: r.recipient_name,
  courseTitle: r.course_title,
  issuedAt: r.issued_at,
  status: r.status,
  revokedReason: r.revoked_reason ?? null,
});

const toAttempt = (r: Row): AttemptResult => ({
  id: r.id,
  score: r.score,
  passed: r.passed,
  correct: r.correct,
  total: r.total,
  submittedAt: r.submitted_at,
});

const toSubmission = (r: Row): ProjectSubmission => ({
  id: r.id,
  projectId: r.project_id,
  userId: r.user_id,
  content: r.content,
  url: r.url ?? "",
  status: r.status,
  submittedAt: r.submitted_at,
  feedback: r.feedback ?? null,
});

const toProject = (r: Row): ProjectDef => ({
  id: r.id,
  courseId: r.course_id,
  title: r.title,
  required: r.required,
  summary: r.summary,
  brief: r.brief_md,
  tasks: r.tasks ?? [],
  datasets: r.datasets ?? [],
});

const LESSON_LIST_COLUMNS = "id, course_id, module_id, slug, title, summary, minutes, required, published, position, required_exercises";

export function createSupabaseBackend(url: string, anonKey: string): Backend {
  const sb: SupabaseClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  let cached: { id: string; user: User } | null = null;
  async function toUser(u: SbUser | null | undefined): Promise<User | null> {
    if (!u) return (cached = null);
    if (cached?.id === u.id) return cached.user;
    const { data } = await sb.from("profiles").select("full_name, role").eq("id", u.id).maybeSingle();
    const user: User = {
      id: u.id,
      email: u.email ?? "",
      fullName: data?.full_name || (u.user_metadata?.full_name as string) || "",
      role: (data?.role as Role) ?? "student",
    };
    cached = { id: u.id, user };
    return user;
  }
  async function requireUserId() {
    const { data } = await sb.auth.getSession();
    const id = data.session?.user.id;
    if (!id) throw new BackendError("Please sign in first.");
    return id;
  }

  const backend: Backend = {
    mode: "supabase",

    async getUser() {
      const { data } = await sb.auth.getSession();
      return toUser(data.session?.user);
    },
    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((_event, session) => {
        cached = null;
        // Don't call Supabase inside this callback directly (it can deadlock); defer it.
        setTimeout(() => void toUser(session?.user).then(cb), 0);
      });
      return () => data.subscription.unsubscribe();
    },
    async signUp({ fullName, email, password }) {
      const res = await sb.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() }, emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (res.error) throw new BackendError(res.error.message);
      return { needsConfirmation: !res.data.session };
    },
    async signIn(email, password) {
      const res = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (res.error) throw new BackendError(res.error.message === "Invalid login credentials" ? "That email and password don't match." : res.error.message);
    },
    async signOut() {
      await sb.auth.signOut();
      cached = null;
    },
    async requestPasswordReset(email) {
      const res = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/update-password` });
      if (res.error) throw new BackendError(res.error.message);
    },
    async updatePassword(password) {
      const res = await sb.auth.updateUser({ password });
      if (res.error) throw new BackendError(res.error.message);
    },
    async updateProfile({ fullName }) {
      const id = await requireUserId();
      check(await sb.from("profiles").update({ full_name: fullName.trim() }).eq("id", id));
      cached = null;
    },

    async listCourses(opts) {
      let q = sb.from("courses").select(`*, course_modules(*, lessons(${LESSON_LIST_COLUMNS}))`).order("position");
      if (!opts?.includeUnpublished) q = q.eq("published", true);
      return (check(await q) as Row[]).map(toCourse);
    },
    async getCourse(slug, opts) {
      let q = sb.from("courses").select("*, course_modules(*, lessons(*))").eq("slug", slug);
      if (!opts?.includeUnpublished) q = q.eq("published", true);
      const row = check(await q.maybeSingle()) as Row | null;
      return row ? toCourse(row) : null;
    },
    async getAssessment(courseId) {
      const row = check(await sb.from("assessments").select("*, assessment_questions(id, prompt, options, position)").eq("course_id", courseId).maybeSingle()) as Row | null;
      if (!row) return null;
      return {
        id: row.id,
        courseId: row.course_id,
        title: row.title,
        passingScore: row.passing_score,
        questions: ((row.assessment_questions ?? []) as Row[]).sort((a, b) => a.position - b.position).map((q) => ({ id: q.id, prompt: q.prompt, options: q.options })),
      };
    },
    async getProject(courseId) {
      const row = check(await sb.from("projects").select("*").eq("course_id", courseId).limit(1).maybeSingle()) as Row | null;
      return row ? toProject(row) : null;
    },

    async listEnrollments() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      return (check(await sb.from("enrollments").select("*")) as Row[]).map((r) => ({
        courseId: r.course_id,
        enrolledAt: r.enrolled_at,
        completedAt: r.completed_at,
        lastLessonId: r.last_lesson_id,
      }));
    },
    async enroll(courseId) {
      const id = await requireUserId();
      check(await sb.from("enrollments").upsert({ user_id: id, course_id: courseId }, { onConflict: "user_id,course_id", ignoreDuplicates: true }));
    },
    async setLastLesson(courseId, lessonId) {
      const { data } = await sb.auth.getSession();
      const id = data.session?.user.id;
      if (!id) return;
      await sb.from("enrollments").update({ last_lesson_id: lessonId }).eq("user_id", id).eq("course_id", courseId);
    },
    async getProgress(courseId) {
      const { data } = await sb.auth.getSession();
      if (!data.session) return { completedLessons: [], completedExercises: [] };
      const [lessons, exercises] = await Promise.all([
        sb.from("lesson_progress").select("lesson_id").eq("course_id", courseId),
        sb.from("exercise_completions").select("exercise_id").eq("course_id", courseId),
      ]);
      return {
        completedLessons: (check(lessons) as Row[]).map((r) => r.lesson_id),
        completedExercises: (check(exercises) as Row[]).map((r) => r.exercise_id),
      };
    },
    async setLessonComplete(courseId, lessonId, done) {
      const id = await requireUserId();
      await backend.enroll(courseId);
      if (done)
        check(await sb.from("lesson_progress").upsert({ user_id: id, lesson_id: lessonId, course_id: courseId }, { onConflict: "user_id,lesson_id", ignoreDuplicates: true }));
      else check(await sb.from("lesson_progress").delete().eq("user_id", id).eq("lesson_id", lessonId));
    },
    async recordExercise(courseId, lessonId, exerciseId) {
      const id = await requireUserId();
      await backend.enroll(courseId);
      check(
        await sb
          .from("exercise_completions")
          .upsert({ user_id: id, exercise_id: exerciseId, lesson_id: lessonId, course_id: courseId }, { onConflict: "user_id,exercise_id", ignoreDuplicates: true }),
      );
    },
    async submitAssessment(assessmentId, answers) {
      return toAttempt(check(await sb.rpc("submit_assessment", { p_assessment_id: assessmentId, p_answers: answers })) as Row);
    },
    async listAttempts(assessmentId) {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      return (check(await sb.from("assessment_attempts").select("*").eq("assessment_id", assessmentId).order("submitted_at")) as Row[]).map(toAttempt);
    },
    async getSubmission(projectId) {
      const { data } = await sb.auth.getSession();
      if (!data.session) return null;
      const row = check(await sb.from("project_submissions").select("*").eq("project_id", projectId).maybeSingle()) as Row | null;
      return row ? toSubmission(row) : null;
    },
    async submitProject(projectId, { content, url }) {
      return toSubmission(check(await sb.rpc("submit_project", { p_project_id: projectId, p_content: content, p_url: url })) as Row);
    },

    async issueCertificate(courseId) {
      return toCertificate(check(await sb.rpc("issue_certificate", { p_course_id: courseId })) as Row);
    },
    async listMyCertificates() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      return (check(await sb.from("certificates").select("*").eq("user_id", data.session.user.id).order("issued_at", { ascending: false })) as Row[]).map(toCertificate);
    },
    async getMyCertificate(credentialId) {
      const { data } = await sb.auth.getSession();
      if (!data.session) return null;
      const row = check(await sb.from("certificates").select("*").eq("user_id", data.session.user.id).eq("credential_id", credentialId).maybeSingle()) as Row | null;
      return row ? toCertificate(row) : null;
    },
    async verifyCertificate(credentialId) {
      const rows = check(await sb.rpc("verify_certificate", { p_credential_id: credentialId })) as Row[];
      const r = rows?.[0];
      return r ? { credentialId: r.credential_id, recipientName: r.recipient_name, courseTitle: r.course_title, issuedAt: r.issued_at, status: r.status } : null;
    },

    admin: {
      async saveCourse(c) {
        check(
          await sb.from("courses").upsert({
            id: c.id,
            slug: c.slug,
            code: c.code,
            title: c.title,
            summary: c.summary,
            description: c.description,
            category_id: c.categoryId,
            difficulty: c.difficulty,
            level_label: c.levelLabel,
            estimated_hours: c.estimatedHours ?? null,
            is_free: c.isFree,
            status: c.status,
            published: c.published,
            position: c.position,
            skills: c.skills,
            prerequisites: c.prerequisites,
            project_title: c.projectTitle ?? null,
            certificate_enabled: c.certificate.enabled,
            require_all_lessons: c.certificate.requireAllLessons,
            require_exercises: c.certificate.requireExercises,
            require_project: c.certificate.requireProject,
            passing_score: c.certificate.passingScore,
          }),
        );
      },
      async saveModule(m) {
        check(await sb.from("course_modules").upsert({ id: m.id, course_id: m.courseId, title: m.title, position: m.position }));
      },
      async deleteModule(id) {
        check(await sb.from("course_modules").delete().eq("id", id));
      },
      async reorderModules(_courseId, ids) {
        for (const [i, id] of ids.entries()) check(await sb.from("course_modules").update({ position: i + 1 }).eq("id", id));
      },
      async saveLesson(l) {
        check(
          await sb.from("lessons").upsert({
            id: l.id,
            course_id: l.courseId,
            module_id: l.moduleId,
            slug: l.slug,
            title: l.title,
            summary: l.summary,
            minutes: l.minutes,
            body_md: l.body,
            required: l.required,
            published: l.published,
            position: l.position,
            required_exercises: requiredExerciseIds(l.body),
          }),
        );
      },
      async deleteLesson(id) {
        check(await sb.from("lessons").delete().eq("id", id));
      },
      async getAssessment(courseId) {
        const row = check(
          await sb.from("assessments").select("*, assessment_questions(*, assessment_answer_keys(*))").eq("course_id", courseId).maybeSingle(),
        ) as Row | null;
        if (!row) return null;
        const def: AssessmentDef = {
          id: row.id,
          courseId: row.course_id,
          title: row.title,
          passingScore: row.passing_score,
          questions: ((row.assessment_questions ?? []) as Row[])
            .sort((a, b) => a.position - b.position)
            .map((q) => {
              const key = Array.isArray(q.assessment_answer_keys) ? q.assessment_answer_keys[0] : q.assessment_answer_keys;
              return { id: q.id, prompt: q.prompt, options: q.options, answer: key?.correct_index ?? 0, explanation: key?.explanation ?? undefined };
            }),
        };
        return def;
      },
      async saveAssessment(a) {
        check(await sb.from("assessments").upsert({ id: a.id, course_id: a.courseId, title: a.title, passing_score: a.passingScore }));
        const existing = (check(await sb.from("assessment_questions").select("id").eq("assessment_id", a.id)) as Row[]).map((r) => r.id);
        const keep = new Set(a.questions.map((q) => q.id));
        const removed = existing.filter((id) => !keep.has(id));
        if (removed.length) check(await sb.from("assessment_questions").delete().in("id", removed));
        if (a.questions.length) {
          check(await sb.from("assessment_questions").upsert(a.questions.map((q, i) => ({ id: q.id, assessment_id: a.id, position: i + 1, prompt: q.prompt, options: q.options }))));
          check(await sb.from("assessment_answer_keys").upsert(a.questions.map((q) => ({ question_id: q.id, correct_index: q.answer, explanation: q.explanation ?? null }))));
        }
      },
      async listStudents() {
        return (check(await sb.rpc("admin_list_students")) as Row[]).map((r) => ({
          userId: r.user_id,
          fullName: r.full_name,
          email: r.email,
          joinedAt: r.joined_at,
          enrollments: Number(r.enrollments),
          completedCourses: Number(r.completed_courses),
          certificates: Number(r.certificates),
        }));
      },
      async getStudent(userId) {
        const summary = (await backend.admin.listStudents()).find((s) => s.userId === userId);
        if (!summary) return null;
        const [enrollments, progress, courses] = await Promise.all([
          sb.from("enrollments").select("*").eq("user_id", userId),
          sb.from("lesson_progress").select("course_id").eq("user_id", userId),
          backend.listCourses({ includeUnpublished: true }),
        ]);
        const done = (check(progress) as Row[]).reduce<Record<string, number>>((acc, r) => ((acc[r.course_id] = (acc[r.course_id] ?? 0) + 1), acc), {});
        return {
          summary,
          courses: (check(enrollments) as Row[]).map((e) => {
            const c = courses.find((x) => x.id === e.course_id);
            return {
              courseId: e.course_id,
              courseTitle: c?.title ?? e.course_id,
              enrolledAt: e.enrolled_at,
              completedLessons: done[e.course_id] ?? 0,
              totalLessons: c ? c.modules.flatMap((m) => m.lessons).filter((l) => l.published && l.required).length : 0,
              completedAt: e.completed_at,
            };
          }),
        };
      },
      async listCertificates(search) {
        let q = sb.from("certificates").select("*").order("issued_at", { ascending: false }).limit(200);
        const s = search?.trim().replace(/[%,()]/g, "");
        if (s) q = q.or(`credential_id.ilike.%${s}%,recipient_name.ilike.%${s}%`);
        return (check(await q) as Row[]).map(toCertificate);
      },
      async revokeCertificate(id, reason) {
        check(await sb.from("certificates").update({ status: "revoked", revoked_at: new Date().toISOString(), revoked_reason: reason }).eq("id", id));
      },
      async listSubmissions() {
        const [subs, profiles, projects] = await Promise.all([
          sb.from("project_submissions").select("*").order("submitted_at", { ascending: false }),
          sb.from("profiles").select("id, full_name"),
          sb.from("projects").select("id, title"),
        ]);
        const names = new Map((check(profiles) as Row[]).map((p) => [p.id, p.full_name]));
        const titles = new Map((check(projects) as Row[]).map((p) => [p.id, p.title]));
        return (check(subs) as Row[]).map((r) => ({ ...toSubmission(r), studentName: names.get(r.user_id) ?? "Unknown", projectTitle: titles.get(r.project_id) ?? r.project_id }));
      },
      async reviewSubmission(id, status, feedback) {
        check(await sb.from("project_submissions").update({ status, feedback, reviewed_at: new Date().toISOString() }).eq("id", id));
      },
    },
  };
  return backend;
}
