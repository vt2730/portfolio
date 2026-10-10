import { useEffect } from 'react'

/**
 * Reveals every `[data-reveal]` element once it scrolls into view by setting
 * `data-visible`. One observer serves the whole page, so components only need
 * to add the attribute (and optionally `--reveal-delay` for staggering).
 *
 * Elements are hidden only under `html.js` (see index.css), so prerendered
 * markup stays visible when scripts are disabled.
 */
export function useReveal() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-visible', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    document
      .querySelectorAll<HTMLElement>('[data-reveal]:not([data-visible])')
      .forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])
}
