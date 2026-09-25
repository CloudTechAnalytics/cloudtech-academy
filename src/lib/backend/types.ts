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

export type Certificate = {
  id: string;
  credentialId: string;
  userId: string;
  courseId: string;
  recipientName: string;
  courseTitle: string;
  issuedAt: string;
  status: CertificateStatus;
  revokedReason: string | null;
};

/** What anyone can see when verifying a credential. No email or account details. */
export type PublicCertificate = Pick<Certificate, "credentialId" | "recipientName" | "courseTitle" | "issuedAt" | "status">;

export type StudentSummary = {
  userId: string;
  fullName: string;
  email: string;
  joinedAt: string;
  enrollments: number;
  completedCourses: number;
  certificates: number;
};

export type StudentDetail = {
  summary: StudentSummary;
  courses: { courseId: string; courseTitle: string; enrolledAt: string; completedLessons: number; totalLessons: number; completedAt: string | null }[];
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
  getAssessment(courseId: string): Promise<AssessmentPublic | null>;
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

  /* ---------- certificates ---------- */
  /** Issues (or returns the existing) certificate. The server checks every requirement. */
  issueCertificate(courseId: string): Promise<Certificate>;
  listMyCertificates(): Promise<Certificate[]>;
  getMyCertificate(credentialId: string): Promise<Certificate | null>;
  verifyCertificate(credentialId: string): Promise<PublicCertificate | null>;

  /* ---------- admin ---------- */
  admin: {
    saveCourse(course: CourseInput): Promise<void>;
    saveModule(module: ModuleInput): Promise<void>;
    deleteModule(moduleId: string): Promise<void>;
    reorderModules(courseId: string, moduleIds: string[]): Promise<void>;
    saveLesson(lesson: LessonInput): Promise<void>;
    deleteLesson(lessonId: string): Promise<void>;
    getAssessment(courseId: string): Promise<AssessmentDef | null>;
    saveAssessment(assessment: AssessmentDef): Promise<void>;
    listStudents(): Promise<StudentSummary[]>;
    getStudent(userId: string): Promise<StudentDetail | null>;
    listCertificates(search?: string): Promise<Certificate[]>;
    revokeCertificate(certificateId: string, reason: string): Promise<void>;
    listSubmissions(): Promise<AdminSubmission[]>;
    reviewSubmission(submissionId: string, status: SubmissionStatus, feedback: string): Promise<void>;
  };
}

/** Friendly error the UI can show as-is. */
export class BackendError extends Error {}
