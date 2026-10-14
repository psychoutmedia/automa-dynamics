"""Build ARGUS Proof-4 (Muse Wonder Full) for the site.

    python scripts/sync-argus-p4.py

Reads the filed Proof-4 research in H:\\projectargus\\proof4 (never written) and
produces three things:

- public/safety/argus/files/ARGUS_P4_ASSURANCE_GRAPH.json: the graph, byte for
  byte. The build stops if its SHA-256 is not the filed digest, or if its
  inventory is not the filed 54 nodes, 67 edges, 25 evidence units and seven gaps.
- lib/argusP4.data.json: register text for the findings page
  (app/safety/argus/muse-wonder-full), lifted verbatim from the source, evidence
  and gap registers and the executive checklist, so no wording is retyped.
  Every register is hash-guarded. The headline figures the page prints are
  checked against the graph's own evidence statements before they are written.
- public/safety/argus/muse-wonder-full/explore/index.html: the Executive and
  Full assurance graphs. The viewer source is scripts/argus-p4/ on top of the
  series stylesheet, copied at build time from the Astra Proof-1 REVIEW page as
  the Proof-2 and Proof-3 builds do (hash-guarded, never forked). The Executive
  pan/zoom/Fit and the publication layer are imported from the earlier scripts.

Register links that point at retained source copies (sources/P4-SRC-...) are
rewritten to the publisher's public URL, keeping the PDF page. Retained archives,
acquisition records and QA material are never linked or copied. Links to
unpublished register files become plain text.

No web fonts or third-party requests are added to the explorer: its footer
promises none. The three launch charts are not embedded; their values are
transcribed from the graph and each links to the publisher's original image.
"""

import sys
sys.dont_write_bytecode = True  # the P1/P2 sync scripts are imported; leave no __pycache__ behind
import hashlib
import html
import importlib.util
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
ARGUS = pathlib.Path(r"H:\projectargus")
P4 = ARGUS / "proof4"
SRC = ROOT / "scripts" / "argus-p4"

GRAPH = P4 / "ARGUS_P4_ASSURANCE_GRAPH.json"
GRAPH_SHA = "47e5d31e3ace171cea058b103ebef1f589258bcce9cef6ab37e427392ce823ba"
REGISTERS = {
    "evidence": ("ARGUS_P4_EVIDENCE_REGISTER.md", "cdeed4d10cd99f80459c5087ac8be01d7ba0d1d11e6ef647018a89d769842cfa"),
    "gaps": ("ARGUS_P4_GAP_REGISTER.md", "7229a1f8e3b66198d4baa4d0dfc74706784342e25be34c4cfeae9906de33814a"),
    "sources": ("ARGUS_P4_SOURCE_REGISTER.md", "c37e8f187f599f1a83a199011838ac427292248d23f09d59ba9b57ce47086f35"),
    "checklist": ("ARGUS_P4_EXECUTIVE_CHECKLIST.md", "3c44cd53d4772afb279f7b33cd12222afa2a6f01627f9be23e4f95f132c06732"),
}
# Filed inventory (completion report). A different graph stops the build.
INVENTORY = {"nodes": 54, "edges": 67, "EVIDENCE": 25, "GAP": 7, "CLAIM": 1, "ARGUMENT": 7,
             "DEPENDENCY": 8, "ASSUMPTION": 6, "sources": 9}
RELS = ["reports", "supports", "qualifies", "defines_scope", "contextualizes", "conditions", "assumed_by", "limits"]

# Series stylesheet (owner decision, 11 October 2026) and the shared tokens, read-only.
ASTRA = ARGUS / "Graphs" / "ARGUS Proof-1 Assurance Graph_REVIEW.html"
ASTRA_SHA = "3928738f44ba4dbaee0b42c3e815d98003171452198f34c8c13450779b54b930"
TOKENS = ARGUS / "visuals" / "proof2_prototype" / "_build" / "tokens.css"
TOKENS_SHA = "62e3d2d528ab7c2e6b41f3e9a8a24bd07cdc2278a37d60157c6ae1730d2bfe3e"

OUT = ROOT / "public" / "safety" / "argus" / "muse-wonder-full" / "explore" / "index.html"
PUBLISHED_JSON = ROOT / "public" / "safety" / "argus" / "files" / "ARGUS_P4_ASSURANCE_GRAPH.json"
DATA_OUT = ROOT / "lib" / "argusP4.data.json"

