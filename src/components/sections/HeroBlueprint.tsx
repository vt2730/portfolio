import { useEffect, useState, type CSSProperties, type RefObject } from 'react'
import { whenMotionReady } from '../../lib/motion'

interface Box {
  label: string
  left: number
  top: number
  width: number
  height: number
}

interface Plan {
  boxes: Box[]
  /** Horizontal guides, px from the top of the hero. */
  rows: number[]
  /** Vertical guides, px from the left of the hero. */
  cols: number[]
}

// Long enough for the fold-away in index.css (.bp__* animations) to finish.
const LIFETIME = 3900

const unique = (values: number[]) => [...new Set(values.map(Math.round))]

/**
 * Entrance overlay: dashed boxes, labelled with each element's role and
 * size, and guides along their edges — measured from every `[data-bp]`
 * element in the hero, drawn while the hero animates in, then removed.
 */
export function HeroBlueprint({
  heroRef,
}: {
  heroRef: RefObject<HTMLElement | null>
}) {
  const [plan, setPlan] = useState<Plan | null>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // It belongs to the entrance only; skip it if the page opens scrolled.
    if (window.scrollY > innerHeight / 3) return

    let cancelled = false
    let timeout = 0
    // Starts with the rest of the entrance: after the fonts and preloader.
    whenMotionReady().then(() => {
      if (cancelled) return
      const origin = hero.getBoundingClientRect()
      const boxes = [...hero.querySelectorAll<HTMLElement>('[data-bp]')].map(
        (element) => {
          const rect = element.getBoundingClientRect()
          return {
            label: `${element.dataset.bp} · ${Math.round(rect.width)}×${Math.round(rect.height)}`,
            left: rect.left - origin.left,
            top: rect.top - origin.top,
            width: rect.width,
            height: rect.height,
          }
        },
      )
      setPlan({
        boxes,
        rows: unique(boxes.flatMap((box) => [box.top, box.top + box.height])),
        cols: unique(boxes.map((box) => box.left + box.width)),
      })
      timeout = window.setTimeout(() => setPlan(null), LIFETIME)
    })

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [heroRef])

  if (!plan) return null

  return (
    <div aria-hidden="true" className="bp">
      {plan.rows.map((top, index) => (
        <span
          key={`row-${top}`}
          className="bp__guide bp__guide--h"
          style={{ top, '--i': index } as CSSProperties}
        />
      ))}
      {plan.cols.map((left, index) => (
        <span
          key={`col-${left}`}
          className="bp__guide bp__guide--v"
          style={{ left, '--i': index } as CSSProperties}
        />
      ))}
      {plan.boxes.map((box, index) => (
        <div
          key={box.label}
          className="bp__box"
          style={
            {
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
              '--i': index,
            } as CSSProperties
          }
        >
          <span className="bp__label note">{box.label}</span>
        </div>
      ))}
    </div>
  )
}
