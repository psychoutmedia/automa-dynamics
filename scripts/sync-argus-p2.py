"""Build /safety/argus/claude-opus-5-5/explore from the ARGUS Proof-2 explorer.

    python scripts/sync-argus-p2.py [source.html]

The source is the reviewed P2 explorer built by the ARGUS project
(visuals/proof2_prototype/_build/build.py). This script never edits the graph:
the embedded JSON is guarded byte for byte against the commissioned SHA-256
and against the copy published under files/. Only the page around it changes,
each by an exact-count substitution, so a changed source stops the build
instead of publishing something half-converted:

- a real <head> for the domain (title, description, canonical, OG tags, icon);
  the prototype's noindex is removed
- dark theme by default (the explorer's own Theme toggle still works)
- the "local prototype" banner and owner-review-pending status replaced by the
  published status: fidelity audit complete, external peer review NOT completed
- a slim site bar linking the findings page and the ARGUS overview
- the explorer's self-link pointed at its public route, so deep links
  (#exec, #full/P2-G-004/iso) and embed "open full graph" links resolve
- footer: non-affiliation with Anthropic, findings link, graph JSON, contact

No web fonts or third-party requests are added: the footer promises none.
"""

import hashlib
import importlib.util
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Series parity with Proof-1: the Executive view's Fit control and pan/zoom
# script are taken verbatim from scripts/sync-argus.py, so the two graph pages
# cannot drift apart.
_spec = importlib.util.spec_from_file_location("sync_argus_p1", ROOT / "scripts" / "sync-argus.py")
_p1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_p1)
DEFAULT_SRC = pathlib.Path(r"H:\projectargus\visuals\proof2_prototype\ARGUS_P2_ASSURANCE_EXPLORER_DRAFT.html")
OUT = ROOT / "public" / "safety" / "argus" / "claude-opus-5-5" / "explore" / "index.html"
PUBLISHED_JSON = ROOT / "public" / "safety" / "argus" / "files" / "ARGUS_P2_ASSURANCE_GRAPH.json"
EXPECTED = "fd4bfcf389871d36a4466c5665442ac4ab0c2947c29c6b6b1c799a0c8790ac2a"

BASE = "https://www.automadynamics.com"
ROUTE = "/safety/argus/claude-opus-5-5/explore"
FINDINGS = "/safety/argus/claude-opus-5-5"
TITLE = "ARGUS Proof-2 Assurance Graph: Claude Opus 5.5"
DESCRIPTION = (
    "Interactive Claims-Arguments-Evidence graph reconstructing the public cybersecurity assurance "
    "record for Claude Opus 5.5: 50 nodes, 121 edge records and eight open public-assurance gaps. "
    "Independent research by Automa Dynamics; not affiliated with Anthropic."
)
OG_IMAGE = f"{BASE}/safety/argus/claude-opus-5-5/executive-graph.png"

SUM_OUT = ROOT / "public" / "safety" / "argus" / "claude-opus-5-5" / "summary" / "index.html"
SUM_ROUTE = "/safety/argus/claude-opus-5-5/summary"
SUM_TITLE = "ARGUS Proof-2 Case Summary: Claude Opus 5.5"
SUM_DESCRIPTION = (
    "ARGUS Proof-2 on one page: Anthropic's Claude Opus 5.5 cyber-safeguard claim in its own words, ARGUS's "
    "scope note, the reconstruction finding and counts, with the interactive assurance graph built in. "
    "Eight open public-assurance gaps, not findings that safeguards failed. Not affiliated with Anthropic."
)

BR_OUT = ROOT / "public" / "safety" / "argus" / "claude-opus-5-5" / "branches" / "index.html"
BR_ROUTE = "/safety/argus/claude-opus-5-5/branches"
BR_TITLE = "ARGUS Proof-2 Branch Reader: Claude Opus 5.5"
BR_DESCRIPTION = (
    "Read the Claude Opus 5.5 cybersecurity assurance case one branch at a time: each of the eight open "
    "public-assurance gaps traced from claim component to the evidence that would close it. "
    "Independent research by Automa Dynamics; not affiliated with Anthropic."
)
BR_CSS = """
/* Branch reader (standalone Executive reading mode): keep the site bar and footer. */
body.embed.standalone header.argusbar { display: flex; }
body.embed.standalone footer#xfoot { display: block; }
body.embed.standalone .wrap { max-width: 1280px; margin: 0 auto; padding: 0 20px 28px; gap: 12px; }
@media (max-width: 600px) { body.embed.standalone .wrap { padding: 0 12px 24px; } }
/* The reader is the point of this page: a shorter graph keeps the branch bar and
   the selected branch on the first screen (the full-screen graph is one click away). */
body.embed.standalone #exec-svg { height: clamp(320px, 50vh, 520px); }
"""

