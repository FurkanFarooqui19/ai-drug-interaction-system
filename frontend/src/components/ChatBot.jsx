/**
 * Redesigned ChatBot — polished medical assistant floating widget.
 * Clear disclaimer, accessible, keyboard friendly, SVG icons.
 */
import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../api'
import { ChatTeardrop, X, PaperPlaneTilt, ShieldCheck } from '@phosphor-icons/react'

const DISCLAIMER = 'This assistant provides general information only — not medical advice, diagnosis, or prescriptions. Always consult a doctor or pharmacist.'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      // Small delay for panel to mount before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      const reply = await sendChatMessage(text)
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    } catch (err) {
      const msg = err.message || 'Something went wrong.'
      const is404 = msg.toLowerCase().includes('not found')
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: is404
          ? 'Chat service is not available. Make sure the backend is running on port 8000 with the /chat endpoint.'
          : `Sorry, I couldn't answer that. ${msg}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* FAB trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          boxShadow: '0 4px 16px rgba(8,145,178,0.4)',
          transform: open ? 'scale(0.92)' : 'scale(1)',
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.transform = 'scale(1.06)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = open ? 'scale(0.92)' : 'scale(1)' }}
        aria-label={open ? 'Close medical assistant' : 'Open medical assistant'}
        aria-expanded={open}
        aria-controls="chatbot-panel"
      >
        {open
          ? <X size={20} weight="bold" />
          : <ChatTeardrop size={22} weight="fill" />
        }
      </button>

      {/* Chat panel */}
      <div
        id="chatbot-panel"
        className={`fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-sm rounded-2xl overflow-hidden ${
          open ? 'animate-chat-up' : 'opacity-0 pointer-events-none translate-y-3'
        }`}
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
        }}
        role="dialog"
        aria-label="Medical assistant chat"
        aria-modal="false"
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{
            background: 'var(--color-primary)',
            flexShrink: 0,
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            aria-hidden="true"
          >
            <ShieldCheck size={16} weight="fill" color="#fff" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold font-heading text-white">Medical Assistant</p>
            <p className="text-xs font-body" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Drug safety information only
            </p>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div
          className="px-4 py-2.5 flex items-start gap-2"
          style={{
            backgroundColor: 'var(--color-moderate-bg)',
            borderBottom: '1px solid var(--color-moderate-border)',
            flexShrink: 0,
          }}
          role="note"
          aria-label="Important disclaimer"
        >
          <span className="text-xs leading-relaxed font-body" style={{ color: 'var(--color-moderate)' }}>
            ⓘ {DISCLAIMER}
          </span>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
          style={{
            minHeight: 220,
            maxHeight: 280,
            backgroundColor: 'var(--color-surface-raised)',
          }}
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
        >
          {messages.length === 0 && !loading && (
            <div className="text-center py-6 px-4">
              <ShieldCheck size={32} weight="light" style={{ color: 'var(--color-foreground-subtle)', margin: '0 auto 8px' }} aria-hidden="true" />
              <p className="text-sm font-body" style={{ color: 'var(--color-foreground-muted)' }}>
                Ask about drug interactions, safety, or general medicine questions.
              </p>
              <div className="mt-3 flex flex-col gap-1.5">
                {[
                  'Can I take paracetamol with ibuprofen?',
                  'What does drug interaction mean?',
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setInput(q)}
                    className="text-xs px-3 py-2 rounded-lg text-left transition-colors font-body"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[85%] px-4 py-2.5 text-sm rounded-2xl font-body"
                style={
                  m.role === 'user'
                    ? {
                        backgroundColor: 'var(--color-primary)',
                        color: '#fff',
                        borderBottomRightRadius: '4px',
                      }
                    : {
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-foreground)',
                        border: '1px solid var(--color-border)',
                        borderBottomLeftRadius: '4px',
                      }
                }
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className="flex items-center gap-1 px-4 py-3 rounded-2xl"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderBottomLeftRadius: '4px',
                }}
                aria-label="AI is typing"
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`block w-1.5 h-1.5 rounded-full animate-dot-${i + 1}`}
                    style={{ backgroundColor: 'var(--color-foreground-subtle)' }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className="flex gap-2 p-3"
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about medicines…"
            disabled={loading}
            className="input-field flex-1 text-sm py-2.5"
            style={{ minHeight: 40 }}
            aria-label="Message to medical assistant"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-primary px-3 py-2.5 rounded-xl flex-shrink-0"
            aria-label="Send message"
            style={{ minWidth: 40 }}
          >
            <PaperPlaneTilt size={16} weight="fill" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  )
}
