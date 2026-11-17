import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowLeft, ChevronDown, LogOut, Settings, Shield, School } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getBackend } from "@/lib/backend";

/** The account menu in the LMS and admin top bars: profile settings, back to the website, and sign out. */
export function UserMenu({ classroom }: { classroom?: string | null }) {
  const auth = useAuth();
  const inAdmin = useLocation().pathname.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const user = auth.user;
  const initials = (user?.fullName || user?.email || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const signOut = async () => {
    setOpen(false);
    await (await getBackend()).signOut();
    // A fresh load of the home page: pages that need an account would otherwise send you to sign in on the way out.
    window.location.replace("/");
  };
  const item = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[0.9375rem] text-ink hover:bg-sand";

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" className="flex items-center gap-1 rounded-full pr-1 hover:bg-sand">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass-button text-[0.75rem] font-semibold text-on-brass">{initials}</span>
        <ChevronDown aria-hidden className="h-4 w-4 text-muted" />
        <span className="sr-only">Account menu</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-11 z-50 w-60 rounded-xl border border-line bg-paper p-1.5 shadow-[0_24px_48px_-24px_rgba(23,23,23,0.35)]">
          <div className="px-3 pb-2 pt-1.5">
            <p className="truncate font-semibold">{user?.fullName || "Your account"}</p>
            <p className="truncate text-[0.8125rem] text-muted">{user?.email}</p>
          </div>
          <div className="border-t border-line pt-1.5">
            <Link role="menuitem" to="/profile" className={item} onClick={() => setOpen(false)}>
              <Settings aria-hidden className="h-4 w-4 text-muted" /> Profile settings
            </Link>
            {classroom && (
              <Link role="menuitem" to={classroom} className={item} onClick={() => setOpen(false)}>
                <School aria-hidden className="h-4 w-4 text-muted" /> My classroom
              </Link>
            )}
            {user?.role === "admin" && !inAdmin && (
              <Link role="menuitem" to="/admin" className={item} onClick={() => setOpen(false)}>
                <Shield aria-hidden className="h-4 w-4 text-muted" /> Admin
              </Link>
            )}
            <Link role="menuitem" to="/" className={item} onClick={() => setOpen(false)}>
              <ArrowLeft aria-hidden className="h-4 w-4 text-muted" /> Back to website
            </Link>
          </div>
          <div className="mt-1.5 border-t border-line pt-1.5">
            <button role="menuitem" type="button" onClick={() => void signOut()} className={item}>
              <LogOut aria-hidden className="h-4 w-4 text-muted" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
