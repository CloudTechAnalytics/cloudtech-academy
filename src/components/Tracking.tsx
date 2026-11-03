import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { getBackend } from "@/lib/backend";
import { getConsent, pageView, setConsent, setTrackingConfig, trackingConfigured } from "@/lib/tracking";
import { Button } from "./Button";

const ENV = {
  ga4Id: (import.meta.env.VITE_GA_ID as string | undefined) || null,
  googleAdsId: (import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined) || null,
  metaPixelId: (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || null,
};

/**
 * Loads the measurement ids an admin has set, counts page views as people move around, and asks for cookie consent before
 * anything is measured. The banner only appears when there is something to ask about.
 */
export function Tracking() {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    void getBackend()
      .then((b) => b.getTrackingSettings())
      .catch(() => ({ ga4Id: null, googleAdsId: null, metaPixelId: null }))
      .then((s) => {
        if (!alive) return;
        setTrackingConfig({ ga4Id: s.ga4Id ?? ENV.ga4Id, googleAdsId: s.googleAdsId ?? ENV.googleAdsId, metaPixelId: s.metaPixelId ?? ENV.metaPixelId });
        setReady(true);
        setOpen(trackingConfigured() && getConsent() === "unset");
      });
    // The footer's "Cookie choices" link reopens the banner.
    const reopen = () => setOpen(trackingConfigured());
    window.addEventListener("ct-cookie-choices", reopen);
    return () => {
      alive = false;
      window.removeEventListener("ct-cookie-choices", reopen);
    };
  }, []);

  // Private areas aren't measured.
  useEffect(() => {
    if (ready && !pathname.startsWith("/admin")) pageView(pathname);
  }, [pathname, ready]);

  if (!open) return null;
  const choose = (v: "granted" | "denied") => {
    setConsent(v);
    setOpen(false);
  };
  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-line-strong bg-paper p-5 shadow-[0_20px_60px_-20px_rgba(23,23,23,0.5)] sm:inset-x-6">
      <p className="text-[0.9375rem] leading-relaxed">
        We use cookies to see how the Academy is used and to measure our ads, so we can improve it. You can say no and still use everything.{" "}
        <Link to="/about" className="font-semibold text-brass-dark">
          About us
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => choose("granted")}>Accept</Button>
        <Button variant="secondary" onClick={() => choose("denied")}>
          No thanks
        </Button>
      </div>
    </div>
  );
}
