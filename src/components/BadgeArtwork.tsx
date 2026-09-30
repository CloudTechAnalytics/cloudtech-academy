import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";

const HOST = SITE.url.replace(/^https?:\/\//, "");

export type BadgeData = {
  kind: "module_badge" | "course_completion";
  badgeName: string;
  courseTitle: string;
  icon: LucideIcon;
  /** Earned badges carry these; previews (course pages, the Certificates page) leave them out. */
  recipientName?: string;
  issuedAt?: string;
  credentialId?: string;
};

const S = 1200; // square, the shape LinkedIn shows best in a post

/** Long names shrink to fit. */
const ribbonSize = (t: string) => (t.length > 26 ? 38 : t.length > 20 ? 44 : 50);
const titleSize = (t: string) => (t.length > 34 ? 36 : 42);

/**
 * A CloudTech Academy badge as an SVG: a brass medal on certificate paper, with the learner's
 * name, the date, the credential ID and where to verify it, so it stands on its own as a
 * micro-credential when shared or downloaded.
 */
export const BadgeArtwork = forwardRef<SVGSVGElement, { data: BadgeData; className?: string }>(function BadgeArtwork(
  { data, className = "h-auto w-full" },
  ref,
) {
  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const sans = "Inter, 'Segoe UI', Arial, sans-serif";
  const mono = "'Cascadia Code', Consolas, 'Courier New', monospace";
  const Icon = data.icon;
  const completion = data.kind === "course_completion";
  const cx = S / 2;
  const cy = 430;
  const gid = `medal-${completion ? "c" : "m"}`;
  const earned = !!data.recipientName;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${S} ${S}`}
      className={className}
      role="img"
      aria-label={`${data.badgeName} badge${earned ? `, awarded to ${data.recipientName}` : ""}`}
    >
      <defs>
        <radialGradient id={gid} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={completion ? "#DDBB74" : "#D2AE66"} />
          <stop offset="100%" stopColor={completion ? "#7A5C24" : "#8C6A2C"} />
        </radialGradient>
      </defs>
      <rect width={S} height={S} fill="#FBF8F2" />
      <rect x="32" y="32" width={S - 64} height={S - 64} fill="none" stroke="#B38A3E" strokeWidth={completion ? 6 : 3} />
      {completion && <rect x="48" y="48" width={S - 96} height={S - 96} fill="none" stroke="#D9C8A4" strokeWidth="1.5" />}

      {/* Issuer */}
      <g transform={`translate(${cx - 172} 98) scale(0.0411)`}>
        <rect width="170" height="170" rx="30" fill="#C9A45C" />
        <g fill="#E4DACA">
          <rect x="256" width="170" height="170" rx="30" />
          <rect x="512" width="170" height="170" rx="30" />
          <rect y="256" width="170" height="170" rx="30" />
          <rect y="512" width="170" height="170" rx="30" />
          <rect x="256" y="256" width="426" height="426" rx="44" />
        </g>
      </g>
      <text x={cx - 128} y="121" fontFamily={sans} fontSize="24" fontWeight="700" letterSpacing="7" fill="#8C6A2C">
        CLOUDTECH ACADEMY
      </text>

      {/* Medal */}
      <circle cx={cx} cy={cy} r="232" fill="none" stroke="#D9C8A4" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="208" fill={`url(#${gid})`} />
      <circle cx={cx} cy={cy} r="180" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="3" />
      <Icon x={cx - 84} y={cy - 104} width={168} height={168} color="#FFFFFF" strokeWidth={1.6} />
      <text x={cx} y={cy + 122} textAnchor="middle" fontFamily={sans} fontSize="20" fontWeight="700" letterSpacing="6" fill="#FFFFFF" fillOpacity="0.9">
        {completion ? "COURSE COMPLETION" : "MODULE BADGE"}
      </text>

      {/* Ribbon with the badge name */}
      <path d={`M${cx - 360} 604 h720 l-34 46 l34 46 h-720 l34 -46 Z`} fill="#171717" />
      <text x={cx} y="666" textAnchor="middle" fontFamily={serif} fontSize={ribbonSize(data.badgeName)} fontWeight="700" fill="#F8F5EF">
        {data.badgeName}
      </text>

      <text x={cx} y="772" textAnchor="middle" fontFamily={serif} fontSize={titleSize(data.courseTitle)} fontWeight="600" fill="#171717">
        {completion ? (data.badgeName === data.courseTitle ? "Course completion credential" : data.courseTitle) : `Module of ${data.courseTitle}`}
      </text>

      {earned ? (
        <>
          <text x={cx} y="850" textAnchor="middle" fontFamily={sans} fontSize="30" fill="#2A2926">
            {`Awarded to ${data.recipientName}`}
          </text>
          {data.issuedAt && (
            <text x={cx} y="896" textAnchor="middle" fontFamily={sans} fontSize="24" fill="#5E5A52">
              {formatDate(data.issuedAt)}
            </text>
          )}
          <line x1="140" y1="966" x2={S - 140} y2="966" stroke="#E4DACA" strokeWidth="2" />
          {data.credentialId && (
            <>
              <text x="140" y="1024" fontFamily={sans} fontSize="16" fontWeight="700" letterSpacing="3" fill="#8C6A2C">
                CREDENTIAL ID
              </text>
              <text x="140" y="1062" fontFamily={mono} fontSize="28" fill="#171717">
                {data.credentialId}
              </text>
              <text x={S - 140} y="1024" textAnchor="end" fontFamily={sans} fontSize="16" fontWeight="700" letterSpacing="3" fill="#8C6A2C">
                VERIFY
              </text>
              <text x={S - 140} y="1062" textAnchor="end" fontFamily={sans} fontSize="22" fill="#171717">
                {`${HOST}/credentials`}
              </text>
            </>
          )}
        </>
      ) : (
        <text x={cx} y="866" textAnchor="middle" fontFamily={sans} fontSize="24" letterSpacing="2" fill="#8C6A2C">
          {HOST}
        </text>
      )}
    </svg>
  );
});
