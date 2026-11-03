import { forwardRef, useId } from "react";
import type { CertificateType, PublicCertificate, TrainingType } from "@/lib/backend";
import { certificateTypeMeta, formatDay, issueDay, trainingPeriod, trainingTypeLabel, verifyUrl } from "@/lib/certificates";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";
import { CertificateArtwork, QrSquares } from "./CertificateArtwork";

/** Everything a template can print. "preview" is a certificate that hasn't been issued yet. */
export type CertificateRender = {
  recipientName: string;
  certificateTitle: string | null;
  /** Course or programme name. */
  courseTitle: string;
  trainingType: TrainingType;
  certificateType: CertificateType;
  instructorName: string | null;
  description: string | null;
  startDate: string | null;
  completionDate: string | null;
  issuedAt: string;
  grade: string | null;
  duration: string | null;
  /** Left out on previews: the number is assigned when the certificate is issued. */
  certificateId?: string;
  credentialId?: string | null;
  state: "valid" | "revoked" | "replaced" | "preview";
};

/** Templates admins can choose. Add a renderer here and a row in certificate_templates to offer another. */
export const TEMPLATE_IDS = ["signature", "classic"] as const;

/** Render data from a stored or public certificate. */
export const renderOf = (c: Omit<PublicCertificate, "replacedBy" | "revokedAt" | "templateId">): CertificateRender => ({
  recipientName: c.recipientName,
  certificateTitle: c.certificateTitle,
  courseTitle: c.courseTitle,
  trainingType: c.trainingType,
  certificateType: c.certificateType,
  instructorName: c.instructorName,
  description: c.description,
  startDate: c.startDate,
  completionDate: c.completionDate,
  issuedAt: c.issuedAt,
  grade: c.grade,
  duration: c.duration,
  certificateId: c.certificateId,
  credentialId: c.credentialId,
  state: c.status,
});

/** The certificate in its chosen template, as an SVG (sharp on screen, converted to PDF and PNG for download). */
export const CertificateDocument = forwardRef<SVGSVGElement, { templateId: string; data: CertificateRender }>(function CertificateDocument({ templateId, data }, ref) {
  const url = verifyUrl(SITE.url, data.certificateId ?? "CTA-0000-000000");
  if (templateId === "classic") {
    const type = certificateTypeMeta(data.certificateType);
    return (
      <CertificateArtwork
        ref={ref}
        data={{
          recipientName: data.recipientName,
          // Course certificates print the course; others print their title, or the programme.
          courseTitle: data.credentialId ? data.courseTitle : (data.certificateTitle ?? data.courseTitle),
          issuedAt: data.issuedAt,
          certificateId: data.certificateId,
          credentialId: data.credentialId ?? undefined,
          trainingLabel: trainingTypeLabel(data.trainingType),
          heading: type.heading,
          verb: type.verb,
          verifyUrl: url,
          overlay: data.state === "valid" ? undefined : data.state,
        }}
      />
    );
  }
  return <SignatureArtwork ref={ref} data={data} verifyUrl={url} />;
});

const W = 1600;
const H = 1131; // A4 landscape proportions
const PANEL = 430;
const X0 = 540; // left edge of the text
const TEXT_W = 950;

const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
const sans = "Inter, 'Segoe UI', Arial, sans-serif";
const mono = "'Cascadia Code', Consolas, monospace";
const INK = "#171717";
const MUTED = "#5E5A52";
const GOLD = "#8C6A2C";
const BRASS = "#C9A45C";
const LINE = "#D9C8A4";

/** Breaks text into lines of at most `max` characters, at spaces. */
function wrap(text: string, max: number, maxLines: number) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/[,.;:]?$/, "…");
    return kept;
  }
  return lines;
}

/** Shrinks long names so they fit the line (Playfair bold is about 0.56em per character). */
const nameSize = (name: string) => Math.max(46, Math.min(88, Math.floor(TEXT_W / (name.length * 0.56))));

