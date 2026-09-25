// Run SQL against the practice database from the terminal: node scripts/sql.mjs "SELECT ..."
import initSqlJs from "sql.js";
import fs from "node:fs";
const SQL = await initSqlJs();
const db = new SQL.Database(fs.readFileSync("public/datasets/logistics.sqlite"));
for (const q of process.argv.slice(2)) {
  const res = db.exec(q);
  if (!res.length) { console.log("(no rows)"); continue; }
  const { columns, values } = res[res.length - 1];
  console.log(columns.join(" | "));
  for (const row of values.slice(0, 40)) console.log(row.join(" | "));
  if (values.length > 40) console.log(`... ${values.length} rows`);
  console.log();
}
