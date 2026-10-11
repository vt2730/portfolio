import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

/** Viewport point a theme change spreads from, e.g. the toggle's centre. */
export interface ThemeOrigin {
  x: number
  y: number
}

const STORAGE_KEY = 'theme'
// Keep in sync with --canvas in index.css and the inline script in index.html.
const THEME_COLORS: Record<Theme, string> = {
  light: '#fafafa',
  dark: '#0a0d12',
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

let latestTransition: ViewTransition | null = null

/**
 * Runs `commit` inside a view transition that reveals the new theme in a
 * circle growing from `origin` to the farthest corner. Colour transitions
 * are paused meanwhile (see index.css) so the new theme is captured settled.
 */
function revealTheme(commit: () => void, { x, y }: ThemeOrigin) {
  const root = document.documentElement
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  root.setAttribute('data-theme-switching', '')
  const transition = document.startViewTransition(commit)
  latestTransition = transition
  // A quick second toggle skips this transition; leave the flag to it.
  const done = () => {
    if (latestTransition === transition) {
      root.removeAttribute('data-theme-switching')
    }
  }
  transition.ready.then(
    () =>
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      ),
    // Skipped transitions (e.g. a rapid second toggle) still commit.
    () => {},
  )
  transition.finished.then(done, done)
}

// The class on <html> is the source of truth, so it is treated as an external
// store. The inline script in index.html sets it before first paint; the site
// is dark by default and only switches when the visitor picks light.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

/** `null` during prerender and hydration, when the theme isn't known yet. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null)

  const toggleTheme = useCallback((origin?: ThemeOrigin) => {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
    const commit = () => {
      applyTheme(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Storage can be unavailable (private mode); the toggle still works.
      }
    }

    if (
      origin &&
      'startViewTransition' in document &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      revealTheme(commit, origin)
    } else {
      commit()
    }
  }, [])

  return { theme, toggleTheme }
}
