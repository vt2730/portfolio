import { useAccent } from '../../hooks/useAccent'
import { useTheme } from '../../hooks/useTheme'
import { cycleAccent } from '../../lib/preferences'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const label =
    theme === null
      ? 'Toggle light / dark theme'
      : `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`

  return (
    <button
      type="button"
      onClick={(event) => {
        // The new theme spreads out from the middle of the button.
        const { left, top, width, height } =
          event.currentTarget.getBoundingClientRect()
        toggleTheme({ x: left + width / 2, y: top + height / 2 })
      }}
      aria-label={label}
      title={label}
      className="tool"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <circle
          cx="10"
          cy="10"
          r="7.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor" />
      </svg>
    </button>
  )
}

export function AccentToggle() {
  const accent = useAccent()
  const label = accent ? `Change accent colour (now ${accent})` : 'Change accent colour'

  return (
    <button
      type="button"
      onClick={cycleAccent}
      aria-label={label}
      title={label}
      className="tool"
    >
      <span aria-hidden="true" className="swatch" />
    </button>
  )
}
