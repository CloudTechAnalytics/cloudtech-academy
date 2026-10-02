// Checks every lesson in every course:
// - front matter and the standard sections are present, JSON blocks parse
// - every ```sql run example and SQL exercise solution runs against the practice database
// - every ```answer task that uses a dataset has a `verify` query, and that query, run over
//   the exact CSV files learners download, reproduces the expected answer
// - every ```task (written work) has rules that compile, rejects an empty answer, and has a
//   model answer that passes its own rules
// - lesson length is honest: the minutes in the front matter match the reading time plus
//   the time the tasks take
// - quiz answers point at a real option, IDs are unique
// - each course's assessment and project are well formed
// - practice projects: every CSV column is described, dataset-meta.json is up to date,
//   links point at real courses and datasets, and every SQL starter runs
// Run: npm run test:content
import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { openDataset, query } from "./lib/csv-db.mjs";
import { parseCsv } from "./lib/csv-parse.mjs";
import { checkTask } from "../src/lib/task-check.ts";
import { lessonTime, roundMinutes, timingOk } from "./lib/lesson-time.mjs";

const SQL = await initSqlJs();
const IMAGE_SIZES = JSON.parse(fs.readFileSync("src/content/image-sizes.json", "utf8"));
const logistics = new SQL.Database(fs.readFileSync("public/datasets/logistics.sqlite"));
const CONTENT = "src/content";
const FULL = ["sql", "daf", "excel", "powerbi", "modelling", "python-analytics", "statistics", "advanced-sql", "dax", "capstone", "ba", "agile-ba", "process", "ml", "features", "experiments", "forecasting", "genai", "agents", "llmops", "cloud", "linux", "terraform", "cicd", "observability", "swe", "dbapi"];
/** Short courses: one lesson per module, a module check each, and a final assessment. */
const SHORT = [
  "ai-productivity",
  "design-content",
  "career",
  "ai-students",
  "research",
  "portfolio",
  "git",
  "web",
  "python",
  "python-data",
  "digital",
  "internship",
  "freelancing",
];
const COURSES = [...FULL, ...SHORT];
const SECTIONS = ["## The problem", "## The concept", "## Example", "## Walkthrough", "## Practice", "## Check your understanding"];
/** A long, awkward answer for timing task patterns: bullets, stars, hashes, colons, digits and long lines. */
const STRESS_TEXT = Array.from({ length: 120 }, (_, i) => `${i % 3 ? "-" : "*"} line ${i}: #tag${i} word word "quote ${i}" 12,${i}00 | x ${"filler ".repeat(i % 7)}`).join("\n") + "\n" + "a ".repeat(3000);
/** Short-course lessons need at least this many required tasks, so a badge means work done. */
const SHORT_MIN_TASKS = 2;

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log("  FAIL " + msg);
};
const ids = new Set();
const fence = (body, lang) => [...body.matchAll(new RegExp("```" + lang + "\\s*\\n([\\s\\S]*?)\\n```", "g"))].map((m) => m[1]);
const run = (sql) => query(logistics, sql).rows;

const datasetDbs = {};
const dataset = async (name) => (datasetDbs[name] ??= await openDataset(name));
const datasetFiles = (name) => (fs.existsSync(`public/datasets/${name}`) ? fs.readdirSync(`public/datasets/${name}`).filter((f) => f.endsWith(".csv")).map((f) => f.replace(/\.csv$/, "")) : []);

