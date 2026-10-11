import { useEffect } from 'react'

const PENDING =
  '[data-reveal]:not([data-visible]), [data-inview]:not([data-visible])'

/**
 * Reveals every `[data-reveal]` element once it scrolls into view by setting
 * `data-visible`. One observer serves the whole page, so components only need
 * to add the attribute (and optionally `--reveal-delay` for staggering).
 *
 * `[data-inview]` elements get the same flag with no styling of their own, so
 * components can choreograph their children. It is set a little later — once
 * the element clears the bottom fifth of the viewport — so the entrance plays
 * where it can be seen.
 *
 * Elements are hidden only under `html.js` (see index.css), so prerendered
 * markup stays visible when scripts are disabled.
 */
export function useReveal() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Tabbing scrolls a control only just into view, which may not be far
    // enough to reveal it, so focus reveals everything around it at once.
    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      for (
        let element = event.target.closest(PENDING);
        element;
        element = element.parentElement?.closest(PENDING) ?? null
      ) {
        element.setAttribute('data-visible', '')
      }
    }

    const observe = (selector: string, options: IntersectionObserverInit) => {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-visible', '')
          observer.unobserve(entry.target)
        }
      }, options)

      document
        .querySelectorAll<HTMLElement>(`${selector}:not([data-visible])`)
        .forEach((element) => observer.observe(element))
      return observer
    }

    const observers = [
      observe('[data-reveal]', {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1,
      }),
      // No ratio threshold: stack maps can be far wider than their scroller.
      observe('[data-inview]', { rootMargin: '0px 0px -20% 0px' }),
    ]
    document.addEventListener('focusin', onFocusIn)

    return () => {
      observers.forEach((observer) => observer.disconnect())
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [])
}
