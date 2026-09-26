/**
 * Redesigned DrugInput — chip-based multi-drug selector with autocomplete.
 * WCAG-friendly, keyboard accessible, debounced suggestions.
 */
import { useState, useRef, useEffect } from 'react'
import { X, MagnifyingGlass, CaretDown } from '@phosphor-icons/react'

const SAMPLE_DRUGS = ['Paracetamol', 'Ibuprofen', 'Aspirin', 'Warfarin', 'Metformin', 'Amoxicillin', 'Lisinopril', 'Atorvastatin']

export default function DrugInput({ value, onChange, drugSuggestions = [] }) {
  const allDrugs = drugSuggestions.length ? drugSuggestions : SAMPLE_DRUGS

  // Parse value string → chips array
  const parseChips = (str) =>
    str ? str.split(/[,;]/).map((s) => s.trim()).filter(Boolean) : []

  const [chips, setChips] = useState(() => parseChips(value))
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const listboxId = 'drug-listbox'

  // Sync external value → chips (when parent resets)
  useEffect(() => {
    const ext = parseChips(value)
    setChips(ext)
  }, [value])

  // Emit change as comma-separated string
  const emit = (newChips) => {
    onChange(newChips.join(', '))
  }

  // Filtered suggestions: exclude already-selected, match current input
  const query = inputValue.trim().toLowerCase()
  const suggestions = allDrugs
    .filter((d) => !chips.some((c) => c.toLowerCase() === d.toLowerCase()))
    .filter((d) => !query || d.toLowerCase().includes(query))
    .slice(0, 8)

  const addChip = (drug) => {
    const trimmed = drug.trim()
    if (!trimmed) return
    if (chips.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return
    const newChips = [...chips, trimmed]
    setChips(newChips)
    emit(newChips)
    setInputValue('')
    setShowSuggestions(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  const removeChip = (idx) => {
    const newChips = chips.filter((_, i) => i !== idx)
    setChips(newChips)
    emit(newChips)
    inputRef.current?.focus()
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        addChip(suggestions[activeIndex])
      } else if (inputValue.trim()) {
        addChip(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && chips.length) {
      removeChip(chips.length - 1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Chip + input container */}
      <div
        className="min-h-[52px] w-full flex flex-wrap gap-2 items-center px-3 py-2.5 rounded-[var(--radius-lg)] transition-all cursor-text"
        style={{
          border: showSuggestions
            ? '1.5px solid var(--color-primary)'
            : '1.5px solid var(--color-border-strong)',
          backgroundColor: 'var(--color-surface)',
          boxShadow: showSuggestions ? '0 0 0 3px rgba(8,145,178,0.12)' : 'none',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Search icon */}
        <MagnifyingGlass
          size={16}
          weight="regular"
          aria-hidden="true"
          style={{ color: 'var(--color-foreground-subtle)', flexShrink: 0 }}
        />

        {/* Drug chips */}
        {chips.map((chip, idx) => (
          <span
            key={chip + idx}
            className="drug-chip"
            style={{ fontFamily: 'Noto Sans, sans-serif' }}
          >
            {chip}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeChip(idx) }}
              className="flex items-center justify-center rounded-full transition-colors"
              style={{
                width: 16, height: 16,
                color: 'var(--color-primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`Remove ${chip}`}
            >
              <X size={11} weight="bold" />
            </button>
          </span>
        ))}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={chips.length === 0 ? 'Type a drug name and press Enter…' : 'Add another drug…'}
          className="flex-1 min-w-[140px] outline-none bg-transparent text-sm"
          style={{
            color: 'var(--color-foreground)',
            fontFamily: 'Noto Sans, sans-serif',
            border: 'none',
            padding: '2px 0',
          }}
          aria-label="Drug name input"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `drug-option-${activeIndex}` : undefined}
          aria-expanded={showSuggestions && suggestions.length > 0}
        />
      </div>

      {/* Hint */}
      <p className="mt-1.5 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
        Type a name and press <kbd className="px-1 py-0.5 rounded text-[10px] font-mono" style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)' }}>Enter</kbd> to add. Backspace removes last.
        {chips.length >= 2 && (
          <span className="ml-1.5" style={{ color: 'var(--color-accent)' }}>
            ✓ {chips.length} drugs selected
          </span>
        )}
      </p>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Drug suggestions"
          className="absolute left-0 right-0 mt-1 py-1.5 z-20 overflow-auto"
          style={{
            top: '100%',
            maxHeight: 220,
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <li className="px-3 pb-1" aria-hidden="true">
            <span className="section-label">Suggestions</span>
          </li>
          {suggestions.map((drug, i) => (
            <li
              key={drug}
              id={`drug-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer text-sm transition-colors"
              style={{
                color: i === activeIndex ? 'var(--color-primary)' : 'var(--color-foreground)',
                backgroundColor: i === activeIndex ? 'var(--color-primary-light)' : 'transparent',
                fontFamily: 'Noto Sans, sans-serif',
              }}
              onMouseDown={(e) => { e.preventDefault(); addChip(drug) }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <MagnifyingGlass size={13} weight="regular" aria-hidden="true" style={{ color: 'var(--color-foreground-subtle)' }} />
              {drug}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
