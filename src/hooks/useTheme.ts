import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'
// Keep in sync with --canvas in index.css and the inline script in index.html.
const THEME_COLORS: Record<Theme, string> = {
  light: '#f3f1ec',
  dark: '#15151d',
}

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[theme])
}

function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

// The class on <html> is the source of truth, so it is treated as an external
// store. The inline script in index.html sets it before first paint.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  // Follow the OS setting until the visitor picks a theme explicitly.
  const query = matchMedia(DARK_QUERY)
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (readStoredTheme() === null) applyTheme(event.matches ? 'dark' : 'light')
  }
  query.addEventListener('change', onSystemChange)

  return () => {
    observer.disconnect()
    query.removeEventListener('change', onSystemChange)
  }
}

/** `null` during prerender and hydration, when the theme isn't known yet. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null)

  const toggleTheme = useCallback(() => {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the toggle still works.
    }
  }, [])

  return { theme, toggleTheme }
}
