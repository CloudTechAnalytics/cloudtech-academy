/**
 * Checks a written task (```task in a lesson) against its rules. Patterns ignore case and
 * work line by line (^ and $ match at each line). Dependency-free so
 * scripts/test-content.mjs can import it to prove every model answer passes its own rules.
 */
import type { TaskRule, TaskSpec } from "@/content/types";

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
