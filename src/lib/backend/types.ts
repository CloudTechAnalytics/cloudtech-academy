import type { CourseSalesFields } from "@/content/catalog";
import type { AssessmentDef, AssessmentPublic, Course, Lesson, Module, ProjectDef } from "@/content/types";

export type Role = "student" | "admin";

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

export type Enrollment = {
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  lastLessonId: string | null;
  /** Last time the learner opened a lesson, completed something or took an assessment in this course. */
  lastActiveAt: string;
  /** How they got in: free enrolment, a payment, or an admin granting access. Paid courses are only reachable by the last two. */
  source: "free" | "purchase" | "granted";
};

/** A learner's order for a paid course or, when trackId is set, for a Professional Programme. */
export type CourseOrder = {
  id: string;
  courseId: string | null;
  trackId: string | null;
  currency: string;
  /** The price when the order was made. */
  listAmount: number;
  /** What is charged, after any discount. */
  amount: number;
  status: "pending" | "partial" | "paid" | "granted" | "failed" | "cancelled";
  createdAt: string;
  paidAt: string | null;
};

/** A place a learner can pay into: bank transfer details or another method. Admins manage these. */
export type PaymentAccount = {
  id: string;
  label: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  instructions: string | null;
  currency: string;
  active: boolean;
  position: number;
};

export type PaymentSettings = {
  /** "manual": learners pay into the Academy's account and an admin confirms. "paystack": card payment. */
  mode: "manual" | "paystack";
  /** Whether a receipt must be uploaded with each payment. */
  proofRequired: boolean;
  instructions: string | null;
};

export type PaymentStatus = "pending" | "submitted" | "confirmed" | "rejected";

/** One payment toward an order: the whole price, or one of two parts. */
export type OrderPayment = {
  id: string;
  orderId: string;
  part: 1 | 2;
  amount: number;
  currency: string;
  /** When this part falls due. Set for the second part once the first is confirmed. */
  dueAt: string | null;
  status: PaymentStatus;
  accountLabel: string | null;
  reference: string;
  payerName: string | null;
  paidOn: string | null;
  proofPath: string | null;
  note: string | null;
  rejectedReason: string | null;
  source: "student" | "admin";
  confirmedAt: string | null;
  createdAt: string;
};

export type ManualOrder = { order: CourseOrder; payments: OrderPayment[] };

export type AdminPayment = OrderPayment & {
  userId: string;
  fullName: string;
  email: string;
  courseId: string | null;
  trackId: string | null;
  targetTitle: string;
  orderStatus: CourseOrder["status"];
  orderAmount: number;
};

export type RegisterPaymentInput = {
  userId: string;
  kind: "course" | "programme";
  targetId: string;
  amount: number;
  method: string;
  reference: string;
  note: string;
  paidOn: string;
};

export type AdminCourseOrder = CourseOrder & {
  userId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  provider: string | null;
  providerRef: string | null;
  note: string | null;
};

/** Someone's place in a Professional Programme. */
export type ProgrammeEnrollment = {
  trackId: string;
  enrolledAt: string;
  source: "purchase" | "granted";
};

export type AdminProgrammeEnrollment = {
  userId: string;
  fullName: string;
  email: string;
  trackId: string;
  trackTitle: string;
  source: "purchase" | "granted";
  enrolledAt: string;
  completedAt: string | null;
  amount: number | null;
  currency: string | null;
  orderStatus: string | null;
};

export type ProgrammeStats = {
  trackId: string;
  title: string;
  published: boolean;
  price: number | null;
  currency: string;
  enrollments: number;
  paidEnrollments: number;
  grantedEnrollments: number;
  completions: number;
  revenue: Record<string, number>;
  /** Buyers who had taken a free course before buying. */
  converted: number;
};

export type AdminEnrollment = {
  userId: string;
  fullName: string;
  email: string;
  courseId: string;
  courseTitle: string;
  source: "free" | "purchase" | "granted";
  enrolledAt: string;
  completedAt: string | null;
  amount: number | null;
  currency: string | null;
  orderStatus: string | null;
};

