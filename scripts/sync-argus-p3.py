"""Build ARGUS Proof-3 (Gemini 4 Argon) for the site.

    python scripts/sync-argus-p3.py

Reads the filed Proof-3 research in H:\\projectargus\\proof3 (never written) and
produces three things:

- public/safety/argus/files/ARGUS_P3_ASSURANCE_GRAPH.json: the graph, byte for
  byte. The build stops if its SHA-256 is not the filed digest.
- lib/argusP3.data.json: register text for the findings page
  (app/safety/argus/gemini-4-argon), lifted verbatim from the source, evidence
  and gap registers and the executive checklist, so no wording is retyped.
  Each register is also hash-guarded: a changed register stops the build
  until someone reviews what the page will now say.
- public/safety/argus/gemini-4-argon/explore/index.html: the Executive and
  Full assurance graphs. The viewer source is scripts/argus-p3/ on top of the
  series stylesheet, which is copied at build time from the Astra Proof-1
  REVIEW page exactly as the Proof-2 build does (hash-guarded, never forked).
  The Executive pan/zoom/Fit is imported verbatim from scripts/sync-argus.py,
  so the three graph pages cannot drift apart.

Register links that point at the retained source copies (sources/P3-SRC-...)
are rewritten to the publisher's public URL, keeping the PDF page. Retained
archives are never linked or copied. Links to unpublished register files
become plain text.

No web fonts or third-party requests are added to the explorer: its footer
promises none.
"""

import sys
sys.dont_write_bytecode = True  # the P1/P2 sync scripts are imported; leave no __pycache__ behind
import hashlib
import html
import importlib.util
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ARGUS = pathlib.Path(r"H:\projectargus")
P3 = ARGUS / "proof3"
SRC = ROOT / "scripts" / "argus-p3"

GRAPH = P3 / "ARGUS_P3_ASSURANCE_GRAPH.json"
GRAPH_SHA = "7daea553666caed2ed498a5795f06252d31ddde03f5b223a053a799653068469"
REGISTERS = {
    "evidence": ("ARGUS_P3_EVIDENCE_REGISTER.md", "0884510447a6122634380f7c33bcfcf3507292182946c834141cf5174ee93bb7"),  # P3-E-021 citation split, 14 Oct
    "gaps": ("ARGUS_P3_GAP_REGISTER.md", "91facfecab1c197c6c3ca37280e22d5f02e9da1874188285c8d3b52d8e994bb7"),
    "sources": ("ARGUS_P3_SOURCE_REGISTER.md", "ea58ec7a99c69148cefe0b7d7784c436a19b60dfa57250cbcf32e3237d3d4cf7"),
    "checklist": ("ARGUS_P3_EXECUTIVE_CHECKLIST.md", "d1e89ecb74ee0ece3754351db38b1ec79388162b3f7d4d73d1403f4984dc09f6"),
}
# Series stylesheet (owner decision, 11 October 2026) and the shared tokens, read-only.
ASTRA = ARGUS / "Graphs" / "ARGUS Proof-1 Assurance Graph_REVIEW.html"
ASTRA_SHA = "3928738f44ba4dbaee0b42c3e815d98003171452198f34c8c13450779b54b930"
TOKENS = ARGUS / "visuals" / "proof2_prototype" / "_build" / "tokens.css"
TOKENS_SHA = "62e3d2d528ab7c2e6b41f3e9a8a24bd07cdc2278a37d60157c6ae1730d2bfe3e"

OUT = ROOT / "public" / "safety" / "argus" / "gemini-4-argon" / "explore" / "index.html"
PUBLISHED_JSON = ROOT / "public" / "safety" / "argus" / "files" / "ARGUS_P3_ASSURANCE_GRAPH.json"
DATA_OUT = ROOT / "lib" / "argusP3.data.json"

