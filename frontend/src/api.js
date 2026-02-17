/**
 * API service for Drug Interaction backend.
 * In dev, call backend directly to avoid proxy 404s. In build, use same origin (or set VITE_API_URL).
 */
const API_BASE = typeof import.meta !== 'undefined' && import.meta.env?.DEV
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8000')
  : (import.meta.env?.VITE_API_URL || '')

export async function checkInteractions(drugs) {
  const res = await fetch(`${API_BASE}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drugs }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || res.statusText)
  }
  return res.json()
}

export async function fetchDrugList() {
  const res = await fetch(`${API_BASE}/drugs`)
  if (!res.ok) throw new Error('Failed to load drug list')
  const data = await res.json()
  return data.drugs || []
}

/** Upload image of medicine; returns same shape as checkInteractions (risk, message, ai_explanation, detected_drugs). */
export async function checkFromImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_BASE}/check-from-image`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || res.statusText)
  }
  return res.json()
}

/** Medical chatbot: send message, get AI reply. */
export async function sendChatMessage(message) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || res.statusText)
  }
  const data = await res.json()
  return data.reply
}
