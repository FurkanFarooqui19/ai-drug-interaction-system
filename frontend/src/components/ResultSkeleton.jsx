/**
 * Loading skeleton for "Checking interactions…" state — premium look.
 */
export default function ResultSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-slate-200/80 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800/80 animate-pulse">
      <div className="px-8 py-12 text-center">
        <div className="inline-block w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-600 mb-4" />
        <div className="h-4 w-32 mx-auto rounded bg-slate-200 dark:bg-slate-600 mb-2" />
        <div className="h-8 w-40 mx-auto rounded bg-slate-200 dark:bg-slate-600" />
      </div>
      <div className="px-6 pb-6">
        <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-600" />
      </div>
    </div>
  )
}
