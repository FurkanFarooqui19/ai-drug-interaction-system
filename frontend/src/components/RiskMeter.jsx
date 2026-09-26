/**
 * Risk Meter — segmented progress bar with accessible ARIA.
 * Three segments with clear labels at each marker.
 */

const METER_CONFIG = {
  Safe:      { value: 15,  label: 'Low risk',      color: '#059669', track: 'rgba(5,150,105,0.2)' },
  Moderate:  { value: 55,  label: 'Moderate risk', color: '#d97706', track: 'rgba(217,119,6,0.2)' },
  Dangerous: { value: 100, label: 'High risk',     color: '#dc2626', track: 'rgba(220,38,38,0.2)' },
}

export default function RiskMeter({ risk }) {
  const m = METER_CONFIG[risk] || METER_CONFIG.Safe

  return (
    <div className="card px-6 py-5 sm:px-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="section-label">Risk level</span>
        <span
          className="text-sm font-semibold font-heading"
          style={{ color: m.color }}
        >
          {m.label}
        </span>
      </div>

      {/* Bar track */}
      <div
        className="relative h-3 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${m.value}%`,
            background: `linear-gradient(90deg, ${m.color}99 0%, ${m.color} 100%)`,
          }}
          role="progressbar"
          aria-valuenow={m.value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={m.label}
        />
        {/* Segment markers */}
        {[33, 66].map((pos) => (
          <div
            key={pos}
            className="absolute top-0 h-full w-px"
            style={{ left: `${pos}%`, backgroundColor: 'var(--color-surface)', opacity: 0.7 }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Segment labels */}
      <div className="flex justify-between mt-2" aria-hidden="true">
        {['Safe', 'Moderate', 'Dangerous'].map((seg) => (
          <span
            key={seg}
            className="text-xs font-body"
            style={{ color: 'var(--color-foreground-subtle)' }}
          >
            {seg}
          </span>
        ))}
      </div>
    </div>
  )
}