export type CourseStats = {
  courseId: string;
  title: string;
  courseType: "free" | "professional";
  accessType: "free" | "paid";
  published: boolean;
  price: number | null;
  currency: string;
  enrollments: number;
  freeEnrollments: number;
  paidEnrollments: number;
  grantedEnrollments: number;
  completions: number;
  /** Revenue from paid orders, by currency. */
  revenue: Record<string, number>;
  /** For a paid course: buyers who had taken a free course first. For a free course: learners who later bought a paid course. */
  converted: number;
};

export type Progress = {
  completedLessons: string[];
  completedExercises: string[];
};

export type AttemptResult = {
  id: string;
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  submittedAt: string;
};

export type SubmissionStatus = "submitted" | "accepted" | "needs_changes";

export type ProjectSubmission = {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  url: string;
  status: SubmissionStatus;
  submittedAt: string;
  feedback: string | null;
};

export type CertificateStatus = "valid" | "revoked";

export type CredentialKind = "module_badge" | "course_completion" | "track_completion" | "project_badge";

/** A free credential: a module badge or a course completion badge. */
export type Credential = {
  id: string;
  credentialId: string;
  userId: string;
  kind: CredentialKind;
  /** The course it belongs to; empty for a track badge or a project badge. */
  courseId: string;
  /** The career track, for a track badge. */
  trackId: string | null;
  moduleId: string | null;
  /** The practice project, for project badges. */
  projectId?: string | null;
  /** Project badges: the learner's work, and whether an admin has reviewed it. */
  workUrl?: string | null;
  reviewed?: boolean;
  badgeName: string;
  courseTitle: string;
  moduleTitle: string | null;
  recipientName: string;
  skills: string[];
  issuedAt: string;
  status: CertificateStatus;
  revokedReason: string | null;
};

/** What anyone can see on a public credential page. No email or account details. */
export type PublicCredential = Pick<
  Credential,
  "credentialId" | "kind" | "badgeName" | "courseId" | "trackId" | "courseTitle" | "moduleTitle" | "recipientName" | "skills" | "issuedAt" | "status" | "projectId" | "workUrl" | "reviewed"
>;

/** A learner's submission for a practice project (/projects/:id). */
export type PracticeSubmission = {
  id: string;
  userId: string;
  projectId: string;
  workUrl: string;
  summary: string;
  /** What was sent for each check: a number, normalised text, or null. */
  answers: Record<string, number | string | null>;
  correct: number;
  total: number;
  /** Stays true once every answer has been right. */
  passed: boolean;
  attempts: number;
  submittedAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
};

/** The result of submitting: which checks were right (never the answers), and the badge if earned. */
export type PracticeResult = { passed: boolean; correct: number; total: number; results: Record<string, boolean>; credentialId: string | null };

export type AdminPracticeSubmission = PracticeSubmission & { learnerName: string; learnerEmail: string; projectTitle: string; credentialId: string | null };

/** valid: active. replaced: corrected by a reissue; the replacement is the valid one. */
export type OfficialCertificateStatus = "valid" | "revoked" | "replaced";

export type TrainingType = "academy_course" | "academy_programme" | "one_on_one" | "corporate" | "bootcamp" | "workshop" | "private" | "other";

export type CertificateType = "completion" | "participation" | "professional_training" | "achievement" | "workshop" | "professional_programme";

/**
 * An official certificate. source "course": the optional, paid certificate for a completed Academy
 * course. source "manual": issued by an admin for any CloudTech training, with or without an account.
 */
export type Certificate = {
  id: string;
  certificateId: string;
  source: "course" | "manual" | "programme";
  /** The course or track completion credential it certifies (course and programme certificates). */
  credentialId: string | null;
  /** The career track, for a Professional Programme certificate. */
  trackId: string | null;
  /** The recipient's Academy account, if they have one. */
  userId: string | null;
  courseId: string | null;
  recipientName: string;
  recipientEmail: string | null;
  /** e.g. "Data Analytics Professional Training". Course certificates may leave it empty. */
  certificateTitle: string | null;
  /** The course or programme name. */
  courseTitle: string;
  trainingType: TrainingType;
  certificateType: CertificateType;
  instructorName: string | null;
  /** Description or skills covered. */
  description: string | null;
  /** YYYY-MM-DD */
  startDate: string | null;
  completionDate: string | null;
  /** The issue date (stored as midday UTC on that date). */
  issuedAt: string;
  grade: string | null;
  duration: string | null;
  templateId: string;
  status: OfficialCertificateStatus;
  revokedAt: string | null;
  revokedReason: string | null;
  /** The certificate this one replaced, when it was reissued. */
  replacedCertificateId: string | null;
  updatedAt: string;
};