BASE = "https://www.automadynamics.com"
FINDINGS = "/safety/argus/gemini-4-argon"
ROUTE = FINDINGS + "/explore"
TITLE = "ARGUS Proof-3 Assurance Graph: Gemini 4 Argon"
DESCRIPTION = (
    "Interactive Claims-Arguments-Evidence graph reconstructing the public cyberoffensive assurance "
    "record for Google DeepMind's Gemini 4 Argon: 53 nodes, 69 warranted relationships and seven open "
    "public-assurance gaps. Independent research by Automa Dynamics; not affiliated with Google."
)
OG_IMAGE = f"{BASE}{FINDINGS}/executive-graph.png"

# Public destinations for the six retained sources, checked on 14 October 2026
# (presentation QA). The URL is the source register's own public URL. Notes say
# what a reader gets today and how it relates to the ARGUS capture.
SAME = "Byte-identical to the ARGUS capture of 14 October 2026 when re-checked the same day."
PUBLIC = {
    "P3-SRC-001": {
        "pdf": True, "pages": 14,
        "note": "Current publisher PDF. " + SAME + " The card says it may be updated.",
    },
    "P3-SRC-002": {
        "pdf": True, "pages": 217,
        "note": (
            # ARGUS_P3_SOURCE_VERSION_ADDENDUM.md (pre-publication reconciliation, 14 October 2026)
            "Current publisher PDF, a later revision (R2). Google replaced this file at 10:04 GMT on "
            "14 October 2026, about 20 minutes after the ARGUS capture at 09:44 GMT. ARGUS keeps its "
            "captured file (SHA-256 1451f641…) as the source of record and has recorded R2 "
            "(SHA-256 446c83a9…) separately. Both have 217 pages and identical charts. On the pages "
            "this case cites, six passages changed in grammar or layout only, and one figure changed: "
            "on p.157, evaluation awareness tied to automated grading reads 35% of flagged unprompted "
            "runs in the capture and 37.8% of unprompted runs in R2. This case cites neither value. No "
            "ARGUS finding, figure or page reference is affected."
        ),
    },
    "P3-SRC-003": {"pdf": True, "pages": 20, "note": "Current publisher PDF. " + SAME},
    "P3-SRC-004": {"pdf": False, "note": "Current publisher page. " + SAME},
    "P3-SRC-005": {
        "pdf": False,
        "note": "Current publisher page. " + SAME + " The page itself was modified on 1 October 2026.",
    },
    "P3-SRC-006": {"pdf": False, "note": "Current publisher page. " + SAME},
}

def _load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT / "scripts" / file)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


# Series parity: Proof-1's Executive pan/zoom/Fit, and Proof-2's publication layer
# (sticky site bar, dark ground, full-viewport graph), both imported verbatim.
_p1 = _load("sync_argus_p1", "sync-argus.py")
_p2 = _load("sync_argus_p2", "sync-argus-p2.py")


def stop(msg):
    sys.exit("sync-argus-p3: " + msg)


def guarded(path, sha, what):
    raw = path.read_bytes()
    got = hashlib.sha256(raw).hexdigest()
    if got != sha:
        stop(f"{what} sha256 {got} differs from the reviewed {sha}; review what changed before rebuilding")
    return raw


# ------------------------------------------------------------------ markdown
graph_raw = guarded(GRAPH, GRAPH_SHA, "graph")
G = json.loads(graph_raw.decode("utf-8"))
URL = {s["id"]: s["url"] for s in G["sources"]}
for sid in URL:
    if sid not in PUBLIC:
        stop(f"no public destination recorded for {sid}")
    PUBLIC[sid]["url"] = URL[sid]

LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
TOKENS_RE = [
    ("link", LINK),
    ("code", re.compile(r"`([^`]+)`")),
    ("bold", re.compile(r"\*\*(.+?)\*\*")),
    ("ital", re.compile(r"(?<![\w*])\*(?!\s)([^*]+?)\*(?![\w*])")),
]
links_out = []


def href_for(target):
    """Public URL for a register link, or None when the target is not public."""
    m = re.match(r"sources/(P3-SRC-\d{3})_[^#]+(#page=(\d+))?$", target)
    if m:
        sid, page = m.group(1), m.group(3)
        pub = PUBLIC[sid]
        if page:
            if not pub["pdf"]:
                stop(f"page anchor on a non-PDF source: {target}")
            if not 1 <= int(page) <= pub["pages"]:
                stop(f"page {page} outside 1..{pub['pages']} for {sid}")
            return pub["url"] + "#page=" + page
        return pub["url"]
    if target.startswith("https://"):
        return target
    return None  # unpublished register file, relative link, etc.


