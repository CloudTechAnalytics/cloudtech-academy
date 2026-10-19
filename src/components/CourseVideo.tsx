import { useEffect, useId, useState } from "react";
import { PlayCircle } from "lucide-react";
import { getBackend, type CourseVideoPublic } from "@/lib/backend";

/**
 * A course's overview video, played in a 16:9 box that fits any screen. A file plays in the browser's own player;
 * a YouTube or Vimeo link plays in an embedded player. If the video can't load, the box says so and the page carries on.
 * Used by the admin preview too, so what an admin previews is what learners get.
 */
export function CourseVideoPlayer({ video }: { video: Pick<CourseVideoPublic, "title" | "kind" | "src" | "poster"> }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => setFailed(false), [video.src]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line-strong bg-ink shadow-[0_30px_60px_-45px_rgba(23,23,23,0.55)]">
      {failed ? (
        <div role="alert" className="absolute inset-0 grid place-items-center p-6 text-center text-ivory">
          <div>
            <p className="font-semibold">This video couldn't be loaded.</p>
            <p className="mt-1 text-[0.875rem] text-ivory/70">Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setAttempt((a) => a + 1);
              }}
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-ivory/40 px-4 text-[0.875rem] font-semibold hover:bg-ivory/10"
            >
              Try again
            </button>
          </div>
        </div>
      ) : video.kind === "file" ? (
        <video key={`${video.src}-${attempt}`} controls playsInline preload="metadata" poster={video.poster ?? undefined} aria-label={video.title} onError={() => setFailed(true)} className="absolute inset-0 h-full w-full bg-black object-contain">
          <source src={video.src} />
        </video>
      ) : (
        <iframe
          key={`${video.src}-${attempt}`}
          src={video.src}
          title={video.title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}

/**
 * The video overview section of a public course page. It loads the video from the database, and shows nothing at all
 * while there is none: no heading, no empty player. Only a published video (of a published course) is ever returned.
 */
export function CourseVideoSection({ courseId, wrap }: { courseId: string; /** Wrap in the page container, for pages that don't already provide one. */ wrap?: boolean }) {
  const [video, setVideo] = useState<CourseVideoPublic | null>(null);
  const id = useId();
  useEffect(() => {
    let alive = true;
    setVideo(null);
    (async () => {
      try {
        const v = await (await getBackend()).getCourseVideo(courseId);
        if (alive) setVideo(v);
      } catch {
        if (alive) setVideo(null); // a video problem must not affect the rest of the page
      }
    })();
    return () => {
      alive = false;
    };
  }, [courseId]);

  if (!video) return null;
  const section = (
    <section aria-labelledby={`${id}-title`} className="max-w-3xl">
      <h2 id={`${id}-title`} className="flex items-center gap-2.5 font-serif text-[1.9rem]">
        <PlayCircle aria-hidden className="h-6 w-6 text-brass-dark" /> Course overview video
      </h2>
      <div className="mt-5">
        <CourseVideoPlayer video={video} />
      </div>
      <p className="mt-4 font-medium">{video.title}</p>
      {video.description && <p className="mt-1.5 whitespace-pre-line text-[0.9375rem] leading-relaxed text-muted">{video.description}</p>}
    </section>
  );
  return wrap ? <div className="container-page pt-12 sm:pt-14">{section}</div> : section;
}
