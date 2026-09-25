import type { ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router";
import { useAuth } from "@/lib/auth";

/** Only allow redirects within the site, e.g. "/learn/..." but never "//evil.com". */
export function safeNext(value: string | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

export function useNext() {
  const [params] = useSearchParams();
  return safeNext(params.get("next"));
}

export function AuthShell({ title, intro, children, redirectIfSignedIn = true }: { title: string; intro?: ReactNode; children: ReactNode; redirectIfSignedIn?: boolean }) {
  const auth = useAuth();
  const next = useNext();
  if (redirectIfSignedIn && auth.status === "signed-in") return <Navigate to={next} replace />;
  return (
    <div className="container-page flex justify-center py-14 sm:py-20">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-[2.2rem] leading-tight sm:text-[2.5rem]">{title}</h1>
        {intro && <div className="mt-3 text-[1rem] leading-relaxed text-muted">{intro}</div>}
        <div className="mt-8 rounded-2xl border border-line bg-paper p-6 sm:p-7">{children}</div>
      </div>
    </div>
  );
}