STATUS = ("Targeted source-to-visual fidelity audit complete; presentation corrections applied. "
          "Independent external peer review not completed.")

HEAD = f"""<!doctype html>
<html lang="en-GB" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{TITLE} | Automa Dynamics</title>
<meta name="description" content="{DESCRIPTION}">
<link rel="canonical" href="{BASE}{ROUTE}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Automa Dynamics">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{DESCRIPTION}">
<meta property="og:url" content="{BASE}{ROUTE}">
<meta property="og:image" content="{OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@automadynamics">
<meta name="twitter:title" content="{TITLE}">
<meta name="twitter:description" content="{DESCRIPTION}">
<meta name="twitter:image" content="{OG_IMAGE}">
<link rel="icon" href="/icon.png">
<!-- GENERATED FILE - do not edit. Rebuild: python scripts/sync-argus-p2.py
     Source: {{src}} (sha256 {{srcsha}}) -->
"""

SITE_CSS = """
/* ===== Automa Dynamics publication layer (scripts/sync-argus-p2.py) =====
   Layout mirrors /safety/argus/proof-1 (scripts/sync-argus.py): site ground in
   dark mode, a sparse sticky bar, and the graph given the viewport. The node and
   relationship colours are the series palette and are left alone. */
:root[data-theme="dark"] {
  --bg: #020617; --surface: #0a1020; --surface-2: #0e1628; --line: rgb(255 255 255 / 0.1); --grid: rgb(255 255 255 / 0.05);
}
.wrap { max-width: none; padding: 0 20px 28px; gap: 12px; }
@media (max-width: 600px) { .wrap { padding: 0 12px 24px; } }

.argusbar { position: sticky; top: 0; z-index: 10; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px;
  padding: 12px 0 10px; background: color-mix(in srgb, var(--bg) 85%, transparent); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line); }
.argusbar .home { display: flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; }
.argusbar .home img { width: 22px; height: 22px; object-fit: contain; }
.argusbar .name { font: 500 13px/1 var(--f-mono); letter-spacing: .18em; text-transform: uppercase; }
.argusbar .name span { color: var(--muted); letter-spacing: .08em; }
.argusbar .eyebrow { font-size: 11px; margin: 0; }
.argusbar .eyebrow .tag { background: transparent; }
/* two rows, as on Proof-1: name + links + Theme, then the scope tags */
.argusbar .links { order: 1; margin-left: auto; display: flex; align-items: center; gap: 6px 18px; flex-wrap: wrap; }
.argusbar .eyebrow { order: 2; flex: 1 1 100%; }
.argusbar .links .themebtn { margin-left: 0; }
.argusbar .links a { font: 500 12px var(--f-mono); color: var(--muted); text-decoration: none; white-space: nowrap; }
.argusbar .links a:hover, .argusbar .links a:focus-visible { color: var(--ink); }
@media (max-width: 900px) { .argusbar { position: static; } .argusbar .links { margin-left: 0; } }

/* the graph gets the viewport */
aside.panel { top: 64px; max-height: calc(100vh - 76px); }
#full-svg { height: max(520px, calc(100vh - 220px)); }
@media (max-width: 700px) { #full-svg { height: 72vh; } }
#view-exec .scroller { overflow: hidden; }
#exec-svg { min-width: 0; height: max(480px, calc(100vh - 220px)); cursor: grab; touch-action: none; }
#exec-svg:active { cursor: grabbing; }
@media (max-width: 700px) { #exec-svg { height: 72vh; } }
.tabs { margin-top: 4px; }

footer { max-width: 118ch; padding-top: 16px; border-top: 1px solid var(--line); margin-top: 8px; }
footer .reviewterms { margin-bottom: 6px; }
#xfoot a { color: var(--claim); }
body.embed .argusbar { display: none; }
/* AA contrast: the tab counts used --faint (4.27:1 on the dark ground). */
.tab small { color: var(--muted); }
/* Light theme (opt-in via Theme): amber warn text was 2.9-3.1:1 on white; text only, borders keep the series amber. */
:root[data-theme="light"] .tag.warn, :root[data-theme="light"] .tok.unk { color: #8A5A00; }
"""

