import { Suspense, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router";
import { Award, BadgeCheck, BookOpen, FolderCheck, LayoutGrid, Users } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading, RequireAuth } from "@/lib/auth";
import { IS_LIVE } from "@/lib/backend";

const LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/submissions", label: "Submissions", icon: FolderCheck },
  { to: "/admin/credentials", label: "Badges & credentials", icon: BadgeCheck },
  { to: "/admin/certificates", label: "Certificates & payments", icon: Award },
];

export default function AdminLayout() {
  useSeo({ title: "Admin | CloudTech Academy", description: "Academy administration.", noindex: true });
  return (
    <RequireAuth admin>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-12">
        <aside>
          <p className="kicker mb-3 hidden lg:block">Admin</p>
          <nav aria-label="Admin" className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:overflow-visible">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[0.9375rem] ${isActive ? "bg-sand font-semibold text-ink" : "text-muted hover:bg-sand/60 hover:text-ink"}`
                }
              >
                <Icon aria-hidden className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
          {!IS_LIVE && <p className="mt-6 hidden rounded-lg border border-brass/30 bg-brass-pale/40 p-3 text-[0.8125rem] lg:block">Demo mode: changes are saved in this browser only.</p>}
        </aside>
        <div className="min-w-0">
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
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
