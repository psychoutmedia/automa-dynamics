"""Build /safety/argus/proof-1 from the ARGUS review graph.

    python scripts/sync-argus.py [source.html]

Since 9 October 2026 the source is the Proof-1.1 review artifact: the same
graph plus a third "Temporal delta" tab and the P1.1 overlay
(ARGUS_P11_DELTA.json). Both JSON datasets are embedded byte for byte and
guarded against the copies published under files/. The page opens on the
Temporal delta tab; #exec and #full deep-link to the graph views, and the
retired /safety/argus/proof-1-1 URL redirects to #delta (next.config.js).

The source is the self-contained review artifact exported from the ARGUS
project. This script never edits the graph itself: the embedded JSON and the
renderer script are copied byte for byte (the page footer publishes the JSON's
SHA-256, so they must stay that way). Only the page around them changes:

- a real <head> for the domain (title, description, OG tags, icon)
- dark theme forced, ground and surfaces moved onto the site's palette
- the long audit header collapsed to one sparse bar: ARGUS, scope, cutoff, status
- the confidentiality and non-endorsement terms moved down into the footer
- the layout released from its 1440px column so the graph takes the viewport

No web fonts are loaded on purpose. The footer promises no automatic
third-party network requests, and Google Fonts would break that promise.
"""

import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_SRC = pathlib.Path(r"H:\projectargus\Graphs\ARGUS Proof-1.1 Temporal Assurance_REVIEW.html")
OUT = ROOT / "public" / "safety" / "argus" / "proof-1" / "index.html"
PUBLISHED_JSON = ROOT / "public" / "safety" / "argus" / "files" / "ARGUS_P1_ASTRA_GRAPH.json"
P11_PUBLISHED_JSON = ROOT / "public" / "safety" / "argus" / "files" / "ARGUS_P11_DELTA.json"

TITLE = "ARGUS Proof-1 Assurance Graph"
DESCRIPTION = (
    "Interactive Claims-Arguments-Evidence graph reconstructing the public assurance case "
    "for GPT-6 Astra's cybersecurity public-release claim, with a 9 October 2026 temporal update "
    "re-examining all nine gaps. Independent research by Automa Dynamics."
)
URL = "https://www.automadynamics.com/safety/argus/proof-1"
OG_IMAGE = "https://www.automadynamics.com/safety/argus/executive-graph.png"
STATUS = "Technical complete - external review open"

SUM_OUT = ROOT / "public" / "safety" / "argus" / "proof-1" / "summary" / "index.html"
SUM_URL = "https://www.automadynamics.com/safety/argus/proof-1/summary"
SUM_TITLE = "ARGUS Proof-1 Case Summary: GPT-6 Astra"
SUM_DESCRIPTION = (
    "ARGUS Proof-1 on one page: the GPT-6 Astra cybersecurity release claim, the reconstruction conclusion "
    "and counts, with the interactive assurance graph and the 9 October 2026 temporal update built in. "
    "Assurance gaps, not findings that safeguards failed. Not affiliated with OpenAI."
)

HEAD = f"""<!doctype html>
<html lang="en-GB" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{TITLE} | Automa Dynamics</title>
<meta name="description" content="{DESCRIPTION}">
<link rel="canonical" href="{URL}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Automa Dynamics">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{DESCRIPTION}">
<meta property="og:url" content="{URL}">
<meta property="og:image" content="{OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@automadynamics">
<meta name="twitter:title" content="{TITLE}">
<meta name="twitter:description" content="{DESCRIPTION}">
<meta name="twitter:image" content="{OG_IMAGE}">
<link rel="icon" href="/icon.png">
<style>html{{-webkit-text-size-adjust:100%}}body{{margin:0;padding:0}}img{{max-width:100%}}[hidden]:not([hidden=until-found i]){{display:none!important}}</style>
</head>
<body>
<!-- GENERATED FILE - do not edit.
     Source: {{src}}
     Rebuild: python scripts/sync-argus.py -->
"""

