/**
 * Page layout: max-width container, consistent padding, section spacing.
 */
export default function Layout({ children, className = '', maxWidth = 'max-w-4xl' }) {
  return (
    <div className={`mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 ${maxWidth} ${className}`}>
      {children}
    </div>
  )
}

export function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition dark:border-slate-700/80 dark:bg-slate-800/80 ${className}`}
    >
      {children}
    </div>
  )
}
