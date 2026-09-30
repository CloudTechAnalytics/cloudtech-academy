import type { ReactNode } from "react";
import type { PracticeProject } from "@/content/projects";

/** Decorative cover art for a practice project: a simple pattern in the project's two colours. */
export function ProjectCover({ cover, className = "" }: { cover: PracticeProject["cover"]; className?: string }) {
  const { pattern, bg, fg } = cover;
  const W = 480;
  const H = 200;
  let art: ReactNode;

  switch (pattern) {
    case "chevron":
      art = Array.from({ length: 9 }, (_, i) => (
        <polyline key={i} points={`-20,${i * 30 - 40} 120,${i * 30 + 20} 240,${i * 30 - 40} 360,${i * 30 + 20} 500,${i * 30 - 40}`} fill="none" stroke={fg} strokeWidth="11" opacity={i % 2 ? 0.55 : 0.9} />
      ));
      break;
    case "bars": {
      const heights = [60, 92, 74, 120, 104, 140, 128, 160, 118, 150, 172, 146];
      art = heights.map((h, i) => <rect key={i} x={24 + i * 37} y={H - h} width="24" height={h} rx="3" fill={fg} opacity={0.45 + (i % 4) * 0.15} />);
      break;
    }
    case "waves":
      art = Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M-10 ${40 + i * 22} C 80 ${10 + i * 22}, 160 ${70 + i * 22}, 240 ${40 + i * 22} S 400 ${10 + i * 22}, 490 ${40 + i * 22}`} fill="none" stroke={fg} strokeWidth="6" opacity={0.3 + (i % 3) * 0.25} />
      ));
      break;
    case "grid":
      art = Array.from({ length: 8 * 4 }, (_, i) => {
        const x = (i % 8) * 60 + 6;
        const y = Math.floor(i / 8) * 50 + 6;
        const lit = (i * 7) % 5 === 0;
        return <rect key={i} x={x} y={y} width="48" height="38" rx="4" fill={lit ? fg : "none"} stroke={fg} strokeWidth="2" opacity={lit ? 0.85 : 0.4} />;
      });
      break;
    case "diagonal":
      art = Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 40 - 200} y1={H + 10} x2={i * 40} y2={-10} stroke={fg} strokeWidth={i % 3 === 0 ? 14 : 5} opacity={i % 3 === 0 ? 0.85 : 0.4} />);
      break;
    case "dots":
      art = Array.from({ length: 12 * 5 }, (_, i) => {
        const x = (i % 12) * 40 + 20;
        const y = Math.floor(i / 12) * 40 + 20;
        const r = 4 + ((i * 5) % 7) * 1.6;
        return <circle key={i} cx={x} cy={y} r={r} fill={fg} opacity={0.35 + ((i * 3) % 5) * 0.13} />;
      });
      break;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden className={`block ${className}`}>
      <rect width={W} height={H} fill={bg} />
      {art}
    </svg>
  );
}
