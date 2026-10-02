import type { AnswerSpec } from "@/content/types";

/**
 * Reads a number the way people type it: "₦1,250,000", "1 250 000", "18.5%", "2.4m".
 * Returns null when it isn't a number.
 */
export function readNumber(input: string): { value: number; percent: boolean } | null {
  let s = input.trim().toLowerCase().replace(/\s+/g, "");
  if (!s) return null;
  const percent = s.endsWith("%");
  s = s.replace(/%$/, "").replace(/^(₦|ngn|n(?=\d))/, "").replace(/,/g, "");
  const m = s.match(/^(-?\d*\.?\d+)(k|m|bn|b)?$/);
  if (!m) return null;
  const mult = { k: 1e3, m: 1e6, b: 1e9, bn: 1e9 }[m[2] as "k"] ?? 1;
  return { value: Number(m[1]) * mult, percent };
}

export const normText = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.!]+$/, "")
    .replace(/^["'“”‘’]|["'“”‘’]$/g, "");

export const defaultTolerance = (answer: number) => (Number.isInteger(answer) ? 0.5 : 0.051);

/**
 * How far off a learner's answer may be and still count. Money is accepted when rounded
 * sensibly (₦16.6m for ₦16,646,820: within 0.5%), and percentages within half a point, so
 * nobody fails a task over rounding. Counts stay exact.
 */
export function leniency(spec: AnswerSpec & { answer: number }) {
  const exact = spec.tolerance ?? defaultTolerance(spec.answer);
  if (spec.format === "naira") return Math.max(exact, Math.abs(spec.answer) * 0.005);
  if (spec.format === "percent") return Math.max(exact, 0.5);
  return exact;
}

export type AnswerCheck = { correct: boolean; message: string };

export function checkAnswer(spec: AnswerSpec, input: string): AnswerCheck {
  if (!input.trim()) return { correct: false, message: "Type your answer first." };
  if (typeof spec.answer === "number") {
    const n = readNumber(input);
    if (!n) return { correct: false, message: "That doesn't look like a number. Type digits only, for example 1250000 or 18.5." };
    const tol = leniency(spec as AnswerSpec & { answer: number });
    const candidates = [n.value];
    // "0.185" for an answer of 18.5%.
    if (spec.format === "percent" && !n.percent && Math.abs(n.value) <= 1 && Math.abs(spec.answer) > 1) candidates.push(n.value * 100);
    if (candidates.some((v) => Math.abs(v - (spec.answer as number)) <= tol)) return { correct: true, message: "Correct." };
    const off = n.value - spec.answer;
    const close = Math.abs(off) <= Math.max(Math.abs(spec.answer) * 0.05, tol * 4);
    return {
      correct: false,
      message: close ? `Close, but not quite. Check your rounding and that you included every row the question asks for.` : `Not the expected result. Check which rows the question includes, then try again.`,
    };
  }
  const given = normText(input);
  const ok = [spec.answer, ...(spec.accept ?? [])].some((a) => normText(String(a)) === given);
  return ok ? { correct: true, message: "Correct." } : { correct: false, message: "Not the expected answer. Check the spelling, or look again at the data." };
}

export function formatAnswer(spec: AnswerSpec): string {
  const a = spec.answer;
  if (typeof a !== "number") return a;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (spec.format === "naira") return `₦${fmt(a)}`;
  if (spec.format === "percent") return `${fmt(a)}%`;
  return fmt(a);
}
