/**
 * Course overview videos: what links and files are accepted, and how a link becomes something the page can play.
 * Dependency-free so scripts/test-video.mjs can check it.
 */

/** Video files an admin may upload, and the extension each is stored with. */
export const VIDEO_FILE_TYPES: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" };
/** Thumbnail images an admin may upload. */
export const THUMBNAIL_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
export const THUMBNAIL_MAX_BYTES = 2 * 1024 * 1024;
/** The default and the allowed range of the upload size limit, in megabytes. The storage bucket sets the hard ceiling. */
export const DEFAULT_VIDEO_MAX_MB = 100;
export const MAX_VIDEO_MB_CEILING = 500;

export type VideoKind = "file" | "youtube" | "vimeo";
export type ParsedVideoUrl = { kind: VideoKind; /** What to put in the video tag (file) or the iframe (youtube, vimeo). */ src: string };

const FILE_EXT = /\.(mp4|webm|mov)$/i;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** A link an admin pasted, checked and turned into a safe address to play. Only https links are accepted. */
export function parseVideoUrl(input: string): { ok: true; value: ParsedVideoUrl } | { ok: false; error: string } {
  const text = input.trim();
  if (!text) return { ok: false, error: "Enter a video link." };
  let u: URL;
  try {
    u = new URL(text);
  } catch {
    return { ok: false, error: "That doesn't look like a web address. Paste the full link, starting with https://." };
  }
  if (u.protocol !== "https:") return { ok: false, error: "Use a link that starts with https://." };
  if (u.username || u.password) return { ok: false, error: "The link must not contain a user name or password." };
  const host = u.hostname.toLowerCase().replace(/^www\./, "");

  if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com" || host === "youtube-nocookie.com") {
    const parts = u.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be" ? parts[0] : parts[0] === "watch" ? (u.searchParams.get("v") ?? "") : ["embed", "shorts", "live", "v"].includes(parts[0]) ? (parts[1] ?? "") : "";
    if (!YOUTUBE_ID.test(id)) return { ok: false, error: "That YouTube link doesn't point to a single video. Paste the link of the video page." };
    return { ok: true, value: { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` } };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = u.pathname.split("/").filter(Boolean);
    const idIndex = host === "player.vimeo.com" ? (parts[0] === "video" ? 1 : -1) : 0;
    const id = idIndex >= 0 ? (parts[idIndex] ?? "") : "";
    if (!/^\d{5,12}$/.test(id)) return { ok: false, error: "That Vimeo link doesn't point to a single video. Paste the link of the video page." };
    const hash = u.searchParams.get("h") ?? (/^[a-f0-9]{8,20}$/i.test(parts[idIndex + 1] ?? "") ? parts[idIndex + 1] : "");
    return { ok: true, value: { kind: "vimeo", src: `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}` } };
  }

  if (FILE_EXT.test(u.pathname)) return { ok: true, value: { kind: "file", src: u.toString() } };
  return { ok: false, error: "Use a YouTube or Vimeo link, or a direct link to a .mp4, .webm or .mov file." };
}

/** Why a chosen video file can't be uploaded, or null when it is fine. */
export function videoFileProblem(file: { type: string; size: number }, maxMb: number): string | null {
  if (!(file.type in VIDEO_FILE_TYPES)) return "Choose an MP4, WebM or MOV video file.";
  if (file.size <= 0) return "That file is empty.";
  if (file.size > maxMb * 1024 * 1024) return `That video is ${formatBytes(file.size)}, over the ${maxMb} MB limit. Compress it, or ask for a higher limit below.`;
  return null;
}

export function thumbnailProblem(file: { type: string; size: number }): string | null {
  if (!(file.type in THUMBNAIL_TYPES)) return "Use a PNG, JPEG or WebP image for the thumbnail.";
  if (file.size > THUMBNAIL_MAX_BYTES) return "That thumbnail is over 2 MB. Choose a smaller image.";
  return null;
}

export function formatBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

/** A safe file name for storage: the course folder, then a random name. */
export function storageKey(courseId: string, kind: "video" | "thumb", mime: string, id: string): string {
  const ext = VIDEO_FILE_TYPES[mime] ?? THUMBNAIL_TYPES[mime] ?? "bin";
  return `${courseId.replace(/[^A-Za-z0-9._-]/g, "-")}/${kind === "thumb" ? "thumb-" : ""}${id}.${ext}`;
}