/** Admin list rows: who issued it (from the audit log) and what replaced it. */
export type AdminCertificate = Certificate & { issuedBy: string | null; replacedBy: string | null };

/** What anyone can see on the verification page: only what is printed on the certificate, and its status. */
export type PublicCertificate = Pick<
  Certificate,
  | "certificateId"
  | "credentialId"
  | "recipientName"
  | "certificateTitle"
  | "courseTitle"
  | "trainingType"
  | "certificateType"
  | "instructorName"
  | "description"
  | "startDate"
  | "completionDate"
  | "issuedAt"
  | "grade"
  | "duration"
  | "templateId"
  | "status"
  | "revokedAt"
> & { replacedBy: string | null };

/** What an admin enters to issue (or reissue) a certificate. The number is assigned by the server. */
export type CertificateInput = {
  recipientName: string;
  recipientEmail: string;
  /** Optional link to an Academy account. */
  userId: string;
  /** Optional link to an Academy course. */
  courseId: string;
  certificateTitle: string;
  programmeName: string;
  trainingType: TrainingType;
  certificateType: CertificateType;
  instructorName: string;
  description: string;
  startDate: string;
  completionDate: string;
  issueDate: string;
  grade: string;
  duration: string;
  templateId: string;
};

/** What can change without reissuing: nothing printed on the certificate. */
export type CertificateEdit = Pick<CertificateInput, "recipientEmail" | "userId" | "courseId" | "templateId">;

export type CertificateEventAction = "created" | "edited" | "issued" | "downloaded" | "revoked" | "reissued";

export type CertificateEvent = {
  id: number;
  certificateId: string;
  action: CertificateEventAction;
  actorName: string;
  details: Record<string, unknown>;
  createdAt: string;
};

export type CertificateTemplate = { id: string; name: string; description: string; active: boolean };

/** A learner's public skills profile settings. The page lives at /learners/<slug>. */
export type PublicProfileSettings = { isPublic: boolean; slug: string; headline: string };

/** What anyone can see on a public skills profile: valid badges and certificates only, never an email. */
export type PublicProfile = {
  slug: string;
  name: string;
  headline: string;
  memberSince: string;
  credentials: PublicCredential[];
  certificates: Pick<PublicCertificate, "certificateId" | "credentialId" | "recipientName" | "courseTitle" | "issuedAt" | "status">[];
};

/** What a certificate costs: course certificates and Professional Programme certificates are priced separately. */
export type CertificateKind = "course" | "programme";

export type CertificatePrice = { kind: CertificateKind; currency: string; amount: number; active: boolean; position: number };

export type OrderStatus = "pending" | "paid" | "granted" | "failed" | "cancelled";

export type CertificateOrder = {
  id: string;
  userId: string;
  /** Set for a course certificate order; trackId is set for a programme order. */
  courseId: string | null;
  trackId: string | null;
  credentialId: string;
  currency: string;
  amount: number;
  status: OrderStatus;
  provider: string | null;
  providerRef: string | null;
  note: string | null;
  createdAt: string;
  paidAt: string | null;
};

export type AdminOrder = CertificateOrder & { learnerName: string; learnerEmail: string; courseTitle: string; certificateId: string | null };

/* ---------------------------------------------------------------- community and events */

/** The Academy's WhatsApp community, controlled by admins. */
export type CommunitySettings = {
  name: string;
  description: string;
  /** Null until an admin adds one; the community can't be switched on without it. */
  whatsappUrl: string | null;
  welcomeMessage: string;
  buttonText: string;
  isActive: boolean;
};

/** What learners and visitors get: only while the community is active. */
export type PublicCommunity = Omit<CommunitySettings, "isActive" | "whatsappUrl"> & { whatsappUrl: string };

/** Where a Community button was pressed, for the lightweight click count. */
export type CommunitySource = "homepage" | "welcome" | "dashboard" | "community_page" | "navbar" | "events" | "event_page" | "sign_up";

export type EventType =
  | "workshop"
  | "webinar"
  | "seminar"
  | "community_day"
  | "practical_session"
  | "bootcamp"
  | "masterclass"
  | "career_session"
  | "guest_session"
  | "networking"
  | "competition"
  | "conference"
  | "training"
  | "other";

