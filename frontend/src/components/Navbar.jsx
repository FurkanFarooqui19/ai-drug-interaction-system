/**
 * Redesigned Navbar — clean healthcare SaaS aesthetic.
 * Figtree font, shield logo, accessible dark mode toggle.
 */
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import {
  ShieldCheck, List, X, Sun, Moon,
} from '@phosphor-icons/react'

const NAV_ITEMS = [
  { to: '/', label: 'Checker' },
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
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 0 var(--color-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: isDark
          ? 'rgba(19, 31, 53, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 font-heading font-bold text-lg"
          style={{ color: 'var(--color-foreground)', textDecoration: 'none' }}
          aria-label="DrugCheck home"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'var(--color-primary)' }}
            aria-hidden="true"
          >
            <ShieldCheck size={20} weight="fill" color="#fff" />
          </span>
          <span className="hidden sm:inline" style={{ letterSpacing: '-0.02em' }}>DrugCheck</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors font-body"
                style={{
                  color: active ? 'var(--color-primary)' : 'var(--color-foreground-muted)',
                  backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                  textDecoration: 'none',
                }}
                aria-current={active ? 'page' : undefined}
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
            className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg p-0"
            style={{
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-raised)',
            }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark
              ? <Sun size={16} weight="bold" style={{ color: 'var(--color-foreground-muted)' }} />
              : <Moon size={16} weight="bold" style={{ color: 'var(--color-foreground-muted)' }} />
            }
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
            style={{
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-raised)',
              color: 'var(--color-foreground-muted)',
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
          className="px-4 py-3 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium font-body transition-colors"
                  style={{
                    color: active ? 'var(--color-primary)' : 'var(--color-foreground-muted)',
                    backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                    textDecoration: 'none',
                  }}
                  aria-current={active ? 'page' : undefined}
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
