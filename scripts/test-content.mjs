// Checks every lesson against the practice database:
// - front matter and JSON blocks parse
// - every ```sql run example executes
// - every exercise solution executes and returns rows
// - quiz answers point at a real option
// - the assessment and exercise IDs are unique
// Run: npm run test:content
import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";

const SQL = await initSqlJs();
const db = new SQL.Database(fs.readFileSync("public/datasets/logistics.sqlite"));
const dir = "src/content/sql";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log("  FAIL " + msg);
};
const ids = new Set();
const fence = (body, lang) => [...body.matchAll(new RegExp("```" + lang + "\\s*\\n([\\s\\S]*?)\\n```", "g"))].map((m) => m[1]);

function run(sql) {
  const res = db.exec(sql);
  const last = res[res.length - 1];
  return last ? last.values : [];
}

for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), "utf8").replace(/\r\n/g, "\n");
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  console.log(f);
  if (!fm || !/title:/.test(fm[1]) || !/minutes:/.test(fm[1])) fail("front matter needs title and minutes");
  const body = raw.slice(fm ? fm[0].length : 0);
  for (const s of ["## The problem", "## The concept", "## Example", "## Walkthrough", "## Practice", "## Check your understanding"])
    if (!body.includes(s)) fail(`missing section "${s}"`);

  fence(body, "sql run").forEach((q, i) => {
    try {
      const rows = run(q);
      console.log(`  example ${i + 1}: ${rows.length} rows`);
    } catch (e) {
      fail(`example ${i + 1}: ${e.message}`);
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
    if (ids.has(ex.id)) fail(`duplicate exercise id ${ex.id}`);
    ids.add(ex.id);
    try {
      const rows = run(ex.solution);
      if (!rows.length) fail(`${ex.id}: solution returns no rows`);
      else console.log(`  ${ex.id}${ex.required ? " (required)" : ""}: ${rows.length} rows`);
    } catch (e) {
      fail(`${ex.id}: ${e.message}`);
    }
  }

  for (const json of fence(body, "quiz")) {
    try {
      const qs = JSON.parse(json);
      qs.forEach((q, i) => {
        if (!(q.answer >= 0 && q.answer < q.options.length)) fail(`quiz question ${i + 1}: answer out of range`);
      });
    } catch (e) {
      fail(`quiz JSON: ${e.message}`);
    }
  }
}

console.log(failures ? `\n${failures} problem(s)` : `\nAll ${files.length} lessons OK, ${ids.size} exercises`);
process.exit(failures ? 1 : 0);