export type EventFormat = "online" | "physical" | "hybrid";

export type EventStatus = "draft" | "published" | "registration_open" | "registration_closed" | "completed" | "cancelled";

/** An Academy event. Only title, date and start time are needed; everything else is optional. */
export type AcademyEvent = {
  id: string;
  slug: string;
  title: string;
  eventType: EventType;
  shortDescription: string | null;
  description: string | null;
  /** "What attendees will learn", one point each. */
  learnPoints: string[];
  coverImage: string | null;
  /** ISO instant (UTC). Shown in the event's own time zone. */
  startDatetime: string;
  endDatetime: string | null;
  timezone: string;
  venue: string | null;
  format: EventFormat;
  meetingUrl: string | null;
  registrationUrl: string | null;
  /** The event's own WhatsApp link. It never falls back to the main community link. */
  whatsappUrl: string | null;
  speakerName: string | null;
  speakerTitle: string | null;
  speakerImage: string | null;
  maxParticipants: number | null;
  registrationRequired: boolean;
  status: EventStatus;
  isFeatured: boolean;
  /** Groups recurring events, e.g. "community-day". */
  series: string | null;
  /** How many people are registered (everyone can see the count, never who). */
  registeredCount: number;
  createdAt: string;
  updatedAt: string;
};

/** What an admin enters. The id is set when editing. */
export type EventInput = Omit<AcademyEvent, "id" | "registeredCount" | "createdAt" | "updatedAt"> & { id?: string };

export type AttendanceStatus = "registered" | "attended" | "did_not_attend";

export type EventRegistration = {
  id: string;
  eventId: string;
  userId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  registrationStatus: "registered" | "cancelled";
  attendanceStatus: AttendanceStatus;
  registeredAt: string;
  attendedAt: string | null;
};

export type CommunityStats = {
  clicksTotal: number;
  clicks30d: number;
  upcomingEvents: number;
  registrationsTotal: number;
  registrationsUpcoming: number;
  clickSources: { source: string; clicks: number }[];
};

/** A recent registration, with the event it was for. */
export type RecentRegistration = EventRegistration & { eventTitle: string };

export type StudentSummary = {
  userId: string;
  fullName: string;
  email: string;
  joinedAt: string;
  enrollments: number;
  completedCourses: number;
  certificates: number;
  lessonsCompleted: number;
  /** Valid credentials: module badges and course completions. */
  badges: number;
  /** The latest enrolment, lesson, exercise or assessment; null if they haven't started. */
  lastActiveAt: string | null;
};

export type StudentDetail = {
  summary: StudentSummary;
  courses: { courseId: string; courseTitle: string; enrolledAt: string; completedLessons: number; totalLessons: number; completedAt: string | null }[];
  credentials: Credential[];
};

export type AdminSubmission = ProjectSubmission & { studentName: string; projectTitle: string };

export type CourseInput = Omit<Course, "modules">;
export type ModuleInput = Omit<Module, "lessons">;
export type LessonInput = Omit<Lesson, "requiredExercises">;

export interface Backend {
  readonly mode: "supabase" | "demo";

  /* ---------- accounts ---------- */
  getUser(): Promise<User | null>;
  onAuthChange(callback: (user: User | null) => void): () => void;
  signUp(input: { fullName: string; email: string; password: string }): Promise<{ needsConfirmation: boolean }>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  updateProfile(input: { fullName: string }): Promise<void>;
  getPublicProfileSettings(): Promise<PublicProfileSettings>;
  savePublicProfileSettings(input: PublicProfileSettings): Promise<void>;
  /** A learner's public page, or null if it doesn't exist or is switched off. */
  getPublicProfile(slug: string): Promise<PublicProfile | null>;

  /* ---------- content ---------- */
  listCourses(opts?: { includeUnpublished?: boolean }): Promise<Course[]>;
  getCourse(slug: string, opts?: { includeUnpublished?: boolean }): Promise<Course | null>;
  /** The course's final assessment, or a module's check when moduleId is given. */
  getAssessment(courseId: string, moduleId?: string): Promise<AssessmentPublic | null>;
  getProject(courseId: string): Promise<ProjectDef | null>;

