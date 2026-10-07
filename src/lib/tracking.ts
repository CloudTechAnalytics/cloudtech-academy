// Measures visits and ads (Google Analytics 4, Google Ads, Meta Pixel).
//
// Nothing is loaded until an admin has set at least one id (Admin → Settings → Tracking) AND the visitor has accepted
// cookies. Before that, this file does nothing, so a site without ids, or a visitor who declined, is never tracked.
import type { TrackingSettings } from "./backend/types";

export type Consent = "granted" | "denied" | "unset";
const KEY = "ct-cookie-consent";

type Win = Window & {
  dataLayer?: unknown[];
  gtag?: (...a: unknown[]) => void;
  fbq?: ((...a: unknown[]) => void) & { queue?: unknown[][]; loaded?: boolean; version?: string; push?: unknown; callMethod?: (...a: unknown[]) => void };
  _fbq?: unknown;
};

let config: TrackingSettings = { ga4Id: null, googleAdsId: null, metaPixelId: null };
let loaded = false;
let lastPath: string | null = null;

const win = () => (typeof window === "undefined" ? null : (window as Win));

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}

/** True when there is something to ask about: at least one measurement id is set. */
export const trackingConfigured = () => !!(config.ga4Id || config.googleAdsId || config.metaPixelId);

function script(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function load() {
  const w = win();
  if (!w || loaded || getConsent() !== "granted" || !trackingConfigured()) return;
  loaded = true;
  const google = config.ga4Id ?? config.googleAdsId;
  if (google) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      // gtag.js expects the arguments object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer as unknown[]).push(arguments);
    };
    script(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(google)}`);
    w.gtag("js", new Date());
    if (config.ga4Id) w.gtag("config", config.ga4Id, { send_page_view: false });
    if (config.googleAdsId) w.gtag("config", config.googleAdsId);
  }
  if (config.metaPixelId) {
    if (!w.fbq) {
      const n = function (...a: unknown[]) {
        if (n.callMethod) n.callMethod(...a);
        else (n.queue as unknown[][]).push(a);
      } as NonNullable<Win["fbq"]>;
      n.queue = [];
      n.loaded = true;
      n.version = "2.0";
      w.fbq = n;
      w._fbq = n;
      script("https://connect.facebook.net/en_US/fbevents.js");
    }
    w.fbq("init", config.metaPixelId);
  }
  // The page the visitor is on when they accept still counts.
  if (lastPath) pageView(lastPath);
}

export function setTrackingConfig(c: TrackingSettings) {
  config = c;
  load();
}

export function setConsent(v: "granted" | "denied") {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    // Private mode: the choice lasts for this visit only.
  }
  if (v === "granted") load();
  window.dispatchEvent(new Event("ct-consent"));
}

export function pageView(path: string) {
  lastPath = path;
  const w = win();
  if (!w || !loaded) return;
  if (config.ga4Id && w.gtag) w.gtag("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
  if (config.metaPixelId && w.fbq) w.fbq("track", "PageView");
}

/** What happened, in the words both Google and Meta understand. */
export type TrackEvent = "sign_up" | "enrol" | "begin_checkout";
const META: Record<TrackEvent, string> = { sign_up: "CompleteRegistration", enrol: "Lead", begin_checkout: "InitiateCheckout" };
const GOOGLE: Record<TrackEvent, string> = { sign_up: "sign_up", enrol: "generate_lead", begin_checkout: "begin_checkout" };

export function track(event: TrackEvent, params: { value?: number; currency?: string; item?: string } = {}) {
  const w = win();
  if (!w || !loaded) return;
  if ((config.ga4Id || config.googleAdsId) && w.gtag) w.gtag("event", GOOGLE[event], { value: params.value, currency: params.currency, item_name: params.item });
  if (config.metaPixelId && w.fbq) w.fbq("track", META[event], { value: params.value, currency: params.currency, content_name: params.item });
}
