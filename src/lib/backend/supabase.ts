/**
 * Supabase backend. Tables, row-level security and the grading/certificate functions
 * are defined in supabase/migrations (certificate management in 0007_certificate_management.sql).
 */
import { createClient, type SupabaseClient, type User as SbUser } from "@supabase/supabase-js";
import type { AssessmentDef, Course, Lesson, Module, ProjectDef } from "@/content/types";
import { requiredExerciseIds } from "../lesson-format";
import { certificatePayload, matchesCertificate } from "../certificates";
import {
  BackendError,
  type AttemptResult,
  type Backend,
  type AcademyEvent,
  type AdminCertificate,
  type Certificate,
  type CertificateOrder,
  type CertificatePrice,
  type CommunitySettings,
  type EventInput,
  type EventRegistration,
  type Credential,
  type PracticeResult,
  type PracticeSubmission,
  type ProjectSubmission,
  type PublicCertificate,
  type PublicProfile,
  type Role,
  type User,
} from "./types";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** The message an Edge Function returned with its error, if any. */
async function functionError(error: unknown, fallback: string) {
  const ctx = (error as { context?: Response }).context;
  try {
    const body = ctx ? await ctx.clone().json() : null;
    if (body?.code === "currency_unsupported") return `currency_unsupported:${body.error}`;
    return body?.error ?? fallback;
  } catch {
    return fallback;
  }
}

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new BackendError(res.error.message);
  return res.data;
}

const toEvent = (r: Row, registered?: number): AcademyEvent => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  eventType: r.event_type,
  shortDescription: r.short_description ?? null,
  description: r.description ?? null,
  learnPoints: r.learn_points ?? [],
  coverImage: r.cover_image ?? null,
  startDatetime: r.start_datetime,
  endDatetime: r.end_datetime ?? null,
  timezone: r.timezone,
  venue: r.venue ?? null,
  format: r.format,
  meetingUrl: r.meeting_url ?? null,
  registrationUrl: r.registration_url ?? null,
  whatsappUrl: r.whatsapp_url ?? null,
  speakerName: r.speaker_name ?? null,
  speakerTitle: r.speaker_title ?? null,
  speakerImage: r.speaker_image ?? null,
  maxParticipants: r.max_participants ?? null,
  registrationRequired: r.registration_required,
  status: r.status,
  isFeatured: r.is_featured,
  series: r.series ?? null,
  registeredCount: Number(registered ?? r.registered_count ?? 0),
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toRegistration = (r: Row): EventRegistration => ({
  id: r.id,
  eventId: r.event_id,
  userId: r.user_id ?? null,
  fullName: r.full_name,
  email: r.email,
  phone: r.phone ?? null,
  registrationStatus: r.registration_status,
  attendanceStatus: r.attendance_status,
  registeredAt: r.registered_at,
  attendedAt: r.attended_at ?? null,
});

const toCommunity = (r: Row): CommunitySettings => ({
  name: r.name,
  description: r.description,
  whatsappUrl: r.whatsapp_invite_url ?? null,
  welcomeMessage: r.welcome_message,
  buttonText: r.button_text,
  isActive: !!r.is_active,
});

/** An event as the database columns, with empty text turned into null. */
const eventRow = (i: EventInput) => {
  const t = (v: string | null) => (v && v.trim() ? v.trim() : null);
  return {
    title: i.title.trim(),
    slug: i.slug,
    event_type: i.eventType,
    short_description: t(i.shortDescription),
    description: t(i.description),
    learn_points: i.learnPoints.map((x) => x.trim()).filter(Boolean),
    cover_image: t(i.coverImage),
    start_datetime: i.startDatetime,
    end_datetime: i.endDatetime || null,
    timezone: i.timezone,
    venue: t(i.venue),
    format: i.format,
    meeting_url: t(i.meetingUrl),
    registration_url: t(i.registrationUrl),
    whatsapp_url: t(i.whatsappUrl),
    speaker_name: t(i.speakerName),
    speaker_title: t(i.speakerTitle),
    speaker_image: t(i.speakerImage),
    max_participants: i.maxParticipants,
    registration_required: i.registrationRequired,
    status: i.status,
    is_featured: i.isFeatured,
    series: t(i.series),
  };
};

