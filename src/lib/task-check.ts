/**
 * Checks a written task (```task in a lesson) against its rules. Patterns ignore case and
 * work line by line (^ and $ match at each line). Dependency-free so
 * scripts/test-content.mjs can import it to prove every model answer passes its own rules.
 */
import type { TaskRule, TaskSpec, WebFiles } from "@/content/types";

export type RuleResult = { label: string; passed: boolean };

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
/** Non-empty lines, trimmed. */
const lines = (s: string) =>
  s
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

function passes(rule: TaskRule, text: string): boolean {
  if (rule.minWords !== undefined && words(text) < rule.minWords) return false;
  if (rule.maxWords !== undefined && words(text) > rule.maxWords) return false;
  if (rule.minLines !== undefined && lines(text).length < rule.minLines) return false;
  if (!rule.pattern) return true;
  if (rule.perLine) {
    const re = new RegExp(rule.pattern, "i");
    const ls = lines(text);
    return ls.length > 0 && ls.every((l) => re.test(l));
  }
  const count = (text.match(new RegExp(rule.pattern, "gim")) ?? []).length;
  return rule.absent ? count === 0 : count >= (rule.min ?? 1);
}

export function checkTask(spec: Pick<TaskSpec, "rules">, text: string): { passed: boolean; results: RuleResult[] } {
  const results = spec.rules.map((r) => ({ label: r.label, passed: passes(r, text) }));
  return { passed: results.every((r) => r.passed), results };
}

/** A rule that needs the page to be rendered (checked in the preview) rather than read as text. */
export const isRenderRule = (r: TaskRule) => r.selector !== undefined || r.output !== undefined || r.page !== undefined;

const fileText = (rule: TaskRule, files: WebFiles) => {
  const f = { html: files.html ?? "", css: files.css ?? "", js: files.js ?? "" };
  return rule.in && rule.in !== "all" ? f[rule.in] : `${f.html}
${f.css}
${f.js}`;
};

/**
 * Checks the code-reading rules of a web task. A rule that needs the rendered page is left as null:
 * the live editor fills it in from the preview, and scripts/test-webtasks.mjs from a real browser.
 */
export function checkWebCode(rules: TaskRule[], files: WebFiles): (boolean | null)[] {
  return rules.map((r) => (isRenderRule(r) ? null : passes(r, fileText(r, files))));
}

/** What the rendered page reported: for each rule that needs it, whether it passed (selector rules), the lines printed, the page text. */
export type RenderReport = { selector: Record<number, boolean>; output: string; page: string };

/** Combines the code rules with the rendered-page rules into one result per rule. */
export function checkWebTask(rules: TaskRule[], files: WebFiles, render: RenderReport | null): { passed: boolean; results: RuleResult[] } {
  const code = checkWebCode(rules, files);
  const results = rules.map((r, i) => {
    let ok = code[i];
    if (ok === null) {
      if (!render) ok = false;
      else {
        ok = true;
        if (r.selector !== undefined) ok = render.selector[i] === true;
        if (ok && r.output !== undefined) ok = new RegExp(r.output, "im").test(render.output);
        if (ok && r.page !== undefined) ok = new RegExp(r.page, "im").test(render.page);
      }
    }
    return { label: r.label, passed: ok };
  });
  return { passed: results.every((r) => r.passed), results };
}
