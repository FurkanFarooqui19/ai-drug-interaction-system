/**
 * Redesigned HomePage — premium healthcare SaaS interface.
 * Hero → Drug Input → Check CTA → Results → Clinical Guidance
 */
import { useState, useEffect, useRef } from 'react'
import { checkInteractions, checkFromImage, fetchDrugList } from '../api'
import { getHistory, addToHistory, clearHistory } from '../utils/history'
import DrugInput from '../components/DrugInput'
import VoiceInputButton from '../components/VoiceInputButton'
import ImageUpload from '../components/ImageUpload'
import SearchHistory from '../components/SearchHistory'
import RiskStatusCard from '../components/RiskStatusCard'
import ResultMessageCard from '../components/ResultMessageCard'
import RiskMeter from '../components/RiskMeter'
import ResultSkeleton from '../components/ResultSkeleton'
import ClinicalGuidanceCard from '../components/ClinicalGuidanceCard'
import {
  ShieldCheck, ArrowRight, Flask,
  Image as ImageIcon, Warning, Pill, Info, Seal,
} from '@phosphor-icons/react'

const EXAMPLE_COMBOS = [
  { drugs: ['Warfarin', 'Aspirin'], label: 'Warfarin + Aspirin', risk: 'Dangerous', note: 'Major bleeding risk' },
  { drugs: ['Aspirin', 'Ibuprofen'], label: 'Aspirin + Ibuprofen', risk: 'Dangerous', note: 'Increased GI risk' },
  { drugs: ['Paracetamol', 'Ibuprofen'], label: 'Paracetamol + Ibuprofen', risk: 'Moderate', note: 'Moderate interaction' },
  { drugs: ['Amoxicillin', 'Paracetamol'], label: 'Amoxicillin + Paracetamol', risk: 'Safe', note: 'No known interaction' },
]

const RISK_DOT = {
  Safe:      { bg: 'var(--color-safe)',      text: 'var(--color-safe)' },
  Moderate:  { bg: 'var(--color-moderate)',  text: 'var(--color-moderate)' },
  Dangerous: { bg: 'var(--color-dangerous)', text: 'var(--color-dangerous)' },
}

