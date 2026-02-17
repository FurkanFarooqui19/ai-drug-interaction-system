/**
 * Multi-drug input with optional autocomplete suggestions
 */
import { useState, useRef, useEffect } from 'react'

const SAMPLE_DRUGS = ['Paracetamol', 'Ibuprofen', 'Aspirin', 'Warfarin', 'Metformin', 'Amoxicillin']

export default function DrugInput({ value, onChange, drugSuggestions = [], placeholder = 'Enter drug names (e.g. Paracetamol, Ibuprofen)' }) {
  const [inputValue, setInputValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const suggestions = (drugSuggestions.length ? drugSuggestions : SAMPLE_DRUGS).filter((d) =>
    d.toLowerCase().includes((inputValue || '').trim().toLowerCase())
  ).slice(0, 8)

  const getDrugsFromInput = (str) =>
    str
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean)

  const handleChange = (e) => {
    const v = e.target.value
    setInputValue(v)
    onChange(getDrugsFromInput(v).join(', '))
    setShowSuggestions(true)
    setActiveIndex(-1)
  }

  const handleSelect = (drug) => {
    const current = getDrugsFromInput(inputValue)
    const rest = current.filter((d) => d.toLowerCase() !== drug.toLowerCase())
    const next = [...rest, drug].join(', ')
    setInputValue(next)
    onChange(next)
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault()
      handleSelect(suggestions[activeIndex])
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition text-slate-800 placeholder-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
        aria-autocomplete="list"
        aria-expanded={showSuggestions && suggestions.length > 0}
      />
      {showSuggestions && inputValue && suggestions.length > 0 && (
        <ul
          className="absolute z-10 w-full mt-1 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 shadow-lg max-h-48 overflow-auto"
          role="listbox"
        >
          {suggestions.map((drug, i) => (
            <li
              key={drug}
              role="option"
              aria-selected={i === activeIndex}
              className={`px-4 py-2 cursor-pointer ${i === activeIndex ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              onMouseDown={() => handleSelect(drug)}
            >
              {drug}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