def md(s):
    """Inline markdown to escaped HTML: links (rewritten), code, bold, italic."""
    out, i = [], 0
    while i < len(s):
        best = None
        for kind, rx in TOKENS_RE:
            m = rx.search(s, i)
            if m and (best is None or m.start() < best[1].start()):
                best = (kind, m)
        if not best:
            out.append(html.escape(s[i:], quote=False))
            break
        kind, m = best
        out.append(html.escape(s[i:m.start()], quote=False))
        if kind == "link":
            text, target = m.group(1), m.group(2)
            href = href_for(target)
            if href:
                links_out.append(href)
                out.append(f'<a href="{html.escape(href)}" target="_blank" rel="noopener noreferrer">{md(text)}</a>')
            else:
                out.append(md(text))
        elif kind == "code":
            out.append(f"<code>{html.escape(m.group(1), quote=False)}</code>")
        elif kind == "bold":
            out.append(f"<strong>{md(m.group(1))}</strong>")
        else:
            out.append(f"<em>{md(m.group(1))}</em>")
        i = m.end()
    return "".join(out)


def cells(line):
    parts = [c.strip() for c in line.strip().strip("|").split(" | ")]
    return parts


def ids_in(text, prefix="E"):
    """P3-E-002, E-004–008, E002–008, E024 -> full ids, in order, de-duplicated."""
    found = []
    for m in re.finditer(rf"(?:P3-)?{prefix}-?(\d{{3}})(?:[–-](\d{{3}}))?", text):
        a = int(m.group(1)); b = int(m.group(2)) if m.group(2) else a
        for k in range(a, b + 1):
            x = f"P3-{prefix}-{k:03d}"
            if x not in found:
                found.append(x)
    return found


reg = {k: guarded(P3 / f, sha, f).decode("utf-8") for k, (f, sha) in REGISTERS.items()}
node_ids = {n["id"] for n in G["nodes"]}

# ------------------------------------------------------------------ evidence register
evidence = {}
for line in reg["evidence"].splitlines():
    if line.startswith("| P3-E-"):
        c = cells(line)
        if len(c) != 4:
            stop(f"evidence row has {len(c)} cells: {line[:60]}")
        evidence[c[0]] = {"locator": md(c[1]), "finding": md(c[2]), "bearing": md(c[3])}
ev_ids = sorted(n["id"] for n in G["nodes"] if n["kind"] == "EVIDENCE")
if sorted(evidence) != ev_ids:
    stop("evidence register rows do not match the graph's 24 evidence nodes")
ev_intro = reg["evidence"].split("\n\n")[1]
ev_rules = reg["evidence"].split("## Reading and attribution rules", 1)[1].strip().split("\n\n")

# ------------------------------------------------------------------ gap register
gaps = {}
for block in re.split(r"\n(?=## P3-G-)", reg["gaps"])[1:]:
    head, _, body = block.partition("\n")
    m = re.match(r"## (P3-G-\d{3}) — (.+)$", head)
    if not m:
        stop(f"gap heading not recognised: {head!r}")
    gid, title = m.groups()
    body = body.split("\n## ", 1)[0]
    rec = {"heading": title}
    links = re.search(r"^\*\*Graph links:\*\* (.+)$", body, re.M)
    if not links:
        stop(f"{gid}: links line missing")
    rec["links"] = md(links.group(1))
    obs = links.group(1).split("**Observed evidence:**", 1)[1]
    rec["evidence_ids"] = [x for x in ids_in(obs.split("[", 1)[0]) if x in node_ids]
    for key, label in [("why", "Why it matters"), ("missing", "Missing public evidence"),
                       ("closure", "Evidence that would narrow or close it"),
                       ("alternative", "Alternative interpretation"), ("reason", "Reason missing")]:
        mm = re.search(rf"^- \*\*{re.escape(label)}:\*\* (.+)$", body, re.M)
        if not mm:
            stop(f"{gid}: bullet {label!r} missing")
        rec[key] = md(mm.group(1))
    gaps[gid] = rec
