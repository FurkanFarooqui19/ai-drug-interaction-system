/**
 * Redesigned result skeleton — loading shimmer placeholder.
 */
export default function ResultSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {/* Risk status skeleton */}
      <div
        className="rounded-[var(--radius-xl)] p-6 flex items-center gap-4"
        style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)' }}
      >
        <div className="skeleton w-16 h-16 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-7 w-48 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
      </div>

      {/* Risk meter skeleton */}
      <div
        className="rounded-[var(--radius-xl)] p-6"
        style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex justify-between mb-3">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="skeleton h-3 w-full rounded-full" />
      </div>

      {/* Message card skeleton */}
      <div
        className="rounded-[var(--radius-xl)] p-6 space-y-3"
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-border-strong)',
        }}
      >
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
    </div>
  )
}