let lessonCount = 0;
for (const course of COURSES) {
  const dir = path.join(CONTENT, course);
  if (!fs.existsSync(dir)) {
    fail(`no folder ${dir}`);
    continue;
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  console.log(`\n=== ${course} (${files.length} lessons)`);
  for (const f of files) {
    lessonCount++;
    const raw = fs.readFileSync(path.join(dir, f), "utf8").replace(/\r\n/g, "\n");
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
    console.log(f);
    if (!fm || !/title:/.test(fm[1]) || !/minutes:/.test(fm[1]) || !/summary:/.test(fm[1])) fail("front matter needs title, minutes and summary");
    const body = raw.slice(fm ? fm[0].length : 0);

    // Honest timing: reading, examples, walkthrough steps and the required tasks.
    const stated = Number(fm?.[1].match(/minutes:\s*(\d+)/)?.[1] ?? 0);
    const handsOn = Number(fm?.[1].match(/handsOn:\s*(\d+)/)?.[1] ?? 0);
    const { minutes: estimate, requiredTasks } = lessonTime(body, handsOn);
    if (!timingOk(stated, estimate)) fail(`says ${stated} minutes, but reading and tasks come to about ${Math.round(estimate)} (set it to ${roundMinutes(estimate)})`);
    if (SHORT.includes(course) && requiredTasks < SHORT_MIN_TASKS) fail(`needs at least ${SHORT_MIN_TASKS} required tasks (has ${requiredTasks})`);

    for (const json of fence(body, "task")) {
      let t;
      try {
        t = JSON.parse(json);
      } catch (e) {
        fail(`task JSON: ${e.message}`);
        continue;
      }
      if (!t.id || !t.prompt || !t.minutes || !t.rules?.length) {
        fail(`task ${t.id ?? "?"}: needs id, prompt, minutes and rules`);
        continue;
      }
      if (ids.has(t.id)) fail(`duplicate id ${t.id}`);
      ids.add(t.id);
      try {
        for (const r of t.rules) if (r.pattern) new RegExp(r.pattern, "i");
      } catch (e) {
        fail(`${t.id}: rule pattern doesn't compile: ${e.message}`);
        continue;
      }
      // A pattern that backtracks badly would freeze the learner's browser on a long answer.
      const slow = t.rules.find((r) => {
        if (!r.pattern) return false;
        const start = performance.now();
        checkTask({ rules: [r] }, STRESS_TEXT);
        return performance.now() - start > 100;
      });
      if (slow) fail(`${t.id}: the rule "${slow.label}" is too slow on a long answer; simplify its pattern`);
      if (checkTask(t, "").passed) fail(`${t.id}: an empty answer passes; add a rule that needs real work`);
      if (t.required && !t.sample) fail(`${t.id}: a required task needs a model answer (sample)`);
      if (t.sample) {
        const r = checkTask(t, t.sample.replace(/^```\w*\n|\n```$/g, ""));
        if (!r.passed) fail(`${t.id}: the model answer fails "${r.results.find((x) => !x.passed).label}"`);
      }
    }

    if (SHORT.includes(course)) {
      if ((body.match(/^## /gm) ?? []).length < 3) fail("needs at least three ## steps");
      if (!/^## Try it$/m.test(body)) fail('needs a "## Try it" step');
      if (/```quiz/.test(body)) fail("short-course lessons don't have quizzes; the module check is in assessment.ts");
    } else for (const s of SECTIONS) if (!body.includes(s + "\n")) fail(`missing section "${s}"`);

    // Images: the file exists, has a size in image-sizes.json, and has alt text.
    for (const m of body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)) {
      const [, alt, src] = m;
      if (!alt.trim()) fail(`image ${src} has no alt text`);
      if (!fs.existsSync(path.join("public", src))) fail(`image ${src} does not exist`);
      else if (!IMAGE_SIZES[src]) fail(`image ${src} missing from image-sizes.json (run npm run images)`);
    }

    fence(body, "sql run").forEach((q, i) => {
      try {
        run(q);
      } catch (e) {
        fail(`sql example ${i + 1}: ${e.message}`);
      }
    });

    for (const json of fence(body, "exercise")) {
      let ex;
      try {
        ex = JSON.parse(json);
      } catch (e) {
        fail(`exercise JSON: ${e.message}`);
        continue;
      }
      if (ids.has(ex.id)) fail(`duplicate id ${ex.id}`);
      ids.add(ex.id);
      try {
        if (!run(ex.solution).length) fail(`${ex.id}: solution returns no rows`);
      } catch (e) {
        fail(`${ex.id}: ${e.message}`);
      }
    }

    for (const json of fence(body, "answer")) {
      let a;
      try {
        a = JSON.parse(json);
      } catch (e) {
        fail(`answer JSON: ${e.message}`);
        continue;
      }
      if (!a.id || !a.prompt || a.answer === undefined) fail(`answer block needs id, prompt and answer`);
      if (ids.has(a.id)) fail(`duplicate id ${a.id}`);
      ids.add(a.id);
      for (const file of a.files ?? []) if (!datasetFiles(a.dataset).includes(file)) fail(`${a.id}: no file ${a.dataset}/${file}.csv`);
      if (a.dataset && !a.verify && !a.pyVerify) {
        fail(`${a.id}: uses the ${a.dataset} dataset but has no verify query (SQL) or pyVerify (pandas)`);
        continue;
      }
      if (!a.verify && a.pyVerify) {
        // Statistics that SQL can't express simply (medians, percentiles, p-values) are checked in pandas by npm run test:python.
        console.log(`  ${a.id}${a.required ? " (required)" : ""}: ${JSON.stringify(a.answer)} (checked by test:python)`);
        continue;
      }
      if (!a.verify) {
        console.log(`  ${a.id}${a.required ? " (required)" : ""}: ${JSON.stringify(a.answer)} (worked from the lesson)`);
        continue;
      }
      try {
        const db = await dataset(a.dataset ?? "sales");
        const got = query(db, a.verify).rows[0]?.[0];
        const ok =
          typeof a.answer === "number"
            ? typeof got === "number" && Math.abs(got - a.answer) <= (a.tolerance ?? (Number.isInteger(a.answer) ? 0.5 : 0.051))
            : String(got).trim().toLowerCase() === String(a.answer).trim().toLowerCase();
        if (!ok) fail(`${a.id}: expected ${JSON.stringify(a.answer)}, the data gives ${JSON.stringify(got)}`);
        else console.log(`  ${a.id}${a.required ? " (required)" : ""}: ${JSON.stringify(a.answer)} ✓`);
      } catch (e) {
        fail(`${a.id} verify: ${e.message}`);
      }
    }

    for (const json of fence(body, "dataset")) {
      try {
        const d = JSON.parse(json);
        for (const file of d.files ?? []) if (!datasetFiles(d.dataset).includes(file)) fail(`dataset block: no file ${d.dataset}/${file}.csv`);
      } catch (e) {
        fail(`dataset JSON: ${e.message}`);
      }
    }

    for (const json of fence(body, "quiz")) {
      try {
        JSON.parse(json).forEach((q, i) => {
          if (!(q.answer >= 0 && q.answer < q.options.length)) fail(`quiz question ${i + 1}: answer out of range`);
        });
      } catch (e) {
        fail(`quiz JSON: ${e.message}`);
      }
    }
  }
}

// Assessments are plain data in TypeScript: strip the type annotations and evaluate them.
function loadAssessments(file) {
  const src = fs
    .readFileSync(file, "utf8")
    .replace(/^import .*$/gm, "")
    .replace(/export const \w+: AssessmentDef(\[\])? =/, "return");
  const value = new Function(src)();
  return Array.isArray(value) ? value : [value];
}
const questionIds = new Set();
let checkCount = 0;
for (const course of COURSES) {
  const file = path.join(CONTENT, course, "assessment.ts");
  if (!fs.existsSync(file)) {
    fail(`${course}: no assessment.ts`);
    continue;
  }
  let list;
  try {
    list = loadAssessments(file);
  } catch (e) {
    fail(`${course} assessment.ts: ${e.message}`);
    continue;
  }
  const finals = list.filter((a) => (a.kind ?? "final") === "final");
  const checks = list.filter((a) => a.kind === "module");
  if (finals.length !== 1) fail(`${course}: expected one final assessment, found ${finals.length}`);
  if (SHORT.includes(course) && checks.length === 0) fail(`${course}: short courses need a check for each module`);
  checkCount += checks.length;
  for (const a of list) {
    const min = a.kind === "module" ? 5 : SHORT.includes(course) ? 8 : 10;
    if (a.questions.length < min) fail(`${a.id}: only ${a.questions.length} questions (at least ${min})`);
    if (a.kind === "module" && !a.moduleId) fail(`${a.id}: a module check needs a moduleId`);
    if (!(a.passingScore > 0 && a.passingScore <= 100)) fail(`${a.id}: pass mark out of range`);
    for (const q of a.questions) {
      if (questionIds.has(q.id)) fail(`duplicate question id ${q.id}`);
      questionIds.add(q.id);
      if (!(q.answer >= 0 && q.answer < q.options.length)) fail(`${q.id}: answer out of range`);
      if (!q.explanation) fail(`${q.id}: no explanation`);
    }
  }
  console.log(`\n${course}: final ${finals[0]?.questions.length ?? 0} questions${checks.length ? `, ${checks.length} module checks` : ""}`);
  if (FULL.includes(course)) {
    const p = path.join(CONTENT, course, "project.ts");
    if (!fs.existsSync(p) || !/tasks: \[/.test(fs.readFileSync(p, "utf8"))) fail(`${course}: project missing or has no tasks`);
  }
}

// Every module with a badge in the catalogue has a module check, and every check points at a module.
const catalog = fs.readFileSync("src/content/catalog.ts", "utf8");
const badgeModules = [...catalog.matchAll(/\{ id: "([a-z0-9-]+)", title: [^}]*?badge: "/g)].map((m) => m[1]);
const checkedModules = new Set(COURSES.flatMap((c) => (fs.existsSync(path.join(CONTENT, c, "assessment.ts")) ? loadAssessments(path.join(CONTENT, c, "assessment.ts")) : [])).filter((a) => a.kind === "module").map((a) => a.moduleId));
for (const m of badgeModules) if (!checkedModules.has(m)) fail(`module ${m} has a badge but no module check`);
for (const m of checkedModules) if (!badgeModules.includes(m)) fail(`module check for ${m}, which has no badge in the catalogue`);

// Practice projects (src/content/projects.ts, loaded with its types stripped).
const { stripTypeScriptTypes } = await import("node:module");
const os = await import("node:os");
const { pathToFileURL } = await import("node:url");
const projectsJs = path.join(os.tmpdir(), `cta-projects-${process.pid}.mjs`);
fs.writeFileSync(projectsJs, stripTypeScriptTypes(fs.readFileSync("src/content/projects.ts", "utf8").replace(/^import META from .*$/m, "const META = {};")));
const { DATASETS, DATA_DICTIONARY, PRACTICE_PROJECTS } = await import(pathToFileURL(projectsJs).href);
fs.rmSync(projectsJs);
const META = JSON.parse(fs.readFileSync("src/content/dataset-meta.json", "utf8"));
for (const d of DATASETS) {
  for (const file of datasetFiles(d.id)) {
    const [header, ...body] = parseCsv(fs.readFileSync(`public/datasets/${d.id}/${file}.csv`, "utf8").replace(/^\uFEFF/, ""));
    const meta = META[d.id]?.files[file];
    if (!meta || meta.rows !== body.length || meta.columns.map((c) => c.name).join() !== header.join()) fail(`${d.id}/${file}: dataset-meta.json is out of date (run npm run datasets:meta)`);
    const doc = DATA_DICTIONARY[d.id]?.[file];
    if (!doc?.about) fail(`${d.id}/${file}: no description in DATA_DICTIONARY`);
    for (const h of header) if (!doc?.columns[h]) fail(`${d.id}/${file}: column "${h}" has no description`);
    for (const c of Object.keys(doc?.columns ?? {})) if (!header.includes(c)) fail(`${d.id}/${file}: described column "${c}" isn't in the file`);
  }
  if (!fs.existsSync(`public/datasets/${d.id}.zip`)) fail(`${d.id}: no ZIP (run npm run datasets:meta)`);
}
const projectIds = new Set();
for (const p of PRACTICE_PROJECTS) {
  if (projectIds.has(p.id)) fail(`duplicate project id ${p.id}`);
  projectIds.add(p.id);
  if (!DATASETS.some((d) => d.id === p.dataset)) fail(`${p.id}: unknown dataset ${p.dataset}`);
  for (const slug of p.courseSlugs) if (!catalog.includes(`slug: "${slug}"`)) fail(`${p.id}: unknown course ${slug}`);
  for (const key of ["context", "questions", "deliverables", "approach", "starters"]) if (!p[key]?.length) fail(`${p.id}: no ${key}`);
  for (const st of p.starters.filter((x) => x.language === "sql")) {
    try {
      if (!query(await dataset(p.dataset), st.code).rows.length) fail(`${p.id} starter "${st.title}": returns no rows`);
    } catch (e) {
      fail(`${p.id} starter "${st.title}": ${e.message}`);
    }
  }
}
console.log(`\nProjects: ${PRACTICE_PROJECTS.length} projects on ${DATASETS.length} datasets, every column described`);

// Career tracks point only at real courses and practice projects, and every course has a level.
const { TRACKS } = await import(pathToFileURL(path.resolve("src/content/tracks.ts")).href);
const courseIds = [...catalog.matchAll(/^    id: "([a-z0-9-]+)",/gm)].map((m) => m[1]);
if ((catalog.match(/^    level: [1-4],/gm) ?? []).length !== courseIds.length) fail("every course in catalog.ts needs a level from 1 to 4");
for (const t of TRACKS) {
  const items = t.stages.flatMap((s) => s.items);
  for (const i of items) {
    if (i.kind === "course" && !courseIds.includes(i.courseId)) fail(`track ${t.id}: unknown course ${i.courseId}`);
    if (i.kind === "project" && !PRACTICE_PROJECTS.some((p) => p.id === i.projectId)) fail(`track ${t.id}: unknown project ${i.projectId}`);
  }
  if (!items.some((i) => i.kind === "course" && i.required !== false)) fail(`track ${t.id}: needs at least one required course`);
}
console.log(`Tracks: ${TRACKS.map((t) => t.title).join(", ")}`);

console.log(failures ? `\n${failures} problem(s)` : `\nAll ${lessonCount} lessons OK, ${ids.size} practice tasks, ${checkCount} module checks, ${badgeModules.length} module badges`);
process.exit(failures ? 1 : 0);