  /* ---------- learning ---------- */
  listEnrollments(): Promise<Enrollment[]>;
  enroll(courseId: string): Promise<void>;
  setLastLesson(courseId: string, lessonId: string): Promise<void>;
  /** Removes a course from My Learning. Its progress is cleared unless the course is complete; badges stay. */
  removeCourse(courseId: string): Promise<void>;
  /** Starts over unfinished courses untouched for 14 days. Returns the ids of courses whose progress was cleared. */
  applyInactivityResets(): Promise<string[]>;
  getProgress(courseId: string): Promise<Progress>;
  setLessonComplete(courseId: string, lessonId: string, done: boolean): Promise<void>;
  recordExercise(courseId: string, lessonId: string, exerciseId: string): Promise<void>;
  submitAssessment(assessmentId: string, answers: Record<string, number>): Promise<AttemptResult>;
  listAttempts(assessmentId: string): Promise<AttemptResult[]>;
  getSubmission(projectId: string): Promise<ProjectSubmission | null>;
  submitProject(projectId: string, input: { content: string; url: string }): Promise<ProjectSubmission>;

  /* ---------- buying a course ---------- */
  /** Starts (or refreshes) the learner's pending order for a paid course, at today's price. */
  startCourseOrder(courseId: string): Promise<CourseOrder>;
  listMyCourseOrders(): Promise<CourseOrder[]>;
  /** Demo mode only: stands in for a successful payment, and enrols the learner. */
  simulateCoursePayment?(orderId: string): Promise<void>;
  /** Online payment: the provider's payment page for a pending course order. */
  startCourseCheckout?(orderId: string, returnUrl: string): Promise<string>;
  /** Online payment: confirms a payment on the server after the learner returns, and enrols them. Returns what was bought. */
  confirmCoursePayment?(reference: string): Promise<{ courseId: string | null; trackId: string | null }>;

  /* ---------- manual payments ---------- */
  getPaymentSettings(): Promise<PaymentSettings>;
  /** The accounts a learner can pay into (active ones). */
  listPaymentAccounts(): Promise<PaymentAccount[]>;
  /** Starts the learner's order for a course or programme and its payment parts. plan "two_part" is for programmes that allow instalments. */
  startManualOrder(kind: "course" | "programme", id: string, plan: "full" | "two_part"): Promise<ManualOrder>;
  /** The learner's orders that have payments, newest first. */
  listMyManualOrders(): Promise<ManualOrder[]>;
  /** Tells the Academy a part has been paid: which account, who paid, when, and a receipt. An admin confirms it. */
  submitPayment(input: { paymentId: string; accountId: string; payerName: string; paidOn: string; note: string; proof?: File | null }): Promise<void>;

  /* ---------- Professional Programmes ---------- */
  /** What admins have set for each programme: access, price, discount, delivery, enrolment window and sales content. Keyed by track id. */
  listProgrammeSales(): Promise<Record<string, CourseSalesFields>>;
  /** The programmes the signed-in learner holds. */
  listMyProgrammes(): Promise<ProgrammeEnrollment[]>;
  /** Starts (or refreshes) the learner's pending order for a programme, at today's price. */
  startProgrammePurchase(trackId: string): Promise<CourseOrder>;
  /** The official programme certificate, included for programme holders who have earned the programme badge. */
  claimProgrammeCertificate(trackId: string): Promise<Certificate>;

  /* ---------- credentials (free) ---------- */
  /** Awards (or returns) a module's badge. The server checks the module check was passed. */
  claimModuleBadge(moduleId: string): Promise<Credential>;
  /** Issues (or returns) the course completion credential. The server checks every requirement. */
  issueCourseCredential(courseId: string): Promise<Credential>;
  /** Issues (or returns) a career track's badge. The server checks every required course is complete. */
  issueTrackCredential(trackId: string): Promise<Credential>;
  listMyCredentials(): Promise<Credential[]>;
  verifyCredential(credentialId: string): Promise<PublicCredential | null>;

  /* ---------- practice projects ---------- */
  getPracticeSubmission(projectId: string): Promise<PracticeSubmission | null>;
  listMyPracticeSubmissions(): Promise<PracticeSubmission[]>;
  /** Saves the work, grades the checks on the server, and issues the project badge when every answer is right. */
  submitPracticeProject(input: { projectId: string; workUrl: string; summary: string; answers: Record<string, number | string | null> }): Promise<PracticeResult>;

