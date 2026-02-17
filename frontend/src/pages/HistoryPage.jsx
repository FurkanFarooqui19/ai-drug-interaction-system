/**
 * History: table of past checks with risk chips and search.
 */
import { useState, useEffect } from 'react'
import { getHistory } from '../utils/history'
import Layout, { SectionHeader, Card } from '../components/Layout'

const riskClass = {
  Safe: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Moderate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Dangerous: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const filtered = history.filter((entry) =>
    entry.drugs.some((d) => d.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Layout>
      <SectionHeader
        title="Check history"
        subtitle="Your recent drug interaction checks"
      />
      <Card className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by drug name..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
        />
      </Card>
      <Card>
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-10">
            {history.length === 0 ? 'No checks yet. Use the checker on Home.' : 'No matches for your search.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Medicines</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Risk</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/80">
                    <td className="py-3 px-2 text-slate-800 dark:text-slate-200">
                      {entry.drugs.join(', ')}
                      {entry.fromImage && <span className="text-slate-400 dark:text-slate-500 text-xs ml-1">(image)</span>}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-1 rounded-lg font-medium ${riskClass[entry.risk] || riskClass.Safe}`}>
                        {entry.risk}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500 dark:text-slate-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Layout>
  )
}
