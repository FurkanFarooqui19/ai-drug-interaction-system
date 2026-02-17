/**
 * Premium risk meter — gradient fill, thicker bar, severity colors, label.
 */
const METER_CONFIG = {
  Safe: { value: 0, gradient: 'from-emerald-400 to-teal-500', label: 'Low risk' },
  Moderate: { value: 55, gradient: 'from-amber-400 to-orange-500', label: 'Moderate risk' },
  Dangerous: { value: 100, gradient: 'from-red-400 to-rose-500', label: 'High risk' },
}

export default function RiskMeter({ risk }) {
  const m = METER_CONFIG[risk] || METER_CONFIG.Safe
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
        <span>Risk level</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{risk}</span>
      </div>
      <div className="h-3 sm:h-4 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${m.gradient} transition-all duration-700 ease-out`}
          style={{ width: `${m.value}%` }}
          role="progressbar"
          aria-valuenow={m.value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={m.label}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 text-center">{m.label}</p>
    </div>
  )
}
