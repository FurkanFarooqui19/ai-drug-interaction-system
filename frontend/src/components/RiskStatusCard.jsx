/**
 * Risk Status Card — premium result display.
 * Icon + label + clear hierarchy. No color-alone information.
 * Safe: green | Moderate: amber | Dangerous: red (with pulse ring).
 */
import { CheckCircle, Warning, WarningOctagon, ShieldCheck } from '@phosphor-icons/react'

const RISK_CONFIG = {
  Safe: {
    label: 'No Interaction Found',
    sublabel: 'Safe combination',
    Icon: CheckCircle,
    iconWeight: 'fill',
    primary: '#059669',
    bg: 'var(--color-safe-bg)',
    border: 'var(--color-safe-border)',
    badgeText: 'SAFE',
    badgeBg: 'var(--color-safe-bg)',
    badgeColor: 'var(--color-safe)',
    pulse: false,
  },
  Moderate: {
    label: 'Use With Caution',
    sublabel: 'Moderate interaction risk',
    Icon: Warning,
    iconWeight: 'fill',
    primary: '#d97706',
    bg: 'var(--color-moderate-bg)',
    border: 'var(--color-moderate-border)',
    badgeText: 'MODERATE',
    badgeBg: 'var(--color-moderate-bg)',
    badgeColor: 'var(--color-moderate)',
    pulse: false,
  },
  Dangerous: {
    label: 'Dangerous Interaction',
    sublabel: 'Do not combine without medical supervision',
    Icon: WarningOctagon,
    iconWeight: 'fill',
    primary: '#dc2626',
    bg: 'var(--color-dangerous-bg)',
    border: 'var(--color-dangerous-border)',
    badgeText: 'DANGEROUS',
    badgeBg: 'var(--color-dangerous-bg)',
    badgeColor: 'var(--color-dangerous)',
    pulse: true,
  },
}

export default function RiskStatusCard({ risk }) {
  const c = RISK_CONFIG[risk] || RISK_CONFIG.Safe
  const { Icon } = c

  return (
    <div
      className={`card animate-risk-enter ${c.pulse ? 'animate-pulse-ring' : ''}`}
      style={{
        backgroundColor: c.bg,
        borderColor: c.border,
        borderWidth: '1.5px',
        boxShadow: c.pulse
          ? `var(--shadow-card), 0 0 32px -4px rgba(220,38,38,0.25)`
          : 'var(--shadow-card)',
      }}
      role="status"
      aria-live="polite"
      aria-label={`Interaction risk: ${c.badgeText}`}
    >
      <div className="flex items-center gap-5 px-6 py-6 sm:px-8 sm:py-7">

        {/* Icon container */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-2xl w-16 h-16"
          style={{ backgroundColor: `${c.primary}18`, border: `1.5px solid ${c.primary}30` }}
          aria-hidden="true"
        >
          <Icon size={36} weight={c.iconWeight} color={c.primary} />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          {/* Badge */}
          <span
            className="badge mb-2"
            style={{ backgroundColor: c.badgeBg, color: c.badgeColor, borderColor: c.border }}
          >
            {c.badgeText}
          </span>

          <h2
            className="text-xl sm:text-2xl font-heading font-bold leading-tight"
            style={{ color: c.primary, letterSpacing: '-0.02em' }}
          >
            {c.label}
          </h2>
          <p className="mt-0.5 text-sm font-body" style={{ color: 'var(--color-foreground-muted)' }}>
            {c.sublabel}
          </p>
        </div>
      </div>
    </div>
  )
}
