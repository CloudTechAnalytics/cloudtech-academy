import { forwardRef } from "react";
import { BookCheck, ClipboardCheck, Footprints, Mountain, type LucideIcon } from "lucide-react";
import type { BadgeId } from "@/lib/badges";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";

const HOST = SITE.url.replace(/^https?:\/\//, "");

export type BadgeData = {
  /** A course stage; quick-course badges pass their own icon and kicker instead. */
  stage?: BadgeId;
  icon?: LucideIcon;
  kicker?: string;
  /** Text on the ribbon. */
  stageTitle: string;
  courseTitle: string;
  /** Omitted on the Certificates page examples. */
  recipientName?: string;
  earnedAt?: string;
};

const S = 1200; // square, the shape LinkedIn shows best in a post

const ICONS: Record<BadgeId, LucideIcon> = { started: Footprints, halfway: Mountain, lessons: BookCheck, assessment: ClipboardCheck };
const STAGE_NUMBER: Record<BadgeId, number> = { started: 1, halfway: 2, lessons: 3, assessment: 4 };

const titleSize = (t: string) => (t.length > 34 ? 40 : t.length > 30 ? 46 : 56);

/** A badge as an SVG: a brass medal with an icon, on the certificate's paper. Used for course stages and quick courses. */
export const BadgeArtwork = forwardRef<SVGSVGElement, { data: BadgeData; className?: string }>(function BadgeArtwork(
  { data, className = "h-auto w-full" },
  ref,
) {
  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const sans = "Inter, 'Segoe UI', Arial, sans-serif";
  const Icon = data.stage ? ICONS[data.stage] : (data.icon ?? ClipboardCheck);
  const kicker = data.stage ? `STAGE ${STAGE_NUMBER[data.stage]} OF 4` : (data.kicker ?? "SKILL BADGE");
  const cx = S / 2;
  const cy = 500;
  const gid = `medal-${data.stage ?? "quick"}`;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${S} ${S}`}
      className={className}
      role="img"
      aria-label={`${data.stageTitle} badge, ${data.courseTitle}`}
    >
      <defs>
        <radialGradient id={gid} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#D2AE66" />
          <stop offset="100%" stopColor="#8C6A2C" />
        </radialGradient>
      </defs>
      <rect width={S} height={S} fill="#FBF8F2" />
      <rect x="32" y="32" width={S - 64} height={S - 64} fill="none" stroke="#B38A3E" strokeWidth="3" />

      <text x={cx} y="138" textAnchor="middle" fontFamily={sans} fontSize="24" fontWeight="700" letterSpacing="8" fill="#8C6A2C">
        CLOUDTECH ACADEMY
      </text>

      {/* Medal */}
      <circle cx={cx} cy={cy} r="262" fill="none" stroke="#D9C8A4" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="236" fill={`url(#${gid})`} />
      <circle cx={cx} cy={cy} r="206" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="3" />
      <Icon x={cx - 95} y={cy - 110} width={190} height={190} color="#FFFFFF" strokeWidth={1.6} />
      <text
        x={cx}
        y={cy + 150}
        textAnchor="middle"
        fontFamily={sans}
        fontSize="22"
        fontWeight="700"
        letterSpacing="6"
        fill="#FFFFFF"
        fillOpacity="0.85"
      >
        {kicker}
      </text>

      {/* Ribbon */}
      <path d={`M${cx - 330} 700 h660 l-34 50 l34 50 h-660 l34 -50 Z`} fill="#171717" />
      <text x={cx} y="767" textAnchor="middle" fontFamily={serif} fontSize="46" fontWeight="700" fill="#F8F5EF">
        {data.stageTitle}
      </text>

      <text x={cx} y="905" textAnchor="middle" fontFamily={serif} fontSize={titleSize(data.courseTitle)} fontWeight="600" fill="#171717">
        {data.courseTitle}
      </text>
      <text x={cx} y="985" textAnchor="middle" fontFamily={sans} fontSize="28" fill="#5E5A52">
        {data.recipientName ? `Awarded to ${data.recipientName}${data.earnedAt ? ` · ${formatDate(data.earnedAt)}` : ""}` : HOST}
      </text>
      {data.recipientName && (
        <text x={cx} y="1080" textAnchor="middle" fontFamily={sans} fontSize="22" letterSpacing="2" fill="#8C6A2C">
          {HOST}
        </text>
      )}
    </svg>
  );
});
