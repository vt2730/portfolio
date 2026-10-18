import { useSyncExternalStore } from 'react'
import { getTheme, setTheme, watchRoot, type Theme } from '../lib/preferences'

/** Viewport point a theme change spreads from, e.g. the toggle's centre. */
export interface ThemeOrigin {
  x: number
  y: number
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

/** Flips the theme, revealing it from `origin` where motion is welcome. */
export function toggleTheme(origin?: ThemeOrigin) {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
  const commit = () => setTheme(next)

  if (
    origin &&
    'startViewTransition' in document &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    revealTheme(commit, origin)
  } else {
    commit()
  }
}

// data-theme on <html> is the source of truth, so it is treated as an
// external store. The inline script in index.html sets it before first paint
// from the stored choice or, failing that, the system preference.
const subscribe = watchRoot('data-theme')

/** `null` during prerender and hydration, when the theme isn't known yet. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null)
  return { theme, toggleTheme }
}
