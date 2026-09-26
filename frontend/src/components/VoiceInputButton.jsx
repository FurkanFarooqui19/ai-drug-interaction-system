/**
 * Redesigned VoiceInputButton — SVG icon, design token styling.
 * Web Speech API. Chrome/Edge/Safari on HTTPS or localhost.
 */
import { useState, useRef, useEffect } from 'react'
import { Microphone, MicrophoneSlash } from '@phosphor-icons/react'

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
    return () => { try { rec.abort() } catch {} }
  }, [onTranscript])

  const toggle = () => {
    const rec = recognitionRef.current
    if (!rec) return
    if (listening) { rec.stop(); setListening(false) }
    else {
      try { rec.start(); setListening(true) }
      catch { setListening(false) }
    }
  }

  if (!supported) {
    return (
      <span
        className="flex items-center gap-1.5 text-xs font-body px-3 py-2.5 rounded-lg flex-shrink-0"
        style={{
          color: 'var(--color-foreground-subtle)',
          border: '1.5px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-raised)',
        }}
        title="Voice input not supported in this browser (try Chrome or Edge)"
      >
        <MicrophoneSlash size={14} weight="regular" aria-hidden="true" />
        <span className="hidden sm:inline">Voice unavailable</span>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      title={listening ? 'Listening… click to stop' : 'Click to speak drug names'}
      aria-label={listening ? 'Stop voice input' : 'Start voice input'}
      aria-pressed={listening}
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-shrink-0 text-sm font-semibold font-body transition-all duration-150"
      style={{
        border: `1.5px solid ${listening ? '#dc2626' : 'var(--color-border-strong)'}`,
        backgroundColor: listening ? 'var(--color-dangerous-bg)' : 'var(--color-surface)',
        color: listening ? 'var(--color-dangerous)' : 'var(--color-foreground-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        animation: listening ? 'none' : undefined,
      }}
    >
      <Microphone
        size={15}
        weight={listening ? 'fill' : 'regular'}
        aria-hidden="true"
        style={{
          color: listening ? 'var(--color-dangerous)' : 'var(--color-foreground-subtle)',
        }}
      />
      <span className="hidden sm:inline">{listening ? 'Listening…' : 'Voice'}</span>
    </button>
  )
}
