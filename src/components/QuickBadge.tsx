import { useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import type { QuickCourse } from "@/content/quick";
import { linkedInShareUrl, quickPostText } from "@/lib/badges";
import { SITE } from "@/lib/site";
import { Button, buttonClass } from "./Button";
import { Alert, TextField } from "./Form";
import { BadgeArtwork } from "./BadgeArtwork";
import { downloadSvgPng } from "./CertificateArtwork";
import { quickIcon } from "./QuickIcon";

/** A quick course's badge with the learner's name, ready to download and share on LinkedIn. */
export function QuickBadge({ course, name: initialName, askName = false }: { course: QuickCourse; name: string; askName?: boolean }) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const url = `${SITE.url}/quick/${course.slug}`;

  const download = async () => {
    setError(null);
    try {
      if (svg.current) await downloadSvgPng(svg.current, `cloudtech-academy-${course.slug}-badge.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't download the image.");
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-[15rem_1fr] sm:items-start">
      <BadgeArtwork
        ref={svg}
        data={{ icon: quickIcon(course.icon), kicker: `${course.minutes}-MINUTE COURSE`, stageTitle: "Skill badge", courseTitle: course.badge, recipientName: name.trim() || undefined }}
        className="h-auto w-full rounded-xl border border-line shadow-[0_24px_48px_-32px_rgba(23,23,23,0.5)]"
      />
      <div>
        {askName && (
          <div className="mb-4 max-w-sm">
            <TextField label="Your name, as it should appear on the badge" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={40} />
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Button onClick={download}>
            <Download aria-hidden className="h-4 w-4" /> Download badge
          </Button>
          <a
            href={linkedInShareUrl(quickPostText(course.badge, course.title, course.minutes, url))}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("secondary")}
          >
            <Share2 aria-hidden className="h-4 w-4" /> Share on LinkedIn
          </a>
        </div>
        <p className="mt-3 text-[0.875rem] text-muted">Download the badge first, then attach it to the LinkedIn post, which is already written for you.</p>
        {error && (
          <div className="mt-3">
            <Alert tone="error">{error}</Alert>
          </div>
        )}
      </div>
    </div>
  );
}
