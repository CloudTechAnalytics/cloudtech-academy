import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { GraduationCap } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageLoading, RequireAuth, useAuth } from "@/lib/auth";
import { CommunityButton, useCommunity } from "@/lib/community";
import { buttonClass } from "@/components/Button";
import { safeNext, useNext } from "./auth/AuthShell";

const POINTS = [
  "Connect with other learners",
  "Ask questions",
  "Share what you're building",
  "Get Academy updates",
  "Participate in practical sessions",
  "Discover workshops and opportunities",
];

function Inner() {
  const { community, loaded } = useCommunity();
  const auth = useAuth();
  const next = safeNext(useNext(), "/dashboard");
  const navigate = useNavigate();
  useSeo({ title: "Welcome | CloudTech Academy", description: "Welcome to CloudTech Academy.", noindex: true });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!loaded) return <PageLoading />;
  // Nothing to invite them to while the community is off: straight to the Academy.
  if (!community) return <Navigate to={next} replace />;
  const first = auth.status === "signed-in" ? auth.user.fullName.split(/\s+/)[0] : "";

  return (
    <div className="container-page flex justify-center py-14 sm:py-20">
      <div className="w-full max-w-xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brass-pale/70 text-brass-dark">
          <GraduationCap aria-hidden className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-serif text-[2.2rem] leading-tight sm:text-[2.6rem]">Welcome to CloudTech Academy{first ? `, ${first}` : ""} 🎓</h1>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">You're now part of the Academy.</p>

        <div className="mt-8 rounded-2xl border border-line bg-paper p-6 sm:p-7">
          <p className="font-serif text-[1.35rem]">Join the {community.name} on WhatsApp to:</p>
          <ul className="mt-4 space-y-2.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[1rem]">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">{community.welcomeMessage}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CommunityButton source="welcome" className="sm:flex-1">
              Join WhatsApp Community
            </CommunityButton>
            <button type="button" onClick={() => navigate(next, { replace: true })} className={buttonClass("secondary", "sm:flex-1")}>
              Continue to Academy
            </button>
          </div>
          <p className="mt-4 text-[0.8125rem] text-muted">Joining is optional. You can find the community link on your dashboard any time.</p>
        </div>
        <p className="mt-6 text-[0.875rem] text-muted">
          Prefer to explore first?{" "}
          <Link to="/courses" className="font-semibold text-brass-dark">
            Browse courses
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

/** /welcome: shown once after sign-up. The Academy never requires joining the community. */
export default function Welcome() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
