// Generates the favicon set, web manifest and Open Graph card from the CloudTech mark.
// Run with: npm run brand:assets
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const pub = new URL("../public/", import.meta.url);
const out = (p) => fileURLToPath(new URL(p, pub));

/** The mark on its native 682-unit grid (same as the CloudTech Analytics site). */
const MARK = (accent = "#C9A45C", rest = "#E4DACA") => `
  <rect width="170" height="170" rx="30" fill="${accent}"/>
  <g fill="${rest}">
    <rect x="256" y="0" width="170" height="170" rx="30"/>
    <rect x="512" y="0" width="170" height="170" rx="30"/>
    <rect x="0" y="256" width="170" height="170" rx="30"/>
    <rect x="0" y="512" width="170" height="170" rx="30"/>
    <rect x="256" y="256" width="426" height="426" rx="44"/>
  </g>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="CloudTech Academy">
  <rect width="100" height="100" rx="22" fill="#FFFFFF"/>
  <g transform="translate(17 17) scale(0.0968)">${MARK("#C9A45C", "#D9CDB8")}</g>
</svg>
`;
await writeFile(out("favicon.svg"), favicon);
for (const [name, size] of [
  ["favicon-32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-512.png", 512],
]) {
  await sharp(Buffer.from(favicon), { density: 600 }).resize(size, size).png().toFile(out(name));
}

await writeFile(
  out("site.webmanifest"),
  JSON.stringify(
    {
      name: "CloudTech Academy",
      short_name: "CT Academy",
      icons: [
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      theme_color: "#F8F5EF",
      background_color: "#F8F5EF",
      display: "browser",
    },
    null,
    2,
  ) + "\n",
);

// Open Graph / Twitter card, 1200x630
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F8F5EF"/>
  <rect x="0" y="0" width="1200" height="6" fill="#B38A3E"/>
  <g transform="translate(96 96) scale(0.1349)">${MARK()}</g>
  <text x="206" y="138" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="700" fill="#171717">CloudTech</text>
  <text x="208" y="168" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#8C6A2C" letter-spacing="6">ACADEMY</text>
  <text x="96" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="62" fill="#171717">Learn data by working</text>
  <text x="96" y="410" font-family="Georgia, 'Times New Roman', serif" font-size="62" fill="#171717">with <tspan fill="#A67E35">real business problems.</tspan></text>
  <line x1="96" y1="490" x2="176" y2="490" stroke="#B38A3E" stroke-width="2"/>
  <text x="96" y="540" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#5E5A52" letter-spacing="5">READ  ·  PRACTISE  ·  BUILD  ·  CERTIFY</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(out("og-image.png"));

console.log("Brand assets generated.");
