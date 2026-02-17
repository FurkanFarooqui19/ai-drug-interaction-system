/**
 * Clinical decision-support: interaction summary, alternatives, duration, safety, disclaimer.
 * Optional patient context (age, disease, symptoms). Shows after check result.
 */
import { useState } from 'react'
import { getClinicalAdvice } from '../api'
import LoadingSpinner from './LoadingSpinner'
import { Card } from './Layout'

export default function ClinicalGuidanceCard({ drugs, severity, onClose }) {
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [age, setAge] = useState('')
  const [disease, setDisease] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const handleGetAdvice = async () => {
    if (!drugs?.length) return
    setError(null)
    setAdvice(null)
    setLoading(true)
    try {
      const data = await getClinicalAdvice({
        drugs,
        severity: severity || 'Safe',
        age: age.trim() || undefined,
        disease: disease.trim() || undefined,
        symptoms: symptoms.trim() || undefined,
      })
      setAdvice(data)
    } catch (err) {
      const msg = err.message || 'Could not load clinical guidance.'
      setError(msg.toLowerCase().includes('not found')
        ? 'Clinical advice service not available. Restart the backend (uvicorn on port 8000) so the /clinical-advice endpoint is loaded, then try again.'
        : msg)
    } finally {
      setLoading(false)
    }
  }

  if (!drugs?.length) return null

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Clinical guidance
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm"
          >
            Dismiss
          </button>
        )}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Get a brief summary, safer alternatives (if applicable), typical duration of use, and safety advice. Optional: add context below for more relevant guidance.
      </p>

      {/* Optional patient context */}
      <div className="space-y-3 mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Optional context (for guidance only)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age (e.g. 45)"
            className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
          <input
            type="text"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            placeholder="Disease / condition"
            className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Relevant symptoms"
            className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
        </div>
      </div>

      {!advice && !loading && (
        <button
          type="button"
          onClick={handleGetAdvice}
          className="w-full py-3 px-4 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition dark:bg-sky-500 dark:hover:bg-sky-600"
        >
          Get clinical guidance
        </button>
      )}

      {loading && (
        <div className="py-8 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {advice && (
        <div className="space-y-5 pt-2">
          <section>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">1. Interaction summary</h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{advice.interaction_summary}</p>
          </section>
          {advice.alternative_options?.length > 0 && (
            <section>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">2. Safer alternative options</h4>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 text-sm space-y-1">
                {advice.alternative_options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">3. Typical duration of use</h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{advice.typical_duration}</p>
          </section>
          <section>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">4. Important safety advice</h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">{advice.safety_advice}</p>
          </section>
          <section className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">{advice.disclaimer}</p>
          </section>
        </div>
      )}
    </Card>
  )
}
