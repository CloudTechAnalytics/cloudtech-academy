import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Film, Link2, Upload } from "lucide-react";
import { getBackend, type CourseVideoAdmin, type CourseVideoInput, type VideoSource, type VideoStatus } from "@/lib/backend";
import { DEFAULT_VIDEO_MAX_MB, MAX_VIDEO_MB_CEILING, formatBytes, parseVideoUrl, thumbnailProblem, videoFileProblem } from "@/lib/video";
import { Alert, TextArea, TextField } from "@/components/Form";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { DeleteDialog } from "@/components/DeleteDialog";
import { CourseVideoPlayer } from "@/components/CourseVideo";

export type VideoDraft = Omit<CourseVideoInput, "courseId">;

/** What the panel needs from the page that uses it: where the video belongs, and how to load, save and remove it. */
export type VideoApi = {
  /** The course folder the files are stored under. */
  courseId: string;
  heading: string;
  intro: ReactNode;
  defaultTitle: string;
  /** The text of the confirmation when the video is removed. */
  removeNote: string;
  /** Advice for the people who make the videos. Shown as a note, never enforced. */
  guidance?: ReactNode;
  get: () => Promise<CourseVideoAdmin | null>;
  save: (draft: VideoDraft) => Promise<CourseVideoAdmin>;
  remove: () => Promise<void>;
  /** Called after any change, so a list elsewhere on the page can refresh its status. */
  onChange?: (video: CourseVideoAdmin | null) => void;
};

const STATUS_LABEL: Record<VideoStatus, string> = { draft: "Draft", published: "Published", unpublished: "Unpublished" };
const STATUS_CLASS: Record<VideoStatus, string> = { draft: "bg-sand text-ink", published: "bg-success-bg text-success", unpublished: "bg-brass-pale text-brass-dark" };
const fileInputCls = "mt-1.5 block w-full text-[0.875rem] file:mr-3 file:rounded-md file:border-0 file:bg-sand file:px-3 file:py-2 file:text-[0.8125rem] file:font-semibold file:text-ink hover:file:bg-line";

const minutes = (seconds: number) => (seconds < 90 ? `${Math.max(1, Math.round(seconds))} sec` : `${Math.round(seconds / 60)} min`);

/**
 * Video management for one course or one lesson: upload a file to private storage or link from YouTube, Vimeo or a
 * direct file, preview it, and save it as a draft, publish, unpublish, replace or remove it. Learners see it only while
 * it is published. Admin-only, and the database enforces that too.
 */
