import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { ChevronDown, LayoutDashboard, LogOut, Settings, Shield, UserRound } from "lucide-react";
import { AcademyLogo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ButtonLink } from "./Button";
import { NAV_LINKS } from "@/lib/site";
import { useAuth } from "@/lib/auth";
import { getBackend } from "@/lib/backend";

function AccountMenu({ name, admin }: { name: string; admin: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const item = "flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.9rem] text-ink hover:bg-sand";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-1.5 rounded-lg pl-1 pr-2 hover:bg-sand"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass-button text-[0.75rem] font-semibold text-on-brass">
          {initials || <UserRound aria-hidden className="h-4 w-4" />}
        </span>
        <span className="sr-only">Account menu</span>
        <ChevronDown aria-hidden className="h-4 w-4 text-muted" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-line bg-paper p-1.5 shadow-[0_24px_48px_-24px_rgba(23,23,23,0.35)]">
          <p className="truncate px-3 pb-2 pt-1.5 text-[0.8125rem] text-muted">{name}</p>
          <Link role="menuitem" to="/dashboard" className={item}>
            <LayoutDashboard aria-hidden className="h-4 w-4" /> Dashboard
          </Link>
          <Link role="menuitem" to="/profile" className={item}>
            <Settings aria-hidden className="h-4 w-4" /> Profile
          </Link>
          {admin && (
            <Link role="menuitem" to="/admin" className={item}>
              <Shield aria-hidden className="h-4 w-4" /> Admin
            </Link>
          )}
          <button
            role="menuitem"
            type="button"
            className={`${item} w-full`}
            onClick={async () => {
              await (await getBackend()).signOut();
              navigate("/");
            }}
          >
            <LogOut aria-hidden className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-[0.875rem] transition-colors hover:text-ink ${isActive ? "text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-brass" : "text-muted"}`;

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${scrolled || menuOpen ? "border-line bg-ivory" : "border-transparent bg-ivory/0"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-night focus:px-4 focus:py-2 focus:text-cream">
        Skip to main content
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="CloudTech Academy home" className="shrink-0">
          <AcademyLogo size="sm" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={linkCls}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {/* Auth area keeps its size while loading so the layout doesn't jump. */}
          <div className="hidden min-w-44 items-center justify-end gap-2 sm:flex">
            {auth.status === "signed-in" ? (
              <>
                <ButtonLink to="/dashboard" variant="ghost">
                  Dashboard
                </ButtonLink>
                <AccountMenu name={auth.user.fullName || auth.user.email} admin={auth.user.role === "admin"} />
              </>
            ) : auth.status === "signed-out" ? (
              <>
                <ButtonLink to="/sign-in" variant="ghost">
                  Sign in
                </ButtonLink>
                <ButtonLink to="/sign-up">Start learning</ButtonLink>
              </>
            ) : null}
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="relative block h-3 w-5">
              <span className={`absolute left-0 block h-[1.5px] w-5 bg-ink transition-all ${menuOpen ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 block h-[1.5px] bg-ink transition-all ${menuOpen ? "top-1/2 w-5 -rotate-45" : "bottom-0 w-3.5 bg-brass"}`} />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!menuOpen} className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-line bg-ivory lg:hidden">
        <div className="container-page flex min-h-full flex-col py-6">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line border-b border-line">
              {[{ to: "/", label: "Home" }, ...NAV_LINKS].map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end className={({ isActive }) => `block py-3.5 font-serif text-[1.7rem] ${isActive ? "text-brass-dark" : "text-ink"}`}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid gap-3 pt-10">
            {auth.status === "signed-in" ? (
              <>
                <ButtonLink to="/dashboard">Dashboard</ButtonLink>
                <ButtonLink to="/profile" variant="secondary">
                  Profile
                </ButtonLink>
                {auth.user.role === "admin" && (
                  <ButtonLink to="/admin" variant="secondary">
                    Admin
                  </ButtonLink>
                )}
              </>
            ) : (
              <>
                <ButtonLink to="/sign-up">Start learning free</ButtonLink>
                <ButtonLink to="/sign-in" variant="secondary">
                  Sign in
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
