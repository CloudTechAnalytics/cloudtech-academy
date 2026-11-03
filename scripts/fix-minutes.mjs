// Sets the `minutes` in each lesson's front matter to the honest estimate (reading + tasks + examples),
// the same figure npm run test:content checks.   Run: node scripts/fix-minutes.mjs <folder> [<folder> ...]
import fs from "node:fs";
import path from "node:path";
import { lessonTime, roundMinutes } from "./lib/lesson-time.mjs";

for (const folder of process.argv.slice(2)) {
  const dir = path.join("src/content", folder);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md")).sort()) {
    const file = path.join(dir, f);
    const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!fm) continue;
    const handsOn = Number(fm[1].match(/handsOn:\s*(\d+)/)?.[1] ?? 0);
    const { minutes } = lessonTime(raw.slice(fm[0].length), handsOn);
    const next = roundMinutes(minutes);
    const stated = Number(fm[1].match(/minutes:\s*(\d+)/)?.[1] ?? 0);
    if (stated !== next) {
      fs.writeFileSync(file, raw.replace(/^minutes:\s*\d+/m, `minutes: ${next}`));
      console.log(`${f}: ${stated} -> ${next}`);
    }
  }
}