gap_ids = sorted(n["id"] for n in G["nodes"] if n["kind"] == "GAP")
if sorted(gaps) != gap_ids:
    stop("gap register sections do not match the graph's seven gaps")
gap_scope = md(reg["gaps"].split("\n\n")[1].replace("**Scope:** ", "", 1))
gap_grouping = md(reg["gaps"].split("## Grouping and closure discipline", 1)[1].strip())

# ------------------------------------------------------------------ source register
sources = {}
for line in reg["sources"].splitlines():
    if line.startswith("| P3-SRC-"):
        c = cells(line)
        if len(c) != 7:
            stop(f"source row has {len(c)} cells: {line[:60]}")
        sid = c[0]
        if c[2].split(" ", 1)[0] != URL[sid]:  # SRC-003 adds "(linked from ...)" after the URL
            stop(f"{sid}: register URL differs from the graph URL")
        title = next(s["title"] for s in G["sources"] if s["id"] == sid)
        sources[sid] = {
            "title": title, "publisher": md(c[1]), "date": md(c[3]), "retrieval": md(c[4]),
            "use": md(c[5]), "qualification": md(c[6]), "url": URL[sid],
            "pdf": PUBLIC[sid]["pdf"], "pages": PUBLIC[sid].get("pages"), "note": PUBLIC[sid]["note"],
            "sha256": next(s["sha256"] for s in G["sources"] if s["id"] == sid),
        }
if sorted(sources) != sorted(URL):
    stop("source register rows do not match the graph's sources")
src_intro = md(reg["sources"].split("\n\n")[1])
custody = md(reg["sources"].split("**Historical custody rule:** ", 1)[1].strip())

# ------------------------------------------------------------------ executive checklist
rows = []
for line in reg["checklist"].splitlines():
    if line.startswith("| ") and not line.startswith("| Question") and not line.startswith("|---"):
        c = cells(line)
        if len(c) != 6:
            stop(f"checklist row has {len(c)} cells: {line[:60]}")
        g = re.match(r"\*\*(G\d{3}(?:/G\d{3})*):\*\*", c[4])
        if not g:
            stop(f"checklist row gap reference not found: {c[4][:40]}")
        row_gaps = ["P3-" + x.replace("G", "G-") for x in g.group(1).split("/")]
        rows.append({
            "n": len(rows) + 1, "question": md(c[0]), "control": md(c[1]), "evidence": md(c[2]),
            "evidence_ids": [x for x in ids_in(c[2].split("[", 1)[0]) if x in node_ids],
            "status": md(c[3]), "gap": md(c[4]), "applicability": md(c[5]), "gaps": row_gaps,
        })
if len(rows) != 8:
    stop(f"expected 8 checklist rows, found {len(rows)}")
for gid in gap_ids:
    if not any(gid in r["gaps"] for r in rows):
        stop(f"{gid} has no checklist row")
reading = md(reg["checklist"].split("**Decision-useful reading:** ", 1)[1].strip())
boundary = md(reg["checklist"].split("**Boundary:** ", 1)[1].split("\n", 1)[0])

data = {
    "_generated": "scripts/sync-argus-p3.py - do not edit",
    "graph_sha256": GRAPH_SHA,
    "register_sha256": {k: sha for k, (f, sha) in REGISTERS.items()},
    "boundary": boundary,
    "reading": reading,
    "evidence_intro": md(ev_intro),
    "evidence_rules": [md(p) for p in ev_rules],
    "gap_scope": gap_scope,
    "gap_grouping": gap_grouping,
    "source_intro": src_intro,
    "custody_rule": custody,
    "sources": sources,
    "evidence": evidence,
    "gaps": gaps,
    "checklist": rows,
}
data_json = json.dumps(data, ensure_ascii=False, indent=1)
if re.search(r'href="(?!https://)', data_json) or "sources/P3-SRC" in "".join(links_out):
    stop("a non-public link survived the register conversion")
