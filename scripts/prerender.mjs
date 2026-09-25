// Prerenders every public route to static HTML after `vite build`, so search engines and
// link previews get each page's real content, title and description without running
// JavaScript. Also writes app.html (the empty shell for signed-in pages, see vercel.json),
// 404.html, sitemap.xml and robots.txt.
//
// Output uses flat files (courses.html, learn/sql-for-data-analysis/select-basics.html)
// served at clean URLs by Vercel's "cleanUrls" setting.
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrOut = path.join(root, "node_modules", ".prerender");

await build({
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
});

const { render, shellHead, ROUTES, NOINDEX_ROUTES, SITE_URL } = await import(pathToFileURL(path.join(ssrOut, "entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--seo:start-->") || !template.includes('<div id="root"></div>')) {
  throw new Error("index.html is missing the <!--seo:start--> marker or the empty #root element");
}

// data-route tells the client which address this HTML was rendered for (see src/main.tsx).
function page(html, headTags, route) {
  return template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, headTags)
    .replace('<div id="root"></div>', `<div id="root" data-route="${route}">${html}</div>`);
}

function write(file, contents) {
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, contents);
}

for (const route of ROUTES) {
  const { html, headTags } = await render(route);
  write(route === "/" ? "index.html" : `${route.slice(1)}.html`, page(html, headTags, route));
  console.log(`prerendered ${route}`);
}

// Signed-in and personal pages (dashboard, admin, verify, sign-in...) render in the browser only.
write("app.html", template.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, shellHead()));
console.log("wrote app.html");

// Served by Vercel with a real 404 status for unknown addresses.
const notFound = await render("/this-page-does-not-exist");
write("404.html", page(notFound.html, notFound.headTags, "404"));
console.log("prerendered 404.html");

const today = new Date().toISOString().slice(0, 10);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.filter((r) => !NOINDEX_ROUTES.includes(r)).map((r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`,
);
write(
  "robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /admin\nDisallow: /profile\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);
console.log(`sitemap.xml and robots.txt written for ${SITE_URL}`);

fs.rmSync(ssrOut, { recursive: true, force: true });