# Appended after the artifact's own stylesheet, so these win on equal specificity.
SITE_CSS = """
<style>
/* Automa Dynamics overrides. The node and relationship colours are the graph's
   own categorical palette and carry meaning, so they are left alone. Only the
   ground, surfaces and rules move onto the site (wayland-950 ground). */
:root[data-theme="dark"] {
  --bg: #020617; --surface: #0a1020; --surface-2: #0e1628; --line: rgb(255 255 255 / 0.1); --grid: rgb(255 255 255 / 0.05);
}
.wrap { max-width: none; padding: 0 20px 28px; gap: 12px; }
@media (max-width: 600px) { .wrap { padding: 0 12px 24px; } }

/* sparse top bar */
.argusbar { position: sticky; top: 0; z-index: 10; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px;
  padding: 12px 0 10px; background: rgb(2 6 23 / 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgb(255 255 255 / 0.05); }
.argusbar .home { display: flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; }
.argusbar .home img { width: 22px; height: 22px; object-fit: contain; }
.argusbar .name { font: 500 13px/1 var(--f-mono); letter-spacing: .18em; text-transform: uppercase; }
.argusbar .name span { color: var(--muted); letter-spacing: .08em; }
.argusbar .eyebrow { font-size: 11px; }
.argusbar .eyebrow .tag { background: transparent; }
.argusbar .back { margin-left: auto; font: 500 12px var(--f-mono); color: #b8c5d6; text-decoration: none; white-space: nowrap; }
.argusbar .back:hover { color: #e8e8e8; }
.argusbar .back { white-space: normal; display: flex; flex-wrap: wrap; gap: 4px 14px; }
.argusbar .back a { color: inherit; text-decoration: none; white-space: nowrap; }
.argusbar .back a:hover, .argusbar .back a:focus-visible { color: #e8e8e8; }
@media (max-width: 900px) { .argusbar { position: static; } .argusbar .back { margin-left: 0; } }

/* the graph gets the viewport */
aside.panel { top: 64px; max-height: calc(100vh - 76px); }
#full-svg { height: max(520px, calc(100vh - 220px)); }
@media (max-width: 700px) { #full-svg { height: 72vh; } }
/* The Full view's Jump-to menu ran 8px past a 390px screen; let it shrink. */
@media (max-width: 700px) { #view-full .ctl { min-width: 0; max-width: 100%; flex-wrap: wrap; } #jump { min-width: 0; max-width: 100%; } }
/* Executive view: fitted to the viewport like the full graph, not stretched to
   the page width, and zoomable (see EXEC_ZOOM). */
#view-exec .scroller { overflow: hidden; }
#exec-svg { min-width: 0; height: max(480px, calc(100vh - 220px)); cursor: grab; touch-action: none; }
#exec-svg:active { cursor: grabbing; }
@media (max-width: 700px) { #exec-svg { height: 72vh; } }
.tabs { margin-top: 4px; }

footer { max-width: 118ch; padding-top: 16px; border-top: 1px solid var(--line); margin-top: 8px; }
footer .reviewterms { margin-bottom: 6px; }
footer a { color: #b8c5d6; }
</style>
"""

BAR = f"""  <header class="argusbar">
    <a class="home" href="/safety/argus" aria-label="ARGUS overview">
      <img src="/logo.png" alt="" width="22" height="22">
      <span class="name">ARGUS <span>Proof-1</span></span>
    </a>
    <div class="eyebrow">
      <span id="proof-id">ARGUS-P1-ASTRA</span>
      <span class="tag" id="scope-org"></span>
      <span class="tag" id="scope-sys"></span>
      <span class="tag" id="scope-dom"></span>
      <span class="tag" id="scope-ctx"></span>
      <span class="tag mono" id="cutoff"></span>
      <span class="tag warn">{STATUS}</span>
      <span class="tag mono">Updated 9 Oct 2026</span>
    </div>
    <span class="back"><a href="/safety/argus/proof-1/summary#exec">Case summary</a> <a href="/safety/argus">About ARGUS &rarr;</a></span>
    <!-- Populated by the renderer; kept so its lookups resolve, not shown. -->
    <div hidden><span id="review"></span><p id="c1text"></p><p id="conclusion"></p><div id="counts"></div></div>
  </header>
"""

# Toolbar control for the executive view, matching the full view's Fit button.
EXEC_NOTE = '<span class="note">Short labels are editorial. Click any node for the exact register text.</span>'
EXEC_CTL = (
    '<span class="ctl"><span class="note">Drag to pan, scroll or pinch to zoom.</span>'
    ' <button class="btn" id="exec-fit" type="button">Fit</button></span>'
)

