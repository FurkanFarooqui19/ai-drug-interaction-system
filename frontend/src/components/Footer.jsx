/**
 * Redesigned Footer — professional healthcare footer with prominent disclaimer.
 */
import { Link } from 'react-router-dom'
import { ShieldCheck, Info } from '@phosphor-icons/react'

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      {/* Medical disclaimer — prominent */}
      <div
        className="px-4 py-4 sm:px-6"
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="mx-auto max-w-6xl flex items-start gap-3">
          <Info
            size={16}
            weight="bold"
            aria-hidden="true"
            className="flex-shrink-0 mt-0.5"
            style={{ color: 'var(--color-primary)' }}
          />
          <p className="text-xs leading-relaxed font-body" style={{ color: 'var(--color-foreground-muted)' }}>
            <strong className="font-semibold" style={{ color: 'var(--color-foreground)' }}>Medical Disclaimer: </strong>
            This tool is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment.
            Always consult your doctor or pharmacist before starting, stopping, or combining medications.
          </p>
        </div>
      </div>

      {/* Footer links */}
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg overflow-hidden flex-shrink-0"
              aria-hidden="true"
            >
              <img src="/logo.jpg" alt="" className="w-full h-full object-cover" width={28} height={28} />
            </div>
            <span
              className="text-sm font-semibold font-heading"
              style={{ color: 'var(--color-foreground)' }}
            >
              DrugCheck
            </span>
            <span className="text-xs font-body" style={{ color: 'var(--color-foreground-subtle)' }}>
              · AI Drug Interaction System
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
            {[
              { to: '/about', label: 'About' },
              { to: '/drug-info', label: 'Drug Info' },
              { to: '/history', label: 'History' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-body transition-colors"
                style={{ color: 'var(--color-foreground-muted)', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.target.style.color = 'var(--color-primary)' }}
                onMouseLeave={(e) => { e.target.style.color = 'var(--color-foreground-muted)' }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <p
          className="mt-4 text-xs font-body text-center"
          style={{ color: 'var(--color-foreground-subtle)' }}
        >
          © {new Date().getFullYear()} DrugCheck — For educational and informational use only.
        </p>
      </div>
    </footer>
  )
}
