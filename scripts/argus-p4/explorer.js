(function () {
'use strict';
/* ARGUS Proof-4 explorer (Muse Wonder Full), built on the Astra Proof-1 viewer (series standard) as adapted for
   Proof-2 and Proof-3: same geometry, shapes, bands, panel, tabs and branch reader. Case content comes from the
   embedded #argus-p4 graph JSON (unmodified) and #argus-p4-registers (register text lifted verbatim by
   scripts/sync-argus-p4.py). Editorial items are confined to: EXEC (positions and short labels), THEME (branch
   button names), BEARING_READING (plain-English readings of the graph's bearing tokens) and FRAG (text fragments
   that scroll a publisher web page to the cited passage). */
const RAW = document.getElementById('argus-p4').textContent;
const D = JSON.parse(RAW);
const R = JSON.parse(document.getElementById('argus-p4-registers').textContent);
const EXPECTED_SHA = '47e5d31e3ace171cea058b103ebef1f589258bcce9cef6ab37e427392ce823ba';
const NODES = D.nodes, EDGES = D.edges, ROOT = D.root_id;
const N = new Map(NODES.map(n => [n.id, n]));
const OUT = new Map(), INC = new Map();
NODES.forEach(n => { OUT.set(n.id, []); INC.set(n.id, []); });
EDGES.forEach(e => { OUT.get(e.from_node).push(e); INC.get(e.to_node).push(e); });
const SVGNS = 'http://www.w3.org/2000/svg';
const CLASSES = ['CLAIM', 'ARGUMENT', 'EVIDENCE', 'DEPENDENCY', 'ASSUMPTION', 'GAP'];
const CLASS_NAME = { CLAIM: 'Claims', ARGUMENT: 'Arguments', EVIDENCE: 'Evidence', DEPENDENCY: 'Dependencies', ASSUMPTION: 'Assumptions', GAP: 'Gaps' };
const CLASS_ONE = { CLAIM: 'Claim', ARGUMENT: 'Argument', EVIDENCE: 'Evidence', DEPENDENCY: 'Dependency', ASSUMPTION: 'Assumption', GAP: 'Gap' };
const short = id => id.replace(/^P4-/, '');

/* The P4 relationship vocabulary: eight types, in the graph's own words, read in both directions. Direction is
   always the stored from_node -> to_node. "U assumed_by D" means dependency D relies on assumption U, so read
   from D it is "assumes U". "G limits A" means gap G impedes independent assessment of A. */
const RELS = ['reports', 'supports', 'qualifies', 'defines_scope', 'contextualizes', 'conditions', 'assumed_by', 'limits'];
const READ_OUT = { reports: 'reports to', supports: 'supports', qualifies: 'qualifies', defines_scope: 'defines the scope of', contextualizes: 'contextualizes', conditions: 'conditions', assumed_by: 'is assumed by', limits: 'limits' };
const READ_IN = { reports: 'reported by', supports: 'supported by', qualifies: 'qualified by', defines_scope: 'scope defined by', contextualizes: 'contextualized by', conditions: 'conditional on', assumed_by: 'assumes', limits: 'limited by' };
const RELNAME = { defines_scope: 'defines scope', assumed_by: 'assumed by' };
const relName = r => RELNAME[r] || r;
const relEnds = r => [...new Set(EDGES.filter(e => e.relationship === r).map(e => CLASS_ONE[N.get(e.from_node).kind] + ' → ' + CLASS_ONE[N.get(e.to_node).kind]))].join(', ');

/* Data origin, read from each node's own source_refs. Launch-chart evidence (P4-SRC-007/008/009) is never
   presented as model-card data: it carries a dashed ring, its own flag and its own highlight. */
const CHART_SRC = new Set(['P4-SRC-007', 'P4-SRC-008', 'P4-SRC-009']);
/* Chart source titles in the graph end ' — launch chart'; the viewer shows that as its own label. */
const srcTitle = S => S.chart ? S.title.replace(/ — launch chart$/, '') : S.title;
const srcIds = n => (n.source_refs || []).map(s => s.source_id);
const isChart = n => srcIds(n).some(s => CHART_SRC.has(s));
const isCard = n => !isChart(n) && srcIds(n)[0] === 'P4-SRC-001' && n.kind === 'EVIDENCE';
const isFw = n => !isChart(n) && srcIds(n)[0] === 'P4-SRC-002';
const isLaunch = n => !isChart(n) && ['P4-SRC-003', 'P4-SRC-004', 'P4-SRC-005', 'P4-SRC-006'].includes(srcIds(n)[0]);
function origin(n) {
  if (n.kind !== 'EVIDENCE') return null;
  if (isChart(n)) return ['chart', 'Launch chart · Full and smaller Wonder at max reasoning effort'];
  if (n.interpretation_label === 'ARGUS_ACQUISITION_OBSERVATION') return ['obs', 'ARGUS acquisition observation'];
  if (isCard(n)) return ['card', 'Model card · Wonder Full'];
  if (isFw(n)) return ['fw', 'Scaling Framework v2.1 · general policy, not Wonder-specific'];
  if (isLaunch(n)) return ['launch', 'Launch publications'];
  return null;
}
const isMixed = n => n.bearing === 'MIXED';
const BEARING_READING = {
  PUBLISHER_ASSESSMENT: 'Publisher assessment', SCOPE: 'Scope or applicability', CAPABILITY: 'Capability measurement',
  MIXED: 'Mixed: favourable and adverse together', SUPPORT: 'Publisher-reported support', BOUNDED_SUPPORT: 'Bounded support',
  QUALIFIER: 'Qualifier', DEFINITION: 'Framework definition', WARRANT: 'Framework warrant (general policy)',
  AVAILABILITY: 'Public availability observation', CONTEXT: 'Context', PROVENANCE: 'Provenance and custody'
};
const LABEL_READING = { VERBATIM_PUBLISHER: 'Verbatim publisher text', PUBLISHER_REPORT_WITH_ARGUS_SCOPE: 'Publisher-reported, ARGUS-scoped', PUBLISHER_CHART_TRANSCRIPTION_WITH_ARGUS_SCOPE: 'Publisher chart, transcribed by ARGUS', ARGUS_ACQUISITION_OBSERVATION: 'ARGUS acquisition observation', ARGUS_RECONSTRUCTION: 'ARGUS reconstruction' };
const HI = {
  'o:card': isCard, 'o:chart': n => n.kind === 'EVIDENCE' && isChart(n), 'o:fw': n => n.kind === 'EVIDENCE' && isFw(n),
  'o:launch': n => n.kind === 'EVIDENCE' && isLaunch(n),
  'b:mixed': isMixed, 'b:cap': n => n.bearing === 'CAPABILITY', 'b:rule': n => ['DEFINITION', 'WARRANT'].includes(n.bearing),
  'b:scope': n => ['SCOPE', 'AVAILABILITY', 'PROVENANCE', 'CONTEXT', 'QUALIFIER'].includes(n.bearing),
  'b:sup': n => ['PUBLISHER_ASSESSMENT', 'SUPPORT', 'BOUNDED_SUPPORT'].includes(n.bearing),
  'l:verbatim': n => n.interpretation_label === 'VERBATIM_PUBLISHER', 'l:pub': n => n.interpretation_label === 'PUBLISHER_REPORT_WITH_ARGUS_SCOPE',
  'l:chart': n => n.interpretation_label === 'PUBLISHER_CHART_TRANSCRIPTION_WITH_ARGUS_SCOPE', 'l:obs': n => n.interpretation_label === 'ARGUS_ACQUISITION_OBSERVATION',
  'l:argus': n => n.interpretation_label === 'ARGUS_RECONSTRUCTION', 'k:gap': n => n.kind === 'GAP'
};
function flags(n) {
  const f = [];
  const L = n.interpretation_label;
  f.push([L === 'VERBATIM_PUBLISHER' ? 'pub' : L === 'ARGUS_RECONSTRUCTION' ? 'argus' : 'obs', LABEL_READING[L] || L]);
  const o = origin(n); if (o) f.push(['origin ' + o[0], o[1]]);
  if (n.bearing) f.push([isMixed(n) ? 'mixed' : 'val', 'Bearing: ' + (BEARING_READING[n.bearing] || n.bearing)]);
  if (n.kind === 'GAP') f.push(['open', 'Open public-assurance gap']);
  return f;
}

/* Gaps: each gap limits one argument and one dependency (graph edges). The branch reader shows the executive
   checklist row for the gap. A selected argument or dependency opens the first gap that limits it. */
const GAPS = NODES.filter(n => n.kind === 'GAP').map(n => n.id);
const THEME = { 'P4-G-001': 'Threshold coverage', 'P4-G-002': 'Capability validity', 'P4-G-003': 'Robustness', 'P4-G-004': 'Family inference', 'P4-G-005': 'Test to deployment', 'P4-G-006': 'Risk acceptance', 'P4-G-007': 'Continuing control' };
const limitersOf = id => INC.get(id).filter(e => e.relationship === 'limits').map(e => e.from_node).sort();

/* ---------- helpers (Astra) ---------- */
function el(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs || {}) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function h(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function hx(tag, cls, html) { const e = h(tag, cls); e.innerHTML = html; return e; } /* register HTML, escaped at build time */
const TOKRE = /\b([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)\b/g;
function rich(t) {
  const f = document.createDocumentFragment(); let last = 0, m; t = String(t); TOKRE.lastIndex = 0;
  while ((m = TOKRE.exec(t))) { if (m.index > last) f.appendChild(document.createTextNode(t.slice(last, m.index))); f.appendChild(h('code', 'tok' + (/UNKNOWN|NOT_LOCATED/.test(m[1]) ? ' unk' : ''), m[1])); last = m.index + m[1].length; }
  if (last < t.length) f.appendChild(document.createTextNode(t.slice(last)));
  return f;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function shapeGeom(cls, size) {
  const E = size === 'exec';
  switch (cls) {
    case 'CLAIM': return { kind: 'rect', hw: E ? 170 : 34, hh: E ? 42 : 16 };
    case 'ARGUMENT': return { kind: 'para', hw: E ? 104 : 33, hh: E ? 34 : 15 };
    case 'EVIDENCE': return { kind: 'circle', hw: E ? 22 : 15, hh: E ? 22 : 15 };
    case 'DEPENDENCY': return { kind: 'oct', hw: E ? 88 : 28, hh: E ? 30 : 14 };
    case 'ASSUMPTION': return { kind: 'ellipse', hw: E ? 84 : 27, hh: E ? 30 : 14 };
    case 'GAP': return { kind: 'diamond', hw: E ? 24 : 18, hh: E ? 24 : 18 };
  }
}
function drawShape(g, gm) {
  const { kind, hw, hh } = gm; let sh;
  if (kind === 'rect') sh = el('rect', { x: -hw, y: -hh, width: hw * 2, height: hh * 2 }, g);
  else if (kind === 'para') { const k = hh * 0.55; sh = el('polygon', { points: `${-hw + k},${-hh} ${hw},${-hh} ${hw - k},${hh} ${-hw},${hh}` }, g); }
  else if (kind === 'circle') sh = el('circle', { r: hw }, g);
  else if (kind === 'oct') { const c = hh * 0.45; sh = el('polygon', { points: `${-hw + c},${-hh} ${hw - c},${-hh} ${hw},${-hh + c} ${hw},${hh - c} ${hw - c},${hh} ${-hw + c},${hh} ${-hw},${hh - c} ${-hw},${-hh + c}` }, g); }
  else if (kind === 'ellipse') sh = el('ellipse', { rx: hw, ry: hh }, g);
  else sh = el('polygon', { points: `0,${-hh} ${hw},0 0,${hh} ${-hw},0` }, g);
  sh.setAttribute('class', 'shape'); return sh;
}
function selRing(g, gm) {
  const p = 5, { kind, hw, hh } = gm;
  if (kind === 'circle') el('circle', { r: hw + p, class: 'selring' }, g);
  else if (kind === 'ellipse') el('ellipse', { rx: hw + p, ry: hh + p, class: 'selring' }, g);
  else if (kind === 'diamond') el('polygon', { points: `0,${-hh - p * 1.4} ${hw + p * 1.4},0 0,${hh + p * 1.4} ${-hw - p * 1.4},0`, class: 'selring' }, g);
  else el('rect', { x: -hw - p, y: -hh - p, width: (hw + p) * 2, height: (hh + p) * 2, class: 'selring' }, g);
}
function boundaryT(gm, dx, dy) {
  const ax = Math.abs(dx) || 1e-9, ay = Math.abs(dy) || 1e-9;
  switch (gm.kind) {
    case 'circle': return gm.hw / Math.hypot(dx, dy);
    case 'ellipse': return 1 / Math.sqrt((dx / gm.hw) ** 2 + (dy / gm.hh) ** 2);
    case 'diamond': return 1 / (ax / gm.hw + ay / gm.hh);
    default: return Math.min(gm.hw / ax, gm.hh / ay);
  }
}
function clipPt(p, gm, tx, ty, pad) { const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy) || 1; const t = boundaryT(gm, dx, dy) + pad / L; return { x: p.x + dx * t, y: p.y + dy * t }; }
function edgeD(a, ga, b, gb, bend) {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
  const cx = (a.x + b.x) / 2 - dy / L * bend * L, cy = (a.y + b.y) / 2 + dx / L * bend * L;
  const p0 = clipPt(a, ga, cx, cy, 2), p1 = clipPt(b, gb, cx, cy, 5);
  return { d: `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}` };
}
/* Line grammar: the five series types keep Proof-3's markers; the three P4 types get their own (see explorer.css). */
function defs(svg, pfx) {
  const d = el('defs', {}, svg);
  const mk = (rel, build, w, hgt, refX) => { const m = el('marker', { id: pfx + rel, viewBox: `0 0 ${w} ${hgt}`, refX, refY: hgt / 2, markerWidth: w, markerHeight: hgt, markerUnits: 'userSpaceOnUse', orient: 'auto' }, d); build(m); };
  mk('supports', m => el('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--r-sup)' }, m), 10, 10, 9);
  mk('reports', m => el('circle', { cx: 5, cy: 5, r: 3.4, style: 'fill:var(--evid)' }, m), 10, 10, 8.4);
  mk('qualifies', m => el('path', { d: 'M1,1 L10,5.5 L1,10 z', style: 'fill:var(--surface);stroke:var(--r-qual);stroke-width:1.4' }, m), 11, 11, 9.5);
  mk('defines_scope', m => el('path', { d: 'M8,1 L8,11 M1,6 L8,6', style: 'fill:none;stroke:var(--part);stroke-width:2' }, m), 10, 12, 9);
  mk('contextualizes', m => el('rect', { x: 2, y: 2, width: 7, height: 7, style: 'fill:var(--surface);stroke:var(--xfer);stroke-width:1.4' }, m), 11, 11, 9.5);
  mk('conditions', m => el('path', { d: 'M1,1 L9,5 L1,9', style: 'fill:none;stroke:var(--r-dep);stroke-width:1.6' }, m), 10, 10, 8);
  mk('assumed_by', m => el('circle', { cx: 5, cy: 5, r: 3.6, style: 'fill:var(--surface);stroke:var(--r-asm);stroke-width:1.4' }, m), 10, 10, 8.6);
  mk('limits', m => el('path', { d: 'M1,6 L6,1 L11,6 L6,11 z', style: 'fill:var(--surface);stroke:var(--gap);stroke-width:1.4' }, m), 12, 12, 10.5);
}
function glyph(cls, s) {
  const svg = el('svg', { width: s, height: s, viewBox: '-15 -15 30 30', 'aria-hidden': 'true' });
  const g = el('g', { class: 'node ' + cls }, svg);
  drawShape(g, { CLAIM: { kind: 'rect', hw: 13, hh: 9 }, ARGUMENT: { kind: 'para', hw: 14, hh: 8 }, EVIDENCE: { kind: 'circle', hw: 10, hh: 10 }, DEPENDENCY: { kind: 'oct', hw: 13, hh: 9 }, ASSUMPTION: { kind: 'ellipse', hw: 13, hh: 8 }, GAP: { kind: 'diamond', hw: 11, hh: 11 } }[cls]);
  return svg;
}
function wrap(text, max) {
  const words = text.split(/\s+/), lines = []; let cur = '';
  words.forEach(w => { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
  if (cur) lines.push(cur); return lines;
}

/* ---------- header / footer ---------- */
const params = new URLSearchParams(location.search);
document.getElementById('semantics').textContent = 'Edge semantics, as stated in the graph (direction is always from → to): ' + RELS.map(r => r + ' = ' + D.edge_semantics[r] + ' (' + relEnds(r) + ')').join('; ') + '.';
document.getElementById('rules').textContent = D.attribution_rule;
document.getElementById('scopeline').textContent = D.scope;
document.getElementById('tab-full-n').textContent = NODES.length + ' nodes · ' + EDGES.length + ' rel.';
async function integrity() {
  let msg = 'Digest check unavailable in this browser context.';
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(RAW));
    const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    document.body.dataset.sha = hex;
    msg = 'SHA-256 ' + hex + (hex === EXPECTED_SHA ? ', equal to the digest of the filed research graph.' : ', which DIFFERS from the filed digest ' + EXPECTED_SHA + '.');
  } catch (_) {}
  const ok = NODES.length === 54 && EDGES.length === 67 && D.sources.length === 9 && N.has(ROOT)
    && NODES.filter(n => n.kind === 'EVIDENCE').length === 25 && GAPS.length === 7
    && EDGES.every(e => N.has(e.from_node) && N.has(e.to_node) && RELS.includes(e.relationship));
  document.getElementById('integrity').textContent = msg + ' ' + NODES.length + ' nodes, ' + EDGES.length + ' edges, ' + D.sources.length + ' sources, root ' + ROOT + (ok ? ' · structure as filed.' : ' · STRUCTURAL MISMATCH.');
  document.body.dataset.structure = ok ? 'ok' : 'mismatch';
}

/* ---------- legend / filters ---------- */
const canvas = document.getElementById('canvas');
const rels = document.getElementById('rels');
RELS.forEach(r => {
  const n = EDGES.filter(e => e.relationship === r).length;
  const b = h('button', 'relchip'); b.type = 'button'; b.setAttribute('aria-pressed', 'true'); b.dataset.rel = r;
  const sv = el('svg', { width: 34, height: 12, viewBox: '0 0 34 12', 'aria-hidden': 'true' });
  defs(sv, 'lg-' + r + '-');
  el('path', { d: 'M2,6 L28,6', class: 'edge ' + r, 'marker-end': `url(#lg-${r}-${r})` }, sv);
  b.appendChild(sv); b.appendChild(document.createTextNode(relName(r) + ' ')); b.appendChild(h('b', '', n));
  b.title = r + ': ' + D.edge_semantics[r] + ' (' + relEnds(r) + '). Click to hide or show.';
  b.setAttribute('aria-label', relName(r) + ', ' + n + ' relationships: ' + D.edge_semantics[r] + '. Toggle visibility.');
  b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-pressed', on ? 'false' : 'true'); canvas.classList.toggle('hide-' + r, on); });
  rels.appendChild(b);
});
const sk = document.getElementById('statuskey');
sk.appendChild(h('span', 'label', 'Key'));
{ const s = h('span'); const i = h('i'); i.style.background = 'var(--open)'; s.appendChild(i); s.appendChild(document.createTextNode('Open public-assurance gap')); sk.appendChild(s); }
{ const s = h('span'); s.appendChild(h('span', 'ringkey')); s.appendChild(document.createTextNode('Dashed ring = launch-chart evidence (separate setups, never pooled with model-card results)')); sk.appendChild(s); }
sk.appendChild(h('span', '', 'MIXED = graph bearing: favourable and adverse together'));

/* ---------- tooltip, focus, selection ---------- */
const tip = document.getElementById('tip');
function showTip(evt, html) {
  tip.innerHTML = html; tip.hidden = false;
  const r = canvas.getBoundingClientRect();
  let x = evt.clientX - r.left + 14, y = evt.clientY - r.top + 14;
  if (x + 310 > r.width) x = Math.max(8, x - 330);
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
const views = {};
let selected = ROOT, pinned = null, activeView = 'exec', branch = null, isolate = false, hiKey = '';
const kindsOff = new Set();
function rootPath(id, V) {
  const visible = x => !V || !V.nodeEls.get(x) || !V.nodeEls.get(x).classList.contains('off') || x === id;
  const nb = x => [...OUT.get(x).map(e => [e.to_node, e]), ...INC.get(x).map(e => [e.from_node, e])].filter(([o]) => visible(o));
  const dist = new Map([[ROOT, 0]]), q = [ROOT];
  while (q.length) { const x = q.shift(); nb(x).forEach(([o]) => { if (!dist.has(o)) { dist.set(o, dist.get(x) + 1); q.push(o); } }); }
  const nodes = new Set([id]), edges = new Set(); if (!dist.has(id)) return { nodes, edges };
  let front = [id];
  while (front.length) { const nx = []; front.forEach(x => nb(x).forEach(([o, e]) => { if (dist.get(o) === dist.get(x) - 1) { edges.add(e.id); if (!nodes.has(o)) { nodes.add(o); nx.push(o); } } })); front = nx; }
  return { nodes, edges };
}
function focusIn(view, id) {
  const V = views[view]; if (!V) return;
  V.root.classList.toggle('focusing', !!id);
  V.nodeEls.forEach(g => g.classList.remove('hl', 'path'));
  V.edgeEls.forEach(x => x.g.classList.remove('hl', 'path'));
  if (!id) return;
  const keep = new Set([id]);
  V.edgeEls.forEach(x => { if (x.e.from_node === id || x.e.to_node === id) { x.g.classList.add('hl'); keep.add(x.e.from_node); keep.add(x.e.to_node); } });
  keep.forEach(k => V.nodeEls.get(k) && V.nodeEls.get(k).classList.add('hl'));
  if (id === pinned) {
    const rp = rootPath(id, V);
    rp.nodes.forEach(k => V.nodeEls.get(k) && V.nodeEls.get(k).classList.add('path'));
    V.edgeEls.forEach(x => { if (rp.edges.has(x.e.id)) x.g.classList.add('hl', 'path'); });
  }
}
function branchFor(id) {
  const n = N.get(id);
  if (n.kind === 'GAP') return id;
  if (n.kind === 'ARGUMENT' || n.kind === 'DEPENDENCY') return limitersOf(id)[0] || null;
  return null;
}
function select(id, opts) {
  selected = id;
  Object.values(views).forEach(V => V.nodeEls.forEach((g, nid) => g.classList.toggle('sel', nid === id)));
  const b = branchFor(id); if (b) branch = b;
  renderPanel(id); renderBranch();
  if (opts && opts.pin) { pinned = id; Object.keys(views).forEach(v => focusIn(v, id)); }
  applyFilters();
  writeHash();
}
function bindNode(g, n, view) {
  g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
  const o = origin(n);
  g.setAttribute('aria-label', `${n.id}, ${CLASS_ONE[n.kind]}: ${n.title}${o ? ' (' + o[1] + ')' : ''}${isMixed(n) ? ', mixed bearing' : ''}`);
  const txt = n.title + ': ' + n.statement;
  g.addEventListener('mouseenter', ev => { focusIn(view, n.id); showTip(ev, `<b>${esc(n.id)} · ${esc(CLASS_ONE[n.kind])}${o ? ' · ' + esc(o[1].split(' · ')[0]) : ''}</b>${esc(txt.slice(0, 260))}${txt.length > 260 ? '…' : ''}`); });
  g.addEventListener('mousemove', ev => showTip(ev, tip.innerHTML));
  g.addEventListener('mouseleave', () => { tip.hidden = true; focusIn(view, pinned); });
  g.addEventListener('click', ev => { ev.stopPropagation(); if (!dragMoved) select(n.id, { pin: true }); });
  g.addEventListener('keydown', ev => nodeKey(ev, n.id, view));
  g.addEventListener('focus', () => { if (view === 'full' && views.full) views.full.ensure(n.id); });
}
function edgeTip(e) { return `<b>${esc(e.id)} · ${esc(short(e.from_node))} ${esc(READ_OUT[e.relationship])} ${esc(short(e.to_node))}</b>${esc(e.warrant)}`; }
function bindEdge(g, e) {
  g.addEventListener('mouseenter', ev => showTip(ev, edgeTip(e)));
  g.addEventListener('mousemove', ev => showTip(ev, tip.innerHTML));
  g.addEventListener('mouseleave', () => { tip.hidden = true; });
}
function clearPin() { pinned = null; Object.keys(views).forEach(v => focusIn(v, null)); applyFilters(); writeHash(); }

/* ---------- executive view ---------- */
/* Editorial positions and short labels (Astra convention). Argument and gap labels are the graph titles; the root
   and evidence labels are editorial and keep each metric with its unit, setting and origin ("Card" = model card,
   Wonder Full; "Chart" = launch chart, Full and smaller Wonder). Bands: root 74 · arguments 250 · gaps 420 ·
   evidence 575/680 (staggered). A-001 has no limiting gap; G-001 and G-002 both limit A-002. */
const EXEC = {
  'P4-C-001': [620, 74, 'Meta: unmitigated Wonder Full at “moderate or lower” for cybersecurity (Loss of Control in the quote, outside analysis)'],
  'P4-A-001': [110, 250], 'P4-A-002': [280, 250], 'P4-A-003': [450, 250], 'P4-A-004': [620, 250],
  'P4-A-005': [790, 250], 'P4-A-006': [960, 250], 'P4-A-007': [1130, 250],
  'P4-G-001': [215, 420], 'P4-G-002': [345, 420], 'P4-G-003': [470, 420], 'P4-G-004': [620, 420],
  'P4-G-005': [790, 420], 'P4-G-006': [960, 420], 'P4-G-007': [1130, 420],
  'P4-E-012': [55, 575, 'Framework: what “moderate or lower” means'],
  'P4-E-003': [147, 680, 'Card: CyberGym 88.4%'],
  'P4-E-005': [239, 575, 'Card: ExploitGym 92 flags = 21 intended + 71 unintended'],
  'P4-E-006': [331, 680, 'Card: CyberBench ASR 0.8% single, 0.8% multi'],
  'P4-E-008': [423, 575, 'Card: RedCode ASR 9.0% single, 8.0% multi'],
  'P4-E-023': [515, 680, 'Chart: misuse refusal, Full 96.9%, Wonder 93.7%'],
  'P4-E-025': [607, 575, 'Chart: unauthorized-code ASR, Full 10.7%, Wonder 10.5%'],
  'P4-E-002': [699, 680, 'Card: Full results said to cover the family'],
  'P4-E-011': [791, 575, 'Card: guardrails recommended; results vary with serving'],
  'P4-E-018': [883, 680, 'Full: Muse Code subscribers. Wonder: API and Muse Code'],
  'P4-E-009': [975, 575, 'Card: mitigated assessment, internal review'],
  'P4-E-019': [1067, 680, 'Separate full report not located, 14 Oct check'],
  'P4-E-022': [1165, 575, 'Weight security reported; no effectiveness data']
};
const BEND = { 'P4-G-001>P4-A-002': 0.08, 'P4-G-002>P4-A-002': -0.08, 'P4-E-023>P4-A-004': -0.05, 'P4-E-025>P4-A-003': 0.05 };
function execLabel(id) { const x = EXEC[id]; return x[2] || N.get(id).title; }
function buildExec() {
  const svg = document.getElementById('exec-svg');
  defs(svg, 'ex-');
  svg.addEventListener('click', clearPin);
  const root = el('g', {}, svg);
  [[158, 'Arguments'], [335, 'Gaps · open public-assurance links'], [505, 'Evidence (selected) · dashed ring = launch chart']].forEach(([y, t]) => { el('line', { x1: 0, x2: 1240, y1: y, y2: y, class: 'bandline' }, root); const tx = el('text', { x: 6, y: y + 14, class: 'bandlabel' }, root); tx.textContent = t; });
  const ids = Object.keys(EXEC), set = new Set(ids);
  const pos = id => ({ x: EXEC[id][0], y: EXEC[id][1] });
  const gm = id => N.get(id).kind === 'ARGUMENT' ? { kind: 'para', hw: 80, hh: 39 } : shapeGeom(N.get(id).kind, 'exec');
  const shown = EDGES.filter(e => set.has(e.from_node) && set.has(e.to_node));
  document.getElementById('tab-exec-n').textContent = ids.length + ' nodes';
  document.getElementById('exec-note').textContent = `${ids.length} of ${NODES.length} nodes · ${shown.length} of ${EDGES.length} relationships among them. Faint “+n” counts the links shown only in the full graph.`;
  const edgeLayer = el('g', {}, root), nodeLayer = el('g', {}, root), labelLayer = el('g', {}, root);
  const V = { root: svg, nodeEls: new Map(), edgeEls: [] };
  shown.forEach(e => {
    const key = e.from_node + '>' + e.to_node, bend = key in BEND ? BEND[key] : 0.04;
    const { d } = edgeD(pos(e.from_node), gm(e.from_node), pos(e.to_node), gm(e.to_node), bend);
    const g = el('g', { class: 'r-edge r-' + e.relationship, 'data-id': e.id }, edgeLayer);
    el('path', { d, class: 'edge ' + e.relationship, 'marker-end': `url(#ex-${e.relationship})` }, g);
    el('path', { d, class: 'edgehit' }, g);
    bindEdge(g, e); V.edgeEls.push({ e, g });
  });
  const deg = id => OUT.get(id).length + INC.get(id).length;
  const degShown = id => shown.filter(e => e.from_node === id || e.to_node === id).length;
  ids.forEach(id => {
    const n = N.get(id), [x, y] = EXEC[id], label = execLabel(id), G = gm(id);
    const g = el('g', { class: ['node', n.kind].join(' '), transform: `translate(${x},${y})`, 'data-id': id }, nodeLayer);
    selRing(g, G); drawShape(g, G);
    if (n.kind === 'EVIDENCE' && isChart(n)) el('circle', { r: G.hw + 4.5, class: 'ring chart' }, g);
    const inside = ['rect', 'para', 'oct', 'ellipse'].includes(G.kind);
    if (inside) {
      const max = n.kind === 'CLAIM' ? 44 : 19, lh = n.kind === 'CLAIM' ? 16 : 15, lines = wrap(label, max);
      const top = -(14 + lines.length * lh) / 2;
      const idt = el('text', { x: 0, y: top + 10, 'text-anchor': 'middle', class: 'id' }, g); idt.textContent = n.kind === 'CLAIM' ? id : short(id);
      lines.forEach((ln, i) => { const t = el('text', { x: 0, y: top + 14 + (i + 1) * lh - 3, 'text-anchor': 'middle', class: 'txt' }, g); t.textContent = ln; });
    } else {
      const idt = el('text', { x: 0, y: 4, 'text-anchor': 'middle', class: 'id small' }, g); idt.textContent = short(id);
      wrap(label, n.kind === 'GAP' ? 19 : 21).forEach((ln, i) => { const t = el('text', { x: 0, y: G.hh + 16 + i * 14, 'text-anchor': 'middle', class: 'sub' }, g); t.textContent = ln; });
    }
    if (n.kind === 'GAP') el('circle', { cx: G.hw * 0.62, cy: -G.hh * 0.62, r: 5, class: 'pip open' }, g);
    const more = deg(id) - degShown(id);
    if (more > 0) { const para = G.kind === 'para', t = el('text', { x: para ? G.hw - 8 : inside ? G.hw + 4 : G.hw + 6, y: para ? -G.hh - 5 : inside ? -G.hh + 8 : -G.hh + 6, 'text-anchor': para ? 'end' : 'start', class: 'more' }, g); t.textContent = '+' + more; }
    bindNode(g, n, 'exec'); V.nodeEls.set(id, g);
  });
  // MIXED tags from the graph's own bearing field (no new edges, no adverse verdict)
  ids.filter(id => isMixed(N.get(id))).forEach(id => {
    const p = pos(id), g = el('g', { 'pointer-events': 'none' }, labelLayer);
    el('rect', { x: p.x - 22, y: p.y - 44, width: 44, height: 13, rx: 2, class: 'mixbg' }, g);
    const t = el('text', { x: p.x, y: p.y - 34.5, 'text-anchor': 'middle', class: 'mixtag' }, g); t.textContent = 'MIXED';
  });
  views.exec = V;
}

/* ---------- branch reader ---------- */
function idBtn(id, note) {
  const n = N.get(id);
  const b = h('button', 'idbtn' + (isMixed(n) ? ' mix' : '') + (n.kind === 'EVIDENCE' && isChart(n) ? ' chart' : ''), short(id)); b.type = 'button';
  const o = origin(n); b.title = n.title + (o ? ' · ' + o[1] : '') + (note ? ' · ' + note : '');
  b.addEventListener('click', () => { select(id, { pin: true }); if (activeView === 'full' && views.full) views.full.center(id); });
  return b;
}
const branchbar = document.getElementById('branchbar');
GAPS.forEach(gid => {
  const b = h('button', 'bbtn'); b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.g = gid; b.setAttribute('aria-selected', 'false');
  b.appendChild(h('b', '', short(gid))); b.appendChild(document.createTextNode(THEME[gid])); b.title = N.get(gid).title;
  b.addEventListener('click', () => select(gid, { pin: true }));
  branchbar.appendChild(b);
});
function cell(cls, label, kids) { const c = h('div', 'bcell ' + cls); c.appendChild(h('span', 'label', label)); kids.forEach(k => c.appendChild(k)); return c; }
function renderBranch() {
  branchbar.querySelectorAll('.bbtn').forEach(b => b.setAttribute('aria-selected', String(b.dataset.g === branch)));
  const box = document.getElementById('branchrow'); box.innerHTML = '';
  if (!branch) { box.appendChild(h('p', 'hint', 'Select a gap (◇), an argument or a branch above to read it left to right, in the executive checklist’s own columns: review question → public evidence and stated control → epistemic status and dependency → gap and evidence needed, with the gap register’s alternative reading.')); return; }
  const g = N.get(branch), G = R.gaps[branch];
  const rows = R.checklist.filter(r => r.gaps.includes(branch));
  const head = h('div', 'bhead');
  head.appendChild(h('span', 'gid', branch)); head.appendChild(h('b', '', g.title));
  head.appendChild(h('span', 'lim', 'limits ' + OUT.get(branch).map(e => short(e.to_node)).join(' and ')));
  box.appendChild(head);
  rows.forEach(row => {
    const r = h('div', 'brow');
    r.appendChild(cell('claimc flow', 'Checklist row ' + row.n + ' of 7 · review question', [hx('div', 'v', row.question)]));
    const ch = h('div', 'chips'); row.evidence_ids.forEach(x => ch.appendChild(idBtn(x, 'cited in checklist row ' + row.n)));
    r.appendChild(cell('flow', 'Public evidence and stated control', [ch, hx('div', 'v ev', row.evidence)]));
    r.appendChild(cell('flow', 'Epistemic status and dependency', [hx('div', 'v', row.status)]));
    r.appendChild(cell('gapc flow', 'Gap and evidence needed', [hx('div', 'v', row.gap)]));
    r.appendChild(cell('closec', 'Alternative interpretation · gap register', [hx('div', 'v', G.alternative)]));
    box.appendChild(r);
  });
  const close = h('div', 'bclose');
  close.appendChild(h('span', 'label', 'Evidence that would narrow or close it · gap register'));
  close.appendChild(hx('p', '', G.closure));
  box.appendChild(close);
  const f = h('div', 'bfoot');
  f.appendChild(document.createTextNode('Evidence buttons are the checklist’s citations, not graph edges: in the graph a gap limits one argument and one dependency. The full gap record is in the panel. '));
  const a2 = h('a', '', 'Isolate this branch in the Full graph →'); a2.href = '#full/' + branch + '/iso';
  a2.addEventListener('click', ev => { ev.preventDefault(); isolate = true; document.getElementById('isolate').checked = true; setView('full'); select(branch, { pin: true }); views.full.fitTo(keepSet(branch)); });
  f.appendChild(a2);
  box.appendChild(f);
}

/* ---------- full view ---------- */
const BAND = [0, 150, 290, 410, 570, 740];
const BAND_NAME = ['Root claim', 'Arguments', 'Dependencies', 'Assumptions', 'Evidence', 'Gaps'];
function fullLayout() {
  const P = new Map(), byK = k => NODES.filter(n => n.kind === k);
  const spread = (ids, gap, y) => ids.forEach((id, i) => P.set(id, { x: (i - (ids.length - 1) / 2) * gap, y }));
  const bary = (id, kinds) => { const xs = OUT.get(id).map(e => e.to_node).filter(t => P.has(t) && kinds.includes(N.get(t).kind)).map(t => P.get(t).x); return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0; };
  const order = (ids, f) => ids.map(id => [id, f(id)]).sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1)).map(x => x[0]);
  P.set(ROOT, { x: 0, y: BAND[0] });
  spread(byK('ARGUMENT').map(n => n.id), 230, BAND[1]);
  spread(order(byK('DEPENDENCY').map(n => n.id), id => bary(id, ['ARGUMENT'])), 175, BAND[2]);
  spread(order(byK('ASSUMPTION').map(n => n.id), id => bary(id, ['DEPENDENCY'])), 160, BAND[3]);
  spread(order(byK('EVIDENCE').map(n => n.id), id => bary(id, ['ARGUMENT'])), 100, BAND[4]);
  spread(order(byK('GAP').map(n => n.id), id => bary(id, ['ARGUMENT', 'DEPENDENCY'])), 210, BAND[5]);
  return P;
}
let dragMoved = false;
function buildFull() {
  const svgEl = document.getElementById('full-svg');
  defs(svgEl, 'fu-');
  const root = el('g', {}, svgEl);
  const P = fullLayout();
  const xs = [...P.values()].map(p => p.x), minX = Math.min(...xs) - 80, maxX = Math.max(...xs) + 80;
  const bands = el('g', {}, root);
  BAND.forEach((y, i) => { el('line', { class: 'bandline', x1: minX - 190, x2: maxX, y1: y, y2: y }, bands); const t = el('text', { class: 'bandlabel', x: minX - 190, y: y - 8 }, bands); t.textContent = BAND_NAME[i]; });
  const edgeLayer = el('g', {}, root), nodeLayer = el('g', {}, root);
  const V = { root: svgEl, nodeEls: new Map(), edgeEls: [], P };
  const gm = id => shapeGeom(N.get(id).kind, 'full');
  EDGES.forEach((e, i) => {
    const a = P.get(e.from_node), b = P.get(e.to_node);
    const bend = Math.abs(a.y - b.y) < 1 ? 0.3 : ((i % 2) ? 0.06 : -0.06);
    const { d } = edgeD(a, gm(e.from_node), b, gm(e.to_node), bend);
    const g = el('g', { class: 'r-edge r-' + e.relationship, 'data-id': e.id }, edgeLayer);
    el('path', { d, class: 'edge ' + e.relationship, 'marker-end': `url(#fu-${e.relationship})` }, g);
    el('path', { d, class: 'edgehit' }, g);
    bindEdge(g, e); V.edgeEls.push({ e, g });
  });
  NODES.forEach(n => {
    const p = P.get(n.id), G = gm(n.id);
    const g = el('g', { class: ['node', n.kind].join(' '), transform: `translate(${p.x},${p.y})`, 'data-id': n.id }, nodeLayer);
    selRing(g, G); drawShape(g, G);
    if (n.kind === 'EVIDENCE' && isChart(n)) el('circle', { r: G.hw + 3.5, class: 'ring chart' }, g);
    const t = el('text', { x: 0, y: 3.5, 'text-anchor': 'middle', class: 'id small' }, g); t.textContent = short(n.id);
    if (n.kind === 'GAP') el('circle', { cx: G.hw * 0.6, cy: -G.hh * 0.6, r: 4, class: 'pip open' }, g);
    if (isMixed(n)) { const a = el('text', { x: 0, y: -G.hh - 6, 'text-anchor': 'middle', class: 'mixtag' }, g); a.textContent = 'MIXED'; }
    if (n.kind === 'EVIDENCE') { const o = origin(n); if (o) { const a = el('text', { x: 0, y: G.hh + 12, 'text-anchor': 'middle', class: 'origin ' + o[0] }, g); a.textContent = { chart: 'CHART', card: 'CARD', fw: 'FRAMEWORK', launch: 'LAUNCH', obs: 'ARGUS OBS.' }[o[0]]; } }
    bindNode(g, n, 'full'); V.nodeEls.set(n.id, g);
  });
  const bbox = { x0: minX - 200, x1: maxX + 30, y0: -60, y1: BAND[BAND.length - 1] + 55 };
  const tf = { x: 0, y: 0, k: 1 };
  const apply = () => root.setAttribute('transform', `translate(${tf.x.toFixed(2)},${tf.y.toFixed(2)}) scale(${tf.k.toFixed(4)})`);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const fitBox = bx => { const w = svgEl.clientWidth || 900, hgt = svgEl.clientHeight || 600; tf.k = clamp(Math.min(w / (bx.x1 - bx.x0), hgt / (bx.y1 - bx.y0)) * 0.96, 0.2, 4); tf.x = (w - tf.k * (bx.x1 + bx.x0)) / 2; tf.y = (hgt - tf.k * (bx.y1 + bx.y0)) / 2; apply(); };
  V.fit = () => fitBox(bbox);
  V.fitTo = ids => { const ps = [...ids].map(i => P.get(i)); fitBox({ x0: Math.min(...ps.map(p => p.x)) - 90, x1: Math.max(...ps.map(p => p.x)) + 90, y0: Math.min(...ps.map(p => p.y)) - 70, y1: Math.max(...ps.map(p => p.y)) + 50 }); };
  V.center = id => { const p = P.get(id); if (!p) return; const w = svgEl.clientWidth || 900, hgt = svgEl.clientHeight || 600; tf.k = Math.max(tf.k, 1.1); tf.x = w / 2 - tf.k * p.x; tf.y = hgt / 2 - tf.k * p.y; apply(); };
  V.ensure = id => { const p = P.get(id), w = svgEl.clientWidth, hgt = svgEl.clientHeight, sx = tf.x + p.x * tf.k, sy = tf.y + p.y * tf.k; if (sx < 20 || sy < 20 || sx > w - 20 || sy > hgt - 20) { tf.x = w / 2 - tf.k * p.x; tf.y = hgt / 2 - tf.k * p.y; apply(); } };
  V.zoom = (f, px, py) => { const w = svgEl.clientWidth, hgt = svgEl.clientHeight; if (px == null) { px = w / 2; py = hgt / 2; } const old = tf.k, next = clamp(old * f, 0.2, 4); tf.x = px - (px - tf.x) * (next / old); tf.y = py - (py - tf.y) * (next / old); tf.k = next; apply(); };
  V.transform = () => root.getAttribute('transform');
  svgEl.addEventListener('wheel', ev => { ev.preventDefault(); const r = svgEl.getBoundingClientRect(); V.zoom(Math.exp(-ev.deltaY * 0.0015), ev.clientX - r.left, ev.clientY - r.top); }, { passive: false });
  const ptrs = new Map(); let pan = null, pinch = null;
  svgEl.addEventListener('pointerdown', ev => {
    ptrs.set(ev.pointerId, { x: ev.clientX, y: ev.clientY }); dragMoved = false;
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: tf.k }; pan = null; return; }
    if (ev.button !== 0 && ev.pointerType === 'mouse') return;
    pan = { x: ev.clientX, y: ev.clientY, tx: tf.x, ty: tf.y };
  });
  svgEl.addEventListener('pointermove', ev => {
    if (!ptrs.has(ev.pointerId)) return; ptrs.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()], r = svgEl.getBoundingClientRect(); V.zoom((pinch.k * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d) / tf.k, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); dragMoved = true; return; }
    if (!pan) return;
    const dx = ev.clientX - pan.x, dy = ev.clientY - pan.y;
    if (!dragMoved && Math.hypot(dx, dy) < 4) return;
    if (!dragMoved) { try { svgEl.setPointerCapture(ev.pointerId); } catch (_) {} }
    dragMoved = true; tf.x = pan.tx + dx; tf.y = pan.ty + dy; apply();
  });
  const endPan = ev => { ptrs.delete(ev.pointerId); if (ptrs.size < 2) pinch = null; if (!ptrs.size) pan = null; try { svgEl.releasePointerCapture(ev.pointerId); } catch (_) {} };
  svgEl.addEventListener('pointerup', endPan); svgEl.addEventListener('pointercancel', endPan);
  svgEl.addEventListener('click', ev => { if (!dragMoved && !(ev.target.closest && ev.target.closest('.node'))) clearPin(); });
  views.full = V;
  document.getElementById('fit').addEventListener('click', () => (isolate && pinned) ? V.fitTo(keepSet(pinned)) : V.fit());
  document.getElementById('zIn').addEventListener('click', () => V.zoom(1.25));
  document.getElementById('zOut').addEventListener('click', () => V.zoom(0.8));
  const jump = document.getElementById('jump');
  CLASSES.forEach(c => { const og = h('optgroup'); og.label = CLASS_NAME[c]; NODES.filter(n => n.kind === c).forEach(n => { const o = h('option', '', short(n.id) + '  ' + n.title.slice(0, 48)); o.value = n.id; og.appendChild(o); }); jump.appendChild(og); });
  jump.addEventListener('change', () => { select(jump.value, { pin: true }); V.center(jump.value); });
}
function keepSet(id) {
  const keep = new Set([id]); OUT.get(id).forEach(e => keep.add(e.to_node)); INC.get(id).forEach(e => keep.add(e.from_node));
  rootPath(id).nodes.forEach(x => keep.add(x)); return keep;
}
function applyFilters() {
  const V = views.full; if (!V) return;
  const keep = isolate && pinned ? keepSet(pinned) : null;
  V.nodeEls.forEach((g, id) => g.classList.toggle('off', kindsOff.has(N.get(id).kind) || (keep && !keep.has(id))));
  V.edgeEls.forEach(x => x.g.classList.toggle('off', V.nodeEls.get(x.e.from_node).classList.contains('off') || V.nodeEls.get(x.e.to_node).classList.contains('off')));
  V.nodeEls.forEach((g, id) => g.classList.toggle('mark', !!hiKey && HI[hiKey](N.get(id))));
  V.root.classList.toggle('marking', !!hiKey);
}
const COLBAND = id => BAND.indexOf(views.full.P.get(id).y);
function nodeKey(ev, id, view) {
  if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(id, { pin: true }); return; }
  if (view !== 'full' || !/^Arrow/.test(ev.key)) return;
  const V = views.full, P = V.P, vis = x => !V.nodeEls.get(x).classList.contains('off');
  const band = b => NODES.map(n => n.id).filter(x => vis(x) && P.get(x).y === BAND[b]).sort((a, c) => P.get(a).x - P.get(c).x);
  let target = null; const b0 = COLBAND(id);
  if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') { const row = band(b0), i = row.indexOf(id); target = row[i + (ev.key === 'ArrowLeft' ? -1 : 1)]; }
  else {
    let b = b0, dir = ev.key === 'ArrowUp' ? -1 : 1, row = [];
    while (!row.length && (b += dir) >= 0 && b < BAND.length) row = band(b);
    if (row.length) {
      const nb = new Set([...OUT.get(id).map(e => e.to_node), ...INC.get(id).map(e => e.from_node)]);
      const pool = row.filter(x => nb.has(x)).length ? row.filter(x => nb.has(x)) : row, x0 = P.get(id).x;
      target = pool.reduce((a, c) => Math.abs(P.get(c).x - x0) < Math.abs(P.get(a).x - x0) ? c : a, pool[0]);
    }
  }
  if (target) { ev.preventDefault(); V.nodeEls.get(target).focus(); }
}

