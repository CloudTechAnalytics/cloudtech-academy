// Renders an ad video: steps a page's timeline frame by frame, screenshots each frame and stitches an MP4 with ffmpeg.
//
//   node marketing/ads/video/render-video.cjs <page.html> <out.mp4> <width> <height> [fps]
//
// Needs: playwright (npm i -D playwright, then npx playwright install chromium) and ffmpeg with libx264.
// Set FFMPEG to the ffmpeg path if it is not on PATH. The page must define window.DURATION (seconds) and window.render(t).
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require(process.env.PLAYWRIGHT_PATH || "playwright");
}

const [, , page, out, w, h, fpsArg] = process.argv;
if (!page || !out || !w || !h) {
  console.error("usage: node render-video.cjs <page.html> <out.mp4> <width> <height> [fps]");
  process.exit(1);
}
const fps = Number(fpsArg || 30);
const ffmpeg = process.env.FFMPEG || "ffmpeg";

(async () => {
  const browser = await playwright.chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
  await p.goto("file:///" + path.resolve(page).replace(/\\/g, "/"));
  await p.evaluate(() => document.fonts.ready);
  const duration = await p.evaluate(() => window.DURATION);
  const frames = Math.round(duration * fps);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "adframes-"));
  for (let i = 0; i < frames; i++) {
    await p.evaluate((t) => window.render(t), i / fps);
    fs.writeFileSync(path.join(dir, `f${String(i).padStart(5, "0")}.jpg`), await p.screenshot({ type: "jpeg", quality: 94 }));
    if (i % 60 === 0) process.stdout.write(`frame ${i}/${frames}\n`);
  }
  await browser.close();
  const r = spawnSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-framerate", String(fps), "-i", path.join(dir, "f%05d.jpg"), "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-r", String(fps), out], { stdio: "inherit" });
  fs.rmSync(dir, { recursive: true, force: true });
  if (r.status !== 0) process.exit(r.status || 1);
  console.log("wrote", out, `${duration}s ${w}x${h} @${fps}fps`);
})();
