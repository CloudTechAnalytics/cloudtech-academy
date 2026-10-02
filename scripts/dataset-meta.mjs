// Reads every practice dataset in public/datasets and writes:
//   src/content/dataset-meta.json  rows, size, column types, missing values and a preview per file,
//                                  used by the project pages' data cards
//   public/datasets/<id>.zip       every file of a dataset in one download
// Run after changing a dataset: `npm run datasets:meta` (`npm run datasets` runs it too).
// `npm run test:content` fails if the JSON is out of date.
import fs from "node:fs";
import path from "node:path";
import { zipSync } from "fflate";
import { parseCsv } from "./lib/csv-parse.mjs";

const root = path.join(process.cwd(), "public", "datasets");
const out = path.join(process.cwd(), "src", "content", "dataset-meta.json");
const PREVIEW_ROWS = 6;

const isNumber = (v) => /^-?\d+(\.\d+)?$/.test(v);
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v);

function describe(values) {
  const filled = values.filter((v) => v.trim() !== "");
  const type = filled.length && filled.every(isNumber) ? "number" : filled.length && filled.every(isDate) ? "date" : "text";
  const distinct = new Set(filled).size;
  const col = { type, missing: values.length - filled.length, distinct };
  if (type === "number" || type === "date") {
    const sorted = type === "number" ? filled.map(Number).sort((a, b) => a - b) : [...filled].sort();
    col.min = sorted[0];
    col.max = sorted[sorted.length - 1];
  }
  return col;
}

const datasets = {};
for (const id of fs.readdirSync(root).sort()) {
  const dir = path.join(root, id);
  if (!fs.statSync(dir).isDirectory()) continue;
  const files = {};
  const zip = {};
  // Every file goes in the ZIP (the Linux course has logs and text files); CSVs are also described.
  for (const name of fs.readdirSync(dir).sort()) {
    const buf = fs.readFileSync(path.join(dir, name));
    zip[name] = [new Uint8Array(buf), { mtime: new Date("2026-01-01T00:00:00Z") }];
    if (!name.endsWith(".csv")) continue;
    const [header, ...body] = parseCsv(buf.toString("utf8").replace(/^﻿/, ""));
    files[name.replace(/\.csv$/, "")] = {
      rows: body.length,
      bytes: buf.length,
      columns: header.map((h, i) => ({ name: h, ...describe(body.map((r) => r[i] ?? "")) })),
      preview: body.slice(0, PREVIEW_ROWS),
    };
  }
  const zipped = zipSync(zip, { level: 9 });
  fs.writeFileSync(path.join(root, `${id}.zip`), zipped);
  datasets[id] = { zipBytes: zipped.length, files };
  console.log(`${id}: ${Object.keys(files).length} files, ${id}.zip ${(zipped.length / 1024).toFixed(0)} KB`);
}

fs.writeFileSync(out, JSON.stringify(datasets, null, 1) + "\n");
console.log(`wrote ${path.relative(process.cwd(), out)}`);