/** A friendlier message for the one database error an admin can cause by hand. */
const eventError = (e: { code?: string; message: string }) =>
  new BackendError(e.code === "23505" ? "Another event already uses that web address. Change the address and save again." : e.message);

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
  format: r.format ?? "full",
  completionBadge: r.completion_badge ?? undefined,
  slug: r.slug,
  code: r.code,
  title: r.title,
  summary: r.summary,
  description: r.description,
  categoryId: r.category_id,
  difficulty: r.difficulty,
  level: r.level ?? 1,
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
    requireModuleBadges: r.require_module_badges ?? false,
    passingScore: r.passing_score,
  },
  modules: ((r.course_modules ?? []) as Row[])
    .map(
      (m): Module => ({
        id: m.id,
        courseId: m.course_id,
        title: m.title,
        position: m.position,
        badge: m.badge_name ?? null,
        badgeCode: m.badge_code ?? null,
        skills: m.skills ?? [],
        lessons: ((m.lessons ?? []) as Row[]).map(toLesson).sort((a, b) => a.position - b.position),
      }),
    )
    .sort((a, b) => a.position - b.position),
});

const toCredential = (r: Row): Credential => ({
  id: r.id,
  credentialId: r.credential_id,
  userId: r.user_id,
  kind: r.kind,
  courseId: r.course_id ?? "",
  trackId: r.track_id ?? null,
  moduleId: r.module_id ?? null,
  projectId: r.project_id ?? null,
  badgeName: r.badge_name,
  courseTitle: r.course_title,
  moduleTitle: r.module_title ?? null,
  recipientName: r.recipient_name,
  skills: r.skills ?? [],
  issuedAt: r.issued_at,
  status: r.status,
  revokedReason: r.revoked_reason ?? null,
});

const toPracticeSubmission = (r: Row): PracticeSubmission => ({
  id: r.id,
  userId: r.user_id,
  projectId: r.project_id,
  workUrl: r.work_url,
  summary: r.summary,
  answers: r.answers ?? {},
  correct: r.correct,
  total: r.total,
  passed: r.passed,
  attempts: r.attempts,
  submittedAt: r.submitted_at,
  updatedAt: r.updated_at,
  reviewedAt: r.reviewed_at ?? null,
  reviewNote: r.review_note ?? null,
});

const toCertificate = (r: Row): Certificate => ({
  id: r.id,
  certificateId: r.certificate_id,
  source: r.source ?? "course",
  credentialId: r.credential_id ?? null,
  trackId: r.track_id ?? null,
  userId: r.user_id ?? null,
  courseId: r.course_id ?? null,
  recipientName: r.recipient_name,
  recipientEmail: r.recipient_email ?? null,
  certificateTitle: r.certificate_title ?? null,
  courseTitle: r.course_title,
  trainingType: r.training_type ?? "academy_course",
  certificateType: r.certificate_type ?? "completion",
  instructorName: r.instructor_name ?? null,
  description: r.description ?? null,
  startDate: r.start_date ?? null,
  completionDate: r.completion_date ?? null,
  issuedAt: r.issued_at,
  grade: r.grade ?? null,
  duration: r.duration ?? null,
  templateId: r.template_id ?? "classic",
  status: r.status,
  revokedAt: r.revoked_at ?? null,
  revokedReason: r.revoked_reason ?? null,
  replacedCertificateId: r.replaced_certificate_id ?? null,
  updatedAt: r.updated_at ?? r.issued_at,
});

const toAdminCertificate = (r: Row): AdminCertificate => ({ ...toCertificate(r.certificate), issuedBy: r.issued_by || null, replacedBy: r.replaced_by ?? null });

