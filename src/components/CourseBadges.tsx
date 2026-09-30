import { useRef, useState } from "react";
import { Download, Lock, Share2 } from "lucide-react";
import type { Course } from "@/content/types";
import { BADGE_STAGES, linkedInPostUrl, type BadgeId } from "@/lib/badges";
import { SITE } from "@/lib/site";
import { Button, buttonClass } from "./Button";
import { Alert } from "./Form";
import { BadgeArtwork } from "./BadgeArtwork";
import { downloadSvgPng } from "./CertificateArtwork";

/** One course's stage badges on the dashboard: earned ones can be downloaded and shared on LinkedIn. */
export function CourseBadges({ course, earned, recipientName }: { course: Course; earned: Set<BadgeId>; recipientName: string }) {
  const [open, setOpen] = useState<BadgeId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const stage = BADGE_STAGES.find((s) => s.id === open);
  const courseUrl = `${SITE.url}/courses/${course.slug}`;

  const download = async () => {
    setError(null);
    try {
      if (svg.current && stage) await downloadSvgPng(svg.current, `cloudtech-academy-${course.slug}-${stage.id}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't download the image.");
    }
  };

  return (
    <li className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-serif text-[1.2rem]">{course.title}</p>
        <p className="text-[0.8125rem] text-muted">
          {earned.size} of {BADGE_STAGES.length} badges
        </p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BADGE_STAGES.map((s) => {
          const has = earned.has(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={!has}
                onClick={() => setOpen(open === s.id ? null : s.id)}
                aria-pressed={open === s.id}
                className={`w-full rounded-xl border p-2 text-left transition-colors ${open === s.id ? "border-brass bg-brass-pale/40" : "border-line hover:border-line-strong"} disabled:cursor-default`}
              >
                <span className={`block overflow-hidden rounded-lg ${has ? "" : "opacity-35 grayscale"}`}>
                  <BadgeArtwork data={{ stage: s.id, stageTitle: s.title, courseTitle: course.title }} />
                </span>
                <span className="mt-2 block text-[0.8125rem] font-semibold">{s.title}</span>
                <span className="mt-0.5 flex items-center gap-1 text-[0.75rem] text-muted">
                  {has ? (
                    "Earned. Share it"
                  ) : (
                    <>
                      <Lock aria-hidden className="h-3 w-3" /> {s.requirement}
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {stage && (
        <div className="mt-5 grid gap-5 rounded-xl border border-line bg-ivory p-4 sm:grid-cols-[14rem_1fr] sm:p-5">
          <BadgeArtwork
            ref={svg}
            data={{ stage: stage.id, stageTitle: stage.title, courseTitle: course.title, recipientName }}
            className="h-auto w-full rounded-lg border border-line"
          />
          <div>
            <p className="font-serif text-[1.25rem]">{stage.title}</p>
            <p className="mt-1 text-[0.9375rem] text-muted">
              Share your progress. Download the badge, then click Share on LinkedIn: the post is written for you, so just attach the image and post.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={download}>
                <Download aria-hidden className="h-4 w-4" /> Download badge
              </Button>
              <a
                href={linkedInPostUrl(stage, course.title, courseUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("secondary")}
              >
                <Share2 aria-hidden className="h-4 w-4" /> Share on LinkedIn
              </a>
            </div>
            {error && (
              <div className="mt-3">
                <Alert tone="error">{error}</Alert>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
