/**
 * Voice input using Web Speech API. Speaks medicine names into the text field.
 * Supported in Chrome, Edge, Safari. Requires HTTPS or localhost.
 */
import { useState, useRef, useEffect } from 'react'

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  return SpeechRecognition ? new SpeechRecognition() : null
}

export default function VoiceInputButton({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const rec = getSpeechRecognition()
    setSupported(!!rec)
    if (!rec) return
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      if (transcript && onTranscript) onTranscript(transcript.trim())
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    return () => {
      try { rec.abort(); } catch {}
    }
  }, [onTranscript])

  const toggle = () => {
    const rec = recognitionRef.current
    if (!rec) return
    if (listening) {
      rec.stop()
      setListening(false)
    } else {
      try {
        rec.start()
        setListening(true)
      } catch (e) {
        setListening(false)
      }
    }
  }

  if (!supported) {
    return (
      <span className="text-xs text-slate-400" title="Voice input not supported in this browser (try Chrome)">
        🎤 Unavailable
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      title={listening ? 'Listening… Click to stop' : 'Speak medicine names'}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition shrink-0
        ${listening
          ? 'border-red-400 bg-red-50 text-red-700 animate-pulse'
          : 'border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50 text-slate-700'}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <span className="text-lg" aria-hidden>{listening ? '🔴' : '🎤'}</span>
      <span className="text-sm font-medium">{listening ? 'Listening…' : 'Voice input'}</span>
    </button>
  )
}
