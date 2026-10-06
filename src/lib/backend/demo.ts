/**
 * Demo backend: everything is stored in this browser's localStorage.
 * Used when Supabase isn't configured, so the whole learning journey can be tried
 * locally. Accounts here are not real accounts, and credentials and certificates can only be
 * verified in the same browser; the UI says so wherever it matters. Payment is simulated.
 */
import { BUNDLED_ASSESSMENTS, BUNDLED_COURSES, BUNDLED_PROJECTS } from "@/content";
import type { AssessmentDef, Course } from "@/content/types";
import { requiredExerciseIds } from "../lesson-format";
import { certificateNumber, eligibility, matchesCertificate, moduleTaskIds, newCredentialId } from "../certificates";
import { isStale } from "../inactivity";
import { enrolmentState as enrolmentOf, isPaid, programmeCourseIds, salesOf, withSales } from "../commerce";
import type { CourseSalesFields } from "@/content/catalog";
import { programmeCertificateAvailable, requiredCourses, TRACKS } from "@/content/tracks";
import { PROFILE_SLUG_RE, SLUG_HELP } from "../profile";
import { PRACTICE_PROJECTS } from "@/content/projects";
import { PROJECT_ANSWERS } from "@/content/project-answers";
import { SUMMARY_MAX, SUMMARY_MIN, gradeCheck, gradingKey, isWorkUrl } from "../project-grading";
import {
  BackendError,
  type AttemptResult,
  type Backend,
  type AcademyEvent,
  type AttendanceStatus,
  type CommunitySettings,
  type CommunitySource,
  type EventInput,
  type EventRegistration,
  type EventStatus,
  type AdminCertificate,
  type AdminCourseOrder,
  type AdminEnrollment,
  type Certificate,
  type CourseOrder,
  type CourseStats,
  type PaymentAccount,
  type PaymentSettings,
  type OrderPayment,
  type AdminPayment,
  type ProgrammeStats,
  type AdminProgrammeEnrollment,
  type CertificateEvent,
  type CertificateEventAction,
  type CertificateInput,
  type CertificateOrder,
  type CertificateTemplate,
  type PublicCertificate,
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
  courseOrders: (CourseOrder & { userId: string; provider: string | null; providerRef: string | null; note: string | null })[];
  /** Programmes learners hold, and what admins changed about each programme's sales settings. */
  programmes: { userId: string; trackId: string; source: "purchase" | "granted"; enrolledAt: string }[];
  orderPayments: (OrderPayment & { userId: string; proofName?: string | null })[];
  paymentAccounts: PaymentAccount[] | null;
  paymentSettings: PaymentSettings | null;
  programmeSales: Record<string, CourseSalesFields> | null;
  certificates: Certificate[];
  certificateSeq: number;
  certificateEvents: CertificateEvent[];
  community: CommunitySettings;
  communityClicks: { source: CommunitySource | "other"; userId: string | null; at: string }[];
  events: Omit<AcademyEvent, "registeredCount">[];
  registrations: EventRegistration[];
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
  { kind: "course", currency: "NGN", amount: 3000, active: true, position: 1 },
  { kind: "course", currency: "USD", amount: 7, active: true, position: 2 },
  { kind: "programme", currency: "NGN", amount: 15000, active: true, position: 1 },
  { kind: "programme", currency: "USD", amount: 30, active: true, position: 2 },
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
  courseOrders: [],
  programmes: [],
  orderPayments: [],
  paymentAccounts: null,
  paymentSettings: null,
  programmeSales: null,
  certificates: [],
  certificateSeq: 0,
  certificateEvents: [],
  community: {
    name: "CloudTech Academy Community",
    description: "Connect with other learners, share your progress, ask questions, discover opportunities and participate in Academy activities.",
    whatsappUrl: null,
    welcomeMessage: "Connect with other learners, ask questions, share what you're building and hear about Academy sessions and opportunities.",
    buttonText: "Join Community",
    isActive: false,
  },
  communityClicks: [],
  events: [],
  registrations: [],
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

/** Prices saved by an older demo version had no kind and were all course prices; programme prices are added if missing. */
const prices = (s = load()): CertificatePrice[] => {
  const saved = (s.prices ?? DEFAULT_PRICES).map((p) => ({ ...p, kind: p.kind ?? "course" }));
  return saved.some((p) => p.kind === "programme") ? saved : [...saved, ...DEFAULT_PRICES.filter((p) => p.kind === "programme")];
};

function recipientName(u: User) {
  if (!u.fullName.trim()) throw new BackendError("Add your full name to your profile first. It appears on your badges and certificate.");
  return u.fullName.trim();
}

/** Adds a credential to the store (the caller saves). */
function newCredential(
  s: Store,
  u: User,
  f: Pick<Credential, "kind" | "courseId" | "moduleId" | "badgeName" | "courseTitle" | "moduleTitle" | "skills" | "projectId"> & { code: string; trackId?: string | null },
): Credential {
  let credentialId = newCredentialId(f.code);
  while (s.credentials.some((c) => c.credentialId === credentialId)) credentialId = newCredentialId(f.code);
  const { code: _code, ...fields } = f;
  void _code;
  const cred: Credential = { id: uid(), credentialId, userId: u.id, recipientName: recipientName(u), issuedAt: now(), status: "valid", revokedReason: null, ...fields, trackId: fields.trackId ?? null };
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
  const { credentialId, kind, badgeName, courseId, trackId, courseTitle, moduleTitle, recipientName, skills, issuedAt, status } = c;
  const w = withWork(s, c);
  return { credentialId, kind, badgeName, courseId, trackId: trackId ?? null, courseTitle, moduleTitle, recipientName, skills, issuedAt, status, projectId: c.projectId ?? null, workUrl: w.workUrl ?? null, reviewed: !!w.reviewed };
}

/** Issues the certificate for a paid or granted order (the caller saves). */
function issueCertificate(s: Store, order: CertificateOrder): Certificate {
  if (order.trackId) {
    const track = TRACKS.find((t) => t.id === order.trackId)!;
    const had = s.certificates.find((c) => c.userId === order.userId && c.trackId === order.trackId && c.status === "valid" && c.source === "programme");
    if (had) return had;
    const cred = s.credentials.find((c) => c.credentialId === order.credentialId)!;
    s.certificateSeq += 1;
    const programme: Certificate = {
      ...blankCertificate(),
      certificateId: certificateNumber(s.certificateSeq),
      source: "programme",
      credentialId: cred.credentialId,
      trackId: track.id,
      userId: order.userId,
      recipientName: cred.recipientName,
      courseTitle: track.title,
      certificateTitle: track.programmeTitle ?? track.title,
      trainingType: "academy_programme",
      certificateType: "professional_programme",
      description: track.skills.join(", ").slice(0, 600),
      completionDate: cred.issuedAt.slice(0, 10),
      templateId: "signature",
    };
    s.certificates.push(programme);
    logEvent(s, programme.certificateId, "issued", null, { order: order.id, payment: order.status, programme: track.id });
    return programme;
  }
  const existing = s.certificates.find((c) => c.userId === order.userId && c.courseId === order.courseId && c.status === "valid" && c.source === "course");
  if (existing) return existing;
  const cred = s.credentials.find((c) => c.credentialId === order.credentialId)!;
  s.certificateSeq += 1;
  const cert: Certificate = {
    ...blankCertificate(),
    certificateId: certificateNumber(s.certificateSeq),
    source: "course",
    credentialId: cred.credentialId,
    userId: order.userId,
    courseId: order.courseId,
    recipientName: cred.recipientName,
    courseTitle: cred.courseTitle,
    certificateTitle: "Certificate of Completion",
    completionDate: cred.issuedAt.slice(0, 10),
  };
  s.certificates.push(cert);
  logEvent(s, cert.certificateId, "issued", null, { order: order.id, payment: order.status });
  return cert;
}

const DEMO_TEMPLATES: CertificateTemplate[] = [
  { id: "signature", name: "CloudTech Signature", description: "Dark brand panel, gold seal and QR code. For professional training, bootcamps and workshops.", active: true },
  { id: "classic", name: "CloudTech Classic", description: "The original Academy course certificate: cream and gold, centred.", active: true },
];

function blankCertificate(): Certificate {
  const t = now();
  return {
    id: uid(),
    certificateId: "",
    source: "manual",
    credentialId: null,
    trackId: null,
    userId: null,
    courseId: null,
    recipientName: "",
    recipientEmail: null,
    certificateTitle: null,
    courseTitle: "",
    trainingType: "academy_course",
    certificateType: "completion",
    instructorName: null,
    description: null,
    startDate: null,
    completionDate: null,
    issuedAt: t,
    grade: null,
    duration: null,
    templateId: "classic",
    status: "valid",
    revokedAt: null,
    revokedReason: null,
    replacedCertificateId: null,
    updatedAt: t,
  };
}

/** Certificates saved by an older demo version lack the newer fields. */
const normalise = (c: Certificate): Certificate => ({ ...blankCertificate(), ...c, source: c.source ?? "course" });

function logEvent(s: Store, certificateId: string, action: CertificateEventAction, actor: User | null, details: Record<string, unknown> = {}) {
  s.certificateEvents.push({
    id: s.certificateEvents.length + 1,
    certificateId,
    action,
    actorName: actor ? actor.fullName.trim() || actor.email : "System",
    details,
    createdAt: now(),
  });
}

const blank = (v: string) => v.trim() || null;

const WHATSAPP_RE = /^https:\/\/(chat\.whatsapp\.com|wa\.me|whatsapp\.com|www\.whatsapp\.com)\/\S+$/i;
const THREE_HOURS = 3 * 3_600_000;
const eventEndMs = (e: Pick<AcademyEvent, "startDatetime" | "endDatetime">) => (e.endDatetime ? new Date(e.endDatetime).getTime() : new Date(e.startDatetime).getTime() + THREE_HOURS);

/** An event with how many people are registered. */
const withCount = (s: Store, e: Omit<AcademyEvent, "registeredCount">): AcademyEvent => ({
  ...e,
  registeredCount: s.registrations.filter((r) => r.eventId === e.id && r.registrationStatus === "registered").length,
});

/** The same checks the database makes on an event. */
function checkEvent(s: Store, i: EventInput) {
  if (i.title.trim().length < 3) throw new BackendError("Give the event a title (at least 3 characters).");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(i.slug)) throw new BackendError("Use lowercase letters, numbers and hyphens only for the web address.");
  if (s.events.some((e) => e.slug === i.slug && e.id !== i.id)) throw new BackendError("Another event already uses that web address. Change the address and save again.");
  if (!i.startDatetime) throw new BackendError("Choose the date and start time.");
  if (i.endDatetime && i.endDatetime <= i.startDatetime) throw new BackendError("The end time must be after the start time.");
  for (const u of [i.meetingUrl, i.registrationUrl]) if (u && !/^https?:\/\/\S+$/i.test(u)) throw new BackendError("Links must start with https://");
  if (i.whatsappUrl && !WHATSAPP_RE.test(i.whatsappUrl)) throw new BackendError("Use a WhatsApp link, such as https://chat.whatsapp.com/…");
  if (i.maxParticipants !== null && i.maxParticipants < 1) throw new BackendError("Maximum participants must be at least 1.");
}

