// Runs the shell examples in lesson files, so every command a learner pastes into a Google
// Colab %%bash cell is known to work and to print what the lesson says.
//
// Each lesson's ```bash blocks run in order in one fresh temporary folder (like Colab's
// /content), with bash and the C locale. A leading %%bash line is dropped, and dataset URLs
// are pointed at the local copies in public/datasets, so `curl -sO <url>` downloads them.
// Blocks fenced as ```bash norun are skipped: use that for commands that need the internet or
// change the machine. When a ```text block comes straight after a ```bash block, it's the
// output the learner should see, and it must match (```text nocheck to skip the comparison).
//
// Needs bash with GNU coreutils, grep, awk (gawk or mawk) and curl.
// Run: node scripts/test-shell.mjs [--fix] [course-folder ...]   (default: every course with shell blocks)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "src", "content");
const URL_PREFIX = "https://academy.cloudtechanalytics.com/datasets/";
const LOCAL = "file:///" + path.join(ROOT, "public", "datasets").replace(/\\/g, "/") + "/";
const BLOCK = /```bash([^\n]*)\n([\s\S]*?)\n```(?:\s*\n```text([^\n]*)\n([\s\S]*?)\n```)?/g;
const fix = process.argv.includes("--fix");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const norm = (s) => s.trim().split("\n").map((l) => l.replace(/\s+$/, "")).join("\n");

const courses = args.length ? args : fs.readdirSync(CONTENT).filter((d) => fs.statSync(path.join(CONTENT, d)).isDirectory());
let lessons = 0;
let failures = 0;
for (const course of courses) {
  const dir = path.join(CONTENT, course);
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const file = path.join(dir, name);
    const blocks = [...fs.readFileSync(file, "utf8").matchAll(BLOCK)].filter((m) => !m[1].includes("norun"));
    if (!blocks.length) continue;
    lessons++;
    const work = fs.mkdtempSync(path.join(os.tmpdir(), "shell-lesson-"));
    let error = null;
    for (const [i, m] of blocks.entries()) {
      const code = m[2].replace(/^%%bash\s*\n/, "").split(URL_PREFIX).join(LOCAL);
      const run = spawnSync("bash", ["-c", code], { cwd: work, encoding: "utf8", env: { ...process.env, LC_ALL: "C" } });
      if (run.status !== 0 && !m[4]) {
        error = `block ${i + 1} exited with ${run.status}:\n${code}\n${run.stderr}`;
        break;
      }
      if (m[4] === undefined || (m[3] ?? "").includes("nocheck")) continue;
      if (norm(run.stdout) !== norm(m[4])) {
        const message = `block ${i + 1}: the output shown in the lesson doesn't match.\n--- lesson says:\n${m[4]}\n--- the commands print:\n${run.stdout}${run.stderr}`;
        if (!fix) {
          error = message;
          break;
        }
        const text = fs.readFileSync(file, "utf8");
        fs.writeFileSync(file, text.replace("```text\n" + m[4] + "\n```", "```text\n" + norm(run.stdout) + "\n```"));
        console.log("FIXED " + message);
      }
    }
    fs.rmSync(work, { recursive: true, force: true });
    console.log((error ? "FAIL " : "ok   ") + `${course}/${name}`);
    if (error) {
      failures++;
      console.log(error);
    }
  }
}
console.log(`\n${lessons} lessons with shell commands run, ${failures} failed`);
process.exit(failures ? 1 : 0);
