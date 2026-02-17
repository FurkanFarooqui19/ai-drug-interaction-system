/**
 * Sticky navbar: logo, nav links, dark mode toggle, mobile hamburger.
 */
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/scan', label: 'Scan Prescription' },
  { to: '/history', label: 'History' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/drug-info', label: 'Drug Info' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isDark, toggle } = useTheme()
  const location = useLocation()

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm transition-shadow dark:bg-slate-900/95 dark:border-slate-700/80"
      style={{ scrollMarginTop: 0 }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-slate-800 dark:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-medical text-white text-lg font-bold shadow">
            D
          </span>
          <span className="font-semibold text-lg hidden sm:inline">DrugCheck</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <span className="text-lg">☀️</span>
            ) : (
              <span className="text-lg">🌙</span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 md:hidden dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-700 dark:bg-slate-900">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    active
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
