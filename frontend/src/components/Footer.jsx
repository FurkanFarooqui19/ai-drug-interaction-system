/**
 * Professional footer with disclaimer and links.
 */
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Medical disclaimer
            </p>
            <p className="max-w-2xl text-xs text-slate-600 dark:text-slate-500">
              This tool is for informational purposes only and does not replace professional medical advice.
              Always consult your doctor or pharmacist before starting, stopping, or combining medications.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/about" className="text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400">
              About
            </Link>
            <Link to="/drug-info" className="text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400">
              Drug Info
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
          © DrugCheck — AI Drug Interaction Warning System
        </p>
      </div>
    </footer>
  )
}
