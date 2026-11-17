import { Suspense, useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FolderCheck,
  FolderKanban,
  Layers,
  LayoutGrid,
  Mail,
  Menu,
  MessageCircle,
  School,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading, RequireAuth } from "@/lib/auth";
import { IS_LIVE } from "@/lib/backend";
import { Mark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { useLearnerHome } from "@/lib/data";

/**
 * The admin area is an app of its own, like the programme LMS: a side menu grouped by job, a top bar, and the whole
 * width of the screen for the work. No marketing header or footer.
 */

const GROUPS = [
  {
    title: "Overview",
    links: [
      { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Learning",
    links: [
      { to: "/admin/courses", label: "Courses", icon: BookOpen },
      { to: "/admin/programmes", label: "Programmes", icon: Layers },
      { to: "/admin/classroom", label: "Classroom", icon: School },
      { to: "/admin/submissions", label: "Course projects", icon: FolderCheck },
      { to: "/admin/practice", label: "Practice projects", icon: FolderKanban },
    ],
  },
  {
    title: "People",
    links: [
      { to: "/admin/students", label: "Students", icon: Users },
      { to: "/admin/applications", label: "Applications", icon: ClipboardList },
      { to: "/admin/enrollments", label: "Enrollments", icon: UserPlus },
    ],
  },
  {
    title: "Credentials and money",
    links: [
      { to: "/admin/credentials", label: "Badges & credentials", icon: BadgeCheck },
      { to: "/admin/certificates", label: "Certificates", icon: Award },
      { to: "/admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    title: "Community",
    links: [
      { to: "/admin/emails", label: "Emails", icon: Mail },
      { to: "/admin/events", label: "Events", icon: CalendarDays },
      { to: "/admin/community", label: "Community", icon: MessageCircle },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];
const ALL = GROUPS.flatMap((g) => g.links);

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const item = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.9375rem] transition-colors ${isActive ? "bg-brass-pale/60 font-semibold text-ink" : "text-ink/75 hover:bg-sand hover:text-ink"}`;
  return (
    <nav aria-label="Admin" className="flex min-h-full flex-col">
      <div className="space-y-5">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <p className="mb-1 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-subtle">{g.title}</p>
            <ul className="space-y-0.5">
              {g.links.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={item} onClick={onNavigate}>
                    <Icon aria-hidden className="h-4 w-4 shrink-0 text-brass-dark" /> {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {!IS_LIVE && <p className="mt-6 rounded-lg border border-brass/30 bg-brass-pale/40 p-3 text-[0.8125rem]">Demo mode: changes are saved in this browser only.</p>}
    </nav>
  );
}

function Shell() {
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [location.pathname]);
  // The page's name for the top bar: the most specific menu item that matches the address.
  const current = [...ALL].sort((a, b) => b.to.length - a.to.length).find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)));
  const home = useLearnerHome();

  return (
    <div className="min-h-screen bg-ivory">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto border-r border-line bg-paper px-3 py-4 lg:flex">
        <Link to="/" className="mb-6 flex items-center gap-2.5 px-2" title="Go to the website">
          <Mark className="h-8 w-8 shrink-0" />
          <span className="leading-tight">
            <span className="block font-serif text-[1.1rem] font-bold">CloudTech</span>
            <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brass-dark">Admin</span>
          </span>
        </Link>
        <SideNav />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-10">
            <button type="button" onClick={() => setMenu(true)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sand lg:hidden" aria-label="Open admin menu">
              <Menu aria-hidden className="h-5 w-5" />
            </button>
            <Link to="/" className="lg:hidden" aria-label="Go to the website">
              <Mark className="h-7 w-7" />
            </Link>
            <p className="min-w-0 flex-1 truncate text-[0.9375rem]">
              <span className="text-muted">Admin</span>
              {current && current.to !== "/admin" && <span className="font-semibold"> / {current.label}</span>}
            </p>
            <ThemeToggle />
            <UserMenu classroom={home?.label === "My classroom" ? home.to : null} />
          </div>
        </header>
        <main id="main" className="w-full px-4 py-8 sm:px-6 lg:px-10 lg:py-10 2xl:px-14">
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {menu && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-night/40" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col overflow-y-auto bg-paper px-3 py-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="flex items-center gap-2.5">
                <Mark className="h-7 w-7" />
                <span className="font-serif text-[1.05rem] font-bold">Admin</span>
              </span>
              <button type="button" onClick={() => setMenu(false)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sand">
                <X aria-hidden className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <SideNav onNavigate={() => setMenu(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout() {
  useSeo({ title: "Admin | CloudTech Academy", description: "Academy administration.", noindex: true });
  return (
    <RequireAuth admin>
      <Shell />
    </RequireAuth>
  );
}

export function AdminHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <h1 className="font-serif text-[2rem] leading-tight">{title}</h1>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}
