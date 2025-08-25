// copies env-appropriate robots/sitemap into public/ before build
const { copyFileSync, rmSync } = require("fs");

const env = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
// Vercel sets VERCEL_ENV = production | preview | development
const isProd = env === "production";

copyFileSync(
  isProd ? "public/robots.prod.txt" : "public/robots.nonprod.txt",
  "public/robots.txt"
);

if (isProd) {
  copyFileSync("public/sitemap.prod.xml", "public/sitemap.xml");
} else {
  try { rmSync("public/sitemap.xml"); } catch {}
}

console.log(`[meta] Using ${isProd ? "PROD" : "NONPROD"} robots/sitemap`);
