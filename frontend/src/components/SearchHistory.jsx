/**
 * Redesigned SearchHistory — clean list with risk badges.
 */
import { ClockCounterClockwise, Trash, ArrowRight } from '@phosphor-icons/react'

const RISK_STYLES = {
  Safe:      { bg: 'var(--color-safe-bg)',      color: 'var(--color-safe)',      border: 'var(--color-safe-border)' },
  Moderate:  { bg: 'var(--color-moderate-bg)',  color: 'var(--color-moderate)',  border: 'var(--color-moderate-border)' },
  Dangerous: { bg: 'var(--color-dangerous-bg)', color: 'var(--color-dangerous)', border: 'var(--color-dangerous-border)' },
}

export default function SearchHistory({ history, onSelect, onClear }) {
  if (!history?.length) return null

  return (
    <div className="card p-5 sm:p-6" aria-label="Recent searches">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClockCounterClockwise size={15} weight="fill" style={{ color: 'var(--color-foreground-subtle)' }} aria-hidden="true" />
          <h3 className="text-sm font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>
            Recent checks
          </h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="btn-ghost flex items-center gap-1.5 text-xs px-2.5 py-1.5"
          aria-label="Clear search history"
        >
          <Trash size={12} weight="bold" aria-hidden="true" />
          Clear
        </button>
      </div>

      <ul className="space-y-2 max-h-52 overflow-y-auto" role="list">
        {history.map((entry, i) => {
          const drugsLabel = entry.drugs.join(', ')
          const risk = entry.risk || 'Safe'
          const rs = RISK_STYLES[risk] || RISK_STYLES.Safe
          return (
            <li key={`${entry.date}-${i}`}>
              <button
                type="button"
                onClick={() => onSelect(entry.drugs)}
                className="w-full text-left px-4 py-3 rounded-xl flex items-center justify-between gap-3 transition-all duration-150"
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'
                }}
                aria-label={`Re-check: ${drugsLabel} — result was ${risk}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <ArrowRight size={13} weight="bold" style={{ color: 'var(--color-foreground-subtle)', flexShrink: 0 }} aria-hidden="true" />
                  <span className="text-sm font-body truncate" style={{ color: 'var(--color-foreground)' }}>
                    {drugsLabel}
                    {entry.fromImage && (
                      <span className="ml-1.5 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>(image)</span>
                    )}
                  </span>
                </div>
                <span
                  className="badge flex-shrink-0 text-xs"
                  style={{ backgroundColor: rs.bg, color: rs.color, borderColor: rs.border }}
                  aria-label={`Risk: ${risk}`}
                >
                  {risk}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
