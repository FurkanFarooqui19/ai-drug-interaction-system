/**
 * Layout — shared page container.
 * Card now uses CSS design tokens.
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
      <h2
        className="font-heading font-bold text-2xl sm:text-3xl"
        style={{ color: 'var(--color-foreground)', letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm font-body" style={{ color: 'var(--color-foreground-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

/** Card: consistent elevated surface using design token. */
export function Card({ children, className = '' }) {
  return (
    <div className={`card p-6 ${className}`}>
      {children}
    </div>
  )
}
