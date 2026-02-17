/**
 * Drug Info: list of drugs from API.
 */
import { useState, useEffect } from 'react'
import { fetchDrugList } from '../api'
import Layout, { SectionHeader, Card } from '../components/Layout'

export default function DrugInfoPage() {
  const [drugs, setDrugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchDrugList()
      .then(setDrugs)
      .catch(() => setDrugs([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = drugs.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <SectionHeader
        title="Drug database"
        subtitle="Medicines we can check for interactions"
      />
      <Card className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search drugs</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to filter..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
        />
      </Card>
      <Card>
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 py-10 text-center">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filtered.map((d) => (
              <span
                key={d}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
              >
                {d}
              </span>
            ))}
            {filtered.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400">No drugs match. Is the backend running?</p>
            )}
          </div>
        )}
      </Card>
    </Layout>
  )
}
