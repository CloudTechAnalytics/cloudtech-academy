// Runs every web task's model answer in a real browser and checks it against ALL of its rules, including
// the ones that look at the rendered page (selectors, computed styles, page text, console output).
// Also checks that the starting code does not already pass, and that every ```live example runs without errors.
// Needs Chrome and Playwright: set CHROME and PLAYWRIGHT_PATH if they are not found.
// Run: node scripts/test-webtasks.mjs [folder ...]      (default: web)
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { buildDoc } from "../src/lib/web-doc.ts";
import { checkWebTask, isRenderRule } from "../src/lib/task-check.ts";
import { parseLive, parseWebTask } from "../src/lib/lesson-format.ts";

const CHROME = process.env.CHROME ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PLAYWRIGHT = process.env.PLAYWRIGHT_PATH ?? "C:\\Users\\user\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright";
const { chromium } = createRequire(import.meta.url)(PLAYWRIGHT);

const folders = process.argv.slice(2).length ? process.argv.slice(2) : ["web"];
const fence = (body, lang) => [...body.matchAll(new RegExp("```" + lang + "\\s*\\n([\\s\\S]*?)\\n```", "g"))].map((m) => m[1]);

// Serve public/ so Bootstrap loads from /vendor/ exactly as it does on the site.
const server = http.createServer((req, res) => {
  const file = path.join("public", decodeURIComponent(req.url.split("?")[0]));
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { "content-type": file.endsWith(".css") ? "text/css" : "text/javascript" });
    res.end(fs.readFileSync(file));
  } else {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
let failures = 0;
let tasks = 0;
let lives = 0;
const fail = (m) => {
  failures++;
  console.log("  FAIL " + m);
};

/** Loads files in a page like the editor's preview and reports what the checks need. */
async function render(files, bootstrap, rules) {
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const printed = [];
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") errors.push(m.text());
    else printed.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e.message)));
  // The shim also reports console lines to the parent; here the page is the top window, so collect them ourselves.
  await page.setContent(buildDoc(files, { bootstrap, assetBase: base }), { waitUntil: "load" });
  await page.waitForTimeout(450);
  const idx = rules.flatMap((r, i) => (r.selector !== undefined ? [i] : []));
  const probe = await page.evaluate(({ rs }) => ({ results: window.__ctProbe(rs), page: document.body.innerText }), { rs: idx.map((i) => rules[i]) });
  const selector = {};
  idx.forEach((ri, k) => (selector[ri] = probe.results[k] === true));
  await page.close();
  return { report: { selector, output: printed.join("\n"), page: probe.page }, errors };
}

for (const folder of folders) {
  const dir = path.join("src/content", folder);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md")).sort()) {
    const body = fs.readFileSync(path.join(dir, f), "utf8").replace(/\r\n/g, "\n");
    const blocks = fence(body, "webtask");
    const lives_ = fence(body, "live");
    if (!blocks.length && !lives_.length) continue;
    console.log(f);
    for (const b of blocks) {
      let t;
      try {
        t = parseWebTask(b);
      } catch (e) {
        fail(`webtask: ${e.message}`);
        continue;
      }
      tasks++;
      const { report, errors } = await render(t.sample, t.bootstrap, t.rules);
      const r = checkWebTask(t.rules, t.sample, report);
      const bad = r.results.find((x) => !x.passed);
      if (bad) fail(`${t.id}: the model answer fails "${bad.label}" in the browser`);
      const realErrors = errors.filter((e) => !/favicon|Failed to load resource/i.test(e));
      if (realErrors.length) fail(`${t.id}: the model answer logs errors: ${realErrors[0]}`);
      if (t.rules.some(isRenderRule)) {
        const start = await render(t.files, t.bootstrap, t.rules);
        if (checkWebTask(t.rules, t.files, start.report).passed) fail(`${t.id}: the starting code already passes every rule`);
      }
    }
    for (const b of lives_) {
      let l;
      try {
        l = parseLive(b);
      } catch (e) {
        fail(`live: ${e.message}`);
        continue;
      }
      lives++;
      const { errors } = await render(l.files, l.bootstrap, []);
      const realErrors = errors.filter((e) => !/favicon|Failed to load resource|net::ERR|ERR_INTERNET|fetch/i.test(e) || /SyntaxError|ReferenceError|TypeError/.test(e));
      // Examples that show an error on purpose say so with "expect-error" in their title.
      if (realErrors.length && !/expect-error/i.test(l.title ?? "")) fail(`live example in ${f} logs an error: ${realErrors[0]}`);
    }
  }
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} problem(s)` : `\nAll ${tasks} web tasks and ${lives} live examples run correctly in a real browser.`);
process.exit(failures ? 1 : 0);