/* ---------- detail panel (Astra) ---------- */
const panel = document.getElementById('panel');
function fld(label, content, cls) {
  if (content == null || content === '') return null;
  const f = h('div', 'fld' + (cls ? ' ' + cls : '')); f.appendChild(h('span', 'label', label));
  if (typeof content === 'string') { const v = h('div', 'v'); v.appendChild(rich(content)); f.appendChild(v); } else f.appendChild(content);
  return f;
}
function regFld(label, html) { if (!html) return null; return fld(label, hx('div', 'v reg', html)); }
/* Public link for a source. HTML pages take a text fragment naming the cited passage where one is known
   (checked against the publisher's current page on 14 October 2026). */
const FRAG = {
  'P4-E-018|P4-SRC-003': 'Muse Wonder Full is available today for Muse Code subscribers',
  'P4-E-018|P4-SRC-004': 'Muse Wonder Full is available today for Muse Code subscribers',
  'P4-E-019|P4-SRC-003': 'A full report with additional safety evaluations will be available soon',
  'P4-E-019|P4-SRC-004': 'A full report with additional safety evaluations will be available soon'
};
function pageHref(sid, page) { const S = R.sources[sid]; return S.url + (S.pdf && page ? '#page=' + page : ''); }
function pageLink(sid, page, text) { const a = h('a', 'pg', text); a.href = pageHref(sid, page); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.title = srcTitle(R.sources[sid]) + ', PDF page ' + page + ' (opens the publisher copy)'; return a; }
/* Locator text with each cited PDF page linked to the publisher's copy at that page. */
function locator(loc, sid) {
  const f = document.createDocumentFragment(), S = R.sources[sid];
  const re = /(pp?\.)\s?(\d+(?:\s*[–-]\s*\d+)?(?:\s*,\s*\d+(?:\s*[–-]\s*\d+)?)*)/g;
  let last = 0, m;
  if (S.pdf) while ((m = re.exec(loc))) {
    f.appendChild(document.createTextNode(loc.slice(last, m.index) + m[1]));
    let j = 0; const nums = m[2];
    nums.replace(/\d+/g, (num, off) => { f.appendChild(document.createTextNode(nums.slice(j, off))); f.appendChild(pageLink(sid, num, num)); j = off + num.length; return num; });
    f.appendChild(document.createTextNode(nums.slice(j)));
    last = m.index + m[0].length;
  }
  f.appendChild(document.createTextNode(loc.slice(last)));
  if (S.chart) f.appendChild(h('span', 'chartnote', 'Launch chart image · publisher original'));
  else if (!S.pdf) f.appendChild(document.createTextNode(' (web page; no page numbers)'));
  return f;
}
function srcBlock(list, nodeId) {
  const w = h('div', 'rlist');
  list.forEach(s => {
    const S = R.sources[s.source_id], d = h('div', 'src');
    d.appendChild(h('span', 'sid', s.source_id + ' ')); d.appendChild(document.createTextNode(srcTitle(S)));
    const loc = h('div', 'loc'); loc.appendChild(locator(s.locator, s.source_id)); d.appendChild(loc);
    const first = S.pdf ? (/pp?\.\s?(\d+)/.exec(s.locator) || [])[1] : null;
    const frag = FRAG[nodeId + '|' + s.source_id];
    const a = h('a', 'sourceopen', 'OPEN SOURCE ↗'); a.href = S.pdf ? pageHref(s.source_id, first) : S.url + (frag ? '#:~:text=' + encodeURIComponent(frag) : '');
    a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', 'Open public source ' + s.source_id + ': ' + srcTitle(S) + (first ? ', PDF page ' + first : '') + (S.chart ? ', chart image' : ''));
    d.appendChild(a);
    const det = h('details', 'prov'); det.appendChild(h('summary', '', 'Provenance and release-time limits'));
    det.appendChild(hx('p', '', '<b>Publisher date:</b> ' + S.date));
    det.appendChild(hx('p', '', '<b>Revision:</b> ' + S.revision));
    det.appendChild(hx('p', '', '<b>ARGUS capture:</b> ' + S.retrieval));
    det.appendChild(hx('p', '', '<b>Limit:</b> ' + S.qualification));
    det.appendChild(h('p', 'sourceaccess', 'SHA-256 of the ARGUS capture: ' + S.sha256));
    det.appendChild(h('p', 'sourceaccess', 'Link check: ' + S.note));
    d.appendChild(det);
    w.appendChild(d);
  });
  return w;
}
function chipsOf(list) { const c = h('div', 'chips'); list.filter(Boolean).forEach(x => c.appendChild(h('span', 'chip', x))); return c; }
function chartPairs(id) {
  const row = R.figures.charts.find(c => c[0] === id); if (!row) return null;
  const [, , name, metric, better, full, wonder] = row;
  const w = h('div', 'pairs');
  [['Wonder Full (max)', full, 'full'], ['Muse Wonder (max)', wonder, '']].forEach(([who, v, cls]) => {
    const r = h('div', 'pr'); r.appendChild(h('span', '', who));
    const bar = h('span', 'bar'); const i = h('i', cls); i.style.width = parseFloat(v) + '%'; bar.appendChild(i); r.appendChild(bar);
    r.appendChild(h('b', '', v)); w.appendChild(r);
  });
  w.appendChild(h('span', 'chartnote', name + ' · ' + metric + ' · ' + better + ' is better · same chart, same setup; other bars left in the original'));
  return w;
}
function navButtons(id) {
  const nav = h('div', 'chips');
  if (activeView === 'exec') { const b = h('button', 'btn goto', 'Show in full graph'); b.type = 'button'; b.addEventListener('click', () => { setView('full'); select(id, { pin: true }); views.full.center(id); }); nav.appendChild(b); }
  else {
    const gs = N.get(id).kind === 'GAP' ? [id] : limitersOf(id);
    gs.forEach(gid => { const b = h('button', 'btn goto', 'Executive branch ' + short(gid)); b.type = 'button'; b.addEventListener('click', () => { setView('exec'); select(gid, { pin: true }); }); nav.appendChild(b); });
  }
  return nav;
}
function renderPanel(id) {
  const n = N.get(id); panel.innerHTML = '';
  const ph = h('div', 'ph'), top = h('div', 'top');
  top.appendChild(h('span', 'bigid', short(id)));
  top.appendChild(h('span', 'cls ' + n.kind, CLASS_ONE[n.kind]));
  if (n.kind === 'GAP') { const s = h('span', 'status'); const i = h('i'); i.style.background = 'var(--open)'; s.appendChild(i); s.appendChild(document.createTextNode('open public-assurance gap')); top.appendChild(s); }
  ph.appendChild(top);
  ph.appendChild(h('p', 'main', n.title));
  const fl = h('div', 'flags'); flags(n).forEach(([k, l]) => { const s = h('span', 'flag ' + k); s.appendChild(h('i')); s.appendChild(document.createTextNode(l)); fl.appendChild(s); }); ph.appendChild(fl);
  const nav = navButtons(id); if (nav.childNodes.length) ph.appendChild(nav);
  panel.appendChild(ph);
  const pb = h('div', 'pb'), add = x => x && pb.appendChild(x);
  if (n.kind === 'CLAIM') {
    add(fld('Publisher text (verbatim)', h('blockquote', 'pubq', n.statement)));
    add(fld('ARGUS reading', n.argus_reconstruction)); add(fld('Applicability', n.applicability));
    add(fld('Case scope (graph)', D.scope));
  } else if (n.kind === 'EVIDENCE') {
    const E = R.evidence[id];
    add(fld('Statement (graph)', n.statement));
    const pairs = chartPairs(id); if (pairs) add(fld('Launch-chart values, as transcribed', pairs));
    add(regFld('Reported finding · evidence register', E.finding));
    add(regFld('Model and setup · evidence register', E.setup));
    add(fld('Bearing', n.bearing + ': ' + (BEARING_READING[n.bearing] || '')));
    add(regFld('Limit · evidence register', E.limit));
    add(regFld('Primary locator · evidence register', E.source));
  } else if (n.kind === 'GAP') {
    const G = R.gaps[id];
    add(fld('Statement (graph)', n.statement));
    add(regFld('Observed public evidence', G.observed));
    add(regFld('Missing inference or evidence', G.missing));
    add(regFld('Evidence that would narrow or close the gap', G.closure));
    add(regFld('Alternative interpretation', G.alternative));
    add(regFld('Reason unavailable', G.reason));
    const tg = h('div', 'chips'); n.targets.forEach(x => tg.appendChild(idBtn(x, 'limited by this gap (graph edge)')));
    add(fld('Limits (graph edges)', tg));
    const ee = h('div', 'chips'); G.evidence_ids.forEach(x => ee.appendChild(idBtn(x, 'cited by the gap register')));
    add(fld('Evidence the gap register cites (not graph edges)', ee));
    const rows = R.checklist.filter(r => r.gaps.includes(id));
    add(fld('Executive checklist', 'Row ' + rows.map(r => r.n).join(', ') + ' of 7. Open the branch reader in the Executive graph to read it in full.'));
  } else {
    add(fld('Statement', n.statement));
  }
  add(fld('Classification', chipsOf([n.interpretation_label, n.kind === 'EVIDENCE' ? 'evidence register · ' + id : n.kind === 'GAP' ? 'gap register · ' + id : null])));
  if (n.source_refs) add(fld('Sources', srcBlock(n.source_refs, n.id)));
  const relList = (list, dir) => {
    const w = h('div', 'rlist');
    list.forEach(e => {
      const r = h('div', 'rrow');
      r.appendChild(h('span', 'rtag ' + e.relationship, dir === 'out' ? READ_OUT[e.relationship] + ' →' : '← ' + READ_IN[e.relationship]));
      const right = h('span'); right.appendChild(idBtn(dir === 'out' ? e.to_node : e.from_node)); right.appendChild(document.createTextNode(' ' + e.id)); right.style.fontSize = '11px';
      r.appendChild(right); r.appendChild(h('span', 'm', e.warrant)); w.appendChild(r);
    });
    return w;
  };
  const outE = OUT.get(id), inE = INC.get(id);
  if (outE.length) add(fld(`Outgoing (${outE.length})`, relList(outE, 'out')));
  if (inE.length) add(fld(`Incoming (${inE.length})`, relList(inE, 'in')));
  panel.appendChild(pb);
}

