/**
 * Loading spinner for Check Interaction
 */
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
      <div
        className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"
        aria-hidden
      />
      <span className="text-sm font-medium">Checking interactions…</span>
    </div>
  )
}