BASE = "https://www.automadynamics.com"
FINDINGS = "/safety/argus/muse-wonder-full"
ROUTE = FINDINGS + "/explore"
TITLE = "ARGUS Proof-4 Assurance Graph: Muse Wonder Full"
DESCRIPTION = (
    "Interactive Claims-Arguments-Evidence graph reconstructing the public cybersecurity assurance "
    "record for Meta's Muse Wonder Full: 54 nodes, 67 warranted relationships of eight types and seven "
    "open public-assurance gaps. Independent research by Automa Dynamics; not affiliated with Meta."
)
OG_IMAGE = f"{BASE}{FINDINGS}/executive-graph.png"

# Public destinations for the nine retained sources, re-checked on 14 October 2026
# (presentation QA): every URL answered HTTP 200 at the same final URL. Notes say
# what a reader gets today and how it relates to the ARGUS capture.
SAME = "Byte-identical to the ARGUS capture of 14 October 2026 when re-checked the same day."
TRACE = ("Re-checked the same day: the visible text is identical to the ARGUS capture; the bytes differ "
         "only in per-request page-tracing tokens.")
CHART = (SAME + " A component of the launch research post, not an independent study. ARGUS transcribes "
         "only the two Muse Wonder bars; the other bars are left in the original and no ranking is made.")
PUBLIC = {
    "P4-SRC-001": {"pdf": True, "pages": 13, "note": "Current publisher PDF. " + SAME},
    "P4-SRC-002": {"pdf": True, "pages": 51, "note": "Current publisher PDF. " + SAME},
    "P4-SRC-003": {"pdf": False, "note": "Current publisher page. " + TRACE},
    "P4-SRC-004": {"pdf": False, "note": "Current publisher page. " + SAME + " The page records a 13 October modification."},
    "P4-SRC-005": {"pdf": False, "note": "Current publisher page. " + TRACE},
    "P4-SRC-006": {"pdf": False, "note": "Dynamic publisher index. " + TRACE + " An index cannot prove that a report is absent elsewhere."},
    "P4-SRC-007": {"pdf": False, "chart": True, "note": CHART},
    "P4-SRC-008": {"pdf": False, "chart": True, "note": CHART},
    "P4-SRC-009": {"pdf": False, "chart": True, "note": CHART},
}

