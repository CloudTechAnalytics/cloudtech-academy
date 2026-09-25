import { useEffect } from "react";
import { useLocation } from "react-router";
import { SITE } from "./site";

type JsonLd = Record<string, unknown>;

export type SeoOptions = {
  title: string;
  description: string;
  /** Defaults to the shared Open Graph card. */
  image?: string;
  noindex?: boolean;
  /** Page-specific structured data (schema.org), added alongside the sitewide Organization data. */
  jsonLd?: JsonLd | JsonLd[];
};

export type HeadData = Required<Pick<SeoOptions, "title" | "description">> & {
  url: string;
  imageUrl: string;
  noindex: boolean;
  jsonLd: JsonLd[];
};

function resolve({ title, description, image = "/og-image.png", noindex = false, jsonLd }: SeoOptions, pathname: string): HeadData {
  const url = `${SITE.url}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE.url}${image}`;
  return { title, description, url, imageUrl, noindex, jsonLd: jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [] };
}

/* ------------------------------------------------------------------ server */

// During prerendering (no window), the last page to call useSeo records its head here.
let ssrHead: HeadData | null = null;
export function takeSsrHead() {
  const h = ssrHead;
  ssrHead = null;
  return h;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// JSON inside <script> must not be able to close the tag.
const json = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");

/** Head tags for a prerendered page, including sitewide structured data. */
export function renderHeadTags(h: HeadData, sitewide: JsonLd[]): string {
  const meta = (attr: "name" | "property", key: string, content: string) => `<meta ${attr}="${key}" content="${esc(content)}" />`;
  return [
    `<title>${esc(h.title)}</title>`,
    meta("name", "description", h.description),
    meta("name", "robots", h.noindex ? "noindex, follow" : "index, follow"),
    `<link rel="canonical" href="${esc(h.url)}" />`,
    SITE.googleVerification && meta("name", "google-site-verification", SITE.googleVerification),
    meta("property", "og:type", "website"),
    meta("property", "og:site_name", SITE.name),
    meta("property", "og:title", h.title),
    meta("property", "og:description", h.description),
    meta("property", "og:url", h.url),
    meta("property", "og:image", h.imageUrl),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"),
    meta("property", "og:locale", "en_NG"),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", h.title),
    meta("name", "twitter:description", h.description),
    meta("name", "twitter:image", h.imageUrl),
    ...sitewide.map((d) => `<script type="application/ld+json">${json(d)}</script>`),
    ...h.jsonLd.map((d) => `<script type="application/ld+json" data-page="">${json(d)}</script>`),
  ]
    .filter(Boolean)
    .join("\n    ");
}

/* ------------------------------------------------------------------ client */

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Per-route title, description, canonical, Open Graph, Twitter and structured data.
 * Prerendered pages get these in their HTML; on client-side navigation they are updated in place.
 */
export function useSeo(options: SeoOptions) {
  const { pathname } = useLocation();
  if (typeof window === "undefined") ssrHead = resolve(options, pathname);

  const { title, description, image, noindex } = options;
  const jsonLdKey = JSON.stringify(options.jsonLd ?? null);

  useEffect(() => {
    const h = resolve({ title, description, image, noindex, jsonLd: JSON.parse(jsonLdKey) ?? undefined }, pathname);
    document.title = h.title;
    setMeta("name", "description", h.description);
    setMeta("name", "robots", h.noindex ? "noindex, follow" : "index, follow");
    setCanonical(h.url);
    setMeta("property", "og:title", h.title);
    setMeta("property", "og:description", h.description);
    setMeta("property", "og:url", h.url);
    setMeta("property", "og:image", h.imageUrl);
    setMeta("name", "twitter:title", h.title);
    setMeta("name", "twitter:description", h.description);
    setMeta("name", "twitter:image", h.imageUrl);

    // Replace page-specific structured data; sitewide data (no data-page attribute) stays.
    document.head.querySelectorAll('script[type="application/ld+json"][data-page]').forEach((s) => s.remove());
    for (const d of h.jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.page = "";
      s.textContent = JSON.stringify(d);
      document.head.appendChild(s);
    }
  }, [title, description, image, noindex, jsonLdKey, pathname]);
}
