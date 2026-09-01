# Agent-readable surface for automadynamics.com

## Context

AutomaDynamics publishes articles arguing that enterprise AI needs structured, inspectable,
machine-readable ground truth. Article 005 argues authority must be machine readable. 004 argues
explanations need evidence, not prose. 003 argues a business is a graph. The site itself currently
serves agents nothing but React hydration, which argues against the thesis.

This adds a machine-readable surface: a spec-compliant `/llms.txt` manifest and a `/llms-full.txt`
context dump carrying the complete positioning statement and all five articles as clean markdown.

**This is a credibility and pull-path play, not a traffic play.** The evidence is unambiguous that
nothing discovers these files:

- [Ahrefs, May 2026, 137,210 domains](https://ahrefs.com/blog/llmstxt-study/): 28% publish a valid
  `llms.txt`; **97% of those received zero traffic**. OAI-SearchBot, PerplexityBot and Claude search
  managed ~200 fetches combined. *"Zero requests came from AI bots for llms.txt files that don't
  exist. They never go looking."*
- [SE Ranking, ~300k domains](https://www.searchenginejournal.com/llms-txt-shows-no-clear-effect-on-ai-citations-based-on-300k-domains/561542/):
  no relationship to LLM citation. Removing the variable *improved* their prediction model.
- [Mueller, July 2025](https://www.searchenginejournal.com/google-says-it-could-make-sense-to-use-noindex-header-with-llms-txt/551744/):
  no Google system reads it; consider `noindex` so it does not surface to humans.

What the same data does support: among the files that were fetched, **Claude-Code outfetched every
AI retrieval bot**. The split is push vs. pull. Nothing crawls to it; but when an architect *points*
Claude Code, Cursor or an internal vendor-evaluation pipeline at the domain, this is the path it
lands on. That is AutomaDynamics' actual buyer.

**Never claim an SEO or citation benefit from this work.** The 300k-domain study says there is none.

### Explicitly out of scope

The source brief's product-schema half (`HardwareProduct`, `pricing`, `POST /api/v1/quote`,
programmatic tool-call endpoints) does not apply. HELIOS is in active development with no pricing
and no public API. Do not invent a product schema for a product that is not shipping. Per-page `.md`
twins and `Accept`-header content negotiation are also out: content negotiation needs `Vary: Accept`,
which fights Vercel's CDN cache, and the llmstxt.org spec's own preference is separate URLs anyway.

---

## Design

Two new route handlers modelled **exactly** on the existing `app/feed.xml/route.js`: a synchronous
non-async `GET` with no `request` argument and no dynamic APIs, which is precisely why Next
prerenders it as static (0 B in the build table). Dotted route folders already work in this repo -
`app/feed.xml/` is the proof.

### Files to create

| Path | Purpose |
|---|---|
| `content/positioning.md` | Hand-written canonical entity definition. The single source of truth for both endpoints. |
| `lib/positioning.js` | ~10 lines: `getPositioning()` reads the file with `fs.readFileSync`, mirroring `lib/articles.js`. |
| `app/llms.txt/route.js` | The spec-compliant manifest, ~2 KB. |
| `app/llms-full.txt/route.js` | Positioning + all article bodies, ~75 KB. |

### Files to edit

| Path | Change |
|---|---|
| `app/layout.js` | One line into the existing `alternates.types` block (which already carries `application/rss+xml`): add `'text/markdown': [{ url: '/llms-full.txt', title: 'Automa Dynamics Full Context' }]`. This is the only standards-based discovery hook that actually exists. |
| `PUBLISHING.md` | Document the drift risk and the endpoints in the drill. |

### Reuse, do not reinvent

- `getAllArticles()` from `lib/articles.js` - inherits the `draft: true` gate for free, exactly as
  the sitemap and feed do. Drafts must never reach either endpoint.
- `formatSeriesNumber()` from `lib/articles.js` - renders `5` as `005`.
- `article.content` - the raw markdown body straight out of gray-matter, already independent of
  MDX rendering. No new parsing is needed anywhere in this plan.
- `SITE_URL` imported from `lib/articles.js`, the pattern `app/about/page.js` already uses.
  The origin is currently duplicated across five files; **do not refactor that here** - it is
  unrelated scope.
- The `Cache-Control` value from `feed.xml/route.js`: `public, max-age=0, s-maxage=3600, stale-while-revalidate=86400`.

### Response headers on both endpoints

```
Content-Type:  text/plain; charset=utf-8
Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400
X-Robots-Tag:  noindex
```

`text/plain` because the URLs end `.txt` and browsers render it inline. `noindex` directly follows
the verified Mueller guidance so the raw file never surfaces to a human searcher.

### `/llms.txt` shape (per llmstxt.org)

H1, blockquote summary, free prose (spec allows any non-heading section here - the pointer to
`/llms-full.txt` goes in this block), then H2-delimited link lists:

```
# Automa Dynamics

> Operational intelligence, enterprise ontology architecture and governed decision-making.
> Automa Dynamics builds Project HELIOS, an operational ontology platform and enterprise digital twin.

Complete context in one request: https://www.automadynamics.com/llms-full.txt

## Positioning
- [About](.../about): why the company exists, what it builds, how it works.
- [Overview](...): mission, principles, and the HELIOS platform.

## Articles
- [005 - AI Agents Need Authority, Not Just Tools](...): <frontmatter description>
  ... generated from getAllArticles(), newest first

## Optional
- [RSS feed](.../feed.xml): article feed.
```

### `/llms-full.txt` ordering - a deliberate decision

The corpus is 10,116 words / 68.5 KB, so the file lands around **75 KB**. That is above the
20-50 KB tool-return truncation limit many agents impose, so ordering is load-bearing:

1. Header: canonical URL, generation date, article count
2. **Positioning first** - a truncated fetch still gets the entity definition, which is the whole point
3. Article index - all five titles and descriptions, so nothing is invisible even when the body is cut
4. Full article bodies, in **series order 001 to 005**, because the series is a cumulative argument

### `content/positioning.md` must carry

Mission, the HELIOS definition, the four principles (Ontology Before AI, Evidence Before Assertion,
Human Authority Is Explicit, One Coherent Model), the four capabilities, and contact. Plus the two
highest-value lines, which prevent an agent inventing facts:

- **What this is not** - not a chatbot, not a RAG wrapper, not generic "business AI"
- **Status** - HELIOS is in active development, not generally available, no public pricing or API

House rule applies to every generated string: **no em dashes** (`PUBLISHING.md`). All five articles
are already clean; the new positioning file must be written clean.

### Known maintenance risk, to be documented not engineered away

Homepage and `/about` prose is inline JSX and cannot be extracted programmatically. `positioning.md`
is therefore a parallel hand-written statement that can drift from the site copy. Mitigation: keep it
to durable claims (mission, product, principles, status) rather than a transcript of the marketing
prose, and note the coupling in `PUBLISHING.md`. Articles carry no such risk - they generate from
frontmatter and body automatically.

### Optional addition, easily cut

`app/page.js` has no JSON-LD at all, while `/about` and both article routes do. Adding an
`Organization` + `WebSite` block to the homepage is a few lines reusing the existing `PUBLISHER`
shape. Unlike `llms.txt`, schema.org **is** consumed by real crawlers today, so this is the
highest-evidence item on the page. Flagged separately so it can be dropped without touching the rest.

---

## Verification

`next start` holds `.next` and makes the build fail with `Cannot find module for page: /sitemap.xml`.
Kill node first - on Windows `pkill` does not work, use `taskkill //PID <pid> //F`.

```bash
cd /h/automa-dynamics && rm -rf .next && npm run build
```

1. **Build table** shows `/llms.txt` and `/llms-full.txt` as `○ (Static)` at 0 B. Anything else means
   a dynamic API leaked in and the handler is being rendered per request.
2. Start the server and walk both endpoints:
   ```bash
   curl -s -D- -o /dev/null http://localhost:3000/llms.txt        # 200, text/plain, X-Robots-Tag: noindex
   curl -s http://localhost:3000/llms-full.txt | wc -c            # expect ~75000
   ```
3. **Draft gate**: confirm the production build excludes anything marked `draft: true`. Temporarily
   flip one article to `draft: true`, rebuild, confirm it vanishes from both files and from
   `/sitemap.xml`, then revert.
4. **All five articles present** and in series order:
   `curl -s http://localhost:3000/llms-full.txt | grep -n "^## 00"`
5. **Em dash sweep** on generated output, not just source:
   `curl -s http://localhost:3000/llms-full.txt | grep -c $'—'` must be 0.
6. **Regression walk** - the existing endpoints must be untouched:
   `/`, `/about`, `/articles`, one article, `/sitemap.xml`, `/feed.xml`, `/robots.txt` all 200.
7. **The real test**: point a fresh agent at `automadynamics.com/llms.txt` and ask it to describe
   what the company does and what HELIOS is. It should come back with the ontology/evidence/authority
   framing and correctly state that HELIOS is in development with no pricing. If it says "AI
   consultancy" or invents a price, `positioning.md` is not doing its job.
8. Stop the server, then commit. **Mark pushes** - deploying is his step.
