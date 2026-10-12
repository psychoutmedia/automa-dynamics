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
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
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
/* ===== Automa Dynamics publication layer (scripts/sync-argus-p2.py) ===== */
.sitebar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; padding: 12px 20px;
  border-bottom: 1px solid var(--line); background: var(--surface); }
.sitebar .home { display: flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; }
.sitebar .home img { width: 22px; height: 22px; object-fit: contain; }
.sitebar .name { font: 600 12.5px/1 var(--f-mono); letter-spacing: .16em; text-transform: uppercase; }
.sitebar .name span { color: var(--muted); letter-spacing: .06em; }
.sitebar nav { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-left: auto; }
.sitebar nav a { font: 500 12.5px var(--f-mono); color: var(--muted); text-decoration: none; }
.sitebar nav a:hover, .sitebar nav a:focus-visible { color: var(--ink); text-decoration: underline; }
@media (max-width: 700px) { .sitebar { padding: 10px 12px; } .sitebar nav { margin-left: 0; } }
#xfoot a { color: var(--claim); }
body.embed .sitebar { display: none; }
/* AA contrast: the tab counts used --faint (4.27:1 on the dark ground). */
.tab small { color: var(--muted); }
/* Light theme (opt-in via Theme): amber warn text was 2.9-3.1:1 on white; text only, borders keep the series amber. */
:root[data-theme="light"] .tag.warn, :root[data-theme="light"] .tok.unk { color: #8A5A00; }
"""

SITEBAR = f"""<header class="sitebar">
  <a class="home" href="/safety/argus" aria-label="ARGUS overview">
    <img src="/logo.png" alt="" width="22" height="22">
    <span class="name">ARGUS <span>Proof-2 &middot; Claude Opus 5.5</span></span>
  </a>
  <nav aria-label="ARGUS Proof-2">
    <a href="{FINDINGS}">Findings</a>
    <a href="/safety/argus">ARGUS overview</a>
    <a href="/">Automa Dynamics</a>
  </nav>
</header>
"""

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
     'Independent external peer review not completed.</b></div>\n', SITEBAR),
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

    # Publication CSS goes last inside the single stylesheet, so it wins on equal specificity.
    if html.count("</style>\n</head>") != 1:
        sys.exit("sync-argus-p2: stylesheet end not found")
    html = html.replace("</style>\n</head>", SITE_CSS + "</style>\n</head>", 1)

    for banned in ("noindex", "proto-banner\" id", "Local prototype", "owner review pending",
                   "not publication-ready", "DRAFT.html"):
        if banned in html:
            sys.exit(f"sync-argus-p2: prototype-only text survived: {banned!r}")

    # The embedded block must still be byte-identical after the page edits.
    a = html.index(tag) + len(tag)
    if hashlib.sha256(html[a:html.index("</script>", a)].encode("utf-8")).hexdigest() != EXPECTED:
        sys.exit("sync-argus-p2: embedded graph changed during conversion")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8", newline="\n")
    j = json.loads(embedded)
    print(f"wrote {OUT.relative_to(ROOT)} ({len(html.encode('utf-8')):,} bytes; {len(j['nodes'])} nodes, "
          f"{len(j['edges'])} edges; embedded sha256 {EXPECTED[:16]}... identical)")


if __name__ == "__main__":
    main()
