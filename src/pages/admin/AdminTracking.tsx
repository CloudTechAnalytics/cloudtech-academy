import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { Check, Copy, ExternalLink } from "lucide-react";
import { getBackend, type TrackingSettings } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { SITE } from "@/lib/site";
import { Alert, TextField } from "@/components/Form";
import { Button } from "@/components/Button";
import { AdminHeading } from "./AdminLayout";

const GA4 = /^G-[A-Z0-9]{6,14}$/;
const ADS = /^AW-[0-9]{6,14}$/;
const PIXEL = /^[0-9]{8,20}$/;
const tab = (active: boolean) => `-mb-px border-b-2 pb-3 text-[0.9375rem] font-semibold ${active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`;

/** Admin Dashboard → Settings → Tracking: the ids that measure visits and ads, and what to do so Google finds the site. */
export default function AdminTracking() {
  const [saved, setSaved] = useState<TrackingSettings | null>(null);
  const [form, setForm] = useState({ ga4Id: "", googleAdsId: "", metaPixelId: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof TrackingSettings, string>>>({});
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const sitemap = `${SITE.url}/sitemap.xml`;

  useEffect(() => {
    void getBackend()
      .then((b) => b.getTrackingSettings())
      .then((s) => {
        setSaved(s);
        setForm({ ga4Id: s.ga4Id ?? "", googleAdsId: s.googleAdsId ?? "", metaPixelId: s.metaPixelId ?? "" });
      })
      .catch((e: unknown) => setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't load the settings." }));
  }, []);

  if (!saved) return msg ? <Alert tone="error">{msg.text}</Alert> : <PageLoading />;

  const save = async () => {
    const ga4Id = form.ga4Id.trim().toUpperCase();
    const googleAdsId = form.googleAdsId.trim().toUpperCase();
    const metaPixelId = form.metaPixelId.trim();
    const e: typeof errors = {};
    if (ga4Id && !GA4.test(ga4Id)) e.ga4Id = "It looks like G- followed by letters and numbers, for example G-AB12CD34EF.";
    if (googleAdsId && !ADS.test(googleAdsId)) e.googleAdsId = "It looks like AW- followed by numbers, for example AW-123456789.";
    if (metaPixelId && !PIXEL.test(metaPixelId)) e.metaPixelId = "A Meta Pixel ID is a number of 8 to 20 digits.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setMsg(null);
    try {
      const next = { ga4Id: ga4Id || null, googleAdsId: googleAdsId || null, metaPixelId: metaPixelId || null };
      await (await getBackend()).admin.saveTrackingSettings(next);
      setSaved(next);
      setMsg({ tone: "success", text: "Saved. Visitors who accept cookies are measured from their next page." });
    } catch (err) {
      setMsg({ tone: "error", text: err instanceof Error ? err.message : "Couldn't save." });
    }
    setBusy(false);
  };

  return (
    <>
      <AdminHeading title="Settings" />
      <nav aria-label="Settings sections" className="-mt-4 mb-8 flex gap-6 border-b border-line">
        <NavLink to="/admin/settings/community" className={({ isActive }) => tab(isActive)}>
          Community
        </NavLink>
        <NavLink to="/admin/settings/tracking" className={({ isActive }) => tab(isActive)}>
          Tracking and search
        </NavLink>
      </nav>

      <form
        noValidate
        className="space-y-5 rounded-2xl border border-line bg-paper p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <div>
          <h2 className="font-serif text-[1.4rem]">Measure visits and ads</h2>
          <p className="mt-1 max-w-2xl text-[0.9375rem] text-muted">
            Paste the ids from your accounts. Nothing is measured until you add one, and only for visitors who accept cookies. Leave a box empty to turn that one off.
          </p>
        </div>
        <TextField label="Google Analytics 4 measurement ID" value={form.ga4Id} onChange={(e) => setForm({ ...form, ga4Id: e.target.value })} error={errors.ga4Id} hint="From Google Analytics → Admin → Data streams → your web stream. Starts with G-." />
        <TextField label="Google Ads ID (optional)" value={form.googleAdsId} onChange={(e) => setForm({ ...form, googleAdsId: e.target.value })} error={errors.googleAdsId} hint="From Google Ads → Goals → Conversions. Starts with AW-. Needed to count conversions from Google and YouTube ads." />
        <TextField label="Meta Pixel ID" value={form.metaPixelId} onChange={(e) => setForm({ ...form, metaPixelId: e.target.value })} error={errors.metaPixelId} hint="From Meta Events Manager → Data sources → your Pixel. A number. Needed to count sign-ups from Instagram and Facebook ads." />
        <div aria-live="polite">{msg && <Alert tone={msg.tone}>{msg.text}</Alert>}</div>
        <Button type="submit" loading={busy}>
          Save
        </Button>
        <p className="text-[0.8125rem] text-muted">
          Once set, the site sends these to Google and Meta: each page viewed, <strong>sign up</strong> (when someone creates an account), <strong>lead</strong> (when they enrol in a course) and{" "}
          <strong>begin checkout</strong> (when they start paying for a programme). Pages under /admin are never measured.
        </p>
      </form>

      <section className="mt-10 rounded-2xl border border-line bg-paper p-5 sm:p-6" aria-labelledby="search-title">
        <h2 id="search-title" className="font-serif text-[1.4rem]">
          Get found on Google
        </h2>
        <p className="mt-1 max-w-2xl text-[0.9375rem] text-muted">
          The site is ready for Google: pages are indexable, every course and programme page has its own title and description, and a sitemap lists them all. A new site does not appear until Google has been told about
          it and has visited, so do these steps once.
        </p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[0.9375rem]">
          <li>
            Open{" "}
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-brass-dark">
              Google Search Console <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>{" "}
            and sign in with the Google account that owns the CloudTech Analytics website.
          </li>
          <li>
            If <strong>cloudtechanalytics.com</strong> is already there as a <em>Domain</em> property, the Academy is covered automatically. Skip to step 4. If not, click <strong>Add property</strong>, choose{" "}
            <strong>URL prefix</strong>, and enter <span className="font-mono">{SITE.url}</span>.
          </li>
          <li>
            Verify ownership. The easiest way is the <strong>HTML tag</strong> method: Google shows a line like <span className="font-mono">&lt;meta name="google-site-verification" content="…"&gt;</span>. Send me the code
            inside <span className="font-mono">content="…"</span> and it is added to the site. (Or choose the DNS method and add the record where your domain is managed.)
          </li>
          <li>
            In Search Console open <strong>Sitemaps</strong> and submit this address:
            <span className="mt-2 flex flex-wrap items-center gap-3">
              <code className="rounded-lg bg-sand px-3 py-1.5 font-mono text-[0.875rem]">{sitemap}</code>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brass-dark"
                onClick={() => {
                  void navigator.clipboard?.writeText(sitemap);
                  setCopied(true);
                }}
              >
                {copied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
              </button>
            </span>
          </li>
          <li>
            Open <strong>URL inspection</strong>, paste <span className="font-mono">{SITE.url}</span> and click <strong>Request indexing</strong>. Do the same for{" "}
            <span className="font-mono">/courses</span> and <span className="font-mono">/programmes</span>.
          </li>
          <li>
            Link to the Academy from the main CloudTech Analytics website (a menu item or a button). A link from a site Google already knows is the fastest way for it to find a new one, and it also sends real visitors.
          </li>
        </ol>
        <p className="mt-4 text-[0.8125rem] text-muted">Google usually shows a new site within a few days to a few weeks. Searching the exact name "CloudTech Academy" works before general searches like "free data courses" do.</p>
      </section>
    </>
  );
}