/** The same checks the database makes. Returns the certificate's printed and linked fields. */
function certificateFields(s: Store, i: CertificateInput): Partial<Certificate> {
  const name = i.recipientName.trim();
  if (name.length < 2) throw new BackendError("Enter the recipient's full name.");
  if (!i.certificateTitle.trim()) throw new BackendError("Enter the certificate title.");
  if (!i.programmeName.trim()) throw new BackendError("Enter the course or programme name.");
  const email = i.recipientEmail.trim().toLowerCase();
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new BackendError("That email address doesn't look right.");
  if (!i.completionDate) throw new BackendError("Enter the training completion date.");
  if (i.startDate && i.startDate > i.completionDate) throw new BackendError("The start date must be on or before the completion date.");
  const issue = i.issueDate || new Date().toISOString().slice(0, 10);
  if (issue < i.completionDate) throw new BackendError("The issue date can't be before the completion date.");
  if (!DEMO_TEMPLATES.some((t) => t.id === i.templateId)) throw new BackendError("Choose a certificate template.");
  if (i.userId && !s.users.some((u) => u.id === i.userId)) throw new BackendError("That Academy account wasn't found.");
  return {
    recipientName: name,
    recipientEmail: email || null,
    userId: i.userId || null,
    courseId: i.courseId || null,
    certificateTitle: i.certificateTitle.trim(),
    courseTitle: i.programmeName.trim(),
    trainingType: i.trainingType,
    certificateType: i.certificateType,
    instructorName: blank(i.instructorName),
    description: blank(i.description),
    startDate: i.startDate || null,
    completionDate: i.completionDate,
    issuedAt: `${issue}T12:00:00.000Z`,
    grade: blank(i.grade),
    duration: blank(i.duration),
    templateId: i.templateId,
  };
}

function publicCertificate(s: Store, c: Certificate): PublicCertificate {
  const n = normalise(c);
  return {
    certificateId: n.certificateId,
    credentialId: n.credentialId,
    recipientName: n.recipientName,
    certificateTitle: n.certificateTitle,
    courseTitle: n.courseTitle,
    trainingType: n.trainingType,
    certificateType: n.certificateType,
    instructorName: n.instructorName,
    description: n.description,
    startDate: n.startDate,
    completionDate: n.completionDate,
    issuedAt: n.issuedAt,
    grade: n.grade,
    duration: n.duration,
    templateId: n.templateId,
    status: n.status,
    revokedAt: n.revokedAt,
    replacedBy: s.certificates.find((x) => x.replacedCertificateId === n.certificateId)?.certificateId ?? null,
  };
}