export function AdminVideoPanel({ api }: { api: VideoApi }) {
  const uid = useId();
  const [video, setVideo] = useState<CourseVideoAdmin | null | undefined>(undefined);
  const [maxMb, setMaxMb] = useState(DEFAULT_VIDEO_MAX_MB);
  const [limitDraft, setLimitDraft] = useState(String(DEFAULT_VIDEO_MAX_MB));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<VideoSource>("upload");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileSeconds, setFileSeconds] = useState<number | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [dropThumb, setDropThumb] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [removing, setRemoving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const apiRef = useRef(api);
  apiRef.current = api;

  const fill = useCallback((v: CourseVideoAdmin | null) => {
    setVideo(v);
    setTitle(v?.title ?? apiRef.current.defaultTitle);
    setDescription(v?.description ?? "");
    setSource(v?.source ?? "upload");
    setUrl(v?.videoUrl ?? "");
    setFile(null);
    setFileSeconds(null);
    setThumb(null);
    setDropThumb(false);
    if (fileRef.current) fileRef.current.value = "";
    if (thumbRef.current) thumbRef.current.value = "";
  }, []);

  useEffect(() => {
    let alive = true;
    setVideo(undefined);
    setMsg(null);
    (async () => {
      try {
        const [v, mb] = await Promise.all([apiRef.current.get(), getBackend().then((b) => b.admin.getCourseVideoMaxMb())]);
        if (!alive) return;
        fill(v);
        setMaxMb(mb);
        setLimitDraft(String(mb));
      } catch (e) {
        if (alive) {
          setVideo(null);
          setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't load the video." });
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [api.courseId, api.heading, api.defaultTitle, fill]);

  // Previews of files the admin has chosen but not saved yet, and the length of a chosen video.
  const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const thumbUrl = useMemo(() => (thumb ? URL.createObjectURL(thumb) : null), [thumb]);
  useEffect(() => () => void (fileUrl && URL.revokeObjectURL(fileUrl)), [fileUrl]);
  useEffect(() => () => void (thumbUrl && URL.revokeObjectURL(thumbUrl)), [thumbUrl]);
  useEffect(() => {
    setFileSeconds(null);
    if (!fileUrl) return;
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => setFileSeconds(Number.isFinite(probe.duration) && probe.duration > 0 ? probe.duration : null);
    probe.src = fileUrl;
    return () => {
      probe.onloadedmetadata = null;
      probe.removeAttribute("src");
    };
  }, [fileUrl]);

  const parsed = source === "url" && url.trim() ? parseVideoUrl(url) : null;
  const poster = thumbUrl ?? (dropThumb ? null : (video?.thumbnailUrl ?? null));
  const preview = source === "upload" ? (fileUrl ?? video?.previewUrl ?? null) : parsed?.ok ? parsed.value.src : null;
  const previewKind = source === "upload" ? "file" : parsed?.ok ? parsed.value.kind : "file";
  const status: VideoStatus = video?.status ?? "draft";
  const canThumb = source === "upload" || (parsed?.ok && parsed.value.kind === "file");
  const knownSeconds = source === "upload" ? (file ? fileSeconds : (video?.durationSeconds ?? null)) : null;

  const persist = async (next: VideoStatus, done: string) => {
    setMsg(null);
    if (title.trim().length < 3) return setMsg({ tone: "error", text: "Give the video a title of at least 3 characters." });
    if (source === "url") {
      const p = parseVideoUrl(url);
      if (!p.ok && (url.trim() || next === "published")) return setMsg({ tone: "error", text: p.ok ? "" : p.error });
    } else {
      if (!file && !video?.storagePath && next === "published") return setMsg({ tone: "error", text: "Upload a video file before publishing." });
      const problem = file ? videoFileProblem(file, maxMb) : null;
      if (problem) return setMsg({ tone: "error", text: problem });
    }
    const tproblem = thumb ? thumbnailProblem(thumb) : null;
    if (tproblem) return setMsg({ tone: "error", text: tproblem });

    setBusy(next);
    const uploaded: string[] = [];
    try {
      const b = (await getBackend()).admin;
      let storagePath = source === "upload" ? (video?.storagePath ?? null) : null;
      let mimeType = source === "upload" ? (video?.mimeType ?? null) : null;
      let sizeBytes = source === "upload" ? (video?.sizeBytes ?? null) : null;
      if (source === "upload" && file) {
        setProgress(0);
        const up = await b.uploadCourseVideoFile(api.courseId, file, setProgress);
        uploaded.push(up.path);
        storagePath = up.path;
        mimeType = up.mimeType;
        sizeBytes = up.sizeBytes;
      }
      let thumbnailPath = dropThumb || !canThumb ? null : (video?.thumbnailPath ?? null);
      if (thumb && canThumb) {
        thumbnailPath = await b.uploadCourseVideoThumbnail(api.courseId, thumb);
        uploaded.push(thumbnailPath);
      }
      const saved = await api.save({ title, description, source, videoUrl: source === "url" ? url.trim() : null, storagePath, thumbnailPath, mimeType, sizeBytes, durationSeconds: knownSeconds, status: next });
      // The record points at the new files now, so the ones it replaced can go.
      const old = [video?.storagePath, video?.thumbnailPath].filter((p): p is string => !!p && p !== saved.storagePath && p !== saved.thumbnailPath);
      if (old.length) await b.deleteCourseVideoFiles(old).catch(() => undefined);
      fill(saved);
      api.onChange?.(saved);
      setMsg({ tone: "success", text: done });
    } catch (e) {
      if (uploaded.length) await (await getBackend()).admin.deleteCourseVideoFiles(uploaded).catch(() => undefined); // don't leave files nothing points to
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save the video." });
    } finally {
      setBusy(null);
      setProgress(null);
    }
  };

  const saveLimit = async () => {
    const n = Number(limitDraft);
    setMsg(null);
    try {
      await (await getBackend()).admin.saveCourseVideoMaxMb(n);
      setMaxMb(n);
      setMsg({ tone: "success", text: `Uploads may now be up to ${n} MB.` });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save the limit." });
    }
  };

  if (video === undefined) return <p className="text-[0.9375rem] text-muted">Loading the video...</p>;

  return (
    <section aria-labelledby={`${uid}-h`} className="rounded-2xl border border-line-strong bg-paper p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={`${uid}-h`} className="flex items-center gap-2.5 font-serif text-[1.4rem]">
          <Film aria-hidden className="h-5 w-5 text-brass-dark" /> {api.heading}
        </h2>
        <span className={`rounded-full px-3 py-1 text-[0.8125rem] font-semibold ${video ? STATUS_CLASS[status] : "bg-sand text-muted"}`}>{video ? STATUS_LABEL[status] : "No video yet"}</span>
      </div>
      <p className="mt-2 text-[0.9rem] text-muted">{api.intro}</p>
      {api.guidance && <div className="mt-3 rounded-lg border border-line bg-ivory px-3.5 py-3 text-[0.8125rem] leading-relaxed text-muted">{api.guidance}</div>}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <fieldset>
            <legend className="text-[0.9375rem] font-medium">Where the video comes from</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["upload", "Upload a file", Upload],
                  ["url", "Use a link", Link2],
                ] as const
              ).map(([v, label, Icon]) => (
                <label key={v} className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-4 text-[0.9rem] font-medium ${source === v ? "border-ink bg-sand" : "border-line-strong hover:bg-sand"}`}>
                  <input type="radio" name={`${uid}-source`} value={v} checked={source === v} onChange={() => setSource(v)} className="sr-only" />
                  <Icon aria-hidden className="h-4 w-4" /> {label}
                </label>
              ))}
            </div>
          </fieldset>

          <TextField label="Video title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} hint="Say what the video teaches, so learners know before they press play." />
          <TextArea label="Description (optional)" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} />

          {source === "upload" ? (
            <div>
              <label htmlFor={`${uid}-file`} className="text-[0.9375rem] font-medium">
                {video?.storagePath ? "Replace the video file" : "Video file"}
              </label>
              <input id={`${uid}-file`} ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={fileInputCls} />
              <p className="mt-1.5 text-[0.8125rem] text-muted">
                MP4, WebM or MOV, up to {maxMb} MB.{" "}
                {video?.storagePath && !file && video.sizeBytes ? `Current file: ${formatBytes(video.sizeBytes)}${video.durationSeconds ? `, ${minutes(video.durationSeconds)}` : ""}.` : ""}
                {file ? ` Chosen: ${file.name} (${formatBytes(file.size)}${fileSeconds ? `, ${minutes(fileSeconds)}` : ""}).` : ""}
              </p>
            </div>
          ) : (
            <TextField label="Video link" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." error={url.trim() && parsed && !parsed.ok ? parsed.error : undefined} hint="A YouTube or Vimeo link, or a direct link to an .mp4, .webm or .mov file. Links must start with https://." />
          )}

          {canThumb && (
            <div>
              <label htmlFor={`${uid}-thumb`} className="text-[0.9375rem] font-medium">
                Thumbnail (optional)
              </label>
              <input id={`${uid}-thumb`} ref={thumbRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setThumb(e.target.files?.[0] ?? null)} className={fileInputCls} />
              <p className="mt-1.5 text-[0.8125rem] text-muted">PNG, JPEG or WebP, up to 2 MB. Shown before the video plays.</p>
              {(video?.thumbnailPath && !dropThumb) || thumb ? (
                <button
                  type="button"
                  onClick={() => {
                    setThumb(null);
                    setDropThumb(true);
                    if (thumbRef.current) thumbRef.current.value = "";
                  }}
                  className="mt-1 text-[0.8125rem] font-medium text-danger hover:underline"
                >
                  Remove the thumbnail
                </button>
              ) : null}
            </div>
          )}
          {source === "url" && !canThumb && <p className="text-[0.8125rem] text-muted">YouTube and Vimeo show their own thumbnail.</p>}
        </div>

        <div>
          <p className="text-[0.9375rem] font-medium">Preview</p>
          <div className="mt-2">
            {preview ? (
              <CourseVideoPlayer video={{ title: title || "Video", kind: previewKind, src: preview, poster }} />
            ) : (
              <div className="grid aspect-video w-full place-items-center rounded-2xl border border-dashed border-line-strong bg-ivory p-6 text-center text-[0.875rem] text-muted">{source === "upload" ? "Choose a video file to preview it here." : "Paste a valid link to preview it here."}</div>
            )}
          </div>
          {video?.publishedAt && status === "published" && <p className="mt-2 text-[0.8125rem] text-muted">Published {new Date(video.publishedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}.</p>}
        </div>
      </div>

      {progress !== null && (
        <div className="mt-5">
          <ProgressBar value={progress} label="Upload progress" />
          <p className="mt-1 text-[0.8125rem] text-muted">Uploading. Keep this page open until it finishes.</p>
        </div>
      )}
      {msg?.text && (
        <div className="mt-5" aria-live="polite">
          <Alert tone={msg.tone}>{msg.text}</Alert>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <Button variant="secondary" onClick={() => void persist(status, "Saved.")} loading={busy === status} disabled={!!busy}>
          {video ? "Save changes" : "Save as draft"}
        </Button>
        {status !== "published" && (
          <Button onClick={() => void persist("published", "Published. Learners can now see it.")} loading={busy === "published"} disabled={!!busy}>
            Publish
          </Button>
        )}
        {status === "published" && (
          <Button variant="secondary" onClick={() => void persist("unpublished", "Unpublished. Learners no longer see the video.")} loading={busy === "unpublished"} disabled={!!busy}>
            Unpublish
          </Button>
        )}
        {video && (
          <Button variant="ghost" onClick={() => setRemoving(true)} disabled={!!busy} className="ml-auto text-danger">
            Remove video
          </Button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-end gap-3 border-t border-line pt-5">
        <div className="w-44">
          <TextField label="Largest upload (MB)" type="number" inputMode="numeric" min={1} max={MAX_VIDEO_MB_CEILING} value={limitDraft} onChange={(e) => setLimitDraft(e.target.value)} />
        </div>
        <Button variant="secondary" onClick={() => void saveLimit()} disabled={String(maxMb) === limitDraft}>
          Save limit
        </Button>
        <p className="min-w-0 flex-1 text-[0.8125rem] text-muted">Applies to every video. The highest allowed is {MAX_VIDEO_MB_CEILING} MB, and the storage plan may set a lower ceiling.</p>
      </div>

      <DeleteDialog
        open={removing}
        title="Remove this video?"
        confirmWord="REMOVE"
        onClose={() => setRemoving(false)}
        onDelete={async () => {
          await api.remove();
          fill(null);
          api.onChange?.(null);
          setMsg({ tone: "success", text: "The video was removed." });
        }}
      >
        <p>{api.removeNote} Type REMOVE to confirm.</p>
      </DeleteDialog>
    </section>
  );
}
