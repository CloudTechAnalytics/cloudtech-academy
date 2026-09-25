// Writes src/content/image-sizes.json: the pixel size of every lesson image under public/images,
// so figures render with width and height set and the page doesn't jump while they load.
// Run after adding or changing images: npm run images
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("public");
const sizes = {};
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(webp|png|jpe?g|svg)$/i.test(f)) sizes["/" + path.relative(root, p).split(path.sep).join("/")] = p;
  }
}
walk(path.join(root, "images"));
const out = {};
for (const [url, file] of Object.entries(sizes).sort()) {
  const m = await sharp(file).metadata();
  out[url] = [m.width, m.height];
}
fs.writeFileSync("src/content/image-sizes.json", JSON.stringify(out, null, 1) + "\n");
console.log(`image-sizes.json: ${Object.keys(out).length} images`);
