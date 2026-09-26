/**
 * Redesigned LoadingSpinner — accessible, minimal.
 */
export default function LoadingSpinner({ size = 24, label = 'Loading…' }) {
  return (
    <div
      className="flex items-center justify-center gap-3"
      role="status"
      aria-label={label}
    >
      <span
        className="inline-block rounded-full animate-spin"
        style={{
          width: size,
          height: size,
          border: '2.5px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
        }}
        aria-hidden="true"
      />
      <span className="text-sm font-body" style={{ color: 'var(--color-foreground-muted)' }}>
        {label}
      </span>
    </div>
  )
}