BAR_LINKS = f"""    <nav class="links" aria-label="ARGUS Proof-2">
      <a href="{SUM_ROUTE}">Case summary</a>
      <a href="{FINDINGS}">Findings</a>
      <a href="/safety/argus">About ARGUS &rarr;</a>
      @@THEME@@
    </nav>"""

# The renderer fills these ids; kept in the DOM so its lookups resolve, not shown
# (the findings page carries the claim and finding in prose, as /safety/argus does for Proof-1).
HIDDEN = ('    <div hidden><h1>ARGUS Proof-2 Assurance Graph</h1><span id="rootLabel"></span><p id="c1text"></p>'
          '<span id="c1cite"></span><p id="conclusion"></p><div id="counts"></div></div>')

FOOT_TAIL = f"""    <p>Independent research by <a href="/">Automa Dynamics</a>. Not affiliated with, commissioned by, or endorsed by Anthropic, and not a certification that Claude Opus 5.5 is safe or unsafe. <a href="{FINDINGS}">Findings</a> &middot; <a href="/safety/argus">ARGUS overview</a> &middot; <a href="/safety/argus/files/ARGUS_P2_ASSURANCE_GRAPH.json">Graph JSON</a> &middot; <a href="mailto:hello@automadynamics.com?subject=ARGUS%20Proof-2">hello@automadynamics.com</a></p>
  </footer>"""

# (old, new) pairs; each old string must occur exactly once in the source.
SUBS = [
    ('<html lang="en">\n<head>\n<meta charset="utf-8">\n'
     '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
     '<meta name="robots" content="noindex,nofollow">\n'
     '<title>ARGUS Proof-2 Assurance Graph</title>\n', None),  # replaced by HEAD below
    ('<div class="proto-banner" id="protoBanner">Local prototype \u00b7 not published \u00b7 <b>'
     'Targeted source-to-visual fidelity audit complete; presentation corrections applied \u2014 owner review pending. '
     'Independent external peer review not completed.</b></div>\n', ''),
    ('<span class="tag warn">Technical reconstruction complete \u2014 presentation corrections await owner review; '
     'not publication-ready</span>',
     '<span class="tag warn">Technical reconstruction complete \u00b7 not externally peer reviewed</span>'),
    ('<strong>Research filed 11 October 2026. Targeted source-to-visual fidelity audit complete; presentation '
     'corrections applied \u2014 owner review pending. Independent external peer review not completed.</strong>',
     f'<strong>Research filed 11 October 2026. {STATUS}</strong>'),
    ('has since been completed and its presentation corrections applied; owner review is pending. That audit is '
     'not external peer review, which has not been completed. This prototype is not publication-ready.</p>',
     'has since been completed and its presentation corrections applied. That audit is not external peer review, '
     'which has not been completed. Findings may be revised with cited corrections.</p>'),
    ('<p><strong>Local review artifact:</strong> no telemetry',
     '<p><strong>Published artifact:</strong> no telemetry'),
    ("const EXPLORER = 'ARGUS_P2_ASSURANCE_EXPLORER_DRAFT.html';", f"const EXPLORER = '{ROUTE}';"),
    ('\n  </footer>\n</div>\n\n<script id="argus-p2"', '\n' + FOOT_TAIL + '\n</div>\n\n<script id="argus-p2"'),
]


