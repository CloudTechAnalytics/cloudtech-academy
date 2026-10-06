import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";

/** Index just after the quoted string that starts at `i`. */
function skipString(code: string, i: number) {
  const quote = code[i];
  for (let j = i + 1; j < code.length; j++) {
    if (code[j] === "\\") j++;
    else if (code[j] === quote) return j + 1;
  }
  return code.length;
}

/** Index just after the array literal that starts at `i`. */
function skipArray(code: string, i: number) {
  let depth = 0;
  for (let j = i; j < code.length; j++) {
    const ch = code[j];
    if (ch === '"' || ch === "'" || ch === "`") j = skipString(code, j) - 1;
    else if (ch === "[") depth++;
    else if (ch === "]" && --depth === 0) return j + 1;
  }
  return code.length;
}

/**
 * Paid courses keep their lessons out of the public site files.
 *
 * Folders listed in src/content/protected-courses.json are professional (paid) courses. In a production build their
 * lesson text, assessment questions and project briefs are replaced with empty stand-ins, so nobody can read them from
 * the JavaScript or the prerendered pages. The real content lives in the database, and the database releases it only
 * to enrolled learners. The seed build (scripts/build-seed.mjs) turns this off so the database still receives
 * everything. Set CT_PROTECT_FOLDERS=folder1,folder2 to try it on other folders.
 */
function protectPaidCourses(): Plugin {
  const listed: string[] = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "src/content/protected-courses.json"), "utf8")).folders;
  const folders = new Set([...listed, ...(process.env.CT_PROTECT_FOLDERS?.split(",").filter(Boolean) ?? [])]);

  /**
   * Replaces the value of every `name:` property in TypeScript source with `empty`. The value is an array or a string;
   * quoted strings inside an array are skipped over, so brackets in the text can't end it early.
   */
  const blank = (code: string, name: string, empty: string) => {
    const find = new RegExp(`\\b${name}:\\s*`, "g");
    let out = "";
    let from = 0;
    for (let m = find.exec(code); m; m = find.exec(code)) {
      const start = m.index + m[0].length;
      const open = code[start];
      if (open !== "[" && open !== "`" && open !== '"') continue;
      const end = open === "[" ? skipArray(code, start) : skipString(code, start);
      out += code.slice(from, start) + empty;
      from = end;
      find.lastIndex = end;
    }
    return out + code.slice(from);
  };

  return {
    name: "protect-paid-courses",
    enforce: "pre",
    apply: "build",
    transform(code, id) {
      if (process.env.CT_SEED === "1" || folders.size === 0) return null;
      const clean = id.split("?")[0].replace(/\\/g, "/");
      const m = clean.match(/\/src\/content\/([^/]+)\/(.+)$/);
      if (!m || !folders.has(m[1])) return null;
      if (m[2].endsWith(".md") && id.includes("?raw")) {
        // Keep the front matter (title, summary, minutes) for the outline and drop the lesson.
        const text = code.startsWith("export default ") ? (JSON.parse(code.slice("export default ".length).replace(/;\s*$/, "")) as string) : code;
        const front = text.match(/^---\r?\n[\s\S]*?\r?\n---/);
        return { code: `export default ${JSON.stringify(front ? front[0] + "\n" : "")}`, map: null };
      }
      if (m[2] === "assessment.ts") return { code: blank(code, "questions", "[]"), map: null };
      if (m[2] === "project.ts") {
        let out = blank(code, "brief", "``");
        out = blank(out, "tasks", "[]");
        out = blank(out, "rubric", "[]");
        return { code: out, map: null };
      }
      return null;
    },
  };
}

// Public pages are prerendered after the build by scripts/prerender.mjs.
export default defineConfig({
  plugins: [protectPaidCourses(), react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  worker: { format: "es" },
});
