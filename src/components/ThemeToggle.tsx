import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

/** Sun/moon button, as on The Counsel's navbar. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className={`flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-ink ${className}`}
    >
      {dark ? <Sun aria-hidden className="h-4.5 w-4.5" strokeWidth={1.75} /> : <Moon aria-hidden className="h-4.5 w-4.5" strokeWidth={1.75} />}
    </button>
  );
}
