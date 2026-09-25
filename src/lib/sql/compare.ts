import type { QueryResult, SqlValue } from "./sandbox";

export type Comparison = { match: true } | { match: false; reason: string };

function norm(v: SqlValue) {
  if (v === null) return "NULL";
  if (typeof v === "number") return String(Math.round(v * 10000) / 10000);
  if (v instanceof Uint8Array) return `blob:${v.length}`;
  return String(v).trim();
}

/**
 * Compares a learner's result with the model answer's. Column names are ignored, so any
 * alias is fine; values and row counts must match. Row order only matters when the
 * exercise asks for a specific order.
 */
export function compareResults(learner: QueryResult, expected: QueryResult, orderMatters = false): Comparison {
  if (learner.columns.length !== expected.columns.length)
    return {
      match: false,
      reason: `Your result has ${learner.columns.length} column${learner.columns.length === 1 ? "" : "s"}; the question needs ${expected.columns.length}.`,
    };
  if (learner.total !== expected.total)
    return { match: false, reason: `Your result has ${learner.total} row${learner.total === 1 ? "" : "s"}; the expected answer has ${expected.total}.` };

  const a = learner.rows.map((r) => JSON.stringify(r.map(norm)));
  const b = expected.rows.map((r) => JSON.stringify(r.map(norm)));
  if (!orderMatters) {
    a.sort();
    b.sort();
  }
  const firstDiff = a.findIndex((row, i) => row !== b[i]);
  if (firstDiff === -1) return { match: true };

  // Same rows in a different order?
  if (orderMatters && [...a].sort().join("\n") === [...b].sort().join("\n"))
    return { match: false, reason: "You have the right rows, but not in the order the question asks for. Check your ORDER BY." };
  // Same values in a different column order?
  const sortCols = (rows: string[]) => rows.map((r) => JSON.stringify((JSON.parse(r) as string[]).slice().sort())).sort().join("\n");
  if (sortCols(a) === sortCols(b)) return { match: false, reason: "The values look right, but the columns are in a different order from the question." };
  return { match: false, reason: "The row count matches, but some values differ. Check your filters and calculations." };
}
