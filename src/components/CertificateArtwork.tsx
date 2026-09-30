import { forwardRef } from "react";
import { formatDate } from "@/lib/format";

export type CertificateData = {
  recipientName: string;
  courseTitle: string;
  issuedAt: string;
  credentialId: string;
  verifyUrl: string;
  revoked?: boolean;
};

const W = 1600;
const H = 1131; // A4 landscape proportions

/** Long names shrink to fit the line. */
const nameSize = (name: string) => (name.length > 34 ? 58 : name.length > 26 ? 70 : 84);
/** "academy.example.com/verify/" and "CTA-SQL-2026-000123". */
const verifyLines = (url: string) => {
  const bare = url.replace(/^https?:\/\//, "");
  const cut = bare.lastIndexOf("/") + 1;
  return [bare.slice(0, cut), bare.slice(cut)];
};
const titleSize = (t: string) => (t.length > 42 ? 40 : 48);

/**
 * The certificate as an SVG, so it prints sharply and converts to PNG in the browser.
 * Fonts fall back to Georgia/Arial inside the downloaded image.
 */
export const CertificateArtwork = forwardRef<SVGSVGElement, { data: CertificateData }>(function CertificateArtwork({ data }, ref) {
  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const sans = "Inter, 'Segoe UI', Arial, sans-serif";
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Certificate of completion for ${data.recipientName}, ${data.courseTitle}`}>
      <rect width={W} height={H} fill="#FBF8F2" />
      <rect x="36" y="36" width={W - 72} height={H - 72} fill="none" stroke="#B38A3E" strokeWidth="3" />
      <rect x="52" y="52" width={W - 104} height={H - 104} fill="none" stroke="#D9C8A4" strokeWidth="1.5" />

      {/* Mark */}
      <g transform={`translate(${W / 2 - 42} 118) scale(0.1232)`}>
        <rect width="170" height="170" rx="30" fill="#C9A45C" />
        <g fill="#E4DACA">
          <rect x="256" width="170" height="170" rx="30" />
          <rect x="512" width="170" height="170" rx="30" />
          <rect y="256" width="170" height="170" rx="30" />
          <rect y="512" width="170" height="170" rx="30" />
          <rect x="256" y="256" width="426" height="426" rx="44" />
        </g>
      </g>

      <text x={W / 2} y="262" textAnchor="middle" fontFamily={sans} fontSize="18" fontWeight="700" letterSpacing="7" fill="#8C6A2C">
        CLOUDTECH ANALYTICS
      </text>
      <text x={W / 2} y="318" textAnchor="middle" fontFamily={serif} fontSize="40" fontWeight="700" fill="#171717" letterSpacing="2">
        CLOUDTECH ACADEMY
      </text>

      <line x1={W / 2 - 60} y1="360" x2={W / 2 + 60} y2="360" stroke="#B38A3E" strokeWidth="2" />

      <text x={W / 2} y="448" textAnchor="middle" fontFamily={serif} fontSize="58" fill="#171717">
        Certificate of Completion
      </text>
      <text x={W / 2} y="522" textAnchor="middle" fontFamily={sans} fontSize="24" fill="#5E5A52">
        This certifies that
      </text>
      <text x={W / 2} y="616" textAnchor="middle" fontFamily={serif} fontSize={nameSize(data.recipientName)} fontWeight="700" fill="#171717">
        {data.recipientName}
      </text>
      <line x1={W / 2 - 360} y1="648" x2={W / 2 + 360} y2="648" stroke="#D9C8A4" strokeWidth="1.5" />
      <text x={W / 2} y="712" textAnchor="middle" fontFamily={sans} fontSize="24" fill="#5E5A52">
        has successfully completed
      </text>
      <text x={W / 2} y="782" textAnchor="middle" fontFamily={serif} fontSize={titleSize(data.courseTitle)} fontWeight="600" fill="#8C6A2C">
        {data.courseTitle}
      </text>

      {/* Footer details */}
      <g fontFamily={sans} fill="#171717">
        <text x="200" y="930" fontSize="16" letterSpacing="3" fill="#8C6A2C" fontWeight="700">
          DATE
        </text>
        <text x="200" y="966" fontSize="26">
          {formatDate(data.issuedAt)}
        </text>
        <text x={W / 2} y="930" textAnchor="middle" fontSize="16" letterSpacing="3" fill="#8C6A2C" fontWeight="700">
          CREDENTIAL ID
        </text>
        <text x={W / 2} y="966" textAnchor="middle" fontSize="26" fontFamily="'Cascadia Code', Consolas, monospace">
          {data.credentialId}
        </text>
        <text x={W - 200} y="930" textAnchor="end" fontSize="16" letterSpacing="3" fill="#8C6A2C" fontWeight="700">
          VERIFY
        </text>
        {/* Two lines, so a long address never runs into the credential ID. */}
        <text x={W - 200} y="962" textAnchor="end" fontSize="19">
          {verifyLines(data.verifyUrl)[0]}
        </text>
        <text x={W - 200} y="990" textAnchor="end" fontSize="19">
          {verifyLines(data.verifyUrl)[1]}
        </text>
      </g>

      {data.revoked && (
        <g transform={`rotate(-18 ${W / 2} ${H / 2})`}>
          <rect x={W / 2 - 330} y={H / 2 - 70} width="660" height="140" fill="none" stroke="#9B2C1F" strokeWidth="8" />
          <text x={W / 2} y={H / 2 + 34} textAnchor="middle" fontFamily={sans} fontSize="92" fontWeight="800" fill="#9B2C1F" letterSpacing="10">
            REVOKED
          </text>
        </g>
      )}
    </svg>
  );
});

/** Renders an SVG (a certificate or a badge) to a 2x PNG at its viewBox size and downloads it. */
export async function downloadSvgPng(svg: SVGSVGElement, filename: string) {
  const { width, height } = svg.viewBox.baseVal;
  const source = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Couldn't draw the image."));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = (width || W) * 2;
    canvas.height = (height || H) * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (!blob) throw new Error("Couldn't create the image.");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const downloadCertificatePng = downloadSvgPng;
