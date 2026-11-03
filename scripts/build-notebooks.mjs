// Builds a Google Colab notebook for every lesson with Python or shell code, so lessons can
// offer "Open in Colab". Notebooks go to notebooks/<course-id>/<lesson-slug>.ipynb and are
// committed: Colab opens them straight from the public GitHub repository.
//
// Each notebook has the lesson's explanations as text cells, its code as code cells (in
// order, so "Run all" works), the expected output as a note under each cell, and the practice
// questions as prompts with an empty cell to work in.
//
// Run: npm run notebooks            (write the notebooks)
//      node scripts/build-notebooks.mjs --check   (fail if any notebook is out of date)
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const SITE = "https://academy.cloudtechanalytics.com";
const CONTENT = "src/content";
const OUT = "notebooks";
const check = process.argv.includes("--check");

// Folder -> course ID, from src/content/index.ts.
const indexSrc = fs.readFileSync(path.join(CONTENT, "index.ts"), "utf8");
const dirsBlock = indexSrc.slice(indexSrc.indexOf("const COURSE_DIRS"), indexSrc.indexOf("};", indexSrc.indexOf("const COURSE_DIRS")));
const COURSE_DIRS = Object.fromEntries([...dirsBlock.matchAll(/^\s*"?([\w-]+)"?:\s*"([\w-]+)",/gm)].map((m) => [m[1], m[2]]));

const lines = (text) => {
  const parts = text.split("\n");
  return parts.map((l, i) => (i < parts.length - 1 ? l + "\n" : l));
};
const markdown = (text) => ({ cell_type: "markdown", metadata: {}, source: lines(text.trim()) });
const code = (text) => ({ cell_type: "code", execution_count: null, metadata: {}, outputs: [], source: lines(text.replace(/\s+$/, "")) });

/** Python, or shell commands written for Colab (a %%bash cell). Plain bash is for the learner's own terminal. */
const isCode = (lang, text = "") => /^python\b/.test(lang) || (/^bash\b/.test(lang) && /^%%bash/.test(text));

/** Make site-relative links and images absolute, and turn callouts into bold labels. */
function tidyMarkdown(md) {
  return md
    .replace(/\]\(\/(?!\/)/g, `](${SITE}/`)
    .replace(/^> \[!(TIP|NOTE|WARNING|BUSINESS)\]\s*/gm, (_, k) => `> **${{ TIP: "Tip", NOTE: "Note", WARNING: "Watch out", BUSINESS: "In the business" }[k]}:** `);
}

function notebookFor(raw, courseId, slug) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = Object.fromEntries((fm?.[1] ?? "").split("\n").map((l) => l.match(/^(\w+):\s*(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^"(.*)"$/, "$1")]));
  const body = raw.slice(fm ? fm[0].length : 0);
  const tokens = marked.lexer(body);
  if (!tokens.some((t) => t.type === "code" && isCode((t.lang ?? "").trim(), t.text))) return null;

  const cells = [
    markdown(
      `# ${meta.title ?? slug}\n\n${meta.summary ?? ""}\n\n*From [CloudTech Academy](${SITE}/learn/${courseId}/${slug}). Run the cells in order (Runtime → Run all), edit them, and experiment. Answer the practice questions on the lesson page.*`,
    ),
  ];
  let prose = "";
  const flush = () => {
    if (prose.trim()) cells.push(markdown(tidyMarkdown(prose)));
    prose = "";
  };
  for (const t of tokens) {
    if (t.type !== "code") {
      prose += t.raw;
      continue;
    }
    const lang = (t.lang ?? "").trim();
    if (isCode(lang, t.text)) {
      flush();
      const norun = /\bnorun\b/.test(lang);
      cells.push(code(norun ? `# This example shows a mistake, or needs something only you can provide.\n# Run it to see what happens.\n${t.text}` : t.text));
    } else if (/^text\b/.test(lang)) {
      flush();
      cells.push(markdown(`*Expected output:*\n\n\`\`\`\n${t.text}\n\`\`\``));
    } else if (lang === "answer" || lang === "task") {
      flush();
      const spec = JSON.parse(t.text);
      cells.push(markdown(`**${lang === "answer" ? "Practice" : "Task"}:** ${spec.prompt}\n\n*Work it out below, then enter your answer on the lesson page.*`));
      cells.push(code("# Your code here\n"));
    } else if (lang === "dataset") {
      const spec = JSON.parse(t.text);
      prose += `\n**Dataset:** ${(spec.files ?? []).map((f) => `[${f}.csv](${SITE}/datasets/${spec.dataset}/${f}.csv)`).join(", ")}\n\n`;
    } else if (lang === "quiz" || lang === "exercise") {
      // Quizzes and SQL exercises live on the lesson page.
    } else {
      prose += t.raw;
    }
  }
  flush();
  return {
    cells,
    metadata: {
      colab: { provenance: [], toc_visible: true },
      kernelspec: { display_name: "Python 3", name: "python3" },
      language_info: { name: "python" },
    },
    nbformat: 4,
    nbformat_minor: 0,
  };
}

const wanted = new Map();
for (const [folder, courseId] of Object.entries(COURSE_DIRS)) {
  const dir = path.join(CONTENT, folder);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md")).sort()) {
    const slug = f.replace(/^\d+-/, "").replace(/\.md$/, "");
    const nb = notebookFor(fs.readFileSync(path.join(dir, f), "utf8").replace(/\r\n/g, "\n"), courseId, slug);
    if (nb) wanted.set(path.join(OUT, courseId, `${slug}.ipynb`), JSON.stringify(nb, null, 1) + "\n");
  }
}

let stale = 0;
for (const [file, text] of wanted) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (current === text) continue;
  stale++;
  if (check) console.log(`out of date: ${file}`);
  else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
}
// Notebooks for lessons that no longer have code.
if (fs.existsSync(OUT))
  for (const courseDir of fs.readdirSync(OUT))
    for (const f of fs.readdirSync(path.join(OUT, courseDir))) {
      const file = path.join(OUT, courseDir, f);
      if (wanted.has(file)) continue;
      stale++;
      if (check) console.log(`no longer needed: ${file}`);
      else fs.rmSync(file);
    }
if (!check && fs.existsSync(OUT))
  for (const courseDir of fs.readdirSync(OUT)) if (!fs.readdirSync(path.join(OUT, courseDir)).length) fs.rmdirSync(path.join(OUT, courseDir));

if (check && stale) {
  console.log(`${stale} notebook(s) out of date. Run: npm run notebooks`);
  process.exit(1);
}
console.log(check ? `notebooks: all ${wanted.size} up to date` : `notebooks: ${wanted.size} written (${stale} changed)`);
