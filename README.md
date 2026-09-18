# Rinavai — Landing Page

**Where teams _move_ together.** Boards, chat, docs, calls, and an AI assistant that does the work — one tenant-scoped platform.

This repo holds the single-file marketing/landing page for **Rinavai**, deployed to **Vercel**.

---

## Table of contents

- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [APK distribution](#apk-distribution)
- [Brand & design system](#brand--design-system)
- [Regenerating the OG image](#regenerating-the-og-image)
- [SEO & structured data](#seo--structured-data)

---

## Project structure

```
.
├── index.html                  # The entire landing page (HTML + CSS + JS, single file)
├── rinavai.png                 # Product logo (favicon, header, footer)
├── og-image.png                # 1200x630 social share card (og:image / twitter:image)
├── robots.txt                  # Crawler rules + sitemap pointer (templated)
└── sitemap.xml                 # Single-URL sitemap (templated)
```

---

## Getting started

No dependencies — only Node (any recent version) for the build script.

```bash
# set the two template values, then build into ./dist
DEMO_URL="https://your-demo.example.com" node scripts/build.mjs

# preview the built page
npx serve dist
```

> The source files carry `__DEMO_URL__` / `__SITE_URL__` placeholders;
> they are substituted at build time (see [Configuration](#configuration)).

---

## Deployment

Deploys automatically to **Vercel** on every push to `main`; every PR gets a
preview deployment.

1. Import the repo into a Vercel project — `vercel.json` supplies the build
   command (`node scripts/build.mjs`) and output directory (`dist`).
2. Set **Environment Variables** on the project
   (Settings → Environment Variables):
   - `DEMO_URL` — required; the build fails without it.
   - `SITE_URL` — optional; set it once the custom domain is live.

Changing where the demo lives is a one-line env var change + redeploy —
never an edit to `index.html`.

---

## Configuration

| Variable   | Where                             | Purpose                                                                                                      |
| ---------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `DEMO_URL` | Vercel project env var (required) | The live-demo URL substituted into every demo link at build time                                             |
| `SITE_URL` | Vercel project env var (optional) | The public origin used by the canonical URL, OG/Twitter image URLs, JSON-LD, `sitemap.xml`, and `robots.txt` |

`SITE_URL` falls back to Vercel's production URL (`VERCEL_PROJECT_PRODUCTION_URL`)
when available, and to `http://localhost:3000` for local builds.

---

## APK distribution

The "Download APK" buttons link to this repo's GitHub Releases:

```
https://github.com/m-ishfaq/rinavai-landing/releases/latest/download/rinavai.apk
```

To ship a new build: create a release on the repo and upload the APK as
`rinavai.apk` — the link always resolves to the latest one.

---

## Brand & design system

The landing page mirrors the product UI.

**Palette** (CSS custom properties on `:root` in `index.html`):

| Token                      | Value                 | Use                                                              |
| -------------------------- | --------------------- | ---------------------------------------------------------------- |
| `--surface`                | `#171009`             | Page ground (warm espresso dark)                                 |
| `--surface-raised`         | `#221711`             | Cards, panels                                                    |
| `--accent`                 | `#14b8a1`             | Teal — the only actionable color (buttons, links, active states) |
| `--ink` / `--ink-muted`    | `#efe7dc` / `#a99b8b` | Text / secondary text                                            |
| `--line` / `--line-strong` | `#362818` / `#4d3a27` | Borders                                                          |

**Suite spectrum** — one orientation hue per module, never used on buttons/links:
Work `#14b8a1` · Chat `#3d9df0` · Docs `#48c078` · Calls `#f09f3f` · People `#e06c9f` · Assistant `#a78bfa`

**Type:** [Geist](https://vercel.com/font) (sans/display) + Geist Mono, via Google Fonts.

**Motion:** scroll-reveal animations (staggered card grids) — fully disabled under `prefers-reduced-motion`.

---

## Regenerating the OG image

`og-template.html` is the editable 1200×630 source for `og-image.png`.
After editing it, re-render with headless Chrome (Git Bash on Windows):

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --user-data-dir="$TEMP/rinavai-og-profile" \
  --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --virtual-time-budget=15000 \
  --screenshot="$TEMP/og-new.png" \
  "file://$(cygpath -m "$(pwd)")/og-template.html"
cp "$TEMP/og-new.png" og-image.png
```

Notes:

- `cygpath -m` is required — `file://$(pwd)/...` produces an invalid
  `file:///c/...` URL in Git Bash and Chrome silently renders a blank image.
- `--virtual-time-budget=15000` gives the Google Fonts webfonts time to load
  before the screenshot.
- Keep the right-hand mockup unrotated — a `rotate()` on it pushes the
  top-right corner past the canvas and gets clipped.

---

## SEO & structured data

- Title/description/OG/Twitter meta, canonical URL, `robots` directives
- JSON-LD: `SoftwareApplication` (product info) + `FAQPage` (mirrors the FAQ section)
- `sitemap.xml` + `robots.txt`, templated with `__SITE_URL__` at build time

> After redeploying with a changed share image, bust platform caches via the
> Slack unfurl reset, Twitter Card validator, and Facebook Sharing Debugger.
