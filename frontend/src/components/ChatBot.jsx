/**
 * Floating medical chatbot widget. Bottom-right, open/close, scrollable chat, send with Enter.
 */
import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../api'

const EMPTY_MESSAGE = 'Ask anything about medicines or drug safety. I’ll keep it simple and suggest you check with a doctor when needed.'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      const reply = await sendChatMessage(text)
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    } catch (err) {
      const msg = err.message || 'Something went wrong.'
      setError(msg)
      const is404 = msg.toLowerCase().includes('not found')
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: is404
          ? 'Chat service isn’t available. Make sure the backend is running (uvicorn on port 8000) and has the /chat endpoint, then try again.'
          : `Sorry, I couldn’t answer that. ${msg}`
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
      {/* Toggle button - bottom right */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        title={open ? 'Close chat' : 'Open medical chat'}
        aria-label={open ? 'Close chat' : 'Open medical chat'}
      >
        <span className="text-2xl" aria-hidden>{open ? '✕' : '💬'}</span>
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-600 overflow-hidden transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
        }`}
      >
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-3">
          <h3 className="font-semibold">Medical assistant</h3>
          <p className="text-white/90 text-xs mt-0.5">Ask about medicines & drug safety</p>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900/80 flex flex-col gap-3">
          {messages.length === 0 && !loading && (
            <div className="text-slate-500 dark:text-slate-400 text-sm text-center py-4 px-2">
              {EMPTY_MESSAGE}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === 'user'
                    ? 'bg-sky-600 text-white rounded-br-md'
                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-bl-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl rounded-bl-md px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
                AI is typing…
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error hint */}
        {error && (
          <div className="px-3 py-1.5 bg-red-50 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about medicines..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-700 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
