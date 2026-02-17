/**
 * Search history for drug checks. Stored in localStorage.
 */
const STORAGE_KEY = 'drug-interaction-history'
const MAX_ITEMS = 20

/**
 * @typedef {Object} HistoryEntry
 * @property {string[]} drugs
 * @property {string} risk - Safe | Moderate | Dangerous
 * @property {string} date - ISO date string
 * @property {boolean} [fromImage]
 */

/**
 * @returns {HistoryEntry[]}
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Add a completed check to history. Deduplicates by same drug list (case-insensitive).
 * @param {string[]} drugs
 * @param {string} risk
 * @param {boolean} [fromImage]
 */
export function addToHistory(drugs, risk, fromImage = false) {
  if (!drugs?.length) return
  const key = drugs.map((d) => d.trim().toLowerCase()).sort().join(',')
  const entry = {
    drugs: drugs.map((d) => d.trim()).filter(Boolean),
    risk: risk || 'Safe',
    date: new Date().toISOString(),
    fromImage: !!fromImage,
  }
  let list = getHistory()
  list = list.filter((e) => e.drugs.map((d) => d.toLowerCase()).sort().join(',') !== key)
  list.unshift(entry)
  list = list.slice(0, MAX_ITEMS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

/**
 * Clear all history.
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
