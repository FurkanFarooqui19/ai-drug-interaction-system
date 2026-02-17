/**
 * Displays recent drug interaction searches. Click an item to re-run the check.
 */
import { getHistory, clearHistory } from '../utils/history'

const riskColors = {
  Safe: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Moderate: 'bg-amber-100 text-amber-800 border-amber-200',
  Dangerous: 'bg-red-100 text-red-800 border-red-200',
}

export default function SearchHistory({ history, onSelect, onClear }) {
  if (!history?.length) return null

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recent searches</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Clear history
        </button>
      </div>
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {history.map((entry, i) => {
          const drugsLabel = entry.drugs.join(', ')
          const risk = entry.risk || 'Safe'
          const riskClass = riskColors[risk] || riskColors.Safe
          return (
            <li key={`${entry.date}-${i}`}>
              <button
                type="button"
                onClick={() => onSelect(entry.drugs)}
                className="w-full text-left rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 px-4 py-3 transition flex items-center justify-between gap-3 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700"
              >
                <span className="text-slate-800 dark:text-slate-200 text-sm truncate flex-1" title={drugsLabel}>
                  {drugsLabel}
                  {entry.fromImage && (
                    <span className="ml-1.5 text-slate-400 dark:text-slate-500 text-xs">(from image)</span>
                  )}
                </span>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-1 rounded-lg border ${riskClass}`}
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
