/**
 * Redesigned ResultMessageCard — clear hierarchy, left accent, proper sections.
 * Medical warning + AI simple explanation with icon-encoded severity.
 */
import { Warning, CheckCircle, Sparkle } from '@phosphor-icons/react'

const ACCENT = {
  Safe:      { color: '#059669', bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.2)' },
  Moderate:  { color: '#d97706', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.2)' },
  Dangerous: { color: '#dc2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)' },
}

const ICONS = {
  Safe:      CheckCircle,
  Moderate:  Warning,
  Dangerous: Warning,
}

export default function ResultMessageCard({ message, aiExplanation, risk }) {
  const a = ACCENT[risk] || ACCENT.Safe
  const Icon = ICONS[risk] || CheckCircle

  return (
    <div
      className="card animate-risk-enter overflow-hidden"
      style={{ borderLeftWidth: '4px', borderLeftColor: a.color, borderLeftStyle: 'solid' }}
    >
      {/* Interaction summary */}
      <div className="px-6 py-5 sm:px-7" style={{ backgroundColor: a.bg }}>
        <div className="flex gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl mt-0.5"
            style={{ backgroundColor: `${a.color}18` }}
            aria-hidden="true"
          >
            <Icon size={18} weight="fill" color={a.color} />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="text-sm font-semibold font-heading mb-1.5"
              style={{ color: 'var(--color-foreground)' }}
            >
              Interaction summary
            </h3>
            <p
              className="text-sm leading-relaxed font-body"
              style={{ color: 'var(--color-foreground-muted)' }}
            >
              {message}
            </p>
          </div>
        </div>
      </div>

      {/* AI explanation */}
      {aiExplanation && (
        <div
          className="px-6 py-5 sm:px-7"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex gap-3">
            <div
              className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl mt-0.5"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
              aria-hidden="true"
            >
              <Sparkle size={16} weight="fill" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <h4
                className="text-sm font-semibold font-heading mb-1.5"
                style={{ color: 'var(--color-foreground)' }}
              >
                AI explanation
                <span
                  className="ml-2 text-xs font-normal rounded-full px-2 py-0.5"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                >
                  Gemini
                </span>
              </h4>
              <p
                className="text-sm leading-relaxed font-body"
                style={{ color: 'var(--color-foreground-muted)' }}
              >
                {aiExplanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
