/**
 * Analytics: stat cards + simple chart (Recharts).
 */
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getHistory } from '../utils/history'
import Layout, { SectionHeader, Card } from '../components/Layout'

export default function AnalyticsPage() {
  const history = useMemo(() => getHistory(), [])

  const stats = useMemo(() => {
    const safe = history.filter((e) => e.risk === 'Safe').length
    const moderate = history.filter((e) => e.risk === 'Moderate').length
    const dangerous = history.filter((e) => e.risk === 'Dangerous').length
    return [
      { label: 'Total checks', value: history.length, color: 'text-sky-600 dark:text-sky-400' },
      { label: 'Safe', value: safe, color: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Moderate', value: moderate, color: 'text-amber-600 dark:text-amber-400' },
      { label: 'Dangerous', value: dangerous, color: 'text-red-600 dark:text-red-400' },
    ]
  }, [history])

  const chartData = useMemo(() => [
    { name: 'Safe', count: history.filter((e) => e.risk === 'Safe').length },
    { name: 'Moderate', count: history.filter((e) => e.risk === 'Moderate').length },
    { name: 'Dangerous', count: history.filter((e) => e.risk === 'Dangerous').length },
  ], [history])

  return (
    <Layout>
      <SectionHeader
        title="Analytics"
        subtitle="Overview of your interaction checks"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Risk distribution</h3>
        {history.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 py-8 text-center">No data yet. Run some checks on Home.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ color: '#0f172a' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </Layout>
  )
}
