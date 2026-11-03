import { useEffect, useRef, type ReactNode } from "react";

/**
 * The dropdown panel of a <details> row menu. It is positioned against the viewport (not the table), so a menu in a table
 * that scrolls or clips its contents is never cut off. It opens below the button, or above it when there is no room, and
 * closes on scroll, resize, Escape and a click elsewhere.
 */
export function MenuPanel({ className = "w-56", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panel = ref.current;
    const details = panel?.closest("details");
    if (!panel || !details) return;
    let openedAt = 0;
    const close = () => details.removeAttribute("open");
    // Scrolling closes the menu (it is fixed to the screen), but not the tiny scroll that can come with opening it.
    const onScroll = () => {
      if (Date.now() - openedAt > 400) close();
    };
    const place = () => {
      if (!details.open) {
        panel.style.visibility = "hidden";
        return;
      }
      const s = details.querySelector("summary")?.getBoundingClientRect();
      if (!s) return;
      const w = panel.offsetWidth;
      const h = panel.offsetHeight;
      const left = Math.max(8, Math.min(window.innerWidth - w - 8, s.right - w));
      const below = s.bottom + 4;
      const top = below + h > window.innerHeight - 8 && s.top - h - 4 > 8 ? s.top - h - 4 : below;
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.visibility = "visible";
    };
    // The click comes before the browser's own toggle event and any scroll that opening it causes.
    const onClick = () => {
      openedAt = Date.now();
    };
    const onToggle = () => requestAnimationFrame(place);
    const onOutside = (e: MouseEvent) => {
      if (details.open && !details.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    details.addEventListener("click", onClick, true);
    details.addEventListener("toggle", onToggle);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      details.removeEventListener("click", onClick, true);
      details.removeEventListener("toggle", onToggle);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <div ref={ref} style={{ visibility: "hidden" }} className={`fixed left-0 top-0 z-50 overflow-hidden rounded-xl border border-line bg-paper py-1 shadow-[0_16px_40px_-20px_rgba(23,23,23,0.45)] ${className}`}>
      {children}
    </div>
  );
}
