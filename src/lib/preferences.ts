import { MONOGRAM } from './monogram'

// Visitor preferences live as attributes on <html> (data-theme, data-accent,
// data-grid). The inline script in index.html applies the stored ones before
// first paint; these helpers change them afterwards.

export type Theme = 'light' | 'dark'

export const ACCENTS = ['blue', 'orange', 'lime'] as const
export type Accent = (typeof ACCENTS)[number]

const root = () => document.documentElement

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable (private mode); the change still applies.
  }
}

export function getTheme(): Theme {
  return root().dataset.theme === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme: Theme) {
  root().dataset.theme = theme
  store('theme', theme)
  syncChrome()
}

export function getAccent(): Accent {
  const accent = root().dataset.accent
  return ACCENTS.find((item) => item === accent) ?? 'blue'
}

export function cycleAccent() {
  const next = ACCENTS[(ACCENTS.indexOf(getAccent()) + 1) % ACCENTS.length]
  root().dataset.accent = next
  store('accent', next)
  syncChrome()
}

export function toggleGrid() {
  const element = root()
  element.dataset.grid = element.dataset.grid === 'on' ? 'off' : 'on'
}

/** `subscribe` for useSyncExternalStore, firing when `attribute` changes. */
export function watchRoot(attribute: string) {
  return (onChange: () => void) => {
    const observer = new MutationObserver(onChange)
    observer.observe(root(), { attributes: true, attributeFilter: [attribute] })
    return () => observer.disconnect()
  }
}

/** Repaints the browser chrome — theme-color and favicon — in page colours. */
export function syncChrome() {
  const style = getComputedStyle(root())
  const paper = style.getPropertyValue('--paper').trim()
  const ink = style.getPropertyValue('--ink').trim()
  const accent = style.getPropertyValue('--accent').trim()

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', paper)

  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!icon) return
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -8 80 56"><rect x="-6" y="-8" width="80" height="56" rx="12" fill="${paper}"/><g fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="square">${MONOGRAM.paths
    .map((d) => `<path d="${d}"/>`)
    .join('')}</g><circle cx="${MONOGRAM.dot.cx}" cy="${MONOGRAM.dot.cy}" r="3.4" fill="${accent}"/></svg>`
  icon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`
}
