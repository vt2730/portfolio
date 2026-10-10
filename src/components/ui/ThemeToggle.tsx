import { useTheme } from '../../hooks/useTheme'
import { Icon } from './Icon'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const label =
    theme === null
      ? 'Toggle theme'
      : `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`

  // Icons switch via the `dark` class so they are correct before hydration.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface hover:text-ink"
    >
      <Icon name="moon" className="size-[18px] dark:hidden" />
      <Icon name="sun" className="hidden size-[18px] dark:block" />
    </button>
  )
}
