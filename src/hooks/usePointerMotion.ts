import { useEffect, type RefObject } from 'react'

/** Hover-driven effects only make sense with a mouse and without reduced motion. */
function pointerEffectsEnabled(): boolean {
  return (
    matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Attaches a pointer-tracking transform to `ref`. `transform` receives the
 * cursor position relative to the element's centre, each in -0.5…0.5, and
 * returns a CSS transform. The transform is cleared when the pointer leaves.
 */
export function usePointerMotion(
  ref: RefObject<HTMLElement | null>,
  transform: (x: number, y: number, rect: DOMRect) => string,
) {
  useEffect(() => {
    const element = ref.current
    if (!element || !pointerEffectsEnabled()) return

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      element.style.transform = transform(x, y, rect)
    }
    const onLeave = () => {
      element.style.transform = ''
    }

    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerleave', onLeave)
    return () => {
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
      element.style.transform = ''
    }
  }, [ref, transform])
}
