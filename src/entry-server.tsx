import { StrictMode } from "react";
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router";
import { AppRoutes } from "./App";
import { renderHeadTags, takeSsrHead } from "./lib/seo";
import { sitewideJsonLd } from "./lib/schema";
import { publishedLessons } from "./lib/certificates";
import { BUNDLED_COURSES } from "./content";
import { PRACTICE_PROJECTS } from "./content/projects";
import { TRACKS } from "./content/tracks";
import { SITE } from "./lib/site";
import { isPaid } from "./lib/commerce";

const courses = BUNDLED_COURSES.filter((c) => c.published);

/** Every public route, prerendered to its own HTML file and listed in the sitemap. */
export const ROUTES = [
  "/",
  "/courses",
  ...courses.map((c) => `/courses/${c.slug}`),
  // Paid courses' lessons are never prerendered: their text isn't in the site files.
  ...courses.filter((c) => !isPaid(c)).flatMap((c) => publishedLessons(c).map((l) => `/learn/${c.slug}/${l.slug}`)),
  "/students",
  "/programmes",
  ...TRACKS.map((t) => `/programmes/${t.slug}`),
  "/projects",
  ...PRACTICE_PROJECTS.map((p) => `/projects/${p.id}`),
  "/certificates",
  "/verify",
  "/about",
];

/** Routes kept out of the sitemap because they are marked noindex. */
export const NOINDEX_ROUTES: string[] = [];

export const SITE_URL = SITE.url;

/** Renders one route to HTML, waiting for lazy pages, and returns its head tags. */
export async function render(url: string) {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
  const html = await new Response(prelude).text();
  const head = takeSsrHead();
  if (!head) throw new Error(`No SEO data recorded for ${url}; does the page call useSeo?`);
  return { html, headTags: renderHeadTags(head, sitewideJsonLd()) };
}

/** Head tags for app.html, the empty shell used by signed-in pages. */
export function shellHead() {
  return renderHeadTags(
    { title: "CloudTech Academy", description: "Practical, self-paced courses in data, analytics and technology.", url: SITE.url, imageUrl: `${SITE.url}/og-image.png`, noindex: true, jsonLd: [] },
    [],
  );
}
