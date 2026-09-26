/**
 * Redesigned ClinicalGuidanceCard — clean sections, accessible inputs.
 */
import { useState } from 'react'
import { getClinicalAdvice } from '../api'
import {
  FirstAidKit, CaretDown, CaretUp, ListChecks, Clock, Pill, Book, Warning,
} from '@phosphor-icons/react'

export default function ClinicalGuidanceCard({ drugs, severity, onClose }) {
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [age, setAge] = useState('')
  const [disease, setDisease] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [contextOpen, setContextOpen] = useState(false)

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
      setError(
        msg.toLowerCase().includes('not found')
          ? 'Clinical advice endpoint not found. Restart the backend with uvicorn on port 8000.'
          : msg
      )
    } finally {
      setLoading(false)
    }
  }

  if (!drugs?.length) return null

  const SECTIONS = advice ? [
    { label: 'Interaction summary', icon: Book, content: advice.interaction_summary },
    { label: 'Typical duration', icon: Clock, content: advice.typical_duration },
    { label: 'Safety advice', icon: ListChecks, content: advice.safety_advice },
  ] : []

  return (
    <div
      className="card overflow-hidden"
      aria-label="Clinical guidance"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5 sm:px-7"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
            aria-hidden="true"
          >
            <FirstAidKit size={16} weight="fill" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3
            className="font-semibold font-heading"
            style={{ fontSize: '0.9375rem', color: 'var(--color-foreground)' }}
          >
            Clinical Guidance
          </h3>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="btn-ghost text-xs px-3 py-1.5">
            Dismiss
          </button>
        )}
      </div>

      <div className="px-6 py-5 sm:px-7 space-y-5">
        <p className="text-sm font-body" style={{ color: 'var(--color-foreground-muted)' }}>
          Get a clinical summary, safer alternatives (if applicable), typical duration, and safety advice for this combination.
        </p>

        {/* Optional context toggle */}
        <div>
          <button
            type="button"
            onClick={() => setContextOpen((o) => !o)}
            className="flex items-center gap-2 text-sm font-semibold font-heading transition-colors"
            style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-expanded={contextOpen}
            aria-controls="clinical-context-fields"
          >
            {contextOpen ? <CaretUp size={14} weight="bold" aria-hidden="true" /> : <CaretDown size={14} weight="bold" aria-hidden="true" />}
            Add patient context (optional)
          </button>

          {contextOpen && (
            <div
              id="clinical-context-fields"
              className="mt-3 p-4 rounded-xl space-y-3 animate-fade-in"
              style={{
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p className="section-label mb-1">Optional context — improves guidance relevance</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: age, set: setAge, placeholder: 'Age (e.g. 45)', label: 'Patient age', id: 'ctx-age' },
                  { value: disease, set: setDisease, placeholder: 'Condition (e.g. Hypertension)', label: 'Disease / condition', id: 'ctx-disease' },
                  { value: symptoms, set: setSymptoms, placeholder: 'Symptoms', label: 'Symptoms', id: 'ctx-symptoms' },
                ].map(({ value, set, placeholder, label, id }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-xs font-body mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>
                      {label}
                    </label>
                    <input
                      id={id}
                      type="text"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      className="input-field text-sm py-2.5"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {!advice && !loading && (
          <button
            type="button"
            onClick={handleGetAdvice}
            className="btn-secondary w-full py-3"
          >
            <FirstAidKit size={16} weight="fill" aria-hidden="true" />
            Get Clinical Guidance
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-8" aria-busy="true" aria-label="Loading clinical guidance">
            <span className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }}
              aria-hidden="true"
            />
            <span className="text-sm font-body" style={{ color: 'var(--color-foreground-muted)' }}>
              Getting clinical guidance from AI…
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2.5 p-4 rounded-xl text-sm font-body"
            role="alert"
            style={{
              backgroundColor: 'var(--color-dangerous-bg)',
              border: '1px solid var(--color-dangerous-border)',
              color: 'var(--color-dangerous)',
            }}
          >
            <Warning size={16} weight="fill" className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Results */}
        {advice && (
          <div className="space-y-5 animate-fade-in">
            {/* Alternative options */}
            {advice.alternative_options?.length > 0 && (
              <section
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-safe-bg)',
                  border: '1px solid var(--color-safe-border)',
                }}
                aria-labelledby="alt-options-heading"
              >
                <h4
                  id="alt-options-heading"
                  className="flex items-center gap-2 text-sm font-semibold font-heading mb-2"
                  style={{ color: 'var(--color-safe)' }}
                >
                  <Pill size={14} weight="fill" aria-hidden="true" />
                  Safer alternative options
                </h4>
                <ul className="space-y-1.5">
                  {advice.alternative_options.map((opt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-body"
                      style={{ color: 'var(--color-foreground-muted)' }}
                    >
                      <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-safe)' }} aria-hidden="true" />
                      {opt}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Content sections */}
            {SECTIONS.map(({ label, icon: Icon, content }) => content && (
              <section key={label} aria-labelledby={`section-${label.toLowerCase().replace(/\s/g, '-')}`}>
                <h4
                  id={`section-${label.toLowerCase().replace(/\s/g, '-')}`}
                  className="flex items-center gap-2 text-sm font-semibold font-heading mb-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  <Icon size={14} weight="fill" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                  {label}
                </h4>
                <p
                  className="text-sm font-body leading-relaxed whitespace-pre-line"
                  style={{ color: 'var(--color-foreground-muted)' }}
                >
                  {content}
                </p>
              </section>
            ))}

            {/* Disclaimer */}
            {advice.disclaimer && (
              <p
                className="text-xs font-body italic pt-3"
                style={{
                  color: 'var(--color-foreground-subtle)',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '12px',
                }}
              >
                {advice.disclaimer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