# The figures the findings page prints, each tied to the evidence node whose statement
# must contain it. Launch-chart and model-card figures are kept in separate groups.
FIGURES = {
    "card_capability": [
        ("P4-E-003", "CyberGym", "88.4%"),
        ("P4-E-004", "ExploitBench", "58.9%"),
    ],
    "exploitgym": {"node": "P4-E-005", "total": 92, "intended": 21, "unintended": 71},
    "card_asr": [
        ("P4-E-006", "CyberBench", "0.8%", "0.8%"),
        ("P4-E-007", "PolyGuard, cyber subset", "1.1%", "2.3%"),
        ("P4-E-008", "RedCode", "9.0%", "8.0%"),
    ],
    "charts": [
        ("P4-E-023", "P4-SRC-007", "Cyber Misuse Refusal Benchmark", "refusal rate", "higher", "96.9%", "93.7%"),
        ("P4-E-024", "P4-SRC-008", "Cyber Defense Compliance Benchmark", "compliance rate", "higher", "93.3%", "94.5%"),
        ("P4-E-025", "P4-SRC-009", "Executing Unauthorized Code", "attack success rate", "lower", "10.7%", "10.5%"),
    ],
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
    sys.exit("sync-argus-p4: " + msg)


def guarded(path, sha, what):
    raw = path.read_bytes()
    got = hashlib.sha256(raw).hexdigest()
    if got != sha:
        stop(f"{what} sha256 {got} differs from the reviewed {sha}; review what changed before rebuilding")
    return raw


# ------------------------------------------------------------------ graph
graph_raw = guarded(GRAPH, GRAPH_SHA, "graph")
G = json.loads(graph_raw.decode("utf-8"))
NODE = {n["id"]: n for n in G["nodes"]}
kinds = {}
for n in G["nodes"]:
    kinds[n["kind"]] = kinds.get(n["kind"], 0) + 1
got_inv = {"nodes": len(G["nodes"]), "edges": len(G["edges"]), "sources": len(G["sources"]), **kinds}
for k, v in INVENTORY.items():
    if got_inv.get(k) != v:
        stop(f"inventory {k} = {got_inv.get(k)}, filed {v}")
if G["root_id"] != "P4-C-001" or sum(1 for n in G["nodes"] if n.get("primary_root")) != 1:
    stop("the graph must have exactly one root, P4-C-001")
if sorted(G["edge_semantics"]) != sorted(RELS):
    stop(f"edge semantics are {sorted(G['edge_semantics'])}, expected the eight Proof-4 types")
for e in G["edges"]:
    if e["relationship"] not in RELS or e["from_node"] not in NODE or e["to_node"] not in NODE:
        stop(f"edge {e['id']} has an unknown type or endpoint")
    if not e.get("warrant"):
        stop(f"edge {e['id']} has no warrant")
if len({(e["from_node"], e["to_node"], e["relationship"]) for e in G["edges"]}) != len(G["edges"]):
    stop("duplicate relationship")

URL = {s["id"]: s["final_url"] for s in G["sources"]}
for sid in URL:
    if sid not in PUBLIC:
        stop(f"no public destination recorded for {sid}")
    PUBLIC[sid]["url"] = URL[sid]
    if PUBLIC[sid]["pdf"] and next(s for s in G["sources"] if s["id"] == sid).get("pages") != PUBLIC[sid]["pages"]:
        stop(f"{sid}: page count differs from the graph")

# Figures: every printed value must appear in its own evidence statement.
def need(node, *parts):
    st = NODE[node]["statement"]
    for p in parts:
        if p not in st:
            stop(f"{node} statement does not contain {p!r}")

for node, name, v in FIGURES["card_capability"]:
    need(node, name, v)
eg = FIGURES["exploitgym"]
need(eg["node"], f"{eg['total']} flags", f"{eg['intended']} via intended", f"{eg['unintended']} via unintended")
if eg["intended"] + eg["unintended"] != eg["total"]:
    stop("ExploitGym split does not add up")
for node, name, s1, s2 in FIGURES["card_asr"]:
    need(node, f"single turn {s1}", f"multi turn {s2}")
for node, sid, name, metric, better, full, wonder in FIGURES["charts"]:
    need(node, name, f"Wonder Full (max) {full}", f"smaller Wonder (max) {wonder}")
    if not any(r["source_id"] == sid for r in NODE[node]["source_refs"]):
        stop(f"{node} does not cite {sid}")

# ------------------------------------------------------------------ markdown
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
    m = re.match(r"sources/(P4-SRC-\d{3})_[^#]+(#page=(\d+))?$", target)
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
    return None  # retained records, unpublished register files, relative links


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


def field(body, label, nxt=None, where=""):
    """Text after **label:** up to the next **...:** label (or end of paragraph)."""
    m = re.search(rf"\*\*{re.escape(label)}:\*\*\s*(.+?)(?=\s\*\*[A-Z][^*]{{0,60}}:\*\*|\n\n|\Z)", body, re.S)
    if not m:
        stop(f"{where}: field {label!r} missing")
    return m.group(1).strip()


def ids_in(text, prefix="E"):
    """P4-E-002, E-023–025 -> full ids, in order, de-duplicated."""
    found = []
    for m in re.finditer(rf"(?:P4-)?{prefix}-(\d{{3}})(?:[–-](\d{{3}}))?", text):
        a = int(m.group(1)); b = int(m.group(2)) if m.group(2) else a
        for k in range(a, b + 1):
            x = f"P4-{prefix}-{k:03d}"
            if x not in found:
                found.append(x)
    return found


reg = {k: guarded(P4 / f, sha, f).decode("utf-8").replace("\r\n", "\n") for k, (f, sha) in REGISTERS.items()}

# ------------------------------------------------------------------ evidence register
evidence = {}
for block in re.split(r"\n(?=#{2,3} P4-E-\d{3} — )", reg["evidence"])[1:]:
    head, _, body = block.partition("\n")
    m = re.match(r"#{2,3} (P4-E-\d{3}) — (.+)$", head)
    eid, title = m.groups()
    body = re.split(r"\n#{2,3} ", body, maxsplit=1)[0].strip()
    rec = {"heading": title, "source": md(field(body, "Source", where=eid)),
           "finding": md(field(body, "Reported finding", where=eid))}
    setup = re.search(r"\*\*Model ?/ ?setup:\*\*", body)
    rec["setup"] = md(field(body, setup.group(0)[2:-3], where=eid)) if setup else ""
    rec["bearing"] = field(body, "Bearing", where=eid).rstrip(".") if "**Bearing:**" in body else NODE[eid].get("bearing", "")
    if rec["bearing"] != NODE[eid].get("bearing"):
        stop(f"{eid}: register bearing {rec['bearing']!r} differs from the graph's {NODE[eid].get('bearing')!r}")
    rec["limit"] = md(field(body, "Limit", where=eid))
    rec["chart"] = any(PUBLIC[r["source_id"]].get("chart") for r in NODE[eid]["source_refs"])
    evidence[eid] = rec
ev_ids = sorted(n["id"] for n in G["nodes"] if n["kind"] == "EVIDENCE")
if sorted(evidence) != ev_ids:
    stop("evidence register entries do not match the graph's 25 evidence nodes")
ev_intro = md(reg["evidence"].split("\n\n")[1])
discipline = [md(p) for p in reg["evidence"].split("## Numerical and method discipline", 1)[1].split("\n## ", 1)[0].strip().split("\n\n")]
charts_intro = md(reg["evidence"].split("## Launch-chart evidence: distinct setups", 1)[1].strip().split("\n\n")[0])

# ------------------------------------------------------------------ gap register
gaps = {}
for block in re.split(r"\n(?=## P4-G-)", reg["gaps"])[1:]:
    head, _, body = block.partition("\n")
    m = re.match(r"## (P4-G-\d{3}) — (.+)$", head)
    if not m:
        stop(f"gap heading not recognised: {head!r}")
    gid, title = m.groups()
    body = body.split("\n## ", 1)[0]
    if title != NODE[gid]["title"]:
        stop(f"{gid}: register heading differs from the graph title")
    links = field(body, "Graph links", where=gid).rstrip(".")
    targets = [x.strip() for x in links.split(",")]
    if sorted(targets) != sorted(NODE[gid]["targets"]):
        stop(f"{gid}: register graph links differ from the graph targets")
    ev = field(body, "Evidence", where=gid)
    ev_list = [x for x in ids_in(ev.split(";", 1)[0]) if x in NODE]
    if ev_list != NODE[gid]["evidence_ids"]:
        stop(f"{gid}: register evidence list differs from the graph")
    gaps[gid] = {
        "heading": title,
        "status": field(body, "Status", where=gid).rstrip("."),
        "targets": targets,
        "evidence_ids": ev_list,
        "observed": md(field(body, "Observed public evidence", where=gid)),
        "missing": md(field(body, "Missing inference / evidence", where=gid)),
        "closure": md(field(body, "Evidence that would narrow or close the gap", where=gid)),
        "alternative": md(field(body, "Alternative interpretation", where=gid)),
        "reason": md(field(body, "Reason unavailable", where=gid)),
    }
gap_ids = sorted(n["id"] for n in G["nodes"] if n["kind"] == "GAP")
if sorted(gaps) != gap_ids or any(gaps[g]["status"] != "OPEN_PUBLIC_ASSURANCE_GAP" for g in gaps):
    stop("gap register sections do not match the graph's seven open gaps")
gap_intro = md(reg["gaps"].split("\n\n")[1])
gap_grouping = [md(p) for p in reg["gaps"].split("## Grouping choices and limits", 1)[1].strip().split("\n\n")]

# ------------------------------------------------------------------ source register
sources = {}
for block in re.split(r"\n(?=## P4-SRC-)", reg["sources"])[1:]:
    head, _, body = block.partition("\n")
    m = re.match(r"## (P4-SRC-\d{3}) — (.+)$", head)
    sid, title = m.groups()
    body = body.split("\n## ", 1)[0]
    gs = next(s for s in G["sources"] if s["id"] == sid)
    if title != gs["title"]:
        stop(f"{sid}: register title differs from the graph's {gs['title']!r}")
    bullets = {}
    for line in body.splitlines():
        for mm in re.finditer(r"\*\*([^*]+?):\*\*\s*(.+?)(?=\s?\*\*[^*]+?:\*\*|$)", line.lstrip("- ")):
            bullets[mm.group(1)] = mm.group(2).strip().rstrip(";").strip()
    if URL[sid] not in body:
        stop(f"{sid}: register does not state the graph URL")
    if gs["sha256"] not in body:
        stop(f"{sid}: register does not state the graph hash")
    chart = bool(PUBLIC[sid].get("chart"))
    sources[sid] = {
        "title": gs["title"], "url": URL[sid], "pdf": PUBLIC[sid]["pdf"], "pages": PUBLIC[sid].get("pages"),
        "chart": chart, "note": PUBLIC[sid]["note"], "sha256": gs["sha256"], "bytes": gs["bytes"],
        "content_type": gs["content_type"],
        "date": md(bullets["Publication" if chart else "Publication / release field"]),
        "revision": md(bullets["Revision"]),
        "retrieval": md(bullets["Retrieved UTC"]),
        "use": md(bullets["Use"]) if "Use" in bullets else md(bullets["Publisher / parent"]),
        "qualification": md(bullets["Limit" if chart else "Limitation"]),
    }
if sorted(sources) != sorted(URL):
    stop("source register sections do not match the graph's nine sources")
src_intro = md(reg["sources"].split("\n\n")[1])
report_status = [md(p) for p in reg["sources"].split("## Separate full safety report — checked first", 1)[1].split("\n## ", 1)[0].strip().split("\n\n")]
authentication = [md(p) for p in reg["sources"].split("## Authentication, revisions and reading record", 1)[1].split("\n## ", 1)[0].strip().split("\n\n")]

# ------------------------------------------------------------------ executive checklist
rows = []
for line in reg["checklist"].splitlines():
    if line.startswith("| ") and not line.startswith("| Review question"):
        c = [x.strip() for x in line.strip().strip("|").split(" | ")]
        if len(c) != 4:
            stop(f"checklist row has {len(c)} cells: {line[:60]}")
        g = re.match(r"(G-\d{3}):", c[3])
        if not g:
            stop(f"checklist row gap reference not found: {c[3][:40]}")
        rows.append({
            "n": len(rows) + 1, "question": md(c[0]), "evidence": md(c[1]),
            "evidence_ids": [x for x in ids_in(c[1]) if x in NODE],
            "status": md(c[2]), "gap": md(c[3]), "gaps": ["P4-" + g.group(1)],
        })
if len(rows) != 7 or sorted(r["gaps"][0] for r in rows) != gap_ids:
    stop("expected seven checklist rows, one per gap")
one_root = md(reg["checklist"].split("**One root:** ", 1)[1].split("\n", 1)[0])
check_report = md(reg["checklist"].split("**Report status:** ", 1)[1].split("\n", 1)[0])
check_close = md("All seven rows" + reg["checklist"].split("All seven rows", 1)[1].split("\n", 1)[0])

data = {
    "_generated": "scripts/sync-argus-p4.py - do not edit",
    "graph_sha256": GRAPH_SHA,
    "register_sha256": {k: sha for k, (f, sha) in REGISTERS.items()},
    "inventory": got_inv,
    "figures": FIGURES,
    "one_root": one_root,
    "report_check": check_report,
    "checklist_close": check_close,
    "evidence_intro": ev_intro,
    "discipline": discipline,
    "charts_intro": charts_intro,
    "gap_intro": gap_intro,
    "gap_grouping": gap_grouping,
    "source_intro": src_intro,
    "report_status": report_status,
    "authentication": authentication,
    "sources": sources,
    "evidence": evidence,
    "gaps": gaps,
    "checklist": rows,
}
data_json = json.dumps(data, ensure_ascii=False, indent=1)
if re.search(r'href="(?!https://)', data_json) or "sources/" in "".join(links_out):
    stop("a non-public link survived the register conversion")
for banned in ("sources/P4-SRC", ".json</a>", ".webp</a>"):
    if banned in data_json:
        stop(f"unexpected text in the register data: {banned!r}")
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
if json.loads(regs_txt) != json.loads(data_json):
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

tag = '<script id="argus-p4" type="application/json">'
a = page.index(tag) + len(tag)
if hashlib.sha256(page[a:page.index("</script>", a)].encode("utf-8")).hexdigest() != GRAPH_SHA:
    stop("embedded graph is not byte-identical")
if PUBLISHED_JSON.read_bytes() != page[a:page.index("</script>", a)].encode("utf-8"):
    stop("embedded graph differs from the published JSON")
for banned in ("sources/P4-SRC", "noindex", "@@"):
    if banned in page.replace(graph_txt, "").replace(regs_txt, ""):
        stop(f"unexpected text in the built page: {banned!r}")
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(page, encoding="utf-8", newline="\n")
print(f"wrote {OUT.relative_to(ROOT)} ({len(page.encode('utf-8')):,} bytes; {len(G['nodes'])} nodes, "
      f"{len(G['edges'])} edges; embedded sha256 {GRAPH_SHA[:16]}... identical)")
