/**
 * Grading for practice project checks, shared by the site, the seed and the demo backend.
 *
 * The site turns what a learner typed into a plain value (a number, or normalised text) before sending it.
 * The seed stores each answer with its tolerance and accepted spellings already worked out, so the
 * database's grade_practice_check() only compares. gradeCheck() below is the same comparison, for demo mode.
 */
import type { ProjectCheck } from "@/content/projects";
import type { ProjectAnswer } from "@/content/project-answers";
import { leniency, normText, readNumber } from "./answers";

export type GradedCheck = { id: string; kind: "number" | "text"; answer: number | string; tol: number; percent: boolean; accept: string[] };

/** The answer key for one check, as stored in practice_projects.checks. */
export function gradingKey(check: ProjectCheck, a: ProjectAnswer): GradedCheck {
  if (typeof a.answer === "number") {
    const format = check.format === "text" ? "number" : check.format;
    return { id: check.id, kind: "number", answer: a.answer, tol: leniency({ id: check.id, prompt: check.prompt, answer: a.answer, tolerance: a.tolerance, format }), percent: format === "percent", accept: [] };
  }
  return { id: check.id, kind: "text", answer: a.answer, tol: 0, percent: false, accept: [...new Set([a.answer, ...(a.accept ?? [])].map(normText))] };
}

/** What the site sends for one answer: the number read from the input, or normalised text. Null if it can't be read. */
export function submittedValue(check: ProjectCheck, input: string): number | string | null {
  if (!input.trim()) return null;
  if (check.format === "text") return normText(input);
  return readNumber(input)?.value ?? null;
}

export function gradeCheck(g: GradedCheck, given: unknown): boolean {
  if (g.kind === "number") {
    if (typeof given !== "number" || !Number.isFinite(given)) return false;
    const a = g.answer as number;
    return Math.abs(given - a) <= g.tol || (g.percent && Math.abs(given) <= 1 && Math.abs(a) > 1 && Math.abs(given * 100 - a) <= g.tol);
  }
  return typeof given === "string" && g.accept.includes(given);
}

/** Checks a link the way the database does. */
export const isWorkUrl = (url: string) => /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(url.trim()) && url.trim().length <= 500;

export const SUMMARY_MIN = 50;
export const SUMMARY_MAX = 3000;
