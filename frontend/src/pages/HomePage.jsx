/**
 * Home: hero + drug checker + image upload + history + results.
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
import LoadingSpinner from '../components/LoadingSpinner'
import Layout, { Card } from '../components/Layout'

export default function HomePage({ scrollToImageSection }) {
  const imageSectionRef = useRef(null)
  const [drugInput, setDrugInput] = useState('')
  const [drugSuggestions, setDrugSuggestions] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [result, setResult] = useState(null)
  const [lastCheckedDrugs, setLastCheckedDrugs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchDrugList().then(setDrugSuggestions).catch(() => setDrugSuggestions([]))
    setHistory(getHistory())
  }, [])
  useEffect(() => {
    if (!scrollToImageSection) return
    const t = setTimeout(() => {
      imageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
    return () => clearTimeout(t)
  }, [scrollToImageSection])

  const handleCheck = async () => {
    const drugs = drugInput.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    setError(null)
    setResult(null)
    if (drugs.length < 2) {
      setError('Please enter at least two drug names.')
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
      setError(err.message || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckFromImage = async () => {
    if (!imageFile) {
      setError('Please upload an image first.')
      return
    }
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const data = await checkFromImage(imageFile)
      setResult(data)
      const drugs = data.detected_drugs && data.detected_drugs.length >= 2 ? data.detected_drugs : null
      if (drugs) {
        setLastCheckedDrugs(drugs)
        addToHistory(drugs, data.risk, true)
        setHistory(getHistory())
      } else if (data.detected_drugs?.length) {
        setLastCheckedDrugs(data.detected_drugs)
      }
    } catch (err) {
      setError(err.message || 'Could not process image. Add GEMINI_API_KEY to backend .env.')
    } finally {
      setLoading(false)
    }
  }

  const hasResult = result && !loading
  const emptyState = !hasResult && !loading && !error

  const handleHistorySelect = (drugs) => {
    setDrugInput(drugs.join(', '))
    setError(null)
    setResult(null)
    if (drugs.length >= 2) {
      setLoading(true)
      checkInteractions(drugs)
        .then((data) => {
          setResult(data)
          addToHistory(drugs, data.risk)
          setHistory(getHistory())
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-medical text-white py-12 px-4 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl md:text-5xl">
            Drug Interaction Checker
          </h1>
          <p className="mt-3 text-lg text-white/90 sm:text-xl">
            Enter your medicines — we'll warn you about dangerous combinations
          </p>
        </div>
      </section>

      <Layout>
        {/* Input card */}
        <Card className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Your medicines
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="flex-1 min-w-0">
              <DrugInput
                value={drugInput}
                onChange={setDrugInput}
                drugSuggestions={drugSuggestions}
                placeholder="e.g. Paracetamol, Ibuprofen, Aspirin"
              />
            </div>
            <VoiceInputButton
              onTranscript={(text) => setDrugInput(text.replace(/\s+and\s+/gi, ', '))}
              disabled={loading}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Type or use voice. Separate with comma or semicolon.
          </p>
          <button
            onClick={handleCheck}
            disabled={loading}
            className="mt-4 w-full py-3 px-4 rounded-xl bg-gradient-medical text-white font-semibold shadow-lg hover:opacity-95 disabled:opacity-70 transition"
          >
            Check Interaction
          </button>
        </Card>

        {/* Image upload card */}
        <div ref={imageSectionRef}>
        <Card className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Or upload image of medicine
          </label>
          <ImageUpload onFileSelect={setImageFile} disabled={loading} />
          <button
            onClick={handleCheckFromImage}
            disabled={loading || !imageFile}
            className="mt-4 w-full py-3 px-4 rounded-xl bg-slate-700 text-white font-semibold shadow-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            Check from image
          </button>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Photo of pill bottle, prescription or label. Requires GEMINI_API_KEY.
          </p>
        </Card>
        </div>

        {history.length > 0 && (
          <div className="mb-6">
            <SearchHistory history={history} onSelect={handleHistorySelect} onClear={() => { clearHistory(); setHistory([]) }} />
          </div>
        )}

        {loading && (
          <div className="mb-6 space-y-6">
            <ResultSkeleton />
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {emptyState && (
          <Card className="mb-6 text-center py-10">
            <p className="text-slate-600 dark:text-slate-400 text-lg">Enter two or more drugs above and click &quot;Check Interaction&quot;.</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">Try: <strong className="text-slate-800 dark:text-slate-200">Aspirin, Ibuprofen</strong> or <strong className="text-slate-800 dark:text-slate-200">Warfarin, Aspirin</strong></p>
          </Card>
        )}

        {hasResult && (
          <div className="space-y-6">
            {result.detected_drugs?.length > 0 && (
              <div className="animate-risk-enter rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-900/20 px-4 py-3 text-sm text-sky-800 dark:text-sky-200">
                <span className="font-semibold">Detected medicines: </span>
                <span>{result.detected_drugs.join(', ')}</span>
              </div>
            )}
            <div className="animate-risk-enter" style={{ animationFillMode: 'forwards' }}>
              <RiskStatusCard risk={result.risk} />
            </div>
            <div className="animate-risk-enter" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <RiskMeter risk={result.risk} />
            </div>
            <div className="animate-risk-enter" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <ResultMessageCard message={result.message} aiExplanation={result.ai_explanation} risk={result.risk} />
            </div>
            <div className="animate-risk-enter" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <ClinicalGuidanceCard
              drugs={lastCheckedDrugs.length >= 1 ? lastCheckedDrugs : (result.detected_drugs || [])}
              severity={result.risk}
            />
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
