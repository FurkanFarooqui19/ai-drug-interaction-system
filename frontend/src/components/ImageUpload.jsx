/**
 * Image upload zone for medicine photos (pill bottle, prescription, label).
 * Drag-drop and file picker.
 */
import { useState, useRef } from 'react'

export default function ImageUpload({ onFileSelect, disabled }) {
  const [preview, setPreview] = useState(null)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    onFileSelect(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target?.files?.[0]
    if (file) handleFile(file)
  }

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        aria-label="Upload medicine image"
      />
      {preview ? (
        <div className="relative rounded-xl border-2 border-slate-200 dark:border-slate-600 overflow-hidden bg-slate-50 dark:bg-slate-800">
          <img
            src={preview}
            alt="Uploaded medicine"
            className="w-full h-40 object-contain"
          />
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-800/80 text-white text-sm hover:bg-slate-700 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          className={`
            w-full rounded-xl border-2 border-dashed py-8 px-4 text-slate-600 dark:text-slate-400
            transition cursor-pointer
            ${drag ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-800'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span className="block text-4xl mb-2">📷</span>
          <span className="font-medium">Drop image here or click to upload</span>
          <span className="block text-sm mt-1 text-slate-500">Pill bottle, prescription, or medicine label</span>
        </button>
      )}
    </div>
  )
}
