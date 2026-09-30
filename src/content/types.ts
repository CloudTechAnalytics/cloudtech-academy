import type { CourseDef, Difficulty, CourseStatus, CertificateRules } from "./catalog";

export type { CourseDef, Difficulty, CourseStatus, CertificateRules };

export type AssessmentQuestionDef = {
  id: string;
  prompt: string;
  options: string[];
  /** Index of the correct option. Never sent to the browser in Supabase mode. */
  answer: number;
  explanation?: string;
};

export type AssessmentDef = {
  id: string;
  courseId: string;
  /** "module" checks a single module and awards its badge; "final" is the course assessment. Default "final". */
  kind?: "module" | "final";
  moduleId?: string;
  title: string;
  passingScore: number;
  questions: AssessmentQuestionDef[];
};

export type ProjectDef = {
  id: string;
  courseId: string;
  title: string;
  required: boolean;
  summary: string;
  brief: string;
  tasks: string[];
  datasets: string[];
};

/* ---------- runtime content model (what pages render) ---------- */

export type Lesson = {
  id: string;
  courseId: string;
  moduleId: string;
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  body: string;
  required: boolean;
  published: boolean;
  position: number;
  /** IDs of required exercises in the lesson body, extracted when content is loaded. */
  requiredExercises: string[];
};

export type Module = {
  id: string;
  courseId: string;
  title: string;
  position: number;
  lessons: Lesson[];
  /** Badge awarded for passing this module's check, if any. */
  badge: string | null;
  badgeCode: string | null;
  skills: string[];
};

export type Course = Omit<CourseDef, "modules"> & {
  published: boolean;
  position: number;
  modules: Module[];
};

/** Assessment as the student sees it: no answers. */
export type AssessmentPublic = {
  id: string;
  courseId: string;
  kind: "module" | "final";
  moduleId: string | null;
  title: string;
  passingScore: number;
  questions: { id: string; prompt: string; options: string[] }[];
};

export type ExerciseSpec = {
  id: string;
  prompt: string;
  starter?: string;
  solution: string;
  hint?: string;
  required?: boolean;
  orderMatters?: boolean;
};

export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation?: string;
};

/**
 * A practice task done outside the browser (Excel, Google Sheets, Power BI, or by hand):
 * the learner works out a result and types it in to check it.
 */
export type AnswerSpec = {
  id: string;
  prompt: string;
  /** The expected result: a number, or a short text answer. */
  answer: number | string;
  /** Other text answers that also count as correct. */
  accept?: string[];
  /** How far a numeric answer may be from `answer`. Defaults to 0.5 for whole numbers, 0.051 otherwise. */
  tolerance?: number;
  /** How to show the expected answer. */
  format?: "number" | "naira" | "percent" | "text";
  hint?: string;
  /** Shown once the task is solved or the answer is revealed. */
  explanation?: string;
  required?: boolean;
  /** Dataset the task uses (public/datasets/<dataset>), for the download links. */
  dataset?: string;
  files?: string[];
  /** SQL over the CSV files that reproduces `answer`. Run by npm run test:content, never in the browser. */
  verify?: string;
};

/** Download card for a practice dataset: ```dataset {"dataset": "sales", "files": ["orders"]} */
export type DatasetBlock = { dataset: string; files?: string[]; note?: string };
