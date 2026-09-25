/// <reference lib="webworker" />
/**
 * Runs learner SQL in SQLite compiled to WebAssembly, inside a Web Worker.
 * Each browser tab gets its own in-memory copy of the practice database, so nothing a
 * learner types can affect anyone else, and a runaway query can be stopped by
 * terminating the worker.
 */
import initSqlJs, { type Database } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

type Request = { id: number; type: "exec"; sql: string; maxRows?: number } | { id: number; type: "reset" };

/** Rows sent back for display. Answer checks ask for more so they compare complete results. */
const DISPLAY_ROWS = 500;
let dbPromise: Promise<Database> | null = null;

async function openDatabase() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const res = await fetch("/datasets/logistics.sqlite");
  if (!res.ok) throw new Error("Couldn't load the practice database.");
  return new SQL.Database(new Uint8Array(await res.arrayBuffer()));
}

self.onmessage = async (e: MessageEvent<Request>) => {
  const msg = e.data;
  try {
    if (msg.type === "reset") {
      if (dbPromise) (await dbPromise).close();
      dbPromise = openDatabase();
      await dbPromise;
      self.postMessage({ id: msg.id, ok: true });
      return;
    }
    dbPromise ??= openDatabase();
    const db = await dbPromise;
    const started = performance.now();
    const results = db.exec(msg.sql);
    const last = results[results.length - 1];
    self.postMessage({
      id: msg.id,
      ok: true,
      columns: last?.columns ?? [],
      rows: (last?.values ?? []).slice(0, msg.maxRows ?? DISPLAY_ROWS),
      total: last?.values.length ?? 0,
      ms: Math.round(performance.now() - started),
    });
  } catch (err) {
    self.postMessage({ id: msg.id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
