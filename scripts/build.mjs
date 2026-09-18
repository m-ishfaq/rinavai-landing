// Build-time template substitution for the Rinavai landing page.
//
// The page ships with two placeholders that must never reach production:
//
//   __DEMO_URL__  — the live-demo link, from DEMO_URL  (required)
//   __SITE_URL__  — the public origin (canonical URL, OG/Twitter images,
//                   JSON-LD, sitemap, robots), from SITE_URL (optional;
//                   falls back to the Vercel production URL, then localhost)
//
// Set both as Environment Variables on the Vercel project (Production /
// Preview / Development scopes as needed). A missing DEMO_URL fails the
// build rather than shipping a literal placeholder to visitors.
//
// Local use: node scripts/build.mjs   (writes into ./dist)

import { mkdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { join } from "node:path";

const DEMO_URL = process.env.DEMO_URL?.trim();
const SITE_URL = (
  process.env.SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  ""
).replace(/\/+$/, "");

if (!DEMO_URL) {
  console.error(
    "::error::DEMO_URL is not set. Refusing to build a page with a literal __DEMO_URL__ placeholder in it. " +
      "Set it as an Environment Variable on the Vercel project (or in your shell for local builds).",
  );
  process.exit(1);
}

if (!SITE_URL) {
  console.warn(
    "::warning::SITE_URL is not set and no Vercel production URL is available — " +
      "canonical/OG/sitemap URLs will fall back to http://localhost:3000. " +
      "Set SITE_URL once your custom domain is live.",
  );
}

const siteOrigin = SITE_URL || "http://localhost:3000";

mkdirSync("dist", { recursive: true });

const files = ["index.html", "sitemap.xml", "robots.txt"];
for (const name of files) {
  let text = readFileSync(name, "utf8");
  text = text.split("__DEMO_URL__").join(DEMO_URL);
  text = text.split("__SITE_URL__").join(siteOrigin);
  writeFileSync(join("dist", name), text);
}

// Static assets are copied as-is.
for (const name of ["rinavai.png", "og-image.png"]) {
  cpSync(name, join("dist", name));
}

// Guard: the placeholders must not survive into the artifact.
const distIndex = readFileSync(join("dist", "index.html"), "utf8");
if (distIndex.includes("__DEMO_URL__") || distIndex.includes("__SITE_URL__")) {
  console.error(
    "::error::A placeholder survived substitution — aborting rather than publishing broken links.",
  );
  process.exit(1);
}

console.log(`Build OK → dist/  (demo: ${DEMO_URL} · site: ${siteOrigin})`);
