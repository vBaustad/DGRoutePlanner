import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE = process.env.VITE_SITE_URL || "https://dgrouteplanner.com"; // set in Vercel env
const PAGE = "/guides";
const TITLE = "Guides & Road Trip Playbooks | DGRoutePlanner";
const DESC  = "How-tos, itineraries, and course lists to plan smarter disc golf road trips anywhere.";
const IMAGE = "/og/guides-hero.jpg"; // lives under /public/og/

const srcIndex = join(__dirname, "..", "dist", "index.html");
const outFile  = join(__dirname, "..", "dist", PAGE, "index.html");

const abs = (u) => /^https?:\/\//i.test(u) ? u : `${SITE}${u.startsWith("/") ? u : `/${u}`}`;
const injectHead = (html, extra) => html.replace("</head>", `${extra}\n</head>`);

const HEAD = `
  <!-- prerendered for ${PAGE} -->
  <link rel="canonical" href="${abs(PAGE)}" />
  <meta name="description" content="${DESC}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DG Route Planner">
  <meta property="og:title" content="${TITLE}">
  <meta property="og:description" content="${DESC}">
  <meta property="og:url" content="${abs(PAGE)}">
  <meta property="og:image" content="${abs(IMAGE)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${TITLE}">
  <meta name="twitter:description" content="${DESC}">
  <meta name="twitter:image" content="${abs(IMAGE)}">
`.trim();

const main = async () => {
  const html = await readFile(srcIndex, "utf8");
  const out  = injectHead(html, HEAD);
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, out, "utf8");
  console.log(`[prerender] wrote ${outFile}`);
};

main().catch((e) => { console.error(e); process.exit(1); });
