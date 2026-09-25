/**
 * Lesson files are Markdown with a small front matter block and a few custom code fences:
 *
 *   ```sql run      an example the learner can run in the sandbox
 *   ```exercise     JSON: { id, prompt, starter?, solution, hint?, required?, orderMatters? }
 *   ```quiz         JSON: [{ prompt, options, answer, explanation? }]
 *
 * Callouts use blockquotes starting with [!TIP], [!NOTE], [!WARNING] or [!BUSINESS].
 * These helpers are dependency-free so the same logic can be mirrored by build scripts.
 */
import type { ExerciseSpec, QuizQuestion } from "@/content/types";

export function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const text = raw.replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: text.slice(m[0].length) };
}

function fences(body: string, lang: string): string[] {
  const re = new RegExp("```" + lang + "\\s*\\n([\\s\\S]*?)\\n```", "g");
  return [...body.matchAll(re)].map((m) => m[1]);
}

export function parseExercise(json: string): ExerciseSpec {
  const e = JSON.parse(json) as ExerciseSpec;
  if (!e.id || !e.prompt || !e.solution) throw new Error("An exercise needs id, prompt and solution");
  return e;
}

export function parseQuiz(json: string): QuizQuestion[] {
  const q = JSON.parse(json) as QuizQuestion[];
  if (!Array.isArray(q)) throw new Error("A quiz must be a JSON array of questions");
  return q;
}

export function extractExercises(body: string): ExerciseSpec[] {
  return fences(body, "exercise").map(parseExercise);
}

export function extractQuizzes(body: string): QuizQuestion[][] {
  return fences(body, "quiz").map(parseQuiz);
}