  /* ---------- official certificate (optional, paid) ---------- */
  listCertificatePrices(kind?: CertificateKind): Promise<CertificatePrice[]>;
  /** Starts (or reuses) an order. The course must be complete. */
  startCertificateOrder(courseId: string, currency: string): Promise<CertificateOrder>;
  /** Starts (or reuses) an order for a Professional Programme certificate. The programme badge must be held first. */
  startProgrammeOrder(trackId: string, currency: string): Promise<CertificateOrder>;
  listMyOrders(): Promise<CertificateOrder[]>;
  /** Whether online payment is switched on. Until it is, admins grant certificates by hand. */
  readonly paymentsEnabled: boolean;
  /** Demo mode only: stands in for a successful payment so the flow can be tried. */
  simulatePayment?(orderId: string): Promise<Certificate>;
  /** Online payment: returns the provider's payment page for a pending order. */
  startCheckout?(orderId: string, returnUrl: string): Promise<string>;
  /** Online payment: confirms a payment on the server after the learner returns, and issues the certificate. */
  confirmPayment?(reference: string): Promise<Certificate>;
  listMyCertificates(): Promise<Certificate[]>;
  getMyCertificate(certificateId: string): Promise<Certificate | null>;
  verifyCertificate(certificateId: string): Promise<PublicCertificate | null>;
  /** Records a download in the certificate's audit log (admins, and the certificate's owner). */
  recordCertificateDownload(certificateId: string): Promise<void>;

  /* ---------- community and events ---------- */
  /** The community's wording and WhatsApp link, or null while it's switched off or not set up. */
  getCommunity(): Promise<PublicCommunity | null>;
  /** Counts a press of a Community button. Never blocks the button. */
  trackCommunityClick(source: CommunitySource): Promise<void>;
  /** Every event that isn't a draft, soonest first. */
  listEvents(): Promise<AcademyEvent[]>;
  getEvent(slug: string): Promise<AcademyEvent | null>;
  /** Registers for an event. Anyone can; a signed-in learner's account is linked automatically. Registering twice returns the same registration. */
  registerForEvent(eventId: string, input: { fullName: string; email: string; phone: string }): Promise<EventRegistration>;
  /**
   * The event's meeting link. Events open to everyone show it on the page; for events that need registration it's
   * revealed only to people who registered: by their account, or straight after registering, by the email they used.
   */
  revealEventLink(eventId: string, email?: string): Promise<string | null>;
  listMyRegistrations(): Promise<EventRegistration[]>;
  cancelMyRegistration(eventId: string): Promise<void>;

