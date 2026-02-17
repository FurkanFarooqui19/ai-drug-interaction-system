/**
 * Large, judge-impressive risk badge: Safe / Moderate / Dangerous
 */
export default function RiskBadge({ risk }) {
  const config = {
    Safe: {
      label: 'Safe',
      bg: 'bg-emerald-500',
      ring: 'ring-emerald-200',
      text: 'text-white',
      icon: '🟢',
    },
    Moderate: {
      label: 'Moderate',
      bg: 'bg-amber-500',
      ring: 'ring-amber-200',
      text: 'text-white',
      icon: '🟡',
    },
    Dangerous: {
      label: 'Dangerous',
      bg: 'bg-red-500',
      ring: 'ring-red-200',
      text: 'text-white',
      icon: '🔴',
    },
  }
  const c = config[risk] || config.Safe
  return (
    <div
      className={`
        inline-flex items-center gap-3 px-8 py-4 rounded-2xl
        ${c.bg} ${c.text} font-bold text-xl
        ring-4 ${c.ring} shadow-lg transition-transform hover:scale-[1.02]
      `}
    >
      <span className="text-3xl" aria-hidden>{c.icon}</span>
      <span>{c.label}</span>
    </div>
  )
}
