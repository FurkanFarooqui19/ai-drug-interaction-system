/**
 * Warning message card with optional AI explanation section. Dark-mode aware.
 */
export default function WarningCard({ message, aiExplanation, risk }) {
  const isWarning = risk === 'Dangerous' || risk === 'Moderate'
  return (
    <div className="rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm dark:border-slate-700/80 bg-white dark:bg-slate-800/80">
      <div className={`p-5 ${isWarning ? 'bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/50' : 'bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800/50'}`}>
        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{message}</p>
      </div>
      {aiExplanation && (
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Simple explanation</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{aiExplanation}</p>
        </div>
      )}
    </div>
  )
}