export default function HomePage({ scrollToImageSection }) {
  const imageSectionRef = useRef(null)
  const resultsRef = useRef(null)
  const [drugInput, setDrugInput] = useState('')
  const [drugSuggestions, setDrugSuggestions] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [result, setResult] = useState(null)
  const [lastCheckedDrugs, setLastCheckedDrugs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('text') // 'text' | 'image'

  useEffect(() => {
    fetchDrugList().then(setDrugSuggestions).catch(() => setDrugSuggestions([]))
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    if (!scrollToImageSection) return
    const t = setTimeout(() => {
      setActiveTab('image')
      imageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
    return () => clearTimeout(t)
  }, [scrollToImageSection])

  // Scroll to results after check
  useEffect(() => {
    if (result && !loading) {
      const t = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(t)
    }
  }, [result, loading])

  const handleCheck = async () => {
    const drugs = drugInput.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    setError(null)
    setResult(null)
    if (drugs.length < 2) {
      setError('Please enter at least two drug names to check for interactions.')
      return
    }
    setLoading(true)
    try {
      const data = await checkInteractions(drugs)
      setResult(data)
      setLastCheckedDrugs(drugs)
      addToHistory(drugs, data.risk)
      setHistory(getHistory())
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckFromImage = async () => {
    if (!imageFile) { setError('Please upload an image first.'); return }
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const data = await checkFromImage(imageFile)
      setResult(data)
      const drugs = data.detected_drugs?.length >= 2 ? data.detected_drugs : null
      if (drugs) { setLastCheckedDrugs(drugs); addToHistory(drugs, data.risk, true); setHistory(getHistory()) }
      else if (data.detected_drugs?.length) setLastCheckedDrugs(data.detected_drugs)
    } catch (err) {
      setError(err.message || 'Could not process image. Ensure GEMINI_API_KEY is set in backend .env')
    } finally {
      setLoading(false)
    }
  }

  const handleHistorySelect = (drugs) => {
    setDrugInput(drugs.join(', '))
    setError(null)
    setResult(null)
    if (drugs.length >= 2) {
      setLoading(true)
      checkInteractions(drugs)
        .then((data) => { setResult(data); addToHistory(drugs, data.risk); setHistory(getHistory()) })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }

  const hasResult = result && !loading
  const emptyState = !hasResult && !loading && !error

  return (
    <>
      {/* ======================================================
          HERO SECTION
          ====================================================== */}
      <section
        className="py-12 sm:py-16 px-4"
        style={{ background: 'var(--color-primary)' }}
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Shield icon */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            aria-hidden="true"
          >
            <ShieldCheck size={32} weight="fill" color="#fff" />
          </div>

          <h1
            id="hero-heading"
            className="font-heading font-bold text-white mb-3"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.025em', lineHeight: 1.2 }}
          >
            Drug Interaction Checker
          </h1>
          <p
            className="font-body text-white max-w-xl mx-auto mb-6"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', opacity: 0.85, lineHeight: 1.6 }}
          >
            Enter your medicines to instantly check for dangerous combinations.
            Powered by clinical data and Gemini AI.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4" aria-label="Key features">
            {[
              { icon: Seal, text: 'Clinical data' },
              { icon: Pill, text: 'Drug autocomplete' },
              { icon: ShieldCheck, text: 'AI explanations' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 text-sm font-body"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                <Icon size={14} weight="fill" color="rgba(255,255,255,0.7)" aria-hidden="true" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}
      <main
        className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10"
        id="main-content"
        aria-label="Drug interaction checker"
      >
        {/* ---- Input Card ---- */}
        <div
          className="card p-6 sm:p-8 mb-6"
          role="search"
          aria-label="Drug interaction search"
        >
          {/* Tab switcher */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl mb-6"
            style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)' }}
            role="tablist"
            aria-label="Input method"
          >
            {[
              { id: 'text', label: 'Drug names', icon: Pill },
              { id: 'image', label: 'Scan image', icon: ImageIcon },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`tab-panel-${id}`}
                onClick={() => setActiveTab(id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold font-heading transition-all duration-150"
                style={{
                  backgroundColor: activeTab === id ? 'var(--color-surface)' : 'transparent',
                  color: activeTab === id ? 'var(--color-primary)' : 'var(--color-foreground-muted)',
                  boxShadow: activeTab === id ? 'var(--shadow-sm)' : 'none',
                  border: activeTab === id ? '1px solid var(--color-border)' : '1px solid transparent',
                }}
              >
                <Icon size={15} weight={activeTab === id ? 'fill' : 'regular'} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Drug names */}
          <div
            id="tab-panel-text"
            role="tabpanel"
            aria-labelledby="tab-text"
            hidden={activeTab !== 'text'}
          >
            <label
              htmlFor="drug-input-field"
              className="block font-semibold font-heading mb-1.5"
              style={{ color: 'var(--color-foreground)', fontSize: '0.9375rem' }}
            >
              Your medicines
            </label>
            <p className="text-xs font-body mb-3" style={{ color: 'var(--color-foreground-subtle)' }}>
              Add 2 or more drugs to check for interactions
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex-1 min-w-0">
                <DrugInput
                  value={drugInput}
                  onChange={setDrugInput}
                  drugSuggestions={drugSuggestions}
                />
              </div>
              <VoiceInputButton
                onTranscript={(text) => setDrugInput(text.replace(/\s+and\s+/gi, ', '))}
                disabled={loading}
              />
            </div>

            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn-primary w-full mt-5 py-3.5"
              aria-label="Check drug interactions"
            >
              {loading
                ? <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Checking…
                  </>
                : <>
                    <ShieldCheck size={18} weight="fill" aria-hidden="true" />
                    Check Interaction
                    <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </>
              }
            </button>
          </div>

          {/* Tab: Image scan */}
          <div
            id="tab-panel-image"
            role="tabpanel"
            aria-labelledby="tab-image"
            hidden={activeTab !== 'image'}
            ref={imageSectionRef}
          >
            <label
              className="block font-semibold font-heading mb-1.5"
              style={{ color: 'var(--color-foreground)', fontSize: '0.9375rem' }}
            >
              Upload prescription or medicine image
            </label>
            <p className="text-xs font-body mb-3" style={{ color: 'var(--color-foreground-subtle)' }}>
              Photo of pill bottle, prescription, or label. Requires GEMINI_API_KEY.
            </p>

            <ImageUpload onFileSelect={setImageFile} disabled={loading} />

            <button
              onClick={handleCheckFromImage}
              disabled={loading || !imageFile}
              className="btn-primary w-full mt-5 py-3.5"
              aria-label="Check interactions from uploaded image"
            >
              {loading
                ? <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Scanning image…
                  </>
                : <>
                    <ImageIcon size={18} weight="fill" aria-hidden="true" />
                    Scan &amp; Check
                  </>
              }
            </button>
          </div>
        </div>

        {/* ---- Empty state: examples ---- */}
        {emptyState && (
          <div className="card p-6 sm:p-7 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Flask size={16} weight="fill" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
              <h2 className="text-sm font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>
                Try these examples
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              {EXAMPLE_COMBOS.map(({ drugs, label, risk, note }) => {
                const dot = RISK_DOT[risk]
                return (
                  <button
                    key={label}
                    type="button"
                    role="listitem"
                    onClick={() => setDrugInput(drugs.join(', '))}
                    className="flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-150 group"
                    style={{
                      backgroundColor: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-border)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-primary-light)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)' }}
                    aria-label={`Try ${label}: ${note}`}
                  >
                    <span
                      className="flex-shrink-0 w-2 h-2 rounded-full mt-1.5"
                      style={{ backgroundColor: dot.bg }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>
                        {label}
                      </p>
                      <p className="text-xs font-body mt-0.5" style={{ color: dot.text }}>
                        {note}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ---- Error state ---- */}
        {error && !loading && (
          <div
            className="flex items-start gap-3 p-4 rounded-xl mb-6 animate-fade-in"
            role="alert"
            style={{
              backgroundColor: 'var(--color-dangerous-bg)',
              border: '1px solid var(--color-dangerous-border)',
            }}
          >
            <Warning
              size={18}
              weight="fill"
              style={{ color: 'var(--color-dangerous)', flexShrink: 0, marginTop: 2 }}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold font-heading" style={{ color: 'var(--color-dangerous)' }}>
                Error
              </p>
              <p className="text-sm font-body mt-0.5" style={{ color: 'var(--color-foreground-muted)' }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ---- Loading skeleton ---- */}
        {loading && (
          <div className="mb-6 space-y-4 animate-fade-in" aria-busy="true" aria-label="Loading interaction check">
            <ResultSkeleton />
          </div>
        )}

        {/* ---- History ---- */}
        {history.length > 0 && !hasResult && !loading && (
          <div className="mb-6">
            <SearchHistory
              history={history}
              onSelect={handleHistorySelect}
              onClear={() => { clearHistory(); setHistory([]) }}
            />
          </div>
        )}

        {/* ======================================================
            RESULTS SECTION
            ====================================================== */}
        {hasResult && (
          <section
            ref={resultsRef}
            aria-label="Interaction check results"
            aria-live="polite"
          >
            {/* Detected drugs pill */}
            {result.detected_drugs?.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl mb-4 animate-fade-in"
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid rgba(8,145,178,0.2)',
                }}
              >
                <Info size={14} weight="fill" style={{ color: 'var(--color-primary)', flexShrink: 0 }} aria-hidden="true" />
                <span className="text-sm font-semibold font-heading" style={{ color: 'var(--color-primary)' }}>
                  Detected:
                </span>
                {result.detected_drugs.map((drug) => (
                  <span key={drug} className="drug-chip">{drug}</span>
                ))}
              </div>
            )}

            {/* Results stack */}
            <div className="space-y-4">
              <div className="animate-risk-enter" style={{ animationDelay: '0ms' }}>
                <RiskStatusCard risk={result.risk} />
              </div>
              <div className="animate-risk-enter" style={{ animationDelay: '80ms' }}>
                <RiskMeter risk={result.risk} />
              </div>
              <div className="animate-risk-enter" style={{ animationDelay: '160ms' }}>
                <ResultMessageCard
                  message={result.message}
                  aiExplanation={result.ai_explanation}
                  risk={result.risk}
                />
              </div>
              <div className="animate-risk-enter" style={{ animationDelay: '240ms' }}>
                <ClinicalGuidanceCard
                  drugs={lastCheckedDrugs.length >= 1 ? lastCheckedDrugs : (result.detected_drugs || [])}
                  severity={result.risk}
                />
              </div>
            </div>

            {/* Try another */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => { setResult(null); setError(null); setDrugInput(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="btn-secondary text-sm px-5 py-2.5"
              >
                <ArrowRight size={14} weight="bold" style={{ transform: 'rotate(180deg)' }} aria-hidden="true" />
                Check another combination
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
