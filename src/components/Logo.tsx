/** The CloudTech tile-grid mark, shared across CloudTech products. */
export function Mark({ className = "h-9 w-9", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 682 682" className={className} aria-hidden>
      <rect width="170" height="170" rx="30" fill="#C9A45C" />
      <g fill={light ? "#F8F5EF" : "var(--color-logo-rest)"} fillOpacity={light ? 0.22 : 1}>
        <rect x="256" width="170" height="170" rx="30" />
        <rect x="512" width="170" height="170" rx="30" />
        <rect y="256" width="170" height="170" rx="30" />
        <rect y="512" width="170" height="170" rx="30" />
        <rect x="256" y="256" width="426" height="426" rx="44" />
      </g>
    </svg>
  );
}

/** CloudTech Academy lockup: "CloudTech" with "ACADEMY" beneath, so it reads as part of the family. */
export function AcademyLogo({ size = "md", light = false }: { size?: "sm" | "md" | "lg"; light?: boolean }) {
  const s = {
    sm: { mark: "h-8 w-8", word: "text-[1.15rem]", sub: "text-[0.5rem] tracking-[0.32em]" },
    md: { mark: "h-10 w-10", word: "text-[1.3rem]", sub: "text-[0.54rem] tracking-[0.34em]" },
    lg: { mark: "h-12 w-12", word: "text-[1.8rem]", sub: "text-[0.66rem] tracking-[0.36em]" },
  }[size];
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark className={`${s.mark} shrink-0`} light={light} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif font-bold tracking-[-0.01em] ${s.word} ${light ? "text-cream" : "text-ink"}`}>CloudTech</span>
        <span className={`mt-[0.35em] pl-[0.06em] font-sans font-semibold uppercase ${s.sub} ${light ? "text-brass-light" : "text-brass-dark"}`}>
          Academy
        </span>
      </span>
    </span>
  );
}
