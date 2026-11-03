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

const DEFAULT_WIDTH = 1000;

/** Loads the files at one screen width like the editor's hidden check page, and reports what the checks need. */
async function renderAt(files, bootstrap, rules, width) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  const printed = [];
  const errors = [];
  page.on("console", (m) => {
    if ((m.type() === "error" || m.type() === "warning") && !/document\.write/.test(m.text())) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e.message)));
  // The page's shim reports console lines (with objects written as JSON) by postMessage to its parent; here the
  // page is its own parent, so listen for them, exactly what the editor's check page does.
  const listener = `<script>window.__lines=[];window.addEventListener('message',function(e){if(e.data&&e.data.__ct===1&&e.data.type==='console')window.__lines.push(String(e.data.text))})</script>`;
  const doc = buildDoc(files, { bootstrap, assetBase: base }).replace(/<head[^>]*>/i, (m) => m + listener);
  await page.setContent(doc, { waitUntil: "load" });
  await page.waitForTimeout(450);
  const probe = await page.evaluate(({ rs }) => ({ results: window.__ctProbe(rs), page: document.body.innerText, lines: window.__lines }), { rs: rules });
  printed.push(...probe.lines);
  await page.close();
  return { results: probe.results, page: probe.page, output: printed.join("\n"), errors };
}

/** The editor checks selector rules at each rule's own width (default 1000px); page text and console output come from the default. */
async function render(files, bootstrap, rules) {
  const selector = {};
  const errors = [];
  let pageText = "";
  let output = "";
  const key = (r) => `${r.at ?? DEFAULT_WIDTH}|${JSON.stringify(r.act ?? [])}`;
  const groups = new Map();
  rules.forEach((r, i) => {
    if (r.selector !== undefined) groups.set(key(r), [...(groups.get(key(r)) ?? []), i]);
  });
  const base = key({});
  if (!groups.has(base)) groups.set(base, []);
  for (const [k, idx] of groups) {
    const res = await renderAt(files, bootstrap, idx.map((i) => rules[i]), Number(k.split("|")[0]));
    idx.forEach((ri, n) => (selector[ri] = res.results[n] === true));
    errors.push(...res.errors);
    if (k === base) {
      pageText = res.page;
      output = res.output;
    }
  }
  return { report: { selector, output, page: pageText }, errors };
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
      // The model answer replaces the files it gives; the others stay as the starting code.
      const answer = { ...t.files, ...t.sample };
      const { report, errors } = await render(answer, t.bootstrap, t.rules);
      const r = checkWebTask(t.rules, answer, report);
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
