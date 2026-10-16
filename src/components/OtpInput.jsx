import { useRef } from 'react'

export default function OtpInput({ value, onChange, disabled, autoFocus = true }) {
  const refs = useRef([])
  const focus = (i) => refs.current[Math.max(0, Math.min(5, i))]?.focus()

  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    if (!ch) return
    onChange((value.slice(0, i) + ch + value.slice(i + 1)).slice(0, 6))
    focus(i + 1)
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[i]) onChange(value.slice(0, i) + value.slice(i + 1))
      else if (i > 0) { onChange(value.slice(0, i - 1) + value.slice(i)); focus(i - 1) }
    } else if (e.key === 'ArrowLeft') focus(i - 1)
    else if (e.key === 'ArrowRight') focus(i + 1)
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text) { e.preventDefault(); onChange(text); focus(text.length) }
  }

  return (
    <div className="otp-boxes" onPaste={handlePaste}>
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="otp-box"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={2}
          value={value[i] || ''}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  )
}