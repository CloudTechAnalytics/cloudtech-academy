// Runs the JavaScript examples in lesson files, so every snippet a learner pastes into the
// browser console is known to work and to print what the lesson says.
//
// A lesson's ```js blocks run in order in one shared scope, like one console session, and
// may use `await`. What each block prints with console.log must match the ```text block
// straight after it (```text nocheck to skip). Blocks fenced ```js norun are skipped, and
// ```html blocks are shown to learners but not run here. After the blocks, every ```answer
// with a "jsVerify" expression is evaluated in the same scope and must equal the answer.
//
// Run: node scripts/test-js.mjs [--fix] [course-folder ...]   (default: every course with JS)
import fs from "node:fs";
import path from "node:path";
import util from "node:util";
import vm from "node:vm";

const CONTENT = path.join(process.cwd(), "src", "content");
const BLOCK = /```js([^\n]*)\n([\s\S]*?)\n```(?:\s*\n```text([^\n]*)\n([\s\S]*?)\n```)?/g;
const ANSWER = /```answer\s*\n([\s\S]*?)\n```/g;
const fix = process.argv.includes("--fix");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const norm = (s) => s.replace(/\r\n/g, "\n").trim().split("\n").map((l) => l.replace(/\s+$/, "")).join("\n");

async function runLesson(file) {
  const text = fs.readFileSync(file, "utf8");
  const blocks = [...text.matchAll(BLOCK)].filter((m) => !m[1].includes("norun"));
  const answers = [...text.matchAll(ANSWER)].map((m) => JSON.parse(m[1])).filter((a) => a.jsVerify);
  if (!blocks.length && !answers.length) return null;
  const outputs = blocks.map(() => []);
  const results = {};
  let current = 0;
  const context = vm.createContext({
    console: { log: (...a) => outputs[current].push(util.format(...a)), error: (...a) => outputs[current].push(util.format(...a)) },
    __setBlock: (i) => (current = i),
    __answer: (id, value) => (results[id] = value),
    Response, Headers, Request, URL, URLSearchParams, structuredClone, setTimeout, clearTimeout, TextEncoder, TextDecoder,
  });
  const body = blocks.map((m, i) => `__setBlock(${i});\n${m[2]}`).join("\n;\n");
  const checks = answers.map((a) => `__answer(${JSON.stringify(a.id)}, (${a.jsVerify}));`).join("\n");
  try {
    await vm.runInContext(`(async () => {\n${body}\n;\n${checks}\n})()`, context, { filename: path.basename(file) });
  } catch (e) {
    return `block ${current + 1} threw: ${e.stack?.split("\n").slice(0, 3).join("\n") ?? e}`;
  }
  const problems = [];
  let updated = text;
  blocks.forEach((m, i) => {
    if (m[4] === undefined || (m[3] ?? "").includes("nocheck")) return;
    const got = norm(outputs[i].join("\n"));
    if (got !== norm(m[4])) {
      if (fix) {
        updated = updated.replace("```text\n" + m[4] + "\n```", "```text\n" + got + "\n```");
        console.log(`FIXED block ${i + 1}:\n${got}\n`);
      } else problems.push(`block ${i + 1}: the output shown in the lesson doesn't match.\n--- lesson says:\n${m[4]}\n--- the code prints:\n${got}`);
    }
  });
  if (updated !== text) fs.writeFileSync(file, updated);
  for (const a of answers) {
    const got = results[a.id];
    const want = a.answer;
    const ok = typeof want === "number" ? Math.abs(Number(got) - want) <= (a.tolerance ?? (Number.isInteger(want) ? 0.5 : 0.051)) : String(got).trim().toLowerCase() === String(want).trim().toLowerCase();
    if (ok) console.log(`       ${a.id}: ${JSON.stringify(want)} ✓`);
    else problems.push(`${a.id}: expected ${JSON.stringify(want)}, the code gives ${JSON.stringify(got)}`);
  }
  return problems.join("\n");
}

const courses = args.length ? args : fs.readdirSync(CONTENT).filter((d) => fs.statSync(path.join(CONTENT, d)).isDirectory());
let lessons = 0;
let failures = 0;
for (const course of courses) {
  for (const name of fs.readdirSync(path.join(CONTENT, course)).filter((f) => f.endsWith(".md")).sort()) {
    const result = await runLesson(path.join(CONTENT, course, name));
    if (result === null) continue;
    lessons++;
    console.log((result ? "FAIL " : "ok   ") + `${course}/${name}`);
    if (result) {
      failures++;
      console.log(result);
    }
  }
}
console.log(`\n${lessons} lessons with JavaScript run, ${failures} failed`);
process.exit(failures ? 1 : 0);
