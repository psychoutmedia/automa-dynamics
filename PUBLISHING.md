# Publishing drill

The standing cadence for automadynamics.com articles. Two articles per week,
published **Tuesday** and **Friday**.

## What Mark hands over, once a week

1. Raw text of both articles (copied out of X, where they are written first).
2. Two cover images (source PNGs, typically ~2MB at 1983x793).
3. The two tweet IDs the articles were announced under.

## What gets done

### 1. Covers

```bash
python scripts/make-cover.py <source-image> <article-slug>
```

Writes `public/articles/<slug>/cover.jpg` at 1600px wide, ~160KB. Aspect ratio is
always preserved. Cover art has typography baked into it, so it must never be
cropped or squashed. `next.config.js` sets `images: { unoptimized: true }`, which
is why covers are pre-sized here instead of at request time.

### 2. Articles

One file per article at `content/articles/<slug>.mdx`:

```yaml
---
title: "Exact title as published on X"
date: 2026-08-25          # the publish day: Tuesday or Friday
draft: false
eyebrow: "SHORT CATEGORY"
description: "One or two sentences. Used by the index card, OG tags and RSS."
cover: "/articles/<slug>/cover.jpg"
coverAlt: "Same as title"
tweetId: "0000000000000000000"
xUrl: "https://x.com/automadynamics/status/0000000000000000000"
---
```

Body is the raw text converted to markdown: `##` headings, `-` bullets,
`1.` numbered lists, `>` blockquotes, `**bold**`, `*italic*`. **Words are never
changed**, only formatting.

House rule: no em dashes anywhere in the copy. Use a spaced hyphen.

`readingTime` and the cover's intrinsic dimensions are derived automatically.
Nothing else needs computing by hand.

### 3. Tweet IDs

Each article's `tweetId` and `xUrl` go in its frontmatter. They render the
"Originally published on X" attribution link at the foot of the article and
nothing else.

There are no tweet embeds on the site. They were removed deliberately: the
embeds published like and reply counts, and visible low engagement reads as
negative social proof on a page trying to establish an enterprise-grade company.
The outbound link does the same traffic job without the counters.

### 4. Checks before pushing

```bash
rm -rf .next && npm run build     # must pass; drafts are excluded here
npm start                         # walk /, /articles, both new slugs, /feed.xml
```

Confirm: both articles on the index and on the homepage, covers uncropped, read
times sensible, the "Originally published on X" link resolves, and
`/sitemap.xml`, `/feed.xml`, `/llms.txt` plus `/llms-full.txt` list the new
pieces. The two `llms` endpoints generate from frontmatter and body, so they
need no hand editing when an article ships.

The site is fully static with no external requests at build or runtime, so a
build that passes is a site that works.

### 5. Push

Commit and push. Vercel deploys from the repo. Deploying is Mark's step.

## Traps worth remembering

- **Stop the dev/prod server before rebuilding.** A running `next start` holds
  `.next` and the build fails with `Cannot find module for page: /sitemap.xml`.
  On Windows `pkill` does not kill Node: use `taskkill //PID <pid> //F`.
- **`draft: true` is the safety gate.** Draft articles are visible in
  `npm run dev` only. They are excluded from production builds, the index, the
  sitemap, the feed, `/llms.txt`, `/llms-full.txt`, and their direct URL returns
  404. Nothing half-finished can ship by accident.
- **`content/positioning.md` drifts silently.** Homepage and `/about` copy lives
  inline in JSX and cannot be extracted, so the positioning file is a parallel
  hand-written statement, not a derived one. If you change what the company
  claims on either page, change it there too. Keeping it to durable claims
  (mission, product, principles, status) rather than a transcript of the
  marketing prose is what keeps the drift slow.
- **X gates full Article text behind auth.** It cannot be fetched
  programmatically; only a ~200 character preview is public. The raw text has to
  be copied out by hand, which is why it is step one of the handover.
- **Every text colour on the site clears WCAG AA (4.5:1).** If you add copy, keep
  muted text at `text-chrome/65` or lighter. `/40` and `/50` fail.
