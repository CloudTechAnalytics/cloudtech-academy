// Run SQL against the practice data from the terminal.
//   node scripts/sql.mjs "SELECT ..."                  logistics database (the SQL course)
//   node scripts/sql.mjs --data sales "SELECT ..."     a CSV dataset (sales, hr, legal, cleaning)
import initSqlJs from "sql.js";
import fs from "node:fs";
import { openDataset } from "./lib/csv-db.mjs";

const args = process.argv.slice(2);
let db;
if (args[0] === "--data") {
  db = await openDataset(args[1]);
  args.splice(0, 2);
} else {
  const SQL = await initSqlJs();
  db = new SQL.Database(fs.readFileSync("public/datasets/logistics.sqlite"));
}
for (const q of args) {
  const res = db.exec(q);
  if (!res.length) {
    console.log("(no rows)");
    continue;
  }
  const { columns, values } = res[res.length - 1];
  console.log(columns.join(" | "));
  for (const row of values.slice(0, 60)) console.log(row.join(" | "));
  if (values.length > 60) console.log(`... ${values.length} rows`);
  console.log();
}
