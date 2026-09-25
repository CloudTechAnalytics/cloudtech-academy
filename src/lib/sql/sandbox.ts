/**
 * Talks to the SQL worker. One worker is shared by every exercise on the page.
 * Queries that run longer than TIMEOUT_MS are stopped by restarting the worker.
 */
export type SqlValue = string | number | null | Uint8Array;
export type QueryResult = { columns: string[]; rows: SqlValue[][]; total: number; ms: number };

const TIMEOUT_MS = 8000;
let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void; timer: number }>();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (e: MessageEvent<{ id: number; ok: boolean; error?: string }>) => {
    const p = pending.get(e.data.id);
    if (!p) return;
    pending.delete(e.data.id);
    clearTimeout(p.timer);
    if (e.data.ok) p.resolve(e.data);
    else p.reject(new Error(cleanError(e.data.error ?? "Query failed")));
  };
  return worker;
}

function restart(reason: string) {
  worker?.terminate();
  worker = null;
  for (const [, p] of pending) {
    clearTimeout(p.timer);
    p.reject(new Error(reason));
  }
  pending.clear();
}

function send<T>(message: Record<string, unknown>): Promise<T> {
  const id = ++seq;
  const w = getWorker();
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(
      () => restart("That query took too long, so it was stopped. Check your JOIN conditions and filters."),
      TIMEOUT_MS,
    );
    pending.set(id, { resolve: resolve as (v: unknown) => void, reject, timer });
    w.postMessage({ ...message, id });
  });
}

/** SQLite's messages are fine, but a little terse; add a nudge for the common ones. */
function cleanError(msg: string) {
  if (/no such table/i.test(msg)) return `${msg}. The tables are customers, shipments, routes, payments and employees.`;
  if (/no such column/i.test(msg)) return `${msg}. Check the spelling, and the table prefix if you're joining.`;
  if (/syntax error/i.test(msg)) return `${msg}. Check for a missing comma, bracket or quote near that point.`;
  return msg;
}

export const runQuery = (sql: string, opts?: { maxRows?: number }) => send<QueryResult>({ type: "exec", sql, maxRows: opts?.maxRows });
/** Full result, for comparing a learner's answer with the model answer. */
export const runForCheck = (sql: string) => runQuery(sql, { maxRows: 100_000 });
export const resetDatabase = () => send<unknown>({ type: "reset" });