/** The CloudTech tile-grid mark. */
function Mark({ x, y, size, rest = "#E4DACA", restOpacity = 1 }: { x: number; y: number; size: number; rest?: string; restOpacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 682})`}>
      <rect width="170" height="170" rx="30" fill={BRASS} />
      <g fill={rest} fillOpacity={restOpacity}>
        <rect x="256" width="170" height="170" rx="30" />
        <rect x="512" width="170" height="170" rx="30" />
        <rect y="256" width="170" height="170" rx="30" />
        <rect y="512" width="170" height="170" rx="30" />
        <rect x="256" y="256" width="426" height="426" rx="44" />
      </g>
    </g>
  );
}

function Stamp({ text }: { text: string }) {
  const cx = (PANEL + W) / 2;
  return (
    <g transform={`rotate(-16 ${cx} ${H / 2})`}>
      <rect x={cx - 340} y={H / 2 - 72} width="680" height="144" fill="#FBF8F2" fillOpacity="0.55" stroke="#9B2C1F" strokeWidth="8" />
      <text x={cx} y={H / 2 + 34} textAnchor="middle" fontFamily={sans} fontSize="92" fontWeight="800" fill="#9B2C1F" letterSpacing="10">
        {text}
      </text>
    </g>
  );
}

/**
 * "CloudTech Signature": a dark brand panel with the seal, certificate number and QR code, and the
 * award on cream. Built for LinkedIn, CVs and printing.
 */
export const SignatureArtwork = forwardRef<SVGSVGElement, { data: CertificateRender; verifyUrl: string }>(function SignatureArtwork({ data, verifyUrl: url }, ref) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const type = certificateTypeMeta(data.certificateType);
  const title = data.certificateTitle?.trim() || data.courseTitle;
  const titleSize = title.length <= 34 ? 50 : title.length <= 46 ? 42 : 38;
  const titleLines = wrap(title, titleSize >= 42 ? 46 : 52, 2);
  const titleTop = 505;
  const titleEnd = titleTop + (titleLines.length - 1) * titleSize * 1.18;
  const showProgramme = data.courseTitle.trim().toLowerCase() !== title.trim().toLowerCase();
  const programmeY = titleEnd + 50;
  const descLines = data.description ? wrap(data.description, 92, 2) : [];
  const descY = programmeY + 40;
  const year = (data.completionDate ?? issueDay(data.issuedAt)).slice(0, 4);

  const details: { label: string; value: string }[] = [
    { label: data.startDate ? "TRAINING PERIOD" : "COMPLETED", value: trainingPeriod(data.startDate, data.completionDate) || formatDate(data.issuedAt) },
    { label: "ISSUED", value: formatDate(data.issuedAt) },
  ];
  if (data.duration) details.push({ label: "DURATION", value: data.duration });
  if (data.grade) details.push({ label: "GRADE", value: data.grade });
  let dx = X0;
  const placed = details.map((d) => {
    const x = dx;
    dx += Math.max(190, Math.max(d.value.length * 11.5, d.label.length * 11) + 46);
    return { ...d, x };
  });

  const signers = [
    ...(data.instructorName ? [{ name: data.instructorName, role: "Instructor / Trainer" }] : []),
    { name: "CloudTech Academy", role: "Authorised signatory" },
  ];
  const host = url.replace(/^https?:\/\//, "").replace(/\/[^/]*$/, "");
  const ringId = `ring-${uid}`;
  const clipId = `panel-${uid}`;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${type.heading} for ${data.recipientName}: ${title}`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width={PANEL} height={H} />
        </clipPath>
        <path id={ringId} d="M 215 520 m -106 0 a 106 106 0 1 1 212 0 a 106 106 0 1 1 -212 0" />
      </defs>
      <rect width={W} height={H} fill="#FBF8F2" />

      {/* Brand panel */}
      <rect width={PANEL} height={H} fill="#1D1C19" />
      <g clipPath={`url(#${clipId})`} fill="none" stroke={BRASS} strokeOpacity="0.09" strokeWidth="1.2">
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={PANEL / 2} cy={H + 40} r={140 + i * 30} />
        ))}
      </g>
      <rect x={PANEL - 6} width="6" height={H} fill={BRASS} />
      <Mark x={PANEL / 2 - 46} y={72} size={92} rest="#F8F5EF" restOpacity={0.24} />
      <text x={PANEL / 2} y="236" textAnchor="middle" fontFamily={serif} fontSize="42" fontWeight="700" fill="#F3EBD8">
        CloudTech
      </text>
      <text x={PANEL / 2} y="268" textAnchor="middle" fontFamily={sans} fontSize="15" fontWeight="600" letterSpacing="8" fill="#D9B872">
        ACADEMY
      </text>
      <text x={PANEL / 2} y="302" textAnchor="middle" fontFamily={sans} fontSize="14" fill="#A99F8C">
        A CloudTech Analytics company
      </text>

      {/* Seal */}
      <circle cx="215" cy="520" r="126" fill="none" stroke={BRASS} strokeWidth="2.5" />
      <circle cx="215" cy="520" r="92" fill="none" stroke={BRASS} strokeWidth="1.2" strokeOpacity="0.7" />
      <text fontFamily={sans} fontSize="13.5" fontWeight="700" letterSpacing="4.2" fill={BRASS}>
        <textPath href={`#${ringId}`} startOffset="0">
          CLOUDTECH ACADEMY · VERIFIED CREDENTIAL ·
        </textPath>
      </text>
      <Mark x={215 - 27} y={470} size={54} rest="#F8F5EF" restOpacity={0.3} />
      <text x="215" y="566" textAnchor="middle" fontFamily={serif} fontSize="26" fontWeight="600" fill="#F3EBD8">
        {year}
      </text>

      {/* Number and QR code */}
      <text x={PANEL / 2} y="716" textAnchor="middle" fontFamily={sans} fontSize="13" fontWeight="700" letterSpacing="4" fill={BRASS}>
        CERTIFICATE ID
      </text>
      <text x={PANEL / 2} y="752" textAnchor="middle" fontFamily={mono} fontSize="24" fill="#F3EBD8">
        {data.certificateId ?? "Assigned on issue"}
      </text>
      <rect x={PANEL / 2 - 82} y="792" width="164" height="164" rx="10" fill="#FFFFFF" />
      {data.certificateId ? (
        <QrSquares text={url} x={PANEL / 2 - 70} y={804} size={140} />
      ) : (
        <text x={PANEL / 2} y="880" textAnchor="middle" fontFamily={sans} fontSize="15" fill={MUTED}>
          QR code on issue
        </text>
      )}
      <text x={PANEL / 2} y="990" textAnchor="middle" fontFamily={sans} fontSize="14" fontWeight="600" fill="#D9B872">
        Scan to verify
      </text>
      <text x={PANEL / 2} y="1016" textAnchor="middle" fontFamily={sans} fontSize="13" fill="#A99F8C">
        {host}
      </text>

      {/* Frame with gold corners */}
      <rect x="468" y="38" width={W - 506} height={H - 76} fill="none" stroke={LINE} strokeWidth="1.5" />
      <g stroke={GOLD} strokeWidth="3" fill="none">
        <path d="M468,88 V38 H518" />
        <path d={`M${W - 88},38 H${W - 38} V88`} />
        <path d={`M468,${H - 88} V${H - 38} H518`} />
        <path d={`M${W - 88},${H - 38} H${W - 38} V${H - 88}`} />
      </g>

      {/* The award */}
      <text x={X0} y="150" fontFamily={sans} fontSize="19" fontWeight="700" letterSpacing="6" fill={GOLD}>
        {type.heading.toUpperCase()}
      </text>
      <line x1={X0} y1="180" x2={X0 + 84} y2="180" stroke={BRASS} strokeWidth="3" />
      <text x={X0} y="262" fontFamily={sans} fontSize="24" fill={MUTED}>
        This is to certify that
      </text>
      <text x={X0} y="352" fontFamily={serif} fontSize={nameSize(data.recipientName)} fontWeight="700" fill={INK}>
        {data.recipientName}
      </text>
      <line x1={X0} y1="390" x2={X0 + 640} y2="390" stroke={LINE} strokeWidth="1.5" />
      <text x={X0} y="444" fontFamily={sans} fontSize="24" fill={MUTED}>
        {type.verb}
      </text>
      {titleLines.map((l, i) => (
        <text key={i} x={X0} y={titleTop + i * titleSize * 1.18} fontFamily={serif} fontSize={titleSize} fontWeight="600" fill={GOLD}>
          {l}
        </text>
      ))}
      <text x={X0} y={programmeY} fontFamily={sans} fontSize="21">
        {showProgramme && (
          <tspan fill={INK} fontWeight="600">
            {data.courseTitle}
            {"  ·  "}
          </tspan>
        )}
        <tspan fill={MUTED}>{trainingTypeLabel(data.trainingType)}</tspan>
      </text>
      {descLines.map((l, i) => (
        <text key={i} x={X0} y={descY + i * 28} fontFamily={sans} fontSize="18.5" fill={MUTED}>
          {l}
        </text>
      ))}

      {/* Details */}
      <g fontFamily={sans}>
        {placed.map((d) => (
          <g key={d.label}>
            <text x={d.x} y="836" fontSize="13.5" fontWeight="700" letterSpacing="3.5" fill={GOLD}>
              {d.label}
            </text>
            <text x={d.x} y="870" fontSize="21" fill={INK}>
              {d.value}
            </text>
          </g>
        ))}
      </g>

      {/* Signatures */}
      {signers.map((s, i) => {
        const x = X0 + i * 380;
        return (
          <g key={s.role}>
            <text x={x} y="968" fontFamily={serif} fontStyle="italic" fontSize="30" fill={INK}>
              {s.name}
            </text>
            <line x1={x} y1="986" x2={x + 320} y2="986" stroke={INK} strokeWidth="1.2" />
            <text x={x} y="1014" fontFamily={sans} fontSize="15" fill={MUTED}>
              {s.role}
            </text>
          </g>
        );
      })}
      <text x={W - 70} y="1064" textAnchor="end" fontFamily={sans} fontSize="13" fill="#8C877C">
        Issued by CloudTech Academy · {formatDay(issueDay(data.issuedAt))}
      </text>

      {data.state === "preview" && (
        <text
          x={(PANEL + W) / 2}
          y={H / 2 + 40}
          textAnchor="middle"
          transform={`rotate(-16 ${(PANEL + W) / 2} ${H / 2})`}
          fontFamily={sans}
          fontSize="170"
          fontWeight="800"
          letterSpacing="20"
          fill={GOLD}
          fillOpacity="0.1"
        >
          PREVIEW
        </text>
      )}
      {data.state === "revoked" && <Stamp text="REVOKED" />}
      {data.state === "replaced" && <Stamp text="REPLACED" />}
    </svg>
  );
});