const toPublicCertificate = (r: Row): PublicCertificate => ({
  certificateId: r.certificate_id,
  credentialId: r.credential_id ?? null,
  recipientName: r.recipient_name,
  certificateTitle: r.certificate_title ?? null,
  courseTitle: r.course_title,
  trainingType: r.training_type,
  certificateType: r.certificate_type,
  instructorName: r.instructor_name ?? null,
  description: r.description ?? null,
  startDate: r.start_date ?? null,
  completionDate: r.completion_date ?? null,
  issuedAt: r.issued_at,
  grade: r.grade ?? null,
  duration: r.duration ?? null,
  templateId: r.template_id,
  status: r.status,
  revokedAt: r.revoked_at ?? null,
  replacedBy: r.replaced_by ?? null,
});

const toOrder = (r: Row): CertificateOrder => ({
  id: r.id,
  userId: r.user_id,
  courseId: r.course_id ?? null,
  trackId: r.track_id ?? null,
  credentialId: r.credential_id,
  currency: r.currency,
  amount: Number(r.amount),
  status: r.status,
  provider: r.provider ?? null,
  providerRef: r.provider_ref ?? null,
  note: r.note ?? null,
  createdAt: r.created_at,
  paidAt: r.paid_at ?? null,
});

const toPrice = (r: Row): CertificatePrice => ({ kind: r.kind ?? "course", currency: r.currency, amount: Number(r.amount), active: r.active, position: r.position });

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
  rubric: r.rubric ?? [],
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

    async getPublicProfileSettings() {
      const id = await requireUserId();
      const r = check(
        await sb.from("profiles").select("public_slug, profile_public, headline").eq("id", id).maybeSingle(),
      ) as Row | null;
      return { isPublic: Boolean(r?.profile_public), slug: r?.public_slug ?? "", headline: r?.headline ?? "" };
    },
    async savePublicProfileSettings({ isPublic, slug, headline }) {
      check(await sb.rpc("set_public_profile", { p_public: isPublic, p_slug: slug, p_headline: headline }));
    },
    async getPublicProfile(slug) {
      return (check(await sb.rpc("public_profile", { p_slug: slug })) as PublicProfile | null) ?? null;
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
    async getAssessment(courseId, moduleId) {
      let q = sb.from("assessments").select("*, assessment_questions(id, prompt, options, position)").eq("course_id", courseId);
      q = moduleId ? q.eq("kind", "module").eq("module_id", moduleId) : q.eq("kind", "final");
      const row = check(await q.maybeSingle()) as Row | null;
      if (!row) return null;
      return {
        id: row.id,
        courseId: row.course_id,
        kind: row.kind,
        moduleId: row.module_id ?? null,
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
      // Always filter to the signed-in user: row-level security also lets admins read everyone's rows.
      return (check(await sb.from("enrollments").select("*").eq("user_id", data.session.user.id)) as Row[]).map((r) => ({
        courseId: r.course_id,
        enrolledAt: r.enrolled_at,
        completedAt: r.completed_at,
        lastLessonId: r.last_lesson_id,
        lastActiveAt: r.last_active_at ?? r.enrolled_at,
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
    async removeCourse(courseId) {
      await requireUserId();
      check(await sb.rpc("remove_course", { p_course_id: courseId }));
    },
    async applyInactivityResets() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      const rows = check(await sb.rpc("apply_inactivity_resets")) as unknown;
      return Array.isArray(rows) ? rows.map((r) => (typeof r === "string" ? r : String(Object.values(r as Row)[0]))) : [];
    },
    async getProgress(courseId) {
      const { data } = await sb.auth.getSession();
      if (!data.session) return { completedLessons: [], completedExercises: [] };
      const [lessons, exercises] = await Promise.all([
        sb.from("lesson_progress").select("lesson_id").eq("user_id", data.session.user.id).eq("course_id", courseId),
        sb.from("exercise_completions").select("exercise_id").eq("user_id", data.session.user.id).eq("course_id", courseId),
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
      return (check(await sb.from("assessment_attempts").select("*").eq("user_id", data.session.user.id).eq("assessment_id", assessmentId).order("submitted_at")) as Row[]).map(toAttempt);
    },
    async getSubmission(projectId) {
      const { data } = await sb.auth.getSession();
      if (!data.session) return null;
      const row = check(await sb.from("project_submissions").select("*").eq("user_id", data.session.user.id).eq("project_id", projectId).maybeSingle()) as Row | null;
      return row ? toSubmission(row) : null;
    },
    async submitProject(projectId, { content, url }) {
      return toSubmission(check(await sb.rpc("submit_project", { p_project_id: projectId, p_content: content, p_url: url })) as Row);
    },

    async claimModuleBadge(moduleId) {
      return toCredential(check(await sb.rpc("claim_module_badge", { p_module_id: moduleId })) as Row);
    },
    async issueCourseCredential(courseId) {
      return toCredential(check(await sb.rpc("issue_course_credential", { p_course_id: courseId })) as Row);
    },
    async issueTrackCredential(trackId) {
      return toCredential(check(await sb.rpc("issue_track_credential", { p_track_id: trackId })) as Row);
    },
    async listMyCredentials() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      const creds = (check(await sb.from("credentials").select("*").eq("user_id", data.session.user.id).order("issued_at", { ascending: false })) as Row[]).map(
        toCredential,
      );
      // Project badges show the learner's work and whether it was reviewed.
      if (!creds.some((c) => c.kind === "project_badge")) return creds;
      const subs = await backend.listMyPracticeSubmissions();
      return creds.map((c) => {
        const s = c.kind === "project_badge" ? subs.find((x) => x.projectId === c.projectId) : undefined;
        return s ? { ...c, workUrl: s.workUrl, reviewed: !!s.reviewedAt } : c;
      });
    },
    async verifyCredential(credentialId) {
      const r = (check(await sb.rpc("verify_credential", { p_credential_id: credentialId })) as Row[])?.[0];
      return r
        ? {
            credentialId: r.credential_id,
            kind: r.kind,
            badgeName: r.badge_name,
            courseId: r.course_id ?? "",
            trackId: r.track_id ?? null,
            courseTitle: r.course_title,
            moduleTitle: r.module_title ?? null,
            recipientName: r.recipient_name,
            skills: r.skills ?? [],
            issuedAt: r.issued_at,
            status: r.status,
            projectId: r.project_id ?? null,
            workUrl: r.work_url ?? null,
            reviewed: !!r.reviewed,
          }
        : null;
    },

    async getPracticeSubmission(projectId) {
      const { data } = await sb.auth.getSession();
      if (!data.session) return null;
      const r = check(await sb.from("practice_submissions").select("*").eq("user_id", data.session.user.id).eq("project_id", projectId).maybeSingle()) as Row | null;
      return r ? toPracticeSubmission(r) : null;
    },
    async listMyPracticeSubmissions() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      return (check(await sb.from("practice_submissions").select("*").eq("user_id", data.session.user.id).order("updated_at", { ascending: false })) as Row[]).map(
        toPracticeSubmission,
      );
    },
    async submitPracticeProject({ projectId, workUrl, summary, answers }) {
      const r = check(await sb.rpc("submit_practice_project", { p_project_id: projectId, p_work_url: workUrl, p_summary: summary, p_answers: answers })) as Row;
      return { passed: r.passed, correct: r.correct, total: r.total, results: r.results ?? {}, credentialId: r.credentialId ?? null } satisfies PracticeResult;
    },

    // Card payment through Paystack, via the certificate-checkout and certificate-verify Edge Functions.
    paymentsEnabled: true,
    async startCheckout(orderId, returnUrl) {
      const { data, error } = await sb.functions.invoke("certificate-checkout", { body: { orderId, returnUrl } });
      if (error) throw new BackendError(await functionError(error, "Couldn't start the payment."));
      return (data as { url: string }).url;
    },
    async confirmPayment(reference) {
      const { data, error } = await sb.functions.invoke("certificate-verify", { body: { reference } });
      if (error) throw new BackendError(await functionError(error, "Couldn't confirm the payment."));
      return toCertificate((data as { certificate: Row }).certificate);
    },
    async listCertificatePrices(kind = "course") {
      return (check(await sb.from("certificate_prices").select("*").eq("kind", kind).eq("active", true).order("position")) as Row[]).map(toPrice);
    },
    async startProgrammeOrder(trackId, currency) {
      return toOrder(check(await sb.rpc("start_programme_order", { p_track_id: trackId, p_currency: currency })) as Row);
    },
    async startCertificateOrder(courseId, currency) {
      return toOrder(check(await sb.rpc("start_certificate_order", { p_course_id: courseId, p_currency: currency })) as Row);
    },
    async listMyOrders() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      return (check(await sb.from("certificate_orders").select("*").eq("user_id", data.session.user.id).order("created_at", { ascending: false })) as Row[]).map(toOrder);
    },
    async listMyCertificates() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      return (check(await sb.from("certificates").select("*").eq("user_id", data.session.user.id).order("issued_at", { ascending: false })) as Row[]).map(toCertificate);
    },
    async getMyCertificate(certificateId) {
      const { data } = await sb.auth.getSession();
      if (!data.session) return null;
      const row = check(await sb.from("certificates").select("*").eq("user_id", data.session.user.id).eq("certificate_id", certificateId).maybeSingle()) as Row | null;
      return row ? toCertificate(row) : null;
    },
    async verifyCertificate(certificateId) {
      const r = (check(await sb.rpc("verify_certificate", { p_certificate_id: certificateId })) as Row[])?.[0];
      return r ? toPublicCertificate(r) : null;
    },
    async recordCertificateDownload(certificateId) {
      check(await sb.rpc("record_certificate_download", { p_certificate_id: certificateId }));
    },

    /* ---------- community and events ---------- */
    async getCommunity() {
      const r = (check(await sb.rpc("get_community")) as Row[])?.[0];
      return r ? { name: r.name, description: r.description, whatsappUrl: r.whatsapp_invite_url, welcomeMessage: r.welcome_message, buttonText: r.button_text } : null;
    },
    async trackCommunityClick(source) {
      // Counting must never get in the way of the button.
      await sb.rpc("track_community_click", { p_source: source }).then(
        () => undefined,
        () => undefined,
      );
    },
    async listEvents() {
      return (check(await sb.rpc("list_public_events")) as Row[]).map((r) => toEvent(r));
    },
    async getEvent(slug) {
      return (await backend.listEvents()).find((e) => e.slug === slug) ?? null;
    },
    async registerForEvent(eventId, input) {
      return toRegistration(
        check(await sb.rpc("register_for_event", { p_event_id: eventId, p_full_name: input.fullName, p_email: input.email, p_phone: input.phone })) as Row,
      );
    },
    async revealEventLink(eventId, email) {
      return (check(await sb.rpc("reveal_event_link", { p_event_id: eventId, p_email: email ?? null })) as string | null) ?? null;
    },
    async listMyRegistrations() {
      const { data } = await sb.auth.getSession();
      if (!data.session) return [];
      return (check(await sb.from("academy_event_registrations").select("*").eq("user_id", data.session.user.id).eq("registration_status", "registered")) as Row[]).map(toRegistration);
    },
    async cancelMyRegistration(eventId) {
      check(await sb.rpc("cancel_my_registration", { p_event_id: eventId }));
    },

    admin: {
      async getCommunitySettings() {
        return toCommunity(check(await sb.from("academy_community_settings").select("*").eq("id", 1).single()) as Row);
      },
      async saveCommunitySettings(c) {
        const res = await sb
          .from("academy_community_settings")
          .update({ name: c.name.trim(), description: c.description.trim(), whatsapp_invite_url: c.whatsappUrl?.trim() || null, welcome_message: c.welcomeMessage.trim(), button_text: c.buttonText.trim() || "Join Community", is_active: c.isActive })
          .eq("id", 1);
        if (res.error) throw new BackendError(res.error.message.includes("community_needs_link") ? "Add the WhatsApp invite link before switching the community on." : res.error.message);
      },
      async communityStats() {
        const [stats, sources] = await Promise.all([sb.rpc("admin_community_stats"), sb.rpc("admin_community_click_sources")]);
        const r = (check(stats) as Row[])[0] ?? {};
        return {
          clicksTotal: Number(r.clicks_total ?? 0),
          clicks30d: Number(r.clicks_30d ?? 0),
          upcomingEvents: Number(r.upcoming_events ?? 0),
          registrationsTotal: Number(r.registrations_total ?? 0),
          registrationsUpcoming: Number(r.registrations_upcoming ?? 0),
          clickSources: (check(sources) as Row[]).map((x) => ({ source: x.source, clicks: Number(x.clicks) })),
        };
      },
      async recentRegistrations(limit = 8) {
        const [regs, events] = await Promise.all([
          sb.from("academy_event_registrations").select("*").order("registered_at", { ascending: false }).limit(limit),
          sb.from("academy_events").select("id, title"),
        ]);
        const titles = new Map((check(events) as Row[]).map((e) => [e.id, e.title]));
        return (check(regs) as Row[]).map((r) => ({ ...toRegistration(r), eventTitle: titles.get(r.event_id) ?? "Deleted event" }));
      },
      async listAllEvents() {
        const [events, regs] = await Promise.all([
          sb.from("academy_events").select("*").order("start_datetime", { ascending: true }),
          sb.from("academy_event_registrations").select("event_id").eq("registration_status", "registered"),
        ]);
        const counts = new Map<string, number>();
        for (const r of check(regs) as Row[]) counts.set(r.event_id, (counts.get(r.event_id) ?? 0) + 1);
        return (check(events) as Row[]).map((r) => toEvent(r, counts.get(r.id) ?? 0));
      },
      async getEventById(id) {
        return (await backend.admin.listAllEvents()).find((e) => e.id === id) ?? null;
      },
      async saveEvent(input) {
        const row = eventRow(input);
        const res = input.id ? await sb.from("academy_events").update(row).eq("id", input.id).select("*").single() : await sb.from("academy_events").insert(row).select("*").single();
        if (res.error) throw eventError(res.error);
        return toEvent(res.data as Row);
      },
      async setEventStatus(id, status) {
        check(await sb.from("academy_events").update({ status }).eq("id", id));
      },
      async duplicateEvent(id) {
        const src = await backend.admin.getEventById(id);
        if (!src) throw new BackendError("Event not found.");
        const taken = new Set((await backend.admin.listAllEvents()).map((e) => e.slug));
        let slug = `${src.slug}-copy`.slice(0, 95);
        for (let n = 2; taken.has(slug); n++) slug = `${src.slug}-copy-${n}`.slice(0, 95);
        const { id: _id, registeredCount: _rc, createdAt: _c, updatedAt: _u, ...rest } = src;
        void _id; void _rc; void _c; void _u;
        return backend.admin.saveEvent({ ...rest, title: `${src.title} (copy)`, slug, status: "draft", isFeatured: false });
      },
      async deleteEvent(id) {
        check(await sb.from("academy_events").delete().eq("id", id));
      },
      async listRegistrations(eventId) {
        return (check(await sb.from("academy_event_registrations").select("*").eq("event_id", eventId).order("registered_at", { ascending: false })) as Row[]).map(toRegistration);
      },
      async setAttendance(registrationId, status) {
        check(await sb.rpc("admin_set_attendance", { p_registration_id: registrationId, p_status: status }));
      },
      async uploadEventImage(file) {
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new BackendError("Use a PNG, JPEG or WebP image.");
        if (file.size > 2 * 1024 * 1024) throw new BackendError("That image is over 2 MB. Choose a smaller one.");
        const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
        const up = await sb.storage.from("event-images").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
        if (up.error) throw new BackendError(up.error.message);
        return sb.storage.from("event-images").getPublicUrl(path).data.publicUrl;
      },
      async saveCourse(c) {
        check(
          await sb.from("courses").upsert({
            id: c.id,
            format: c.format ?? "full",
            completion_badge: c.completionBadge ?? null,
            slug: c.slug,
            code: c.code,
            title: c.title,
            summary: c.summary,
            description: c.description,
            category_id: c.categoryId,
            difficulty: c.difficulty,
            level: c.level,
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
            require_module_badges: c.certificate.requireModuleBadges,
            passing_score: c.certificate.passingScore,
          }),
        );
      },
      async saveModule(m) {
        check(
          await sb.from("course_modules").upsert({
            id: m.id,
            course_id: m.courseId,
            title: m.title,
            position: m.position,
            badge_name: m.badge || null,
            badge_code: m.badgeCode || null,
            skills: m.skills,
          }),
        );
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
      async getAssessment(courseId, moduleId) {
        let q = sb.from("assessments").select("*, assessment_questions(*, assessment_answer_keys(*))").eq("course_id", courseId);
        q = moduleId ? q.eq("kind", "module").eq("module_id", moduleId) : q.eq("kind", "final");
        const row = check(await q.maybeSingle()) as Row | null;
        if (!row) return null;
        const def: AssessmentDef = {
          id: row.id,
          courseId: row.course_id,
          kind: row.kind,
          moduleId: row.module_id ?? undefined,
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
        check(
          await sb
            .from("assessments")
            .upsert({ id: a.id, course_id: a.courseId, kind: a.kind ?? "final", module_id: a.moduleId ?? null, title: a.title, passing_score: a.passingScore }),
        );
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
          lessonsCompleted: Number(r.lessons_completed),
          badges: Number(r.badges),
          lastActiveAt: r.last_active_at ?? null,
        }));
      },
      async getStudent(userId) {
        const summary = (await backend.admin.listStudents()).find((s) => s.userId === userId);
        if (!summary) return null;
        const [enrollments, progress, courses, creds] = await Promise.all([
          sb.from("enrollments").select("*").eq("user_id", userId),
          sb.from("lesson_progress").select("course_id").eq("user_id", userId),
          backend.listCourses({ includeUnpublished: true }),
          sb.from("credentials").select("*").eq("user_id", userId).order("issued_at", { ascending: false }),
        ]);
        const done = (check(progress) as Row[]).reduce<Record<string, number>>((acc, r) => ((acc[r.course_id] = (acc[r.course_id] ?? 0) + 1), acc), {});
        return {
          summary,
          credentials: (check(creds) as Row[]).map(toCredential),
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
      async listCredentials(search) {
        let q = sb.from("credentials").select("*").order("issued_at", { ascending: false }).limit(300);
        const t = search?.trim().replace(/[%,()]/g, "");
        if (t) q = q.or(`credential_id.ilike.%${t}%,recipient_name.ilike.%${t}%,badge_name.ilike.%${t}%`);
        return (check(await q) as Row[]).map(toCredential);
      },
      async deleteCredential(credentialId, reason) {
        check(await sb.rpc("admin_delete_credential", { p_credential_id: credentialId, p_reason: reason }));
      },
      async revokeCredential(id, reason) {
        check(await sb.from("credentials").update({ status: "revoked", revoked_at: new Date().toISOString(), revoked_reason: reason }).eq("id", id));
      },
      async listCertificates(search) {
        return (check(await sb.rpc("admin_list_certificates")) as Row[]).map(toAdminCertificate).filter((c) => matchesCertificate(c, search));
      },
      async getCertificate(certificateId) {
        const id = certificateId.trim().toUpperCase();
        return (await backend.admin.listCertificates()).find((c) => c.certificateId === id) ?? null;
      },
      async issueCertificate(input) {
        return toCertificate(check(await sb.rpc("admin_issue_certificate", { p: certificatePayload(input) })) as Row);
      },
      async updateCertificate(certificateId, edit) {
        const p = { recipientEmail: edit.recipientEmail, userId: edit.userId, courseId: edit.courseId, templateId: edit.templateId };
        return toCertificate(check(await sb.rpc("admin_update_certificate", { p_certificate_id: certificateId, p })) as Row);
      },
      async reissueCertificate(certificateId, input, reason) {
        return toCertificate(check(await sb.rpc("admin_reissue_certificate", { p_certificate_id: certificateId, p: certificatePayload(input), p_reason: reason })) as Row);
      },
      async deleteCertificate(certificateId, reason) {
        check(await sb.rpc("admin_delete_certificate", { p_certificate_id: certificateId, p_reason: reason }));
      },
      async revokeCertificate(certificateId, reason) {
        check(await sb.rpc("admin_revoke_certificate", { p_certificate_id: certificateId, p_reason: reason }));
      },
      async listCertificateEvents(certificateId) {
        let q = sb.from("certificate_events").select("*").order("created_at", { ascending: false }).limit(500);
        if (certificateId) q = q.eq("certificate_id", certificateId.trim().toUpperCase());
        return (check(await q) as Row[]).map((r) => ({
          id: r.id,
          certificateId: r.certificate_id,
          action: r.action,
          actorName: r.actor_name,
          details: r.details ?? {},
          createdAt: r.created_at,
        }));
      },
      async listCertificateTemplates() {
        return (check(await sb.from("certificate_templates").select("*").order("position")) as Row[]).map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          active: r.active,
        }));
      },
      async listOrders() {
        const [orders, profiles, courses, tracks, certs] = await Promise.all([
          sb.from("certificate_orders").select("*").order("created_at", { ascending: false }).limit(300),
          sb.from("profiles").select("id, full_name, email"),
          sb.from("courses").select("id, title"),
          sb.from("tracks").select("id, title, programme_title"),
          sb.from("certificates").select("user_id, course_id, track_id, certificate_id, status").eq("status", "valid").in("source", ["course", "programme"]),
        ]);
        const people = new Map((check(profiles) as Row[]).map((p) => [p.id, p]));
        const titles = new Map((check(courses) as Row[]).map((c) => [c.id, c.title]));
        const programmes = new Map((check(tracks) as Row[]).map((t) => [t.id, `Professional Programme: ${t.programme_title ?? t.title}`]));
        const issued = check(certs) as Row[];
        return (check(orders) as Row[]).map((r) => ({
          ...toOrder(r),
          learnerName: people.get(r.user_id)?.full_name ?? "Unknown",
          learnerEmail: people.get(r.user_id)?.email ?? "",
          courseTitle: r.track_id ? (programmes.get(r.track_id) ?? r.track_id) : (titles.get(r.course_id) ?? r.course_id),
          certificateId: issued.find((c) => c.user_id === r.user_id && (r.track_id ? c.track_id === r.track_id : c.course_id === r.course_id))?.certificate_id ?? null,
        }));
      },
      async listPracticeSubmissions() {
        const [subs, profiles, projects, creds] = await Promise.all([
          sb.from("practice_submissions").select("*").order("updated_at", { ascending: false }).limit(500),
          sb.from("profiles").select("id, full_name, email"),
          sb.from("practice_projects").select("id, title"),
          sb.from("credentials").select("user_id, project_id, credential_id").eq("kind", "project_badge").eq("status", "valid"),
        ]);
        const people = new Map((check(profiles) as Row[]).map((p) => [p.id, p]));
        const titles = new Map((check(projects) as Row[]).map((p) => [p.id, p.title]));
        const badges = check(creds) as Row[];
        return (check(subs) as Row[]).map((r) => ({
          ...toPracticeSubmission(r),
          learnerName: people.get(r.user_id)?.full_name || "Unknown",
          learnerEmail: people.get(r.user_id)?.email ?? "",
          projectTitle: titles.get(r.project_id) ?? r.project_id,
          credentialId: badges.find((b) => b.user_id === r.user_id && b.project_id === r.project_id)?.credential_id ?? null,
        }));
      },
      async reviewPracticeSubmission(id, reviewed, note) {
        check(await sb.rpc("admin_review_practice_submission", { p_id: id, p_reviewed: reviewed, p_note: note }));
      },
      async grantCertificate(orderId, note) {
        return toCertificate(check(await sb.rpc("admin_grant_certificate", { p_order_id: orderId, p_note: note })) as Row);
      },
      async listPrices() {
        return (check(await sb.from("certificate_prices").select("*").order("kind").order("position")) as Row[]).map(toPrice);
      },
      async savePrice(price) {
        check(await sb.from("certificate_prices").upsert({ kind: price.kind, currency: price.currency.toUpperCase(), amount: price.amount, active: price.active, position: price.position }, { onConflict: "kind,currency" }));
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
