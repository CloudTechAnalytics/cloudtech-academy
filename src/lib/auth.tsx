import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { getBackend, type User } from "./backend";

type AuthState = { status: "loading"; user: null } | { status: "signed-out"; user: null } | { status: "signed-in"; user: User };

const AuthContext = createContext<AuthState>({ status: "loading", user: null });

/** Provides the signed-in user. Starts as "loading" on both server and client so prerendered HTML matches. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });

  useEffect(() => {
    let unsubscribe = () => {};
    let alive = true;
    const apply = (user: User | null) => alive && setState(user ? { status: "signed-in", user } : { status: "signed-out", user: null });
    void getBackend().then(async (b) => {
      apply(await b.getUser());
      unsubscribe = b.onAuthChange(apply);
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function PageLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="container-page flex min-h-[50vh] items-center justify-center py-20" role="status" aria-live="polite">
      <span className="flex items-center gap-3 text-[0.9375rem] text-muted">
        <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-line-strong border-t-brass" />
        {label}
      </span>
    </div>
  );
}

/** Sends signed-out visitors to sign in, then back here afterwards. */
export function RequireAuth({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const auth = useAuth();
  const location = useLocation();
  if (auth.status === "loading") return <PageLoading />;
  if (auth.status === "signed-out") {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/sign-in?next=${next}`} replace />;
  }
  if (admin && auth.user.role !== "admin") {
    return (
      <div className="container-page py-24">
        <h1 className="font-serif text-[2.2rem]">Admins only</h1>
        <p className="mt-3 text-muted">Your account doesn't have access to this area.</p>
      </div>
    );
  }
  return <>{children}</>;
}
