import { forwardRef, useMemo } from "react";
import QRCode from "qrcode";
import { formatDate } from "@/lib/format";

export type CertificateData = {
  recipientName: string;
  courseTitle: string;
  /** Completion date. */
  issuedAt: string;
  /** Certificate number, e.g. CTA-CERT-2026-000124. Left out on previews. */
  certificateId?: string;
  /** The course completion credential it certifies, e.g. CTA-AIPF-8F72K. */
  credentialId: string;
  /** Public verification page; the QR code opens it. */
  verifyUrl: string;
  revoked?: boolean;
};

const W = 1600;
const H = 1131; // A4 landscape proportions

/** Long names shrink to fit the line. */
const nameSize = (name: string) => (name.length > 34 ? 58 : name.length > 26 ? 70 : 84);
const titleSize = (t: string) => (t.length > 42 ? 40 : 48);

/** The QR code as SVG squares, so it stays sharp and needs no image loading. */
function QrSquares({ text, x, y, size }: { text: string; x: number; y: number; size: number }) {
  const qr = useMemo(() => QRCode.create(text, { errorCorrectionLevel: "M" }), [text]);
  const n = qr.modules.size;
  const cell = size / n;
  const rects: string[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (qr.modules.get(r, c)) rects.push(`M${(x + c * cell).toFixed(2)} ${(y + r * cell).toFixed(2)}h${cell.toFixed(2)}v${cell.toFixed(2)}h-${cell.toFixed(2)}z`);
  return (
    <>
      <rect x={x - 10} y={y - 10} width={size + 20} height={size + 20} fill="#FFFFFF" />
      <path d={rects.join("")} fill="#171717" />
    </>
  );
}

/**
 * The official certificate as an SVG, so it prints sharply and converts to PNG and PDF in the
 * browser. Fonts fall back to Georgia/Arial inside the downloaded files.
 */
export const CertificateArtwork = forwardRef<SVGSVGElement, { data: CertificateData }>(function CertificateArtwork({ data }, ref) {
  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const sans = "Inter, 'Segoe UI', Arial, sans-serif";
  const mono = "'Cascadia Code', Consolas, monospace";
  const bare = data.verifyUrl.replace(/^https?:\/\//, "");
  const cut = bare.lastIndexOf("/") + 1;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Certificate of completion for ${data.recipientName}, ${data.courseTitle}`}
    >
      <rect width={W} height={H} fill="#FBF8F2" />
      <rect x="36" y="36" width={W - 72} height={H - 72} fill="none" stroke="#B38A3E" strokeWidth="3" />
      <rect x="52" y="52" width={W - 104} height={H - 104} fill="none" stroke="#D9C8A4" strokeWidth="1.5" />

      {/* Mark */}
      <g transform={`translate(${W / 2 - 42} 104) scale(0.1232)`}>
        <rect width="170" height="170" rx="30" fill="#C9A45C" />
        <g fill="#E4DACA">
          <rect x="256" width="170" height="170" rx="30" />
          <rect x="512" width="170" height="170" rx="30" />
          <rect y="256" width="170" height="170" rx="30" />
          <rect y="512" width="170" height="170" rx="30" />
          <rect x="256" y="256" width="426" height="426" rx="44" />
        </g>
      </g>

      <text x={W / 2} y="244" textAnchor="middle" fontFamily={sans} fontSize="18" fontWeight="700" letterSpacing="7" fill="#8C6A2C">
        CLOUDTECH ANALYTICS
      </text>
      <text x={W / 2} y="298" textAnchor="middle" fontFamily={serif} fontSize="40" fontWeight="700" fill="#171717" letterSpacing="2">
        CLOUDTECH ACADEMY
      </text>
      <line x1={W / 2 - 60} y1="332" x2={W / 2 + 60} y2="332" stroke="#B38A3E" strokeWidth="2" />

      <text x={W / 2} y="408" textAnchor="middle" fontFamily={serif} fontSize="56" fill="#171717">
        Certificate of Completion
      </text>
      <text x={W / 2} y="456" textAnchor="middle" fontFamily={sans} fontSize="17" fontWeight="700" letterSpacing="5" fill="#8C6A2C">
        OFFICIAL VERIFIED CERTIFICATE
      </text>
      <text x={W / 2} y="518" textAnchor="middle" fontFamily={sans} fontSize="24" fill="#5E5A52">
        This certifies that
      </text>
      <text x={W / 2} y="604" textAnchor="middle" fontFamily={serif} fontSize={nameSize(data.recipientName)} fontWeight="700" fill="#171717">
        {data.recipientName}
      </text>
      <line x1={W / 2 - 360} y1="634" x2={W / 2 + 360} y2="634" stroke="#D9C8A4" strokeWidth="1.5" />
      <text x={W / 2} y="690" textAnchor="middle" fontFamily={sans} fontSize="24" fill="#5E5A52">
        has successfully completed
      </text>
      <text x={W / 2} y="756" textAnchor="middle" fontFamily={serif} fontSize={titleSize(data.courseTitle)} fontWeight="600" fill="#8C6A2C">
        {data.courseTitle}
      </text>

      {/* Details */}
      <g fontFamily={sans} fill="#171717">
        <text x="150" y="870" fontSize="15" letterSpacing="3" fill="#8C6A2C" fontWeight="700">
          COMPLETED
        </text>
        <text x="150" y="904" fontSize="24">
          {formatDate(data.issuedAt)}
        </text>
        <text x="150" y="956" fontSize="15" letterSpacing="3" fill="#8C6A2C" fontWeight="700">
          CERTIFICATE NO.
        </text>
        <text x="150" y="990" fontSize="22" fontFamily={mono}>
          {data.certificateId ?? "Assigned on issue"}
        </text>

        <text x="560" y="870" fontSize="15" letterSpacing="3" fill="#8C6A2C" fontWeight="700">
          CREDENTIAL ID
        </text>
        <text x="560" y="904" fontSize="22" fontFamily={mono}>
          {data.credentialId}
        </text>
        <text x="560" y="956" fontSize="15" letterSpacing="3" fill="#8C6A2C" fontWeight="700">
          VERIFY AT
        </text>
        <text x="560" y="988" fontSize="18">
          {bare.slice(0, cut)}
        </text>
        <text x="560" y="1014" fontSize="18">
          {bare.slice(cut)}
        </text>

        {/* Issuer */}
        <line x1="930" y1="960" x2="1230" y2="960" stroke="#171717" strokeWidth="1.2" />
        <text x="1080" y="990" textAnchor="middle" fontSize="18" fontWeight="700">
          Authorised by CloudTech Academy
        </text>
        <text x="1080" y="1016" textAnchor="middle" fontSize="15" fill="#5E5A52">
          A CloudTech Analytics company
        </text>
      </g>

      <QrSquares text={data.verifyUrl} x={1300} y={846} size={170} />
      <text x={1385} y={1044} textAnchor="middle" fontFamily={sans} fontSize="13" fill="#5E5A52">
        Scan to verify
      </text>

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

/** Draws an SVG (a certificate or a badge) onto a canvas at twice its viewBox size. */
async function svgToCanvas(svg: SVGSVGElement) {
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
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function save(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Renders an SVG (a certificate or a badge) to a 2x PNG and downloads it. */
export async function downloadSvgPng(svg: SVGSVGElement, filename: string) {
  const canvas = await svgToCanvas(svg);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("Couldn't create the image.");
  save(blob, filename);
}

/** Renders the certificate into an A4 landscape PDF and downloads it. */
export async function downloadCertificatePdf(svg: SVGSVGElement, filename: string, title: string) {
  const [{ jsPDF }, canvas] = await Promise.all([import("jspdf"), svgToCanvas(svg)]);
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  pdf.setProperties({ title, author: "CloudTech Academy", creator: "CloudTech Academy" });
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 297, 210);
  save(pdf.output("blob"), filename);
}