DATA_OUT.write_text(data_json + "\n", encoding="utf-8", newline="\n")
print(f"wrote {DATA_OUT.relative_to(ROOT)} ({len(evidence)} evidence, {len(gaps)} gaps, "
      f"{len(sources)} sources, {len(rows)} checklist rows; {len(links_out)} public links)")

# ------------------------------------------------------------------ published graph JSON
PUBLISHED_JSON.write_bytes(graph_raw)
print(f"wrote {PUBLISHED_JSON.relative_to(ROOT)} (byte-identical, sha256 {GRAPH_SHA[:16]}...)")

# ------------------------------------------------------------------ explorer
astra_html = guarded(ASTRA, ASTRA_SHA, "Astra REVIEW page").decode("utf-8")
_i = astra_html.index("<style>", 200) + len("<style>")
astra_css = astra_html[_i:astra_html.index("</style>", _i)]
tokens = guarded(TOKENS, TOKENS_SHA, "series tokens").decode("utf-8")

graph_txt = graph_raw.decode("utf-8")
# "<\/" is the same JSON string as "</", and cannot close the script element.
regs_txt = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
if json.loads(regs_txt) != data:
    stop("register data changed while escaping")
for label, txt in (("graph", graph_txt), ("registers", regs_txt)):
    if "</" in txt or "<!--" in txt:
        stop(f"{label} data would break its script element")

page = (SRC / "explorer.src.html").read_text(encoding="utf-8")
js = (SRC / "explorer.js").read_text(encoding="utf-8")
css = (SRC / "explorer.css").read_text(encoding="utf-8")
parts = {
    "@@TITLE@@": html.escape(TITLE), "@@DESCRIPTION@@": html.escape(DESCRIPTION),
    "@@CANONICAL@@": BASE + ROUTE, "@@OG_IMAGE@@": OG_IMAGE,
    "/*@@TOKENS@@*/": tokens, "/*@@ASTRA_CSS@@*/": astra_css, "/*@@CSS@@*/": css,
    "/*@@SITE_CSS@@*/": _p2.SITE_CSS,
    "@@EXEC_CTL@@": _p1.EXEC_CTL, "@@EXEC_ZOOM@@": _p1.EXEC_ZOOM,
    "/*@@JS@@*/": js, "@@REGISTERS@@": regs_txt, "@@DATA@@": graph_txt,
}
MULTI = ("@@TITLE@@", "@@DESCRIPTION@@", "@@CANONICAL@@", "@@OG_IMAGE@@")
for k, v in parts.items():
    n = page.count(k)
    if (n < 1) if k in MULTI else (n != 1):
        stop(f"placeholder {k} found {n}x")
    if k not in ("@@DATA@@", "@@REGISTERS@@", "@@EXEC_ZOOM@@") and "</script" in v.lower():
        stop(f"{k} content contains </script")
# data last, so nothing inside it is ever treated as a placeholder
for k, v in parts.items():
    if k not in ("@@DATA@@", "@@REGISTERS@@"):
        page = page.replace(k, v)
page = page.replace("@@REGISTERS@@", regs_txt, 1).replace("@@DATA@@", graph_txt, 1)

tag = '<script id="argus-p3" type="application/json">'
a = page.index(tag) + len(tag)
if hashlib.sha256(page[a:page.index("</script>", a)].encode("utf-8")).hexdigest() != GRAPH_SHA:
    stop("embedded graph is not byte-identical")
if PUBLISHED_JSON.read_bytes() != page[a:page.index("</script>", a)].encode("utf-8"):
    stop("embedded graph differs from the published JSON")
for banned in ("sources/P3-SRC", "noindex", "@@"):
    if banned in page.replace(graph_txt, "").replace(regs_txt, ""):
        stop(f"unexpected text in the built page: {banned!r}")
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(page, encoding="utf-8", newline="\n")
print(f"wrote {OUT.relative_to(ROOT)} ({len(page.encode('utf-8')):,} bytes; {len(G['nodes'])} nodes, "
      f"{len(G['edges'])} edges; embedded sha256 {GRAPH_SHA[:16]}... identical)")