# Pan and zoom for the executive view. The view is a fixed viewBox, so this
# moves the viewBox rather than a transform: edges, labels and the existing
# hit-testing all keep working untouched. Limits mirror the full view (4x either way).
EXEC_ZOOM = r"""<script>
(function () {
  const svg = document.getElementById('exec-svg');
  if (!svg) return;
  const base = svg.getAttribute('viewBox').trim().split(/[\s,]+/).map(Number);
  let vb = base.slice();
  const apply = () => svg.setAttribute('viewBox', vb.map(v => v.toFixed(2)).join(' '));
  const scale = () => { const m = svg.getScreenCTM(); return m ? m.a : 1; };
  const toUser = (cx, cy) => {
    const m = svg.getScreenCTM();
    if (!m) return { x: vb[0] + vb[2] / 2, y: vb[1] + vb[3] / 2 };
    const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
    return pt.matrixTransform(m.inverse());
  };
  // f > 1 zooms out, about user-space point u, which stays under the cursor.
  const zoomAt = (u, f) => {
    const w = Math.max(base[2] / 4, Math.min(base[2] * 4, vb[2] * f));
    f = w / vb[2];
    vb = [u.x - (u.x - vb[0]) * f, u.y - (u.y - vb[1]) * f, vb[2] * f, vb[3] * f];
    apply();
  };
  svg.addEventListener('wheel', ev => {
    ev.preventDefault();
    zoomAt(toUser(ev.clientX, ev.clientY), Math.exp(ev.deltaY * 0.0015));
  }, { passive: false });

  let pan = null, moved = false;
  svg.addEventListener('pointerdown', ev => {
    if (ev.button !== 0 || (ev.target.closest && ev.target.closest('.node'))) return;
    pan = { x: ev.clientX, y: ev.clientY, vx: vb[0], vy: vb[1], s: scale() };
    moved = false;
    svg.setPointerCapture(ev.pointerId);
  });
  svg.addEventListener('pointermove', ev => {
    if (!pan) return;
    const dx = ev.clientX - pan.x, dy = ev.clientY - pan.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    vb[0] = pan.vx - dx / pan.s; vb[1] = pan.vy - dy / pan.s;
    apply();
  });
  const end = ev => { if (!pan) return; pan = null; try { svg.releasePointerCapture(ev.pointerId); } catch (_) {} };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
  // A drag ends in a click on the background, which would clear the pinned
  // node. Swallow that one click in the capture phase, before it arrives.
  svg.parentNode.addEventListener('click', ev => { if (moved) { ev.stopPropagation(); moved = false; } }, true);

  document.getElementById('exec-fit').addEventListener('click', () => { vb = base.slice(); apply(); });
})();
</script>"""

FOOTER_TAIL = """    <p>Independent research by <a href="/">Automa Dynamics</a>. Not affiliated with, commissioned by, or endorsed by OpenAI. <a href="/safety/argus">Method, Proof-1 summary and review questions</a> &middot; <a href="/safety/argus/files/ARGUS_P1_ASTRA_GRAPH.json">Graph JSON</a> &middot; <a href="/safety/argus/files/ARGUS_P11_DELTA.json">P1.1 delta JSON</a> &middot; <a href="mailto:hello@automadynamics.com">hello@automadynamics.com</a></p>
  </footer>"""


def must_sub(pattern, repl, text, flags=re.S):
    new, n = re.subn(pattern, lambda _m: repl, text, count=1, flags=flags)
    if n != 1:
        sys.exit(f"sync-argus: pattern not found, source layout changed: {pattern[:60]!r}")
    return new


