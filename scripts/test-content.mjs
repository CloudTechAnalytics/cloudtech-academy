// Checks every lesson in every course:
// - front matter and the standard sections are present, JSON blocks parse
// - every ```sql run example and SQL exercise solution runs against the practice database
// - every ```answer task that uses a dataset has a `verify` query, and that query, run over
//   the exact CSV files learners download, reproduces the expected answer
// - quiz answers point at a real option, IDs are unique
// - each course's assessment and project are well formed
// Run: npm run test:content
import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { openDataset, query } from "./lib/csv-db.mjs";

const SQL = await initSqlJs();
const IMAGE_SIZES = JSON.parse(fs.readFileSync("src/content/image-sizes.json", "utf8"));
const logistics = new SQL.Database(fs.readFileSync("public/datasets/logistics.sqlite"));
const CONTENT = "src/content";
const COURSES = ["sql", "daf", "excel", "powerbi", "modelling"];
const SECTIONS = ["## The problem", "## The concept", "## Example", "## Walkthrough", "## Practice", "## Check your understanding"];

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
const datasetFiles = (name) => (fs.existsSync(`public/datasets/${name}`) ? fs.readdirSync(`public/datasets/${name}`).map((f) => f.replace(/\.csv$/, "")) : []);

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
    for (const s of SECTIONS) if (!body.includes(s + "\n")) fail(`missing section "${s}"`);

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
      if (a.dataset && !a.verify) {
        fail(`${a.id}: uses the ${a.dataset} dataset but has no verify query`);
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

// Quick courses: front matter, a Try it step, and a final five-question badge quiz.
const QUICK_DIR = path.join(CONTENT, "quick");
const QUICK_ICONS = [...fs.readFileSync("src/components/QuickIcon.tsx", "utf8").matchAll(/^\s+(\w+): \w+,$/gm)].map((m) => m[1]);
const QUICK_CATS = [...fs.readFileSync("src/content/quick.ts", "utf8").match(/QUICK_CATEGORIES = \[([^\]]*)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const quickFiles = fs.existsSync(QUICK_DIR) ? fs.readdirSync(QUICK_DIR).filter((f) => f.endsWith(".md")).sort() : [];
console.log(`\n=== quick (${quickFiles.length} courses)`);
for (const f of quickFiles) {
  console.log(f);
  const raw = fs.readFileSync(path.join(QUICK_DIR, f), "utf8").replace(/\r\n/g, "\n");
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = Object.fromEntries((fm?.[1] ?? "").split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]));
  for (const k of ["title", "badge", "minutes", "category", "icon", "summary", "skills"]) if (!meta[k]) fail(`missing front matter "${k}"`);
  if (!(Number(meta.minutes) >= 10 && Number(meta.minutes) <= 30)) fail(`minutes should be 10–30, got ${meta.minutes}`);
  if (meta.category && !QUICK_CATS.includes(meta.category)) fail(`unknown category "${meta.category}"`);
  if (meta.icon && !QUICK_ICONS.includes(meta.icon)) fail(`unknown icon "${meta.icon}"`);
  const body = raw.slice(fm ? fm[0].length : 0);
  if ((body.match(/^## /gm) ?? []).length < 3) fail("needs at least three ## steps");
  if (!/^## Try it$/m.test(body)) fail('needs a "## Try it" step');
  const quiz = body.trimEnd().match(/```quiz\s*\n([\s\S]*?)\n```$/);
  if (!quiz) fail("the badge quiz must be the last block");
  else {
    try {
      const qs = JSON.parse(quiz[1]);
      if (qs.length !== 5) fail(`badge quiz has ${qs.length} questions, expected 5`);
      qs.forEach((q, i) => {
        if (!(q.answer >= 0 && q.answer < q.options.length)) fail(`quiz question ${i + 1}: answer out of range`);
        if (!q.explanation) fail(`quiz question ${i + 1}: no explanation`);
      });
    } catch (e) {
      fail(`quiz JSON: ${e.message}`);
    }
  }
  if ((body.match(/```quiz/g) ?? []).length > 1) fail("only the final badge quiz is allowed");
}

// Assessments and projects are plain data in TypeScript; check them loosely.
for (const course of COURSES) {
  const file = path.join(CONTENT, course, "assessment.ts");
  if (!fs.existsSync(file)) {
    fail(`${course}: no assessment.ts`);
    continue;
  }
  const a = fs.readFileSync(file, "utf8");
  const qIds = [...a.matchAll(/id: "([^"]+)",\s*\n\s*prompt:/g)].map((m) => m[1]);
  const answers = [...a.matchAll(/answer: (\d+)/g)].map((m) => Number(m[1]));
  if (qIds.length < 10) fail(`${course} assessment: only ${qIds.length} questions`);
  if (new Set(qIds).size !== qIds.length) fail(`${course} assessment: duplicate question ids`);
  if (answers.length !== qIds.length) fail(`${course} assessment: ${answers.length} answers for ${qIds.length} questions`);
  const dist = answers.reduce((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {});
  console.log(`\n${course} assessment: ${qIds.length} questions, correct option positions ${JSON.stringify(dist)}`);
  const p = path.join(CONTENT, course, "project.ts");
  if (!fs.existsSync(p) || !/tasks: \[/.test(fs.readFileSync(p, "utf8"))) fail(`${course}: project missing or has no tasks`);
}

console.log(failures ? `\n${failures} problem(s)` : `\nAll ${lessonCount} lessons OK, ${ids.size} practice tasks, ${quickFiles.length} quick courses`);
process.exit(failures ? 1 : 0);