/* ---------- full-view controls ---------- */
const kinds = document.getElementById('kinds');
CLASSES.forEach(c => {
  const b = h('button', 'kt'); b.type = 'button'; b.dataset.kind = c; b.setAttribute('aria-pressed', 'true');
  b.appendChild(glyph(c, 16)); b.appendChild(document.createTextNode(CLASS_NAME[c] + ' ')); b.appendChild(h('b', '', NODES.filter(n => n.kind === c).length));
  b.addEventListener('click', () => { kindsOff.has(c) ? kindsOff.delete(c) : kindsOff.add(c); b.setAttribute('aria-pressed', String(!kindsOff.has(c))); applyFilters(); });
  kinds.appendChild(b);
});
document.getElementById('hiSel').addEventListener('change', ev => { hiKey = ev.target.value; applyFilters(); });
document.getElementById('isolate').addEventListener('change', ev => { isolate = ev.target.checked; applyFilters(); if (views.full) (isolate && pinned) ? views.full.fitTo(keepSet(pinned)) : views.full.fit(); writeHash(); });
document.getElementById('zReset').addEventListener('click', () => {
  kindsOff.clear(); document.querySelectorAll('.kt').forEach(b => b.setAttribute('aria-pressed', 'true'));
  RELS.forEach(r => canvas.classList.remove('hide-' + r)); document.querySelectorAll('.relchip').forEach(b => b.setAttribute('aria-pressed', 'true'));
  hiKey = ''; document.getElementById('hiSel').value = ''; isolate = false; document.getElementById('isolate').checked = false;
  document.getElementById('q').value = ''; searchMarks([]);
  clearPin(); select(ROOT); if (views.full) views.full.fit();
  pinned = null; writeHash();
});
const q = document.getElementById('q'), qres = document.getElementById('qres'); let hits = [], cur = 0;
const norm = x => x.toLowerCase().replace(/[–—-]/g, '-');
function searchMarks(ids) { if (views.full) views.full.nodeEls.forEach((g, id) => g.classList.toggle('match', ids.includes(id))); }
function runSearch() {
  const v = norm(q.value.trim());
  if (!v) { hits = []; qres.hidden = true; q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant'); searchMarks([]); return; }
  const vid = v.replace(/^p4-?/, '').replace(/^([a-z])-?0*(\d+)$/, (m, a, d) => a + '-' + d.padStart(3, '0'));
  hits = NODES.filter(n => norm(n.id).includes(v) || norm(n.id).endsWith(vid) || norm(n.title).includes(v) || norm(n.statement).includes(v)).slice(0, 12);
  qres.innerHTML = ''; cur = 0;
  hits.forEach((n, i) => { const li = h('li'); li.setAttribute('role', 'option'); li.id = 'qo-' + i; li.setAttribute('aria-selected', String(i === 0)); li.appendChild(h('b', '', short(n.id))); li.appendChild(document.createTextNode(n.title)); li.addEventListener('mousedown', ev => { ev.preventDefault(); pick(n.id); }); qres.appendChild(li); });
  if (!hits.length) qres.appendChild(h('li', '', 'No matching node'));
  qres.hidden = false; q.setAttribute('aria-expanded', 'true'); if (hits.length) q.setAttribute('aria-activedescendant', 'qo-0'); searchMarks(hits.map(n => n.id));
}
function pick(id) { qres.hidden = true; q.setAttribute('aria-expanded', 'false'); select(id, { pin: true }); views.full.center(id); }
q.addEventListener('input', runSearch);
q.addEventListener('keydown', ev => {
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); cur = Math.max(0, Math.min(hits.length - 1, cur + (ev.key === 'ArrowDown' ? 1 : -1))); qres.querySelectorAll('li').forEach((li, i) => li.setAttribute('aria-selected', String(i === cur))); q.setAttribute('aria-activedescendant', 'qo-' + cur); }
  if (ev.key === 'Enter' && hits[cur]) { ev.preventDefault(); pick(hits[cur].id); }
  if (ev.key === 'Escape') { q.value = ''; runSearch(); q.blur(); }
});
q.addEventListener('blur', () => setTimeout(() => { qres.hidden = true; q.setAttribute('aria-expanded', 'false'); }, 150));

