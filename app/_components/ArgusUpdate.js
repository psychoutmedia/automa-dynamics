/* The ARGUS Proof-1.1 finding, as one card. Used on the home page and on
   /safety/argus so the two never disagree. The counts are the P1.1 gap
   classifications from ARGUS_P11_DELTA.json; if a later proof changes them,
   change them here. They are link judgements, not safety scores, and the card
   says so. */

export const ARGUS_UPDATE_HREF = '/safety/argus/proof-1#delta'

const tiles = [
  ['0', 'Publicly resolved', 'text-[#d9b45e]'],
  ['3', 'Partially narrowed', 'text-chrome-light'],
  ['1', 'More constrained', 'text-chrome-light'],
  ['5', 'Unchanged', 'text-chrome-light'],
]

export default function ArgusUpdate({ className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-[#d9b45e]/30 bg-white/[0.02] p-6 md:p-10 text-left ${className}`}
    >
      <p className="font-mono text-xs tracking-[0.12em] text-[#d9b45e] mb-5">
        UPDATE &middot; 9 OCTOBER 2026 &middot; PROOF-1.1
      </p>
      <p className="text-[1.5rem] md:text-[2rem] leading-tight tracking-[-0.01em] text-chrome-light max-w-[34rem] mb-5">
        Five weeks on, none of the nine gaps is publicly resolved.
      </p>
      <p className="type-body max-w-[44rem] mb-8">
        We re-checked every gap from the 3 September evidence cutoff against the public record on
        9 October: the revised system card, UK AISI's blog post and technical report, and two Apollo
        Research posts. Some links are narrower. None is closed.
      </p>
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10 mb-8">
        {tiles.map(([n, label, tone]) => (
          <div key={label} className="bg-[#050a18] px-5 py-4">
            <dt className="sr-only">{label}</dt>
            <dd className={`font-mono text-3xl md:text-4xl ${tone}`}>{n}</dd>
            <dd className="text-sm text-chrome/65 mt-1">{label}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <a
          href={ARGUS_UPDATE_HREF}
          className="btn-primary inline-flex items-center justify-center gap-2 !px-5 sm:!px-8"
        >
          See what changed <span aria-hidden="true">&rarr;</span>
        </a>
        <p className="text-sm text-chrome/65">
          Public-evidence link judgements, not safety scores.
        </p>
      </div>
    </div>
  )
}