def main():
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    html = src.read_text(encoding="utf-8")

    # Guard: the P1.1 overlay embedded in the page must be the JSON published beside it.
    ptag = '<script id="argus-p11" type="application/json">'
    if ptag not in html:
        sys.exit("sync-argus: source has no embedded P1.1 overlay")
    pa = html.index(ptag) + len(ptag)
    if html[pa:html.index("</script>", pa)].encode("utf-8") != P11_PUBLISHED_JSON.read_bytes():
        sys.exit("sync-argus: embedded P1.1 overlay differs from public/safety/argus/files/ARGUS_P11_DELTA.json")

    # Guard: the graph embedded in the page must be the JSON published beside it.
    tag = '<script id="argus-data" type="application/json">'
    a = html.index(tag) + len(tag)
    embedded = html[a:html.index("</script>", a)]
    if PUBLISHED_JSON.exists() and embedded != PUBLISHED_JSON.read_text(encoding="utf-8"):
        sys.exit("sync-argus: embedded graph differs from public/safety/argus/files/ARGUS_P1_ASTRA_GRAPH.json")

    # The artifact carries its own <title> inside <body>. Drop it before the head
    # goes in; afterwards, the first match would be the head's own title.
    html = must_sub(r"<title>[^<]*</title>\n", "", html)

    # 1. Replace the artifact wrapper (light skeleton) with a real head.
    html = must_sub(r"\A<!doctype html>.*?<body>\s*", HEAD.replace("{src}", str(src)), html)

    # 2. Site palette and full-width layout, after the artifact stylesheet.
    html = must_sub(r"</style>\s*\n(?=\s*<div class=\"wrap\">)", "</style>\n" + SITE_CSS + "\n", html)

    pre = html  # before the header is collapsed; the case summary starts from here

    # 3. Lift the review terms out of the header before replacing it.
    m = re.search(r'\s*<div class="reviewterms".*?</div>\n', html, re.S)
    if not m:
        sys.exit("sync-argus: review terms block not found")
    terms = m.group(0).strip()
    html = html.replace(m.group(0), "\n", 1)

    # 4. Sparse header.
    html = must_sub(r"  <header>.*?</header>\n", BAR, html)

    # 5. Footer: terms first, the page is online now, and a way back.
    # The review invitation lived in the replaced header; it moves here.
    invite = '    <div class="invite" id="invite" hidden></div>\n'
    html = must_sub(r"  <footer>\n", "  <footer>\n" + invite + "    " + terms + "\n", html)
    html = html.replace("<strong>Offline review artifact:</strong>", "<strong>Review artifact:</strong>", 1)
    html = must_sub(r"\n  </footer>", "\n" + FOOTER_TAIL, html)

    # 6. Executive view: a Fit control beside its toolbar note, and pan/zoom.
    if html.count(EXEC_NOTE) != 1:
        sys.exit("sync-argus: executive toolbar note not found, source layout changed")
    html = html.replace(EXEC_NOTE, EXEC_NOTE + "\n          " + EXEC_CTL, 1)

    html = re.sub(r"\s*</body>\s*</html>\s*\Z", "", html)
    html = html.rstrip() + "\n" + EXEC_ZOOM + "\n</body>\n</html>\n"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8", newline="\n")
    digest = hashlib.sha256(embedded.encode("utf-8")).hexdigest()
    nodes = len(json.loads(embedded)["nodes"])
    print(f"wrote {OUT.relative_to(ROOT)}  ({nodes} nodes, embedded JSON sha256 {digest[:12]}...)")

    # Case summary: the viewer's original one-page layout. The same sparse bar, then
    # the header the viewer was built with (title, root claim, conclusion, counts,
    # review conditions) with the live graph and record panel directly beneath.
    s = pre
    m = re.search(r"  <header>\n.*?  </header>\n", s, re.S)
    eb = m and re.search(r"    <div class=\"eyebrow\">.*?\n    </div>\n", m.group(0), re.S)
    if not m or not eb:
        sys.exit("sync-argus: summary header or eyebrow not found")
    card = m.group(0).replace("  <header>\n", '  <header class="casehead">\n', 1).replace(eb.group(0), "", 1)
    sbar = BAR
    for old, new in [
        ('<span class="name">ARGUS <span>Proof-1</span></span>',
         '<span class="name">ARGUS <span>Proof-1 &middot; Case summary</span></span>'),
        ('<a href="/safety/argus/proof-1/summary#exec">Case summary</a>', '<a href="/safety/argus/proof-1#exec">Full-screen graph</a>'),
        # The header below carries c1text, conclusion and counts; only #review stays hidden here.
        ('<div hidden><span id="review"></span><p id="c1text"></p><p id="conclusion"></p><div id="counts"></div></div>',
         '<div hidden><span id="review"></span></div>'),
    ]:
        if sbar.count(old) != 1:
            sys.exit(f"sync-argus: summary bar anchor not found: {old[:50]!r}")
        sbar = sbar.replace(old, new)
    s = s.replace(m.group(0), sbar + card, 1)
    s = s.replace("<strong>Offline review artifact:</strong>", "<strong>Review artifact:</strong>", 1)
    s = must_sub(r"\n  </footer>", "\n" + FOOTER_TAIL, s)
    if s.count(EXEC_NOTE) != 1:
        sys.exit("sync-argus: summary executive toolbar note not found")
    s = s.replace(EXEC_NOTE, EXEC_NOTE + "\n          " + EXEC_CTL, 1)
    s = re.sub(r"\s*</body>\s*</html>\s*\Z", "", s)
    s = s.rstrip() + "\n" + EXEC_ZOOM + "\n</body>\n</html>\n"
    for old, new, n in [
        (f"<title>{TITLE} | Automa Dynamics</title>", f"<title>{SUM_TITLE} | Automa Dynamics</title>", 1),
        (f'content="{TITLE}"', f'content="{SUM_TITLE}"', 2),
        (f'content="{DESCRIPTION}"', f'content="{SUM_DESCRIPTION}"', 3),
        (f'"{URL}"', f'"{SUM_URL}"', 2),
    ]:
        if s.count(old) != n:
            sys.exit(f"sync-argus: summary head anchor found {s.count(old)}x, expected {n}: {old[:50]!r}")
        s = s.replace(old, new)
    b = s.index(tag) + len(tag)
    if s[b:s.index("</script>", b)] != embedded:
        sys.exit("sync-argus: embedded graph changed in summary")
    SUM_OUT.parent.mkdir(parents=True, exist_ok=True)
    SUM_OUT.write_text(s, encoding="utf-8", newline="\n")
    print(f"wrote {SUM_OUT.relative_to(ROOT)}  (same embedded JSON)")


if __name__ == "__main__":
    main()
