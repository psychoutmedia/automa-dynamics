import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

/* ARGUS case-card data for both proofs, read at build time from the published
   graph JSONs (the same bytes each explorer embeds). Every field comes from the
   graph except Proof-2's FINDING, which is the executive checklist verbatim. A
   changed graph stops the build instead of publishing a card that disagrees
   with it. */

const FILES = path.join(process.cwd(), 'public', 'safety', 'argus', 'files')

const KINDS = [
  ['CLAIM', 'Claims'],
  ['ARGUMENT', 'Arguments'],
  ['EVIDENCE', 'Evidence'],
  ['DEPENDENCY', 'Dependencies'],
  ['ASSUMPTION', 'Assumptions'],
  ['GAP', 'Gaps'],
]

/* proof2/ARGUS_P2_EXECUTIVE_CHECKLIST.md, "Finding:", verbatim. */
export const P2_FINDING =
  'The release record makes the deployed cyber policy and several bounded robustness results inspectable. It does not independently establish comprehensive coverage, release-snapshot equivalence or robustness of every composite deployment. Reported adverse outcomes materially constrain broader readings.'

const CASES = {
  p1: {
    file: 'ARGUS_P1_ASTRA_GRAPH.json',
    sha: '9960e84ac43e4374ac61a968bc5f9f05ace6eacac5dc83e6f2000dc5f3761871',
    read: (d) => {
      const root = d.nodes.find((n) => n.id === d.root_claim)
      return {
        // Labels as the Proof-1 viewer's own header prints them.
        rootLabel: `Root claim ${root.id} · release assurance`,
        claim: root.claim_text,
        citation: root.source_basis
          .filter((r) => r.role === 'PUBLIC_SOURCE')
          .map((r) => `${r.source_id} ${r.locator}`)
          .join(' · '),
        noteLabel: 'ARGUS register note',
        note: root.notes,
        findingLabel: 'Reconstruction conclusion',
        finding: d.metadata.conclusion,
        kindOf: (n) => n.node_class,
      }
    },
  },
  p2: {
    file: 'ARGUS_P2_ASSURANCE_GRAPH.json',
    sha: 'fd4bfcf389871d36a4466c5665442ac4ab0c2947c29c6b6b1c799a0c8790ac2a',
    read: (d) => {
      const root = d.nodes.find((n) => n.id === d.root_id)
      return {
        rootLabel: `Root claim ${root.id} · ${root.candidate_id} · verbatim publisher`,
        claim: root.statement,
        citation: root.source_refs.map((r) => `${r.source_id} ${r.locator}`).join(' · '),
        noteLabel: 'ARGUS scope',
        note: root.argus_reconstruction,
        findingLabel: 'Reconstruction finding · executive checklist',
        finding: P2_FINDING,
        kindOf: (n) => n.kind,
      }
    },
  },
}

const cache = {}
export function getArgusCase(proof) {
  if (cache[proof]) return cache[proof]
  const spec = CASES[proof]
  if (!spec) throw new Error(`Unknown ARGUS case ${proof}`)
  const raw = fs.readFileSync(path.join(FILES, spec.file))
  const sha = crypto.createHash('sha256').update(raw).digest('hex')
  if (sha !== spec.sha) throw new Error(`ARGUS ${proof} graph sha256 ${sha} differs from ${spec.sha}`)
  const d = JSON.parse(raw.toString('utf8'))
  const { kindOf, ...fields } = spec.read(d)
  cache[proof] = {
    ...fields,
    counts: [
      ...KINDS.map(([kind, label]) => ({ kind, label, n: d.nodes.filter((x) => kindOf(x) === kind).length })),
      { kind: 'REL', label: 'Relationships', n: d.edges.length },
      { kind: 'SRC', label: 'Sources', n: d.sources.length },
    ],
  }
  return cache[proof]
}
