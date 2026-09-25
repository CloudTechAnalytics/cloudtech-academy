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
