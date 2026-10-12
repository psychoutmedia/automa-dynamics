import { getArgusCase } from '../../lib/argusCases'

/* An ARGUS case card: the graph viewer's header, restored as a site component.
   Root claim with its locator, ARGUS's note on it directly beneath (so the claim
   is never read as a safety verdict), the reconstruction finding, and the
   inventory counts with the viewer's own shape key. proof = 'p1' (GPT-6 Astra)
   or 'p2' (Claude Opus 5.5); labels come from lib/argusCases.js. */

const GLYPH = {
  CLAIM: (c) => <rect x="2" y="5" width="18" height="12" rx="1" fill="none" stroke={c} strokeWidth="2" />,
  ARGUMENT: (c) => <path d="M6 5h15l-5 12H1z" fill="none" stroke={c} strokeWidth="2" />,
  EVIDENCE: (c) => <circle cx="11" cy="11" r="7" fill="none" stroke={c} strokeWidth="2" />,
  DEPENDENCY: (c) => <path d="M6 5h10l4 4v4l-4 4H6l-4-4V9z" fill="none" stroke={c} strokeWidth="2" />,
  ASSUMPTION: (c) => <ellipse cx="11" cy="11" rx="9" ry="6" fill="none" stroke={c} strokeWidth="2" />,
  GAP: (c) => <path d="M11 3l8 8-8 8-8-8z" fill="none" stroke={c} strokeWidth="2" />,
}
const COLOUR = {
  CLAIM: '#8FA2F0',
  ARGUMENT: '#4CC3B6',
  EVIDENCE: '#9CCB6A',
  DEPENDENCY: '#C995DA',
  ASSUMPTION: '#6DB4E8',
  GAP: '#F07E5E',
}

export default function ArgusCaseCard({ proof, headingLevel: H = 'h2', className = '' }) {
  const c = getArgusCase(proof)
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden ${className}`}>
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <figure className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/10 border-l-2 border-l-[#8FA2F0]">
          <figcaption className="font-mono text-[0.6875rem] tracking-[0.12em] text-chrome/65 mb-4 uppercase">
            {c.rootLabel}
          </figcaption>
          <blockquote>
            <p className="text-[1.0625rem] md:text-[1.1875rem] leading-snug text-chrome-light mb-5">
              {c.claim}
            </p>
          </blockquote>
          <p className="font-mono text-xs leading-relaxed text-chrome/65 [overflow-wrap:anywhere]">
            {c.citation}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-chrome-light/90">
            <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-[#d9b45e] mr-2">
              {c.noteLabel.toUpperCase()}
            </span>
            {c.note}
          </p>
        </figure>
        <div className="p-6 md:p-8 border-l-2 border-l-[#d9b45e] lg:border-l-0">
          <H className="font-mono text-[0.6875rem] tracking-[0.12em] text-chrome/65 mb-4 uppercase font-normal">
            {c.findingLabel}
          </H>
          <p className="text-[1.0625rem] md:text-[1.125rem] leading-relaxed text-chrome-light">
            {c.finding}
          </p>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2 p-4 md:p-5 border-t border-white/10" aria-label="Inventory">
        {c.counts.map((k) => (
          <li
            key={k.kind}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 ${
              GLYPH[k.kind] ? 'border-white/10' : 'border-dashed border-white/15'
            }`}
          >
            {GLYPH[k.kind] && (
              <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true">
                {GLYPH[k.kind](COLOUR[k.kind])}
              </svg>
            )}
            <span className="font-mono text-base text-chrome-light">{k.n}</span>
            <span className="text-sm text-chrome/65">{k.label}</span>
          </li>
        ))}
      </ul>
      <p className="px-4 md:px-5 pb-4 md:pb-5 text-xs leading-relaxed text-chrome/65">
        Counts are structural inventory, not safety scores. A gap marks a public-assurance link not
        established in the inspected public corpus; it is not evidence that a control is
        ineffective or that private evidence does not exist.
      </p>
    </div>
  )
}
