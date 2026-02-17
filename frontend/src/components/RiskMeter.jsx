/**
 * Visual risk meter / progress bar for demo impact
 */
export default function RiskMeter({ risk }) {
  const value = risk === 'Dangerous' ? 100 : risk === 'Moderate' ? 55 : 0
  const color =
    risk === 'Dangerous'
      ? 'bg-red-500'
      : risk === 'Moderate'
      ? 'bg-amber-500'
      : 'bg-emerald-500'
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
        <span>Risk level</span>
        <span>{risk}</span>
      </div>
      <div className="h-3 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
