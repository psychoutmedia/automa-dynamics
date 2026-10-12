import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

/* ARGUS Proof-2 case-card data, read at build time from the published graph
   JSON (the same bytes the explorer embeds). Nothing here is retyped except
   FINDING, which is the executive checklist's finding verbatim. A changed
   graph stops the build rather than publishing a card that disagrees with it. */

const GRAPH = path.join(process.cwd(), 'public', 'safety', 'argus', 'files', 'ARGUS_P2_ASSURANCE_GRAPH.json')
export const P2_SHA = 'fd4bfcf389871d36a4466c5665442ac4ab0c2947c29c6b6b1c799a0c8790ac2a'

/* proof2/ARGUS_P2_EXECUTIVE_CHECKLIST.md, "Finding:", verbatim. */
export const FINDING =
  'The release record makes the deployed cyber policy and several bounded robustness results inspectable. It does not independently establish comprehensive coverage, release-snapshot equivalence or robustness of every composite deployment. Reported adverse outcomes materially constrain broader readings.'

const KINDS = [
  ['CLAIM', 'Claims'],
  ['ARGUMENT', 'Arguments'],
  ['EVIDENCE', 'Evidence'],
  ['DEPENDENCY', 'Dependencies'],
  ['ASSUMPTION', 'Assumptions'],
  ['GAP', 'Gaps'],
]

let cached
export function getP2Case() {
  if (cached) return cached
  const raw = fs.readFileSync(GRAPH)
  const sha = crypto.createHash('sha256').update(raw).digest('hex')
  if (sha !== P2_SHA) throw new Error(`ARGUS P2 graph sha256 ${sha} differs from ${P2_SHA}`)
  const d = JSON.parse(raw.toString('utf8'))
  const root = d.nodes.find((n) => n.id === d.root_id)
  cached = {
    rootId: root.id,
    candidateId: root.candidate_id,
    claim: root.statement,
    citation: root.source_refs.map((r) => `${r.source_id} ${r.locator}`).join(' · '),
    scope: root.argus_reconstruction,
    counts: [
      ...KINDS.map(([kind, label]) => ({ kind, label, n: d.nodes.filter((x) => x.kind === kind).length })),
      { kind: 'REL', label: 'Relationships', n: d.edges.length },
      { kind: 'SRC', label: 'Sources', n: d.sources.length },
    ],
    nodes: d.nodes.length,
    edges: d.edges.length,
  }
  return cached
}
