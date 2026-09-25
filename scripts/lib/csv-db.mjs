// Loads the downloadable CSV datasets into an in-memory SQLite database, so lesson answers
// can be checked against the exact files learners download.
//
// Each dataset's tables get their plain names in its own database (orders, customers, ...),
// and every table of every dataset is also available as <dataset>_<table> (sales_customers).
import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("public/datasets");

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export const datasetNames = () => fs.readdirSync(ROOT).filter((f) => fs.statSync(path.join(ROOT, f)).isDirectory());

function loadTable(db, table, file) {
  const [header, ...rows] = parseCsv(fs.readFileSync(file, "utf8"));
  const numeric = header.map((_, c) => rows.every((r) => r[c] === "" || /^-?\d+(\.\d+)?$/.test(r[c])));
  db.run(`CREATE TABLE "${table}" (${header.map((h, c) => `"${h}" ${numeric[c] ? "NUMERIC" : "TEXT"}`).join(", ")})`);
  const stmt = db.prepare(`INSERT INTO "${table}" VALUES (${header.map(() => "?").join(", ")})`);
  db.run("BEGIN");
  for (const r of rows) stmt.run(r.map((v, c) => (v === "" ? null : numeric[c] ? Number(v) : v)));
  db.run("COMMIT");
  stmt.free();
}

let SQL;
/** A database with `dataset`'s tables under plain names, plus every dataset's tables prefixed. */
export async function openDataset(dataset) {
  SQL ??= await initSqlJs();
  const db = new SQL.Database();
  for (const ds of datasetNames()) {
    for (const f of fs.readdirSync(path.join(ROOT, ds)).filter((x) => x.endsWith(".csv"))) {
      const name = f.replace(/\.csv$/, "");
      loadTable(db, `${ds}_${name}`, path.join(ROOT, ds, f));
      if (ds === dataset) loadTable(db, name, path.join(ROOT, ds, f));
    }
  }
  return db;
}

/** Runs SQL and returns the last statement's rows. */
export function query(db, sql) {
  const res = db.exec(sql);
  const last = res[res.length - 1];
  return last ? { columns: last.columns, rows: last.values } : { columns: [], rows: [] };
}
