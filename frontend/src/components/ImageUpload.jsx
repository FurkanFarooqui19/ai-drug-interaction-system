/**
 * Redesigned ImageUpload — clean drag-drop zone with SVG icon.
 */
import { useState, useRef } from 'react'
import { ImageSquare, X, Upload } from '@phosphor-icons/react'

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
        id="medicine-image-upload"
        aria-label="Upload medicine image"
        disabled={disabled}
      />

      {preview ? (
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            border: '1.5px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-raised)',
          }}
        >
          <img
            src={preview}
            alt="Uploaded medicine"
            className="w-full h-44 object-contain p-2"
          />
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-colors"
            style={{
              backgroundColor: 'rgba(15,23,42,0.75)',
              color: '#fff',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Remove uploaded image"
          >
            <X size={12} weight="bold" aria-hidden="true" />
            Remove
          </button>
        </div>
      ) : (
        <label
          htmlFor="medicine-image-upload"
          className={`block w-full rounded-xl py-10 px-6 text-center cursor-pointer transition-all duration-150`}
          style={{
            border: `2px dashed ${drag ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
            backgroundColor: drag ? 'var(--color-primary-light)' : 'var(--color-surface-raised)',
            opacity: disabled ? 0.55 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onDragOver={(e) => { if (!disabled) { e.preventDefault(); setDrag(true) } }}
          onDragLeave={() => setDrag(false)}
          onDrop={!disabled ? handleDrop : undefined}
          aria-describedby="upload-hint"
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-3"
            style={{
              backgroundColor: drag ? 'var(--color-primary)' : 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
            }}
            aria-hidden="true"
          >
            {drag
              ? <Upload size={22} weight="fill" color="white" />
              : <ImageSquare size={22} weight="regular" style={{ color: 'var(--color-foreground-subtle)' }} />
            }
          </div>
          <p className="text-sm font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>
            {drag ? 'Drop to upload' : 'Drop image here or click to browse'}
          </p>
          <p id="upload-hint" className="mt-1 text-xs font-body" style={{ color: 'var(--color-foreground-subtle)' }}>
            Pill bottle, prescription, or medicine label · Max 10 MB
          </p>
        </label>
      )}
    </div>
  )
}
