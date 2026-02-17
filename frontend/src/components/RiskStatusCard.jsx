/**
 * Hero risk status card — premium centerpiece with gradient, glow, optional pulse.
 * Safe: green | Moderate: amber | Dangerous: red. Dark-mode compatible.
 */
const RISK_CONFIG = {
  Safe: {
    label: 'Safe',
    gradient: 'from-emerald-500 to-teal-600 dark:from-emerald-500 dark:to-emerald-700',
    glow: 'shadow-risk-glow-safe',
    ring: 'ring-emerald-400/50 dark:ring-emerald-400/30',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/5',
    pulse: false,
    icon: '✓',
  },
  Moderate: {
    label: 'Moderate',
    gradient: 'from-amber-500 to-orange-500 dark:from-amber-500 dark:to-amber-600',
    glow: 'shadow-risk-glow-moderate',
    ring: 'ring-amber-400/50 dark:ring-amber-400/30',
    bg: 'bg-amber-500/10 dark:bg-amber-500/5',
    pulse: false,
    icon: '!',
  },
  Dangerous: {
    label: 'Dangerous',
    gradient: 'from-red-500 to-rose-600 dark:from-red-500 dark:to-red-700',
    glow: 'shadow-risk-glow-dangerous',
    ring: 'ring-red-400/50 dark:ring-red-400/30',
    bg: 'bg-red-500/10 dark:bg-red-500/5',
    pulse: true,
    icon: '⚠',
  },
}

export default function RiskStatusCard({ risk }) {
  const c = RISK_CONFIG[risk] || RISK_CONFIG.Safe
  return (
    <div
      className={`
        relative w-full max-w-md mx-auto rounded-3xl overflow-hidden
        border-2 ${c.ring}
        ${c.glow}
        animate-risk-enter
        ${c.pulse ? 'animate-risk-pulse' : ''}
      `}
    >
      {/* Optional: soft gradient background behind content */}
      <div className={`absolute inset-0 ${c.bg}`} aria-hidden />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-90 dark:opacity-95`}
        aria-hidden
      />
      <div className="relative px-8 py-8 sm:px-10 sm:py-10 text-center">
        {/* Glowing status indicator */}
        <div
          className={`
            inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl
            bg-white/20 dark:bg-white/10 backdrop-blur-sm
            border-2 border-white/40
            mb-4
          `}
        >
          <span className="text-3xl sm:text-4xl font-bold text-white drop-shadow-sm" aria-hidden>
            {c.icon}
          </span>
        </div>
        <p className="text-white/90 text-sm sm:text-base font-medium uppercase tracking-widest mb-1">
          Interaction risk
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-sm tracking-tight">
          {c.label}
        </h2>
      </div>
    </div>
  )
}
