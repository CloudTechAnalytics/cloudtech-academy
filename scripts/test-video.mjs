// Checks the course video link and file rules (src/lib/video.ts). Run: node scripts/test-video.mjs
import { parseVideoUrl, videoFileProblem, thumbnailProblem, storageKey } from "../src/lib/video.ts";

let failures = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    failures++;
    console.log(`FAIL ${name}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`);
  }
};
const url = (s) => {
  const r = parseVideoUrl(s);
  return r.ok ? r.value : "error";
};

eq("youtube watch", url("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), { kind: "youtube", src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" });
eq("youtu.be", url("https://youtu.be/dQw4w9WgXcQ?t=10").kind, "youtube");
eq("youtube shorts", url("https://youtube.com/shorts/dQw4w9WgXcQ").kind, "youtube");
eq("youtube embed", url("https://www.youtube.com/embed/dQw4w9WgXcQ").kind, "youtube");
eq("youtube bad id", url("https://www.youtube.com/watch?v=short"), "error");
eq("youtube channel", url("https://www.youtube.com/@cloudtech"), "error");
eq("vimeo", url("https://vimeo.com/123456789"), { kind: "vimeo", src: "https://player.vimeo.com/video/123456789" });
eq("vimeo unlisted", url("https://vimeo.com/123456789/abcdef1234").src, "https://player.vimeo.com/video/123456789?h=abcdef1234");
eq("vimeo player", url("https://player.vimeo.com/video/123456789?h=abc12345").src, "https://player.vimeo.com/video/123456789?h=abc12345");
eq("vimeo not a video", url("https://vimeo.com/channels/staffpicks"), "error");
eq("mp4", url("https://cdn.example.com/intro.mp4?token=1").kind, "file");
eq("webm", url("https://cdn.example.com/a/intro.WEBM").kind, "file");
eq("http refused", url("http://cdn.example.com/intro.mp4"), "error");
eq("javascript refused", url("javascript:alert(1)"), "error");
eq("data refused", url("data:video/mp4;base64,AAAA"), "error");
eq("credentials refused", url("https://user:pass@cdn.example.com/intro.mp4"), "error");
eq("random page", url("https://example.com/page"), "error");
eq("empty", url("  "), "error");
eq("not a url", url("my video"), "error");

eq("mp4 file ok", videoFileProblem({ type: "video/mp4", size: 5e6 }, 100), null);
eq("avi refused", videoFileProblem({ type: "video/x-msvideo", size: 5e6 }, 100) !== null, true);
eq("too big", videoFileProblem({ type: "video/mp4", size: 101 * 1024 * 1024 }, 100) !== null, true);
eq("empty file", videoFileProblem({ type: "video/mp4", size: 0 }, 100) !== null, true);
eq("thumb ok", thumbnailProblem({ type: "image/png", size: 1000 }), null);
eq("thumb gif", thumbnailProblem({ type: "image/gif", size: 1000 }) !== null, true);
eq("thumb big", thumbnailProblem({ type: "image/jpeg", size: 3 * 1024 * 1024 }) !== null, true);
eq("storage key", storageKey("web development/x", "video", "video/mp4", "abc"), "web-development-x/abc.mp4");
eq("thumb key", storageKey("c1", "thumb", "image/webp", "abc"), "c1/thumb-abc.webp");

console.log(failures ? `\n${failures} problem(s)` : "All course video rules behave as expected.");
process.exit(failures ? 1 : 0);
