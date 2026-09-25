// Renders SVG diagrams to PNG for a quick visual check: node scripts/preview-svg.mjs <outDir> <svg...>
import sharp from "sharp";
import path from "node:path";

const [outDir, ...files] = process.argv.slice(2);
for (const f of files) {
  const out = path.join(outDir, path.basename(f).replace(/\.svg$/, ".png"));
  await sharp(f, { density: 96 }).png().toFile(out);
  console.log("rendered", out);
}
