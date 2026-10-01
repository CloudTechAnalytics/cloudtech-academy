// Sets each lesson's front-matter minutes from its content (see scripts/lib/lesson-time.mjs).
// Run: node scripts/fix-lesson-minutes.mjs [course ...]   (all courses when none are given)
import fs from "node:fs";
import path from "node:path";
import { lessonTime, roundMinutes, timingOk } from "./lib/lesson-time.mjs";

const CONTENT = "src/content";
const courses = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(CONTENT).filter((d) => fs.statSync(path.join(CONTENT, d)).isDirectory());
for (const course of courses)
  for (const f of fs.readdirSync(path.join(CONTENT, course)).filter((x) => x.endsWith(".md")).sort()) {
    const p = path.join(CONTENT, course, f);
    const raw = fs.readFileSync(p, "utf8");
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!fm) continue;
    const stated = Number(fm[1].match(/minutes:\s*(\d+)/)?.[1] ?? 0);
    const handsOn = Number(fm[1].match(/handsOn:\s*(\d+)/)?.[1] ?? 0);
    const estimate = lessonTime(raw.slice(fm[0].length), handsOn).minutes;
    if (timingOk(stated, estimate)) continue;
    const next = roundMinutes(estimate);
    fs.writeFileSync(p, raw.replace(/^(---\n[\s\S]*?minutes:\s*)\d+/, `$1${next}`));
    console.log(`${course}/${f}: ${stated} -> ${next} min`);
  }