/* ---------- tabs, routing ---------- */
let fullBuilt = false;
function setView(v) {
  activeView = v;
  document.getElementById('tab-exec').setAttribute('aria-selected', v === 'exec');
  document.getElementById('tab-full').setAttribute('aria-selected', v === 'full');
  document.getElementById('tab-exec').tabIndex = v === 'exec' ? 0 : -1;
  document.getElementById('tab-full').tabIndex = v === 'full' ? 0 : -1;
  document.getElementById('view-exec').hidden = v !== 'exec';
  document.getElementById('view-full').hidden = v !== 'full';
  if (v === 'full') { if (!fullBuilt) { buildFull(); fullBuilt = true; views.full.fit(); } select(selected, pinned ? { pin: true } : null); focusIn('full', pinned); }
  else renderPanel(selected);
  writeHash();
}
let booted = false;
function writeHash() {
  if (!booted) return;
  const hsh = '#' + activeView + (pinned ? '/' + pinned : '') + (activeView === 'full' && isolate && pinned ? '/iso' : '');
  if (location.hash !== hsh) try { history.replaceState(null, '', hsh); } catch (_) {}
}
document.getElementById('tab-exec').addEventListener('click', () => setView('exec'));
document.getElementById('tab-full').addEventListener('click', () => setView('full'));
document.querySelector('.tabs').addEventListener('keydown', ev => {
  if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
  ev.preventDefault(); const nx = activeView === 'exec' ? 'full' : 'exec'; setView(nx); document.getElementById('tab-' + nx).focus();
});
document.addEventListener('keydown', ev => {
  const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName);
  if (ev.key === 'Escape' && !typing) { clearPin(); return; }
  if (typing || activeView !== 'full' || !views.full) return;
  if (ev.key === '/') { ev.preventDefault(); q.focus(); }
  else if (ev.key === '+' || ev.key === '=') views.full.zoom(1.25);
  else if (ev.key === '-') views.full.zoom(0.8);
  else if (ev.key === '0') views.full.fit();
});
document.getElementById('themeBtn').addEventListener('click', () => {
  const c = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nx = c === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = nx;
  try { localStorage.setItem('argus-p4-theme', nx); } catch (_) {}
});
function route() {
  const m = /^#(exec|full)(?:\/(P4-[A-Z]-\d{3}))?(\/iso)?$/.exec(location.hash);
  const v = m ? m[1] : 'exec', id = m && m[2] && N.has(m[2]) ? m[2] : null;
  if (m && m[3]) { isolate = true; document.getElementById('isolate').checked = true; }
  setView(v);
  if (id) { select(id, { pin: true }); if (v === 'full') setTimeout(() => (isolate ? views.full.fitTo(keepSet(id)) : views.full.center(id)), 30); }
}
try { const t = localStorage.getItem('argus-p4-theme'); if (t) document.documentElement.dataset.theme = t; } catch (_) {}
{ const qt = params.get('theme'); if (qt === 'dark' || qt === 'light') document.documentElement.dataset.theme = qt; }

buildExec();
integrity();
select(ROOT);
route(); booted = true; writeHash(); window.addEventListener('hashchange', route);
document.body.dataset.ready = '1';
})();
