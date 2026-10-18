/**
 * Resolves once the hero entrance may start: fonts are in and, on a first
 * visit, the preloader has begun to lift. index.html marks the moment with
 * `html.motion-ready`.
 */
export function whenMotionReady(): Promise<void> {
  const root = document.documentElement
  if (root.classList.contains('motion-ready')) return Promise.resolve()
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (!root.classList.contains('motion-ready')) return
      observer.disconnect()
      resolve()
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
  })
}

