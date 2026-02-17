/**
 * Smart result message card — glass style, left accent by severity, clear hierarchy.
 * Replaces/enhances WarningCard for premium result section.
 */
const ACCENT = {
  Safe: 'border-l-emerald-500 dark:border-l-emerald-400',
  Moderate: 'border-l-amber-500 dark:border-l-amber-400',
  Dangerous: 'border-l-red-500 dark:border-l-red-400',
}

export default function ResultMessageCard({ message, aiExplanation, risk }) {
  const isWarning = risk === 'Dangerous' || risk === 'Moderate'
  const accent = ACCENT[risk] || ACCENT.Safe
  return (
    <div
      className={`
        rounded-2xl overflow-hidden
        border border-slate-200/80 dark:border-slate-700/80
        bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
        shadow-lg dark:shadow-glass-dark
        border-l-4 ${accent}
        transition-shadow hover:shadow-xl dark:hover:shadow-xl
        animate-risk-enter
      `}
      style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
    >
      <div
        className={`p-5 sm:p-6 ${
          isWarning
            ? 'bg-amber-50/80 dark:bg-amber-900/15 border-b border-amber-100/80 dark:border-amber-800/30'
            : 'bg-emerald-50/80 dark:bg-emerald-900/15 border-b border-emerald-100/80 dark:border-emerald-800/30'
        }`}
      >
        <div className="flex gap-3">
          {isWarning && (
            <span
              className="shrink-0 w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 text-lg"
              aria-hidden
            >
              ⚠
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Interaction summary
            </h3>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
      {aiExplanation && (
        <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/80">
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Simple explanation
          </h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {aiExplanation}
          </p>
        </div>
      )}
    </div>
  )
}