def main():
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    raw = src.read_bytes()
    html = raw.decode("utf-8")

    tag = '<script id="argus-p2" type="application/json">'
    a = html.index(tag) + len(tag)
    embedded = html[a:html.index("</script>", a)]
    digest = hashlib.sha256(embedded.encode("utf-8")).hexdigest()
    if digest != EXPECTED:
        sys.exit(f"sync-argus-p2: embedded graph sha256 {digest} != commissioned {EXPECTED}")
    if PUBLISHED_JSON.read_bytes() != embedded.encode("utf-8"):
        sys.exit("sync-argus-p2: embedded graph differs from public/safety/argus/files/ARGUS_P2_ASSURANCE_GRAPH.json")

    head = HEAD.replace("{src}", "ARGUS P2 explorer build").replace("{srcsha}", hashlib.sha256(raw).hexdigest())
    for old, new in SUBS:
        n = html.count(old)
        if n != 1:
            sys.exit(f"sync-argus-p2: anchor found {n}x, expected 1 (source layout changed): {old[:70]!r}")
        if new is None:
            # head swap: drop the doctype + prototype head lines, put the real head in
            html = html.replace("<!doctype html>\n" + old, head, 1)
            if html.count(head) != 1:
                sys.exit("sync-argus-p2: head swap failed")
        else:
            html = html.replace(old, new, 1)

    # Proof-1 layout: the large header becomes one sparse sticky bar; reading
    # conditions move to the top of the footer (as on /safety/argus/proof-1).
    m = re.search(r'  <header id="xhead">\n.*?  </header>\n', html, re.S)
    if not m or html.count('<header id="xhead">') != 1:
        sys.exit("sync-argus-p2: header block not found, source layout changed")
    hdr = m.group(0)
    eb = re.search(r'    <div class="eyebrow">.*?\n    </div>\n', hdr, re.S)
    terms = re.search(r'    <div class="reviewterms".*?\n    </div>\n', hdr, re.S)
    if not eb or not terms:
        sys.exit("sync-argus-p2: eyebrow or reading conditions not found")
    for needed in ('id="rootLabel"', 'id="c1text"', 'id="c1cite"', 'id="conclusion"', 'id="counts"'):
        if needed not in hdr:
            sys.exit(f"sync-argus-p2: header no longer carries {needed}; update HIDDEN")
    # The Theme button moves from the tag row to the links, beside About ARGUS.
    theme = re.search(r'\s*(<button class="btn themebtn"[^>]*>Theme</button>)', eb.group(0))
    if not theme:
        sys.exit("sync-argus-p2: theme button not found")
    eyebrow = eb.group(0).replace(theme.group(0), "", 1)
    bar_open = ('    <a class="home" href="/safety/argus" aria-label="ARGUS overview">\n'
                '      <img src="/logo.png" alt="" width="22" height="22">\n'
                '      <span class="name">ARGUS <span>Proof-2</span></span>\n'
                '    </a>\n' + eyebrow + BAR_LINKS.replace("@@THEME@@", theme.group(1)) + '\n')
    pre = html

    # Explorer: header collapsed to the bar, reading conditions to the footer.
    html = pre.replace(hdr, '  <header class="argusbar" id="xhead">\n' + bar_open + HIDDEN + '\n  </header>\n', 1)
    if html.count('  <footer id="xfoot">\n') != 1:
        sys.exit("sync-argus-p2: footer not found")
    html = html.replace('  <footer id="xfoot">\n', '  <footer id="xfoot">\n' + terms.group(0), 1)

    # Case summary: the original one-page layout (76f65ee). The same bar, then the
    # case card the viewer was built with (title, root claim, finding, counts,
    # reading conditions) with the live graph and record panel directly beneath.
    card = hdr.replace('  <header id="xhead">\n', '  <header class="casehead">\n', 1).replace(eb.group(0), "", 1)
    summary = pre.replace(hdr, '  <header class="argusbar" id="xhead">\n' + bar_open + '  </header>\n' + card, 1)

    def finish(page, label):
        # Executive view: Proof-1's Fit control beside the toolbar note, and its pan/zoom script.
        if page.count(_p1.EXEC_NOTE) != 1:
            sys.exit(f"sync-argus-p2 ({label}): executive toolbar note not found, source layout changed")
        page = page.replace(_p1.EXEC_NOTE, _p1.EXEC_NOTE + "\n          " + _p1.EXEC_CTL, 1)
        if page.count("</body>\n</html>") != 1:
            sys.exit(f"sync-argus-p2 ({label}): document end not found")
        page = page.replace("</body>\n</html>", _p1.EXEC_ZOOM + "\n</body>\n</html>", 1)
        # Publication CSS goes last inside the single stylesheet, so it wins on equal specificity.
        if page.count("</style>\n</head>") != 1:
            sys.exit(f"sync-argus-p2 ({label}): stylesheet end not found")
        page = page.replace("</style>\n</head>", SITE_CSS + "</style>\n</head>", 1)
        for banned in ("noindex", "proto-banner\" id", "Local prototype", "owner review pending",
                       "not publication-ready", "DRAFT.html"):
            if banned in page:
                sys.exit(f"sync-argus-p2 ({label}): prototype-only text survived: {banned!r}")
        # The embedded block must still be byte-identical after the page edits.
        a = page.index(tag) + len(tag)
        if hashlib.sha256(page[a:page.index("</script>", a)].encode("utf-8")).hexdigest() != EXPECTED:
            sys.exit(f"sync-argus-p2 ({label}): embedded graph changed during conversion")
        return page

    html = finish(html, "explorer")
    summary = finish(summary, "summary")
    for old, new, n in [
        (f"{TITLE} | Automa Dynamics</title>", f"{SUM_TITLE} | Automa Dynamics</title>", 1),
        (f'content="{TITLE}"', f'content="{SUM_TITLE}"', 2),
        (f'content="{DESCRIPTION}"', f'content="{SUM_DESCRIPTION}"', 3),
        (f'"{BASE}{ROUTE}"', f'"{BASE}{SUM_ROUTE}"', 2),
        ('<span class="name">ARGUS <span>Proof-2</span></span>',
         '<span class="name">ARGUS <span>Proof-2 &middot; Case summary</span></span>', 1),
        (f'      <a href="{SUM_ROUTE}">Case summary</a>\n', f'      <a href="{ROUTE}#exec">Full-screen graph</a>\n', 1),
    ]:
        if summary.count(old) != n:
            sys.exit(f"sync-argus-p2: summary anchor found {summary.count(old)}x, expected {n}: {old[:60]!r}")
        summary = summary.replace(old, new)
    SUM_OUT.parent.mkdir(parents=True, exist_ok=True)
    SUM_OUT.write_text(summary, encoding="utf-8", newline="\n")
    print(f"wrote {SUM_OUT.relative_to(ROOT)} ({len(summary.encode('utf-8')):,} bytes; same embedded graph)")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8", newline="\n")
    j = json.loads(embedded)
    print(f"wrote {OUT.relative_to(ROOT)} ({len(html.encode('utf-8')):,} bytes; {len(j['nodes'])} nodes, "
          f"{len(j['edges'])} edges; embedded sha256 {EXPECTED[:16]}... identical)")

    # Branch reader: the same page, opened in the explorer's Executive reading
    # mode (graph, branch reader and record panel in one column, no Full tab),
    # with the bar and footer kept so it stands as a page of its own.
    br = html
    for old, new, n in [
        (f"{TITLE} | Automa Dynamics</title>", f"{BR_TITLE} | Automa Dynamics</title>", 1),
        (f'content="{TITLE}"', f'content="{BR_TITLE}"', 2),
        (f'content="{DESCRIPTION}"', f'content="{BR_DESCRIPTION}"', 3),
        (f'"{BASE}{ROUTE}"', f'"{BASE}{BR_ROUTE}"', 2),
        ("const params = new URLSearchParams(location.search), EMBED = params.get('embed');",
         "const params = new URLSearchParams(location.search), EMBED = 'exec'; document.body.classList.add('standalone');", 1),
        ('<span class="name">ARGUS <span>Proof-2</span></span>',
         '<span class="name">ARGUS <span>Proof-2 &middot; Branch reader</span></span>', 1),
        (f'      <a href="{FINDINGS}">Findings</a>\n',
         f'      <a href="{ROUTE}#exec">Full-screen graph</a>\n      <a href="{FINDINGS}">Findings</a>\n', 1),
        ("</style>\n</head>", BR_CSS + "</style>\n</head>", 1),
    ]:
        if br.count(old) != n:
            sys.exit(f"sync-argus-p2: branch-reader anchor found {br.count(old)}x, expected {n}: {old[:60]!r}")
        br = br.replace(old, new)
    a = br.index(tag) + len(tag)
    if hashlib.sha256(br[a:br.index("</script>", a)].encode("utf-8")).hexdigest() != EXPECTED:
        sys.exit("sync-argus-p2: embedded graph changed in branch reader")
    BR_OUT.parent.mkdir(parents=True, exist_ok=True)
    BR_OUT.write_text(br, encoding="utf-8", newline="\n")
    print(f"wrote {BR_OUT.relative_to(ROOT)} ({len(br.encode('utf-8')):,} bytes; same embedded graph)")


if __name__ == "__main__":
    main()
