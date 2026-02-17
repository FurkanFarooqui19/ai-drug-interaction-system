/**
 * Dark mode: persist in localStorage, apply class to document.
 */
import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'drug-app-theme'
const ThemeContext = createContext({ isDark: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem(KEY)
    if (stored !== null) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try { localStorage.setItem(KEY, isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  const toggle = () => setIsDark((v) => !v)

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
