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
const logistics = new SQL.Database(fs.readFileSync("public/datasets/logistics.sqlite"));
const CONTENT = "src/content";
const COURSES = ["sql", "daf", "excel", "powerbi"];
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

console.log(failures ? `\n${failures} problem(s)` : `\nAll ${lessonCount} lessons OK, ${ids.size} practice tasks`);
process.exit(failures ? 1 : 0);
