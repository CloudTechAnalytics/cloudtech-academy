import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { IS_LIVE } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** Shown when Supabase isn't configured, so nobody mistakes demo accounts for real ones. */
function DemoBanner() {
  if (IS_LIVE) return null;
  return (
    <div className="border-b border-brass/30 bg-brass-pale/50 px-4 py-2 text-center text-[0.8125rem] text-ink">
      <strong className="font-semibold">Demo mode.</strong> Accounts and progress are saved in this browser only.
    </div>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <DemoBanner />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