function adminCertificate(s: Store, c: Certificate): AdminCertificate {
  return {
    ...normalise(c),
    issuedBy: s.certificateEvents.find((e) => e.certificateId === c.certificateId && e.action === "issued")?.actorName ?? null,
    replacedBy: s.certificates.find((x) => x.replacedCertificateId === c.certificateId)?.certificateId ?? null,
  };
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
  /** The same rule the database enforces: free courses are open; paid ones need an enrolment (or an admin). */
  const accessTo = (s: Store, userId: string | null, courseId: string) => {
    const c = courses(s).find((x) => x.id === courseId);
    if (!c) return false;
    if (!isPaid(c)) return true;
    if (!userId) return false;
    if (s.users.find((x) => x.id === userId)?.role === "admin") return true;
    if (s.programmes.some((p) => p.userId === userId && programmeCourseIds(programmeOf(s, p.trackId)!).includes(courseId))) return true;
    return (s.enrollments[userId] ?? []).some((e) => e.courseId === courseId);
  };
  const DEFAULT_ACCOUNTS: PaymentAccount[] = [
    { id: "acc-demo", label: "Bank transfer", bankName: "Demo Bank", accountName: "CloudTech Analytics", accountNumber: "0123456789", instructions: "Use your payment reference as the transfer narration.", currency: "NGN", active: true, position: 1 },
  ];
  const accountsOf = (s: Store) => s.paymentAccounts ?? DEFAULT_ACCOUNTS;
  const settingsOf = (s: Store): PaymentSettings => s.paymentSettings ?? { mode: "manual", proofRequired: true, instructions: null };
  const reference = (s: Store) => {
    let r: string;
    do r = `PAY-${now().slice(2, 4)}${now().slice(5, 7)}-${uid().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
    while (s.orderPayments.some((p) => p.reference === r));
    return r;
  };
  const stripPayment = ({ userId: _u, proofName: _n, ...pub }: OrderPayment & { userId: string; proofName?: string | null }) => (void [_u, _n], pub as OrderPayment);
  const publicOrder = ({ userId: _u, provider: _p, providerRef: _r, note: _n, ...pub }: Store["courseOrders"][number]) => (void [_u, _p, _r, _n], pub);
  const openForOrder = (s: Store, o: Store["courseOrders"][number]) => {
    if (o.trackId) openProgramme(s, o.userId, o.trackId, "purchase");
    else {
      const list = (s.enrollments[o.userId] ??= []);
      const have = list.find((e) => e.courseId === o.courseId);
      if (have) have.source = have.source === "free" ? "purchase" : have.source;
      else list.push({ courseId: o.courseId!, enrolledAt: now(), completedAt: null, lastLessonId: null, lastActiveAt: now(), source: "purchase" });
    }
  };
  const closeForOrder = (s: Store, o: Store["courseOrders"][number]) => {
    if (o.trackId) {
      s.programmes = s.programmes.filter((p) => !(p.userId === o.userId && p.trackId === o.trackId));
      const keep = new Set(s.programmes.filter((p) => p.userId === o.userId).flatMap((p) => programmeCourseIds(programmeOf(s, p.trackId)!)));
      const closing = new Set(programmeCourseIds(programmeOf(s, o.trackId)!));
      s.enrollments[o.userId] = (s.enrollments[o.userId] ?? []).filter((e) => {
        const c = courses(s).find((x) => x.id === e.courseId);
        return !(closing.has(e.courseId) && c && isPaid(c) && e.source === "purchase" && !keep.has(e.courseId));
      });
    } else s.enrollments[o.userId] = (s.enrollments[o.userId] ?? []).filter((e) => !(e.courseId === o.courseId && e.source === "purchase"));
  };
  /** An order follows its confirmed payments: partial, then paid; access opens with the first money and closes when none is left. */
  const recomputeOrder = (s: Store, orderId: string) => {
    const o = s.courseOrders.find((x) => x.id === orderId);
    if (!o) return;
    const confirmed = s.orderPayments.filter((p) => p.orderId === orderId && p.status === "confirmed");
    const sum = confirmed.reduce((n, p) => n + p.amount, 0);
    if (confirmed.length) {
      o.status = sum >= o.amount ? "paid" : "partial";
      o.paidAt = o.status === "paid" ? (o.paidAt ?? now()) : null;
      openForOrder(s, o);
    } else if (o.status === "paid" || o.status === "partial") {
      o.status = "pending";
      o.paidAt = null;
      closeForOrder(s, o);
    }
  };
  /** A programme with the admin's edits applied. */
  const programmeOf = (s: Store, trackId: string) => {
    const t = TRACKS.find((x) => x.id === trackId);
    return t ? withSales(t, s.programmeSales?.[trackId]) : undefined;
  };
  /** Opens a programme for a learner: the programme itself and every paid course it contains. */
  const openProgramme = (s: Store, userId: string, trackId: string, source: "purchase" | "granted") => {
    if (!s.programmes.some((p) => p.userId === userId && p.trackId === trackId)) s.programmes.push({ userId, trackId, source, enrolledAt: now() });
    const list = (s.enrollments[userId] ??= []);
    for (const courseId of programmeCourseIds(programmeOf(s, trackId)!)) {
      const course = courses(s).find((c) => c.id === courseId);
      if (!course || !isPaid(course)) continue;
      const have = list.find((e) => e.courseId === courseId);
      if (have) have.source = have.source === "free" ? source : have.source;
      else list.push({ courseId, enrolledAt: now(), completedAt: null, lastLessonId: null, lastActiveAt: now(), source });
    }
  };
  const requireAccess = (s: Store, userId: string, courseId: string | undefined) => {
    if (courseId && !accessTo(s, userId, courseId)) throw new BackendError("This course is for enrolled learners. Enrol to continue.");
  };
  /** A module's check when moduleId is given, otherwise the course's final assessment. */
  const findAssessment = (courseId: string, moduleId?: string) =>
    assessments().find((a) => a.courseId === courseId && (moduleId ? a.kind === "module" && a.moduleId === moduleId : a.kind !== "module"));
  const assessmentCourse = (s: Store, assessmentId: string) => assessments(s).find((a) => a.id === assessmentId)?.courseId;
  /** Marks a course as active now (opening a lesson, completing something, taking an assessment). */
  const touch = (s: Store, userId: string, courseId: string | undefined) => {
    const e = (s.enrollments[userId] ?? []).find((x) => x.courseId === courseId);
    if (e) e.lastActiveAt = now();
  };
  const courseCompleted = (s: Store, userId: string, courseId: string) =>
    (s.enrollments[userId] ?? []).some((e) => e.courseId === courseId && e.completedAt) ||
    s.credentials.some((c) => c.userId === userId && c.courseId === courseId && c.kind === "course_completion" && c.status === "valid");
  /** Clears a learner's lessons, tasks and assessment attempts in one course. Badges stay. */
  const clearCourseProgress = (s: Store, userId: string, courseId: string) => {
    delete s.lessons[key(userId, courseId)];
    delete s.exercises[key(userId, courseId)];
    s.attempts[userId] = (s.attempts[userId] ?? []).filter((t) => assessmentCourse(s, t.assessmentId) !== courseId);
    const e = (s.enrollments[userId] ?? []).find((x) => x.courseId === courseId);
    if (e) {
      e.lastLessonId = null;
      e.lastActiveAt = now();
    }
  };

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
      const s = load();
      const c = courses(s).find((x) => x.slug === slug);
      if (!c || !(opts?.includeUnpublished || c.published)) return null;
      // Like the database, hand out lesson text only to people who have access.
      if (accessTo(s, current()?.id ?? null, c.id)) return c;
      return { ...c, modules: c.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => ({ ...l, body: "" })) })) };
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
      // Enrollments saved before activity was tracked count as active from when they started.
      return u ? (load().enrollments[u.id] ?? []).map((e) => ({ ...e, lastActiveAt: e.lastActiveAt ?? e.enrolledAt, source: e.source ?? "free" })) : [];
    },
    async enroll(courseId) {
      const u = requireUser();
      const s = load();
      const list = (s.enrollments[u.id] ??= []);
      if (list.some((e) => e.courseId === courseId)) return;
      const course = courses(s).find((c) => c.id === courseId);
      if (course && isPaid(course)) throw new BackendError("This course is paid. Enrol with payment to start it.");
      list.push({ courseId, enrolledAt: now(), completedAt: null, lastLessonId: null, lastActiveAt: now(), source: "free" });
      save(s);
    },
    async setLastLesson(courseId, lessonId) {
      const u = current();
      if (!u) return;
      const s = load();
      const e = (s.enrollments[u.id] ?? []).find((x) => x.courseId === courseId);
      if (e) {
        e.lastLessonId = lessonId;
        e.lastActiveAt = now();
        save(s);
      }
    },
    async removeCourse(courseId) {
      const u = requireUser();
      const s = load();
      if ((s.enrollments[u.id] ?? []).some((e) => e.courseId === courseId && (e.source ?? "free") !== "free"))
        throw new BackendError("A course you enrolled in with payment stays in My Learning. Contact support if you need it removed.");
      if (!courseCompleted(s, u.id, courseId)) clearCourseProgress(s, u.id, courseId);
      s.enrollments[u.id] = (s.enrollments[u.id] ?? []).filter((e) => e.courseId !== courseId);
      save(s);
    },
    async applyInactivityResets() {
      const u = current();
      if (!u) return [];
      const s = load();
      const reset: string[] = [];
      for (const e of s.enrollments[u.id] ?? []) {
        if ((e.source ?? "free") !== "free" || !isStale(e.lastActiveAt ?? e.enrolledAt) || courseCompleted(s, u.id, e.courseId)) continue;
        const k = key(u.id, e.courseId);
        const hadProgress = !!(s.lessons[k]?.length || s.exercises[k]?.length || (s.attempts[u.id] ?? []).some((t) => assessmentCourse(s, t.assessmentId) === e.courseId));
        clearCourseProgress(s, u.id, e.courseId);
        if (hadProgress) reset.push(e.courseId);
      }
      save(s);
      return reset;
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
      requireAccess(s, u.id, courseId);
      const set = new Set(s.lessons[key(u.id, courseId)] ?? []);
      if (done) set.add(lessonId);
      else set.delete(lessonId);
      s.lessons[key(u.id, courseId)] = [...set];
      s.activity[u.id] = now();
      touch(s, u.id, courseId);
      save(s);
    },
    async recordExercise(courseId, _lessonId, exerciseId) {
      const u = requireUser();
      await backend.enroll(courseId);
      const s = load();
      requireAccess(s, u.id, courseId);
      const set = new Set(s.exercises[key(u.id, courseId)] ?? []);
      set.add(exerciseId);
      s.exercises[key(u.id, courseId)] = [...set];
      s.activity[u.id] = now();
      touch(s, u.id, courseId);
      save(s);
    },
    async submitAssessment(assessmentId, answers) {
      const u = requireUser();
      const a = assessments().find((x) => x.id === assessmentId);
      if (!a) throw new BackendError("Assessment not found.");
      requireAccess(load(), u.id, a.courseId);
      const correct = a.questions.filter((q) => answers[q.id] === q.answer).length;
      const score = Math.round((correct / a.questions.length) * 100);
      const result = { id: uid(), assessmentId, score, passed: score >= a.passingScore, correct, total: a.questions.length, submittedAt: now() };
      const s = load();
      (s.attempts[u.id] ??= []).push(result);
      s.activity[u.id] = now();
      touch(s, u.id, a.courseId);
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
      requireAccess(s, u.id, BUNDLED_PROJECTS.find((p) => p.id === projectId)?.courseId);
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
      const done = s.exercises[key(u.id, course.id)] ?? [];
      const missing = moduleTaskIds(mod).filter((id) => !done.includes(id)).length;
      if (missing) throw new BackendError(`Complete the tasks in this module first (${missing} left).`);
      const check =assessments(s).find((a) => a.kind === "module" && a.moduleId === moduleId);
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
    async issueTrackCredential(trackId) {
      const u = requireUser();
      const s = load();
      const existing = s.credentials.find((c) => c.userId === u.id && c.kind === "track_completion" && c.trackId === trackId && c.status === "valid");
      if (existing) return existing;
      const track = TRACKS.find((t) => t.id === trackId);
      if (!track) throw new BackendError("Track not found.");
      const published = new Set(courses(s).filter((c) => c.published && c.status === "available").map((c) => c.id));
      const missing = requiredCourses(track).filter(
        (id) => published.has(id) && !s.credentials.some((c) => c.userId === u.id && c.courseId === id && c.kind === "course_completion" && c.status === "valid"),
      );
      if (missing.length) throw new BackendError(`Complete every required course in the track first (${missing.length} left).`);
      const cred = newCredential(s, u, {
        kind: "track_completion",
        code: track.badgeCode,
        courseId: "",
        trackId: track.id,
        moduleId: null,
        badgeName: track.badge,
        courseTitle: track.title,
        moduleTitle: null,
        skills: track.skills,
      });
      save(s);
      return cred;
    },
    async listMyCredentials() {
      const u = current();
      if (!u) return [];
      const s = load();
      return s.credentials.filter((c) => c.userId === u.id).map((c) => withWork(s, { ...c, trackId: c.trackId ?? null }));
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
    // Mirrors submit_practice_project() in supabase/migrations/0006_project_badges.sql.
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
          courseId: "",
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
    async listCertificatePrices(kind = "course") {
      return prices().filter((p) => p.kind === kind && p.active);
    },
    async startProgrammeOrder(trackId, currency) {
      const u = requireUser();
      const s = load();
      const track = TRACKS.find((t) => t.id === trackId);
      if (!track) throw new BackendError("Programme not found.");
      if (!programmeCertificateAvailable(track)) throw new BackendError("The certificate for this programme isn't available yet.");
      const cred = s.credentials.find((c) => c.userId === u.id && c.trackId === trackId && c.kind === "track_completion" && c.status === "valid");
      if (!cred) throw new BackendError("Complete every required course and the capstone first, then claim your programme badge.");
      if (s.certificates.some((c) => c.userId === u.id && c.trackId === trackId && c.status === "valid" && c.source === "programme"))
        throw new BackendError("You already have the official certificate for this programme.");
      const price = prices(s).find((p) => p.kind === "programme" && p.currency === currency.toUpperCase() && p.active);
      if (!price) throw new BackendError("That currency isn't available.");
      const pending = s.orders.find((o) => o.userId === u.id && o.trackId === trackId && o.status === "pending" && o.currency === price.currency);
      if (pending) return pending;
      const order: CertificateOrder = {
        id: uid(),
        userId: u.id,
        courseId: null,
        trackId,
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
    async startCertificateOrder(courseId, currency) {
      const u = requireUser();
      const s = load();
      const cred = s.credentials.find((c) => c.userId === u.id && c.courseId === courseId && c.kind === "course_completion" && c.status === "valid");
      if (!cred) throw new BackendError("Complete the course first. Your free completion badge comes first.");
      if (s.certificates.some((c) => c.userId === u.id && c.courseId === courseId && c.status === "valid" && c.source === "course"))
        throw new BackendError("You already have the official certificate for this course.");
      const price = prices(s).find((p) => p.kind === "course" && p.currency === currency.toUpperCase() && p.active);
      if (!price) throw new BackendError("That currency isn't available.");
      const pending = s.orders.find((o) => o.userId === u.id && o.courseId === courseId && o.status === "pending" && o.currency === price.currency);
      if (pending) return pending;
      const order: CertificateOrder = {
        id: uid(),
        userId: u.id,
        courseId,
        trackId: null,
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
    async startCourseOrder(courseId) {
      const u = requireUser();
      const s = load();
      const course = courses(s).find((c) => c.id === courseId && c.published);
      if (!course) throw new BackendError("Course not found.");
      if (!isPaid(course)) throw new BackendError("This course is free: you can start it without paying.");
      const state = enrolmentOf(course);
      if (state !== "open") throw new BackendError(state === "paused" ? "Payments for this course are paused. Please try again soon." : "Enrolment for this course is not open right now.");
      if ((s.enrollments[u.id] ?? []).some((e) => e.courseId === courseId)) throw new BackendError("You are already enrolled in this course.");
      const price = course.price ?? 0;
      const charge = course.discountActive && course.discountPrice != null && course.discountPrice < price ? course.discountPrice : price;
      let order = s.courseOrders.find((o) => o.userId === u.id && o.courseId === courseId && o.status === "pending");
      if (order) Object.assign(order, { currency: course.currency ?? "NGN", listAmount: price, amount: charge });
      else {
        order = { id: uid(), userId: u.id, courseId, trackId: null, currency: course.currency ?? "NGN", listAmount: price, amount: charge, status: "pending", provider: null, providerRef: null, note: null, createdAt: now(), paidAt: null };
        s.courseOrders.push(order);
      }
      save(s);
      const { userId: _u, provider: _p, providerRef: _r, note: _n, ...pub } = order;
      void [_u, _p, _r, _n];
      return pub;
    },
    async listMyCourseOrders() {
      const u = current();
      return u ? load().courseOrders.filter((o) => o.userId === u.id).map(({ userId: _u, provider: _p, providerRef: _r, note: _n, ...pub }) => (void [_u, _p, _r, _n], pub)) : [];
    },
    async simulateCoursePayment(orderId) {
      const u = requireUser();
      const s = load();
      const order = s.courseOrders.find((o) => o.id === orderId && o.userId === u.id);
      if (!order) throw new BackendError("Order not found.");
      Object.assign(order, { status: "paid", provider: "demo", providerRef: `demo-${order.id.slice(0, 8)}`, paidAt: now() });
      if (order.trackId) openProgramme(s, u.id, order.trackId, "purchase");
      else {
        const list = (s.enrollments[u.id] ??= []);
        const have = list.find((e) => e.courseId === order.courseId);
        if (have) have.source = have.source === "free" ? "purchase" : have.source;
        else list.push({ courseId: order.courseId!, enrolledAt: now(), completedAt: null, lastLessonId: null, lastActiveAt: now(), source: "purchase" });
      }
      save(s);
    },
    async listProgrammeSales() {
      const s = load();
      return Object.fromEntries(TRACKS.map((t) => [t.id, salesOf(programmeOf(s, t.id)!)]));
    },
    async listMyProgrammes() {
      const u = current();
      return u ? load().programmes.filter((p) => p.userId === u.id).map(({ trackId, enrolledAt, source }) => ({ trackId, enrolledAt, source })) : [];
    },
    async getPaymentSettings() {
      return settingsOf(load());
    },
    async listPaymentAccounts() {
      return accountsOf(load()).filter((a) => a.active);
    },
    async startManualOrder(kind, id, plan) {
      const u = requireUser();
      const s = load();
      let sales: CourseSalesFields;
      let price: number;
      if (kind === "programme") {
        const track = programmeOf(s, id);
        if (!track) throw new BackendError("Programme not found.");
        if (!isPaid(track)) throw new BackendError("This programme is free.");
        const state = enrolmentOf({ enrollmentStatus: track.enrollmentStatus, enrollmentStart: track.enrollmentStart, enrollmentEnd: track.enrollmentEnd, paymentStatus: track.paymentStatus });
        if (!track.price || state !== "open") throw new BackendError(state === "paused" ? "Payments for this programme are paused. Please try again soon." : "Enrolment for this programme is not open right now.");
        if (s.programmes.some((p) => p.userId === u.id && p.trackId === id)) throw new BackendError("You are already enrolled in this programme.");
        if (plan === "two_part" && !track.allowInstalments) throw new BackendError("This programme is paid in one payment.");
        sales = track;
        price = track.price;
      } else {
        const course = courses(s).find((c) => c.id === id && c.published);
        if (!course) throw new BackendError("Course not found.");
        if (!isPaid(course)) throw new BackendError("This course is free: you can start it without paying.");
        const state = enrolmentOf(course);
        if (!course.price || state !== "open") throw new BackendError("Enrolment for this course is not open right now.");
        if ((s.enrollments[u.id] ?? []).some((e) => e.courseId === id)) throw new BackendError("You are already enrolled in this course.");
        if (plan === "two_part") throw new BackendError("Courses are paid in one payment.");
        sales = course;
        price = course.price;
      }
      const charge = sales.discountActive && sales.discountPrice != null && sales.discountPrice < price ? sales.discountPrice : price;
      const cur = sales.currency ?? "NGN";
      let order = s.courseOrders.find((o) => o.userId === u.id && (o.status === "pending" || o.status === "partial") && (kind === "programme" ? o.trackId === id : o.courseId === id));
      if (order) {
        const has = s.orderPayments.some((p) => p.orderId === order!.id && (p.status === "submitted" || p.status === "confirmed"));
        if (order.status === "partial" || has) return { order: publicOrder(order), payments: s.orderPayments.filter((p) => p.orderId === order!.id).map(stripPayment) };
        s.orderPayments = s.orderPayments.filter((p) => p.orderId !== order!.id);
        Object.assign(order, { currency: cur, listAmount: price, amount: charge });
      } else {
        order = { id: uid(), userId: u.id, courseId: kind === "course" ? id : null, trackId: kind === "programme" ? id : null, currency: cur, listAmount: price, amount: charge, status: "pending", provider: "manual", providerRef: null, note: null, createdAt: now(), paidAt: null };
        s.courseOrders.push(order);
      }
      const part = (n: 1 | 2, amount: number): Store["orderPayments"][number] => ({
        id: uid(), orderId: order!.id, userId: u.id, part: n, amount, currency: cur, dueAt: null, status: "pending", accountLabel: null, reference: reference(s), payerName: null, paidOn: null,
        proofPath: null, note: null, rejectedReason: null, source: "student", confirmedAt: null, createdAt: now(),
      });
      if (plan === "full") s.orderPayments.push(part(1, charge));
      else {
        const first = Math.round(((charge * (sales.firstPercent ?? 50)) / 100) * 100) / 100;
        s.orderPayments.push(part(1, first), part(2, Math.round((charge - first) * 100) / 100));
      }
      save(s);
      return { order: publicOrder(order), payments: s.orderPayments.filter((p) => p.orderId === order!.id).map(stripPayment) };
    },
    async listMyManualOrders() {
      const u = current();
      if (!u) return [];
      const s = load();
      return s.courseOrders
        .filter((o) => o.userId === u.id && s.orderPayments.some((p) => p.orderId === o.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((o) => ({ order: publicOrder(o), payments: s.orderPayments.filter((p) => p.orderId === o.id).map(stripPayment) }));
    },
    async submitPayment({ paymentId, accountId, payerName, paidOn, note, proof }) {
      const u = requireUser();
      const s = load();
      const p = s.orderPayments.find((x) => x.id === paymentId && x.userId === u.id);
      if (!p) throw new BackendError("Payment not found.");
      if (p.status !== "pending" && p.status !== "rejected") throw new BackendError("This payment has already been sent for confirmation.");
      if (p.part === 2 && !s.orderPayments.some((x) => x.orderId === p.orderId && x.part === 1 && x.status === "confirmed")) throw new BackendError("The first payment must be confirmed before the second.");
      const account = accountsOf(s).find((a) => a.id === accountId && a.active);
      if (!account) throw new BackendError("Choose a payment method.");
      if (settingsOf(s).proofRequired && !proof) throw new BackendError("Upload your receipt or a screenshot of the payment.");
      if (payerName.trim().length < 2) throw new BackendError("Enter the name on the account you paid from.");
      Object.assign(p, { status: "submitted", accountLabel: account.label, payerName: payerName.trim(), paidOn: paidOn || now().slice(0, 10), note: note.trim() || null, rejectedReason: null, proofPath: proof ? `demo:${proof.name}` : null });
      save(s);
    },
    async startProgrammePurchase(trackId) {
      const u = requireUser();
      const s = load();
      const track = programmeOf(s, trackId);
      if (!track) throw new BackendError("Programme not found.");
      if (!isPaid(track)) throw new BackendError("This programme is free.");
      const state = enrolmentOf({ enrollmentStatus: track.enrollmentStatus, enrollmentStart: track.enrollmentStart, enrollmentEnd: track.enrollmentEnd, paymentStatus: track.paymentStatus });
      if (!track.price || state !== "open") throw new BackendError(state === "paused" ? "Payments for this programme are paused. Please try again soon." : "Enrolment for this programme is not open right now.");
      if (s.programmes.some((p) => p.userId === u.id && p.trackId === trackId)) throw new BackendError("You are already enrolled in this programme.");
      const price = track.price;
      const charge = track.discountActive && track.discountPrice != null && track.discountPrice < price ? track.discountPrice : price;
      let order = s.courseOrders.find((o) => o.userId === u.id && o.trackId === trackId && o.status === "pending");
      if (order) Object.assign(order, { currency: track.currency ?? "NGN", listAmount: price, amount: charge });
      else {
        order = { id: uid(), userId: u.id, courseId: null, trackId, currency: track.currency ?? "NGN", listAmount: price, amount: charge, status: "pending", provider: null, providerRef: null, note: null, createdAt: now(), paidAt: null };
        s.courseOrders.push(order);
      }
      save(s);
      const { userId: _u, provider: _p, providerRef: _r, note: _n, ...pub } = order;
      void [_u, _p, _r, _n];
      return pub;
    },
    async claimProgrammeCertificate(trackId) {
      const u = requireUser();
      const s = load();
      const track = TRACKS.find((t) => t.id === trackId);
      if (!track || !programmeCertificateAvailable(track)) throw new BackendError("The certificate for this programme isn't available yet.");
      if (!s.programmes.some((p) => p.userId === u.id && p.trackId === trackId)) throw new BackendError("The certificate is included for learners enrolled in this programme.");
      const cred = s.credentials.find((c) => c.userId === u.id && c.trackId === trackId && c.kind === "track_completion" && c.status === "valid");
      if (!cred) throw new BackendError("Complete every required course and the capstone first, then claim your programme badge.");
      const order: CertificateOrder = {
        id: uid(), userId: u.id, courseId: null, trackId, credentialId: cred.credentialId, currency: "NGN", amount: 0, status: "granted",
        provider: null, providerRef: null, note: "Included with programme enrolment", createdAt: now(), paidAt: now(),
      };
      s.orders.push(order);
      const cert = issueCertificate(s, order);
      save(s);
      return cert;
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
      return u ? load().certificates.filter((c) => c.userId === u.id).map(normalise) : [];
    },
    async getMyCertificate(certificateId) {
      const u = current();
      const c = u ? load().certificates.find((x) => x.userId === u.id && x.certificateId === certificateId) : undefined;
      return c ? normalise(c) : null;
    },
    async verifyCertificate(certificateId) {
      const s = load();
      const c = s.certificates.find((x) => x.certificateId === certificateId.trim().toUpperCase());
      return c ? publicCertificate(s, c) : null;
    },
    async recordCertificateDownload(certificateId) {
      const u = requireUser();
      const s = load();
      const c = s.certificates.find((x) => x.certificateId === certificateId && (u.role === "admin" || x.userId === u.id));
      if (!c) throw new BackendError("Certificate not found.");
      logEvent(s, c.certificateId, "downloaded", u, { by: u.role === "admin" ? "admin" : "recipient" });
      save(s);
    },

    /* ---------- community and events ---------- */
    async getCommunity() {
      const c = load().community;
      return c.isActive && c.whatsappUrl ? { name: c.name, description: c.description, whatsappUrl: c.whatsappUrl, welcomeMessage: c.welcomeMessage, buttonText: c.buttonText } : null;
    },
    async trackCommunityClick(source) {
      const s = load();
      if (!s.community.isActive) return;
      const known = ["homepage", "welcome", "dashboard", "community_page", "navbar", "events", "event_page", "sign_up"];
      s.communityClicks.push({ source: known.includes(source) ? source : "other", userId: current()?.id ?? null, at: now() });
      save(s);
    },
    async listEvents() {
      const s = load();
      return s.events
        .filter((e) => e.status !== "draft")
        .map((e) => ({ ...withCount(s, e), meetingUrl: e.registrationRequired ? null : e.meetingUrl }))
        .sort((a, b) => a.startDatetime.localeCompare(b.startDatetime));
    },
    async getEvent(slug) {
      return (await backend.listEvents()).find((e) => e.slug === slug) ?? null;
    },
    async registerForEvent(eventId, input) {
      const u = current();
      const s = load();
      const event = s.events.find((e) => e.id === eventId && e.status !== "draft");
      if (!event) throw new BackendError("Event not found.");
      const name = input.fullName.trim();
      const email = input.email.trim().toLowerCase();
      const phone = input.phone.trim() || null;
      if (name.length < 2) throw new BackendError("Enter your full name.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new BackendError("Enter a valid email address.");
      if (phone && !/^[0-9+()\-\s]{7,20}$/.test(phone)) throw new BackendError("Enter a valid phone number.");
      if (!event.registrationRequired) throw new BackendError("This event doesn't need registration.");
      if (event.status === "cancelled") throw new BackendError("This event was cancelled.");
      if (event.status === "completed" || eventEndMs(event) < Date.now()) throw new BackendError("This event has ended.");
      if (event.status === "registration_closed") throw new BackendError("Registration for this event has closed.");
      const existing = s.registrations.find((r) => r.eventId === eventId && r.email.toLowerCase() === email);
      if (existing && existing.registrationStatus === "registered") return existing;
      const taken = s.registrations.filter((r) => r.eventId === eventId && r.registrationStatus === "registered").length;
      if (event.maxParticipants !== null && taken >= event.maxParticipants) throw new BackendError("This event is full.");
      if (existing) {
        Object.assign(existing, { registrationStatus: "registered", attendanceStatus: "registered", fullName: name, phone, userId: u?.id ?? existing.userId, registeredAt: now(), attendedAt: null });
        save(s);
        return existing;
      }
      const reg: EventRegistration = { id: uid(), eventId, userId: u?.id ?? null, fullName: name, email, phone, registrationStatus: "registered", attendanceStatus: "registered", registeredAt: now(), attendedAt: null };
      s.registrations.push(reg);
      save(s);
      return reg;
    },
    async revealEventLink(eventId, email) {
      const u = current();
      const s = load();
      const e = s.events.find((x) => x.id === eventId && x.status !== "draft" && x.status !== "cancelled");
      if (!e) return null;
      if (!e.registrationRequired) return e.meetingUrl;
      const mine = s.registrations.some((r) => r.eventId === eventId && r.registrationStatus === "registered" && ((u && r.userId === u.id) || (email && r.email.toLowerCase() === email.trim().toLowerCase())));
      return mine ? e.meetingUrl : null;
    },
    async listMyRegistrations() {
      const u = current();
      return u ? load().registrations.filter((r) => r.userId === u.id && r.registrationStatus === "registered") : [];
    },
    async cancelMyRegistration(eventId) {
      const u = requireUser();
      const s = load();
      const r = s.registrations.find((x) => x.eventId === eventId && x.userId === u.id && x.registrationStatus === "registered");
      if (r) r.registrationStatus = "cancelled";
      save(s);
    },

    admin: {
      async getCommunitySettings() {
        requireAdmin();
        return load().community;
      },
      async saveCommunitySettings(c) {
        requireAdmin();
        const url = c.whatsappUrl?.trim() || null;
        if (url && !WHATSAPP_RE.test(url)) throw new BackendError("Use a WhatsApp invite link, such as https://chat.whatsapp.com/…");
        if (c.isActive && !url) throw new BackendError("Add the WhatsApp invite link before switching the community on.");
        const s = load();
        s.community = { ...c, name: c.name.trim(), description: c.description.trim(), welcomeMessage: c.welcomeMessage.trim(), buttonText: c.buttonText.trim() || "Join Community", whatsappUrl: url };
        save(s);
      },
      async communityStats() {
        requireAdmin();
        const s = load();
        const cutoff = Date.now() - 30 * 86_400_000;
        const live = s.events.filter((e) => ["published", "registration_open", "registration_closed"].includes(e.status) && eventEndMs(e) >= Date.now());
        const regs = s.registrations.filter((r) => r.registrationStatus === "registered");
        const bySource = new Map<string, number>();
        for (const c of s.communityClicks) if (new Date(c.at).getTime() > cutoff) bySource.set(c.source, (bySource.get(c.source) ?? 0) + 1);
        return {
          clicksTotal: s.communityClicks.length,
          clicks30d: [...bySource.values()].reduce((a, b) => a + b, 0),
          upcomingEvents: live.length,
          registrationsTotal: regs.length,
          registrationsUpcoming: regs.filter((r) => live.some((e) => e.id === r.eventId)).length,
          clickSources: [...bySource].map(([source, clicks]) => ({ source, clicks })).sort((a, b) => b.clicks - a.clicks),
        };
      },
      async recentRegistrations(limit = 8) {
        requireAdmin();
        const s = load();
        return [...s.registrations]
          .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
          .slice(0, limit)
          .map((r) => ({ ...r, eventTitle: s.events.find((e) => e.id === r.eventId)?.title ?? "Deleted event" }));
      },
      async listAllEvents() {
        requireAdmin();
        const s = load();
        return s.events.map((e) => withCount(s, e)).sort((a, b) => a.startDatetime.localeCompare(b.startDatetime));
      },
      async getEventById(id) {
        requireAdmin();
        const s = load();
        const e = s.events.find((x) => x.id === id);
        return e ? withCount(s, e) : null;
      },
      async saveEvent(input) {
        requireAdmin();
        const s = load();
        checkEvent(s, input);
        const { id: _id, ...fields } = input;
        void _id;
        const t = now();
        if (input.id) {
          const e = s.events.find((x) => x.id === input.id);
          if (!e) throw new BackendError("Event not found.");
          Object.assign(e, fields, { updatedAt: t });
          save(s);
          return withCount(s, e);
        }
        const e = { ...fields, id: uid(), createdAt: t, updatedAt: t };
        s.events.push(e);
        save(s);
        return withCount(s, e);
      },
      async setEventStatus(id, status: EventStatus) {
        requireAdmin();
        const s = load();
        const e = s.events.find((x) => x.id === id);
        if (!e) throw new BackendError("Event not found.");
        Object.assign(e, { status, updatedAt: now() });
        save(s);
      },
      async duplicateEvent(id) {
        requireAdmin();
        const s = load();
        const src = s.events.find((x) => x.id === id);
        if (!src) throw new BackendError("Event not found.");
        let slug = `${src.slug}-copy`.slice(0, 95);
        for (let n = 2; s.events.some((e) => e.slug === slug); n++) slug = `${src.slug}-copy-${n}`.slice(0, 95);
        const t = now();
        const copy = { ...src, id: uid(), title: `${src.title} (copy)`, slug, status: "draft" as const, isFeatured: false, createdAt: t, updatedAt: t };
        s.events.push(copy);
        save(s);
        return withCount(s, copy);
      },
      async deleteEvent(id) {
        requireAdmin();
        const s = load();
        s.events = s.events.filter((e) => e.id !== id);
        s.registrations = s.registrations.filter((r) => r.eventId !== id);
        save(s);
      },
      async listRegistrations(eventId) {
        requireAdmin();
        return load()
          .registrations.filter((r) => r.eventId === eventId)
          .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
      },
      async setAttendance(registrationId, status: AttendanceStatus) {
        requireAdmin();
        const s = load();
        const r = s.registrations.find((x) => x.id === registrationId);
        if (!r) throw new BackendError("Registration not found.");
        Object.assign(r, { attendanceStatus: status, attendedAt: status === "attended" ? now() : null });
        save(s);
      },
      async uploadEventImage(file) {
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new BackendError("Use a PNG, JPEG or WebP image.");
        if (file.size > 600 * 1024) throw new BackendError("In demo mode images are stored in your browser, so keep them under 600 KB.");
        return await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = () => reject(new BackendError("Couldn't read that image."));
          r.readAsDataURL(file);
        });
      },
      async saveCourse(input) {
        requireAdmin();
        mutateCourses((list) => {
          const i = list.findIndex((c) => c.id === input.id);
          if (i >= 0) list[i] = { ...list[i], ...input };
          else list.push({ ...input, modules: [] });
        });
      },
      async listCourseStats() {
        requireAdmin();
        const s = load();
        const all = Object.entries(s.enrollments).flatMap(([userId, list]) => list.map((e) => ({ ...e, userId, source: e.source ?? "free" })));
        return courses(s).map((c): CourseStats => {
          const mine = all.filter((e) => e.courseId === c.id);
          const revenue: Record<string, number> = {};
          for (const o of s.courseOrders) if (o.courseId === c.id && o.status === "paid") revenue[o.currency] = (revenue[o.currency] ?? 0) + o.amount;
          const paidBefore = (userId: string, at: string) =>
            all.some((f) => f.userId === userId && f.source === "purchase" && f.enrolledAt > at);
          const freeBefore = (userId: string, at: string) =>
            all.some((f) => f.userId === userId && f.enrolledAt < at && !isPaid(courses(s).find((x) => x.id === f.courseId) ?? c));
          return {
            courseId: c.id,
            title: c.title,
            courseType: c.courseType ?? "free",
            accessType: isPaid(c) ? "paid" : "free",
            published: c.published,
            price: c.price ?? null,
            currency: c.currency ?? "NGN",
            enrollments: mine.length,
            freeEnrollments: mine.filter((e) => e.source === "free").length,
            paidEnrollments: mine.filter((e) => e.source === "purchase").length,
            grantedEnrollments: mine.filter((e) => e.source === "granted").length,
            completions: mine.filter((e) => courseCompleted(s, e.userId, c.id)).length,
            revenue,
            converted: isPaid(c) ? mine.filter((e) => e.source === "purchase" && freeBefore(e.userId, e.enrolledAt)).length : new Set(mine.filter((e) => paidBefore(e.userId, e.enrolledAt)).map((e) => e.userId)).size,
          };
        });
      },
      async listCourseEnrollments(courseId) {
        requireAdmin();
        const s = load();
        const out: AdminEnrollment[] = [];
        for (const [userId, list] of Object.entries(s.enrollments)) {
          const u = s.users.find((x) => x.id === userId);
          for (const e of list) {
            if (courseId && e.courseId !== courseId) continue;
            const order = s.courseOrders.find((o) => o.userId === userId && o.courseId === e.courseId && (o.status === "paid" || o.status === "granted"));
            out.push({
              userId,
              fullName: u?.fullName ?? "Unknown",
              email: u?.email ?? "",
              courseId: e.courseId,
              courseTitle: courses(s).find((c) => c.id === e.courseId)?.title ?? e.courseId,
              source: e.source ?? "free",
              enrolledAt: e.enrolledAt,
              completedAt: courseCompleted(s, userId, e.courseId) ? (e.completedAt ?? e.enrolledAt) : null,
              amount: order ? order.amount : null,
              currency: order ? order.currency : null,
              orderStatus: order ? order.status : null,
            });
          }
        }
        return out.sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt));
      },
      async saveProgramme(trackId, sales) {
        requireAdmin();
        const s = load();
        if (!TRACKS.some((t) => t.id === trackId)) throw new BackendError("Programme not found.");
        s.programmeSales = { ...(s.programmeSales ?? {}), [trackId]: sales };
        save(s);
      },
      async listPayments() {
        requireAdmin();
        const s = load();
        return s.orderPayments
          .map((p): AdminPayment => {
            const o = s.courseOrders.find((x) => x.id === p.orderId)!;
            const u = s.users.find((x) => x.id === p.userId);
            const t = TRACKS.find((x) => x.id === o.trackId);
            return {
              ...stripPayment(p),
              userId: p.userId,
              fullName: u?.fullName ?? "Unknown",
              email: u?.email ?? "",
              courseId: o.courseId,
              trackId: o.trackId,
              targetTitle: t ? (t.programmeName ?? t.title) : (courses(s).find((c) => c.id === o.courseId)?.title ?? ""),
              orderStatus: o.status,
              orderAmount: o.amount,
            };
          })
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },
      async confirmPayment(paymentId, note) {
        requireAdmin();
        const s = load();
        const p = s.orderPayments.find((x) => x.id === paymentId);
        if (!p) throw new BackendError("Payment not found.");
        const o = s.courseOrders.find((x) => x.id === p.orderId)!;
        Object.assign(p, { status: "confirmed", confirmedAt: now(), rejectedReason: null, note: note.trim() || p.note });
        if (p.part === 1) {
          const days = (o.trackId ? programmeOf(s, o.trackId)?.secondDueDays : undefined) ?? 30;
          for (const q of s.orderPayments) if (q.orderId === p.orderId && q.part === 2 && !q.dueAt) q.dueAt = new Date(Date.now() + days * 864e5).toISOString();
        }
        recomputeOrder(s, p.orderId);
        save(s);
      },
      async rejectPayment(paymentId, reason) {
        requireAdmin();
        const s = load();
        const p = s.orderPayments.find((x) => x.id === paymentId);
        if (!p) throw new BackendError("Payment not found.");
        Object.assign(p, { status: "rejected", rejectedReason: reason.trim() || null });
        recomputeOrder(s, p.orderId);
        save(s);
      },
      async registerPayment(i) {
        requireAdmin();
        const s = load();
        if (!s.users.some((u) => u.id === i.userId)) throw new BackendError("Student not found.");
        if (!(i.amount > 0)) throw new BackendError("Enter the amount received.");
        let order = s.courseOrders.find((o) => o.userId === i.userId && (o.status === "pending" || o.status === "partial") && (i.kind === "programme" ? o.trackId === i.targetId : o.courseId === i.targetId));
        if (!order) {
          const t = i.kind === "programme" ? programmeOf(s, i.targetId) : courses(s).find((c) => c.id === i.targetId);
          if (!t) throw new BackendError(i.kind === "programme" ? "Programme not found." : "Course not found.");
          const price = t.price ?? i.amount;
          const charge = t.price == null ? i.amount : t.discountActive && t.discountPrice != null && t.discountPrice < t.price ? t.discountPrice : t.price;
          order = { id: uid(), userId: i.userId, courseId: i.kind === "course" ? i.targetId : null, trackId: i.kind === "programme" ? i.targetId : null, currency: t.currency ?? "NGN", listAmount: price, amount: charge, status: "pending", provider: "manual", providerRef: null, note: null, createdAt: now(), paidAt: null };
          s.courseOrders.push(order);
        }
        const n = s.orderPayments.filter((p) => p.orderId === order!.id).length;
        s.orderPayments.push({
          id: uid(), orderId: order.id, userId: i.userId, part: Math.min(n + 1, 2) as 1 | 2, amount: i.amount, currency: order.currency, dueAt: null, status: "confirmed", accountLabel: i.method.trim() || null,
          reference: i.reference.trim() || reference(s), payerName: null, paidOn: i.paidOn || now().slice(0, 10), proofPath: null, note: i.note.trim() || null, rejectedReason: null, source: "admin", confirmedAt: now(), createdAt: now(),
        });
        recomputeOrder(s, order.id);
        save(s);
      },
      async updatePayment(paymentId, patch) {
        requireAdmin();
        const s = load();
        const p = s.orderPayments.find((x) => x.id === paymentId);
        if (!p) throw new BackendError("Payment not found.");
        Object.assign(p, { amount: patch.amount, status: patch.status, accountLabel: patch.method.trim() || null, note: patch.note.trim() || null, paidOn: patch.paidOn, confirmedAt: patch.status === "confirmed" ? (p.confirmedAt ?? now()) : null });
        recomputeOrder(s, p.orderId);
        save(s);
      },
      async deletePayment(paymentId) {
        requireAdmin();
        const s = load();
        const p = s.orderPayments.find((x) => x.id === paymentId);
        if (!p) throw new BackendError("Payment not found.");
        s.orderPayments = s.orderPayments.filter((x) => x.id !== paymentId);
        recomputeOrder(s, p.orderId);
        save(s);
      },
      async listAllPaymentAccounts() {
        requireAdmin();
        return accountsOf(load());
      },
      async savePaymentAccount(a) {
        requireAdmin();
        const s = load();
        const list = [...accountsOf(s)];
        const row = { label: a.label.trim(), bankName: a.bankName?.trim() || null, accountName: a.accountName?.trim() || null, accountNumber: a.accountNumber?.trim() || null, instructions: a.instructions?.trim() || null, currency: a.currency || "NGN", active: a.active };
        const have = a.id ? list.find((x) => x.id === a.id) : undefined;
        if (have) Object.assign(have, row);
        else list.push({ id: uid(), position: list.length + 1, ...row });
        s.paymentAccounts = list;
        save(s);
      },
      async deletePaymentAccount(id) {
        requireAdmin();
        const s = load();
        s.paymentAccounts = accountsOf(s).filter((a) => a.id !== id);
        save(s);
      },
      async savePaymentSettings(settings) {
        requireAdmin();
        const s = load();
        s.paymentSettings = settings;
        save(s);
      },
      async proofUrl() {
        return null;
      },
      async listProgrammeStats() {
        requireAdmin();
        const s = load();
        return TRACKS.map((t) => programmeOf(s, t.id)!)
          .filter((t) => isPaid(t))
          .map((t): ProgrammeStats => {
            const mine = s.programmes.filter((p) => p.trackId === t.id);
            const revenue: Record<string, number> = {};
            for (const o of s.courseOrders) {
              if (o.trackId !== t.id) continue;
              const mine = s.orderPayments.filter((p) => p.orderId === o.id);
              const got = mine.length ? mine.filter((p) => p.status === "confirmed").reduce((n, p) => n + p.amount, 0) : o.status === "paid" ? o.amount : 0;
              if (got > 0) revenue[o.currency] = (revenue[o.currency] ?? 0) + got;
            }
            return {
              trackId: t.id,
              title: t.programmeTitle ?? t.title,
              published: true,
              price: t.price ?? null,
              currency: t.currency ?? "NGN",
              enrollments: mine.length,
              paidEnrollments: mine.filter((p) => p.source === "purchase").length,
              grantedEnrollments: mine.filter((p) => p.source === "granted").length,
              completions: mine.filter((p) => s.credentials.some((c) => c.userId === p.userId && c.trackId === t.id && c.kind === "track_completion" && c.status === "valid")).length,
              revenue,
              converted: mine.filter((p) => p.source === "purchase" && Object.values(s.enrollments[p.userId] ?? []).some((e) => e.source === "free" && e.enrolledAt < p.enrolledAt)).length,
            };
          });
      },
      async listProgrammeEnrollments(trackId) {
        requireAdmin();
        const s = load();
        return s.programmes
          .filter((p) => !trackId || p.trackId === trackId)
          .map((p): AdminProgrammeEnrollment => {
            const u = s.users.find((x) => x.id === p.userId);
            const t = TRACKS.find((x) => x.id === p.trackId)!;
            const order = s.courseOrders.find((o) => o.userId === p.userId && o.trackId === p.trackId && (o.status === "paid" || o.status === "granted"));
            const done = s.credentials.find((c) => c.userId === p.userId && c.trackId === p.trackId && c.kind === "track_completion" && c.status === "valid");
            return {
              userId: p.userId,
              fullName: u?.fullName ?? "Unknown",
              email: u?.email ?? "",
              trackId: p.trackId,
              trackTitle: t.programmeTitle ?? t.title,
              source: p.source,
              enrolledAt: p.enrolledAt,
              completedAt: done?.issuedAt ?? null,
              amount: order ? order.amount : null,
              currency: order ? order.currency : null,
              orderStatus: order ? order.status : null,
            };
          })
          .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt));
      },
      async grantProgrammeAccess(userId, trackId, note) {
        requireAdmin();
        const s = load();
        const track = programmeOf(s, trackId);
        if (!track) throw new BackendError("Programme not found.");
        if (!s.users.some((u) => u.id === userId)) throw new BackendError("Student not found.");
        let order = s.courseOrders.find((o) => o.userId === userId && o.trackId === trackId && o.status === "pending");
        if (order) Object.assign(order, { status: "granted", note: note.trim() || null, paidAt: now() });
        else {
          order = { id: uid(), userId, courseId: null, trackId, currency: track.currency ?? "NGN", listAmount: track.price ?? 0, amount: 0, status: "granted", provider: null, providerRef: null, note: note.trim() || null, createdAt: now(), paidAt: now() };
          s.courseOrders.push(order);
        }
        openProgramme(s, userId, trackId, "granted");
        save(s);
      },
      async revokeProgrammeAccess(userId, trackId, reason) {
        requireAdmin();
        const s = load();
        s.programmes = s.programmes.filter((p) => !(p.userId === userId && p.trackId === trackId));
        const keep = new Set(s.programmes.filter((p) => p.userId === userId).flatMap((p) => programmeCourseIds(programmeOf(s, p.trackId)!)));
        const closing = new Set(programmeCourseIds(programmeOf(s, trackId)!));
        s.enrollments[userId] = (s.enrollments[userId] ?? []).filter((e) => {
          const c = courses(s).find((x) => x.id === e.courseId);
          return !(closing.has(e.courseId) && c && isPaid(c) && e.source !== "free" && !keep.has(e.courseId));
        });
        for (const o of s.courseOrders) if (o.userId === userId && o.trackId === trackId && (o.status === "pending" || o.status === "granted")) Object.assign(o, { status: "cancelled", note: reason.trim() || o.note });
        save(s);
      },
      async listCourseOrders() {
        requireAdmin();
        const s = load();
        return s.courseOrders
          .map((o): AdminCourseOrder => {
            const u = s.users.find((x) => x.id === o.userId);
            const t = TRACKS.find((x) => x.id === o.trackId);
            return {
              ...o,
              studentName: u?.fullName ?? "Unknown",
              studentEmail: u?.email ?? "",
              courseTitle: t ? (t.programmeTitle ?? t.title) : (courses(s).find((c) => c.id === o.courseId)?.title ?? o.courseId ?? ""),
            };
          })
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },
      async grantCourseAccess(userId, courseId, note) {
        requireAdmin();
        const s = load();
        const course = courses(s).find((c) => c.id === courseId);
        if (!course) throw new BackendError("Course not found.");
        if (!s.users.some((u) => u.id === userId)) throw new BackendError("Student not found.");
        let order = s.courseOrders.find((o) => o.userId === userId && o.courseId === courseId && o.status === "pending");
        if (order) Object.assign(order, { status: "granted", note: note.trim() || null, paidAt: now() });
        else {
          order = { id: uid(), userId, courseId, trackId: null, currency: course.currency ?? "NGN", listAmount: course.price ?? 0, amount: 0, status: "granted", provider: null, providerRef: null, note: note.trim() || null, createdAt: now(), paidAt: now() };
          s.courseOrders.push(order);
        }
        const list = (s.enrollments[userId] ??= []);
        const have = list.find((e) => e.courseId === courseId);
        if (have) have.source = have.source === "free" && !isPaid(course) ? "free" : "granted";
        else list.push({ courseId, enrolledAt: now(), completedAt: null, lastLessonId: null, lastActiveAt: now(), source: isPaid(course) ? "granted" : "free" });
        save(s);
      },
      async revokeCourseAccess(userId, courseId, reason) {
        requireAdmin();
        const s = load();
        s.enrollments[userId] = (s.enrollments[userId] ?? []).filter((e) => e.courseId !== courseId);
        for (const o of s.courseOrders) if (o.userId === userId && o.courseId === courseId && (o.status === "pending" || o.status === "granted")) Object.assign(o, { status: "cancelled", note: reason.trim() || o.note });
        save(s);
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
      async deleteCredential(credentialId, _reason) {
        requireAdmin();
        const s = load();
        const c = s.credentials.find((x) => x.credentialId === credentialId.trim().toUpperCase());
        if (!c) throw new BackendError("Badge not found.");
        if (s.certificates.some((x) => x.credentialId === c.credentialId)) throw new BackendError("An official certificate was issued from this credential. Delete that certificate first.");
        if (s.orders.some((o) => o.credentialId === c.credentialId && (o.status === "paid" || o.status === "granted")))
          throw new BackendError("This credential has a paid or granted certificate order, which is kept as a payment record.");
        s.orders = s.orders.filter((o) => o.credentialId !== c.credentialId);
        s.credentials = s.credentials.filter((x) => x.id !== c.id);
        save(s);
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
        const s = load();
        return s.certificates
          .map((c) => adminCertificate(s, c))
          .filter((c) => matchesCertificate(c, search))
          .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt) || b.certificateId.localeCompare(a.certificateId));
      },
      async getCertificate(certificateId) {
        requireAdmin();
        const s = load();
        const c = s.certificates.find((x) => x.certificateId === certificateId.trim().toUpperCase());
        return c ? adminCertificate(s, c) : null;
      },
      async issueCertificate(input) {
        const u = requireAdmin();
        const s = load();
        const fields = certificateFields(s, input);
        s.certificateSeq += 1;
        const cert: Certificate = { ...blankCertificate(), ...fields, certificateId: certificateNumber(s.certificateSeq), source: "manual" };
        s.certificates.push(cert);
        logEvent(s, cert.certificateId, "issued", u, { recipient: cert.recipientName, title: cert.certificateTitle, training_type: cert.trainingType });
        save(s);
        return cert;
      },
      async updateCertificate(certificateId, edit) {
        const u = requireAdmin();
        const s = load();
        const c = s.certificates.find((x) => x.certificateId === certificateId);
        if (!c) throw new BackendError("Certificate not found.");
        if (c.status === "replaced") throw new BackendError("This certificate was replaced. Edit the replacement instead.");
        const email = edit.recipientEmail.trim().toLowerCase() || null;
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new BackendError("That email address doesn't look right.");
        const next = {
          recipientEmail: email,
          userId: c.source === "course" ? c.userId : edit.userId || null,
          courseId: c.source === "course" ? c.courseId : edit.courseId || null,
          templateId: edit.templateId,
        };
        const changes: Record<string, unknown> = {};
        if (next.recipientEmail !== (c.recipientEmail ?? null)) changes.recipient_email = [c.recipientEmail ?? null, next.recipientEmail];
        if (next.userId !== (c.userId ?? null)) changes.linked_account = [!!c.userId, !!next.userId];
        if (next.courseId !== (c.courseId ?? null)) changes.course = [c.courseId ?? null, next.courseId];
        if (next.templateId !== c.templateId) changes.template = [c.templateId, next.templateId];
        if (Object.keys(changes).length) {
          Object.assign(c, next, { updatedAt: now() });
          logEvent(s, c.certificateId, "edited", u, changes);
          save(s);
        }
        return normalise(c);
      },
      async reissueCertificate(certificateId, input, reason) {
        const u = requireAdmin();
        if (!reason.trim()) throw new BackendError("Say why the certificate is being reissued.");
        const s = load();
        const old = s.certificates.find((x) => x.certificateId === certificateId);
        if (!old) throw new BackendError("Certificate not found.");
        if (old.status === "replaced") throw new BackendError("This certificate was already replaced.");
        const fields = certificateFields(s, input);
        s.certificateSeq += 1;
        const o = normalise(old);
        const cert: Certificate = {
          ...blankCertificate(),
          ...fields,
          certificateId: certificateNumber(s.certificateSeq),
          source: o.source,
          credentialId: o.credentialId,
          userId: o.source === "course" ? o.userId : fields.userId ?? null,
          courseId: o.source === "course" ? o.courseId : fields.courseId ?? null,
          replacedCertificateId: o.certificateId,
        };
        Object.assign(old, { status: "replaced", updatedAt: now() });
        s.certificates.push(cert);
        logEvent(s, old.certificateId, "reissued", u, { replaced_by: cert.certificateId, reason: reason.trim() });
        logEvent(s, cert.certificateId, "issued", u, { replaces: old.certificateId, reason: reason.trim() });
        save(s);
        return cert;
      },
      async deleteCertificate(certificateId, _reason) {
        requireAdmin();
        const s = load();
        const c = s.certificates.find((x) => x.certificateId === certificateId.trim().toUpperCase());
        if (!c) throw new BackendError("Certificate not found.");
        s.certificates = s.certificates.filter((x) => x.id !== c.id).map((x) => (x.replacedCertificateId === c.certificateId ? { ...x, replacedCertificateId: null } : x));
        s.certificateEvents = s.certificateEvents.filter((e) => e.certificateId !== c.certificateId);
        save(s);
      },
      async revokeCertificate(certificateId, reason) {
        const u = requireAdmin();
        const s = load();
        const c = s.certificates.find((x) => x.certificateId === certificateId && x.status === "valid");
        if (!c) throw new BackendError("Only an active certificate can be revoked.");
        Object.assign(c, { status: "revoked", revokedAt: now(), revokedReason: reason.trim() || null, updatedAt: now() });
        logEvent(s, c.certificateId, "revoked", u, { reason: reason.trim() || null });
        save(s);
      },
      async listCertificateEvents(certificateId) {
        requireAdmin();
        return load()
          .certificateEvents.filter((e) => !certificateId || e.certificateId === certificateId)
          .sort((a, b) => b.id - a.id);
      },
      async listCertificateTemplates() {
        requireAdmin();
        return DEMO_TEMPLATES;
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
              courseTitle: o.trackId
                ? `Professional Programme: ${TRACKS.find((t) => t.id === o.trackId)?.programmeTitle ?? o.trackId}`
                : (courses(s).find((c) => c.id === o.courseId)?.title ?? o.courseId ?? ""),
              certificateId:
                s.certificates.find(
                  (c) => c.userId === o.userId && c.status === "valid" && c.source !== "manual" && (o.trackId ? c.trackId === o.trackId : c.courseId === o.courseId),
                )?.certificateId ?? null,
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
        const list = clone(prices(s)).filter((p) => !(p.kind === price.kind && p.currency === price.currency.toUpperCase()));
        list.push({ ...price, currency: price.currency.toUpperCase() });
        s.prices = list.sort((a, b) => a.kind.localeCompare(b.kind) || a.position - b.position);
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
