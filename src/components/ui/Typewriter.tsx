import { useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string
  /** Text for assistive technology when it should differ from `text`. */
  label?: string
  /** Milliseconds per character, on average. */
  speed?: number
  /** Milliseconds between the caret appearing and the first character. */
  delay?: number
  /** Wait until scrolled into view before typing. */
  onView?: boolean
  className?: string
}

/** The caret lingers this long after the last character. */
const HOLD = 1100

/**
 * Types `text` out character by character behind a blinking caret.
 *
 * The full text is rendered up front (so prerendered HTML and hydration
 * match, and the page reads fine without scripts) and an invisible copy
 * reserves the final size, so nothing around it shifts while typing.
 * Characters are written straight to the DOM so the tree never re-renders.
 *
 * States, set via `data-typewriter` (see index.css): `idle` (text hidden
 * until scripts take over), `typing` (caret shown) and `done`.
 */
export function Typewriter({
  text,
  label,
  speed = 40,
  delay = 0,
  onView = false,
  className,
}: TypewriterProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const liveRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const live = liveRef.current
    if (!root || !live) return

    const finish = () => {
      live.textContent = text
      root.dataset.typewriter = 'done'
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    let timer = 0
    const characters = Array.from(text)

    const type = (count: number) => {
      live.textContent = characters.slice(0, count).join('')
      if (count < characters.length) {
        // Slight jitter keeps the rhythm from feeling mechanical.
        const wait = speed * (0.7 + Math.random() * 0.6)
        timer = window.setTimeout(() => type(count + 1), wait)
      } else {
        timer = window.setTimeout(finish, HOLD)
      }
    }

    const start = () => {
      root.dataset.typewriter = 'typing'
      live.textContent = ''
      timer = window.setTimeout(() => type(1), delay)
    }

    let observer: IntersectionObserver | undefined
    if (onView) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          observer?.disconnect()
          start()
        },
        { threshold: 0.5 },
      )
      observer.observe(root)
    } else {
      start()
    }

    return () => {
      observer?.disconnect()
      clearTimeout(timer)
      finish()
    }
  }, [text, speed, delay, onView])

  return (
    <span
      ref={rootRef}
      data-typewriter="idle"
      className={`typewriter ${className ?? ''}`}
    >
      <span className="sr-only">{label ?? text}</span>
      {/* Reserves the final size so neighbours don't move while typing. */}
      <span aria-hidden="true" className="typewriter-ghost">
        {text}
      </span>
      <span ref={liveRef} aria-hidden="true" className="typewriter-text">
        {text}
      </span>
    </span>
  )
}