  /* ---------- admin ---------- */
  admin: {
    /** The community settings as saved, including while inactive. */
    getCommunitySettings(): Promise<CommunitySettings>;
    saveCommunitySettings(settings: CommunitySettings): Promise<void>;
    communityStats(): Promise<CommunityStats>;
    recentRegistrations(limit?: number): Promise<RecentRegistration[]>;
    /** Every event, drafts included, soonest first. */
    listAllEvents(): Promise<AcademyEvent[]>;
    getEventById(id: string): Promise<AcademyEvent | null>;
    /** Creates the event, or updates it when input.id is set. */
    saveEvent(input: EventInput): Promise<AcademyEvent>;
    setEventStatus(id: string, status: EventStatus): Promise<void>;
    /** A new draft with the same details. */
    duplicateEvent(id: string): Promise<AcademyEvent>;
    /** Permanently deletes the event and its registrations. */
    deleteEvent(id: string): Promise<void>;
    listRegistrations(eventId: string): Promise<EventRegistration[]>;
    setAttendance(registrationId: string, status: AttendanceStatus): Promise<void>;
    /** Uploads a cover or speaker image (PNG, JPEG or WebP, up to 2 MB) and returns its public URL. */
    uploadEventImage(file: File): Promise<string>;
    saveCourse(course: CourseInput): Promise<void>;
    /** One row per course: enrolments by source, completions, revenue and conversion. */
    listCourseStats(): Promise<CourseStats[]>;
    saveProgramme(trackId: string, sales: CourseSalesFields): Promise<void>;
    listPayments(): Promise<AdminPayment[]>;
    confirmPayment(paymentId: string, note: string): Promise<void>;
    rejectPayment(paymentId: string, reason: string): Promise<void>;
    registerPayment(input: RegisterPaymentInput): Promise<void>;
    updatePayment(paymentId: string, patch: { amount: number; status: PaymentStatus; method: string; note: string; paidOn: string | null }): Promise<void>;
    deletePayment(paymentId: string): Promise<void>;
    listAllPaymentAccounts(): Promise<PaymentAccount[]>;
    savePaymentAccount(account: Omit<PaymentAccount, "id" | "position"> & { id?: string }): Promise<void>;
    deletePaymentAccount(id: string): Promise<void>;
    savePaymentSettings(settings: PaymentSettings): Promise<void>;
    /** A short-lived link to a receipt, or null when there is none to open. */
    proofUrl(path: string): Promise<string | null>;
    listProgrammeStats(): Promise<ProgrammeStats[]>;
    listProgrammeEnrollments(trackId?: string): Promise<AdminProgrammeEnrollment[]>;
    grantProgrammeAccess(userId: string, trackId: string, note: string): Promise<void>;
    revokeProgrammeAccess(userId: string, trackId: string, reason: string): Promise<void>;
    listCourseEnrollments(courseId?: string): Promise<AdminEnrollment[]>;
    listCourseOrders(): Promise<AdminCourseOrder[]>;
    /** Gives a student access to a course without a payment (e.g. after a bank transfer, or a scholarship). */
    grantCourseAccess(userId: string, courseId: string, note: string): Promise<void>;
    /** Removes a student's access to a course. */
    revokeCourseAccess(userId: string, courseId: string, reason: string): Promise<void>;
    saveModule(module: ModuleInput): Promise<void>;
    deleteModule(moduleId: string): Promise<void>;
    reorderModules(courseId: string, moduleIds: string[]): Promise<void>;
    saveLesson(lesson: LessonInput): Promise<void>;
    deleteLesson(lessonId: string): Promise<void>;
    getAssessment(courseId: string, moduleId?: string): Promise<AssessmentDef | null>;
    saveAssessment(assessment: AssessmentDef): Promise<void>;
    listStudents(): Promise<StudentSummary[]>;
    getStudent(userId: string): Promise<StudentDetail | null>;
    listCredentials(search?: string): Promise<Credential[]>;
    revokeCredential(id: string, reason: string): Promise<void>;
    /** Permanently deletes a badge. Blocked while an official certificate was issued from it. The deletion is logged. */
    deleteCredential(credentialId: string, reason: string): Promise<void>;
    /** Every certificate, newest first; filter with the search text (name, email, title or number). */
    listCertificates(search?: string): Promise<AdminCertificate[]>;
    getCertificate(certificateId: string): Promise<AdminCertificate | null>;
    /** Issues a certificate; the server assigns its number. */
    issueCertificate(input: CertificateInput): Promise<Certificate>;
    /** Changes what isn't printed: email, linked account and course, template. */
    updateCertificate(certificateId: string, edit: CertificateEdit): Promise<Certificate>;
    /** Replaces a certificate with a corrected one under a new number. The original is kept as "replaced". */
    reissueCertificate(certificateId: string, input: CertificateInput, reason: string): Promise<Certificate>;
    revokeCertificate(certificateId: string, reason: string): Promise<void>;
    /** Permanently deletes a certificate and its activity log. Its public page then says "not found". The deletion is logged. */
    deleteCertificate(certificateId: string, reason: string): Promise<void>;
    listCertificateEvents(certificateId?: string): Promise<CertificateEvent[]>;
    listCertificateTemplates(): Promise<CertificateTemplate[]>;
    listOrders(): Promise<AdminOrder[]>;
    listPracticeSubmissions(): Promise<AdminPracticeSubmission[]>;
    /** Marks the work "Reviewed by CloudTech" (or removes the mark), with an optional note to the learner. */
    reviewPracticeSubmission(id: string, reviewed: boolean, note: string): Promise<void>;
    grantCertificate(orderId: string, note: string): Promise<Certificate>;
    /** Every price, including ones switched off. */
    listPrices(): Promise<CertificatePrice[]>;
    savePrice(price: CertificatePrice): Promise<void>;
    listSubmissions(): Promise<AdminSubmission[]>;
    reviewSubmission(submissionId: string, status: SubmissionStatus, feedback: string): Promise<void>;
  };
}

/** Friendly error the UI can show as-is. */
export class BackendError extends Error {}
