/**
 * Lesson files are Markdown with a small front matter block and a few custom code fences:
 *
 *   ```sql run      an example the learner can run in the sandbox
 *   ```exercise     JSON: { id, prompt, starter?, solution, hint?, required?, orderMatters? }
 *   ```quiz         JSON: [{ prompt, options, answer, explanation? }]
 *   ```answer       JSON: a task done in Excel / Power BI / by hand, checked by its result (AnswerSpec)
 *   ```task         JSON: written work checked against rules, with a model answer (TaskSpec)
 *   ```dataset      JSON: { dataset, files?, note? } download card for a practice dataset
 *   ```live         a live HTML/CSS/JS editor with a preview: optional JSON header, then === html / === css / === js sections
 *   ```webtask      a web task checked on the code and the rendered page (WebTaskSpec): JSON header, then === sections
 *
 * Callouts use blockquotes starting with [!TIP], [!NOTE], [!WARNING] or [!BUSINESS].
 * These helpers are dependency-free so the same logic can be mirrored by build scripts.
 */
import type { AnswerSpec, DatasetBlock, ExerciseSpec, LiveSpec, QuizQuestion, TaskSpec, WebFiles, WebTaskSpec } from "@/content/types";

export function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const text = raw.replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i <= 0) continue;
    let value = line.slice(i + 1).trim();
    // YAML lets a value be quoted (needed when it contains a colon): drop the quotes.
    const q = value.match(/^"(.*)"$/) ?? value.match(/^'(.*)'$/);
    if (q) value = q[1].replace(/\\"/g, '"');
    meta[line.slice(0, i).trim()] = value;
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

export function parseTask(json: string): TaskSpec {
  const t = JSON.parse(json) as TaskSpec;
  if (!t.id || !t.prompt || !Array.isArray(t.rules) || !t.rules.length) throw new Error("A written task needs id, prompt and rules");
  return t;
}

export function extractTasks(body: string): TaskSpec[] {
  return fences(body, "task").map(parseTask);
}

/** Splits a web block into its JSON header (the text before the first === line) and its === sections. */
function webSections(text: string): { header: string; sections: Record<string, string> } {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const sections: Record<string, string[]> = {};
  const head: string[] = [];
  let current: string[] | null = null;
  for (const line of lines) {
    const m = line.match(/^===\s*(.+?)\s*$/);
    if (m) {
      current = sections[m[1].toLowerCase()] = [];
    } else if (current) current.push(line);
    else head.push(line);
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sections)) out[k] = v.join("\n").replace(/^\n+|\s+$/g, "");
  return { header: head.join("\n").trim(), sections: out };
}

const pickFiles = (sections: Record<string, string>, prefix = ""): WebFiles => {
  const files: WebFiles = {};
  for (const k of ["html", "css", "js"] as const) if (sections[prefix + k] !== undefined) files[k] = sections[prefix + k];
  return files;
};

export function parseWebTask(text: string): WebTaskSpec {
  const { header, sections } = webSections(text);
  const meta = JSON.parse(header || "{}") as Partial<WebTaskSpec>;
  const t = { ...meta, prompt: sections.prompt ?? "", note: sections.note, files: pickFiles(sections), sample: pickFiles(sections, "sample ") } as WebTaskSpec;
  if (!t.id || !t.prompt || !Array.isArray(t.rules) || !t.rules.length) throw new Error("A web task needs id, prompt and rules");
  if (!Object.keys(t.sample).length) throw new Error(`${t.id}: a web task needs a model answer (=== sample html, sample css or sample js)`);
  return t;
}

export function parseLive(text: string): LiveSpec {
  const { header, sections } = webSections(text);
  const meta = JSON.parse(header || "{}") as Partial<LiveSpec>;
  const files = Object.keys(sections).some((k) => ["html", "css", "js"].includes(k)) ? pickFiles(sections) : { html: text.trim() };
  return { ...meta, files };
}

export function extractWebTasks(body: string): WebTaskSpec[] {
  return fences(body, "webtask").map(parseWebTask);
}

/** IDs of every required practice task in a lesson: SQL exercises, answer tasks, written tasks and web tasks. */
export function requiredExerciseIds(body: string): string[] {
  return [...extractExercises(body), ...extractAnswers(body), ...extractTasks(body), ...extractWebTasks(body)].filter((e) => e.required).map((e) => e.id);
}
