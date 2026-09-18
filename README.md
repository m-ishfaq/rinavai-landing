# Rinaval — Landing Page

**Where teams *move* together.** Boards, chat, docs, calls, and an AI assistant that does the work — one tenant-scoped platform.

This repo holds the single-file marketing/landing page for **Rinaval**, deployed to GitHub Pages.

---

## Table of contents

- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Brand & design system](#brand--design-system)
- [Regenerating the OG image](#regenerating-the-og-image)
- [SEO & structured data](#seo--structured-data)
- [Reference material](#reference-material)

---

## Project structure

```
.
├── index.html                  # The entire landing page (HTML + CSS + JS, single file)
├── rinavai.png                 # Product logo (favicon, header, footer)
├── og-image.png                # 1200x630 social share card (og:image / twitter:image)
├── og-template.html            # Editable source for og-image.png (rendered via headless Chrome)
├── robots.txt                  # Crawler rules + sitemap pointer
├── sitemap.xml                 # Single-URL sitemap
├── user-side/                  # Reference screenshots — end-user product UI
├── admin-side/                 # Reference screenshots — admin console UI
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Pages deploy (with demo-URL templating)
```

---

## Getting started

No build step, no dependencies. Open the page:

```bash
# just open index.html in a browser, or serve it
npx serve .
```

> Note: links to the live demo appear as `__DEMO_URL__` in source; they are
> substituted at deploy time (see [Configuration](#configuration)).

---

## Deployment

Deploys automatically to **GitHub Pages** on every push to `main`
(`.github/workflows/deploy.yml`), or manually via **Actions → Deploy landing page → Run workflow**.

Pipeline steps:

1. Substitute `__DEMO_URL__` with the repo variable `DEMO_URL`
   (fails the build if the variable is missing or the placeholder survives).
2. Upload the repo as the Pages artifact and deploy.

---

## Configuration

| Setting | Where | Purpose |
| --- | --- | --- |
| `DEMO_URL` | Repo **Variables** (Settings → Secrets and variables → Actions → Variables) | The live-demo URL substituted into every demo link at build time |

Changing where the demo lives is a one-line variable change + workflow re-run — never an edit to `index.html`.

---

## Brand & design system

The landing page mirrors the product UI (see `user-side/` and `admin-side/` screenshots).

**Palette** (CSS custom properties on `:root` in `index.html`):

| Token | Value | Use |
| --- | --- | --- |
| `--surface` | `#171009` | Page ground (warm espresso dark) |
| `--surface-raised` | `#221711` | Cards, panels |
| `--accent` | `#14b8a1` | Teal — the only actionable color (buttons, links, active states) |
| `--ink` / `--ink-muted` | `#efe7dc` / `#a99b8b` | Text / secondary text |
| `--line` / `--line-strong` | `#362818` / `#4d3a27` | Borders |

**Suite spectrum** — one orientation hue per module, never used on buttons/links:
Work `#14b8a1` · Chat `#3d9df0` · Docs `#48c078` · Calls `#f09f3f` · People `#e06c9f` · Assistant `#a78bfa`

**Type:** [Geist](https://vercel.com/font) (sans/display) + Geist Mono, via Google Fonts.

**Motion:** scroll-reveal animations (staggered card grids) — fully disabled under `prefers-reduced-motion`.

---

## Regenerating the OG image

`og-template.html` is the editable 1200×630 source for `og-image.png`.
After editing it, re-render with headless Chrome:

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --user-data-dir="$TEMP/rinaval-og-profile" \
  --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --screenshot="$TEMP/og-new.png" \
  "file://$(pwd)/og-template.html"
cp "$TEMP/og-new.png" og-image.png
```

Keep the right-hand mockup unrotated — a `rotate()` on it pushes the top-right
corner past the canvas and gets clipped.

---

## SEO & structured data

- Title/description/OG/Twitter meta, canonical URL, `robots` directives
- JSON-LD: `SoftwareApplication` (product info) + `FAQPage` (mirrors the FAQ section)
- `sitemap.xml` + `robots.txt` pointing at the Pages URL

> After redeploying with a changed share image, bust platform caches via the
> Slack unfurl reset, Twitter Card validator, and Facebook Sharing Debugger.

---

## Reference material

`user-side/` and `admin-side/` hold WhatsApp screenshots of the real product UI.
They are the source of truth for the landing page's look and feel — reference material only.
