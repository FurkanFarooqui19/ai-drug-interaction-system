/**
 * Analytics Page — premium healthcare dashboard.
 * Beautiful stat cards, donut chart, bar chart, activity timeline.
 * All data from localStorage history. No-data empty state with demo preview.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar,
} from 'recharts'
import { getHistory } from '../utils/history'
import {
  ChartBar, ShieldCheck, Warning, CheckCircle,
  WarningOctagon, ArrowRight, Pill, CalendarBlank,
  TrendUp, Camera,
} from '@phosphor-icons/react'

/* ---- Design tokens ---- */
const C = {
  safe:      '#059669',
  moderate:  '#d97706',
  dangerous: '#dc2626',
  primary:   '#0891B2',
  neutral:   '#64748b',
}

/* ---- Custom tooltip ---- */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-4 py-3 rounded-xl text-sm font-body"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--color-foreground)',
      }}
    >
      {label && <p className="font-semibold font-heading mb-1" style={{ color: 'var(--color-foreground)' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.color || C.primary }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

/* ---- Stat card ---- */
function StatCard({ icon: Icon, label, value, color, sub, trend }) {
  return (
    <div
      className="card p-5 flex items-start gap-4"
      aria-label={`${label}: ${value}`}
    >
      <div
        className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
        style={{ backgroundColor: `${color}18`, border: `1.5px solid ${color}25` }}
        aria-hidden="true"
      >
        <Icon size={22} weight="fill" color={color} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold section-label mb-1">{label}</p>
        <p
          className="text-3xl font-bold font-heading leading-none"
          style={{ color: 'var(--color-foreground)', letterSpacing: '-0.03em' }}
        >
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-xs font-body" style={{ color: 'var(--color-foreground-subtle)' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

/* ---- Activity timeline entry ---- */
function TimelineEntry({ entry, i }) {
  const RISK_CFG = {
    Safe:      { color: C.safe,      Icon: CheckCircle,    bg: 'rgba(5,150,105,0.08)' },
    Moderate:  { color: C.moderate,  Icon: Warning,        bg: 'rgba(217,119,6,0.08)' },
    Dangerous: { color: C.dangerous, Icon: WarningOctagon, bg: 'rgba(220,38,38,0.08)' },
  }
  const cfg = RISK_CFG[entry.risk] || RISK_CFG.Safe
  const { Icon } = cfg
  const date = new Date(entry.date)
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' })

  return (
    <div
      className="flex items-start gap-3 px-5 py-4 transition-colors"
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--color-surface-raised)',
      }}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5"
        style={{ backgroundColor: cfg.bg }}
        aria-hidden="true"
      >
        <Icon size={16} weight="fill" color={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium font-body truncate" style={{ color: 'var(--color-foreground)' }}>
          {entry.drugs.join(' + ')}
          {entry.fromImage && (
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full align-middle"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              📷 Image
            </span>
          )}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="badge text-[10px] px-2 py-0.5"
            style={{
              backgroundColor: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.color}30`,
            }}
          >
            {entry.risk}
          </span>
          <span className="text-xs font-body" style={{ color: 'var(--color-foreground-subtle)' }}>
            {dateStr} · {timeStr}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ---- Custom legend for donut ---- */
function DonutLegend({ data }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} aria-hidden="true" />
          <span className="text-xs font-body" style={{ color: 'var(--color-foreground-muted)' }}>
            {d.name} <strong style={{ color: 'var(--color-foreground)' }}>{d.value}</strong>
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---- Empty state ---- */
function EmptyState() {
  return (
    <div className="card py-16 px-8 text-center">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-5"
        style={{ backgroundColor: 'var(--color-primary-light)', border: '1.5px solid rgba(8,145,178,0.15)' }}
        aria-hidden="true"
      >
        <ChartBar size={32} weight="light" style={{ color: 'var(--color-primary)' }} />
      </div>
      <h2
        className="text-xl font-bold font-heading mb-2"
        style={{ color: 'var(--color-foreground)', letterSpacing: '-0.02em' }}
      >
        No data yet
      </h2>
      <p
        className="text-sm font-body max-w-xs mx-auto mb-6"
        style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.7 }}
      >
        Run some drug interaction checks on the home page to populate your analytics dashboard.
      </p>
      <Link
        to="/"
        className="btn-primary inline-flex text-sm px-5 py-2.5"
        style={{ textDecoration: 'none' }}
      >
        <Pill size={15} weight="fill" aria-hidden="true" />
        Go to Checker
        <ArrowRight size={14} weight="bold" aria-hidden="true" />
      </Link>
    </div>
  )
}

/* ===============================================
   MAIN COMPONENT
   =============================================== */
export default function AnalyticsPage() {
  const history = useMemo(() => getHistory(), [])

  const counts = useMemo(() => ({
    total:     history.length,
    safe:      history.filter((e) => e.risk === 'Safe').length,
    moderate:  history.filter((e) => e.risk === 'Moderate').length,
    dangerous: history.filter((e) => e.risk === 'Dangerous').length,
    fromImage: history.filter((e) => e.fromImage).length,
  }), [history])

  /* Donut data */
  const donutData = useMemo(() => [
    { name: 'Safe',      value: counts.safe,      fill: C.safe },
    { name: 'Moderate',  value: counts.moderate,  fill: C.moderate },
    { name: 'Dangerous', value: counts.dangerous, fill: C.dangerous },
  ].filter((d) => d.value > 0), [counts])

  /* Drug frequency analysis */
  const drugFreq = useMemo(() => {
    const freq = {}
    history.forEach((entry) => {
      entry.drugs.forEach((drug) => {
        freq[drug] = (freq[drug] || 0) + 1
      })
    })
    return Object.entries(freq)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [history])

  /* Daily checks over last 7 days */
  const dailyData = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString([], { weekday: 'short' })
      const dateStr = d.toISOString().slice(0, 10)
      const checks = history.filter((e) => e.date.startsWith(dateStr)).length
      days.push({ day: key, checks })
    }
    return days
  }, [history])

  /* Safe rate */
  const safeRate = counts.total > 0 ? Math.round((counts.safe / counts.total) * 100) : 0

  if (history.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10" aria-label="Analytics dashboard">

      {/* ---- Page header ---- */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <ChartBar size={20} weight="fill" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
          <h1
            className="text-2xl sm:text-3xl font-bold font-heading"
            style={{ color: 'var(--color-foreground)', letterSpacing: '-0.025em' }}
          >
            Analytics
          </h1>
        </div>
        <p className="text-sm font-body" style={{ color: 'var(--color-foreground-muted)' }}>
          Insights from your {counts.total} drug interaction {counts.total === 1 ? 'check' : 'checks'}
        </p>
      </div>

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={ShieldCheck}
          label="Total Checks"
          value={counts.total}
          color={C.primary}
          sub="all time"
        />
        <StatCard
          icon={CheckCircle}
          label="Safe"
          value={counts.safe}
          color={C.safe}
          sub={counts.total > 0 ? `${safeRate}% of checks` : '—'}
        />
        <StatCard
          icon={Warning}
          label="Moderate"
          value={counts.moderate}
          color={C.moderate}
          sub={counts.total > 0 ? `${Math.round((counts.moderate/counts.total)*100)}%` : '—'}
        />
        <StatCard
          icon={WarningOctagon}
          label="Dangerous"
          value={counts.dangerous}
          color={C.dangerous}
          sub={counts.total > 0 ? `${Math.round((counts.dangerous/counts.total)*100)}%` : '—'}
        />
      </div>

      {/* ---- Charts row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Donut chart */}
        <div className="card p-6" aria-label="Risk distribution donut chart">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>
                Risk distribution
              </h2>
              <p className="text-xs font-body mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>
                Breakdown of all checks
              </p>
            </div>
            {/* Safe rate badge */}
            <span
              className="badge text-xs px-3 py-1.5"
              style={{ backgroundColor: 'var(--color-safe-bg)', color: C.safe, border: `1px solid ${C.safe}30` }}
            >
              {safeRate}% safe
            </span>
          </div>

          {donutData.length > 0 ? (
            <>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <DonutLegend data={donutData} />
            </>
          ) : (
            <div className="h-48 flex items-center justify-center" style={{ color: 'var(--color-foreground-subtle)' }}>
              <p className="text-sm font-body">No data yet</p>
            </div>
          )}
        </div>

        {/* Daily activity bar chart */}
        <div className="card p-6" aria-label="Daily activity chart - checks per day">
          <div className="mb-5">
            <h2 className="text-base font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>
              Daily activity
            </h2>
            <p className="text-xs font-body mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>
              Checks over last 7 days
            </p>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} barSize={28}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: 'var(--color-foreground-subtle)', fontFamily: 'Noto Sans' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: 'var(--color-foreground-subtle)', fontFamily: 'Noto Sans' }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-raised)', radius: 6 }} />
                <Bar dataKey="checks" name="Checks" fill={C.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ---- Most checked drugs ---- */}
      {drugFreq.length > 0 && (
        <div className="card p-6 mb-6" aria-label="Most checked drugs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>
                Most checked drugs
              </h2>
              <p className="text-xs font-body mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>
                How often each drug appears in your checks
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {drugFreq.map((drug, i) => {
              const max = drugFreq[0].count
              const pct = Math.round((drug.count / max) * 100)
              const colors = [C.primary, C.safe, C.moderate, '#8b5cf6', '#06b6d4', '#ec4899']
              const color = colors[i % colors.length]
              return (
                <div key={drug.name} className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold font-body w-4 text-right flex-shrink-0"
                    style={{ color: 'var(--color-foreground-subtle)' }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm font-body w-28 flex-shrink-0 truncate"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {drug.name}
                  </span>
                  <div
                    className="flex-1 rounded-full overflow-hidden"
                    style={{ height: 8, backgroundColor: 'var(--color-border)' }}
                    role="progressbar"
                    aria-valuenow={drug.count}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-label={`${drug.name}: ${drug.count} checks`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold font-body w-8 text-right flex-shrink-0"
                    style={{ color }}
                  >
                    {drug.count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ---- Activity timeline ---- */}
      <div className="card overflow-hidden" aria-label="Recent activity timeline">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div>
            <h2 className="text-base font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>
              Recent activity
            </h2>
            <p className="text-xs font-body mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>
              Last {Math.min(history.length, 10)} checks
            </p>
          </div>
          {counts.fromImage > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-body" style={{ color: 'var(--color-foreground-subtle)' }}>
              <Camera size={13} weight="fill" aria-hidden="true" />
              {counts.fromImage} from image
            </div>
          )}
        </div>

        <div role="list">
          {history.slice(0, 10).map((entry, i) => (
            <div key={`${entry.date}-${i}`} role="listitem">
              <TimelineEntry entry={entry} i={i} />
            </div>
          ))}
        </div>

        {history.length > 10 && (
          <div
            className="px-6 py-4 text-center"
            style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}
          >
            <p className="text-xs font-body" style={{ color: 'var(--color-foreground-subtle)' }}>
              Showing 10 of {history.length} entries
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
