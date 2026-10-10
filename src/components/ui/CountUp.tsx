import { useEffect, useRef, type CSSProperties } from 'react'
import { formatNumber } from '../../lib/format'

interface CountUpProps {
  value: number
  /** Text appended after the number, e.g. `%`. */
  suffix?: string
  format?: (value: number) => string
  /** Milliseconds. */
  duration?: number
  className?: string
}

const easeOutQuart = (t: number) => 1 - (1 - t) ** 4

/**
 * Renders the final value (so prerendered HTML and hydration match) and, once
 * scrolled into view, counts up to it from zero. Writes straight to the DOM
 * so the animation never re-renders the tree.
 */
export function CountUp({
  value,
  suffix = '',
  format = formatNumber,
  duration = 1600,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const finalText = `${format(value)}${suffix}`

    const run = (start: number) => (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const current = Math.round(value * easeOutQuart(progress))
      element.textContent =
        progress < 1 ? `${format(current)}${suffix}` : finalText
      if (progress < 1) frame = requestAnimationFrame(run(start))
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        element.textContent = `${format(0)}${suffix}`
        frame = requestAnimationFrame((now) => run(now)(now))
      },
      { threshold: 0.4 },
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      element.textContent = finalText
    }
  }, [value, suffix, format, duration])

  const text = `${format(value)}${suffix}`

  return (
    <span
      ref={ref}
      // Reserve the final width so neighbours don't shuffle while counting.
      style={{ '--count-width': `${text.length}ch` } as CSSProperties}
      className={`count-up ${className ?? ''}`}
    >
      {text}
    </span>
  )
}
