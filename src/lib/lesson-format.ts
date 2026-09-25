/**
 * Lesson files are Markdown with a small front matter block and a few custom code fences:
 *
 *   ```sql run      an example the learner can run in the sandbox
 *   ```exercise     JSON: { id, prompt, starter?, solution, hint?, required?, orderMatters? }
 *   ```quiz         JSON: [{ prompt, options, answer, explanation? }]
 *   ```answer       JSON: a task done in Excel / Power BI / by hand, checked by its result (AnswerSpec)
 *   ```dataset      JSON: { dataset, files?, note? } download card for a practice dataset
 *
 * Callouts use blockquotes starting with [!TIP], [!NOTE], [!WARNING] or [!BUSINESS].
 * These helpers are dependency-free so the same logic can be mirrored by build scripts.
 */
import type { AnswerSpec, DatasetBlock, ExerciseSpec, QuizQuestion } from "@/content/types";

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

export function parseAnswer(json: string): AnswerSpec {
  const a = JSON.parse(json) as AnswerSpec;
  if (!a.id || !a.prompt || a.answer === undefined || a.answer === "") throw new Error("An answer task needs id, prompt and answer");
  return a;
}

export function parseDataset(json: string): DatasetBlock {
  const d = JSON.parse(json) as DatasetBlock;
  if (!d.dataset) throw new Error("A dataset block needs a dataset");
  return d;
}

export function extractAnswers(body: string): AnswerSpec[] {
  return fences(body, "answer").map(parseAnswer);
}

/** IDs of every required practice task in a lesson: SQL exercises and answer tasks. */
export function requiredExerciseIds(body: string): string[] {
  return [...extractExercises(body), ...extractAnswers(body)].filter((e) => e.required).map((e) => e.id);
}
