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

export type CredentialKind = "module_badge" | "course_completion";

/** A free credential: a module badge or a course completion badge. */
export type Credential = {
  id: string;
  credentialId: string;
  userId: string;
  kind: CredentialKind;
  courseId: string;
  moduleId: string | null;
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
  "credentialId" | "kind" | "badgeName" | "courseId" | "courseTitle" | "moduleTitle" | "recipientName" | "skills" | "issuedAt" | "status"
>;

/** The optional, paid official certificate for a completed course. */
export type Certificate = {
  id: string;
  certificateId: string;
  /** The course completion credential it certifies. */
  credentialId: string;
  userId: string;
  courseId: string;
  recipientName: string;
  courseTitle: string;
  issuedAt: string;
  status: CertificateStatus;
  revokedReason: string | null;
};

export type PublicCertificate = Pick<Certificate, "certificateId" | "credentialId" | "recipientName" | "courseTitle" | "issuedAt" | "status">;

export type CertificatePrice = { currency: string; amount: number; active: boolean; position: number };

export type OrderStatus = "pending" | "paid" | "granted" | "failed" | "cancelled";

export type CertificateOrder = {
  id: string;
  userId: string;
  courseId: string;
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
  getProgress(courseId: string): Promise<Progress>;
  setLessonComplete(courseId: string, lessonId: string, done: boolean): Promise<void>;
  recordExercise(courseId: string, lessonId: string, exerciseId: string): Promise<void>;
  submitAssessment(assessmentId: string, answers: Record<string, number>): Promise<AttemptResult>;
  listAttempts(assessmentId: string): Promise<AttemptResult[]>;
  getSubmission(projectId: string): Promise<ProjectSubmission | null>;
  submitProject(projectId: string, input: { content: string; url: string }): Promise<ProjectSubmission>;

  /* ---------- credentials (free) ---------- */
  /** Awards (or returns) a module's badge. The server checks the module check was passed. */
  claimModuleBadge(moduleId: string): Promise<Credential>;
  /** Issues (or returns) the course completion credential. The server checks every requirement. */
  issueCourseCredential(courseId: string): Promise<Credential>;
  listMyCredentials(): Promise<Credential[]>;
  verifyCredential(credentialId: string): Promise<PublicCredential | null>;

  /* ---------- official certificate (optional, paid) ---------- */
  listCertificatePrices(): Promise<CertificatePrice[]>;
  /** Starts (or reuses) an order. The course must be complete. */
  startCertificateOrder(courseId: string, currency: string): Promise<CertificateOrder>;
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

  /* ---------- admin ---------- */
  admin: {
    saveCourse(course: CourseInput): Promise<void>;
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
    listCertificates(search?: string): Promise<Certificate[]>;
    revokeCertificate(id: string, reason: string): Promise<void>;
    listOrders(): Promise<AdminOrder[]>;
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
